"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_FinanceSettings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************/
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





/** Settings → Finance (PRD §2.4): the chart of accounts and the rate cards, per branch (user, 2026-09-18). */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FinanceSettings",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    accounts: [],
    rateCards: [],
    branches: [],
    branchId: null,
    /** TDS rate table: editable defaults, per branch (user, 2026-09-25). */
    tdsRates: [],
    tdsEditing: null,
    tdsForm: {
      description: "",
      rate: 0,
      rate_no_pan: 20,
      threshold_single: null,
      threshold_annual: null,
      is_active: true
    },
    /** The bank accounts master (user, 2026-09-21). */
    banks: [],
    legacyBalance: 0,
    bankForm: {
      id: null,
      agent_id: null,
      name: "",
      bank_name: "",
      account_no: "",
      ifsc_code: "",
      is_default: false
    },
    customers: [],
    partners: [],
    loading: true,
    busy: false,
    error: null,
    actionError: null,
    editing: null,
    editName: "",
    /** Our own GSTIN, per branch (user, 2026-09-22) — GAPS #36. */
    gstinEditing: null,
    gstinValue: "",
    newAccount: {
      agent_id: null,
      account_code: "",
      account_name: ""
    },
    newRate: {
      agent_id: null,
      charge_type: "air_freight",
      party_type: "customer",
      party_id: null,
      weight_break_from: 0,
      weight_break_to: 1000,
      rate: 0,
      currency: "INR",
      valid_from: "",
      valid_to: ""
    }
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(["designation"])), {}, {
    /* Accounts keeps the ledger; the Boss may set the rates their branches quote. */
    canEdit() {
      return this.designation === "accounts" || this.designation === "boss";
    },
    /* Changing a bank account is `manageFinanceSettings` — the same two roles. */
    canManage() {
      return this.canEdit;
    },
    rateValid() {
      const r = this.newRate;
      return r.agent_id && r.charge_type && r.party_id && r.rate > 0 && r.valid_from && r.valid_to && r.valid_to >= r.valid_from && r.weight_break_to >= r.weight_break_from;
    }
  }),
  created() {
    this.load();
    this.loadBanks();
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/customers").then(({
      data
    }) => {
      this.customers = data.data || [];
    }).catch(() => {});
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners").then(({
      data
    }) => {
      this.partners = data.data || [];
    }).catch(() => {});
  },
  methods: {
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
    },
    blankBank() {
      return {
        id: null,
        agent_id: this.branches.length ? this.branches[0].id : null,
        name: "",
        bank_name: "",
        account_no: "",
        ifsc_code: "",
        is_default: false
      };
    },
    loadBanks() {
      return _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/bank-accounts" + (this.branchId ? "?agent_id=" + this.branchId : "")).then(({
        data
      }) => {
        this.banks = data.accounts || [];
        this.legacyBalance = data.legacy_balance || 0;
        if (!this.bankForm.agent_id) this.bankForm = this.blankBank();
      }).catch(() => {});
    },
    editBank(bank) {
      // 🔐 The number is never returned, so the boxes start empty: re-enter to change them.
      this.bankForm = {
        id: bank.id,
        agent_id: bank.agent_id,
        name: bank.name,
        bank_name: bank.bank_name,
        account_no: "",
        ifsc_code: "",
        is_default: !!bank.is_default
      };
    },
    editGstin(branch) {
      this.gstinEditing = branch.id;
      this.gstinValue = branch.gst_no || "";
      this.actionError = null;
    },
    /*
     * ⚠️ The server validates the 15-character shape and refuses anything else. A GSTIN with a transposed
     * state code files every intrastate supply as interstate and validates cleanly at the portal — so it is
     * refused at entry rather than discovered by a customer who cannot claim their credit.
     */
    saveGstin(branch) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/finance-settings/gstin", {
        agent_id: branch.id,
        gst_no: this.gstinValue || null
      }).then(() => {
        this.gstinEditing = null;
        return this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    saveBank() {
      this.busy = true;
      this.actionError = null;
      const body = _objectSpread({}, this.bankForm);
      Object.keys(body).forEach(k => {
        if (body[k] === "") body[k] = null;
      });
      const call = this.bankForm.id ? _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put(`/bank-accounts/${this.bankForm.id}`, body) : _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/bank-accounts", body);
      call.then(() => {
        this.bankForm = this.blankBank();
        return this.loadBanks();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    closeBank(bank) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/bank-accounts/${bank.id}/close`, {}).then(() => this.loadBanks()).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/finance-settings" + (this.branchId ? "?agent_id=" + this.branchId : "")).then(({
        data
      }) => {
        this.take(data);
        this.error = null;
        return this.loadBanks();
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    take(data) {
      this.accounts = data.accounts || [];
      this.rateCards = data.rate_cards || [];
      this.tdsRates = data.tds_rates || [];
      this.branches = data.branches || [];
      if (!this.newAccount.agent_id && this.branches.length) {
        this.newAccount.agent_id = this.branches[0].id;
        this.newRate.agent_id = this.branches[0].id;
      }
    },
    startRename(account) {
      this.editing = account.id;
      this.editName = account.account_name;
    },
    rename(account) {
      this.save("/finance-settings/accounts", {
        agent_id: account.agent_id,
        account_code: account.account_code,
        account_name: this.editName
      }, () => {
        this.editing = null;
      });
    },
    addAccount() {
      this.save("/finance-settings/accounts", this.newAccount, () => {
        this.newAccount = _objectSpread(_objectSpread({}, this.newAccount), {}, {
          account_code: "",
          account_name: ""
        });
      });
    },
    editTdsRate(rate) {
      this.tdsEditing = rate.id;
      this.tdsForm = {
        description: rate.description,
        rate: rate.rate,
        rate_no_pan: rate.rate_no_pan,
        threshold_single: rate.threshold_single,
        threshold_annual: rate.threshold_annual,
        is_active: !!rate.is_active
      };
      this.actionError = null;
    },
    saveTdsRate(rate) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/finance-settings/tds-rates", _objectSpread({
        agent_id: rate.agent_id,
        section: rate.section
      }, this.tdsForm)).then(({
        data
      }) => {
        this.take(data);
        this.tdsEditing = null;
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    addRate() {
      this.save("/finance-settings/rate-cards", this.newRate, () => {
        this.newRate = _objectSpread(_objectSpread({}, this.newRate), {}, {
          party_id: null,
          rate: 0
        });
      });
    },
    removeRate(card) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](`/finance-settings/rate-cards/${card.id}`).then(({
        data
      }) => this.take(data)).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    save(path, payload, done) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(path, payload).then(({
        data
      }) => {
        this.take(data);
        done();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      const invalid = d.errors && Object.values(d.errors)[0];
      return invalid && invalid[0] || d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=template&id=fbb1aef6":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=template&id=fbb1aef6 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_vm._m(0), _vm._v(" "), _vm.branches.length > 1 ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
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
  })], 2)])]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("GST registration")]), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("GSTIN")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("State code")]), _vm._v(" "), _vm.canManage ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.branches, function (b) {
    return _c("tr", {
      key: "g-" + b.id
    }, [_c("td", [_vm._v(_vm._s(b.name) + " "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(b.branch_code))])]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm.gstinEditing === b.id ? [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.gstinValue,
        expression: "gstinValue"
      }],
      staticClass: "fx-input",
      attrs: {
        maxlength: "15",
        placeholder: "27AAACR1000A1Z5",
        "aria-label": "GSTIN"
      },
      domProps: {
        value: _vm.gstinValue
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.gstinValue = $event.target.value;
        }
      }
    })] : b.gst_no ? [_vm._v(_vm._s(b.gst_no))] : _c("span", {
      staticClass: "fx-error"
    }, [_vm._v("Not set — no return can be filed")])], 2), _vm._v(" "), _c("td", [_vm._v(_vm._s(b.gst_no ? b.gst_no.slice(0, 2) : "—"))]), _vm._v(" "), _vm.canManage ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_vm.gstinEditing === b.id ? [_c("button", {
      staticClass: "fx-btn fx-btn--primary",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.saveGstin(b);
        }
      }
    }, [_vm._v("Save")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          _vm.gstinEditing = null;
        }
      }
    }, [_vm._v("Cancel")])] : _c("button", {
      staticClass: "fx-btn",
      on: {
        click: function ($event) {
          return _vm.editGstin(b);
        }
      }
    }, [_vm._v(_vm._s(b.gst_no ? "Change" : "Set it"))])], 2) : _vm._e()]);
  }), 0)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        ⚠️ Changing it does not rewrite history. Documents already finalized keep the split they were\n        registered with, and the GST return reports any that now disagree rather than re-splitting them\n        quietly.\n      ")])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Bank accounts")]), _vm._v(" "), _vm._m(2), _vm._v(" "), !_vm.banks.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No bank account has been added; money posts to one undifferentiated account.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Account")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Bank")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Number")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Posts to")]), _vm._v(" "), _vm.branches.length > 1 ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Balance")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Waiting")]), _vm._v(" "), _vm.canManage ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.banks, function (b) {
    return _c("tr", {
      key: "b-" + b.id
    }, [_c("td", [_vm._v("\n              " + _vm._s(b.name) + "\n              "), b.is_default ? _c("StatusChip", {
      attrs: {
        value: "default"
      }
    }) : _vm._e()], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(b.bank_name || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(b.last_four ? "•••• " + b.last_four : "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(b.account_code))]), _vm._v(" "), _vm.branches.length > 1 ? _c("td", [_vm._v(_vm._s(b.branch))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: b.balance,
        kind: "currency",
        "currency-code": b.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(b.unreconciled ? b.unreconciled + " to place" : "—"))]), _vm._v(" "), _vm.canManage ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      on: {
        click: function ($event) {
          return _vm.editBank(b);
        }
      }
    }, [_vm._v("Edit")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.closeBank(b);
        }
      }
    }, [_vm._v("Close")])]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.legacyBalance ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        " + _vm._s(_vm.money(_vm.legacyBalance)) + " sits on the single account money posted to before this list existed.\n      ")]) : _vm._e(), _vm._v(" "), _vm.canManage ? [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v(_vm._s(_vm.bankForm.id ? "Edit " + _vm.bankForm.name : "Add a bank account"))]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.branches.length > 1 && !_vm.bankForm.id ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bankForm.agent_id,
      expression: "bankForm.agent_id"
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
        _vm.$set(_vm.bankForm, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
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
  }, [_vm._v("What you call it")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bankForm.name,
      expression: "bankForm.name"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "Collections"
    },
    domProps: {
      value: _vm.bankForm.name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bankForm, "name", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Bank")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bankForm.bank_name,
      expression: "bankForm.bank_name"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "HDFC Bank"
    },
    domProps: {
      value: _vm.bankForm.bank_name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bankForm, "bank_name", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Account number")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bankForm.account_no,
      expression: "bankForm.account_no"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.bankForm.account_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bankForm, "account_no", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("IFSC")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bankForm.ifsc_code,
      expression: "bankForm.ifsc_code"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.bankForm.ifsc_code
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.bankForm, "ifsc_code", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.bankForm.is_default,
      expression: "bankForm.is_default"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.bankForm.is_default) ? _vm._i(_vm.bankForm.is_default, null) > -1 : _vm.bankForm.is_default
    },
    on: {
      change: function ($event) {
        var $$a = _vm.bankForm.is_default,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.bankForm, "is_default", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.bankForm, "is_default", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.bankForm, "is_default", $$c);
        }
      }
    }
  }), _vm._v("\n            The one to use by default\n          ")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.bankForm.name.trim()
    },
    on: {
      click: _vm.saveBank
    }
  }, [_vm._v("\n            " + _vm._s(_vm.bankForm.id ? "Save" : "Add it") + "\n          ")]), _vm._v(" "), _vm.bankForm.id ? _c("button", {
    staticClass: "fx-btn",
    on: {
      click: function ($event) {
        _vm.bankForm = _vm.blankBank();
      }
    }
  }, [_vm._v("Cancel")]) : _vm._e()]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Stored encrypted and never shown again — re-enter to change them.")])] : _vm._e()], 2), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Chart of accounts")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        Where each posting lands. An account appears the first time something is posted to it; name it here so the\n        reports read plainly. A code is never changed — the ledger points at it.\n      ")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Code")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Name")]), _vm._v(" "), _vm.branches.length > 1 ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Postings")]), _vm._v(" "), _vm.canEdit ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.accounts, function (a) {
    return _c("tr", {
      key: "a-" + a.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(a.account_code))]), _vm._v(" "), _c("td", [_vm.editing === a.id ? _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.editName,
        expression: "editName"
      }],
      staticClass: "fx-input",
      domProps: {
        value: _vm.editName
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.editName = $event.target.value;
        }
      }
    }) : _c("span", [_vm._v(_vm._s(a.account_name))])]), _vm._v(" "), _vm.branches.length > 1 ? _c("td", [_vm._v(_vm._s(a.branch))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(a.postings))]), _vm._v(" "), _vm.canEdit ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_vm.editing === a.id ? [_c("button", {
      staticClass: "fx-btn fx-btn--primary",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.rename(a);
        }
      }
    }, [_vm._v("Save")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          _vm.editing = null;
        }
      }
    }, [_vm._v("Cancel")])] : _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.startRename(a);
        }
      }
    }, [_vm._v("Rename")])], 2) : _vm._e()]);
  }), _vm._v(" "), !_vm.accounts.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "5"
    }
  }, [_vm._v("No accounts yet. They appear as soon as something is posted.")])]) : _vm._e()], 2)]), _vm._v(" "), _vm.canEdit ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newAccount.agent_id,
      expression: "newAccount.agent_id",
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
        _vm.$set(_vm.newAccount, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
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
  }, [_vm._v("Code")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newAccount.account_code,
      expression: "newAccount.account_code"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "4000-Freight-Revenue"
    },
    domProps: {
      value: _vm.newAccount.account_code
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newAccount, "account_code", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Name")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newAccount.account_name,
      expression: "newAccount.account_name"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "Freight revenue"
    },
    domProps: {
      value: _vm.newAccount.account_name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newAccount, "account_name", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy || !_vm.newAccount.account_code || !_vm.newAccount.account_name
    },
    on: {
      click: _vm.addAccount
    }
  }, [_vm._v("Add account")])]) : _vm._e()]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("TDS rates")]), _vm._v(" "), _vm._m(3), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Section")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Description")]), _vm._v(" "), _vm.branches.length > 1 ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate %")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("No PAN %")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Per payment")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Annual")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Active")]), _vm._v(" "), _vm.canEdit ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.tdsRates, function (r) {
    return _c("tr", {
      key: "t-" + r.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.section))]), _vm._v(" "), _vm.tdsEditing === r.id ? [_c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.tdsForm.description,
        expression: "tdsForm.description"
      }],
      staticClass: "fx-input",
      domProps: {
        value: _vm.tdsForm.description
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.tdsForm, "description", $event.target.value);
        }
      }
    })]), _vm._v(" "), _vm.branches.length > 1 ? _c("td", [_vm._v(_vm._s(r.branch))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.tdsForm.rate,
        expression: "tdsForm.rate",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input",
      attrs: {
        type: "number",
        step: "0.01",
        min: "0",
        max: "100"
      },
      domProps: {
        value: _vm.tdsForm.rate
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.tdsForm, "rate", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.tdsForm.rate_no_pan,
        expression: "tdsForm.rate_no_pan",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input",
      attrs: {
        type: "number",
        step: "0.01",
        min: "0",
        max: "100"
      },
      domProps: {
        value: _vm.tdsForm.rate_no_pan
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.tdsForm, "rate_no_pan", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.tdsForm.threshold_single,
        expression: "tdsForm.threshold_single",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input",
      attrs: {
        type: "number",
        min: "0"
      },
      domProps: {
        value: _vm.tdsForm.threshold_single
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.tdsForm, "threshold_single", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.tdsForm.threshold_annual,
        expression: "tdsForm.threshold_annual",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input",
      attrs: {
        type: "number",
        min: "0"
      },
      domProps: {
        value: _vm.tdsForm.threshold_annual
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.tdsForm, "threshold_annual", _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })]), _vm._v(" "), _c("td", [_c("label", {
      staticClass: "fx-checkbox"
    }, [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.tdsForm.is_active,
        expression: "tdsForm.is_active"
      }],
      attrs: {
        type: "checkbox"
      },
      domProps: {
        checked: Array.isArray(_vm.tdsForm.is_active) ? _vm._i(_vm.tdsForm.is_active, null) > -1 : _vm.tdsForm.is_active
      },
      on: {
        change: function ($event) {
          var $$a = _vm.tdsForm.is_active,
            $$el = $event.target,
            $$c = $$el.checked ? true : false;
          if (Array.isArray($$a)) {
            var $$v = null,
              $$i = _vm._i($$a, $$v);
            if ($$el.checked) {
              $$i < 0 && _vm.$set(_vm.tdsForm, "is_active", $$a.concat([$$v]));
            } else {
              $$i > -1 && _vm.$set(_vm.tdsForm, "is_active", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.$set(_vm.tdsForm, "is_active", $$c);
          }
        }
      }
    })])]), _vm._v(" "), _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--primary",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.saveTdsRate(r);
        }
      }
    }, [_vm._v("Save")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          _vm.tdsEditing = null;
        }
      }
    }, [_vm._v("Cancel")])])] : [_c("td", [_vm._v(_vm._s(r.description))]), _vm._v(" "), _vm.branches.length > 1 ? _c("td", [_vm._v(_vm._s(r.branch))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.rate))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.rate_no_pan))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.threshold_single !== null ? _vm.money(r.threshold_single) : "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.threshold_annual !== null ? _vm.money(r.threshold_annual) : "—"))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: r.is_active ? "active" : "inactive"
      }
    })], 1), _vm._v(" "), _vm.canEdit ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.editTdsRate(r);
        }
      }
    }, [_vm._v("Edit")])]) : _vm._e()]], 2);
  }), _vm._v(" "), !_vm.tdsRates.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "8"
    }
  }, [_vm._v("No TDS rates yet.")])]) : _vm._e()], 2)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Rate cards")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("A rate agreed with one client or supplier, for a kind of charge and a weight break.")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Charge")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Party")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Weight break")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Valid")]), _vm._v(" "), _vm.branches.length > 1 ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]) : _vm._e(), _vm._v(" "), _vm.canEdit ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.rateCards, function (r) {
    return _c("tr", {
      key: "r-" + r.id
    }, [_c("td", [_vm._v(_vm._s(String(r.charge_type).replace(/_/g, " ")))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.party || r.party_type))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.weight_break_from || 0) + "–" + _vm._s(r.weight_break_to || "∞") + " kg")]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(r.currency) + " " + _vm._s(r.rate))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: r.valid_from,
        kind: "date"
      }
    }), _vm._v(" "), r.valid_to ? [_vm._v(" – "), _c("Figure", {
      attrs: {
        value: r.valid_to,
        kind: "date"
      }
    })] : _vm._e()], 2), _vm._v(" "), _vm.branches.length > 1 ? _c("td", [_vm._v(_vm._s(r.branch))]) : _vm._e(), _vm._v(" "), _vm.canEdit ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.removeRate(r);
        }
      }
    }, [_vm._v("✕")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.rateCards.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "7"
    }
  }, [_vm._v("No rate cards yet.")])]) : _vm._e()], 2)]), _vm._v(" "), _vm.canEdit ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newRate.agent_id,
      expression: "newRate.agent_id",
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
        _vm.$set(_vm.newRate, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
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
  }, [_vm._v("Charge")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newRate.charge_type,
      expression: "newRate.charge_type"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "air_freight"
    },
    domProps: {
      value: _vm.newRate.charge_type
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newRate, "charge_type", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Party")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newRate.party_type,
      expression: "newRate.party_type"
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
        _vm.$set(_vm.newRate, "party_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        _vm.newRate.party_id = null;
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "customer"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "partner"
    }
  }, [_vm._v("Supplier")])])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v(_vm._s(_vm.newRate.party_type === "customer" ? "Client" : "Supplier"))]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newRate.party_id,
      expression: "newRate.party_id",
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
        _vm.$set(_vm.newRate, "party_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.newRate.party_type === "customer" ? _vm.customers : _vm.partners, function (p) {
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
  }, [_vm._v("From kg")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newRate.weight_break_from,
      expression: "newRate.weight_break_from",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      min: "0"
    },
    domProps: {
      value: _vm.newRate.weight_break_from
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newRate, "weight_break_from", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("To kg")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newRate.weight_break_to,
      expression: "newRate.weight_break_to",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      min: "0"
    },
    domProps: {
      value: _vm.newRate.weight_break_to
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newRate, "weight_break_to", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Rate")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.newRate.rate,
      expression: "newRate.rate",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      step: "0.01",
      min: "0"
    },
    domProps: {
      value: _vm.newRate.rate
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newRate, "rate", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Valid from")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newRate.valid_from,
      expression: "newRate.valid_from"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.newRate.valid_from
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newRate, "valid_from", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Valid to")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.newRate.valid_to,
      expression: "newRate.valid_to"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.newRate.valid_to
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.newRate, "valid_to", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy || !_vm.rateValid
    },
    on: {
      click: _vm.addRate
    }
  }, [_vm._v("Add rate")])]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()])]], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Finance settings")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      The bank accounts money moves through, the chart of accounts the ledger posts into, and the rates quoted\n      to clients and agreed with suppliers.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        🔴 One GSTIN per branch, because that is how they are issued — per registered place of business, per\n        state. "), _c("strong", [_vm._v("Nothing about GST works without it:")]), _vm._v(" the same 18% is CGST + SGST to a client in\n        our own state and IGST to one outside it, and with no GSTIN here neither can be decided, so no tax is\n        registered and no return can be filed.\n      ")]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        🔴 Each account posts to its "), _c("strong", [_vm._v("own")]), _vm._v(" ledger code, so the trial balance tells them apart.\n        The code is issued once when the account is added and never changes — renaming it must not move where\n        its history is posted.\n      ")]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        ⚠️ "), _c("strong", [_vm._v("These are editable defaults, checked against the current Finance Act as it stood when\n        this screen was built — not law.")]), _vm._v(" Section 194H alone has moved twice in recent years; check\n        each rate before relying on it, and correct it here the day it changes.\n      ")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/FinanceSettings.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FinanceSettings.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FinanceSettings_vue_vue_type_template_id_fbb1aef6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FinanceSettings.vue?vue&type=template&id=fbb1aef6 */ "./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=template&id=fbb1aef6");
/* harmony import */ var _FinanceSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FinanceSettings.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FinanceSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FinanceSettings_vue_vue_type_template_id_fbb1aef6__WEBPACK_IMPORTED_MODULE_0__.render,
  _FinanceSettings_vue_vue_type_template_id_fbb1aef6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/FinanceSettings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=script&lang=js":
/*!*****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FinanceSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FinanceSettings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FinanceSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=template&id=fbb1aef6":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=template&id=fbb1aef6 ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FinanceSettings_vue_vue_type_template_id_fbb1aef6__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FinanceSettings_vue_vue_type_template_id_fbb1aef6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FinanceSettings_vue_vue_type_template_id_fbb1aef6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FinanceSettings.vue?vue&type=template&id=fbb1aef6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FinanceSettings.vue?vue&type=template&id=fbb1aef6");


/***/ })

}]);