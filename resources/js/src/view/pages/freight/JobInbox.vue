<template>
  <div class="fx-inbox" :class="{ 'is-split': workspace }">
    <!--
      §9.2 THREE COLUMNS: folders -> threads -> conversation. The shape matters — an
      operator triaging fifty conversations a morning needs the list to stay put while
      the conversation changes. A single-pane inbox that navigates away and back loses
      scroll position on every decision.
    -->
    <aside class="fx-inbox__folders" aria-label="Folders">
      <button
        v-for="f in folders"
        :key="f.key"
        class="fx-folder"
        :class="{ 'is-active': folder === f.key }"
        @click="select(f.key)"
      >
        <span>{{ f.label }}</span>
        <span class="fx-folder__count">{{ counts[f.key] === undefined ? "" : counts[f.key] }}</span>
      </button>
    </aside>

    <section class="fx-inbox__list" aria-label="Conversations">
      <div class="fx-inbox__search">
        <input v-model="query" class="fx-input" type="search" placeholder="Subject or sender…" @input="debounced" />
      </div>

      <p v-if="loading" class="fx-muted fx-inbox__pad">Loading…</p>
      <p v-else-if="error" class="fx-error fx-inbox__pad" role="alert">{{ error }}</p>
      <p v-else-if="!threads.length" class="fx-muted fx-inbox__pad">Nothing here.</p>

      <ul v-else class="fx-threads">
        <li
          v-for="t in threads"
          :key="t.id"
          class="fx-thread"
          :class="{ 'is-active': active && active.id === t.id, 'is-unread': t.status === 'unread' }"
          tabindex="0"
          @click="open(t)"
          @keydown.enter="open(t)"
        >
          <div class="fx-thread__row">
            <span class="fx-thread__from">{{ t.from }}</span>
            <span class="fx-thread__when"><Figure :value="t.latest_message_received_at" kind="date" /></span>
          </div>
          <div class="fx-thread__subject">{{ t.subject }}</div>
          <div class="fx-thread__row">
            <StatusChip :value="t.classification" />
            <!-- The pool is what nobody owns yet. Saying so on the row is what makes
                 the claim button mean something. -->
            <span v-if="t.assigned_ops" class="fx-thread__owner">{{ t.assigned_ops.name }}</span>
            <span v-else class="fx-thread__owner fx-thread__owner--free">Unassigned</span>
          </div>
        </li>
      </ul>
    </section>

    <section ref="convo" class="fx-inbox__convo" aria-label="Conversation">
      <p v-if="!active" class="fx-muted fx-inbox__pad">Select a conversation.</p>

      <template v-else>
        <header class="fx-convo__head">
          <div>
            <h2 class="fx-convo__subject">{{ active.subject }}</h2>
            <p class="fx-convo__meta">
              {{ active.from }} · {{ active.message_count }} message{{ active.message_count === 1 ? "" : "s" }}
              <template v-if="active.enquiry">
                · <span class="identifier">{{ active.enquiry.enquiry_no }}</span>
              </template>
            </p>
          </div>

          <div class="fx-convo__actions">
            <button
              v-if="!active.assigned_ops"
              class="fx-btn"
              :disabled="busy"
              @click="claim"
            >Claim</button>

            <!--
              §8.1 role forbids -> HIDDEN. Only pricing re-classifies; operations reads
              and claims. A disabled dropdown would just invite "why can't I?" tickets.
            -->
            <select v-if="canTriage" v-model="pending" class="fx-input" :disabled="busy" @change="classify">
              <option v-for="c in CLASSIFICATIONS" :key="c" :value="c">{{ c.replace(/_/g, " ") }}</option>
            </select>

            <!--
              §9.2 the split-pane. Opening the workspace slides the folder and thread
              columns off-screen LEFT and gives the conversation and the workspace 50%
              each — because verification happens WHILE reading the email that carried
              the document. A workspace that covers the conversation makes the operator
              memorise a consignee name instead of checking it, and a mis-keyed
              consignee is a rejected filing.
            -->
            <!-- PRD §2.3 puts the [Analyze PDF] dropzone on /inbox: the attachment
                 that needs extracting arrived on this thread.
                 🔴 It opens the WORKSPACE, not a modal. Extraction is sustained work
                 against several documents while reading the mail that carried them —
                 §5.5's own test for a drawer over a modal. A modal would also cover the
                 conversation, making the operator memorise a consignee instead of
                 checking it, and a mis-keyed consignee is a rejected filing. -->
            <!-- ⚠️ Hidden, not disabled, on a non-enquiry thread. A greyed button invites
                 a click and then explains nothing; the workspace already says which
                 classification unlocks the work, for anyone who opens it. -->
            <button v-if="workspaceTabs.length" class="fx-btn" @click="openExtraction">Analyze PDF</button>

            <button class="fx-btn fx-btn--primary" @click="openWorkspace">Open workspace</button>
          </div>
        </header>

        <p v-if="actionError" class="fx-error fx-inbox__pad" role="alert">{{ actionError }}</p>

        <!--
          §4.2 the SLA pair, side by side and never conflated. first_triage_at is
          somebody looking; first_response_at is something being SENT. Reporting the
          first as a response claims an SLA the client never experienced.
        -->
        <dl class="fx-defs fx-convo__sla">
          <dt>First triaged</dt>
          <dd><Figure :value="active.first_triage_at" kind="dateTime" /></dd>
          <dt>First replied</dt>
          <dd><Figure :value="active.first_response_at" kind="dateTime" /></dd>
        </dl>

        <ol class="fx-messages">
          <li
            v-for="m in messages"
            :key="m.id"
            class="fx-message"
            :class="'fx-message--' + m.direction"
          >
            <div class="fx-message__head">
              <span class="fx-message__from">{{ m.from }}</span>
              <span class="fx-message__when"><Figure :value="m.received_at" kind="dateTime" /></span>
            </div>
            <p class="fx-message__body">{{ m.body_snippet }}</p>
          </li>
        </ol>
      </template>
    </section>


    <FxDrawer
      :open="workspace && !!active"
      :title="active ? (active.subject || 'Workspace') : ''"
      :subtitle="active ? active.from : null"
      :tabs="workspaceTabs"
      :active-tab="tab"
      @tab="tab = $event"
      @close="closeWorkspace"
    >
      <!--
        The facts that identify this conversation, stated rather than tabbed. Enquiry and
        Timing each used to be a tab; both were always true and never changed while the
        drawer was open, so the click bought nothing.
      -->
      <!--
        🔴 The `v-if` lives on the DIV, never on the `<template #meta>`. A conditional
        v-slot template compiles into `$scopedSlots` instead of `$slots`, so FxDrawer's
        `v-if="$slots.meta"` went stale: the header kept the FIRST thread's enquiry and
        stopped updating when you clicked another one — which reads as "every enquiry is
        Lost" if the first one you opened happened to be.
      -->
      <template #meta>
        <div v-if="active" class="fx-drawer__facts">
          <template v-if="active.enquiry">
            <span class="identifier">{{ active.enquiry.enquiry_no }}</span>
            <StatusChip :value="active.enquiry.status" />
          </template>
          <!-- ⚠️ Not promoted is a real state, not a blank. Classifying a conversation as
               a customer enquiry is what mints the number and turns it into work. -->
          <span v-else class="fx-muted">Not promoted to an enquiry</span>

          <span
            v-if="timing"
            class="fx-drawer__timing"
            :class="'is-' + timing.tone"
            :title="timingDetail"
          >{{ timing.label }}</span>
        </div>
      </template>

      <template v-if="active">
        <!--
          ⚠️ Named, not blank. A drawer with nothing in it reads as broken; saying which
          classification unlocks the work turns it into an instruction the operator can act
          on — reclassify, or this is not that kind of conversation.
        -->
        <section v-if="!workspaceTabs.length" class="fx-muted">
          <p>
            Extraction and the cost sheet are for <strong>customer enquiries</strong>. This
            conversation is filed as
            <StatusChip :value="active.classification" />.
          </p>
          <p>
            If a client's request arrived on it, re-classify it as a customer enquiry — that
            is what mints the number and turns it into work.
          </p>
        </section>

        <!-- §6.7 — the cost sheet, decoupled from the manifest. -->
        <section v-else-if="tab === 'cost'">
          <p v-if="!active.enquiry" class="fx-muted">
            No enquiry on this conversation yet, so there is no job to cost.
          </p>
          <CostSheet v-else-if="jobId" :job-id="jobId" />
          <p v-else class="fx-muted">This enquiry has not been converted to a job yet.</p>
        </section>

        <section v-else-if="tab === 'extraction'">
          <!-- The waybill this conversation is already about, so the operator is not
               asked to retype a number the job already holds. -->
          <ExtractionPanel :prefill-awb="jobAwb" @apply="onExtracted" />
        </section>
      </template>

      <template #footer>
        <button class="fx-btn" @click="closeWorkspace">← Back to timeline</button>
      </template>
    </FxDrawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";
import ExtractionPanel from "@/view/pages/freight/components/ExtractionPanel.vue";
import CostSheet from "@/view/pages/freight/components/CostSheet.vue";

const CLASSIFICATIONS = ["customer_enquiry", "airline", "clearance", "trucking_road"];

/* §740's tab set. The two carrying real data today come first; the rest name the
   Step 6 item that fills them, so an unfinished tab cannot be mistaken for a bug. */
/**
 * The workspace holds WORK SURFACES, nothing else.
 *
 * 🔴 **Four tabs were removed on 2026-09-01, and two of them were lying.**
 *   Enquiry · Timing  two read-only fields and four timestamps. Both are always true of
 *                     the thread and never change while the drawer is open, so a tab made
 *                     the reader click to learn something that should simply be stated.
 *                     They live in the header now.
 *   Upload            duplicated [Analyze PDF], which already uploads from the
 *                     conversation header — beside the attachment that needs reading. Its
 *                     placeholder promised "Step 6 item 2", which IS the upload modal, and
 *                     was already built.
 *   E-Docket          its placeholder cited "Step 6 item 4", which is JobCostSheet — built,
 *                     and already the Cost sheet tab in this same drawer. The pointer was
 *                     simply wrong.
 *
 * ⚠️ A placeholder that names a step already delivered is worse than no placeholder: it
 * tells an operator to wait for something they could be using now.
 */
/** What each classification is called in the folder rail. */
const FOLDER_LABELS = {
  customer_enquiry: "Enquiries",
  airline: "Airline",
  shipping_line: "Shipping line",
  clearance: "Clearance",
  trucking_road: "Trucking",
  other: "Other",
};

const WORKSPACE_TABS = [
  { key: "extraction", label: "Extraction" },
  { key: "cost", label: "Cost sheet" },
];

export default {
  name: "JobInbox",
  components: { Figure, StatusChip, FxDrawer, ExtractionPanel, CostSheet },
  data: () => ({
    /* 🔴 The mode's folders come from the SERVER, not a hardcoded list. An air operator
       has no use for a shipping-line folder and a sea operator none for an airline one;
       hardcoding air here is what put the wrong counterparty in front of both. Seeded with
       the mode-independent entries so the rail is never empty while the list loads. */
    folders: [
      { key: "all", label: "All" },
      { key: "unassigned", label: "Unassigned pool" },
    ],
    folder: "all",
    threads: [], counts: {}, messages: [],
    active: null, pending: null,
    loading: true, busy: false, error: null, actionError: null,
    query: "", timer: null,
    workspace: false, tab: "extraction", extracted: null, jobId: null, jobAwb: null,
    CLASSIFICATIONS, WORKSPACE_TABS,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only pricing owns triage — re-classification mints or strands an enquiry. */
    canTriage() {
      return this.designation === "pricing";
    },
    /**
     * 🔴 TIMING AS A STATE, NOT FOUR TIMESTAMPS. The value in `first_triage_at` and
     * `first_response_at` is the CONTRAST between them — a time against triaged with a
     * dash against replied means somebody looked and the client is still waiting, which is
     * what makes `lost_reason = 'delay_in_response'` provable rather than asserted.
     *
     * Four raw datetimes in a header read as noise and leave the reader to do the
     * subtraction. The exact values stay available on hover.
     */
    /**
     * 🔴 Extraction and the cost sheet belong to a CUSTOMER ENQUIRY and nothing else.
     *
     * An airline confirming space, a broker filing a bill of entry, a trucker giving a
     * pickup slot — none of those get extracted into a waybill or costed. Offering the
     * tabs anyway invites an operator to start work the conversation cannot carry, and
     * then to wonder why the cost sheet says there is no job.
     */
    workspaceTabs() {
      const isEnquiry = this.active && this.active.classification === "customer_enquiry";

      return isEnquiry ? WORKSPACE_TABS : [];
    },
    timing() {
      const a = this.active;
      if (!a) return null;

      if (!a.first_triage_at) {
        return { label: "Not triaged yet", tone: "neutral" };
      }

      const triaged = new Date(a.first_triage_at);

      if (a.first_response_at) {
        return {
          label: "Answered " + this.elapsed(triaged, new Date(a.first_response_at)) + " after triage",
          tone: "success",
        };
      }

      /* Unanswered is the one worth noticing, so it is the one that gets a colour. */
      return {
        label: "Unanswered — " + this.elapsed(triaged, new Date()) + " since triage",
        tone: "warn",
      };
    },
    timingDetail() {
      const a = this.active;
      if (!a) return "";

      return [
        "Last inbound: " + this.stamp(a.latest_message_received_at),
        "First triaged: " + this.stamp(a.first_triage_at),
        "First replied: " + this.stamp(a.first_response_at),
        "Messages: " + (a.message_count == null ? "—" : a.message_count),
      ].join("\n");
    },
  },
  created() {
    this.load();
  },
  /* Leaving the inbox with the workspace open would strand the body class and collapse
     the rail on every other screen. */
  beforeDestroy() {
    document.body.classList.remove("fx-split");
  },
  methods: {
    /**
     * 🔴 THE CONVERSATION'S SCROLL POSITION SURVIVES THE TRANSITION (§9.2).
     *
     * The pane is re-laid-out from fluid width to 50%, which resets scrollTop. Losing
     * the reader's place halfway down a long thread is, in the guide's words, the
     * fastest way to make the feature feel broken — and it is worse than that here,
     * because the operator opened the workspace to transcribe something they were
     * looking at.
     *
     * The 60px rail is the AppShell's business, not this page's: a body class is the
     * smallest signal that crosses that boundary without inventing shared state.
     */
    setSplit(open) {
      const pane = this.$refs.convo;
      const top = pane ? pane.scrollTop : 0;

      this.workspace = open;
      document.body.classList.toggle("fx-split", open);

      /* ⚠️ Restored TWICE, and the second one is the one that matters.
         The pane changes width across the transition, so content reflows for the
         whole 200ms and the browser keeps re-deriving scrollTop underneath us.
         Setting it once on $nextTick lands mid-flight and drifts — measured at
         420 -> 434.5. The nextTick pass keeps the jump invisible; the settle pass
         puts it exactly back. */
      const restore = () => {
        if (this.$refs.convo) this.$refs.convo.scrollTop = top;
      };

      this.$nextTick(restore);

      /* transitionend, with a timer fallback: under prefers-reduced-motion there is
         no transition to end, and the event would never arrive. */
      const inbox = this.$el;
      const settle = (e) => {
        if (e && e.target !== inbox) return;
        inbox.removeEventListener("transitionend", settle);
        restore();
      };
      inbox.addEventListener("transitionend", settle);
      setTimeout(settle, 320);
    },
    /**
     * The operator ACCEPTED an extraction. Nothing is written to a document here —
     * §Step 6.2's pre-population of FocusAir.vue / HouseWayBill.vue is still to come,
     * and quietly stuffing values into a legal document on arrival would make the
     * confidence highlighting decorative.
     */
    /**
     * The operator has chosen what to take from where. Held, not written.
     *
     * ⚠️ Still nothing is pushed into FocusAir.vue / HouseWayBill.vue — that is Step 6.2.
     * Quietly stuffing values into a legal document would make the confidence marking
     * decorative, which is the one thing it must not be.
     */
    onExtracted(payload) {
      this.extracted = payload;
    },
    openExtraction() {
      this.tab = "extraction";
      this.setSplit(true);
    },
    /* ⚠️ A raw ISO string is not a date to a reader. The API sends
       2026-08-30T10:28:47.000000Z; a person needs 30 Aug 2026, 10:28. */
    stamp(value) {
      if (!value) return "—";

      const d = new Date(value);
      if (isNaN(d)) return String(value);

      return d.toLocaleString(undefined, {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    },
    /** Coarse on purpose: "3d" is the decision, "3d 4h 12m" is trivia. */
    elapsed(from, to) {
      const mins = Math.max(0, Math.round((to - from) / 60000));
      if (mins < 60) return mins + "m";
      if (mins < 1440) return Math.round(mins / 60) + "h";
      return Math.round(mins / 1440) + "d";
    },
    openWorkspace() {
      this.setSplit(true);
    },
    closeWorkspace() {
      this.setSplit(false);
    },
    select(key) {
      this.folder = key;
      this.load();
    },
    debounced() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.load, 250);
    },
    params() {
      const p = [];
      if (this.folder === "unassigned") p.push("unassigned=1");
      else if (this.folder !== "all") p.push("classification=" + this.folder);
      if (this.query) p.push("q=" + encodeURIComponent(this.query));
      return p.length ? "?" + p.join("&") : "";
    },
    load() {
      this.loading = true;
      ApiService.get("/inbox/threads" + this.params())
        .then(({ data }) => {
          this.threads = data.data || [];

          /* The portal's own vocabulary — see EmailInboxController::classificationsForMode. */
          if (data.classifications) {
            this.folders = [
              { key: "all", label: "All" },
              { key: "unassigned", label: "Unassigned pool" },
              ...data.classifications.map((c) => ({ key: c, label: FOLDER_LABELS[c] || c })),
            ];
          }
          this.error = null;
          this.tally();
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    /* Counts come from the loaded page, so they describe what is on screen rather than
       claiming a total the list does not show. */
    tally() {
      const c = { all: this.threads.length };
      this.threads.forEach((t) => {
        c[t.classification] = (c[t.classification] || 0) + 1;
        if (!t.assigned_ops) c.unassigned = (c.unassigned || 0) + 1;
      });
      this.counts = c;
    },
    open(thread) {
      this.actionError = null;
      // 🔴 "enquiry" was a TAB until it moved to the header, and this line kept resetting
      // to it — a key no section matches, so the workspace rendered nothing at all and
      // whatever the operator had typed appeared to vanish. Removing a tab means removing
      // every place that selects it.
      this.tab = "extraction";
      ApiService.get("/inbox/threads/" + thread.id)
        .then(({ data }) => {
          this.active = data.thread;
          this.pending = data.thread.classification;
          this.messages = data.messages || [];
          this.jobId = null;
          this.jobAwb = null;

          /* The cost sheet hangs off the JOB, not the thread. A converted enquiry has
             one; an unconverted one does not, and saying so beats an empty table. */
          if (data.thread.enquiry && data.thread.enquiry.status === "converted") {
            ApiService.get("/jobs?enquiry_id=" + data.thread.enquiry.id)
              .then(({ data: jobs }) => {
                const rows = jobs.data || [];
                this.jobId = rows.length ? rows[0].id : null;

                /* 🔗 The AWB the shipment already carries. Extraction should offer the
                   number the enquiry is about, not an empty box — that is what ties the
                   enquiry, the job and the waybill into one thread of work. */
                this.jobAwb = rows.length ? rows[0].awb_number || null : null;
              })
              .catch(() => { this.jobId = null; this.jobAwb = null; });
          }
        })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    claim() {
      this.busy = true;
      ApiService.post("/inbox/threads/" + this.active.id + "/claim", {})
        .then(({ data }) => { this.active = data; this.load(); })
        /* 409 is a real outcome, not a failure: someone got there first. */
        .catch((e) => { this.actionError = this.messageFor(e); this.load(); })
        .finally(() => { this.busy = false; });
    },
    classify() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/inbox/threads/" + this.active.id + "/classify", { classification: this.pending })
        .then(({ data }) => { this.active = data; this.load(); })
        .catch((e) => {
          this.actionError = this.messageFor(e);
          /* Put the control back to the truth — the server refused the change. */
          this.pending = this.active.classification;
        })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
