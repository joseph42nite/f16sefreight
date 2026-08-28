<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">{{ title }}</h1>
      <p class="fx-page-sub">{{ subtitle }}</p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Search</span>
        <input
          v-model="query"
          class="fx-input"
          type="search"
          :placeholder="searchPlaceholder"
          @input="debouncedLoad"
        />
      </label>

      <label v-if="endpoint === '/partners'" class="fx-field">
        <span class="fx-field__label">Type</span>
        <select v-model="type" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="t in types" :key="t" :value="t">{{ t.replace(/_/g, ' ') }}</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!rows.length" class="fx-muted">Nothing matches.</p>

    <table v-else class="fx-table">
      <thead>
        <tr><th v-for="c in columns" :key="c.key" :class="{ 'fx-num': c.numeric }" scope="col">{{ c.label }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="c in columns" :key="c.key" :class="[{ 'fx-num': c.numeric }, c.mono ? 'identifier' : '']">
            <Figure v-if="c.kind" :value="row[c.key]" :kind="c.kind" :currency-code="c.kind === 'currency' ? 'INR' : null" />
            <span v-else-if="row[c.key]">{{ row[c.key] }}</span>
            <!-- §4.1 NULL is not zero, and an absent value is not an empty string. -->
            <span v-else class="is-empty" aria-label="Not recorded"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

const SHAPES = {
  "/customers": {
    title: "Customers",
    subtitle:
      "Shared across every branch of this tenant. A client with several branches is several rows sharing one email domain — that pair is the group key.",
    searchPlaceholder: "Name, domain or GSTIN…",
    columns: [
      { key: "name", label: "Name" },
      { key: "email_domain", label: "Domain", mono: true },
      { key: "gst_no", label: "GSTIN", mono: true },
      { key: "payment_terms_days", label: "Terms (days)", numeric: true, kind: "count" },
      { key: "credit_limit", label: "Credit limit", numeric: true, kind: "currency" },
    ],
  },
  "/partners": {
    title: "Partners",
    subtitle:
      "Carriers, brokers, transporters and vendors. One partner can act in several roles across shipments — the type here is only the primary classification.",
    searchPlaceholder: "Name…",
    columns: [
      { key: "name", label: "Name" },
      { key: "partner_type", label: "Type" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone", mono: true },
      { key: "gst_no", label: "GSTIN", mono: true },
    ],
  },
};

export default {
  name: "DirectoryTable",
  components: { Figure },
  props: { endpoint: { type: String, required: true } },
  data: () => ({ rows: [], types: [], loading: true, error: null, query: "", type: "", timer: null }),
  computed: {
    shape() {
      return SHAPES[this.endpoint];
    },
    title() { return this.shape.title; },
    subtitle() { return this.shape.subtitle; },
    columns() { return this.shape.columns; },
    searchPlaceholder() { return this.shape.searchPlaceholder; },
  },
  created() {
    this.load();
    if (this.endpoint === "/partners") {
      ApiService.get("/partner-types")
        .then(({ data }) => { this.types = data.types || []; })
        .catch(() => { /* the filter is optional; its absence must not break the list */ });
    }
  },
  methods: {
    /* Debounced so a search does not fire a request per keystroke. */
    debouncedLoad() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.load, 250);
    },
    load() {
      this.loading = true;
      const params = [];
      if (this.query) params.push("q=" + encodeURIComponent(this.query));
      if (this.type) params.push("type=" + encodeURIComponent(this.type));

      ApiService.get(this.endpoint + (params.length ? "?" + params.join("&") : ""))
        .then(({ data }) => { this.rows = data.data || []; this.error = null; })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.error = d.error || d.message || "Something went wrong.";
        })
        .finally(() => { this.loading = false; });
    },
  },
};
</script>
