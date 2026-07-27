"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_FocusAir_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_services_location_cache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/core/services/location.cache */ "./resources/js/src/core/services/location.cache.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/view/components/OcrUploadModal.vue */ "./resources/js/src/view/components/OcrUploadModal.vue");
/* harmony import */ var _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/view/components/DashboardHistoryModal.vue */ "./resources/js/src/view/components/DashboardHistoryModal.vue");
/* harmony import */ var _core_mixins_airWayBillMixin__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/core/mixins/airWayBillMixin */ "./resources/js/src/core/mixins/airWayBillMixin.js");
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










// import PageLoader from "../../components/PageLoader.vue";

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusAir",
  mixins: [_core_mixins_airWayBillMixin__WEBPACK_IMPORTED_MODULE_9__["default"]],
  data: function data() {
    return {
      form: new Form({
        awb_email: '',
        first_box: {
          awb_code: '',
          awb_no: '',
          consolidated_mawb: false,
          awb: true
        },
        shipper_address: {
          ship_name: '',
          ship_name_2: '',
          ship_account: '',
          ship_address: '',
          ship_address_line_2: '',
          ship_city: '',
          ship_post_code: '',
          ship_state: '',
          ship_country: '',
          ship_phone: '',
          ship_fax: '',
          ship_telex: '',
          ship_new_address: '',
          ship_airport_code: null
        },
        consignee_address: {
          cons_name: '',
          cons_name_2: '',
          cons_account: '',
          cons_address: '',
          cons_address_line_2: '',
          cons_city: '',
          cons_airport_code: null,
          cons_post_code: '',
          cons_state: '',
          cons_country: '',
          cons_phone: '',
          cons_fax: '',
          cons_telex: '',
          cons_new_address: ''
        },
        also_notify_address: {
          also_name: '',
          also_name_2: '',
          also_address: '',
          also_address_line_2: '',
          also_city: '',
          also_airport_code: null,
          also_post_code: '',
          also_state: '',
          also_country: '',
          also_phone: '',
          also_fax: '',
          also_telex: '',
          also_new_address: ''
        },
        routing_information: {
          departure_airport: '',
          destination_airport: '',
          from: '',
          to: '',
          to_2: '',
          to_3: '',
          by: '',
          by_2: '',
          by_3: '',
          flight: '',
          flight_2: '',
          flight_3: '',
          date: this.getCurrentDate(),
          date_2: this.getCurrentDate(),
          date_3: this.getCurrentDate()
        },
        entries: [],
        oci_entries: [],
        tableCodes: [],
        charges: [],
        shipper_name: '',
        totals: {
          total_volume: null,
          total_amount: 0,
          dimention_unit: "MTQ"
        },
        custom_origin: {
          customs_origin_code: null,
          other_service_information: '',
          special_service_request: '',
          accounting_information: '',
          letter_credit: '',
          shipment_ref_no: null,
          supplementary_shipment_info: '',
          supplementary_shipment_info_line_2: '',
          extra_print: null
        },
        carr_namr: '',
        carr_prefix: '',
        carr_address: '',
        carr_city: '',
        carr_post_code: '',
        carr_state: '',
        carr_country: '',
        payment_info: {
          type_of_payment: '',
          currency: 'INR',
          // declear_value_carriage: '',
          // declear_value_customs: '',
          // declear_value_insurance: '',
          declear_value_carriage: 'NVD',
          declear_value_insurance: 'XXX',
          declear_value_customs: 'NCV',
          // other_charges_due_carrier: '',
          // other_charges_due_agent: '',
          taxes: null,
          weight_charge: null,
          total_charges_prepaid: null,
          total_charges_collect: null,
          total_charges: null,
          other_charges_due_agent_prepaid: null,
          other_charges_due_agent_collect: null,
          other_charges_due_carrier_prepaid: null,
          other_charges_due_carrier_collect: null
        },
        is_consignee_address_save: false,
        is_shipper_address_save: false,
        is_also_notify_address_save: false,
        is_iata_login_later: false,
        status: '',
        as_agreed: 0
      }),
      consignmentUrl: '/user/get-consignment-error',
      iata_cass: {
        iata_agent_code: null,
        iata_agent_cass: null
      },
      agent_information: {
        agent_name: '',
        agent_address: '',
        agent_city: '',
        agent_pincode: '',
        agent_issue_sign: '',
        agent_issue_loc_code: '',
        agent_issue_date: '',
        agent_account: null,
        //Participate Sender Reference
        participate: '0',
        participate_airport: '',
        prticipant_identifer: '',
        participant_code: null,
        office_file_reference: '',
        //Office Sender Reference
        office_airport: null,
        office_function_designator: null,
        office_company_designator: null
      },
      status: '',
      as_agreed: 0,
      defaultPaymentInfo: {
        declear_value_carriage: 'NVD',
        declear_value_customs: 'NCV',
        declear_value_insurance: 'XXX',
        currency: 'INR'
      },
      selectedViewPageOption: '/focus-air',
      selectedShipper: null,
      selectedConsignee: null,
      selectAlsoNotify: null,
      shippers: [],
      consignees: [],
      alsoNotify: [],
      searchQuery_to: '',
      selectedCode: '',
      custom_special_handling_code: '',
      manualCode: '',
      location: [],
      newHsCode: '',
      isOpen: false,
      showShipper: false,
      showConsignee: false,
      showCalculationTable: false,
      generatePDFAfterSave: '',
      countries: [],
      oci_data: {},
      ///get-oci-data
      oci_identifiers: {},
      other_charges_code: [],
      existingData: {},
      data_items: [],
      isFetching: false,
      use_my_email: false,
      mode: 'add',
      awbDetails: false,
      awbError: null,
      awbId: null,
      filteredShippers: [],
      filteredConsignees: [],
      filteredAlsoNotify: [],
      awb_prefix_message: '',
      showAWBSection: false,
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
        text: 'RFG - Flammable Gas'
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
      options: [{
        text: "Me",
        value: "1"
      }, {
        text: "Participant Group",
        value: "1"
      }],
      logoSrc: "/media/assets/logos/logo-1.png",
      main_error_msg: "",
      pdf_error_msg: '',
      is_generate_pdf: 0,
      showSpinner: false,
      selectedCompanyForUpload: null
    };
  },
  methods: {
    handleUseMyEmailChange: function handleUseMyEmailChange(checked) {
      if (checked) {
        this.form.awb_email = localStorage.getItem('fna_default_email') || '';
      } else {
        this.form.awb_email = '';
      }
    },
    handleAwbEmailInput: function handleAwbEmailInput(val) {
      if (val) {
        localStorage.setItem('fna_default_email', val);
      }
    },
    processExtractedData: function processExtractedData(response) {
      var _response$transit,
        _this = this;
      // Reset the form and UI states to clear any previously populated data
      this.form.reset();
      this.showShipper = false;
      this.showConsignee = false;
      this.isConsignmentAdded = false;

      // Injected existing extraction pipeline
      console.log('Processing received payload:', response);
      var awb_number = response.awb_number ? response.awb_number.split("-") : ['', ''];
      this.form.first_box.awb_code = awb_number[0] || '';
      this.form.first_box.awb_no = awb_number[1] || '';

      // Routing
      var departure = response.departure;
      var destination = response.destination;
      var transit = (_response$transit = response.transit) === null || _response$transit === void 0 ? void 0 : _response$transit[0];

      // Departure + destination are populated independently of transit
      if (departure && destination) {
        var _transit$transit_airp, _transit$transit_airp2, _transit$transit_airp3;
        var all_airport_short_code = [departure, destination, transit === null || transit === void 0 || (_transit$transit_airp = transit.transit_airports) === null || _transit$transit_airp === void 0 ? void 0 : _transit$transit_airp[0], transit === null || transit === void 0 || (_transit$transit_airp2 = transit.transit_airports) === null || _transit$transit_airp2 === void 0 ? void 0 : _transit$transit_airp2[1], transit === null || transit === void 0 || (_transit$transit_airp3 = transit.transit_airports) === null || _transit$transit_airp3 === void 0 ? void 0 : _transit$transit_airp3[2]];
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].post("/user/get-airport-by-airport-code", {
          "airport_code": all_airport_short_code
        }).then(function (response2) {
          var _response2$data;
          response2 = (_response2$data = response2.data) === null || _response2$data === void 0 ? void 0 : _response2$data.data;
          _this.form.routing_information.departure_airport = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          _this.form.routing_information.destination_airport = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
          _this.form.routing_information.from = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          // Transit hops only filled when transit data is present
          if (transit) {
            _this.form.routing_information.to = "".concat(response2[2] ? response2[2]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[2] ? response2[2]['destination'] : response2[1]['destination']);
            if (transit.transit_airports[1]) {
              _this.form.routing_information.to_2 = "".concat(response2[3] ? response2[3]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[3] ? response2[3]['destination'] : response2[1]['destination']);
            }
            if (transit.transit_airports[2]) {
              _this.form.routing_information.to_3 = "".concat(response2[4] ? response2[4]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[4] ? response2[4]['destination'] : response2[1]['destination']);
            }
          }
        });
        // Flight numbers and dates only when transit is available
        if (transit) {
          if (transit.flights[0]) {
            var _transit$flights$, _transit$flights$2;
            this.form.routing_information.by = (_transit$flights$ = transit.flights[0]) === null || _transit$flights$ === void 0 || (_transit$flights$ = _transit$flights$.flight_number) === null || _transit$flights$ === void 0 ? void 0 : _transit$flights$.slice(0, 2);
            this.form.routing_information.flight = (_transit$flights$2 = transit.flights[0]) === null || _transit$flights$2 === void 0 || (_transit$flights$2 = _transit$flights$2.flight_number) === null || _transit$flights$2 === void 0 ? void 0 : _transit$flights$2.slice(2);
            this.form.routing_information.date = this.formatDate(transit.flights[0].date);
          }
          if (transit.flights[1]) {
            var _transit$flights$3, _transit$flights$4;
            this.form.routing_information.by_2 = (_transit$flights$3 = transit.flights[1]) === null || _transit$flights$3 === void 0 || (_transit$flights$3 = _transit$flights$3.flight_number) === null || _transit$flights$3 === void 0 ? void 0 : _transit$flights$3.slice(0, 2);
            this.form.routing_information.flight_2 = (_transit$flights$4 = transit.flights[1]) === null || _transit$flights$4 === void 0 || (_transit$flights$4 = _transit$flights$4.flight_number) === null || _transit$flights$4 === void 0 ? void 0 : _transit$flights$4.slice(2);
            this.form.routing_information.date_2 = this.formatDate(transit.flights[1].date);
          }
          if (transit.flights[2]) {
            var _transit$flights$5, _transit$flights$6;
            this.form.routing_information.by_3 = (_transit$flights$5 = transit.flights[2]) === null || _transit$flights$5 === void 0 || (_transit$flights$5 = _transit$flights$5.flight_number) === null || _transit$flights$5 === void 0 ? void 0 : _transit$flights$5.slice(0, 2);
            this.form.routing_information.flight_3 = (_transit$flights$6 = transit.flights[2]) === null || _transit$flights$6 === void 0 || (_transit$flights$6 = _transit$flights$6.flight_number) === null || _transit$flights$6 === void 0 ? void 0 : _transit$flights$6.slice(2);
            this.form.routing_information.date_3 = this.formatDate(transit.flights[2].date);
          }
        }
      }

      // Shipper details
      this.showShipper = true;
      var shipper = response.shipper;
      if (shipper) {
        var matchedShipper = this.findMatchingAddress(shipper, this.shippers);
        if (matchedShipper) {
          console.log('Auto-matched shipper (90%+ similarity):', matchedShipper.name);
          this.selectShipper(matchedShipper);
        } else {
          this.form.shipper_address.ship_name = shipper.name.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
          this.form.shipper_address.ship_address = shipper.address.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim();
          this.form.shipper_address.ship_city = shipper.city;
          this.form.shipper_address.ship_post_code = shipper.pin;
          this.form.shipper_address.ship_state = shipper.state;
          if (shipper.country) {
            this.form.shipper_address.ship_country = this.countryCodeByName(shipper.country);
          }
          this.form.shipper_address.ship_phone = shipper.phone;
          this.form.shipper_address.ship_fax = shipper.email;
        }
      }

      // Consignee details
      this.showConsignee = true;
      var consignee = response.consignee;
      if (consignee) {
        var matchedConsignee = this.findMatchingAddress(consignee, this.consignees);
        if (matchedConsignee) {
          console.log('Auto-matched consignee (90%+ similarity):', matchedConsignee.name);
          this.selectConsignee(matchedConsignee);
        } else {
          this.form.consignee_address.cons_name = consignee.name.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
          this.form.consignee_address.cons_name_2 = consignee.eori;
          this.form.consignee_address.cons_address = consignee.address.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim();
          this.form.consignee_address.cons_city = consignee.city;
          this.form.consignee_address.cons_post_code = consignee.pin;
          this.form.consignee_address.cons_state = consignee.state;
          if (consignee.country) {
            this.form.consignee_address.cons_country = this.countryCodeByName(consignee.country);
          }
          this.form.consignee_address.cons_phone = consignee.phone;
          this.form.consignee_address.cons_fax = consignee.email;
          if (consignee.eori) {
            this.oci_info.supplementary_info = consignee.eori;
            this.oci_info.custom_info_identifier = "CNE";
          }
        }
      }

      // Consignment Info
      var cargo_data = response.cargo;
      var piece_weight = response.piece_weight;
      var weight_charge = response.weight_charge;
      if (piece_weight) {
        // Safely slice the rate class — fall back to '' so the select shows "Select a Rate Class"
        var rate_class = piece_weight.rate_class ? piece_weight.rate_class.length > 2 ? piece_weight.rate_class.slice(2) : piece_weight.rate_class : '';
        this.consignment_list.rate_class = rate_class;
        this.consignment_list.pieces = piece_weight.no_of_pieces;
        this.consignment_list.rate = piece_weight.rate;
        this.consignment_list.gross_weight = piece_weight.gross_weight;
        this.consignment_list.chargable_weight = piece_weight.chargeable_weight;
      }
      if (cargo_data) {
        this.consignment_list.hsCodes = cargo_data.hs_codes;
        this.consignment_list.description = cargo_data.description.replace(/[&/=]/g, ' ').slice(0, 70).trim();
        if (cargo_data.dimensions) {
          for (var i = 0; i < cargo_data.dimensions.length; i++) {
            var _dimensions_data$, _dimensions_data$2, _dimensions_data$3;
            var dimensions_data = cargo_data.dimensions[i].dimension.split('X');
            this.consignment_list.itemss.push({
              pcs: cargo_data.dimensions[i].count,
              wgt: '',
              length: (_dimensions_data$ = dimensions_data[0]) !== null && _dimensions_data$ !== void 0 ? _dimensions_data$ : '',
              width: (_dimensions_data$2 = dimensions_data[1]) !== null && _dimensions_data$2 !== void 0 ? _dimensions_data$2 : '',
              height: (_dimensions_data$3 = dimensions_data[2]) !== null && _dimensions_data$3 !== void 0 ? _dimensions_data$3 : '',
              unit: 'CMT'
            });
          }
        }
      }
      this.$refs.modalConsignment.show();

      // Payment Remaining
      if (response.chrg_code) {
        this.form.payment_info.type_of_payment = response.chrg_code;
      }
    },
    inputLimit: function inputLimit(event, fieldPath, maxLength) {
      var allowedChars = /^[a-zA-Z0-9 ,\-_]+$/;
      var allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
      if (allowedKeys.includes(event.key)) {
        return;
      }
      var fields = fieldPath.split(".");
      var input = this.form;
      for (var i = 0; i < fields.length; i++) {
        if (input[fields[i]] === undefined) {
          return; // Stop if any level is undefined
        }
        if (i === fields.length - 1) {
          input = input[fields[i]];
        } else {
          input = input[fields[i]];
        }
      }
      if (typeof input !== "string") return;
      input = input.split('').filter(function (_char) {
        return allowedChars.test(_char);
      }).join('');

      // Prevent typing beyond maxLength
      if (input.length >= maxLength) {
        event.preventDefault();
      }
      var obj = this.form;
      for (var _i = 0; _i < fields.length - 1; _i++) {
        obj = obj[fields[_i]];
      }
      obj[fields[fields.length - 1]] = input.substring(0, maxLength);
    },
    isGeneratePdf: function isGeneratePdf(generateButton) {
      var _this2 = this;
      // alert("generateButton " + generateButton + "isGeneratePdf "+ this.is_generate_pdf);
      var errors = [];

      // Check first box
      if (!this.form.first_box.awb_code) errors.push('AWB Code');
      if (!this.form.first_box.awb_no) errors.push('AWB Number');

      // Check routing information
      if (!this.form.routing_information.departure_airport) errors.push('Departure Airport');
      if (!this.form.routing_information.destination_airport) errors.push('Destination Airport');
      if (!this.form.routing_information.from) errors.push('From Airport');

      // Check shipper details
      if (!this.form.shipper_address.ship_name) errors.push('Shipper Name');
      if (!this.form.shipper_address.ship_address) errors.push('Shipper Address');
      if (!this.form.shipper_address.ship_city) errors.push('Shipper City');

      // Check consignee details
      if (!this.form.consignee_address.cons_name) errors.push('Consignee Name');
      if (!this.form.consignee_address.cons_address) errors.push('Consignee Address');
      if (!this.form.consignee_address.cons_city) errors.push('Consignee City');

      // Check if there are any entries in the consignment
      if (this.form.entries.length === 0) {}
      if (errors.length > 0) {
        this.pdf_error_msg = "<br>- ".concat(errors.join('<br>- '));
        return;
      }

      // Clear error message if validation passes
      this.pdf_error_msg = '';
      this.is_generate_pdf = generateButton === 1;
      // Start the progress bar animation
      if (generateButton == 0 && this.is_generate_pdf == 1) {
        this.is_generate_pdf = 0;
      }
      if (generateButton == 1 && this.is_generate_pdf == 1) {
        this.showSpinner = true;
        this.is_generate_pdf = 0;
      }
      if (generateButton == 1 && this.is_generate_pdf == 0) {
        this.showSpinner = true;
      }
      setTimeout(function () {
        if (generateButton == 1 && _this2.is_generate_pdf == 1) {
          _this2.showSpinner = false;
          _this2.is_generate_pdf = 1;
        }
        if (generateButton == 1 && _this2.is_generate_pdf == 0) {
          _this2.showSpinner = false;
          _this2.is_generate_pdf = 1;
        }
      }, 2000);
    },
    // generateAwbPDF() {
    //     // const itemId = this.$route.params.id;
    //     const itemId =  this.existingData.id
    //     console.log("sdfnjbf",itemId);
    //     const pdfUrl = `/download-awb-pdf/${itemId}`; // Construct the URL for the PDF
    //     window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    // },
    // generateAwbPDF() {
    //     if (!this.validateFormFields()) {
    //         return;
    //     }
    //     const itemId = this.$route.params.id;
    //     console.log("dknfehjf", itemId);
    //     const pdfUrl = `/download-awb-pdf/${itemId}`;
    //     console.log("skfnjfer",pdfUrl);
    //     window.open(pdfUrl, '_blank');
    // },
    generateAwbPDF: function generateAwbPDF(pdf_generate_type) {
      this.generatePDFAfterSave = '';
      if (!this.existingData || !this.existingData.id) {
        // console.error('Existing data ID is missing. Cannot generate PDF.');
        return;
      }
      var pdfUrl = "/".concat(pdf_generate_type, "/").concat(this.existingData.id);
      window.open(pdfUrl, '_blank');
    },
    handleSaveAndGeneratePDF: function handleSaveAndGeneratePDF(pdf_generate_type) {
      // onSubmit() opens the PDF on a successful save (see generatePDFAfterSave).
      this.generatePDFAfterSave = pdf_generate_type;
      this.onSubmit();
    },
    formatBackendError: function formatBackendError(msg) {
      if (!msg) return "";
      var cleanMsg = msg.toLowerCase();

      // Map technical field names to clean names
      var mapping = {
        'awb no': 'AWB Number',
        'awb code': 'AWB Prefix',
        'cons name': 'Consignee Name',
        'cons address': 'Consignee Address',
        'cons city': 'Consignee City',
        'cons country': 'Consignee Country',
        'ship name': 'Shipper Name',
        'ship address': 'Shipper Address',
        'ship city': 'Shipper City',
        'ship country': 'Shipper Country',
        'by': 'Carrier Code',
        'dept airport': 'Departure Airport',
        'flight': 'Flight Number',
        'date': 'Flight Date'
      };

      // Apply technical name replacements
      Object.keys(mapping).forEach(function (key) {
        if (cleanMsg.includes(key)) {
          cleanMsg = cleanMsg.replace(key, mapping[key]);
        }
      });

      // Improve grammar and language
      cleanMsg = cleanMsg.replace(/^the /i, '').replace(/ field is required/i, ' is missing or empty').replace(/ field /i, ' ').trim();

      // Capitalize first letter
      return cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
    },
    validateFormFields: function validateFormFields() {
      var requiredFields = {
        "AWB prefix": this.form.first_box.awb_code,
        // AWB prefix
        "AWB number": this.form.first_box.awb_no,
        // AWB number
        "Shipper address": this.form.shipper_address.ship_address,
        // Shipper address
        "Shipper city": this.form.shipper_address.ship_address,
        // Shipper city
        "Consignee address": this.form.consignee_address.cons_address,
        // Consignee address
        "Consignee city": this.form.consignee_address.cons_city,
        // Consignee city
        "Routing by (carrier code) on row 1 is mandatory": this.form.routing_information.by // Routing by carrier code
      };
      var missingFields = Object.entries(requiredFields).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          field = _ref2[0],
          value = _ref2[1];
        return !value || typeof value === 'string' && value.trim() === '';
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
          field = _ref4[0];
        return field;
      });
      if (missingFields.length > 0) {
        alert("The following fields are mandatory:\n- ".concat(missingFields.join("\n- ")));
        return false;
      }
      return true;
    },
    mouseover: function mouseover() {
      this.isOpen = true;
    },
    mouseleave: function mouseleave() {
      this.isOpen = false;
    },
    converXml: function converXml(awb_no) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/waybill/".concat(awb_no)).then(function (_ref5) {
        var data = _ref5.data;
      } // console.log(data);
      );
    },
    // showModal() {
    //     this.$refs["my-modal"].show();
    // },
    // hideModal() {
    //     this.$refs["my-modal"].hide();
    // },
    toggleModal: function toggleModal() {
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    handleOk: function handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
    },
    handleDateChange: function handleDateChange(date, field) {
      var keys = field.split('.');
      var target = this;
      for (var i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = date;
    },
    // for remove
    prepareFormDataForSubmission: function prepareFormDataForSubmission() {
      var formData = _objectSpread({}, this.form);

      // Convert display dates back to proper format for backend
      if (formData.routing_information) {
        if (formData.routing_information.date) {
          if (typeof formData.routing_information.date === 'string' && formData.routing_information.date.length <= 10) {
            // If it's a formatted string like "02Sept", convert it back to proper date
            var date = new Date(formData.routing_information.date);
            if (!isNaN(date.getTime())) {
              formData.routing_information.date = date.toISOString().slice(0, 19).replace('T', ' ');
            }
          } else if (formData.routing_information.date instanceof Date) {
            // If it's already a Date object, format it
            formData.routing_information.date = formData.routing_information.date.toISOString().slice(0, 19).replace('T', ' ');
          }
        }
        if (formData.routing_information.date_2) {
          if (typeof formData.routing_information.date_2 === 'string' && formData.routing_information.date_2.length <= 10) {
            var _date = new Date(formData.routing_information.date_2);
            if (!isNaN(_date.getTime())) {
              formData.routing_information.date_2 = _date.toISOString().slice(0, 19).replace('T', ' ');
            }
          } else if (formData.routing_information.date_2 instanceof Date) {
            formData.routing_information.date_2 = formData.routing_information.date_2.toISOString().slice(0, 19).replace('T', ' ');
          }
        }
        if (formData.routing_information.date_3) {
          if (typeof formData.routing_information.date_3 === 'string' && formData.routing_information.date_3.length <= 10) {
            var _date2 = new Date(formData.routing_information.date_3);
            if (!isNaN(_date2.getTime())) {
              formData.routing_information.date_3 = _date2.toISOString().slice(0, 19).replace('T', ' ');
            }
          } else if (formData.routing_information.date_3 instanceof Date) {
            formData.routing_information.date_3 = formData.routing_information.date_3.toISOString().slice(0, 19).replace('T', ' ');
          }
        }
      }
      return formData;
    },
    // location
    getLocation: function getLocation() {
      var _this3 = this;
      (0,_core_services_location_cache__WEBPACK_IMPORTED_MODULE_3__.loadLocations)().then(function (data) {
        _this3.location = data;
      });
    },
    fetchAllAddressBook: function fetchAllAddressBook() {
      var _this4 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-shippers').then(function (response) {
        var all = response.data;
        _this4.shippers = all.filter(function (s) {
          return s.address_type === 'shipper_address';
        });
        _this4.consignees = all.filter(function (s) {
          return s.address_type === 'consignee_address';
        });
        _this4.alsoNotify = all.filter(function (s) {
          return s.address_type === 'also_notify_address';
        });
        _this4.filteredShippers = _this4.shippers;
        _this4.filteredConsignees = _this4.consignees;
        _this4.filteredAlsoNotify = _this4.alsoNotify;
      });
    },
    fillShipperDetails: function fillShipperDetails() {
      var _this5 = this;
      if (this.selectedShipper) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shipper-address?id=".concat(this.selectedShipper)).then(function (response) {
          _this5.form.shipper_address = response.data;
          // console.log('Shipper', response.data);
        })["catch"](function (error) {
          // console.error('Error fetching shipper address:', error);
        });
      } else {
        this.form.shipper_address = {
          ship_name: '',
          ship_name_2: '',
          ship_account: '',
          ship_address: '',
          ship_city: ''
        };
      }
    },
    fillConsigneeDetails: function fillConsigneeDetails() {
      var _this6 = this;
      if (this.selectedConsignee) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-consignee-address?id=".concat(this.selectedConsignee)).then(function (response) {
          _this6.form.consignee_address = response.data;
          // console.log('Consignee', response.data);
        })["catch"](function (error) {
          // console.error('Error fetching shipper address:', error);
        });
      } else {
        this.form.consignee_address = {
          cons_name: '',
          cons_name_2: '',
          cons_account: '',
          cons_address: '',
          cons_city: ''
        };
      }
    },
    fillAlsoNotifyDetails: function fillAlsoNotifyDetails() {
      var _this7 = this;
      if (this.selectAlsoNotify) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-alsonotify-address?id=".concat(this.selectAlsoNotify)).then(function (response) {
          _this7.form.also_notify_address = response.data;
          // console.log('Also Notify address', response.data);
        })["catch"](function (error) {
          // console.error('Error fetching Also notify address address:', error);
        });
      } else {
        this.form.also_notify_address = {
          also_name: '',
          also_name_2: '',
          also_account: '',
          also_address: '',
          also_city: ''
        };
      }
    },
    onSubmit: function onSubmit() {
      var _this8 = this;
      this.main_error_msg = '';
      $('.submit-button').css({
        'pointer-events': 'none',
        'opacity': '0.5'
      });
      // Prepare form data for submission - convert display dates to proper format
      // const preparedFormData = this.prepareFormDataForSubmission();

      if (this.mode === 'add') {
        // Update the existing form with prepared data
        // Object.assign(this.form, preparedFormData);
        this.from = _objectSpread({}, this.form);
        this.form.post("/user/create-focusair").then(function (response) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
            _this8.existingData = response.data.data.first_box.original.data;
            if (_this8.generatePDFAfterSave && _this8.existingData && _this8.existingData.id) {
              _this8.generateAwbPDF(_this8.generatePDFAfterSave);
            }
            _this8.successMessage = '-e-AWB Saved in database -Pass';
          } else {}
        })["catch"](function (error) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          var main_error_msg = '';
          if (error.response) {
            if (error.response.status === 422) {
              var errors = error.response.data.errors;
              for (var field in errors) {
                main_error_msg += "".concat(_this8.formatBackendError(errors[field][0]), "<br>");
              }
            }
          }
          _this8.main_error_msg = main_error_msg;
        });
      } else if (this.mode === 'update') {
        if (!this.existingData || !this.existingData.id) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          return;
        }
        // Update the existing form with prepared data
        // Object.assign(this.form, preparedFormData);
        this.from = _objectSpread({}, this.form);
        this.form.put("/user/update-airway-bill/".concat(this.existingData.id)).then(function (response) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
            _this8.existingData = response.data.data.first_box.original.data;
            if (_this8.generatePDFAfterSave && _this8.existingData && _this8.existingData.id) {
              _this8.generateAwbPDF(_this8.generatePDFAfterSave);
            }
            _this8.successMessage = '-e-AWB Saved in database -Pass';
          } else {}
        })["catch"](function (error) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          var main_error_msg = '';
          if (error.response) {
            if (error.response.status === 422) {
              var errors = error.response.data.errors;
              for (var field in errors) {
                main_error_msg += "".concat(_this8.formatBackendError(errors[field][0]), "<br>");
              }
            }
          }
          _this8.main_error_msg = main_error_msg;
        });
      }
    },
    onSelect: function onSelect(value) {
      if (value) {
        window.location.href = value;
      }
    },
    getAirwayBills: function getAirwayBills(status) {
      var _this9 = this;
      this.isFetching = true;
      this.data_items = []; // Clear stale data before fetch
      // Open the correct modal immediately — spinner shows while loading
      var modalId = status === 'draft' ? 'modal-draft-air' : 'modal-s-air';
      this.$bvModal.show(modalId);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-airway-bills/".concat(status)).then(function (response) {
        _this9.data_items = response.data;
      })["catch"](function (error) {
        // console.error("Failed to fetch items:", error);
      })["finally"](function () {
        _this9.isFetching = false;
      });
    },
    getAirWayBill: function getAirWayBill(id) {
      var _this0 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        if (response.data && response.data.id == id) {
          _this0.existingData = response.data;
          _this0.existingData.payment_info = _objectSpread(_objectSpread({}, _this0.defaultPaymentInfo), _this0.existingData.payment_info || {});
          // this.setDefaultValues();
          _this0.showAWBSection = true;
          _this0.awbError = null;
          _this0.openForm('update', _this0.existingData.id);
          if (_this0.existingData && _this0.existingData.consignment_data) {
            _this0.isConsignmentAdded = true;
          }
        } else {
          _this0.showAWBSection = false; // Hide if no data exists
          _this0.awbError = "No data found for this AWB ID.";
        }
      })["catch"](function (error) {
        _this0.existingData = null;
        _this0.showAWBSection = false;
        _this0.awbError = "No data found for this AWB ID.";
        _this0.awbDetails = false;
      });
    },
    getAirWayBillForRealod: function getAirWayBillForRealod(id) {
      var _this1 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        var _response$data;
        var fetchedId = (_response$data = response.data) === null || _response$data === void 0 || (_response$data = _response$data.id) === null || _response$data === void 0 ? void 0 : _response$data.toString();
        var inputId = id.toString();
        if (fetchedId === inputId) {
          _this1.existingData = response.data;
          _this1.showAWBSection = true;
          _this1.awbError = null;
          // this.openForm('update', this.existingData.id);
        } else {
          _this1.existingData = null;
          _this1.showAWBSection = false;
          _this1.awbError = "No data found for this AWB ID.";
        }
      })["catch"](function (error) {
        var _error$response;
        // console.error("Error fetching AWB:", error.response || error);
        _this1.showAWBSection = false;
        _this1.awbError = ((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404 ? "Air Waybill not found." : "";
      });
    },
    openForm: function openForm(mode) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.mode = mode;
      this.showAWBSection = false;
      if (mode === 'update' && id) {
        this.form.first_box = this.existingData;
        this.form.first_box.hawb_no = this.existingData.id;
        // Format dates for display when editing
        var routingInfo = _objectSpread({}, this.existingData);
        if (routingInfo.date) {
          routingInfo.date = this.formatDate(routingInfo.date);
        }
        if (routingInfo.date_2) {
          routingInfo.date_2 = this.formatDate(routingInfo.date_2);
        }
        if (routingInfo.date_3) {
          routingInfo.date_3 = this.formatDate(routingInfo.date_3);
        }
        this.form.routing_information = routingInfo;
        this.form.totals = this.existingData;
        this.form.custom_origin = this.existingData;
        this.form.tableCodes = JSON.parse(this.existingData.special_handling_info);

        // const specialHandlingCodes = this.form.tableCodes;
        var specialHandlingCodes = Array.isArray(this.form.tableCodes) ? this.form.tableCodes : [];
        if (specialHandlingCodes.includes("EAW")) {
          this.selectedCode = "EAW";
          this.form.first_box.awb = false;
        } else if (specialHandlingCodes.includes("EAP")) {
          this.selectedCode = "EAP";
          this.form.first_box.awb = false;
        } else if (this.form.first_box.awb === true) {
          this.selectedCode = "";
        }
        this.form.oci_entries = Array.isArray(this.existingData.other_custom_information) ? this.existingData.other_custom_information : [];

        // this.form.payment_info = this.existingData.payment_info || {};
        this.form.payment_info = _objectSpread(_objectSpread({}, this.defaultPaymentInfo), this.existingData.payment_info || {});
        this.form.charges = Array.isArray(this.existingData.other_charge) ? this.existingData.other_charge : [];
        // this.form.entries = Array.isArray(this.existingData.consignment_data)
        //     ? this.existingData.consignment_data
        //     : [this.existingData.consignment_data];
        var entry = this.existingData.consignment_data;
        // const parsedEntry = {
        //     ...entry,
        //     hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
        //     itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
        //     uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : [],
        //     // hsCodes: entry.hs_code && entry.hs_code !== '' ? JSON.parse(entry.hs_code) : [],
        //     // itemss: entry.pieces_info && entry.pieces_info !== '' ? JSON.parse(entry.pieces_info) : [],
        //     // uld_infos: entry.uld_info && entry.uld_info !== '' ? JSON.parse(entry.uld_info) : []

        // };
        // this.form.entries = [parsedEntry]; 
        if (entry) {
          var parsedEntry = _objectSpread(_objectSpread({}, entry), {}, {
            hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
            itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
            uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : []
          });
          this.form.entries = [parsedEntry];
          // console.log("Parsed entry:", parsedEntry);
        } else {
          // console.warn("No consignment data available. Entry is null or undefined.");
          this.form.entries = []; // Default to an empty array if no data exists
        }
        if (!this.form.entries) {
          this.isConsignmentAdded = true;
        }
        // this.form.entries = JSON.parse(this.existingData.consignment_data.pieces_info);
        // this.consignment_list = this.existingData.consignment_data;
        this.form.consignee_address = this.existingData.way_bill_address;
        this.form.shipper_address = this.existingData.way_bill_address;
        this.form.also_notify_address = this.existingData.way_bill_address;
        this.form.awb_email = this.existingData.awb_email;
        this.form.as_agreed = this.existingData.as_agreed;
      } else {
        // console.error('existingData is not an array:', this.existingData);
        // console.log("Add mode activated");
      }
    },
    handleEditNavigation: function handleEditNavigation(id) {
      this.$bvModal.hide('modal-s-air');
      var targetPath = "/edit-airway-bill/".concat(String(id));
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(function () {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    },
    getAgent: function getAgent(company_id, branch_id) {
      var _this10 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/agent-info").then(function (_ref6) {
        var data = _ref6.data;
        if (Array.isArray(data) && data.length > 0) {
          _this10.agent_information = data[0];
          _this10.iata_cass = {
            iata_agent_code: _this10.agent_information.iata_agent_code || null,
            iata_agent_cass: _this10.agent_information.iata_agent_cass || null
          };
        } else {
          _this10.agent_information = data;
        }
      })["catch"](function (error) {
        // console.error("Error fetching agent information:", error);
      });
    },
    getCountry: function getCountry() {
      var _this11 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-country').then(function (_ref7) {
        var data = _ref7.data;
        _this11.countries = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {
        // console.error("Error fetching countries:", error);
      });
    },
    getOtherChargesCode: function getOtherChargesCode() {
      var _this12 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/other-charges').then(function (_ref8) {
        var data = _ref8.data;
        _this12.other_charges_code = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {
        // console.error("Error fetching countries:", error);
      });
    },
    getOCIData: function getOCIData() {
      var _this13 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-oci-data').then(function (_ref9) {
        var data = _ref9.data;
        if (data && data.oci_custom_info_identifier) {
          _this13.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(function (_ref0) {
            var _ref1 = _slicedToArray(_ref0, 2),
              key = _ref1[0],
              value = _ref1[1];
            return {
              value: key,
              text: value
            };
          });
        } else {
          _this13.oci_data.oci_custom_info_identifier = [];
        }
        if (data && data.identifiers) {
          _this13.oci_identifiers.identifiers = Object.entries(data.identifiers).map(function (_ref10) {
            var _ref11 = _slicedToArray(_ref10, 2),
              key = _ref11[0],
              value = _ref11[1];
            return {
              value: key,
              text: value
            };
          });
        }
      })["catch"](function (error) {
        // console.error("Error fetching countries:", error);
        _this13.oci_data.oci_custom_info_identifier = [];
      });
    },
    handleRadioChange: function handleRadioChange(value) {
      // const selectedCode = this.selectedCode;
      // this.form.tableCodes = [];
      // this.form.tableCodes.push(selectedCode);

      // this.form.first_box.awb = false;

      if (!Array.isArray(this.form.tableCodes)) {
        this.form.tableCodes = [];
      }
      if (value === true) {
        this.selectedCode = "";
        this.form.tableCodes = this.form.tableCodes.filter(function (code) {
          return code !== "EAW" && code !== "EAP";
        });
        this.form.first_box.awb = true;
      } else {
        this.form.tableCodes = this.form.tableCodes.filter(function (code) {
          return code !== "EAW" && code !== "EAP";
        });
        if (value) {
          this.form.tableCodes.push(value);
        }
        this.form.first_box.awb = false;
      }
      // console.log("Updated Table Codes:", this.form.tableCodes);
    },
    addManualCode: function addManualCode() {
      if (!Array.isArray(this.form.tableCodes)) {
        this.form.tableCodes = [];
      }
      var code = this.selectedCode || this.custom_special_handling_code.trim();
      if (code) {
        if (!this.form.tableCodes.includes(code)) {
          this.form.tableCodes.push(code);
          // console.log("Table codes:", this.form.tableCodes);
        } else {
          alert('This code is already added.');
        }
      } else {
        alert('Please select or enter a code.');
      }
      this.selectedCode = '';
      this.custom_special_handling_code = '';
    },
    deleteSplCode: function deleteSplCode(index) {
      this.form.tableCodes.splice(index, 1);
    },
    validateNumericInput: function validateNumericInput(evt, field, maxLength) {
      evt = evt || window.event;
      var charCode = evt.which || evt.keyCode;
      if (charCode < 48 || charCode > 57) {
        evt.preventDefault();
      }
      if (this.form.first_box[field].length >= maxLength) {
        evt.preventDefault();
      }
    },
    onAWBInput: lodash_debounce__WEBPACK_IMPORTED_MODULE_5___default()(function () {
      var _this14 = this;
      var _this$form$first_box = this.form.first_box,
        awb_code = _this$form$first_box.awb_code,
        awb_no = _this$form$first_box.awb_no;
      if (awb_code && awb_code.length === 3) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-awbcode-prefix/".concat(awb_code)).then(function (response) {
          if (response.data) {
            var _response$data2 = response.data,
              name = _response$data2.name,
              code = _response$data2.code;
            _this14.awb_prefix_message = "Message will be sent to ".concat(name, " (").concat(code, ")");
          } else {
            _this14.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
          }
        })["catch"](function (error) {
          console.error("Error fetching AWB details:", error);
          _this14.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
        });
      } else {
        this.awb_prefix_message = "";
      }
      if (awb_code && awb_no) {
        // this.awbError = null;
        // this.awb_prefix_message = "";
        this.awbId = "".concat(String(awb_code)).concat(String(awb_no));
        this.getAirWayBillForRealod(this.awbId);
        this.$router.push({
          query: {
            awb_code: String(awb_code),
            awb_no: String(awb_no)
          }
        });
      } else {
        this.awbId = null;
        return;
      }
    }, 500),
    confirmReload: function confirmReload() {
      var confirmed = window.confirm("Are you sure you want to reload the content for AWB: ".concat(this.awbId, "?"));
      if (confirmed) {
        this.awbDetails = false;
        this.showAWBSection = false;
        // openForm('update', this.existingData.id)
        this.$router.go(0);
        this.getAirWayBill(this.awbId);
      }
    },
    reloadPageWithContent: function reloadPageWithContent() {
      var _this15 = this;
      var awbId = this.awbId;
      if (!awbId) {
        // console.error('AWB ID is missing');
        return;
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(awbId)).then(function (response) {
        _this15.existingData = response.data;
        if (_this15.existingData) {
          _this15.awbDetails = false;
          _this15.openForm('update', _this15.existingData.id);
          // this.$router.push({ path: `/edit-airway-bill/${awbId}` });
        } else {
          _this15.awbDetails = false;
        }
      })["catch"](function (error) {
        _this15.existingData = null;
        // this.awbError = "No data found for this AWB ID.";
        _this15.awbDetails = false;
        // console.error("Failed to fetch data for updating:", error);
      });
    }
  },
  mounted: function mounted() {
    // this.setDefaultValues();
    this.calculateTotalVolume();
    this.getLocation();
    this.fetchAllAddressBook();
    this.fillShipperDetails();
    this.fillConsigneeDetails();
    this.fillAlsoNotifyDetails();
    this.getCountry();
    this.getOtherChargesCode();
    this.getOCIData();
    var _this$$route$query = this.$route.query,
      awbId = _this$$route$query.awbId,
      awbError = _this$$route$query.awbError,
      existingData = _this$$route$query.existingData;
    if (awbId) {
      this.awbId = awbId;
    }
    if (awbError) {
      this.awbError = awbError;
    }
    if (existingData) {
      this.existingData = JSON.parse(existingData);
    }
    if (!this.awbId) {
      var _this$$route$query2 = this.$route.query,
        awb_code = _this$$route$query2.awb_code,
        awb_no = _this$$route$query2.awb_no;
      if (awb_code && awb_no) {
        this.awbId = "".concat(String(awb_code)).concat(String(awb_no));
        this.getAirWayBill(this.awbId);
        this.showAWBSection = false;
      }
    }
    // console.log("Current User:", this.current_user);
    if (this.current_user) this.getAgent(this.current_user.company_name, this.current_user.branch_name);
  },
  watch: {
    'form.awb_email': function formAwb_email(val) {
      var savedEmail = localStorage.getItem('fna_default_email');
      this.use_my_email = !!(savedEmail && val === savedEmail);
    },
    // 'consignment_list': function () {
    //     this.form.totals.total_amount = this.calculateTotalAmount();
    // },
    // 'form.entries.dimention_unit': function() {
    //     this.calculateTotalVolume();
    // },
    'agent_information.participate': function agent_informationParticipate(newValue) {
      // console.log('Participate value changed to:', newValue);
    },
    '$route.params.id': function $routeParamsId(newId) {
      if (newId) {
        this.getAirWayBill(newId);
      }
    },
    existingData: function existingData(newData) {
      // console.log("New data:", newData);
      if (newData && newData.id) {
        // this.generateAwbPDF();
      } else {
        // console.error('ID is missing in new data, cannot generate PDF.');
      }
    }
  },
  created: function created() {
    var id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.getAirWayBill(id);
    }
    this.getOCIData();
    this.onSubmit = this.onSubmit.bind(this);
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_10__.mapGetters)({
    current_user: "currentUser"
  })), {}, {
    submitButtonText: function submitButtonText() {
      return this.mode === 'add' ? 'Add Draft' : 'Update Draft';
    },
    formattedAWBId: function formattedAWBId() {
      if (this.awbId && this.awbId.length > 3) {
        return "".concat(this.awbId.slice(0, 3), "-").concat(this.awbId.slice(3));
      }
      return this.awbId;
    }
  }),
  components: {
    DashboardHistoryModal: _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_8__["default"],
    OcrUploadModal: _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
    // PageLoader
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render=function render(){var _vm=this,_c=_vm._self._c;return _c("b-container",{staticClass:"body-color",attrs:{fluid:""}},[_c("div",{staticClass:"d-flex flex-column flex-lg-row"},[_c("SideBar"),_vm._v(" "),_c("div",{staticStyle:{background:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.4)","box-shadow":"0 10px 30px rgba(53, 85, 148, 0.1)","z-index":"1","border-radius":"32px",flex:"1","min-width":"0"}},[_c("div",{staticClass:"container py-8 px-6 px-sm-8 px-md-10"},[[_c("b-row",{staticClass:"align-items-center mb-8"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex flex-column"},[_c("span",{staticStyle:{"text-transform":"uppercase","letter-spacing":"2px","font-size":"0.85rem","font-weight":"700",color:"#355594",opacity:"0.6","margin-bottom":"0.5rem",display:"block"}},[_vm._v("Navigation")]),_vm._v(" "),_c("h6",{staticStyle:{color:"#355594","font-size":"26px !important","line-height":"34px !important","font-weight":"800 !important","letter-spacing":"-0.5px !important","margin-bottom":"1rem","font-family":"'Inter', sans-serif !important"}},[_vm._v("Documentation")]),_vm._v(" "),_c("b-form-group",{staticClass:"mb-0 nav-dropdown-group",attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{background:"#F0F7FF","border-radius":"12px",padding:"6px 16px",width:"fit-content",border:"1px solid #E6F0FF"}},[_c("b-icon",{staticStyle:{color:"#355594","font-size":"1.2rem","margin-right":"12px"},attrs:{icon:"folder2-open"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"180px",border:"0px !important",color:"#355594","font-weight":"600",background:"transparent",cursor:"pointer",outline:"none","box-shadow":"none","padding-left":"0"},on:{change:_vm.onSelect},model:{value:_vm.selectedViewPageOption,callback:function callback($$v){_vm.selectedViewPageOption=$$v;},expression:"selectedViewPageOption"}},[_c("option",{attrs:{value:"/focus-air"}},[_vm._v("Master Airway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/house-way-bill"}},[_vm._v("Houseway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/consolidation"}},[_vm._v("Consolidation")])])],1)])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-md-end flex-wrap",staticStyle:{gap:"12px","align-items":"center"}},[_c("b-button",{staticClass:"show-btn",on:{click:function click($event){return _vm.getAirwayBills("draft");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"file-earmark-text"}}),_c("b",{staticClass:"font-weight-bolder",staticStyle:{"font-size":"1.05rem"}},[_vm._v("Drafts")])],1),_vm._v(" "),_c("b-button",{staticClass:"show-btn",on:{click:function click($event){return _vm.getAirwayBills("send");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"clock-history"}}),_c("b",{staticClass:"font-weight-bolder",staticStyle:{"font-size":"1.05rem"}},[_vm._v("10 Latest")])],1),_vm._v(" "),_c("OcrUploadModal",{attrs:{category:"focus_air"},on:{extracted:_vm.processExtractedData}})],1)]),_vm._v(" "),_c("DashboardHistoryModal",{attrs:{id:"modal-draft-air",title:"My Drafts",mode:"draft",docType:"master",items:_vm.data_items,isFetching:_vm.isFetching},on:{action:function action(item){return _vm.handleEditNavigation(item.id);}}}),_vm._v(" "),_c("DashboardHistoryModal",{attrs:{id:"modal-s-air",title:"Latest Messages",mode:"send",docType:"master",items:_vm.data_items,isFetching:_vm.isFetching},on:{action:function action(item){return _vm.handleEditNavigation(item.id);}}})],1)]],2),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),[_c("b-form",{on:{submit:function submit($event){$event.preventDefault();return _vm.onSubmit.apply(null,arguments);}}},[_c("div",{staticClass:"container py-8 px-6 px-sm-8 px-md-10"},[_c("div",{staticClass:"mx-2 mx-sm-8"},[_c("b-row",{staticClass:"mt-0 mb-4 mt-md-0 mb-md-10"},[_c("b-col",{attrs:{cols:"12",md:"6",lg:"5"}},[_c("div",[_c("div",{staticClass:"d-flex flex-wrap align-items-center"},[_c("b-form-group",{staticClass:"align-items-center mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("span",[_vm._v("AWB No:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"awb-flex-row"},[_c("b-form-input",{staticClass:"awb-code-input","class":{"is-invalid":_vm.form.errors.has("awb_code")},staticStyle:{width:"62px"},attrs:{id:"input-horizontal",required:""},on:{input:_vm.onAWBInput,keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_code",3);}},model:{value:_vm.form.first_box.awb_code,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_code",$$v);},expression:"form.first_box.awb_code"}}),_vm._v(" "),_c("span",{staticStyle:{color:"#355594","font-weight":"bold"}},[_vm._v("-")]),_vm._v(" "),_c("b-form-input",{staticClass:"awb-no-input","class":{"is-invalid":_vm.form.errors.has("awb_no")},staticStyle:{width:"100px"},attrs:{id:"input-horizontal",required:""},on:{input:_vm.onAWBInput,keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_no",8);}},model:{value:_vm.form.first_box.awb_no,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_no",$$v);},expression:"form.first_box.awb_no"}}),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-3 mb-0",attrs:{size:"sm"},model:{value:_vm.form.first_box.consolidated_mawb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"consolidated_mawb",$$v);},expression:"form.first_box.consolidated_mawb"}},[_vm._v("Consolidate MAWB")])],1)])],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_code")},attrs:{form:_vm.form,field:"awb_code"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_no")},attrs:{form:_vm.form,field:"awb_no"}}),_vm._v(" "),_vm.awb_prefix_message?_c("p",{staticClass:"mt-2",staticStyle:{"font-weight":"400","font-size":"12px","line-height":"18px"}},[_vm._v(_vm._s(_vm.awb_prefix_message))]):_vm._e(),_vm._v(" "),_vm.awbId&&_vm.showAWBSection?_c("div",[_c("p",[_vm._v("The Air Waybill number has been used (printed at:)")]),_vm._v(" "),_c("p",[_vm._v("\n                                                        Load content:\n                                                        "),_c("span",{staticStyle:{cursor:"pointer",color:"blue"}},[_c("router-link",{attrs:{to:"/edit-airway-bill/"+_vm.awbId,custom:""},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref){var navigate=_ref.navigate,href=_ref.href;return[_c("p",{on:{click:_vm.confirmReload}},[_vm._v(_vm._s(_vm.formattedAWBId))])];}}],null,false,1732065003)})],1)])]):_vm._e()],1)])]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"4",lg:"5"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:true},on:{change:function change($event){return _vm.handleRadioChange(true);}},model:{value:_vm.form.first_box.awb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb",$$v);},expression:"form.first_box.awb"}},[_vm._v("AWB")])],1),_vm._v(" "),_c("b-form-group",{attrs:{"label-for":""}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAW"},on:{change:function change($event){return _vm.handleRadioChange("EAW");}},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With No Accompanying Paper\n                                                Documents")])],1),_vm._v(" "),_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAP"},on:{change:function change($event){return _vm.handleRadioChange("EAP");}},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With Accompanying Paper\n                                                Documents")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"2",lg:"2"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm"}},[_vm._v("e-CSD AWB")])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"my-4 my-md-10"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                            Shipper\n                                        ")]),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"shipper-input-icon-row"},[_c("div",{ref:"dropdownContainer_shipper",staticClass:"custom-dropdown",on:{click:function click($event){return _vm.toggleDropdown("shipper");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.shipper_address.ship_name,expression:"form.shipper_address.ship_name"}],staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_name")},attrs:{type:"text",placeholder:"Search shipper",id:"shipper",autocomplete:"off"},domProps:{value:_vm.form.shipper_address.ship_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.shipper_address,"ship_name",$event.target.value);},_vm.filterShippers],focus:function focus($event){return _vm.toggleDropdown("shipper",true);}}}),_vm._v(" "),_vm.activeDropdown==="shipper"&&_vm.filteredShippers.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredShippers,function(shipper,index){return _c("div",{key:shipper.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectShipper(shipper);}}},[_vm._v("\n                                                             "+_vm._s(shipper.name)+"\n                                                         ")]);}),0):_vm._e()]),_vm._v(" "),_c("b-icon",{staticStyle:{color:"#355594",stroke:"#355594",cursor:"pointer","font-size":"1.2rem","flex-shrink":"0"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showShipper=!_vm.showShipper;}}})],1),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name"}})],1),_vm._v(" "),_vm.showShipper?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-name-2-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control ship_name_2","class":{"is-invalid":_vm.form.errors.has("ship_name_2")},attrs:{id:"shipper-name-2-input",autocomplete:"off"},model:{value:_vm.form.shipper_address.ship_name_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_name_2",$$v);},expression:"form.shipper_address.ship_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_account,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_account",$$v);},expression:"form.shipper_address.ship_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,1954229067)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"shipper_address.ship_address",40);}},model:{value:_vm.form.shipper_address.ship_address,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address",$$v);},expression:"form.shipper_address.ship_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address_line_2")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"shipper_address.ship_address_line_2",35);}},model:{value:_vm.form.shipper_address.ship_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address_line_2",$$v);},expression:"form.shipper_address.ship_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,3712382874)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2 city-airport-row"},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("ship_city")},staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_city,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_city",$$v);},expression:"form.shipper_address.ship_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_airport_code",$$v);},expression:"form.shipper_address.ship_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_city")},attrs:{form:_vm.form,field:"ship_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_airport_code")},attrs:{form:_vm.form,field:"ship_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Pin code:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}],null,false,3659841831)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_post_code")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_post_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_post_code",$$v);},expression:"form.shipper_address.ship_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}],null,false,560036906)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_state")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_state,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_state",$$v);},expression:"form.shipper_address.ship_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,2615762453)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_country")},model:{value:_vm.form.shipper_address.ship_country,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_country",$$v);},expression:"form.shipper_address.ship_country"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                        "+_vm._s(country.text)+"\n                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_phone")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_phone,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_phone",$$v);},expression:"form.shipper_address.ship_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_fax")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_fax,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_fax",$$v);},expression:"form.shipper_address.ship_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_telex,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_telex",$$v);},expression:"form.shipper_address.ship_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"90px"},attrs:{size:"sm"},model:{value:_vm.form.is_shipper_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_shipper_address_save",$$v);},expression:"form.is_shipper_address_save"}},[_vm._v(" Save new address to address\n                                                book")])],1):_vm._e()],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2 d-none d-md-block",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for\n                                            later logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                            Consignee\n                                        ")]),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"shipper-input-icon-row"},[_c("div",{ref:"dropdownContainer_consignee",staticClass:"custom-dropdown",on:{click:function click($event){return _vm.toggleDropdown("consignee");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.consignee_address.cons_name,expression:"form.consignee_address.cons_name"}],staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name")},attrs:{type:"text",placeholder:"Search consignee",id:"consignee",autocomplete:"off"},domProps:{value:_vm.form.consignee_address.cons_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.consignee_address,"cons_name",$event.target.value);},_vm.filterConsignee],focus:function focus($event){return _vm.toggleDropdown("consignee",true);}}}),_vm._v(" "),_vm.activeDropdown==="consignee"&&_vm.filteredConsignees.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredConsignees,function(consignee,index){return _c("div",{key:consignee.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectConsignee(consignee);}}},[_vm._v("\n                                                             "+_vm._s(consignee.name)+"\n                                                         ")]);}),0):_vm._e()]),_vm._v(" "),_c("b-icon",{staticStyle:{color:"#355594",stroke:"#355594",cursor:"pointer","font-size":"1.2rem","flex-shrink":"0"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showConsignee=!_vm.showConsignee;}}})],1),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1),_vm._v(" "),_vm.showConsignee?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"consignee-name-2-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name_2")},attrs:{id:"consignee-name-2-input",autocomplete:"off"},model:{value:_vm.form.consignee_address.cons_name_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_name_2",$$v);},expression:"form.consignee_address.cons_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_account,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_account",$$v);},expression:"form.consignee_address.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,1954229067)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"consignee_address.cons_address",40);}},model:{value:_vm.form.consignee_address.cons_address,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address",$$v);},expression:"form.consignee_address.cons_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address_line_2")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"consignee_address.cons_address_line_2",35);}},model:{value:_vm.form.consignee_address.cons_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address_line_2",$$v);},expression:"form.consignee_address.cons_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,3712382874)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2 city-airport-row"},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("cons_city")},staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_city,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_city",$$v);},expression:"form.consignee_address.cons_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control","class":{"is-invalid":_vm.form.errors.has("cons_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_airport_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_airport_code",$$v);},expression:"form.consignee_address.cons_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_city")},attrs:{form:_vm.form,field:"cons_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_airport_code")},attrs:{form:_vm.form,field:"cons_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Pin code:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}],null,false,3659841831)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_post_code")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_post_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_post_code",$$v);},expression:"form.consignee_address.cons_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}],null,false,560036906)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_state")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_state,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_state",$$v);},expression:"form.consignee_address.cons_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,2615762453)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_country")},model:{value:_vm.form.consignee_address.cons_country,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_country",$$v);},expression:"form.consignee_address.cons_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                        "+_vm._s(country.text)+"\n                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_phone")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_phone,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_phone",$$v);},expression:"form.consignee_address.cons_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_fax")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_fax,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_fax",$$v);},expression:"form.consignee_address.cons_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_telex,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_telex",$$v);},expression:"form.consignee_address.cons_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"90px"},attrs:{size:"sm"},model:{value:_vm.form.is_consignee_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_consignee_address_save",$$v);},expression:"form.is_consignee_address_save"}},[_vm._v(" Save new address to address book")])],1):_vm._e()],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2 d-md-none",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for\n                                            later logins")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-tabs",{staticClass:"custom-nav-title mt-6",attrs:{"content-class":"mt-7"}},[_c("b-tab",{staticStyle:{"border-bottom":"0px !important"},attrs:{title:"Routing Information"}},[_c("b-row",{staticClass:"mt-8 mb-6"},[_c("b-col",{attrs:{cols:"12",lg:"4"}},[_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-departure-airport"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Departure Airport:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_departure",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"220px !important"},on:{click:function click($event){return _vm.toggleDropdown("departure");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.departure_airport,expression:"form.routing_information.departure_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("departure_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search departure",id:"departure",autocomplete:"off"},domProps:{value:_vm.form.routing_information.departure_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"departure_airport",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="departure"&&_vm.getFilteredLocations(_vm.form.routing_information.departure_airport).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.departure_airport),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("departure_airport",item);}}},[_vm._v(_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("departure_airport")},attrs:{form:_vm.form,field:"departure_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-destination-airport"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Destination Airport:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_destination",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"220px !important"},on:{click:function click($event){return _vm.toggleDropdown("destination");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.destination_airport,expression:"form.routing_information.destination_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("destination_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search destination",id:"destination",autocomplete:"off"},domProps:{value:_vm.form.routing_information.destination_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"destination_airport",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="destination"&&_vm.getFilteredLocations(_vm.form.routing_information.destination_airport).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.destination_airport),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("destination_airport",item);}}},[_vm._v("\n                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("destination_airport")},attrs:{form:_vm.form,field:"destination_airport"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-lg-0",attrs:{cols:"12",lg:"8"}},[_c("div",{staticClass:"table-responsive",staticStyle:{overflow:"visible !important"}},[_c("table",{staticClass:"table",staticStyle:{"max-width":"100%",width:"100%","min-width":"650px !important"}},[_c("thead",[_c("tr",{},[_c("th",{staticStyle:{color:"#355594",width:"8%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"21%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("From")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"21%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("To")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"11%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("By")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"14%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("Flight")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"20%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("Date")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"5%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}})])]),_vm._v(" "),_c("tbody",[_c("tr",{"class":{"active-row":_vm.activeDropdown==="from"||_vm.activeDropdown==="to"}},[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important","font-weight":"500",color:"#475569"}},[_vm._v("Routing:"),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_from",staticClass:"custom-dropdown align-items-center","class":{active:_vm.activeDropdown==="from"},staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("from");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.from,expression:"form.routing_information.from"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("from")},attrs:{type:"text",placeholder:"Search destination",id:"from_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.from},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"from",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="from"&&_vm.getFilteredLocations(_vm.form.routing_information.from).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.from),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("from",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to",staticClass:"custom-dropdown align-items-center","class":{active:_vm.activeDropdown==="to"},staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("to");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to,expression:"form.routing_information.to"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to")},attrs:{type:"text",placeholder:"Search destination",id:"to_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="to"&&_vm.getFilteredLocations(_vm.form.routing_information.to).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.to),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("to",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by,expression:"form.routing_information.by"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight,expression:"form.routing_information.flight"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date,expression:"form.routing_information.date"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date");}}})],1)]),_vm._v(" "),_vm.form.errors.has("from")||_vm.form.errors.has("to")||_vm.form.errors.has("by")||_vm.form.errors.has("flight")||_vm.form.errors.has("date")?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("from")},attrs:{form:_vm.form,field:"from"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("to")},attrs:{form:_vm.form,field:"to"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("by")},attrs:{form:_vm.form,field:"by"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("flight")},attrs:{form:_vm.form,field:"flight"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("date")},attrs:{form:_vm.form,field:"date"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important"}},[_vm._v(" ")])]):_vm._e(),_vm._v(" "),_c("tr",{"class":{"active-row":_vm.activeDropdown==="to2"}},[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to2",staticClass:"custom-dropdown","class":{active:_vm.activeDropdown==="to2"},staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("to2");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_2,expression:"form.routing_information.to_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_2")},attrs:{type:"text",placeholder:"Search destination",id:"to2_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_2",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="to2"&&_vm.getFilteredLocations(_vm.form.routing_information.to_2).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.to_2),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("to_2",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_2"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_2,expression:"form.routing_information.by_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_2")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_2,expression:"form.routing_information.flight_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_2")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_2,expression:"form.routing_information.date_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_2")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_2");}}})],1)]),_vm._v(" "),_c("tr",{"class":{"active-row":_vm.activeDropdown==="to3"}},[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to3",staticClass:"custom-dropdown","class":{active:_vm.activeDropdown==="to3"},staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("to3");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_3,expression:"form.routing_information.to_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_3")},attrs:{type:"text",placeholder:"Search destination",id:"to3_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_3",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="to3"&&_vm.getFilteredLocations(_vm.form.routing_information.to_3).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.to_3),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("to_3",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_3"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_3,expression:"form.routing_information.by_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_3")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_3,expression:"form.routing_information.flight_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_3")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_3,expression:"form.routing_information.date_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_3")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_3");}}})],1)])])])])])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("b-row",[_c("b-col",{attrs:{cols:"12",sm:"6"}},[_c("div",{staticClass:"align-items-center"},[_c("h6",{staticClass:"h-color mb-0"},[_vm._v("Consignment Rate Description")])])]),_vm._v(" "),_c("b-col",{staticClass:"mt-2 mt-sm-0 text-left text-sm-right",attrs:{cols:"12",sm:"6"}},[_c("div",{staticClass:"d-flex justify-content-start justify-content-sm-end align-items-center mr-0 mr-sm-16"},[_c("p",{staticClass:"mb-0 ml-0 ml-sm-4 mr-4",staticStyle:{"border-bottom":"1px solid #355594",color:"#355594","font-size":"13px","font-weight":"600",cursor:"pointer"}},[_vm._v("Collect house waybill sum's")])])])],1),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-consignment",modifiers:{"modal-consignment":true}}],staticClass:"mt-5 mb-5 show-btn",attrs:{disabled:_vm.isConsignmentAdded},on:{click:_vm.handleAddConsignment}},[_vm._v("Add Consignment Information")]),_vm._v(" "),_c("b-modal",{ref:"modalConsignment",attrs:{id:"modal-consignment",title:"Consignment Information",size:"xl","ok-only":"","hide-footer":"",centered:"","modal-class":"premium-modal","title-class":"font-weight-bolder text-dark","header-class":"border-bottom-0 pb-0 px-5 pt-5"},on:{hide:_vm.handleModalClose}},[_c("b-row",[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("h6",{staticStyle:{color:"#0f2247","font-weight":"700","margin-bottom":"15px",background:"#e1e8f5",padding:"10px 14px","border-left":"4px solid #2c4d8c","border-radius":"4px","font-size":"14px","letter-spacing":"0.3px"}},[_vm._v("Pieces and Nature and Quantity of Goods")]),_vm._v(" "),_c("div",{},[_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Pieces"}},[_vm._v("Pieces")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("pieces")},staticStyle:{width:"100% !important","margin-bottom":"10px"},attrs:{id:"input-departure-airport"},model:{value:_vm.consignment_list.pieces,callback:function callback($$v){_vm.$set(_vm.consignment_list,"pieces",$$v);},expression:"consignment_list.pieces"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"pieces"}}),_vm._v(" "),_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Description7"}},[_vm._v("Description")]),_vm._v(" "),_c("b-form-textarea",{"class":{"is-invalid":_vm.consignment_list.errors.has("description")},staticStyle:{height:"70px",width:"100%","margin-bottom":"10px"},attrs:{id:"textarea"},model:{value:_vm.consignment_list.description,callback:function callback($$v){_vm.$set(_vm.consignment_list,"description",$$v);},expression:"consignment_list.description"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"description"}}),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Rate Class:")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Rate class:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("rate_class")},staticStyle:{"margin-bottom":"10px"},on:{change:_vm.calculateTotalAmount},model:{value:_vm.consignment_list.rate_class,callback:function callback($$v){_vm.$set(_vm.consignment_list,"rate_class",$$v);},expression:"consignment_list.rate_class"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("CB - Basic rate")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("CC - Specific commodity rate")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("CE - Unit load device additional rate")]),_vm._v(" "),_c("option",{attrs:{value:"K"}},[_vm._v("CK - Rate per kilogram")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("CM - Minimum charge")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("CN - Normal rate")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("CP - International priority service rate")]),_vm._v(" "),_c("option",{attrs:{value:"Q"}},[_vm._v("CQ - Quantity rate")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("CR - Class rate reduction")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("CS - Class rate surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v("CU - Unit load device basic charge or rate")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("CX - Unit load device additional info")]),_vm._v(" "),_c("option",{attrs:{value:"Y"}},[_vm._v("CY - Unit load device discount")]),_vm._v(" "),_c("option",{attrs:{value:"Z"}},[_vm._v("CZ - Mutually Defined")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate_class"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_rate_class,expression:"consignment_list.uld_rate_class"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("uld_rate_class")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_rate_class},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_rate_class",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"uld_rate_class"}})],1)]),_vm._v(" "),_vm.consignment_list.rate_class?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"},attrs:{colspan:"4"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center"},[_c("span",{staticClass:"mr-2"},[_vm._v("Charge:")]),_vm._v(" "),_c("input",{staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.calculatedCharge}})])])]):_vm._e(),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Service code")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Commodity Item")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("service_code")},staticStyle:{"margin-bottom":"10px"},model:{value:_vm.consignment_list.service_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"service_code",$$v);},expression:"consignment_list.service_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Service Code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Airport to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B - Service Cargo")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Company Material")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Door to Door")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Airport to Door")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Flight Specific")]),_vm._v(" "),_c("option",{attrs:{value:"G"}},[_vm._v("G - Door to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"H"}},[_vm._v("H - Company Mail")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Diplomatic Mail")]),_vm._v(" "),_c("option",{attrs:{value:"J"}},[_vm._v("J - Priority Service")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Small Package Service")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("R - Restricted")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - Substitue Truck")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Charter")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Express Service")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"service_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.commodity_item,expression:"consignment_list.commodity_item"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("commodity_item")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.commodity_item},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"commodity_item",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("\n                                                                Country Of Origin of Goods\n                                                            ")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Slac:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("country_origin_goods")},staticStyle:{"margin-bottom":"10px"},model:{value:_vm.consignment_list.country_origin_goods,callback:function callback($$v){_vm.$set(_vm.consignment_list,"country_origin_goods",$$v);},expression:"consignment_list.country_origin_goods"}},[_c("option",{attrs:{value:""}},[_vm._v(" Select a Country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                        "+_vm._s(country.text)+"\n                                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"country_origin_goods"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.slac,expression:"consignment_list.slac"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("slac")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.slac},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"slac",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Hs Codes:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center"}},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.hs_code_error.length>0},staticStyle:{width:"100%","margin-right":"10px","margin-bottom":"10px"},attrs:{type:"text"},model:{value:_vm.consignment_list.hs_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"hs_code",$$v);},expression:"consignment_list.hs_code"}}),_vm._v(" "),_c("button",{staticClass:"show-btn",staticStyle:{"margin-bottom":"10px"},on:{click:_vm.addHsCode}},[_vm._v("Add")])],1),_vm._v(" "),_vm.hs_code_error.length?_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.hs_code_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)]):_vm._e()]),_vm._v(" "),_c("tr",{staticStyle:{"background-color":"#F8FAFC"}},[_c("th",{staticStyle:{color:"#8A99AD !important","font-weight":"500 !important","font-size":"11px !important","text-transform":"uppercase !important","letter-spacing":"0.5px !important",padding:"6px 2px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.05) !important"}},[_vm._v("HS Codes")])]),_vm._v(" "),_vm._l(_vm.consignment_list.hsCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",[_vm._v(" "+_vm._s(code)+" ")]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.removeHsCode(index);}}})],1)]);})],2)])])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("h6",{staticStyle:{color:"#0f2247","font-weight":"700","margin-bottom":"25px",background:"#e1e8f5",padding:"10px 14px","border-left":"4px solid #2c4d8c","border-radius":"4px","font-size":"14px","letter-spacing":"0.3px"}},[_vm._v("Weight and Dimensions")]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Gross Weight")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Rate")])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.gross_weight,expression:"consignment_list.gross_weight"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("gross_weight")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"gross_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"gross_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("weight_code")},model:{value:_vm.consignment_list.weight_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"weight_code",$$v);},expression:"consignment_list.weight_code"}},[_c("option",{attrs:{value:"KGM"}},[_vm._v("Kgs")]),_vm._v(" "),_c("option",{attrs:{value:"LBR"}},[_vm._v("Lbs")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"weight_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.chargable_weight,expression:"consignment_list.chargable_weight"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("chargable_weight")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.chargable_weight},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"chargable_weight",$event.target.value);},_vm.calculateTotalAmount]}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"chargable_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.rate,expression:"consignment_list.rate"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("rate")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.rate},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"rate",$event.target.value);},_vm.calculateTotalAmount]}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate"}})],1)])])]),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Pcs")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Wgt")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Length")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Width")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Height")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Unit")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.pcs,expression:"consignment_list.pcs"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.pcs},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"pcs",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.wgt,expression:"consignment_list.wgt"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.wgt},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"wgt",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.length,expression:"consignment_list.length"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.length},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"length",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.width,expression:"consignment_list.width"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.width},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"width",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.height,expression:"consignment_list.height"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.height},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"height",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100",model:{value:_vm.consignment_list.unit,callback:function callback($$v){_vm.$set(_vm.consignment_list,"unit",$$v);},expression:"consignment_list.unit"}},[_c("option",{attrs:{value:"CMT"}},[_vm._v("CMT")]),_vm._v(" "),_c("option",{attrs:{value:"INH"}},[_vm._v("INH")]),_vm._v(" "),_c("option",{attrs:{value:"FOT"}},[_vm._v("FOT")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addPcsInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.validationErrors.length>0?_c("tr",[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"7"}},[_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.validationErrors,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])])]):_vm._e()])]),_vm._v(" "),_c("table",{staticClass:"table-lightweight"},[_c("thead",[_c("tr",[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.itemss,function(row,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(row.pcs))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.wgt)+" "+_vm._s(_vm.consignment_list.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.length))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.width))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.height))]),_vm._v(" "),_c("td",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",{staticClass:"mr-3"},[_vm._v(_vm._s(row.unit))]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deletePcs(index);}}})],1)]);}),0)]),_vm._v(" "),_c("table",{staticClass:"table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Volume")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-input",{staticClass:"form-control w-100",attrs:{id:"input-horizontal"},model:{value:_vm.consignment_list.volume,callback:function callback($$v){_vm.$set(_vm.consignment_list,"volume",$$v);},expression:"consignment_list.volume"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100",model:{value:this.form.entries.dimention_unit,callback:function callback($$v){_vm.$set(this.form.entries,"dimention_unit",$$v);},expression:"this.form.entries.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1)])])])]),_vm._v(" "),_c("h5",{staticClass:"mt-10 mb-2",staticStyle:{"font-size":"13px","font-weight":"500"}},[_vm._v("ULD Information")]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_type,expression:"consignment_list.uld_type"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_type},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_type",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_serial,expression:"consignment_list.uld_serial"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_serial},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_serial",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-2"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.owner,expression:"consignment_list.owner"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.owner},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"owner",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addUldInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.uld_error.length?_c("tr",{staticStyle:{color:"red"}},[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"4"}},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.uld_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])]):_vm._e()])]),_vm._v(" "),_c("table",{staticClass:"table-lightweight"},[_c("thead",[_c("tr",[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.uld_infos,function(row,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(row.uld_type))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.uld_serial))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.owner))]),_vm._v(" "),_c("td",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span"),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteUldInfo(index);}}})],1)]);}),0)])])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addOrUpdateEntry}},[_vm._v("\n                                            "+_vm._s(_vm.edit_entry_index!==null?"Update":"Add")+"\n                                        ")])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-hover table-sm align-middle",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticClass:"text-nowrap",staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"60px",padding:"10px 8px"}},[_vm._v("Pcs.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"250px",padding:"10px 8px"}},[_vm._v("Description")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"90px",padding:"10px 8px"}},[_vm._v("Srv. Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"95px",padding:"10px 8px"}},[_vm._v("Com. Itm.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"110px",padding:"10px 8px"}},[_vm._v("Gross Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"110px",padding:"10px 8px"}},[_vm._v("Chrg. Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}},[_vm._v("Rate")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"260px",padding:"10px 8px"}},[_vm._v("Detailed Pcs. Info")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}},[_vm._v("Vol.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"100px",padding:"10px 8px"}},[_vm._v("Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"120px",padding:"10px 8px"}},[_vm._v("UID Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"90px",padding:"10px 8px"}},[_vm._v("Charge")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"115px",padding:"10px 8px"}},[_vm._v("HS Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"120px",padding:"10px 8px"}},[_vm._v("Origin Country")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"160px",padding:"10px 8px"}},[_vm._v("UID information")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}},[_vm._v("Slac")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.entries,function(entry,index){return _c("tr",{key:index},[_c("td",{staticClass:"align-middle"},[_c("strong",[_vm._v(_vm._s(entry.pieces))])]),_vm._v(" "),_c("td",{staticClass:"align-middle text-wrap",staticStyle:{"max-width":"300px","line-height":"1.4"}},[entry.description?_c("div",_vm._l(entry.description.split("\n"),function(line,lineIdx){return _c("div",{key:lineIdx,"class":lineIdx===0?"font-weight-bold text-dark":"text-muted small mt-1"},[_vm._v("\n                                                                "+_vm._s(line)+"\n                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.service_code))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.commodity_item))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("div",{staticClass:"text-nowrap"},[_c("strong",[_vm._v(_vm._s(entry.gross_weight))]),_vm._v(" "),_c("span",{staticClass:"text-muted small"},[_vm._v(_vm._s(entry.weight_code))])])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("div",{staticClass:"text-nowrap"},[_c("strong",[_vm._v(_vm._s(entry.chargable_weight))]),_vm._v(" "),_c("span",{staticClass:"text-muted small"},[_vm._v(_vm._s(entry.weight_code||"KGM"))])])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("strong",[_vm._v(_vm._s(entry.rate))])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},_vm._l(entry.itemss,function(pcs,pcsIndex){return _c("div",{key:pcsIndex,staticClass:"mb-1"},[_c("span",{staticClass:"badge badge-light border text-dark px-2 py-1 d-inline-block",staticStyle:{"font-size":"11px","white-space":"nowrap"}},[_c("strong",[_vm._v(_vm._s(pcs.pcs))]),_vm._v(" pcs\n                                                                "),pcs.wgt?_c("span",{staticClass:"text-muted"},[_vm._v(" ("+_vm._s(pcs.wgt)+" "+_vm._s(pcs.weight_code)+")")]):_vm._e(),_vm._v(" "),pcs.length||pcs.width||pcs.height?_c("span",{staticClass:"text-muted font-weight-normal ml-1"},[_vm._v("\n                                                                    • "+_vm._s(pcs.length)+"×"+_vm._s(pcs.width)+"×"+_vm._s(pcs.height)+" "+_vm._s(pcs.unit)+"\n                                                                ")]):_vm._e()])]);}),0),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.volume))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[entry.rate_class?_c("span",{staticClass:"badge badge-secondary"},[_vm._v(_vm._s(entry.rate_class))]):_vm._e()]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.uld_rate_class))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("strong",[_vm._v(_vm._s(_vm.form.totals.total_amount))])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("div",{staticClass:"d-flex flex-wrap"},_vm._l(entry.hsCodes,function(hs,hsIndex){return _c("span",{key:hsIndex,staticClass:"badge mr-1 mb-1 px-2 py-1",staticStyle:{"font-size":"11px","background-color":"#e1e8f5",color:"#2c4d8c",border:"1px solid #c9d6ec","font-weight":"600"}},[_vm._v("\n                                                                "+_vm._s(hs)+"\n                                                            ")]);}),0)]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.country_origin_goods))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},_vm._l(entry.uld_infos,function(uld,uldIndex){return _c("div",{key:uldIndex,staticClass:"mb-1"},[_c("span",{staticClass:"badge badge-light border text-dark px-2 py-1 d-inline-block",staticStyle:{"font-size":"11px","white-space":"nowrap"}},[_c("strong",[_vm._v(_vm._s(uld.uld_type))]),_vm._v(" "),_c("span",{staticClass:"text-muted"},[_vm._v("#"+_vm._s(uld.uld_serial)+" ("+_vm._s(uld.owner)+")")])])]);}),0),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.slac))]),_vm._v(" "),_c("td",{staticClass:"align-middle text-nowrap"},[_c("b-icon",{staticClass:"mr-2 text-primary",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editEntry(index);}}}),_vm._v(" "),_c("b-icon",{staticClass:"text-danger",staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteEntry(index);}}})],1)]);}),0)])])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{staticStyle:{"justify-items":"flex-end"},attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-center mr-32 mt-4"},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("div",{staticClass:"mr-2"},[_vm._v("Total Volume:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control mr-2",staticStyle:{width:"140px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.totals.total_volume,callback:function callback($$v){_vm.$set(_vm.form.totals,"total_volume",$$v);},expression:"form.totals.total_volume"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"60px","background-position-x":"right"},model:{value:_vm.form.totals.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form.totals,"dimention_unit",$$v);},expression:"form.totals.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"mr-2 mb-0"},[_vm._v("Total Amount:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control mr-2",staticStyle:{width:"140px"},attrs:{id:"input-horizontal",value:_vm.calculatedCharge}})],1)])],1)])],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"mt-2 text-bold justify-content-lg-start",staticStyle:{"font-size":"16px","font-weight":"600"},attrs:{size:"lg",value:1,"unchecked-value":0,id:"agreed"},model:{value:_vm.form.as_agreed,callback:function callback($$v){_vm.$set(_vm.form,"as_agreed",$$v);},expression:"form.as_agreed"}},[_vm._v("As Agreed")])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-6 mb-15 ml-4 mr-4"},[_c("h6",{staticClass:"h-color mb-6"},[_vm._v("Customs Origin Code:")]),_vm._v(" "),_c("b-form-group",{staticStyle:{"max-width":"450px",width:"100%"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control",model:{value:_vm.form.custom_origin.customs_origin_code,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"customs_origin_code",$$v);},expression:"form.custom_origin.customs_origin_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select another charge code")]),_vm._v(" "),_c("option",{attrs:{value:"T1"}},[_vm._v("T1 - Goods from outside the EC under Customs Control")]),_vm._v(" "),_c("option",{attrs:{value:"T2"}},[_vm._v("T2 - EC Goods not in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"TE"}},[_vm._v("TE - Goods in trade with Spain subject to duties")]),_vm._v(" "),_c("option",{attrs:{value:"TP"}},[_vm._v("TP - Goods in trade with Portugal subject to special duties")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("TD - Goods already under formal transit procedure")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("TF - Goods in trade between EC and Canary Islands")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Goods in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Goods in free circulation with destination outside the EC")])])],1)],1)])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"pt-4 pb-9"},[_c("b-tabs",{staticClass:"custom-nav",attrs:{"content-class":"mt-3"}},[_c("b-tab",{attrs:{title:"OSI",active:""}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Service Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("other_service_information")},staticStyle:{height:"80px",width:"60%"},attrs:{id:"textarea"},on:{input:_vm.validateTextarea},model:{value:_vm.form.custom_origin.other_service_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"other_service_information",$$v);},expression:"form.custom_origin.other_service_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"other_service_information"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"SSR"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Special Service Request:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("special_service_request")},staticStyle:{height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.special_service_request,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"special_service_request",$$v);},expression:"form.custom_origin.special_service_request"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_service_request"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Accounting Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Accounting Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("accounting_information")},staticStyle:{height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.accounting_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"accounting_information",$$v);},expression:"form.custom_origin.accounting_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"accounting_information"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-2 flex-wrap tab-input-group"},[_c("label",{staticClass:"mb-0 mr-2",staticStyle:{width:"90px"},attrs:{"for":"input-horizontal"}},[_vm._v("Letter Of Credit")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"200px"},model:{value:_vm.form.custom_origin.letter_credit,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"letter_credit",$$v);},expression:"form.custom_origin.letter_credit"}},[_c("option",{attrs:{value:"CRN"}},[_vm._v("Credit Card Number")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("Credit Card Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"CRI"}},[_vm._v("Credit Card Issuance Name")]),_vm._v(" "),_c("option",{attrs:{value:"GEN"}},[_vm._v("General Information")]),_vm._v(" "),_c("option",{attrs:{value:"GBL"}},[_vm._v("Government Bill of Lading")]),_vm._v(" "),_c("option",{attrs:{value:"STL"}},[_vm._v("Mode of Settlement")]),_vm._v(" "),_c("option",{attrs:{value:"RET"}},[_vm._v("Return to Origin")]),_vm._v(" "),_c("option",{attrs:{value:"SRN"}},[_vm._v("Shipper's Reference Number")])])],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Shipment Reference Infomation"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Shipment Reference Information")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Shipment Reference Number:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("shipment_ref_no")},staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.shipment_ref_no,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"shipment_ref_no",$$v);},expression:"form.custom_origin.shipment_ref_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"shipment_ref_no"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Supplementary Shipment Information:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info",$$v);},expression:"form.custom_origin.supplementary_shipment_info"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info_line_2")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info_line_2,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info_line_2",$$v);},expression:"form.custom_origin.supplementary_shipment_info_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info_line_2"}})],1)])])]),_vm._v(" "),_c("b-tab",{attrs:{title:"IATA and Cass"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Override IATA And Cass:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","abel-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"IATA:"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_code,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_code",$$v);},expression:"iata_cass.iata_agent_code"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Cass:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_cass,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_cass",$$v);},expression:"iata_cass.iata_agent_cass"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_iata_login_later,callback:function callback($$v){_vm.$set(_vm.form,"is_iata_login_later",$$v);},expression:"form.is_iata_login_later"}},[_vm._v("Save information for later logins")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Agent Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Agent information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"align-items-center mb-6 mb-md-0 mb-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Override Issuing Agent:")])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_name,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_name",$$v);},expression:"agent_information.agent_name"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_address,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_address",$$v);},expression:"agent_information.agent_address"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"150px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_city,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_city",$$v);},expression:"agent_information.agent_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"150px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_pincode,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_pincode",$$v);},expression:"agent_information.agent_pincode"}})],1)]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Signature:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_issue_sign,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_issue_sign",$$v);},expression:"agent_information.agent_issue_sign"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Location Code:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_issue",staticClass:"custom-dropdown",on:{click:function click($event){return _vm.toggleDropdown("issue");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_loc_code,expression:"agent_information.agent_issue_loc_code"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("agent_issue_loc_code")},staticStyle:{width:"170px"},attrs:{type:"text",placeholder:"Search location",id:"agent_issue_loc_code",autocomplete:"off"},domProps:{value:_vm.agent_information.agent_issue_loc_code},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_loc_code",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="issue"&&_vm.getFilteredLocations(_vm.agent_information.agent_issue_loc_code).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.agent_information.agent_issue_loc_code),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("agent_issue_loc_code",item,"agent_information");}}},[_vm._v("\n                                                                                    "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                                ")]);}),0):_vm._e()])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Date:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_date,expression:"agent_information.agent_issue_date"}],staticClass:"form-control-sm form-control mr-2",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-horizontal"},domProps:{value:_vm.agent_information.agent_issue_date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_date",$event.target.value);}}}),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"agent_information.agent_issue_date");}}})],1)]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Account:")])])];},proxy:true}])},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_account,expression:"agent_information.agent_account"}],staticClass:"form-control-sm form-control",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-horizontal"},domProps:{value:_vm.agent_information.agent_account},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_account",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"align-items-center mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Senders Reference:")])]),_vm._v(" "),_c("div",{staticClass:"d-flex mb-6"},[_c("div",{staticStyle:{padding:"0px 20px"}},[_c("b-form-radio",{staticStyle:{"font-size":"14px"},attrs:{name:"participate",size:"sm",value:"0"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Participant")])],1),_vm._v(" "),_c("div",{staticStyle:{padding:"0px 20px"}},[_c("b-form-radio",{staticStyle:{"font-size":"14px"},attrs:{name:"participate",size:"sm",value:"1"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Office")])],1)]),_vm._v(" "),_vm.agent_information.participate==="0"?_c("div",[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Airport:")])])];},proxy:true}],null,false,1576548421)},[_vm._v(" "),_c("div",{ref:"dropdownContainer_participant",staticClass:"custom-dropdown dropdown-container",on:{click:function click($event){return _vm.toggleDropdown("participant");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.participate_airport,expression:"agent_information.participate_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("participate_airport")},attrs:{type:"text",placeholder:"Search location",id:"participant",autocomplete:"off"},domProps:{value:_vm.agent_information.participate_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"participate_airport",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="participant"&&_vm.getFilteredLocations(_vm.agent_information.participate_airport).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.agent_information.participate_airport),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("participate_airport",item,"agent_information");}}},[_vm._v("\n                                                                                        "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"participate_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Identifer:")])])];},proxy:true}],null,false,3583013676)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.agent_information.prticipant_identifer,callback:function callback($$v){_vm.$set(_vm.agent_information,"prticipant_identifer",$$v);},expression:"agent_information.prticipant_identifer"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"AIR"}},[_vm._v("Airline AIR")]),_vm._v(" "),_c("option",{attrs:{value:"APT"}},[_vm._v("Airport Authority APT")]),_vm._v(" "),_c("option",{attrs:{value:"AGT"}},[_vm._v("Agent AGT")]),_vm._v(" "),_c("option",{attrs:{value:"BRK"}},[_vm._v("Broker BRK")]),_vm._v(" "),_c("option",{attrs:{value:"CAG"}},[_vm._v("Commissionable Agent CAG")]),_vm._v(" "),_c("option",{attrs:{value:"CNE"}},[_vm._v("Consignee CNE")]),_vm._v(" "),_c("option",{attrs:{value:"CTM"}},[_vm._v("Customs CTM")]),_vm._v(" "),_c("option",{attrs:{value:"DCL"}},[_vm._v("Declarant DCL")]),_vm._v(" "),_c("option",{attrs:{value:"DEC"}},[_vm._v("Deconsolidator DEC")]),_vm._v(" "),_c("option",{attrs:{value:"FFW"}},[_vm._v("Freight Forwarder FFW")]),_vm._v(" "),_c("option",{attrs:{value:"GHA"}},[_vm._v("Ground Handling Agent GHA")]),_vm._v(" "),_c("option",{attrs:{value:"PTT"}},[_vm._v("Post Office PTT")]),_vm._v(" "),_c("option",{attrs:{value:"SHP"}},[_vm._v("Shipper SHP")]),_vm._v(" "),_c("option",{attrs:{value:"TRK"}},[_vm._v("Trucker TRK")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Code:")])])];},proxy:true}],null,false,1003838827)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.participant_code,callback:function callback($$v){_vm.$set(_vm.agent_information,"participant_code",$$v);},expression:"agent_information.participant_code"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Office File Reference:")])])];},proxy:true}],null,false,3658579412)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.office_file_reference,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_file_reference",$$v);},expression:"agent_information.office_file_reference"}})],1)],1):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("div",[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Airport:")])])];},proxy:true}],null,false,991607196)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.agent_information.office_airport,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_airport",$$v);},expression:"agent_information.office_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"BLR"}},[_vm._v("BLR, Bangalore (BLR), India")]),_vm._v(" "),_c("option",{attrs:{value:"AAE"}},[_vm._v("AAE, Annaba (AAE), Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AAH"}},[_vm._v("AAH, Aachen (AAH), Germany")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Function Designator:")])])];},proxy:true}],null,false,3374126151)},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_function_designator,expression:"agent_information.office_function_designator"}],staticClass:"form-control",staticStyle:{width:"250px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_function_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_function_designator",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Company Designator:")])])];},proxy:true}],null,false,4157542050)},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_company_designator,expression:"agent_information.office_company_designator"}],staticClass:"form-control",staticStyle:{width:"250px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_company_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_company_designator",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office File Reference:")])])];},proxy:true}],null,false,1672574578)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.office_file_reference,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_file_reference",$$v);},expression:"agent_information.office_file_reference"}})],1)],1):_vm._e()])],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Also Notify"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Also Notify")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-notify"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Name:")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_alsoNotify",staticClass:"align-items-center custom-dropdown mr-4",on:{click:function click($event){return _vm.toggleDropdown("alsoNotify");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.also_notify_address.also_name,expression:"form.also_notify_address.also_name"}],staticClass:"form-control-sm form-control","class":{"is-invalid":_vm.form.errors.has("also_name")},staticStyle:{width:"315px"},attrs:{type:"text",placeholder:"Search name",id:"also_notify",autocomplete:"off"},domProps:{value:_vm.form.also_notify_address.also_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.also_notify_address,"also_name",$event.target.value);},_vm.filteralsoNotify],focus:function focus($event){return _vm.toggleDropdown("alsoNotify",true);}}}),_vm._v(" "),_vm.activeDropdown==="alsoNotify"&&_vm.filteredAlsoNotify.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredAlsoNotify,function(also_notify,index){return _c("div",{key:also_notify.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectAlsoNotifyA(also_notify);}}},[_vm._v("\n                                                                                        "+_vm._s(also_notify.name)+"\n                                                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Letter Of Credit")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_name_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_name_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_name_2",$$v);},expression:"form.also_notify_address.also_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address",$$v);},expression:"form.also_notify_address.also_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address_line_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address_line_2",$$v);},expression:"form.also_notify_address.also_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address_line_2"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-5","class":{"is-invalid":_vm.form.errors.has("also_city")},staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_city,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_city",$$v);},expression:"form.also_notify_address.also_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_airport_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_airport_code",$$v);},expression:"form.also_notify_address.also_airport_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Post Code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_post_code")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_post_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_post_code",$$v);},expression:"form.also_notify_address.also_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_state")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_state,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_state",$$v);},expression:"form.also_notify_address.also_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_country")},staticStyle:{width:"315px"},model:{value:_vm.form.also_notify_address.also_country,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_country",$$v);},expression:"form.also_notify_address.also_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                                "+_vm._s(country.text)+"\n                                                                            ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Phone:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_phone")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_phone,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_phone",$$v);},expression:"form.also_notify_address.also_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Fax:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_fax")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_fax,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_fax",$$v);},expression:"form.also_notify_address.also_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Telex:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_telex,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_telex",$$v);},expression:"form.also_notify_address.also_telex"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_also_notify_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_also_notify_address_save",$$v);},expression:"form.is_also_notify_address_save"}},[_vm._v(" Save new address to address book")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Exta Print Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Extra information printed of Air Way Bill (Only printed - not saved or sent\n                                                            to Airlines):")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-textarea",{staticStyle:{width:"500px",height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.extra_print,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"extra_print",$$v);},expression:"form.custom_origin.extra_print"}})],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Carrier Address"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Override the Carrier Address on the PDF Document")]),_vm._v(" "),_c("h6",{staticStyle:{"font-size":"12px","font-weight":"500"}},[_vm._v("(This can be used for non-IATA carriers)")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"align-items-center mt-5"},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{staticClass:"mr-4",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Carrier Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Public Address")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Carrier Prefix:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("City:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"230px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"60px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Country:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"}})],1)],1)])],1)],1)])])],1)],1)])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color"},[_vm._v("Other Charges:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm other-charges-entry-table",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Code")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v("Amount In INR")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-5 editable-cell align-items-center",staticStyle:{width:"300px","vertical-align":"middle"}},[_c("b-form-group",{staticClass:"d-flex align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.other_charges.other_charge_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_charge_code",$$v);},expression:"other_charges.other_charge_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select an Other Charge Code")]),_vm._v(" "),_vm._l(_vm.other_charges_code,function(charge){return _c("option",{key:charge.value,domProps:{value:charge.value}},[_vm._v("\n                                                                         "+_vm._s(charge.text)+"\n                                                                     ")]);})],2)],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center"},[_c("span",[_vm._v("Or:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"40px"},attrs:{id:"input-horizontal",placeholder:"Or code"},model:{value:_vm.other_charges.other_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_code",$$v);},expression:"other_charges.other_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"80px"},attrs:{placeholder:"Amount"},model:{value:_vm.other_charges.amount,callback:function callback($$v){_vm.$set(_vm.other_charges,"amount",$$v);},expression:"other_charges.amount"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"A"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Agent")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"C"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Carrier")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"P"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Prepaid")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"C"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Collect")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell align-items-center charge-btn-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.addCharge}},[_vm._v("\n                                                                         "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                     ")])],1)],1)])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("table",{staticClass:"table table-sm",staticStyle:{width:"auto"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticClass:"py-3 px-4",staticStyle:{color:"#355594","font-weight":"700"},attrs:{colspan:"3"}},[_vm._v("Calculated Charges")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-4 pb-2 pr-3 editable-cell",staticStyle:{"vertical-align":"middle","white-space":"nowrap",width:"1%","font-weight":"600",color:"#475569"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("td",{staticClass:"pt-4 pb-2 pr-3 editable-cell",staticStyle:{width:"1%"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.chargable_weight1,expression:"other_charges.chargable_weight1"}],staticClass:"form-control form-control-sm",staticStyle:{width:"110px","vertical-align":"middle"},attrs:{type:"text"},domProps:{value:_vm.other_charges.chargable_weight1},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"chargable_weight1",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"pt-4 pb-2 editable-cell"})]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"py-2 pr-3 editable-cell",staticStyle:{"vertical-align":"middle","white-space":"nowrap",width:"1%","font-weight":"600",color:"#475569"}},[_vm._v("Charge")]),_vm._v(" "),_c("td",{staticClass:"py-2 pr-3 editable-cell",staticStyle:{width:"1%","vertical-align":"middle"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.charge,expression:"other_charges.charge"}],staticClass:"form-control form-control-sm",staticStyle:{width:"110px","vertical-align":"middle"},attrs:{type:"text"},domProps:{value:_vm.other_charges.charge},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"charge",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"py-2 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-button",{staticClass:"show-btn px-4 py-1",staticStyle:{"font-size":"0.85rem"},on:{click:_vm.calculateCharge}},[_vm._v("Calculate")])],1)])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Code")]),_vm._v(" "),_c("th",{},[_vm._v("Due")]),_vm._v(" "),_c("th",{},[_vm._v("Amount")]),_vm._v(" "),_c("th",{},[_vm._v("Type Of Payment")]),_vm._v(" "),_c("th",{},[_vm._v("Actions")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.charges,function(charge,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.other_charge_code||charge.other_code)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.due)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.amount)+".00\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.payment_type)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.editCharge(index);}}},[_c("b-icon",{attrs:{icon:"pencil","font-scale":"1"}})],1),_vm._v(" "),_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.removeCharge(index);}}},[_c("b-icon",{attrs:{icon:"trash"}})],1)],1)]);}),0)])])])])],1)],1)])]),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-tabs",{staticClass:"custom-nav"},[_c("b-tab",{attrs:{title:"Payment Information"}},[_c("b-row",[_c("b-col",{staticClass:"mb-6 mb-md-0 mb-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex align-items-center ml-3 mt-6",staticStyle:{"justify-content":"space-between","margin-bottom":"4px !important"}},[_c("div",{staticStyle:{"float":"left"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Type Of Payment:"}},[_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"205px"},model:{value:_vm.form.payment_info.type_of_payment,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"type_of_payment",$$v);},expression:"form.payment_info.type_of_payment"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("CA - Partial collect credit - partial prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"CB"}},[_vm._v("CB - Partial collect credit - partial prepaid credit")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CC - All charges collect")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("CG - All Charges collect by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("CP - Destination collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("CX - Destination collect credit")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("NC - Service rate. No charge")]),_vm._v(" "),_c("option",{attrs:{value:"PC"}},[_vm._v("PC - Partial prepaid cash - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PD"}},[_vm._v("PD - Partial prepaid credit - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("PG - All charges prepaid by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PP - All charges prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"PX"}},[_vm._v("PX - All charges prepaid credit")])])],1)],1),_vm._v(" "),_c("div",{staticStyle:{"float":"right"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex"},[_c("span",[_vm._v("Currency:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("currency")},staticStyle:{width:"60px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.currency,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"currency",$$v);},expression:"form.payment_info.currency"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"currency"}})],1)],1)]),_vm._v(" "),_c("div",{staticClass:"ml-3 mt-4 mb-4"},[_c("h6",{staticStyle:{"font-size":"13px","font-weight":"400"}},[_vm._v("Declared Values For:")])]),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Carriage:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_carriage,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_carriage",$$v);},expression:"form.payment_info.declear_value_carriage"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Customs:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_customs,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_customs",$$v);},expression:"form.payment_info.declear_value_customs"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Insurance:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_insurance,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_insurance",$$v);},expression:"form.payment_info.declear_value_insurance"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-end"},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Prepaid")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px",width:"100px"}},[_vm._v("Collect")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Weight Charge (WT)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.prepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.collect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Taxes (TX)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.taxes.toFixed(2))+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Agent (OA)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentPrepaid)+" INR\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentCollect)+" INR\n                                                                ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Carrier (OC)\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierPrepaid)+" INR\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierCollect)+" INR\n                                                                ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Total Charges")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChargesPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChrage)+" INR")])])])])])])])],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Special Handling Codes"}},[_c("b-row",[_c("div",{staticClass:"d-flex mt-6 ml-3"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("special_handling_code")},staticStyle:{width:"430px"},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select Special Handling Codes")]),_vm._v(" "),_vm._l(_vm.codes,function(code){return _c("option",{key:code.value,domProps:{value:code.value}},[_vm._v(_vm._s(code.text))]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_handling_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex"},[_c("span",[_vm._v("Or:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"60px"},attrs:{id:"input-horizontal"},model:{value:_vm.custom_special_handling_code,callback:function callback($$v){_vm.custom_special_handling_code=$$v;},expression:"custom_special_handling_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",attrs:{id:"input-horizontal",type:"button"},on:{click:_vm.addManualCode}},[_vm._v("Add")])],1)],1)],1)]),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-7"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("td",{staticClass:"editable-cell",staticStyle:{padding:"5px","font-size":"12px","font-weight":"400"}},[_vm._v("Code")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{padding:"5px","font-size":"12px","font-weight":"400"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.tableCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteSplCode(index);}}})],1)]);}),0)])])])],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Other Customs Information"}},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-6"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Customs Information:")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-start py-5"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Country Code:")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Information Identifier:")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Customs Information Identifier")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("country_code")},model:{value:_vm.oci_info.country_code,callback:function callback($$v){_vm.$set(_vm.oci_info,"country_code",$$v);},expression:"oci_info.country_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                                    "+_vm._s(country.text)+"\n                                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"country_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("info_identifier")},model:{value:_vm.oci_info.info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"info_identifier",$$v);},expression:"oci_info.info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_identifiers.identifiers,function(oci_option){return _c("option",{key:oci_option.value,domProps:{value:oci_option.value}},[_vm._v("\n                                                                                    "+_vm._s(oci_option.text)+"\n                                                                                ")]);}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"info_identifier"}})],2)],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("custom_info_identifier")},model:{value:_vm.oci_info.custom_info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"custom_info_identifier",$$v);},expression:"oci_info.custom_info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_data.oci_custom_info_identifier,function(oci_options){return _c("option",{key:oci_options.value,domProps:{value:oci_options.value}},[_vm._v("\n                                                                                    "+_vm._s(oci_options.text)+"\n                                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"custom_info_identifier"}})],1)],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell px-5"},[_vm._v("Supplementary Information:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell px-4"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.oci_info.supplementary_info,expression:"oci_info.supplementary_info"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_info")},staticStyle:{width:"300px"},attrs:{type:"text"},domProps:{value:_vm.oci_info.supplementary_info},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.oci_info,"supplementary_info",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_info"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label align-items-end justify-content-end",staticStyle:{display:"flex",width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.addOtherCustomInfo}},[_vm._v("\n                                                                                "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                            ")])],1)],1)])])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-4"},[_c("h6",{staticClass:"mb-4 h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Upload Other Customs Information:")]),_vm._v(" "),_c("b-form-textarea",{staticStyle:{width:"1000px !important",height:"80px"},attrs:{id:"textarea"}})],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-3 d-flex justify-content-end",staticStyle:{"max-width":"1000px"}},[_c("b-button",{staticClass:"show-btn px-5"},[_vm._v("Upload")])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-6"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"40%"}},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v("Other Customs\n                                                                    Information")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")])]),_vm._v(" "),_vm._l(_vm.form.oci_entries,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.country_code)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.info_identifier)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.custom_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.supplementary_info))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editOciInfo(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteOciInfo(index);}}})],1)]);})],2)])])])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-6 bottom-email-section mb-6"},[_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{staticClass:"text-left text-md-right",attrs:{cols:"12",md:"auto"}},[_c("div",{staticClass:"d-flex justify-content-start justify-content-md-end mb-3"},[_c("b-form-checkbox",{staticClass:"premium-checkbox",attrs:{size:"sm"}},[_vm._v("Including Cargo Label")])],1),_vm._v(" "),_c("div",{staticClass:"mb-3"},[_c("label",{staticClass:"font-weight-600 text-dark mb-1 d-block"},[_vm._v("Email FNA:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm fna-email-input",staticStyle:{width:"300px"},attrs:{id:"input-horizontal",placeholder:"Separate addresses with a semicolon ';'"},on:{input:_vm.handleAwbEmailInput},model:{value:_vm.form.awb_email,callback:function callback($$v){_vm.$set(_vm.form,"awb_email",$$v);},expression:"form.awb_email"}}),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-start justify-content-md-end mt-2"},[_c("b-form-checkbox",{staticClass:"premium-checkbox font-size-xs text-muted",attrs:{size:"sm"},on:{change:_vm.handleUseMyEmailChange},model:{value:_vm.use_my_email,callback:function callback($$v){_vm.use_my_email=$$v;},expression:"use_my_email"}},[_vm._v("\n                                                    Use my default FNA email\n                                                ")])],1)],1)])],1)],1),_vm._v(" "),_c("div",{staticClass:"py-10"},[_vm.pdf_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.pdf_error_msg)}})]):_vm._e(),_vm._v(" "),_vm.showSpinner?_c("div",{staticClass:"spin",staticStyle:{"margin-top":"20px"}}):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-between"},[_vm.is_generate_pdf?_c("div",{staticClass:"mb-24",staticStyle:{"box-shadow":"0px 3px 15px 0px #0013","border-radius":"12px",width:"100%"}},[_c("div",{staticStyle:{display:"flex",width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{display:"flex","justify-content":"start",color:"#355594","font-size":"15px","line-height":"71px","font-weight":"500",width:"100%"}},[_vm._v("Cargo document created")]),_vm._v(" "),_c("div",{staticStyle:{display:"flex","justify-content":"end","line-height":"71px","align-self":"center",width:"100%"},on:{click:function click($event){return _vm.isGeneratePdf(_vm.generateButton=0);}}},[_c("img",{staticStyle:{width:"24px",height:"24px",cursor:"pointer"},attrs:{src:"/media/assets/ui/cross.png",alt:"cross button"}})])]),_vm._v(" "),_c("div",{staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{width:"100%"}},[_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"13px","font-weight":"400",margin:"0"}},[_vm._v("Airway bill message saved in database")]),_vm._v(" "),_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"18px","font-weight":"400","border-bottom":"1px solid #CDCDCD","padding-bottom":"15px"}},[_vm._v("PDF documents prepared")])])]),_vm._v(" "),_c("div",{staticClass:"mb-16",staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click($event){$event.preventDefault();return _vm.handleSaveAndGeneratePDF("download-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("e-AWB Pdf file")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click($event){$event.preventDefault();return _vm.handleSaveAndGeneratePDF("download-multiple-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage e-AWB Pdf")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click($event){$event.preventDefault();return _vm.handleSaveAndGeneratePDF("download-multiple-both-page-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage e-AWB Pdf with back pages")])])])]):_vm._e()]),_vm._v(" "),_vm.main_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.main_error_msg)}})]):_vm._e(),_vm._v(" "),_vm.successMessage?_c("div",{staticStyle:{"font-weight":"bold",display:"flex","justify-content":"flex-end","text-align":"right"}},[_c("span",[_vm._v("\n                                        "+_vm._s(_vm.successMessage.split("-Pass")[0])+"\n                                        "),_c("span",{staticStyle:{color:"green"}},[_vm._v("-Pass")])])]):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end submit-button"},[_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"button"},on:{click:function click($event){_vm.isGeneratePdf(_vm.generateButton=1);_vm.form.status="generate_pdf";}}},[_vm._v("Generate PDF")]),_vm._v(" "),_vm.current_user.can_send?_c("div",[_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send")]),_vm._v(" "),_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send & Clear")])],1):_vm._e(),_vm._v(" "),_vm.form.first_box.status!="send"?_c("div",[_c("b-button",{staticClass:"show-btn",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="draft";}}},[_vm._v(_vm._s(_vm.submitButtonText))])],1):_vm._e()],1)])],1)])]],2)],1)]);};var staticRenderFns=[];render._withStripped=true;

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true");
/* harmony import */ var _FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");
/* harmony import */ var _FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "b6aec42e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/FocusAir.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");


/***/ })

}]);