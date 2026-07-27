"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AllCompany_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
/* harmony import */ var _core_mixins_adminList_mixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/mixins/adminList.mixin */ "./resources/js/src/core/mixins/adminList.mixin.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadminallcompany",
  mixins: [_core_mixins_adminList_mixin__WEBPACK_IMPORTED_MODULE_1__["default"]],
  data: function data() {
    return {
      fields: [{
        label: "Sl",
        key: "index"
      }, {
        label: "Name",
        key: "name"
      }, {
        label: "Action",
        key: "action"
      }]
    };
  },
  components: {
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  methods: {
    get_company: function get_company() {
      return this.loadItems("/superadmin/all-company/0");
    }
  },
  mounted: function mounted() {
    this.get_company();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=template&id=32197758":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=template&id=32197758 ***!
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
  return _c("div", {
    staticClass: "py-5"
  }, [_c("div", {
    staticClass: "admin-page-header"
  }, [_c("h2", [_vm._v("Company Registry")]), _vm._v(" "), _c("router-link", {
    staticClass: "admin-pill-btn text-white",
    attrs: {
      to: "/superadmin/new-company"
    }
  }, [_c("i", {
    staticClass: "fas fa-plus-circle"
  }), _vm._v("\n            Add Company\n        ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card"
  }, [_c("div", {
    staticClass: "admin-filter-row"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("span", {
    staticClass: "mr-3 font-weight-bold text-muted"
  }, [_vm._v("Show:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control-sm",
    staticStyle: {
      "max-width": "120px"
    },
    attrs: {
      id: "per-page-select",
      options: _vm.pageOptions
    },
    model: {
      value: _vm.perPage,
      callback: function callback($$v) {
        _vm.perPage = $$v;
      },
      expression: "perPage"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "w-md-25"
  }, [_c("b-form-input", {
    staticClass: "py-4",
    attrs: {
      id: "filter-input",
      type: "search",
      placeholder: "Search company..."
    },
    model: {
      value: _vm.filter,
      callback: function callback($$v) {
        _vm.filter = $$v;
      },
      expression: "filter"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "admin-table-wrapper"
  }, [_vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 8,
      columns: 3
    }
  }) : _c("b-table", {
    attrs: {
      responsive: "",
      stacked: "md",
      hover: "",
      items: _vm.items,
      fields: _vm.fields,
      "primary-key": "id",
      filter: _vm.filter,
      "current-page": _vm.currentPage,
      "per-page": _vm.perPage,
      "thead-class": "text-uppercase"
    },
    on: {
      filtered: _vm.onFiltered
    },
    scopedSlots: _vm._u([{
      key: "cell(index)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bold"
        }, [_vm._v("#" + _vm._s(data.index + 1))])];
      }
    }, {
      key: "cell(name)",
      fn: function fn(data) {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("div", {
          staticClass: "symbol symbol-35 symbol-light-success mr-3"
        }, [_c("span", {
          staticClass: "symbol-label font-size-h5 font-weight-bolder"
        }, [_vm._v(_vm._s(data.item.name.charAt(0).toUpperCase()))])]), _vm._v(" "), _c("span", {
          staticClass: "font-weight-bolder text-dark"
        }, [_vm._v(_vm._s(data.item.name))])])];
      }
    }, {
      key: "cell(action)",
      fn: function fn(data) {
        return [_c("router-link", {
          staticClass: "btn btn-icon btn-light-primary btn-sm",
          attrs: {
            to: "/superadmin/new-company/" + data.item["id"]
          }
        }, [_c("i", {
          staticClass: "fas fa-pen font-size-sm"
        })])];
      }
    }])
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-pagination-wrap"
  }, [_c("div", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("\n                Showing " + _vm._s(_vm.items.length ? (_vm.currentPage - 1) * _vm.perPage + 1 : 0) + " to " + _vm._s(Math.min(_vm.currentPage * _vm.perPage, _vm.totalRows)) + " of " + _vm._s(_vm.totalRows) + "\n            ")]), _vm._v(" "), _c("b-pagination", {
    staticClass: "my-0",
    attrs: {
      "total-rows": _vm.totalRows,
      "per-page": _vm.perPage,
      size: "sm"
    },
    model: {
      value: _vm.currentPage,
      callback: function callback($$v) {
        _vm.currentPage = $$v;
      },
      expression: "currentPage"
    }
  })], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllCompany.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllCompany.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AllCompany_vue_vue_type_template_id_32197758__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AllCompany.vue?vue&type=template&id=32197758 */ "./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=template&id=32197758");
/* harmony import */ var _AllCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AllCompany.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AllCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AllCompany_vue_vue_type_template_id_32197758__WEBPACK_IMPORTED_MODULE_0__.render,
  _AllCompany_vue_vue_type_template_id_32197758__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AllCompany.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllCompany.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=template&id=32197758":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=template&id=32197758 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllCompany_vue_vue_type_template_id_32197758__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllCompany_vue_vue_type_template_id_32197758__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllCompany_vue_vue_type_template_id_32197758__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllCompany.vue?vue&type=template&id=32197758 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllCompany.vue?vue&type=template&id=32197758");


/***/ })

}]);