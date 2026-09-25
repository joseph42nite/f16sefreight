"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_Financials_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Financials.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Financials.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
/* harmony import */ var _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/FxDrawer.vue */ "./resources/js/src/view/pages/freight/components/FxDrawer.vue");
/* harmony import */ var _view_pages_freight_components_MailEditor_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/MailEditor.vue */ "./resources/js/src/view/pages/freight/components/MailEditor.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






const STATUSES = ["draft", "finalized", "sent", "partially_paid", "paid", "void"];

/** The three registers accounts work (user, 2026-09-18). */
const VIEWS = [{
  key: "awaiting",
  label: "Waiting to be billed"
}, {
  key: "invoices",
  label: "Invoices"
}, {
  key: "vouchers",
  label: "What we owe"
}, {
  key: "gst",
  label: "GST register"
}, {
  key: "tds",
  label: "TDS register"
}, {
  key: "unposted",
  label: "Not yet posted"
}, {
  key: "reports",
  label: "Reports"
}, {
  key: "periods",
  label: "Periods"
}, {
  key: "bank",
  label: "Bank"
}, {
  key: "vendors",
  label: "Supplier statements"
}];

/** The three reports the ledger can prove (PRD §6.8). Each runs over a PERIOD, never a free date range. */
const REPORTS = [{
  key: "profit-and-loss",
  label: "Profit & loss"
}, {
  key: "balance-sheet",
  label: "Balance sheet"
}, {
  key: "trial-balance",
  label: "Trial balance"
}];
const TABS = [{
  key: "credit",
  label: "Credit standing"
}, {
  key: "journal",
  label: "Journal"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Financials",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    MailEditor: _view_pages_freight_components_MailEditor_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  data: () => ({
    rows: [],
    loading: true,
    error: null,
    status: "",
    outstanding: false,
    /** Which register is open: the hand-over queue, the receivables, the payables, or a read-only register. */
    view: "awaiting",
    VIEWS,
    /** One accounts login covers the company; NULL is every branch (user, 2026-09-18). */
    branches: [],
    branchId: null,
    /** The totals row of whichever register is open. */
    totals: null,
    /** Reports: which one, over which period, and what came back. */
    REPORTS,
    report: "profit-and-loss",
    periodId: null,
    periods: [],
    reportData: null,
    reportLoading: false,
    /** A period being opened. */
    newPeriod: {
      agent_id: null,
      period_name: "",
      start_date: "",
      end_date: ""
    },
    /** Bank reconciliation: the row being settled, what it could settle, and how a short payment is treated. */
    bankRow: null,
    candidates: [],
    candidateNote: "",
    resolution: "",
    /** Statement import, the credited-vs-billed list, and the query mail being written. */
    importing: false,
    csv: "",
    importResult: null,
    differences: [],
    queryDraft: null,
    /** Supplier statements: the list, the one open, and the import being typed (user, 2026-09-19). */
    vendorStatements: [],
    vendorTypes: [],
    vendorStates: {},
    vendors: [],
    vendorStatement: null,
    vendorLines: [],
    vendorTotals: {
      theirs: 0,
      ours: 0,
      difference: 0
    },
    importingVendor: false,
    vendorForm: {
      vendor_type: "",
      vendor_id: null,
      period: "",
      statement_no: "",
      csv: ""
    },
    /** TDS register: both directions, for one quarter (user, 2026-09-25). */
    tds: null,
    tdsYear: "",
    tdsQuarter: "",
    selected: null,
    tab: "credit",
    credit: null,
    creditLoading: false,
    preview: null,
    previewLoading: false,
    busy: false,
    actionError: null,
    STATUSES,
    TABS,
    /** A voucher has no customer credit to check, so its drawer shows the journal alone. */
    VOUCHER_TABS: [{
      key: "journal",
      label: "Journal"
    }]
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_5__.mapGetters)(["designation"])), {}, {
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
    /** The periods of the branch in view, newest first. */
    visiblePeriods() {
      return this.branchId ? this.periods.filter(p => p.agent_id === this.branchId) : this.periods;
    },
    /** The branch a statement belongs to: the one in view, or the only one there is. */
    branchForImport() {
      return this.branchId || (this.branches.length === 1 ? this.branches[0].id : null);
    },
    newPeriodValid() {
      const p = this.newPeriod;
      return p.agent_id && p.period_name.trim() && p.start_date && p.end_date && p.start_date <= p.end_date;
    },
    /** The queue is the hand-over; the receivables and payables are the registers themselves. */
    subtitleForView() {
      return {
        awaiting: "Cost sheets pricing has sent across, with what each shipment sells for and what it cost. Finalize one to bill it.",
        gst: "The tax on every posted document, charged and paid. Read-only — it is what was charged.",
        tds: "What was withheld, both ways, for one quarter. Never netted — a liability owed by the 7th, and an asset with no deadline.",
        reports: "What the ledger proves, over one period of one branch.",
        periods: "The months the ledger is open for. Nothing posts into a month without an open period.",
        bank: "Money in the bank, and the invoice each payment settles.",
        vendors: "What each supplier says we owe — an airline's CASS, a trucker's month, anyone's — against our own vouchers.",
        unposted: "Documents raised and not yet in the ledger, and what each is waiting for.",
        invoices: "The receivables register for this branch. Select a row to see the client's credit standing and the journal a posting would write.",
        vouchers: "What this branch owes its suppliers, one voucher per supplier per shipment. Select one to see the journal a posting would write."
      }[this.view];
    }
  }),
  created() {
    // A link from another screen (Money out's voucher register, Close the month's TDS step) names the
    // view it means to open — without this, every one of those links landed on "Waiting to be billed"
    // regardless of what it said.
    const requested = this.$route.query.view;
    if (requested && VIEWS.some(v => v.key === requested)) {
      this.showView(requested);
      return;
    }
    this.load();
  },
  methods: {
    /* Balance is derived, never stored — a stored balance drifts from its own parts. */
    balanceOf(row) {
      return Number(row.grand_total || 0) - Number(row.amount_paid || 0);
    },
    /** From a report line down to the ledger: the same account, the same period. */
    drillTo(code) {
      return {
        path: "/journal",
        query: {
          account: code,
          period_id: this.periodId
        }
      };
    },
    showView(key) {
      this.view = key;
      this.deselect();
      this.reportData = null;
      if (key === "reports" || key === "periods") {
        this.loadPeriods();
        return;
      }
      if (key === "vendors") {
        this.vendorStatement = null;
        this.loadVendorStatements();
        return;
      }
      if (key === "tds") {
        this.loadTds();
        return;
      }
      this.load();
    },
    loadPeriods() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/reports/periods").then(({
        data
      }) => {
        this.periods = data.periods || [];
        this.branches = data.branches || this.branches;
        if (!this.newPeriod.agent_id && this.branches.length) this.newPeriod.agent_id = this.branches[0].id;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    loadReport() {
      if (!this.periodId) return;
      this.reportLoading = true;
      this.reportData = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/reports/${this.report}?period_id=${this.periodId}`).then(({
        data
      }) => {
        this.reportData = data;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.reportLoading = false;
      });
    },
    openPeriod() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/reports/periods", this.newPeriod).then(() => {
        this.newPeriod = _objectSpread(_objectSpread({}, this.newPeriod), {}, {
          period_name: "",
          start_date: "",
          end_date: ""
        });
        this.loadPeriods();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    closePeriod(period) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/reports/periods/${period.id}/close`, {}).then(() => this.loadPeriods()).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    findCandidates(row) {
      this.bankRow = row;
      this.candidates = [];
      this.actionError = null;
      this.resolution = "";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/reconciliation/${row.id}/candidates`).then(({
        data
      }) => {
        this.candidates = data.candidates || [];
        this.candidateNote = data.limitation || "";
      }).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    matchTo(candidate) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/reconciliation/${this.bankRow.id}/match`, _objectSpread({
        invoice_id: candidate.invoice.id
      }, this.resolution ? {
        resolution: this.resolution
      } : {})).then(() => {
        this.bankRow = null;
        this.candidates = [];
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    unmatch(row) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/reconciliation/${row.id}/unmatch`, {}).then(() => this.load()).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    importStatement() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/reconciliation/import", {
        agent_id: this.branchForImport,
        csv: this.csv
      }).then(({
        data
      }) => {
        this.importResult = data;
        this.csv = "";
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    /** How many lines on a statement do not agree — the only number anybody acts on. */
    disagreeing(statement) {
      const by = statement.by_state || {};
      return (by.different || 0) + (by.not_booked || 0) + (by.unmatched || 0);
    },
    loadVendorStatements() {
      this.loading = true;
      const params = [];
      if (this.branchId) params.push("agent_id=" + this.branchId);
      if (this.vendorForm.vendor_type) params.push("vendor_type=" + encodeURIComponent(this.vendorForm.vendor_type));
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/vendor-statements" + (params.length ? "?" + params.join("&") : "")).then(({
        data
      }) => {
        this.vendorStatements = data.statements || [];
        this.vendorTypes = data.vendor_types || [];
        this.vendorStates = data.states || {};
        if (data.branches) this.branches = data.branches;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    /** The suppliers of the chosen type, for the picker. */
    loadVendors() {
      this.vendorForm.vendor_id = null;
      this.loadVendorStatements();
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners" + (this.vendorForm.vendor_type ? "?type=" + encodeURIComponent(this.vendorForm.vendor_type) : "")).then(({
        data
      }) => {
        this.vendors = data.data || [];
      }).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    importVendorStatement() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/vendor-statements", _objectSpread({
        agent_id: this.branchForImport
      }, this.vendorForm)).then(({
        data
      }) => {
        this.showStatement(data);
        this.vendorForm = _objectSpread(_objectSpread({}, this.vendorForm), {}, {
          csv: "",
          statement_no: ""
        });
        this.importingVendor = false;
        this.loadVendorStatements();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    openStatement(id) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/vendor-statements/${id}`).then(({
        data
      }) => this.showStatement(data)).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    /** Compare again — vouchers move, and a line with no cost booked last week may have one today. */
    recompare() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/vendor-statements/${this.vendorStatement.id}/compare`, {}).then(({
        data
      }) => {
        this.showStatement(data);
        this.loadVendorStatements();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    dispute(line, note) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/vendor-statements/${this.vendorStatement.id}/lines/${line.id}/dispute`, {
        dispute_note: note
      }).then(({
        data
      }) => this.showStatement(data)).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    draftVendorQuery() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/vendor-statements/${this.vendorStatement.id}/draft-query`, {}).then(({
        data
      }) => {
        this.queryDraft = _objectSpread(_objectSpread({}, data), {}, {
          title: "Ask the supplier about these lines",
          toLine: (data.to || []).join(", "),
          sent: false
        });
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    showStatement(data) {
      this.vendorStatement = data.statement;
      this.vendorLines = data.lines || [];
      this.vendorTotals = data.totals || {
        theirs: 0,
        ours: 0,
        difference: 0
      };
      this.vendorStates = data.states || this.vendorStates;
    },
    /** The TDS register: both directions, one quarter. With no year/quarter chosen yet, the server picks today's. */
    loadTds() {
      this.loading = true;
      const params = [];
      if (this.branchId) params.push("agent_id=" + this.branchId);
      if (this.tdsYear) params.push("financial_year=" + encodeURIComponent(this.tdsYear));
      if (this.tdsQuarter) params.push("quarter=" + this.tdsQuarter);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/reports/tds" + (params.length ? "?" + params.join("&") : "")).then(({
        data
      }) => {
        this.tds = data;
        this.tdsYear = data.financial_year;
        this.tdsQuarter = data.quarter;
        if (data.branches) this.branches = data.branches;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    downloadForm26q() {
      if (!this.tds) return;
      const params = [];
      if (this.branchId) params.push("agent_id=" + this.branchId);
      params.push("financial_year=" + encodeURIComponent(this.tdsYear));
      params.push("quarter=" + this.tdsQuarter);
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/reports/tds/form-26q?" + params.join("&"), {
        responseType: "blob"
      }).then(({
        data
      }) => {
        const url = window.URL.createObjectURL(new Blob([data], {
          type: "text/csv"
        }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `Form26Q-${this.tdsYear}-${this.tdsQuarter}.csv`;
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);
      }).catch(() => {
        this.error = "The return could not be built.";
      }).finally(() => {
        this.busy = false;
      });
    },
    loadDifferences() {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/reconciliation/differences" + (this.branchId ? "?agent_id=" + this.branchId : "")).then(({
        data
      }) => {
        this.differences = data.differences || [];
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    draftQuery(difference) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/reconciliation/${difference.transaction_id}/draft-query`, {
        kind: difference.kind
      }).then(({
        data
      }) => {
        this.queryDraft = _objectSpread(_objectSpread({}, data), {}, {
          title: "Ask the client about this payment",
          toLine: (data.to || []).join(", "),
          sent: false
        });
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    /** Sent from the person's own mailbox, through the same path as any other mail they write. */
    sendQuery() {
      const form = new FormData();
      this.queryDraft.toLine.split(",").map(a => a.trim()).filter(Boolean).forEach(a => form.append("to[]", a));
      form.append("subject", this.queryDraft.subject);
      form.append("body", this.queryDraft.body);
      form.append("include_signature", "1");
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/inbox/compose", form).then(() => {
        this.queryDraft = _objectSpread(_objectSpread({}, this.queryDraft), {}, {
          sent: true
        });
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
    },
    branchName(id) {
      const b = this.branches.find(x => x.id === id);
      return b ? b.name : "—";
    },
    load() {
      if (this.view === "vendors") {
        this.loadVendorStatements();
        return;
      }
      if (this.view === "tds") {
        this.loadTds();
        return;
      }
      this.loading = true;
      const params = [];
      if (this.view === "awaiting") params.push("awaiting=1");
      if (this.view !== "vouchers" && this.status) params.push("status=" + encodeURIComponent(this.status));
      if (this.view === "invoices" && this.outstanding) params.push("outstanding=1");
      if (this.branchId) params.push("agent_id=" + this.branchId);
      const path = {
        vouchers: "/vouchers",
        gst: "/registers/gst",
        unposted: "/registers/unposted",
        bank: "/reconciliation"
      }[this.view] || "/invoices";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(path + (params.length ? "?" + params.join("&") : "")).then(({
        data
      }) => {
        // The registers answer with their own shape: rows plus the totals that belong under them.
        this.rows = data.data || data.rows || [];
        this.totals = data.totals !== undefined ? data.totals : data.total !== undefined ? data.total : null;
        if (data.branches) this.branches = data.branches;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    /** A voucher's drawer: the journal a posting would write, and Post for accounts. */
    selectVoucher(row) {
      this.selected = row;
      this.tab = "journal";
      this.actionError = null;
      this.credit = null;
      this.previewLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/vouchers/${row.id}/posting-preview`).then(({
        data
      }) => {
        this.preview = data;
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.previewLoading = false;
      });
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
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/customers/${this.selected.customer_id}/credit`).then(({
        data
      }) => {
        this.credit = data;
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.creditLoading = false;
      });
    },
    loadPreview() {
      this.preview = null;
      this.previewLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/invoices/${this.selected.id}/posting-preview`).then(({
        data
      }) => {
        this.preview = data;
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.previewLoading = false;
      });
    },
    finalize() {
      this.commit(`/invoices/${this.selected.id}/finalize`);
    },
    post() {
      // The buy side posts through its own endpoint — same segregation, different document.
      this.commit(this.view === "vouchers" ? `/vouchers/${this.selected.id}/post` : `/invoices/${this.selected.id}/post`);
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
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(path, {}).then(({
        data
      }) => {
        const i = this.rows.findIndex(r => r.id === data.id);
        if (i !== -1) this.$set(this.rows, i, _objectSpread(_objectSpread({}, this.rows[i]), data));
        this.selected = _objectSpread(_objectSpread({}, this.selected), data);
        this.loadPreview();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Financials.vue?vue&type=template&id=668b6b5c":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Financials.vue?vue&type=template&id=668b6b5c ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Financials")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitleForView) + "\n      "), _c("router-link", {
    attrs: {
      to: "/money-in"
    }
  }, [_vm._v("Money in →")]), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/money-out"
    }
  }, [_vm._v("Money out →")]), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/close-month"
    }
  }, [_vm._v("Close the month →")]), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/how-were-doing"
    }
  }, [_vm._v("How we're doing →")]), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/settings/finance"
    }
  }, [_vm._v("Finance settings →")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar fx-financials__views"
  }, _vm._l(_vm.VIEWS, function (v) {
    return _c("button", {
      key: v.key,
      staticClass: "fx-btn",
      class: {
        "fx-btn--primary": _vm.view === v.key
      },
      on: {
        click: function ($event) {
          return _vm.showView(v.key);
        }
      }
    }, [_vm._v(_vm._s(v.label))]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.branchId,
      expression: "branchId"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.branchId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("All branches")]), _vm._v(" "), _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  })], 2)]) : _vm._e()]), _vm._v(" "), _vm.view === "invoices" || _vm.view === "awaiting" ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Status")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.status,
      expression: "status"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.status = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All")]), _vm._v(" "), _vm._l(_vm.STATUSES, function (s) {
    return _c("option", {
      key: s,
      domProps: {
        value: s
      }
    }, [_vm._v(_vm._s(s.replace(/_/g, " ")))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.outstanding,
      expression: "outstanding"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.outstanding) ? _vm._i(_vm.outstanding, null) > -1 : _vm.outstanding
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.outstanding,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.outstanding = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.outstanding = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.outstanding = $$c;
        }
      }, _vm.load]
    }
  }), _vm._v("\n      Outstanding only\n    ")])]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm.view === "vendors" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Supplier type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vendorForm.vendor_type,
      expression: "vendorForm.vendor_type"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.vendorForm, "vendor_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.loadVendors]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All")]), _vm._v(" "), _vm._l(_vm.vendorTypes, function (t) {
    return _c("option", {
      key: t,
      domProps: {
        value: t
      }
    }, [_vm._v(_vm._s(t.replace(/[_-]/g, " ")))]);
  })], 2)]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    on: {
      click: function ($event) {
        _vm.importingVendor = !_vm.importingVendor;
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.importingVendor ? "Cancel import" : "Import a statement") + "\n      ")])]), _vm._v(" "), _vm.importingVendor ? _c("section", {
    staticClass: "fx-section"
  }, [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Supplier")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vendorForm.vendor_id,
      expression: "vendorForm.vendor_id"
    }],
    staticClass: "fx-input",
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.vendorForm, "vendor_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.vendors, function (v) {
    return _c("option", {
      key: v.id,
      domProps: {
        value: v.id
      }
    }, [_vm._v(_vm._s(v.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Period")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vendorForm.period,
      expression: "vendorForm.period"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "2026-09 or Sep 2026 2nd half"
    },
    domProps: {
      value: _vm.vendorForm.period
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vendorForm, "period", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Their statement no.")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vendorForm.statement_no,
      expression: "vendorForm.statement_no"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.vendorForm.statement_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vendorForm, "statement_no", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "vendor-csv"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Paste their statement (CSV: awb or job, description, date, weight, rate, amount)")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.vendorForm.csv,
      expression: "vendorForm.csv"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "vendor-csv",
      rows: "6"
    },
    domProps: {
      value: _vm.vendorForm.csv
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.vendorForm, "csv", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Sending the same period again replaces it — a statement is their whole word for that month.")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.vendorForm.vendor_id || !_vm.vendorForm.period.trim() || !_vm.vendorForm.csv.trim() || !_vm.branchForImport
    },
    on: {
      click: _vm.importVendorStatement
    }
  }, [_vm._v(_vm._s(_vm.busy ? "Importing…" : "Import and compare"))]), _vm._v(" "), !_vm.branchForImport ? _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(" Choose a branch above first.")]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e(), _vm._v(" "), !_vm.vendorStatements.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No supplier statement has been imported yet.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.vendorStatements, function (st) {
    return _c("tr", {
      key: "vs-" + st.id,
      class: {
        "is-selected": _vm.vendorStatement && _vm.vendorStatement.id === st.id
      }
    }, [_c("td", [_vm._v(_vm._s(st.vendor))]), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s((st.vendor_type || "").replace(/[_-]/g, " ")))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(st.period))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: st.their_total,
        kind: "currency",
        "currency-code": st.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v("\n            " + _vm._s(st.lines) + " line(s)"), _vm.disagreeing(st) ? _c("span", [_vm._v(", " + _vm._s(_vm.disagreeing(st)) + " to check")]) : _vm._e()]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: st.difference,
        kind: "currency",
        "currency-code": st.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.openStatement(st.id);
        }
      }
    }, [_vm._v("Open")])])]);
  }), 0)]), _vm._v(" "), _vm.vendorStatement ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("\n        " + _vm._s(_vm.vendorStatement.vendor) + " — " + _vm._s(_vm.vendorStatement.period) + "\n      ")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.recompare
    }
  }, [_vm._v("Compare again")]), _vm._v(" "), _vm.canPost ? _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.draftVendorQuery
    }
  }, [_vm._v("Ask the supplier")]) : _vm._e()]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        They billed " + _vm._s(_vm.money(_vm.vendorTotals.theirs)) + "; we have " + _vm._s(_vm.money(_vm.vendorTotals.ours)) + " booked against these\n        shipments for this supplier — a difference of " + _vm._s(_vm.money(_vm.vendorTotals.difference)) + ".\n      ")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Their reference")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipment")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("What it is")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("They billed")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("We booked")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Difference")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Where it stands")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Queried")]) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.vendorLines, function (l) {
    return _c("tr", {
      key: "vl-" + l.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(l.reference || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(l.job_no || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(l.description || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.their_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [l.our_amount !== null ? _c("Figure", {
      attrs: {
        value: l.our_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [l.difference !== null ? _c("Figure", {
      attrs: {
        value: l.difference,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.vendorStates[l.state] || l.state))]), _vm._v(" "), _vm.canPost ? _c("td", [_c("input", {
      staticClass: "fx-input",
      attrs: {
        placeholder: "what we asked them"
      },
      domProps: {
        value: l.dispute_note
      },
      on: {
        change: function ($event) {
          return _vm.dispute(l, $event.target.value);
        }
      }
    })]) : _vm._e()]);
  }), 0)])]) : _vm._e()] : _vm.view === "tds" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Financial year")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.tdsYear,
      expression: "tdsYear"
    }],
    staticClass: "fx-input",
    staticStyle: {
      width: "6em"
    },
    attrs: {
      placeholder: "2026-27"
    },
    domProps: {
      value: _vm.tdsYear
    },
    on: {
      change: _vm.loadTds,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.tdsYear = $event.target.value;
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Quarter")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.tdsQuarter,
      expression: "tdsQuarter"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.tdsQuarter = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.loadTds]
    }
  }, _vm._l(["Q1", "Q2", "Q3", "Q4"], function (q) {
    return _c("option", {
      key: q,
      domProps: {
        value: q
      }
    }, [_vm._v(_vm._s(q))]);
  }), 0)]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.downloadForm26q
    }
  }, [_vm._v("Form 26Q (CSV)")])]), _vm._v(" "), _vm.tds ? [_c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Withheld last month (" + _vm._s(_vm.tds.deposit_due.month) + ")")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.tds.deposit_due.amount,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("Due to the government")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.tds.deposit_due.due_on,
      kind: "date"
    }
  }), _vm._v(" "), _vm.tds.deposit_due.overdue ? _c("StatusChip", {
    attrs: {
      value: "overdue"
    }
  }) : _vm._e()], 1)]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_vm._m(1), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_c("Figure", {
    attrs: {
      value: _vm.tds.payable.total,
      kind: "currency",
      "currency-code": "INR"
    }
  }), _vm._v(" across " + _vm._s(_vm.tds.payable.deductions) + "\n          deduction(s), on "), _c("Figure", {
    attrs: {
      value: _vm.tds.payable.base,
      kind: "currency",
      "currency-code": "INR"
    }
  }), _vm._v(" of base.\n          "), _vm.tds.payable.without_pan ? _c("span", [_vm._v(" " + _vm._s(_vm.tds.payable.without_pan) + " with no PAN on record — deducted at 20% under s.206AA.")]) : _vm._e(), _vm._v(" "), Math.abs(_vm.tds.ledger.payable - _vm.tds.payable.total) > 0.01 ? _c("span", {
    staticClass: "fx-error"
  }, [_vm._v("\n            Ledger shows " + _vm._s(_vm.money(_vm.tds.ledger.payable)) + " — a posting went somewhere else.\n          ")]) : _vm._e()], 1), _vm._v(" "), _vm.tds.payable.rows.length ? _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(2), _vm._v(" "), _c("tbody", _vm._l(_vm.tds.payable.rows, function (r) {
    return _c("tr", {
      key: "p-" + r.id
    }, [_c("td", [_vm._v(_vm._s(r.counterparty || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [r.counterparty_pan ? _c("span", [_vm._v(_vm._s(r.counterparty_pan))]) : _c("span", {
      staticClass: "fx-error"
    }, [_vm._v("No PAN — 20%")])]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.section))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.rate))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.base_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.tds_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: r.deducted_on,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.document_no || "—"))])]);
  }), 0)]) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing withheld this quarter.")])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_vm._m(3), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_c("Figure", {
    attrs: {
      value: _vm.tds.receivable.total,
      kind: "currency",
      "currency-code": "INR"
    }
  }), _vm._v(" across " + _vm._s(_vm.tds.receivable.deductions) + "\n          deduction(s) — claimed against Form 26AS, no deadline.\n          "), Math.abs(_vm.tds.ledger.receivable - _vm.tds.receivable.total) > 0.01 ? _c("span", {
    staticClass: "fx-error"
  }, [_vm._v("\n            Ledger shows " + _vm._s(_vm.money(_vm.tds.ledger.receivable)) + " — a posting went somewhere else.\n          ")]) : _vm._e()], 1), _vm._v(" "), _vm.tds.receivable.rows.length ? _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(4), _vm._v(" "), _c("tbody", _vm._l(_vm.tds.receivable.rows, function (r) {
    return _c("tr", {
      key: "r-" + r.id
    }, [_c("td", [_vm._v(_vm._s(r.counterparty || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.section))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.rate))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.base_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.tds_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: r.deducted_on,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.document_no || "—"))])]);
  }), 0)]) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing deducted from us this quarter.")])]), _vm._v(" "), _vm.tds.unclassified_vendors.length ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Vendors paid this year with no TDS section set")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Not an error — plenty of payees are legitimately outside TDS. Set one on the vendor in the\n          directory if they should be deducted from.\n        ")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(5), _vm._v(" "), _c("tbody", _vm._l(_vm.tds.unclassified_vendors, function (v) {
    return _c("tr", {
      key: "u-" + v.id
    }, [_c("td", [_vm._v(_vm._s(v.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(v.payments))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: v.paid,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0)])]) : _vm._e()] : _vm._e()] : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No documents match.")]) : _vm.view === "bank" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("button", {
    staticClass: "fx-btn",
    on: {
      click: function ($event) {
        _vm.importing = !_vm.importing;
      }
    }
  }, [_vm._v(_vm._s(_vm.importing ? "Cancel import" : "Import a statement"))]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.loadDifferences
    }
  }, [_vm._v("Credited vs billed")])]), _vm._v(" "), _vm.importing ? _c("section", {
    staticClass: "fx-section"
  }, [_c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "bank-csv"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Paste the statement (CSV: date, reference, narration, credit, debit)")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.csv,
      expression: "csv"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "bank-csv",
      rows: "6"
    },
    domProps: {
      value: _vm.csv
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.csv = $event.target.value;
      }
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.csv.trim() || !_vm.branchForImport
    },
    on: {
      click: _vm.importStatement
    }
  }, [_vm._v("\n        " + _vm._s(_vm.busy ? "Importing…" : "Import") + "\n      ")]), _vm._v(" "), !_vm.branchForImport ? _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(" Choose a branch above first.")]) : _vm._e(), _vm._v(" "), _vm.importResult ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        " + _vm._s(_vm.importResult.imported) + " new, " + _vm._s(_vm.importResult.repeated) + " already had, " + _vm._s(_vm.importResult.skipped) + " skipped\n        (a line with no reference cannot be told apart from the next one).\n      ")]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.differences.length ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Credited vs billed")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("What happened")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Invoice")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Billed")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Credited")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Difference")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Bank says")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.differences, function (d) {
    return _c("tr", {
      key: "d-" + d.transaction_id + d.kind
    }, [_c("td", [d.kind === "short" ? _c("span", [_vm._v("Paid short")]) : d.kind === "over" ? _c("span", [_vm._v("Paid more than billed")]) : _c("span", [_vm._v("Cannot be placed")])]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(d.invoice_no || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [d.billed ? _c("Figure", {
      attrs: {
        value: d.billed,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", [_vm._v("—")])], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: d.received,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: d.difference,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(d.narration || d.reference || "—"))]), _vm._v(" "), _vm.canPost ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.draftQuery(d);
        }
      }
    }, [_vm._v("Ask the client")])]) : _vm._e()]);
  }), 0)])]) : _vm._e(), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Bank reference")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Settled against")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (t) {
    return _c("tr", {
      key: "b-" + t.id,
      class: {
        "is-selected": _vm.bankRow && _vm.bankRow.id === t.id
      }
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(t.plaid_transaction_id || t.id))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: t.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: t.reconciliation_status
      }
    })], 1), _vm._v(" "), _c("td", [t.matched_invoice ? _c("span", [_vm._v(_vm._s(t.matched_invoice.invoice_no))]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])]), _vm._v(" "), _vm.canPost ? _c("td", {
      staticClass: "fx-row-actions"
    }, [!t.matched_invoice ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.findCandidates(t);
        }
      }
    }, [_vm._v("Find the invoice")]) : _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.unmatch(t);
        }
      }
    }, [_vm._v("Unmatch")])]) : _vm._e()]);
  }), 0)]), _vm._v(" "), !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing is waiting to be reconciled.")]) : _vm._e(), _vm._v(" "), _vm.bankRow ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("\n        What this " + _vm._s(_vm.money(_vm.bankRow.amount)) + " could settle\n      ")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.candidateNote))]), _vm._v(" "), !_vm.candidates.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No open invoice matches this amount.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Invoice")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Outstanding")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Confidence")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Why")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.candidates, function (c) {
    return _c("tr", {
      key: "c-" + c.invoice.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(c.invoice.invoice_no))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(c.invoice.customer ? c.invoice.customer.name : "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: c.invoice.outstanding,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: c.confidence
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(c.reason))]), _vm._v(" "), _vm.canPost ? _c("td", {
      staticClass: "fx-row-actions"
    }, [c.variance < 0 ? _c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.resolution,
        expression: "resolution"
      }],
      staticClass: "fx-input",
      on: {
        change: function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.resolution = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
        }
      }
    }, [_c("option", {
      attrs: {
        value: ""
      }
    }, [_vm._v("Still owed (short paid)")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "tds"
      }
    }, [_vm._v("The client deducted TDS")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "write_off"
      }
    }, [_vm._v("Write the difference off")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "discount"
      }
    }, [_vm._v("Treat it as a discount")])]) : _vm._e(), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--primary",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.matchTo(c);
        }
      }
    }, [_vm._v("Settle")])]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]) : _vm._e()] : _vm.view === "reports" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Report")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.report,
      expression: "report"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.report = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.loadReport]
    }
  }, _vm._l(_vm.REPORTS, function (r) {
    return _c("option", {
      key: r.key,
      domProps: {
        value: r.key
      }
    }, [_vm._v(_vm._s(r.label))]);
  }), 0)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Period")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.periodId,
      expression: "periodId",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return _vm._n(val);
        });
        _vm.periodId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.loadReport]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose a period")]), _vm._v(" "), _vm._l(_vm.visiblePeriods, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v("\n            " + _vm._s(p.period_name) + _vm._s(_vm.branches.length > 1 ? " · " + _vm.branchName(p.agent_id) : "") + " · " + _vm._s(p.status) + "\n          ")]);
  })], 2)])]), _vm._v(" "), !_vm.periodId ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      A report runs over a period, never a date range — half a period is a figure nobody can reconcile against\n      anything they have filed.\n    ")]) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Click any account to see the postings behind it, and the documents behind those.")])] : _vm.view === "periods" ? [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Period")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("From")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("To")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.visiblePeriods, function (p) {
    return _c("tr", {
      key: "p-" + p.id
    }, [_c("td", [_vm._v(_vm._s(p.period_name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.branchName(p.agent_id)))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: p.start_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: p.end_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: p.status
      }
    })], 1), _vm._v(" "), _vm.canPost ? _c("td", {
      staticClass: "fx-row-actions"
    }, [p.status === "open" ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.closePeriod(p);
        }
      }
    }, [_vm._v("Close")]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("closed")])]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.canPost ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Open a period")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newPeriod.agent_id,
      expression: "newPeriod.agent_id",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return _vm._n(val);
        });
        _vm.$set(_vm.newPeriod, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  }), 0)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Name")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newPeriod.period_name,
      expression: "newPeriod.period_name"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "September 2026"
    },
    domProps: {
      value: _vm.newPeriod.period_name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newPeriod, "period_name", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("From")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newPeriod.start_date,
      expression: "newPeriod.start_date"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.newPeriod.start_date
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newPeriod, "start_date", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("To")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newPeriod.end_date,
      expression: "newPeriod.end_date"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.newPeriod.end_date
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newPeriod, "end_date", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.newPeriodValid
    },
    on: {
      click: _vm.openPeriod
    }
  }, [_vm._v("Open")])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        Nothing can be posted into a month without an open period, and closing one stops anything else being posted\n        into it. Only accounts opens or closes a period.\n      ")])]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm.view === "gst" ? [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(6), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (r) {
    return _c("tr", {
      key: "g-" + r.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.invoice_no || r.voucher_type))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.direction === "input" ? "Paid (input credit)" : "Charged"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.customer || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.branch))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: r.document_date || r.created_at,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.cgst_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.sgst_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.igst_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0), _vm._v(" "), _vm.totals && _vm.totals.output ? _c("tfoot", [_c("tr", [_vm._m(7), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.output.cgst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.output.sgst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.output.igst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("tr", [_vm._m(8), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.input.cgst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.input.sgst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.input.igst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])]) : _vm._e()]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      Written when a document is posted — sales and purchases both: CGST and SGST within the state, IGST across it.\n      Nothing here is edited — it is what was charged.\n    ")])] : _vm.view === "unposted" ? [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(9), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (r) {
    return _c("tr", {
      key: "u-" + r.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [r.number ? _c("span", [_vm._v(_vm._s(r.number))]) : _c("span", {
      staticClass: "is-empty",
      attrs: {
        "aria-label": "Not yet numbered"
      }
    })]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.source_type === "invoice" ? "Invoice" : "Purchase voucher"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.branch))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: r.created_at,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.created_by || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.waiting_for))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.net_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0), _vm._v(" "), _vm.totals !== null ? _c("tfoot", [_c("tr", [_vm._m(10), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])]) : _vm._e()]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Each stays here until it is posted; posting removes it from this list.")])] : _vm.view === "vouchers" ? _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(11), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: "v-" + row.id,
      staticClass: "is-clickable",
      class: {
        "is-selected": _vm.selected && _vm.selected.id === row.id
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.selectVoucher(row);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.selectVoucher(row);
        }
      }
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(row.voucher_no))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.vendor ? row.vendor.name : "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(row.job_no || row.job_id))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: row.document_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: row.status
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: row.is_posted ? "posted" : "unposted"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: row.net_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0)]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_vm.view === "awaiting" ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipment")]) : _vm._e(), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Invoice")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Customer")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Posted")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Total")]), _vm._v(" "), _vm.view === "awaiting" ? [_c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Cost")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Margin")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Sent by")])] : [_c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Paid")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Balance")])]], 2)]), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: row.id,
      staticClass: "is-clickable",
      class: {
        "is-selected": _vm.selected && _vm.selected.id === row.id
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.select(row);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.select(row);
        }
      }
    }, [_vm.view === "awaiting" ? _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(row.job_no))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [row.invoice_no ? _c("span", [_vm._v(_vm._s(row.invoice_no))]) : _c("span", {
      staticClass: "is-empty",
      attrs: {
        "aria-label": "Not yet numbered"
      }
    })]), _vm._v(" "), _c("td", [row.customer ? _c("span", [_vm._v(_vm._s(row.customer.name))]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("Partner-billed")])]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: row.document_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: row.status
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: row.is_posted ? "posted" : "unposted"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: _vm.view === "awaiting" ? row.sell_total : row.grand_total,
        kind: "currency",
        "currency-code": row.currency || "INR"
      }
    })], 1), _vm._v(" "), _vm.view === "awaiting" ? [_c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: row.buy_total,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [row.margin !== null ? _c("Figure", {
      attrs: {
        value: row.margin,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.sent_to_accounts_by || "—"))])] : [_c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: row.amount_paid,
        kind: "currency",
        "currency-code": row.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: _vm.balanceOf(row),
        kind: "currency",
        "currency-code": row.currency || "INR"
      }
    })], 1)]], 2);
  }), 0)]), _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: !!_vm.selected,
      title: _vm.selected ? _vm.selected.invoice_no || "Draft invoice" : "",
      subtitle: _vm.drawerSubtitle,
      tabs: _vm.view === "vouchers" ? _vm.VOUCHER_TABS : _vm.TABS,
      "active-tab": _vm.tab
    },
    on: {
      tab: function ($event) {
        _vm.tab = $event;
      },
      close: _vm.deselect
    },
    scopedSlots: _vm._u([{
      key: "footer",
      fn: function () {
        return [_c("button", {
          staticClass: "fx-btn",
          on: {
            click: _vm.deselect
          }
        }, [_vm._v("Close")]), _vm._v(" "), _vm.canPost && _vm.selected ? [_vm.view !== "vouchers" && _vm.selected.status === "draft" ? _c("button", {
          staticClass: "fx-btn fx-btn--primary",
          attrs: {
            disabled: _vm.busy
          },
          on: {
            click: _vm.finalize
          }
        }, [_vm._v("Finalize")]) : !_vm.selected.is_posted ? _c("button", {
          staticClass: "fx-btn fx-btn--primary",
          attrs: {
            disabled: _vm.busy || _vm.preview && !_vm.preview.balanced
          },
          on: {
            click: _vm.post
          }
        }, [_vm._v("Post to Ledger")]) : _vm._e()] : _vm._e()];
      },
      proxy: true
    }])
  }, [_vm.selected ? [_vm.tab === "credit" ? _c("section", {
    staticClass: "fx-section"
  }, [!_vm.selected.customer_id ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          This document is billed to a partner, so there is no customer credit to check —\n          credit, collections and AR are customer-only concepts.\n        ")]) : _vm.creditLoading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.credit ? [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v(_vm._s(_vm.credit.customer.name) + " — this billing entity")]), _vm._v(" "), _c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Credit limit")]), _vm._v(" "), _c("dd", [_vm.credit.branch.limit === null ? _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("Not configured")]) : _c("Figure", {
    attrs: {
      value: _vm.credit.branch.limit,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("Current exposure")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.credit.branch.exposure,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("Standing")]), _vm._v(" "), _c("dd", [_c("StatusChip", {
    attrs: {
      value: _vm.credit.branch.blocked ? "credit_hold" : "within_limit"
    }
  })], 1)]), _vm._v(" "), _vm.credit.group && _vm.credit.group.members > 1 ? [_c("h3", {
    staticClass: "fx-section__title",
    staticStyle: {
      "margin-top": "var(--space-5)"
    }
  }, [_vm._v("\n              Group roll-up — " + _vm._s(_vm.credit.group.members) + " billing entities\n            ")]), _vm._v(" "), _c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Combined exposure")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.credit.group.exposure,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted",
    staticStyle: {
      "margin-top": "var(--space-2)"
    }
  }, [_vm._v("\n              Shown for context only. The gate is applied per billing entity, so this\n              total never blocks anything on its own.\n            ")])] : _vm._e()] : _vm._e()], 2) : _c("section", {
    staticClass: "fx-section"
  }, [_vm.previewLoading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.preview ? [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("The journal this posting writes")]), _vm._v(" "), _c("table", {
    staticClass: "fx-journal"
  }, [_c("tbody", _vm._l(_vm.preview.lines, function (l, i) {
    return _c("tr", {
      key: i
    }, [_c("td", {
      staticClass: "fx-journal__dc"
    }, [_vm._v(_vm._s(l.debit > 0 ? "Dr" : "Cr"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(l.code))]), _vm._v(" "), _c("td", {
      staticClass: "fx-journal__amt"
    }, [_c("Figure", {
      attrs: {
        value: l.debit > 0 ? l.debit : l.credit,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    class: _vm.preview.balanced ? "fx-journal__balanced" : "fx-journal__unbalanced",
    attrs: {
      colspan: "2"
    }
  }, [_vm._v("\n                  " + _vm._s(_vm.preview.balanced ? "balanced ✓" : "OUT OF BALANCE") + "\n                ")]), _vm._v(" "), _c("td", {
    staticClass: "fx-journal__amt"
  }, [_c("Figure", {
    attrs: {
      value: _vm.preview.debits,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])])]), _vm._v(" "), _vm.alreadyPosted ? _c("p", {
    staticClass: "fx-muted",
    staticStyle: {
      "margin-top": "var(--space-3)"
    }
  }, [_vm._v("\n            Already posted. This is the journal that was written.\n          ")]) : _c("p", {
    staticClass: "fx-warn",
    staticStyle: {
      "margin-top": "var(--space-3)"
    }
  }, [_vm._v("\n            Posting cannot be undone. A correction requires a credit note.\n          ")])] : _vm._e()], 2), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm._e()], 2), _vm._v(" "), _vm.queryDraft ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "query-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "query-title"
    }
  }, [_vm._v(_vm._s(_vm.queryDraft.title))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body fx-newmail"
  }, [_c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Written from the figures" + _vm._s(_vm.queryDraft.written_by === "ai" ? " by the model" : "") + "; every number comes\n          from our own records. Edit anything before it goes.\n        ")]), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "query-to"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("To")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.queryDraft.toLine,
      expression: "queryDraft.toLine"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "query-to",
      placeholder: "comma separated"
    },
    domProps: {
      value: _vm.queryDraft.toLine
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.queryDraft, "toLine", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "query-subject"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Subject")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.queryDraft.subject,
      expression: "queryDraft.subject"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "query-subject"
    },
    domProps: {
      value: _vm.queryDraft.subject
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.queryDraft, "subject", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("MailEditor", {
    model: {
      value: _vm.queryDraft.body,
      callback: function ($$v) {
        _vm.$set(_vm.queryDraft, "body", $$v);
      },
      expression: "queryDraft.body"
    }
  }), _vm._v(" "), _vm.queryDraft.sent ? _c("p", {
    staticClass: "fx-notice",
    attrs: {
      role: "status"
    }
  }, [_vm._v("Sent from your mailbox.")]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()], 1), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.queryDraft = null;
      }
    }
  }, [_vm._v("Close")]), _vm._v(" "), !_vm.queryDraft.sent ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.queryDraft.toLine.trim()
    },
    on: {
      click: _vm.sendQuery
    }
  }, [_vm._v("\n          " + _vm._s(_vm.busy ? "Sending…" : "Send from my mailbox") + "\n        ")]) : _vm._e()])])]) : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Supplier")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Type")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Period")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("They say")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Lines")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Difference")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("\n          Deducted BY us — payable "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("2300-TDS-Payable")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Vendor")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("PAN")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Section")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate %")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Base")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("TDS")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Deducted")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("\n          Deducted FROM us — receivable "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("1400-TDS-Receivable")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Section")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate %")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Base")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("TDS")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Deducted")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Vendor")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Payments")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Paid")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Tax")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client or supplier")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("CGST")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("SGST")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("IGST")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", {
    attrs: {
      colspan: "5"
    }
  }, [_c("strong", [_vm._v("Tax charged")]), _vm._v(" "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("credit notes subtracted")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", {
    attrs: {
      colspan: "5"
    }
  }, [_c("strong", [_vm._v("Input credit")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Kind")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Raised")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("By")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Waiting for")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", {
    attrs: {
      colspan: "6"
    }
  }, [_c("strong", [_vm._v("Total waiting")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Voucher")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Supplier")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipment")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Posted")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Total")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Financials.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Financials.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Financials_vue_vue_type_template_id_668b6b5c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Financials.vue?vue&type=template&id=668b6b5c */ "./resources/js/src/view/pages/freight/Financials.vue?vue&type=template&id=668b6b5c");
/* harmony import */ var _Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Financials.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/Financials.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Financials_vue_vue_type_template_id_668b6b5c__WEBPACK_IMPORTED_MODULE_0__.render,
  _Financials_vue_vue_type_template_id_668b6b5c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/Financials.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Financials.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Financials.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Financials.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Financials.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Financials.vue?vue&type=template&id=668b6b5c":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Financials.vue?vue&type=template&id=668b6b5c ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_template_id_668b6b5c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_template_id_668b6b5c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_template_id_668b6b5c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Financials.vue?vue&type=template&id=668b6b5c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Financials.vue?vue&type=template&id=668b6b5c");


/***/ })

}]);