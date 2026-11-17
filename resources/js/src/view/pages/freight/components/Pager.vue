<template>
  <!-- Drawn only when there is a second page (frontend audit, FM7). -->
  <nav v-if="lastPage > 1" class="fx-pager" :aria-label="label">
    <button class="fx-btn fx-btn--ghost" type="button" :disabled="busy || page <= 1" @click="$emit('go', page - 1)">← Previous</button>
    <span class="fx-muted">Page {{ page }} of {{ lastPage }} · {{ total }} {{ noun }}</span>
    <button class="fx-btn fx-btn--ghost" type="button" :disabled="busy || page >= lastPage" @click="$emit('go', page + 1)">Next →</button>
  </nav>
</template>

<script>
export default {
  name: "Pager",
  props: {
    page: { type: Number, default: 1 },
    lastPage: { type: Number, default: 1 },
    total: { type: Number, default: 0 },
    /** What the rows are, in the plural: "filings", "clients". */
    noun: { type: String, default: "rows" },
    busy: { type: Boolean, default: false },
  },
  computed: {
    label() {
      return "Pages of " + this.noun;
    },
  },
};
</script>
