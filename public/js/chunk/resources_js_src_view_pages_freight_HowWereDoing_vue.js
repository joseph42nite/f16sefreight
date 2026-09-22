"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_HowWereDoing_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_pages_freight_Profitability_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/pages/freight/Profitability.vue */ "./resources/js/src/view/pages/freight/Profitability.vue");
/* harmony import */ var _view_pages_freight_Journal_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/Journal.vue */ "./resources/js/src/view/pages/freight/Journal.vue");


const VIEWS = [{
  key: "jobs",
  label: "By shipment"
}, {
  key: "clients",
  label: "By client"
}, {
  key: "lanes",
  label: "By lane"
}, {
  key: "journal",
  label: "The journal"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HowWereDoing",
  components: {
    Profitability: _view_pages_freight_Profitability_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    Journal: _view_pages_freight_Journal_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    VIEWS,
    view: "jobs"
  }),
  computed: {
    subtitle() {
      return {
        jobs: "What each shipment billed, what it cost, and what that left. Net of tax on both sides.",
        clients: "Which clients are worth the work — and which are busy rather than profitable.",
        lanes: "Which routes earn their keep. This is the number to buy against.",
        journal: "Every posting the ledger holds. Open a line to see the other side, and the document behind it."
      }[this.view];
    }
  },
  created() {
    if (this.$route.query.view) this.view = this.$route.query.view;
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=template&id=6f70634e":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=template&id=6f70634e ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("How we're doing")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitle) + "\n      "), _c("router-link", {
    attrs: {
      to: "/close-month"
    }
  }, [_vm._v("The statements →")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar fx-financials__views"
  }, _vm._l(_vm.VIEWS, function (v) {
    return _c("button", {
      key: v.key,
      staticClass: "fx-btn",
      class: {
        "fx-btn--primary": _vm.view === v.key
      },
      on: {
        click: function ($event) {
          _vm.view = v.key;
        }
      }
    }, [_vm._v(_vm._s(v.label))]);
  }), 0), _vm._v(" "), _vm.view !== "journal" ? _c("Profitability", {
    attrs: {
      embedded: "",
      "initial-view": _vm.view
    }
  }) : _c("Journal", {
    key: "journal",
    attrs: {
      embedded: ""
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/HowWereDoing.vue":
/*!**************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/HowWereDoing.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HowWereDoing_vue_vue_type_template_id_6f70634e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HowWereDoing.vue?vue&type=template&id=6f70634e */ "./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=template&id=6f70634e");
/* harmony import */ var _HowWereDoing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HowWereDoing.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HowWereDoing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HowWereDoing_vue_vue_type_template_id_6f70634e__WEBPACK_IMPORTED_MODULE_0__.render,
  _HowWereDoing_vue_vue_type_template_id_6f70634e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/HowWereDoing.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HowWereDoing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HowWereDoing.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HowWereDoing_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=template&id=6f70634e":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=template&id=6f70634e ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HowWereDoing_vue_vue_type_template_id_6f70634e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HowWereDoing_vue_vue_type_template_id_6f70634e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HowWereDoing_vue_vue_type_template_id_6f70634e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HowWereDoing.vue?vue&type=template&id=6f70634e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/HowWereDoing.vue?vue&type=template&id=6f70634e");


/***/ })

}]);