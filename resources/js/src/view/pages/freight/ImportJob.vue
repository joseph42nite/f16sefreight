<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">
        {{ data ? (data.mode === "air" ? "Air" : "Sea") + (data.document === "master" ? " Import Consol" : " Import") : "Import" }}
      </h1>
      <p v-if="data" class="fx-page-sub">
        <span class="identifier">{{ data.job.execution_job_no }}</span>
        <template v-if="data.client"> · {{ data.client }}</template>
        <template v-if="data.parent"> · on consol
          <router-link :to="'/import/' + data.parent.id" class="identifier">{{ data.parent.execution_job_no }}</router-link>
        </template>
        <!-- The sea bill itself — vessel, routing, containers — is the FocusSea form. -->
        <template v-if="data.mode === 'sea'"> · <router-link :to="'/focus-sea/' + data.job.id">Open the bill</router-link></template>
        · <router-link to="/manifest-filing">Manifest filing</router-link>
        · <router-link to="/import">All imports</router-link>
      </p>
    </header>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else-if="data">
      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>

      <!-- ── Arrival and customs ──────────────────────────────────────────── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Arrival &amp; customs</h2>

        <dl v-if="data.mode === 'sea' && data.details" class="fx-defs">
          <dt>{{ data.document === "master" ? "MBL" : "HBL" }}</dt>
          <dd class="identifier">{{ (data.document === "master" ? data.details.mbl_number : data.details.hbl_number) || "—" }}</dd>
          <dt>Vessel / voyage</dt><dd>{{ [data.details.vessel_name, data.details.voyage_no].filter(Boolean).join(" / ") || "—" }}</dd>
          <dt>From → to</dt><dd class="identifier">{{ data.details.pol_code || "—" }} → {{ data.details.pod_code || "—" }}</dd>
          <dt>ETA</dt><dd><Figure :value="data.details.eta" kind="date" /></dd>
        </dl>

        <div class="fx-toolbar">
          <template v-if="data.mode === 'air'">
            <label class="fx-field"><span class="fx-field__label">MAWB</span>
              <input v-model.trim="form.awb_number" class="fx-input identifier" placeholder="176-12345675" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Consol type</span>
              <select v-model="form.consol_type" class="fx-input" :disabled="!canWrite">
                <option :value="null">—</option>
                <option value="agent_consol">Agent consolidation</option>
                <option value="buyers_consol">Buyer's consolidation</option>
              </select></label>
            <label class="fx-field"><span class="fx-field__label">Carrier</span>
              <input v-model.trim="form.carrier_name" class="fx-input" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Flight</span>
              <input v-model.trim="form.flight_number" class="fx-input identifier" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Flight date</span>
              <input v-model="form.flight_date" type="date" class="fx-input" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">From</span>
              <input v-model.trim="form.pol_code" class="fx-input identifier" maxlength="3" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">To</span>
              <input v-model.trim="form.pod_code" class="fx-input identifier" maxlength="3" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Pieces</span>
              <input v-model.number="form.piece_count" type="number" min="0" class="fx-input fx-num" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Gross kg</span>
              <input v-model.number="form.gross_weight" type="number" step="0.001" min="0" class="fx-input fx-num" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Chargeable kg</span>
              <input v-model.number="form.chargeable_weight" type="number" step="0.001" min="0" class="fx-input fx-num" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Arrived</span>
              <input v-model="form.arrived_at" type="datetime-local" class="fx-input" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Free storage days</span>
              <input v-model.number="form.free_storage_days" type="number" min="0" class="fx-input fx-num" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Storage charges from</span>
              <input v-model="form.storage_from" type="date" class="fx-input" :disabled="!canWrite" /></label>
            <label class="fx-field"><span class="fx-field__label">Filing status</span>
              <select v-model="form.filing_status" class="fx-input" :disabled="!canWrite">
                <option v-for="s in FILING" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select></label>
          </template>
          <label class="fx-field"><span class="fx-field__label">IGM no</span>
            <input v-model.trim="form.igm_no" class="fx-input identifier" maxlength="20" :disabled="!canWrite" /></label>
          <label class="fx-field"><span class="fx-field__label">IGM date</span>
            <input v-model="form.igm_date" type="date" class="fx-input" :disabled="!canWrite" /></label>
          <label class="fx-field"><span class="fx-field__label">Handling agent</span>
            <select v-model="form.handling_agent_id" class="fx-input" :disabled="!canWrite">
              <option :value="null">—</option>
              <option v-for="a in data.agents" :key="a.id" :value="a.id">{{ a.name }}</option>
            </select></label>
          <button v-if="canWrite" class="fx-btn fx-btn--primary" :disabled="busy" @click="save">Save</button>
        </div>
      </section>

      <!-- ── Parties: the consignee is who the notice and the DO are addressed to ── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Parties</h2>
        <EntityPanel :key="'e' + jobId" :job-id="jobId" />
      </section>

      <!-- ── Houses on an import consol ─────────────────────────────────── -->
      <section v-if="data.document === 'master'" class="fx-section">
        <h2 class="fx-section__title">Houses ({{ data.houses.length }})</h2>
        <table class="fx-table">
          <tbody>
            <tr v-for="h in data.houses" :key="h.id">
              <td><router-link :to="'/import/' + h.id" class="identifier">{{ h.execution_job_no }}</router-link></td>
              <td class="identifier">{{ h.awb_number || "" }}</td>
            </tr>
            <tr v-if="!data.houses.length"><td class="fx-muted">No houses linked yet.</td></tr>
          </tbody>
        </table>
        <div v-if="canWrite" class="fx-toolbar">
          <label class="fx-field"><span class="fx-field__label">Import shipments with no consol</span>
            <select v-model="linkId" class="fx-input">
              <option value="">Choose…</option>
              <option v-for="j in candidates" :key="j.id" :value="j.id">{{ j.execution_job_no }}</option>
            </select></label>
          <button class="fx-btn" :disabled="!linkId || busy" @click="link">Link house</button>
        </div>
      </section>

      <!-- ── Arrival notice ──────────────────────────────────────────────── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Arrival notice</h2>
        <p v-if="data.arrival_notice">
          <span class="identifier">{{ data.arrival_notice.notice_number }}</span>
          · issued <Figure :value="data.arrival_notice.created_at" kind="date" />
          · <a href="#" @click.prevent="print('arrival-notice.pdf')">Print</a>
        </p>
        <template v-else>
          <p class="fx-muted">Not issued. Issuing gives it its number; nothing is sent to anyone.</p>
          <button v-if="canWrite" class="fx-btn" :disabled="busy" @click="issueNotice">Issue arrival notice</button>
        </template>
      </section>

      <!-- ── Delivery order — the print is the release, and the server decides it ── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Delivery order</h2>
        <p v-if="data.delivery_order" class="fx-muted">
          <span class="identifier">{{ data.delivery_order.do_number }}</span> <StatusChip :value="data.delivery_order.status" />
        </p>
        <p :class="data.release.allowed ? 'fx-muted' : 'fx-warn'" role="status">{{ data.release.message }}</p>

        <div class="fx-toolbar">
          <label class="fx-field"><span class="fx-field__label">DO date</span>
            <input v-model="order.do_date" type="date" class="fx-input" :disabled="!canEditDo" /></label>
          <label class="fx-field"><span class="fx-field__label">DO given to</span>
            <input v-model.trim="order.do_given_to" class="fx-input" maxlength="150" :disabled="!canEditDo" /></label>
          <label class="fx-field"><span class="fx-field__label">Against</span>
            <select v-model="order.can_id" class="fx-input" :disabled="!canEditDo">
              <option :value="null">—</option>
              <option v-if="data.arrival_notice" :value="data.arrival_notice.id">CAN {{ data.arrival_notice.notice_number }}</option>
            </select></label>
          <label class="fx-field"><span class="fx-field__label">Invoice</span>
            <select v-model="order.invoice_id" class="fx-input" :disabled="!canEditDo">
              <option :value="null">—</option>
              <option v-for="i in data.invoices" :key="i.id" :value="i.id">{{ i.invoice_no }}</option>
            </select></label>
          <label class="fx-field"><span class="fx-field__label">DO fee (INR)</span>
            <input v-model.number="order.fee" type="number" step="0.01" min="0" class="fx-input fx-num" :disabled="!canEditDo" /></label>
          <button v-if="canEditDo" class="fx-btn" :disabled="busy" @click="saveOrder">Save DO</button>
          <button v-if="canWrite && data.delivery_order" class="fx-btn fx-btn--primary" :disabled="busy || !data.release.allowed"
                  @click="print('delivery-order.pdf')">
            {{ data.delivery_order.status === "released" ? "Print DO again" : "Print DO (releases the cargo)" }}
          </button>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import EntityPanel from "@/view/pages/freight/components/EntityPanel.vue";

const FILING = [
  { value: "not_filed", label: "Not filed" }, { value: "submitted", label: "Submitted" },
  { value: "cleared", label: "Cleared" }, { value: "rejected", label: "Rejected" },
];
const AIR_FIELDS = ["awb_number", "consol_type", "carrier_name", "flight_number", "flight_date", "pol_code", "pod_code",
  "piece_count", "gross_weight", "chargeable_weight", "arrived_at", "free_storage_days", "storage_from", "filing_status"];

/** One import shipment, either mode (GAPS #434): arrival and customs, parties, houses, arrival notice, delivery order. */
export default {
  name: "ImportJob",
  components: { Figure, StatusChip, EntityPanel },
  props: { jobId: { type: [Number, String], required: true } },
  data: () => ({
    FILING, data: null, form: {}, order: {}, candidates: [], linkId: "",
    loading: false, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    canWrite() {
      return this.designation === "operations";
    },
    canEditDo() {
      return this.canWrite && !(this.data.delivery_order && this.data.delivery_order.status === "released");
    },
  },
  watch: {
    jobId() { this.load(); },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get(`/jobs/${this.jobId}/import`)
        .then(({ data }) => { this.bind(data); this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    bind(data) {
      this.data = data;
      const d = data.details || {};
      const imp = data.import || {};
      const f = { igm_no: (data.mode === "air" ? imp.igm_no : d.igm_no) || "",
        igm_date: ((data.mode === "air" ? imp.igm_date : d.igm_date) || "").slice(0, 10),
        handling_agent_id: (data.mode === "air" ? imp.handling_agent_id : d.handling_agent_id) || null };
      if (data.mode === "air") {
        Object.assign(f, {
          awb_number: data.job.awb_number || "", consol_type: data.job.consol_type || null,
          carrier_name: d.carrier_name || "", flight_number: d.flight_number || "",
          flight_date: (d.flight_date || "").slice(0, 10), pol_code: d.pol_code || "", pod_code: d.pod_code || "",
          piece_count: d.piece_count ?? null, gross_weight: d.gross_weight ?? null, chargeable_weight: d.chargeable_weight ?? null,
          arrived_at: (imp.arrived_at || "").replace(" ", "T").slice(0, 16), free_storage_days: imp.free_storage_days ?? null,
          storage_from: (imp.storage_from || "").slice(0, 10), filing_status: imp.filing_status || "not_filed",
        });
      }
      this.form = f;
      const o = data.delivery_order || {};
      this.order = { do_date: (o.do_date || "").slice(0, 10), do_given_to: o.do_given_to || "", can_id: o.can_id || null,
        invoice_id: o.invoice_id || null, fee: o.fee !== undefined && o.fee !== null ? Number(o.fee) : null };
      if (data.document === "master" && this.canWrite) {
        ApiService.get(`/jobs/unassociated?transport_mode=${data.mode}&direction=import`)
          .then(({ data: free }) => { this.candidates = (free.data || []).filter((j) => j.id !== data.job.id); })
          .catch(() => {});
      }
    },
    /** Blank strings are sent as nothing, so an empty box never overwrites a stored value with "". */
    clean(obj) {
      return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined));
    },
    commit(call) {
      this.busy = true;
      this.actionError = null;
      return call()
        .then(({ data }) => this.bind(data))
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    save() {
      const body = this.data.mode === "air" ? this.form : Object.fromEntries(Object.entries(this.form).filter(([k]) => !AIR_FIELDS.includes(k)));
      this.commit(() => ApiService.post(`/jobs/${this.jobId}/import`, this.clean(body)));
    },
    issueNotice() {
      this.commit(() => ApiService.post(`/jobs/${this.jobId}/arrival-notice`));
    },
    saveOrder() {
      this.commit(() => ApiService.post(`/jobs/${this.jobId}/delivery-order`, this.clean(this.order)));
    },
    link() {
      this.busy = true;
      ApiService.post(`/jobs/${this.jobId}/link-hbl`, { house_id: this.linkId })
        .then(() => { this.linkId = ""; this.load(); })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    /** A PDF fetched with the session and opened in a tab. A refusal (the DO gate) arrives as JSON inside the blob. */
    print(path) {
      const tab = window.open("", "_blank");
      this.actionError = null;
      ApiService.query(`/jobs/${this.jobId}/${path}`, { responseType: "blob" })
        .then(({ data }) => {
          const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
          if (tab) tab.location = url;
          else window.open(url, "_blank");
          setTimeout(() => window.URL.revokeObjectURL(url), 30000);
          if (path === "delivery-order.pdf") this.load();
        })
        .catch(() => {
          if (tab) tab.close();
          // The server's refusal is authoritative; reload to show why.
          this.actionError = "The document could not be printed.";
          this.load();
        });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat().join(" ");
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
