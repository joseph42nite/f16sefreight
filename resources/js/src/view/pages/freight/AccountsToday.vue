<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Today</h1>
      <p class="fx-page-sub">
        {{ greeting }}
        <router-link to="/financials">Financials →</router-link>
      </p>
    </header>

    <div v-if="branches.length > 1" class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="agentId" class="fx-input" @change="load">
          <option :value="null">Every branch</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!--
        🔴 A count AND a figure, and the whole card is a link. Either number alone leaves you guessing — "6
        payments" could be ₹6,000 or ₹6 lakh — and a card you cannot click is a fact nobody can act on.
      -->
      <div class="fx-tiles fx-today__cards">
        <router-link
          v-for="card in cards"
          :key="card.key"
          class="fx-tile is-clickable"
          :class="{ 'fx-tile--warning': card.tone === 'warning' && card.count }"
          :to="card.to"
        >
          <span class="fx-tile__label">{{ card.label }}</span>
          <span class="fx-tile__value">
            <Figure :value="card.amount" kind="currency" currency-code="INR" />
          </span>
          <p class="fx-muted fx-tile__detail">
            {{ card.count }} {{ card.unit }}{{ card.count === 1 ? "" : "s" }} · {{ card.note }}
          </p>
        </router-link>
      </div>

      <!-- Only what is true today; each one clears itself when it is dealt with. -->
      <section class="fx-section">
        <h2 class="fx-section__title">Needs a decision</h2>
        <p v-if="!exceptions.length" class="fx-muted">
          Nothing is waiting on you. The period is open, nobody is over their limit, and every supplier statement
          agrees.
        </p>
        <ul v-else class="fx-list">
          <li v-for="(e, i) in exceptions" :key="'x-' + i" class="fx-list__item">
            <StatusChip :value="e.tone === 'critical' ? 'blocking' : 'check_this'" />
            <router-link :to="e.to">{{ e.text }}</router-link>
          </li>
        </ul>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">The rest of the desk</h2>
        <div class="fx-toolbar">
          <router-link class="fx-btn" to="/billing">Billing</router-link>
          <router-link class="fx-btn" to="/collections">Ageing &amp; collections</router-link>
          <router-link class="fx-btn" to="/financials">Registers &amp; reports</router-link>
          <router-link class="fx-btn" to="/profitability">Profitability</router-link>
          <router-link class="fx-btn" to="/journal">Journal</router-link>
          <router-link class="fx-btn" to="/clients-partners">Clients</router-link>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "AccountsToday",
  components: { Figure, StatusChip },
  data: () => ({
    cards: [], exceptions: [], branches: [], agentId: null, asOf: "",
    loading: true, error: null,
  }),
  computed: {
    /** What the day amounts to, in one line, before any of the numbers are read. */
    greeting() {
      if (this.loading || this.error) return "The accounts desk.";

      const work = this.cards.filter((c) => c.count > 0).length;

      if (!work && !this.exceptions.length) return "Nothing is waiting. The desk is clear.";

      return this.exceptions.length
        ? `${work} thing(s) to work through, and ${this.exceptions.length} that need a decision.`
        : `${work} thing(s) to work through.`;
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get("/accounts/today" + (this.agentId ? "?agent_id=" + this.agentId : ""))
        .then(({ data }) => {
          this.cards = data.cards || [];
          this.exceptions = data.exceptions || [];
          this.branches = data.branches || [];
          this.asOf = data.as_of;
          this.error = null;
        })
        .catch((e) => {
          this.error = (e.response && e.response.data && e.response.data.error) || "Today could not be loaded.";
        })
        .finally(() => { this.loading = false; });
    },
  },
};
</script>

<style scoped>
/* The cards are the page; they get room to breathe and read as one row on a desk monitor. */
.fx-today__cards {
  gap: 1rem;
}
</style>
