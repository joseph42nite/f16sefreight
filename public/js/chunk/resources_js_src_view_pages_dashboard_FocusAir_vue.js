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
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
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
  name: "FocusAir",
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
      oci_info: {
        country_code: '',
        info_identifier: '',
        custom_info_identifier: '',
        supplementary_info: ''
      },
      consignment_list: new Form({
        pieces: '',
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
      selectedViewPageOption: '/focus-air',
      selectedShipper: null,
      selectedConsignee: null,
      selectAlsoNotify: null,
      shippers: [],
      consignees: [],
      alsoNotify: [],
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
      selectedCode: '',
      custom_special_handling_code: '',
      manualCode: '',
      validationErrors: [],
      hs_code_error: [],
      uld_error: [],
      location: [],
      newHsCode: '',
      isOpen: false,
      showShipper: false,
      showConsignee: false,
      showCalculationTable: false,
      generatePDFAfterSave: '',
      editIndex: null,
      edit_entry_index: null,
      countries: [],
      oci_data: {},
      ///get-oci-data
      oci_identifiers: {},
      other_charges_code: [],
      existingData: {},
      data_items: [],
      mode: 'add',
      awbDetails: false,
      awbError: null,
      isConsignmentAdded: false,
      awbId: null,
      filteredShippers: [],
      filteredConsignees: [],
      filteredAlsoNotify: [],
      awb_prefix_message: '',
      showAWBSection: false,
      successMessage: '',
      charCount: 0,
      lineCount: 0,
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
      selectedCompanyForUpload: null,
      selectedUploadType: 'ksr',
      selectedFile: null,
      isUploading: false
    };
  },
  methods: (_methods = {
    //file upload code
    triggerFileInput: function triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect: function handleFileSelect(event) {
      var file = event.target.files[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          alert('Please select a PDF file only');
          this.$refs.fileInput.value = '';
          return;
        }
        this.selectedFile = file;
      }
    },
    submitUpload: function submitUpload() {
      var _this = this;
      if (!this.selectedFile) {
        alert('Please select a file first');
        return;
      }
      this.isUploading = true;
      var formData = new FormData();
      formData.append('upload_file', this.selectedFile);
      formData.append('type', this.selectedUploadType);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].post('/user/upload-awb-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        var _response$data, _response$transit, _transit$transit_airp, _transit$transit_airp2, _transit$transit_airp3, _transit$flights$, _transit$flights$2, _piece_weight$rate_cl;
        _this.isUploading = false;
        _this.$bvModal.hide('upload-file-modal');
        response = (_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.data;
        console.log(response);
        var awb_number = response.awb_number.split("-");
        _this.form.first_box.awb_code = awb_number[0];
        _this.form.first_box.awb_no = awb_number[1];
        //routing
        var departure = response.departure;
        var destination = response.destination;
        var transit = (_response$transit = response.transit) === null || _response$transit === void 0 ? void 0 : _response$transit[0];
        var all_airport_short_code = [departure, destination, (_transit$transit_airp = transit.transit_airports) === null || _transit$transit_airp === void 0 ? void 0 : _transit$transit_airp[0], (_transit$transit_airp2 = transit.transit_airports) === null || _transit$transit_airp2 === void 0 ? void 0 : _transit$transit_airp2[1], (_transit$transit_airp3 = transit.transit_airports) === null || _transit$transit_airp3 === void 0 ? void 0 : _transit$transit_airp3[2]];
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].post("/user/get-airport-by-airport-code", {
          "airport_code": all_airport_short_code
        }).then(function (response2) {
          var _response2$data;
          response2 = (_response2$data = response2.data) === null || _response2$data === void 0 ? void 0 : _response2$data.data;
          _this.form.routing_information.departure_airport = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          _this.form.routing_information.destination_airport = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
          _this.form.routing_information.from = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          _this.form.routing_information.to = "".concat(response2[2] ? response2[2]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[2] ? response2[2]['destination'] : response2[1]['destination']);
          if (transit.transit_airports[1]) {
            _this.form.routing_information.to_2 = "".concat(response2[3] ? response2[3]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[3] ? response2[3]['destination'] : response2[1]['destination']);
          }
          if (transit.transit_airports[2]) {
            _this.form.routing_information.to_3 = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
          }
        });
        _this.form.routing_information.by = (_transit$flights$ = transit.flights[0]) === null || _transit$flights$ === void 0 || (_transit$flights$ = _transit$flights$.flight_number) === null || _transit$flights$ === void 0 ? void 0 : _transit$flights$.slice(0, 2);
        _this.form.routing_information.flight = (_transit$flights$2 = transit.flights[0]) === null || _transit$flights$2 === void 0 || (_transit$flights$2 = _transit$flights$2.flight_number) === null || _transit$flights$2 === void 0 ? void 0 : _transit$flights$2.slice(2);
        _this.form.routing_information.date = _this.formatDate(transit.flights[0].date);
        if (transit.flights[1]) {
          var _transit$flights$3, _transit$flights$4;
          _this.form.routing_information.by_2 = (_transit$flights$3 = transit.flights[1]) === null || _transit$flights$3 === void 0 || (_transit$flights$3 = _transit$flights$3.flight_number) === null || _transit$flights$3 === void 0 ? void 0 : _transit$flights$3.slice(0, 2);
          _this.form.routing_information.flight_2 = (_transit$flights$4 = transit.flights[1]) === null || _transit$flights$4 === void 0 || (_transit$flights$4 = _transit$flights$4.flight_number) === null || _transit$flights$4 === void 0 ? void 0 : _transit$flights$4.slice(2);
          _this.form.routing_information.date_2 = _this.formatDate(transit.flights[1].date);
        }
        if (transit.flights[2]) {
          var _transit$flights$5, _transit$flights$6;
          _this.form.routing_information.by_3 = (_transit$flights$5 = transit.flights[2]) === null || _transit$flights$5 === void 0 || (_transit$flights$5 = _transit$flights$5.flight_number) === null || _transit$flights$5 === void 0 ? void 0 : _transit$flights$5.slice(0, 2);
          _this.form.routing_information.flight_3 = (_transit$flights$6 = transit.flights[2]) === null || _transit$flights$6 === void 0 || (_transit$flights$6 = _transit$flights$6.flight_number) === null || _transit$flights$6 === void 0 ? void 0 : _transit$flights$6.slice(2);
          _this.form.routing_information.date_3 = _this.formatDate(transit.flights[2].date);
        }
        _this.$refs.fileInput.value = '';
        //end routing

        //shipper
        _this.showShipper = true;
        var shipper = response.shipper;
        _this.form.shipper_address.ship_name = shipper.name;
        _this.form.shipper_address.ship_address = shipper.address;
        _this.form.shipper_address.ship_city = shipper.city;
        _this.form.shipper_address.ship_post_code = shipper.pin;
        _this.form.shipper_address.ship_state = shipper.state;
        if (shipper.country) {
          var shipper_country_code = '';
          for (var c = 0; c < 252; c++) {
            if (_this.countries[c].text.toLowerCase() == shipper.country.toLowerCase()) {
              shipper_country_code = _this.countries[c].value;
              break;
            }
          }
          _this.form.shipper_address.ship_country = shipper_country_code;
        }
        _this.form.shipper_address.ship_phone = shipper.phone;
        _this.form.shipper_address.ship_fax = shipper.email;
        //end shipper
        //consignee
        _this.showConsignee = true;
        var consignee = response.consignee;
        _this.form.consignee_address.cons_name = consignee.name;
        _this.form.consignee_address.cons_name_2 = consignee.eori;
        _this.form.consignee_address.cons_address = consignee.address;
        _this.form.consignee_address.cons_city = consignee.city;
        _this.form.consignee_address.cons_post_code = consignee.pin;
        _this.form.consignee_address.cons_state = consignee.state;
        if (consignee.country) {
          var consignee_country_code = '';
          for (var _c = 0; _c < 252; _c++) {
            if (_this.countries[_c].text.toLowerCase() == consignee.country.toLowerCase()) {
              consignee_country_code = _this.countries[_c].value;
              break;
            }
          }
          _this.form.consignee_address.cons_country = consignee_country_code;
        }
        _this.form.consignee_address.cons_phone = consignee.phone;
        _this.form.consignee_address.cons_fax = consignee.email;
        if (consignee.eori) {
          _this.oci_info.supplementary_info = consignee.eori;
          _this.oci_info.custom_info_identifier = "CNE";
        }
        //end consignee
        //Consignment Information
        var cargo_data = response.cargo;
        var piece_weight = response.piece_weight;
        var weight_charge = response.weight_charge;
        var rate_class = piece_weight.rate_class ? piece_weight.rate_class.length > 2 ? piece_weight.rate_class.slice(2) : piece_weight.rate_class.slice(0) : null;
        _this.consignment_list.rate_class = (_piece_weight$rate_cl = piece_weight.rate_class) === null || _piece_weight$rate_cl === void 0 ? void 0 : _piece_weight$rate_cl.slice(2);
        _this.consignment_list.pieces = piece_weight.no_of_pieces;
        _this.consignment_list.rate = piece_weight.rate;
        _this.consignment_list.hsCodes = cargo_data.hs_codes;
        _this.consignment_list.gross_weight = piece_weight.gross_weight;
        _this.consignment_list.chargable_weight = piece_weight.chargeable_weight;
        _this.consignment_list.description = cargo_data.description;
        for (var i = 0; i < cargo_data.dimensions.length; i++) {
          var _dimensions_data$, _dimensions_data$2, _dimensions_data$3;
          var dimensions_data = cargo_data.dimensions[i].dimension.split('X');
          _this.consignment_list.itemss.push({
            pcs: cargo_data.dimensions[i].count,
            wgt: '',
            length: (_dimensions_data$ = dimensions_data[0]) !== null && _dimensions_data$ !== void 0 ? _dimensions_data$ : '',
            width: (_dimensions_data$2 = dimensions_data[1]) !== null && _dimensions_data$2 !== void 0 ? _dimensions_data$2 : '',
            height: (_dimensions_data$3 = dimensions_data[2]) !== null && _dimensions_data$3 !== void 0 ? _dimensions_data$3 : '',
            unit: 'CMT'
          });
        }
        _this.$refs.modalConsignment.show();
        //end Consignment Information

        //remaining data
        _this.form.payment_info.type_of_payment = response.chrg_code;
      })["catch"](function (error) {
        _this.$refs.fileInput.value = '';
      });
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
    onSelect: function onSelect(value) {
      if (value) {
        window.location.href = value;
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
      // try {
      //     this.showSpinner = true;
      //     this.pdf_error_msg = ''; // Clear previous errors
      //     const result = this.onSubmit() || Promise.resolve({});
      //     result.then(response => {
      //     if (response.data.error) {
      //         this.pdf_error_msg = response.data.error;
      //         this.is_generate_pdf = false;
      //         console.log("hello");
      //     } else {
      //         // Handle successful PDF generation
      //         window.open(response.data.url, '_blank');
      //     }
      // });
      // } catch (error) {
      //     this.pdf_error_msg = error.response?.data?.message || 'Failed to generate PDF';
      //     this.is_generate_pdf = false;
      // } finally {
      //     this.showSpinner = false;
      // }
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
    target[keys[keys.length - 1]] = date;
  }), "prepareFormDataForSubmission", function prepareFormDataForSubmission() {
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
  }), "getLocation", function getLocation() {
    var _this3 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-location").then(function (_ref6) {
      var data = _ref6.data;
      _this3.location = data;
    });
  }), "fetchShippers", function fetchShippers() {
    var _this4 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shippers").then(function (response) {
      _this4.shippers = response.data;
      _this4.filteredShippers = _this4.shippers.filter(function (shipper) {
        return shipper.address_type === 'shipper_address';
      });
      // this.filteredShippers = this.shippers;
      // console.log('Shipper', response.data);
    });
  }), "fetchConsignee", function fetchConsignee() {
    var _this5 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shippers").then(function (response) {
      _this5.consignees = response.data;
      _this5.filteredConsignees = _this5.consignees.filter(function (consignee) {
        return consignee.address_type === 'consignee_address';
      });
      // this.filteredConsignees = this.consignees;
      // console.log('Shipper', response.data);
    });
  }), "fetchAlsoNotify", function fetchAlsoNotify() {
    var _this6 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shippers").then(function (response) {
      _this6.alsoNotify = response.data;
      _this6.filteredAlsoNotify = _this6.alsoNotify.filter(function (also_notify) {
        return also_notify.address_type === 'also_notify_address';
      });
      // this.filteredConsignees = this.consignees;
      // console.log('Shipper', response.data);
    });
  }), "fillShipperDetails", function fillShipperDetails() {
    var _this7 = this;
    if (this.selectedShipper) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shipper-address?id=".concat(this.selectedShipper)).then(function (response) {
        _this7.form.shipper_address = response.data;
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
  }), "fillConsigneeDetails", function fillConsigneeDetails() {
    var _this8 = this;
    if (this.selectedConsignee) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-consignee-address?id=".concat(this.selectedConsignee)).then(function (response) {
        _this8.form.consignee_address = response.data;
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
  }), "fillAlsoNotifyDetails", function fillAlsoNotifyDetails() {
    var _this9 = this;
    if (this.selectAlsoNotify) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-alsonotify-address?id=".concat(this.selectAlsoNotify)).then(function (response) {
        _this9.form.also_notify_address = response.data;
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "onSubmit", function onSubmit() {
    var _this0 = this;
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
          _this0.existingData = response.data.data.first_box.original.data;
          if (_this0.generatePDFAfterSave && _this0.existingData && _this0.existingData.id) {
            _this0.generateAwbPDF(_this0.generatePDFAfterSave);
          }
          _this0.successMessage = '-e-AWB Saved in database -Pass';
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
              main_error_msg += "".concat(_this0.formatBackendError(errors[field][0]), "<br>");
            }
          }
        }
        _this0.main_error_msg = main_error_msg;
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
          _this0.existingData = response.data.data.first_box.original.data;
          if (_this0.generatePDFAfterSave && _this0.existingData && _this0.existingData.id) {
            _this0.generateAwbPDF(_this0.generatePDFAfterSave);
          }
          _this0.successMessage = '-e-AWB Saved in database -Pass';
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
              main_error_msg += "".concat(_this0.formatBackendError(errors[field][0]), "<br>");
            }
          }
        }
        _this0.main_error_msg = main_error_msg;
      });
    }
  }), "getAirwayBills", function getAirwayBills(status) {
    var _this1 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-airway-bills/".concat(status)).then(function (response) {
      _this1.data_items = response.data;
      // console.log('Data items:', this.data_items);
    })["catch"](function (error) {
      // console.error("Failed to fetch items:", error);
    });
  }), "getAirWayBill", function getAirWayBill(id) {
    var _this10 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
      if (response.data && response.data.id == id) {
        _this10.existingData = response.data;
        _this10.existingData.payment_info = _objectSpread(_objectSpread({}, _this10.defaultPaymentInfo), _this10.existingData.payment_info || {});
        // this.setDefaultValues();
        _this10.showAWBSection = true;
        _this10.awbError = null;
        _this10.openForm('update', _this10.existingData.id);
        if (_this10.existingData && _this10.existingData.consignment_data) {
          _this10.isConsignmentAdded = true;
        }
      } else {
        _this10.showAWBSection = false; // Hide if no data exists
        _this10.awbError = "No data found for this AWB ID.";
      }
    })["catch"](function (error) {
      _this10.existingData = null;
      _this10.showAWBSection = false;
      _this10.awbError = "No data found for this AWB ID.";
      _this10.awbDetails = false;
    });
  }), "getAirWayBillForRealod", function getAirWayBillForRealod(id) {
    var _this11 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
      var _response$data2;
      var fetchedId = (_response$data2 = response.data) === null || _response$data2 === void 0 || (_response$data2 = _response$data2.id) === null || _response$data2 === void 0 ? void 0 : _response$data2.toString();
      var inputId = id.toString();
      if (fetchedId === inputId) {
        _this11.existingData = response.data;
        _this11.showAWBSection = true;
        _this11.awbError = null;
        // this.openForm('update', this.existingData.id);
      } else {
        _this11.existingData = null;
        _this11.showAWBSection = false;
        _this11.awbError = "No data found for this AWB ID.";
      }
    })["catch"](function (error) {
      var _error$response;
      // console.error("Error fetching AWB:", error.response || error);
      _this11.showAWBSection = false;
      _this11.awbError = ((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404 ? "Air Waybill not found." : "";
    });
  }), "openForm", function openForm(mode) {
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
    } else {
      // console.error('existingData is not an array:', this.existingData);
      // console.log("Add mode activated");
    }
  }), "handleEditNavigation", function handleEditNavigation(id) {
    this.$bvModal.hide('modal-s');
    var targetPath = "/edit-airway-bill/".concat(String(id));
    if (this.$route.path !== targetPath) {
      this.$router.push(targetPath).then(function () {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }), "getAgent", function getAgent(company_id, branch_id) {
    var _this12 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/agent-info").then(function (_ref7) {
      var data = _ref7.data;
      if (Array.isArray(data) && data.length > 0) {
        _this12.agent_information = data[0];
        _this12.iata_cass = {
          iata_agent_code: _this12.agent_information.iata_agent_code || null,
          iata_agent_cass: _this12.agent_information.iata_agent_cass || null
        };
      } else {
        _this12.agent_information = data;
      }
    })["catch"](function (error) {
      // console.error("Error fetching agent information:", error);
    });
  }), "getCountry", function getCountry() {
    var _this13 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-country').then(function (_ref8) {
      var data = _ref8.data;
      _this13.countries = Object.keys(data).map(function (key) {
        return {
          value: key,
          text: data[key]
        };
      });
    })["catch"](function (error) {
      // console.error("Error fetching countries:", error);
    });
  }), "getOtherChargesCode", function getOtherChargesCode() {
    var _this14 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/other-charges').then(function (_ref9) {
      var data = _ref9.data;
      _this14.other_charges_code = Object.keys(data).map(function (key) {
        return {
          value: key,
          text: data[key]
        };
      });
    })["catch"](function (error) {
      // console.error("Error fetching countries:", error);
    });
  }), "getOCIData", function getOCIData() {
    var _this15 = this;
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-oci-data').then(function (_ref0) {
      var data = _ref0.data;
      if (data && data.oci_custom_info_identifier) {
        _this15.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(function (_ref1) {
          var _ref10 = _slicedToArray(_ref1, 2),
            key = _ref10[0],
            value = _ref10[1];
          return {
            value: key,
            text: value
          };
        });
      } else {
        _this15.oci_data.oci_custom_info_identifier = [];
      }
      if (data && data.identifiers) {
        _this15.oci_identifiers.identifiers = Object.entries(data.identifiers).map(function (_ref11) {
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
      // console.error("Error fetching countries:", error);
      _this15.oci_data.oci_custom_info_identifier = [];
    });
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "handleRadioChange", function handleRadioChange(value) {
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
  }), "deleteSplCode", function deleteSplCode(index) {
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
  }), "addCharge", function addCharge() {
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
  }), "editCharge", function editCharge(index) {
    this.editIndex = index;
    this.other_charges = _objectSpread({}, this.form.charges[index]);
    // this.editIndex = null;
  }), "removeCharge", function removeCharge(index) {
    this.form.charges.splice(index, 1);
  }), "editEntry", function editEntry(index) {
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
    this.consignment_list.itemss = consignment_data.pieces_info ? JSON.parse(consignment_data.pieces_info) : [];
    this.consignment_list.hsCodes = consignment_data.hs_code ? JSON.parse(consignment_data.hs_code) : [];
    this.consignment_list.uld_infos = consignment_data.uld_info ? JSON.parse(consignment_data.uld_info) : [];
    this.$refs.modalConsignment.show();
    this.isConsignmentAdded = true;
    this.calculateTotalAmount();
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "deleteEntry", function deleteEntry(index) {
    this.form.entries.splice(index, 1);
    this.calculateTotalVolume();
    this.calculateTotalAmount();
    if (this.form.entries.length === 0) {
      this.isConsignmentAdded = false;
    }
  }), "addOrUpdateEntry", function addOrUpdateEntry(evt) {
    var _this16 = this;
    evt.preventDefault();
    // console.log("Before request, consignment_list:", this.consignment_list);
    if (!(this.consignment_list instanceof Form)) {
      this.consignment_list = new Form(this.consignment_list);
    }
    this.consignment_list.post("/user/get-consignment-error").then(function (response) {
      // console.log("Response from server:", response);
      var updatedEntry = _objectSpread(_objectSpread({}, _this16.consignment_list), {}, {
        uld_info: JSON.stringify(_this16.consignment_list.uld_infos),
        pieces_info: JSON.stringify(_this16.consignment_list.itemss),
        hs_code: JSON.stringify(_this16.consignment_list.hsCodes)
      });
      if (_this16.edit_entry_index !== null) {
        // console.log("Updating entry at index", this.edit_entry_index, "with data:", updatedEntry);
        _this16.form.entries[_this16.edit_entry_index] = updatedEntry;
        // console.log("Updating entry at index", this.edit_entry_index, "with data:", this.consignment_list);
        // this.form.entries[this.edit_entry_index] = { ...this.consignment_list };
        // this.$set(this.form.entries, this.edit_entry_index, { ...this.consignment_list });
        _this16.edit_entry_index = null;
      } else {
        // console.log("Adding new entry:", updatedEntry);
        _this16.form.entries.push(updatedEntry);
        // console.log("Adding new entry:", this.consignment_list);
        // this.form.entries.push({ ...this.consignment_list });
      }
      _this16.calculateTotalVolume();
      _this16.calculateTotalAmount();
      _this16.isConsignmentAdded = _this16.form.entries.length > 0;
      _this16.closeModal();
      // console.log("Updated form entries:", this.form.entries);
      //clear consignment_list data
      for (var key in _this16.consignment_list) {
        if (key != 'busy' && key != 'successful' && key != 'errors' && key != 'originalData') {
          if (_typeof(_this16.consignment_list[key]) === 'object') {
            _this16.consignment_list[key] = [];
          } else {
            _this16.consignment_list[key] = '';
          }
        }
      }
      _this16.isConsignmentAdded = _this16.form.entries.length > 0;
    })["catch"](function (error) {
      // console.error("There was an error with the consignment request:", error);
    });
  }), "calculateTotalVolume", function calculateTotalVolume() {
    var _this17 = this;
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
        var selectedUnit = _this17.form.totals.dimention_unit;
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
  }), "calculateTotalAmount", function calculateTotalAmount() {
    // const chargeableWeight = this.form.entries.reduce((total, entry) => {
    //     let weight = parseFloat(entry.chargable_weight) || 0;
    //     return total + weight;
    // }, 0);
    var chargeableWeight = this.consignment_list.chargable_weight;
    var rate_class = this.consignment_list.rate_class;
    var rates = 0;
    this.form.totals.total_amount = 0;
    if (rate_class === "B" || rate_class === "M") {
      // this.form.totals.total_amount = this.consignment_list.rate || 0;
      this.form.totals.total_amount = parseFloat(this.consignment_list.rate) || 0;
    } else if (rate_class === "P" || rate_class === "X") {
      this.form.totals.total_amount = 0;
    } else {
      // rates = parseFloat(this.form.entries.reduce((total, entry) => {
      //     return total + (parseFloat(entry.rate) || 0);
      // }, 0)) || 0;
      // this.form.totals.total_amount = chargeableWeight * rates;
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "deleteUldInfo", function deleteUldInfo(index) {
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
  }), "deleteOciInfo", function deleteOciInfo(index) {
    // this.oci_entries.splice(index, 1);
    if (this.form.oci_entries.length > index) {
      this.form.oci_entries.splice(index, 1);
    }
  }), "addPcsInfo", function addPcsInfo() {
    var _this18 = this;
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
      var value = _this18.consignment_list[field];
      if (value) {
        if (rule.type === 'numeric' && (isNaN(value) || value < rule.min || value > rule.max)) {
          _this18.validationErrors.push(rule.message);
        } else if (rule.type === 'regex' && (!rule.regex.test(value) || value.length > rule.maxLength)) {
          _this18.validationErrors.push(rule.message);
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "selectOption_destination", function selectOption_destination(item) {
    this.form.routing_information.destination_airport = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.form.routing_information.destination_airport = final_set;
    this.isDropdownOpen_destination = false;
  }), "toggleDropdown_to", function toggleDropdown_to() {
    this.isDropdownOpen_to = !this.isDropdownOpen_to;
  }), "selectOption_to", function selectOption_to(item) {
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "closeDropdown_to2", function closeDropdown_to2(event) {
    var dropdownContainer_to2 = this.$refs.dropdownContainer_to2;
    if (!dropdownContainer_to2.contains(event.target)) {
      this.isDropdownOpen_to2 = false;
    }
  }), "closeDropdown_to3", function closeDropdown_to3(event) {
    var dropdownContainer_to3 = this.$refs.dropdownContainer_to3;
    if (!dropdownContainer_to3.contains(event.target)) {
      this.isDropdownOpen_to3 = false;
    }
  }), "closeDropdown_departure", function closeDropdown_departure(event) {
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
  }), "toggleDropdown_participant_airport", function toggleDropdown_participant_airport() {
    this.isDropdownOpen_participant = !this.isDropdownOpen_participant;
  }), "selectOption_participant_airport", function selectOption_participant_airport(item) {
    this.agent_information.participate_airport = item.iata_code;
    var source_name = item.destination;
    var final_set = "".concat(item.iata_code, ", ").concat(source_name);
    // this.searchQuery_to = final_set;
    this.agent_information.participate_airport = final_set;
    this.isDropdownOpen_participant = false;
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "closeDropdown_participant_airport", function closeDropdown_participant_airport(event) {
    var dropdownContainer_participant = this.$refs.dropdownContainer_participant;
    // if (!dropdownContainer_participant.contains(event.target)) {
    //     this.isDropdownOpen_participant = false;
    // }
    if (dropdownContainer_participant && !dropdownContainer_participant.contains(event.target)) {
      this.isDropdownOpen_participant = false;
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
  }), "onAWBInput", lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default()(function () {
    var _this19 = this;
    var _this$form$first_box = this.form.first_box,
      awb_code = _this$form$first_box.awb_code,
      awb_no = _this$form$first_box.awb_no;
    if (awb_code && awb_code.length === 3) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-awbcode-prefix/".concat(awb_code)).then(function (response) {
        if (response.data) {
          var _response$data3 = response.data,
            name = _response$data3.name,
            code = _response$data3.code;
          _this19.awb_prefix_message = "Message will be sent to ".concat(name, " (").concat(code, ")");
        } else {
          _this19.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
        }
      })["catch"](function (error) {
        console.error("Error fetching AWB details:", error);
        _this19.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
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
  }, 500)), "confirmReload", function confirmReload() {
    var confirmed = window.confirm("Are you sure you want to reload the content for AWB: ".concat(this.awbId, "?"));
    if (confirmed) {
      this.awbDetails = false;
      this.showAWBSection = false;
      // openForm('update', this.existingData.id)
      this.$router.go(0);
      this.getAirWayBill(this.awbId);
    }
  }), "reloadPageWithContent", function reloadPageWithContent() {
    var _this20 = this;
    var awbId = this.awbId;
    if (!awbId) {
      // console.error('AWB ID is missing');
      return;
    }
    _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(awbId)).then(function (response) {
      _this20.existingData = response.data;
      if (_this20.existingData) {
        _this20.awbDetails = false;
        _this20.openForm('update', _this20.existingData.id);
        // this.$router.push({ path: `/edit-airway-bill/${awbId}`});
        _this20.location.reload();
        // this.$router.push({ path: `/edit-airway-bill/${awbId}` });
      } else {
        _this20.awbDetails = false;
      }
    })["catch"](function (error) {
      _this20.existingData = null;
      // this.awbError = "No data found for this AWB ID.";
      _this20.awbDetails = false;
      // console.error("Failed to fetch data for updating:", error);
    });
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
  }), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_methods, "toggleDropdown_consignee", function toggleDropdown_consignee(event) {
    this.isDropdownOpen_consignee = event;
  }), "closeDropdown_consignee", function closeDropdown_consignee(event) {
    var dropdownContainer_consignee = this.$refs.dropdownContainer_consignee;
    if (!dropdownContainer_consignee.contains(event.target)) {
      this.isDropdownOpen_consignee = false;
    }
  }), "filterConsignee", function filterConsignee() {
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
  })),
  mounted: function mounted() {
    // this.setDefaultValues();
    this.calculateTotalVolume();
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
    window.addEventListener('click', this.closeDropdown_participant_airport);
    this.getLocation();
    this.fetchShippers();
    this.fetchAlsoNotify();
    this.fillShipperDetails();
    this.fillConsigneeDetails();
    this.fillAlsoNotifyDetails();
    this.fetchConsignee();
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
    // console.log("Current User:", this.current_user);
    if (this.current_user) this.getAgent(this.current_user.company_name, this.current_user.branch_name);
  },
  watch: {
    // 'consignment_list': function () {
    //     this.form.totals.total_amount = this.calculateTotalAmount();
    // },
    // 'form.entries.dimention_unit': function() {
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
    'agent_information.participate': function agent_informationParticipate(newValue) {
      // console.log('Participate value changed to:', newValue);
    },
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
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapGetters)({
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
      return this.form.totals.total_amount;
    },
    filteredLocations_to: function filteredLocations_to() {
      var _this$form;
      var query = (((_this$form = this.form) === null || _this$form === void 0 || (_this$form = _this$form.routing_information) === null || _this$form === void 0 ? void 0 : _this$form.to) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
      // const query = this.form.routing_information.to.toLowerCase().trim();
      // if (!query) return this.location;

      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
    },
    filteredLocations_to2: function filteredLocations_to2() {
      var _this$form2;
      var query = (((_this$form2 = this.form) === null || _this$form2 === void 0 || (_this$form2 = _this$form2.routing_information) === null || _this$form2 === void 0 ? void 0 : _this$form2.to_2) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
      // const query = this.form.routing_information.to_2.toLowerCase().trim();
      // if (!query) return this.location;

      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
    },
    filteredLocations_to3: function filteredLocations_to3() {
      var _this$form3;
      var query = (((_this$form3 = this.form) === null || _this$form3 === void 0 || (_this$form3 = _this$form3.routing_information) === null || _this$form3 === void 0 ? void 0 : _this$form3.to_3) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
      // const query = this.form.routing_information.to_3.toLowerCase().trim();
      // if (!query) return this.location;

      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
    },
    filteredLocations_from: function filteredLocations_from() {
      var _this$form4;
      // const query = this.form.routing_information.from.toLowerCase().trim();
      // if (!query) return this.location;

      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
      var query = (((_this$form4 = this.form) === null || _this$form4 === void 0 || (_this$form4 = _this$form4.routing_information) === null || _this$form4 === void 0 ? void 0 : _this$form4.from) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_destination: function filteredLocations_destination() {
      var _this$form5;
      // const query = this.form.routing_information.destination_airport.toLowerCase().trim();
      // if (!query) return this.location;

      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
      var query = (((_this$form5 = this.form) === null || _this$form5 === void 0 || (_this$form5 = _this$form5.routing_information) === null || _this$form5 === void 0 ? void 0 : _this$form5.destination_airport) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_departure: function filteredLocations_departure() {
      var _this$form6;
      // const query = this.form.routing_information.departure_airport.toLowerCase().trim();
      // if (!query) return this.location;

      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
      var query = (((_this$form6 = this.form) === null || _this$form6 === void 0 || (_this$form6 = _this$form6.routing_information) === null || _this$form6 === void 0 ? void 0 : _this$form6.departure_airport) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    },
    filteredLocations_issuing: function filteredLocations_issuing() {
      var _this$agent_informati;
      var query = (((_this$agent_informati = this.agent_information) === null || _this$agent_informati === void 0 || (_this$agent_informati = _this$agent_informati.routing_information) === null || _this$agent_informati === void 0 ? void 0 : _this$agent_informati.departure_airport) || '').toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
      // const query = this.agent_information.agent_issue_loc_code.toLowerCase().trim();
      // if (!query) return this.location;
      // return this.location.filter(item =>
      //     item.iata_code.toLowerCase().includes(query)
      // );
    },
    filteredLocations_participant: function filteredLocations_participant() {
      var _this$agent_informati2;
      var query = (_this$agent_informati2 = this.agent_information) === null || _this$agent_informati2 === void 0 || (_this$agent_informati2 = _this$agent_informati2.participate_airport) === null || _this$agent_informati2 === void 0 ? void 0 : _this$agent_informati2.toLowerCase().trim();
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
    },
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
  beforeDestroy: function beforeDestroy() {
    // window.removeEventListener('click', this.closeDropdown_to);
    // window.removeEventListener('click', this.closeDropdown_to2);
    // window.removeEventListener('click', this.closeDropdown_to3);
    // window.removeEventListener('click', this.closeDropdown_from);
    // window.removeEventListener('click', this.closeDropdown_destination);
    // window.removeEventListener('click', this.closeDropdown_departure);
  },
  components: {
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
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
var render=function render(){var _vm=this,_c=_vm._self._c;return _c("b-container",{staticClass:"body-color",attrs:{fluid:""}},[_c("div",{staticClass:"d-flex flex-column flex-lg-row"},[_c("SideBar"),_vm._v(" "),_c("div",{staticStyle:{background:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.4)","box-shadow":"0 10px 30px rgba(53, 85, 148, 0.1)","z-index":"1","border-radius":"32px",width:"100%"}},[_c("div",{staticClass:"container py-8 px-10"},[[_c("b-row",{staticClass:"align-items-center mb-8"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex flex-column"},[_c("span",{staticStyle:{"text-transform":"uppercase","letter-spacing":"2px","font-size":"0.85rem","font-weight":"700",color:"#355594",opacity:"0.6","margin-bottom":"0.5rem",display:"block"}},[_vm._v("Navigation")]),_vm._v(" "),_c("h6",{staticStyle:{color:"#355594","font-size":"26px","line-height":"34px","font-weight":"800","letter-spacing":"-0.5px","margin-bottom":"1rem"}},[_vm._v("Documentation")]),_vm._v(" "),_c("b-form-group",{staticClass:"mb-0",attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{background:"#F0F7FF","border-radius":"12px",padding:"6px 16px",width:"fit-content",border:"1px solid #E6F0FF"}},[_c("b-icon",{staticStyle:{color:"#355594","font-size":"1.2rem","margin-right":"12px"},attrs:{icon:"folder2-open"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"180px",border:"0px !important",color:"#355594","font-weight":"600",background:"transparent",cursor:"pointer",outline:"none","box-shadow":"none","padding-left":"0"},on:{change:_vm.onSelect},model:{value:_vm.selectedViewPageOption,callback:function callback($$v){_vm.selectedViewPageOption=$$v;},expression:"selectedViewPageOption"}},[_c("option",{attrs:{value:"/focus-air"}},[_vm._v("Master Airway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/house-way-bill"}},[_vm._v("Houseway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/consolidation"}},[_vm._v("Consolidation")])])],1)])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-md-end flex-wrap",staticStyle:{gap:"12px","align-items":"center"}},[_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-draft",modifiers:{"modal-draft":true}}],staticClass:"show-btn",staticStyle:{background:"white",color:"#355594",border:"1px solid #E6F0FF","border-radius":"50px",padding:"10px 22px","font-weight":"600",transition:"all 0.3s ease","box-shadow":"0 4px 6px rgba(0,0,0,0.02)"},on:{click:function click($event){$event.preventDefault();return _vm.getAirwayBills("draft");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"file-earmark-text"}}),_vm._v("Drafts\n                                    ")],1),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-s",modifiers:{"modal-s":true}}],staticClass:"show-btn",staticStyle:{background:"white",color:"#355594",border:"1px solid #E6F0FF","border-radius":"50px",padding:"10px 22px","font-weight":"600",transition:"all 0.3s ease","box-shadow":"0 4px 6px rgba(0,0,0,0.02)"},on:{click:function click($event){$event.preventDefault();return _vm.getAirwayBills("send");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"clock-history"}}),_vm._v("10 Latest\n                                    ")],1),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.upload-file-modal",modifiers:{"upload-file-modal":true}}],staticClass:"show-btn",staticStyle:{background:"#355594",color:"white",border:"none","border-radius":"50px",padding:"10px 26px","font-weight":"600",transition:"all 0.3s ease","box-shadow":"0 10px 20px rgba(53,85,148,0.15)"}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"cloud-arrow-up"}}),_vm._v("Upload\n                                    ")],1)],1)]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-draft",title:"My Drafts","hide-footer":true,centered:"",size:"lg"}},[_c("div",{staticClass:"draft-list p-4"},[_vm.data_items.length===0?_c("div",{staticClass:"text-center py-10"},[_c("b-icon",{staticClass:"text-muted mb-4",attrs:{icon:"inbox","font-scale":"3"}}),_vm._v(" "),_c("p",{staticClass:"text-muted font-weight-bold"},[_vm._v("No drafts found.")])],1):_vm._e(),_vm._v(" "),_vm._l(_vm.data_items,function(item){return _c("div",{key:item.id,staticClass:"draft-item d-flex align-items-center justify-content-between p-4 mb-3 rounded-xl border-1",staticStyle:{background:"#f8fafc",border:"1px solid #e2e8f0","border-radius":"12px"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"mr-4"},[_c("b-icon",{attrs:{icon:"file-earmark-text","font-scale":"1.5",variant:"primary"}})],1),_vm._v(" "),_c("div",[_c("p",{staticClass:"mb-0 font-weight-bolder text-dark"},[_vm._v("\n                                                    "+_vm._s(item.awb_code)+"-"+_vm._s(item.awb_no)+"\n                                                ")]),_vm._v(" "),_c("p",{staticClass:"text-muted font-size-sm mb-0"},[_vm._v("\n                                                    Route: "+_vm._s(item.departure_airport?item.departure_airport.split(",")[0]:"-")+" ➔ "+_vm._s(item.destination_airport?item.destination_airport.split(",")[0]:"-")+"\n                                                ")])])]),_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("router-link",{staticClass:"btn btn-sm btn-primary font-weight-bolder px-4 mr-2",staticStyle:{background:"#355594",border:"0","border-radius":"8px"},attrs:{to:"/edit-airway-bill/"+item.id}},[_vm._v("\n                                                Edit\n                                            ")])],1)]);})],2)]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-s",title:"Latest Messages","hide-footer":true,centered:"",size:"lg"}},[_c("div",{staticClass:"message-list p-4"},[_vm.data_items.length===0?_c("div",{staticClass:"text-center py-10"},[_c("b-icon",{staticClass:"text-muted mb-4",attrs:{icon:"chat-dots","font-scale":"3"}}),_vm._v(" "),_c("p",{staticClass:"text-muted font-weight-bold"},[_vm._v("No messages found.")])],1):_vm._e(),_vm._v(" "),_vm._l(_vm.data_items,function(item){return _c("div",{key:item.id,staticClass:"message-item d-flex align-items-center justify-content-between p-4 mb-3 rounded-xl border-1",staticStyle:{background:"#f0f7ff",border:"1px solid #d0e3ff","border-radius":"12px"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"mr-4"},[_c("b-icon",{staticStyle:{color:"#355594"},attrs:{icon:"clock-history","font-scale":"1.5"}})],1),_vm._v(" "),_c("div",[_c("p",{staticClass:"mb-0 font-weight-bolder text-dark"},[_vm._v("\n                                                    "+_vm._s(item.awb_code)+"-"+_vm._s(item.awb_no)+"\n                                                ")]),_vm._v(" "),_c("p",{staticClass:"text-muted font-size-sm mb-0"},[_vm._v("\n                                                    Route: "+_vm._s(item.departure_airport?item.departure_airport.split(",")[0]:"-")+" ➔ "+_vm._s(item.destination_airport?item.destination_airport.split(",")[0]:"-")+"\n                                                ")])])]),_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("router-link",{staticClass:"btn btn-sm font-weight-bolder px-4",staticStyle:{background:"#355594",color:"white",border:"0","border-radius":"8px"},attrs:{to:"/edit-airway-bill/"+item.id}},[_vm._v("\n                                                View\n                                            ")])],1)]);})],2)]),_vm._v(" "),_c("b-modal",{attrs:{id:"upload-file-modal","hide-footer":"","hide-header":"",centered:"",size:"xl","modal-class":"ultra-premium-modal"}},[_c("div",{staticClass:"modal-split-layout"},[_c("button",{staticClass:"ultra-close-btn",on:{click:function click($event){return _vm.$bvModal.hide("upload-file-modal");}}},[_c("b-icon",{attrs:{icon:"x"}})],1),_vm._v(" "),_c("div",{staticClass:"modal-left-pane login-pane"},[_c("div",{staticClass:"pane-content"},[_c("div",{staticClass:"pane-icon-wrapper mb-8"},[_c("b-icon",{attrs:{icon:"cloud-upload","font-scale":"2.5"}})],1),_vm._v(" "),_c("h2",{staticClass:"pane-title"},[_vm._v("Upload Document")]),_vm._v(" "),_c("p",{staticClass:"pane-subtitle"},[_vm._v("Please manually verify each input field extracted by the upload feature. F16s E-freight Solutions is not legally liable for incorrect data sent to the airline. The automated extraction process may contain errors.")]),_vm._v(" "),_c("div",{staticClass:"pane-footer mt-auto"},[_c("div",{staticClass:"pane-feature"},[_c("b-icon",{staticClass:"mr-3",attrs:{icon:"check-circle"}}),_vm._v(" "),_c("span",[_vm._v("Automated Extraction")])],1),_vm._v(" "),_c("div",{staticClass:"pane-feature"},[_c("b-icon",{staticClass:"mr-3",attrs:{icon:"shield-check"}}),_vm._v(" "),_c("span",[_vm._v("Secure Processing")])],1)])]),_vm._v(" "),_c("div",{staticClass:"pane-decoration"}),_vm._v(" "),_c("div",{staticClass:"pane-decoration-2"})]),_vm._v(" "),_c("div",{staticClass:"modal-right-pane"},[_c("div",{staticClass:"form-scroll-container"},[_c("div",{staticClass:"ultra-form"},[_c("h3",{staticClass:"form-section-title mb-10"},[_vm._v("Select File")]),_vm._v(" "),_c("div",{staticClass:"mb-8 text-left"},[_c("label",{staticClass:"font-weight-bold mb-3",staticStyle:{color:"#5A6B8A"}},[_vm._v("Document Type")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control form-control-solid h-auto py-4 px-6 rounded-xl font-size-h6 border-1",staticStyle:{background:"#f8fafc",border:"1px solid #e2e8f0"},model:{value:_vm.selectedUploadType,callback:function callback($$v){_vm.selectedUploadType=$$v;},expression:"selectedUploadType"}},[_c("option",{attrs:{value:"ksr"}},[_vm._v("ksr")]),_vm._v(" "),_c("option",{attrs:{value:"ksr_house1"}},[_vm._v("ksr_house1")]),_vm._v(" "),_c("option",{attrs:{value:"ksr_house2"}},[_vm._v("ksr_house2")]),_vm._v(" "),_c("option",{attrs:{value:"ksr_apex_house"}},[_vm._v("ksr_apex_house")]),_vm._v(" "),_c("option",{attrs:{value:"ksr_ligi_house"}},[_vm._v("ksr_ligi_house")]),_vm._v(" "),_c("option",{attrs:{value:"ksr_cfglobal_house"}},[_vm._v("ksr_cfglobal_house")])])],1),_vm._v(" "),_c("div",{staticClass:"upload-dropzone mb-10",staticStyle:{border:"2px dashed #355594","border-radius":"20px",padding:"60px 20px",cursor:"pointer",background:"rgba(53, 85, 148, 0.02)",transition:"all 0.3s ease"},on:{click:_vm.triggerFileInput}},[_c("div",{staticClass:"text-center"},[_c("div",{staticClass:"mb-4"},[_c("b-icon",{staticStyle:{color:"#355594",opacity:"0.6"},attrs:{icon:"file-earmark-pdf","font-scale":"3"}})],1),_vm._v(" "),_c("p",{staticClass:"mb-0 font-weight-bolder font-size-h5",staticStyle:{color:"#1e3a6e"}},[_vm._v("Click to select PDF")]),_vm._v(" "),_c("p",{staticClass:"text-muted font-size-sm mt-2"},[_vm._v("Maximum file size: 10MB")]),_vm._v(" "),_c("input",{ref:"fileInput",staticStyle:{display:"none"},attrs:{type:"file",accept:".pdf"},on:{change:_vm.handleFileSelect}})])]),_vm._v(" "),_c("div",{staticClass:"form-actions mt-6 d-flex flex-column align-items-center w-100"},[_vm.selectedFile?_c("div",{staticClass:"mb-4 text-primary font-weight-bold"},[_vm._v("Selected: "+_vm._s(_vm.selectedFile.name))]):_vm._e(),_vm._v(" "),_c("button",{staticClass:"ultra-submit-btn",attrs:{disabled:_vm.isUploading},on:{click:_vm.submitUpload}},[!_vm.isUploading?_c("span",[_vm._v("Start Upload")]):_c("span",[_vm._v("Uploading...")]),_vm._v(" "),!_vm.isUploading?_c("b-icon",{staticClass:"btn-icon",attrs:{icon:"arrow-right"}}):_c("b-spinner",{staticClass:"ml-2",attrs:{small:""}})],1)])])])])])])],1)]],2),_vm._v(" "),[_c("b-form",{on:{submit:function submit($event){$event.preventDefault();return _vm.onSubmit.apply(null,arguments);}}},[_c("div",{staticClass:"container"},[_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"ml-8 mr-8"},[_c("b-row",{staticClass:"my-10"},[_c("b-col",{attrs:{cols:"5"}},[_c("div",[_c("div",{staticClass:"d-flex"},[_c("b-form-group",{staticClass:"align-items-center pr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("span",[_vm._v("AWB No:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{"class":{"is-invalid":_vm.form.errors.has("awb_code")},staticStyle:{width:"62px"},attrs:{id:"input-horizontal",required:""},on:{input:_vm.onAWBInput,keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_code",3);}},model:{value:_vm.form.first_box.awb_code,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_code",$$v);},expression:"form.first_box.awb_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("span",[_vm._v("-")])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{"class":{"is-invalid":_vm.form.errors.has("awb_no")},staticStyle:{width:"100px"},attrs:{id:"input-horizontal",required:""},on:{input:_vm.onAWBInput,keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_no",8);}},model:{value:_vm.form.first_box.awb_no,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_no",$$v);},expression:"form.first_box.awb_no"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.first_box.consolidated_mawb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"consolidated_mawb",$$v);},expression:"form.first_box.consolidated_mawb"}},[_vm._v("Consolidate MAWB")])],1)],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_code")},attrs:{form:_vm.form,field:"awb_code"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_no")},attrs:{form:_vm.form,field:"awb_no"}}),_vm._v(" "),_vm.awb_prefix_message?_c("p",{staticClass:"mt-2",staticStyle:{"font-weight":"400","font-size":"12px","line-height":"18px"}},[_vm._v(_vm._s(_vm.awb_prefix_message))]):_vm._e(),_vm._v(" "),_vm.awbId&&_vm.showAWBSection?_c("div",[_c("p",[_vm._v("The Air Waybill number has been used (printed at:)")]),_vm._v(" "),_c("p",[_vm._v("\n                                                        Load content:\n                                                        "),_c("span",{staticStyle:{cursor:"pointer",color:"blue"}},[_c("router-link",{attrs:{to:"/edit-airway-bill/"+_vm.awbId,custom:""},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref){var navigate=_ref.navigate,href=_ref.href;return[_c("p",{on:{click:_vm.confirmReload}},[_vm._v(_vm._s(_vm.formattedAWBId))])];}}],null,false,1732065003)})],1)])]):_vm._e()],1)])]),_vm._v(" "),_c("b-col",{attrs:{cols:"5"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:true},on:{change:function change($event){return _vm.handleRadioChange(true);}},model:{value:_vm.form.first_box.awb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb",$$v);},expression:"form.first_box.awb"}},[_vm._v("AWB")])],1),_vm._v(" "),_c("b-form-group",{attrs:{"label-for":""}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAW"},on:{change:function change($event){return _vm.handleRadioChange("EAW");}},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With No Accompanying Paper\n                                                Documents")])],1),_vm._v(" "),_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAP"},on:{change:function change($event){return _vm.handleRadioChange("EAP");}},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With Accompanying Paper\n                                                Documents")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"2"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm"}},[_vm._v("e-CSD AWB")])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"my-10"},[_c("b-col",{attrs:{cols:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                            Shipper\n                                        ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_shipper",staticClass:"custom-dropdown align-items-center",on:{click:_vm.toggleDropdown_shipper}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.shipper_address.ship_name,expression:"form.shipper_address.ship_name"}],staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_name")},attrs:{type:"text",placeholder:"Search shipper",id:"shipper",autocomplete:"off"},domProps:{value:_vm.form.shipper_address.ship_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.shipper_address,"ship_name",$event.target.value);},_vm.filterShippers],focus:function focus($event){return _vm.toggleDropdown_shipper(true);},blur:_vm.closeDropdown_shipper}}),_vm._v(" "),_vm.isDropdownOpen_shipper&&_vm.filteredShippers.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredShippers,function(shipper,index){return _c("div",{key:shipper.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectShipper(shipper);}}},[_vm._v("\n                                                        "+_vm._s(shipper.name)+"\n                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",staticStyle:{color:"#355594",stroke:"#355594"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showShipper=!_vm.showShipper;}}})],1),_vm._v(" "),_vm.showShipper?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control ship_name_2","class":{"is-invalid":_vm.form.errors.has("ship_name_2")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_name_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_name_2",$$v);},expression:"form.shipper_address.ship_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_account,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_account",$$v);},expression:"form.shipper_address.ship_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,1954229067)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"shipper_address.ship_address",40);}},model:{value:_vm.form.shipper_address.ship_address,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address",$$v);},expression:"form.shipper_address.ship_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address_line_2")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"shipper_address.ship_address_line_2",35);}},model:{value:_vm.form.shipper_address.ship_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address_line_2",$$v);},expression:"form.shipper_address.ship_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,3712382874)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("ship_city")},staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_city,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_city",$$v);},expression:"form.shipper_address.ship_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_airport_code",$$v);},expression:"form.shipper_address.ship_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_city")},attrs:{form:_vm.form,field:"ship_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_airport_code")},attrs:{form:_vm.form,field:"ship_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}],null,false,759624955)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_post_code")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_post_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_post_code",$$v);},expression:"form.shipper_address.ship_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")])])];},proxy:true}],null,false,2699717750)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_state")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_state,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_state",$$v);},expression:"form.shipper_address.ship_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,2615762453)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_country")},model:{value:_vm.form.shipper_address.ship_country,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_country",$$v);},expression:"form.shipper_address.ship_country"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                        "+_vm._s(country.text)+"\n                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_phone")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_phone,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_phone",$$v);},expression:"form.shipper_address.ship_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_fax")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_fax,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_fax",$$v);},expression:"form.shipper_address.ship_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_telex,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_telex",$$v);},expression:"form.shipper_address.ship_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"70px"},attrs:{size:"sm"},model:{value:_vm.form.is_shipper_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_shipper_address_save",$$v);},expression:"form.is_shipper_address_save"}},[_vm._v(" Save new address to address\n                                                book")])],1):_vm._e()]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for\n                                            later logins")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                            Consignee\n                                        ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_consignee",staticClass:"custom-dropdown align-items-center",on:{click:_vm.toggleDropdown_consignee}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.consignee_address.cons_name,expression:"form.consignee_address.cons_name"}],staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name")},attrs:{type:"text",placeholder:"Search consignee",id:"consignee",autocomplete:"off"},domProps:{value:_vm.form.consignee_address.cons_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.consignee_address,"cons_name",$event.target.value);},_vm.filterConsignee],focus:function focus($event){return _vm.toggleDropdown_consignee(true);},blur:_vm.closeDropdown_consignee}}),_vm._v(" "),_vm.isDropdownOpen_consignee&&_vm.filteredConsignees.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredConsignees,function(consignee,index){return _c("div",{key:consignee.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectConsignee(consignee);}}},[_vm._v("\n                                                        "+_vm._s(consignee.name)+"\n                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",staticStyle:{color:"#355594",stroke:"#355594"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showConsignee=!_vm.showConsignee;}}})],1),_vm._v(" "),_vm.showConsignee?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name_2")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_name_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_name_2",$$v);},expression:"form.consignee_address.cons_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_account,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_account",$$v);},expression:"form.consignee_address.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,1954229067)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"consignee_address.cons_address",40);}},model:{value:_vm.form.consignee_address.cons_address,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address",$$v);},expression:"form.consignee_address.cons_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address_line_2")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"consignee_address.cons_address_line_2",35);}},model:{value:_vm.form.consignee_address.cons_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address_line_2",$$v);},expression:"form.consignee_address.cons_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,3712382874)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_city")},staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_city,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_city",$$v);},expression:"form.consignee_address.cons_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"ship_airport_code",$$v);},expression:"form.consignee_address.ship_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_city")},attrs:{form:_vm.form,field:"cons_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_airport_code")},attrs:{form:_vm.form,field:"cons_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}],null,false,759624955)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_post_code")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_post_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_post_code",$$v);},expression:"form.consignee_address.cons_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")])])];},proxy:true}],null,false,2699717750)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_state")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_state,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_state",$$v);},expression:"form.consignee_address.cons_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,2615762453)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_country")},model:{value:_vm.form.consignee_address.cons_country,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_country",$$v);},expression:"form.consignee_address.cons_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                        "+_vm._s(country.text)+"\n                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_phone")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_phone,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_phone",$$v);},expression:"form.consignee_address.cons_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_fax")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_fax,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_fax",$$v);},expression:"form.consignee_address.cons_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_telex,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_telex",$$v);},expression:"form.consignee_address.cons_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"70px"},attrs:{size:"sm"},model:{value:_vm.form.is_consignee_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_consignee_address_save",$$v);},expression:"form.is_consignee_address_save"}},[_vm._v(" Save new address to address book")])],1):_vm._e()])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-tabs",{staticClass:"custom-nav",attrs:{"content-class":"mt-7"}},[_c("b-tab",{staticStyle:{"border-bottom":"0px !important"},attrs:{title:"Routing Information"}},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"5"}},[_c("b-form-group",{staticClass:"align-items-center",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-departure-airport"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Departure Airport:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_departure",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"60%"},on:{click:_vm.toggleDropdown_departure}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.departure_airport,expression:"form.routing_information.departure_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("departure_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search departure",id:"departure",autocomplete:"off"},domProps:{value:_vm.form.routing_information.departure_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"departure_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_departure&&_vm.filteredLocations_departure.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_departure,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_departure(item);}}},[_vm._v(_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("departure_airport")},attrs:{form:_vm.form,field:"departure_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center mt-4",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-destination-airport"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Destination Airport:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_destination",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"60%"},on:{click:_vm.toggleDropdown_destination}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.destination_airport,expression:"form.routing_information.destination_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("destination_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search destination",id:"destination",autocomplete:"off"},domProps:{value:_vm.form.routing_information.destination_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"destination_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_destination&&_vm.filteredLocations_destination.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_destination,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_destination(item);}}},[_vm._v("\n                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("destination_airport")},attrs:{form:_vm.form,field:"destination_airport"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"7"}},[_c("table",{staticClass:"table",staticStyle:{"max-width":"100%",width:"100%"}},[_c("thead",[_c("tr",{},[_c("th",{staticStyle:{color:"#355594"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594"}},[_vm._v("From")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594"}},[_vm._v("To")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594"}},[_vm._v("By")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594"}},[_vm._v("Flight")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594"}},[_vm._v("Date")]),_vm._v(" "),_c("th",{staticStyle:{width:"100%"}})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"7%",padding:"2px"}},[_vm._v("Routing:"),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"28%",padding:"2px"}},[_c("div",{ref:"dropdownContainer_from",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_from}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.from,expression:"form.routing_information.from"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("from")},attrs:{type:"text",placeholder:"Search destination",id:"from_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.from},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"from",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_from&&_vm.filteredLocations_from.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_from,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_from(item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"28%",padding:"2px"}},[_c("div",{ref:"dropdownContainer_to",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_to}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to,expression:"form.routing_information.to"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to")},attrs:{type:"text",placeholder:"Search destination",id:"to_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to&&_vm.filteredLocations_to.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to(item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"10%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by,expression:"form.routing_information.by"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"12%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight,expression:"form.routing_information.flight"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight")},staticStyle:{},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"15%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date,expression:"form.routing_information.date"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"2px"}},[_c("date-picker",{staticStyle:{width:"100%"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date");}}})],1)]),_vm._v(" "),_vm.form.errors.has("from")||_vm.form.errors.has("to")||_vm.form.errors.has("by")||_vm.form.errors.has("flight")||_vm.form.errors.has("date")?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"7%",padding:"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("from")},attrs:{form:_vm.form,field:"from"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("to")},attrs:{form:_vm.form,field:"to"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("by")},attrs:{form:_vm.form,field:"by"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("flight")},attrs:{form:_vm.form,field:"flight"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("date")},attrs:{form:_vm.form,field:"date"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"2px"}},[_vm._v(" ")])]):_vm._e(),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"7%",padding:"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"28%",padding:"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"28%",padding:"2px"}},[_c("div",{ref:"dropdownContainer_to2",staticClass:"custom-dropdown",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_to2}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_2,expression:"form.routing_information.to_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_2")},attrs:{type:"text",placeholder:"Search destination",id:"to2_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_2",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to2&&_vm.filteredLocations_to2.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to2,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to2(item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_2"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"10%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_2,expression:"form.routing_information.by_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_2")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"12%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_2,expression:"form.routing_information.flight_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_2")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"15%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_2,expression:"form.routing_information.date_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_2")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"5%",padding:"2px"}},[_c("date-picker",{staticStyle:{width:"100%"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_2");}}})],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"7%",padding:"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"28%",padding:"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"28%",padding:"2px"}},[_c("div",{ref:"dropdownContainer_to3",staticClass:"custom-dropdown",staticStyle:{width:"100%"},on:{click:_vm.toggleDropdown_to3}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_3,expression:"form.routing_information.to_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_3")},attrs:{type:"text",placeholder:"Search destination",id:"to3_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_3",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to3&&_vm.filteredLocations_to3.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to3,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to3(item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_3"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"10%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_3,expression:"form.routing_information.by_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_3")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"12%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_3,expression:"form.routing_information.flight_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_3")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"15%",padding:"2px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_3,expression:"form.routing_information.date_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_3")},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"2px"}},[_c("date-picker",{staticStyle:{width:"100%"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_3");}}})],1)])])])])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("b-row",[_c("b-col",{attrs:{cols:"6"}},[_c("div",{staticClass:"align-items-center"},[_c("h6",{staticClass:"h-color mb-0"},[_vm._v("Consignment Rate Description")])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"6"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center mr-16"},[_c("p",{staticClass:"mb-0 ml-4 mr-4 h-color",staticStyle:{"border-bottom":"1px solid #2637a8"}},[_vm._v("Get Rates")]),_vm._v(" "),_c("p",{staticClass:"mb-0 ml-4 mr-4 h-color",staticStyle:{"border-bottom":"1px solid #2637a8"}},[_vm._v("Collect house waybill sum's")])])])],1),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-consignment",modifiers:{"modal-consignment":true}}],staticClass:"mt-5 mb-5 add-cons-btn",attrs:{disabled:_vm.isConsignmentAdded},on:{click:_vm.handleAddConsignment}},[_vm._v("Add Consignment Information")]),_vm._v(" "),_c("b-modal",{ref:"modalConsignment",attrs:{id:"modal-consignment",title:"Consignment Information",size:"xl","ok-only":"","hide-footer":""},on:{hide:_vm.handleModalClose}},[_c("b-row",[_c("b-col",{attrs:{cols:"6"}},[_c("h6",{staticStyle:{"margin-bottom":"15px"}},[_vm._v("Pieces and Nature and Quantity of Goods")]),_vm._v(" "),_c("div",{},[_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Pieces"}},[_vm._v("Pieces")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("pieces")},staticStyle:{width:"80px !important","margin-bottom":"10px"},attrs:{id:"input-departure-airport"},model:{value:_vm.consignment_list.pieces,callback:function callback($$v){_vm.$set(_vm.consignment_list,"pieces",$$v);},expression:"consignment_list.pieces"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"pieces"}}),_vm._v(" "),_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Description7"}},[_vm._v("Description")]),_vm._v(" "),_c("b-form-textarea",{"class":{"is-invalid":_vm.consignment_list.errors.has("description")},staticStyle:{height:"70px",width:"400px","margin-bottom":"10px"},attrs:{id:"textarea"},model:{value:_vm.consignment_list.description,callback:function callback($$v){_vm.$set(_vm.consignment_list,"description",$$v);},expression:"consignment_list.description"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"description"}}),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Rate Class:")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Rate class:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("rate_class")},staticStyle:{width:"250px","margin-bottom":"10px"},on:{change:_vm.calculateTotalAmount},model:{value:_vm.consignment_list.rate_class,callback:function callback($$v){_vm.$set(_vm.consignment_list,"rate_class",$$v);},expression:"consignment_list.rate_class"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("CB - Basic rate")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("CC - Specific commodity rate")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("CE - Unit load device additional rate")]),_vm._v(" "),_c("option",{attrs:{value:"K"}},[_vm._v("CK - Rate per kilogram")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("CM - Minimum charge")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("CN - Normal rate")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("CP - International priority service rate")]),_vm._v(" "),_c("option",{attrs:{value:"Q"}},[_vm._v("CQ - Quantity rate")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("CR - Class rate reduction")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("CS - Class rate surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v("CU - Unit load device basic charge or rate")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("CX - Unit load device additional info")]),_vm._v(" "),_c("option",{attrs:{value:"Y"}},[_vm._v("CY - Unit load device discount")]),_vm._v(" "),_c("option",{attrs:{value:"Z"}},[_vm._v("CZ - Mutually Defined")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate_class"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_rate_class,expression:"consignment_list.uld_rate_class"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("uld_rate_class")},staticStyle:{width:"140px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_rate_class},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_rate_class",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"uld_rate_class"}})],1)]),_vm._v(" "),_vm.consignment_list.rate_class?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"},attrs:{colspan:"4"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center"},[_c("span",{staticClass:"mr-2"},[_vm._v("Charge:")]),_vm._v(" "),_c("input",{staticClass:"form-control",staticStyle:{width:"140px"},attrs:{type:"text"},domProps:{value:_vm.calculatedCharge}})])])]):_vm._e(),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Service code")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Commodity Item")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("service_code")},staticStyle:{width:"250px","margin-bottom":"10px"},model:{value:_vm.consignment_list.service_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"service_code",$$v);},expression:"consignment_list.service_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Service Code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Airport to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B - Service Cargo")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Company Material")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Door to Door")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Airport to Door")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Flight Specific")]),_vm._v(" "),_c("option",{attrs:{value:"G"}},[_vm._v("G - Door to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"H"}},[_vm._v("H - Company Mail")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Diplomatic Mail")]),_vm._v(" "),_c("option",{attrs:{value:"J"}},[_vm._v("J - Priority Service")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Small Package Service")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("R - Restricted")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - Substitue Truck")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Charter")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Express Service")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"service_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.commodity_item,expression:"consignment_list.commodity_item"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("commodity_item")},staticStyle:{width:"140px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.commodity_item},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"commodity_item",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("\n                                                                Country Of Origin of Goods\n                                                            ")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Slac:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("country_origin_goods")},staticStyle:{width:"250px","margin-bottom":"10px"},model:{value:_vm.consignment_list.country_origin_goods,callback:function callback($$v){_vm.$set(_vm.consignment_list,"country_origin_goods",$$v);},expression:"consignment_list.country_origin_goods"}},[_c("option",{attrs:{value:""}},[_vm._v(" Select a Country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                        "+_vm._s(country.text)+"\n                                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"country_origin_goods"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.slac,expression:"consignment_list.slac"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("slac")},staticStyle:{width:"140px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.slac},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"slac",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Hs Codes:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center"}},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.hs_code_error.length>0},staticStyle:{width:"140px","margin-right":"10px","margin-bottom":"10px"},attrs:{type:"text"},model:{value:_vm.consignment_list.hs_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"hs_code",$$v);},expression:"consignment_list.hs_code"}}),_vm._v(" "),_c("button",{staticStyle:{"margin-bottom":"10px","border-radius":"30px",color:"#355594",background:"transparent",border:"1px solid #355594",padding:"8px 18px"},on:{click:_vm.addHsCode}},[_vm._v("Add")])],1),_vm._v(" "),_vm.hs_code_error.length?_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.hs_code_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)]):_vm._e()]),_vm._v(" "),_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("HS Codes")])]),_vm._v(" "),_vm._l(_vm.consignment_list.hsCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",[_vm._v(" "+_vm._s(code)+" ")]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.removeHsCode(index);}}})],1)]);})],2)])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"6"}},[_c("h6",{staticStyle:{"margin-bottom":"25px"}},[_vm._v("Weight and Dimensions")]),_vm._v(" "),_c("div",{},[_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Gross Weight")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Rate")])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.gross_weight,expression:"consignment_list.gross_weight"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("gross_weight")},staticStyle:{width:"90px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"gross_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"gross_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("weight_code")},staticStyle:{width:"65px"},model:{value:_vm.consignment_list.weight_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"weight_code",$$v);},expression:"consignment_list.weight_code"}},[_c("option",{attrs:{value:"KGM"}},[_vm._v("Kgs")]),_vm._v(" "),_c("option",{attrs:{value:"LBR"}},[_vm._v("Lbs")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"weight_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.chargable_weight,expression:"consignment_list.chargable_weight"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("chargable_weight")},staticStyle:{width:"115px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.chargable_weight},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"chargable_weight",$event.target.value);},_vm.calculateTotalAmount]}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"chargable_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.rate,expression:"consignment_list.rate"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("rate")},staticStyle:{width:"110px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.rate},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"rate",$event.target.value);},_vm.calculateTotalAmount]}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate"}})],1)])])]),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Pcs")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Wgt")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Length")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Width")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Height")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Unit")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.pcs,expression:"consignment_list.pcs"}],staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.pcs},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"pcs",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.wgt,expression:"consignment_list.wgt"}],staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.wgt},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"wgt",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.length,expression:"consignment_list.length"}],staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.length},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"length",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.width,expression:"consignment_list.width"}],staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.width},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"width",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.height,expression:"consignment_list.height"}],staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.height},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"height",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"65px","background-position-x":"right"},model:{value:_vm.consignment_list.unit,callback:function callback($$v){_vm.$set(_vm.consignment_list,"unit",$$v);},expression:"consignment_list.unit"}},[_c("option",{attrs:{value:"CMT"}},[_vm._v("CMT")]),_vm._v(" "),_c("option",{attrs:{value:"INH"}},[_vm._v("INH")]),_vm._v(" "),_c("option",{attrs:{value:"FOT"}},[_vm._v("FOT")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticStyle:{"border-radius":"30px",color:"#355594",background:"transparent",border:"1px solid #355594",padding:"8px 18px"},on:{click:_vm.addPcsInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.validationErrors.length>0?_c("tr",[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"7"}},[_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.validationErrors,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])])]):_vm._e()])]),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{color:"#000000","font-weight":"500"}},[_vm._v("Pcs")]),_vm._v(" "),_c("th",{staticStyle:{color:"#000000","font-weight":"500"}},[_vm._v("Wgt")]),_vm._v(" "),_c("th",{staticStyle:{color:"#000000","font-weight":"500"}},[_vm._v("Length")]),_vm._v(" "),_c("th",{staticStyle:{color:"#000000","font-weight":"500"}},[_vm._v("Width")]),_vm._v(" "),_c("th",{staticStyle:{color:"#000000","font-weight":"500"}},[_vm._v("Height")]),_vm._v(" "),_c("th",{staticStyle:{color:"#000000","font-weight":"500"}},[_vm._v("Unit")])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.itemss,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.pcs))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.wgt)+" "+_vm._s(_vm.consignment_list.weight_code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.length))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.width))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.height))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",{staticClass:"mr-3"},[_vm._v(_vm._s(row.unit))]),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deletePcs(index);}}})],1)]);}),0)]),_vm._v(" "),_c("table",{staticClass:"table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Volume")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-input",{staticClass:"form-control",staticStyle:{width:"80px"},attrs:{id:"input-horizontal"},model:{value:_vm.consignment_list.volume,callback:function callback($$v){_vm.$set(_vm.consignment_list,"volume",$$v);},expression:"consignment_list.volume"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"70px","background-position-x":"right"},model:{value:this.form.entries.dimention_unit,callback:function callback($$v){_vm.$set(this.form.entries,"dimention_unit",$$v);},expression:"this.form.entries.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1)])])])]),_vm._v(" "),_c("h5",{staticClass:"mt-10 mb-2",staticStyle:{"font-size":"13px","font-weight":"500"}},[_vm._v("ULD Information")]),_vm._v(" "),_c("div",{},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_type,expression:"consignment_list.uld_type"}],staticClass:"form-control",staticStyle:{width:"80px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_type},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_type",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_serial,expression:"consignment_list.uld_serial"}],staticClass:"form-control",staticStyle:{width:"110px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_serial},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_serial",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-2"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.owner,expression:"consignment_list.owner"}],staticClass:"form-control",staticStyle:{width:"110px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.owner},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"owner",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticStyle:{"border-radius":"30px",color:"#355594",background:"transparent",border:"1px solid #355594",padding:"8px 18px"},on:{click:_vm.addUldInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.uld_error.length?_c("tr",{staticStyle:{color:"red"}},[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"4"}},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.uld_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])]):_vm._e()])]),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{color:"000","font-size":"13px","font-weight":"500"}},[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",{staticStyle:{color:"000","font-size":"13px","font-weight":"500"}},[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",{staticStyle:{color:"000","font-size":"13px","font-weight":"500"}},[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_vm._l(_vm.consignment_list.uld_infos,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.uld_type))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.uld_serial))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.owner))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteUldInfo(index);}}})],1)]);})],2)])])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end"},[_c("button",{staticStyle:{"border-radius":"30px",color:"#355594",background:"transparent",border:"1px solid #355594",padding:"8px 18px"},on:{click:_vm.addOrUpdateEntry}},[_vm._v("\n                                            "+_vm._s(_vm.edit_entry_index!==null?"Update":"Add")+"\n                                        ")])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Pcs.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Description")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Srv. Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Com. Itm.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Gross Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Chrg. Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Rate")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Detailed Pcs. Info")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Vol.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("UID Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Charge")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("HS Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Origin Country")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("UID information")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}},[_vm._v("Slac")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"500 !important"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.entries,function(entry,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(entry.pieces))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.description))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.service_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.commodity_item))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.gross_weight)+", "+_vm._s(entry.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.chargable_weight))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate))]),_vm._v(" "),_c("td",_vm._l(entry.itemss,function(pcs,pcsIndex){return _c("div",{key:pcsIndex,staticClass:"mb-1"},[_vm._v("\n                                                            "+_vm._s(pcs.pcs)+"-"+_vm._s(pcs.wgt)+"-"+_vm._s(pcs.weight_code)+"-"+_vm._s(pcs.length)+"x"+_vm._s(pcs.width)+"x"+_vm._s(pcs.height)+"-"+_vm._s(pcs.unit)+"\n                                                        ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.volume))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.uld_rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(_vm.form.totals.total_amount))]),_vm._v(" "),_c("td",_vm._l(entry.hsCodes,function(hs,hsIndex){return _c("div",{key:hsIndex,staticClass:"mb-1"},[_vm._v("\n                                                            "+_vm._s(hs)+"\n                                                        ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.country_origin_goods))]),_vm._v(" "),_c("td",_vm._l(entry.uld_infos,function(uld,uldIndex){return _c("div",{key:uldIndex,staticClass:"mb-1"},[_vm._v("\n                                                            "+_vm._s(uld.uld_type)+"-"+_vm._s(uld.uld_serial)+"-"+_vm._s(uld.owner)+"\n                                                        ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.slac))]),_vm._v(" "),_c("td",{staticClass:"d-flex align-items-center"},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editEntry(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteEntry(index);}}})],1)]);}),0)])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{staticStyle:{"justify-items":"flex-end"},attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-center mr-32 mt-4"},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("div",{staticClass:"mr-2"},[_vm._v("Total Volume:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control mr-2",staticStyle:{width:"140px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.totals.total_volume,callback:function callback($$v){_vm.$set(_vm.form.totals,"total_volume",$$v);},expression:"form.totals.total_volume"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"60px","background-position-x":"right"},model:{value:_vm.form.totals.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form.totals,"dimention_unit",$$v);},expression:"form.totals.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"mr-2 mb-0"},[_vm._v("Total Amount:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control mr-2",staticStyle:{width:"140px"},attrs:{id:"input-horizontal",value:_vm.calculatedCharge}})],1)])],1)])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-2 mb-15 ml-4 mr-4"},[_c("h6",{staticClass:"h-color mb-6"},[_vm._v("Customs Origin Code:")]),_vm._v(" "),_c("b-form-group",{staticStyle:{width:"450px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control",model:{value:_vm.form.custom_origin.customs_origin_code,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"customs_origin_code",$$v);},expression:"form.custom_origin.customs_origin_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select another charge code")]),_vm._v(" "),_c("option",{attrs:{value:"T1"}},[_vm._v("T1 - Goods from outside the EC under Customs Control")]),_vm._v(" "),_c("option",{attrs:{value:"T2"}},[_vm._v("T2 - EC Goods not in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"TE"}},[_vm._v("TE - Goods in trade with Spain subject to duties")]),_vm._v(" "),_c("option",{attrs:{value:"TP"}},[_vm._v("TP - Goods in trade with Portugal subject to special duties")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("TD - Goods already under formal transit procedure")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("TF - Goods in trade between EC and Canary Islands")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Goods in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Goods in free circulation with destination outside the EC")])])],1)],1)])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"pt-4 pb-9"},[_c("b-tabs",{staticClass:"custom-nav",attrs:{"content-class":"mt-3"}},[_c("b-tab",{attrs:{title:"OSI",active:""}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Service Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{"class":{"is-invalid":_vm.form.errors.has("other_service_information")},staticStyle:{height:"80px",width:"60% !important"},attrs:{id:"textarea"},on:{input:_vm.validateTextarea},model:{value:_vm.form.custom_origin.other_service_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"other_service_information",$$v);},expression:"form.custom_origin.other_service_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"other_service_information"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"SSR"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Special Service Request:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{"class":{"is-invalid":_vm.form.errors.has("special_service_request")},staticStyle:{height:"80px",width:"60% !important"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.special_service_request,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"special_service_request",$$v);},expression:"form.custom_origin.special_service_request"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_service_request"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Accounting Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Accounting Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{"class":{"is-invalid":_vm.form.errors.has("accounting_information")},staticStyle:{height:"80px",width:"60% !important"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.accounting_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"accounting_information",$$v);},expression:"form.custom_origin.accounting_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"accounting_information"}})],1),_vm._v(" "),_c("label",{staticClass:"mt-2 mb-0",staticStyle:{width:"90px"},attrs:{"for":"input-horizontal"}},[_vm._v("Letter Of Credit")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"200px"},model:{value:_vm.form.custom_origin.letter_credit,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"letter_credit",$$v);},expression:"form.custom_origin.letter_credit"}},[_c("option",{attrs:{value:"CRN"}},[_vm._v("Credit Card Number")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("Credit Card Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"CRI"}},[_vm._v("Credit Card Issuance Name")]),_vm._v(" "),_c("option",{attrs:{value:"GEN"}},[_vm._v("General Information")]),_vm._v(" "),_c("option",{attrs:{value:"GBL"}},[_vm._v("Government Bill of Lading")]),_vm._v(" "),_c("option",{attrs:{value:"STL"}},[_vm._v("Mode of Settlement")]),_vm._v(" "),_c("option",{attrs:{value:"RET"}},[_vm._v("Return to Origin")]),_vm._v(" "),_c("option",{attrs:{value:"SRN"}},[_vm._v("Shipper's Reference Number")])])],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"Shipment Reference Infomation"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Shipment Reference Information")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Shipment Reference Number:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("shipment_ref_no")},staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.shipment_ref_no,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"shipment_ref_no",$$v);},expression:"form.custom_origin.shipment_ref_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"shipment_ref_no"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Supplementary Shipment Information:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info",$$v);},expression:"form.custom_origin.supplementary_shipment_info"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info_line_2")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info_line_2,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info_line_2",$$v);},expression:"form.custom_origin.supplementary_shipment_info_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info_line_2"}})],1)])])]),_vm._v(" "),_c("b-tab",{attrs:{title:"IATA and Cass"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Override IATA And Cass:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","abel-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"IATA:"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_code,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_code",$$v);},expression:"iata_cass.iata_agent_code"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Cass:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_cass,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_cass",$$v);},expression:"iata_cass.iata_agent_cass"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_iata_login_later,callback:function callback($$v){_vm.$set(_vm.form,"is_iata_login_later",$$v);},expression:"form.is_iata_login_later"}},[_vm._v("Save information for later logins")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Agent Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Agent information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"align-items-center",attrs:{cols:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Override Issuing Agent:")])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_name,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_name",$$v);},expression:"agent_information.agent_name"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_address,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_address",$$v);},expression:"agent_information.agent_address"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"150px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_city,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_city",$$v);},expression:"agent_information.agent_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"150px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_pincode,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_pincode",$$v);},expression:"agent_information.agent_pincode"}})],1)]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Signature:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_issue_sign,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_issue_sign",$$v);},expression:"agent_information.agent_issue_sign"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Location Code:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_issue",staticClass:"custom-dropdown",on:{click:_vm.toggleDropdown_issuing_loc}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_loc_code,expression:"agent_information.agent_issue_loc_code"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("agent_issue_loc_code")},staticStyle:{width:"170px"},attrs:{type:"text",placeholder:"Search location",id:"agent_issue_loc_code",autocomplete:"off"},domProps:{value:_vm.agent_information.agent_issue_loc_code},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_loc_code",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_issuing_loc&&_vm.filteredLocations_issuing.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_issuing,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_issuing_loc(item);}}},[_vm._v("\n                                                                                    "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                                ")]);}),0):_vm._e()])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Date:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_date,expression:"agent_information.agent_issue_date"}],staticClass:"form-control-sm form-control mr-2",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-horizontal"},domProps:{value:_vm.agent_information.agent_issue_date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_date",$event.target.value);}}}),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"agent_information.agent_issue_date");}}})],1)]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Account:")])])];},proxy:true}])},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_account,expression:"agent_information.agent_account"}],staticClass:"form-control-sm form-control",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-horizontal"},domProps:{value:_vm.agent_information.agent_account},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_account",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"align-items-center",attrs:{cols:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Senders Reference:")])]),_vm._v(" "),_c("div",{staticClass:"d-flex mb-6"},[_c("div",{staticStyle:{padding:"0px 20px"}},[_c("b-form-radio",{staticStyle:{"font-size":"14px"},attrs:{name:"participate",size:"sm",value:"0"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Participant")])],1),_vm._v(" "),_c("div",{staticStyle:{padding:"0px 20px"}},[_c("b-form-radio",{staticStyle:{"font-size":"14px"},attrs:{name:"participate",size:"sm",value:"1"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Office")])],1)]),_vm._v(" "),_vm.agent_information.participate==="0"?_c("div",[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Airport:")])])];},proxy:true}],null,false,1576548421)},[_vm._v(" "),_c("div",{ref:"dropdownContainer_participant",staticClass:"custom-dropdown dropdown-container",on:{click:_vm.toggleDropdown_participant_airport}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.participate_airport,expression:"agent_information.participate_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("participate_airport")},attrs:{type:"text",placeholder:"Search location",id:"participant",autocomplete:"off"},domProps:{value:_vm.agent_information.participate_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"participate_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_participant&&_vm.filteredLocations_participant.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_participant,function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_participant_airport(item);}}},[_vm._v("\n                                                                                        "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"participate_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Identifer:")])])];},proxy:true}],null,false,3583013676)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.agent_information.prticipant_identifer,callback:function callback($$v){_vm.$set(_vm.agent_information,"prticipant_identifer",$$v);},expression:"agent_information.prticipant_identifer"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"AIR"}},[_vm._v("Airline AIR")]),_vm._v(" "),_c("option",{attrs:{value:"APT"}},[_vm._v("Airport Authority APT")]),_vm._v(" "),_c("option",{attrs:{value:"AGT"}},[_vm._v("Agent AGT")]),_vm._v(" "),_c("option",{attrs:{value:"BRK"}},[_vm._v("Broker BRK")]),_vm._v(" "),_c("option",{attrs:{value:"CAG"}},[_vm._v("Commissionable Agent CAG")]),_vm._v(" "),_c("option",{attrs:{value:"CNE"}},[_vm._v("Consignee CNE")]),_vm._v(" "),_c("option",{attrs:{value:"CTM"}},[_vm._v("Customs CTM")]),_vm._v(" "),_c("option",{attrs:{value:"DCL"}},[_vm._v("Declarant DCL")]),_vm._v(" "),_c("option",{attrs:{value:"DEC"}},[_vm._v("Deconsolidator DEC")]),_vm._v(" "),_c("option",{attrs:{value:"FFW"}},[_vm._v("Freight Forwarder FFW")]),_vm._v(" "),_c("option",{attrs:{value:"GHA"}},[_vm._v("Ground Handling Agent GHA")]),_vm._v(" "),_c("option",{attrs:{value:"PTT"}},[_vm._v("Post Office PTT")]),_vm._v(" "),_c("option",{attrs:{value:"SHP"}},[_vm._v("Shipper SHP")]),_vm._v(" "),_c("option",{attrs:{value:"TRK"}},[_vm._v("Trucker TRK")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Code:")])])];},proxy:true}],null,false,1003838827)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.participant_code,callback:function callback($$v){_vm.$set(_vm.agent_information,"participant_code",$$v);},expression:"agent_information.participant_code"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Office File Reference:")])])];},proxy:true}],null,false,3658579412)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.office_file_reference,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_file_reference",$$v);},expression:"agent_information.office_file_reference"}})],1)],1):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("div",[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Airport:")])])];},proxy:true}],null,false,991607196)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.agent_information.office_airport,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_airport",$$v);},expression:"agent_information.office_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"BLR"}},[_vm._v("BLR, Bangalore (BLR), India")]),_vm._v(" "),_c("option",{attrs:{value:"AAE"}},[_vm._v("AAE, Annaba (AAE), Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AAH"}},[_vm._v("AAH, Aachen (AAH), Germany")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Function Designator:")])])];},proxy:true}],null,false,3374126151)},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_function_designator,expression:"agent_information.office_function_designator"}],staticClass:"form-control",staticStyle:{width:"250px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_function_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_function_designator",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Company Designator:")])])];},proxy:true}],null,false,4157542050)},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_company_designator,expression:"agent_information.office_company_designator"}],staticClass:"form-control",staticStyle:{width:"250px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_company_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_company_designator",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office File Reference:")])])];},proxy:true}],null,false,1672574578)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.office_file_reference,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_file_reference",$$v);},expression:"agent_information.office_file_reference"}})],1)],1):_vm._e()])],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Also Notify"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Also Notify")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-notify"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Name:")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_alsoNotify",staticClass:"align-items-center custom-dropdown mr-4",on:{click:_vm.toggleDropdown_alsoNotify}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.also_notify_address.also_name,expression:"form.also_notify_address.also_name"}],staticClass:"form-control-sm form-control","class":{"is-invalid":_vm.form.errors.has("also_name")},staticStyle:{width:"315px"},attrs:{type:"text",placeholder:"Search name",id:"also_notify",autocomplete:"off"},domProps:{value:_vm.form.also_notify_address.also_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.also_notify_address,"also_name",$event.target.value);},_vm.filteralsoNotify],focus:function focus($event){return _vm.toggleDropdown_alsoNotify(true);},blur:_vm.closeDropdown_alsoNotify}}),_vm._v(" "),_vm.isDropdownOpen_alsoNotify&&_vm.filteredAlsoNotify.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredAlsoNotify,function(also_notify,index){return _c("div",{key:also_notify.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectAlsoNotifyA(also_notify);}}},[_vm._v("\n                                                                                        "+_vm._s(also_notify.name)+"\n                                                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Letter Of Credit")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_name_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_name_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_name_2",$$v);},expression:"form.also_notify_address.also_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address",$$v);},expression:"form.also_notify_address.also_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address_line_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address_line_2",$$v);},expression:"form.also_notify_address.also_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address_line_2"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-5","class":{"is-invalid":_vm.form.errors.has("also_city")},staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_city,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_city",$$v);},expression:"form.also_notify_address.also_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_airport_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_airport_code",$$v);},expression:"form.also_notify_address.also_airport_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Post Code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_post_code")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_post_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_post_code",$$v);},expression:"form.also_notify_address.also_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_state")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_state,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_state",$$v);},expression:"form.also_notify_address.also_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_country")},staticStyle:{width:"315px"},model:{value:_vm.form.also_notify_address.also_country,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_country",$$v);},expression:"form.also_notify_address.also_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                                "+_vm._s(country.text)+"\n                                                                            ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Phone:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_phone")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_phone,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_phone",$$v);},expression:"form.also_notify_address.also_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Fax:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_fax")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_fax,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_fax",$$v);},expression:"form.also_notify_address.also_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Telex:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_telex,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_telex",$$v);},expression:"form.also_notify_address.also_telex"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_also_notify_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_also_notify_address_save",$$v);},expression:"form.is_also_notify_address_save"}},[_vm._v(" Save new address to address book")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Exta Print Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Extra information printed of Air Way Bill (Only printed - not saved or sent\n                                                            to Airlines):")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-textarea",{staticStyle:{width:"500px",height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.extra_print,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"extra_print",$$v);},expression:"form.custom_origin.extra_print"}})],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Carrier Address"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Override the Carrier Address on the PDF Document")]),_vm._v(" "),_c("h6",{staticStyle:{"font-size":"12px","font-weight":"500"}},[_vm._v("(This can be used for non-IATA carriers)")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"align-items-center mt-5"},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{staticClass:"mr-4",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Carrier Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Public Address")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Carrier Prefix:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("City:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"230px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"60px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Country:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"}})],1)],1)])],1)],1)])])],1)],1)])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Charges:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Code")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v("Amount In INR")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-5 editable-cell align-items-center",staticStyle:{width:"300px","vertical-align":"middle"}},[_c("b-form-group",{staticClass:"d-flex align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.other_charges.other_charge_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_charge_code",$$v);},expression:"other_charges.other_charge_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select an Other Charge Code")]),_vm._v(" "),_vm._l(_vm.other_charges_code,function(charge){return _c("option",{key:charge.value,domProps:{value:charge.value}},[_vm._v("\n                                                                        "+_vm._s(charge.text)+"\n                                                                    ")]);})],2)],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center"},[_c("span",[_vm._v("Or:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"40px"},attrs:{id:"input-horizontal"},model:{value:_vm.other_charges.other_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_code",$$v);},expression:"other_charges.other_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"80px"},model:{value:_vm.other_charges.amount,callback:function callback($$v){_vm.$set(_vm.other_charges,"amount",$$v);},expression:"other_charges.amount"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"A"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Agent")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"C"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Carrier")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"P"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Prepaid")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"C"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Collect")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell align-items-center",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"px-5",staticStyle:{border:"1px solid #355594","border-radius":"30px",background:"#ffffff !important",color:"#355594"},on:{click:_vm.addCharge}},[_vm._v("\n                                                                        "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                    ")])],1)],1)])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Calculated Charges")]),_vm._v(" "),_c("th",{}),_vm._v(" "),_c("th",{})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.chargable_weight1,expression:"other_charges.chargable_weight1"}],staticClass:"form-control",staticStyle:{width:"100px","vertical-align":"middle"},attrs:{type:"text"},domProps:{value:_vm.other_charges.chargable_weight1},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"chargable_weight1",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"vertical-align":"middle"}},[_vm._v("Charge")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.charge,expression:"other_charges.charge"}],staticClass:"form-control",staticStyle:{width:"100px","vertical-align":"middle"},attrs:{type:"text"},domProps:{value:_vm.other_charges.charge},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"charge",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2",staticStyle:{"vertical-align":"middle"}},[_c("b-button",{staticClass:"px-5",staticStyle:{border:"1px solid #355594","border-radius":"30px",background:"#ffffff !important",color:"#355594"},on:{click:_vm.calculateCharge}},[_vm._v("Calculate")])],1)])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Code")]),_vm._v(" "),_c("th",{},[_vm._v("Due")]),_vm._v(" "),_c("th",{},[_vm._v("Amount")]),_vm._v(" "),_c("th",{},[_vm._v("Type Of Payment")]),_vm._v(" "),_c("th",{},[_vm._v("Actions")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.charges,function(charge,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.other_charge_code||charge.other_code)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.due)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.amount)+".00\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.payment_type)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.editCharge(index);}}},[_c("b-icon",{attrs:{icon:"pencil","font-scale":"1"}})],1),_vm._v(" "),_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.removeCharge(index);}}},[_c("b-icon",{attrs:{icon:"trash"}})],1)],1)]);}),0)])])])],1)],1)])]),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-tabs",{staticClass:"custom-nav"},[_c("b-tab",{attrs:{title:"Payment Information"}},[_c("b-row",[_c("b-col",{attrs:{cols:"6"}},[_c("div",{staticClass:"d-flex align-items-center ml-3 mt-6",staticStyle:{"justify-content":"space-between","margin-bottom":"4px !important"}},[_c("div",{staticStyle:{"float":"left"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Type Of Payment:"}},[_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"205px"},model:{value:_vm.form.payment_info.type_of_payment,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"type_of_payment",$$v);},expression:"form.payment_info.type_of_payment"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("CA - Partial collect credit - partial prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"CB"}},[_vm._v("CB - Partial collect credit - partial prepaid credit")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CC - All charges collect")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("CG - All Charges collect by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("CP - Destination collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("CX - Destination collect credit")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("NC - Service rate. No charge")]),_vm._v(" "),_c("option",{attrs:{value:"PC"}},[_vm._v("PC - Partial prepaid cash - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PD"}},[_vm._v("PD - Partial prepaid credit - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("PG - All charges prepaid by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PP - All charges prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"PX"}},[_vm._v("PX - All charges prepaid credit")])])],1)],1),_vm._v(" "),_c("div",{staticStyle:{"float":"right"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex"},[_c("span",[_vm._v("Currency:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("currency")},staticStyle:{width:"60px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.currency,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"currency",$$v);},expression:"form.payment_info.currency"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"currency"}})],1)],1)]),_vm._v(" "),_c("div",{staticClass:"ml-3 mt-4 mb-4"},[_c("h6",{staticStyle:{"font-size":"13px","font-weight":"400"}},[_vm._v("Declared Values For:")])]),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Carriage:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_carriage,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_carriage",$$v);},expression:"form.payment_info.declear_value_carriage"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Customs:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_customs,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_customs",$$v);},expression:"form.payment_info.declear_value_customs"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Insurance:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_insurance,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_insurance",$$v);},expression:"form.payment_info.declear_value_insurance"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"6"}},[_c("div",{staticClass:"d-flex justify-content-end"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Prepaid")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px",width:"100px"}},[_vm._v("Collect")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Weight Charge (WT)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.prepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.collect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Taxes (TX)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.taxes.toFixed(2))+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Agent (OA)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentPrepaid)+" INR\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentCollect)+" INR\n                                                                ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Carrier (OC)\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierPrepaid)+" INR\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierCollect)+" INR\n                                                                ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Total Charges")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChargesPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChrage)+" INR")])])])])])])],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Special Handling Codes"}},[_c("b-row",[_c("div",{staticClass:"d-flex mt-6 ml-3"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("special_handling_code")},staticStyle:{width:"430px"},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select Special Handling Codes")]),_vm._v(" "),_vm._l(_vm.codes,function(code){return _c("option",{key:code.value,domProps:{value:code.value}},[_vm._v(_vm._s(code.text))]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_handling_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex"},[_c("span",[_vm._v("Or:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"60px"},attrs:{id:"input-horizontal"},model:{value:_vm.custom_special_handling_code,callback:function callback($$v){_vm.custom_special_handling_code=$$v;},expression:"custom_special_handling_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticStyle:{padding:"6px 30px",border:"1px solid #355594","border-radius":"30px",background:"#ffffff !important",color:"#355594"},attrs:{id:"input-horizontal",type:"button"},on:{click:_vm.addManualCode}},[_vm._v("Add")])],1)],1)],1)]),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-7"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("td",{staticClass:"editable-cell",staticStyle:{padding:"5px","font-size":"12px","font-weight":"400"}},[_vm._v("Code")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{padding:"5px","font-size":"12px","font-weight":"400"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.tableCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteSplCode(index);}}})],1)]);}),0)])])])],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Other Customs Information"}},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-6"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Customs Information:")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-start py-5"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Country Code:")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Information Identifier:")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Customs Information Identifier")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("country_code")},model:{value:_vm.oci_info.country_code,callback:function callback($$v){_vm.$set(_vm.oci_info,"country_code",$$v);},expression:"oci_info.country_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                                    "+_vm._s(country.text)+"\n                                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"country_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("info_identifier")},model:{value:_vm.oci_info.info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"info_identifier",$$v);},expression:"oci_info.info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_identifiers.identifiers,function(oci_option){return _c("option",{key:oci_option.value,domProps:{value:oci_option.value}},[_vm._v("\n                                                                                    "+_vm._s(oci_option.text)+"\n                                                                                ")]);}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"info_identifier"}})],2)],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("custom_info_identifier")},model:{value:_vm.oci_info.custom_info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"custom_info_identifier",$$v);},expression:"oci_info.custom_info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_data.oci_custom_info_identifier,function(oci_options){return _c("option",{key:oci_options.value,domProps:{value:oci_options.value}},[_vm._v("\n                                                                                    "+_vm._s(oci_options.text)+"\n                                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"custom_info_identifier"}})],1)],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell px-5"},[_vm._v("Supplementary Information:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell px-4"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.oci_info.supplementary_info,expression:"oci_info.supplementary_info"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_info")},staticStyle:{width:"300px"},attrs:{type:"text"},domProps:{value:_vm.oci_info.supplementary_info},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.oci_info,"supplementary_info",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_info"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label align-items-end justify-content-end",staticStyle:{display:"flex",width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"form-control-sm px-5",staticStyle:{"border-radius":"30px",color:"#355594",background:"#ffffff !important",border:"1px solid #355594",padding:"6px 30px"},on:{click:_vm.addOtherCustomInfo}},[_vm._v("\n                                                                                "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                            ")])],1)],1)])])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-4"},[_c("h6",{staticClass:"mb-4 h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Upload Other Customs Information:")]),_vm._v(" "),_c("b-form-textarea",{staticStyle:{width:"1000px !important",height:"80px"},attrs:{id:"textarea"}})],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-3 d-flex justify-content-end",staticStyle:{"max-width":"1000px"}},[_c("b-button",{staticStyle:{"border-radius":"30px",padding:"6px 30px",color:"#2637a8",background:"#ffffff !important",border:"1px solid #2637a8"}},[_vm._v("Upload")])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-6"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"40%"}},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v("Other Customs\n                                                                    Information")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")])]),_vm._v(" "),_vm._l(_vm.form.oci_entries,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.country_code)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.info_identifier)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.custom_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.supplementary_info))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editOciInfo(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteOciInfo(index);}}})],1)]);})],2)])])])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{staticClass:"text-right",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-horizontal",label:"Email FNA 2:"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.awb_email,callback:function callback($$v){_vm.$set(_vm.form,"awb_email",$$v);},expression:"form.awb_email"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex text-left ml-4 mt-4"},[_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Including Cargo\n                                                Label")]),_vm._v(" "),_c("p",{staticClass:"pl-18"},[_vm._v("(separate addresses with a semicolon ';')")])],1)],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"py-10"},[_vm.pdf_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.pdf_error_msg)}})]):_vm._e(),_vm._v(" "),_vm.showSpinner?_c("div",{staticClass:"spin",staticStyle:{"margin-top":"20px"}}):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-between"},[_vm.is_generate_pdf?_c("div",{staticClass:"mb-24",staticStyle:{"box-shadow":"0px 3px 15px 0px #0013","border-radius":"12px",width:"100%"}},[_c("div",{staticStyle:{display:"flex",width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{display:"flex","justify-content":"start",color:"#355594","font-size":"15px","line-height":"71px","font-weight":"500",width:"100%"}},[_vm._v("Cargo document created")]),_vm._v(" "),_c("div",{staticStyle:{display:"flex","justify-content":"end","line-height":"71px","align-self":"center",width:"100%"},on:{click:function click($event){return _vm.isGeneratePdf(_vm.generateButton=0);}}},[_c("img",{staticStyle:{width:"24px",height:"24px",cursor:"pointer"},attrs:{src:"/media/assets/ui/cross.png",alt:"cross button"}})])]),_vm._v(" "),_c("div",{staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{width:"100%"}},[_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"13px","font-weight":"400",margin:"0"}},[_vm._v("Airway bill message saved in database")]),_vm._v(" "),_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"18px","font-weight":"400","border-bottom":"1px solid #CDCDCD","padding-bottom":"15px"}},[_vm._v("PDF documents prepared")])])]),_vm._v(" "),_c("div",{staticClass:"mb-16",staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("e-AWB Pdf file")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-multiple-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage e-AWB Pdf")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-multiple-both-page-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage e-AWB Pdf with back pages")])])])]):_vm._e()]),_vm._v(" "),_vm.main_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.main_error_msg)}})]):_vm._e(),_vm._v(" "),_vm.successMessage?_c("div",{staticStyle:{"font-weight":"bold",display:"flex","justify-content":"flex-end","text-align":"right"}},[_c("span",[_vm._v("\n                                        "+_vm._s(_vm.successMessage.split("-Pass")[0])+"\n                                        "),_c("span",{staticStyle:{color:"green"}},[_vm._v("-Pass")])])]):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end submit-button"},[_c("b-button",{staticClass:"mr-2",staticStyle:{"border-radius":"30px",padding:"6px 30px",color:"#2637a8",background:"#ffffff !important",border:"1px solid #2637a8"},attrs:{type:"button"},on:{click:function click($event){_vm.isGeneratePdf(_vm.generateButton=1);_vm.form.status="generate_pdf";}}},[_vm._v("Generate PDF")]),_vm._v(" "),_vm.current_user.can_send?_c("div",[_c("b-button",{staticClass:"mr-2",staticStyle:{"border-radius":"30px",padding:"6px 30px",color:"#2637a8",background:"#ffffff !important",border:"1px solid #2637a8"},attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send")]),_vm._v(" "),_c("b-button",{staticClass:"mr-2",staticStyle:{"border-radius":"30px",padding:"6px 30px",color:"#2637a8",background:"#ffffff !important",border:"1px solid #2637a8"},attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send & Clear")])],1):_vm._e(),_vm._v(" "),_vm.form.first_box.status!="send"?_c("div",[_c("b-button",{staticStyle:{"border-radius":"30px",padding:"6px 30px",color:"#2637a8",background:"#ffffff !important",border:"1px solid #2637a8"},attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="draft";}}},[_vm._v(_vm._s(_vm.submitButtonText))])],1):_vm._e()],1)])],1)])]],2)],1)]);};var staticRenderFns=[];render._withStripped=true;

/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n/* file upload css */\n.upload-container[data-v-b6aec42e] {\n    max-width: 400px;\n    margin: 0 auto;\n}\n.upload-box[data-v-b6aec42e] {\n    border: 2px dashed #d0d5dd;\n    border-radius: 12px;\n    padding: 60px 40px;\n    text-align: center;\n    background-color: #ffffff;\n    transition: all 0.3s ease;\n    cursor: pointer;\n}\n.upload-box[data-v-b6aec42e]:hover {\n    border-color: #4a5568;\n    background-color: #f8f9fa;\n}\n.upload-icon[data-v-b6aec42e] {\n    width: 60px;\n    height: 60px;\n    margin: 0 auto 24px;\n    background: linear-gradient(135deg, #e3f2fd 0%, #f5f9ff 100%);\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.upload-icon svg[data-v-b6aec42e] {\n    width: 32px;\n    height: 32px;\n    color: #4a6fa5;\n}\n.upload-text[data-v-b6aec42e] {\n    color: #4a6fa5;\n    font-size: 16px;\n    font-weight: 500;\n    margin-bottom: 8px;\n}\n.upload-divider[data-v-b6aec42e] {\n    color: #6b7280;\n    font-size: 14px;\n    margin: 12px 0;\n}\n.upload-link[data-v-b6aec42e] {\n    color: #4a6fa5;\n    font-size: 14px;\n    text-decoration: underline;\n    cursor: pointer;\n}\n.upload-link[data-v-b6aec42e]:hover {\n    color: #3b5a8a;\n}\n#fileInput[data-v-b6aec42e] {\n    display: none;\n}\n/* end of file upload css */\n.body-color[data-v-b6aec42e] {\n}\nheader[data-v-b6aec42e] {\n    width: 100%;\n    background-color: #2637a8;\n}\n.h-color[data-v-b6aec42e] {\n    color: #2637a8;\n}\n.h_background_color[data-v-b6aec42e] {\n    background-color: #2637a8;\n    color: white;\n}\n#nav[data-v-b6aec42e] {\n    display: flex;\n    /* align-items: center;\n    justify-content: center; */\n    width: 100%;\n    max-width: 1280px;\n    /* margin: 0 auto; */\n}\n#nav>ul[data-v-b6aec42e] {\n    display: flex;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n#nav>ul>li[data-v-b6aec42e]:hover {\n    background-color: gray;\n}\n#nav>ul>li>span[data-v-b6aec42e]:after {\n    display: inline-block;\n}\n#nav>ul>li>a[data-v-b6aec42e] {\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n}\n#nav>ul>li>span[data-v-b6aec42e] {\n    position: relative;\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n    cursor: pointer;\n}\nli[data-v-b6aec42e] {\n    border-right: 1px solid white;\n}\n#nav>ul>li>span[data-v-b6aec42e]:after {\n    /* content: '▼'; */\n    display: inline-block;\n}\n.dropdown[data-v-b6aec42e] {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    display: none;\n    padding: 0;\n    list-style-type: none;\n    background-color: gray;\n}\n.dropdown li[data-v-b6aec42e] {\n    /* width: 250px; */\n    width: 150px;\n    border-bottom: 1px solid #fff;\n}\n.dropdown li a[data-v-b6aec42e] {\n    display: block;\n    /* padding: 10px; */\n    padding-left: 5px;\n    color: #fff;\n    text-decoration: none;\n}\n.isOpen[data-v-b6aec42e] {\n    display: block;\n}\n.custom-btn[data-v-b6aec42e] {\n    transition: background-color 0.3s;\n}\n.show-btn[data-v-b6aec42e] {\n  border-radius:30px;\n  border:1px solid #355594;\n  padding:6px 30px;\n  color:#355594;\n  background:#ffffff;\n}\n.custom-btn[data-v-b6aec42e]:hover {\n    background-color: #007bff !important;\n    color: white !important;\n}\n.form-group[data-v-b6aec42e] {\n    margin-bottom: 0px !important;\n}\n.form-control-sm[data-v-b6aec42e] {\n    /* height: 0px !important; */\n}\n.shipper-toggle-label[data-v-b6aec42e] {\n    width: 60px;\n    display: inline-block;\n    text-align: end;\n}\n.routing-info-label[data-v-b6aec42e] {\n    width :130px;\n    display: inline-block;\n    text-align: end;\n}\n.form-row[data-v-b6aec42e] {\n    flex-wrap: nowrap !important;\n}\n.col-form-label[data-v-b6aec42e] {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n    margin-bottom: 0 !important;\n    font-size: inherit !important;\n    line-height: 1.5 !important;\n}\n.background-color[data-v-b6aec42e] {\n    background-color: grey;\n}\n.hr[data-v-b6aec42e] {\n    border-top: 2px solid #CDCDCD;\n}\n.aselect[data-v-b6aec42e] {\n    position: relative;\n    width: 200px;\n    /* Adjust the width as needed */\n}\n.selector.box[data-v-b6aec42e] {\n    position: relative;\n}\n.custom-select[data-v-b6aec42e] {\n    appearance: none;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"34\" viewBox=\"0 0 24 24\"><path fill=\"black\" d=\"M7 10l5 5 5-5z\"/></svg>') no-repeat right center;\n    background-color: white;\n    /* border: 1px solid #ccc; */\n    /* padding: 10px 40px 10px 10px; */\n    font-size: 14px;\n    /* padding: 2px; */\n    cursor: pointer;\n    width: 100%;\n}\n.custom-select[data-v-b6aec42e]:focus {\n    outline: none;\n    border-color: #5cb3fd;\n}\n.mh-100vh[data-v-b6aec42e] {\n    /* min-height: 100vh; */\n}\n.table[data-v-b6aec42e] {\n    max-width: 400px;\n    border: 0;\n}\ntd.editable-cell1[data-v-b6aec42e] {\n    border: 1 solid gray !important;\n}\ntd.editable-cell[data-v-b6aec42e] {\n    border: 0 !important;\n}\nth[data-v-b6aec42e] {\n    border: 0 !important;\n}\n.shipper-form-control[data-v-b6aec42e], .consignee-form-control[data-v-b6aec42e] {\n    border: 1px solid #A6A6A6;\n    width: 300px;\n    height: 38px;\n}\n.form-control[data-v-b6aec42e] {\n    border: 1px solid #A6A6A6;\n    height: 38px;\n}\n.form-control1[data-v-b6aec42e] {\n    border: 2px solid gray;\n    width: 150px;\n    height: 25px;\n}\n.add-cons-btn[data-v-b6aec42e] {\n    border: 1px solid #355594 !important;\n    border-radius: 30px !important;\n    color: #355594 !important;\n    background: #fff !important;\n}\n.custom-link[data-v-b6aec42e] {\n    display: block;\n    margin-bottom: 0.5rem;\n    color: #4C4C4C;\n    text-decoration: underline;\n}\n.custom-link[data-v-b6aec42e]:hover {\n    color: #355594;\n    -webkit-text-decoration: underline #355594 !important;\n            text-decoration: underline #355594 !important;\n    text-decoration-color: #355594;\n}\n.custom-link-custom[data-v-b6aec42e] {\n    display: block;\n    margin-bottom: 0.5rem;\n    color:#355594;\n    text-decoration: none;\n}\n.custom-link-custom[data-v-b6aec42e]:hover {\n    /* color: #2637a8; */\n    -webkit-text-decoration: underline #355594 !important;\n            text-decoration: underline #355594 !important;\n    text-decoration-color: #355594;\n}\n.column_b[data-v-b6aec42e] {\n    border: 1px solid #b1b1b1;\n}\n.custom-dropdown[data-v-b6aec42e] {\n  position: relative;\n  display: inline-block;\n}\n.dropdown-options[data-v-b6aec42e] {\n    position: absolute;\n    border: 1px solid #E4E6EF;\n    border-radius: 5px;\n    box-shadow: 0px 3px 15px 0px #00000013;\n    background-color: #fff;\n    border-top: none;\n    max-height: 200px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    z-index: 1;\n    width: 100%;\n}\n.option[data-v-b6aec42e] {\n    padding: 5px 10px;\n    cursor: pointer;\n    border-radius: 0px !important;\n    padding: 0px 4px !important;\n    border: 0px !important;\n}\n.option[data-v-b6aec42e]:hover {\n  background-color: #f0f0f0;\n}\n    /* Ultra-Premium Modal Styles from Header */\n.ultra-premium-modal .modal-dialog[data-v-b6aec42e] {\n        max-width: 1000px !important;\n        margin: 1.75rem auto;\n}\n.ultra-premium-modal .modal-content[data-v-b6aec42e] {\n        background: transparent !important;\n        border: none !important;\n        border-radius: 32px !important;\n        box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;\n        font-family: 'Inter', sans-serif !important;\n        overflow: hidden;\n        animation: fadeInUp-b6aec42e 0.4s ease;\n}\n.ultra-premium-modal .modal-body[data-v-b6aec42e] {\n        padding: 0 !important;\n        background: #ffffff;\n}\n@keyframes fadeInUp-b6aec42e {\nfrom { opacity: 0; transform: translateY(20px) scale(0.98);\n}\nto { opacity: 1; transform: translateY(0) scale(1);\n}\n}\n.modal-split-layout[data-v-b6aec42e] { display: flex; flex-direction: row; min-height: 600px; position: relative; width: 100%; align-items: stretch;\n}\n.ultra-close-btn[data-v-b6aec42e] { position: absolute; top: 25px; right: 25px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.05); border: none; color: #5A6B8A; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; z-index: 50; transition: all 0.3s ease;\n}\n.ultra-close-btn[data-v-b6aec42e]:hover { background: #ef4444; color: white; transform: rotate(90deg);\n}\n.modal-left-pane[data-v-b6aec42e] { flex: 0 0 40%; padding: 4rem 3.5rem; position: relative; overflow: hidden; color: white; display: flex; flex-direction: column; background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n}\n.login-pane[data-v-b6aec42e] { text-align: left;\n}\n.pane-content[data-v-b6aec42e] { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column;\n}\n.pane-icon-wrapper[data-v-b6aec42e] { width: 80px; height: 80px; background: rgba(255,255,255,0.25); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 1px solid rgba(255,255,255,0.2);\n}\n.pane-title[data-v-b6aec42e] { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.5px; line-height: 1.1; color: white !important;}\n.pane-subtitle[data-v-b6aec42e] { font-size: 1.1rem; line-height: 1.7; opacity: 0.85; color: white !important;}\n.pane-feature[data-v-b6aec42e] { display: flex; align-items: center; margin-bottom: 1rem; font-size: 1rem; font-weight: 500; color: white !important;}\n.pane-decoration[data-v-b6aec42e] { position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: 1;\n}\n.pane-decoration-2[data-v-b6aec42e] { position: absolute; bottom: -150px; left: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: 1;\n}\n.modal-right-pane[data-v-b6aec42e] { flex: 0 0 60%; background: white; position: relative; display: flex; flex-direction: column;\n}\n.form-scroll-container[data-v-b6aec42e] { height: 100%; overflow-y: auto; padding: 4rem;\n}\n.form-section-title[data-v-b6aec42e] { font-size: 1.8rem; font-weight: 700; color: #1e3a6e; letter-spacing: -0.5px; text-align: center;\n}\n.ultra-submit-btn[data-v-b6aec42e] { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none;\n}\n.ultra-submit-btn[data-v-b6aec42e]:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35);\n}\n.ultra-submit-btn span[data-v-b6aec42e] { color: white; font-weight: 500; margin-right: 14px;\n}\n.ultra-submit-btn .btn-icon[data-v-b6aec42e] { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important;\n}\n@media (max-width: 991px) {\n.modal-split-layout[data-v-b6aec42e] { flex-direction: column; min-height: auto;\n}\n.modal-left-pane[data-v-b6aec42e] { flex: 0 0 auto; padding: 3rem 2rem;\n}\n.pane-title[data-v-b6aec42e] { font-size: 1.8rem;\n}\n.pane-icon-wrapper[data-v-b6aec42e] { width: 60px; height: 60px; margin-bottom: 1.5rem !important;\n}\n.modal-right-pane[data-v-b6aec42e] { flex: 0 0 auto;\n}\n.form-scroll-container[data-v-b6aec42e] { padding: 3rem 2rem; height: auto; max-height: 60vh;\n}\n.ultra-close-btn[data-v-b6aec42e] { top: 15px; right: 15px; background: rgba(255,255,255,0.2); color: white;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.modal-content {\n    border-radius: 20px !important;\n    padding: 0rem 2rem 2rem !important;\n}\n.modal-header {\n    padding: 1rem 0rem !important;\n    border-bottom: 0px !important;\n}\n.modal .modal-header .modal-title {\n    color: #355594 !important;\n}\n.modal-header > .close {\n    font-size: 2rem !important;\n}\n.modal .modal-header .close:hover {\n    color: #355594 !important;\n}\n.custom-nav .nav-tabs {\n    border-bottom: 0px !important;\n}\n.custom-nav .nav-link {\n    color: #355594 !important;\n    font-weight: 400 !important;\n    font-size: 12px !important;\n    border: none !important;\n    padding: 0px !important;\n    margin: 0px 10px !important;\n}\n.custom-nav .nav-link:hover,\n.custom-nav .nav-link.active {\n    border-bottom: 2px solid #355594 !important;\n}\n.mx-input {\n    display: inline-block;\n    box-sizing: border-box;\n    width: 100%;\n    /* height: 34px; */\n    padding: 0px !important;\n    color:  #355594 !important;\n    border: 0px !important;\n    box-shadow: inset 0 1px 1px #fff;\n}\n.mx-icon-calendar, .mx-icon-clear {\n    position: absolute;\n    top: 50%;\n    right: 0px !important;\n    transform: translateY(-50%);\n    font-size: 20px;\n    line-height: 1;\n    color: #355594 !important;\n    stroke: #355594 !important;\n    vertical-align: middle;\n}\n.btn {\n    /* padding: 0px !important; */\n}\n/* Spinner Styles */\n.spin {\n    border: 4px solid #f3f3f3;\n    border-top: 4px solid #355594;\n    border-radius: 50%;\n    width: 40px;\n    height: 40px;\n    animation: spin 1s linear infinite;\n    margin: 0 auto;\n}\n@keyframes spin {\n0% { transform: rotate(0deg);\n}\n100% { transform: rotate(360deg);\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");


/***/ })

}]);