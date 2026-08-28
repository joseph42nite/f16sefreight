"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_JobBoard_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "JobBoard",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    rows: [],
    loading: true,
    error: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["portalLabel"])), {}, {
    /* Mirrors App\Enums\JobStatus. 'Lost' is deliberately absent — it is an enquiry
       state, never a job one. */
    columns: () => ["Intake", "AI Extraction", "Verification", "Generation", "PDF Generated", "Sent to Airline", "Airline Confirmed", "Completed", "Cancelled"],
    grouped() {
      return this.rows.reduce((acc, job) => {
        (acc[job.status] = acc[job.status] || []).push(job);
        return acc;
      }, {});
    }
  }),
  created() {
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/jobs").then(({
      data
    }) => {
      this.rows = data.data || [];
    }).catch(e => {
      const d = e.response && e.response.data || {};
      this.error = d.error || d.message || "Something went wrong.";
    }).finally(() => {
      this.loading = false;
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=template&id=97be6a1e":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=template&id=97be6a1e ***!
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
  return _c("div", [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Kanban")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      Confirmed shipments on "), _c("strong", [_vm._v(_vm._s(_vm.portalLabel || "all modes"))]), _vm._v(".\n    ")])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _c("div", {
    staticClass: "fx-board"
  }, _vm._l(_vm.columns, function (col) {
    return _c("section", {
      key: col,
      staticClass: "fx-board__col"
    }, [_c("h2", {
      staticClass: "fx-board__head"
    }, [_vm._v("\n        " + _vm._s(col) + "\n        "), _c("span", {
      staticClass: "fx-board__count"
    }, [_vm._v(_vm._s(_vm.grouped[col] ? _vm.grouped[col].length : 0))])]), _vm._v(" "), _vm._l(_vm.grouped[col] || [], function (job) {
      return _c("article", {
        key: job.id,
        staticClass: "fx-card"
      }, [_c("div", {
        staticClass: "identifier fx-card__no"
      }, [_vm._v(_vm._s(job.execution_job_no || "—"))]), _vm._v(" "), _c("div", {
        staticClass: "fx-card__meta"
      }, [job.planned_clearance_date ? _c("span", {
        staticClass: "numeric"
      }, [_vm._v("\n            clears "), _c("Figure", {
        attrs: {
          value: job.planned_clearance_date,
          kind: "date"
        }
      })], 1) : _c("span", {
        staticClass: "is-empty",
        attrs: {
          "aria-label": "No clearance date"
        }
      })])]);
    }), _vm._v(" "), !(_vm.grouped[col] || []).length ? _c("p", {
      staticClass: "fx-muted fx-board__empty"
    }, [_vm._v("—")]) : _vm._e()], 2);
  }), 0)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/JobBoard.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/JobBoard.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _JobBoard_vue_vue_type_template_id_97be6a1e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JobBoard.vue?vue&type=template&id=97be6a1e */ "./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=template&id=97be6a1e");
/* harmony import */ var _JobBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JobBoard.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _JobBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _JobBoard_vue_vue_type_template_id_97be6a1e__WEBPACK_IMPORTED_MODULE_0__.render,
  _JobBoard_vue_vue_type_template_id_97be6a1e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/JobBoard.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JobBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobBoard.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JobBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=template&id=97be6a1e":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=template&id=97be6a1e ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobBoard_vue_vue_type_template_id_97be6a1e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobBoard_vue_vue_type_template_id_97be6a1e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobBoard_vue_vue_type_template_id_97be6a1e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobBoard.vue?vue&type=template&id=97be6a1e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobBoard.vue?vue&type=template&id=97be6a1e");


/***/ })

}]);