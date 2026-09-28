<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Manifest Filing</h1>
      <p class="fx-page-sub">CGM and SCMTR filings with ICEGATE — checked against its limits before anything is filed.</p>
    </header>

    <!--
      🔴 Says plainly what the system cannot do yet. Auto File is refused server-side (422) until ICEGATE is connected
      AND the message format is built from its specification; until then a filing made on ICEGATE is recorded here.
    -->
    <p v-if="connection && !connection.can_transmit" class="fx-warn" role="status">
      {{ connection.reason }} Filings made on ICEGATE directly can be recorded here (Manual or Email).
    </p>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Filing type</span>
        <select v-model="filters.filing_type" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Consol job no</span>
        <input v-model.trim="filters.job_no" class="fx-input" @keyup.enter="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Transaction status</span>
        <select v-model="filters.status" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Custom house</span>
        <input v-model.trim="filters.custom_house_code" class="fx-input identifier" maxlength="6" placeholder="INNSA1" @keyup.enter="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">From</span>
        <input v-model="filters.from" type="date" class="fx-input" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">To</span>
        <input v-model="filters.to" type="date" class="fx-input" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">ICEGATE ID</span>
        <input v-model.trim="filters.icegate_id" class="fx-input identifier" maxlength="20" @keyup.enter="load" />
      </label>
      <button class="fx-btn" @click="load">Search</button>
      <button v-if="canWrite" class="fx-btn fx-btn--primary" @click="openSubmit">Submit CGM Data</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Filed</th>
          <th scope="col">Type</th>
          <th scope="col">Consol job</th>
          <th class="fx-num" scope="col">Amendment</th>
          <th scope="col">Custom house</th>
          <th scope="col">ICEGATE ID</th>
          <th scope="col">Method</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in filings" :key="f.id">
          <td>{{ when(f.filed_at) }}</td>
          <td>{{ f.filing_type }}</td>
          <td>
            <router-link v-if="f.job" :to="'/focus-sea/' + f.job.id" class="identifier">
              {{ f.job.execution_job_no || f.job.id }}
            </router-link>
          </td>
          <td class="fx-num">{{ f.amendment_no }}</td>
          <td class="identifier">{{ f.custom_house_code || "—" }}</td>
          <td class="identifier">{{ f.icegate_id }}</td>
          <td>{{ methodLabel(f.sending_method) }}</td>
          <td>{{ statusLabel(f.status) }}</td>
          <td class="fx-row-actions">
            <button class="fx-btn fx-btn--ghost" @click="logFor = f">Log</button>
            <button v-if="canWrite && f.status === 'submitted'" class="fx-btn fx-btn--ghost" @click="openOutcome(f)">
              Record answer
            </button>
          </td>
        </tr>
        <tr v-if="!filings.length">
          <td colspan="9" class="fx-muted">No filings match.</td>
        </tr>
      </tbody>
    </table>

    <!-- ── Submit CGM Data — PRD §5.8 ───────────────────────────────────────── -->
    <div v-if="submit" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="submit-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="submit-title" class="fx-modal__title">Submit CGM Data</h2>
        </header>
        <div class="fx-modal__body">
          <div class="fx-toolbar">
            <label class="fx-field">
              <span class="fx-field__label">Consol no</span>
              <select v-model="submit.job_id" class="fx-input" @change="check">
                <option value="">Choose…</option>
                <option v-for="m in masters" :key="m.id" :value="m.id">
                  {{ m.execution_job_no || ("Job " + m.id) }}{{ m.mbl_number ? " · " + m.mbl_number : "" }}
                </option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Filing type</span>
              <select v-model="submit.filing_type" class="fx-input">
                <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Date / time</span>
              <input v-model="submit.filed_at" type="datetime-local" class="fx-input" />
            </label>
          </div>
          <div class="fx-toolbar">
            <label class="fx-field">
              <span class="fx-field__label">CGM file at (custom house)</span>
              <input v-model.trim="submit.custom_house_code" class="fx-input identifier" maxlength="6" placeholder="INNSA1" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">ICEGATE ID</span>
              <input v-model.trim="submit.icegate_id" class="fx-input identifier" maxlength="20" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Sending method</span>
              <select v-model="submit.sending_method" class="fx-input">
                <option value="auto" :disabled="!connection || !connection.can_transmit">Auto File</option>
                <option value="manual">Manual</option>
                <option value="email">Email</option>
              </select>
            </label>
          </div>
          <p class="fx-muted">The amendment number is given by the system: 0 for the first filing, then one more each time.</p>

          <!-- Read-only, monospace — the validation output, every violation in one pass. -->
          <pre class="fx-log" aria-live="polite">{{ logText }}</pre>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" @click="submit = null">Close</button>
          <!-- DSC signing needs ICEGATE's own signature tool; shown so the screen matches the PRD, not usable yet. -->
          <button class="fx-btn" disabled title="Needs ICEGATE's signature tool and a DSC token — not connected yet">Send for Signature</button>
          <button class="fx-btn" disabled title="Needs ICEGATE's signature tool — not connected yet">Get Signature Tool</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !canSubmit" @click="send">Submit</button>
        </footer>
      </div>
    </div>

    <!-- ── The gateway's answer, typed in from ICEGATE's acknowledgement ─────── -->
    <div v-if="outcomeFor" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="outcome-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="outcome-title" class="fx-modal__title">
            ICEGATE's answer — {{ outcomeFor.filing_type }} amendment {{ outcomeFor.amendment_no }}
          </h2>
        </header>
        <div class="fx-modal__body">
          <label class="fx-field">
            <span class="fx-field__label">Answer</span>
            <select v-model="outcomeFor.answer" class="fx-input">
              <option value="cleared">Cleared</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Note</span>
            <input v-model="outcomeFor.note" class="fx-input" maxlength="500" placeholder="what ICEGATE said" />
          </label>
          <p v-if="outcomeFor.answer === 'rejected'" class="fx-muted">
            A rejected filing stays as it is. Fix the bill, then submit again as the next amendment.
          </p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="outcomeFor = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy" @click="recordOutcome">Record</button>
        </footer>
      </div>
    </div>

    <!-- ── Status log, read-only ─────────────────────────────────────────────── -->
    <div v-if="logFor" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="log-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="log-title" class="fx-modal__title">{{ logFor.filing_type }} amendment {{ logFor.amendment_no }} — status log</h2>
        </header>
        <div class="fx-modal__body">
          <pre class="fx-log">{{ (logFor.status_log || []).map(logLine).join("\n") || "No entries." }}</pre>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" @click="logFor = null">Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";

// Tab 11's words — the filing and the bill read the same status.
const STATUSES = [
  { value: "submitted", label: "Submitted" },
  { value: "cleared", label: "Cleared" },
  { value: "rejected", label: "Rejected" },
];

export default {
  name: "ManifestFiling",
  data: () => ({
    types: ["CGM", "SCMTR"],
    statuses: STATUSES,
    filters: { filing_type: "", job_no: "", status: "", custom_house_code: "", from: "", to: "", icegate_id: "" },
    filings: [], masters: [], connection: null,
    submit: null, outcomeFor: null, logFor: null, violations: null,
    loading: false, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    canWrite() {
      return this.designation === "operations";
    },
    canSubmit() {
      const s = this.submit;
      return s && s.job_id && s.icegate_id && /^[A-Za-z0-9]{6}$/.test(s.custom_house_code)
        && this.violations !== null && !this.violations.some((v) => v.severity === "blocking");
    },
    logText() {
      if (!this.submit || !this.submit.job_id) return "Choose a consol to check it against ICEGATE's limits.";
      if (this.violations === null) return "Checking…";
      if (!this.violations.length) return "✓ No violations. Ready to file.";
      return this.violations.map((v) => `✗ [${v.rule}] ${v.message}`).join("\n");
    },
  },
  created() {
    this.load();
    ApiService.get("/icegate/status").then(({ data }) => { this.connection = data; }).catch(() => {});
  },
  methods: {
    load() {
      this.loading = true;
      const query = Object.entries(this.filters).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
      ApiService.get("/manifest-filings" + (query ? "?" + query : ""))
        .then(({ data }) => { this.filings = data.data || []; this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    openSubmit() {
      this.actionError = null;
      this.violations = null;
      this.submit = { job_id: "", filing_type: "CGM", filed_at: "", custom_house_code: "", icegate_id: "", sending_method: "manual" };
      if (!this.masters.length) {
        ApiService.get("/sea-shipments")
          .then(({ data }) => { this.masters = (data.data || []).filter((j) => j.document === "master"); })
          .catch((e) => { this.actionError = this.readable(e); });
      }
    },
    check() {
      this.violations = null;
      if (!this.submit.job_id) return;
      ApiService.get(`/jobs/${this.submit.job_id}/manifest-check`)
        .then(({ data }) => { this.violations = data.violations; })
        .catch((e) => { this.actionError = this.readable(e); });
    },
    send() {
      this.busy = true;
      this.actionError = null;
      const { job_id, ...body } = this.submit;
      if (!body.filed_at) delete body.filed_at;
      ApiService.post(`/jobs/${job_id}/manifest-filings`, body)
        .then(() => { this.submit = null; this.load(); })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          if (d.violations) this.violations = d.violations;
          this.actionError = this.readable(e);
        })
        .finally(() => { this.busy = false; });
    },
    openOutcome(filing) {
      this.actionError = null;
      this.outcomeFor = { ...filing, answer: "cleared", note: "" };
    },
    recordOutcome() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/manifest-filings/${this.outcomeFor.id}/outcome`, { status: this.outcomeFor.answer, note: this.outcomeFor.note || null })
        .then(() => { this.outcomeFor = null; this.load(); })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    when(at) {
      return at ? new Date(at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
    },
    methodLabel(m) {
      return { auto: "Auto File", manual: "Manual", email: "Email" }[m] || m;
    },
    statusLabel(s) {
      const found = STATUSES.find((x) => x.value === s);
      return found ? found.label : s;
    },
    logLine(entry) {
      return `${this.when(entry.at)}  ${entry.status.toUpperCase()}  ${entry.by || "system"}${entry.note ? " — " + entry.note : ""}`;
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
.fx-log {
  font-family: var(--font-mono, ui-monospace, monospace);
  white-space: pre-wrap;
  max-height: 14rem;
  overflow: auto;
  padding: 0.5rem;
  border: 1px solid var(--border, #ddd);
}
</style>
