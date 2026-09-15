"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AiUsage_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AiUsage",
  data: () => ({
    data: null,
    loading: true,
    error: null,
    saving: false,
    saved: false,
    form: {},
    limits: {}
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/ai-usage").then(({
        data
      }) => {
        this.apply(data);
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    apply(data) {
      this.data = data;
      this.form = _objectSpread({}, data.settings);
      // Only an override shows in the box; an empty box follows the plan (the placeholder says how much).
      this.limits = Object.fromEntries(data.by_company.map(c => [c.id, c.budget.overridden ? c.budget.limit : ""]));
      this.error = null;
    },
    saveLimit(c) {
      const value = this.limits[c.id];
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put(`/superadmin/ai-usage/companies/${c.id}/limit`, {
        ai_monthly_limit_inr: value === "" || value === null ? null : Number(value)
      }).then(({
        data
      }) => {
        this.apply(data);
      }).catch(e => {
        this.error = this.readable(e);
      });
    },
    save() {
      this.saving = true;
      this.saved = false;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put("/superadmin/ai-usage/settings", this.form).then(({
        data
      }) => {
        this.apply(data);
        this.saved = true;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.saving = false;
      });
    },
    inr(n) {
      return Number(n || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm._e(), _vm._v(" "), _vm.data ? [_vm.data.month.over_budget ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "alert"
    }
  }, [_c("strong", [_vm._v("This month's AI spend has reached the budget")]), _vm._v(" —\n      ₹" + _vm._s(_vm.inr(_vm.data.month.spend_inr)) + " of ₹" + _vm._s(_vm.inr(_vm.data.month.budget_inr)) + ". Extraction is still\n      running. Raise the budget, lower the per-user limit, or set a credit limit on the OpenRouter key\n      to stop it.\n    ")]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("div", {
    staticClass: "fx-tiles"
  }, [_c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Spent this month")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v("₹" + _vm._s(_vm.inr(_vm.data.month.spend_inr)))]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v("$" + _vm._s(_vm.data.month.spend_usd) + " · " + _vm._s(_vm.data.month.calls) + " calls")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Budget used")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.data.month.used_percent) + "%")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v("of ₹" + _vm._s(_vm.inr(_vm.data.month.budget_inr)))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Answered free at night")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.data.tiers.free.share_percent) + "%")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v(_vm._s(_vm.data.tiers.free.calls) + " calls · avg " + _vm._s(_vm.data.tiers.free.avg_seconds) + " s · ₹0")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Answered by economy")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.data.tiers.economy.share_percent) + "%")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v(_vm._s(_vm.data.tiers.economy.calls) + " calls · avg " + _vm._s(_vm.data.tiers.economy.avg_seconds) + " s · ₹" + _vm._s(_vm.inr(_vm.data.tiers.economy.cost_inr)))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Needed the fast fallback")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.data.tiers.fast.share_percent) + "%")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v(_vm._s(_vm.data.tiers.fast.calls) + " calls · avg " + _vm._s(_vm.data.tiers.fast.avg_seconds) + " s · ₹" + _vm._s(_vm.inr(_vm.data.tiers.fast.cost_inr)))])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Per-user daily limit")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.data.settings.per_user_daily_limit))]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v("over it, documents are read by labels only")])])])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Limits")]), _vm._v(" "), _c("div", {
    staticClass: "fx-ai-settings"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Monthly budget (₹)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.form.monthly_budget_inr,
      expression: "form.monthly_budget_inr",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      min: "0",
      step: "500"
    },
    domProps: {
      value: _vm.form.monthly_budget_inr
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "monthly_budget_inr", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Per-user daily limit (documents)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.form.per_user_daily_limit,
      expression: "form.per_user_daily_limit",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      min: "0"
    },
    domProps: {
      value: _vm.form.per_user_daily_limit
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "per_user_daily_limit", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Per-user daily help questions")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.form.per_user_daily_questions,
      expression: "form.per_user_daily_questions",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      min: "0"
    },
    domProps: {
      value: _vm.form.per_user_daily_questions
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "per_user_daily_questions", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("₹ per US$ (for showing cost)")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.form.usd_to_inr,
      expression: "form.usd_to_inr",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      min: "1",
      step: "0.5"
    },
    domProps: {
      value: _vm.form.usd_to_inr
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "usd_to_inr", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })])]), _vm._v(" "), _c("fieldset", {
    staticClass: "fx-ai-night"
  }, [_c("legend", {
    staticClass: "fx-field__label"
  }, [_vm._v("Free Gemma at night (9pm–11am), paid if it does not answer")]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.night_free_help_drafts,
      expression: "form.night_free_help_drafts"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.form.night_free_help_drafts) ? _vm._i(_vm.form.night_free_help_drafts, null) > -1 : _vm.form.night_free_help_drafts
    },
    on: {
      change: function ($event) {
        var $$a = _vm.form.night_free_help_drafts,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.form, "night_free_help_drafts", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.form, "night_free_help_drafts", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.form, "night_free_help_drafts", $$c);
        }
      }
    }
  }), _vm._v(" Help questions and email drafts")]), _vm._v(" "), _c("label", {
    staticClass: "fx-checkbox"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.night_free_extraction,
      expression: "form.night_free_extraction"
    }],
    attrs: {
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.form.night_free_extraction) ? _vm._i(_vm.form.night_free_extraction, null) > -1 : _vm.form.night_free_extraction
    },
    on: {
      change: function ($event) {
        var $$a = _vm.form.night_free_extraction,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.form, "night_free_extraction", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.form, "night_free_extraction", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.form, "night_free_extraction", $$c);
        }
      }
    }
  }), _vm._v(" Reading invoices and packing lists (scans always use the paid model)")])]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.saving
    },
    on: {
      click: _vm.save
    }
  }, [_vm._v(_vm._s(_vm.saving ? "Saving…" : "Save limits"))]), _vm._v(" "), _vm.saved ? _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(" Saved.")]) : _vm._e()]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("By customer")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        Monthly AI limit per customer — empty follows the plan (Tactical ₹500, Command ₹2,000, Core none).\n        Help questions and email drafts pause at 70% of today's budget so documents keep being read.\n      ")]), _vm._v(" "), _c("div", {
    staticClass: "fx-table-wrap"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.data.by_company, function (c) {
    return _c("tr", {
      key: c.id
    }, [_c("td", [_vm._v(_vm._s(c.company) + " "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("· " + _vm._s(c.tier))])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(c.documents))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(c.help))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(c.drafts))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num",
      class: {
        "fx-error": c.budget.used_month_percent >= 100
      }
    }, [_vm._v("\n                ₹" + _vm._s(_vm.inr(c.budget.spent_month)) + "\n                "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(c.budget.used_month_percent === null ? "" : "· " + c.budget.used_month_percent + "%"))])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v("\n                ₹" + _vm._s(_vm.inr(c.budget.spent_today)) + " of ₹" + _vm._s(_vm.inr(c.budget.today_budget)) + "\n              ")]), _vm._v(" "), _c("td", [_c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.limits[c.id],
        expression: "limits[c.id]"
      }],
      staticClass: "fx-input fx-ai-limit",
      attrs: {
        type: "number",
        min: "0",
        step: "100",
        placeholder: "Plan: " + _vm.inr(c.budget.limit)
      },
      domProps: {
        value: _vm.limits[c.id]
      },
      on: {
        change: function ($event) {
          return _vm.saveLimit(c);
        },
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.limits, c.id, $event.target.value);
        }
      }
    })])]);
  }), 0)])])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Top users")]), _vm._v(" "), !_vm.data.by_user.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No AI calls this month.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(2), _vm._v(" "), _c("tbody", _vm._l(_vm.data.by_user, function (u) {
    return _c("tr", {
      key: u.email || u.name
    }, [_c("td", [_vm._v(_vm._s(u.name || "—") + " "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(u.email))])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(u.calls_today) + " / " + _vm._s(_vm.data.settings.per_user_daily_limit))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(u.calls))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v("₹" + _vm._s(_vm.inr(u.cost_inr)))])]);
  }), 0)])]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Providers")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Which OpenRouter provider answered, how fast, and how often a stuck attempt was retried elsewhere.")]), _vm._v(" "), _vm.data.by_provider.length ? _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(3), _vm._v(" "), _c("tbody", _vm._l(_vm.data.by_provider, function (p) {
    return _c("tr", {
      key: (p.provider || "-") + p.tier + p.purpose
    }, [_c("td", [_vm._v(_vm._s(p.provider || "—"))]), _c("td", [_vm._v(_vm._s(p.tier || "—"))]), _c("td", [_vm._v(_vm._s(p.purpose))]), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(p.calls))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s((p.avg_ms / 1000).toFixed(1)) + " s")]), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(p.retried))])]);
  }), 0)]) : _vm._e()])] : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("AI usage")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      What Gemma 4 on OpenRouter has cost this month, across every customer. Reading invoices and\n      scans keeps running when the budget is reached — this page is where you decide what to do.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Customer")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Documents")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Help")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Drafts")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Spent this month")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Today")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Monthly limit (₹)")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("User")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Today")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("This month")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Cost")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Provider")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Tier")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Kind")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Calls")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Average")]), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Retried")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/admin/AiUsage.vue":
/*!*******************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AiUsage.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AiUsage_vue_vue_type_template_id_5a712bcd_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true */ "./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true");
/* harmony import */ var _AiUsage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AiUsage.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=script&lang=js");
/* harmony import */ var _AiUsage_vue_vue_type_style_index_0_id_5a712bcd_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AiUsage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AiUsage_vue_vue_type_template_id_5a712bcd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _AiUsage_vue_vue_type_template_id_5a712bcd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "5a712bcd",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AiUsage.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AiUsage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AiUsage.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AiUsage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true":
/*!*************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AiUsage_vue_vue_type_template_id_5a712bcd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AiUsage_vue_vue_type_template_id_5a712bcd_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AiUsage_vue_vue_type_template_id_5a712bcd_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=template&id=5a712bcd&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AiUsage_vue_vue_type_style_index_0_id_5a712bcd_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AiUsage.vue?vue&type=style&index=0&id=5a712bcd&scoped=true&lang=css");


/***/ })

}]);