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
/* harmony import */ var _view_pages_freight_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/OcrUploadModal.vue */ "./resources/js/src/view/pages/freight/components/OcrUploadModal.vue");
/* harmony import */ var _view_pages_freight_components_CostSheet_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/pages/freight/components/CostSheet.vue */ "./resources/js/src/view/pages/freight/components/CostSheet.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







const CLASSIFICATIONS = ["customer_enquiry", "airline", "clearance", "trucking_road"];

/* §740's tab set. The two carrying real data today come first; the rest name the
   Step 6 item that fills them, so an unfinished tab cannot be mistaken for a bug. */
const WORKSPACE_TABS = [{
  key: "enquiry",
  label: "Enquiry"
}, {
  key: "timing",
  label: "Timing"
}, {
  key: "extraction",
  label: "Extraction"
}, {
  key: "upload",
  label: "Upload",
  step: 2
}, {
  key: "cost",
  label: "Cost sheet"
}, {
  key: "docket",
  label: "E-Docket",
  step: 4
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "JobInbox",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FxDrawer: _view_pages_freight_components_FxDrawer_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    OcrUploadModal: _view_pages_freight_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
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
    tab: "enquiry",
    ocrOpen: false,
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
    tabLabel() {
      const t = WORKSPACE_TABS.find(x => x.key === this.tab);
      return t ? t.label : this.tab;
    },
    tabStep() {
      const t = WORKSPACE_TABS.find(x => x.key === this.tab);
      return t ? t.step : null;
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
    onExtracted(payload) {
      this.extracted = payload;
      this.setSplit(true);
      this.tab = "extraction";
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");



/* The box vocabulary from python/boxes_config.json — the same names FocusAir.vue
   already consumes, so nothing here needs a second mapping. */
const LABELS = {
  awb_number: "AWB number",
  shipper: "Shipper",
  consignee: "Consignee",
  departure: "Departure",
  destination: "Destination",
  transit: "Transit",
  cargo: "Cargo",
  weight_charge: "Weight charge",
  piece_weight: "Pieces / weight",
  chrg_code: "Charge code"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "OcrUploadModal",
  components: {
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    phase: "idle",
    dragging: false,
    filename: null,
    jobId: null,
    fields: {},
    review: [],
    error: null,
    poller: null,
    // Vision consent (§4.1.1). `deciding` guards the buttons: the answer spends money,
    // and a double-click must not become two attempts to spend it.
    pageCount: null,
    creditCost: 1,
    deciding: false
  }),
  computed: {
    /* Flattened to dot-paths so a nested region reports the FIELD, not the box —
       "shipper.name is low" is actionable, "shipper is low" is not. */
    rows() {
      const out = [];
      const walk = (obj, prefix) => {
        Object.keys(obj).forEach(key => {
          const node = obj[key];
          const path = prefix ? prefix + "." + key : key;
          if (node && typeof node === "object" && "confidence" in node) {
            out.push({
              path,
              label: LABELS[path] || path.replace(/[._]/g, " "),
              value: node.value,
              confidence: node.confidence
            });
          } else if (node && typeof node === "object") {
            walk(node, path);
          }
        });
      };
      walk(this.fields, "");
      /* Fields needing review first: the list is a worklist, not a record layout. */
      return out.sort((a, b) => (a.confidence === "high") - (b.confidence === "high"));
    }
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    onDrop(e) {
      this.dragging = false;
      const file = e.dataTransfer.files[0];
      if (file) this.upload(file);
    },
    onPick(e) {
      const file = e.target.files[0];
      if (file) this.upload(file);
    },
    upload(file) {
      if (file.type !== "application/pdf") {
        this.phase = "failed";
        this.error = "That is not a PDF. Extraction reads PDFs only.";
        return;
      }
      this.filename = file.name;
      this.phase = "uploading";
      this.error = null;
      const form = new FormData();
      form.append("upload_file", file);
      form.append("type", "ksr");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/upload-awb-file", form).then(({
        data
      }) => {
        this.jobId = data.job_id || data.data;
        this.phase = "processing";
        this.poll();
      }).catch(e => {
        this.phase = "failed";
        this.error = this.messageFor(e);
      });
    },
    /* Polled, not pushed: the job runs on the `ocr` queue and there is no socket yet.
       2s is slow enough not to hammer the API and fast enough to feel responsive
       against a 5-60s extraction. */
    poll() {
      this.stopPolling();
      this.poller = setInterval(() => {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/ocr-status/" + this.jobId).then(({
          data
        }) => {
          if (data.job_status === "completed") {
            this.stopPolling();
            this.fields = data.fields || {};
            this.review = data.needs_review || [];
            this.phase = "done";
          } else if (data.job_status === "awaiting_vision_consent") {
            /* 🔴 Stop polling and ASK. Without this branch the modal sits on
               "Reading the document…" forever while the job waits for an answer
               nobody is being asked for — which is what it did before consent
               existed. */
            this.stopPolling();
            this.pageCount = data.page_count || null;
            this.creditCost = data.credit_cost || 1;
            this.phase = "consent";
          } else if (data.job_status === "cancelled") {
            this.stopPolling();
            this.phase = "failed";
            this.error = data.error || "This extraction was cancelled.";
          } else if (data.job_status === "failed") {
            this.stopPolling();
            this.phase = "failed";
            this.error = data.error || "The document could not be read.";
          }
        }).catch(e => {
          this.stopPolling();
          this.phase = "failed";
          this.error = this.messageFor(e);
        });
      }, 2000);
    },
    stopPolling() {
      if (this.poller) {
        clearInterval(this.poller);
        this.poller = null;
      }
    },
    /* Answer the consent prompt. Accepting resumes polling because the extraction goes
       back to work; declining is terminal and says so rather than looping. */
    decide(decision) {
      this.deciding = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/ocr-consent/" + this.jobId, {
        decision
      }).then(({
        data
      }) => {
        if (data.job_status === "processing") {
          this.phase = "processing";
          this.poll();
        } else {
          this.phase = "failed";
          this.error = "Vision extraction was declined. Nothing was charged.";
        }
      }).catch(e => {
        this.phase = "failed";
        this.error = this.messageFor(e);
      }).finally(() => {
        this.deciding = false;
      });
    },
    accept() {
      /* Values only — the parent form takes them; the confidence travelled with the
         review list so the form can keep marking them. */
      this.$emit("extracted", {
        fields: this.fields,
        needsReview: this.review
      });
      this.close();
    },
    reset() {
      this.phase = "idle";
      this.error = null;
      this.filename = null;
      this.jobId = null;
      this.pageCount = null;
      this.creditCost = 1;
      this.deciding = false;
    },
    close() {
      this.stopPolling();
      this.reset();
      this.$emit("close");
    },
    messageFor(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
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
      click: function ($event) {
        _vm.ocrOpen = true;
      }
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
  }), 0)]], 2), _vm._v(" "), _c("OcrUploadModal", {
    attrs: {
      open: _vm.ocrOpen
    },
    on: {
      close: function ($event) {
        _vm.ocrOpen = false;
      },
      extracted: _vm.onExtracted
    }
  }), _vm._v(" "), _c("FxDrawer", {
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
  }, [_vm.active ? [_vm.tab === "enquiry" ? _c("section", [!_vm.active.enquiry ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Not promoted to an enquiry yet. Classifying this as a customer enquiry mints\n          a number — that is what turns a conversation into work.\n        ")]) : _c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Enquiry")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.active.enquiry.enquiry_no))]), _vm._v(" "), _c("dt", [_vm._v("Status")]), _vm._v(" "), _c("dd", [_c("StatusChip", {
    attrs: {
      value: _vm.active.enquiry.status
    }
  })], 1)])]) : _vm.tab === "timing" ? _c("section", [_c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Last inbound")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.active.latest_message_received_at,
      kind: "dateTime"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("First triaged")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.active.first_triage_at,
      kind: "dateTime"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("First replied")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.active.first_response_at,
      kind: "dateTime"
    }
  })], 1), _vm._v(" "), _c("dt", [_vm._v("Messages")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.active.message_count))])])]) : _vm.tab === "cost" ? _c("section", [!_vm.active.enquiry ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          No enquiry on this conversation yet, so there is no job to cost.\n        ")]) : _vm.jobId ? _c("CostSheet", {
    attrs: {
      "job-id": _vm.jobId
    }
  }) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("This enquiry has not been converted to a job yet.")])], 1) : _vm.tab === "extraction" ? _c("section", [!_vm.extracted ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          Nothing extracted yet. "), _c("strong", [_vm._v("Analyze PDF")]), _vm._v(" reads a document and\n          marks every field the extractor was unsure of.\n        ")]) : [_vm.extracted.needsReview.length ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n            " + _vm._s(_vm.extracted.needsReview.length) + " field(s) still need checking before this\n            reaches a document.\n          ")]) : _vm._e(), _vm._v(" "), _c("dl", {
    staticClass: "fx-defs"
  }, [_vm._l(_vm.extracted.fields, function (node, key) {
    return [node && node.confidence ? _c("dt", {
      key: key + "-k"
    }, [_vm._v(_vm._s(String(key).replace(/_/g, " ")))]) : _vm._e(), _vm._v(" "), node && node.confidence ? _c("dd", {
      key: key + "-v"
    }, [node.value ? _c("span", [_vm._v(_vm._s(node.value))]) : _c("span", {
      staticClass: "is-empty",
      attrs: {
        "aria-label": "Not found on the page"
      }
    }), _vm._v(" "), node.confidence !== "high" ? _c("StatusChip", {
      attrs: {
        value: node.confidence
      }
    }) : _vm._e()], 1) : _vm._e()];
  })], 2)]], 2) : _c("section", {
    staticClass: "fx-muted"
  }, [_c("p", [_vm._v(_vm._s(_vm.tabLabel) + " is not built yet — it lands with Step 6 item " + _vm._s(_vm.tabStep) + ".")])])] : _vm._e()], 2)], 1);
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=template&id=0171b6ef":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=template&id=0171b6ef ***!
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
  return _vm.open ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Extract from PDF"
    },
    on: {
      keydown: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) return null;
        return _vm.close.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title"
  }, [_vm._v("Extract from a document")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      "aria-label": "Close"
    },
    on: {
      click: _vm.close
    }
  }, [_vm._v("✕")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_vm.phase === "idle" ? _c("div", {
    staticClass: "fx-drop",
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
  }, [_vm._v("Drop a PDF here")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("or")]), _vm._v(" "), _c("label", {
    staticClass: "fx-btn"
  }, [_vm._v("\n          Choose a file\n          "), _c("input", {
    staticClass: "fx-drop__input",
    attrs: {
      type: "file",
      accept: "application/pdf"
    },
    on: {
      change: _vm.onPick
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-drop__note"
  }, [_vm._v("PDF only, up to 25 MB.")])]) : _vm.phase === "uploading" || _vm.phase === "processing" ? _c("div", {
    staticClass: "fx-drop"
  }, [_c("p", {
    staticClass: "fx-drop__lead"
  }, [_vm._v(_vm._s(_vm.phase === "uploading" ? "Uploading…" : "Reading the document…"))]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.filename))]), _vm._v(" "), _vm.phase === "processing" ? _c("p", {
    staticClass: "fx-muted fx-drop__note"
  }, [_vm._v("\n          This usually takes a few seconds. Long or scanned documents take longer.\n        ")]) : _vm._e()]) : _vm.phase === "consent" ? _c("div", {
    staticClass: "fx-drop"
  }, [_c("p", {
    staticClass: "fx-drop__lead"
  }, [_vm._v("This document has no readable text")]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.filename))]), _vm._v(" "), _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n          It looks like a scan, so reading it needs vision OCR.\n          "), _c("strong", [_vm._v(_vm._s(_vm.creditCost) + " credit" + _vm._s(_vm.creditCost === 1 ? "" : "s"))]), _vm.pageCount ? [_vm._v(", " + _vm._s(_vm.pageCount) + " page" + _vm._s(_vm.pageCount === 1 ? "" : "s"))] : _vm._e(), _vm._v(".\n          Nothing has been charged yet.\n        ")], 2), _vm._v(" "), _c("div", {
    staticClass: "fx-drop__actions"
  }, [_c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.deciding
    },
    on: {
      click: function ($event) {
        return _vm.decide("accept");
      }
    }
  }, [_vm._v("\n            " + _vm._s(_vm.deciding ? "Working…" : "Use vision (" + _vm.creditCost + " credit)") + "\n          ")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      disabled: _vm.deciding
    },
    on: {
      click: function ($event) {
        return _vm.decide("decline");
      }
    }
  }, [_vm._v("\n            Don't read it\n          ")])]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-drop__note"
  }, [_vm._v("\n          Declining costs nothing. If nobody answers, this is cancelled after 24 hours.\n        ")])]) : _vm.phase === "failed" ? _c("div", {
    staticClass: "fx-drop"
  }, [_c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    on: {
      click: _vm.reset
    }
  }, [_vm._v("Try another file")])]) : [_vm.review.length ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.review.length) + " field" + _vm._s(_vm.review.length === 1 ? "" : "s") + " need checking before\n          this is used. They are marked below.\n        ")]) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Every field came back at high confidence. Check it anyway.")]), _vm._v(" "), _c("table", {
    staticClass: "fx-table fx-extract"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", _vm._l(_vm.rows, function (row) {
    return _c("tr", {
      key: row.path,
      class: {
        "is-review": row.confidence !== "high"
      }
    }, [_c("td", [_vm._v(_vm._s(row.label))]), _vm._v(" "), _c("td", [row.value ? _c("span", [_vm._v(_vm._s(row.value))]) : _c("span", {
      staticClass: "is-empty",
      attrs: {
        "aria-label": "Not found on the page"
      }
    })]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: row.confidence
      }
    })], 1)]);
  }), 0)])]], 2), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    on: {
      click: _vm.close
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _vm.phase === "done" ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    on: {
      click: _vm.accept
    }
  }, [_vm._v("Use these values")]) : _vm._e()])])]) : _vm._e();
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Field")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Value")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Confidence")])])]);
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

/***/ "./resources/js/src/view/pages/freight/components/OcrUploadModal.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/OcrUploadModal.vue ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _OcrUploadModal_vue_vue_type_template_id_0171b6ef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OcrUploadModal.vue?vue&type=template&id=0171b6ef */ "./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=template&id=0171b6ef");
/* harmony import */ var _OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OcrUploadModal.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _OcrUploadModal_vue_vue_type_template_id_0171b6ef__WEBPACK_IMPORTED_MODULE_0__.render,
  _OcrUploadModal_vue_vue_type_template_id_0171b6ef__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/OcrUploadModal.vue"
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

/***/ "./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=script&lang=js":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./OcrUploadModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

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

/***/ "./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=template&id=0171b6ef":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=template&id=0171b6ef ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_template_id_0171b6ef__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_template_id_0171b6ef__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_template_id_0171b6ef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./OcrUploadModal.vue?vue&type=template&id=0171b6ef */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/OcrUploadModal.vue?vue&type=template&id=0171b6ef");


/***/ })

}]);