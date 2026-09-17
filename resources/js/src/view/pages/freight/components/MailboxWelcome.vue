<template>
  <div v-if="state">
    <!-- First sign-in: asked once. "Later" stops the question; the bar below stays until connected. -->
    <div v-if="state.ask" class="fx-modal" role="dialog" aria-modal="true" aria-label="Connect your Outlook">
      <div class="fx-modal__panel fx-welcome">
        <header class="fx-modal__head"><h2 class="fx-modal__title">Connect your Outlook</h2></header>
        <div class="fx-modal__body">
          <p>Your mail is how enquiries and shipments reach you. Connect your Outlook and we bring in the
            <strong>last month</strong> of your mail, then keep up with new mail as it arrives.</p>
          <ul class="fx-welcome__points">
            <li>You sign in with Microsoft. We never see your password.</li>
            <li>Mail is kept here for 3 months. Anything older is still in your Outlook.</li>
            <li>You can disconnect at any time from Settings.</li>
          </ul>
          <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="later">Later</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy" @click="connect">
            {{ busy ? "Opening Microsoft…" : "Connect Outlook" }}
          </button>
        </footer>
      </div>
    </div>

    <div v-else-if="showReminder" class="fx-reminder" role="status">
      <span>Your Outlook is not connected, so your mail is not here yet.</span>
      <button class="fx-btn fx-btn--primary" :disabled="busy" @click="connect">
        {{ busy ? "Opening Microsoft…" : "Connect Outlook" }}
      </button>
      <button class="fx-btn fx-btn--ghost" aria-label="Hide until next sign-in" @click="hidden = true">✕</button>
    </div>
    <p v-if="error && !state.ask" class="fx-error fx-reminder" role="alert">{{ error }}</p>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

/** Asks pricing, operations, sales, the Boss and accounts to connect their own Outlook (user, 2026-09-16). */
export default {
  name: "MailboxWelcome",
  data: () => ({ state: null, busy: false, error: null, hidden: false }),
  computed: {
    showReminder() {
      const onMailPages = ["/settings"].includes(this.$route.path) || this.$route.path.startsWith("/mailbox-import");
      return !this.state.connected && !this.hidden && !onMailPages;
    },
  },
  created() {
    ApiService.get("/me").then(({ data }) => { this.state = data.mailbox || null; }).catch(() => {});
  },
  methods: {
    connect() {
      this.busy = true;
      this.error = null;
      ApiService.post("/user/mailboxes/connect", { provider: "outlook" })
        .then(({ data }) => { window.location.href = data.authorization_url; })
        .catch((e) => {
          this.error = (e.response && e.response.data && e.response.data.error) || "Could not start the Outlook sign-in.";
          this.busy = false;
        });
    },
    later() {
      this.busy = true;
      ApiService.post("/user/mailbox-prompt/later")
        .then(() => { this.state = { ...this.state, ask: false }; })
        .catch(() => { this.state = { ...this.state, ask: false }; })
        .finally(() => { this.busy = false; });
    },
  },
};
</script>
