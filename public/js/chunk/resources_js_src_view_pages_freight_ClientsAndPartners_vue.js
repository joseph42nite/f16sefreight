"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_ClientsAndPartners_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Clients.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Clients.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
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





const TABS = [{
  key: "details",
  label: "Details"
}, {
  key: "group",
  label: "Their other entities"
}, {
  key: "contacts",
  label: "Addresses"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Clients",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: () => ({
    TABS,
    rows: [],
    total: 0,
    withAccounts: false,
    options: {
      branches: [],
      salespeople: []
    },
    filters: {
      branch_id: null,
      sales_id: null,
      q: "",
      unassigned: false,
      no_limit: false
    },
    grouped: false,
    selected: null,
    tab: "details",
    group: [],
    contacts: [],
    form: null,
    ports: [],
    portQuery: "",
    loading: true,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_4__.mapGetters)(["designation"])), {}, {
    canEdit() {
      return ["accounts", "boss", "sales", "pricing"].includes(this.designation);
    },
    /** Grouped by the domain, or one flat list under a single empty heading. */
    groups() {
      if (!this.grouped) return [{
        key: "all",
        rows: this.rows
      }];
      const byDomain = {};
      this.rows.forEach(row => {
        const key = row.email_domain || "No domain on file";
        byDomain[key] ??= {
          key,
          rows: [],
          owed: 0
        };
        byDomain[key].rows.push(row);
        byDomain[key].owed += Number(row.exposure || 0);
      });
      return Object.values(byDomain).sort((a, b) => a.key.localeCompare(b.key));
    },
    /** A rep of the chosen branch, or all of them when no branch is set. */
    salesForBranch() {
      if (!this.form || !this.form.branch_id) return this.options.salespeople;
      const own = this.options.salespeople.filter(s => s.branch_id === this.form.branch_id);
      return own.length ? own : this.options.salespeople;
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
    query() {
      const params = [];
      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== false) params.push(key + "=" + encodeURIComponent(value));
      });
      params.push("per_page=200");
      return "?" + params.join("&");
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/customers" + this.query()).then(({
        data
      }) => {
        this.rows = data.data || [];
        this.total = data.total || this.rows.length;
        this.withAccounts = !!data.with_accounts;
        this.options = data.options || this.options;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    open(customer) {
      this.selected = customer;
      this.tab = "details";
      this.actionError = null;
      this.group = [];
      this.contacts = [];
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/customers/${customer.id}/group`).then(({
        data
      }) => {
        this.group = (data.members || data.group || []).filter(g => g.id !== customer.id);
      }).catch(() => {});
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/customers/${customer.id}/contacts`).then(({
        data
      }) => {
        this.contacts = data.contacts || [];
      }).catch(() => {});
    },
    openForm(customer = null) {
      this.actionError = null;
      this.ports = [];
      this.portQuery = "";
      this.form = customer ? _objectSpread({}, customer) : {
        id: null,
        name: "",
        email_domain: "",
        email: "",
        phone: "",
        address: "",
        branch_id: this.options.branches.length === 1 ? this.options.branches[0].id : null,
        sales_id: null,
        default_port_id: null,
        gst_no: "",
        pan_no: "",
        duns_no: "",
        payment_terms_days: 30,
        credit_limit: null,
        bank_name: "",
        bank_account_no: "",
        bank_ifsc_code: ""
      };
    },
    searchPorts() {
      if (this.portQuery.trim().length < 2) {
        this.ports = [];
        return;
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/customers/ports?q=" + encodeURIComponent(this.portQuery)).then(({
        data
      }) => {
        this.ports = data.ports || [];
      }).catch(() => {});
    },
    save() {
      this.busy = true;
      this.actionError = null;
      const body = _objectSpread({}, this.form);
      // Blank boxes are "not set", not empty strings — the columns are nullable and a "" GSTIN is not a GSTIN.
      Object.keys(body).forEach(key => {
        if (body[key] === "") body[key] = null;
      });
      const call = this.form.id ? _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put(`/customers/${this.form.id}`, body) : _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/customers", body);
      call.then(() => {
        this.form = null;
        this.selected = null;
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    /* The server's own words — including a 422's field errors, which carry `errors`, never `error`. */
    messageFor(e) {
      const response = e.response;
      const data = response && response.data;
      if (data && data.error) return data.error;
      if (data && data.errors) {
        const first = Object.values(data.errors)[0];
        return Array.isArray(first) ? first[0] : String(first);
      }
      if (data && data.message) return data.message;
      return response ? `The server refused that (${response.status}).` : "Could not reach the server. Check your connection and try again.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_pages_freight_Clients_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/pages/freight/Clients.vue */ "./resources/js/src/view/pages/freight/Clients.vue");
/* harmony import */ var _view_pages_freight_DirectoryTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/DirectoryTable.vue */ "./resources/js/src/view/pages/freight/DirectoryTable.vue");


const TABS = [{
  key: "/customers",
  label: "Clients"
}, {
  key: "/partners",
  label: "Partners"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ClientsAndPartners",
  components: {
    Clients: _view_pages_freight_Clients_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    DirectoryTable: _view_pages_freight_DirectoryTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    TABS,
    active: "/customers"
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Clients.vue?vue&type=template&id=5c9d1af0":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Clients.vue?vue&type=template&id=5c9d1af0 ***!
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
  return _c("div", [_c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.options.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.branch_id,
      expression: "filters.branch_id"
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
        _vm.$set(_vm.filters, "branch_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Every branch")]), _vm._v(" "), _vm._l(_vm.options.branches, function (b) {
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
  }, [_vm._v("Salesperson")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.sales_id,
      expression: "filters.sales_id"
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
        _vm.$set(_vm.filters, "sales_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Anyone")]), _vm._v(" "), _vm._l(_vm.options.salespeople, function (s) {
    return _c("option", {
      key: s.id,
      domProps: {
        value: s.id
      }
    }, [_vm._v(_vm._s(s.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Search")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.q,
      expression: "filters.q"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "name, domain or GSTIN"
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
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.unassigned,
      expression: "filters.unassigned"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.filters.unassigned) ? _vm._i(_vm.filters.unassigned, null) > -1 : _vm.filters.unassigned
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.filters.unassigned,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.filters, "unassigned", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.filters, "unassigned", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.filters, "unassigned", $$c);
        }
      }, _vm.load]
    }
  }), _vm._v("\n      No salesperson\n    ")]), _vm._v(" "), _vm.withAccounts ? _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.no_limit,
      expression: "filters.no_limit"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.filters.no_limit) ? _vm._i(_vm.filters.no_limit, null) > -1 : _vm.filters.no_limit
    },
    on: {
      change: [function ($event) {
        var $$a = _vm.filters.no_limit,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.filters, "no_limit", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.filters, "no_limit", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.filters, "no_limit", $$c);
        }
      }, _vm.load]
    }
  }), _vm._v("\n      No credit limit\n    ")]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.grouped,
      expression: "grouped"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.grouped) ? _vm._i(_vm.grouped, null) > -1 : _vm.grouped
    },
    on: {
      change: function ($event) {
        var $$a = _vm.grouped,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.grouped = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.grouped = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.grouped = $$c;
        }
      }
    }
  }), _vm._v("\n      Group by client\n    ")]), _vm._v(" "), _vm.canEdit ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: function ($event) {
        return _vm.openForm();
      }
    }
  }, [_vm._v("Onboard a client")]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No client matches.")]) : [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
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
  }, [_vm._v("Salesperson")]), _vm._v(" "), _vm.withAccounts ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("GSTIN")]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Terms")]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Credit limit")]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Owed now")]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Left")]) : _vm._e(), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Contacts")])])]), _vm._v(" "), _vm._l(_vm.groups, function (group) {
    return _c("tbody", {
      key: group.key
    }, [_vm.grouped ? _c("tr", {
      staticClass: "fx-row--quiet"
    }, [_c("td", {
      attrs: {
        colspan: _vm.withAccounts ? 9 : 5
      }
    }, [_c("strong", [_vm._v(_vm._s(group.key))]), _vm._v(" "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" · " + _vm._s(group.rows.length) + " billing entit" + _vm._s(group.rows.length === 1 ? "y" : "ies"))]), _vm._v(" "), _vm.withAccounts ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" · owed " + _vm._s(_vm.money(group.owed)))]) : _vm._e()])]) : _vm._e(), _vm._v(" "), _vm._l(group.rows, function (c) {
      return _c("tr", {
        key: "c-" + c.id,
        staticClass: "is-clickable",
        class: {
          "is-selected": _vm.selected && _vm.selected.id === c.id
        },
        attrs: {
          tabindex: "0"
        },
        on: {
          click: function ($event) {
            return _vm.open(c);
          },
          keydown: function ($event) {
            if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
            return _vm.open(c);
          }
        }
      }, [_c("td", [_vm._v("\n            " + _vm._s(c.name) + "\n            "), !_vm.grouped && c.email_domain ? _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v(" · " + _vm._s(c.email_domain))]) : _vm._e()]), _vm._v(" "), _c("td", [c.branch ? _c("span", [_vm._v(_vm._s(c.branch))]) : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("Not set")])]), _vm._v(" "), _c("td", [c.salesperson ? _c("span", [_vm._v(_vm._s(c.salesperson))]) : _c("span", {
        staticClass: "fx-error"
      }, [_vm._v("Nobody")])]), _vm._v(" "), _vm.withAccounts ? _c("td", {
        staticClass: "identifier"
      }, [_vm._v(_vm._s(c.gst_no || "—"))]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("td", {
        staticClass: "fx-num"
      }, [_vm._v(_vm._s(c.payment_terms_days) + "d")]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("td", {
        staticClass: "fx-num"
      }, [c.credit_limit !== null ? _c("Figure", {
        attrs: {
          value: c.credit_limit,
          kind: "currency",
          "currency-code": "INR"
        }
      }) : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("Not set")])], 1) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("td", {
        staticClass: "fx-num"
      }, [_c("Figure", {
        attrs: {
          value: c.exposure,
          kind: "currency",
          "currency-code": "INR"
        }
      })], 1) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("td", {
        staticClass: "fx-num"
      }, [c.available !== null ? [c.on_hold ? _c("StatusChip", {
        attrs: {
          value: "credit_hold"
        }
      }) : _c("Figure", {
        attrs: {
          value: c.available,
          kind: "currency",
          "currency-code": "INR"
        }
      })] : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("—")])], 2) : _vm._e(), _vm._v(" "), _c("td", {
        staticClass: "fx-muted"
      }, [_vm._v(_vm._s(c.contacts_count))])]);
    })], 2);
  })], 2), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      " + _vm._s(_vm.total) + " client(s) across " + _vm._s(_vm.options.branches.length) + " branch(es).\n      "), _vm.withAccounts ? _c("span", [_vm._v(" Owed now is what they still owe on billed documents, credit notes deducted.")]) : _vm._e()])], _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: !!_vm.selected,
      title: _vm.selected ? _vm.selected.name : "",
      subtitle: _vm.selected ? _vm.selected.email_domain || "No domain on file" : "",
      tabs: _vm.TABS,
      "active-tab": _vm.tab
    },
    on: {
      tab: function ($event) {
        _vm.tab = $event;
      },
      close: function ($event) {
        _vm.selected = null;
      }
    },
    scopedSlots: _vm._u([{
      key: "meta",
      fn: function () {
        return [_vm.selected ? _c("dl", {
          staticClass: "fx-defs"
        }, [_c("dt", [_vm._v("Branch")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.selected.branch || "Not set"))]), _vm._v(" "), _c("dt", [_vm._v("Salesperson")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.selected.salesperson || "Nobody"))]), _vm._v(" "), _vm.withAccounts ? [_c("dt", [_vm._v("Credit limit")]), _vm._v(" "), _c("dd", [_vm.selected.credit_limit !== null ? _c("Figure", {
          attrs: {
            value: _vm.selected.credit_limit,
            kind: "currency",
            "currency-code": "INR"
          }
        }) : _c("span", {
          staticClass: "fx-muted"
        }, [_vm._v("Not configured")])], 1), _vm._v(" "), _c("dt", [_vm._v("Owed now")]), _vm._v(" "), _c("dd", [_c("Figure", {
          attrs: {
            value: _vm.selected.exposure,
            kind: "currency",
            "currency-code": "INR"
          }
        }), _vm._v(" "), _vm.selected.on_hold ? _c("StatusChip", {
          attrs: {
            value: "credit_hold"
          }
        }) : _vm._e()], 1)] : _vm._e()], 2) : _vm._e()];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _vm.selected ? [_vm.tab === "details" ? _c("section", {
    staticClass: "fx-section"
  }, [_c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Email")]), _c("dd", [_vm._v(_vm._s(_vm.selected.email || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Phone")]), _c("dd", [_vm._v(_vm._s(_vm.selected.phone || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Address")]), _c("dd", [_vm._v(_vm._s(_vm.selected.address || "—"))]), _vm._v(" "), _vm.withAccounts ? [_c("dt", [_vm._v("GSTIN")]), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.selected.gst_no || "—"))]), _vm._v(" "), _c("dt", [_vm._v("PAN")]), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.selected.pan_no || "—"))]), _vm._v(" "), _c("dt", [_vm._v("DUNS")]), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.selected.duns_no || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Payment terms")]), _c("dd", [_vm._v(_vm._s(_vm.selected.payment_terms_days) + " days")]), _vm._v(" "), _c("dt", [_vm._v("Bank")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.selected.bank_name || "—") + " "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("(account details are stored encrypted and not shown)")])])] : _vm._e()], 2), _vm._v(" "), _vm.canEdit ? _c("button", {
    staticClass: "fx-btn",
    on: {
      click: function ($event) {
        return _vm.openForm(_vm.selected);
      }
    }
  }, [_vm._v("Edit")]) : _vm._e()]) : _vm.tab === "group" ? _c("section", {
    staticClass: "fx-section"
  }, [!_vm.group.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          " + _vm._s(_vm.selected.email_domain ? "This is the only billing entity on that domain." : "No domain on file, so there is no group.") + "\n        ")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Billing entity")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Salesperson")]), _vm._v(" "), _vm.withAccounts ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("GSTIN")]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Owed now")]) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.group, function (g) {
    return _c("tr", {
      key: "g-" + g.id,
      staticClass: "is-clickable",
      on: {
        click: function ($event) {
          return _vm.open(g);
        }
      }
    }, [_c("td", [_vm._v(_vm._s(g.name))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(g.branch || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(g.salesperson || "Nobody"))]), _vm._v(" "), _vm.withAccounts ? _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(g.gst_no || "—"))]) : _vm._e(), _vm._v(" "), _vm.withAccounts ? _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: g.exposure,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1) : _vm._e()]);
  }), 0)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Indian GST is registered state by state, so one company legitimately bills as several entities. They are\n          one client because they share a domain — nothing links them but that.\n        ")])]) : _c("section", {
    staticClass: "fx-section"
  }, [!_vm.contacts.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No address saved yet. They are harvested from inbound mail.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Address")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Name")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mails")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Last seen")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.contacts, function (ct) {
    return _c("tr", {
      key: "ct-" + ct.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(ct.email))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(ct.name || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(ct.message_count))]), _vm._v(" "), _c("td", [ct.last_seen_at ? _c("Figure", {
      attrs: {
        value: ct.last_seen_at,
        kind: "date"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1)]);
  }), 0)])]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm._e()], 2), _vm._v(" "), _vm.form ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "onboard-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "onboard-title"
    }
  }, [_vm._v(_vm._s(_vm.form.id ? "Edit " + _vm.form.name : "Onboard a client"))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Who they are")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Billing name *")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.name,
      expression: "form.name"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "Globex Exports (Chennai)"
    },
    domProps: {
      value: _vm.form.name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "name", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Email domain")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.email_domain,
      expression: "form.email_domain"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "globex.com"
    },
    domProps: {
      value: _vm.form.email_domain
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "email_domain", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Email")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.email,
      expression: "form.email"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.email
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "email", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Phone")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.phone,
      expression: "form.phone"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.phone
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "phone", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Registered address")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.address,
      expression: "form.address"
    }],
    staticClass: "fx-input",
    attrs: {
      rows: "2"
    },
    domProps: {
      value: _vm.form.address
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "address", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Mail from this domain is matched to them automatically, and every address they write from is saved.\n        ")]), _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Who owns them")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Our branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.branch_id,
      expression: "form.branch_id"
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
        _vm.$set(_vm.form, "branch_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Not set")]), _vm._v(" "), _vm._l(_vm.options.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Salesperson")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.sales_id,
      expression: "form.sales_id"
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
        _vm.$set(_vm.form, "sales_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Nobody yet")]), _vm._v(" "), _vm._l(_vm.salesForBranch, function (s) {
    return _c("option", {
      key: s.id,
      domProps: {
        value: s.id
      }
    }, [_vm._v(_vm._s(s.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Their usual port")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.portQuery,
      expression: "portQuery"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "INMAA or Chennai"
    },
    domProps: {
      value: _vm.portQuery
    },
    on: {
      input: [function ($event) {
        if ($event.target.composing) return;
        _vm.portQuery = $event.target.value;
      }, _vm.searchPorts]
    }
  }), _vm._v(" "), _vm.ports.length ? _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.default_port_id,
      expression: "form.default_port_id"
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
        _vm.$set(_vm.form, "default_port_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Not set")]), _vm._v(" "), _vm._l(_vm.ports, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v("\n                " + _vm._s(p.locode) + " — " + _vm._s(p.port_name) + " (" + _vm._s(p.port_type) + ")\n              ")]);
  })], 2) : _vm._e()])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          The salesperson is how this client appears in a rep's book — a client with nobody on it is in nobody's.\n        ")]), _vm._v(" "), _vm.withAccounts ? [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Tax and legal")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("GSTIN")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.gst_no,
      expression: "form.gst_no"
    }],
    staticClass: "fx-input",
    attrs: {
      maxlength: "30",
      placeholder: "33AAACG1001A1Z5"
    },
    domProps: {
      value: _vm.form.gst_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "gst_no", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("PAN")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.pan_no,
      expression: "form.pan_no"
    }],
    staticClass: "fx-input",
    attrs: {
      maxlength: "20"
    },
    domProps: {
      value: _vm.form.pan_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "pan_no", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("DUNS")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.duns_no,
      expression: "form.duns_no"
    }],
    staticClass: "fx-input",
    attrs: {
      maxlength: "20"
    },
    domProps: {
      value: _vm.form.duns_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "duns_no", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n            A client with no GSTIN is billed B2C and never goes to the invoice registration portal.\n          ")]), _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Terms and credit")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Payment terms (days)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.form.payment_terms_days,
      expression: "form.payment_terms_days",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input fx-num",
    attrs: {
      type: "number",
      min: "0",
      max: "365"
    },
    domProps: {
      value: _vm.form.payment_terms_days
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "payment_terms_days", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Credit limit")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.form.credit_limit,
      expression: "form.credit_limit",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input fx-num",
    attrs: {
      type: "number",
      step: "0.01",
      min: "0",
      placeholder: "leave empty for no limit"
    },
    domProps: {
      value: _vm.form.credit_limit
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "credit_limit", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })])]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Their bank")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Bank")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.bank_name,
      expression: "form.bank_name"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.bank_name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "bank_name", $event.target.value);
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
      value: _vm.form.bank_account_no,
      expression: "form.bank_account_no"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.bank_account_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "bank_account_no", $event.target.value);
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
      value: _vm.form.bank_ifsc_code,
      expression: "form.bank_ifsc_code"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.bank_ifsc_code
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "bank_ifsc_code", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Stored encrypted and never shown again — re-enter to change them.")])] : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
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
        _vm.form = null;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.form.name.trim()
    },
    on: {
      click: _vm.save
    }
  }, [_vm._v("\n          " + _vm._s(_vm.busy ? "Saving…" : _vm.form.id ? "Save" : "Onboard them") + "\n        ")])])])]) : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n            🔴 An empty limit means "), _c("strong", [_vm._v("no limit configured")]), _vm._v(" and never blocks. A limit of\n            "), _c("strong", [_vm._v("0")]), _vm._v(" blocks every shipment. The terms set the due date on every invoice, which is what\n            the ageing counts from.\n          ")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=template&id=bcd1e47c":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=template&id=bcd1e47c ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("nav", {
    staticClass: "fx-tabs",
    attrs: {
      role: "tablist",
      "aria-label": "Directory"
    }
  }, _vm._l(_vm.TABS, function (t) {
    return _c("button", {
      key: t.key,
      staticClass: "fx-tabs__tab",
      class: {
        "is-active": _vm.active === t.key
      },
      attrs: {
        role: "tab",
        "aria-selected": String(_vm.active === t.key)
      },
      on: {
        click: function ($event) {
          _vm.active = t.key;
        }
      }
    }, [_vm._v(_vm._s(t.label))]);
  }), 0), _vm._v(" "), _vm.active === "/customers" ? _c("Clients") : _c("DirectoryTable", {
    key: _vm.active,
    attrs: {
      endpoint: _vm.active
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Clients.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Clients.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Clients_vue_vue_type_template_id_5c9d1af0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Clients.vue?vue&type=template&id=5c9d1af0 */ "./resources/js/src/view/pages/freight/Clients.vue?vue&type=template&id=5c9d1af0");
/* harmony import */ var _Clients_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Clients.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/Clients.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Clients_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Clients_vue_vue_type_template_id_5c9d1af0__WEBPACK_IMPORTED_MODULE_0__.render,
  _Clients_vue_vue_type_template_id_5c9d1af0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/Clients.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/ClientsAndPartners.vue":
/*!********************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/ClientsAndPartners.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ClientsAndPartners_vue_vue_type_template_id_bcd1e47c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientsAndPartners.vue?vue&type=template&id=bcd1e47c */ "./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=template&id=bcd1e47c");
/* harmony import */ var _ClientsAndPartners_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ClientsAndPartners.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ClientsAndPartners_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ClientsAndPartners_vue_vue_type_template_id_bcd1e47c__WEBPACK_IMPORTED_MODULE_0__.render,
  _ClientsAndPartners_vue_vue_type_template_id_bcd1e47c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/ClientsAndPartners.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Clients.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Clients.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Clients_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Clients.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Clients.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Clients_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientsAndPartners_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientsAndPartners.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientsAndPartners_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Clients.vue?vue&type=template&id=5c9d1af0":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Clients.vue?vue&type=template&id=5c9d1af0 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Clients_vue_vue_type_template_id_5c9d1af0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Clients_vue_vue_type_template_id_5c9d1af0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Clients_vue_vue_type_template_id_5c9d1af0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Clients.vue?vue&type=template&id=5c9d1af0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Clients.vue?vue&type=template&id=5c9d1af0");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=template&id=bcd1e47c":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=template&id=bcd1e47c ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientsAndPartners_vue_vue_type_template_id_bcd1e47c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientsAndPartners_vue_vue_type_template_id_bcd1e47c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientsAndPartners_vue_vue_type_template_id_bcd1e47c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientsAndPartners.vue?vue&type=template&id=bcd1e47c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=template&id=bcd1e47c");


/***/ })

}]);