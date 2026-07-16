"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_FocusAirImport_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusAirImport",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      successMsg: null,
      validationWarning: null,
      formLoading: false,
      selectedOriginAgent: null,
      selectedDestAgent: null,
      selectedSellingAgent: null,
      selectedConsignee: null,
      selectedTransporter: null,
      selectedCustomBroker: null,
      selectedUnassociatedHawb: null,
      copyConsigneeAddrCheckbox: false,
      uploadProgress: 0,
      customsFilterStatus: "Both",
      customsFilterGate: "",
      filingProcessing: false,
      isCgmValid: false,
      dscLogs: [],
      // Consol main parameters
      form: {
        execution_job_no: "",
        planned_clearance_date: "",
        cargo_type: "Loose",
        job_owner_id: 1,
        consol_type: "Agent Consolidation",
        entities: {
          origin_agent: {
            id: null,
            address: ""
          },
          dest_agent: {
            id: null,
            address: ""
          },
          selling_agent: {
            id: null,
            address: ""
          }
        },
        shipping_details: {
          flight_number: "",
          mawb_number: "",
          carrier_name: "",
          eta_datetime: "",
          etd_datetime: ""
        },
        routing: {
          departure_airport: "",
          destination_airport: "",
          legs: [{
            airport: "",
            carrier: "",
            flight_no: "",
            date: ""
          }]
        },
        attached_house: [],
        packing: {
          piece_count: 0,
          gross_weight: 0.0,
          chargeable_weight: 0.0,
          volume_cbm: 0.0
        },
        delivery_order: {
          delivery_order_no: "",
          delivery_order_date: "",
          status: "hold",
          do_release_fee: 1500.0,
          warehouse_fee: 2500.0,
          consignee_id: null,
          consignee_address: "",
          transporter_id: null,
          customs_broker_id: null,
          high_sea_buyer: "",
          pickup_address: "ACC Chennai Cargo Warehouse Terminal B Gate 12",
          delivery_address: ""
        },
        charges: [{
          code: "AF",
          description: "Air Freight Charges",
          prepaid: 45000.0,
          collect: 0.0
        }, {
          code: "MY",
          description: "Fuel Surcharge",
          prepaid: 8500.0,
          collect: 0.0
        }, {
          code: "SC",
          description: "Security Surcharge",
          prepaid: 1200.0,
          collect: 0.0
        }, {
          code: "DO",
          description: "Delivery Order Release Charges",
          prepaid: 0.0,
          collect: 1500.0
        }],
        financials: {
          payment_status: "Pending",
          invoice_no: "INV-26-8920",
          invoice_amount: 56200.0,
          receipt_no: ""
        },
        customs_filings: [{
          id: 301,
          filing_type: "CGM",
          transaction_status: "accepted",
          customs_house_code: "INMAA4",
          flat_file_path: "s3://f16s-manifests/flat_cgm_301.txt",
          submitted_by: "Jomy George",
          submitted_at: "2026-06-15 10:30 AM"
        }, {
          id: 302,
          filing_type: "SCMTR",
          transaction_status: "rejected",
          customs_house_code: "INMAA4",
          flat_file_path: "s3://f16s-manifests/flat_scm_302.txt",
          submitted_by: "Jomy George",
          submitted_at: "2026-06-15 11:15 AM"
        }],
        e_docket: [{
          file_name: "Commercial_Invoice_Apex.pdf",
          file_size: 245000,
          document_type: "commercial_invoice",
          mime_type: "application/pdf"
        }, {
          file_name: "Packing_List_Apex.pdf",
          file_size: 184000,
          document_type: "packing_list",
          mime_type: "application/pdf"
        }]
      },
      // Dropdown Options Setup
      cargoTypeOptions: [{
        value: "Loose",
        text: "Loose"
      }, {
        value: "ULD",
        text: "ULD"
      }, {
        value: "",
        text: "(Blank)"
      }],
      consolTypeOptions: [{
        value: "Agent Consolidation",
        text: "Agent Consolidation"
      }, {
        value: "Buyer's Consolidation",
        text: "Buyer's Consolidation"
      }, {
        value: "",
        text: "(Blank)"
      }],
      ownerOptions: [{
        value: 1,
        text: "Jomy George"
      }, {
        value: 2,
        text: "KSR Operator"
      }, {
        value: 3,
        text: "Admin"
      }],
      originAgentOptions: [{
        value: null,
        text: "-- Select Origin Agent --"
      }, {
        value: 10,
        text: "Apex Air Logistics (DXB)"
      }, {
        value: 11,
        text: "Gulf Cargo Agency (DOH)"
      }, {
        value: 12,
        text: "Zenith Forwarding (LHR)"
      }],
      destAgentOptions: [{
        value: null,
        text: "-- Select Destination Agent --"
      }, {
        value: 20,
        text: "KSR Freight Forwarders (Chennai)"
      }, {
        value: 21,
        text: "F16s Logistics Pvt Ltd (Mumbai)"
      }],
      sellingAgentOptions: [{
        value: null,
        text: "-- Select Selling Agent --"
      }, {
        value: 30,
        text: "Apex Global Exporters (Dubai)"
      }, {
        value: 31,
        text: "India Cargo Commission Co"
      }],
      consigneeListOptions: [{
        value: null,
        text: "-- Select Consignee --"
      }, {
        value: 50,
        text: "Logistics Gulf Trading Ltd"
      }, {
        value: 51,
        text: "Zenith Textiles India Pvt Ltd"
      }, {
        value: 52,
        text: "Dubai Garment Importers"
      }],
      transporterOptions: [{
        value: null,
        text: "-- Select Transporter --"
      }, {
        value: 60,
        text: "Standard Trucking Chennai Co."
      }, {
        value: 61,
        text: "FastExpress Seafreight Haulers"
      }],
      customBrokerOptions: [{
        value: null,
        text: "-- Select Customs Broker --"
      }, {
        value: 70,
        text: "KSR Clearing House Agent Ltd"
      }, {
        value: 71,
        text: "Direct Self Clearance"
      }],
      doStatusOptions: [{
        value: "hold",
        text: "Hold"
      }, {
        value: "released",
        text: "Released"
      }, {
        value: "cargo_collected",
        text: "Cargo Collected"
      }],
      paymentStatusOptions: [{
        value: "Pending",
        text: "Pending"
      }, {
        value: "Cash",
        text: "Cash"
      }, {
        value: "Cheque",
        text: "Cheque"
      }, {
        value: "Bank Transfer/NEFT",
        text: "Bank Transfer/NEFT"
      }, {
        value: "Credit Account",
        text: "Credit Account"
      }],
      customsFilterOptions: [{
        value: "Both",
        text: "Filter: All Statuses"
      }, {
        value: "accepted",
        text: "Accepted Only"
      }, {
        value: "submitted",
        text: "Submitted Only"
      }, {
        value: "rejected",
        text: "Rejected Only"
      }],
      sendingMethods: [{
        text: "Auto File (ICEGATE Portal)",
        value: "auto"
      }, {
        text: "Manual Upload",
        value: "manual"
      }, {
        text: "Direct Email Gateway",
        value: "email"
      }],
      documentTypeOptions: [{
        value: "commercial_invoice",
        text: "Commercial Invoice"
      }, {
        value: "packing_list",
        text: "Packing List"
      }, {
        value: "certificate_of_origin",
        text: "Certificate of Origin"
      }, {
        value: "awb_copy",
        text: "AWB Copy"
      }, {
        value: "hawb_copy",
        text: "HAWB Copy"
      }, {
        value: "delivery_order",
        text: "Delivery Order"
      }, {
        value: "arrival_notice",
        text: "Arrival Notice"
      }, {
        value: "other",
        text: "Other"
      }],
      // HAWB Table configuration
      hawbTableFields: [{
        key: "hawb_number",
        label: "HAWB Number",
        sortable: true
      }, {
        key: "shipper",
        label: "Shipper"
      }, {
        key: "consignee",
        label: "Consignee"
      }, {
        key: "piece_count",
        label: "Pieces"
      }, {
        key: "gross_weight",
        label: "Gross Wt"
      }, {
        key: "volume_cbm",
        label: "Vol CBM"
      }, {
        key: "actions",
        label: "Action"
      }],
      customsTableFields: [{
        key: "filing_type",
        label: "Filing Type"
      }, {
        key: "transaction_status",
        label: "Transaction Status"
      }, {
        key: "customs_house_code",
        label: "Custom House"
      }, {
        key: "flat_file_path",
        label: "Transmitted File"
      }, {
        key: "submitted_by",
        label: "Filer"
      }, {
        key: "submitted_at",
        label: "Submission Date"
      }, {
        key: "actions",
        label: "Action"
      }],
      // Dimensions Calculator state
      calculatorRows: [{
        pieces: 10,
        length: 120,
        width: 80,
        height: 100,
        volume_cbm: 0.96,
        vol_weight: 160.0
      }, {
        pieces: 5,
        length: 100,
        width: 100,
        height: 120,
        volume_cbm: 0.6,
        vol_weight: 100.0
      }],
      // Master lookup databases
      agentsDatabase: {
        10: {
          name: "Apex Air Logistics (DXB)",
          address: "Suite 405, Air Cargo Terminal\nDubai Int Airport, DXB\nUnited Arab Emirates"
        },
        11: {
          name: "Gulf Cargo Agency (DOH)",
          address: "Gate 15, Warehouse complex\nHamad International Airport\nDoha, Qatar"
        },
        12: {
          name: "Zenith Forwarding (LHR)",
          address: "Aviation House, Terminal 4\nHeathrow Int Airport\nLondon, United Kingdom"
        },
        20: {
          name: "KSR Freight Forwarders (Chennai)",
          address: "No. 42 General Muthaiah St\nACC Terminal Chennai\nChennai, TN 600001, India"
        },
        21: {
          name: "F16s Logistics Pvt Ltd (Mumbai)",
          address: "A-Wing 305, Freight Complex\nSahar Cargo Gate 3, ACC\nMumbai, MH 400099, India"
        },
        30: {
          name: "Apex Global Exporters (Dubai)",
          address: "Jebel Ali Industrial Area 2\nPlot 9048, Warehouses\nDubai, UAE"
        },
        31: {
          name: "India Cargo Commission Co",
          address: "Customs Agent Enclave\nACC Gate 4 Road\nChennai, TN, India"
        }
      },
      consigneeDatabase: {
        50: {
          name: "Logistics Gulf Trading Ltd",
          address: "No. 5 Cargo Ring Road, Jebel Ali Free Zone, Dubai, UAE",
          credit_limit: 500000.00,
          outstanding_balance: 345000.00,
          credit_status: "active",
          default_payment_terms: "Net 30"
        },
        51: {
          name: "Zenith Textiles India Pvt Ltd",
          address: "B-24 Industrial Development Area, Guindy, Chennai, India",
          credit_limit: 800000.00,
          outstanding_balance: 895000.00,
          credit_status: "hold",
          default_payment_terms: "COD Only"
        },
        52: {
          name: "Dubai Garment Importers",
          address: "Al Maktoum St, Deira Trade Center Suite 12, Dubai, UAE",
          credit_limit: 300000.00,
          outstanding_balance: 300000.00,
          credit_status: "suspended",
          default_payment_terms: "Prepaid Required"
        }
      },
      transporterDatabase: {
        60: {
          name: "Standard Trucking Chennai Co.",
          address: "National Highway Bypass 4, Poonamallee, Chennai, India"
        },
        61: {
          name: "FastExpress Seafreight Haulers",
          address: "GNT Road Madhavaram, Container Yard 5, Chennai, India"
        }
      },
      customBrokerDatabase: {
        70: {
          name: "KSR Clearing House Agent Ltd",
          address: "No. 8 Custom Broker Enclave, Air Cargo Gate, Chennai, India"
        },
        71: {
          name: "Direct Self Clearance",
          address: "Inhouse Customs Dept, F16s Operations, India"
        }
      },
      // Unassociated HAWB pool (dynamic linkages)
      unassociatedPool: [{
        id: 901,
        hawb_number: "HAWB-DEL-9482",
        shipper: "Saffron Exotics Ltd",
        consignee: "Logistics Gulf Trading Ltd",
        piece_count: 15,
        gross_weight: 450.0,
        volume_cbm: 1.2
      }, {
        id: 902,
        hawb_number: "HAWB-DXB-3829",
        shipper: "Jebel Ali Polymers",
        consignee: "Zenith Textiles India Pvt Ltd",
        piece_count: 8,
        gross_weight: 1200.0,
        volume_cbm: 3.4
      }, {
        id: 903,
        hawb_number: "HAWB-LHR-8290",
        shipper: "Oxford Instruments",
        consignee: "India Tech Systems Ltd",
        piece_count: 2,
        gross_weight: 85.0,
        volume_cbm: 0.45
      }],
      // CGM Modal Filing variables
      cgmFilingForm: {
        datetime: "",
        consol_no: "",
        customs_house: "INMAA4",
        sending_method: "auto"
      }
    };
  },
  computed: {
    // Unassociated HAWB select choices
    unassociatedHawbOptions: function unassociatedHawbOptions() {
      var opts = [{
        value: null,
        text: "-- Choose House AWB to Link --",
        disabled: true
      }];
      this.unassociatedPool.forEach(function (item) {
        opts.push({
          value: item.id,
          text: "".concat(item.hawb_number, " (").concat(item.shipper, " \u2794 ").concat(item.consignee, ") - ").concat(item.piece_count, " Pcs / ").concat(item.gross_weight, " KGS")
        });
      });
      return opts;
    },
    // Charges summations
    totalChargesPrepaid: function totalChargesPrepaid() {
      return this.form.charges.reduce(function (sum, item) {
        return sum + (Number(item.prepaid) || 0);
      }, 0);
    },
    totalChargesCollect: function totalChargesCollect() {
      return this.form.charges.reduce(function (sum, item) {
        return sum + (Number(item.collect) || 0);
      }, 0);
    },
    // Selected Consignee Object
    selectedConsigneeObj: function selectedConsigneeObj() {
      if (!this.selectedConsignee) return null;
      return this.consigneeDatabase[this.selectedConsignee] || null;
    },
    // Credit gate checks
    isCreditLimitExceeded: function isCreditLimitExceeded() {
      if (!this.selectedConsigneeObj) return false;
      var outstanding = this.selectedConsigneeObj.outstanding_balance || 0;
      var limit = this.selectedConsigneeObj.credit_limit || 0;
      return outstanding > limit || this.selectedConsigneeObj.credit_status === "suspended";
    },
    isDOBlocked: function isDOBlocked() {
      return this.form.financials.payment_status === "Pending" || this.isCreditLimitExceeded || this.form.delivery_order.status === "hold";
    },
    // Dimensions calculator totals
    calcTotalPieces: function calcTotalPieces() {
      return this.calculatorRows.reduce(function (sum, r) {
        return sum + (Number(r.pieces) || 0);
      }, 0);
    },
    calcTotalCbm: function calcTotalCbm() {
      return this.calculatorRows.reduce(function (sum, r) {
        return sum + (Number(r.volume_cbm) || 0);
      }, 0);
    },
    calcTotalVolWeight: function calcTotalVolWeight() {
      return this.calculatorRows.reduce(function (sum, r) {
        return sum + (Number(r.vol_weight) || 0);
      }, 0);
    },
    // Customs listings filtered
    filteredCustomsFilings: function filteredCustomsFilings() {
      var _this = this;
      return this.form.customs_filings.filter(function (f) {
        var matchStatus = _this.customsFilterStatus === "Both" || f.transaction_status === _this.customsFilterStatus;
        var matchGate = !_this.customsFilterGate || f.customs_house_code.toUpperCase().includes(_this.customsFilterGate.toUpperCase());
        return matchStatus && matchGate;
      });
    }
  },
  methods: {
    // Date/Time UI formatter
    formatDateTime: function formatDateTime(dtStr) {
      if (!dtStr) return "TBD";
      return dtStr.replace("T", " ");
    },
    formatWeight: function formatWeight(wtVal) {
      if (wtVal === undefined || wtVal === null) return "0.000";
      return Number(wtVal).toFixed(3);
    },
    formatVol: function formatVol(volVal) {
      if (volVal === undefined || volVal === null) return "0.000";
      return Number(volVal).toFixed(3);
    },
    formatCurrency: function formatCurrency(val) {
      if (val === undefined || val === null) return "₹ 0.00";
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(val);
    },
    getOwnerName: function getOwnerName(ownerId) {
      var matched = this.ownerOptions.find(function (o) {
        return o.value === ownerId;
      });
      return matched ? matched.text : "Jomy George";
    },
    // Demo Data Seeding
    loadDemoConsol: function loadDemoConsol() {
      this.successMsg = "Demo consolidation payload loaded successfully.";
      this.validationWarning = null;
      this.form.execution_job_no = "JOBA-26-9028";
      this.form.planned_clearance_date = "2026-06-20";
      this.form.cargo_type = "Loose";
      this.form.job_owner_id = 1;
      this.form.consol_type = "Agent Consolidation";

      // Fill Entities
      this.selectedOriginAgent = 10;
      this.form.entities.origin_agent = {
        id: 10,
        address: this.agentsDatabase[10].address
      };
      this.selectedDestAgent = 20;
      this.form.entities.dest_agent = {
        id: 20,
        address: this.agentsDatabase[20].address
      };
      this.selectedSellingAgent = 30;
      this.form.entities.selling_agent = {
        id: 30,
        address: this.agentsDatabase[30].address
      };

      // Shipping Details
      this.form.shipping_details = {
        flight_number: "EK502",
        mawb_number: "020-98304921",
        carrier_name: "Emirates Cargo",
        eta_datetime: "2026-06-19T14:30",
        etd_datetime: "2026-06-19T04:15"
      };

      // Routing
      this.form.routing = {
        departure_airport: "DXB",
        destination_airport: "MAA",
        legs: [{
          airport: "DXB",
          carrier: "Emirates",
          flight_no: "EK502",
          date: "2026-06-19"
        }]
      };

      // Bundle items
      this.form.attached_house = [{
        id: 101,
        hawb_number: "HAWB-MAA-2948A",
        shipper: "Zenith Textiles Ltd",
        consignee: "Logistics Gulf Trading Ltd",
        piece_count: 15,
        gross_weight: 1560.0,
        volume_cbm: 4.8
      }, {
        id: 102,
        hawb_number: "HAWB-MAA-2948B",
        shipper: "Apex Leather Exports",
        consignee: "Logistics Gulf Trading Ltd",
        piece_count: 10,
        gross_weight: 850.0,
        volume_cbm: 2.5
      }];

      // Reset Dimensions Calculator to synchronize with mock
      this.calculatorRows = [{
        pieces: 15,
        length: 120,
        width: 80,
        height: 100,
        volume_cbm: 1.44,
        vol_weight: 240.0
      }, {
        pieces: 10,
        length: 100,
        width: 100,
        height: 120,
        volume_cbm: 1.2,
        vol_weight: 200.0
      }];

      // Packing Details aggregates
      this.form.packing = {
        piece_count: 25,
        gross_weight: 2410.0,
        volume_cbm: 7.3,
        chargeable_weight: 2410.0
      };

      // Delivery Order
      this.selectedConsignee = 50;
      this.form.delivery_order.consignee_id = 50;
      this.form.delivery_order.consignee_address = this.consigneeDatabase[50].address;
      this.selectedTransporter = 60;
      this.form.delivery_order.transporter_id = 60;
      this.selectedCustomBroker = 70;
      this.form.delivery_order.customs_broker_id = 70;
      this.form.delivery_order.delivery_address = this.consigneeDatabase[50].address;
      this.copyConsigneeAddrCheckbox = true;
      this.form.delivery_order.delivery_order_no = "DO-AIMP-90280";
      this.form.delivery_order.delivery_order_date = "2026-06-16";
      this.form.delivery_order.status = "released";

      // Financials
      this.form.financials.payment_status = "Credit Account";
      this.form.financials.invoice_no = "INV-26-9028";
      this.form.financials.invoice_amount = 54700.0;
      this.form.financials.receipt_no = "REC-26-4820";
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    resetForm: function resetForm() {
      this.successMsg = null;
      this.validationWarning = null;
      this.selectedOriginAgent = null;
      this.selectedDestAgent = null;
      this.selectedSellingAgent = null;
      this.selectedConsignee = null;
      this.selectedTransporter = null;
      this.selectedCustomBroker = null;
      this.selectedUnassociatedHawb = null;
      this.copyConsigneeAddrCheckbox = false;
      this.form = {
        execution_job_no: "",
        planned_clearance_date: "",
        cargo_type: "Loose",
        job_owner_id: 1,
        consol_type: "Agent Consolidation",
        entities: {
          origin_agent: {
            id: null,
            address: ""
          },
          dest_agent: {
            id: null,
            address: ""
          },
          selling_agent: {
            id: null,
            address: ""
          }
        },
        shipping_details: {
          flight_number: "",
          mawb_number: "",
          carrier_name: "",
          eta_datetime: "",
          etd_datetime: ""
        },
        routing: {
          departure_airport: "",
          destination_airport: "",
          legs: [{
            airport: "",
            carrier: "",
            flight_no: "",
            date: ""
          }]
        },
        attached_house: [],
        packing: {
          piece_count: 0,
          gross_weight: 0.0,
          chargeable_weight: 0.0,
          volume_cbm: 0.0
        },
        delivery_order: {
          delivery_order_no: "",
          delivery_order_date: "",
          status: "hold",
          do_release_fee: 1500.0,
          warehouse_fee: 2500.0,
          consignee_id: null,
          consignee_address: "",
          transporter_id: null,
          customs_broker_id: null,
          high_sea_buyer: "",
          pickup_address: "ACC Chennai Cargo Warehouse Terminal B Gate 12",
          delivery_address: ""
        },
        charges: [{
          code: "AF",
          description: "Air Freight Charges",
          prepaid: 0.0,
          collect: 0.0
        }],
        financials: {
          payment_status: "Pending",
          invoice_no: "",
          invoice_amount: 0.0,
          receipt_no: ""
        },
        customs_filings: [],
        e_docket: []
      };
      this.calculatorRows = [];
    },
    // Agent lookup selection updates
    onOriginAgentSelect: function onOriginAgentSelect() {
      if (this.selectedOriginAgent) {
        this.form.entities.origin_agent = {
          id: this.selectedOriginAgent,
          address: this.agentsDatabase[this.selectedOriginAgent].address
        };
      }
    },
    onDestAgentSelect: function onDestAgentSelect() {
      if (this.selectedDestAgent) {
        this.form.entities.dest_agent = {
          id: this.selectedDestAgent,
          address: this.agentsDatabase[this.selectedDestAgent].address
        };
      }
    },
    onSellingAgentSelect: function onSellingAgentSelect() {
      if (this.selectedSellingAgent) {
        this.form.entities.selling_agent = {
          id: this.selectedSellingAgent,
          address: this.agentsDatabase[this.selectedSellingAgent].address
        };
      }
    },
    // Validation tools
    hasAddressLineOverrun: function hasAddressLineOverrun(addressText) {
      if (!addressText) return false;
      var lines = addressText.split("\n");
      return lines.some(function (line) {
        return line.length > 35;
      });
    },
    validateIataCode: function validateIataCode(airportCode) {
      if (!airportCode) return true;
      return /^[A-Z]{3}$/.test(airportCode);
    },
    validateMawbFormat: function validateMawbFormat(mawbNo) {
      if (!mawbNo) return true;
      return /^\d{3}-\d{8}$/.test(mawbNo);
    },
    // Routing Leg list management
    addRoutingLeg: function addRoutingLeg() {
      this.form.routing.legs.push({
        airport: "",
        carrier: "",
        flight_no: "",
        date: ""
      });
    },
    removeRoutingLeg: function removeRoutingLeg(idx) {
      this.form.routing.legs.splice(idx, 1);
    },
    // HAWB linking methods
    linkHawb: function linkHawb() {
      var _this2 = this;
      if (!this.selectedUnassociatedHawb) return;
      var matchedIdx = this.unassociatedPool.findIndex(function (item) {
        return item.id === _this2.selectedUnassociatedHawb;
      });
      if (matchedIdx !== -1) {
        var item = this.unassociatedPool[matchedIdx];
        this.form.attached_house.push({
          id: item.id,
          hawb_number: item.hawb_number,
          shipper: item.shipper,
          consignee: item.consignee,
          piece_count: item.piece_count,
          gross_weight: item.gross_weight,
          volume_cbm: item.volume_cbm
        });

        // Sum aggregates
        this.form.packing.piece_count += item.piece_count;
        this.form.packing.gross_weight += item.gross_weight;
        this.form.packing.volume_cbm += item.volume_cbm;

        // Dynamic Chargeable Weight calc
        var volWt = item.volume_cbm * 1000000 / 6000;
        this.form.packing.chargeable_weight += Math.max(item.gross_weight, volWt);

        // Remove from pending lookup pool
        this.unassociatedPool.splice(matchedIdx, 1);
        this.selectedUnassociatedHawb = null;
        this.linkHawbSuccess = true;
        setTimeout(function () {
          _this2.linkHawbSuccess = false;
        }, 3000);
      }
    },
    unlinkHawb: function unlinkHawb(itemId) {
      var matchedIdx = this.form.attached_house.findIndex(function (h) {
        return h.id === itemId;
      });
      if (matchedIdx !== -1) {
        var item = this.form.attached_house[matchedIdx];

        // Deduct aggregates
        this.form.packing.piece_count -= item.piece_count;
        this.form.packing.gross_weight -= item.gross_weight;
        this.form.packing.volume_cbm -= item.volume_cbm;
        var volWt = item.volume_cbm * 1000000 / 6000;
        this.form.packing.chargeable_weight -= Math.max(item.gross_weight, volWt);
        if (this.form.packing.chargeable_weight < 0) this.form.packing.chargeable_weight = 0;

        // Push back to unassociated pool
        this.unassociatedPool.push({
          id: item.id,
          hawb_number: item.hawb_number,
          shipper: item.shipper,
          consignee: item.consignee,
          piece_count: item.piece_count,
          gross_weight: item.gross_weight,
          volume_cbm: item.volume_cbm
        });
        this.form.attached_house.splice(matchedIdx, 1);
      }
    },
    // Packing Dimensions calculator calculations
    addDimensionRow: function addDimensionRow() {
      this.calculatorRows.push({
        pieces: 1,
        length: 50,
        width: 50,
        height: 50,
        volume_cbm: 0.125,
        vol_weight: 20.83
      });
    },
    removeDimensionRow: function removeDimensionRow(idx) {
      this.calculatorRows.splice(idx, 1);
    },
    recalcVolumeRow: function recalcVolumeRow(idx) {
      var row = this.calculatorRows[idx];
      var pcs = Number(row.pieces) || 0;
      var l = Number(row.length) || 0;
      var w = Number(row.width) || 0;
      var h = Number(row.height) || 0;

      // Vol in CBM = L * W * H * Pcs / 1,000,000
      row.volume_cbm = pcs * l * w * h / 1000000;
      // Vol Weight = CBM * 166.67 (which is Vol / 6000 inside cubic centimeters)
      row.vol_weight = row.volume_cbm * 166.67;
    },
    applyCalculatorToPacking: function applyCalculatorToPacking() {
      var _this3 = this;
      this.form.packing.piece_count = this.calcTotalPieces;
      this.form.packing.volume_cbm = this.calcTotalCbm;
      // Recalc Chargeable Weight
      this.form.packing.chargeable_weight = Math.max(this.form.packing.gross_weight, this.calcTotalVolWeight);
      this.successMsg = "Calculated volumetric packing dimensions applied to Consol totals.";
      setTimeout(function () {
        _this3.successMsg = null;
      }, 3000);
    },
    // DO Release party lookup selection handlers
    onConsigneeSelect: function onConsigneeSelect() {
      if (this.selectedConsignee) {
        var c = this.consigneeDatabase[this.selectedConsignee];
        this.form.delivery_order.consignee_id = this.selectedConsignee;
        this.form.delivery_order.consignee_address = c.address;
        if (this.copyConsigneeAddrCheckbox) {
          this.form.delivery_order.delivery_address = c.address;
        }
      }
    },
    onTransporterSelect: function onTransporterSelect() {
      if (this.selectedTransporter) {
        this.form.delivery_order.transporter_id = this.selectedTransporter;
      }
    },
    onCustomBrokerSelect: function onCustomBrokerSelect() {
      if (this.selectedCustomBroker) {
        this.form.delivery_order.customs_broker_id = this.selectedCustomBroker;
      }
    },
    toggleAddressCopy: function toggleAddressCopy() {
      if (this.copyConsigneeAddrCheckbox && this.selectedConsignee) {
        this.form.delivery_order.delivery_address = this.consigneeDatabase[this.selectedConsignee].address;
      }
    },
    // DO Printing triggers (Gatekeeped)
    printDO: function printDO() {
      if (this.isDOBlocked) return;
      alert("Printing Delivery Order PDF. Reference: ".concat(this.form.delivery_order.delivery_order_no || 'Pending'));
    },
    printReceipt: function printReceipt() {
      if (this.isDOBlocked) return;
      alert("Printing Payment Receipt PDF. Reference: ".concat(this.form.financials.receipt_no || 'Pending'));
    },
    // Charges handlers
    addChargeItem: function addChargeItem() {
      this.form.charges.push({
        code: "",
        description: "",
        prepaid: 0.0,
        collect: 0.0
      });
    },
    removeChargeItem: function removeChargeItem(idx) {
      this.form.charges.splice(idx, 1);
    },
    // Customs CGM filing modal actions
    openCgmModal: function openCgmModal() {
      this.cgmFilingForm.consol_no = this.form.execution_job_no || "JOBA-26-DRAFT";
      this.cgmFilingForm.datetime = new Date().toISOString().substring(0, 16);
      this.dscLogs = [];
      this.isCgmValid = false;
      this.$bvModal.show("cgm-filing-modal");
    },
    closeCgmModal: function closeCgmModal() {
      this.$bvModal.hide("cgm-filing-modal");
    },
    openSignatureUtility: function openSignatureUtility() {
      alert("Initializing Logi-Sys background digital signature setup (DSC driver download package).");
    },
    submitCgmData: function submitCgmData() {
      var _this4 = this;
      this.filingProcessing = true;
      this.dscLogs = [];

      // Validation
      var errorLines = [];
      if (!this.form.execution_job_no) {
        errorLines.push("[VALIDATION ERROR] Missing Consol job execution number.");
      }
      if (!this.form.shipping_details.mawb_number) {
        errorLines.push("[VALIDATION ERROR] Master Air Waybill (MAWB) number is required.");
      } else if (!this.validateMawbFormat(this.form.shipping_details.mawb_number)) {
        errorLines.push("[VALIDATION ERROR] MAWB number is invalid.");
      }
      if (this.form.attached_house.length === 0) {
        errorLines.push("[VALIDATION ERROR] Consolidation must contain at least one linked HAWB.");
      }
      setTimeout(function () {
        _this4.filingProcessing = false;
        if (errorLines.length > 0) {
          _this4.dscLogs.push({
            type: "error",
            text: "Manifest validation checks failed:"
          });
          errorLines.forEach(function (err) {
            _this4.dscLogs.push({
              type: "error",
              text: "  ".concat(err)
            });
          });
          _this4.isCgmValid = false;
        } else {
          _this4.dscLogs.push({
            type: "info",
            text: "[VALIDATION OK] Validating manifest records for Consol: ".concat(_this4.cgmFilingForm.consol_no)
          });
          _this4.dscLogs.push({
            type: "info",
            text: "[SYSTEM] Package pieces matching confirmed: ".concat(_this4.form.packing.piece_count, " PCS")
          });
          _this4.dscLogs.push({
            type: "info",
            text: "[SYSTEM] Manifest XML formatted. Target port: ".concat(_this4.cgmFilingForm.customs_house.toUpperCase())
          });
          _this4.dscLogs.push({
            type: "success",
            text: "[SUCCESS] XML manifest structure built. Ready for Digital Signature Token encryption."
          });
          _this4.isCgmValid = true;
        }
      }, 1000);
    },
    sendForSignature: function sendForSignature() {
      var _this5 = this;
      if (!this.isCgmValid) return;
      this.filingProcessing = true;

      // Queue logs with delays
      var steps = [{
        text: "[DSC] Connecting USB Digital Signature Certificate (DSC)...",
        type: "info",
        delay: 800
      }, {
        text: "[DSC] Found Active Profile: 'JOMY GEORGE (e-Mudhra Class 3 Signer)'",
        type: "info",
        delay: 1500
      }, {
        text: "[DSC] Running PIN authorization challenge... Accepted.",
        type: "success",
        delay: 2200
      }, {
        text: "[DSC] Encrypting cargo manifest flat-file structure...",
        type: "info",
        delay: 3000
      }, {
        text: "[ICEGATE] Signed file successfully transmitted via HTTPS gateway.",
        type: "success",
        delay: 4000
      }, {
        text: "[ICEGATE] Response code: 200. IGM Reference Received: SCMTR-AIMP-9028",
        type: "success",
        delay: 4800
      }];
      steps.forEach(function (step) {
        setTimeout(function () {
          _this5.dscLogs.push({
            type: step.type,
            text: step.text
          });

          // Final step updates list
          if (step.text.includes("IGM Reference")) {
            _this5.filingProcessing = false;

            // Add filing to list
            var newFiling = {
              id: 300 + Math.floor(Math.random() * 900),
              filing_type: "CGM",
              transaction_status: "accepted",
              customs_house_code: _this5.cgmFilingForm.customs_house.toUpperCase(),
              flat_file_path: "s3://f16s-manifests/flat_cgm_signed_".concat(Math.floor(100 + Math.random() * 900), ".txt"),
              submitted_by: "Jomy George",
              submitted_at: new Date().toISOString().replace("T", " ").substring(0, 16)
            };
            _this5.form.customs_filings.push(newFiling);
            _this5.successMsg = "IGM/CGM customs filing accepted by ICEGATE for Consol: ".concat(_this5.cgmFilingForm.consol_no, ". Reference recorded.");
            setTimeout(function () {
              _this5.successMsg = null;
            }, 5000);
          }
        }, step.delay);
      });
    },
    getBadgeClassForCustoms: function getBadgeClassForCustoms(status) {
      if (status === "accepted") return "badge-light-success";
      if (status === "submitted") return "badge-light-warning";
      if (status === "rejected") return "badge-light-danger";
      return "badge-light-secondary";
    },
    getDscLogClass: function getDscLogClass(type) {
      if (type === "error") return "text-danger";
      if (type === "success") return "text-success";
      return "text-info";
    },
    getBadgeClassForCredit: function getBadgeClassForCredit(status) {
      if (status === "active") return "badge-light-success";
      if (status === "hold") return "badge-light-warning";
      if (status === "suspended") return "badge-light-danger";
      return "badge-light-secondary";
    },
    viewFilingLog: function viewFilingLog(filing) {
      alert("ICEGATE Log Output (ID ".concat(filing.id, "):\nFiling Status: ").concat(filing.transaction_status.toUpperCase(), "\nCustoms Port: ").concat(filing.customs_house_code, "\nFile: ").concat(filing.flat_file_path, "\nSubmitted: ").concat(filing.submitted_at));
    },
    // E-Docket dropzone select methods
    triggerFileInput: function triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect: function handleFileSelect(e) {
      var files = Array.from(e.target.files);
      this.uploadFiles(files);
    },
    handleFileDrop: function handleFileDrop(e) {
      var files = Array.from(e.dataTransfer.files);
      this.uploadFiles(files);
    },
    uploadFiles: function uploadFiles(files) {
      var _this6 = this;
      if (files.length === 0) return;
      this.uploadProgress = 10;
      var interval = setInterval(function () {
        _this6.uploadProgress += 15;
        if (_this6.uploadProgress >= 100) {
          clearInterval(interval);
          _this6.uploadProgress = 0;

          // Push uploaded
          files.forEach(function (f) {
            _this6.form.e_docket.push({
              file_name: f.name,
              file_size: f.size,
              document_type: "other",
              mime_type: f.type || "application/pdf"
            });
          });
          _this6.successMsg = "".concat(files.length, " document(s) uploaded to Consol E-Docket archive.");
          setTimeout(function () {
            _this6.successMsg = null;
          }, 3000);
        }
      }, 200);
    },
    deleteDocketFile: function deleteDocketFile(idx) {
      this.form.e_docket.splice(idx, 1);
    },
    formatBytes: function formatBytes(bytes) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      if (bytes === 0) return "0 Bytes";
      var k = 1024;
      var dm = decimals < 0 ? 0 : decimals;
      var sizes = ["Bytes", "KB", "MB", "GB"];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    // Global save handler
    saveConsol: function saveConsol() {
      var _this7 = this;
      this.formLoading = true;
      this.validationWarning = null;
      this.successMsg = null;

      // Validation
      var isValid = true;
      var warnMsg = [];
      if (!this.form.execution_job_no) {
        isValid = false;
        warnMsg.push("Consol execution job number is required.");
      }
      if (this.hasAddressLineOverrun(this.form.entities.origin_agent.address) || this.hasAddressLineOverrun(this.form.entities.dest_agent.address) || this.hasAddressLineOverrun(this.form.entities.selling_agent.address)) {
        warnMsg.push("One or more address fields exceed Cargo-XML line limits (35 characters).");
      }
      if (!this.validateMawbFormat(this.form.shipping_details.mawb_number)) {
        warnMsg.push("MAWB Number does not match standard IATA format.");
      }
      if (!this.validateIataCode(this.form.routing.departure_airport) || !this.validateIataCode(this.form.routing.destination_airport)) {
        warnMsg.push("Departure and Destination airport codes must be exactly 3 uppercase letters.");
      }
      setTimeout(function () {
        _this7.formLoading = false;
        if (!isValid || warnMsg.length > 0) {
          _this7.validationWarning = "Validation warnings detected: " + warnMsg.join(" ");
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          _this7.successMsg = "Consol job folder ".concat(_this7.form.execution_job_no, " saved successfully in local cache.");
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          setTimeout(function () {
            _this7.successMsg = null;
          }, 5000);
        }
      }, 1000);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-container", {
    staticClass: "body-color",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-lg-row"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
    staticClass: "ml-lg-4 mt-4 mt-lg-0",
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
    staticClass: "container py-8 px-6 px-sm-8 px-md-10 font-outfit"
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-8"
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
  }, [_vm._v("Air Import")]), _vm._v(" "), _c("h6", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      color: "#355594",
      "font-size": "26px !important",
      "line-height": "34px !important",
      "font-weight": "800 !important",
      "letter-spacing": "-0.5px !important",
      "margin-bottom": "0.5rem",
      "font-family": "'Inter', sans-serif !important"
    }
  }, [_c("b-icon", {
    staticClass: "mr-3",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "airplane-engines"
    }
  }), _vm._v("\n        Import Consol Manager\n      ")], 1), _vm._v(" "), _c("span", {
    staticStyle: {
      color: "#5A6B8A",
      "font-size": "0.9rem"
    }
  }, [_vm._v("Manage inbound flights, consolidate HAWBs, coordinate customs filings, and issue delivery orders")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center gap-2"
  }, [_c("b-button", {
    staticClass: "show-btn",
    on: {
      click: _vm.loadDemoConsol
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-warning",
    attrs: {
      icon: "lightning-fill"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Load Demo")])], 1), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    on: {
      click: _vm.resetForm
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-danger",
    attrs: {
      icon: "arrow-counterclockwise"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Reset")])], 1), _vm._v(" "), _c("router-link", {
    staticClass: "show-btn text-decoration-none",
    attrs: {
      to: "/inbox"
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "arrow-left"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Back to Inbox")])], 1)], 1)]), _vm._v(" "), _vm.form.execution_job_no || _vm.form.shipping_details.flight_number ? _c("div", {
    staticClass: "mbl-summary-banner p-5 mb-6 rounded-lg animate-fade-in d-flex flex-column flex-md-row justify-content-between align-items-md-center"
  }, [_c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-4"
  }, [_c("div", {
    staticClass: "px-4 py-2 border-right-premium mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Consol Job / Enquiry No")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value text-indigo font-weight-bold mb-0",
    staticStyle: {
      color: "#355594 !important"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.form.execution_job_no || "DRAFT") + "\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v(_vm._s(_vm.form.consol_type))])]), _vm._v(" "), _c("div", {
    staticClass: "px-4 py-2 border-right-premium mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Flight Details")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value mb-0 font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.form.shipping_details.flight_number || "TBD") + "\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("Carrier: " + _vm._s(_vm.form.shipping_details.carrier_name || "TBD"))])]), _vm._v(" "), _c("div", {
    staticClass: "px-4 py-2 border-right-premium mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Route")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value mb-0 font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.form.routing.departure_airport || "TBD") + " ➔ " + _vm._s(_vm.form.routing.destination_airport || "TBD") + "\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("ETA: " + _vm._s(_vm.formatDateTime(_vm.form.shipping_details.eta_datetime)))])]), _vm._v(" "), _c("div", {
    staticClass: "px-4 py-2 mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Payload Totals")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value mb-0 font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.formatWeight(_vm.form.packing.gross_weight)) + " KGS / " + _vm._s(_vm.form.packing.piece_count) + " PCS\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("Vol: " + _vm._s(_vm.formatVol(_vm.form.packing.volume_cbm)) + " CBM / Chg Wt: " + _vm._s(_vm.formatWeight(_vm.form.packing.chargeable_weight)) + " KGS")])])]), _vm._v(" "), _c("div", {
    staticClass: "text-right d-flex flex-column align-items-end mt-3 mt-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Consol Owner")]), _vm._v(" "), _c("span", {
    staticClass: "badge badge-light-primary px-3 py-2 mt-1"
  }, [_vm._v(_vm._s(_vm.getOwnerName(_vm.form.job_owner_id)))])])]) : _vm._e(), _vm._v(" "), _vm.successMsg ? _c("div", {
    staticClass: "alert alert-custom alert-light-success mb-6 shadow-sm animate-fade-in"
  }, [_c("div", {
    staticClass: "alert-icon"
  }, [_c("i", {
    staticClass: "fas fa-check-circle text-success"
  })]), _vm._v(" "), _c("div", {
    staticClass: "alert-text font-weight-bold"
  }, [_vm._v(_vm._s(_vm.successMsg))])]) : _vm._e(), _vm._v(" "), _vm.validationWarning ? _c("div", {
    staticClass: "alert alert-custom alert-light-warning mb-6 shadow-sm animate-fade-in"
  }, [_c("div", {
    staticClass: "alert-icon"
  }, [_c("b-icon", {
    staticClass: "text-warning",
    attrs: {
      icon: "exclamation-triangle-fill"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "alert-text font-weight-bold"
  }, [_vm._v(_vm._s(_vm.validationWarning))])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6 mb-6"
  }, [_c("h4", {
    staticClass: "h-color mb-5 d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-3",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "info-circle"
    }
  }), _vm._v(" Consolidation Core Parameters\n    ")], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol No *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    "class": {
      "border-warning-premium": _vm.form.execution_job_no && _vm.form.execution_job_no.length > 30
    },
    attrs: {
      required: "",
      placeholder: "e.g. JOBA-26-9028"
    },
    model: {
      value: _vm.form.execution_job_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "execution_job_no", $$v);
      },
      expression: "form.execution_job_no"
    }
  }), _vm._v(" "), _vm.form.execution_job_no && _vm.form.execution_job_no.length > 30 ? _c("span", {
    staticClass: "text-warning small"
  }, [_vm._v("Max 30 characters limit.")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Planned Clearance Date *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "date",
      required: ""
    },
    model: {
      value: _vm.form.planned_clearance_date,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "planned_clearance_date", $$v);
      },
      expression: "form.planned_clearance_date"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "2"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Cargo Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.cargoTypeOptions
    },
    model: {
      value: _vm.form.cargo_type,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "cargo_type", $$v);
      },
      expression: "form.cargo_type"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "2"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Owner *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.ownerOptions,
      required: ""
    },
    model: {
      value: _vm.form.job_owner_id,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "job_owner_id", $$v);
      },
      expression: "form.job_owner_id"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "2"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.consolTypeOptions
    },
    model: {
      value: _vm.form.consol_type,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "consol_type", $$v);
      },
      expression: "form.consol_type"
    }
  })], 1)], 1)], 1)], 1), _vm._v(" "), _c("b-card", {
    staticClass: "bg-transparent border-0",
    attrs: {
      "no-body": ""
    }
  }, [_c("b-tabs", {
    staticClass: "custom-nav-tabs",
    attrs: {
      "content-class": "mt-6"
    }
  }, [_c("b-tab", {
    attrs: {
      active: ""
    },
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "people"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Entity Details")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "entity-card p-5 rounded-lg h-100"
  }, [_c("h6", {
    staticClass: "h-color mb-4 d-flex align-items-center"
  }, [_c("span", {
    staticClass: "badge badge-light-indigo mr-2"
  }, [_vm._v("1")]), _vm._v(" Origin Agent\n              ")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Search Origin Agent",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.originAgentOptions
    },
    on: {
      change: _vm.onOriginAgentSelect
    },
    model: {
      value: _vm.selectedOriginAgent,
      callback: function callback($$v) {
        _vm.selectedOriginAgent = $$v;
      },
      expression: "selectedOriginAgent"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Agent Address Blocks (Cargo-XML 35 Chars/Line)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    "class": {
      "border-warning-premium": _vm.hasAddressLineOverrun(_vm.form.entities.origin_agent.address)
    },
    attrs: {
      rows: "5",
      placeholder: "Enter full address details..."
    },
    model: {
      value: _vm.form.entities.origin_agent.address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.entities.origin_agent, "address", $$v);
      },
      expression: "form.entities.origin_agent.address"
    }
  }), _vm._v(" "), _vm.hasAddressLineOverrun(_vm.form.entities.origin_agent.address) ? _c("div", {
    staticClass: "text-warning-premium small mt-1"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n                  Line exceeds 35 character limits! (Cargo-XML transmission standard)\n                ")], 1) : _vm._e()], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "entity-card p-5 rounded-lg h-100"
  }, [_c("h6", {
    staticClass: "h-color mb-4 d-flex align-items-center"
  }, [_c("span", {
    staticClass: "badge badge-light-indigo mr-2"
  }, [_vm._v("2")]), _vm._v(" Destination Agent\n              ")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Search Destination Agent",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.destAgentOptions
    },
    on: {
      change: _vm.onDestAgentSelect
    },
    model: {
      value: _vm.selectedDestAgent,
      callback: function callback($$v) {
        _vm.selectedDestAgent = $$v;
      },
      expression: "selectedDestAgent"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Agent Address Blocks (Cargo-XML 35 Chars/Line)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    "class": {
      "border-warning-premium": _vm.hasAddressLineOverrun(_vm.form.entities.dest_agent.address)
    },
    attrs: {
      rows: "5",
      placeholder: "Enter full address details..."
    },
    model: {
      value: _vm.form.entities.dest_agent.address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.entities.dest_agent, "address", $$v);
      },
      expression: "form.entities.dest_agent.address"
    }
  }), _vm._v(" "), _vm.hasAddressLineOverrun(_vm.form.entities.dest_agent.address) ? _c("div", {
    staticClass: "text-warning-premium small mt-1"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n                  Line exceeds 35 character limits! (Cargo-XML transmission standard)\n                ")], 1) : _vm._e()], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "entity-card p-5 rounded-lg h-100"
  }, [_c("h6", {
    staticClass: "h-color mb-4 d-flex align-items-center"
  }, [_c("span", {
    staticClass: "badge badge-light-indigo mr-2"
  }, [_vm._v("3")]), _vm._v(" Selling Agent\n              ")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Search Selling Agent",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.sellingAgentOptions
    },
    on: {
      change: _vm.onSellingAgentSelect
    },
    model: {
      value: _vm.selectedSellingAgent,
      callback: function callback($$v) {
        _vm.selectedSellingAgent = $$v;
      },
      expression: "selectedSellingAgent"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Agent Address Blocks (Cargo-XML 35 Chars/Line)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    "class": {
      "border-warning-premium": _vm.hasAddressLineOverrun(_vm.form.entities.selling_agent.address)
    },
    attrs: {
      rows: "5",
      placeholder: "Enter full address details..."
    },
    model: {
      value: _vm.form.entities.selling_agent.address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.entities.selling_agent, "address", $$v);
      },
      expression: "form.entities.selling_agent.address"
    }
  }), _vm._v(" "), _vm.hasAddressLineOverrun(_vm.form.entities.selling_agent.address) ? _c("div", {
    staticClass: "text-warning-premium small mt-1"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n                  Line exceeds 35 character limits! (Cargo-XML transmission standard)\n                ")], 1) : _vm._e()], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "airplane"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Shipping Details")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Vessel/Flight Particulars")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Flight Number *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. EK502",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.flight_number,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "flight_number", $$v);
      },
      expression: "form.shipping_details.flight_number"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "MAWB Number *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    "class": {
      "border-warning-premium": !_vm.validateMawbFormat(_vm.form.shipping_details.mawb_number) && _vm.form.shipping_details.mawb_number !== ""
    },
    attrs: {
      placeholder: "e.g. 020-98304921",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.mawb_number,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "mawb_number", $$v);
      },
      expression: "form.shipping_details.mawb_number"
    }
  }), _vm._v(" "), !_vm.validateMawbFormat(_vm.form.shipping_details.mawb_number) && _vm.form.shipping_details.mawb_number !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n                  Format must be NNN-NNNNNNNN (IATA prefix + serial).\n                ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Carrier Name *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. Emirates Cargo",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.carrier_name,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "carrier_name", $$v);
      },
      expression: "form.shipping_details.carrier_name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "ETA Date/Time (Arrival) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "datetime-local",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.eta_datetime,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "eta_datetime", $$v);
      },
      expression: "form.shipping_details.eta_datetime"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "ETD Date/Time (Departure) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "datetime-local",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.etd_datetime,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "etd_datetime", $$v);
      },
      expression: "form.shipping_details.etd_datetime"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "signpost-split"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Routing")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Journey Routing Legs")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Departure Port / Airport (Origin) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input text-uppercase",
    "class": {
      "border-warning-premium": !_vm.validateIataCode(_vm.form.routing.departure_airport) && _vm.form.routing.departure_airport !== ""
    },
    attrs: {
      placeholder: "e.g. DXB",
      required: ""
    },
    model: {
      value: _vm.form.routing.departure_airport,
      callback: function callback($$v) {
        _vm.$set(_vm.form.routing, "departure_airport", $$v);
      },
      expression: "form.routing.departure_airport"
    }
  }), _vm._v(" "), !_vm.validateIataCode(_vm.form.routing.departure_airport) && _vm.form.routing.departure_airport !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n                  Must be exactly 3 uppercase letters (IATA Code).\n                ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Destination Port / Airport (Destination) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input text-uppercase",
    "class": {
      "border-warning-premium": !_vm.validateIataCode(_vm.form.routing.destination_airport) && _vm.form.routing.destination_airport !== ""
    },
    attrs: {
      placeholder: "e.g. MAA",
      required: ""
    },
    model: {
      value: _vm.form.routing.destination_airport,
      callback: function callback($$v) {
        _vm.$set(_vm.form.routing, "destination_airport", $$v);
      },
      expression: "form.routing.destination_airport"
    }
  }), _vm._v(" "), !_vm.validateIataCode(_vm.form.routing.destination_airport) && _vm.form.routing.destination_airport !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n                  Must be exactly 3 uppercase letters (IATA Code).\n                ")]) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _c("hr", {
    staticClass: "border-secondary opacity-15 my-6"
  }), _vm._v(" "), _c("h6", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Multi-Leg Journey Details")]), _vm._v(" "), _vm._l(_vm.form.routing.legs, function (leg, index) {
    return _c("div", {
      key: index,
      staticClass: "routing-leg-row p-4 mb-3 rounded-lg border border-secondary border-opacity-10"
    }, [_c("div", {
      staticClass: "d-flex align-items-center justify-content-between mb-3"
    }, [_c("span", {
      staticClass: "text-indigo font-weight-bold small"
    }, [_vm._v("Leg " + _vm._s(index + 1))]), _vm._v(" "), index > 0 ? _c("b-button", {
      staticClass: "text-danger p-0 small",
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeRoutingLeg(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    }), _vm._v(" Remove\n              ")], 1) : _vm._e()], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
      staticClass: "mb-2 mb-md-0",
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Transit Airport",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input text-uppercase",
      attrs: {
        placeholder: "e.g. DOH"
      },
      model: {
        value: leg.airport,
        callback: function callback($$v) {
          _vm.$set(leg, "airport", $$v);
        },
        expression: "leg.airport"
      }
    })], 1)], 1), _vm._v(" "), _c("b-col", {
      staticClass: "mb-2 mb-md-0",
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Carrier",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input",
      attrs: {
        placeholder: "e.g. Qatar Airways"
      },
      model: {
        value: leg.carrier,
        callback: function callback($$v) {
          _vm.$set(leg, "carrier", $$v);
        },
        expression: "leg.carrier"
      }
    })], 1)], 1), _vm._v(" "), _c("b-col", {
      staticClass: "mb-2 mb-md-0",
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Flight No",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input",
      attrs: {
        placeholder: "e.g. QR528"
      },
      model: {
        value: leg.flight_no,
        callback: function callback($$v) {
          _vm.$set(leg, "flight_no", $$v);
        },
        expression: "leg.flight_no"
      }
    })], 1)], 1), _vm._v(" "), _c("b-col", {
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Date",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input",
      attrs: {
        type: "date"
      },
      model: {
        value: leg.date,
        callback: function callback($$v) {
          _vm.$set(leg, "date", $$v);
        },
        expression: "leg.date"
      }
    })], 1)], 1)], 1)], 1);
  }), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill mt-3",
    attrs: {
      variant: "outline-indigo"
    },
    on: {
      click: _vm.addRoutingLeg
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus"
    }
  }), _vm._v(" Add Routing Leg\n          ")], 1)], 2)]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "files"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Attached House")]), _vm._v(" "), _c("span", {
          staticClass: "badge badge-indigo ml-2 small",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_vm._v(_vm._s(_vm.form.attached_house.length))])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-0"
  }, [_vm._v("House Air Waybills (HAWBs) Mapped")]), _vm._v(" "), _c("span", {
    staticClass: "badge badge-light-indigo font-weight-bold py-2 px-3"
  }, [_vm._v(_vm._s(_vm.form.attached_house.length) + " HAWBs Bundle")])]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("b-table", {
    staticClass: "premium-table mb-0",
    attrs: {
      hover: "",
      items: _vm.form.attached_house,
      fields: _vm.hawbTableFields,
      "show-empty": "",
      "empty-text": "No House AWBs mapped under this Consolidation folder."
    },
    scopedSlots: _vm._u([{
      key: "cell(gross_weight)",
      fn: function fn(data) {
        return [_vm._v("\n                    " + _vm._s(_vm.formatWeight(data.item.gross_weight)) + " KGS\n                  ")];
      }
    }, {
      key: "cell(volume_cbm)",
      fn: function fn(data) {
        return [_vm._v("\n                    " + _vm._s(_vm.formatVol(data.item.volume_cbm)) + " CBM\n                  ")];
      }
    }, {
      key: "cell(actions)",
      fn: function fn(data) {
        return [_c("b-button", {
          staticClass: "btn-icon",
          attrs: {
            variant: "outline-danger",
            size: "sm"
          },
          on: {
            click: function click($event) {
              return _vm.unlinkHawb(data.item.id);
            }
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "trash"
          }
        })], 1)];
      }
    }])
  })], 1)])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Link Pending House Job")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small"
  }, [_vm._v("Select from unlinked import house jobs to bundle costs and group the manifest cargo.")]), _vm._v(" "), _vm.linkHawbSuccess ? _c("div", {
    staticClass: "alert alert-success py-2 px-3 small mb-4 font-weight-bold animate-fade-in"
  }, [_vm._v("\n                House Job linked to Consol folder!\n              ")]) : _vm._e(), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Select Unassociated HAWB Job",
      "label-class": "text-muted small font-weight-bold text-left"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.unassociatedHawbOptions
    },
    model: {
      value: _vm.selectedUnassociatedHawb,
      callback: function callback($$v) {
        _vm.selectedUnassociatedHawb = $$v;
      },
      expression: "selectedUnassociatedHawb"
    }
  })], 1), _vm._v(" "), _c("b-button", {
    staticClass: "w-100 btn-pill mt-4",
    staticStyle: {
      height: "46px"
    },
    attrs: {
      variant: "indigo",
      disabled: !_vm.selectedUnassociatedHawb
    },
    on: {
      click: _vm.linkHawb
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus"
    }
  }), _vm._v(" Bundle HAWB Job\n              ")], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "box"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Packing Details")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Cargo Aggregates")]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Total Piece Count")]), _vm._v(" "), _c("h3", {
    staticClass: "text-dark font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.form.packing.piece_count) + " PCS")])]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Total Gross Weight")]), _vm._v(" "), _c("h3", {
    staticClass: "text-dark font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.formatWeight(_vm.form.packing.gross_weight)) + " KGS")])]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Calculated Volume")]), _vm._v(" "), _c("h3", {
    staticClass: "text-indigo font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.formatVol(_vm.form.packing.volume_cbm)) + " CBM")])]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Total Chargeable Weight")]), _vm._v(" "), _c("h3", {
    staticClass: "text-success font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.formatWeight(_vm.form.packing.chargeable_weight)) + " KGS")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("Formula: Max(Gross, Volumetric Weight @ 1:6000)")])])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-0"
  }, [_vm._v("Interactive Volumetric Calculator")]), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    attrs: {
      size: "sm"
    },
    on: {
      click: _vm.addDimensionRow
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle"
    }
  }), _vm._v(" Add Box Group\n                ")], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "table-responsive mb-4"
  }, [_c("table", {
    staticClass: "table table-sm border border-secondary border-opacity-10"
  }, [_c("thead", [_c("tr", {
    staticClass: "dim-header"
  }, [_c("th", [_vm._v("Pieces")]), _vm._v(" "), _c("th", [_vm._v("L (cm)")]), _vm._v(" "), _c("th", [_vm._v("W (cm)")]), _vm._v(" "), _c("th", [_vm._v("H (cm)")]), _vm._v(" "), _c("th", [_vm._v("Vol (CBM)")]), _vm._v(" "), _c("th", [_vm._v("Vol Wt (KGS)")]), _vm._v(" "), _c("th", [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.calculatorRows, function (row, idx) {
    return _c("tr", {
      key: idx,
      staticClass: "dim-row align-middle"
    }, [_c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.pieces,
        callback: function callback($$v) {
          _vm.$set(row, "pieces", _vm._n($$v));
        },
        expression: "row.pieces"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.length,
        callback: function callback($$v) {
          _vm.$set(row, "length", _vm._n($$v));
        },
        expression: "row.length"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.width,
        callback: function callback($$v) {
          _vm.$set(row, "width", _vm._n($$v));
        },
        expression: "row.width"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.height,
        callback: function callback($$v) {
          _vm.$set(row, "height", _vm._n($$v));
        },
        expression: "row.height"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "text-center font-weight-bold text-info",
      staticStyle: {
        "line-height": "34px"
      }
    }, [_vm._v("\n                        " + _vm._s(_vm.formatVol(row.volume_cbm)) + "\n                      ")]), _vm._v(" "), _c("td", {
      staticClass: "text-center font-weight-bold text-success",
      staticStyle: {
        "line-height": "34px"
      }
    }, [_vm._v("\n                        " + _vm._s(_vm.formatWeight(row.vol_weight)) + "\n                      ")]), _vm._v(" "), _c("td", {
      staticClass: "text-center",
      staticStyle: {
        width: "80px",
        "line-height": "34px"
      }
    }, [_c("b-button", {
      staticClass: "text-danger p-0",
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeDimensionRow(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    })], 1)], 1)]);
  }), _vm._v(" "), _vm.calculatorRows.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-5",
    attrs: {
      colspan: "7"
    }
  }, [_vm._v('\n                        Click "Add Box Group" to compute volumes and weights for loose cargo packs.\n                      ')])]) : _vm._e()], 2)])]), _vm._v(" "), _vm.calculatorRows.length > 0 ? _c("div", {
    staticClass: "d-flex justify-content-between align-items-center p-4 rounded-lg",
    staticStyle: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0"
    }
  }, [_c("div", {
    staticClass: "small text-muted"
  }, [_vm._v("\n                  Total Calculator Run: "), _c("span", {
    staticClass: "font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v(_vm._s(_vm.calcTotalPieces) + " Pcs")]), _vm._v(" / \n                  "), _c("span", {
    staticClass: "text-info font-weight-bold"
  }, [_vm._v(_vm._s(_vm.formatVol(_vm.calcTotalCbm)) + " CBM")]), _vm._v(" / \n                  "), _c("span", {
    staticClass: "text-success font-weight-bold"
  }, [_vm._v(_vm._s(_vm.formatWeight(_vm.calcTotalVolWeight)) + " KGS Vol Wt")])]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill px-4",
    attrs: {
      variant: "success"
    },
    on: {
      click: _vm.applyCalculatorToPacking
    }
  }, [_vm._v("\n                  Apply to Packing Details\n                ")])], 1) : _vm._e()])])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "file-earmark-check"
          }
        }), _vm._v(" "), _c("span", [_vm._v("DI (Delivery Order)")]), _vm._v(" "), _vm.isDOBlocked ? _c("span", {
          staticClass: "badge badge-danger ml-2",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "lock-fill"
          }
        })], 1) : _vm._e()], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Delivery Routing Parties")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consignee (Client Profile) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.consigneeListOptions
    },
    on: {
      change: _vm.onConsigneeSelect
    },
    model: {
      value: _vm.selectedConsignee,
      callback: function callback($$v) {
        _vm.selectedConsignee = $$v;
      },
      expression: "selectedConsignee"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Transporter / Trucking Co",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.transporterOptions
    },
    on: {
      change: _vm.onTransporterSelect
    },
    model: {
      value: _vm.selectedTransporter,
      callback: function callback($$v) {
        _vm.selectedTransporter = $$v;
      },
      expression: "selectedTransporter"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Custom Broker (CHA)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.customBrokerOptions
    },
    on: {
      change: _vm.onCustomBrokerSelect
    },
    model: {
      value: _vm.selectedCustomBroker,
      callback: function callback($$v) {
        _vm.selectedCustomBroker = $$v;
      },
      expression: "selectedCustomBroker"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "High Sea Buyer (Optional)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "Enter High Sea Buyer..."
    },
    model: {
      value: _vm.form.delivery_order.high_sea_buyer,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "high_sea_buyer", $$v);
      },
      expression: "form.delivery_order.high_sea_buyer"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Collection / Pickup Port Gate",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. ACC Chennai Warehouse Section B"
    },
    model: {
      value: _vm.form.delivery_order.pickup_address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "pickup_address", $$v);
      },
      expression: "form.delivery_order.pickup_address"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Delivery Destination Address",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-1"
  }, [_c("span"), _vm._v(" "), _c("b-form-checkbox", {
    staticClass: "premium-checkbox text-muted small",
    attrs: {
      size: "sm"
    },
    on: {
      change: _vm.toggleAddressCopy
    },
    model: {
      value: _vm.copyConsigneeAddrCheckbox,
      callback: function callback($$v) {
        _vm.copyConsigneeAddrCheckbox = $$v;
      },
      expression: "copyConsigneeAddrCheckbox"
    }
  }, [_vm._v("\n                        Copy Consignee Address\n                      ")])], 1), _vm._v(" "), _c("b-form-textarea", {
    staticClass: "premium-textarea",
    attrs: {
      rows: "3",
      placeholder: "Street destination address details..."
    },
    model: {
      value: _vm.form.delivery_order.delivery_address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "delivery_address", $$v);
      },
      expression: "form.delivery_order.delivery_address"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_vm.isDOBlocked ? _c("div", {
    staticClass: "alert alert-danger mb-4 p-4 rounded-lg animate-fade-in border border-danger border-opacity-30"
  }, [_c("h6", {
    staticClass: "font-weight-bold d-flex align-items-center mb-2"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "shield-lock-fill"
    }
  }), _vm._v("\n                DO Release Locked\n              ")], 1), _vm._v(" "), _c("p", {
    staticClass: "small mb-0"
  }, [_vm._v("\n                Physical release is programmatically locked:\n                "), _vm.form.financials.payment_status === "Pending" ? _c("span", {
    staticClass: "d-block mt-1 font-weight-bold"
  }, [_vm._v("• Payment status is PENDING")]) : _vm._e(), _vm._v(" "), _vm.isCreditLimitExceeded ? _c("span", {
    staticClass: "d-block mt-1 font-weight-bold"
  }, [_vm._v("• Consignee's CREDIT LIMIT EXCEEDED")]) : _vm._e(), _vm._v(" "), _vm.form.delivery_order.status === "hold" ? _c("span", {
    staticClass: "d-block mt-1 font-weight-bold"
  }, [_vm._v("• Manual DO status is HOLD")]) : _vm._e()])]) : _c("div", {
    staticClass: "alert alert-success mb-4 p-4 rounded-lg animate-fade-in border border-success border-opacity-30"
  }, [_c("h6", {
    staticClass: "font-weight-bold d-flex align-items-center mb-1"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "shield-fill-check"
    }
  }), _vm._v("\n                Credit Approval Cleared\n              ")], 1), _vm._v(" "), _c("p", {
    staticClass: "small mb-0"
  }, [_vm._v("Delivery Order released is authorized for cargo pick-up.")])]), _vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-5"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("DO Parameters")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "DO Status",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.doStatusOptions
    },
    model: {
      value: _vm.form.delivery_order.status,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "status", $$v);
      },
      expression: "form.delivery_order.status"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Delivery Order No",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "Auto-generated upon save"
    },
    model: {
      value: _vm.form.delivery_order.delivery_order_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "delivery_order_no", $$v);
      },
      expression: "form.delivery_order.delivery_order_no"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "DO Release Date",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "date"
    },
    model: {
      value: _vm.form.delivery_order.delivery_order_date,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "delivery_order_date", $$v);
      },
      expression: "form.delivery_order.delivery_order_date"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Release Fee (INR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.form.delivery_order.do_release_fee,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "do_release_fee", _vm._n($$v));
      },
      expression: "form.delivery_order.do_release_fee"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Warehouse Charges (INR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.form.delivery_order.warehouse_fee,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "warehouse_fee", _vm._n($$v));
      },
      expression: "form.delivery_order.warehouse_fee"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "mt-5 pt-3 border-top border-secondary border-opacity-10"
  }, [_c("b-button", {
    staticClass: "btn btn-indigo w-100 btn-pill mb-2 py-3 font-weight-bold",
    attrs: {
      disabled: _vm.isDOBlocked
    },
    on: {
      click: _vm.printDO
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "printer-fill"
    }
  }), _vm._v(" Print Delivery Order\n                ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn w-100 btn-pill py-3 font-weight-bold",
    attrs: {
      disabled: _vm.isDOBlocked
    },
    on: {
      click: _vm.printReceipt
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "receipt"
    }
  }), _vm._v(" Print Receipt\n                ")], 1)], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "wallet2"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Charges")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-0"
  }, [_vm._v("Consol Billing Splits")]), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    attrs: {
      size: "sm"
    },
    on: {
      click: _vm.addChargeItem
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle"
    }
  }), _vm._v(" Add Charge Item\n            ")], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "table-responsive mb-4"
  }, [_c("table", {
    staticClass: "table table-sm border border-secondary border-opacity-10"
  }, [_c("thead", [_c("tr", {
    staticClass: "dim-header"
  }, [_c("th", [_vm._v("Charge Code")]), _vm._v(" "), _c("th", [_vm._v("Description")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Prepaid (INR)")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Collect (INR)")]), _vm._v(" "), _c("th", {
    staticClass: "text-center"
  }, [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.form.charges, function (charge, index) {
    return _c("tr", {
      key: index,
      staticClass: "align-middle"
    }, [_c("td", {
      staticStyle: {
        width: "150px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-uppercase",
      attrs: {
        placeholder: "e.g. FR"
      },
      model: {
        value: charge.code,
        callback: function callback($$v) {
          _vm.$set(charge, "code", $$v);
        },
        expression: "charge.code"
      }
    })], 1), _vm._v(" "), _c("td", [_c("b-form-input", {
      staticClass: "premium-input-sm",
      attrs: {
        placeholder: "e.g. Air Freight Charge"
      },
      model: {
        value: charge.description,
        callback: function callback($$v) {
          _vm.$set(charge, "description", $$v);
        },
        expression: "charge.description"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "180px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-right",
      attrs: {
        type: "number",
        placeholder: "0.00"
      },
      model: {
        value: charge.prepaid,
        callback: function callback($$v) {
          _vm.$set(charge, "prepaid", _vm._n($$v));
        },
        expression: "charge.prepaid"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "180px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-right",
      attrs: {
        type: "number",
        placeholder: "0.00"
      },
      model: {
        value: charge.collect,
        callback: function callback($$v) {
          _vm.$set(charge, "collect", _vm._n($$v));
        },
        expression: "charge.collect"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "text-center",
      staticStyle: {
        width: "80px"
      }
    }, [_c("b-button", {
      staticClass: "text-danger p-0",
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeChargeItem(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    })], 1)], 1)]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "dim-row font-weight-bold border-top",
    staticStyle: {
      background: "#F8FAFC"
    }
  }, [_c("td", {
    staticClass: "text-dark"
  }, [_vm._v("TOTALS")]), _vm._v(" "), _c("td"), _vm._v(" "), _c("td", {
    staticClass: "text-right text-info font-weight-bolder pr-4",
    staticStyle: {
      "line-height": "34px"
    }
  }, [_vm._v("\n                    ₹ " + _vm._s(_vm.totalChargesPrepaid.toFixed(2)) + "\n                  ")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-success font-weight-bolder pr-4",
    staticStyle: {
      "line-height": "34px"
    }
  }, [_vm._v("\n                    ₹ " + _vm._s(_vm.totalChargesCollect.toFixed(2)) + "\n                  ")]), _vm._v(" "), _c("td")])], 2)])])])]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "cash-coin"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Financials")]), _vm._v(" "), _vm.isCreditLimitExceeded ? _c("span", {
          staticClass: "badge badge-danger ml-2",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "shield-slash-fill"
          }
        }), _vm._v(" EXCEEDED\n            ")], 1) : _vm._e()], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Billing & Accounts Receivable Status")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Payment Status / Mode *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.paymentStatusOptions
    },
    model: {
      value: _vm.form.financials.payment_status,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "payment_status", $$v);
      },
      expression: "form.financials.payment_status"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Invoice Number",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "INV-26-XXXX"
    },
    model: {
      value: _vm.form.financials.invoice_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "invoice_no", $$v);
      },
      expression: "form.financials.invoice_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Invoice Amount (INR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.form.financials.invoice_amount,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "invoice_amount", _vm._n($$v));
      },
      expression: "form.financials.invoice_amount"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Receipt Reference Number",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "REC-26-XXXX"
    },
    model: {
      value: _vm.form.financials.receipt_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "receipt_no", $$v);
      },
      expression: "form.financials.receipt_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Prepaid/Collect Split Details",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("div", {
    staticClass: "p-3 rounded-lg small",
    staticStyle: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      color: "#475569"
    }
  }, [_vm._v("\n                      Freight Collect splits are automatically aggregated. Billing entities are matched to the Consignee debtor.\n                    ")])])], 1)], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "credit-card p-5 rounded-lg border border-opacity-10 h-100",
    "class": _vm.isCreditLimitExceeded ? "credit-card-alert" : "credit-card-ok"
  }, [_c("h5", {
    staticClass: "font-weight-bold mb-4 d-flex align-items-center h-color"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    "class": _vm.isCreditLimitExceeded ? "text-danger" : "text-success",
    attrs: {
      icon: "credit-card-2-front-fill"
    }
  }), _vm._v("\n                Consignee Credit Master\n              ")], 1), _vm._v(" "), _vm.isCreditLimitExceeded ? _c("div", {
    staticClass: "alert alert-danger py-2 px-3 small mb-4 font-weight-bold border border-danger border-opacity-20 animate-fade-in"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v(" CREDIT LIMIT EXCEEDED\n              ")], 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "credit-detail mb-3"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Debtor Status")]), _vm._v(" "), _c("div", {
    staticClass: "font-weight-bold mt-1"
  }, [_vm.selectedConsigneeObj ? _c("span", {
    staticClass: "badge",
    "class": _vm.getBadgeClassForCredit(_vm.selectedConsigneeObj.credit_status)
  }, [_vm._v("\n                    " + _vm._s(_vm.selectedConsigneeObj.credit_status.toUpperCase()) + "\n                  ")]) : _c("span", {
    staticClass: "text-muted"
  }, [_vm._v("—")])])]), _vm._v(" "), _c("div", {
    staticClass: "credit-detail mb-3"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Assigned Credit Limit")]), _vm._v(" "), _c("h5", {
    staticClass: "font-weight-bold mt-1 text-dark"
  }, [_vm._v("\n                  " + _vm._s(_vm.selectedConsigneeObj ? _vm.formatCurrency(_vm.selectedConsigneeObj.credit_limit) : "₹ 0.00") + "\n                ")])]), _vm._v(" "), _c("div", {
    staticClass: "credit-detail mb-3"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Current Outstanding Balance")]), _vm._v(" "), _c("h5", {
    staticClass: "font-weight-bold mt-1",
    "class": _vm.isCreditLimitExceeded ? "text-danger" : "text-success"
  }, [_vm._v("\n                  " + _vm._s(_vm.selectedConsigneeObj ? _vm.formatCurrency(_vm.selectedConsigneeObj.outstanding_balance) : "₹ 0.00") + "\n                ")])]), _vm._v(" "), _c("div", {
    staticClass: "credit-detail"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Payment Terms")]), _vm._v(" "), _c("p", {
    staticClass: "font-weight-bold mb-0 mt-1 text-dark"
  }, [_vm._v("\n                  " + _vm._s(_vm.selectedConsigneeObj ? _vm.selectedConsigneeObj.default_payment_terms : "—") + "\n                ")])])])])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "shield-check"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Customs / CGM")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6 mb-6"
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-3 mb-md-0"
  }, [_vm._v("Customs IGM / CGM Manifest Filings")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-2"
  }, [_c("b-form-select", {
    staticClass: "premium-select-sm mr-2",
    staticStyle: {
      width: "160px"
    },
    attrs: {
      options: _vm.customsFilterOptions
    },
    model: {
      value: _vm.customsFilterStatus,
      callback: function callback($$v) {
        _vm.customsFilterStatus = $$v;
      },
      expression: "customsFilterStatus"
    }
  }), _vm._v(" "), _c("b-form-input", {
    staticClass: "premium-input-sm mr-2 text-uppercase",
    staticStyle: {
      width: "200px"
    },
    attrs: {
      placeholder: "Custom House (e.g. INMAA4)"
    },
    model: {
      value: _vm.customsFilterGate,
      callback: function callback($$v) {
        _vm.customsFilterGate = $$v;
      },
      expression: "customsFilterGate"
    }
  }), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill",
    attrs: {
      variant: "warning"
    },
    on: {
      click: _vm.openCgmModal
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "box-arrow-up"
    }
  }), _vm._v(" Submit CGM Data\n              ")], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("b-table", {
    staticClass: "premium-table mb-0",
    attrs: {
      hover: "",
      items: _vm.filteredCustomsFilings,
      fields: _vm.customsTableFields,
      "show-empty": "",
      "empty-text": "No digital customs filing submissions found matching search criteria."
    },
    scopedSlots: _vm._u([{
      key: "cell(filing_type)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "badge badge-light-indigo font-weight-bold"
        }, [_vm._v(_vm._s(data.value))])];
      }
    }, {
      key: "cell(transaction_status)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "badge",
          "class": _vm.getBadgeClassForCustoms(data.value)
        }, [_vm._v("\n                  " + _vm._s(data.value.toUpperCase()) + "\n                ")])];
      }
    }, {
      key: "cell(flat_file_path)",
      fn: function fn(data) {
        return [data.value ? _c("span", {
          staticClass: "small text-muted font-family-monospace"
        }, [_vm._v("\n                  " + _vm._s(data.value.substring(data.value.lastIndexOf("/") + 1)) + "\n                ")]) : _c("span", {
          staticClass: "text-muted"
        }, [_vm._v("—")])];
      }
    }, {
      key: "cell(submitted_at)",
      fn: function fn(data) {
        return [_vm._v("\n                " + _vm._s(_vm.formatDateTime(data.value)) + "\n              ")];
      }
    }, {
      key: "cell(actions)",
      fn: function fn(data) {
        return [_c("b-button", {
          staticClass: "btn-pill px-3",
          attrs: {
            variant: "outline-info",
            size: "sm"
          },
          on: {
            click: function click($event) {
              return _vm.viewFilingLog(data.item);
            }
          }
        }, [_vm._v("\n                  View Log\n                ")])];
      }
    }])
  })], 1)])]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "folder2-open"
          }
        }), _vm._v(" "), _c("span", [_vm._v("E-Docket")]), _vm._v(" "), _c("span", {
          staticClass: "badge badge-success ml-2 small",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_vm._v(_vm._s(_vm.form.e_docket.length))])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Upload physical shipping documents")]), _vm._v(" "), _c("div", {
    staticClass: "dropzone-box d-flex flex-column align-items-center justify-content-center py-10 px-5 text-center cursor-pointer rounded-lg border-dashed border-2 border-secondary",
    on: {
      click: _vm.triggerFileInput,
      dragover: function dragover($event) {
        $event.preventDefault();
      },
      drop: function drop($event) {
        $event.preventDefault();
        return _vm.handleFileDrop.apply(null, arguments);
      }
    }
  }, [_c("b-icon", {
    staticClass: "text-indigo mb-3 animate-pulse",
    attrs: {
      icon: "cloud-upload",
      "font-scale": "3"
    }
  }), _vm._v(" "), _c("h6", {
    staticStyle: {
      color: "#1E293B",
      "font-weight": "700"
    }
  }, [_vm._v("Drag and drop files here to upload")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0 mt-1"
  }, [_vm._v("Supports PDF, PNG, JPG files. Max 10MB.")]), _vm._v(" "), _c("input", {
    ref: "fileInput",
    staticClass: "d-none",
    attrs: {
      type: "file",
      multiple: ""
    },
    on: {
      change: _vm.handleFileSelect
    }
  })], 1), _vm._v(" "), _vm.uploadProgress > 0 ? _c("div", {
    staticClass: "mt-4 animate-fade-in"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between mb-1 small text-muted"
  }, [_c("span", [_vm._v("Uploading...")]), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.uploadProgress) + "%")])]), _vm._v(" "), _c("b-progress", {
    staticStyle: {
      height: "6px"
    },
    attrs: {
      value: _vm.uploadProgress,
      max: "100",
      variant: "indigo"
    }
  })], 1) : _vm._e()])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Attached Documents Docket")]), _vm._v(" "), _vm._l(_vm.form.e_docket, function (doc, idx) {
    return _c("div", {
      key: idx,
      staticClass: "docket-file-row p-3 mb-3 rounded-lg d-flex align-items-center justify-content-between border border-secondary border-opacity-10 animate-fade-in"
    }, [_c("div", {
      staticClass: "d-flex align-items-center"
    }, [doc.mime_type.includes("pdf") ? _c("b-icon", {
      staticClass: "text-danger mr-3",
      attrs: {
        icon: "file-earmark-pdf",
        "font-scale": "1.5"
      }
    }) : _c("b-icon", {
      staticClass: "text-info mr-3",
      attrs: {
        icon: "file-earmark-image",
        "font-scale": "1.5"
      }
    }), _vm._v(" "), _c("div", [_c("div", {
      staticClass: "font-weight-bold small text-truncate text-dark",
      staticStyle: {
        "max-width": "200px"
      }
    }, [_vm._v(_vm._s(doc.file_name))]), _vm._v(" "), _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v(_vm._s(_vm.formatBytes(doc.file_size)))])])], 1), _vm._v(" "), _c("div", {
      staticClass: "d-flex align-items-center gap-3"
    }, [_c("b-form-select", {
      staticClass: "premium-select-sm mr-2",
      staticStyle: {
        width: "160px"
      },
      attrs: {
        options: _vm.documentTypeOptions
      },
      model: {
        value: doc.document_type,
        callback: function callback($$v) {
          _vm.$set(doc, "document_type", $$v);
        },
        expression: "doc.document_type"
      }
    }), _vm._v(" "), _c("b-button", {
      staticClass: "btn-icon",
      attrs: {
        variant: "outline-light",
        size: "sm"
      },
      on: {
        click: function click($event) {
          return _vm.deleteDocketFile(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "x"
      }
    })], 1)], 1)]);
  }), _vm._v(" "), _vm.form.e_docket.length === 0 ? _c("div", {
    staticClass: "text-center py-10 text-muted"
  }, [_c("b-icon", {
    staticClass: "mb-3",
    attrs: {
      icon: "folder",
      "font-scale": "2"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "small mb-0"
  }, [_vm._v("E-Docket folder is currently empty. Upload cargo files or drafts.")])], 1) : _vm._e()], 2)])], 1)], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end align-items-center mt-8 pt-5 border-top border-secondary border-opacity-10"
  }, [_c("b-button", {
    staticClass: "btn btn-indigo btn-pill btn-lg px-8 py-3",
    attrs: {
      disabled: _vm.formLoading
    },
    on: {
      click: _vm.saveConsol
    }
  }, [_vm.formLoading ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Saving Consol...")], 1) : _c("span", [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "check-circle"
    }
  }), _vm._v(" Save Consol Folder")], 1)])], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "cgm-filing-modal",
      title: "Submit CGM / ICEGATE manifest Data",
      size: "lg",
      centered: "",
      "hide-footer": ""
    }
  }, [_c("div", {
    staticClass: "cgm-modal-body p-4 font-outfit text-dark rounded-lg"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Filing Details - Custom Gate Chennai")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Date & Time of Filing",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "datetime-local"
    },
    model: {
      value: _vm.cgmFilingForm.datetime,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "datetime", $$v);
      },
      expression: "cgmFilingForm.datetime"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Job No. *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      disabled: ""
    },
    model: {
      value: _vm.cgmFilingForm.consol_no,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "consol_no", $$v);
      },
      expression: "cgmFilingForm.consol_no"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Custom House Code *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input text-uppercase",
    "class": {
      "border-warning-premium": _vm.cgmFilingForm.customs_house.length !== 6 && _vm.cgmFilingForm.customs_house !== ""
    },
    attrs: {
      placeholder: "e.g. INMAA4",
      required: ""
    },
    model: {
      value: _vm.cgmFilingForm.customs_house,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "customs_house", $$v);
      },
      expression: "cgmFilingForm.customs_house"
    }
  }), _vm._v(" "), _vm.cgmFilingForm.customs_house.length !== 6 && _vm.cgmFilingForm.customs_house !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n              Must be exactly 6 characters (e.g. INMAA4).\n            ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Sending Method",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-radio-group", {
    staticClass: "premium-radio-group text-dark pt-2",
    attrs: {
      options: _vm.sendingMethods
    },
    model: {
      value: _vm.cgmFilingForm.sending_method,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "sending_method", $$v);
      },
      expression: "cgmFilingForm.sending_method"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("h6", {
    staticClass: "h-color mt-4 mb-2"
  }, [_vm._v("Manifest Submission Console & DSC Status")]), _vm._v(" "), _c("div", {
    staticClass: "dsc-terminal p-4 rounded-lg border border-info border-opacity-30 mb-5 font-family-monospace"
  }, [_vm._l(_vm.dscLogs, function (log, idx) {
    return _c("div", {
      key: idx,
      staticClass: "dsc-log-line",
      "class": _vm.getDscLogClass(log.type)
    }, [_vm._v("\n          " + _vm._s(log.text) + "\n        ")]);
  }), _vm._v(" "), _vm.dscLogs.length === 0 ? _c("div", {
    staticClass: "text-muted text-center py-4"
  }, [_vm._v('\n          Terminal Idle. Trigger "Submit" or "Send for Signature" to execute filings.\n        ')]) : _vm._e()], 2), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-wrap justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-10"
  }, [_c("b-button", {
    staticClass: "show-btn mr-2 px-4",
    on: {
      click: _vm.closeCgmModal
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill mr-2 px-4",
    attrs: {
      variant: "outline-info",
      href: "#"
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.openSignatureUtility.apply(null, arguments);
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "download"
    }
  }), _vm._v(" Get Signature Tool\n        ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill mr-2 px-4",
    attrs: {
      variant: "warning",
      disabled: _vm.filingProcessing
    },
    on: {
      click: _vm.submitCgmData
    }
  }, [_vm.filingProcessing ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Processing...")], 1) : _c("span", [_vm._v("Submit Manifest")])]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill px-4",
    attrs: {
      variant: "success",
      disabled: !_vm.isCgmValid || _vm.filingProcessing
    },
    on: {
      click: _vm.sendForSignature
    }
  }, [_vm._v("\n          Sign & Transmit (DSC)\n        ")])], 1)], 1)])], 1)])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true");
/* harmony import */ var _FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusAirImport.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusAirImport_vue_vue_type_style_index_0_id_3e7c126e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3e7c126e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/FocusAirImport.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAirImport.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_style_index_0_id_3e7c126e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css");


/***/ })

}]);