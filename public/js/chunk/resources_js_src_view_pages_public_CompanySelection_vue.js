"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_CompanySelection_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "CompanySelection",
  data: function data() {
    return {
      companies: [],
      selectedCompany: null,
      activePortal: 'air',
      // Default to air
      loading: false,
      errorMsg: null
    };
  },
  computed: {
    companiesOptions: function companiesOptions() {
      var opts = [{
        value: null,
        text: "-- Choose Registered Company --",
        disabled: true
      }];
      this.companies.forEach(function (company) {
        opts.push({
          value: company.id,
          text: company.name
        });
      });
      return opts;
    },
    isSubdomainRestricted: function isSubdomainRestricted() {
      var hostname = window.location.hostname;
      return hostname.startsWith('focusair.') || hostname.startsWith('focussea.');
    }
  },
  mounted: function mounted() {
    this.fetchCompanies();
    // Subdomain-based portal scope detection
    var hostname = window.location.hostname;
    if (hostname.startsWith('focusair.')) {
      this.activePortal = 'air';
    } else if (hostname.startsWith('focussea.')) {
      this.activePortal = 'sea';
    } else {
      var savedPortal = sessionStorage.getItem('active_portal_scope');
      if (savedPortal) {
        this.activePortal = savedPortal;
      }
    }
    // Load existing selections from sessionStorage if present
    var savedCompany = sessionStorage.getItem('company_id');
    if (savedCompany) {
      this.selectedCompany = parseInt(savedCompany, 10);
    }
  },
  methods: {
    fetchCompanies: function fetchCompanies() {
      var _this = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/companies").then(function (_ref) {
        var data = _ref.data;
        _this.companies = data;
      })["catch"](function (err) {
        console.error("Failed to load companies:", err);
        _this.errorMsg = "Unable to load tenant companies. Please reload page.";
      });
    },
    setPortal: function setPortal(mode) {
      if (this.isSubdomainRestricted) {
        return;
      }
      this.activePortal = mode;
    },
    proceedToLogin: function proceedToLogin() {
      var _this2 = this;
      if (!this.selectedCompany) {
        this.errorMsg = "Please select a registered company first.";
        return;
      }
      this.loading = true;
      this.errorMsg = null;

      // 1. Send context selection to backend to bind in PHP Session
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/set-session-context", {
        company_id: this.selectedCompany,
        active_portal_scope: this.activePortal
      }).then(function () {
        // 2. Set sessionStorage context for frontend persistence
        try {
          sessionStorage.setItem('company_id', _this2.selectedCompany.toString());
          sessionStorage.setItem('active_portal_scope', _this2.activePortal);
        } catch (e) {
          console.error("Session storage write failed:", e);
        }

        // 3. Redirect to landing page and auto-trigger login popup
        _this2.$router.push({
          path: "/",
          query: {
            trigger_login: "true"
          }
        });
      })["catch"](function (err) {
        console.error("Session context configuration failed:", err);
        _this2.errorMsg = "Failed to synchronize session context with server. Try again.";
      })["finally"](function () {
        _this2.loading = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "company-selection-page d-flex align-items-center justify-content-center"
  }, [_vm._m(0), _vm._v(" "), _c("b-container", {
    staticClass: "selection-card-container"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      md: "8",
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 p-md-8 text-center animate-fade-in"
  }, [_c("div", {
    staticClass: "brand-logo mb-6"
  }, [_c("img", {
    staticClass: "logo-image",
    attrs: {
      src: "/media/assets/logos/white-logo.png",
      alt: "F16s Logo"
    }
  })]), _vm._v(" "), _c("h2", {
    staticClass: "welcome-title mb-2"
  }, [_vm._v("Select Your Workspace")]), _vm._v(" "), _c("p", {
    staticClass: "subtitle mb-6"
  }, [_vm._v("Configure your active portal scope and company context")]), _vm._v(" "), _vm.errorMsg ? _c("div", {
    staticClass: "error-banner mb-4 animate-shake"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n            " + _vm._s(_vm.errorMsg) + "\n          ")], 1) : _vm._e(), _vm._v(" "), _c("b-form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.proceedToLogin.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "premium-form-group mb-6 text-left"
  }, [_c("label", {
    staticClass: "premium-label"
  }, [_vm._v("Registered Company")]), _vm._v(" "), _c("div", {
    staticClass: "select-wrapper"
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.companiesOptions,
      required: ""
    },
    model: {
      value: _vm.selectedCompany,
      callback: function callback($$v) {
        _vm.selectedCompany = $$v;
      },
      expression: "selectedCompany"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "premium-form-group mb-8 text-left"
  }, [_c("label", {
    staticClass: "premium-label"
  }, [_vm._v("Select Logistics Portal")]), _vm._v(" "), _c("div", {
    staticClass: "portal-cards-grid"
  }, [_c("div", {
    staticClass: "portal-card",
    "class": {
      active: _vm.activePortal === "air",
      disabled: _vm.isSubdomainRestricted && _vm.activePortal !== "air"
    },
    on: {
      click: function click($event) {
        return _vm.setPortal("air");
      }
    }
  }, [_c("div", {
    staticClass: "portal-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "portal-card-content"
  }, [_c("div", {
    staticClass: "icon-wrapper air-icon"
  }, [_c("b-icon", {
    staticStyle: {
      transform: "rotate(45deg)"
    },
    attrs: {
      icon: "cursor-fill",
      "font-scale": "1.5"
    }
  })], 1), _vm._v(" "), _c("span", {
    staticClass: "portal-name"
  }, [_vm._v("Focus Air")]), _vm._v(" "), _c("span", {
    staticClass: "portal-desc"
  }, [_vm._v("Air waybills & flight schedules")])])]), _vm._v(" "), _c("div", {
    staticClass: "portal-card",
    "class": {
      active: _vm.activePortal === "sea",
      disabled: _vm.isSubdomainRestricted && _vm.activePortal !== "sea"
    },
    on: {
      click: function click($event) {
        return _vm.setPortal("sea");
      }
    }
  }, [_c("div", {
    staticClass: "portal-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "portal-card-content"
  }, [_c("div", {
    staticClass: "icon-wrapper sea-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "compass",
      "font-scale": "1.5"
    }
  })], 1), _vm._v(" "), _c("span", {
    staticClass: "portal-name"
  }, [_vm._v("Focus Sea")]), _vm._v(" "), _c("span", {
    staticClass: "portal-desc"
  }, [_vm._v("Ocean manifests & container stuffing")])])])])]), _vm._v(" "), _c("button", {
    staticClass: "premium-btn btn-lg w-100",
    attrs: {
      type: "submit",
      disabled: _vm.loading
    }
  }, [_vm.loading ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Configuring...")], 1) : _c("span", [_vm._v("Proceed to Workspace "), _c("b-icon", {
    staticClass: "ml-2",
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])])], 1)])], 1)], 1)], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "glow-container"
  }, [_c("div", {
    staticClass: "glow-orb orb-1"
  }), _vm._v(" "), _c("div", {
    staticClass: "glow-orb orb-2"
  })]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/public/CompanySelection.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/src/view/pages/public/CompanySelection.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CompanySelection_vue_vue_type_template_id_0ab413e9_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true */ "./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true");
/* harmony import */ var _CompanySelection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CompanySelection.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=script&lang=js");
/* harmony import */ var _CompanySelection_vue_vue_type_style_index_0_id_0ab413e9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css */ "./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CompanySelection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CompanySelection_vue_vue_type_template_id_0ab413e9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _CompanySelection_vue_vue_type_template_id_0ab413e9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0ab413e9",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/CompanySelection.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=script&lang=js":
/*!*****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CompanySelection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CompanySelection.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CompanySelection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CompanySelection_vue_vue_type_template_id_0ab413e9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CompanySelection_vue_vue_type_template_id_0ab413e9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CompanySelection_vue_vue_type_template_id_0ab413e9_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=template&id=0ab413e9&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css":
/*!*************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CompanySelection_vue_vue_type_style_index_0_id_0ab413e9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/CompanySelection.vue?vue&type=style&index=0&id=0ab413e9&scoped=true&lang=css");


/***/ })

}]);