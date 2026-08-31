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
                 that needs extracting arrived on this thread. -->
            <button class="fx-btn" @click="ocrOpen = true">Analyze PDF</button>

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

    <OcrUploadModal :open="ocrOpen" @close="ocrOpen = false" @extracted="onExtracted" />

    <FxDrawer
      :open="workspace && !!active"
      :title="active ? (active.subject || 'Workspace') : ''"
      :subtitle="active ? active.from : null"
      :tabs="WORKSPACE_TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="closeWorkspace"
    >
      <template v-if="active">
        <section v-if="tab === 'enquiry'">
          <p v-if="!active.enquiry" class="fx-muted">
            Not promoted to an enquiry yet. Classifying this as a customer enquiry mints
            a number — that is what turns a conversation into work.
          </p>
          <dl v-else class="fx-defs">
            <dt>Enquiry</dt>
            <dd class="identifier">{{ active.enquiry.enquiry_no }}</dd>
            <dt>Status</dt>
            <dd><StatusChip :value="active.enquiry.status" /></dd>
          </dl>
        </section>

        <section v-else-if="tab === 'timing'">
          <!--
            §4.2 the pair that must never be conflated. A time against "first triaged"
            with a dash against "first replied" means somebody looked and the client is
            still waiting — which is exactly what lost_reason = 'delay_in_response'
            later has to be provable from.
          -->
          <dl class="fx-defs">
            <dt>Last inbound</dt>
            <dd><Figure :value="active.latest_message_received_at" kind="dateTime" /></dd>
            <dt>First triaged</dt>
            <dd><Figure :value="active.first_triage_at" kind="dateTime" /></dd>
            <dt>First replied</dt>
            <dd><Figure :value="active.first_response_at" kind="dateTime" /></dd>
            <dt>Messages</dt>
            <dd>{{ active.message_count }}</dd>
          </dl>
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
          <p v-if="!extracted" class="fx-muted">
            Nothing extracted yet. <strong>Analyze PDF</strong> reads a document and
            marks every field the extractor was unsure of.
          </p>
          <template v-else>
            <p v-if="extracted.needsReview.length" class="fx-warn" role="status">
              {{ extracted.needsReview.length }} field(s) still need checking before this
              reaches a document.
            </p>
            <dl class="fx-defs">
              <template v-for="(node, key) in extracted.fields">
                <dt v-if="node && node.confidence" :key="key + '-k'">{{ String(key).replace(/_/g, " ") }}</dt>
                <dd v-if="node && node.confidence" :key="key + '-v'">
                  <span v-if="node.value">{{ node.value }}</span>
                  <span v-else class="is-empty" aria-label="Not found on the page"></span>
                  <StatusChip v-if="node.confidence !== 'high'" :value="node.confidence" />
                </dd>
              </template>
            </dl>
          </template>
        </section>

        <!--
          Upload, the document forms, the cost sheet and the e-docket are Step 6 items
          2, 4, 5 and 6. Named rather than hidden: an empty panel reads as broken,
          where a named one reads as unfinished.
        -->
        <section v-else class="fx-muted">
          <p>{{ tabLabel }} is not built yet — it lands with Step 6 item {{ tabStep }}.</p>
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
import OcrUploadModal from "@/view/pages/freight/components/OcrUploadModal.vue";
import CostSheet from "@/view/pages/freight/components/CostSheet.vue";

const CLASSIFICATIONS = ["customer_enquiry", "airline", "clearance", "trucking_road"];

/* §740's tab set. The two carrying real data today come first; the rest name the
   Step 6 item that fills them, so an unfinished tab cannot be mistaken for a bug. */
const WORKSPACE_TABS = [
  { key: "enquiry", label: "Enquiry" },
  { key: "timing", label: "Timing" },
  { key: "extraction", label: "Extraction" },
  { key: "upload", label: "Upload", step: 2 },
  { key: "cost", label: "Cost sheet" },
  { key: "docket", label: "E-Docket", step: 4 },
];

export default {
  name: "JobInbox",
  components: { Figure, StatusChip, FxDrawer, OcrUploadModal, CostSheet },
  data: () => ({
    folders: [
      { key: "all", label: "All" },
      { key: "unassigned", label: "Unassigned pool" },
      { key: "customer_enquiry", label: "Enquiries" },
      { key: "airline", label: "Airline" },
      { key: "clearance", label: "Clearance" },
      { key: "trucking_road", label: "Trucking" },
    ],
    folder: "all",
    threads: [], counts: {}, messages: [],
    active: null, pending: null,
    loading: true, busy: false, error: null, actionError: null,
    query: "", timer: null,
    workspace: false, tab: "enquiry", ocrOpen: false, extracted: null, jobId: null,
    CLASSIFICATIONS, WORKSPACE_TABS,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only pricing owns triage — re-classification mints or strands an enquiry. */
    canTriage() {
      return this.designation === "pricing";
    },
    tabLabel() {
      const t = WORKSPACE_TABS.find((x) => x.key === this.tab);
      return t ? t.label : this.tab;
    },
    tabStep() {
      const t = WORKSPACE_TABS.find((x) => x.key === this.tab);
      return t ? t.step : null;
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
    onExtracted(payload) {
      this.extracted = payload;
      this.setSplit(true);
      this.tab = "extraction";
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
      this.tab = "enquiry";
      ApiService.get("/inbox/threads/" + thread.id)
        .then(({ data }) => {
          this.active = data.thread;
          this.pending = data.thread.classification;
          this.messages = data.messages || [];
          this.jobId = null;

          /* The cost sheet hangs off the JOB, not the thread. A converted enquiry has
             one; an unconverted one does not, and saying so beats an empty table. */
          if (data.thread.enquiry && data.thread.enquiry.status === "converted") {
            ApiService.get("/jobs?enquiry_id=" + data.thread.enquiry.id)
              .then(({ data: jobs }) => {
                const rows = jobs.data || [];
                this.jobId = rows.length ? rows[0].id : null;
              })
              .catch(() => { this.jobId = null; });
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
