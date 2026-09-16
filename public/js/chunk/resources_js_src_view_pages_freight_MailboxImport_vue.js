"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_MailboxImport_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/** The loading screen after Outlook is connected: imports the last month, a few pages per call, until done. */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MailboxImport",
  data: () => ({
    info: null,
    error: null,
    stopped: false
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(["designation"])), {}, {
    done() {
      return this.info && this.info.status === "completed";
    },
    title() {
      return this.done ? "Your mail is in" : "Bringing in your last month of mail";
    },
    percent() {
      if (this.done) return 100;
      if (!this.info || !this.info.estimate) return 35;
      return Math.min(99, Math.round(this.info.processed / this.info.estimate * 100));
    },
    since() {
      return new Date(this.info.from).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long"
      });
    },
    /** Accounts has no Inbox; everyone else goes to it. */
    next() {
      return this.designation === "accounts" ? {
        path: "/",
        label: "Open the app"
      } : {
        path: "/inbox",
        label: "Open Inbox"
      };
    }
  }),
  created() {
    this.step();
  },
  beforeDestroy() {
    this.stopped = true;
  },
  methods: {
    step() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/mailboxes/" + this.$route.params.id + "/import").then(({
        data
      }) => {
        this.info = data;
        this.error = data.error ? "Microsoft answered: " + data.error + " — trying again." : null;
        if (!this.stopped && ["pending", "running"].includes(data.status)) {
          setTimeout(() => this.step(), data.error ? 5000 : 300);
        }
      }).catch(e => {
        this.error = e.response && e.response.data && e.response.data.error || "Could not reach the server.";
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=template&id=42f409e1":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=template&id=42f409e1 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-import"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _vm.info ? _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v(_vm._s(_vm.info.email_address)), _vm.info.from ? _c("span", [_vm._v(" · mail since " + _vm._s(_vm.since))]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.info && _vm.info.status !== "failed" ? _c("div", {
    staticClass: "fx-import__bar",
    attrs: {
      role: "progressbar",
      "aria-valuenow": _vm.info.processed,
      "aria-valuemin": "0",
      "aria-valuemax": _vm.info.estimate || undefined
    }
  }, [_c("div", {
    staticClass: "fx-import__fill",
    class: {
      "is-unknown": !_vm.info.estimate && !_vm.done
    },
    style: {
      width: _vm.percent + "%"
    }
  })]) : _vm._e(), _vm._v(" "), _vm.info ? _c("p", {
    staticClass: "fx-import__count"
  }, [_vm.done ? [_vm._v(_vm._s(_vm.info.processed.toLocaleString()) + " messages brought in.")] : _vm.info.status === "failed" ? [_vm._v("The import stopped after " + _vm._s(_vm.info.processed.toLocaleString()) + " messages.")] : [_vm._v("\n      " + _vm._s(_vm.info.processed.toLocaleString())), _vm.info.estimate ? _c("span", [_vm._v(" of about " + _vm._s(_vm.info.estimate.toLocaleString()))]) : _vm._e(), _vm._v(" messages…\n    ")]], 2) : _vm._e(), _vm._v(" "), !_vm.done && _vm.info && _vm.info.status !== "failed" ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n    You can leave this page — the import carries on in the background and your mail appears as it arrives.\n  ")]) : _vm._e(), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-import__actions"
  }, [_vm.info && _vm.info.status === "failed" ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: function ($event) {
        return _vm.$router.push("/mailboxes");
      }
    }
  }, [_vm._v("Go to Mailboxes")]) : _vm.done ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: function ($event) {
        return _vm.$router.push(_vm.next.path);
      }
    }
  }, [_vm._v(_vm._s(_vm.next.label))]) : _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: function ($event) {
        return _vm.$router.push(_vm.next.path);
      }
    }
  }, [_vm._v("Continue to " + _vm._s(_vm.next.label.replace("Open ", "")))])])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/MailboxImport.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MailboxImport.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MailboxImport_vue_vue_type_template_id_42f409e1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MailboxImport.vue?vue&type=template&id=42f409e1 */ "./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=template&id=42f409e1");
/* harmony import */ var _MailboxImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MailboxImport.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MailboxImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MailboxImport_vue_vue_type_template_id_42f409e1__WEBPACK_IMPORTED_MODULE_0__.render,
  _MailboxImport_vue_vue_type_template_id_42f409e1__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/MailboxImport.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MailboxImport.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=template&id=42f409e1":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=template&id=42f409e1 ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxImport_vue_vue_type_template_id_42f409e1__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxImport_vue_vue_type_template_id_42f409e1__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxImport_vue_vue_type_template_id_42f409e1__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MailboxImport.vue?vue&type=template&id=42f409e1 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxImport.vue?vue&type=template&id=42f409e1");


/***/ })

}]);