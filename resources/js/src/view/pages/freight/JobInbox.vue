<template>
  <div class="fx-inbox">
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

    <section class="fx-inbox__convo" aria-label="Conversation">
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

const CLASSIFICATIONS = ["customer_enquiry", "airline", "clearance", "trucking_road"];

export default {
  name: "JobInbox",
  components: { Figure, StatusChip },
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
    CLASSIFICATIONS,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only pricing owns triage — re-classification mints or strands an enquiry. */
    canTriage() {
      return this.designation === "pricing";
    },
  },
  created() {
    this.load();
  },
  methods: {
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
      ApiService.get("/inbox/threads/" + thread.id)
        .then(({ data }) => {
          this.active = data.thread;
          this.pending = data.thread.classification;
          this.messages = data.messages || [];
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
