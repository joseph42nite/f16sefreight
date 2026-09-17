"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_MailFiling_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/** Super admin: how the regex files mail and how often people change it (user, 2026-09-17). */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MailFiling",
  data: () => ({
    data: null,
    companies: [],
    periods: [7, 30, 90],
    companyId: null,
    days: 30,
    loading: false,
    error: null,
    exporting: false
  }),
  created() {
    this.load();
  },
  methods: {
    params() {
      return _objectSpread({
        days: this.days
      }, this.companyId ? {
        company_id: this.companyId
      } : {});
    },
    load() {
      this.loading = true;
      this.error = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/admin/mail-filing", {
        params: this.params()
      }).then(({
        data
      }) => {
        this.data = data;
        this.companies = data.companies;
        this.periods = data.periods;
      }).catch(() => {
        this.error = "Could not load the mail filing figures.";
      }).finally(() => {
        this.loading = false;
      });
    },
    /** Downloaded through the signed-in request — a plain link carries no sign-in and is refused. */
    exportCsv() {
      this.exporting = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/admin/classification-overrides/export", {
        params: this.params(),
        responseType: "blob"
      }).then(({
        data
      }) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(data);
        link.download = "mail-filing-changes.csv";
        link.click();
        URL.revokeObjectURL(link.href);
      }).catch(() => {
        this.error = "Could not export the changes.";
      }).finally(() => {
        this.exporting = false;
      });
    },
    label(value) {
      return value ? value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ") : "—";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=template&id=3f780ce8":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=template&id=3f780ce8 ***!
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
  return _c("div", {
    staticClass: "fx-admin"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar fx-filing__filters"
  }, [_c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "filing-company"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Company")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.companyId,
      expression: "companyId"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "filing-company"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.companyId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("All companies")]), _vm._v(" "), _vm._l(_vm.companies, function (c) {
    return _c("option", {
      key: c.id,
      domProps: {
        value: c.id
      }
    }, [_vm._v(_vm._s(c.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "filing-days"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Period")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.days,
      expression: "days",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      id: "filing-days"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return _vm._n(val);
        });
        _vm.days = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, _vm._l(_vm.periods, function (d) {
    return _c("option", {
      key: d,
      domProps: {
        value: d
      }
    }, [_vm._v("Last " + _vm._s(d) + " days")]);
  }), 0)]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.exporting
    },
    on: {
      click: _vm.exportCsv
    }
  }, [_vm._v("\n      " + _vm._s(_vm.exporting ? "Exporting…" : "Export changes (CSV)") + "\n    ")])]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm._e(), _vm._v(" "), _vm.data ? [_c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("What the regex filed")]), _vm._v(" "), !_vm.data.by_type.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No mail filed in this period.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.data.by_type, function (t) {
    return _c("tr", {
      key: t.filed_as
    }, [_c("td", [_vm._v(_vm._s(_vm.label(t.filed_as)))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(t.filed))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(t.changed))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num",
      class: {
        "fx-filing__high": t.changed_percent >= 20
      }
    }, [_vm._v(_vm._s(t.changed_percent) + "%")]), _vm._v(" "), _c("td", [_vm._l(t.changed_to, function (n, to) {
      return _c("span", {
        key: to,
        staticClass: "fx-feedback__reason"
      }, [_vm._v(_vm._s(_vm.label(to)) + ": " + _vm._s(n))]);
    }), _vm._v(" "), !t.changed ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")]) : _vm._e()], 2)]);
  }), 0)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_c("strong", [_vm._v("Missed enquiries:")]), _vm._v(" " + _vm._s(_vm.data.missed_enquiries) + " — filed as something else, changed to customer\n        enquiry by a person.\n      ")])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Senders changed most often")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("A sender domain that keeps being changed the same way is a rule waiting to be written.")]), _vm._v(" "), !_vm.data.domains.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No changes in this period.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(2), _vm._v(" "), _c("tbody", _vm._l(_vm.data.domains, function (d, i) {
    return _c("tr", {
      key: i
    }, [_c("td", [_vm._v(_vm._s(d.sender_domain || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.label(d.was)) + " → " + _vm._s(_vm.label(d.now)))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(d.n))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(d.example))])]);
  }), 0)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Recent changes")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("The words the regex read, so the pattern that should have matched can be seen.")]), _vm._v(" "), !_vm.data.recent.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No changes in this period.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(3), _vm._v(" "), _c("tbody", _vm._l(_vm.data.recent, function (r) {
    return _c("tr", {
      key: r.id
    }, [_c("td", [_vm._v(_vm._s(String(r.created_at).slice(0, 16)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.company))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.label(r.was)) + " → " + _vm._s(_vm.label(r.now)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.sender_email))]), _vm._v(" "), _c("td", {
      staticClass: "fx-filing__text"
    }, [_c("strong", [_vm._v(_vm._s(r.subject))]), _c("br"), _vm._v(_vm._s(r.snippet))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.by))])]);
  }), 0)])])] : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Mail filing")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      How the regex files incoming mail, and how often people change it — so the patterns can be improved. Counts\n      conversations started in the period.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Filed as")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mails")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Changed by a person")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Changed %")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Changed to")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Sender domain")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("From → to")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Times")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Example subject")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("When")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Company")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("From → to")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Sender")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Subject and text")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("By")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/MailFiling.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/MailFiling.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MailFiling_vue_vue_type_template_id_3f780ce8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MailFiling.vue?vue&type=template&id=3f780ce8 */ "./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=template&id=3f780ce8");
/* harmony import */ var _MailFiling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MailFiling.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MailFiling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MailFiling_vue_vue_type_template_id_3f780ce8__WEBPACK_IMPORTED_MODULE_0__.render,
  _MailFiling_vue_vue_type_template_id_3f780ce8__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/MailFiling.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MailFiling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MailFiling.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MailFiling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=template&id=3f780ce8":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=template&id=3f780ce8 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailFiling_vue_vue_type_template_id_3f780ce8__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailFiling_vue_vue_type_template_id_3f780ce8__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailFiling_vue_vue_type_template_id_3f780ce8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MailFiling.vue?vue&type=template&id=3f780ce8 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/MailFiling.vue?vue&type=template&id=3f780ce8");


/***/ })

}]);