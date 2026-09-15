"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_Consolidation_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/components/DashboardHistoryModal.vue */ "./resources/js/src/view/components/DashboardHistoryModal.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_services_location_cache__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/core/services/location.cache */ "./resources/js/src/core/services/location.cache.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
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
      isEdit: false,
      mode: '',
      options: [{
        text: "Me",
        value: "1"
      }, {
        text: "Participant Group",
        value: "1"
      }],
      logoSrc: "/media/assets/logos/logo-1.png"
    };
  },
  methods: {
    onSelect(value) {
      // Redirect to the selected page
      if (value) {
        window.location.href = value; // This will navigate to the selected page
      }
    },
    generateAwbPDF() {
      const awb_code = this.form.awb_code;
      const awb_no = this.form.awb_no;
      const pdfUrl = `/download-consolidation-pdf/${String(awb_code)}/${String(awb_no)}`;
      window.open(pdfUrl, '_blank');
    },
    mouseover: function () {
      this.isOpen = true;
    },
    mouseleave: function () {
      this.isOpen = false;
    },
    manifest_send() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get(`/user/manifest-send/${this.form.awb_code}${this.form.awb_no}`).then(response => {});
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleModal() {
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
    },
    // location
    getLocation() {
      (0,_core_services_location_cache__WEBPACK_IMPORTED_MODULE_5__.loadLocations)().then(data => {
        this.location = data;
      });
    },
    getHousewayBills(status) {
      this.isFetching = true;
      this.data_items = [];
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get(`/user/get-master-awbs-with-housewaybills`).then(response => {
        this.data_items = response.data;
      }).catch(error => {
        console.error("Failed to fetch items:", error);
      }).finally(() => {
        this.isFetching = false;
      });
    },
    allHousewayBill() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get('/user/get-master-awbs-with-housewaybills').then(response => {
        this.data_items = response.data;
      }).catch(error => {
        console.error("Failed to fetch master AWBs with house waybills:", error);
        this.data_items = [];
      });
    },
    searchWayBills() {
      this.searchPerformed = true;
      this.form.post('/user/search-house-way-bills', {
        awb_no: this.form.awb_no,
        awb_code: this.form.awb_code
      }).then(response => {
        if (response.data && response.data.length) {
          const id = `${String(this.form.awb_code)}${String(this.form.awb_no)}`;
          this.getAirWayBill(id);
          this.consolidation = response.data;
          this.hasSearchResults = true;
        } else {
          this.consolidation = [];
          this.hasSearchResults = false;
        }
      }).catch(error => {
        console.error('Error fetching data:', error);
        this.consolidation = [];
        this.hasSearchResults = false;
      });
    },
    getAirWayBill(id) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get(`/user/airway-bill/${id}`).then(response => {
        if (response.data && response.data.id == id) {
          this.existingData = response.data;
        }
      }).catch(error => {
        this.existingData = null;
        console.error("Failed to fetch data for updating:", error);
      });
    },
    updateform(id) {
      this.form.put(`/user/update-consolidation/${this.form.id}`).then(response => {
        // Waybill updated successfully
      }).catch(error => {
        console.error("Error updating waybill:", error);
      });
    },
    updateHouseWayBill() {
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
      const updateData = {
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
      this.form.put(`/user/update-consolidation/${this.form.id}`, updateData).then(response => {
        this.$bvToast.toast('House waybill updated successfully', {
          title: 'Success',
          variant: 'success',
          solid: true,
          autoHideDelay: 3000
        });
        // Refresh the consolidation data
        this.searchWayBills();
        // Clear the form
        this.clearForm();
      }).catch(error => {
        console.error("Error updating house waybill:", error);
        this.$bvToast.toast('Error updating house waybill. Please try again.', {
          title: 'Error',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000
        });
      });
    },
    cancelUpdate() {
      this.clearForm();
    },
    addDetailsRow() {
      // This method can be used to add a new house waybill row
      // For now, it will clear the form to allow adding new data
      this.clearForm();
    },
    clearForm() {
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
    editConsolidation(id) {
      const item = this.consolidation.find(waybill => waybill.id === id);
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
        this.$nextTick(() => {
          const formElement = document.querySelector('.custom-nav');
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
    deleteConsolidation(index) {
      this.form.tableCodes.splice(index, 1);
    },
    openForm(mode, id = null) {
      this.mode = mode;
      if (mode === 'update' && id && this.existingData) {
        this.form.id = String(this.existingData.id);
        this.form.master_origin = this.existingData.master_origin || '';
        this.form.master_destination = this.existingData.master_destination || '';
        this.form.other_service_information = this.existingData.other_service_information || '';
        this.form.oci_entries = this.existingData.other_custom_information || this.existingData.custom_info || [];
        if (this.existingData.special_handling_info && typeof this.existingData.special_handling_info === 'string') {
          try {
            this.form.tableCodes = JSON.parse(this.existingData.special_handling_info);
          } catch (error) {
            console.error("Error parsing special_handling_info:", error);
            this.form.tableCodes = [];
          }
        } else {
          this.form.tableCodes = [];
        }
        if (this.existingData.consignment_data) {
          this.form.description = this.existingData.consignment_data.description || '';
          this.form.pieces = this.existingData.consignment_data.pieces || '';
          this.form.gross_weight = this.existingData.consignment_data.gross_weight || '';
        }
      }
    },
    getCountry() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get('/user/get-country').then(({
        data
      }) => {
        this.countries = Object.keys(data).map(key => ({
          value: key,
          text: data[key]
        }));
      }).catch(error => {
        console.error("Error fetching countries:", error);
      });
    },
    getAgent() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get(`/user/agent-info/`).then(({
        data
      }) => {
        if (Array.isArray(data) && data.length > 0) {
          this.agent_information = data[0];
          this.iata_cass = {
            iata_agent_code: this.agent_information.iata_agent_code || null,
            iata_agent_cass: this.agent_information.iata_agent_cass || null
          };
        } else {
          this.agent_information = data;
        }
      }).catch(error => {
        console.error("Error fetching agent information:", error);
      });
    },
    getOCIData() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get('/user/get-oci-data').then(({
        data
      }) => {
        if (data && data.oci_custom_info_identifier) {
          this.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(([key, value]) => ({
            value: key,
            text: value
          }));
        } else {
          this.oci_data.oci_custom_info_identifier = [];
        }
        if (data && data.identifiers) {
          this.oci_identifiers.identifiers = Object.entries(data.identifiers).map(([key, value]) => ({
            value: key,
            text: value
          }));
        }
      }).catch(error => {
        console.error("Error fetching countries:", error);
        this.oci_data.oci_custom_info_identifier = [];
      });
    },
    getHouseWayBill(id) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_4__["default"].get(`/user/houseway-bill/${id}`).then(response => {
        this.existingData = response.data;
        this.openForm('update', String(this.existingData.id));
        if (this.existingData && this.existingData.consignment_data) {
          this.isConsignmentAdded = true;
        }
      }).catch(error => {
        console.error("Failed to fetch data for updating:", error);
      });
    },
    handleRadioChange() {
      const selectedCode = this.selectedCode;
      this.form.tableCodes = [];
      this.form.tableCodes.push(selectedCode);
    },
    addManualCode() {
      if (!Array.isArray(this.form.tableCodes)) {
        this.form.tableCodes = [];
      }
      const code = this.selectedCode || this.custom_special_handling_code.trim();
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
    deleteSplCode(index) {
      this.form.tableCodes.splice(index, 1);
    },
    getOriginCode(airportString) {
      if (airportString) {
        return airportString.split(',')[0];
      }
      return '';
    },
    getDestinationCode(airportString) {
      if (airportString) {
        return airportString.split(',')[0];
      }
      return '';
    },
    editOciInfo(index) {
      this.editIndex = index;
      this.oci_info = _objectSpread({}, this.form.oci_entries[index]);
    },
    addOtherCustomInfo() {
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
      for (let key in this.oci_info) {
        if (this.oci_info.hasOwnProperty(key)) {
          this.oci_info[key] = '';
        }
      }
    },
    deleteOciInfo(index) {
      if (this.form.oci_entries.length > index) {
        this.form.oci_entries.splice(index, 1);
      }
    },
    toggleDropdown_departure() {
      this.isDropdownOpen_departure = !this.isDropdownOpen_departure;
    },
    selectOption_departure(item) {
      let source_name = item.destination;
      let final_set = `${item.iata_code}, ${source_name}`;
      this.form.master_origin = final_set;
      this.isDropdownOpen_departure = false;
    },
    toggleDropdown_destination() {
      this.isDropdownOpen_destination = !this.isDropdownOpen_destination;
    },
    selectOption_destination(item) {
      let source_name = item.destination;
      let final_set = `${item.iata_code}, ${source_name}`;
      this.form.master_destination = final_set;
      this.isDropdownOpen_destination = false;
    },
    closeDropdown_departure(event) {
      const dropdownContainer_to = this.$refs.dropdownContainer_departure;
      if (dropdownContainer_to && !dropdownContainer_to.contains(event.target)) {
        this.isDropdownOpen_destination = false;
      }
    },
    closeDropdown_destination(event) {
      const dropdownContainer_des = this.$refs.dropdownContainer_destination;
      if (dropdownContainer_des && !dropdownContainer_des.contains(event.target)) {
        this.isDropdownOpen_departure = false;
      }
    },
    validateNumericInput(evt, field, maxLength) {
      evt = evt || window.event;
      const charCode = evt.which || evt.keyCode;
      if (charCode < 48 || charCode > 57) {
        evt.preventDefault();
      }
      if (this.form[field].length >= maxLength) {
        evt.preventDefault();
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getCurrentUser() {
      // You can get this from your auth store or API
      // For now, returning a placeholder
      return 'Current User';
    },
    selectAndSearchAwb(item) {
      // Fill the search fields with the selected AWB data
      this.form.awb_code = String(item.awb_code);
      this.form.awb_no = String(item.awb_no);

      // Close the modal
      this.$bvModal.hide('modal-s-consolidation');

      // Perform the search automatically
      this.searchWayBills();

      // Show a toast notification
      this.$bvToast.toast(`Searching for AWB ${item.awb_code}-${item.awb_no}`, {
        title: 'Search Initiated',
        variant: 'info',
        solid: true,
        autoHideDelay: 2000
      });
    }
  },
  mounted() {
    this.getLocation();
    this.getCountry();
    this.getOCIData();
    this.allHousewayBill();
    window.addEventListener('click', this.closeDropdown_destination);
    window.addEventListener('click', this.closeDropdown_departure);
  },
  watch: {
    '$route.params.id'(newId) {
      if (newId) {
        this.getAirWayBill(newId);
        this.getHouseWayBill(newId);
      }
    }
  },
  created() {
    const id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.getAirWayBill(id);
      this.getHouseWayBill(id);
    }
    this.getOCIData();
  },
  computed: {
    filteredLocations_destination() {
      const query = this.form.master_destination.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(item => item.iata_code.toLowerCase().includes(query) || item.destination.toLowerCase().includes(query));
    },
    filteredLocations_departure() {
      const query = this.form.master_origin.toLowerCase().trim();
      if (!query) return this.location;
      return this.location.filter(item => item.iata_code.toLowerCase().includes(query) || item.destination.toLowerCase().includes(query));
    }
  },
  components: {
    DashboardHistoryModal: _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "d-flex flex-column flex-lg-row"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
    staticStyle: {
      background: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      "box-shadow": "0 10px 30px rgba(53, 85, 148, 0.1)",
      "z-index": "1",
      "border-radius": "32px",
      flex: "1",
      "min-width": "0"
    }
  }, [_c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10"
  }, [_c("b-row", {
    staticClass: "align-items-center mb-8"
  }, [_c("b-col", {
    attrs: {
      cols: "12",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column"
  }, [_c("span", {
    staticStyle: {
      "text-transform": "uppercase",
      "letter-spacing": "2px",
      "font-size": "0.85rem",
      "font-weight": "700",
      color: "#355594",
      opacity: "0.6",
      "margin-bottom": "0.5rem",
      display: "block"
    }
  }, [_vm._v("Navigation")]), _vm._v(" "), _c("h6", {
    staticStyle: {
      color: "#355594",
      "font-size": "26px !important",
      "line-height": "34px !important",
      "font-weight": "800 !important",
      "letter-spacing": "-0.5px !important",
      "margin-bottom": "1rem",
      "font-family": "'Inter', sans-serif !important"
    }
  }, [_vm._v("Documentation")]), _vm._v(" "), _c("b-form-group", {
    staticClass: "mb-0",
    attrs: {
      id: "fieldset-horizontal"
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      background: "#F0F7FF",
      "border-radius": "12px",
      padding: "6px 16px",
      width: "fit-content",
      border: "1px solid #E6F0FF"
    }
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594",
      "font-size": "1.2rem",
      "margin-right": "12px"
    },
    attrs: {
      icon: "folder2-open"
    }
  }), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control-sm",
    staticStyle: {
      width: "180px",
      border: "0px !important",
      color: "#355594",
      "font-weight": "600",
      background: "transparent",
      cursor: "pointer",
      outline: "none",
      "box-shadow": "none",
      "padding-left": "0"
    },
    on: {
      change: _vm.onSelect
    },
    model: {
      value: _vm.selectedViewPageOption,
      callback: function ($$v) {
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
  }, [_vm._v("Consolidation")])])], 1)])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mt-6 mt-md-0",
    attrs: {
      cols: "12",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-md-end flex-wrap",
    staticStyle: {
      gap: "12px",
      "align-items": "center"
    }
  }, [_c("b-button", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.modal-s-consolidation",
      modifiers: {
        "modal-s-consolidation": true
      }
    }],
    staticClass: "show-btn",
    on: {
      click: function ($event) {
        $event.preventDefault();
        return _vm.getHousewayBills("send");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "clock-history"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("10 Latest")])], 1)], 1)]), _vm._v(" "), _c("DashboardHistoryModal", {
    attrs: {
      id: "modal-s-consolidation",
      title: "Latest Messages",
      mode: "send",
      docType: "consolidation",
      items: _vm.data_items,
      isFetching: _vm.isFetching
    },
    on: {
      action: _vm.selectAndSearchAwb
    },
    scopedSlots: _vm._u([{
      key: "actions",
      fn: function ({
        item
      }) {
        return [_c("div", {
          staticClass: "d-flex flex-column align-items-end"
        }, [_c("p", {
          staticClass: "text-muted small mb-1 font-weight-bold"
        }, [_vm._v("\n                                        Issued: " + _vm._s(_vm.formatDate(item.updated_at)) + "\n                                    ")])])];
      }
    }])
  })], 1)], 1), _vm._v(" "), _c("hr", {
    staticClass: "hr"
  }), _vm._v(" "), _c("div", {
    staticClass: "container px-6 px-sm-8 px-md-10 pt-6 pb-10"
  }, [_c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "align-items-center"
  }, [_c("h4", {
    staticClass: "h-color ml-4 mb-0"
  }, [_vm._v("\n                                " + _vm._s(_vm.form.id ? "Edit House Waybill Details" : "Create Electronic Consolidation (FHL)") + "\n                            ")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center ml-4 mt-7"
  }, [_c("b-form-group", {
    staticClass: "align-items-center mb-0",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols": "auto",
      "content-cols": "auto",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function () {
        return [_c("span", {
          staticClass: "mr-2"
        }, [_vm._v("Master no:")]), _vm._v(" "), _c("span", {
          staticClass: "text-danger mr-2"
        }, [_vm._v("*")])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center flex-wrap",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-form-input", {
    staticClass: "form-control awb-code-input",
    class: {
      "is-invalid": _vm.form.errors.has("awb_code")
    },
    staticStyle: {
      width: "62px"
    },
    attrs: {
      id: "input-horizontal"
    },
    on: {
      keypress: function ($event) {
        return _vm.validateNumericInput($event, "awb_code", 3);
      }
    },
    model: {
      value: _vm.form.awb_code,
      callback: function ($$v) {
        _vm.$set(_vm.form, "awb_code", $$v);
      },
      expression: "form.awb_code"
    }
  }), _vm._v(" "), _c("span", [_vm._v("-")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control awb-no-input",
    class: {
      "is-invalid": _vm.form.errors.has("awb_no")
    },
    staticStyle: {
      width: "150px"
    },
    attrs: {
      id: "input-horizontal-2"
    },
    on: {
      keypress: function ($event) {
        return _vm.validateNumericInput($event, "awb_no", 8);
      }
    },
    model: {
      value: _vm.form.awb_no,
      callback: function ($$v) {
        _vm.$set(_vm.form, "awb_no", $$v);
      },
      expression: "form.awb_no"
    }
  }), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn ml-2",
    on: {
      click: _vm.searchWayBills
    }
  }, [_vm._v("Search")])], 1)])], 1), _vm._v(" "), _c("has-error", {
    class: {
      "d-block": _vm.form.errors.has("awb_code")
    },
    attrs: {
      form: _vm.form,
      field: "awb_code"
    }
  }), _vm._v(" "), _c("has-error", {
    class: {
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
  }, [_c("div", {
    staticClass: "table-responsive-wrapper"
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
      click: function ($event) {
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
      fn: function ({
        navigate,
        href
      }) {
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
  })], 1)]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                " + _vm._s(String(_vm.existingData.awb_code)) + "-" + _vm._s(String(_vm.existingData.awb_no)) + "\n                                            ")]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                " + _vm._s(_vm.existingData.departure_airport) + "\n                                            ")]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                " + _vm._s(_vm.existingData.destination_airport) + "\n                                            ")]), _vm._v(" "), _c("td", {}, [_vm._v("\n                                                T/" + _vm._s(_vm.existingData.consignment_data ? _vm.existingData.consignment_data.pieces : "N/A") + "/" + _vm._s(_vm.existingData.consignment_data ? _vm.existingData.consignment_data.weight_code : "N/A") + "/" + _vm._s(_vm.existingData.consignment_data ? _vm.existingData.consignment_data.gross_weight : "N/A") + "/\n                                            ")])])])]) : _vm._e()])])])], 1), _vm._v(" "), _c("hr", {
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
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("HWB No "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      id: "input-hwb",
      disabled: ""
    },
    model: {
      value: _vm.form.id,
      callback: function ($$v) {
        _vm.$set(_vm.form, "id", $$v);
      },
      expression: "form.id"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Origin "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("div", {
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
      input: function ($event) {
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
        click: function ($event) {
          $event.stopPropagation();
          return _vm.selectOption_departure(item);
        }
      }
    }, [_vm._v("\n                                                                     " + _vm._s(item.iata_code) + " (" + _vm._s(item.destination) + ")\n                                                                 ")]);
  }), 0) : _vm._e()])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Destination "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("div", {
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
      input: function ($event) {
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
        click: function ($event) {
          $event.stopPropagation();
          return _vm.selectOption_destination(item);
        }
      }
    }, [_vm._v("\n                                                                     " + _vm._s(item.iata_code) + " (" + _vm._s(item.destination) + ")\n                                                                 ")]);
  }), 0) : _vm._e()])])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Pieces "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "80px"
    },
    attrs: {
      id: "input-pieces-1"
    },
    model: {
      value: _vm.form.pieces,
      callback: function ($$v) {
        _vm.$set(_vm.form, "pieces", $$v);
      },
      expression: "form.pieces"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "px-3 text-muted"
  }, [_vm._v("of")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    staticStyle: {
      width: "80px"
    },
    attrs: {
      id: "input-pieces-2"
    },
    model: {
      value: _vm.form.pieces,
      callback: function ($$v) {
        _vm.$set(_vm.form, "pieces", $$v);
      },
      expression: "form.pieces"
    }
  })], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Weight "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      id: "input-weight"
    },
    model: {
      value: _vm.form.gross_weight,
      callback: function ($$v) {
        _vm.$set(_vm.form, "gross_weight", $$v);
      },
      expression: "form.gross_weight"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Volume")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-form-input", {
    staticClass: "form-control mr-2",
    staticStyle: {
      flex: "1"
    },
    attrs: {
      id: "input-volume"
    }
  }), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    staticStyle: {
      width: "90px"
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
  }, [_vm._v("in3")])])], 1)])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Nature of Goods "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      id: "input-goods"
    },
    model: {
      value: _vm.form.description,
      callback: function ($$v) {
        _vm.$set(_vm.form, "description", $$v);
      },
      expression: "form.description"
    }
  })], 1)], 1), _vm._v(" "), _c("b-row", {
    staticClass: "align-items-end"
  }, [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "6"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Handling Codes")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-form-select", {
    staticClass: "form-control mr-2",
    staticStyle: {
      flex: "1"
    },
    model: {
      value: _vm.selectedCode,
      callback: function ($$v) {
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
    staticClass: "px-2 text-muted"
  }, [_vm._v("Or")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control ml-2",
    staticStyle: {
      width: "120px"
    },
    attrs: {
      id: "input-custom-handling",
      placeholder: "Custom Code"
    },
    model: {
      value: _vm.custom_special_handling_code,
      callback: function ($$v) {
        _vm.custom_special_handling_code = $$v;
      },
      expression: "custom_special_handling_code"
    }
  })], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4 d-flex justify-content-start",
    staticStyle: {
      gap: "12px"
    },
    attrs: {
      cols: "12",
      md: "6"
    }
  }, [_c("b-button", {
    staticClass: "show-btn",
    on: {
      click: _vm.addManualCode
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle"
    }
  }), _vm._v(" Add Code\n                                                         ")], 1), _vm._v(" "), _c("b-button", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.modal-s-consolidation",
      modifiers: {
        "modal-s-consolidation": true
      }
    }],
    staticClass: "btn btn-outline-secondary",
    staticStyle: {
      "border-radius": "10px",
      height: "38px",
      "font-weight": "500"
    },
    on: {
      click: function ($event) {
        $event.preventDefault();
        return _vm.getHousewayBills("send");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "clock-history"
    }
  }), _vm._v(" 10 Latest\n                                                         ")], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mt-4",
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "table-responsive-wrapper"
  }, [_c("table", {
    staticClass: "table table-bordered table-hover",
    staticStyle: {
      "background-color": "#ffffff",
      "border-radius": "12px",
      overflow: "hidden",
      "border-collapse": "separate",
      "border-spacing": "0"
    }
  }, [_c("thead", [_c("tr", {
    staticStyle: {
      "background-color": "#F8FAFC"
    }
  }, [_c("th", {
    staticClass: "font-weight-bold py-3 px-4",
    staticStyle: {
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Special Handling Codes")]), _vm._v(" "), _c("th", {
    staticClass: "text-center font-weight-bold py-3 px-4",
    staticStyle: {
      width: "100px",
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", [!_vm.form.tableCodes || _vm.form.tableCodes.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-4",
    attrs: {
      colspan: "2"
    }
  }, [_vm._v("No special handling codes added yet.")])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.form.tableCodes, function (code, index) {
    return _c("tr", {
      key: index
    }, [_c("td", {
      staticClass: "py-3 px-4",
      staticStyle: {
        color: "#1E293B",
        "font-weight": "500"
      }
    }, [_vm._v(_vm._s(code))]), _vm._v(" "), _c("td", {
      staticClass: "text-center py-2 px-4"
    }, [_c("b-button", {
      staticClass: "text-danger p-1",
      staticStyle: {
        background: "transparent",
        border: "none"
      },
      attrs: {
        variant: "flat",
        size: "sm"
      },
      on: {
        click: function ($event) {
          return _vm.deleteSplCode(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash",
        "font-scale": "1.2"
      }
    })], 1)], 1)]);
  })], 2)])])])], 1)], 1)])]), _vm._v(" "), _c("b-tab", {
    attrs: {
      title: "Other Customs Information"
    }
  }, [_c("div", {
    staticClass: "ml-3 mt-8"
  }, [_c("div", {
    staticClass: "py-7"
  }, [_c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Country Code")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    model: {
      value: _vm.oci_info.country_code,
      callback: function ($$v) {
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
    }, [_vm._v("\n                                                                 " + _vm._s(country.text) + "\n                                                             ")]);
  })], 2)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Information Identifier")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    class: {
      "is-invalid": _vm.form.errors.has("info_identifier")
    },
    model: {
      value: _vm.oci_info.info_identifier,
      callback: function ($$v) {
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
    }, [_vm._v("\n                                                                 " + _vm._s(oci_option.text) + "\n                                                             ")]);
  })], 2), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: "info_identifier"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Customs Information Identifier")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    class: {
      "is-invalid": _vm.form.errors.has("custom_info_identifier")
    },
    model: {
      value: _vm.oci_info.custom_info_identifier,
      callback: function ($$v) {
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
    }, [_vm._v("\n                                                                 " + _vm._s(oci_options.text) + "\n                                                             ")]);
  })], 2), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.form,
      field: "custom_info_identifier"
    }
  })], 1)], 1), _vm._v(" "), _c("b-row", {
    staticClass: "row-gap-3 align-items-end"
  }, [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      cols: "12",
      md: "9"
    }
  }, [_c("label", {
    staticClass: "premium-field-label"
  }, [_vm._v("Supplementary Information")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      id: "input-supplementary"
    },
    model: {
      value: _vm.oci_info.supplementary_info,
      callback: function ($$v) {
        _vm.$set(_vm.oci_info, "supplementary_info", $$v);
      },
      expression: "oci_info.supplementary_info"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4 d-flex justify-content-md-end",
    attrs: {
      cols: "12",
      md: "3"
    }
  }, [_c("b-button", {
    staticClass: "show-btn btn-block",
    staticStyle: {
      height: "38px"
    },
    on: {
      click: _vm.addOtherCustomInfo
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: _vm.editIndex !== null ? "check-circle" : "plus-circle"
    }
  }), _vm._v("\n                                                             " + _vm._s(_vm.editIndex !== null ? "Update OCI" : "Add OCI") + "\n                                                         ")], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mt-4",
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "table-responsive-wrapper"
  }, [_c("table", {
    staticClass: "table table-bordered table-hover",
    staticStyle: {
      "background-color": "#ffffff",
      "border-radius": "12px",
      overflow: "hidden",
      "border-collapse": "separate",
      "border-spacing": "0"
    }
  }, [_c("thead", [_c("tr", {
    staticStyle: {
      "background-color": "#F8FAFC"
    }
  }, [_c("th", {
    staticClass: "font-weight-bold py-3 px-4",
    staticStyle: {
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Country Code")]), _vm._v(" "), _c("th", {
    staticClass: "font-weight-bold py-3 px-4",
    staticStyle: {
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Info Identifier")]), _vm._v(" "), _c("th", {
    staticClass: "font-weight-bold py-3 px-4",
    staticStyle: {
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Customs Info Identifier")]), _vm._v(" "), _c("th", {
    staticClass: "font-weight-bold py-3 px-4",
    staticStyle: {
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Supplementary Info")]), _vm._v(" "), _c("th", {
    staticClass: "text-center font-weight-bold py-3 px-4",
    staticStyle: {
      width: "120px",
      color: "#475569",
      "font-size": "13px",
      "border-bottom": "2px solid #E2E8F0"
    }
  }, [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", [!_vm.form.oci_entries || _vm.form.oci_entries.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-4",
    attrs: {
      colspan: "5"
    }
  }, [_vm._v("No custom information entries added yet.")])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.form.oci_entries, function (row, index) {
    return _c("tr", {
      key: index
    }, [_c("td", {
      staticClass: "py-3 px-4",
      staticStyle: {
        color: "#1E293B",
        "font-weight": "500"
      }
    }, [_vm._v(_vm._s(row.country_code))]), _vm._v(" "), _c("td", {
      staticClass: "py-3 px-4",
      staticStyle: {
        color: "#1E293B",
        "font-weight": "500"
      }
    }, [_vm._v(_vm._s(row.info_identifier))]), _vm._v(" "), _c("td", {
      staticClass: "py-3 px-4",
      staticStyle: {
        color: "#1E293B",
        "font-weight": "500"
      }
    }, [_vm._v(_vm._s(row.custom_info_identifier))]), _vm._v(" "), _c("td", {
      staticClass: "py-3 px-4",
      staticStyle: {
        color: "#1E293B",
        "font-weight": "500"
      }
    }, [_vm._v(_vm._s(row.supplementary_info))]), _vm._v(" "), _c("td", {
      staticClass: "text-center py-2 px-4"
    }, [_c("b-button", {
      staticClass: "text-primary p-1 mr-2",
      staticStyle: {
        background: "transparent",
        border: "none"
      },
      attrs: {
        variant: "flat",
        size: "sm"
      },
      on: {
        click: function ($event) {
          return _vm.editOciInfo(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "pencil",
        "font-scale": "1.2"
      }
    })], 1), _vm._v(" "), _c("b-button", {
      staticClass: "text-danger p-1",
      staticStyle: {
        background: "transparent",
        border: "none"
      },
      attrs: {
        variant: "flat",
        size: "sm"
      },
      on: {
        click: function ($event) {
          return _vm.deleteOciInfo(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash",
        "font-scale": "1.2"
      }
    })], 1)], 1)]);
  })], 2)])])])], 1)], 1)])])], 1)], 1)])], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-end align-items-center mr-16 pb-5"
  }, [_c("p", {
    staticClass: "mb-0 ml-4 mr-4 h-color",
    staticStyle: {
      "border-bottom": "1px solid #2637a8",
      cursor: "pointer",
      "font-size": "14px"
    },
    on: {
      click: _vm.cancelUpdate
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("p", {
    staticClass: "mb-0 ml-4 mr-4 h-color",
    staticStyle: {
      "border-bottom": "1px solid #2637a8",
      cursor: "pointer",
      "font-size": "14px"
    },
    on: {
      click: _vm.updateHouseWayBill
    }
  }, [_vm._v("Update")]), _vm._v(" "), _c("p", {
    staticClass: "mb-0 ml-4 mr-4 h-color",
    staticStyle: {
      "border-bottom": "1px solid #2637a8",
      cursor: "pointer",
      "font-size": "14px"
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
  }, [_c("div", {
    staticClass: "table-responsive-wrapper"
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
  }, [_vm._v("Nature of Goods")])])])])]), _vm._v(" "), _vm.consolidation && _vm.consolidation.length > 0 ? _vm._l(_vm.consolidation, function (item) {
    return _c("div", {
      key: item.id,
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
        "align-items": "center",
        "white-space": "nowrap"
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
        click: function ($event) {
          return _vm.editConsolidation(item.id);
        }
      }
    }), _vm._v("\n                                             \n                                            "), _c("b-icon", {
      staticStyle: {
        cursor: "pointer"
      },
      attrs: {
        icon: "trash",
        "font-scale": "1"
      },
      on: {
        click: function ($event) {
          return _vm.deleteConsolidation(item.id);
        }
      }
    })], 1)]), _vm._v(" "), _c("div", {
      staticClass: "pl-2",
      staticStyle: {
        width: "200px"
      }
    }, [_c("router-link", {
      attrs: {
        to: `/edit-houseway-bill/${item.id}`
      }
    }, [_vm._v(_vm._s(item.id))])], 1), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "200px"
      }
    }, [_vm._v("\n                                        " + _vm._s(item.master_origin) + "\n                                    ")]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "200px"
      }
    }, [_vm._v("\n                                        " + _vm._s(item.master_destination) + "\n                                    ")]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "200px"
      }
    }, [_vm._v("\n                                        T/" + _vm._s(item.pieces) + "/K/" + _vm._s(item.gross_weight) + "\n                                    ")]), _vm._v(" "), _c("div", {
      staticStyle: {
        width: "407px"
      }
    }, [_vm._v("\n                                        " + _vm._s(item.description) + "\n                                    ")])]);
  }) : _c("div", {
    staticClass: "d-flex justify-content-center text-muted mt-2"
  }, [_c("p", [_vm._v("No house waybills found for this master AWB.")])])], 2)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-end flex-wrap submit-button mt-6",
    staticStyle: {
      gap: "12px",
      "align-items": "center",
      "padding-right": "16px"
    }
  }, [_c("b-button", {
    staticClass: "show-btn",
    attrs: {
      type: "button"
    },
    on: {
      click: _vm.generateAwbPDF
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "file-earmark-pdf"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Generate PDF")])], 1), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    attrs: {
      type: "button",
      id: "manifest-send-btn"
    },
    on: {
      click: function ($event) {
        return _vm.manifest_send();
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "cursor"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Send")])], 1)], 1)])], 1)], 1) : _vm.searchPerformed && !_vm.hasSearchResults ? _c("div", {
    staticClass: "d-flex flex-column align-items-start pt-2 pb-2"
  }, [_c("p", {
    staticClass: "text-danger mt-5"
  }, [_vm._v("No house waybills found for this master AWB.")])]) : _vm._e()], 1)])], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Consolidation.vue":
/*!*****************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Consolidation.vue ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Consolidation_vue_vue_type_template_id_2c8fcb25_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true */ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true");
/* harmony import */ var _Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=script&lang=js");
/* harmony import */ var _Consolidation_vue_vue_type_style_index_0_id_2c8fcb25_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css");
/* harmony import */ var _Consolidation_vue_vue_type_style_index_1_id_2c8fcb25_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css */ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Consolidation_vue_vue_type_template_id_2c8fcb25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Consolidation_vue_vue_type_template_id_2c8fcb25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "2c8fcb25",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/Consolidation.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=script&lang=js":
/*!*****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_template_id_2c8fcb25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_template_id_2c8fcb25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_template_id_2c8fcb25_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=template&id=2c8fcb25&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css":
/*!*************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_0_id_2c8fcb25_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=0&id=2c8fcb25&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Consolidation_vue_vue_type_style_index_1_id_2c8fcb25_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/Consolidation.vue?vue&type=style&index=1&id=2c8fcb25&lang=css");


/***/ })

}]);