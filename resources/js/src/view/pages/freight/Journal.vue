<template>
  <div>
    <header v-if="!embedded" class="fx-page-head">
      <h1 class="fx-page-title">{{ account ? account.account_name : "Journal" }}</h1>
      <p class="fx-page-sub">
        {{ subtitle }}
        <router-link to="/financials">Financials →</router-link>
      </p>
    </header>
    <p v-else class="fx-muted">{{ subtitle }}</p>

    <!--
      The day book (user, 2026-09-20). Every posting the ledger holds, and the document that wrote each one — a
      figure you cannot open is a figure you have to take on faith, which is why people keep a spreadsheet beside
      their accounting system.
    -->
    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Account</span>
        <select v-model="filters.account" class="fx-input" @change="load">
          <option value="">Every account</option>
          <option v-for="a in accounts" :key="a.account_code" :value="a.account_code">
            {{ a.account_code }} — {{ a.account_name }}
          </option>
        </select>
      </label>
      <label v-if="branches.length > 1" class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="filters.agent_id" class="fx-input" @change="load">
          <option :value="null">All branches</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Period</span>
        <select v-model="filters.period_id" class="fx-input" @change="load">
          <option :value="null">All periods</option>
          <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.period_name }} ({{ p.status }})</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">From</span>
        <input v-model="filters.from" type="date" class="fx-input" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">To</span>
        <input v-model="filters.to" type="date" class="fx-input" @change="load" />
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Document</span>
        <select v-model="filters.source_type" class="fx-input" @change="load">
          <option value="">Everything</option>
          <option v-for="(label, key) in sources" :key="key" :value="key">{{ label }}</option>
        </select>
      </label>
      <label class="fx-field">
        <span class="fx-field__label">Side</span>
        <select v-model="filters.side" class="fx-input" @change="load">
          <option value="">Both</option>
          <option value="debit">Debits</option>
          <option value="credit">Credits</option>
        </select>
      </label>
      <button class="fx-btn" :disabled="busy" @click="exportCsv">Export</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!entries.length" class="fx-muted">Nothing has been posted here.</p>

    <template v-else>
      <!-- An account ledger opens from what it already stood at; the day book has no opening balance to carry. -->
      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Account</th>
            <th scope="col">Document</th>
            <th scope="col">Organization</th>
            <th v-if="branches.length > 1" scope="col">Branch</th>
            <th class="fx-num" scope="col">Debit</th>
            <th class="fx-num" scope="col">Credit</th>
            <th v-if="account" class="fx-num" scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="account" class="fx-row--quiet">
            <td :colspan="branches.length > 1 ? 5 : 4"><strong>Opening balance</strong></td>
            <td class="fx-num"></td>
            <td class="fx-num"></td>
            <td class="fx-num"><strong><Figure :value="opening" kind="currency" currency-code="INR" /></strong></td>
          </tr>
          <tr
            v-for="e in entries"
            :key="'e-' + e.id"
            class="is-clickable"
            :class="{ 'is-selected': drill && drill.entry.id === e.id }"
            tabindex="0"
            @click="open(e)"
            @keydown.enter="open(e)"
          >
            <td><Figure :value="e.posting_date" kind="date" /></td>
            <td>
              <span class="identifier">{{ e.account_code }}</span>
              <span class="fx-muted"> {{ e.account_name }}</span>
            </td>
            <td class="identifier">{{ e.document_no || "—" }}<span class="fx-muted"> {{ e.source_label }}</span></td>
            <td>{{ e.organization || "—" }}</td>
            <td v-if="branches.length > 1">{{ e.branch }}</td>
            <td class="fx-num">
              <Figure v-if="Number(e.debit_amount)" :value="e.debit_amount" kind="currency" currency-code="INR" />
              <span v-else class="fx-muted">—</span>
            </td>
            <td class="fx-num">
              <Figure v-if="Number(e.credit_amount)" :value="e.credit_amount" kind="currency" currency-code="INR" />
              <span v-else class="fx-muted">—</span>
            </td>
            <td v-if="account" class="fx-num"><Figure :value="e.balance" kind="currency" currency-code="INR" /></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td :colspan="branches.length > 1 ? 5 : 4">
              <strong>{{ account ? "Movements" : totals.count + " posting(s)" }}</strong>
            </td>
            <td class="fx-num"><strong><Figure :value="debits" kind="currency" currency-code="INR" /></strong></td>
            <td class="fx-num"><strong><Figure :value="credits" kind="currency" currency-code="INR" /></strong></td>
            <td v-if="account" class="fx-num"><strong><Figure :value="closing" kind="currency" currency-code="INR" /></strong></td>
          </tr>
        </tfoot>
      </table>
      <p class="fx-muted">
        <span v-if="account">
          Closing balance {{ money(closing) }}. This is the figure the trial balance carries for
          {{ account.account_code }}.
        </span>
        <span v-else-if="totals.debits === totals.credits">Debits and credits agree.</span>
        <span v-else class="fx-error">
          Debits and credits do not agree — there is a one-sided entry in this selection.
        </span>
      </p>
    </template>

    <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>

    <!-- ── One posting, drilled through ──────────────────────────────────── -->
    <FxDrawer
      :open="!!drill"
      :title="drill ? (drill.document ? drill.document.number : 'Posting') : ''"
      :subtitle="drillSubtitle"
      :tabs="DRILL_TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="drill = null"
    >
      <template #meta>
        <dl v-if="drill" class="fx-defs">
          <dt>Posted</dt>
          <dd><Figure :value="drill.entry.posting_date" kind="date" /></dd>
          <dt>Period</dt>
          <dd>{{ drill.period ? drill.period.period_name : "—" }}</dd>
          <dt>This line</dt>
          <dd>
            {{ drill.entry.account_code }} —
            {{ Number(drill.entry.debit_amount) ? "Dr " + money(drill.entry.debit_amount) : "Cr " + money(drill.entry.credit_amount) }}
          </dd>
        </dl>
      </template>

      <template v-if="drill">
        <!-- ⚠️ The WHOLE journal. Half a double entry answers nothing: the question is "against what?". -->
        <section v-if="tab === 'journal'" class="fx-section">
          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Account</th>
                <th class="fx-num" scope="col">Debit</th>
                <th class="fx-num" scope="col">Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in drill.journal.lines" :key="'jl-' + l.id" :class="{ 'is-selected': l.id === drill.entry.id }">
                <td>
                  <a href="#" @click.prevent="openAccount(l.account_code)">{{ l.account_code }}</a>
                  <span class="fx-muted"> {{ l.account_name }}</span>
                </td>
                <td class="fx-num">
                  <Figure v-if="Number(l.debit_amount)" :value="l.debit_amount" kind="currency" currency-code="INR" />
                  <span v-else class="fx-muted">—</span>
                </td>
                <td class="fx-num">
                  <Figure v-if="Number(l.credit_amount)" :value="l.credit_amount" kind="currency" currency-code="INR" />
                  <span v-else class="fx-muted">—</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>{{ drill.journal.balanced ? "Balanced" : "NOT BALANCED" }}</strong></td>
                <td class="fx-num"><strong><Figure :value="drill.journal.debits" kind="currency" currency-code="INR" /></strong></td>
                <td class="fx-num"><strong><Figure :value="drill.journal.credits" kind="currency" currency-code="INR" /></strong></td>
              </tr>
            </tfoot>
          </table>
          <p class="fx-muted">An account opens its own ledger; the document below is what wrote all of these.</p>
        </section>

        <!-- The bottom of the drill: the document itself. -->
        <section v-else class="fx-section">
          <p v-if="!drill.document" class="fx-muted">The document behind this posting no longer exists.</p>
          <template v-else>
            <dl class="fx-defs">
              <dt>Document</dt>
              <dd class="identifier">{{ drill.document.number }} <span class="fx-muted">{{ drill.document.document_type || drill.document.label }}</span></dd>
              <dt>Organization</dt>
              <dd>{{ drill.document.organization || "—" }}</dd>
              <dt>Shipment</dt>
              <dd class="identifier">{{ drill.document.job_no || "—" }}</dd>
              <dt>Total</dt>
              <dd><Figure :value="drill.document.total" kind="currency" :currency-code="drill.document.currency || 'INR'" /></dd>
            </dl>

            <h3 class="fx-section__title">{{ drill.document.type === "receipt" ? "What it settled" : "Its lines" }}</h3>
            <table class="fx-table">
              <thead>
                <tr>
                  <th scope="col">{{ drill.document.type === "receipt" ? "Document" : "Description" }}</th>
                  <th v-if="drill.document.type !== 'receipt'" class="fx-num" scope="col">Qty</th>
                  <th v-if="drill.document.type !== 'receipt'" class="fx-num" scope="col">Rate</th>
                  <th v-if="drill.document.type !== 'receipt'" class="fx-num" scope="col">Tax</th>
                  <th class="fx-num" scope="col">Net</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(l, i) in drill.document.lines" :key="'dl-' + i">
                  <td>
                    {{ l.description }}
                    <span v-if="l.resolution" class="fx-muted">({{ l.resolution.replace(/_/g, " ") }})</span>
                  </td>
                  <td v-if="drill.document.type !== 'receipt'" class="fx-num">{{ Number(l.quantity) }}</td>
                  <td v-if="drill.document.type !== 'receipt'" class="fx-num">
                    <Figure :value="l.rate" kind="currency" :currency-code="drill.document.currency || 'INR'" />
                  </td>
                  <td v-if="drill.document.type !== 'receipt'" class="fx-num">
                    <Figure :value="l.tax_amount" kind="currency" :currency-code="drill.document.currency || 'INR'" />
                  </td>
                  <td class="fx-num">
                    <Figure :value="l.net_amount" kind="currency" :currency-code="drill.document.currency || 'INR'" />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </section>
      </template>

      <template #footer>
        <template v-if="drill && drill.document && drill.document.type === 'invoice'">
          <router-link class="fx-btn" :to="{ path: '/billing', query: { open: drill.entry.source_id } }">
            Open it in Billing
          </router-link>
        </template>
      </template>
    </FxDrawer>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";

const DRILL_TABS = [
  { key: "journal", label: "The whole entry" },
  { key: "document", label: "The document" },
];

export default {
  name: "Journal",
  components: { Figure, FxDrawer },
  props: {
    /** Rendered as the drill target inside How we're doing. */
    embedded: { type: Boolean, default: false },
  },
  data: () => ({
    DRILL_TABS,
    entries: [], totals: { count: 0, debits: 0, credits: 0 },
    accounts: [], periods: [], branches: [], sources: {},
    /** Set when one account's ledger is open: it carries an opening balance the day book does not. */
    account: null, opening: 0, movements: { debits: 0, credits: 0 }, closing: 0,
    filters: { account: "", agent_id: null, period_id: null, from: "", to: "", source_type: "", side: "" },
    drill: null, tab: "journal",
    loading: true, busy: false, error: null, actionError: null,
  }),
  computed: {
    subtitle() {
      return this.account
        ? "Every posting to this account, oldest first, with the balance running down the page."
        : "Every posting the ledger holds, and the document that wrote it. Open a line to see the other side of the entry.";
    },
    drillSubtitle() {
      if (!this.drill) return "";

      return this.drill.document
        ? `${this.drill.document.label}${this.drill.document.organization ? " — " + this.drill.document.organization : ""}`
        : "The document is gone";
    },
    debits() {
      return this.account ? this.movements.debits : this.totals.debits;
    },
    credits() {
      return this.account ? this.movements.credits : this.totals.credits;
    },
  },
  created() {
    // Arrived from a report line: open that account's ledger for that period.
    const { account, period_id: periodId, agent_id: agentId } = this.$route.query;

    if (account) this.filters.account = account;
    if (periodId) this.filters.period_id = Number(periodId);
    if (agentId) this.filters.agent_id = Number(agentId);

    this.load();
  },
  methods: {
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    query() {
      const params = [];
      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && key !== "account") params.push(key + "=" + encodeURIComponent(value));
      });

      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;
      this.drill = null;

      // One account picked is an account LEDGER — opening balance, running balance, oldest first. Everything
      // else is the day book.
      const path = this.filters.account
        ? `/journal/accounts/${encodeURIComponent(this.filters.account)}${this.query()}`
        : `/journal${this.query()}`;

      ApiService.get(path)
        .then(({ data }) => {
          this.entries = data.entries || [];
          this.branches = data.branches || this.branches;

          if (this.filters.account) {
            this.account = data.account;
            this.opening = data.opening;
            this.movements = data.movements;
            this.closing = data.closing;
          } else {
            this.account = null;
            this.totals = data.totals;
            this.accounts = data.accounts || this.accounts;
            this.periods = data.periods || this.periods;
            this.sources = data.sources || this.sources;
          }

          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    openAccount(code) {
      this.filters.account = code;
      this.load();
    },
    open(entry) {
      this.actionError = null;
      this.tab = "journal";
      ApiService.get(`/journal/entries/${entry.id}`)
        .then(({ data }) => { this.drill = data; })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    exportCsv() {
      this.busy = true;
      const params = this.query();
      const joiner = params ? "&" : "?";
      const account = this.filters.account ? joiner + "account=" + encodeURIComponent(this.filters.account) : "";

      ApiService.query("/journal/export" + params + account, { responseType: "blob" })
        .then(({ data }) => {
          const url = window.URL.createObjectURL(new Blob([data], { type: "text/csv" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = "day-book.csv";
          link.click();
          setTimeout(() => window.URL.revokeObjectURL(url), 30000);
        })
        .catch(() => { this.actionError = "The export could not be built."; })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      return (e.response && e.response.data && e.response.data.error) || "Something went wrong. Try again.";
    },
  },
};
</script>
