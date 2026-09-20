"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_Profitability_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");



const VIEWS = [{
  key: "jobs",
  label: "By shipment"
}, {
  key: "clients",
  label: "By client"
}, {
  key: "lanes",
  label: "By lane"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Profitability",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    view: "jobs",
    VIEWS,
    jobs: [],
    groups: [],
    totals: {
      count: 0,
      revenue: 0,
      cost: 0,
      margin: 0,
      margin_pct: null
    },
    branches: [],
    clients: [],
    modes: [],
    filters: {
      agent_id: null,
      customer_id: null,
      mode: "",
      origin: "",
      dest: "",
      from: "",
      to: "",
      q: "",
      sort: "margin"
    },
    loading: true,
    busy: false,
    error: null,
    actionError: null
  }),
  computed: {
    subtitleForView() {
      return {
        jobs: "What each shipment billed, what it cost, and what that left. Net of tax on both sides.",
        clients: "Which clients are worth the work — and which are busy rather than profitable.",
        lanes: "Which routes earn their keep. This is the number to buy against."
      }[this.view];
    }
  },
  created() {
    // Arrived from a roll-up: show that client's or that lane's shipments.
    ["customer_id", "origin", "dest", "mode"].forEach(key => {
      if (this.$route.query[key]) this.filters[key] = this.$route.query[key];
    });
    if (this.$route.query.customer_id) this.filters.customer_id = Number(this.$route.query.customer_id);
    this.load();
  },
  methods: {
    showView(key) {
      this.view = key;
      this.actionError = null;
      this.load();
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2
      });
    },
    query() {
      const params = [];
      Object.entries(this.filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && (key !== "sort" || this.view === "jobs")) {
          params.push(key + "=" + encodeURIComponent(value));
        }
      });
      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/profitability/${this.view}${this.query()}`).then(({
        data
      }) => {
        this.jobs = data.jobs || [];
        this.groups = data.groups || [];
        this.totals = data.totals;
        this.branches = data.branches || this.branches;
        this.clients = data.clients || this.clients;
        this.modes = data.modes || this.modes;
        this.error = null;
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    /** A roll-up row opens the shipments underneath it — the same calculation, filtered. */
    drillInto(group) {
      if (this.view === "clients") {
        this.filters.customer_id = group.customer_id;
      } else {
        this.filters.origin = group.origin || "";
        this.filters.dest = group.dest || "";
        this.filters.mode = group.mode || "";
      }
      this.showView("jobs");
    },
    exportCsv() {
      this.busy = true;
      const by = {
        clients: "client",
        lanes: "lane"
      }[this.view] || "job";
      const params = this.query();
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query(`/profitability/export${params}${params ? "&" : "?"}by=${by}`, {
        responseType: "blob"
      }).then(({
        data
      }) => {
        const url = window.URL.createObjectURL(new Blob([data], {
          type: "text/csv"
        }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `profitability-${by}.csv`;
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);
      }).catch(() => {
        this.actionError = "The export could not be built.";
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=template&id=08164764&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=template&id=08164764&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v("Profitability")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitleForView) + "\n      "), _c("router-link", {
    attrs: {
      to: "/financials"
    }
  }, [_vm._v("Financials →")])], 1)]), _vm._v(" "), _c("div", {
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
  })], 2)]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Client")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.customer_id,
      expression: "filters.customer_id"
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
        _vm.$set(_vm.filters, "customer_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("Every client")]), _vm._v(" "), _vm._l(_vm.clients, function (c) {
    return _c("option", {
      key: c.id,
      domProps: {
        value: c.id
      }
    }, [_vm._v(_vm._s(c.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Mode")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.mode,
      expression: "filters.mode"
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
        _vm.$set(_vm.filters, "mode", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All")]), _vm._v(" "), _vm._l(_vm.modes, function (m) {
    return _c("option", {
      key: m,
      domProps: {
        value: m
      }
    }, [_vm._v(_vm._s(m))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("From")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.origin,
      expression: "filters.origin"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "BOM",
      maxlength: "5"
    },
    domProps: {
      value: _vm.filters.origin
    },
    on: {
      keyup: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.load.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "origin", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("To")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.dest,
      expression: "filters.dest"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "FRA",
      maxlength: "5"
    },
    domProps: {
      value: _vm.filters.dest
    },
    on: {
      keyup: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.load.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "dest", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Shipped after")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.from,
      expression: "filters.from"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.filters.from
    },
    on: {
      change: _vm.load,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "from", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Shipped before")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.to,
      expression: "filters.to"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "date"
    },
    domProps: {
      value: _vm.filters.to
    },
    on: {
      change: _vm.load,
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.filters, "to", $event.target.value);
      }
    }
  })]), _vm._v(" "), _vm.view === "jobs" ? _c("label", {
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
      placeholder: "job, AWB or client"
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
  })]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.exportCsv
    }
  }, [_vm._v("Export")])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("p", {
    staticClass: "fx-muted"
  }, [_c("strong", [_vm._v(_vm._s(_vm.totals.count))]), _vm._v(" shipment(s) ·\n        revenue "), _c("strong", [_vm._v(_vm._s(_vm.money(_vm.totals.revenue)))]), _vm._v(" ·\n        cost "), _c("strong", [_vm._v(_vm._s(_vm.money(_vm.totals.cost)))]), _vm._v(" ·\n        margin "), _c("strong", {
    class: {
      "is-loss": _vm.totals.margin < 0
    }
  }, [_vm._v(_vm._s(_vm.money(_vm.totals.margin)))]), _vm._v(" "), _vm.totals.margin_pct !== null ? _c("span", [_vm._v(" (" + _vm._s(_vm.totals.margin_pct) + "%)")]) : _vm._e()])]), _vm._v(" "), _vm.totals.no_cost_booked || _vm.totals.not_billed ? _c("p", {
    staticClass: "fx-notice",
    attrs: {
      role: "status"
    }
  }, [_vm.totals.no_cost_booked ? _c("span", [_vm._v("\n        " + _vm._s(_vm.totals.no_cost_booked) + " shipment(s) have been billed with no cost booked, so their margin reads far\n        higher than it is.\n      ")]) : _vm._e(), _vm._v(" "), _vm.totals.not_billed ? _c("span", [_vm._v("\n        " + _vm._s(_vm.totals.not_billed) + " have costs booked and nothing billed yet.\n      ")]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.view === "jobs" ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Sort on")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.filters.sort,
      expression: "filters.sort"
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
        _vm.$set(_vm.filters, "sort", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: "margin"
    }
  }, [_vm._v("Worst margin first")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "margin_pct"
    }
  }, [_vm._v("Worst margin % first")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "revenue"
    }
  }, [_vm._v("Biggest revenue first")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "date"
    }
  }, [_vm._v("Most recent first")])])])]), _vm._v(" "), !_vm.jobs.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No shipment has been billed or costed in this selection.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.jobs, function (j) {
    return _c("tr", {
      key: "j-" + j.id,
      class: {
        "is-loss-row": j.margin < 0
      }
    }, [_c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(j.job_no))]), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: j.job_date,
        kind: "date"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(j.customer || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(j.lane))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(j.mode))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: j.revenue,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: j.cost,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num",
      class: {
        "is-loss": j.margin < 0
      }
    }, [_c("Figure", {
      attrs: {
        value: j.margin,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(j.margin_pct === null ? "—" : j.margin_pct + "%"))]), _vm._v(" "), _c("td", [j.no_cost_booked ? _c("StatusChip", {
      attrs: {
        value: "no_cost_booked"
      }
    }) : j.not_billed ? _c("StatusChip", {
      attrs: {
        value: "not_billed"
      }
    }) : _vm._e()], 1)]);
  }), 0)])] : [!_vm.groups.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing to roll up in this selection.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v(_vm._s(_vm.view === "clients" ? "Client" : "Lane"))]), _vm._v(" "), _vm.view === "lanes" ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Route")]) : _vm._e(), _vm._v(" "), _vm.view === "lanes" ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mode")]) : _vm._e(), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipments")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Revenue")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Cost")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Margin")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("%")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Each")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  })])]), _vm._v(" "), _c("tbody", _vm._l(_vm.groups, function (g) {
    return _c("tr", {
      key: g.key,
      staticClass: "is-clickable",
      class: {
        "is-loss-row": g.margin < 0
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.drillInto(g);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.drillInto(g);
        }
      }
    }, [_c("td", [_vm._v(_vm._s(g.name))]), _vm._v(" "), _vm.view === "lanes" ? _c("td", {
      staticClass: "fx-muted"
    }, [_vm._v("\n              " + _vm._s(g.origin_name || g.origin) + " → " + _vm._s(g.dest_name || g.dest) + "\n            ")]) : _vm._e(), _vm._v(" "), _vm.view === "lanes" ? _c("td", [_vm._v(_vm._s(g.mode))]) : _vm._e(), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(g.shipments))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: g.revenue,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: g.cost,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num",
      class: {
        "is-loss": g.margin < 0
      }
    }, [_c("Figure", {
      attrs: {
        value: g.margin,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_vm._v(_vm._s(g.margin_pct === null ? "—" : g.margin_pct + "%"))]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: g.margin_each,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-muted"
    }, [g.no_cost_booked ? _c("span", [_vm._v(_vm._s(g.no_cost_booked) + " uncosted")]) : _vm._e()])]);
  }), 0)]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v('\n        Open a row to see the shipments behind it. "Each" is what one shipment\n        ' + _vm._s(_vm.view === "clients" ? "for this client" : "on this lane") + " is worth on average.\n      ")])]], _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipment")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipped")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Lane")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Mode")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Revenue")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Cost")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Margin")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("%")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  })])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Profitability.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Profitability.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Profitability_vue_vue_type_template_id_08164764_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Profitability.vue?vue&type=template&id=08164764&scoped=true */ "./resources/js/src/view/pages/freight/Profitability.vue?vue&type=template&id=08164764&scoped=true");
/* harmony import */ var _Profitability_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Profitability.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/Profitability.vue?vue&type=script&lang=js");
/* harmony import */ var _Profitability_vue_vue_type_style_index_0_id_08164764_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css */ "./resources/js/src/view/pages/freight/Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Profitability_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Profitability_vue_vue_type_template_id_08164764_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Profitability_vue_vue_type_template_id_08164764_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "08164764",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/Profitability.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Profitability.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Profitability.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Profitability_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Profitability.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Profitability_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/Profitability.vue?vue&type=template&id=08164764&scoped=true":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Profitability.vue?vue&type=template&id=08164764&scoped=true ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Profitability_vue_vue_type_template_id_08164764_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Profitability_vue_vue_type_template_id_08164764_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Profitability_vue_vue_type_template_id_08164764_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Profitability.vue?vue&type=template&id=08164764&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=template&id=08164764&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css":
/*!***********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Profitability_vue_vue_type_style_index_0_id_08164764_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/Profitability.vue?vue&type=style&index=0&id=08164764&scoped=true&lang=css");


/***/ })

}]);