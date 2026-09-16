<template>
  <!--
    An automated client update, shown before it goes (user, 2026-09-16). The wording comes from a fixed template and
    every field can be changed; nothing reaches the client until someone presses send.
  -->
  <div class="fx-update">
    <label class="fx-update__field">
      <span class="fx-muted">To</span>
      <input v-model="to" class="fx-input" type="text" />
    </label>
    <label class="fx-update__field">
      <span class="fx-muted">Subject</span>
      <input v-model="subject" class="fx-input" type="text" />
    </label>
    <textarea v-model="body" class="fx-input fx-update__body" rows="8" aria-label="Message"></textarea>
    <p v-if="draft.attachment" class="fx-muted">📎 {{ draft.attachment }} is attached.</p>
    <p v-if="hasReviewLink" class="fx-muted">The secure review link is made when you send.</p>
    <!-- The booking date and the airline are typed in by the person sending (user, 2026-09-16). -->
    <p v-if="blanks.length" class="fx-error">Fill in the {{ blanks.join(" and ") }} — the mail still says {{ blanks.map((b) => "[" + b + "]").join(" and ") }}.</p>
    <p class="fx-muted">Your signature is added below the message.</p>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

    <div class="fx-update__actions">
      <button class="fx-btn fx-btn--primary" :disabled="busy || !to.trim() || blanks.length > 0" @click="$emit('send', values())">{{ sendLabel }}</button>
      <button class="fx-btn" :disabled="busy" @click="$emit('skip')">{{ skipLabel }}</button>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "ClientUpdateEditor",
  props: {
    draft: { type: Object, required: true },
    busy: { type: Boolean, default: false },
    error: { type: String, default: null },
    sendLabel: { type: String, default: "Send to client" },
    skipLabel: { type: String, default: "Skip" },
  },
  data() {
    return {
      to: (this.draft.to || []).join(", "),
      subject: this.draft.subject || "",
      body: this.draft.body || "",
    };
  },
  computed: {
    hasReviewLink() {
      return this.body.indexOf("[review link]") !== -1;
    },
    /** Blanks still to fill in. Mirrors the server, which refuses a mail that carries one. */
    blanks() {
      return ["date", "airline"].filter((b) => this.body.indexOf("[" + b + "]") !== -1);
    },
  },
  methods: {
    values() {
      return {
        to: this.to.split(",").map((s) => s.trim()).filter(Boolean),
        subject: this.subject,
        body: this.body,
      };
    },
  },
};
</script>

<style scoped>
.fx-update { display: grid; gap: 8px; }
.fx-update__field { display: grid; grid-template-columns: 64px 1fr; align-items: center; gap: 8px; }
.fx-update__body { width: 100%; font: inherit; resize: vertical; }
.fx-update__actions { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
