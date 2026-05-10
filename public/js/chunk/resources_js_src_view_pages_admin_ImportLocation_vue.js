"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_ImportLocation_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadmin-ImportLocation",
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
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/import-loctaion", formData, {
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
        alert("An error occurred during import.");
      })["finally"](function () {
        _this.isUploading = false;
      });
    },
    delete_data: function delete_data() {
      if (window.confirm("DANGER: Are you ABSOLUTELY sure you want to wipe all location data? This cannot be undone.")) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]("/superadmin/delete-location").then(function (_ref2) {
          var data = _ref2.data;
          alert("Data successfully purged. Please upload fresh data immediately.");
        })["catch"](function (err) {
          alert("Purge failed.");
        });
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=template&id=001d9594":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=template&id=001d9594 ***!
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
  return _c("div", {
    staticClass: "py-5"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-8"
  }, [_c("div", {
    staticClass: "admin-glass-card text-center"
  }, [_c("h4", {
    staticClass: "font-weight-bold mb-2 text-dark"
  }, [_vm._v("Upload Location Data")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted mb-7"
  }, [_vm._v("Import latest geography mappings to DB.")]), _vm._v(" "), _c("div", {
    staticClass: "admin-upload-zone mb-6",
    "class": {
      "has-file": _vm.file
    }
  }, [_c("div", {
    staticClass: "upload-icon-wrap"
  }, [_c("i", {
    "class": _vm.file ? "fas fa-file-csv text-primary" : "fas fa-map-marked-alt"
  })]), _vm._v(" "), _vm.file ? _c("h4", [_vm._v(_vm._s(_vm.file.name))]) : _c("div", [_c("h4", [_vm._v("Drag & Drop Location file here")]), _vm._v(" "), _c("p", [_vm._v("or click to browse files")])]), _vm._v(" "), _c("input", {
    ref: "fileInput",
    attrs: {
      type: "file",
      accept: ".xlsx,.csv",
      disabled: _vm.isUploading
    },
    on: {
      change: _vm.handleFileUpload
    }
  })]), _vm._v(" "), _vm.successMsg ? _c("div", {
    staticClass: "alert alert-custom alert-light-success font-weight-bolder py-3 mb-6"
  }, [_c("i", {
    staticClass: "fas fa-check-circle mr-2"
  }), _vm._v(" Locations Imported Successfully!\n                ")]) : _vm._e(), _vm._v(" "), _c("div", {
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
  }), _vm._v("Uploading...")], 1) : _c("span", [_c("i", {
    staticClass: "fas fa-upload mr-2"
  }), _vm._v("Start Upload")])])])])]), _vm._v(" "), _c("div", {
    staticClass: "col-md-4 mt-4 mt-md-0"
  }, [_c("div", {
    staticClass: "card card-custom border-0 shadow-sm",
    staticStyle: {
      "border-radius": "16px",
      overflow: "hidden"
    }
  }, [_c("div", {
    staticClass: "card-body bg-light-danger text-center p-8"
  }, [_vm._m(1), _vm._v(" "), _c("h4", {
    staticClass: "font-weight-bold text-danger"
  }, [_vm._v("Danger Zone")]), _vm._v(" "), _c("p", {
    staticClass: "text-dark-50 mt-3 mb-7"
  }, [_vm._v("Warning: This will permanently wipe all location entities from the database. This action cannot be undone.")]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-danger btn-shadow font-weight-bold w-100 py-3",
    staticStyle: {
      "border-radius": "10px"
    },
    on: {
      click: _vm.delete_data
    }
  }, [_vm._v("\n                        Delete All Data\n                    ")])])])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "admin-page-header"
  }, [_c("h2", [_vm._v("Location Data Import")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "mb-6"
  }, [_c("i", {
    staticClass: "fas fa-exclamation-triangle text-danger font-size-h1"
  })]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ImportLocation.vue":
/*!**************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ImportLocation.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ImportLocation_vue_vue_type_template_id_001d9594__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImportLocation.vue?vue&type=template&id=001d9594 */ "./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=template&id=001d9594");
/* harmony import */ var _ImportLocation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImportLocation.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ImportLocation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ImportLocation_vue_vue_type_template_id_001d9594__WEBPACK_IMPORTED_MODULE_0__.render,
  _ImportLocation_vue_vue_type_template_id_001d9594__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/ImportLocation.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportLocation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ImportLocation.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportLocation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=template&id=001d9594":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=template&id=001d9594 ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportLocation_vue_vue_type_template_id_001d9594__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportLocation_vue_vue_type_template_id_001d9594__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ImportLocation_vue_vue_type_template_id_001d9594__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ImportLocation.vue?vue&type=template&id=001d9594 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ImportLocation.vue?vue&type=template&id=001d9594");


/***/ })

}]);