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
          <!-- 🌙 How often the free Gemma answered at night (user, 2026-09-15). -->
          <div class="fx-tile">
            <span class="fx-tile__label">Answered free at night</span>
            <span class="fx-tile__value">{{ data.tiers.free.share_percent }}%</span>
            <p class="fx-muted fx-tile__detail">{{ data.tiers.free.calls }} calls · avg {{ data.tiers.free.avg_seconds }} s · ₹0</p>
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
        <!--
          🌙 Free Gemma from 8pm to 10am India time, the paid model through the working day and whenever the free one
          does not answer (user, 2026-09-18). Credits are charged either way. It is
          shared free capacity (often busy) and gives looser JSON, so extraction starts off.
        -->
        <fieldset class="fx-ai-night">
          <legend class="fx-field__label">Free Gemma outside the working day (8pm–10am), paid if it does not answer</legend>
          <label class="fx-checkbox"><input v-model="form.night_free_help_drafts" type="checkbox" /> Help questions and email drafts</label>
          <label class="fx-checkbox"><input v-model="form.night_free_extraction" type="checkbox" /> Reading invoices and packing lists (scans always use the paid model)</label>
        </fieldset>
        <button class="fx-btn fx-btn--primary" :disabled="saving" @click="save">{{ saving ? "Saving…" : "Save limits" }}</button>
        <span v-if="saved" class="fx-muted"> Saved.</span>
      </section>

      <!--
        Per company (user, 2026-09-15): what AI each customer used this month, against its monthly limit.
        Today's budget = (limit − spent before today) ÷ days left. Help and drafts stop at 70 % of it;
        extraction may use the whole day; at 100 % AI stops and the work continues without it.
      -->
      <section class="fx-section">
        <h2 class="fx-section__title">By customer</h2>
        <p class="fx-muted">
          Monthly AI limit per customer — empty follows the plan: the larger of the plan minimum (Tactical ₹500,
          Command ₹2,000) and AI users (pricing, operations, sales) × ₹150. Core has no AI.
          Help questions and email drafts pause at 70% of today's budget so documents keep being read.
        </p>
        <div class="fx-table-wrap">
          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col" class="fx-num">Documents</th>
                <th scope="col" class="fx-num">Help</th>
                <th scope="col" class="fx-num">Drafts</th>
                <th scope="col" class="fx-num">Spent this month</th>
                <th scope="col" class="fx-num">Today</th>
                <th scope="col">Monthly limit (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in data.by_company" :key="c.id">
                <td>
                  {{ c.company }} <span class="fx-muted">· {{ c.tier }}</span>
                  <div class="fx-muted fx-ai-users">
                    {{ c.budget.ai_users }} AI users × ₹{{ inr(c.budget.per_user) }} = ₹{{ inr(c.budget.ai_users * c.budget.per_user) }}
                    <template v-if="c.budget.plan_minimum > c.budget.ai_users * c.budget.per_user"> · plan minimum ₹{{ inr(c.budget.plan_minimum) }}</template>
                  </div>
                </td>
                <td class="fx-num">{{ c.documents }}</td>
                <td class="fx-num">{{ c.help }}</td>
                <td class="fx-num">{{ c.drafts }}</td>
                <td class="fx-num" :class="{ 'fx-error': c.budget.used_month_percent >= 100 }">
                  ₹{{ inr(c.budget.spent_month) }}
                  <span class="fx-muted">{{ c.budget.used_month_percent === null ? "" : "· " + c.budget.used_month_percent + "%" }}</span>
                </td>
                <td class="fx-num">
                  ₹{{ inr(c.budget.spent_today) }} of ₹{{ inr(c.budget.today_budget) }}
                </td>
                <td>
                  <input
                    v-model="limits[c.id]"
                    type="number" min="0" step="100" class="fx-input fx-ai-limit"
                    :placeholder="'Plan: ' + inr(c.budget.plan_limit)"
                    @change="saveLimit(c)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
  data: () => ({ data: null, loading: true, error: null, saving: false, saved: false, form: {}, limits: {} }),
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
      // Only an override shows in the box; an empty box follows the plan (the placeholder says how much).
      this.limits = Object.fromEntries(data.by_company.map((c) => [c.id, c.budget.overridden ? c.budget.limit : ""]));
      this.error = null;
    },
    saveLimit(c) {
      const value = this.limits[c.id];
      ApiService.put(`/superadmin/ai-usage/companies/${c.id}/limit`, { ai_monthly_limit_inr: value === "" || value === null ? null : Number(value) })
        .then(({ data }) => { this.apply(data); })
        .catch((e) => { this.error = this.readable(e); });
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

<style scoped>
.fx-ai-limit { width: 9rem; }
.fx-ai-users { font-size: .75rem; }
.fx-ai-night { border: 0; padding: 0; margin: var(--space-3) 0; display: flex; flex-direction: column; gap: var(--space-1); }
.fx-table-wrap { overflow-x: auto; }
</style>
