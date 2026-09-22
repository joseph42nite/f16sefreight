"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_MoneyIn_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_Billing_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/Billing.vue */ "./resources/js/src/view/pages/freight/Billing.vue");
/* harmony import */ var _view_pages_freight_Collections_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/Collections.vue */ "./resources/js/src/view/pages/freight/Collections.vue");





/** The filter each document stage implies — the register is one query, the stage is which slice of it. */
const STAGE_FILTERS = {
  to_bill: {
    awaiting: true,
    own_drafts: false,
    status: ""
  },
  drafts: {
    awaiting: false,
    own_drafts: true,
    status: ""
  },
  issued: {
    awaiting: false,
    own_drafts: false,
    status: ""
  },
  money_in: {
    awaiting: false,
    own_drafts: false,
    status: ""
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MoneyIn",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    Billing: _view_pages_freight_Billing_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    Collections: _view_pages_freight_Collections_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: () => ({
    stages: [],
    stage: "issued",
    branches: [],
    loading: true,
    error: null
  }),
  computed: {
    current() {
      return this.stages.find(s => s.key === this.stage) || null;
    },
    documentStage() {
      return Object.prototype.hasOwnProperty.call(STAGE_FILTERS, this.stage);
    },
    stageFilter() {
      return STAGE_FILTERS[this.stage] || null;
    }
  },
  created() {
    // Arrived from a Today card: open on the stage it counted.
    if (this.$route.query.stage) this.stage = this.$route.query.stage;
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/money-in/stages").then(({
        data
      }) => {
        this.stages = data.stages || [];
        this.branches = data.branches || [];

        // Open on the first stage that has work in it, so the page lands where the day is.
        if (!this.$route.query.stage) {
          const waiting = this.stages.find(s => s.count > 0);
          if (waiting) this.stage = waiting.key;
        }
        this.error = null;
      }).catch(e => {
        this.error = e.response && e.response.data && e.response.data.error || "Money in could not be loaded.";
      }).finally(() => {
        this.loading = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=template&id=28076f26":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=template&id=28076f26 ***!
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
  return _c("div", [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Money in")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.current ? _vm.current.note : "Bill it, collect it, chase it.") + "\n      "), _c("router-link", {
    attrs: {
      to: "/today"
    }
  }, [_vm._v("Today →")])], 1)]), _vm._v(" "), _c("nav", {
    staticClass: "fx-pipeline",
    attrs: {
      "aria-label": "Money in"
    }
  }, _vm._l(_vm.stages, function (s) {
    return _c("button", {
      key: s.key,
      staticClass: "fx-pipeline__stage",
      class: {
        "is-active": _vm.stage === s.key,
        "is-empty": !s.count,
        "is-warning": s.tone === "warning" && s.count
      },
      attrs: {
        "aria-current": _vm.stage === s.key ? "step" : null
      },
      on: {
        click: function ($event) {
          _vm.stage = s.key;
        }
      }
    }, [_c("span", {
      staticClass: "fx-pipeline__step"
    }, [_vm._v(_vm._s(s.step))]), _vm._v(" "), _c("span", {
      staticClass: "fx-pipeline__label"
    }, [_vm._v(_vm._s(s.label))]), _vm._v(" "), _c("span", {
      staticClass: "fx-pipeline__figure"
    }, [_c("Figure", {
      attrs: {
        value: s.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("span", {
      staticClass: "fx-pipeline__count"
    }, [_vm._v(_vm._s(s.count) + " " + _vm._s(s.count === 1 ? "item" : "items"))])]);
  }), 0), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.current ? _vm.current.note : ""))]), _vm._v(" "), _vm.documentStage ? _c("Billing", {
    attrs: {
      embedded: "",
      "initial-view": _vm.stage === "money_in" ? "receipts" : "all",
      "stage-filter": _vm.stageFilter
    }
  }) : _vm.stage === "overdue" ? _c("Collections", {
    key: "overdue",
    attrs: {
      embedded: ""
    }
  }) : _vm._e()]], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/MoneyIn.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MoneyIn.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MoneyIn_vue_vue_type_template_id_28076f26__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MoneyIn.vue?vue&type=template&id=28076f26 */ "./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=template&id=28076f26");
/* harmony import */ var _MoneyIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MoneyIn.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MoneyIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MoneyIn_vue_vue_type_template_id_28076f26__WEBPACK_IMPORTED_MODULE_0__.render,
  _MoneyIn_vue_vue_type_template_id_28076f26__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/MoneyIn.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MoneyIn.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyIn_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=template&id=28076f26":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=template&id=28076f26 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyIn_vue_vue_type_template_id_28076f26__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyIn_vue_vue_type_template_id_28076f26__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MoneyIn_vue_vue_type_template_id_28076f26__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MoneyIn.vue?vue&type=template&id=28076f26 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MoneyIn.vue?vue&type=template&id=28076f26");


/***/ })

}]);