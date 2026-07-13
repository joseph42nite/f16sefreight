"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_ClientShipments_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadminclientshipments",
  data: function data() {
    return {
      fields: [{
        label: "Sl",
        key: "index"
      }, {
        label: "AWB Number / Client",
        key: "awb_number"
      }, {
        label: "HAWB Count",
        key: "house_way_bills_count"
      }, {
        label: "Origin",
        key: "departure_airport"
      }, {
        label: "Destination",
        key: "destination_airport"
      }, {
        label: "Pcs",
        key: "pieces"
      }, {
        label: "Weight",
        key: "weight"
      }, {
        label: "Time & Date Sent",
        key: "date_sent"
      }, {
        label: "FNA Status",
        key: "fna_status"
      }, {
        label: "Sent XML",
        key: "action"
      }],
      items: [],
      companies: [],
      filters: {
        company_id: null,
        origin: "",
        destination: "",
        date: "",
        fna_status: null
      },
      fnaOptions: [{
        value: null,
        text: "All Shipments"
      }, {
        value: "yes",
        text: "FNA Received"
      }, {
        value: "no",
        text: "No FNA"
      }],
      totalAwb: 0,
      totalHawb: 0,
      isLoading: false,
      searchText: "",
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20, {
        value: 100,
        text: "Show a lot"
      }],
      xmlContent: "",
      selectedAwbId: ""
    };
  },
  components: {
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  computed: {
    companyOptions: function companyOptions() {
      var options = [{
        value: null,
        text: "All Clients / Companies"
      }];
      this.companies.forEach(function (company) {
        options.push({
          value: company.id,
          text: company.name
        });
      });
      return options;
    }
  },
  methods: {
    fetchCompanies: function fetchCompanies() {
      var _this = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/all-company").then(function (_ref) {
        var data = _ref.data;
        _this.companies = data;
      })["catch"](function (err) {
        console.error("Failed to load companies", err);
      });
    },
    fetchShipments: function fetchShipments() {
      var _this2 = this;
      this.isLoading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].query("/superadmin/client-shipments", {
        params: this.filters
      }).then(function (_ref2) {
        var data = _ref2.data;
        _this2.items = data.shipments;
        _this2.totalAwb = data.total_awb;
        _this2.totalHawb = data.total_hawb;
        _this2.totalRows = data.shipments.length;
      })["catch"](function (err) {
        console.error("Failed to load shipments", err);
        sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire("Error", "Could not retrieve shipments data.", "error");
      })["finally"](function () {
        _this2.isLoading = false;
      });
    },
    resetFilters: function resetFilters() {
      this.filters = {
        company_id: null,
        origin: "",
        destination: "",
        date: "",
        fna_status: null
      };
      this.fetchShipments();
    },
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    formatDate: function formatDate(dateString) {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    formatTime: function formatTime(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    viewXml: function viewXml(awbId) {
      var _this3 = this;
      this.selectedAwbId = awbId;
      this.xmlContent = "Loading XML content...";
      this.$bvModal.show("xml-viewer-modal");
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/superadmin/shipment-xml/".concat(awbId)).then(function (response) {
        // If response is XML string
        _this3.xmlContent = typeof response.data === 'string' ? response.data : new XMLSerializer().serializeToString(response.data);
      })["catch"](function (err) {
        console.error("Failed to fetch XML file", err);
        _this3.xmlContent = "Error: XML file could not be found or retrieved.";
      });
    },
    copyXml: function copyXml() {
      navigator.clipboard.writeText(this.xmlContent).then(function () {
        sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire({
          title: "Copied!",
          text: "XML content copied to clipboard.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      })["catch"](function (err) {
        sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire("Error", "Failed to copy text.", "error");
      });
    },
    downloadXml: function downloadXml() {
      var blob = new Blob([this.xmlContent], {
        type: "application/xml"
      });
      var link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "xml_airway_bill_".concat(this.selectedAwbId, ".xml");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted: function mounted() {
    this.fetchCompanies();
    this.fetchShipments();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "py-5"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "row mb-5"
  }, [_c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-glass-card stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-primary text-white"
  }, [_c("div", [_c("span", {
    staticClass: "stats-label text-white-50 text-uppercase font-weight-bold"
  }, [_vm._v("Total AWB Shipments")]), _vm._v(" "), _c("h3", {
    staticClass: "stats-value font-weight-bolder mt-2"
  }, [_vm._v(_vm._s(_vm.totalAwb))])]), _vm._v(" "), _vm._m(1)])]), _vm._v(" "), _c("div", {
    staticClass: "col-md-6"
  }, [_c("div", {
    staticClass: "admin-glass-card stats-card d-flex align-items-center justify-content-between p-6 bg-gradient-success text-white"
  }, [_c("div", [_c("span", {
    staticClass: "stats-label text-white-50 text-uppercase font-weight-bold"
  }, [_vm._v("Total HAWB Shipments")]), _vm._v(" "), _c("h3", {
    staticClass: "stats-value font-weight-bolder mt-2"
  }, [_vm._v(_vm._s(_vm.totalHawb))])]), _vm._v(" "), _vm._m(2)])])]), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card"
  }, [_c("div", {
    staticClass: "p-6 border-bottom mb-4 bg-light-card rounded-top"
  }, [_vm._m(3), _vm._v(" "), _c("div", {
    staticClass: "row align-items-end"
  }, [_c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Client / Company")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    attrs: {
      options: _vm.companyOptions
    },
    on: {
      change: _vm.fetchShipments
    },
    model: {
      value: _vm.filters.company_id,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "company_id", $$v);
      },
      expression: "filters.company_id"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Origin")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "e.g. JFK"
    },
    on: {
      keyup: function keyup($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.fetchShipments.apply(null, arguments);
      }
    },
    model: {
      value: _vm.filters.origin,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "origin", $$v);
      },
      expression: "filters.origin"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Destination")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "e.g. LHR"
    },
    on: {
      keyup: function keyup($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.fetchShipments.apply(null, arguments);
      }
    },
    model: {
      value: _vm.filters.destination,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "destination", $$v);
      },
      expression: "filters.destination"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("Date of Sending")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "form-control",
    attrs: {
      type: "date"
    },
    on: {
      change: _vm.fetchShipments
    },
    model: {
      value: _vm.filters.date,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "date", $$v);
      },
      expression: "filters.date"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 mb-3 mb-md-0"
  }, [_c("label", {
    staticClass: "font-weight-bold text-muted font-size-sm"
  }, [_vm._v("FNA Status")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control",
    attrs: {
      options: _vm.fnaOptions
    },
    on: {
      change: _vm.fetchShipments
    },
    model: {
      value: _vm.filters.fna_status,
      callback: function callback($$v) {
        _vm.$set(_vm.filters, "fna_status", $$v);
      },
      expression: "filters.fna_status"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "col-md-2 d-flex"
  }, [_c("b-button", {
    staticClass: "w-100 mr-2",
    attrs: {
      variant: "primary"
    },
    on: {
      click: _vm.fetchShipments
    }
  }, [_c("i", {
    staticClass: "fas fa-search"
  })]), _vm._v(" "), _c("b-button", {
    staticClass: "w-100",
    attrs: {
      variant: "outline-secondary"
    },
    on: {
      click: _vm.resetFilters
    }
  }, [_c("i", {
    staticClass: "fas fa-sync-alt"
  })])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "admin-filter-row d-flex flex-wrap align-items-center justify-content-between px-6 pt-4"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("span", {
    staticClass: "mr-3 font-weight-bold text-muted"
  }, [_vm._v("Show:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control-sm",
    staticStyle: {
      "max-width": "120px"
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
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "w-md-25"
  }, [_c("b-input-group", {
    attrs: {
      size: "sm"
    }
  }, [_c("b-form-input", {
    staticClass: "py-4",
    attrs: {
      id: "filter-input",
      type: "search",
      placeholder: "Search filtered table..."
    },
    model: {
      value: _vm.searchText,
      callback: function callback($$v) {
        _vm.searchText = $$v;
      },
      expression: "searchText"
    }
  })], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "admin-table-wrapper px-6 pb-6"
  }, [_vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 8,
      columns: 8
    }
  }) : _c("b-table", {
    attrs: {
      responsive: "",
      hover: "",
      items: _vm.items,
      fields: _vm.fields,
      "primary-key": "id",
      filter: _vm.searchText,
      "current-page": _vm.currentPage,
      "per-page": _vm.perPage,
      "thead-class": "text-uppercase text-muted font-size-xs",
      "empty-text": "No shipments found for this client matching the filters.",
      "show-empty": ""
    },
    on: {
      filtered: _vm.onFiltered
    },
    scopedSlots: _vm._u([{
      key: "cell(index)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bold"
        }, [_vm._v("#" + _vm._s((_vm.currentPage - 1) * _vm.perPage + data.index + 1))])];
      }
    }, {
      key: "cell(awb_number)",
      fn: function fn(data) {
        return [_c("div", [_c("span", {
          staticClass: "font-weight-bold text-dark font-size-lg"
        }, [_vm._v(_vm._s(data.item.awb_code) + "-" + _vm._s(data.item.awb_no))]), _vm._v(" "), data.item.agents_info && data.item.agents_info.company_name ? _c("div", {
          staticClass: "text-muted font-size-xs"
        }, [_c("i", {
          staticClass: "fas fa-building mr-1"
        }), _vm._v(_vm._s(data.item.agents_info.company_name.name) + "\n            ")]) : _vm._e()])];
      }
    }, {
      key: "cell(house_way_bills_count)",
      fn: function fn(data) {
        return [_c("b-badge", {
          staticClass: "px-3 py-2 font-weight-bold font-size-sm",
          attrs: {
            variant: "light-success",
            pill: ""
          }
        }, [_vm._v("\n            " + _vm._s(data.item.house_way_bills_count) + " HAWB\n          ")])];
      }
    }, {
      key: "cell(pieces)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "font-weight-bolder"
        }, [_vm._v(_vm._s(data.item.consignment_data ? data.item.consignment_data.pieces : "—"))])];
      }
    }, {
      key: "cell(weight)",
      fn: function fn(data) {
        return [data.item.consignment_data ? _c("span", {
          staticClass: "font-weight-bolder"
        }, [_vm._v("\n            " + _vm._s(data.item.consignment_data.gross_weight) + " " + _vm._s(data.item.consignment_data.weight_code || "K") + "\n          ")]) : _c("span", [_vm._v("—")])];
      }
    }, {
      key: "cell(date_sent)",
      fn: function fn(data) {
        return [_c("div", [_c("span", {
          staticClass: "font-weight-bold text-dark"
        }, [_vm._v(_vm._s(_vm.formatDate(data.item.created_at)))]), _vm._v(" "), _c("div", {
          staticClass: "text-muted font-size-xs"
        }, [_vm._v(_vm._s(_vm.formatTime(data.item.created_at)))])])];
      }
    }, {
      key: "cell(fna_status)",
      fn: function fn(data) {
        return [data.item.fna_received ? _c("b-badge", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "text-uppercase font-weight-bold px-3 py-2",
          attrs: {
            variant: "danger",
            title: data.item.fna_reason || "Rejection reason not specified"
          }
        }, [_c("i", {
          staticClass: "fas fa-exclamation-triangle mr-1"
        }), _vm._v(" FNA Received\n          ")]) : _c("b-badge", {
          staticClass: "text-uppercase font-weight-bold px-3 py-2",
          attrs: {
            variant: "success"
          }
        }, [_c("i", {
          staticClass: "fas fa-check-circle mr-1"
        }), _vm._v(" No FNA\n          ")])];
      }
    }, {
      key: "cell(action)",
      fn: function fn(data) {
        return [_c("b-button", {
          staticClass: "btn-icon-sm",
          attrs: {
            variant: "light-primary",
            size: "sm"
          },
          on: {
            click: function click($event) {
              return _vm.viewXml(data.item.id);
            }
          }
        }, [_c("i", {
          staticClass: "fas fa-code mr-1"
        }), _vm._v(" XML\n          ")])];
      }
    }])
  })], 1), _vm._v(" "), _vm.totalRows > 0 ? _c("div", {
    staticClass: "admin-pagination-wrap px-6 pb-6"
  }, [_c("div", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("\n        Showing " + _vm._s(_vm.items.length ? (_vm.currentPage - 1) * _vm.perPage + 1 : 0) + " to " + _vm._s(Math.min(_vm.currentPage * _vm.perPage, _vm.totalRows)) + " of " + _vm._s(_vm.totalRows) + " entries\n      ")]), _vm._v(" "), _c("b-pagination", {
    staticClass: "my-0",
    attrs: {
      "total-rows": _vm.totalRows,
      "per-page": _vm.perPage,
      size: "sm"
    },
    model: {
      value: _vm.currentPage,
      callback: function callback($$v) {
        _vm.currentPage = $$v;
      },
      expression: "currentPage"
    }
  })], 1) : _vm._e()]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "xml-viewer-modal",
      title: "XML Message Viewer",
      size: "lg",
      "hide-footer": "",
      "modal-class": "xml-modal",
      "header-bg-variant": "primary",
      "header-text-variant": "white"
    }
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-3"
  }, [_c("span", {
    staticClass: "font-weight-bold text-muted"
  }, [_vm._v("AWB ID: "), _c("span", {
    staticClass: "text-dark"
  }, [_vm._v(_vm._s(_vm.selectedAwbId))])]), _vm._v(" "), _c("div", [_c("b-button", {
    staticClass: "mr-2",
    attrs: {
      variant: "outline-primary",
      size: "sm"
    },
    on: {
      click: _vm.copyXml
    }
  }, [_c("i", {
    staticClass: "fas fa-copy mr-1"
  }), _vm._v(" Copy\n        ")]), _vm._v(" "), _c("b-button", {
    attrs: {
      variant: "primary",
      size: "sm"
    },
    on: {
      click: _vm.downloadXml
    }
  }, [_c("i", {
    staticClass: "fas fa-download mr-1"
  }), _vm._v(" Download\n        ")])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "xml-content-wrapper"
  }, [_c("pre", {
    staticClass: "xml-pre-code"
  }, [_c("code", [_vm._v(_vm._s(_vm.xmlContent))])])])])], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "admin-page-header"
  }, [_c("div", {
    staticClass: "d-flex flex-column"
  }, [_c("h2", [_vm._v("Client Shipments Tracker")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted font-size-sm"
  }, [_vm._v("Monitor all airway bills (AWB) and house airway bills (HAWB) executed per client")])])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "stats-icon"
  }, [_c("i", {
    staticClass: "fas fa-file-invoice font-size-h1 text-white-50"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "stats-icon"
  }, [_c("i", {
    staticClass: "fas fa-boxes font-size-h1 text-white-50"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("h5", {
    staticClass: "mb-4 text-primary font-weight-bold"
  }, [_c("i", {
    staticClass: "fas fa-filter mr-2"
  }), _vm._v("Filter Shipments")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=template&id=44e21582&scoped=true */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true");
/* harmony import */ var _ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js");
/* harmony import */ var _ClientShipments_vue_vue_type_style_index_0_id_44e21582_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css */ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "44e21582",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/ClientShipments.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_template_id_44e21582_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=template&id=44e21582&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=template&id=44e21582&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css":
/*!***********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ClientShipments_vue_vue_type_style_index_0_id_44e21582_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/ClientShipments.vue?vue&type=style&index=0&id=44e21582&scoped=true&lang=css");


/***/ })

}]);