"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_MoneyOut_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MoneyOut",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    stages: [],
    stage: "due",
    branches: [],
    vouchers: [],
    total: 0,
    payments: [],
    modes: [],
    picked: {},
    amounts: {},
    form: {
      agent_id: null,
      payment_date: new Date().toISOString().slice(0, 10),
      mode: "bank_transfer",
      reference: ""
    },
    showPaid: false,
    confirming: false,
    lastRun: null,
    loading: true,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(["designation"])), {}, {
    /* Accounts pay. The Boss reads what is owed. */
    canPay() {
      return this.designation === "accounts";
    },
    current() {
      return this.stages.find(s => s.key === this.stage) || null;
    },
    chosen() {
      return this.vouchers.filter(v => this.picked[v.id]);
    },
    payingTotal() {
      return this.chosen.reduce((sum, v) => sum + (Number(this.amounts[v.id]) || 0), 0);
    },
    overAllocated() {
      return this.chosen.some(v => (Number(this.amounts[v.id]) || 0) > Number(v.outstanding) + 0.009);
    },
    /** The run, grouped the way it will actually be raised. */
    payees() {
      const byVendor = {};
      this.chosen.forEach(v => {
        byVendor[v.vendor_id] ??= {
          vendor_id: v.vendor_id,
          vendor: v.vendor,
          count: 0,
          amount: 0
        };
        byVendor[v.vendor_id].count++;
        byVendor[v.vendor_id].amount += Number(this.amounts[v.id]) || 0;
      });
      return Object.values(byVendor);
    },
    payeeCount() {
      return this.payees.length;
    }
  }),
  created() {
    this.load();
  },
  methods: {
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/money-out/stages").then(({
        data
      }) => {
        this.stages = data.stages || [];
        this.branches = data.branches || [];
        if (!this.form.agent_id && this.branches.length) this.form.agent_id = this.branches[0].id;
        this.error = null;
        return Promise.all([this.loadDue(), this.loadPayments()]);
      }).catch(e => {
        this.error = e.response && e.response.data && e.response.data.error || "Money out could not be loaded.";
      }).finally(() => {
        this.loading = false;
      });
    },
    loadDue() {
      return _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/payments/due" + (this.form.agent_id ? "?agent_id=" + this.form.agent_id : "")).then(({
        data
      }) => {
        this.vouchers = data.vouchers || [];
        this.total = data.total || 0;
        this.picked = {};
        this.amounts = {};
      }).catch(() => {});
    },
    loadPayments() {
      return _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/payments").then(({
        data
      }) => {
        this.payments = data.rows || [];
        this.modes = data.modes || [];
      }).catch(() => {});
    },
    /** Ticking a voucher fills in its full balance — the common case is paying it off. */
    toggle(voucher, on) {
      this.$set(this.picked, voucher.id, on);
      this.$set(this.amounts, voucher.id, on ? Number(voucher.outstanding) : 0);
    },
    build() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/payments/run", _objectSpread(_objectSpread({}, this.form), {}, {
        allocations: this.chosen.map(v => ({
          purchase_voucher_id: v.id,
          amount: Number(this.amounts[v.id])
        }))
      })).then(({
        data
      }) => {
        this.lastRun = data;
        this.confirming = false;
        this.load();
      }).catch(e => {
        this.actionError = e.response && e.response.data && e.response.data.error || "The run could not be built.";
      }).finally(() => {
        this.busy = false;
      });
    },
    post(payment) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/payments/${payment.id}/post`, {}).then(() => this.load()).catch(e => {
        this.actionError = e.response && e.response.data && e.response.data.error || "It would not post.";
      }).finally(() => {
        this.busy = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=template&id=3ec46494":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=template&id=3ec46494 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v("Money out")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.current ? _vm.current.note : "What we owe, and what we are about to pay.") + "\n      "), _c("router-link", {
    attrs: {
      to: "/today"
    }
  }, [_vm._v("Today →")])], 1)]), _vm._v(" "), _c("nav", {
    staticClass: "fx-pipeline",
    attrs: {
      "aria-label": "Money out"
    }
  }, _vm._l(_vm.stages, function (s) {
    return _c("button", {
      key: s.key,
      staticClass: "fx-pipeline__stage",
      class: {
        "is-active": _vm.stage === s.key,
        "is-empty": !s.count,
        "is-warning": s.tone === "warning" && s.count
      },
      attrs: {
        "aria-current": _vm.stage === s.key ? "step" : null
      },
      on: {
        click: function ($event) {
          _vm.stage = s.key;
        }
      }
    }, [_c("span", {
      staticClass: "fx-pipeline__step"
    }, [_vm._v(_vm._s(s.step))]), _vm._v(" "), _c("span", {
      staticClass: "fx-pipeline__label"
    }, [_vm._v(_vm._s(s.label))]), _vm._v(" "), _c("span", {
      staticClass: "fx-pipeline__figure"
    }, [_c("Figure", {
      attrs: {
        value: s.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("span", {
      staticClass: "fx-pipeline__count"
    }, [_vm._v(_vm._s(s.count) + " " + _vm._s(s.count === 1 ? "item" : "items"))])]);
  }), 0), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.current ? _vm.current.note : ""))]), _vm._v(" "), _vm.stage !== "due" ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.stage === "to_cost" ? _c("router-link", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      to: "/profitability"
    }
  }, [_vm._v("\n        See which shipments\n      ")]) : _vm.stage === "vouchers" ? _c("router-link", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      to: {
        path: "/financials",
        query: {
          view: "vouchers"
        }
      }
    }
  }, [_vm._v("Open the voucher register")]) : _c("router-link", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      to: {
        path: "/financials",
        query: {
          view: "vendors"
        }
      }
    }
  }, [_vm._v("Open the supplier statements")])], 1) : [_c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.agent_id,
      expression: "form.agent_id"
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
        _vm.$set(_vm.form, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.loadDue]
    }
  }, _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.showPaid = !_vm.showPaid;
      }
    }
  }, [_vm._v("\n          " + _vm._s(_vm.showPaid ? "Back to what is due" : "What has been paid") + "\n        ")])]), _vm._v(" "), !_vm.showPaid ? [!_vm.vouchers.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing is owed to suppliers.")]) : [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.vouchers, function (v) {
    return _c("tr", {
      key: "v-" + v.id,
      class: {
        "is-selected": _vm.picked[v.id]
      }
    }, [_c("td", [_c("input", {
      attrs: {
        type: "checkbox",
        "aria-label": "Pay " + v.voucher_no
      },
      domProps: {
        checked: !!_vm.picked[v.id]
      },
      on: {
        change: function ($event) {
          return _vm.toggle(v, $event.target.checked);
        }
      }
    })]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(v.voucher_no))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(v.vendor))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(v.job_no || "—"))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: v.due_on,
        kind: "date"
      }
    }), _vm._v(" "), v.due_assumed ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("(assumed)")]) : _vm._e()], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(v.days_old) + " days")]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: v.outstanding,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model.number",
        value: _vm.amounts[v.id],
        expression: "amounts[v.id]",
        modifiers: {
          number: true
        }
      }],
      staticClass: "fx-input fx-num",
      attrs: {
        type: "number",
        step: "0.01",
        min: "0",
        disabled: !_vm.picked[v.id]
      },
      domProps: {
        value: _vm.amounts[v.id]
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.amounts, v.id, _vm._n($event.target.value));
        },
        blur: function ($event) {
          return _vm.$forceUpdate();
        }
      }
    })])]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    attrs: {
      colspan: "6"
    }
  }, [_c("strong", [_vm._v(_vm._s(_vm.chosen.length) + " chosen")])]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.payingTotal,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])])])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n            " + _vm._s(_vm.payeeCount) + " supplier" + _vm._s(_vm.payeeCount === 1 ? "" : "s") + " in this run — one payment each, because\n            each is its own bank transfer.\n          ")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Payment date")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.payment_date,
      expression: "form.payment_date"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.form.payment_date
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "payment_date", $event.target.value);
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
      value: _vm.form.mode,
      expression: "form.mode"
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
        _vm.$set(_vm.form, "mode", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
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
  }, [_vm._v("Our reference")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.reference,
      expression: "form.reference"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "batch or UTR"
    },
    domProps: {
      value: _vm.form.reference
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "reference", $event.target.value);
      }
    }
  })]), _vm._v(" "), _vm.canPay ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.chosen.length || _vm.overAllocated
    },
    on: {
      click: function ($event) {
        _vm.confirming = true;
      }
    }
  }, [_vm._v("\n              " + _vm._s(_vm.busy ? "Building…" : "Build the run") + "\n            ")]) : _vm._e()]), _vm._v(" "), _vm.overAllocated ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v("\n            One of those is more than the voucher still owes.\n          ")]) : _vm._e()]] : [!_vm.payments.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No payment has been made.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Payment")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Supplier")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("How")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Settles")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Posted")]), _vm._v(" "), _vm.canPay ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.payments, function (p) {
    return _c("tr", {
      key: "p-" + p.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(p.payment_no))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: p.payment_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(p.payee || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s((p.mode || "").replace(/_/g, " ")))]), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(p.allocations.map(a => a.voucher_no).join(", ") || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: p.is_posted ? "posted" : "unposted"
      }
    })], 1), _vm._v(" "), _vm.canPay ? _c("td", {
      staticClass: "fx-row-actions"
    }, [!p.is_posted ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.post(p);
        }
      }
    }, [_vm._v("Post")]) : _vm._e()]) : _vm._e()]);
  }), 0)])], _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e(), _vm._v(" "), _vm.lastRun ? _c("p", {
    staticClass: "fx-notice",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n        " + _vm._s(_vm.lastRun.payments.length) + " payment(s) raised as " + _vm._s(_vm.lastRun.run_ref) + ",\n        " + _vm._s(_vm.money(_vm.lastRun.total)) + " in total. Post each one to move it through the ledger.\n      ")]) : _vm._e()]], _vm._v(" "), _vm.confirming ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "run-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "run-title"
    }
  }, [_vm._v("Pay " + _vm._s(_vm.money(_vm.payingTotal)) + "?")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.payees, function (p) {
    return _c("tr", {
      key: "pay-" + p.vendor_id
    }, [_c("td", [_vm._v(_vm._s(p.vendor))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(p.count))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          One payment each. Nothing leaves a bank account from here — this records what you are paying, and each\n          payment posts to the ledger separately.\n        ")]), _vm._v(" "), _vm.actionError ? _c("p", {
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
        _vm.confirming = false;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.build
    }
  }, [_vm._v("Raise the payments")])])])]) : _vm._e()], 2);
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
  }, [_vm._v("Dated")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Age")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Outstanding")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Pay now")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Supplier")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Vouchers")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Amount")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/MoneyOut.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MoneyOut.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MoneyOut_vue_vue_type_template_id_3ec46494__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MoneyOut.vue?vue&type=template&id=3ec46494 */ "./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=template&id=3ec46494");
/* harmony import */ var _MoneyOut_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MoneyOut.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MoneyOut_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MoneyOut_vue_vue_type_template_id_3ec46494__WEBPACK_IMPORTED_MODULE_0__.render,
  _MoneyOut_vue_vue_type_template_id_3ec46494__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/MoneyOut.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyOut_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MoneyOut.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyOut_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=template&id=3ec46494":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=template&id=3ec46494 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyOut_vue_vue_type_template_id_3ec46494__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyOut_vue_vue_type_template_id_3ec46494__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyOut_vue_vue_type_template_id_3ec46494__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MoneyOut.vue?vue&type=template&id=3ec46494 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyOut.vue?vue&type=template&id=3ec46494");


/***/ })

}]);