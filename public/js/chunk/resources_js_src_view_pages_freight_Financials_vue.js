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
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
/* harmony import */ var _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/FxDrawer.vue */ "./resources/js/src/view/pages/freight/components/FxDrawer.vue");
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
  key: "unposted",
  label: "Not yet posted"
}, {
  key: "reports",
  label: "Reports"
}, {
  key: "periods",
  label: "Periods"
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
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
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
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_4__.mapGetters)(["designation"])), {}, {
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
    newPeriodValid() {
      const p = this.newPeriod;
      return p.agent_id && p.period_name.trim() && p.start_date && p.end_date && p.start_date <= p.end_date;
    },
    /** The queue is the hand-over; the receivables and payables are the registers themselves. */
    subtitleForView() {
      return {
        awaiting: "Cost sheets pricing has sent across, with what each shipment sells for and what it cost. Finalize one to bill it.",
        gst: "The tax charged on every finalized document, for GSTR-1. Read-only — it is what was charged.",
        reports: "What the ledger proves, over one period of one branch.",
        periods: "The months the ledger is open for. Nothing posts into a month without an open period.",
        unposted: "Documents raised and not yet in the ledger, and what each is waiting for.",
        invoices: "The receivables register for this branch. Select a row to see the client's credit standing and the journal a posting would write.",
        vouchers: "What this branch owes its suppliers, one voucher per supplier per shipment. Select one to see the journal a posting would write."
      }[this.view];
    }
  }),
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
      this.reportData = null;
      if (key === "reports" || key === "periods") {
        this.loadPeriods();
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
    branchName(id) {
      const b = this.branches.find(x => x.id === id);
      return b ? b.name : "—";
    },
    load() {
      this.loading = true;
      const params = [];
      if (this.view === "awaiting") params.push("awaiting=1");
      if (this.view !== "vouchers" && this.status) params.push("status=" + encodeURIComponent(this.status));
      if (this.view === "invoices" && this.outstanding) params.push("outstanding=1");
      if (this.branchId) params.push("agent_id=" + this.branchId);
      const path = {
        vouchers: "/vouchers",
        gst: "/registers/gst",
        unposted: "/registers/unposted"
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
  }, [_vm._v(_vm._s(_vm.subtitleForView))])]), _vm._v(" "), _c("div", {
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
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No documents match.")]) : _vm.view === "reports" ? [_c("div", {
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
  }, [_vm._v("\n      A report runs over a period, never a date range — half a period is a figure nobody can reconcile against\n      anything they have filed.\n    ")]) : _vm.reportLoading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.reportData ? [_vm.report === "profit-and-loss" ? _c("table", {
    staticClass: "fx-table"
  }, [_c("tbody", [_vm._m(0), _vm._v(" "), _vm._l(_vm.reportData.revenue.lines, function (l) {
    return _c("tr", {
      key: "r-" + l.code
    }, [_c("td", [_vm._v(_vm._s(l.code) + " " + _vm._s(l.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), _vm._v(" "), _c("tr", [_vm._m(1), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.revenue.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _vm._m(2), _vm._v(" "), _vm._l(_vm.reportData.expense.lines, function (l) {
    return _c("tr", {
      key: "e-" + l.code
    }, [_c("td", [_vm._v(_vm._s(l.code) + " " + _vm._s(l.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), _vm._v(" "), _c("tr", [_vm._m(3), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.expense.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])], 2), _vm._v(" "), _c("tfoot", [_c("tr", [_vm._m(4), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.net,
      kind: "currency",
      "currency-code": "INR"
    }
  }), _vm._v(" "), _vm.reportData.margin_pct !== null ? _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(" · " + _vm._s(_vm.reportData.margin_pct) + "%")]) : _vm._e()], 1)])])]) : _vm.report === "balance-sheet" ? _c("table", {
    staticClass: "fx-table"
  }, [_c("tbody", [_vm._m(5), _vm._v(" "), _vm._l(_vm.reportData.assets.lines, function (l) {
    return _c("tr", {
      key: "a-" + l.code
    }, [_c("td", [_vm._v(_vm._s(l.code) + " " + _vm._s(l.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), _vm._v(" "), _c("tr", [_vm._m(6), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.assets.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _vm._m(7), _vm._v(" "), _vm._l(_vm.reportData.liabilities.lines, function (l) {
    return _c("tr", {
      key: "l-" + l.code
    }, [_c("td", [_vm._v(_vm._s(l.code) + " " + _vm._s(l.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), _vm._v(" "), _c("tr", [_vm._m(8), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.liabilities.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])], 2), _vm._v(" "), _c("tfoot", [_c("tr", [_vm._m(9), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.equity,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])])]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(10), _vm._v(" "), _c("tbody", _vm._l(_vm.reportData.accounts, function (a) {
    return _c("tr", {
      key: "t-" + a.code
    }, [_c("td", [_vm._v(_vm._s(a.code) + " " + _vm._s(a.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: a.debit,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: a.credit,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    class: _vm.reportData.balanced ? "fx-journal__balanced" : "fx-journal__unbalanced"
  }, [_vm._v("\n              " + _vm._s(_vm.reportData.balanced ? "balanced ✓" : "OUT OF BALANCE by " + _vm.reportData.difference) + "\n            ")]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.totals.debit,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.reportData.totals.credit,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])])])] : _vm._e()] : _vm.view === "periods" ? [_c("table", {
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
  }, [_vm._m(11), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (r) {
    return _c("tr", {
      key: "g-" + r.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.invoice_no || r.voucher_type))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.customer || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.branch))]), _vm._v(" "), _c("td", [_c("Figure", {
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
  }), 0), _vm._v(" "), _vm.totals ? _c("tfoot", [_c("tr", [_vm._m(12), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.cgst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.sgst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.totals.igst,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])]) : _vm._e()]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      Written when a document is finalized: CGST and SGST within the state, IGST across it. Nothing here is edited —\n      it is what was charged.\n    ")])] : _vm.view === "unposted" ? [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(13), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (r) {
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
  }), 0), _vm._v(" "), _vm.totals !== null ? _c("tfoot", [_c("tr", [_vm._m(14), _c("td", {
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
  }, [_vm._m(15), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
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
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm._e()], 2)], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_c("strong", [_vm._v("Revenue")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Total revenue")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_c("strong", [_vm._v("Expense")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Total expense")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Net")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_c("strong", [_vm._v("Assets")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Total assets")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_c("strong", [_vm._v("Liabilities")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Total liabilities")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Retained earnings (the residual)")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Account")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Debit")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Credit")])])]);
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
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
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
      colspan: "4"
    }
  }, [_c("strong", [_vm._v("Total")])]);
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