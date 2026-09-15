<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Sales</h1>
      <p class="fx-page-sub">
        <template v-if="scope === 'my_book'">Your client book, {{ modeLabel }}.</template>
        <template v-else>Branch performance, {{ modeLabel }}. Client attribution needs Command.</template>
      </p>
    </header>

    <!--
      §7 — the staleness banner. These numbers come from a rollup, not from live
      tables, so the page must say how old they are. A dashboard that cannot state
      its own freshness invites the reader to assume "live", which is the one thing
      it deliberately is not.
    -->
    <p v-if="staleness && staleness.reason === 'never_computed'" class="fx-warn" role="status">
      No rollup has run yet, so there are no figures to show. This is not a branch that
      shipped nothing — it is a branch nobody has computed. Run <code>sales:compute-snapshots</code>.
    </p>
    <p v-else-if="staleness && staleness.is_stale" class="fx-warn" role="status">
      Figures are {{ staleness.age_minutes }} minutes old. The rollup is overdue.
    </p>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Period</span>
        <select v-model="grain" class="fx-input" @change="loadCharts">
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </label>
      <!-- 🔴 The yearly funnel is a UNION over two bases; asking without one counts
           every enquiry twice. So the control only exists where the choice does. -->
      <label v-if="grain === 'year'" class="fx-field">
        <span class="fx-field__label">Year basis</span>
        <select v-model="basis" class="fx-input" @change="loadCharts">
          <option value="fiscal">Fiscal (Apr–Mar)</option>
          <option value="calendar">Calendar</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!--
        ✉ Client emails (PRD §7.3.7; user, 2026-09-15): suggestions from each client's own shipping trends.
        Gemma drafts, the rep reads, edits and sends from their own mailbox — nothing goes out on its own.
      -->
      <section class="fx-section" data-help="client-emails">
        <h2 class="fx-section__title">Client emails</h2>
        <p class="fx-muted fx-outreach__intro">Suggested from each client's shipping trends. You read, edit and send every email yourself.</p>

        <p v-if="outreachLoaded && !hasMailbox" class="fx-warn" role="status">
          Emails go from your own mailbox. <router-link to="/mailboxes">Connect your mailbox</router-link> before sending.
        </p>

        <p v-if="outreachLoaded && !emails.length" class="fx-muted">No client emails suggested right now.</p>

        <ul v-else class="fx-outreach">
          <li v-for="e in emails" :key="e.id" class="fx-outreach__card">
            <div class="fx-outreach__head">
              <!-- Tactical shows the client's domain; the name is a Command view (PRD §2.3.3). -->
              <strong>{{ e.client || e.domain }}</strong>
              <span class="fx-chip">{{ typeLabel(e.type) }}</span>
            </div>
            <p class="fx-outreach__why">{{ summary(e) }}</p>
            <div class="fx-outreach__actions">
              <button class="fx-btn fx-btn--primary" @click="openEmail(e)">{{ e.subject ? "Open draft" : "✉ Draft email" }}</button>
              <button class="fx-btn fx-btn--ghost" @click="dismiss(e)">Dismiss</button>
            </div>
          </li>
        </ul>
      </section>

      <!-- §7.4 Today's Actions sits ABOVE the charts. It is the worklist; the charts
           are the explanation. -->
      <section class="fx-section">
        <h2 class="fx-section__title">Today's actions</h2>

        <p v-if="!actions.length" class="fx-muted">Nothing ranked right now.</p>

        <ol v-else class="fx-actions">
          <li v-for="a in actions" :key="a.id" class="fx-action">
            <div class="fx-action__head">
              <StatusChip :value="a.action_type" />
              <span class="fx-action__score">{{ Math.round(a.priority_score) }}</span>
            </div>

            <!-- 🔴 A NULL narration is a first-class state, not an error. The model
                 layer is disposable: if it is down the row keeps every number and
                 merely loses its prose. -->
            <p v-if="a.narrated_text" class="fx-action__text">{{ a.narrated_text }}</p>
            <p v-else class="fx-muted fx-action__text">
              Not narrated. The figures below are the whole finding.
            </p>

            <dl v-if="a.facts" class="fx-defs fx-action__facts">
              <template v-for="(v, k) in a.facts">
                <dt :key="k + '-k'">{{ String(k).replace(/_/g, " ") }}</dt>
                <dd :key="k + '-v'">{{ v }}</dd>
              </template>
            </dl>

            <p v-if="a.impact_value" class="fx-action__impact">
              At stake <Figure :value="a.impact_value" kind="currency" currency-code="INR" />
            </p>
          </li>
        </ol>
      </section>

      <!--
        §7.4 CHART-FIRST, tables as drill-down. The charts answer "what is happening";
        the grid below answers "to which account". A rep opening this screen should see
        the shape of the month before they see a row.
      -->
      <section v-if="charts" class="fx-section fx-charts">
        <FxChart
          title="Tonnage & shipments"
          type="line"
          :series="tonnageSeries"
          :options="tonnageOptions"
          empty-message="No lane statistics yet. They appear after the first rollup that finds a converted enquiry with a lane."
        />

        <FxChart
          title="Top lanes by tonnage"
          type="bar"
          :series="laneSeries"
          :options="laneOptions"
          empty-message="No lanes recorded yet."
        />

        <FxChart
          title="Win / loss"
          type="donut"
          :series="funnelSeries"
          :options="funnelOptions"
          empty-message="No closed enquiries in this window."
        />
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">{{ scope === "my_book" ? "My book" : "Branch" }}</h2>
        <div class="fx-tiles">
          <div v-for="t in tiles" :key="t.label" class="fx-tile">
            <span class="fx-tile__label">{{ t.label }}</span>
            <span class="fx-tile__value">
              <Figure :value="t.value" :kind="t.kind" :currency-code="t.kind === 'currency' ? 'INR' : null" />
            </span>
          </div>
        </div>
      </section>

      <!-- Command only. Below Command the endpoint 403s and this section never renders —
           §8.1: the locked nav item is what explains the gap, not an empty grid here. -->
      <section v-if="book.length" class="fx-section">
        <h2 class="fx-section__title">Accounts</h2>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">Risk</th>
              <th class="fx-num" scope="col">Tonnage YTD</th>
              <th class="fx-num" scope="col">Revenue MTD</th>
              <th class="fx-num" scope="col">Win rate</th>
              <th class="fx-num" scope="col">Outstanding 60+</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in book" :key="c.customer_id + '-' + c.transport_mode">
              <td>{{ c.name }}</td>
              <td><StatusChip :value="c.risk_band" /></td>
              <td class="fx-num"><Figure :value="c.tonnage_ytd" kind="weight" /></td>
              <td class="fx-num"><Figure :value="c.revenue_mtd" kind="currency" currency-code="INR" /></td>
              <!-- §7.1 NULL is not 0% — an unmeasurable rate renders as an em dash. -->
              <td class="fx-num"><Figure :value="c.win_rate" kind="count" /></td>
              <td class="fx-num"><Figure :value="c.outstanding_60_plus" kind="currency" currency-code="INR" /></td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>

    <FxDrawer
      :open="!!composing"
      :title="composing ? 'Email to ' + (composing.client || composing.domain) : ''"
      :subtitle="composing ? summary(composing) : null"
      @close="composing = null"
    >
      <template v-if="composing">
        <p v-if="drafting" class="fx-muted" role="status">Writing the draft… {{ draftSeconds }} s</p>
        <template v-else>
          <p class="fx-muted fx-outreach__note">
            {{ writtenBy === "ai" ? "Drafted by AI from the figures above." : "A starting draft from the figures above." }}
            Read it and change anything before you send.
          </p>
          <p v-if="!showsClientNames" class="fx-warn" role="status">Write the client's company name where it says [Company name].</p>

          <label class="fx-field">
            <span class="fx-field__label">To</span>
            <input v-model="form.to" class="fx-input" placeholder="name@client.com, …" />
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
        <button class="fx-btn" :disabled="drafting || sending" @click="draftEmail(composing)">Redraft</button>
        <button class="fx-btn fx-btn--primary" :disabled="drafting || sending || !form.to.trim()" @click="send">
          {{ sending ? "Sending…" : "Send" }}
        </button>
      </template>
    </FxDrawer>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxChart from "@/view/pages/freight/components/FxChart.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";

/** What each suggested email is about, in the rep's words. */
const TYPE_LABELS = {
  client_reactivation: "Stopped shipping",
  client_volume_drop: "Volume down",
  client_volume_growth: "Volume up",
  client_rate_review: "Lost on price",
  client_new_lanes: "New lanes to offer",
};

const list = (text) => String(text || "").split(",").map((s) => s.trim()).filter(Boolean);

export default {
  name: "SalesDashboard",
  components: { Figure, StatusChip, FxChart, FxDrawer, MailEditor },
  data: () => ({
    emails: [], hasMailbox: true, showsClientNames: false, outreachLoaded: false,
    composing: null, form: { to: "", cc: "", subject: "", body: "" },
    drafting: false, draftSeconds: 0, writtenBy: null, sending: false, sendError: null,
    loading: true, error: null,
    scope: null, mode: null, branch: {}, book: [], staleness: null, actions: [],
    charts: null, grain: "month", basis: "fiscal",
  }),
  computed: {
    /* ⚠️ Months with no shipments are ABSENT from the payload, not zero-filled — a gap
       means "no data", a zero means "we moved nothing", and on a tonnage chart those
       read as opposite commercial stories. */
    tonnageSeries() {
      const rows = (this.charts && this.charts.tonnage) || [];
      if (!rows.length) return [];
      return [{ name: "Tonnage (kg)", data: rows.map((r) => r.tonnage) }];
    },
    tonnageOptions() {
      const rows = (this.charts && this.charts.tonnage) || [];
      return {
        chart: { type: "area" },
        stroke: { width: 2, curve: "straight" },
        fill: { opacity: 0.15 },
        /* Categories rather than a datetime axis: the series is already bucketed by
           month server-side, and a datetime axis would interpolate the gaps that mean
           "no data" into a line implying zero. */
        xaxis: { categories: rows.map((r) => String(r.period).slice(0, 7)) },
        yaxis: { decimalsInFloat: 0 },
      };
    },

    /* Ranked by TONNAGE, not shipment count: ten courier-sized shipments on one lane
       are not the commercial exposure of one full container on another. */
    laneSeries() {
      const rows = (this.charts && this.charts.lanes) || [];
      if (!rows.length) return [];
      return [{ name: "Tonnage (kg)", data: rows.map((r) => r.tonnage) }];
    },
    laneOptions() {
      const rows = (this.charts && this.charts.lanes) || [];
      return {
        chart: { type: "bar" },
        /* Horizontal, because "INBOM → DEHAM" rotates to unreadability on a vertical
           axis. */
        plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
        xaxis: { categories: rows.map((r) => r.lane) },
      };
    },

    funnelSeries() {
      const t = (this.charts && this.charts.funnel && this.charts.funnel.totals) || {};
      const values = [t.converted || 0, t.lost || 0, t.pending || 0];
      /* An all-zero donut renders as an empty ring that looks broken. Report nothing
         and let FxChart say so in words instead. */
      return values.some((v) => v > 0) ? values : [];
    },
    funnelOptions() {
      const token = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n) || "").trim() || f;
      return {
        chart: { type: "donut" },
        labels: ["Converted", "Lost", "Still open"],
        colors: [token("--status-success", "#1F7A48"), token("--status-critical", "#C4342B"),
                 token("--status-neutral", "#5A6472")],
        legend: { position: "bottom" },
      };
    },

    modeLabel() {
      return this.mode ? this.mode + " only" : "all modes";
    },
    tiles() {
      const b = this.branch || {};
      const tiles = [
        { label: "Tonnage MTD", value: b.tonnage_mtd, kind: "weight" },
        { label: "Tonnage YTD", value: b.tonnage_ytd, kind: "weight" },
        { label: "Shipments MTD", value: b.shipment_count_mtd, kind: "count" },
        { label: "Enquiries MTD", value: b.enquiry_count_mtd, kind: "count" },
      ];

      /* 🔴 The revenue tile appears only when the SERVER sent revenue. Below Command it
         omits the key entirely (§7.4 — money is the upsell), so the tile is driven by
         what arrived rather than by a tier check repeated here. One rule, one place. */
      if ("revenue_mtd" in b) {
        tiles.push({ label: "Revenue MTD", value: b.revenue_mtd, kind: "currency" });
      }

      return tiles;
    },
  },
  created() {
    this.loadCharts();
    this.loadOutreach();
    Promise.all([
      ApiService.get("/sales/dashboard"),
      // The actions call is allowed to fail without taking the page down — a ranked
      // worklist is valuable, but it is not the reason the page exists.
      ApiService.get("/sales/actions").catch(() => ({ data: { actions: [] } })),
    ])
      .then(([dash, act]) => {
        this.scope = dash.data.scope;
        this.mode = dash.data.mode;
        this.branch = dash.data.branch || {};
        this.book = dash.data.book || [];
        this.staleness = dash.data.staleness;
        this.actions = act.data.actions || [];
      })
      .catch((e) => {
        const d = (e.response && e.response.data) || {};
        this.error = d.error || d.message || "Something went wrong.";
      })
      .finally(() => { this.loading = false; });
  },
  methods: {
    loadOutreach() {
      ApiService.get("/sales/outreach")
        .then(({ data }) => {
          this.emails = data.emails || [];
          this.hasMailbox = data.has_mailbox;
          this.showsClientNames = data.shows_client_names;
        })
        // Suggestions failing must not take the dashboard down with them.
        .catch(() => { this.emails = []; })
        .finally(() => { this.outreachLoaded = true; });
    },
    typeLabel(type) {
      return TYPE_LABELS[type] || type;
    },
    /** Why this email is suggested, from the finding's own figures. */
    summary(e) {
      const f = e.facts || {};
      const lanes = (xs) => (xs || []).join(", ");

      switch (e.type) {
        case "client_reactivation":
          return `Usually ships every ${f.usually_ships_every_days} days — ${f.days_since_last_shipment} days since the last shipment.`;
        case "client_volume_drop":
          return `Volume ${Math.abs(f.volume_change_percent)}% below their yearly average over the last 13 weeks.`;
        case "client_volume_growth":
          return `Volume up ${f.volume_change_percent}% on their yearly average over the last 13 weeks.`;
        case "client_rate_review":
          return `${f.quotes_lost_on_price_last_year} quotes on ${f.lane} lost on price in the last year.`;
        case "client_new_lanes":
          return `Ships ${lanes(f.usual_lanes)} with us; we also run ${lanes(f.lanes_we_run)}.`;
        default:
          return "";
      }
    },
    openEmail(e) {
      this.composing = e;
      this.sendError = null;

      if (e.subject) {
        this.fill(e);
      } else {
        this.draftEmail(e);
      }
    },
    fill(e) {
      this.form = { to: e.to.join(", "), cc: e.cc.join(", "), subject: e.subject || "", body: e.body || "" };
    },
    draftEmail(e) {
      this.drafting = true;
      this.draftSeconds = 0;
      this.sendError = null;
      const ticker = setInterval(() => { this.draftSeconds += 1; }, 1000);

      ApiService.post(`/sales/outreach/${e.id}/draft`, {})
        .then(({ data }) => {
          Object.assign(e, data);
          this.writtenBy = data.written_by;
          if (this.composing === e) this.fill(e);
        })
        .catch((err) => { this.sendError = this.readable(err, "Could not write the draft. Try again."); })
        .finally(() => { clearInterval(ticker); this.drafting = false; });
    },
    send() {
      const e = this.composing;
      this.sending = true;
      this.sendError = null;

      ApiService.post(`/sales/outreach/${e.id}/send`, {
        to: list(this.form.to), cc: list(this.form.cc), subject: this.form.subject, body: this.form.body,
      })
        .then(() => {
          this.emails = this.emails.filter((x) => x.id !== e.id);
          this.composing = null;
        })
        .catch((err) => { this.sendError = this.readable(err, "Not sent. Try again."); })
        .finally(() => { this.sending = false; });
    },
    dismiss(e) {
      ApiService.post(`/sales/outreach/${e.id}/dismiss`, {})
        .then(() => { this.emails = this.emails.filter((x) => x.id !== e.id); })
        .catch(() => {});
    },
    readable(err, fallback) {
      const d = (err.response && err.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat()[0];
      return d.error || d.message || fallback;
    },
    loadCharts() {
      let url = "/sales/charts?grain=" + this.grain;
      if (this.grain === "year") url += "&basis=" + this.basis;

      ApiService.get(url)
        .then(({ data }) => { this.charts = data; })
        /* Charts failing must not take the worklist down with it: Today's Actions is
           the part a rep acts on, and it comes from a different call. */
        .catch(() => { this.charts = null; });
    },
  },
};
</script>
