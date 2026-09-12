<template>
  <div class="fx-extract">
    <!--
      🔴 THREE SOURCES, ONE RESULT. A document is not "the extraction" — a shipment is
      assembled from several, and the operator decides which part comes from where. The
      panel is laid out in that order: what you gave it, what you overrode, what it
      concluded. Precedence is SHOWN at the bottom rather than left to be reasoned about.
    -->
    <!--
      🔴 THE TARGET IS CHOSEN FIRST, because it decides everything after it: which endpoint
      saves the draft, which key names the payload uses, and which form the operator is sent
      to. Extracting first and asking afterwards would mean re-shaping a payload that has
      already been built.
    -->
    <section class="fx-extract__step">
      <h3 class="fx-extract__h">Extract into</h3>

      <div class="fx-extract__target">
        <label v-for="t in TARGETS" :key="t.key" class="fx-radio">
          <input type="radio" :value="t.key" v-model="target" />
          <span>{{ t.label }}</span>
        </label>

        <template v-if="target === 'mawb'">
          <!--
            ⚠️ Labelled, not placeholder-only. Grey placeholder digits in a number field
            read as a value that is already filled in — the Save button then looks broken
            rather than waiting for input.
          -->
          <label class="fx-field fx-field--inline">
            <span class="fx-field__label">Prefix</span>
            <input v-model="awbCode" class="fx-input fx-extract__num" maxlength="3" inputmode="numeric" />
          </label>
          <span class="fx-muted">—</span>
          <label class="fx-field fx-field--inline">
            <span class="fx-field__label">Serial</span>
            <input v-model="awbNo" class="fx-input fx-extract__num" maxlength="8" inputmode="numeric" />
          </label>
        </template>
        <label v-else class="fx-field fx-field--inline">
          <span class="fx-field__label">House AWB number</span>
          <input v-model="hawbNo" class="fx-input" />
        </label>
      </div>
    </section>

    <section class="fx-extract__step">
      <h3 class="fx-extract__h">1 · Documents</h3>

      <!--
        🔴 THE WHOLE ZONE OPENS THE PICKER, not just the button. The button is 83x32px
        inside a target several times that size, and a click that lands next to it did
        NOTHING AT ALL — no dialog, no message, nothing to distinguish "you missed" from
        "this is broken". Every report of the picker not working looks identical from the
        outside whether the cause is a dead handler or a small target.

        ⚠️ `pick()` is called from the CLICK HANDLER, synchronously. Chrome only opens a
        file dialog inside a live user gesture, so an `await` anywhere before
        `input.click()` loses the activation and the dialog silently never appears.
      -->
      <div
        class="fx-drop fx-drop--slim is-clickable"
        :class="{ 'is-over': dragging }"
        role="button"
        tabindex="0"
        @click="pick"
        @keydown.enter.prevent="pick"
        @keydown.space.prevent="pick"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <p class="fx-drop__lead">Drop PDFs here, or click anywhere in this box</p>
        <!-- ⚠️ A BUTTON, not a label wrapping the input. A label activates the input
             natively AND the click bubbles to the zone above, which opened the dialog
             twice. One path in, one dialog. -->
        <button type="button" class="fx-btn" @click.stop="pick">
          Choose files
        </button>
        <input
          ref="picker"
          type="file"
          accept="application/pdf,.pdf"
          multiple
          class="fx-drop__input"
          @change="onPick"
        />
        <p class="fx-muted fx-drop__note">
          Several documents are normal — an invoice for the parties, a packing list for the
          cargo. Say what to take from each.
        </p>
      </div>

      <!--
        ⚠️ Fires ONLY when a scan is actually staged, and says so about those files by
        name. Earlier versions warned on every document before anything was read, which
        taught operators to ignore it for the times it mattered.
      -->
      <p v-if="scannedDocuments.length" class="fx-warn" role="status">
        No selectable text in <strong>{{ scannedDocuments.join(", ") }}</strong> — vision
        extraction is not deployed yet, so use the paste box below for those.
      </p>

      <p v-if="rejectedFiles.length" class="fx-warn" role="status">
        Not added — only PDFs can be read here:
        <strong>{{ rejectedFiles.join(", ") }}</strong>
      </p>

      <table v-if="documents.length" class="fx-table fx-extract__docs">
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">Kind</th>
            <th scope="col">State</th>
            <th scope="col"><span class="fx-sr-only">Actions</span></th>
            <th scope="col">Take from it</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc.uid">
            <td>{{ doc.name }}</td>
            <td>
              <!--
                🔴 WHAT THE FILE IS, which is not the same question as "Extract into"
                above. That one says where the answer GOES — the master or the house
                waybill. This says how the file has to be READ.

                An airway bill has a fixed layout, so its boxes are cropped by coordinates:
                exact, free, and better than any model. An invoice or a packing list has no
                fixed layout, so there is nothing to crop and the text has to be read
                instead.

                ⚠️ Locked once reading starts. Changing how a document is parsed while it
                is being parsed would apply to the next run and not the one on screen.
              -->
              <select
                class="fx-input"
                :disabled="doc.state === 'reading'"
                :value="doc.kind"
                @change="setKind(doc.uid, $event.target.value)"
              >
                <option v-for="k in KINDS" :key="k.key" :value="k.key">{{ k.label }}</option>
              </select>
            </td>
            <td>
              <StatusChip :value="doc.state" />
              <span v-if="doc.error" class="fx-muted"> {{ doc.error }}</span>
              <span v-if="doc.warning" class="fx-muted"> ⚠️ {{ doc.warning }}</span>

              <!--
                🔴 KNOWN BEFORE EXTRACT IS PRESSED. The browser reads the text layer at
                staging, so a scan is named here rather than after the queue has run —
                which is when the operator used to find out.

                ⚠️ Only while staged. Once a document has been read the real result is on
                the row and a prediction beside it is noise.
              -->
              <span
                v-if="doc.state === 'staged' && doc.readable === 'scan'"
                class="fx-staged__flag"
                title="No selectable text was found in the first pages"
              >looks scanned</span>
            </td>
            <td>
              <!--
                🔴 EXTRACTION IS EXPLICIT. Reading on drop spends time (and, on a scan, a
                credit) against a file the operator may have picked by mistake — and they
                cannot tell it was the wrong one until after it has been read. Staged first,
                read on request, replaceable until then.
              -->
              <button
                v-if="doc.state === 'staged'"
                class="fx-btn"
                @click="extract(doc.uid)"
              >Extract</button>
              <button
                v-else-if="doc.state === 'reading'"
                class="fx-btn"
                disabled
              >Reading…</button>
              <button
                v-else
                class="fx-btn fx-btn--ghost"
                @click="extract(doc.uid)"
              >Re-extract</button>

              <button class="fx-btn fx-btn--ghost" @click="remove(doc.uid)">Remove</button>
            </td>
            <td>
              <!--
                ⚠️ A group is taken from exactly ONE place. Letting two documents both
                claim the shipper would need a tie-break the operator cannot see, and the
                whole point of this panel is that they can.

                🔴 Selectable while the document is still STAGED. Saying what you want from
                a file before reading it is the natural order — you know an invoice carries
                the parties without opening it — and gating the picker on a finished
                extraction meant dropping a file and finding the only control greyed out.
                Only disabled mid-read, when the answer is genuinely in flight.
              -->
              <select
                class="fx-input"
                :disabled="doc.state === 'reading'"
                :value="groupsFrom(doc.uid)"
                @change="assign($event.target.value, doc.uid)"
              >
                <option value="">— nothing —</option>
                <option value="all">All</option>
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
        :placeholder="PASTE_EXAMPLE"
      ></textarea>

      <p class="fx-muted">
        Shipper, consignee or notify party: the label, then the whole address below it. Anything else: one <code>Label: value</code> per line. Whatever is recognised here overrides the
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
            <th scope="col">Field</th>
            <th scope="col">Source</th>
            <th scope="col">Value</th>
            <th scope="col"><span class="fx-sr-only">Fit to the form</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in fieldRows" :key="row.key">
            <td>{{ row.label }}</td>
            <td>
              <span v-if="row.source === 'text'" class="fx-extract__override">pasted text</span>
              <span v-else-if="row.source === 'calculated'" class="fx-muted">calculated</span>
              <!-- 🔴 A SUGGESTION, not a fact: worked out from the dimensions and pieces, and
                   only saved if the operator types it into the box beside it. -->
              <span v-else-if="row.source === 'suggested'" class="fx-muted">suggested</span>
              <span v-else-if="row.source === 'entered'" class="fx-extract__override">entered</span>
              <span v-else-if="row.source">{{ row.source }}</span>
              <!-- §4.1 "not set" is an answer, and a different one from "empty". -->
              <span v-else class="fx-muted">not set</span>
            </td>
            <td>
              <!--
                📇 The branch's own address book. A consignee typed a hundred times is a
                consignee that has been typed wrong at least once — picking beats retyping,
                and a saved party already fits the fields.
              -->
              <select
                v-if="row.party"
                class="fx-input fx-extract__book"
                :value="''"
                @change="useSaved(row.party, $event.target.value)"
              >
                <option value="">Saved {{ row.label.toLowerCase() }}…</option>
                <option v-for="a in savedFor(row.party)" :key="a.id" :value="a.id">
                  {{ a.name }}<template v-if="a.city"> · {{ a.city }}</template>
                </option>
              </select>

              <!--
                🔴 CHARGEABLE IS EDITABLE. It defaults to the greater of gross and
                volumetric — the IATA rule — but a re-measured or negotiated figure is a
                fact the operator has and the formula does not, so the derived value is a
                starting point rather than a verdict.
              -->
              <template v-if="row.editable">
                <input
                  v-model="chargeableEdit"
                  class="fx-input fx-extract__weight"
                  :placeholder="row.value === null ? '' : String(row.value)"
                  inputmode="decimal"
                />
                <span class="fx-muted">kg</span>
              </template>
              <template v-else>
                <span v-if="row.value !== null && row.value !== ''" :class="{ 'fx-extract__party': row.party }">
                  {{ row.value }}<span v-if="row.unit" class="fx-muted"> {{ row.unit }}</span>
                </span>
                <span v-else class="fx-muted">—</span>
              </template>
            </td>
            <td class="fx-num">
              <!--
                🔴 NOT an AI call. A character limit and a charset have an exact right
                answer, so a model here would be slower, cost a credit, differ next
                Tuesday, and produce a plausible shortening nobody could check.
              -->
              <button
                v-if="row.party && row.value"
                class="fx-btn fx-btn--ghost"
                @click="fit(row.party)"
              >Fit to {{ targetLabel }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!--
        ⚠️ Every change is SHOWN and the operator accepts. Silent truncation is the defect
        this codebase already shipped once, turning "Müller & Co." into "Mller Co" with
        nothing on screen to say so.
      -->
      <div v-if="fitReport" class="fx-warn" role="status">
        <strong>{{ fitReport.party }}</strong> — {{ fitReport.changes.join("; ") }}.
        <template v-if="fitReport.overLimit">
          Shorten it yourself: which part matters is a judgement, and cutting it here would
          be a guess.
        </template>
        <button class="fx-btn fx-btn--ghost" @click="fitReport = null">Dismiss</button>
      </div>

      <p v-if="lowConfidence.length" class="fx-warn" role="status">
        {{ lowConfidence.length }} field(s) the extractor was unsure of:
        {{ lowConfidence.join(", ") }}. Check them before this reaches a document.
      </p>

      <!--
        ⚠️ Named BEFORE the save button, not after a failure. The endpoint skips an
        incomplete shipper without a word and rejects an incomplete consignee outright —
        after the waybill shell has already been written. The operator should know which
        parts will not land while they can still paste them.
      -->
      <p v-for="row in incomplete" :key="row.party" class="fx-warn" role="status">
        <strong>{{ row.party }}</strong> is saved to the draft without
        {{ row.missing.join(", ") }}. Fill {{ row.missing.length > 1 ? "them" : "it" }} in the
        draft before sending, or add <code>{{ row.party }} {{ row.missing[0] }}:</code> above.
      </p>

      <p v-if="saveError" class="fx-error" role="alert">{{ saveError }}</p>

      <div class="fx-extract__actions">
        <!--
          🔴 SAVED AS A DRAFT, never further. The draft is a working document the operator
          opens and completes; the AWB form owns rates, charges and the commercial fields
          extraction never sees. Writing a finished waybill from a scan would put a machine
          reading on a document that goes to an airline and to customs.
        -->
        <button
          class="fx-btn fx-btn--primary"
          :disabled="!canSave || saving"
          @click="saveDraft"
        >{{ saving ? "Saving…" : "Save as draft" }}</button>

        <template v-if="draftUrl">
          <a class="fx-btn" :href="draftUrl">Open in {{ targetLabel }} →</a>

          <!--
            ⚠️ The PDF is generated FROM THE SAVED DRAFT, not from what is on screen. A PDF
            built from unsaved values is a document nobody can reproduce afterwards.

            🔴 A LINK, not an emit. It was `$emit('generate-pdf')` into a parent that
            listens for no such event, so the button did nothing at all — and did it
            silently, which is worse than being absent.
          -->
          <a class="fx-btn" :href="pdfUrl" target="_blank" rel="noopener">Generate PDF</a>

          <!--
            Saving again after an edit. The draft already exists, so this is an update to
            the same waybill rather than a second one — the number has not changed.
          -->
          <button class="fx-btn" :disabled="saving" @click="saveDraft">
            {{ saving ? "Saving…" : "Save changes" }}
          </button>
        </template>
      </div>

      <p v-if="draftUrl" class="fx-muted">
        Saved as a draft. Open it to add rates and charges — extraction never supplies
        those.
      </p>

      <p v-if="!canSave" class="fx-muted">
        {{ target === "mawb"
            ? "Enter the airline prefix and serial to save a draft."
            : "Enter the house AWB number to save a draft." }}
      </p>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import {
  buildPayload, countryCode, createEndpoint, flattenCargo, flattenParties, formRoute, masterKey,
  parsePartyBlock, TARGETS,
} from "@/core/config/awbMapping";
import { cleanParty } from "@/core/config/awbFieldRules";

/**
 * The parts a shipment is assembled from.
 *
 * Exactly the three the operator asked to choose between — parties, cargo, notify — not a
 * row per field. A picker with twenty entries is a form, and the operator already has one.
 */
/**
 * How a document has to be READ — not the same question as which waybill it fills.
 *
 * ⚠️ The default is `other`, because that is what this panel is for: its own copy says
 * "an invoice for the parties, a packing list for the cargo". Defaulting to the airway
 * bill would crop those at an AWB's coordinates and return whatever text sits at the
 * boxes — which is what it did before this existed.
 */
/**
 * The floor for "this document has a text layer".
 *
 * 🔴 Must match `MIN_TEXT_CHARS` in python/unstructured.py. A scanner leaves a page number
 * or a header stamp behind, so "any text at all" calls most scans readable — and if the
 * two ends disagree on where the line sits, the panel tells the operator one thing and the
 * parser then does another.
 */
const TEXT_LAYER_MIN_CHARS = 120;

const KINDS = [
  { key: "other", label: "Other document" },
  { key: "awb", label: "Airway bill" },
];

const GROUPS = [
  { key: "parties", label: "Shipper & consignee", paths: ["shipper", "consignee"] },
  { key: "cargo", label: "Cargo — pieces, dimensions, description", paths: ["cargo", "piece_weight", "dimensions", "goods"] },
  /* 🔴 Weights are their OWN group, because they come from their own document. Gross is
     on the packing list, chargeable is what the airline bills, and the two disagreeing is
     the normal case rather than an error — so they must be sourceable separately from the
     pieces and description they usually sit beside. */
  { key: "weights", label: "Weights — gross, volumetric, chargeable", paths: ["gross_weight", "volumetric_weight", "chargeable_weight", "volume"] },
  { key: "notify", label: "Notify party", paths: ["also_notify", "notify"] },
];

/**
 * Step 3 lists FIELDS, not groups.
 *
 * 🔴 Assignment is by group — a document supplies "the parties" or "the cargo" — but
 * REVIEW is per field, because that is the grain an operator checks at. "Cargo: 14 pcs ·
 * 120x80x90 · Machine parts" on one line hides which of the three was actually found, and
 * a missing description reads the same as a present one.
 */
const RESULT_FIELDS = [
  { key: "shipper", label: "Shipper", group: "parties", party: "shipper" },
  { key: "consignee", label: "Consignee", group: "parties", party: "consignee" },
  { key: "pieces", label: "Pieces", group: "cargo" },
  { key: "dimensions", label: "Dimensions", group: "cargo" },
  { key: "goods", label: "Description", group: "cargo" },
  { key: "gross_weight", label: "Gross weight", group: "weights", unit: "kg" },
  { key: "volumetric_weight", label: "Volumetric weight", group: "weights", unit: "kg", derived: true },
  { key: "chargeable_weight", label: "Chargeable weight", group: "weights", unit: "kg", editable: true },
  { key: "notify", label: "Notify party", group: "notify", party: "notify" },
];

/** `saved_addresses.address_type` for each party. */
const ADDRESS_TYPES = {
  shipper: "shipper_address",
  consignee: "consignee_address",
  notify: "also_notify_address",
};

/** Shown in the paste box, so the accepted labels are visible rather than documented. */
/** Parties that can be pasted as a whole block: the label, then the address below it. */
const PARTY_BLOCKS = ["shipper", "consignee", "notify"];

const PASTE_EXAMPLE = [
  "Shipper:",
  "Globex Exports Pvt Ltd",
  "Plot 42/A, MIDC Andheri East",
  "Mumbai 400093, Maharashtra, India",
  "",
  "Consignee: Emirates Trading LLC, Jebel Ali Free Zone, Dubai, UAE",
  "",
  "Pieces: 14",
  "Gross weight: 698.5",
  "Dimensions: 120x80x90",
  "Goods: Machine parts",
].join("\n");

/** What a pasted line may be called. Lower-cased, punctuation-insensitive. */
/**
 * What a pasted line may be called. Lower-cased, punctuation-insensitive.
 *
 * 🔴 **A party needs more than a name.** `create-focusair` requires address, city, state,
 * post code and country before it will store a consignee at all — and it SKIPS a shipper
 * silently unless name, city and country are present. A paste of "Shipper: Globex" alone
 * therefore saves nothing, which is why every party has its parts here.
 */
const PASTE_KEYS = {
  shipper: ["shipper", "consignor", "exporter"],
  shipper_address: ["shipper address", "consignor address"],
  shipper_city: ["shipper city", "consignor city"],
  shipper_state: ["shipper state"],
  shipper_post_code: ["shipper postcode", "shipper post code", "shipper pin", "shipper zip"],
  shipper_country: ["shipper country"],

  consignee: ["consignee", "importer", "buyer"],
  consignee_address: ["consignee address", "importer address"],
  consignee_city: ["consignee city"],
  consignee_state: ["consignee state"],
  consignee_post_code: ["consignee postcode", "consignee post code", "consignee zip"],
  consignee_country: ["consignee country"],

  notify: ["notify", "notify party", "also notify"],
  notify_address: ["notify address"],
  notify_city: ["notify city"],
  notify_state: ["notify state"],
  notify_post_code: ["notify postcode", "notify post code", "notify zip"],
  notify_country: ["notify country"],

  pieces: ["pieces", "pcs", "packages", "no of pieces"],

  /* ⚠️ Three DIFFERENT weights, and conflating them misprices a shipment. Gross is what
     it weighs; volumetric is what its size is worth (L×W×H ÷ 6000); chargeable is the
     greater of the two, and is what the airline actually bills. A bare "weight" is
     treated as gross, which is what a packing list means by it. */
  gross_weight: ["gross weight", "gross", "weight", "kg", "actual weight"],
  volumetric_weight: ["volumetric weight", "volume weight", "dim weight", "dimensional weight"],
  chargeable_weight: ["chargeable weight", "chargable weight", "chg weight"],

  volume: ["volume", "cbm", "total volume"],
  dimensions: ["dimensions", "dims", "size", "measurement"],
  goods: ["goods", "description", "commodity", "nature of goods"],
};

/** What each party must carry before the endpoint will store it. */
/** Unwrap `{value, confidence}` — or a bare value — to the value. */
function raw(node) {
  if (node === undefined || node === null) return null;
  if (typeof node === "object" && "value" in node) return node.value;
  return node;
}

const PARTY_REQUIRED = {
  shipper: ["address", "city", "state", "post_code", "country"],
  consignee: ["address", "city", "state", "post_code", "country"],
  notify: ["address", "city", "state", "post_code", "country"],
};

export default {
  name: "ExtractionPanel",
  components: { StatusChip },
  props: {
    /**
     * The AWB this conversation is already about, as `176-10000008`.
     *
     * 🔗 The enquiry, the job and the waybill are one thread of work, so the number the
     * job already holds is the number to extract into. Asking the operator to retype it is
     * how a draft ends up under a different waybill from the shipment it belongs to.
     */
    prefillAwb: { type: String, default: null },
  },
  data: () => ({
    GROUPS,
    TARGETS,
    PASTE_EXAMPLE,
    RESULT_FIELDS,
    chargeableEdit: "",
    savedAddresses: {},
    countries: {},
    manual: {},
    fitReport: null,
    target: "mawb", KINDS, rejectedFiles: [],
    awbCode: "", awbNo: "", hawbNo: "",
    saving: false, saveError: null, draftUrl: null,
    dragging: false,
    documents: [],
    /** group key -> document uid. One source per group, deliberately. */
    assignment: {},
    pasted: "",
    seq: 0,
  }),
  computed: {
    /** Staged documents the browser could find no text layer in. */
    scannedDocuments() {
      return this.documents
        .filter((d) => d.state === "staged" && d.readable === "scan")
        .map((d) => d.name);
    },
    pastedFields() {
      return this.withCountryCodes(this.parsePaste(this.pasted).found);
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
    /**
     * 🔴 Parties that will NOT be stored, and what they are missing.
     *
     * Saying so beats the alternative measured on the first run: the shipper was dropped
     * silently, the consignee 422'd, and the AWB shell had already been written — an error
     * response with a half-created document behind it (GAPS #42).
     */
    incomplete() {
      const out = [];
      const f = this.withCountryCodes(this.flatFields);

      Object.keys(PARTY_REQUIRED).forEach((party) => {
        if (!f[party]) return;

        // ⚠️ A country counts only as a 2-letter code: a name the list did not recognise is
        // left off the draft, so it is missing here too.
        const missing = PARTY_REQUIRED[party]
          .filter((part) => {
            const value = raw(f[party + "_" + part]);
            return part === "country" ? !/^[A-Z]{2}$/.test(String(value || "")) : !value;
          })
          .map((part) => part.replace(/_/g, " "));

        if (missing.length) out.push({ party, missing });
      });

      return out;
    },
    /**
     * 🔴 VOLUMETRIC IS DERIVED, NEVER TYPED-AND-TRUSTED. `L×W×H ÷ 6000` is the IATA rule,
     * and the airline recomputes it from the dimensions on the waybill regardless — so a
     * hand-entered figure that disagrees with the dimension lines beside it is simply
     * wrong, and wrong in a way that reprices the shipment at the counter.
     *
     * NULL when there are no dimensions: "not calculable" is a different answer from 0.
     */
    volumetric() {
      const dims = raw(this.sourceField("dimensions", "cargo"));
      if (!dims) return null;

      const parts = String(dims).split(/\s*[xX*]\s*/).map((n) => parseFloat(n));
      if (parts.length < 3 || parts.some((n) => isNaN(n))) return null;

      const pieces = parseFloat(raw(this.sourceField("pieces", "cargo"))) || 1;

      return Math.round(((parts[0] * parts[1] * parts[2] * pieces) / 6000) * 10) / 10;
    },
    /**
     * The greater of gross and volumetric — what the airline bills.
     *
     * ⚠️ A pasted `Chargeable weight:` OVERRIDES this, because a negotiated or
     * re-measured figure is a fact the operator has and the formula does not.
     */
    chargeable() {
      // 🔴 The operator's own figure outranks both the paste and the formula — it is the
      // most recent statement of fact about this shipment.
      if (this.chargeableEdit !== "" && !isNaN(parseFloat(this.chargeableEdit))) {
        return parseFloat(this.chargeableEdit);
      }

      const typed = raw(this.sourceField("chargeable_weight", "weights"));
      if (typed) return typed;

      const gross = parseFloat(raw(this.sourceField("gross_weight", "weights")));
      const vol = this.volumetric;

      if (isNaN(gross) && vol === null) return null;
      if (isNaN(gross)) return vol;
      if (vol === null) return gross;

      return Math.max(gross, vol);
    },
    /**
     * One row per field, with where its value came from.
     *
     * ⚠️ Volumetric and chargeable are DERIVED, so their source reads "calculated" rather
     * than naming a document that never contained them.
     */
    fieldRows() {
      return RESULT_FIELDS.map((f) => {
        if (f.key === "volumetric_weight") {
          return { ...f, source: this.volumetric === null ? null : "calculated", value: this.volumetric };
        }

        if (f.key === "chargeable_weight") {
          const typed = raw(this.sourceField("chargeable_weight", "weights"));

          return {
            ...f,
            // ⚠️ "entered" and "pasted text" are different provenances and must not
            // share a label: one is a figure the operator typed against this shipment,
            // the other came from a block of text they pasted in.
            source: this.chargeableEdit !== "" ? "entered"
                  : typed ? "text"
                  : this.chargeable === null ? null : "suggested",
            value: this.chargeable,
          };
        }

        // 🔴 A party is SEVERAL fields (name, address, city, post code, country), shown as one
        // clean block. Printing the node itself dumped its {value, confidence} pairs into the
        // cell as JSON, most of them null, which read as "nothing was found".
        const value = f.party ? this.partyText(f.party, f.group) : raw(this.sourceField(f.key, f.group));

        if (value === null || value === undefined || value === "") {
          return { ...f, source: null, value: null };
        }

        // Named source: the paste, or the document assigned to this field's group.
        if (this.pastedFields[f.key] !== undefined) {
          return { ...f, source: "text", value };
        }

        const doc = this.documents.find((d) => d.uid === this.assignment[f.group]);

        return { ...f, source: doc ? doc.name : null, value };
      });
    },
    /**
     * Where the generated PDF lives.
     *
     * ⚠️ A WEB route, not an api one — `/download-awb-pdf/{id}` is registered in
     * routes/web.php and carries no `/api` prefix. Building it with one 404s.
     */
    pdfUrl() {
      const key = this.target === "mawb"
        ? masterKey(this.awbCode, this.awbNo)
        : this.hawbNo;

      return (this.target === "mawb" ? "/download-awb-pdf/" : "/download-hawb-pdf/") + key;
    },
    targetLabel() {
      const t = TARGETS.find((x) => x.key === this.target);
      return t ? t.label : this.target;
    },
    /* A draft needs a NUMBER before anything else — it is the document's identity and,
       for a master, its primary key. Extraction can be empty; the number cannot. */
    canSave() {
      return this.target === "mawb"
        ? /^\d{3}$/.test(this.awbCode) && /^\d{8}$/.test(this.awbNo)
        : String(this.hawbNo).trim().length > 0;
    },
    draftIdentity() {
      return this.target === "mawb"
        ? { target: "mawb", awbCode: this.awbCode, awbNo: this.awbNo }
        : { target: "hawb", hawbNo: this.hawbNo };
    },
    /** Every resolved field, flattened — what the mapper turns into a payload. */
    flatFields() {
      const out = {};

      GROUPS.forEach((g) => {
        const r = this.resolved[g.key];
        if (!r.source) return;

        Object.keys(r.fields || {}).forEach((k) => { out[k] = r.fields[k]; });
      });

      // The paste wins over anything a document said, at the field level too.
      Object.keys(this.pastedFields).forEach((k) => { out[k] = this.pastedFields[k]; });

      return out;
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
  watch: {
    /* Immediate, because the job lookup usually resolves before the panel is opened —
       and only when the field is EMPTY, so it never overwrites a number being typed. */
    prefillAwb: { immediate: true, handler: "applyPrefill" },
  },
  created() {
    this.loadAddressBook();
    this.loadCountries();
  },
  methods: {
    /**
     * The branch's saved parties, for the pickers.
     *
     * ⚠️ Failure is silent: a picker that could not load costs a lookup, not the ability
     * to work, and the fields stay typeable either way.
     */
    loadAddressBook() {
      Object.keys(ADDRESS_TYPES).forEach((party) => {
        ApiService.get("/user/saved-addresses?address_type=" + ADDRESS_TYPES[party])
          .then(({ data }) => {
            const rows = (data && (data.data || data.addresses || data)) || [];
            this.$set(this.savedAddresses, party, Array.isArray(rows) ? rows : []);
          })
          .catch(() => { this.$set(this.savedAddresses, party, []); });
      });
    },
    /** The form stores a country as its 2-letter code; this is the list that turns "India" into IN. */
    loadCountries() {
      ApiService.get("/user/get-country")
        .then(({ data }) => { this.countries = data || {}; })
        .catch(() => { this.countries = {}; });
    },
    /** Country names as the 2-letter codes the form stores. A name the list does not know is left as written. */
    withCountryCodes(fields) {
      const out = { ...fields };

      PARTY_BLOCKS.forEach((party) => {
        const key = party + "_country";
        const code = out[key] === undefined ? null : countryCode(raw(out[key]), this.countries);

        if (code) out[key] = { value: code, confidence: (out[key] && out[key].confidence) || "high" };
      });

      return out;
    },
    savedFor(party) {
      return this.savedAddresses[party] || [];
    },
    /**
     * Take a saved party wholesale.
     *
     * 🔴 It overwrites the extraction, and should: a saved address is a party this branch
     * has already checked and used, which outranks anything read off a scan.
     */
    useSaved(party, id) {
      if (!id) return;

      const type = ADDRESS_TYPES[party];
      const prefix = party === "notify" ? "also" : party === "shipper" ? "ship" : "cons";
      const route = party === "notify" ? "alsonotify" : party;

      ApiService.get("/user/get-" + route + "-address?id=" + id + "&address_type=" + type)
        .then(({ data }) => {
          const map = {
            "": prefix + "_name", _address: prefix + "_address", _city: prefix + "_city",
            _state: prefix + "_state", _post_code: prefix + "_post_code",
            _country: prefix + "_country",
          };

          Object.keys(map).forEach((suffix) => {
            const value = data[map[suffix]];
            if (value) this.$set(this.manual, party + suffix, { value, confidence: "high" });
          });
        })
        .catch((e) => { this.saveError = this.messageFor(e); });
    },
    /**
     * Make a party's fields fit THIS document's rules, and say what changed.
     *
     * ⚠️ Applies the safe changes (spacing, charset, country case) and REPORTS an
     * over-length rather than cutting it: which part of an address matters is a judgement,
     * and the machine does not have it.
     */
    fit(party) {
      const source = {};

      ["", "_address", "_city", "_state", "_post_code", "_country"].forEach((suffix) => {
        const key = party + suffix;
        const node = this.sourceField(key, "parties");

        if (node !== undefined) source[key] = node;
      });

      const result = cleanParty(this.target, party, source);

      Object.keys(result.values).forEach((key) => {
        this.$set(this.manual, key, { value: result.values[key], confidence: "high" });
      });

      this.fitReport = result.changes.length
        ? { party, changes: result.changes, overLimit: result.overLimit }
        : { party, changes: ["already fits — nothing to change"], overLimit: false };
    },
    /**
     * Fill the number from the job, without ever clobbering the operator.
     *
     * ⚠️ Split on the FIRST hyphen only. `jobs.awb_number` is `176-10000008`, and a
     * naive split on every hyphen would silently drop anything after a second one.
     */
    applyPrefill() {
      const value = String(this.prefillAwb || "").trim();
      if (!value || this.awbCode || this.awbNo) return;

      const at = value.indexOf("-");
      if (at === -1) return;

      this.awbCode = value.slice(0, at);
      this.awbNo = value.slice(at + 1);
    },
    /**
     * One field, from the paste or from the document assigned to `groupKey`.
     *
     * 🔴 **Deliberately does NOT read `resolved`.** The derived weights are needed BY
     * `resolved` (to summarise the Weights row), so reading it back would close a loop —
     * `resolved` → volumetric → flatFields → `resolved` — which Vue renders as
     * "Maximum call stack size exceeded" and a blank panel. Measured, on this component.
     */
    sourceField(key, groupKey) {
      // 🔴 A value the operator chose or fitted outranks everything: it is the most recent
      // statement of fact about this shipment, and it is the one they can see.
      if (this.manual[key] !== undefined) return this.manual[key];

      if (this.pastedFields[key] !== undefined) return this.pastedFields[key];

      const uid = this.assignment[groupKey];
      const doc = this.documents.find((d) => d.uid === uid);

      return doc && doc.state === "ready" && doc.fields ? doc.fields[key] : undefined;
    },
    /**
     * Can this document be read without paying for vision?
     *
     * 🔴 ANSWERED BEFORE UPLOAD, in the browser. pdfjs-dist is already bundled, so the
     * text layer can be inspected the moment a file is staged — no round trip, no job
     * record, no credit. The alternative was what the operator had: press Extract, wait
     * for the queue, and learn only then that the document was a scan.
     *
     * ⚠️ AN ADVANCE WARNING, NOT THE DECISION. The server reads every page with PyMuPDF
     * and its answer is the one that counts; this reads the first three, because a
     * 200-page file should not freeze the panel to answer a question the server will
     * answer properly anyway. On disagreement the upload proceeds — a probe that BLOCKED
     * on its own opinion would turn a cheap hint into a new way to lose a good document.
     */
    async probeTextLayer(doc) {
      try {
        const pdfjs = await import(/* webpackChunkName: "pdfjs" */ "pdfjs-dist/legacy/build/pdf");

        // 🔴 THE WORKER MUST BE IMPORTED, NOT SWITCHED OFF. Setting `workerSrc = ""` does
        // not disable it in pdfjs 2.x — the library still fetches a worker, from a path
        // that was never emitted. Laravel then answered that request with the SPA's own
        // index.html, and the browser reported `Unexpected token '<'`: a JavaScript error
        // whose real cause is a missing file being served as a web page.
        //
        // ⚠️ `pdf.worker.entry` is the packaged entry point. Importing it makes webpack
        // emit the worker as a real chunk and hands back its URL, so the path is whatever
        // the build actually produced rather than a guess.
        const worker = await import(
          /* webpackChunkName: "pdfjs-worker" */ "pdfjs-dist/legacy/build/pdf.worker.entry"
        );

        pdfjs.GlobalWorkerOptions.workerSrc = worker.default || worker;

        const buffer = await doc.file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: buffer }).promise;

        let characters = 0;
        const pages = Math.min(pdf.numPages, 3);

        for (let n = 1; n <= pages; n += 1) {
          const page = await pdf.getPage(n);
          const content = await page.getTextContent();
          characters += content.items.map((i) => i.str).join("").replace(/\s/g, "").length;

          if (characters >= TEXT_LAYER_MIN_CHARS) break;
        }

        // 🔴 Matches the server's own floor. A scanner leaves a page number behind, so
        // "any text at all" would call most scans readable — the two ends have to agree on
        // where the line is or they will contradict each other in front of the operator.
        doc.readable = characters >= TEXT_LAYER_MIN_CHARS ? "text" : "scan";
      } catch (e) {
        // An unreadable or encrypted PDF is not a verdict — let the server decide.
        doc.readable = "unknown";
      }
    },
    /**
     * Open the file dialog.
     *
     * ⚠️ Nothing awaits before `.click()`. Chrome requires the call to happen inside the
     * user gesture that triggered it; a promise in between silently loses the activation
     * and the dialog never opens — with no error anywhere to say why.
     */
    pick(event) {
      const input = this.$refs.picker;

      if (!input) {
        return;
      }

      // 🔴 THE INPUT LIVES INSIDE THE ZONE, so the `input.click()` below bubbles straight
      // back up to the zone's own handler and calls this again — two calls, two file
      // dialogs, the second one appearing the moment the first is dismissed. Measured: a
      // single click produced two.
      if (event && event.target === input) {
        return;
      }

      input.click();
    },
    onDrop(e) {
      this.dragging = false;
      this.add([...e.dataTransfer.files]);
    },
    onPick(e) {
      this.add([...e.target.files]);

      // 🔴 RESET, or the same file can only ever be chosen ONCE. `change` fires on a
      // change of value; re-picking the identical path leaves the value the same, no event
      // fires, and nothing happens. An operator who removes a document and picks it again
      // gets silence — and reasonably concludes the button is broken.
      e.target.value = "";
    },
    /**
     * Stage the PDFs, and say so when something is not one.
     *
     * 🔴 `f.type` IS NOT RELIABLE and filtering on it alone silently ate valid documents.
     * The browser leaves `type` as an empty string for files picked from some locations
     * and for drag-drop out of some applications — so a perfectly good PDF was dropped
     * with no row, no error and no explanation. That is what "the choose file button does
     * not work" was.
     *
     * ⚠️ The extension is the fallback, not the primary: a file that declares
     * `application/pdf` is taken at its word even if it is named oddly.
     */
    add(files) {
      const rejected = [];

      files.forEach((file) => {
        const looksLikePdf =
          file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");

        if (!looksLikePdf) {
          rejected.push(file.name || "a file");

          return;
        }

        // Staged, not read. The file is held until the operator asks for it — see the
        // Extract button.
        const doc = {
          uid: ++this.seq, name: file.name, file, kind: "other",
          state: "staged", fields: null, error: null, warning: null, jobId: null,
          // "text" | "scan" | "unknown" — filled by the probe a moment later.
          readable: "unknown",
        };

        this.documents.push(doc);
        this.probeTextLayer(doc);
      });

      // ⚠️ Named, not counted. "2 files ignored" leaves the operator checking which two;
      // the names tell them immediately whether it mattered.
      this.rejectedFiles = rejected;
    },
    extract(uid) {
      const doc = this.documents.find((d) => d.uid === uid);
      if (!doc) return;

      doc.state = "reading";
      doc.error = null;
      doc.warning = null;
      this.upload(doc);
    },
    remove(uid) {
      const doc = this.documents.find((d) => d.uid === uid);
      if (doc && doc.timer) clearInterval(doc.timer);

      // Whatever it was supplying is no longer supplied by anything.
      const next = { ...this.assignment };
      Object.keys(next).forEach((k) => { if (next[k] === uid) delete next[k]; });
      this.assignment = next;

      this.documents = this.documents.filter((d) => d.uid !== uid);
    },
    upload(doc) {
      const uid = doc.uid;
      const file = doc.file;

      const form = new FormData();
      form.append("upload_file", file);
      // 🔴 The routing service reads this. `ksr` matches a registered coordinate template
      // and goes to /extract; `unstructured` matches none and goes to
      // /extract-unstructured, which reads the text layer. The panel used to hardcode
      // `ksr` for everything, so an invoice was cropped at an airway bill's coordinates
      // and returned whatever text happened to sit at those boxes.
      form.append("type", doc.kind === "awb" ? "ksr" : "unstructured");

      ApiService.post("/user/upload-awb-file", form)
        .then(({ data }) => {
          const d = this.documents.find((x) => x.uid === uid);
          d.jobId = data.job_id || data.data;
          this.poll(uid);
        })
        .catch((e) => this.fail(uid, this.messageFor(e)));
    },
    setKind(uid, kind) {
      const doc = this.documents.find((d) => d.uid === uid);

      if (doc) {
        doc.kind = kind;
      }
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
              doc.fields = this.withCountryCodes(flattenCargo(flattenParties(data.fields || {}, this.countries)));
              // 🔴 Why the model did not read it, when it did not. The fields are then the
              // label reading, and without this they look exactly like the model's.
              doc.warning = data.model_error
                ? "read by labels only: " + data.model_error
                : null;
              doc.state = "ready";
            } else if (data.job_status === "awaiting_vision_consent") {
              // 🔴 THIS is when a scan is known to be a scan — the parser found no text
              // layer and said so. Until this was handled the job polled forever, because
              // the loop only ever looked for `completed` and `failed`.
              //
              // ⚠️ The panel used to WARN ABOUT THIS ON STAGING, before any document had
              // been read, for every file that was not an airway bill. A text PDF — the
              // common case, and the one that works — was greeted with a notice saying it
              // might not. A warning that fires when it is not true teaches operators to
              // ignore it for the times it is.
              clearInterval(timer);
              this.fail(
                uid,
                "no selectable text — this is a scan, and vision extraction is not "
                + "deployed yet. Use the paste box below."
              );
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
    /** A party as the operator reads it: the name, the address, then where it is. */
    partyText(party, groupKey) {
      const part = (suffix) => raw(this.sourceField(party + suffix, groupKey));
      const place = [
        part("_city") && "City: " + part("_city"),
        part("_state") && "State: " + part("_state"),
        part("_post_code") && "Post code: " + part("_post_code"),
        part("_country") && "Country: " + part("_country"),
      ].filter(Boolean).join(" · ");

      return [part(""), part("_address"), place].filter(Boolean).join("\n") || null;
    },
    /** Which group this document currently supplies, if any; "all" when it supplies every one. */
    groupsFrom(uid) {
      if (GROUPS.every((g) => this.assignment[g.key] === uid)) return "all";

      const found = GROUPS.find((g) => this.assignment[g.key] === uid);
      return found ? found.key : "";
    },
    /** Assigning a group to a document takes it away from whichever had it. */
    assign(groupKey, uid) {
      const next = { ...this.assignment };

      Object.keys(next).forEach((k) => {
        if (next[k] === uid) delete next[k];
      });

      // "All": this one document supplies every group, taking each from whichever had it.
      if (groupKey === "all") GROUPS.forEach((g) => { next[g.key] = uid; });
      else if (groupKey) next[groupKey] = uid;

      this.assignment = next;
    },
    /**
     * What the paste box says.
     *
     * 🔴 A PARTY IS A BLOCK. "Shipper:" (or just "Shipper"), then the whole address below it
     * the way it sits on an invoice; `parsePartyBlock` splits it into name, address, city,
     * state, post code and country. A blank line or the next label ends the block. Anything
     * else stays `Label: value`, one per line, and a "Shipper city: …" line still overrides
     * what the block gave.
     */
    parsePaste(text) {
      const found = {};
      const unknown = [];
      let block = null;

      const finish = () => {
        if (!block) return;

        const parts = parsePartyBlock(block.lines.join("\n"), this.countries);
        const suffix = { name: "", address: "_address", city: "_city", state: "_state", post_code: "_post_code", country: "_country" };

        Object.keys(suffix).forEach((part) => {
          if (parts[part]) found[block.party + suffix[part]] = { value: parts[part], confidence: "high" };
        });

        block = null;
      };

      String(text || "").split(/\r?\n/).forEach((line) => {
        if (!line.trim()) {
          finish();
          return;
        }

        const m = line.match(/^\s*([^:]{1,40}):\s*(.*?)\s*$/);
        const label = (m ? m[1] : line).trim().toLowerCase().replace(/[.:]+$/, "");
        const key = Object.keys(PASTE_KEYS).find((k) => PASTE_KEYS[k].includes(label));

        if (key && PARTY_BLOCKS.includes(key)) {
          finish();
          block = { party: key, lines: m && m[2] ? [m[2]] : [] };
          return;
        }

        if (key && m) {
          finish();
          // Typed by a person, so it is authoritative by definition — not a guess to score.
          if (m[2]) found[key] = { value: m[2], confidence: "high" };
          return;
        }

        // Inside a party, an unrecognised line is part of the address ("P.O Box: 9192").
        if (block) {
          block.lines.push(line.trim());
          return;
        }

        if (!key) unknown.push((m ? m[1] : line).trim().slice(0, 30));
      });

      finish();

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
        if (f.dimensions) parts.push(f.dimensions.value);
        if (f.goods) parts.push(f.goods.value);
      } else if (group.key === "weights") {
        if (f.gross_weight) parts.push("gross " + f.gross_weight.value + " kg");

        const vol = this.volumetric;
        if (vol) parts.push("volumetric " + vol + " kg");

        const chg = f.chargeable_weight ? f.chargeable_weight.value : this.chargeable;
        if (chg) parts.push("chargeable " + chg + " kg");
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
    /**
     * Create the draft through the SAME endpoint the form uses.
     *
     * ⚠️ Not a private "import" route. A draft written by a path the form does not use
     * would skip its validation and its job linking, and would drift the first time either
     * changed. This is the ordinary create, with fewer fields filled in.
     */
    saveDraft() {
      this.saving = true;
      this.saveError = null;

      // 🔴 A draft keeps what was COLLECTED. The endpoint used to refuse a party missing any
      // part, so this removed them first, and a draft from a real invoice saved only the AWB
      // number. With `status: "draft"` the endpoint stores what is there; the operator fills
      // the rest in the draft, and a send still requires every part.
      const fields = this.withCountryCodes({ ...this.flatFields });

      // ⚠️ Only a 2-letter code is accepted even in a draft, so a country the list did not
      // recognise is left off rather than failing the whole save.
      PARTY_BLOCKS.forEach((party) => {
        const key = party + "_country";
        if (fields[key] && !/^[A-Z]{2}$/.test(String(raw(fields[key])))) delete fields[key];
      });

      // 🔴 A CALCULATED chargeable weight is a SUGGESTION, not a fact. L×W×H×pcs ÷ 6000 is the
      // IATA rule, but that figure was neither on a document nor typed by anyone, and a draft
      // carries what was collected. It reaches the draft only once the operator enters it.
      const entered = parseFloat(this.chargeableEdit);

      if (!isNaN(entered) && !fields.chargeable_weight) {
        fields.chargeable_weight = { value: entered, confidence: "high" };
      }

      const payload = buildPayload(this.target, fields, {
        awbCode: this.awbCode, awbNo: this.awbNo, hawbNo: this.hawbNo,
      });

      // The form's own draft button sends this, and the endpoint keeps a partial party for it.
      payload.status = "draft";

      ApiService.post(createEndpoint(this.target), payload)
        .then(() => {
          // Straight to the draft that was just written, not to a blank form.
          this.draftUrl = formRoute(
            this.target,
            this.target === "mawb" ? masterKey(this.awbCode, this.awbNo) : this.hawbNo
          );
          this.$emit("apply", { fields: this.flatFields, identity: this.draftIdentity });
        })
        .catch((e) => { this.saveError = this.messageFor(e); })
        // ⚠️ The number is deliberately NOT cleared. The operator is usually still working
        // on the same waybill — generating its PDF, sharing it — and a field that empties
        // itself on save reads as the draft having been lost.
        .finally(() => { this.saving = false; });
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
