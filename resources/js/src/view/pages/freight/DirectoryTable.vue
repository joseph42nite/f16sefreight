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

        <!-- Tax numbers only where there are accounts to use them (Command) — never on Tactical. -->
        <template v-if="withAccounts">
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
        </template>
      </div>

      <label class="fx-field">
        <span class="fx-field__label">Address</span>
        <input v-model="form.address" class="fx-input" />
      </label>

      <p v-if="copied && withAccounts" class="fx-muted">
        Copied from another branch — <strong>enter this branch's own GSTIN</strong>; the
        other branch's is a different state registration.
      </p>

      <p v-if="saveError" class="fx-error" role="alert">{{ saveError }}</p>

      <button class="fx-btn fx-btn--primary" :disabled="saving || !form.name" @click="save">
        {{ saving ? "Saving…" : "Save partner" }}
      </button>
    </section>

    <!--
      Clients: add one, or write in and correct its details (user, 2026-09-16). On Tactical there are no accounts, so
      no GSTIN, PAN, terms or credit limit — the domain is what is known, and the name is written in here.
    -->
    <button
      v-if="endpoint === '/customers' && canEditClients && !client"
      class="fx-btn fx-btn--primary fx-dir__add"
      @click="editClient(null)"
    >Add client</button>

    <section v-if="client" class="fx-section fx-dir__form">
      <div class="fx-dir__grid">
        <label class="fx-field">
          <span class="fx-field__label">Name</span>
          <input v-model="client.name" class="fx-input" />
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Email domain</span>
          <input v-model="client.email_domain" class="fx-input" placeholder="client.com" />
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Email</span>
          <input v-model="client.email" class="fx-input" type="email" />
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Phone</span>
          <input v-model="client.phone" class="fx-input" />
        </label>
        <template v-if="withAccounts">
          <label class="fx-field">
            <span class="fx-field__label">GSTIN</span>
            <input v-model="client.gst_no" class="fx-input" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">PAN</span>
            <input v-model="client.pan_no" class="fx-input" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Terms (days)</span>
            <input v-model="client.payment_terms_days" class="fx-input" type="number" min="0" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Credit limit (₹)</span>
            <input v-model="client.credit_limit" class="fx-input" type="number" min="0" />
          </label>
        </template>
      </div>
      <label class="fx-field">
        <span class="fx-field__label">Address</span>
        <input v-model="client.address" class="fx-input" />
      </label>

      <!-- Every address the client has written from on this domain, saved as mail arrives. -->
      <div v-if="client.id" class="fx-field">
        <span class="fx-field__label">Mail addresses from this domain</span>
        <p v-if="!contacts.length" class="fx-muted">None yet — they are saved as mail arrives from the domain.</p>
        <table v-else class="fx-table">
          <thead><tr><th scope="col">Address</th><th scope="col" class="fx-num">Mails</th><th scope="col">Last mail</th></tr></thead>
          <tbody>
            <tr v-for="c in contacts" :key="c.id">
              <td>{{ c.email }}</td>
              <td class="fx-num">{{ c.message_count }}</td>
              <td><Figure :value="c.last_seen_at" kind="dateTime" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="saveError" class="fx-error" role="alert">{{ saveError }}</p>
      <div class="fx-toolbar">
        <button class="fx-btn fx-btn--primary" :disabled="saving || !client.name" @click="saveClient">
          {{ saving ? "Saving…" : client.id ? "Save changes" : "Add client" }}
        </button>
        <button class="fx-btn fx-btn--ghost" :disabled="saving" @click="client = null">Cancel</button>
      </div>
    </section>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!rows.length" class="fx-muted">Nothing matches.</p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key" :class="{ 'fx-num': c.numeric }" scope="col">{{ c.label }}</th>
          <th v-if="(endpoint === '/customers' && canEditClients) || (endpoint === '/partners' && canManageTds)" scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="c in columns" :key="c.key" :class="[{ 'fx-num': c.numeric }, c.mono ? 'identifier' : '']">
            <template v-if="c.key === 'tds_section' && tdsEditing === row.id">
              <select v-model="tdsForm.tds_section" class="fx-input">
                <option value="">None</option>
                <option v-for="s in tdsSectionOptions" :key="s.section" :value="s.section">
                  {{ s.section }} — {{ s.description }}
                </option>
              </select>
            </template>
            <template v-else-if="c.key === 'tds_rate_override' && tdsEditing === row.id">
              <input v-model.number="tdsForm.tds_rate_override" class="fx-input" type="number" step="0.01" min="0" max="100" placeholder="s.197 rate, if any" />
            </template>
            <template v-else>
              <Figure v-if="c.kind" :value="row[c.key]" :kind="c.kind" :currency-code="c.kind === 'currency' ? 'INR' : null" />
              <span v-else-if="row[c.key] !== null && row[c.key] !== undefined && row[c.key] !== ''">{{ row[c.key] }}</span>
              <!-- §4.1 NULL is not zero, and an absent value is not an empty string. -->
              <span v-else class="is-empty" aria-label="Not recorded"></span>
            </template>
          </td>
          <td v-if="endpoint === '/customers' && canEditClients" class="fx-row-actions">
            <button class="fx-btn fx-btn--ghost" @click="editClient(row)">Edit</button>
          </td>
          <td v-else-if="endpoint === '/partners' && canManageTds" class="fx-row-actions">
            <template v-if="tdsEditing === row.id">
              <button class="fx-btn fx-btn--primary" :disabled="tdsSaving" @click="saveTds(row)">Save</button>
              <button class="fx-btn fx-btn--ghost" @click="tdsEditing = null">Cancel</button>
            </template>
            <button v-else class="fx-btn fx-btn--ghost" @click="editTds(row)">Edit TDS</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="tdsError" class="fx-error" role="alert">{{ tdsError }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

const SHAPES = {
  "/customers": {
    title: "Customers",
    subtitle:
      "Shared across every branch of this tenant. A client with several branches is several rows sharing one email domain — that pair is the group key.",
    searchPlaceholder: "Name or domain…",
    columns: [
      { key: "name", label: "Name" },
      { key: "email_domain", label: "Domain", mono: true },
      { key: "branch", label: "Branch", bossOnly: true },
      { key: "contacts_count", label: "Mail addresses", numeric: true, kind: "count" },
      { key: "gst_no", label: "GSTIN", mono: true, accounts: true },
      { key: "payment_terms_days", label: "Terms (days)", numeric: true, kind: "count", accounts: true },
      { key: "credit_limit", label: "Credit limit", numeric: true, kind: "currency", accounts: true },
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
      { key: "branch", label: "Branch", bossOnly: true },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone", mono: true },
      // Accounts figures — Command only, as for clients: the server does not send them on Tactical at all.
      { key: "gst_no", label: "GSTIN", mono: true, accounts: true },
      { key: "tds_section", label: "TDS section", mono: true, accounts: true },
      { key: "tds_rate_override", label: "s.197 rate %", numeric: true, accounts: true },
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
    /* The client being added or edited, and whether this company has accounts (Command) — the server says. */
    client: null, withAccounts: false, contacts: [],
    form: { name: "", partner_type: "customs_broker", email: "", phone: "", address: "", gst_no: "", pan_no: "" },
    /** Which vendor's TDS classification is being edited (user, 2026-09-25). */
    tdsEditing: null, tdsSaving: false, tdsError: null,
    tdsForm: { tds_section: "", tds_rate_override: null },
    /* Each branch's own active TDS sections, keyed by agent_id — a vendor is deducted under a section
       THAT BRANCH has a rate for, never a company-wide list a sibling branch happens to use. */
    tdsRatesByBranch: {}, tdsSectionOptions: [], tdsSectionsLoaded: false,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /** Mirrors the server's `editClients`. */
    canEditClients() {
      return ["pricing", "sales", "accounts", "boss"].indexOf(this.designation) !== -1;
    },
    /** Mirrors the server's `manageFinanceSettings` — the same desk that sets the rate table. */
    canManageTds() {
      return this.withAccounts && (this.designation === "accounts" || this.designation === "boss");
    },
    shape() {
      return SHAPES[this.endpoint];
    },
    title() { return this.shape.title; },
    subtitle() { return this.shape.subtitle; },
    columns() {
      return this.shape.columns
        .filter((c) => !c.accounts || this.withAccounts)
        // The Boss reads every branch's clients and partners, so he needs to see whose they are.
        .filter((c) => !c.bossOnly || this.designation === "boss");
    },
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
    /*
     * The TDS section picker's options — once, and only once the server has said this tier has accounts: whether a
     * partner can be classified at all is known from the list response, not at mount. `/finance-settings` is gated
     * like the button, so asking on Tactical, or as anyone but accounts and the Boss, would only 403.
     */
    loadTdsSections() {
      if (!this.canManageTds || this.tdsSectionsLoaded) return;
      this.tdsSectionsLoaded = true;

      ApiService.get("/finance-settings")
        .then(({ data }) => {
          const byBranch = {};
          (data.tds_rates || []).filter((r) => r.is_active).forEach((r) => {
            (byBranch[r.agent_id] = byBranch[r.agent_id] || []).push({ section: r.section, description: r.description });
          });
          this.tdsRatesByBranch = byBranch;
        })
        .catch(() => { this.tdsRatesByBranch = {}; });
    },
    editTds(row) {
      this.tdsEditing = row.id;
      this.tdsError = null;
      this.tdsForm = { tds_section: row.tds_section || "", tds_rate_override: row.tds_rate_override };

      // Options are this branch's own active rate table — not a company-wide list, and not a sibling
      // branch's. If the vendor already carries a section this branch has since deactivated or never had
      // (moved branch, rate retired), it stays visible and selected rather than silently blanking out.
      const options = (this.tdsRatesByBranch[row.agent_id] || []).slice();
      if (row.tds_section && !options.some((s) => s.section === row.tds_section)) {
        options.push({ section: row.tds_section, description: "not in this branch's current rate table" });
      }
      this.tdsSectionOptions = options;
    },
    saveTds(row) {
      this.tdsSaving = true;
      this.tdsError = null;
      const body = {
        tds_section: this.tdsForm.tds_section || null,
        tds_rate_override: this.tdsForm.tds_rate_override === "" ? null : this.tdsForm.tds_rate_override,
      };

      ApiService.post(`/partners/${row.id}/tds`, body)
        .then(({ data }) => {
          const i = this.rows.findIndex((r) => r.id === row.id);
          if (i !== -1) this.$set(this.rows, i, { ...this.rows[i], ...data });
          this.tdsEditing = null;
        })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.tdsError = d.errors ? Object.values(d.errors).flat().join(" ") : (d.error || d.message || "Could not save.");
        })
        .finally(() => { this.tdsSaving = false; });
    },
    editClient(row) {
      this.saveError = null;
      this.contacts = [];
      if (row) {
        ApiService.get("/customers/" + row.id + "/contacts").then(({ data }) => { this.contacts = data.contacts || []; }).catch(() => {});
      }
      this.client = row
        ? { ...row }
        : { name: "", email_domain: "", email: "", phone: "", address: "", gst_no: "", pan_no: "", payment_terms_days: "", credit_limit: "" };
    },
    saveClient() {
      this.saving = true;
      this.saveError = null;
      const fields = ["name", "email_domain", "email", "phone", "address"]
        .concat(this.withAccounts ? ["gst_no", "pan_no", "payment_terms_days", "credit_limit"] : []);
      const body = {};
      fields.forEach((f) => { body[f] = this.client[f] === "" ? null : this.client[f]; });

      const request = this.client.id
        ? ApiService.put("/customers/" + this.client.id, body)
        : ApiService.post("/customers", body);

      request
        .then(() => { this.client = null; this.load(); })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.saveError = d.errors ? Object.values(d.errors).flat().join(" ") : (d.error || d.message || "Could not save.");
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
        .then(({ data }) => {
          this.rows = data.data || [];
          this.withAccounts = !!data.with_accounts;
          this.error = null;
          if (this.endpoint === "/partners") this.loadTdsSections();
        })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.error = d.error || d.message || "Something went wrong.";
        })
        .finally(() => { this.loading = false; });
    },
  },
};
</script>
