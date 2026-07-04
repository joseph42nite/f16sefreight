"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AllUsers_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadminalluser",
  data: function data() {
    return {
      fields: [{
        label: 'Sl',
        key: 'index'
      }, {
        label: 'Name',
        key: "name"
      }, {
        label: 'Email address',
        key: "email"
      }, {
        label: 'Company',
        key: "company_name"
      }, {
        label: 'Status',
        key: "is_active"
      },
      // {label:'Today login count',key:"daily_login_count"},
      // {label:'Plan expiry date',key:"plan_expiry_date"},
      // {label:'Plan status',key:"plan_status"},
      {
        label: "Action",
        key: "action"
      }],
      items: [],
      isLoading: false,
      current_date: '',
      filter: null,
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20, {
        value: 100,
        text: "Show a lot"
      }]
    };
  },
  methods: {
    delete_user: function delete_user(id) {
      var _this = this;
      var proceed = confirm("Are you sure you want to proceed?");
      if (proceed) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]("/superadmin/user/".concat(id)).then(function (_ref) {
          var data = _ref.data;
          _this.get_users();
        });
      }
    },
    get_users: function get_users() {
      var _this2 = this;
      this.items = [];
      this.isLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-user/0").then(function (_ref2) {
        var data = _ref2.data;
        _this2.items = data;
        _this2.totalRows = data.length;
      })["finally"](function () {
        _this2.isLoading = false;
      });
    },
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  components: {
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mounted: function mounted() {
    this.get_users();
    this.current_date = new Date().toISOString().slice(0, 10);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=template&id=42d9e023":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=template&id=42d9e023 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("h2", [_vm._v("User Registry")]), _vm._v(" "), _c("router-link", {
    staticClass: "admin-pill-btn text-white",
    attrs: {
      to: "/superadmin/new-users"
    }
  }, [_c("i", {
    staticClass: "fas fa-plus-circle"
  }), _vm._v("\n      Add New User\n    ")])], 1), _vm._v(" "), _c("div", {
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
  }, [_c("b-input-group", {
    attrs: {
      size: "sm"
    }
  }, [_c("b-form-input", {
    staticClass: "py-4",
    attrs: {
      id: "filter-input",
      type: "search",
      placeholder: "Search users..."
    },
    model: {
      value: _vm.filter,
      callback: function callback($$v) {
        _vm.filter = $$v;
      },
      expression: "filter"
    }
  })], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "admin-table-wrapper"
  }, [_vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 10,
      columns: 6
    }
  }) : _c("b-table", {
    attrs: {
      responsive: "",
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
          staticClass: "symbol symbol-35 symbol-light-primary mr-3"
        }, [_c("span", {
          staticClass: "symbol-label font-size-h5 font-weight-bolder"
        }, [_vm._v(_vm._s(data.item.name.charAt(0).toUpperCase()))])]), _vm._v(" "), _c("span", {
          staticClass: "font-weight-bolder text-dark"
        }, [_vm._v(_vm._s(data.item.name))])])];
      }
    }, {
      key: "cell(is_active)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "status-badge",
          "class": data.item.is_active == 1 ? "status-active" : "status-inactive"
        }, [_vm._v("\n            " + _vm._s(data.item.is_active == 1 ? "Active" : "Inactive") + "\n          ")])];
      }
    }, {
      key: "cell(action)",
      fn: function fn(data) {
        return [_c("div", {
          staticClass: "d-flex gap-2"
        }, [_c("router-link", {
          staticClass: "btn btn-icon btn-light-primary btn-sm mr-2",
          attrs: {
            to: "/superadmin/new-users/" + data.item["id"]
          }
        }, [_c("i", {
          staticClass: "fas fa-pen font-size-sm"
        })]), _vm._v(" "), _c("button", {
          staticClass: "btn btn-icon btn-light-danger btn-sm",
          on: {
            click: function click($event) {
              return _vm.delete_user(data.item["id"]);
            }
          }
        }, [_c("i", {
          staticClass: "fas fa-trash font-size-sm"
        })])], 1)];
      }
    }])
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-pagination-wrap"
  }, [_c("div", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("\n        Showing " + _vm._s(_vm.items.length ? (_vm.currentPage - 1) * _vm.perPage + 1 : 0) + " to " + _vm._s(Math.min(_vm.currentPage * _vm.perPage, _vm.totalRows)) + " of " + _vm._s(_vm.totalRows) + " entries\n      ")]), _vm._v(" "), _c("b-pagination", {
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

/***/ "./resources/js/src/view/pages/admin/AllUsers.vue":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllUsers.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AllUsers_vue_vue_type_template_id_42d9e023__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AllUsers.vue?vue&type=template&id=42d9e023 */ "./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=template&id=42d9e023");
/* harmony import */ var _AllUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AllUsers.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AllUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AllUsers_vue_vue_type_template_id_42d9e023__WEBPACK_IMPORTED_MODULE_0__.render,
  _AllUsers_vue_vue_type_template_id_42d9e023__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AllUsers.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllUsers.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=template&id=42d9e023":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=template&id=42d9e023 ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllUsers_vue_vue_type_template_id_42d9e023__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllUsers_vue_vue_type_template_id_42d9e023__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllUsers_vue_vue_type_template_id_42d9e023__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllUsers.vue?vue&type=template&id=42d9e023 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllUsers.vue?vue&type=template&id=42d9e023");


/***/ })

}]);