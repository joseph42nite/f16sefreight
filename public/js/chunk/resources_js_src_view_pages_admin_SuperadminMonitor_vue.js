"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_SuperadminMonitor_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SuperadminMonitor",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    health: null,
    checkedAt: null,
    loading: false,
    error: null,
    logLines: [],
    logPath: null,
    logSize: null,
    logLoading: false
  }),
  computed: {
    exportUrl() {
      return "/api/admin/classification-overrides/export";
    },
    queues() {
      const q = this.health && this.health.queues;
      return q && q.status === "up" ? q : null;
    },
    subsystems() {
      const h = this.health || {};
      const detail = block => {
        if (!block) return null;
        if (block.status === "down") return block.error || block.detail || "unreachable";
        if (block.latency_ms !== undefined) return block.latency_ms + " ms";
        if (block.load_1m !== undefined) return "load " + block.load_1m;
        return block.note || null;
      };
      return [{
        key: "database",
        label: "Database",
        status: (h.database || {}).status,
        detail: detail(h.database)
      }, {
        key: "redis",
        label: "Redis",
        status: (h.redis || {}).status,
        detail: detail(h.redis)
      }, {
        key: "queues",
        label: "Queues",
        status: (h.queues || {}).status,
        detail: detail(h.queues)
      }, {
        key: "ai_server",
        label: "AI server",
        status: (h.ai_server || {}).status,
        detail: detail(h.ai_server)
      }, {
        key: "host",
        label: "Host",
        status: (h.host || {}).status,
        detail: detail(h.host)
      }];
    }
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/admin/health").then(({
        data
      }) => {
        this.health = data;
        this.checkedAt = data.checked_at;
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    loadLogs() {
      this.logLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/admin/logs").then(({
        data
      }) => {
        this.logLines = data.lines || [];
        this.logPath = data.path;
        this.logSize = data.size_mb;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.logLoading = false;
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=template&id=140709fa":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=template&id=140709fa ***!
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
  return _c("div", {
    staticClass: "fx-admin"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.loading
    },
    on: {
      click: _vm.load
    }
  }, [_vm._v("\n      " + _vm._s(_vm.loading ? "Checking…" : "Refresh") + "\n    ")]), _vm._v(" "), _vm.checkedAt ? _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      Checked "), _c("Figure", {
    attrs: {
      value: _vm.checkedAt,
      kind: "dateTime"
    }
  })], 1) : _vm._e(), _vm._v(" "), _c("a", {
    staticClass: "fx-btn",
    attrs: {
      href: _vm.exportUrl,
      download: ""
    }
  }, [_vm._v("Export classification overrides")])]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("div", {
    staticClass: "fx-tiles"
  }, _vm._l(_vm.subsystems, function (s) {
    return _c("div", {
      key: s.key,
      staticClass: "fx-tile"
    }, [_c("span", {
      staticClass: "fx-tile__label"
    }, [_vm._v(_vm._s(s.label))]), _vm._v(" "), _c("span", {
      staticClass: "fx-tile__value"
    }, [_c("StatusChip", {
      attrs: {
        value: s.status
      }
    })], 1), _vm._v(" "), s.detail ? _c("p", {
      staticClass: "fx-muted fx-tile__detail"
    }, [_vm._v(_vm._s(s.detail))]) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.queues ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Queue depth")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", [_vm._l(_vm.queues.depths, function (depth, name) {
    return _c("tr", {
      key: name,
      class: {
        "is-review": depth > 100
      }
    }, [_c("td", [_vm._v(_vm._s(name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(depth))])]);
  }), _vm._v(" "), _c("tr", [_vm._m(2), _vm._v(" "), _c("td", {
    staticClass: "fx-num",
    class: {
      "fx-over": _vm.queues.failed > 0
    }
  }, [_vm._v(_vm._s(_vm.queues.failed))])])], 2)])]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Log tail")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.logLoading
    },
    on: {
      click: _vm.loadLogs
    }
  }, [_vm._v("\n      " + _vm._s(_vm.logLoading ? "Reading…" : "Read last 100 lines") + "\n    ")]), _vm._v(" "), _vm.logPath ? _c("p", {
    staticClass: "fx-muted fx-board__note"
  }, [_vm._v(_vm._s(_vm.logPath) + " · " + _vm._s(_vm.logSize) + " MB")]) : _vm._e(), _vm._v(" "), _vm.logLines.length ? _c("pre", {
    staticClass: "fx-log"
  }, [_vm._v(_vm._s(_vm.logLines.join("\n")))]) : _vm.logPath ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing in the log yet.")]) : _vm._e()])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Platform monitor")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      Infrastructure health across the platform. F16s staff only — this is not a\n      tenant view.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Queue")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Pending")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", [_c("strong", [_vm._v("Failed jobs")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuperadminMonitor.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuperadminMonitor.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SuperadminMonitor_vue_vue_type_template_id_140709fa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SuperadminMonitor.vue?vue&type=template&id=140709fa */ "./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=template&id=140709fa");
/* harmony import */ var _SuperadminMonitor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SuperadminMonitor.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SuperadminMonitor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SuperadminMonitor_vue_vue_type_template_id_140709fa__WEBPACK_IMPORTED_MODULE_0__.render,
  _SuperadminMonitor_vue_vue_type_template_id_140709fa__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/SuperadminMonitor.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=script&lang=js":
/*!*****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SuperadminMonitor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SuperadminMonitor.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SuperadminMonitor_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=template&id=140709fa":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=template&id=140709fa ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuperadminMonitor_vue_vue_type_template_id_140709fa__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuperadminMonitor_vue_vue_type_template_id_140709fa__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SuperadminMonitor_vue_vue_type_template_id_140709fa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SuperadminMonitor.vue?vue&type=template&id=140709fa */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SuperadminMonitor.vue?vue&type=template&id=140709fa");


/***/ })

}]);