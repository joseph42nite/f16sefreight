<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Kanban</h1>
      <p class="fx-page-sub">
        Confirmed shipments on <strong>{{ portalLabel || "all modes" }}</strong>.
        <template v-if="designation === 'sales'">Every shipment in the branch, to follow — not to move.</template>
      </p>
    </header>

    <!-- ── View switch. Staff View is ABSENT for operations, not disabled (§9.4). ── -->
    <div class="fx-toolbar">
      <div class="fx-segment" role="tablist" aria-label="Board view">
        <button
          class="fx-segment__btn" :class="{ 'is-active': view === 'process' }"
          role="tab" :aria-selected="String(view === 'process')" @click="view = 'process'"
        >Process</button>
        <button
          v-if="canBalance"
          class="fx-segment__btn" :class="{ 'is-active': view === 'staff' }"
          role="tab" :aria-selected="String(view === 'staff')" @click="switchToStaff"
        >Staff</button>
      </div>

      <!-- 🔒 The operator selector is GONE, not hidden. The board now shows the signed-in
           person's own shipments and the server enforces it, so a picker offering
           "Everyone" or a colleague's name would list choices that return the same rows —
           a control that appears to do something and does not is worse than none. The
           unassigned pool below stays shared: unclaimed work belongs to whoever takes it. -->
      <label class="fx-field">
        <span class="fx-field__label">Stage</span>
        <select v-model="filters.stage" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>

    </div>

    <!-- Active filters as removable chips — a filter you cannot see is a filter you
         forget you set, and then the board looks wrong rather than filtered. -->
    <div v-if="activeChips.length" class="fx-chips">
      <button v-for="c in activeChips" :key="c.key" class="fx-chip fx-chip--info fx-chip--removable" @click="clearFilter(c.key)">
        {{ c.label }} ✕
      </button>
      <button class="fx-btn fx-btn--ghost" @click="clearAll">Clear all</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!-- ── The Unassigned Pool (PRD §5.5) ──────────────────────────────── -->
      <section class="fx-pool" :class="{ 'is-collapsed': poolCollapsed }">
        <header class="fx-pool__head">
          <button class="fx-btn fx-btn--ghost" @click="togglePool">
            {{ poolCollapsed ? "[+]" : "[−]" }}
          </button>
          <h2 class="fx-pool__title">Unassigned pool</h2>
          <span class="fx-board__count">{{ pool.length }}</span>
        </header>

        <!--
          🔴 THE POOL HOLDS ENQUIRIES, NOT JOBS. New mail the regex filed as a client
          enquiry that nobody has taken over. It is still in the enquiry phase — there is
          no job and no job number yet, because confirming the shipment is what mints one.
          Claiming here is the same act as claiming in the inbox, and writes the same
          column, so the two views cannot disagree.
        -->
        <div v-if="!poolCollapsed" class="fx-pool__scroller">
          <p v-if="!pool.length" class="fx-muted">Nothing waiting. Every enquiry has an owner.</p>
          <!--
            Who it is from (the domain on Tactical, the client's name on Command — the server decides), when the mail
            came and how long it has waited (user, 2026-09-16). No enquiry number or status: nobody has taken it yet.
          -->
          <article v-for="enq in pool" :key="enq.id" class="fx-card fx-card--pool">
            <div class="fx-card__client">{{ enq.client_label || "Unknown sender" }}</div>
            <div class="fx-card__meta">
              <Figure :value="enq.received_at" kind="dateTime" />
              · <span :title="'Waiting since ' + enq.received_at">{{ waited(enq.received_at) }}</span>
            </div>
            <!-- Sales follow the board; taking work on is for pricing and operations. -->
            <div v-if="designation !== 'sales'" class="fx-card__actions">
              <button class="fx-btn fx-btn--primary" :disabled="busy || !enq.thread_id" @click="accept(enq)">Accept</button>
              <!-- Decline passes on it: it leaves your pool and stays in your colleagues'. -->
              <button class="fx-btn" :disabled="busy" @click="decline(enq)">Decline</button>
            </div>
          </article>
        </div>
      </section>

      <!-- A client mail shown before it goes: accepting a pool enquiry, or a completed shipment's "Delivered" update. -->
      <div v-if="mail" class="fx-modal" role="dialog" aria-modal="true" :aria-label="mail.title">
        <div class="fx-modal__panel">
          <header class="fx-modal__head"><h2 class="fx-modal__title">{{ mail.title }}</h2></header>
          <div class="fx-modal__body">
            <ClientUpdateEditor
              :draft="mail.draft"
              :busy="busy"
              :error="mail.error"
              :send-label="mail.sendLabel"
              :skip-label="mail.skipLabel"
              @send="mail.send($event)"
              @skip="mail.skip()"
            >
              <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="mail = null">Cancel</button>
            </ClientUpdateEditor>
          </div>
        </div>
      </div>

      <!-- ── Perspective A — Process View, 4 columns exactly (PRD §5.5) ──── -->
      <div v-if="view === 'process'" class="fx-board">
        <section v-for="col in PROCESS" :key="col.key" class="fx-board__col fx-board__col--wide">
          <h2 class="fx-board__head">
            {{ col.label }}
            <span class="fx-board__count">{{ columns[col.key].total }}</span>
          </h2>

          <!-- The card icons and the AWB number are links, not drag handles: `filter` keeps Sortable from taking their click. -->
          <!-- ⚠️ Bound to the column's own loaded list, the SAME array the v-for renders, so a drop lands
               at the right index. -->
          <draggable
            :list="columns[col.key].rows"
            :group="{ name: 'jobs', pull: !col.terminal, put: !col.terminal }"
            class="fx-board__drop"
            ghost-class="fx-card--ghost"
            filter=".fx-card__link, .fx-card__awb"
            :prevent-on-filter="false"
            :disabled="!canMove"
            @change="(e) => onMove(e, col)"
          >
            <article
              v-for="job in columns[col.key].rows"
              :key="job.id"
              class="fx-card"
              :class="'fx-card--' + urgency(job)"
            >
              <div class="fx-card__top">
                <!--
                  🔴 ONE identifier, and it is the AWB. Every card in these four columns
                  is a confirmed shipment, and the AWB is the number that is actually
                  used — quoted to the airline, printed on the manifest, given to the
                  client. Stacking the job and enquiry numbers beside it made the card a
                  list of references to look past rather than a shipment to read.

                  ⚠️ The job number remains the fallback, not decoration: a shipment can
                  be confirmed before its waybill is raised, and a card with no
                  identifier at all is one nobody can act on or talk about.
                -->
                <!-- PRD §5.5: the AWB number opens the cargo tracking drawer. -->
                <button
                  v-if="job.awb_number && job.transport_mode === 'air'"
                  type="button"
                  class="identifier fx-card__no fx-card__awb"
                  :title="'Track ' + job.awb_number"
                  @click="openTracking(job)"
                >{{ job.awb_number }}</button>
                <span v-else class="identifier fx-card__no">
                  {{ job.awb_number || job.execution_job_no || "—" }}
                </span>
                <!-- The stage badge: the fine status the four columns group over. -->
                <StatusChip :value="job.status" />
              </div>


              <!-- Cargo tags, from the enquiry's regex-extracted figures. -->
              <div v-if="job.enquiry" class="fx-card__tags">
                <span v-if="job.enquiry.extracted_pieces">📦 {{ job.enquiry.extracted_pieces }} pcs</span>
                <span v-if="job.enquiry.extracted_weight">
                  ⚖ <Figure :value="job.enquiry.extracted_weight" kind="weight" />
                </span>
                <span v-if="job.enquiry.origin_code" class="identifier">
                  {{ job.enquiry.origin_code }} → {{ job.enquiry.dest_code }}
                </span>
              </div>

              <div class="fx-card__meta">
                <span v-if="job.planned_clearance_date">
                  clears <Figure :value="job.planned_clearance_date" kind="date" />
                </span>
                <span v-else class="is-empty" aria-label="No clearance date"></span>
              </div>

              <!--
                In Transit: where the shipment is, from the airline's Cargo Status messages for this AWB —
                the same rows the Message Log shows (user, 2026-09-15).
              -->
              <div v-if="col.key === 'transit' && job.transport_mode === 'air'" class="fx-track">
                <div
                  class="fx-track__bar"
                  role="progressbar"
                  :aria-valuenow="progress(job).step"
                  aria-valuemin="0"
                  :aria-valuemax="progress(job).total"
                  :aria-label="'Shipment progress: ' + progress(job).label"
                >
                  <span
                    v-for="n in progress(job).total"
                    :key="n"
                    class="fx-track__step"
                    :class="{ 'is-done': n <= progress(job).step }"
                  ></span>
                </div>
                <div class="fx-track__label">
                  <span>{{ progress(job).label }}<template v-if="progress(job).code"> · {{ progress(job).code }}</template></span>
                  <span v-if="progress(job).step">{{ progress(job).step }} of {{ progress(job).total }}</span>
                </div>
                <div v-if="progress(job).discrepancy" class="fx-track__warn">⚠ The airline reported a discrepancy</div>
              </div>

              <!-- BOTH names — §5.5: "so collaborators share context". The links sit bottom right. -->
              <div class="fx-card__foot">
                <div class="fx-card__owners">
                  <span>ops {{ job.ops_user ? job.ops_user.name : "—" }}</span>
                  <span>pricing {{ job.pricing_owner ? job.pricing_owner.name : "—" }}</span>
                </div>
                <div class="fx-card__links">
                  <router-link
                    v-if="col.key === 'transit' && job.awb_number"
                    :to="{ path: '/message-log', query: { awb: job.awb_number } }"
                    class="fx-card__link"
                    :title="'Message log for ' + job.awb_number"
                    :aria-label="'Open the message log for ' + job.awb_number"
                  >⌸</router-link>
                  <!-- Completed: the mail opens the waiting "Delivered" update to send or skip, here on the board. -->
                  <button
                    v-if="job.thread_id && col.key === 'done' && designation !== 'sales'"
                    type="button"
                    class="fx-card__link"
                    title="Send the delivered mail"
                    aria-label="Send the delivered mail for this shipment"
                    @click="openDeliveredMail(job, col)"
                  >✉</button>
                  <router-link
                    v-else-if="job.thread_id"
                    :to="{ path: '/inbox', query: { thread: job.thread_id } }"
                    class="fx-card__link"
                    title="Go to the mail"
                    aria-label="Go to the mail for this shipment"
                  >✉</router-link>
                </div>
              </div>
            </article>
          </draggable>

          <!-- 50 cards a column, the next 50 on request (user, 2026-09-15): the header count is the true total. -->
          <button
            v-if="columns[col.key].rows.length < columns[col.key].total"
            class="fx-board__more"
            :disabled="columns[col.key].loading"
            @click="loadColumn(col, columns[col.key].page + 1)"
          >
            {{ columns[col.key].loading ? "Loading…" : "Load " + Math.min(PAGE_SIZE, columns[col.key].total - columns[col.key].rows.length) + " more" }}
          </button>

          <p v-if="col.terminal" class="fx-board__note">Set from the job, not by dragging</p>
        </section>
      </div>

      <!-- ── Perspective B — the cross-staff clearance matrix ─────────────── -->
      <!--
        ⚠️ Two different scopes on purpose, since the board became owner-scoped. The OLI
        badges come from /jobs/staff-load and are the operator's TRUE branch-wide load —
        that is what makes them safe to balance against. The cells below are the caller's
        OWN jobs, so the columns will not add up to the badges. That asymmetry is the
        useful one: "how loaded is this person really, and how much of it is mine".
      -->
      <div v-else class="fx-matrix-wrap">
        <table class="fx-table fx-matrix">
          <thead>
            <tr>
              <th scope="col">Clears</th>
              <th v-for="o in staff" :key="o.id" scope="col">
                {{ o.name }}
                <!--
                  §9.3 OLI badge: at or over the cap it is critical AND says OVERLOADED.
                  §1.3 never colour alone — the word carries the meaning.
                -->
                <span class="fx-oli" :class="{ 'is-over': o.overloaded }">
                  OLI {{ Number(o.oli).toFixed(1) }}
                  <template v-if="o.overloaded"> ● OVERLOADED</template>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in matrixDays" :key="day">
              <th scope="row"><Figure :value="day" kind="date" /></th>
              <td v-for="o in staff" :key="o.id">
                <span v-for="job in matrixCell(day, o.id)" :key="job.id" class="fx-matrix__job identifier">
                  {{ job.execution_job_no || job.id }}
                </span>
                <span v-if="!matrixCell(day, o.id).length" class="is-empty" aria-label="Nothing scheduled"></span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="fx-muted fx-board__note">
          The cap warns; it never blocks. A manager may have context the index lacks.
        </p>
      </div>
    </template>

    <!--
      📍 Cargo tracking drawer (PRD §5.5): the seven steps, filled from the airline's Cargo Status messages
      for the AWB — the rows the Message Log shows. Checked again every 30 s while it is open.
    -->
    <FxDrawer
      :open="!!tracking"
      :title="tracking ? 'Tracking · ' + tracking.job.awb_number : ''"
      :subtitle="tracking ? trackingLane : null"
      @close="closeTracking"
    >
      <template v-if="tracking">
        <p v-if="tracking.error" class="fx-error" role="alert">{{ tracking.error }}</p>
        <p v-else-if="tracking.loading" class="fx-muted">Loading…</p>
        <template v-else>
          <ol class="fx-feed">
            <li
              v-for="m in trackingFeed"
              :key="m.key"
              class="fx-feed__step"
              :class="{ 'is-done': m.reached }"
            >
              <span class="fx-feed__dot" aria-hidden="true"></span>
              <span class="fx-feed__label">{{ m.label }}</span>
              <span class="fx-feed__when">
                <template v-if="m.at">{{ when(m.at) }} · {{ m.code }}</template>
                <template v-else-if="m.reached">reached</template>
                <template v-else>—</template>
              </span>
            </li>
          </ol>

          <p v-if="trackingDiscrepancy" class="fx-warn" role="status">⚠ The airline reported a discrepancy on this shipment.</p>

          <h3 class="fx-feed__h">From the airline</h3>
          <p v-if="!tracking.statuses.length" class="fx-muted">No status from the airline yet for this AWB.</p>
          <ul v-else class="fx-feed__log">
            <li v-for="(s, i) in tracking.statuses" :key="i">
              <span class="identifier">{{ s.code }}</span>
              <span>{{ s.description || "—" }}</span>
              <span class="fx-muted">{{ s.at ? when(s.at) : "" }}</span>
            </li>
          </ul>
        </template>
      </template>

      <template #footer>
        <router-link
          v-if="tracking"
          :to="{ path: '/message-log', query: { awb: tracking.job.awb_number } }"
          class="fx-btn"
        >Open the message log</router-link>
      </template>
    </FxDrawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import ApiService from "@/core/services/api.service";
import { cargoProgress, milestoneFeed } from "@/core/config/cargoMilestones";
import Figure from "@/view/pages/freight/components/Figure.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import ClientUpdateEditor from "@/view/pages/freight/components/ClientUpdateEditor.vue";

/* Mirrors App\Enums\JobStatus. 'Lost' is deliberately absent — it is an enquiry state,
   never a job one, and the database CHECK refuses it here. */
const STATUSES = [
  "Intake", "AI Extraction", "Verification", "Generation",
  "PDF Generated", "Sent to Airline", "Airline Confirmed", "Completed", "Cancelled",
];

/**
 * PRD §5.5: "Process View (4 columns, exactly)" —
 * Processing → Awaiting Customer → In Transit → Completed.
 *
 * ❓ The PRD names the four columns and names the nine statuses, but never maps one to
 * the other. The grouping below is INFERRED and flagged in GAPS.md #31. The genuinely
 * ambiguous member is `PDF Generated`: a generated draft is what a customer approves,
 * so it sits in Awaiting Customer — but it could equally be the tail of Processing.
 *
 * `entry` is the status a DROP sets. A column is a group, so dropping into it has to
 * choose one, and the first stage of the group is the only defensible choice: it means
 * "this shipment has reached this phase", not "it has finished it".
 */
const PROCESS = [
  { key: "processing", label: "Processing", entry: "Intake",
    statuses: ["Intake", "AI Extraction", "Verification", "Generation"] },
  { key: "awaiting", label: "Awaiting Customer", entry: "PDF Generated",
    statuses: ["PDF Generated"] },
  { key: "transit", label: "In Transit", entry: "Sent to Airline",
    statuses: ["Sent to Airline", "Airline Confirmed"] },
  // Only shipments whose "Delivered" mail still waits to be sent or skipped (user, 2026-09-16).
  { key: "done", label: "Completed", entry: "Completed", terminal: true,
    statuses: ["Completed", "Cancelled"], params: "&delivered_mail_waiting=1" },
];

/**
 * Cards each column loads at a time, matching the server's page (user, 2026-09-15: never load a whole branch
 * at once). Completed grows forever, so it matters most there; the header always shows the true total.
 */
const PAGE_SIZE = 50;

const emptyColumns = () => Object.fromEntries(PROCESS.map((c) => [c.key, { rows: [], page: 0, total: 0, loading: false }]));

const POOL_KEY = "f16s_kanban_pool_collapsed";
const FILTER_KEY = "f16s_kanban_filters";

export default {
  name: "JobBoard",
  components: { draggable, Figure, FxDrawer, StatusChip, ClientUpdateEditor },
  data: () => ({
    /* The client mail shown in the pop-up: { title, draft, sendLabel, skipLabel, send(values), skip(), error }. */
    mail: null,
    columns: emptyColumns(), pool: [], staff: [], operators: [],
    view: "process", loading: true, busy: false, error: null,
    poolCollapsed: false,
    filters: { stage: "" },
    /** The open tracking drawer: { job, statuses, loading, error, timer } or null. */
    tracking: null,
    STATUSES, PROCESS, PAGE_SIZE,
  }),
  computed: {
    ...mapGetters(["portalLabel", "can", "designation"]),
    canMove() {
      return this.can(["pricing", "operations"], "tactical");
    },
    /* §9.4 — the cross-staff matrix is ABSENT for operations, not disabled. */
    canBalance() {
      return this.designation === "pricing" || this.designation === "boss";
    },
    /** Every card loaded so far, across the columns — the Staff matrix reads these. */
    rows() {
      return PROCESS.flatMap((c) => this.columns[c.key].rows);
    },
    trackingFeed() {
      return this.tracking ? milestoneFeed(this.tracking.statuses) : [];
    },
    trackingDiscrepancy() {
      return !!this.tracking && this.tracking.statuses.some((s) => s.code === "DIS");
    },
    trackingLane() {
      const e = this.tracking.job.enquiry;
      return e && e.origin_code ? e.origin_code + " → " + e.dest_code : null;
    },
    activeChips() {
      const chips = [];
      if (this.filters.stage) chips.push({ key: "stage", label: "Stage: " + this.filters.stage });
      return chips;
    },
    /* Rows of the matrix: every distinct clearance date in the current result set. */
    matrixDays() {
      const days = {};
      this.rows.forEach((j) => { if (j.planned_clearance_date) days[j.planned_clearance_date.slice(0, 10)] = true; });
      return Object.keys(days).sort();
    },
  },
  created() {
    this.restore();
    this.load();
  },
  beforeDestroy() {
    this.closeTracking();
  },
  methods: {
    /* Persisted per user, per §9.3 — a board that forgets its filters on every visit
       gets its filters set once and then abandoned. */
    restore() {
      try {
        this.poolCollapsed = localStorage.getItem(POOL_KEY) === "1";
        const saved = JSON.parse(localStorage.getItem(FILTER_KEY));
        if (saved) this.filters = Object.assign(this.filters, saved);
      } catch (e) { /* a corrupt preference must not stop the board rendering */ }
    },
    persist() {
      try {
        localStorage.setItem(POOL_KEY, this.poolCollapsed ? "1" : "0");
        localStorage.setItem(FILTER_KEY, JSON.stringify(this.filters));
      } catch (e) { /* private mode — the board still works, it just forgets */ }
    },
    togglePool() {
      this.poolCollapsed = !this.poolCollapsed;
      this.persist();
    },
    clearFilter(key) {
      this.filters[key] = "";
      this.load();
    },
    clearAll() {
      this.filters = { stage: "" };
      this.load();
    },
    load() {
      this.loading = true;
      this.persist();

      /* The pool is a SEPARATE query on purpose: it must not disappear because a stage filter excluded it.
         An operator filters to find work, and the pool is where unclaimed work lives — as ENQUIRIES, before
         any job exists. ⚠️ And a pool that fails to load must not take the board down with it. */
      const pool = ApiService.get("/enquiries?unclaimed=1")
        .then(({ data }) => { this.pool = data.data || []; })
        .catch(() => { this.pool = []; });

      this.columns = emptyColumns();
      this.error = null;

      Promise.all([pool, ...PROCESS.map((c) => this.loadColumn(c, 1))]).finally(() => { this.loading = false; });
    },
    /**
     * One column's page of cards, appended to what it already shows. With a stage filter only the column
     * holding that stage loads anything.
     */
    loadColumn(col, page) {
      const stage = this.filters.stage;
      if (stage && col.statuses.indexOf(stage) === -1) return Promise.resolve();

      const column = this.columns[col.key];
      column.loading = true;

      return ApiService.get(`/jobs?page=${page}&statuses=` + encodeURIComponent((stage ? [stage] : col.statuses).join(",")) + (col.params || ""))
        .then(({ data }) => {
          column.rows.push(...(data.data || []).filter((j) => !column.rows.some((r) => r.id === j.id)));
          column.page = data.current_page || page;
          column.total = data.total || column.rows.length;
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { column.loading = false; });
    },
    switchToStaff() {
      this.view = "staff";
      if (this.staff.length) return;

      ApiService.get("/jobs/staff-load")
        .then(({ data }) => {
          this.staff = data.operators || [];
          this.operators = this.staff.map((o) => ({ id: o.id, name: o.name }));
        })
        .catch((e) => { this.error = this.readable(e); });
    },
    openTracking(job) {
      this.closeTracking();
      this.tracking = { job, statuses: [], loading: true, error: null, timer: null };
      this.loadTracking();
      this.tracking.timer = setInterval(this.loadTracking, 30000);
    },
    loadTracking() {
      const t = this.tracking;
      if (!t) return;

      ApiService.get(`/jobs/${t.job.id}/tracking`)
        .then(({ data }) => {
          if (this.tracking !== t) return;
          t.statuses = data.statuses || [];
          t.error = null;
        })
        .catch((e) => { if (this.tracking === t) t.error = this.readable(e); })
        .finally(() => { t.loading = false; });
    },
    closeTracking() {
      if (this.tracking) clearInterval(this.tracking.timer);
      this.tracking = null;
    },
    when(at) {
      const d = new Date(at);
      return isNaN(d) ? at : d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    },
    progress(job) {
      return cargoProgress(job.cargo_statuses);
    },
    matrixCell(day, opsId) {
      return this.rows.filter(
        (j) => j.ops_id === opsId && (j.planned_clearance_date || "").slice(0, 10) === day
      );
    },
    /* SLA colouring, from the same urgency bands the OLI multiplier uses — one rule,
       so the board and the load index cannot disagree about what "urgent" means. */
    urgency(job) {
      // Already with the airline: the deadline is met, so not urgent — the same list OperatorLoadService uses.
      if (["Sent to Airline", "Airline Confirmed"].includes(job.status)) return "later";
      if (!job.planned_clearance_date) return "later";
      const d = new Date(job.planned_clearance_date);
      d.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const days = Math.round((d - today) / 86400000);
      if (days <= 0) return "today";
      if (days === 1) return "tomorrow";
      return "later";
    },
    /**
     * Take an unclaimed enquiry.
     *
     * 🔴 Claims the THREAD, which is the single place the claim is recorded — the inbox
     * writes the same column from its own button. Two endpoints writing two columns for
     * "who owns this" is how they end up disagreeing.
     */
    /** Accept: show the acknowledgement mail first; with nothing to send, take it straight away. */
    accept(enq) {
      this.busy = true;
      ApiService.query(`/inbox/threads/${enq.thread_id}/client-update/preview`, { params: { stage: "claimed" } })
        .then(({ data }) => {
          this.busy = false;
          if (data.draft) {
            this.mail = {
              title: "Accept and tell the client", draft: data.draft, error: null,
              sendLabel: "Accept & send", skipLabel: "Accept without email",
              send: (values) => this.claim(enq, { decision: "send", ...values }),
              skip: () => this.claim(enq, { decision: "skip" }),
            };
          } else {
            this.claim(enq, null);
          }
        })
        .catch(() => { this.busy = false; this.claim(enq, null); });
    },
    /** Decline: pass on it — gone from this person's pool, still in their colleagues'. */
    decline(enq) {
      this.busy = true;
      ApiService.post(`/enquiries/${enq.id}/pass`, {})
        .then(() => { this.pool = this.pool.filter((p) => p.id !== enq.id); })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    /**
     * A completed shipment's "Delivered" mail: shown to send as written, edit, or skip. Either way the card leaves the
     * Completed column. With no mail waiting, the conversation opens instead.
     */
    openDeliveredMail(job, col) {
      this.busy = true;
      ApiService.get(`/inbox/threads/${job.thread_id}`)
        .then(({ data }) => {
          const update = data.thread && data.thread.client_update;
          if (!update) {
            this.$router.push({ path: "/inbox", query: { thread: job.thread_id } }).catch(() => {});
            return;
          }
          const decide = (decision, values) => {
            this.busy = true;
            ApiService.post(`/inbox/threads/${job.thread_id}/client-update`, { stage: update.stage, decision, ...(values || {}) })
              .then(() => {
                this.mail = null;
                const column = this.columns[col.key];
                column.rows = column.rows.filter((r) => r.id !== job.id);
                column.total -= 1;
              })
              .catch((e) => { this.mail.error = this.readable(e); })
              .finally(() => { this.busy = false; });
          };
          this.mail = {
            title: update.title, draft: update, error: null, sendLabel: "Send to client", skipLabel: "Skip",
            send: (values) => decide("send", values), skip: () => decide("skip"),
          };
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    /** How long an enquiry has waited: "25 min", "3 h", "2 d". */
    waited(at) {
      const minutes = Math.max(0, Math.floor((Date.now() - new Date(String(at).replace(" ", "T")).getTime()) / 60000));
      if (minutes < 60) return minutes + " min";
      if (minutes < 60 * 24) return Math.floor(minutes / 60) + " h";
      return Math.floor(minutes / (60 * 24)) + " d";
    },
    claim(enq, update) {
      this.busy = true;
      ApiService.post(`/inbox/threads/${enq.thread_id}/claim`, update ? { client_update: update } : {})
        .then(() => { this.mail = null; return this.load(); })
        /* 409 is a real outcome, not a failure: someone got there first. */
        .catch((e) => { this.mail = null; this.error = this.readable(e); this.load(); })
        .finally(() => { this.busy = false; });
    },
    /**
     * A card landed in a new column.
     *
     * The server is the authority: on any failure the board reloads rather than
     * reversing the move locally. An optimistic UI that guesses wrong leaves the
     * operator looking at a status the shipment does not have.
     */
    onMove(event, column) {
      // Keep the header totals true as a card leaves one column and joins another.
      if (event.removed) this.columns[column.key].total -= 1;
      if (!event.added) return;
      this.columns[column.key].total += 1;

      const job = event.added.element;
      const previous = job.status;

      ApiService.put(`/jobs/${job.id}/status`, { status: column.entry })
        .then(({ data }) => { job.status = data.status; this.error = null; })
        .catch((e) => {
          job.status = previous;
          this.error = this.readable(e);
          this.load();
        });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
