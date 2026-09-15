<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Overview</h1>
      <p class="fx-page-sub">
        Cross-mode oversight. The Boss portal has no transport scope, so air and sea
        appear side by side rather than one at a time.
      </p>
    </header>

    <!--
      AI use against the company's monthly limit, set by F16s (user, 2026-09-15). Help and email drafts pause
      at 70% of today's budget so documents keep being read; at 100% the work continues without AI.
    -->
    <section v-if="ai" class="fx-section">
      <h2 class="fx-section__title">AI use</h2>
      <p v-if="!ai.has_limit" class="fx-muted">AI is not included for your company. Ask F16s to set an AI limit.</p>
      <template v-else>
        <div class="fx-tiles">
          <div class="fx-tile">
            <span class="fx-tile__label">This month's AI allowance</span>
            <span class="fx-tile__value">{{ ai.used_month_percent }}% used</span>
            <p class="fx-muted fx-tile__detail">{{ ai.days_left }} days left this month</p>
          </div>
          <div class="fx-tile">
            <span class="fx-tile__label">Today's AI budget</span>
            <span class="fx-tile__value">{{ ai.used_today_percent === null ? "—" : ai.used_today_percent + "% used" }}</span>
            <p class="fx-muted fx-tile__detail">Help and drafts pause at {{ ai.other_uses_share_percent }}%</p>
          </div>
          <div class="fx-tile">
            <span class="fx-tile__label">Read by AI this month</span>
            <span class="fx-tile__value">{{ ai.month.documents }} documents</span>
            <p class="fx-muted fx-tile__detail">{{ ai.month.help }} help questions · {{ ai.month.drafts }} email drafts</p>
          </div>
        </div>
      </template>
    </section>

    <!-- ── Cross-branch, cross-mode ─────────────────────────────────────── -->
    <section v-if="branches.length" class="fx-section">
      <h2 class="fx-section__title">
        Branches — as of <Figure :value="asOf" kind="date" />
      </h2>

      <div class="fx-matrix-wrap">
        <table class="fx-table fx-matrix">
          <thead>
            <tr>
              <th scope="col">Branch</th>
              <th v-for="m in modes" :key="m" class="fx-num" scope="col">{{ m }} tonnage YTD</th>
              <th class="fx-num" scope="col">Revenue MTD</th>
              <th class="fx-num" scope="col">Overdue 60+</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in branches" :key="b.agent_id">
              <th scope="row">{{ b.name }} <span class="fx-muted identifier">{{ b.code }}</span></th>
              <td v-for="m in modes" :key="m" class="fx-num">
                <!--
                  🔴 A branch that does not run this mode has NO CELL, not a zero.
                  "We do not do sea here" and "we moved no sea this month" are
                  different facts, and a zero asserts the second.
                -->
                <Figure v-if="b.modes[m]" :value="b.modes[m].tonnage_ytd" kind="weight" />
                <span v-else class="is-empty" aria-label="This branch does not run this mode"></span>
              </td>
              <td class="fx-num"><Figure :value="b.totals.revenue_mtd" kind="currency" currency-code="INR" /></td>
              <td class="fx-num" :class="{ 'fx-over': b.totals.overdue_60_plus > 0 }">
                <Figure :value="b.totals.overdue_60_plus" kind="currency" currency-code="INR" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>

    <!--
      🎯 Targets (PRD §2.3; user, 2026-09-15): each branch, each month, each mode — shipments, tonnage and, on
      Command, revenue. Month to date against target, and the month-end pace while the month runs.
    -->
    <section v-if="targets" class="fx-section">
      <h2 class="fx-section__title">Targets</h2>
      <div class="fx-toolbar">
        <label class="fx-field">
          <span class="fx-field__label">Month</span>
          <input v-model="targetMonth" type="month" class="fx-input" @change="loadTargets" />
        </label>
        <button v-if="!editingTargets" class="fx-btn" @click="editTargets">Set targets</button>
        <template v-else>
          <button class="fx-btn fx-btn--primary" :disabled="savingTargets" @click="saveTargets">{{ savingTargets ? "Saving…" : "Save targets" }}</button>
          <button class="fx-btn fx-btn--ghost" @click="editingTargets = false">Cancel</button>
        </template>
      </div>
      <p class="fx-muted fx-board__note">
        <template v-if="targets.as_of">So far as of <Figure :value="targets.as_of" kind="date" />.</template>
        <template v-else>No figures for this month yet.</template>
        "Month end" is the pace so far carried to the end of the month.
      </p>
      <p v-if="targetsError" class="fx-error" role="alert">{{ targetsError }}</p>

      <div class="fx-matrix-wrap">
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Branch</th>
              <th scope="col">Mode</th>
              <th v-for="m in measures" :key="m.key" scope="col">{{ m.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in targets.rows" :key="r.agent_id + r.mode">
              <th scope="row">{{ r.branch }} <span class="fx-muted identifier">{{ r.code }}</span></th>
              <td>{{ r.mode }}</td>
              <td v-for="m in measures" :key="m.key">
                <input
                  v-if="editingTargets"
                  v-model="targetForm[r.agent_id + '|' + r.mode][m.key]"
                  type="number" min="0" class="fx-input fx-target__input" :placeholder="'No target'"
                />
                <template v-else>
                  <div>
                    <Figure :value="r.measures[m.key].actual" :kind="m.kind" :currency-code="m.kind === 'currency' ? 'INR' : null" />
                    <span class="fx-muted"> of </span>
                    <Figure v-if="r.measures[m.key].target !== null" :value="r.measures[m.key].target" :kind="m.kind" :currency-code="m.kind === 'currency' ? 'INR' : null" />
                    <span v-else class="fx-muted">no target</span>
                  </div>
                  <div v-if="r.measures[m.key].percent !== null" class="fx-target__bar" :aria-label="r.measures[m.key].percent + '% of target'">
                    <span :style="{ width: Math.min(r.measures[m.key].percent, 100) + '%' }" :class="{ 'is-met': r.measures[m.key].percent >= 100 }"></span>
                  </div>
                  <div v-if="r.measures[m.key].percent !== null" class="fx-muted fx-target__meta">
                    {{ r.measures[m.key].percent }}%
                    <template v-if="r.measures[m.key].month_end !== null"> · month end
                      <Figure :value="r.measures[m.key].month_end" :kind="m.kind" :currency-code="m.kind === 'currency' ? 'INR' : null" />
                    </template>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p v-else-if="branchesReason === 'never_computed'" class="fx-warn" role="status">
      No rollup has run, so there is nothing to compare. This is not branches that
      shipped nothing — it is branches nobody has computed.
      Run <code>sales:compute-snapshots</code>.
    </p>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Grain</span>
        <select v-model="grain" class="fx-input" @change="load">
          <option value="day">Daily (DSR)</option>
          <option value="month">Monthly (MSR)</option>
          <option value="year">Yearly (YSR)</option>
        </select>
      </label>

      <!--
        🔴 The year basis is REQUIRED, never defaulted. ysr_funnel_view is a UNION over
        fiscal and calendar; asking without one counts every enquiry twice. For Jan–Mar
        the two genuinely describe different twelve-month windows, and that is exactly
        where month-end reconciliation arguments start — so the reader chooses.
      -->
      <label v-if="grain === 'year'" class="fx-field">
        <span class="fx-field__label">Year basis</span>
        <select v-model="basis" class="fx-input" @change="load">
          <option value="fiscal">Fiscal (Apr–Mar)</option>
          <option value="calendar">Calendar</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!periods.length" class="fx-muted">
      No enquiries in this window. A period with none has no conversion rate — that is
      not a rate of zero.
    </p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Period</th>
          <th scope="col">Mode</th>
          <th class="fx-num" scope="col">Raised</th>
          <th class="fx-num" scope="col">Replied</th>
          <th class="fx-num" scope="col">Pending</th>
          <th class="fx-num" scope="col">Converted</th>
          <th class="fx-num" scope="col">Lost</th>
          <th class="fx-num" scope="col">Conversion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in periods" :key="i">
          <td><Figure :value="p.period_start" kind="date" /></td>
          <td>{{ p.transport_mode }}</td>
          <td class="fx-num"><Figure :value="p.enquiries_raised" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_replied" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_pending" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_converted" kind="count" /></td>
          <td class="fx-num"><Figure :value="p.enquiries_lost" kind="count" /></td>
          <!--
            §7.1 NULL, never 0%. "Nothing came in" and "everything was lost" are
            opposite facts, and an em dash is the only honest rendering of the first.
          -->
          <td class="fx-num">
            <span v-if="p.conversion_rate_pct === null" class="is-empty" aria-label="No enquiries in this period"></span>
            <span v-else>{{ Number(p.conversion_rate_pct).toFixed(2) }}%</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "BossDashboard",
  components: { Figure },
  data: () => ({
    periods: [], loading: true, error: null, grain: "month", basis: "fiscal",
    branches: [], modes: [], asOf: null, targets: null, branchesReason: null,
    ai: null,
    targetMonth: new Date().toISOString().slice(0, 7), editingTargets: false, savingTargets: false,
    targetForm: {}, targetsError: null,
  }),
  computed: {
    /** Revenue is a Command figure; Tactical has no invoicing. */
    measures() {
      const all = [
        { key: "shipments", label: "Shipments", kind: "count" },
        { key: "tonnage", label: "Tonnage", kind: "weight" },
        { key: "revenue", label: "Revenue", kind: "currency" },
      ];
      return this.targets && this.targets.with_revenue ? all : all.slice(0, 2);
    },
  },
  created() {
    this.load();
    this.loadBranches();
    ApiService.get("/ai-usage/company").then(({ data }) => { this.ai = data; }).catch(() => { this.ai = null; });
    this.loadTargets();
  },
  methods: {
    loadTargets() {
      this.editingTargets = false;
      ApiService.get("/sales/targets?month=" + this.targetMonth)
        .then(({ data }) => { this.targets = data; this.targetsError = null; })
        .catch(() => { this.targets = null; });
    },
    editTargets() {
      this.targetForm = Object.fromEntries(this.targets.rows.map((r) => [
        r.agent_id + "|" + r.mode,
        Object.fromEntries(this.measures.map((m) => [m.key, r.measures[m.key].target === null ? "" : r.measures[m.key].target])),
      ]));
      this.editingTargets = true;
    },
    saveTargets() {
      this.savingTargets = true;
      const blank = (v) => (v === "" || v === null ? null : Number(v));
      const targets = this.targets.rows.map((r) => {
        const f = this.targetForm[r.agent_id + "|" + r.mode];
        return { agent_id: r.agent_id, mode: r.mode, shipments: blank(f.shipments), tonnage: blank(f.tonnage), revenue: blank(f.revenue) };
      });

      ApiService.put("/sales/targets", { month: this.targetMonth, targets })
        .then(({ data }) => { this.targets = data; this.editingTargets = false; this.targetsError = null; })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.targetsError = d.message || d.error || "Targets were not saved.";
        })
        .finally(() => { this.savingTargets = false; });
    },
    loadBranches() {
      ApiService.get("/sales/branches")
        .then(({ data }) => {
          this.branches = data.branches || [];
          this.modes = data.modes || [];
          this.asOf = data.as_of;
          this.branchesReason = data.reason || null;
        })
        /* The funnel below is the rest of the page — a failing comparison must not
           take it down with it. */
        .catch(() => { this.branches = []; });
    },
    load() {
      this.loading = true;
      let url = "/analytics/funnel?grain=" + this.grain;
      if (this.grain === "year") url += "&basis=" + this.basis;

      ApiService.get(url)
        .then(({ data }) => { this.periods = data.periods || []; this.error = null; })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.error = d.error || d.message || "Something went wrong.";
        })
        .finally(() => { this.loading = false; });
    },
  },
};
</script>
