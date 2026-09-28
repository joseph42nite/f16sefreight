"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_SuggestionFeedback_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");


/** The suggestion types, as the Sales page names them. */
const LABELS = {
  client_reactivation: "Stopped shipping",
  client_volume_drop: "Volume down",
  client_volume_growth: "Volume up",
  client_rate_review: "Lost on price",
  client_new_lanes: "New lanes to offer"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SuggestionFeedback",
  data: () => ({
    data: null,
    loading: true,
    error: null
  }),
  created() {
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/suggestion-feedback").then(({
      data
    }) => {
      this.data = data;
    }).catch(e => {
      const d = e.response && e.response.data || {};
      this.error = d.error || d.message || "Could not load the feedback.";
    }).finally(() => {
      this.loading = false;
    });
  },
  methods: {
    label(type) {
      return LABELS[type] || type;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Suggestion feedback")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      How sales reps answered the client emails the product suggested, across every customer, over the last\n      " + _vm._s(_vm.data ? _vm.data.days : 90) + " days — what they sent, what they dismissed and why. Use it to improve the suggestions.\n    ")])]), _vm._v(" "), _vm.error ? _c("p", {
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
  }, [_vm._v("By suggestion")]), _vm._v(" "), !_vm.data.by_type.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No suggestion has been sent or dismissed yet.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.data.by_type, function (t) {
    return _c("tr", {
      key: t.type
    }, [_c("td", [_vm._v(_vm._s(_vm.label(t.type)))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(t.sent))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(t.dismissed))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(t.dismissed_percent === null ? "—" : t.dismissed_percent + "%"))]), _vm._v(" "), _c("td", _vm._l(_vm.data.reasons_by_type[t.type] || {}, function (n, reason) {
      return _c("span", {
        key: reason,
        staticClass: "fx-feedback__reason"
      }, [_vm._v("\n                " + _vm._s(_vm.data.reasons[reason] || reason) + ": " + _vm._s(n) + "\n              ")]);
    }), 0)]);
  }), 0)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Recent dismissals")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("The figures each suggestion was built from. Client names are not shown.")]), _vm._v(" "), !_vm.data.recent.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("None yet.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.data.recent, function (r) {
    return _c("tr", {
      key: r.id
    }, [_c("td", [_vm._v(_vm._s(String(r.dismissed_at).slice(0, 10)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.company) + " "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("· " + _vm._s(r.tier) + " · " + _vm._s(r.mode))])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.label(r.type)))]), _vm._v(" "), _c("td", {
      staticClass: "fx-feedback__facts"
    }, _vm._l(r.facts, function (v, k) {
      return _c("span", {
        key: k
      }, [_vm._v(_vm._s(String(k).replace(/_/g, " ")) + ": " + _vm._s(Array.isArray(v) ? v.join(", ") : v))]);
    }), 0), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.data.reasons[r.reason] || r.reason)), r.note ? [_vm._v(" — " + _vm._s(r.note))] : _vm._e()], 2)]);
  }), 0)])])] : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Suggestion")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Sent")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Dismissed")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Dismissed %")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Why dismissed")])])]);
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
  }, [_vm._v("Customer")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Suggestion")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Figures")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Why")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuggestionFeedback.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SuggestionFeedback_vue_vue_type_template_id_752ab236_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true */ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true");
/* harmony import */ var _SuggestionFeedback_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SuggestionFeedback.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=script&lang=js");
/* harmony import */ var _SuggestionFeedback_vue_vue_type_style_index_0_id_752ab236_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SuggestionFeedback_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SuggestionFeedback_vue_vue_type_template_id_752ab236_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _SuggestionFeedback_vue_vue_type_template_id_752ab236_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "752ab236",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/SuggestionFeedback.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SuggestionFeedback_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SuggestionFeedback.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SuggestionFeedback_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuggestionFeedback_vue_vue_type_template_id_752ab236_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuggestionFeedback_vue_vue_type_template_id_752ab236_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuggestionFeedback_vue_vue_type_template_id_752ab236_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=template&id=752ab236&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuggestionFeedback_vue_vue_type_style_index_0_id_752ab236_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuggestionFeedback.vue?vue&type=style&index=0&id=752ab236&scoped=true&lang=css");


/***/ })

}]);