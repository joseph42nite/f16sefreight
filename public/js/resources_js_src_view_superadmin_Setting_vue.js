"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_superadmin_Setting_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/superadmin/Setting.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/superadmin/Setting.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
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
    submit: function submit() {
      var _this = this;
      this.msg_form.post("/superadmin/add-notice").then(function (_ref) {
        var data = _ref.data;
        alert("Added successfull");
        _this.msg_form.airline = '';
        _this.msg_form.message = '';
        _this.get_notice();
      });
    },
    get_notice: function get_notice() {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/get-notice").then(function (_ref2) {
        var data = _ref2.data;
        _this2.all_notice = data;
      });
    },
    get_airline: function get_airline() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/get-airline-list").then(function (_ref3) {
        var data = _ref3.data;
        _this3.all_airline = data;
      });
    },
    delete_notice: function delete_notice(carrier_code) {
      var _this4 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/delete-notice", {
        'carrier_code': carrier_code
      }).then(function (_ref4) {
        var data = _ref4.data;
        _this4.get_notice();
      });
    }
  },
  mounted: function mounted() {
    this.get_notice();
    this.get_airline();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/superadmin/Setting.vue?vue&type=template&id=73efc346":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/superadmin/Setting.vue?vue&type=template&id=73efc346 ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "mt-10 p-5"
  }, [_c("h1", [_vm._v("Add notice for Airline")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-between"
  }, [_c("div", [_c("label", {
    attrs: {
      "for": "user_message"
    }
  }, [_vm._v("User Message")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.msg_form.message,
      expression: "msg_form.message"
    }],
    attrs: {
      rows: "7",
      cols: "100"
    },
    domProps: {
      value: _vm.msg_form.message
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.msg_form, "message", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", [_c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.msg_form.airline,
      expression: "msg_form.airline"
    }],
    staticClass: "form-control",
    on: {
      change: function change($event) {
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
    }, [_vm._v("\n                    " + _vm._s(airline.carrier_code) + "\n                ")]);
  })], 2)]), _vm._v(" "), _c("div", [_c("button", {
    staticClass: "btn btn-primary",
    on: {
      click: _vm.submit
    }
  }, [_vm._v("Save")])])]), _vm._v(" "), _c("table", {
    staticClass: "table mt-5"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.all_notice, function (notice) {
    return _c("tr", {
      key: notice.carrier_code
    }, [_c("td", [_vm._v(_vm._s(notice.carrier_code))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(notice.user_notice_1))]), _vm._v(" "), _c("td", [_c("button", {
      staticClass: "btn btn-danger",
      on: {
        click: function click($event) {
          return _vm.delete_notice(notice.carrier_code);
        }
      }
    }, [_vm._v("Delete")])])]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("th", [_vm._v("Airline")]), _vm._v(" "), _c("th", [_vm._v("Message")]), _vm._v(" "), _c("th", [_vm._v("Action")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/superadmin/Setting.vue":
/*!******************************************************!*\
  !*** ./resources/js/src/view/superadmin/Setting.vue ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Setting_vue_vue_type_template_id_73efc346__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Setting.vue?vue&type=template&id=73efc346 */ "./resources/js/src/view/superadmin/Setting.vue?vue&type=template&id=73efc346");
/* harmony import */ var _Setting_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Setting.vue?vue&type=script&lang=js */ "./resources/js/src/view/superadmin/Setting.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Setting_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Setting_vue_vue_type_template_id_73efc346__WEBPACK_IMPORTED_MODULE_0__.render,
  _Setting_vue_vue_type_template_id_73efc346__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/superadmin/Setting.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/superadmin/Setting.vue?vue&type=script&lang=js":
/*!******************************************************************************!*\
  !*** ./resources/js/src/view/superadmin/Setting.vue?vue&type=script&lang=js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Setting_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Setting.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/superadmin/Setting.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Setting_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/superadmin/Setting.vue?vue&type=template&id=73efc346":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/superadmin/Setting.vue?vue&type=template&id=73efc346 ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Setting_vue_vue_type_template_id_73efc346__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Setting_vue_vue_type_template_id_73efc346__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Setting_vue_vue_type_template_id_73efc346__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Setting.vue?vue&type=template&id=73efc346 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/superadmin/Setting.vue?vue&type=template&id=73efc346");


/***/ })

}]);