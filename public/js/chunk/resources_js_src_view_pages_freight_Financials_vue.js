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
    selected: null,
    tab: "credit",
    credit: null,
    creditLoading: false,
    preview: null,
    previewLoading: false,
    busy: false,
    actionError: null,
    STATUSES,
    TABS
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
      return this.selected.customer ? this.selected.customer.name : "Partner-billed";
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
    load() {
      this.loading = true;
      const params = [];
      if (this.status) params.push("status=" + encodeURIComponent(this.status));
      if (this.outstanding) params.push("outstanding=1");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/invoices" + (params.length ? "?" + params.join("&") : "")).then(({
        data
      }) => {
        this.rows = data.data || [];
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
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
      this.commit(`/invoices/${this.selected.id}/post`);
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
  return _c("div", [_vm._m(0), _vm._v(" "), _c("div", {
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
  }), _vm._v("\n      Outstanding only\n    ")])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No documents match.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
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
    }, [_c("td", {
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
        value: row.grand_total,
        kind: "currency",
        "currency-code": row.currency || "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
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
    })], 1)]);
  }), 0)]), _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: !!_vm.selected,
      title: _vm.selected ? _vm.selected.invoice_no || "Draft invoice" : "",
      subtitle: _vm.drawerSubtitle,
      tabs: _vm.TABS,
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
        }, [_vm._v("Close")]), _vm._v(" "), _vm.canPost && _vm.selected ? [_vm.selected.status === "draft" ? _c("button", {
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
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm._e()], 2)], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Financials")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      The receivables register for this branch. Select a row to see the client's credit\n      standing and the journal a posting would write.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
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
  }, [_vm._v("Total")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Paid")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Balance")])])]);
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