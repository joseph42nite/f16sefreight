<template>
  <div>
    <header v-if="!embedded" class="fx-page-head">
      <h1 class="fx-page-title">Profitability</h1>
      <p class="fx-page-sub">
        {{ subtitleForView }}
        <router-link to="/financials">Financials →</router-link>
      </p>
    </header>

    <!--
      Three views of ONE calculation (user, 2026-09-20). A client roll-up that disagreed with the shipments under
      it would leave the desk choosing which screen to believe, so the two roll-ups are the shipment list grouped.
    -->
    <!-- Inside How we're doing the page's own view bar is the navigation; this one would be a second copy. -->
    <div v-if="!embedded" class="fx-toolbar fx-financials__views">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="fx-btn"
        :class="{ 'fx-btn--primary': view === v.key }"
        @click="showView(v.key)"
      >{{ v.label }}</button>
    </div>

    <div class="fx-toolbar">
      <label v-if="branches.length > 1" class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="filters.agent_id" class="fx-input" @change="load">
          <option :value="null">All branches</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Client</span>
        <select v-model="filters.customer_id" class="fx-input" @change="load">
          <option :value="null">Every client</option>
          <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Mode</span>
        <select v-model="filters.mode" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="m in modes" :key="m" :value="m">{{ m }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">From</span>
        <input v-model="filters.origin" class="fx-input" placeholder="BOM" maxlength="5" @keyup.enter="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">To</span>
        <input v-model="filters.dest" class="fx-input" placeholder="FRA" maxlength="5" @keyup.enter="load" />
      </label>
      <label class="fx-field">
        <!-- ⚠️ The window is on the SHIPMENT's date, so a job's whole P&L stays together. -->
        <span class="fx-field__label">Shipped after</span>
        <input v-model="filters.from" type="date" class="fx-input" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Shipped before</span>
        <input v-model="filters.to" type="date" class="fx-input" @change="load" />
      </label>
      <label v-if="view === 'jobs'" class="fx-field">
        <span class="fx-field__label">Search</span>
        <input v-model="filters.q" class="fx-input" placeholder="job, AWB or client" @keyup.enter="load" />
      </label>
      <button class="fx-btn" :disabled="busy" @click="exportCsv">Export</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!-- What the selection made, and how much of it can be trusted. -->
      <div class="fx-toolbar">
        <p class="fx-muted">
          <strong>{{ totals.count }}</strong> shipment(s) ·
          revenue <strong>{{ money(totals.revenue) }}</strong> ·
          cost <strong>{{ money(totals.cost) }}</strong> ·
          margin <strong :class="{ 'is-loss': totals.margin < 0 }">{{ money(totals.margin) }}</strong>
          <span v-if="totals.margin_pct !== null"> ({{ totals.margin_pct }}%)</span>
        </p>
        <!--
          🔴 General billing (user, 2026-09-26): revenue with no shipment behind it, so no cost side and no margin.
          Beside the shipments, never among them — but stated, or this page would not add up to the ledger.
        -->
        <p v-if="general.documents" class="fx-muted">
          Plus <strong>{{ money(general.revenue) }}</strong> billed not for a shipment, across {{ general.documents }}
          document(s), credit notes subtracted — not in the figures above, which are shipments only.
        </p>
      </div>
      <!--
        🔴 Said out loud, above the table. A shipment billed with nothing costed shows a margin that is not real,
        and it is the single most common way a profitability report lies.
      -->
      <p v-if="totals.no_cost_booked || totals.not_billed" class="fx-notice" role="status">
        <span v-if="totals.no_cost_booked">
          {{ totals.no_cost_booked }} shipment(s) have been billed with no cost booked, so their margin reads far
          higher than it is.
        </span>
        <span v-if="totals.not_billed">
          {{ totals.not_billed }} have costs booked and nothing billed yet.
        </span>
      </p>

      <!-- ── Shipment by shipment ───────────────────────────────────────── -->
      <template v-if="view === 'jobs'">
        <div class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Sort on</span>
            <select v-model="filters.sort" class="fx-input" @change="load">
              <option value="margin">Worst margin first</option>
              <option value="margin_pct">Worst margin % first</option>
              <option value="revenue">Biggest revenue first</option>
              <option value="date">Most recent first</option>
            </select>
          </label>
        </div>

        <p v-if="!jobs.length" class="fx-muted">No shipment has been billed or costed in this selection.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">Shipment</th>
              <th scope="col">Shipped</th>
              <th scope="col">Client</th>
              <th scope="col">Lane</th>
              <th scope="col">Mode</th>
              <th class="fx-num" scope="col">Revenue</th>
              <th class="fx-num" scope="col">Cost</th>
              <th class="fx-num" scope="col">Margin</th>
              <th class="fx-num" scope="col">%</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="j in jobs" :key="'j-' + j.id" :class="{ 'is-loss-row': j.margin < 0 }">
              <td class="identifier">{{ j.job_no }}</td>
              <td><Figure :value="j.job_date" kind="date" /></td>
              <td>{{ j.customer || "—" }}</td>
              <td class="identifier">{{ j.lane }}</td>
              <td>{{ j.mode }}</td>
              <td class="fx-num"><Figure :value="j.revenue" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="j.cost" kind="currency" currency-code="INR" /></td>
              <td class="fx-num" :class="{ 'is-loss': j.margin < 0 }">
                <Figure :value="j.margin" kind="currency" currency-code="INR" />
              </td>
              <td class="fx-num">{{ j.margin_pct === null ? "—" : j.margin_pct + "%" }}</td>
              <td>
                <StatusChip v-if="j.no_cost_booked" value="no_cost_booked" />
                <StatusChip v-else-if="j.not_billed" value="not_billed" />
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- ── By client, and by lane ─────────────────────────────────────── -->
      <template v-else>
        <p v-if="!groups.length" class="fx-muted">Nothing to roll up in this selection.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">{{ view === "clients" ? "Client" : "Lane" }}</th>
              <th v-if="view === 'lanes'" scope="col">Route</th>
              <th v-if="view === 'lanes'" scope="col">Mode</th>
              <th class="fx-num" scope="col">Shipments</th>
              <th class="fx-num" scope="col">Revenue</th>
              <th class="fx-num" scope="col">Cost</th>
              <th class="fx-num" scope="col">Margin</th>
              <th class="fx-num" scope="col">%</th>
              <th class="fx-num" scope="col">Each</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="g in groups"
              :key="g.key"
              class="is-clickable"
              :class="{ 'is-loss-row': g.margin < 0 }"
              tabindex="0"
              @click="drillInto(g)"
              @keydown.enter="drillInto(g)"
            >
              <td>{{ g.name }}</td>
              <td v-if="view === 'lanes'" class="fx-muted">
                {{ g.origin_name || g.origin }} → {{ g.dest_name || g.dest }}
              </td>
              <td v-if="view === 'lanes'">{{ g.mode }}</td>
              <td class="fx-num">{{ g.shipments }}</td>
              <td class="fx-num"><Figure :value="g.revenue" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="g.cost" kind="currency" currency-code="INR" /></td>
              <td class="fx-num" :class="{ 'is-loss': g.margin < 0 }">
                <Figure :value="g.margin" kind="currency" currency-code="INR" />
              </td>
              <td class="fx-num">{{ g.margin_pct === null ? "—" : g.margin_pct + "%" }}</td>
              <td class="fx-num"><Figure :value="g.margin_each" kind="currency" currency-code="INR" /></td>
              <td class="fx-muted">
                <span v-if="g.no_cost_booked">{{ g.no_cost_booked }} uncosted</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="fx-muted">
          Open a row to see the shipments behind it. "Each" is what one shipment
          {{ view === "clients" ? "for this client" : "on this lane" }} is worth on average.
        </p>
      </template>
    </template>

    <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

const VIEWS = [
  { key: "jobs", label: "By shipment" },
  { key: "clients", label: "By client" },
  { key: "lanes", label: "By lane" },
];

export default {
  name: "Profitability",
  components: { Figure, StatusChip },
  props: {
    /** Rendered as a view of How we're doing rather than as a page of its own. */
    embedded: { type: Boolean, default: false },
    initialView: { type: String, default: "jobs" },
  },
  data: () => ({
    view: "jobs", VIEWS,
    jobs: [], groups: [], totals: { count: 0, revenue: 0, cost: 0, margin: 0, margin_pct: null },
    /** Billing with no shipment behind it, reported beside the shipments (2026-09-26). */
    general: { revenue: 0, documents: 0 },
    branches: [], clients: [], modes: [],
    filters: { agent_id: null, customer_id: null, mode: "", origin: "", dest: "", from: "", to: "", q: "", sort: "margin" },
    loading: true, busy: false, error: null, actionError: null,
  }),
  computed: {
    subtitleForView() {
      return {
        jobs: "What each shipment billed, what it cost, and what that left. Net of tax on both sides.",
        clients: "Which clients are worth the work — and which are busy rather than profitable.",
        lanes: "Which routes earn their keep. This is the number to buy against.",
      }[this.view];
    },
  },
  watch: {
    // The shell changed view: swap the roll-up without remounting and losing the filters.
    initialView(view) {
      this.view = view;
      this.load();
    },
  },
  created() {
    this.view = this.initialView;

    // Arrived from a roll-up: show that client's or that lane's shipments.
    ["customer_id", "origin", "dest", "mode"].forEach((key) => {
      if (this.$route.query[key]) this.filters[key] = this.$route.query[key];
    });
    if (this.$route.query.customer_id) this.filters.customer_id = Number(this.$route.query.customer_id);

    this.load();
  },
  methods: {
    showView(key) {
      this.view = key;
      this.actionError = null;
      this.load();
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    query() {
      const params = [];
      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && (key !== "sort" || this.view === "jobs")) {
          params.push(key + "=" + encodeURIComponent(value));
        }
      });

      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;
      ApiService.get(`/profitability/${this.view}${this.query()}`)
        .then(({ data }) => {
          this.jobs = data.jobs || [];
          this.groups = data.groups || [];
          this.totals = data.totals;
          this.general = data.general || { revenue: 0, documents: 0 };
          this.branches = data.branches || this.branches;
          this.clients = data.clients || this.clients;
          this.modes = data.modes || this.modes;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    /** A roll-up row opens the shipments underneath it — the same calculation, filtered. */
    drillInto(group) {
      if (this.view === "clients") {
        this.filters.customer_id = group.customer_id;
      } else {
        this.filters.origin = group.origin || "";
        this.filters.dest = group.dest || "";
        this.filters.mode = group.mode || "";
      }

      this.showView("jobs");
    },
    exportCsv() {
      this.busy = true;
      const by = { clients: "client", lanes: "lane" }[this.view] || "job";
      const params = this.query();

      ApiService.query(`/profitability/export${params}${params ? "&" : "?"}by=${by}`, { responseType: "blob" })
        .then(({ data }) => {
          const url = window.URL.createObjectURL(new Blob([data], { type: "text/csv" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `profitability-${by}.csv`;
          link.click();
          setTimeout(() => window.URL.revokeObjectURL(url), 30000);
        })
        .catch(() => { this.actionError = "The export could not be built."; })
        .finally(() => { this.busy = false; });
    },
    /*
     * The server's own words, whatever shape the refusal takes.
     *
     * 🔴 It used to read only `data.error`, so a Laravel VALIDATION failure — which answers with `message` and
     * `errors`, never `error` — fell through to "Something went wrong. Try again." on a screen that moves money.
     * A refusal nobody can read is a refusal nobody can act on, and it wasted an afternoon.
     */
    messageFor(e) {
      const response = e.response;
      const data = response && response.data;

      if (data && data.error) return data.error;

      // A 422 carries the field errors; show the first, which is the one the person has to fix.
      if (data && data.errors) {
        const first = Object.values(data.errors)[0];

        return Array.isArray(first) ? first[0] : String(first);
      }

      if (data && data.message) return data.message;

      // Nothing readable came back: say what actually happened rather than "something".
      return response
        ? `The server refused that (${response.status}).`
        : "Could not reach the server. Check your connection and try again.";
    },
  },
};
</script>

<style scoped>
/* §1.3 never signal with colour alone — the minus sign carries it; the weight only reinforces. */
.is-loss {
  font-weight: 700;
}
</style>
