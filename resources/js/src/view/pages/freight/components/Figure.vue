<template>
  <!--
    §4.1 NULL IS NOT ZERO. A missing weight renders as an em dash, never as 0 —
    "we do not know" and "it weighs nothing" are different claims, and on a customs
    document the difference matters.
  -->
  <span v-if="empty" class="is-empty" :aria-label="emptyLabel"></span>
  <span v-else>{{ formatted }}</span>
</template>

<script>
import fmt from "@/core/config/format";

export default {
  name: "Figure",
  props: {
    value: { type: [Number, String], default: null },
    /* §4.4 — the KIND decides the format, so a weight is always 3 dp with its unit
       and a date is always DD-MMM-YYYY, wherever they appear. */
    kind: {
      type: String,
      default: "count",
      validator: (v) => ["count", "weight", "volume", "currency", "date", "dateTime"].indexOf(v) !== -1,
    },
    unit: { type: String, default: undefined },
    currencyCode: { type: String, default: null },
    emptyLabel: { type: String, default: "Not recorded" },
  },
  computed: {
    empty() {
      return fmt.isEmpty(this.value);
    },
    formatted() {
      switch (this.kind) {
        case "weight":   return fmt.weight(this.value, this.unit || "kg");
        case "volume":   return fmt.volume(this.value, this.unit || "CBM");
        case "currency": return fmt.currency(this.value, this.currencyCode);
        case "date":     return fmt.date(this.value);
        case "dateTime": return fmt.dateTime(this.value);
        default:         return fmt.count(this.value);
      }
    },
  },
};
</script>
