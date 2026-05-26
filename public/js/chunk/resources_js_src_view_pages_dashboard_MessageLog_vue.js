"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_MessageLog_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




// import PageLoader from '../../components/PageLoader.vue';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MessageLog",
  data: function data() {
    return {
      form: new Form({
        masterStart: "",
        masterEnd: ""
      }),
      selectedViewPageOption: '/message-log',
      filter: "",
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      pageOptions: [10, 20, 50, 100],
      data_items: [],
      house_way_bills: {},
      filteredData: [],
      isSearchValid: false,
      searchPerformed: false,
      consolidation: [],
      existingData: {},
      errorMessage: '',
      isLoading: false,
      fields: [{
        key: "index",
        label: "Sl No."
      }, {
        key: "id",
        label: "AWB No."
      }, {
        key: "destination_airport",
        label: "Destination"
      }, {
        key: "created_at",
        label: "Date & time"
      }, {
        key: "houseway",
        label: ""
      }]
    };
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)({
    current_user: "currentUser"
  })), {}, {
    filteredItems: function filteredItems() {
      if (!this.filter) return this.data_items;
      var search = this.filter.toLowerCase();
      return this.data_items.filter(function (item) {
        return (item.awb_code || "").toString().toLowerCase().includes(search) || (item.awb_no || "").toString().toLowerCase().includes(search) || (item.destination_airport || "").toLowerCase().includes(search) || (item.place || "").toLowerCase().includes(search);
      });
    },
    normalizedItems: function normalizedItems() {
      var _this = this;
      if (this.searchPerformed && this.data_items && this.data_items.airway_bill && this.data_items.airway_bill !== null) {
        if (!this.data_items.airway_bill.destination_airport) return [];
        return [{
          id: this.data_items.airway_bill.id,
          awb_no: this.data_items.airway_bill.awb_no,
          awb_code: this.data_items.airway_bill.awb_code,
          destination_airport: this.getAirportCode(this.data_items.airway_bill.destination_airport),
          created_at: this.formatDate(this.data_items.airway_bill.created_at),
          house_way_bills: this.data_items.house_way_bills.filter(function (hwb) {
            return hwb.destination_airport;
          }).map(function (hwb) {
            return _objectSpread(_objectSpread({}, hwb), {}, {
              destination_airport: _this.getAirportCode(hwb.destination_airport),
              created_at: _this.formatDate(hwb.created_at)
            });
          })
        }];
      } else if (Array.isArray(this.data_items)) {
        return this.data_items.filter(function (item) {
          return item.destination_airport;
        });
      }
      return [];
    } // filteredItems() {
    //     if (!this.filter) return this.data_items;
    //     const search = this.filter.toLowerCase();
    //     return this.data_items.filter(
    //         (item) =>
    //         (item.awb_code || "")
    //                 .toString()
    //                 .toLowerCase()
    //                 .includes(search) ||
    //             (item.awb_no || "")
    //                 .toString()
    //                 .toLowerCase()
    //                 .includes(search) ||
    //             (item.destination_airport || "")
    //                 .toLowerCase()
    //                 .includes(search) ||
    //             (item.place || "").toLowerCase().includes(search)
    //     );
    // },
    // normalizedItems() {
    //     if (this.searchPerformed && this.data_items && this.data_items.airway_bill && this.data_items.airway_bill !== null) {
    //     return [{
    //         awb_no: this.data_items.airway_bill.awb_no,
    //         awb_code: this.data_items.airway_bill.awb_code,
    //         destination_airport: this.getAirportCode(this.data_items.airway_bill.destination_airport),
    //         created_at: this.formatDate(this.data_items.airway_bill.created_at),
    //         house_way_bills: this.data_items.house_way_bills.map(hwb => ({
    //         ...hwb,
    //         destination_airport: this.getAirportCode(hwb.destination_airport),
    //         created_at: this.formatDate(hwb.created_at),
    //         }))
    //     }];
    //     } else if (Array.isArray(this.data_items)) {
    //     return this.data_items;
    //     }
    //     return [];
    // }
  }),
  watch: {
    filteredItems: function filteredItems(val) {
      this.totalRows = val.length;
    },
    "$route.params.id": function $routeParamsId(newId) {
      if (newId) {
        this.getAirWayBill(newId);
        this.getHouseWayBill(newId);
      }
    }
  },
  mounted: function mounted() {
    this.totalRows = this.data_items.length;
    this.allAirwayBill();
  },
  methods: {
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onSelect: function onSelect(value) {
      if (value) {
        window.location.href = value;
      }
    },
    getHouseWayBills: function getHouseWayBills(item) {
      var _this2 = this;
      if (!item.awb_code || !item.awb_no) return [];
      var key = "".concat(String(item.awb_code), "-").concat(String(item.awb_no));
      if (!this.house_way_bills[key]) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/house-way-bills/".concat(String(item.awb_code), "/").concat(String(item.awb_no))).then(function (response) {
          _this2.$set(_this2.house_way_bills, key, response.data);
        })["catch"](function (error) {
          console.error("Failed to fetch house way bills:", error);
          _this2.$set(_this2.house_way_bills, key, []);
        });
        return [];
      }
      return this.house_way_bills[key];
    },
    getHouseWayBill: function getHouseWayBill(id) {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/houseway-bill/".concat(id)).then(function (response) {
        _this3.existingData = response.data;
        _this3.openForm("update", _this3.existingData.id);
        if (_this3.existingData && _this3.existingData.consignment_data) {
          _this3.isConsignmentAdded = true;
        }
      })["catch"](function (error) {
        console.error("Failed to fetch data for updating:", error);
      });
    },
    formatDate: function formatDate(dateString) {
      var date = new Date(dateString);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).replace(",", "");
    },
    getAirportCode: function getAirportCode(airport) {
      if (!airport) return "";
      return airport.split(",")[0].trim();
    },
    allAirwayBill: function allAirwayBill() {
      var _this4 = this;
      this.isLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/all-airway-bill").then(function (response) {
        _this4.data_items = response.data;
        _this4.filteredData = response.data;
        _this4.totalRows = response.data.length;
      })["catch"](function (error) {
        console.error("Failed to fetch items:", error);
        _this4.data_items = [];
        _this4.filteredData = [];
      })["finally"](function () {
        _this4.isLoading = false;
      });
    },
    getAirWayBill: function getAirWayBill(id) {
      var _this5 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        if (response.data && response.data.id == id) {
          _this5.existingData = response.data;
        } else {}
      })["catch"](function (error) {
        _this5.existingData = null;
      });
    },
    handleDeleteHouseBill: function handleDeleteHouseBill(id) {
      var _this6 = this;
      if (confirm("Are you sure you want to delete this house way bill?")) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"]["delete"]("/user/house-way-bills/".concat(id)).then(function () {
          // Clear the cached house way bills
          _this6.house_way_bills = {};
          // Refresh the data
          _this6.allAirwayBill();
        })["catch"](function (error) {
          console.error("Failed to delete house way bill:", error);
        });
      }
    },
    searchAWB: function searchAWB() {
      var _this7 = this;
      this.errorMessage = ''; // reset
      this.searchPerformed = false;
      if (!this.form.masterStart || !this.form.masterEnd) {
        this.$bvToast.toast('Please enter both master start and end numbers.', {
          title: 'Validation Error',
          variant: 'danger',
          solid: true
        });
        return;
      }
      this.form.post("/user/search-airway-bills", {
        params: {
          awb_code: this.form.masterStart,
          awb_no: this.form.masterEnd
        }
      }).then(function (response) {
        // this.airway_bill = response.data.airway_bill;
        // this.data_items = response.data.house_way_bills;
        _this7.data_items = response.data;
        _this7.currentPage = 1;
        _this7.searchPerformed = true;
        _this7.totalRows = response.data.length;
        // this.form.reset();
      })["catch"](function (error) {
        _this7.searchPerformed = true;
        if (error.response && error.response.data && error.response.data.message) {
          _this7.errorMessage = error.response.data.message;
        } else {
          _this7.errorMessage = 'Something went wrong.';
        }
      });
    },
    validateAwbCode: function validateAwbCode(value) {
      this.form.masterStart = value.replace(/[^0-9]/g, '').slice(0, 3);
      this.validateSearch();
      this.checkEmptyFields();
    },
    validateAwbNo: function validateAwbNo(value) {
      this.form.masterEnd = value.replace(/[^0-9]/g, '').slice(0, 8);
      this.validateSearch();
      this.checkEmptyFields();
    },
    validateSearch: function validateSearch() {
      this.isSearchValid = this.form.masterStart.length === 3 && this.form.masterEnd.length === 8;
    },
    checkEmptyFields: function checkEmptyFields() {
      // If both fields are empty, reload all data
      if (this.form.masterStart === "" && this.form.masterEnd === "") {
        this.searchPerformed = false;
        this.errorMessage = '';
        this.allAirwayBill();
      }
    },
    clearSearch: function clearSearch() {
      // Clear the form fields
      this.form.masterStart = "";
      this.form.masterEnd = "";
      this.searchPerformed = false;
      this.errorMessage = '';
      this.allAirwayBill();
    }
  },
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
    // PageLoader
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=template&id=1380a914&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=template&id=1380a914&scoped=true ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      "min-width": "0",
      overflow: "hidden"
    }
  }, [_c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10"
  }, [[_c("b-row", {
    staticClass: "align-items-center mb-0"
  }, [_c("b-col", {
    attrs: {
      cols: "12"
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
      "margin-bottom": "0px",
      "font-family": "'Inter', sans-serif !important"
    }
  }, [_vm._v("Message Log")])])])], 1)]], 2), _vm._v(" "), _c("hr", {
    staticClass: "hr"
  }), _vm._v(" "), _c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10"
  }, [_c("div", {
    staticClass: "mx-2 mx-sm-4"
  }, [_c("h4", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Search Waybill Messages")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center mb-6 flex-wrap",
    staticStyle: {
      gap: "12px",
      background: "#F8FCFF",
      border: "1px solid #E6F0FF",
      padding: "20px 24px",
      "border-radius": "16px",
      width: "fit-content"
    }
  }, [_c("label", {
    staticClass: "mb-0 font-weight-bold",
    staticStyle: {
      color: "#355594",
      "font-size": "0.95rem"
    }
  }, [_vm._v("\n                            Master No: "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-form-input", {
    staticClass: "form-control-custom awb-code-input text-center",
    staticStyle: {
      width: "70px"
    },
    attrs: {
      id: "awb_code",
      maxlength: "3",
      placeholder: "Prefix"
    },
    on: {
      input: _vm.validateAwbCode
    },
    model: {
      value: _vm.form.masterStart,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "masterStart", $$v);
      },
      expression: "form.masterStart"
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      color: "#355594",
      "font-weight": "bold"
    }
  }, [_vm._v("-")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control-custom awb-no-input text-center",
    staticStyle: {
      width: "140px"
    },
    attrs: {
      id: "awb_no",
      maxlength: "8",
      placeholder: "AWB Number"
    },
    on: {
      input: _vm.validateAwbNo
    },
    model: {
      value: _vm.form.masterEnd,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "masterEnd", $$v);
      },
      expression: "form.masterEnd"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-button", {
    staticClass: "show-btn",
    staticStyle: {
      height: "42px"
    },
    on: {
      click: _vm.searchAWB
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "search"
    }
  }), _vm._v("Search\n                            ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    staticStyle: {
      height: "42px"
    },
    on: {
      click: _vm.clearSearch
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "x-circle"
    }
  }), _vm._v("Clear\n                            ")], 1)], 1)]), _vm._v(" "), _vm.errorMessage ? _c("div", {
    staticClass: "text-center text-danger my-3"
  }, [_vm._v("\n                        " + _vm._s(_vm.errorMessage) + "\n                    ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-4 mt-6"
  }, [_c("h4", {
    staticClass: "h-color mb-0"
  }, [_vm._v("Message History Logs")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      background: "#F0F7FF",
      "border-radius": "12px",
      padding: "6px 14px",
      border: "1px solid #E6F0FF"
    }
  }, [_c("span", {
    staticClass: "mr-2 font-weight-bold",
    staticStyle: {
      color: "#355594",
      "font-size": "0.85rem"
    }
  }, [_vm._v("Show:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control-sm",
    staticStyle: {
      width: "65px",
      border: "0px !important",
      color: "#355594",
      "font-weight": "600",
      background: "transparent",
      cursor: "pointer",
      outline: "none",
      "box-shadow": "none",
      "padding-left": "0",
      "padding-top": "0",
      "padding-bottom": "0",
      height: "auto"
    },
    attrs: {
      id: "per-page-select",
      options: _vm.pageOptions
    },
    model: {
      value: _vm.perPage,
      callback: function callback($$v) {
        _vm.perPage = $$v;
      },
      expression: "perPage"
    }
  })], 1)]), _vm._v(" "), _vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 10,
      columns: 5
    }
  }) : [_c("b-table", {
    staticClass: "w-100 custom-table",
    attrs: {
      items: _vm.normalizedItems,
      fields: _vm.fields,
      small: "",
      responsive: "",
      "per-page": _vm.perPage,
      "current-page": _vm.currentPage
    },
    on: {
      filtered: _vm.onFiltered
    },
    scopedSlots: _vm._u([{
      key: "cell(index)",
      fn: function fn(row) {
        return [_c("span", {
          staticClass: "font-weight-bold text-muted"
        }, [_vm._v(_vm._s(row.index + 1))])];
      }
    }, {
      key: "cell(id)",
      fn: function fn(row) {
        return [_c("router-link", {
          staticClass: "custom-link font-weight-bold",
          attrs: {
            to: "/edit-airway-bill/" + String(row.item.id)
          },
          nativeOn: {
            click: function click($event) {
              _vm.getAirWayBill(String(row.item.id));
            }
          }
        }, [_vm._v("\n                                " + _vm._s(String(row.item.awb_code)) + "-" + _vm._s(String(row.item.awb_no)) + "\n                            ")])];
      }
    }, {
      key: "cell(destination_airport)",
      fn: function fn(row) {
        return [_c("span", {
          staticClass: "badge badge-light px-2 py-1",
          staticStyle: {
            color: "#355594",
            background: "#F0F7FF",
            border: "1px solid #E6F0FF",
            "font-weight": "600",
            "border-radius": "6px"
          }
        }, [_vm._v("\n                                " + _vm._s(_vm.getAirportCode(row.item.destination_airport)) + "\n                            ")])];
      }
    }, {
      key: "cell(send_created)",
      fn: function fn(row) {
        return [_c("span", {
          staticClass: "text-muted"
        }, [_vm._v(_vm._s(_vm.formatDate(row.item.send_created)))])];
      }
    }, {
      key: "head(houseway)",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex font-weight-bold",
          staticStyle: {
            color: "#8A99AD",
            "font-size": "11px",
            "text-transform": "uppercase",
            "letter-spacing": "0.5px"
          }
        }, [_c("div", {
          staticClass: "w-25"
        }, [_vm._v("House No.")]), _vm._v(" "), _c("div", {
          staticClass: "w-25"
        }, [_vm._v("Actions")]), _vm._v(" "), _c("div", {
          staticClass: "w-25"
        }, [_vm._v("Place")]), _vm._v(" "), _c("div", {
          staticClass: "w-25"
        }, [_vm._v("Date")])])];
      },
      proxy: true
    }, {
      key: "cell(houseway)",
      fn: function fn(row) {
        return [_vm.getHouseWayBills(row.item).length ? _c("div", {
          staticClass: "mb-3"
        }, _vm._l(_vm.getHouseWayBills(row.item), function (bill, i) {
          return _c("div", {
            key: i,
            staticClass: "d-flex py-2 house-row border-bottom align-items-center"
          }, [_c("div", {
            staticClass: "w-25 font-weight-bold text-muted"
          }, [_vm._v(_vm._s(bill.id))]), _vm._v(" "), _c("div", {
            staticClass: "w-25 d-flex align-items-center"
          }, [_c("b-icon", {
            staticClass: "text-primary mr-3",
            staticStyle: {
              cursor: "pointer",
              "font-size": "1.1rem"
            },
            attrs: {
              icon: "pencil"
            },
            on: {
              click: function click($event) {
                return _vm.$router.push("/edit-houseway-bill/" + bill.id);
              }
            }
          }), _vm._v(" "), _c("b-icon", {
            staticClass: "text-danger",
            staticStyle: {
              cursor: "pointer",
              "font-size": "1.1rem"
            },
            attrs: {
              icon: "trash"
            },
            on: {
              click: function click($event) {
                return _vm.handleDeleteHouseBill(bill.id);
              }
            }
          })], 1), _vm._v(" "), _c("div", {
            staticClass: "w-25"
          }, [_c("span", {
            staticClass: "badge badge-light px-2 py-1",
            staticStyle: {
              color: "#475569",
              background: "#F8FCFF",
              border: "1px solid #E2E8F0",
              "font-weight": "500",
              "border-radius": "6px"
            }
          }, [_vm._v("\n                                            " + _vm._s(_vm.getAirportCode(bill.destination_airport)) + "\n                                        ")])]), _vm._v(" "), _c("div", {
            staticClass: "w-25 text-muted",
            staticStyle: {
              "font-size": "0.8rem"
            }
          }, [_vm._v("\n                                        " + _vm._s(_vm.formatDate(bill.created_at)) + "\n                                    ")])]);
        }), 0) : _vm._e(), _vm._v(" "), _c("div", {
          staticClass: "d-flex font-weight-bold waybill-status-header"
        }, [_c("div", {
          staticClass: "w-25"
        }, [_vm._v("FNA and FMAs")]), _vm._v(" "), _c("div", {
          staticClass: "w-25 text-right pr-3"
        }, [_vm._v("Date")])]), _vm._v(" "), _c("div", {
          staticClass: "status-response-container"
        }, _vm._l(_vm.data_items.status_reponse, function (status, i) {
          return _c("div", {
            key: i,
            staticClass: "status-log-item py-2 px-3 mb-2 rounded",
            staticStyle: {
              background: "#F8FCFF",
              border: "1px solid #E6F0FF"
            }
          }, [_c("div", {
            staticClass: "d-flex justify-content-between align-items-center"
          }, [_c("div", {
            staticClass: "d-flex align-items-center"
          }, [_c("span", {
            staticClass: "status-badge mr-2"
          }, [_vm._v(_vm._s(i + 1))]), _vm._v(" "), _c("span", {
            staticClass: "font-weight-bold",
            staticStyle: {
              color: "#355594",
              "font-size": "0.9rem"
            }
          }, [_vm._v(_vm._s(status.business_status_code))])]), _vm._v(" "), _c("span", {
            staticClass: "text-muted",
            staticStyle: {
              "font-size": "0.75rem"
            }
          }, [_vm._v(_vm._s(_vm.formatDate(status.created_at)))])]), _vm._v(" "), status.reason ? _c("div", {
            staticClass: "pl-7 mt-1 text-muted",
            staticStyle: {
              "font-size": "0.8rem"
            }
          }, [_c("b-icon", {
            staticClass: "mr-1",
            staticStyle: {
              color: "#355594",
              opacity: "0.7"
            },
            attrs: {
              icon: "info-circle"
            }
          }), _vm._v(" "), _c("strong", [_vm._v(_vm._s(status.condition_code) + ":")]), _vm._v(" " + _vm._s(status.reason) + "\n                                    ")], 1) : _vm._e()]);
        }), 0)];
      }
    }])
  })], _vm._v(" "), _c("b-pagination", {
    staticClass: "mt-4 custom-pagination",
    attrs: {
      "total-rows": _vm.totalRows,
      "per-page": _vm.perPage,
      align: "right"
    },
    model: {
      value: _vm.currentPage,
      callback: function callback($$v) {
        _vm.currentPage = $$v;
      },
      expression: "currentPage"
    }
  })], 2)])])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.waybill-status-header{\n        background: #3b6fb6;\n        color: #fff;\n        font-weight: 600;\n        padding: 6px 8px;\n        justify-content: space-between;\n}\nhr{\n    margin-top: 0px !important;\n    margin-bottom: 0px !important;\n}\ntd[aria-colindex=\"5\"] {\n  width: 50% !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.custom-table[data-v-1380a914] {\n    border-collapse: separate !important;\n    border-spacing: 0 !important;\n    width: 100% !important;\n    margin-top: 10px !important;\n    margin-bottom: 20px !important;\n    background: transparent !important;\n    border: none !important;\n}\n.custom-table[data-v-1380a914] th {\n    color: #8A99AD !important;\n    font-weight: 600 !important;\n    font-size: 11px !important;\n    text-transform: uppercase !important;\n    letter-spacing: 0.5px !important;\n    padding: 12px 8px !important;\n    border-bottom: 2px solid rgba(53, 85, 148, 0.08) !important;\n    border-top: none !important;\n    background: #F8FCFF !important;\n    font-family: 'Inter', sans-serif !important;\n}\n.custom-table[data-v-1380a914] td {\n    padding: 14px 8px !important;\n    vertical-align: middle !important;\n    border-bottom: 1px solid rgba(53, 85, 148, 0.05) !important;\n    color: #475569 !important;\n    font-size: 13px !important;\n    background: transparent !important;\n}\n.custom-table[data-v-1380a914] tr:hover td {\n    background-color: rgba(53, 85, 148, 0.01) !important;\n}\n.custom-table th[data-v-1380a914]:nth-child(1),\n.custom-table td[data-v-1380a914]:nth-child(1) {\n    width: 60px !important;\n    text-align: center !important;\n}\n.custom-table th[data-v-1380a914]:nth-child(2),\n.custom-table td[data-v-1380a914]:nth-child(2) {\n    width: 140px !important;\n}\n.custom-link[data-v-1380a914] {\n    color: #355594 !important;\n    font-weight: 600 !important;\n    transition: all 0.3s ease !important;\n    text-decoration: none !important;\n    border-bottom: 1px dashed rgba(53, 85, 148, 0.4) !important;\n}\n.custom-link[data-v-1380a914]:hover {\n    color: #2637a8 !important;\n    border-bottom: 1px solid #2637a8 !important;\n    text-decoration: none !important;\n}\n.house-row[data-v-1380a914] {\n    border-bottom: 1px solid rgba(53, 85, 148, 0.05) !important;\n    align-items: center;\n    transition: all 0.2s ease;\n}\n.house-row[data-v-1380a914]:hover {\n    background-color: rgba(53, 85, 148, 0.02);\n}\n.house-row .b-icon[data-v-1380a914] {\n    transition: transform 0.2s ease, opacity 0.2s ease;\n}\n.house-row .b-icon[data-v-1380a914]:hover {\n    transform: scale(1.15);\n}\n.waybill-status-header[data-v-1380a914] {\n    background: rgba(53, 85, 148, 0.06);\n    color: #355594;\n    font-weight: 700;\n    font-size: 0.8rem;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    padding: 8px 12px;\n    border-radius: 8px;\n    margin-top: 10px;\n    margin-bottom: 6px;\n    display: flex;\n    justify-content: space-between;\n}\n.status-log-item[data-v-1380a914] {\n    transition: all 0.3s ease;\n}\n.status-log-item[data-v-1380a914]:hover {\n    background: #F0F7FF !important;\n    border-color: #355594 !important;\n    transform: translateY(-1px);\n    box-shadow: 0 4px 10px rgba(53, 85, 148, 0.05);\n}\n.status-badge[data-v-1380a914] {\n    background: #E6F0FF;\n    color: #355594;\n    font-weight: 700;\n    font-size: 0.75rem;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n}\n.hr[data-v-1380a914] {\n    border: 0;\n    border-top: 1px solid rgba(53, 85, 148, 0.12);\n    margin: 2rem 0;\n}\n.h-color[data-v-1380a914] {\n    color: #355594;\n    font-family: 'Inter', sans-serif;\n    font-weight: 800 !important;\n    font-size: 18px !important;\n    letter-spacing: -0.2px;\n}\n.custom-pagination[data-v-1380a914] .page-link {\n    background-color: #F8FCFF !important;\n    color: #355594 !important;\n    border: 1px solid #E6F0FF !important;\n    border-radius: 8px !important;\n    margin: 0 3px !important;\n    font-weight: 600 !important;\n    transition: all 0.3s ease !important;\n}\n.custom-pagination[data-v-1380a914] .page-link:hover {\n    background-color: #F0F7FF !important;\n    border-color: #355594 !important;\n}\n.custom-pagination[data-v-1380a914] .page-item.active .page-link {\n    background-color: #355594 !important;\n    border-color: #355594 !important;\n    color: #FFFFFF !important;\n    box-shadow: 0 4px 10px rgba(53, 85, 148, 0.2) !important;\n}\n.custom-pagination[data-v-1380a914] .page-item.disabled .page-link {\n    background-color: #F8FCFF !important;\n    color: #A0AEC0 !important;\n    border-color: #E2E8F0 !important;\n    opacity: 0.6 !important;\n}\n.show-btn[data-v-1380a914] {\n  background: white !important;\n  color: #355594 !important;\n  border: 1px solid #E6F0FF !important;\n  border-radius: 50px !important;\n  padding: 10px 22px !important;\n  font-weight: 600 !important;\n  transition: all 0.3s ease !important;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;\n}\n.show-btn[data-v-1380a914]:hover {\n  background: #f0f7ff !important;\n  border-color: #355594 !important;\n  color: #355594 !important;\n  box-shadow: 0 6px 12px rgba(53, 85, 148, 0.1) !important;\n}\n.form-control-custom[data-v-1380a914] {\n    border: 1px solid #E6F0FF !important;\n    border-radius: 8px !important;\n    height: 42px !important;\n    padding: 10px 16px !important;\n    font-size: 14px !important;\n    color: #355594 !important;\n    font-weight: 500 !important;\n    background-color: #ffffff !important;\n    transition: all 0.3s ease !important;\n}\n.form-control-custom[data-v-1380a914]:focus {\n    border-color: #355594 !important;\n    background-color: #ffffff !important;\n    box-shadow: 0 0 0 3px rgba(53, 85, 148, 0.1) !important;\n    outline: none !important;\n}\n.awb-code-input[data-v-1380a914], .awb-no-input[data-v-1380a914] {\n    text-align: center !important;\n    font-weight: 600 !important;\n    letter-spacing: 0.5px !important;\n}\n@media (max-width: 767.98px) {\n.custom-pagination[data-v-1380a914] {\n    justify-content: center !important;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_0_id_1380a914_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_0_id_1380a914_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_0_id_1380a914_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_1_id_1380a914_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_1_id_1380a914_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_1_id_1380a914_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/MessageLog.vue":
/*!**************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/MessageLog.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MessageLog_vue_vue_type_template_id_1380a914_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageLog.vue?vue&type=template&id=1380a914&scoped=true */ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=template&id=1380a914&scoped=true");
/* harmony import */ var _MessageLog_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MessageLog.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=script&lang=js");
/* harmony import */ var _MessageLog_vue_vue_type_style_index_0_id_1380a914_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css */ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css");
/* harmony import */ var _MessageLog_vue_vue_type_style_index_1_id_1380a914_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _MessageLog_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MessageLog_vue_vue_type_template_id_1380a914_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _MessageLog_vue_vue_type_template_id_1380a914_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1380a914",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/MessageLog.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MessageLog.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=template&id=1380a914&scoped=true":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=template&id=1380a914&scoped=true ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_template_id_1380a914_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_template_id_1380a914_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_template_id_1380a914_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MessageLog.vue?vue&type=template&id=1380a914&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=template&id=1380a914&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_0_id_1380a914_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=0&id=1380a914&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css":
/*!**********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MessageLog_vue_vue_type_style_index_1_id_1380a914_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/MessageLog.vue?vue&type=style&index=1&id=1380a914&scoped=true&lang=css");


/***/ })

}]);