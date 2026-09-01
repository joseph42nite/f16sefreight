"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_MailboxSettings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MailboxSettings",
  components: {
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    loading: true,
    error: null,
    connectError: null,
    connections: [],
    connecting: false,
    busy: null
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/mailboxes").then(({
        data
      }) => {
        this.connections = data.connections || [];
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    providerLabel(p) {
      /* ⚠️ A raw `gmail` in the column looked like a rendering bug the first time this
         screen was opened against seeded data. Every provider gets a real name, and one
         that has no ingestion yet says so where it is read. */
      if (p === "outlook" || p === "microsoft") return "Microsoft 365";
      if (p === "gmail" || p === "google") return "Gmail (not syncing yet)";
      return p;
    },
    /* Gmail connections exist in seeded data but cannot sync — GAPS #15. Offering the
       button anyway means the only way to learn that is to press it and read an error. */
    canSync(c) {
      return c.provider === "outlook" || c.provider === "microsoft";
    },
    /* One column, three sources of truth — the row is easier to read than three flags. */
    stateOf(c) {
      if (c.disconnected_at) return "disconnected";
      if (!c.is_active) return "paused";
      return c.auth_state;
    },
    connect(provider) {
      this.connecting = true;
      this.connectError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/mailboxes/connect", {
        provider
      }).then(({
        data
      }) => {
        /* A full navigation rather than a popup: popup blockers eat this, and the
           consent screen is a page the user should see in full. */
        window.location.href = data.authorization_url;
      }).catch(e => {
        this.connectError = this.messageFor(e);
        this.connecting = false;
      });
    },
    syncNow(c) {
      this.busy = c.id;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/mailboxes/" + c.id + "/sync").then(() => this.load()).catch(e => {
        this.connectError = this.messageFor(e);
      }).finally(() => {
        this.busy = null;
      });
    },
    confirmDisconnect(c) {
      /* 🔴 Confirmed, because it ERASES credentials — reconnecting means going through
         Microsoft's consent screen again, not flipping a switch back. */
      if (!window.confirm("Disconnect " + c.email_address + "?\n\n" + "The stored credentials are erased. New mail stops arriving in the Inbox; " + "messages already synced are kept.")) return;
      this.busy = c.id;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/mailboxes/" + c.id + "/disconnect").then(() => this.load()).catch(e => {
        this.connectError = this.messageFor(e);
      }).finally(() => {
        this.busy = null;
      });
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=template&id=2f09ea5f":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=template&id=2f09ea5f ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_vm._m(0), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Connected")]), _vm._v(" "), !_vm.connections.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        No mailbox is connected yet, so the Inbox has nothing to show.\n      ")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.connections, function (c) {
    return _c("tr", {
      key: c.id
    }, [_c("td", [_vm._v(_vm._s(c.email_address))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.providerLabel(c.provider)))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: _vm.stateOf(c)
      }
    })], 1), _vm._v(" "), _c("td", [c.last_synced_at ? _c("span", [_vm._v(_vm._s(c.last_synced_at))]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("not yet")])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [!c.disconnected_at ? _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy === c.id || !_vm.canSync(c),
        title: _vm.canSync(c) ? "Fetch new mail now" : "Gmail ingestion is not built yet"
      },
      on: {
        click: function ($event) {
          return _vm.syncNow(c);
        }
      }
    }, [_vm._v("Sync now")]) : _vm._e(), _vm._v(" "), !c.disconnected_at ? _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy === c.id
      },
      on: {
        click: function ($event) {
          return _vm.confirmDisconnect(c);
        }
      }
    }, [_vm._v("Disconnect")]) : _vm._e()])]);
  }), 0)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Add a mailbox")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        You will be taken to Microsoft to sign in and approve access. F16s never sees your\n        password, and you can disconnect at any time — disconnecting erases the stored\n        credentials.\n      ")]), _vm._v(" "), _vm.connectError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.connectError))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.connecting
    },
    on: {
      click: function ($event) {
        return _vm.connect("outlook");
      }
    }
  }, [_vm._v("\n        " + _vm._s(_vm.connecting ? "Opening Microsoft…" : "Connect Outlook / Microsoft 365") + "\n      ")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: "",
      title: "Deferred — Google requires a separate security assessment"
    }
  }, [_vm._v("\n        Connect Gmail (not available yet)\n      ")])])]], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Mailboxes")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      Connect the mailbox your clients write to. Messages appear in the Inbox; nothing is\n      sent without you asking.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mailbox")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Provider")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("State")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Last synced")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_c("span", {
    staticClass: "fx-sr-only"
  }, [_vm._v("Actions")])])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/MailboxSettings.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MailboxSettings.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MailboxSettings_vue_vue_type_template_id_2f09ea5f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MailboxSettings.vue?vue&type=template&id=2f09ea5f */ "./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=template&id=2f09ea5f");
/* harmony import */ var _MailboxSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MailboxSettings.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MailboxSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MailboxSettings_vue_vue_type_template_id_2f09ea5f__WEBPACK_IMPORTED_MODULE_0__.render,
  _MailboxSettings_vue_vue_type_template_id_2f09ea5f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/MailboxSettings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=script&lang=js":
/*!*****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MailboxSettings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=template&id=2f09ea5f":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=template&id=2f09ea5f ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxSettings_vue_vue_type_template_id_2f09ea5f__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxSettings_vue_vue_type_template_id_2f09ea5f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MailboxSettings_vue_vue_type_template_id_2f09ea5f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MailboxSettings.vue?vue&type=template&id=2f09ea5f */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/MailboxSettings.vue?vue&type=template&id=2f09ea5f");


/***/ })

}]);