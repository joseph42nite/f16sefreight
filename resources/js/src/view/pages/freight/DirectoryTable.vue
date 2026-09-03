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

    <button
      v-if="endpoint === '/partners'"
      class="fx-btn fx-btn--primary fx-dir__add"
      @click="adding = !adding"
    >{{ adding ? "Cancel" : "Add partner" }}</button>

    <!--
      🔴 A partner belongs to THIS BRANCH, because a GSTIN is a state registration: the
      same broker is a different registration in Maharashtra and in Tamil Nadu. That is why
      the form exists per branch rather than once per company.
    -->
    <section v-if="adding && endpoint === '/partners'" class="fx-section fx-dir__form">
      <!--
        📇 Copy from a sibling branch. The name and address of a broker your Chennai desk
        already uses are the same ones you would retype — but the TAX NUMBERS are not, so
        they deliberately do not come across.
      -->
      <label class="fx-field">
        <span class="fx-field__label">Already used by another branch</span>
        <select class="fx-input" :value="''" @change="copySibling($event.target.value)">
          <option value="">Start from blank…</option>
          <option v-for="p in siblings" :key="p.id" :value="p.id">
            {{ p.name }} · {{ p.partner_type.replace(/_/g, " ") }}
          </option>
        </select>
      </label>

      <div class="fx-dir__grid">
        <label class="fx-field">
          <span class="fx-field__label">Name</span>
          <input v-model="form.name" class="fx-input" />
        </label>

        <label class="fx-field">
          <span class="fx-field__label">Type</span>
          <select v-model="form.partner_type" class="fx-input">
            <option v-for="t in types" :key="t" :value="t">{{ t.replace(/_/g, " ") }}</option>
          </select>
        </label>

        <label class="fx-field">
          <span class="fx-field__label">Email</span>
          <input v-model="form.email" class="fx-input" type="email" />
        </label>

        <label class="fx-field">
          <span class="fx-field__label">Phone</span>
          <input v-model="form.phone" class="fx-input" />
        </label>

        <label class="fx-field">
          <!-- ⚠️ The reason this record is per branch. A copied partner arrives without
               one, because the other branch's number is another state's registration. -->
          <span class="fx-field__label">GSTIN (this state)</span>
          <input v-model="form.gst_no" class="fx-input" />
        </label>

        <label class="fx-field">
          <span class="fx-field__label">PAN</span>
          <input v-model="form.pan_no" class="fx-input" />
        </label>
      </div>

      <label class="fx-field">
        <span class="fx-field__label">Address</span>
        <input v-model="form.address" class="fx-input" />
      </label>

      <p v-if="copied" class="fx-muted">
        Copied from another branch — <strong>enter this branch's own GSTIN</strong>; the
        other branch's is a different state registration.
      </p>

      <p v-if="saveError" class="fx-error" role="alert">{{ saveError }}</p>

      <button class="fx-btn fx-btn--primary" :disabled="saving || !form.name" @click="save">
        {{ saving ? "Saving…" : "Save partner" }}
      </button>
    </section>

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
  data: () => ({
    rows: [], types: [], loading: true, error: null, query: "", type: "", timer: null,
    adding: false, saving: false, saveError: null, copied: false, siblings: [],
    form: { name: "", partner_type: "customs_broker", email: "", phone: "", address: "", gst_no: "", pan_no: "" },
  }),
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

      /* What sibling branches already have, for the copy picker. Optional in the same
         way — a picker that cannot load costs a retype, not the ability to add. */
      ApiService.get("/partners/siblings")
        .then(({ data }) => { this.siblings = data.partners || []; })
        .catch(() => { this.siblings = []; });
    }
  },
  methods: {
    /**
     * Copy a sibling branch's partner — everything EXCEPT the tax numbers.
     *
     * 🔴 `gst_no` and `pan_no` are deliberately left blank. The other branch's GSTIN is
     * another state's registration; carrying it across is exactly the error that made
     * partners branch-scoped in the first place, and it would be invisible until a
     * purchase voucher claimed input credit under the wrong number.
     */
    copySibling(id) {
      const source = this.siblings.find((p) => String(p.id) === String(id));

      if (!source) {
        this.copied = false;
        return;
      }

      this.form = {
        name: source.name,
        partner_type: source.partner_type,
        email: source.email || "",
        phone: source.phone || "",
        address: source.address || "",
        gst_no: "",
        pan_no: "",
      };

      this.copied = true;
    },
    save() {
      this.saving = true;
      this.saveError = null;

      ApiService.post("/partners", this.form)
        .then(() => {
          this.adding = false;
          this.copied = false;
          this.form = { name: "", partner_type: "customs_broker", email: "", phone: "",
                        address: "", gst_no: "", pan_no: "" };
          this.load();
        })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.saveError = d.errors
            ? Object.values(d.errors).flat().join(" ")
            : (d.error || d.message || "Could not save.");
        })
        .finally(() => { this.saving = false; });
    },
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
