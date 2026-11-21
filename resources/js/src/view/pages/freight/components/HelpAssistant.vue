<template>
  <div class="fx-help">
    <!-- At the foot of the sidebar (user, 2026-09-14): help, support chat and tickets in one place. -->
    <button
      class="fx-rail__item fx-help__launch"
      aria-label="Help assistant"
      data-help="help-assistant"
      :aria-expanded="String(open)"
      @click="toggle"
    ><span>💬 <span class="fx-rail__label">Help</span></span><span v-if="unread" class="fx-help__badge" :aria-label="unread + ' new support messages'">{{ unread }}</span></button>

    <section v-if="open" class="fx-help__panel" role="dialog" aria-label="Help assistant">
      <header class="fx-help__head">
        <strong>{{ mode === "chat" ? "Support chat" : "Help" }}</strong>
        <span class="fx-muted">{{ mode === "chat" ? "" : "Automated messages, then a person" }}</span>
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
      <!--
        Written messages and buttons, no AI (owner, 2026-11-21): each path ends at a person, in the support chat or
        through the flag. Everything shown here is this app's own text, so nothing a model wrote reaches the page.
      -->
      <ol ref="log" class="fx-help__log" aria-live="polite">
        <li
          v-for="(t, i) in turns"
          :key="i"
          class="fx-help__msg"
          :class="t.from === 'you' ? 'fx-help__msg--user' : 'fx-help__msg--agent'"
        >{{ t.text }}</li>
        <li class="fx-help__actions">
          <button
            v-for="option in step.options"
            :key="option.label"
            class="fx-btn"
            :class="{ 'fx-btn--ghost': !option.action }"
            :disabled="chatBusy"
            :data-help="option.action === 'flag' ? 'report-problem' : null"
            @click="choose(option)"
          >{{ option.label }}</button>
        </li>
      </ol>

      <!-- ⚠️ Always reachable: nobody should have to answer questions first to reach a person. -->
      <div class="fx-help__escalate">
        <button class="fx-btn fx-btn--ghost fx-help__ticket" :disabled="chatBusy" @click="connect">
          {{ chat && chat.status !== "resolved" ? "Open your support chat" : "Talk to a support agent" }}
        </button>
        <button class="fx-btn fx-btn--ghost fx-help__ticket" @click="raiseTicket">⚑ Flag what is wrong</button>
      </div>
      <p v-if="chatError" class="fx-error fx-help__closed">{{ chatError }}</p>
      </template>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { HELP_SCRIPT } from "@/core/config/helpScript";
import { tourSteps } from "@/core/config/tour";
import { say } from "@/core/services/toast";

/**
 * Help at the foot of the sidebar (PRD §5.10; owner, 2026-11-21: "an automated messaging system for now, no AI").
 *
 * Written messages and buttons (core/config/helpScript.js) that end at a person: the support chat with an F16s
 * agent, or the flag, which sends a marked picture of the page with a note. It used to ask a model and show its
 * steps through a library that wrote them into the page as HTML (frontend audit 2026-11-15, FS5); that is gone.
 */
export default {
  name: "HelpAssistant",
  data: () => ({
    open: false,
    /** What has been said so far: `{ from: "helper" | "you", text }`. */
    turns: [{ from: "helper", text: HELP_SCRIPT.start.says }],
    stepName: "start", topic: null,
    /** "help" is the written messages; "chat" is the conversation with an F16s agent. */
    mode: "help",
    chat: null, chatDraft: "", chatBusy: false, chatError: null,
    chatTimer: null, badgeTimer: null, tourTimer: null,
  }),
  computed: {
    step() {
      return HELP_SCRIPT[this.stepName];
    },
    unread() {
      return this.chat && !(this.open && this.mode === "chat") ? this.chat.unread || 0 : 0;
    },
  },
  created() {
    this.loadCurrentChat();
    // A reply can arrive while Help is closed: check now and then, for the badge.
    this.badgeTimer = setInterval(() => { if (!this.open) this.loadCurrentChat(); }, 30000);
    this.offerTour();
  },
  beforeDestroy() {
    clearInterval(this.badgeTimer);
    clearInterval(this.chatTimer);
    clearInterval(this.tourTimer);
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

      const transcript = this.transcript();

      ApiService.post("/support/chats", { route: this.$route ? this.$route.path : null, help_transcript: transcript.length ? transcript : undefined })
        .then(({ data }) => { this.chat = data; this.openChat(); say(this, "You are connected to F16s support."); })
        .catch((e) => { this.chatError = this.errorText(e, "Could not reach the support team. Raise a ticket instead."); })
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
        .catch((e) => { this.chatError = this.errorText(e, "Not sent. Try again."); })
        .finally(() => { this.chatBusy = false; });
    },
    scrollChat() {
      this.$nextTick(() => { if (this.$refs.chatLog) this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight; });
    },
    errorText(e, fallback) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || fallback;
    },
    /** One button pressed: it is said back as the person's own line, then the next message or the hand-over. */
    choose(option) {
      this.turns.push({ from: "you", text: option.label });
      if (option.topic) this.topic = option.topic;

      if (option.action === "tour") return this.startTour();
      if (option.action === "connect") return this.connect();
      if (option.action === "flag") return this.raiseTicket();

      this.stepName = HELP_SCRIPT[option.next] ? option.next : "start";
      if (this.stepName === "start") this.topic = null;
      this.turns.push({ from: "helper", text: this.step.says });
      this.scrollDown();
    },
    /**
     * What was chosen, for the agent or the ticket: each choice with the message it got. The topic goes first, in
     * words, so the agent reads it before anything else.
     */
    transcript() {
      const pairs = [];

      this.turns.forEach((turn, i) => {
        if (turn.from !== "you") return;
        const reply = this.turns[i + 1];
        pairs.push({ question: turn.text, answer: reply && reply.from === "helper" ? reply.text : "(handed to a person)" });
      });

      return (this.topic ? [{ question: "What is it about?", answer: this.topic }] : []).concat(pairs).slice(-20);
    },
    /**
     * The tour on a person's first sign-in (owner, 2026-11-21). The account remembers that it was seen. It waits
     * for anything asked of them first (the Outlook question is also a first sign-in thing) so the two never sit
     * on top of each other; after five minutes of waiting it leaves it for the next sign-in.
     */
    offerTour() {
      return ApiService.get("/tour")
        .then(({ data }) => {
          if (!data || data.seen) return;

          let waited = 0;
          this.tourTimer = setInterval(() => {
            waited += 1;
            if (waited > 300) return clearInterval(this.tourTimer);
            if (document.querySelector('[aria-modal="true"]') || this.open) return null;

            clearInterval(this.tourTimer);
            return this.startTour();
          }, 1000);
        })
        .catch(() => {});
    },
    /** A box beside each part of the screen, with Next and Back. Closing it at any step counts as having seen it. */
    async startTour() {
      this.open = false;
      await this.$nextTick();

      const steps = tourSteps();
      // Only the welcome and nothing to point at: the screen is not the app's own shell.
      if (steps.length < 2) return;

      const [{ driver }] = await Promise.all([
        import(/* webpackChunkName: "driver" */ "driver.js"),
        import(/* webpackChunkName: "driver" */ "driver.js/dist/driver.css"),
      ]);

      driver({
        steps,
        showProgress: true,
        progressText: "{{current}} of {{total}}",
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        onDestroyed: () => { ApiService.post("/tour/seen", {}).catch(() => {}); },
      }).drive();
    },
    raiseTicket() {
      this.open = false;
      this.$emit("raise-ticket", this.transcript());
    },
    scrollDown() {
      this.$nextTick(() => { if (this.$refs.log) this.$refs.log.scrollTop = this.$refs.log.scrollHeight; });
    },
  },
};
</script>
