"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_Journal_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Journal.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Journal.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/FxDrawer.vue */ "./resources/js/src/view/pages/freight/components/FxDrawer.vue");



const DRILL_TABS = [{
  key: "journal",
  label: "The whole entry"
}, {
  key: "document",
  label: "The document"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Journal",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    DRILL_TABS,
    entries: [],
    totals: {
      count: 0,
      debits: 0,
      credits: 0
    },
    accounts: [],
    periods: [],
    branches: [],
    sources: {},
    /** Set when one account's ledger is open: it carries an opening balance the day book does not. */
    account: null,
    opening: 0,
    movements: {
      debits: 0,
      credits: 0
    },
    closing: 0,
    filters: {
      account: "",
      agent_id: null,
      period_id: null,
      from: "",
      to: "",
      source_type: "",
      side: ""
    },
    drill: null,
    tab: "journal",
    loading: true,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: {
    subtitle() {
      return this.account ? "Every posting to this account, oldest first, with the balance running down the page." : "Every posting the ledger holds, and the document that wrote it. Open a line to see the other side of the entry.";
    },
    drillSubtitle() {
      if (!this.drill) return "";
      return this.drill.document ? `${this.drill.document.label}${this.drill.document.organization ? " — " + this.drill.document.organization : ""}` : "The document is gone";
    },
    debits() {
      return this.account ? this.movements.debits : this.totals.debits;
    },
    credits() {
      return this.account ? this.movements.credits : this.totals.credits;
    }
  },
  created() {
    // Arrived from a report line: open that account's ledger for that period.
    const {
      account,
      period_id: periodId,
      agent_id: agentId
    } = this.$route.query;
    if (account) this.filters.account = account;
    if (periodId) this.filters.period_id = Number(periodId);
    if (agentId) this.filters.agent_id = Number(agentId);
    this.load();
  },
  methods: {
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
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
      const path = this.filters.account ? `/journal/accounts/${encodeURIComponent(this.filters.account)}${this.query()}` : `/journal${this.query()}`;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(path).then(({
        data
      }) => {
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
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    openAccount(code) {
      this.filters.account = code;
      this.load();
    },
    open(entry) {
      this.actionError = null;
      this.tab = "journal";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/journal/entries/${entry.id}`).then(({
        data
      }) => {
        this.drill = data;
      }).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    exportCsv() {
      this.busy = true;
      const params = this.query();
      const joiner = params ? "&" : "?";
      const account = this.filters.account ? joiner + "account=" + encodeURIComponent(this.filters.account) : "";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/journal/export" + params + account, {
        responseType: "blob"
      }).then(({
        data
      }) => {
        const url = window.URL.createObjectURL(new Blob([data], {
          type: "text/csv"
        }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "day-book.csv";
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);
      }).catch(() => {
        this.actionError = "The export could not be built.";
      }).finally(() => {
        this.busy = false;
      });
    },
    messageFor(e) {
      return e.response && e.response.data && e.response.data.error || "Something went wrong. Try again.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Journal.vue?vue&type=template&id=6490149f":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Journal.vue?vue&type=template&id=6490149f ***!
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
  }, [_vm._v(_vm._s(_vm.account ? _vm.account.account_name : "Journal"))]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitle) + "\n      "), _c("router-link", {
    attrs: {
      to: "/financials"
    }
  }, [_vm._v("Financials →")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Account")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.account,
      expression: "filters.account"
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
        _vm.$set(_vm.filters, "account", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Every account")]), _vm._v(" "), _vm._l(_vm.accounts, function (a) {
    return _c("option", {
      key: a.account_code,
      domProps: {
        value: a.account_code
      }
    }, [_vm._v("\n          " + _vm._s(a.account_code) + " — " + _vm._s(a.account_name) + "\n        ")]);
  })], 2)]), _vm._v(" "), _vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
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
  }, [_vm._v("Period")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.period_id,
      expression: "filters.period_id"
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
        _vm.$set(_vm.filters, "period_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("All periods")]), _vm._v(" "), _vm._l(_vm.periods, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v(_vm._s(p.period_name) + " (" + _vm._s(p.status) + ")")]);
  })], 2)]), _vm._v(" "), _c("label", {
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
  }, [_vm._v("Document")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.source_type,
      expression: "filters.source_type"
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
        _vm.$set(_vm.filters, "source_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Everything")]), _vm._v(" "), _vm._l(_vm.sources, function (label, key) {
    return _c("option", {
      key: key,
      domProps: {
        value: key
      }
    }, [_vm._v(_vm._s(label))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Side")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.side,
      expression: "filters.side"
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
        _vm.$set(_vm.filters, "side", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Both")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "debit"
    }
  }, [_vm._v("Debits")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "credit"
    }
  }, [_vm._v("Credits")])])]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.exportCsv
    }
  }, [_vm._v("Export")])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.entries.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing has been posted here.")]) : [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Date")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Account")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _vm.branches.length > 1 ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Debit")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Credit")]), _vm._v(" "), _vm.account ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Balance")]) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm.account ? _c("tr", {
    staticClass: "fx-row--quiet"
  }, [_c("td", {
    attrs: {
      colspan: _vm.branches.length > 1 ? 5 : 4
    }
  }, [_c("strong", [_vm._v("Opening balance")])]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.opening,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.entries, function (e) {
    return _c("tr", {
      key: "e-" + e.id,
      staticClass: "is-clickable",
      class: {
        "is-selected": _vm.drill && _vm.drill.entry.id === e.id
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.open(e);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.open(e);
        }
      }
    }, [_c("td", [_c("Figure", {
      attrs: {
        value: e.posting_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_c("span", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(e.account_code))]), _vm._v(" "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" " + _vm._s(e.account_name))])]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(e.document_no || "—")), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" " + _vm._s(e.source_label))])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(e.organization || "—"))]), _vm._v(" "), _vm.branches.length > 1 ? _c("td", [_vm._v(_vm._s(e.branch))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [Number(e.debit_amount) ? _c("Figure", {
      attrs: {
        value: e.debit_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [Number(e.credit_amount) ? _c("Figure", {
      attrs: {
        value: e.credit_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _vm.account ? _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: e.balance,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1) : _vm._e()]);
  })], 2), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    attrs: {
      colspan: _vm.branches.length > 1 ? 5 : 4
    }
  }, [_c("strong", [_vm._v(_vm._s(_vm.account ? "Movements" : _vm.totals.count + " posting(s)"))])]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.debits,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.credits,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _vm.account ? _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.closing,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]) : _vm._e()])])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm.account ? _c("span", [_vm._v("\n        Closing balance " + _vm._s(_vm.money(_vm.closing)) + ". This is the figure the trial balance carries for\n        " + _vm._s(_vm.account.account_code) + ".\n      ")]) : _vm.totals.debits === _vm.totals.credits ? _c("span", [_vm._v("Debits and credits agree.")]) : _c("span", {
    staticClass: "fx-error"
  }, [_vm._v("\n        Debits and credits do not agree — there is a one-sided entry in this selection.\n      ")])])], _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e(), _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: !!_vm.drill,
      title: _vm.drill ? _vm.drill.document ? _vm.drill.document.number : "Posting" : "",
      subtitle: _vm.drillSubtitle,
      tabs: _vm.DRILL_TABS,
      "active-tab": _vm.tab
    },
    on: {
      tab: function ($event) {
        _vm.tab = $event;
      },
      close: function ($event) {
        _vm.drill = null;
      }
    },
    scopedSlots: _vm._u([{
      key: "meta",
      fn: function () {
        return [_vm.drill ? _c("dl", {
          staticClass: "fx-defs"
        }, [_c("dt", [_vm._v("Posted")]), _vm._v(" "), _c("dd", [_c("Figure", {
          attrs: {
            value: _vm.drill.entry.posting_date,
            kind: "date"
          }
        })], 1), _vm._v(" "), _c("dt", [_vm._v("Period")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.drill.period ? _vm.drill.period.period_name : "—"))]), _vm._v(" "), _c("dt", [_vm._v("This line")]), _vm._v(" "), _c("dd", [_vm._v("\n          " + _vm._s(_vm.drill.entry.account_code) + " —\n          " + _vm._s(Number(_vm.drill.entry.debit_amount) ? "Dr " + _vm.money(_vm.drill.entry.debit_amount) : "Cr " + _vm.money(_vm.drill.entry.credit_amount)) + "\n        ")])]) : _vm._e()];
      },
      proxy: true
    }, {
      key: "footer",
      fn: function () {
        return [_vm.drill && _vm.drill.document && _vm.drill.document.type === "invoice" ? [_c("router-link", {
          staticClass: "fx-btn",
          attrs: {
            to: {
              path: "/billing",
              query: {
                open: _vm.drill.entry.source_id
              }
            }
          }
        }, [_vm._v("\n          Open it in Billing\n        ")])] : _vm._e()];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _vm.drill ? [_vm.tab === "journal" ? _c("section", {
    staticClass: "fx-section"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Account")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Debit")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Credit")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.drill.journal.lines, function (l) {
    return _c("tr", {
      key: "jl-" + l.id,
      class: {
        "is-selected": l.id === _vm.drill.entry.id
      }
    }, [_c("td", [_c("a", {
      attrs: {
        href: "#"
      },
      on: {
        click: function ($event) {
          $event.preventDefault();
          return _vm.openAccount(l.account_code);
        }
      }
    }, [_vm._v(_vm._s(l.account_code))]), _vm._v(" "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" " + _vm._s(l.account_name))])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [Number(l.debit_amount) ? _c("Figure", {
      attrs: {
        value: l.debit_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [Number(l.credit_amount) ? _c("Figure", {
      attrs: {
        value: l.credit_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1)]);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", [_c("strong", [_vm._v(_vm._s(_vm.drill.journal.balanced ? "Balanced" : "NOT BALANCED"))])]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.drill.journal.debits,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.drill.journal.credits,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)])])])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("An account opens its own ledger; the document below is what wrote all of these.")])]) : _c("section", {
    staticClass: "fx-section"
  }, [!_vm.drill.document ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("The document behind this posting no longer exists.")]) : [_c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Document")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.drill.document.number) + " "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.drill.document.document_type || _vm.drill.document.label))])]), _vm._v(" "), _c("dt", [_vm._v("Organization")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.drill.document.organization || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Shipment")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.drill.document.job_no || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Total")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.drill.document.total,
      kind: "currency",
      "currency-code": _vm.drill.document.currency || "INR"
    }
  })], 1)]), _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v(_vm._s(_vm.drill.document.type === "receipt" ? "What it settled" : "Its lines"))]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v(_vm._s(_vm.drill.document.type === "receipt" ? "Document" : "Description"))]), _vm._v(" "), _vm.drill.document.type !== "receipt" ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Qty")]) : _vm._e(), _vm._v(" "), _vm.drill.document.type !== "receipt" ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate")]) : _vm._e(), _vm._v(" "), _vm.drill.document.type !== "receipt" ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Tax")]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Net")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.drill.document.lines, function (l, i) {
    return _c("tr", {
      key: "dl-" + i
    }, [_c("td", [_vm._v("\n                  " + _vm._s(l.description) + "\n                  "), l.resolution ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("(" + _vm._s(l.resolution.replace(/_/g, " ")) + ")")]) : _vm._e()]), _vm._v(" "), _vm.drill.document.type !== "receipt" ? _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(Number(l.quantity)))]) : _vm._e(), _vm._v(" "), _vm.drill.document.type !== "receipt" ? _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.rate,
        kind: "currency",
        "currency-code": _vm.drill.document.currency || "INR"
      }
    })], 1) : _vm._e(), _vm._v(" "), _vm.drill.document.type !== "receipt" ? _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.tax_amount,
        kind: "currency",
        "currency-code": _vm.drill.document.currency || "INR"
      }
    })], 1) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.net_amount,
        kind: "currency",
        "currency-code": _vm.drill.document.currency || "INR"
      }
    })], 1)]);
  }), 0)])]], 2)] : _vm._e()], 2)], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Journal.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Journal.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Journal_vue_vue_type_template_id_6490149f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Journal.vue?vue&type=template&id=6490149f */ "./resources/js/src/view/pages/freight/Journal.vue?vue&type=template&id=6490149f");
/* harmony import */ var _Journal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Journal.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/Journal.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Journal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Journal_vue_vue_type_template_id_6490149f__WEBPACK_IMPORTED_MODULE_0__.render,
  _Journal_vue_vue_type_template_id_6490149f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/Journal.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Journal.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Journal.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Journal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Journal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Journal.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Journal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Journal.vue?vue&type=template&id=6490149f":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Journal.vue?vue&type=template&id=6490149f ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Journal_vue_vue_type_template_id_6490149f__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Journal_vue_vue_type_template_id_6490149f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Journal_vue_vue_type_template_id_6490149f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Journal.vue?vue&type=template&id=6490149f */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Journal.vue?vue&type=template&id=6490149f");


/***/ })

}]);