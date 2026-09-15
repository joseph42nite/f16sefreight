<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">AI usage</h1>
      <p class="fx-page-sub">
        What Gemma 4 on OpenRouter has cost this month, across every customer. Reading invoices and
        scans keeps running when the budget is reached — this page is where you decide what to do.
      </p>
    </header>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="fx-muted">Loading…</p>

    <template v-if="data">
      <!-- 🔴 The user's rule: at the budget, SAY SO here; extraction is not stopped. -->
      <p v-if="data.month.over_budget" class="fx-warn" role="alert">
        <strong>This month's AI spend has reached the budget</strong> —
        ₹{{ inr(data.month.spend_inr) }} of ₹{{ inr(data.month.budget_inr) }}. Extraction is still
        running. Raise the budget, lower the per-user limit, or set a credit limit on the OpenRouter key
        to stop it.
      </p>

      <section class="fx-section">
        <div class="fx-tiles">
          <div class="fx-tile">
            <span class="fx-tile__label">Spent this month</span>
            <span class="fx-tile__value">₹{{ inr(data.month.spend_inr) }}</span>
            <p class="fx-muted fx-tile__detail">${{ data.month.spend_usd }} · {{ data.month.calls }} calls</p>
          </div>
          <div class="fx-tile">
            <span class="fx-tile__label">Budget used</span>
            <span class="fx-tile__value">{{ data.month.used_percent }}%</span>
            <p class="fx-muted fx-tile__detail">of ₹{{ inr(data.month.budget_inr) }}</p>
          </div>
          <!-- 🔴 Cheap first, fast fallback always: how often the ≈6× dearer fallback answered. -->
          <div class="fx-tile">
            <span class="fx-tile__label">Answered by economy</span>
            <span class="fx-tile__value">{{ data.tiers.economy.share_percent }}%</span>
            <p class="fx-muted fx-tile__detail">{{ data.tiers.economy.calls }} calls · avg {{ data.tiers.economy.avg_seconds }} s · ₹{{ inr(data.tiers.economy.cost_inr) }}</p>
          </div>
          <div class="fx-tile">
            <span class="fx-tile__label">Needed the fast fallback</span>
            <span class="fx-tile__value">{{ data.tiers.fast.share_percent }}%</span>
            <p class="fx-muted fx-tile__detail">{{ data.tiers.fast.calls }} calls · avg {{ data.tiers.fast.avg_seconds }} s · ₹{{ inr(data.tiers.fast.cost_inr) }}</p>
          </div>
          <div class="fx-tile">
            <span class="fx-tile__label">Per-user daily limit</span>
            <span class="fx-tile__value">{{ data.settings.per_user_daily_limit }}</span>
            <p class="fx-muted fx-tile__detail">over it, documents are read by labels only</p>
          </div>
        </div>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Limits</h2>
        <div class="fx-ai-settings">
          <label class="fx-field">
            <span class="fx-field__label">Monthly budget (₹)</span>
            <input v-model.number="form.monthly_budget_inr" type="number" min="0" step="500" class="fx-input" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Per-user daily limit (documents)</span>
            <input v-model.number="form.per_user_daily_limit" type="number" min="0" class="fx-input" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Per-user daily help questions</span>
            <input v-model.number="form.per_user_daily_questions" type="number" min="0" class="fx-input" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">₹ per US$ (for showing cost)</span>
            <input v-model.number="form.usd_to_inr" type="number" min="1" step="0.5" class="fx-input" />
          </label>
        </div>
        <button class="fx-btn fx-btn--primary" :disabled="saving" @click="save">{{ saving ? "Saving…" : "Save limits" }}</button>
        <span v-if="saved" class="fx-muted"> Saved.</span>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">By customer</h2>
        <p v-if="!data.by_company.length" class="fx-muted">No AI calls this month.</p>
        <table v-else class="fx-table">
          <thead><tr><th scope="col">Customer</th><th scope="col" class="fx-num">Calls</th><th scope="col" class="fx-num">Cost</th></tr></thead>
          <tbody>
            <tr v-for="c in data.by_company" :key="c.company">
              <td>{{ c.company }}</td><td class="fx-num">{{ c.calls }}</td><td class="fx-num">₹{{ inr(c.cost_inr) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Top users</h2>
        <p v-if="!data.by_user.length" class="fx-muted">No AI calls this month.</p>
        <table v-else class="fx-table">
          <thead><tr><th scope="col">User</th><th scope="col" class="fx-num">Today</th><th scope="col" class="fx-num">This month</th><th scope="col" class="fx-num">Cost</th></tr></thead>
          <tbody>
            <tr v-for="u in data.by_user" :key="u.email || u.name">
              <td>{{ u.name || "—" }} <span class="fx-muted">{{ u.email }}</span></td>
              <td class="fx-num">{{ u.calls_today }} / {{ data.settings.per_user_daily_limit }}</td>
              <td class="fx-num">{{ u.calls }}</td>
              <td class="fx-num">₹{{ inr(u.cost_inr) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Providers</h2>
        <p class="fx-muted">Which OpenRouter provider answered, how fast, and how often a stuck attempt was retried elsewhere.</p>
        <table v-if="data.by_provider.length" class="fx-table">
          <thead><tr><th scope="col">Provider</th><th scope="col">Tier</th><th scope="col">Kind</th><th scope="col" class="fx-num">Calls</th><th scope="col" class="fx-num">Average</th><th scope="col" class="fx-num">Retried</th></tr></thead>
          <tbody>
            <tr v-for="p in data.by_provider" :key="(p.provider || '-') + p.tier + p.purpose">
              <td>{{ p.provider || "—" }}</td><td>{{ p.tier || "—" }}</td><td>{{ p.purpose }}</td><td class="fx-num">{{ p.calls }}</td>
              <td class="fx-num">{{ (p.avg_ms / 1000).toFixed(1) }} s</td><td class="fx-num">{{ p.retried }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  name: "AiUsage",
  data: () => ({ data: null, loading: true, error: null, saving: false, saved: false, form: {} }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get("/superadmin/ai-usage")
        .then(({ data }) => { this.apply(data); })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    apply(data) {
      this.data = data;
      this.form = { ...data.settings };
      this.error = null;
    },
    save() {
      this.saving = true;
      this.saved = false;
      ApiService.put("/superadmin/ai-usage/settings", this.form)
        .then(({ data }) => { this.apply(data); this.saved = true; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.saving = false; });
    },
    inr(n) {
      return Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
