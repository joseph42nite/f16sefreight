"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_freight_JobInbox_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
/* harmony import */ var _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/FxDrawer.vue */ "./resources/js/src/view/pages/freight/components/FxDrawer.vue");
/* harmony import */ var _view_pages_freight_components_ExtractionPanel_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/ExtractionPanel.vue */ "./resources/js/src/view/pages/freight/components/ExtractionPanel.vue");
/* harmony import */ var _view_pages_freight_components_CostSheet_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/pages/freight/components/CostSheet.vue */ "./resources/js/src/view/pages/freight/components/CostSheet.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







const CLASSIFICATIONS = ["customer_enquiry", "airline", "clearance", "trucking_road"];

/* §740's tab set. The two carrying real data today come first; the rest name the
   Step 6 item that fills them, so an unfinished tab cannot be mistaken for a bug. */
/**
 * The workspace holds WORK SURFACES, nothing else.
 *
 * 🔴 **Four tabs were removed on 2026-09-01, and two of them were lying.**
 *   Enquiry · Timing  two read-only fields and four timestamps. Both are always true of
 *                     the thread and never change while the drawer is open, so a tab made
 *                     the reader click to learn something that should simply be stated.
 *                     They live in the header now.
 *   Upload            duplicated [Analyze PDF], which already uploads from the
 *                     conversation header — beside the attachment that needs reading. Its
 *                     placeholder promised "Step 6 item 2", which IS the upload modal, and
 *                     was already built.
 *   E-Docket          its placeholder cited "Step 6 item 4", which is JobCostSheet — built,
 *                     and already the Cost sheet tab in this same drawer. The pointer was
 *                     simply wrong.
 *
 * ⚠️ A placeholder that names a step already delivered is worse than no placeholder: it
 * tells an operator to wait for something they could be using now.
 */
const WORKSPACE_TABS = [{
  key: "extraction",
  label: "Extraction"
}, {
  key: "cost",
  label: "Cost sheet"
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "JobInbox",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    ExtractionPanel: _view_pages_freight_components_ExtractionPanel_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    CostSheet: _view_pages_freight_components_CostSheet_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  data: () => ({
    folders: [{
      key: "all",
      label: "All"
    }, {
      key: "unassigned",
      label: "Unassigned pool"
    }, {
      key: "customer_enquiry",
      label: "Enquiries"
    }, {
      key: "airline",
      label: "Airline"
    }, {
      key: "clearance",
      label: "Clearance"
    }, {
      key: "trucking_road",
      label: "Trucking"
    }],
    folder: "all",
    threads: [],
    counts: {},
    messages: [],
    active: null,
    pending: null,
    loading: true,
    busy: false,
    error: null,
    actionError: null,
    query: "",
    timer: null,
    workspace: false,
    tab: "extraction",
    extracted: null,
    jobId: null,
    CLASSIFICATIONS,
    WORKSPACE_TABS
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapGetters)(["designation"])), {}, {
    /* Only pricing owns triage — re-classification mints or strands an enquiry. */
    canTriage() {
      return this.designation === "pricing";
    },
    /**
     * 🔴 TIMING AS A STATE, NOT FOUR TIMESTAMPS. The value in `first_triage_at` and
     * `first_response_at` is the CONTRAST between them — a time against triaged with a
     * dash against replied means somebody looked and the client is still waiting, which is
     * what makes `lost_reason = 'delay_in_response'` provable rather than asserted.
     *
     * Four raw datetimes in a header read as noise and leave the reader to do the
     * subtraction. The exact values stay available on hover.
     */
    timing() {
      const a = this.active;
      if (!a) return null;
      if (!a.first_triage_at) {
        return {
          label: "Not triaged yet",
          tone: "neutral"
        };
      }
      const triaged = new Date(a.first_triage_at);
      if (a.first_response_at) {
        return {
          label: "Answered " + this.elapsed(triaged, new Date(a.first_response_at)) + " after triage",
          tone: "success"
        };
      }

      /* Unanswered is the one worth noticing, so it is the one that gets a colour. */
      return {
        label: "Unanswered — " + this.elapsed(triaged, new Date()) + " since triage",
        tone: "warn"
      };
    },
    timingDetail() {
      const a = this.active;
      if (!a) return "";
      return ["Last inbound: " + this.stamp(a.latest_message_received_at), "First triaged: " + this.stamp(a.first_triage_at), "First replied: " + this.stamp(a.first_response_at), "Messages: " + (a.message_count == null ? "—" : a.message_count)].join("\n");
    }
  }),
  created() {
    this.load();
  },
  /* Leaving the inbox with the workspace open would strand the body class and collapse
     the rail on every other screen. */
  beforeDestroy() {
    document.body.classList.remove("fx-split");
  },
  methods: {
    /**
     * 🔴 THE CONVERSATION'S SCROLL POSITION SURVIVES THE TRANSITION (§9.2).
     *
     * The pane is re-laid-out from fluid width to 50%, which resets scrollTop. Losing
     * the reader's place halfway down a long thread is, in the guide's words, the
     * fastest way to make the feature feel broken — and it is worse than that here,
     * because the operator opened the workspace to transcribe something they were
     * looking at.
     *
     * The 60px rail is the AppShell's business, not this page's: a body class is the
     * smallest signal that crosses that boundary without inventing shared state.
     */
    setSplit(open) {
      const pane = this.$refs.convo;
      const top = pane ? pane.scrollTop : 0;
      this.workspace = open;
      document.body.classList.toggle("fx-split", open);

      /* ⚠️ Restored TWICE, and the second one is the one that matters.
         The pane changes width across the transition, so content reflows for the
         whole 200ms and the browser keeps re-deriving scrollTop underneath us.
         Setting it once on $nextTick lands mid-flight and drifts — measured at
         420 -> 434.5. The nextTick pass keeps the jump invisible; the settle pass
         puts it exactly back. */
      const restore = () => {
        if (this.$refs.convo) this.$refs.convo.scrollTop = top;
      };
      this.$nextTick(restore);

      /* transitionend, with a timer fallback: under prefers-reduced-motion there is
         no transition to end, and the event would never arrive. */
      const inbox = this.$el;
      const settle = e => {
        if (e && e.target !== inbox) return;
        inbox.removeEventListener("transitionend", settle);
        restore();
      };
      inbox.addEventListener("transitionend", settle);
      setTimeout(settle, 320);
    },
    /**
     * The operator ACCEPTED an extraction. Nothing is written to a document here —
     * §Step 6.2's pre-population of FocusAir.vue / HouseWayBill.vue is still to come,
     * and quietly stuffing values into a legal document on arrival would make the
     * confidence highlighting decorative.
     */
    /**
     * The operator has chosen what to take from where. Held, not written.
     *
     * ⚠️ Still nothing is pushed into FocusAir.vue / HouseWayBill.vue — that is Step 6.2.
     * Quietly stuffing values into a legal document would make the confidence marking
     * decorative, which is the one thing it must not be.
     */
    onExtracted(payload) {
      this.extracted = payload;
    },
    openExtraction() {
      this.tab = "extraction";
      this.setSplit(true);
    },
    /* ⚠️ A raw ISO string is not a date to a reader. The API sends
       2026-08-30T10:28:47.000000Z; a person needs 30 Aug 2026, 10:28. */
    stamp(value) {
      if (!value) return "—";
      const d = new Date(value);
      if (isNaN(d)) return String(value);
      return d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    },
    /** Coarse on purpose: "3d" is the decision, "3d 4h 12m" is trivia. */
    elapsed(from, to) {
      const mins = Math.max(0, Math.round((to - from) / 60000));
      if (mins < 60) return mins + "m";
      if (mins < 1440) return Math.round(mins / 60) + "h";
      return Math.round(mins / 1440) + "d";
    },
    openWorkspace() {
      this.setSplit(true);
    },
    closeWorkspace() {
      this.setSplit(false);
    },
    select(key) {
      this.folder = key;
      this.load();
    },
    debounced() {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.load, 250);
    },
    params() {
      const p = [];
      if (this.folder === "unassigned") p.push("unassigned=1");else if (this.folder !== "all") p.push("classification=" + this.folder);
      if (this.query) p.push("q=" + encodeURIComponent(this.query));
      return p.length ? "?" + p.join("&") : "";
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/inbox/threads" + this.params()).then(({
        data
      }) => {
        this.threads = data.data || [];
        this.error = null;
        this.tally();
      }).catch(e => {
        this.error = this.messageFor(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    /* Counts come from the loaded page, so they describe what is on screen rather than
       claiming a total the list does not show. */
    tally() {
      const c = {
        all: this.threads.length
      };
      this.threads.forEach(t => {
        c[t.classification] = (c[t.classification] || 0) + 1;
        if (!t.assigned_ops) c.unassigned = (c.unassigned || 0) + 1;
      });
      this.counts = c;
    },
    open(thread) {
      this.actionError = null;
      this.tab = "enquiry";
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/inbox/threads/" + thread.id).then(({
        data
      }) => {
        this.active = data.thread;
        this.pending = data.thread.classification;
        this.messages = data.messages || [];
        this.jobId = null;

        /* The cost sheet hangs off the JOB, not the thread. A converted enquiry has
           one; an unconverted one does not, and saying so beats an empty table. */
        if (data.thread.enquiry && data.thread.enquiry.status === "converted") {
          _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/jobs?enquiry_id=" + data.thread.enquiry.id).then(({
            data: jobs
          }) => {
            const rows = jobs.data || [];
            this.jobId = rows.length ? rows[0].id : null;
          }).catch(() => {
            this.jobId = null;
          });
        }
      }).catch(e => {
        this.actionError = this.messageFor(e);
      });
    },
    claim() {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/inbox/threads/" + this.active.id + "/claim", {}).then(({
        data
      }) => {
        this.active = data;
        this.load();
      })
      /* 409 is a real outcome, not a failure: someone got there first. */.catch(e => {
        this.actionError = this.messageFor(e);
        this.load();
      }).finally(() => {
        this.busy = false;
      });
    },
    classify() {
      this.busy = true;
      this.actionError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/inbox/threads/" + this.active.id + "/classify", {
        classification: this.pending
      }).then(({
        data
      }) => {
        this.active = data;
        this.load();
      }).catch(e => {
        this.actionError = this.messageFor(e);
        /* Put the control back to the truth — the server refused the change. */
        this.pending = this.active.classification;
      }).finally(() => {
        this.busy = false;
      });
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=script&lang=js ***!
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
  name: "CostSheet",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: {
    jobId: {
      type: [Number, String],
      required: true
    }
  },
  data: () => ({
    sheet: null,
    partners: [],
    loading: true,
    busy: false,
    error: null,
    actionError: null,
    draft: {
      side: "sell",
      charge_type: "air_freight",
      description: "",
      quantity: 1,
      rate: 0,
      tax_percentage: 18,
      vendor_id: ""
    }
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["designation"])), {}, {
    /* Pricing owns the rates; accounts finalizes them. The server re-checks. */
    canEdit() {
      return this.designation === "pricing" || this.designation === "accounts";
    },
    valid() {
      return this.draft.description && this.draft.quantity > 0 && (this.draft.side === "sell" || this.draft.vendor_id);
    }
  }),
  created() {
    this.load();
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners").then(({
      data
    }) => {
      this.partners = data.data || [];
    }).catch(() => {/* the vendor list is optional until a buy line is added */});
  },
  methods: {
    label(v) {
      return String(v).replace(/_/g, " ");
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.jobId}/cost-sheet`).then(({
        data
      }) => {
        this.sheet = data;
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    add() {
      this.busy = true;
      this.actionError = null;
      const payload = Object.assign({}, this.draft);
      if (payload.side === "sell") delete payload.vendor_id;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.jobId}/cost-sheet/lines`, payload).then(({
        data
      }) => {
        this.sheet = data;
        this.draft.description = "";
      }).catch(e => {
        this.actionError = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    remove(side, id) {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"](`/jobs/${this.jobId}/cost-sheet/${side}/${id}`).then(({
        data
      }) => {
        this.sheet = data;
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/**
 * The parts a shipment is assembled from.
 *
 * Exactly the three the operator asked to choose between — parties, cargo, notify — not a
 * row per field. A picker with twenty entries is a form, and the operator already has one.
 */
const GROUPS = [{
  key: "parties",
  label: "Shipper & consignee",
  paths: ["shipper", "consignee"]
}, {
  key: "cargo",
  label: "Cargo — pieces, dimensions, description",
  paths: ["cargo", "piece_weight", "dimensions", "goods"]
}, {
  key: "notify",
  label: "Notify party",
  paths: ["also_notify", "notify"]
}];

/** What a pasted line may be called. Lower-cased, punctuation-insensitive. */
const PASTE_KEYS = {
  shipper: ["shipper", "consignor", "exporter"],
  consignee: ["consignee", "importer", "buyer"],
  notify: ["notify", "notify party", "also notify"],
  pieces: ["pieces", "pcs", "packages", "no of pieces"],
  weight: ["weight", "gross weight", "kg", "gross"],
  dimensions: ["dimensions", "dims", "size", "measurement"],
  goods: ["goods", "description", "commodity", "nature of goods"]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ExtractionPanel",
  components: {
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    GROUPS,
    dragging: false,
    documents: [],
    /** group key -> document uid. One source per group, deliberately. */
    assignment: {},
    pasted: "",
    seq: 0
  }),
  computed: {
    /* Honest about GAPS #38: only the coordinate path is deployed, so anything that is
       not an airway bill will fail at the parser. Saying so beats letting it look broken. */
    unstructuredWarning() {
      return this.documents.length > 0;
    },
    pastedFields() {
      return this.parsePaste(this.pasted).found;
    },
    pastedUnknown() {
      return this.parsePaste(this.pasted).unknown;
    },
    /**
     * 🔴 The whole point of the panel. For each group: which source won, and what it says.
     * Text beats documents, always — resolved here rather than at apply time so the
     * operator sees the outcome before committing it.
     */
    resolved() {
      const out = {};
      GROUPS.forEach(g => {
        const fromText = this.groupFromPaste(g);
        if (fromText) {
          out[g.key] = {
            source: "text",
            summary: fromText,
            fields: this.pastedFields
          };
          return;
        }
        const uid = this.assignment[g.key];
        const doc = this.documents.find(d => d.uid === uid);
        if (!doc || doc.state !== "ready") {
          out[g.key] = {
            source: null,
            summary: null,
            fields: null
          };
          return;
        }
        out[g.key] = {
          source: doc.name,
          summary: this.summarise(g, doc.fields),
          fields: doc.fields
        };
      });
      return out;
    },
    anyResolved() {
      return GROUPS.some(g => this.resolved[g.key].source !== null);
    },
    /* Medium counts as unsure: a field the extractor was only fairly sure of is exactly
       the one that produces a plausible-looking wrong consignee. */
    lowConfidence() {
      const out = [];
      GROUPS.forEach(g => {
        const r = this.resolved[g.key];
        if (!r.fields || r.source === "text") return;
        g.paths.forEach(p => {
          const node = r.fields[p];
          if (node && node.confidence && node.confidence !== "high") out.push(p);
        });
      });
      return out;
    },
    payload() {
      const fields = {};
      GROUPS.forEach(g => {
        const r = this.resolved[g.key];
        if (!r.source) return;
        g.paths.forEach(p => {
          const node = (r.fields || {})[p];
          if (node !== undefined) fields[p] = node;
        });
      });
      return {
        fields,
        overrides: this.pastedFields,
        resolved: this.resolved
      };
    }
  },
  methods: {
    onDrop(e) {
      this.dragging = false;
      this.add([...e.dataTransfer.files]);
    },
    onPick(e) {
      this.add([...e.target.files]);
    },
    add(files) {
      files.filter(f => f.type === "application/pdf").forEach(file => this.upload(file));
    },
    upload(file) {
      const uid = ++this.seq;
      this.documents.push({
        uid,
        name: file.name,
        state: "reading",
        fields: null,
        error: null,
        jobId: null
      });
      const form = new FormData();
      form.append("upload_file", file);
      form.append("type", "ksr");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/upload-awb-file", form).then(({
        data
      }) => {
        const doc = this.documents.find(d => d.uid === uid);
        doc.jobId = data.job_id || data.data;
        this.poll(uid);
      }).catch(e => this.fail(uid, this.messageFor(e)));
    },
    /* Polled per document. Each has its own timer so a slow scan does not hold up a
       fast one — the operator can assign the first while the second is still reading. */
    poll(uid) {
      const doc = this.documents.find(d => d.uid === uid);
      const timer = setInterval(() => {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/ocr-status/" + doc.jobId).then(({
          data
        }) => {
          if (data.job_status === "completed") {
            clearInterval(timer);
            doc.fields = data.fields || {};
            doc.state = "ready";
          } else if (data.job_status === "failed" || data.job_status === "cancelled") {
            clearInterval(timer);
            this.fail(uid, data.error || "could not be read");
          }
        }).catch(e => {
          clearInterval(timer);
          this.fail(uid, this.messageFor(e));
        });
      }, 2000);
      doc.timer = timer;
    },
    fail(uid, message) {
      const doc = this.documents.find(d => d.uid === uid);
      if (!doc) return;
      doc.state = "failed";
      doc.error = message;
    },
    /** Which group this document currently supplies, if any. */
    groupsFrom(uid) {
      const found = GROUPS.find(g => this.assignment[g.key] === uid);
      return found ? found.key : "";
    },
    /** Assigning a group to a document takes it away from whichever had it. */
    assign(groupKey, uid) {
      const next = _objectSpread({}, this.assignment);
      Object.keys(next).forEach(k => {
        if (next[k] === uid) delete next[k];
      });
      if (groupKey) next[groupKey] = uid;
      this.assignment = next;
    },
    /** `Label: value` per line. Anything unrecognised is reported, never guessed at. */
    parsePaste(text) {
      const found = {};
      const unknown = [];
      String(text || "").split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([^:]{1,40}):\s*(.+?)\s*$/);
        if (!m) {
          if (line.trim()) unknown.push(line.trim().slice(0, 30));
          return;
        }
        const label = m[1].trim().toLowerCase();
        const key = Object.keys(PASTE_KEYS).find(k => PASTE_KEYS[k].includes(label));
        if (!key) {
          unknown.push(m[1].trim());
          return;
        }

        // Typed by a person, so it is authoritative by definition — not a guess to score.
        found[key] = {
          value: m[2].trim(),
          confidence: "high"
        };
      });
      return {
        found,
        unknown
      };
    },
    /** What the paste contributes to this group, as a one-line summary. */
    groupFromPaste(group) {
      const f = this.pastedFields;
      const parts = [];
      if (group.key === "parties") {
        if (f.shipper) parts.push(f.shipper.value);
        if (f.consignee) parts.push("→ " + f.consignee.value);
      } else if (group.key === "cargo") {
        if (f.pieces) parts.push(f.pieces.value + " pcs");
        if (f.weight) parts.push(f.weight.value + " kg");
        if (f.dimensions) parts.push(f.dimensions.value);
        if (f.goods) parts.push(f.goods.value);
      } else if (group.key === "notify") {
        if (f.notify) parts.push(f.notify.value);
      }
      return parts.length ? parts.join(" · ") : null;
    },
    summarise(group, fields) {
      const parts = [];
      group.paths.forEach(p => {
        const node = fields[p];
        const value = node && typeof node === "object" ? node.value : node;
        if (value) parts.push(String(value));
      });
      return parts.length ? parts.join(" · ") : null;
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "something went wrong";
    }
  },
  beforeDestroy() {
    this.documents.forEach(d => d.timer && clearInterval(d.timer));
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=template&id=e9ffa2de":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=template&id=e9ffa2de ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-inbox",
    class: {
      "is-split": _vm.workspace
    }
  }, [_c("aside", {
    staticClass: "fx-inbox__folders",
    attrs: {
      "aria-label": "Folders"
    }
  }, _vm._l(_vm.folders, function (f) {
    return _c("button", {
      key: f.key,
      staticClass: "fx-folder",
      class: {
        "is-active": _vm.folder === f.key
      },
      on: {
        click: function ($event) {
          return _vm.select(f.key);
        }
      }
    }, [_c("span", [_vm._v(_vm._s(f.label))]), _vm._v(" "), _c("span", {
      staticClass: "fx-folder__count"
    }, [_vm._v(_vm._s(_vm.counts[f.key] === undefined ? "" : _vm.counts[f.key]))])]);
  }), 0), _vm._v(" "), _c("section", {
    staticClass: "fx-inbox__list",
    attrs: {
      "aria-label": "Conversations"
    }
  }, [_c("div", {
    staticClass: "fx-inbox__search"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.query,
      expression: "query"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "search",
      placeholder: "Subject or sender…"
    },
    domProps: {
      value: _vm.query
    },
    on: {
      input: [function ($event) {
        if ($event.target.composing) return;
        _vm.query = $event.target.value;
      }, _vm.debounced]
    }
  })]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted fx-inbox__pad"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error fx-inbox__pad",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.threads.length ? _c("p", {
    staticClass: "fx-muted fx-inbox__pad"
  }, [_vm._v("Nothing here.")]) : _c("ul", {
    staticClass: "fx-threads"
  }, _vm._l(_vm.threads, function (t) {
    return _c("li", {
      key: t.id,
      staticClass: "fx-thread",
      class: {
        "is-active": _vm.active && _vm.active.id === t.id,
        "is-unread": t.status === "unread"
      },
      attrs: {
        tabindex: "0"
      },
      on: {
        click: function ($event) {
          return _vm.open(t);
        },
        keydown: function ($event) {
          if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
          return _vm.open(t);
        }
      }
    }, [_c("div", {
      staticClass: "fx-thread__row"
    }, [_c("span", {
      staticClass: "fx-thread__from"
    }, [_vm._v(_vm._s(t.from))]), _vm._v(" "), _c("span", {
      staticClass: "fx-thread__when"
    }, [_c("Figure", {
      attrs: {
        value: t.latest_message_received_at,
        kind: "date"
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "fx-thread__subject"
    }, [_vm._v(_vm._s(t.subject))]), _vm._v(" "), _c("div", {
      staticClass: "fx-thread__row"
    }, [_c("StatusChip", {
      attrs: {
        value: t.classification
      }
    }), _vm._v(" "), t.assigned_ops ? _c("span", {
      staticClass: "fx-thread__owner"
    }, [_vm._v(_vm._s(t.assigned_ops.name))]) : _c("span", {
      staticClass: "fx-thread__owner fx-thread__owner--free"
    }, [_vm._v("Unassigned")])], 1)]);
  }), 0)]), _vm._v(" "), _c("section", {
    ref: "convo",
    staticClass: "fx-inbox__convo",
    attrs: {
      "aria-label": "Conversation"
    }
  }, [!_vm.active ? _c("p", {
    staticClass: "fx-muted fx-inbox__pad"
  }, [_vm._v("Select a conversation.")]) : [_c("header", {
    staticClass: "fx-convo__head"
  }, [_c("div", [_c("h2", {
    staticClass: "fx-convo__subject"
  }, [_vm._v(_vm._s(_vm.active.subject))]), _vm._v(" "), _c("p", {
    staticClass: "fx-convo__meta"
  }, [_vm._v("\n            " + _vm._s(_vm.active.from) + " · " + _vm._s(_vm.active.message_count) + " message" + _vm._s(_vm.active.message_count === 1 ? "" : "s") + "\n            "), _vm.active.enquiry ? [_vm._v("\n              · "), _c("span", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.active.enquiry.enquiry_no))])] : _vm._e()], 2)]), _vm._v(" "), _c("div", {
    staticClass: "fx-convo__actions"
  }, [!_vm.active.assigned_ops ? _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: _vm.claim
    }
  }, [_vm._v("Claim")]) : _vm._e(), _vm._v(" "), _vm.canTriage ? _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pending,
      expression: "pending"
    }],
    staticClass: "fx-input",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.pending = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.classify]
    }
  }, _vm._l(_vm.CLASSIFICATIONS, function (c) {
    return _c("option", {
      key: c,
      domProps: {
        value: c
      }
    }, [_vm._v(_vm._s(c.replace(/_/g, " ")))]);
  }), 0) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    on: {
      click: _vm.openExtraction
    }
  }, [_vm._v("Analyze PDF")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: _vm.openWorkspace
    }
  }, [_vm._v("Open workspace")])])]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error fx-inbox__pad",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e(), _vm._v(" "), _c("dl", {
    staticClass: "fx-defs fx-convo__sla"
  }, [_c("dt", [_vm._v("First triaged")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.active.first_triage_at,
      kind: "dateTime"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("First replied")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.active.first_response_at,
      kind: "dateTime"
    }
  })], 1)]), _vm._v(" "), _c("ol", {
    staticClass: "fx-messages"
  }, _vm._l(_vm.messages, function (m) {
    return _c("li", {
      key: m.id,
      staticClass: "fx-message",
      class: "fx-message--" + m.direction
    }, [_c("div", {
      staticClass: "fx-message__head"
    }, [_c("span", {
      staticClass: "fx-message__from"
    }, [_vm._v(_vm._s(m.from))]), _vm._v(" "), _c("span", {
      staticClass: "fx-message__when"
    }, [_c("Figure", {
      attrs: {
        value: m.received_at,
        kind: "dateTime"
      }
    })], 1)]), _vm._v(" "), _c("p", {
      staticClass: "fx-message__body"
    }, [_vm._v(_vm._s(m.body_snippet))])]);
  }), 0)]], 2), _vm._v(" "), _c("FxDrawer", {
    attrs: {
      open: _vm.workspace && !!_vm.active,
      title: _vm.active ? _vm.active.subject || "Workspace" : "",
      subtitle: _vm.active ? _vm.active.from : null,
      tabs: _vm.WORKSPACE_TABS,
      "active-tab": _vm.tab
    },
    on: {
      tab: function ($event) {
        _vm.tab = $event;
      },
      close: _vm.closeWorkspace
    },
    scopedSlots: _vm._u([{
      key: "meta",
      fn: function () {
        return [_vm.active ? _c("div", {
          staticClass: "fx-drawer__facts"
        }, [_vm.active.enquiry ? [_c("span", {
          staticClass: "identifier"
        }, [_vm._v(_vm._s(_vm.active.enquiry.enquiry_no))]), _vm._v(" "), _c("StatusChip", {
          attrs: {
            value: _vm.active.enquiry.status
          }
        })] : _c("span", {
          staticClass: "fx-muted"
        }, [_vm._v("Not promoted to an enquiry")]), _vm._v(" "), _vm.timing ? _c("span", {
          staticClass: "fx-drawer__timing",
          class: "is-" + _vm.timing.tone,
          attrs: {
            title: _vm.timingDetail
          }
        }, [_vm._v(_vm._s(_vm.timing.label))]) : _vm._e()], 2) : _vm._e()];
      },
      proxy: true
    }, {
      key: "footer",
      fn: function () {
        return [_c("button", {
          staticClass: "fx-btn",
          on: {
            click: _vm.closeWorkspace
          }
        }, [_vm._v("← Back to timeline")])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _vm.active ? [_vm.tab === "cost" ? _c("section", [!_vm.active.enquiry ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          No enquiry on this conversation yet, so there is no job to cost.\n        ")]) : _vm.jobId ? _c("CostSheet", {
    attrs: {
      "job-id": _vm.jobId
    }
  }) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("This enquiry has not been converted to a job yet.")])], 1) : _vm.tab === "extraction" ? _c("section", [_c("ExtractionPanel", {
    on: {
      apply: _vm.onExtracted
    }
  })], 1) : _vm._e()] : _vm._e()], 2)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=template&id=b301813e":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=template&id=b301813e ***!
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
  return _c("div", [_vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_vm.sheet.locked ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      Finalized and issued. Corrections need a credit note, not an edit.\n    ")]) : _vm._e(), _vm._v(" "), _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Sell — what the client is billed")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Charge")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Qty")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Rate")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Net")]), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.sheet.sell.lines, function (l) {
    return _c("tr", {
      key: l.id
    }, [_c("td", [_vm._v(_vm._s(l.description) + " "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("(" + _vm._s(_vm.label(l.charge_type)) + ")")])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.quantity,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.rate,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.net_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.remove("sell", l.id);
        }
      }
    }, [_vm._v("✕")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.sheet.sell.lines.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "5"
    }
  }, [_vm._v("No sell lines yet.")])]) : _vm._e()], 2), _vm._v(" "), _c("tfoot", [_c("tr", [_vm._m(0), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.sheet.sell.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("td") : _vm._e()])])])]), _vm._v(" "), _vm.sheet.buy ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Buy — what we owe suppliers")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Charge")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Qty")]), _vm._v(" "), _c("th", {
    staticClass: "fx-num",
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Net")]), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("th", {
    attrs: {
      scope: "col"
    }
  }) : _vm._e()])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.sheet.buy.lines, function (l) {
    return _c("tr", {
      key: l.id
    }, [_c("td", [_vm._v(_vm._s(l.description) + " "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("(" + _vm._s(_vm.label(l.charge_type)) + ")")])]), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.quantity,
        kind: "count"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-num"
    }, [_c("Figure", {
      attrs: {
        value: l.net_amount,
        kind: "currency",
        "currency-code": "INR"
      }
    })], 1), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("td", {
      staticClass: "fx-row-actions"
    }, [_c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.remove("buy", l.id);
        }
      }
    }, [_vm._v("✕")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.sheet.buy.lines.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "4"
    }
  }, [_vm._v("No buy lines yet.")])]) : _vm._e()], 2), _vm._v(" "), _c("tfoot", [_c("tr", [_vm._m(1), _vm._v(" "), _c("td", {
    staticClass: "fx-num"
  }, [_c("Figure", {
    attrs: {
      value: _vm.sheet.buy.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("td") : _vm._e()])])])]) : _vm._e(), _vm._v(" "), _vm.sheet.margin ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Margin")]), _vm._v(" "), _c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Value")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.sheet.margin.value,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("Percent")]), _vm._v(" "), _c("dd", [_vm.sheet.margin.percent === null ? _c("span", {
    staticClass: "is-empty",
    attrs: {
      "aria-label": "Nothing billed yet"
    }
  }) : _c("span", [_vm._v(_vm._s(Number(_vm.sheet.margin.percent).toFixed(2)) + "%")])])])]) : _vm._e(), _vm._v(" "), _vm.canEdit && !_vm.sheet.locked ? _c("section", {
    staticClass: "fx-section"
  }, [_c("h3", {
    staticClass: "fx-section__title"
  }, [_vm._v("Add a line")]), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Side")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.side,
      expression: "draft.side"
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
        _vm.$set(_vm.draft, "side", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: "sell"
    }
  }, [_vm._v("Sell")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "buy"
    }
  }, [_vm._v("Buy")])])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Charge")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.charge_type,
      expression: "draft.charge_type"
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
        _vm.$set(_vm.draft, "charge_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.sheet.vocabulary.charge_types, function (c) {
    return _c("option", {
      key: c,
      domProps: {
        value: c
      }
    }, [_vm._v(_vm._s(_vm.label(c)))]);
  }), 0)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Description")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.description,
      expression: "draft.description"
    }],
    staticClass: "fx-input",
    attrs: {
      type: "text"
    },
    domProps: {
      value: _vm.draft.description
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.draft, "description", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Qty")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.draft.quantity,
      expression: "draft.quantity",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      step: "0.001",
      min: "0"
    },
    domProps: {
      value: _vm.draft.quantity
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.draft, "quantity", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Rate")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.draft.rate,
      expression: "draft.rate",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      step: "0.01",
      min: "0"
    },
    domProps: {
      value: _vm.draft.rate
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.draft, "rate", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Tax %")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.draft.tax_percentage,
      expression: "draft.tax_percentage",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      step: "0.01",
      min: "0",
      max: "100"
    },
    domProps: {
      value: _vm.draft.tax_percentage
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.draft, "tax_percentage", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  })]), _vm._v(" "), _vm.draft.side === "buy" ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Vendor")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft.vendor_id,
      expression: "draft.vendor_id"
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
        _vm.$set(_vm.draft, "vendor_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Choose…")]), _vm._v(" "), _vm._l(_vm.partners, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v(_vm._s(p.name))]);
  })], 2)]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.valid
    },
    on: {
      click: _vm.add
    }
  }, [_vm._v("Add")])]), _vm._v(" "), _vm.actionError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.actionError))]) : _vm._e()]) : _vm._e()]], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", {
    attrs: {
      colspan: "3"
    }
  }, [_c("strong", [_vm._v("Total")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("td", {
    attrs: {
      colspan: "2"
    }
  }, [_c("strong", [_vm._v("Total")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=template&id=fa6bcd28":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=template&id=fa6bcd28 ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-extract"
  }, [_c("section", {
    staticClass: "fx-extract__step"
  }, [_c("h3", {
    staticClass: "fx-extract__h"
  }, [_vm._v("1 · Documents")]), _vm._v(" "), _c("div", {
    staticClass: "fx-drop fx-drop--slim",
    class: {
      "is-over": _vm.dragging
    },
    on: {
      dragover: function ($event) {
        $event.preventDefault();
        _vm.dragging = true;
      },
      dragleave: function ($event) {
        $event.preventDefault();
        _vm.dragging = false;
      },
      drop: function ($event) {
        $event.preventDefault();
        return _vm.onDrop.apply(null, arguments);
      }
    }
  }, [_c("p", {
    staticClass: "fx-drop__lead"
  }, [_vm._v("Drop PDFs here")]), _vm._v(" "), _c("label", {
    staticClass: "fx-btn"
  }, [_vm._v("\n        Choose files\n        "), _c("input", {
    staticClass: "fx-drop__input",
    attrs: {
      type: "file",
      accept: "application/pdf",
      multiple: ""
    },
    on: {
      change: _vm.onPick
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-drop__note"
  }, [_vm._v("\n        Several documents are normal — an invoice for the parties, a packing list for the\n        cargo. Say what to take from each.\n      ")])]), _vm._v(" "), _vm.unstructuredWarning ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      Only airway bills extract today. An invoice or packing list needs the unstructured\n      parser, which is not deployed yet — those rows will read as failed, and the paste\n      box below is the way through until it is.\n    ")]) : _vm._e(), _vm._v(" "), _vm.documents.length ? _c("table", {
    staticClass: "fx-table fx-extract__docs"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.documents, function (doc) {
    return _c("tr", {
      key: doc.uid
    }, [_c("td", [_vm._v(_vm._s(doc.name))]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: doc.state
      }
    }), _vm._v(" "), doc.error ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" " + _vm._s(doc.error))]) : _vm._e()], 1), _vm._v(" "), _c("td", [_c("select", {
      staticClass: "fx-input",
      attrs: {
        disabled: doc.state !== "ready"
      },
      domProps: {
        value: _vm.groupsFrom(doc.uid)
      },
      on: {
        change: function ($event) {
          return _vm.assign($event.target.value, doc.uid);
        }
      }
    }, [_c("option", {
      attrs: {
        value: ""
      }
    }, [_vm._v("— nothing —")]), _vm._v(" "), _vm._l(_vm.GROUPS, function (g) {
      return _c("option", {
        key: g.key,
        domProps: {
          value: g.key
        }
      }, [_vm._v(_vm._s(g.label))]);
    })], 2)])]);
  }), 0)]) : _vm._e()]), _vm._v(" "), _c("section", {
    staticClass: "fx-extract__step"
  }, [_c("h3", {
    staticClass: "fx-extract__h"
  }, [_vm._v("2 · Paste anything specific")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.pasted,
      expression: "pasted"
    }],
    staticClass: "fx-input fx-extract__paste",
    attrs: {
      rows: "5",
      placeholder: "Shipper: Globex Exports Pvt Ltd&#10;Pieces: 14&#10;Weight: 698.5&#10;Dimensions: 120x80x90&#10;Goods: Machine parts"
    },
    domProps: {
      value: _vm.pasted
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.pasted = $event.target.value;
      }
    }
  }), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm.pasted && _vm.pastedUnknown.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      Not recognised, so not used:\n      "), _c("strong", [_vm._v(_vm._s(_vm.pastedUnknown.join(", ")))])]) : _vm._e()]), _vm._v(" "), _c("section", {
    staticClass: "fx-extract__step"
  }, [_c("h3", {
    staticClass: "fx-extract__h"
  }, [_vm._v("3 · What will be used")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(2), _vm._v(" "), _c("tbody", _vm._l(_vm.GROUPS, function (g) {
    return _c("tr", {
      key: g.key
    }, [_c("td", [_vm._v(_vm._s(g.label))]), _vm._v(" "), _c("td", [_vm.resolved[g.key].source === "text" ? _c("span", {
      staticClass: "fx-extract__override"
    }, [_vm._v("\n              pasted text\n            ")]) : _vm.resolved[g.key].source ? _c("span", [_vm._v(_vm._s(_vm.resolved[g.key].source))]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("not set")])]), _vm._v(" "), _c("td", [_vm.resolved[g.key].summary ? _c("span", [_vm._v(_vm._s(_vm.resolved[g.key].summary))]) : _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v("—")])])]);
  }), 0)]), _vm._v(" "), _vm.lowConfidence.length ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n      " + _vm._s(_vm.lowConfidence.length) + " field(s) the extractor was unsure of:\n      " + _vm._s(_vm.lowConfidence.join(", ")) + ". Check them before this reaches a document.\n    ")]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: !_vm.anyResolved
    },
    on: {
      click: function ($event) {
        return _vm.$emit("apply", _vm.payload);
      }
    }
  }, [_vm._v("Use these details")])])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Document")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("State")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Take from it")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n      One "), _c("code", [_vm._v("Label: value")]), _vm._v(" per line. Whatever is recognised here overrides the\n      documents.\n    ")]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Part")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Source")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Value")])])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/freight/JobInbox.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/freight/JobInbox.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _JobInbox_vue_vue_type_template_id_e9ffa2de__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JobInbox.vue?vue&type=template&id=e9ffa2de */ "./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=template&id=e9ffa2de");
/* harmony import */ var _JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JobInbox.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _JobInbox_vue_vue_type_template_id_e9ffa2de__WEBPACK_IMPORTED_MODULE_0__.render,
  _JobInbox_vue_vue_type_template_id_e9ffa2de__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/JobInbox.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/CostSheet.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/CostSheet.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CostSheet_vue_vue_type_template_id_b301813e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CostSheet.vue?vue&type=template&id=b301813e */ "./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=template&id=b301813e");
/* harmony import */ var _CostSheet_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CostSheet.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _CostSheet_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CostSheet_vue_vue_type_template_id_b301813e__WEBPACK_IMPORTED_MODULE_0__.render,
  _CostSheet_vue_vue_type_template_id_b301813e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/CostSheet.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/ExtractionPanel.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/ExtractionPanel.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ExtractionPanel_vue_vue_type_template_id_fa6bcd28__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtractionPanel.vue?vue&type=template&id=fa6bcd28 */ "./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=template&id=fa6bcd28");
/* harmony import */ var _ExtractionPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExtractionPanel.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ExtractionPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ExtractionPanel_vue_vue_type_template_id_fa6bcd28__WEBPACK_IMPORTED_MODULE_0__.render,
  _ExtractionPanel_vue_vue_type_template_id_fa6bcd28__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/ExtractionPanel.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobInbox.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CostSheet_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CostSheet.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CostSheet_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExtractionPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ExtractionPanel.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ExtractionPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=template&id=e9ffa2de":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=template&id=e9ffa2de ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_template_id_e9ffa2de__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_template_id_e9ffa2de__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_template_id_e9ffa2de__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobInbox.vue?vue&type=template&id=e9ffa2de */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/JobInbox.vue?vue&type=template&id=e9ffa2de");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=template&id=b301813e":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=template&id=b301813e ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CostSheet_vue_vue_type_template_id_b301813e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CostSheet_vue_vue_type_template_id_b301813e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CostSheet_vue_vue_type_template_id_b301813e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CostSheet.vue?vue&type=template&id=b301813e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/CostSheet.vue?vue&type=template&id=b301813e");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=template&id=fa6bcd28":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=template&id=fa6bcd28 ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ExtractionPanel_vue_vue_type_template_id_fa6bcd28__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ExtractionPanel_vue_vue_type_template_id_fa6bcd28__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ExtractionPanel_vue_vue_type_template_id_fa6bcd28__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ExtractionPanel.vue?vue&type=template&id=fa6bcd28 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/ExtractionPanel.vue?vue&type=template&id=fa6bcd28");


/***/ })

}]);