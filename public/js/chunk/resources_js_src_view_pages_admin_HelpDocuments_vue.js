"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_HelpDocuments_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
/* harmony import */ var _core_config_helpTargets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/config/helpTargets */ "./resources/js/src/core/config/helpTargets.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HelpDocuments",
  components: {
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    HELP_TARGETS: _core_config_helpTargets__WEBPACK_IMPORTED_MODULE_2__.HELP_TARGETS,
    documents: [],
    unanswered: [],
    error: null,
    busy: false,
    replacing: null,
    form: {
      title: "",
      route: "",
      file: null
    }
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/help-documents").then(({
        data
      }) => {
        this.documents = data.documents || [];
        this.unanswered = data.unanswered || [];
      }).catch(e => {
        this.error = this.readable(e);
      });
    },
    upload() {
      const body = new FormData();
      body.append("title", this.form.title.trim());
      if (this.form.route.trim()) body.append("route", this.form.route.trim());
      body.append("file", this.form.file);
      this.busy = true;
      this.error = null;
      const url = this.replacing ? "/superadmin/help-documents/" + this.replacing.id : "/superadmin/help-documents";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(url, body).then(() => {
        this.resetForm();
        this.load();
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    startReplace(d) {
      this.replacing = d;
      this.form = {
        title: d.title,
        route: d.route || "",
        file: null
      };
      if (this.$refs.file) this.$refs.file.value = "";
    },
    resetForm() {
      this.replacing = null;
      this.form = {
        title: "",
        route: "",
        file: null
      };
      if (this.$refs.file) this.$refs.file.value = "";
    },
    remove(d) {
      if (!window.confirm("Delete “" + d.title + "”? The assistant stops answering from it.")) return;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]("/superadmin/help-documents/" + d.id).then(() => this.load()).catch(e => {
        this.error = this.readable(e);
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      const first = d.errors && Object.values(d.errors)[0];
      return first && first[0] || d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=template&id=2e7b4c2a":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=template&id=2e7b4c2a ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._m(0), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v(_vm._s(_vm.replacing ? "Replace “" + _vm.replacing.title + "”" : "Upload a document"))]), _vm._v(" "), _c("div", {
    staticClass: "fx-ai-settings"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Title")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.title,
      expression: "form.title"
    }],
    staticClass: "fx-input",
    attrs: {
      maxlength: "150",
      placeholder: "Inbox"
    },
    domProps: {
      value: _vm.form.title
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "title", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Page (portal path)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.route,
      expression: "form.route"
    }],
    staticClass: "fx-input",
    attrs: {
      maxlength: "150",
      placeholder: "/inbox"
    },
    domProps: {
      value: _vm.form.route
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "route", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("File (.md or .docx)")]), _vm._v(" "), _c("input", {
    ref: "file",
    staticClass: "fx-input",
    attrs: {
      type: "file",
      accept: ".md,.markdown,.docx"
    },
    on: {
      change: function ($event) {
        _vm.form.file = $event.target.files[0] || null;
      }
    }
  })])]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.form.file || !_vm.form.title.trim()
    },
    on: {
      click: _vm.upload
    }
  }, [_vm._v("\n      " + _vm._s(_vm.busy ? "Uploading and indexing…" : _vm.replacing ? "Replace" : "Upload") + "\n    ")]), _vm._v(" "), _vm.replacing ? _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.resetForm
    }
  }, [_vm._v("Cancel")]) : _vm._e()]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Library")]), _vm._v(" "), !_vm.documents.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No documents yet — the assistant will say it cannot help until there are.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.documents, function (d) {
    return _c("tr", {
      key: d.id
    }, [_c("td", [_vm._v(_vm._s(d.title))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(d.route || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(d.filename))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(d.chunk_count))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: d.status === "indexed" ? "indexed" : "not indexed"
      }
    }), _vm._v(" "), d.error ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" " + _vm._s(d.error))]) : _vm._e()], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.startReplace(d);
        }
      }
    }, [_vm._v("Replace")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.remove(d);
        }
      }
    }, [_vm._v("Delete")])])]);
  }), 0)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Questions it could not answer (last 30 days)")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Each is a page or a task the library does not cover yet.")]), _vm._v(" "), !_vm.unanswered.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("None.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(2), _vm._v(" "), _c("tbody", _vm._l(_vm.unanswered, function (q) {
    return _c("tr", {
      key: q.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(q.route || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(q.question))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(q.best_score === null ? "—" : Number(q.best_score).toFixed(2)))])]);
  }), 0)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Controls a document can point at")]), _vm._v(" "), _vm._m(3), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(4), _vm._v(" "), _c("tbody", _vm._l(_vm.HELP_TARGETS, function (t) {
    return _c("tr", {
      key: t.name
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v("[[" + _vm._s(t.name) + "]]")]), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(t.page || "every page"))]), _c("td", [_vm._v(_vm._s(t.label))])]);
  }), 0)])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Help documents")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      What the portal's help assistant answers from. Upload one .md or .docx per page; uploading a\n      file again replaces that document. Use headings for each task — the assistant finds the section.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Title")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Page")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("File")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Sections")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("State")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_c("span", {
    staticClass: "fx-sr-only"
  }, [_vm._v("Actions")])])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Asked on")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Question")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Closest match")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Write "), _c("code", [_vm._v("[[name]]")]), _vm._v(" next to the step, e.g. "), _c("code", [_vm._v("[[save-draft]] Click Save as draft")]), _vm._v(". Any other name is ignored.")]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Name")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Page")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("What it is")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/HelpDocuments.vue":
/*!*************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/HelpDocuments.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HelpDocuments_vue_vue_type_template_id_2e7b4c2a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HelpDocuments.vue?vue&type=template&id=2e7b4c2a */ "./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=template&id=2e7b4c2a");
/* harmony import */ var _HelpDocuments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HelpDocuments.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HelpDocuments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HelpDocuments_vue_vue_type_template_id_2e7b4c2a__WEBPACK_IMPORTED_MODULE_0__.render,
  _HelpDocuments_vue_vue_type_template_id_2e7b4c2a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/HelpDocuments.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpDocuments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HelpDocuments.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpDocuments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=template&id=2e7b4c2a":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=template&id=2e7b4c2a ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpDocuments_vue_vue_type_template_id_2e7b4c2a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpDocuments_vue_vue_type_template_id_2e7b4c2a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpDocuments_vue_vue_type_template_id_2e7b4c2a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HelpDocuments.vue?vue&type=template&id=2e7b4c2a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/HelpDocuments.vue?vue&type=template&id=2e7b4c2a");


/***/ })

}]);