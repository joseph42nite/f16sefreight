"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_EditSystemTemplate_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      templateKey: "",
      schemaKeys: [],
      coords: {},
      loadingSchema: true,
      isSaving: false,
      isEditMode: false
    };
  },
  mounted() {
    this.loadSchemaAndData();
  },
  methods: {
    async loadSchemaAndData() {
      this.loadingSchema = true;
      try {
        const {
          data
        } = await _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/system-templates");
        this.schemaKeys = data.schema || [];

        // Initialize fresh empty data grid based on standard backend schema
        const emptyGrid = {};
        this.schemaKeys.forEach(key => {
          emptyGrid[key] = [0, 0, 0, 0];
        });
        const targetKey = this.$route.params.key;
        if (targetKey) {
          this.isEditMode = true;
          this.templateKey = targetKey;

          // Search current templates for existing vectors
          const existing = (data.templates || []).find(t => t.key === targetKey);
          if (existing && existing.coordinates) {
            // Fill what matches, default the rest
            this.coords = _objectSpread(_objectSpread({}, emptyGrid), existing.coordinates);

            // Handle potential drift: if existing was array shape we ensure missing fields hold empty values
            this.schemaKeys.forEach(k => {
              if (!Array.isArray(this.coords[k]) || this.coords[k].length !== 4) {
                this.$set(this.coords, k, [0, 0, 0, 0]);
              }
            });
          } else {
            this.coords = emptyGrid;
          }
        } else {
          this.coords = emptyGrid;
        }
      } catch (err) {
        console.error("Schema acquisition failure", err);
      } finally {
        this.loadingSchema = false;
      }
    },
    saveData() {
      if (!this.templateKey || this.templateKey.trim() === "") {
        sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire("Empty Key", "Please define a unique system key identifier.", "warning");
        return;
      }
      this.isSaving = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/system-templates/save", {
        key: this.templateKey.trim(),
        coordinates: this.coords
      }).then(() => {
        sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire({
          title: "Sync Complete",
          text: "Database state updated and configuration file successfully re-generated.",
          icon: "success",
          timer: 2000
        }).then(() => {
          this.$router.push("/superadmin/all-templates");
        });
      }).catch(err => {
        sweetalert2__WEBPACK_IMPORTED_MODULE_1___default().fire("Validation Fail", "Coordinate vectors must contain positive integer values.", "error");
      }).finally(() => {
        this.isSaving = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("div", [_c("b-button", {
    staticClass: "p-0 font-weight-bold mb-2 text-muted",
    attrs: {
      variant: "link"
    },
    on: {
      click: function ($event) {
        return _vm.$router.go(-1);
      }
    }
  }, [_c("i", {
    staticClass: "la la-arrow-left"
  }), _vm._v(" Back to List\n            ")]), _vm._v(" "), _c("h2", {
    staticClass: "font-weight-bolder text-dark"
  }, [_vm._v(_vm._s(_vm.isEditMode ? "Configure Coordinates" : "Define New System Template"))])], 1), _vm._v(" "), _c("b-button", {
    staticClass: "font-weight-bolder px-10 shadow-sm",
    attrs: {
      variant: "success",
      size: "lg",
      disabled: _vm.isSaving
    },
    on: {
      click: _vm.saveData
    }
  }, [_vm.isSaving ? _c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v("\n            " + _vm._s(_vm.isSaving ? "Saving..." : "Commit & Propagate Changes") + "\n        ")], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "bg-white p-10 rounded shadow-sm border mb-10"
  }, [_c("div", {
    staticClass: "w-50 mb-10"
  }, [_c("label", {
    staticClass: "font-weight-bolder font-size-h6 text-dark-75 mb-3"
  }, [_vm._v("System Identifier (Template Key)")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control-lg font-weight-bold",
    attrs: {
      placeholder: "e.g. air_main_ksr_v2",
      disabled: _vm.isEditMode
    },
    model: {
      value: _vm.templateKey,
      callback: function ($$v) {
        _vm.templateKey = $$v;
      },
      expression: "templateKey"
    }
  }), _vm._v(" "), !_vm.isEditMode ? _c("small", {
    staticClass: "form-text text-muted mt-2"
  }, [_vm._v("\n                Alpha-numeric and underscores only. This matches the internal lookup handle.\n            ")]) : _c("small", {
    staticClass: "form-text text-danger font-weight-bold mt-2"
  }, [_vm._v("\n                System key is fixed after creation to prevent schema drift.\n            ")])], 1), _vm._v(" "), _vm._m(0), _vm._v(" "), _vm.loadingSchema ? _c("div", {
    staticClass: "p-10 text-center text-muted"
  }, [_c("b-spinner", {
    staticClass: "mb-4"
  }), _vm._v(" "), _c("p", [_vm._v("Synchronizing coordinate dictionary schema from cluster...")])], 1) : _c("div", {
    staticClass: "row"
  }, _vm._l(_vm.schemaKeys, function (fieldName) {
    return _c("div", {
      key: fieldName,
      staticClass: "col-md-6 col-lg-4 mb-6"
    }, [_c("div", {
      staticClass: "p-6 bg-light rounded border shadow-hover-sm transition-all",
      staticStyle: {
        "min-height": "160px",
        "border-color": "#ebedf3 !important"
      }
    }, [_c("label", {
      staticClass: "d-flex justify-content-between align-items-center mb-4 border-bottom pb-2 border-light"
    }, [_c("span", {
      staticClass: "font-weight-bold text-uppercase text-muted small",
      staticStyle: {
        "letter-spacing": "0.5px"
      }
    }, [_vm._v("\n                            " + _vm._s(fieldName.replace(/_/g, " ")) + "\n                        ")]), _vm._v(" "), _c("i", {
      staticClass: "la la-vector-square text-primary font-size-h4 opacity-50"
    })]), _vm._v(" "), _c("div", {
      staticClass: "row no-gutters"
    }, [_c("div", {
      staticClass: "col-3 pr-2"
    }, [_c("label", {
      staticClass: "text-muted font-weight-bold",
      staticStyle: {
        "font-size": "10px",
        "text-transform": "uppercase"
      }
    }, [_vm._v("X1")]), _vm._v(" "), _c("b-form-input", {
      staticClass: "bg-white border-1 text-center font-weight-bold",
      attrs: {
        type: "number",
        size: "sm"
      },
      model: {
        value: _vm.coords[fieldName][0],
        callback: function ($$v) {
          _vm.$set(_vm.coords[fieldName], 0, _vm._n($$v));
        },
        expression: "coords[fieldName][0]"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-3 pr-2"
    }, [_c("label", {
      staticClass: "text-muted font-weight-bold",
      staticStyle: {
        "font-size": "10px",
        "text-transform": "uppercase"
      }
    }, [_vm._v("Y1")]), _vm._v(" "), _c("b-form-input", {
      staticClass: "bg-white border-1 text-center font-weight-bold",
      attrs: {
        type: "number",
        size: "sm"
      },
      model: {
        value: _vm.coords[fieldName][1],
        callback: function ($$v) {
          _vm.$set(_vm.coords[fieldName], 1, _vm._n($$v));
        },
        expression: "coords[fieldName][1]"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-3 pr-2"
    }, [_c("label", {
      staticClass: "text-muted font-weight-bold",
      staticStyle: {
        "font-size": "10px",
        "text-transform": "uppercase"
      }
    }, [_vm._v("X2")]), _vm._v(" "), _c("b-form-input", {
      staticClass: "bg-white border-1 text-center font-weight-bold",
      attrs: {
        type: "number",
        size: "sm"
      },
      model: {
        value: _vm.coords[fieldName][2],
        callback: function ($$v) {
          _vm.$set(_vm.coords[fieldName], 2, _vm._n($$v));
        },
        expression: "coords[fieldName][2]"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-3"
    }, [_c("label", {
      staticClass: "text-muted font-weight-bold",
      staticStyle: {
        "font-size": "10px",
        "text-transform": "uppercase"
      }
    }, [_vm._v("Y2")]), _vm._v(" "), _c("b-form-input", {
      staticClass: "bg-white border-1 text-center font-weight-bold",
      attrs: {
        type: "number",
        size: "sm"
      },
      model: {
        value: _vm.coords[fieldName][3],
        callback: function ($$v) {
          _vm.$set(_vm.coords[fieldName], 3, _vm._n($$v));
        },
        expression: "coords[fieldName][3]"
      }
    })], 1)])])]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("h5", {
    staticClass: "font-weight-bolder border-bottom pb-3 mb-7 text-primary d-flex align-items-center"
  }, [_c("i", {
    staticClass: "flaticon2-cube-1 mr-2 text-primary"
  }), _vm._v(" Physical Bound Map [X1, Y1, X2, Y2]\n        ")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/EditSystemTemplate.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EditSystemTemplate_vue_vue_type_template_id_4cf640af_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true */ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true");
/* harmony import */ var _EditSystemTemplate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditSystemTemplate.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=script&lang=js");
/* harmony import */ var _EditSystemTemplate_vue_vue_type_style_index_0_id_4cf640af_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _EditSystemTemplate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _EditSystemTemplate_vue_vue_type_template_id_4cf640af_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _EditSystemTemplate_vue_vue_type_template_id_4cf640af_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "4cf640af",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/EditSystemTemplate.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSystemTemplate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSystemTemplate.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSystemTemplate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSystemTemplate_vue_vue_type_template_id_4cf640af_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSystemTemplate_vue_vue_type_template_id_4cf640af_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSystemTemplate_vue_vue_type_template_id_4cf640af_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=template&id=4cf640af&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSystemTemplate_vue_vue_type_style_index_0_id_4cf640af_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/EditSystemTemplate.vue?vue&type=style&index=0&id=4cf640af&scoped=true&lang=css");


/***/ })

}]);