<template>
  <section v-if="mail" class="fx-section" aria-labelledby="invoice-mail-title">
    <h3 id="invoice-mail-title" class="fx-section__title">Mail to the client's accounts</h3>

    <template v-if="mail.state === 'waiting'">
      <p class="fx-muted">Drafted when this was finalized. Read it, change anything, then send it from your Outlook with the bill attached — or skip it.</p>
      <label class="fx-field"><span class="fx-field__label">To</span>
        <RecipientInput v-model="to" /></label>
      <label class="fx-field"><span class="fx-field__label">CC</span>
        <RecipientInput v-model="cc" /></label>
      <label class="fx-field"><span class="fx-field__label">Subject</span>
        <input v-model="subject" class="fx-input" /></label>
      <label class="fx-field"><span class="fx-field__label">Message</span>
        <textarea v-model="body" class="fx-input" rows="7"></textarea></label>
      <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
      <div class="fx-toolbar">
        <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="decide('skip')">Skip</button>
        <button class="fx-btn fx-btn--primary" :disabled="busy || !list(to).length" @click="decide('send')">Send with the bill</button>
      </div>
    </template>

    <p v-else class="fx-muted">
      {{ mail.state === "sent" ? "Sent" : "Skipped" }}{{ mail.by_name ? " by " + mail.by_name : "" }}:
      “{{ mail.subject }}”{{ mail.state === "sent" ? " to " + (mail.to || []).join(", ") : "" }}.
    </p>
  </section>
</template>

<script>
import RecipientInput from "@/view/pages/freight/components/RecipientInput.vue";

/**
 * The invoice mail to the client's accounts (owner, 2026-10-10). Finalizing drafts it; nothing goes until accounts
 * sends it here. The parent posts the decision (`/billing/{id}/client-mail`) and passes the answer back as `mail`.
 */
export default {
  name: "InvoiceMailCard",
  components: { RecipientInput },
  props: {
    mail: { type: Object, default: null },
    busy: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
  data: () => ({ to: "", cc: "", subject: "", body: "" }),
  watch: {
    mail: {
      immediate: true,
      handler(mail) {
        if (!mail) return;
        this.to = (mail.to || []).join(", ");
        this.cc = (mail.cc || []).join(", ");
        this.subject = mail.subject || "";
        this.body = mail.body || "";
      },
    },
  },
  methods: {
    list(text) {
      return String(text || "").split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    },
    decide(decision) {
      this.$emit("decide", decision === "skip" ? { decision } : {
        decision, to: this.list(this.to), cc: this.list(this.cc), subject: this.subject, body: this.body,
      });
    },
  },
};
</script>
