<template>
  <div class="fx-mailbox-settings">
    <header v-if="!embedded" class="fx-page-head">
      <h1 class="fx-page-title">Mailboxes</h1>
      <p class="fx-page-sub">
        Connect the mailbox your clients write to. Messages appear in the Inbox; nothing is
        sent without you asking.
      </p>
    </header>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!--
        Your name as CLIENTS read it: the automated updates say who is looking after a shipment, and accounts are
        created by F16s with whatever was typed then (user, 2026-09-16).
      -->
      <section class="fx-section">
        <h2 class="fx-section__title">Your name</h2>
        <p class="fx-muted">
          Clients see this on the automated updates — “{{ myName || "your name" }} from our operations team will be
          taking care of it”.
        </p>
        <label class="fx-field">
          <span class="fx-field__label">Name</span>
          <input v-model="myName" class="fx-input" type="text" maxlength="100" />
        </label>
        <button class="fx-btn" :disabled="busy === 'name' || !myName.trim()" @click="saveName">
          {{ busy === "name" ? "Saving…" : "Save name" }}
        </button>
        <p v-if="nameSaved" class="fx-muted">Saved.</p>
      </section>

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
                  :disabled="busy === c.id || !canSync(c)"
                  :title="canSync(c) ? 'Fetch new mail now' : 'Gmail ingestion is not built yet'"
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

      <!--
        🔴 SIGNATURES (PRD §5.2.4): per mailbox, because a user with two accounts usually needs
        two, and your own as the fallback. Edited HERE, not in the reply box, so it cannot be
        mangled per message. Outlook has no signature API, so pasting it in is the main path.
      -->
      <section class="fx-section">
        <h2 class="fx-section__title">Signatures</h2>
        <p class="fx-muted">
          Copy your signature from Outlook and paste it in. Replies from a mailbox carry its
          signature when “Add signature” is on; a mailbox without one uses yours.
        </p>

        <div v-for="c in activeConnections" :key="'sig-' + c.id" class="fx-signature">
          <h3 class="fx-signature__title">
            {{ c.email_address }}
            <span v-if="c.signature_source" class="fx-muted"> · {{ c.signature_source }}</span>
          </h3>
          <MailEditor
            data-help="mailbox-signature"
            :value="signatures[c.id] || ''"
            @input="$set(signatures, c.id, $event)"
            @paste="$set(pastedInto, c.id, true)"
          />
          <button class="fx-btn" :disabled="busy === 'sig-' + c.id" @click="saveSignature(c)">
            {{ busy === 'sig-' + c.id ? "Saving…" : "Save signature" }}
          </button>
          <span v-if="saved === 'sig-' + c.id" class="fx-muted"> Saved.</span>

          <!-- A picture under the signature: a logo or a scanned sign (user, 2026-09-17). -->
          <div class="fx-signature__image">
            <span class="fx-field__label">Signature image</span>
            <img v-if="c.signature_image" :src="c.signature_image" alt="Signature image" class="fx-signature__preview" />
            <p v-else class="fx-muted">No image. PNG, JPG or GIF, up to 500 KB — shown up to 240 px wide under the signature.</p>
            <div class="fx-signature__image-actions">
              <button type="button" class="fx-btn" :disabled="busy === 'img-' + c.id" @click="$refs['imagePicker' + c.id][0].click()">
                {{ busy === 'img-' + c.id ? "Uploading…" : (c.signature_image ? "Replace image" : "Add image") }}
              </button>
              <input :ref="'imagePicker' + c.id" type="file" accept="image/png,image/jpeg,image/gif" class="fx-drop__input" @change="uploadImage(c, $event)" />
              <button v-if="c.signature_image" type="button" class="fx-btn fx-btn--ghost" :disabled="busy === 'img-' + c.id" @click="removeImage(c)">Remove image</button>
            </div>
          </div>
        </div>

        <label class="fx-field fx-signature">
          <span class="fx-signature__title">Your own signature (when a mailbox has none)</span>
          <textarea v-model="mySignature" class="fx-input fx-signature__text" rows="3"></textarea>
        </label>
        <button class="fx-btn" :disabled="busy === 'mine'" @click="saveMySignature">
          {{ busy === 'mine' ? "Saving…" : "Save" }}
        </button>
        <span v-if="saved === 'mine'" class="fx-muted"> Saved.</span>
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

        <button class="fx-btn fx-btn--primary" :disabled="connecting" data-help="connect-outlook" @click="connect('outlook')">
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
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "MailboxSettings",
  components: { MailEditor, StatusChip },
  /** Shown inside Settings, under Settings' own heading (user, 2026-09-17: no separate page). */
  props: { embedded: { type: Boolean, default: false } },
  data: () => ({
    loading: true, error: null, connectError: null,
    connections: [], connecting: false, busy: null,
    /** mailbox id -> signature HTML being edited. */
    signatures: {},
    /** mailbox id -> true once something was pasted into its editor. */
    pastedInto: {},
    mySignature: "",
    saved: null,
    /** Your own name, as clients read it on the automated updates. */
    myName: "", nameSaved: false,
  }),
  computed: {
    activeConnections() {
      return this.connections.filter((c) => !c.disconnected_at);
    },
  },
  created() {
    this.load();
    ApiService.get("/me").then(({ data }) => { this.myName = (data.profile && data.profile.name) || ""; }).catch(() => {});
  },
  methods: {
    load() {
      ApiService.get("/user/mailboxes")
        .then(({ data }) => {
          this.connections = data.connections || [];
          this.connections.forEach((c) => this.$set(this.signatures, c.id, c.signature_html || ""));
          this.mySignature = data.my_signature || "";
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    saveSignature(c) {
      this.busy = "sig-" + c.id;
      this.saved = null;

      ApiService.put("/user/mailboxes/" + c.id + "/signature", {
        signature_html: this.signatures[c.id] || "",
        signature_source: this.pastedInto[c.id] ? "pasted" : "manual",
      })
        .then(({ data }) => {
          c.signature_source = data.signature_source;
          this.$set(this.signatures, c.id, data.signature_html || "");
          this.saved = "sig-" + c.id;
        })
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    uploadImage(c, event) {
      const file = event.target.files[0];
      event.target.value = "";
      if (!file) return;

      const form = new FormData();
      form.append("image", file);
      this.busy = "img-" + c.id;
      this.connectError = null;
      ApiService.post("/user/mailboxes/" + c.id + "/signature-image", form)
        .then(({ data }) => { this.$set(c, "signature_image", data.signature_image); })
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    removeImage(c) {
      this.busy = "img-" + c.id;
      ApiService.delete("/user/mailboxes/" + c.id + "/signature-image")
        .then(() => { this.$set(c, "signature_image", null); })
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    saveName() {
      this.busy = "name";
      this.nameSaved = false;

      ApiService.put("/user/profile", { name: this.myName })
        .then(({ data }) => {
          this.myName = data.name;
          this.nameSaved = true;
          window.dispatchEvent(new Event("f16s:profile-updated"));
        })
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    saveMySignature() {
      this.busy = "mine";
      this.saved = null;

      ApiService.put("/user/signature", { signature_text: this.mySignature })
        .then(() => { this.saved = "mine"; })
        .catch((e) => { this.connectError = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    providerLabel(p) {
      /* ⚠️ A raw `gmail` in the column looked like a rendering bug the first time this
         screen was opened against seeded data. Every provider gets a real name, and one
         that has no ingestion yet says so where it is read. */
      if (p === "outlook" || p === "microsoft") return "Microsoft 365";
      if (p === "gmail" || p === "google") return "Gmail (not syncing yet)";
      return p;
    },
    /* Gmail connections exist in seeded data but cannot sync — GAPS #15. Offering the
       button anyway means the only way to learn that is to press it and read an error. */
    canSync(c) {
      return c.provider === "outlook" || c.provider === "microsoft";
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
