<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Money in</h1>
      <p class="fx-page-sub">
        {{ current ? current.note : "Bill it, collect it, chase it." }}
        <router-link to="/today">Today →</router-link>
      </p>
    </header>

    <!--
      🔴 STAGES, NOT TABS (guide §11.2). Left to right is the order a rupee actually travels — handed over,
      raised, issued, arrived, late. Tabs say "here are five things"; a pipeline says "this is one thing, and
      here is where it is stuck", which is the question this desk opens the page with.
    -->
    <nav class="fx-pipeline" aria-label="Money in">
      <button
        v-for="s in stages"
        :key="s.key"
        class="fx-pipeline__stage"
        :class="{ 'is-active': stage === s.key, 'is-empty': !s.count, 'is-warning': s.tone === 'warning' && s.count }"
        :aria-current="stage === s.key ? 'step' : null"
        @click="stage = s.key"
      >
        <span class="fx-pipeline__step">{{ s.step }}</span>
        <span class="fx-pipeline__label">{{ s.label }}</span>
        <span class="fx-pipeline__figure">
          <Figure :value="s.amount" kind="currency" currency-code="INR" />
        </span>
        <span class="fx-pipeline__count">{{ s.count }} {{ s.count === 1 ? "item" : "items" }}</span>
      </button>
    </nav>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <p class="fx-muted">{{ current ? current.note : "" }}</p>

      <!--
        ④ counts bank lines nobody has placed, and placing them is bank matching — which had no way in from this desk:
        it lives on Financials, taken off the accounts rail on the promise that each of its views is reached from one
        of the five surfaces. This one was not (GAPS #420).
      -->
      <div v-if="stage === 'money_in' && current && current.unplaced && current.unplaced.count" class="fx-toolbar">
        <router-link class="fx-btn fx-btn--primary" :to="{ path: '/financials', query: { view: 'bank' } }">
          Place {{ current.unplaced.count }} payment(s) from the bank
        </router-link>
      </div>

      <!-- An account nobody connected is one nothing will ever be matched in (GAPS #448): the next step, not an error. -->
      <div v-if="stage === 'money_in' && current && current.has_bank_account === false" class="fx-toolbar">
        <p class="fx-muted">No bank account is set up, so nothing that arrives can be matched here.</p>
        <router-link class="fx-btn" to="/settings/finance">Add a bank account</router-link>
      </div>
      <div v-else-if="stage === 'money_in' && current && current.unconnected && current.unconnected.length" class="fx-toolbar">
        <p class="fx-muted">
          {{ current.unconnected.map((a) => a.name).join(", ") }}
          {{ current.unconnected.length === 1 ? "is" : "are" }} not connected, so its money cannot be matched here.
        </p>
        <router-link class="fx-btn" to="/settings/finance">Connect with Setu</router-link>
        <router-link class="fx-btn fx-btn--ghost" :to="{ path: '/financials', query: { view: 'bank' } }">
          Upload a statement
        </router-link>
      </div>

      <!--
        ⚠️ The stage renders the register that ALREADY owns it. Merging the pages was navigation, not a rewrite —
        every figure below is served by the same endpoint it was before, which is what lets the money fixture
        prove the merge changed nothing.

        `:key` remounts on a stage that needs a different endpoint; the three document stages share one and swap
        by prop, so the drawer does not blink when you step along the pipeline.
      -->
      <Billing
        v-if="documentStage"
        embedded
        :initial-view="stage === 'money_in' ? 'receipts' : 'all'"
        :stage-filter="stageFilter"
        @changed="refreshStages"
      />
      <Collections v-else-if="stage === 'overdue'" key="overdue" embedded />
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import Billing from "@/view/pages/freight/Billing.vue";
import Collections from "@/view/pages/freight/Collections.vue";

/** The filter each document stage implies — the register is one query, the stage is which slice of it. */
const STAGE_FILTERS = {
  to_bill: { awaiting: true, own_drafts: false, status: "" },
  drafts: { awaiting: false, own_drafts: true, status: "" },
  issued: { awaiting: false, own_drafts: false, status: "" },
  money_in: { awaiting: false, own_drafts: false, status: "" },
};

export default {
  name: "MoneyIn",
  components: { Figure, Billing, Collections },
  data: () => ({
    stages: [], stage: "issued", branches: [],
    loading: true, error: null,
  }),
  computed: {
    current() {
      return this.stages.find((s) => s.key === this.stage) || null;
    },
    documentStage() {
      return Object.prototype.hasOwnProperty.call(STAGE_FILTERS, this.stage);
    },
    stageFilter() {
      return STAGE_FILTERS[this.stage] || null;
    },
  },
  created() {
    // Arrived from a Today card: open on the stage it counted.
    if (this.$route.query.stage) this.stage = this.$route.query.stage;

    this.load();
  },
  methods: {
    /** The stage totals again, quietly — without `loading`, which would hide and remount the register (GAPS #420). */
    refreshStages() {
      ApiService.get("/money-in/stages")
        .then(({ data }) => { this.stages = data.stages || []; })
        .catch(() => {});
    },
    load() {
      this.loading = true;
      ApiService.get("/money-in/stages")
        .then(({ data }) => {
          this.stages = data.stages || [];
          this.branches = data.branches || [];

          // Open on the first stage that has work in it, so the page lands where the day is.
          if (!this.$route.query.stage) {
            const waiting = this.stages.find((s) => s.count > 0);
            if (waiting) this.stage = waiting.key;
          }

          this.error = null;
        })
        .catch((e) => {
          this.error = (e.response && e.response.data && e.response.data.error) || "Money in could not be loaded.";
        })
        .finally(() => { this.loading = false; });
    },
  },
};
</script>
