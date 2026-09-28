"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_DomainDirectory_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");

const STATUSES = [{
  key: "proposed",
  label: "Waiting"
}, {
  key: "approved",
  label: "Live"
}, {
  key: "rejected",
  label: "Refused"
}];
const LABELS = {
  customer_enquiry: "Customer enquiry",
  airline: "Airline",
  shipping_line: "Shipping line",
  clearance: "Clearance",
  trucking_road: "Trucking",
  other: "Other"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "DomainDirectory",
  data: () => ({
    STATUSES,
    status: "proposed",
    rows: [],
    counts: {},
    classifications: [],
    chosen: {},
    loading: true,
    promoting: false,
    busy: null,
    error: null
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      this.error = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/domain-directory?status=" + this.status).then(({
        data
      }) => {
        this.rows = data.rows || [];
        this.counts = data.counts || {};
        this.classifications = data.classifications || [];

        /* Pre-selected to what was proposed, so approving without touching the dropdown
           accepts the proposal as-is — the common case should take one click. */
        const chosen = {};
        this.rows.forEach(r => {
          chosen[r.id] = r.classification;
        });
        this.chosen = chosen;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    select(status) {
      this.status = status;
      this.load();
    },
    label(key) {
      return LABELS[key] || key;
    },
    approve(row) {
      this.busy = row.id;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/domain-directory/" + row.id + "/approve", {
        classification: this.chosen[row.id]
      }).then(() => this.load()).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.busy = null;
      });
    },
    reject(row) {
      /* 🔴 Confirmed, because a rejection is remembered. The row is kept as refused so the
         next partner added for that domain does not re-propose it — which means undoing it
         is not simply a matter of adding the partner again. */
      const note = window.prompt("Refuse " + row.domain + "?\n\nThis is remembered — the domain will not be " + "proposed again. Add a note for whoever reads this later:", "");
      if (note === null) return;
      this.busy = row.id;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/domain-directory/" + row.id + "/reject", {
        note
      }).then(() => this.load()).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.busy = null;
      });
    },
    promote() {
      this.promoting = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/superadmin/domain-directory/promote").then(() => this.load()).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.promoting = false;
      });
    },
    stamp(value) {
      const d = new Date(value);
      return isNaN(d) ? String(value) : d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=template&id=5863637d":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=template&id=5863637d ***!
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
    staticClass: "container-fluid py-4"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "btn-group mb-3",
    attrs: {
      role: "group",
      "aria-label": "Filter by status"
    }
  }, _vm._l(_vm.STATUSES, function (s) {
    return _c("button", {
      key: s.key,
      staticClass: "btn",
      class: _vm.status === s.key ? "btn-primary" : "btn-outline-secondary",
      attrs: {
        type: "button"
      },
      on: {
        click: function ($event) {
          return _vm.select(s.key);
        }
      }
    }, [_vm._v("\n      " + _vm._s(s.label) + "\n      "), _c("span", {
      staticClass: "badge bg-light text-dark ml-1"
    }, [_vm._v(_vm._s(_vm.counts[s.key] || 0))])]);
  }), 0), _vm._v(" "), _c("button", {
    staticClass: "btn btn-outline-secondary btn-sm mb-3 ml-2",
    attrs: {
      disabled: _vm.promoting
    },
    on: {
      click: _vm.promote
    }
  }, [_vm._v("\n    " + _vm._s(_vm.promoting ? "Checking…" : "Check for new agreement") + "\n  ")]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "alert alert-danger"
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "text-muted"
  }, [_vm._v("Loading…")]) : !_vm.rows.length ? _c("p", {
    staticClass: "text-muted"
  }, [_vm.status === "proposed" ? [_vm._v("\n      Nothing waiting. Domains appear here when a partner is added with an email address,\n      or when several tenants correct the same domain the same way.\n    ")] : [_vm._v("Nothing here.")]], 2) : _c("table", {
    staticClass: "table table-sm align-middle"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: row.id
    }, [_c("td", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(row.domain))]), _vm._v(" "), _c("td", [row.status === "proposed" ? _c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.chosen[row.id],
        expression: "chosen[row.id]"
      }],
      staticClass: "form-control form-control-sm",
      staticStyle: {
        width: "auto",
        display: "inline-block"
      },
      on: {
        change: function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(_vm.chosen, row.id, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, _vm._l(_vm.classifications, function (c) {
      return _c("option", {
        key: c,
        domProps: {
          value: c
        }
      }, [_vm._v(_vm._s(_vm.label(c)))]);
    }), 0) : _c("span", [_vm._v(_vm._s(_vm.label(row.classification)))])]), _vm._v(" "), _c("td", [_c("span", {
      staticClass: "badge",
      class: row.source === "partner" ? "badge-info" : "badge-secondary"
    }, [_vm._v("\n            " + _vm._s(row.source === "partner" ? "a partner record" : "tenants agreeing") + "\n          ")])]), _vm._v(" "), _c("td", {
      staticClass: "text-right"
    }, [_vm._v(_vm._s(row.confirmations))]), _vm._v(" "), _c("td", [row.reviewed_at ? _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v("\n            " + _vm._s(row.reviewed_by_name || "—")), _c("br"), _vm._v("\n            " + _vm._s(_vm.stamp(row.reviewed_at)) + "\n            "), row.review_note ? _c("em", {
      staticClass: "d-block"
    }, [_vm._v("“" + _vm._s(row.review_note) + "”")]) : _vm._e()]) : _c("span", {
      staticClass: "text-muted"
    }, [_vm._v("—")])]), _vm._v(" "), _c("td", {
      staticClass: "text-right text-nowrap"
    }, [row.status === "proposed" ? [_c("button", {
      staticClass: "btn btn-sm btn-success",
      attrs: {
        disabled: _vm.busy === row.id
      },
      on: {
        click: function ($event) {
          return _vm.approve(row);
        }
      }
    }, [_vm._v("\n              Approve\n            ")]), _vm._v(" "), _c("button", {
      staticClass: "btn btn-sm btn-outline-danger",
      attrs: {
        disabled: _vm.busy === row.id
      },
      on: {
        click: function ($event) {
          return _vm.reject(row);
        }
      }
    }, [_vm._v("\n              Reject\n            ")])] : row.status === "rejected" ? _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v("refused")]) : _c("span", {
      staticClass: "text-success small"
    }, [_vm._v("classifying")])], 2)]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "mb-4"
  }, [_c("h1", {
    staticClass: "h4 mb-1"
  }, [_vm._v("Domain directory")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted mb-0"
  }, [_vm._v("\n      What the platform has learned about who owns which email domain. Approving an entry\n      applies it to "), _c("strong", [_vm._v("every tenant")]), _vm._v(" — so nothing here classifies anybody's\n      mail until you say so.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Domain")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Classify as")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Learned from")]), _vm._v(" "), _c("th", {
    staticClass: "text-right",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Tenants")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Reviewed")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_c("span", {
    staticClass: "sr-only"
  }, [_vm._v("Actions")])])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/DomainDirectory.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/DomainDirectory.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DomainDirectory_vue_vue_type_template_id_5863637d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DomainDirectory.vue?vue&type=template&id=5863637d */ "./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=template&id=5863637d");
/* harmony import */ var _DomainDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DomainDirectory.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DomainDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DomainDirectory_vue_vue_type_template_id_5863637d__WEBPACK_IMPORTED_MODULE_0__.render,
  _DomainDirectory_vue_vue_type_template_id_5863637d__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/DomainDirectory.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DomainDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DomainDirectory.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DomainDirectory_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=template&id=5863637d":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=template&id=5863637d ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DomainDirectory_vue_vue_type_template_id_5863637d__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DomainDirectory_vue_vue_type_template_id_5863637d__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DomainDirectory_vue_vue_type_template_id_5863637d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DomainDirectory.vue?vue&type=template&id=5863637d */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/DomainDirectory.vue?vue&type=template&id=5863637d");


/***/ })

}]);