<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Overview</h1>
      <p class="fx-page-sub">
        Cross-mode oversight. The Boss portal has no transport scope, so air and sea
        appear side by side rather than one at a time.
      </p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Grain</span>
        <select v-model="grain" class="fx-input" @change="load">
          <option value="day">Daily (DSR)</option>
          <option value="month">Monthly (MSR)</option>
          <option value="year">Yearly (YSR)</option>
        </select>
      </label>

      <!--
        🔴 The year basis is REQUIRED, never defaulted. ysr_funnel_view is a UNION over
        fiscal and calendar; asking without one counts every enquiry twice. For Jan–Mar
        the two genuinely describe different twelve-month windows, and that is exactly
        where month-end reconciliation arguments start — so the reader chooses.
      -->
      <label v-if="grain === 'year'" class="fx-field">
        <span class="fx-field__label">Year basis</span>
        <select v-model="basis" class="fx-input" @change="load">
          <option value="fiscal">Fiscal (Apr–Mar)</option>
          <option value="calendar">Calendar</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!periods.length" class="fx-muted">
      No enquiries in this window. A period with none has no conversion rate — that is
      not a rate of zero.
    </p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Period</th>
          <th scope="col">Mode</th>
          <th class="fx-num" scope="col">Raised</th>
          <th class="fx-num" scope="col">Replied</th>
          <th class="fx-num" scope="col">Pending</th>
          <th class="fx-num" scope="col">Converted</th>
          <th class="fx-num" scope="col">Lost</th>
          <th class="fx-num" scope="col">Conversion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in periods" :key="i">
          <td><Figure :value="p.period_start" kind="date" /></td>
          <td>{{ p.transport_mode }}</td>
          <td class="fx-num"><Figure :value="p.enquiries_raised" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_replied" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_pending" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_converted" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_lost" kind="count" /></td>
          <!--
            §7.1 NULL, never 0%. "Nothing came in" and "everything was lost" are
            opposite facts, and an em dash is the only honest rendering of the first.
          -->
          <td class="fx-num">
            <span v-if="p.conversion_rate_pct === null" class="is-empty" aria-label="No enquiries in this period"></span>
            <span v-else>{{ Number(p.conversion_rate_pct).toFixed(2) }}%</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "BossDashboard",
  components: { Figure },
  data: () => ({ periods: [], loading: true, error: null, grain: "month", basis: "fiscal" }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      let url = "/analytics/funnel?grain=" + this.grain;
      if (this.grain === "year") url += "&basis=" + this.basis;

      ApiService.get(url)
        .then(({ data }) => { this.periods = data.periods || []; this.error = null; })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.error = d.error || d.message || "Something went wrong.";
        })
        .finally(() => { this.loading = false; });
    },
  },
};
</script>
