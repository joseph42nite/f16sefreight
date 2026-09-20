"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_Collections_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
/* harmony import */ var _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/FxDrawer.vue */ "./resources/js/src/view/pages/freight/components/FxDrawer.vue");
/* harmony import */ var _view_pages_freight_components_MailEditor_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/MailEditor.vue */ "./resources/js/src/view/pages/freight/components/MailEditor.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }






const VIEWS = [{
  key: "queue",
  label: "Who to chase"
}, {
  key: "ageing",
  label: "Ageing"
}];
const PARTY_TABS = [{
  key: "documents",
  label: "What they owe"
}, {
  key: "chases",
  label: "What has been done"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Collections",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    MailEditor: _view_pages_freight_components_MailEditor_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
  },
  data: () => ({
    /* The queue opens first: it is the day's work, and the ageing is what it is derived from. */
    view: "queue",
    VIEWS,
    PARTY_TABS,
    parties: [],
    totals: {},
    buckets: {},
    asOf: "",
    queue: [],
    summary: null,
    branches: [],
    filters: {
      agent_id: null,
      as_of: "",
      party_type: "",
      q: ""
    },
    party: null,
    tab: "documents",
    chase: {
      agent_id: null,
      channel: "call",
      note: "",
      promised_amount: null,
      promised_date: "",
      next_action_date: ""
    },
    chaseDraft: null,
    loading: true,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_5__.mapGetters)(["designation"])), {}, {
    /* Accounts chase. The Boss watches the ageing and does not log calls. */
    canChase() {
      return this.designation === "accounts";
    },
    subtitleForView() {
      return this.view === "ageing" ? "What every client and agent owes, and how long it has been owed." : "Who to call today: broken promises first, then whoever nobody has called.";
    },
    partySubtitle() {
      if (!this.party) return "";
      return `${this.party.documents.length} open document(s)` + (this.party.party.gst_no ? ` · GSTIN ${this.party.party.gst_no}` : "");
    }
  }),
  created() {
    this.load();
  },
  methods: {
    showView(key) {
      this.view = key;
      this.party = null;
      this.actionError = null;
      this.load();
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
    },
    isOpen(row) {
      return !!this.party && this.party.party.id === row.party_id && this.party.party.type === row.party_type;
    },
    query() {
      const params = [];
      ["agent_id", "party_type", "q"].forEach(key => {
        if (this.filters[key]) params.push(key + "=" + encodeURIComponent(this.filters[key]));
      });
      if (this.view === "ageing" && this.filters.as_of) params.push("as_of=" + this.filters.as_of);
      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get((this.view === "ageing" ? "/ageing" : "/collections") + this.query()).then(({
        data
      }) => {
        if (this.view === "ageing") {
          this.parties = data.parties || [];
          this.totals = data.totals || {};
          this.buckets = data.buckets || {};
          this.asOf = data.as_of;
        } else {
          this.queue = data.queue || [];
          this.summary = data.summary;
        }
        if (data.branches) this.branches = data.branches;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    exportCsv() {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/ageing/export" + this.query(), {
        responseType: "blob"
      }).then(({
        data
      }) => {
        const url = window.URL.createObjectURL(new Blob([data], {
          type: "text/csv"
        }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "ageing.csv";
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);
      }).catch(() => {
        this.actionError = "The export could not be built.";
      }).finally(() => {
        this.busy = false;
      });
    },
    openParty(row) {
      this.actionError = null;
      this.tab = "documents";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/ageing/${row.party_type}/${row.party_id}` + (this.filters.as_of && this.view === "ageing" ? `?as_of=${this.filters.as_of}` : "")).then(({
        data
      }) => {
        this.party = data;
        this.chase = {
          agent_id: this.branches.length ? this.branches[0].id : null,
          channel: "call",
          note: "",
          promised_amount: null,
          promised_date: "",
          next_action_date: ""
        };
      }).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    logChase() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/collections/follow-ups", _objectSpread(_objectSpread({}, this.chase), {}, {
        party_type: this.party.party.type,
        party_id: this.party.party.id,
        promised_amount: this.chase.promised_amount || null,
        promised_date: this.chase.promised_date || null,
        next_action_date: this.chase.next_action_date || null
      })).then(({
        data
      }) => {
        this.party = _objectSpread(_objectSpread({}, this.party), {}, {
          follow_ups: data.follow_ups
        });
        this.chase = _objectSpread(_objectSpread({}, this.chase), {}, {
          note: "",
          promised_amount: null,
          promised_date: "",
          next_action_date: ""
        });
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    close(followUp, state) {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/collections/follow-ups/${followUp.id}/close`, {
        state
      }).then(({
        data
      }) => {
        this.party = _objectSpread(_objectSpread({}, this.party), {}, {
          follow_ups: data.follow_ups
        });
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    draftChase() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/ageing/${this.party.party.type}/${this.party.party.id}/draft-chase`, {}).then(({
        data
      }) => {
        this.chaseDraft = _objectSpread(_objectSpread({}, data), {}, {
          toLine: (data.to || []).join(", "),
          sent: false
        });
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    /** Sent from the person's own mailbox — and logged, because a chase nobody recorded did not happen. */
    sendChase() {
      const form = new FormData();
      this.chaseDraft.toLine.split(",").map(a => a.trim()).filter(Boolean).forEach(a => form.append("to[]", a));
      form.append("subject", this.chaseDraft.subject);
      form.append("body", this.chaseDraft.body);
      form.append("include_signature", "1");
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/inbox/compose", form).then(() => {
        this.chaseDraft = _objectSpread(_objectSpread({}, this.chaseDraft), {}, {
          sent: true
        });
        return _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/collections/follow-ups", {
          agent_id: this.branches.length ? this.branches[0].id : null,
          party_type: this.party.party.type,
          party_id: this.party.party.id,
          channel: "email",
          note: "Chasing mail sent: " + this.chaseDraft.subject,
          next_action_date: null,
          promised_amount: null,
          promised_date: null
        });
      }).then(({
        data
      }) => {
        this.party = _objectSpread(_objectSpread({}, this.party), {}, {
          follow_ups: data.follow_ups
        });
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    messageFor(e) {
      return e.response && e.response.data && e.response.data.error || "Something went wrong. Try again.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=template&id=7b9183fd&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=template&id=7b9183fd&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v("Ageing & collections")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitleForView) + "\n      "), _c("router-link", {
    attrs: {
      to: "/billing"
    }
  }, [_vm._v("Billing →")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar fx-financials__views"
  }, _vm._l(_vm.VIEWS, function (v) {
    return _c("button", {
      key: v.key,
      staticClass: "fx-btn",
      class: {
        "fx-btn--primary": _vm.view === v.key
      },
      on: {
        click: function ($event) {
          return _vm.showView(v.key);
        }
      }
    }, [_vm._v(_vm._s(v.label))]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.agent_id,
      expression: "filters.agent_id"
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
        _vm.$set(_vm.filters, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("All branches")]), _vm._v(" "), _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  })], 2)]) : _vm._e(), _vm._v(" "), _vm.view === "ageing" ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("As of")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.as_of,
      expression: "filters.as_of"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.filters.as_of
    },
    on: {
      change: _vm.load,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "as_of", $event.target.value);
      }
    }
  })]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Who")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.party_type,
      expression: "filters.party_type"
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
        _vm.$set(_vm.filters, "party_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Clients and agents")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "customer"
    }
  }, [_vm._v("Clients")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "partner"
    }
  }, [_vm._v("Agents and partners")])])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Search")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.q,
      expression: "filters.q"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "organization or number"
    },
    domProps: {
      value: _vm.filters.q
    },
    on: {
      keyup: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.load.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "q", $event.target.value);
      }
    }
  })]), _vm._v(" "), _vm.view === "ageing" ? _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.exportCsv
    }
  }, [_vm._v("Export")]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm.view === "ageing" ? [!_vm.parties.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nobody owes anything.")]) : [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Docs")]), _vm._v(" "), _vm._l(_vm.buckets, function (label, key) {
    return _c("th", {
      key: key,
      staticClass: "fx-num",
      attrs: {
        scope: "col"
      }
    }, [_vm._v(_vm._s(label))]);
  }), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Total")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Overdue")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Oldest")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Being chased")])], 2)]), _vm._v(" "), _c("tbody", _vm._l(_vm.parties, function (p) {
    return _c("tr", {
      key: p.party_type + p.party_id,
      staticClass: "is-clickable",
      class: {
        "is-selected": _vm.isOpen(p)
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.openParty(p);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.openParty(p);
        }
      }
    }, [_c("td", [_vm._v("\n              " + _vm._s(p.name) + "\n              "), p.party_type === "partner" ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("(agent)")]) : _vm._e()]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(p.documents))]), _vm._v(" "), _vm._l(_vm.buckets, function (label, key) {
      return _c("td", {
        key: key,
        staticClass: "fx-num",
        class: {
          "is-late": key === "d90_plus" && p[key] > 0
        }
      }, [p[key] ? _c("Figure", {
        attrs: {
          value: p[key],
          kind: "currency",
          "currency-code": "INR"
        }
      }) : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("—")])], 1);
    }), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.total,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("strong", [_c("Figure", {
      attrs: {
        value: p.overdue,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]), _vm._v(" "), _c("td", [_vm._v(_vm._s(p.oldest_days ? p.oldest_days + " days" : "—"))]), _vm._v(" "), _c("td", [p.being_chased ? _c("span", [_vm._v("\n                " + _vm._s(_vm.money(p.promised))), p.promised_by ? _c("span", [_vm._v(" by " + _vm._s(p.promised_by))]) : _vm._e()]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("Not yet")])])], 2);
  }), 0), _vm._v(" "), _c("tfoot", [_c("tr", [_c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_c("strong", [_vm._v(_vm._s(_vm.parties.length) + " organization(s)")])]), _vm._v(" "), _vm._l(_vm.buckets, function (label, key) {
    return _c("td", {
      key: key,
      staticClass: "fx-num"
    }, [_c("strong", [_c("Figure", {
      attrs: {
        value: _vm.totals[key],
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.totals.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("strong", [_c("Figure", {
    attrs: {
      value: _vm.totals.overdue,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)]), _vm._v(" "), _c("td", {
    attrs: {
      colspan: "2"
    }
  })], 2)])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        As of " + _vm._s(_vm.asOf) + ", in INR at each document's own exchange rate. Age runs from the due date; a credit note\n        takes money off what they owe.\n      ")])]] : [_vm.summary ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("p", {
    staticClass: "fx-muted"
  }, [_c("strong", [_vm._v(_vm._s(_vm.money(_vm.summary.overdue)))]), _vm._v(" overdue across " + _vm._s(_vm.summary.parties) + " organization(s).\n        " + _vm._s(_vm.summary.broken_promises) + " broken promise(s), " + _vm._s(_vm.summary.never_chased) + " nobody has called,\n        " + _vm._s(_vm.money(_vm.summary.promised)) + " promised.\n      ")])]) : _vm._e(), _vm._v(" "), !_vm.queue.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing is overdue. Nobody to chase today.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.queue, function (p) {
    return _c("tr", {
      key: "q-" + p.party_type + p.party_id,
      staticClass: "is-clickable",
      class: {
        "is-selected": _vm.isOpen(p)
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.openParty(p);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.openParty(p);
        }
      }
    }, [_c("td", [_vm._v(_vm._s(p.name))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.overdue,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(p.oldest_days ? p.oldest_days + " days" : "—"))]), _vm._v(" "), _c("td", [p.promise_broken ? _c("span", [_c("StatusChip", {
      attrs: {
        value: "promise_broken"
      }
    }), _vm._v(" They said they would pay")], 1) : p.never_chased ? _c("span", [_c("StatusChip", {
      attrs: {
        value: "not_chased"
      }
    }), _vm._v(" Nobody has called")], 1) : p.due_today ? _c("span", [_vm._v("Due to be chased")]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("Waiting on their date")])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [p.promised ? _c("Figure", {
      attrs: {
        value: p.promised,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(p.promised_by || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(p.next_action || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(p.last_note || "—"))])]);
  }), 0)])], _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e(), _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: !!_vm.party,
      title: _vm.party ? _vm.party.party.name : "",
      subtitle: _vm.partySubtitle,
      tabs: _vm.PARTY_TABS,
      "active-tab": _vm.tab
    },
    on: {
      tab: function ($event) {
        _vm.tab = $event;
      },
      close: function ($event) {
        _vm.party = null;
      }
    },
    scopedSlots: _vm._u([{
      key: "meta",
      fn: function () {
        return [_vm.party ? _c("dl", {
          staticClass: "fx-defs"
        }, [_c("dt", [_vm._v("Owed")]), _vm._v(" "), _c("dd", [_c("Figure", {
          attrs: {
            value: _vm.party.total,
            kind: "currency",
            "currency-code": "INR"
          }
        })], 1), _vm._v(" "), _c("dt", [_vm._v("Overdue")]), _vm._v(" "), _c("dd", [_c("strong", [_c("Figure", {
          attrs: {
            value: _vm.party.overdue,
            kind: "currency",
            "currency-code": "INR"
          }
        })], 1)]), _vm._v(" "), _c("dt", [_vm._v("Credit limit")]), _vm._v(" "), _c("dd", [_vm.party.party.credit_limit === null ? _c("span", {
          staticClass: "fx-muted"
        }, [_vm._v("Not configured")]) : _c("Figure", {
          attrs: {
            value: _vm.party.party.credit_limit,
            kind: "currency",
            "currency-code": "INR"
          }
        })], 1), _vm._v(" "), _c("dt", [_vm._v("Chase goes to")]), _vm._v(" "), _c("dd", {
          staticClass: "fx-muted"
        }, [_vm._v(_vm._s(_vm.party.contacts.join(", ") || "No address on file"))])]) : _vm._e()];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _vm.party ? [_vm.tab === "documents" ? _c("section", {
    staticClass: "fx-section"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Type")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Raised")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Due")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Age")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Outstanding")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.party.documents, function (d) {
    return _c("tr", {
      key: "pd-" + d.id
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(d.invoice_no))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(d.label))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: d.document_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v("\n                " + _vm._s(d.due_on) + "\n                "), _vm._v(" "), d.due_assumed ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("(assumed)")]) : _vm._e()]), _vm._v(" "), _c("td", {
      class: {
        "is-late": d.days_overdue > 90
      }
    }, [_vm._v("\n                " + _vm._s(d.days_overdue ? d.days_overdue + " days over" : "Not due") + "\n              ")]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: d.outstanding_inr,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0)])]) : _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Log a chase")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.branches.length > 1 ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Branch")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chase.agent_id,
      expression: "chase.agent_id"
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
        _vm.$set(_vm.chase, "agent_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.branches, function (b) {
    return _c("option", {
      key: b.id,
      domProps: {
        value: b.id
      }
    }, [_vm._v(_vm._s(b.name))]);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("How")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chase.channel,
      expression: "chase.channel"
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
        _vm.$set(_vm.chase, "channel", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "email"
    }
  }, [_vm._v("Email")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "call"
    }
  }, [_vm._v("Call")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "whatsapp"
    }
  }, [_vm._v("WhatsApp")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "visit"
    }
  }, [_vm._v("Visit")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "other"
    }
  }, [_vm._v("Other")])])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("They promised")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.chase.promised_amount,
      expression: "chase.promised_amount",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input fx-num",
    attrs: {
      type: "number",
      step: "0.01"
    },
    domProps: {
      value: _vm.chase.promised_amount
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.chase, "promised_amount", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("By when")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chase.promised_date,
      expression: "chase.promised_date"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.chase.promised_date
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.chase, "promised_date", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Ask again on")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chase.next_action_date,
      expression: "chase.next_action_date"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.chase.next_action_date
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.chase, "next_action_date", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("What was said")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chase.note,
      expression: "chase.note"
    }],
    staticClass: "fx-input",
    attrs: {
      rows: "3",
      placeholder: "who you spoke to, and what they said"
    },
    domProps: {
      value: _vm.chase.note
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.chase, "note", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.chase.note.trim()
    },
    on: {
      click: _vm.logChase
    }
  }, [_vm._v("Log it")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy || !_vm.party.overdue
    },
    on: {
      click: _vm.draftChase
    }
  }, [_vm._v("Draft a chasing mail")])]), _vm._v(" "), _c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("What has been done")]), _vm._v(" "), !_vm.party.follow_ups.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nobody has chased them yet.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("When")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("How")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("What was said")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Promised")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("By when")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Where it stands")]), _vm._v(" "), _vm.canChase ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", _vm._l(_vm.party.follow_ups, function (f) {
    return _c("tr", {
      key: "f-" + f.id
    }, [_c("td", [_c("Figure", {
      attrs: {
        value: f.created_at,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(f.channel))]), _vm._v(" "), _c("td", [_vm._v("\n                " + _vm._s(f.note) + "\n                "), f.outcome_note ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" — " + _vm._s(f.outcome_note))]) : _vm._e(), _vm._v(" "), f.invoice_no ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" (" + _vm._s(f.invoice_no) + ")")]) : _vm._e()]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [f.promised_amount ? _c("Figure", {
      attrs: {
        value: f.promised_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    }) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(f.promised_date || "—"))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: f.state
      }
    })], 1), _vm._v(" "), _vm.canChase ? _c("td", {
      staticClass: "fx-row-actions"
    }, [f.state === "open" ? [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.close(f, "kept");
        }
      }
    }, [_vm._v("They paid")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.close(f, "broken");
        }
      }
    }, [_vm._v("They did not")])] : _vm._e()], 2) : _vm._e()]);
  }), 0)])]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()] : _vm._e()], 2), _vm._v(" "), _vm.chaseDraft ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "chase-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "chase-title"
    }
  }, [_vm._v("Chase " + _vm._s(_vm.party ? _vm.party.party.name : ""))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body fx-newmail"
  }, [_c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Written from what they owe" + _vm._s(_vm.chaseDraft.written_by === "ai" ? " by the model" : "") + "; every figure comes\n          from the ageing. Edit anything before it goes.\n        ")]), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "chase-to"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("To")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chaseDraft.toLine,
      expression: "chaseDraft.toLine"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "chase-to",
      placeholder: "comma separated"
    },
    domProps: {
      value: _vm.chaseDraft.toLine
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.chaseDraft, "toLine", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    attrs: {
      for: "chase-subject"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Subject")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chaseDraft.subject,
      expression: "chaseDraft.subject"
    }],
    staticClass: "fx-input",
    attrs: {
      id: "chase-subject"
    },
    domProps: {
      value: _vm.chaseDraft.subject
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.chaseDraft, "subject", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("MailEditor", {
    model: {
      value: _vm.chaseDraft.body,
      callback: function ($$v) {
        _vm.$set(_vm.chaseDraft, "body", $$v);
      },
      expression: "chaseDraft.body"
    }
  }), _vm._v(" "), _vm.chaseDraft.sent ? _c("p", {
    staticClass: "fx-notice",
    attrs: {
      role: "status"
    }
  }, [_vm._v("Sent, and logged against them.")]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()], 1), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.chaseDraft = null;
      }
    }
  }, [_vm._v("Close")]), _vm._v(" "), !_vm.chaseDraft.sent ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.chaseDraft.toLine.trim()
    },
    on: {
      click: _vm.sendChase
    }
  }, [_vm._v("\n          " + _vm._s(_vm.busy ? "Sending…" : "Send from my mailbox") + "\n        ")]) : _vm._e()])])]) : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Organization")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Overdue")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Oldest")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Where it stands")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Promised")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("By when")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Next action")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Last note")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Collections.vue":
/*!*************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Collections.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Collections_vue_vue_type_template_id_7b9183fd_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Collections.vue?vue&type=template&id=7b9183fd&scoped=true */ "./resources/js/src/view/pages/freight/Collections.vue?vue&type=template&id=7b9183fd&scoped=true");
/* harmony import */ var _Collections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Collections.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/Collections.vue?vue&type=script&lang=js");
/* harmony import */ var _Collections_vue_vue_type_style_index_0_id_7b9183fd_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css */ "./resources/js/src/view/pages/freight/Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Collections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Collections_vue_vue_type_template_id_7b9183fd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Collections_vue_vue_type_template_id_7b9183fd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "7b9183fd",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/Collections.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Collections.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Collections.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Collections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Collections.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Collections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Collections.vue?vue&type=template&id=7b9183fd&scoped=true":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Collections.vue?vue&type=template&id=7b9183fd&scoped=true ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Collections_vue_vue_type_template_id_7b9183fd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Collections_vue_vue_type_template_id_7b9183fd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Collections_vue_vue_type_template_id_7b9183fd_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Collections.vue?vue&type=template&id=7b9183fd&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=template&id=7b9183fd&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Collections_vue_vue_type_style_index_0_id_7b9183fd_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Collections.vue?vue&type=style&index=0&id=7b9183fd&scoped=true&lang=css");


/***/ })

}]);