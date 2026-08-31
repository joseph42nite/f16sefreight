<template>
  <div class="fx-chart">
    <h3 class="fx-section__title">{{ title }}</h3>

    <!--
      §4.1 an empty series is NOT a chart of zeroes. "No data yet" and "we moved
      nothing" are different claims, and a flat line at zero asserts the second.
    -->
    <p v-if="!hasData" class="fx-muted fx-chart__empty">
      {{ emptyMessage }}
    </p>

    <apexchart
      v-else
      :type="type"
      :height="height"
      :options="merged"
      :series="series"
    />
  </div>
</template>

<script>
/**
 * One chart, themed from the design tokens.
 *
 * 🔴 **THE PALETTE IS READ FROM CSS CUSTOM PROPERTIES, NOT HARD-CODED.** ApexCharts
 * takes hex strings, so a chart written with literal colours would ignore the token
 * system entirely — and would keep its light-mode palette when dark mode is switched
 * on. Reading `--status-*` off the document at build time keeps one source of truth.
 */
export default {
  name: "FxChart",
  props: {
    title: { type: String, required: true },
    type: { type: String, default: "line" },
    series: { type: Array, required: true },
    options: { type: Object, default: () => ({}) },
    height: { type: Number, default: 260 },
    emptyMessage: { type: String, default: "Nothing to chart yet." },
  },
  computed: {
    hasData() {
      /* Defensive by design: this component is handed series from three different
         shapes (line objects, a bare number array for the donut) and one bad frame
         during a reload must not take the whole dashboard section down with it. */
      const series = Array.isArray(this.series) ? this.series : [];
      if (!series.length) return false;

      return series.some((s) => {
        if (s === null || s === undefined) return false;
        if (typeof s === "number") return true;              // donut slice
        if (Array.isArray(s)) return s.length > 0;
        return Array.isArray(s.data) ? s.data.length > 0 : s.data !== undefined;
      });
    },
    merged() {
      const token = (name, fallback) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name);
        return (v && v.trim()) || fallback;
      };

      return Object.assign({
        chart: {
          toolbar: { show: false },
          fontFamily: token("--font-sans", "sans-serif"),
          animations: { enabled: false },  // a dashboard read all day should not move
        },
        colors: [
          token("--status-info", "#1F5FA8"),
          token("--status-success", "#1F7A48"),
          token("--status-critical", "#C4342B"),
          token("--status-warning", "#9A6400"),
          token("--status-neutral", "#5A6472"),
        ],
        grid: { borderColor: token("--border", "#D8DCE3"), strokeDashArray: 3 },
        dataLabels: { enabled: false },
        legend: { fontSize: "12px", labels: { colors: token("--text-secondary", "#5A6472") } },
        tooltip: { theme: "light" },
        xaxis: { labels: { style: { colors: token("--text-secondary", "#5A6472"), fontSize: "11px" } } },
        yaxis: { labels: { style: { colors: token("--text-secondary", "#5A6472"), fontSize: "11px" } } },
      }, this.options);
    },
  },
};
</script>
