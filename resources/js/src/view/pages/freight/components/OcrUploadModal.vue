<template>
  <!--
    §Step 6.2 — drag-and-drop extraction.

    ⚠️ NOT A DRAWER. §5.5 draws the line by duration: a drawer is for sustained
    parallel work, and this is a blocking decision — you are waiting for one answer
    and then acting on it. It is modal for the same reason a file dialog is.
  -->
  <div v-if="open" class="fx-modal" role="dialog" aria-modal="true" aria-label="Extract from PDF" @keydown.esc="close">
    <div class="fx-modal__panel">
      <header class="fx-modal__head">
        <h2 class="fx-modal__title">Extract from a document</h2>
        <button class="fx-btn fx-btn--ghost" aria-label="Close" @click="close">✕</button>
      </header>

      <div class="fx-modal__body">
        <!-- ── Idle: the dropzone ─────────────────────────────────────────── -->
        <div
          v-if="phase === 'idle'"
          class="fx-drop"
          :class="{ 'is-over': dragging }"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <p class="fx-drop__lead">Drop a PDF here</p>
          <p class="fx-muted">or</p>
          <label class="fx-btn">
            Choose a file
            <input type="file" accept="application/pdf" class="fx-drop__input" @change="onPick" />
          </label>
          <p class="fx-muted fx-drop__note">PDF only, up to 25 MB.</p>
        </div>

        <!-- ── Working ────────────────────────────────────────────────────── -->
        <div v-else-if="phase === 'uploading' || phase === 'processing'" class="fx-drop">
          <p class="fx-drop__lead">{{ phase === "uploading" ? "Uploading…" : "Reading the document…" }}</p>
          <p class="fx-muted">{{ filename }}</p>
          <!--
            Extraction runs 5–60s on the `ocr` queue (§4.10) — the slowest work in the
            system. Saying so beats a spinner that implies something is stuck.
          -->
          <p v-if="phase === 'processing'" class="fx-muted fx-drop__note">
            This usually takes a few seconds. Long or scanned documents take longer.
          </p>
        </div>

        <!-- ── Awaiting vision consent ────────────────────────────────────── -->
        <!--
          🔒 §4.1.1 — THE ONLY PLACE THE PRODUCT ASKS TO SPEND MONEY. Nothing above this
          point cost anything, and nothing below it happens until somebody answers.

          ⚠️ The price is stated before the buttons, not after. An operator who cannot see
          what a click costs will either always accept or never accept, and both make the
          prompt pointless.
        -->
        <div v-else-if="phase === 'consent'" class="fx-drop">
          <p class="fx-drop__lead">This document has no readable text</p>
          <p class="fx-muted">{{ filename }}</p>

          <p class="fx-warn" role="status">
            It looks like a scan, so reading it needs vision OCR.
            <strong>{{ creditCost }} credit{{ creditCost === 1 ? "" : "s" }}</strong><template v-if="pageCount">, {{ pageCount }} page{{ pageCount === 1 ? "" : "s" }}</template>.
            Nothing has been charged yet.
          </p>

          <div class="fx-drop__actions">
            <button class="fx-btn fx-btn--primary" :disabled="deciding" @click="decide('accept')">
              {{ deciding ? "Working…" : "Use vision (" + creditCost + " credit)" }}
            </button>
            <button class="fx-btn fx-btn--ghost" :disabled="deciding" @click="decide('decline')">
              Don't read it
            </button>
          </div>

          <p class="fx-muted fx-drop__note">
            Declining costs nothing. If nobody answers, this is cancelled after 24 hours.
          </p>
        </div>

        <!-- ── Failed ─────────────────────────────────────────────────────── -->
        <div v-else-if="phase === 'failed'" class="fx-drop">
          <p class="fx-error" role="alert">{{ error }}</p>
          <button class="fx-btn" @click="reset">Try another file</button>
        </div>

        <!-- ── Extracted ──────────────────────────────────────────────────── -->
        <template v-else>
          <!--
            🔴 §5.1 MEDIUM AND LOW ARE BOTH HIGHLIGHTED. A field the extractor was only
            fairly sure of is exactly the one that produces a plausible-looking wrong
            consignee — the kind of error that survives a glance and fails at customs.
          -->
          <p v-if="review.length" class="fx-warn" role="status">
            {{ review.length }} field{{ review.length === 1 ? "" : "s" }} need checking before
            this is used. They are marked below.
          </p>
          <p v-else class="fx-muted">Every field came back at high confidence. Check it anyway.</p>

          <table class="fx-table fx-extract">
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Value</th>
                <th scope="col">Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.path" :class="{ 'is-review': row.confidence !== 'high' }">
                <td>{{ row.label }}</td>
                <td>
                  <!-- §4.1 NULL is not empty string — "not on the page" is an answer. -->
                  <span v-if="row.value">{{ row.value }}</span>
                  <span v-else class="is-empty" aria-label="Not found on the page"></span>
                </td>
                <td><StatusChip :value="row.confidence" /></td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>

      <footer class="fx-modal__foot">
        <button class="fx-btn" @click="close">Cancel</button>
        <!--
          The operator ACCEPTS the extraction into the form; nothing is written until
          they do. An extraction that populated a legal document on arrival would make
          the confidence highlighting decorative.
        -->
        <button
          v-if="phase === 'done'"
          class="fx-btn fx-btn--primary"
          @click="accept"
        >Use these values</button>
      </footer>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

/* The box vocabulary from python/boxes_config.json — the same names FocusAir.vue
   already consumes, so nothing here needs a second mapping. */
const LABELS = {
  awb_number: "AWB number",
  shipper: "Shipper",
  consignee: "Consignee",
  departure: "Departure",
  destination: "Destination",
  transit: "Transit",
  cargo: "Cargo",
  weight_charge: "Weight charge",
  piece_weight: "Pieces / weight",
  chrg_code: "Charge code",
};

export default {
  name: "OcrUploadModal",
  components: { StatusChip },
  props: { open: { type: Boolean, default: false } },
  data: () => ({
    phase: "idle", dragging: false, filename: null,
    jobId: null, fields: {}, review: [], error: null, poller: null,
    // Vision consent (§4.1.1). `deciding` guards the buttons: the answer spends money,
    // and a double-click must not become two attempts to spend it.
    pageCount: null, creditCost: 1, deciding: false,
  }),
  computed: {
    /* Flattened to dot-paths so a nested region reports the FIELD, not the box —
       "shipper.name is low" is actionable, "shipper is low" is not. */
    rows() {
      const out = [];
      const walk = (obj, prefix) => {
        Object.keys(obj).forEach((key) => {
          const node = obj[key];
          const path = prefix ? prefix + "." + key : key;
          if (node && typeof node === "object" && "confidence" in node) {
            out.push({ path, label: LABELS[path] || path.replace(/[._]/g, " "),
                       value: node.value, confidence: node.confidence });
          } else if (node && typeof node === "object") {
            walk(node, path);
          }
        });
      };
      walk(this.fields, "");
      /* Fields needing review first: the list is a worklist, not a record layout. */
      return out.sort((a, b) => (a.confidence === "high") - (b.confidence === "high"));
    },
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    onDrop(e) {
      this.dragging = false;
      const file = e.dataTransfer.files[0];
      if (file) this.upload(file);
    },
    onPick(e) {
      const file = e.target.files[0];
      if (file) this.upload(file);
    },
    upload(file) {
      if (file.type !== "application/pdf") {
        this.phase = "failed";
        this.error = "That is not a PDF. Extraction reads PDFs only.";
        return;
      }

      this.filename = file.name;
      this.phase = "uploading";
      this.error = null;

      const form = new FormData();
      form.append("upload_file", file);
      form.append("type", "ksr");

      ApiService.post("/user/upload-awb-file", form)
        .then(({ data }) => {
          this.jobId = data.job_id || data.data;
          this.phase = "processing";
          this.poll();
        })
        .catch((e) => {
          this.phase = "failed";
          this.error = this.messageFor(e);
        });
    },
    /* Polled, not pushed: the job runs on the `ocr` queue and there is no socket yet.
       2s is slow enough not to hammer the API and fast enough to feel responsive
       against a 5-60s extraction. */
    poll() {
      this.stopPolling();
      this.poller = setInterval(() => {
        ApiService.get("/user/ocr-status/" + this.jobId)
          .then(({ data }) => {
            if (data.job_status === "completed") {
              this.stopPolling();
              this.fields = data.fields || {};
              this.review = data.needs_review || [];
              this.phase = "done";
            } else if (data.job_status === "awaiting_vision_consent") {
              /* 🔴 Stop polling and ASK. Without this branch the modal sits on
                 "Reading the document…" forever while the job waits for an answer
                 nobody is being asked for — which is what it did before consent
                 existed. */
              this.stopPolling();
              this.pageCount = data.page_count || null;
              this.creditCost = data.credit_cost || 1;
              this.phase = "consent";
            } else if (data.job_status === "cancelled") {
              this.stopPolling();
              this.phase = "failed";
              this.error = data.error || "This extraction was cancelled.";
            } else if (data.job_status === "failed") {
              this.stopPolling();
              this.phase = "failed";
              this.error = data.error || "The document could not be read.";
            }
          })
          .catch((e) => {
            this.stopPolling();
            this.phase = "failed";
            this.error = this.messageFor(e);
          });
      }, 2000);
    },
    stopPolling() {
      if (this.poller) { clearInterval(this.poller); this.poller = null; }
    },
    /* Answer the consent prompt. Accepting resumes polling because the extraction goes
       back to work; declining is terminal and says so rather than looping. */
    decide(decision) {
      this.deciding = true;

      ApiService.post("/user/ocr-consent/" + this.jobId, { decision })
        .then(({ data }) => {
          if (data.job_status === "processing") {
            this.phase = "processing";
            this.poll();
          } else {
            this.phase = "failed";
            this.error = "Vision extraction was declined. Nothing was charged.";
          }
        })
        .catch((e) => {
          this.phase = "failed";
          this.error = this.messageFor(e);
        })
        .finally(() => { this.deciding = false; });
    },
    accept() {
      /* Values only — the parent form takes them; the confidence travelled with the
         review list so the form can keep marking them. */
      this.$emit("extracted", { fields: this.fields, needsReview: this.review });
      this.close();
    },
    reset() {
      this.phase = "idle";
      this.error = null;
      this.filename = null;
      this.jobId = null;
      this.pageCount = null;
      this.creditCost = 1;
      this.deciding = false;
    },
    close() {
      this.stopPolling();
      this.reset();
      this.$emit("close");
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
