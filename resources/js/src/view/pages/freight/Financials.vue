<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Financials</h1>
      <p class="fx-page-sub">{{ subtitleForView }}</p>
    </header>

    <!--
      Three registers, one page (user, 2026-09-18): what pricing has handed over and nobody has billed, the
      receivables themselves, and what we owe suppliers. Each is a different day's work, so each is its own view
      rather than a filter people have to remember to set.
    -->
    <div class="fx-toolbar fx-financials__views">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="fx-btn"
        :class="{ 'fx-btn--primary': view === v.key }"
        @click="showView(v.key)"
      >{{ v.label }}</button>
    </div>

    <div v-if="view !== 'vouchers'" class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Status</span>
        <select v-model="status" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s.replace(/_/g, " ") }}</option>
        </select>
      </label>

      <label class="fx-checkbox">
        <input v-model="outstanding" type="checkbox" @change="load" />
        Outstanding only
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!rows.length" class="fx-muted">No documents match.</p>

    <!-- ── What we owe suppliers ─────────────────────────────────────────── -->
    <table v-else-if="view === 'vouchers'" class="fx-table">
      <thead>
        <tr>
          <th scope="col">Voucher</th>
          <th scope="col">Supplier</th>
          <th scope="col">Shipment</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          <th scope="col">Posted</th>
          <th class="fx-num" scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="'v-' + row.id"
          class="is-clickable"
          :class="{ 'is-selected': selected && selected.id === row.id }"
          tabindex="0"
          @click="selectVoucher(row)"
          @keydown.enter="selectVoucher(row)"
        >
          <td class="identifier">{{ row.voucher_no }}</td>
          <td>{{ row.vendor ? row.vendor.name : "—" }}</td>
          <td class="identifier">{{ row.job_no || row.job_id }}</td>
          <td><Figure :value="row.document_date" kind="date" /></td>
          <td><StatusChip :value="row.status" /></td>
          <td><StatusChip :value="row.is_posted ? 'posted' : 'unposted'" /></td>
          <td class="fx-num"><Figure :value="row.net_amount" kind="currency" currency-code="INR" /></td>
        </tr>
      </tbody>
    </table>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th v-if="view === 'awaiting'" scope="col">Shipment</th>
          <th scope="col">Invoice</th>
          <th scope="col">Customer</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          <th scope="col">Posted</th>
          <th class="fx-num" scope="col">Total</th>
          <template v-if="view === 'awaiting'">
            <th class="fx-num" scope="col">Cost</th>
            <th class="fx-num" scope="col">Margin</th>
            <th scope="col">Sent by</th>
          </template>
          <template v-else>
            <th class="fx-num" scope="col">Paid</th>
            <th class="fx-num" scope="col">Balance</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="is-clickable"
          :class="{ 'is-selected': selected && selected.id === row.id }"
          tabindex="0"
          @click="select(row)"
          @keydown.enter="select(row)"
        >
          <!-- §4.1 a draft has no number yet — an em dash, never a blank or a zero. -->
          <td v-if="view === 'awaiting'" class="identifier">{{ row.job_no }}</td>
          <td class="identifier">
            <span v-if="row.invoice_no">{{ row.invoice_no }}</span>
            <span v-else class="is-empty" aria-label="Not yet numbered"></span>
          </td>
          <td>
            <span v-if="row.customer">{{ row.customer.name }}</span>
            <!-- customer is NULL on partner-billed documents — a real state, not a gap. -->
            <span v-else class="fx-muted">Partner-billed</span>
          </td>
          <td><Figure :value="row.document_date" kind="date" /></td>
          <td><StatusChip :value="row.status" /></td>
          <td>
            <StatusChip :value="row.is_posted ? 'posted' : 'unposted'" />
          </td>
          <td class="fx-num">
            <Figure :value="view === 'awaiting' ? row.sell_total : row.grand_total" kind="currency" :currency-code="row.currency || 'INR'" />
          </td>
          <template v-if="view === 'awaiting'">
            <td class="fx-num"><Figure :value="row.buy_total" kind="currency" currency-code="INR" /></td>
            <td class="fx-num">
              <!-- An unbilled job has no margin yet; PRD §7.2 — NULL, never −100%. -->
              <Figure v-if="row.margin !== null" :value="row.margin" kind="currency" currency-code="INR" />
              <span v-else class="fx-muted">—</span>
            </td>
            <td>{{ row.sent_to_accounts_by || "—" }}</td>
          </template>
          <template v-else>
            <td class="fx-num"><Figure :value="row.amount_paid" kind="currency" :currency-code="row.currency || 'INR'" /></td>
            <td class="fx-num"><Figure :value="balanceOf(row)" kind="currency" :currency-code="row.currency || 'INR'" /></td>
          </template>
        </tr>
      </tbody>
    </table>

    <FxDrawer
      :open="!!selected"
      :title="selected ? (selected.invoice_no || 'Draft invoice') : ''"
      :subtitle="drawerSubtitle"
      :tabs="view === 'vouchers' ? VOUCHER_TABS : TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="deselect"
    >
      <template v-if="selected">
        <!-- ── Credit standing ─────────────────────────────────────────── -->
        <section v-if="tab === 'credit'" class="fx-section">
          <p v-if="!selected.customer_id" class="fx-muted">
            This document is billed to a partner, so there is no customer credit to check —
            credit, collections and AR are customer-only concepts.
          </p>
          <p v-else-if="creditLoading" class="fx-muted">Loading…</p>
          <template v-else-if="credit">
            <h3 class="fx-section__title">{{ credit.customer.name }} — this billing entity</h3>
            <dl class="fx-defs">
              <dt>Credit limit</dt>
              <dd>
                <!--
                  🔴 NULL IS NOT ZERO, and here the difference decides whether cargo
                  moves. "No limit configured" must never render as a limit of 0.00 —
                  the desk would read a working gate as a broken one.
                -->
                <span v-if="credit.branch.limit === null" class="fx-muted">Not configured</span>
                <Figure v-else :value="credit.branch.limit" kind="currency" currency-code="INR" />
              </dd>

              <dt>Current exposure</dt>
              <dd><Figure :value="credit.branch.exposure" kind="currency" currency-code="INR" /></dd>

              <dt>Standing</dt>
              <dd>
                <StatusChip :value="credit.branch.blocked ? 'credit_hold' : 'within_limit'" />
              </dd>
            </dl>

            <!--
              ⚠️ DISPLAYED, NEVER ENFORCED ON. Separate GSTINs are separate billing
              entities; one branch at its limit must not freeze another branch's cargo.
              The label has to say so, or the next person to read this screen will
              assume the gate uses this number.
            -->
            <template v-if="credit.group && credit.group.members > 1">
              <h3 class="fx-section__title" style="margin-top: var(--space-5)">
                Group roll-up — {{ credit.group.members }} billing entities
              </h3>
              <dl class="fx-defs">
                <dt>Combined exposure</dt>
                <dd><Figure :value="credit.group.exposure" kind="currency" currency-code="INR" /></dd>
              </dl>
              <p class="fx-muted" style="margin-top: var(--space-2)">
                Shown for context only. The gate is applied per billing entity, so this
                total never blocks anything on its own.
              </p>
            </template>
          </template>
        </section>

        <!-- ── The journal ─────────────────────────────────────────────── -->
        <section v-else class="fx-section">
          <p v-if="previewLoading" class="fx-muted">Loading…</p>
          <template v-else-if="preview">
            <h3 class="fx-section__title">The journal this posting writes</h3>

            <!--
              §9.6 the lines are shown BEFORE commit — and they come from the server's
              own posting code, not from arithmetic repeated here. A preview computed
              in the browser can drift from what posts and still look correct.
            -->
            <table class="fx-journal">
              <tbody>
                <tr v-for="(l, i) in preview.lines" :key="i">
                  <td class="fx-journal__dc">{{ l.debit > 0 ? "Dr" : "Cr" }}</td>
                  <td>{{ l.code }}</td>
                  <td class="fx-journal__amt">
                    <Figure :value="l.debit > 0 ? l.debit : l.credit" kind="currency" currency-code="INR" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" :class="preview.balanced ? 'fx-journal__balanced' : 'fx-journal__unbalanced'">
                    {{ preview.balanced ? "balanced ✓" : "OUT OF BALANCE" }}
                  </td>
                  <td class="fx-journal__amt">
                    <Figure :value="preview.debits" kind="currency" currency-code="INR" />
                  </td>
                </tr>
              </tfoot>
            </table>

            <p v-if="alreadyPosted" class="fx-muted" style="margin-top: var(--space-3)">
              Already posted. This is the journal that was written.
            </p>
            <p v-else class="fx-warn" style="margin-top: var(--space-3)">
              Posting cannot be undone. A correction requires a credit note.
            </p>
          </template>
        </section>

        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </template>

      <template #footer>
        <button class="fx-btn" @click="deselect">Close</button>

        <!--
          §8.1 role forbids -> HIDDEN, never disabled. An operations or boss login has
          no path to these at all; a greyed button only invites "why can't I?" tickets.
          The server refuses them regardless — this is presentation, not the gate.
        -->
        <template v-if="canPost && selected">
          <button
            v-if="view !== 'vouchers' && selected.status === 'draft'"
            class="fx-btn fx-btn--primary"
            :disabled="busy"
            @click="finalize"
          >Finalize</button>

          <button
            v-else-if="!selected.is_posted"
            class="fx-btn fx-btn--primary"
            :disabled="busy || (preview && !preview.balanced)"
            @click="post"
          >Post to Ledger</button>
        </template>
      </template>
    </FxDrawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";

const STATUSES = ["draft", "finalized", "sent", "partially_paid", "paid", "void"];

/** The three registers accounts work (user, 2026-09-18). */
const VIEWS = [
  { key: "awaiting", label: "Waiting to be billed" },
  { key: "invoices", label: "Invoices" },
  { key: "vouchers", label: "What we owe" },
];
const TABS = [
  { key: "credit", label: "Credit standing" },
  { key: "journal", label: "Journal" },
];

export default {
  name: "Financials",
  components: { Figure, StatusChip, FxDrawer },
  data: () => ({
    rows: [], loading: true, error: null,
    status: "", outstanding: false,
    /** Which register is open: the hand-over queue, the receivables, or the payables. */
    view: "awaiting", VIEWS,
    selected: null, tab: "credit",
    credit: null, creditLoading: false,
    preview: null, previewLoading: false,
    busy: false, actionError: null,
    STATUSES, TABS,
    /** A voucher has no customer credit to check, so its drawer shows the journal alone. */
    VOUCHER_TABS: [{ key: "journal", label: "Journal" }],
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only accounts commits. The Boss reads the register and the journal, and that
       asymmetry is the segregation of duties, not a UI convenience. */
    canPost() {
      return this.designation === "accounts";
    },
    alreadyPosted() {
      return !!(this.selected && this.selected.is_posted);
    },
    drawerSubtitle() {
      if (!this.selected) return null;
      if (this.view === "vouchers") return this.selected.vendor ? this.selected.vendor.name : "No supplier";

      return this.selected.customer ? this.selected.customer.name : "Partner-billed";
    },
    /** The queue is the hand-over; the receivables and payables are the registers themselves. */
    subtitleForView() {
      return {
        awaiting: "Cost sheets pricing has sent across, with what each shipment sells for and what it cost. Finalize one to bill it.",
        invoices: "The receivables register for this branch. Select a row to see the client's credit standing and the journal a posting would write.",
        vouchers: "What this branch owes its suppliers, one voucher per supplier per shipment. Select one to see the journal a posting would write.",
      }[this.view];
    },
  },
  created() {
    this.load();
  },
  methods: {
    /* Balance is derived, never stored — a stored balance drifts from its own parts. */
    balanceOf(row) {
      return Number(row.grand_total || 0) - Number(row.amount_paid || 0);
    },
    showView(key) {
      this.view = key;
      this.deselect();
      this.load();
    },
    load() {
      this.loading = true;
      const params = [];

      if (this.view === "awaiting") params.push("awaiting=1");
      if (this.view !== "vouchers" && this.status) params.push("status=" + encodeURIComponent(this.status));
      if (this.view === "invoices" && this.outstanding) params.push("outstanding=1");

      const path = this.view === "vouchers" ? "/vouchers" : "/invoices";

      ApiService.get(path + (params.length ? "?" + params.join("&") : ""))
        .then(({ data }) => { this.rows = data.data || []; this.error = null; })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    /** A voucher's drawer: the journal a posting would write, and Post for accounts. */
    selectVoucher(row) {
      this.selected = row;
      this.tab = "journal";
      this.actionError = null;
      this.credit = null;
      this.previewLoading = true;

      ApiService.get(`/vouchers/${row.id}/posting-preview`)
        .then(({ data }) => { this.preview = data; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.previewLoading = false; });
    },
    select(row) {
      this.selected = row;
      this.tab = "credit";
      this.actionError = null;
      this.loadCredit();
      this.loadPreview();
    },
    deselect() {
      this.selected = null;
      this.credit = null;
      this.preview = null;
      this.actionError = null;
    },
    loadCredit() {
      this.credit = null;
      if (!this.selected.customer_id) return;

      this.creditLoading = true;
      ApiService.get(`/customers/${this.selected.customer_id}/credit`)
        .then(({ data }) => { this.credit = data; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.creditLoading = false; });
    },
    loadPreview() {
      this.preview = null;
      this.previewLoading = true;
      ApiService.get(`/invoices/${this.selected.id}/posting-preview`)
        .then(({ data }) => { this.preview = data; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.previewLoading = false; });
    },
    finalize() {
      this.commit(`/invoices/${this.selected.id}/finalize`);
    },
    post() {
      // The buy side posts through its own endpoint — same segregation, different document.
      this.commit(this.view === "vouchers"
        ? `/vouchers/${this.selected.id}/post`
        : `/invoices/${this.selected.id}/post`);
    },
    /**
     * Both commits share this because both can be REFUSED for a reason the user
     * needs to read — a credit breach, a closed period. The server's message is
     * shown verbatim rather than replaced with a generic failure: "no open
     * accounting period covers this document date" is actionable, "something went
     * wrong" is not.
     */
    commit(path) {
      this.busy = true;
      this.actionError = null;

      ApiService.post(path, {})
        .then(({ data }) => {
          const i = this.rows.findIndex((r) => r.id === data.id);
          if (i !== -1) this.$set(this.rows, i, { ...this.rows[i], ...data });
          this.selected = { ...this.selected, ...data };
          this.loadPreview();
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
