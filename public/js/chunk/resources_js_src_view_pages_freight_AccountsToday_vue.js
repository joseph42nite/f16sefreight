"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_AccountsToday_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AccountsToday",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    cards: [],
    exceptions: [],
    branches: [],
    agentId: null,
    asOf: "",
    loading: true,
    error: null
  }),
  computed: {
    /** What the day amounts to, in one line, before any of the numbers are read. */
    greeting() {
      if (this.loading || this.error) return "The accounts desk.";
      const work = this.cards.filter(c => c.count > 0).length;
      const decisions = this.exceptions.length;
      if (!work && !decisions) return "Nothing is waiting. The desk is clear.";

      // Written out rather than "thing(s)": this is the first line the desk reads every morning.
      const things = work === 1 ? "1 thing to work through" : `${work} things to work through`;
      if (!decisions) return `${things}.`;
      return `${things}, and ${decisions === 1 ? "1 that needs" : decisions + " that need"} a decision.`;
    }
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/accounts/today" + (this.agentId ? "?agent_id=" + this.agentId : "")).then(({
        data
      }) => {
        this.cards = data.cards || [];
        this.exceptions = data.exceptions || [];
        this.branches = data.branches || [];
        this.asOf = data.as_of;
        this.error = null;
      }).catch(e => {
        this.error = e.response && e.response.data && e.response.data.error || "Today could not be loaded.";
      }).finally(() => {
        this.loading = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v("Today")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v(_vm._s(_vm.greeting))])]), _vm._v(" "), _vm.branches.length > 1 ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.agentId,
      expression: "agentId"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.agentId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Every branch")]), _vm._v(" "), _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  })], 2)])]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("div", {
    staticClass: "fx-tiles fx-today__cards"
  }, _vm._l(_vm.cards, function (card) {
    return _c("router-link", {
      key: card.key,
      staticClass: "fx-tile is-clickable",
      class: {
        "fx-tile--warning": card.tone === "warning" && card.count
      },
      attrs: {
        to: card.to
      }
    }, [_c("span", {
      staticClass: "fx-tile__label"
    }, [_vm._v(_vm._s(card.label))]), _vm._v(" "), _c("span", {
      staticClass: "fx-tile__value"
    }, [_c("Figure", {
      attrs: {
        value: card.amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("p", {
      staticClass: "fx-muted fx-tile__detail"
    }, [_vm._v("\n          " + _vm._s(card.count) + " " + _vm._s(card.unit) + _vm._s(card.count === 1 ? "" : "s") + " · " + _vm._s(card.note) + "\n        ")])]);
  }), 1), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Needs a decision")]), _vm._v(" "), !_vm.exceptions.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        Nothing is waiting on you. The period is open, nobody is over their limit, and every supplier statement\n        agrees.\n      ")]) : _c("ul", {
    staticClass: "fx-list"
  }, _vm._l(_vm.exceptions, function (e, i) {
    return _c("li", {
      key: "x-" + i,
      staticClass: "fx-list__item"
    }, [_c("StatusChip", {
      attrs: {
        value: e.tone === "critical" ? "blocking" : "check_this"
      }
    }), _vm._v(" "), _c("router-link", {
      attrs: {
        to: e.to
      }
    }, [_vm._v(_vm._s(e.text))])], 1);
  }), 0)])]], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/freight/AccountsToday.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/AccountsToday.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AccountsToday_vue_vue_type_template_id_20314b3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true */ "./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true");
/* harmony import */ var _AccountsToday_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AccountsToday.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=script&lang=js");
/* harmony import */ var _AccountsToday_vue_vue_type_style_index_0_id_20314b3a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css */ "./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AccountsToday_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AccountsToday_vue_vue_type_template_id_20314b3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _AccountsToday_vue_vue_type_template_id_20314b3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "20314b3a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/AccountsToday.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountsToday_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AccountsToday.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountsToday_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountsToday_vue_vue_type_template_id_20314b3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountsToday_vue_vue_type_template_id_20314b3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountsToday_vue_vue_type_template_id_20314b3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=template&id=20314b3a&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css":
/*!***********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AccountsToday_vue_vue_type_style_index_0_id_20314b3a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/AccountsToday.vue?vue&type=style&index=0&id=20314b3a&scoped=true&lang=css");


/***/ })

}]);