"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_Settings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Settings",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      form: {
        email_address: "",
        provider: "gmail"
      },
      providerOptions: [{
        value: "gmail",
        text: "Google Gmail Workspace"
      }, {
        value: "outlook",
        text: "Microsoft Outlook / Office 365"
      }],
      connections: [],
      isLoading: false,
      isSubmitting: false
    };
  },
  computed: {
    currentUser: function currentUser() {
      return this.$store.getters.currentUser;
    },
    isViperCore: function isViperCore() {
      var tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
      return !tier || tier === 'viper_core';
    }
  },
  mounted: function mounted() {
    if (!this.isViperCore) {
      this.fetchConnections();
    }
  },
  methods: {
    fetchConnections: function fetchConnections() {
      var _this = this;
      this.isLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/mailbox-connections").then(function (response) {
        _this.connections = response.data;
      })["catch"](function (error) {
        console.error("Failed to load connections:", error);
      })["finally"](function () {
        _this.isLoading = false;
      });
    },
    connectMailbox: function connectMailbox() {
      var _this2 = this;
      this.isSubmitting = true;

      // Generate dummy credentials for OAuth sync callback
      var payload = {
        email_address: this.form.email_address,
        provider: this.form.provider,
        access_token: "mock_access_token_" + Math.random().toString(36).substring(7),
        refresh_token: "mock_refresh_token_" + Math.random().toString(36).substring(7),
        expires_in: 3600
      };
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/mailbox-connections/connect", payload).then(function (response) {
        _this2.$bvToast.toast(response.data.message || "Mailbox connected successfully.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this2.form.email_address = "";
        _this2.fetchConnections();
      })["catch"](function (error) {
        var errorMsg = error.response && error.response.data && error.response.data.error ? error.response.data.error : "Failed to connect mailbox.";
        _this2.$bvToast.toast(errorMsg, {
          title: "Connection Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this2.isSubmitting = false;
      });
    },
    disconnectMailbox: function disconnectMailbox(id) {
      var _this3 = this;
      if (confirm("Are you sure you want to disconnect this mailbox connection?")) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"]["delete"]("/user/mailbox-connections/".concat(id)).then(function (response) {
          _this3.$bvToast.toast("Mailbox successfully disconnected.", {
            title: "Success",
            variant: "success",
            solid: true
          });
          _this3.fetchConnections();
        })["catch"](function (error) {
          _this3.$bvToast.toast("Failed to disconnect mailbox.", {
            title: "Error",
            variant: "danger",
            solid: true
          });
        });
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=template&id=16ac2c3a&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=template&id=16ac2c3a&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-container", {
    staticClass: "body-color",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-lg-row"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
    staticClass: "ml-lg-4 mt-4 mt-lg-0",
    staticStyle: {
      background: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      "box-shadow": "0 10px 30px rgba(53, 85, 148, 0.1)",
      "z-index": "1",
      "border-radius": "32px",
      flex: "1",
      "min-width": "0",
      overflow: "hidden"
    }
  }, [_c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10"
  }, [_c("div", {
    staticClass: "d-flex flex-column"
  }, [_c("span", {
    staticStyle: {
      "text-transform": "uppercase",
      "letter-spacing": "2px",
      "font-size": "0.85rem",
      "font-weight": "700",
      color: "#355594",
      opacity: "0.6",
      "margin-bottom": "0.5rem",
      display: "block"
    }
  }, [_vm._v("Setup")]), _vm._v(" "), _c("h6", {
    staticStyle: {
      color: "#355594",
      "font-size": "26px !important",
      "line-height": "34px !important",
      "font-weight": "800 !important",
      "letter-spacing": "-0.5px !important",
      "margin-bottom": "0px",
      "font-family": "'Inter', sans-serif !important"
    }
  }, [_vm._v("Mailbox Settings")])])]), _vm._v(" "), _c("hr", {
    staticStyle: {
      border: "0",
      "border-top": "1px solid rgba(53, 85, 148, 0.12)"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10"
  }, [_vm.isViperCore ? _c("div", {
    staticClass: "teaser-container mx-auto py-10 px-8 text-center rounded-lg shadow-lg"
  }, [_c("div", {
    staticClass: "icon-circle mb-6 mx-auto"
  }, [_c("b-icon", {
    staticClass: "lock-icon",
    attrs: {
      icon: "gear-wide-connected",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("h3", {
    staticClass: "teaser-title mb-4"
  }, [_vm._v("Upgrade to Connect Mailboxes")]), _vm._v(" "), _c("p", {
    staticClass: "teaser-description mb-6 mx-auto"
  }, [_vm._v("\n                        Link your Gmail or Outlook corporate accounts to unlock unified synchronization, AI exclusions, automatic job creation, and quick replies.\n                    ")]), _vm._v(" "), _c("b-button", {
    staticClass: "upgrade-btn px-8 py-3",
    attrs: {
      variant: "primary"
    }
  }, [_vm._v("\n                        Upgrade to Viper Tactical / Command\n                    ")])], 1) : _c("div", {
    staticClass: "settings-workspace mx-2 mx-sm-4"
  }, [_c("b-row", [_c("b-col", {
    staticClass: "mb-6 mb-lg-0",
    attrs: {
      lg: "5"
    }
  }, [_c("div", {
    staticClass: "settings-card p-6 rounded-lg"
  }, [_c("h4", {
    staticClass: "settings-card-title mb-4"
  }, [_vm._v("Connect New Mailbox")]), _vm._v(" "), _c("b-form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.connectMailbox.apply(null, arguments);
      }
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Email Address:",
      "label-for": "email",
      "label-class": "font-weight-bold text-muted"
    }
  }, [_c("b-form-input", {
    staticClass: "form-control-custom",
    attrs: {
      id: "email",
      type: "email",
      placeholder: "e.g. ops@company.com",
      required: ""
    },
    model: {
      value: _vm.form.email_address,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "email_address", $$v);
      },
      expression: "form.email_address"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Email Provider:",
      "label-for": "provider",
      "label-class": "font-weight-bold text-muted"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control-custom",
    attrs: {
      id: "provider",
      options: _vm.providerOptions,
      required: ""
    },
    model: {
      value: _vm.form.provider,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "provider", $$v);
      },
      expression: "form.provider"
    }
  })], 1), _vm._v(" "), _c("b-button", {
    staticClass: "save-btn w-100 py-3 mt-2",
    attrs: {
      type: "submit",
      disabled: _vm.isSubmitting
    }
  }, [_vm.isSubmitting ? _c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v("\n                                        Connect Account\n                                    ")], 1)], 1)], 1)]), _vm._v(" "), _c("b-col", {
    attrs: {
      lg: "7"
    }
  }, [_c("div", {
    staticClass: "settings-card p-6 rounded-lg"
  }, [_c("h4", {
    staticClass: "settings-card-title mb-4"
  }, [_vm._v("Active Connections")]), _vm._v(" "), _vm.isLoading ? _c("b-spinner", {
    staticClass: "d-block mx-auto my-8 text-primary"
  }) : _vm.connections.length === 0 ? _c("div", {
    staticClass: "text-center py-8 text-muted"
  }, [_c("b-icon", {
    staticClass: "mb-3",
    attrs: {
      icon: "inboxes",
      "font-scale": "2"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "mb-0"
  }, [_vm._v("No mailboxes connected yet.")])], 1) : _c("div", {
    staticClass: "connections-list"
  }, _vm._l(_vm.connections, function (conn) {
    return _c("div", {
      key: conn.id,
      staticClass: "connection-item d-flex align-items-center justify-content-between p-4 mb-3 rounded-lg"
    }, [_c("div", {
      staticClass: "d-flex align-items-center"
    }, [_c("div", {
      staticClass: "provider-badge mr-3",
      "class": conn.provider
    }, [_c("b-icon", {
      attrs: {
        icon: conn.provider === "gmail" ? "google" : "envelope-fill"
      }
    })], 1), _vm._v(" "), _c("div", [_c("h6", {
      staticClass: "mb-1 font-weight-bold text-dark"
    }, [_vm._v(_vm._s(conn.email_address))]), _vm._v(" "), _c("span", {
      staticClass: "badge badge-success px-2 py-1",
      staticStyle: {
        "font-size": "0.75rem"
      }
    }, [_vm._v("Active & Synced")])])]), _vm._v(" "), _c("b-button", {
      staticClass: "disconnect-btn",
      attrs: {
        size: "sm",
        variant: "outline-danger"
      },
      on: {
        click: function click($event) {
          return _vm.disconnectMailbox(conn.id);
        }
      }
    }, [_vm._v("\n                                            Disconnect\n                                        ")])], 1);
  }), 0)], 1)])], 1)], 1)])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Settings.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Settings.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Settings_vue_vue_type_template_id_16ac2c3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings.vue?vue&type=template&id=16ac2c3a&scoped=true */ "./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=template&id=16ac2c3a&scoped=true");
/* harmony import */ var _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=script&lang=js");
/* harmony import */ var _Settings_vue_vue_type_style_index_0_id_16ac2c3a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Settings_vue_vue_type_template_id_16ac2c3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Settings_vue_vue_type_template_id_16ac2c3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "16ac2c3a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/Settings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=template&id=16ac2c3a&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=template&id=16ac2c3a&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_16ac2c3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_16ac2c3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_16ac2c3a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=template&id=16ac2c3a&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=template&id=16ac2c3a&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_style_index_0_id_16ac2c3a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Settings.vue?vue&type=style&index=0&id=16ac2c3a&scoped=true&lang=css");


/***/ })

}]);