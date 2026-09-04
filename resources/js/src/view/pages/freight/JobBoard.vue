<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Kanban</h1>
      <p class="fx-page-sub">
        Confirmed shipments on <strong>{{ portalLabel || "all modes" }}</strong>.
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

      <label class="fx-field">
        <span class="fx-field__label">Clears from</span>
        <input v-model="filters.from" class="fx-input" type="date" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">to</span>
        <input v-model="filters.to" class="fx-input" type="date" @change="load" />
      </label>

      <button class="fx-btn" @click="today">Today</button>
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
          <article v-for="enq in pool" :key="enq.id" class="fx-card fx-card--pool">
            <div class="identifier fx-card__no">{{ enq.enquiry_no || "—" }}</div>
            <StatusChip :value="enq.status" />
            <div v-if="enq.client_label" class="fx-card__meta">{{ enq.client_label }}</div>
            <button class="fx-btn" :disabled="busy || !enq.thread_id" @click="claim(enq)">
              Take this enquiry
            </button>
          </article>
        </div>
      </section>

      <!-- ── Perspective A — Process View, 4 columns exactly (PRD §5.5) ──── -->
      <div v-if="view === 'process'" class="fx-board">
        <section v-for="col in PROCESS" :key="col.key" class="fx-board__col fx-board__col--wide">
          <h2 class="fx-board__head">
            {{ col.label }}
            <span class="fx-board__count">{{ (grouped[col.key] || []).length }}</span>
          </h2>

          <!-- ⚠️ Bound to `visible`, the SAME array the v-for renders. Binding the full
               list while rendering a subset would put a drop at the wrong index the
               moment anything was hidden. For every uncapped column the two are the same
               array reference, so nothing about dragging changes. -->
          <draggable
            :list="visible[col.key] || []"
            :group="{ name: 'jobs', pull: !col.terminal, put: !col.terminal }"
            class="fx-board__drop"
            ghost-class="fx-card--ghost"
            :disabled="!canMove"
            @change="(e) => onMove(e, col)"
          >
            <article
              v-for="job in visible[col.key] || []"
              :key="job.id"
              class="fx-card"
              :class="'fx-card--' + urgency(job)"
            >
              <div class="fx-card__top">
                <span class="identifier fx-card__no">{{ job.execution_job_no || "—" }}</span>
                <!-- The stage badge: the fine status the four columns group over. -->
                <StatusChip :value="job.status" />
              </div>

              <!--
                THE IDENTIFIER LADDER, in the order a shipment earns the rungs: the
                enquiry number when the client first wrote in, the job number when the
                shipment was confirmed, the AWB once the waybill is raised. Showing all
                three is what makes them one shipment rather than three systems — and the
                enquiry number is the one an operator quotes back to a client who has not
                heard a job number yet.
              -->
              <div class="fx-card__ladder">
                <span v-if="job.enquiry && job.enquiry.enquiry_no" class="identifier fx-card__meta">
                  {{ job.enquiry.enquiry_no }}
                </span>
                <span v-if="job.awb_number" class="identifier fx-card__meta">{{ job.awb_number }}</span>
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

              <!-- BOTH names — §5.5: "so collaborators share context". -->
              <div class="fx-card__owners">
                <span>ops {{ job.ops_user ? job.ops_user.name : "—" }}</span>
                <span>pricing {{ job.pricing_owner ? job.pricing_owner.name : "—" }}</span>
              </div>
            </article>
          </draggable>

          <!-- The finished pile is capped, not pruned: the header count above is the true
               total, and this is the way back to the rest of it. -->
          <button
            v-if="col.terminal && doneHidden"
            class="fx-board__more"
            @click="showAllDone = !showAllDone"
          >
            {{ showAllDone ? "Show fewer" : doneHidden + " older completed — show all" }}
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

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
  { key: "done", label: "Completed", entry: "Completed", terminal: true,
    statuses: ["Completed", "Cancelled"] },
];

/**
 * How many finished shipments the Completed column keeps on screen.
 *
 * 🔴 A DISPLAY cap, never a delete. Terminal cards accumulate forever — every shipment a
 * branch has ever run ends up in one column — and a board that grows without bound stops
 * being a board. But a completed job is still the record of a shipment that happened, so
 * the older ones are hidden behind a disclosure, not dropped: the count in the header
 * always states the true total, and one click brings the rest back.
 */
const DONE_VISIBLE = 12;

const POOL_KEY = "f16s_kanban_pool_collapsed";
const FILTER_KEY = "f16s_kanban_filters";

export default {
  name: "JobBoard",
  components: { draggable, Figure, StatusChip },
  data: () => ({
    rows: [], pool: [], staff: [], operators: [],
    view: "process", loading: true, busy: false, error: null,
    poolCollapsed: false,
    /* Per-viewer, per-session: an operator who expands the finished pile is looking
       something up, not changing how the board works for everyone. */
    showAllDone: false,
    filters: { stage: "", from: "", to: "" },
    STATUSES, PROCESS,
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
    grouped() {
      const out = {};
      PROCESS.forEach((c) => { out[c.key] = []; });
      this.rows.forEach((job) => {
        const col = PROCESS.find((c) => c.statuses.indexOf(job.status) !== -1);
        if (col) out[col.key].push(job);
      });
      // Most recently finished first, so the cap trims the OLDEST off the bottom rather
      // than whatever order the API happened to return.
      out.done.sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")));
      return out;
    },
    /**
     * What each column actually renders. Only the terminal column is capped — the working
     * columns are a to-do list and hiding part of one would hide work.
     *
     * ⚠️ `grouped` stays uncapped and is what `draggable` binds to, so a drag still
     * reorders the real list. Capping in the bound array would make a drop land at the
     * wrong index the moment anything was hidden.
     */
    visible() {
      const out = {};
      PROCESS.forEach((c) => { out[c.key] = this.grouped[c.key] || []; });
      if (!this.showAllDone && out.done.length > DONE_VISIBLE) {
        out.done = out.done.slice(0, DONE_VISIBLE);
      }
      return out;
    },
    doneHidden() {
      return Math.max(0, (this.grouped.done || []).length - DONE_VISIBLE);
    },
    activeChips() {
      const chips = [];
      if (this.filters.stage) chips.push({ key: "stage", label: "Stage: " + this.filters.stage });
      if (this.filters.from) chips.push({ key: "from", label: "From " + this.filters.from });
      if (this.filters.to) chips.push({ key: "to", label: "To " + this.filters.to });
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
    today() {
      const d = new Date().toISOString().slice(0, 10);
      this.filters.from = d;
      this.filters.to = d;
      this.load();
    },
    clearFilter(key) {
      this.filters[key] = "";
      this.load();
    },
    clearAll() {
      this.filters = { stage: "", from: "", to: "" };
      this.load();
    },
    query() {
      const p = [];
      // No owner parameter: ownership is the server's decision now, not a filter the
      // client asks for. Sending one would only suggest it could be overridden.
      if (this.filters.stage) p.push("status=" + encodeURIComponent(this.filters.stage));
      if (this.filters.from) p.push("from=" + this.filters.from);
      if (this.filters.to) p.push("to=" + this.filters.to);
      return p.length ? "?" + p.join("&") : "";
    },
    load() {
      this.loading = true;
      this.persist();

      Promise.all([
        ApiService.get("/jobs" + this.query()),
        /* The pool is a SEPARATE query on purpose: it must not disappear because a
           stage filter excluded it. An operator filters to find work, and the pool is
           where unclaimed work lives — as ENQUIRIES, before any job exists. */
        ApiService.get("/enquiries?unclaimed=1"),
      ])
        .then(([board, pool]) => {
          this.rows = board.data.data || [];
          this.pool = pool.data.data || [];
          this.error = null;
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
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
    matrixCell(day, opsId) {
      return this.rows.filter(
        (j) => j.ops_id === opsId && (j.planned_clearance_date || "").slice(0, 10) === day
      );
    },
    /* SLA colouring, from the same urgency bands the OLI multiplier uses — one rule,
       so the board and the load index cannot disagree about what "urgent" means. */
    urgency(job) {
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
    claim(enq) {
      this.busy = true;
      ApiService.post(`/inbox/threads/${enq.thread_id}/claim`, {})
        .then(() => this.load())
        /* 409 is a real outcome, not a failure: someone got there first. */
        .catch((e) => { this.error = this.readable(e); this.load(); })
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
      if (!event.added) return;

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
