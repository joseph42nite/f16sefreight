<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">How we're doing</h1>
      <p class="fx-page-sub">
        {{ subtitle }}
        <router-link to="/close-month">The statements →</router-link>
      </p>
    </header>

    <!--
      🔴 The two screens that answer "why" were the two hardest to find (guide §11.1): Profitability and the
      Journal were on no rail at all, reachable only from small links in a subheading. They are one surface now —
      the margin, and the way down from any figure on it to the document that made it.
    -->
    <div class="fx-toolbar fx-financials__views">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="fx-btn"
        :class="{ 'fx-btn--primary': view === v.key }"
        @click="view = v.key"
      >{{ v.label }}</button>
    </div>

    <!--
      ⚠️ `:key` on the journal only. The three margin views share one component and swap by prop, so stepping
      between them keeps the filters; the journal is a different question and starts clean.
    -->
    <Profitability v-if="view !== 'journal'" embedded :initial-view="view" />
    <Journal v-else key="journal" embedded />
  </div>
</template>

<script>
import Profitability from "@/view/pages/freight/Profitability.vue";
import Journal from "@/view/pages/freight/Journal.vue";

const VIEWS = [
  { key: "jobs", label: "By shipment" },
  { key: "clients", label: "By client" },
  { key: "lanes", label: "By lane" },
  { key: "journal", label: "The journal" },
];

export default {
  name: "HowWereDoing",
  components: { Profitability, Journal },
  data: () => ({ VIEWS, view: "jobs" }),
  computed: {
    subtitle() {
      return {
        jobs: "What each shipment billed, what it cost, and what that left. Net of tax on both sides.",
        clients: "Which clients are worth the work — and which are busy rather than profitable.",
        lanes: "Which routes earn their keep. This is the number to buy against.",
        journal: "Every posting the ledger holds. Open a line to see the other side, and the document behind it.",
      }[this.view];
    },
  },
  created() {
    if (this.$route.query.view) this.view = this.$route.query.view;
  },
};
</script>
