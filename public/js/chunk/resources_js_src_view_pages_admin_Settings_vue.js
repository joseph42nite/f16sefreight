"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_Settings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Settings.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Settings.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      msg_form: new Form({
        airline: '',
        message: ''
      }),
      all_airline: [],
      all_notice: []
    };
  },
  methods: {
    submit() {
      this.msg_form.post(`/superadmin/add-notice`).then(({
        data
      }) => {
        alert("Added successfull");
        this.msg_form.airline = '';
        this.msg_form.message = '';
        this.get_notice();
      });
    },
    get_notice() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/superadmin/get-notice`).then(({
        data
      }) => {
        this.all_notice = data;
      });
    },
    get_airline() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/superadmin/get-airline-list`).then(({
        data
      }) => {
        this.all_airline = data;
      });
    },
    delete_notice(carrier_code) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/superadmin/delete-notice`, {
        'carrier_code': carrier_code
      }).then(({
        data
      }) => {
        this.get_notice();
      });
    }
  },
  mounted() {
    this.get_notice();
    this.get_airline();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Settings.vue?vue&type=template&id=0c329d5f":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Settings.vue?vue&type=template&id=0c329d5f ***!
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
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card mb-6"
  }, [_c("div", {
    staticClass: "row"
  }, [_c("div", {
    staticClass: "col-12 col-md-8 mb-4 mb-md-0"
  }, [_c("div", {
    staticClass: "admin-form-group mb-0"
  }, [_c("label", {
    attrs: {
      for: "user_message"
    }
  }, [_vm._v("User Message")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.msg_form.message,
      expression: "msg_form.message"
    }],
    staticClass: "form-control",
    attrs: {
      id: "user_message",
      rows: "6"
    },
    domProps: {
      value: _vm.msg_form.message
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.msg_form, "message", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "col-12 col-md-4"
  }, [_c("div", {
    staticClass: "admin-form-group"
  }, [_c("label", [_vm._v("Airline")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.msg_form.airline,
      expression: "msg_form.airline"
    }],
    staticClass: "form-control custom-select",
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.msg_form, "airline", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select Airline")]), _vm._v(" "), _vm._l(_vm.all_airline, function (airline) {
    return _c("option", {
      key: airline.carrier_prefix,
      domProps: {
        value: airline.carrier_code
      }
    }, [_vm._v("\n                            " + _vm._s(airline.carrier_code) + "\n                        ")]);
  })], 2)]), _vm._v(" "), _c("button", {
    staticClass: "admin-pill-btn w-100 justify-content-center",
    on: {
      click: _vm.submit
    }
  }, [_vm._v("Save")])])])]), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card"
  }, [_c("div", {
    staticClass: "admin-table-wrapper table-responsive"
  }, [_c("table", {
    staticClass: "table b-table mb-0"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", [_vm._l(_vm.all_notice, function (notice) {
    return _c("tr", {
      key: notice.carrier_code
    }, [_c("td", {
      attrs: {
        "data-label": "Airline"
      }
    }, [_vm._v(_vm._s(notice.carrier_code))]), _vm._v(" "), _c("td", {
      attrs: {
        "data-label": "Message"
      }
    }, [_vm._v(_vm._s(notice.user_notice_1))]), _vm._v(" "), _c("td", {
      staticClass: "text-right",
      attrs: {
        "data-label": "Action"
      }
    }, [_c("button", {
      staticClass: "btn btn-danger btn-sm",
      on: {
        click: function ($event) {
          return _vm.delete_notice(notice.carrier_code);
        }
      }
    }, [_vm._v("Delete")])])]);
  }), _vm._v(" "), !_vm.all_notice.length ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-6",
    attrs: {
      colspan: "3"
    }
  }, [_vm._v("No airline notices configured yet.")])]) : _vm._e()], 2)])])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "admin-page-header mb-6"
  }, [_c("h2", [_vm._v("Add notice for Airline")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", [_vm._v("Airline")]), _vm._v(" "), _c("th", [_vm._v("Message")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Action")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/Settings.vue":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/Settings.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Settings_vue_vue_type_template_id_0c329d5f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings.vue?vue&type=template&id=0c329d5f */ "./resources/js/src/view/pages/admin/Settings.vue?vue&type=template&id=0c329d5f");
/* harmony import */ var _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/Settings.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Settings_vue_vue_type_template_id_0c329d5f__WEBPACK_IMPORTED_MODULE_0__.render,
  _Settings_vue_vue_type_template_id_0c329d5f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/Settings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/Settings.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/Settings.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Settings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/Settings.vue?vue&type=template&id=0c329d5f":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/Settings.vue?vue&type=template&id=0c329d5f ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_0c329d5f__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_0c329d5f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_0c329d5f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=template&id=0c329d5f */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/Settings.vue?vue&type=template&id=0c329d5f");


/***/ })

}]);