(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_FocusAir_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/view/components/OcrUploadModal.vue */ "./resources/js/src/view/components/OcrUploadModal.vue");
/* harmony import */ var _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/view/components/DashboardHistoryModal.vue */ "./resources/js/src/view/components/DashboardHistoryModal.vue");
/* harmony import */ var _core_mixins_airWayBillMixin__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/core/mixins/airWayBillMixin */ "./resources/js/src/core/mixins/airWayBillMixin.js");
/* harmony import */ var _view_pages_dashboard_components_AddressBlock_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/view/pages/dashboard/components/AddressBlock.vue */ "./resources/js/src/view/pages/dashboard/components/AddressBlock.vue");
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
  mixins: [_core_mixins_airWayBillMixin__WEBPACK_IMPORTED_MODULE_8__["default"]],
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
        status: ''
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
          this.selectShipper(matchedShipper);
        } else {
          this.form.shipper_address.ship_name = shipper.name.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
          this.form.shipper_address.ship_address = shipper.address.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim();
          this.form.shipper_address.ship_city = shipper.city;
          this.form.shipper_address.ship_post_code = shipper.pin;
          this.form.shipper_address.ship_state = shipper.state;
          if (shipper.country) {
            var shipper_country_code = '';
            for (var c = 0; c < 252; c++) {
              if (this.countries[c] && this.countries[c].text.toLowerCase() == shipper.country.toLowerCase()) {
                shipper_country_code = this.countries[c].value;
                break;
              }
            }
            this.form.shipper_address.ship_country = shipper_country_code;
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
          this.selectConsignee(matchedConsignee);
        } else {
          this.form.consignee_address.cons_name = consignee.name.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
          this.form.consignee_address.cons_name_2 = consignee.eori;
          this.form.consignee_address.cons_address = consignee.address.replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim();
          this.form.consignee_address.cons_city = consignee.city;
          this.form.consignee_address.cons_post_code = consignee.pin;
          this.form.consignee_address.cons_state = consignee.state;
          if (consignee.country) {
            var consignee_country_code = '';
            for (var _c = 0; _c < 252; _c++) {
              if (this.countries[_c] && this.countries[_c].text.toLowerCase() == consignee.country.toLowerCase()) {
                consignee_country_code = this.countries[_c].value;
                break;
              }
            }
            this.form.consignee_address.cons_country = consignee_country_code;
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
    generateAwbPDF: function generateAwbPDF(pdf_generate_type) {
      this.generatePDFAfterSave = '';
      if (!this.existingData || !this.existingData.id) {
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
      });
    },
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
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-location").then(function (_ref6) {
        var data = _ref6.data;
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
        })["catch"](function (error) {});
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
        })["catch"](function (error) {});
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
        })["catch"](function (error) {});
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

      if (this.mode === 'add') {
        // Update the existing form with prepared data
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
      })["catch"](function (error) {})["finally"](function () {
        _this9.isFetching = false;
      });
    },
    getAirWayBill: function getAirWayBill(id) {
      var _this0 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        if (response.data && response.data.id == id) {
          _this0.existingData = response.data;
          _this0.existingData.payment_info = _objectSpread(_objectSpread({}, _this0.defaultPaymentInfo), _this0.existingData.payment_info || {});
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
        } else {
          _this1.existingData = null;
          _this1.showAWBSection = false;
          _this1.awbError = "No data found for this AWB ID.";
        }
      })["catch"](function (error) {
        var _error$response;
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
        this.form.payment_info = _objectSpread(_objectSpread({}, this.defaultPaymentInfo), this.existingData.payment_info || {});
        this.form.charges = Array.isArray(this.existingData.other_charge) ? this.existingData.other_charge : [];
        var entry = this.existingData.consignment_data;
        if (entry) {
          var parsedEntry = _objectSpread(_objectSpread({}, entry), {}, {
            hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
            itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
            uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : []
          });
          this.form.entries = [parsedEntry];
        } else {
          this.form.entries = []; // Default to an empty array if no data exists
        }
        if (!this.form.entries) {
          this.isConsignmentAdded = true;
        }
        this.form.consignee_address = this.existingData.way_bill_address;
        this.form.shipper_address = this.existingData.way_bill_address;
        this.form.also_notify_address = this.existingData.way_bill_address;
        this.form.awb_email = this.existingData.awb_email;
      } else {}
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
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/agent-info").then(function (_ref7) {
        var data = _ref7.data;
        if (Array.isArray(data) && data.length > 0) {
          _this10.agent_information = data[0];
          _this10.iata_cass = {
            iata_agent_code: _this10.agent_information.iata_agent_code || null,
            iata_agent_cass: _this10.agent_information.iata_agent_cass || null
          };
        } else {
          _this10.agent_information = data;
        }
      })["catch"](function (error) {});
    },
    getCountry: function getCountry() {
      var _this11 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-country').then(function (_ref8) {
        var data = _ref8.data;
        _this11.countries = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {});
    },
    getOtherChargesCode: function getOtherChargesCode() {
      var _this12 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/other-charges').then(function (_ref9) {
        var data = _ref9.data;
        _this12.other_charges_code = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {});
    },
    getOCIData: function getOCIData() {
      var _this13 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-oci-data').then(function (_ref0) {
        var data = _ref0.data;
        if (data && data.oci_custom_info_identifier) {
          _this13.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(function (_ref1) {
            var _ref10 = _slicedToArray(_ref1, 2),
              key = _ref10[0],
              value = _ref10[1];
            return {
              value: key,
              text: value
            };
          });
        } else {
          _this13.oci_data.oci_custom_info_identifier = [];
        }
        if (data && data.identifiers) {
          _this13.oci_identifiers.identifiers = Object.entries(data.identifiers).map(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
              key = _ref12[0],
              value = _ref12[1];
            return {
              value: key,
              text: value
            };
          });
        }
      })["catch"](function (error) {
        _this13.oci_data.oci_custom_info_identifier = [];
      });
    },
    handleRadioChange: function handleRadioChange(value) {
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
    onAWBInput: lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default()(function () {
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
        this.$router.go(0);
        this.getAirWayBill(this.awbId);
      }
    },
    reloadPageWithContent: function reloadPageWithContent() {
      var _this15 = this;
      var awbId = this.awbId;
      if (!awbId) {
        return;
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(awbId)).then(function (response) {
        _this15.existingData = response.data;
        if (_this15.existingData) {
          _this15.awbDetails = false;
          _this15.openForm('update', _this15.existingData.id);
          _this15.location.reload();
        } else {
          _this15.awbDetails = false;
        }
      })["catch"](function (error) {
        _this15.existingData = null;
        _this15.awbDetails = false;
      });
    }
  },
  mounted: function mounted() {
    this.calculateTotalVolume();
    this.getLocation();
    this.fetchAllAddressBook();
    this.fillShipperDetails();
    this.fillConsigneeDetails();
    this.fillAlsoNotifyDetails();
    this.getCountry();
    this.getOtherChargesCode();
    this.getOCIData();
    this.location = [];
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
    if (this.current_user) this.getAgent(this.current_user.company_name, this.current_user.branch_name);
  },
  watch: {
    'form.awb_email': function formAwb_email(val) {
      var savedEmail = localStorage.getItem('fna_default_email');
      this.use_my_email = !!(savedEmail && val === savedEmail);
    },
    '$route.params.id': function $routeParamsId(newId) {
      if (newId) {
        this.getAirWayBill(newId);
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
    DashboardHistoryModal: _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    OcrUploadModal: _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    AddressBlock: _view_pages_dashboard_components_AddressBlock_vue__WEBPACK_IMPORTED_MODULE_9__["default"],
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
    // PageLoader
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Shared shipper/consignee address block extracted from FocusAir.vue (Phase 4 dedup).
// Presentational only: all state + methods live on the parent (airWayBillMixin);
// the parent wires them in via props + events. Every shipper-vs-consignee
// difference — including inherited quirks (name_2 extra class, city inputs missing
// the *-form-control class on shipper, the airport field always bound to
// ship_airport_code, the country placeholder's leading space) — is a prop so the
// rendered output stays identical to the original inline markup.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AddressBlock",
  props: {
    title: {
      type: String,
      required: true
    },
    // "Shipper" / "Consignee"
    dropdownName: {
      type: String,
      required: true
    },
    // "shipper" / "consignee"
    prefix: {
      type: String,
      required: true
    },
    // "ship" / "cons"
    addressKey: {
      type: String,
      required: true
    },
    // "shipper_address" / "consignee_address"
    controlClass: {
      type: String,
      required: true
    },
    // "shipper-form-control" / "consignee-form-control"
    cityControlClass: {
      type: String,
      "default": ""
    },
    // "" for shipper, "consignee-form-control" for consignee
    searchId: {
      type: String,
      required: true
    },
    // input id for the search box
    searchPlaceholder: {
      type: String,
      required: true
    },
    // "Search shipper" / "Search consignee"
    name2Id: {
      type: String,
      required: true
    },
    // id for the name_2 input
    name2ExtraClass: {
      type: String,
      "default": ""
    },
    // "ship_name_2" for shipper, "" for consignee
    countryPlaceholder: {
      type: String,
      "default": "Please select one"
    },
    form: {
      type: Object,
      required: true
    },
    // the vform (errors + validation)
    address: {
      type: Object,
      required: true
    },
    // form.shipper_address / form.consignee_address
    countries: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    activeDropdown: {
      type: String,
      "default": null
    },
    filtered: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    show: {
      type: Boolean,
      "default": false
    },
    saveChecked: {
      type: Boolean,
      "default": false
    }
  },
  mounted: function mounted() {
    // Hand our dropdown's DOM node to the parent so the shared mixin's
    // closeAllDropdowns() (which looks up refs by name) keeps working now
    // that this markup no longer lives in the parent template.
    this.$emit("register-ref", this.dropdownName, this.$refs.dropdown);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=template&id=b055776a":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=template&id=b055776a ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-col", {
    attrs: {
      cols: "auto"
    }
  }, [_c("h4", {
    staticClass: "h-color ml-2"
  }, [_vm._v("\n        " + _vm._s(_vm.title) + "\n    ")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center pb-2"
  }, [_c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "label-for": "input-shipper"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Name:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    ref: "dropdown",
    staticClass: "custom-dropdown align-items-center",
    on: {
      click: function click($event) {
        return _vm.$emit("toggle", _vm.dropdownName);
      }
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.address[_vm.prefix + "_name"],
      expression: "address[prefix + '_name']"
    }],
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_name")
    }],
    attrs: {
      type: "text",
      placeholder: _vm.searchPlaceholder,
      id: _vm.searchId,
      autocomplete: "off"
    },
    domProps: {
      value: _vm.address[_vm.prefix + "_name"]
    },
    on: {
      input: [function ($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.address, _vm.prefix + "_name", $event.target.value);
      }, function ($event) {
        return _vm.$emit("filter");
      }],
      focus: function focus($event) {
        return _vm.$emit("toggle", _vm.dropdownName, true);
      }
    }
  }), _vm._v(" "), _vm.activeDropdown === _vm.dropdownName && _vm.filtered.length ? _c("div", {
    staticClass: "dropdown-options align-items-center"
  }, _vm._l(_vm.filtered, function (item, index) {
    return _c("div", {
      key: item.id,
      staticClass: "option",
      on: {
        click: function click($event) {
          $event.stopPropagation();
          return _vm.$emit("select", item);
        }
      }
    }, [_vm._v("\n                        " + _vm._s(item.name) + "\n                    ")]);
  }), 0) : _vm._e()]), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_name"
    }
  })], 1), _vm._v(" "), _c("b-icon", {
    staticClass: "ml-2",
    staticStyle: {
      color: "#355594",
      stroke: "#355594"
    },
    attrs: {
      icon: "box-arrow-up-right",
      "aria-hidden": "true"
    },
    on: {
      click: function click($event) {
        return _vm.$emit("update:show", !_vm.show);
      }
    }
  })], 1), _vm._v(" "), _vm.show ? _c("div", [_c("b-form-group", {
    staticClass: "pb-2 align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-lg": "auto",
      "content-cols-sm": "",
      "content-cols-lg": "auto",
      "label-for": _vm.name2Id
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v(" ")])])];
      },
      proxy: true
    }], null, false, 3600929531)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, _vm.name2ExtraClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_name_2")
    }],
    attrs: {
      id: _vm.name2Id,
      autocomplete: "off"
    },
    model: {
      value: _vm.address[_vm.prefix + "_name_2"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_name_2", $$v);
      },
      expression: "address[prefix + '_name_2']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_name_2"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Account:")])])];
      },
      proxy: true
    }], null, false, 2670409376)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_account")
    }],
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_account"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_account", $$v);
      },
      expression: "address[prefix + '_account']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_account"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Address:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 1954229067)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_address")
    }],
    attrs: {
      id: "input-horizontal"
    },
    on: {
      keydown: function keydown($event) {
        return _vm.$emit("limit", $event, _vm.addressKey + "." + _vm.prefix + "_address", 40);
      }
    },
    model: {
      value: _vm.address[_vm.prefix + "_address"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_address", $$v);
      },
      expression: "address[prefix + '_address']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_address"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v(" ")])])];
      },
      proxy: true
    }], null, false, 3600929531)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_address_line_2")
    }],
    attrs: {
      id: "input-horizontal"
    },
    on: {
      keydown: function keydown($event) {
        return _vm.$emit("limit", $event, _vm.addressKey + "." + _vm.prefix + "_address_line_2", 35);
      }
    },
    model: {
      value: _vm.address[_vm.prefix + "_address_line_2"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_address_line_2", $$v);
      },
      expression: "address[prefix + '_address_line_2']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_address_line_2"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("City:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 3712382874)
  }, [_vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center pb-2"
  }, [_c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.cityControlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_city")
    }],
    staticStyle: {
      width: "240px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_city"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_city", $$v);
      },
      expression: "address[prefix + '_city']"
    }
  }), _vm._v(" "), _c("b-form-input", {
    staticClass: "ml-3 form-control",
    "class": [_vm.cityControlClass, {
      "is-invalid": _vm.form.errors.has("ship_airport_code")
    }],
    staticStyle: {
      width: "50px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address.ship_airport_code,
      callback: function callback($$v) {
        _vm.$set(_vm.address, "ship_airport_code", $$v);
      },
      expression: "address.ship_airport_code"
    }
  })], 1), _vm._v(" "), _c("div", [_c("has-error", {
    "class": {
      "d-block": _vm.form.errors.has(_vm.prefix + "_city")
    },
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_city"
    }
  }), _vm._v(" "), _c("has-error", {
    "class": {
      "d-block": _vm.form.errors.has(_vm.prefix + "_airport_code")
    },
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_airport_code"
    }
  })], 1)]), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Post Code:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 3778114888)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_post_code")
    }],
    staticStyle: {
      width: "200px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_post_code"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_post_code", $$v);
      },
      expression: "address[prefix + '_post_code']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_post_code"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("State:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger"
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 560036906)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_state")
    }],
    staticStyle: {
      width: "200px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_state"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_state", $$v);
      },
      expression: "address[prefix + '_state']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_state"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Country:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }], null, false, 2615762453)
  }, [_vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_country")
    }],
    model: {
      value: _vm.address[_vm.prefix + "_country"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_country", $$v);
      },
      expression: "address[prefix + '_country']"
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v(_vm._s(_vm.countryPlaceholder))]), _vm._v(" "), _vm._l(_vm.countries, function (country) {
    return _c("option", {
      key: country.value,
      domProps: {
        value: country.value
      }
    }, [_vm._v("\n                    " + _vm._s(country.text) + "\n                ")]);
  })], 2), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_country"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Phone:")])])];
      },
      proxy: true
    }], null, false, 1623304669)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_phone")
    }],
    staticStyle: {
      width: "200px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_phone"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_phone", $$v);
      },
      expression: "address[prefix + '_phone']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_phone"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Fax:")])])];
      },
      proxy: true
    }], null, false, 4176059614)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": [_vm.controlClass, {
      "is-invalid": _vm.form.errors.has(_vm.prefix + "_fax")
    }],
    staticStyle: {
      width: "200px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_fax"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_fax", $$v);
      },
      expression: "address[prefix + '_fax']"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: _vm.prefix + "_fax"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "pb-2 align-items-center",
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
        return [_c("div", {
          staticClass: "shipper-toggle-label"
        }, [_c("span", [_vm._v("Telex:")])])];
      },
      proxy: true
    }], null, false, 1971532161)
  }, [_vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    "class": _vm.controlClass,
    staticStyle: {
      width: "200px"
    },
    attrs: {
      id: "input-horizontal"
    },
    model: {
      value: _vm.address[_vm.prefix + "_telex"],
      callback: function callback($$v) {
        _vm.$set(_vm.address, _vm.prefix + "_telex", $$v);
      },
      expression: "address[prefix + '_telex']"
    }
  })], 1), _vm._v(" "), _c("b-form-checkbox", {
    staticStyle: {
      "margin-left": "90px"
    },
    attrs: {
      size: "sm",
      checked: _vm.saveChecked
    },
    on: {
      change: function change($event) {
        return _vm.$emit("update:saveChecked", $event);
      }
    }
  }, [_vm._v(" Save new address to address book")])], 1) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");
/* harmony import */ var _FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");
/* harmony import */ var _FocusAir_vue_vue_type_custom_index_0_blockType_b_container_fluid_true_class_body_color__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=custom&index=0&blockType=b-container&fluid=true&class=body-color */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=custom&index=0&blockType=b-container&fluid=true&class=body-color");
/* harmony import */ var _FocusAir_vue_vue_type_custom_index_0_blockType_b_container_fluid_true_class_body_color__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_FocusAir_vue_vue_type_custom_index_0_blockType_b_container_fluid_true_class_body_color__WEBPACK_IMPORTED_MODULE_4__);
var render, staticRenderFns
;

;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  render,
  staticRenderFns,
  false,
  null,
  "b6aec42e",
  null
  
)

/* custom blocks */
;
if (typeof (_FocusAir_vue_vue_type_custom_index_0_blockType_b_container_fluid_true_class_body_color__WEBPACK_IMPORTED_MODULE_4___default()) === 'function') _FocusAir_vue_vue_type_custom_index_0_blockType_b_container_fluid_true_class_body_color__WEBPACK_IMPORTED_MODULE_4___default()(component)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/FocusAir.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/components/AddressBlock.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/components/AddressBlock.vue ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AddressBlock_vue_vue_type_template_id_b055776a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddressBlock.vue?vue&type=template&id=b055776a */ "./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=template&id=b055776a");
/* harmony import */ var _AddressBlock_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AddressBlock.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AddressBlock_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AddressBlock_vue_vue_type_template_id_b055776a__WEBPACK_IMPORTED_MODULE_0__.render,
  _AddressBlock_vue_vue_type_template_id_b055776a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/components/AddressBlock.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=script&lang=js":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressBlock_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AddressBlock.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressBlock_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=template&id=b055776a":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=template&id=b055776a ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressBlock_vue_vue_type_template_id_b055776a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressBlock_vue_vue_type_template_id_b055776a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AddressBlock_vue_vue_type_template_id_b055776a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AddressBlock.vue?vue&type=template&id=b055776a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/components/AddressBlock.vue?vue&type=template&id=b055776a");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=custom&index=0&blockType=b-container&fluid=true&class=body-color":
/*!**************************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=custom&index=0&blockType=b-container&fluid=true&class=body-color ***!
  \**************************************************************************************************************************************/
/***/ (() => {



/***/ })

}]);