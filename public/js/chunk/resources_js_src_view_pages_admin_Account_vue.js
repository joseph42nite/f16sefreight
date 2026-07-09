"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_Account_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Account.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Account.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/store/auth.module */ "./resources/js/src/core/services/store/auth.module.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      user_form: new Form({
        name: "",
        email: ""
      }),
      password_form: new Form({
        password: "",
        password_confirmation: ""
      }),
      isSavingProfile: false,
      profileSaved: false,
      isUpdatingPass: false
    };
  },
  methods: {
    onSubmit: function onSubmit() {
      var _this = this;
      this.isSavingProfile = true;
      this.profileSaved = false;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put("/superadmin/upadte-detail", this.user_form).then(function (_ref) {
        var data = _ref.data;
        _this.profileSaved = true;
        setTimeout(function () {
          _this.profileSaved = false;
        }, 4000);
      })["finally"](function () {
        _this.isSavingProfile = false;
      });
    },
    submitPassword: function submitPassword() {
      var _this2 = this;
      this.isUpdatingPass = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put("/superadmin/update-password", this.password_form).then(function (_ref2) {
        var data = _ref2.data;
        _this2.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_1__.LOGOUT).then(function () {
          return _this2.$router.push('/login');
        });
      })["catch"](function (err) {
        alert("Password update failed. Please try again.");
      })["finally"](function () {
        _this2.isUpdatingPass = false;
      });
    }
  },
  mounted: function mounted() {
    this.user_form.name = this.current_user.name;
    this.user_form.email = this.current_user.email;
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)({
    current_user: 'currentUser'
  }))
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Account.vue?vue&type=template&id=4bb3d1a1":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Account.vue?vue&type=template&id=4bb3d1a1 ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "py-5"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-xl-6 mb-7 mb-xl-0"
  }, [_c("div", {
    staticClass: "admin-glass-card h-100"
  }, [_vm._m(1), _vm._v(" "), _c("b-form", {
    staticClass: "fw-700",
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.onSubmit.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Full Name")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "text",
      required: "",
      placeholder: "Your Name"
    },
    model: {
      value: _vm.user_form.name,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "name", $$v);
      },
      expression: "user_form.name"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Email Address")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "bg-light text-muted",
    attrs: {
      type: "email",
      readonly: ""
    },
    model: {
      value: _vm.user_form.email,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "email", $$v);
      },
      expression: "user_form.email"
    }
  }), _vm._v(" "), _c("small", {
    staticClass: "form-text text-muted"
  }, [_vm._v("Identifier cannot be changed by self.")])], 1), _vm._v(" "), _c("div", {
    staticClass: "mt-8"
  }, [_c("button", {
    staticClass: "admin-pill-btn",
    attrs: {
      type: "submit",
      disabled: _vm.isSavingProfile
    }
  }, [_vm.isSavingProfile ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Updating...")], 1) : _c("span", [_c("i", {
    staticClass: "fas fa-save mr-2"
  }), _vm._v("Save Personal Data")])])]), _vm._v(" "), _vm.profileSaved ? _c("div", {
    staticClass: "alert alert-custom alert-light-success mt-4 mb-0 py-3"
  }, [_c("div", {
    staticClass: "alert-text font-weight-bold text-center"
  }, [_c("i", {
    staticClass: "fas fa-check-circle text-success mr-2"
  }), _vm._v(" Saved Successfully")])]) : _vm._e()])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-xl-6"
  }, [_c("div", {
    staticClass: "admin-glass-card h-100"
  }, [_vm._m(2), _vm._v(" "), _c("b-form", {
    staticClass: "fw-700",
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.submitPassword.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("New Password")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "password",
      required: "",
      placeholder: "Enter min 6 chars"
    },
    model: {
      value: _vm.password_form.password,
      callback: function callback($$v) {
        _vm.$set(_vm.password_form, "password", $$v);
      },
      expression: "password_form.password"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Confirm Password")]), _vm._v(" "), _c("b-form-input", {
    attrs: {
      type: "password",
      required: "",
      placeholder: "Match above entry"
    },
    model: {
      value: _vm.password_form.password_confirmation,
      callback: function callback($$v) {
        _vm.$set(_vm.password_form, "password_confirmation", $$v);
      },
      expression: "password_form.password_confirmation"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "mt-8"
  }, [_c("button", {
    staticClass: "admin-pill-btn btn-danger",
    staticStyle: {
      background: "#F1416C !important",
      "border-color": "#F1416C !important",
      "box-shadow": "0 4px 10px rgba(241, 65, 108, 0.15) !important"
    },
    attrs: {
      type: "submit",
      disabled: _vm.isUpdatingPass
    }
  }, [_vm.isUpdatingPass ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Encrypting...")], 1) : _c("span", [_c("i", {
    staticClass: "fas fa-key mr-2"
  }), _vm._v("Update Password")])])])])], 1)])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "admin-page-header mb-7"
  }, [_c("h2", [_vm._v("Account Settings")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "d-flex align-items-center mb-8"
  }, [_c("div", {
    staticClass: "symbol symbol-50 symbol-light-primary mr-4"
  }, [_c("span", {
    staticClass: "symbol-label font-size-h3 font-weight-boldest"
  }, [_c("i", {
    staticClass: "far fa-id-card text-primary"
  })])]), _vm._v(" "), _c("div", [_c("h4", {
    staticClass: "font-weight-boldest text-dark mb-0"
  }, [_vm._v("Personal Profile")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("Manage identity preferences")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "d-flex align-items-center mb-8"
  }, [_c("div", {
    staticClass: "symbol symbol-50 symbol-light-danger mr-4"
  }, [_c("span", {
    staticClass: "symbol-label font-size-h3 font-weight-boldest"
  }, [_c("i", {
    staticClass: "fas fa-shield-alt text-danger"
  })])]), _vm._v(" "), _c("div", [_c("h4", {
    staticClass: "font-weight-boldest text-dark mb-0"
  }, [_vm._v("Security Settings")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("Refresh your secure access credentials")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/Account.vue":
/*!*******************************************************!*\
  !*** ./resources/js/src/view/pages/admin/Account.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Account_vue_vue_type_template_id_4bb3d1a1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Account.vue?vue&type=template&id=4bb3d1a1 */ "./resources/js/src/view/pages/admin/Account.vue?vue&type=template&id=4bb3d1a1");
/* harmony import */ var _Account_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Account.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/Account.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Account_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Account_vue_vue_type_template_id_4bb3d1a1__WEBPACK_IMPORTED_MODULE_0__.render,
  _Account_vue_vue_type_template_id_4bb3d1a1__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/Account.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/Account.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/Account.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Account.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Account.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/Account.vue?vue&type=template&id=4bb3d1a1":
/*!*************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/Account.vue?vue&type=template&id=4bb3d1a1 ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_template_id_4bb3d1a1__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_template_id_4bb3d1a1__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Account_vue_vue_type_template_id_4bb3d1a1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Account.vue?vue&type=template&id=4bb3d1a1 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Account.vue?vue&type=template&id=4bb3d1a1");


/***/ })

}]);