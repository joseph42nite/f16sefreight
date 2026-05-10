"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Test_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      form: new Form({
        first_box: {
          awb_code: '',
          awb_no: '',
          consolidated_MAWB: false,
          awb: true
        },
        shipper_address: {
          ship_name: '',
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
          total_amount: 0
        },
        custom_origin: {
          customs_origin_code: null,
          other_service_information: '',
          special_service_request: '',
          accounting_information: '',
          letter_credit: '',
          shipment_ref_no: null,
          supplementary_shipment_Info: '',
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
        is_also_notify_address_save: false
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
        dimention_unit: 'MTQ',
        //cm3,m3,ft3

        uld_type: '',
        uld_serial: '',
        owner: '',
        itemss: [],
        hsCodes: [],
        uld_info: []
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
      searchQuery_to: '',
      isDropdownOpen_to: {
        departure_airport: false,
        destination_airport: false,
        from: false,
        to: false,
        to_2: false,
        to_3: false
      },
      activeField: null,
      selectedCode: '',
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
      editIndex: null,
      edit_entry_index: null,
      items: [{
        url: "#webdoc",
        name: "WebDoc"
      }, {
        url: "#booking",
        name: "Booking(FFR)"
      }, {
        url: "#webdoc",
        name: "WebDoc",
        children: [{
          url: "#booking",
          name: "Booking(FFR)"
        }, {
          url: "#air_waybill",
          name: "Air Waybill(FWB)"
        }, {
          url: "/house-way-bill",
          name: "House Waybill(FHL)"
        }, {
          url: "#consolidation",
          name: "Consolidation(FHL)"
        }, {
          url: "#import_mail_data",
          name: "Import Mail Data"
        }, {
          url: "#create_label",
          name: "Create Label"
        }, {
          url: "message-log",
          name: "Message Log"
        }, {
          url: "#maintain_contracts",
          name: "Maintain Contracts"
        }, {
          url: "#web_doc_printer_setup",
          name: "WebDoc Printer Setup"
        }, {
          url: "#help",
          name: "Help"
        }]
      }, {
        url: "#contact",
        name: "Contact"
      }],
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
    mouseover: function mouseover() {
      this.isOpen = true;
    },
    mouseleave: function mouseleave() {
      this.isOpen = false;
    },
    converXml: function converXml(awb_no) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/waybill/".concat(awb_no)).then(function (_ref) {
        var data = _ref.data;
      } // console.log(data);
      );
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
    getCurrentDate: function getCurrentDate() {
      var today = new Date();
      var day = today.getDate().toString().padStart(2, '0');
      var month = today.toLocaleString('en-GB', {
        month: 'short'
      });
      return "".concat(day).concat(month);
    },
    formatDate: function formatDate(date) {
      if (!date) return '';
      var day = new Date(date).getDate().toString().padStart(2, '0');
      var month = new Date(date).toLocaleString('en-GB', {
        month: 'short'
      });
      return "".concat(day).concat(month);
    },
    handleDateChange: function handleDateChange(date) {
      this.form.date = this.formatDate(date);
    },
    issueDateChange: function issueDateChange(date) {
      this.form.issue_date = this.formatDate(date);
    },
    // location
    getLocation: function getLocation() {
      var _this = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-location").then(function (_ref2) {
        var data = _ref2.data;
        _this.location = data;
        // console.log('location',data);
      });
    },
    onSubmit: function onSubmit(evt) {
      evt.preventDefault();
      this.form.post("/create-webdoc").then(function (response) {
        // console.log(response);
      });
    },
    addDraft: function addDraft() {
      this.form.post('/add-houseway-bill').then(function (response) {
        // console.log('Add Successful:', response);
      })["catch"](function (error) {
        // console.error('Add Failed:', error);
      });
    },
    updateDraft: function updateDraft() {
      this.form.put("/update-houseway-bill/".concat(this.existingData.id)).then(function (response) {
        // console.log('Update Successful:', response);
      })["catch"](function (error) {
        // console.error('Update Failed:', error);
      });
    },
    getAgent: function getAgent() {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/agent-info/").then(function (_ref3) {
        var data = _ref3.data;
        if (Array.isArray(data) && data.length > 0) {
          _this2.agent_information = data[0];
          _this2.iata_cass = {
            iata_agent_code: _this2.agent_information.iata_agent_code || null,
            iata_agent_cass: _this2.agent_information.iata_agent_cass || null
          };
        } else {
          _this2.agent_information = data;
        }
      })["catch"](function (error) {
        // console.error("Error fetching agent information:", error);
      });
    },
    handleRadioChange: function handleRadioChange() {
      var selectedCode = this.selectedCode;
      this.form.tableCodes = [];
      this.form.tableCodes.push(selectedCode);
    },
    addManualCode: function addManualCode() {
      var code = this.selectedCode || this.manualCode.trim();
      if (code) {
        if (!this.form.tableCodes.includes(code)) {
          this.form.tableCodes.push(code);
          // console.log("Table code ", this.form.tableCodes);
        } else {
          alert('This code is already added.');
        }
      } else {
        alert('Please select or enter a code.');
      }
      this.selectedCode = '';
      this.manualCode = '';
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
    calculateCharge: function calculateCharge() {
      var chargeRate = parseFloat(this.other_charges.charge);
      var weight = parseFloat(this.other_charges.chargable_weight1);
      if (!isNaN(weight) && this.other_charges.charge > 0 && !isNaN(chargeRate) && chargeRate > 0) {
        var calculatedAmount = weight * chargeRate;
        this.other_charges.amount = calculatedAmount.toFixed(2);
      } else {
        alert('Please enter valid numeric values for chargeable weight and charge rate.');
      }
    },
    addCharge: function addCharge() {
      if (!this.other_charges.other_charge_code) {
        alert("Other charge code is mandatory.");
        return;
      }
      var amount = parseFloat(this.other_charges.amount);
      if (isNaN(amount) || amount <= 0) {
        alert("Amount is mandatory and must be a valid number greater than 0.");
        return;
      }
      var chargeData = {
        other_charge_code: this.other_charges.other_charge_code,
        other_code: this.other_charges.other_code,
        amount: parseFloat(this.other_charges.amount) || 0,
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
    },
    editCharge: function editCharge(index) {
      this.editIndex = index;
      this.other_charges = _objectSpread({}, this.form.charges[index]);
      // this.editIndex = null;
    },
    removeCharge: function removeCharge(index) {
      this.form.charges.splice(index, 1);
    },
    editEntry: function editEntry(index) {
      this.edit_entry_index = index;
      this.consignment_list = _objectSpread({}, this.form.entries[index]);
      this.$refs.modalConsignment.show();
      this.calculateTotalAmount();
    },
    deleteEntry: function deleteEntry(index) {
      this.form.entries.splice(index, 1);
      this.calculateTotalVolume();
      this.calculateTotalAmount();
    },
    addOrUpdateEntry: function addOrUpdateEntry(evt) {
      var _this3 = this;
      evt.preventDefault();
      if (!(this.consignment_list instanceof Form)) {
        this.consignment_list = new Form(this.consignment_list);
      }
      this.consignment_list.post("/get-consignment-error").then(function (response) {
        if (_this3.edit_entry_index !== null) {
          _this3.form.entries[_this3.edit_entry_index] = _objectSpread({}, _this3.consignment_list);
          // this.$set(this.form.entries, this.edit_entry_index, { ...this.consignment_list });
          _this3.edit_entry_index = null;
        } else {
          _this3.form.entries.push(_objectSpread({}, _this3.consignment_list));
        }
        _this3.calculateTotalVolume();
        _this3.calculateTotalAmount();
        _this3.closeModal();
        //clear consignment_list data
        for (var key in _this3.consignment_list) {
          if (key != 'busy' && key != 'successful' && key != 'errors' && key != 'originalData') {
            if (_typeof(_this3.consignment_list[key]) === 'object') {
              _this3.consignment_list[key] = [];
            } else {
              _this3.consignment_list[key] = '';
            }
          }
        }
      })["catch"](function (error) {
        // console.error("There was an error with the consignment request:", error);
      });
    },
    // calculateTotalVolume() {
    //     let totalVolume = this.form.entries.reduce((total, entry) => {
    //         return total + entry.itemss.reduce((entryTotal, item) => {
    //             let volumePerPiece = (item.length * item.width * item.height) / 1e6;
    //             return entryTotal + (volumePerPiece * (parseFloat(item.pcs) || 0));
    //         }, 0);
    //     }, 0);
    //     return this.form.totals.total_volume = totalVolume;
    // },
    calculateTotalVolume: function calculateTotalVolume() {
      var _this4 = this;
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
          var selectedUnit = _this4.form.entries.dimention_unit;
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
    },
    calculateTotalAmount: function calculateTotalAmount() {
      var chargeableWeight = this.form.entries.reduce(function (total, entry) {
        var weight = parseFloat(entry.chargable_weight) || 0;
        return total + weight;
      }, 0);
      var rate_class = this.consignment_list.rate_class;
      var rates = 0;
      this.form.totals.total_amount = 0;
      if (rate_class === "B" || rate_class === "M") {
        this.form.totals.total_amount = this.consignment_list.rate || 0;
      } else if (rate_class === "P" || rate_class === "X") {
        this.form.totals.total_amount = 0;
      } else {
        rates = parseFloat(this.form.entries.reduce(function (total, entry) {
          return total + (parseFloat(entry.rate) || 0);
        }, 0)) || 0;
        this.form.totals.total_amount = chargeableWeight * rates;
      }
    },
    addHsCode: function addHsCode() {
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
    },
    removeHsCode: function removeHsCode(index) {
      this.consignment_list.hs_code = '';
      if (confirm('Are you sure you want to delete this HS Code?')) {
        this.consignment_list.hsCodes.splice(index, 1);
      }
    },
    displayModal: function displayModal() {
      this.$refs.modalConsignment.show();
    },
    closeModal: function closeModal() {
      this.$refs.modalConsignment.hide();
    },
    addUldInfo: function addUldInfo() {
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
      this.consignment_list.uld_info.push({
        uld_type: uld_type,
        uld_serial: uld_serial,
        owner: owner
      });
      this.consignment_list.uld_type = this.consignment_list.uld_serial = this.consignment_list.owner = "";
    },
    deleteUldInfo: function deleteUldInfo(index) {
      if (this.consignment_list.uld_info && this.consignment_list.uld_info.length > index) {
        this.consignment_list.uld_info.splice(index, 1);
      }
    },
    editOciInfo: function editOciInfo(index) {
      this.editIndex = index;
      this.oci_info = _objectSpread({}, this.form.oci_entries[index]);
    },
    addOtherCustomInfo: function addOtherCustomInfo() {
      if (!this.oci_info.country_code || !this.oci_info.info_identifier || !this.oci_info.supplementary_info || !this.oci_info.custom_info_identifier) {
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
    addPcsInfo: function addPcsInfo() {
      var _this5 = this;
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
        var value = _this5.consignment_list[field];
        if (value) {
          if (rule.type === 'numeric' && (isNaN(value) || value < rule.min || value > rule.max)) {
            _this5.validationErrors.push(rule.message);
          } else if (rule.type === 'regex' && (!rule.regex.test(value) || value.length > rule.maxLength)) {
            _this5.validationErrors.push(rule.message);
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
    },
    deletePcs: function deletePcs(index) {
      if (this.consignment_list.itemss.length > index) {
        this.consignment_list.itemss.splice(index, 1);
      }
    },
    calculateTotalCharges: function calculateTotalCharges() {
      this.form.totals.total_amount = this.calculateTotalAmount();
    },
    // toggleDropdown_to() {
    //     this.isDropdownOpen_to = !this.isDropdownOpen_to;
    // },
    // selectOption_to(item) {
    //     this.form.routing_information.destination_airport = item.iata_code;
    //     let source_name= item.destination;
    //     let final_set = `${item.iata_code}, ${source_name}`;
    //     this.searchQuery_to = final_set;
    //     this.isDropdownOpen_to = false;
    // },
    toggleDropdown_to: function toggleDropdown_to(field) {
      // this.isDropdownOpen_to = !this.isDropdownOpen_to;
      this.activeField = field;
      this.isDropdownOpen_to[field] = !this.isDropdownOpen_to[field];
      // console.log('active fields', field);
    },
    // selectOption_to(item) {
    //     const { iata_code, destination } = item;
    //     const finalSet = `${iata_code}, ${destination}`;
    //     if (this.activeField) {
    //         this.form.routing_information[this.activeField] = finalSet;
    //     }
    //     this.searchQuery_to = finalSet;
    //     this.isDropdownOpen_to = false;
    // },
    selectOption_to: function selectOption_to(field, item) {
      // this.form.routing_information[field] = `${item.iata_code}, ${item.destination}`;
      // this.isDropdownOpen_to = false;
      if (this.form.routing_information[field] !== undefined) {
        this.form.routing_information[field] = "".concat(item.iata_code, ", ").concat(item.destination); // Update the selected value
      }
      this.isDropdownOpen_to[field] = false;
    },
    closeDropdown_to: function closeDropdown_to(event) {
      var dropdownContainer_to = this.$refs.dropdownContainer_to;
      if (dropdownContainer_to && !dropdownContainer_to.contains(event.target)) {
        this.isDropdownOpen_to = false;
      }
    },
    filteredLocations_to: function filteredLocations_to(field) {
      var query = (this.form.routing_information[field] || '').toLowerCase().trim();
      // console.log("Current locations:", this.location);
      if (!query) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query) || item.destination.toLowerCase().includes(query);
      });
    }
  },
  mounted: function mounted() {
    this.calculateTotalVolume();
    window.addEventListener('click', this.closeDropdown_to);
    this.getLocation();
    this.location = [];
  },
  watch: {
    // 'consignment_list': function () {
    //     this.form.totals.total_amount = this.calculateTotalAmount();
    // },
    'form.entries.dimention_unit': function formEntriesDimention_unit() {
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
    }
  },
  created: function created() {
    // this.getAgent();
  },
  computed: {
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
    // totalChargesPrepaid() {
    //     return (
    //         parseFloat(this.totalDueAgentPrepaid) +
    //         parseFloat(this.totalDueCarrierPrepaid)
    //     ).toFixed(2);
    // },
    // totalChargesCollect() {
    //     return (
    //         this.weightCharge +
    //         parseFloat(this.totalDueAgentCollect) +
    //         parseFloat(this.totalDueCarrierCollect)
    //     ).toFixed(2);
    // },
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
    } // filteredLocations_to() {
    //     const query = this.searchQuery_to.toLowerCase().trim();
    //     if (!query) return this.location;
    //     return this.location.filter(item =>
    //         item.iata_code.toLowerCase().includes(query) ||
    //         item.destination.toLowerCase().includes(query)
    //     );
    // },
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('click', this.closeDropdown_to);
  },
  components: {
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render=function render(){var _vm=this,_c=_vm._self._c;return _c("div",{staticClass:"bg-white",staticStyle:{height:"auto !important"}},[[_c("header",[_c("nav",{attrs:{id:"nav"}},[_c("ul",{staticStyle:{"z-index":"1098"}},_vm._l(_vm.items,function(item){return _c("li",[!item.children?_c("a",{attrs:{href:item.url}},[_vm._v("\n                            "+_vm._s(item.name)+"\n                        ")]):_c("span",{on:{mouseover:_vm.mouseover,mouseleave:_vm.mouseleave}},[_vm._v("\n                            "+_vm._s(item.name)+"\n\n                            "),_c("ul",{staticClass:"dropdown","class":{isOpen:_vm.isOpen}},_vm._l(item.children,function(child){return _c("li",[_c("a",{attrs:{href:child.url}},[_vm._v("\n                                        "+_vm._s(child.name)+"\n                                    ")])]);}),0)])]);}),0)])])],_vm._v(" "),[_c("div",{staticClass:"d-flex justify-content-center align-items-center mt-5 bg-white"},[_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-ss",modifiers:{"modal-ss":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"}},[_vm._v("Activity")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-prevent-closing",modifiers:{"modal-prevent-closing":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"toggle-btn"}},[_vm._v("Search")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-s",modifiers:{"modal-s":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"}},[_vm._v("10 Latest")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-templates",modifiers:{"modal-templates":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"toggle-btn"}},[_vm._v("Templates")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-draft",modifiers:{"modal-draft":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"}},[_vm._v("Draft")]),_vm._v(" "),_c("b-button",{staticClass:"mx-2 custom-btn",attrs:{id:"toggle-btn"},on:{click:_vm.toggleModal}},[_vm._v("Related")]),_vm._v(" "),_c("b-button",{staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"},on:{click:_vm.showModal}},[_vm._v("Update Draft")]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-ss",title:"Activity","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("h3",[_vm._v("Updated:04:49")])])]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-draft",title:"Activity","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("none")]),_vm._v(" "),_c("h6",[_vm._v("( - )")])]),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Edit e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create House Waybill from e-AWB Data")]),_vm._v(" "),_c("h6",[_vm._v("By: jgeorgeblr@gln.com at: 13 Jul 15:03")])])],1)],1)]),_vm._v(" "),_c("b-modal",{ref:"modal",attrs:{id:"modal-prevent-closing",title:"Submit Your Name"},on:{ok:_vm.handleOk}},[_c("form",{ref:"form"},[_c("b-form-group",{attrs:{label:"Cereated By:","label-for":"name-input"},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref){var ariaDescribedby=_ref.ariaDescribedby;return[_c("b-form-radio-group",{attrs:{id:"radio-slots",options:_vm.options,"aria-describedby":ariaDescribedby,name:"radio-options-slots"}})];}}])}),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"4",label:"Id:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Destination:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Issued:","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Draft:","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Not Issue:","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"}})],1)],1)]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-s",title:"Latest Messages","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-form-group",{attrs:{"label-for":"name-input",label:"Created By:"},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref2){var ariaDescribedby=_ref2.ariaDescribedby;return[_c("b-form-radio-group",{attrs:{id:"radio-slots",options:_vm.options,"aria-describedby":ariaDescribedby,name:"radio-options-slots"}})];}}])}),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"mt-5"},[_c("b-col",[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Edit e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Copy e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create House Waybill from e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create Booking from e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create Flight Status from e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Edit label")])]),_vm._v(" "),_c("b-col",[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("e-AWB Pdf file")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Multipage e-AWB Pdf")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Multipage e-AWB Pdf with back pages")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Without IATA template")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("1 Page generic e-AWB label")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("e-AWB label per item (50 pages)")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Cargo Pouch label as a PDF")])])],1),_vm._v(" "),_c("p",[_vm._v("Issued at: 15 Jun 14:24 By: jgeorgeblr@gln.com")])],1)]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-templates",title:"Templates","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-form-group",{scopedSlots:_vm._u([{key:"default",fn:function fn(_ref3){var ariaDescribedby=_ref3.ariaDescribedby;return[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("h6",[_vm._v("Created by:")])]),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-radio",{attrs:{"aria-describedby":ariaDescribedby,name:"some-radios",value:"A"}},[_vm._v("Me")])],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-radio",{attrs:{"aria-describedby":ariaDescribedby,name:"some-radios",value:"B"}},[_vm._v("Participant group")])],1)],1)];}}])}),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal"}},[_c("b-row",{attrs:{"align-v":"center"}},[_c("label",[_vm._v("Template")]),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"220px"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("\n                                        Please choose a Custom Origin\n                                    ")]),_vm._v(" "),_c("option",[_vm._v("A")]),_vm._v(" "),_c("option",[_vm._v("B")]),_vm._v(" "),_c("option",[_vm._v("C")])])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("h4",{staticClass:"h-color"},[_vm._v("Save")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-lg":"auto",label:"Name:","label-for":"input-horizontal"}},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-col",[_c("b-button",[_vm._v("+Save")])],1)],1)],1),_vm._v(" "),_c("h3",{staticClass:"h-color font-weight-bolder mt-lg-10"},[_vm._v("\n                        Modify your templates\n                    ")]),_vm._v(" "),_c("h5",{staticStyle:{"font-size":"smaller"}},[_vm._v("\n                        Showing all templates in participant group\n                    ")]),_vm._v(" "),_c("h5",{staticClass:"text-danger ml-5"},[_vm._v("No Templates found")]),_vm._v(" "),_c("hr",{staticClass:"hr mt-lg-12"}),_vm._v(" "),_c("h5",{staticStyle:{"font-size":"smaller"}},[_vm._v("\n                        The e-AWB can be saved as 'draft' and a list with\n                        draft e-AWB created during the day will be presented\n                        below. The last 10 e-AWB will be visible.\n                    ")])],1)])],1)],_vm._v(" "),_c("div",{staticClass:"container mt-lg-15 border-2 bg-light p-2",staticStyle:{"margin-bottom":"20px","border-bottom":"1px solid black"}},[_vm._m(0),_vm._v(" "),[_c("b-form",{on:{submit:_vm.onSubmit}},[_c("div",{staticClass:"container"},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"AWB No:*","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("awb_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.first_box.awb_code,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_code",$$v);},expression:"form.first_box.awb_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"awb_code"}})],1)],1),_vm._v("\n                        -\n                        "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("awb_no")},staticStyle:{width:"90px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.first_box.awb_no,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_no",$$v);},expression:"form.first_box.awb_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"awb_no"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto mr-7"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.first_box.consolidated_MAWB,callback:function callback($$v){_vm.$set(_vm.form.first_box,"consolidated_MAWB",$$v);},expression:"form.first_box.consolidated_MAWB"}},[_vm._v("Consolidate\n                                    MAWB")])],1)],1),_vm._v(" "),_c("b-col",{staticStyle:{"padding-left":"9.3%"},attrs:{cols:"auto ml-7"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"true"},model:{value:_vm.form.first_box.awb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb",$$v);},expression:"form.first_box.awb"}},[_vm._v("AWB")])],1)],1)],1),_vm._v(" "),_c("b-row",{staticClass:"justify-content-center mt-5"},[_c("b-col",{staticStyle:{"padding-left":"33.6%"},attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":""}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAW"},on:{change:_vm.handleRadioChange},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With No Accompanying Paper\n                                    Documents")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm"}},[_vm._v("e-CSD AWB")])],1)],1),_vm._v(" "),_c("b-col",{staticStyle:{"margin-left":"22.5%"},attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAP"},on:{change:_vm.handleRadioChange},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With Accompanying Paper\n                                    Documents")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"justify-content-center mt-5"},[_c("b-col",[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2"},[_vm._v("\n                                    Shipper\n                                ")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Name:*","label-for":"input-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"flex-grow-1"},[_c("select",{staticClass:"custom-select form-control-sm",staticStyle:{width:"320px"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Shipper")]),_vm._v(" "),_c("option",{attrs:{value:"ABS"}},[_vm._v("A")]),_vm._v(" "),_c("option",{attrs:{value:"BDE"}},[_vm._v("B")]),_vm._v(" "),_c("option",{attrs:{value:"RTY"}},[_vm._v("C")])])]),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",attrs:{icon:"arrows-expand","aria-hidden":"true"},on:{click:function click($event){_vm.showShipper=!_vm.showShipper;}}})],1)]),_vm._v(" "),_vm.showShipper?_c("b-col",[_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:""}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-30","class":{"is-invalid":_vm.form.errors.has("ship_name")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_name,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_name",$$v);},expression:"form.shipper_address.ship_name"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name"}})],1)],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Account:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("ship_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_account,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_account",$$v);},expression:"form.shipper_address.ship_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Address *:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("ship_address")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_address,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address",$$v);},expression:"form.shipper_address.ship_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31","class":{"is-invalid":_vm.form.errors.has("ship_address_line_2")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address_line_2",$$v);},expression:"form.shipper_address.ship_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address_line_2"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"City *:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-22","class":{"is-invalid":_vm.form.errors.has("ship_city")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_city,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_city",$$v);},expression:"form.shipper_address.ship_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_airport_code",$$v);},expression:"form.shipper_address.ship_airport_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Post Code:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-11","class":{"is-invalid":_vm.form.errors.has("ship_post_code")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_post_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_post_code",$$v);},expression:"form.shipper_address.ship_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"State:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-20","class":{"is-invalid":_vm.form.errors.has("ship_state")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_state,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_state",$$v);},expression:"form.shipper_address.ship_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-s":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Country *:"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("ship_country")},staticStyle:{width:"220px"},model:{value:_vm.form.shipper_address.ship_country,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_country",$$v);},expression:"form.shipper_address.ship_country"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"IN"}},[_vm._v("India")]),_vm._v(" "),_c("option",{attrs:{value:"USA"}},[_vm._v("United State")]),_vm._v(" "),_c("option",{attrs:{Value:"UK"}},[_vm._v("United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Phone:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-17","class":{"is-invalid":_vm.form.errors.has("ship_phone")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_phone,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_phone",$$v);},expression:"form.shipper_address.ship_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Fax:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-22","class":{"is-invalid":_vm.form.errors.has("ship_fax")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_fax,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_fax",$$v);},expression:"form.shipper_address.ship_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Telex:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-19",attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_telex,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_telex",$$v);},expression:"form.shipper_address.ship_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-lg-35",attrs:{size:"sm"},model:{value:_vm.form.is_shipper_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_shipper_address_save",$$v);},expression:"form.is_shipper_address_save"}},[_vm._v(" Save new address to address\n                                        book")])],1):_vm._e()],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for\n                                    later logins")])],1)],1),_vm._v(" "),_c("b-col",[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2"},[_vm._v("\n                                    Consignee\n                                ")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Name:*","label-for":"input-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"flex-grow-1"},[_c("select",{directives:[{name:"model",rawName:"v-model",value:_vm.form.cons_name,expression:"form.cons_name"}],staticClass:"custom-select form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_name")},staticStyle:{width:"320px"},on:{change:function change($event){var $$selectedVal=Array.prototype.filter.call($event.target.options,function(o){return o.selected;}).map(function(o){var val="_value"in o?o._value:o.value;return val;});_vm.$set(_vm.form,"cons_name",$event.target.multiple?$$selectedVal:$$selectedVal[0]);}}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Consignee")]),_vm._v(" "),_c("option",{attrs:{value:"ABC"}},[_vm._v("A")]),_vm._v(" "),_c("option",{attrs:{value:"BDE"}},[_vm._v("B")]),_vm._v(" "),_c("option",{attrs:{value:"CAB"}},[_vm._v("C")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",attrs:{icon:"arrows-expand","aria-hidden":"true"},on:{click:function click($event){_vm.showConsignee=!_vm.showConsignee;}}})],1)]),_vm._v(" "),_vm.showConsignee?_c("b-col",[_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-16","class":{"is-invalid":_vm.form.errors.has("cons_name")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_name,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_name",$$v);},expression:"form.consignee_address.cons_name"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1)],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Account:"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_account,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_account",$$v);},expression:"form.consignee_address.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Address *:"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_address")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_address,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address",$$v);},expression:"form.consignee_address.cons_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-16","class":{"is-invalid":_vm.form.errors.has("cons_address_line_2")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address_line_2",$$v);},expression:"form.consignee_address.cons_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address_line_2"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"City *:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-8","class":{"is-invalid":_vm.form.errors.has("cons_city")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_city,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_city",$$v);},expression:"form.consignee_address.cons_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"50px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Post Code:"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_post_code")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_post_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_post_code",$$v);},expression:"form.consignee_address.cons_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"State:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-6","class":{"is-invalid":_vm.form.errors.has("cons_state")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_state,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_state",$$v);},expression:"form.consignee_address.cons_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Country *:"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-1","class":{"is-invalid":_vm.form.errors.has("cons_country")},staticStyle:{width:"220px"},model:{value:_vm.form.consignee_address.cons_country,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_country",$$v);},expression:"form.consignee_address.cons_country"}},[_c("option",{attrs:{disabled:"",value:"Please select one"}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"IN"}},[_vm._v("India")]),_vm._v(" "),_c("option",{attrs:{value:"USA"}},[_vm._v("United State")]),_vm._v(" "),_c("option",{attrs:{Value:"UK"}},[_vm._v("United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Phone:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-3",attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_phone,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_phone",$$v);},expression:"form.consignee_address.cons_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Fax:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-8",attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_fax,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_fax",$$v);},expression:"form.consignee_address.cons_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Telex:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-5",attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_telex,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_telex",$$v);},expression:"form.consignee_address.cons_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-lg-21",attrs:{size:"sm"},model:{value:_vm.form.is_consignee_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_consignee_address_save",$$v);},expression:"form.is_consignee_address_save"}},[_vm._v(" Save new address to address\n                                        book")])],1):_vm._e()],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("b-tabs",{staticClass:"nav-tabs",attrs:{"content-class":"mt-3"}},[_c("b-tab",{staticStyle:{border:"2px solid black !important"},attrs:{title:"Routing Information"}},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm",attrs:{label:"Departure Airport*"}},[_c("div",{staticClass:"custom-dropdown",on:{click:function click($event){return _vm.toggleDropdown_to("departure_airport");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.departure_airport,expression:"form.routing_information.departure_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.departure_airport},attrs:{type:"text",placeholder:"Search departure airport",autocomplete:"off"},domProps:{value:_vm.form.routing_information.departure_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"departure_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to["departure_airport"]&&_vm.activeField==="departure_airport"?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to("departure_airport"),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to("departure_airport",item);}}},[_vm._v("\n                                                        "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                    ")]);}),0):_vm._e(),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"departure_airport"}})],1)])],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-center",staticStyle:{"margin-left":"8.5%"}},[_c("div",{staticClass:"container"},[_c("table",{staticClass:"table-bordered mx-auto table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("From")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("To")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"50px","padding-left":"3%"}},[_vm._v("By")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"50px","padding-left":"3%"}},[_vm._v("Flight")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"50px","padding-left":"3%"}},[_vm._v("Date")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"80px"}})])])])])])],1),_vm._v(" "),_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm",attrs:{label:"Destination Airport*",id:""}},[_c("div",{staticClass:"custom-dropdown",on:{click:function click($event){return _vm.toggleDropdown_to("destination_airport");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.departure_airport,expression:"form.routing_information.departure_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.destination_airport},attrs:{type:"text",placeholder:"Search destination airport",autocomplete:"off"},domProps:{value:_vm.form.routing_information.departure_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"departure_airport",$event.target.value);}}}),_vm._v(" "),_vm.isDropdownOpen_to["destination_airport"]&&_vm.activeField==="destination_airport"?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredLocations_to("destination_airport"),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectOption_to("destination_airport",item);}}},[_vm._v("\n                                                        "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                    ")]);}),0):_vm._e(),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"destination_airport"}})],1)])],1),_vm._v(" "),_c("b-col",{attrs:{cols:"1"}},[_vm._v("Routing:*")]),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-center"},[_c("div",{staticClass:"container"},[_c("table",{staticClass:"mx-auto table-sm"},[_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("from")},staticStyle:{width:"150px"},model:{value:_vm.form.routing_information.departure_airport,callback:function callback($$v){_vm.$set(_vm.form.routing_information,"departure_airport",$$v);},expression:"form.routing_information.departure_airport"}},[_c("option",{attrs:{disabled:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("\n                                                                    ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("\n                                                                    ABZ, Aberdeen (ABZ), United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"from"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to")},staticStyle:{width:"150px"},model:{value:_vm.form.routing_information.to,callback:function callback($$v){_vm.$set(_vm.form.routing_information,"to",$$v);},expression:"form.routing_information.to"}},[_c("option",{attrs:{disabledvalue:""}},[_vm._v(" Select a Rate Class\n                                                                ")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("\n                                                                    ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("\n                                                                    ABZ, Aberdeen (ABZ), United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by,expression:"form.routing_information.by"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by")},staticStyle:{width:"40px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"by"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight,expression:"form.routing_information.flight"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight")},staticStyle:{width:"50px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"flight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date,expression:"form.routing_information.date"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date")},staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"date"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"60px"}},[_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:_vm.handleDateChange}})],1)])])])])])],1),_vm._v(" "),_c("b-row",{staticClass:"justify-content-end",staticStyle:{"margin-right":"23%"}},[_c("div",{staticClass:"d-flex flex-column justify-content-end"},[_c("table",{staticClass:"mx-auto table-sm"},[_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_2")},staticStyle:{width:"150px"},model:{value:_vm.form.routing_information.to_2,callback:function callback($$v){_vm.$set(_vm.form.routing_information,"to_2",$$v);},expression:"form.routing_information.to_2"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select 2 a Rate Class\n                                                            ")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("ABY,\n                                                                Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("\n                                                                ABZ, Aberdeen (ABZ), United Kingdom")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_2,expression:"form.routing_information.by_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_2")},staticStyle:{width:"40px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_2,expression:"form.routing_information.flight_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_2")},staticStyle:{width:"50px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_2,expression:"form.routing_information.date_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_2")},staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"60px !important"}},[_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:_vm.handleDateChange}})],1)])])])])]),_vm._v(" "),_c("b-row",{staticClass:"justify-content-end",staticStyle:{"margin-right":"23%"}},[_c("div",{staticClass:"d-flex flex-column justify-content-end"},[_c("table",{staticClass:"mx-auto table-sm"},[_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_3")},staticStyle:{width:"150px"},model:{value:_vm.form.routing_information.to_3,callback:function callback($$v){_vm.$set(_vm.form.routing_information,"to_3",$$v);},expression:"form.routing_information.to_3"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select 3 a Rate Class\n                                                            ")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("ABY,\n                                                                Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("ABZ,\n                                                                Aberdeen (ABZ), United Kingdom")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_3,expression:"form.routing_information.by_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_3")},staticStyle:{width:"40px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_3,expression:"form.routing_information.flight_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_3")},staticStyle:{width:"50px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_3,expression:"form.routing_information.date_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_3")},staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"60px !important"}},[_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:_vm.handleDateChange}})],1)])])])])])],1),_vm._v(" "),_c("b-tab",{staticStyle:{border:"2px solid black !important"},attrs:{title:"Search Flights"}},[_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                    Carrier *\n                                                ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                    Origin *\n                                                ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                    Destination *\n                                                ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                    Flight Date *\n                                                ")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:_vm.getOriginCode(_vm.form.routing_information.departure_airport)}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:_vm.getDestinationCode(_vm.form.routing_information.destination_airport)}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"}})]),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"}})],1)])])])])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("div",{staticClass:"d-flex justify-content-between align-items-center"},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2 mb-0"},[_vm._v("\n                                Consignment Rate Description\n                            ")]),_vm._v(" "),_c("div",[_c("b-button",{staticClass:"btn-secondary mr-2"},[_c("b-icon",{attrs:{icon:"search","font-scale":"1"}}),_vm._v("Get Rates\n                                ")],1),_vm._v(" "),_c("b-button",{staticClass:"btn-secondary"},[_c("b-icon",{attrs:{icon:"calendar2-minus-fill","font-scale":"1"}}),_vm._v("Collect house\n                                    waybill sum's\n                                ")],1)],1)]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-consignment",modifiers:{"modal-consignment":true}}],staticClass:"mt-5",attrs:{variant:"warning"}},[_vm._v("Add Consignment\n                            Information")]),_vm._v(" "),_c("b-modal",{ref:"modalConsignment",attrs:{id:"modal-consignment",title:"Consignment Information",size:"xl","ok-only":"","hide-footer":""}},[_c("div",{staticClass:"d-block"},[_c("b-row",[_c("b-col",{attrs:{cols:"6"}},[_c("h6",[_vm._v("Pieces and Nature and Quantity of Goods")]),_vm._v(" "),_c("div",{staticClass:"bg-light pl-2"},[_c("label",{attrs:{"for":""}},[_vm._v("Pieces")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.consignment_list.errors.has("pieces")},attrs:{id:"input-departure-airport"},model:{value:_vm.consignment_list.pieces,callback:function callback($$v){_vm.$set(_vm.consignment_list,"pieces",$$v);},expression:"consignment_list.pieces"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"pieces"}}),_vm._v(" "),_c("label",{attrs:{"for":""}},[_vm._v("Description")]),_vm._v(" "),_c("b-form-textarea",{"class":{"is-invalid":_vm.consignment_list.errors.has("description")},staticStyle:{"grid-column":"span 2 !important",width:"100% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"},model:{value:_vm.consignment_list.description,callback:function callback($$v){_vm.$set(_vm.consignment_list,"description",$$v);},expression:"consignment_list.description"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"description"}}),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",[_vm._v("Rate Class:")]),_vm._v(" "),_c("th",[_vm._v("ULD Rate class:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("rate_class")},staticStyle:{width:"320px"},on:{change:_vm.calculateTotalAmount},model:{value:_vm.consignment_list.rate_class,callback:function callback($$v){_vm.$set(_vm.consignment_list,"rate_class",$$v);},expression:"consignment_list.rate_class"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Rate Class\n                                                                ")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("CB - Basic rate")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("CC - Specific commodity rate\n                                                                ")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("CE - Unit load device additional\n                                                                    rate")]),_vm._v(" "),_c("option",{attrs:{value:"K"}},[_vm._v(" CK - Rate per kilogram")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("CM - Minimum charge")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("CN - Normal rate")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("CP - International priority\n                                                                    service rate")]),_vm._v(" "),_c("option",{attrs:{value:"Q"}},[_vm._v("CQ - Quantity rate")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("CR - Class rate reduction")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("CS - Class rate surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v(" CU - Unit load device basic\n                                                                    charge or rate")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("CX - Unit load device additional\n                                                                    info")]),_vm._v(" "),_c("option",{attrs:{value:"Y"}},[_vm._v("CY - Unit load device discount\n                                                                ")]),_vm._v(" "),_c("option",{attrs:{value:"Z"}},[_vm._v("CZ - Mutually Defined")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate_class"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_rate_class,expression:"consignment_list.uld_rate_class"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("uld_rate_class")},staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_rate_class},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_rate_class",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"uld_rate_class"}})],1)]),_vm._v(" "),_vm.consignment_list.rate_class?_c("tr",[_c("td",{staticClass:"editable-cell",attrs:{colspan:"4"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center"},[_c("span",{staticClass:"mr-2"},[_vm._v("Charge:")]),_vm._v(" "),_c("input",{staticClass:"form-control",staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.calculatedCharge}})])])]):_vm._e(),_vm._v(" "),_c("tr",[_c("th",[_vm._v("Service code")]),_vm._v(" "),_c("th",[_vm._v("Commodity Item")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("service_code")},staticStyle:{width:"320px"},model:{value:_vm.consignment_list.service_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"service_code",$$v);},expression:"consignment_list.service_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Service Code\n                                                                ")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Airport to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B - Service Cargo")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Company Material")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Door to Door")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Airport to Door")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Flight Specific")]),_vm._v(" "),_c("option",{attrs:{value:"G"}},[_vm._v("G - Door to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"H"}},[_vm._v("H - Company Mail")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Diplomatic Mail")]),_vm._v(" "),_c("option",{attrs:{value:"J"}},[_vm._v("J - Priority Service")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Small Package Service\n                                                                ")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("R - Restricted")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - Substitue Truck")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Charter")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Express Service")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"service_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.commodity_item,expression:"consignment_list.commodity_item"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("commodity_item")},staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.commodity_item},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"commodity_item",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",[_vm._v("\n                                                            Country Of Origin of Goods\n                                                        ")]),_vm._v(" "),_c("th",[_vm._v("Slac:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("country_origin_goods")},staticStyle:{width:"320px"},model:{value:_vm.consignment_list.country_origin_goods,callback:function callback($$v){_vm.$set(_vm.consignment_list,"country_origin_goods",$$v);},expression:"consignment_list.country_origin_goods"}},[_c("option",{attrs:{value:""}},[_vm._v(" Select a Country")]),_vm._v(" "),_c("option",{attrs:{value:"AF"}},[_vm._v(" Afghanistan")]),_vm._v(" "),_c("option",{attrs:{value:"AX"}},[_vm._v(" Åland Islands ")]),_vm._v(" "),_c("option",{attrs:{value:"AL"}},[_vm._v("Albania")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"country_origin_goods"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.slac,expression:"consignment_list.slac"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("slac")},staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.slac},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"slac",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",[_vm._v("Hs Codes:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center"}},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.hs_code_error.length>0},staticStyle:{width:"170px","margin-right":"10px"},attrs:{type:"text"},model:{value:_vm.consignment_list.hs_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"hs_code",$$v);},expression:"consignment_list.hs_code"}}),_vm._v(" "),_c("button",{on:{click:_vm.addHsCode}},[_vm._v("Add")])],1),_vm._v(" "),_vm.hs_code_error.length?_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.hs_code_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)]):_vm._e()]),_vm._v(" "),_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("HS Codes")])]),_vm._v(" "),_vm._l(_vm.consignment_list.hsCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",[_vm._v(" "+_vm._s(code)+" ")]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.removeHsCode(index);}}})],1)]);})],2)])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"6"}},[_c("h6",[_vm._v("Weight and Dimensions")]),_vm._v(" "),_c("div",{staticClass:"bg-light pl-2"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",[_vm._v("Gross Weight")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th",[_vm._v(" Chargeable Weight")]),_vm._v(" "),_c("th",[_vm._v("Rate")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.gross_weight,expression:"consignment_list.gross_weight"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("gross_weight")},staticStyle:{width:"70px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"gross_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"uld_serial"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("weight_code")},staticStyle:{width:"70px"},model:{value:_vm.consignment_list.weight_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"weight_code",$$v);},expression:"consignment_list.weight_code"}},[_c("option",{attrs:{value:"KGM"}},[_vm._v("Kgs")]),_vm._v(" "),_c("option",{attrs:{value:"LBR"}},[_vm._v("Lbs")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"weight_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.chargable_weight,expression:"consignment_list.chargable_weight"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("chargable_weight")},staticStyle:{width:"70px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.chargable_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"chargable_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"chargable_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.rate,expression:"consignment_list.rate"}],staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("rate")},staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.rate},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"rate",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate"}})],1)]),_vm._v(" "),_c("tr",[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.pcs,expression:"consignment_list.pcs"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.pcs},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"pcs",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.wgt,expression:"consignment_list.wgt"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.wgt},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"wgt",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.length,expression:"consignment_list.length"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.length},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"length",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.width,expression:"consignment_list.width"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.width},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"width",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.height,expression:"consignment_list.height"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.height},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"height",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"100%"}},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"100%"},model:{value:_vm.consignment_list.unit,callback:function callback($$v){_vm.$set(_vm.consignment_list,"unit",$$v);},expression:"consignment_list.unit"}},[_c("option",{attrs:{value:"CMT"}},[_vm._v("CMT")]),_vm._v(" "),_c("option",{attrs:{value:"INH"}},[_vm._v("INH")]),_vm._v(" "),_c("option",{attrs:{value:"FOT"}},[_vm._v("FOT")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{on:{click:_vm.addPcsInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.validationErrors.length>0?_c("tr",[_c("td",{attrs:{colspan:"7"}},[_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.validationErrors,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])])]):_vm._e(),_vm._v(" "),_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")])]),_vm._v(" "),_vm._l(_vm.consignment_list.itemss,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.pcs))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.wgt)+" "+_vm._s(_vm.consignment_list.weight_code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.length))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.width))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.height))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",{staticClass:"mr-3"},[_vm._v(_vm._s(row.unit))]),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deletePcs(index);}}})],1)]);})],2)]),_vm._v(" "),_c("h6",[_vm._v("Volume")]),_vm._v(" "),_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"80px"},attrs:{id:"input-horizontal"},model:{value:_vm.consignment_list.volume,callback:function callback($$v){_vm.$set(_vm.consignment_list,"volume",$$v);},expression:"consignment_list.volume"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"70px","margin-right":"10px"},model:{value:this.form.entries.dimention_unit,callback:function callback($$v){_vm.$set(this.form.entries,"dimention_unit",$$v);},expression:"this.form.entries.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1)],1)],1),_vm._v(" "),_c("h5",{staticClass:"mt-5 mb-2"},[_vm._v("ULD Information")]),_vm._v(" "),_c("div",{staticClass:"bg-light"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_type,expression:"consignment_list.uld_type"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_type},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_type",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_serial,expression:"consignment_list.uld_serial"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_serial},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_serial",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.owner,expression:"consignment_list.owner"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.consignment_list.owner},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"owner",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{on:{click:_vm.addUldInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.uld_error.length?_c("tr",{staticStyle:{color:"red"}},[_c("td",{attrs:{colspan:"4"}},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.uld_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])]):_vm._e(),_vm._v(" "),_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_vm._l(_vm.consignment_list.uld_info,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.uld_type))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.uld_serial))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.owner))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteUldInfo(index);}}})],1)]);})],2)])])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end"},[_c("button",{staticClass:"btn btn-secondary",on:{click:_vm.addOrUpdateEntry}},[_vm._v("\n                                        "+_vm._s(_vm.edit_entry_index!==null?"Update":"Add")+"\n                                    ")])])],1)]),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-center mb-5 mt-5"},[_c("div",{},[_c("table",{staticClass:"table-bordered mx-auto table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color",staticStyle:{"font-size":"10px"}},[_c("th",{staticClass:"form-control1"},[_vm._v("Pcs.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Description")]),_vm._v(" "),_c("th",[_vm._v("Srv. Code")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Com. Itm.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Gross Wgt.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Chrg. Wgt.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Rate")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"100px"}},[_vm._v("Detailed Pcs. Info")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Vol")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Rate Class")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("UID Rate Class")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Charge")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("HS Code")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Origin Country")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("UID information")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Slac")]),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.entries,function(entry,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(entry.pieces))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.description))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.service_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.commodity_item))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.gross_weight)+", "+_vm._s(entry.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.chargable_weight))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate))]),_vm._v(" "),_c("td",_vm._l(entry.itemss,function(pcs,pcsIndex){return _c("div",{key:pcsIndex,staticClass:"mb-1"},[_vm._v("\n                                                    "+_vm._s(pcs.pcs)+"-"+_vm._s(pcs.wgt)+"-"+_vm._s(pcs.weight_code)+"-"+_vm._s(pcs.length)+"x"+_vm._s(pcs.width)+"x"+_vm._s(pcs.height)+"-"+_vm._s(pcs.unit)+"\n                                                ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.volume))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.uld_rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(_vm.form.totals.total_amount))]),_vm._v(" "),_c("td",_vm._l(entry.hsCodes,function(hs,hsIndex){return _c("div",{key:hsIndex,staticClass:"mb-1"},[_vm._v("\n                                                    "+_vm._s(hs.hs_code)+"\n                                                ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.country_origin_goods))]),_vm._v(" "),_c("td",_vm._l(entry.uld_info,function(uld,uldIndex){return _c("div",{key:uldIndex,staticClass:"mb-1"},[_vm._v("\n                                                    "+_vm._s(uld.uld_type)+"-"+_vm._s(uld.uld_serial)+"-"+_vm._s(uld.owner)+"\n                                                ")]);}),0),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.slac))]),_vm._v(" "),_c("td",{staticClass:"d-flex align-items-center"},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editEntry(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteEntry(index);}}})],1)]);}),0)])]),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end ml-auto"},[_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-group",{staticClass:"form-control-sm col-form-",attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticClass:"mr-2 mb-0",attrs:{"for":"input-horizontal"}},[_vm._v("Total Volume:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-2",attrs:{id:"input-horizontal"},model:{value:_vm.form.totals.total_volume,callback:function callback($$v){_vm.$set(_vm.form.totals,"total_volume",$$v);},expression:"form.totals.total_volume"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.form.entries.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form.entries,"dimention_unit",$$v);},expression:"form.entries.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticClass:"mr-2 mb-0",attrs:{"for":"input-horizontal"}},[_vm._v("Total Amount:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-2",attrs:{id:"input-horizontal",value:_vm.calculatedCharge}})],1)])],1)])])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("h5",[_vm._v("Customs Origin Code:")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.form.custom_origin.customs_origin_code,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"customs_origin_code",$$v);},expression:"form.custom_origin.customs_origin_code"}},[_c("option",{attrs:{value:"T1"}},[_vm._v("T1 - Goods from outside the EC under Customs Control")]),_vm._v(" "),_c("option",{attrs:{value:"T2"}},[_vm._v(" T2 - EC Goods not in free circulation ")]),_vm._v(" "),_c("option",{attrs:{value:"TE"}},[_vm._v(" TE - Goods in trade with Spain subject to duties ")]),_vm._v(" "),_c("option",{attrs:{value:"TP"}},[_vm._v(" TP - Goods in trade with Portugal subject to special duties")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v(" TD - Goods already under formal transit procedure ")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v(" TF - Goods in trade between EC and Canary Islands ")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v(" C - Goods in free circulation ")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v(" X - Goods in free circulation with destination outside the EC\n                                ")])])],1),_vm._v(" "),_c("div",{staticClass:"py-md-9"},[_c("b-tabs",{attrs:{"content-class":"mt-3"}},[_c("b-tab",{attrs:{title:"OSI",active:""}},[_c("h5",[_vm._v("Other Service Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{"class":{"is-invalid":_vm.form.errors.has("other_service_information")},staticStyle:{"grid-column":"span 2 !important",width:"60% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"},model:{value:_vm.form.custom_origin.other_service_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"other_service_information",$$v);},expression:"form.custom_origin.other_service_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"other_service_information"}})],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"SSR"}},[_c("h5",[_vm._v("Special Service Request:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{"class":{"is-invalid":_vm.form.errors.has("special_service_request")},staticStyle:{"grid-column":"span 2 !important",width:"60% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"},model:{value:_vm.form.custom_origin.special_service_request,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"special_service_request",$$v);},expression:"form.custom_origin.special_service_request"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_service_request"}})],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"Accounting Information"}},[_c("h5",[_vm._v("Accounting Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{"class":{"is-invalid":_vm.form.errors.has("accounting_information")},staticStyle:{"grid-column":"span 2 !important",width:"60% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"},model:{value:_vm.form.custom_origin.accounting_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"accounting_information",$$v);},expression:"form.custom_origin.accounting_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"accounting_information"}}),_vm._v(" "),_c("label",{staticClass:"mr-2 mt-2 mb-0",staticStyle:{width:"150px"},attrs:{"for":"input-horizontal"}},[_vm._v("Letter Of Credit")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.form.custom_origin.letter_credit,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"letter_credit",$$v);},expression:"form.custom_origin.letter_credit"}},[_c("option",{attrs:{value:"CRN"}},[_vm._v("Credit Card Number")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("Credit Card Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"CRI"}},[_vm._v("Credit Card Issuance Name")]),_vm._v(" "),_c("option",{attrs:{value:"GEN"}},[_vm._v("General Information")]),_vm._v(" "),_c("option",{attrs:{value:"GBL"}},[_vm._v("Government Bill of Lading")]),_vm._v(" "),_c("option",{attrs:{value:"STL"}},[_vm._v("Mode of Settlement")]),_vm._v(" "),_c("option",{attrs:{value:"RET"}},[_vm._v("Return to Origin")]),_vm._v(" "),_c("option",{attrs:{value:"SRN"}},[_vm._v("Shipper’s Reference Number")])])],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"Shipment Reference Infomation"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2"},[_vm._v("Shipment Reference Information")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Shipment Reference Number:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-14","class":{"is-invalid":_vm.form.errors.has("shipment_ref_no")},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.shipment_ref_no,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"shipment_ref_no",$$v);},expression:"form.custom_origin.shipment_ref_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"shipment_ref_no"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Supplementary Shipment Information:"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_Info")},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_Info,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_Info",$$v);},expression:"form.custom_origin.supplementary_shipment_Info"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_Info"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label ml-lg-30",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-36 ml-sm-16 ml-md-16 ml-auto",attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_Info,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_Info",$$v);},expression:"form.custom_origin.supplementary_shipment_Info"}})],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"IATA and Cass"}},[_c("h5",{staticClass:"ml-5 py-5"},[_vm._v("\n                                        Override IATA And Cass:\n                                    ")]),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","abel-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"IATA:"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_code,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_code",$$v);},expression:"iata_cass.iata_agent_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto mr-7"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Cass:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_cass,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_cass",$$v);},expression:"iata_cass.iata_agent_cass"}})],1)],1),_vm._v(" "),_c("b-col",{staticStyle:{"padding-left":"9.3%"},attrs:{cols:"auto ml-7"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1)],1)],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Agent Information"}},[_c("div",{staticClass:"container py-5"},[_c("div",{staticClass:"row"},[_c("div",{staticClass:"col-md-6"},[_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1",staticStyle:{width:"180px"}},[_vm._v("Override\n                                                                Issuing Agent:")]),_vm._v(" "),_c("th",{staticClass:"form-control1"}),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v(" Agent Name: ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_name,expression:"agent_information.agent_name"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_name},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_name",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v(" Agent Address: ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_address,expression:"agent_information.agent_address"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_address},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_address",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"}),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_city,expression:"agent_information.agent_city"}],staticClass:"form-control",staticStyle:{width:"130px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_city},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_city",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_pincode,expression:"agent_information.agent_pincode"}],staticClass:"form-control",staticStyle:{width:"130px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_pincode},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_pincode",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Issuing Signature:* ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_sign,expression:"agent_information.agent_issue_sign"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_issue_sign},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_sign",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Issuing Location Code:* ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"150px"},model:{value:_vm.agent_information.agent_issue_loc_code,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_issue_loc_code",$$v);},expression:"agent_information.agent_issue_loc_code"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"BLR"}},[_vm._v("BLR, Bangalore (BLR), India\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAE"}},[_vm._v("AAE, Annaba (AAE), Algeria\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAH"}},[_vm._v("AAH, Aachen (AAH), Germany\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAI"}},[_vm._v("AAI, Arraias (AAI), Brazil\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAL"}},[_vm._v("AAL, Aalborg (AAL), Denmark\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAM"}},[_vm._v("AAM, Mala Mala (AAM), South\n                                                                        Africa")]),_vm._v(" "),_c("option",{attrs:{value:"AAN"}},[_vm._v("AAN, Al Ain (AAN), United\n                                                                        Arab Emirates")]),_vm._v(" "),_c("option",{attrs:{value:"AAP"}},[_vm._v("AAP, Samarinda (AAP),\n                                                                        Indonesia")]),_vm._v(" "),_c("option",{attrs:{value:"AAR"}},[_vm._v("AAR, Aarhus (AAR), Denmark\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ABA"}},[_vm._v("ABA, Abakan (ABA), Russian\n                                                                        Federation")]),_vm._v(" "),_c("option",{attrs:{value:"ABC"}},[_vm._v("ABC, Albacete (ABC), Spain\n                                                                    ")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for\n                                                                    later logins")])],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Issuing Date:*")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_date,expression:"agent_information.agent_issue_date"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_issue_date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_date",$event.target.value);}}})]),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"}})],1),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Agent Account:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_account,expression:"agent_information.agent_account"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.agent_account},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_account",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for\n                                                                    later logins")])],1)])])])]),_vm._v(" "),_c("div",{staticClass:"col-md-6"},[_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("Senders Reference:")]),_vm._v(" "),_c("th",{staticClass:"form-control1"}),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-radio",{attrs:{name:"participate",size:"sm",value:"0"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Participant")])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-radio",{attrs:{name:"participate",size:"sm",value:"1"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Office")])],1)]),_vm._v(" "),_vm.agent_information.participate==="0"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Participant Airport:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"150px"},model:{value:_vm.agent_information.participate_airport,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate_airport",$$v);},expression:"agent_information.participate_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"BLR"}},[_vm._v("BLR, Bangalore (BLR), India\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAE"}},[_vm._v("AAE, Annaba (AAE), Algeria\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAH"}},[_vm._v("AAH, Aachen (AAH), Germany\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAI"}},[_vm._v("AAI, Arraias (AAI), Brazil\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAL"}},[_vm._v("AAL, Aalborg (AAL), Denmark\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AAM"}},[_vm._v("AAM, Mala Mala (AAM), South\n                                                                        Africa")]),_vm._v(" "),_c("option",{attrs:{value:"AAN"}},[_vm._v("AAN, Al Ain (AAN), United\n                                                                        Arab Emirates")]),_vm._v(" "),_c("option",{attrs:{value:"AAP"}},[_vm._v("AAP, Samarinda (AAP),\n                                                                        Indonesia")]),_vm._v(" "),_c("option",{attrs:{value:"AAR"}},[_vm._v("AAR, Aarhus (AAR), Denmark\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ABA"}},[_vm._v("ABA, Abakan (ABA), Russian\n                                                                        Federation")]),_vm._v(" "),_c("option",{attrs:{value:"ABC"}},[_vm._v("ABC, Albacete (ABC), Spain\n                                                                    ")])])],1)]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="0"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Participant Identifer:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"150px"},model:{value:_vm.agent_information.prticipant_identifer,callback:function callback($$v){_vm.$set(_vm.agent_information,"prticipant_identifer",$$v);},expression:"agent_information.prticipant_identifer"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AIR"}},[_vm._v(" Airline AIR")]),_vm._v(" "),_c("option",{attrs:{value:"APT"}},[_vm._v("Airport Authority APT\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AGT"}},[_vm._v("Agent AGT")]),_vm._v(" "),_c("option",{attrs:{value:"BRK"}},[_vm._v("Broker BRK")]),_vm._v(" "),_c("option",{attrs:{value:"CAG"}},[_vm._v("Commissionable Agent CAG\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CNE"}},[_vm._v("Consignee CNE")]),_vm._v(" "),_c("option",{attrs:{value:"CTM"}},[_vm._v("Customs CTM")]),_vm._v(" "),_c("option",{attrs:{value:"DCL"}},[_vm._v("Declarant DCL")]),_vm._v(" "),_c("option",{attrs:{value:"DEC"}},[_vm._v("Deconsolidator DEC")]),_vm._v(" "),_c("option",{attrs:{value:"FFW"}},[_vm._v("Freight Forwarder FFW\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"GHA"}},[_vm._v("Ground Handling Agent GHA\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"PTT"}},[_vm._v("Post Office PTT")]),_vm._v(" "),_c("option",{attrs:{value:"SHP"}},[_vm._v("Shipper SHP")]),_vm._v(" "),_c("option",{attrs:{value:"TRK"}},[_vm._v("Trucker TRK")])])],1)]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="0"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Participant Code:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.participant_code,expression:"agent_information.participant_code"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.participant_code},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"participant_code",$event.target.value);}}})])]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="0"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Office File Reference:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_file_reference,expression:"agent_information.office_file_reference"}],staticClass:"form-control",staticStyle:{width:"200px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_file_reference},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_file_reference",$event.target.value);}}})])]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Office Airport:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"150px"},model:{value:_vm.agent_information.office_airport,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_airport",$$v);},expression:"agent_information.office_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"BLR"}},[_vm._v("BLR, Bangalore (BLR), India")]),_vm._v(" "),_c("option",{attrs:{value:"AAE"}},[_vm._v("AAE, Annaba (AAE), Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AAH"}},[_vm._v("AAH, Aachen (AAH), Germany")])])],1)]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Office Function Designator:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_function_designator,expression:"agent_information.office_function_designator"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_function_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_function_designator",$event.target.value);}}})])]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Office Company Designator:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_company_designator,expression:"agent_information.office_company_designator"}],staticClass:"form-control",staticStyle:{width:"150px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_company_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_company_designator",$event.target.value);}}})])]):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Office File Reference:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_file_reference,expression:"agent_information.office_file_reference"}],staticClass:"form-control",staticStyle:{width:"200px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_file_reference},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_file_reference",$event.target.value);}}})])]):_vm._e()])])])])])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Also Notify"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2 mt-2"},[_vm._v(" Also Notify ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Name:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-20",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Letter Of Credit")])],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:""}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-30","class":{"is-invalid":_vm.form.errors.has("also_name")},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_name,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_name",$$v);},expression:"form.also_notify_address.also_name"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name"}})],1)],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Address:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("also_address")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address",$$v);},expression:"form.also_notify_address.also_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31","class":{"is-invalid":_vm.form.errors.has("also_address_line_2")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address_line_2",$$v);},expression:"form.also_notify_address.also_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address_line_2"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"City:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-22","class":{"is-invalid":_vm.form.errors.has("also_city")},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_city,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_city",$$v);},expression:"form.also_notify_address.also_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_airport_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_airport_code",$$v);},expression:"form.also_notify_address.also_airport_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Post Code:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-11","class":{"is-invalid":_vm.form.errors.has("also_post_code")},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_post_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_post_code",$$v);},expression:"form.also_notify_address.also_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"State:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-20","class":{"is-invalid":_vm.form.errors.has("also_state")},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_state,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_state",$$v);},expression:"form.also_notify_address.also_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-s":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Country:"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("also_country")},staticStyle:{width:"220px"},model:{value:_vm.form.also_notify_address.also_country,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_country",$$v);},expression:"form.also_notify_address.also_country"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"IN"}},[_vm._v("India")]),_vm._v(" "),_c("option",{attrs:{value:"USA"}},[_vm._v("United State")]),_vm._v(" "),_c("option",{attrs:{Value:"UK"}},[_vm._v("United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Phone:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-17","class":{"is-invalid":_vm.form.errors.has("also_phone")},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_phone,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_phone",$$v);},expression:"form.also_notify_address.also_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Fax:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-22","class":{"is-invalid":_vm.form.errors.has("also_fax")},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_fax,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_fax",$$v);},expression:"form.also_notify_address.also_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Telex:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-19",attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_telex,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_telex",$$v);},expression:"form.also_notify_address.also_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-lg-35",attrs:{size:"sm"},model:{value:_vm.form.is_also_notify_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_also_notify_address_save",$$v);},expression:"form.is_also_notify_address_save"}},[_vm._v(" Save new address to address\n                                        book")])],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Exta Print Information"}},[_c("h5",[_vm._v(" Extra information printed of Air Way Bill (Only printed - not saved or sent\n                                        to Airlines): ")]),_vm._v(" "),_c("b-form-textarea",{staticStyle:{"grid-column":"span 2 !important",width:"60% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"},model:{value:_vm.form.custom_origin.extra_print,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"extra_print",$$v);},expression:"form.custom_origin.extra_print"}})],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Carrier Address"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2 mt-2"},[_vm._v("Override the Carrier Address on\n                                        the PDF Document\n                                    ")]),_vm._v(" "),_c("h6",[_vm._v(" (This can be used for non-IATA carriers) ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Name:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-20",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Public Address")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Address:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-15",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"City:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-23",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Post Code:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-11",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"State:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-20",attrs:{id:"input-horizontal"}})],1)],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("b-tabs",{staticClass:"nav-tabs",attrs:{"content-class":"mt-3"}},[_c("b-tab",{attrs:{title:"Other Charges"}},[_c("div",{staticClass:"container h_background_color text-white pt-2 pb-2"},[_c("div",{staticClass:"row"},[_c("div",{staticClass:"col text-left"},[_c("h4",[_vm._v("Code")])]),_vm._v(" "),_c("div",{staticClass:"col text-left"},[_c("h4",[_vm._v("Amount In INR")])])])]),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.other_charges.other_charge_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_charge_code",$$v);},expression:"other_charges.other_charge_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select an Other Charge Code")]),_vm._v(" "),_c("option",{attrs:{value:"MY - Fuel Surcharge"}},[_vm._v("MY - Fuel Surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"SC - Security Charge"}},[_vm._v("SC - Security Charge")]),_vm._v(" "),_c("option",{attrs:{value:"AC - Animal Container"}},[_vm._v("AC - Animal Container")]),_vm._v(" "),_c("option",{attrs:{value:"AS - Assembly Service Fee"}},[_vm._v("AS - Assembly Service Fee")]),_vm._v(" "),_c("option",{attrs:{value:"AT - Attendant"}},[_vm._v("AT - Attendant")]),_vm._v(" "),_c("option",{attrs:{value:"AW - Air Waybill Fee"}},[_vm._v("AW - Air Waybill Fee")]),_vm._v(" "),_c("option",{attrs:{value:"BA - Advances And/or Guarantees"}},[_vm._v("BA - Advances And/or Guarantees")]),_vm._v(" "),_c("option",{attrs:{value:"BB - Appraisal Service"}},[_vm._v("BB - Appraisal Service")]),_vm._v(" "),_c("option",{attrs:{value:"BC - AWB Copy"}},[_vm._v("BC - AWB Copy")]),_vm._v(" "),_c("option",{attrs:{value:"BE - Collection Of Funds"}},[_vm._v("BE - Collection Of Funds")]),_vm._v(" "),_c("option",{attrs:{value:"BF - Copies Of Documents"}},[_vm._v("BF - Copies Of Documents")]),_vm._v(" "),_c("option",{attrs:{value:"BH - Messenger Service"}},[_vm._v("BH - Messenger Service")]),_vm._v(" "),_c("option",{attrs:{value:"BI - Import/export Documents Processing"}},[_vm._v("BI - Import/export Documents Processing")]),_vm._v(" "),_c("option",{attrs:{value:"BL - Blacklist Certificate"}},[_vm._v("BL - Blacklist Certificate")]),_vm._v(" "),_c("option",{attrs:{value:"BM - Withdrawal Of Shipment After Clearance"}},[_vm._v("BM - Withdrawal Of Shipment After Clearance")]),_vm._v(" "),_c("option",{attrs:{value:"BR - Bank Release"}},[_vm._v("BR - Bank Release")]),_vm._v(" "),_c("option",{attrs:{value:"CA - Bonding"}},[_vm._v("CA - Bonding")]),_vm._v(" "),_c("option",{attrs:{value:"CB - Completion/preparation Of Documents"}},[_vm._v("CB - Completion/preparation Of Documents")]),_vm._v(" "),_c("option",{attrs:{value:"CC - Manual Data Entry For Customs Purposes"}},[_vm._v("CC - Manual Data Entry For Customs Purposes")]),_vm._v(" "),_c("option",{attrs:{value:"CD - Clearance And Handling"}},[_vm._v("CD - Clearance And Handling")]),_vm._v(" "),_c("option",{attrs:{value:"CE - Export/Import Warrant"}},[_vm._v("CE - Export/Import Warrant")]),_vm._v(" "),_c("option",{attrs:{value:"CF - Inventory And/or Inspection"}},[_vm._v("CF - Inventory And/or Inspection")]),_vm._v(" "),_c("option",{attrs:{value:"CG - Electronic Proc. Or Trans. Of Data For Customs"}},[_vm._v("CG - Electronic Proc. Or Trans. Of Data For Customs")]),_vm._v(" "),_c("option",{attrs:{value:"CH - Clearance And Handling"}},[_vm._v("CH - Clearance And Handling")]),_vm._v(" "),_c("option",{attrs:{value:"CI - Overtime And Other Customs Imposed Charges"}},[_vm._v("CI - Overtime And Other Customs Imposed Charges")]),_vm._v(" "),_c("option",{attrs:{value:"CJ - Removal (carrier Warehouse To Warehouse)"}},[_vm._v("CJ - Removal (carrier Warehouse To Warehouse)")]),_vm._v(" "),_c("option",{attrs:{value:"DB - Disbursement Fee"}},[_vm._v("DB - Disbursement Fee")]),_vm._v(" "),_c("option",{attrs:{value:"DC - Certificate Of Origin"}},[_vm._v("DC - Certificate Of Origin")]),_vm._v(" "),_c("option",{attrs:{value:"DD - Preparation Of Cargo Manifest"}},[_vm._v("DD - Preparation Of Cargo Manifest")]),_vm._v(" "),_c("option",{attrs:{value:"DF - Distribution Service Fee"}},[_vm._v("DF - Distribution Service Fee")]),_vm._v(" "),_c("option",{attrs:{value:"DG - AWB Cancellation"}},[_vm._v("DG - AWB Cancellation")]),_vm._v(" "),_c("option",{attrs:{value:"DH - AWB Charges Correction Advice"}},[_vm._v("DH - AWB Charges Correction Advice")]),_vm._v(" "),_c("option",{attrs:{value:"DI - AWB Re-waybilling"}},[_vm._v("DI - AWB Re-waybilling")]),_vm._v(" "),_c("option",{attrs:{value:"DJ - Proof Of Delivery (documentation)"}},[_vm._v("DJ - Proof Of Delivery (documentation)")]),_vm._v(" "),_c("option",{attrs:{value:"DK - Release Order"}},[_vm._v("DK - Release Order")]),_vm._v(" "),_c("option",{attrs:{value:"DV - Veterinary And/or Phytosanitary Purposes"}},[_vm._v("DV - Veterinary And/or Phytosanitary Purposes")]),_vm._v(" "),_c("option",{attrs:{value:"EA - Handling (Express)"}},[_vm._v("EA - Handling (Express)")]),_vm._v(" "),_c("option",{attrs:{value:"FA - Airport Arrival"}},[_vm._v("FA - Airport Arrival")]),_vm._v(" "),_c("option",{attrs:{value:"FB - Domestic Shipments"}},[_vm._v("FB - Domestic Shipments")]),_vm._v(" "),_c("option",{attrs:{value:"FC - Charges Collect Fee"}},[_vm._v("FC - Charges Collect Fee")]),_vm._v(" "),_c("option",{attrs:{value:"FD - Priority"}},[_vm._v("FD - Priority")]),_vm._v(" "),_c("option",{attrs:{value:"FE - General (Handling)"}},[_vm._v("FE - General (Handling)")]),_vm._v(" "),_c("option",{attrs:{value:"FF - Loading/unloading"}},[_vm._v("FF - Loading/unloading")]),_vm._v(" "),_c("option",{attrs:{value:"FI - Weighing"}},[_vm._v("FI - Weighing")]),_vm._v(" "),_c("option",{attrs:{value:"FS - Fuel Surcharge"}},[_vm._v("FS - Fuel Surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"GA - Diplomatic Consignment"}},[_vm._v("GA - Diplomatic Consignment")]),_vm._v(" "),_c("option",{attrs:{value:"GT - Government Tax"}},[_vm._v("GT - Government Tax")]),_vm._v(" "),_c("option",{attrs:{value:"HB - Mortuary"}},[_vm._v("HB - Mortuary")]),_vm._v(" "),_c("option",{attrs:{value:"HR - Human Remains"}},[_vm._v("HR - Human Remains")]),_vm._v(" "),_c("option",{attrs:{value:"IA - Very Important Cargo (VIC)"}},[_vm._v("IA - Very Important Cargo (VIC)")]),_vm._v(" "),_c("option",{attrs:{value:"IN - Insurance Premium"}},[_vm._v("IN - Insurance Premium")]),_vm._v(" "),_c("option",{attrs:{value:"IR - War Risk"}},[_vm._v("IR - War Risk")]),_vm._v(" "),_c("option",{attrs:{value:"IS - War Risk"}},[_vm._v("IS - War Risk")]),_vm._v(" "),_c("option",{attrs:{value:"JA - Clearance OCText=General"}},[_vm._v("JA - Clearance OCText=General")]),_vm._v(" "),_c("option",{attrs:{value:"KA - Handling (Heavy/Bulky Cargo)"}},[_vm._v("KA - Handling (Heavy/Bulky Cargo)")]),_vm._v(" "),_c("option",{attrs:{value:"KB - Loading/unloading Equipment (forklift Etc.)"}},[_vm._v("KB - Loading/unloading Equipment (forklift Etc.)")]),_vm._v(" "),_c("option",{attrs:{value:"LA - Live Animals"}},[_vm._v("LA - Live Animals")]),_vm._v(" "),_c("option",{attrs:{value:"LC - Cleaning"}},[_vm._v("LC - Cleaning")]),_vm._v(" "),_c("option",{attrs:{value:"LE - Hotel"}},[_vm._v("LE - Hotel")]),_vm._v(" "),_c("option",{attrs:{value:"LF - Quarantine"}},[_vm._v("LF - Quarantine")]),_vm._v(" "),_c("option",{attrs:{value:"LG - Veterinary Inspection"}},[_vm._v("LG - Veterinary Inspection")]),_vm._v(" "),_c("option",{attrs:{value:"LH - Storage (Live Animals)"}},[_vm._v("LH - Storage (Live Animals)")]),_vm._v(" "),_c("option",{attrs:{value:"LI - Cleaning Of Stalls/pens"}},[_vm._v("LI - Cleaning Of Stalls/pens")]),_vm._v(" "),_c("option",{attrs:{value:"LJ - Rental Of Stalls/pens"}},[_vm._v("LJ - Rental Of Stalls/pens")]),_vm._v(" "),_c("option",{attrs:{value:"MA - Miscellaneous A"}},[_vm._v("MA - Miscellaneous A")]),_vm._v(" "),_c("option",{attrs:{value:"MB - Miscellaneous B"}},[_vm._v("MB - Miscellaneous B")]),_vm._v(" "),_c("option",{attrs:{value:"MC - Miscellaneous C"}},[_vm._v("MC - Miscellaneous C")]),_vm._v(" "),_c("option",{attrs:{value:"MD - Miscellaneous D"}},[_vm._v("MD - Miscellaneous D")]),_vm._v(" "),_c("option",{attrs:{value:"ME - Miscellaneous E"}},[_vm._v("ME - Miscellaneous E")]),_vm._v(" "),_c("option",{attrs:{value:"MF - Miscellaneous F"}},[_vm._v("MF - Miscellaneous F")]),_vm._v(" "),_c("option",{attrs:{value:"MG - Miscellaneous G"}},[_vm._v("MG - Miscellaneous G")]),_vm._v(" "),_c("option",{attrs:{value:"MH - Miscellaneous H"}},[_vm._v("MH - Miscellaneous H")]),_vm._v(" "),_c("option",{attrs:{value:"MI - Miscellaneous I"}},[_vm._v("MI - Miscellaneous I")]),_vm._v(" "),_c("option",{attrs:{value:"MJ - Miscellaneous J"}},[_vm._v("MJ - Miscellaneous J")]),_vm._v(" "),_c("option",{attrs:{value:"MK - Miscellaneous K"}},[_vm._v("MK - Miscellaneous K")]),_vm._v(" "),_c("option",{attrs:{value:"ML - Miscellaneous L"}},[_vm._v("ML - Miscellaneous L")]),_vm._v(" "),_c("option",{attrs:{value:"MM - Miscellaneous M"}},[_vm._v("MM - Miscellaneous M")]),_vm._v(" "),_c("option",{attrs:{value:"MN - Miscellaneous N"}},[_vm._v("MN - Miscellaneous N")]),_vm._v(" "),_c("option",{attrs:{value:"MO - Miscellaneous O"}},[_vm._v("MO - Miscellaneous O")]),_vm._v(" "),_c("option",{attrs:{value:"MP - Miscellaneous P"}},[_vm._v("MP - Miscellaneous P")]),_vm._v(" "),_c("option",{attrs:{value:"MQ - Miscellaneous Q"}},[_vm._v("MQ - Miscellaneous Q")]),_vm._v(" "),_c("option",{attrs:{value:"MR - Airfreight Surcharge"}},[_vm._v("MR - Airfreight Surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"MS - Miscellaneous S"}},[_vm._v("MS - Miscellaneous S")]),_vm._v(" "),_c("option",{attrs:{value:"MT - Miscellaneous T"}},[_vm._v("MT - Miscellaneous T")]),_vm._v(" "),_c("option",{attrs:{value:"MU - Miscellaneous U"}},[_vm._v("MU - Miscellaneous U")]),_vm._v(" "),_c("option",{attrs:{value:"MV - Miscellaneous V"}},[_vm._v("MV - Miscellaneous V")]),_vm._v(" "),_c("option",{attrs:{value:"MW - Miscellaneous W"}},[_vm._v("MW - Miscellaneous W")]),_vm._v(" "),_c("option",{attrs:{value:"MX - Miscellaneous X"}},[_vm._v("MX - Miscellaneous X")]),_vm._v(" "),_c("option",{attrs:{value:"MY - Fuel Surcharge"}},[_vm._v("MY - Fuel Surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"MZ - Miscellaneous Z"}},[_vm._v("MZ - Miscellaneous Z")]),_vm._v(" "),_c("option",{attrs:{value:"NS - Navigation Surcharge"}},[_vm._v("NS - Navigation Surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"PA - Handling (Perishables)"}},[_vm._v("PA - Handling (Perishables)")]),_vm._v(" "),_c("option",{attrs:{value:"PB - Cool/Cold Room OCText=freezer (Perishables)"}},[_vm._v("PB - Cool/Cold Room OCText=freezer (Perishables)")]),_vm._v(" "),_c("option",{attrs:{value:"PK - Packing/Repacking"}},[_vm._v("PK - Packing/Repacking")]),_vm._v(" "),_c("option",{attrs:{value:"PU - Pick-Up"}},[_vm._v("PU - Pick-Up")]),_vm._v(" "),_c("option",{attrs:{value:"RA - Dangerous Goods Fee"}},[_vm._v("RA - Dangerous Goods Fee")]),_vm._v(" "),_c("option",{attrs:{value:"RB - Rejection"}},[_vm._v("RB - Rejection")]),_vm._v(" "),_c("option",{attrs:{value:"RC - Referral Of Charge"}},[_vm._v("RC - Referral Of Charge")]),_vm._v(" "),_c("option",{attrs:{value:"RD - Radio-active Room"}},[_vm._v("RD - Radio-active Room")]),_vm._v(" "),_c("option",{attrs:{value:"RF - Remit Following Collection Fee"}},[_vm._v("RF - Remit Following Collection Fee")]),_vm._v(" "),_c("option",{attrs:{value:"SA - Delivery"}},[_vm._v("SA - Delivery")]),_vm._v(" "),_c("option",{attrs:{value:"SB - Delivery Notification"}},[_vm._v("SB - Delivery Notification")]),_vm._v(" "),_c("option",{attrs:{value:"SC - Security Charge"}},[_vm._v("SC - Security Charge")]),_vm._v(" "),_c("option",{attrs:{value:"SD - Surface Charge"}},[_vm._v("SD - Surface Charge")]),_vm._v(" "),_c("option",{attrs:{value:"SE - Proof Of Delivery (pickup And Delivery)"}},[_vm._v("SE - Proof Of Delivery (pickup And Delivery)")]),_vm._v(" "),_c("option",{attrs:{value:"SF - Delivery Order"}},[_vm._v("SF - Delivery Order")]),_vm._v(" "),_c("option",{attrs:{value:"SI - Stop In Transit"}},[_vm._v("SI - Stop In Transit")]),_vm._v(" "),_c("option",{attrs:{value:"SO - Storage"}},[_vm._v("SO - Storage")]),_vm._v(" "),_c("option",{attrs:{value:"SP - Separate Early Release"}},[_vm._v("SP - Separate Early Release")]),_vm._v(" "),_c("option",{attrs:{value:"SR - Storage"}},[_vm._v("SR - Storage")]),_vm._v(" "),_c("option",{attrs:{value:"SS - Signature Service"}},[_vm._v("SS - Signature Service")]),_vm._v(" "),_c("option",{attrs:{value:"ST - State Sales Tax"}},[_vm._v("ST - State Sales Tax")]),_vm._v(" "),_c("option",{attrs:{value:"SU - Surface Charge"}},[_vm._v("SU - Surface Charge")]),_vm._v(" "),_c("option",{attrs:{value:"TA - Postal Tax"}},[_vm._v("TA - Postal Tax")]),_vm._v(" "),_c("option",{attrs:{value:"TB - Sales Tax"}},[_vm._v("TB - Sales Tax")]),_vm._v(" "),_c("option",{attrs:{value:"TC - Stamp Tax"}},[_vm._v("TC - Stamp Tax")]),_vm._v(" "),_c("option",{attrs:{value:"TD - State Tax"}},[_vm._v("TD - State Tax")]),_vm._v(" "),_c("option",{attrs:{value:"TE - Statistical Tax"}},[_vm._v("TE - Statistical Tax")]),_vm._v(" "),_c("option",{attrs:{value:"TH - Terminal Handling"}},[_vm._v("TH - Terminal Handling")]),_vm._v(" "),_c("option",{attrs:{value:"TI - Value Added Tax (For Import Only)"}},[_vm._v("TI - Value Added Tax (For Import Only)")]),_vm._v(" "),_c("option",{attrs:{value:"TR - Transit"}},[_vm._v("TR - Transit")]),_vm._v(" "),_c("option",{attrs:{value:"TV - Value Added Tax (General Or For Export)"}},[_vm._v("TV - Value Added Tax (General Or For Export)")]),_vm._v(" "),_c("option",{attrs:{value:"TX - General Taxes"}},[_vm._v("TX - General Taxes")]),_vm._v(" "),_c("option",{attrs:{value:"UB - Disassembly"}},[_vm._v("UB - Disassembly")]),_vm._v(" "),_c("option",{attrs:{value:"UC - Adjusting Of Improperly Loaded ULD"}},[_vm._v("UC - Adjusting Of Improperly Loaded ULD")]),_vm._v(" "),_c("option",{attrs:{value:"UD - Demurrage"}},[_vm._v("UD - Demurrage")]),_vm._v(" "),_c("option",{attrs:{value:"UE - Leasing"}},[_vm._v("UE - Leasing")]),_vm._v(" "),_c("option",{attrs:{value:"UF - Recontouring"}},[_vm._v("UF - Recontouring")]),_vm._v(" "),_c("option",{attrs:{value:"UG - Unloading (Unit Load Device)"}},[_vm._v("UG - Unloading (Unit Load Device)")]),_vm._v(" "),_c("option",{attrs:{value:"UH - Handling (Unit Load Device)"}},[_vm._v("UH - Handling (Unit Load Device)")]),_vm._v(" "),_c("option",{attrs:{value:"VA - Handling (Valuable Cargo)"}},[_vm._v("VA - Handling (Valuable Cargo)")]),_vm._v(" "),_c("option",{attrs:{value:"VB - Security (armed Guard/escort) Handling"}},[_vm._v("VB - Security (armed Guard/escort) Handling")]),_vm._v(" "),_c("option",{attrs:{value:"VC - Strongroom"}},[_vm._v("VC - Strongroom")]),_vm._v(" "),_c("option",{attrs:{value:"VE - Vetrinarian Charge"}},[_vm._v("VE - Vetrinarian Charge")]),_vm._v(" "),_c("option",{attrs:{value:"VS - VARIOUS SURCHARGE"}},[_vm._v("VS - VARIOUS SURCHARGE")]),_vm._v(" "),_c("option",{attrs:{value:"WA - Handling (Vulnerable Cargo)"}},[_vm._v("WA - Handling (Vulnerable Cargo)")]),_vm._v(" "),_c("option",{attrs:{value:"WR - War Risk"}},[_vm._v("WR - War Risk")]),_vm._v(" "),_c("option",{attrs:{value:"XB - Security (Surcharge/premiums)"}},[_vm._v("XB - Security (Surcharge/premiums)")]),_vm._v(" "),_c("option",{attrs:{value:"XC - Time"}},[_vm._v("XC - Time")]),_vm._v(" "),_c("option",{attrs:{value:"XD - War Risk"}},[_vm._v("XD - War Risk")]),_vm._v(" "),_c("option",{attrs:{value:"XE - Weight"}},[_vm._v("XE - Weight")]),_vm._v(" "),_c("option",{attrs:{value:"XR - Security Handling"}},[_vm._v("XR - Security Handling")]),_vm._v(" "),_c("option",{attrs:{value:"ZA - Re-warehousing"}},[_vm._v("ZA - Re-warehousing")]),_vm._v(" "),_c("option",{attrs:{value:"ZB - General (Storage)"}},[_vm._v("ZB - General (Storage)")]),_vm._v(" "),_c("option",{attrs:{value:"ZC - Cool/Cold Room Freezer (Storage)"}},[_vm._v("ZC - Cool/Cold Room Freezer (Storage)")])])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{placeholder:"or:"},model:{value:_vm.other_charges.other_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_code",$$v);},expression:"other_charges.other_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",model:{value:_vm.other_charges.amount,callback:function callback($$v){_vm.$set(_vm.other_charges,"amount",$$v);},expression:"other_charges.amount"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"A"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due\n                                                Agent")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"C"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Carrier")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"P"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Prepaid")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"C"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Collect")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"bg-secondary form-control-sm px-5",on:{click:_vm.addCharge}},[_vm._v("\n                                                "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                            ")])],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v(" Calculate Charge ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"}),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v(" Chargeable Weight ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.chargable_weight1,expression:"other_charges.chargable_weight1"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.other_charges.chargable_weight1},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"chargable_weight1",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v(" Charge ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.charge,expression:"other_charges.charge"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.other_charges.charge},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"charge",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2"},[_c("b-button",{staticClass:"bg-secondary form-control-sm px-5",on:{click:_vm.calculateCharge}},[_vm._v("Calculate")])],1)])])])]),_vm._v(" "),_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Due")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Amount")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Type Of Payment")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Actions")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.charges,function(charge,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                "+_vm._s(charge.other_charge_code||charge.other_code)+"\n                                            ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                "+_vm._s(charge.due)+"\n                                            ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                "+_vm._s(charge.amount)+".00\n                                            ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                "+_vm._s(charge.payment_type)+"\n                                            ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-button",{attrs:{size:"sm"},on:{click:function click($event){return _vm.editCharge(index);}}},[_c("b-icon",{attrs:{icon:"pencil","font-scale":"1"}})],1),_vm._v(" "),_c("b-button",{attrs:{size:"sm"},on:{click:function click($event){return _vm.removeCharge(index);}}},[_c("b-icon",{attrs:{icon:"trash"}})],1)],1)]);}),0)]),_vm._v(" "),_c("hr",{staticClass:"hr"})],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-tabs",[_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Payment Information",active:""}},[_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"7"}},[_c("b-row",{staticClass:"justify-content-center mt-5"},[_c("b-col",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Type Of Payment:*"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-15",staticStyle:{width:"220px"},model:{value:_vm.form.payment_info.type_of_payment,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"type_of_payment",$$v);},expression:"form.payment_info.type_of_payment"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CA - Partial collect credit - partial prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CB - Partial collect credit - partial prepaid credit")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CC - All charges collect")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CG - All Charges collect by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CP - Destination collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CX - Destination collect credit")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("NC - Service rate. No charge")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PC - Partial prepaid cash - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PD - Partial prepaid credit - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PG - All charges prepaid by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PP - All charges prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PX - All charges prepaid credit")])])],1),_vm._v(" "),_c("label",{staticClass:"ml-3 mt-4 mb-5 mr-5"},[_vm._v("Currency:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("currency")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.currency,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"currency",$$v);},expression:"form.payment_info.currency"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"currency"}})],1),_vm._v(" "),_c("label",{staticClass:"ml-3 mt-5 mb-5"},[_vm._v("Declared Values For:")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Carriage :"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31 mt-3",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_carriage,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_carriage",$$v);},expression:"form.payment_info.declear_value_carriage"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Customs :"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31 mt-3",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_customs,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_customs",$$v);},expression:"form.payment_info.declear_value_customs"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Insurance:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-30 mt-3",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_insurance,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_insurance",$$v);},expression:"form.payment_info.declear_value_insurance"}})],1)],1)],1)],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"5"}},[_c("table",{staticClass:"table-bordered ml-auto table-sm m-5"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("Charges Summary")]),_vm._v(" "),_c("th",[_vm._v("Prepaid")]),_vm._v(" "),_c("th",[_vm._v("Collect")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Weight Charge (WT)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.prepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.collect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Taxes (TX)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.taxes.toFixed(2))+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Agent (OA)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentPrepaid)+" INR\n                                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentCollect)+" INR\n                                                        ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Carrier (OC)\n                                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierPrepaid)+" INR\n                                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierCollect)+" INR\n                                                        ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Total Charges")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChargesPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChrage)+" INR")])])])])])],1)],1)]),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Special Handling Codes"}},[_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("special_handling_code")},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select Special Handling Codes")]),_vm._v(" "),_vm._l(_vm.codes,function(code){return _c("option",{key:code.value,domProps:{value:code.value}},[_vm._v(_vm._s(code.text))]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_handling_code"}})],1)],1),_vm._v("\n                                        or:\n                                        "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"}},[_vm._v("or:")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"form-control-sm",attrs:{id:"input-horizontal",type:"button"},on:{click:_vm.addManualCode}},[_vm._v("Add")])],1)],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm",staticStyle:{width:"31%"}},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("td",{staticClass:"editable-cell"},[_vm._v("Code")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.tableCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteSplCode(index);}}})],1)]);}),0)])])]),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Other Customs Information"}},[_c("b-tabs",{staticClass:"mt-lg-5"},[_c("b-tab",{staticClass:"mt-lg-7",attrs:{title:"Other Customs Information"}},[_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm",staticStyle:{width:"100%"}},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                            Country Code:\n                                                        ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v(" Information Identifier: ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v(" Customs Information Identifier\n                                                        ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("country_code")},model:{value:_vm.oci_info.country_code,callback:function callback($$v){_vm.$set(_vm.oci_info,"country_code",$$v);},expression:"oci_info.country_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a country")]),_vm._v(" "),_c("option",{attrs:{value:"AF"}},[_vm._v("Afghanistan")]),_vm._v(" "),_c("option",{attrs:{value:"AX"}},[_vm._v("Åland Islands")]),_vm._v(" "),_c("option",{attrs:{value:"AL"}},[_vm._v("Albania")]),_vm._v(" "),_c("option",{attrs:{value:"DZ"}},[_vm._v("Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AS"}},[_vm._v("American Samoa")]),_vm._v(" "),_c("option",{attrs:{value:"AD"}},[_vm._v("Andorra")]),_vm._v(" "),_c("option",{attrs:{value:"AO"}},[_vm._v("Angola")]),_vm._v(" "),_c("option",{attrs:{value:"AI"}},[_vm._v("Anguilla")]),_vm._v(" "),_c("option",{attrs:{value:"AQ"}},[_vm._v("Antarctica")]),_vm._v(" "),_c("option",{attrs:{value:"AG"}},[_vm._v("Antigua and Barbuda")]),_vm._v(" "),_c("option",{attrs:{value:"AR"}},[_vm._v("Argentina")]),_vm._v(" "),_c("option",{attrs:{value:"AM"}},[_vm._v("Armenia")]),_vm._v(" "),_c("option",{attrs:{value:"AW"}},[_vm._v("Aruba")]),_vm._v(" "),_c("option",{attrs:{value:"AU"}},[_vm._v("Australia")]),_vm._v(" "),_c("option",{attrs:{value:"AT"}},[_vm._v("Austria")]),_vm._v(" "),_c("option",{attrs:{value:"AZ"}},[_vm._v("Azerbaijan")]),_vm._v(" "),_c("option",{attrs:{value:"BS"}},[_vm._v("Bahamas")]),_vm._v(" "),_c("option",{attrs:{value:"BH"}},[_vm._v("Bahrain")]),_vm._v(" "),_c("option",{attrs:{value:"BD"}},[_vm._v("Bangladesh")]),_vm._v(" "),_c("option",{attrs:{value:"BB"}},[_vm._v("Barbados")]),_vm._v(" "),_c("option",{attrs:{value:"BY"}},[_vm._v("Belarus")]),_vm._v(" "),_c("option",{attrs:{value:"BE"}},[_vm._v("Belgium")]),_vm._v(" "),_c("option",{attrs:{value:"BZ"}},[_vm._v("Belize")]),_vm._v(" "),_c("option",{attrs:{value:"BJ"}},[_vm._v("Benin")]),_vm._v(" "),_c("option",{attrs:{value:"BM"}},[_vm._v("Bermuda")]),_vm._v(" "),_c("option",{attrs:{value:"BT"}},[_vm._v("Bhutan")]),_vm._v(" "),_c("option",{attrs:{value:"BO"}},[_vm._v("Bolivia")]),_vm._v(" "),_c("option",{attrs:{value:"BQ"}},[_vm._v("Bonaire")]),_vm._v(" "),_c("option",{attrs:{value:"BA"}},[_vm._v("Bosnia and Herzegovina\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"BW"}},[_vm._v("Botswana")]),_vm._v(" "),_c("option",{attrs:{value:"BV"}},[_vm._v("Bouvet Island")]),_vm._v(" "),_c("option",{attrs:{value:"BR"}},[_vm._v("Brazil")]),_vm._v(" "),_c("option",{attrs:{value:"IO"}},[_vm._v("British Indian Ocean\n                                                                        Territory")]),_vm._v(" "),_c("option",{attrs:{value:"BN"}},[_vm._v("Brunei Darussalam")]),_vm._v(" "),_c("option",{attrs:{value:"BG"}},[_vm._v("Bulgaria")]),_vm._v(" "),_c("option",{attrs:{value:"BF"}},[_vm._v("Burkina Faso")]),_vm._v(" "),_c("option",{attrs:{value:"BI"}},[_vm._v("Burundi")]),_vm._v(" "),_c("option",{attrs:{value:"KH"}},[_vm._v("Cambodia")]),_vm._v(" "),_c("option",{attrs:{value:"CM"}},[_vm._v("Cameroon")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("Canada")]),_vm._v(" "),_c("option",{attrs:{value:"CV"}},[_vm._v("Cape Verde")]),_vm._v(" "),_c("option",{attrs:{value:"KY"}},[_vm._v("Cayman Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CF"}},[_vm._v("Central African Republic\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("Chad")]),_vm._v(" "),_c("option",{attrs:{value:"CL"}},[_vm._v("Chile")]),_vm._v(" "),_c("option",{attrs:{value:"CN"}},[_vm._v("China")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("Christmas Island")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("Cocos (Keeling) Islands\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CO"}},[_vm._v("Colombia")]),_vm._v(" "),_c("option",{attrs:{value:"KM"}},[_vm._v("Comoros")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("Congo")]),_vm._v(" "),_c("option",{attrs:{value:"CD"}},[_vm._v("Congo, the Democratic\n                                                                        Republic of the")]),_vm._v(" "),_c("option",{attrs:{value:"CK"}},[_vm._v("Cook Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CR"}},[_vm._v("Costa Rica")]),_vm._v(" "),_c("option",{attrs:{value:"CI"}},[_vm._v("Côte d'Ivoire")]),_vm._v(" "),_c("option",{attrs:{value:"HR"}},[_vm._v("Croatia")]),_vm._v(" "),_c("option",{attrs:{value:"CU"}},[_vm._v("Cuba")]),_vm._v(" "),_c("option",{attrs:{value:"CW"}},[_vm._v("Curacao")]),_vm._v(" "),_c("option",{attrs:{value:"CY"}},[_vm._v("Cyprus")]),_vm._v(" "),_c("option",{attrs:{value:"CZ"}},[_vm._v("Czech Republic")]),_vm._v(" "),_c("option",{attrs:{value:"DK"}},[_vm._v("Denmark")]),_vm._v(" "),_c("option",{attrs:{value:"DJ"}},[_vm._v("Djibouti")]),_vm._v(" "),_c("option",{attrs:{value:"DM"}},[_vm._v("Dominica")]),_vm._v(" "),_c("option",{attrs:{value:"DO"}},[_vm._v("Dominican Republic")]),_vm._v(" "),_c("option",{attrs:{value:"EC"}},[_vm._v("Ecuador")]),_vm._v(" "),_c("option",{attrs:{value:"EG"}},[_vm._v("Egypt")]),_vm._v(" "),_c("option",{attrs:{value:"SV"}},[_vm._v("El Salvador")]),_vm._v(" "),_c("option",{attrs:{value:"GQ"}},[_vm._v("Equatorial Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"ER"}},[_vm._v("Eritrea")]),_vm._v(" "),_c("option",{attrs:{value:"EE"}},[_vm._v("Estonia")]),_vm._v(" "),_c("option",{attrs:{value:"ET"}},[_vm._v("Ethiopia")]),_vm._v(" "),_c("option",{attrs:{value:"FK"}},[_vm._v("Falkland Islands (Malvinas)\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"FO"}},[_vm._v("Faroe Islands")]),_vm._v(" "),_c("option",{attrs:{value:"FJ"}},[_vm._v("Fiji")]),_vm._v(" "),_c("option",{attrs:{value:"FI"}},[_vm._v("Finland")]),_vm._v(" "),_c("option",{attrs:{value:"FR"}},[_vm._v("France")]),_vm._v(" "),_c("option",{attrs:{value:"GF"}},[_vm._v("French Guiana")]),_vm._v(" "),_c("option",{attrs:{value:"PF"}},[_vm._v("French Polynesia")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("French Southern Territories\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"GA"}},[_vm._v("Gabon")]),_vm._v(" "),_c("option",{attrs:{value:"GM"}},[_vm._v("Gambia")]),_vm._v(" "),_c("option",{attrs:{value:"GE"}},[_vm._v("Georgia")]),_vm._v(" "),_c("option",{attrs:{value:"DE"}},[_vm._v("Germany")]),_vm._v(" "),_c("option",{attrs:{value:"GH"}},[_vm._v("Ghana")]),_vm._v(" "),_c("option",{attrs:{value:"GI"}},[_vm._v("Gibraltar")]),_vm._v(" "),_c("option",{attrs:{value:"GR"}},[_vm._v("Greece")]),_vm._v(" "),_c("option",{attrs:{value:"GL"}},[_vm._v("Greenland")]),_vm._v(" "),_c("option",{attrs:{value:"GD"}},[_vm._v("Grenada")]),_vm._v(" "),_c("option",{attrs:{value:"GP"}},[_vm._v("Guadeloupe")]),_vm._v(" "),_c("option",{attrs:{value:"GU"}},[_vm._v("Guam")]),_vm._v(" "),_c("option",{attrs:{value:"GT"}},[_vm._v("Guatemala")]),_vm._v(" "),_c("option",{attrs:{value:"GG"}},[_vm._v("Guernsey")]),_vm._v(" "),_c("option",{attrs:{value:"GN"}},[_vm._v("Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"GW"}},[_vm._v("Guinea-Bissau")]),_vm._v(" "),_c("option",{attrs:{value:"GY"}},[_vm._v("Guyana")]),_vm._v(" "),_c("option",{attrs:{value:"HT"}},[_vm._v("Haiti")]),_vm._v(" "),_c("option",{attrs:{value:"HM"}},[_vm._v("Heard Island and McDonald\n                                                                        Islands")]),_vm._v(" "),_c("option",{attrs:{value:"VA"}},[_vm._v("Holy See (Vatican City State)\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"HN"}},[_vm._v("Honduras")]),_vm._v(" "),_c("option",{attrs:{value:"HK"}},[_vm._v("Hong Kong")]),_vm._v(" "),_c("option",{attrs:{value:"HU"}},[_vm._v("Hungary")]),_vm._v(" "),_c("option",{attrs:{value:"IS"}},[_vm._v("Iceland")]),_vm._v(" "),_c("option",{attrs:{value:"IN"}},[_vm._v("India")]),_vm._v(" "),_c("option",{attrs:{value:"ID"}},[_vm._v("Indonesia")]),_vm._v(" "),_c("option",{attrs:{value:"IR"}},[_vm._v("Iran, Islamic Republic of\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"IQ"}},[_vm._v("Iraq")]),_vm._v(" "),_c("option",{attrs:{value:"IE"}},[_vm._v("Ireland")]),_vm._v(" "),_c("option",{attrs:{value:"IM"}},[_vm._v("Isle of Man")]),_vm._v(" "),_c("option",{attrs:{value:"IL"}},[_vm._v("Israel")]),_vm._v(" "),_c("option",{attrs:{value:"IT"}},[_vm._v("Italy")]),_vm._v(" "),_c("option",{attrs:{value:"JM"}},[_vm._v("Jamaica")]),_vm._v(" "),_c("option",{attrs:{value:"JP"}},[_vm._v("Japan")]),_vm._v(" "),_c("option",{attrs:{value:"JE"}},[_vm._v("Jersey")]),_vm._v(" "),_c("option",{attrs:{value:"JO"}},[_vm._v("Jordan")]),_vm._v(" "),_c("option",{attrs:{value:"KZ"}},[_vm._v("Kazakhstan")]),_vm._v(" "),_c("option",{attrs:{value:"KE"}},[_vm._v("Kenya")]),_vm._v(" "),_c("option",{attrs:{value:"KI"}},[_vm._v("Kiribati")]),_vm._v(" "),_c("option",{attrs:{value:"KP"}},[_vm._v("Korea, Democratic People's\n                                                                        Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"KR"}},[_vm._v("Korea, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"XK"}},[_vm._v("Kosovo, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"KW"}},[_vm._v("Kuwait")]),_vm._v(" "),_c("option",{attrs:{value:"KG"}},[_vm._v("Kyrgyzstan")]),_vm._v(" "),_c("option",{attrs:{value:"LA"}},[_vm._v("Lao People's Democratic\n                                                                        Republic")]),_vm._v(" "),_c("option",{attrs:{value:"LV"}},[_vm._v("Latvia")]),_vm._v(" "),_c("option",{attrs:{value:"LB"}},[_vm._v("Lebanon")]),_vm._v(" "),_c("option",{attrs:{value:"LS"}},[_vm._v("Lesotho")]),_vm._v(" "),_c("option",{attrs:{value:"LR"}},[_vm._v("Liberia")]),_vm._v(" "),_c("option",{attrs:{value:"LY"}},[_vm._v("Libya")]),_vm._v(" "),_c("option",{attrs:{value:"LI"}},[_vm._v("Liechtenstein")]),_vm._v(" "),_c("option",{attrs:{value:"LT"}},[_vm._v("Lithuania")]),_vm._v(" "),_c("option",{attrs:{value:"LU"}},[_vm._v("Luxembourg")]),_vm._v(" "),_c("option",{attrs:{value:"MO"}},[_vm._v("Macao")]),_vm._v(" "),_c("option",{attrs:{value:"MK"}},[_vm._v("Macedonia, the former\n                                                                        Yugoslav Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"MG"}},[_vm._v("Madagascar")]),_vm._v(" "),_c("option",{attrs:{value:"MW"}},[_vm._v("Malawi")]),_vm._v(" "),_c("option",{attrs:{value:"MY"}},[_vm._v("Malaysia")]),_vm._v(" "),_c("option",{attrs:{value:"MV"}},[_vm._v("Maldives")]),_vm._v(" "),_c("option",{attrs:{value:"ML"}},[_vm._v("Mali")]),_vm._v(" "),_c("option",{attrs:{value:"MT"}},[_vm._v("Malta")]),_vm._v(" "),_c("option",{attrs:{value:"MH"}},[_vm._v("Marshall Islands")]),_vm._v(" "),_c("option",{attrs:{value:"MQ"}},[_vm._v("Martinique")]),_vm._v(" "),_c("option",{attrs:{value:"MR"}},[_vm._v("Mauritania")]),_vm._v(" "),_c("option",{attrs:{value:"MU"}},[_vm._v("Mauritius")]),_vm._v(" "),_c("option",{attrs:{value:"YT"}},[_vm._v("Mayotte")]),_vm._v(" "),_c("option",{attrs:{value:"MX"}},[_vm._v("Mexico")]),_vm._v(" "),_c("option",{attrs:{value:"FM"}},[_vm._v("Micronesia, Federated States\n                                                                        of")]),_vm._v(" "),_c("option",{attrs:{value:"MD"}},[_vm._v("Moldova, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"MC"}},[_vm._v("Monaco")]),_vm._v(" "),_c("option",{attrs:{value:"MN"}},[_vm._v("Mongolia")]),_vm._v(" "),_c("option",{attrs:{value:"ME"}},[_vm._v("Montenegro")]),_vm._v(" "),_c("option",{attrs:{value:"MS"}},[_vm._v("Montserrat")]),_vm._v(" "),_c("option",{attrs:{value:"MA"}},[_vm._v("Morocco")]),_vm._v(" "),_c("option",{attrs:{value:"MZ"}},[_vm._v("Mozambique")]),_vm._v(" "),_c("option",{attrs:{value:"MM"}},[_vm._v("Myanmar")]),_vm._v(" "),_c("option",{attrs:{value:"NA"}},[_vm._v("Namibia")]),_vm._v(" "),_c("option",{attrs:{value:"NR"}},[_vm._v("Nauru")]),_vm._v(" "),_c("option",{attrs:{value:"NP"}},[_vm._v("Nepal")]),_vm._v(" "),_c("option",{attrs:{value:"NL"}},[_vm._v("Netherlands")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("New Caledonia")]),_vm._v(" "),_c("option",{attrs:{value:"NZ"}},[_vm._v("New Zealand")]),_vm._v(" "),_c("option",{attrs:{value:"NI"}},[_vm._v("Nicaragua")]),_vm._v(" "),_c("option",{attrs:{value:"NE"}},[_vm._v("Niger")]),_vm._v(" "),_c("option",{attrs:{value:"NG"}},[_vm._v("Nigeria")]),_vm._v(" "),_c("option",{attrs:{value:"NU"}},[_vm._v("Niue")]),_vm._v(" "),_c("option",{attrs:{value:"NF"}},[_vm._v("Norfolk Island")]),_vm._v(" "),_c("option",{attrs:{value:"XI"}},[_vm._v("Northern Ireland")]),_vm._v(" "),_c("option",{attrs:{value:"MP"}},[_vm._v("Northern Mariana Islands\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"NO"}},[_vm._v("Norway")]),_vm._v(" "),_c("option",{attrs:{value:"OM"}},[_vm._v("Oman")]),_vm._v(" "),_c("option",{attrs:{value:"PK"}},[_vm._v("Pakistan")]),_vm._v(" "),_c("option",{attrs:{value:"PW"}},[_vm._v("Palau")]),_vm._v(" "),_c("option",{attrs:{value:"PS"}},[_vm._v("Palestinian Territory,\n                                                                        Occupied")]),_vm._v(" "),_c("option",{attrs:{value:"PA"}},[_vm._v("Panama")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("Papua New Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"PY"}},[_vm._v("Paraguay")]),_vm._v(" "),_c("option",{attrs:{value:"PE"}},[_vm._v("Peru")]),_vm._v(" "),_c("option",{attrs:{value:"PH"}},[_vm._v("Philippines")]),_vm._v(" "),_c("option",{attrs:{value:"PN"}},[_vm._v("Pitcairn")]),_vm._v(" "),_c("option",{attrs:{value:"PL"}},[_vm._v("Poland")]),_vm._v(" "),_c("option",{attrs:{value:"PT"}},[_vm._v("Portugal")]),_vm._v(" "),_c("option",{attrs:{value:"PR"}},[_vm._v("Puerto Rico")]),_vm._v(" "),_c("option",{attrs:{value:"QA"}},[_vm._v("Qatar")]),_vm._v(" "),_c("option",{attrs:{value:"RE"}},[_vm._v("Reunion Réunion")]),_vm._v(" "),_c("option",{attrs:{value:"RO"}},[_vm._v("Romania")]),_vm._v(" "),_c("option",{attrs:{value:"RU"}},[_vm._v("Russian Federation")]),_vm._v(" "),_c("option",{attrs:{value:"RW"}},[_vm._v("Rwanda")]),_vm._v(" "),_c("option",{attrs:{value:"BL"}},[_vm._v("Saint Barthélemy")]),_vm._v(" "),_c("option",{attrs:{value:"SH"}},[_vm._v("Saint Helena")]),_vm._v(" "),_c("option",{attrs:{value:"KN"}},[_vm._v("Saint Kitts and Nevis\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"LC"}},[_vm._v("Saint Lucia")]),_vm._v(" "),_c("option",{attrs:{value:"MF"}},[_vm._v("Saint Martin (French part)\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"PM"}},[_vm._v("Saint Pierre and Miquelon\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"VC"}},[_vm._v("Saint Vincent and the\n                                                                        Grenadines")]),_vm._v(" "),_c("option",{attrs:{value:"WS"}},[_vm._v("Samoa")]),_vm._v(" "),_c("option",{attrs:{value:"SM"}},[_vm._v("San Marino")]),_vm._v(" "),_c("option",{attrs:{value:"ST"}},[_vm._v("Sao Tome and Principe\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SA"}},[_vm._v("Saudi Arabia")]),_vm._v(" "),_c("option",{attrs:{value:"SN"}},[_vm._v("Senegal")]),_vm._v(" "),_c("option",{attrs:{value:"RS"}},[_vm._v("Serbia")]),_vm._v(" "),_c("option",{attrs:{value:"SC"}},[_vm._v("Seychelles")]),_vm._v(" "),_c("option",{attrs:{value:"SL"}},[_vm._v("Sierra Leone")]),_vm._v(" "),_c("option",{attrs:{value:"SG"}},[_vm._v("Singapore")]),_vm._v(" "),_c("option",{attrs:{value:"SX"}},[_vm._v("Sint Maarten")]),_vm._v(" "),_c("option",{attrs:{value:"SK"}},[_vm._v("Slovakia")]),_vm._v(" "),_c("option",{attrs:{value:"SI"}},[_vm._v("Slovenia")]),_vm._v(" "),_c("option",{attrs:{value:"SB"}},[_vm._v("Solomon Islands")]),_vm._v(" "),_c("option",{attrs:{value:"SO"}},[_vm._v("Somalia")]),_vm._v(" "),_c("option",{attrs:{value:"ZA"}},[_vm._v("South Africa")]),_vm._v(" "),_c("option",{attrs:{value:"GS"}},[_vm._v("South Georgia and the South\n                                                                        Sandwich Islands")]),_vm._v(" "),_c("option",{attrs:{value:"SS"}},[_vm._v("South Sudan")]),_vm._v(" "),_c("option",{attrs:{value:"ES"}},[_vm._v("Spain")]),_vm._v(" "),_c("option",{attrs:{value:"LK"}},[_vm._v("Sri Lanka")]),_vm._v(" "),_c("option",{attrs:{value:"SD"}},[_vm._v("Sudan")]),_vm._v(" "),_c("option",{attrs:{value:"SR"}},[_vm._v("Suriname")]),_vm._v(" "),_c("option",{attrs:{value:"SJ"}},[_vm._v("Svalbard and Jan Mayen\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SW"}},[_vm._v("Swahili")]),_vm._v(" "),_c("option",{attrs:{value:"SZ"}},[_vm._v("Swaziland")]),_vm._v(" "),_c("option",{attrs:{value:"SE"}},[_vm._v("Sweden")]),_vm._v(" "),_c("option",{attrs:{value:"CH"}},[_vm._v("Switzerland")]),_vm._v(" "),_c("option",{attrs:{value:"SY"}},[_vm._v("Syrian Arab Republic")]),_vm._v(" "),_c("option",{attrs:{value:"TW"}},[_vm._v("Taiwan, Republic of China\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"TJ"}},[_vm._v("Tajikistan")]),_vm._v(" "),_c("option",{attrs:{value:"TZ"}},[_vm._v("Tanzania, United Republic of\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"TH"}},[_vm._v("Thailand")]),_vm._v(" "),_c("option",{attrs:{value:"TL"}},[_vm._v("Timor-Leste")]),_vm._v(" "),_c("option",{attrs:{value:"TG"}},[_vm._v("Togo")]),_vm._v(" "),_c("option",{attrs:{value:"TK"}},[_vm._v("Tokelau")]),_vm._v(" "),_c("option",{attrs:{value:"TO"}},[_vm._v("Tonga")]),_vm._v(" "),_c("option",{attrs:{value:"TT"}},[_vm._v("Trinidad and Tobago")]),_vm._v(" "),_c("option",{attrs:{value:"TN"}},[_vm._v("Tunisia")]),_vm._v(" "),_c("option",{attrs:{value:"TR"}},[_vm._v("Turkey")]),_vm._v(" "),_c("option",{attrs:{value:"TM"}},[_vm._v("Turkmenistan")]),_vm._v(" "),_c("option",{attrs:{value:"TC"}},[_vm._v("Turks and Caicos Islands\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"TV"}},[_vm._v("Tuvalu")]),_vm._v(" "),_c("option",{attrs:{value:"UG"}},[_vm._v("Uganda")]),_vm._v(" "),_c("option",{attrs:{value:"UA"}},[_vm._v("Ukraine")]),_vm._v(" "),_c("option",{attrs:{value:"AE"}},[_vm._v("United Arab Emirates")]),_vm._v(" "),_c("option",{attrs:{value:"GB"}},[_vm._v("United Kingdom")]),_vm._v(" "),_c("option",{attrs:{value:"US"}},[_vm._v("United States")]),_vm._v(" "),_c("option",{attrs:{value:"UM"}},[_vm._v("United States Minor Outlying\n                                                                        Islands")]),_vm._v(" "),_c("option",{attrs:{value:"UY"}},[_vm._v("Uruguay")]),_vm._v(" "),_c("option",{attrs:{value:"UZ"}},[_vm._v("Uzbekistan")]),_vm._v(" "),_c("option",{attrs:{value:"VU"}},[_vm._v("Vanuatu")]),_vm._v(" "),_c("option",{attrs:{value:"VE"}},[_vm._v("Venezuela")]),_vm._v(" "),_c("option",{attrs:{value:"VN"}},[_vm._v("Viet Nam")]),_vm._v(" "),_c("option",{attrs:{value:"VG"}},[_vm._v("Virgin Islands, British\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"VI"}},[_vm._v("Virgin Islands, U.S.")]),_vm._v(" "),_c("option",{attrs:{value:"WF"}},[_vm._v("Wallis and Futuna")]),_vm._v(" "),_c("option",{attrs:{value:"EH"}},[_vm._v("Western Sahara")]),_vm._v(" "),_c("option",{attrs:{value:"YE"}},[_vm._v("Yemen")]),_vm._v(" "),_c("option",{attrs:{value:"ZM"}},[_vm._v("Zambia")]),_vm._v(" "),_c("option",{attrs:{value:"ZW"}},[_vm._v("Zimbabwe")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"country_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("info_identifier")},model:{value:_vm.oci_info.info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"info_identifier",$$v);},expression:"oci_info.info_identifier"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a code")]),_vm._v(" "),_c("option",{attrs:{value:"ABI"}},[_vm._v("ABI - AWB Amount Detail\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ABS"}},[_vm._v("ABS - AWB Supplementary\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ABT"}},[_vm._v("ABT - AWB Total Amount\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ACC"}},[_vm._v("ACC - Accounting Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ACD"}},[_vm._v("ACD - AWB Consignment\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"ACK"}},[_vm._v("ACK - Reason for\n                                                                        Acknowledgement")]),_vm._v(" "),_c("option",{attrs:{value:"ACS"}},[_vm._v("ACS - AWB Charge Summary\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ADR"}},[_vm._v("ADR - Street Address\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AGT"}},[_vm._v("AGT - Agent")]),_vm._v(" "),_c("option",{attrs:{value:"AID"}},[_vm._v("AID - Arrival Information\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"AIR"}},[_vm._v("AIR - Airline Header\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ALA"}},[_vm._v("ALA - Allotment Availability\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ALI"}},[_vm._v("ALI - Allotment Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ALR"}},[_vm._v("ALR - Allotment Remaining\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ALT"}},[_vm._v("ALT - Allotment Total\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AMD"}},[_vm._v("AMD - Amendment\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"API"}},[_vm._v("API - Air Waybill Piece\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ARD"}},[_vm._v("ARD - Agent Reference Data\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ARI"}},[_vm._v("ARI - AWB Recapitulation\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ATH"}},[_vm._v("ATH - Authorisation")]),_vm._v(" "),_c("option",{attrs:{value:"ATW"}},[_vm._v("ATW - AWB Total Weight\n                                                                        Summary")]),_vm._v(" "),_c("option",{attrs:{value:"AUD"}},[_vm._v("AUD - Allotment Used Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"AVS"}},[_vm._v("AVS - Availability\n                                                                        Supplementary Details")]),_vm._v(" "),_c("option",{attrs:{value:"BGD"}},[_vm._v("BGD - Baggage Detail\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"BGT"}},[_vm._v("BGT - Baggage Tag\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"BRK"}},[_vm._v("BRK - Broker")]),_vm._v(" "),_c("option",{attrs:{value:"CAI"}},[_vm._v("CAI - CCA/Adjustment\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"CAN"}},[_vm._v("CAN - Customs Action\n                                                                        Notification")]),_vm._v(" "),_c("option",{attrs:{value:"CAS"}},[_vm._v("CAS - CCA/Adjustment\n                                                                        Supplementary Information")]),_vm._v(" "),_c("option",{attrs:{value:"CBD"}},[_vm._v("CBD - CASS Billing Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CBI"}},[_vm._v("CBI - CASS Billing\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"CBP"}},[_vm._v("CBP - CASS Billing Period\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CBR"}},[_vm._v("CBR - Courier Baggage\n                                                                        Receiver")]),_vm._v(" "),_c("option",{attrs:{value:"CBS"}},[_vm._v("CBS - Courier Baggage Sender\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CBV"}},[_vm._v("CBV - Courier Baggage\n                                                                        Voucher Identification")]),_vm._v(" "),_c("option",{attrs:{value:"CCD"}},[_vm._v("CCD - Consignment Control\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"CCL"}},[_vm._v("CCL - Cargo Control Location\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CDC"}},[_vm._v("CDC - CC Charges in\n                                                                        Destination Currency")]),_vm._v(" "),_c("option",{attrs:{value:"CDI"}},[_vm._v("CDI - Charge Declarations\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CER"}},[_vm._v("CER - AWB Content\n                                                                        Certification")]),_vm._v(" "),_c("option",{attrs:{value:"CID"}},[_vm._v("CID - Correction\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"CIH"}},[_vm._v("CIH - CASS Invoice Header\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"CIN"}},[_vm._v("CIN - CASS Identification\n                                                                        Number")]),_vm._v(" "),_c("option",{attrs:{value:"CMI"}},[_vm._v("CMI - Consignment Onward\n                                                                        Movement Information")]),_vm._v(" "),_c("option",{attrs:{value:"CND"}},[_vm._v("CND - Customs Notification\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"CNE"}},[_vm._v("CNE - Consignee")]),_vm._v(" "),_c("option",{attrs:{value:"COI"}},[_vm._v("COI - Commission Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"COL"}},[_vm._v("COL - Collect Charge Summary\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"COM"}},[_vm._v("COM - Embargoed Commodities\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"COR"}},[_vm._v("COR - Customs Origin\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("CRD - Carrier Reference Data\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CRR"}},[_vm._v("CRR - Embargo Carriage\n                                                                        Restrictions")]),_vm._v(" "),_c("option",{attrs:{value:"CTI"}},[_vm._v("CTI - CCA/Adjustment Total\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"CTW"}},[_vm._v("CTW - CCA/Adjustment Total\n                                                                        Weight Summary")]),_vm._v(" "),_c("option",{attrs:{value:"CUR"}},[_vm._v("CUR - Currency Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CUS"}},[_vm._v("CUS - Customer\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"CVD"}},[_vm._v("CVD - Charge Declarations\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CWI"}},[_vm._v("CWI - CASS AWB Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DAI"}},[_vm._v("DAI - DGD Additional\n                                                                        Handling Information")]),_vm._v(" "),_c("option",{attrs:{value:"DAP"}},[_vm._v("DAP - DGD “All Packed in\n                                                                        One” Indication")]),_vm._v(" "),_c("option",{attrs:{value:"DAT"}},[_vm._v("DAT - DGD “All Packed in\n                                                                        One” Total")]),_vm._v(" "),_c("option",{attrs:{value:"DAU"}},[_vm._v("DAU - DGD Item Authorisation\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DCI"}},[_vm._v("DCI - DGD Emergency Contact\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"DCL"}},[_vm._v("DCL - Declarant")]),_vm._v(" "),_c("option",{attrs:{value:"DES"}},[_vm._v("DES - Despatch Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DHD"}},[_vm._v("DHD - DGD Header Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DII"}},[_vm._v("DII - DGD Item Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DIM"}},[_vm._v("DIM - Dimensions Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DNR"}},[_vm._v("DNR - DGD Item Number\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DOC"}},[_vm._v("DOC - Documentation\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"DOS"}},[_vm._v("DOS - DGD Overpack Summary\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DPI"}},[_vm._v("DPI - DGD Item Packing Group\n                                                                        and Instructions")]),_vm._v(" "),_c("option",{attrs:{value:"DQP"}},[_vm._v("DQP - DGD Item Quantity and\n                                                                        Type of Packing")]),_vm._v(" "),_c("option",{attrs:{value:"DRA"}},[_vm._v("DRA - DGD Radioactive\n                                                                        Activity Information")]),_vm._v(" "),_c("option",{attrs:{value:"DRC"}},[_vm._v("DRC - DGD Radioactive\n                                                                        Consignment Information")]),_vm._v(" "),_c("option",{attrs:{value:"DRP"}},[_vm._v("DRP - DGD Radioactive\n                                                                        Packing Instructions")]),_vm._v(" "),_c("option",{attrs:{value:"DSN"}},[_vm._v("DSN - DGD Item Shipping Name\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DSU"}},[_vm._v("DSU - DGD Signatory Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"DTN"}},[_vm._v("DTN - Date/Time of\n                                                                        Notification")]),_vm._v(" "),_c("option",{attrs:{value:"EIC"}},[_vm._v("EIC - Empty Equipment in\n                                                                        Compartment Information")]),_vm._v(" "),_c("option",{attrs:{value:"EXP"}},[_vm._v("EXP - Export")]),_vm._v(" "),_c("option",{attrs:{value:"FLT"}},[_vm._v("FLT - Flight Booking\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"FLT"}},[_vm._v("FLT - Flight Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"GRI"}},[_vm._v("GRI - Grand AWB\n                                                                        Recapitulation Information")]),_vm._v(" "),_c("option",{attrs:{value:"GTI"}},[_vm._v("GTI - Grand Total\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"HAH"}},[_vm._v("HAH - HWB Agent’s Head\n                                                                        Office")]),_vm._v(" "),_c("option",{attrs:{value:"HBS"}},[_vm._v("HBS - House Waybill Summary\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"HCD"}},[_vm._v("HCD - HWB Consignment\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"HDL"}},[_vm._v("HDL - Handling Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"HLC"}},[_vm._v("HLC - HWB Letter of Credit\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"HPI"}},[_vm._v("HPI - House Waybill Piece\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"HTS"}},[_vm._v("HTS - Harmonised Tariff\n                                                                        Schedule Information")]),_vm._v(" "),_c("option",{attrs:{value:"HWB"}},[_vm._v("HWB - House Waybill")]),_vm._v(" "),_c("option",{attrs:{value:"IMP"}},[_vm._v("IMP - Import")]),_vm._v(" "),_c("option",{attrs:{value:"ISS"}},[_vm._v("ISS - The Regulated Agent\n                                                                        Issuing the Security Status for a\n                                                                        Consignment")]),_vm._v(" "),_c("option",{attrs:{value:"ISU"}},[_vm._v("ISU - AWB Issue Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"ITA"}},[_vm._v("ITA - Invoice Total Amount\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ITW"}},[_vm._v("ITW - Invoice Total Weight\n                                                                        Summary")]),_vm._v(" "),_c("option",{attrs:{value:"JST"}},[_vm._v("JST - Embargo Justification\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"LOC"}},[_vm._v("LOC - Location")]),_vm._v(" "),_c("option",{attrs:{value:"MAL"}},[_vm._v("MAL - Mail")]),_vm._v(" "),_c("option",{attrs:{value:"MAT"}},[_vm._v("MAT - Message Advice Type\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"MBI"}},[_vm._v("MBI - Master Waybill\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"MCH"}},[_vm._v("MCH - Mail Consignment\n                                                                        Header")]),_vm._v(" "),_c("option",{attrs:{value:"MCT"}},[_vm._v("MCT - Mail Consignment Total\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"MHU"}},[_vm._v("MHU - Mail Handling Unit\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"MID"}},[_vm._v("MID - Mail Inbound Data\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"MLI"}},[_vm._v("MLI - Mail Label\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"MOD"}},[_vm._v("MOD - Mail Outbound Data\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"MPI"}},[_vm._v("MPI - Movement Priority\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"MSD"}},[_vm._v("MSD - Mail Status Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"MSU"}},[_vm._v("MSU - Message Sequence and\n                                                                        ULD Origin")]),_vm._v(" "),_c("option",{attrs:{value:"MUD"}},[_vm._v("MUD - Mail ULD Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"NAM"}},[_vm._v("NAM - Name")]),_vm._v(" "),_c("option",{attrs:{value:"NBI"}},[_vm._v("NBI - Net Billing\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"NEW"}},[_vm._v("NEW - New Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"NFY"}},[_vm._v("NFY - Also Notify")]),_vm._v(" "),_c("option",{attrs:{value:"NFY"}},[_vm._v("NFY - Notify Name and\n                                                                        Address")]),_vm._v(" "),_c("option",{attrs:{value:"NNS"}},[_vm._v("NNS - Net/Net Sales")]),_vm._v(" "),_c("option",{attrs:{value:"NOM"}},[_vm._v("NOM - Nominated Handling\n                                                                        Party")]),_vm._v(" "),_c("option",{attrs:{value:"OCI"}},[_vm._v("OCI - Other Customs,\n                                                                        Security and Regulatory Control Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"OLD"}},[_vm._v("OLD - Original Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"OPI"}},[_vm._v("OPI - Other Participant\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"OSI"}},[_vm._v("OSI - Other Service\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"OSS"}},[_vm._v("OSS - The Regulated Agent\n                                                                        Accepting the Security Status for a\n                                                                        Consignment Issued by Another RA")]),_vm._v(" "),_c("option",{attrs:{value:"OTH"}},[_vm._v("OTH - Other Charges")]),_vm._v(" "),_c("option",{attrs:{value:"PAS"}},[_vm._v("PAS - Passenger Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"PID"}},[_vm._v("PID - Product Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"PPD"}},[_vm._v("PPD - Prepaid Charge Summary\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"PRD"}},[_vm._v("PRD - Planning Request\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"RCI"}},[_vm._v("RCI - Recapitulation Amount\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"REC"}},[_vm._v("REC - Receptacle Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"REF"}},[_vm._v("REF - References")]),_vm._v(" "),_c("option",{attrs:{value:"RID"}},[_vm._v("RID - Rate Information\n                                                                        Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"RIH"}},[_vm._v("RIH - Rate Information\n                                                                        Answer Header")]),_vm._v(" "),_c("option",{attrs:{value:"RIR"}},[_vm._v("RIR - Rate Information\n                                                                        Request Details")]),_vm._v(" "),_c("option",{attrs:{value:"RQD"}},[_vm._v("RQD - Charge Calculation\n                                                                        Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"RQH"}},[_vm._v("RQH - Charge Calculation\n                                                                        Request Header")]),_vm._v(" "),_c("option",{attrs:{value:"RQT"}},[_vm._v("RQT - Charge Calculation\n                                                                        Answer Totals")]),_vm._v(" "),_c("option",{attrs:{value:"RQU"}},[_vm._v("RQU - Charge Calculation\n                                                                        Request — ULD")]),_vm._v(" "),_c("option",{attrs:{value:"RQV"}},[_vm._v("RQV - Charge Calculation\n                                                                        Request — Volume")]),_vm._v(" "),_c("option",{attrs:{value:"RTD"}},[_vm._v("RTD - Rate Description\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"RTG"}},[_vm._v("RTG - Routing")]),_vm._v(" "),_c("option",{attrs:{value:"RTI"}},[_vm._v("RTI - Recapitulation Total\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"RTS"}},[_vm._v("RTS - Embargo Routes/Areas\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SAA"}},[_vm._v("SAA - Schedule and\n                                                                        Availability Information Answer Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SAR"}},[_vm._v("SAR - Schedule and\n                                                                        Availability Information Request Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SCI"}},[_vm._v("SCI - Special Customs\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SCS"}},[_vm._v("SCS - Surface Charge Summary\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SDI"}},[_vm._v("SDI - Surface Delivery\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SHP"}},[_vm._v("SHP - Shipper")]),_vm._v(" "),_c("option",{attrs:{value:"SII"}},[_vm._v("SII - Sales Incentive\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SKH"}},[_vm._v("SKH - Schedule Information\n                                                                        Answer Header")]),_vm._v(" "),_c("option",{attrs:{value:"SLC"}},[_vm._v("SLC - Status List Criteria\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SPH"}},[_vm._v("SPH - Special Handling\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"SPI"}},[_vm._v("SPI - Surface Pickup\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SRA"}},[_vm._v("SRA - Supplementary Rate\n                                                                        Information Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"SRI"}},[_vm._v("SRI - Shipment Reference\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SRR"}},[_vm._v("SRR - Supplementary Rate\n                                                                        Information Request Details")]),_vm._v(" "),_c("option",{attrs:{value:"SSI"}},[_vm._v("SSI - Supplementary Status\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SSR"}},[_vm._v("SSR - Special Service\n                                                                        Request")]),_vm._v(" "),_c("option",{attrs:{value:"STI"}},[_vm._v("STI - Storage Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"STS"}},[_vm._v("STS - Status Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SVA"}},[_vm._v("SVA - Surface Vehicle\n                                                                        Arrival Information")]),_vm._v(" "),_c("option",{attrs:{value:"SVD"}},[_vm._v("SVD - Surface Vehicle\n                                                                        Departure Information")]),_vm._v(" "),_c("option",{attrs:{value:"SVL"}},[_vm._v("SVL - Surface Vehicle Delay\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"SVN"}},[_vm._v("SVN - Surface Vehicle Next\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"TAR"}},[_vm._v("TAR - Total AWB\n                                                                        Recapitulation Information")]),_vm._v(" "),_c("option",{attrs:{value:"TCC"}},[_vm._v("TCC - Total Collect Charges\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"TID"}},[_vm._v("TID - Terminal\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"TOT"}},[_vm._v("TOT - Total Amount")]),_vm._v(" "),_c("option",{attrs:{value:"TRA"}},[_vm._v("TRA - Transit")]),_vm._v(" "),_c("option",{attrs:{value:"TRN"}},[_vm._v("TRN - Transfer/Transit\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"TXS"}},[_vm._v("TXS - Tax Summary")]),_vm._v(" "),_c("option",{attrs:{value:"TXT"}},[_vm._v("TXT - Free Text Description\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"UCI"}},[_vm._v("UCI - ULD Connection\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"UDI"}},[_vm._v("UDI - ULD Destination\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"UII"}},[_vm._v("UII - ULD Inclusion\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"ULD"}},[_vm._v("ULD - ULD Description\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"UMI"}},[_vm._v("UMI - ULD Movement\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"UPI"}},[_vm._v("UPI - Unique Piece\n                                                                        Information")]),_vm._v(" "),_c("option",{attrs:{value:"VCD"}},[_vm._v("VCD - Void/Cancel Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"VOD"}},[_vm._v("VOD - Vehicle Operator\n                                                                        Details")]),_vm._v(" "),_c("option",{attrs:{value:"WBD"}},[_vm._v("WBD - Waybill Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"WBH"}},[_vm._v("WBH - Waybill Header Details\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"WBI"}},[_vm._v("WBI - Waybill Information\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"WBL"}},[_vm._v("WBL - Waybill Details\n                                                                    ")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"info_identifier"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("custom_info_identifier")},model:{value:_vm.oci_info.custom_info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"custom_info_identifier",$$v);},expression:"oci_info.custom_info_identifier"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Automated Broker Interface\n                                                                        (ABI) Filer Code")]),_vm._v(" "),_c("option",{attrs:{value:"AC"}},[_vm._v("AC - Account Consignor\n                                                                        (consignor for all cargo aircraft)")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Certificate Number\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("CP - Contact Person")]),_vm._v(" "),_c("option",{attrs:{value:"CT"}},[_vm._v("CT- Contact Telephone Number\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Dangerous Goods")]),_vm._v(" "),_c("option",{attrs:{value:"DI"}},[_vm._v("DI - Declaration\n                                                                        Identification")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Authorised Economic\n                                                                        Operator")]),_vm._v(" "),_c("option",{attrs:{value:"ED"}},[_vm._v("ED - Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Facilities Information and\n                                                                        Resource Management")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Item Number")]),_vm._v(" "),_c("option",{attrs:{value:"KC"}},[_vm._v("KC - Known Consignor")]),_vm._v(" "),_c("option",{attrs:{value:"L"}},[_vm._v("L - Exemption Legend")]),_vm._v(" "),_c("option",{attrs:{value:"LI"}},[_vm._v("LI - License Identification\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("M - Movement Reference Number\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("N - Seal Number")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Packing List Number\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"RA"}},[_vm._v("RA - Regulated Agent")]),_vm._v(" "),_c("option",{attrs:{value:"RC"}},[_vm._v("RC - Regulated Carrier\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - System Downtime Reference\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SD"}},[_vm._v("SD - Security Status Date\n                                                                        & Time")]),_vm._v(" "),_c("option",{attrs:{value:"SM"}},[_vm._v("SM - Screening Method\n                                                                    ")]),_vm._v(" "),_c("option",{attrs:{value:"SN"}},[_vm._v("SN - Security Status Name of\n                                                                        Issuer")]),_vm._v(" "),_c("option",{attrs:{value:"SS"}},[_vm._v("SS - Security Status")]),_vm._v(" "),_c("option",{attrs:{value:"ST"}},[_vm._v("ST - Security Textual\n                                                                        Statement")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Trader Identification\n                                                                        Number")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v("U - Unique Consignment\n                                                                        Reference Number")]),_vm._v(" "),_c("option",{attrs:{value:"V"}},[_vm._v("V - Invoice Number")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"custom_info_identifier"}})],1)],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell px-5"},[_vm._v("Supplementary Information:\n                                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell px-4"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.oci_info.supplementary_info,expression:"oci_info.supplementary_info"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_info")},staticStyle:{width:"330px"},attrs:{type:"text"},domProps:{value:_vm.oci_info.supplementary_info},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.oci_info,"supplementary_info",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_info"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"}),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"bg-secondary form-control-sm px-5",on:{click:_vm.addOtherCustomInfo}},[_vm._v("\n                                                                    "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                ")])],1)],1)])])]),_vm._v(" "),_c("div",{staticClass:"mt-5 mb-5 pt-1 pb-1 px-4"},[_c("table",{staticClass:"table table-sm",staticStyle:{width:"100%"}},[_c("tbody",[_c("tr",[_c("th",{staticClass:"h_background_color",staticStyle:{width:"100%","max-width":"100%"}},[_vm._v("Other Customs\n                                                                Information")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th"),_vm._v(" "),_c("th"),_vm._v(" "),_c("th"),_vm._v(" "),_c("th")]),_vm._v(" "),_vm._l(_vm.form.oci_entries,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.country_code)+"\n                                                            ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.info_identifier)+"\n                                                            ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.custom_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.supplementary_info))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editOciInfo(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteOciInfo(index);}}})],1)]);})],2)])])])]),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Other Customs Information Segment"}},[_c("div",{staticClass:"h_background_color mt-5 mb-5 pt-1 pb-1 px-4"},[_c("h5",{},[_vm._v("Other Customs Information Segment")])]),_vm._v(" "),_c("div",{staticClass:"py-7 px-3 d-flex align-items-end"},[_c("b-form-textarea",{staticStyle:{width:"70% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"}}),_vm._v(" "),_c("b-button",{staticClass:"ml-2"},[_vm._v("Upload")])],1)])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{staticClass:"text-right",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-horizontal",label:"Email PDF copy To:"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"320px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"text-left ml-4",attrs:{size:"sm"}},[_vm._v("Including Cargo\n                                    Label")]),_vm._v(" "),_c("p",[_vm._v("(separate addresses with a semicolon ';')")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("div",{staticClass:"d-flex justify-content-end"},[_c("b-button",{staticClass:"mr-2",on:{click:_vm.getAgent}},[_vm._v("Generate PDF")]),_vm._v(" "),_c("b-button",{staticClass:"mr-2",on:{click:function click($event){return _vm.converXml(_vm.form.first_box.awb_no);}}},[_vm._v("Send")]),_vm._v(" "),_c("b-button",{staticClass:"mr-2"},[_vm._v("Send & Clear")]),_vm._v(" "),_c("b-button",{attrs:{type:"submit"}},[_vm._v("Save Draft")])],1)])],1)])]],2)],2);};var staticRenderFns=[function(){var _vm=this,_c=_vm._self._c;return _c("div",{staticClass:"container h_background_color text-white pt-2 pb-2"},[_c("h4",[_vm._v(" Create Master Air Waybill(e-AWB)\n                "),_c("span",{staticClass:"float-right"},[_vm._v("New")])])]);}];render._withStripped=true;

/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\nheader[data-v-18ebb6e4] {\n    width: 100%;\n    background-color: #2637a8;\n}\n.h-color[data-v-18ebb6e4] {\n    color: #2637a8;\n}\n.h_background_color[data-v-18ebb6e4] {\n    background-color: #2637a8;\n    color: white;\n}\n#nav[data-v-18ebb6e4] {\n    display: flex;\n    /* align-items: center;\n    justify-content: center; */\n    width: 100%;\n    max-width: 1280px;\n    /* margin: 0 auto; */\n}\n#nav > ul[data-v-18ebb6e4] {\n    display: flex;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n#nav > ul > li[data-v-18ebb6e4]:hover {\n    background-color: gray;\n}\n#nav > ul > li > span[data-v-18ebb6e4]:after {\n    display: inline-block;\n}\n#nav > ul > li > a[data-v-18ebb6e4] {\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n}\n#nav > ul > li > span[data-v-18ebb6e4] {\n    position: relative;\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n    cursor: pointer;\n}\nli[data-v-18ebb6e4] {\n    border-right: 1px solid white;\n}\n#nav > ul > li > span[data-v-18ebb6e4]:after {\n    /* content: '▼'; */\n    display: inline-block;\n}\n.dropdown[data-v-18ebb6e4] {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    display: none;\n    padding: 0;\n    list-style-type: none;\n    background-color: gray;\n}\n.dropdown li[data-v-18ebb6e4] {\n    /* width: 250px; */\n    width: 150px;\n    border-bottom: 1px solid #fff;\n}\n.dropdown li a[data-v-18ebb6e4] {\n    display: block;\n    /* padding: 10px; */\n    padding-left: 5px;\n    color: #fff;\n    text-decoration: none;\n}\n.isOpen[data-v-18ebb6e4] {\n    display: block;\n}\n.custom-btn[data-v-18ebb6e4] {\n    transition: background-color 0.3s;\n}\n\n/* #show-btn:hover {\n  background-color: #007bff;\n} */\n.custom-btn[data-v-18ebb6e4]:hover {\n    background-color: #007bff !important;\n    color: white !important;\n}\n.form-group[data-v-18ebb6e4] {\n    margin-bottom: 10px !important;\n}\n.form-control-sm[data-v-18ebb6e4] {\n    height: calc(1.5em + 0.5rem + 2px) !important;\n}\n.col-form-label[data-v-18ebb6e4] {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n    margin-bottom: 0 !important;\n    font-size: inherit !important;\n    line-height: 1.5 !important;\n}\n.background-color[data-v-18ebb6e4] {\n    background-color: grey;\n}\n.hr[data-v-18ebb6e4] {\n    border-top: 2px solid #007db9;\n}\n.aselect[data-v-18ebb6e4] {\n    position: relative;\n    width: 200px;\n    /* Adjust the width as needed */\n}\n.selector.box[data-v-18ebb6e4] {\n    position: relative;\n}\n.custom-select[data-v-18ebb6e4] {\n    appearance: none;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"26\" height=\"26\" viewBox=\"0 0 24 24\"><path fill=\"black\" d=\"M7 10l5 5 5-5z\"/></svg>')\n        no-repeat right 10px center;\n    background-color: white;\n    border: 1px solid #ccc;\n    /* padding: 10px 40px 10px 10px; */\n    font-size: 14px;\n    padding: 2px;\n    cursor: pointer;\n    width: 100%;\n}\n.custom-select[data-v-18ebb6e4]:focus {\n    outline: none;\n    border-color: #5cb3fd;\n}\n.nav-tabs .nav-links[data-v-18ebb6e4] {\n    border: 2px solid black;\n}\n.mh-100vh[data-v-18ebb6e4] {\n    /* min-height: 100vh; */\n}\n.table[data-v-18ebb6e4] {\n    max-width: 400px;\n    border: 0;\n}\ntd.editable-cell1[data-v-18ebb6e4] {\n    border: 1 solid gray !important;\n}\ntd.editable-cell[data-v-18ebb6e4] {\n    border: 0 !important;\n}\nth[data-v-18ebb6e4] {\n    border: 0 !important;\n}\n.form-control[data-v-18ebb6e4] {\n    border: 1px solid gray;\n    width: 150px;\n    height: 25px;\n}\n.form-control1[data-v-18ebb6e4] {\n    border: 2px solid gray;\n    width: 150px;\n    height: 25px;\n}\n.custom-link[data-v-18ebb6e4] {\n    display: block;\n    margin-bottom: 0.5rem;\n    color: red;\n    text-decoration: none;\n}\n.custom-link[data-v-18ebb6e4]:hover {\n    color: #2637a8;\n    -webkit-text-decoration: underline #2637a8 !important;\n            text-decoration: underline #2637a8 !important;\n    text-decoration-color: #2637a8;\n}\n.column_b[data-v-18ebb6e4] {\n    border: 1px solid #b1b1b1;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\nheader[data-v-18ebb6e4] {\n    width: 100%;\n    background-color: #2637a8;\n}\n.h-color[data-v-18ebb6e4] {\n    color: #2637a8;\n}\n.h_background_color[data-v-18ebb6e4] {\n    background-color: #2637a8;\n    color: white;\n}\n#nav[data-v-18ebb6e4] {\n    display: flex;\n    /* align-items: center;\n    justify-content: center; */\n    width: 100%;\n    max-width: 1280px;\n    /* margin: 0 auto; */\n}\n#nav>ul[data-v-18ebb6e4] {\n    display: flex;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n#nav>ul>li[data-v-18ebb6e4]:hover {\n    background-color: gray;\n}\n#nav>ul>li>span[data-v-18ebb6e4]:after {\n    display: inline-block;\n}\n#nav>ul>li>a[data-v-18ebb6e4] {\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n}\n#nav>ul>li>span[data-v-18ebb6e4] {\n    position: relative;\n    display: block;\n    height: auto;\n    padding: 3px;\n    color: #fff;\n    text-decoration: none;\n    cursor: pointer;\n}\nli[data-v-18ebb6e4] {\n    border-right: 1px solid white;\n}\n#nav>ul>li>span[data-v-18ebb6e4]:after {\n    /* content: '▼'; */\n    display: inline-block;\n}\n.dropdown[data-v-18ebb6e4] {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    display: none;\n    padding: 0;\n    list-style-type: none;\n    background-color: gray;\n}\n.dropdown li[data-v-18ebb6e4] {\n    /* width: 250px; */\n    width: 150px;\n    border-bottom: 1px solid #fff;\n}\n.dropdown li a[data-v-18ebb6e4] {\n    display: block;\n    /* padding: 10px; */\n    padding-left: 5px;\n    color: #fff;\n    text-decoration: none;\n}\n.isOpen[data-v-18ebb6e4] {\n    display: block;\n}\n.custom-btn[data-v-18ebb6e4] {\n    transition: background-color 0.3s;\n}\n\n/* #show-btn:hover {\n  background-color: #007bff;\n} */\n.custom-btn[data-v-18ebb6e4]:hover {\n    background-color: #007bff !important;\n    color: white !important;\n}\n.form-group[data-v-18ebb6e4] {\n    margin-bottom: 10px !important;\n}\n.form-control-sm[data-v-18ebb6e4] {\n    height: calc(1.5em + 0.5rem + 2px) !important;\n}\n.col-form-label[data-v-18ebb6e4] {\n    padding-top: 0 !important;\n    padding-bottom: 0 !important;\n    margin-bottom: 0 !important;\n    font-size: inherit !important;\n    line-height: 1.5 !important;\n}\n.background-color[data-v-18ebb6e4] {\n    background-color: grey;\n}\n.hr[data-v-18ebb6e4] {\n    border-top: 2px solid #007db9;\n}\n.aselect[data-v-18ebb6e4] {\n    position: relative;\n    width: 200px;\n    /* Adjust the width as needed */\n}\n.selector.box[data-v-18ebb6e4] {\n    position: relative;\n}\n.custom-select[data-v-18ebb6e4] {\n    appearance: none;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"26\" height=\"26\" viewBox=\"0 0 24 24\"><path fill=\"black\" d=\"M7 10l5 5 5-5z\"/></svg>') no-repeat right 10px center;\n    background-color: white;\n    border: 1px solid #ccc;\n    /* padding: 10px 40px 10px 10px; */\n    font-size: 14px;\n    padding: 2px;\n    cursor: pointer;\n    width: 100%;\n}\n.custom-select[data-v-18ebb6e4]:focus {\n    outline: none;\n    border-color: #5cb3fd;\n}\n.nav-tabs .nav-links[data-v-18ebb6e4] {\n    border: 2px solid black;\n}\n.mh-100vh[data-v-18ebb6e4] {\n    /* min-height: 100vh; */\n}\n.table[data-v-18ebb6e4] {\n    max-width: 400px;\n    border: 0;\n}\ntd.editable-cell1[data-v-18ebb6e4] {\n    border: 1 solid gray !important;\n}\ntd.editable-cell[data-v-18ebb6e4] {\n    border: 0 !important;\n}\nth[data-v-18ebb6e4] {\n    border: 0 !important;\n}\n.form-control[data-v-18ebb6e4] {\n    border: 1px solid gray;\n    width: 150px;\n    height: 25px;\n}\n.form-control1[data-v-18ebb6e4] {\n    border: 2px solid gray;\n    width: 150px;\n    height: 25px;\n}\n.custom-link[data-v-18ebb6e4] {\n    display: block;\n    margin-bottom: 0.5rem;\n    color: red;\n    text-decoration: none;\n}\n.custom-link[data-v-18ebb6e4]:hover {\n    color: #2637a8;\n    -webkit-text-decoration: underline #2637a8 !important;\n            text-decoration: underline #2637a8 !important;\n    text-decoration-color: #2637a8;\n}\n.column_b[data-v-18ebb6e4] {\n    border: 1px solid #b1b1b1;\n}\n.custom-dropdown[data-v-18ebb6e4] {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  /* border: solid 1px silver; */\n  border-radius: 5px;\n}\n.dropdown-options[data-v-18ebb6e4] {\n  /* position: absolute; */\n  top: 100%;\n  left: 0;\n  width: 100%;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-top: none;\n  max-height: 200px;\n  overflow-y: auto;\n  z-index: 1;\n}\n.option[data-v-18ebb6e4] {\n  padding: 5px 10px;\n  cursor: pointer;\n}\n.option[data-v-18ebb6e4]:hover {\n  background-color: #f0f0f0;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_1_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_1_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_1_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/Test.vue":
/*!**********************************************!*\
  !*** ./resources/js/src/view/pages/Test.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Test.vue?vue&type=template&id=18ebb6e4&scoped=true */ "./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true");
/* harmony import */ var _Test_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Test.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Test.vue?vue&type=script&lang=js");
/* harmony import */ var _Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css */ "./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css");
/* harmony import */ var _Test_vue_vue_type_style_index_1_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css */ "./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _Test_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "18ebb6e4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/Test.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/Test.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/Test.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=template&id=18ebb6e4&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_1_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=1&id=18ebb6e4&scoped=true&lang=css");


/***/ })

}]);