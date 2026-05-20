"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_ImportAms_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadmin-ImportAms",
  data: function data() {
    return {
      file: null,
      isUploading: false,
      successMsg: false
    };
  },
  methods: {
    handleFileUpload: function handleFileUpload(event) {
      this.file = event.target.files[0] || null;
      this.successMsg = false;
    },
    uploadFile: function uploadFile(evt) {
      var _this = this;
      if (!this.file) return;
      evt.preventDefault();
      this.isUploading = true;
      this.successMsg = false;
      var formData = new FormData();
      formData.append('file', this.file);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/import-ams", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (_ref) {
        var data = _ref.data;
        _this.file = null;
        _this.successMsg = true;
        if (_this.$refs.fileInput) _this.$refs.fileInput.value = "";
        setTimeout(function () {
          _this.successMsg = false;
        }, 4000);
      })["catch"](function (err) {
        alert("Import process error encountered.");
      })["finally"](function () {
        _this.isUploading = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=template&id=127eadd6":
/*!************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=template&id=127eadd6 ***!
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
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "row justify-content-center"
  }, [_c("div", {
    staticClass: "col-md-8"
  }, [_c("div", {
    staticClass: "admin-glass-card text-center"
  }, [_c("h4", {
    staticClass: "font-weight-bold mb-2 text-dark"
  }, [_vm._v("Import New AMS Data")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted mb-7"
  }, [_vm._v("Standardized file imports for aviation data management.")]), _vm._v(" "), _c("div", {
    staticClass: "admin-upload-zone mb-6",
    "class": {
      "has-file": _vm.file
    }
  }, [_c("div", {
    staticClass: "upload-icon-wrap"
  }, [_c("i", {
    "class": _vm.file ? "fas fa-file-signature text-info" : "fas fa-upload"
  })]), _vm._v(" "), _vm.file ? _c("h4", [_vm._v(_vm._s(_vm.file.name))]) : _c("div", [_c("h4", [_vm._v("Drag & Drop your data file")]), _vm._v(" "), _c("p", [_vm._v("Browse your folders")])]), _vm._v(" "), _c("input", {
    ref: "fileInput",
    attrs: {
      type: "file",
      accept: ".xlsx,.xls,.csv",
      disabled: _vm.isUploading
    },
    on: {
      change: _vm.handleFileUpload
    }
  })]), _vm._v(" "), _vm.successMsg ? _c("div", {
    staticClass: "alert alert-custom alert-light-info py-3 font-weight-bolder mb-6"
  }, [_c("i", {
    staticClass: "fas fa-info-circle mr-2 text-info"
  }), _vm._v(" Import Request Sent Successfully.\n                ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center"
  }, [_c("button", {
    staticClass: "admin-pill-btn btn-lg px-10",
    attrs: {
      disabled: !_vm.file || _vm.isUploading
    },
    on: {
      click: _vm.uploadFile
    }
  }, [_vm.isUploading ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Processing...")], 1) : _c("span", [_c("i", {
    staticClass: "fas fa-arrow-circle-up mr-2"
  }), _vm._v("Commit Import")])])])])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "admin-page-header"
  }, [_c("h2", [_vm._v("AMS Data Import")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ImportAms.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ImportAms.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ImportAms_vue_vue_type_template_id_127eadd6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportAms.vue?vue&type=template&id=127eadd6 */ "./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=template&id=127eadd6");
/* harmony import */ var _ImportAms_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImportAms.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ImportAms_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ImportAms_vue_vue_type_template_id_127eadd6__WEBPACK_IMPORTED_MODULE_0__.render,
  _ImportAms_vue_vue_type_template_id_127eadd6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/ImportAms.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportAms_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ImportAms.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportAms_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=template&id=127eadd6":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=template&id=127eadd6 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportAms_vue_vue_type_template_id_127eadd6__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportAms_vue_vue_type_template_id_127eadd6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportAms_vue_vue_type_template_id_127eadd6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ImportAms.vue?vue&type=template&id=127eadd6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportAms.vue?vue&type=template&id=127eadd6");


/***/ })

}]);