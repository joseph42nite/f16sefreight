"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AirlineDirectory_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
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

const EMPTY = {
  name: "",
  prefix: "",
  code: "",
  country: "",
  domain: "",
  airline_address: "",
  is_active: true
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AirlineDirectory",
  data: () => ({
    rows: [],
    q: "",
    loading: true,
    saving: false,
    error: null,
    editing: null,
    form: _objectSpread({}, EMPTY)
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      this.error = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/airlines?q=" + encodeURIComponent(this.q)).then(({
        data
      }) => {
        this.rows = data.data || [];
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    startNew() {
      this.editing = "new";
      this.form = _objectSpread({}, EMPTY);
    },
    startEdit(row) {
      this.editing = row.id;
      this.form = _objectSpread(_objectSpread({}, EMPTY), row);
    },
    save() {
      this.saving = true;
      this.error = null;
      const isNew = this.editing === "new";
      const call = isNew ? _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/airlines", this.form) : _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put("/superadmin/airlines/" + this.editing, this.form);
      call.then(() => {
        this.editing = null;
        this.load();
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.saving = false;
      });
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      if (d.errors) return Object.values(d.errors).flat().join(" ");
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=template&id=4dcd11ea":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=template&id=4dcd11ea ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "container-fluid py-4"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center mb-3",
    staticStyle: {
      gap: ".5rem"
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.q,
      expression: "q"
    }],
    staticClass: "form-control",
    staticStyle: {
      "max-width": "20rem"
    },
    attrs: {
      placeholder: "Name, prefix, code or domain"
    },
    domProps: {
      value: _vm.q
    },
    on: {
      keyup: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.load.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.q = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "btn btn-outline-secondary",
    on: {
      click: _vm.load
    }
  }, [_vm._v("Search")]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-primary ml-auto",
    on: {
      click: _vm.startNew
    }
  }, [_vm._v("Add airline")])]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "alert alert-danger"
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _vm.editing ? _c("div", {
    staticClass: "card mb-3"
  }, [_c("div", {
    staticClass: "card-body"
  }, [_c("div", {
    staticClass: "form-row"
  }, [_c("div", {
    staticClass: "col-md-2 mb-2"
  }, [_c("label", {
    staticClass: "small text-muted mb-1"
  }, [_vm._v("Prefix")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.prefix,
      expression: "form.prefix"
    }],
    staticClass: "form-control",
    attrs: {
      maxlength: "3",
      placeholder: "176"
    },
    domProps: {
      value: _vm.form.prefix
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "prefix", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 mb-2"
  }, [_c("label", {
    staticClass: "small text-muted mb-1"
  }, [_vm._v("Code")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.code,
      expression: "form.code"
    }],
    staticClass: "form-control",
    attrs: {
      maxlength: "5",
      placeholder: "EK"
    },
    domProps: {
      value: _vm.form.code
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "code", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-md-4 mb-2"
  }, [_c("label", {
    staticClass: "small text-muted mb-1"
  }, [_vm._v("Name")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.name,
      expression: "form.name"
    }],
    staticClass: "form-control",
    attrs: {
      placeholder: "Emirates SkyCargo"
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
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-md-4 mb-2"
  }, [_c("label", {
    staticClass: "small text-muted mb-1"
  }, [_vm._v("Email domain")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.domain,
      expression: "form.domain"
    }],
    staticClass: "form-control",
    attrs: {
      placeholder: "lhcargo.test"
    },
    domProps: {
      value: _vm.form.domain
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "domain", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "form-row"
  }, [_c("div", {
    staticClass: "col-md-3 mb-2"
  }, [_c("label", {
    staticClass: "small text-muted mb-1"
  }, [_vm._v("Country")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.country,
      expression: "form.country"
    }],
    staticClass: "form-control",
    domProps: {
      value: _vm.form.country
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "country", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "col-md-9 mb-2"
  }, [_c("label", {
    staticClass: "small text-muted mb-1"
  }, [_vm._v("Address (printed on the waybill)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.airline_address,
      expression: "form.airline_address"
    }],
    staticClass: "form-control",
    domProps: {
      value: _vm.form.airline_address
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "airline_address", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-primary",
    attrs: {
      disabled: _vm.saving
    },
    on: {
      click: _vm.save
    }
  }, [_vm._v("\n        " + _vm._s(_vm.saving ? "Saving…" : "Save") + "\n      ")]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-link",
    on: {
      click: function ($event) {
        _vm.editing = null;
      }
    }
  }, [_vm._v("Cancel")])])]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "text-muted"
  }, [_vm._v("Loading…")]) : !_vm.rows.length ? _c("p", {
    staticClass: "text-muted"
  }, [_vm._v("\n    No airlines yet. Add the carriers you deal with — prefix and name are enough to start;\n    the domain can follow.\n  ")]) : _c("table", {
    staticClass: "table table-sm align-middle"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: row.id
    }, [_c("td", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(row.prefix))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.code || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.name))]), _vm._v(" "), _c("td", [row.domain ? _c("span", [_vm._v(_vm._s(row.domain))]) : _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v("no domain — classifies nothing")])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(row.country || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "text-right"
    }, [_c("button", {
      staticClass: "btn btn-sm btn-outline-secondary",
      on: {
        click: function ($event) {
          return _vm.startEdit(row);
        }
      }
    }, [_vm._v("Edit")])])]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "mb-3"
  }, [_c("h1", {
    staticClass: "h4 mb-1"
  }, [_vm._v("Airlines")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted mb-0"
  }, [_vm._v("\n      Prefix, name and email domain, curated here for every tenant. An operator picks a\n      carrier from this list instead of typing a prefix from memory — and the domain is\n      what classifies that airline's mail across the platform.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Prefix")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Code")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Name")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Email domain")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Country")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_c("span", {
    staticClass: "sr-only"
  }, [_vm._v("Actions")])])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/AirlineDirectory.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AirlineDirectory.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AirlineDirectory_vue_vue_type_template_id_4dcd11ea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AirlineDirectory.vue?vue&type=template&id=4dcd11ea */ "./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=template&id=4dcd11ea");
/* harmony import */ var _AirlineDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AirlineDirectory.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AirlineDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AirlineDirectory_vue_vue_type_template_id_4dcd11ea__WEBPACK_IMPORTED_MODULE_0__.render,
  _AirlineDirectory_vue_vue_type_template_id_4dcd11ea__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AirlineDirectory.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AirlineDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AirlineDirectory.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AirlineDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=template&id=4dcd11ea":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=template&id=4dcd11ea ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AirlineDirectory_vue_vue_type_template_id_4dcd11ea__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AirlineDirectory_vue_vue_type_template_id_4dcd11ea__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AirlineDirectory_vue_vue_type_template_id_4dcd11ea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AirlineDirectory.vue?vue&type=template&id=4dcd11ea */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AirlineDirectory.vue?vue&type=template&id=4dcd11ea");


/***/ })

}]);