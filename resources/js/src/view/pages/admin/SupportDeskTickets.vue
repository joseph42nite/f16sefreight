<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Support desk</h1>
      <p class="fx-page-sub">
        Bug reports and live chats from every tenant. Reports are captured by the in-app
        reporter — no model in the path, because a hallucinated selector sends a developer
        to the wrong screen with confident-looking evidence. A chat is a client who pressed
        “Talk to a support agent” in Help.
      </p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Status</span>
        <select v-model="status" class="fx-input" @change="load">
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>
    </div>

    <!--
      🔴 The live chat on a ticket (Connect to Support Agent, user 2026-09-14). Checked every 3 s while
      open. The client sees each reply in Help, or as a badge on it if Help is closed.
    -->
    <section v-if="chat" class="fx-section fx-desk-chat" aria-label="Support chat">
      <div class="fx-toolbar">
        <strong>Chat #{{ chat.ticket.id }}</strong>
        <span class="fx-muted">
          {{ chat.ticket.reporter ? chat.ticket.reporter.name : "—" }} ·
          {{ chat.ticket.branch ? chat.ticket.branch.agent_name : "—" }} ·
          started on <span class="identifier">{{ chat.ticket.route }}</span>
        </span>
        <StatusChip :value="chat.status" />
        <button class="fx-btn fx-btn--ghost" @click="closeChat">Back to the queue</button>
      </div>

      <details v-if="chat.ticket.help_transcript && chat.ticket.help_transcript.length" class="fx-muted">
        <summary>What they asked Help first ({{ chat.ticket.help_transcript.length }})</summary>
        <p v-for="(t, i) in chat.ticket.help_transcript" :key="i"><strong>{{ t.question }}</strong><br />{{ t.answer }}</p>
      </details>

      <ol ref="chatLog" class="fx-help__log">
        <li v-for="m in chat.messages" :key="m.id" class="fx-help__msg" :class="'fx-help__msg--' + (m.sender === 'agent' ? 'user' : m.sender === 'user' ? 'agent' : 'system')">
          {{ m.body }}
        </li>
      </ol>

      <form v-if="chat.status !== 'resolved'" class="fx-desk-chat__reply" @submit.prevent="reply">
        <textarea v-model="draft" class="fx-input" rows="2" maxlength="4000" placeholder="Reply to the client" @keydown.enter.exact.prevent="reply"></textarea>
        <button class="fx-btn fx-btn--primary" :disabled="busy || !draft.trim()">Send</button>
        <button class="fx-btn" :disabled="busy" @click.prevent="resolveChat">Close chat</button>
      </form>
      <p v-else class="fx-muted">This chat is closed.</p>
    </section>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!tickets.length" class="fx-muted">Nothing in the queue.</p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Reported</th>
          <th scope="col">Branch</th>
          <th scope="col">Reporter</th>
          <th scope="col">Route</th>
          <th scope="col">Description</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <!-- Oldest OPEN first: newest-first buries the report that has waited longest,
             which is the one most likely to be a customer about to give up. -->
        <tr v-for="t in tickets" :key="t.id">
          <td><Figure :value="t.created_at" kind="dateTime" /></td>
          <td>{{ t.branch ? t.branch.agent_name : "—" }}</td>
          <td>{{ t.reporter ? t.reporter.name : "—" }}<br />
            <span class="fx-muted">{{ t.reporter ? t.reporter.designation : "" }}</span>
          </td>
          <td class="identifier">{{ t.route }}</td>
          <td>
            <span v-if="t.channel === 'chat'">💬 </span>{{ t.description }}
            <strong v-if="t.waiting_messages" class="fx-error"> · {{ t.waiting_messages }} waiting</strong>
            <div v-if="t.element_selector" class="fx-muted identifier fx-ticket__selector">
              {{ t.element_selector }}
            </div>
          </td>
          <td><StatusChip :value="t.status" /></td>
          <td class="fx-row-actions">
            <button v-if="t.channel === 'chat'" class="fx-btn fx-btn--primary" @click="openChat(t)">Open chat</button>
            <!--
              ⚠️ FORWARD ONLY. A resolved ticket returning to open destroys the one
              queue metric that matters — how long a report waited before somebody
              looked — because its clock restarts. A returning bug is a new report.
            -->
            <button
              v-if="t.status === 'open'"
              class="fx-btn" :disabled="busy" @click="advance(t, 'investigating')"
            >Investigating</button>
            <button
              v-if="t.status === 'investigating'"
              class="fx-btn" :disabled="busy" @click="advance(t, 'resolved')"
            >Resolve</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "SupportDeskTickets",
  components: { Figure, StatusChip },
  data: () => ({
    tickets: [], status: "", loading: true, busy: false, error: null,
    /** The chat open beside the queue: { ticket, status, messages }. */
    chat: null, draft: "", chatTimer: null, queueTimer: null,
  }),
  created() {
    this.load();
    // New chats and new client messages show up without a manual refresh.
    this.queueTimer = setInterval(() => { if (!this.busy) this.load(true); }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.queueTimer);
    clearInterval(this.chatTimer);
  },
  methods: {
    openChat(ticket) {
      this.chat = { ticket, status: ticket.status, messages: [] };
      this.pollChat();
      clearInterval(this.chatTimer);
      // 🔴 Every 3 s while the chat is open (user's choice — no WebSockets yet).
      this.chatTimer = setInterval(() => this.pollChat(), 3000);
    },
    closeChat() {
      clearInterval(this.chatTimer);
      this.chat = null;
      this.load();
    },
    pollChat() {
      if (!this.chat) return;
      const chat = this.chat;
      const last = chat.messages.length ? chat.messages[chat.messages.length - 1].id : 0;

      ApiService.get("/admin/tickets/" + chat.ticket.id + "/messages?after_id=" + last)
        .then(({ data }) => {
          if (data.messages.length) {
            chat.messages.push(...data.messages.filter((m) => !chat.messages.some((k) => k.id === m.id)));
            this.$nextTick(() => { if (this.$refs.chatLog) this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight; });
          }
          chat.status = data.status;
        })
        .catch((e) => { this.error = this.readable(e); });
    },
    reply() {
      const body = this.draft.trim();
      if (!body || this.busy || !this.chat) return;

      this.busy = true;
      ApiService.post("/admin/tickets/" + this.chat.ticket.id + "/messages", { body })
        .then(({ data }) => {
          this.chat.messages.push(data);
          if (this.chat.status === "open") this.chat.status = "investigating";
          this.draft = "";
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    resolveChat() {
      const ticket = this.chat.ticket;
      const steps = this.chat.status === "open" ? ["investigating", "resolved"] : ["resolved"];

      this.busy = true;
      steps.reduce((p, status) => p.then(() => ApiService.patch("/admin/tickets", ticket.id, { status })), Promise.resolve())
        .then(() => this.pollChat())
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    load(quiet = false) {
      if (!quiet) this.loading = true;
      ApiService.get("/admin/tickets" + (this.status ? "?status=" + this.status : ""))
        .then(({ data }) => { this.tickets = data.data || []; this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    advance(ticket, status) {
      this.busy = true;
      ApiService.patch("/admin/tickets", ticket.id, { status })
        .then(() => this.load())
        /* §11.3 the server's reason verbatim — a backwards transition explains itself. */
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
