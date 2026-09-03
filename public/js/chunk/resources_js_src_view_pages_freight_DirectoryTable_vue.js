"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_DirectoryTable_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");


const SHAPES = {
  "/customers": {
    title: "Customers",
    subtitle: "Shared across every branch of this tenant. A client with several branches is several rows sharing one email domain — that pair is the group key.",
    searchPlaceholder: "Name, domain or GSTIN…",
    columns: [{
      key: "name",
      label: "Name"
    }, {
      key: "email_domain",
      label: "Domain",
      mono: true
    }, {
      key: "gst_no",
      label: "GSTIN",
      mono: true
    }, {
      key: "payment_terms_days",
      label: "Terms (days)",
      numeric: true,
      kind: "count"
    }, {
      key: "credit_limit",
      label: "Credit limit",
      numeric: true,
      kind: "currency"
    }]
  },
  "/partners": {
    title: "Partners",
    subtitle: "Carriers, brokers, transporters and vendors. One partner can act in several roles across shipments — the type here is only the primary classification.",
    searchPlaceholder: "Name…",
    columns: [{
      key: "name",
      label: "Name"
    }, {
      key: "partner_type",
      label: "Type"
    }, {
      key: "email",
      label: "Email"
    }, {
      key: "phone",
      label: "Phone",
      mono: true
    }, {
      key: "gst_no",
      label: "GSTIN",
      mono: true
    }]
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "DirectoryTable",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  data: () => ({
    rows: [],
    types: [],
    loading: true,
    error: null,
    query: "",
    type: "",
    timer: null,
    adding: false,
    saving: false,
    saveError: null,
    copied: false,
    siblings: [],
    form: {
      name: "",
      partner_type: "customs_broker",
      email: "",
      phone: "",
      address: "",
      gst_no: "",
      pan_no: ""
    }
  }),
  computed: {
    shape() {
      return SHAPES[this.endpoint];
    },
    title() {
      return this.shape.title;
    },
    subtitle() {
      return this.shape.subtitle;
    },
    columns() {
      return this.shape.columns;
    },
    searchPlaceholder() {
      return this.shape.searchPlaceholder;
    }
  },
  created() {
    this.load();
    if (this.endpoint === "/partners") {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partner-types").then(({
        data
      }) => {
        this.types = data.types || [];
      }).catch(() => {/* the filter is optional; its absence must not break the list */});

      /* What sibling branches already have, for the copy picker. Optional in the same
         way — a picker that cannot load costs a retype, not the ability to add. */
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners/siblings").then(({
        data
      }) => {
        this.siblings = data.partners || [];
      }).catch(() => {
        this.siblings = [];
      });
    }
  },
  methods: {
    /**
     * Copy a sibling branch's partner — everything EXCEPT the tax numbers.
     *
     * 🔴 `gst_no` and `pan_no` are deliberately left blank. The other branch's GSTIN is
     * another state's registration; carrying it across is exactly the error that made
     * partners branch-scoped in the first place, and it would be invisible until a
     * purchase voucher claimed input credit under the wrong number.
     */
    copySibling(id) {
      const source = this.siblings.find(p => String(p.id) === String(id));
      if (!source) {
        this.copied = false;
        return;
      }
      this.form = {
        name: source.name,
        partner_type: source.partner_type,
        email: source.email || "",
        phone: source.phone || "",
        address: source.address || "",
        gst_no: "",
        pan_no: ""
      };
      this.copied = true;
    },
    save() {
      this.saving = true;
      this.saveError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/partners", this.form).then(() => {
        this.adding = false;
        this.copied = false;
        this.form = {
          name: "",
          partner_type: "customs_broker",
          email: "",
          phone: "",
          address: "",
          gst_no: "",
          pan_no: ""
        };
        this.load();
      }).catch(e => {
        const d = e.response && e.response.data || {};
        this.saveError = d.errors ? Object.values(d.errors).flat().join(" ") : d.error || d.message || "Could not save.";
      }).finally(() => {
        this.saving = false;
      });
    },
    /* Debounced so a search does not fire a request per keystroke. */
    debouncedLoad() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.load, 250);
    },
    load() {
      this.loading = true;
      const params = [];
      if (this.query) params.push("q=" + encodeURIComponent(this.query));
      if (this.type) params.push("type=" + encodeURIComponent(this.type));
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(this.endpoint + (params.length ? "?" + params.join("&") : "")).then(({
        data
      }) => {
        this.rows = data.data || [];
        this.error = null;
      }).catch(e => {
        const d = e.response && e.response.data || {};
        this.error = d.error || d.message || "Something went wrong.";
      }).finally(() => {
        this.loading = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=template&id=f9a939ae":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=template&id=f9a939ae ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v(_vm._s(_vm.subtitle))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Search")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.query,
      expression: "query"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "search",
      placeholder: _vm.searchPlaceholder
    },
    domProps: {
      value: _vm.query
    },
    on: {
      input: [function ($event) {
        if ($event.target.composing) return;
        _vm.query = $event.target.value;
      }, _vm.debouncedLoad]
    }
  })]), _vm._v(" "), _vm.endpoint === "/partners" ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.type,
      expression: "type"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.type = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All")]), _vm._v(" "), _vm._l(_vm.types, function (t) {
    return _c("option", {
      key: t,
      domProps: {
        value: t
      }
    }, [_vm._v(_vm._s(t.replace(/_/g, " ")))]);
  })], 2)]) : _vm._e()]), _vm._v(" "), _vm.endpoint === "/partners" ? _c("button", {
    staticClass: "fx-btn fx-btn--primary fx-dir__add",
    on: {
      click: function ($event) {
        _vm.adding = !_vm.adding;
      }
    }
  }, [_vm._v(_vm._s(_vm.adding ? "Cancel" : "Add partner"))]) : _vm._e(), _vm._v(" "), _vm.adding && _vm.endpoint === "/partners" ? _c("section", {
    staticClass: "fx-section fx-dir__form"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Already used by another branch")]), _vm._v(" "), _c("select", {
    staticClass: "fx-input",
    domProps: {
      value: ""
    },
    on: {
      change: function ($event) {
        return _vm.copySibling($event.target.value);
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Start from blank…")]), _vm._v(" "), _vm._l(_vm.siblings, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v("\n          " + _vm._s(p.name) + " · " + _vm._s(p.partner_type.replace(/_/g, " ")) + "\n        ")]);
  })], 2)]), _vm._v(" "), _c("div", {
    staticClass: "fx-dir__grid"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Name")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.name,
      expression: "form.name"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.name
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "name", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.partner_type,
      expression: "form.partner_type"
    }],
    staticClass: "fx-input",
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.form, "partner_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.types, function (t) {
    return _c("option", {
      key: t,
      domProps: {
        value: t
      }
    }, [_vm._v(_vm._s(t.replace(/_/g, " ")))]);
  }), 0)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Email")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.email,
      expression: "form.email"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "email"
    },
    domProps: {
      value: _vm.form.email
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "email", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Phone")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.phone,
      expression: "form.phone"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.phone
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "phone", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("GSTIN (this state)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.gst_no,
      expression: "form.gst_no"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.gst_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "gst_no", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("PAN")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.pan_no,
      expression: "form.pan_no"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.pan_no
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "pan_no", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Address")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.address,
      expression: "form.address"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.address
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "address", $event.target.value);
      }
    }
  })]), _vm._v(" "), _vm.copied ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      Copied from another branch — "), _c("strong", [_vm._v("enter this branch's own GSTIN")]), _vm._v("; the\n      other branch's is a different state registration.\n    ")]) : _vm._e(), _vm._v(" "), _vm.saveError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.saveError))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.saving || !_vm.form.name
    },
    on: {
      click: _vm.save
    }
  }, [_vm._v("\n      " + _vm._s(_vm.saving ? "Saving…" : "Save partner") + "\n    ")])]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing matches.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", _vm._l(_vm.columns, function (c) {
    return _c("th", {
      key: c.key,
      class: {
        "fx-num": c.numeric
      },
      attrs: {
        scope: "col"
      }
    }, [_vm._v(_vm._s(c.label))]);
  }), 0)]), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: row.id
    }, _vm._l(_vm.columns, function (c) {
      return _c("td", {
        key: c.key,
        class: [{
          "fx-num": c.numeric
        }, c.mono ? "identifier" : ""]
      }, [c.kind ? _c("Figure", {
        attrs: {
          value: row[c.key],
          kind: c.kind,
          "currency-code": c.kind === "currency" ? "INR" : null
        }
      }) : row[c.key] ? _c("span", [_vm._v(_vm._s(row[c.key]))]) : _c("span", {
        staticClass: "is-empty",
        attrs: {
          "aria-label": "Not recorded"
        }
      })], 1);
    }), 0);
  }), 0)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/DirectoryTable.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/DirectoryTable.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DirectoryTable_vue_vue_type_template_id_f9a939ae__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DirectoryTable.vue?vue&type=template&id=f9a939ae */ "./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=template&id=f9a939ae");
/* harmony import */ var _DirectoryTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DirectoryTable.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DirectoryTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DirectoryTable_vue_vue_type_template_id_f9a939ae__WEBPACK_IMPORTED_MODULE_0__.render,
  _DirectoryTable_vue_vue_type_template_id_f9a939ae__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/DirectoryTable.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DirectoryTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DirectoryTable.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DirectoryTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=template&id=f9a939ae":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=template&id=f9a939ae ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DirectoryTable_vue_vue_type_template_id_f9a939ae__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DirectoryTable_vue_vue_type_template_id_f9a939ae__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DirectoryTable_vue_vue_type_template_id_f9a939ae__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DirectoryTable.vue?vue&type=template&id=f9a939ae */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/DirectoryTable.vue?vue&type=template&id=f9a939ae");


/***/ })

}]);