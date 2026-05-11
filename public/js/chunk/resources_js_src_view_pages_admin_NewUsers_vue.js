"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_NewUsers_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
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
      user_form: new Form({
        id: "",
        name: "",
        email: "",
        origin_airport_code: null,
        company_name: null,
        branch_name: null,
        daily_login_count: '',
        password: "",
        pima_address: "",
        is_active: "",
        can_send: 1,
        plan_expiry_date: ''
      }),
      action: 'Add',
      all_company: [{
        value: null,
        text: 'Select Company'
      }],
      all_branch: [{
        value: null,
        text: 'Select Branch'
      }],
      location: [],
      searchQuery: '',
      isDropdownOpen: false,
      showpass: true,
      isSubmitting: false,
      savedSuccessfully: false
    };
  },
  methods: {
    toggleDropdown: function toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption: function selectOption(item) {
      this.user_form.origin_airport_code = item.iata_code;
      var source_name = item.destination;
      var final_set = this.user_form.origin_airport_code + "(" + source_name + ")";
      this.searchQuery = final_set;
      this.isDropdownOpen = false; // Auto-close after selection
    },
    closeDropdown: function closeDropdown(event) {
      var dropdownContainer = this.$refs.dropdownContainer;
      if (dropdownContainer && !dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
    onSubmit: function onSubmit(evt) {
      var _this = this;
      evt.preventDefault();
      this.isSubmitting = true;
      this.savedSuccessfully = false;
      if (!this.user_form.origin_airport_code && this.searchQuery) {
        // AUTO-CAPTURE: If you type 'DXB' but don't click dropdown, intercept the raw text so validation succeeds.
        this.user_form.origin_airport_code = this.searchQuery.split('(')[0].trim().toUpperCase();
      }
      if (this.action == 'Add') {
        this.user_form.post("/superadmin/create-user").then(function (_ref) {
          var data = _ref.data;
          _this.$router.push('/superadmin/all-users');
        })["catch"](function (err) {})["finally"](function () {
          _this.isSubmitting = false;
        });
      } else {
        this.user_form.put("/superadmin/edit-user/".concat(this.user_form.id)).then(function (_ref2) {
          var data = _ref2.data;
          _this.savedSuccessfully = true;
          setTimeout(function () {
            _this.savedSuccessfully = false;
          }, 4000);
        })["catch"](function (err) {})["finally"](function () {
          _this.isSubmitting = false;
        });
      }
    },
    getData: function getData(id) {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-user/".concat(id)).then(function (_ref3) {
        var data = _ref3.data;
        _this2.user_form.fill(data[0]);
        _this2.searchQuery = data[0].origin_airport_code;
        _this2.getBranch('edit');
      });
    },
    getLocation: function getLocation() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/get-location").then(function (_ref4) {
        var data = _ref4.data;
        _this3.location = data;
      });
    },
    getCompany: function getCompany() {
      var _this4 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-company").then(function (_ref5) {
        var data = _ref5.data;
        for (var i = 0; i < data.length; i++) {
          _this4.all_company.push({
            "value": data[i].id,
            "text": data[i].name
          });
        }
      });
    },
    getBranch: function getBranch(operation) {
      var _this5 = this;
      if (operation == 'add') {
        this.all_branch = [{
          value: null,
          text: 'Select Branch'
        }];
        this.user_form.branch_name = null;
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/get-company-branch/".concat(this.user_form.company_name)).then(function (_ref6) {
        var data = _ref6.data;
        for (var i = 0; i < data.length; i++) {
          _this5.all_branch.push({
            "value": data[i].id,
            "text": data[i].agent_city
          });
        }
      });
    },
    normalizer: function normalizer(node) {
      return {
        id: node.value,
        label: node.name
      };
    }
  },
  mounted: function mounted() {
    this.getLocation();
    this.getCompany();
    if (this.get_item) {
      this.getData(this.get_item);
      this.action = 'Edit';
    }
    window.addEventListener('click', this.closeDropdown);
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('click', this.closeDropdown);
  },
  computed: {
    get_item: function get_item() {
      if (this.$route.params.id) return this.$route.params.id;else return 0;
    },
    filteredLocations: function filteredLocations() {
      if (!this.searchQuery) {
        return this.location;
      }
      var query = this.searchQuery.toLowerCase();
      return this.location.filter(function (item) {
        return (
          // item.destination.toLowerCase().includes(query) || // Filter by destination
          item.iata_code.toLowerCase().includes(query) // Filter by iata_code
        );
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=template&id=13c63f04&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=template&id=13c63f04&scoped=true ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "admin-page-header mb-7"
  }, [_c("h2", [_vm._v(_vm._s(_vm.action) + " User Account")])]), _vm._v(" "), _c("div", {
    staticClass: "row justify-content-center"
  }, [_c("div", {
    staticClass: "col-xl-9"
  }, [_c("div", {
    staticClass: "admin-glass-card p-8 p-md-10"
  }, [_c("b-form", {
    staticClass: "fw-700",
    on: {
      submit: _vm.onSubmit
    }
  }, [_c("h4", {
    staticClass: "font-weight-bolder text-dark mb-6"
  }, [_vm._v("Primary Information")]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Full Name "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    "class": {
      "is-invalid": _vm.user_form.errors.has("name")
    },
    attrs: {
      type: "text",
      required: "",
      placeholder: "e.g. Jane Smith"
    },
    model: {
      value: _vm.user_form.name,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "name", $$v);
      },
      expression: "user_form.name"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.user_form,
      field: "name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Email Address "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    "class": {
      "is-invalid": _vm.user_form.errors.has("email")
    },
    attrs: {
      type: "email",
      required: "",
      placeholder: "email@example.com",
      readonly: _vm.action == "Edit"
    },
    model: {
      value: _vm.user_form.email,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "email", $$v);
      },
      expression: "user_form.email"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.user_form,
      field: "email"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Company")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "custom-select",
    attrs: {
      options: _vm.all_company
    },
    on: {
      change: function change($event) {
        return _vm.getBranch("add");
      }
    },
    model: {
      value: _vm.user_form.company_name,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "company_name", $$v);
      },
      expression: "user_form.company_name"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.user_form,
      field: "company_name"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Branch Location")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "custom-select",
    attrs: {
      options: _vm.all_branch
    },
    model: {
      value: _vm.user_form.branch_name,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "branch_name", $$v);
      },
      expression: "user_form.branch_name"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.user_form,
      field: "branch_name"
    }
  })], 1)])]), _vm._v(" "), _c("hr", {
    staticClass: "my-8 opacity-10"
  }), _vm._v(" "), _c("h4", {
    staticClass: "font-weight-bolder text-dark mb-6"
  }, [_vm._v("Settings & Auth")]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Origin Airport")]), _vm._v(" "), _c("div", {
    ref: "dropdownContainer",
    staticClass: "custom-dropdown w-100",
    on: {
      click: _vm.toggleDropdown
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.searchQuery,
      expression: "searchQuery"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Search for code/city...",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.searchQuery
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.searchQuery = $event.target.value;
      }
    }
  }), _vm._v(" "), _vm.isDropdownOpen ? _c("div", {
    staticClass: "dropdown-options shadow"
  }, _vm._l(_vm.filteredLocations, function (item, index) {
    return _c("div", {
      key: index,
      staticClass: "option",
      on: {
        click: function click($event) {
          $event.stopPropagation();
          return _vm.selectOption(item);
        }
      }
    }, [_vm._v(_vm._s(item.iata_code) + " (" + _vm._s(item.destination) + ")")]);
  }), 0) : _vm._e()])])]), _vm._v(" "), _c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Pima Address")]), _vm._v(" "), _c("b-form-input", {
    "class": {
      "is-invalid": _vm.user_form.errors.has("pima_address")
    },
    attrs: {
      placeholder: "Address string"
    },
    model: {
      value: _vm.user_form.pima_address,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "pima_address", $$v);
      },
      expression: "user_form.pima_address"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.user_form,
      field: "pima_address"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Access Password")]), _vm._v(" "), _c("b-input-group", [_c("b-form-input", {
    "class": {
      "is-invalid": _vm.user_form.errors.has("password")
    },
    attrs: {
      type: _vm.showpass ? "password" : "text",
      placeholder: "••••••••"
    },
    model: {
      value: _vm.user_form.password,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "password", $$v);
      },
      expression: "user_form.password"
    }
  }), _vm._v(" "), _c("b-input-group-append", [_c("b-button", {
    attrs: {
      variant: "light"
    },
    on: {
      click: function click($event) {
        _vm.showpass = !_vm.showpass;
      }
    }
  }, [_c("i", {
    "class": _vm.showpass ? "fas fa-eye" : "fas fa-eye-slash"
  })])], 1)], 1), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.user_form,
      field: "password"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "col-md-6 d-flex align-items-center pt-6"
  }, [_c("b-form-checkbox", {
    staticClass: "font-weight-bold mb-0",
    attrs: {
      value: 1,
      "unchecked-value": 0
    },
    model: {
      value: _vm.user_form.can_send,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "can_send", $$v);
      },
      expression: "user_form.can_send"
    }
  }, [_vm._v("\n                  Grant explicit sending rights\n               ")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "mt-8 d-flex justify-content-between align-items-center"
  }, [_vm.action == "Edit" ? _c("div", [_c("span", {
    staticClass: "font-weight-bold mr-3"
  }, [_vm._v("Account Status:")]), _vm._v(" "), _c("b-form-checkbox", {
    attrs: {
      value: 1,
      "unchecked-value": 0,
      "switch": "",
      inline: "",
      size: "lg"
    },
    model: {
      value: _vm.user_form.is_active,
      callback: function callback($$v) {
        _vm.$set(_vm.user_form, "is_active", $$v);
      },
      expression: "user_form.is_active"
    }
  }, [_c("span", {
    staticClass: "font-weight-bolder ml-2",
    "class": _vm.user_form.is_active ? "text-success" : "text-danger"
  }, [_vm._v("\n                        " + _vm._s(_vm.user_form.is_active ? "ACTIVE" : "INACTIVE") + "\n                      ")])])], 1) : _c("div"), _vm._v(" "), _c("button", {
    staticClass: "admin-pill-btn btn-lg",
    attrs: {
      type: "submit",
      disabled: _vm.isSubmitting
    }
  }, [_vm.isSubmitting ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Saving...")], 1) : _c("span", [_vm._v(_vm._s(_vm.action == "Add" ? "Create User Profile" : "Update Settings"))])])]), _vm._v(" "), _vm.savedSuccessfully ? _c("div", {
    staticClass: "alert alert-custom alert-light-success mt-5 text-center font-weight-bold"
  }, [_c("i", {
    staticClass: "fas fa-check-circle mr-2 text-success"
  }), _vm._v(" Saved Successfully\n          ")]) : _vm._e()])], 1)])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.dropdown-options[data-v-13c63f04] {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  width: 100%;\n  background-color: #fff;\n  border: 1px solid #E4E6EF;\n  border-radius: 8px;\n  max-height: 200px;\n  overflow-y: auto;\n  z-index: 50;\n  margin-top: 5px;\n}\n.option[data-v-13c63f04] {\n  padding: 10px 15px;\n  cursor: pointer;\n  font-weight: 500;\n  color: #3F4254;\n  transition: background 0.2s;\n}\n.option[data-v-13c63f04]:hover {\n  background-color: #F3F6F9;\n  color: #355594;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_style_index_0_id_13c63f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_style_index_0_id_13c63f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_style_index_0_id_13c63f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewUsers.vue":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewUsers.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NewUsers_vue_vue_type_template_id_13c63f04_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NewUsers.vue?vue&type=template&id=13c63f04&scoped=true */ "./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=template&id=13c63f04&scoped=true");
/* harmony import */ var _NewUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NewUsers.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=script&lang=js");
/* harmony import */ var _NewUsers_vue_vue_type_style_index_0_id_13c63f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _NewUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _NewUsers_vue_vue_type_template_id_13c63f04_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _NewUsers_vue_vue_type_template_id_13c63f04_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "13c63f04",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/NewUsers.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewUsers.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=template&id=13c63f04&scoped=true":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=template&id=13c63f04&scoped=true ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_template_id_13c63f04_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_template_id_13c63f04_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_template_id_13c63f04_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewUsers.vue?vue&type=template&id=13c63f04&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=template&id=13c63f04&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css":
/*!****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewUsers_vue_vue_type_style_index_0_id_13c63f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewUsers.vue?vue&type=style&index=0&id=13c63f04&scoped=true&lang=css");


/***/ })

}]);