"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_layouts_freight_AppShell_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_config_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config/navigation */ "./resources/js/src/core/config/navigation.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AppShell",
  data: () => ({
    collapsed: false
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(["designation", "tier", "portal", "tierAtLeast"])), {}, {
    nav() {
      return (0,_core_config_navigation__WEBPACK_IMPORTED_MODULE_0__.visibleNavFor)({
        designation: this.designation,
        tier: this.tier,
        portalKey: this.portal ? this.portal.key : null,
        tierAtLeast: this.tierAtLeast
      });
    },
    portalGlyph() {
      return {
        air: "✈",
        sea: "⚓",
        road: "🚚"
      }[this.portal && this.portal.scope] || "●";
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772 ***!
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
  return _c("div", {
    staticClass: "fx-shell",
    attrs: {
      "data-portal": _vm.portal && _vm.portal.key
    }
  }, [_c("a", {
    staticClass: "skip-to-content",
    attrs: {
      href: "#fx-main"
    }
  }, [_vm._v("Skip to content")]), _vm._v(" "), _c("aside", {
    staticClass: "fx-rail",
    class: {
      "is-collapsed": _vm.collapsed
    }
  }, [_c("div", {
    staticClass: "fx-rail__brand"
  }, [_c("span", {
    staticClass: "fx-rail__mark"
  }, [_vm._v("F16s")]), _vm._v(" "), _c("button", {
    staticClass: "fx-rail__toggle",
    attrs: {
      "aria-expanded": String(!_vm.collapsed),
      "aria-label": "Toggle navigation"
    },
    on: {
      click: function ($event) {
        _vm.collapsed = !_vm.collapsed;
      }
    }
  }, [_vm._v("‹")])]), _vm._v(" "), _c("nav", {
    staticClass: "fx-rail__nav",
    attrs: {
      "aria-label": "Main"
    }
  }, _vm._l(_vm.nav, function (item) {
    return _c("router-link", {
      key: item.path,
      staticClass: "fx-rail__item",
      class: {
        "is-locked": item.locked
      },
      attrs: {
        to: item.locked ? "/upgrade?from=" + encodeURIComponent(item.path) : item.path
      }
    }, [_c("span", {
      staticClass: "fx-rail__label"
    }, [_vm._v(_vm._s(item.label))]), _vm._v(" "), item.locked ? _c("span", {
      staticClass: "fx-rail__lock",
      attrs: {
        "aria-label": "Requires an upgrade"
      }
    }, [_vm._v("🔒")]) : _vm._e()]);
  }), 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-body"
  }, [_c("header", {
    staticClass: "fx-header"
  }, [_vm.portal ? _c("span", {
    staticClass: "fx-portal-chip"
  }, [_vm._v("\n        " + _vm._s(_vm.portalGlyph) + " " + _vm._s(_vm.portal.label) + "\n      ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-header__spacer"
  }), _vm._v(" "), _c("span", {
    staticClass: "fx-header__who"
  }, [_vm._v("\n        " + _vm._s(_vm.designation)), _vm.tier ? [_vm._v(" · " + _vm._s(_vm.tier))] : _vm._e()], 2)]), _vm._v(" "), _c("main", {
    staticClass: "fx-main",
    attrs: {
      id: "fx-main"
    }
  }, [_c("router-view")], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AppShell.vue?vue&type=template&id=4754a772 */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772");
/* harmony import */ var _AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AppShell.vue?vue&type=script&lang=js */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js");
/* harmony import */ var _AppShell_vue_vue_type_style_index_0_id_4754a772_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.render,
  _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layouts/freight/AppShell.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772 ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=template&id=4754a772 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772");


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_style_index_0_id_4754a772_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css");


/***/ })

}]);