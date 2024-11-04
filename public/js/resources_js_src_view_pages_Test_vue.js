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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      form: new Form({
        HAWB_no: '',
        awb_code: '',
        awb_no: '',
        consolidated_MAWB: false,
        awb: true,
        oci_country_code: '',
        oci_info_identifier: '',
        oci_custom_info_identifier: '',
        oci_supplementary_info: '',
        master_pcs: '',
        master_weight: '',
        ship_name: '',
        ship_account: '',
        ship_address: '',
        ship_city: '',
        ship_post_code: '',
        ship_state: '',
        ship_country: '',
        ship_phone: '',
        ship_fax: '',
        ship_telex: '',
        ship_new_address: '',
        ship_airport_code: null,
        cons_name: '',
        cons_account: '',
        cons_address: '',
        cons_city: '',
        cons_airport_code: null,
        cons_post_code: '',
        cons_state: '',
        cons_country: '',
        cons_phone: '',
        cons_fax: '',
        cons_telex: '',
        cons_new_address: '',
        departure_airport: '',
        destination_airport: '',
        from: '',
        to: '',
        by: '',
        flight: '',
        date: this.getCurrentDate(),
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
        weight_code: 'K',
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
        dimention_unit: 'MC',
        //cm3,m3,ft3

        uld_type: '',
        uld_serial: '',
        owner: '',
        total_valume: null,
        total_amount: 0,
        customs_origin_code: null,
        other_service_information: '',
        special_service_request: '',
        accounting_information: '',
        letter_credit: false,
        shipment_ref_no: null,
        supplementary_shipment_Info: '',
        iata_agent_code: null,
        iata_agent_cass: null,
        extra_print: null,
        agent_name: '',
        agent_address: '',
        agent_state: '',
        agent_pincode: '',
        issue_sign: '',
        issue_loc_code: '',
        issue_date: this.getCurrentDate(),
        agent_account: null,
        participate: '0',
        participate_airport: '',
        participate_identifier: '',
        participate_code: null,
        office_file_ref: null,
        office_airport: '',
        office_function_designator: '',
        office_company_designator: '',
        // other_charge_code: '',
        // other_code: null,
        // other_amount: null,
        // due_agent: '',
        // due_carrier: '',
        code: '',
        other_code: '',
        amount: '',
        due: "Carrier",
        payment_type: "Prepaid",
        charge: '',
        // prepaid: '',
        // collect: '',
        chargable_weight1: '',
        carr_namr: '',
        carr_prefix: '',
        carr_address: '',
        carr_city: '',
        carr_post_code: '',
        carr_state: '',
        carr_country: '',
        type_of_payment: '',
        currency: 'INR',
        carriage: 'NVD',
        insurance: 'XXX',
        customs: 'NCV',
        other_charges_due_carrier: '',
        other_charges_due_agent: '',
        taxes: '',
        weight_charge: '',
        total_charges: ''
      }),
      // newCharge: {
      //     code: '',
      //     other_code: '',
      //     amount: '',
      //     due: "Carrier",
      //     payment_type: "Prepaid",
      // },
      selectedCode: '',
      manualCode: '',
      tableCodes: [],
      uld_info: [],
      oci_entries: [],
      charges: [],
      entries: [],
      newHsCode: '',
      hsCodes: [],
      isOpen: false,
      showShipper: false,
      showConsignee: false,
      showCalculationTable: false,
      editIndex: null,
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
          url: "/test-view",
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
      itemss: [],
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
    onSubmit: function onSubmit() {
      this.form.post("create-housewaybill")
      //ApiService.post(`/create-webdoc`, this.form)
      .then(function (_ref) {
        var data = _ref.data;
        console.log('data', data);
      })["catch"](function (err) {});
    },
    handleRadioChange: function handleRadioChange() {
      // const radioCode = 'EAP';
      // if (!this.tableCodes.includes(radioCode)) {
      //     this.tableCodes.push(radioCode);
      // } else {
      //     alert('This code is already added.');
      // }
      var selectedCode = this.selectedCode;
      this.tableCodes = [];
      this.tableCodes.push(selectedCode);
    },
    addManualCode: function addManualCode() {
      var code = this.selectedCode || this.manualCode.trim();
      if (code) {
        if (!this.tableCodes.includes(code)) {
          this.tableCodes.push(code);
        } else {
          alert('This code is already added.');
        }
      } else {
        alert('Please select or enter a code.');
      }
      this.selectedCode = '';
      this.manualCode = '';
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
      var chargeRate = parseFloat(this.form.charge);
      var weight = parseFloat(this.form.chargable_weight1);
      if (!isNaN(weight) && this.form.charge > 0 && !isNaN(chargeRate) && chargeRate > 0) {
        var calculatedAmount = weight * chargeRate;
        this.form.amount = calculatedAmount.toFixed(2);
      } else {
        alert('Please enter valid numeric values for chargeable weight and charge rate.');
      }
    },
    addCharge: function addCharge() {
      if (this.form.code || this.form.other_code && this.form.amount) {
        // this.charges.push({
        //     ...this.newCharge,
        //     // amount: this.form.charge,
        //     // amount:""
        // });
        if (this.editIndex !== null) {
          this.charges[this.editIndex] = _objectSpread(_objectSpread({}, this.form), {}, {
            amount: this.form.amount
          });
          this.editIndex = null;
        } else {
          // Add new charge
          this.charges.push(_objectSpread(_objectSpread({}, this.form), {}, {
            amount: this.form.amount
          }));
        }

        // this.form = {
        //     code: "",
        //     other_code: "",
        //     amount: "",
        //     due: "",
        //     payment_type: "",
        // };
        // this.form.chargable_weight1 = '',
        // this.form.charge = ''
      } else {
        alert("Please select a code or enter other code.");
      }
    },
    editCharge: function editCharge(index) {
      this.form = _objectSpread({}, this.charges[index]);
      this.editIndex = index;
    },
    removeCharge: function removeCharge(index) {
      this.charges.splice(index, 1);
    },
    editEntry: function editEntry(index) {
      this.editIndex = index;
      this.form = _objectSpread({}, this.entries[index]);
      // this.displayModal();
      this.$refs.modalConsignment.show();
    },
    deleteEntry: function deleteEntry(index) {
      this.entries.splice(index, 1);
    },
    addOrUpdateEntry: function addOrUpdateEntry() {
      var entryData = _objectSpread(_objectSpread({}, this.form), {}, {
        total_valume: this.calculateTotalVolume(),
        total_amount: this.calculateTotalAmount()
      });
      // if (this.editIndex !== null) {
      //     this.$set(this.entries, this.editIndex, {...this.form});
      //     this.editIndex = null;
      // } else {
      //     this.entries.push({ ...this.form });
      // }
      if (this.editIndex !== null) {
        this.$set(this.entries, this.editIndex, entryData);
        this.editIndex = null;
      } else {
        this.entries.push(entryData);
      }
      this.closeModal();
    },
    calculateTotalVolume: function calculateTotalVolume() {
      var volumePerPiece = this.form.length * this.form.width * this.form.height / 1e6;
      return this.form.total_valume = volumePerPiece * (parseFloat(this.form.pcs) || 0);
    },
    calculateTotalAmount: function calculateTotalAmount() {
      var chargable_weight = parseFloat(this.form.chargable_weight) || 0;
      var rate = parseFloat(this.form.rate) || 0;
      return this.form.total_amount = chargable_weight * rate;
      // let chargable_weight = parseFloat(this.form.chargable_weight) || 0;
      // let rate = parseFloat(this.form.rate) || 0;
      // this.form.total_amount = chargable_weight * rate;
    },
    addHsCode: function addHsCode() {
      if (this.hsCodes.length >= 1) {
        alert('You have exceeded the maximum limit of HS codes.');
        return;
      }
      if (this.form.hs_code.trim() === '') {
        alert('HS Code cannot be empty.');
        return;
      }
      this.hsCodes.push(this.form.hs_code.trim());
    },
    removeHsCode: function removeHsCode(index) {
      this.form.hs_code = '';
      if (confirm('Are you sure you want to delete this HS Code?')) {
        this.hsCodes.splice(index, 1);
      }
    },
    displayModal: function displayModal() {
      this.$refs.modalConsignment.show();
    },
    closeModal: function closeModal() {
      this.$refs.modalConsignment.hide();
    },
    addUldInfo: function addUldInfo() {
      if (this.form.uld_type && this.form.uld_serial && this.form.owner) {
        this.uld_info.push({
          uld_type: this.form.uld_type,
          uld_serial: this.form.uld_serial,
          owner: this.form.owner
        });
        this.form.uld_type = "";
        this.form.uld_serial = "";
        this.form.owner = "";
      } else {
        alert("This field are empty");
      }
    },
    deleteUldInfo: function deleteUldInfo(index) {
      if (this.uld_info && this.uld_info.length > index) {
        this.uld_info.splice(index, 1);
      }
    },
    addPcsInfo: function addPcsInfo() {
      if (this.itemss.length >= 1) {
        alert("You have exceeded your limit");
        return;
      }
      this.itemss.push(_objectSpread({}, this.form));
      this.pcs = '';
      this.gross_weight = '';
      this.length = '';
      this.weight = '';
      this.height = '';
      this.unit = '';
    },
    deletePcs: function deletePcs(index) {
      if (this.itemss.length > index) {
        this.itemss.splice(index, 1);
      }
    },
    editOciInfo: function editOciInfo(index) {
      // Populate the form fields with the data from the selected row
      var entry = this.oci_entries[index];
      this.form.oci_country_code = entry.oci_country_code;
      this.form.oci_info_identifier = entry.oci_info_identifier;
      this.form.oci_custom_info_identifier = entry.oci_custom_info_identifier;
      this.form.oci_supplementary_info = entry.oci_supplementary_info;
      this.editingIndex = index; // Set the index of the entry being edited
    },
    addOtherCustomInfo: function addOtherCustomInfo() {
      var _this$form = this.form,
        oci_country_code = _this$form.oci_country_code,
        oci_info_identifier = _this$form.oci_info_identifier,
        oci_custom_info_identifier = _this$form.oci_custom_info_identifier,
        oci_supplementary_info = _this$form.oci_supplementary_info;
      if (oci_country_code && oci_info_identifier && oci_custom_info_identifier && oci_supplementary_info) {
        this.oci_entries.push({
          oci_country_code: oci_country_code,
          oci_info_identifier: oci_info_identifier,
          oci_custom_info_identifier: oci_custom_info_identifier,
          oci_supplementary_info: oci_supplementary_info
        });

        // Clear the form fields
        this.form.oci_country_code = '';
        this.form.oci_info_identifier = '';
        this.form.oci_custom_info_identifier = '';
        this.form.oci_supplementary_info = '';
      } else {
        alert('All fields must be filled out.');
      }
    },
    deleteOciInfo: function deleteOciInfo(index) {
      // this.oci_entries.splice(index, 1);
      if (this.oci_entries.length > index) {
        this.oci_entries.splice(index, 1);
      }
    }
  },
  watch: {
    'form.rate_class': function formRate_class() {
      this.form.total_amount = this.calculateTotalAmount();
    },
    'form.rate': function formRate() {
      this.form.total_amount = this.calculateTotalAmount();
    },
    'form.chargable_weight': function formChargable_weight() {
      this.form.total_amount = this.calculateTotalAmount();
    }
  },
  computed: {
    weightCharge: function weightCharge() {
      return parseFloat(this.form.total_amount || 0);
    },
    taxes: function taxes() {
      return 0.00;
    },
    totalDueAgentPrepaid: function totalDueAgentPrepaid() {
      return this.charges.filter(function (charge) {
        return charge.due === 'Agent' && charge.payment_type === 'Prepaid';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueAgentCollect: function totalDueAgentCollect() {
      return this.charges.filter(function (charge) {
        return charge.due === 'Agent' && charge.payment_type === 'Collect';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueCarrierPrepaid: function totalDueCarrierPrepaid() {
      return this.charges.filter(function (charge) {
        return charge.due === 'Carrier' && charge.payment_type === 'Prepaid';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueCarrierCollect: function totalDueCarrierCollect() {
      return this.charges.filter(function (charge) {
        return charge.due === 'Carrier' && charge.payment_type === 'Collect';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalChargesPrepaid: function totalChargesPrepaid() {
      return (parseFloat(this.totalDueAgentPrepaid) + parseFloat(this.totalDueCarrierPrepaid)).toFixed(2);
    },
    totalChargesCollect: function totalChargesCollect() {
      return (this.weightCharge + parseFloat(this.totalDueAgentCollect) + parseFloat(this.totalDueCarrierCollect)).toFixed(2);
    },
    totalChrage: function totalChrage() {
      return (this.weightCharge + parseFloat(this.totalDueAgentCollect) + parseFloat(this.totalDueCarrierCollect)).toFixed(2);
    } // totalDueAgent() {
    //     return this.charges
    //         .filter(charge => charge.due === 'Agent')
    //         .reduce((total, charge) => total + parseFloat(charge.amount || 0), 0)
    //         .toFixed(2);
    // },
    // totalDueCarrier() {
    //     return this.charges
    //         .filter(charge => charge.due === 'Carrier')
    //         .reduce((total, charge) => total + parseFloat(charge.amount || 0), 0)
    //         .toFixed(2);
    // },
    // totalCharges() {
    //     return (
    //         this.weightCharge +
    //         parseFloat(this.taxes) +
    //         parseFloat(this.totalDueAgent) +
    //         parseFloat(this.totalDueCarrier)
    //     ).toFixed(2);
    // }
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
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render=function render(){var _vm=this,_c=_vm._self._c;return _c("div",{staticClass:"bg-white",staticStyle:{height:"auto !important"}},[[_c("header",[_c("nav",{attrs:{id:"nav"}},[_c("ul",{staticStyle:{"z-index":"1098"}},_vm._l(_vm.items,function(item){return _c("li",[!item.children?_c("a",{attrs:{href:item.url}},[_vm._v("\n                            "+_vm._s(item.name)+"\n                        ")]):_c("span",{on:{mouseover:_vm.mouseover,mouseleave:_vm.mouseleave}},[_vm._v("\n                            "+_vm._s(item.name)+"\n\n                            "),_c("ul",{staticClass:"dropdown","class":{isOpen:_vm.isOpen}},_vm._l(item.children,function(child){return _c("li",[_c("a",{attrs:{href:child.url}},[_vm._v("\n                                        "+_vm._s(child.name)+"\n                                    ")])]);}),0)])]);}),0)])])],_vm._v(" "),[_c("div",{staticClass:"d-flex justify-content-center align-items-center mt-5 bg-white"},[_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-ss",modifiers:{"modal-ss":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"}},[_vm._v("Activity")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-prevent-closing",modifiers:{"modal-prevent-closing":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"toggle-btn"}},[_vm._v("Search")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-s",modifiers:{"modal-s":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"}},[_vm._v("10 Latest")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-templates",modifiers:{"modal-templates":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"toggle-btn"}},[_vm._v("Templates")]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-draft",modifiers:{"modal-draft":true}}],staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"}},[_vm._v("Draft")]),_vm._v(" "),_c("b-button",{staticClass:"mx-2 custom-btn",attrs:{id:"toggle-btn"},on:{click:_vm.toggleModal}},[_vm._v("Related")]),_vm._v(" "),_c("b-button",{staticClass:"mx-2 custom-btn",attrs:{id:"show-btn"},on:{click:_vm.showModal}},[_vm._v("Update Draft")]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-ss",title:"Activity","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("h3",[_vm._v("Updated:04:49")])])]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-draft",title:"Activity","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("none")]),_vm._v(" "),_c("h6",[_vm._v("( - )")])]),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Edit e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create House Waybill from e-AWB Data")]),_vm._v(" "),_c("h6",[_vm._v("By: jgeorgeblr@gln.com at: 13 Jul 15:03")])])],1)],1)]),_vm._v(" "),_c("b-modal",{ref:"modal",attrs:{id:"modal-prevent-closing",title:"Submit Your Name"},on:{ok:_vm.handleOk}},[_c("form",{ref:"form"},[_c("b-form-group",{attrs:{label:"Cereated By:","label-for":"name-input"},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref){var ariaDescribedby=_ref.ariaDescribedby;return[_c("b-form-radio-group",{attrs:{id:"radio-slots",options:_vm.options,"aria-describedby":ariaDescribedby,name:"radio-options-slots"}})];}}])}),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"4",label:"Id:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Destination:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Issued:","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Draft:","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"4","content-cols-sm":"","content-cols-lg":"2",label:"Not Issue:","label-for":"input-horizontal"}},[_c("b-form-checkbox",{attrs:{size:"sm"}})],1)],1)]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-s",title:"Latest Messages","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-form-group",{attrs:{"label-for":"name-input",label:"Created By:"},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref2){var ariaDescribedby=_ref2.ariaDescribedby;return[_c("b-form-radio-group",{attrs:{id:"radio-slots",options:_vm.options,"aria-describedby":ariaDescribedby,name:"radio-options-slots"}})];}}])}),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"mt-5"},[_c("b-col",[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Edit e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Copy e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create House Waybill from e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create Booking from e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Create Flight Status from e-AWB Data")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Edit label")])]),_vm._v(" "),_c("b-col",[_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("e-AWB Pdf file")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Multipage e-AWB Pdf")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Multipage e-AWB Pdf with back pages")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Without IATA template")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("1 Page generic e-AWB label")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("e-AWB label per item (50 pages)")]),_vm._v(" "),_c("a",{staticClass:"custom-link",attrs:{href:""}},[_vm._v("Cargo Pouch label as a PDF")])])],1),_vm._v(" "),_c("p",[_vm._v("Issued at: 15 Jun 14:24 By: jgeorgeblr@gln.com")])],1)]),_vm._v(" "),_c("b-modal",{attrs:{id:"modal-templates",title:"Templates","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-form-group",{scopedSlots:_vm._u([{key:"default",fn:function fn(_ref3){var ariaDescribedby=_ref3.ariaDescribedby;return[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("h6",[_vm._v("Created by:")])]),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-radio",{attrs:{"aria-describedby":ariaDescribedby,name:"some-radios",value:"A"}},[_vm._v("Me")])],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-radio",{attrs:{"aria-describedby":ariaDescribedby,name:"some-radios",value:"B"}},[_vm._v("Participant group")])],1)],1)];}}])}),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal"}},[_c("b-row",{attrs:{"align-v":"center"}},[_c("label",[_vm._v("Template")]),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"220px"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("\n                                        Please choose a Custom Origin\n                                    ")]),_vm._v(" "),_c("option",[_vm._v("A")]),_vm._v(" "),_c("option",[_vm._v("B")]),_vm._v(" "),_c("option",[_vm._v("C")])])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("h4",{staticClass:"h-color"},[_vm._v("Save")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-lg":"auto",label:"Name:","label-for":"input-horizontal"}},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-col",[_c("b-button",[_vm._v("+Save")])],1)],1)],1),_vm._v(" "),_c("h3",{staticClass:"h-color font-weight-bolder mt-lg-10"},[_vm._v("\n                        Modify your templates\n                    ")]),_vm._v(" "),_c("h5",{staticStyle:{"font-size":"smaller"}},[_vm._v("\n                        Showing all templates in participant group\n                    ")]),_vm._v(" "),_c("h5",{staticClass:"text-danger ml-5"},[_vm._v("No Templates found")]),_vm._v(" "),_c("hr",{staticClass:"hr mt-lg-12"}),_vm._v(" "),_c("h5",{staticStyle:{"font-size":"smaller"}},[_vm._v("\n                        The e-AWB can be saved as 'draft' and a list with\n                        draft e-AWB created during the day will be presented\n                        below. The last 10 e-AWB will be visible.\n                    ")])],1)])],1)],_vm._v(" "),_c("div",{staticClass:"container mt-lg-15 border-2 bg-light p-2",staticStyle:{"margin-bottom":"20px","border-bottom":"1px solid black"}},[_vm._m(0),_vm._v(" "),_c("form",{on:{submit:function submit($event){$event.preventDefault();return _vm.onSubmit.apply(null,arguments);}}},[_c("div",{staticClass:"container"},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"HAWB No:*","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("HAWB_no")},attrs:{id:"input-horizontal"},model:{value:_vm.form.HAWB_no,callback:function callback($$v){_vm.$set(_vm.form,"HAWB_no",$$v);},expression:"form.HAWB_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Master No:*","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.awb_code,callback:function callback($$v){_vm.$set(_vm.form,"awb_code",$$v);},expression:"form.awb_code"}})],1)],1),_vm._v("\n                    -\n                    "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"90px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.awb_no,callback:function callback($$v){_vm.$set(_vm.form,"awb_no",$$v);},expression:"form.awb_no"}})],1)],1)],1),_vm._v(" "),_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Agent Account: ","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.form.awb_no,callback:function callback($$v){_vm.$set(_vm.form,"awb_no",$$v);},expression:"form.awb_no"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"ml-auto",attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm"}},[_vm._v("e-CSD Status")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"justify-content-center mt-5"},[_c("b-col",[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2"},[_vm._v("\n                                Shipper\n                            ")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Name:*","label-for":"input-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"flex-grow-1"},[_c("select",{staticClass:"custom-select form-control-sm",staticStyle:{width:"320px"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Shipper")]),_vm._v(" "),_c("option",{attrs:{value:"ABS"}},[_vm._v("A")]),_vm._v(" "),_c("option",{attrs:{value:"BDE"}},[_vm._v("B")]),_vm._v(" "),_c("option",{attrs:{value:"RTY"}},[_vm._v("C")])])]),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",attrs:{icon:"arrows-expand","aria-hidden":"true"},on:{click:function click($event){_vm.showShipper=!_vm.showShipper;}}})],1)]),_vm._v(" "),_vm.showShipper?_c("b-col",[_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:""}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-30","class":{"is-invalid":_vm.form.errors.has("ship_name")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_name,callback:function callback($$v){_vm.$set(_vm.form,"ship_name",$$v);},expression:"form.ship_name"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name"}})],1)],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Account:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("ship_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_account,callback:function callback($$v){_vm.$set(_vm.form,"ship_account",$$v);},expression:"form.ship_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Address:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("ship_address")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_address,callback:function callback($$v){_vm.$set(_vm.form,"ship_address",$$v);},expression:"form.ship_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_address,callback:function callback($$v){_vm.$set(_vm.form,"ship_address",$$v);},expression:"form.ship_address"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"City:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-22","class":{"is-invalid":_vm.form.errors.has("ship_city")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_city,callback:function callback($$v){_vm.$set(_vm.form,"ship_city",$$v);},expression:"form.ship_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form,"ship_airport_code",$$v);},expression:"form.ship_airport_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Post Code:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-11","class":{"is-invalid":_vm.form.errors.has("ship_post_code")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_post_code,callback:function callback($$v){_vm.$set(_vm.form,"ship_post_code",$$v);},expression:"form.ship_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"State:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-20","class":{"is-invalid":_vm.form.errors.has("ship_state")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_state,callback:function callback($$v){_vm.$set(_vm.form,"ship_state",$$v);},expression:"form.ship_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-s":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Country:"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-15","class":{"is-invalid":_vm.form.errors.has("ship_country")},staticStyle:{width:"220px"},model:{value:_vm.form.ship_country,callback:function callback($$v){_vm.$set(_vm.form,"ship_country",$$v);},expression:"form.ship_country"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B")]),_vm._v(" "),_c("option",{attrs:{Value:"c"}},[_vm._v("C")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Phone:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-17","class":{"is-invalid":_vm.form.errors.has("ship_phone")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_phone,callback:function callback($$v){_vm.$set(_vm.form,"ship_phone",$$v);},expression:"form.ship_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Fax:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-22","class":{"is-invalid":_vm.form.errors.has("ship_fax")},attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_fax,callback:function callback($$v){_vm.$set(_vm.form,"ship_fax",$$v);},expression:"form.ship_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Telex:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-19",attrs:{id:"input-horizontal"},model:{value:_vm.form.ship_telex,callback:function callback($$v){_vm.$set(_vm.form,"ship_telex",$$v);},expression:"form.ship_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-lg-35",attrs:{size:"sm"}},[_vm._v(" Save new address to address book")])],1):_vm._e()],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for later logins")])],1)],1),_vm._v(" "),_c("b-col",[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2"},[_vm._v("\n                                Consignee\n                            ")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Name:*","label-for":"input-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"flex-grow-1"},[_c("select",{directives:[{name:"model",rawName:"v-model",value:_vm.form.cons_name,expression:"form.cons_name"}],staticClass:"custom-select form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_name")},staticStyle:{width:"320px"},on:{change:function change($event){var $$selectedVal=Array.prototype.filter.call($event.target.options,function(o){return o.selected;}).map(function(o){var val="_value"in o?o._value:o.value;return val;});_vm.$set(_vm.form,"cons_name",$event.target.multiple?$$selectedVal:$$selectedVal[0]);}}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Consignee")]),_vm._v(" "),_c("option",{attrs:{value:"ABC"}},[_vm._v("A")]),_vm._v(" "),_c("option",{attrs:{value:"BDE"}},[_vm._v("B")]),_vm._v(" "),_c("option",{attrs:{value:"CAB"}},[_vm._v("C")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",attrs:{icon:"arrows-expand","aria-hidden":"true"},on:{click:function click($event){_vm.showConsignee=!_vm.showConsignee;}}})],1)]),_vm._v(" "),_vm.showConsignee?_c("b-col",[_c("div",{staticClass:"d-flex align-items-center mt-5"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-16","class":{"is-invalid":_vm.form.errors.has("cons_name")},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_name,callback:function callback($$v){_vm.$set(_vm.form,"cons_name",$$v);},expression:"form.cons_name"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1)],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Account:"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_account,callback:function callback($$v){_vm.$set(_vm.form,"cons_account",$$v);},expression:"form.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Address:"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_address,callback:function callback($$v){_vm.$set(_vm.form,"cons_address",$$v);},expression:"form.cons_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-16","class":{"is-invalid":_vm.form.errors.has("cons_account")},staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_account,callback:function callback($$v){_vm.$set(_vm.form,"cons_account",$$v);},expression:"form.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"City:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-8","class":{"is-invalid":_vm.form.errors.has("cons_city")},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_city,callback:function callback($$v){_vm.$set(_vm.form,"cons_city",$$v);},expression:"form.cons_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"50px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Post Code:"}},[_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("cons_post_code")},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_post_code,callback:function callback($$v){_vm.$set(_vm.form,"cons_post_code",$$v);},expression:"form.cons_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"State:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-6","class":{"is-invalid":_vm.form.errors.has("cons_state")},attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_state,callback:function callback($$v){_vm.$set(_vm.form,"cons_state",$$v);},expression:"form.cons_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Country:"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-1","class":{"is-invalid":_vm.form.errors.has("cons_country")},staticStyle:{width:"220px"},model:{value:_vm.form.cons_country,callback:function callback($$v){_vm.$set(_vm.form,"cons_country",$$v);},expression:"form.cons_country"}},[_c("option",{attrs:{disabled:"",value:"Please select one"}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Phone:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-3",attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_phone,callback:function callback($$v){_vm.$set(_vm.form,"cons_phone",$$v);},expression:"form.cons_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Fax:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-8",attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_fax,callback:function callback($$v){_vm.$set(_vm.form,"cons_fax",$$v);},expression:"form.cons_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Telex:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-5",attrs:{id:"input-horizontal"},model:{value:_vm.form.cons_telex,callback:function callback($$v){_vm.$set(_vm.form,"cons_telex",$$v);},expression:"form.cons_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-lg-21",attrs:{size:"sm"}},[_vm._v(" Save new address to address book")])],1):_vm._e()],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("b-tabs",{staticClass:"nav-tabs",attrs:{"content-class":"mt-3"}},[_c("b-tab",{staticStyle:{border:"2px solid black !important"},attrs:{title:"Routing Information"}},[_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto",label:"Departure Airport*","label-for":"input-departure-airport"}},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("cons_state")},staticStyle:{width:"150px"},model:{value:_vm.form.departure_airport,callback:function callback($$v){_vm.$set(_vm.form,"departure_airport",$$v);},expression:"form.departure_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v(" ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("\n                                                ABZ, Aberdeen (ABZ), United\n                                                Kingdom\n                                            ")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"departure_airport"}})],1)],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-center",staticStyle:{"margin-left":"8.5%"}},[_c("div",{staticClass:"container"},[_c("table",{staticClass:"table-bordered mx-auto table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("From")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("To")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"50px","padding-left":"3%"}},[_vm._v("By")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"50px","padding-left":"3%"}},[_vm._v("Flight")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"50px","padding-left":"3%"}},[_vm._v("Date")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{width:"80px"}})])])])])])],1),_vm._v(" "),_c("b-row",{staticClass:"mt-5"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto",label:"Destination Airport: *","label-for":"input-departure-airport"}},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("destination_airport")},staticStyle:{width:"150px"},model:{value:_vm.form.destination_airport,callback:function callback($$v){_vm.$set(_vm.form,"destination_airport",$$v);},expression:"form.destination_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v(" ABZ, Aberdeen (ABZ), United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"destination_airport"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"1"}},[_vm._v("Routing:*")]),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-center"},[_c("div",{staticClass:"container"},[_c("table",{staticClass:"mx-auto table-sm"},[_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("from")},staticStyle:{width:"150px"},model:{value:_vm.form.departure_airport,callback:function callback($$v){_vm.$set(_vm.form,"departure_airport",$$v);},expression:"form.departure_airport"}},[_c("option",{attrs:{disabled:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("ABZ, Aberdeen (ABZ), United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"from"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to")},staticStyle:{width:"150px"},model:{value:_vm.form.to,callback:function callback($$v){_vm.$set(_vm.form,"to",$$v);},expression:"form.to"}},[_c("option",{attrs:{disabledvalue:""}},[_vm._v(" Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v(" ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v(" ABZ, Aberdeen (ABZ), United Kingdom")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.by,expression:"form.by"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by")},staticStyle:{width:"40px"},attrs:{type:"text"},domProps:{value:_vm.form.by},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"by",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"by"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.flight,expression:"form.flight"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight")},staticStyle:{width:"50px"},attrs:{type:"text"},domProps:{value:_vm.form.flight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"flight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"flight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.date,expression:"form.date"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date")},staticStyle:{width:"60px"},attrs:{type:"text"},domProps:{value:_vm.form.date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"date",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"date"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"60px"}},[_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:_vm.handleDateChange}})],1)])])])])])],1),_vm._v(" "),_c("b-row",{staticClass:"justify-content-end",staticStyle:{"margin-right":"23%"}},[_c("div",{staticClass:"d-flex flex-column justify-content-end"},[_c("table",{staticClass:"mx-auto table-sm"},[_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"150px"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v(" ABZ, Aberdeen (ABZ), United Kingdom")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",staticStyle:{width:"40px"},attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",staticStyle:{width:"50px"},attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"60px !important"}},[_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"}})],1)])])])])]),_vm._v(" "),_c("b-row",{staticClass:"justify-content-end",staticStyle:{"margin-right":"23%"}},[_c("div",{staticClass:"d-flex flex-column justify-content-end"},[_c("table",{staticClass:"mx-auto table-sm"},[_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"150px"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"ABY, Albany (ABY), United States"}},[_vm._v("ABY, Albany (ABY), United States")]),_vm._v(" "),_c("option",{attrs:{value:"ABZ, Aberdeen (ABZ), United Kingdom"}},[_vm._v("ABZ, Aberdeen (ABZ), United Kingdom")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",staticStyle:{width:"40px"},attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",staticStyle:{width:"50px"},attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",staticStyle:{width:"60px"},attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"60px !important"}},[_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"}})],1)])])])])])],1),_vm._v(" "),_c("b-tab",{staticStyle:{border:"2px solid black !important"},attrs:{title:"Search Flights"}},[_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                Carrier *\n                                            ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                Origin *\n                                            ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                Destination *\n                                            ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                Flight Date *\n                                            ")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:_vm.getOriginCode(_vm.form.departure_airport)}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"},domProps:{value:_vm.getDestinationCode(_vm.form.destination_airport)}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{staticClass:"form-control",attrs:{type:"text"}})]),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"}})],1)])])])])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("div",{staticClass:"d-flex justify-content-between align-items-center"},[_c("h4",{staticClass:"h-color font-weight-bolder ml-2 mb-0"},[_vm._v("\n                            Consignment Rate Description\n                        ")]),_vm._v(" "),_c("div",[_c("b-button",{staticClass:"btn-secondary mr-2"},[_c("b-icon",{attrs:{icon:"search","font-scale":"1"}}),_vm._v("Get Rates\n                            ")],1),_vm._v(" "),_c("b-button",{staticClass:"btn-secondary"},[_c("b-icon",{attrs:{icon:"calendar2-minus-fill","font-scale":"1"}}),_vm._v("Collect house waybill sum's\n                            ")],1)],1)]),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-consignment",modifiers:{"modal-consignment":true}}],staticClass:"mt-5",attrs:{variant:"warning"}},[_vm._v("Add Consignment Information")]),_vm._v(" "),_c("b-modal",{ref:"modalConsignment",attrs:{id:"modal-consignment",title:"Consignment Information",size:"xl","ok-only":""}},[_c("div",{staticClass:"d-block"},[_c("b-row",[_c("b-col",{attrs:{cols:"6"}},[_c("h6",[_vm._v("Pieces and Nature and Quantity of Goods")]),_vm._v(" "),_c("div",{staticClass:"bg-light pl-2"},[_c("label",{attrs:{"for":""}},[_vm._v("Pieces")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-departure-airport"},model:{value:_vm.form.pieces,callback:function callback($$v){_vm.$set(_vm.form,"pieces",$$v);},expression:"form.pieces"}}),_vm._v(" "),_c("label",{attrs:{"for":""}},[_vm._v("Description")]),_vm._v(" "),_c("b-form-textarea",{staticStyle:{"grid-column":"span 2 !important",width:"100% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"},model:{value:_vm.form.description,callback:function callback($$v){_vm.$set(_vm.form,"description",$$v);},expression:"form.description"}}),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",[_vm._v("Rate Class:")]),_vm._v(" "),_c("th",[_vm._v("ULD Rate class:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"320px"},model:{value:_vm.form.rate_class,callback:function callback($$v){_vm.$set(_vm.form,"rate_class",$$v);},expression:"form.rate_class"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("CB - Basic rate")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("CC - Specific commodity rate")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("CE - Unit load device additional rate")]),_vm._v(" "),_c("option",{attrs:{value:"K"}},[_vm._v(" CK - Rate per kilogram")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("CM - Minimum charge")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("CN - Normal rate")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("CP - International priority service rate")]),_vm._v(" "),_c("option",{attrs:{value:"Q"}},[_vm._v("CQ - Quantity rate")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("CR - Class rate reduction")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("CS - Class rate surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v(" CU - Unit load device basic charge or rate")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("CX - Unit load device additional info")]),_vm._v(" "),_c("option",{attrs:{value:"Y"}},[_vm._v("CY - Unit load device discount")]),_vm._v(" "),_c("option",{attrs:{value:"Z"}},[_vm._v("CZ - Mutually Defined")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.uld_rate_class,expression:"form.uld_rate_class"}],staticClass:"form-control",staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.form.uld_rate_class},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"uld_rate_class",$event.target.value);}}})])]),_vm._v(" "),_vm.form.rate_class?_c("tr",[_c("td",{staticClass:"editable-cell",attrs:{colspan:"4"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center"},[_c("span",{staticClass:"mr-2"},[_vm._v("Charge:")]),_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.total_amount,expression:"form.total_amount"}],staticClass:"form-control",staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.form.total_amount},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"total_amount",$event.target.value);}}})])])]):_vm._e(),_vm._v(" "),_c("tr",[_c("th",[_vm._v("Service code")]),_vm._v(" "),_c("th",[_vm._v("Commodity Item")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"320px"},model:{value:_vm.form.service_code,callback:function callback($$v){_vm.$set(_vm.form,"service_code",$$v);},expression:"form.service_code"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a Service Code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Airport to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B - Service Cargo")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Company Material")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Door to Door")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Airport to Door")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Flight Specific")]),_vm._v(" "),_c("option",{attrs:{value:"G"}},[_vm._v("G - Door to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"H"}},[_vm._v("H - Company Mail")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Diplomatic Mail")]),_vm._v(" "),_c("option",{attrs:{value:"J"}},[_vm._v("J - Priority Service")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Small Package Service ")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("R - Restricted")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - Substitue Truck")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Charter")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Express Service")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.commodity_item,expression:"form.commodity_item"}],staticClass:"form-control",staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.form.commodity_item},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"commodity_item",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("th",[_vm._v("\n                                                        Country Of Origin of Goods\n                                                    ")]),_vm._v(" "),_c("th",[_vm._v("Slac:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"320px"},model:{value:_vm.form.country_origin_goods,callback:function callback($$v){_vm.$set(_vm.form,"country_origin_goods",$$v);},expression:"form.country_origin_goods"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("  Select a Country")]),_vm._v(" "),_c("option",{attrs:{value:"AF"}},[_vm._v(" Afghanistan")]),_vm._v(" "),_c("option",{attrs:{value:"AX"}},[_vm._v(" Åland Islands ")]),_vm._v(" "),_c("option",{attrs:{value:"AL"}},[_vm._v("Albania")]),_vm._v(" "),_c("option",{attrs:{value:"DZ"}},[_vm._v("Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AS"}},[_vm._v("American Samoa ")]),_vm._v(" "),_c("option",{attrs:{value:"AD"}},[_vm._v(" Andorra")]),_vm._v(" "),_c("option",{attrs:{value:"AO"}},[_vm._v("  Angola")]),_vm._v(" "),_c("option",{attrs:{value:"AI"}},[_vm._v(" Anguilla")]),_vm._v(" "),_c("option",{attrs:{value:"AQ"}},[_vm._v(" Antarctica")]),_vm._v(" "),_c("option",{attrs:{value:"AG"}},[_vm._v(" Antigua and Barbuda")]),_vm._v(" "),_c("option",{attrs:{value:"AR"}},[_vm._v(" Argentina")]),_vm._v(" "),_c("option",{attrs:{value:"AM"}},[_vm._v("Armenia")]),_vm._v(" "),_c("option",{attrs:{value:"AW"}},[_vm._v("Aruba")]),_vm._v(" "),_c("option",{attrs:{value:"AU"}},[_vm._v(" Australia")]),_vm._v(" "),_c("option",{attrs:{value:"AT"}},[_vm._v(" Austria")]),_vm._v(" "),_c("option",{attrs:{value:"AZ"}},[_vm._v(" Azerbaijan")]),_vm._v(" "),_c("option",{attrs:{value:"BS"}},[_vm._v(" Bahamas")]),_vm._v(" "),_c("option",{attrs:{value:"BH"}},[_vm._v("Bahrain")]),_vm._v(" "),_c("option",{attrs:{value:"BD"}},[_vm._v("Bangladesh")]),_vm._v(" "),_c("option",{attrs:{value:"BB"}},[_vm._v("Barbados")]),_vm._v(" "),_c("option",{attrs:{value:"BY"}},[_vm._v("Belarus")]),_vm._v(" "),_c("option",{attrs:{value:"BE"}},[_vm._v("Belgium")]),_vm._v(" "),_c("option",{attrs:{value:"BZ"}},[_vm._v("Belize")]),_vm._v(" "),_c("option",{attrs:{value:"BJ"}},[_vm._v("Benin")]),_vm._v(" "),_c("option",{attrs:{value:"BM"}},[_vm._v(" Bermuda")]),_vm._v(" "),_c("option",{attrs:{value:"BT"}},[_vm._v(" Bhutan")]),_vm._v(" "),_c("option",{attrs:{value:"BO"}},[_vm._v(" Bolivia, Plurinational State of")]),_vm._v(" "),_c("option",{attrs:{value:"BA"}},[_vm._v(" Bosnia and Herzegovina")]),_vm._v(" "),_c("option",{attrs:{value:"BW"}},[_vm._v(" Botswana")]),_vm._v(" "),_c("option",{attrs:{value:"BV"}},[_vm._v("Bouvet Island")]),_vm._v(" "),_c("option",{attrs:{value:"BR"}},[_vm._v(" Brazil")]),_vm._v(" "),_c("option",{attrs:{value:"IO"}},[_vm._v(" British Indian Ocean Territory")]),_vm._v(" "),_c("option",{attrs:{value:"BN"}},[_vm._v("Brunei Darussalam")]),_vm._v(" "),_c("option",{attrs:{value:"BG"}},[_vm._v(" Bulgaria")]),_vm._v(" "),_c("option",{attrs:{value:"BF"}},[_vm._v("Burkina Faso")]),_vm._v(" "),_c("option",{attrs:{value:"BI"}},[_vm._v("Burundi")]),_vm._v(" "),_c("option",{attrs:{value:"KH"}},[_vm._v("Cambodia")]),_vm._v(" "),_c("option",{attrs:{value:"CM"}},[_vm._v("Cameroon")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("Canada")]),_vm._v(" "),_c("option",{attrs:{value:"CV"}},[_vm._v(" Cape Verde")]),_vm._v(" "),_c("option",{attrs:{value:"KY"}},[_vm._v(" Cayman Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CF"}},[_vm._v(" Central African Republic")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("Chad")]),_vm._v(" "),_c("option",{attrs:{value:"CL"}},[_vm._v("Chile")]),_vm._v(" "),_c("option",{attrs:{value:"CN"}},[_vm._v("China")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("Christmas Island")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("Cocos (Keeling) Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CO"}},[_vm._v("Colombia")]),_vm._v(" "),_c("option",{attrs:{value:"KM"}},[_vm._v("Comoros")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("Congo")]),_vm._v(" "),_c("option",{attrs:{value:"CD"}},[_vm._v("Congo, the Democratic Republic of the")]),_vm._v(" "),_c("option",{attrs:{value:"CK"}},[_vm._v("Cook Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CR"}},[_vm._v("Costa Rica")]),_vm._v(" "),_c("option",{attrs:{value:"CI"}},[_vm._v("Côte d'Ivoire")]),_vm._v(" "),_c("option",{attrs:{value:"HR"}},[_vm._v("Croatia")]),_vm._v(" "),_c("option",{attrs:{value:"CU"}},[_vm._v("Cuba")]),_vm._v(" "),_c("option",{attrs:{value:"CY"}},[_vm._v("Cyprus")]),_vm._v(" "),_c("option",{attrs:{value:"CZ"}},[_vm._v("Czech Republic")]),_vm._v(" "),_c("option",{attrs:{value:"DK"}},[_vm._v("Denmark")]),_vm._v(" "),_c("option",{attrs:{value:"DJ"}},[_vm._v("Djibouti")]),_vm._v(" "),_c("option",{attrs:{value:"DM"}},[_vm._v("Dominica")]),_vm._v(" "),_c("option",{attrs:{value:"DO"}},[_vm._v("Dominican Republic")]),_vm._v(" "),_c("option",{attrs:{value:"EC"}},[_vm._v("Ecuador")]),_vm._v(" "),_c("option",{attrs:{value:"EG"}},[_vm._v("Egypt")]),_vm._v(" "),_c("option",{attrs:{value:"SV"}},[_vm._v("El Salvador")]),_vm._v(" "),_c("option",{attrs:{value:"GQ"}},[_vm._v("Equatorial Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"ER"}},[_vm._v("Eritrea")]),_vm._v(" "),_c("option",{attrs:{value:"EE"}},[_vm._v("Estonia\n                                                            ")]),_vm._v(" "),_c("option",{attrs:{value:"ET"}},[_vm._v("Ethiopia")]),_vm._v(" "),_c("option",{attrs:{value:"FK"}},[_vm._v("Falkland Islands (Malvinas)")]),_vm._v(" "),_c("option",{attrs:{value:"FO"}},[_vm._v("Faroe Islands")]),_vm._v(" "),_c("option",{attrs:{value:"FJ"}},[_vm._v("Fiji")]),_vm._v(" "),_c("option",{attrs:{value:"FI"}},[_vm._v("Finland")]),_vm._v(" "),_c("option",{attrs:{value:"FR"}},[_vm._v("France")]),_vm._v(" "),_c("option",{attrs:{value:"GF"}},[_vm._v("French Guiana")]),_vm._v(" "),_c("option",{attrs:{value:"PF"}},[_vm._v("French Polynesia")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("French Southern Territories")]),_vm._v(" "),_c("option",{attrs:{value:"GA"}},[_vm._v("Gabon")]),_vm._v(" "),_c("option",{attrs:{value:"GM"}},[_vm._v("Gambia")]),_vm._v(" "),_c("option",{attrs:{value:"GE"}},[_vm._v("Georgia")]),_vm._v(" "),_c("option",{attrs:{value:"DE"}},[_vm._v("Germany")]),_vm._v(" "),_c("option",{attrs:{value:"GH"}},[_vm._v("Ghana")]),_vm._v(" "),_c("option",{attrs:{value:"GI"}},[_vm._v("Gibraltar")]),_vm._v(" "),_c("option",{attrs:{value:"GR"}},[_vm._v("Greece")]),_vm._v(" "),_c("option",{attrs:{value:"GL"}},[_vm._v("Greenland")]),_vm._v(" "),_c("option",{attrs:{value:"GD"}},[_vm._v("Grenada")]),_vm._v(" "),_c("option",{attrs:{value:"GP"}},[_vm._v("Guadeloupe")]),_vm._v(" "),_c("option",{attrs:{value:"GU"}},[_vm._v("Guam")]),_vm._v(" "),_c("option",{attrs:{value:"GT"}},[_vm._v("Guatemala")]),_vm._v(" "),_c("option",{attrs:{value:"GG"}},[_vm._v("Guernsey")]),_vm._v(" "),_c("option",{attrs:{value:"GN"}},[_vm._v("Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"GW"}},[_vm._v("Guinea-Bissau")]),_vm._v(" "),_c("option",{attrs:{value:"GY"}},[_vm._v("Guyana")]),_vm._v(" "),_c("option",{attrs:{value:"HT"}},[_vm._v("Haiti")]),_vm._v(" "),_c("option",{attrs:{value:"HM"}},[_vm._v("Heard Island and McDonald Islands")]),_vm._v(" "),_c("option",{attrs:{value:"VA"}},[_vm._v("Holy See (Vatican City State)")]),_vm._v(" "),_c("option",{attrs:{value:"HN"}},[_vm._v("Honduras")]),_vm._v(" "),_c("option",{attrs:{value:"HK"}},[_vm._v("Hong Kong")]),_vm._v(" "),_c("option",{attrs:{value:"HU"}},[_vm._v("Hungary")]),_vm._v(" "),_c("option",{attrs:{value:"IS"}},[_vm._v("Iceland")]),_vm._v(" "),_c("option",{attrs:{value:"IN"}},[_vm._v("India")]),_vm._v(" "),_c("option",{attrs:{value:"ID"}},[_vm._v("Indonesia")]),_vm._v(" "),_c("option",{attrs:{value:"IR"}},[_vm._v("Iran, Islamic Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"IQ"}},[_vm._v("Iraq")]),_vm._v(" "),_c("option",{attrs:{value:"IE"}},[_vm._v("Ireland")]),_vm._v(" "),_c("option",{attrs:{value:"IM"}},[_vm._v("Isle of Man")]),_vm._v(" "),_c("option",{attrs:{value:"IL"}},[_vm._v("Israel")]),_vm._v(" "),_c("option",{attrs:{value:"IT"}},[_vm._v("Italy")]),_vm._v(" "),_c("option",{attrs:{value:"JM"}},[_vm._v("Jamaica")]),_vm._v(" "),_c("option",{attrs:{value:"JP"}},[_vm._v("Japan")]),_vm._v(" "),_c("option",{attrs:{value:"JE"}},[_vm._v("Jersey")]),_vm._v(" "),_c("option",{attrs:{value:"JO"}},[_vm._v("Jordan")]),_vm._v(" "),_c("option",{attrs:{value:"KZ"}},[_vm._v("Kazakhstan")]),_vm._v(" "),_c("option",{attrs:{value:"KE"}},[_vm._v("Kenya")]),_vm._v(" "),_c("option",{attrs:{value:"KI"}},[_vm._v("Kiribati")]),_vm._v(" "),_c("option",{attrs:{value:"KP"}},[_vm._v("Korea, Democratic People's Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"KR"}},[_vm._v("Korea, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"KW"}},[_vm._v(" Kuwait")]),_vm._v(" "),_c("option",{attrs:{value:"KG"}},[_vm._v("Kyrgyzstan")]),_vm._v(" "),_c("option",{attrs:{value:"LA"}},[_vm._v("Lao People's Democratic Republic")]),_vm._v(" "),_c("option",{attrs:{value:"LV"}},[_vm._v("Latvia")]),_vm._v(" "),_c("option",{attrs:{value:"LB"}},[_vm._v("Lebanon")]),_vm._v(" "),_c("option",{attrs:{value:"LS"}},[_vm._v("Lesotho")]),_vm._v(" "),_c("option",{attrs:{value:"LR"}},[_vm._v("Liberia")]),_vm._v(" "),_c("option",{attrs:{value:"LY"}},[_vm._v("Libyan Arab Jamahiriya")]),_vm._v(" "),_c("option",{attrs:{value:"LI"}},[_vm._v("Liechtenstein")]),_vm._v(" "),_c("option",{attrs:{value:"LT"}},[_vm._v("Lithuania")]),_vm._v(" "),_c("option",{attrs:{value:"LU"}},[_vm._v("Luxembourg")]),_vm._v(" "),_c("option",{attrs:{value:"MO"}},[_vm._v("Macao")]),_vm._v(" "),_c("option",{attrs:{value:"MK"}},[_vm._v("Macedonia, the former Yugoslav Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"MG"}},[_vm._v("Madagascar")]),_vm._v(" "),_c("option",{attrs:{value:"MW"}},[_vm._v("Malawi")]),_vm._v(" "),_c("option",{attrs:{value:"MY"}},[_vm._v("Malaysia")]),_vm._v(" "),_c("option",{attrs:{value:"MV"}},[_vm._v("Maldives")]),_vm._v(" "),_c("option",{attrs:{value:"ML"}},[_vm._v("Mali")]),_vm._v(" "),_c("option",{attrs:{value:"MT"}},[_vm._v("Malta")]),_vm._v(" "),_c("option",{attrs:{value:"MH"}},[_vm._v("Marshall Islands")]),_vm._v(" "),_c("option",{attrs:{value:"MQ"}},[_vm._v("Martinique")]),_vm._v(" "),_c("option",{attrs:{value:"MR"}},[_vm._v("Mauritania")]),_vm._v(" "),_c("option",{attrs:{value:"MU"}},[_vm._v("Mauritius")]),_vm._v(" "),_c("option",{attrs:{value:"YT"}},[_vm._v("Mayotte")]),_vm._v(" "),_c("option",{attrs:{value:"MX"}},[_vm._v("Mexico")]),_vm._v(" "),_c("option",{attrs:{value:"FM"}},[_vm._v("Micronesia, Federated States of")]),_vm._v(" "),_c("option",{attrs:{value:"MD"}},[_vm._v("Moldova, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"MC"}},[_vm._v("Monaco")]),_vm._v(" "),_c("option",{attrs:{value:"MN"}},[_vm._v("Mongolia")]),_vm._v(" "),_c("option",{attrs:{value:"ME"}},[_vm._v("Montenegro")]),_vm._v(" "),_c("option",{attrs:{value:"MS"}},[_vm._v("Montserrat")]),_vm._v(" "),_c("option",{attrs:{value:"MA"}},[_vm._v("Morocco")]),_vm._v(" "),_c("option",{attrs:{value:"MZ"}},[_vm._v("Mozambique")]),_vm._v(" "),_c("option",{attrs:{value:"MM"}},[_vm._v("Myanmar")]),_vm._v(" "),_c("option",{attrs:{value:"NA"}},[_vm._v("Namibia")]),_vm._v(" "),_c("option",{attrs:{value:"NR"}},[_vm._v("Nauru")]),_vm._v(" "),_c("option",{attrs:{value:"NP"}},[_vm._v("Nepal")]),_vm._v(" "),_c("option",{attrs:{value:"NL"}},[_vm._v("Netherlands")]),_vm._v(" "),_c("option",{attrs:{value:"AN"}},[_vm._v("Netherlands Antilles")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("New Caledonia")]),_vm._v(" "),_c("option",{attrs:{value:"NZ"}},[_vm._v("New Zealand")]),_vm._v(" "),_c("option",{attrs:{value:"NI"}},[_vm._v("Nicaragua")]),_vm._v(" "),_c("option",{attrs:{value:"NE"}},[_vm._v("Niger")]),_vm._v(" "),_c("option",{attrs:{value:"NG"}},[_vm._v("Nigeria")]),_vm._v(" "),_c("option",{attrs:{value:"NU"}},[_vm._v("Niue")]),_vm._v(" "),_c("option",{attrs:{value:"NF"}},[_vm._v("Norfolk Island")]),_vm._v(" "),_c("option",{attrs:{value:"MP"}},[_vm._v("Northern Mariana Islands")]),_vm._v(" "),_c("option",{attrs:{value:"NO"}},[_vm._v("Norway")]),_vm._v(" "),_c("option",{attrs:{value:"OM"}},[_vm._v("Oman")]),_vm._v(" "),_c("option",{attrs:{value:"PK"}},[_vm._v("Pakistan")]),_vm._v(" "),_c("option",{attrs:{value:"PW"}},[_vm._v("Palau")]),_vm._v(" "),_c("option",{attrs:{value:"PS"}},[_vm._v("Palestinian Territory, Occupied")]),_vm._v(" "),_c("option",{attrs:{value:"PA"}},[_vm._v("Panama")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("Papua New Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"PY"}},[_vm._v("Paraguay")]),_vm._v(" "),_c("option",{attrs:{value:"PE"}},[_vm._v("Peru")]),_vm._v(" "),_c("option",{attrs:{value:"PH"}},[_vm._v("Philippines")]),_vm._v(" "),_c("option",{attrs:{value:"PN"}},[_vm._v("Pitcairn")]),_vm._v(" "),_c("option",{attrs:{value:"PL"}},[_vm._v("Poland")]),_vm._v(" "),_c("option",{attrs:{value:"PT"}},[_vm._v("Portugal")]),_vm._v(" "),_c("option",{attrs:{value:"PR"}},[_vm._v("Puerto Rico")]),_vm._v(" "),_c("option",{attrs:{value:"QA"}},[_vm._v("Qatar")]),_vm._v(" "),_c("option",{attrs:{value:"RE"}},[_vm._v("Réunion")]),_vm._v(" "),_c("option",{attrs:{value:"RO"}},[_vm._v("Romania")]),_vm._v(" "),_c("option",{attrs:{value:"RU"}},[_vm._v("Russian Federation")]),_vm._v(" "),_c("option",{attrs:{value:"RW"}},[_vm._v("Rwanda")]),_vm._v(" "),_c("option",{attrs:{value:"BL"}},[_vm._v("Saint  Barthélemy")]),_vm._v(" "),_c("option",{attrs:{value:"SH"}},[_vm._v("Saint Helena, Ascension and Tristan da Cunha")]),_vm._v(" "),_c("option",{attrs:{value:"KN"}},[_vm._v("Saint Kitts and Nevis")]),_vm._v(" "),_c("option",{attrs:{value:"LC"}},[_vm._v("Saint Lucia")]),_vm._v(" "),_c("option",{attrs:{value:"MF"}},[_vm._v("Saint Martin (French part)")]),_vm._v(" "),_c("option",{attrs:{value:"PM"}},[_vm._v("Saint Pierre and Miquelon")]),_vm._v(" "),_c("option",{attrs:{value:"VC"}},[_vm._v("Saint Vincent and the Grenadines")]),_vm._v(" "),_c("option",{attrs:{value:"WS"}},[_vm._v("Samoa")]),_vm._v(" "),_c("option",{attrs:{value:"SM"}},[_vm._v("San Marino")]),_vm._v(" "),_c("option",{attrs:{value:"ST"}},[_vm._v("Sao Tome and Principe")]),_vm._v(" "),_c("option",{attrs:{value:"SA"}},[_vm._v(" Saudi Arabia")]),_vm._v(" "),_c("option",{attrs:{value:"SN"}},[_vm._v("Senegal")]),_vm._v(" "),_c("option",{attrs:{value:"RS"}},[_vm._v("Serbia")]),_vm._v(" "),_c("option",{attrs:{value:"SC"}},[_vm._v("Seychelles")]),_vm._v(" "),_c("option",{attrs:{value:"SL"}},[_vm._v("Sierra Leone")]),_vm._v(" "),_c("option",{attrs:{value:"SG"}},[_vm._v("Singapore")]),_vm._v(" "),_c("option",{attrs:{value:"SK"}},[_vm._v("Slovakia")]),_vm._v(" "),_c("option",{attrs:{value:"SI"}},[_vm._v("Slovenia")]),_vm._v(" "),_c("option",{attrs:{value:"SB"}},[_vm._v("Solomon Islands")]),_vm._v(" "),_c("option",{attrs:{value:"SO"}},[_vm._v("Somalia")]),_vm._v(" "),_c("option",{attrs:{value:"ZA"}},[_vm._v("South Africa")]),_vm._v(" "),_c("option",{attrs:{value:"GS"}},[_vm._v("South Georgia and the South Sandwich Islands")]),_vm._v(" "),_c("option",{attrs:{value:"SS"}},[_vm._v("South Sudan")]),_vm._v(" "),_c("option",{attrs:{value:"ES"}},[_vm._v("Spain")]),_vm._v(" "),_c("option",{attrs:{value:"LK"}},[_vm._v("Sri Lanka")]),_vm._v(" "),_c("option",{attrs:{value:"SD"}},[_vm._v("Sudan")]),_vm._v(" "),_c("option",{attrs:{value:"SR"}},[_vm._v("Suriname")]),_vm._v(" "),_c("option",{attrs:{value:"SJ"}},[_vm._v("Svalbard and Jan Mayen ")]),_vm._v(" "),_c("option",{attrs:{value:"SZ"}},[_vm._v("Swaziland ")]),_vm._v(" "),_c("option",{attrs:{value:"SE"}},[_vm._v("Sweden ")]),_vm._v(" "),_c("option",{attrs:{value:"CH"}},[_vm._v("Switzerland")]),_vm._v(" "),_c("option",{attrs:{value:"SY"}},[_vm._v("Syrian Arab Republic")]),_vm._v(" "),_c("option",{attrs:{value:"TW"}},[_vm._v("Taiwan, Republic of China")]),_vm._v(" "),_c("option",{attrs:{value:"TJ"}},[_vm._v("Tajikistan")]),_vm._v(" "),_c("option",{attrs:{value:"TZ"}},[_vm._v("Tanzania, United Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"TH"}},[_vm._v("Thailand")]),_vm._v(" "),_c("option",{attrs:{value:"TL"}},[_vm._v("Timor-Leste")]),_vm._v(" "),_c("option",{attrs:{value:"TG"}},[_vm._v("Togo")]),_vm._v(" "),_c("option",{attrs:{value:"TK"}},[_vm._v("Tokelau")]),_vm._v(" "),_c("option",{attrs:{value:"TO"}},[_vm._v("Tonga")]),_vm._v(" "),_c("option",{attrs:{value:"TT"}},[_vm._v("Trinidad and Tobago ")]),_vm._v(" "),_c("option",{attrs:{value:"TN"}},[_vm._v("Tunisia ")]),_vm._v(" "),_c("option",{attrs:{value:"TR"}},[_vm._v("Turkey")]),_vm._v(" "),_c("option",{attrs:{value:"TM"}},[_vm._v("Turkmenistan ")]),_vm._v(" "),_c("option",{attrs:{value:"TC"}},[_vm._v("Turks and Caicos Islands")]),_vm._v(" "),_c("option",{attrs:{value:"TV"}},[_vm._v("Tuvalu")]),_vm._v(" "),_c("option",{attrs:{value:"UG"}},[_vm._v("Uganda")]),_vm._v(" "),_c("option",{attrs:{value:"UA"}},[_vm._v("Ukraine")]),_vm._v(" "),_c("option",{attrs:{value:"AE"}},[_vm._v("United Arab Emirates ")]),_vm._v(" "),_c("option",{attrs:{value:"GB"}},[_vm._v("United  Kingdom")]),_vm._v(" "),_c("option",{attrs:{value:"US"}},[_vm._v("United States")]),_vm._v(" "),_c("option",{attrs:{value:"UM"}},[_vm._v("United States Minor Outlying Islands")]),_vm._v(" "),_c("option",{attrs:{value:"UY"}},[_vm._v("Uruguay")]),_vm._v(" "),_c("option",{attrs:{value:"UZ"}},[_vm._v("Uzbekistan")]),_vm._v(" "),_c("option",{attrs:{value:"VU"}},[_vm._v("Vanuatu")]),_vm._v(" "),_c("option",{attrs:{value:"VE"}},[_vm._v("Venezuela, Bolivarian Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"VN"}},[_vm._v("Viet Nam")]),_vm._v(" "),_c("option",{attrs:{value:"VG"}},[_vm._v("Virgin Islands, British")]),_vm._v(" "),_c("option",{attrs:{value:"VI"}},[_vm._v("Virgin Islands, U.S.")]),_vm._v(" "),_c("option",{attrs:{value:"WF"}},[_vm._v("Wallis and Futuna")]),_vm._v(" "),_c("option",{attrs:{value:"EH"}},[_vm._v("Western Sahara")]),_vm._v(" "),_c("option",{attrs:{value:"YE"}},[_vm._v("Yemen")]),_vm._v(" "),_c("option",{attrs:{value:"ZM"}},[_vm._v("Zambia")]),_vm._v(" "),_c("option",{attrs:{value:"ZW"}},[_vm._v("Zimbabwe")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.slac,expression:"form.slac"}],staticClass:"form-control",staticStyle:{width:"170px"},attrs:{type:"text"},domProps:{value:_vm.form.slac},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"slac",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("th",[_vm._v("Hs Codes:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center"}},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("hs_code")},staticStyle:{width:"170px","margin-right":"10px"},attrs:{type:"text"},model:{value:_vm.form.hs_code,callback:function callback($$v){_vm.$set(_vm.form,"hs_code",$$v);},expression:"form.hs_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"hs_code"}}),_vm._v(" "),_c("button",{on:{click:_vm.addHsCode}},[_vm._v("Add")])],1)]),_vm._v(" "),_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("HS Codes")])]),_vm._v(" "),_vm._l(_vm.hsCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",[_vm._v(_vm._s(code))]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.removeHsCode(index);}}})],1)]);})],2)])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"6"}},[_c("h6",[_vm._v("Weight and Dimensions")]),_vm._v(" "),_c("div",{staticClass:"bg-light pl-2"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",[_vm._v("Gross Weight")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th",[_vm._v(" Chargeable Weight")]),_vm._v(" "),_c("th",[_vm._v("Rate")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.gross_weight,expression:"form.gross_weight"}],staticClass:"form-control",staticStyle:{width:"70px"},attrs:{type:"text"},domProps:{value:_vm.form.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"gross_weight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"70px"},model:{value:_vm.form.weight_code,callback:function callback($$v){_vm.$set(_vm.form,"weight_code",$$v);},expression:"form.weight_code"}},[_c("option",{attrs:{value:"K"}},[_vm._v("Kgs")]),_vm._v(" "),_c("option",{attrs:{value:"L"}},[_vm._v("Lbs")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.chargable_weight,expression:"form.chargable_weight"}],staticClass:"form-control",staticStyle:{width:"70px"},attrs:{type:"text"},domProps:{value:_vm.form.chargable_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"chargable_weight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.rate,expression:"form.rate"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.form.rate},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"rate",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.pcs,expression:"form.pcs"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.form.pcs},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"pcs",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.gross_weight,expression:"form.gross_weight"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.form.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"gross_weight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.length,expression:"form.length"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.form.length},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"length",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.width,expression:"form.width"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.form.width},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"width",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.height,expression:"form.height"}],staticClass:"form-control",staticStyle:{width:"100%"},attrs:{type:"text"},domProps:{value:_vm.form.height},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"height",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"100%"},model:{value:_vm.form.unit,callback:function callback($$v){_vm.$set(_vm.form,"unit",$$v);},expression:"form.unit"}},[_c("option",{attrs:{value:"CMT"}},[_vm._v("CMT")]),_vm._v(" "),_c("option",{attrs:{value:"INH"}},[_vm._v("INH")]),_vm._v(" "),_c("option",{attrs:{value:"FOT"}},[_vm._v("FOT")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{on:{click:_vm.addPcsInfo}},[_vm._v("Add")])])]),_vm._v(" "),_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")])]),_vm._v(" "),_vm._l(_vm.itemss,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.pcs))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.gross_weight))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.length))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.width))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.height))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",{staticClass:"mr-3"},[_vm._v(_vm._s(row.unit))]),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deletePcs(index);}}})],1)]);})],2)]),_vm._v(" "),_c("h6",[_vm._v("Volume")]),_vm._v(" "),_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"80px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.volume,callback:function callback($$v){_vm.$set(_vm.form,"volume",$$v);},expression:"form.volume"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"70px","margin-right":"10px"},model:{value:_vm.form.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form,"dimention_unit",$$v);},expression:"form.dimention_unit"}},[_c("option",{attrs:{value:"CC"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MC"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"CF"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"CI"}},[_vm._v("in³")])])],1)],1)],1),_vm._v(" "),_c("h5",{staticClass:"mt-5 mb-2"},[_vm._v("ULD Information")]),_vm._v(" "),_c("div",{staticClass:"bg-light"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.uld_type,expression:"form.uld_type"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.form.uld_type},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"uld_type",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.uld_serial,expression:"form.uld_serial"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.form.uld_serial},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"uld_serial",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.owner,expression:"form.owner"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.form.owner},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"owner",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{on:{click:_vm.addUldInfo}},[_vm._v("Add")])])]),_vm._v(" "),_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_vm._l(_vm.uld_info,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.uld_type))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.uld_serial))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.owner))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteUldInfo(index);}}})],1)]);})],2)])])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end"},[_c("button",{staticClass:"btn btn-secondary",on:{click:_vm.addOrUpdateEntry}},[_vm._v("\n                                    "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                ")])])],1)]),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-center mb-5 mt-5"},[_c("div",{},[_c("table",{staticClass:"table-bordered mx-auto table-sm"},[_vm._m(1),_vm._v(" "),_c("tbody",_vm._l(_vm.entries,function(entry,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(entry.pcs))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.description))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.service_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.commodity_item))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.gross_weight)+", "+_vm._s(entry.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.chargable_weight))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.pcs)+"-"+_vm._s(entry.gross_weight)+"-"+_vm._s(entry.weight_code)+"-"+_vm._s(entry.length)+"x"+_vm._s(entry.width)+"x"+_vm._s(entry.height)+"-"+_vm._s(entry.unit))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.volume))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.uld_rate_class))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.total_amount))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.hs_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.country_origin_goods))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.uld_info))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(entry.slac))]),_vm._v(" "),_c("td",{staticClass:"d-flex align-items-center"},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editEntry(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteEntry(index);}}})],1)]);}),0)])]),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end ml-auto mb-20"},[_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-group",{staticClass:"form-control-sm col-form-",attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticClass:"mr-2 mb-0",attrs:{"for":"input-horizontal"}},[_vm._v("Total Volume:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-2",attrs:{id:"input-horizontal"},model:{value:_vm.form.total_valume,callback:function callback($$v){_vm.$set(_vm.form,"total_valume",$$v);},expression:"form.total_valume"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.form.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form,"dimention_unit",$$v);},expression:"form.dimention_unit"}},[_c("option",{attrs:{value:"CC"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MC"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"CF"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"CI"}},[_vm._v("in³")])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticClass:"mr-2 mb-0",attrs:{"for":"input-horizontal"}},[_vm._v("Total Amount:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-2",attrs:{id:"input-horizontal"},model:{value:_vm.form.total_amount,callback:function callback($$v){_vm.$set(_vm.form,"total_amount",$$v);},expression:"form.total_amount"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticClass:"mr-2 mb-3",attrs:{"for":"input-horizontal"}},[_vm._v("Master Pcs:*")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-2 mt-2",attrs:{id:"input-horizontal"},model:{value:_vm.form.master_pcs,callback:function callback($$v){_vm.$set(_vm.form,"master_pcs",$$v);},expression:"form.master_pcs"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticClass:"mr-2 mb-0",attrs:{"for":"input-horizontal"}},[_vm._v("Master Weight:*")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-2 mt-2",attrs:{id:"input-horizontal"},model:{value:_vm.form.master_weight,callback:function callback($$v){_vm.$set(_vm.form,"master_weight",$$v);},expression:"form.master_weight"}})],1)])],1)])])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-tabs",[_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Payment Information",active:""}},[_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"7"}},[_c("b-row",{staticClass:"justify-content-center mt-5"},[_c("b-col",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"d-flex align-items-center mt-1"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3 mb-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Type Of Payment:*"}},[_c("b-form-select",{staticClass:"form-control-sm ml-lg-15",staticStyle:{width:"220px"},model:{value:_vm.form.type_of_payment,callback:function callback($$v){_vm.$set(_vm.form,"type_of_payment",$$v);},expression:"form.type_of_payment"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Please select one ")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("Partial Collect Credit — Partial Prepaid Cash\tCA")]),_vm._v(" "),_c("option",{attrs:{value:"CB"}},[_vm._v("Partial Collect Credit — Partial Prepaid Credit\tCB")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("All Charges Collect\tCC")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("All Charges Collect by GBL CG")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("Destination Collect Cash\tCP")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("Destination Collect Credit CX")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("No Charge NC")]),_vm._v(" "),_c("option",{attrs:{value:"PC"}},[_vm._v("Partial Prepaid Cash — Partial Collect Cash\tPC")]),_vm._v(" "),_c("option",{attrs:{value:"PD"}},[_vm._v("Partial Prepaid Credit — Partial Collect Cash\tPD")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("All Charges Prepaid by GBL\tPG")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("All Charges Prepaid Cash\tPP")]),_vm._v(" "),_c("option",{attrs:{value:"PX"}},[_vm._v("All Charges Prepaid Credit\tPX")])])],1),_vm._v(" "),_c("label",{staticClass:"ml-3 mt-4 mb-5 mr-5"},[_vm._v("Currency:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("currency")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.currency,callback:function callback($$v){_vm.$set(_vm.form,"currency",$$v);},expression:"form.currency"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"currency"}})],1),_vm._v(" "),_c("label",{staticClass:"ml-3 mt-5 mb-5"},[_vm._v("Declared Values For:")]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Carriage :"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31 mt-3",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.carriage,callback:function callback($$v){_vm.$set(_vm.form,"carriage",$$v);},expression:"form.carriage"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Customs :"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-31 mt-3",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.customs,callback:function callback($$v){_vm.$set(_vm.form,"customs",$$v);},expression:"form.customs"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mr-3",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Insurance:"}},[_c("b-form-input",{staticClass:"form-control-sm ml-lg-30 mt-3",staticStyle:{width:"220px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.insurance,callback:function callback($$v){_vm.$set(_vm.form,"insurance",$$v);},expression:"form.insurance"}})],1)],1)],1)],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"5"}},[_c("table",{staticClass:"table-bordered ml-auto table-sm m-5"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",[_vm._v("Charges Summary")]),_vm._v(" "),_c("th",[_vm._v("Prepaid")]),_vm._v(" "),_c("th",[_vm._v("Collect")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Weight Charge (WT)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.weightCharge.toFixed(2))+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Taxes (TX)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.taxes.toFixed(2))+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Agent (OA)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentCollect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Carrier (OC)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierCollect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Total Charges")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChargesPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChrage)+" INR")])])])])])],1)],1)]),_vm._v(" "),_c("b-tab",{attrs:{title:"Other Charges"}},[_c("div",{staticClass:"container h_background_color text-white pt-2 pb-2"},[_c("div",{staticClass:"row"},[_c("div",{staticClass:"col text-left"},[_c("h4",[_vm._v("Code")])]),_vm._v(" "),_c("div",{staticClass:"col text-left"},[_c("h4",[_vm._v("Amount In INR")])])])]),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.form.code,callback:function callback($$v){_vm.$set(_vm.form,"code",$$v);},expression:"form.code"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v(" Select an Other Charge Code ")]),_vm._v(" "),_c("option",{attrs:{value:"MY - Fuel Surcharge"}},[_vm._v("MY - Fuel Surcharge ")]),_vm._v(" "),_c("option",{attrs:{value:"SC - Security Charge"}},[_vm._v("SC - Security Charge ")]),_vm._v(" "),_c("option",{attrs:{value:"AC - Animal Container"}},[_vm._v("AC - Animal Container ")])])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{placeholder:"or:"},model:{value:_vm.form.other_code,callback:function callback($$v){_vm.$set(_vm.form,"other_code",$$v);},expression:"form.other_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",model:{value:_vm.form.amount,callback:function callback($$v){_vm.$set(_vm.form,"amount",$$v);},expression:"form.amount"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"Agent"},model:{value:_vm.form.due,callback:function callback($$v){_vm.$set(_vm.form,"due",$$v);},expression:"form.due"}},[_vm._v("Due Agent")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"Carrier"},model:{value:_vm.form.due,callback:function callback($$v){_vm.$set(_vm.form,"due",$$v);},expression:"form.due"}},[_vm._v("Due Carrier")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"Prepaid"},model:{value:_vm.form.payment_type,callback:function callback($$v){_vm.$set(_vm.form,"payment_type",$$v);},expression:"form.payment_type"}},[_vm._v("Prepaid")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"Collect"},model:{value:_vm.form.payment_type,callback:function callback($$v){_vm.$set(_vm.form,"payment_type",$$v);},expression:"form.payment_type"}},[_vm._v("Collect")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"bg-secondary form-control-sm px-5",on:{click:_vm.addCharge}},[_vm._v("\n                                            "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                        ")])],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v(" Calculate Charge ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"}),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v(" Chargeable Weight ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.chargable_weight1,expression:"form.chargable_weight1"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.form.chargable_weight1},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"chargable_weight1",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v(" Charge ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.charge,expression:"form.charge"}],staticClass:"form-control",staticStyle:{width:"100px"},attrs:{type:"text"},domProps:{value:_vm.form.charge},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"charge",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2"},[_c("b-button",{staticClass:"bg-secondary form-control-sm px-5",on:{click:_vm.calculateCharge}},[_vm._v("Calculate")])],1)])])])]),_vm._v(" "),_c("table",{staticClass:"table-bordered table-sm"},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Amount")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Due")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Type Of Payment")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Actions")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.charges,function(charge,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                            "+_vm._s(charge.code||charge.other_code)+"\n                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                            "+_vm._s(charge.amount)+"\n                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                            "+_vm._s(charge.due)+"\n                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                            "+_vm._s(charge.payment_type)+"\n                                        ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-button",{attrs:{size:"sm"},on:{click:function click($event){return _vm.editCharge(index);}}},[_c("b-icon",{attrs:{icon:"pencil","font-scale":"1"}})],1),_vm._v(" "),_c("b-button",{attrs:{size:"sm"},on:{click:function click($event){return _vm.removeCharge(index);}}},[_c("b-icon",{attrs:{icon:"trash"}})],1)],1)]);}),0)]),_vm._v(" "),_c("hr",{staticClass:"hr"})],1),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Special Handling Codes"}},[_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("special_handling_code")},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select Special Handling Codes")]),_vm._v(" "),_vm._l(_vm.codes,function(code){return _c("option",{key:code.value,domProps:{value:code.value}},[_vm._v(_vm._s(code.text))]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_handling_code"}})],1)],1),_vm._v("\n                                        or:\n                                        "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"}},[_vm._v("or:")])],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"form-control-sm",attrs:{id:"input-horizontal",type:"button"},on:{click:_vm.addManualCode}},[_vm._v("Add")])],1)],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm",staticStyle:{width:"31%"}},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                Code\n                                            ")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.tableCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(code))])]);}),0)])])]),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Other Customs Information"}},[_c("b-tabs",{staticClass:"mt-lg-5"},[_c("b-tab",{staticClass:"mt-lg-7",attrs:{title:"Other Customs Information"}},[_c("div",{staticClass:"d-flex flex-column align-items-start py-5"},[_c("table",{staticClass:"table-bordered table-sm",staticStyle:{width:"100%"}},[_c("thead",[_c("tr",{staticClass:"h_background_color"},[_c("th",{staticClass:"form-control1"},[_vm._v("\n                                                        Country Code:\n                                                    ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v(" Information Identifier: ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v(" Customs Information Identifier ")]),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("oci_country_code")},model:{value:_vm.form.oci_country_code,callback:function callback($$v){_vm.$set(_vm.form,"oci_country_code",$$v);},expression:"form.oci_country_code"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a country")]),_vm._v(" "),_c("option",{attrs:{value:"AF"}},[_vm._v("Afghanistan")]),_vm._v(" "),_c("option",{attrs:{value:"AX"}},[_vm._v("Åland Islands")]),_vm._v(" "),_c("option",{attrs:{value:"AL"}},[_vm._v("Albania")]),_vm._v(" "),_c("option",{attrs:{value:"DZ"}},[_vm._v("Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AS"}},[_vm._v("American Samoa")]),_vm._v(" "),_c("option",{attrs:{value:"AD"}},[_vm._v("Andorra")]),_vm._v(" "),_c("option",{attrs:{value:"AO"}},[_vm._v("Angola")]),_vm._v(" "),_c("option",{attrs:{value:"AI"}},[_vm._v("Anguilla")]),_vm._v(" "),_c("option",{attrs:{value:"AQ"}},[_vm._v("Antarctica")]),_vm._v(" "),_c("option",{attrs:{value:"AG"}},[_vm._v("Antigua and Barbuda")]),_vm._v(" "),_c("option",{attrs:{value:"AR"}},[_vm._v("Argentina")]),_vm._v(" "),_c("option",{attrs:{value:"AM"}},[_vm._v("Armenia")]),_vm._v(" "),_c("option",{attrs:{value:"AW"}},[_vm._v("Aruba")]),_vm._v(" "),_c("option",{attrs:{value:"AU"}},[_vm._v("Australia")]),_vm._v(" "),_c("option",{attrs:{value:"AT"}},[_vm._v("Austria")]),_vm._v(" "),_c("option",{attrs:{value:"AZ"}},[_vm._v("Azerbaijan")]),_vm._v(" "),_c("option",{attrs:{value:"BS"}},[_vm._v("Bahamas")]),_vm._v(" "),_c("option",{attrs:{value:"BH"}},[_vm._v("Bahrain")]),_vm._v(" "),_c("option",{attrs:{value:"BD"}},[_vm._v("Bangladesh")]),_vm._v(" "),_c("option",{attrs:{value:"BB"}},[_vm._v("Barbados")]),_vm._v(" "),_c("option",{attrs:{value:"BY"}},[_vm._v("Belarus")]),_vm._v(" "),_c("option",{attrs:{value:"BE"}},[_vm._v("Belgium")]),_vm._v(" "),_c("option",{attrs:{value:"BZ"}},[_vm._v("Belize")]),_vm._v(" "),_c("option",{attrs:{value:"BJ"}},[_vm._v("Benin")]),_vm._v(" "),_c("option",{attrs:{value:"BM"}},[_vm._v("Bermuda")]),_vm._v(" "),_c("option",{attrs:{value:"BT"}},[_vm._v("Bhutan")]),_vm._v(" "),_c("option",{attrs:{value:"BO"}},[_vm._v("Bolivia")]),_vm._v(" "),_c("option",{attrs:{value:"BQ"}},[_vm._v("Bonaire")]),_vm._v(" "),_c("option",{attrs:{value:"BA"}},[_vm._v("Bosnia and Herzegovina")]),_vm._v(" "),_c("option",{attrs:{value:"BW"}},[_vm._v("Botswana")]),_vm._v(" "),_c("option",{attrs:{value:"BV"}},[_vm._v("Bouvet Island")]),_vm._v(" "),_c("option",{attrs:{value:"BR"}},[_vm._v("Brazil")]),_vm._v(" "),_c("option",{attrs:{value:"IO"}},[_vm._v("British Indian Ocean Territory")]),_vm._v(" "),_c("option",{attrs:{value:"BN"}},[_vm._v("Brunei Darussalam")]),_vm._v(" "),_c("option",{attrs:{value:"BG"}},[_vm._v("Bulgaria")]),_vm._v(" "),_c("option",{attrs:{value:"BF"}},[_vm._v("Burkina Faso")]),_vm._v(" "),_c("option",{attrs:{value:"BI"}},[_vm._v("Burundi")]),_vm._v(" "),_c("option",{attrs:{value:"KH"}},[_vm._v("Cambodia")]),_vm._v(" "),_c("option",{attrs:{value:"CM"}},[_vm._v("Cameroon")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("Canada")]),_vm._v(" "),_c("option",{attrs:{value:"CV"}},[_vm._v("Cape Verde")]),_vm._v(" "),_c("option",{attrs:{value:"KY"}},[_vm._v("Cayman Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CF"}},[_vm._v("Central African Republic")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("Chad")]),_vm._v(" "),_c("option",{attrs:{value:"CL"}},[_vm._v("Chile")]),_vm._v(" "),_c("option",{attrs:{value:"CN"}},[_vm._v("China")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("Christmas Island")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("Cocos (Keeling) Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CO"}},[_vm._v("Colombia")]),_vm._v(" "),_c("option",{attrs:{value:"KM"}},[_vm._v("Comoros")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("Congo")]),_vm._v(" "),_c("option",{attrs:{value:"CD"}},[_vm._v("Congo, the Democratic Republic of the")]),_vm._v(" "),_c("option",{attrs:{value:"CK"}},[_vm._v("Cook Islands")]),_vm._v(" "),_c("option",{attrs:{value:"CR"}},[_vm._v("Costa Rica")]),_vm._v(" "),_c("option",{attrs:{value:"CI"}},[_vm._v("Côte d'Ivoire")]),_vm._v(" "),_c("option",{attrs:{value:"HR"}},[_vm._v("Croatia")]),_vm._v(" "),_c("option",{attrs:{value:"CU"}},[_vm._v("Cuba")]),_vm._v(" "),_c("option",{attrs:{value:"CW"}},[_vm._v("Curacao")]),_vm._v(" "),_c("option",{attrs:{value:"CY"}},[_vm._v("Cyprus")]),_vm._v(" "),_c("option",{attrs:{value:"CZ"}},[_vm._v("Czech Republic")]),_vm._v(" "),_c("option",{attrs:{value:"DK"}},[_vm._v("Denmark")]),_vm._v(" "),_c("option",{attrs:{value:"DJ"}},[_vm._v("Djibouti")]),_vm._v(" "),_c("option",{attrs:{value:"DM"}},[_vm._v("Dominica")]),_vm._v(" "),_c("option",{attrs:{value:"DO"}},[_vm._v("Dominican Republic")]),_vm._v(" "),_c("option",{attrs:{value:"EC"}},[_vm._v("Ecuador")]),_vm._v(" "),_c("option",{attrs:{value:"EG"}},[_vm._v("Egypt")]),_vm._v(" "),_c("option",{attrs:{value:"SV"}},[_vm._v("El Salvador")]),_vm._v(" "),_c("option",{attrs:{value:"GQ"}},[_vm._v("Equatorial Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"ER"}},[_vm._v("Eritrea")]),_vm._v(" "),_c("option",{attrs:{value:"EE"}},[_vm._v("Estonia")]),_vm._v(" "),_c("option",{attrs:{value:"ET"}},[_vm._v("Ethiopia")]),_vm._v(" "),_c("option",{attrs:{value:"FK"}},[_vm._v("Falkland Islands (Malvinas)")]),_vm._v(" "),_c("option",{attrs:{value:"FO"}},[_vm._v("Faroe Islands")]),_vm._v(" "),_c("option",{attrs:{value:"FJ"}},[_vm._v("Fiji")]),_vm._v(" "),_c("option",{attrs:{value:"FI"}},[_vm._v("Finland")]),_vm._v(" "),_c("option",{attrs:{value:"FR"}},[_vm._v("France")]),_vm._v(" "),_c("option",{attrs:{value:"GF"}},[_vm._v("French Guiana")]),_vm._v(" "),_c("option",{attrs:{value:"PF"}},[_vm._v("French Polynesia")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("French Southern Territories")]),_vm._v(" "),_c("option",{attrs:{value:"GA"}},[_vm._v("Gabon")]),_vm._v(" "),_c("option",{attrs:{value:"GM"}},[_vm._v("Gambia")]),_vm._v(" "),_c("option",{attrs:{value:"GE"}},[_vm._v("Georgia")]),_vm._v(" "),_c("option",{attrs:{value:"DE"}},[_vm._v("Germany")]),_vm._v(" "),_c("option",{attrs:{value:"GH"}},[_vm._v("Ghana")]),_vm._v(" "),_c("option",{attrs:{value:"GI"}},[_vm._v("Gibraltar")]),_vm._v(" "),_c("option",{attrs:{value:"GR"}},[_vm._v("Greece")]),_vm._v(" "),_c("option",{attrs:{value:"GL"}},[_vm._v("Greenland")]),_vm._v(" "),_c("option",{attrs:{value:"GD"}},[_vm._v("Grenada")]),_vm._v(" "),_c("option",{attrs:{value:"GP"}},[_vm._v("Guadeloupe")]),_vm._v(" "),_c("option",{attrs:{value:"GU"}},[_vm._v("Guam")]),_vm._v(" "),_c("option",{attrs:{value:"GT"}},[_vm._v("Guatemala")]),_vm._v(" "),_c("option",{attrs:{value:"GG"}},[_vm._v("Guernsey")]),_vm._v(" "),_c("option",{attrs:{value:"GN"}},[_vm._v("Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"GW"}},[_vm._v("Guinea-Bissau")]),_vm._v(" "),_c("option",{attrs:{value:"GY"}},[_vm._v("Guyana")]),_vm._v(" "),_c("option",{attrs:{value:"HT"}},[_vm._v("Haiti")]),_vm._v(" "),_c("option",{attrs:{value:"HM"}},[_vm._v("Heard Island and McDonald Islands")]),_vm._v(" "),_c("option",{attrs:{value:"VA"}},[_vm._v("Holy See (Vatican City State)")]),_vm._v(" "),_c("option",{attrs:{value:"HN"}},[_vm._v("Honduras")]),_vm._v(" "),_c("option",{attrs:{value:"HK"}},[_vm._v("Hong Kong")]),_vm._v(" "),_c("option",{attrs:{value:"HU"}},[_vm._v("Hungary")]),_vm._v(" "),_c("option",{attrs:{value:"IS"}},[_vm._v("Iceland")]),_vm._v(" "),_c("option",{attrs:{value:"IN"}},[_vm._v("India")]),_vm._v(" "),_c("option",{attrs:{value:"ID"}},[_vm._v("Indonesia")]),_vm._v(" "),_c("option",{attrs:{value:"IR"}},[_vm._v("Iran, Islamic Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"IQ"}},[_vm._v("Iraq")]),_vm._v(" "),_c("option",{attrs:{value:"IE"}},[_vm._v("Ireland")]),_vm._v(" "),_c("option",{attrs:{value:"IM"}},[_vm._v("Isle of Man")]),_vm._v(" "),_c("option",{attrs:{value:"IL"}},[_vm._v("Israel")]),_vm._v(" "),_c("option",{attrs:{value:"IT"}},[_vm._v("Italy")]),_vm._v(" "),_c("option",{attrs:{value:"JM"}},[_vm._v("Jamaica")]),_vm._v(" "),_c("option",{attrs:{value:"JP"}},[_vm._v("Japan")]),_vm._v(" "),_c("option",{attrs:{value:"JE"}},[_vm._v("Jersey")]),_vm._v(" "),_c("option",{attrs:{value:"JO"}},[_vm._v("Jordan")]),_vm._v(" "),_c("option",{attrs:{value:"KZ"}},[_vm._v("Kazakhstan")]),_vm._v(" "),_c("option",{attrs:{value:"KE"}},[_vm._v("Kenya")]),_vm._v(" "),_c("option",{attrs:{value:"KI"}},[_vm._v("Kiribati")]),_vm._v(" "),_c("option",{attrs:{value:"KP"}},[_vm._v("Korea, Democratic People's Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"KR"}},[_vm._v("Korea, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"XK"}},[_vm._v("Kosovo, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"KW"}},[_vm._v("Kuwait")]),_vm._v(" "),_c("option",{attrs:{value:"KG"}},[_vm._v("Kyrgyzstan")]),_vm._v(" "),_c("option",{attrs:{value:"LA"}},[_vm._v("Lao People's Democratic Republic")]),_vm._v(" "),_c("option",{attrs:{value:"LV"}},[_vm._v("Latvia")]),_vm._v(" "),_c("option",{attrs:{value:"LB"}},[_vm._v("Lebanon")]),_vm._v(" "),_c("option",{attrs:{value:"LS"}},[_vm._v("Lesotho")]),_vm._v(" "),_c("option",{attrs:{value:"LR"}},[_vm._v("Liberia")]),_vm._v(" "),_c("option",{attrs:{value:"LY"}},[_vm._v("Libya")]),_vm._v(" "),_c("option",{attrs:{value:"LI"}},[_vm._v("Liechtenstein")]),_vm._v(" "),_c("option",{attrs:{value:"LT"}},[_vm._v("Lithuania")]),_vm._v(" "),_c("option",{attrs:{value:"LU"}},[_vm._v("Luxembourg")]),_vm._v(" "),_c("option",{attrs:{value:"MO"}},[_vm._v("Macao")]),_vm._v(" "),_c("option",{attrs:{value:"MK"}},[_vm._v("Macedonia, the former Yugoslav Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"MG"}},[_vm._v("Madagascar")]),_vm._v(" "),_c("option",{attrs:{value:"MW"}},[_vm._v("Malawi")]),_vm._v(" "),_c("option",{attrs:{value:"MY"}},[_vm._v("Malaysia")]),_vm._v(" "),_c("option",{attrs:{value:"MV"}},[_vm._v("Maldives")]),_vm._v(" "),_c("option",{attrs:{value:"ML"}},[_vm._v("Mali")]),_vm._v(" "),_c("option",{attrs:{value:"MT"}},[_vm._v("Malta")]),_vm._v(" "),_c("option",{attrs:{value:"MH"}},[_vm._v("Marshall Islands")]),_vm._v(" "),_c("option",{attrs:{value:"MQ"}},[_vm._v("Martinique")]),_vm._v(" "),_c("option",{attrs:{value:"MR"}},[_vm._v("Mauritania")]),_vm._v(" "),_c("option",{attrs:{value:"MU"}},[_vm._v("Mauritius")]),_vm._v(" "),_c("option",{attrs:{value:"YT"}},[_vm._v("Mayotte")]),_vm._v(" "),_c("option",{attrs:{value:"MX"}},[_vm._v("Mexico")]),_vm._v(" "),_c("option",{attrs:{value:"FM"}},[_vm._v("Micronesia, Federated States of")]),_vm._v(" "),_c("option",{attrs:{value:"MD"}},[_vm._v("Moldova, Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"MC"}},[_vm._v("Monaco")]),_vm._v(" "),_c("option",{attrs:{value:"MN"}},[_vm._v("Mongolia")]),_vm._v(" "),_c("option",{attrs:{value:"ME"}},[_vm._v("Montenegro")]),_vm._v(" "),_c("option",{attrs:{value:"MS"}},[_vm._v("Montserrat")]),_vm._v(" "),_c("option",{attrs:{value:"MA"}},[_vm._v("Morocco")]),_vm._v(" "),_c("option",{attrs:{value:"MZ"}},[_vm._v("Mozambique")]),_vm._v(" "),_c("option",{attrs:{value:"MM"}},[_vm._v("Myanmar")]),_vm._v(" "),_c("option",{attrs:{value:"NA"}},[_vm._v("Namibia")]),_vm._v(" "),_c("option",{attrs:{value:"NR"}},[_vm._v("Nauru")]),_vm._v(" "),_c("option",{attrs:{value:"NP"}},[_vm._v("Nepal")]),_vm._v(" "),_c("option",{attrs:{value:"NL"}},[_vm._v("Netherlands")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("New Caledonia")]),_vm._v(" "),_c("option",{attrs:{value:"NZ"}},[_vm._v("New Zealand")]),_vm._v(" "),_c("option",{attrs:{value:"NI"}},[_vm._v("Nicaragua")]),_vm._v(" "),_c("option",{attrs:{value:"NE"}},[_vm._v("Niger")]),_vm._v(" "),_c("option",{attrs:{value:"NG"}},[_vm._v("Nigeria")]),_vm._v(" "),_c("option",{attrs:{value:"NU"}},[_vm._v("Niue")]),_vm._v(" "),_c("option",{attrs:{value:"NF"}},[_vm._v("Norfolk Island")]),_vm._v(" "),_c("option",{attrs:{value:"XI"}},[_vm._v("Northern Ireland")]),_vm._v(" "),_c("option",{attrs:{value:"MP"}},[_vm._v("Northern Mariana Islands")]),_vm._v(" "),_c("option",{attrs:{value:"NO"}},[_vm._v("Norway")]),_vm._v(" "),_c("option",{attrs:{value:"OM"}},[_vm._v("Oman")]),_vm._v(" "),_c("option",{attrs:{value:"PK"}},[_vm._v("Pakistan")]),_vm._v(" "),_c("option",{attrs:{value:"PW"}},[_vm._v("Palau")]),_vm._v(" "),_c("option",{attrs:{value:"PS"}},[_vm._v("Palestinian Territory, Occupied")]),_vm._v(" "),_c("option",{attrs:{value:"PA"}},[_vm._v("Panama")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("Papua New Guinea")]),_vm._v(" "),_c("option",{attrs:{value:"PY"}},[_vm._v("Paraguay")]),_vm._v(" "),_c("option",{attrs:{value:"PE"}},[_vm._v("Peru")]),_vm._v(" "),_c("option",{attrs:{value:"PH"}},[_vm._v("Philippines")]),_vm._v(" "),_c("option",{attrs:{value:"PN"}},[_vm._v("Pitcairn")]),_vm._v(" "),_c("option",{attrs:{value:"PL"}},[_vm._v("Poland")]),_vm._v(" "),_c("option",{attrs:{value:"PT"}},[_vm._v("Portugal")]),_vm._v(" "),_c("option",{attrs:{value:"PR"}},[_vm._v("Puerto Rico")]),_vm._v(" "),_c("option",{attrs:{value:"QA"}},[_vm._v("Qatar")]),_vm._v(" "),_c("option",{attrs:{value:"RE"}},[_vm._v("Reunion Réunion")]),_vm._v(" "),_c("option",{attrs:{value:"RO"}},[_vm._v("Romania")]),_vm._v(" "),_c("option",{attrs:{value:"RU"}},[_vm._v("Russian Federation")]),_vm._v(" "),_c("option",{attrs:{value:"RW"}},[_vm._v("Rwanda")]),_vm._v(" "),_c("option",{attrs:{value:"BL"}},[_vm._v("Saint Barthélemy")]),_vm._v(" "),_c("option",{attrs:{value:"SH"}},[_vm._v("Saint Helena")]),_vm._v(" "),_c("option",{attrs:{value:"KN"}},[_vm._v("Saint Kitts and Nevis")]),_vm._v(" "),_c("option",{attrs:{value:"LC"}},[_vm._v("Saint Lucia")]),_vm._v(" "),_c("option",{attrs:{value:"MF"}},[_vm._v("Saint Martin (French part)")]),_vm._v(" "),_c("option",{attrs:{value:"PM"}},[_vm._v("Saint Pierre and Miquelon")]),_vm._v(" "),_c("option",{attrs:{value:"VC"}},[_vm._v("Saint Vincent and the Grenadines")]),_vm._v(" "),_c("option",{attrs:{value:"WS"}},[_vm._v("Samoa")]),_vm._v(" "),_c("option",{attrs:{value:"SM"}},[_vm._v("San Marino")]),_vm._v(" "),_c("option",{attrs:{value:"ST"}},[_vm._v("Sao Tome and Principe")]),_vm._v(" "),_c("option",{attrs:{value:"SA"}},[_vm._v("Saudi Arabia")]),_vm._v(" "),_c("option",{attrs:{value:"SN"}},[_vm._v("Senegal")]),_vm._v(" "),_c("option",{attrs:{value:"RS"}},[_vm._v("Serbia")]),_vm._v(" "),_c("option",{attrs:{value:"SC"}},[_vm._v("Seychelles")]),_vm._v(" "),_c("option",{attrs:{value:"SL"}},[_vm._v("Sierra Leone")]),_vm._v(" "),_c("option",{attrs:{value:"SG"}},[_vm._v("Singapore")]),_vm._v(" "),_c("option",{attrs:{value:"SX"}},[_vm._v("Sint Maarten")]),_vm._v(" "),_c("option",{attrs:{value:"SK"}},[_vm._v("Slovakia")]),_vm._v(" "),_c("option",{attrs:{value:"SI"}},[_vm._v("Slovenia")]),_vm._v(" "),_c("option",{attrs:{value:"SB"}},[_vm._v("Solomon Islands")]),_vm._v(" "),_c("option",{attrs:{value:"SO"}},[_vm._v("Somalia")]),_vm._v(" "),_c("option",{attrs:{value:"ZA"}},[_vm._v("South Africa")]),_vm._v(" "),_c("option",{attrs:{value:"GS"}},[_vm._v("South Georgia and the South Sandwich Islands")]),_vm._v(" "),_c("option",{attrs:{value:"SS"}},[_vm._v("South Sudan")]),_vm._v(" "),_c("option",{attrs:{value:"ES"}},[_vm._v("Spain")]),_vm._v(" "),_c("option",{attrs:{value:"LK"}},[_vm._v("Sri Lanka")]),_vm._v(" "),_c("option",{attrs:{value:"SD"}},[_vm._v("Sudan")]),_vm._v(" "),_c("option",{attrs:{value:"SR"}},[_vm._v("Suriname")]),_vm._v(" "),_c("option",{attrs:{value:"SJ"}},[_vm._v("Svalbard and Jan Mayen")]),_vm._v(" "),_c("option",{attrs:{value:"SW"}},[_vm._v("Swahili")]),_vm._v(" "),_c("option",{attrs:{value:"SZ"}},[_vm._v("Swaziland")]),_vm._v(" "),_c("option",{attrs:{value:"SE"}},[_vm._v("Sweden")]),_vm._v(" "),_c("option",{attrs:{value:"CH"}},[_vm._v("Switzerland")]),_vm._v(" "),_c("option",{attrs:{value:"SY"}},[_vm._v("Syrian Arab Republic")]),_vm._v(" "),_c("option",{attrs:{value:"TW"}},[_vm._v("Taiwan, Republic of China")]),_vm._v(" "),_c("option",{attrs:{value:"TJ"}},[_vm._v("Tajikistan")]),_vm._v(" "),_c("option",{attrs:{value:"TZ"}},[_vm._v("Tanzania, United Republic of")]),_vm._v(" "),_c("option",{attrs:{value:"TH"}},[_vm._v("Thailand")]),_vm._v(" "),_c("option",{attrs:{value:"TL"}},[_vm._v("Timor-Leste")]),_vm._v(" "),_c("option",{attrs:{value:"TG"}},[_vm._v("Togo")]),_vm._v(" "),_c("option",{attrs:{value:"TK"}},[_vm._v("Tokelau")]),_vm._v(" "),_c("option",{attrs:{value:"TO"}},[_vm._v("Tonga")]),_vm._v(" "),_c("option",{attrs:{value:"TT"}},[_vm._v("Trinidad and Tobago")]),_vm._v(" "),_c("option",{attrs:{value:"TN"}},[_vm._v("Tunisia")]),_vm._v(" "),_c("option",{attrs:{value:"TR"}},[_vm._v("Turkey")]),_vm._v(" "),_c("option",{attrs:{value:"TM"}},[_vm._v("Turkmenistan")]),_vm._v(" "),_c("option",{attrs:{value:"TC"}},[_vm._v("Turks and Caicos Islands")]),_vm._v(" "),_c("option",{attrs:{value:"TV"}},[_vm._v("Tuvalu")]),_vm._v(" "),_c("option",{attrs:{value:"UG"}},[_vm._v("Uganda")]),_vm._v(" "),_c("option",{attrs:{value:"UA"}},[_vm._v("Ukraine")]),_vm._v(" "),_c("option",{attrs:{value:"AE"}},[_vm._v("United Arab Emirates")]),_vm._v(" "),_c("option",{attrs:{value:"GB"}},[_vm._v("United Kingdom")]),_vm._v(" "),_c("option",{attrs:{value:"US"}},[_vm._v("United States")]),_vm._v(" "),_c("option",{attrs:{value:"UM"}},[_vm._v("United States Minor Outlying Islands")]),_vm._v(" "),_c("option",{attrs:{value:"UY"}},[_vm._v("Uruguay")]),_vm._v(" "),_c("option",{attrs:{value:"UZ"}},[_vm._v("Uzbekistan")]),_vm._v(" "),_c("option",{attrs:{value:"VU"}},[_vm._v("Vanuatu")]),_vm._v(" "),_c("option",{attrs:{value:"VE"}},[_vm._v("Venezuela")]),_vm._v(" "),_c("option",{attrs:{value:"VN"}},[_vm._v("Viet Nam")]),_vm._v(" "),_c("option",{attrs:{value:"VG"}},[_vm._v("Virgin Islands, British")]),_vm._v(" "),_c("option",{attrs:{value:"VI"}},[_vm._v("Virgin Islands, U.S.")]),_vm._v(" "),_c("option",{attrs:{value:"WF"}},[_vm._v("Wallis and Futuna")]),_vm._v(" "),_c("option",{attrs:{value:"EH"}},[_vm._v("Western Sahara")]),_vm._v(" "),_c("option",{attrs:{value:"YE"}},[_vm._v("Yemen")]),_vm._v(" "),_c("option",{attrs:{value:"ZM"}},[_vm._v("Zambia")]),_vm._v(" "),_c("option",{attrs:{value:"ZW"}},[_vm._v("Zimbabwe")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"oci_country_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("oci_info_identifier")},model:{value:_vm.form.oci_info_identifier,callback:function callback($$v){_vm.$set(_vm.form,"oci_info_identifier",$$v);},expression:"form.oci_info_identifier"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a code")]),_vm._v(" "),_c("option",{attrs:{value:"ABI"}},[_vm._v("ABI - AWB Amount Detail Information")]),_vm._v(" "),_c("option",{attrs:{value:"ABS"}},[_vm._v("ABS - AWB Supplementary Information")]),_vm._v(" "),_c("option",{attrs:{value:"ABT"}},[_vm._v("ABT - AWB Total Amount Information")]),_vm._v(" "),_c("option",{attrs:{value:"ACC"}},[_vm._v("ACC - Accounting Information")]),_vm._v(" "),_c("option",{attrs:{value:"ACD"}},[_vm._v("ACD - AWB Consignment Details")]),_vm._v(" "),_c("option",{attrs:{value:"ACK"}},[_vm._v("ACK - Reason for Acknowledgement")]),_vm._v(" "),_c("option",{attrs:{value:"ACS"}},[_vm._v("ACS - AWB Charge Summary")]),_vm._v(" "),_c("option",{attrs:{value:"ADR"}},[_vm._v("ADR - Street Address")]),_vm._v(" "),_c("option",{attrs:{value:"AGT"}},[_vm._v("AGT - Agent")]),_vm._v(" "),_c("option",{attrs:{value:"AID"}},[_vm._v("AID - Arrival Information Details")]),_vm._v(" "),_c("option",{attrs:{value:"AIR"}},[_vm._v("AIR - Airline Header")]),_vm._v(" "),_c("option",{attrs:{value:"ALA"}},[_vm._v("ALA - Allotment Availability Information")]),_vm._v(" "),_c("option",{attrs:{value:"ALI"}},[_vm._v("ALI - Allotment Information")]),_vm._v(" "),_c("option",{attrs:{value:"ALR"}},[_vm._v("ALR - Allotment Remaining")]),_vm._v(" "),_c("option",{attrs:{value:"ALT"}},[_vm._v("ALT - Allotment Total")]),_vm._v(" "),_c("option",{attrs:{value:"AMD"}},[_vm._v("AMD - Amendment Identification")]),_vm._v(" "),_c("option",{attrs:{value:"API"}},[_vm._v("API - Air Waybill Piece Information")]),_vm._v(" "),_c("option",{attrs:{value:"ARD"}},[_vm._v("ARD - Agent Reference Data")]),_vm._v(" "),_c("option",{attrs:{value:"ARI"}},[_vm._v("ARI - AWB Recapitulation Information")]),_vm._v(" "),_c("option",{attrs:{value:"ATH"}},[_vm._v("ATH - Authorisation")]),_vm._v(" "),_c("option",{attrs:{value:"ATW"}},[_vm._v("ATW - AWB Total Weight Summary")]),_vm._v(" "),_c("option",{attrs:{value:"AUD"}},[_vm._v("AUD - Allotment Used Details")]),_vm._v(" "),_c("option",{attrs:{value:"AVS"}},[_vm._v("AVS - Availability Supplementary Details")]),_vm._v(" "),_c("option",{attrs:{value:"BGD"}},[_vm._v("BGD - Baggage Detail Information")]),_vm._v(" "),_c("option",{attrs:{value:"BGT"}},[_vm._v("BGT - Baggage Tag Identification")]),_vm._v(" "),_c("option",{attrs:{value:"BRK"}},[_vm._v("BRK - Broker")]),_vm._v(" "),_c("option",{attrs:{value:"CAI"}},[_vm._v("CAI - CCA/Adjustment Information")]),_vm._v(" "),_c("option",{attrs:{value:"CAN"}},[_vm._v("CAN - Customs Action Notification")]),_vm._v(" "),_c("option",{attrs:{value:"CAS"}},[_vm._v("CAS - CCA/Adjustment Supplementary Information")]),_vm._v(" "),_c("option",{attrs:{value:"CBD"}},[_vm._v("CBD - CASS Billing Details")]),_vm._v(" "),_c("option",{attrs:{value:"CBI"}},[_vm._v("CBI - CASS Billing Information")]),_vm._v(" "),_c("option",{attrs:{value:"CBP"}},[_vm._v("CBP - CASS Billing Period")]),_vm._v(" "),_c("option",{attrs:{value:"CBR"}},[_vm._v("CBR - Courier Baggage Receiver")]),_vm._v(" "),_c("option",{attrs:{value:"CBS"}},[_vm._v("CBS - Courier Baggage Sender")]),_vm._v(" "),_c("option",{attrs:{value:"CBV"}},[_vm._v("CBV - Courier Baggage Voucher Identification")]),_vm._v(" "),_c("option",{attrs:{value:"CCD"}},[_vm._v("CCD - Consignment Control Details")]),_vm._v(" "),_c("option",{attrs:{value:"CCL"}},[_vm._v("CCL - Cargo Control Location")]),_vm._v(" "),_c("option",{attrs:{value:"CDC"}},[_vm._v("CDC - CC Charges in Destination Currency")]),_vm._v(" "),_c("option",{attrs:{value:"CDI"}},[_vm._v("CDI - Charge Declarations")]),_vm._v(" "),_c("option",{attrs:{value:"CER"}},[_vm._v("CER - AWB Content Certification")]),_vm._v(" "),_c("option",{attrs:{value:"CID"}},[_vm._v("CID - Correction Identification")]),_vm._v(" "),_c("option",{attrs:{value:"CIH"}},[_vm._v("CIH - CASS Invoice Header Details")]),_vm._v(" "),_c("option",{attrs:{value:"CIN"}},[_vm._v("CIN - CASS Identification Number")]),_vm._v(" "),_c("option",{attrs:{value:"CMI"}},[_vm._v("CMI - Consignment Onward Movement Information")]),_vm._v(" "),_c("option",{attrs:{value:"CND"}},[_vm._v("CND - Customs Notification Details")]),_vm._v(" "),_c("option",{attrs:{value:"CNE"}},[_vm._v("CNE - Consignee")]),_vm._v(" "),_c("option",{attrs:{value:"COI"}},[_vm._v("COI - Commission Information")]),_vm._v(" "),_c("option",{attrs:{value:"COL"}},[_vm._v("COL - Collect Charge Summary")]),_vm._v(" "),_c("option",{attrs:{value:"COM"}},[_vm._v("COM - Embargoed Commodities")]),_vm._v(" "),_c("option",{attrs:{value:"COR"}},[_vm._v("COR - Customs Origin")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("CRD - Carrier Reference Data")]),_vm._v(" "),_c("option",{attrs:{value:"CRR"}},[_vm._v("CRR - Embargo Carriage Restrictions")]),_vm._v(" "),_c("option",{attrs:{value:"CTI"}},[_vm._v("CTI - CCA/Adjustment Total Information")]),_vm._v(" "),_c("option",{attrs:{value:"CTW"}},[_vm._v("CTW - CCA/Adjustment Total Weight Summary")]),_vm._v(" "),_c("option",{attrs:{value:"CUR"}},[_vm._v("CUR - Currency Details")]),_vm._v(" "),_c("option",{attrs:{value:"CUS"}},[_vm._v("CUS - Customer Identification")]),_vm._v(" "),_c("option",{attrs:{value:"CVD"}},[_vm._v("CVD - Charge Declarations")]),_vm._v(" "),_c("option",{attrs:{value:"CWI"}},[_vm._v("CWI - CASS AWB Information")]),_vm._v(" "),_c("option",{attrs:{value:"DAI"}},[_vm._v("DAI - DGD Additional Handling Information")]),_vm._v(" "),_c("option",{attrs:{value:"DAP"}},[_vm._v("DAP - DGD “All Packed in One” Indication")]),_vm._v(" "),_c("option",{attrs:{value:"DAT"}},[_vm._v("DAT - DGD “All Packed in One” Total")]),_vm._v(" "),_c("option",{attrs:{value:"DAU"}},[_vm._v("DAU - DGD Item Authorisation")]),_vm._v(" "),_c("option",{attrs:{value:"DCI"}},[_vm._v("DCI - DGD Emergency Contact Information")]),_vm._v(" "),_c("option",{attrs:{value:"DCL"}},[_vm._v("DCL - Declarant")]),_vm._v(" "),_c("option",{attrs:{value:"DES"}},[_vm._v("DES - Despatch Information")]),_vm._v(" "),_c("option",{attrs:{value:"DHD"}},[_vm._v("DHD - DGD Header Details")]),_vm._v(" "),_c("option",{attrs:{value:"DII"}},[_vm._v("DII - DGD Item Information")]),_vm._v(" "),_c("option",{attrs:{value:"DIM"}},[_vm._v("DIM - Dimensions Information")]),_vm._v(" "),_c("option",{attrs:{value:"DNR"}},[_vm._v("DNR - DGD Item Number")]),_vm._v(" "),_c("option",{attrs:{value:"DOC"}},[_vm._v("DOC - Documentation Identification")]),_vm._v(" "),_c("option",{attrs:{value:"DOS"}},[_vm._v("DOS - DGD Overpack Summary")]),_vm._v(" "),_c("option",{attrs:{value:"DPI"}},[_vm._v("DPI - DGD Item Packing Group and Instructions")]),_vm._v(" "),_c("option",{attrs:{value:"DQP"}},[_vm._v("DQP - DGD Item Quantity and Type of Packing")]),_vm._v(" "),_c("option",{attrs:{value:"DRA"}},[_vm._v("DRA - DGD Radioactive Activity Information")]),_vm._v(" "),_c("option",{attrs:{value:"DRC"}},[_vm._v("DRC - DGD Radioactive Consignment Information")]),_vm._v(" "),_c("option",{attrs:{value:"DRP"}},[_vm._v("DRP - DGD Radioactive Packing Instructions")]),_vm._v(" "),_c("option",{attrs:{value:"DSN"}},[_vm._v("DSN - DGD Item Shipping Name")]),_vm._v(" "),_c("option",{attrs:{value:"DSU"}},[_vm._v("DSU - DGD Signatory Details")]),_vm._v(" "),_c("option",{attrs:{value:"DTN"}},[_vm._v("DTN - Date/Time of Notification")]),_vm._v(" "),_c("option",{attrs:{value:"EIC"}},[_vm._v("EIC - Empty Equipment in Compartment Information")]),_vm._v(" "),_c("option",{attrs:{value:"EXP"}},[_vm._v("EXP - Export")]),_vm._v(" "),_c("option",{attrs:{value:"FLT"}},[_vm._v("FLT - Flight Booking")]),_vm._v(" "),_c("option",{attrs:{value:"FLT"}},[_vm._v("FLT - Flight Information")]),_vm._v(" "),_c("option",{attrs:{value:"GRI"}},[_vm._v("GRI - Grand AWB Recapitulation Information")]),_vm._v(" "),_c("option",{attrs:{value:"GTI"}},[_vm._v("GTI - Grand Total Information")]),_vm._v(" "),_c("option",{attrs:{value:"HAH"}},[_vm._v("HAH - HWB Agent’s Head Office")]),_vm._v(" "),_c("option",{attrs:{value:"HBS"}},[_vm._v("HBS - House Waybill Summary Details")]),_vm._v(" "),_c("option",{attrs:{value:"HCD"}},[_vm._v("HCD - HWB Consignment Details")]),_vm._v(" "),_c("option",{attrs:{value:"HDL"}},[_vm._v("HDL - Handling Details")]),_vm._v(" "),_c("option",{attrs:{value:"HLC"}},[_vm._v("HLC - HWB Letter of Credit Details")]),_vm._v(" "),_c("option",{attrs:{value:"HPI"}},[_vm._v("HPI - House Waybill Piece Information")]),_vm._v(" "),_c("option",{attrs:{value:"HTS"}},[_vm._v("HTS - Harmonised Tariff Schedule Information")]),_vm._v(" "),_c("option",{attrs:{value:"HWB"}},[_vm._v("HWB - House Waybill")]),_vm._v(" "),_c("option",{attrs:{value:"IMP"}},[_vm._v("IMP - Import")]),_vm._v(" "),_c("option",{attrs:{value:"ISS"}},[_vm._v("ISS - The Regulated Agent Issuing the Security Status for a Consignment")]),_vm._v(" "),_c("option",{attrs:{value:"ISU"}},[_vm._v("ISU - AWB Issue Details")]),_vm._v(" "),_c("option",{attrs:{value:"ITA"}},[_vm._v("ITA - Invoice Total Amount Information")]),_vm._v(" "),_c("option",{attrs:{value:"ITW"}},[_vm._v("ITW - Invoice Total Weight Summary")]),_vm._v(" "),_c("option",{attrs:{value:"JST"}},[_vm._v("JST - Embargo Justification")]),_vm._v(" "),_c("option",{attrs:{value:"LOC"}},[_vm._v("LOC - Location")]),_vm._v(" "),_c("option",{attrs:{value:"MAL"}},[_vm._v("MAL - Mail")]),_vm._v(" "),_c("option",{attrs:{value:"MAT"}},[_vm._v("MAT - Message Advice Type")]),_vm._v(" "),_c("option",{attrs:{value:"MBI"}},[_vm._v("MBI - Master Waybill Identification")]),_vm._v(" "),_c("option",{attrs:{value:"MCH"}},[_vm._v("MCH - Mail Consignment Header")]),_vm._v(" "),_c("option",{attrs:{value:"MCT"}},[_vm._v("MCT - Mail Consignment Total")]),_vm._v(" "),_c("option",{attrs:{value:"MHU"}},[_vm._v("MHU - Mail Handling Unit")]),_vm._v(" "),_c("option",{attrs:{value:"MID"}},[_vm._v("MID - Mail Inbound Data")]),_vm._v(" "),_c("option",{attrs:{value:"MLI"}},[_vm._v("MLI - Mail Label Identification")]),_vm._v(" "),_c("option",{attrs:{value:"MOD"}},[_vm._v("MOD - Mail Outbound Data")]),_vm._v(" "),_c("option",{attrs:{value:"MPI"}},[_vm._v("MPI - Movement Priority Information")]),_vm._v(" "),_c("option",{attrs:{value:"MSD"}},[_vm._v("MSD - Mail Status Details")]),_vm._v(" "),_c("option",{attrs:{value:"MSU"}},[_vm._v("MSU - Message Sequence and ULD Origin")]),_vm._v(" "),_c("option",{attrs:{value:"MUD"}},[_vm._v("MUD - Mail ULD Information")]),_vm._v(" "),_c("option",{attrs:{value:"NAM"}},[_vm._v("NAM - Name")]),_vm._v(" "),_c("option",{attrs:{value:"NBI"}},[_vm._v("NBI - Net Billing Information")]),_vm._v(" "),_c("option",{attrs:{value:"NEW"}},[_vm._v("NEW - New Information")]),_vm._v(" "),_c("option",{attrs:{value:"NFY"}},[_vm._v("NFY - Also Notify")]),_vm._v(" "),_c("option",{attrs:{value:"NFY"}},[_vm._v("NFY - Notify Name and Address")]),_vm._v(" "),_c("option",{attrs:{value:"NNS"}},[_vm._v("NNS - Net/Net Sales")]),_vm._v(" "),_c("option",{attrs:{value:"NOM"}},[_vm._v("NOM - Nominated Handling Party")]),_vm._v(" "),_c("option",{attrs:{value:"OCI"}},[_vm._v("OCI - Other Customs, Security and Regulatory Control Information")]),_vm._v(" "),_c("option",{attrs:{value:"OLD"}},[_vm._v("OLD - Original Information")]),_vm._v(" "),_c("option",{attrs:{value:"OPI"}},[_vm._v("OPI - Other Participant Information")]),_vm._v(" "),_c("option",{attrs:{value:"OSI"}},[_vm._v("OSI - Other Service Information")]),_vm._v(" "),_c("option",{attrs:{value:"OSS"}},[_vm._v("OSS - The Regulated Agent Accepting the Security Status for a Consignment Issued by Another RA")]),_vm._v(" "),_c("option",{attrs:{value:"OTH"}},[_vm._v("OTH - Other Charges")]),_vm._v(" "),_c("option",{attrs:{value:"PAS"}},[_vm._v("PAS - Passenger Information")]),_vm._v(" "),_c("option",{attrs:{value:"PID"}},[_vm._v("PID - Product Information")]),_vm._v(" "),_c("option",{attrs:{value:"PPD"}},[_vm._v("PPD - Prepaid Charge Summary")]),_vm._v(" "),_c("option",{attrs:{value:"PRD"}},[_vm._v("PRD - Planning Request Details")]),_vm._v(" "),_c("option",{attrs:{value:"RCI"}},[_vm._v("RCI - Recapitulation Amount Information")]),_vm._v(" "),_c("option",{attrs:{value:"REC"}},[_vm._v("REC - Receptacle Information")]),_vm._v(" "),_c("option",{attrs:{value:"REF"}},[_vm._v("REF - References")]),_vm._v(" "),_c("option",{attrs:{value:"RID"}},[_vm._v("RID - Rate Information Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"RIH"}},[_vm._v("RIH - Rate Information Answer Header")]),_vm._v(" "),_c("option",{attrs:{value:"RIR"}},[_vm._v("RIR - Rate Information Request Details")]),_vm._v(" "),_c("option",{attrs:{value:"RQD"}},[_vm._v("RQD - Charge Calculation Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"RQH"}},[_vm._v("RQH - Charge Calculation Request Header")]),_vm._v(" "),_c("option",{attrs:{value:"RQT"}},[_vm._v("RQT - Charge Calculation Answer Totals")]),_vm._v(" "),_c("option",{attrs:{value:"RQU"}},[_vm._v("RQU - Charge Calculation Request — ULD")]),_vm._v(" "),_c("option",{attrs:{value:"RQV"}},[_vm._v("RQV - Charge Calculation Request — Volume")]),_vm._v(" "),_c("option",{attrs:{value:"RTD"}},[_vm._v("RTD - Rate Description")]),_vm._v(" "),_c("option",{attrs:{value:"RTG"}},[_vm._v("RTG - Routing")]),_vm._v(" "),_c("option",{attrs:{value:"RTI"}},[_vm._v("RTI - Recapitulation Total Information")]),_vm._v(" "),_c("option",{attrs:{value:"RTS"}},[_vm._v("RTS - Embargo Routes/Areas")]),_vm._v(" "),_c("option",{attrs:{value:"SAA"}},[_vm._v("SAA - Schedule and Availability Information Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"SAR"}},[_vm._v("SAR - Schedule and Availability Information Request Details")]),_vm._v(" "),_c("option",{attrs:{value:"SCI"}},[_vm._v("SCI - Special Customs Information")]),_vm._v(" "),_c("option",{attrs:{value:"SCS"}},[_vm._v("SCS - Surface Charge Summary")]),_vm._v(" "),_c("option",{attrs:{value:"SDI"}},[_vm._v("SDI - Surface Delivery Information")]),_vm._v(" "),_c("option",{attrs:{value:"SHP"}},[_vm._v("SHP - Shipper")]),_vm._v(" "),_c("option",{attrs:{value:"SII"}},[_vm._v("SII - Sales Incentive Information")]),_vm._v(" "),_c("option",{attrs:{value:"SKH"}},[_vm._v("SKH - Schedule Information Answer Header")]),_vm._v(" "),_c("option",{attrs:{value:"SLC"}},[_vm._v("SLC - Status List Criteria")]),_vm._v(" "),_c("option",{attrs:{value:"SPH"}},[_vm._v("SPH - Special Handling Details")]),_vm._v(" "),_c("option",{attrs:{value:"SPI"}},[_vm._v("SPI - Surface Pickup Information")]),_vm._v(" "),_c("option",{attrs:{value:"SRA"}},[_vm._v("SRA - Supplementary Rate Information Answer Details")]),_vm._v(" "),_c("option",{attrs:{value:"SRI"}},[_vm._v("SRI - Shipment Reference Information")]),_vm._v(" "),_c("option",{attrs:{value:"SRR"}},[_vm._v("SRR - Supplementary Rate Information Request Details")]),_vm._v(" "),_c("option",{attrs:{value:"SSI"}},[_vm._v("SSI - Supplementary Status Information")]),_vm._v(" "),_c("option",{attrs:{value:"SSR"}},[_vm._v("SSR - Special Service Request")]),_vm._v(" "),_c("option",{attrs:{value:"STI"}},[_vm._v("STI - Storage Information")]),_vm._v(" "),_c("option",{attrs:{value:"STS"}},[_vm._v("STS - Status Details")]),_vm._v(" "),_c("option",{attrs:{value:"SVA"}},[_vm._v("SVA - Surface Vehicle Arrival Information")]),_vm._v(" "),_c("option",{attrs:{value:"SVD"}},[_vm._v("SVD - Surface Vehicle Departure Information")]),_vm._v(" "),_c("option",{attrs:{value:"SVL"}},[_vm._v("SVL - Surface Vehicle Delay Information")]),_vm._v(" "),_c("option",{attrs:{value:"SVN"}},[_vm._v("SVN - Surface Vehicle Next Information")]),_vm._v(" "),_c("option",{attrs:{value:"TAR"}},[_vm._v("TAR - Total AWB Recapitulation Information")]),_vm._v(" "),_c("option",{attrs:{value:"TCC"}},[_vm._v("TCC - Total Collect Charges")]),_vm._v(" "),_c("option",{attrs:{value:"TID"}},[_vm._v("TID - Terminal Identification")]),_vm._v(" "),_c("option",{attrs:{value:"TOT"}},[_vm._v("TOT - Total Amount")]),_vm._v(" "),_c("option",{attrs:{value:"TRA"}},[_vm._v("TRA - Transit")]),_vm._v(" "),_c("option",{attrs:{value:"TRN"}},[_vm._v("TRN - Transfer/Transit Information")]),_vm._v(" "),_c("option",{attrs:{value:"TXS"}},[_vm._v("TXS - Tax Summary")]),_vm._v(" "),_c("option",{attrs:{value:"TXT"}},[_vm._v("TXT - Free Text Description")]),_vm._v(" "),_c("option",{attrs:{value:"UCI"}},[_vm._v("UCI - ULD Connection Information")]),_vm._v(" "),_c("option",{attrs:{value:"UDI"}},[_vm._v("UDI - ULD Destination Information")]),_vm._v(" "),_c("option",{attrs:{value:"UII"}},[_vm._v("UII - ULD Inclusion Information")]),_vm._v(" "),_c("option",{attrs:{value:"ULD"}},[_vm._v("ULD - ULD Description")]),_vm._v(" "),_c("option",{attrs:{value:"UMI"}},[_vm._v("UMI - ULD Movement Information")]),_vm._v(" "),_c("option",{attrs:{value:"UPI"}},[_vm._v("UPI - Unique Piece Information")]),_vm._v(" "),_c("option",{attrs:{value:"VCD"}},[_vm._v("VCD - Void/Cancel Details")]),_vm._v(" "),_c("option",{attrs:{value:"VOD"}},[_vm._v("VOD - Vehicle Operator Details")]),_vm._v(" "),_c("option",{attrs:{value:"WBD"}},[_vm._v("WBD - Waybill Details")]),_vm._v(" "),_c("option",{attrs:{value:"WBH"}},[_vm._v("WBH - Waybill Header Details")]),_vm._v(" "),_c("option",{attrs:{value:"WBI"}},[_vm._v("WBI - Waybill Information")]),_vm._v(" "),_c("option",{attrs:{value:"WBL"}},[_vm._v("WBL - Waybill Details")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"oci_info_identifier"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"350px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("oci_custom_info_identifier")},model:{value:_vm.form.oci_custom_info_identifier,callback:function callback($$v){_vm.$set(_vm.form,"oci_custom_info_identifier",$$v);},expression:"form.oci_custom_info_identifier"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select a code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Automated Broker Interface (ABI) Filer Code")]),_vm._v(" "),_c("option",{attrs:{value:"AC"}},[_vm._v("AC - Account Consignor (consignor for all cargo aircraft)")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Certificate Number")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("CP - Contact Person")]),_vm._v(" "),_c("option",{attrs:{value:"CT"}},[_vm._v("CT- Contact Telephone Number")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Dangerous Goods")]),_vm._v(" "),_c("option",{attrs:{value:"DI"}},[_vm._v("DI - Declaration Identification")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Authorised Economic Operator")]),_vm._v(" "),_c("option",{attrs:{value:"ED"}},[_vm._v("ED - Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Facilities Information and Resource Management")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Item Number")]),_vm._v(" "),_c("option",{attrs:{value:"KC"}},[_vm._v("KC - Known Consignor")]),_vm._v(" "),_c("option",{attrs:{value:"L"}},[_vm._v("L - Exemption Legend")]),_vm._v(" "),_c("option",{attrs:{value:"LI"}},[_vm._v("LI - License Identification")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("M - Movement Reference Number")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("N - Seal Number")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Packing List Number")]),_vm._v(" "),_c("option",{attrs:{value:"RA"}},[_vm._v("RA - Regulated Agent")]),_vm._v(" "),_c("option",{attrs:{value:"RC"}},[_vm._v("RC - Regulated Carrier")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - System Downtime Reference")]),_vm._v(" "),_c("option",{attrs:{value:"SD"}},[_vm._v("SD - Security Status Date & Time")]),_vm._v(" "),_c("option",{attrs:{value:"SM"}},[_vm._v("SM - Screening Method")]),_vm._v(" "),_c("option",{attrs:{value:"SN"}},[_vm._v("SN - Security Status Name of Issuer")]),_vm._v(" "),_c("option",{attrs:{value:"SS"}},[_vm._v("SS - Security Status")]),_vm._v(" "),_c("option",{attrs:{value:"ST"}},[_vm._v("ST - Security Textual Statement")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Trader Identification Number")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v("U - Unique Consignment Reference Number")]),_vm._v(" "),_c("option",{attrs:{value:"V"}},[_vm._v("V - Invoice Number")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"oci_custom_info_identifier"}})],1)],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell px-5"},[_vm._v("Supplementary Information: ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell px-4"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.oci_supplementary_info,expression:"form.oci_supplementary_info"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("oci_custom_info_identifier")},staticStyle:{width:"330px"},attrs:{type:"text"},domProps:{value:_vm.form.oci_supplementary_info},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form,"oci_supplementary_info",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"oci_supplementary_info"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"}),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2"},[_c("input",{staticClass:"form-control pb-1",staticStyle:{width:"100px","font-size":"12px","font-weight":"bold"},attrs:{type:"button",value:"Add"},on:{click:_vm.addOtherCustomInfo}})])])])]),_vm._v(" "),_c("div",{staticClass:"mt-5 mb-5 pt-1 pb-1 px-4"},[_c("table",{staticClass:"table table-sm",staticStyle:{width:"100%"}},[_c("tbody",[_c("tr",[_c("th",{staticClass:"h_background_color",staticStyle:{width:"100%","max-width":"100%"}},[_vm._v("Other Customs Information")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th"),_vm._v(" "),_c("th"),_vm._v(" "),_c("th"),_vm._v(" "),_c("th")]),_vm._v(" "),_vm._l(_vm.oci_entries,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.oci_country_code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.oci_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.oci_custom_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.oci_supplementary_info))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editOciInfo(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteOciInfo(index);}}})],1)]);})],2)])])])]),_vm._v(" "),_c("b-tab",{staticStyle:{"background-color":"white !important"},attrs:{title:"Other Customs Information Segment"}},[_c("div",{staticClass:"h_background_color mt-5 mb-5 pt-1 pb-1 px-4"},[_c("h5",{},[_vm._v("Other Customs Information Segment")])]),_vm._v(" "),_c("div",{staticClass:"py-7 px-3 d-flex align-items-end"},[_c("b-form-textarea",{staticStyle:{width:"70% !important"},attrs:{id:"textarea",rows:"3","max-rows":"6"}}),_vm._v(" "),_c("b-button",{staticClass:"ml-2"},[_vm._v("Upload")])],1)])],1),_vm._v(" "),_c("div",{staticClass:"h_background_color mt-5 mb-5 pt-1 pb-1 px-4"},[_vm._v("Other Customs Information")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{staticClass:"text-right",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-horizontal",label:"Email PDF copy To:"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"320px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticClass:"text-left ml-4",attrs:{size:"sm"}},[_vm._v("Including Cargo Label")]),_vm._v(" "),_c("p",[_vm._v("(separate addresses with a semicolon ';')")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("div",{staticClass:"d-flex justify-content-end"},[_c("b-button",{staticClass:"mr-2"},[_vm._v("Generate PDF")]),_vm._v(" "),_c("b-button",{staticClass:"mr-2"},[_vm._v("Send")]),_vm._v(" "),_c("b-button",{staticClass:"mr-2"},[_vm._v("Send & Clear")]),_vm._v(" "),_c("b-button",{attrs:{type:"submit"}},[_vm._v("Save Draft")])],1)])],1)])])],2);};var staticRenderFns=[function(){var _vm=this,_c=_vm._self._c;return _c("div",{staticClass:"container h_background_color text-white pt-2 pb-2"},[_c("h4",[_vm._v(" Create Master Air Waybill(e-AWB)\n                "),_c("span",{staticClass:"float-right"},[_vm._v("New")])])]);},function(){var _vm=this,_c=_vm._self._c;return _c("thead",[_c("tr",{staticClass:"h_background_color",staticStyle:{"font-size":"10px"}},[_c("th",{staticClass:"form-control1"},[_vm._v("Pcs.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Description")]),_vm._v("Srv. Code"),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Com. Itm.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Gross Wgt.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Chrg. Wgt.")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Rate")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Detailed Pcs. Info")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Vol")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Rate Class")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("UID Rate Class")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Charge")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("HS Code")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Origin Country")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("UID information")]),_vm._v(" "),_c("th",{staticClass:"form-control1"},[_vm._v("Slac")]),_vm._v(" "),_c("th",{staticClass:"form-control1"})])]);}];render._withStripped=true;

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue2-datepicker/index.css":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue2-datepicker/index.css ***!
  \********************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".mx-icon-left:before,.mx-icon-right:before,.mx-icon-double-left:before,.mx-icon-double-right:before,.mx-icon-double-left:after,.mx-icon-double-right:after{content:\"\";position:relative;top:-1px;display:inline-block;width:10px;height:10px;vertical-align:middle;border-style:solid;border-color:currentColor;border-width:2px 0 0 2px;border-radius:1px;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transform-origin:center;transform-origin:center;-webkit-transform:rotate(-45deg) scale(0.7);transform:rotate(-45deg) scale(0.7)}.mx-icon-double-left:after{left:-4px}.mx-icon-double-right:before{left:4px}.mx-icon-right:before,.mx-icon-double-right:before,.mx-icon-double-right:after{-webkit-transform:rotate(135deg) scale(0.7);transform:rotate(135deg) scale(0.7)}.mx-btn{-webkit-box-sizing:border-box;box-sizing:border-box;line-height:1;font-size:14px;font-weight:500;padding:7px 15px;margin:0;cursor:pointer;background-color:transparent;outline:none;border:1px solid rgba(0,0,0,.1);border-radius:4px;color:#73879c;white-space:nowrap}.mx-btn:hover{border-color:#1284e7;color:#1284e7}.mx-btn:disabled,.mx-btn.disabled{color:#ccc;cursor:not-allowed}.mx-btn-text{border:0;padding:0 4px;text-align:left;line-height:inherit}.mx-scrollbar{height:100%}.mx-scrollbar:hover .mx-scrollbar-track{opacity:1}.mx-scrollbar-wrap{height:100%;overflow-x:hidden;overflow-y:auto}.mx-scrollbar-track{position:absolute;top:2px;right:2px;bottom:2px;width:6px;z-index:1;border-radius:4px;opacity:0;-webkit-transition:opacity .24s ease-out;transition:opacity .24s ease-out}.mx-scrollbar-track .mx-scrollbar-thumb{position:absolute;width:100%;height:0;cursor:pointer;border-radius:inherit;background-color:rgba(144,147,153,.3);-webkit-transition:background-color .3s;transition:background-color .3s}.mx-zoom-in-down-enter-active,.mx-zoom-in-down-leave-active{opacity:1;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transition:opacity .3s cubic-bezier(0.23, 1, 0.32, 1),-webkit-transform .3s cubic-bezier(0.23, 1, 0.32, 1);transition:opacity .3s cubic-bezier(0.23, 1, 0.32, 1),-webkit-transform .3s cubic-bezier(0.23, 1, 0.32, 1);transition:transform .3s cubic-bezier(0.23, 1, 0.32, 1),opacity .3s cubic-bezier(0.23, 1, 0.32, 1);transition:transform .3s cubic-bezier(0.23, 1, 0.32, 1),opacity .3s cubic-bezier(0.23, 1, 0.32, 1),-webkit-transform .3s cubic-bezier(0.23, 1, 0.32, 1);-webkit-transform-origin:center top;transform-origin:center top}.mx-zoom-in-down-enter,.mx-zoom-in-down-enter-from,.mx-zoom-in-down-leave-to{opacity:0;-webkit-transform:scaleY(0);transform:scaleY(0)}.mx-datepicker{position:relative;display:inline-block;width:210px}.mx-datepicker svg{width:1em;height:1em;vertical-align:-0.15em;fill:currentColor;overflow:hidden}.mx-datepicker-range{width:320px}.mx-datepicker-inline{width:auto}.mx-input-wrapper{position:relative}.mx-input{display:inline-block;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;height:34px;padding:6px 30px;padding-left:10px;font-size:14px;line-height:1.4;color:#555;background-color:#fff;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075);box-shadow:inset 0 1px 1px rgba(0,0,0,.075)}.mx-input:hover,.mx-input:focus{border-color:#409aff}.mx-input:disabled,.mx-input.disabled{color:#ccc;background-color:#f3f3f3;border-color:#ccc;cursor:not-allowed}.mx-input:focus{outline:none}.mx-input::-ms-clear{display:none}.mx-icon-calendar,.mx-icon-clear{position:absolute;top:50%;right:8px;-webkit-transform:translateY(-50%);transform:translateY(-50%);font-size:16px;line-height:1;color:rgba(0,0,0,.5);vertical-align:middle}.mx-icon-clear{cursor:pointer}.mx-icon-clear:hover{color:rgba(0,0,0,.8)}.mx-datepicker-main{font:14px/1.5 \"Helvetica Neue\",Helvetica,Arial,\"Microsoft Yahei\",sans-serif;color:#73879c;background-color:#fff;border:1px solid #e8e8e8}.mx-datepicker-popup{position:absolute;margin-top:1px;margin-bottom:1px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175);z-index:2001}.mx-datepicker-sidebar{float:left;-webkit-box-sizing:border-box;box-sizing:border-box;width:100px;padding:6px;overflow:auto}.mx-datepicker-sidebar+.mx-datepicker-content{margin-left:100px;border-left:1px solid #e8e8e8}.mx-datepicker-body{position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mx-btn-shortcut{display:block;padding:0 6px;line-height:24px}.mx-range-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex}@media(max-width: 750px){.mx-range-wrapper{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}}.mx-datepicker-header{padding:6px 8px;border-bottom:1px solid #e8e8e8}.mx-datepicker-footer{padding:6px 8px;text-align:right;border-top:1px solid #e8e8e8}.mx-calendar{-webkit-box-sizing:border-box;box-sizing:border-box;width:248px;padding:6px 12px}.mx-calendar+.mx-calendar{border-left:1px solid #e8e8e8}.mx-calendar-header,.mx-time-header{-webkit-box-sizing:border-box;box-sizing:border-box;height:34px;line-height:34px;text-align:center;overflow:hidden}.mx-btn-icon-left,.mx-btn-icon-double-left{float:left}.mx-btn-icon-right,.mx-btn-icon-double-right{float:right}.mx-calendar-header-label{font-size:14px}.mx-calendar-decade-separator{margin:0 2px}.mx-calendar-decade-separator:after{content:\"~\"}.mx-calendar-content{position:relative;height:224px;-webkit-box-sizing:border-box;box-sizing:border-box}.mx-calendar-content .cell{cursor:pointer}.mx-calendar-content .cell:hover{color:#73879c;background-color:#f3f9fe}.mx-calendar-content .cell.active{color:#fff;background-color:#1284e7}.mx-calendar-content .cell.in-range,.mx-calendar-content .cell.hover-in-range{color:#73879c;background-color:#dbedfb}.mx-calendar-content .cell.disabled{cursor:not-allowed;color:#ccc;background-color:#f3f3f3}.mx-calendar-week-mode .mx-date-row{cursor:pointer}.mx-calendar-week-mode .mx-date-row:hover{background-color:#f3f9fe}.mx-calendar-week-mode .mx-date-row.mx-active-week{background-color:#dbedfb}.mx-calendar-week-mode .mx-date-row .cell:hover{color:inherit;background-color:transparent}.mx-calendar-week-mode .mx-date-row .cell.active{color:inherit;background-color:transparent}.mx-week-number{opacity:.5}.mx-table{table-layout:fixed;border-collapse:separate;border-spacing:0;width:100%;height:100%;-webkit-box-sizing:border-box;box-sizing:border-box;text-align:center}.mx-table th{padding:0;font-weight:500;vertical-align:middle}.mx-table td{padding:0;vertical-align:middle}.mx-table-date td,.mx-table-date th{height:32px;font-size:12px}.mx-table-date .today{color:#2a90e9}.mx-table-date .cell.not-current-month{color:#ccc;background:none}.mx-time{-webkit-box-flex:1;-ms-flex:1;flex:1;width:224px;background:#fff}.mx-time+.mx-time{border-left:1px solid #e8e8e8}.mx-calendar-time{position:absolute;top:0;left:0;width:100%;height:100%}.mx-time-header{border-bottom:1px solid #e8e8e8}.mx-time-content{height:224px;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.mx-time-columns{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;height:100%;overflow:hidden}.mx-time-column{-webkit-box-flex:1;-ms-flex:1;flex:1;position:relative;border-left:1px solid #e8e8e8;text-align:center}.mx-time-column:first-child{border-left:0}.mx-time-column .mx-time-list{margin:0;padding:0;list-style:none}.mx-time-column .mx-time-list::after{content:\"\";display:block;height:192px}.mx-time-column .mx-time-item{cursor:pointer;font-size:12px;height:32px;line-height:32px}.mx-time-column .mx-time-item:hover{color:#73879c;background-color:#f3f9fe}.mx-time-column .mx-time-item.active{color:#1284e7;background-color:transparent;font-weight:700}.mx-time-column .mx-time-item.disabled{cursor:not-allowed;color:#ccc;background-color:#f3f3f3}.mx-time-option{cursor:pointer;padding:8px 10px;font-size:14px;line-height:20px}.mx-time-option:hover{color:#73879c;background-color:#f3f9fe}.mx-time-option.active{color:#1284e7;background-color:transparent;font-weight:700}.mx-time-option.disabled{cursor:not-allowed;color:#ccc;background-color:#f3f3f3}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\nheader[data-v-18ebb6e4] {\r\n    width: 100%;\r\n    background-color: #2637a8;\n}\n.h-color[data-v-18ebb6e4] {\r\n    color: #2637a8;\n}\n.h_background_color[data-v-18ebb6e4] {\r\n    background-color: #2637a8;\r\n    color: white;\n}\n#nav[data-v-18ebb6e4] {\r\n    display: flex;\r\n    /* align-items: center;\r\n    justify-content: center; */\r\n    width: 100%;\r\n    max-width: 1280px;\r\n    /* margin: 0 auto; */\n}\n#nav > ul[data-v-18ebb6e4] {\r\n    display: flex;\r\n    margin: 0;\r\n    padding: 0;\r\n    list-style-type: none;\n}\n#nav > ul > li[data-v-18ebb6e4]:hover {\r\n    background-color: gray;\n}\n#nav > ul > li > span[data-v-18ebb6e4]:after {\r\n    display: inline-block;\n}\n#nav > ul > li > a[data-v-18ebb6e4] {\r\n    display: block;\r\n    height: auto;\r\n    padding: 3px;\r\n    color: #fff;\r\n    text-decoration: none;\n}\n#nav > ul > li > span[data-v-18ebb6e4] {\r\n    position: relative;\r\n    display: block;\r\n    height: auto;\r\n    padding: 3px;\r\n    color: #fff;\r\n    text-decoration: none;\r\n    cursor: pointer;\n}\nli[data-v-18ebb6e4] {\r\n    border-right: 1px solid white;\n}\n#nav > ul > li > span[data-v-18ebb6e4]:after {\r\n    /* content: '▼'; */\r\n    display: inline-block;\n}\n.dropdown[data-v-18ebb6e4] {\r\n    position: absolute;\r\n    top: 100%;\r\n    left: 0;\r\n    display: none;\r\n    padding: 0;\r\n    list-style-type: none;\r\n    background-color: gray;\n}\n.dropdown li[data-v-18ebb6e4] {\r\n    /* width: 250px; */\r\n    width: 150px;\r\n    border-bottom: 1px solid #fff;\n}\n.dropdown li a[data-v-18ebb6e4] {\r\n    display: block;\r\n    /* padding: 10px; */\r\n    padding-left: 5px;\r\n    color: #fff;\r\n    text-decoration: none;\n}\n.isOpen[data-v-18ebb6e4] {\r\n    display: block;\n}\n.custom-btn[data-v-18ebb6e4] {\r\n    transition: background-color 0.3s;\n}\r\n\r\n/* #show-btn:hover {\r\n  background-color: #007bff;\r\n} */\n.custom-btn[data-v-18ebb6e4]:hover {\r\n    background-color: #007bff !important;\r\n    color: white !important;\n}\n.form-group[data-v-18ebb6e4] {\r\n    margin-bottom: 10px !important;\n}\n.form-control-sm[data-v-18ebb6e4] {\r\n    height: calc(1.5em + 0.5rem + 2px) !important;\n}\n.col-form-label[data-v-18ebb6e4] {\r\n    padding-top: 0 !important;\r\n    padding-bottom: 0 !important;\r\n    margin-bottom: 0 !important;\r\n    font-size: inherit !important;\r\n    line-height: 1.5 !important;\n}\n.background-color[data-v-18ebb6e4] {\r\n    background-color: grey;\n}\n.hr[data-v-18ebb6e4] {\r\n    border-top: 2px solid #007db9;\n}\n.aselect[data-v-18ebb6e4] {\r\n    position: relative;\r\n    width: 200px;\r\n    /* Adjust the width as needed */\n}\n.selector.box[data-v-18ebb6e4] {\r\n    position: relative;\n}\n.custom-select[data-v-18ebb6e4] {\r\n    appearance: none;\r\n    -webkit-appearance: none;\r\n    -moz-appearance: none;\r\n    background: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"26\" height=\"26\" viewBox=\"0 0 24 24\"><path fill=\"black\" d=\"M7 10l5 5 5-5z\"/></svg>')\r\n        no-repeat right 10px center;\r\n    background-color: white;\r\n    border: 1px solid #ccc;\r\n    /* padding: 10px 40px 10px 10px; */\r\n    font-size: 14px;\r\n    padding: 2px;\r\n    cursor: pointer;\r\n    width: 100%;\n}\n.custom-select[data-v-18ebb6e4]:focus {\r\n    outline: none;\r\n    border-color: #5cb3fd;\n}\n.nav-tabs .nav-links[data-v-18ebb6e4] {\r\n    border: 2px solid black;\n}\n.mh-100vh[data-v-18ebb6e4] {\r\n    /* min-height: 100vh; */\n}\n.table[data-v-18ebb6e4] {\r\n    max-width: 400px;\r\n    border: 0;\n}\ntd.editable-cell1[data-v-18ebb6e4] {\r\n    border: 1 solid gray !important;\n}\ntd.editable-cell[data-v-18ebb6e4] {\r\n    border: 0 !important;\n}\nth[data-v-18ebb6e4] {\r\n    border: 0 !important;\n}\n.form-control[data-v-18ebb6e4] {\r\n    border: 1px solid gray;\r\n    width: 150px;\r\n    height: 25px;\n}\n.form-control1[data-v-18ebb6e4] {\r\n    border: 2px solid gray;\r\n    width: 150px;\r\n    height: 25px;\n}\n.custom-link[data-v-18ebb6e4] {\r\n    display: block;\r\n    margin-bottom: 0.5rem;\r\n    color: red;\r\n    text-decoration: none;\n}\n.custom-link[data-v-18ebb6e4]:hover {\r\n    color: #2637a8;\r\n    -webkit-text-decoration: underline #2637a8 !important;\r\n            text-decoration: underline #2637a8 !important;\r\n    text-decoration-color: #2637a8;\n}\n.column_b[data-v-18ebb6e4] {\r\n    border: 1px solid #b1b1b1;\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/date-format-parse/es/format.js":
/*!*****************************************************!*\
  !*** ./node_modules/date-format-parse/es/format.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   format: () => (/* binding */ format)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./node_modules/date-format-parse/es/util.js");
/* harmony import */ var _locale_en__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locale/en */ "./node_modules/date-format-parse/es/locale/en.js");


var REGEX_FORMAT = /\[([^\]]+)]|YYYY|YY?|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|Z{1,2}|S{1,3}|w{1,2}|x|X|a|A/g;

function pad(val) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var output = "".concat(Math.abs(val));
  var sign = val < 0 ? '-' : '';

  while (output.length < len) {
    output = "0".concat(output);
  }

  return sign + output;
}

function getOffset(date) {
  return Math.round(date.getTimezoneOffset() / 15) * 15;
}

function formatTimezone(offset) {
  var delimeter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + pad(hours, 2) + delimeter + pad(minutes, 2);
}

var meridiem = function meridiem(h, _, isLowercase) {
  var word = h < 12 ? 'AM' : 'PM';
  return isLowercase ? word.toLocaleLowerCase() : word;
};

var formatFlags = {
  Y: function Y(date) {
    var y = date.getFullYear();
    return y <= 9999 ? "".concat(y) : "+".concat(y);
  },
  // Year: 00, 01, ..., 99
  YY: function YY(date) {
    return pad(date.getFullYear(), 4).substr(2);
  },
  // Year: 1900, 1901, ..., 2099
  YYYY: function YYYY(date) {
    return pad(date.getFullYear(), 4);
  },
  // Month: 1, 2, ..., 12
  M: function M(date) {
    return date.getMonth() + 1;
  },
  // Month: 01, 02, ..., 12
  MM: function MM(date) {
    return pad(date.getMonth() + 1, 2);
  },
  MMM: function MMM(date, locale) {
    return locale.monthsShort[date.getMonth()];
  },
  MMMM: function MMMM(date, locale) {
    return locale.months[date.getMonth()];
  },
  // Day of month: 1, 2, ..., 31
  D: function D(date) {
    return date.getDate();
  },
  // Day of month: 01, 02, ..., 31
  DD: function DD(date) {
    return pad(date.getDate(), 2);
  },
  // Hour: 0, 1, ... 23
  H: function H(date) {
    return date.getHours();
  },
  // Hour: 00, 01, ..., 23
  HH: function HH(date) {
    return pad(date.getHours(), 2);
  },
  // Hour: 1, 2, ..., 12
  h: function h(date) {
    var hours = date.getHours();

    if (hours === 0) {
      return 12;
    }

    if (hours > 12) {
      return hours % 12;
    }

    return hours;
  },
  // Hour: 01, 02, ..., 12
  hh: function hh() {
    var hours = formatFlags.h.apply(formatFlags, arguments);
    return pad(hours, 2);
  },
  // Minute: 0, 1, ..., 59
  m: function m(date) {
    return date.getMinutes();
  },
  // Minute: 00, 01, ..., 59
  mm: function mm(date) {
    return pad(date.getMinutes(), 2);
  },
  // Second: 0, 1, ..., 59
  s: function s(date) {
    return date.getSeconds();
  },
  // Second: 00, 01, ..., 59
  ss: function ss(date) {
    return pad(date.getSeconds(), 2);
  },
  // 1/10 of second: 0, 1, ..., 9
  S: function S(date) {
    return Math.floor(date.getMilliseconds() / 100);
  },
  // 1/100 of second: 00, 01, ..., 99
  SS: function SS(date) {
    return pad(Math.floor(date.getMilliseconds() / 10), 2);
  },
  // Millisecond: 000, 001, ..., 999
  SSS: function SSS(date) {
    return pad(date.getMilliseconds(), 3);
  },
  // Day of week: 0, 1, ..., 6
  d: function d(date) {
    return date.getDay();
  },
  // Day of week: 'Su', 'Mo', ..., 'Sa'
  dd: function dd(date, locale) {
    return locale.weekdaysMin[date.getDay()];
  },
  // Day of week: 'Sun', 'Mon',..., 'Sat'
  ddd: function ddd(date, locale) {
    return locale.weekdaysShort[date.getDay()];
  },
  // Day of week: 'Sunday', 'Monday', ...,'Saturday'
  dddd: function dddd(date, locale) {
    return locale.weekdays[date.getDay()];
  },
  // AM, PM
  A: function A(date, locale) {
    var meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), false);
  },
  // am, pm
  a: function a(date, locale) {
    var meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), true);
  },
  // Timezone: -01:00, +00:00, ... +12:00
  Z: function Z(date) {
    return formatTimezone(getOffset(date), ':');
  },
  // Timezone: -0100, +0000, ... +1200
  ZZ: function ZZ(date) {
    return formatTimezone(getOffset(date));
  },
  // Seconds timestamp: 512969520
  X: function X(date) {
    return Math.floor(date.getTime() / 1000);
  },
  // Milliseconds timestamp: 512969520900
  x: function x(date) {
    return date.getTime();
  },
  w: function w(date, locale) {
    return (0,_util__WEBPACK_IMPORTED_MODULE_0__.getWeek)(date, {
      firstDayOfWeek: locale.firstDayOfWeek,
      firstWeekContainsDate: locale.firstWeekContainsDate
    });
  },
  ww: function ww(date, locale) {
    return pad(formatFlags.w(date, locale), 2);
  }
};
function format(val, str) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var formatStr = str ? String(str) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  var date = (0,_util__WEBPACK_IMPORTED_MODULE_0__.toDate)(val);

  if (!(0,_util__WEBPACK_IMPORTED_MODULE_0__.isValidDate)(date)) {
    return 'Invalid Date';
  }

  var locale = options.locale || _locale_en__WEBPACK_IMPORTED_MODULE_1__["default"];
  return formatStr.replace(REGEX_FORMAT, function (match, p1) {
    if (p1) {
      return p1;
    }

    if (typeof formatFlags[match] === 'function') {
      return "".concat(formatFlags[match](date, locale));
    }

    return match;
  });
}

/***/ }),

/***/ "./node_modules/date-format-parse/es/index.js":
/*!****************************************************!*\
  !*** ./node_modules/date-format-parse/es/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   format: () => (/* reexport safe */ _format__WEBPACK_IMPORTED_MODULE_0__.format),
/* harmony export */   getWeek: () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.getWeek),
/* harmony export */   isDate: () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.isDate),
/* harmony export */   isValidDate: () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.isValidDate),
/* harmony export */   parse: () => (/* reexport safe */ _parse__WEBPACK_IMPORTED_MODULE_1__.parse),
/* harmony export */   toDate: () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.toDate)
/* harmony export */ });
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format */ "./node_modules/date-format-parse/es/format.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parse */ "./node_modules/date-format-parse/es/parse.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./node_modules/date-format-parse/es/util.js");




/***/ }),

/***/ "./node_modules/date-format-parse/es/locale/en.js":
/*!********************************************************!*\
  !*** ./node_modules/date-format-parse/es/locale/en.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var locale = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  firstDayOfWeek: 0,
  firstWeekContainsDate: 1
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (locale);

/***/ }),

/***/ "./node_modules/date-format-parse/es/parse.js":
/*!****************************************************!*\
  !*** ./node_modules/date-format-parse/es/parse.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _locale_en__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./locale/en */ "./node_modules/date-format-parse/es/locale/en.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/date-format-parse/es/util.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var formattingTokens = /(\[[^\[]*\])|(MM?M?M?|Do|DD?|ddd?d?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|S{1,3}|x|X|ZZ?|.)/g;
var match1 = /\d/; // 0 - 9

var match2 = /\d\d/; // 00 - 99

var match3 = /\d{3}/; // 000 - 999

var match4 = /\d{4}/; // 0000 - 9999

var match1to2 = /\d\d?/; // 0 - 99

var matchShortOffset = /[+-]\d\d:?\d\d/; // +00:00 -00:00 +0000 or -0000

var matchSigned = /[+-]?\d+/; // -inf - inf

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123
// const matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i; // Word

var YEAR = 'year';
var MONTH = 'month';
var DAY = 'day';
var HOUR = 'hour';
var MINUTE = 'minute';
var SECOND = 'second';
var MILLISECOND = 'millisecond';
var parseFlags = {};

var addParseFlag = function addParseFlag(token, regex, callback) {
  var tokens = Array.isArray(token) ? token : [token];
  var func;

  if (typeof callback === 'string') {
    func = function func(input) {
      var value = parseInt(input, 10);
      return _defineProperty({}, callback, value);
    };
  } else {
    func = callback;
  }

  tokens.forEach(function (key) {
    parseFlags[key] = [regex, func];
  });
};

var escapeStringRegExp = function escapeStringRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
};

var matchWordRegExp = function matchWordRegExp(localeKey) {
  return function (locale) {
    var array = locale[localeKey];

    if (!Array.isArray(array)) {
      throw new Error("Locale[".concat(localeKey, "] need an array"));
    }

    return new RegExp(array.map(escapeStringRegExp).join('|'));
  };
};

var matchWordCallback = function matchWordCallback(localeKey, key) {
  return function (input, locale) {
    var array = locale[localeKey];

    if (!Array.isArray(array)) {
      throw new Error("Locale[".concat(localeKey, "] need an array"));
    }

    var index = array.indexOf(input);

    if (index < 0) {
      throw new Error('Invalid Word');
    }

    return _defineProperty({}, key, index);
  };
};

addParseFlag('Y', matchSigned, YEAR);
addParseFlag('YY', match2, function (input) {
  var year = new Date().getFullYear();
  var cent = Math.floor(year / 100);
  var value = parseInt(input, 10);
  value = (value > 68 ? cent - 1 : cent) * 100 + value;
  return _defineProperty({}, YEAR, value);
});
addParseFlag('YYYY', match4, YEAR);
addParseFlag('M', match1to2, function (input) {
  return _defineProperty({}, MONTH, parseInt(input, 10) - 1);
});
addParseFlag('MM', match2, function (input) {
  return _defineProperty({}, MONTH, parseInt(input, 10) - 1);
});
addParseFlag('MMM', matchWordRegExp('monthsShort'), matchWordCallback('monthsShort', MONTH));
addParseFlag('MMMM', matchWordRegExp('months'), matchWordCallback('months', MONTH));
addParseFlag('D', match1to2, DAY);
addParseFlag('DD', match2, DAY);
addParseFlag(['H', 'h'], match1to2, HOUR);
addParseFlag(['HH', 'hh'], match2, HOUR);
addParseFlag('m', match1to2, MINUTE);
addParseFlag('mm', match2, MINUTE);
addParseFlag('s', match1to2, SECOND);
addParseFlag('ss', match2, SECOND);
addParseFlag('S', match1, function (input) {
  return _defineProperty({}, MILLISECOND, parseInt(input, 10) * 100);
});
addParseFlag('SS', match2, function (input) {
  return _defineProperty({}, MILLISECOND, parseInt(input, 10) * 10);
});
addParseFlag('SSS', match3, MILLISECOND);

function matchMeridiem(locale) {
  return locale.meridiemParse || /[ap]\.?m?\.?/i;
}

function defaultIsPM(input) {
  return "".concat(input).toLowerCase().charAt(0) === 'p';
}

addParseFlag(['A', 'a'], matchMeridiem, function (input, locale) {
  var isPM = typeof locale.isPM === 'function' ? locale.isPM(input) : defaultIsPM(input);
  return {
    isPM: isPM
  };
});

function offsetFromString(str) {
  var _ref8 = str.match(/([+-]|\d\d)/g) || ['-', '0', '0'],
      _ref9 = _slicedToArray(_ref8, 3),
      symbol = _ref9[0],
      hour = _ref9[1],
      minute = _ref9[2];

  var minutes = parseInt(hour, 10) * 60 + parseInt(minute, 10);

  if (minutes === 0) {
    return 0;
  }

  return symbol === '+' ? -minutes : +minutes;
}

addParseFlag(['Z', 'ZZ'], matchShortOffset, function (input) {
  return {
    offset: offsetFromString(input)
  };
});
addParseFlag('x', matchSigned, function (input) {
  return {
    date: new Date(parseInt(input, 10))
  };
});
addParseFlag('X', matchTimestamp, function (input) {
  return {
    date: new Date(parseFloat(input) * 1000)
  };
});
addParseFlag('d', match1, 'weekday');
addParseFlag('dd', matchWordRegExp('weekdaysMin'), matchWordCallback('weekdaysMin', 'weekday'));
addParseFlag('ddd', matchWordRegExp('weekdaysShort'), matchWordCallback('weekdaysShort', 'weekday'));
addParseFlag('dddd', matchWordRegExp('weekdays'), matchWordCallback('weekdays', 'weekday'));
addParseFlag('w', match1to2, 'week');
addParseFlag('ww', match2, 'week');

function to24hour(hour, isPM) {
  if (hour !== undefined && isPM !== undefined) {
    if (isPM) {
      if (hour < 12) {
        return hour + 12;
      }
    } else if (hour === 12) {
      return 0;
    }
  }

  return hour;
}

function getFullInputArray(input) {
  var backupDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var result = [0, 0, 1, 0, 0, 0, 0];
  var backupArr = [backupDate.getFullYear(), backupDate.getMonth(), backupDate.getDate(), backupDate.getHours(), backupDate.getMinutes(), backupDate.getSeconds(), backupDate.getMilliseconds()];
  var useBackup = true;

  for (var i = 0; i < 7; i++) {
    if (input[i] === undefined) {
      result[i] = useBackup ? backupArr[i] : result[i];
    } else {
      result[i] = input[i];
      useBackup = false;
    }
  }

  return result;
}

function createDate(y, m, d, h, M, s, ms) {
  var date;

  if (y < 100 && y >= 0) {
    date = new Date(y + 400, m, d, h, M, s, ms);

    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m, d, h, M, s, ms);
  }

  return date;
}

function createUTCDate() {
  var date;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var y = args[0];

  if (y < 100 && y >= 0) {
    args[0] += 400;
    date = new Date(Date.UTC.apply(Date, args)); // eslint-disable-next-line no-restricted-globals

    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(Date, args));
  }

  return date;
}

function makeParser(dateString, format, locale) {
  var tokens = format.match(formattingTokens);

  if (!tokens) {
    throw new Error();
  }

  var length = tokens.length;
  var mark = {};

  for (var i = 0; i < length; i += 1) {
    var token = tokens[i];
    var parseTo = parseFlags[token];

    if (!parseTo) {
      var word = token.replace(/^\[|\]$/g, '');

      if (dateString.indexOf(word) === 0) {
        dateString = dateString.substr(word.length);
      } else {
        throw new Error('not match');
      }
    } else {
      var regex = typeof parseTo[0] === 'function' ? parseTo[0](locale) : parseTo[0];
      var parser = parseTo[1];
      var value = (regex.exec(dateString) || [])[0];
      var obj = parser(value, locale);
      mark = _objectSpread({}, mark, {}, obj);
      dateString = dateString.replace(value, '');
    }
  }

  return mark;
}

function parse(str, format) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    var _options$locale = options.locale,
        _locale = _options$locale === void 0 ? _locale_en__WEBPACK_IMPORTED_MODULE_0__["default"] : _options$locale,
        _options$backupDate = options.backupDate,
        backupDate = _options$backupDate === void 0 ? new Date() : _options$backupDate;

    var parseResult = makeParser(str, format, _locale);
    var year = parseResult.year,
        month = parseResult.month,
        day = parseResult.day,
        hour = parseResult.hour,
        minute = parseResult.minute,
        second = parseResult.second,
        millisecond = parseResult.millisecond,
        isPM = parseResult.isPM,
        date = parseResult.date,
        offset = parseResult.offset,
        weekday = parseResult.weekday,
        week = parseResult.week;

    if (date) {
      return date;
    }

    var inputArray = [year, month, day, hour, minute, second, millisecond];
    inputArray[3] = to24hour(inputArray[3], isPM); // check week

    if (week !== undefined && month === undefined && day === undefined) {
      // new Date(year, 3) make sure in current year
      var firstDate = (0,_util__WEBPACK_IMPORTED_MODULE_1__.startOfWeekYear)(year === undefined ? backupDate : new Date(year, 3), {
        firstDayOfWeek: _locale.firstDayOfWeek,
        firstWeekContainsDate: _locale.firstWeekContainsDate
      });
      return new Date(firstDate.getTime() + (week - 1) * 7 * 24 * 3600 * 1000);
    }

    var parsedDate;
    var result = getFullInputArray(inputArray, backupDate);

    if (offset !== undefined) {
      result[6] += offset * 60 * 1000;
      parsedDate = createUTCDate.apply(void 0, _toConsumableArray(result));
    } else {
      parsedDate = createDate.apply(void 0, _toConsumableArray(result));
    } // check weekday


    if (weekday !== undefined && parsedDate.getDay() !== weekday) {
      return new Date(NaN);
    }

    return parsedDate;
  } catch (e) {
    return new Date(NaN);
  }
}

/***/ }),

/***/ "./node_modules/date-format-parse/es/util.js":
/*!***************************************************!*\
  !*** ./node_modules/date-format-parse/es/util.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getWeek: () => (/* binding */ getWeek),
/* harmony export */   isDate: () => (/* binding */ isDate),
/* harmony export */   isValidDate: () => (/* binding */ isValidDate),
/* harmony export */   startOfWeek: () => (/* binding */ startOfWeek),
/* harmony export */   startOfWeekYear: () => (/* binding */ startOfWeekYear),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
function isDate(value) {
  return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
}
function toDate(value) {
  if (isDate(value)) {
    return new Date(value.getTime());
  }

  if (value == null) {
    return new Date(NaN);
  }

  return new Date(value);
}
function isValidDate(value) {
  return isDate(value) && !isNaN(value.getTime());
}
function startOfWeek(value) {
  var firstDayOfWeek = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!(firstDayOfWeek >= 0 && firstDayOfWeek <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6');
  }

  var date = toDate(value);
  var day = date.getDay();
  var diff = (day + 7 - firstDayOfWeek) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfWeekYear(value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$firstDayOfWeek = _ref.firstDayOfWeek,
      firstDayOfWeek = _ref$firstDayOfWeek === void 0 ? 0 : _ref$firstDayOfWeek,
      _ref$firstWeekContain = _ref.firstWeekContainsDate,
      firstWeekContainsDate = _ref$firstWeekContain === void 0 ? 1 : _ref$firstWeekContain;

  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7');
  }

  var date = toDate(value);
  var year = date.getFullYear();
  var firstDateOfFirstWeek = new Date(0);

  for (var i = year + 1; i >= year - 1; i--) {
    firstDateOfFirstWeek.setFullYear(i, 0, firstWeekContainsDate);
    firstDateOfFirstWeek.setHours(0, 0, 0, 0);
    firstDateOfFirstWeek = startOfWeek(firstDateOfFirstWeek, firstDayOfWeek);

    if (date.getTime() >= firstDateOfFirstWeek.getTime()) {
      break;
    }
  }

  return firstDateOfFirstWeek;
}
function getWeek(value) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$firstDayOfWeek = _ref2.firstDayOfWeek,
      firstDayOfWeek = _ref2$firstDayOfWeek === void 0 ? 0 : _ref2$firstDayOfWeek,
      _ref2$firstWeekContai = _ref2.firstWeekContainsDate,
      firstWeekContainsDate = _ref2$firstWeekContai === void 0 ? 1 : _ref2$firstWeekContai;

  var date = toDate(value);
  var firstDateOfThisWeek = startOfWeek(date, firstDayOfWeek);
  var firstDateOfFirstWeek = startOfWeekYear(date, {
    firstDayOfWeek: firstDayOfWeek,
    firstWeekContainsDate: firstWeekContainsDate
  });
  var diff = firstDateOfThisWeek.getTime() - firstDateOfFirstWeek.getTime();
  return Math.round(diff / (7 * 24 * 3600 * 1000)) + 1;
}

/***/ }),

/***/ "./node_modules/vue2-datepicker/index.css":
/*!************************************************!*\
  !*** ./node_modules/vue2-datepicker/index.css ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_clonedRuleSet_9_use_1_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./index.css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue2-datepicker/index.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_index_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_index_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
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
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_template_id_18ebb6e4_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=template&id=18ebb6e4&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=template&id=18ebb6e4&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Test_vue_vue_type_style_index_0_id_18ebb6e4_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Test.vue?vue&type=style&index=0&id=18ebb6e4&scoped=true&lang=css");


/***/ }),

/***/ "./node_modules/vue2-datepicker/index.esm.js":
/*!***************************************************!*\
  !*** ./node_modules/vue2-datepicker/index.esm.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var date_format_parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-format-parse */ "./node_modules/date-format-parse/es/index.js");


function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _extends$1() {
  return _extends$1 = Object.assign || function (a) {
    for (var b, c = 1; c < arguments.length; c++) {
      for (var d in b = arguments[c], b) {
        Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
      }
    }

    return a;
  }, _extends$1.apply(this, arguments);
}

var normalMerge = ["attrs", "props", "domProps"],
    toArrayMerge = ["class", "style", "directives"],
    functionalMerge = ["on", "nativeOn"],
    mergeJsxProps = function mergeJsxProps(a) {
  return a.reduce(function (c, a) {
    for (var b in a) {
      if (!c[b]) c[b] = a[b];else if (-1 !== normalMerge.indexOf(b)) c[b] = _extends$1({}, c[b], a[b]);else if (-1 !== toArrayMerge.indexOf(b)) {
        var d = c[b] instanceof Array ? c[b] : [c[b]],
            e = a[b] instanceof Array ? a[b] : [a[b]];
        c[b] = d.concat(e);
      } else if (-1 !== functionalMerge.indexOf(b)) {
        for (var f in a[b]) {
          if (c[b][f]) {
            var g = c[b][f] instanceof Array ? c[b][f] : [c[b][f]],
                h = a[b][f] instanceof Array ? a[b][f] : [a[b][f]];
            c[b][f] = g.concat(h);
          } else c[b][f] = a[b][f];
        }
      } else if ("hook" == b) for (var i in a[b]) {
        c[b][i] = c[b][i] ? mergeFn(c[b][i], a[b][i]) : a[b][i];
      } else c[b] = a[b];
    }

    return c;
  }, {});
},
    mergeFn = function mergeFn(a, b) {
  return function () {
    a && a.apply(this, arguments), b && b.apply(this, arguments);
  };
};

var helper = mergeJsxProps;

// new Date(10, 0, 1) The year from 0 to 99 will be incremented by 1900 automatically.
function createDate(y) {
  var M = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var ms = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var date = new Date(y, M, d, h, m, s, ms);

  if (y < 100 && y >= 0) {
    date.setFullYear(y);
  }

  return date;
}
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
function isValidRangeDate(date) {
  return Array.isArray(date) && date.length === 2 && date.every(isValidDate) && date[0] <= date[1];
}
function isValidDates(dates) {
  return Array.isArray(dates) && dates.every(isValidDate);
}
function getValidDate(value) {
  var date = new Date(value);

  if (isValidDate(date)) {
    return date;
  }

  for (var _len = arguments.length, backup = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    backup[_key - 1] = arguments[_key];
  }

  if (backup.length) {
    return getValidDate.apply(void 0, backup);
  }

  return new Date();
}
function startOfYear(value) {
  var date = new Date(value);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfMonth(value) {
  var date = new Date(value);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfDay(value) {
  var date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getCalendar(_ref) {
  var firstDayOfWeek = _ref.firstDayOfWeek,
      year = _ref.year,
      month = _ref.month;
  var arr = []; // change to the last day of the last month

  var calendar = createDate(year, month, 0);
  var lastDayInLastMonth = calendar.getDate(); // getDay() 0 is Sunday, 1 is Monday

  var firstDayInLastMonth = lastDayInLastMonth - (calendar.getDay() + 7 - firstDayOfWeek) % 7;

  for (var i = firstDayInLastMonth; i <= lastDayInLastMonth; i++) {
    arr.push(createDate(year, month, i - lastDayInLastMonth));
  } // change to the last day of the current month


  calendar.setMonth(month + 1, 0);
  var lastDayInCurrentMonth = calendar.getDate();

  for (var _i = 1; _i <= lastDayInCurrentMonth; _i++) {
    arr.push(createDate(year, month, _i));
  }

  var lastMonthLength = lastDayInLastMonth - firstDayInLastMonth + 1;
  var nextMonthLength = 6 * 7 - lastMonthLength - lastDayInCurrentMonth;

  for (var _i2 = 1; _i2 <= nextMonthLength; _i2++) {
    arr.push(createDate(year, month, lastDayInCurrentMonth + _i2));
  }

  return arr;
}
function setMonth(dirtyDate, dirtyMonth) {
  var date = new Date(dirtyDate);
  var month = typeof dirtyMonth === 'function' ? dirtyMonth(date.getMonth()) : Number(dirtyMonth);
  var year = date.getFullYear();
  var daysInMonth = createDate(year, month + 1, 0).getDate();
  var day = date.getDate();
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}
function setYear(dirtyDate, dirtyYear) {
  var date = new Date(dirtyDate);
  var year = typeof dirtyYear === 'function' ? dirtyYear(date.getFullYear()) : dirtyYear;
  date.setFullYear(year);
  return date;
}
function assignTime(target, source) {
  var date = new Date(target);
  var time = new Date(source);
  date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
  return date;
}

/**
 * chunk the array
 * @param {Array} arr
 * @param {Number} size
 */
function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    return [];
  }

  var result = [];
  var len = arr.length;
  var i = 0;
  size = size || len;

  while (i < len) {
    result.push(arr.slice(i, i += size));
  }

  return result;
}
/**
 * isObject
 * @param {*} obj
 * @returns {Boolean}
 */

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * pick object
 * @param {Object} obj
 * @param {Array|String} props
 */

function pick(obj, props) {
  if (!isObject(obj)) return {};

  if (!Array.isArray(props)) {
    props = [props];
  }

  var res = {};
  props.forEach(function (prop) {
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  });
  return res;
}
/**
 * deep merge two object without merging array
 * @param {object} target
 * @param {object} source
 */

function mergeDeep(target, source) {
  if (!isObject(target)) {
    return {};
  }

  var result = target;

  if (isObject(source)) {
    Object.keys(source).forEach(function (key) {
      var value = source[key];

      if (isObject(value) && isObject(target[key])) {
        value = mergeDeep(target[key], value);
      }

      result = _objectSpread2({}, result, _defineProperty({}, key, value));
    });
  }

  return result;
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var en = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var locale = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  firstDayOfWeek: 0,
  firstWeekContainsDate: 1
};
var _default = locale;
exports["default"] = _default;
module.exports = exports.default;
});

var en$1 = unwrapExports(en);

var lang = {
  formatLocale: en$1,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true
};

var defaultLocale = 'en';
var locales = {};
locales[defaultLocale] = lang;
function locale(name, object, isLocal) {
  if (typeof name !== 'string') return locales[defaultLocale];
  var l = defaultLocale;

  if (locales[name]) {
    l = name;
  }

  if (object) {
    locales[name] = object;
    l = name;
  }

  if (!isLocal) {
    defaultLocale = l;
  }

  return locales[name] || locales[defaultLocale];
}
/**
 * get locale object
 * @param {string} name lang
 */

function getLocale(name) {
  return locale(name, null, true);
}

/* istanbul ignore file */
function rafThrottle(fn) {
  var isRunning = false;
  return function fnBinfRaf() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(function () {
      isRunning = false;
      fn.apply(_this, args);
    });
  };
}

/**
 * get the hidden element width, height
 * @param {HTMLElement} element dom
 */
function getPopupElementSize(element) {
  var originalDisplay = element.style.display;
  var originalVisibility = element.style.visibility;
  element.style.display = 'block';
  element.style.visibility = 'hidden';
  var styles = window.getComputedStyle(element);
  var width = element.offsetWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
  var height = element.offsetHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
  element.style.display = originalDisplay;
  element.style.visibility = originalVisibility;
  return {
    width: width,
    height: height
  };
}
/**
 * get the popup position
 * @param {HTMLElement} el relative element
 * @param {Number} targetWidth target element's width
 * @param {Number} targetHeight target element's height
 * @param {Boolean} fixed
 */

function getRelativePosition(el, targetWidth, targetHeight, fixed) {
  var left = 0;
  var top = 0;
  var offsetX = 0;
  var offsetY = 0;
  var relativeRect = el.getBoundingClientRect();
  var dw = document.documentElement.clientWidth;
  var dh = document.documentElement.clientHeight;

  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left;
    offsetY = window.pageYOffset + relativeRect.top;
  }

  if (dw - relativeRect.left < targetWidth && relativeRect.right < targetWidth) {
    left = offsetX - relativeRect.left + 1;
  } else if (relativeRect.left + relativeRect.width / 2 <= dw / 2) {
    left = offsetX;
  } else {
    left = offsetX + relativeRect.width - targetWidth;
  }

  if (relativeRect.top <= targetHeight && dh - relativeRect.bottom <= targetHeight) {
    top = offsetY + dh - relativeRect.top - targetHeight;
  } else if (relativeRect.top + relativeRect.height / 2 <= dh / 2) {
    top = offsetY + relativeRect.height;
  } else {
    top = offsetY - targetHeight;
  }

  return {
    left: "".concat(left, "px"),
    top: "".concat(top, "px")
  };
}
function getScrollParent(node) {
  var until = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

  if (!node || node === until) {
    return null;
  }

  var style = function style(value, prop) {
    return getComputedStyle(value, null).getPropertyValue(prop);
  };

  var regex = /(auto|scroll)/;
  var scroll = regex.test(style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x'));
  return scroll ? node : getScrollParent(node.parentNode, until);
}

//
var script = {
  name: 'Popup',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      top: '',
      left: ''
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler: function handler(val) {
        var _this = this;

        this.$nextTick(function () {
          if (val) {
            _this.displayPopup();
          }
        });
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }

    this._clickoutEvent = 'ontouchend' in document ? 'touchstart' : 'mousedown';
    document.addEventListener(this._clickoutEvent, this.handleClickOutside); // change the popup position when resize or scroll

    var relativeElement = this.$parent.$el;
    this._displayPopup = rafThrottle(function () {
      return _this2.displayPopup();
    });
    this._scrollParent = getScrollParent(relativeElement) || window;

    this._scrollParent.addEventListener('scroll', this._displayPopup);

    window.addEventListener('resize', this._displayPopup);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.appendToBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }

    document.removeEventListener(this._clickoutEvent, this.handleClickOutside);

    this._scrollParent.removeEventListener('scroll', this._displayPopup);

    window.removeEventListener('resize', this._displayPopup);
  },
  methods: {
    handleClickOutside: function handleClickOutside(evt) {
      if (!this.visible) return;
      var target = evt.target;
      var el = this.$el;

      if (el && !el.contains(target)) {
        this.$emit('clickoutside', evt);
      }
    },
    displayPopup: function displayPopup() {
      if (!this.visible) return;
      var popup = this.$el;
      var relativeElement = this.$parent.$el;
      var appendToBody = this.appendToBody;

      if (!this._popupRect) {
        this._popupRect = getPopupElementSize(popup);
      }

      var _this$_popupRect = this._popupRect,
          width = _this$_popupRect.width,
          height = _this$_popupRect.height;

      var _getRelativePosition = getRelativePosition(relativeElement, width, height, appendToBody),
          left = _getRelativePosition.left,
          top = _getRelativePosition.top;

      this.left = left;
      this.top = top;
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function (context) {
      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('transition', {
    attrs: {
      "name": _vm.prefixClass + "-zoom-in-down"
    }
  }, [_vm.visible ? _c('div', {
    class: _vm.prefixClass + "-datepicker-main " + _vm.prefixClass + "-datepicker-popup",
    style: {
      top: _vm.top,
      left: _vm.left,
      position: 'absolute'
    }
  }, [_vm._t("default")], 2) : _vm._e()]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* script */

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 1024 1024",
      "width": "1em",
      "height": "1em"
    }
  }, [_c('path', {
    attrs: {
      "d": "M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0 32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z"
    }
  })]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, {}, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

/* script */

/* template */
var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 24 24",
      "width": "1em",
      "height": "1em"
    }
  }, [_c('path', {
    attrs: {
      "d": "M0 0h24v24H0z",
      "fill": "none"
    }
  }), _vm._v(" "), _c('path', {
    attrs: {
      "d": "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    }
  }), _vm._v(" "), _c('path', {
    attrs: {
      "d": "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
    }
  })]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, {}, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

/* script */

/* template */
var __vue_render__$3 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 1024 1024",
      "width": "1em",
      "height": "1em"
    }
  }, [_c('path', {
    attrs: {
      "d": "M810.005333 274.005333l-237.994667 237.994667 237.994667 237.994667-60.010667 60.010667-237.994667-237.994667-237.994667 237.994667-60.010667-60.010667 237.994667-237.994667-237.994667-237.994667 60.010667-60.010667 237.994667 237.994667 237.994667-237.994667z"
    }
  })]);
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = undefined;
/* functional template */

var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, {}, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$1 = {
  props: {
    type: String,
    disabled: Boolean
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$4 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('button', _vm._g({
    class: [_vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-btn-icon-" + _vm.type, {
      disabled: _vm.disabled
    }],
    attrs: {
      "type": "button",
      "disabled": _vm.disabled
    }
  }, _vm.$listeners), [_c('i', {
    class: _vm.prefixClass + "-icon-" + _vm.type
  })]);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$4 = undefined;
/* scoped */

var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = undefined;
/* functional template */

var __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$4 = normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$1, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

var script$2 = {
  name: 'TableDate',
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    getWeek: {
      default: function _default() {
        return date_format_parse__WEBPACK_IMPORTED_MODULE_0__.getWeek;
      }
    },
    prefixClass: {
      default: 'mx'
    },
    onDateMouseEnter: {
      default: undefined
    },
    onDateMouseLeave: {
      default: undefined
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    },
    showWeekNumber: {
      type: Boolean,
      default: false
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    getRowClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    firstDayOfWeek: function firstDayOfWeek() {
      return this.getLocale().formatLocale.firstDayOfWeek || 0;
    },
    yearMonth: function yearMonth() {
      var _this$getLocale = this.getLocale(),
          yearFormat = _this$getLocale.yearFormat,
          monthBeforeYear = _this$getLocale.monthBeforeYear,
          _this$getLocale$month = _this$getLocale.monthFormat,
          monthFormat = _this$getLocale$month === void 0 ? 'MMM' : _this$getLocale$month;

      var yearLabel = {
        panel: 'year',
        label: this.formatDate(this.calendar, yearFormat)
      };
      var monthLabel = {
        panel: 'month',
        label: this.formatDate(this.calendar, monthFormat)
      };
      return monthBeforeYear ? [monthLabel, yearLabel] : [yearLabel, monthLabel];
    },
    days: function days() {
      var locale = this.getLocale();
      var days = locale.days || locale.formatLocale.weekdaysMin;
      return days.concat(days).slice(this.firstDayOfWeek, this.firstDayOfWeek + 7);
    },
    dates: function dates() {
      var year = this.calendar.getFullYear();
      var month = this.calendar.getMonth();
      var arr = getCalendar({
        firstDayOfWeek: this.firstDayOfWeek,
        year: year,
        month: month
      });
      return chunk(arr, 7);
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);

      switch (type) {
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, date.getMonth() + 1, 0);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-year':
          date.setFullYear(date.getFullYear() + 1);
          break;

        case 'last-month':
          date.setMonth(date.getMonth(), 0);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-month':
          date.setMonth(date.getMonth() + 1);
          break;
      }

      return this.disabledCalendarChanger(date, type);
    },
    handleIconLeftClick: function handleIconLeftClick() {
      this.$emit('changecalendar', setMonth(this.calendar, function (v) {
        return v - 1;
      }), 'last-month');
    },
    handleIconRightClick: function handleIconRightClick() {
      this.$emit('changecalendar', setMonth(this.calendar, function (v) {
        return v + 1;
      }), 'next-month');
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v - 1;
      }), 'last-year');
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v + 1;
      }), 'next-year');
    },
    handlePanelChange: function handlePanelChange(panel) {
      this.$emit('changepanel', panel);
    },
    handleMouseEnter: function handleMouseEnter(cell) {
      if (typeof this.onDateMouseEnter === 'function') {
        this.onDateMouseEnter(cell);
      }
    },
    handleMouseLeave: function handleMouseLeave(cell) {
      if (typeof this.onDateMouseLeave === 'function') {
        this.onDateMouseLeave(cell);
      }
    },
    handleCellClick: function handleCellClick(evt) {
      var target = evt.target;

      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }

      var index = target.getAttribute('data-row-col');

      if (index) {
        var _index$split$map = index.split(',').map(function (v) {
          return parseInt(v, 10);
        }),
            _index$split$map2 = _slicedToArray(_index$split$map, 2),
            row = _index$split$map2[0],
            col = _index$split$map2[1];

        var date = this.dates[row][col];
        this.$emit('select', new Date(date));
      }
    },
    formatDate: function formatDate(date, fmt) {
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    getCellTitle: function getCellTitle(date) {
      var fmt = this.titleFormat;
      return this.formatDate(date, fmt);
    },
    getWeekNumber: function getWeekNumber(date) {
      return this.getWeek(date, this.getLocale().formatLocale);
    }
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$5 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-date"
  }, [_c('div', {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c('icon-button', {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows('last-year')
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "left",
      "disabled": _vm.isDisabledArrows('last-month')
    },
    on: {
      "click": _vm.handleIconLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows('next-year')
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "right",
      "disabled": _vm.isDisabledArrows('next-month')
    },
    on: {
      "click": _vm.handleIconRightClick
    }
  }), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-header-label"
  }, _vm._l(_vm.yearMonth, function (item) {
    return _c('button', {
      key: item.panel,
      class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-btn-current-" + item.panel,
      attrs: {
        "type": "button"
      },
      on: {
        "click": function click($event) {
          return _vm.handlePanelChange(item.panel);
        }
      }
    }, [_vm._v("\n        " + _vm._s(item.label) + "\n      ")]);
  }), 0)], 1), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c('table', {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-date"
  }, [_c('thead', [_c('tr', [_vm.showWeekNumber ? _c('th', {
    class: _vm.prefixClass + "-week-number-header"
  }) : _vm._e(), _vm._v(" "), _vm._l(_vm.days, function (day) {
    return _c('th', {
      key: day
    }, [_vm._v(_vm._s(day))]);
  })], 2)]), _vm._v(" "), _c('tbody', {
    on: {
      "click": _vm.handleCellClick
    }
  }, _vm._l(_vm.dates, function (row, i) {
    return _c('tr', {
      key: i,
      class: [_vm.prefixClass + "-date-row", _vm.getRowClasses(row)]
    }, [_vm.showWeekNumber ? _c('td', {
      class: _vm.prefixClass + "-week-number",
      attrs: {
        "data-row-col": i + ",0"
      }
    }, [_vm._v("\n            " + _vm._s(_vm.getWeekNumber(row[0])) + "\n          ")]) : _vm._e(), _vm._v(" "), _vm._l(row, function (cell, j) {
      return _c('td', {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell),
        attrs: {
          "data-row-col": i + "," + j,
          "title": _vm.getCellTitle(cell)
        },
        on: {
          "mouseenter": function mouseenter($event) {
            return _vm.handleMouseEnter(cell);
          },
          "mouseleave": function mouseleave($event) {
            return _vm.handleMouseLeave(cell);
          }
        }
      }, [_c('div', [_vm._v(_vm._s(cell.getDate()))])]);
    })], 2);
  }), 0)])])]);
};

var __vue_staticRenderFns__$5 = [];
/* style */

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = undefined;
/* functional template */

var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$2, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

//
var script$3 = {
  name: 'TableMonth',
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    calendarYear: function calendarYear() {
      return this.calendar.getFullYear();
    },
    months: function months() {
      var locale = this.getLocale();
      var monthsLocale = locale.months || locale.formatLocale.monthsShort;
      var months = monthsLocale.map(function (text, month) {
        return {
          text: text,
          month: month
        };
      });
      return chunk(months, 3);
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);

      switch (type) {
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-year':
          date.setFullYear(date.getFullYear() + 1, 0, 1);
          break;
      }

      return this.disabledCalendarChanger(date, type);
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v - 1;
      }), 'last-year');
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v + 1;
      }), 'next-year');
    },
    handlePanelChange: function handlePanelChange() {
      this.$emit('changepanel', 'year');
    },
    handleClick: function handleClick(evt) {
      var target = evt.target;

      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }

      var month = target.getAttribute('data-month');

      if (month && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(month, 10));
      }
    }
  }
};

/* script */
var __vue_script__$3 = script$3;
/* template */

var __vue_render__$6 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-month"
  }, [_c('div', {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c('icon-button', {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows('last-year')
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows('next-year')
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-header-label"
  }, [_c('button', {
    class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text",
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.handlePanelChange
    }
  }, [_vm._v("\n        " + _vm._s(_vm.calendarYear) + "\n      ")])])], 1), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c('table', {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-month",
    on: {
      "click": _vm.handleClick
    }
  }, _vm._l(_vm.months, function (row, i) {
    return _c('tr', {
      key: i
    }, _vm._l(row, function (cell, j) {
      return _c('td', {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell.month),
        attrs: {
          "data-month": cell.month
        }
      }, [_c('div', [_vm._v(_vm._s(cell.text))])]);
    }), 0);
  }), 0)])]);
};

var __vue_staticRenderFns__$6 = [];
/* style */

var __vue_inject_styles__$6 = undefined;
/* scoped */

var __vue_scope_id__$6 = undefined;
/* module identifier */

var __vue_module_identifier__$6 = undefined;
/* functional template */

var __vue_is_functional_template__$6 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$6 = normalizeComponent({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$6, __vue_script__$3, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);

//
var script$4 = {
  name: 'TableYear',
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    getYearPanel: {
      type: Function
    }
  },
  computed: {
    years: function years() {
      var calendar = new Date(this.calendar);

      if (typeof this.getYearPanel === 'function') {
        return this.getYearPanel(calendar);
      }

      return this.getYears(calendar);
    },
    firstYear: function firstYear() {
      return this.years[0][0];
    },
    lastYear: function lastYear() {
      var last = function last(arr) {
        return arr[arr.length - 1];
      };

      return last(last(this.years));
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);

      switch (type) {
        case 'last-decade':
          date.setFullYear(this.firstYear - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-decade':
          date.setFullYear(this.lastYear + 1, 0, 1);
          break;
      }

      return this.disabledCalendarChanger(date, type);
    },
    getYears: function getYears(calendar) {
      var firstYear = Math.floor(calendar.getFullYear() / 10) * 10;
      var years = [];

      for (var i = 0; i < 10; i++) {
        years.push(firstYear + i);
      }

      return chunk(years, 2);
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v - 10;
      }), 'last-decade');
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v + 10;
      }), 'next-decade');
    },
    handleClick: function handleClick(evt) {
      var target = evt.target;

      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }

      var year = target.getAttribute('data-year');

      if (year && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(year, 10));
      }
    }
  }
};

/* script */
var __vue_script__$4 = script$4;
/* template */

var __vue_render__$7 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-year"
  }, [_c('div', {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c('icon-button', {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows('last-decade')
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows('next-decade')
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-header-label"
  }, [_c('span', [_vm._v(_vm._s(_vm.firstYear))]), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-decade-separator"
  }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.lastYear))])])], 1), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c('table', {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-year",
    on: {
      "click": _vm.handleClick
    }
  }, _vm._l(_vm.years, function (row, i) {
    return _c('tr', {
      key: i
    }, _vm._l(row, function (cell, j) {
      return _c('td', {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell),
        attrs: {
          "data-year": cell
        }
      }, [_c('div', [_vm._v(_vm._s(cell))])]);
    }), 0);
  }), 0)])]);
};

var __vue_staticRenderFns__$7 = [];
/* style */

var __vue_inject_styles__$7 = undefined;
/* scoped */

var __vue_scope_id__$7 = undefined;
/* module identifier */

var __vue_module_identifier__$7 = undefined;
/* functional template */

var __vue_is_functional_template__$7 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$7 = normalizeComponent({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$7, __vue_script__$4, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined);

var CalendarPanel = {
  name: 'CalendarPanel',
  inject: {
    prefixClass: {
      default: 'mx'
    },
    dispatchDatePicker: {
      default: function _default() {
        return function () {};
      }
    }
  },
  props: {
    value: {},
    defaultValue: {
      default: function _default() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    defaultPanel: {
      type: String
    },
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    disabledDate: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    type: {
      type: String,
      default: 'date'
    },
    getClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    showWeekNumber: {
      type: Boolean,
      default: undefined
    },
    getYearPanel: {
      type: Function
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    calendar: Date,
    // update date when select year or month
    partialUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    var panels = ['date', 'month', 'year'];
    var index = Math.max(panels.indexOf(this.type), panels.indexOf(this.defaultPanel));
    var panel = index !== -1 ? panels[index] : 'date';
    return {
      panel: panel,
      innerCalendar: new Date()
    };
  },
  computed: {
    innerValue: function innerValue() {
      var value = Array.isArray(this.value) ? this.value : [this.value];
      var map = {
        year: startOfYear,
        month: startOfMonth,
        date: startOfDay
      };
      var start = map[this.type] || map.date;
      return value.filter(isValidDate).map(function (v) {
        return start(v);
      });
    },
    calendarYear: function calendarYear() {
      return this.innerCalendar.getFullYear();
    },
    calendarMonth: function calendarMonth() {
      return this.innerCalendar.getMonth();
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: 'initCalendar'
    },
    calendar: {
      handler: 'initCalendar'
    },
    defaultValue: {
      handler: 'initCalendar'
    }
  },
  methods: {
    initCalendar: function initCalendar() {
      var calendarDate = this.calendar;

      if (!isValidDate(calendarDate)) {
        var length = this.innerValue.length;
        calendarDate = getValidDate(length > 0 ? this.innerValue[length - 1] : this.defaultValue);
      }

      this.innerCalendar = startOfMonth(calendarDate);
    },
    isDisabled: function isDisabled(date) {
      return this.disabledDate(new Date(date), this.innerValue);
    },
    emitDate: function emitDate(date, type) {
      if (!this.isDisabled(date)) {
        this.$emit('select', date, type, this.innerValue); // someone need get the first selected date to set range value. (#429)

        this.dispatchDatePicker('pick', date, type);
      }
    },
    handleCalendarChange: function handleCalendarChange(calendar, type) {
      var oldCalendar = new Date(this.innerCalendar);
      this.innerCalendar = calendar;
      this.$emit('update:calendar', calendar);
      this.dispatchDatePicker('calendar-change', calendar, oldCalendar, type);
    },
    handelPanelChange: function handelPanelChange(panel) {
      var oldPanel = this.panel;
      this.panel = panel;
      this.dispatchDatePicker('panel-change', panel, oldPanel);
    },
    handleSelectYear: function handleSelectYear(year) {
      if (this.type === 'year') {
        var date = this.getYearCellDate(year);
        this.emitDate(date, 'year');
      } else {
        this.handleCalendarChange(createDate(year, this.calendarMonth), 'year');
        this.handelPanelChange('month');

        if (this.partialUpdate && this.innerValue.length === 1) {
          var _date = new Date(this.innerValue[0]);

          _date.setFullYear(year);

          this.emitDate(_date, 'year');
        }
      }
    },
    handleSelectMonth: function handleSelectMonth(month) {
      if (this.type === 'month') {
        var date = this.getMonthCellDate(month);
        this.emitDate(date, 'month');
      } else {
        this.handleCalendarChange(createDate(this.calendarYear, month), 'month');
        this.handelPanelChange('date');

        if (this.partialUpdate && this.innerValue.length === 1) {
          var _date2 = new Date(this.innerValue[0]);

          _date2.setFullYear(this.calendarYear);

          this.emitDate(setMonth(_date2, month), 'month');
        }
      }
    },
    handleSelectDate: function handleSelectDate(date) {
      this.emitDate(date, this.type === 'week' ? 'week' : 'date');
    },
    getMonthCellDate: function getMonthCellDate(month) {
      return createDate(this.calendarYear, month);
    },
    getYearCellDate: function getYearCellDate(year) {
      return createDate(year, 0);
    },
    getDateClasses: function getDateClasses(cellDate) {
      var notCurrentMonth = cellDate.getMonth() !== this.calendarMonth;
      var classes = [];

      if (cellDate.getTime() === new Date().setHours(0, 0, 0, 0)) {
        classes.push('today');
      }

      if (notCurrentMonth) {
        classes.push('not-current-month');
      }

      var state = this.getStateClass(cellDate);

      if (!(state === 'active' && notCurrentMonth)) {
        classes.push(state);
      }

      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getMonthClasses: function getMonthClasses(month) {
      var classes = [];

      if (this.type !== 'month') {
        if (this.calendarMonth === month) {
          classes.push('active');
        }

        var _cellDate = this.getMonthCellDate(month);

        if (this.disabledCalendarChanger(_cellDate, 'month')) {
          classes.push('disabled');
        }

        return classes;
      }

      var cellDate = this.getMonthCellDate(month);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getYearClasses: function getYearClasses(year) {
      var classes = [];

      if (this.type !== 'year') {
        if (this.calendarYear === year) {
          classes.push('active');
        }

        var _cellDate2 = this.getYearCellDate(year);

        if (this.disabledCalendarChanger(_cellDate2, 'year')) {
          classes.push('disabled');
        }

        return classes;
      }

      var cellDate = this.getYearCellDate(year);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getStateClass: function getStateClass(cellDate) {
      if (this.isDisabled(cellDate)) {
        return 'disabled';
      }

      if (this.innerValue.some(function (v) {
        return v.getTime() === cellDate.getTime();
      })) {
        return 'active';
      }

      return '';
    },
    getWeekState: function getWeekState(row) {
      if (this.type !== 'week') return '';
      var start = row[0].getTime();
      var end = row[6].getTime();
      var active = this.innerValue.some(function (v) {
        var time = v.getTime();
        return time >= start && time <= end;
      });
      return active ? "".concat(this.prefixClass, "-active-week") : '';
    }
  },
  render: function render() {
    var h = arguments[0];
    var panel = this.panel,
        innerCalendar = this.innerCalendar;

    if (panel === 'year') {
      return h(__vue_component__$7, {
        "attrs": {
          "disabledCalendarChanger": this.disabledCalendarChanger,
          "calendar": innerCalendar,
          "getCellClasses": this.getYearClasses,
          "getYearPanel": this.getYearPanel
        },
        "on": {
          "select": this.handleSelectYear,
          "changecalendar": this.handleCalendarChange
        }
      });
    }

    if (panel === 'month') {
      return h(__vue_component__$6, {
        "attrs": {
          "disabledCalendarChanger": this.disabledCalendarChanger,
          "calendar": innerCalendar,
          "getCellClasses": this.getMonthClasses
        },
        "on": {
          "select": this.handleSelectMonth,
          "changepanel": this.handelPanelChange,
          "changecalendar": this.handleCalendarChange
        }
      });
    }

    return h(__vue_component__$5, {
      "attrs": {
        "disabledCalendarChanger": this.disabledCalendarChanger,
        "calendar": innerCalendar,
        "getCellClasses": this.getDateClasses,
        "getRowClasses": this.getWeekState,
        "titleFormat": this.titleFormat,
        "showWeekNumber": typeof this.showWeekNumber === 'boolean' ? this.showWeekNumber : this.type === 'week'
      },
      "class": _defineProperty({}, "".concat(this.prefixClass, "-calendar-week-mode"), this.type === 'week'),
      "on": {
        "select": this.handleSelectDate,
        "changepanel": this.handelPanelChange,
        "changecalendar": this.handleCalendarChange
      }
    });
  }
};

var CalendarRange = {
  name: 'CalendarRange',
  components: {
    CalendarPanel: CalendarPanel
  },
  provide: function provide() {
    return {
      onDateMouseEnter: this.onDateMouseEnter,
      onDateMouseLeave: this.onDateMouseLeave
    };
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: _objectSpread2({}, CalendarPanel.props),
  data: function data() {
    return {
      innerValue: [],
      calendars: [],
      hoveredValue: null
    };
  },
  computed: {
    // Minimum difference between start and end calendars
    calendarMinDiff: function calendarMinDiff() {
      var map = {
        date: 1,
        // type:date  min 1 month
        month: 1 * 12,
        // type:month min 1 year
        year: 10 * 12 // type:year  min 10 year

      };
      return map[this.type] || map.date;
    },
    calendarMaxDiff: function calendarMaxDiff() {
      return Infinity;
    },
    defaultValues: function defaultValues() {
      return Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        var _this = this;

        this.innerValue = isValidRangeDate(this.value) ? this.value : [new Date(NaN), new Date(NaN)];
        var calendars = this.innerValue.map(function (v, i) {
          return startOfMonth(getValidDate(v, _this.defaultValues[i]));
        });
        this.updateCalendars(calendars);
      }
    }
  },
  methods: {
    handleSelect: function handleSelect(date, type) {
      var _this$innerValue = _slicedToArray(this.innerValue, 2),
          startValue = _this$innerValue[0],
          endValue = _this$innerValue[1];

      if (isValidDate(startValue) && !isValidDate(endValue)) {
        if (startValue.getTime() > date.getTime()) {
          this.innerValue = [date, startValue];
        } else {
          this.innerValue = [startValue, date];
        }

        this.emitDate(this.innerValue, type);
      } else {
        this.innerValue = [date, new Date(NaN)];
      }
    },
    onDateMouseEnter: function onDateMouseEnter(cell) {
      this.hoveredValue = cell;
    },
    onDateMouseLeave: function onDateMouseLeave() {
      this.hoveredValue = null;
    },
    emitDate: function emitDate(dates, type) {
      this.$emit('select', dates, type);
    },
    updateStartCalendar: function updateStartCalendar(value) {
      this.updateCalendars([value, this.calendars[1]], 1);
    },
    updateEndCalendar: function updateEndCalendar(value) {
      this.updateCalendars([this.calendars[0], value], 0);
    },
    updateCalendars: function updateCalendars(calendars) {
      var adjustIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var gap = this.getCalendarGap(calendars);

      if (gap) {
        var calendar = new Date(calendars[adjustIndex]);
        calendar.setMonth(calendar.getMonth() + (adjustIndex === 0 ? -gap : gap));
        calendars[adjustIndex] = calendar;
      }

      this.calendars = calendars;
    },
    getCalendarGap: function getCalendarGap(calendars) {
      var _calendars = _slicedToArray(calendars, 2),
          calendarLeft = _calendars[0],
          calendarRight = _calendars[1];

      var yearDiff = calendarRight.getFullYear() - calendarLeft.getFullYear();
      var monthDiff = calendarRight.getMonth() - calendarLeft.getMonth();
      var diff = yearDiff * 12 + monthDiff;
      var min = this.calendarMinDiff;
      var max = this.calendarMaxDiff;

      if (diff < min) {
        return min - diff;
      }

      if (diff > max) {
        return max - diff;
      }

      return 0;
    },
    getRangeClasses: function getRangeClasses(cellDate, currentDates, classnames) {
      var classes = [].concat(this.getClasses(cellDate, currentDates, classnames));
      if (/disabled|active/.test(classnames)) return classes;

      var inRange = function inRange(data, range) {
        var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
          return v.getTime();
        };
        var value = fn(data);

        var _range$map = range.map(fn),
            _range$map2 = _slicedToArray(_range$map, 2),
            min = _range$map2[0],
            max = _range$map2[1];

        if (min > max) {
          var _ref = [max, min];
          min = _ref[0];
          max = _ref[1];
        }

        return value > min && value < max;
      };

      if (currentDates.length === 2 && inRange(cellDate, currentDates)) {
        return classes.concat('in-range');
      }

      if (currentDates.length === 1 && this.hoveredValue && inRange(cellDate, [currentDates[0], this.hoveredValue])) {
        return classes.concat('hover-in-range');
      }

      return classes;
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];
    var calendarRange = this.calendars.map(function (calendar, index) {
      var props = _objectSpread2({}, _this2.$props, {
        calendar: calendar,
        value: _this2.innerValue,
        defaultValue: _this2.defaultValues[index],
        getClasses: _this2.getRangeClasses,
        // don't update when range is true
        partialUpdate: false
      });

      var on = {
        select: _this2.handleSelect,
        'update:calendar': index === 0 ? _this2.updateStartCalendar : _this2.updateEndCalendar
      };
      return h("calendar-panel", {
        "props": _objectSpread2({}, props),
        "on": _objectSpread2({}, on)
      });
    });
    var prefixClass = this.prefixClass;
    return h("div", {
      "class": "".concat(prefixClass, "-range-wrapper")
    }, [calendarRange]);
  }
};

var scrollBarWidth;
function getScrollbarWidth () {
  if (typeof window === 'undefined') return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  var outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);
  var inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);
  scrollBarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollBarWidth;
}

//
var script$5 = {
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  data: function data() {
    return {
      scrollbarWidth: 0,
      thumbTop: '',
      thumbHeight: ''
    };
  },
  created: function created() {
    this.scrollbarWidth = getScrollbarWidth();
    document.addEventListener('mouseup', this.handleDragend);
  },
  beforeDestroy: function beforeDestroy() {
    document.addEventListener('mouseup', this.handleDragend);
  },
  mounted: function mounted() {
    this.$nextTick(this.getThumbSize);
  },
  methods: {
    getThumbSize: function getThumbSize() {
      var wrap = this.$refs.wrap;
      if (!wrap) return;
      var heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
      this.thumbHeight = heightPercentage < 100 ? "".concat(heightPercentage, "%") : '';
    },
    handleScroll: function handleScroll(evt) {
      var el = evt.currentTarget;
      var scrollHeight = el.scrollHeight,
          scrollTop = el.scrollTop;
      this.thumbTop = "".concat(scrollTop * 100 / scrollHeight, "%");
    },
    handleDragstart: function handleDragstart(evt) {
      evt.stopImmediatePropagation();
      this._draggable = true;
      var offsetTop = this.$refs.thumb.offsetTop;
      this._prevY = evt.clientY - offsetTop;
      document.addEventListener('mousemove', this.handleDraging);
    },
    handleDraging: function handleDraging(evt) {
      if (!this._draggable) return;
      var clientY = evt.clientY;
      var wrap = this.$refs.wrap;
      var scrollHeight = wrap.scrollHeight,
          clientHeight = wrap.clientHeight;
      var offsetY = clientY - this._prevY;
      var top = offsetY * scrollHeight / clientHeight;
      wrap.scrollTop = top;
    },
    handleDragend: function handleDragend() {
      if (this._draggable) {
        this._draggable = false;
        document.removeEventListener('mousemove', this.handleDraging);
      }
    }
  }
};

/* script */
var __vue_script__$5 = script$5;
/* template */

var __vue_render__$8 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-scrollbar",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, [_c('div', {
    ref: "wrap",
    class: _vm.prefixClass + "-scrollbar-wrap",
    style: {
      marginRight: "-" + _vm.scrollbarWidth + "px"
    },
    on: {
      "scroll": _vm.handleScroll
    }
  }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-scrollbar-track"
  }, [_c('div', {
    ref: "thumb",
    class: _vm.prefixClass + "-scrollbar-thumb",
    style: {
      height: _vm.thumbHeight,
      top: _vm.thumbTop
    },
    on: {
      "mousedown": _vm.handleDragstart
    }
  })])]);
};

var __vue_staticRenderFns__$8 = [];
/* style */

var __vue_inject_styles__$8 = undefined;
/* scoped */

var __vue_scope_id__$8 = undefined;
/* module identifier */

var __vue_module_identifier__$8 = undefined;
/* functional template */

var __vue_is_functional_template__$8 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$8 = normalizeComponent({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$8, __vue_script__$5, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined);

//

var padNumber = function padNumber(value) {
  value = parseInt(value, 10);
  return value < 10 ? "0".concat(value) : "".concat(value);
};

var generateOptions = function generateOptions(length, step, options) {
  if (Array.isArray(options)) {
    return options.filter(function (v) {
      return v >= 0 && v < length;
    });
  }

  if (step <= 0) {
    step = 1;
  }

  var arr = [];

  for (var i = 0; i < length; i += step) {
    arr.push(i);
  }

  return arr;
};

var scrollTo = function scrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  // jump to target if duration zero
  if (duration <= 0) {
    requestAnimationFrame(function () {
      element.scrollTop = to;
    });
    return;
  }

  var difference = to - element.scrollTop;
  var tick = difference / duration * 10;
  requestAnimationFrame(function () {
    var scrollTop = element.scrollTop + tick;

    if (scrollTop >= to) {
      element.scrollTop = to;
      return;
    }

    element.scrollTop = scrollTop;
    scrollTo(element, to, duration - 10);
  });
};

var script$6 = {
  name: 'ListColumns',
  components: {
    ScrollbarVertical: __vue_component__$8
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    date: Date,
    scrollDuration: {
      type: Number,
      default: 100
    },
    getClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    showHour: {
      type: Boolean,
      default: true
    },
    showMinute: {
      type: Boolean,
      default: true
    },
    showSecond: {
      type: Boolean,
      default: true
    },
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    secondStep: {
      type: Number,
      default: 1
    },
    use12h: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    columns: function columns() {
      var cols = [];
      if (this.showHour) cols.push({
        type: 'hour',
        list: this.getHoursList()
      });
      if (this.showMinute) cols.push({
        type: 'minute',
        list: this.getMinutesList()
      });
      if (this.showSecond) cols.push({
        type: 'second',
        list: this.getSecondsList()
      });
      if (this.use12h) cols.push({
        type: 'ampm',
        list: this.getAMPMList()
      });
      return cols.filter(function (v) {
        return v.list.length > 0;
      });
    }
  },
  watch: {
    date: {
      handler: function handler() {
        var _this = this;

        this.$nextTick(function () {
          _this.scrollToSelected(_this.scrollDuration);
        });
      }
    }
  },
  mounted: function mounted() {
    this.scrollToSelected(0);
  },
  methods: {
    getHoursList: function getHoursList() {
      var _this2 = this;

      return generateOptions(this.use12h ? 12 : 24, this.hourStep, this.hourOptions).map(function (num) {
        var date = new Date(_this2.date);
        var text = padNumber(num);

        if (_this2.use12h) {
          if (num === 0) {
            text = '12';
          }

          if (date.getHours() >= 12) {
            num += 12;
          }
        }

        var value = date.setHours(num);
        return {
          value: value,
          text: text
        };
      });
    },
    getMinutesList: function getMinutesList() {
      var _this3 = this;

      return generateOptions(60, this.minuteStep, this.minuteOptions).map(function (num) {
        var value = new Date(_this3.date).setMinutes(num);
        return {
          value: value,
          text: padNumber(num)
        };
      });
    },
    getSecondsList: function getSecondsList() {
      var _this4 = this;

      return generateOptions(60, this.secondStep, this.secondOptions).map(function (num) {
        var value = new Date(_this4.date).setSeconds(num);
        return {
          value: value,
          text: padNumber(num)
        };
      });
    },
    getAMPMList: function getAMPMList() {
      var _this5 = this;

      return ['AM', 'PM'].map(function (text, i) {
        var date = new Date(_this5.date);
        var value = date.setHours(date.getHours() % 12 + i * 12);
        return {
          text: text,
          value: value
        };
      });
    },
    scrollToSelected: function scrollToSelected(duration) {
      var elements = this.$el.querySelectorAll('.active');

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var scrollElement = getScrollParent(element, this.$el);

        if (scrollElement) {
          var to = element.offsetTop;
          scrollTo(scrollElement, to, duration);
        }
      }
    },
    handleSelect: function handleSelect(evt) {
      var target = evt.target,
          currentTarget = evt.currentTarget;
      if (target.tagName.toUpperCase() !== 'LI') return;
      var type = currentTarget.getAttribute('data-type');
      var colIndex = parseInt(currentTarget.getAttribute('data-index'), 10);
      var cellIndex = parseInt(target.getAttribute('data-index'), 10);
      var value = this.columns[colIndex].list[cellIndex].value;
      this.$emit('select', value, type);
    }
  }
};

/* script */
var __vue_script__$6 = script$6;
/* template */

var __vue_render__$9 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-time-columns"
  }, _vm._l(_vm.columns, function (col, i) {
    return _c('scrollbar-vertical', {
      key: i,
      class: _vm.prefixClass + "-time-column"
    }, [_c('ul', {
      class: _vm.prefixClass + "-time-list",
      attrs: {
        "data-type": col.type,
        "data-index": i
      },
      on: {
        "click": _vm.handleSelect
      }
    }, _vm._l(col.list, function (item, j) {
      return _c('li', {
        key: item.value,
        class: [_vm.prefixClass + "-time-item", _vm.getClasses(item.value, col.type)],
        attrs: {
          "data-index": j
        }
      }, [_vm._v("\n        " + _vm._s(item.text) + "\n      ")]);
    }), 0)]);
  }), 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

var __vue_inject_styles__$9 = undefined;
/* scoped */

var __vue_scope_id__$9 = undefined;
/* module identifier */

var __vue_module_identifier__$9 = undefined;
/* functional template */

var __vue_is_functional_template__$9 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$9 = normalizeComponent({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$9, __vue_script__$6, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, false, undefined, undefined, undefined);

//

function parseOption() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var values = time.split(':');

  if (values.length >= 2) {
    var hours = parseInt(values[0], 10);
    var minutes = parseInt(values[1], 10);
    return {
      hours: hours,
      minutes: minutes
    };
  }

  return null;
}

var scrollTo$1 = function scrollTo(element, to) {
  if (element) {
    element.scrollTop = to;
  }
};

var script$7 = {
  name: 'ListOptions',
  components: {
    ScrollbarVertical: __vue_component__$8
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    date: Date,
    options: {
      type: [Object, Function],
      default: function _default() {
        return [];
      }
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    getClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    list: function list() {
      var result = [];
      var options = this.options;

      if (typeof options === 'function') {
        return options() || [];
      }

      var start = parseOption(options.start);
      var end = parseOption(options.end);
      var step = parseOption(options.step);
      var fmt = options.format || this.format;

      if (start && end && step) {
        var startMinutes = start.minutes + start.hours * 60;
        var endMinutes = end.minutes + end.hours * 60;
        var stepMinutes = step.minutes + step.hours * 60;
        var len = Math.floor((endMinutes - startMinutes) / stepMinutes);

        for (var i = 0; i <= len; i++) {
          var timeMinutes = startMinutes + i * stepMinutes;
          var hours = Math.floor(timeMinutes / 60);
          var minutes = timeMinutes % 60;
          var value = new Date(this.date).setHours(hours, minutes, 0);
          result.push({
            value: value,
            text: this.formatDate(value, fmt)
          });
        }
      }

      return result;
    }
  },
  mounted: function mounted() {
    this.scrollToSelected();
  },
  methods: {
    formatDate: function formatDate(date, fmt) {
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    scrollToSelected: function scrollToSelected() {
      var element = this.$el.querySelector('.active');
      if (!element) return;
      var scrollElement = getScrollParent(element, this.$el);
      if (!scrollElement) return;
      var to = element.offsetTop;
      scrollTo$1(scrollElement, to);
    },
    handleSelect: function handleSelect(value) {
      this.$emit('select', value, 'time');
    }
  }
};

/* script */
var __vue_script__$7 = script$7;
/* template */

var __vue_render__$a = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('scrollbar-vertical', _vm._l(_vm.list, function (item) {
    return _c('div', {
      key: item.value,
      class: [_vm.prefixClass + "-time-option", _vm.getClasses(item.value)],
      on: {
        "click": function click($event) {
          return _vm.handleSelect(item.value);
        }
      }
    }, [_vm._v("\n    " + _vm._s(item.text) + "\n  ")]);
  }), 0);
};

var __vue_staticRenderFns__$a = [];
/* style */

var __vue_inject_styles__$a = undefined;
/* scoped */

var __vue_scope_id__$a = undefined;
/* module identifier */

var __vue_module_identifier__$a = undefined;
/* functional template */

var __vue_is_functional_template__$a = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$a = normalizeComponent({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$a, __vue_script__$7, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, false, undefined, undefined, undefined);

//
var script$8 = {
  name: 'TimePanel',
  components: {
    ListColumns: __vue_component__$9,
    ListOptions: __vue_component__$a
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    value: {},
    defaultValue: {
      default: function _default() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    format: {
      default: 'HH:mm:ss'
    },
    timeTitleFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    showTimeHeader: {
      type: Boolean,
      default: false
    },
    disabledTime: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    timePickerOptions: {
      type: [Object, Function],
      default: function _default() {
        return null;
      }
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    secondStep: {
      type: Number,
      default: 1
    },
    showHour: {
      type: Boolean,
      default: undefined
    },
    showMinute: {
      type: Boolean,
      default: undefined
    },
    showSecond: {
      type: Boolean,
      default: undefined
    },
    use12h: {
      type: Boolean,
      default: undefined
    },
    scrollDuration: {
      type: Number,
      default: 100
    }
  },
  data: function data() {
    return {
      innerValue: getValidDate(this.value, this.defaultValue)
    };
  },
  computed: {
    title: function title() {
      var titleFormat = this.timeTitleFormat;
      var date = new Date(this.innerValue);
      return this.formatDate(date, titleFormat);
    },
    innerForamt: function innerForamt() {
      return typeof this.format === 'string' ? this.format : 'HH:mm:ss';
    },
    ShowHourMinuteSecondAMPM: function ShowHourMinuteSecondAMPM() {
      var _this = this;

      var fmt = this.innerForamt;
      var defaultProps = {
        showHour: /[HhKk]/.test(fmt),
        showMinute: /m/.test(fmt),
        showSecond: /s/.test(fmt),
        use12h: /a/i.test(fmt)
      };
      var obj = {};
      Object.keys(defaultProps).forEach(function (key) {
        obj[key] = typeof _this[key] === 'boolean' ? _this[key] : defaultProps[key];
      });
      return obj;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        this.innerValue = getValidDate(this.value, this.defaultValue);
      }
    }
  },
  methods: {
    formatDate: function formatDate(date, fmt) {
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    isDisabledTime: function isDisabledTime(value) {
      return this.disabledTime(new Date(value));
    },
    isDisabledHour: function isDisabledHour(date) {
      var value = new Date(date);
      return this.isDisabledTime(value) && this.isDisabledTime(value.setMinutes(0, 0, 0)) && this.isDisabledTime(value.setMinutes(59, 59, 999));
    },
    isDisabledMinute: function isDisabledMinute(date) {
      var value = new Date(date);
      return this.isDisabledTime(value) && this.isDisabledTime(value.setSeconds(0, 0)) && this.isDisabledTime(value.setSeconds(59, 999));
    },
    isDisabledAMPM: function isDisabledAMPM(date) {
      var value = new Date(date);
      var minHour = value.getHours() < 12 ? 0 : 12;
      var maxHour = minHour + 11;
      return this.isDisabledTime(value) && this.isDisabledTime(value.setHours(minHour, 0, 0, 0)) && this.isDisabledTime(value.setHours(maxHour, 59, 59, 999));
    },
    isDisabled: function isDisabled(date, type) {
      if (type === 'hour') {
        return this.isDisabledHour(date);
      }

      if (type === 'minute') {
        return this.isDisabledMinute(date);
      }

      if (type === 'ampm') {
        return this.isDisabledAMPM(date);
      }

      return this.isDisabledTime(date);
    },
    handleSelect: function handleSelect(value, type) {
      var date = new Date(value);

      if (!this.isDisabled(value, type)) {
        this.innerValue = date;

        if (!this.isDisabledTime(date)) {
          this.$emit('select', date, type);
        }
      }
    },
    handleClickTitle: function handleClickTitle() {
      this.$emit('clicktitle');
    },
    getClasses: function getClasses(value, type) {
      var cellDate = new Date(value);

      if (this.isDisabled(value, type)) {
        return 'disabled';
      }

      if (cellDate.getTime() === this.innerValue.getTime()) {
        return 'active';
      }

      return '';
    }
  }
};

/* script */
var __vue_script__$8 = script$8;
/* template */

var __vue_render__$b = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-time"
  }, [_vm.showTimeHeader ? _c('div', {
    class: _vm.prefixClass + "-time-header"
  }, [_c('button', {
    class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-time-header-title",
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.handleClickTitle
    }
  }, [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")])]) : _vm._e(), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-time-content"
  }, [_vm.timePickerOptions ? _c('list-options', {
    attrs: {
      "date": _vm.innerValue,
      "get-classes": _vm.getClasses,
      "options": _vm.timePickerOptions,
      "format": _vm.innerForamt
    },
    on: {
      "select": _vm.handleSelect
    }
  }) : _c('list-columns', _vm._b({
    attrs: {
      "date": _vm.innerValue,
      "get-classes": _vm.getClasses,
      "hour-options": _vm.hourOptions,
      "minute-options": _vm.minuteOptions,
      "second-options": _vm.secondOptions,
      "hour-step": _vm.hourStep,
      "minute-step": _vm.minuteStep,
      "second-step": _vm.secondStep,
      "scroll-duration": _vm.scrollDuration
    },
    on: {
      "select": _vm.handleSelect
    }
  }, 'list-columns', _vm.ShowHourMinuteSecondAMPM, false))], 1)]);
};

var __vue_staticRenderFns__$b = [];
/* style */

var __vue_inject_styles__$b = undefined;
/* scoped */

var __vue_scope_id__$b = undefined;
/* module identifier */

var __vue_module_identifier__$b = undefined;
/* functional template */

var __vue_is_functional_template__$b = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$b = normalizeComponent({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$b, __vue_script__$8, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$b, false, undefined, undefined, undefined);

var TimeRange = {
  name: 'TimeRange',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: _objectSpread2({}, __vue_component__$b.props),
  data: function data() {
    return {
      startValue: new Date(NaN),
      endValue: new Date(NaN)
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        if (isValidRangeDate(this.value)) {
          var _this$value = _slicedToArray(this.value, 2),
              startValue = _this$value[0],
              endValue = _this$value[1];

          this.startValue = startValue;
          this.endValue = endValue;
        } else {
          this.startValue = new Date(NaN);
          this.endValue = new Date(NaN);
        }
      }
    }
  },
  methods: {
    emitChange: function emitChange(type, index) {
      var date = [this.startValue, this.endValue];
      this.$emit('select', date, type === 'time' ? 'time-range' : type, index);
    },
    handleSelectStart: function handleSelectStart(date, type) {
      this.startValue = date; // check the NaN

      if (!(this.endValue.getTime() >= date.getTime())) {
        this.endValue = date;
      }

      this.emitChange(type, 0);
    },
    handleSelectEnd: function handleSelectEnd(date, type) {
      // check the NaN
      this.endValue = date;

      if (!(this.startValue.getTime() <= date.getTime())) {
        this.startValue = date;
      }

      this.emitChange(type, 1);
    },
    disabledStartTime: function disabledStartTime(date) {
      return this.disabledTime(date, 0);
    },
    disabledEndTime: function disabledEndTime(date) {
      return date.getTime() < this.startValue.getTime() || this.disabledTime(date, 1);
    }
  },
  render: function render() {
    var h = arguments[0];
    var defaultValues = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
    var prefixClass = this.prefixClass;
    return h("div", {
      "class": "".concat(prefixClass, "-range-wrapper")
    }, [h(__vue_component__$b, {
      "props": _objectSpread2({}, _objectSpread2({}, this.$props, {
        value: this.startValue,
        defaultValue: defaultValues[0],
        disabledTime: this.disabledStartTime
      })),
      "on": _objectSpread2({}, _objectSpread2({}, this.$listeners, {
        select: this.handleSelectStart
      }))
    }), h(__vue_component__$b, {
      "props": _objectSpread2({}, _objectSpread2({}, this.$props, {
        value: this.endValue,
        defaultValue: defaultValues[1],
        disabledTime: this.disabledEndTime
      })),
      "on": _objectSpread2({}, _objectSpread2({}, this.$listeners, {
        select: this.handleSelectEnd
      }))
    })]);
  }
};

var DatetimePanel = {
  name: 'DatetimePanel',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  emits: ['select', 'update:show-time-panel'],
  props: _objectSpread2({}, CalendarPanel.props, {}, __vue_component__$b.props, {
    showTimePanel: {
      type: Boolean,
      default: undefined
    }
  }),
  data: function data() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value
    };
  },
  computed: {
    timeVisible: function timeVisible() {
      return typeof this.showTimePanel === 'boolean' ? this.showTimePanel : this.defaultTimeVisible;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    closeTimePanel: function closeTimePanel() {
      this.defaultTimeVisible = false;
      this.$emit('update:show-time-panel', false);
    },
    openTimePanel: function openTimePanel() {
      this.defaultTimeVisible = true;
      this.$emit('update:show-time-panel', true);
    },
    emitDate: function emitDate(date, type) {
      this.$emit('select', date, type);
    },
    handleSelect: function handleSelect(date, type) {
      if (type === 'date') {
        this.openTimePanel();
      }

      var datetime = assignTime(date, getValidDate(this.value, this.defaultValue));

      if (this.disabledTime(new Date(datetime))) {
        // set the time of defalutValue;
        datetime = assignTime(date, this.defaultValue);

        if (this.disabledTime(new Date(datetime))) {
          // if disabled don't emit date
          this.currentValue = datetime;
          return;
        }
      }

      this.emitDate(datetime, type);
    }
  },
  render: function render() {
    var h = arguments[0];
    var calendarProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(CalendarPanel.props)), {
        type: 'date',
        value: this.currentValue
      }),
      on: {
        select: this.handleSelect
      }
    };
    var timeProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(__vue_component__$b.props)), {
        showTimeHeader: true,
        value: this.currentValue
      }),
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel
      }
    };
    var prefixClass = this.prefixClass;
    return h("div", [h(CalendarPanel, helper([{}, calendarProps])), this.timeVisible && h(__vue_component__$b, helper([{
      "class": "".concat(prefixClass, "-calendar-time")
    }, timeProps]))]);
  }
};

var DatetimeRange = {
  name: 'DatetimeRange',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  emits: ['select', 'update:show-time-panel'],
  props: _objectSpread2({}, CalendarRange.props, {}, TimeRange.props, {
    showTimePanel: {
      type: Boolean,
      default: undefined
    }
  }),
  data: function data() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value
    };
  },
  computed: {
    timeVisible: function timeVisible() {
      return typeof this.showTimePanel === 'boolean' ? this.showTimePanel : this.defaultTimeVisible;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    closeTimePanel: function closeTimePanel() {
      this.defaultTimeVisible = false;
      this.$emit('update:show-time-panel', false);
    },
    openTimePanel: function openTimePanel() {
      this.defaultTimeVisible = true;
      this.$emit('update:show-time-panel', true);
    },
    emitDate: function emitDate(dates, type) {
      this.$emit('select', dates, type);
    },
    handleSelect: function handleSelect(dates, type) {
      var _this = this;

      if (type === 'date') {
        this.openTimePanel();
      }

      var defaultValues = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
      var datetimes = dates.map(function (date, i) {
        var time = isValidRangeDate(_this.value) ? _this.value[i] : defaultValues[i];
        return assignTime(date, time);
      });

      if (datetimes[1].getTime() < datetimes[0].getTime()) {
        datetimes = [datetimes[0], datetimes[0]];
      }

      if (datetimes.some(this.disabledTime)) {
        datetimes = dates.map(function (date, i) {
          return assignTime(date, defaultValues[i]);
        });

        if (datetimes.some(this.disabledTime)) {
          this.currentValue = datetimes;
          return;
        }
      }

      this.emitDate(datetimes, type);
    }
  },
  render: function render() {
    var h = arguments[0];
    var calendarProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(CalendarRange.props)), {
        type: 'date',
        value: this.currentValue
      }),
      on: {
        select: this.handleSelect
      }
    };
    var timeProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(TimeRange.props)), {
        value: this.currentValue,
        showTimeHeader: true
      }),
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel
      }
    };
    var prefixClass = this.prefixClass;
    return h("div", [h(CalendarRange, helper([{}, calendarProps])), this.timeVisible && h(TimeRange, helper([{
      "class": "".concat(prefixClass, "-calendar-time")
    }, timeProps]))]);
  }
};

var componentMap = {
  default: CalendarPanel,
  time: __vue_component__$b,
  datetime: DatetimePanel
};
var componentRangeMap = {
  default: CalendarRange,
  time: TimeRange,
  datetime: DatetimeRange
};
var DatePicker = {
  name: 'DatePicker',
  provide: function provide() {
    var _this = this;

    return {
      // make locale reactive
      getLocale: function getLocale() {
        return _this.locale;
      },
      getWeek: this.getWeek,
      prefixClass: this.prefixClass,
      dispatchDatePicker: this.$emit.bind(this)
    };
  },
  props: _objectSpread2({}, DatetimePanel.props, {
    value: {},
    valueType: {
      type: String,
      default: 'date' // date, format, timestamp, or token like 'YYYY-MM-DD'

    },
    type: {
      type: String,
      // ['date', 'datetime', 'time', 'year', 'month', 'week']
      default: 'date'
    },
    format: {
      type: String
    },
    formatter: {
      type: Object
    },
    range: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      type: String
    },
    lang: {
      type: [String, Object]
    },
    placeholder: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    prefixClass: {
      type: String,
      default: 'mx'
    },
    inputClass: {},
    inputAttr: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean,
      default: undefined
    },
    popupClass: {},
    popupStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: 'OK'
    },
    renderInputText: {
      type: Function
    },
    shortcuts: {
      type: Array,
      validator: function validator(value) {
        return Array.isArray(value) && value.every(function (v) {
          return isObject(v) && typeof v.text === 'string' && typeof v.onClick === 'function';
        });
      },
      default: function _default() {
        return [];
      }
    }
  }),
  data: function data() {
    return {
      // cache the innervalue, wait to confirm
      currentValue: null,
      userInput: null,
      defaultOpen: false,
      mouseInInput: false
    };
  },
  computed: {
    popupVisible: function popupVisible() {
      return !this.disabled && (typeof this.open === 'boolean' ? this.open : this.defaultOpen);
    },
    innerRangeSeparator: function innerRangeSeparator() {
      return this.rangeSeparator || (this.multiple ? ',' : ' ~ ');
    },
    innerFormat: function innerFormat() {
      var map = {
        date: 'YYYY-MM-DD',
        datetime: 'YYYY-MM-DD HH:mm:ss',
        year: 'YYYY',
        month: 'YYYY-MM',
        time: 'HH:mm:ss',
        week: 'w'
      };
      return this.format || map[this.type] || map.date;
    },
    innerValue: function innerValue() {
      var value = this.value;

      if (this.validMultipleType) {
        value = Array.isArray(value) ? value : [];
        return value.map(this.value2date);
      }

      if (this.range) {
        value = Array.isArray(value) ? value.slice(0, 2) : [null, null];
        return value.map(this.value2date);
      }

      return this.value2date(value);
    },
    text: function text() {
      var _this2 = this;

      if (this.userInput !== null) {
        return this.userInput;
      }

      if (typeof this.renderInputText === 'function') {
        return this.renderInputText(this.innerValue);
      }

      if (!this.isValidValue(this.innerValue)) {
        return '';
      }

      if (Array.isArray(this.innerValue)) {
        return this.innerValue.map(function (v) {
          return _this2.formatDate(v);
        }).join(this.innerRangeSeparator);
      }

      return this.formatDate(this.innerValue);
    },
    showClearIcon: function showClearIcon() {
      return !this.disabled && this.clearable && this.text && this.mouseInInput;
    },
    locale: function locale() {
      if (isObject(this.lang)) {
        return mergeDeep(getLocale(), this.lang);
      }

      return getLocale(this.lang);
    },
    validMultipleType: function validMultipleType() {
      var types = ['date', 'month', 'year'];
      return this.multiple && !this.range && types.indexOf(this.type) !== -1;
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler: function handler(val) {
        this.currentValue = val;
      }
    },
    popupVisible: {
      handler: function handler(val) {
        if (val) {
          this.currentValue = this.innerValue;
        }
      }
    }
  },
  created: function created() {
    if (_typeof(this.format) === 'object') {
      console.warn("[vue2-datepicker]: The prop `format` don't support Object any more. You can use the new prop `formatter` to replace it");
    }
  },
  methods: {
    handleMouseEnter: function handleMouseEnter() {
      this.mouseInInput = true;
    },
    handleMouseLeave: function handleMouseLeave() {
      this.mouseInInput = false;
    },
    handleClickOutSide: function handleClickOutSide(evt) {
      var target = evt.target;

      if (!this.$el.contains(target)) {
        this.closePopup();
      }
    },
    getFormatter: function getFormatter(key) {
      return isObject(this.formatter) && this.formatter[key] || isObject(this.format) && this.format[key];
    },
    getWeek: function getWeek$1(date, options) {
      if (typeof this.getFormatter('getWeek') === 'function') {
        return this.getFormatter('getWeek')(date, options);
      }

      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.getWeek)(date, options);
    },
    parseDate: function parseDate(value, fmt) {
      fmt = fmt || this.innerFormat;

      if (typeof this.getFormatter('parse') === 'function') {
        return this.getFormatter('parse')(value, fmt);
      }

      var backupDate = new Date();
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.parse)(value, fmt, {
        locale: this.locale.formatLocale,
        backupDate: backupDate
      });
    },
    formatDate: function formatDate(date, fmt) {
      fmt = fmt || this.innerFormat;

      if (typeof this.getFormatter('stringify') === 'function') {
        return this.getFormatter('stringify')(date, fmt);
      }

      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.locale.formatLocale
      });
    },
    // transform the outer value to inner date
    value2date: function value2date(value) {
      switch (this.valueType) {
        case 'date':
          return value instanceof Date ? new Date(value.getTime()) : new Date(NaN);

        case 'timestamp':
          return typeof value === 'number' ? new Date(value) : new Date(NaN);

        case 'format':
          return typeof value === 'string' ? this.parseDate(value) : new Date(NaN);

        default:
          return typeof value === 'string' ? this.parseDate(value, this.valueType) : new Date(NaN);
      }
    },
    // transform the inner date to outer value
    date2value: function date2value(date) {
      if (!isValidDate(date)) return null;

      switch (this.valueType) {
        case 'date':
          return date;

        case 'timestamp':
          return date.getTime();

        case 'format':
          return this.formatDate(date);

        default:
          return this.formatDate(date, this.valueType);
      }
    },
    emitValue: function emitValue(date, type) {
      var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      // fix IE11/10 trigger input event when input is focused. (placeholder !== '')
      this.userInput = null;
      var value = Array.isArray(date) ? date.map(this.date2value) : this.date2value(date);
      this.$emit('input', value);
      this.$emit('change', value, type);

      if (close) {
        this.closePopup();
      }

      return value;
    },
    isValidValue: function isValidValue(value) {
      if (this.validMultipleType) {
        return isValidDates(value);
      }

      if (this.range) {
        return isValidRangeDate(value);
      }

      return isValidDate(value);
    },
    isValidValueAndNotDisabled: function isValidValueAndNotDisabled(value) {
      if (!this.isValidValue(value)) {
        return false;
      }

      var disabledDate = typeof this.disabledDate === 'function' ? this.disabledDate : function () {
        return false;
      };
      var disabledTime = typeof this.disabledTime === 'function' ? this.disabledTime : function () {
        return false;
      };

      if (!Array.isArray(value)) {
        value = [value];
      }

      return value.every(function (v) {
        return !disabledDate(v) && !disabledTime(v);
      });
    },
    handleMultipleDates: function handleMultipleDates(date, dates) {
      if (this.validMultipleType && dates) {
        var nextDates = dates.filter(function (v) {
          return v.getTime() !== date.getTime();
        });

        if (nextDates.length === dates.length) {
          nextDates.push(date);
        }

        return nextDates;
      }

      return date;
    },
    handleSelectDate: function handleSelectDate(val, type, dates) {
      val = this.handleMultipleDates(val, dates);

      if (this.confirm) {
        this.currentValue = val;
      } else {
        this.emitValue(val, type, // this.type === 'datetime', click the time should close popup
        !this.validMultipleType && (type === this.type || type === 'time'));
      }
    },
    clear: function clear() {
      this.emitValue(this.range ? [null, null] : null);
      this.$emit('clear');
    },
    handleClear: function handleClear(evt) {
      evt.stopPropagation();
      this.clear();
    },
    handleConfirmDate: function handleConfirmDate() {
      var value = this.emitValue(this.currentValue);
      this.$emit('confirm', value);
    },
    handleSelectShortcut: function handleSelectShortcut(evt) {
      var index = evt.currentTarget.getAttribute('data-index');
      var item = this.shortcuts[parseInt(index, 10)];

      if (isObject(item) && typeof item.onClick === 'function') {
        var date = item.onClick(this);

        if (date) {
          this.emitValue(date);
        }
      }
    },
    openPopup: function openPopup(evt) {
      if (this.popupVisible || this.disabled) return;
      this.defaultOpen = true;
      this.$emit('open', evt);
      this.$emit('update:open', true);
    },
    closePopup: function closePopup() {
      if (!this.popupVisible) return;
      this.defaultOpen = false;
      this.$emit('close');
      this.$emit('update:open', false);
    },
    blur: function blur() {
      // when use slot input
      if (this.$refs.input) {
        this.$refs.input.blur();
      }
    },
    focus: function focus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
    handleInputChange: function handleInputChange() {
      var _this3 = this;

      if (!this.editable || this.userInput === null) return;
      var text = this.userInput.trim();
      this.userInput = null;

      if (text === '') {
        this.clear();
        return;
      }

      var date;

      if (this.validMultipleType) {
        date = text.split(this.innerRangeSeparator).map(function (v) {
          return _this3.parseDate(v.trim());
        });
      } else if (this.range) {
        var arr = text.split(this.innerRangeSeparator);

        if (arr.length !== 2) {
          // Maybe the separator during the day is the same as the separator for the date
          // eg: 2019-10-09-2020-01-02
          arr = text.split(this.innerRangeSeparator.trim());
        }

        date = arr.map(function (v) {
          return _this3.parseDate(v.trim());
        });
      } else {
        date = this.parseDate(text);
      }

      if (this.isValidValueAndNotDisabled(date)) {
        this.emitValue(date);
        this.blur();
      } else {
        this.$emit('input-error', text);
      }
    },
    handleInputInput: function handleInputInput(evt) {
      // slot input v-model
      this.userInput = typeof evt === 'string' ? evt : evt.target.value;
    },
    handleInputKeydown: function handleInputKeydown(evt) {
      var keyCode = evt.keyCode; // Tab 9 or Enter 13

      if (keyCode === 9) {
        this.closePopup();
      } else if (keyCode === 13) {
        this.handleInputChange();
      }
    },
    handleInputBlur: function handleInputBlur(evt) {
      // tab close
      this.$emit('blur', evt);
    },
    handleInputFocus: function handleInputFocus(evt) {
      this.openPopup(evt);
      this.$emit('focus', evt);
    },
    hasSlot: function hasSlot(name) {
      return !!(this.$slots[name] || this.$scopedSlots[name]);
    },
    renderSlot: function renderSlot(name, fallback, props) {
      var slotFn = this.$scopedSlots[name];

      if (slotFn) {
        return slotFn(props) || fallback;
      }

      return this.$slots[name] || fallback;
    },
    renderInput: function renderInput() {
      var h = this.$createElement;
      var prefixClass = this.prefixClass;

      var props = _objectSpread2({
        name: 'date',
        type: 'text',
        autocomplete: 'off',
        value: this.text,
        class: this.inputClass || "".concat(this.prefixClass, "-input"),
        readonly: !this.editable,
        disabled: this.disabled,
        placeholder: this.placeholder
      }, this.inputAttr);

      var value = props.value,
          className = props.class,
          attrs = _objectWithoutProperties(props, ["value", "class"]);

      var events = {
        keydown: this.handleInputKeydown,
        focus: this.handleInputFocus,
        blur: this.handleInputBlur,
        input: this.handleInputInput,
        change: this.handleInputChange
      };
      var input = this.renderSlot('input', h("input", {
        "domProps": {
          "value": value
        },
        "class": className,
        "attrs": _objectSpread2({}, attrs),
        "on": _objectSpread2({}, events),
        "ref": "input"
      }), {
        props: props,
        events: events
      });
      var calendarIcon = this.type === 'time' ? h(__vue_component__$2) : h(__vue_component__$1); // remove touchstart event to avoid opens the popup while scrolling in mobile #469

      return h("div", {
        "class": "".concat(prefixClass, "-input-wrapper"),
        "on": {
          "mouseenter": this.handleMouseEnter,
          "mouseleave": this.handleMouseLeave,
          "click": this.openPopup
        },
        "ref": "inputWrapper"
      }, [input, this.showClearIcon ? h("i", {
        "class": "".concat(prefixClass, "-icon-clear"),
        "on": {
          "click": this.handleClear
        }
      }, [this.renderSlot('icon-clear', h(__vue_component__$3))]) : h("i", {
        "class": "".concat(prefixClass, "-icon-calendar")
      }, [this.renderSlot('icon-calendar', calendarIcon)])]);
    },
    renderContent: function renderContent() {
      var h = this.$createElement;
      var map = this.range ? componentRangeMap : componentMap;
      var Component = map[this.type] || map.default;

      var props = _objectSpread2({}, pick(this.$props, Object.keys(Component.props)), {
        value: this.currentValue
      });

      var on = _objectSpread2({}, pick(this.$listeners, Component.emits || []), {
        select: this.handleSelectDate
      });

      var content = h(Component, helper([{}, {
        props: props,
        on: on,
        ref: 'picker'
      }]));
      return h("div", {
        "class": "".concat(this.prefixClass, "-datepicker-body")
      }, [this.renderSlot('content', content, {
        value: this.currentValue,
        emit: this.handleSelectDate
      })]);
    },
    renderSidebar: function renderSidebar() {
      var _this4 = this;

      var h = this.$createElement;
      var prefixClass = this.prefixClass;
      return h("div", {
        "class": "".concat(prefixClass, "-datepicker-sidebar")
      }, [this.renderSlot('sidebar', null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      }), this.shortcuts.map(function (v, i) {
        return h("button", {
          "key": i,
          "attrs": {
            "data-index": i,
            "type": "button"
          },
          "class": "".concat(prefixClass, "-btn ").concat(prefixClass, "-btn-text ").concat(prefixClass, "-btn-shortcut"),
          "on": {
            "click": _this4.handleSelectShortcut
          }
        }, [v.text]);
      })]);
    },
    renderHeader: function renderHeader() {
      var h = this.$createElement;
      return h("div", {
        "class": "".concat(this.prefixClass, "-datepicker-header")
      }, [this.renderSlot('header', null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      })]);
    },
    renderFooter: function renderFooter() {
      var h = this.$createElement;
      var prefixClass = this.prefixClass;
      return h("div", {
        "class": "".concat(prefixClass, "-datepicker-footer")
      }, [this.renderSlot('footer', null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      }), this.confirm ? h("button", {
        "attrs": {
          "type": "button"
        },
        "class": "".concat(prefixClass, "-btn ").concat(prefixClass, "-datepicker-btn-confirm"),
        "on": {
          "click": this.handleConfirmDate
        }
      }, [this.confirmText]) : null]);
    }
  },
  render: function render() {
    var _class;

    var h = arguments[0];
    var prefixClass = this.prefixClass,
        inline = this.inline,
        disabled = this.disabled;
    var sidedar = this.hasSlot('sidebar') || this.shortcuts.length ? this.renderSidebar() : null;
    var content = h("div", {
      "class": "".concat(prefixClass, "-datepicker-content")
    }, [this.hasSlot('header') ? this.renderHeader() : null, this.renderContent(), this.hasSlot('footer') || this.confirm ? this.renderFooter() : null]);
    return h("div", {
      "class": (_class = {}, _defineProperty(_class, "".concat(prefixClass, "-datepicker"), true), _defineProperty(_class, "".concat(prefixClass, "-datepicker-range"), this.range), _defineProperty(_class, "".concat(prefixClass, "-datepicker-inline"), inline), _defineProperty(_class, "disabled", disabled), _class)
    }, [!inline ? this.renderInput() : null, !inline ? h(__vue_component__, {
      "ref": "popup",
      "class": this.popupClass,
      "style": this.popupStyle,
      "attrs": {
        "visible": this.popupVisible,
        "appendToBody": this.appendToBody
      },
      "on": {
        "clickoutside": this.handleClickOutSide
      }
    }, [sidedar, content]) : h("div", {
      "class": "".concat(prefixClass, "-datepicker-main")
    }, [sidedar, content])]);
  }
};

DatePicker.locale = locale;

DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  DatePicker.install(window.Vue);
}

_extends(DatePicker, {
  CalendarPanel: CalendarPanel,
  CalendarRange: CalendarRange,
  TimePanel: __vue_component__$b,
  TimeRange: TimeRange,
  DatetimePanel: DatetimePanel,
  DatetimeRange: DatetimeRange
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DatePicker);


/***/ }),

/***/ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js":
/*!********************************************************************!*\
  !*** ./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var Language =
/*#__PURE__*/
function () {
  function Language(language, months, monthsAbbr, days) {
    _classCallCheck(this, Language);

    this.language = language;
    this.months = months;
    this.monthsAbbr = monthsAbbr;
    this.days = days;
    this.rtl = false;
    this.ymd = false;
    this.yearSuffix = '';
  }

  _createClass(Language, [{
    key: "language",
    get: function get() {
      return this._language;
    },
    set: function set(language) {
      if (typeof language !== 'string') {
        throw new TypeError('Language must be a string');
      }

      this._language = language;
    }
  }, {
    key: "months",
    get: function get() {
      return this._months;
    },
    set: function set(months) {
      if (months.length !== 12) {
        throw new RangeError("There must be 12 months for ".concat(this.language, " language"));
      }

      this._months = months;
    }
  }, {
    key: "monthsAbbr",
    get: function get() {
      return this._monthsAbbr;
    },
    set: function set(monthsAbbr) {
      if (monthsAbbr.length !== 12) {
        throw new RangeError("There must be 12 abbreviated months for ".concat(this.language, " language"));
      }

      this._monthsAbbr = monthsAbbr;
    }
  }, {
    key: "days",
    get: function get() {
      return this._days;
    },
    set: function set(days) {
      if (days.length !== 7) {
        throw new RangeError("There must be 7 days for ".concat(this.language, " language"));
      }

      this._days = days;
    }
  }]);

  return Language;
}(); // eslint-disable-next-line

var en = new Language('English', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) // eslint-disable-next-line
;

var utils = {
  /**
   * @type {Boolean}
   */
  useUtc: false,

  /**
   * Returns the full year, using UTC or not
   * @param {Date} date
   */
  getFullYear: function getFullYear(date) {
    return this.useUtc ? date.getUTCFullYear() : date.getFullYear();
  },

  /**
   * Returns the month, using UTC or not
   * @param {Date} date
   */
  getMonth: function getMonth(date) {
    return this.useUtc ? date.getUTCMonth() : date.getMonth();
  },

  /**
   * Returns the date, using UTC or not
   * @param {Date} date
   */
  getDate: function getDate(date) {
    return this.useUtc ? date.getUTCDate() : date.getDate();
  },

  /**
   * Returns the day, using UTC or not
   * @param {Date} date
   */
  getDay: function getDay(date) {
    return this.useUtc ? date.getUTCDay() : date.getDay();
  },

  /**
   * Returns the hours, using UTC or not
   * @param {Date} date
   */
  getHours: function getHours(date) {
    return this.useUtc ? date.getUTCHours() : date.getHours();
  },

  /**
   * Returns the minutes, using UTC or not
   * @param {Date} date
   */
  getMinutes: function getMinutes(date) {
    return this.useUtc ? date.getUTCMinutes() : date.getMinutes();
  },

  /**
   * Sets the full year, using UTC or not
   * @param {Date} date
   */
  setFullYear: function setFullYear(date, value, useUtc) {
    return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value);
  },

  /**
   * Sets the month, using UTC or not
   * @param {Date} date
   */
  setMonth: function setMonth(date, value, useUtc) {
    return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value);
  },

  /**
   * Sets the date, using UTC or not
   * @param {Date} date
   * @param {Number} value
   */
  setDate: function setDate(date, value, useUtc) {
    return this.useUtc ? date.setUTCDate(value) : date.setDate(value);
  },

  /**
   * Check if date1 is equivalent to date2, without comparing the time
   * @see https://stackoverflow.com/a/6202196/4455925
   * @param {Date} date1
   * @param {Date} date2
   */
  compareDates: function compareDates(date1, date2) {
    var d1 = new Date(date1.getTime());
    var d2 = new Date(date2.getTime());

    if (this.useUtc) {
      d1.setUTCHours(0, 0, 0, 0);
      d2.setUTCHours(0, 0, 0, 0);
    } else {
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
    }

    return d1.getTime() === d2.getTime();
  },

  /**
   * Validates a date object
   * @param {Date} date - an object instantiated with the new Date constructor
   * @return {Boolean}
   */
  isValidDate: function isValidDate(date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false;
    }

    return !isNaN(date.getTime());
  },

  /**
   * Return abbreviated week day name
   * @param {Date}
   * @param {Array}
   * @return {String}
   */
  getDayNameAbbr: function getDayNameAbbr(date, days) {
    if (_typeof(date) !== 'object') {
      throw TypeError('Invalid Type');
    }

    return days[this.getDay(date)];
  },

  /**
   * Return name of the month
   * @param {Number|Date}
   * @param {Array}
   * @return {String}
   */
  getMonthName: function getMonthName(month, months) {
    if (!months) {
      throw Error('missing 2nd parameter Months array');
    }

    if (_typeof(month) === 'object') {
      return months[this.getMonth(month)];
    }

    if (typeof month === 'number') {
      return months[month];
    }

    throw TypeError('Invalid type');
  },

  /**
   * Return an abbreviated version of the month
   * @param {Number|Date}
   * @return {String}
   */
  getMonthNameAbbr: function getMonthNameAbbr(month, monthsAbbr) {
    if (!monthsAbbr) {
      throw Error('missing 2nd paramter Months array');
    }

    if (_typeof(month) === 'object') {
      return monthsAbbr[this.getMonth(month)];
    }

    if (typeof month === 'number') {
      return monthsAbbr[month];
    }

    throw TypeError('Invalid type');
  },

  /**
   * Alternative get total number of days in month
   * @param {Number} year
   * @param {Number} m
   * @return {Number}
   */
  daysInMonth: function daysInMonth(year, month) {
    return /8|3|5|10/.test(month) ? 30 : month === 1 ? !(year % 4) && year % 100 || !(year % 400) ? 29 : 28 : 31;
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
  getNthSuffix: function getNthSuffix(day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st';

      case 2:
      case 22:
        return 'nd';

      case 3:
      case 23:
        return 'rd';

      default:
        return 'th';
    }
  },

  /**
   * Formats date object
   * @param {Date}
   * @param {String}
   * @param {Object}
   * @return {String}
   */
  formatDate: function formatDate(date, format, translation) {
    translation = !translation ? en : translation;
    var year = this.getFullYear(date);
    var month = this.getMonth(date) + 1;
    var day = this.getDate(date);
    var str = format.replace(/dd/, ('0' + day).slice(-2)).replace(/d/, day).replace(/yyyy/, year).replace(/yy/, String(year).slice(2)).replace(/MMMM/, this.getMonthName(this.getMonth(date), translation.months)).replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr)).replace(/MM/, ('0' + month).slice(-2)).replace(/M(?!a|ä|e)/, month).replace(/su/, this.getNthSuffix(this.getDate(date))).replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days));
    return str;
  },

  /**
   * Creates an array of dates for each day in between two dates.
   * @param {Date} start
   * @param {Date} end
   * @return {Array}
   */
  createDateArray: function createDateArray(start, end) {
    var dates = [];

    while (start <= end) {
      dates.push(new Date(start));
      start = this.setDate(new Date(start), this.getDate(new Date(start)) + 1);
    }

    return dates;
  },

  /**
   * method used as a prop validator for input values
   * @param {*} val
   * @return {Boolean}
   */
  validateDateInput: function validateDateInput(val) {
    return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number';
  }
};
var makeDateUtils = function makeDateUtils(useUtc) {
  return _objectSpread({}, utils, {
    useUtc: useUtc
  });
};
var utils$1 = _objectSpread({}, utils) // eslint-disable-next-line
;

var script = {
  props: {
    selectedDate: Date,
    resetTypedDate: [Date],
    format: [String, Function],
    translation: Object,
    inline: Boolean,
    id: String,
    name: String,
    refName: String,
    openDate: Date,
    placeholder: String,
    inputClass: [String, Object, Array],
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    disabled: Boolean,
    required: Boolean,
    typeable: Boolean,
    bootstrapStyling: Boolean,
    useUtc: Boolean
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      input: null,
      typedDate: false,
      utils: constructedDateUtils
    };
  },
  computed: {
    formattedValue: function formattedValue() {
      if (!this.selectedDate) {
        return null;
      }

      if (this.typedDate) {
        return this.typedDate;
      }

      return typeof this.format === 'function' ? this.format(this.selectedDate) : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation);
    },
    computedInputClass: function computedInputClass() {
      if (this.bootstrapStyling) {
        if (typeof this.inputClass === 'string') {
          return [this.inputClass, 'form-control'].join(' ');
        }

        return _objectSpread({
          'form-control': true
        }, this.inputClass);
      }

      return this.inputClass;
    }
  },
  watch: {
    resetTypedDate: function resetTypedDate() {
      this.typedDate = false;
    }
  },
  methods: {
    showCalendar: function showCalendar() {
      this.$emit('showCalendar');
    },

    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate: function parseTypedDate(event) {
      // close calendar if escape or enter are pressed
      if ([27, // escape
      13 // enter
      ].includes(event.keyCode)) {
        this.input.blur();
      }

      if (this.typeable) {
        var typedDate = Date.parse(this.input.value);

        if (!isNaN(typedDate)) {
          this.typedDate = this.input.value;
          this.$emit('typedDate', new Date(this.typedDate));
        }
      }
    },

    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred: function inputBlurred() {
      if (this.typeable && isNaN(Date.parse(this.input.value))) {
        this.clearDate();
        this.input.value = null;
        this.typedDate = null;
      }

      this.$emit('closeCalendar');
    },

    /**
     * emit a clearDate event
     */
    clearDate: function clearDate() {
      this.$emit('clearDate');
    }
  },
  mounted: function mounted() {
    this.input = this.$el.querySelector('input');
  }
} // eslint-disable-next-line
;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { class: { "input-group": _vm.bootstrapStyling } },
    [
      _vm.calendarButton
        ? _c(
            "span",
            {
              staticClass: "vdp-datepicker__calendar-button",
              class: { "input-group-prepend": _vm.bootstrapStyling },
              style: { "cursor:not-allowed;": _vm.disabled },
              on: { click: _vm.showCalendar }
            },
            [
              _c(
                "span",
                { class: { "input-group-text": _vm.bootstrapStyling } },
                [
                  _c("i", { class: _vm.calendarButtonIcon }, [
                    _vm._v(
                      "\n        " +
                        _vm._s(_vm.calendarButtonIconContent) +
                        "\n        "
                    ),
                    !_vm.calendarButtonIcon
                      ? _c("span", [_vm._v("…")])
                      : _vm._e()
                  ])
                ]
              )
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _c("input", {
        ref: _vm.refName,
        class: _vm.computedInputClass,
        attrs: {
          type: _vm.inline ? "hidden" : "text",
          name: _vm.name,
          id: _vm.id,
          "open-date": _vm.openDate,
          placeholder: _vm.placeholder,
          "clear-button": _vm.clearButton,
          disabled: _vm.disabled,
          required: _vm.required,
          readonly: !_vm.typeable,
          autocomplete: "off"
        },
        domProps: { value: _vm.formattedValue },
        on: {
          click: _vm.showCalendar,
          keyup: _vm.parseTypedDate,
          blur: _vm.inputBlurred
        }
      }),
      _vm._v(" "),
      _vm.clearButton && _vm.selectedDate
        ? _c(
            "span",
            {
              staticClass: "vdp-datepicker__clear-button",
              class: { "input-group-append": _vm.bootstrapStyling },
              on: {
                click: function($event) {
                  return _vm.clearDate()
                }
              }
            },
            [
              _c(
                "span",
                { class: { "input-group-text": _vm.bootstrapStyling } },
                [
                  _c("i", { class: _vm.clearButtonIcon }, [
                    !_vm.clearButtonIcon ? _c("span", [_vm._v("×")]) : _vm._e()
                  ])
                ]
              )
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm._t("afterDateInput")
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var DateInput = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//
var script$1 = {
  props: {
    showDayView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    fullMonthName: Boolean,
    allowedToShowView: Function,
    dayCellContent: {
      type: Function,
      "default": function _default(day) {
        return day.date;
      }
    },
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    mondayFirst: Boolean,
    useUtc: Boolean
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils
    };
  },
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek: function daysOfWeek() {
      if (this.mondayFirst) {
        var tempDays = this.translation.days.slice();
        tempDays.push(tempDays.shift());
        return tempDays;
      }

      return this.translation.days;
    },

    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays: function blankDays() {
      var d = this.pageDate;
      var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());

      if (this.mondayFirst) {
        return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
      }

      return this.utils.getDay(dObj);
    },

    /**
     * @return {Object[]}
     */
    days: function days() {
      var d = this.pageDate;
      var days = []; // set up a new date object to the beginning of the current 'page'

      var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      var daysInMonth = this.utils.daysInMonth(this.utils.getFullYear(dObj), this.utils.getMonth(dObj));

      for (var i = 0; i < daysInMonth; i++) {
        days.push({
          date: this.utils.getDate(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: this.utils.compareDates(dObj, new Date()),
          isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
          isSaturday: this.utils.getDay(dObj) === 6,
          isSunday: this.utils.getDay(dObj) === 0
        });
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
      }

      return days;
    },

    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName: function currMonthName() {
      var monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
      return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName);
    },

    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName: function currYearName() {
      var yearSuffix = this.translation.yearSuffix;
      return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
    },

    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd: function isYmd() {
      return this.translation.ymd && this.translation.ymd === true;
    },

    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled: function isLeftNavDisabled() {
      return this.isRtl ? this.isNextMonthDisabled(this.pageTimestamp) : this.isPreviousMonthDisabled(this.pageTimestamp);
    },

    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled: function isRightNavDisabled() {
      return this.isRtl ? this.isPreviousMonthDisabled(this.pageTimestamp) : this.isNextMonthDisabled(this.pageTimestamp);
    }
  },
  methods: {
    selectDate: function selectDate(date) {
      if (date.isDisabled) {
        this.$emit('selectedDisabled', date);
        return false;
      }

      this.$emit('selectDate', date);
    },

    /**
     * @return {Number}
     */
    getPageMonth: function getPageMonth() {
      return this.utils.getMonth(this.pageDate);
    },

    /**
     * Emit an event to show the month picker
     */
    showMonthCalendar: function showMonthCalendar() {
      this.$emit('showMonthCalendar');
    },

    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth: function changeMonth(incrementBy) {
      var date = this.pageDate;
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
      this.$emit('changedMonth', date);
    },

    /**
     * Decrement the page month
     */
    previousMonth: function previousMonth() {
      if (!this.isPreviousMonthDisabled()) {
        this.changeMonth(-1);
      }
    },

    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousMonthDisabled: function isPreviousMonthDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }

      var d = this.pageDate;
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d);
    },

    /**
     * Increment the current page month
     */
    nextMonth: function nextMonth() {
      if (!this.isNextMonthDisabled()) {
        this.changeMonth(+1);
      }
    },

    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextMonthDisabled: function isNextMonthDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }

      var d = this.pageDate;
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d);
    },

    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate: function isSelectedDate(dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj);
    },

    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate: function isDisabledDate(date) {
      var _this = this;

      var disabledDates = false;

      if (typeof this.disabledDates === 'undefined') {
        return false;
      }

      if (typeof this.disabledDates.dates !== 'undefined') {
        this.disabledDates.dates.forEach(function (d) {
          if (_this.utils.compareDates(date, d)) {
            disabledDates = true;
            return true;
          }
        });
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.ranges !== 'undefined') {
        this.disabledDates.ranges.forEach(function (range) {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabledDates = true;
              return true;
            }
          }
        });
      }

      if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }

      return disabledDates;
    },

    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate: function isHighlightedDate(date) {
      var _this2 = this;

      if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
        return false;
      }

      var highlighted = false;

      if (typeof this.highlighted === 'undefined') {
        return false;
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach(function (d) {
          if (_this2.utils.compareDates(date, d)) {
            highlighted = true;
            return true;
          }
        });
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to;
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
        highlighted = true;
      }

      return highlighted;
    },
    dayClasses: function dayClasses(day) {
      return {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
        'highlighted': day.isHighlighted,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd
      };
    },

    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart: function isHighlightStart(date) {
      return this.isHighlightedDate(date) && this.highlighted.from instanceof Date && this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.from) === this.utils.getDate(date);
    },

    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd: function isHighlightEnd(date) {
      return this.isHighlightedDate(date) && this.highlighted.to instanceof Date && this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.to) === this.utils.getDate(date);
    },

    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined: function isDefined(prop) {
      return typeof prop !== 'undefined' && prop;
    }
  } // eslint-disable-next-line

};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showDayView,
          expression: "showDayView"
        }
      ],
      class: [_vm.calendarClass, "vdp-datepicker__calendar"],
      style: _vm.calendarStyle,
      on: {
        mousedown: function($event) {
          $event.preventDefault();
        }
      }
    },
    [
      _vm._t("beforeCalendarHeader"),
      _vm._v(" "),
      _c("header", [
        _c(
          "span",
          {
            staticClass: "prev",
            class: { disabled: _vm.isLeftNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.nextMonth() : _vm.previousMonth();
              }
            }
          },
          [_vm._v("<")]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "day__month_btn",
            class: _vm.allowedToShowView("month") ? "up" : "",
            on: { click: _vm.showMonthCalendar }
          },
          [
            _vm._v(
              _vm._s(_vm.isYmd ? _vm.currYearName : _vm.currMonthName) +
                " " +
                _vm._s(_vm.isYmd ? _vm.currMonthName : _vm.currYearName)
            )
          ]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "next",
            class: { disabled: _vm.isRightNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.previousMonth() : _vm.nextMonth();
              }
            }
          },
          [_vm._v(">")]
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { class: _vm.isRtl ? "flex-rtl" : "" },
        [
          _vm._l(_vm.daysOfWeek, function(d) {
            return _c(
              "span",
              { key: d.timestamp, staticClass: "cell day-header" },
              [_vm._v(_vm._s(d))]
            )
          }),
          _vm._v(" "),
          _vm.blankDays > 0
            ? _vm._l(_vm.blankDays, function(d) {
                return _c("span", {
                  key: d.timestamp,
                  staticClass: "cell day blank"
                })
              })
            : _vm._e(),
          _vm._l(_vm.days, function(day) {
            return _c("span", {
              key: day.timestamp,
              staticClass: "cell day",
              class: _vm.dayClasses(day),
              domProps: { innerHTML: _vm._s(_vm.dayCellContent(day)) },
              on: {
                click: function($event) {
                  return _vm.selectDate(day)
                }
              }
            })
          })
        ],
        2
      )
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PickerDay = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

//
var script$2 = {
  props: {
    showMonthView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils
    };
  },
  computed: {
    months: function months() {
      var d = this.pageDate;
      var months = []; // set up a new date object to the beginning of the current 'page'

      var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate())) : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());

      for (var i = 0; i < 12; i++) {
        months.push({
          month: this.utils.getMonthName(i, this.translation.months),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        });
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1);
      }

      return months;
    },

    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName: function pageYearName() {
      var yearSuffix = this.translation.yearSuffix;
      return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
    },

    /**
     * Is the left hand navigation disabled
     * @return {Boolean}
     */
    isLeftNavDisabled: function isLeftNavDisabled() {
      return this.isRtl ? this.isNextYearDisabled(this.pageTimestamp) : this.isPreviousYearDisabled(this.pageTimestamp);
    },

    /**
     * Is the right hand navigation disabled
     * @return {Boolean}
     */
    isRightNavDisabled: function isRightNavDisabled() {
      return this.isRtl ? this.isPreviousYearDisabled(this.pageTimestamp) : this.isNextYearDisabled(this.pageTimestamp);
    }
  },
  methods: {
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth: function selectMonth(month) {
      if (month.isDisabled) {
        return false;
      }

      this.$emit('selectMonth', month);
    },

    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear: function changeYear(incrementBy) {
      var date = this.pageDate;
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
      this.$emit('changedYear', date);
    },

    /**
     * Decrements the year
     */
    previousYear: function previousYear() {
      if (!this.isPreviousYearDisabled()) {
        this.changeYear(-1);
      }
    },

    /**
     * Checks if the previous year is disabled or not
     * @return {Boolean}
     */
    isPreviousYearDisabled: function isPreviousYearDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }

      return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate);
    },

    /**
     * Increments the year
     */
    nextYear: function nextYear() {
      if (!this.isNextYearDisabled()) {
        this.changeYear(1);
      }
    },

    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    isNextYearDisabled: function isNextYearDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }

      return this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(this.pageDate);
    },

    /**
     * Emits an event that shows the year calendar
     */
    showYearCalendar: function showYearCalendar() {
      this.$emit('showYearCalendar');
    },

    /**
     * Whether the selected date is in this month
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedMonth: function isSelectedMonth(date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date) && this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date);
    },

    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledMonth: function isDisabledMonth(date) {
      var disabledDates = false;

      if (typeof this.disabledDates === 'undefined') {
        return false;
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (this.utils.getMonth(date) < this.utils.getMonth(this.disabledDates.to) && this.utils.getFullYear(date) <= this.utils.getFullYear(this.disabledDates.to) || this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (this.utils.getMonth(date) > this.utils.getMonth(this.disabledDates.from) && this.utils.getFullYear(date) >= this.utils.getFullYear(this.disabledDates.from) || this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }

      return disabledDates;
    }
  } // eslint-disable-next-line

};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showMonthView,
          expression: "showMonthView"
        }
      ],
      class: [_vm.calendarClass, "vdp-datepicker__calendar"],
      style: _vm.calendarStyle,
      on: {
        mousedown: function($event) {
          $event.preventDefault();
        }
      }
    },
    [
      _vm._t("beforeCalendarHeader"),
      _vm._v(" "),
      _c("header", [
        _c(
          "span",
          {
            staticClass: "prev",
            class: { disabled: _vm.isLeftNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.nextYear() : _vm.previousYear();
              }
            }
          },
          [_vm._v("<")]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "month__year_btn",
            class: _vm.allowedToShowView("year") ? "up" : "",
            on: { click: _vm.showYearCalendar }
          },
          [_vm._v(_vm._s(_vm.pageYearName))]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "next",
            class: { disabled: _vm.isRightNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.previousYear() : _vm.nextYear();
              }
            }
          },
          [_vm._v(">")]
        )
      ]),
      _vm._v(" "),
      _vm._l(_vm.months, function(month) {
        return _c(
          "span",
          {
            key: month.timestamp,
            staticClass: "cell month",
            class: { selected: month.isSelected, disabled: month.isDisabled },
            on: {
              click: function($event) {
                $event.stopPropagation();
                return _vm.selectMonth(month)
              }
            }
          },
          [_vm._v(_vm._s(month.month))]
        )
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PickerMonth = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//
var script$3 = {
  props: {
    showYearView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean
  },
  computed: {
    years: function years() {
      var d = this.pageDate;
      var years = []; // set up a new date object to the beginning of the current 'page'7

      var dObj = this.useUtc ? new Date(Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate())) : new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());

      for (var i = 0; i < 10; i++) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        });
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1);
      }

      return years;
    },

    /**
     * @return {String}
     */
    getPageDecade: function getPageDecade() {
      var decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10;
      var decadeEnd = decadeStart + 9;
      var yearSuffix = this.translation.yearSuffix;
      return "".concat(decadeStart, " - ").concat(decadeEnd).concat(yearSuffix);
    },

    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled: function isLeftNavDisabled() {
      return this.isRtl ? this.isNextDecadeDisabled(this.pageTimestamp) : this.isPreviousDecadeDisabled(this.pageTimestamp);
    },

    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled: function isRightNavDisabled() {
      return this.isRtl ? this.isPreviousDecadeDisabled(this.pageTimestamp) : this.isNextDecadeDisabled(this.pageTimestamp);
    }
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils
    };
  },
  methods: {
    selectYear: function selectYear(year) {
      if (year.isDisabled) {
        return false;
      }

      this.$emit('selectYear', year);
    },
    changeYear: function changeYear(incrementBy) {
      var date = this.pageDate;
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
      this.$emit('changedDecade', date);
    },
    previousDecade: function previousDecade() {
      if (this.isPreviousDecadeDisabled()) {
        return false;
      }

      this.changeYear(-10);
    },
    isPreviousDecadeDisabled: function isPreviousDecadeDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }

      var disabledYear = this.utils.getFullYear(this.disabledDates.to);
      var lastYearInPreviousPage = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10 - 1;
      return disabledYear > lastYearInPreviousPage;
    },
    nextDecade: function nextDecade() {
      if (this.isNextDecadeDisabled()) {
        return false;
      }

      this.changeYear(10);
    },
    isNextDecadeDisabled: function isNextDecadeDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }

      var disabledYear = this.utils.getFullYear(this.disabledDates.from);
      var firstYearInNextPage = Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10;
      return disabledYear < firstYearInNextPage;
    },

    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear: function isSelectedYear(date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date);
    },

    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear: function isDisabledYear(date) {
      var disabledDates = false;

      if (typeof this.disabledDates === 'undefined' || !this.disabledDates) {
        return false;
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }

      return disabledDates;
    }
  } // eslint-disable-next-line

};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showYearView,
          expression: "showYearView"
        }
      ],
      class: [_vm.calendarClass, "vdp-datepicker__calendar"],
      style: _vm.calendarStyle,
      on: {
        mousedown: function($event) {
          $event.preventDefault();
        }
      }
    },
    [
      _vm._t("beforeCalendarHeader"),
      _vm._v(" "),
      _c("header", [
        _c(
          "span",
          {
            staticClass: "prev",
            class: { disabled: _vm.isLeftNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.nextDecade() : _vm.previousDecade();
              }
            }
          },
          [_vm._v("<")]
        ),
        _vm._v(" "),
        _c("span", [_vm._v(_vm._s(_vm.getPageDecade))]),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "next",
            class: { disabled: _vm.isRightNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.previousDecade() : _vm.nextDecade();
              }
            }
          },
          [_vm._v(">")]
        )
      ]),
      _vm._v(" "),
      _vm._l(_vm.years, function(year) {
        return _c(
          "span",
          {
            key: year.timestamp,
            staticClass: "cell year",
            class: { selected: year.isSelected, disabled: year.isDisabled },
            on: {
              click: function($event) {
                $event.stopPropagation();
                return _vm.selectYear(year)
              }
            }
          },
          [_vm._v(_vm._s(year.year))]
        )
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PickerYear = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

//
var script$4 = {
  components: {
    DateInput: DateInput,
    PickerDay: PickerDay,
    PickerMonth: PickerMonth,
    PickerYear: PickerYear
  },
  props: {
    value: {
      validator: function validator(val) {
        return utils$1.validateDateInput(val);
      }
    },
    name: String,
    refName: String,
    id: String,
    format: {
      type: [String, Function],
      "default": 'dd MMM yyyy'
    },
    language: {
      type: Object,
      "default": function _default() {
        return en;
      }
    },
    openDate: {
      validator: function validator(val) {
        return utils$1.validateDateInput(val);
      }
    },
    dayCellContent: Function,
    fullMonthName: Boolean,
    disabledDates: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object, Array],
    inputClass: [String, Object, Array],
    wrapperClass: [String, Object, Array],
    mondayFirst: Boolean,
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    bootstrapStyling: Boolean,
    initialView: String,
    disabled: Boolean,
    required: Boolean,
    typeable: Boolean,
    useUtc: Boolean,
    minimumView: {
      type: String,
      "default": 'day'
    },
    maximumView: {
      type: String,
      "default": 'year'
    }
  },
  data: function data() {
    var startDate = this.openDate ? new Date(this.openDate) : new Date();
    var constructedDateUtils = makeDateUtils(this.useUtc);
    var pageTimestamp = constructedDateUtils.setDate(startDate, 1);
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp: pageTimestamp,

      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,

      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,

      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date(),
      utils: constructedDateUtils
    };
  },
  watch: {
    value: function value(_value) {
      this.setValue(_value);
    },
    openDate: function openDate() {
      this.setPageDate();
    },
    initialView: function initialView() {
      this.setInitialView();
    }
  },
  computed: {
    computedInitialView: function computedInitialView() {
      if (!this.initialView) {
        return this.minimumView;
      }

      return this.initialView;
    },
    pageDate: function pageDate() {
      return new Date(this.pageTimestamp);
    },
    translation: function translation() {
      return this.language;
    },
    calendarStyle: function calendarStyle() {
      return {
        position: this.isInline ? 'static' : undefined
      };
    },
    isOpen: function isOpen() {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    isInline: function isInline() {
      return !!this.inline;
    },
    isRtl: function isRtl() {
      return this.translation.rtl === true;
    }
  },
  methods: {
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate: function resetDefaultPageDate() {
      if (this.selectedDate === null) {
        this.setPageDate();
        return;
      }

      this.setPageDate(this.selectedDate);
    },

    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar: function showCalendar() {
      if (this.disabled || this.isInline) {
        return false;
      }

      if (this.isOpen) {
        return this.close(true);
      }

      this.setInitialView();
    },

    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView: function setInitialView() {
      var initialView = this.computedInitialView;

      if (!this.allowedToShowView(initialView)) {
        throw new Error("initialView '".concat(this.initialView, "' cannot be rendered based on minimum '").concat(this.minimumView, "' and maximum '").concat(this.maximumView, "'"));
      }

      switch (initialView) {
        case 'year':
          this.showYearCalendar();
          break;

        case 'month':
          this.showMonthCalendar();
          break;

        default:
          this.showDayCalendar();
          break;
      }
    },

    /**
     * Are we allowed to show a specific picker view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView: function allowedToShowView(view) {
      var views = ['day', 'month', 'year'];
      var minimumViewIndex = views.indexOf(this.minimumView);
      var maximumViewIndex = views.indexOf(this.maximumView);
      var viewIndex = views.indexOf(view);
      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    },

    /**
     * Show the day picker
     * @return {Boolean}
     */
    showDayCalendar: function showDayCalendar() {
      if (!this.allowedToShowView('day')) {
        return false;
      }

      this.close();
      this.showDayView = true;
      return true;
    },

    /**
     * Show the month picker
     * @return {Boolean}
     */
    showMonthCalendar: function showMonthCalendar() {
      if (!this.allowedToShowView('month')) {
        return false;
      }

      this.close();
      this.showMonthView = true;
      return true;
    },

    /**
     * Show the year picker
     * @return {Boolean}
     */
    showYearCalendar: function showYearCalendar() {
      if (!this.allowedToShowView('year')) {
        return false;
      }

      this.close();
      this.showYearView = true;
      return true;
    },

    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate: function setDate(timestamp) {
      var date = new Date(timestamp);
      this.selectedDate = date;
      this.setPageDate(date);
      this.$emit('selected', date);
      this.$emit('input', date);
    },

    /**
     * Clear the selected date
     */
    clearDate: function clearDate() {
      this.selectedDate = null;
      this.setPageDate();
      this.$emit('selected', null);
      this.$emit('input', null);
      this.$emit('cleared');
    },

    /**
     * @param {Object} date
     */
    selectDate: function selectDate(date) {
      this.setDate(date.timestamp);

      if (!this.isInline) {
        this.close(true);
      }

      this.resetTypedDate = new Date();
    },

    /**
     * @param {Object} date
     */
    selectDisabledDate: function selectDisabledDate(date) {
      this.$emit('selectedDisabled', date);
    },

    /**
     * @param {Object} month
     */
    selectMonth: function selectMonth(month) {
      var date = new Date(month.timestamp);

      if (this.allowedToShowView('day')) {
        this.setPageDate(date);
        this.$emit('changedMonth', month);
        this.showDayCalendar();
      } else {
        this.selectDate(month);
      }
    },

    /**
     * @param {Object} year
     */
    selectYear: function selectYear(year) {
      var date = new Date(year.timestamp);

      if (this.allowedToShowView('month')) {
        this.setPageDate(date);
        this.$emit('changedYear', year);
        this.showMonthCalendar();
      } else {
        this.selectDate(year);
      }
    },

    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue: function setValue(date) {
      if (typeof date === 'string' || typeof date === 'number') {
        var parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }

      if (!date) {
        this.setPageDate();
        this.selectedDate = null;
        return;
      }

      this.selectedDate = date;
      this.setPageDate(date);
    },

    /**
     * Sets the date that the calendar should open on
     */
    setPageDate: function setPageDate(date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate);
        } else {
          date = new Date();
        }
      }

      this.pageTimestamp = this.utils.setDate(new Date(date), 1);
    },

    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker: function handleChangedMonthFromDayPicker(date) {
      this.setPageDate(date);
      this.$emit('changedMonth', date);
    },

    /**
     * Set the date from a typedDate event
     */
    setTypedDate: function setTypedDate(date) {
      this.setDate(date.getTime());
    },

    /**
     * Close all calendar layers
     * @param {Boolean} emitEvent - emit close event
     */
    close: function close(emitEvent) {
      this.showDayView = this.showMonthView = this.showYearView = false;

      if (!this.isInline) {
        if (emitEvent) {
          this.$emit('closed');
        }

        document.removeEventListener('click', this.clickOutside, false);
      }
    },

    /**
     * Initiate the component
     */
    init: function init() {
      if (this.value) {
        this.setValue(this.value);
      }

      if (this.isInline) {
        this.setInitialView();
      }
    }
  },
  mounted: function mounted() {
    this.init();
  }
} // eslint-disable-next-line
;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "vdp-datepicker",
      class: [_vm.wrapperClass, _vm.isRtl ? "rtl" : ""]
    },
    [
      _c(
        "date-input",
        {
          attrs: {
            selectedDate: _vm.selectedDate,
            resetTypedDate: _vm.resetTypedDate,
            format: _vm.format,
            translation: _vm.translation,
            inline: _vm.inline,
            id: _vm.id,
            name: _vm.name,
            refName: _vm.refName,
            openDate: _vm.openDate,
            placeholder: _vm.placeholder,
            inputClass: _vm.inputClass,
            typeable: _vm.typeable,
            clearButton: _vm.clearButton,
            clearButtonIcon: _vm.clearButtonIcon,
            calendarButton: _vm.calendarButton,
            calendarButtonIcon: _vm.calendarButtonIcon,
            calendarButtonIconContent: _vm.calendarButtonIconContent,
            disabled: _vm.disabled,
            required: _vm.required,
            bootstrapStyling: _vm.bootstrapStyling,
            "use-utc": _vm.useUtc
          },
          on: {
            showCalendar: _vm.showCalendar,
            closeCalendar: _vm.close,
            typedDate: _vm.setTypedDate,
            clearDate: _vm.clearDate
          }
        },
        [_vm._t("afterDateInput", null, { slot: "afterDateInput" })],
        2
      ),
      _vm._v(" "),
      _vm.allowedToShowView("day")
        ? _c(
            "picker-day",
            {
              attrs: {
                pageDate: _vm.pageDate,
                selectedDate: _vm.selectedDate,
                showDayView: _vm.showDayView,
                fullMonthName: _vm.fullMonthName,
                allowedToShowView: _vm.allowedToShowView,
                disabledDates: _vm.disabledDates,
                highlighted: _vm.highlighted,
                calendarClass: _vm.calendarClass,
                calendarStyle: _vm.calendarStyle,
                translation: _vm.translation,
                pageTimestamp: _vm.pageTimestamp,
                isRtl: _vm.isRtl,
                mondayFirst: _vm.mondayFirst,
                dayCellContent: _vm.dayCellContent,
                "use-utc": _vm.useUtc
              },
              on: {
                changedMonth: _vm.handleChangedMonthFromDayPicker,
                selectDate: _vm.selectDate,
                showMonthCalendar: _vm.showMonthCalendar,
                selectedDisabled: _vm.selectDisabledDate
              }
            },
            [
              _vm._t("beforeCalendarHeader", null, {
                slot: "beforeCalendarHeader"
              })
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.allowedToShowView("month")
        ? _c(
            "picker-month",
            {
              attrs: {
                pageDate: _vm.pageDate,
                selectedDate: _vm.selectedDate,
                showMonthView: _vm.showMonthView,
                allowedToShowView: _vm.allowedToShowView,
                disabledDates: _vm.disabledDates,
                calendarClass: _vm.calendarClass,
                calendarStyle: _vm.calendarStyle,
                translation: _vm.translation,
                isRtl: _vm.isRtl,
                "use-utc": _vm.useUtc
              },
              on: {
                selectMonth: _vm.selectMonth,
                showYearCalendar: _vm.showYearCalendar,
                changedYear: _vm.setPageDate
              }
            },
            [
              _vm._t("beforeCalendarHeader", null, {
                slot: "beforeCalendarHeader"
              })
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.allowedToShowView("year")
        ? _c(
            "picker-year",
            {
              attrs: {
                pageDate: _vm.pageDate,
                selectedDate: _vm.selectedDate,
                showYearView: _vm.showYearView,
                allowedToShowView: _vm.allowedToShowView,
                disabledDates: _vm.disabledDates,
                calendarClass: _vm.calendarClass,
                calendarStyle: _vm.calendarStyle,
                translation: _vm.translation,
                isRtl: _vm.isRtl,
                "use-utc": _vm.useUtc
              },
              on: { selectYear: _vm.selectYear, changedDecade: _vm.setPageDate }
            },
            [
              _vm._t("beforeCalendarHeader", null, {
                slot: "beforeCalendarHeader"
              })
            ],
            2
          )
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-64ca2bb5_0", { source: ".rtl {\n  direction: rtl;\n}\n.vdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.vdp-datepicker * {\n  box-sizing: border-box;\n}\n.vdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  width: 300px;\n  border: 1px solid #ccc;\n}\n.vdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n}\n.vdp-datepicker__calendar header span {\n  display: inline-block;\n  text-align: center;\n  width: 71.42857142857143%;\n  float: left;\n}\n.vdp-datepicker__calendar header .prev,\n.vdp-datepicker__calendar header .next {\n  width: 14.285714285714286%;\n  float: left;\n  text-indent: -10000px;\n  position: relative;\n}\n.vdp-datepicker__calendar header .prev:after,\n.vdp-datepicker__calendar header .next:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  border: 6px solid transparent;\n}\n.vdp-datepicker__calendar header .prev:after {\n  border-right: 10px solid #000;\n  margin-left: -5px;\n}\n.vdp-datepicker__calendar header .prev.disabled:after {\n  border-right: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .next:after {\n  border-left: 10px solid #000;\n  margin-left: 5px;\n}\n.vdp-datepicker__calendar header .next.disabled:after {\n  border-left: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled),\n.vdp-datepicker__calendar header .next:not(.disabled),\n.vdp-datepicker__calendar header .up:not(.disabled) {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled):hover,\n.vdp-datepicker__calendar header .next:not(.disabled):hover,\n.vdp-datepicker__calendar header .up:not(.disabled):hover {\n  background: #eee;\n}\n.vdp-datepicker__calendar .disabled {\n  color: #ddd;\n  cursor: default;\n}\n.vdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.vdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.vdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.vdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.vdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.vdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .month,\n.vdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.vdp-datepicker__clear-button,\n.vdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.vdp-datepicker__clear-button.disabled,\n.vdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n", map: {"version":3,"sources":["Datepicker.vue"],"names":[],"mappings":"AAAA;EACE,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;EAChB,YAAY;EACZ,sBAAsB;AACxB;AACA;EACE,cAAc;EACd,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,yBAAyB;EACzB,WAAW;AACb;AACA;;EAEE,0BAA0B;EAC1B,WAAW;EACX,qBAAqB;EACrB,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,4CAA4C;EAC5C,6BAA6B;AAC/B;AACA;EACE,6BAA6B;EAC7B,iBAAiB;AACnB;AACA;EACE,6BAA6B;AAC/B;AACA;EACE,4BAA4B;EAC5B,gBAAgB;AAClB;AACA;EACE,4BAA4B;AAC9B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,gBAAgB;AAClB;AACA;EACE,WAAW;EACX,eAAe;AACjB;AACA;EACE,aAAa;EACb,cAAc;EACd,eAAe;AACjB;AACA;EACE,qBAAqB;EACrB,cAAc;EACd,0BAA0B;EAC1B,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,sBAAsB;EACtB,6BAA6B;AAC/B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,sBAAsB;AACxB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;AAChB;AACA;EACE,WAAW;AACb;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;EACd,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,mBAAmB;AACrB;AACA;;EAEE,cAAc;AAChB;AACA;;EAEE,eAAe;EACf,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,eAAe;AACjB","file":"Datepicker.vue","sourcesContent":[".rtl {\n  direction: rtl;\n}\n.vdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.vdp-datepicker * {\n  box-sizing: border-box;\n}\n.vdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  width: 300px;\n  border: 1px solid #ccc;\n}\n.vdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n}\n.vdp-datepicker__calendar header span {\n  display: inline-block;\n  text-align: center;\n  width: 71.42857142857143%;\n  float: left;\n}\n.vdp-datepicker__calendar header .prev,\n.vdp-datepicker__calendar header .next {\n  width: 14.285714285714286%;\n  float: left;\n  text-indent: -10000px;\n  position: relative;\n}\n.vdp-datepicker__calendar header .prev:after,\n.vdp-datepicker__calendar header .next:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  border: 6px solid transparent;\n}\n.vdp-datepicker__calendar header .prev:after {\n  border-right: 10px solid #000;\n  margin-left: -5px;\n}\n.vdp-datepicker__calendar header .prev.disabled:after {\n  border-right: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .next:after {\n  border-left: 10px solid #000;\n  margin-left: 5px;\n}\n.vdp-datepicker__calendar header .next.disabled:after {\n  border-left: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled),\n.vdp-datepicker__calendar header .next:not(.disabled),\n.vdp-datepicker__calendar header .up:not(.disabled) {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled):hover,\n.vdp-datepicker__calendar header .next:not(.disabled):hover,\n.vdp-datepicker__calendar header .up:not(.disabled):hover {\n  background: #eee;\n}\n.vdp-datepicker__calendar .disabled {\n  color: #ddd;\n  cursor: default;\n}\n.vdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.vdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.vdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.vdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.vdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.vdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .month,\n.vdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.vdp-datepicker__clear-button,\n.vdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.vdp-datepicker__clear-button.disabled,\n.vdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Datepicker = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Datepicker);


/***/ })

}]);