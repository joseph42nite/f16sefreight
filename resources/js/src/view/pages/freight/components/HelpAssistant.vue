<template>
  <div class="fx-help">
    <!-- The launcher sits beside Report a problem: help first, a ticket when help runs out. -->
    <button
      class="fx-btn fx-btn--ghost"
      aria-label="Help assistant"
      data-help="help-assistant"
      :aria-expanded="String(open)"
      @click="toggle"
    >💬 Help<span v-if="unread" class="fx-help__badge" :aria-label="unread + ' new support messages'">{{ unread }}</span></button>

    <section v-if="open" class="fx-help__panel" role="dialog" aria-label="Help assistant">
      <header class="fx-help__head">
        <strong>{{ mode === "chat" ? "Support chat" : "Help" }}</strong>
        <span class="fx-muted">{{ mode === "chat" ? "" : "Ask how to do something in the portal" }}</span>
        <button v-if="mode === 'chat'" class="fx-btn fx-btn--ghost" @click="mode = 'help'">Back to help</button>
        <button class="fx-btn fx-btn--ghost" aria-label="Close help" @click="open = false">✕</button>
      </header>

      <!--
        🔴 CONNECT TO SUPPORT AGENT (PRD §5.10, user 2026-09-14): it raises a ticket in the support desk
        and the chat runs on it. Checked every 3 s while open; if nobody is online the ticket waits and
        the reply shows here — and as a badge on Help — when an agent answers.
      -->
      <template v-if="mode === 'chat' && chat">
        <ol ref="chatLog" class="fx-help__log">
          <li
            v-for="m in chat.messages"
            :key="m.id"
            class="fx-help__msg"
            :class="'fx-help__msg--' + m.sender"
          >{{ m.body }}</li>
        </ol>
        <form v-if="chat.status !== 'resolved'" class="fx-help__ask" @submit.prevent="sendChat">
          <textarea
            v-model="chatDraft"
            class="fx-input fx-help__input"
            rows="2"
            maxlength="4000"
            placeholder="Write to the support team"
            :disabled="chatBusy"
            @keydown.enter.exact.prevent="sendChat"
          ></textarea>
          <button class="fx-btn fx-btn--primary" :disabled="chatBusy || !chatDraft.trim()">Send</button>
        </form>
        <p v-else class="fx-muted fx-help__closed">This chat is closed. <button class="fx-btn fx-btn--ghost" @click="connect">Start a new chat</button></p>
        <p v-if="chatError" class="fx-error fx-help__closed">{{ chatError }}</p>
      </template>

      <template v-else>
      <ol ref="log" class="fx-help__log">
        <li v-if="!turns.length" class="fx-muted fx-help__hint">
          For example: “An arrival notice came in — where do I enter it?”
        </li>
        <li v-for="(t, i) in turns" :key="i" class="fx-help__turn">
          <p class="fx-help__question">{{ t.question }}</p>

          <p v-if="t.pending" class="fx-muted">Looking in the help documents…</p>
          <template v-else>
            <p class="fx-help__answer" :class="{ 'fx-help__answer--unsure': !t.found }">{{ readable(t.answer) }}</p>

            <div class="fx-help__actions">
              <!-- A page the documents named, not one the model made up (the server checks it). -->
              <button v-if="t.page && !onPage(t.page)" class="fx-btn fx-btn--ghost" @click="goTo(t.page)">Go to page</button>
              <button v-if="t.steps && t.steps.length" class="fx-btn" @click="showMe(t)">Show me</button>
              <button v-if="!t.found" class="fx-btn fx-btn--ghost" @click="connect">Talk to a support agent</button>
              <button v-if="!t.found" class="fx-btn fx-btn--ghost" @click="raiseTicket">Raise a ticket</button>
            </div>
            <p v-if="t.note" class="fx-muted">{{ t.note }}</p>
          </template>
        </li>
      </ol>

      <form class="fx-help__ask" @submit.prevent="ask">
        <textarea
          v-model="question"
          class="fx-input fx-help__input"
          rows="2"
          maxlength="1000"
          placeholder="Type your question"
          :disabled="busy"
          @keydown.enter.exact.prevent="ask"
        ></textarea>
        <button class="fx-btn fx-btn--primary" :disabled="busy || !question.trim()">Ask</button>
      </form>
      <!-- ⚠️ Always reachable: a person who does not trust the answer should not have to argue with it first. -->
      <div class="fx-help__escalate">
        <button class="fx-btn fx-btn--ghost fx-help__ticket" :disabled="chatBusy" @click="connect">
          {{ chat && chat.status !== "resolved" ? "Open your support chat" : "Talk to a support agent" }}
        </button>
        <button class="fx-btn fx-btn--ghost fx-help__ticket" @click="raiseTicket">Report a problem on this page</button>
      </div>
      <p v-if="chatError" class="fx-error fx-help__closed">{{ chatError }}</p>
      </template>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { HELP_TARGETS } from "@/core/config/helpTargets";

/**
 * The help copilot (PRD §5.10, user decisions 2026-09-14).
 *
 * 🔴 Answers come only from the help documents F16s uploads; when they do not cover the question it
 * says so and offers a ticket. "Show me" highlights the controls a document names as `[[name]]`
 * (see core/config/helpTargets.js) — the server has already dropped any name the documents do not use.
 */
export default {
  name: "HelpAssistant",
  data: () => ({
    open: false, question: "", busy: false, turns: [],
    /** "help" answers from the documents; "chat" is the conversation with an F16s agent. */
    mode: "help",
    chat: null, chatDraft: "", chatBusy: false, chatError: null,
    chatTimer: null, badgeTimer: null,
  }),
  computed: {
    unread() {
      return this.chat && !(this.open && this.mode === "chat") ? this.chat.unread || 0 : 0;
    },
  },
  created() {
    this.loadCurrentChat();
    // A reply can arrive while Help is closed: check now and then, for the badge.
    this.badgeTimer = setInterval(() => { if (!this.open) this.loadCurrentChat(); }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.badgeTimer);
    clearInterval(this.chatTimer);
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open && this.chat && this.chat.unread) this.openChat();
    },
    loadCurrentChat() {
      ApiService.get("/support/chats/current")
        .then(({ data }) => {
          if (!data.chat) return;
          const known = this.chat && this.chat.id === data.chat.id ? this.chat.messages : [];
          this.chat = { ...data.chat, messages: known };
        })
        .catch(() => {});
    },
    /** Connect to Support Agent: raises (or reopens) the chat ticket, with the help conversation so far. */
    connect() {
      this.chatBusy = true;
      this.chatError = null;

      const transcript = this.turns.filter((t) => !t.pending).map((t) => ({ question: t.question, answer: t.answer || "" }));

      ApiService.post("/support/chats", { route: this.$route ? this.$route.path : null, help_transcript: transcript.length ? transcript : undefined })
        .then(({ data }) => { this.chat = data; this.openChat(); })
        .catch((e) => { this.chatError = this.readable(e, "Could not reach the support team. Raise a ticket instead."); })
        .finally(() => { this.chatBusy = false; });
    },
    openChat() {
      this.mode = "chat";
      this.open = true;
      this.pollChat();
      clearInterval(this.chatTimer);
      // 🔴 Every 3 s while the chat is on screen (user's choice — no WebSockets yet).
      this.chatTimer = setInterval(() => {
        if (this.open && this.mode === "chat") this.pollChat();
        else clearInterval(this.chatTimer);
      }, 3000);
    },
    pollChat() {
      if (!this.chat) return;

      const last = this.chat.messages.length ? this.chat.messages[this.chat.messages.length - 1].id : 0;

      ApiService.get("/support/chats/" + this.chat.id + "/messages?after_id=" + last)
        .then(({ data }) => {
          if (data.messages.length) {
            this.chat.messages.push(...data.messages.filter((m) => !this.chat.messages.some((k) => k.id === m.id)));
            this.scrollChat();
          }
          this.chat.status = data.status;
          this.chat.unread = 0;
        })
        .catch(() => {});
    },
    sendChat() {
      const body = this.chatDraft.trim();
      if (!body || this.chatBusy || !this.chat) return;

      this.chatBusy = true;
      this.chatError = null;

      ApiService.post("/support/chats/" + this.chat.id + "/messages", { body })
        .then(({ data }) => {
          this.chat.messages.push(data);
          this.chatDraft = "";
          this.scrollChat();
        })
        .catch((e) => { this.chatError = this.readable(e, "Not sent. Try again."); })
        .finally(() => { this.chatBusy = false; });
    },
    scrollChat() {
      this.$nextTick(() => { if (this.$refs.chatLog) this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight; });
    },
    readable(e, fallback) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || fallback;
    },
    ask() {
      const question = this.question.trim();
      if (!question || this.busy) return;

      // The last three answered turns, so "and where is that?" is understood.
      const history = this.turns.filter((t) => !t.pending && t.answered)
        .slice(-3).map((t) => ({ question: t.question, answer: t.answer }));

      const turn = { question, pending: true, found: false, answer: "", steps: [], page: null, note: null, answered: false };
      this.turns.push(turn);
      this.question = "";
      this.busy = true;
      this.scrollDown();

      ApiService.post("/help/ask", { question, route: this.$route ? this.$route.path : null, history })
        .then(({ data }) => Object.assign(turn, { found: data.found, answer: data.answer, steps: data.steps || [], page: data.page, answered: true }))
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          Object.assign(turn, { found: false, answer: d.error || "Help could not answer just now. Try again, or raise a ticket." });
        })
        .finally(() => { turn.pending = false; this.busy = false; this.scrollDown(); });
    },
    onPage(page) {
      return !!this.$route && this.$route.path.startsWith(page);
    },
    goTo(page) {
      this.$router.push(page).catch(() => {});
    },
    /**
     * The guided steps, on the page they belong to.
     *
     * ⚠️ A control can be on the page but not open yet — the Extraction panel lives in the workspace
     * drawer — so steps whose control is not on screen are skipped, and the note says so.
     */
    async showMe(turn) {
      if (turn.page && !this.onPage(turn.page)) {
        await this.$router.push(turn.page).catch(() => {});
      }

      const selector = (s) => '[data-help="' + s.target + '"]';
      const visible = await this.waitFor(turn.steps.map(selector));
      const steps = turn.steps.filter((s) => visible.includes(selector(s)));

      turn.note = steps.length < turn.steps.length
        ? (steps.length ? "Some steps are on a part of the page that is not open yet." : "Those controls are not on screen yet — open the part of the page the answer describes, then press Show me again.")
        : null;

      if (!steps.length) return;

      const [{ driver }] = await Promise.all([
        import(/* webpackChunkName: "driver" */ "driver.js"),
        import(/* webpackChunkName: "driver" */ "driver.js/dist/driver.css"),
      ]);

      this.open = false;
      driver({
        showProgress: steps.length > 1,
        steps: steps.map((s, i) => ({
          element: selector(s),
          popover: { title: "Step " + (i + 1), description: this.readable(s.instruction) },
        })),
      }).drive();
    },
    /** Selectors that are on screen, waiting up to ~3 s for a page that is still rendering. */
    async waitFor(selectors) {
      for (let i = 0; i < 15; i += 1) {
        const found = selectors.filter((sel) => document.querySelector(sel));
        if (found.length === selectors.length || i === 14) return found;
        await new Promise((r) => setTimeout(r, 200));
      }
      return [];
    },
    /** `[[analyze-pdf]]` → "Analyze PDF button": the control's label from the list writers use. */
    readable(text) {
      return String(text || "").replace(/\[\[([a-z0-9-]+)\]\]/gi, (m, name) => {
        const target = HELP_TARGETS.find((t) => t.name === name.toLowerCase());
        return target ? "“" + target.label + "”" : name;
      });
    },
    raiseTicket() {
      const transcript = this.turns.filter((t) => !t.pending).map((t) => ({ question: t.question, answer: t.answer || "" }));
      this.open = false;
      this.$emit("raise-ticket", transcript);
    },
    scrollDown() {
      this.$nextTick(() => { if (this.$refs.log) this.$refs.log.scrollTop = this.$refs.log.scrollHeight; });
    },
  },
};
</script>
