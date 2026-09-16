<template>
  <div class="fx-import">
    <h1 class="fx-page-title">{{ title }}</h1>
    <p v-if="info" class="fx-page-sub">{{ info.email_address }}<span v-if="info.from"> · mail since {{ since }}</span></p>

    <div v-if="info && info.status !== 'failed'" class="fx-import__bar" role="progressbar"
         :aria-valuenow="info.processed" aria-valuemin="0" :aria-valuemax="info.estimate || undefined">
      <div class="fx-import__fill" :class="{ 'is-unknown': !info.estimate && !done }" :style="{ width: percent + '%' }"></div>
    </div>

    <p v-if="info" class="fx-import__count">
      <template v-if="done">{{ info.processed.toLocaleString() }} messages brought in.</template>
      <template v-else-if="info.status === 'failed'">The import stopped after {{ info.processed.toLocaleString() }} messages.</template>
      <template v-else>
        {{ info.processed.toLocaleString() }}<span v-if="info.estimate"> of about {{ info.estimate.toLocaleString() }}</span> messages…
      </template>
    </p>
    <p v-if="!done && info && info.status !== 'failed'" class="fx-muted">
      You can leave this page — the import carries on in the background and your mail appears as it arrives.
    </p>
    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

    <div class="fx-import__actions">
      <button v-if="info && info.status === 'failed'" class="fx-btn fx-btn--primary" @click="$router.push('/mailboxes')">Go to Mailboxes</button>
      <button v-else-if="done" class="fx-btn fx-btn--primary" @click="$router.push(next.path)">{{ next.label }}</button>
      <button v-else class="fx-btn fx-btn--ghost" @click="$router.push(next.path)">Continue to {{ next.label.replace('Open ', '') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";

/** The loading screen after Outlook is connected: imports the last month, a few pages per call, until done. */
export default {
  name: "MailboxImport",
  data: () => ({ info: null, error: null, stopped: false }),
  computed: {
    ...mapGetters(["designation"]),
    done() { return this.info && this.info.status === "completed"; },
    title() { return this.done ? "Your mail is in" : "Bringing in your last month of mail"; },
    percent() {
      if (this.done) return 100;
      if (!this.info || !this.info.estimate) return 35;
      return Math.min(99, Math.round((this.info.processed / this.info.estimate) * 100));
    },
    since() { return new Date(this.info.from).toLocaleDateString(undefined, { day: "numeric", month: "long" }); },
    /** Accounts has no Inbox; everyone else goes to it. */
    next() {
      return this.designation === "accounts" ? { path: "/", label: "Open the app" } : { path: "/inbox", label: "Open Inbox" };
    },
  },
  created() { this.step(); },
  beforeDestroy() { this.stopped = true; },
  methods: {
    step() {
      ApiService.post("/user/mailboxes/" + this.$route.params.id + "/import")
        .then(({ data }) => {
          this.info = data;
          this.error = data.error ? "Microsoft answered: " + data.error + " — trying again." : null;
          if (!this.stopped && ["pending", "running"].includes(data.status)) {
            setTimeout(() => this.step(), data.error ? 5000 : 300);
          }
        })
        .catch((e) => {
          this.error = (e.response && e.response.data && e.response.data.error) || "Could not reach the server.";
        });
    },
  },
};
</script>
