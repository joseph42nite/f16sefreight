"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_CloseMonth_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "CloseMonth",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    steps: [],
    period: null,
    periods: [],
    branches: [],
    periodId: null,
    canClose: false,
    blockedBy: null,
    note: "",
    open: null,
    confirming: false,
    reopening: null,
    loading: true,
    busy: false,
    error: null,
    actionError: null,
    downloading: false,
    /** ④ The month being filed, and the figures for it when it is not the month the server offered. */
    gstMonth: null,
    gstFigures: null,
    gstLoading: false
  }),
  computed: {
    subtitle() {
      if (!this.period) return "The months the ledger is open for.";
      return this.period.status !== "open" ? this.period.period_name + " is closed." : this.canClose ? this.period.period_name + " is ready to close." : "Clear " + (this.blockedBy || "the blocking step") + " before " + this.period.period_name + " can close.";
    },
    /** What is still open but does not stop the close — said out loud in the confirmation, not hidden. */
    warnings() {
      return this.steps.filter(s => !s.blocking && !s.clear && s.count > 0 && s.key !== "close").map(s => s.count + " " + s.label.replace("?", "").toLowerCase());
    }
  },
  created() {
    this.load();
  },
  methods: {
    /*
     * The return as a file. Two formats, both from the same computation:
     *   • csv  — what the desk reconciles by eye, exceptions included at the bottom
     *   • gstn — the offline utility's JSON
     * 🔴 The month comes from the SERVER's step, not from this component: a return is filed per calendar
     * month and the server decides which month that is for the selected period.
     */
    /* The server's figures for the month it chose, or the ones fetched for the month the desk picked. */
    figuresFor(step) {
      return this.gstFigures || step.return || {};
    },
    /*
     * ⚠️ The summary for a month other than the one the server offered comes from the RETURN endpoint, not
     * recomputed here — the figures on the screen and the figures in the file are then the same computation,
     * which is the only way a download can be trusted to match what was read before clicking it.
     */
    loadReturn() {
      const step = this.steps.find(s => s.key === "gst");
      if (!step || !this.gstMonth || this.gstMonth === step.return_month) {
        this.gstFigures = null;
        return;
      }
      this.gstLoading = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query(`/reports/gstr1?agent_id=${this.period.agent_id}&month=${this.gstMonth}`).then(({
        data
      }) => {
        this.gstFigures = {
          documents: data.totals.documents,
          taxable_value: data.totals.taxable_value,
          cgst: data.totals.cgst,
          sgst: data.totals.sgst,
          igst: data.totals.igst,
          tax: data.totals.tax,
          not_filed: data.exceptions.length,
          not_filed_value: data.exceptions.reduce((t, e) => t + Number(e.taxable_value || 0), 0),
          warnings: data.warnings.length
        };
      }).catch(e => {
        this.actionError = this.messageFor(e);
        this.gstFigures = null;
      }).finally(() => {
        this.gstLoading = false;
      });
    },
    download(which, format) {
      const step = this.steps.find(s => s.key === "gst");
      if (!step || !step.return_month) {
        this.actionError = "There is no month to file for yet.";
        return;
      }
      this.downloading = true;
      this.actionError = null;
      const month = this.gstMonth || step.return_month;
      const query = `?agent_id=${this.period.agent_id}&month=${month}&format=${format}`;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query(`/reports/${which}${query}`, {
        responseType: "blob"
      }).then(({
        data
      }) => {
        const type = format === "csv" ? "text/csv" : "application/json";
        const url = window.URL.createObjectURL(new Blob([data], {
          type
        }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `${which.toUpperCase()}-${month}.${format === "csv" ? "csv" : "json"}`;
        link.click();
        setTimeout(() => window.URL.revokeObjectURL(url), 30000);
      }).catch(() => {
        this.actionError = "The return could not be built.";
      }).finally(() => {
        this.downloading = false;
      });
    },
    branchName(id) {
      const b = this.branches.find(x => x.id === id);
      return b ? b.name : "—";
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/close-month" + (this.periodId ? "?period_id=" + this.periodId : "")).then(({
        data
      }) => {
        this.steps = data.steps || [];
        this.period = data.period;
        // ④ follows the server's chosen month until the desk picks another one.
        const gst = this.steps.find(x => x.key === "gst");
        this.gstMonth = gst ? gst.return_month : null;
        this.gstFigures = null;
        this.periods = data.periods || [];
        this.branches = data.branches || [];
        this.canClose = !!data.can_close;
        this.blockedBy = data.blocked_by;
        this.note = data.note || "";
        if (this.period) this.periodId = this.period.id;
        this.error = null;
      }).catch(e => {
        this.error = e.response && e.response.data && e.response.data.error || "The month could not be read.";
      }).finally(() => {
        this.loading = false;
      });
    },
    reopen() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/reports/periods/${this.period.id}/reopen`, {
        reason: this.reopening.reason
      }).then(() => {
        this.reopening = null;
        this.load();
      }).catch(e => {
        const data = e.response && e.response.data;
        this.actionError = data && (data.error || data.message) || "The period would not reopen.";
      }).finally(() => {
        this.busy = false;
      });
    },
    close() {
      this.busy = true;
      this.actionError = null;
      // 🔴 The server checks the unposted queue again independently — this screen shows the rule early, it does
      // not replace it.
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/reports/periods/${this.period.id}/close`, {}).then(() => {
        this.confirming = false;
        this.load();
      }).catch(e => {
        this.actionError = e.response && e.response.data && e.response.data.error || "The period would not close.";
      }).finally(() => {
        this.busy = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=template&id=49fd85b0":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=template&id=49fd85b0 ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_vm._v("Close the month")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      " + _vm._s(_vm.subtitle) + "\n      "), _c("router-link", {
    attrs: {
      to: "/financials"
    }
  }, [_vm._v("Registers & reports →")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_vm.periods.length ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Period")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.periodId,
      expression: "periodId"
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
        _vm.periodId = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, _vm._l(_vm.periods, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v("\n          " + _vm._s(p.period_name) + _vm._s(_vm.branches.length > 1 ? " · " + _vm.branchName(p.agent_id) : "") + " · " + _vm._s(p.status) + "\n        ")]);
  }), 0)]) : _vm._e()]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.period ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.note))]) : [_c("ol", {
    staticClass: "fx-steps"
  }, _vm._l(_vm.steps, function (s) {
    return _c("li", {
      key: s.key,
      staticClass: "fx-steps__item",
      class: {
        "is-clear": s.clear
      }
    }, [_c("span", {
      staticClass: "fx-steps__number",
      class: {
        "is-done": s.clear,
        "is-blocking": s.blocking && !s.clear
      }
    }, [_vm._v("\n          " + _vm._s(s.step) + "\n        ")]), _vm._v(" "), _c("div", {
      staticClass: "fx-steps__body"
    }, [_c("h2", {
      staticClass: "fx-steps__title"
    }, [_vm._v("\n            " + _vm._s(s.label) + "\n            "), s.clear ? _c("StatusChip", {
      attrs: {
        value: "clear"
      }
    }) : s.blocking ? _c("StatusChip", {
      attrs: {
        value: "blocking"
      }
    }) : _c("StatusChip", {
      attrs: {
        value: "check_this"
      }
    }), _vm._v(" "), s.count ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(s.count))]) : _vm._e()], 1), _vm._v(" "), _c("p", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(s.note))]), _vm._v(" "), s.key === "statements" && s.figures ? _c("dl", {
      staticClass: "fx-defs"
    }, [_c("dt", [_vm._v("Revenue")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: s.figures.revenue,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("dt", [_vm._v("Cost")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: s.figures.expense,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("dt", [_vm._v("Net")]), _vm._v(" "), _c("dd", [_c("strong", [_c("Figure", {
      attrs: {
        value: s.figures.net,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]), _vm._v(" "), _c("dt", [_vm._v("Debits / credits")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: s.figures.debits,
        kind: "currency",
        "currency-code": "INR"
      }
    }), _vm._v(" /\n              "), _c("Figure", {
      attrs: {
        value: s.figures.credits,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]) : _vm._e(), _vm._v(" "), s.key === "gst" ? [!s.gstin ? _c("p", {
      staticClass: "fx-error"
    }, [_vm._v("\n              This branch has no GSTIN, so no return can be filed. Set it in\n              "), _c("router-link", {
      attrs: {
        to: "/settings/finance"
      }
    }, [_vm._v("Settings → Finance")]), _vm._v(".\n            ")], 1) : s.return ? [_c("p", {
      staticClass: "fx-muted"
    }, [_vm._v("\n                A return is filed for one calendar month"), s.return_is_one_month_of ? [_vm._v(", and this\n                period covers " + _vm._s(s.return_is_one_month_of))] : _vm._e(), _vm._v(".\n              ")], 2), _vm._v(" "), _c("div", {
      staticClass: "fx-toolbar"
    }, [_c("label", {
      staticClass: "fx-field"
    }, [_c("span", {
      staticClass: "fx-field__label"
    }, [_vm._v("Month to file")]), _vm._v(" "), _c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.gstMonth,
        expression: "gstMonth"
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
          _vm.gstMonth = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
        }, _vm.loadReturn]
      }
    }, _vm._l(s.return_months, function (m) {
      return _c("option", {
        key: m.month,
        domProps: {
          value: m.month
        }
      }, [_vm._v("\n                      " + _vm._s(m.month) + " — " + _vm._s(m.documents) + " document(s)\n                    ")]);
    }), 0)])]), _vm._v(" "), _vm.gstLoading ? _c("p", {
      staticClass: "fx-muted"
    }, [_vm._v("Working out the return…")]) : _c("dl", {
      staticClass: "fx-defs"
    }, [_c("dt", [_vm._v("Documents")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.figuresFor(s).documents))]), _vm._v(" "), _c("dt", [_vm._v("Taxable value")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: _vm.figuresFor(s).taxable_value,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("dt", [_vm._v("CGST / SGST")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: _vm.figuresFor(s).cgst,
        kind: "currency",
        "currency-code": "INR"
      }
    }), _vm._v(" /\n                  "), _c("Figure", {
      attrs: {
        value: _vm.figuresFor(s).sgst,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("dt", [_vm._v("IGST")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: _vm.figuresFor(s).igst,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("dt", [_vm._v("Tax")]), _vm._v(" "), _c("dd", [_c("strong", [_c("Figure", {
      attrs: {
        value: _vm.figuresFor(s).tax,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)])]), _vm._v(" "), _vm.figuresFor(s).not_filed ? _c("p", {
      staticClass: "fx-error"
    }, [_vm._v("\n                " + _vm._s(_vm.figuresFor(s).not_filed) + " document(s) worth\n                "), _c("Figure", {
      attrs: {
        value: _vm.figuresFor(s).not_filed_value,
        kind: "currency",
        "currency-code": "INR"
      }
    }), _vm._v("\n                cannot be filed. They are listed in the file, at the bottom, with what is missing from each.\n              ")], 1) : _vm._e(), _vm._v(" "), _vm.figuresFor(s).warnings ? _c("p", {
      staticClass: "fx-muted"
    }, [_vm._v("\n                " + _vm._s(_vm.figuresFor(s).warnings) + " document(s) are filed with something to check — a split the\n                register disagrees with, or a charge line with no HSN/SAC code. Both are named in the file.\n              ")]) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "fx-toolbar"
    }, [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.downloading
      },
      on: {
        click: function ($event) {
          return _vm.download("gstr1", "csv");
        }
      }
    }, [_vm._v("\n                  GSTR-1 (CSV)\n                ")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.downloading
      },
      on: {
        click: function ($event) {
          return _vm.download("gstr1", "gstn");
        }
      }
    }, [_vm._v("\n                  GSTR-1 (portal JSON)\n                ")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.downloading
      },
      on: {
        click: function ($event) {
          return _vm.download("gstr3b", "csv");
        }
      }
    }, [_vm._v("\n                  GSTR-3B (CSV)\n                ")])])] : _vm._e()] : s.key === "tds" ? [_c("dl", {
      staticClass: "fx-defs"
    }, [_c("dt", [_vm._v("Withheld in " + _vm._s(s.month))]), _vm._v(" "), _c("dd", [_c("strong", [_c("Figure", {
      attrs: {
        value: s.withheld,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1)]), _vm._v(" "), _c("dt", [_vm._v("Due to the government")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: s.due_on,
        kind: "date"
      }
    }), _vm._v(" "), s.overdue ? _c("StatusChip", {
      attrs: {
        value: "overdue"
      }
    }) : _vm._e()], 1), _vm._v(" "), _c("dt", [_vm._v("Deducted from us this period")]), _vm._v(" "), _c("dd", [_c("Figure", {
      attrs: {
        value: s.claimable,
        kind: "currency",
        "currency-code": "INR"
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("ours to claim, no deadline")])], 1)]), _vm._v(" "), s.unclassified_vendors ? _c("p", {
      staticClass: "fx-muted"
    }, [_vm._v("\n              " + _vm._s(s.unclassified_vendors) + " vendor(s) paid this period have no TDS section set, so nothing\n              was withheld from them. That is correct for most payees and a missed deduction for a\n              contractor — the register names them.\n            ")]) : _vm._e()] : s.rows && s.rows.length ? [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          _vm.open === s.key ? _vm.open = null : _vm.open = s.key;
        }
      }
    }, [_vm._v("\n              " + _vm._s(_vm.open === s.key ? "Hide" : "Show") + " " + _vm._s(s.rows.length) + _vm._s(s.count > s.rows.length ? " of " + s.count : "") + "\n            ")]), _vm._v(" "), _vm.open === s.key ? _c("table", {
      staticClass: "fx-table"
    }, [_c("thead", [_c("tr", [_c("th", {
      attrs: {
        scope: "col"
      }
    }, [_vm._v(_vm._s(s.key === "billed" ? "Shipment" : "Document"))]), _vm._v(" "), _c("th", {
      attrs: {
        scope: "col"
      }
    }, [_vm._v(_vm._s(s.key === "billed" ? "Finished" : "Organization"))]), _vm._v(" "), _c("th", {
      staticClass: "fx-num",
      attrs: {
        scope: "col"
      }
    }, [_vm._v("Amount")]), _vm._v(" "), _c("th", {
      attrs: {
        scope: "col"
      }
    })])]), _vm._v(" "), _c("tbody", _vm._l(s.rows, function (r, i) {
      return _c("tr", {
        key: s.key + "-" + i
      }, [_c("td", {
        staticClass: "identifier"
      }, [_vm._v(_vm._s(r.job_no || r.number || r.invoice_no || "—"))]), _vm._v(" "), _c("td", [s.key === "billed" ? [r.completed_at ? _c("Figure", {
        attrs: {
          value: r.completed_at,
          kind: "date"
        }
      }) : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("—")])] : [_vm._v(_vm._s(r.customer || "—"))]], 2), _vm._v(" "), _c("td", {
        staticClass: "fx-num"
      }, [r.grand_total || r.net_amount ? _c("Figure", {
        attrs: {
          value: r.grand_total || r.net_amount,
          kind: "currency",
          "currency-code": "INR"
        }
      }) : _c("span", {
        staticClass: "fx-muted"
      }, [_vm._v("—")])], 1), _vm._v(" "), _c("td", {
        staticClass: "fx-muted"
      }, [_vm._v(_vm._s(r.waiting_for || r.gst_no || r.mode || ""))])]);
    }), 0)]) : _vm._e()] : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "fx-toolbar"
    }, [s.to ? _c("router-link", {
      staticClass: "fx-btn",
      attrs: {
        to: s.to
      }
    }, [_vm._v("\n              " + _vm._s(s.clear ? "Look anyway" : "Go and clear it") + "\n            ")]) : _vm._e(), _vm._v(" "), s.key === "close" && _vm.period.status === "open" ? _c("button", {
      staticClass: "fx-btn fx-btn--primary",
      attrs: {
        disabled: _vm.busy || !_vm.canClose
      },
      on: {
        click: function ($event) {
          _vm.confirming = true;
        }
      }
    }, [_vm._v(_vm._s(_vm.busy ? "Closing…" : "Close " + _vm.period.period_name))]) : _vm._e(), _vm._v(" "), s.key === "close" && s.can_reopen ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          _vm.reopening = {
            reason: ""
          };
        }
      }
    }, [_vm._v("Reopen " + _vm._s(_vm.period.period_name))]) : s.key === "close" && s.reopen_blocked_by ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("\n              Reopen " + _vm._s(s.reopen_blocked_by) + " first.\n            ")]) : _vm._e()], 1)], 2)]);
  }), 0), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()], _vm._v(" "), _vm.reopening ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "reopen-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "reopen-title"
    }
  }, [_vm._v("Reopen " + _vm._s(_vm.period.period_name) + "?")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("p", [_vm._v("\n          Documents dated inside " + _vm._s(_vm.period.period_name) + " will be able to post again. Anything already reported\n          from this month — the P&L, the balance sheet, a filed return — was worked out on the figures as\n          they stand now, and posting into it will move them.\n        ")]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Why are you reopening it?")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.reopening.reason,
      expression: "reopening.reason"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "the airline's September invoice arrived late"
    },
    domProps: {
      value: _vm.reopening.reason
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.reopening, "reason", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("It stays on the period, with your name and today's date.")]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.reopening = null;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.reopening.reason.trim()
    },
    on: {
      click: _vm.reopen
    }
  }, [_vm._v("\n          Reopen it\n        ")])])])]) : _vm._e(), _vm._v(" "), _vm.confirming ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "close-title"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title",
    attrs: {
      id: "close-title"
    }
  }, [_vm._v("Close " + _vm._s(_vm.period.period_name) + "?")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("p", [_vm._v("\n          Nothing will be able to post into " + _vm._s(_vm.period.period_name) + " afterwards — an invoice dated inside it\n          will be refused at the ledger until somebody reopens it.\n        ")]), _vm._v(" "), _vm.warnings.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Still open, and not blocking: " + _vm._s(_vm.warnings.join("; ")) + ".\n        ")]) : _vm._e(), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        _vm.confirming = false;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.close
    }
  }, [_vm._v("Close it")])])])]) : _vm._e()], 2);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/CloseMonth.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/CloseMonth.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CloseMonth_vue_vue_type_template_id_49fd85b0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CloseMonth.vue?vue&type=template&id=49fd85b0 */ "./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=template&id=49fd85b0");
/* harmony import */ var _CloseMonth_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CloseMonth.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _CloseMonth_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CloseMonth_vue_vue_type_template_id_49fd85b0__WEBPACK_IMPORTED_MODULE_0__.render,
  _CloseMonth_vue_vue_type_template_id_49fd85b0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/CloseMonth.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseMonth_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CloseMonth.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseMonth_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=template&id=49fd85b0":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=template&id=49fd85b0 ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseMonth_vue_vue_type_template_id_49fd85b0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseMonth_vue_vue_type_template_id_49fd85b0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CloseMonth_vue_vue_type_template_id_49fd85b0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CloseMonth.vue?vue&type=template&id=49fd85b0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/CloseMonth.vue?vue&type=template&id=49fd85b0");


/***/ })

}]);