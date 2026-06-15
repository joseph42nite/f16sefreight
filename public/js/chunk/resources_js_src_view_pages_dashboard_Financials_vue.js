"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_Financials_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Financials",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      activeTab: "invoices",
      loading: false,
      showUploadForm: false,
      invoices: [],
      vouchers: [],
      cassStatements: [],
      bankStatements: [],
      aiRiskAnalysis: "",
      aiRiskLoading: false,
      jobs: [],
      companies: [],
      statementType: "trial-balance",
      trialBalance: null,
      profitAndLoss: null,
      balanceSheet: null,
      showInvoiceModal: false,
      showVoucherModal: false,
      cassUpload: {
        awb_number: "",
        cass_gross_weight: 100,
        cass_rate: 10,
        grand_total: 1180,
        airline_id: 1
      },
      newInvoice: {
        job_id: "",
        client_id: "",
        type: "invoice",
        document_date: "",
        due_date: "",
        currency: "INR",
        exchange_rate: 1.0,
        subtotal: 0,
        tax_amount: 0,
        grand_total: 0,
        items: []
      },
      newVoucher: {
        job_id: "",
        vendor_id: "",
        document_date: "",
        vendor_invoice_no: "",
        vendor_invoice_date: "",
        currency: "INR",
        exchange_rate: 1.0,
        subtotal: 0,
        tax_amount: 0,
        grand_total: 0,
        items: []
      }
    };
  },
  computed: {
    currentUser: function currentUser() {
      return this.$store.getters.currentUser;
    },
    isViperCommand: function isViperCommand() {
      var tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
      return tier === 'viper_command';
    }
  },
  mounted: function mounted() {
    if (this.isViperCommand) {
      this.loadTabContent();
      this.loadDropdownData();
    }
  },
  methods: {
    setActiveTab: function setActiveTab(tab) {
      this.activeTab = tab;
      this.loadTabContent();
    },
    loadTabContent: function loadTabContent() {
      var _this = this;
      this.loading = true;
      if (this.activeTab === "invoices") {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/invoices").then(function (_ref) {
          var data = _ref.data;
          _this.invoices = data;
          _this.loading = false;
        })["catch"](function () {
          _this.loading = false;
        });
      } else if (this.activeTab === "vouchers") {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/purchase-vouchers").then(function (_ref2) {
          var data = _ref2.data;
          _this.vouchers = data;
          _this.loading = false;
        })["catch"](function () {
          _this.loading = false;
        });
      } else if (this.activeTab === "reconciliation") {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/reconciliation/cass").then(function (_ref3) {
          var data = _ref3.data;
          _this.cassStatements = data;
          _this.loading = false;
        })["catch"](function () {
          _this.loading = false;
        });
      } else if (this.activeTab === "statements") {
        this.loadFinancialStatements();
      } else if (this.activeTab === "bank_reconciliation") {
        this.loadBankStatements();
      }
    },
    loadDropdownData: function loadDropdownData() {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/active-jobs").then(function (_ref4) {
        var data = _ref4.data;
        _this2.jobs = data;
      });
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/companies").then(function (_ref5) {
        var data = _ref5.data;
        _this2.companies = data;
      });
    },
    loadBankStatements: function loadBankStatements() {
      var _this3 = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/reconciliation/bank").then(function (_ref6) {
        var data = _ref6.data;
        _this3.bankStatements = data;
        _this3.loading = false;
      })["catch"](function () {
        _this3.loading = false;
      });
    },
    fetchBankFeed: function fetchBankFeed() {
      var _this4 = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/reconciliation/bank/poll").then(function () {
        _this4.$bvToast.toast("Bank statement feed synced from Plaid sandbox.", {
          title: "Fetch Completed",
          variant: "success",
          solid: true
        });
        _this4.loadBankStatements();
      })["catch"](function () {
        _this4.loading = false;
      });
    },
    runBankAutoMatch: function runBankAutoMatch() {
      var _this5 = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/reconciliation/bank/match").then(function (_ref7) {
        var data = _ref7.data;
        _this5.$bvToast.toast("Payment matching done. Successfully matched and posted ".concat(data.matched, " cash ledger entries."), {
          title: "Reconciliation Success",
          variant: "success",
          solid: true
        });
        _this5.loadBankStatements();
      })["catch"](function () {
        _this5.loading = false;
      });
    },
    runAiRiskAudit: function runAiRiskAudit() {
      var _this6 = this;
      this.aiRiskLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/reconciliation/bank/ai-risk").then(function (_ref8) {
        var data = _ref8.data;
        _this6.aiRiskAnalysis = data.analysis;
        _this6.aiRiskLoading = false;
      })["catch"](function () {
        _this6.aiRiskLoading = false;
      });
    },
    getBankReconBadgeClass: function getBankReconBadgeClass(status) {
      switch (status) {
        case "reconciled":
          return "badge-success";
        case "flagged":
          return "badge-warning";
        default:
          return "badge-secondary";
      }
    },
    renderMarkdown: function renderMarkdown(text) {
      if (!text) return "";
      var html = text;
      html = html.replace(/^### (.*$)/gim, '<h6 class="font-weight-bold text-primary mt-3 mb-2">$1</h6>');
      html = html.replace(/^## (.*$)/gim, '<h6 class="font-weight-bold text-secondary mt-3 mb-2">$1</h6>');
      html = html.replace(/^# (.*$)/gim, '<h5 class="font-weight-bold text-dark mt-2 mb-2">$1</h5>');
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/^\s*-\s*(.*$)/gim, '<li class="ml-3">$1</li>');
      html = html.replace(/\n/g, "<br/>");
      return html;
    },
    loadFinancialStatements: function loadFinancialStatements() {
      var _this7 = this;
      this.loading = true;
      if (this.statementType === "trial-balance") {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/financial-statements/trial-balance").then(function (_ref9) {
          var data = _ref9.data;
          _this7.trialBalance = data;
          _this7.loading = false;
        })["catch"](function () {
          _this7.loading = false;
        });
      } else if (this.statementType === "profit-loss") {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/financial-statements/profit-and-loss").then(function (_ref0) {
          var data = _ref0.data;
          _this7.profitAndLoss = data;
          _this7.loading = false;
        })["catch"](function () {
          _this7.loading = false;
        });
      } else if (this.statementType === "balance-sheet") {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/financial-statements/balance-sheet").then(function (_ref1) {
          var data = _ref1.data;
          _this7.balanceSheet = data;
          _this7.loading = false;
        })["catch"](function () {
          _this7.loading = false;
        });
      }
    },
    // Actions
    finalizeInvoice: function finalizeInvoice(id) {
      var _this8 = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/invoices/".concat(id, "/finalize")).then(function () {
        _this8.$bvToast.toast("Invoice finalized & posted to ledger.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this8.loadTabContent();
      })["catch"](function (err) {
        _this8.loading = false;
        var msg = err.response && err.response.data && err.response.data.message ? err.response.data.message : "Validation failed.";
        _this8.$bvToast.toast(msg, {
          title: "Error",
          variant: "danger",
          solid: true
        });
      });
    },
    finalizeVoucher: function finalizeVoucher(id) {
      var _this9 = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/purchase-vouchers/".concat(id, "/finalize")).then(function () {
        _this9.$bvToast.toast("Purchase Voucher finalized & posted to ledger.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this9.loadTabContent();
      })["catch"](function (err) {
        _this9.loading = false;
        var msg = err.response && err.response.data && err.response.data.message ? err.response.data.message : "Validation failed.";
        _this9.$bvToast.toast(msg, {
          title: "Error",
          variant: "danger",
          solid: true
        });
      });
    },
    triggerReconciliation: function triggerReconciliation() {
      var _this0 = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/reconciliation/cass/match").then(function (_ref10) {
        var data = _ref10.data;
        _this0.$bvToast.toast("Matched ".concat(data.matched, " of ").concat(data.processed, " statements successfully."), {
          title: "Reconciliation Done",
          variant: "success",
          solid: true
        });
        _this0.loadTabContent();
      })["catch"](function () {
        _this0.loading = false;
      });
    },
    uploadStatementRow: function uploadStatementRow() {
      var _this1 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/reconciliation/cass/upload", {
        statements: [this.cassUpload]
      }).then(function () {
        _this1.$bvToast.toast("CASS Statement row uploaded successfully.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this1.showUploadForm = false;
        _this1.cassUpload.awb_number = "";
        _this1.loadTabContent();
      });
    },
    // Modal management
    openInvoiceModal: function openInvoiceModal() {
      this.newInvoice = {
        job_id: "",
        client_id: "",
        type: "invoice",
        document_date: new Date().toISOString().substr(0, 10),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
        currency: "INR",
        exchange_rate: 1.0,
        subtotal: 0,
        tax_amount: 0,
        grand_total: 0,
        items: [{
          charge_type: "Freight",
          description: "Freight Charges",
          qty: 100,
          unit_rate: 10,
          tax_rate: 18,
          subtotal: 1000,
          tax_amount: 180,
          total_amount: 1180
        }]
      };
      this.showInvoiceModal = true;
      this.updateInvoiceTotals();
    },
    addInvoiceItem: function addInvoiceItem() {
      this.newInvoice.items.push({
        charge_type: "Freight",
        description: "Freight Charges",
        qty: 1,
        unit_rate: 0,
        tax_rate: 18,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0
      });
    },
    removeInvoiceItem: function removeInvoiceItem(idx) {
      this.newInvoice.items.splice(idx, 1);
      this.updateInvoiceTotals();
    },
    updateInvoiceTotals: function updateInvoiceTotals() {
      var sub = 0;
      var tax = 0;
      this.newInvoice.items.forEach(function (item) {
        item.subtotal = parseFloat(item.qty || 0) * parseFloat(item.unit_rate || 0);
        item.tax_amount = item.subtotal * parseFloat(item.tax_rate || 0) / 100;
        item.total_amount = item.subtotal + item.tax_amount;
        sub += item.subtotal;
        tax += item.tax_amount;
      });
      this.newInvoice.subtotal = sub;
      this.newInvoice.tax_amount = tax;
      this.newInvoice.grand_total = sub + tax;
    },
    submitInvoice: function submitInvoice() {
      var _this10 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/invoices", this.newInvoice).then(function () {
        _this10.$bvToast.toast("Draft Sales Invoice saved.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this10.showInvoiceModal = false;
        _this10.loadTabContent();
      });
    },
    // Voucher Modal
    openVoucherModal: function openVoucherModal() {
      this.newVoucher = {
        job_id: "",
        vendor_id: "",
        document_date: new Date().toISOString().substr(0, 10),
        vendor_invoice_no: "",
        vendor_invoice_date: new Date().toISOString().substr(0, 10),
        currency: "INR",
        exchange_rate: 1.0,
        subtotal: 0,
        tax_amount: 0,
        grand_total: 0,
        items: [{
          charge_type: "Freight",
          description: "Freight charges buy-side",
          qty: 100,
          unit_rate: 6,
          tax_rate: 18,
          subtotal: 600,
          tax_amount: 108,
          total_amount: 708
        }]
      };
      this.showVoucherModal = true;
      this.updateVoucherTotals();
    },
    addVoucherItem: function addVoucherItem() {
      this.newVoucher.items.push({
        charge_type: "Freight",
        description: "Freight Charges",
        qty: 1,
        unit_rate: 0,
        tax_rate: 18,
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0
      });
    },
    removeVoucherItem: function removeVoucherItem(idx) {
      this.newVoucher.items.splice(idx, 1);
      this.updateVoucherTotals();
    },
    updateVoucherTotals: function updateVoucherTotals() {
      var sub = 0;
      var tax = 0;
      this.newVoucher.items.forEach(function (item) {
        item.subtotal = parseFloat(item.qty || 0) * parseFloat(item.unit_rate || 0);
        item.tax_amount = item.subtotal * parseFloat(item.tax_rate || 0) / 100;
        item.total_amount = item.subtotal + item.tax_amount;
        sub += item.subtotal;
        tax += item.tax_amount;
      });
      this.newVoucher.subtotal = sub;
      this.newVoucher.tax_amount = tax;
      this.newVoucher.grand_total = sub + tax;
    },
    submitVoucher: function submitVoucher() {
      var _this11 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/purchase-vouchers", this.newVoucher).then(function () {
        _this11.$bvToast.toast("Draft Purchase Voucher saved.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this11.showVoucherModal = false;
        _this11.loadTabContent();
      });
    },
    // Formatting helpers
    formatDate: function formatDate(dateString) {
      if (!dateString) return "-";
      var date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    },
    formatAmount: function formatAmount(value) {
      if (value === null || value === undefined) return "0.00";
      return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    },
    getReconStatusBadgeClass: function getReconStatusBadgeClass(status) {
      switch (status) {
        case "matched":
          return "badge-success";
        case "rate_mismatch":
          return "badge-danger";
        case "weight_mismatch":
          return "badge-warning";
        default:
          return "badge-secondary";
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=template&id=0a8a95e1&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=template&id=0a8a95e1&scoped=true ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-container", {
    staticClass: "body-color",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-lg-row"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
    staticClass: "ml-lg-4 mt-4 mt-lg-0",
    staticStyle: {
      background: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      "box-shadow": "0 10px 30px rgba(53, 85, 148, 0.1)",
      "z-index": "1",
      "border-radius": "32px",
      flex: "1",
      "min-width": "0",
      overflow: "hidden"
    }
  }, [_c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10 bg-light-gradient"
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
  }, [_c("div", [_c("span", {
    staticStyle: {
      "text-transform": "uppercase",
      "letter-spacing": "2px",
      "font-size": "0.85rem",
      "font-weight": "700",
      color: "#355594",
      opacity: "0.6",
      "margin-bottom": "0.5rem",
      display: "block"
    }
  }, [_vm._v("Accounts & Ledgers")]), _vm._v(" "), _c("h6", {
    staticStyle: {
      color: "#355594",
      "font-size": "26px !important",
      "line-height": "34px !important",
      "font-weight": "800 !important",
      "letter-spacing": "-0.5px !important",
      "margin-bottom": "0px",
      "font-family": "'Inter', sans-serif !important"
    }
  }, [_vm._v("Financials & Reconciliation")])]), _vm._v(" "), _vm.isViperCommand ? _c("div", {
    staticClass: "mt-3 mt-md-0 d-flex gap-2"
  }, [_c("b-button", {
    staticClass: "btn-action shadow-sm mr-2",
    attrs: {
      variant: "primary"
    },
    on: {
      click: _vm.openInvoiceModal
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle-fill"
    }
  }), _vm._v(" New Invoice\n                        ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "btn-action shadow-sm",
    attrs: {
      variant: "outline-primary"
    },
    on: {
      click: _vm.openVoucherModal
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle"
    }
  }), _vm._v(" New Voucher\n                        ")], 1)], 1) : _vm._e()])]), _vm._v(" "), _c("hr", {
    staticStyle: {
      border: "0",
      "border-top": "1px solid rgba(53, 85, 148, 0.12)",
      "margin-top": "0",
      "margin-bottom": "0"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "container py-6 px-6 px-sm-8 px-md-10"
  }, [!_vm.isViperCommand ? _c("div", {
    staticClass: "teaser-container mx-auto py-10 px-8 rounded-lg shadow-lg text-center mt-10"
  }, [_c("div", {
    staticClass: "icon-circle mb-6 mx-auto"
  }, [_c("b-icon", {
    staticClass: "lock-icon",
    attrs: {
      icon: "shield-lock-fill",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("h3", {
    staticClass: "teaser-title mb-4"
  }, [_vm._v("Upgrade to Unlock Financials")]), _vm._v(" "), _c("p", {
    staticClass: "teaser-description mb-6 mx-auto"
  }, [_vm._v("\n                        Get full double-entry ledger bookkeeping, real-time Plaid/Setu bank statement reconciliation, and automated CASS airline weight validation triggers.\n                    ")]), _vm._v(" "), _c("b-button", {
    staticClass: "upgrade-btn px-8 py-3",
    attrs: {
      variant: "primary"
    }
  }, [_vm._v("\n                        Upgrade to Viper Command\n                    ")])], 1) : _c("div", [_c("div", {
    staticClass: "d-flex justify-content-start border-bottom mb-6 nav-tabs-custom"
  }, [_c("button", {
    "class": ["tab-btn mr-4 pb-3", {
      active: _vm.activeTab === "invoices"
    }],
    on: {
      click: function click($event) {
        return _vm.setActiveTab("invoices");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "file-earmark-text"
    }
  }), _vm._v(" Sales Invoices\n                        ")], 1), _vm._v(" "), _c("button", {
    "class": ["tab-btn mr-4 pb-3", {
      active: _vm.activeTab === "vouchers"
    }],
    on: {
      click: function click($event) {
        return _vm.setActiveTab("vouchers");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "file-earmark-spreadsheet"
    }
  }), _vm._v(" Purchase Vouchers\n                        ")], 1), _vm._v(" "), _c("button", {
    "class": ["tab-btn mr-4 pb-3", {
      active: _vm.activeTab === "reconciliation"
    }],
    on: {
      click: function click($event) {
        return _vm.setActiveTab("reconciliation");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "cash-stack"
    }
  }), _vm._v(" CASS Reconciliation\n                        ")], 1), _vm._v(" "), _c("button", {
    "class": ["tab-btn mr-4 pb-3", {
      active: _vm.activeTab === "bank_reconciliation"
    }],
    on: {
      click: function click($event) {
        return _vm.setActiveTab("bank_reconciliation");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "credit-card"
    }
  }), _vm._v(" Bank Reconciliation\n                        ")], 1), _vm._v(" "), _c("button", {
    "class": ["tab-btn pb-3", {
      active: _vm.activeTab === "statements"
    }],
    on: {
      click: function click($event) {
        return _vm.setActiveTab("statements");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "file-earmark-bar-graph"
    }
  }), _vm._v(" Financial Reports\n                        ")], 1)]), _vm._v(" "), _vm.loading ? _c("div", {
    staticClass: "text-center py-10"
  }, [_c("b-spinner", {
    attrs: {
      variant: "primary",
      label: "Loading data..."
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "text-muted mt-2"
  }, [_vm._v("Fetching ledger details...")])], 1) : _c("div", [_vm.activeTab === "invoices" ? _c("div", [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table custom-table table-hover"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v("Invoice No")]), _vm._v(" "), _c("th", [_vm._v("Client")]), _vm._v(" "), _c("th", [_vm._v("Job Enquiry")]), _vm._v(" "), _c("th", [_vm._v("Doc Date")]), _vm._v(" "), _c("th", [_vm._v("Subtotal")]), _vm._v(" "), _c("th", [_vm._v("Tax Amount")]), _vm._v(" "), _c("th", [_vm._v("Grand Total")]), _vm._v(" "), _c("th", [_vm._v("Status")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Actions")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.invoices, function (inv) {
    return _c("tr", {
      key: inv.id
    }, [_c("td", {
      staticClass: "font-weight-bold text-primary"
    }, [_vm._v(_vm._s(inv.invoice_no))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(inv.client ? inv.client.name : "N/A"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(inv.job ? inv.job.enquiry_no : "N/A"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatDate(inv.document_date)))]), _vm._v(" "), _c("td", [_vm._v("INR " + _vm._s(_vm.formatAmount(inv.subtotal)))]), _vm._v(" "), _c("td", [_vm._v("INR " + _vm._s(_vm.formatAmount(inv.tax_amount)))]), _vm._v(" "), _c("td", {
      staticClass: "font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(inv.grand_total)))]), _vm._v(" "), _c("td", [_c("span", {
      "class": ["badge px-2 py-1", inv.status === "finalized" ? "badge-success" : "badge-warning"]
    }, [_vm._v("\n                                                    " + _vm._s(inv.status) + "\n                                                ")])]), _vm._v(" "), _c("td", {
      staticClass: "text-right"
    }, [inv.status === "draft" ? _c("b-button", {
      staticClass: "btn-sm-action",
      attrs: {
        size: "sm",
        variant: "primary"
      },
      on: {
        click: function click($event) {
          return _vm.finalizeInvoice(inv.id);
        }
      }
    }, [_vm._v("\n                                                    Finalize\n                                                ")]) : _c("span", {
      staticClass: "text-muted font-size-sm"
    }, [_c("b-icon", {
      staticClass: "text-success",
      attrs: {
        icon: "check-circle-fill"
      }
    }), _vm._v(" Posted")], 1)], 1)]);
  }), _vm._v(" "), _vm.invoices.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-6",
    attrs: {
      colspan: "9"
    }
  }, [_vm._v("No invoices found. Create a new draft invoice to begin.")])]) : _vm._e()], 2)])])]) : _vm._e(), _vm._v(" "), _vm.activeTab === "vouchers" ? _c("div", [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table custom-table table-hover"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v("Voucher No")]), _vm._v(" "), _c("th", [_vm._v("Vendor")]), _vm._v(" "), _c("th", [_vm._v("Job")]), _vm._v(" "), _c("th", [_vm._v("Doc Date")]), _vm._v(" "), _c("th", [_vm._v("Subtotal")]), _vm._v(" "), _c("th", [_vm._v("Tax Amount")]), _vm._v(" "), _c("th", [_vm._v("Grand Total")]), _vm._v(" "), _c("th", [_vm._v("Status")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Actions")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.vouchers, function (vch) {
    return _c("tr", {
      key: vch.id
    }, [_c("td", {
      staticClass: "font-weight-bold text-primary"
    }, [_vm._v(_vm._s(vch.voucher_no))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(vch.vendor ? vch.vendor.name : "N/A"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(vch.job ? vch.job.enquiry_no : "N/A"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.formatDate(vch.document_date)))]), _vm._v(" "), _c("td", [_vm._v("INR " + _vm._s(_vm.formatAmount(vch.subtotal)))]), _vm._v(" "), _c("td", [_vm._v("INR " + _vm._s(_vm.formatAmount(vch.tax_amount)))]), _vm._v(" "), _c("td", {
      staticClass: "font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(vch.grand_total)))]), _vm._v(" "), _c("td", [_c("span", {
      "class": ["badge px-2 py-1", vch.status === "finalized" ? "badge-success" : "badge-warning"]
    }, [_vm._v("\n                                                    " + _vm._s(vch.status) + "\n                                                ")])]), _vm._v(" "), _c("td", {
      staticClass: "text-right"
    }, [vch.status === "draft" ? _c("b-button", {
      staticClass: "btn-sm-action",
      attrs: {
        size: "sm",
        variant: "primary"
      },
      on: {
        click: function click($event) {
          return _vm.finalizeVoucher(vch.id);
        }
      }
    }, [_vm._v("\n                                                    Finalize\n                                                ")]) : _c("span", {
      staticClass: "text-muted font-size-sm"
    }, [_c("b-icon", {
      staticClass: "text-success",
      attrs: {
        icon: "check-circle-fill"
      }
    }), _vm._v(" Posted")], 1)], 1)]);
  }), _vm._v(" "), _vm.vouchers.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-6",
    attrs: {
      colspan: "9"
    }
  }, [_vm._v("No purchase vouchers found. Create a new draft voucher to begin.")])]) : _vm._e()], 2)])])]) : _vm._e(), _vm._v(" "), _vm.activeTab === "reconciliation" ? _c("div", [_c("div", {
    staticClass: "bg-light-blue p-6 rounded-lg mb-6 border d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center"
  }, [_c("div", [_c("h5", {
    staticClass: "text-primary font-weight-bold mb-2"
  }, [_vm._v("IATA CASS Clearing & Auto-Match")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted mb-0"
  }, [_vm._v("Reconcile operational carrier cost vouchers against CASS clearing reports dynamically using weight & rate cross-auditing.")])]), _vm._v(" "), _c("div", {
    staticClass: "mt-4 mt-md-0 d-flex gap-2"
  }, [_c("b-button", {
    staticClass: "btn-action shadow-sm mr-2",
    attrs: {
      variant: "success"
    },
    on: {
      click: _vm.triggerReconciliation
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "play-fill"
    }
  }), _vm._v(" Run Auto-Match Reconciliation\n                                    ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "btn-action",
    attrs: {
      variant: "outline-primary"
    },
    on: {
      click: function click($event) {
        _vm.showUploadForm = !_vm.showUploadForm;
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "cloud-upload"
    }
  }), _vm._v(" Ingest Statement Row\n                                    ")], 1)], 1)]), _vm._v(" "), _vm.showUploadForm ? _c("div", {
    staticClass: "card card-body mb-6 border shadow-sm rounded-lg p-5"
  }, [_c("h6", {
    staticClass: "text-primary font-weight-bold mb-3"
  }, [_vm._v("Add CASS Statement Row")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      md: "3"
    }
  }, [_c("label", {
    staticClass: "font-size-sm font-weight-bold"
  }, [_vm._v("AWB Number")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      placeholder: "020-12345678"
    },
    model: {
      value: _vm.cassUpload.awb_number,
      callback: function callback($$v) {
        _vm.$set(_vm.cassUpload, "awb_number", $$v);
      },
      expression: "cassUpload.awb_number"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "2"
    }
  }, [_c("label", {
    staticClass: "font-size-sm font-weight-bold"
  }, [_vm._v("Gross Weight (kg)")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.cassUpload.cass_gross_weight,
      callback: function callback($$v) {
        _vm.$set(_vm.cassUpload, "cass_gross_weight", $$v);
      },
      expression: "cassUpload.cass_gross_weight"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "2"
    }
  }, [_c("label", {
    staticClass: "font-size-sm font-weight-bold"
  }, [_vm._v("Cass Rate")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.cassUpload.cass_rate,
      callback: function callback($$v) {
        _vm.$set(_vm.cassUpload, "cass_rate", $$v);
      },
      expression: "cassUpload.cass_rate"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "3"
    }
  }, [_c("label", {
    staticClass: "font-size-sm font-weight-bold"
  }, [_vm._v("Grand Total")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.cassUpload.grand_total,
      callback: function callback($$v) {
        _vm.$set(_vm.cassUpload, "grand_total", $$v);
      },
      expression: "cassUpload.grand_total"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "d-flex align-items-end",
    attrs: {
      md: "2"
    }
  }, [_c("b-button", {
    staticClass: "w-100",
    attrs: {
      variant: "primary"
    },
    on: {
      click: _vm.uploadStatementRow
    }
  }, [_vm._v("Ingest")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table custom-table table-hover"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v("AWB Number")]), _vm._v(" "), _c("th", [_vm._v("Billing Cycle")]), _vm._v(" "), _c("th", [_vm._v("CASS Weight")]), _vm._v(" "), _c("th", [_vm._v("CASS Rate")]), _vm._v(" "), _c("th", [_vm._v("Total Billed")]), _vm._v(" "), _c("th", [_vm._v("Status")]), _vm._v(" "), _c("th", [_vm._v("Matched cost sheet Voucher")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.cassStatements, function (stmt) {
    return _c("tr", {
      key: stmt.id
    }, [_c("td", {
      staticClass: "font-weight-bold text-primary"
    }, [_vm._v(_vm._s(stmt.awb_number))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(stmt.billing_period))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(stmt.cass_gross_weight) + " kg")]), _vm._v(" "), _c("td", [_vm._v("INR " + _vm._s(stmt.cass_rate))]), _vm._v(" "), _c("td", {
      staticClass: "font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(stmt.grand_total)))]), _vm._v(" "), _c("td", [_c("span", {
      "class": ["badge px-2 py-1", _vm.getReconStatusBadgeClass(stmt.reconciliation_status)]
    }, [_vm._v("\n                                                    " + _vm._s(stmt.reconciliation_status) + "\n                                                ")])]), _vm._v(" "), _c("td", [stmt.matched_voucher ? _c("span", {
      staticClass: "font-weight-bold text-success"
    }, [_c("b-icon", {
      attrs: {
        icon: "link"
      }
    }), _vm._v(" " + _vm._s(stmt.matched_voucher.voucher_no) + "\n                                                ")], 1) : _c("span", {
      staticClass: "text-muted"
    }, [_vm._v("-")])])]);
  }), _vm._v(" "), _vm.cassStatements.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-6",
    attrs: {
      colspan: "7"
    }
  }, [_vm._v('No CASS statements ingested. Click "Ingest Statement Row" to start.')])]) : _vm._e()], 2)])])]) : _vm._e(), _vm._v(" "), _vm.activeTab === "bank_reconciliation" ? _c("div", [_c("div", {
    staticClass: "bg-light-blue p-6 rounded-lg mb-6 border d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center shadow-sm"
  }, [_c("div", [_c("h5", {
    staticClass: "text-primary font-weight-bold mb-2"
  }, [_vm._v("Automated Bank Feed Reconciliation")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted mb-0"
  }, [_vm._v("Retrieve statement feeds via Plaid/Setu, match payments against finalized customer invoices automatically, and audit client payment risks.")])]), _vm._v(" "), _c("div", {
    staticClass: "mt-4 mt-md-0 d-flex gap-2 align-items-center"
  }, [_c("b-button", {
    staticClass: "btn-action shadow-sm mr-2",
    attrs: {
      variant: "outline-primary",
      disabled: _vm.loading
    },
    on: {
      click: _vm.fetchBankFeed
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "arrow-repeat"
    }
  }), _vm._v(" Fetch Bank Feed\n                                    ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "btn-action shadow-sm mr-2",
    attrs: {
      variant: "success",
      disabled: _vm.loading
    },
    on: {
      click: _vm.runBankAutoMatch
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "play-fill"
    }
  }), _vm._v(" Auto-Match Payments\n                                    ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "btn-action shadow-sm",
    attrs: {
      variant: "info",
      disabled: _vm.aiRiskLoading
    },
    on: {
      click: _vm.runAiRiskAudit
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "cpu-fill"
    }
  }), _vm._v(" AI Risk Audit\n                                    ")], 1)], 1)]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "card shadow-sm border-0 rounded-lg overflow-hidden"
  }, [_c("div", {
    staticClass: "card-header bg-white py-4 px-5 border-bottom"
  }, [_c("h6", {
    staticClass: "font-weight-bold text-secondary mb-0"
  }, [_vm._v("Bank Feed Transactions")])]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table custom-table table-hover mb-0"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v("Booking Date")]), _vm._v(" "), _c("th", [_vm._v("Reference Description")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Amount")]), _vm._v(" "), _c("th", [_vm._v("Status")]), _vm._v(" "), _c("th", [_vm._v("Matched Invoice")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.bankStatements, function (stmt) {
    return _c("tr", {
      key: stmt.id
    }, [_c("td", [_vm._v(_vm._s(_vm.formatDate(stmt.booking_date)))]), _vm._v(" "), _c("td", [_c("span", {
      staticClass: "font-weight-bold text-secondary"
    }, [_vm._v(_vm._s(stmt.sender_reference))]), _vm._v(" "), stmt.plaid_transaction_id ? _c("small", {
      staticClass: "d-block text-muted font-size-xs"
    }, [_vm._v("ID: " + _vm._s(stmt.plaid_transaction_id))]) : _vm._e()]), _vm._v(" "), _c("td", {
      staticClass: "text-right font-weight-bold",
      "class": stmt.amount >= 0 ? "text-success" : "text-danger"
    }, [_vm._v("\n                                                            INR " + _vm._s(_vm.formatAmount(stmt.amount)) + "\n                                                        ")]), _vm._v(" "), _c("td", [_c("span", {
      "class": ["badge px-2 py-1", _vm.getBankReconBadgeClass(stmt.status)]
    }, [_vm._v("\n                                                                " + _vm._s(stmt.status) + "\n                                                            ")])]), _vm._v(" "), _c("td", [stmt.matched_invoice ? _c("span", {
      staticClass: "font-weight-bold text-success"
    }, [_c("b-icon", {
      attrs: {
        icon: "link-45deg"
      }
    }), _vm._v(" " + _vm._s(stmt.matched_invoice.invoice_no) + "\n                                                            ")], 1) : _c("span", {
      staticClass: "text-muted"
    }, [_vm._v("-")])])]);
  }), _vm._v(" "), _vm.bankStatements.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-8",
    attrs: {
      colspan: "5"
    }
  }, [_c("b-icon", {
    staticClass: "mb-2 text-muted",
    attrs: {
      icon: "inbox",
      "font-scale": "2"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "mb-0"
  }, [_vm._v('No bank transactions loaded. Click "Fetch Bank Feed" to ingest mock Plaid feeds.')])], 1)]) : _vm._e()], 2)])])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "card shadow-sm border-0 rounded-lg overflow-hidden mb-6",
    staticStyle: {
      background: "rgba(248, 250, 252, 0.8)",
      border: "1px dashed #355594"
    }
  }, [_c("div", {
    staticClass: "card-header bg-gradient-dark py-4 px-5 d-flex justify-content-between align-items-center",
    staticStyle: {
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
    }
  }, [_c("h6", {
    staticClass: "font-weight-bold text-white mb-0"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "shield-shaded"
    }
  }), _vm._v(" Gemini Risk Audit\n                                            ")], 1), _vm._v(" "), _c("span", {
    staticClass: "badge badge-light px-2 py-1 text-dark",
    staticStyle: {
      "font-size": "0.75rem"
    }
  }, [_vm._v("Privacy Masked")])]), _vm._v(" "), _c("div", {
    staticClass: "card-body p-5"
  }, [_vm.aiRiskLoading ? _c("div", {
    staticClass: "text-center py-6"
  }, [_c("b-spinner", {
    attrs: {
      variant: "primary",
      label: "Querying Gemini..."
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "text-muted mt-3 font-size-sm"
  }, [_vm._v("Scrubbing client data metrics & running risk analysis...")])], 1) : _vm.aiRiskAnalysis ? _c("div", {
    staticClass: "ai-analysis-render font-size-sm",
    domProps: {
      innerHTML: _vm._s(_vm.renderMarkdown(_vm.aiRiskAnalysis))
    }
  }) : _c("div", {
    staticClass: "text-center py-8 text-muted"
  }, [_c("b-icon", {
    staticClass: "mb-3 text-secondary",
    staticStyle: {
      opacity: "0.4"
    },
    attrs: {
      icon: "cpu",
      "font-scale": "2.5"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "mb-3"
  }, [_vm._v("Compile real-time credit metrics & client payment delays into an LLM threat audit.")]), _vm._v(" "), _c("b-button", {
    staticClass: "rounded-pill px-4",
    attrs: {
      size: "sm",
      variant: "outline-primary"
    },
    on: {
      click: _vm.runAiRiskAudit
    }
  }, [_vm._v("\n                                                    Run Audit\n                                                ")])], 1)])])])], 1)], 1) : _vm._e(), _vm._v(" "), _vm.activeTab === "statements" ? _c("div", [_c("div", {
    staticClass: "d-flex justify-content-center mb-6"
  }, [_c("b-form-radio-group", {
    attrs: {
      options: [{
        text: "Trial Balance",
        value: "trial-balance"
      }, {
        text: "Profit & Loss",
        value: "profit-loss"
      }, {
        text: "Balance Sheet",
        value: "balance-sheet"
      }],
      buttons: "",
      "button-variant": "outline-primary",
      size: "md"
    },
    on: {
      change: _vm.loadFinancialStatements
    },
    model: {
      value: _vm.statementType,
      callback: function callback($$v) {
        _vm.statementType = $$v;
      },
      expression: "statementType"
    }
  })], 1), _vm._v(" "), _vm.statementType === "trial-balance" && _vm.trialBalance ? _c("div", [_c("div", {
    staticClass: "border rounded-lg p-5 shadow-sm bg-white mb-6"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-4"
  }, [_c("h5", {
    staticClass: "text-primary font-weight-bold mb-0"
  }, [_vm._v("Trial Balance Sheet")]), _vm._v(" "), _c("span", {
    "class": ["badge px-3 py-2", _vm.trialBalance.is_balanced ? "badge-success" : "badge-danger"]
  }, [_vm._v("\n                                            " + _vm._s(_vm.trialBalance.is_balanced ? "🟢 Ledger Balanced" : "🔴 Ledger Out of Balance") + "\n                                        ")])]), _vm._v(" "), _c("table", {
    staticClass: "table custom-table"
  }, [_c("thead", [_c("tr", [_c("th", [_vm._v("Account Code")]), _vm._v(" "), _c("th", [_vm._v("Account Name")]), _vm._v(" "), _c("th", [_vm._v("Type")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Debit Balance")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Credit Balance")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.trialBalance.accounts, function (acc) {
    return _c("tr", {
      key: acc.account_id
    }, [_c("td", [_vm._v(_vm._s(acc.code))]), _vm._v(" "), _c("td", {
      staticClass: "font-weight-bold text-secondary"
    }, [_vm._v(_vm._s(acc.name))]), _vm._v(" "), _c("td", {
      staticClass: "text-capitalize"
    }, [_vm._v(_vm._s(acc.type))]), _vm._v(" "), _c("td", {
      staticClass: "text-right text-success font-weight-bold"
    }, [_vm._v("\n                                                    " + _vm._s(acc.debit > 0 ? "INR " + _vm.formatAmount(acc.debit) : "-") + "\n                                                ")]), _vm._v(" "), _c("td", {
      staticClass: "text-right text-danger font-weight-bold"
    }, [_vm._v("\n                                                    " + _vm._s(acc.credit > 0 ? "INR " + _vm.formatAmount(acc.credit) : "-") + "\n                                                ")])]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "table-totals"
  }, [_c("td", {
    staticClass: "text-right font-weight-bold",
    attrs: {
      colspan: "3"
    }
  }, [_vm._v("Total")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-success font-weight-bold",
    staticStyle: {
      "border-top": "1.5px solid #333",
      "border-bottom": "3px double #333"
    }
  }, [_vm._v("\n                                                    INR " + _vm._s(_vm.formatAmount(_vm.trialBalance.total_debit)) + "\n                                                ")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-danger font-weight-bold",
    staticStyle: {
      "border-top": "1.5px solid #333",
      "border-bottom": "3px double #333"
    }
  }, [_vm._v("\n                                                    INR " + _vm._s(_vm.formatAmount(_vm.trialBalance.total_credit)) + "\n                                                ")])])], 2)])])]) : _vm._e(), _vm._v(" "), _vm.statementType === "profit-loss" && _vm.profitAndLoss ? _c("div", [_c("div", {
    staticClass: "border rounded-lg p-5 shadow-sm bg-white mb-6"
  }, [_c("h5", {
    staticClass: "text-primary font-weight-bold mb-4"
  }, [_vm._v("Profit & Loss Statement")]), _vm._v(" "), _c("div", {
    staticClass: "statement-section mb-5"
  }, [_c("h6", {
    staticClass: "font-weight-bold border-bottom pb-2 text-success"
  }, [_vm._v("Revenues")]), _vm._v(" "), _c("table", {
    staticClass: "table table-sm table-borderless"
  }, [_c("tbody", [_vm._l(_vm.profitAndLoss.revenues, function (rev) {
    return _c("tr", {
      key: rev.account_id
    }, [_c("td", [_vm._v(_vm._s(rev.code) + " - " + _vm._s(rev.name))]), _vm._v(" "), _c("td", {
      staticClass: "text-right text-success font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(rev.balance)))])]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "font-weight-bold border-top"
  }, [_c("td", [_vm._v("Total Revenues")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-success"
  }, [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.profitAndLoss.total_revenue)))])])], 2)])]), _vm._v(" "), _c("div", {
    staticClass: "statement-section mb-5"
  }, [_c("h6", {
    staticClass: "font-weight-bold border-bottom pb-2 text-danger"
  }, [_vm._v("Expenses")]), _vm._v(" "), _c("table", {
    staticClass: "table table-sm table-borderless"
  }, [_c("tbody", [_vm._l(_vm.profitAndLoss.expenses, function (exp) {
    return _c("tr", {
      key: exp.account_id
    }, [_c("td", [_vm._v(_vm._s(exp.code) + " - " + _vm._s(exp.name))]), _vm._v(" "), _c("td", {
      staticClass: "text-right text-danger font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(exp.balance)))])]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "font-weight-bold border-top"
  }, [_c("td", [_vm._v("Total Expenses")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-danger"
  }, [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.profitAndLoss.total_expense)))])])], 2)])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-between align-items-center bg-light-blue p-4 rounded border mt-4"
  }, [_c("h5", {
    staticClass: "font-weight-bold mb-0 text-primary"
  }, [_vm._v("Net Profit / Operating Margin")]), _vm._v(" "), _c("h4", {
    staticClass: "font-weight-bold mb-0 text-success"
  }, [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.profitAndLoss.net_profit)))])])])]) : _vm._e(), _vm._v(" "), _vm.statementType === "balance-sheet" && _vm.balanceSheet ? _c("div", [_c("div", {
    staticClass: "border rounded-lg p-5 shadow-sm bg-white mb-6"
  }, [_c("h5", {
    staticClass: "text-primary font-weight-bold mb-4"
  }, [_vm._v("Balance Sheet")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "border-right",
    attrs: {
      md: "6"
    }
  }, [_c("h6", {
    staticClass: "font-weight-bold border-bottom pb-2 text-success"
  }, [_vm._v("Assets")]), _vm._v(" "), _c("table", {
    staticClass: "table table-sm table-borderless"
  }, [_c("tbody", [_vm._l(_vm.balanceSheet.assets, function (ast) {
    return _c("tr", {
      key: ast.account_id
    }, [_c("td", [_vm._v(_vm._s(ast.code) + " - " + _vm._s(ast.name))]), _vm._v(" "), _c("td", {
      staticClass: "text-right font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(ast.balance)))])]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "font-weight-bold border-top bg-light"
  }, [_c("td", [_vm._v("Total Assets")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-success"
  }, [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.balanceSheet.total_assets)))])])], 2)])]), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "6"
    }
  }, [_c("h6", {
    staticClass: "font-weight-bold border-bottom pb-2 text-danger"
  }, [_vm._v("Liabilities & Equities")]), _vm._v(" "), _c("table", {
    staticClass: "table table-sm table-borderless"
  }, [_c("tbody", [_vm._l(_vm.balanceSheet.liabilities, function (lia) {
    return _c("tr", {
      key: lia.account_id
    }, [_c("td", [_vm._v(_vm._s(lia.code) + " - " + _vm._s(lia.name))]), _vm._v(" "), _c("td", {
      staticClass: "text-right font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(lia.balance)))])]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "border-top"
  }, [_c("td", {
    staticClass: "py-1",
    attrs: {
      colspan: "2"
    }
  })]), _vm._v(" "), _vm._l(_vm.balanceSheet.equity, function (eqt) {
    return _c("tr", {
      key: eqt.code
    }, [_c("td", [_vm._v(_vm._s(eqt.code) + " - " + _vm._s(eqt.name))]), _vm._v(" "), _c("td", {
      staticClass: "text-right font-weight-bold"
    }, [_vm._v("INR " + _vm._s(_vm.formatAmount(eqt.balance)))])]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "font-weight-bold border-top bg-light"
  }, [_c("td", [_vm._v("Total Liabilities & Equity")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-danger"
  }, [_vm._v("INR " + _vm._s(_vm.formatAmount(parseFloat(_vm.balanceSheet.total_liabilities) + parseFloat(_vm.balanceSheet.total_equity))))])])], 2)])])], 1), _vm._v(" "), Math.abs(parseFloat(_vm.balanceSheet.total_assets) - (parseFloat(_vm.balanceSheet.total_liabilities) + parseFloat(_vm.balanceSheet.total_equity))) < 0.05 ? _c("div", {
    staticClass: "alert alert-success mt-4 mb-0 text-center font-weight-bold"
  }, [_vm._v("\n                                        🟢 Balanced: Assets equal Liabilities plus Equities!\n                                    ")]) : _c("div", {
    staticClass: "alert alert-warning mt-4 mb-0 text-center font-weight-bold"
  }, [_vm._v("\n                                        ⚠️ Out of Balance: Assets do not equal Liabilities plus Equities!\n                                    ")])], 1)]) : _vm._e()]) : _vm._e()])])])])], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      title: "Create Draft Sales Invoice",
      "hide-footer": "",
      size: "lg"
    },
    model: {
      value: _vm.showInvoiceModal,
      callback: function callback($$v) {
        _vm.showInvoiceModal = $$v;
      },
      expression: "showInvoiceModal"
    }
  }, [_c("b-form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submitInvoice.apply(null, arguments);
      }
    }
  }, [_c("b-row", {
    staticClass: "mb-3"
  }, [_c("b-col", {
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Job Card / Enquiry")]), _vm._v(" "), _c("b-form-select", {
    attrs: {
      required: ""
    },
    model: {
      value: _vm.newInvoice.job_id,
      callback: function callback($$v) {
        _vm.$set(_vm.newInvoice, "job_id", $$v);
      },
      expression: "newInvoice.job_id"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select Operational Job")]), _vm._v(" "), _vm._l(_vm.jobs, function (job) {
    return _c("option", {
      key: job.id,
      domProps: {
        value: job.id
      }
    }, [_vm._v("\n                            " + _vm._s(job.enquiry_no) + " (" + _vm._s(job.transport_mode) + " - " + _vm._s(job.status) + ")\n                        ")]);
  })], 2)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Client Company")]), _vm._v(" "), _c("b-form-select", {
    attrs: {
      required: ""
    },
    model: {
      value: _vm.newInvoice.client_id,
      callback: function callback($$v) {
        _vm.$set(_vm.newInvoice, "client_id", $$v);
      },
      expression: "newInvoice.client_id"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select Billed Client")]), _vm._v(" "), _vm._l(_vm.companies, function (com) {
    return _c("option", {
      key: com.id,
      domProps: {
        value: com.id
      }
    }, [_vm._v("\n                            " + _vm._s(com.name) + "\n                        ")]);
  })], 2)], 1)], 1), _vm._v(" "), _c("b-row", {
    staticClass: "mb-3"
  }, [_c("b-col", {
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Type")]), _vm._v(" "), _c("b-form-select", {
    attrs: {
      required: ""
    },
    model: {
      value: _vm.newInvoice.type,
      callback: function callback($$v) {
        _vm.$set(_vm.newInvoice, "type", $$v);
      },
      expression: "newInvoice.type"
    }
  }, [_c("option", {
    attrs: {
      value: "invoice"
    }
  }, [_vm._v("Sales Invoice")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "debit_note"
    }
  }, [_vm._v("Debit Note")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "credit_note"
    }
  }, [_vm._v("Credit Note")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "brokerage"
    }
  }, [_vm._v("Brokerage Invoice")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "consol_invoice"
    }
  }, [_vm._v("Consolidation Invoice")])])], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Document Date")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "date",
      required: ""
    },
    model: {
      value: _vm.newInvoice.document_date,
      callback: function callback($$v) {
        _vm.$set(_vm.newInvoice, "document_date", $$v);
      },
      expression: "newInvoice.document_date"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Due Date")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "date",
      required: ""
    },
    model: {
      value: _vm.newInvoice.due_date,
      callback: function callback($$v) {
        _vm.$set(_vm.newInvoice, "due_date", $$v);
      },
      expression: "newInvoice.due_date"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "border-top pt-3 mt-4"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-3"
  }, [_c("h6", {
    staticClass: "font-weight-bold mb-0"
  }, [_vm._v("Invoice Line Items")]), _vm._v(" "), _c("b-button", {
    attrs: {
      size: "sm",
      variant: "outline-primary"
    },
    on: {
      click: _vm.addInvoiceItem
    }
  }, [_vm._v("Add Line")])], 1), _vm._v(" "), _vm._l(_vm.newInvoice.items, function (item, idx) {
    return _c("div", {
      key: idx,
      staticClass: "border p-3 rounded mb-3 bg-light"
    }, [_c("b-row", [_c("b-col", {
      attrs: {
        md: "3"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Charge Type")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        required: ""
      },
      model: {
        value: item.charge_type,
        callback: function callback($$v) {
          _vm.$set(item, "charge_type", $$v);
        },
        expression: "item.charge_type"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      attrs: {
        md: "4"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Description")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        required: ""
      },
      model: {
        value: item.description,
        callback: function callback($$v) {
          _vm.$set(item, "description", $$v);
        },
        expression: "item.description"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        md: "1.5"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Qty/Weight")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        required: ""
      },
      on: {
        input: _vm.updateInvoiceTotals
      },
      model: {
        value: item.qty,
        callback: function callback($$v) {
          _vm.$set(item, "qty", $$v);
        },
        expression: "item.qty"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        md: "1.5"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Rate")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        required: ""
      },
      on: {
        input: _vm.updateInvoiceTotals
      },
      model: {
        value: item.unit_rate,
        callback: function callback($$v) {
          _vm.$set(item, "unit_rate", $$v);
        },
        expression: "item.unit_rate"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        md: "1.5"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Tax (%)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        required: ""
      },
      on: {
        input: _vm.updateInvoiceTotals
      },
      model: {
        value: item.tax_rate,
        callback: function callback($$v) {
          _vm.$set(item, "tax_rate", $$v);
        },
        expression: "item.tax_rate"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "d-flex align-items-end justify-content-center",
      attrs: {
        md: "0.5"
      }
    }, [_c("b-button", {
      attrs: {
        size: "sm",
        variant: "danger"
      },
      on: {
        click: function click($event) {
          return _vm.removeInvoiceItem(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    })], 1)], 1)], 1)], 1);
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "border-top pt-3 mt-4 text-right bg-light p-3 rounded"
  }, [_c("span", {
    staticClass: "d-block font-size-sm text-muted"
  }, [_vm._v("Subtotal: "), _c("strong", [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.newInvoice.subtotal)))])]), _vm._v(" "), _c("span", {
    staticClass: "d-block font-size-sm text-muted"
  }, [_vm._v("Tax Amount: "), _c("strong", [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.newInvoice.tax_amount)))])]), _vm._v(" "), _c("span", {
    staticClass: "d-block font-size-md font-weight-bold text-primary"
  }, [_vm._v("Grand Total: INR " + _vm._s(_vm.formatAmount(_vm.newInvoice.grand_total)))])]), _vm._v(" "), _c("div", {
    staticClass: "text-right mt-4"
  }, [_c("b-button", {
    staticClass: "mr-2",
    attrs: {
      variant: "secondary"
    },
    on: {
      click: function click($event) {
        _vm.showInvoiceModal = false;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("b-button", {
    attrs: {
      type: "submit",
      variant: "primary"
    }
  }, [_vm._v("Save Draft")])], 1)], 1)], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      title: "Create Draft Purchase Voucher",
      "hide-footer": "",
      size: "lg"
    },
    model: {
      value: _vm.showVoucherModal,
      callback: function callback($$v) {
        _vm.showVoucherModal = $$v;
      },
      expression: "showVoucherModal"
    }
  }, [_c("b-form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submitVoucher.apply(null, arguments);
      }
    }
  }, [_c("b-row", {
    staticClass: "mb-3"
  }, [_c("b-col", {
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Job Card / Enquiry")]), _vm._v(" "), _c("b-form-select", {
    attrs: {
      required: ""
    },
    model: {
      value: _vm.newVoucher.job_id,
      callback: function callback($$v) {
        _vm.$set(_vm.newVoucher, "job_id", $$v);
      },
      expression: "newVoucher.job_id"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select Operational Job")]), _vm._v(" "), _vm._l(_vm.jobs, function (job) {
    return _c("option", {
      key: job.id,
      domProps: {
        value: job.id
      }
    }, [_vm._v("\n                            " + _vm._s(job.enquiry_no) + " (" + _vm._s(job.transport_mode) + " - " + _vm._s(job.status) + ")\n                        ")]);
  })], 2)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Vendor Carrier")]), _vm._v(" "), _c("b-form-select", {
    attrs: {
      required: ""
    },
    model: {
      value: _vm.newVoucher.vendor_id,
      callback: function callback($$v) {
        _vm.$set(_vm.newVoucher, "vendor_id", $$v);
      },
      expression: "newVoucher.vendor_id"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select Billed Vendor")]), _vm._v(" "), _vm._l(_vm.companies, function (com) {
    return _c("option", {
      key: com.id,
      domProps: {
        value: com.id
      }
    }, [_vm._v("\n                            " + _vm._s(com.name) + "\n                        ")]);
  })], 2)], 1)], 1), _vm._v(" "), _c("b-row", {
    staticClass: "mb-3"
  }, [_c("b-col", {
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Document Date")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "date",
      required: ""
    },
    model: {
      value: _vm.newVoucher.document_date,
      callback: function callback($$v) {
        _vm.$set(_vm.newVoucher, "document_date", $$v);
      },
      expression: "newVoucher.document_date"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Vendor Invoice No")]), _vm._v(" "), _c("b-form-input", {
    model: {
      value: _vm.newVoucher.vendor_invoice_no,
      callback: function callback($$v) {
        _vm.$set(_vm.newVoucher, "vendor_invoice_no", $$v);
      },
      expression: "newVoucher.vendor_invoice_no"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "font-weight-bold"
  }, [_vm._v("Vendor Invoice Date")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "date"
    },
    model: {
      value: _vm.newVoucher.vendor_invoice_date,
      callback: function callback($$v) {
        _vm.$set(_vm.newVoucher, "vendor_invoice_date", $$v);
      },
      expression: "newVoucher.vendor_invoice_date"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "border-top pt-3 mt-4"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-3"
  }, [_c("h6", {
    staticClass: "font-weight-bold mb-0"
  }, [_vm._v("Voucher Cost Items")]), _vm._v(" "), _c("b-button", {
    attrs: {
      size: "sm",
      variant: "outline-primary"
    },
    on: {
      click: _vm.addVoucherItem
    }
  }, [_vm._v("Add Line")])], 1), _vm._v(" "), _vm._l(_vm.newVoucher.items, function (item, idx) {
    return _c("div", {
      key: idx,
      staticClass: "border p-3 rounded mb-3 bg-light"
    }, [_c("b-row", [_c("b-col", {
      attrs: {
        md: "3"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Charge Type")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        required: ""
      },
      model: {
        value: item.charge_type,
        callback: function callback($$v) {
          _vm.$set(item, "charge_type", $$v);
        },
        expression: "item.charge_type"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      attrs: {
        md: "4"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Description")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        required: ""
      },
      model: {
        value: item.description,
        callback: function callback($$v) {
          _vm.$set(item, "description", $$v);
        },
        expression: "item.description"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        md: "1.5"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Qty/Weight")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        required: ""
      },
      on: {
        input: _vm.updateVoucherTotals
      },
      model: {
        value: item.qty,
        callback: function callback($$v) {
          _vm.$set(item, "qty", $$v);
        },
        expression: "item.qty"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        md: "1.5"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Rate")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        required: ""
      },
      on: {
        input: _vm.updateVoucherTotals
      },
      model: {
        value: item.unit_rate,
        callback: function callback($$v) {
          _vm.$set(item, "unit_rate", $$v);
        },
        expression: "item.unit_rate"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        md: "1.5"
      }
    }, [_c("label", {
      staticClass: "font-size-sm"
    }, [_vm._v("Tax (%)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        required: ""
      },
      on: {
        input: _vm.updateVoucherTotals
      },
      model: {
        value: item.tax_rate,
        callback: function callback($$v) {
          _vm.$set(item, "tax_rate", $$v);
        },
        expression: "item.tax_rate"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "d-flex align-items-end justify-content-center",
      attrs: {
        md: "0.5"
      }
    }, [_c("b-button", {
      attrs: {
        size: "sm",
        variant: "danger"
      },
      on: {
        click: function click($event) {
          return _vm.removeVoucherItem(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    })], 1)], 1)], 1)], 1);
  })], 2), _vm._v(" "), _c("div", {
    staticClass: "border-top pt-3 mt-4 text-right bg-light p-3 rounded"
  }, [_c("span", {
    staticClass: "d-block font-size-sm text-muted"
  }, [_vm._v("Subtotal: "), _c("strong", [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.newVoucher.subtotal)))])]), _vm._v(" "), _c("span", {
    staticClass: "d-block font-size-sm text-muted"
  }, [_vm._v("Tax Amount: "), _c("strong", [_vm._v("INR " + _vm._s(_vm.formatAmount(_vm.newVoucher.tax_amount)))])]), _vm._v(" "), _c("span", {
    staticClass: "d-block font-size-md font-weight-bold text-primary"
  }, [_vm._v("Grand Total: INR " + _vm._s(_vm.formatAmount(_vm.newVoucher.grand_total)))])]), _vm._v(" "), _c("div", {
    staticClass: "text-right mt-4"
  }, [_c("b-button", {
    staticClass: "mr-2",
    attrs: {
      variant: "secondary"
    },
    on: {
      click: function click($event) {
        _vm.showVoucherModal = false;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("b-button", {
    attrs: {
      type: "submit",
      variant: "primary"
    }
  }, [_vm._v("Save Draft")])], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Financials.vue":
/*!**************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Financials.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Financials_vue_vue_type_template_id_0a8a95e1_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Financials.vue?vue&type=template&id=0a8a95e1&scoped=true */ "./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=template&id=0a8a95e1&scoped=true");
/* harmony import */ var _Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Financials.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=script&lang=js");
/* harmony import */ var _Financials_vue_vue_type_style_index_0_id_0a8a95e1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Financials_vue_vue_type_template_id_0a8a95e1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Financials_vue_vue_type_template_id_0a8a95e1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0a8a95e1",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/Financials.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Financials.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=template&id=0a8a95e1&scoped=true":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=template&id=0a8a95e1&scoped=true ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_template_id_0a8a95e1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_template_id_0a8a95e1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_template_id_0a8a95e1_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Financials.vue?vue&type=template&id=0a8a95e1&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=template&id=0a8a95e1&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Financials_vue_vue_type_style_index_0_id_0a8a95e1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Financials.vue?vue&type=style&index=0&id=0a8a95e1&scoped=true&lang=css");


/***/ })

}]);