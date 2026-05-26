"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_NewCompany_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _riophae_vue_treeselect_dist_vue_treeselect_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @riophae/vue-treeselect/dist/vue-treeselect.css */ "./node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      company_form: new Form({
        id: "",
        name: "",
        templates_config: {
          allowed_templates: [],
          default_focus_air: "",
          default_house_air: ""
        }
      }),
      action: "Add",
      location: [],
      searchQuery: "",
      isDropdownOpen: false,
      showpass: true,
      availableTemplates: []
    };
  },
  methods: {
    onSubmit: function onSubmit(evt) {
      var _this = this;
      evt.preventDefault();

      // Safeguard: Duplicate Key Guard
      var list = this.company_form.templates_config.allowed_templates || [];
      var validKeys = list.map(function (x) {
        return (x.key || '').trim().toLowerCase();
      }).filter(function (k) {
        return k !== '';
      });
      if (new Set(validKeys).size !== validKeys.length) {
        alert("Duplicate Template Keys detected. Please ensure all keys are unique.");
        return;
      }
      if (this.action == "Add") {
        this.company_form.post("/superadmin/create-company").then(function (_ref) {
          var data = _ref.data;
          _this.$router.push("/superadmin/all-company");
        })["catch"](function (err) {});
      } else {
        this.company_form.put("/superadmin/edit-company/".concat(this.company_form.id)).then(function (_ref2) {
          var data = _ref2.data;
          $("#fade").fadeToggle(1000);
          setTimeout(function () {
            return $("#fade").fadeToggle(1000);
          }, 2000);
        });
      }
    },
    addTemplateRow: function addTemplateRow() {
      if (!this.company_form.templates_config.allowed_templates) {
        this.company_form.templates_config.allowed_templates = [];
      }
      this.company_form.templates_config.allowed_templates.push({
        key: '',
        label: ''
      });
    },
    removeTemplateRow: function removeTemplateRow(index) {
      this.company_form.templates_config.allowed_templates.splice(index, 1);
    },
    addTemplateFromPill: function addTemplateFromPill(key) {
      if (!this.company_form.templates_config.allowed_templates) {
        this.$set(this.company_form.templates_config, 'allowed_templates', []);
      }

      // Prevent duplicates
      var exists = this.company_form.templates_config.allowed_templates.some(function (t) {
        return t.key === key;
      });
      if (exists) {
        alert("'".concat(key, "' is already assigned."));
        return;
      }
      this.company_form.templates_config.allowed_templates.push({
        key: key,
        label: key.replace(/_/g, ' ').toUpperCase()
      });
    },
    getData: function getData(id) {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-company/".concat(id)).then(function (_ref3) {
        var data = _ref3.data;
        var payload = data[0];
        // Ensure we instantiate object shape to protect bindings if remote payload is null
        if (!payload.templates_config) {
          payload.templates_config = {
            allowed_templates: [],
            default_focus_air: '',
            default_house_air: ''
          };
        } else {
          // LEGACY DEFENSE: Transform string arrays ['ksr'] into object arrays [{key:'ksr', label:'ksr'}]
          if (Array.isArray(payload.templates_config.allowed_templates)) {
            payload.templates_config.allowed_templates = payload.templates_config.allowed_templates.map(function (item) {
              if (typeof item === 'string') {
                return {
                  key: item,
                  label: item
                };
              }
              return item;
            });
          } else {
            payload.templates_config.allowed_templates = [];
          }
        }
        _this2.company_form.fill(payload);
      });
    },
    fetchAvailableTemplates: function fetchAvailableTemplates() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get('/superadmin/available-templates').then(function (_ref4) {
        var data = _ref4.data;
        _this3.availableTemplates = data;
      });
    }
  },
  mounted: function mounted() {
    this.fetchAvailableTemplates();
    if (this.get_item) {
      this.getData(this.get_item);
      this.action = "Edit";
    }
  },
  computed: {
    get_item: function get_item() {
      if (this.$route.params.id) return this.$route.params.id;else return 0;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("b-form", {
    staticClass: "w-md-50 fw-700",
    on: {
      submit: _vm.onSubmit
    }
  }, [_c("h3", {
    staticClass: "fw-700"
  }, [_vm._v(_vm._s(_vm.action) + " company")]), _vm._v(" "), _c("div", {
    staticClass: "bg-white p-10 rounded"
  }, [_c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.company_form.errors.has("name")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Name"
    },
    model: {
      value: _vm.company_form.name,
      callback: function callback($$v) {
        _vm.$set(_vm.company_form, "name", $$v);
      },
      expression: "company_form.name"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.company_form,
      field: "name"
    }
  })], 1)], 1), _vm._v(" "), _c("hr", {
    staticClass: "mb-7"
  }), _vm._v(" "), _c("h5", {
    staticClass: "mb-4 text-dark font-weight-bold"
  }, [_vm._v("Document Templates Configuration")]), _vm._v(" "), _c("b-form-group", {
    staticClass: "mb-7",
    attrs: {
      label: "Configured Document Templates"
    }
  }, [_vm._l(_vm.company_form.templates_config.allowed_templates, function (row, index) {
    return _c("div", {
      key: index,
      staticClass: "row no-gutters mb-3 align-items-center p-3 rounded border",
      staticStyle: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0 !important"
      }
    }, [_c("div", {
      staticClass: "col-5 pr-2"
    }, [_c("label", {
      staticClass: "small font-weight-bold text-muted"
    }, [_vm._v("System Key (Internal)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        size: "sm",
        list: "suggested-keys-list",
        placeholder: "Type or Select Key"
      },
      model: {
        value: row.key,
        callback: function callback($$v) {
          _vm.$set(row, "key", $$v);
        },
        expression: "row.key"
      }
    }), _vm._v(" "), _c("datalist", {
      attrs: {
        id: "suggested-keys-list"
      }
    }, _vm._l(_vm.availableTemplates, function (code) {
      return _c("option", {
        key: "suggest-" + code,
        domProps: {
          value: code
        }
      });
    }), 0)], 1), _vm._v(" "), _c("div", {
      staticClass: "col-5 pr-2"
    }, [_c("label", {
      staticClass: "small font-weight-bold text-muted"
    }, [_vm._v("Display Label (User Visible)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        size: "sm",
        placeholder: "e.g. Main Focus Air"
      },
      model: {
        value: row.label,
        callback: function callback($$v) {
          _vm.$set(row, "label", $$v);
        },
        expression: "row.label"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "col-2 pt-6 text-right"
    }, [_c("b-button", {
      staticClass: "btn-icon px-2",
      attrs: {
        variant: "light-danger",
        size: "sm"
      },
      on: {
        click: function click($event) {
          return _vm.removeTemplateRow(index);
        }
      }
    }, [_c("i", {
      staticClass: "flaticon2-trash text-danger"
    })])], 1)]);
  }), _vm._v(" "), _c("div", {
    staticClass: "mb-5"
  }, [_c("b-button", {
    staticClass: "font-weight-bolder px-4",
    attrs: {
      variant: "outline-primary",
      size: "sm"
    },
    on: {
      click: _vm.addTemplateRow
    }
  }, [_c("i", {
    staticClass: "la la-plus mr-1"
  }), _vm._v(" Add Template Mapping\n                    ")])], 1), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.company_form,
      field: "templates_config.allowed_templates"
    }
  }), _vm._v(" "), _vm.availableTemplates.length > 0 ? _c("div", {
    staticClass: "mt-4 p-3 bg-light rounded border"
  }, [_c("span", {
    staticClass: "d-block text-muted font-size-xs font-weight-bold mb-2"
  }, [_vm._v("AVAILABLE SYSTEM KEYS (SOURCE OF TRUTH)")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-wrap"
  }, _vm._l(_vm.availableTemplates, function (code) {
    return _c("span", {
      key: "pill-" + code,
      staticClass: "badge badge-light-primary badge-pill mr-2 mb-2 p-2",
      staticStyle: {
        cursor: "pointer"
      },
      attrs: {
        title: "Click to assign to company"
      },
      on: {
        click: function click($event) {
          return _vm.addTemplateFromPill(code);
        }
      }
    }, [_c("i", {
      staticClass: "la la-plus-circle mr-1 text-primary"
    }), _vm._v(" " + _vm._s(code) + "\n                        ")]);
  }), 0)]) : _vm._e()], 2), _vm._v(" "), _c("div", {
    staticClass: "row mb-7"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("b-form-group", {
    attrs: {
      label: "Default Focus Air Template"
    }
  }, [_c("b-form-select", {
    model: {
      value: _vm.company_form.templates_config.default_focus_air,
      callback: function callback($$v) {
        _vm.$set(_vm.company_form.templates_config, "default_focus_air", $$v);
      },
      expression: "company_form.templates_config.default_focus_air"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("-- Select Default --")]), _vm._v(" "), _vm._l(_vm.company_form.templates_config.allowed_templates, function (tpl) {
    return _c("option", {
      key: "fa-" + tpl.key,
      domProps: {
        value: tpl.key
      }
    }, [_vm._v(_vm._s(tpl.label || tpl.key))]);
  })], 2), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.company_form,
      field: "templates_config.default_focus_air"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-6"
  }, [_c("b-form-group", {
    attrs: {
      label: "Default House Waybill Template"
    }
  }, [_c("b-form-select", {
    model: {
      value: _vm.company_form.templates_config.default_house_air,
      callback: function callback($$v) {
        _vm.$set(_vm.company_form.templates_config, "default_house_air", $$v);
      },
      expression: "company_form.templates_config.default_house_air"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("-- Select Default --")]), _vm._v(" "), _vm._l(_vm.company_form.templates_config.allowed_templates, function (tpl) {
    return _c("option", {
      key: "hw-" + tpl.key,
      domProps: {
        value: tpl.key
      }
    }, [_vm._v(_vm._s(tpl.label || tpl.key))]);
  })], 2), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.company_form,
      field: "templates_config.default_house_air"
    }
  })], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "alert alert-success mt-3",
    attrs: {
      role: "alert",
      id: "fade"
    }
  }, [_c("span", {
    staticClass: "font-weight-bolder font-size-h6"
  }, [_vm._v("Saved Successfully")])]), _vm._v(" "), _c("button", {
    staticClass: "btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white mt-3"
  }, [_vm._v("\n                " + _vm._s(_vm.action) + " company\n            ")])], 1)])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.fw-700[data-v-7969a1f9] {\n    font-weight: 700;\n}\n.input-box[data-v-7969a1f9] {\n    border: 1px silver solid;\n}\n.create_btn[data-v-7969a1f9] {\n    background: #00a1e4;\n}\n#fade[data-v-7969a1f9] {\n    display: none;\n}\n.custom-dropdown[data-v-7969a1f9] {\n    position: relative;\n    display: inline-block;\n    width: 100%;\n    border: solid 1px silver;\n    border-radius: 5px;\n}\n.form-control[data-v-7969a1f9] {\n    width: 100%;\n}\n.dropdown-options[data-v-7969a1f9] {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    width: 100%;\n    background-color: #fff;\n    border: 1px solid #ccc;\n    border-top: none;\n    max-height: 200px; /* Adjust as needed */\n    overflow-y: auto;\n}\n.option[data-v-7969a1f9] {\n    padding: 5px 10px;\n    cursor: pointer;\n}\n.option[data-v-7969a1f9]:hover {\n    background-color: #f0f0f0;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_style_index_0_id_7969a1f9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_style_index_0_id_7969a1f9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_style_index_0_id_7969a1f9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewCompany.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewCompany.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NewCompany_vue_vue_type_template_id_7969a1f9_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true */ "./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true");
/* harmony import */ var _NewCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NewCompany.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=script&lang=js");
/* harmony import */ var _NewCompany_vue_vue_type_style_index_0_id_7969a1f9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _NewCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _NewCompany_vue_vue_type_template_id_7969a1f9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _NewCompany_vue_vue_type_template_id_7969a1f9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "7969a1f9",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/NewCompany.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewCompany.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_template_id_7969a1f9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_template_id_7969a1f9_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_template_id_7969a1f9_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=template&id=7969a1f9&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewCompany_vue_vue_type_style_index_0_id_7969a1f9_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewCompany.vue?vue&type=style&index=0&id=7969a1f9&scoped=true&lang=css");


/***/ })

}]);