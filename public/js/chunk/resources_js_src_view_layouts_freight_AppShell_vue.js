"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_layouts_freight_AppShell_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_config_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config/navigation */ "./resources/js/src/core/config/navigation.js");
/* harmony import */ var _core_services_store_context_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/store/context.module */ "./resources/js/src/core/services/store/context.module.js");
/* harmony import */ var _view_pages_freight_components_BellPanel_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/BellPanel.vue */ "./resources/js/src/view/pages/freight/components/BellPanel.vue");
/* harmony import */ var _view_pages_freight_components_VisualReporter_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/VisualReporter.vue */ "./resources/js/src/view/pages/freight/components/VisualReporter.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AppShell",
  components: {
    BellPanel: _view_pages_freight_components_BellPanel_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    VisualReporter: _view_pages_freight_components_VisualReporter_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: () => ({
    collapsed: false
  }),
  /* The shell is the first thing that needs to know who is looking at it, so a session
     that arrived without a stored context recovers here rather than drawing a rail with
     the role items missing. Does nothing on the normal path. */
  created() {
    this.$store.dispatch(_core_services_store_context_module__WEBPACK_IMPORTED_MODULE_1__.LOAD_CONTEXT);
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_4__.mapGetters)(["designation", "tier", "portal", "tierAtLeast"])), {}, {
    nav() {
      return (0,_core_config_navigation__WEBPACK_IMPORTED_MODULE_0__.visibleNavFor)({
        designation: this.designation,
        tier: this.tier,
        portalKey: this.portal ? this.portal.key : null,
        tierAtLeast: this.tierAtLeast
      });
    },
    portalGlyph() {
      return {
        air: "✈",
        sea: "⚓",
        road: "🚚"
      }[this.portal && this.portal.scope] || "●";
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************/
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
  name: "BellPanel",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    rows: [],
    unread: 0,
    open: false,
    loading: false,
    busy: false
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["designation"])), {}, {
    /* Only the owner grants a handover — operations may ask. The buttons are HIDDEN
       for anyone else (§8.1 role forbids -> hide), not disabled. */
    canDecide() {
      return this.designation === "pricing" || this.designation === "boss";
    },
    pinned() {
      return this.rows.filter(n => n.pinned);
    },
    /* Today / Yesterday / Earlier — §5.6. Grouping by day is what makes "is this new?"
       answerable at a glance without reading every timestamp. */
    chronological() {
      const rest = this.rows.filter(n => !n.pinned);
      const day = d => new Date(d).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      return [{
        label: "Today",
        rows: rest.filter(n => day(n.created_at) === today)
      }, {
        label: "Yesterday",
        rows: rest.filter(n => day(n.created_at) === yesterday)
      }, {
        label: "Earlier",
        rows: rest.filter(n => day(n.created_at) !== today && day(n.created_at) !== yesterday)
      }];
    }
  }),
  created() {
    this.load();
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open) this.load();
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/notifications").then(({
        data
      }) => {
        this.rows = data.notifications || [];
        this.unread = data.unread || 0;
      })
      /* A bell that errors must not take the header down with it. */.catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    describe(n) {
      if (n.type.indexOf("Reassignment") !== -1) {
        return "Handover requested on " + (n.data.job_no || "a job");
      }
      return n.type.split("\\").pop().replace(/([a-z])([A-Z])/g, "$1 $2");
    },
    markRead(n) {
      if (n.read_at) return;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/notifications/${n.id}/read`, {}).then(({
        data
      }) => {
        n.read_at = new Date().toISOString();
        this.unread = data.unread;
      }).catch(() => {});
    },
    decide(n, decision) {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${n.data.job_id}/reassign/resolve`, {
        decision
      })
      /* Reload rather than splice: the server decides what survives, and the row
         dissolving is the visible confirmation that it did. */.then(() => this.load()).catch(() => this.load()).finally(() => {
        this.busy = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_services_console_recorder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/console.recorder */ "./resources/js/src/core/services/console.recorder.js");



/**
 * A CSS selector path for one element.
 *
 * ⚠️ Built by walking up from the clicked node, preferring an `id` and stopping the
 * moment the path is unique. A full body-to-leaf path is brittle — it breaks on the
 * next layout change and points a developer at nothing.
 */
function selectorFor(el) {
  if (!el || el === document.body) return "body";
  const parts = [];
  let node = el;
  while (node && node.nodeType === 1 && node !== document.body && parts.length < 6) {
    if (node.id) {
      parts.unshift("#" + node.id);
      break; // an id is unique; stop climbing
    }
    let part = node.tagName.toLowerCase();
    const cls = node.className && typeof node.className === "string" ? node.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : [];
    if (cls.length) part += "." + cls.join(".");
    const parent = node.parentElement;
    if (parent) {
      const sameTag = Array.prototype.filter.call(parent.children, c => c.tagName === node.tagName);
      if (sameTag.length > 1) part += ":nth-child(" + (Array.prototype.indexOf.call(parent.children, node) + 1) + ")";
    }
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "VisualReporter",
  data: () => ({
    picking: false,
    form: false,
    busy: false,
    sent: false,
    description: "",
    error: null,
    shot: null,
    shotError: null,
    captured: {
      route: "",
      element_selector: "",
      console_logs: []
    },
    highlighted: null
  }),
  beforeDestroy() {
    this.teardown();
  },
  methods: {
    startPicking() {
      this.picking = true;
      document.body.classList.add("fx-picking");
      document.addEventListener("mouseover", this.onHover, true);
      document.addEventListener("click", this.onPick, true);
    },
    teardown() {
      document.body.classList.remove("fx-picking");
      document.removeEventListener("mouseover", this.onHover, true);
      document.removeEventListener("click", this.onPick, true);
      if (this.highlighted) {
        this.highlighted.classList.remove("fx-picked");
        this.highlighted = null;
      }
    },
    onHover(e) {
      if (this.highlighted) this.highlighted.classList.remove("fx-picked");
      this.highlighted = e.target;
      if (this.highlighted && this.highlighted.classList) this.highlighted.classList.add("fx-picked");
    },
    onPick(e) {
      /* Stop the click reaching the app: the operator is pointing at a control, not
         pressing it, and firing it would change the very state being reported. */
      e.preventDefault();
      e.stopPropagation();
      const target = e.target;
      this.teardown();
      this.picking = false;
      this.captured = {
        route: this.$route ? this.$route.fullPath : window.location.pathname,
        element_selector: selectorFor(target),
        console_logs: _core_services_console_recorder__WEBPACK_IMPORTED_MODULE_1__["default"].entries()
      };
      this.form = true;
      this.capture(target);
    },
    /**
     * html2canvas, loaded ON DEMAND.
     *
     * ⚠️ It is a heavy dependency and almost nobody files a bug, so importing it at
     * boot would cost every session for the benefit of a few. A failed capture is
     * REPORTED and the ticket still sends — a screenshot is evidence, not a
     * precondition.
     */
    capture() {
      __webpack_require__.e(/*! import() | html2canvas */ "html2canvas").then(__webpack_require__.t.bind(__webpack_require__, /*! html2canvas */ "./node_modules/html2canvas/dist/html2canvas.js", 23)).then(mod => (mod.default || mod)(document.body, {
        logging: false,
        scale: 0.5,
        // half scale: legible, and a fraction of the bytes
        useCORS: true
      })).then(canvas => {
        this.shot = canvas.toDataURL("image/jpeg", 0.7);
      }).catch(e => {
        this.shotError = "could not capture (" + (e.message || "unknown") + ")";
      });
    },
    send() {
      this.busy = true;
      this.error = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/tickets", {
        route: this.captured.route,
        description: this.description,
        element_selector: this.captured.element_selector,
        console_logs: this.captured.console_logs
        /* The image is NOT posted: `support_tickets.screenshot_path` expects a path to
           object storage, and a multi-megabyte data URI in a VARCHAR(500) would be
           truncated into garbage. Upload lands with the storage decision — GAPS #35. */
      }).then(() => {
        this.sent = true;
        /* Cleared so the next report does not inherit this one's logs. */
        _core_services_console_recorder__WEBPACK_IMPORTED_MODULE_1__["default"].clear();
      }).catch(e => {
        const d = e.response && e.response.data || {};
        this.error = d.error || d.message || "Could not send the report.";
      }).finally(() => {
        this.busy = false;
      });
    },
    cancel() {
      this.teardown();
      this.picking = false;
      this.form = false;
      this.sent = false;
      this.description = "";
      this.shot = null;
      this.shotError = null;
      this.error = null;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772 ***!
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
  return _c("div", {
    staticClass: "fx-shell",
    attrs: {
      "data-portal": _vm.portal && _vm.portal.key
    }
  }, [_c("a", {
    staticClass: "skip-to-content",
    attrs: {
      href: "#fx-main"
    }
  }, [_vm._v("Skip to content")]), _vm._v(" "), _c("aside", {
    staticClass: "fx-rail",
    class: {
      "is-collapsed": _vm.collapsed
    }
  }, [_c("div", {
    staticClass: "fx-rail__brand"
  }, [_c("span", {
    staticClass: "fx-rail__mark"
  }, [_vm._v("F16s")]), _vm._v(" "), _c("button", {
    staticClass: "fx-rail__toggle",
    attrs: {
      "aria-expanded": String(!_vm.collapsed),
      "aria-label": "Toggle navigation"
    },
    on: {
      click: function ($event) {
        _vm.collapsed = !_vm.collapsed;
      }
    }
  }, [_vm._v("‹")])]), _vm._v(" "), _c("nav", {
    staticClass: "fx-rail__nav",
    attrs: {
      "aria-label": "Main"
    }
  }, _vm._l(_vm.nav, function (item) {
    return _c("router-link", {
      key: item.path,
      staticClass: "fx-rail__item",
      class: {
        "is-locked": item.locked
      },
      attrs: {
        to: item.locked ? "/upgrade?from=" + encodeURIComponent(item.path) : item.path
      }
    }, [_c("span", {
      staticClass: "fx-rail__label"
    }, [_vm._v(_vm._s(item.label))]), _vm._v(" "), item.locked ? _c("span", {
      staticClass: "fx-rail__lock",
      attrs: {
        "aria-label": "Requires an upgrade"
      }
    }, [_vm._v("🔒")]) : _vm._e()]);
  }), 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-body"
  }, [_c("header", {
    staticClass: "fx-header"
  }, [_vm.portal ? _c("span", {
    staticClass: "fx-portal-chip"
  }, [_vm._v("\n        " + _vm._s(_vm.portalGlyph) + " " + _vm._s(_vm.portal.label) + "\n      ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-header__spacer"
  }), _vm._v(" "), _c("VisualReporter"), _vm._v(" "), _c("BellPanel"), _vm._v(" "), _c("span", {
    staticClass: "fx-header__who"
  }, [_vm._v("\n        " + _vm._s(_vm.designation)), _vm.tier ? [_vm._v(" · " + _vm._s(_vm.tier))] : _vm._e()], 2)], 1), _vm._v(" "), _c("main", {
    staticClass: "fx-main",
    attrs: {
      id: "fx-main"
    }
  }, [_c("router-view")], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-bell"
  }, [_c("button", {
    staticClass: "fx-bell__trigger",
    attrs: {
      "aria-expanded": String(_vm.open),
      "aria-label": _vm.unread ? _vm.unread + " unread notifications" : "Notifications"
    },
    on: {
      click: _vm.toggle
    }
  }, [_vm._v("\n    🔔\n    "), _vm._v(" "), _vm.unread ? _c("span", {
    staticClass: "fx-bell__dot"
  }, [_vm._v(_vm._s(_vm.unread > 9 ? "9+" : _vm.unread))]) : _vm._e()]), _vm._v(" "), _vm.open ? _c("div", {
    staticClass: "fx-bell__panel",
    attrs: {
      role: "dialog",
      "aria-label": "Notifications"
    }
  }, [_c("header", {
    staticClass: "fx-bell__head"
  }, [_c("span", [_vm._v("Notifications")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      "aria-label": "Close"
    },
    on: {
      click: function ($event) {
        _vm.open = false;
      }
    }
  }, [_vm._v("✕")])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted fx-bell__pad"
  }, [_vm._v("Loading…")]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted fx-bell__pad"
  }, [_vm._v("Nothing waiting.")]) : _c("div", {
    staticClass: "fx-bell__list"
  }, [_vm.pinned.length ? [_c("p", {
    staticClass: "fx-bell__label"
  }, [_vm._v("Pinned")]), _vm._v(" "), _c("transition-group", {
    attrs: {
      name: "fx-bell-row",
      tag: "div"
    }
  }, _vm._l(_vm.pinned, function (n) {
    return _c("article", {
      key: n.id,
      staticClass: "fx-bell__row fx-bell__row--pinned",
      class: {
        "is-unread": !n.read_at
      }
    }, [_c("p", {
      staticClass: "fx-bell__text"
    }, [_vm._v("\n              Handover requested on\n              "), _c("span", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(n.data.job_no || "a job"))])]), _vm._v(" "), _c("p", {
      staticClass: "fx-bell__when"
    }, [_c("Figure", {
      attrs: {
        value: n.created_at,
        kind: "dateTime"
      }
    })], 1), _vm._v(" "), _vm.canDecide ? _c("div", {
      staticClass: "fx-bell__actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.decide(n, "accept");
        }
      }
    }, [_vm._v("Accept")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.decide(n, "reject");
        }
      }
    }, [_vm._v("Reject")])]) : _vm._e()]);
  }), 0)] : _vm._e(), _vm._v(" "), _vm._l(_vm.chronological, function (group) {
    return [group.rows.length ? _c("p", {
      key: group.label,
      staticClass: "fx-bell__label"
    }, [_vm._v(_vm._s(group.label))]) : _vm._e(), _vm._v(" "), _vm._l(group.rows, function (n) {
      return _c("article", {
        key: n.id,
        staticClass: "fx-bell__row",
        class: {
          "is-unread": !n.read_at
        },
        on: {
          click: function ($event) {
            return _vm.markRead(n);
          }
        }
      }, [_c("p", {
        staticClass: "fx-bell__text"
      }, [_vm._v(_vm._s(_vm.describe(n)))]), _vm._v(" "), _c("p", {
        staticClass: "fx-bell__when"
      }, [_c("Figure", {
        attrs: {
          value: n.created_at,
          kind: "dateTime"
        }
      })], 1)]);
    })];
  })], 2)]) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482 ***!
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
  return _c("div", [!_vm.picking && !_vm.form ? _c("button", {
    staticClass: "fx-btn fx-btn--ghost fx-reporter__launch",
    attrs: {
      "aria-label": "Report a problem"
    },
    on: {
      click: _vm.startPicking
    }
  }, [_vm._v("⚑")]) : _vm._e(), _vm._v(" "), _vm.picking ? _c("div", {
    staticClass: "fx-reporter__banner",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n    Click the thing that is wrong.\n    "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("Cancel")])]) : _vm._e(), _vm._v(" "), _vm.form ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Report a problem"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title"
  }, [_vm._v("Report a problem")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      "aria-label": "Close"
    },
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("✕")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Route")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.captured.route))]), _vm._v(" "), _c("dt", [_vm._v("Element")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.captured.element_selector || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Console")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.captured.console_logs.length) + " recent entries")]), _vm._v(" "), _c("dt", [_vm._v("Screenshot")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.shot ? "attached" : _vm.shotError || "not captured"))])]), _vm._v(" "), _vm.shot ? _c("img", {
    staticClass: "fx-reporter__shot",
    attrs: {
      src: _vm.shot,
      alt: "Captured screenshot"
    }
  }) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    staticStyle: {
      "margin-top": "var(--space-3)"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("What went wrong?")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.description,
      expression: "description"
    }],
    staticClass: "fx-input fx-reporter__text",
    attrs: {
      rows: "4",
      placeholder: "What did you expect, and what happened instead?"
    },
    domProps: {
      value: _vm.description
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.description = $event.target.value;
      }
    }
  })]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _vm.sent ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n          Reported. The support desk sees this with the route, the element and the logs.\n        ")]) : _vm._e()]), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || _vm.sent || !_vm.description.trim()
    },
    on: {
      click: _vm.send
    }
  }, [_vm._v(_vm._s(_vm.busy ? "Sending…" : "Send report"))])])])]) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AppShell.vue?vue&type=template&id=4754a772 */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772");
/* harmony import */ var _AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AppShell.vue?vue&type=script&lang=js */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js");
/* harmony import */ var _AppShell_vue_vue_type_style_index_0_id_4754a772_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.render,
  _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layouts/freight/AppShell.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/BellPanel.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/BellPanel.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BellPanel.vue?vue&type=template&id=039dade0 */ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0");
/* harmony import */ var _BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BellPanel.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.render,
  _BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/BellPanel.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/VisualReporter.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/VisualReporter.vue ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VisualReporter.vue?vue&type=template&id=4c94b482 */ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482");
/* harmony import */ var _VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VisualReporter.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.render,
  _VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/VisualReporter.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BellPanel.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VisualReporter.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772 ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=template&id=4754a772 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0 ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BellPanel.vue?vue&type=template&id=039dade0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482 ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VisualReporter.vue?vue&type=template&id=4c94b482 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482");


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_style_index_0_id_4754a772_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css");


/***/ })

}]);