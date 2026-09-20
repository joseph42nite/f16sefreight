<template>
  <div class="fx-credits">
    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!data" class="fx-muted">Loading…</p>

    <template v-else>
      <!-- 🔴 Credits per piece of AI reading, never money (user, 2026-09-14). -->
      <div class="fx-tiles">
        <div class="fx-tile">
          <span class="fx-tile__label">Credits left</span>
          <span class="fx-tile__value">{{ data.balance }}</span>
          <p v-if="data.floor < 0" class="fx-muted fx-tile__detail">can run down to {{ data.floor }} before AI reading stops</p>
        </div>
        <div class="fx-tile">
          <span class="fx-tile__label">Used this month</span>
          <span class="fx-tile__value">{{ data.month.credits }}</span>
          <p class="fx-muted fx-tile__detail">
            across {{ data.month.documents }} documents<template v-if="data.month.mails"> and {{ data.month.mails }} emails</template>
          </p>
        </div>
      </div>

      <h3 class="fx-section__title">What AI reading uses</h3>
      <ul class="fx-credits__rates">
        <li><strong>{{ data.rates.text }}</strong> {{ plural(data.rates.text) }} · invoice or packing list read by AI</li>
        <li><strong>{{ data.rates.scan }}</strong> {{ plural(data.rates.scan) }} · scan read by AI (after you approve it)</li>
        <!-- The rate that made credits decimal: a mail costs about a fifth of a document to read. -->
        <li><strong>{{ data.rates.mail }}</strong> {{ plural(data.rates.mail) }} · incoming email sorted into a folder for you</li>
        <li><strong>{{ data.rates.awb }}</strong> credits · airway bill, or any document read by labels</li>
      </ul>
      <p class="fx-muted">
        When credits run out, invoices are still read by labels and the panel says so, and new email waits in
        <strong>Other</strong> for you to file.
      </p>

      <h3 class="fx-section__title">This month</h3>
      <table class="fx-table">
        <thead><tr><th scope="col">Kind</th><th scope="col" class="fx-num">Count</th><th scope="col" class="fx-num">Credits</th></tr></thead>
        <tbody>
          <tr v-for="k in data.month.by_kind.filter((k) => k.count)" :key="k.kind">
            <td>{{ k.label }}</td><td class="fx-num">{{ k.count }}</td><td class="fx-num">{{ k.credits }}</td>
          </tr>
          <tr v-if="!data.month.documents && !data.month.mails"><td colspan="3" class="fx-muted">Nothing read this month.</td></tr>
        </tbody>
      </table>

      <!-- Documents only: email filing is counted above, and read in the inbox rather than here. -->
      <h3 class="fx-section__title">Recent documents</h3>
      <table v-if="data.recent.length" class="fx-table">
        <thead><tr><th scope="col">Document</th><th scope="col">Read as</th><th scope="col" class="fx-num">Credits</th><th scope="col">By</th><th scope="col">When</th></tr></thead>
        <tbody>
          <tr v-for="d in data.recent" :key="d.id">
            <td>{{ d.filename }}</td>
            <td>{{ d.label }}</td>
            <td class="fx-num">{{ d.credits }}</td>
            <td>{{ d.user }}</td>
            <td><Figure :value="d.created_at" kind="dateTime" /></td>
          </tr>
        </tbody>
      </table>
      <p v-else class="fx-muted">No documents yet.</p>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "CreditsPanel",
  components: { Figure },
  data: () => ({ data: null, error: null }),
  created() {
    ApiService.get("/user/credits")
      .then(({ data }) => { this.data = data; })
      .catch((e) => {
        const d = (e.response && e.response.data) || {};
        this.error = d.error || d.message || "Could not load credits.";
      });
  },
  methods: {
    plural(n) {
      // Rates carry decimals now (0.2 for a mail), so only exactly 1 is singular.
      return n === 1 ? "credit" : "credits";
    },
  },
};
</script>
