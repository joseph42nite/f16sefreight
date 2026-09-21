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
            </div>
          </div>
        </li>
      </ol>

      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
    </template>

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
    canClose: false, blockedBy: null, note: "", open: null, confirming: false,
    loading: true, busy: false, error: null, actionError: null,
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
