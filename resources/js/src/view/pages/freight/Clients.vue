<template>
  <div>
    <!--
      The client book (user, 2026-09-20: "we have no place to show all the clients of all the branches, a full
      onboarding is done … a sales person is to be attached to it with a credit limit").
    -->
    <div class="fx-toolbar">
      <label v-if="options.branches.length > 1" class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="filters.branch_id" class="fx-input" @change="load">
          <option :value="null">Every branch</option>
          <option v-for="b in options.branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Salesperson</span>
        <select v-model="filters.sales_id" class="fx-input" @change="load">
          <option :value="null">Anyone</option>
          <option v-for="s in options.salespeople" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Search</span>
        <input v-model="filters.q" class="fx-input" placeholder="name, domain or GSTIN" @keyup.enter="load" />
      </label>
      <label class="fx-checkbox">
        <input v-model="filters.unassigned" type="checkbox" @change="load" />
        No salesperson
      </label>
      <label v-if="withAccounts" class="fx-checkbox">
        <input v-model="filters.no_limit" type="checkbox" @change="load" />
        No credit limit
      </label>
      <!-- The group IS the domain (PRD §2.2): one client with five branches is five rows sharing it. -->
      <label class="fx-checkbox">
        <input v-model="grouped" type="checkbox" />
        Group by client
      </label>
      <button v-if="canEdit" class="fx-btn fx-btn--primary" @click="openForm()">Onboard a client</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!rows.length" class="fx-muted">No client matches.</p>

    <template v-else>
      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Branch</th>
            <th scope="col">Salesperson</th>
            <th v-if="withAccounts" scope="col">GSTIN</th>
            <th v-if="withAccounts" class="fx-num" scope="col">Terms</th>
            <th v-if="withAccounts" class="fx-num" scope="col">Credit limit</th>
            <th v-if="withAccounts" class="fx-num" scope="col">Owed now</th>
            <th v-if="withAccounts" class="fx-num" scope="col">Left</th>
            <th scope="col">Contacts</th>
          </tr>
        </thead>
        <tbody v-for="group in groups" :key="group.key">
          <tr v-if="grouped" class="fx-row--quiet">
            <td :colspan="withAccounts ? 9 : 5">
              <strong>{{ group.key }}</strong>
              <span class="fx-muted"> · {{ group.rows.length }} billing entit{{ group.rows.length === 1 ? "y" : "ies" }}</span>
              <span v-if="withAccounts" class="fx-muted"> · owed {{ money(group.owed) }}</span>
            </td>
          </tr>
          <tr
            v-for="c in group.rows"
            :key="'c-' + c.id"
            class="is-clickable"
            :class="{ 'is-selected': selected && selected.id === c.id }"
            tabindex="0"
            @click="open(c)"
            @keydown.enter="open(c)"
          >
            <td>
              {{ c.name }}
              <span v-if="!grouped && c.email_domain" class="fx-muted"> · {{ c.email_domain }}</span>
            </td>
            <td>
              <span v-if="c.branch">{{ c.branch }}</span>
              <span v-else class="fx-muted">Not set</span>
            </td>
            <td>
              <span v-if="c.salesperson">{{ c.salesperson }}</span>
              <!-- ⚠️ Said, not blank: sales_id is the scoping key for the whole Command client book, so a client
                   with nobody on it is invisible in every rep's book. -->
              <span v-else class="fx-error">Nobody</span>
            </td>
            <td v-if="withAccounts" class="identifier">{{ c.gst_no || "—" }}</td>
            <td v-if="withAccounts" class="fx-num">{{ c.payment_terms_days }}d</td>
            <td v-if="withAccounts" class="fx-num">
              <Figure v-if="c.credit_limit !== null" :value="c.credit_limit" kind="currency" currency-code="INR" />
              <!-- 🔴 NULL is "not configured", never zero: zero blocks every shipment. -->
              <span v-else class="fx-muted">Not set</span>
            </td>
            <td v-if="withAccounts" class="fx-num"><Figure :value="c.exposure" kind="currency" currency-code="INR" /></td>
            <td v-if="withAccounts" class="fx-num">
              <template v-if="c.available !== null">
                <StatusChip v-if="c.on_hold" value="credit_hold" />
                <Figure v-else :value="c.available" kind="currency" currency-code="INR" />
              </template>
              <span v-else class="fx-muted">—</span>
            </td>
            <td class="fx-muted">{{ c.contacts_count }}</td>
          </tr>
        </tbody>
      </table>
      <p class="fx-muted">
        {{ total }} client(s) across {{ options.branches.length }} branch(es).
        <span v-if="withAccounts"> Owed now is what they still owe on billed documents, credit notes deducted.</span>
      </p>
    </template>

    <!-- ── One client ────────────────────────────────────────────────────── -->
    <FxDrawer
      :open="!!selected"
      :title="selected ? selected.name : ''"
      :subtitle="selected ? (selected.email_domain || 'No domain on file') : ''"
      :tabs="TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="selected = null"
    >
      <template #meta>
        <dl v-if="selected" class="fx-defs">
          <dt>Branch</dt>
          <dd>{{ selected.branch || "Not set" }}</dd>
          <dt>Salesperson</dt>
          <dd>{{ selected.salesperson || "Nobody" }}</dd>
          <template v-if="withAccounts">
            <dt>Credit limit</dt>
            <dd>
              <Figure v-if="selected.credit_limit !== null" :value="selected.credit_limit" kind="currency" currency-code="INR" />
              <span v-else class="fx-muted">Not configured</span>
            </dd>
            <dt>Owed now</dt>
            <dd>
              <Figure :value="selected.exposure" kind="currency" currency-code="INR" />
              <StatusChip v-if="selected.on_hold" value="credit_hold" />
            </dd>
          </template>
        </dl>
      </template>

      <template v-if="selected">
        <section v-if="tab === 'details'" class="fx-section">
          <dl class="fx-defs">
            <dt>Email</dt><dd>{{ selected.email || "—" }}</dd>
            <dt>Phone</dt><dd>{{ selected.phone || "—" }}</dd>
            <dt>Address</dt><dd>{{ selected.address || "—" }}</dd>
            <template v-if="withAccounts">
              <dt>GSTIN</dt><dd class="identifier">{{ selected.gst_no || "—" }}</dd>
              <dt>PAN</dt><dd class="identifier">{{ selected.pan_no || "—" }}</dd>
              <dt>DUNS</dt><dd class="identifier">{{ selected.duns_no || "—" }}</dd>
              <dt>Payment terms</dt><dd>{{ selected.payment_terms_days }} days</dd>
              <dt>Bank</dt>
              <!-- 🔐 Account number and IFSC are encrypted at rest and never returned. -->
              <dd>{{ selected.bank_name || "—" }} <span class="fx-muted">(account details are stored encrypted and not shown)</span></dd>
            </template>
          </dl>
          <button v-if="canEdit" class="fx-btn" @click="openForm(selected)">Edit</button>
        </section>

        <!-- The other billing entities of the same client — the group IS the domain. -->
        <section v-else-if="tab === 'group'" class="fx-section">
          <p v-if="!group.length" class="fx-muted">
            {{ selected.email_domain ? "This is the only billing entity on that domain." : "No domain on file, so there is no group." }}
          </p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">Billing entity</th>
                <th scope="col">Branch</th>
                <th scope="col">Salesperson</th>
                <th v-if="withAccounts" scope="col">GSTIN</th>
                <th v-if="withAccounts" class="fx-num" scope="col">Owed now</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in group" :key="'g-' + g.id" class="is-clickable" @click="open(g)">
                <td>{{ g.name }}</td>
                <td>{{ g.branch || "—" }}</td>
                <td>{{ g.salesperson || "Nobody" }}</td>
                <td v-if="withAccounts" class="identifier">{{ g.gst_no || "—" }}</td>
                <td v-if="withAccounts" class="fx-num"><Figure :value="g.exposure" kind="currency" currency-code="INR" /></td>
              </tr>
            </tbody>
          </table>
          <p class="fx-muted">
            Indian GST is registered state by state, so one company legitimately bills as several entities. They are
            one client because they share a domain — nothing links them but that.
          </p>
        </section>

        <section v-else class="fx-section">
          <p v-if="!contacts.length" class="fx-muted">No address saved yet. They are harvested from inbound mail.</p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">Address</th>
                <th scope="col">Name</th>
                <th class="fx-num" scope="col">Mails</th>
                <th scope="col">Last seen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ct in contacts" :key="'ct-' + ct.id">
                <td class="identifier">{{ ct.email }}</td>
                <td>{{ ct.name || "—" }}</td>
                <td class="fx-num">{{ ct.message_count }}</td>
                <td><Figure v-if="ct.last_seen_at" :value="ct.last_seen_at" kind="date" /><span v-else class="fx-muted">—</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </template>
    </FxDrawer>

    <!-- ── Onboarding ────────────────────────────────────────────────────── -->
    <div v-if="form" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="onboard-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="onboard-title" class="fx-modal__title">{{ form.id ? "Edit " + form.name : "Onboard a client" }}</h2>
        </header>
        <div class="fx-modal__body">
          <h3 class="fx-section__title">Who they are</h3>
          <div class="fx-toolbar">
            <label class="fx-field">
              <span class="fx-field__label">Billing name *</span>
              <input v-model="form.name" class="fx-input" placeholder="Globex Exports (Chennai)" />
            </label>
            <label class="fx-field">
              <!-- The domain is the group key AND how inbound mail finds them, so it earns its own hint. -->
              <span class="fx-field__label">Email domain</span>
              <input v-model="form.email_domain" class="fx-input" placeholder="globex.com" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Email</span>
              <input v-model="form.email" class="fx-input" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Phone</span>
              <input v-model="form.phone" class="fx-input" />
            </label>
          </div>
          <label class="fx-field">
            <span class="fx-field__label">Registered address</span>
            <textarea v-model="form.address" class="fx-input" rows="2"></textarea>
          </label>
          <p class="fx-muted">
            Mail from this domain is matched to them automatically, and every address they write from is saved.
          </p>

          <h3 class="fx-section__title">Who owns them</h3>
          <div class="fx-toolbar">
            <label class="fx-field">
              <span class="fx-field__label">Our branch</span>
              <select v-model="form.branch_id" class="fx-input">
                <option :value="null">Not set</option>
                <option v-for="b in options.branches" :key="b.id" :value="b.id">{{ b.name }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Salesperson</span>
              <select v-model="form.sales_id" class="fx-input">
                <option :value="null">Nobody yet</option>
                <option v-for="s in salesForBranch" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Their usual port</span>
              <input v-model="portQuery" class="fx-input" placeholder="INMAA or Chennai" @input="searchPorts" />
              <select v-if="ports.length" v-model="form.default_port_id" class="fx-input">
                <option :value="null">Not set</option>
                <option v-for="p in ports" :key="p.id" :value="p.id">
                  {{ p.locode }} — {{ p.port_name }} ({{ p.port_type }})
                </option>
              </select>
            </label>
          </div>
          <p class="fx-muted">
            The salesperson is how this client appears in a rep's book — a client with nobody on it is in nobody's.
          </p>

          <template v-if="withAccounts">
            <h3 class="fx-section__title">Tax and legal</h3>
            <div class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">GSTIN</span>
                <input v-model="form.gst_no" class="fx-input" maxlength="30" placeholder="33AAACG1001A1Z5" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">PAN</span>
                <input v-model="form.pan_no" class="fx-input" maxlength="20" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">DUNS</span>
                <input v-model="form.duns_no" class="fx-input" maxlength="20" />
              </label>
            </div>
            <p class="fx-muted">
              A client with no GSTIN is billed B2C and never goes to the invoice registration portal.
            </p>

            <h3 class="fx-section__title">Terms and credit</h3>
            <div class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">Payment terms (days)</span>
                <input v-model.number="form.payment_terms_days" type="number" min="0" max="365" class="fx-input fx-num" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Credit limit</span>
                <input v-model.number="form.credit_limit" type="number" step="0.01" min="0" class="fx-input fx-num"
                       placeholder="leave empty for no limit" />
              </label>
            </div>
            <p class="fx-muted">
              🔴 An empty limit means <strong>no limit configured</strong> and never blocks. A limit of
              <strong>0</strong> blocks every shipment. The terms set the due date on every invoice, which is what
              the ageing counts from.
            </p>

            <h3 class="fx-section__title">Their bank</h3>
            <div class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">Bank</span>
                <input v-model="form.bank_name" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Account number</span>
                <input v-model="form.bank_account_no" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">IFSC</span>
                <input v-model="form.bank_ifsc_code" class="fx-input" />
              </label>
            </div>
            <p class="fx-muted">Stored encrypted and never shown again — re-enter to change them.</p>
          </template>

          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="form = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !form.name.trim()" @click="save">
            {{ busy ? "Saving…" : (form.id ? "Save" : "Onboard them") }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";

const TABS = [
  { key: "details", label: "Details" },
  { key: "group", label: "Their other entities" },
  { key: "contacts", label: "Addresses" },
];

export default {
  name: "Clients",
  components: { Figure, StatusChip, FxDrawer },
  data: () => ({
    TABS,
    rows: [], total: 0, withAccounts: false,
    options: { branches: [], salespeople: [] },
    filters: { branch_id: null, sales_id: null, q: "", unassigned: false, no_limit: false },
    grouped: false,
    selected: null, tab: "details", group: [], contacts: [],
    form: null, ports: [], portQuery: "",
    loading: true, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    canEdit() {
      return ["accounts", "boss", "sales", "pricing"].includes(this.designation);
    },
    /** Grouped by the domain, or one flat list under a single empty heading. */
    groups() {
      if (!this.grouped) return [{ key: "all", rows: this.rows }];

      const byDomain = {};
      this.rows.forEach((row) => {
        const key = row.email_domain || "No domain on file";
        byDomain[key] ??= { key, rows: [], owed: 0 };
        byDomain[key].rows.push(row);
        byDomain[key].owed += Number(row.exposure || 0);
      });

      return Object.values(byDomain).sort((a, b) => a.key.localeCompare(b.key));
    },
    /** A rep of the chosen branch, or all of them when no branch is set. */
    salesForBranch() {
      if (!this.form || !this.form.branch_id) return this.options.salespeople;

      const own = this.options.salespeople.filter((s) => s.branch_id === this.form.branch_id);

      return own.length ? own : this.options.salespeople;
    },
  },
  created() {
    this.load();
  },
  methods: {
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    query() {
      const params = [];
      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== false) params.push(key + "=" + encodeURIComponent(value));
      });
      params.push("per_page=200");

      return "?" + params.join("&");
    },
    load() {
      this.loading = true;
      ApiService.get("/customers" + this.query())
        .then(({ data }) => {
          this.rows = data.data || [];
          this.total = data.total || this.rows.length;
          this.withAccounts = !!data.with_accounts;
          this.options = data.options || this.options;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    open(customer) {
      this.selected = customer;
      this.tab = "details";
      this.actionError = null;
      this.group = [];
      this.contacts = [];

      ApiService.get(`/customers/${customer.id}/group`)
        .then(({ data }) => { this.group = (data.members || data.group || []).filter((g) => g.id !== customer.id); })
        .catch(() => {});
      ApiService.get(`/customers/${customer.id}/contacts`)
        .then(({ data }) => { this.contacts = data.contacts || []; })
        .catch(() => {});
    },
    openForm(customer = null) {
      this.actionError = null;
      this.ports = [];
      this.portQuery = "";
      this.form = customer
        ? { ...customer }
        : { id: null, name: "", email_domain: "", email: "", phone: "", address: "",
            branch_id: this.options.branches.length === 1 ? this.options.branches[0].id : null,
            sales_id: null, default_port_id: null, gst_no: "", pan_no: "", duns_no: "",
            payment_terms_days: 30, credit_limit: null, bank_name: "", bank_account_no: "", bank_ifsc_code: "" };
    },
    searchPorts() {
      if (this.portQuery.trim().length < 2) { this.ports = []; return; }

      ApiService.get("/customers/ports?q=" + encodeURIComponent(this.portQuery))
        .then(({ data }) => { this.ports = data.ports || []; })
        .catch(() => {});
    },
    save() {
      this.busy = true;
      this.actionError = null;

      const body = { ...this.form };
      // Blank boxes are "not set", not empty strings — the columns are nullable and a "" GSTIN is not a GSTIN.
      Object.keys(body).forEach((key) => { if (body[key] === "") body[key] = null; });

      const call = this.form.id
        ? ApiService.put(`/customers/${this.form.id}`, body)
        : ApiService.post("/customers", body);

      call
        .then(() => { this.form = null; this.selected = null; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      const data = e.response && e.response.data;

      return (data && (data.error || data.message)) || "Something went wrong. Try again.";
    },
  },
};
</script>
