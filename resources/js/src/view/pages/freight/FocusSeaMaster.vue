<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">FocusSea — Master Bill of Lading</h1>
      <p class="fx-page-sub">
        <span v-if="jobNo" class="identifier">{{ jobNo }}</span>
        <span v-else>Select a sea shipment to open its document.</span>
      </p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Shipment</span>
        <select v-model="jobId" class="fx-input" @change="load">
          <option value="">Choose…</option>
          <option v-for="j in jobs" :key="j.id" :value="j.id">
            {{ j.execution_job_no || ("Job " + j.id) }}
          </option>
        </select>
      </label>

      <label v-if="jobId" class="fx-field">
        <span class="fx-field__label">Cargo type</span>
        <!--
          🔴 THE WATCHER IS A CONVENIENCE. Changing this enables or clears tabs
          immediately, but the same matrix is enforced server-side — an LCL shipment
          carrying containers is a manifest that contradicts itself, and the API
          refuses it whatever the form does.
        -->
        <select v-model="form.cargo_type" class="fx-input" :disabled="!canWrite">
          <option v-for="c in vocab.cargo_types" :key="c" :value="c">{{ labelOf(c) }}</option>
        </select>
      </label>

      <div v-if="jobId" class="fx-field">
        <span class="fx-field__label">Delivery mode</span>
        <!-- Derived from cargo type, never typed: the matrix says what it must be. -->
        <span class="fx-input fx-input--static">{{ locking.delivery_mode || "—" }}</span>
      </div>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else-if="jobId">
      <!--
        §5.4 the violations the FILING would refuse, shown here — at the keyboard,
        not at the gateway. An operator who learns about a 21-character MBL from
        ICEGATE has already burned a submission.
      -->
      <p v-if="violations.length" class="fx-warn" role="status">
        {{ violations.length }} issue{{ violations.length === 1 ? "" : "s" }} would fail
        structural validation at filing:
        <span v-for="(v, i) in violations" :key="i"> · {{ v.message }}</span>
      </p>

      <nav class="fx-drawer__tabs" role="tablist" aria-label="Document sections">
        <button
          v-for="t in TABS"
          :key="t.key"
          class="fx-drawer__tab"
          :class="{ 'is-active': tab === t.key, 'is-locked': isTabLocked(t.key) }"
          role="tab"
          :aria-selected="String(tab === t.key)"
          :disabled="isTabLocked(t.key)"
          @click="tab = t.key"
        >{{ t.n }}. {{ t.label }}</button>
      </nav>

      <section class="fx-form">
        <!-- 2 · Shipping details -->
        <div v-if="tab === 'shipping'" class="fx-grid">
          <Field v-model="form.vessel_name" label="Vessel name" :disabled="!canWrite" />
          <Field v-model="form.voyage_no" label="Voyage no" :disabled="!canWrite" />
          <Field v-model="form.vessel_flag" label="Flag" :disabled="!canWrite" />
          <Field v-model="form.imo_number" label="IMO (7 digits)" :disabled="!canWrite" hint="^[0-9]{7}$" />
        </div>

        <!-- 3 · Routing -->
        <div v-else-if="tab === 'routing'" class="fx-grid">
          <Field v-model="form.por_code" label="POR" :disabled="!canWrite" mono />
          <Field v-model="form.pol_code" label="POL" :disabled="!canWrite" mono />
          <Field v-model="form.pod_code" label="POD" :disabled="!canWrite" mono />
          <Field v-model="form.del_code" label="DEL" :disabled="!canWrite" mono />
        </div>

        <!-- 4 · Goods -->
        <div v-else-if="tab === 'goods'" class="fx-grid">
          <Field v-model="form.imdg_class" label="IMDG class" :disabled="!canWrite" />
          <!--
            ⚠️ An IMDG class REQUIRES a UN number, and the two live on the same tab
            here precisely because the PRD puts them apart and that is how the rule
            gets missed. The server refuses the save either way.
          -->
          <Field
            v-model="form.un_number"
            label="UN number"
            :disabled="!canWrite"
            :hint="form.imdg_class ? 'Required once an IMDG class is set' : null"
          />
        </div>

        <!-- 5 · Item -->
        <div v-else-if="tab === 'item'" class="fx-grid">
          <Field v-model.number="form.piece_count" label="Pieces" type="number" :disabled="!canWrite" />
          <Field v-model.number="form.gross_weight" label="Gross weight (kg)" type="number" :disabled="!canWrite" />
          <Field v-model.number="form.net_weight" label="Net weight (kg)" type="number" :disabled="!canWrite" />
          <Field v-model.number="form.chargeable_weight" label="Chargeable weight (kg)" type="number" :disabled="!canWrite" />
          <Field
            v-model.number="form.volume_cbm"
            label="Volume (CBM)"
            type="number"
            :disabled="!canWrite"
            :hint="locking.dimensions_required ? 'Mandatory for LCL — a box cannot be allocated without it' : null"
          />
        </div>

        <!-- 6 · BL info -->
        <div v-else-if="tab === 'bl'" class="fx-grid">
          <Field v-model="form.mbl_number" label="MBL number" :disabled="!canWrite" mono hint="≤ 20 chars (ICEGATE)" />
          <Field v-model="form.hbl_number" label="HBL number" :disabled="!canWrite" mono hint="≤ 20 chars (ICEGATE)" />
          <label class="fx-field">
            <span class="fx-field__label">Freight terms</span>
            <select v-model="form.freight_terms" class="fx-input" :disabled="!canWrite">
              <option value="">—</option>
              <!-- §5.8 tab 6: terms drive billing direction — prepaid bills the
                   shipper, collect bills the consignee. -->
              <option value="prepaid">Prepaid — invoice the shipper</option>
              <option value="collect">Collect — invoice the consignee</option>
            </select>
          </label>
        </div>

        <!-- 7 · Container -->
        <div v-else-if="tab === 'container'">
          <p v-if="!locking.containers_enabled" class="fx-muted">
            {{ labelOf(form.cargo_type) }} carries no containers on this document<template
              v-if="form.cargo_type === 'lcl'"> — LCL boxes are managed at master level</template>.
          </p>

          <template v-else>
            <label class="fx-field" style="margin-bottom: var(--space-3)">
              <span class="fx-field__label">Size / type</span>
              <select v-model="form.container_type" class="fx-input" :disabled="!canWrite">
                <option value="">—</option>
                <option v-for="t in vocab.container_types" :key="t" :value="t">{{ t }}</option>
              </select>
            </label>

            <table class="fx-table">
              <thead>
                <tr>
                  <th scope="col">Container number</th>
                  <th scope="col">Seal</th>
                  <th v-if="canWrite" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(c, i) in containers" :key="i" :class="{ 'is-review': c.number && !isValidBox(c.number) }">
                  <td>
                    <input v-model="c.number" class="fx-input identifier" :disabled="!canWrite" maxlength="11" />
                    <!--
                      🔴 ISO 6346 CHECKED AS YOU TYPE, and again on the server. The
                      check digit is what the terminal gate reads — catching it here
                      costs a correction; catching it there turns a truck away.
                    -->
                    <span v-if="c.number && !isValidBox(c.number)" class="fx-field__error">
                      Fails the ISO 6346 check digit
                    </span>
                  </td>
                  <td><input v-model="c.seal" class="fx-input" :disabled="!canWrite" maxlength="15" /></td>
                  <td v-if="canWrite" class="fx-row-actions">
                    <button class="fx-btn fx-btn--ghost" @click="containers.splice(i, 1)">✕</button>
                  </td>
                </tr>
                <tr v-if="!containers.length">
                  <td colspan="3" class="fx-muted">No containers yet.</td>
                </tr>
              </tbody>
            </table>

            <button v-if="canWrite" class="fx-btn" style="margin-top: var(--space-3)" @click="containers.push({ number: '', seal: '' })">
              Add container
            </button>
          </template>
        </div>

        <!-- 11 · Customs -->
        <div v-else-if="tab === 'customs'" class="fx-grid">
          <Field v-model="form.shipping_bill_no" label="Shipping bill no" :disabled="!canWrite" mono />
          <Field v-model="form.shipping_bill_date" label="Shipping bill date" type="date" :disabled="!canWrite" />
          <label class="fx-field">
            <span class="fx-field__label">Filing status</span>
            <select v-model="form.filing_status" class="fx-input" :disabled="!canWrite">
              <option v-for="s in ['not_filed', 'submitted', 'cleared', 'rejected']" :key="s" :value="s">
                {{ labelOf(s) }}
              </option>
            </select>
          </label>
        </div>

        <!--
          Tabs 1, 8, 9, 10 and 12 read or write other records — job_entities, the cost
          sheet, job_documents — and are named rather than hidden so an unfinished tab
          cannot be mistaken for a broken one.
        -->
        <p v-else class="fx-muted">
          {{ tabLabel }} reads {{ tabSource }}, which is not wired into this form yet.
          <template v-if="tab === 'charges' || tab === 'financials'">
            The cost sheet is on the inbox drawer today (§6.7).
          </template>
        </p>
      </section>

      <footer v-if="canWrite" class="fx-form__foot">
        <p v-if="saveError" class="fx-error" role="alert">{{ saveError }}</p>
        <button class="fx-btn fx-btn--primary" :disabled="saving || hasBadBox" @click="save">
          {{ saving ? "Saving…" : "Save" }}
        </button>
      </footer>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Field from "@/view/pages/freight/components/Field.vue";

/* PRD §5.8 — twelve tabs, in the document's own order. */
const TABS = [
  { n: 1, key: "entity", label: "Entity", source: "job_entities" },
  { n: 2, key: "shipping", label: "Shipping Dtls." },
  { n: 3, key: "routing", label: "Routing" },
  { n: 4, key: "goods", label: "Goods Dtls." },
  { n: 5, key: "item", label: "Item" },
  { n: 6, key: "bl", label: "BL Info" },
  { n: 7, key: "container", label: "Container" },
  { n: 8, key: "pickup", label: "Pick Up", source: "haulage details" },
  { n: 9, key: "charges", label: "Charges", source: "the cost sheet" },
  { n: 10, key: "financials", label: "Financials", source: "aggregates" },
  { n: 11, key: "customs", label: "Customs" },
  { n: 12, key: "edocket", label: "E-Docket", source: "job_documents" },
];

export default {
  name: "FocusSeaMaster",
  components: { Field },
  data: () => ({
    jobs: [], jobId: "", jobNo: null,
    form: {}, containers: [], locking: {}, vocab: { cargo_types: [], container_types: [] },
    violations: [], tab: "shipping",
    loading: false, saving: false, error: null, saveError: null,
    TABS,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Operations writes the manifest; pricing reads it. The server re-checks. */
    canWrite() {
      return this.designation === "operations";
    },
    tabLabel() {
      const t = TABS.find((x) => x.key === this.tab);
      return t ? t.label : this.tab;
    },
    tabSource() {
      const t = TABS.find((x) => x.key === this.tab);
      return (t && t.source) || "another record";
    },
    hasBadBox() {
      return this.containers.some((c) => c.number && !this.isValidBox(c.number));
    },
  },
  watch: {
    /* The matrix, applied immediately. Clearing containers here mirrors what the
       server would refuse, so the operator is never left holding a payload that
       cannot save. */
    "form.cargo_type": function (type) {
      const containerised = type === "fcl" || type === "liquid_cont";
      this.locking = {
        delivery_mode: containerised ? "fcl" : (type === "lcl" ? "lcl" : null),
        containers_enabled: containerised,
        dimensions_required: type === "lcl",
      };
      if (!containerised) this.containers = [];
    },
  },
  created() {
    ApiService.get("/jobs?transport_mode=sea")
      .then(({ data }) => { this.jobs = (data.data || []).filter((j) => j.transport_mode === "sea"); })
      .catch((e) => { this.error = this.readable(e); });
  },
  methods: {
    labelOf(v) {
      return String(v || "").replace(/_/g, " ");
    },
    /**
     * ISO 6346 — four letters, six digits, one check digit.
     *
     * 🔴 The same computation the server and the manifest filer run. A mistyped
     * container number is rejected at the TERMINAL GATE, not at filing, so catching
     * it while the operator is still typing is the difference between a correction
     * and a truck turned away.
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
          /* The letter table skips 11, 22 and 33. */
          [11, 22, 33].forEach((skip) => { if (v >= skip) v++; });
        } else {
          v = Number(ch);
        }
        sum += v * Math.pow(2, i);
      }
      return (sum % 11) % 10 === Number(n[10]);
    },
    load() {
      if (!this.jobId) return;
      this.loading = true;
      this.saveError = null;

      ApiService.get(`/jobs/${this.jobId}/sea-shipment`)
        .then(({ data }) => {
          this.jobNo = data.job.execution_job_no;
          this.form = Object.assign({ cargo_type: data.job.cargo_type }, data.details || {});
          this.containers = (data.containers || []).map((c) => ({ number: c.container_number, seal: c.seal_number }));
          this.locking = data.locking;
          this.vocab = data.vocabulary;
          this.violations = data.violations || [];
          this.error = null;
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    isTabLocked(key) {
      return key === "container" && !this.locking.containers_enabled;
    },
    save() {
      this.saving = true;
      this.saveError = null;

      const payload = Object.assign({}, this.form);
      delete payload.id;
      delete payload.job_id;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.deleted_at;

      if (this.locking.containers_enabled) {
        payload.containers = this.containers
          .filter((c) => c.number)
          .map((c) => ({ container_number: c.number, seal_number: c.seal || null }));
      }

      ApiService.post(`/jobs/${this.jobId}/sea-shipment`, payload)
        .then(({ data }) => {
          this.violations = data.violations || [];
          this.locking = data.locking;
        })
        /* §11.3 — the server's reason, verbatim. "Container CSQU3054384 fails the ISO
           6346 check digit" tells the operator what to do; "save failed" does not. */
        .catch((e) => { this.saveError = this.readable(e); })
        .finally(() => { this.saving = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
