<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Overview</h1>
      <p class="fx-page-sub">
        The last 90 days across every client company, and what is waiting for you.
        <template v-if="data"> Updated <Figure :value="data.as_of" kind="dateTime" />.</template>
      </p>
    </header>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!data" class="fx-muted">Loading…</p>

    <template v-else>
      <!-- What needs F16s staff: each a count and the page that clears it. Nothing listed means nothing waiting. -->
      <section class="fx-section" aria-labelledby="needs-title">
        <h2 id="needs-title" class="fx-section__title">Needs you</h2>
        <p v-if="!data.needs_you.length" class="fx-muted">Nothing is waiting.</p>
        <ul v-else class="fx-needs">
          <li v-for="n in data.needs_you" :key="n.key">
            <router-link :to="n.to"><strong>{{ n.count }}</strong> {{ n.label }} →</router-link>
          </li>
        </ul>
      </section>

      <section class="fx-section fx-overview__grid">
        <FxChart
          title="Shipments opened per day, by company"
          type="line"
          :series="shipmentSeries"
          :options="dateAxis"
          empty-message="No shipments in the last 90 days."
        />
        <FxChart
          title="Client mail in, and conversations triaged, per day"
          type="line"
          :series="data.mail.series"
          :options="dateAxis"
          empty-message="No client mail in the last 90 days."
        />
        <div>
          <FxChart
            title="AI spend per day (₹)"
            type="bar"
            :series="[{ name: 'AI spend (₹)', data: data.ai.days }]"
            :options="dateAxis"
            empty-message="No AI use in the last 90 days."
          />
          <p class="fx-muted">
            This month: ₹{{ inr(data.ai.month_inr) }} of a ₹{{ inr(data.ai.budget_inr) }} budget
            ({{ budgetShare }}%). <router-link to="/superadmin/ai-usage">By company →</router-link>
          </p>
        </div>
        <FxChart
          title="Tickets opened and resolved per week"
          type="bar"
          :series="ticketSeries"
          :options="weekAxis"
          empty-message="No tickets in the last 13 weeks."
        />
        <FxChart
          title="People signed in per day, by company"
          type="line"
          :series="data.signins.total ? data.signins.series : []"
          :options="dateAxis"
          empty-message="No sign-ins recorded yet — they are counted from 16 Oct 2026."
        />
        <FxChart
          title="Server errors and failed background jobs per day"
          type="bar"
          :series="data.errors.total ? data.errors.series : []"
          :options="dateAxis"
          empty-message="No errors in the last 90 days."
        />
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import FxChart from "@/view/pages/freight/components/FxChart.vue";

/**
 * The platform portal's first page (owner, 2026-10-11: "graphs to keep a track … I don't want so many pages to open").
 * One read (`/superadmin/overview`): shipments by company, mail, AI spend against budget, tickets, sign-ins, errors, and the list of what
 * needs F16s staff. Health, AI usage and Mail filing are the tabs next to it.
 */
export default {
  name: "PlatformOverview",
  components: { Figure, FxChart },
  data: () => ({ data: null, error: null }),
  computed: {
    shipmentSeries() {
      return this.data.shipments.total ? this.data.shipments.series : [];
    },
    ticketSeries() {
      const weeks = this.data.tickets.weeks;
      if (!weeks.some((w) => w.opened || w.resolved)) return [];

      return [
        { name: "Opened", data: weeks.map((w) => ({ x: w.x, y: w.opened })) },
        { name: "Resolved", data: weeks.map((w) => ({ x: w.x, y: w.resolved })) },
      ];
    },
    budgetShare() {
      const { month_inr: spent, budget_inr: budget } = this.data.ai;
      return budget > 0 ? Math.round((spent / budget) * 100) : 0;
    },
    dateAxis() {
      return { xaxis: { type: "datetime" }, stroke: { width: 2, curve: "straight" }, yaxis: { min: 0, forceNiceScale: true } };
    },
    weekAxis() {
      return { xaxis: { type: "datetime" }, yaxis: { min: 0, forceNiceScale: true }, plotOptions: { bar: { columnWidth: "60%" } } };
    },
  },
  created() {
    ApiService.get("/superadmin/overview")
      .then(({ data }) => { this.data = data; })
      .catch((e) => {
        this.error = (e.response && e.response.data && (e.response.data.error || e.response.data.message)) || "Could not load the overview.";
      });
  },
  methods: {
    inr(v) {
      return Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
    },
  },
};
</script>

<style scoped>
.fx-needs { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.fx-needs a { color: inherit; }
.fx-overview__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px; }
@media (max-width: 900px) { .fx-overview__grid { grid-template-columns: 1fr; } }
</style>
