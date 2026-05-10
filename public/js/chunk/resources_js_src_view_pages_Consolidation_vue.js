"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Consolidation_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SideBar",
  data: function data() {
    return {
      primaryText: "/media/custome/side-menu/H1-primary-text.svg",
      isMobileMenuOpen: false,
      menuItems: [{
        label: "Focus Air",
        path: "/focus-air",
        icon: "/media/custome/side-menu/3.png",
        activeIcon: "/media/custome/side-menu/3-active.png",
        activePaths: ['/focus-air', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']
      }, {
        label: "Message Log",
        path: "/message-log",
        icon: "/media/custome/side-menu/4.png",
        activeIcon: "/media/custome/side-menu/4-active.png",
        activePaths: ['/message-log']
      }, {
        label: "Rate",
        path: "/rate",
        icon: "/media/custome/side-menu/5.png",
        activeIcon: "/media/custome/side-menu/5-active.png",
        activePaths: ['/rate']
      }]
    };
  },
  computed: {
    activeItem: function activeItem() {
      var _this = this;
      return this.menuItems.find(function (item) {
        return _this.isActive(item.activePaths);
      }) || this.menuItems[0];
    }
  },
  methods: {
    isActive: function isActive(paths) {
      var _this2 = this;
      if (typeof paths === "string") paths = [paths];
      return paths.some(function (path) {
        var regex = new RegExp("^".concat(path.replace(/:[^\s/]+/g, "[^/]+")));
        return regex.test(_this2.$route.path);
      });
    },
    toggleMobileMenu: function toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu: function closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    navigateMobile: function navigateMobile(path) {
      this.$router.push(path);
      this.isMobileMenuOpen = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _layout_SideBar_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/SideBar.vue */ "./resources/js/src/view/layout/SideBar.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }





// import PageLoader from "../components/PageLoader.vue";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      form: new Form({
        id: '',
        master_origin: '',
        master_destination: '',
        description: '',
        gross_weight: '',
        pieces: '',
        special_handling_info: '',
        special_service_request: '',
        other_service_information: '',
        awb_code: '',
        awb_no: '',
        entries: [],
        oci_entries: [],
        tableCodes: [],
        totals: {
          total_volume: null,
          total_amount: 0
        }
      }),
      selectedViewPageOption: '/consolidation',
      codes: [{
        value: 'ACT',
        text: 'ACT - Active Temperature Controlled System'
      }, {
        value: 'AOG',
        text: 'AOG - Aircraft on ground'
      }, {
        value: 'ATT',
        text: 'ATT - Cargo attached to AWB'
      }, {
        value: 'AVI',
        text: 'AVI - Live animals'
      }, {
        value: 'BIG',
        text: 'BIG - Outsized'
      }, {
        value: 'BUP',
        text: 'BUP - Built up pallet'
      }, {
        value: 'CAO',
        text: 'CAO - Cargo Aircraft Only'
      }, {
        value: 'CAT',
        text: 'CAT - Cargo Attendant Accompanying Shipment'
      }, {
        value: 'COL',
        text: 'COL – Cool Goods/Refrigerated Goods'
      }, {
        value: 'COM',
        text: 'COM - Company mail'
      }, {
        value: 'CRT',
        text: 'CRT - Control Room Temperature '
      }, {
        value: 'DGD',
        text: 'DGD - Dangerous Goods as per attached DGD or DGD-CAO'
      }, {
        value: 'DIP',
        text: 'DIP - Diplomatic mail'
      }, {
        value: 'EAP',
        text: 'EAP - e-freight Consignment with Accompanying Documents'
      }, {
        value: 'EAW',
        text: 'EAW - e-freight Consignment with No Accompanying Documents'
      }, {
        value: 'EAT',
        text: 'EAT - Foodstuffs'
      }, {
        value: 'ECC',
        text: 'ECC - Electronically Concluded Cargo Contract'
      }, {
        value: 'ELI',
        text: 'ELI - Lithium Ion batteries excepted class 9'
      }, {
        value: 'ELM',
        text: 'ELM - Lithium Metal batteries excepted class 9'
      }, {
        value: 'EMD',
        text: 'EMD - Electronic Monitoring Devices on/in Cargo/Container'
      }, {
        value: 'ERT',
        text: 'ERT - Extended Room Temperature +2°C to +25°C'
      }, {
        value: 'FIL',
        text: 'FIL - Undeveloped/unexposed film'
      }, {
        value: 'FRI',
        text: 'FRI - Frozen Goods Subject to Veterinary/Phytosanitary Inspections'
      }, {
        value: 'FRO',
        text: 'FRO - Frozen Goods (not for dry ice but -20 C products)'
      }, {
        value: 'GCO',
        text: 'GCO - General Cargo'
      }, {
        value: 'GOG',
        text: 'GOG - Hanging Garments'
      }, {
        value: 'HEA',
        text: 'HEA - Heavy Cargo, over 150kg pc'
      }, {
        value: 'HEG',
        text: 'HEG - Hatching Eggs'
      }, {
        value: 'HUM',
        text: 'HUM - Human remains'
      }, {
        value: 'ICE',
        text: 'ICE - Dry ice'
      }, {
        value: 'LHO',
        text: 'LHO - Living Human Organs/Blood'
      }, {
        value: 'LIC',
        text: 'LIC - License Required'
      }, {
        value: 'MAG',
        text: 'MAG - Magnetised Material'
      }, {
        value: 'MAL',
        text: 'MAL - Mail '
      }, {
        value: 'MUW',
        text: 'MUW - Munitions / Guns'
      }, {
        value: 'NDA',
        text: 'NDA - No dims Available'
      }, {
        value: 'NWP',
        text: 'NWP - Newspapers / Magazines'
      }, {
        value: 'OBX',
        text: 'OBX - Obnoxious Cargo'
      }, {
        value: 'OCI',
        text: 'OCI - Other Customs, Security and Regulatory Control Information'
      }, {
        value: 'OHG',
        text: 'OHG - Overhang Items '
      }, {
        value: 'OSI',
        text: 'OSI - Other Service Information'
      }, {
        value: 'PAC',
        text: 'PAC - Passenger and Cargo'
      }, {
        value: 'PEA',
        text: 'PEA - Hunting trophies'
      }, {
        value: 'PEF',
        text: 'PEF - Flowers'
      }, {
        value: 'PEM',
        text: 'PEM - Meat'
      }, {
        value: 'PEP',
        text: 'PEP - Fruits and Vegetables'
      }, {
        value: 'PER',
        text: 'PER - Perishable cargo'
      }, {
        value: 'PES',
        text: 'PES - Fish / Seafood'
      }, {
        value: 'PIL',
        text: 'PIL - Pharmaceuticals'
      }, {
        value: 'QRT',
        text: 'QRT - Quick Ramp Transfer '
      }, {
        value: 'RAC',
        text: 'RAC - Reserverd Air Cargo'
      }, {
        value: 'RBI',
        text: 'RBI - Fully regulated lithium ion batteries (Class 9, UN 3480) as per Section IA and IB of PI 965'
      }, {
        value: 'RBM',
        text: 'RBM - Cargo-XML Manual and ToolkitFully regulated lithium metal batteries (Class 9, UN 3090) as per Section IA and IB of PI 968'
      }, {
        value: 'RCL',
        text: 'RCL - Cryogenic Liquid'
      }, {
        value: 'RCM',
        text: 'RCM - Corrosive'
      }, {
        value: 'RCX',
        text: 'RCX - Explosives 1.3C'
      }, {
        value: 'RDS',
        text: 'RDS - Biological Substance'
      }, {
        value: 'REQ',
        text: 'REQ - Dangerous Goods in Excepted Quantities'
      }, {
        value: 'REX',
        text: 'REX - To be reserved for normally forbidden Explosives, Divisions 1.1, 1.2, 1.3, 1.4F, 1.5 and 1.6'
      }, {
        value: 'RFG',
        text: '>RFG - Flammable Gas'
      }, {
        value: 'RFL',
        text: 'RFL - Flammable Liquid'
      }, {
        value: 'RFS',
        text: 'RFS - Flammable Solid'
      }, {
        value: 'RFW',
        text: 'RFW - Dangerous When Wet'
      }, {
        value: 'RGX',
        text: 'RGX - Explosives 1.3G'
      }, {
        value: 'RIS',
        text: 'RIS - Infectious Substance'
      }, {
        value: 'RLI',
        text: 'RLI - Litium Ion batteries'
      }, {
        value: 'RLM',
        text: 'RLM - Litium Metal batteries'
      }, {
        value: 'RMD',
        text: 'RMD - Miscellaneous Dangerous Goods'
      }, {
        value: 'RNG',
        text: 'RNG - Non-Flammable Gas'
      }, {
        value: 'ROP',
        text: 'ROP - Organic Peroxide'
      }, {
        value: 'ROX',
        text: 'ROX - Oxidiser'
      }, {
        value: 'RPB',
        text: 'RPB - Poison'
      }, {
        value: 'RPG',
        text: 'RPG - Toxic (Poison) Gas'
      }, {
        value: 'RRE',
        text: 'RRE - Excepted Quantities of Radioactive Material'
      }, {
        value: 'RRW',
        text: 'RRW - Radioactive - White'
      }, {
        value: 'RRY',
        text: 'RRY - Radioactive - Yellow'
      }, {
        value: 'RSB',
        text: 'RSB - Polystyrene Beads'
      }, {
        value: 'RSC',
        text: 'RSC - Spontaneously Combustible'
      }, {
        value: 'RXB',
        text: 'RXB - Explosives 1.4B'
      }, {
        value: 'RXC',
        text: 'RXC - Explosives 1.4C'
      }, {
        value: 'RXD',
        text: 'RXD - Explosives 1.4D'
      }, {
        value: 'RXE',
        text: 'RXE - Explosives 1.4E'
      }, {
        value: 'RXG',
        text: 'RXG - Explosives 1.4G'
      }, {
        value: 'RXS',
        text: 'RXS - Explosives'
      }, {
        value: 'SAL',
        text: 'SAL - Surface Mail '
      }, {
        value: 'SCO',
        text: 'SCO - Cargo Secure for All-Cargo Aircraft Only '
      }, {
        value: 'SFX',
        text: 'SFX - Expedair Service '
      }, {
        value: 'SHL',
        text: 'SHL - Save Human Life '
      }, {
        value: 'SHR',
        text: 'SHR - Secure for Passenger, All-Cargo and All-Mail Aircraft in Accordance with High Risk Requirements '
      }, {
        value: 'SPF',
        text: 'SPF - Laboratory Animals'
      }, {
        value: 'SPX',
        text: 'SPX - Cargo Secure for Passenger and All-Cargo Aircraft '
      }, {
        value: 'SUR',
        text: 'SUR - Surface Transportation'
      }, {
        value: 'SWP',
        text: 'SWP - Sporting weapons'
      }, {
        value: 'VAL',
        text: 'VAL - Valuable cargo'
      }, {
        value: 'VOL',
        text: 'VOL - Volume'
      }, {
        value: 'VUN',
        text: 'VUN - Vulnerable Cargo'
      }, {
        value: 'WET',
        text: 'WET - Shipments of Wet Material not Packed in Watertight Containers'
      }, {
        value: 'XPH',
        text: 'XPH - Equation Heavy for KLM'
      }, {
        value: 'XPS',
        text: 'XPS - 236 XPS'
      }],
      oci_info: {
        country_code: '',
        info_identifier: '',
        custom_info_identifier: '',
        supplementary_info: ''
      },
      countries: [],
      searchQuery_to: '',
      isDropdownOpen_departure: false,
      isDropdownOpen_destination: false,
      selectedCode: '',
      custom_special_handling_code: '',
      manualCode: '',
      validationErrors: [],
      hs_code_error: [],
      location: [],
      isOpen: false,
      consolidation: [],
      editIndex: null,
      edit_entry_index: null,
      isFetching: false,
      hasSearchResults: false,
      searchPerformed: false,
      data_items: [],
      oci_data: {},
      ///get-oci-data
      oci_identifiers: {},
      tableData: [],
      existingData: {},
      options: [{
        text: "Me",
        value: "1"
      }, {
        text: "Participant Group",
        value: "1"
      }],
      logoSrc: "/media/custome/logo-1.png"
    };
  },
  methods: {
    onSelect: function onSelect(value) {
      // Redirect to the selected page
      if (value) {
        window.location.href = value; // This will navigate to the selected page
      }
    },
    generateAwbPDF: function generateAwbPDF() {
      var awbNo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.form.awb_no;
      var awbCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.form.awb_code;
      var awb_code = this.form.awb_code; // Access the awb_code from the form data
      var awb_no = this.form.awb_no;
      var itemId = String(awb_code) + String(awb_no); // Access the awb_no from the form data
      var pdfUrl = "/download-consolidation-pdf/".concat(String(awb_code), "/").concat(String(awb_no)); // Construct the URL for the PDF
      window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    },
    referTOEditAwb: function referTOEditAwb() {
      // Navigating to another route using Vue Router
      // this.$router.push({ name: 'YourPage' });  // Replace 'YourPage' with the name of your route
    },
    mouseover: function mouseover() {
      this.isOpen = true;
    },
    mouseleave: function mouseleave() {
      this.isOpen = false;
    },
    manifest_send: function manifest_send() {
      // $('#manifest-send-btn').text('Wait...');
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get("/user/manifest-send/".concat(this.form.awb_code).concat(this.form.awb_no)).then(function (response) {
        console.log(response);
      });
    },
    showModal: function showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal: function hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleModal: function toggleModal() {
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    handleOk: function handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
    },
    // location
    getLocation: function getLocation() {
      var _this = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get("/user/get-location").then(function (_ref) {
        var data = _ref.data;
        _this.location = data;
      });
    },
    onSubmit: function onSubmit(evt) {
      evt.preventDefault();
      // this.form.put(`/update-consolidation`).then(response => {
      //     console.log(response);
      // })
    },
    getHousewayBills: function getHousewayBills(status) {
      var _this2 = this;
      this.isFetching = true;
      this.data_items = [];
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get("/user/get-houseway-bills/".concat(status)).then(function (response) {
        _this2.data_items = response.data;
      })["catch"](function (error) {
        console.error("Failed to fetch items:", error);
      })["finally"](function () {
        _this2.isFetching = false;
      });
    },
    allHousewayBill: function allHousewayBill() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get('/user/get-master-awbs-with-housewaybills').then(function (response) {
        _this3.data_items = response.data;
      })["catch"](function (error) {
        console.error("Failed to fetch master AWBs with house waybills:", error);
        _this3.data_items = [];
      });
    },
    allConsolidation: function allConsolidation() {
      // ApiService.get(`/all-consolidation`).then(({ data }) => {
      //     this.consolidation =  data;
      // });
    },
    searchWayBills: function searchWayBills() {
      var _this4 = this;
      this.searchPerformed = true;
      this.form.post('/user/search-house-way-bills', {
        awb_no: this.form.awb_no,
        awb_code: this.form.awb_code
      }).then(function (response) {
        if (response.data && response.data.length) {
          var id = "".concat(String(_this4.form.awb_code)).concat(String(_this4.form.awb_no));
          _this4.getAirWayBill(id);
          _this4.consolidation = response.data;
          _this4.hasSearchResults = true;
        } else {
          _this4.consolidation = [];
          _this4.hasSearchResults = false;
        }
      })["catch"](function (error) {
        console.error('Error fetching data:', error);
        _this4.consolidation = [];
        _this4.hasSearchResults = false;
      });
    },
    getAirWayBill: function getAirWayBill(id) {
      var _this5 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        if (response.data && response.data.id == id) {
          _this5.existingData = response.data;
        }
      })["catch"](function (error) {
        _this5.existingData = null;
        console.error("Failed to fetch data for updating:", error);
      });
    },
    updateform: function updateform(id) {
      this.form.put("/user/update-consolidation/".concat(this.form.id)).then(function (response) {
        // Waybill updated successfully
      })["catch"](function (error) {
        console.error("Error updating waybill:", error);
      });
    },
    updateHouseWayBill: function updateHouseWayBill() {
      var _this6 = this;
      if (!this.form.id) {
        this.$bvToast.toast('Please select a house waybill to update', {
          title: 'Warning',
          variant: 'warning',
          solid: true,
          autoHideDelay: 3000
        });
        return;
      }

      // Prepare the data for update
      var updateData = {
        awb_code: this.form.awb_code,
        awb_no: this.form.awb_no,
        master_origin: this.form.master_origin,
        master_destination: this.form.master_destination,
        pieces: this.form.pieces,
        gross_weight: this.form.gross_weight,
        description: this.form.description,
        special_handling_info: JSON.stringify(this.form.tableCodes),
        other_service_information: this.form.other_service_information,
        oci_entries: this.form.oci_entries,
        status: 'draft'
      };
      this.form.put("/user/update-consolidation/".concat(this.form.id), updateData).then(function (response) {
        _this6.$bvToast.toast('House waybill updated successfully', {
          title: 'Success',
          variant: 'success',
          solid: true,
          autoHideDelay: 3000
        });
        // Refresh the consolidation data
        _this6.searchWayBills();
        // Clear the form
        _this6.clearForm();
      })["catch"](function (error) {
        console.error("Error updating house waybill:", error);
        _this6.$bvToast.toast('Error updating house waybill. Please try again.', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000
        });
      });
    },
    cancelUpdate: function cancelUpdate() {
      this.clearForm();
    },
    addDetailsRow: function addDetailsRow() {
      // This method can be used to add a new house waybill row
      // For now, it will clear the form to allow adding new data
      this.clearForm();
    },
    clearForm: function clearForm() {
      this.form.id = '';
      this.form.master_origin = '';
      this.form.master_destination = '';
      this.form.description = '';
      this.form.gross_weight = '';
      this.form.pieces = '';
      this.form.special_handling_info = '';
      this.form.other_service_information = '';
      this.form.tableCodes = [];
      this.form.oci_entries = [];
      this.editIndex = null;
    },
    editConsolidation: function editConsolidation(id) {
      var item = this.consolidation.find(function (waybill) {
        return waybill.id === id;
      });
      if (item) {
        this.form.id = String(item.id);
        this.form.master_origin = item.master_origin;
        this.form.master_destination = item.master_destination;
        this.form.description = item.description;
        this.form.pieces = item.pieces;
        this.form.gross_weight = item.gross_weight;
        this.form.other_service_information = item.other_service_information;
        this.form.oci_entries = item.custom_info || [];
        if (item.special_handling_info && typeof item.special_handling_info === 'string') {
          try {
            this.form.tableCodes = JSON.parse(item.special_handling_info);
          } catch (error) {
            console.error("Error parsing special_handling_info:", error);
            this.form.tableCodes = [];
          }
        } else {
          this.form.tableCodes = [];
        }
        // Scroll to the form section for better UX
        this.$nextTick(function () {
          var formElement = document.querySelector('.custom-nav');
          if (formElement) {
            formElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        });
      } else {
        console.warn("Item not found for ID:", id);
        this.$bvToast.toast('House waybill not found', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          autoHideDelay: 3000
        });
      }
    },
    deleteConsolidation: function deleteConsolidation(index) {
      this.form.tableCodes.splice(index, 1);
    },
    getCountry: function getCountry() {
      var _this7 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get('/user/get-country').then(function (_ref2) {
        var data = _ref2.data;
        _this7.countries = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {
        console.error("Error fetching countries:", error);
      });
    },
    getAgent: function getAgent() {
      var _this8 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get("/user/agent-info/").then(function (_ref3) {
        var data = _ref3.data;
        if (Array.isArray(data) && data.length > 0) {
          _this8.agent_information = data[0];
          _this8.iata_cass = {
            iata_agent_code: _this8.agent_information.iata_agent_code || null,
            iata_agent_cass: _this8.agent_information.iata_agent_cass || null
          };
        } else {
          _this8.agent_information = data;
        }
      })["catch"](function (error) {
        console.error("Error fetching agent information:", error);
      });
    },
    getOCIData: function getOCIData() {
      var _this9 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get('/user/get-oci-data').then(function (_ref4) {
        var data = _ref4.data;
        if (data && data.oci_custom_info_identifier) {
          _this9.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
              key = _ref6[0],
              value = _ref6[1];
            return {
              value: key,
              text: value
            };
          });
        } else {
          _this9.oci_data.oci_custom_info_identifier = [];
        }
        if (data && data.identifiers) {
          _this9.oci_identifiers.identifiers = Object.entries(data.identifiers).map(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
              key = _ref8[0],
              value = _ref8[1];
            return {
              value: key,
              text: value
            };
          });
        }
      })["catch"](function (error) {
        console.error("Error fetching countries:", error);
        _this9.oci_data.oci_custom_info_identifier = [];
      });
    },
    getHouseWayBill: function getHouseWayBill(id) {
      var _this0 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_3__["default"].get("/user/houseway-bill/".concat(id)).then(function (response) {
        _this0.existingData = response.data;
        _this0.openForm('update', String(_this0.existingData.id));
        if (_this0.existingData && _this0.existingData.consignment_data) {
          _this0.isConsignmentAdded = true;
        }
      })["catch"](function (error) {
        console.error("Failed to fetch data for updating:", error);
      });
    },
    handleRadioChange: function handleRadioChange() {
      var selectedCode = this.selectedCode;
      this.form.tableCodes = [];
      this.form.tableCodes.push(selectedCode);
    },
    addManualCode: function addManualCode() {
      if (!Array.isArray(this.form.tableCodes)) {
        this.form.tableCodes = [];
      }
      var code = this.selectedCode || this.custom_special_handling_code.trim();
      if (code) {
        if (!this.form.tableCodes.includes(code)) {
          this.form.tableCodes.push(code);
        } else {
          alert('This code is already added.');
        }
      }
      this.selectedCode = '';
      this.custom_special_handling_code = '';
    },
    deleteSplCode: function deleteSplCode(index) {
      this.form.tableCodes.splice(index, 1);
    },
    getOriginCode: function getOriginCode(airportString) {
      if (airportString) {
        return airportString.split(',')[0];
      }
      return '';
    },
    getDestinationCode: function getDestinationCode(airportString) {
      if (airportString) {
        return airportString.split(',')[0];
      }
      return '';
    },
    editOciInfo: function editOciInfo(index) {
      this.editIndex = index;
      this.oci_info = _objectSpread({}, this.form.oci_entries[index]);
    },
    addOtherCustomInfo: function addOtherCustomInfo() {
      if (!this.oci_info.info_identifier || !this.oci_info.supplementary_info) {
        alert('Please fill in all fields');
        return;
      }
      if (!this.oci_info.info_identifier) {}
      if (this.editIndex !== null) {
        this.form.oci_entries[this.editIndex] = _objectSpread({}, this.oci_info);
        this.editIndex = null;
      } else {
        this.form.oci_entries.push(_objectSpread({}, this.oci_info));
      }
      for (var key in this.oci_info) {
        if (this.oci_info.hasOwnProperty(key)) {
          this.oci_info[key] = '';
        }
      }
    },
    deleteOciInfo: function deleteOciInfo(index) {
      // this.oci_entries.splice(index, 1);
      if (this.form.oci_entries.length > index) {
        this.form.oci_entries.splice(index, 1);
      }
    },
    toggleDropdown_departure: function toggleDropdown_departure() {
      this.isDropdownOpen_departure = !this.isDropdownOpen_departure;
    },
    selectOption_departure: function selectOption_departure(item) {
      this.form.master_origin = item.iata_code;
      var source_name = item.destination;
      var final_set = "".concat(item.iata_code, ", ").concat(source_name);
      // this.searchQuery_to = final_set;
      this.form.master_origin.departure_airport = final_set;
      this.isDropdownOpen_departure = false;
    },
    toggleDropdown_destination: function toggleDropdown_destination() {
      this.isDropdownOpen_destination = !this.isDropdownOpen_destination;
    },
    selectOption_destination: function selectOption_destination(item) {
      this.form.master_destination = item.iata_code;
      var source_name = item.destination;
      var final_set = "".concat(item.iata_code, ", ").concat(source_name);
      // this.searchQuery_to = final_set;
      this.form.master_destination = final_set;
      this.isDropdownOpen_destination = false;
    },
    closeDropdown_departure: function closeDropdown_departure(event) {
      var dropdownContainer_to = this.$refs.dropdownContainer_departure;
      if (dropdownContainer_to && !dropdownContainer_to.contains(event.target)) {
        this.isDropdownOpen_destination = false;
      }
    },
    closeDropdown_destination: function closeDropdown_destination(event) {
      var dropdownContainer_des = this.$refs.dropdownContainer_destination;
      if (dropdownContainer_des && !dropdownContainer_des.contains(event.target)) {
        this.isDropdownOpen_departure = false;
      }
    },
    validateNumericInput: function validateNumericInput(evt, field, maxLength) {
      evt = evt || window.event;
      var charCode = evt.which || evt.keyCode;
      if (charCode < 48 || charCode > 57) {
        evt.preventDefault();
      }
      if (this.form[field].length >= maxLength) {
        evt.preventDefault();
      }
    },
    formatDate: function formatDate(dateString) {
      if (!dateString) return 'N/A';
      var date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getCurrentUser: function getCurrentUser() {
      // You can get this from your auth store or API
      // For now, returning a placeholder
      return 'Current User';
    },
    selectAndSearchAwb: function selectAndSearchAwb(item) {
      // Fill the search fields with the selected AWB data
      this.form.awb_code = String(item.awb_code);
      this.form.awb_no = String(item.awb_no);

      // Close the modal
      this.$bvModal.hide('modal-s');

      // Perform the search automatically
      this.searchWayBills();

      // Show a toast notification
      this.$bvToast.toast("Searching for AWB ".concat(item.awb_code, "-").concat(item.awb_no), {
        title: 'Search Initiated',
        variant: 'info',
        solid: true,
        autoHideDelay: 2000
      });
    }
  },
  mounted: function mounted() {
    this.getLocation();
    this.getCountry();
    this.getOCIData();
    // this.allConsolidation();
    this.allHousewayBill();
    this.location = [];
    window.addEventListener('click', this.closeDropdown_destination);
    window.addEventListener('click', this.closeDropdown_departure);
  },
  watch: _defineProperty({
    '$route.params.id': function $routeParamsId(newId) {
      if (newId) {
        this.getAirWayBill(newId);
      }
    }
  }, "$route.params.id", function $routeParamsId(newId) {
    if (newId) {
      this.getHouseWayBill(newId);
    }
  }),
  created: function created() {
    var id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.getAirWayBill(id);
    }
    if (id) {
      this.isEdit = true;
      this.getHouseWayBill(id);
    }
    this.getOCIData();
  },
  computed: {
    filteredLocations_destination: function filteredLocations_destination() {
      var query = this.form.master_destination.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query) || item.destination.toLowerCase().includes(query);
      });
    },
    filteredLocations_departure: function filteredLocations_departure() {
      var query = this.form.master_origin.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query) || item.destination.toLowerCase().includes(query);
      });
    }
  },
  components: {
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    SideBar: _layout_SideBar_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("nav", {
    staticClass: "sidebar-container"
  }, [_c("div", {
    staticClass: "sidebar d-none d-md-block"
  }, [_c("ul", {
    staticClass: "sidebar__list"
  }, [_c("router-link", {
    attrs: {
      to: "/focus-air",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref) {
        var navigate = _ref.navigate;
        return [_c("li", {
          staticClass: "sidebar__item",
          "class": {
            "sidebar__item--active": _vm.isActive(["/focus-air", "/house-way-bill", "/consolidation", "/edit-airway-bill", "/edit-houseway-bill"])
          },
          attrs: {
            role: "link",
            title: "Focus Air"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "sidebar__icon-wrap"
        }, [_c("img", {
          attrs: {
            src: _vm.isActive(["/focus-air", "/house-way-bill", "/consolidation", "/edit-airway-bill", "/edit-houseway-bill"]) ? "/media/custome/side-menu/3-active.png" : "/media/custome/side-menu/3.png",
            alt: "Air Freight"
          }
        })])])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/message-log",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref2) {
        var navigate = _ref2.navigate;
        return [_c("li", {
          staticClass: "sidebar__item",
          "class": {
            "sidebar__item--active": _vm.isActive("/message-log")
          },
          attrs: {
            role: "link",
            title: "Message Log"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "sidebar__icon-wrap"
        }, [_c("img", {
          attrs: {
            src: _vm.isActive("/message-log") ? "/media/custome/side-menu/4-active.png" : "/media/custome/side-menu/4.png",
            alt: "Message Log"
          }
        })])])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/rate",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref3) {
        var navigate = _ref3.navigate;
        return [_c("li", {
          staticClass: "sidebar__item",
          "class": {
            "sidebar__item--active": _vm.isActive("/rate")
          },
          attrs: {
            role: "link",
            title: "Rate"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "sidebar__icon-wrap"
        }, [_c("img", {
          attrs: {
            src: _vm.isActive("/rate") ? "/media/custome/side-menu/5-active.png" : "/media/custome/side-menu/5.png",
            alt: "Rate"
          }
        })])])];
      }
    }])
  }), _vm._v(" "), _vm._m(0)], 1)]), _vm._v(" "), _c("div", {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.closeMobileMenu,
      expression: "closeMobileMenu"
    }],
    staticClass: "sidebar-mobile d-md-none"
  }, [_c("div", {
    staticClass: "mobile-nav-trigger",
    on: {
      click: _vm.toggleMobileMenu
    }
  }, [_c("img", {
    staticClass: "mobile-active-icon",
    attrs: {
      src: _vm.activeItem.icon
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "mobile-active-label"
  }, [_vm._v(_vm._s(_vm.activeItem.label))]), _vm._v(" "), _c("b-icon", {
    staticClass: "ml-auto",
    attrs: {
      icon: _vm.isMobileMenuOpen ? "chevron-up" : "chevron-down"
    }
  })], 1), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade-slide"
    }
  }, [_vm.isMobileMenuOpen ? _c("div", {
    staticClass: "mobile-nav-options"
  }, _vm._l(_vm.menuItems, function (item) {
    return _c("div", {
      key: item.label,
      staticClass: "mobile-opt",
      "class": {
        active: _vm.isActive(item.activePaths)
      },
      on: {
        click: function click($event) {
          return _vm.navigateMobile(item.path);
        }
      }
    }, [_c("img", {
      staticClass: "opt-icon",
      attrs: {
        src: _vm.isActive(item.activePaths) ? item.activeIcon : item.icon
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "opt-label"
    }, [_vm._v(_vm._s(item.label))])]);
  }), 0) : _vm._e()])], 1)]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("li", {
    staticClass: "sidebar__branding"
  }, [_c("span", {
    staticClass: "sidebar__branding-text"
  }, [_vm._v("FOCUS AIR")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true ***!
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
    staticClass: "body-color"
  }, [_c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "d-flex"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
    staticClass: "container",
    staticStyle: {
      "background-color": "#fff",
      "box-shadow": "3px 3px 10px #d0d0d0",
      "z-index": "1",
      "border-radius": "30px"
    }
  }, [_c("b-row", {
    staticClass: "mt-14 mb-8 px-10"
  }, [_c("b-col", {
    attrs: {
      cols: "6"
    }
  }, [_c("h6", {
    staticStyle: {
      color: "#355594",
      "font-size": "22px",
      "line-height": "30px",
      "font-weight": "600"
    }
  }, [_vm._v("Documentation")]), _vm._v(" "), _c("b-form-group", {
    staticClass: "d-flex align-items-center",
    attrs: {
      id: "fieldset-horizontal"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control-sm",
    staticStyle: {
      width: "180px",
      border: "0px !important",
      color: "#355594",
      "font-weight": "600"
    },
    on: {
      change: _vm.onSelect
    },
    model: {
      value: _vm.selectedViewPageOption,
      callback: function callback($$v) {
        _vm.selectedViewPageOption = $$v;
      },
      expression: "selectedViewPageOption"
    }
  }, [_c("option", {
    attrs: {
      value: "/focus-air"
    }
  }, [_vm._v("Master Airway Bill")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "/house-way-bill"
    }
  }, [_vm._v("Houseway Bill")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "/consolidation"
    }
  }, [_vm._v("Consolidation")])])], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "6"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-end",
    staticStyle: {
      "margin-top": "42px !important"
    }
  }, [_c("b-button", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.modal-s",
      modifiers: {
        "modal-s": true
      }
    }],
    staticClass: "ml-2 mr-10",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    attrs: {
      id: "show-btn"
    }
  }, [_vm._v("10 Latest")])], 1)]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "modal-draft",
      title: "Drafts",
      "hide-footer": true,
      "ok-only": ""
    }
  }, [_c("div", {
    staticClass: "d-block"
  }, [_c("b-row", {
    staticClass: "mt-5"
  }, [_c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("a", {
    staticClass: "custom-link",
    attrs: {
      href: ""
    }
  }, [_vm._v("none")]), _vm._v(" "), _c("h6", [_vm._v("( - )")])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("a", {
    staticClass: "custom-link",
    attrs: {
      href: ""
    }
  }, [_vm._v("Edit e-AWB Data")]), _vm._v(" "), _c("a", {
    staticClass: "custom-link",
    attrs: {
      href: ""
    }
  }, [_vm._v("Create House Waybill from e-AWB Data")]), _vm._v(" "), _c("h6", [_vm._v("By: jgeorgeblr@gln.com at: 13 Jul 15:03")])])], 1)], 1)]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "modal-s",
      title: "Latest Messages",
      "hide-footer": true,
      "ok-only": ""
    }
  }, [_c("div", {
    staticClass: "d-block"
  }, [_vm.isFetching ? _c("div", {
    staticClass: "text-center py-20"
  }, [_c("b-spinner", {
    staticStyle: {
      width: "3rem",
      height: "3rem"
    },
    attrs: {
      label: "Fetching messages...",
      variant: "primary"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "mt-4 text-muted font-weight-bold"
  }, [_vm._v("Fetching latest messages...")])], 1) : _c("b-row", {
    staticClass: "mt-5"
  }, [_c("b-col", [_vm.data_items && _vm.data_items.length > 0 ? _c("div", _vm._l(_vm.data_items, function (item) {
    return _c("div", {
      key: item.id
    }, [_c("div", {
      staticClass: "py-2"
    }, [_c("p", {
      staticClass: "awbcodetitle mb-3",
      staticStyle: {
        cursor: "pointer"
      },
      on: {
        click: function click($event) {
          return _vm.selectAndSearchAwb(item);
        }
      }
    }, [_vm._v("\n                                                    " + _vm._s(String(item.awb_code)) + "-" + _vm._s(String(item.awb_no)) + " \n                                                    (" + _vm._s(item.departure_airport ? item.departure_airport.split(",")[0] : "N/A") + "-" + _vm._s(item.destination_airport ? item.destination_airport.split(",")[0] : "N/A") + ")\n                                                ")]), _vm._v(" "), _c("a", {
      staticClass: "custom-link mb-0",
      attrs: {
        href: "#"
      },
      on: {
        click: function click($event) {
          _vm.getHouseWayBill(String(item.id));
        }
      }
    }, [_c("router-link", {
      attrs: {
        to: "/edit-airway-bill/" + String(item.id),
        custom: ""
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(_ref) {
          var navigate = _ref.navigate,
            href = _ref.href;
          return [_c("p", {
            staticClass: "mb-0 ml-2"
          }, [_c("a", {
            staticClass: "custom-link",
            attrs: {
              href: "/download-consolidation-pdf/" + String(item.awb_code) + "/" + String(item.awb_no),
              target: "_blank"
            }
          }, [_vm._v("Consolidation Pdf file")])])];
        }
      }], null, true)
    })], 1), _vm._v(" "), _c("a", {
      staticClass: "custom-link mb-0",
      attrs: {
        href: "#"
      },
      on: {
        click: function click($event) {
          _vm.getHouseWayBill(String(item.id));
        }
      }
    }, [_c("router-link", {
      attrs: {
        to: "/edit-airway-bill/" + String(item.id),
        custom: ""
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(_ref2) {
          var navigate = _ref2.navigate,
            href = _ref2.href;
          return [_c("p", {
            staticClass: "mb-0 ml-2"
          }, [_c("a", {
            staticClass: "custom-link",
            attrs: {
              href: "/download-multiple-consolidation-pdf/" + String(item.id),
              target: "_blank"
            }
          }, [_vm._v("Multipage Consolidation Pdf file")])])];
        }
      }], null, true)
    })], 1), _vm._v(" "), _c("p", {
      staticClass: "mt-5 mb-0",
      staticStyle: {
        "border-bottom": "1px solid #cdcdcd"
      }
    }, [_vm._v("\n                                                    Issued at: " + _vm._s(_vm.formatDate(item.updated_at)) + " By: " + _vm._s(_vm.getCurrentUser()) + "\n                                                ")])])]);
  }), 0) : _c("div", {
    staticClass: "text-center py-4"
  }, [_c("p", {
    staticClass: "text-muted"
  }, [_vm._v("No master AWBs with house waybills found.")])])])], 1)], 1)])], 1), _vm._v(" "), _c("hr", {
    staticClass: "hr"
  }), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "align-items-center"
  }, [_c("h6", {
    staticClass: "h-color ml-4 mb-0"
  }, [_vm._v("\n                                " + _vm._s(_vm.form.id ? "Edit House Waybill Details" : "Create Electronic Consolidation (FHL)") + "\n                            ")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex ml-4 mt-7"
  }, [_c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("span", {}, [_vm._v("Master no:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": {
      "is-invalid": _vm.form.errors.has("awb_code")
    },
    staticStyle: {
      width: "62px"
    },
    attrs: {
      id: "input-horizontal"
    },
    on: {
      keypress: function keypress($event) {
        return _vm.validateNumericInput($event, "awb_code", 3);
      }
    },
    model: {
      value: _vm.form.awb_code,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "awb_code", $$v);
      },
      expression: "form.awb_code"
    }
  })], 1), _vm._v(" "), _c("span", {
    staticClass: "d-flex align-items-center pl-3"
  }, [_vm._v("-")]), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-horizontal"
    }
  }, [_c("b-form-input", {
    staticClass: "form-control",
    "class": {
      "is-invalid": _vm.form.errors.has("awb_no")
    },
    staticStyle: {
      width: "150px"
    },
    attrs: {
      id: "input-horizontal"
    },
    on: {
      keypress: function keypress($event) {
        return _vm.validateNumericInput($event, "awb_no", 8);
      }
    },
    model: {
      value: _vm.form.awb_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "awb_no", $$v);
      },
      expression: "form.awb_no"
    }
  })], 1), _vm._v(" "), _c("b-button", {
    staticClass: "ml-4",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    on: {
      click: _vm.searchWayBills
    }
  }, [_vm._v("Search")])], 1), _vm._v(" "), _c("has-error", {
    "class": {
      "d-block": _vm.form.errors.has("awb_code")
    },
    attrs: {
      form: _vm.form,
      field: "awb_code"
    }
  }), _vm._v(" "), _c("has-error", {
    "class": {
      "d-block": _vm.form.errors.has("awb_no")
    },
    attrs: {
      form: _vm.form,
      field: "awb_no"
    }
  })], 1)], 1), _vm._v(" "), _vm.hasSearchResults ? _c("div", [_c("hr", {
    staticClass: "hr"
  }), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-start py-2"
  }, [_vm.existingData ? _c("table", {
    staticStyle: {
      width: "100%"
    }
  }, [_c("thead", [_c("tr", {
    staticStyle: {
      "background-color": "#F2F9FF"
    }
  }, [_c("th", {
    staticStyle: {
      width: "60px !important"
    }
  }, [_vm._v("Action")]), _vm._v(" "), _c("th", {}, [_vm._v("Air Waybill Number")]), _vm._v(" "), _c("th", {}, [_vm._v("Master Origin")]), _vm._v(" "), _c("th", {}, [_vm._v("Master Destination")]), _vm._v(" "), _c("th", {}, [_vm._v("Air Waybill Quantity")]), _vm._v(" "), _c("th", {}), _vm._v(" "), _c("th", {}), _vm._v(" "), _c("th", {}), _vm._v(" "), _c("th", {})])]), _vm._v(" "), _c("tbody", [_c("tr", [_c("td", {}, [_c("a", {
    staticClass: "custom-link",
    attrs: {
      href: "/edit-airway-bill/" + String(_vm.existingData.id)
    },
    on: {
      click: function click($event) {
        _vm.getAirWayBill(String(_vm.existingData.id));
      }
    }
  }, [_c("router-link", {
    attrs: {
      to: "/edit-airway-bill/" + String(_vm.existingData.id),
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref3) {
        var navigate = _ref3.navigate,
          href = _ref3.href;
        return [_c("b-button", {
          staticStyle: {
            background: "#A4D3EE"
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "pencil",
            "font-scale": "1"
          }
        })], 1)];
      }
    }], null, false, 1069267099)
  })], 1)]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                " + _vm._s(String(_vm.existingData.awb_code)) + "-" + _vm._s(String(_vm.existingData.awb_no)) + "\n                                            ")]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                " + _vm._s(_vm.existingData.departure_airport) + "\n                                            ")]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                " + _vm._s(_vm.existingData.destination_airport) + "\n                                            ")]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                T/" + _vm._s(_vm.existingData.consignment_data ? _vm.existingData.consignment_data.pieces : "N/A") + "/" + _vm._s(_vm.existingData.consignment_data ? _vm.existingData.consignment_data.weight_code : "N/A") + "/" + _vm._s(_vm.existingData.consignment_data ? _vm.existingData.consignment_data.gross_weight : "N/A") + "/\n                                            ")])])])]) : _vm._e()])])], 1), _vm._v(" "), _c("hr", {
    staticClass: "hr"
  }), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "py-5"
  }, [_c("b-tabs", {
    staticClass: "custom-nav",
    attrs: {
      "content-class": "mt-3"
    }
  }, [_c("b-tab", {
    attrs: {
      title: "House Waybill Details"
    }
  }, [_c("div", {
    staticClass: "ml-3 mt-8"
  }, [_c("div", {
    staticClass: "py-7"
  }, [_c("b-row", [_c("b-col", {
    attrs: {
      cols: "4"
    }
  }, [_c("b-form-group", {
    staticStyle: {
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-hwb",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-hwb"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("HWB No:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 455423582)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "240px"
    },
    attrs: {
      id: "input-hwb",
      disabled: ""
    },
    model: {
      value: _vm.form.id,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "id", $$v);
      },
      expression: "form.id"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "4"
    }
  }, [_c("b-form-group", {
    staticStyle: {
      width: "140px",
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-destination",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-destination"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Origin:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 2902117782)
  }, [_vm._v(" "), _c("div", {
    ref: "dropdownContainer_departure",
    staticClass: "custom-dropdown",
    on: {
      click: _vm.toggleDropdown_departure
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.master_origin,
      expression: "form.master_origin"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Search Origin",
      id: "departure",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.form.master_origin
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "master_origin", $event.target.value);
      }
    }
  }), _vm._v(" "), _vm.isDropdownOpen_departure && _vm.filteredLocations_departure.length ? _c("div", {
    staticClass: "dropdown-options"
  }, _vm._l(_vm.filteredLocations_departure, function (item, index) {
    return _c("div", {
      key: index,
      staticClass: "option",
      on: {
        click: function click($event) {
          $event.stopPropagation();
          return _vm.selectOption_departure(item);
        }
      }
    }, [_vm._v("\n                                                                        " + _vm._s(item.iata_code) + " (" + _vm._s(item.destination) + ")\n                                                                    ")]);
  }), 0) : _vm._e()])])], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "4"
    }
  }, [_c("b-form-group", {
    staticStyle: {
      width: "140px",
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-destination",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-destination"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Destination:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 126435966)
  }, [_vm._v(" "), _c("div", {
    ref: "dropdownContainer_destination",
    staticClass: "custom-dropdown",
    on: {
      click: _vm.toggleDropdown_destination
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.form.master_destination,
      expression: "form.master_destination"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Search destination",
      id: "destination",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.form.master_destination
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.form, "master_destination", $event.target.value);
      }
    }
  }), _vm._v(" "), _vm.isDropdownOpen_destination && _vm.filteredLocations_destination.length ? _c("div", {
    staticClass: "dropdown-options"
  }, _vm._l(_vm.filteredLocations_destination, function (item, index) {
    return _c("div", {
      key: index,
      staticClass: "option",
      on: {
        click: function click($event) {
          $event.stopPropagation();
          return _vm.selectOption_destination(item);
        }
      }
    }, [_vm._v("\n                                                                        " + _vm._s(item.iata_code) + " (" + _vm._s(item.destination) + ")\n                                                                    ")]);
  }), 0) : _vm._e()])])], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "4"
    }
  }, [_c("b-form-group", {
    staticStyle: {
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-hwb",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-hwb"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Pieces:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 1508117803)
  }, [_vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "65px"
    },
    attrs: {
      id: "input-hwb"
    },
    model: {
      value: _vm.form.pieces,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "pieces", $$v);
      },
      expression: "form.pieces"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "px-4"
  }, [_vm._v("of")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "65px"
    },
    attrs: {
      id: "input-origin"
    },
    model: {
      value: _vm.form.pieces,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "pieces", $$v);
      },
      expression: "form.pieces"
    }
  })], 1)])], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "4"
    }
  }, [_c("b-form-group", {
    staticStyle: {
      width: "140px",
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-destination",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-destination"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Weight:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 1714158946)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      id: "input-destination"
    },
    model: {
      value: _vm.form.gross_weight,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "gross_weight", $$v);
      },
      expression: "form.gross_weight"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "4"
    }
  }, [_c("div", {
    staticClass: "d-flex"
  }, [_c("b-form-group", {
    staticStyle: {
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-destination",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-destination"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Volume:")])])];
      },
      proxy: true
    }], null, false, 1487785878)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "100px"
    },
    attrs: {
      id: "input-destination"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticStyle: {
      "padding-left": "0px !important"
    },
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-horizontal"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control",
    staticStyle: {
      width: "70px"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("cm3")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "CC"
    }
  }, [_vm._v("m3")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "CC"
    }
  }, [_vm._v("ft3")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "CC"
    }
  }, [_vm._v("in3")])])], 1)], 1)])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("b-form-group", {
    staticStyle: {
      "margin-bottom": "7px !important"
    },
    attrs: {
      id: "fieldset-hwb",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-hwb"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Nature of Goods:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 2567505954)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "320px"
    },
    attrs: {
      id: "input-hwb"
    },
    model: {
      value: _vm.form.description,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "description", $$v);
      },
      expression: "form.description"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("b-form-group", {
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      label: "Handling Codes:",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end",
          staticStyle: {
            width: "120px"
          }
        }, [_c("span", [_vm._v("Handling Codes:")])])];
      },
      proxy: true
    }], null, false, 1333459279)
  }, [_vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-form-select", {
    staticClass: "form-control",
    staticStyle: {
      width: "320px"
    },
    model: {
      value: _vm.selectedCode,
      callback: function callback($$v) {
        _vm.selectedCode = $$v;
      },
      expression: "selectedCode"
    }
  }, [_c("option", {
    attrs: {
      disabled: "",
      value: ""
    }
  }, [_vm._v("Select Special Handling Codes")]), _vm._v(" "), _vm._l(_vm.codes, function (code) {
    return _c("option", {
      key: code.value,
      domProps: {
        value: code.value
      }
    }, [_vm._v(_vm._s(code.text))]);
  }), _vm._v(" "), _c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select Special Handling Codes")])], 2), _vm._v(" "), _c("span", {
    staticClass: "px-4"
  }, [_vm._v("Or:")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "100px"
    },
    attrs: {
      id: "input-origin"
    },
    model: {
      value: _vm.custom_special_handling_code,
      callback: function callback($$v) {
        _vm.custom_special_handling_code = $$v;
      },
      expression: "custom_special_handling_code"
    }
  })], 1)])], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("b-button", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.modal-s",
      modifiers: {
        "modal-s": true
      }
    }],
    staticClass: "ml-2 mr-10",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    attrs: {
      id: "show-btn"
    },
    on: {
      click: function click($event) {
        return _vm.getHousewayBills("send");
      }
    }
  }, [_vm._v("10 Latest")]), _vm._v(" "), _c("b-button", {
    staticClass: "ml-4",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    on: {
      click: _vm.addManualCode
    }
  }, [_vm._v("Add")])], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mt-4",
    attrs: {
      cols: "auto"
    }
  }, [_c("table", [_c("thead", [_c("tr", {
    staticStyle: {
      "background-color": "#F2F9FF"
    }
  }, [_c("th", {
    staticStyle: {
      width: "400px",
      "font-size": "12px",
      "font-weight": "400",
      padding: "4px 0px 4px 6px"
    }
  }, [_vm._v("Other Customs Information")]), _vm._v(" "), _c("th", {
    staticStyle: {
      width: "50px"
    }
  }, [_vm._v(" ")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.form.tableCodes, function (code, index) {
    return _c("tr", {
      key: index
    }, [_c("td", {}, [_vm._v(_vm._s(code))]), _vm._v(" "), _c("td", {}, [_c("b-icon", {
      attrs: {
        icon: "trash",
        "font-scale": "1"
      },
      on: {
        click: function click($event) {
          return _vm.deleteSplCode(index);
        }
      }
    })], 1)]);
  }), 0)])])], 1)], 1)])]), _vm._v(" "), _c("b-tab", {
    attrs: {
      title: "Other Customs Information"
    }
  }, [_c("div", {
    staticClass: "ml-3 mt-8"
  }, [_c("div", {
    staticClass: "py-7"
  }, [_c("b-row", [_c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("table", [_c("thead", [_c("tr", {
    staticStyle: {
      "background-color": "#F2F9FF",
      "margin-bottom": "10px"
    }
  }, [_c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      padding: "4px 0px 4px 6px"
    }
  }, [_vm._v("Country code:")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400"
    }
  }, [_vm._v("Information identifier:")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400"
    }
  }, [_vm._v("Customs information identifier")])])]), _vm._v(" "), _c("tbody", [_c("tr", [_c("td", {
    staticStyle: {
      padding: "12px 20px 0px 0px"
    }
  }, [_c("b-form-group", {
    attrs: {
      id: "fieldset-horizontal"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control",
    staticStyle: {
      width: "200px"
    },
    model: {
      value: _vm.oci_info.country_code,
      callback: function callback($$v) {
        _vm.$set(_vm.oci_info, "country_code", $$v);
      },
      expression: "oci_info.country_code"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select a country")]), _vm._v(" "), _vm._l(_vm.countries, function (country) {
    return _c("option", {
      key: country.value,
      domProps: {
        value: country.value
      }
    }, [_vm._v("\n                                                                                    " + _vm._s(country.text) + "\n                                                                                ")]);
  })], 2)], 1)], 1), _vm._v(" "), _c("td", {
    staticClass: "editable-cell py-4"
  }, [_c("b-form-group", {
    staticClass: "form-control-sm col-form-label",
    staticStyle: {
      width: "240px"
    },
    attrs: {
      id: "fieldset-horizontal"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control-sm",
    "class": {
      "is-invalid": _vm.form.errors.has("info_identifier")
    },
    model: {
      value: _vm.oci_info.info_identifier,
      callback: function callback($$v) {
        _vm.$set(_vm.oci_info, "info_identifier", $$v);
      },
      expression: "oci_info.info_identifier"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select a code")]), _vm._v(" "), _vm._l(_vm.oci_identifiers.identifiers, function (oci_option) {
    return _c("option", {
      key: oci_option.value,
      domProps: {
        value: oci_option.value
      }
    }, [_vm._v("\n                                                                                    " + _vm._s(oci_option.text) + "\n                                                                                ")]);
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: "info_identifier"
    }
  })], 2)], 1)], 1), _vm._v(" "), _c("td", {
    staticClass: "editable-cell py-4"
  }, [_c("b-form-group", {
    staticClass: "form-control-sm col-form-label",
    staticStyle: {
      width: "240px"
    },
    attrs: {
      id: "fieldset-horizontal"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control-sm",
    "class": {
      "is-invalid": _vm.form.errors.has("custom_info_identifier")
    },
    model: {
      value: _vm.oci_info.custom_info_identifier,
      callback: function callback($$v) {
        _vm.$set(_vm.oci_info, "custom_info_identifier", $$v);
      },
      expression: "oci_info.custom_info_identifier"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("Select a code")]), _vm._v(" "), _vm._l(_vm.oci_data.oci_custom_info_identifier, function (oci_options) {
    return _c("option", {
      key: oci_options.value,
      domProps: {
        value: oci_options.value
      }
    }, [_vm._v("\n                                                                                    " + _vm._s(oci_options.text) + "\n                                                                                ")]);
  })], 2), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: "custom_info_identifier"
    }
  })], 1)], 1)])])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center pt-4"
  }, [_c("div", [_c("b-form-group", {
    staticClass: "d-flex align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("span", {
          staticClass: "d-flex justify-content-center",
          staticStyle: {
            width: "210px"
          }
        }, [_vm._v("Supplementary information:")])];
      },
      proxy: true
    }], null, false, 1384796813)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "350px"
    },
    attrs: {
      id: "input-origin"
    },
    model: {
      value: _vm.oci_info.supplementary_info,
      callback: function callback($$v) {
        _vm.$set(_vm.oci_info, "supplementary_info", $$v);
      },
      expression: "oci_info.supplementary_info"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end",
    staticStyle: {
      width: "100%"
    }
  }, [_c("b-button", {
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    on: {
      click: _vm.addOtherCustomInfo
    }
  }, [_vm._v(_vm._s(_vm.editIndex !== null ? "Update" : "Add"))])], 1)])])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mt-4",
    attrs: {
      cols: "auto"
    }
  }, [_c("table", [_c("thead", [_c("tr", {
    staticStyle: {
      "background-color": "#F2F9FF"
    }
  }, [_c("th", {
    staticStyle: {
      width: "240px",
      "font-size": "12px",
      "font-weight": "400",
      padding: "4px 0px 4px 6px"
    }
  }, [_vm._v("Other Customs Information")]), _vm._v(" "), _c("th", {
    staticStyle: {
      width: "180px"
    }
  }, [_vm._v(" ")]), _vm._v(" "), _c("th", {
    staticStyle: {
      width: "180px"
    }
  }, [_vm._v(" ")]), _vm._v(" "), _c("th", {
    staticStyle: {
      width: "180px"
    }
  }, [_vm._v(" ")]), _vm._v(" "), _c("th", {
    staticStyle: {
      width: "60px"
    }
  }, [_vm._v(" ")])])]), _vm._v(" "), _c("tbody", _vm._l(_vm.form.oci_entries, function (row, index) {
    return _c("tr", {
      key: index
    }, [_c("td", [_c("p", {
      staticClass: "pl-2"
    }, [_vm._v(_vm._s(row.country_code))])]), _vm._v(" "), _c("td", [_c("p", [_vm._v(_vm._s(row.info_identifier))])]), _vm._v(" "), _c("td", [_c("p", [_vm._v(_vm._s(row.custom_info_identifier))])]), _vm._v(" "), _c("td", [_c("p", [_vm._v(_vm._s(row.supplementary_info))])]), _vm._v(" "), _c("td", [row.country_code && row.info_identifier && row.custom_info_identifier && row.supplementary_info ? _c("p", [_c("b-icon", {
      staticClass: "mr-2",
      staticStyle: {
        cursor: "pointer"
      },
      attrs: {
        icon: "pencil",
        "font-scale": "1"
      },
      on: {
        click: function click($event) {
          return _vm.editOciInfo(index);
        }
      }
    }), _vm._v(" "), _c("b-icon", {
      attrs: {
        icon: "trash",
        "font-scale": "1"
      },
      on: {
        click: function click($event) {
          return _vm.deleteOciInfo(index);
        }
      }
    })], 1) : _vm._e()])]);
  }), 0)])])], 1)], 1)])])], 1)], 1)])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-end align-items-center mr-16 pb-5"
  }, [_c("p", {
    staticClass: "mb-0 ml-4 mr-4 h-color",
    staticStyle: {
      "border-bottom": "1px solid #2637a8",
      cursor: "pointer"
    },
    on: {
      click: _vm.cancelUpdate
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("p", {
    staticClass: "mb-0 ml-4 mr-4 h-color",
    staticStyle: {
      "border-bottom": "1px solid #2637a8",
      cursor: "pointer"
    },
    on: {
      click: _vm.updateHouseWayBill
    }
  }, [_vm._v("Update")]), _vm._v(" "), _c("p", {
    staticClass: "mb-0 ml-4 mr-4 h-color",
    staticStyle: {
      "border-bottom": "1px solid #2637a8",
      cursor: "pointer"
    },
    on: {
      click: _vm.addDetailsRow
    }
  }, [_vm._v("Add details row")])])])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "py-6"
  }, [_c("table", [_c("tr", {
    staticStyle: {
      "background-color": "#F2F9FF"
    }
  }, [_c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      width: "70px",
      padding: "4px 0px 4px 10px"
    }
  }, [_vm._v("Action")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      width: "200px"
    }
  }, [_vm._v("House waybill No")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      width: "200px"
    }
  }, [_vm._v("Origin")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      width: "200px"
    }
  }, [_vm._v("Destination")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      width: "200px"
    }
  }, [_vm._v("Quantity")]), _vm._v(" "), _c("th", {
    staticStyle: {
      "font-size": "12px",
      "font-weight": "400",
      width: "407px"
    }
  }, [_vm._v("Nature of Goods")])])])]), _vm._v(" "), _vm.consolidation && _vm.consolidation.length > 0 ? [_c("RecycleScroller", {
    staticClass: "scroller",
    staticStyle: {
      "max-height": "500px"
    },
    attrs: {
      items: _vm.consolidation,
      "item-size": 50,
      "key-field": "id"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref4) {
        var item = _ref4.item;
        return [_c("div", {
          staticClass: "d-flex border-bottom",
          staticStyle: {
            "background-color": "#E6EBFF",
            height: "50px",
            "align-items": "center"
          }
        }, [_c("div", {
          staticClass: "d-flex justify-content-center",
          staticStyle: {
            width: "70px",
            background: "#A4D3EE",
            height: "100%",
            "align-items": "center"
          }
        }, [_c("div", [_c("b-icon", {
          staticStyle: {
            cursor: "pointer"
          },
          attrs: {
            icon: "pencil",
            "font-scale": "1"
          },
          on: {
            click: function click($event) {
              return _vm.editConsolidation(item.id);
            }
          }
        }), _vm._v("\n                                                 \n                                                "), _c("b-icon", {
          staticStyle: {
            cursor: "pointer"
          },
          attrs: {
            icon: "trash",
            "font-scale": "1"
          },
          on: {
            click: function click($event) {
              return _vm.deleteConsolidation(item.id);
            }
          }
        })], 1)]), _vm._v(" "), _c("div", {
          staticClass: "pl-2",
          staticStyle: {
            width: "200px"
          }
        }, [_vm._v("\n                                            " + _vm._s(item.id) + "\n                                        ")]), _vm._v(" "), _c("div", {
          staticStyle: {
            width: "200px"
          }
        }, [_vm._v("\n                                            " + _vm._s(item.master_origin) + "\n                                        ")]), _vm._v(" "), _c("div", {
          staticStyle: {
            width: "200px"
          }
        }, [_vm._v("\n                                            " + _vm._s(item.master_destination) + "\n                                        ")]), _vm._v(" "), _c("div", {
          staticStyle: {
            width: "200px"
          }
        }, [_vm._v("\n                                            T/" + _vm._s(item.pieces) + "/K/" + _vm._s(item.gross_weight) + " \n                                        ")]), _vm._v(" "), _c("div", {
          staticStyle: {
            width: "407px"
          }
        }, [_vm._v("\n                                            " + _vm._s(item.description) + "\n                                        ")])])];
      }
    }], null, false, 136518864)
  })] : _c("div", {
    staticClass: "d-flex justify-content-center text-muted mt-2"
  }, [_c("p", [_vm._v("No house waybills found for this master AWB.")])])], 2)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-end align-items-center mr-16 py-8"
  }, [_c("b-button", {
    staticClass: "mr-2",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    on: {
      click: _vm.generateAwbPDF
    }
  }, [_vm._v("Generate PDF")]), _vm._v(" "), _c("b-button", {
    staticClass: "mr-2",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "#ffffff !important"
    },
    attrs: {
      id: "manifest-send-btn"
    },
    on: {
      click: function click($event) {
        return _vm.manifest_send();
      }
    }
  }, [_vm._v("Send")])], 1)])], 1)], 1) : _vm.searchPerformed && !_vm.hasSearchResults ? _c("div", {
    staticClass: "d-flex flex-column align-items-start pt-2 pb-2"
  }, [_c("p", {
    staticClass: "text-danger mt-5"
  }, [_vm._v("No house waybills found for this master AWB.")])]) : _vm._e()], 1)], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n/* ── Container ─────────────────────────────────────────── */\n.sidebar[data-v-eeb70fb0] {\n    width: 5%;\n    min-width: 80px;\n    height: 80vh;\n    margin-right: 30px;\n    flex-shrink: 0;\n    position: sticky;\n    top: 0;\n    z-index: 100;\n}\n.sidebar__list[data-v-eeb70fb0] {\n    list-style: none;\n    margin: 0;\n    padding: 20px 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(255, 255, 255, 0.7);\n    backdrop-filter: blur(16px) brightness(1.05);\n    -webkit-backdrop-filter: blur(16px) brightness(1.05);\n    border: 1px solid rgba(255, 255, 255, 0.8);\n    border-radius: 32px;\n    box-shadow: 0 8px 32px rgba(53, 85, 148, 0.08);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 16px;\n    overflow: hidden;\n    box-sizing: border-box;\n}\n.sidebar__item[data-v-eeb70fb0] {\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 4px 0;\n    cursor: pointer;\n}\n.sidebar__icon-wrap[data-v-eeb70fb0] {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    transition: transform 0.2s ease;\n}\n.sidebar__icon-wrap img[data-v-eeb70fb0] {\n    width: 32px;\n    height: 32px;\n    display: block;\n    -o-object-fit: contain;\n       object-fit: contain;\n}\n.sidebar__branding[data-v-eeb70fb0] {\n    margin-top: auto;\n    display: flex;\n    justify-content: center;\n    padding: 24px 0 20px;\n}\n.sidebar__branding-text[data-v-eeb70fb0] {\n    writing-mode: vertical-rl;\n    transform: rotate(180deg);\n    font-family: 'Inter', sans-serif;\n    font-weight: 900;\n    letter-spacing: -0.02em;\n    font-size: 18px;\n    color: #355594;\n    white-space: nowrap;\n    opacity: 0.9;\n}\n\n/* ── Mobile Dropdown Styles ───────────────────────────── */\n.sidebar-mobile[data-v-eeb70fb0] {\n    width: 100%;\n    margin-bottom: 20px;\n    position: relative;\n    z-index: 1001;\n}\n.mobile-nav-trigger[data-v-eeb70fb0] {\n    display: flex;\n    align-items: center;\n    background: rgba(255, 255, 255, 0.85);\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(53, 85, 148, 0.2);\n    border-radius: 20px;\n    height: 60px;\n    padding: 0 20px;\n    cursor: pointer;\n    box-shadow: 0 8px 32px rgba(53, 85, 148, 0.1);\n}\n.mobile-active-icon[data-v-eeb70fb0] {\n    width: 28px;\n    height: 28px;\n    margin-right: 12px;\n}\n.mobile-active-label[data-v-eeb70fb0] {\n    color: #355594;\n    font-weight: 700;\n    font-size: 16px;\n    margin-right: 20px;\n}\n.mobile-nav-options[data-v-eeb70fb0] {\n    position: absolute;\n    top: calc(100% + 12px);\n    left: 0;\n    right: 0;\n    background: rgba(255, 255, 255, 0.95);\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(255, 255, 255, 0.8);\n    border-radius: 24px;\n    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);\n    overflow: hidden;\n    padding: 10px;\n}\n.mobile-opt[data-v-eeb70fb0] {\n    display: flex;\n    align-items: center;\n    padding: 14px 16px;\n    border-radius: 16px;\n    transition: all 0.2s ease;\n    cursor: pointer;\n    margin-bottom: 4px;\n}\n.mobile-opt[data-v-eeb70fb0]:last-child {\n    margin-bottom: 0;\n}\n.opt-icon[data-v-eeb70fb0] {\n    width: 24px;\n    height: 24px;\n    margin-right: 14px;\n}\n.opt-label[data-v-eeb70fb0] {\n    color: #475569;\n    font-weight: 600;\n    font-size: 15px;\n}\n.mobile-opt[data-v-eeb70fb0]:hover {\n    background: rgba(53, 85, 148, 0.05);\n}\n.mobile-opt.active[data-v-eeb70fb0] {\n    background: rgba(53, 85, 148, 0.1);\n}\n.mobile-opt.active .opt-label[data-v-eeb70fb0] {\n    color: #355594;\n}\n\n/* Transitions */\n.fade-slide-enter-active[data-v-eeb70fb0], .fade-slide-leave-active[data-v-eeb70fb0] {\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.fade-slide-enter[data-v-eeb70fb0], .fade-slide-leave-to[data-v-eeb70fb0] {\n    opacity: 0;\n    transform: translateY(-15px);\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.form-row[data-v-16e4f4e0] {\n    flex-wrap: nowrap !important;\n}\nheader[data-v-16e4f4e0] {\n    width: 100%;\n    background-color: #2637a8;\n}\n.h-color[data-v-16e4f4e0] {\n    color: #355594;\n}\n.h_background_color[data-v-16e4f4e0] {\n    background-color: #2637a8;\n    color: white;\n}\n#nav[data-v-16e4f4e0] {\n    display: flex;\n    /* align-items: center;\n    justify-content: center; */\n    width: 100%;\n    max-width: 1280px;\n    /* margin: 0 auto; */\n}\n#nav>ul[data-v-16e4f4e0] {\n    display: flex;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n#nav>ul>li[data-v-16e4f4e0]:hover {\n    background-color: gray;\n}\n#nav>ul>li>span[data-v-16e4f4e0]:after {\n    display: inline-block;\n}\n#nav>ul>li>a[data-v-16e4f4e0] {\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n}\n#nav>ul>li>span[data-v-16e4f4e0] {\n    position: relative;\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n    cursor: pointer;\n}\nli[data-v-16e4f4e0] {\n    border-right: 1px solid white;\n}\n#nav>ul>li>span[data-v-16e4f4e0]:after {\n    /* content: '▼'; */\n    display: inline-block;\n}\n.dropdown[data-v-16e4f4e0] {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    display: none;\n    padding: 0;\n    list-style-type: none;\n    background-color: gray;\n}\n.dropdown li[data-v-16e4f4e0] {\n    /* width: 250px; */\n    width: 150px;\n    border-bottom: 1px solid #fff;\n}\n.dropdown li a[data-v-16e4f4e0] {\n    display: block;\n    /* padding: 10px; */\n    padding-left: 5px;\n    color: #fff;\n    text-decoration: none;\n}\n.isOpen[data-v-16e4f4e0] {\n    display: block;\n}\n.custom-btn[data-v-16e4f4e0] {\n    transition: background-color 0.3s;\n}\n\n/* #show-btn:hover {\n  background-color: #007bff;\n} */\n.custom-btn[data-v-16e4f4e0]:hover {\n    background-color: #007bff !important;\n    color: white !important;\n}\n.form-group[data-v-16e4f4e0] {\n    margin-bottom: 0px !important;\n}\n.col-form-label[data-v-16e4f4e0] {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n    margin-bottom: 0 !important;\n    font-size: inherit !important;\n    line-height: 1.5 !important;\n}\n.background-color[data-v-16e4f4e0] {\n    background-color: grey;\n}\n.hr[data-v-16e4f4e0] {\n    border-top: 2px solid #CDCDCD;\n}\n.aselect[data-v-16e4f4e0] {\n    position: relative;\n    width: 200px;\n    /* Adjust the width as needed */\n}\n.selector.box[data-v-16e4f4e0] {\n    position: relative;\n}\n.custom-select[data-v-16e4f4e0] {\n        appearance: none;\n        -webkit-appearance: none;\n        -moz-appearance: none;\n        background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"34\" viewBox=\"0 0 24 24\"><path fill=\"black\" d=\"M7 10l5 5 5-5z\"/></svg>') no-repeat right center;\n        background-color: white;\n        font-size: 14px;\n        cursor: pointer;\n        width: 100%;\n}\n.custom-select[data-v-16e4f4e0]:focus {\n        outline: none;\n        border-color: #5cb3fd;\n}\n.nav-tabs .nav-links[data-v-16e4f4e0] {\n    border: 2px solid black;\n}\n.table[data-v-16e4f4e0] {\n    max-width: 400px;\n    border: 0;\n}\ntd.editable-cell1[data-v-16e4f4e0] {\n    border: 1 solid gray !important;\n}\ntd.editable-cell[data-v-16e4f4e0] {\n    border: 0 !important;\n}\nth[data-v-16e4f4e0] {\n    border: 0 !important;\n}\n.form-control[data-v-16e4f4e0] {\n    border: 1px solid #A6A6A6;\n    height: 38px !important;\n    border-radius: 7px !important;\n}\n.form-control1[data-v-16e4f4e0] {\n    border: 2px solid gray;\n    width: 150px;\n    height: 25px;\n}\n.custom-link[data-v-16e4f4e0] {\n    display: block;\n    margin-bottom: 0.5rem;\n    color: #4C4C4C;\n    text-decoration: none;\n}\n.custom-link[data-v-16e4f4e0]:hover {\n    /* color: #2637a8; */\n    -webkit-text-decoration: underline #4C4C4C !important;\n            text-decoration: underline #4C4C4C !important;\n    text-decoration-color: #4C4C4C;\n}\n.custom-link-custom[data-v-16e4f4e0] {\n    display: block;\n    margin-bottom: 0.5rem;\n    color:#355594;\n    text-decoration: none;\n}\n.custom-link-custom[data-v-16e4f4e0]:hover {\n    /* color: #2637a8; */\n    -webkit-text-decoration: underline #355594 !important;\n            text-decoration: underline #355594 !important;\n    text-decoration-color: #355594;\n}\n.column_b[data-v-16e4f4e0] {\n    border: 1px solid #b1b1b1;\n}\n.custom-dropdown[data-v-16e4f4e0] {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  /* border: solid 1px silver; */\n  border-radius: 5px;\n}\n.dropdown-options[data-v-16e4f4e0] {\n  /* position: absolute; */\n  top: 100%;\n  left: 0;\n  width: 100%;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-top: none;\n  max-height: 200px;\n  overflow-y: auto;\n  z-index: 1;\n}\n.option[data-v-16e4f4e0] {\n  padding: 5px 10px;\n  cursor: pointer;\n}\n.option[data-v-16e4f4e0]:hover {\n  background-color: #f0f0f0;\n}\n.custom-label-styling label[data-v-16e4f4e0] {\n    font-size: 1rem;\n    font-weight: 400;\n    color: #3F4254;\n    width: 180px;\n}\n.custom-label-styling-two label[data-v-16e4f4e0] {\n    font-size: 1rem;\n    font-weight: 400;\n    color: #3F4254;\n    width: 100px;\n}\n.hwb-details input[data-v-16e4f4e0], .hwb-details select[data-v-16e4f4e0] {\n    border-radius: 0px !important;\n}\n.hwb-details button[data-v-16e4f4e0] {\n    padding: 4px 12px;\n    border: 1px solid #000;\n    border-radius: 4px;\n}\n.custom-dropdown[data-v-16e4f4e0] {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  /* border: solid 1px silver; */\n  border-radius: 5px;\n}\n.dropdown-options[data-v-16e4f4e0] {\n  /* position: absolute; */\n  top: 100%;\n  left: 0;\n  width: 100%;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-top: none;\n  max-height: 200px;\n  overflow-y: auto;\n  z-index: 1;\n}\n.option[data-v-16e4f4e0] {\n  padding: 5px 10px;\n  cursor: pointer;\n}\n.option[data-v-16e4f4e0]:hover {\n  background-color: #f0f0f0;\n}\n.awbcodetitle[data-v-16e4f4e0] {\n    color: #355594;\n    transition: color 0.3s ease;\n}\n.awbcodetitle[data-v-16e4f4e0]:hover {\n    color: #2637a8;\n    text-decoration: underline;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.modal-content {\n    border-radius: 20px !important;\n    padding: 0rem 2rem 2rem !important;\n}\n.modal-header {\n    padding: 1rem 0rem !important;\n    border-bottom: 1px solid #CDCDCD !important;\n}\n.modal .modal-header .modal-title {\n    color: #355594 !important;\n}\n.modal-header > .close {\n    font-size: 2rem !important;\n}\n.modal .modal-header .close:hover {\n    color: #355594 !important;\n}\n.custom-nav .nav-tabs {\n    border-bottom: 0px !important;\n}\n.custom-nav .nav-link {\n    color: #355594 !important;\n    font-weight: 400 !important;\n    font-size: 12px !important;\n    border: none !important;\n    padding: 0px !important;\n    margin: 0px 10px !important;\n}\n.custom-nav .nav-link:hover,\n.custom-nav .nav-link.active {\n    border-bottom: 2px solid #355594 !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_0_id_16e4f4e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_0_id_16e4f4e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_0_id_16e4f4e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_1_id_16e4f4e0_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_1_id_16e4f4e0_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_1_id_16e4f4e0_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue":
/*!**************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true */ "./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true");
/* harmony import */ var _SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SideBar.vue?vue&type=script&lang=js */ "./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js");
/* harmony import */ var _SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css */ "./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "eeb70fb0",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layout/SideBar.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/Consolidation.vue":
/*!*******************************************************!*\
  !*** ./resources/js/src/view/pages/Consolidation.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Consolidation_vue_vue_type_template_id_16e4f4e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true */ "./resources/js/src/view/pages/Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true");
/* harmony import */ var _Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Consolidation.vue?vue&type=script&lang=js");
/* harmony import */ var _Consolidation_vue_vue_type_style_index_0_id_16e4f4e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css */ "./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css");
/* harmony import */ var _Consolidation_vue_vue_type_style_index_1_id_16e4f4e0_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css */ "./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Consolidation_vue_vue_type_template_id_16e4f4e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Consolidation_vue_vue_type_template_id_16e4f4e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "16e4f4e0",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/Consolidation.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/Consolidation.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/src/view/pages/Consolidation.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true":
/*!*************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_template_id_16e4f4e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_template_id_16e4f4e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_template_id_16e4f4e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=template&id=16e4f4e0&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_0_id_16e4f4e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=0&id=16e4f4e0&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_1_id_16e4f4e0_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Consolidation.vue?vue&type=style&index=1&id=16e4f4e0&lang=css");


/***/ })

}]);