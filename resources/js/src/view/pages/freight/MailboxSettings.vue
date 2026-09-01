<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Mailboxes</h1>
      <p class="fx-page-sub">
        Connect the mailbox your clients write to. Messages appear in the Inbox; nothing is
        sent without you asking.
      </p>
    </header>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <section class="fx-section">
        <h2 class="fx-section__title">Connected</h2>

        <p v-if="!connections.length" class="fx-muted">
          No mailbox is connected yet, so the Inbox has nothing to show.
        </p>

        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">Mailbox</th>
              <th scope="col">Provider</th>
              <th scope="col">State</th>
              <th scope="col">Last synced</th>
              <th scope="col"><span class="fx-sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in connections" :key="c.id">
              <td>{{ c.email_address }}</td>
              <td>{{ providerLabel(c.provider) }}</td>
              <td><StatusChip :value="stateOf(c)" /></td>
              <!--
                §4.1 NULL is not "never". A mailbox connected two minutes ago has not
                synced YET, which is a different thing from one that has stopped.
              -->
              <td>
                <span v-if="c.last_synced_at">{{ c.last_synced_at }}</span>
                <span v-else class="fx-muted">not yet</span>
              </td>
              <td class="fx-num">
                <button
                  v-if="!c.disconnected_at"
                  class="fx-btn fx-btn--ghost"
                  :disabled="busy === c.id"
                  @click="syncNow(c)"
                >Sync now</button>
                <button
                  v-if="!c.disconnected_at"
                  class="fx-btn fx-btn--ghost"
                  :disabled="busy === c.id"
                  @click="confirmDisconnect(c)"
                >Disconnect</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Add a mailbox</h2>

        <!--
          🔒 §4.2 — the consent screen is MICROSOFT'S, not ours. We never see or ask for a
          password; the user authorises on login.microsoftonline.com and we receive tokens.
          Saying so here is the difference between a prompt people trust and one they close.
        -->
        <p class="fx-muted">
          You will be taken to Microsoft to sign in and approve access. F16s never sees your
          password, and you can disconnect at any time — disconnecting erases the stored
          credentials.
        </p>

        <p v-if="connectError" class="fx-error" role="alert">{{ connectError }}</p>

        <button class="fx-btn fx-btn--primary" :disabled="connecting" @click="connect('outlook')">
          {{ connecting ? "Opening Microsoft…" : "Connect Outlook / Microsoft 365" }}
        </button>

        <!--
          ⚠️ Gmail is DEFERRED, not missing. Shown disabled with the reason, because a
          feature that silently is not there reads as a product that cannot do it.
        -->
        <button class="fx-btn" disabled title="Deferred — Google requires a separate security assessment">
          Connect Gmail (not available yet)
        </button>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "MailboxSettings",
  components: { StatusChip },
  data: () => ({
    loading: true, error: null, connectError: null,
    connections: [], connecting: false, busy: null,
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      ApiService.get("/user/mailboxes")
        .then(({ data }) => { this.connections = data.connections || []; })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    providerLabel(p) {
      return p === "outlook" ? "Microsoft 365" : p;
    },
    /* One column, three sources of truth — the row is easier to read than three flags. */
    stateOf(c) {
      if (c.disconnected_at) return "disconnected";
      if (!c.is_active) return "paused";
      return c.auth_state;
    },
    connect(provider) {
      this.connecting = true;
      this.connectError = null;

      ApiService.post("/user/mailboxes/connect", { provider })
        .then(({ data }) => {
          /* A full navigation rather than a popup: popup blockers eat this, and the
             consent screen is a page the user should see in full. */
          window.location.href = data.authorization_url;
        })
        .catch((e) => {
          this.connectError = this.messageFor(e);
          this.connecting = false;
        });
    },
    syncNow(c) {
      this.busy = c.id;

      ApiService.post("/user/mailboxes/" + c.id + "/sync")
        .then(() => this.load())
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    confirmDisconnect(c) {
      /* 🔴 Confirmed, because it ERASES credentials — reconnecting means going through
         Microsoft's consent screen again, not flipping a switch back. */
      if (!window.confirm(
        "Disconnect " + c.email_address + "?\n\n" +
        "The stored credentials are erased. New mail stops arriving in the Inbox; " +
        "messages already synced are kept."
      )) return;

      this.busy = c.id;

      ApiService.post("/user/mailboxes/" + c.id + "/disconnect")
        .then(() => this.load())
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
