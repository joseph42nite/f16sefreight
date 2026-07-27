"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_ClientShipments_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadminclientshipments",
  data: function data() {
    return {
      fields: [{
        label: "Sl",
        key: "index"
      }, {
        label: "AWB Number / Client",
        key: "awb_number"
      }, {
        label: "HAWB Count",
        key: "house_way_bills_count"
      }, {
        label: "Origin",
        key: "departure_airport"
      }, {
        label: "Destination",
        key: "destination_airport"
      }, {
        label: "Pcs",
        key: "pieces"
      }, {
        label: "Weight",
        key: "weight"
      }, {
        label: "Time & Date Sent",
        key: "date_sent",
        thStyle: {
          minWidth: '150px'
        }
      }, {
        label: "FNA Status",
        key: "fna_status"
      }, {
        label: "Sent XML",
        key: "action"
      }],
      items: [],
      companies: [],
      filters: {
        company_id: null,
        origin: "",
        destination: "",
        dates: [],
        months: [],
        fna_status: null
      },
      dateFilterType: "day",
      fnaOptions: [{
        value: null,
        text: "All Shipments"
      }, {
        value: "yes",
        text: "FNA Received"
      }, {
        value: "no",
        text: "FMA"
      }],
      totalAwb: 0,
      totalHawb: 0,
      isLoading: false,
      searchText: "",
      totalRows: 0,
      currentPage: 1,
      perPage: 50,
      pageOptions: [50, 100],
      localFilteredItems: null,
      xmlContent: "",
      selectedAwbId: "",
      pollTimer: null,
      lastUpdated: "",
      selectedMawb: null,
      hawbsList: [],
      isHawbsLoading: false
    };
  },
  components: {
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  computed: {
    companyOptions: function companyOptions() {
      var options = [{
        value: null,
        text: "All Clients / Companies"
      }];
      this.companies.forEach(function (company) {
        options.push({
          value: company.id,
          text: company.name
        });
      });
      return options;
    },
    isFiltered: function isFiltered() {
      return this.filters.company_id !== null || this.filters.origin !== "" || this.filters.destination !== "" || this.filters.dates && this.filters.dates.length > 0 || this.filters.months && this.filters.months.length > 0 || this.filters.fna_status !== null;
    }
  },
  watch: {
    currentPage: function currentPage() {
      this.fetchShipments();
    },
    perPage: function perPage() {
      this.applyFilters();
    },
    searchText: function searchText(val) {
      if (!val || val.trim() === "") {
        this.localFilteredItems = null;
        this.applyFilters();
      }
    }
  },
  methods: {
    fetchCompanies: function fetchCompanies() {
      var _this = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-company").then(function (_ref) {
        var data = _ref.data;
        _this.companies = data;
      })["catch"](function (err) {
        console.error("Failed to load companies", err);
      });
    },
    fetchShipments: function fetchShipments() {
      var _this2 = this;
      var showLoading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (showLoading) {
        this.isLoading = true;
      }
      var params = _objectSpread(_objectSpread({}, this.filters), {}, {
        page: this.currentPage,
        per_page: this.perPage,
        search: this.searchText
      });
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/superadmin/client-shipments", {
        params: params
      }).then(function (_ref2) {
        var data = _ref2.data;
        _this2.localFilteredItems = null;
        _this2.items = data.shipments;
        _this2.totalAwb = data.total_awb;
        _this2.totalHawb = data.total_hawb;
        if (data.pagination) {
          _this2.totalRows = data.pagination.total;
        } else {
          _this2.totalRows = data.shipments.length;
        }
        var now = new Date();
        _this2.lastUpdated = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
      })["catch"](function (err) {
        console.error("Failed to load shipments", err);
        if (showLoading) {
          sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire("Error", "Could not retrieve shipments data.", "error");
        }
      })["finally"](function () {
        _this2.isLoading = false;
        _this2.scheduleNextPoll();
      });
    },
    applyFilters: function applyFilters() {
      this.localFilteredItems = null;
      if (this.currentPage !== 1) {
        this.currentPage = 1;
      } else {
        this.fetchShipments();
      }
    },
    handleAwbSearch: function handleAwbSearch() {
      var search = this.searchText ? this.searchText.trim().toLowerCase() : "";
      if (!search) {
        this.localFilteredItems = null;
        this.applyFilters();
        return;
      }

      // Search in currently loaded items first
      var localMatches = this.items.filter(function (item) {
        var awbCode = item.awb_code ? String(item.awb_code).toLowerCase() : "";
        var awbNo = item.awb_no ? String(item.awb_no).toLowerCase() : "";
        var combined = "".concat(awbCode, "-").concat(awbNo);
        return combined.includes(search) || awbCode.includes(search) || awbNo.includes(search);
      });
      if (localMatches.length > 0) {
        this.localFilteredItems = localMatches;
      } else {
        // Not found locally, fallback to server search
        this.localFilteredItems = null;
        this.applyFilters();
      }
    },
    scheduleNextPoll: function scheduleNextPoll() {
      var _this3 = this;
      this.clearPollTimer();

      // Check Operating Hours (10:00 AM to 10:00 PM)
      var now = new Date();
      var hour = now.getHours();
      var isOperatingHours = hour >= 10 && hour < 22;

      // Only poll if tab is active/visible and within operating hours
      if (isOperatingHours && document.visibilityState === "visible") {
        this.pollTimer = setTimeout(function () {
          _this3.fetchShipments(false); // Fetch silently in background
        }, 60000); // 60 seconds
      } else {
        // Check again in 60 seconds even if suspended, to resume when time/visibility changes
        this.pollTimer = setTimeout(function () {
          _this3.scheduleNextPoll();
        }, 60000);
      }
    },
    clearPollTimer: function clearPollTimer() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
        this.pollTimer = null;
      }
    },
    handleVisibilityChange: function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        this.fetchShipments(false); // Fetch immediately upon window focus & resume schedule
      } else {
        this.clearPollTimer(); // Stop timers when invisible
      }
    },
    resetFilters: function resetFilters() {
      this.filters = {
        company_id: null,
        origin: "",
        destination: "",
        dates: [],
        months: [],
        fna_status: null
      };
      this.fetchShipments();
    },
    setDateFilterType: function setDateFilterType(type) {
      this.dateFilterType = type;
      if (type === 'day') {
        this.filters.months = [];
      } else {
        this.filters.dates = [];
      }
      this.fetchShipments();
    },
    downloadCsv: function downloadCsv() {
      var _this4 = this;
      var isDateFilterActive = this.filters.dates && this.filters.dates.length > 0 || this.filters.months && this.filters.months.length > 0;
      if (isDateFilterActive) {
        this.isLoading = true;
        var params = _objectSpread(_objectSpread({}, this.filters), {}, {
          search: this.searchText,
          "export": 'all'
        });
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/superadmin/client-shipments", {
          params: params
        }).then(function (_ref3) {
          var data = _ref3.data;
          _this4.generateAndDownloadCsv(data.shipments);
        })["catch"](function (err) {
          console.error("Failed to export shipments", err);
          sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire("Error", "Could not retrieve export data.", "error");
        })["finally"](function () {
          _this4.isLoading = false;
        });
      } else {
        this.generateAndDownloadCsv(this.items);
      }
    },
    generateAndDownloadCsv: function generateAndDownloadCsv(items) {
      var _this5 = this;
      var headers = ["AWB Number", "Client/Company", "HAWB Count", "Origin", "Destination", "Pieces", "Weight", "Date Sent", "Time Sent", "FNA Status"];
      var rows = items.map(function (item) {
        var awb = "".concat(item.awb_code, "-").concat(item.awb_no);
        var company = item.agents_info && item.agents_info.company_name ? item.agents_info.company_name.name : "";
        var hawbCount = item.house_way_bills_count || 0;
        var origin = _this5.getAirportCode(item.departure_airport);
        var destination = _this5.getAirportCode(item.destination_airport);
        var pieces = item.consignment_data ? item.consignment_data.pieces : "";
        var weight = item.consignment_data ? "".concat(item.consignment_data.gross_weight, " ").concat(item.consignment_data.weight_code || 'K') : "";
        var dateSent = _this5.formatDate(item.created_at);
        var timeSent = _this5.formatTime(item.created_at);
        var fnaStatus = item.fna_received ? "FNA Received" : "FMA";
        return [awb, company, hawbCount, origin, destination, pieces, weight, dateSent, timeSent, fnaStatus];
      });
      var csvContent = [headers.join(",")].concat(_toConsumableArray(rows.map(function (row) {
        return row.map(function (val) {
          return "\"".concat(String(val).replace(/"/g, '""'), "\"");
        }).join(",");
      }))).join("\n");
      var blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
      });
      var link = document.createElement("a");
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "shipments_export_".concat(new Date().toISOString().slice(0, 10), ".csv"));
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    rowClass: function rowClass(item, type) {
      if (!item || type !== 'row') return '';
      return item.fna_received ? 'table-row-fna' : '';
    },
    formatDate: function formatDate(dateString) {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatTime: function formatTime(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    getAirportCode: function getAirportCode(val) {
      if (!val) return "";
      return val.split(',')[0].trim();
    },
    getAirportName: function getAirportName(val) {
      if (!val) return "";
      var parts = val.split(',');
      if (parts.length > 1) {
        return parts.slice(1).join(',').trim();
      }
      return "";
    },
    viewXml: function viewXml(awbId) {
      var _this6 = this;
      this.selectedAwbId = awbId;
      this.xmlContent = "Loading XML content...";
      this.$bvModal.show("xml-viewer-modal");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/shipment-xml/".concat(awbId)).then(function (response) {
        // If response is XML string
        _this6.xmlContent = typeof response.data === 'string' ? response.data : new XMLSerializer().serializeToString(response.data);
      })["catch"](function (err) {
        console.error("Failed to fetch XML file", err);
        _this6.xmlContent = "Error: XML file could not be found or retrieved.";
      });
    },
    viewHawbs: function viewHawbs(mawbItem) {
      var _this7 = this;
      this.selectedMawb = mawbItem;
      this.hawbsList = [];
      this.isHawbsLoading = true;
      this.$bvModal.show("hawbs-list-modal");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/mawb-hawbs/".concat(mawbItem.awb_code, "/").concat(mawbItem.awb_no)).then(function (_ref4) {
        var data = _ref4.data;
        _this7.hawbsList = data;
      })["catch"](function (err) {
        console.error("Failed to fetch HAWBs", err);
        sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire("Error", "Could not retrieve House AWBs.", "error");
      })["finally"](function () {
        _this7.isHawbsLoading = false;
      });
    },
    viewHawbXml: function viewHawbXml(hawbId) {
      var _this8 = this;
      this.selectedAwbId = hawbId;
      this.xmlContent = "Loading HAWB XML content...";
      this.$bvModal.show("xml-viewer-modal");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/hawb-xml/".concat(hawbId)).then(function (response) {
        _this8.xmlContent = typeof response.data === 'string' ? response.data : new XMLSerializer().serializeToString(response.data);
      })["catch"](function (err) {
        console.error("Failed to fetch HAWB XML file", err);
        _this8.xmlContent = "Error: HAWB XML file could not be found or retrieved.";
      });
    },
    copyXml: function copyXml() {
      navigator.clipboard.writeText(this.xmlContent).then(function () {
        sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire({
          title: "Copied!",
          text: "XML content copied to clipboard.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      })["catch"](function (err) {
        sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire("Error", "Failed to copy text.", "error");
      });
    },
    downloadXml: function downloadXml() {
      var blob = new Blob([this.xmlContent], {
        type: "application/xml"
      });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      var isMawb = this.selectedAwbId.includes('-');
      link.download = isMawb ? "xml_airway_bill_".concat(this.selectedAwbId, ".xml") : "xml_houseway_bill_".concat(this.selectedAwbId, ".xml");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    copyFnaReason: function copyFnaReason(reason) {
      var _this9 = this;
      var text = reason || 'Message not specified';
      navigator.clipboard.writeText(text).then(function () {
        _this9.$bvToast.toast('Message copied to clipboard', {
          title: 'Copied!',
          variant: 'success',
          solid: true,
          autoHideDelay: 2000
        });
      })["catch"](function () {
        _this9.$bvToast.toast('Failed to copy text', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      });
    }
  },
  mounted: function mounted() {
    this.fetchCompanies();
    this.fetchShipments();
    this.scheduleNextPoll();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeDestroy: function beforeDestroy() {
    this.clearPollTimer();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true ***!
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
  return _c("div", {
    staticClass: "py-5"
  }, [_c("div", {
    staticClass: "admin-page-header d-flex flex-wrap justify-content-between align-items-center mb-6"
  }, [_vm._m(0), _vm._v(" "), _vm.lastUpdated ? _c("div", {
    staticClass: "d-flex align-items-center mt-3 mt-md-0"
  }, [_vm.isFiltered ? _c("b-badge", {
    staticClass: "font-weight-bold px-3 py-2 mr-2 cursor-pointer animate-pulse",
    staticStyle: {
      cursor: "pointer"
    },
    attrs: {
      variant: "light-warning"
    },
    on: {
      click: _vm.resetFilters
    }
  }, [_c("i", {
    staticClass: "fas fa-filter mr-1 text-warning"
  }), _vm._v(" Filtering Active (Clear)\n      ")]) : _vm._e(), _vm._v(" "), _c("b-badge", {
    staticClass: "font-weight-bold px-3 py-2",
    attrs: {
      variant: "light-primary"
    }
  }, [_c("i", {
    staticClass: "fas fa-sync-alt fa-spin mr-1 text-primary"
  }), _vm._v(" Live: Updated at " + _vm._s(_vm.lastUpdated) + "\n      ")])], 1) : _vm._e()]), _vm._v(" "), _c("div", {
    staticClass: "row mb-5"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-primary text-white"
  }, [_c("div", [_c("span", {
    staticClass: "stats-label text-white-50 text-uppercase font-weight-bold"
  }, [_vm._v("Total AWB Shipments")]), _vm._v(" "), _c("h3", {
    staticClass: "stats-value font-weight-bolder mt-2"
  }, [_vm._v(_vm._s(_vm.totalAwb))])]), _vm._v(" "), _vm._m(1)])]), _vm._v(" "), _c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-success text-white"
  }, [_c("div", [_c("span", {
    staticClass: "stats-label text-white-50 text-uppercase font-weight-bold"
  }, [_vm._v("Total HAWB Shipments")]), _vm._v(" "), _c("h3", {
    staticClass: "stats-value font-weight-bolder mt-2"
  }, [_vm._v(_vm._s(_vm.totalHawb))])]), _vm._v(" "), _vm._m(2)])])]), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card"
  }, [_c("div", {
    staticClass: "filter-panel p-6 mb-6"
  }, [_vm._m(3), _vm._v(" "), _c("div", {
    staticClass: "row align-items-end"
  }, [_c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Client / Company")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    attrs: {
      options: _vm.companyOptions
    },
    on: {
      change: _vm.applyFilters
    },
    model: {
      value: _vm.filters.company_id,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "company_id", $$v);
      },
      expression: "filters.company_id"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-1 mb-3 mb-md-0 px-1"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Origin")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Origin"
    },
    on: {
      keyup: function keyup($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.applyFilters.apply(null, arguments);
      }
    },
    model: {
      value: _vm.filters.origin,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "origin", $$v);
      },
      expression: "filters.origin"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-1 mb-3 mb-md-0 px-1"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Destination")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Dest"
    },
    on: {
      keyup: function keyup($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.applyFilters.apply(null, arguments);
      }
    },
    model: {
      value: _vm.filters.destination,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "destination", $$v);
      },
      expression: "filters.destination"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-3 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Date / Month of Sending")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("div", {
    staticClass: "mr-2",
    staticStyle: {
      flex: "none"
    }
  }, [_c("b-button-group", {
    attrs: {
      size: "sm"
    }
  }, [_c("b-button", {
    staticStyle: {
      padding: "0.45rem 0.6rem",
      "font-size": "0.8rem"
    },
    attrs: {
      variant: _vm.dateFilterType === "day" ? "primary" : "outline-primary"
    },
    on: {
      click: function click($event) {
        return _vm.setDateFilterType("day");
      }
    }
  }, [_vm._v("\n                  Day\n                ")]), _vm._v(" "), _c("b-button", {
    staticStyle: {
      padding: "0.45rem 0.6rem",
      "font-size": "0.8rem"
    },
    attrs: {
      variant: _vm.dateFilterType === "month" ? "primary" : "outline-primary"
    },
    on: {
      click: function click($event) {
        return _vm.setDateFilterType("month");
      }
    }
  }, [_vm._v("\n                  Mon\n                ")])], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "flex-grow-1",
    staticStyle: {
      "min-width": "140px"
    }
  }, [_vm.dateFilterType === "day" ? _c("date-picker", {
    staticClass: "w-100 mx-datepicker-custom",
    attrs: {
      type: "date",
      multiple: "",
      placeholder: "Select dates",
      valueType: "format",
      format: "YYYY-MM-DD"
    },
    on: {
      change: _vm.applyFilters
    },
    model: {
      value: _vm.filters.dates,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "dates", $$v);
      },
      expression: "filters.dates"
    }
  }) : _c("date-picker", {
    staticClass: "w-100 mx-datepicker-custom",
    attrs: {
      type: "month",
      multiple: "",
      placeholder: "Select months",
      valueType: "format",
      format: "YYYY-MM"
    },
    on: {
      change: _vm.applyFilters
    },
    model: {
      value: _vm.filters.months,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "months", $$v);
      },
      expression: "filters.months"
    }
  })], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("FNA Status")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    attrs: {
      options: _vm.fnaOptions
    },
    on: {
      change: _vm.applyFilters
    },
    model: {
      value: _vm.filters.fna_status,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "fna_status", $$v);
      },
      expression: "filters.fna_status"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-3 d-flex"
  }, [_c("b-button", {
    directives: [{
      name: "b-tooltip",
      rawName: "v-b-tooltip.hover",
      modifiers: {
        hover: true
      }
    }],
    staticClass: "w-100 mr-2 d-flex align-items-center justify-content-center",
    attrs: {
      variant: "primary",
      title: "Apply Filters"
    },
    on: {
      click: _vm.applyFilters
    }
  }, [_c("i", {
    staticClass: "fas fa-search mr-1"
  }), _vm._v(" Search\n          ")]), _vm._v(" "), _c("b-button", {
    directives: [{
      name: "b-tooltip",
      rawName: "v-b-tooltip.hover",
      modifiers: {
        hover: true
      }
    }],
    staticClass: "w-100 d-flex align-items-center justify-content-center",
    attrs: {
      variant: "outline-secondary",
      title: "Reset Filters & Show Live Count"
    },
    on: {
      click: _vm.resetFilters
    }
  }, [_c("i", {
    staticClass: "fas fa-undo-alt mr-1"
  }), _vm._v(" Reset\n          ")])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "admin-filter-row d-flex flex-wrap align-items-center justify-content-between px-6 pt-4"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("span", {
    staticClass: "mr-3 font-weight-bold text-muted"
  }, [_vm._v("Show:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control-sm mr-4",
    staticStyle: {
      "max-width": "120px"
    },
    attrs: {
      id: "per-page-select",
      options: _vm.pageOptions
    },
    model: {
      value: _vm.perPage,
      callback: function callback($$v) {
        _vm.perPage = $$v;
      },
      expression: "perPage"
    }
  }), _vm._v(" "), _c("b-button", {
    staticClass: "d-flex align-items-center",
    attrs: {
      variant: "outline-success",
      size: "sm"
    },
    on: {
      click: _vm.downloadCsv
    }
  }, [_c("i", {
    staticClass: "fas fa-file-csv mr-1"
  }), _vm._v(" Export CSV\n        ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "w-md-25"
  }, [_c("b-input-group", {
    attrs: {
      size: "sm"
    }
  }, [_c("b-form-input", {
    attrs: {
      id: "filter-input",
      type: "search",
      placeholder: "Search AWB..."
    },
    on: {
      keyup: function keyup($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.handleAwbSearch.apply(null, arguments);
      },
      search: _vm.handleAwbSearch
    },
    model: {
      value: _vm.searchText,
      callback: function callback($$v) {
        _vm.searchText = $$v;
      },
      expression: "searchText"
    }
  }), _vm._v(" "), _c("b-input-group-append", [_c("b-button", {
    staticClass: "d-flex align-items-center justify-content-center",
    attrs: {
      variant: "primary"
    },
    on: {
      click: _vm.handleAwbSearch
    }
  }, [_c("i", {
    staticClass: "fas fa-search"
  })])], 1)], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "admin-table-wrapper px-6 pb-6"
  }, [_vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 8,
      columns: 8
    }
  }) : _c("b-table", {
    attrs: {
      responsive: "",
      stacked: "md",
      hover: "",
      items: _vm.localFilteredItems !== null ? _vm.localFilteredItems : _vm.items,
      fields: _vm.fields,
      "primary-key": "id",
      "thead-class": "text-uppercase text-muted font-size-xs",
      "empty-text": "No shipments found matching the filters.",
      "show-empty": "",
      "tbody-tr-class": _vm.rowClass
    },
    scopedSlots: _vm._u([{
      key: "cell(index)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bold"
        }, [_vm._v("#" + _vm._s((_vm.currentPage - 1) * _vm.perPage + data.index + 1))])];
      }
    }, {
      key: "cell(awb_number)",
      fn: function fn(data) {
        return [_c("div", [_c("span", {
          staticClass: "font-weight-bold text-dark font-size-lg"
        }, [_vm._v(_vm._s(data.item.awb_code) + "-" + _vm._s(data.item.awb_no))]), _vm._v(" "), data.item.agents_info && data.item.agents_info.company_name ? _c("div", {
          staticClass: "text-muted font-size-xs"
        }, [_c("i", {
          staticClass: "fas fa-building mr-1"
        }), _vm._v(_vm._s(data.item.agents_info.company_name.name) + "\n            ")]) : _vm._e()])];
      }
    }, {
      key: "cell(house_way_bills_count)",
      fn: function fn(data) {
        return [_c("b-badge", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "px-3 py-2 font-weight-bold font-size-sm cursor-pointer",
          staticStyle: {
            cursor: "pointer"
          },
          attrs: {
            variant: "light-success",
            pill: "",
            title: "Click to view associated HAWBs"
          },
          on: {
            click: function click($event) {
              return _vm.viewHawbs(data.item);
            }
          }
        }, [_vm._v("\n            " + _vm._s(data.item.house_way_bills_count) + " HAWB\n          ")])];
      }
    }, {
      key: "cell(departure_airport)",
      fn: function fn(data) {
        return [data.item.departure_airport ? _c("div", [_c("span", {
          staticClass: "font-weight-bold text-dark"
        }, [_vm._v(_vm._s(_vm.getAirportCode(data.item.departure_airport)))]), _vm._v(" "), _vm.getAirportName(data.item.departure_airport) ? _c("div", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "text-muted font-size-xs text-truncate",
          staticStyle: {
            "max-width": "120px"
          },
          attrs: {
            title: _vm.getAirportName(data.item.departure_airport)
          }
        }, [_vm._v("\n              " + _vm._s(_vm.getAirportName(data.item.departure_airport)) + "\n            ")]) : _vm._e()]) : _c("span", [_vm._v("—")])];
      }
    }, {
      key: "cell(destination_airport)",
      fn: function fn(data) {
        return [data.item.destination_airport ? _c("div", [_c("span", {
          staticClass: "font-weight-bold text-dark"
        }, [_vm._v(_vm._s(_vm.getAirportCode(data.item.destination_airport)))]), _vm._v(" "), _vm.getAirportName(data.item.destination_airport) ? _c("div", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "text-muted font-size-xs text-truncate",
          staticStyle: {
            "max-width": "120px"
          },
          attrs: {
            title: _vm.getAirportName(data.item.destination_airport)
          }
        }, [_vm._v("\n              " + _vm._s(_vm.getAirportName(data.item.destination_airport)) + "\n            ")]) : _vm._e()]) : _c("span", [_vm._v("—")])];
      }
    }, {
      key: "cell(pieces)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bolder"
        }, [_vm._v(_vm._s(data.item.consignment_data ? data.item.consignment_data.pieces : "—"))])];
      }
    }, {
      key: "cell(weight)",
      fn: function fn(data) {
        return [data.item.consignment_data ? _c("span", {
          staticClass: "font-weight-bolder"
        }, [_vm._v("\n            " + _vm._s(data.item.consignment_data.gross_weight) + " " + _vm._s(data.item.consignment_data.weight_code || "K") + "\n          ")]) : _c("span", [_vm._v("—")])];
      }
    }, {
      key: "cell(date_sent)",
      fn: function fn(data) {
        return [_c("div", {
          staticClass: "text-nowrap"
        }, [_c("span", {
          staticClass: "font-weight-bold text-dark d-block mb-1"
        }, [_vm._v(_vm._s(_vm.formatDate(data.item.updated_at)))]), _vm._v(" "), _c("span", {
          staticClass: "text-muted font-size-xs"
        }, [_c("i", {
          staticClass: "far fa-clock mr-1 text-primary"
        }), _vm._v(_vm._s(_vm.formatTime(data.item.updated_at)))])])];
      }
    }, {
      key: "cell(fna_status)",
      fn: function fn(data) {
        return [data.item.fna_received ? _c("div", {
          staticClass: "d-inline-flex align-items-center"
        }, [_c("b-badge", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "text-uppercase font-weight-bold px-3 py-2",
          attrs: {
            variant: "light-danger",
            title: data.item.fna_reason || "Rejection reason not specified"
          }
        }, [_c("i", {
          staticClass: "fas fa-exclamation-triangle mr-1 text-danger"
        }), _vm._v(" FNA Received\n            ")]), _vm._v(" "), _c("b-button", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "btn-icon-sm ml-2",
          staticStyle: {
            padding: "0.25rem 0.5rem"
          },
          attrs: {
            variant: "light-danger",
            size: "sm",
            title: "Copy FNA Message"
          },
          on: {
            click: function click($event) {
              return _vm.copyFnaReason(data.item.fna_reason);
            }
          }
        }, [_c("i", {
          staticClass: "far fa-copy text-danger"
        })])], 1) : _c("div", {
          staticClass: "d-inline-flex align-items-center"
        }, [_c("b-badge", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "text-uppercase font-weight-bold px-3 py-2",
          attrs: {
            variant: "light-success",
            title: data.item.fma_reason || "Approved or accepted by airline"
          }
        }, [_c("i", {
          staticClass: "fas fa-check-circle mr-1 text-success"
        }), _vm._v(" " + _vm._s(data.item.latest_status || "FMA") + "\n            ")]), _vm._v(" "), data.item.fma_reason && data.item.fma_reason.toLowerCase().includes("reject") ? _c("b-badge", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "text-uppercase font-weight-bold px-2 py-1 ml-2",
          staticStyle: {
            "font-size": "0.75rem"
          },
          attrs: {
            variant: "light-danger",
            title: "Airline response contains rejection details"
          }
        }, [_vm._v("\n              Rejected\n            ")]) : _vm._e(), _vm._v(" "), data.item.fma_reason ? _c("b-button", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "btn-icon-sm ml-2",
          staticStyle: {
            padding: "0.25rem 0.5rem"
          },
          attrs: {
            variant: "light-success",
            size: "sm",
            title: "Copy FMA Message"
          },
          on: {
            click: function click($event) {
              return _vm.copyFnaReason(data.item.fma_reason);
            }
          }
        }, [_c("i", {
          staticClass: "far fa-copy text-success"
        })]) : _vm._e()], 1)];
      }
    }, {
      key: "cell(action)",
      fn: function fn(data) {
        return [_c("b-button", {
          staticClass: "btn-icon-sm",
          attrs: {
            variant: "light-primary",
            size: "sm"
          },
          on: {
            click: function click($event) {
              return _vm.viewXml(data.item.id);
            }
          }
        }, [_c("i", {
          staticClass: "fas fa-code mr-1"
        }), _vm._v(" XML\n          ")])];
      }
    }])
  })], 1), _vm._v(" "), _vm.totalRows > 0 ? _c("div", {
    staticClass: "admin-pagination-wrap px-6 pb-6"
  }, [_c("div", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("\n        Showing " + _vm._s(_vm.items.length ? (_vm.currentPage - 1) * _vm.perPage + 1 : 0) + " to " + _vm._s(Math.min(_vm.currentPage * _vm.perPage, _vm.totalRows)) + " of " + _vm._s(_vm.totalRows) + " entries\n      ")]), _vm._v(" "), _c("b-pagination", {
    staticClass: "my-0",
    attrs: {
      "total-rows": _vm.totalRows,
      "per-page": _vm.perPage,
      size: "sm"
    },
    model: {
      value: _vm.currentPage,
      callback: function callback($$v) {
        _vm.currentPage = $$v;
      },
      expression: "currentPage"
    }
  })], 1) : _vm._e()]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "hawbs-list-modal",
      size: "xl",
      "hide-header": "",
      "hide-footer": "",
      "body-class": "p-0",
      "modal-class": "xml-modal-dark",
      centered: ""
    }
  }, [_c("div", {
    staticClass: "xml-modal-header"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("div", {
    staticClass: "xml-modal-icon mr-3",
    staticStyle: {
      background: "rgba(16, 185, 129, 0.2)",
      color: "#10b981"
    }
  }, [_c("i", {
    staticClass: "fas fa-boxes"
  })]), _vm._v(" "), _c("div", [_c("h5", {
    staticClass: "mb-0 text-white font-weight-bold"
  }, [_vm._v("Associated House Air Waybills")]), _vm._v(" "), _vm.selectedMawb ? _c("div", {
    staticClass: "d-flex align-items-center mt-1"
  }, [_c("span", {
    staticClass: "xml-awb-badge mr-2"
  }, [_c("i", {
    staticClass: "fas fa-link mr-1"
  }), _vm._v("MAWB")]), _vm._v(" "), _c("code", {
    staticClass: "text-white font-size-sm",
    staticStyle: {
      background: "rgba(255,255,255,0.1)",
      padding: "2px 8px",
      "border-radius": "4px",
      "font-size": "0.82rem"
    }
  }, [_vm._v(_vm._s(_vm.selectedMawb.awb_code) + "-" + _vm._s(_vm.selectedMawb.awb_no))])]) : _vm._e()])]), _vm._v(" "), _c("button", {
    staticClass: "xml-close-btn",
    on: {
      click: function click($event) {
        return _vm.$bvModal.hide("hawbs-list-modal");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-times"
  })])]), _vm._v(" "), _c("div", {
    staticClass: "p-6 bg-light",
    staticStyle: {
      "min-height": "250px"
    }
  }, [_vm.isHawbsLoading ? _c("div", {
    staticClass: "text-center py-10"
  }, [_c("b-spinner", {
    staticClass: "mb-3",
    attrs: {
      variant: "primary"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "text-muted font-weight-bold"
  }, [_vm._v("Fetching associated House AWBs...")])], 1) : !_vm.hawbsList || _vm.hawbsList.length === 0 ? _c("div", {
    staticClass: "text-center py-10"
  }, [_c("i", {
    staticClass: "fas fa-info-circle text-muted font-size-h1 mb-3"
  }), _vm._v(" "), _c("p", {
    staticClass: "text-muted font-weight-bold"
  }, [_vm._v("No House Air Waybills found for this shipment.")])]) : _c("div", [_c("div", {
    staticClass: "table-responsive rounded shadow-sm bg-white"
  }, [_c("table", {
    staticClass: "table table-hover mb-0"
  }, [_c("thead", {
    staticClass: "bg-light text-uppercase text-muted font-size-xs font-weight-bold"
  }, [_c("tr", [_c("th", {
    staticClass: "px-6 py-4"
  }, [_vm._v("Sl")]), _vm._v(" "), _c("th", {
    staticClass: "px-6 py-4"
  }, [_vm._v("HAWB ID")]), _vm._v(" "), _c("th", {
    staticClass: "px-6 py-4 text-center"
  }, [_vm._v("Destination")]), _vm._v(" "), _c("th", {
    staticClass: "px-6 py-4 text-center"
  }, [_vm._v("Pieces")]), _vm._v(" "), _c("th", {
    staticClass: "px-6 py-4 text-center"
  }, [_vm._v("Weight")]), _vm._v(" "), _c("th", {
    staticClass: "px-6 py-4 text-center"
  }, [_vm._v("Message Status")]), _vm._v(" "), _c("th", {
    staticClass: "px-6 py-4 text-center"
  }, [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", {
    staticClass: "font-size-sm text-dark font-weight-medium"
  }, _vm._l(_vm.hawbsList, function (hawb, idx) {
    return _c("tr", {
      key: hawb.id
    }, [_c("td", {
      staticClass: "px-6 py-4 align-middle font-weight-bold"
    }, [_vm._v("#" + _vm._s(idx + 1))]), _vm._v(" "), _c("td", {
      staticClass: "px-6 py-4 align-middle"
    }, [_c("span", {
      staticClass: "font-weight-bold text-primary"
    }, [_vm._v(_vm._s(hawb.id))])]), _vm._v(" "), _c("td", {
      staticClass: "px-6 py-4 align-middle text-center font-weight-bold"
    }, [_vm._v("\n                  " + _vm._s(hawb.destination_airport || "—") + "\n                ")]), _vm._v(" "), _c("td", {
      staticClass: "px-6 py-4 align-middle text-center font-weight-bold"
    }, [_vm._v("\n                  " + _vm._s(hawb.consignment_data ? hawb.consignment_data.pieces : "—") + "\n                ")]), _vm._v(" "), _c("td", {
      staticClass: "px-6 py-4 align-middle text-center font-weight-bold"
    }, [_vm._v("\n                  " + _vm._s(hawb.consignment_data ? hawb.consignment_data.gross_weight : "—") + " " + _vm._s(hawb.consignment_data ? hawb.consignment_data.weight_code || "K" : "") + "\n                ")]), _vm._v(" "), _c("td", {
      staticClass: "px-6 py-4 align-middle text-center"
    }, [hawb.fna_received ? _c("div", {
      staticClass: "d-inline-flex align-items-center justify-content-center"
    }, [_c("b-badge", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "text-uppercase font-weight-bold px-3 py-2",
      attrs: {
        variant: "light-danger",
        title: hawb.fna_reason || "Rejection reason not specified"
      }
    }, [_c("i", {
      staticClass: "fas fa-exclamation-triangle mr-1 text-danger"
    }), _vm._v(" FNA Received\n                    ")]), _vm._v(" "), _c("b-button", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "btn-icon-sm ml-2",
      staticStyle: {
        padding: "0.25rem 0.5rem"
      },
      attrs: {
        variant: "light-danger",
        size: "sm",
        title: "Copy FNA Message"
      },
      on: {
        click: function click($event) {
          return _vm.copyFnaReason(hawb.fna_reason);
        }
      }
    }, [_c("i", {
      staticClass: "far fa-copy text-danger"
    })])], 1) : _c("div", {
      staticClass: "d-inline-flex align-items-center justify-content-center"
    }, [_c("b-badge", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "text-uppercase font-weight-bold px-3 py-2",
      attrs: {
        variant: "light-success",
        title: hawb.fma_reason || "Approved or accepted by airline"
      }
    }, [_c("i", {
      staticClass: "fas fa-check-circle mr-1 text-success"
    }), _vm._v(" " + _vm._s(hawb.latest_status || "FMA") + "\n                    ")]), _vm._v(" "), hawb.fma_reason && hawb.fma_reason.toLowerCase().includes("reject") ? _c("b-badge", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "text-uppercase font-weight-bold px-2 py-1 ml-2",
      staticStyle: {
        "font-size": "0.75rem"
      },
      attrs: {
        variant: "light-danger",
        title: "Airline response contains rejection details"
      }
    }, [_vm._v("\n                      Rejected\n                    ")]) : _vm._e(), _vm._v(" "), hawb.fma_reason ? _c("b-button", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "btn-icon-sm ml-2",
      staticStyle: {
        padding: "0.25rem 0.5rem"
      },
      attrs: {
        variant: "light-success",
        size: "sm",
        title: "Copy FMA Message"
      },
      on: {
        click: function click($event) {
          return _vm.copyFnaReason(hawb.fma_reason);
        }
      }
    }, [_c("i", {
      staticClass: "far fa-copy text-success"
    })]) : _vm._e()], 1)]), _vm._v(" "), _c("td", {
      staticClass: "px-6 py-4 align-middle text-center"
    }, [_c("b-button", {
      staticClass: "btn-icon-sm",
      attrs: {
        variant: "light-primary",
        size: "sm"
      },
      on: {
        click: function click($event) {
          return _vm.viewHawbXml(hawb.id);
        }
      }
    }, [_c("i", {
      staticClass: "fas fa-code mr-1"
    }), _vm._v(" XML\n                  ")])], 1)]);
  }), 0)])])])])]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "xml-viewer-modal",
      size: "xl",
      "hide-header": "",
      "hide-footer": "",
      "body-class": "p-0",
      "modal-class": "xml-modal-dark",
      centered: ""
    }
  }, [_c("div", {
    staticClass: "xml-modal-header"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("div", {
    staticClass: "xml-modal-icon mr-3"
  }, [_c("i", {
    staticClass: "fas fa-file-code"
  })]), _vm._v(" "), _c("div", [_c("h5", {
    staticClass: "mb-0 text-white font-weight-bold"
  }, [_vm._v("XML Message Viewer")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center mt-1"
  }, [_c("span", {
    staticClass: "xml-awb-badge mr-2"
  }, [_c("i", {
    staticClass: "fas fa-tag mr-1"
  }), _vm._v("AWB")]), _vm._v(" "), _c("code", {
    staticClass: "text-white font-size-sm",
    staticStyle: {
      background: "rgba(255,255,255,0.1)",
      padding: "2px 8px",
      "border-radius": "4px",
      "font-size": "0.82rem"
    }
  }, [_vm._v(_vm._s(_vm.selectedAwbId))])])])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("button", {
    staticClass: "xml-action-btn mr-2",
    attrs: {
      title: "Copy to clipboard"
    },
    on: {
      click: _vm.copyXml
    }
  }, [_c("i", {
    staticClass: "fas fa-copy mr-1"
  }), _vm._v(" Copy\n        ")]), _vm._v(" "), _c("button", {
    staticClass: "xml-action-btn xml-action-btn--primary mr-3",
    attrs: {
      title: "Download XML"
    },
    on: {
      click: _vm.downloadXml
    }
  }, [_c("i", {
    staticClass: "fas fa-download mr-1"
  }), _vm._v(" Download\n        ")]), _vm._v(" "), _c("button", {
    staticClass: "xml-close-btn",
    on: {
      click: function click($event) {
        return _vm.$bvModal.hide("xml-viewer-modal");
      }
    }
  }, [_c("i", {
    staticClass: "fas fa-times"
  })])])]), _vm._v(" "), _c("div", {
    staticClass: "xml-editor-area"
  }, [_c("div", {
    staticClass: "xml-editor-toolbar"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("span", {
    staticClass: "xml-dot xml-dot--red mr-1"
  }), _vm._v(" "), _c("span", {
    staticClass: "xml-dot xml-dot--yellow mr-1"
  }), _vm._v(" "), _c("span", {
    staticClass: "xml-dot xml-dot--green mr-2"
  }), _vm._v(" "), _c("span", {
    staticClass: "xml-lang-badge"
  }, [_vm._v("XML")])]), _vm._v(" "), _c("span", {
    staticClass: "xml-toolbar-hint"
  }, [_c("i", {
    staticClass: "fas fa-lock mr-1"
  }), _vm._v("Read-only")])]), _vm._v(" "), _c("div", {
    staticClass: "xml-code-scroll"
  }, [_c("pre", {
    staticClass: "xml-code-pre"
  }, [_c("code", {
    staticClass: "xml-code-content"
  }, [_vm._v(_vm._s(_vm.xmlContent))])])])])])], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "d-flex flex-column"
  }, [_c("h2", {
    staticClass: "font-weight-bold text-dark mb-1"
  }, [_vm._v("Client Shipments Tracker")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted font-size-sm"
  }, [_vm._v("Monitor all airway bills (AWB) and house airway bills (HAWB) executed per client")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "stats-icon"
  }, [_c("i", {
    staticClass: "fas fa-file-invoice font-size-h1 text-white-50"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "stats-icon"
  }, [_c("i", {
    staticClass: "fas fa-boxes font-size-h1 text-white-50"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("h5", {
    staticClass: "mb-4 text-primary font-weight-bold"
  }, [_c("i", {
    staticClass: "fas fa-filter mr-2"
  }), _vm._v("Filter Shipments")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=template&id=44e21582&scoped=true */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true");
/* harmony import */ var _ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js");
/* harmony import */ var _ClientShipments_vue_vue_type_style_index_0_id_44e21582_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css");
/* harmony import */ var _ClientShipments_vue_vue_type_style_index_1_id_44e21582_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "44e21582",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/ClientShipments.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=template&id=44e21582&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css":
/*!***********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_style_index_0_id_44e21582_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_style_index_1_id_44e21582_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=1&id=44e21582&lang=css");


/***/ })

}]);