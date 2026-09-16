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
      ✉ Mails to the team (user, 2026-09-16): worked out nightly from the figures — targets, drops, clients gone quiet,
      a branch behind target, lanes lost on price, slower replies, money overdue. Drafted when opened, sent by the Boss
      from his own mailbox; nothing goes on its own.
    -->
    <section class="fx-section">
      <h2 class="fx-section__title">Mails to your team</h2>
      <p class="fx-muted fx-outreach__intro">Suggested from the figures. Open one to read the draft, change anything, and send it yourself.</p>

      <p v-if="mailsLoaded && !hasMailbox" class="fx-warn" role="status">
        Mails go from your own mailbox. <router-link to="/mailboxes">Connect your mailbox</router-link> before sending.
      </p>
      <p v-if="mailsLoaded && !mails.length" class="fx-muted">Nothing to raise with the team right now.</p>

      <ul v-else class="fx-outreach">
        <li v-for="m in mails" :key="m.id" class="fx-outreach__card">
          <div class="fx-outreach__head">
            <strong>{{ m.branch }}</strong>
            <span class="fx-chip">{{ m.title }}</span>
          </div>
          <p class="fx-outreach__why">{{ mailSummary(m) }}</p>
          <p class="fx-muted fx-outreach__note">
            To: {{ m.suggested_to.length ? m.suggested_to.map((p) => p.name).join(", ") : "nobody in this branch yet — add who should get it" }}
          </p>

          <form v-if="dismissing && dismissing.id === m.id" class="fx-outreach__dismiss" @submit.prevent="dismissMail(m)">
            <label class="fx-field">
              <span class="fx-field__label">Why dismiss?</span>
              <select v-model="dismissing.reason" class="fx-input" required>
                <option value="" disabled>Choose a reason</option>
                <option v-for="(label, key) in dismissReasons" :key="key" :value="key">{{ label }}</option>
              </select>
            </label>
            <input v-if="dismissing.reason" v-model="dismissing.note" class="fx-input" maxlength="500"
                   :required="dismissing.reason === 'other'" placeholder="Anything to add" />
            <p v-if="dismissing.error" class="fx-error" role="alert">{{ dismissing.error }}</p>
            <div class="fx-outreach__actions">
              <button class="fx-btn" :disabled="!dismissing.reason">Dismiss</button>
              <button type="button" class="fx-btn fx-btn--ghost" @click="dismissing = null">Cancel</button>
            </div>
          </form>
          <div v-else class="fx-outreach__actions">
            <button class="fx-btn fx-btn--primary" @click="openMail(m)">{{ m.subject ? "Open draft" : "✉ Draft mail" }}</button>
            <button class="fx-btn fx-btn--ghost" @click="dismissing = { id: m.id, reason: '', note: '', error: null }">Dismiss</button>
          </div>
        </li>
      </ul>
    </section>

    <FxDrawer :open="!!composing" :title="composing ? composing.title + ' · ' + composing.branch : ''" @close="composing = null">
      <template v-if="composing">
        <p v-if="drafting" class="fx-muted" role="status">Writing the draft… {{ draftSeconds }} s</p>
        <template v-else>
          <p class="fx-muted fx-outreach__note">
            {{ writtenBy === "ai" ? "Drafted by AI from the figures." : "A starting draft from the figures." }}
            Read it and change anything before you send.
          </p>
          <label class="fx-field">
            <span class="fx-field__label">To</span>
            <input v-model="form.to" class="fx-input" placeholder="name@company.com, …" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Cc</span>
            <input v-model="form.cc" class="fx-input" placeholder="Optional" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Subject</span>
            <input v-model="form.subject" class="fx-input" />
          </label>
          <MailEditor v-model="form.body" />
          <p class="fx-muted fx-outreach__note">Your mailbox signature is added when it is sent.</p>
          <p v-if="sendError" class="fx-error" role="alert">{{ sendError }}</p>
        </template>
      </template>
      <template #footer>
        <button class="fx-btn" :disabled="drafting || sending" @click="draftMail(composing)">Redraft</button>
        <button class="fx-btn fx-btn--primary" :disabled="drafting || sending || !form.to.trim()" @click="sendMail">
          {{ sending ? "Sending…" : "Send" }}
        </button>
      </template>
    </FxDrawer>

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
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";

const list = (text) => String(text || "").split(",").map((x) => x.trim()).filter(Boolean);

export default {
  name: "BossDashboard",
  components: { Figure, FxDrawer, MailEditor },
  data: () => ({
    periods: [], loading: true, error: null, grain: "month", basis: "fiscal",
    branches: [], modes: [], asOf: null, targets: null, branchesReason: null,
    ai: null,
    targetMonth: new Date().toISOString().slice(0, 7), editingTargets: false, savingTargets: false,
    targetForm: {}, targetsError: null,
    /* Mails to the team: the suggestions, the one open in the drawer, and what is being typed. */
    mails: [], mailsLoaded: false, hasMailbox: true, dismissReasons: {}, dismissing: null,
    composing: null, form: { to: "", cc: "", subject: "", body: "" },
    drafting: false, draftSeconds: 0, writtenBy: null, sending: false, sendError: null,
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
    this.loadMails();
    this.load();
    this.loadBranches();
    ApiService.get("/ai-usage/company").then(({ data }) => { this.ai = data; }).catch(() => { this.ai = null; });
    this.loadTargets();
  },
  methods: {
    loadMails() {
      ApiService.get("/boss/mails")
        .then(({ data }) => {
          this.mails = data.mails || [];
          this.hasMailbox = data.has_mailbox;
          this.dismissReasons = data.dismiss_reasons || {};
        })
        .catch(() => { this.mails = []; })
        .finally(() => { this.mailsLoaded = true; });
    },
    /** One line saying what the mail is about, from its figures. */
    mailSummary(m) {
      const f = m.facts || {};
      switch (m.kind) {
        case "next_month_targets": return "Targets proposed for " + f.month + " from the last 3 months and the trend.";
        case "volume_drop": return "Tonnage " + f.change_percent + "% over the last 3 months: " + f.monthly_tonnage_kg_last_3_months + " kg a month against " + f.monthly_tonnage_kg_before + " kg before.";
        case "top_clients_quiet": return (f.clients || []).map((c) => c.client + " (" + c.last_3_months_kg + " kg of a usual " + c.usual_quarter_kg + " kg a quarter)").join(", ") + ".";
        case "behind_target": return (f.behind || []).map((b) => b.mode.toUpperCase() + " " + b.measure + " at " + b.month_end_pace_percent + "% pace").join(", ") + " · " + f.days_left + " days left.";
        case "losing_on_price": return (f.lanes || []).map((l) => l.lane + ": " + l.lost_on_price + " of " + l.closed + " lost on price").join(", ") + ".";
        case "slow_replies": return "First replies take " + f.median_hours_last_30_days + " h (was " + f.median_hours_60_days_before + " h).";
        case "money_overdue": return "₹" + Number(f.overdue_60_plus_inr).toLocaleString("en-IN") + " overdue beyond 60 days.";
        default: return "";
      }
    },
    openMail(m) {
      this.composing = m;
      this.sendError = null;
      if (m.subject) this.fillMail(m);
      else this.draftMail(m);
    },
    fillMail(m) {
      this.form = { to: m.to.join(", "), cc: m.cc.join(", "), subject: m.subject || "", body: m.body || "" };
    },
    draftMail(m) {
      this.drafting = true;
      this.draftSeconds = 0;
      this.sendError = null;
      const ticker = setInterval(() => { this.draftSeconds += 1; }, 1000);

      ApiService.post(`/boss/mails/${m.id}/draft`, {})
        .then(({ data }) => {
          Object.assign(m, data);
          this.writtenBy = data.written_by;
          if (this.composing === m) this.fillMail(m);
        })
        .catch((err) => { this.sendError = this.mailError(err, "Could not write the draft. Try again."); })
        .finally(() => { clearInterval(ticker); this.drafting = false; });
    },
    sendMail() {
      const m = this.composing;
      this.sending = true;
      this.sendError = null;

      ApiService.post(`/boss/mails/${m.id}/send`, {
        to: list(this.form.to), cc: list(this.form.cc), subject: this.form.subject, body: this.form.body,
      })
        .then(() => { this.mails = this.mails.filter((x) => x.id !== m.id); this.composing = null; })
        .catch((err) => { this.sendError = this.mailError(err, "Not sent. Try again."); })
        .finally(() => { this.sending = false; });
    },
    dismissMail(m) {
      const d = this.dismissing;
      ApiService.post(`/boss/mails/${m.id}/dismiss`, { reason: d.reason, note: d.note || null })
        .then(() => { this.mails = this.mails.filter((x) => x.id !== m.id); this.dismissing = null; })
        .catch((err) => { d.error = this.mailError(err, "Not dismissed. Try again."); });
    },
    mailError(err, fallback) {
      const d = (err.response && err.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat()[0];
      return d.error || d.message || fallback;
    },
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
