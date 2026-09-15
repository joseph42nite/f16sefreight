"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_PortalSignIn_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/store/auth.module */ "./resources/js/src/core/services/store/auth.module.js");
/* harmony import */ var _core_config_portalHosts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/config/portalHosts */ "./resources/js/src/core/config/portalHosts.js");



/** Server error codes, in words (the same set the website's sign-in box shows). */
const MESSAGES = {
  Unauthorized: "Invalid email or password.",
  Blocked: "Account blocked. Contact your admin.",
  Daily_Limit: "Daily sign-in limit exceeded.",
  Expired: "Plan expired. Please renew."
};

/**
 * A portal's own sign-in page (user, 2026-09-15): focusair.<domain> and the rest open here, with nothing
 * from the company website — that lives on the main domain, linked below.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "PortalSignIn",
  data: () => ({
    portal: (0,_core_config_portalHosts__WEBPACK_IMPORTED_MODULE_1__.portalFromHost)(window.location.hostname),
    email: "",
    password: "",
    showPassword: false,
    busy: false,
    error: null,
    switching: false
  }),
  computed: {
    portalLabel() {
      if (this.portal === "superadmin") return "Platform Admin";
      const known = _core_config_portalHosts__WEBPACK_IMPORTED_MODULE_1__.SIGN_IN_PORTALS.find(p => p.key === this.portal);
      return known ? known.label : "F16s";
    },
    otherPortals() {
      return _core_config_portalHosts__WEBPACK_IMPORTED_MODULE_1__.SIGN_IN_PORTALS.filter(p => p.key !== this.portal);
    }
  },
  created() {
    document.title = this.portalLabel + " · Sign in";
  },
  methods: {
    signIn() {
      this.busy = true;
      this.error = null;

      // The LOGIN action takes the user to their landing page.
      this.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__.LOGIN, {
        email: this.email,
        password: this.password
      }).catch(() => {
        const code = this.$store.state.auth.errors;
        this.error = MESSAGES[code] || (typeof code === "string" ? code : "Could not sign in.");
      }).finally(() => {
        this.busy = false;
      });
    },
    signInUrl(key) {
      return (0,_core_config_portalHosts__WEBPACK_IMPORTED_MODULE_1__.portalSignInUrl)(key, window.location);
    },
    siteUrl(path) {
      return (0,_core_config_portalHosts__WEBPACK_IMPORTED_MODULE_1__.mainSiteUrl)(window.location, path);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("main", {
    staticClass: "fx-signin"
  }, [_c("section", {
    staticClass: "fx-signin__card",
    attrs: {
      "aria-labelledby": "fx-signin-title"
    }
  }, [_c("p", {
    staticClass: "fx-signin__brand"
  }, [_vm._v("F16s")]), _vm._v(" "), _c("h1", {
    staticClass: "fx-signin__title",
    attrs: {
      id: "fx-signin-title"
    }
  }, [_vm._v(_vm._s(_vm.portalLabel))]), _vm._v(" "), _c("p", {
    staticClass: "fx-signin__sub"
  }, [_vm._v("Sign in to continue")]), _vm._v(" "), _c("form", {
    staticClass: "fx-signin__form",
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.signIn.apply(null, arguments);
      }
    }
  }, [_vm.error ? _c("p", {
    staticClass: "fx-signin__error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-signin__field"
  }, [_c("span", [_vm._v("Email")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: _vm.email,
      expression: "email",
      modifiers: {
        trim: true
      }
    }],
    attrs: {
      type: "email",
      autocomplete: "username",
      required: ""
    },
    domProps: {
      value: _vm.email
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.email = $event.target.value.trim();
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-signin__field"
  }, [_c("span", [_vm._v("Password")]), _vm._v(" "), (_vm.showPassword ? "text" : "password") === "checkbox" ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.password,
      expression: "password"
    }],
    attrs: {
      autocomplete: "current-password",
      required: "",
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.password) ? _vm._i(_vm.password, null) > -1 : _vm.password
    },
    on: {
      change: function ($event) {
        var $$a = _vm.password,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.password = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.password = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.password = $$c;
        }
      }
    }
  }) : (_vm.showPassword ? "text" : "password") === "radio" ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.password,
      expression: "password"
    }],
    attrs: {
      autocomplete: "current-password",
      required: "",
      type: "radio"
    },
    domProps: {
      checked: _vm._q(_vm.password, null)
    },
    on: {
      change: function ($event) {
        _vm.password = null;
      }
    }
  }) : _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.password,
      expression: "password"
    }],
    attrs: {
      autocomplete: "current-password",
      required: "",
      type: _vm.showPassword ? "text" : "password"
    },
    domProps: {
      value: _vm.password
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.password = $event.target.value;
      }
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "fx-signin__link fx-signin__show",
    attrs: {
      type: "button"
    },
    on: {
      click: function ($event) {
        _vm.showPassword = !_vm.showPassword;
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.showPassword ? "Hide password" : "Show password") + "\n      ")]), _vm._v(" "), _c("button", {
    staticClass: "fx-signin__submit",
    attrs: {
      type: "submit",
      disabled: _vm.busy
    }
  }, [_vm._v(_vm._s(_vm.busy ? "Signing in…" : "Sign in"))])]), _vm._v(" "), _vm.portal !== "superadmin" ? _c("div", {
    staticClass: "fx-signin__switch"
  }, [_c("button", {
    staticClass: "fx-signin__link",
    attrs: {
      type: "button",
      "aria-expanded": String(_vm.switching)
    },
    on: {
      click: function ($event) {
        _vm.switching = !_vm.switching;
      }
    }
  }, [_vm._v("\n        Not " + _vm._s(_vm.portalLabel) + "? Switch portal\n      ")]), _vm._v(" "), _vm.switching ? _c("ul", {
    staticClass: "fx-signin__portals"
  }, _vm._l(_vm.otherPortals, function (p) {
    return _c("li", {
      key: p.key
    }, [_c("a", {
      attrs: {
        href: _vm.signInUrl(p.key)
      }
    }, [_vm._v(_vm._s(p.label) + " "), _c("span", [_vm._v(_vm._s(p.note))])])]);
  }), 0) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("p", {
    staticClass: "fx-signin__foot"
  }, [_c("a", {
    attrs: {
      href: _vm.siteUrl("/contact-us")
    }
  }, [_vm._v("Forgot password?")]), _vm._v(" "), _c("a", {
    attrs: {
      href: _vm.siteUrl("/")
    }
  }, [_vm._v("About F16s")])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/public/PortalSignIn.vue":
/*!*************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PortalSignIn.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PortalSignIn_vue_vue_type_template_id_0219db28_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true */ "./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true");
/* harmony import */ var _PortalSignIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PortalSignIn.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=script&lang=js");
/* harmony import */ var _PortalSignIn_vue_vue_type_style_index_0_id_0219db28_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css */ "./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _PortalSignIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _PortalSignIn_vue_vue_type_template_id_0219db28_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _PortalSignIn_vue_vue_type_template_id_0219db28_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0219db28",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/PortalSignIn.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PortalSignIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PortalSignIn.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PortalSignIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PortalSignIn_vue_vue_type_template_id_0219db28_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PortalSignIn_vue_vue_type_template_id_0219db28_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PortalSignIn_vue_vue_type_template_id_0219db28_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=template&id=0219db28&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PortalSignIn_vue_vue_type_style_index_0_id_0219db28_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PortalSignIn.vue?vue&type=style&index=0&id=0219db28&scoped=true&lang=css");


/***/ })

}]);