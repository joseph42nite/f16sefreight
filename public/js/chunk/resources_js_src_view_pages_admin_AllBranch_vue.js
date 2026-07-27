"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AllBranch_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
/* harmony import */ var _core_mixins_adminList_mixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/mixins/adminList.mixin */ "./resources/js/src/core/mixins/adminList.mixin.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadminallbranch",
  mixins: [_core_mixins_adminList_mixin__WEBPACK_IMPORTED_MODULE_1__["default"]],
  data: function data() {
    return {
      fields: [{
        label: "Sl",
        key: "index"
      }, {
        label: "Company",
        key: "company_name.name"
      }, {
        label: "Agent Name",
        key: "agent_name"
      }, {
        label: "Agent code",
        key: "iata_agent_code"
      }, {
        label: "Agent Cass",
        key: "iata_agent_cass"
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
    get_branch: function get_branch() {
      return this.loadItems("/superadmin/all-branch/0");
    }
  },
  mounted: function mounted() {
    this.get_branch();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=template&id=516077d2":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=template&id=516077d2 ***!
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
  return _c("div", {
    staticClass: "py-5"
  }, [_c("div", {
    staticClass: "admin-page-header"
  }, [_c("h2", [_vm._v("Branch Registry")]), _vm._v(" "), _c("router-link", {
    staticClass: "admin-pill-btn text-white",
    attrs: {
      to: "/superadmin/new-branch"
    }
  }, [_c("i", {
    staticClass: "fas fa-plus-circle"
  }), _vm._v("\n            Add Branch\n        ")])], 1), _vm._v(" "), _c("div", {
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
      placeholder: "Search branches..."
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
      columns: 6
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
      key: "cell(agent_name)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bold text-dark"
        }, [_vm._v(_vm._s(data.item.agent_name))])];
      }
    }, {
      key: "cell(iata_agent_code)",
      fn: function fn(data) {
        return [_c("code", {
          staticClass: "font-weight-bold",
          staticStyle: {
            "font-size": "0.85rem",
            background: "#F3F6F9",
            padding: "2px 6px",
            "border-radius": "4px"
          }
        }, [_vm._v(_vm._s(data.item.iata_agent_code))])];
      }
    }, {
      key: "cell(action)",
      fn: function fn(data) {
        return [_c("router-link", {
          staticClass: "btn btn-icon btn-light-primary btn-sm",
          attrs: {
            to: "/superadmin/new-branch/" + data.item["id"]
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

/***/ "./resources/js/src/view/pages/admin/AllBranch.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllBranch.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AllBranch_vue_vue_type_template_id_516077d2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AllBranch.vue?vue&type=template&id=516077d2 */ "./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=template&id=516077d2");
/* harmony import */ var _AllBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AllBranch.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AllBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AllBranch_vue_vue_type_template_id_516077d2__WEBPACK_IMPORTED_MODULE_0__.render,
  _AllBranch_vue_vue_type_template_id_516077d2__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AllBranch.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllBranch.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=template&id=516077d2":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=template&id=516077d2 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBranch_vue_vue_type_template_id_516077d2__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBranch_vue_vue_type_template_id_516077d2__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBranch_vue_vue_type_template_id_516077d2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllBranch.vue?vue&type=template&id=516077d2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBranch.vue?vue&type=template&id=516077d2");


/***/ })

}]);