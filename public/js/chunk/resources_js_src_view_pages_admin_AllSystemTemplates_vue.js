"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AllSystemTemplates_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      items: [],
      loading: true
    };
  },
  mounted: function mounted() {
    this.fetchData();
  },
  methods: {
    fetchData: function fetchData() {
      var _this = this;
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/system-templates").then(function (_ref) {
        var data = _ref.data;
        _this.items = data.templates || [];
      })["finally"](function () {
        _this.loading = false;
      });
    },
    formatDate: function formatDate(dateString) {
      if (!dateString) return "N/A";
      var d = new Date(dateString);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    editRow: function editRow(row) {
      this.$router.push("/superadmin/edit-template/".concat(row.key));
    },
    deleteRow: function deleteRow(row) {
      var _this2 = this;
      sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire({
        title: "Delete Master Template?",
        text: "This will permanently remove the '".concat(row.key, "' definition from physical disk. This cannot be undone."),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirm Destroy",
        confirmButtonColor: "#F64E60"
      }).then(function (result) {
        if (result.isConfirmed) {
          _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]("/superadmin/system-templates/".concat(row.id)).then(function () {
            sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire("Erased!", "Template successfully decommissioned.", "success");
            _this2.fetchData();
          })["catch"](function (err) {
            var _err$response;
            var msg = ((_err$response = err.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.message) || "Failed to perform excision.";
            sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire("Access Blocked", msg, "error");
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=template&id=eb2461b6":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=template&id=eb2461b6 ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "mt-10 p-5"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-8"
  }, [_c("h2", {
    staticClass: "font-weight-bolder text-dark"
  }, [_vm._v("System OCR Templates")]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-primary font-weight-bold px-6",
    attrs: {
      to: "/superadmin/edit-template"
    }
  }, [_c("i", {
    staticClass: "la la-plus mr-2"
  }), _vm._v(" Create New Template\n        ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "bg-white p-8 rounded shadow-sm border"
  }, [_c("div", {
    staticClass: "table-responsive"
  }, [_c("table", {
    staticClass: "table table-vertical-center table-head-custom table-borderless"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", [_vm.loading ? _c("tr", [_c("td", {
    staticClass: "text-center p-10 text-muted",
    attrs: {
      colspan: "4"
    }
  }, [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v(" Loading system configurations...\n                        ")], 1)]) : _vm._l(_vm.items, function (row) {
    return _c("tr", {
      key: row.id,
      staticClass: "border-bottom"
    }, [_c("td", {
      staticClass: "pl-7"
    }, [_c("span", {
      staticClass: "font-weight-bolder text-dark-75 font-size-h6"
    }, [_vm._v(_vm._s(row.key))])]), _vm._v(" "), _c("td", [_c("span", {
      staticClass: "badge badge-light-info font-weight-bold"
    }, [_vm._v("\n                                " + _vm._s(Object.keys(row.coordinates || {}).length) + " standard regions\n                            ")])]), _vm._v(" "), _c("td", [_c("span", {
      staticClass: "text-muted font-size-sm"
    }, [_vm._v("\n                                " + _vm._s(_vm.formatDate(row.updated_at)) + "\n                            ")])]), _vm._v(" "), _c("td", {
      staticClass: "text-right pr-7"
    }, [_c("b-button", {
      staticClass: "font-weight-bold mr-2",
      attrs: {
        variant: "light-primary",
        size: "sm"
      },
      on: {
        click: function click($event) {
          return _vm.editRow(row);
        }
      }
    }, [_vm._v("\n                                Edit Grid\n                            ")]), _vm._v(" "), _c("b-button", {
      attrs: {
        variant: "light-danger",
        size: "sm"
      },
      on: {
        click: function click($event) {
          return _vm.deleteRow(row);
        }
      }
    }, [_c("i", {
      staticClass: "flaticon2-trash"
    })])], 1)]);
  }), _vm._v(" "), !_vm.loading && _vm.items.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center p-10 text-muted",
    attrs: {
      colspan: "4"
    }
  }, [_vm._v("No system templates defined. Click 'Create New' to bootstrap.")])]) : _vm._e()], 2)])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", {
    staticClass: "text-left text-uppercase"
  }, [_c("th", {
    staticClass: "pl-7",
    staticStyle: {
      "min-width": "200px"
    }
  }, [_c("span", {
    staticClass: "text-muted"
  }, [_vm._v("System Key")])]), _vm._v(" "), _c("th", [_c("span", {
    staticClass: "text-muted"
  }, [_vm._v("Fields Count")])]), _vm._v(" "), _c("th", [_c("span", {
    staticClass: "text-muted"
  }, [_vm._v("Last Modified")])]), _vm._v(" "), _c("th", {
    staticClass: "text-right pr-7"
  }, [_c("span", {
    staticClass: "text-muted"
  }, [_vm._v("Actions")])])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllSystemTemplates.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllSystemTemplates.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AllSystemTemplates_vue_vue_type_template_id_eb2461b6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AllSystemTemplates.vue?vue&type=template&id=eb2461b6 */ "./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=template&id=eb2461b6");
/* harmony import */ var _AllSystemTemplates_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AllSystemTemplates.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AllSystemTemplates_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AllSystemTemplates_vue_vue_type_template_id_eb2461b6__WEBPACK_IMPORTED_MODULE_0__.render,
  _AllSystemTemplates_vue_vue_type_template_id_eb2461b6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AllSystemTemplates.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllSystemTemplates_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllSystemTemplates.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllSystemTemplates_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=template&id=eb2461b6":
/*!************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=template&id=eb2461b6 ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllSystemTemplates_vue_vue_type_template_id_eb2461b6__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllSystemTemplates_vue_vue_type_template_id_eb2461b6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllSystemTemplates_vue_vue_type_template_id_eb2461b6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllSystemTemplates.vue?vue&type=template&id=eb2461b6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllSystemTemplates.vue?vue&type=template&id=eb2461b6");


/***/ })

}]);