"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_ClientAwbTracking_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ClientAwbTracking",
  components: {
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      fields: [{
        label: "Sl",
        key: "index"
      }, {
        label: "Filename",
        key: "original_filename",
        sortable: true
      }, {
        label: "Doc Type",
        key: "document_type",
        sortable: true
      }, {
        label: "Company",
        key: "company_name",
        sortable: true
      }, {
        label: "Operator",
        key: "operator_name",
        sortable: true
      }, {
        label: "Status",
        key: "status",
        sortable: true
      }, {
        label: "Created At",
        key: "created_at",
        sortable: true
      }],
      items: [],
      isLoading: false,
      filter: null,
      fromDate: "",
      toDate: "",
      totalRows: 0,
      currentPage: 1,
      perPage: 10
    };
  },
  methods: {
    fetchLogs: function fetchLogs() {
      var _this = this;
      this.isLoading = true;
      this.items = [];
      var params = {};
      if (this.fromDate) params.from_date = this.fromDate;
      if (this.toDate) params.to_date = this.toDate;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/client-awbs", {
        params: params
      }).then(function (_ref) {
        var data = _ref.data;
        if (data && data.status) {
          _this.items = data.data || [];
          _this.totalRows = _this.items.length;
        }
      })["catch"](function (err) {
        console.error("Failed to fetch client logs:", err);
      })["finally"](function () {
        _this.isLoading = false;
      });
    },
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getStatusBadgeClass: function getStatusBadgeClass(status) {
      switch (status) {
        case "completed":
          return "badge-light-success";
        case "failed":
          return "badge-light-danger";
        case "processing":
          return "badge-light-info";
        default:
          return "badge-light-warning";
      }
    },
    formatDocType: function formatDocType(type) {
      if (!type) return "N/A";
      return type.replace(/_/g, " ");
    },
    exportCSV: function exportCSV() {
      if (!this.items.length) {
        alert("No records to export.");
        return;
      }
      var headers = ['ID', 'Filename', 'Doc Type', 'Company', 'Operator', 'Status', 'Date Created', 'Date Completed'];
      var rows = this.items.map(function (item) {
        return [item.id, "\"".concat(item.original_filename.replace(/"/g, '""'), "\""), item.document_type, "\"".concat(item.company_name.replace(/"/g, '""'), "\""), "\"".concat(item.operator_name.replace(/"/g, '""'), "\""), item.status, item.created_at, item.completed_at];
      });
      var csvContent = [headers.join(',')].concat(_toConsumableArray(rows.map(function (e) {
        return e.join(',');
      }))).join('\n');
      var blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
      });
      var link = document.createElement("a");
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "client_awb_logs_".concat(new Date().toISOString().slice(0, 10), ".csv"));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted: function mounted() {
    this.fetchLogs();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "admin-page-header d-flex justify-content-between align-items-center mb-8"
  }, [_c("h2", [_vm._v("Client AWB Tracking Logs")]), _vm._v(" "), _c("b-button", {
    staticClass: "admin-pill-btn text-white px-6 font-weight-bold",
    attrs: {
      variant: "success"
    },
    on: {
      click: _vm.exportCSV
    }
  }, [_c("i", {
    staticClass: "fas fa-file-csv mr-2"
  }), _vm._v(" Export to CSV\n        ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card p-6",
    staticStyle: {
      background: "#ffffff",
      "border-radius": "16px",
      "box-shadow": "0 10px 30px rgba(53, 85, 148, 0.05)",
      border: "1px solid #e2e8f0"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-6"
  }, [_c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-3"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("label", {
    staticClass: "mr-2 font-weight-bold text-muted mb-0"
  }, [_vm._v("From:")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control-sm",
    staticStyle: {
      "max-width": "160px"
    },
    attrs: {
      type: "date"
    },
    model: {
      value: _vm.fromDate,
      callback: function callback($$v) {
        _vm.fromDate = $$v;
      },
      expression: "fromDate"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("label", {
    staticClass: "mr-2 font-weight-bold text-muted mb-0"
  }, [_vm._v("Till:")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control-sm",
    staticStyle: {
      "max-width": "160px"
    },
    attrs: {
      type: "date"
    },
    model: {
      value: _vm.toDate,
      callback: function callback($$v) {
        _vm.toDate = $$v;
      },
      expression: "toDate"
    }
  })], 1), _vm._v(" "), _c("b-button", {
    staticClass: "px-4",
    attrs: {
      variant: "primary",
      size: "sm"
    },
    on: {
      click: _vm.fetchLogs
    }
  }, [_vm._v("\n                    Filter\n                ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "w-md-25"
  }, [_c("b-form-input", {
    staticClass: "py-4",
    attrs: {
      id: "filter-input",
      type: "search",
      placeholder: "Search logs..."
    },
    model: {
      value: _vm.filter,
      callback: function callback($$v) {
        _vm.filter = $$v;
      },
      expression: "filter"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "admin-table-wrapper table-responsive"
  }, [_vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 8,
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
      "thead-class": "text-uppercase text-muted"
    },
    on: {
      filtered: _vm.onFiltered
    },
    scopedSlots: _vm._u([{
      key: "cell(index)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bold text-muted"
        }, [_vm._v("#" + _vm._s(data.index + 1))])];
      }
    }, {
      key: "cell(original_filename)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bolder text-dark"
        }, [_vm._v(_vm._s(data.item.original_filename))])];
      }
    }, {
      key: "cell(document_type)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "badge badge-light-primary text-uppercase font-weight-bold"
        }, [_vm._v(_vm._s(_vm.formatDocType(data.item.document_type)))])];
      }
    }, {
      key: "cell(status)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "badge font-weight-bolder text-uppercase",
          "class": _vm.getStatusBadgeClass(data.item.status)
        }, [_vm._v("\n                        " + _vm._s(data.item.status) + "\n                    ")])];
      }
    }, {
      key: "cell(created_at)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "text-muted"
        }, [_vm._v(_vm._s(data.item.created_at))])];
      }
    }])
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-pagination-wrap d-flex justify-content-between align-items-center mt-6"
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

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientAwbTracking.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ClientAwbTracking_vue_vue_type_template_id_e208a028_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true */ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true");
/* harmony import */ var _ClientAwbTracking_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ClientAwbTracking.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=script&lang=js");
/* harmony import */ var _ClientAwbTracking_vue_vue_type_style_index_0_id_e208a028_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ClientAwbTracking_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ClientAwbTracking_vue_vue_type_template_id_e208a028_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ClientAwbTracking_vue_vue_type_template_id_e208a028_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "e208a028",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/ClientAwbTracking.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=script&lang=js":
/*!*****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientAwbTracking_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientAwbTracking.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientAwbTracking_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientAwbTracking_vue_vue_type_template_id_e208a028_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientAwbTracking_vue_vue_type_template_id_e208a028_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientAwbTracking_vue_vue_type_template_id_e208a028_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=template&id=e208a028&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css":
/*!*************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientAwbTracking_vue_vue_type_style_index_0_id_e208a028_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientAwbTracking.vue?vue&type=style&index=0&id=e208a028&scoped=true&lang=css");


/***/ })

}]);