"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_NewBranch_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _riophae_vue_treeselect_dist_vue_treeselect_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @riophae/vue-treeselect/dist/vue-treeselect.css */ "./node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      branch_form: new Form({
        id: "",
        //agent details
        agent_name: "",
        agent_address: "",
        agent_pincode: "",
        agent_city: "",
        company_id: null,
        agent_issue_sign: "",
        agent_issue_loc_code: '',
        agent_issue_date: "",
        agent_account: "",
        //iata cass and code
        iata_agent_code: "",
        iata_agent_cass: "",
        //Participant
        participant_airport: "",
        prticipant_identifer: "",
        participant_code: "",
        participant_file_reference: "",
        //office details
        office_airport: "",
        office_function_designator: "",
        office_company_designator: "",
        office_file_reference: "",
        //HAWB Agents Head Office
        ho_name: "",
        ho_address: "",
        ho_city: "",
        ho_pincode: "",
        ho_state: "",
        ho_country: ""
      }),
      action: "Add",
      all_company: [{
        value: null,
        text: 'Select Company'
      }],
      location: [],
      searchQuery: "",
      isDropdownOpen: false,
      showpass: true
    };
  },
  methods: {
    onSubmit: function onSubmit(evt) {
      var _this = this;
      evt.preventDefault();
      if (this.action == "Add") {
        this.branch_form.post("/superadmin/create-branch").then(function (_ref) {
          var data = _ref.data;
          _this.$router.push("/superadmin/all-branch");
        })["catch"](function (err) {});
      } else {
        this.branch_form.put("/superadmin/edit-branch/".concat(this.branch_form.id)).then(function (_ref2) {
          var data = _ref2.data;
          $("#fade").fadeToggle(1000);
          $("#fade").fadeToggle(1000);
        });
      }
    },
    getData: function getData(id) {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-branch/".concat(id)).then(function (_ref3) {
        var data = _ref3.data;
        _this2.branch_form.fill(data[0]);
        _this2.searchQuery = data[0].agent_issue_loc_code;
      });
    },
    getCompany: function getCompany() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-company").then(function (_ref4) {
        var data = _ref4.data;
        for (var i = 0; i < data.length; i++) {
          _this3.all_company.push({
            "value": data[i].id,
            "text": data[i].name
          });
        }
      });
    },
    getLocation: function getLocation() {
      var _this4 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/get-location").then(function (_ref5) {
        var data = _ref5.data;
        _this4.location = data;
      });
    },
    normalizer: function normalizer(node) {
      return {
        id: node.value,
        label: node.name
      };
    },
    selectOption: function selectOption(item) {
      this.branch_form.agent_issue_loc_code = item.iata_code + ", " + item.destination + " (" + item.iata_code + ")";
      this.searchQuery = this.branch_form.agent_issue_loc_code;
    },
    toggleDropdown: function toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown: function closeDropdown(event) {
      var dropdownContainer = this.$refs.dropdownContainer;
      if (!dropdownContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    }
  },
  mounted: function mounted() {
    this.getCompany();
    this.getLocation();
    if (this.get_item) {
      this.getData(this.get_item);
      this.action = "Edit";
    }
    window.addEventListener('click', this.closeDropdown);
  },
  computed: {
    get_item: function get_item() {
      if (this.$route.params.id) return this.$route.params.id;else return 0;
    },
    filteredLocations: function filteredLocations() {
      if (!this.searchQuery) {
        return this.location;
      }
      var query = this.searchQuery.toLowerCase();
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    } // item.iata_code.toLowerCase().includes(query) ||
    // item.destination.toLowerCase().includes(query)
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=template&id=23ef4156&scoped=true":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=template&id=23ef4156&scoped=true ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "mt-10 p-5"
  }, [_c("b-form", {
    staticClass: "w-md-50 fw-700",
    on: {
      submit: _vm.onSubmit
    }
  }, [_c("h3", {
    staticClass: "fw-700"
  }, [_vm._v(_vm._s(_vm.action) + " Branch")]), _vm._v(" "), _c("div", {
    staticClass: "bg-white p-10 rounded"
  }, [_c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("agent_name")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Agent Name"
    },
    model: {
      value: _vm.branch_form.agent_name,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "agent_name", $$v);
      },
      expression: "branch_form.agent_name"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "agent_name"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("agent_address")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Agent Address"
    },
    model: {
      value: _vm.branch_form.agent_address,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "agent_address", $$v);
      },
      expression: "branch_form.agent_address"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "agent_address"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("agent_pincode")
    },
    attrs: {
      id: "input-1",
      type: "number",
      required: "",
      placeholder: "Agent Pincode"
    },
    model: {
      value: _vm.branch_form.agent_pincode,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "agent_pincode", $$v);
      },
      expression: "branch_form.agent_pincode"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "agent_pincode"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("agent_city")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Agent City"
    },
    model: {
      value: _vm.branch_form.agent_city,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "agent_city", $$v);
      },
      expression: "branch_form.agent_city"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "agent_city"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-select", {
    attrs: {
      options: _vm.all_company
    },
    model: {
      value: _vm.branch_form.company_id,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "company_id", $$v);
      },
      expression: "branch_form.company_id"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "company"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("agent_issue_sign")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Agent issue Sign"
    },
    model: {
      value: _vm.branch_form.agent_issue_sign,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "agent_issue_sign", $$v);
      },
      expression: "branch_form.agent_issue_sign"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "agent_issue_sign"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("div", {
    ref: "dropdownContainer",
    staticClass: "custom-dropdown",
    on: {
      click: _vm.toggleDropdown
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.searchQuery,
      expression: "searchQuery"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Agent Issue Loc Code",
      id: "from_id",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.searchQuery
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.searchQuery = $event.target.value;
      }
    }
  }), _vm._v(" "), _vm.isDropdownOpen ? _c("div", {
    staticClass: "dropdown-options"
  }, _vm._l(_vm.filteredLocations, function (item, index) {
    return _c("div", {
      key: index,
      staticClass: "option",
      on: {
        click: function click($event) {
          return _vm.selectOption(item);
        }
      }
    }, [_vm._v(_vm._s(item.iata_code) + ", " + _vm._s(item.destination) + " (" + _vm._s(item.iata_code) + ")")]);
  }), 0) : _vm._e()])]), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("agent_issue_date")
    },
    attrs: {
      id: "input-1",
      type: "date",
      required: "",
      placeholder: "Agent Issue Date"
    },
    model: {
      value: _vm.branch_form.agent_issue_date,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "agent_issue_date", $$v);
      },
      expression: "branch_form.agent_issue_date"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "agent_issue_date"
    }
  })], 1)], 1), _vm._v(" "), _c("div", [_vm._v("Iata Code and Case")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("iata_agent_code")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "IATA Agent Code"
    },
    model: {
      value: _vm.branch_form.iata_agent_code,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "iata_agent_code", $$v);
      },
      expression: "branch_form.iata_agent_code"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "iata_agent_code"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("iata_agent_cass")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "IATA Agent Cass"
    },
    model: {
      value: _vm.branch_form.iata_agent_cass,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "iata_agent_cass", $$v);
      },
      expression: "branch_form.iata_agent_cass"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "iata_agent_cass"
    }
  })], 1)], 1), _vm._v(" "), _c("div", [_vm._v("Participant Details")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("participant_airport")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Participant Airport"
    },
    model: {
      value: _vm.branch_form.participant_airport,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "participant_airport", $$v);
      },
      expression: "branch_form.participant_airport"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "participant_airport"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("prticipant_identifer")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Participant Identifer"
    },
    model: {
      value: _vm.branch_form.prticipant_identifer,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "prticipant_identifer", $$v);
      },
      expression: "branch_form.prticipant_identifer"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "prticipant_identifer"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("participant_code")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Participant Code"
    },
    model: {
      value: _vm.branch_form.participant_code,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "participant_code", $$v);
      },
      expression: "branch_form.participant_code"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "participant_code"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("participant_file_reference")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Participant File Reference"
    },
    model: {
      value: _vm.branch_form.participant_file_reference,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "participant_file_reference", $$v);
      },
      expression: "branch_form.participant_file_reference"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "participant_file_reference"
    }
  })], 1)], 1), _vm._v(" "), _c("div", [_vm._v("Office Details")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("office_airport")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Office Airport"
    },
    model: {
      value: _vm.branch_form.office_airport,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "office_airport", $$v);
      },
      expression: "branch_form.office_airport"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "office_airport"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("office_function_designator")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Office Function Designtor"
    },
    model: {
      value: _vm.branch_form.office_function_designator,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "office_function_designator", $$v);
      },
      expression: "branch_form.office_function_designator"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "office_function_designator"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("office_company_designator")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Office Company Designator"
    },
    model: {
      value: _vm.branch_form.office_company_designator,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "office_company_designator", $$v);
      },
      expression: "branch_form.office_company_designator"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "office_company_designator"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("office_file_reference")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Office File Reference"
    },
    model: {
      value: _vm.branch_form.office_file_reference,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "office_file_reference", $$v);
      },
      expression: "branch_form.office_file_reference"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "office_file_reference"
    }
  })], 1)], 1), _vm._v(" "), _c("div", [_vm._v("HO Details")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("ho_name")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Ho Name"
    },
    model: {
      value: _vm.branch_form.ho_name,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "ho_name", $$v);
      },
      expression: "branch_form.ho_name"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "ho_name"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("ho_address")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Ho Address"
    },
    model: {
      value: _vm.branch_form.ho_address,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "ho_address", $$v);
      },
      expression: "branch_form.ho_address"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "ho_address"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("ho_city")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Ho City"
    },
    model: {
      value: _vm.branch_form.ho_city,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "ho_city", $$v);
      },
      expression: "branch_form.ho_city"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "ho_city"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("ho_pincode")
    },
    attrs: {
      id: "input-1",
      type: "number",
      required: "",
      placeholder: "Ho Pincode"
    },
    model: {
      value: _vm.branch_form.ho_pincode,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "ho_pincode", $$v);
      },
      expression: "branch_form.ho_pincode"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "ho_pincode"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex mb-7"
  }, [_c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("ho_state")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Ho State"
    },
    model: {
      value: _vm.branch_form.ho_state,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "ho_state", $$v);
      },
      expression: "branch_form.ho_state"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "ho_state"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "w-50 mr-2"
  }, [_c("b-form-input", {
    staticClass: "mx-1 input-box",
    "class": {
      "is-invalid": _vm.branch_form.errors.has("ho_country")
    },
    attrs: {
      id: "input-1",
      type: "text",
      required: "",
      placeholder: "Ho Country"
    },
    model: {
      value: _vm.branch_form.ho_country,
      callback: function callback($$v) {
        _vm.$set(_vm.branch_form, "ho_country", $$v);
      },
      expression: "branch_form.ho_country"
    }
  }), _vm._v(" "), _c("has-error", {
    attrs: {
      form: _vm.branch_form,
      field: "ho_country"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "alert alert-success mt-3",
    attrs: {
      role: "alert",
      id: "fade"
    }
  }, [_c("span", {
    staticClass: "font-weight-bolder font-size-h6"
  }, [_vm._v("Saved Successfully")])]), _vm._v(" "), _c("button", {
    staticClass: "btn font-weight-bolder font-size-h6 py-3 w-100 create_btn text-white mt-3"
  }, [_vm._v("\n                " + _vm._s(_vm.action) + " Branch\n            ")])])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.fw-700[data-v-23ef4156] {\r\n    font-weight: 700;\n}\n.input-box[data-v-23ef4156] {\r\n    border: 1px silver solid;\n}\n.create_btn[data-v-23ef4156] {\r\n    background: #00a1e4;\n}\n#fade[data-v-23ef4156] {\r\n    display: none;\n}\n.custom-dropdown[data-v-23ef4156] {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: 100%;\r\n    border: solid 1px silver;\r\n    border-radius: 5px;\n}\n.form-control[data-v-23ef4156] {\r\n    width: 100%;\n}\n.dropdown-options[data-v-23ef4156] {\r\n    position: absolute;\r\n    top: 100%;\r\n    left: 0;\r\n    width: 100%;\r\n    background-color: #fff;\r\n    border: 1px solid #ccc;\r\n    border-top: none;\r\n    max-height: 200px; /* Adjust as needed */\r\n    overflow-y: auto;\n}\n.option[data-v-23ef4156] {\r\n    padding: 5px 10px;\r\n    cursor: pointer;\n}\n.option[data-v-23ef4156]:hover {\r\n    background-color: #f0f0f0;\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_style_index_0_id_23ef4156_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_style_index_0_id_23ef4156_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_style_index_0_id_23ef4156_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewBranch.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewBranch.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _NewBranch_vue_vue_type_template_id_23ef4156_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NewBranch.vue?vue&type=template&id=23ef4156&scoped=true */ "./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=template&id=23ef4156&scoped=true");
/* harmony import */ var _NewBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NewBranch.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=script&lang=js");
/* harmony import */ var _NewBranch_vue_vue_type_style_index_0_id_23ef4156_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _NewBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _NewBranch_vue_vue_type_template_id_23ef4156_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _NewBranch_vue_vue_type_template_id_23ef4156_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "23ef4156",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/NewBranch.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewBranch.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=template&id=23ef4156&scoped=true":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=template&id=23ef4156&scoped=true ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_template_id_23ef4156_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_template_id_23ef4156_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_template_id_23ef4156_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewBranch.vue?vue&type=template&id=23ef4156&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=template&id=23ef4156&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_NewBranch_vue_vue_type_style_index_0_id_23ef4156_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/NewBranch.vue?vue&type=style&index=0&id=23ef4156&scoped=true&lang=css");


/***/ })

}]);