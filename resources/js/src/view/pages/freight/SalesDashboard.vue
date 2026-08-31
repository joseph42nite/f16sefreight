<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Sales</h1>
      <p class="fx-page-sub">
        <template v-if="scope === 'my_book'">Your client book, {{ modeLabel }}.</template>
        <template v-else>Branch performance, {{ modeLabel }}. Client attribution needs Command.</template>
      </p>
    </header>

    <!--
      §7 — the staleness banner. These numbers come from a rollup, not from live
      tables, so the page must say how old they are. A dashboard that cannot state
      its own freshness invites the reader to assume "live", which is the one thing
      it deliberately is not.
    -->
    <p v-if="staleness && staleness.reason === 'never_computed'" class="fx-warn" role="status">
      No rollup has run yet, so there are no figures to show. This is not a branch that
      shipped nothing — it is a branch nobody has computed. Run <code>sales:compute-snapshots</code>.
    </p>
    <p v-else-if="staleness && staleness.is_stale" class="fx-warn" role="status">
      Figures are {{ staleness.age_minutes }} minutes old. The rollup is overdue.
    </p>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Period</span>
        <select v-model="grain" class="fx-input" @change="loadCharts">
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </label>
      <!-- 🔴 The yearly funnel is a UNION over two bases; asking without one counts
           every enquiry twice. So the control only exists where the choice does. -->
      <label v-if="grain === 'year'" class="fx-field">
        <span class="fx-field__label">Year basis</span>
        <select v-model="basis" class="fx-input" @change="loadCharts">
          <option value="fiscal">Fiscal (Apr–Mar)</option>
          <option value="calendar">Calendar</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!-- §7.4 Today's Actions sits ABOVE the charts. It is the worklist; the charts
           are the explanation. -->
      <section class="fx-section">
        <h2 class="fx-section__title">Today's actions</h2>

        <p v-if="!actions.length" class="fx-muted">Nothing ranked right now.</p>

        <ol v-else class="fx-actions">
          <li v-for="a in actions" :key="a.id" class="fx-action">
            <div class="fx-action__head">
              <StatusChip :value="a.action_type" />
              <span class="fx-action__score">{{ Math.round(a.priority_score) }}</span>
            </div>

            <!-- 🔴 A NULL narration is a first-class state, not an error. The model
                 layer is disposable: if it is down the row keeps every number and
                 merely loses its prose. -->
            <p v-if="a.narrated_text" class="fx-action__text">{{ a.narrated_text }}</p>
            <p v-else class="fx-muted fx-action__text">
              Not narrated. The figures below are the whole finding.
            </p>

            <dl v-if="a.facts" class="fx-defs fx-action__facts">
              <template v-for="(v, k) in a.facts">
                <dt :key="k + '-k'">{{ String(k).replace(/_/g, " ") }}</dt>
                <dd :key="k + '-v'">{{ v }}</dd>
              </template>
            </dl>

            <p v-if="a.impact_value" class="fx-action__impact">
              At stake <Figure :value="a.impact_value" kind="currency" currency-code="INR" />
            </p>
          </li>
        </ol>
      </section>

      <!--
        §7.4 CHART-FIRST, tables as drill-down. The charts answer "what is happening";
        the grid below answers "to which account". A rep opening this screen should see
        the shape of the month before they see a row.
      -->
      <section v-if="charts" class="fx-section fx-charts">
        <FxChart
          title="Tonnage & shipments"
          type="line"
          :series="tonnageSeries"
          :options="tonnageOptions"
          empty-message="No lane statistics yet. They appear after the first rollup that finds a converted enquiry with a lane."
        />

        <FxChart
          title="Top lanes by tonnage"
          type="bar"
          :series="laneSeries"
          :options="laneOptions"
          empty-message="No lanes recorded yet."
        />

        <FxChart
          title="Win / loss"
          type="donut"
          :series="funnelSeries"
          :options="funnelOptions"
          empty-message="No closed enquiries in this window."
        />
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">{{ scope === "my_book" ? "My book" : "Branch" }}</h2>
        <div class="fx-tiles">
          <div v-for="t in tiles" :key="t.label" class="fx-tile">
            <span class="fx-tile__label">{{ t.label }}</span>
            <span class="fx-tile__value">
              <Figure :value="t.value" :kind="t.kind" :currency-code="t.kind === 'currency' ? 'INR' : null" />
            </span>
          </div>
        </div>
      </section>

      <!-- Command only. Below Command the endpoint 403s and this section never renders —
           §8.1: the locked nav item is what explains the gap, not an empty grid here. -->
      <section v-if="book.length" class="fx-section">
        <h2 class="fx-section__title">Accounts</h2>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Risk</th>
              <th class="fx-num" scope="col">Tonnage YTD</th>
              <th class="fx-num" scope="col">Revenue MTD</th>
              <th class="fx-num" scope="col">Win rate</th>
              <th class="fx-num" scope="col">Outstanding 60+</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in book" :key="c.customer_id + '-' + c.transport_mode">
              <td>{{ c.name }}</td>
              <td><StatusChip :value="c.risk_band" /></td>
              <td class="fx-num"><Figure :value="c.tonnage_ytd" kind="weight" /></td>
              <td class="fx-num"><Figure :value="c.revenue_mtd" kind="currency" currency-code="INR" /></td>
              <!-- §7.1 NULL is not 0% — an unmeasurable rate renders as an em dash. -->
              <td class="fx-num"><Figure :value="c.win_rate" kind="count" /></td>
              <td class="fx-num"><Figure :value="c.outstanding_60_plus" kind="currency" currency-code="INR" /></td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxChart from "@/view/pages/freight/components/FxChart.vue";

export default {
  name: "SalesDashboard",
  components: { Figure, StatusChip, FxChart },
  data: () => ({
    loading: true, error: null,
    scope: null, mode: null, branch: {}, book: [], staleness: null, actions: [],
    charts: null, grain: "month", basis: "fiscal",
  }),
  computed: {
    /* ⚠️ Months with no shipments are ABSENT from the payload, not zero-filled — a gap
       means "no data", a zero means "we moved nothing", and on a tonnage chart those
       read as opposite commercial stories. */
    tonnageSeries() {
      const rows = (this.charts && this.charts.tonnage) || [];
      if (!rows.length) return [];
      return [{ name: "Tonnage (kg)", data: rows.map((r) => r.tonnage) }];
    },
    tonnageOptions() {
      const rows = (this.charts && this.charts.tonnage) || [];
      return {
        chart: { type: "area" },
        stroke: { width: 2, curve: "straight" },
        fill: { opacity: 0.15 },
        /* Categories rather than a datetime axis: the series is already bucketed by
           month server-side, and a datetime axis would interpolate the gaps that mean
           "no data" into a line implying zero. */
        xaxis: { categories: rows.map((r) => String(r.period).slice(0, 7)) },
        yaxis: { decimalsInFloat: 0 },
      };
    },

    /* Ranked by TONNAGE, not shipment count: ten courier-sized shipments on one lane
       are not the commercial exposure of one full container on another. */
    laneSeries() {
      const rows = (this.charts && this.charts.lanes) || [];
      if (!rows.length) return [];
      return [{ name: "Tonnage (kg)", data: rows.map((r) => r.tonnage) }];
    },
    laneOptions() {
      const rows = (this.charts && this.charts.lanes) || [];
      return {
        chart: { type: "bar" },
        /* Horizontal, because "INBOM → DEHAM" rotates to unreadability on a vertical
           axis. */
        plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
        xaxis: { categories: rows.map((r) => r.lane) },
      };
    },

    funnelSeries() {
      const t = (this.charts && this.charts.funnel && this.charts.funnel.totals) || {};
      const values = [t.converted || 0, t.lost || 0, t.pending || 0];
      /* An all-zero donut renders as an empty ring that looks broken. Report nothing
         and let FxChart say so in words instead. */
      return values.some((v) => v > 0) ? values : [];
    },
    funnelOptions() {
      const token = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n) || "").trim() || f;
      return {
        chart: { type: "donut" },
        labels: ["Converted", "Lost", "Still open"],
        colors: [token("--status-success", "#1F7A48"), token("--status-critical", "#C4342B"),
                 token("--status-neutral", "#5A6472")],
        legend: { position: "bottom" },
      };
    },

    modeLabel() {
      return this.mode ? this.mode + " only" : "all modes";
    },
    tiles() {
      const b = this.branch || {};
      const tiles = [
        { label: "Tonnage MTD", value: b.tonnage_mtd, kind: "weight" },
        { label: "Tonnage YTD", value: b.tonnage_ytd, kind: "weight" },
        { label: "Shipments MTD", value: b.shipment_count_mtd, kind: "count" },
        { label: "Enquiries MTD", value: b.enquiry_count_mtd, kind: "count" },
      ];

      /* 🔴 The revenue tile appears only when the SERVER sent revenue. Below Command it
         omits the key entirely (§7.4 — money is the upsell), so the tile is driven by
         what arrived rather than by a tier check repeated here. One rule, one place. */
      if ("revenue_mtd" in b) {
        tiles.push({ label: "Revenue MTD", value: b.revenue_mtd, kind: "currency" });
      }

      return tiles;
    },
  },
  created() {
    this.loadCharts();
    Promise.all([
      ApiService.get("/sales/dashboard"),
      // The actions call is allowed to fail without taking the page down — a ranked
      // worklist is valuable, but it is not the reason the page exists.
      ApiService.get("/sales/actions").catch(() => ({ data: { actions: [] } })),
    ])
      .then(([dash, act]) => {
        this.scope = dash.data.scope;
        this.mode = dash.data.mode;
        this.branch = dash.data.branch || {};
        this.book = dash.data.book || [];
        this.staleness = dash.data.staleness;
        this.actions = act.data.actions || [];
      })
      .catch((e) => {
        const d = (e.response && e.response.data) || {};
        this.error = d.error || d.message || "Something went wrong.";
      })
      .finally(() => { this.loading = false; });
  },
  methods: {
    loadCharts() {
      let url = "/sales/charts?grain=" + this.grain;
      if (this.grain === "year") url += "&basis=" + this.basis;

      ApiService.get(url)
        .then(({ data }) => { this.charts = data; })
        /* Charts failing must not take the worklist down with it: Today's Actions is
           the part a rep acts on, and it comes from a different call. */
        .catch(() => { this.charts = null; });
    },
  },
};
</script>
