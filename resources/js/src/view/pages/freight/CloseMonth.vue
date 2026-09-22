<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Close the month</h1>
      <p class="fx-page-sub">
        {{ subtitle }}
        <router-link to="/financials">Registers &amp; reports →</router-link>
      </p>
    </header>

    <div class="fx-toolbar">
      <label v-if="periods.length" class="fx-field">
        <span class="fx-field__label">Period</span>
        <select v-model="periodId" class="fx-input" @change="load">
          <option v-for="p in periods" :key="p.id" :value="p.id">
            {{ p.period_name }}{{ branches.length > 1 ? " · " + branchName(p.agent_id) : "" }} · {{ p.status }}
          </option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!period" class="fx-muted">{{ note }}</p>

    <template v-else>
      <!--
        🔴 Six numbered steps, in order, each with a count. Closing a month used to be five separate screens with
        nothing to say whether you were done. ⚠️ Only step ③ BLOCKS — the others are warnings, because an unbilled
        shipment or a missing IRN is routinely still open on the day a month closes, and a checklist that refused
        for those is one people learn to override.
      -->
      <ol class="fx-steps">
        <li v-for="s in steps" :key="s.key" class="fx-steps__item" :class="{ 'is-clear': s.clear }">
          <span class="fx-steps__number" :class="{ 'is-done': s.clear, 'is-blocking': s.blocking && !s.clear }">
            {{ s.step }}
          </span>

          <div class="fx-steps__body">
            <h2 class="fx-steps__title">
              {{ s.label }}
              <StatusChip v-if="s.clear" value="clear" />
              <StatusChip v-else-if="s.blocking" value="blocking" />
              <StatusChip v-else value="check_this" />
              <span v-if="s.count" class="fx-muted">{{ s.count }}</span>
            </h2>
            <p class="fx-muted">{{ s.note }}</p>

            <!-- Step ⑥ carries figures rather than rows: it is the answer, not a worklist. -->
            <dl v-if="s.key === 'statements' && s.figures" class="fx-defs">
              <dt>Revenue</dt>
              <dd><Figure :value="s.figures.revenue" kind="currency" currency-code="INR" /></dd>
              <dt>Cost</dt>
              <dd><Figure :value="s.figures.expense" kind="currency" currency-code="INR" /></dd>
              <dt>Net</dt>
              <dd><strong><Figure :value="s.figures.net" kind="currency" currency-code="INR" /></strong></dd>
              <dt>Debits / credits</dt>
              <dd>
                <Figure :value="s.figures.debits" kind="currency" currency-code="INR" /> /
                <Figure :value="s.figures.credits" kind="currency" currency-code="INR" />
              </dd>
            </dl>

            <!--
              ④ The RETURN, which is the thing with a deadline. The register above it says what tax was
              charged; this says what can actually be filed, and what cannot.
              🔴 A GST return is filed per CALENDAR MONTH while a period here spans a year, so the month
              being filed is named — otherwise these figures look like they disagree with the tax charged.
            -->
            <template v-if="s.key === 'gst'">
              <p v-if="!s.gstin" class="fx-error">
                This branch has no GSTIN, so no return can be filed. Set it in
                <router-link to="/settings/finance">Settings → Finance</router-link>.
              </p>

              <template v-else-if="s.return">
                <p class="fx-muted">
                  A return is filed for one calendar month<template v-if="s.return_is_one_month_of">, and this
                  period covers {{ s.return_is_one_month_of }}</template>.
                </p>

                <div class="fx-toolbar">
                  <label class="fx-field">
                    <span class="fx-field__label">Month to file</span>
                    <select v-model="gstMonth" class="fx-input" @change="loadReturn">
                      <option v-for="m in s.return_months" :key="m.month" :value="m.month">
                        {{ m.month }} — {{ m.documents }} document(s)
                      </option>
                    </select>
                  </label>
                </div>

                <p v-if="gstLoading" class="fx-muted">Working out the return…</p>

                <dl v-else class="fx-defs">
                  <dt>Documents</dt>
                  <dd>{{ figuresFor(s).documents }}</dd>
                  <dt>Taxable value</dt>
                  <dd><Figure :value="figuresFor(s).taxable_value" kind="currency" currency-code="INR" /></dd>
                  <dt>CGST / SGST</dt>
                  <dd>
                    <Figure :value="figuresFor(s).cgst" kind="currency" currency-code="INR" /> /
                    <Figure :value="figuresFor(s).sgst" kind="currency" currency-code="INR" />
                  </dd>
                  <dt>IGST</dt>
                  <dd><Figure :value="figuresFor(s).igst" kind="currency" currency-code="INR" /></dd>
                  <dt>Tax</dt>
                  <dd><strong><Figure :value="figuresFor(s).tax" kind="currency" currency-code="INR" /></strong></dd>
                </dl>

                <!-- 🔴 The exceptions are the feature: a document nobody can see is a document nobody fixes. -->
                <p v-if="figuresFor(s).not_filed" class="fx-error">
                  {{ figuresFor(s).not_filed }} document(s) worth
                  <Figure :value="figuresFor(s).not_filed_value" kind="currency" currency-code="INR" />
                  cannot be filed. They are listed in the file, at the bottom, with what is missing from each.
                </p>
                <!--
                  Two kinds of warning, both on documents that ARE filed: a split the register disagrees with,
                  and a charge line with no HSN/SAC, which the summary section cannot hold even though the
                  invoice itself files fine. Both are listed in the file with which one applies to which.
                -->
                <p v-if="figuresFor(s).warnings" class="fx-muted">
                  {{ figuresFor(s).warnings }} document(s) are filed with something to check — a split the
                  register disagrees with, or a charge line with no HSN/SAC code. Both are named in the file.
                </p>

                <div class="fx-toolbar">
                  <button class="fx-btn" :disabled="downloading" @click="download('gstr1', 'csv')">
                    GSTR-1 (CSV)
                  </button>
                  <button class="fx-btn" :disabled="downloading" @click="download('gstr1', 'gstn')">
                    GSTR-1 (portal JSON)
                  </button>
                  <button class="fx-btn" :disabled="downloading" @click="download('gstr3b', 'csv')">
                    GSTR-3B (CSV)
                  </button>
                </div>
              </template>
            </template>

            <template v-else-if="s.rows && s.rows.length">
              <button class="fx-btn fx-btn--ghost" @click="open === s.key ? (open = null) : (open = s.key)">
                {{ open === s.key ? "Hide" : "Show" }} {{ s.rows.length }}{{ s.count > s.rows.length ? " of " + s.count : "" }}
              </button>

              <table v-if="open === s.key" class="fx-table">
                <thead>
                  <tr>
                    <th scope="col">{{ s.key === "billed" ? "Shipment" : "Document" }}</th>
                    <th scope="col">{{ s.key === "billed" ? "Finished" : "Organization" }}</th>
                    <th class="fx-num" scope="col">Amount</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in s.rows" :key="s.key + '-' + i">
                    <td class="identifier">{{ r.job_no || r.number || r.invoice_no || "—" }}</td>
                    <td>
                      <template v-if="s.key === 'billed'">
                        <Figure v-if="r.completed_at" :value="r.completed_at" kind="date" />
                        <span v-else class="fx-muted">—</span>
                      </template>
                      <template v-else>{{ r.customer || "—" }}</template>
                    </td>
                    <td class="fx-num">
                      <Figure v-if="r.grand_total || r.net_amount"
                              :value="r.grand_total || r.net_amount" kind="currency" currency-code="INR" />
                      <span v-else class="fx-muted">—</span>
                    </td>
                    <td class="fx-muted">{{ r.waiting_for || r.gst_no || r.mode || "" }}</td>
                  </tr>
                </tbody>
              </table>
            </template>

            <div class="fx-toolbar">
              <router-link v-if="s.to" class="fx-btn" :to="s.to">
                {{ s.clear ? "Look anyway" : "Go and clear it" }}
              </router-link>

              <!-- ⑤ is the only step that does anything here, and it refuses in words. -->
              <button
                v-if="s.key === 'close' && period.status === 'open'"
                class="fx-btn fx-btn--primary"
                :disabled="busy || !canClose"
                @click="confirming = true"
              >{{ busy ? "Closing…" : "Close " + period.period_name }}</button>

              <!--
                🔴 Closing used to be a one-way door. Only the LATEST closed month may be reopened: an older one
                reopened while newer ones stay closed makes every later month's opening figures a lie.
              -->
              <button
                v-if="s.key === 'close' && s.can_reopen"
                class="fx-btn"
                :disabled="busy"
                @click="reopening = { reason: '' }"
              >Reopen {{ period.period_name }}</button>
              <span v-else-if="s.key === 'close' && s.reopen_blocked_by" class="fx-muted">
                Reopen {{ s.reopen_blocked_by }} first.
              </span>
            </div>
          </div>
        </li>
      </ol>

      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
    </template>

    <!-- Reopening a month that has been reported on is a serious act, so it asks and it keeps the reason. -->
    <div v-if="reopening" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="reopen-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="reopen-title" class="fx-modal__title">Reopen {{ period.period_name }}?</h2>
        </header>
        <div class="fx-modal__body">
          <p>
            Documents dated inside {{ period.period_name }} will be able to post again. Anything already reported
            from this month — the P&amp;L, the balance sheet, a filed return — was worked out on the figures as
            they stand now, and posting into it will move them.
          </p>
          <label class="fx-field">
            <span class="fx-field__label">Why are you reopening it?</span>
            <input v-model="reopening.reason" class="fx-input" placeholder="the airline's September invoice arrived late" />
          </label>
          <p class="fx-muted">It stays on the period, with your name and today's date.</p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="reopening = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !reopening.reason.trim()" @click="reopen">
            Reopen it
          </button>
        </footer>
      </div>
    </div>

    <!-- Closing is the one irreversible thing on this page, so it asks. -->
    <div v-if="confirming" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="close-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="close-title" class="fx-modal__title">Close {{ period.period_name }}?</h2>
        </header>
        <div class="fx-modal__body">
          <p>
            Nothing will be able to post into {{ period.period_name }} afterwards — an invoice dated inside it
            will be refused at the ledger until somebody reopens it.
          </p>
          <p v-if="warnings.length" class="fx-muted">
            Still open, and not blocking: {{ warnings.join("; ") }}.
          </p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="confirming = false">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy" @click="close">Close it</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "CloseMonth",
  components: { Figure, StatusChip },
  data: () => ({
    steps: [], period: null, periods: [], branches: [], periodId: null,
    canClose: false, blockedBy: null, note: "", open: null, confirming: false, reopening: null,
    loading: true, busy: false, error: null, actionError: null, downloading: false,
    /** ④ The month being filed, and the figures for it when it is not the month the server offered. */
    gstMonth: null, gstFigures: null, gstLoading: false,
  }),
  computed: {
    subtitle() {
      if (!this.period) return "The months the ledger is open for.";

      return this.period.status !== "open"
        ? this.period.period_name + " is closed."
        : (this.canClose
          ? this.period.period_name + " is ready to close."
          : "Clear " + (this.blockedBy || "the blocking step") + " before " + this.period.period_name + " can close.");
    },
    /** What is still open but does not stop the close — said out loud in the confirmation, not hidden. */
    warnings() {
      return this.steps
        .filter((s) => !s.blocking && !s.clear && s.count > 0 && s.key !== "close")
        .map((s) => s.count + " " + s.label.replace("?", "").toLowerCase());
    },
  },
  created() {
    this.load();
  },
  methods: {
    /*
     * The return as a file. Two formats, both from the same computation:
     *   • csv  — what the desk reconciles by eye, exceptions included at the bottom
     *   • gstn — the offline utility's JSON
     * 🔴 The month comes from the SERVER's step, not from this component: a return is filed per calendar
     * month and the server decides which month that is for the selected period.
     */
    /* The server's figures for the month it chose, or the ones fetched for the month the desk picked. */
    figuresFor(step) {
      return this.gstFigures || step.return || {};
    },
    /*
     * ⚠️ The summary for a month other than the one the server offered comes from the RETURN endpoint, not
     * recomputed here — the figures on the screen and the figures in the file are then the same computation,
     * which is the only way a download can be trusted to match what was read before clicking it.
     */
    loadReturn() {
      const step = this.steps.find((s) => s.key === "gst");

      if (!step || !this.gstMonth || this.gstMonth === step.return_month) {
        this.gstFigures = null;

        return;
      }

      this.gstLoading = true;
      this.actionError = null;

      ApiService.query(`/reports/gstr1?agent_id=${this.period.agent_id}&month=${this.gstMonth}`)
        .then(({ data }) => {
          this.gstFigures = {
            documents: data.totals.documents,
            taxable_value: data.totals.taxable_value,
            cgst: data.totals.cgst,
            sgst: data.totals.sgst,
            igst: data.totals.igst,
            tax: data.totals.tax,
            not_filed: data.exceptions.length,
            not_filed_value: data.exceptions.reduce((t, e) => t + Number(e.taxable_value || 0), 0),
            warnings: data.warnings.length,
          };
        })
        .catch((e) => { this.actionError = this.messageFor(e); this.gstFigures = null; })
        .finally(() => { this.gstLoading = false; });
    },
    download(which, format) {
      const step = this.steps.find((s) => s.key === "gst");

      if (!step || !step.return_month) {
        this.actionError = "There is no month to file for yet.";

        return;
      }

      this.downloading = true;
      this.actionError = null;

      const month = this.gstMonth || step.return_month;
      const query = `?agent_id=${this.period.agent_id}&month=${month}&format=${format}`;

      ApiService.query(`/reports/${which}${query}`, { responseType: "blob" })
        .then(({ data }) => {
          const type = format === "csv" ? "text/csv" : "application/json";
          const url = window.URL.createObjectURL(new Blob([data], { type }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `${which.toUpperCase()}-${month}.${format === "csv" ? "csv" : "json"}`;
          link.click();
          setTimeout(() => window.URL.revokeObjectURL(url), 30000);
        })
        .catch(() => { this.actionError = "The return could not be built."; })
        .finally(() => { this.downloading = false; });
    },
    branchName(id) {
      const b = this.branches.find((x) => x.id === id);

      return b ? b.name : "—";
    },
    load() {
      this.loading = true;
      ApiService.get("/close-month" + (this.periodId ? "?period_id=" + this.periodId : ""))
        .then(({ data }) => {
          this.steps = data.steps || [];
          this.period = data.period;
          // ④ follows the server's chosen month until the desk picks another one.
          const gst = this.steps.find((x) => x.key === "gst");
          this.gstMonth = gst ? gst.return_month : null;
          this.gstFigures = null;
          this.periods = data.periods || [];
          this.branches = data.branches || [];
          this.canClose = !!data.can_close;
          this.blockedBy = data.blocked_by;
          this.note = data.note || "";
          if (this.period) this.periodId = this.period.id;
          this.error = null;
        })
        .catch((e) => {
          this.error = (e.response && e.response.data && e.response.data.error) || "The month could not be read.";
        })
        .finally(() => { this.loading = false; });
    },
    reopen() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/reports/periods/${this.period.id}/reopen`, { reason: this.reopening.reason })
        .then(() => { this.reopening = null; this.load(); })
        .catch((e) => {
          const data = e.response && e.response.data;
          this.actionError = (data && (data.error || data.message)) || "The period would not reopen.";
        })
        .finally(() => { this.busy = false; });
    },
    close() {
      this.busy = true;
      this.actionError = null;
      // 🔴 The server checks the unposted queue again independently — this screen shows the rule early, it does
      // not replace it.
      ApiService.post(`/reports/periods/${this.period.id}/close`, {})
        .then(() => { this.confirming = false; this.load(); })
        .catch((e) => {
          this.actionError = (e.response && e.response.data && e.response.data.error) || "The period would not close.";
        })
        .finally(() => { this.busy = false; });
    },
  },
};
</script>
