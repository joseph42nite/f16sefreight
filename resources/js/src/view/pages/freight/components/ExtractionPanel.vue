<template>
  <div class="fx-extract">
    <!--
      🔴 THREE SOURCES, ONE RESULT. A document is not "the extraction" — a shipment is
      assembled from several, and the operator decides which part comes from where. The
      panel is laid out in that order: what you gave it, what you overrode, what it
      concluded. Precedence is SHOWN at the bottom rather than left to be reasoned about.
    -->
    <section class="fx-extract__step">
      <h3 class="fx-extract__h">1 · Documents</h3>

      <div
        class="fx-drop fx-drop--slim"
        :class="{ 'is-over': dragging }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <p class="fx-drop__lead">Drop PDFs here</p>
        <label class="fx-btn">
          Choose files
          <input type="file" accept="application/pdf" multiple class="fx-drop__input" @change="onPick" />
        </label>
        <p class="fx-muted fx-drop__note">
          Several documents are normal — an invoice for the parties, a packing list for the
          cargo. Say what to take from each.
        </p>
      </div>

      <p v-if="unstructuredWarning" class="fx-warn" role="status">
        Only airway bills extract today. An invoice or packing list needs the unstructured
        parser, which is not deployed yet — those rows will read as failed, and the paste
        box below is the way through until it is.
      </p>

      <table v-if="documents.length" class="fx-table fx-extract__docs">
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">State</th>
            <th scope="col">Take from it</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.uid">
            <td>{{ doc.name }}</td>
            <td>
              <StatusChip :value="doc.state" />
              <span v-if="doc.error" class="fx-muted"> {{ doc.error }}</span>
            </td>
            <td>
              <!--
                ⚠️ A group is taken from exactly ONE place. Letting two documents both
                claim the shipper would need a tie-break the operator cannot see, and the
                whole point of this panel is that they can.
              -->
              <select
                class="fx-input"
                :disabled="doc.state !== 'ready'"
                :value="groupsFrom(doc.uid)"
                @change="assign($event.target.value, doc.uid)"
              >
                <option value="">— nothing —</option>
                <option v-for="g in GROUPS" :key="g.key" :value="g.key">{{ g.label }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="fx-extract__step">
      <h3 class="fx-extract__h">2 · Paste anything specific</h3>

      <!--
        🔴 THE PASTE WINS, ALWAYS. It is the operator typing what they know, and it must
        outrank a machine reading of a scan. Anything recognised here is switched to this
        source automatically — and the switch is made VISIBLE in the result below rather
        than applied silently, so nobody is surprised by which value reached the document.
      -->
      <textarea
        v-model="pasted"
        class="fx-input fx-extract__paste"
        rows="5"
        placeholder="Shipper: Globex Exports Pvt Ltd&#10;Pieces: 14&#10;Weight: 698.5&#10;Dimensions: 120x80x90&#10;Goods: Machine parts"
      ></textarea>

      <p class="fx-muted">
        One <code>Label: value</code> per line. Whatever is recognised here overrides the
        documents.
      </p>

      <p v-if="pasted && pastedUnknown.length" class="fx-muted">
        Not recognised, so not used:
        <strong>{{ pastedUnknown.join(", ") }}</strong>
      </p>
    </section>

    <section class="fx-extract__step">
      <h3 class="fx-extract__h">3 · What will be used</h3>

      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Part</th>
            <th scope="col">Source</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="g in GROUPS" :key="g.key">
            <td>{{ g.label }}</td>
            <td>
              <span v-if="resolved[g.key].source === 'text'" class="fx-extract__override">
                pasted text
              </span>
              <span v-else-if="resolved[g.key].source">{{ resolved[g.key].source }}</span>
              <!-- §4.1 "not set" is an answer, and a different one from "empty". -->
              <span v-else class="fx-muted">not set</span>
            </td>
            <td>
              <span v-if="resolved[g.key].summary">{{ resolved[g.key].summary }}</span>
              <span v-else class="fx-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="lowConfidence.length" class="fx-warn" role="status">
        {{ lowConfidence.length }} field(s) the extractor was unsure of:
        {{ lowConfidence.join(", ") }}. Check them before this reaches a document.
      </p>

      <button
        class="fx-btn fx-btn--primary"
        :disabled="!anyResolved"
        @click="$emit('apply', payload)"
      >Use these details</button>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

/**
 * The parts a shipment is assembled from.
 *
 * Exactly the three the operator asked to choose between — parties, cargo, notify — not a
 * row per field. A picker with twenty entries is a form, and the operator already has one.
 */
const GROUPS = [
  { key: "parties", label: "Shipper & consignee", paths: ["shipper", "consignee"] },
  { key: "cargo", label: "Cargo — pieces, dimensions, description", paths: ["cargo", "piece_weight", "dimensions", "goods"] },
  { key: "notify", label: "Notify party", paths: ["also_notify", "notify"] },
];

/** What a pasted line may be called. Lower-cased, punctuation-insensitive. */
const PASTE_KEYS = {
  shipper: ["shipper", "consignor", "exporter"],
  consignee: ["consignee", "importer", "buyer"],
  notify: ["notify", "notify party", "also notify"],
  pieces: ["pieces", "pcs", "packages", "no of pieces"],
  weight: ["weight", "gross weight", "kg", "gross"],
  dimensions: ["dimensions", "dims", "size", "measurement"],
  goods: ["goods", "description", "commodity", "nature of goods"],
};

export default {
  name: "ExtractionPanel",
  components: { StatusChip },
  data: () => ({
    GROUPS,
    dragging: false,
    documents: [],
    /** group key -> document uid. One source per group, deliberately. */
    assignment: {},
    pasted: "",
    seq: 0,
  }),
  computed: {
    /* Honest about GAPS #38: only the coordinate path is deployed, so anything that is
       not an airway bill will fail at the parser. Saying so beats letting it look broken. */
    unstructuredWarning() {
      return this.documents.length > 0;
    },
    pastedFields() {
      return this.parsePaste(this.pasted).found;
    },
    pastedUnknown() {
      return this.parsePaste(this.pasted).unknown;
    },
    /**
     * 🔴 The whole point of the panel. For each group: which source won, and what it says.
     * Text beats documents, always — resolved here rather than at apply time so the
     * operator sees the outcome before committing it.
     */
    resolved() {
      const out = {};

      GROUPS.forEach((g) => {
        const fromText = this.groupFromPaste(g);

        if (fromText) {
          out[g.key] = { source: "text", summary: fromText, fields: this.pastedFields };
          return;
        }

        const uid = this.assignment[g.key];
        const doc = this.documents.find((d) => d.uid === uid);

        if (!doc || doc.state !== "ready") {
          out[g.key] = { source: null, summary: null, fields: null };
          return;
        }

        out[g.key] = {
          source: doc.name,
          summary: this.summarise(g, doc.fields),
          fields: doc.fields,
        };
      });

      return out;
    },
    anyResolved() {
      return GROUPS.some((g) => this.resolved[g.key].source !== null);
    },
    /* Medium counts as unsure: a field the extractor was only fairly sure of is exactly
       the one that produces a plausible-looking wrong consignee. */
    lowConfidence() {
      const out = [];

      GROUPS.forEach((g) => {
        const r = this.resolved[g.key];
        if (!r.fields || r.source === "text") return;

        g.paths.forEach((p) => {
          const node = r.fields[p];
          if (node && node.confidence && node.confidence !== "high") out.push(p);
        });
      });

      return out;
    },
    payload() {
      const fields = {};

      GROUPS.forEach((g) => {
        const r = this.resolved[g.key];
        if (!r.source) return;

        g.paths.forEach((p) => {
          const node = (r.fields || {})[p];
          if (node !== undefined) fields[p] = node;
        });
      });

      return { fields, overrides: this.pastedFields, resolved: this.resolved };
    },
  },
  methods: {
    onDrop(e) {
      this.dragging = false;
      this.add([...e.dataTransfer.files]);
    },
    onPick(e) {
      this.add([...e.target.files]);
    },
    add(files) {
      files.filter((f) => f.type === "application/pdf").forEach((file) => this.upload(file));
    },
    upload(file) {
      const uid = ++this.seq;

      this.documents.push({ uid, name: file.name, state: "reading", fields: null, error: null, jobId: null });

      const form = new FormData();
      form.append("upload_file", file);
      form.append("type", "ksr");

      ApiService.post("/user/upload-awb-file", form)
        .then(({ data }) => {
          const doc = this.documents.find((d) => d.uid === uid);
          doc.jobId = data.job_id || data.data;
          this.poll(uid);
        })
        .catch((e) => this.fail(uid, this.messageFor(e)));
    },
    /* Polled per document. Each has its own timer so a slow scan does not hold up a
       fast one — the operator can assign the first while the second is still reading. */
    poll(uid) {
      const doc = this.documents.find((d) => d.uid === uid);

      const timer = setInterval(() => {
        ApiService.get("/user/ocr-status/" + doc.jobId)
          .then(({ data }) => {
            if (data.job_status === "completed") {
              clearInterval(timer);
              doc.fields = data.fields || {};
              doc.state = "ready";
            } else if (data.job_status === "failed" || data.job_status === "cancelled") {
              clearInterval(timer);
              this.fail(uid, data.error || "could not be read");
            }
          })
          .catch((e) => {
            clearInterval(timer);
            this.fail(uid, this.messageFor(e));
          });
      }, 2000);

      doc.timer = timer;
    },
    fail(uid, message) {
      const doc = this.documents.find((d) => d.uid === uid);
      if (!doc) return;
      doc.state = "failed";
      doc.error = message;
    },
    /** Which group this document currently supplies, if any. */
    groupsFrom(uid) {
      const found = GROUPS.find((g) => this.assignment[g.key] === uid);
      return found ? found.key : "";
    },
    /** Assigning a group to a document takes it away from whichever had it. */
    assign(groupKey, uid) {
      const next = { ...this.assignment };

      Object.keys(next).forEach((k) => {
        if (next[k] === uid) delete next[k];
      });

      if (groupKey) next[groupKey] = uid;

      this.assignment = next;
    },
    /** `Label: value` per line. Anything unrecognised is reported, never guessed at. */
    parsePaste(text) {
      const found = {};
      const unknown = [];

      String(text || "").split(/\r?\n/).forEach((line) => {
        const m = line.match(/^\s*([^:]{1,40}):\s*(.+?)\s*$/);
        if (!m) {
          if (line.trim()) unknown.push(line.trim().slice(0, 30));
          return;
        }

        const label = m[1].trim().toLowerCase();
        const key = Object.keys(PASTE_KEYS).find((k) => PASTE_KEYS[k].includes(label));

        if (!key) {
          unknown.push(m[1].trim());
          return;
        }

        // Typed by a person, so it is authoritative by definition — not a guess to score.
        found[key] = { value: m[2].trim(), confidence: "high" };
      });

      return { found, unknown };
    },
    /** What the paste contributes to this group, as a one-line summary. */
    groupFromPaste(group) {
      const f = this.pastedFields;
      const parts = [];

      if (group.key === "parties") {
        if (f.shipper) parts.push(f.shipper.value);
        if (f.consignee) parts.push("→ " + f.consignee.value);
      } else if (group.key === "cargo") {
        if (f.pieces) parts.push(f.pieces.value + " pcs");
        if (f.weight) parts.push(f.weight.value + " kg");
        if (f.dimensions) parts.push(f.dimensions.value);
        if (f.goods) parts.push(f.goods.value);
      } else if (group.key === "notify") {
        if (f.notify) parts.push(f.notify.value);
      }

      return parts.length ? parts.join(" · ") : null;
    },
    summarise(group, fields) {
      const parts = [];

      group.paths.forEach((p) => {
        const node = fields[p];
        const value = node && typeof node === "object" ? node.value : node;
        if (value) parts.push(String(value));
      });

      return parts.length ? parts.join(" · ") : null;
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "something went wrong";
    },
  },
  beforeDestroy() {
    this.documents.forEach((d) => d.timer && clearInterval(d.timer));
  },
};
</script>
