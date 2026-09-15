"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_BossDashboard_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BossDashboard",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    periods: [],
    loading: true,
    error: null,
    grain: "month",
    basis: "fiscal",
    branches: [],
    modes: [],
    asOf: null,
    targets: null,
    branchesReason: null,
    ai: null,
    targetMonth: new Date().toISOString().slice(0, 7),
    editingTargets: false,
    savingTargets: false,
    targetForm: {},
    targetsError: null
  }),
  computed: {
    /** Revenue is a Command figure; Tactical has no invoicing. */
    measures() {
      const all = [{
        key: "shipments",
        label: "Shipments",
        kind: "count"
      }, {
        key: "tonnage",
        label: "Tonnage",
        kind: "weight"
      }, {
        key: "revenue",
        label: "Revenue",
        kind: "currency"
      }];
      return this.targets && this.targets.with_revenue ? all : all.slice(0, 2);
    }
  },
  created() {
    this.load();
    this.loadBranches();
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/ai-usage/company").then(({
      data
    }) => {
      this.ai = data;
    }).catch(() => {
      this.ai = null;
    });
    this.loadTargets();
  },
  methods: {
    loadTargets() {
      this.editingTargets = false;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sales/targets?month=" + this.targetMonth).then(({
        data
      }) => {
        this.targets = data;
        this.targetsError = null;
      }).catch(() => {
        this.targets = null;
      });
    },
    editTargets() {
      this.targetForm = Object.fromEntries(this.targets.rows.map(r => [r.agent_id + "|" + r.mode, Object.fromEntries(this.measures.map(m => [m.key, r.measures[m.key].target === null ? "" : r.measures[m.key].target]))]));
      this.editingTargets = true;
    },
    saveTargets() {
      this.savingTargets = true;
      const blank = v => v === "" || v === null ? null : Number(v);
      const targets = this.targets.rows.map(r => {
        const f = this.targetForm[r.agent_id + "|" + r.mode];
        return {
          agent_id: r.agent_id,
          mode: r.mode,
          shipments: blank(f.shipments),
          tonnage: blank(f.tonnage),
          revenue: blank(f.revenue)
        };
      });
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].put("/sales/targets", {
        month: this.targetMonth,
        targets
      }).then(({
        data
      }) => {
        this.targets = data;
        this.editingTargets = false;
        this.targetsError = null;
      }).catch(e => {
        const d = e.response && e.response.data || {};
        this.targetsError = d.message || d.error || "Targets were not saved.";
      }).finally(() => {
        this.savingTargets = false;
      });
    },
    loadBranches() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sales/branches").then(({
        data
      }) => {
        this.branches = data.branches || [];
        this.modes = data.modes || [];
        this.asOf = data.as_of;
        this.branchesReason = data.reason || null;
      })
      /* The funnel below is the rest of the page — a failing comparison must not
         take it down with it. */.catch(() => {
        this.branches = [];
      });
    },
    load() {
      this.loading = true;
      let url = "/analytics/funnel?grain=" + this.grain;
      if (this.grain === "year") url += "&basis=" + this.basis;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(({
        data
      }) => {
        this.periods = data.periods || [];
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=template&id=72550b0f":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=template&id=72550b0f ***!
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
  return _c("div", [_vm._m(0), _vm._v(" "), _vm.ai ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("AI use")]), _vm._v(" "), !_vm.ai.has_limit ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("AI is not included for your company. Ask F16s to set an AI limit.")]) : [_c("div", {
    staticClass: "fx-tiles"
  }, [_c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("This month's AI allowance")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.ai.used_month_percent) + "% used")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v(_vm._s(_vm.ai.days_left) + " days left this month")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Today's AI budget")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.ai.used_today_percent === null ? "—" : _vm.ai.used_today_percent + "% used"))]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v("Help and drafts pause at " + _vm._s(_vm.ai.other_uses_share_percent) + "%")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-tile"
  }, [_c("span", {
    staticClass: "fx-tile__label"
  }, [_vm._v("Read by AI this month")]), _vm._v(" "), _c("span", {
    staticClass: "fx-tile__value"
  }, [_vm._v(_vm._s(_vm.ai.month.documents) + " documents")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-tile__detail"
  }, [_vm._v(_vm._s(_vm.ai.month.help) + " help questions · " + _vm._s(_vm.ai.month.drafts) + " email drafts")])])])]], 2) : _vm._e(), _vm._v(" "), _vm.branches.length ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("\n      Branches — as of "), _c("Figure", {
    attrs: {
      value: _vm.asOf,
      kind: "date"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "fx-matrix-wrap"
  }, [_c("table", {
    staticClass: "fx-table fx-matrix"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _vm._l(_vm.modes, function (m) {
    return _c("th", {
      key: m,
      staticClass: "fx-num",
      attrs: {
        scope: "col"
      }
    }, [_vm._v(_vm._s(m) + " tonnage YTD")]);
  }), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Revenue MTD")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Overdue 60+")])], 2)]), _vm._v(" "), _c("tbody", _vm._l(_vm.branches, function (b) {
    return _c("tr", {
      key: b.agent_id
    }, [_c("th", {
      attrs: {
        scope: "row"
      }
    }, [_vm._v(_vm._s(b.name) + " "), _c("span", {
      staticClass: "fx-muted identifier"
    }, [_vm._v(_vm._s(b.code))])]), _vm._v(" "), _vm._l(_vm.modes, function (m) {
      return _c("td", {
        key: m,
        staticClass: "fx-num"
      }, [b.modes[m] ? _c("Figure", {
        attrs: {
          value: b.modes[m].tonnage_ytd,
          kind: "weight"
        }
      }) : _c("span", {
        staticClass: "is-empty",
        attrs: {
          "aria-label": "This branch does not run this mode"
        }
      })], 1);
    }), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: b.totals.revenue_mtd,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num",
      class: {
        "fx-over": b.totals.overdue_60_plus > 0
      }
    }, [_c("Figure", {
      attrs: {
        value: b.totals.overdue_60_plus,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)], 2);
  }), 0)])])]) : _vm._e(), _vm._v(" "), _vm.targets ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Targets")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Month")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.targetMonth,
      expression: "targetMonth"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "month"
    },
    domProps: {
      value: _vm.targetMonth
    },
    on: {
      change: _vm.loadTargets,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.targetMonth = $event.target.value;
      }
    }
  })]), _vm._v(" "), !_vm.editingTargets ? _c("button", {
    staticClass: "fx-btn",
    on: {
      click: _vm.editTargets
    }
  }, [_vm._v("Set targets")]) : [_c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.savingTargets
    },
    on: {
      click: _vm.saveTargets
    }
  }, [_vm._v(_vm._s(_vm.savingTargets ? "Saving…" : "Save targets"))]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: function ($event) {
        _vm.editingTargets = false;
      }
    }
  }, [_vm._v("Cancel")])]], 2), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-board__note"
  }, [_vm.targets.as_of ? [_vm._v("So far as of "), _c("Figure", {
    attrs: {
      value: _vm.targets.as_of,
      kind: "date"
    }
  }), _vm._v(".")] : [_vm._v("No figures for this month yet.")], _vm._v('\n      "Month end" is the pace so far carried to the end of the month.\n    ')], 2), _vm._v(" "), _vm.targetsError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.targetsError))]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-matrix-wrap"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mode")]), _vm._v(" "), _vm._l(_vm.measures, function (m) {
    return _c("th", {
      key: m.key,
      attrs: {
        scope: "col"
      }
    }, [_vm._v(_vm._s(m.label))]);
  })], 2)]), _vm._v(" "), _c("tbody", _vm._l(_vm.targets.rows, function (r) {
    return _c("tr", {
      key: r.agent_id + r.mode
    }, [_c("th", {
      attrs: {
        scope: "row"
      }
    }, [_vm._v(_vm._s(r.branch) + " "), _c("span", {
      staticClass: "fx-muted identifier"
    }, [_vm._v(_vm._s(r.code))])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.mode))]), _vm._v(" "), _vm._l(_vm.measures, function (m) {
      return _c("td", {
        key: m.key
      }, [_vm.editingTargets ? _c("input", {
        directives: [{
          name: "model",
          rawName: "v-model",
          value: _vm.targetForm[r.agent_id + "|" + r.mode][m.key],
          expression: "targetForm[r.agent_id + '|' + r.mode][m.key]"
        }],
        staticClass: "fx-input fx-target__input",
        attrs: {
          type: "number",
          min: "0",
          placeholder: "No target"
        },
        domProps: {
          value: _vm.targetForm[r.agent_id + "|" + r.mode][m.key]
        },
        on: {
          input: function ($event) {
            if ($event.target.composing) return;
            _vm.$set(_vm.targetForm[r.agent_id + "|" + r.mode], m.key, $event.target.value);
          }
        }
      }) : [_c("div", [_c("Figure", {
        attrs: {
          value: r.measures[m.key].actual,
          kind: m.kind,
          "currency-code": m.kind === "currency" ? "INR" : null
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v(" of ")]), _vm._v(" "), r.measures[m.key].target !== null ? _c("Figure", {
        attrs: {
          value: r.measures[m.key].target,
          kind: m.kind,
          "currency-code": m.kind === "currency" ? "INR" : null
        }
      }) : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("no target")])], 1), _vm._v(" "), r.measures[m.key].percent !== null ? _c("div", {
        staticClass: "fx-target__bar",
        attrs: {
          "aria-label": r.measures[m.key].percent + "% of target"
        }
      }, [_c("span", {
        class: {
          "is-met": r.measures[m.key].percent >= 100
        },
        style: {
          width: Math.min(r.measures[m.key].percent, 100) + "%"
        }
      })]) : _vm._e(), _vm._v(" "), r.measures[m.key].percent !== null ? _c("div", {
        staticClass: "fx-muted fx-target__meta"
      }, [_vm._v("\n                  " + _vm._s(r.measures[m.key].percent) + "%\n                  "), r.measures[m.key].month_end !== null ? [_vm._v(" · month end\n                    "), _c("Figure", {
        attrs: {
          value: r.measures[m.key].month_end,
          kind: m.kind,
          "currency-code": m.kind === "currency" ? "INR" : null
        }
      })] : _vm._e()], 2) : _vm._e()]], 2);
    })], 2);
  }), 0)])])]) : _vm.branchesReason === "never_computed" ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n    No rollup has run, so there is nothing to compare. This is not branches that\n    shipped nothing — it is branches nobody has computed.\n    Run "), _c("code", [_vm._v("sales:compute-snapshots")]), _vm._v(".\n  ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Grain")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.grain,
      expression: "grain"
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
        _vm.grain = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: "day"
    }
  }, [_vm._v("Daily (DSR)")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "month"
    }
  }, [_vm._v("Monthly (MSR)")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "year"
    }
  }, [_vm._v("Yearly (YSR)")])])]), _vm._v(" "), _vm.grain === "year" ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Year basis")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.basis,
      expression: "basis"
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
        _vm.basis = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: "fiscal"
    }
  }, [_vm._v("Fiscal (Apr–Mar)")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "calendar"
    }
  }, [_vm._v("Calendar")])])]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.periods.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n    No enquiries in this window. A period with none has no conversion rate — that is\n    not a rate of zero.\n  ")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.periods, function (p, i) {
    return _c("tr", {
      key: i
    }, [_c("td", [_c("Figure", {
      attrs: {
        value: p.period_start,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(p.transport_mode))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.enquiries_raised,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.enquiries_replied,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.enquiries_pending,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.enquiries_converted,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: p.enquiries_lost,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [p.conversion_rate_pct === null ? _c("span", {
      staticClass: "is-empty",
      attrs: {
        "aria-label": "No enquiries in this period"
      }
    }) : _c("span", [_vm._v(_vm._s(Number(p.conversion_rate_pct).toFixed(2)) + "%")])])]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Overview")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      Cross-mode oversight. The Boss portal has no transport scope, so air and sea\n      appear side by side rather than one at a time.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Period")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mode")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Raised")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Replied")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Pending")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Converted")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Lost")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Conversion")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/BossDashboard.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/BossDashboard.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BossDashboard_vue_vue_type_template_id_72550b0f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BossDashboard.vue?vue&type=template&id=72550b0f */ "./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=template&id=72550b0f");
/* harmony import */ var _BossDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BossDashboard.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BossDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BossDashboard_vue_vue_type_template_id_72550b0f__WEBPACK_IMPORTED_MODULE_0__.render,
  _BossDashboard_vue_vue_type_template_id_72550b0f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/BossDashboard.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BossDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BossDashboard.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BossDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=template&id=72550b0f":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=template&id=72550b0f ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BossDashboard_vue_vue_type_template_id_72550b0f__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BossDashboard_vue_vue_type_template_id_72550b0f__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BossDashboard_vue_vue_type_template_id_72550b0f__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BossDashboard.vue?vue&type=template&id=72550b0f */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/BossDashboard.vue?vue&type=template&id=72550b0f");


/***/ })

}]);