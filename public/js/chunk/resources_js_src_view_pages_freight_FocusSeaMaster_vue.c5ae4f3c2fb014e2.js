"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_FocusSeaMaster_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Field_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Field.vue */ "./resources/js/src/view/pages/freight/components/Field.vue");
/* harmony import */ var _view_pages_freight_components_EntityPanel_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/EntityPanel.vue */ "./resources/js/src/view/pages/freight/components/EntityPanel.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





/* PRD §5.8 — twelve tabs, in the document's own order. */
const TABS = [{
  n: 1,
  key: "entity",
  label: "Entity"
}, {
  n: 2,
  key: "shipping",
  label: "Shipping Dtls."
}, {
  n: 3,
  key: "routing",
  label: "Routing"
}, {
  n: 4,
  key: "goods",
  label: "Goods Dtls."
}, {
  n: 5,
  key: "item",
  label: "Item"
}, {
  n: 6,
  key: "bl",
  label: "BL Info"
}, {
  n: 7,
  key: "container",
  label: "Container"
}, {
  n: 8,
  key: "pickup",
  label: "Pick Up",
  source: "haulage details"
}, {
  n: 9,
  key: "charges",
  label: "Charges",
  source: "the cost sheet"
}, {
  n: 10,
  key: "financials",
  label: "Financials",
  source: "aggregates"
}, {
  n: 11,
  key: "customs",
  label: "Customs"
}, {
  n: 12,
  key: "edocket",
  label: "E-Docket",
  source: "job_documents"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusSeaMaster",
  components: {
    Field: _view_pages_freight_components_Field_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    EntityPanel: _view_pages_freight_components_EntityPanel_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    jobs: [],
    jobId: "",
    jobNo: null,
    form: {},
    containers: [],
    locking: {},
    vocab: {
      cargo_types: [],
      container_types: []
    },
    violations: [],
    tab: "shipping",
    loading: false,
    saving: false,
    error: null,
    saveError: null,
    TABS
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)(["designation"])), {}, {
    /* Operations writes the manifest; pricing reads it. The server re-checks. */
    canWrite() {
      return this.designation === "operations";
    },
    tabLabel() {
      const t = TABS.find(x => x.key === this.tab);
      return t ? t.label : this.tab;
    },
    tabSource() {
      const t = TABS.find(x => x.key === this.tab);
      return t && t.source || "another record";
    },
    hasBadBox() {
      return this.containers.some(c => c.number && !this.isValidBox(c.number));
    }
  }),
  watch: {
    /* The matrix, applied immediately. Clearing containers here mirrors what the
       server would refuse, so the operator is never left holding a payload that
       cannot save. */
    "form.cargo_type": function (type) {
      const containerised = type === "fcl" || type === "liquid_cont";
      this.locking = {
        delivery_mode: containerised ? "fcl" : type === "lcl" ? "lcl" : null,
        containers_enabled: containerised,
        dimensions_required: type === "lcl"
      };
      if (!containerised) this.containers = [];
    }
  },
  created() {
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/jobs?transport_mode=sea").then(({
      data
    }) => {
      this.jobs = (data.data || []).filter(j => j.transport_mode === "sea");
    }).catch(e => {
      this.error = this.readable(e);
    });
  },
  methods: {
    labelOf(v) {
      return String(v || "").replace(/_/g, " ");
    },
    /**
     * ISO 6346 — four letters, six digits, one check digit.
     *
     * 🔴 The same computation the server and the manifest filer run. A mistyped
     * container number is rejected at the TERMINAL GATE, not at filing, so catching
     * it while the operator is still typing is the difference between a correction
     * and a truck turned away.
     */
    isValidBox(raw) {
      const n = String(raw || "").toUpperCase().trim();
      if (!/^[A-Z]{4}\d{7}$/.test(n)) return false;
      let sum = 0;
      for (let i = 0; i < 10; i++) {
        const ch = n[i];
        let v;
        if (/[A-Z]/.test(ch)) {
          v = ch.charCodeAt(0) - 65 + 10;
          /* The letter table skips 11, 22 and 33. */
          [11, 22, 33].forEach(skip => {
            if (v >= skip) v++;
          });
        } else {
          v = Number(ch);
        }
        sum += v * Math.pow(2, i);
      }
      return sum % 11 % 10 === Number(n[10]);
    },
    load() {
      if (!this.jobId) return;
      this.loading = true;
      this.saveError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.jobId}/sea-shipment`).then(({
        data
      }) => {
        this.jobNo = data.job.execution_job_no;
        this.form = Object.assign({
          cargo_type: data.job.cargo_type
        }, data.details || {});
        this.containers = (data.containers || []).map(c => ({
          number: c.container_number,
          seal: c.seal_number
        }));
        this.locking = data.locking;
        this.vocab = data.vocabulary;
        this.violations = data.violations || [];
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    isTabLocked(key) {
      return key === "container" && !this.locking.containers_enabled;
    },
    save() {
      this.saving = true;
      this.saveError = null;
      const payload = Object.assign({}, this.form);
      delete payload.id;
      delete payload.job_id;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.deleted_at;
      if (this.locking.containers_enabled) {
        payload.containers = this.containers.filter(c => c.number).map(c => ({
          container_number: c.number,
          seal_number: c.seal || null
        }));
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.jobId}/sea-shipment`, payload).then(({
        data
      }) => {
        this.violations = data.violations || [];
        this.locking = data.locking;
      })
      /* §11.3 — the server's reason, verbatim. "Container CSQU3054384 fails the ISO
         6346 check digit" tells the operator what to do; "save failed" does not. */.catch(e => {
        this.saveError = this.readable(e);
      }).finally(() => {
        this.saving = false;
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "EntityPanel",
  props: {
    jobId: {
      type: [Number, String],
      required: true
    }
  },
  data: () => ({
    entities: [],
    roles: [],
    expected: {},
    document: "house",
    customers: [],
    partners: [],
    draft: {
      role: "shipper",
      party_type: "customer",
      party_id: "",
      custom_role_label: ""
    },
    loading: true,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(["designation"])), {}, {
    canWrite() {
      return this.designation === "operations";
    },
    /* The mapped roles fix the party type; the rest let the operator choose. */
    partyType() {
      const e = this.expected[this.draft.role];
      return e ? e.party_type : this.draft.party_type;
    },
    options() {
      return this.partyType === "customer" ? this.customers : this.partners;
    }
  }),
  created() {
    this.load();
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/customers").then(({
      data
    }) => {
      this.customers = data.data || [];
    }).catch(() => {});
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners").then(({
      data
    }) => {
      this.partners = data.data || [];
    }).catch(() => {});
  },
  methods: {
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.jobId}/entities`).then(({
        data
      }) => {
        this.entities = data.entities || [];
        this.roles = data.roles || [];
        this.expected = data.expected || {};
        this.document = data.document;
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    onRole() {
      this.draft.party_id = "";
    },
    add() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.jobId}/entities`, {
        role: this.draft.role,
        party_type: this.partyType,
        party_id: this.draft.party_id,
        custom_role_label: this.draft.custom_role_label || null
      }).then(({
        data
      }) => {
        this.entities = data.entities;
        this.draft.party_id = "";
        this.draft.custom_role_label = "";
      })
      /* §11.3 — "On a master bill, the shipper is the forwarder branch itself, not a
         customer" is the whole explanation. A generic failure would leave the
         operator guessing which of three fields was wrong. */.catch(e => {
        this.actionError = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    remove(entity) {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](`/jobs/${this.jobId}/entities/${entity.id}`).then(({
        data
      }) => {
        this.entities = data.entities;
      }).catch(e => {
        this.actionError = this.readable(e);
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/Field.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/Field.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Field",
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "text"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    mono: {
      type: Boolean,
      default: false
    },
    hint: {
      type: String,
      default: null
    }
  },
  methods: {
    /* An empty numeric field is NULL, not 0 — §4.1. "Not recorded" and "weighs
       nothing" are different claims on a customs document. */
    toNumber(v) {
      return v === "" ? null : Number(v);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761 ***!
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
  }, [_vm._v("FocusSea — Master Bill of Lading")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm.jobNo ? _c("span", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.jobNo))]) : _c("span", [_vm._v("Select a sea shipment to open its document.")])])]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Shipment")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.jobId,
      expression: "jobId"
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
        _vm.jobId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.jobs, function (j) {
    return _c("option", {
      key: j.id,
      domProps: {
        value: j.id
      }
    }, [_vm._v("\n          " + _vm._s(j.execution_job_no || "Job " + j.id) + "\n        ")]);
  })], 2)]), _vm._v(" "), _vm.jobId ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Cargo type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.cargo_type,
      expression: "form.cargo_type"
    }],
    staticClass: "fx-input",
    attrs: {
      disabled: !_vm.canWrite
    },
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.form, "cargo_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.vocab.cargo_types, function (c) {
    return _c("option", {
      key: c,
      domProps: {
        value: c
      }
    }, [_vm._v(_vm._s(_vm.labelOf(c)))]);
  }), 0)]) : _vm._e(), _vm._v(" "), _vm.jobId ? _c("div", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Delivery mode")]), _vm._v(" "), _c("span", {
    staticClass: "fx-input fx-input--static"
  }, [_vm._v(_vm._s(_vm.locking.delivery_mode || "—"))])]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm.jobId ? [_vm.violations.length ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      " + _vm._s(_vm.violations.length) + " issue" + _vm._s(_vm.violations.length === 1 ? "" : "s") + " would fail\n      structural validation at filing:\n      "), _vm._l(_vm.violations, function (v, i) {
    return _c("span", {
      key: i
    }, [_vm._v(" · " + _vm._s(v.message))]);
  })], 2) : _vm._e(), _vm._v(" "), _c("nav", {
    staticClass: "fx-drawer__tabs",
    attrs: {
      role: "tablist",
      "aria-label": "Document sections"
    }
  }, _vm._l(_vm.TABS, function (t) {
    return _c("button", {
      key: t.key,
      staticClass: "fx-drawer__tab",
      class: {
        "is-active": _vm.tab === t.key,
        "is-locked": _vm.isTabLocked(t.key)
      },
      attrs: {
        role: "tab",
        "aria-selected": String(_vm.tab === t.key),
        disabled: _vm.isTabLocked(t.key)
      },
      on: {
        click: function ($event) {
          _vm.tab = t.key;
        }
      }
    }, [_vm._v(_vm._s(t.n) + ". " + _vm._s(t.label))]);
  }), 0), _vm._v(" "), _c("section", {
    staticClass: "fx-form"
  }, [_vm.tab === "entity" ? _c("EntityPanel", {
    key: _vm.jobId,
    attrs: {
      "job-id": _vm.jobId
    }
  }) : _vm.tab === "shipping" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("Field", {
    attrs: {
      label: "Vessel name",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.vessel_name,
      callback: function ($$v) {
        _vm.$set(_vm.form, "vessel_name", $$v);
      },
      expression: "form.vessel_name"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Voyage no",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.voyage_no,
      callback: function ($$v) {
        _vm.$set(_vm.form, "voyage_no", $$v);
      },
      expression: "form.voyage_no"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Flag",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.vessel_flag,
      callback: function ($$v) {
        _vm.$set(_vm.form, "vessel_flag", $$v);
      },
      expression: "form.vessel_flag"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "IMO (7 digits)",
      disabled: !_vm.canWrite,
      hint: "^[0-9]{7}$"
    },
    model: {
      value: _vm.form.imo_number,
      callback: function ($$v) {
        _vm.$set(_vm.form, "imo_number", $$v);
      },
      expression: "form.imo_number"
    }
  })], 1) : _vm.tab === "routing" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("Field", {
    attrs: {
      label: "POR",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.form.por_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "por_code", $$v);
      },
      expression: "form.por_code"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "POL",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.form.pol_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "pol_code", $$v);
      },
      expression: "form.pol_code"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "POD",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.form.pod_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "pod_code", $$v);
      },
      expression: "form.pod_code"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "DEL",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.form.del_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "del_code", $$v);
      },
      expression: "form.del_code"
    }
  })], 1) : _vm.tab === "goods" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("Field", {
    attrs: {
      label: "IMDG class",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.imdg_class,
      callback: function ($$v) {
        _vm.$set(_vm.form, "imdg_class", $$v);
      },
      expression: "form.imdg_class"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "UN number",
      disabled: !_vm.canWrite,
      hint: _vm.form.imdg_class ? "Required once an IMDG class is set" : null
    },
    model: {
      value: _vm.form.un_number,
      callback: function ($$v) {
        _vm.$set(_vm.form, "un_number", $$v);
      },
      expression: "form.un_number"
    }
  })], 1) : _vm.tab === "item" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("Field", {
    attrs: {
      label: "Pieces",
      type: "number",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.piece_count,
      callback: function ($$v) {
        _vm.$set(_vm.form, "piece_count", _vm._n($$v));
      },
      expression: "form.piece_count"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Gross weight (kg)",
      type: "number",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.gross_weight,
      callback: function ($$v) {
        _vm.$set(_vm.form, "gross_weight", _vm._n($$v));
      },
      expression: "form.gross_weight"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Net weight (kg)",
      type: "number",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.net_weight,
      callback: function ($$v) {
        _vm.$set(_vm.form, "net_weight", _vm._n($$v));
      },
      expression: "form.net_weight"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Chargeable weight (kg)",
      type: "number",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.chargeable_weight,
      callback: function ($$v) {
        _vm.$set(_vm.form, "chargeable_weight", _vm._n($$v));
      },
      expression: "form.chargeable_weight"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Volume (CBM)",
      type: "number",
      disabled: !_vm.canWrite,
      hint: _vm.locking.dimensions_required ? "Mandatory for LCL — a box cannot be allocated without it" : null
    },
    model: {
      value: _vm.form.volume_cbm,
      callback: function ($$v) {
        _vm.$set(_vm.form, "volume_cbm", _vm._n($$v));
      },
      expression: "form.volume_cbm"
    }
  })], 1) : _vm.tab === "bl" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("Field", {
    attrs: {
      label: "MBL number",
      disabled: !_vm.canWrite,
      mono: "",
      hint: "≤ 20 chars (ICEGATE)"
    },
    model: {
      value: _vm.form.mbl_number,
      callback: function ($$v) {
        _vm.$set(_vm.form, "mbl_number", $$v);
      },
      expression: "form.mbl_number"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "HBL number",
      disabled: !_vm.canWrite,
      mono: "",
      hint: "≤ 20 chars (ICEGATE)"
    },
    model: {
      value: _vm.form.hbl_number,
      callback: function ($$v) {
        _vm.$set(_vm.form, "hbl_number", $$v);
      },
      expression: "form.hbl_number"
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Freight terms")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.freight_terms,
      expression: "form.freight_terms"
    }],
    staticClass: "fx-input",
    attrs: {
      disabled: !_vm.canWrite
    },
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.form, "freight_terms", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("—")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "prepaid"
    }
  }, [_vm._v("Prepaid — invoice the shipper")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "collect"
    }
  }, [_vm._v("Collect — invoice the consignee")])])])], 1) : _vm.tab === "container" ? _c("div", [!_vm.locking.containers_enabled ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          " + _vm._s(_vm.labelOf(_vm.form.cargo_type)) + " carries no containers on this document"), _vm.form.cargo_type === "lcl" ? [_vm._v(" — LCL boxes are managed at master level")] : _vm._e(), _vm._v(".\n        ")], 2) : [_c("label", {
    staticClass: "fx-field",
    staticStyle: {
      "margin-bottom": "var(--space-3)"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Size / type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.container_type,
      expression: "form.container_type"
    }],
    staticClass: "fx-input",
    attrs: {
      disabled: !_vm.canWrite
    },
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.form, "container_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.container_types, function (t) {
    return _c("option", {
      key: t,
      domProps: {
        value: t
      }
    }, [_vm._v(_vm._s(t))]);
  })], 2)]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Container number")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Seal")]), _vm._v(" "), _vm.canWrite ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.containers, function (c, i) {
    return _c("tr", {
      key: i,
      class: {
        "is-review": c.number && !_vm.isValidBox(c.number)
      }
    }, [_c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: c.number,
        expression: "c.number"
      }],
      staticClass: "fx-input identifier",
      attrs: {
        disabled: !_vm.canWrite,
        maxlength: "11"
      },
      domProps: {
        value: c.number
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(c, "number", $event.target.value);
        }
      }
    }), _vm._v(" "), c.number && !_vm.isValidBox(c.number) ? _c("span", {
      staticClass: "fx-field__error"
    }, [_vm._v("\n                    Fails the ISO 6346 check digit\n                  ")]) : _vm._e()]), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: c.seal,
        expression: "c.seal"
      }],
      staticClass: "fx-input",
      attrs: {
        disabled: !_vm.canWrite,
        maxlength: "15"
      },
      domProps: {
        value: c.seal
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(c, "seal", $event.target.value);
        }
      }
    })]), _vm._v(" "), _vm.canWrite ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.containers.splice(i, 1);
        }
      }
    }, [_vm._v("✕")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.containers.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "3"
    }
  }, [_vm._v("No containers yet.")])]) : _vm._e()], 2)]), _vm._v(" "), _vm.canWrite ? _c("button", {
    staticClass: "fx-btn",
    staticStyle: {
      "margin-top": "var(--space-3)"
    },
    on: {
      click: function ($event) {
        return _vm.containers.push({
          number: "",
          seal: ""
        });
      }
    }
  }, [_vm._v("\n            Add container\n          ")]) : _vm._e()]], 2) : _vm.tab === "customs" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("Field", {
    attrs: {
      label: "Shipping bill no",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.form.shipping_bill_no,
      callback: function ($$v) {
        _vm.$set(_vm.form, "shipping_bill_no", $$v);
      },
      expression: "form.shipping_bill_no"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Shipping bill date",
      type: "date",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.shipping_bill_date,
      callback: function ($$v) {
        _vm.$set(_vm.form, "shipping_bill_date", $$v);
      },
      expression: "form.shipping_bill_date"
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Filing status")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.filing_status,
      expression: "form.filing_status"
    }],
    staticClass: "fx-input",
    attrs: {
      disabled: !_vm.canWrite
    },
    on: {
      change: function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.form, "filing_status", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(["not_filed", "submitted", "cleared", "rejected"], function (s) {
    return _c("option", {
      key: s,
      domProps: {
        value: s
      }
    }, [_vm._v("\n              " + _vm._s(_vm.labelOf(s)) + "\n            ")]);
  }), 0)])], 1) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        " + _vm._s(_vm.tabLabel) + " reads " + _vm._s(_vm.tabSource) + ", which is not wired into this form yet.\n        "), _vm.tab === "charges" || _vm.tab === "financials" ? [_vm._v("\n          The cost sheet is on the inbox drawer today (§6.7).\n        ")] : _vm._e()], 2)], 1), _vm._v(" "), _vm.canWrite ? _c("footer", {
    staticClass: "fx-form__foot"
  }, [_vm.saveError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.saveError))]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.saving || _vm.hasBadBox
    },
    on: {
      click: _vm.save
    }
  }, [_vm._v("\n        " + _vm._s(_vm.saving ? "Saving…" : "Save") + "\n      ")])]) : _vm._e()] : _vm._e()], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=template&id=3068e470":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=template&id=3068e470 ***!
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
  return _c("div", [_vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("p", {
    staticClass: "fx-muted",
    staticStyle: {
      "margin-bottom": "var(--space-3)"
    }
  }, [_vm._v("\n      This is\n      "), _c("strong", [_vm._v(_vm._s(_vm.document === "master" ? "a master bill" : "a house bill"))]), _vm._v(".\n      "), _vm.document === "master" ? [_vm._v("\n        The shipper is the forwarder branch itself and the consignee is the destination agent —\n        not the exporter and buyer.\n      ")] : [_vm._v("\n        The shipper is the actual exporter and the consignee is the overseas buyer.\n      ")]], 2), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Role")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Party")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Type")]), _vm._v(" "), _vm.canWrite ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.entities, function (e) {
    return _c("tr", {
      key: e.id
    }, [_c("td", [_vm._v(_vm._s(e.label))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(e.name || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(e.party_type))]), _vm._v(" "), _vm.canWrite ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.remove(e);
        }
      }
    }, [_vm._v("✕")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.entities.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: _vm.canWrite ? 4 : 3
    }
  }, [_vm._v("No parties yet.")])]) : _vm._e()], 2)]), _vm._v(" "), _vm.canWrite ? _c("div", {
    staticClass: "fx-toolbar",
    staticStyle: {
      "margin-top": "var(--space-4)"
    }
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Role")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.role,
      expression: "draft.role"
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
        _vm.$set(_vm.draft, "role", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.onRole]
    }
  }, _vm._l(_vm.roles, function (r) {
    return _c("option", {
      key: r,
      domProps: {
        value: r
      }
    }, [_vm._v(_vm._s(r.replace(/_/g, " ")))]);
  }), 0)]), _vm._v(" "), _vm.expected[_vm.draft.role] ? _c("div", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Party type")]), _vm._v(" "), _c("span", {
    staticClass: "fx-input fx-input--static"
  }, [_vm._v(_vm._s(_vm.expected[_vm.draft.role].party_type))]), _vm._v(" "), _c("span", {
    staticClass: "fx-field__hint"
  }, [_vm._v(_vm._s(_vm.expected[_vm.draft.role].description))])]) : _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Party type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.party_type,
      expression: "draft.party_type"
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
        _vm.$set(_vm.draft, "party_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        _vm.draft.party_id = "";
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "customer"
    }
  }, [_vm._v("customer")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "partner"
    }
  }, [_vm._v("partner")])])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Party")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.party_id,
      expression: "draft.party_id"
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
        _vm.$set(_vm.draft, "party_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.options, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v(_vm._s(p.name))]);
  })], 2)]), _vm._v(" "), _vm.draft.role === "other" ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Label")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.custom_role_label,
      expression: "draft.custom_role_label"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "text",
      maxlength: "50"
    },
    domProps: {
      value: _vm.draft.custom_role_label
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.draft, "custom_role_label", $event.target.value);
      }
    }
  })]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: !_vm.draft.party_id || _vm.busy
    },
    on: {
      click: _vm.add
    }
  }, [_vm._v("Add party")])]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/Field.vue?vue&type=template&id=1753eb6e":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/Field.vue?vue&type=template&id=1753eb6e ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v(_vm._s(_vm.label))]), _vm._v(" "), _c("input", _vm._b({
    class: ["fx-input", _vm.mono ? "identifier" : ""],
    attrs: {
      type: _vm.type,
      disabled: _vm.disabled
    },
    domProps: {
      value: _vm.value
    },
    on: {
      input: function ($event) {
        _vm.$emit("input", _vm.type === "number" ? _vm.toNumber($event.target.value) : $event.target.value);
      }
    }
  }, "input", _vm.$attrs, false)), _vm._v(" "), _vm.hint ? _c("span", {
    staticClass: "fx-field__hint"
  }, [_vm._v(_vm._s(_vm.hint))]) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaMaster.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusSeaMaster_vue_vue_type_template_id_0af23761__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=template&id=0af23761 */ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761");
/* harmony import */ var _FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusSeaMaster_vue_vue_type_template_id_0af23761__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusSeaMaster_vue_vue_type_template_id_0af23761__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/FocusSeaMaster.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/EntityPanel.vue":
/*!************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/EntityPanel.vue ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EntityPanel_vue_vue_type_template_id_3068e470__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EntityPanel.vue?vue&type=template&id=3068e470 */ "./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=template&id=3068e470");
/* harmony import */ var _EntityPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EntityPanel.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _EntityPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _EntityPanel_vue_vue_type_template_id_3068e470__WEBPACK_IMPORTED_MODULE_0__.render,
  _EntityPanel_vue_vue_type_template_id_3068e470__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/EntityPanel.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/Field.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/Field.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Field_vue_vue_type_template_id_1753eb6e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Field.vue?vue&type=template&id=1753eb6e */ "./resources/js/src/view/pages/freight/components/Field.vue?vue&type=template&id=1753eb6e");
/* harmony import */ var _Field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Field.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/Field.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Field_vue_vue_type_template_id_1753eb6e__WEBPACK_IMPORTED_MODULE_0__.render,
  _Field_vue_vue_type_template_id_1753eb6e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/Field.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=script&lang=js":
/*!************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=script&lang=js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EntityPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EntityPanel.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EntityPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/Field.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/Field.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Field.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/Field.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761 ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_0af23761__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_0af23761__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_0af23761__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=template&id=0af23761 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=template&id=3068e470":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=template&id=3068e470 ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EntityPanel_vue_vue_type_template_id_3068e470__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EntityPanel_vue_vue_type_template_id_3068e470__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EntityPanel_vue_vue_type_template_id_3068e470__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EntityPanel.vue?vue&type=template&id=3068e470 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/EntityPanel.vue?vue&type=template&id=3068e470");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/Field.vue?vue&type=template&id=1753eb6e":
/*!************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/Field.vue?vue&type=template&id=1753eb6e ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Field_vue_vue_type_template_id_1753eb6e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Field_vue_vue_type_template_id_1753eb6e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Field_vue_vue_type_template_id_1753eb6e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Field.vue?vue&type=template&id=1753eb6e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/Field.vue?vue&type=template&id=1753eb6e");


/***/ })

}]);