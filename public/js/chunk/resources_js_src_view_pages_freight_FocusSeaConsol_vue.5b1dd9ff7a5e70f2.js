"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_FocusSeaConsol_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusSeaConsol",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    masters: [],
    candidates: [],
    consol: null,
    masterId: "",
    linkId: "",
    loading: false,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["designation"])), {}, {
    canWrite() {
      return this.designation === "operations";
    }
  }),
  created() {
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/jobs?transport_mode=sea").then(({
      data
    }) => {
      this.masters = (data.data || []).filter(j => j.transport_mode === "sea");
    }).catch(e => {
      this.error = this.readable(e);
    });
  },
  methods: {
    load() {
      if (!this.masterId) return;
      this.loading = true;
      Promise.all([_core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.masterId}/consol`), _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/jobs/unassociated?transport_mode=sea")]).then(([consol, free]) => {
        this.consol = consol.data;
        /* A master cannot be its own house — filtered here as well as refused
           server-side, so the picker never offers an impossible link. */
        this.candidates = (free.data.data || []).filter(j => String(j.id) !== String(this.masterId));
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    stuffed(containerId, houseId) {
      const row = this.consol.stuffing.find(s => s.container_id === containerId && s.job_id === houseId);
      return row ? row.piece_count : 0;
    },
    allocated(houseId) {
      return this.consol.stuffing.filter(s => s.job_id === houseId).reduce((n, s) => n + Number(s.piece_count), 0);
    },
    link() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.masterId}/link-hbl`, {
        house_id: this.linkId
      }).then(({
        data
      }) => {
        this.consol = data;
        this.linkId = "";
        this.load();
      })
      /* §11.3 the server's reason verbatim — "already belongs to another consol"
         tells the operator where to go; "link failed" does not. */.catch(e => {
        this.actionError = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    unlink(house) {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](`/jobs/${this.masterId}/link-hbl/${house.id}`).then(({
        data
      }) => {
        this.consol = data;
        this.load();
      }).catch(e => {
        this.actionError = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    stuff(containerId, houseId, value) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.masterId}/stuff`, {
        container_id: containerId,
        house_id: houseId,
        piece_count: Number(value) || 0
      }).then(({
        data
      }) => {
        this.consol = data;
      }).catch(e => {
        this.actionError = this.readable(e);
        this.load();
      }).finally(() => {
        this.busy = false;
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=template&id=7041abcd":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=template&id=7041abcd ***!
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
  return _c("div", [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Master")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.masterId,
      expression: "masterId"
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
        _vm.masterId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.masters, function (m) {
    return _c("option", {
      key: m.id,
      domProps: {
        value: m.id
      }
    }, [_vm._v("\n          " + _vm._s(m.execution_job_no || "Job " + m.id) + "\n        ")]);
  })], 2)])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm.consol ? [!_vm.consol.reconciliation.balanced && _vm.consol.houses.length ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      Houses declare " + _vm._s(_vm.consol.reconciliation.house_pieces) + " pieces against a master of\n      " + _vm._s(_vm.consol.reconciliation.master_pieces) + ". Customs refuses a manifest where these differ.\n    ")]) : _vm.consol.reconciliation.unstuffed > 0 ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      " + _vm._s(_vm.consol.reconciliation.unstuffed) + " piece(s) are not yet allocated to a container.\n    ")]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("House bills (" + _vm._s(_vm.consol.houses.length) + ")")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Job")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("HBL")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Customer")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Pieces")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Weight")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Volume")]), _vm._v(" "), _vm.canWrite ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.consol.houses, function (h) {
    return _c("tr", {
      key: h.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(h.execution_job_no || h.id))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [h.hbl_number ? _c("span", [_vm._v(_vm._s(h.hbl_number))]) : _c("span", {
      staticClass: "is-empty",
      attrs: {
        "aria-label": "No HBL number"
      }
    })]), _vm._v(" "), _c("td", [_vm._v(_vm._s(h.customer || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: h.piece_count,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: h.gross_weight,
        kind: "weight"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: h.volume_cbm,
        kind: "volume"
      }
    })], 1), _vm._v(" "), _vm.canWrite ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.unlink(h);
        }
      }
    }, [_vm._v("Unlink")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.consol.houses.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: _vm.canWrite ? 7 : 6
    }
  }, [_vm._v("No houses linked yet.")])]) : _vm._e()], 2)])]), _vm._v(" "), _vm.canWrite ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Link a house")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Unassociated shipments")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.linkId,
      expression: "linkId"
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
        _vm.linkId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.candidates, function (j) {
    return _c("option", {
      key: j.id,
      domProps: {
        value: j.id
      }
    }, [_vm._v("\n              " + _vm._s(j.execution_job_no || "Job " + j.id) + "\n            ")]);
  })], 2)]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: !_vm.linkId || _vm.busy
    },
    on: {
      click: _vm.link
    }
  }, [_vm._v("Link HBL")])]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Container stuffing")]), _vm._v(" "), !_vm.consol.containers.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        No containers on this master yet. Add them on the FocusSea document, Container tab.\n      ")]) : _c("table", {
    staticClass: "fx-table fx-matrix"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("House")]), _vm._v(" "), _vm._l(_vm.consol.containers, function (c) {
    return _c("th", {
      key: c.id,
      staticClass: "fx-num",
      attrs: {
        scope: "col"
      }
    }, [_c("span", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(c.container_number))])]);
  }), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Allocated / declared")])], 2)]), _vm._v(" "), _c("tbody", [_vm._l(_vm.consol.houses, function (h) {
    return _c("tr", {
      key: h.id
    }, [_c("th", {
      staticClass: "identifier",
      attrs: {
        scope: "row"
      }
    }, [_vm._v(_vm._s(h.execution_job_no || h.id))]), _vm._v(" "), _vm._l(_vm.consol.containers, function (c) {
      return _c("td", {
        key: c.id,
        staticClass: "fx-num"
      }, [_c("input", {
        staticClass: "fx-input fx-input--cell",
        attrs: {
          type: "number",
          min: "0",
          disabled: !_vm.canWrite || _vm.busy
        },
        domProps: {
          value: _vm.stuffed(c.id, h.id)
        },
        on: {
          change: e => _vm.stuff(c.id, h.id, e.target.value)
        }
      })]);
    }), _vm._v(" "), _c("td", {
      staticClass: "fx-num",
      class: {
        "fx-over": _vm.allocated(h.id) > h.piece_count
      }
    }, [_vm._v("\n              " + _vm._s(_vm.allocated(h.id)) + " / " + _vm._s(h.piece_count) + "\n            ")])], 2);
  }), _vm._v(" "), !_vm.consol.houses.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: _vm.consol.containers.length + 2
    }
  }, [_vm._v("Link a house first.")])]) : _vm._e()], 2)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-board__note"
  }, [_vm._v("\n        Pieces only — the stuffing table has no weight or volume columns (GAPS #32).\n      ")])])] : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("FocusSea — Consolidation")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("Link house bills to a master and allocate their cargo into containers.")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaConsol.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaConsol.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusSeaConsol_vue_vue_type_template_id_7041abcd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusSeaConsol.vue?vue&type=template&id=7041abcd */ "./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=template&id=7041abcd");
/* harmony import */ var _FocusSeaConsol_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusSeaConsol.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FocusSeaConsol_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusSeaConsol_vue_vue_type_template_id_7041abcd__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusSeaConsol_vue_vue_type_template_id_7041abcd__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/FocusSeaConsol.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaConsol_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaConsol.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaConsol_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=template&id=7041abcd":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=template&id=7041abcd ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaConsol_vue_vue_type_template_id_7041abcd__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaConsol_vue_vue_type_template_id_7041abcd__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaConsol_vue_vue_type_template_id_7041abcd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaConsol.vue?vue&type=template&id=7041abcd */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaConsol.vue?vue&type=template&id=7041abcd");


/***/ })

}]);