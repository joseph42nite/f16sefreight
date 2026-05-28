"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_HouseWayBill_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/view/components/OcrUploadModal.vue */ "./resources/js/src/view/components/OcrUploadModal.vue");
/* harmony import */ var _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/view/components/DashboardHistoryModal.vue */ "./resources/js/src/view/components/DashboardHistoryModal.vue");
var _methods;
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
  data: function data() {
    return {
      mode: 'add',
      form: new Form({
        first_box: {
          hawb_no: '',
          awb_code: '',
          awb_no: ''
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
          master_origin: '',
          master_destination: '',
          date: this.getCurrentDate(),
          date_2: this.getCurrentDate(),
          date_3: this.getCurrentDate()
        },
        entries: [],
        oci_entries: [],
        tableCodes: [],
        charges: [],
        totals: {
          total_volume: null,
          total_amount: 0,
          master_pcs: null,
          master_weight: null,
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
        status: ''
      }),
      oci_info: {
        country_code: '',
        info_identifier: '',
        custom_info_identifier: '',
        supplementary_info: ''
      },
      consignment_list: new Form({
        pieces: null,
        description: '',
        rate_class: '',
        uld_rate_class: '',
        service_code: '',
        commodity_item: '',
        country_origin_goods: '',
        slac: '',
        hs_code: '',
        gross_weight: '',
        weight_code: 'KGM',
        //kgs/lbs
        chargable_weight: '',
        other_charge: '',
        rate: '',
        pcs: '',
        wgt: '',
        length: '',
        width: '',
        height: '',
        unit: 'CMT',
        volume: '',
        // dimention_unit: 'MTQ', //cm3,m3,ft3

        uld_type: '',
        uld_serial: '',
        owner: '',
        itemss: [],
        hsCodes: [],
        uld_infos: []
      }),
      agent_information: {
        agent_name: '',
        agent_address: '',
        agent_city: '',
        agent_pincode: '',
        agent_issue_sign: '',
        agent_issue_loc_code: '',
        agent_issue_date: '',
        agent_account: null,
        ho_name: '',
        ho_address: '',
        ho_city: '',
        ho_pincode: '',
        ho_state: '',
        ho_country: '',
        iata_agent_code: null,
        iata_agent_cass: null
      },
      other_charges: {
        other_charge_code: '',
        other_code: '',
        amount: '',
        due: "C",
        payment_type: "P",
        charge: '',
        chargable_weight1: ''
      },
      defaultPaymentInfo: {
        declear_value_carriage: 'NVD',
        declear_value_customs: 'NCV',
        declear_value_insurance: 'XXX',
        currency: 'INR'
      },
      selectedViewPageOption: '/house-way-bill',
      searchQuery_to: '',
      isDropdownOpen_to: false,
      isDropdownOpen_departure: false,
      isDropdownOpen_destination: false,
      isDropdownOpen_to2: false,
      isDropdownOpen_to3: false,
      isDropdownOpen_from: false,
      isDropdownOpen_shipper: false,
      isDropdownOpen_consignee: false,
      isDropdownOpen_alsoNotify: false,
      isDropdownOpen_issuing_loc: false,
      isDropdownOpen_participant: false,
      generatePDFAfterSave: false,
      selectedCode: '',
      custom_special_handling_code: '',
      manualCode: '',
      validationErrors: [],
      hs_code_error: [],
      uld_error: [],
      newHsCode: '',
      isOpen: false,
      showShipper: false,
      showConsignee: false,
      showCalculationTable: false,
      editIndex: null,
      edit_entry_index: null,
      existingData: [],
      data_items: [],
      isFetching: false,
      isUploading: false,
      oci_data: {},
      ///get-oci-data
      oci_identifiers: {},
      countries: [],
      other_charges_code: [],
      location: [],
      filteredShippers: [],
      filteredConsignees: [],
      filteredAlsoNotify: [],
      isConsignmentAdded: false,
      successMessage: '',
      awb_prefix_message: '',
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
      is_generate_pdf: 0,
      showSpinner: false // Initially, the progress bar is hidden
    };
  },
  methods: (_methods = {
    processExtractedData: function processExtractedData(response) {
      var _response$transit,
        _this = this;
      // Reset the form and UI states to clear any previously populated data
      this.form.reset();
      this.showShipper = false;
      this.showConsignee = false;
      this.isConsignmentAdded = false;
      console.log('Processing payload:', response);
      this.form.first_box.hawb_no = response.awb_number;

      // Routing Block
      var departure = response.departure;
      var destination = response.destination;
      var transit = (_response$transit = response.transit) === null || _response$transit === void 0 ? void 0 : _response$transit[0];

      // Populate Master inputs directly from captured OCR data
      if (departure) {
        this.form.routing_information.master_origin = departure;
      }
      if (destination) {
        this.form.routing_information.master_destination = destination;
      }
      if (departure && destination && transit) {
        var _transit$transit_airp, _transit$transit_airp2, _transit$transit_airp3, _transit$flights$, _transit$flights$2;
        var all_airport_short_code = [departure, destination, (_transit$transit_airp = transit.transit_airports) === null || _transit$transit_airp === void 0 ? void 0 : _transit$transit_airp[0], (_transit$transit_airp2 = transit.transit_airports) === null || _transit$transit_airp2 === void 0 ? void 0 : _transit$transit_airp2[1], (_transit$transit_airp3 = transit.transit_airports) === null || _transit$transit_airp3 === void 0 ? void 0 : _transit$transit_airp3[2]];
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].post("/user/get-airport-by-airport-code", {
          "airport_code": all_airport_short_code
        }).then(function (response2) {
          var _response2$data;
          response2 = ((_response2$data = response2.data) === null || _response2$data === void 0 ? void 0 : _response2$data.data) || [];
          if (response2[0]) {
            _this.form.routing_information.departure_airport = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
            _this.form.routing_information.from = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          }
          if (response2[1]) {
            _this.form.routing_information.destination_airport = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
          }
          if (response2[2]) {
            _this.form.routing_information.to = "".concat(response2[2]['iata_code'], ", ").concat(response2[2]['destination']);
          } else if (response2[1]) {
            _this.form.routing_information.to = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
          }
          if (transit.transit_airports && transit.transit_airports[1]) {
            if (response2[3]) {
              _this.form.routing_information.to_2 = "".concat(response2[3]['iata_code'], ", ").concat(response2[3]['destination']);
            } else if (response2[1]) {
              _this.form.routing_information.to_2 = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
            }
          }
          if (transit.transit_airports && transit.transit_airports[2]) {
            if (response2[1]) {
              _this.form.routing_information.to_3 = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
            }
          }
        });
        this.form.routing_information.by = (_transit$flights$ = transit.flights[0]) === null || _transit$flights$ === void 0 || (_transit$flights$ = _transit$flights$.flight_number) === null || _transit$flights$ === void 0 ? void 0 : _transit$flights$.slice(0, 2);
        this.form.routing_information.flight = (_transit$flights$2 = transit.flights[0]) === null || _transit$flights$2 === void 0 || (_transit$flights$2 = _transit$flights$2.flight_number) === null || _transit$flights$2 === void 0 ? void 0 : _transit$flights$2.slice(2);
        this.form.routing_information.date = this.formatDate(transit.flights[0].date);
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

      // Shipper details
      this.showShipper = true;
      var shipper = response.shipper;
      if (shipper) {
        this.form.shipper_address.ship_name = shipper.name;
        this.form.shipper_address.ship_address = shipper.address;
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

      // Consignee details
      this.showConsignee = true;
      var consignee = response.consignee;
      if (consignee) {
        this.form.consignee_address.cons_name = consignee.name;
        this.form.consignee_address.cons_name_2 = consignee.eori;
        this.form.consignee_address.cons_address = consignee.address;
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

      // Consignment Info
      var cargo_data = response.cargo;
      var piece_weight = response.piece_weight;
      var weight_charge = response.weight_charge;
      if (piece_weight) {
        var _piece_weight$rate_cl;
        var rate_class = piece_weight.rate_class ? piece_weight.rate_class.length > 2 ? piece_weight.rate_class.slice(2) : piece_weight.rate_class.slice(0) : null;
        this.consignment_list.rate_class = (_piece_weight$rate_cl = piece_weight.rate_class) === null || _piece_weight$rate_cl === void 0 ? void 0 : _piece_weight$rate_cl.slice(2);
        this.consignment_list.pieces = piece_weight.no_of_pieces;
        this.consignment_list.rate = piece_weight.rate;
        this.consignment_list.gross_weight = piece_weight.gross_weight;
        this.consignment_list.chargable_weight = piece_weight.chargeable_weight;
      }
      if (cargo_data) {
        this.consignment_list.hsCodes = cargo_data.hs_codes;
        this.consignment_list.description = cargo_data.description;
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

      // Payment remaining
      if (response.chrg_code) {
        this.form.payment_info.type_of_payment = response.chrg_code;
      }
    },
    formatDate: function formatDate(dateStr) {
      if (!dateStr) return this.getCurrentDate();
      var _dateStr$split = dateStr.split('-'),
        _dateStr$split2 = _slicedToArray(_dateStr$split, 3),
        day = _dateStr$split2[0],
        mon = _dateStr$split2[1],
        year = _dateStr$split2[2];
      var months = {
        JAN: '01',
        FEB: '02',
        MAR: '03',
        APR: '04',
        MAY: '05',
        JUN: '06',
        JUL: '07',
        AUG: '08',
        SEP: '09',
        OCT: '10',
        NOV: '11',
        DEC: '12'
      };
      return "".concat(year, "-").concat(months[mon], "-").concat(day.padStart(2, '0'));
    },
    //end of file upload code
    limitInput: function limitInput(event, fieldPath, maxLength) {
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
    validateTextarea: function validateTextarea() {
      var text = this.form.custom_origin.other_service_information || '';
      var lines = text.split(/\r?\n/);
      if (text.length > 195) this.form.custom_origin.other_service_information = text.slice(0, 195);
      if (lines.length > 3) {
        alert("You can add a maximum of three lines.");
        this.form.custom_origin.other_service_information = lines.slice(0, 3).join("\n");
      }
      this.charCount = this.form.custom_origin.other_service_information.length;
      this.lineCount = this.form.custom_origin.other_service_information.split(/\r?\n/).length;
    },
    onSelect: function onSelect(value) {
      // Redirect to the selected page
      if (value) {
        window.location.href = value; // This will navigate to the selected page
      }
    },
    isGeneratePdf: function isGeneratePdf(generateButton) {
      var _this2 = this;
      // alert("generateButton " + generateButton + "isGeneratePdf "+ this.is_generate_pdf);

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
    // handleSaveAndGeneratePDF() {
    //     this.generatePDFAfterSave = true;
    //     const result = this.onSubmit() || Promise.resolve({});
    //     result.then(response => {
    //         console.log('Save response:', response);
    //         console.log('Response Data:', response.data);
    //         if (response.data && response.data.data && response.data.data.id) {
    //             this.generateHawbPDF();
    //         } else {
    //             console.error('ID is missing in the response data');
    //         }
    //     }).catch(error => {
    //         console.error('Error while saving data:', error);
    //     });
    // },
    handleSaveAndGeneratePDF: function handleSaveAndGeneratePDF(pdf_generate_type) {
      this.generatePDFAfterSave = pdf_generate_type;
      var result = this.onSubmit() || Promise.resolve({});
      result.then(function (response) {
        if (response.data && response.data.data && response.data.data.id) {
          // this.generateAwbPDF(pdf_generate_type);
        } else {
          console.error('ID is missing in the response data');
        }
      })["catch"](function (error) {
        console.error('Error while saving data:', error);
      });
    },
    // generateHawbPDF() {
    //     if (!this.validateFormFields()) {
    //         return;
    //     }
    //     const itemId = this.$route.params.id; // Get the ID from the URL
    //     const pdfUrl = `/download-hawb-pdf/${itemId}`; // Construct the URL for the PDF
    //     window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    // },
    generateHawbPDF: function generateHawbPDF() {
      if (!this.existingData || !this.existingData.id) {
        console.error('Existing data ID is missing. Cannot generate PDF.');
        return;
      }
      var pdfUrl = "/download-hawb-pdf/".concat(this.existingData.id);
      window.open(pdfUrl, '_blank');
    },
    validateFormFields: function validateFormFields() {
      var requiredFields = {
        "HAWB Number is mandatory": this.form.first_box.hawb_no,
        "AWB prefix is mandatory": this.form.first_box.awb_code,
        // AWB prefix
        "AWB number is mandatory": this.form.first_box.awb_no,
        // AWB number
        "Shipper address is mandatory": this.form.shipper_address.ship_address,
        // Shipper address
        "Shipper city is mandatory": this.form.shipper_address.ship_address,
        // Shipper city
        "Consignee address is mandatory": this.form.consignee_address.cons_address,
        // Consignee address
        "Consignee city is mandatory": this.form.consignee_address.cons_city,
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
    handleEditNavigation: function handleEditNavigation(id) {
      this.$bvModal.hide('modal-s');
      var targetPath = "/edit-houseway-bill/".concat(id);
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(function () {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
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
    toggleModal: function toggleModal() {
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    handleOk: function handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
    },
    handleAddConsignment: function handleAddConsignment() {
      if (this.isConsignmentAdded) {
        this.$bvToast.toast('Consignment Information is already added.', {
          title: 'Information',
          variant: 'warning',
          solid: true
        });
      } else {
        this.$refs.modalConsignment.show();
        this.isConsignmentAdded = true;
      }
    },
    getCurrentDate: function getCurrentDate() {
      // const today = new Date();
      // const day = today.getDate().toString().padStart(2, '0');
      // const month = today.toLocaleString('en-GB', { month: 'short' });
      // return `${day}${month}`;
      return new Date().toLocaleDateString("en-CA");
    }
  }, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "formatDate", function formatDate(date) {
    // if (!date) return '';
    // const day = new Date(date).getDate().toString().padStart(2, '0');
    // const month = new Date(date).toLocaleString('en-GB', { month: 'short' });
    // return `${day}${month}`;
    return new Date(date).toLocaleDateString("en-CA");
  }), "handleDateChange", function handleDateChange(date, field) {
    var keys = field.split('.');
    var target = this;
    for (var i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }

    // Store the actual date value for backend processing
    target[keys[keys.length - 1]] = date;
  }), "issueDateChange", function issueDateChange(date) {
    this.form.agent_issue_date = this.formatDate(date);
  }), "prepareFormDataForSubmission", function prepareFormDataForSubmission() {
    var formData = _objectSpread({}, this.form);

    // Convert display dates back to proper format for backend
    if (formData.routing_information) {
      if (formData.routing_information.date && typeof formData.routing_information.date === 'string') {
        // If it's a formatted string like "02Sept", convert it back to proper date
        var date = new Date(formData.routing_information.date);
        if (!isNaN(date.getTime())) {
          formData.routing_information.date = date.toISOString().slice(0, 19).replace('T', ' ');
        }
      }
      if (formData.routing_information.date_2 && typeof formData.routing_information.date_2 === 'string') {
        if (formData.routing_information.date_2.length <= 10) {
          var _date = new Date(formData.routing_information.date_2);
          if (!isNaN(_date.getTime())) {
            formData.routing_information.date_2 = _date.toISOString().slice(0, 19).replace('T', ' ');
          }
        } else if (formData.routing_information.date_2 instanceof Date) {
          formData.routing_information.date_2 = formData.routing_information.date_2.toISOString().slice(0, 19).replace('T', ' ');
        }
      }
      if (formData.routing_information.date_3 && typeof formData.routing_information.date_3 === 'string') {
        if (formData.routing_information.date_3.length <= 10) {
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
  }), "onSubmit", function onSubmit() {
    var _this3 = this;
    $('.submit-button').css({
      'pointer-events': 'none',
      'opacity': '0.5'
    });
    this.main_error_msg = '';

    // Prepare form data for submission - convert display dates to proper format
    // const preparedFormData = this.prepareFormDataForSubmission();

    if (this.mode === 'add') {
      // Create a new Form instance with prepared data
      var form = new Form(_objectSpread({}, this.form));
      form.post('/user/create-houseway-bill').then(function (response) {
        $('.submit-button').css({
          'pointer-events': 'auto',
          'opacity': '1'
        });
        if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
          _this3.existingData = response.data.data.first_box.original.data;
          if (_this3.generatePDFAfterSave && _this3.existingData && _this3.existingData.id) {
            _this3.generateHawbPDF();
          }
          _this3.successMessage = '-e-HSWB Saved in database -Pass';
        } else {
          console.error('ID is missing in response data');
        }
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
              main_error_msg += "".concat(errors[field][0], "<br>");
            }
          }
        }
        _this3.main_error_msg = main_error_msg;
      });
    } else if (this.mode === 'update') {
      if (!this.existingData || !this.existingData.id) {
        console.error('Update Failed: existingData is missing or invalid');
        return;
      }

      // Create a new Form instance with prepared data for update
      var _form = new Form(_objectSpread({}, this.form));
      _form.put("/user/update-houseway-bill/".concat(this.existingData.id)).then(function (response) {
        $('.submit-button').css({
          'pointer-events': 'auto',
          'opacity': '1'
        });
        if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
          _this3.existingData = response.data.data.first_box.original.data;
          if (_this3.generatePDFAfterSave && _this3.existingData && _this3.existingData.id) {
            _this3.generateHawbPDF();
          }
          _this3.successMessage = '-e-HSWB Saved in database -Pass';
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
              main_error_msg += "".concat(errors[field][0], "<br>");
            }
          }
        }
        _this3.main_error_msg = main_error_msg;
        console.error('Update Failed:', error);
      });
    }
  }), "getHousewayBills", function getHousewayBills(status) {
    var _this4 = this;
    this.isFetching = true;
    this.data_items = []; // Clear current items to avoid stale data flicker
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-houseway-bills/".concat(status)).then(function (response) {
      _this4.data_items = response.data;
    })["catch"](function (error) {
      console.error("Failed to fetch items:", error);
    })["finally"](function () {
      _this4.isFetching = false;
    });
  }), "getHouseWayBill", function getHouseWayBill(id) {
    var _this5 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/houseway-bill/".concat(id)).then(function (response) {
      _this5.existingData = response.data;
      _this5.existingData.payment_info = _objectSpread(_objectSpread({}, _this5.defaultPaymentInfo), _this5.existingData.payment_info || {});
      _this5.openForm('update', _this5.existingData.id);
      if (_this5.existingData && _this5.existingData.consignment_data) {
        _this5.isConsignmentAdded = true;
      }
    })["catch"](function (error) {
      console.error("Failed to fetch data for updating:", error);
    });
  }), "openForm", function openForm(mode) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    this.mode = mode;
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
      this.form.oci_entries = Array.isArray(this.existingData.other_custom_information) ? this.existingData.other_custom_information : [];

      // this.form.payment_info = this.existingData.payment_info || {};
      this.form.payment_info = _objectSpread(_objectSpread({}, this.defaultPaymentInfo), this.existingData.payment_info || {});
      this.form.charges = Array.isArray(this.existingData.other_charge) ? this.existingData.other_charge : [];
      // this.form.entries = Array.isArray(this.existingData.consignment_data)
      //     ? this.existingData.consignment_data
      //     : [this.existingData.consignment_data];
      // console.log("Entries in form:", this.form.entries);

      // this.consignment_list = this.existingData.consignment_data;
      // this.form.entries = this.existingData.consignment_data;
      // console.log("entries", this.form.entries);
      var entry = this.existingData.consignment_data;
      var parsedEntry = _objectSpread(_objectSpread({}, entry), {}, {
        hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
        itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
        uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : []
      });
      this.form.entries = [parsedEntry];
      if (!this.form.entries) {
        this.isConsignmentAdded = true;
      }
      // console.log("hs code", parsedEntry);
      this.form.consignee_address = this.existingData.way_bill_address;
      this.form.shipper_address = this.existingData.way_bill_address;
      this.form.also_notify_address = this.existingData.way_bill_address;
    } else {
      // console.error('existingData is not an array:', this.existingData);
      // console.log("Add mode activated");
    }
  }), "getCountry", function getCountry() {
    var _this6 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-country').then(function (_ref6) {
      var data = _ref6.data;
      _this6.countries = Object.keys(data).map(function (key) {
        return {
          value: key,
          text: data[key]
        };
      });
    })["catch"](function (error) {
      console.error("Error fetching countries:", error);
    });
  }), "getLocation", function getLocation() {
    var _this7 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-location").then(function (_ref7) {
      var data = _ref7.data;
      _this7.location = data;
    });
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "getOtherChargesCode", function getOtherChargesCode() {
    var _this8 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/other-charges').then(function (_ref8) {
      var data = _ref8.data;
      _this8.other_charges_code = Object.keys(data).map(function (key) {
        return {
          value: key,
          text: data[key]
        };
      });
    })["catch"](function (error) {
      console.error("Error fetching countries:", error);
    });
  }), "getAgent", function getAgent() {
    var _this9 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/agent-info/").then(function (_ref9) {
      var data = _ref9.data;
      if (Array.isArray(data) && data.length > 0) {
        _this9.agent_information = data[0];
      } else {
        _this9.agent_information = data;
      }
    })["catch"](function (error) {
      console.error("Error fetching agent information:", error);
    });
  }), "fetchShippers", function fetchShippers() {
    var _this0 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shippers").then(function (response) {
      _this0.shippers = response.data;
      _this0.filteredShippers = _this0.shippers.filter(function (shipper) {
        return shipper.address_type === 'shipper_address';
      });
      // this.filteredShippers = this.shippers;
      // console.log('Shipper', response.data);
    });
  }), "fetchConsignee", function fetchConsignee() {
    var _this1 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shippers").then(function (response) {
      _this1.consignees = response.data;
      _this1.filteredConsignees = _this1.consignees.filter(function (consignee) {
        return consignee.address_type === 'consignee_address';
      });
      // this.filteredConsignees = this.consignees;
      // console.log('Shipper', response.data);
    });
  }), "fetchAlsoNotify", function fetchAlsoNotify() {
    var _this10 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shippers").then(function (response) {
      _this10.alsoNotify = response.data;
      // console.log("fgweuf", response.data);
      _this10.filteredAlsoNotify = _this10.alsoNotify.filter(function (also_notify) {
        return also_notify.address_type === 'also_notify_address';
      });
      // this.filteredConsignees = this.consignees;
      // console.log('Shipper', response.data);
    });
  }), "fillShipperDetails", function fillShipperDetails() {
    var _this11 = this;
    if (this.selectedShipper) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shipper-address?id=".concat(this.selectedShipper)).then(function (response) {
        _this11.form.shipper_address = response.data;
        // console.log('Shipper', response.data);
      })["catch"](function (error) {
        console.error('Error fetching shipper address:', error);
      });
    } else {
      this.form.shipper_address = {
        ship_name: '',
        ship_account: '',
        ship_address: '',
        ship_city: ''
      };
    }
  }), "fillConsigneeDetails", function fillConsigneeDetails() {
    var _this12 = this;
    if (this.selectedConsignee) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-consignee-address?id=".concat(this.selectedConsignee)).then(function (response) {
        _this12.form.consignee_address = response.data;
        // console.log('Consignee', response.data);
      })["catch"](function (error) {
        // console.error('Error fetching shipper address:', error);
      });
    } else {
      this.form.consignee_address = {
        cons_name: '',
        cons_account: '',
        cons_address: '',
        cons_city: ''
      };
    }
  }), "fillAlsoNotifyDetails", function fillAlsoNotifyDetails() {
    var _this13 = this;
    if (this.selectAlsoNotify) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-alsonotify-address?id=".concat(this.selectAlsoNotify)).then(function (response) {
        _this13.form.also_notify_address = response.data;
        // console.log('Also Notify address', response.data);
      })["catch"](function (error) {
        // console.error('Error fetching Also notify address address:', error);
      });
    } else {
      this.form.also_notify_address = {
        also_name: '',
        also_account: '',
        also_address: '',
        also_city: ''
      };
    }
  }), "getOCIData", function getOCIData() {
    var _this14 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-oci-data').then(function (_ref0) {
      var data = _ref0.data;
      if (data && data.oci_custom_info_identifier) {
        _this14.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(function (_ref1) {
          var _ref10 = _slicedToArray(_ref1, 2),
            key = _ref10[0],
            value = _ref10[1];
          return {
            value: key,
            text: value
          };
        });
      } else {
        _this14.oci_data.oci_custom_info_identifier = [];
      }
      if (data && data.identifiers) {
        _this14.oci_identifiers.identifiers = Object.entries(data.identifiers).map(function (_ref11) {
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
      console.error("Error fetching countries:", error);
      _this14.oci_data.oci_custom_info_identifier = [];
    });
  }), "addManualCode", function addManualCode() {
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "deleteSplCode", function deleteSplCode(index) {
    this.form.tableCodes.splice(index, 1);
  }), "getOriginCode", function getOriginCode(airportString) {
    if (airportString) {
      return airportString.split(',')[0];
    }
    return '';
  }), "getDestinationCode", function getDestinationCode(airportString) {
    if (airportString) {
      return airportString.split(',')[0];
    }
    return '';
  }), "calculateCharge", function calculateCharge() {
    var chargeRate = parseFloat(this.other_charges.charge);
    var weight = parseFloat(this.other_charges.chargable_weight1);
    if (!isNaN(weight) && this.other_charges.charge > 0 && !isNaN(chargeRate) && chargeRate > 0) {
      var calculatedAmount = weight * chargeRate;
      this.other_charges.amount = calculatedAmount.toFixed(2);
    } else {
      alert('Please enter valid numeric values for chargeable weight and charge rate.');
    }
  }), "editCharge", function editCharge(index) {
    this.editIndex = index;
    this.other_charges = _objectSpread({}, this.form.charges[index]);
    // this.editIndex = null;
  }), "removeCharge", function removeCharge(index) {
    this.form.charges.splice(index, 1);
  }), "editEntry", function editEntry(index) {
    // this.edit_entry_index = index;
    // this.consignment_list = { ...this.form.entries[index] };
    // this.$refs.modalConsignment.show();
    this.edit_entry_index = index;
    var consignment_data = this.form.entries[index];
    this.consignment_list.pieces = consignment_data.pieces;
    this.consignment_list.description = consignment_data.description;
    this.consignment_list.rate_class = consignment_data.rate_class;
    this.consignment_list.uld_rate_class = consignment_data.uld_rate_class;
    this.consignment_list.service_code = consignment_data.service_code;
    this.consignment_list.commodity_item = consignment_data.commodity_item;
    this.consignment_list.country_origin_goods = consignment_data.country_origin_goods;
    this.consignment_list.slac = consignment_data.slac;
    // this.consignment_list.hs_code = consignment_data.hs_code;
    this.consignment_list.gross_weight = consignment_data.gross_weight;
    this.consignment_list.weight_code = consignment_data.weight_code;
    this.consignment_list.chargable_weight = consignment_data.chargable_weight;
    this.consignment_list.rate = consignment_data.rate;
    // this.consignment_list.itemss = JSON.parse(consignment_data.pieces_info);
    // this.consignment_list.hsCodes = JSON.parse(consignment_data.hs_code);
    // this.consignment_list.uld_infos = JSON.parse(consignment_data.uld_info);
    this.consignment_list.itemss = consignment_data.pieces_info ? JSON.parse(consignment_data.pieces_info) : [];
    this.consignment_list.hsCodes = consignment_data.hs_code ? JSON.parse(consignment_data.hs_code) : [];
    this.consignment_list.uld_infos = consignment_data.uld_info ? JSON.parse(consignment_data.uld_info) : [];
    this.$refs.modalConsignment.show();
    this.isConsignmentAdded = true;
    this.calculateTotalAmount();
  }), "deleteEntry", function deleteEntry(index) {
    this.form.entries.splice(index, 1);
    this.calculateTotalVolume();
    this.calculateTotalAmount();
    if (this.form.entries.length === 0) {
      this.isConsignmentAdded = false;
    }
  }), "addOrUpdateEntry", function addOrUpdateEntry(evt) {
    var _this15 = this;
    evt.preventDefault();
    if (!(this.consignment_list instanceof Form)) {
      this.consignment_list = new Form(this.consignment_list);
    }
    this.consignment_list.post("/user/get-house-consignment-error").then(function (response) {
      var updatedEntry = _objectSpread(_objectSpread({}, _this15.consignment_list), {}, {
        uld_info: JSON.stringify(_this15.consignment_list.uld_infos),
        pieces_info: JSON.stringify(_this15.consignment_list.itemss),
        hs_code: JSON.stringify(_this15.consignment_list.hsCodes)
      });
      if (_this15.edit_entry_index !== null) {
        _this15.form.entries[_this15.edit_entry_index] = updatedEntry;
        // this.form.entries[this.edit_entry_index] = { ...this.consignment_list };
        // this.$set(this.form.entries, this.edit_entry_index, { ...this.consignment_list });
        _this15.edit_entry_index = null;
      } else {
        _this15.form.entries.push(updatedEntry);
        // this.form.entries.push({ ...this.consignment_list });
      }
      _this15.calculateTotalVolume();
      _this15.calculateTotalAmount();
      _this15.isConsignmentAdded = _this15.form.entries.length > 0;
      _this15.closeModal();
      //clear consignment_list data
      for (var key in _this15.consignment_list) {
        if (key != 'busy' && key != 'successful' && key != 'errors' && key != 'originalData') {
          if (_typeof(_this15.consignment_list[key]) === 'object') {
            _this15.consignment_list[key] = [];
          } else {
            _this15.consignment_list[key] = '';
          }
        }
      }
      _this15.isConsignmentAdded = _this15.form.entries.length > 0;
    })["catch"](function (error) {
      // console.error("There was an error with the consignment request:", error);
    });
  }), "calculateTotalVolume", function calculateTotalVolume() {
    var _this16 = this;
    var totalVolume = this.form.entries.reduce(function (total, entry) {
      return total + entry.itemss.reduce(function (entryTotal, item) {
        // Parse dimensions and pcs
        var length = parseFloat(item.length) || 0; // Length
        var width = parseFloat(item.width) || 0; // Width
        var height = parseFloat(item.height) || 0; // Height
        var pcs = parseFloat(item.pcs) || 0; // Pieces
        var dimensionUnit = item.unit; // Get the dimension unit (CMT, INH, FOT)
        var volumeInCMT = length * width * height * pcs / 1000000;
        var volumeInCM3, volumeInFt3, volumeInIn3, volumeInM3;
        if (dimensionUnit === 'CMT') {
          volumeInCM3 = volumeInCM3;
          volumeInCM3 = volumeInCMT * 1000000; // m³ to cm³
          volumeInFt3 = volumeInCMT * 35.3147; // m³ to ft³
          volumeInIn3 = volumeInCMT * 61023.7441; // m³ to in³
        } else if (dimensionUnit === 'INH') {
          var volumeInInch = length * width * height * pcs; // in³
          volumeInIn3 = volumeInInch; // Already in in³
          volumeInCM3 = volumeInInch * 16.387; // in³ to cm³
          volumeInFt3 = volumeInInch * 0.0005787037; // in³ to ft³
          volumeInM3 = volumeInInch * 0.000016387064; // in³ to m³
        } else if (dimensionUnit === 'FOT') {
          var volumeInFoot = length * width * height * pcs; // in ft³
          volumeInFt3 = volumeInFoot;
          volumeInCM3 = volumeInFoot * 28316.8466; // ft³ to cm³
          volumeInM3 = volumeInFoot * 0.0283168466; // ft³ to m³
          volumeInIn3 = volumeInFoot * 1728; // ft³ to in³
        }
        // let selectedUnit = this.form.entries.dimention_unit; 
        // let selectedUnit = this.consignment_list.dimention_unit; form.totals.
        var selectedUnit = _this16.form.totals.dimention_unit;
        var finalVolume = 0;
        switch (selectedUnit) {
          case 'CMQ':
            // cm³
            finalVolume = volumeInCM3;
            break;
          case 'MTQ':
            // m³
            finalVolume = volumeInM3 || volumeInCMT; // Use volumeInCMT directly if in m³
            break;
          case 'FTQ':
            // ft³
            finalVolume = volumeInFt3;
            break;
          case 'INQ':
            // in³
            finalVolume = volumeInIn3;
            break;
          default:
            finalVolume = volumeInCM3;
          // Default case
        }
        return entryTotal + finalVolume;
      }, 0);
    }, 0);

    // Set total volume in the form
    this.form.totals.total_volume = totalVolume.toFixed(2);
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "calculateTotalAmount", function calculateTotalAmount() {
    // const chargeableWeight = this.form.entries.reduce((total, entry) => {
    //     let weight = parseFloat(entry.chargable_weight) || 0;
    //     return total + weight;
    // }, 0);

    var chargeableWeight = this.consignment_list.chargable_weight;
    var rate_class = this.consignment_list.rate_class;
    var rates = 0;
    this.form.totals.total_amount = 0;
    if (rate_class === "B" || rate_class === "M") {
      this.form.totals.total_amount = parseFloat(this.consignment_list.rate) || 0;
      // this.form.totals.total_amount = this.consignment_list.rate || 0;
    } else if (rate_class === "P" || rate_class === "X") {
      this.form.totals.total_amount = 0;
    } else {
      // rates = parseFloat(this.form.entries.reduce((total, entry) => {
      //     return total + (parseFloat(entry.rate) || 0);
      // }, 0)) || 0;
      // this.form.totals.total_amount = chargeableWeight * rates;
      // console.log("test", this.form.totals.total_amount);
      this.form.totals.total_amount = chargeableWeight * this.consignment_list.rate;
    }
  }), "addHsCode", function addHsCode() {
    this.hs_code_error = [];
    var hsCodeRegex = /^[a-zA-Z0-9]+$/;
    if (!this.consignment_list.hs_code) {
      this.hs_code_error.push("This field is empty.");
    } else if (!hsCodeRegex.test(this.consignment_list.hs_code)) {
      this.hs_code_error.push("HS Code can only contain letters,numbers");
    } else if (this.consignment_list.hs_code.length < 6 || this.consignment_list.hs_code.length > 18) {
      this.hs_code_error.push("HS Code must be between 6 to 18 characters/digits.");
    } else {
      this.consignment_list.hsCodes.push(this.consignment_list.hs_code);
      this.consignment_list.hs_code = "";
    }
  }), "removeHsCode", function removeHsCode(index) {
    this.consignment_list.hs_code = '';
    if (confirm('Are you sure you want to delete this HS Code?')) {
      this.consignment_list.hsCodes.splice(index, 1);
    }
  }), "displayModal", function displayModal() {
    this.$refs.modalConsignment.show();
  }), "closeModal", function closeModal() {
    this.$refs.modalConsignment.hide();
  }), "handleModalClose", function handleModalClose() {
    // if (this.form.entries.length === 0) {
    //     this.isConsignmentAdded = false;
    // }
    this.isConsignmentAdded = this.form.entries.length > 0;
  }), "addUldInfo", function addUldInfo() {
    this.uld_error = [];
    var _this$consignment_lis = this.consignment_list,
      uld_type = _this$consignment_lis.uld_type,
      uld_serial = _this$consignment_lis.uld_serial,
      owner = _this$consignment_lis.owner;
    var regex = {
      uldType: /^[a-zA-Z][A-Za-z0-9]{2}$/,
      // ULD Type
      uldSerial: /^[A-Za-z0-9]\d{3,4}$/,
      // ULD Serial
      owner: /^[a-zA-Z0-9]{2}$/ // Owner
    };
    if (!uld_type) this.uld_error.push("ULD Type is required.");else if (!regex.uldType.test(uld_type)) this.uld_error.push("ULD Type must be 3 characters: 1 alphabetic and 2 alphanumeric.");
    if (!uld_serial) this.uld_error.push("ULD Serial is required.");else if (!regex.uldSerial.test(uld_serial)) this.uld_error.push("ULD Serial must be in the format 'mnnn(n)' where 'm' is an alpha character and 'n' is a digit.");
    if (!owner) this.uld_error.push("Owner is required.");else if (!regex.owner.test(owner)) this.uld_error.push("Owner must be exactly 2 characters long and can only contain letters and digits.");
    if (this.uld_error.length > 0) {
      return;
    }
    // Push validated data to uld_info
    this.consignment_list.uld_infos.push({
      uld_type: uld_type,
      uld_serial: uld_serial,
      owner: owner
    });
    this.consignment_list.uld_type = this.consignment_list.uld_serial = this.consignment_list.owner = "";
  }), "deleteUldInfo", function deleteUldInfo(index) {
    if (this.consignment_list.uld_infos && this.consignment_list.uld_infos.length > index) {
      this.consignment_list.uld_infos.splice(index, 1);
    }
  }), "editOciInfo", function editOciInfo(index) {
    this.editIndex = index;
    this.oci_info = _objectSpread({}, this.form.oci_entries[index]);
  }), "addOtherCustomInfo", function addOtherCustomInfo() {
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "addCharge", function addCharge() {
    var _this$other_charges = this.other_charges,
      other_charge_code = _this$other_charges.other_charge_code,
      other_code = _this$other_charges.other_code,
      amount = _this$other_charges.amount,
      due = _this$other_charges.due,
      payment_type = _this$other_charges.payment_type;
    var finalOtherChargeCode = other_code || other_charge_code;
    var finalOtherCode = other_code || null;
    if (!finalOtherChargeCode) {
      alert("Other charge code is mandatory.");
      return;
    }
    var parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Amount is mandatory and must be a valid number greater than 0.");
      return;
    }
    // const amount = parseFloat(this.other_charges.amount);
    // if (isNaN(amount) || amount <= 0) {
    //     alert("Amount is mandatory and must be a valid number greater than 0.");
    //     return;
    // }

    var chargeData = {
      // other_charge_code: this.other_charges.other_charge_code,
      // other_code: this.other_charges.other_code,
      // amount: parseFloat(this.other_charges.amount) || 0,
      other_charge_code: finalOtherChargeCode,
      amount: parsedAmount,
      due: this.other_charges.due,
      payment_type: this.other_charges.payment_type
    };
    if (this.editIndex !== null) {
      this.$set(this.form.charges, this.editIndex, chargeData);
      this.editIndex = null;
    } else {
      this.form.charges.push(chargeData);
      // console.log('Added new charge:', chargeData);
    }
    for (var key in this.other_charges) {
      if (this.other_charges.hasOwnProperty(key) && key !== 'due' && key !== 'payment_type') {
        this.other_charges[key] = '';
      }
    }
  }), "deleteOciInfo", function deleteOciInfo(index) {
    // this.oci_entries.splice(index, 1);
    if (this.form.oci_entries.length > index) {
      this.form.oci_entries.splice(index, 1);
    }
  }), "addPcsInfo", function addPcsInfo() {
    var _this17 = this;
    this.validationErrors = [];
    var rules = {
      pcs: {
        type: 'numeric',
        message: "PCS must be a valid number."
      },
      wgt: {
        type: 'numeric',
        min: 0.1,
        max: 9999999,
        message: "Weight must be between 0.1 and 9999999."
      },
      length: {
        type: 'regex',
        regex: /^[0-9]+$/,
        maxLength: 5,
        message: "Length must be a numeric value with a maximum of 5 digits."
      },
      width: {
        type: 'regex',
        regex: /^[0-9]+$/,
        maxLength: 5,
        message: "Width must be a numeric value with a maximum of 5 digits."
      },
      height: {
        type: 'regex',
        regex: /^[0-9]+$/,
        maxLength: 5,
        message: "Height must be a numeric value with a maximum of 5 digits."
      }
    };
    var _this$consignment_lis2 = this.consignment_list,
      pcs = _this$consignment_lis2.pcs,
      wgt = _this$consignment_lis2.wgt,
      length = _this$consignment_lis2.length,
      width = _this$consignment_lis2.width,
      height = _this$consignment_lis2.height,
      unit = _this$consignment_lis2.unit;
    if (this.remainingPieces <= 0) {
      this.validationErrors.push('All pieces are already added.');
      return;
    }
    if (pcs > this.remainingPieces) {
      this.validationErrors.push("You only need ".concat(this.remainingPieces, " more pieces to complete the total."));
      return;
    }
    if (!pcs) {
      this.validationErrors.push("When using dimensions or weight - pieces cannot be empty.");
    }
    // If any one dimension is added, all other dimensions are required
    if (length || width || height) {
      if (!length) {
        this.validationErrors.push("Please add length to the dimension");
      }
      if (!width) {
        this.validationErrors.push("Please add width to the dimension");
      }
      if (!height) {
        this.validationErrors.push("Please add height to the dimension");
      }
    }
    if (!length && !width && !height && !wgt) {
      this.validationErrors.push("Only pieces filled in, please add also weight (WGT) and/or dimensions.");
    }
    // Validate individual fields based on their rules
    Object.keys(rules).forEach(function (field) {
      var rule = rules[field];
      var value = _this17.consignment_list[field];
      if (value) {
        if (rule.type === 'numeric' && (isNaN(value) || value < rule.min || value > rule.max)) {
          _this17.validationErrors.push(rule.message);
        } else if (rule.type === 'regex' && (!rule.regex.test(value) || value.length > rule.maxLength)) {
          _this17.validationErrors.push(rule.message);
        }
      }
    });
    if (this.validationErrors.length > 0) {
      return;
    }
    this.consignment_list.itemss.push({
      pcs: pcs,
      wgt: wgt,
      length: length,
      width: width,
      height: height,
      unit: unit
    });
    // this.calculateTotalAmount();
    this.consignment_list.pcs = '';
    this.consignment_list.wgt = '';
    this.consignment_list.length = '';
    this.consignment_list.width = '';
    this.consignment_list.height = '';
    this.consignment_list.unit = 'CMT';
  }), "deletePcs", function deletePcs(index) {
    if (this.consignment_list.itemss.length > index) {
      this.consignment_list.itemss.splice(index, 1);
    }
  }), "calculateTotalCharges", function calculateTotalCharges() {
    this.form.totals.total_amount = this.calculateTotalAmount();
  }), "toggleDropdown_departure", function toggleDropdown_departure() {
    this.isDropdownOpen_departure = !this.isDropdownOpen_departure;
  }), "selectOption_departure", function selectOption_departure(item) {
    this.form.routing_information.departure_airport = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.departure_airport = final_set;
    this.isDropdownOpen_departure = false;
  }), "toggleDropdown_destination", function toggleDropdown_destination() {
    this.isDropdownOpen_destination = !this.isDropdownOpen_destination;
  }), "selectOption_destination", function selectOption_destination(item) {
    this.form.routing_information.destination_airport = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.destination_airport = final_set;
    this.isDropdownOpen_destination = false;
  }), "toggleDropdown_to", function toggleDropdown_to() {
    this.isDropdownOpen_to = !this.isDropdownOpen_to;
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "selectOption_to", function selectOption_to(item) {
    this.form.routing_information.to = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.to = final_set;
    this.isDropdownOpen_to = false;
  }), "toggleDropdown_to2", function toggleDropdown_to2() {
    this.isDropdownOpen_to2 = !this.isDropdownOpen_to2;
  }), "selectOption_to2", function selectOption_to2(item) {
    this.form.routing_information.to_2 = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.to_2 = final_set;
    this.isDropdownOpen_to2 = false;
  }), "toggleDropdown_to3", function toggleDropdown_to3() {
    this.isDropdownOpen_to3 = !this.isDropdownOpen_to3;
  }), "selectOption_to3", function selectOption_to3(item) {
    this.form.routing_information.to_3 = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.to_3 = final_set;
    this.isDropdownOpen_to3 = false;
  }), "toggleDropdown_from", function toggleDropdown_from() {
    this.isDropdownOpen_from = !this.isDropdownOpen_from;
  }), "selectOption_from", function selectOption_from(item) {
    this.form.routing_information.from = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.from = final_set;
    this.isDropdownOpen_from = false;
  }), "closeDropdown_to", function closeDropdown_to(event) {
    var dropdownContainer_to = this.$refs.dropdownContainer_to;
    if (!dropdownContainer_to.contains(event.target)) {
      this.isDropdownOpen_to = false;
    }
  }), "closeDropdown_to2", function closeDropdown_to2(event) {
    var dropdownContainer_to2 = this.$refs.dropdownContainer_to2;
    if (!dropdownContainer_to2.contains(event.target)) {
      this.isDropdownOpen_to2 = false;
    }
  }), "closeDropdown_to3", function closeDropdown_to3(event) {
    var dropdownContainer_to3 = this.$refs.dropdownContainer_to3;
    if (!dropdownContainer_to3.contains(event.target)) {
      this.isDropdownOpen_to3 = false;
    }
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "closeDropdown_departure", function closeDropdown_departure(event) {
    var dropdownContainer_de = this.$refs.dropdownContainer_departure;
    if (!dropdownContainer_de.contains(event.target)) {
      this.isDropdownOpen_departure = false;
    }
  }), "closeDropdown_destination", function closeDropdown_destination(event) {
    var dropdownContainer_des = this.$refs.dropdownContainer_destination;
    if (!dropdownContainer_des.contains(event.target)) {
      this.isDropdownOpen_destination = false;
    }
  }), "closeDropdown_from", function closeDropdown_from(event) {
    var dropdownContainer_from = this.$refs.dropdownContainer_from;
    if (!dropdownContainer_from.contains(event.target)) {
      this.isDropdownOpen_from = false;
    }
  }), "selectShipper", function selectShipper(shipper) {
    this.selectedShipper = shipper.id;
    this.form.shipper_address = shipper.name;
    // this.form.shipper_name = shipper.name;
    this.fillShipperDetails(shipper.id);
    this.isDropdownOpen_shipper = false;
  }), "toggleDropdown_shipper", function toggleDropdown_shipper(event) {
    this.isDropdownOpen_shipper = event;
  }), "closeDropdown_shipper", function closeDropdown_shipper(event) {
    var dropdownContainer_shipper = this.$refs.dropdownContainer_shipper;
    if (!dropdownContainer_shipper.contains(event.target)) {
      this.isDropdownOpen_shipper = false;
    }
  }), "filterShippers", function filterShippers() {
    // const query = this.form.shipper_name.toLowerCase();
    var query = this.form.shipper_address.ship_name.toLowerCase();
    if (!query) return this.shippers;
    return this.filteredShippers = this.shippers.filter(function (shipper) {
      return shipper.name.toLowerCase().includes(query);
    });
  }), "selectConsignee", function selectConsignee(consignee) {
    this.selectedConsignee = consignee.id;
    this.form.consignee_address = consignee.name;
    this.fillConsigneeDetails(consignee.id);
    this.isDropdownOpen_consignee = false;
  }), "toggleDropdown_consignee", function toggleDropdown_consignee(event) {
    this.isDropdownOpen_consignee = event;
  }), "closeDropdown_consignee", function closeDropdown_consignee(event) {
    var dropdownContainer_consignee = this.$refs.dropdownContainer_consignee;
    if (!dropdownContainer_consignee.contains(event.target)) {
      this.isDropdownOpen_consignee = false;
    }
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "filterConsignee", function filterConsignee() {
    var query = this.form.consignee_address.cons_name.toLowerCase();
    if (!query) return this.consignees;
    return this.filteredConsignees = this.consignees.filter(function (consignee) {
      return consignee.name.toLowerCase().includes(query);
    });
  }), "selectAlsoNotifyA", function selectAlsoNotifyA(also_notify) {
    this.selectAlsoNotify = also_notify.id;
    this.form.also_notify_address = also_notify.name;
    // this.form.shipper_name = shipper.name;
    this.fillAlsoNotifyDetails(also_notify.id);
    this.isDropdownOpen_alsoNotify = false;
  }), "toggleDropdown_alsoNotify", function toggleDropdown_alsoNotify(event) {
    this.isDropdownOpen_alsoNotify = event;
  }), "closeDropdown_alsoNotify", function closeDropdown_alsoNotify(event) {
    var dropdownContainer_alsoNotify = this.$refs.dropdownContainer_alsoNotify;
    if (!dropdownContainer_alsoNotify.contains(event.target)) {
      this.isDropdownOpen_alsoNotify = false;
    }
  }), "filteralsoNotify", function filteralsoNotify() {
    var query = this.form.also_notify_address.also_name.toLowerCase();
    if (!query) return this.alsoNotify;
    return this.filteredAlsoNotify = this.alsoNotify.filter(function (notify) {
      return notify.name.toLowerCase().includes(query);
    });
  }), "toggleDropdown_issuing_loc", function toggleDropdown_issuing_loc() {
    this.isDropdownOpen_issuing_loc = !this.isDropdownOpen_issuing_loc;
  }), "selectOption_issuing_loc", function selectOption_issuing_loc(item) {
    this.agent_information.agent_issue_loc_code = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.agent_information.agent_issue_loc_code = final_set;
    this.isDropdownOpen_issuing_loc = false;
  }), "closeDropdown_issue_location", function closeDropdown_issue_location(event) {
    var dropdownContainer_to = this.$refs.dropdownContainer_issue;
    if (!dropdownContainer_to.contains(event.target)) {
      this.isDropdownOpen_issuing_loc = false;
    }
  }), "validateNumericInput", function validateNumericInput(evt, field, maxLength) {
    evt = evt || window.event;
    var charCode = evt.which || evt.keyCode;
    if (charCode < 48 || charCode > 57) {
      evt.preventDefault();
    }
    if (this.form.first_box[field].length >= maxLength) {
      evt.preventDefault();
    }
  }), "onAWBInput", lodash_debounce__WEBPACK_IMPORTED_MODULE_3___default()(function () {
    var _this18 = this;
    var awb_code = this.form.first_box.awb_code;
    var awb_no = this.form.first_box.awb_no;
    if (awb_code && awb_code.length === 3) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-awbcode-prefix/".concat(awb_code)).then(function (response) {
        if (response.data) {
          var _response$data = response.data,
            name = _response$data.name,
            code = _response$data.code;
          _this18.awb_prefix_message = "Message will be sent to ".concat(name, " (").concat(code, ")");
        } else {
          _this18.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
        }
      })["catch"](function (error) {
        console.error("Error fetching AWB details:", error);
        _this18.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
      });
    } else {
      this.awb_prefix_message = "";
    }
  }, 500))),
  mounted: function mounted() {
    this.calculateTotalVolume();
    this.getCountry();
    window.addEventListener('click', this.closeDropdown_to);
    window.addEventListener('click', this.closeDropdown_to2);
    window.addEventListener('click', this.closeDropdown_to3);
    window.addEventListener('click', this.closeDropdown_from);
    window.addEventListener('click', this.closeDropdown_destination);
    window.addEventListener('click', this.closeDropdown_departure);
    window.addEventListener('click', this.closeDropdown_shipper);
    window.addEventListener('click', this.closeDropdown_consignee);
    window.addEventListener('click', this.closeDropdown_alsoNotify);
    window.addEventListener('click', this.closeDropdown_issue_location);
    this.getLocation();
    this.fetchShippers();
    this.fetchAlsoNotify();
    this.fillShipperDetails();
    this.fillConsigneeDetails();
    this.fillAlsoNotifyDetails();
    this.fetchConsignee();
    this.getOtherChargesCode();
    this.getOCIData();
    // const id = this.$route.params.id;
    // if (id) {
    // this.getHouseWayBill(id);
    // }
  },
  watch: {
    // 'consignment_list': function () {
    //     this.form.totals.total_amount = this.calculateTotalAmount();
    // },
    // 'consignment_list.dimention_unit': function() {
    //     this.calculateTotalVolume();
    // },
    'form.totals.dimention_unit': function formTotalsDimention_unit() {
      this.calculateTotalVolume();
    },
    'form.charges': {
      handler: function handler(newVal) {
        this.totalChargesPrepaid;
        this.totalChargesCollect;
        this.weightCharge;
        this.taxes;
        this.totalCharges;
        this.totalDueAgentPrepaid;
        this.totalDueAgentCollect;
        this.totalDueCarrierPrepaid;
        this.totalDueCarrierCollect;
      },
      deep: true
    },
    // 'form.payment_info.type_of_payment'(newVal) {
    //     this.calculateTotalCharges();
    // },
    totalChargesPrepaid: function totalChargesPrepaid(newVal) {
      this.form.payment_info.total_charges_prepaid = newVal;
    },
    totalChargesCollect: function totalChargesCollect(newVal) {
      this.form.payment_info.total_charges_collect = newVal;
    },
    weightCharge: function weightCharge(newVal) {
      this.form.payment_info.weight_charge = newVal;
    },
    taxes: function taxes(newVal) {
      this.form.payment_info.taxes = newVal;
    },
    totalCharges: function totalCharges(newVal) {
      this.form.payment_info.total_charges = newVal;
    },
    totalDueAgentPrepaid: function totalDueAgentPrepaid(newVal) {
      this.form.payment_info.other_charges_due_agent_prepaid = newVal;
    },
    totalDueAgentCollect: function totalDueAgentCollect(newVal) {
      this.form.payment_info.other_charges_due_agent_collect = newVal;
    },
    totalDueCarrierPrepaid: function totalDueCarrierPrepaid(newVal) {
      this.form.payment_info.other_charges_due_carrier_prepaid = newVal;
    },
    totalDueCarrierCollect: function totalDueCarrierCollect(newVal) {
      this.form.payment_info.other_charges_due_carrier_collect = newVal;
    },
    // 'agent_information.participate': function(newValue) {
    //     console.log('Participate value changed to:', newValue);
    // },
    "form.shipper_address.ship_name": function formShipper_addressShip_name(newVal) {
      if (!newVal) {
        this.selectedShipper = null;
        this.form.shipper_address = {
          ship_name: ""
        };
        this.filteredShippers = this.shippers;
      }
    },
    "form.consignee_address.cons_name": function formConsignee_addressCons_name(newVal) {
      if (!newVal) {
        this.selectedConsignee = null;
        this.form.consignee_address = {
          cons_name: ""
        };
        this.filteredConsignees = this.consignees;
      }
    },
    "form.also_notify_address.also_name": function formAlso_notify_addressAlso_name(newVal) {
      if (!newVal) {
        this.selectAlsoNotify = null;
        this.form.also_notify_address = {
          also_name: ""
        };
        this.filteredAlsoNotify = this.alsoNotify;
      }
    },
    '$route.params.id': function $routeParamsId(newId) {
      if (newId) {
        this.getHouseWayBill(newId);
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
      this.getHouseWayBill(id);
    }
    this.getOCIData();
    this.onSubmit = this.onSubmit.bind(this);
    // console.log("Current User:", this.current_user);
    if (this.current_user) this.getAgent(this.current_user.company_name, this.current_user.branch_name);
    // this.getAgent();
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_8__.mapGetters)({
    current_user: "currentUser"
  })), {}, {
    isPrepaid: function isPrepaid() {
      var prepaidTypes = ['PP'];
      return prepaidTypes.includes(this.form.payment_info.type_of_payment);
    },
    weightCharge: function weightCharge() {
      return parseFloat(this.form.totals.total_amount || 0);
    },
    taxes: function taxes() {
      return 0.00;
    },
    totalDueAgentPrepaid: function totalDueAgentPrepaid() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'A' && charge.payment_type === 'P';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueAgentCollect: function totalDueAgentCollect() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'A' && charge.payment_type === 'C';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueCarrierPrepaid: function totalDueCarrierPrepaid() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'C' && charge.payment_type === 'P';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueCarrierCollect: function totalDueCarrierCollect() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'C' && charge.payment_type === 'C';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalChargesPrepaid: function totalChargesPrepaid() {
      return ((this.isPrepaid ? this.weightCharge : 0) + parseFloat(this.totalDueAgentPrepaid) + parseFloat(this.totalDueCarrierPrepaid)).toFixed(2);
    },
    totalChargesCollect: function totalChargesCollect() {
      return ((this.isPrepaid ? 0 : this.weightCharge) + parseFloat(this.totalDueAgentCollect) + parseFloat(this.totalDueCarrierCollect)).toFixed(2);
    },
    totalChrage: function totalChrage() {
      return (this.weightCharge + parseFloat(this.totalDueAgentCollect) + parseFloat(this.totalDueCarrierCollect)).toFixed(2);
    },
    totalCharges: function totalCharges() {
      return {
        prepaid: this.isPrepaid ? this.weightCharge.toFixed(2) : '0.00',
        collect: this.isPrepaid ? '0.00' : this.weightCharge.toFixed(2)
      };
    },
    calculatedCharge: function calculatedCharge() {
      // return this.form.totals.total_amount.toFixed(2);
      return this.form.totals.total_amount;
    },
    submitButtonText: function submitButtonText() {
      return this.mode === 'add' ? 'Add Draft' : 'Update Draft';
    },
    filteredLocations_to: function filteredLocations_to() {
      var query = this.form.routing_information.to.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_to2: function filteredLocations_to2() {
      var query = this.form.routing_information.to_2.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_to3: function filteredLocations_to3() {
      var query = this.form.routing_information.to_3.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_from: function filteredLocations_from() {
      var query = this.form.routing_information.from.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_destination: function filteredLocations_destination() {
      var query = this.form.routing_information.destination_airport.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_departure: function filteredLocations_departure() {
      var query = this.form.routing_information.departure_airport.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_issuing: function filteredLocations_issuing() {
      var query = this.agent_information.agent_issue_loc_code.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    remainingPieces: function remainingPieces() {
      var totalAddedPieces = this.consignment_list.itemss.reduce(function (sum, item) {
        return sum + parseInt(item.pcs || 0);
      }, 0);
      return this.consignment_list.pieces - totalAddedPieces;
    }
  }),
  name: "HouseWayBill",
  components: {
    DashboardHistoryModal: _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    OcrUploadModal: _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
    // PageLoader
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render=function render(){var _vm=this,_c=_vm._self._c;return _c("b-container",{staticClass:"body-color",attrs:{fluid:""}},[_c("div",{staticClass:"d-flex flex-column flex-lg-row"},[_c("SideBar"),_vm._v(" "),_c("div",{staticStyle:{background:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.4)","box-shadow":"0 10px 30px rgba(53, 85, 148, 0.1)","z-index":"1","border-radius":"32px",width:"100%"}},[_c("div",{staticClass:"container py-8 px-10"},[_c("b-row",{staticClass:"align-items-center mb-8"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex flex-column"},[_c("span",{staticStyle:{"text-transform":"uppercase","letter-spacing":"2px","font-size":"0.85rem","font-weight":"700",color:"#355594",opacity:"0.6","margin-bottom":"0.5rem",display:"block"}},[_vm._v("Navigation")]),_vm._v(" "),_c("h6",{staticStyle:{color:"#355594","font-size":"26px !important","line-height":"34px !important","font-weight":"800 !important","letter-spacing":"-0.5px !important","margin-bottom":"1rem","font-family":"'Inter', sans-serif !important"}},[_vm._v("Documentation")]),_vm._v(" "),_c("b-form-group",{staticClass:"mb-0 nav-dropdown-group",attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{background:"#F0F7FF","border-radius":"12px",padding:"6px 16px",width:"fit-content",border:"1px solid #E6F0FF"}},[_c("b-icon",{staticStyle:{color:"#355594","font-size":"1.2rem","margin-right":"12px"},attrs:{icon:"folder2-open"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"180px",border:"0px !important",color:"#355594","font-weight":"600",background:"transparent",cursor:"pointer",outline:"none","box-shadow":"none","padding-left":"0"},on:{change:_vm.onSelect},model:{value:_vm.selectedViewPageOption,callback:function callback($$v){_vm.selectedViewPageOption=$$v;},expression:"selectedViewPageOption"}},[_c("option",{attrs:{value:"/focus-air"}},[_vm._v("Master Airway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/house-way-bill"}},[_vm._v("Houseway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/consolidation"}},[_vm._v("Consolidation")])])],1)])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-md-end flex-wrap",staticStyle:{gap:"12px","align-items":"center"}},[_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-draft",modifiers:{"modal-draft":true}}],staticClass:"show-btn",on:{click:function click($event){$event.preventDefault();return _vm.getHousewayBills("draft");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"file-earmark-text"}}),_c("b",{staticClass:"font-weight-bolder",staticStyle:{"font-size":"1.05rem"}},[_vm._v("Drafts")])],1),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-s",modifiers:{"modal-s":true}}],staticClass:"show-btn",on:{click:function click($event){$event.preventDefault();return _vm.getHousewayBills("send");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"clock-history"}}),_c("b",{staticClass:"font-weight-bolder",staticStyle:{"font-size":"1.05rem"}},[_vm._v("10 Latest")])],1),_vm._v(" "),_c("OcrUploadModal",{attrs:{category:"house_air"},on:{extracted:_vm.processExtractedData}})],1)]),_vm._v(" "),_c("DashboardHistoryModal",{attrs:{id:"modal-draft",title:"My Drafts",mode:"draft",docType:"house",items:_vm.data_items,isFetching:_vm.isFetching},on:{action:function action(item){return _vm.handleEditNavigation(item.id);}}}),_vm._v(" "),_c("DashboardHistoryModal",{attrs:{id:"modal-s",title:"Latest Messages",mode:"send",docType:"house",items:_vm.data_items,isFetching:_vm.isFetching},on:{action:function action(item){return _vm.handleEditNavigation(item.id);}}})],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),[_c("b-form",{on:{submit:function submit($event){$event.preventDefault();return _vm.onSubmit.apply(null,arguments);}}},[_c("div",{staticClass:"container py-8 px-6 px-sm-8 px-md-10"},[_c("div",{staticClass:"mx-2 mx-sm-8"},[_c("b-row",{staticClass:"mt-0 mb-4 mt-md-0 mb-md-10"},[_c("b-col",{attrs:{cols:"12",md:"6",lg:"5"}},[_c("div",{staticClass:"d-flex flex-column",staticStyle:{gap:"16px"}},[_c("div",[_c("b-form-group",{staticClass:"align-items-center mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"hawbNo-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticStyle:{width:"80px",display:"inline-block","text-align":"end","margin-right":"8px"}},[_c("span",[_vm._v("HAWB No:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control hawb-no-input","class":{"is-invalid":_vm.form.errors.has("hawb_no")},staticStyle:{width:"172px"},attrs:{id:"hawbNo-input"},model:{value:_vm.form.first_box.hawb_no,callback:function callback($$v){_vm.$set(_vm.form.first_box,"hawb_no",$$v);},expression:"form.first_box.hawb_no"}})],1),_vm._v(" "),_c("div",{staticStyle:{"margin-left":"88px"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("hawb_no")},attrs:{form:_vm.form,field:"hawb_no"}})],1)],1),_vm._v(" "),_c("div",[_c("b-form-group",{staticClass:"align-items-center mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"masterno-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticStyle:{width:"80px",display:"inline-block","text-align":"end","margin-right":"8px"}},[_c("span",[_vm._v("Master No:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"awb-flex-row"},[_c("b-form-input",{staticClass:"awb-code-input","class":{"is-invalid":_vm.form.errors.has("awb_code")},staticStyle:{width:"62px"},attrs:{id:"masterno-input"},on:{keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_code",3);},input:_vm.onAWBInput},model:{value:_vm.form.first_box.awb_code,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_code",$$v);},expression:"form.first_box.awb_code"}}),_vm._v(" "),_c("span",{staticStyle:{color:"#355594","font-weight":"bold"}},[_vm._v("-")]),_vm._v(" "),_c("b-form-input",{staticClass:"awb-no-input","class":{"is-invalid":_vm.form.errors.has("awb_no")},staticStyle:{width:"100px"},attrs:{id:"masterno-awb-input"},on:{keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_no",8);},input:_vm.onAWBInput},model:{value:_vm.form.first_box.awb_no,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_no",$$v);},expression:"form.first_box.awb_no"}})],1)]),_vm._v(" "),_c("div",{staticStyle:{"margin-left":"88px"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_code")},attrs:{form:_vm.form,field:"awb_code"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_no")},attrs:{form:_vm.form,field:"awb_no"}}),_vm._v(" "),_vm.awb_prefix_message?_c("p",{staticClass:"mt-2 mb-0 text-muted",staticStyle:{"font-weight":"400","font-size":"12px","line-height":"18px"}},[_vm._v(_vm._s(_vm.awb_prefix_message))]):_vm._e()],1)],1)])]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"4",lg:"5"}},[_c("b-form-group",{staticClass:"mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"agent-account-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("span",[_vm._v("Agent Account:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("agent_account")},staticStyle:{width:"200px"},attrs:{id:"agent-account-input"},model:{value:_vm.form.first_box.agent_account,callback:function callback($$v){_vm.$set(_vm.form.first_box,"agent_account",$$v);},expression:"form.first_box.agent_account"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-row error-msg-container"},[_c("div",{staticStyle:{width:"100%"}},[_vm.form.errors.has("agent_account")?_c("div",{staticClass:"text-danger"},[_vm._v("\n                                                "+_vm._s(_vm.form.errors.get("agent_account"))+"\n                                            ")]):_vm._e()])])],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"2",lg:"2"}},[_c("b-form-group",{staticClass:"mb-0"},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm"}},[_vm._v("e-CSD Status")])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"my-4 my-md-10"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                        Shipper\n                                    ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_shipper",staticClass:"custom-dropdown align-items-center",on:{click:_vm.toggleDropdown_shipper}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.shipper_address.ship_name,expression:"form.shipper_address.ship_name"}],staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_name")},attrs:{type:"text",placeholder:"Search shipper",id:"shipper",autocomplete:"off"},domProps:{value:_vm.form.shipper_address.ship_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.shipper_address,"ship_name",$event.target.value);},_vm.filterShippers],focus:function focus($event){return _vm.toggleDropdown_shipper(true);},blur:_vm.closeDropdown_shipper}}),_vm._v(" "),_vm.isDropdownOpen_shipper&&_vm.filteredShippers.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredShippers,function(shipper,index){return _c("div",{key:shipper.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectShipper(shipper);}}},[_vm._v("\n                                                     "+_vm._s(shipper.name)+"\n                                                 ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",staticStyle:{color:"#355594",stroke:"#355594"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showShipper=!_vm.showShipper;}}})],1),_vm._v(" "),_vm.showShipper?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-name-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control ship_name_2","class":{"is-invalid":_vm.form.errors.has("ship_name_2")},attrs:{id:"shipper-name-input"},model:{value:_vm.form.shipper_address.ship_name_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_name_2",$$v);},expression:"form.shipper_address.ship_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-account-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_account")},attrs:{id:"shipper-account-input"},model:{value:_vm.form.shipper_address.ship_account,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_account",$$v);},expression:"form.shipper_address.ship_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"ship-address-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}],null,false,3079987115)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address")},attrs:{id:"ship-address-input"},on:{keydown:function keydown($event){return _vm.limitInput($event,"shipper_address.ship_address",40);}},model:{value:_vm.form.shipper_address.ship_address,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address",$$v);},expression:"form.shipper_address.ship_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-address-line-2-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address_line_2")},attrs:{id:"shipper-address-line-2-input"},on:{keydown:function keydown($event){return _vm.limitInput($event,"shipper_address.ship_address_line_2",35);}},model:{value:_vm.form.shipper_address.ship_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address_line_2",$$v);},expression:"form.shipper_address.ship_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"ship-city-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}],null,false,2148761530)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("ship_city")},staticStyle:{width:"240px"},attrs:{id:"ship-city-input"},model:{value:_vm.form.shipper_address.ship_city,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_city",$$v);},expression:"form.shipper_address.ship_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"ship-airport-input"},model:{value:_vm.form.shipper_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_airport_code",$$v);},expression:"form.shipper_address.ship_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_city")},attrs:{form:_vm.form,field:"ship_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_airport_code")},attrs:{form:_vm.form,field:"ship_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-postcode-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Post Code:")])])];},proxy:true}],null,false,421275156)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_post_code")},staticStyle:{width:"200px"},attrs:{id:"shipper-postcode-input"},model:{value:_vm.form.shipper_address.ship_post_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_post_code",$$v);},expression:"form.shipper_address.ship_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-state-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")])])];},proxy:true}],null,false,2699717750)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_state")},staticStyle:{width:"200px"},attrs:{id:"shipper-state-input"},model:{value:_vm.form.shipper_address.ship_state,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_state",$$v);},expression:"form.shipper_address.ship_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-country-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}],null,false,805449333)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_country")},attrs:{id:"shipper-country-input"},model:{value:_vm.form.shipper_address.ship_country,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_country",$$v);},expression:"form.shipper_address.ship_country"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                     "+_vm._s(country.text)+"\n                                                 ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-phone-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_phone")},staticStyle:{width:"200px"},attrs:{id:"shipper-phone-input"},model:{value:_vm.form.shipper_address.ship_phone,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_phone",$$v);},expression:"form.shipper_address.ship_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-fax-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_fax")},staticStyle:{width:"200px"},attrs:{id:"shipper-fax-input"},model:{value:_vm.form.shipper_address.ship_fax,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_fax",$$v);},expression:"form.shipper_address.ship_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"shipper-telex-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control",staticStyle:{width:"200px"},attrs:{id:"shipper-telex-input"},model:{value:_vm.form.shipper_address.ship_telex,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_telex",$$v);},expression:"form.shipper_address.ship_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"70px"},attrs:{size:"sm"},model:{value:_vm.form.is_shipper_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_shipper_address_save",$$v);},expression:"form.is_shipper_address_save"}},[_vm._v("Save new address to address book")])],1):_vm._e()]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2 d-none d-md-block",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default house shipper for later logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                        Consignee\n                                    ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"consignee"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_consignee",staticClass:"custom-dropdown align-items-center",on:{click:_vm.toggleDropdown_consignee}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.consignee_address.cons_name,expression:"form.consignee_address.cons_name"}],staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name")},attrs:{type:"text",placeholder:"Search consignee",id:"consignee",autocomplete:"off"},domProps:{value:_vm.form.consignee_address.cons_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.consignee_address,"cons_name",$event.target.value);},_vm.filterConsignee],focus:function focus($event){return _vm.toggleDropdown_consignee(true);},blur:_vm.closeDropdown_consignee}}),_vm._v(" "),_vm.isDropdownOpen_consignee&&_vm.filteredConsignees.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredConsignees,function(consignee,index){return _c("div",{key:consignee.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectConsignee(consignee);}}},[_vm._v("\n                                                     "+_vm._s(consignee.name)+"\n                                                 ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",staticStyle:{color:"#355594",stroke:"#355594"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showConsignee=!_vm.showConsignee;}}})],1),_vm._v(" "),_vm.showConsignee?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-name-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name_2")},attrs:{id:"cons-name-input"},model:{value:_vm.form.consignee_address.cons_name_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_name_2",$$v);},expression:"form.consignee_address.cons_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-account-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_account")},attrs:{id:"cons-account-input"},model:{value:_vm.form.consignee_address.cons_account,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_account",$$v);},expression:"form.consignee_address.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-address-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}],null,false,3079987115)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address")},attrs:{id:"cons-address-input"},on:{keydown:function keydown($event){return _vm.limitInput($event,"consignee_address.cons_address",40);}},model:{value:_vm.form.consignee_address.cons_address,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address",$$v);},expression:"form.consignee_address.cons_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-address-line-2-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address_line_2")},attrs:{id:"cons-address-line-2-input"},on:{keydown:function keydown($event){return _vm.limitInput($event,"consignee_address.cons_address_line_2",35);}},model:{value:_vm.form.consignee_address.cons_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address_line_2",$$v);},expression:"form.consignee_address.cons_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}],null,false,2148761530)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_city")},staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_city,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_city",$$v);},expression:"form.consignee_address.cons_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_airport_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_airport_code",$$v);},expression:"form.consignee_address.cons_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_city")},attrs:{form:_vm.form,field:"cons_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_airport_code")},attrs:{form:_vm.form,field:"cons_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-post-code"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Post Code:")])])];},proxy:true}],null,false,421275156)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_post_code")},staticStyle:{width:"200px"},attrs:{id:"cons-post-code"},model:{value:_vm.form.consignee_address.cons_post_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_post_code",$$v);},expression:"form.consignee_address.cons_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-state-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")])])];},proxy:true}],null,false,2699717750)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_state")},staticStyle:{width:"200px"},attrs:{id:"cons-state-input"},model:{value:_vm.form.consignee_address.cons_state,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_state",$$v);},expression:"form.consignee_address.cons_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-country-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}],null,false,805449333)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_country")},model:{value:_vm.form.consignee_address.cons_country,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_country",$$v);},expression:"form.consignee_address.cons_country"}},[_c("option",{attrs:{value:"Please select one"}},[_vm._v(" Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                     "+_vm._s(country.text)+"\n                                                 ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-phone-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control",staticStyle:{width:"200px"},attrs:{id:"cons-phone-input"},model:{value:_vm.form.consignee_address.cons_phone,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_phone",$$v);},expression:"form.consignee_address.cons_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-fax-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_fax,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_fax",$$v);},expression:"form.consignee_address.cons_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"cons-telex-input"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control",staticStyle:{width:"200px"},attrs:{id:"cons-telex-input"},model:{value:_vm.form.consignee_address.cons_telex,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_telex",$$v);},expression:"form.consignee_address.cons_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-lg-35",attrs:{size:"sm"},model:{value:_vm.form.is_consignee_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_consignee_address_save",$$v);},expression:"form.is_consignee_address_save"}},[_vm._v("Save new address to address book")])],1):_vm._e()]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2 d-md-none",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default house shipper for later logins")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"mt-6"},[_c("b-tabs",{staticClass:"custom-nav-title",attrs:{"content-class":"mt-7"}},[_c("b-tab",{staticStyle:{"border-bottom":"0px !important"},attrs:{title:"Routing Information"}},[_c("b-row",{staticClass:"mt-8 mb-6"},[_c("b-col",{attrs:{cols:"12",lg:"4"}},[_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"departure"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Departure Airport:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_departure",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"220px !important"},on:{click:_vm.toggleDropdown_departure}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.departure_airport,expression:"form.routing_information.departure_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("departure_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search departure",id:"departure",autocomplete:"off"},domProps:{value:_vm.form.routing_information.departure_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"departure_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_departure&&_vm.filteredLocations_departure.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_departure,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_departure(item);}}},[_vm._v(_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("departure_airport")},attrs:{form:_vm.form,field:"departure_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"destination"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Destination Airport:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_destination",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"220px !important"},on:{click:_vm.toggleDropdown_destination}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.destination_airport,expression:"form.routing_information.destination_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("destination_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search destination",id:"destination",autocomplete:"off"},domProps:{value:_vm.form.routing_information.destination_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"destination_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_destination&&_vm.filteredLocations_destination.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_destination,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_destination(item);}}},[_vm._v("\n                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("destination_airport")},attrs:{form:_vm.form,field:"destination_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-master-origin"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Master Origin:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("master_origin")},staticStyle:{width:"220px !important"},attrs:{id:"input-master-origin"},model:{value:_vm.form.routing_information.master_origin,callback:function callback($$v){_vm.$set(_vm.form.routing_information,"master_origin",$$v);},expression:"form.routing_information.master_origin"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("master_origin")},attrs:{form:_vm.form,field:"master_origin"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-master-destination"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Master Destination:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("  *")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("master_destination")},staticStyle:{width:"220px !important"},attrs:{id:"input-master-destination"},model:{value:_vm.form.routing_information.master_destination,callback:function callback($$v){_vm.$set(_vm.form.routing_information,"master_destination",$$v);},expression:"form.routing_information.master_destination"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("master_destination")},attrs:{form:_vm.form,field:"master_destination"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-lg-0",attrs:{cols:"12",lg:"8"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table",staticStyle:{"max-width":"100%",width:"100%","min-width":"650px !important"}},[_c("thead",[_c("tr",{},[_c("th",{staticStyle:{color:"#355594",width:"8%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"21%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("From")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"21%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("To")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"11%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("By")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"14%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("Flight")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"20%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("Date")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"5%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important","font-weight":"500",color:"#475569"}},[_vm._v("Routing:"),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_from",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_from}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.from,expression:"form.routing_information.from"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("from")},attrs:{type:"text",placeholder:"Search destination",id:"from_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.from},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"from",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_from&&_vm.filteredLocations_from.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_from,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_from(item);}}},[_vm._v("\n                                                                            "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                        ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_to}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to,expression:"form.routing_information.to"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to")},attrs:{type:"text",placeholder:"Search destination",id:"to_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to&&_vm.filteredLocations_to.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to(item);}}},[_vm._v("\n                                                                            "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                        ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by,expression:"form.routing_information.by"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight,expression:"form.routing_information.flight"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date,expression:"form.routing_information.date"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date");}}})],1)]),_vm._v(" "),_vm.form.errors.has("from")||_vm.form.errors.has("to")||_vm.form.errors.has("by")||_vm.form.errors.has("flight")||_vm.form.errors.has("date")?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("from")},attrs:{form:_vm.form,field:"from"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("to")},attrs:{form:_vm.form,field:"to"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("by")},attrs:{form:_vm.form,field:"by"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("flight")},attrs:{form:_vm.form,field:"flight"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("date")},attrs:{form:_vm.form,field:"date"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important"}},[_vm._v(" ")])]):_vm._e(),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to2",staticClass:"custom-dropdown",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_to2}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_2,expression:"form.routing_information.to_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_2")},attrs:{type:"text",placeholder:"Search destination",id:"to2_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_2",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to2&&_vm.filteredLocations_to2.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to2,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to2(item);}}},[_vm._v("\n                                                                            "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                        ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_2"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_2,expression:"form.routing_information.by_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_2")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_2,expression:"form.routing_information.flight_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_2")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_2,expression:"form.routing_information.date_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_2")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_2");}}})],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to3",staticClass:"custom-dropdown",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_to3}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_3,expression:"form.routing_information.to_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_3")},attrs:{type:"text",placeholder:"Search destination",id:"to3_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_3",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to3&&_vm.filteredLocations_to3.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to3,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to3(item);}}},[_vm._v("\n                                                                            "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                        ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_3"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_3,expression:"form.routing_information.by_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_3")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_3,expression:"form.routing_information.flight_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_3")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_3,expression:"form.routing_information.date_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_3")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_3");}}})],1)])])])])])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("h6",{staticClass:"h-color mb-0"},[_vm._v("Consignment Rate Description")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-consignment",modifiers:{"modal-consignment":true}}],staticClass:"show-btn mt-5 mb-5",attrs:{disabled:_vm.isConsignmentAdded},on:{click:_vm.handleAddConsignment}},[_vm._v("Add Consignment Information")])],1)],1),_vm._v(" "),_c("b-modal",{ref:"modalConsignment",attrs:{id:"modal-consignment",title:"Consignment Information",size:"xl","ok-only":"","hide-footer":"",centered:"","modal-class":"premium-modal","title-class":"font-weight-bolder text-dark","header-class":"border-bottom-0 pb-0 px-5 pt-5"},on:{hide:_vm.handleModalClose}},[_c("b-row",[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("h6",{staticStyle:{color:"#0f2247","font-weight":"700","margin-bottom":"15px",background:"#e1e8f5",padding:"10px 14px","border-left":"4px solid #2c4d8c","border-radius":"4px","font-size":"14px","letter-spacing":"0.3px"}},[_vm._v("Pieces and Nature and Quantity of Goods")]),_vm._v(" "),_c("div",{},[_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Pieces"}},[_vm._v("Pieces")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("pieces")},staticStyle:{width:"100% !important","margin-bottom":"10px"},attrs:{id:"input-departure-airport"},model:{value:_vm.consignment_list.pieces,callback:function callback($$v){_vm.$set(_vm.consignment_list,"pieces",$$v);},expression:"consignment_list.pieces"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"pieces"}}),_vm._v(" "),_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Description7"}},[_vm._v("Description")]),_vm._v(" "),_c("b-form-textarea",{"class":{"is-invalid":_vm.consignment_list.errors.has("description")},staticStyle:{height:"70px",width:"100%","margin-bottom":"10px"},attrs:{id:"textarea"},model:{value:_vm.consignment_list.description,callback:function callback($$v){_vm.$set(_vm.consignment_list,"description",$$v);},expression:"consignment_list.description"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"description"}}),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Rate Class:")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Rate class:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("rate_class")},staticStyle:{"margin-bottom":"10px"},on:{change:_vm.calculateTotalAmount},model:{value:_vm.consignment_list.rate_class,callback:function callback($$v){_vm.$set(_vm.consignment_list,"rate_class",$$v);},expression:"consignment_list.rate_class"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("CB - Basic rate")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("CC - Specific commodity rate")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("CE - Unit load device additional rate")]),_vm._v(" "),_c("option",{attrs:{value:"K"}},[_vm._v("CK - Rate per kilogram")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("CM - Minimum charge")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("CN - Normal rate")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("CP - International priority service rate")]),_vm._v(" "),_c("option",{attrs:{value:"Q"}},[_vm._v("CQ - Quantity rate")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("CR - Class rate reduction")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("CS - Class rate surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v("CU - Unit load device basic charge or rate")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("CX - Unit load device additional info")]),_vm._v(" "),_c("option",{attrs:{value:"Y"}},[_vm._v("CY - Unit load device discount")]),_vm._v(" "),_c("option",{attrs:{value:"Z"}},[_vm._v("CZ - Mutually Defined")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate_class"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_rate_class,expression:"consignment_list.uld_rate_class"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("uld_rate_class")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_rate_class},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_rate_class",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"uld_rate_class"}})],1)]),_vm._v(" "),_vm.consignment_list.rate_class?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"},attrs:{colspan:"4"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center"},[_c("span",{staticClass:"mr-2"},[_vm._v("Charge:")]),_vm._v(" "),_c("input",{staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.calculatedCharge}})])])]):_vm._e(),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Service code")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Commodity Item")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("service_code")},staticStyle:{"margin-bottom":"10px"},model:{value:_vm.consignment_list.service_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"service_code",$$v);},expression:"consignment_list.service_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Service Code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Airport to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B - Service Cargo")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Company Material")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Door to Door")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Airport to Door")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Flight Specific")]),_vm._v(" "),_c("option",{attrs:{value:"G"}},[_vm._v("G - Door to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"H"}},[_vm._v("H - Company Mail")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Diplomatic Mail")]),_vm._v(" "),_c("option",{attrs:{value:"J"}},[_vm._v("J - Priority Service")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Small Package Service")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("R - Restricted")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - Substitue Truck")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Charter")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Express Service")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"service_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.commodity_item,expression:"consignment_list.commodity_item"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("commodity_item")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.commodity_item},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"commodity_item",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("\n                                                            Country Of Origin of Goods\n                                                        ")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Slac:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("country_origin_goods")},staticStyle:{"margin-bottom":"10px"},model:{value:_vm.consignment_list.country_origin_goods,callback:function callback($$v){_vm.$set(_vm.consignment_list,"country_origin_goods",$$v);},expression:"consignment_list.country_origin_goods"}},[_c("option",{attrs:{value:""}},[_vm._v(" Select a Country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                    "+_vm._s(country.text)+"\n                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"country_origin_goods"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.slac,expression:"consignment_list.slac"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("slac")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.slac},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"slac",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Hs Codes:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center"}},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.hs_code_error.length>0},staticStyle:{width:"100%","margin-right":"10px","margin-bottom":"10px"},attrs:{type:"text"},model:{value:_vm.consignment_list.hs_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"hs_code",$$v);},expression:"consignment_list.hs_code"}}),_vm._v(" "),_c("button",{staticClass:"show-btn",staticStyle:{"margin-bottom":"10px"},on:{click:_vm.addHsCode}},[_vm._v("Add")])],1),_vm._v(" "),_vm.hs_code_error.length?_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.hs_code_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)]):_vm._e()]),_vm._v(" "),_c("tr",{staticStyle:{"background-color":"#F8FAFC"}},[_c("th",{staticStyle:{color:"#8A99AD !important","font-weight":"500 !important","font-size":"11px !important","text-transform":"uppercase !important","letter-spacing":"0.5px !important",padding:"6px 2px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.05) !important"}},[_vm._v("HS Codes")])]),_vm._v(" "),_vm._l(_vm.consignment_list.hsCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",[_vm._v(" "+_vm._s(code)+" ")]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.removeHsCode(index);}}})],1)]);})],2)])])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("h6",{staticStyle:{color:"#0f2247","font-weight":"700","margin-bottom":"25px",background:"#e1e8f5",padding:"10px 14px","border-left":"4px solid #2c4d8c","border-radius":"4px","font-size":"14px","letter-spacing":"0.3px"}},[_vm._v("Weight and Dimensions")]),_vm._v(" "),_c("div",{},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Gross Weight")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Rate")])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.gross_weight,expression:"consignment_list.gross_weight"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("gross_weight")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"gross_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"gross_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("weight_code")},model:{value:_vm.consignment_list.weight_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"weight_code",$$v);},expression:"consignment_list.weight_code"}},[_c("option",{attrs:{value:"KGM"}},[_vm._v("Kgs")]),_vm._v(" "),_c("option",{attrs:{value:"LBR"}},[_vm._v("Lbs")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"weight_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.chargable_weight,expression:"consignment_list.chargable_weight"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("chargable_weight")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.chargable_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"chargable_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"chargable_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.rate,expression:"consignment_list.rate"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("rate")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.rate},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"rate",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate"}})],1)])])])]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Pcs")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Wgt")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Length")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Width")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Height")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Unit")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.pcs,expression:"consignment_list.pcs"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.pcs},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"pcs",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.wgt,expression:"consignment_list.wgt"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.wgt},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"wgt",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.length,expression:"consignment_list.length"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.length},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"length",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.width,expression:"consignment_list.width"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.width},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"width",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.height,expression:"consignment_list.height"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.height},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"height",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100",model:{value:_vm.consignment_list.unit,callback:function callback($$v){_vm.$set(_vm.consignment_list,"unit",$$v);},expression:"consignment_list.unit"}},[_c("option",{attrs:{value:"CMT"}},[_vm._v("CMT")]),_vm._v(" "),_c("option",{attrs:{value:"INH"}},[_vm._v("INH")]),_vm._v(" "),_c("option",{attrs:{value:"FOT"}},[_vm._v("FOT")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addPcsInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.validationErrors.length>0?_c("tr",[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"7"}},[_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.validationErrors,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])])]):_vm._e()])])]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table-lightweight"},[_c("thead",[_c("tr",[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.itemss,function(row,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(row.pcs))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.wgt)+" "+_vm._s(_vm.consignment_list.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.length))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.width))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.height))]),_vm._v(" "),_c("td",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",{staticClass:"mr-3"},[_vm._v(_vm._s(row.unit))]),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deletePcs(index);}}})],1)]);}),0)])]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Volume")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-input",{staticClass:"form-control w-100",attrs:{id:"input-horizontal"},model:{value:_vm.consignment_list.volume,callback:function callback($$v){_vm.$set(_vm.consignment_list,"volume",$$v);},expression:"consignment_list.volume"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100",model:{value:this.form.entries.dimention_unit,callback:function callback($$v){_vm.$set(this.form.entries,"dimention_unit",$$v);},expression:"this.form.entries.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1)])])])])]),_vm._v(" "),_c("h5",{staticClass:"mt-10 mb-2",staticStyle:{"font-size":"13px","font-weight":"500"}},[_vm._v("ULD Information")]),_vm._v(" "),_c("div",{},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_type,expression:"consignment_list.uld_type"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_type},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_type",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_serial,expression:"consignment_list.uld_serial"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_serial},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_serial",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-8"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.owner,expression:"consignment_list.owner"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.owner},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"owner",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addUldInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.uld_error.length?_c("tr",{staticStyle:{color:"red"}},[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"4"}},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.uld_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])]):_vm._e()])])]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table-lightweight"},[_c("thead",[_c("tr",[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.uld_infos,function(row,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(row.uld_type))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.uld_serial))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.owner))]),_vm._v(" "),_c("td",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteUldInfo(index);}}})],1)]);}),0)])])])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addOrUpdateEntry}},[_vm._v("\n                                        "+_vm._s(_vm.edit_entry_index!==null?"Update":"Add")+"\n                                    ")])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Pcs.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Description")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Srv. Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Com. Itm.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Gross Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Chrg. Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Rate")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Detailed Pcs. Info")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Vol.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("UID Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Charge")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("HS Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Origin Country")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("UID information")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Slac")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.entries,function(entry,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(entry.pieces))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.description))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.service_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.commodity_item))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.gross_weight)+", "+_vm._s(entry.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.chargable_weight))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate))]),_vm._v(" "),_c("td",_vm._l(entry.itemss,function(pcs,pcsIndex){return _c("div",{key:pcsIndex,staticClass:"mb-1"},[_vm._v("\n                                                            "+_vm._s(pcs.pcs)+"-"+_vm._s(pcs.wgt)+"-"+_vm._s(pcs.weight_code)+"-"+_vm._s(pcs.length)+"x"+_vm._s(pcs.width)+"x"+_vm._s(pcs.height)+"-"+_vm._s(pcs.unit)+"\n                                                        ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.volume))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.uld_rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(_vm.form.totals.total_amount))]),_vm._v(" "),_c("td",_vm._l(entry.hsCodes,function(hs,hsIndex){return _c("div",{key:hsIndex,staticClass:"mb-1"},[_vm._v("\n                                                            "+_vm._s(hs)+"\n                                                        ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.country_origin_goods))]),_vm._v(" "),_c("td",_vm._l(entry.uld_infos,function(uld,uldIndex){return _c("div",{key:uldIndex,staticClass:"mb-1"},[_vm._v("\n                                                            "+_vm._s(uld.uld_type)+"-"+_vm._s(uld.uld_serial)+"-"+_vm._s(uld.owner)+"\n                                                        ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.slac))]),_vm._v(" "),_c("td",{staticClass:"d-flex align-items-center"},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editEntry(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteEntry(index);}}})],1)]);}),0)])])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-center justify-content-end mb-5 mt-5"},[_c("b-row",[_c("b-col",{staticClass:"mr-28",attrs:{cols:"12"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-total-volumn"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"92px"}},[_c("span",[_vm._v("Total Volume:")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"140px"},attrs:{id:"input-total-volumn"},model:{value:_vm.form.totals.total_volume,callback:function callback($$v){_vm.$set(_vm.form.totals,"total_volume",$$v);},expression:"form.totals.total_volume"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control ml-2",staticStyle:{width:"60px"},attrs:{"label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto"},model:{value:_vm.form.totals.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form.totals,"dimention_unit",$$v);},expression:"form.totals.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1)]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-total-amount"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"92px"}},[_c("span",[_vm._v("Total Amount:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"140px"},attrs:{id:"input-total-amount",value:_vm.calculatedCharge}})],1),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-master-pcs"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"92px"}},[_c("span",[_vm._v("Master Pcs:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("master_pcs")},staticStyle:{width:"140px"},attrs:{id:"input-master-pcs"},model:{value:_vm.form.totals.master_pcs,callback:function callback($$v){_vm.$set(_vm.form.totals,"master_pcs",$$v);},expression:"form.totals.master_pcs"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"master_pcs"}})],1),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-master-weight"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"92px"}},[_c("span",[_vm._v("Master Weight:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("master_weight")},staticStyle:{width:"140px"},attrs:{id:"input-master-weight"},model:{value:_vm.form.totals.master_weight,callback:function callback($$v){_vm.$set(_vm.form.totals,"master_weight",$$v);},expression:"form.totals.master_weight"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"master_weight"}})],1)],1)],1)],1)])],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"mt-2 text-bold justify-content-lg-start",staticStyle:{"font-size":"16px","font-weight":"600"},attrs:{size:"lg",id:"agreed"}},[_vm._v("As Agreed")])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-6 mb-10 ml-4 mr-4"},[_c("h6",{staticClass:"h-color mb-6"},[_vm._v("Customs Origin Code:")]),_vm._v(" "),_c("b-form-group",{staticStyle:{"max-width":"450px",width:"100%"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("customs_origin_code")},model:{value:_vm.form.custom_origin.customs_origin_code,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"customs_origin_code",$$v);},expression:"form.custom_origin.customs_origin_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select another charge code")]),_vm._v(" "),_c("option",{attrs:{value:"T1"}},[_vm._v("T1 - Goods from outside the EC under Customs Control")]),_vm._v(" "),_c("option",{attrs:{value:"T2"}},[_vm._v("T2 - EC Goods not in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"TE"}},[_vm._v("TE - Goods in trade with Spain subject to duties")]),_vm._v(" "),_c("option",{attrs:{value:"TP"}},[_vm._v("TP - Goods in trade with Portugal subject to special duties")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("TD - Goods already under formal transit procedure")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("TF - Goods in trade between EC and Canary Islands")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Goods in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Goods in free circulation with destination outside the EC")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"customs_origin_code"}})],1)],1)])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"mt-6"},[_c("b-col",{attrs:{cols:"12"}},[_c("b-tabs",{staticClass:"custom-nav",attrs:{"content-class":"mt-3"}},[_c("b-tab",{attrs:{title:"OSI"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Service Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("other_service_information")},staticStyle:{height:"80px",width:"60%"},attrs:{id:"textarea"},on:{input:_vm.validateTextarea},model:{value:_vm.form.custom_origin.other_service_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"other_service_information",$$v);},expression:"form.custom_origin.other_service_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"other_service_information"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"SSR"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Special Service Request:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("special_service_request")},staticStyle:{height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.special_service_request,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"special_service_request",$$v);},expression:"form.custom_origin.special_service_request"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_service_request"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Accounting Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Accounting Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("accounting_information")},staticStyle:{height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.accounting_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"accounting_information",$$v);},expression:"form.custom_origin.accounting_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"accounting_information"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-2 flex-wrap tab-input-group"},[_c("label",{staticClass:"mb-0 mr-2",staticStyle:{width:"90px"},attrs:{"for":"input-horizontal"}},[_vm._v("Letter Of Credit")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"200px"},model:{value:_vm.form.custom_origin.letter_credit,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"letter_credit",$$v);},expression:"form.custom_origin.letter_credit"}},[_c("option",{attrs:{value:"CRN"}},[_vm._v("Credit Card Number")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("Credit Card Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"CRI"}},[_vm._v("Credit Card Issuance Name")]),_vm._v(" "),_c("option",{attrs:{value:"GEN"}},[_vm._v("General Information")]),_vm._v(" "),_c("option",{attrs:{value:"GBL"}},[_vm._v("Government Bill of Lading")]),_vm._v(" "),_c("option",{attrs:{value:"STL"}},[_vm._v("Mode of Settlement")]),_vm._v(" "),_c("option",{attrs:{value:"RET"}},[_vm._v("Return to Origin")]),_vm._v(" "),_c("option",{attrs:{value:"SRN"}},[_vm._v("Shipper's Reference Number")])])],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Shipment Reference Infomation"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Shipment Reference Information")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Shipment Reference Number:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("shipment_ref_no")},staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.shipment_ref_no,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"shipment_ref_no",$$v);},expression:"form.custom_origin.shipment_ref_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"shipment_ref_no"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Supplementary Shipment Information:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info",$$v);},expression:"form.custom_origin.supplementary_shipment_info"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info_line_2")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info_line_2,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info_line_2",$$v);},expression:"form.custom_origin.supplementary_shipment_info_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info_line_2"}})],1)])])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Agent Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Agent information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"align-items-center mb-6 mb-md-0 mb-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("HAWB Agent head office:")])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-name"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Name:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-name"},model:{value:_vm.agent_information.ho_name,callback:function callback($$v){_vm.$set(_vm.agent_information,"ho_name",$$v);},expression:"agent_information.ho_name"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-address"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Address:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-address"},model:{value:_vm.agent_information.ho_address,callback:function callback($$v){_vm.$set(_vm.agent_information,"ho_address",$$v);},expression:"agent_information.ho_address"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-city"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("City")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"150px"},attrs:{id:"input-city"},model:{value:_vm.agent_information.ho_city,callback:function callback($$v){_vm.$set(_vm.agent_information,"ho_city",$$v);},expression:"agent_information.ho_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"150px"},attrs:{id:"input-pincode"},model:{value:_vm.agent_information.ho_pincode,callback:function callback($$v){_vm.$set(_vm.agent_information,"ho_pincode",$$v);},expression:"agent_information.ho_pincode"}})],1)]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-state"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-state"},model:{value:_vm.agent_information.ho_state,callback:function callback($$v){_vm.$set(_vm.agent_information,"ho_state",$$v);},expression:"agent_information.ho_state"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("ho_country")},staticStyle:{width:"315px"},model:{value:_vm.agent_information.ho_country,callback:function callback($$v){_vm.$set(_vm.agent_information,"ho_country",$$v);},expression:"agent_information.ho_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                        "+_vm._s(country.text)+"\n                                                                    ")]);})],2)],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save Agents Head Office For Later Logins")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-iata-agent-code"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("IATA:")])])];},proxy:true}])},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.iata_agent_code,expression:"agent_information.iata_agent_code"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-iata-agent-code"},domProps:{value:_vm.agent_information.iata_agent_code},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"iata_agent_code",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-iata-agent-cass"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Cass")])])];},proxy:true}])},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.iata_agent_cass,expression:"agent_information.iata_agent_cass"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-iata-agent-cass"},domProps:{value:_vm.agent_information.iata_agent_cass},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"iata_agent_cass",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save IATA and Cass Information For Later Logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"align-items-center mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Override Issuing Agent:")])]),_vm._v(" "),_c("div",{staticClass:"mb-6"},[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-agent-name"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-agent-name"},model:{value:_vm.agent_information.agent_name,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_name",$$v);},expression:"agent_information.agent_name"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-agent-address"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-agent-address"},model:{value:_vm.agent_information.agent_address,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_address",$$v);},expression:"agent_information.agent_address"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-agent-city"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}})];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"150px"},attrs:{id:"input-agent-city"},model:{value:_vm.agent_information.agent_city,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_city",$$v);},expression:"agent_information.agent_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"150px"},attrs:{id:"input-agent-pincode"},model:{value:_vm.agent_information.agent_pincode,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_pincode",$$v);},expression:"agent_information.agent_pincode"}})],1)]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-agent-issuing-signature"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Signature:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_sign,expression:"agent_information.agent_issue_sign"}],staticClass:"form-control",staticStyle:{width:"315px"},attrs:{id:"input-agent-issuing-signature",type:"text"},domProps:{value:_vm.agent_information.agent_issue_sign},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_sign",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"agent_issue_loc_code"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Location:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_issue",staticClass:"custom-dropdown",on:{click:_vm.toggleDropdown_issuing_loc}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_loc_code,expression:"agent_information.agent_issue_loc_code"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("agent_issue_loc_code")},staticStyle:{width:"315px"},attrs:{type:"text",placeholder:"Search location",id:"agent_issue_loc_code",autocomplete:"off"},domProps:{value:_vm.agent_information.agent_issue_loc_code},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_loc_code",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_issuing_loc&&_vm.filteredLocations_issuing.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_issuing,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_issuing_loc(item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-agent-issuing-date"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Date:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_date,expression:"agent_information.agent_issue_date"}],staticClass:"form-control mr-2",staticStyle:{width:"150px"},attrs:{id:"input-agent-issuing-date",type:"text"},domProps:{value:_vm.agent_information.agent_issue_date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_date",$event.target.value);}}}),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"agent_information.agent_issue_date");}}})],1)])],1)])],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Also Notify"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Also Notify")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-notify"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Name:")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_alsoNotify",staticClass:"align-items-center custom-dropdown mr-4",on:{click:_vm.toggleDropdown_alsoNotify}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.also_notify_address.also_name,expression:"form.also_notify_address.also_name"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_name")},staticStyle:{width:"315px"},attrs:{type:"text",placeholder:"Search name",id:"also_notify",autocomplete:"off"},domProps:{value:_vm.form.also_notify_address.also_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.also_notify_address,"also_name",$event.target.value);},_vm.filteralsoNotify],focus:function focus($event){return _vm.toggleDropdown_alsoNotify(true);},blur:_vm.closeDropdown_alsoNotify}}),_vm._v(" "),_vm.isDropdownOpen_alsoNotify&&_vm.filteredAlsoNotify.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredAlsoNotify,function(also_notify,index){return _c("div",{key:also_notify.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectAlsoNotifyA(also_notify);}}},[_vm._v("\n                                                                                "+_vm._s(also_notify.name)+"\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Letter Of Credit")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_name")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_name,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_name",$$v);},expression:"form.also_notify_address.also_name"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address",$$v);},expression:"form.also_notify_address.also_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_address_line_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address_line_2",$$v);},expression:"form.also_notify_address.also_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-input",{staticClass:"form-control mr-5","class":{"is-invalid":_vm.form.errors.has("also_city")},staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_city,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_city",$$v);},expression:"form.also_notify_address.also_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_airport_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_airport_code",$$v);},expression:"form.also_notify_address.also_airport_code"}})],1),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-also-post"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Post Code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_post_code")},staticStyle:{width:"315px"},attrs:{id:"input-also-post"},model:{value:_vm.form.also_notify_address.also_post_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_post_code",$$v);},expression:"form.also_notify_address.also_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-also-state"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_state")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_state,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_state",$$v);},expression:"form.also_notify_address.also_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_country")},staticStyle:{width:"315px"},model:{value:_vm.form.also_notify_address.also_country,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_country",$$v);},expression:"form.also_notify_address.also_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                        "+_vm._s(country.text)+"\n                                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Phone:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_phone")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_phone,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_phone",$$v);},expression:"form.also_notify_address.also_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Fax:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("also_fax")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_fax,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_fax",$$v);},expression:"form.also_notify_address.also_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Telex:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_telex,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_telex",$$v);},expression:"form.also_notify_address.also_telex"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_also_notify_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_also_notify_address_save",$$v);},expression:"form.is_also_notify_address_save"}},[_vm._v(" Save new address to address book")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Exta Print Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Extra information printed of Air Way Bill (Only printed - not saved or sent\n                                                        to Airlines):")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-textarea",{staticStyle:{width:"500px",height:"80px !important"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.extra_print,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"extra_print",$$v);},expression:"form.custom_origin.extra_print"}})],1)],1)],1)])])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-tabs",{staticClass:"custom-nav"},[_c("b-tab",{attrs:{title:"Payment Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("b-row",[_c("b-col",{staticClass:"mb-6 mb-md-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex flex-column flex-sm-row align-items-sm-center justify-content-between"},[_c("b-form-group",{staticClass:"mb-3 mb-sm-0",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex text-align-center justify-content-end",staticStyle:{width:"105px"}},[_c("span",[_vm._v("Type Of Payment:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"210px"},model:{value:_vm.form.payment_info.type_of_payment,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"type_of_payment",$$v);},expression:"form.payment_info.type_of_payment"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("CA - Partial collect credit - partial prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"CB"}},[_vm._v("CB - Partial collect credit - partial prepaid credit")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CC - All charges collect")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("CG - All Charges collect by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("CP - Destination collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("CX - Destination collect credit")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("NC - Service rate. No charge")]),_vm._v(" "),_c("option",{attrs:{value:"PC"}},[_vm._v("PC - Partial prepaid cash - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PD"}},[_vm._v("PD - Partial prepaid credit - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("PG - All charges prepaid by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PP - All charges prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"PX"}},[_vm._v("PX - All charges prepaid credit")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-currency"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex text-align-center justify-content-end",staticStyle:{width:"105px"}},[_c("span",[_vm._v("Currency:")]),_vm._v(" "),_c("span",{staticClass:"text-danger"},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("currency")},staticStyle:{width:"60px"},attrs:{id:"input-currency"},model:{value:_vm.form.payment_info.currency,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"currency",$$v);},expression:"form.payment_info.currency"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"currency"}})],1)],1),_vm._v(" "),_c("label",{staticClass:"ml-3 mt-3 mb-2"},[_vm._v("Declared Values For:")]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-carriage"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex text-align-center justify-content-end",staticStyle:{width:"105px"}},[_c("span",[_vm._v("Carriage:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"210px"},attrs:{id:"input-carriage"},model:{value:_vm.form.payment_info.declear_value_carriage,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_carriage",$$v);},expression:"form.payment_info.declear_value_carriage"}})],1),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-custom"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex text-align-center justify-content-end",staticStyle:{width:"105px"}},[_c("span",[_vm._v("Customs:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"210px"},attrs:{id:"input-custom"},model:{value:_vm.form.payment_info.declear_value_customs,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_customs",$$v);},expression:"form.payment_info.declear_value_customs"}})],1),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-insurance"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex text-align-center justify-content-end",staticStyle:{width:"105px"}},[_c("span",[_vm._v("Insurance:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"210px"},attrs:{id:"input-insurance"},model:{value:_vm.form.payment_info.declear_value_insurance,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_insurance",$$v);},expression:"form.payment_info.declear_value_insurance"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-end w-100"},[_c("div",{staticClass:"table-responsive w-100"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Prepaid")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px",width:"100px"}},[_vm._v("Collect")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Weight Charge (WT)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.prepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.collect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Taxes (TX)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.taxes.toFixed(2))+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Agent (OA)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentPrepaid)+" INR\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentCollect)+" INR\n                                                                    ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Carrier (OC)\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierPrepaid)+" INR\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierCollect)+" INR\n                                                                    ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Total Charges")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChargesPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChrage)+" INR")])])])])])])])],1)],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"Other Charges"}},[_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"py-4"},[_c("b-row",{staticClass:"mb-4"},[_c("b-col",{staticClass:"mb-3 mb-md-0",attrs:{cols:"12",md:"7"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Code")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("other_charge_code")},model:{value:_vm.other_charges.other_charge_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_charge_code",$$v);},expression:"other_charges.other_charge_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select an Other Charge Code")]),_vm._v(" "),_vm._l(_vm.other_charges_code,function(charge){return _c("option",{key:charge.value,domProps:{value:charge.value}},[_vm._v("\n                                                                    "+_vm._s(charge.text)+"\n                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"other_charge_code"}})],1),_vm._v(" "),_c("b-col",{staticClass:"mb-3 mb-md-0",attrs:{cols:"5",md:"2"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Or:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control",attrs:{id:"input-or"},model:{value:_vm.other_charges.other_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_code",$$v);},expression:"other_charges.other_code"}})],1),_vm._v(" "),_c("b-col",{attrs:{cols:"7",md:"3"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Amount In INR")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control",attrs:{id:"input-other-charge-amount"},model:{value:_vm.other_charges.amount,callback:function callback($$v){_vm.$set(_vm.other_charges,"amount",$$v);},expression:"other_charges.amount"}})],1)],1),_vm._v(" "),_c("b-row",{staticClass:"align-items-end"},[_c("b-col",{staticClass:"mb-3 mb-sm-0",attrs:{cols:"12",sm:"auto"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Due")]),_vm._v(" "),_c("div",{staticClass:"d-flex",staticStyle:{gap:"16px"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"A"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Agent")]),_vm._v(" "),_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"C"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Carrier")])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mb-3 mb-sm-0",attrs:{cols:"12",sm:"auto"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Payment Type")]),_vm._v(" "),_c("div",{staticClass:"d-flex",staticStyle:{gap:"16px"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"P"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Prepaid")]),_vm._v(" "),_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"C"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Collect")])],1)]),_vm._v(" "),_c("b-col",{staticClass:"ml-sm-auto mb-1",attrs:{cols:"12",sm:"auto"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.addCharge}},[_vm._v("\n                                                                "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                            ")])],1)],1)],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-2"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 0px 0px 8px"}},[_vm._v("Calculated Charges")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px"}}),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px"}})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.chargable_weight1,expression:"other_charges.chargable_weight1"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.other_charges.chargable_weight1},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"chargable_weight1",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"vertical-align":"middle"}},[_vm._v("Charge")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.charge,expression:"other_charges.charge"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.other_charges.charge},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"charge",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2",staticStyle:{"vertical-align":"middle"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.calculateCharge}},[_vm._v("Calculate")])],1)])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("div",{staticClass:"table-responsive w-100"},[_c("table",{staticClass:"table table-sm w-100"},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px"}},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px"}},[_vm._v("Due")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px"}},[_vm._v("Amount")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px"}},[_vm._v("Type Of Payment")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px"}},[_vm._v("Actions")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.charges,function(charge,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{padding:"0px 8px"}},[_vm._v("\n                                                                        "+_vm._s(charge.other_charge_code||charge.other_code)+"\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{padding:"0px 8px"}},[_vm._v("\n                                                                        "+_vm._s(charge.due)+"\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{padding:"0px 8px"}},[_vm._v("\n                                                                        "+_vm._s(charge.amount)+".00\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{padding:"0px 8px"}},[_vm._v("\n                                                                        "+_vm._s(charge.payment_type)+"\n                                                                    ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.editCharge(index);}}},[_c("b-icon",{attrs:{icon:"pencil","font-scale":"1"}})],1),_vm._v(" "),_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.removeCharge(index);}}},[_c("b-icon",{attrs:{icon:"trash"}})],1)],1)]);}),0)])])])])],1)],1)]),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Special Handling Codes"}},[_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-center pt-2 ml-3"},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("special_handling_code")},staticStyle:{width:"420px"},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select Special Handling Codes")]),_vm._v(" "),_vm._l(_vm.codes,function(code){return _c("option",{key:code.value,domProps:{value:code.value}},[_vm._v(_vm._s(code.text))]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_handling_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-2",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-shc-or"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center"},[_c("span",[_vm._v("Or")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"60px"},attrs:{id:"shc-or"},model:{value:_vm.custom_special_handling_code,callback:function callback($$v){_vm.custom_special_handling_code=$$v;},expression:"custom_special_handling_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-6",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",attrs:{id:"input-horizontal",type:"button"},on:{click:_vm.addManualCode}},[_vm._v("Add")])],1)],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-4"},[_c("table",{staticClass:"table",staticStyle:{width:"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticClass:"editable-cell",staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px"}},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","line-height":"22px","font-weight":"400",padding:"0px 8px",width:"20px"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.tableCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteSplCode(index);}}})],1)]);}),0)])])])],1)],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"Other Customs Information"}},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-2 py-4"},[_c("b-row",{staticClass:"mb-3"},[_c("b-col",{staticClass:"mb-3 mb-md-0",attrs:{cols:"12",sm:"6",md:"4"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Country Code:")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm w-100","class":{"is-invalid":_vm.form.errors.has("country_code")},model:{value:_vm.oci_info.country_code,callback:function callback($$v){_vm.$set(_vm.oci_info,"country_code",$$v);},expression:"oci_info.country_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                "+_vm._s(country.text)+"\n                                                            ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"country_code"}})],1),_vm._v(" "),_c("b-col",{staticClass:"mb-3 mb-md-0",attrs:{cols:"12",sm:"6",md:"4"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Information Identifier:")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm w-100","class":{"is-invalid":_vm.form.errors.has("info_identifier")},model:{value:_vm.oci_info.info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"info_identifier",$$v);},expression:"oci_info.info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_identifiers.identifiers,function(oci_option){return _c("option",{key:oci_option.value,domProps:{value:oci_option.value}},[_vm._v("\n                                                                "+_vm._s(oci_option.text)+"\n                                                            ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"info_identifier"}})],1),_vm._v(" "),_c("b-col",{staticClass:"mb-3 mb-md-0",attrs:{cols:"12",md:"4"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Customs Information Identifier:")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm w-100","class":{"is-invalid":_vm.form.errors.has("custom_info_identifier")},model:{value:_vm.oci_info.custom_info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"custom_info_identifier",$$v);},expression:"oci_info.custom_info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_data.oci_custom_info_identifier,function(oci_options){return _c("option",{key:oci_options.value,domProps:{value:oci_options.value}},[_vm._v("\n                                                                "+_vm._s(oci_options.text)+"\n                                                            ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"custom_info_identifier"}})],1)],1),_vm._v(" "),_c("b-row",{staticClass:"align-items-end"},[_c("b-col",{staticClass:"mb-3 mb-md-0",attrs:{cols:"12",md:"8"}},[_c("label",{staticStyle:{"font-size":"12px","font-weight":"500",color:"#6b7280",display:"block","margin-bottom":"6px"}},[_vm._v("Supplementary Information:")]),_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.oci_info.supplementary_info,expression:"oci_info.supplementary_info"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.form.errors.has("supplementary_info")},attrs:{type:"text"},domProps:{value:_vm.oci_info.supplementary_info},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.oci_info,"supplementary_info",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_info"}})],1),_vm._v(" "),_c("b-col",{staticClass:"mb-1",attrs:{cols:"12",md:"auto"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.addOtherCustomInfo}},[_vm._v("\n                                                            "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                        ")])],1)],1)],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-4"},[_c("h6",{staticClass:"mb-4 h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Upload Other Customs Information:")]),_vm._v(" "),_c("b-form-textarea",{staticClass:"w-100",staticStyle:{height:"80px"},attrs:{id:"textarea"}})],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-3 d-flex justify-content-end"},[_c("b-button",{staticClass:"show-btn px-5"},[_vm._v("Upload")])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-6"},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm w-100"},[_c("thead",[_c("tr",[_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400",padding:"4px 12px"}},[_vm._v("Country")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400",padding:"4px 12px"}},[_vm._v("Info ID")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400",padding:"4px 12px"}},[_vm._v("Customs ID")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400",padding:"4px 12px"}},[_vm._v("Supplementary")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400",padding:"4px 12px"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.oci_entries,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.country_code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.custom_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.supplementary_info))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editOciInfo(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteOciInfo(index);}}})],1)]);}),0)])])])])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7 bottom-email-section"},[_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{staticClass:"text-right mobile-text-left",attrs:{cols:"12",md:"auto"}},[_c("div",{staticClass:"d-flex justify-content-end mobile-justify-start mb-2"},[_c("b-form-checkbox",{staticClass:"premium-checkbox",attrs:{size:"sm"}},[_vm._v("Including Cargo Label")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-pdf-copy-to",label:"Email FNA:"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-pdf-copy-to",placeholder:"Separate addresses with a semicolon ';'"}})],1)],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"pt-7 pb-28"},[_vm.showSpinner?_c("div",{staticClass:"spin",staticStyle:{"margin-top":"20px"}}):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-between"},[_vm.is_generate_pdf?_c("div",{staticClass:"mb-24",staticStyle:{"box-shadow":"0px 3px 15px 0px #0013","border-radius":"12px",width:"100%"}},[_c("div",{staticStyle:{display:"flex",width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{display:"flex","justify-content":"start",color:"#355594","font-size":"15px","line-height":"71px","font-weight":"500",width:"100%"}},[_vm._v("Cargo document created")]),_vm._v(" "),_c("div",{staticStyle:{display:"flex","justify-content":"end","line-height":"71px","align-self":"center",width:"100%"},on:{click:function click($event){return _vm.isGeneratePdf(_vm.generateButton=0);}}},[_c("img",{staticStyle:{width:"24px",height:"24px",cursor:"pointer"},attrs:{src:"/media/assets/ui/cross.png",alt:"cross button"}})])]),_vm._v(" "),_c("div",{staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{width:"100%"}},[_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"13px","font-weight":"400",margin:"0"}},[_vm._v("Airway bill message saved in database")]),_vm._v(" "),_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"18px","font-weight":"400","border-bottom":"1px solid #CDCDCD","padding-bottom":"15px"}},[_vm._v("PDF documents prepared")])])]),_vm._v(" "),_c("div",{staticClass:"mb-16",staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-hawb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("House Waybill Pdf file")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-multiple-hawb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage House Waybill Pdf")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-multiple-both-page-hawb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage House Waybill Pdf with back pages")])])])]):_vm._e(),_vm._v(" "),_vm.main_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.main_error_msg)}})]):_vm._e()]),_vm._v(" "),_vm.successMessage?_c("div",{staticStyle:{"font-weight":"bold",display:"flex","justify-content":"flex-end","text-align":"right"}},[_c("span",[_vm._v("\n                                    "+_vm._s(_vm.successMessage.split("-Pass")[0])+"\n                                    "),_c("span",{staticStyle:{color:"green"}},[_vm._v("-Pass")])])]):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end submit-button"},[_c("b-button",{staticClass:"show-btn mr-2",on:{click:function click($event){_vm.isGeneratePdf(_vm.generateButton=1);_vm.form.status="generate_pdf";}}},[_vm._v("Generate PDF")]),_vm._v(" "),_vm.current_user.can_send?_c("div",[_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send")]),_vm._v(" "),_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send & Clear")])],1):_vm._e(),_vm._v(" "),_vm.form.first_box.status!="send"?_c("div",[_c("b-button",{staticClass:"show-btn",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="draft";}}},[_vm._v(_vm._s(_vm.submitButtonText))])],1):_vm._e()],1)])],1)])]],2)],1)]);};var staticRenderFns=[];render._withStripped=true;

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/HouseWayBill.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HouseWayBill_vue_vue_type_template_id_97b93126_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true */ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true");
/* harmony import */ var _HouseWayBill_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HouseWayBill.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=script&lang=js");
/* harmony import */ var _HouseWayBill_vue_vue_type_style_index_0_id_97b93126_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css");
/* harmony import */ var _HouseWayBill_vue_vue_type_style_index_1_id_97b93126_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css */ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _HouseWayBill_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HouseWayBill_vue_vue_type_template_id_97b93126_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _HouseWayBill_vue_vue_type_template_id_97b93126_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "97b93126",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/HouseWayBill.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HouseWayBill.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_template_id_97b93126_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_template_id_97b93126_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_template_id_97b93126_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=template&id=97b93126&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_style_index_0_id_97b93126_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=0&id=97b93126&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HouseWayBill_vue_vue_type_style_index_1_id_97b93126_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/HouseWayBill.vue?vue&type=style&index=1&id=97b93126&lang=css");


/***/ })

}]);