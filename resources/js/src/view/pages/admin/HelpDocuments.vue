<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Help documents</h1>
      <p class="fx-page-sub">
        What the portal's help assistant answers from. Upload one .md or .docx per page; uploading a
        file again replaces that document. Use headings for each task — the assistant finds the section.
      </p>
    </header>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

    <section class="fx-section">
      <h2 class="fx-section__title">{{ replacing ? "Replace “" + replacing.title + "”" : "Upload a document" }}</h2>
      <div class="fx-ai-settings">
        <label class="fx-field">
          <span class="fx-field__label">Title</span>
          <input v-model="form.title" class="fx-input" maxlength="150" placeholder="Inbox" />
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Page (portal path)</span>
          <input v-model="form.route" class="fx-input" maxlength="150" placeholder="/inbox" />
        </label>
        <label class="fx-field">
          <span class="fx-field__label">File (.md or .docx)</span>
          <input ref="file" type="file" accept=".md,.markdown,.docx" class="fx-input" @change="form.file = $event.target.files[0] || null" />
        </label>
      </div>
      <button class="fx-btn fx-btn--primary" :disabled="busy || !form.file || !form.title.trim()" @click="upload">
        {{ busy ? "Uploading and indexing…" : replacing ? "Replace" : "Upload" }}
      </button>
      <button v-if="replacing" class="fx-btn" :disabled="busy" @click="resetForm">Cancel</button>
    </section>

    <section class="fx-section">
      <h2 class="fx-section__title">Library</h2>
      <p v-if="!documents.length" class="fx-muted">No documents yet — the assistant will say it cannot help until there are.</p>
      <table v-else class="fx-table">
        <thead>
          <tr><th scope="col">Title</th><th scope="col">Page</th><th scope="col">File</th><th scope="col" class="fx-num">Sections</th><th scope="col">State</th><th scope="col"><span class="fx-sr-only">Actions</span></th></tr>
        </thead>
        <tbody>
          <tr v-for="d in documents" :key="d.id">
            <td>{{ d.title }}</td>
            <td class="identifier">{{ d.route || "—" }}</td>
            <td>{{ d.filename }}</td>
            <td class="fx-num">{{ d.chunk_count }}</td>
            <td>
              <StatusChip :value="d.status === 'indexed' ? 'indexed' : 'not indexed'" />
              <span v-if="d.error" class="fx-muted"> {{ d.error }}</span>
            </td>
            <td class="fx-num">
              <button class="fx-btn fx-btn--ghost" @click="startReplace(d)">Replace</button>
              <button class="fx-btn fx-btn--ghost" @click="remove(d)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="fx-section">
      <h2 class="fx-section__title">Questions it could not answer (last 30 days)</h2>
      <p class="fx-muted">Each is a page or a task the library does not cover yet.</p>
      <p v-if="!unanswered.length" class="fx-muted">None.</p>
      <table v-else class="fx-table">
        <thead><tr><th scope="col">Asked on</th><th scope="col">Question</th><th scope="col" class="fx-num">Closest match</th></tr></thead>
        <tbody>
          <tr v-for="q in unanswered" :key="q.id">
            <td class="identifier">{{ q.route || "—" }}</td>
            <td>{{ q.question }}</td>
            <td class="fx-num">{{ q.best_score === null ? "—" : Number(q.best_score).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!--
      🔴 The names a document may use for guided steps. Written as [[name]] in the text, e.g.
      "[[save-draft]] Click Save as draft", and the assistant highlights that control.
    -->
    <section class="fx-section">
      <h2 class="fx-section__title">Controls a document can point at</h2>
      <p class="fx-muted">Write <code>[[name]]</code> next to the step, e.g. <code>[[save-draft]] Click Save as draft</code>. Any other name is ignored.</p>
      <table class="fx-table">
        <thead><tr><th scope="col">Name</th><th scope="col">Page</th><th scope="col">What it is</th></tr></thead>
        <tbody>
          <tr v-for="t in HELP_TARGETS" :key="t.name">
            <td class="identifier">[[{{ t.name }}]]</td><td class="identifier">{{ t.page || "every page" }}</td><td>{{ t.label }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import { HELP_TARGETS } from "@/core/config/helpTargets";

export default {
  name: "HelpDocuments",
  components: { StatusChip },
  data: () => ({
    HELP_TARGETS, documents: [], unanswered: [], error: null, busy: false, replacing: null,
    form: { title: "", route: "", file: null },
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      ApiService.get("/superadmin/help-documents")
        .then(({ data }) => { this.documents = data.documents || []; this.unanswered = data.unanswered || []; })
        .catch((e) => { this.error = this.readable(e); });
    },
    upload() {
      const body = new FormData();
      body.append("title", this.form.title.trim());
      if (this.form.route.trim()) body.append("route", this.form.route.trim());
      body.append("file", this.form.file);

      this.busy = true;
      this.error = null;

      const url = this.replacing ? "/superadmin/help-documents/" + this.replacing.id : "/superadmin/help-documents";

      ApiService.post(url, body)
        .then(() => { this.resetForm(); this.load(); })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    startReplace(d) {
      this.replacing = d;
      this.form = { title: d.title, route: d.route || "", file: null };
      if (this.$refs.file) this.$refs.file.value = "";
    },
    resetForm() {
      this.replacing = null;
      this.form = { title: "", route: "", file: null };
      if (this.$refs.file) this.$refs.file.value = "";
    },
    remove(d) {
      if (!window.confirm("Delete “" + d.title + "”? The assistant stops answering from it.")) return;

      ApiService.delete("/superadmin/help-documents/" + d.id)
        .then(() => this.load())
        .catch((e) => { this.error = this.readable(e); });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      const first = d.errors && Object.values(d.errors)[0];
      return (first && first[0]) || d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
