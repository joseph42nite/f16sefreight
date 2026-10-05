<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">
        <template v-if="jobId">{{ document === "master" ? "Master Bill of Lading" : "House Bill of Lading" }}</template>
        <template v-else>Bills of Lading</template>
      </h1>
      <p class="fx-page-sub">
        <template v-if="jobId">
          <span class="identifier">{{ jobNo }}</span>
          <template v-if="client"> · {{ client.name }}</template>
          <template v-if="document === 'master'"> ·
            <router-link :to="{ path: '/focus-sea/consol', query: { master: jobId } }">Its houses and containers →</router-link>
          </template>
          <template v-if="parent"> · on master
            <router-link :to="'/focus-sea/' + parent.id" class="identifier">{{ parent.execution_job_no }}</router-link>
          </template>
          · <router-link to="/focus-sea">All bills</router-link>
          <!-- The printed BL (guide Step 12.3). Unnumbered, it prints as a DRAFT. -->
          · <a href="#" :aria-disabled="printing" @click.prevent="printBl">{{ printing ? "Preparing…" : "Print BL" }}</a>
        </template>
        <template v-else>Every sea shipment of the branch. A house is a client's shipment; a master is the carrier's bill a consol travels on.</template>
      </p>
    </header>

    <!-- ── The list: what FocusSea opens on ─────────────────────────────── -->
    <template v-if="!jobId">
      <div class="fx-toolbar">
        <label class="fx-field">
          <span class="fx-field__label">Find</span>
          <input v-model="q" class="fx-input" placeholder="Job no, HBL, MBL or client" @input="searchSoon" />
        </label>
        <div class="fx-seg" role="group" aria-label="Which bills">
          <button v-for="k in KINDS" :key="k.key" class="fx-btn" :class="{ 'fx-btn--primary': kind === k.key }" @click="kind = k.key">
            {{ k.label }}
          </button>
        </div>
        <!-- A master has no client enquiry behind it, so it starts here (owner, 2026-09-28). -->
        <button v-if="canWrite" class="fx-btn fx-btn--primary" :disabled="creating" @click="newMaster">
          {{ creating ? "Creating…" : "New master" }}
        </button>
      </div>
      <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

      <div class="fx-table-wrap">
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Shipment</th><th scope="col">Bill</th><th scope="col">Client</th>
              <th scope="col">BL no</th><th scope="col">Vessel</th><th scope="col">Route</th><th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in shown" :key="r.id" class="is-clickable" @click="$router.push('/focus-sea/' + r.id)">
              <td><router-link :to="'/focus-sea/' + r.id" class="identifier">{{ r.execution_job_no }}</router-link></td>
              <td>
                {{ r.document === "master" ? "Master" : "House" }}
                <span v-if="r.parent_no" class="fx-muted"> · on {{ r.parent_no }}</span>
                <span v-if="r.direction === 'import'" class="fx-muted"> · import</span>
              </td>
              <td>{{ r.client || "—" }}</td>
              <td class="identifier">{{ (r.document === "master" ? r.mbl_number : r.hbl_number) || "—" }}</td>
              <td>{{ r.vessel_name || "—" }}</td>
              <td class="identifier">{{ r.pol_code || "…" }} → {{ r.pod_code || "…" }}</td>
              <td>{{ r.status }}</td>
            </tr>
            <tr v-if="!shown.length && !loading"><td colspan="7" class="fx-muted">No sea shipments here yet.</td></tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ── One bill ─────────────────────────────────────────────────────── -->
    <template v-else>
      <p v-if="loading" class="fx-muted">Loading…</p>
      <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

      <template v-else>
        <!-- PRD §5.8 "Global header fields". -->
        <div class="fx-grid fx-sea-head">
          <label class="fx-field">
            <span class="fx-field__label">Cargo type</span>
            <!-- 🔴 The watcher is a convenience; the server enforces the same matrix. -->
            <select v-model="form.cargo_type" class="fx-input" :disabled="!canWrite">
              <option v-for="c in vocab.cargo_types" :key="c" :value="c">{{ labelOf(c) }}</option>
            </select>
          </label>
          <div class="fx-field">
            <span class="fx-field__label">Delivery mode</span>
            <span class="fx-input fx-input--static">{{ locking.delivery_mode || "—" }}</span>
          </div>
          <label class="fx-field">
            <span class="fx-field__label">Consol type</span>
            <select v-model="head.consol_type" class="fx-input" :disabled="!canWrite">
              <option :value="null">—</option>
              <option v-for="c in vocab.consol_types" :key="c" :value="c">{{ labelOf(c) }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Booking through</span>
            <select v-model="head.booking_thru" class="fx-input" :disabled="!canWrite">
              <option :value="null">—</option>
              <option v-for="c in vocab.booking_thru" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <Field v-model="head.planned_clearance_date" label="Shipment date" type="date" :disabled="!canWrite" />
          <Field v-model="head.job_order_no" label="Job order no" :disabled="!canWrite" mono hint="The client's own reference" />
          <Field v-model="head.quotation_no" label="Quotation no" :disabled="!canWrite" mono />
          <label v-if="document !== 'master' || head.parent_job_id" class="fx-field">
            <span class="fx-field__label">On master (sub-shipment)</span>
            <!-- Joining goes through the consol engine: the routing cascades down, the pieces roll up. -->
            <select v-model="head.parent_job_id" class="fx-input" :disabled="!canWrite">
              <option :value="null">— not in a consol</option>
              <option v-for="m in masters" :key="m.id" :value="m.id">{{ m.execution_job_no }}{{ m.mbl_number ? " · " + m.mbl_number : "" }}</option>
            </select>
          </label>
        </div>

        <p v-if="credit && credit.blocked" class="fx-error" role="alert">
          {{ client.name }} is over its credit limit — accounts will not finalize a bill for it until it pays or the limit is raised.
        </p>

        <!-- §5.4: what the FILING would refuse, shown at the keyboard. -->
        <p v-if="violations.length" class="fx-warn" role="status">
          {{ violations.length }} issue{{ violations.length === 1 ? "" : "s" }} would fail ICEGATE's structural check:
          <span v-for="(v, i) in violations" :key="i"> · {{ v.message }}</span>
        </p>

        <!-- Read a carrier's BL or booking into this bill (guide Step 12.4). Reading with AI is Tactical and up. -->
        <BlReader v-if="canWrite && tierAtLeast('tactical')" :job-id="jobId" @apply="takeReading" @parties="partiesTick++" />
        <p v-if="readNote" class="fx-notice" role="status">{{ readNote }}</p>

        <nav class="fx-drawer__tabs" role="tablist" aria-label="Document sections">
          <button
            v-for="t in TABS" :key="t.key"
            class="fx-drawer__tab" :class="{ 'is-active': tab === t.key, 'is-locked': isTabLocked(t.key) }"
            role="tab" :aria-selected="String(tab === t.key)" :disabled="isTabLocked(t.key)"
            @click="tab = t.key"
          >{{ t.n }}. {{ t.label }}</button>
        </nav>

        <section class="fx-form">
          <!-- 1 · Entity — the HBL/MBL party mapping. -->
          <EntityPanel v-if="tab === 'entity'" :key="'e' + jobId + '-' + partiesTick" :job-id="jobId" />

          <!-- 2 · Shipping -->
          <div v-else-if="tab === 'shipping'" class="fx-grid">
            <label class="fx-field">
              <span class="fx-field__label">Carrier</span>
              <select v-model="form.carrier_id" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </label>
            <Field v-model="form.vessel_name" label="Vessel name" :disabled="!canWrite || fromMaster.includes('vessel_name')" :hint="masterHint('vessel_name')" />
            <Field v-model="form.voyage_no" label="Voyage no" :disabled="!canWrite || fromMaster.includes('voyage_no')" :hint="masterHint('voyage_no')" />
            <Field v-model="form.vessel_flag" label="Flag" :disabled="!canWrite || fromMaster.includes('vessel_flag')" :hint="masterHint('vessel_flag')" />
            <Field v-model="form.imo_number" label="IMO" :disabled="!canWrite || fromMaster.includes('imo_number')" mono :hint="masterHint('imo_number') || '7 digits'" maxlength="7" />
            <Field v-model="form.service_contract_no" label="Service contract" :disabled="!canWrite" mono />
          </div>

          <!-- 3 · Routing -->
          <div v-else-if="tab === 'routing'" class="fx-grid">
            <Field v-for="p in PORTS" :key="p.key" v-model="form[p.key]" :label="p.label" :disabled="!canWrite || fromMaster.includes(p.key)" mono maxlength="5" :hint="masterHint(p.key) || 'UN/LOCODE'" @input="upper(p.key)" />
            <Field v-model="form.etd" label="ETD" type="date" :disabled="!canWrite" />
            <Field v-model="form.eta" label="ETA" type="date" :disabled="!canWrite" />
            <div class="fx-field">
              <span class="fx-field__label">Transit</span>
              <span class="fx-input fx-input--static">{{ transitDays === null ? "—" : transitDays + " days" }}</span>
            </div>
          </div>

          <!-- 4 · Goods -->
          <div v-else-if="tab === 'goods'" class="fx-grid">
            <label class="fx-field fx-field--wide">
              <span class="fx-field__label">Commodity</span>
              <textarea v-model="form.commodity_description" class="fx-input" rows="3" maxlength="500" :disabled="!canWrite"></textarea>
            </label>
            <Field v-model="form.hs_code" label="HS code" :disabled="!canWrite" mono hint="6 to 10 digits" maxlength="10" />
            <label class="fx-field fx-field--wide">
              <span class="fx-field__label">Marks &amp; numbers</span>
              <textarea v-model="form.marks_numbers" class="fx-input" rows="3" :disabled="!canWrite"></textarea>
            </label>
            <Field v-model="form.imdg_class" label="IMDG class" :disabled="!canWrite" />
            <Field v-model="form.un_number" label="UN number" :disabled="!canWrite" :hint="form.imdg_class ? 'Required once an IMDG class is set' : null" />
          </div>

          <!-- 5 · Item -->
          <div v-else-if="tab === 'item'" class="fx-grid">
            <Field v-model="form.package_code" label="Package code" :disabled="!canWrite" mono hint="≤ 3 chars (ICEGATE)" />
            <Field v-model.number="form.piece_count" label="Pieces" type="number" :disabled="!canWrite" />
            <Field v-model.number="form.gross_weight" label="Gross weight" type="number" :disabled="!canWrite" step="0.001" />
            <Field v-model.number="form.net_weight" label="Net weight" type="number" :disabled="!canWrite" step="0.001" />
            <Field v-model.number="form.chargeable_weight" label="Chargeable weight" type="number" :disabled="!canWrite" step="0.001" />
            <label class="fx-field">
              <span class="fx-field__label">Weight unit</span>
              <select v-model="form.weight_unit" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option v-for="u in vocab.weight_units" :key="u" :value="u">{{ u }}</option>
              </select>
            </label>
            <Field v-model.number="form.volume_cbm" label="Volume" type="number" :disabled="!canWrite" step="0.001"
                   :hint="locking.dimensions_required ? 'Mandatory for LCL — a box cannot be allocated without it' : null" />
            <label class="fx-field">
              <span class="fx-field__label">Volume unit</span>
              <select v-model="form.volume_unit" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option v-for="u in vocab.volume_units" :key="u" :value="u">{{ u }}</option>
              </select>
            </label>
            <!-- PRD: CBM computes from L×W×H. A helper, not a store: only the volume is declared. -->
            <div class="fx-field">
              <span class="fx-field__label">From L × W × H (cm)</span>
              <span class="fx-sea-dims">
                <input v-model.number="dims.l" class="fx-input" type="number" :disabled="!canWrite" aria-label="Length cm" />
                <input v-model.number="dims.w" class="fx-input" type="number" :disabled="!canWrite" aria-label="Width cm" />
                <input v-model.number="dims.h" class="fx-input" type="number" :disabled="!canWrite" aria-label="Height cm" />
                <button class="fx-btn" :disabled="!canWrite || !dimsCbm" @click="useDims">Use {{ dimsCbm || "—" }} CBM</button>
              </span>
            </div>
          </div>

          <!-- 6 · BL info -->
          <div v-else-if="tab === 'bl'" class="fx-grid">
            <Field v-model="form.mbl_number" label="MBL number" :disabled="!canWrite" mono hint="≤ 20 chars (ICEGATE)" />
            <Field v-if="document !== 'master'" v-model="form.hbl_number" label="HBL number" :disabled="!canWrite" mono hint="≤ 20 chars (ICEGATE)" />
            <Field v-model="form.bl_type" label="BL type" :disabled="!canWrite" />
            <label class="fx-field">
              <span class="fx-field__label">Release</span>
              <select v-model="form.release_type" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option v-for="r in vocab.release_types" :key="r" :value="r">{{ r }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Freight terms</span>
              <!-- Printed on the bill. It does not decide who is invoiced: that is always the client (owner, 2026-09-28). -->
              <select v-model="form.freight_terms" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option value="prepaid">Prepaid</option>
                <option value="collect">Collect</option>
              </select>
            </label>
          </div>

          <!-- 7 · Container -->
          <div v-else-if="tab === 'container'">
            <div class="fx-table-wrap">
              <table class="fx-table">
                <thead>
                  <tr><th scope="col">Container number</th><th scope="col">Size / type</th><th scope="col">Seal</th><th v-if="canWrite" scope="col"></th></tr>
                </thead>
                <tbody>
                  <tr v-for="(c, i) in containers" :key="i" :class="{ 'is-review': c.number && !isValidBox(c.number) }">
                    <td>
                      <input v-model="c.number" class="fx-input identifier" :disabled="!canWrite" maxlength="11" @input="c.number = c.number.toUpperCase()" />
                      <!-- 🔴 ISO 6346, as you type and again on the server: the terminal gate reads the check digit. -->
                      <span v-if="c.number && !isValidBox(c.number)" class="fx-field__error">Fails the ISO 6346 check digit</span>
                    </td>
                    <td>
                      <select v-model="c.type" class="fx-input" :disabled="!canWrite">
                        <option :value="null">—</option>
                        <option v-for="t in vocab.container_types" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </td>
                    <td><input v-model="c.seal" class="fx-input" :disabled="!canWrite" maxlength="15" /></td>
                    <td v-if="canWrite" class="fx-row-actions"><button class="fx-btn fx-btn--ghost" aria-label="Remove container" @click="containers.splice(i, 1)">✕</button></td>
                  </tr>
                  <tr v-if="!containers.length"><td :colspan="canWrite ? 4 : 3" class="fx-muted">No containers yet.</td></tr>
                </tbody>
              </table>
            </div>
            <button v-if="canWrite" class="fx-btn" style="margin-top: var(--space-3)" @click="containers.push({ number: '', type: null, seal: '' })">Add container</button>
          </div>

          <!-- 8 · Pick up -->
          <div v-else-if="tab === 'pickup'" class="fx-grid">
            <label class="fx-field">
              <span class="fx-field__label">Haulage provider</span>
              <select v-model="form.haulage_provider_id" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </label>
            <label class="fx-field fx-field--wide">
              <span class="fx-field__label">Pick-up address</span>
              <textarea v-model="head.pickup_address" class="fx-input" rows="3" maxlength="500" :disabled="!canWrite"></textarea>
            </label>
            <Field v-model="form.empty_depot" label="Empty depot" :disabled="!canWrite" />
          </div>

          <!-- 9 · Charges — the job's cost sheet, still decoupled from the manifest (§6.7). -->
          <p v-else-if="(tab === 'charges' || tab === 'financials') && !canSeeCosts" class="fx-muted">
            The charges and their totals are the cost sheet, which pricing and accounts keep on the Command plan —
            nothing on this bill changes them, and they change nothing here.
          </p>
          <CostSheet v-else-if="tab === 'charges'" :key="'c' + jobId" :job-id="jobId" />

          <!-- 10 · Financials -->
          <div v-else-if="tab === 'financials'">
            <p v-if="!sheet" class="fx-muted">Loading…</p>
            <dl v-else class="fx-defs">
              <dt>Sell</dt><dd><Figure :value="sheet.sell.total" kind="currency" currency-code="INR" /></dd>
              <template v-if="sheet.buy">
                <dt>Cost</dt><dd><Figure :value="sheet.buy.total" kind="currency" currency-code="INR" /></dd>
              </template>
              <template v-if="sheet.margin">
                <dt>Estimated profit</dt>
                <dd>
                  <Figure :value="sheet.margin.value" kind="currency" currency-code="INR" />
                  <!-- A margin on nothing billed is not 0% — it is not measured yet. -->
                  <span class="fx-muted"> · {{ sheet.margin.percent === null ? "no margin until something is billed" : Number(sheet.margin.percent).toFixed(2) + "%" }}</span>
                </dd>
              </template>
            </dl>
            <p class="fx-muted">Figures are before tax. Lines are edited on the Charges tab; the bill goes to {{ client ? client.name : "the client" }}.</p>
          </div>

          <!-- 11 · Customs -->
          <div v-else-if="tab === 'customs'" class="fx-grid">
            <Field v-model="form.shipping_bill_no" label="Shipping bill no" :disabled="!canWrite" mono />
            <Field v-model="form.shipping_bill_date" label="Shipping bill date" type="date" :disabled="!canWrite" />
            <label class="fx-field">
              <span class="fx-field__label">Filing status</span>
              <select v-model="form.filing_status" class="fx-input" :disabled="!canWrite">
                <option v-for="s in ['not_filed', 'submitted', 'cleared', 'rejected']" :key="s" :value="s">{{ labelOf(s) }}</option>
              </select>
            </label>
          </div>

          <!-- 12 · E-Docket -->
          <div v-else-if="tab === 'edocket'">
            <div v-if="canWrite" class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">Document type</span>
                <select v-model="upload.type" class="fx-input">
                  <option v-for="t in docTypes" :key="t" :value="t">{{ labelOf(t) }}</option>
                </select>
              </label>
              <label class="fx-field">
                <span class="fx-field__label">File</span>
                <input ref="file" type="file" class="fx-input" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc,.csv" />
              </label>
              <button class="fx-btn" :disabled="upload.busy" @click="sendFile">{{ upload.busy ? "Scanning…" : "Upload" }}</button>
            </div>
            <p v-if="upload.error" class="fx-error" role="alert">{{ upload.error }}</p>
            <div class="fx-table-wrap">
              <table class="fx-table">
                <thead><tr><th scope="col">Type</th><th scope="col">File</th><th scope="col">By</th><th scope="col">When</th></tr></thead>
                <tbody>
                  <tr v-for="d in documents" :key="d.id">
                    <td>{{ labelOf(d.document_type) }}</td>
                    <td><a href="#" @click.prevent="openDoc(d)">{{ d.file_name }}</a></td>
                    <td>{{ d.uploader ? d.uploader.name : "—" }}</td>
                    <td>{{ fmtDate(d.created_at) }}</td>
                  </tr>
                  <tr v-if="!documents.length"><td colspan="4" class="fx-muted">No documents yet.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer v-if="canWrite" class="fx-form__foot">
          <p v-if="saveError" class="fx-error" role="alert">{{ saveError }}</p>
          <p v-if="saved" class="fx-muted" role="status">Saved.</p>
          <button class="fx-btn fx-btn--primary" :disabled="saving || hasBadBox" @click="save">{{ saving ? "Saving…" : "Save" }}</button>
        </footer>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import { date as formatDate } from "@/core/config/format";
import Field from "@/view/pages/freight/components/Field.vue";
import Figure from "@/view/pages/freight/components/Figure.vue";
import EntityPanel from "@/view/pages/freight/components/EntityPanel.vue";
import BlReader from "@/view/pages/freight/components/BlReader.vue";
import CostSheet from "@/view/pages/freight/components/CostSheet.vue";

/* PRD §5.8 — twelve tabs, in the document's own order. */
const TABS = [
  { n: 1, key: "entity", label: "Entity" },
  { n: 2, key: "shipping", label: "Shipping Dtls." },
  { n: 3, key: "routing", label: "Routing" },
  { n: 4, key: "goods", label: "Goods Dtls." },
  { n: 5, key: "item", label: "Item" },
  { n: 6, key: "bl", label: "BL Info" },
  { n: 7, key: "container", label: "Container" },
  { n: 8, key: "pickup", label: "Pick Up" },
  { n: 9, key: "charges", label: "Charges" },
  { n: 10, key: "financials", label: "Financials" },
  { n: 11, key: "customs", label: "Customs" },
  { n: 12, key: "edocket", label: "E-Docket" },
];

const PORTS = [
  { key: "por_code", label: "Place of receipt" },
  { key: "pol_code", label: "Port of loading" },
  { key: "ts1_code", label: "Transshipment 1" },
  { key: "ts2_code", label: "Transshipment 2" },
  { key: "ts3_code", label: "Transshipment 3" },
  { key: "pod_code", label: "Port of discharge" },
  { key: "del_code", label: "Place of delivery" },
];

const KINDS = [
  { key: "all", label: "All" },
  { key: "house", label: "Houses" },
  { key: "master", label: "Masters" },
];

/* What the form sends back of the header — the job's own columns. */
const HEAD = ["consol_type", "booking_thru", "job_order_no", "quotation_no", "planned_clearance_date", "pickup_address", "parent_job_id"];

/* The detail columns the server takes; anything else in `details` (ids, stamps) stays home. */
const DETAIL = [
  "carrier_id", "vessel_name", "voyage_no", "vessel_flag", "imo_number", "service_contract_no",
  "por_code", "pol_code", "pod_code", "del_code", "ts1_code", "ts2_code", "ts3_code", "etd", "eta",
  "commodity_description", "hs_code", "marks_numbers", "imdg_class", "un_number",
  "package_code", "piece_count", "gross_weight", "net_weight", "chargeable_weight", "weight_unit", "volume_cbm", "volume_unit",
  "mbl_number", "hbl_number", "bl_type", "release_type", "freight_terms",
  "haulage_provider_id", "empty_depot", "shipping_bill_no", "shipping_bill_date", "filing_status",
];

export default {
  name: "FocusSeaMaster",
  components: { Field, Figure, EntityPanel, CostSheet, BlReader },
  props: { jobId: { type: [Number, String], default: null } },
  data: () => ({
    rows: [], q: "", kind: "all", creating: false, printing: false, searchTimer: null,
    jobNo: null, document: "house", client: null, parent: null, credit: null, fromMaster: [],
    form: {}, head: {}, containers: [], locking: {}, violations: [],
    vocab: { cargo_types: [], container_types: [], consol_types: [], booking_thru: [], weight_units: [], volume_units: [], release_types: [] },
    partners: [], masters: [], sheet: null, documents: [], docTypes: [],
    dims: { l: null, w: null, h: null },
    upload: { type: "other", busy: false, error: null },
    readNote: null, partiesTick: 0,
    tab: "entity", loading: false, saving: false, saved: false, error: null, saveError: null,
    TABS, PORTS, KINDS,
  }),
  computed: {
    ...mapGetters(["designation", "tier", "tierAtLeast"]),
    /* The server's viewCostSheet gate, mirrored so the tab says whose it is instead of failing. */
    canSeeCosts() {
      return ["pricing", "accounts", "boss"].includes(this.designation) && this.tierAtLeast("command");
    },
    /* Operations writes the bill; pricing and the Boss read it. The server re-checks. */
    canWrite() {
      // Core has one login type, so every Core user writes the bills; from Tactical, operations (owner, 2026-09-29).
      return this.tier === "core" || this.designation === "operations";
    },
    shown() {
      return this.kind === "all" ? this.rows : this.rows.filter((r) => r.document === this.kind);
    },
    hasBadBox() {
      return this.containers.some((c) => c.number && !this.isValidBox(c.number));
    },
    transitDays() {
      if (!this.form.etd || !this.form.eta) return null;
      return Math.round((new Date(this.form.eta) - new Date(this.form.etd)) / 86400000);
    },
    dimsCbm() {
      const { l, w, h } = this.dims;
      return l > 0 && w > 0 && h > 0 ? Number(((l * w * h) / 1e6).toFixed(3)) : null;
    },
  },
  watch: {
    jobId: { immediate: true, handler() { this.jobId ? this.load() : this.list(); } },
    /* The matrix, applied at once; the server refuses the same things whatever the form does. */
    "form.cargo_type": function (type) {
      const containerised = type === "fcl" || type === "liquid_cont";
      this.locking = Object.assign({}, this.locking, {
        delivery_mode: containerised ? "fcl" : (type === "lcl" ? "lcl" : null),
        containers_enabled: containerised,
        dimensions_required: type === "lcl",
      });
      if (!containerised) this.containers = [];
    },
    tab(t) {
      if (t === "financials" && this.canSeeCosts) this.loadSheet();
      if (t === "edocket") this.loadDocs();
    },
  },
  created() {
    ApiService.get("/partners").then(({ data }) => { this.partners = data.data || []; }).catch(() => {});
  },
  methods: {
    printBl() {
      if (this.printing) return;
      this.printing = true;
      // Opened first, while the click still counts, so the browser does not block it as a pop-up.
      const tab = window.open("", "_blank");
      ApiService.query(`/jobs/${this.jobId}/bl.pdf`, { responseType: "blob" })
        .then(({ data }) => {
          const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
          if (tab) tab.location = url;
          else window.open(url, "_blank");
          setTimeout(() => window.URL.revokeObjectURL(url), 30000);
        })
        .catch(() => { if (tab) tab.close(); this.error = "The bill of lading could not be printed."; })
        .finally(() => { this.printing = false; });
    },
    labelOf(v) {
      return String(v || "").replace(/_/g, " ");
    },
    fmtDate(v) {
      return formatDate(v);
    },
    /* On a house that travels on a master, the vessel and ports are the master's (the cascade). */
    masterHint(key) {
      return this.fromMaster.includes(key) && this.parent ? "From master " + this.parent.execution_job_no : null;
    },
    upper(key) {
      if (this.form[key]) this.form[key] = String(this.form[key]).toUpperCase();
    },
    list() {
      this.loading = true;
      ApiService.get("/sea-shipments" + (this.q ? "?q=" + encodeURIComponent(this.q) : ""))
        .then(({ data }) => { this.rows = data.data || []; this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    searchSoon() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(this.list, 300);
    },
    newMaster() {
      this.creating = true;
      ApiService.post("/sea-shipments", {})
        .then(({ data }) => { this.$router.push("/focus-sea/" + data.job.id); })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.creating = false; });
    },
    /**
     * ISO 6346 — four letters, six digits, one check digit. The same computation the server and the filer run.
     */
    isValidBox(raw) {
      const n = String(raw || "").toUpperCase().trim();
      if (!/^[A-Z]{4}\d{7}$/.test(n)) return false;
      let sum = 0;
      for (let i = 0; i < 10; i++) {
        const ch = n[i];
        let v;
        if (/[A-Z]/.test(ch)) {
          v = ch.charCodeAt(0) - 65 + 10;
          [11, 22, 33].forEach((skip) => { if (v >= skip) v++; }); // the letter table skips 11, 22 and 33
        } else {
          v = Number(ch);
        }
        sum += v * Math.pow(2, i);
      }
      return (sum % 11) % 10 === Number(n[10]);
    },
    apply(data) {
      this.jobNo = data.job.execution_job_no;
      this.document = data.document;
      this.client = data.client;
      this.parent = data.parent;
      this.credit = data.credit;
      this.fromMaster = data.from_master || [];
      this.vocab = data.vocabulary;
      this.violations = data.violations || [];
      const d = data.details || {};
      this.form = { cargo_type: data.job.cargo_type };
      DETAIL.forEach((k) => { this.$set(this.form, k, d[k] === undefined ? null : d[k]); });
      if (!this.form.filing_status) this.form.filing_status = "not_filed";
      this.head = {};
      HEAD.forEach((k) => { this.$set(this.head, k, data.job[k] === undefined ? null : data.job[k]); });
      if (this.head.planned_clearance_date) this.head.planned_clearance_date = String(this.head.planned_clearance_date).slice(0, 10);
      this.containers = (data.containers || []).map((c) => ({ number: c.container_number, type: c.container_type, seal: c.seal_number }));
      this.$nextTick(() => { this.locking = data.locking; });
    },
    load() {
      this.loading = true;
      this.saveError = null;
      this.saved = false;
      this.sheet = null;
      ApiService.get(`/jobs/${this.jobId}/sea-shipment`)
        .then(({ data }) => { this.apply(data); this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
      // The masters a house could travel on.
      ApiService.get("/sea-shipments")
        .then(({ data }) => { this.masters = (data.data || []).filter((r) => r.document === "master" && String(r.id) !== String(this.jobId)); })
        .catch(() => {});
    },
    loadSheet() {
      ApiService.get(`/jobs/${this.jobId}/cost-sheet`).then(({ data }) => { this.sheet = data; }).catch(() => {});
    },
    loadDocs() {
      ApiService.get(`/jobs/${this.jobId}/documents`)
        .then(({ data }) => { this.documents = data.documents || []; this.docTypes = data.types || []; })
        .catch((e) => { this.upload.error = this.readable(e); });
    },
    sendFile() {
      const file = this.$refs.file && this.$refs.file.files[0];
      if (!file) { this.upload.error = "Choose a file first."; return; }
      const body = new FormData();
      body.append("document_type", this.upload.type);
      body.append("file", file);
      this.upload.busy = true;
      this.upload.error = null;
      ApiService.post(`/jobs/${this.jobId}/documents`, body)
        .then(() => { this.$refs.file.value = ""; this.loadDocs(); })
        .catch((e) => { this.upload.error = this.readable(e); })
        .finally(() => { this.upload.busy = false; });
    },
    openDoc(d) {
      ApiService.query(`/jobs/${this.jobId}/documents/${d.id}`, { responseType: "blob" })
        .then(({ data }) => { window.open(URL.createObjectURL(data), "_blank"); })
        .catch((e) => { this.upload.error = this.readable(e); });
    },
    /**
     * What a read BL says, into the form — the operator checks it and saves (guide Step 12.4). A house keeps what its
     * master gives it; containers join the ones already typed, never replace them.
     */
    takeReading({ fields, containers }) {
      const skipped = [];
      Object.keys(fields).forEach((k) => {
        const key = k === "bl_number" ? (this.document === "master" ? "mbl_number" : "hbl_number") : k;
        if (this.fromMaster.includes(key)) skipped.push(key);
        else this.$set(this.form, key, fields[k]);
      });
      let boxes = "";
      if (containers.length && this.locking.containers_enabled) {
        containers.forEach((c) => {
          if (!this.containers.some((h) => h.number === c.container_number)) this.containers.push({ number: c.container_number, type: null, seal: c.seal_number });
        });
      } else if (containers.length) {
        boxes = " The containers were not added: this cargo type carries none on this bill.";
      }
      this.readNote = "Taken from the document — check each tab, then Save."
        + (skipped.length ? " Left as the master has them: " + skipped.join(", ").replace(/_/g, " ") + "." : "") + boxes;
    },
    useDims() {
      this.form.volume_cbm = this.dimsCbm;
      this.form.volume_unit = "CBM";
    },
    isTabLocked(key) {
      return key === "container" && !this.locking.containers_enabled;
    },
    save() {
      this.saving = true;
      this.saveError = null;
      this.saved = false;
      const payload = Object.assign({}, this.form, this.head);
      if (this.locking.containers_enabled) {
        payload.containers = this.containers
          .filter((c) => c.number)
          .map((c) => ({ container_number: c.number, container_type: c.type || null, seal_number: c.seal || null }));
      }
      ApiService.post(`/jobs/${this.jobId}/sea-shipment`, payload)
        .then(({ data }) => { this.apply(data); this.saved = true; })
        /* §11.3 — the server's reason, verbatim. */
        .catch((e) => { this.saveError = this.readable(e); })
        .finally(() => { this.saving = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat().join(" ");
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>

<style scoped>
.fx-sea-head { margin-bottom: var(--space-4); }
.fx-sea-dims { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
.fx-sea-dims .fx-input { width: 5.5rem; }
.fx-field--wide { grid-column: 1 / -1; }
.fx-seg { display: flex; gap: var(--space-1); align-self: flex-end; }
</style>
