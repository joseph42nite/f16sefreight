"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_Billing_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Billing.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Billing.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




const STATUSES = ["draft", "finalized", "sent", "partially_paid", "paid", "void"];

/** Logi-Sys's Billing section, as the three things this desk actually does (user, 2026-09-19). */
const VIEWS = [{
  key: "documents",
  label: "Documents"
}, {
  key: "receipts",
  label: "Receipts"
}, {
  key: "einvoice",
  label: "E-Invoice"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Billing",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    view: "documents",
    VIEWS,
    STATUSES,
    rows: [],
    totals: {
      count: 0,
      amount_inr: 0,
      outstanding_inr: 0
    },
    branches: [],
    types: {},
    currencies: [],
    raisedBy: [],
    filters: {
      type: "",
      agent_id: null,
      from: "",
      to: "",
      q: "",
      status: "",
      currency: "",
      created_by: null,
      sort: "date",
      outstanding: false,
      exclude_credit_notes: false
    },
    /** Which rows are ticked for printing or mailing. */
    picked: {},
    receipts: [],
    modes: [],
    eInvoices: [],
    eInvoiceNote: "",
    /** The document being raised, the receipt being recorded, the IRN being typed. */
    raise: null,
    creditRoom: null,
    jobs: [],
    partners: [],
    receipt: null,
    openDocuments: [],
    allocation: {},
    resolution: {},
    clients: [],
    irnFor: null,
    loading: true,
    busy: false,
    error: null,
    actionError: null,
    mailResult: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(["designation"])), {}, {
    /* Only accounts raise and send a bill. The Boss reads the register. */
    canPost() {
      return this.designation === "accounts";
    },
    subtitleForView() {
      return {
        documents: "Every sales document this branch has raised — invoices, notes, brokerage and consol — with what it was billed in and what it is worth in INR.",
        receipts: "Money received, and the documents each payment settled.",
        einvoice: "What has been through the invoice registration portal, and what is still waiting."
      }[this.view];
    },
    chosen() {
      return this.rows.filter(r => this.picked[r.id]).map(r => r.id);
    },
    allChosen() {
      return this.rows.length > 0 && this.chosen.length === this.rows.length;
    },
    isNote() {
      return this.raise && ["debit_note", "credit_note"].includes(this.raise.type);
    },
    /** Only a numbered, unvoided invoice can carry a note. */
    billable() {
      return this.rows.filter(r => r.type === "invoice" && !["draft", "void"].includes(r.status));
    },
    raiseTotal() {
      return this.raise ? this.raise.lines.reduce((sum, l) => sum + this.lineNet(l), 0) : 0;
    },
    raiseValid() {
      if (!this.raise) return false;
      const linesOk = this.raise.lines.every(l => l.description && Number(l.rate) > 0);
      return linesOk && (this.isNote ? !!this.raise.parent_invoice_id && !!(this.raise.reason || "").trim() : !!this.raise.job_id && !!this.raise.partner_id);
    },
    placedTotal() {
      return Object.values(this.allocation).reduce((sum, v) => sum + (Number(v) || 0), 0);
    },
    receiptValid() {
      return !!(this.receipt && this.receipt.agent_id && Number(this.receipt.amount) > 0 && this.placedTotal <= Number(this.receipt.amount) + 0.009);
    }
  }),
  created() {
    this.load();
  },
  methods: {
    showView(key) {
      this.view = key;
      this.actionError = null;
      this.mailResult = null;
      this.load();
    },
    typeLabel(type) {
      return this.types[type] && this.types[type].label || type;
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
    },
    lineNet(line) {
      const amount = (Number(line.quantity) || 0) * (Number(line.rate) || 0);
      return Math.round(amount * (1 + (Number(line.tax_percentage) || 0) / 100) * 100) / 100;
    },
    blankLine() {
      return {
        description: "",
        hsn_sac_code: "",
        quantity: 1,
        rate: 0,
        tax_percentage: 18
      };
    },
    query() {
      const params = [];
      if (this.filters.type) params.push("types[]=" + this.filters.type);
      ["agent_id", "from", "to", "q", "status", "currency", "created_by", "sort"].forEach(key => {
        if (this.filters[key]) params.push(key + "=" + encodeURIComponent(this.filters[key]));
      });
      if (this.filters.outstanding) params.push("outstanding=1");
      if (this.filters.exclude_credit_notes) params.push("exclude_credit_notes=1");
      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;
      const path = {
        receipts: "/receipts",
        einvoice: "/billing/e-invoice"
      }[this.view] || "/billing";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(path + (this.view === "documents" ? this.query() : "")).then(({
        data
      }) => {
        if (this.view === "documents") {
          this.rows = data.rows || [];
          this.totals = data.totals;
          this.types = data.types || {};
          this.currencies = data.currencies || [];
          this.raisedBy = data.created_by || [];
          this.picked = {};
        } else if (this.view === "receipts") {
          this.receipts = data.rows || [];
          this.modes = data.modes || [];
        } else {
          this.eInvoices = data.rows || [];
          this.eInvoiceNote = data.note || "";
        }
        if (data.branches) this.branches = data.branches;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    toggleAll() {
      const on = !this.allChosen;
      const picked = {};
      this.rows.forEach(r => {
        picked[r.id] = on;
      });
      this.picked = picked;
    },
    /** The bills come back as a PDF, so they are fetched as bytes and opened, never linked to. */
    printBills() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].postForFile("/billing/print", {
        ids: this.chosen
      }).then(({
        data
      }) => this.openFile(data, "application/pdf")).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    exportCsv() {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/billing/export" + this.query(), {
        responseType: "blob"
      }).then(({
        data
      }) => this.openFile(data, "text/csv", "billing.csv")).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    openFile(data, mime, download) {
      const url = window.URL.createObjectURL(new Blob([data], {
        type: mime
      }));
      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = download;
        link.click();
      } else {
        window.open(url, "_blank");
      }
      setTimeout(() => window.URL.revokeObjectURL(url), 30000);
    },
    mailBills() {
      this.busy = true;
      this.actionError = null;
      this.mailResult = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/billing/mail", {
        ids: this.chosen
      }).then(({
        data
      }) => {
        this.mailResult = data;
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    openRaise(type) {
      this.actionError = null;
      this.creditRoom = null;
      this.raise = {
        type,
        parent_invoice_id: null,
        job_id: null,
        partner_id: null,
        basis: "flat_rate",
        reason: "",
        narration: "",
        lines: [this.blankLine()]
      };
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/jobs?per_page=50").then(({
        data
      }) => {
        this.jobs = data.data || data.rows || [];
      }).catch(() => {});
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners").then(({
        data
      }) => {
        this.partners = data.data || [];
      }).catch(() => {});
    },
    loadCreditRoom() {
      this.creditRoom = null;
      if (!this.raise.parent_invoice_id) return;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/billing/${this.raise.parent_invoice_id}/credit-room`).then(({
        data
      }) => {
        this.creditRoom = data;
      }).catch(() => {});
    },
    saveRaise() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/billing/documents", this.raise).then(() => {
        this.raise = null;
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    openReceipt() {
      this.actionError = null;
      this.openDocuments = [];
      this.allocation = {};
      this.resolution = {};
      this.receipt = {
        agent_id: this.branches.length ? this.branches[0].id : null,
        payer_id: null,
        receipt_date: new Date().toISOString().slice(0, 10),
        mode: "bank_transfer",
        reference: "",
        amount: 0
      };
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/customers").then(({
        data
      }) => {
        this.clients = data.data || [];
      }).catch(() => {});
    },
    loadOpenDocuments() {
      this.openDocuments = [];
      this.allocation = {};
      if (!this.receipt.payer_id) return;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/receipts/open-documents?customer_id=${this.receipt.payer_id}`).then(({
        data
      }) => {
        this.openDocuments = data.rows || [];
      }).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    saveReceipt() {
      const allocations = this.openDocuments.filter(d => Number(this.allocation[d.id]) > 0).map(d => _objectSpread({
        invoice_id: d.id,
        amount: Number(this.allocation[d.id])
      }, this.resolution[d.id] ? {
        resolution: this.resolution[d.id]
      } : {}));
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/receipts", _objectSpread(_objectSpread({}, this.receipt), {}, {
        allocations
      })).then(() => {
        this.receipt = null;
        this.view = "receipts";
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    postReceipt(row) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/receipts/${row.id}/post`, {}).then(() => this.load()).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    saveIrn() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/billing/${this.irnFor.id}/irn`, {
        irn: this.irnFor.irn,
        ack_no: this.irnFor.ack_no
      }).then(() => {
        this.irnFor = null;
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    /* The server's own message, verbatim: "only 4,000 is left to credit" is actionable
       where "something went wrong" sends somebody to ask a colleague. */
    messageFor(e) {
      return e.response && e.response.data && e.response.data.error || "Something went wrong. Try again.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Billing.vue?vue&type=template&id=6b6c45e3":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Billing.vue?vue&type=template&id=6b6c45e3 ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v("Billing")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitleForView) + "\n      "), _c("router-link", {
    attrs: {
      to: "/financials"
    }
  }, [_vm._v("Financials →")])], 1)]), _vm._v(" "), _c("div", {
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
  }), 0), _vm._v(" "), _vm.view === "documents" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Document")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.type,
      expression: "filters.type"
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
        _vm.$set(_vm.filters, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All documents")]), _vm._v(" "), _vm._l(_vm.types, function (meta, key) {
    return _c("option", {
      key: key,
      domProps: {
        value: key
      }
    }, [_vm._v(_vm._s(meta.label))]);
  })], 2)]), _vm._v(" "), _vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Location")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.agent_id,
      expression: "filters.agent_id"
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
        _vm.$set(_vm.filters, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
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
  })], 2)]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("From")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.from,
      expression: "filters.from"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.filters.from
    },
    on: {
      change: _vm.load,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "from", $event.target.value);
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
      value: _vm.filters.to,
      expression: "filters.to"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.filters.to
    },
    on: {
      change: _vm.load,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "to", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Organization or number")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.q,
      expression: "filters.q"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "client, agent, INV-…, job"
    },
    domProps: {
      value: _vm.filters.q
    },
    on: {
      keyup: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.load.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "q", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Status")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.status,
      expression: "filters.status"
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
        _vm.$set(_vm.filters, "status", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
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
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Currency")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.currency,
      expression: "filters.currency"
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
        _vm.$set(_vm.filters, "currency", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All")]), _vm._v(" "), _vm._l(_vm.currencies, function (c) {
    return _c("option", {
      key: c,
      domProps: {
        value: c
      }
    }, [_vm._v(_vm._s(c))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Raised by")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.created_by,
      expression: "filters.created_by"
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
        _vm.$set(_vm.filters, "created_by", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Anyone")]), _vm._v(" "), _vm._l(_vm.raisedBy, function (u) {
    return _c("option", {
      key: u.id,
      domProps: {
        value: u.id
      }
    }, [_vm._v(_vm._s(u.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Sort on")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.sort,
      expression: "filters.sort"
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
        _vm.$set(_vm.filters, "sort", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: "date"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "transaction_no"
    }
  }, [_vm._v("Transaction no.")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "organization"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "amount"
    }
  }, [_vm._v("Amount")])])]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.outstanding,
      expression: "filters.outstanding"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.filters.outstanding) ? _vm._i(_vm.filters.outstanding, null) > -1 : _vm.filters.outstanding
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.filters.outstanding,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.filters, "outstanding", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.filters, "outstanding", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.filters, "outstanding", $$c);
        }
      }, _vm.load]
    }
  }), _vm._v("\n        Outstanding only\n      ")]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.exclude_credit_notes,
      expression: "filters.exclude_credit_notes"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.filters.exclude_credit_notes) ? _vm._i(_vm.filters.exclude_credit_notes, null) > -1 : _vm.filters.exclude_credit_notes
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.filters.exclude_credit_notes,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.filters, "exclude_credit_notes", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.filters, "exclude_credit_notes", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.filters, "exclude_credit_notes", $$c);
        }
      }, _vm.load]
    }
  }), _vm._v("\n        Exclude credit notes\n      ")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy || !_vm.rows.length
    },
    on: {
      click: _vm.toggleAll
    }
  }, [_vm._v("\n        " + _vm._s(_vm.allChosen ? "Clear selection" : "Check all") + "\n      ")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy || !_vm.chosen.length
    },
    on: {
      click: _vm.printBills
    }
  }, [_vm._v("\n        " + _vm._s(_vm.busy ? "Working…" : `Print ${_vm.chosen.length || ""}`.trim()) + "\n      ")]), _vm._v(" "), _vm.canPost ? _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy || !_vm.chosen.length
    },
    on: {
      click: _vm.mailBills
    }
  }, [_vm._v("Send mail")]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.exportCsv
    }
  }, [_vm._v("Data export")]), _vm._v(" "), _vm.canPost ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: function ($event) {
        return _vm.openRaise("debit_note");
      }
    }
  }, [_vm._v("Raise a document")]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No document matches.")]) : [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: "d-" + row.id,
      class: {
        "is-selected": _vm.picked[row.id]
      }
    }, [_c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.picked[row.id],
        expression: "picked[row.id]"
      }],
      attrs: {
        type: "checkbox",
        "aria-label": "Choose " + row.invoice_no
      },
      domProps: {
        checked: Array.isArray(_vm.picked[row.id]) ? _vm._i(_vm.picked[row.id], null) > -1 : _vm.picked[row.id]
      },
      on: {
        change: function ($event) {
          var $$a = _vm.picked[row.id],
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = null,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.picked, row.id, $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.picked, row.id, $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.picked, row.id, $$c);
          }
        }
      }
    })]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(row.invoice_no))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: row.document_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.typeLabel(row.type)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.organization || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(row.job_no || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.currency))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: row.amount,
        kind: "currency",
        "currency-code": row.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: row.amount_inr,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: row.outstanding_inr,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: row.status
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(row.narration || "—"))])]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    staticClass: "fx-num",
    attrs: {
      colspan: "8"
    }
  }, [_c("strong", [_vm._v(_vm._s(_vm.totals.count) + " document(s)")])]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.totals.amount_inr,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.totals.outstanding_inr,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    attrs: {
      colspan: "2"
    }
  })])])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Totalled in INR at each document's own exchange rate.")])], _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e(), _vm._v(" "), _vm.mailResult ? _c("p", {
    staticClass: "fx-notice",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      " + _vm._s(_vm.mailResult.sent.length) + " sent from " + _vm._s(_vm.mailResult.from)), _vm.mailResult.skipped.length ? _c("span", [_vm._v(";\n      " + _vm._s(_vm.mailResult.skipped.length) + " not sent: " + _vm._s(_vm.mailResult.skipped.map(s => s.invoice_no + " — " + s.why).join("; ")))]) : _vm._e(), _vm._v(".\n    ")]) : _vm._e()] : _vm.view === "receipts" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.canPost ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: _vm.openReceipt
    }
  }, [_vm._v("Record a receipt")]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : !_vm.receipts.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No receipt has been recorded.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Receipt no.")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mode")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Reference")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Placed")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("On account")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Settles")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Posted")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.receipts, function (r) {
    return _c("tr", {
      key: "r-" + r.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.receipt_no))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: r.receipt_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.organization || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s((r.mode || "").replace(/_/g, " ")))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.reference || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.amount,
        kind: "currency",
        "currency-code": r.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.allocated,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: r.unallocated,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(r.allocations.map(a => a.invoice_no).join(", ") || "Not placed yet"))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: r.is_posted ? "posted" : "unposted"
      }
    })], 1), _vm._v(" "), _vm.canPost ? _c("td", {
      staticClass: "fx-row-actions"
    }, [!r.is_posted ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.postReceipt(r);
        }
      }
    }, [_vm._v("Post")]) : _vm._e()]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm.view === "einvoice" ? [_c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.eInvoiceNote))]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : !_vm.eInvoices.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing is numbered yet.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Trans No.")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Type")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Their GSTIN")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("IRN")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Where it stands")]), _vm._v(" "), _vm.canPost ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.eInvoices, function (e) {
    return _c("tr", {
      key: "e-" + e.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(e.invoice_no))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: e.document_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.typeLabel(e.type)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(e.organization || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(e.gst_no || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: e.grand_total,
        kind: "currency",
        "currency-code": e.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(e.irn ? e.irn.slice(0, 16) + "…" : "—"))]), _vm._v(" "), _c("td", [e.state === "generated" ? _c("span", [_vm._v("Registered " + _vm._s(e.ack_no ? "(ack " + e.ack_no + ")" : ""))]) : e.state === "pending" ? _c("span", [_vm._v("Waiting for the portal")]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("Not required — they have no GSTIN")])]), _vm._v(" "), _vm.canPost ? _c("td", {
      staticClass: "fx-row-actions"
    }, [e.state === "pending" ? _c("button", {
      staticClass: "fx-btn",
      on: {
        click: function ($event) {
          _vm.irnFor = {
            id: e.id,
            invoice_no: e.invoice_no,
            irn: "",
            ack_no: ""
          };
        }
      }
    }, [_vm._v("\n              Record the IRN\n            ")]) : _vm._e()]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm._e(), _vm._v(" "), _vm.raise ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "raise-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_vm._m(1), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Document")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.type,
      expression: "raise.type"
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
        _vm.$set(_vm.raise, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        _vm.raise.parent_invoice_id = null;
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "debit_note"
    }
  }, [_vm._v("Revenue Debit Note — charge more after the bill went out")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "credit_note"
    }
  }, [_vm._v("Revenue Credit Note — give some of it back")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "brokerage"
    }
  }, [_vm._v("Brokerage Invoice — commission from a carrier or agent")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "consol_invoice"
    }
  }, [_vm._v("Consol Invoice — settle a consolidation with an agent")])])]), _vm._v(" "), _vm.isNote ? [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Against which invoice")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.parent_invoice_id,
      expression: "raise.parent_invoice_id"
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
        _vm.$set(_vm.raise, "parent_invoice_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.loadCreditRoom]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.billable, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v("\n                " + _vm._s(p.invoice_no) + " — " + _vm._s(p.organization) + " — " + _vm._s(p.currency) + " " + _vm._s(p.amount) + "\n              ")]);
  })], 2)]), _vm._v(" "), _vm.creditRoom && _vm.raise.type === "credit_note" ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n            " + _vm._s(_vm.creditRoom.invoice_no) + " is for " + _vm._s(_vm.money(_vm.creditRoom.grand_total)) + ";\n            " + _vm._s(_vm.money(_vm.creditRoom.already_credited)) + " has been credited, so\n            "), _c("strong", [_vm._v(_vm._s(_vm.money(_vm.creditRoom.room)))]), _vm._v(" is left.\n          ")]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Reason")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.reason,
      expression: "raise.reason"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "weight corrected at acceptance"
    },
    domProps: {
      value: _vm.raise.reason
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.raise, "reason", $event.target.value);
      }
    }
  })])] : [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Shipment")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.job_id,
      expression: "raise.job_id"
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
        _vm.$set(_vm.raise, "job_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.jobs, function (j) {
    return _c("option", {
      key: j.id,
      domProps: {
        value: j.id
      }
    }, [_vm._v(_vm._s(j.execution_job_no))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Billed to")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.partner_id,
      expression: "raise.partner_id"
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
        _vm.$set(_vm.raise, "partner_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.partners, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v(_vm._s(p.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Basis")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.basis,
      expression: "raise.basis"
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
        _vm.$set(_vm.raise, "basis", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "flat_rate"
    }
  }, [_vm._v("Flat rate")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "percentage_of_freight"
    }
  }, [_vm._v("Percentage of freight")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "per_kg"
    }
  }, [_vm._v("Per kg")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "per_container"
    }
  }, [_vm._v("Per container")])])])], _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Lines")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(2), _vm._v(" "), _c("tbody", _vm._l(_vm.raise.lines, function (line, i) {
    return _c("tr", {
      key: "l-" + i
    }, [_c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: line.description,
        expression: "line.description"
      }],
      staticClass: "fx-input",
      domProps: {
        value: line.description
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(line, "description", $event.target.value);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: line.hsn_sac_code,
        expression: "line.hsn_sac_code"
      }],
      staticClass: "fx-input",
      domProps: {
        value: line.hsn_sac_code
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(line, "hsn_sac_code", $event.target.value);
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: line.quantity,
        expression: "line.quantity",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input fx-num",
      attrs: {
        type: "number",
        min: "0",
        step: "0.001"
      },
      domProps: {
        value: line.quantity
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(line, "quantity", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: line.rate,
        expression: "line.rate",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input fx-num",
      attrs: {
        type: "number",
        step: "0.01"
      },
      domProps: {
        value: line.rate
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(line, "rate", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: line.tax_percentage,
        expression: "line.tax_percentage",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input fx-num",
      attrs: {
        type: "number",
        min: "0",
        max: "100",
        step: "0.01"
      },
      domProps: {
        value: line.tax_percentage
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(line, "tax_percentage", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(_vm.money(_vm.lineNet(line))))]), _vm._v(" "), _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.raise.lines.length < 2
      },
      on: {
        click: function ($event) {
          return _vm.raise.lines.splice(i, 1);
        }
      }
    }, [_vm._v("Remove")])])]);
  }), 0)]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    on: {
      click: function ($event) {
        _vm.raise.lines.push(_vm.blankLine());
      }
    }
  }, [_vm._v("Add a line")]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Narration")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.raise.narration,
      expression: "raise.narration"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "what this document is for, in one line"
    },
    domProps: {
      value: _vm.raise.narration
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.raise, "narration", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Total " + _vm._s(_vm.money(_vm.raiseTotal)) + ". It is raised as a draft — finalize it to give it a number.")]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()], 2), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.raise = null;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.raiseValid
    },
    on: {
      click: _vm.saveRaise
    }
  }, [_vm._v("\n          " + _vm._s(_vm.busy ? "Raising…" : "Raise it") + "\n        ")])])])]) : _vm._e(), _vm._v(" "), _vm.receipt ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "receipt-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_vm._m(3), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.receipt.agent_id,
      expression: "receipt.agent_id"
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
        _vm.$set(_vm.receipt, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("From")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.receipt.payer_id,
      expression: "receipt.payer_id"
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
        _vm.$set(_vm.receipt, "payer_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.loadOpenDocuments]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.clients, function (c) {
    return _c("option", {
      key: c.id,
      domProps: {
        value: c.id
      }
    }, [_vm._v(_vm._s(c.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Date")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.receipt.receipt_date,
      expression: "receipt.receipt_date"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.receipt.receipt_date
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.receipt, "receipt_date", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("How")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.receipt.mode,
      expression: "receipt.mode"
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
        _vm.$set(_vm.receipt, "mode", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.modes, function (m) {
    return _c("option", {
      key: m,
      domProps: {
        value: m
      }
    }, [_vm._v(_vm._s(m.replace(/_/g, " ")))]);
  }), 0)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Their reference")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.receipt.reference,
      expression: "receipt.reference"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "UTR, cheque no."
    },
    domProps: {
      value: _vm.receipt.reference
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.receipt, "reference", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Amount")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.receipt.amount,
      expression: "receipt.amount",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input fx-num",
    attrs: {
      type: "number",
      step: "0.01"
    },
    domProps: {
      value: _vm.receipt.amount
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.receipt, "amount", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })])]), _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("What it settles")]), _vm._v(" "), !_vm.openDocuments.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Choose who it came from; anything they still owe appears here.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(4), _vm._v(" "), _c("tbody", _vm._l(_vm.openDocuments, function (d) {
    return _c("tr", {
      key: "o-" + d.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(d.invoice_no))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: d.document_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [d.due_date ? _c("Figure", {
      attrs: {
        value: d.due_date,
        kind: "date"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: d.outstanding,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.allocation[d.id],
        expression: "allocation[d.id]",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input fx-num",
      attrs: {
        type: "number",
        step: "0.01",
        min: "0"
      },
      domProps: {
        value: _vm.allocation[d.id]
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.allocation, d.id, _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.resolution[d.id],
        expression: "resolution[d.id]"
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
          _vm.$set(_vm.resolution, d.id, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [_c("option", {
      attrs: {
        value: ""
      }
    }, [_vm._v("Still owed")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "write_off"
      }
    }, [_vm._v("Write it off")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "discount"
      }
    }, [_vm._v("Treat it as a discount")])])])]);
  }), 0)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Placed " + _vm._s(_vm.money(_vm.placedTotal)) + " of " + _vm._s(_vm.money(_vm.receipt.amount || 0)) + ".\n          "), _vm.placedTotal > (_vm.receipt.amount || 0) ? _c("span", [_vm._v("That is more than arrived.")]) : _vm.placedTotal < (_vm.receipt.amount || 0) ? _c("span", [_vm._v("The rest sits on account.")]) : _vm._e()]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.receipt = null;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.receiptValid
    },
    on: {
      click: _vm.saveReceipt
    }
  }, [_vm._v("\n          " + _vm._s(_vm.busy ? "Recording…" : "Record it") + "\n        ")])])])]) : _vm._e(), _vm._v(" "), _vm.irnFor ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "irn-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "irn-title"
    }
  }, [_vm._v("Record the IRN for " + _vm._s(_vm.irnFor.invoice_no))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("IRN")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.irnFor.irn,
      expression: "irnFor.irn"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.irnFor.irn
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.irnFor, "irn", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Acknowledgement no.")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.irnFor.ack_no,
      expression: "irnFor.ack_no"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.irnFor.ack_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.irnFor, "ack_no", $event.target.value);
      }
    }
  })]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.irnFor = null;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.irnFor.irn.trim()
    },
    on: {
      click: _vm.saveIrn
    }
  }, [_vm._v("Record it")])])])]) : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Trans No.")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Type")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipment")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Curr")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount (INR)")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Outstanding")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Narration")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "raise-title"
    }
  }, [_vm._v("Raise a document")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Description")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("HSN/SAC")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Qty")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Tax %")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Net")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  })])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "receipt-title"
    }
  }, [_vm._v("Record a receipt")])]);
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
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Due")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Outstanding")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Place against it")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("If it is short")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Billing.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Billing.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Billing_vue_vue_type_template_id_6b6c45e3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Billing.vue?vue&type=template&id=6b6c45e3 */ "./resources/js/src/view/pages/freight/Billing.vue?vue&type=template&id=6b6c45e3");
/* harmony import */ var _Billing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Billing.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/Billing.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Billing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Billing_vue_vue_type_template_id_6b6c45e3__WEBPACK_IMPORTED_MODULE_0__.render,
  _Billing_vue_vue_type_template_id_6b6c45e3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/Billing.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Billing.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Billing.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Billing.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Billing.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Billing.vue?vue&type=template&id=6b6c45e3":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Billing.vue?vue&type=template&id=6b6c45e3 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_template_id_6b6c45e3__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_template_id_6b6c45e3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Billing_vue_vue_type_template_id_6b6c45e3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Billing.vue?vue&type=template&id=6b6c45e3 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Billing.vue?vue&type=template&id=6b6c45e3");


/***/ })

}]);