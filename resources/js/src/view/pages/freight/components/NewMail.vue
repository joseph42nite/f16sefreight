<template>
  <div class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="new-mail-title">
    <div class="fx-modal__panel">
      <header class="fx-modal__head">
        <h2 id="new-mail-title" class="fx-modal__title">New mail</h2>
        <button class="fx-btn fx-btn--ghost" aria-label="Close" :disabled="sending" @click="$emit('close')">✕</button>
      </header>

      <div class="fx-modal__body fx-newmail">
        <p v-if="sentFrom" class="fx-newmail__sent" role="status">
          Sent from {{ sentFrom }}. It appears in the list within about 2 minutes, once your mailbox syncs it back.
        </p>

        <template v-else>
          <label class="fx-field" for="new-mail-to">
            <span class="fx-field__label">To</span>
            <input id="new-mail-to" v-model="to" class="fx-input" placeholder="comma separated" />
          </label>
          <label class="fx-field" for="new-mail-cc">
            <span class="fx-field__label">Cc</span>
            <input id="new-mail-cc" v-model="cc" class="fx-input" placeholder="comma separated" />
          </label>
          <label class="fx-field" for="new-mail-subject">
            <span class="fx-field__label">Subject</span>
            <input id="new-mail-subject" v-model="subject" class="fx-input" />
          </label>
          <MailEditor v-model="body" />

          <label class="fx-checkbox" for="new-mail-signature">
            <input id="new-mail-signature" v-model="includeSignature" type="checkbox" />
            <span>Add my signature</span>
          </label>

          <div class="fx-compose__attach">
            <button type="button" class="fx-btn" :disabled="sending" @click="$refs.picker.click()">📎 Attach files</button>
            <input ref="picker" type="file" multiple class="fx-drop__input" @change="attach" />
          </div>
          <ul v-if="files.length" class="fx-attachments">
            <li v-for="(f, i) in files" :key="i + f.name" class="fx-attachment">
              <span class="fx-attachment__open">📎 {{ f.name }}</span>
              <button type="button" class="fx-btn fx-btn--ghost" :aria-label="'Remove ' + f.name" :disabled="sending" @click="files.splice(i, 1)">✕</button>
            </li>
          </ul>
          <p v-if="tooBig" class="fx-error" role="alert">The attachments come to more than 25 MB, the most a mail can carry.</p>
          <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
        </template>
      </div>

      <footer class="fx-modal__foot">
        <template v-if="sentFrom">
          <button class="fx-btn fx-btn--primary" @click="$emit('close')">Done</button>
        </template>
        <template v-else>
          <button class="fx-btn" :disabled="sending" @click="$emit('close')">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="sending || !to.trim() || !subject.trim() || !body || tooBig" @click="send">
            {{ sending ? "Sending…" : "Send" }}
          </button>
        </template>
      </footer>
    </div>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";

/** Start a new mail from the inbox, sent from the person's own Outlook (user, 2026-09-17). */
export default {
  name: "NewMail",
  components: { MailEditor },
  data: () => ({
    to: "", cc: "", subject: "", body: "", includeSignature: true, files: [],
    sending: false, error: null, sentFrom: null,
  }),
  computed: {
    tooBig() { return this.files.reduce((sum, f) => sum + f.size, 0) > 25 * 1024 * 1024; },
  },
  methods: {
    attach(e) {
      this.files.push(...e.target.files);
      e.target.value = "";
    },
    send() {
      const split = (v) => v.split(",").map((a) => a.trim()).filter(Boolean);
      const form = new FormData();
      split(this.to).forEach((a) => form.append("to[]", a));
      split(this.cc).forEach((a) => form.append("cc[]", a));
      form.append("subject", this.subject);
      form.append("body", this.body);
      form.append("include_signature", this.includeSignature ? "1" : "0");
      this.files.forEach((f) => form.append("files[]", f));

      this.sending = true;
      this.error = null;
      ApiService.post("/inbox/compose", form)
        .then(({ data }) => { this.sentFrom = data.from; })
        .catch((e) => {
          const d = e.response && e.response.data;
          const invalid = d && d.errors && Object.values(d.errors)[0];
          this.error = (invalid && invalid[0]) || (d && d.error) || "The mail could not be sent.";
        })
        .finally(() => { this.sending = false; });
    },
  },
};
</script>
