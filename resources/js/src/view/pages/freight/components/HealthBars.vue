<template>
  <!--
    PRD §7.3.4 H: "always render the component bars, never the bare number" — a rep cannot act on 36 without
    seeing that it is the rhythm and the trend pulling it down, not the way the client pays.
  -->
  <div class="fx-health">
    <span class="fx-health__score" :title="score === null ? 'Too little data for a score' : 'Client health, 0–100'">
      {{ score === null ? "—" : Math.round(score) }}
    </span>
    <ul class="fx-health__parts">
      <li v-for="p in rows" :key="p.key" class="fx-health__row">
        <span class="fx-health__label">{{ p.label }}</span>
        <span class="fx-health__track">
          <span v-if="p.value !== null" class="fx-health__fill" :style="{ width: Math.round(p.value * 100) + '%' }" />
        </span>
        <span class="fx-health__value">{{ p.value === null ? "—" : Math.round(p.value * 100) }}</span>
      </li>
      <!-- Our ops is measured but not scored yet (owner, 2026-10-05): the quarter's facts, as they are. -->
      <li v-if="ops" class="fx-health__ops" :title="'Measured this quarter, not yet part of the score'">
        {{ ops.quarter }}: {{ fact(ops.days_slower, " d slower") }} · cancelled {{ fact(ops.cancellation_rate, "%") }}
        <template v-if="ops.fna_rate !== undefined"> · FNA {{ fact(ops.fna_rate, "%") }}</template>
        · weight gap {{ fact(ops.weight_gap_pct, "%") }}
      </li>
    </ul>
  </div>
</template>

<script>
/* In the PRD's order, each part 0–1 where 1 is healthiest; NULL is "not enough data", never 0. */
const PARTS = [
  ["momentum", "Trend"],
  ["churn", "Rhythm"],
  ["win_rate", "Win rate"],
  ["payment", "Pays"],
  ["ops", "Our ops"],
];

export default {
  name: "HealthBars",
  props: {
    score: { type: Number, default: null },
    parts: { type: Object, default: () => ({}) },
    /* G's facts for the running quarter, or null. Each NULL figure is "not enough data", shown as an em dash. */
    ops: { type: Object, default: null },
  },
  methods: {
    fact(value, unit) {
      return value === null ? "—" : value + unit;
    },
  },
  computed: {
    rows() {
      return PARTS.map(([key, label]) => ({ key, label, value: this.parts[key] ?? null }));
    },
  },
};
</script>

<style scoped>
.fx-health { display: flex; gap: 10px; align-items: flex-start; min-width: 180px; }
.fx-health__score { font-family: var(--font-mono); font-weight: 600; min-width: 2ch; text-align: right; }
.fx-health__parts { list-style: none; margin: 0; padding: 0; flex: 1; }
.fx-health__row { display: grid; grid-template-columns: 56px 1fr 3ch; gap: 6px; align-items: center; font-size: .72rem; line-height: 1.4; }
.fx-health__label { color: var(--text-secondary); }
.fx-health__track { height: 6px; background: var(--bg-sunken); border-radius: var(--radius-sm); overflow: hidden; }
.fx-health__fill { display: block; height: 100%; background: var(--status-info); }
.fx-health__value { font-family: var(--font-mono); text-align: right; color: var(--text-secondary); }
.fx-health__ops { font-size: .68rem; line-height: 1.4; color: var(--text-secondary); margin-top: 2px; }
</style>
