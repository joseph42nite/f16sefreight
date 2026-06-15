"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_FocusSeaMaster_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusSeaMaster",
  data: function data() {
    return {
      loading: false,
      successMsg: null,
      form: {
        execution_job_no: "",
        planned_clearance_date: new Date().toISOString().slice(0, 10),
        consol_type: "agent_consol",
        cargo_type: "fcl",
        delivery_mode: "fcl",
        booking_thru: "self",
        job_owner_id: "operations",
        quotation_no: "",
        is_sub_shipment: false,
        vessel_name: "",
        voyage_no: "",
        vessel_flag: "",
        imo_number: "",
        por_code: "",
        pol_code: "",
        pod_code: "",
        del_code: "",
        vessel_etd: "",
        piece_count: 0,
        gross_weight: 0.0,
        net_weight: 0.0,
        volume_cbm: 0.0,
        commodity_description: "",
        mbl_number: "",
        bl_release_type: "original",
        freight_terms: "prepaid"
      },
      consolOptions: [{
        value: "agent_consol",
        text: "Agent Consolidation"
      }, {
        value: "buyers_consol",
        text: "Buyer's Consolidation"
      }, {
        value: "direct",
        text: "Direct Shipment"
      }, {
        value: "back_to_back",
        text: "Back-to-Back"
      }, {
        value: "none",
        text: "None"
      }],
      cargoOptions: [{
        value: "fcl",
        text: "FCL (Full Container Load)"
      }, {
        value: "lcl",
        text: "LCL (Less Container Load)"
      }, {
        value: "liquid_cont",
        text: "Liquid Container"
      }, {
        value: "break_bulk",
        text: "Break Bulk"
      }, {
        value: "liquid_bulk",
        text: "Liquid Bulk"
      }, {
        value: "bulk",
        text: "Dry Bulk"
      }, {
        value: "ro_ro",
        text: "Ro-Ro"
      }],
      deliveryOptions: [{
        value: "fcl",
        text: "FCL"
      }, {
        value: "lcl",
        text: "LCL"
      }],
      bookingThruOptions: [{
        value: "self",
        text: "Direct Booking (Self)"
      }, {
        value: "agent",
        text: "Booking via Third-Party Agent"
      }],
      releaseOptions: [{
        value: "original",
        text: "Original OBL Issued"
      }, {
        value: "telex",
        text: "Telex / Surrender Release"
      }, {
        value: "seaway",
        text: "Sea Waybill"
      }],
      freightTermsOptions: [{
        value: "prepaid",
        text: "Prepaid"
      }, {
        value: "collect",
        text: "Collect"
      }]
    };
  },
  methods: {
    saveShipment: function saveShipment() {
      var _this = this;
      this.loading = true;
      this.successMsg = null;

      // Simulate save delay
      setTimeout(function () {
        _this.loading = false;
        _this.form.execution_job_no = "JOBS-26-" + Math.floor(1000 + Math.random() * 9000);
        _this.successMsg = "Master Sea shipment finalized successfully. Generated execution number: ".concat(_this.form.execution_job_no);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 1500);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true ***!
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
  return _c("div", {
    staticClass: "py-5 premium-sea-page font-outfit"
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-7"
  }, [_vm._m(0), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-light-primary btn-pill px-5",
    attrs: {
      to: "/inbox"
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "arrow-left"
    }
  }), _vm._v(" Back to Inbox\n    ")], 1)], 1), _vm._v(" "), _vm.successMsg ? _c("div", {
    staticClass: "alert alert-custom alert-light-success mb-6 shadow-sm"
  }, [_vm._m(1), _vm._v(" "), _c("div", {
    staticClass: "alert-text font-weight-bold"
  }, [_vm._v(_vm._s(_vm.successMsg))])]) : _vm._e(), _vm._v(" "), _c("b-form", {
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.saveShipment.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 mb-6"
  }, [_c("h4", {
    staticClass: "text-white font-weight-bold mb-5 d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-3 text-info",
    attrs: {
      icon: "globe2"
    }
  }), _vm._v(" Shipment Configuration\n      ")], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Shipment No",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      readonly: "",
      placeholder: "SSEA-26-XXXX"
    },
    model: {
      value: _vm.form.execution_job_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "execution_job_no", $$v);
      },
      expression: "form.execution_job_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Shipment Date *",
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
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.consolOptions
    },
    model: {
      value: _vm.form.consol_type,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "consol_type", $$v);
      },
      expression: "form.consol_type"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Cargo Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.cargoOptions
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
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Delivery Mode",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.deliveryOptions
    },
    model: {
      value: _vm.form.delivery_mode,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "delivery_mode", $$v);
      },
      expression: "form.delivery_mode"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Booking Thru",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.bookingThruOptions
    },
    model: {
      value: _vm.form.booking_thru,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "booking_thru", $$v);
      },
      expression: "form.booking_thru"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Job Owner ID",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "Owner username"
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
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Quotation No",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. QT-26-0928"
    },
    model: {
      value: _vm.form.quotation_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "quotation_no", $$v);
      },
      expression: "form.quotation_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4 d-flex align-items-center pt-4",
    attrs: {
      md: "4",
      lg: "3"
    }
  }, [_c("b-form-checkbox", {
    staticClass: "text-white font-weight-bold",
    model: {
      value: _vm.form.is_sub_shipment,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "is_sub_shipment", $$v);
      },
      expression: "form.is_sub_shipment"
    }
  }, [_vm._v("\n            Sub Shipment (HBL)\n          ")])], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "premium-tabs-wrapper"
  }, [_c("b-tabs", {
    attrs: {
      "content-class": "mt-4",
      "nav-wrapper-class": "premium-tab-nav",
      "active-nav-item-class": "active-tab"
    }
  }, [_c("b-tab", {
    attrs: {
      title: "Voyage Details",
      active: ""
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "text-white mb-5 font-weight-bold"
  }, [_vm._v("Ocean Transit Parameters")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Carrying Vessel *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      placeholder: "e.g. EVER GIVEN"
    },
    model: {
      value: _vm.form.vessel_name,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "vessel_name", $$v);
      },
      expression: "form.vessel_name"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Voyage No *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      placeholder: "e.g. 093W"
    },
    model: {
      value: _vm.form.voyage_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "voyage_no", $$v);
      },
      expression: "form.voyage_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Vessel Flag",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. PA"
    },
    model: {
      value: _vm.form.vessel_flag,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "vessel_flag", $$v);
      },
      expression: "form.vessel_flag"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "IMO Number",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "7-digit IMO"
    },
    model: {
      value: _vm.form.imo_number,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "imo_number", $$v);
      },
      expression: "form.imo_number"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Place of Receipt (POR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "UN/LOCODE e.g. INBLR"
    },
    model: {
      value: _vm.form.por_code,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "por_code", $$v);
      },
      expression: "form.por_code"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Port of Loading (POL) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      placeholder: "UN/LOCODE e.g. INMAA"
    },
    model: {
      value: _vm.form.pol_code,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "pol_code", $$v);
      },
      expression: "form.pol_code"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Port of Discharge (POD) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      placeholder: "UN/LOCODE e.g. SGSIN"
    },
    model: {
      value: _vm.form.pod_code,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "pod_code", $$v);
      },
      expression: "form.pod_code"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Place of Delivery (DEL)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "UN/LOCODE e.g. SGSIN"
    },
    model: {
      value: _vm.form.del_code,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "del_code", $$v);
      },
      expression: "form.del_code"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Vessel ETD",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "date"
    },
    model: {
      value: _vm.form.vessel_etd,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "vessel_etd", $$v);
      },
      expression: "form.vessel_etd"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("b-tab", {
    attrs: {
      title: "Cargo & Volume"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "text-white mb-5 font-weight-bold"
  }, [_vm._v("Weights, Quantities & Packaging")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Piece Count *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number",
      required: ""
    },
    model: {
      value: _vm.form.piece_count,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "piece_count", _vm._n($$v));
      },
      expression: "form.piece_count"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Gross Weight (KGS) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number",
      step: "0.001",
      required: ""
    },
    model: {
      value: _vm.form.gross_weight,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "gross_weight", _vm._n($$v));
      },
      expression: "form.gross_weight"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Net Weight (KGS)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number",
      step: "0.001"
    },
    model: {
      value: _vm.form.net_weight,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "net_weight", _vm._n($$v));
      },
      expression: "form.net_weight"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Volume (CBM) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number",
      step: "0.001",
      required: ""
    },
    model: {
      value: _vm.form.volume_cbm,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "volume_cbm", _vm._n($$v));
      },
      expression: "form.volume_cbm"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "8"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Commodity Description",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    attrs: {
      rows: "3",
      placeholder: "Customs manifest goods declaration..."
    },
    model: {
      value: _vm.form.commodity_description,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "commodity_description", $$v);
      },
      expression: "form.commodity_description"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("b-tab", {
    attrs: {
      title: "Bill of Lading Details"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "text-white mb-5 font-weight-bold"
  }, [_vm._v("MBL Release Details")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Master Bill of Lading No *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      placeholder: "e.g. COSU63082910"
    },
    model: {
      value: _vm.form.mbl_number,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "mbl_number", $$v);
      },
      expression: "form.mbl_number"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "BL Release Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.releaseOptions
    },
    model: {
      value: _vm.form.bl_release_type,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "bl_release_type", $$v);
      },
      expression: "form.bl_release_type"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6",
      lg: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Freight Terms",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.freightTermsOptions
    },
    model: {
      value: _vm.form.freight_terms,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "freight_terms", $$v);
      },
      expression: "form.freight_terms"
    }
  })], 1)], 1)], 1)], 1)])], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end align-items-center mt-6"
  }, [_c("b-button", {
    staticClass: "btn btn-primary btn-pill btn-lg px-8 py-3",
    attrs: {
      type: "submit",
      disabled: _vm.loading
    }
  }, [_vm.loading ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Saving Shipment...")], 1) : _c("span", [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "check-circle"
    }
  }), _vm._v(" Save Master Shipment")], 1)])], 1)])], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "admin-page-header"
  }, [_c("h2", {
    staticClass: "text-white font-weight-bolder"
  }, [_vm._v("Focus Sea — Master Shipment Details")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Manage ocean cargo MBL voyage parameters and shipping configurations")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "alert-icon"
  }, [_c("i", {
    staticClass: "fas fa-check-circle text-success"
  })]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusSeaMaster_vue_vue_type_template_id_09842370_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true */ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true");
/* harmony import */ var _FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusSeaMaster_vue_vue_type_style_index_0_id_09842370_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusSeaMaster_vue_vue_type_template_id_09842370_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusSeaMaster_vue_vue_type_template_id_09842370_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "09842370",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/FocusSeaMaster.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_09842370_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_09842370_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_template_id_09842370_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=template&id=09842370&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusSeaMaster_vue_vue_type_style_index_0_id_09842370_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusSeaMaster.vue?vue&type=style&index=0&id=09842370&scoped=true&lang=css");


/***/ })

}]);