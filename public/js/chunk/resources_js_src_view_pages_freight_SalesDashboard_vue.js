"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_SalesDashboard_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
/* harmony import */ var _view_pages_freight_components_FxChart_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/FxChart.vue */ "./resources/js/src/view/pages/freight/components/FxChart.vue");
/* harmony import */ var _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/FxDrawer.vue */ "./resources/js/src/view/pages/freight/components/FxDrawer.vue");
/* harmony import */ var _view_pages_freight_components_MailEditor_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/pages/freight/components/MailEditor.vue */ "./resources/js/src/view/pages/freight/components/MailEditor.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }








/** What each suggested email is about, in the rep's words. */
const TYPE_LABELS = {
  client_reactivation: "Stopped shipping",
  client_volume_drop: "Volume down",
  client_volume_growth: "Volume up",
  client_rate_review: "Lost on price",
  client_new_lanes: "New lanes to offer"
};
const list = text => String(text || "").split(",").map(s => s.trim()).filter(Boolean);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SalesDashboard",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FxChart: _view_pages_freight_components_FxChart_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    MailEditor: _view_pages_freight_components_MailEditor_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  data: () => ({
    emails: [],
    hasMailbox: true,
    showsClientNames: false,
    outreachLoaded: false,
    dismissReasons: {},
    dismissing: null,
    dismissed: [],
    dismissedByReason: {},
    composing: null,
    form: {
      to: "",
      cc: "",
      subject: "",
      body: ""
    },
    drafting: false,
    draftSeconds: 0,
    writtenBy: null,
    sending: false,
    sendError: null,
    loading: true,
    error: null,
    scope: null,
    mode: null,
    branch: {},
    book: [],
    staleness: null,
    actions: [],
    charts: null,
    grain: "month",
    basis: "fiscal"
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapGetters)(["designation"])), {}, {
    /* ⚠️ Months with no shipments are ABSENT from the payload, not zero-filled — a gap
       means "no data", a zero means "we moved nothing", and on a tonnage chart those
       read as opposite commercial stories. */
    tonnageSeries() {
      const rows = this.charts && this.charts.tonnage || [];
      if (!rows.length) return [];
      return [{
        name: "Tonnage (kg)",
        data: rows.map(r => r.tonnage)
      }];
    },
    tonnageOptions() {
      const rows = this.charts && this.charts.tonnage || [];
      return {
        chart: {
          type: "area"
        },
        stroke: {
          width: 2,
          curve: "straight"
        },
        fill: {
          opacity: 0.15
        },
        /* Categories rather than a datetime axis: the series is already bucketed by
           month server-side, and a datetime axis would interpolate the gaps that mean
           "no data" into a line implying zero. */
        xaxis: {
          categories: rows.map(r => String(r.period).slice(0, 7))
        },
        yaxis: {
          decimalsInFloat: 0
        }
      };
    },
    /* Ranked by TONNAGE, not shipment count: ten courier-sized shipments on one lane
       are not the commercial exposure of one full container on another. */
    laneSeries() {
      const rows = this.charts && this.charts.lanes || [];
      if (!rows.length) return [];
      return [{
        name: "Tonnage (kg)",
        data: rows.map(r => r.tonnage)
      }];
    },
    laneOptions() {
      const rows = this.charts && this.charts.lanes || [];
      return {
        chart: {
          type: "bar"
        },
        /* Horizontal, because "INBOM → DEHAM" rotates to unreadability on a vertical
           axis. */
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "60%"
          }
        },
        xaxis: {
          categories: rows.map(r => r.lane)
        }
      };
    },
    funnelSeries() {
      const t = this.charts && this.charts.funnel && this.charts.funnel.totals || {};
      const values = [t.converted || 0, t.lost || 0, t.pending || 0];
      /* An all-zero donut renders as an empty ring that looks broken. Report nothing
         and let FxChart say so in words instead. */
      return values.some(v => v > 0) ? values : [];
    },
    funnelOptions() {
      const token = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n) || "").trim() || f;
      return {
        chart: {
          type: "donut"
        },
        labels: ["Converted", "Lost", "Still open"],
        colors: [token("--status-success", "#1F7A48"), token("--status-critical", "#C4342B"), token("--status-neutral", "#5A6472")],
        legend: {
          position: "bottom"
        }
      };
    },
    modeLabel() {
      return this.mode ? this.mode + " only" : "all modes";
    },
    tiles() {
      const b = this.branch || {};
      const tiles = [{
        label: "Tonnage MTD",
        value: b.tonnage_mtd,
        kind: "weight"
      }, {
        label: "Tonnage YTD",
        value: b.tonnage_ytd,
        kind: "weight"
      }, {
        label: "Shipments MTD",
        value: b.shipment_count_mtd,
        kind: "count"
      }, {
        label: "Enquiries MTD",
        value: b.enquiry_count_mtd,
        kind: "count"
      }];

      /* 🔴 The revenue tile appears only when the SERVER sent revenue. Below Command it
         omits the key entirely (§7.4 — money is the upsell), so the tile is driven by
         what arrived rather than by a tier check repeated here. One rule, one place. */
      if ("revenue_mtd" in b) {
        tiles.push({
          label: "Revenue MTD",
          value: b.revenue_mtd,
          kind: "currency"
        });
      }
      return tiles;
    }
  }),
  created() {
    this.loadCharts();
    this.loadOutreach();
    this.loadDismissed();
    Promise.all([_core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sales/dashboard"),
    // The actions call is allowed to fail without taking the page down — a ranked
    // worklist is valuable, but it is not the reason the page exists.
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sales/actions").catch(() => ({
      data: {
        actions: []
      }
    }))]).then(([dash, act]) => {
      this.scope = dash.data.scope;
      this.mode = dash.data.mode;
      this.branch = dash.data.branch || {};
      this.book = dash.data.book || [];
      this.staleness = dash.data.staleness;
      this.actions = act.data.actions || [];
    }).catch(e => {
      const d = e.response && e.response.data || {};
      this.error = d.error || d.message || "Something went wrong.";
    }).finally(() => {
      this.loading = false;
    });
  },
  methods: {
    loadOutreach() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sales/outreach").then(({
        data
      }) => {
        this.emails = data.emails || [];
        this.hasMailbox = data.has_mailbox;
        this.showsClientNames = data.shows_client_names;
        this.dismissReasons = data.dismiss_reasons || {};
      })
      // Suggestions failing must not take the dashboard down with them.
      .catch(() => {
        this.emails = [];
      }).finally(() => {
        this.outreachLoaded = true;
      });
    },
    typeLabel(type) {
      return TYPE_LABELS[type] || type;
    },
    /** Why this email is suggested, from the finding's own figures. */
    summary(e) {
      const f = e.facts || {};
      const lanes = xs => (xs || []).join(", ");
      switch (e.type) {
        case "client_reactivation":
          return `Usually ships every ${f.usually_ships_every_days} days — ${f.days_since_last_shipment} days since the last shipment.`;
        case "client_volume_drop":
          return `Last 13 weeks: ${Math.abs(f.volume_change_percent)}% below their 12-month weekly average.`;
        case "client_volume_growth":
          return `Last 13 weeks: ${f.volume_change_percent}% above their 12-month weekly average.`;
        case "client_rate_review":
          return `${f.quotes_lost_on_price_last_12_months} quotes on ${f.lane} lost on price in the last 12 months.`;
        case "client_new_lanes":
          return `Ships ${lanes(f.usual_lanes)} with us; we also run ${lanes(f.lanes_we_run)}.`;
        default:
          return "";
      }
    },
    openEmail(e) {
      this.composing = e;
      this.sendError = null;
      if (e.subject) {
        this.fill(e);
      } else {
        this.draftEmail(e);
      }
    },
    fill(e) {
      this.form = {
        to: e.to.join(", "),
        cc: e.cc.join(", "),
        subject: e.subject || "",
        body: e.body || ""
      };
    },
    draftEmail(e) {
      this.drafting = true;
      this.draftSeconds = 0;
      this.sendError = null;
      const ticker = setInterval(() => {
        this.draftSeconds += 1;
      }, 1000);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/sales/outreach/${e.id}/draft`, {}).then(({
        data
      }) => {
        Object.assign(e, data);
        this.writtenBy = data.written_by;
        if (this.composing === e) this.fill(e);
      }).catch(err => {
        this.sendError = this.readable(err, "Could not write the draft. Try again.");
      }).finally(() => {
        clearInterval(ticker);
        this.drafting = false;
      });
    },
    send() {
      const e = this.composing;
      this.sending = true;
      this.sendError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/sales/outreach/${e.id}/send`, {
        to: list(this.form.to),
        cc: list(this.form.cc),
        subject: this.form.subject,
        body: this.form.body
      }).then(() => {
        this.emails = this.emails.filter(x => x.id !== e.id);
        this.composing = null;
      }).catch(err => {
        this.sendError = this.readable(err, "Not sent. Try again.");
      }).finally(() => {
        this.sending = false;
      });
    },
    dismiss(e) {
      const d = this.dismissing;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/sales/outreach/${e.id}/dismiss`, {
        reason: d.reason,
        note: d.note || null
      }).then(() => {
        this.emails = this.emails.filter(x => x.id !== e.id);
        this.dismissing = null;
        this.loadDismissed();
      }).catch(err => {
        d.error = this.readable(err, "Not dismissed. Try again.");
      });
    },
    loadDismissed() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sales/outreach/dismissed").then(({
        data
      }) => {
        this.dismissed = data.dismissed || [];
        this.dismissedByReason = data.by_reason || {};
        this.dismissReasons = Object.keys(this.dismissReasons).length ? this.dismissReasons : data.reasons;
      }).catch(() => {
        this.dismissed = [];
      });
    },
    readable(err, fallback) {
      const d = err.response && err.response.data || {};
      if (d.errors) return Object.values(d.errors).flat()[0];
      return d.error || d.message || fallback;
    },
    loadCharts() {
      let url = "/sales/charts?grain=" + this.grain;
      if (this.grain === "year") url += "&basis=" + this.basis;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(url).then(({
        data
      }) => {
        this.charts = data;
      })
      /* Charts failing must not take the worklist down with it: Today's Actions is
         the part a rep acts on, and it comes from a different call. */.catch(() => {
        this.charts = null;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * One chart, themed from the design tokens.
 *
 * 🔴 **THE PALETTE IS READ FROM CSS CUSTOM PROPERTIES, NOT HARD-CODED.** ApexCharts
 * takes hex strings, so a chart written with literal colours would ignore the token
 * system entirely — and would keep its light-mode palette when dark mode is switched
 * on. Reading `--status-*` off the document at build time keeps one source of truth.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FxChart",
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "line"
    },
    series: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: 260
    },
    emptyMessage: {
      type: String,
      default: "Nothing to chart yet."
    }
  },
  computed: {
    hasData() {
      /* Defensive by design: this component is handed series from three different
         shapes (line objects, a bare number array for the donut) and one bad frame
         during a reload must not take the whole dashboard section down with it. */
      const series = Array.isArray(this.series) ? this.series : [];
      if (!series.length) return false;
      return series.some(s => {
        if (s === null || s === undefined) return false;
        if (typeof s === "number") return true; // donut slice
        if (Array.isArray(s)) return s.length > 0;
        return Array.isArray(s.data) ? s.data.length > 0 : s.data !== undefined;
      });
    },
    merged() {
      const token = (name, fallback) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name);
        return v && v.trim() || fallback;
      };
      return Object.assign({
        chart: {
          toolbar: {
            show: false
          },
          fontFamily: token("--font-sans", "sans-serif"),
          animations: {
            enabled: false
          } // a dashboard read all day should not move
        },
        colors: [token("--status-info", "#1F5FA8"), token("--status-success", "#1F7A48"), token("--status-critical", "#C4342B"), token("--status-warning", "#9A6400"), token("--status-neutral", "#5A6472")],
        grid: {
          borderColor: token("--border", "#D8DCE3"),
          strokeDashArray: 3
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          fontSize: "12px",
          labels: {
            colors: token("--text-secondary", "#5A6472")
          }
        },
        tooltip: {
          theme: "light"
        },
        xaxis: {
          labels: {
            style: {
              colors: token("--text-secondary", "#5A6472"),
              fontSize: "11px"
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: token("--text-secondary", "#5A6472"),
              fontSize: "11px"
            }
          }
        }
      }, this.options);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=template&id=2ded4d30":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=template&id=2ded4d30 ***!
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
  }, [_vm._v(_vm._s(_vm.designation === "sales" ? "Dashboard" : "Sales"))]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm.scope === "my_book" ? [_vm._v("Your client book, " + _vm._s(_vm.modeLabel) + ".")] : [_vm._v("Branch performance, " + _vm._s(_vm.modeLabel) + ". Client attribution needs Command.")]], 2)]), _vm._v(" "), _vm.staleness && _vm.staleness.reason === "never_computed" ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n    No rollup has run yet, so there are no figures to show. This is not a branch that\n    shipped nothing — it is a branch nobody has computed. Run "), _c("code", [_vm._v("sales:compute-snapshots")]), _vm._v(".\n  ")]) : _vm.staleness && _vm.staleness.is_stale ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n    Figures are " + _vm._s(_vm.staleness.age_minutes) + " minutes old. The rollup is overdue.\n  ")]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("section", {
    staticClass: "fx-section",
    attrs: {
      "data-help": "client-emails"
    }
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Client emails")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-outreach__intro"
  }, [_vm._v("Suggested from each client's shipping trends. You read, edit and send every email yourself.")]), _vm._v(" "), _vm.outreachLoaded && !_vm.hasMailbox ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n        Emails go from your own mailbox. "), _c("router-link", {
    attrs: {
      to: "/mailboxes"
    }
  }, [_vm._v("Connect your mailbox")]), _vm._v(" before sending.\n      ")], 1) : _vm._e(), _vm._v(" "), _vm.outreachLoaded && !_vm.emails.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("No client emails suggested right now.")]) : _c("ul", {
    staticClass: "fx-outreach"
  }, _vm._l(_vm.emails, function (e) {
    return _c("li", {
      key: e.id,
      staticClass: "fx-outreach__card"
    }, [_c("div", {
      staticClass: "fx-outreach__head"
    }, [_c("strong", [_vm._v(_vm._s(e.client || e.domain))]), _vm._v(" "), _c("span", {
      staticClass: "fx-chip"
    }, [_vm._v(_vm._s(_vm.typeLabel(e.type)))])]), _vm._v(" "), _c("p", {
      staticClass: "fx-outreach__why"
    }, [_vm._v(_vm._s(_vm.summary(e)))]), _vm._v(" "), _vm.dismissing && _vm.dismissing.id === e.id ? _c("form", {
      staticClass: "fx-outreach__dismiss",
      on: {
        submit: function ($event) {
          $event.preventDefault();
          return _vm.dismiss(e);
        }
      }
    }, [_c("label", {
      staticClass: "fx-field"
    }, [_c("span", {
      staticClass: "fx-field__label"
    }, [_vm._v("Why dismiss?")]), _vm._v(" "), _c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.dismissing.reason,
        expression: "dismissing.reason"
      }],
      staticClass: "fx-input",
      attrs: {
        required: ""
      },
      on: {
        change: function ($event) {
          var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
            return o.selected;
          }).map(function (o) {
            var val = "_value" in o ? o._value : o.value;
            return val;
          });
          _vm.$set(_vm.dismissing, "reason", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [_c("option", {
      attrs: {
        value: "",
        disabled: ""
      }
    }, [_vm._v("Choose a reason")]), _vm._v(" "), _vm._l(_vm.dismissReasons, function (label, key) {
      return _c("option", {
        key: key,
        domProps: {
          value: key
        }
      }, [_vm._v(_vm._s(label))]);
    })], 2)]), _vm._v(" "), _vm.dismissing.reason ? _c("input", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.dismissing.note,
        expression: "dismissing.note"
      }],
      staticClass: "fx-input",
      attrs: {
        maxlength: "500",
        required: _vm.dismissing.reason === "other",
        placeholder: _vm.dismissing.reason === "other" ? "What was wrong with this suggestion?" : "Anything to add (optional)"
      },
      domProps: {
        value: _vm.dismissing.note
      },
      on: {
        input: function ($event) {
          if ($event.target.composing) return;
          _vm.$set(_vm.dismissing, "note", $event.target.value);
        }
      }
    }) : _vm._e(), _vm._v(" "), _vm.dismissing.error ? _c("p", {
      staticClass: "fx-error",
      attrs: {
        role: "alert"
      }
    }, [_vm._v(_vm._s(_vm.dismissing.error))]) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "fx-outreach__actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: !_vm.dismissing.reason
      }
    }, [_vm._v("Dismiss")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        type: "button"
      },
      on: {
        click: function ($event) {
          _vm.dismissing = null;
        }
      }
    }, [_vm._v("Cancel")])])]) : _c("div", {
      staticClass: "fx-outreach__actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--primary",
      on: {
        click: function ($event) {
          return _vm.openEmail(e);
        }
      }
    }, [_vm._v(_vm._s(e.subject ? "Open draft" : "✉ Draft email"))]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          _vm.dismissing = {
            id: e.id,
            reason: "",
            note: "",
            error: null
          };
        }
      }
    }, [_vm._v("Dismiss")])])]);
  }), 0), _vm._v(" "), _vm.dismissed.length ? _c("details", {
    staticClass: "fx-outreach__history"
  }, [_c("summary", [_vm._v("Dismissed in the last 90 days (" + _vm._s(_vm.dismissed.length) + ")")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-outreach__note"
  }, _vm._l(_vm.dismissedByReason, function (n, key) {
    return _c("span", {
      key: key
    }, [_vm._v(_vm._s(_vm.dismissReasons[key] || key) + ": " + _vm._s(n) + " · ")]);
  }), 0), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Suggestion")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Why")]), _vm._v(" "), _vm.dismissed.some(d => d.rep) ? _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("By")]) : _vm._e(), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("When")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.dismissed, function (d) {
    return _c("tr", {
      key: d.id
    }, [_c("td", [_vm._v(_vm._s(d.client || d.domain))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.typeLabel(d.type)))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.dismissReasons[d.reason] || d.reason)), d.note ? [_vm._v(" — " + _vm._s(d.note))] : _vm._e()], 2), _vm._v(" "), _vm.dismissed.some(x => x.rep) ? _c("td", [_vm._v(_vm._s(d.rep))]) : _vm._e(), _vm._v(" "), _c("td", [_c("Figure", {
      attrs: {
        value: d.dismissed_at,
        kind: "date"
      }
    })], 1)]);
  }), 0)])]) : _vm._e()]), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Today's actions")]), _vm._v(" "), !_vm.actions.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing ranked right now.")]) : _c("ol", {
    staticClass: "fx-actions"
  }, _vm._l(_vm.actions, function (a) {
    return _c("li", {
      key: a.id,
      staticClass: "fx-action"
    }, [_c("div", {
      staticClass: "fx-action__head"
    }, [_c("StatusChip", {
      attrs: {
        value: a.action_type
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "fx-action__score"
    }, [_vm._v(_vm._s(Math.round(a.priority_score)))])], 1), _vm._v(" "), a.narrated_text ? _c("p", {
      staticClass: "fx-action__text"
    }, [_vm._v(_vm._s(a.narrated_text))]) : _c("p", {
      staticClass: "fx-muted fx-action__text"
    }, [_vm._v("\n            Not narrated. The figures below are the whole finding.\n          ")]), _vm._v(" "), a.facts ? _c("dl", {
      staticClass: "fx-defs fx-action__facts"
    }, [_vm._l(a.facts, function (v, k) {
      return [_c("dt", {
        key: k + "-k"
      }, [_vm._v(_vm._s(String(k).replace(/_/g, " ")))]), _vm._v(" "), _c("dd", {
        key: k + "-v"
      }, [_vm._v(_vm._s(v))])];
    })], 2) : _vm._e(), _vm._v(" "), a.impact_value ? _c("p", {
      staticClass: "fx-action__impact"
    }, [_vm._v("\n            At stake "), _c("Figure", {
      attrs: {
        value: a.impact_value,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1) : _vm._e()]);
  }), 0)]), _vm._v(" "), _vm.charts ? _c("section", {
    staticClass: "fx-section fx-charts"
  }, [_c("FxChart", {
    attrs: {
      title: "Tonnage & shipments",
      type: "line",
      series: _vm.tonnageSeries,
      options: _vm.tonnageOptions,
      "empty-message": "No lane statistics yet. They appear after the first rollup that finds a converted enquiry with a lane."
    }
  }), _vm._v(" "), _c("FxChart", {
    attrs: {
      title: "Top lanes by tonnage",
      type: "bar",
      series: _vm.laneSeries,
      options: _vm.laneOptions,
      "empty-message": "No lanes recorded yet."
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "fx-funnel"
  }, [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Win / loss over")]), _vm._v(" "), _c("select", {
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
      }, _vm.loadCharts]
    }
  }, [_c("option", {
    attrs: {
      value: "day"
    }
  }, [_vm._v("The last 24 days")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "month"
    }
  }, [_vm._v("The last 24 months")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "year"
    }
  }, [_vm._v("The last 2 years")])])]), _vm._v(" "), _vm.grain === "year" ? _c("label", {
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
      }, _vm.loadCharts]
    }
  }, [_c("option", {
    attrs: {
      value: "fiscal"
    }
  }, [_vm._v("Fiscal (Apr–Mar)")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "calendar"
    }
  }, [_vm._v("Calendar")])])]) : _vm._e()]), _vm._v(" "), _c("FxChart", {
    attrs: {
      title: "Win / loss",
      type: "donut",
      series: _vm.funnelSeries,
      options: _vm.funnelOptions,
      "empty-message": "No closed enquiries in this window."
    }
  })], 1)], 1) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v(_vm._s(_vm.scope === "my_book" ? "My book" : "Branch"))]), _vm._v(" "), _c("div", {
    staticClass: "fx-tiles"
  }, _vm._l(_vm.tiles, function (t) {
    return _c("div", {
      key: t.label,
      staticClass: "fx-tile"
    }, [_c("span", {
      staticClass: "fx-tile__label"
    }, [_vm._v(_vm._s(t.label))]), _vm._v(" "), _c("span", {
      staticClass: "fx-tile__value"
    }, [_c("Figure", {
      attrs: {
        value: t.value,
        kind: t.kind,
        "currency-code": t.kind === "currency" ? "INR" : null
      }
    })], 1)]);
  }), 0)]), _vm._v(" "), _vm.book.length ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h2", {
    staticClass: "fx-section__title"
  }, [_vm._v("Accounts")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.book, function (c) {
    return _c("tr", {
      key: c.customer_id + "-" + c.transport_mode
    }, [_c("td", [_vm._v(_vm._s(c.name))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: c.risk_band
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: c.tonnage_ytd,
        kind: "weight"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: c.revenue_mtd,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: c.win_rate,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: c.outstanding_60_plus,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]);
  }), 0)])]) : _vm._e()], _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: !!_vm.composing,
      title: _vm.composing ? "Email to " + (_vm.composing.client || _vm.composing.domain) : "",
      subtitle: _vm.composing ? _vm.summary(_vm.composing) : null
    },
    on: {
      close: function ($event) {
        _vm.composing = null;
      }
    },
    scopedSlots: _vm._u([{
      key: "footer",
      fn: function () {
        return [_c("button", {
          staticClass: "fx-btn",
          attrs: {
            disabled: _vm.drafting || _vm.sending
          },
          on: {
            click: function ($event) {
              return _vm.draftEmail(_vm.composing);
            }
          }
        }, [_vm._v("Redraft")]), _vm._v(" "), _c("button", {
          staticClass: "fx-btn fx-btn--primary",
          attrs: {
            disabled: _vm.drafting || _vm.sending || !_vm.form.to.trim()
          },
          on: {
            click: _vm.send
          }
        }, [_vm._v("\n        " + _vm._s(_vm.sending ? "Sending…" : "Send") + "\n      ")])];
      },
      proxy: true
    }])
  }, [_vm.composing ? [_vm.drafting ? _c("p", {
    staticClass: "fx-muted",
    attrs: {
      role: "status"
    }
  }, [_vm._v("Writing the draft… " + _vm._s(_vm.draftSeconds) + " s")]) : [_c("p", {
    staticClass: "fx-muted fx-outreach__note"
  }, [_vm._v("\n          " + _vm._s(_vm.writtenBy === "ai" ? "Drafted by AI from the figures above." : "A starting draft from the figures above.") + "\n          Read it and change anything before you send.\n        ")]), _vm._v(" "), !_vm.showsClientNames ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("Write the client's company name where it says [Company name].")]) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("To")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.to,
      expression: "form.to"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "name@client.com, …"
    },
    domProps: {
      value: _vm.form.to
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "to", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Cc")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.cc,
      expression: "form.cc"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "Optional"
    },
    domProps: {
      value: _vm.form.cc
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "cc", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Subject")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.subject,
      expression: "form.subject"
    }],
    staticClass: "fx-input",
    domProps: {
      value: _vm.form.subject
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "subject", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("MailEditor", {
    model: {
      value: _vm.form.body,
      callback: function ($$v) {
        _vm.$set(_vm.form, "body", $$v);
      },
      expression: "form.body"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-outreach__note"
  }, [_vm._v("Your mailbox signature is added when it is sent.")]), _vm._v(" "), _vm.sendError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.sendError))]) : _vm._e()]] : _vm._e()], 2)], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Risk")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Tonnage YTD")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Revenue MTD")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Win rate")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Outstanding 60+")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=template&id=0bc97cbb":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=template&id=0bc97cbb ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-chart"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), !_vm.hasData ? _c("p", {
    staticClass: "fx-muted fx-chart__empty"
  }, [_vm._v("\n    " + _vm._s(_vm.emptyMessage) + "\n  ")]) : _c("apexchart", {
    attrs: {
      type: _vm.type,
      height: _vm.height,
      options: _vm.merged,
      series: _vm.series
    }
  })], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/SalesDashboard.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/SalesDashboard.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SalesDashboard_vue_vue_type_template_id_2ded4d30__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SalesDashboard.vue?vue&type=template&id=2ded4d30 */ "./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=template&id=2ded4d30");
/* harmony import */ var _SalesDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SalesDashboard.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SalesDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SalesDashboard_vue_vue_type_template_id_2ded4d30__WEBPACK_IMPORTED_MODULE_0__.render,
  _SalesDashboard_vue_vue_type_template_id_2ded4d30__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/SalesDashboard.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/FxChart.vue":
/*!********************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/FxChart.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FxChart_vue_vue_type_template_id_0bc97cbb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FxChart.vue?vue&type=template&id=0bc97cbb */ "./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=template&id=0bc97cbb");
/* harmony import */ var _FxChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FxChart.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FxChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FxChart_vue_vue_type_template_id_0bc97cbb__WEBPACK_IMPORTED_MODULE_0__.render,
  _FxChart_vue_vue_type_template_id_0bc97cbb__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/FxChart.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SalesDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SalesDashboard.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SalesDashboard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=script&lang=js":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=script&lang=js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FxChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FxChart.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FxChart_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=template&id=2ded4d30":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=template&id=2ded4d30 ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SalesDashboard_vue_vue_type_template_id_2ded4d30__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SalesDashboard_vue_vue_type_template_id_2ded4d30__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SalesDashboard_vue_vue_type_template_id_2ded4d30__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SalesDashboard.vue?vue&type=template&id=2ded4d30 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/SalesDashboard.vue?vue&type=template&id=2ded4d30");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=template&id=0bc97cbb":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=template&id=0bc97cbb ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FxChart_vue_vue_type_template_id_0bc97cbb__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FxChart_vue_vue_type_template_id_0bc97cbb__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FxChart_vue_vue_type_template_id_0bc97cbb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FxChart.vue?vue&type=template&id=0bc97cbb */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/FxChart.vue?vue&type=template&id=0bc97cbb");


/***/ })

}]);