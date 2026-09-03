"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_ClientsAndPartners_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/ClientsAndPartners.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_pages_freight_DirectoryTable_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/pages/freight/DirectoryTable.vue */ "./resources/js/src/view/pages/freight/DirectoryTable.vue");

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
    DirectoryTable: _view_pages_freight_DirectoryTable_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: () => ({
    TABS,
    active: "/customers"
  })
});

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
  }), 0), _vm._v(" "), _c("DirectoryTable", {
    key: _vm.active,
    attrs: {
      endpoint: _vm.active
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


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