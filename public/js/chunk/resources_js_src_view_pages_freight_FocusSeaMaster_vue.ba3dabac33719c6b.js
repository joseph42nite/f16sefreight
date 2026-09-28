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
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_config_format__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/config/format */ "./resources/js/src/core/config/format.js");
/* harmony import */ var _view_pages_freight_components_Field_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/Field.vue */ "./resources/js/src/view/pages/freight/components/Field.vue");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_EntityPanel_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/EntityPanel.vue */ "./resources/js/src/view/pages/freight/components/EntityPanel.vue");
/* harmony import */ var _view_pages_freight_components_CostSheet_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/pages/freight/components/CostSheet.vue */ "./resources/js/src/view/pages/freight/components/CostSheet.vue");
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
  label: "Pick Up"
}, {
  n: 9,
  key: "charges",
  label: "Charges"
}, {
  n: 10,
  key: "financials",
  label: "Financials"
}, {
  n: 11,
  key: "customs",
  label: "Customs"
}, {
  n: 12,
  key: "edocket",
  label: "E-Docket"
}];
const PORTS = [{
  key: "por_code",
  label: "Place of receipt"
}, {
  key: "pol_code",
  label: "Port of loading"
}, {
  key: "ts1_code",
  label: "Transshipment 1"
}, {
  key: "ts2_code",
  label: "Transshipment 2"
}, {
  key: "ts3_code",
  label: "Transshipment 3"
}, {
  key: "pod_code",
  label: "Port of discharge"
}, {
  key: "del_code",
  label: "Place of delivery"
}];
const KINDS = [{
  key: "all",
  label: "All"
}, {
  key: "house",
  label: "Houses"
}, {
  key: "master",
  label: "Masters"
}];

/* What the form sends back of the header — the job's own columns. */
const HEAD = ["consol_type", "booking_thru", "job_order_no", "quotation_no", "planned_clearance_date", "pickup_address", "parent_job_id"];

/* The detail columns the server takes; anything else in `details` (ids, stamps) stays home. */
const DETAIL = ["carrier_id", "vessel_name", "voyage_no", "vessel_flag", "imo_number", "service_contract_no", "por_code", "pol_code", "pod_code", "del_code", "ts1_code", "ts2_code", "ts3_code", "etd", "eta", "commodity_description", "hs_code", "marks_numbers", "imdg_class", "un_number", "package_code", "piece_count", "gross_weight", "net_weight", "chargeable_weight", "weight_unit", "volume_cbm", "volume_unit", "mbl_number", "hbl_number", "bl_type", "release_type", "freight_terms", "haulage_provider_id", "empty_depot", "shipping_bill_no", "shipping_bill_date", "filing_status"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusSeaMaster",
  components: {
    Field: _view_pages_freight_components_Field_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    EntityPanel: _view_pages_freight_components_EntityPanel_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    CostSheet: _view_pages_freight_components_CostSheet_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  props: {
    jobId: {
      type: [Number, String],
      default: null
    }
  },
  data: () => ({
    rows: [],
    q: "",
    kind: "all",
    creating: false,
    searchTimer: null,
    jobNo: null,
    document: "house",
    client: null,
    parent: null,
    credit: null,
    fromMaster: [],
    form: {},
    head: {},
    containers: [],
    locking: {},
    violations: [],
    vocab: {
      cargo_types: [],
      container_types: [],
      consol_types: [],
      booking_thru: [],
      weight_units: [],
      volume_units: [],
      release_types: []
    },
    partners: [],
    masters: [],
    sheet: null,
    documents: [],
    docTypes: [],
    dims: {
      l: null,
      w: null,
      h: null
    },
    upload: {
      type: "other",
      busy: false,
      error: null
    },
    tab: "entity",
    loading: false,
    saving: false,
    saved: false,
    error: null,
    saveError: null,
    TABS,
    PORTS,
    KINDS
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapGetters)(["designation", "tierAtLeast"])), {}, {
    /* The server's viewCostSheet gate, mirrored so the tab says whose it is instead of failing. */
    canSeeCosts() {
      return ["pricing", "accounts", "boss"].includes(this.designation) && this.tierAtLeast("command");
    },
    /* Operations writes the bill; pricing and the Boss read it. The server re-checks. */
    canWrite() {
      return this.designation === "operations";
    },
    shown() {
      return this.kind === "all" ? this.rows : this.rows.filter(r => r.document === this.kind);
    },
    hasBadBox() {
      return this.containers.some(c => c.number && !this.isValidBox(c.number));
    },
    transitDays() {
      if (!this.form.etd || !this.form.eta) return null;
      return Math.round((new Date(this.form.eta) - new Date(this.form.etd)) / 86400000);
    },
    dimsCbm() {
      const {
        l,
        w,
        h
      } = this.dims;
      return l > 0 && w > 0 && h > 0 ? Number((l * w * h / 1e6).toFixed(3)) : null;
    }
  }),
  watch: {
    jobId: {
      immediate: true,
      handler() {
        this.jobId ? this.load() : this.list();
      }
    },
    /* The matrix, applied at once; the server refuses the same things whatever the form does. */
    "form.cargo_type": function (type) {
      const containerised = type === "fcl" || type === "liquid_cont";
      this.locking = Object.assign({}, this.locking, {
        delivery_mode: containerised ? "fcl" : type === "lcl" ? "lcl" : null,
        containers_enabled: containerised,
        dimensions_required: type === "lcl"
      });
      if (!containerised) this.containers = [];
    },
    tab(t) {
      if (t === "financials" && this.canSeeCosts) this.loadSheet();
      if (t === "edocket") this.loadDocs();
    }
  },
  created() {
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/partners").then(({
      data
    }) => {
      this.partners = data.data || [];
    }).catch(() => {});
  },
  methods: {
    labelOf(v) {
      return String(v || "").replace(/_/g, " ");
    },
    fmtDate(v) {
      return (0,_core_config_format__WEBPACK_IMPORTED_MODULE_1__.date)(v);
    },
    /* On a house that travels on a master, the vessel and ports are the master's (the cascade). */
    masterHint(key) {
      return this.fromMaster.includes(key) && this.parent ? "From master " + this.parent.execution_job_no : null;
    },
    upper(key) {
      if (this.form[key]) this.form[key] = String(this.form[key]).toUpperCase();
    },
    list() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sea-shipments" + (this.q ? "?q=" + encodeURIComponent(this.q) : "")).then(({
        data
      }) => {
        this.rows = data.data || [];
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    searchSoon() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(this.list, 300);
    },
    newMaster() {
      this.creating = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/sea-shipments", {}).then(({
        data
      }) => {
        this.$router.push("/focus-sea/" + data.job.id);
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.creating = false;
      });
    },
    /**
     * ISO 6346 — four letters, six digits, one check digit. The same computation the server and the filer run.
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
          [11, 22, 33].forEach(skip => {
            if (v >= skip) v++;
          }); // the letter table skips 11, 22 and 33
        } else {
          v = Number(ch);
        }
        sum += v * Math.pow(2, i);
      }
      return sum % 11 % 10 === Number(n[10]);
    },
    apply(data) {
      this.jobNo = data.job.execution_job_no;
      this.document = data.document;
      this.client = data.client;
      this.parent = data.parent;
      this.credit = data.credit;
      this.fromMaster = data.from_master || [];
      this.vocab = data.vocabulary;
      this.violations = data.violations || [];
      const d = data.details || {};
      this.form = {
        cargo_type: data.job.cargo_type
      };
      DETAIL.forEach(k => {
        this.$set(this.form, k, d[k] === undefined ? null : d[k]);
      });
      if (!this.form.filing_status) this.form.filing_status = "not_filed";
      this.head = {};
      HEAD.forEach(k => {
        this.$set(this.head, k, data.job[k] === undefined ? null : data.job[k]);
      });
      if (this.head.planned_clearance_date) this.head.planned_clearance_date = String(this.head.planned_clearance_date).slice(0, 10);
      this.containers = (data.containers || []).map(c => ({
        number: c.container_number,
        type: c.container_type,
        seal: c.seal_number
      }));
      this.$nextTick(() => {
        this.locking = data.locking;
      });
    },
    load() {
      this.loading = true;
      this.saveError = null;
      this.saved = false;
      this.sheet = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.jobId}/sea-shipment`).then(({
        data
      }) => {
        this.apply(data);
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
      // The masters a house could travel on.
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/sea-shipments").then(({
        data
      }) => {
        this.masters = (data.data || []).filter(r => r.document === "master" && String(r.id) !== String(this.jobId));
      }).catch(() => {});
    },
    loadSheet() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.jobId}/cost-sheet`).then(({
        data
      }) => {
        this.sheet = data;
      }).catch(() => {});
    },
    loadDocs() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get(`/jobs/${this.jobId}/documents`).then(({
        data
      }) => {
        this.documents = data.documents || [];
        this.docTypes = data.types || [];
      }).catch(e => {
        this.upload.error = this.readable(e);
      });
    },
    sendFile() {
      const file = this.$refs.file && this.$refs.file.files[0];
      if (!file) {
        this.upload.error = "Choose a file first.";
        return;
      }
      const body = new FormData();
      body.append("document_type", this.upload.type);
      body.append("file", file);
      this.upload.busy = true;
      this.upload.error = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.jobId}/documents`, body).then(() => {
        this.$refs.file.value = "";
        this.loadDocs();
      }).catch(e => {
        this.upload.error = this.readable(e);
      }).finally(() => {
        this.upload.busy = false;
      });
    },
    openDoc(d) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query(`/jobs/${this.jobId}/documents/${d.id}`, {
        responseType: "blob"
      }).then(({
        data
      }) => {
        window.open(URL.createObjectURL(data), "_blank");
      }).catch(e => {
        this.upload.error = this.readable(e);
      });
    },
    useDims() {
      this.form.volume_cbm = this.dimsCbm;
      this.form.volume_unit = "CBM";
    },
    isTabLocked(key) {
      return key === "container" && !this.locking.containers_enabled;
    },
    save() {
      this.saving = true;
      this.saveError = null;
      this.saved = false;
      const payload = Object.assign({}, this.form, this.head);
      if (this.locking.containers_enabled) {
        payload.containers = this.containers.filter(c => c.number).map(c => ({
          container_number: c.number,
          container_type: c.type || null,
          seal_number: c.seal || null
        }));
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${this.jobId}/sea-shipment`, payload).then(({
        data
      }) => {
        this.apply(data);
        this.saved = true;
      })
      /* §11.3 — the server's reason, verbatim. */.catch(e => {
        this.saveError = this.readable(e);
      }).finally(() => {
        this.saving = false;
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      if (d.errors) return Object.values(d.errors).flat().join(" ");
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
    branch: null,
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
      // A master's shipper is this shipment's own branch — the only choice there is.
      if (this.partyType === "branch") return this.branch ? [this.branch] : [];
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
        this.branch = data.branch || null;
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true ***!
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
  return _c("div", [_c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm.jobId ? [_vm._v(_vm._s(_vm.document === "master" ? "Master Bill of Lading" : "House Bill of Lading"))] : [_vm._v("Bills of Lading")]], 2), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm.jobId ? [_c("span", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.jobNo))]), _vm._v(" "), _vm.client ? [_vm._v(" · " + _vm._s(_vm.client.name))] : _vm._e(), _vm._v(" "), _vm.document === "master" ? [_vm._v(" ·\n          "), _c("router-link", {
    attrs: {
      to: {
        path: "/focus-sea/consol",
        query: {
          master: _vm.jobId
        }
      }
    }
  }, [_vm._v("Its houses and containers →")])] : _vm._e(), _vm._v(" "), _vm.parent ? [_vm._v(" · on master\n          "), _c("router-link", {
    staticClass: "identifier",
    attrs: {
      to: "/focus-sea/" + _vm.parent.id
    }
  }, [_vm._v(_vm._s(_vm.parent.execution_job_no))])] : _vm._e(), _vm._v("\n        · "), _c("router-link", {
    attrs: {
      to: "/focus-sea"
    }
  }, [_vm._v("All bills")])] : [_vm._v("Every sea shipment of the branch. A house is a client's shipment; a master is the carrier's bill a consol travels on.")]], 2)]), _vm._v(" "), !_vm.jobId ? [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Find")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.q,
      expression: "q"
    }],
    staticClass: "fx-input",
    attrs: {
      placeholder: "Job no, HBL, MBL or client"
    },
    domProps: {
      value: _vm.q
    },
    on: {
      input: [function ($event) {
        if ($event.target.composing) return;
        _vm.q = $event.target.value;
      }, _vm.searchSoon]
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "fx-seg",
    attrs: {
      role: "group",
      "aria-label": "Which bills"
    }
  }, _vm._l(_vm.KINDS, function (k) {
    return _c("button", {
      key: k.key,
      staticClass: "fx-btn",
      class: {
        "fx-btn--primary": _vm.kind === k.key
      },
      on: {
        click: function ($event) {
          _vm.kind = k.key;
        }
      }
    }, [_vm._v("\n          " + _vm._s(k.label) + "\n        ")]);
  }), 0), _vm._v(" "), _vm.canWrite ? _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.creating
    },
    on: {
      click: _vm.newMaster
    }
  }, [_vm._v("\n        " + _vm._s(_vm.creating ? "Creating…" : "New master") + "\n      ")]) : _vm._e()]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-table-wrap"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_vm._m(0), _vm._v(" "), _c("tbody", [_vm._l(_vm.shown, function (r) {
    return _c("tr", {
      key: r.id,
      staticClass: "is-clickable",
      on: {
        click: function ($event) {
          return _vm.$router.push("/focus-sea/" + r.id);
        }
      }
    }, [_c("td", [_c("router-link", {
      staticClass: "identifier",
      attrs: {
        to: "/focus-sea/" + r.id
      }
    }, [_vm._v(_vm._s(r.execution_job_no))])], 1), _vm._v(" "), _c("td", [_vm._v("\n              " + _vm._s(r.document === "master" ? "Master" : "House") + "\n              "), r.parent_no ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" · on " + _vm._s(r.parent_no))]) : _vm._e(), _vm._v(" "), r.direction === "import" ? _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(" · import")]) : _vm._e()]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.client || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s((r.document === "master" ? r.mbl_number : r.hbl_number) || "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.vessel_name || "—"))]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(r.pol_code || "…") + " → " + _vm._s(r.pod_code || "…"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(r.status))])]);
  }), _vm._v(" "), !_vm.shown.length && !_vm.loading ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "7"
    }
  }, [_vm._v("No sea shipments here yet.")])]) : _vm._e()], 2)])])] : [_vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : [_c("div", {
    staticClass: "fx-grid fx-sea-head"
  }, [_c("label", {
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
  }), 0)]), _vm._v(" "), _c("div", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Delivery mode")]), _vm._v(" "), _c("span", {
    staticClass: "fx-input fx-input--static"
  }, [_vm._v(_vm._s(_vm.locking.delivery_mode || "—"))])]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Consol type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.head.consol_type,
      expression: "head.consol_type"
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
        _vm.$set(_vm.head, "consol_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.consol_types, function (c) {
    return _c("option", {
      key: c,
      domProps: {
        value: c
      }
    }, [_vm._v(_vm._s(_vm.labelOf(c)))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Booking through")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.head.booking_thru,
      expression: "head.booking_thru"
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
        _vm.$set(_vm.head, "booking_thru", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.booking_thru, function (c) {
    return _c("option", {
      key: c,
      domProps: {
        value: c
      }
    }, [_vm._v(_vm._s(c))]);
  })], 2)]), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Shipment date",
      type: "date",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.head.planned_clearance_date,
      callback: function ($$v) {
        _vm.$set(_vm.head, "planned_clearance_date", $$v);
      },
      expression: "head.planned_clearance_date"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Job order no",
      disabled: !_vm.canWrite,
      mono: "",
      hint: "The client's own reference"
    },
    model: {
      value: _vm.head.job_order_no,
      callback: function ($$v) {
        _vm.$set(_vm.head, "job_order_no", $$v);
      },
      expression: "head.job_order_no"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Quotation no",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.head.quotation_no,
      callback: function ($$v) {
        _vm.$set(_vm.head, "quotation_no", $$v);
      },
      expression: "head.quotation_no"
    }
  }), _vm._v(" "), _vm.document !== "master" || _vm.head.parent_job_id ? _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("On master (sub-shipment)")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.head.parent_job_id,
      expression: "head.parent_job_id"
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
        _vm.$set(_vm.head, "parent_job_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("— not in a consol")]), _vm._v(" "), _vm._l(_vm.masters, function (m) {
    return _c("option", {
      key: m.id,
      domProps: {
        value: m.id
      }
    }, [_vm._v(_vm._s(m.execution_job_no) + _vm._s(m.mbl_number ? " · " + m.mbl_number : ""))]);
  })], 2)]) : _vm._e()], 1), _vm._v(" "), _vm.credit && _vm.credit.blocked ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v("\n        " + _vm._s(_vm.client.name) + " is over its credit limit — accounts will not finalize a bill for it until it pays or the limit is raised.\n      ")]) : _vm._e(), _vm._v(" "), _vm.violations.length ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n        " + _vm._s(_vm.violations.length) + " issue" + _vm._s(_vm.violations.length === 1 ? "" : "s") + " would fail ICEGATE's structural check:\n        "), _vm._l(_vm.violations, function (v, i) {
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
    key: "e" + _vm.jobId,
    attrs: {
      "job-id": _vm.jobId
    }
  }) : _vm.tab === "shipping" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Carrier")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.carrier_id,
      expression: "form.carrier_id"
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
        _vm.$set(_vm.form, "carrier_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.partners, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v(_vm._s(p.name))]);
  })], 2)]), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Vessel name",
      disabled: !_vm.canWrite || _vm.fromMaster.includes("vessel_name"),
      hint: _vm.masterHint("vessel_name")
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
      disabled: !_vm.canWrite || _vm.fromMaster.includes("voyage_no"),
      hint: _vm.masterHint("voyage_no")
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
      disabled: !_vm.canWrite || _vm.fromMaster.includes("vessel_flag"),
      hint: _vm.masterHint("vessel_flag")
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
      label: "IMO",
      disabled: !_vm.canWrite || _vm.fromMaster.includes("imo_number"),
      mono: "",
      hint: _vm.masterHint("imo_number") || "7 digits",
      maxlength: "7"
    },
    model: {
      value: _vm.form.imo_number,
      callback: function ($$v) {
        _vm.$set(_vm.form, "imo_number", $$v);
      },
      expression: "form.imo_number"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Service contract",
      disabled: !_vm.canWrite,
      mono: ""
    },
    model: {
      value: _vm.form.service_contract_no,
      callback: function ($$v) {
        _vm.$set(_vm.form, "service_contract_no", $$v);
      },
      expression: "form.service_contract_no"
    }
  })], 1) : _vm.tab === "routing" ? _c("div", {
    staticClass: "fx-grid"
  }, [_vm._l(_vm.PORTS, function (p) {
    return _c("Field", {
      key: p.key,
      attrs: {
        label: p.label,
        disabled: !_vm.canWrite || _vm.fromMaster.includes(p.key),
        mono: "",
        maxlength: "5",
        hint: _vm.masterHint(p.key) || "UN/LOCODE"
      },
      on: {
        input: function ($event) {
          return _vm.upper(p.key);
        }
      },
      model: {
        value: _vm.form[p.key],
        callback: function ($$v) {
          _vm.$set(_vm.form, p.key, $$v);
        },
        expression: "form[p.key]"
      }
    });
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "ETD",
      type: "date",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.etd,
      callback: function ($$v) {
        _vm.$set(_vm.form, "etd", $$v);
      },
      expression: "form.etd"
    }
  }), _vm._v(" "), _c("Field", {
    attrs: {
      label: "ETA",
      type: "date",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.eta,
      callback: function ($$v) {
        _vm.$set(_vm.form, "eta", $$v);
      },
      expression: "form.eta"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Transit")]), _vm._v(" "), _c("span", {
    staticClass: "fx-input fx-input--static"
  }, [_vm._v(_vm._s(_vm.transitDays === null ? "—" : _vm.transitDays + " days"))])])], 2) : _vm.tab === "goods" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("label", {
    staticClass: "fx-field fx-field--wide"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Commodity")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.commodity_description,
      expression: "form.commodity_description"
    }],
    staticClass: "fx-input",
    attrs: {
      rows: "3",
      maxlength: "500",
      disabled: !_vm.canWrite
    },
    domProps: {
      value: _vm.form.commodity_description
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "commodity_description", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("Field", {
    attrs: {
      label: "HS code",
      disabled: !_vm.canWrite,
      mono: "",
      hint: "6 to 10 digits",
      maxlength: "10"
    },
    model: {
      value: _vm.form.hs_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "hs_code", $$v);
      },
      expression: "form.hs_code"
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "fx-field fx-field--wide"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Marks & numbers")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.marks_numbers,
      expression: "form.marks_numbers"
    }],
    staticClass: "fx-input",
    attrs: {
      rows: "3",
      disabled: !_vm.canWrite
    },
    domProps: {
      value: _vm.form.marks_numbers
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "marks_numbers", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("Field", {
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
      label: "Package code",
      disabled: !_vm.canWrite,
      mono: "",
      hint: "≤ 3 chars (ICEGATE)"
    },
    model: {
      value: _vm.form.package_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "package_code", $$v);
      },
      expression: "form.package_code"
    }
  }), _vm._v(" "), _c("Field", {
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
      label: "Gross weight",
      type: "number",
      disabled: !_vm.canWrite,
      step: "0.001"
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
      label: "Net weight",
      type: "number",
      disabled: !_vm.canWrite,
      step: "0.001"
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
      label: "Chargeable weight",
      type: "number",
      disabled: !_vm.canWrite,
      step: "0.001"
    },
    model: {
      value: _vm.form.chargeable_weight,
      callback: function ($$v) {
        _vm.$set(_vm.form, "chargeable_weight", _vm._n($$v));
      },
      expression: "form.chargeable_weight"
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Weight unit")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.weight_unit,
      expression: "form.weight_unit"
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
        _vm.$set(_vm.form, "weight_unit", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.weight_units, function (u) {
    return _c("option", {
      key: u,
      domProps: {
        value: u
      }
    }, [_vm._v(_vm._s(u))]);
  })], 2)]), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Volume",
      type: "number",
      disabled: !_vm.canWrite,
      step: "0.001",
      hint: _vm.locking.dimensions_required ? "Mandatory for LCL — a box cannot be allocated without it" : null
    },
    model: {
      value: _vm.form.volume_cbm,
      callback: function ($$v) {
        _vm.$set(_vm.form, "volume_cbm", _vm._n($$v));
      },
      expression: "form.volume_cbm"
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Volume unit")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.volume_unit,
      expression: "form.volume_unit"
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
        _vm.$set(_vm.form, "volume_unit", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.volume_units, function (u) {
    return _c("option", {
      key: u,
      domProps: {
        value: u
      }
    }, [_vm._v(_vm._s(u))]);
  })], 2)]), _vm._v(" "), _c("div", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("From L × W × H (cm)")]), _vm._v(" "), _c("span", {
    staticClass: "fx-sea-dims"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.dims.l,
      expression: "dims.l",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      disabled: !_vm.canWrite,
      "aria-label": "Length cm"
    },
    domProps: {
      value: _vm.dims.l
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.dims, "l", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.dims.w,
      expression: "dims.w",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      disabled: !_vm.canWrite,
      "aria-label": "Width cm"
    },
    domProps: {
      value: _vm.dims.w
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.dims, "w", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  }), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model.number",
      value: _vm.dims.h,
      expression: "dims.h",
      modifiers: {
        number: true
      }
    }],
    staticClass: "fx-input",
    attrs: {
      type: "number",
      disabled: !_vm.canWrite,
      "aria-label": "Height cm"
    },
    domProps: {
      value: _vm.dims.h
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.dims, "h", _vm._n($event.target.value));
      },
      blur: function ($event) {
        return _vm.$forceUpdate();
      }
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: !_vm.canWrite || !_vm.dimsCbm
    },
    on: {
      click: _vm.useDims
    }
  }, [_vm._v("Use " + _vm._s(_vm.dimsCbm || "—") + " CBM")])])])], 1) : _vm.tab === "bl" ? _c("div", {
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
  }), _vm._v(" "), _vm.document !== "master" ? _c("Field", {
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
  }) : _vm._e(), _vm._v(" "), _c("Field", {
    attrs: {
      label: "BL type",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.bl_type,
      callback: function ($$v) {
        _vm.$set(_vm.form, "bl_type", $$v);
      },
      expression: "form.bl_type"
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Release")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.release_type,
      expression: "form.release_type"
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
        _vm.$set(_vm.form, "release_type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.release_types, function (r) {
    return _c("option", {
      key: r,
      domProps: {
        value: r
      }
    }, [_vm._v(_vm._s(r))]);
  })], 2)]), _vm._v(" "), _c("label", {
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
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "prepaid"
    }
  }, [_vm._v("Prepaid")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "collect"
    }
  }, [_vm._v("Collect")])])])], 1) : _vm.tab === "container" ? _c("div", [_c("div", {
    staticClass: "fx-table-wrap"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Container number")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Size / type")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Seal")]), _vm.canWrite ? _c("th", {
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
        input: [function ($event) {
          if ($event.target.composing) return;
          _vm.$set(c, "number", $event.target.value);
        }, function ($event) {
          c.number = c.number.toUpperCase();
        }]
      }
    }), _vm._v(" "), c.number && !_vm.isValidBox(c.number) ? _c("span", {
      staticClass: "fx-field__error"
    }, [_vm._v("Fails the ISO 6346 check digit")]) : _vm._e()]), _vm._v(" "), _c("td", [_c("select", {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: c.type,
        expression: "c.type"
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
          _vm.$set(c, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
        }
      }
    }, [_c("option", {
      domProps: {
        value: null
      }
    }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.vocab.container_types, function (t) {
      return _c("option", {
        key: t,
        domProps: {
          value: t
        }
      }, [_vm._v(_vm._s(t))]);
    })], 2)]), _vm._v(" "), _c("td", [_c("input", {
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
      attrs: {
        "aria-label": "Remove container"
      },
      on: {
        click: function ($event) {
          return _vm.containers.splice(i, 1);
        }
      }
    }, [_vm._v("✕")])]) : _vm._e()]);
  }), _vm._v(" "), !_vm.containers.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: _vm.canWrite ? 4 : 3
    }
  }, [_vm._v("No containers yet.")])]) : _vm._e()], 2)])]), _vm._v(" "), _vm.canWrite ? _c("button", {
    staticClass: "fx-btn",
    staticStyle: {
      "margin-top": "var(--space-3)"
    },
    on: {
      click: function ($event) {
        return _vm.containers.push({
          number: "",
          type: null,
          seal: ""
        });
      }
    }
  }, [_vm._v("Add container")]) : _vm._e()]) : _vm.tab === "pickup" ? _c("div", {
    staticClass: "fx-grid"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Haulage provider")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.haulage_provider_id,
      expression: "form.haulage_provider_id"
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
        _vm.$set(_vm.form, "haulage_provider_id", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("—")]), _vm._v(" "), _vm._l(_vm.partners, function (p) {
    return _c("option", {
      key: p.id,
      domProps: {
        value: p.id
      }
    }, [_vm._v(_vm._s(p.name))]);
  })], 2)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field fx-field--wide"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Pick-up address")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.head.pickup_address,
      expression: "head.pickup_address"
    }],
    staticClass: "fx-input",
    attrs: {
      rows: "3",
      maxlength: "500",
      disabled: !_vm.canWrite
    },
    domProps: {
      value: _vm.head.pickup_address
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.head, "pickup_address", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("Field", {
    attrs: {
      label: "Empty depot",
      disabled: !_vm.canWrite
    },
    model: {
      value: _vm.form.empty_depot,
      callback: function ($$v) {
        _vm.$set(_vm.form, "empty_depot", $$v);
      },
      expression: "form.empty_depot"
    }
  })], 1) : (_vm.tab === "charges" || _vm.tab === "financials") && !_vm.canSeeCosts ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("\n          The charges and their totals are the cost sheet, which pricing and accounts keep on the Command plan —\n          nothing on this bill changes them, and they change nothing here.\n        ")]) : _vm.tab === "charges" ? _c("CostSheet", {
    key: "c" + _vm.jobId,
    attrs: {
      "job-id": _vm.jobId
    }
  }) : _vm.tab === "financials" ? _c("div", [!_vm.sheet ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Sell")]), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.sheet.sell.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1), _vm._v(" "), _vm.sheet.buy ? [_c("dt", [_vm._v("Cost")]), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.sheet.buy.total,
      kind: "currency",
      "currency-code": "INR"
    }
  })], 1)] : _vm._e(), _vm._v(" "), _vm.sheet.margin ? [_c("dt", [_vm._v("Estimated profit")]), _vm._v(" "), _c("dd", [_c("Figure", {
    attrs: {
      value: _vm.sheet.margin.value,
      kind: "currency",
      "currency-code": "INR"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(" · " + _vm._s(_vm.sheet.margin.percent === null ? "no margin until something is billed" : Number(_vm.sheet.margin.percent).toFixed(2) + "%"))])], 1)] : _vm._e()], 2), _vm._v(" "), _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Figures are before tax. Lines are edited on the Charges tab; the bill goes to " + _vm._s(_vm.client ? _vm.client.name : "the client") + ".")])]) : _vm.tab === "customs" ? _c("div", {
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
    }, [_vm._v(_vm._s(_vm.labelOf(s)))]);
  }), 0)])], 1) : _vm.tab === "edocket" ? _c("div", [_vm.canWrite ? _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Document type")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.upload.type,
      expression: "upload.type"
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
        _vm.$set(_vm.upload, "type", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }
    }
  }, _vm._l(_vm.docTypes, function (t) {
    return _c("option", {
      key: t,
      domProps: {
        value: t
      }
    }, [_vm._v(_vm._s(_vm.labelOf(t)))]);
  }), 0)]), _vm._v(" "), _c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("File")]), _vm._v(" "), _c("input", {
    ref: "file",
    staticClass: "fx-input",
    attrs: {
      type: "file",
      accept: ".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc,.csv"
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.upload.busy
    },
    on: {
      click: _vm.sendFile
    }
  }, [_vm._v(_vm._s(_vm.upload.busy ? "Scanning…" : "Upload"))])]) : _vm._e(), _vm._v(" "), _vm.upload.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.upload.error))]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-table-wrap"
  }, [_c("table", {
    staticClass: "fx-table"
  }, [_c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Type")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("File")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("By")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("When")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.documents, function (d) {
    return _c("tr", {
      key: d.id
    }, [_c("td", [_vm._v(_vm._s(_vm.labelOf(d.document_type)))]), _vm._v(" "), _c("td", [_c("a", {
      attrs: {
        href: "#"
      },
      on: {
        click: function ($event) {
          $event.preventDefault();
          return _vm.openDoc(d);
        }
      }
    }, [_vm._v(_vm._s(d.file_name))])]), _vm._v(" "), _c("td", [_vm._v(_vm._s(d.uploader ? d.uploader.name : "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(_vm.fmtDate(d.created_at)))])]);
  }), _vm._v(" "), !_vm.documents.length ? _c("tr", [_c("td", {
    staticClass: "fx-muted",
    attrs: {
      colspan: "4"
    }
  }, [_vm._v("No documents yet.")])]) : _vm._e()], 2)])])]) : _vm._e()], 1), _vm._v(" "), _vm.canWrite ? _c("footer", {
    staticClass: "fx-form__foot"
  }, [_vm.saveError ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.saveError))]) : _vm._e(), _vm._v(" "), _vm.saved ? _c("p", {
    staticClass: "fx-muted",
    attrs: {
      role: "status"
    }
  }, [_vm._v("Saved.")]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.saving || _vm.hasBadBox
    },
    on: {
      click: _vm.save
    }
  }, [_vm._v(_vm._s(_vm.saving ? "Saving…" : "Save"))])]) : _vm._e()]]], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Shipment")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Bill")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Client")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("BL no")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Vessel")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Route")]), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")])])]);
}];
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

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/* harmony import */ var _FocusSeaMaster_vue_vue_type_template_id_0af23761_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true */ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true");
/* harmony import */ var _FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusSeaMaster_vue_vue_type_style_index_0_id_0af23761_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css */ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusSeaMaster_vue_vue_type_template_id_0af23761_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusSeaMaster_vue_vue_type_template_id_0af23761_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0af23761",
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

/***/ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_0af23761_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_0af23761_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_0af23761_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=template&id=0af23761&scoped=true");


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


/***/ }),

/***/ "./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_style_index_0_id_0af23761_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/FocusSeaMaster.vue?vue&type=style&index=0&id=0af23761&scoped=true&lang=css");


/***/ })

}]);