"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_UserSettings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "UserSettings",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data() {
    return {
      isBusy: false,
      isSaving: false,
      showEditModal: false,
      searchQuery: "",
      filterType: "",
      typeOptions: [{
        value: "",
        text: "All Address Types"
      }, {
        value: "shipper_address",
        text: "Shipper Only"
      }, {
        value: "consignee_address",
        text: "Consignee Only"
      }],
      userProfile: {
        name: "",
        email: "",
        branch: "",
        company: ""
      },
      addressItems: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
      },
      tableFields: [{
        key: "address_type",
        label: "Type",
        sortable: false,
        thClass: "bg-light text-uppercase font-weight-700"
      }, {
        key: "name",
        label: "Name / Name 2",
        sortable: false,
        thClass: "bg-light text-uppercase font-weight-700"
      }, {
        key: "account",
        label: "Account #",
        sortable: false,
        thClass: "bg-light text-uppercase font-weight-700"
      }, {
        key: "address",
        label: "Address & Location",
        sortable: false,
        thClass: "bg-light text-uppercase font-weight-700"
      }, {
        key: "updated_at",
        label: "Last Updated",
        sortable: false,
        thClass: "bg-light text-uppercase font-weight-700"
      }, {
        key: "actions",
        label: "Action",
        sortable: false,
        thClass: "text-center bg-light text-uppercase font-weight-700",
        tdClass: "text-center"
      }],
      editForm: null
    };
  },
  mounted() {
    this.fetchSavedAddresses();
  },
  methods: {
    fetchSavedAddresses(page = 1) {
      this.isBusy = true;
      const params = {
        page: page,
        per_page: this.pagination.per_page,
        search: this.searchQuery,
        address_type: this.filterType
      };
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].query("/user/saved-addresses", {
        params
      }).then(({
        data
      }) => {
        this.isBusy = false;
        if (data.user) {
          this.userProfile = data.user;
        }
        if (data.data) {
          this.addressItems = data.data.data || [];
          this.pagination = {
            current_page: data.data.current_page || 1,
            per_page: data.data.per_page || 10,
            total: data.data.total || 0,
            from: data.data.from || 0,
            to: data.data.to || 0
          };
        }
      }).catch(error => {
        this.isBusy = false;
        this.$bvToast.toast("Failed to load saved addresses.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      });
    },
    handleSearch() {
      this.pagination.current_page = 1;
      this.fetchSavedAddresses(1);
    },
    clearSearch() {
      this.searchQuery = "";
      this.handleSearch();
    },
    onPageChange(page) {
      this.fetchSavedAddresses(page);
    },
    openEditModal(item) {
      this.editForm = _objectSpread({}, item);
      this.showEditModal = true;
    },
    saveAddressUpdate() {
      if (!this.editForm || !this.editForm.name || !this.editForm.address || !this.editForm.city || !this.editForm.country) {
        this.$bvToast.toast("Please fill in all required fields (Name, Address, City, Country).", {
          title: "Validation Warning",
          variant: "warning",
          solid: true
        });
        return;
      }
      this.isSaving = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].put(`/user/saved-addresses/${this.editForm.id}`, this.editForm).then(({
        data
      }) => {
        this.isSaving = false;
        this.showEditModal = false;
        this.$bvToast.toast("Address updated successfully!", {
          title: "Success",
          variant: "success",
          solid: true
        });
        this.fetchSavedAddresses(this.pagination.current_page);
      }).catch(error => {
        this.isSaving = false;
        const msg = error.response?.data?.message || "Failed to update address.";
        this.$bvToast.toast(msg, {
          title: "Error",
          variant: "danger",
          solid: true
        });
      });
    },
    formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=template&id=2d627c25&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=template&id=2d627c25&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "container py-6 px-4 px-sm-8 px-md-10"
  }, [_c("div", {
    staticClass: "d-flex flex-column mb-6 pb-4 border-bottom"
  }, [_c("span", {
    staticClass: "nav-eyebrow"
  }, [_vm._v("User Profile")]), _vm._v(" "), _c("h6", {
    staticClass: "nav-title"
  }, [_vm._v("User & Branch Settings")]), _vm._v(" "), _c("p", {
    staticClass: "nav-subtitle"
  }, [_vm._v("\n                        View your profile details and manage saved branch address records for accurate OCR matching.\n                    ")])]), _vm._v(" "), _c("b-card", {
    staticClass: "profile-card border-0 mb-6 shadow-sm"
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between flex-wrap"
  }, [_c("div", [_c("h5", {
    staticClass: "mb-1 font-weight-700",
    staticStyle: {
      color: "#355594"
    }
  }, [_vm._v("Mailboxes")]), _vm._v(" "), _c("p", {
    staticClass: "mb-0 text-muted"
  }, [_vm._v("\n                                Connect the mailbox your clients write to. Messages appear in the\n                                Inbox; nothing is sent without you asking.\n                            ")])]), _vm._v(" "), _c("router-link", {
    staticClass: "btn btn-primary",
    attrs: {
      to: "/mailboxes"
    }
  }, [_vm._v("\n                            Manage mailboxes\n                        ")])], 1)]), _vm._v(" "), _c("b-card", {
    staticClass: "profile-card border-0 mb-6 shadow-sm"
  }, [_c("div", {
    staticClass: "d-flex align-items-center mb-4"
  }, [_c("div", {
    staticClass: "profile-avatar-wrap mr-4"
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "person-circle",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("div", [_c("h4", {
    staticClass: "mb-1 font-weight-700",
    staticStyle: {
      color: "#355594"
    }
  }, [_vm._v(_vm._s(_vm.userProfile.name || "User Profile"))]), _vm._v(" "), _c("span", {
    staticClass: "badge badge-primary-light px-3 py-1 font-weight-600"
  }, [_vm._v("\n                                " + _vm._s(_vm.userProfile.company || "Company User") + "\n                            ")])])]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6",
      lg: "3"
    }
  }, [_c("div", {
    staticClass: "profile-info-box"
  }, [_c("span", {
    staticClass: "info-label"
  }, [_vm._v("Full Name")]), _vm._v(" "), _c("span", {
    staticClass: "info-value"
  }, [_vm._v(_vm._s(_vm.userProfile.name || "N/A"))])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6",
      lg: "3"
    }
  }, [_c("div", {
    staticClass: "profile-info-box"
  }, [_c("span", {
    staticClass: "info-label"
  }, [_vm._v("Company Email Address")]), _vm._v(" "), _c("span", {
    staticClass: "info-value"
  }, [_vm._v(_vm._s(_vm.userProfile.email || "N/A"))])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6",
      lg: "3"
    }
  }, [_c("div", {
    staticClass: "profile-info-box"
  }, [_c("span", {
    staticClass: "info-label"
  }, [_vm._v("Branch / Agent")]), _vm._v(" "), _c("span", {
    staticClass: "info-value"
  }, [_vm._v(_vm._s(_vm.userProfile.branch || "Default Branch"))])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6",
      lg: "3"
    }
  }, [_c("div", {
    staticClass: "profile-info-box"
  }, [_c("span", {
    staticClass: "info-label"
  }, [_vm._v("Company Name")]), _vm._v(" "), _c("span", {
    staticClass: "info-value"
  }, [_vm._v(_vm._s(_vm.userProfile.company || "N/A"))])])])], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "address-book-header d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-5 py-2"
  }, [_c("div", {
    staticClass: "mb-3 mb-lg-0"
  }, [_c("h4", {
    staticClass: "mb-1 font-weight-700",
    staticStyle: {
      color: "#355594"
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "journal-bookmark-fill"
    }
  }), _vm._v("\n                            Branch Address Book\n                        ")], 1), _vm._v(" "), _c("span", {
    staticClass: "small",
    staticStyle: {
      color: "#5A6B8A"
    }
  }, [_vm._v("Showing Shipper and Consignee saved records for your branch.")])]), _vm._v(" "), _c("div", {
    staticClass: "filter-search-row d-flex flex-column flex-sm-row align-items-sm-center"
  }, [_c("b-form-select", {
    staticClass: "type-filter-select mb-2 mb-sm-0 mr-0 mr-sm-3",
    attrs: {
      options: _vm.typeOptions
    },
    on: {
      change: _vm.handleSearch
    },
    model: {
      value: _vm.filterType,
      callback: function ($$v) {
        _vm.filterType = $$v;
      },
      expression: "filterType"
    }
  }), _vm._v(" "), _c("b-input-group", {
    staticClass: "search-input-group"
  }, [_c("b-form-input", {
    attrs: {
      placeholder: "Search name, account, address..."
    },
    on: {
      keyup: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        return _vm.handleSearch.apply(null, arguments);
      }
    },
    model: {
      value: _vm.searchQuery,
      callback: function ($$v) {
        _vm.searchQuery = $$v;
      },
      expression: "searchQuery"
    }
  }), _vm._v(" "), _c("b-input-group-append", [_c("b-button", {
    staticClass: "btn-search px-4",
    attrs: {
      variant: "primary"
    },
    on: {
      click: _vm.handleSearch
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "search"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "ml-1 font-weight-600"
  }, [_vm._v("Search")])], 1), _vm._v(" "), _vm.searchQuery ? _c("b-button", {
    attrs: {
      variant: "outline-secondary",
      title: "Clear Search"
    },
    on: {
      click: _vm.clearSearch
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1) : _vm._e()], 1)], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive glass-table-wrap"
  }, [_c("b-table", {
    staticClass: "address-table mb-0",
    attrs: {
      hover: "",
      striped: "",
      outlined: "",
      responsive: "",
      items: _vm.addressItems,
      fields: _vm.tableFields,
      busy: _vm.isBusy,
      "show-empty": "",
      "empty-text": "No saved Shipper or Consignee addresses found."
    },
    scopedSlots: _vm._u([{
      key: "table-busy",
      fn: function () {
        return [_c("div", {
          staticClass: "text-center text-primary py-5"
        }, [_c("b-spinner", {
          staticClass: "align-middle mr-2"
        }), _vm._v(" "), _c("strong", [_vm._v("Loading saved addresses...")])], 1)];
      },
      proxy: true
    }, {
      key: "cell(address_type)",
      fn: function (data) {
        return [_c("span", {
          staticClass: "badge px-3 py-2 font-weight-600 text-uppercase",
          class: data.item.address_type === "shipper_address" ? "badge-shipper" : "badge-consignee"
        }, [_vm._v("\n                                " + _vm._s(data.item.address_type === "shipper_address" ? "Shipper" : "Consignee") + "\n                            ")])];
      }
    }, {
      key: "cell(name)",
      fn: function (data) {
        return [_c("div", {
          staticClass: "font-weight-700",
          staticStyle: {
            color: "#181C32",
            "font-size": "0.95rem"
          }
        }, [_vm._v(_vm._s(data.item.name))]), _vm._v(" "), data.item.name_2 ? _c("small", {
          staticClass: "d-block",
          staticStyle: {
            color: "#5A6B8A"
          }
        }, [_c("strong", [_vm._v("Name 2:")]), _vm._v(" " + _vm._s(data.item.name_2) + "\n                            ")]) : _vm._e()];
      }
    }, {
      key: "cell(account)",
      fn: function (data) {
        return [data.item.account ? _c("span", {
          staticClass: "font-weight-600",
          staticStyle: {
            color: "#181C32"
          }
        }, [_vm._v("\n                                " + _vm._s(data.item.account) + "\n                            ")]) : _c("span", {
          staticClass: "font-italic",
          staticStyle: {
            color: "#5A6B8A"
          }
        }, [_vm._v("-")])];
      }
    }, {
      key: "cell(address)",
      fn: function (data) {
        return [_c("div", {
          staticClass: "address-cell"
        }, [_c("div", {
          staticClass: "font-weight-600",
          staticStyle: {
            color: "#181C32"
          }
        }, [_vm._v(_vm._s(data.item.address))]), _vm._v(" "), data.item.address_line_2 ? _c("small", {
          staticClass: "d-block",
          staticStyle: {
            color: "#5A6B8A"
          }
        }, [_vm._v(_vm._s(data.item.address_line_2))]) : _vm._e(), _vm._v(" "), _c("small", {
          staticClass: "font-weight-600",
          staticStyle: {
            color: "#5A6B8A"
          }
        }, [_vm._v("\n                                    " + _vm._s([data.item.city, data.item.state, data.item.post_code, data.item.country].filter(Boolean).join(", ")) + "\n                                ")])])];
      }
    }, {
      key: "cell(updated_at)",
      fn: function (data) {
        return [_c("div", {
          staticClass: "small"
        }, [_c("div", {
          staticClass: "font-weight-600",
          staticStyle: {
            color: "#181C32"
          }
        }, [_c("b-icon", {
          staticClass: "mr-1",
          staticStyle: {
            color: "#5A6B8A"
          },
          attrs: {
            icon: "clock"
          }
        }), _vm._v("\n                                    " + _vm._s(_vm.formatDateTime(data.item.updated_at)) + "\n                                ")], 1), _vm._v(" "), data.item.user && data.item.user.name ? _c("div", {
          staticStyle: {
            color: "#5A6B8A"
          }
        }, [_c("b-icon", {
          staticClass: "mr-1",
          attrs: {
            icon: "person"
          }
        }), _vm._v("\n                                    " + _vm._s(data.item.user.name) + "\n                                ")], 1) : _vm._e()])];
      }
    }, {
      key: "cell(actions)",
      fn: function (data) {
        return [_c("b-button", {
          staticClass: "btn-brand-outline-pill px-3",
          attrs: {
            size: "sm"
          },
          on: {
            click: function ($event) {
              return _vm.openEditModal(data.item);
            }
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "pencil-square"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Edit")])], 1)];
      }
    }])
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-column flex-sm-row align-items-center justify-content-between mt-4"
  }, [_c("span", {
    staticClass: "text-muted small mb-2 mb-sm-0"
  }, [_vm._v("\n                        Showing " + _vm._s(_vm.pagination.from || 0) + " to " + _vm._s(_vm.pagination.to || 0) + " of " + _vm._s(_vm.pagination.total || 0) + " records\n                    ")]), _vm._v(" "), _vm.pagination.total > _vm.pagination.per_page ? _c("b-pagination", {
    staticClass: "mb-0 custom-pagination",
    attrs: {
      "total-rows": _vm.pagination.total,
      "per-page": _vm.pagination.per_page,
      align: "right",
      size: "sm"
    },
    on: {
      change: _vm.onPageChange
    },
    model: {
      value: _vm.pagination.current_page,
      callback: function ($$v) {
        _vm.$set(_vm.pagination, "current_page", $$v);
      },
      expression: "pagination.current_page"
    }
  }) : _vm._e()], 1)], 1)])], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "edit-address-modal",
      "modal-class": "ultra-premium-modal",
      "hide-header": "",
      "hide-footer": "",
      size: "lg",
      centered: ""
    },
    model: {
      value: _vm.showEditModal,
      callback: function ($$v) {
        _vm.showEditModal = $$v;
      },
      expression: "showEditModal"
    }
  }, [_vm.editForm ? _c("div", {
    staticClass: "custom-modal-wrap"
  }, [_c("div", {
    staticClass: "modal-header-clean d-flex align-items-center justify-content-between px-6 py-4"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("div", {
    staticClass: "modal-header-icon mr-3"
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "pencil-square",
      "font-scale": "1.1"
    }
  })], 1), _vm._v(" "), _c("div", [_c("h5", {
    staticClass: "modal-title-clean mb-0 font-weight-700"
  }, [_vm._v("Edit Saved Address")]), _vm._v(" "), _c("span", {
    staticClass: "modal-subtitle-clean"
  }, [_vm._v("Update shipper/consignee record details for your branch")])])]), _vm._v(" "), _c("button", {
    staticClass: "modal-close-btn",
    attrs: {
      type: "button",
      title: "Close"
    },
    on: {
      click: function ($event) {
        _vm.showEditModal = false;
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x",
      "font-scale": "1.3"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "modal-body-custom px-6 py-4"
  }, [_c("b-form", {
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.saveAddressUpdate.apply(null, arguments);
      }
    }
  }, [_c("b-row", [_c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Address Type")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "custom-form-control disabled-control",
    attrs: {
      options: [{
        value: "shipper_address",
        text: "Shipper Address"
      }, {
        value: "consignee_address",
        text: "Consignee Address"
      }],
      disabled: ""
    },
    model: {
      value: _vm.editForm.address_type,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "address_type", $$v);
      },
      expression: "editForm.address_type"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Account Number")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "e.g. ACC-665412"
    },
    model: {
      value: _vm.editForm.account,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "account", $$v);
      },
      expression: "editForm.account"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Name "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      required: "",
      placeholder: "Company or Individual Name"
    },
    model: {
      value: _vm.editForm.name,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "name", $$v);
      },
      expression: "editForm.name"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Name 2 / EORI")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "Secondary Name or EORI"
    },
    model: {
      value: _vm.editForm.name_2,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "name_2", $$v);
      },
      expression: "editForm.name_2"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Address Line 1 "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      required: "",
      placeholder: "Street Address"
    },
    model: {
      value: _vm.editForm.address,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "address", $$v);
      },
      expression: "editForm.address"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Address Line 2")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "Building, Suite, Unit"
    },
    model: {
      value: _vm.editForm.address_line_2,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "address_line_2", $$v);
      },
      expression: "editForm.address_line_2"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("City "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      required: "",
      placeholder: "City"
    },
    model: {
      value: _vm.editForm.city,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "city", $$v);
      },
      expression: "editForm.city"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("State / Province")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "State"
    },
    model: {
      value: _vm.editForm.state,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "state", $$v);
      },
      expression: "editForm.state"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Postal Code")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "PIN / Zip Code"
    },
    model: {
      value: _vm.editForm.post_code,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "post_code", $$v);
      },
      expression: "editForm.post_code"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Country Code / Name "), _c("span", {
    staticClass: "text-danger"
  }, [_vm._v("*")])]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      required: "",
      placeholder: "Country"
    },
    model: {
      value: _vm.editForm.country,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "country", $$v);
      },
      expression: "editForm.country"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Airport Code")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "e.g. FRA, LHR, NRT"
    },
    model: {
      value: _vm.editForm.airport_code,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "airport_code", $$v);
      },
      expression: "editForm.airport_code"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Phone Number")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "Phone"
    },
    model: {
      value: _vm.editForm.phone,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "phone", $$v);
      },
      expression: "editForm.phone"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Fax")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "Fax"
    },
    model: {
      value: _vm.editForm.fax,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "fax", $$v);
      },
      expression: "editForm.fax"
    }
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "4"
    }
  }, [_c("label", {
    staticClass: "form-field-label"
  }, [_vm._v("Telex")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "custom-form-control",
    attrs: {
      placeholder: "Telex"
    },
    model: {
      value: _vm.editForm.telex,
      callback: function ($$v) {
        _vm.$set(_vm.editForm, "telex", $$v);
      },
      expression: "editForm.telex"
    }
  })], 1)], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-footer-clean d-flex align-items-center justify-content-end px-6 py-4"
  }, [_c("b-button", {
    staticClass: "btn-brand-outline-pill mr-3 px-4",
    staticStyle: {
      "border-color": "#cbd5e1 !important",
      color: "#475569 !important"
    },
    on: {
      click: function ($event) {
        _vm.showEditModal = false;
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-brand-pill px-5",
    attrs: {
      disabled: _vm.isSaving
    },
    on: {
      click: _vm.saveAddressUpdate
    }
  }, [_vm.isSaving ? _c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v(" "), _c("span", [_vm._v("Save Changes")])], 1)], 1)]) : _vm._e()])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/UserSettings.vue":
/*!****************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/UserSettings.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _UserSettings_vue_vue_type_template_id_2d627c25_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserSettings.vue?vue&type=template&id=2d627c25&scoped=true */ "./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=template&id=2d627c25&scoped=true");
/* harmony import */ var _UserSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UserSettings.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=script&lang=js");
/* harmony import */ var _UserSettings_vue_vue_type_style_index_0_id_2d627c25_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _UserSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _UserSettings_vue_vue_type_template_id_2d627c25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _UserSettings_vue_vue_type_template_id_2d627c25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "2d627c25",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/UserSettings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UserSettings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=template&id=2d627c25&scoped=true":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=template&id=2d627c25&scoped=true ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSettings_vue_vue_type_template_id_2d627c25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSettings_vue_vue_type_template_id_2d627c25_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSettings_vue_vue_type_template_id_2d627c25_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UserSettings.vue?vue&type=template&id=2d627c25&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=template&id=2d627c25&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_UserSettings_vue_vue_type_style_index_0_id_2d627c25_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/UserSettings.vue?vue&type=style&index=0&id=2d627c25&scoped=true&lang=css");


/***/ })

}]);