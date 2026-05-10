"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Rate_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SideBar",
  data: function data() {
    return {
      primaryText: "/media/custome/side-menu/H1-primary-text.svg",
      isMobileMenuOpen: false,
      menuItems: [{
        label: "Focus Air",
        path: "/focus-air",
        icon: "/media/custome/side-menu/3.png",
        activeIcon: "/media/custome/side-menu/3-active.png",
        activePaths: ['/focus-air', '/house-way-bill', '/consolidation', '/edit-airway-bill', '/edit-houseway-bill']
      }, {
        label: "Message Log",
        path: "/message-log",
        icon: "/media/custome/side-menu/4.png",
        activeIcon: "/media/custome/side-menu/4-active.png",
        activePaths: ['/message-log']
      }, {
        label: "Rate",
        path: "/rate",
        icon: "/media/custome/side-menu/5.png",
        activeIcon: "/media/custome/side-menu/5-active.png",
        activePaths: ['/rate']
      }]
    };
  },
  computed: {
    activeItem: function activeItem() {
      var _this = this;
      return this.menuItems.find(function (item) {
        return _this.isActive(item.activePaths);
      }) || this.menuItems[0];
    }
  },
  methods: {
    isActive: function isActive(paths) {
      var _this2 = this;
      if (typeof paths === "string") paths = [paths];
      return paths.some(function (path) {
        var regex = new RegExp("^".concat(path.replace(/:[^\s/]+/g, "[^/]+")));
        return regex.test(_this2.$route.path);
      });
    },
    toggleMobileMenu: function toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu: function closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    navigateMobile: function navigateMobile(path) {
      this.$router.push(path);
      this.isMobileMenuOpen = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _riophae_vue_treeselect_dist_vue_treeselect_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @riophae/vue-treeselect/dist/vue-treeselect.css */ "./node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css");
/* harmony import */ var _layout_SideBar_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/SideBar.vue */ "./resources/js/src/view/layout/SideBar.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



// import PageLoader from '../components/PageLoader.vue';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Rate",
  data: function data() {
    return {
      search_form: new Form({
        from: null,
        to: "",
        selected_quantity: "custom",
        quantity: ""
      }),
      rate_data: "",
      rate_data_copy: {},
      location: [],
      extra_comission: "",
      last_extra_comission: "",
      profit_type: "total",
      is_all_rate: false,
      all_user_notice: [],
      user_notice: '',
      report_popup: false,
      all_ams: [],
      all_ams_ek: {},
      all_ams_tg_cx: {},
      ams_arr: {
        fsc: '',
        scc: '',
        xray: '',
        misc: '',
        ctg: '',
        awb_fee: '',
        fe: '',
        mawb: '',
        hawb: '',
        dg_fee: ''
      },
      fields: [{
        label: "Sl",
        key: "index",
        field: "index"
      }, {
        label: "Airline",
        key: "carrier_code",
        field: "carrier_code"
      }, {
        label: "Product Type",
        key: "product_name",
        field: "product_name"
      }],
      report_arr: new Form({
        title: '',
        description: ''
      }),
      //exception
      searched_country_code: '',
      searched_region: '',
      items: [],
      is_rate_available: true,
      filter: null,
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20, {
        value: 100,
        text: "Show a lot"
      }],
      searchQuery_from: '',
      isDropdownOpen_from: false,
      searchQuery_to: '',
      isDropdownOpen_to: false,
      selectedRows: [],
      currency_rate: [],
      is_allin_check: false,
      allin_amount: 1.00,
      selected_currency: 'INR'
    };
  },
  components: {
    Header: Header,
    SideBar: _layout_SideBar_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
    // PageLoader
  },
  methods: {
    get_allin_amount: function get_allin_amount() {
      for (var i = 0; i < 4; i++) {
        if (this.currency_rate[i]['currency'] == this.selected_currency) {
          this.allin_amount = this.currency_rate[i]['rate'];
          break;
        }
      }
    },
    toggleDropdown_from: function toggleDropdown_from() {
      this.isDropdownOpen_from = !this.isDropdownOpen_from;
    },
    selectOption_from: function selectOption_from(item) {
      this.search_form.from = item.iata_code;
      var source_name = item.destination;
      var final_set = this.search_form.from + "(" + source_name + ")";
      this.searchQuery_from = final_set;
    },
    closeDropdown_from: function closeDropdown_from(event) {
      var dropdownContainer_from = this.$refs.dropdownContainer_from;
      if (!dropdownContainer_from.contains(event.target)) {
        this.isDropdownOpen_from = false;
      }
    },
    toggleDropdown_to: function toggleDropdown_to() {
      this.isDropdownOpen_to = !this.isDropdownOpen_to;
    },
    selectOption_to: function selectOption_to(item) {
      this.search_form.to = item.iata_code;
      var source_name = item.destination;
      var final_set = this.search_form.to + "(" + source_name + ")";
      this.searchQuery_to = final_set;
    },
    closeDropdown_to: function closeDropdown_to(event) {
      var dropdownContainer_to = this.$refs.dropdownContainer_to;
      if (!dropdownContainer_to.contains(event.target)) {
        this.isDropdownOpen_to = false;
      }
    },
    submit_report: function submit_report() {
      var _this = this;
      this.report_arr.post("/user/report").then(function (_ref) {
        var data = _ref.data;
        _this.report_popup = false;
        _this.report_arr.title = "";
        _this.report_arr.description = "";
        alert("report submited successfull. Thank you");
      });
    },
    isNumber: function isNumber() {
      if (isNaN(this.search_form.quantity)) {
        $("#quantity_msg").html("Select Weight type Normal/Minimum");
        $("#selected_quantity_1").css("border", "1px solid #c0392b");
        this.search_form.quantity = "";
      } else {
        $("#quantity_msg").html("");
        $("#selected_quantity_1").css("border", "none");
      }
    },
    get_notice: function get_notice() {
      var _this2 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/get-notice").then(function (_ref2) {
        var data = _ref2.data;
        for (var i = 0; i < data.length; i++) {
          _this2.all_user_notice[data[i].carrier_code] = {};
          _this2.all_user_notice[data[i].carrier_code] = data[i];
        }
      });
    },
    get_asm: function get_asm(origin) {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/get-ams/".concat(origin)).then(function (_ref3) {
        var data = _ref3.data;
        for (var i = 0; i < data.length; i++) {
          _this3.all_ams[data[i].carrier_code] = {};
          if (data[i].carrier_code == 'EK') {
            _this3.all_ams_ek[data[i].country_code] = data[i];
          } else if (data[i].carrier_code == 'TG' || data[i].carrier_code == 'CX') {
            var key = "";
            if (data[i].dest_airport_code) key = data[i].dest_airport_code + "_" + data[i].carrier_code;else if (data[i].country_code) key = data[i].country_code + "_" + data[i].carrier_code;else if (data[i].region) key = data[i].region + "_" + data[i].carrier_code;
            _this3.all_ams_tg_cx[key] = data[i];
          } else {
            _this3.all_ams[data[i].carrier_code] = data[i];
          }
        }
      });
    },
    get_rate: function get_rate() {
      var _this4 = this;
      $('#rate_id').html("Loading..");
      //reset ams value
      this.ams_arr.fsc = '';
      this.ams_arr.scc = '';
      this.ams_arr.xray = '';
      this.ams_arr.misc = '';
      this.ams_arr.ctg = '';
      this.ams_arr.awb_fee = '';
      this.ams_arr.mawb = '';
      this.ams_arr.hawb = '';
      this.ams_arr.dg_fee = '';
      // end reset ams value
      this.rate_data = "";
      this.selectedRows = [];
      var rate_data_loop = [];
      var items_loop = [];
      var rate_index = 3;
      this.rate_data_copy = {}, this.search_form.post("/user/get-rate").then(function (_ref4) {
        var data = _ref4.data;
        $('#rate_id').html("Rates");
        $(".export-btn").html("Export");
        _this4.searched_country_code = data.country_code;
        _this4.searched_region = data.region;

        //for check if data will get on the basis of dist_airport_code are else take it on zone basis
        var data_dublicate = data.rates;
        data = [];
        var carrier_product = [];
        for (var d = 0; d < data_dublicate.length; d++) {
          if (data_dublicate[d].dest_airport_code) {
            data.push(data_dublicate[d]);
            var p_t = data_dublicate[d].carrier_code + "__" + data_dublicate[d].product_name;
            carrier_product.push(p_t);
            data_dublicate.splice(d, 1);
            d--;
          }
        }
        for (var d1 = 0; d1 < data_dublicate.length; d1++) {
          var _p_t = data_dublicate[d1].carrier_code + "__" + data_dublicate[d1].product_name;
          if (!carrier_product.includes(_p_t)) {
            data.push(data_dublicate[d1]);
          }
        }
        //end for check if data will get on the basis of dist_airport_code are else take it on zone basis

        if (_this4.is_all_rate) {
          for (var i = 0; i < data.length; i++) {
            items_loop[i] = {};
            rate_data_loop[i] = {};
            rate_data_loop[i] = JSON.parse(data[i].rate_range);
            if (i == 0) {
              for (var key in rate_data_loop[i]) {
                _this4.fields[rate_index] = {};
                _this4.fields[rate_index]["key"] = key;
                _this4.fields[rate_index]["field"] = key;
                _this4.fields[rate_index]["label"] = key;
                rate_index++;
              }
            }
            rate_data_loop[i]["index"] = i;
            rate_data_loop[i]["carrier_code"] = data[i].carrier_code;
            rate_data_loop[i]["carrier_prefix"] = data[i].carrier_prefix;
            rate_data_loop[i]["product_name"] = data[i].product_name;
            items_loop[i] = rate_data_loop[i];
          }
          _this4.items = items_loop;
        } else {
          if (data.length) {
            _this4.is_rate_available = false;
            for (var _i = 0; _i < data.length; _i++) {
              var arr_data = data[_i].rate_range;
              var rate_data = JSON.parse(arr_data, true);
              data[_i]["my_rate"] = {};
              data[_i]["my_rate_2"] = {};
              if (_this4.search_form.selected_quantity == "Minimum") {
                data[_i]["my_rate"]["Minimum"] = rate_data["Minimum"];
              } else if (_this4.search_form.selected_quantity == "Normal") {
                data[_i]["my_rate"]["Normal"] = rate_data["Normal"];
              } else if (_this4.search_form.selected_quantity == "custom") {
                var user_quantity = parseInt(_this4.search_form.quantity);
                var keys = Object.keys(rate_data);
                var is_first_quantity_get = 0;
                var first_quantity = 0;
                for (var j = 0; j < keys.length; j++) {
                  if (keys[j] == "Minimum" || keys[j] == "Normal") {} else {
                    var from_key = parseInt(keys[j]);
                    if (!is_first_quantity_get) {
                      first_quantity = from_key;
                      is_first_quantity_get = 1;
                    }
                    var to_key = 1000000;
                    if (j + 1 < keys.length) to_key = parseInt(keys[j + 1]);
                    if (user_quantity >= from_key && user_quantity < to_key) {
                      var rate_key = keys[j];
                      data[_i]["my_rate"][rate_key] = rate_data[rate_key];
                      break;
                    }
                    if (user_quantity < first_quantity) {
                      data[_i]["my_rate"]["Normal"] = rate_data["Normal"];
                      break;
                    }
                  }
                }
              }
              data[_i]["my_rate_2"] = JSON.parse(JSON.stringify(data[_i]['my_rate']));
            }
          } else {
            _this4.is_rate_available = true;
          }
          _this4.rate_data = data;
        }
      })["catch"](function (err) {});
    },
    getValueBeforeSlash: function getValueBeforeSlash(str) {
      var indexOfSlash = str.indexOf('/');
      if (indexOfSlash !== -1) {
        return str.substring(0, indexOfSlash);
      } else {
        return 0;
      }
    },
    copyToClipboard: function copyToClipboard() {
      if (confirm("The rates provided are in accordance with the current tariff. For system rates, please contact the respective airlines directly. Should there be any changes in other charges, kindly click on “WhatsApp” button to resolve the issue at the earliest. Always do manual checking before quoting to clients.")) {
        var clip_arr = [];
        var arr_len = Object.entries(this.rate_data_copy).length;
        var carrier_code = '';
        var index_count = 1;
        if (arr_len) {
          for (var i in this.rate_data_copy) {
            var currentData = {};
            carrier_code = this.rate_data_copy[i].carrier_code;
            var all_subcharge_amount = 0;
            var all_ams_amount = 0;
            var final_added_profit = 0;
            var dg_fee = '';
            // currentData.Sl = index_count;
            // currentData.Airline = ``;
            // currentData.ProductType = this.rate_data_copy[i].product_name;
            // currentData.Quantity = `${Object.keys(this.rate_data_copy[i].my_rate)[0]}`;
            if (this.is_allin_check) {
              currentData.Price = "".concat(index_count, ". ").concat(carrier_code, "(").concat(this.rate_data_copy[i].carrier_prefix, "):");
              final_added_profit = parseFloat(this.rate_data_copy[i].my_rate_2[Object.keys(this.rate_data_copy[i].my_rate_2)[0]]);
            } else currentData.Price = "".concat(index_count, ". ").concat(carrier_code, "(").concat(this.rate_data_copy[i].carrier_prefix, "): ").concat(this.rate_data_copy[i].my_rate_2[Object.keys(this.rate_data_copy[i].my_rate_2)[0]], "++, Surcharges: ");
            if (carrier_code == 'EK') {
              if (this.all_ams_ek[this.searched_country_code]) {
                if (this.all_ams_ek[this.searched_country_code].fsc) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams_ek[this.searched_country_code].fsc);else currentData.Price += "".concat(this.all_ams_ek[this.searched_country_code].fsc, " (FSC) +");
                }
                if (this.all_ams_ek[this.searched_country_code].misc) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].misc));else currentData.Price += " ".concat(this.all_ams_ek[this.searched_country_code].misc, " (MISC) +");
                }
                if (this.all_ams_ek[this.searched_country_code].xray) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].xray));else currentData.Price += " ".concat(this.all_ams_ek[this.searched_country_code].xray, " (XRAY) +");
                }
                if (this.all_ams_ek[this.searched_country_code].scc) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams_ek[this.searched_country_code].scc);else currentData.Price += " ".concat(this.all_ams_ek[this.searched_country_code].scc, " (SCC) +");
                }
                if (this.all_ams_ek[this.searched_country_code].ctg) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].ctg));else currentData.Price += " ".concat(this.all_ams_ek[this.searched_country_code].ctg, " (CTG) +");
                }
                if (this.all_ams_ek[this.searched_country_code].awb_fee) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_ek[this.searched_country_code].awb_fee));else currentData.Price += " ".concat(this.all_ams_ek[this.searched_country_code].awb_fee, " (AWB FEE) +");
                }
                if (this.all_ams_ek[this.searched_country_code].fe) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams_ek[this.searched_country_code].fe);else currentData.Price += " ".concat(this.all_ams_ek[this.searched_country_code].fe, " (FE) +");
                }
                if (!this.is_allin_check) currentData.Price += ", AMS: ";
                if (this.all_ams_ek[this.searched_country_code].mawb) {
                  if (this.is_allin_check) all_ams_amount += parseFloat(this.all_ams_ek[this.searched_country_code].mawb);else currentData.Price += "".concat(this.all_ams_ek[this.searched_country_code].mawb, " (MAWB) ");
                }
                if (this.all_ams_ek[this.searched_country_code].hawb) {
                  if (this.is_allin_check) all_ams_amount += parseFloat(this.all_ams_ek[this.searched_country_code].hawb);else currentData.Price += "+ ".concat(this.all_ams_ek[this.searched_country_code].hawb, " (HAWB)");
                }
                if (this.all_ams_ek[this.searched_country_code].dg_fee) {
                  if (this.is_allin_check) dg_fee = this.all_ams_ek[this.searched_country_code].dg_fee;else if (this.rate_data_copy[i].dgr) currentData.Price += ", DG FEE : ".concat(this.all_ams_ek[this.searched_country_code].dg_fee);
                }
              }
            } else if (carrier_code == 'TG' || carrier_code == 'CX') {
              var key1 = this.search_form.to + "_" + carrier_code;
              var key2 = this.searched_country_code + "_" + carrier_code;
              var key3 = this.searched_region + "_" + carrier_code;
              var main_key = "";
              if (this.all_ams_tg_cx.hasOwnProperty(key1)) main_key = key1;else if (this.all_ams_tg_cx.hasOwnProperty(key2)) main_key = key2;else if (this.all_ams_tg_cx.hasOwnProperty(key3)) main_key = key3;
              if (main_key) {
                if (this.all_ams_tg_cx[main_key]) {
                  if (this.all_ams_tg_cx[main_key].fsc) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams_tg_cx[main_key].fsc);else currentData.Price += "".concat(this.all_ams_tg_cx[main_key].fsc, " (FSC) +");
                  }
                  if (this.all_ams_tg_cx[main_key].misc) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].misc));else currentData.Price += " ".concat(this.all_ams_tg_cx[main_key].misc, " (MISC) +");
                  }
                  if (this.all_ams_tg_cx[main_key].xray) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].xray));else currentData.Price += " ".concat(this.all_ams_tg_cx[main_key].xray, " (XRAY) +");
                  }
                  if (this.all_ams_tg_cx[main_key].scc) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams_tg_cx[main_key].scc);else currentData.Price += " ".concat(this.all_ams_tg_cx[main_key].scc, " (SCC) +");
                  }
                  if (this.all_ams_tg_cx[main_key].ctg) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].ctg));else currentData.Price += " ".concat(this.all_ams_tg_cx[main_key].ctg, " (CTG) +");
                  }
                  if (this.all_ams_tg_cx[main_key].awb_fee) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams_tg_cx[main_key].awb_fee));else currentData.Price += " ".concat(this.all_ams_tg_cx[main_key].awb_fee, " (AWB FEE) +");
                  }
                  if (this.all_ams_tg_cx[main_key].fe) {
                    if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams_tg_cx[main_key].fe);else currentData.Price += " ".concat(this.all_ams_tg_cx[main_key].fe, " (FE) +");
                  }
                  if (!this.is_allin_check) currentData.Price += ", AMS: ";
                  if (this.all_ams_tg_cx[main_key].mawb) {
                    if (this.is_allin_check) all_ams_amount += parseFloat(this.all_ams_tg_cx[main_key].mawb);else currentData.Price += "".concat(this.all_ams_tg_cx[main_key].mawb, " (MAWB) ");
                  }
                  if (this.all_ams_tg_cx[main_key].hawb) {
                    if (this.is_allin_check) all_ams_amount += parseFloat(this.all_ams_tg_cx[main_key].hawb);else currentData.Price += "+ ".concat(this.all_ams_tg_cx[main_key].hawb, " (HAWB)");
                  }
                  if (this.all_ams_tg_cx[main_key].dg_fee) {
                    if (this.is_allin_check) dg_fee = this.all_ams_tg_cx[main_key].dg_fee;else if (this.rate_data_copy[i].dgr) currentData.Price += ", DG FEE : ".concat(this.all_ams_tg_cx[main_key].dg_fee);
                  }
                }
              }
            } else {
              if (this.all_ams[carrier_code]) {
                if (this.all_ams[carrier_code].fsc) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams[carrier_code].fsc);else currentData.Price += "".concat(this.all_ams[carrier_code].fsc, " (FSC) +");
                }
                if (this.all_ams[carrier_code].misc) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].misc));else currentData.Price += " ".concat(this.all_ams[carrier_code].misc, " (MISC) +");
                }
                if (this.all_ams[carrier_code].xray) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].xray));else currentData.Price += " ".concat(this.all_ams[carrier_code].xray, " (XRAY) +");
                }
                if (this.all_ams[carrier_code].scc) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams[carrier_code].scc);else currentData.Price += " ".concat(this.all_ams[carrier_code].scc, " (SCC) +");
                }
                if (this.all_ams[carrier_code].ctg) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].ctg));else currentData.Price += " ".concat(this.all_ams[carrier_code].ctg, " (CTG) +");
                }
                if (this.all_ams[carrier_code].awb_fee) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.getValueBeforeSlash(this.all_ams[carrier_code].awb_fee));else currentData.Price += " ".concat(this.all_ams[carrier_code].awb_fee, " (AWB FEE) +");
                }
                if (this.all_ams[carrier_code].fe) {
                  if (this.is_allin_check) all_subcharge_amount += parseFloat(this.all_ams[carrier_code].fe);else currentData.Price += " ".concat(this.all_ams[carrier_code].fe, " (FE) +");
                }
                if (!this.is_allin_check) currentData.Price += ", AMS: ";
                if (this.all_ams[carrier_code].mawb) {
                  if (this.is_allin_check) all_ams_amount += parseFloat(this.all_ams[carrier_code].mawb);else currentData.Price += "".concat(this.all_ams[carrier_code].mawb, " (MAWB) ");
                }
                if (this.all_ams[carrier_code].hawb) {
                  if (this.is_allin_check) all_ams_amount += parseFloat(this.all_ams[carrier_code].hawb);else currentData.Price += "+ ".concat(this.all_ams[carrier_code].hawb, " (HAWB)");
                }
                if (this.all_ams[carrier_code].dg_fee) {
                  if (this.is_allin_check) dg_fee = this.all_ams[carrier_code].dg_fee;else if (this.rate_data_copy[i].dgr) currentData.Price += ", DG FEE : ".concat(this.all_ams[carrier_code].dg_fee);
                }
              }
            }
            if (this.is_allin_check) {
              if (!all_subcharge_amount) all_subcharge_amount = 0;
              if (!all_ams_amount) all_ams_amount = 0;
              currentData.Price += "".concat(this.selected_currency, " ").concat(((all_subcharge_amount + final_added_profit) / this.allin_amount).toFixed(2), "/kg ALLIN, AMS: ").concat(this.selected_currency, " ").concat((all_ams_amount / this.allin_amount).toFixed(2), " ALLIN ( MAWB + 1 HAWB )");
              if (dg_fee && this.rate_data_copy[i].dgr) currentData.Price += ", DG FEE : ".concat(dg_fee);
            } else {
              currentData.Price = currentData.Price.replace(' +, AMS:', ', AMS:');
              currentData.Price = currentData.Price.replace('+, AMS:', ', AMS:');
              currentData.Price = currentData.Price.replace('AMS: +', 'AMS:');
              currentData.Price = currentData.Price.replace('  ', ' ');
            }
            clip_arr.push(currentData);
            index_count++;
          }
          var headers = Object.keys(clip_arr[0]);
          var headerRow = headers.join("\t\t\t");
          var dataRows = clip_arr.map(function (row) {
            return Object.values(row).join("\t\t");
          }).join("\n\n");
          var tableText = "".concat(dataRows); //${headerRow}\n\n   removed header

          var textarea = document.createElement("textarea");
          textarea.value = tableText;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          $(".export-btn").html("Exported");
        } else {
          alert("Select data for Export");
        }
      }
    },
    selcted_column: function selcted_column(index, carrier_code) {
      var checkbox = $("#selected_".concat(index));
      var isChecked = checkbox.prop("checked");
      if (isChecked) this.rate_data_copy[index] = this.rate_data[index];else delete this.rate_data_copy[index];
      if (this.selectedRows.includes(index)) {
        var idx = this.selectedRows.indexOf(index);
        this.selectedRows.splice(idx, 1);
      } else {
        this.selectedRows.push(index);
      }
      this.ams_arr.fsc = "";
      this.ams_arr.scc = "";
      this.ams_arr.xray = "";
      this.ams_arr.misc = "";
      this.ams_arr.ctg = "";
      this.ams_arr.awb_fee = "";
      this.ams_arr.fe = "";
      this.ams_arr.mawb = "";
      this.ams_arr.hawb = "";
      this.ams_arr.dg_fee = "";
      if (carrier_code == 'EK') {
        if (this.all_ams_ek.hasOwnProperty(this.searched_country_code)) {
          if (this.all_ams_ek[this.searched_country_code].fsc) this.ams_arr.fsc = this.all_ams_ek[this.searched_country_code].fsc;
          if (this.all_ams_ek[this.searched_country_code].scc) this.ams_arr.scc = this.all_ams_ek[this.searched_country_code].scc;
          if (this.all_ams_ek[this.searched_country_code].xray) this.ams_arr.xray = this.all_ams_ek[this.searched_country_code].xray;
          if (this.all_ams_ek[this.searched_country_code].misc) this.ams_arr.misc = this.all_ams_ek[this.searched_country_code].misc;
          if (this.all_ams_ek[this.searched_country_code].ctg) this.ams_arr.ctg = this.all_ams_ek[this.searched_country_code].ctg;
          if (this.all_ams_ek[this.searched_country_code].awb_fee) this.ams_arr.awb_fee = this.all_ams_ek[this.searched_country_code].awb_fee;
          if (this.all_ams_ek[this.searched_country_code].fe) this.ams_arr.fe = this.all_ams_ek[this.searched_country_code].fe;
          if (this.all_ams_ek[this.searched_country_code].mawb) this.ams_arr.mawb = this.all_ams_ek[this.searched_country_code].mawb;
          if (this.all_ams_ek[this.searched_country_code].hawb) this.ams_arr.hawb = this.all_ams_ek[this.searched_country_code].hawb;
          if (this.all_ams_ek[this.searched_country_code].dg_fee) this.ams_arr.dg_fee = this.all_ams_ek[this.searched_country_code].dg_fee;
        }
      } else if (carrier_code == 'TG' || carrier_code == 'CX') {
        var key1 = this.search_form.to + "_" + carrier_code;
        var key2 = this.searched_country_code + "_" + carrier_code;
        var key3 = this.searched_region + "_" + carrier_code;
        var main_key = "";
        if (this.all_ams_tg_cx.hasOwnProperty(key1)) main_key = key1;else if (this.all_ams_tg_cx.hasOwnProperty(key2)) main_key = key2;else if (this.all_ams_tg_cx.hasOwnProperty(key3)) main_key = key3;
        if (main_key) {
          if (this.all_ams_tg_cx[main_key].fsc) this.ams_arr.fsc = this.all_ams_tg_cx[main_key].fsc;
          if (this.all_ams_tg_cx[main_key].scc) this.ams_arr.scc = this.all_ams_tg_cx[main_key].scc;
          if (this.all_ams_tg_cx[main_key].xray) this.ams_arr.xray = this.all_ams_tg_cx[main_key].xray;
          if (this.all_ams_tg_cx[main_key].misc) this.ams_arr.misc = this.all_ams_tg_cx[main_key].misc;
          if (this.all_ams_tg_cx[main_key].ctg) this.ams_arr.ctg = this.all_ams_tg_cx[main_key].ctg;
          if (this.all_ams_tg_cx[main_key].awb_fee) this.ams_arr.awb_fee = this.all_ams_tg_cx[main_key].awb_fee;
          if (this.all_ams_tg_cx[main_key].fe) this.ams_arr.fe = this.all_ams_tg_cx[main_key].fe;
          if (this.all_ams_tg_cx[main_key].mawb) this.ams_arr.mawb = this.all_ams_tg_cx[main_key].mawb;
          if (this.all_ams_tg_cx[main_key].hawb) this.ams_arr.hawb = this.all_ams_tg_cx[main_key].hawb;
          if (this.all_ams_tg_cx[main_key].dg_fee) this.ams_arr.dg_fee = this.all_ams_tg_cx[main_key].dg_fee;
        }
      } else {
        if (this.all_ams.hasOwnProperty(carrier_code)) {
          if (this.all_ams[carrier_code].fsc) this.ams_arr.fsc = this.all_ams[carrier_code].fsc;
          if (this.all_ams[carrier_code].scc) this.ams_arr.scc = this.all_ams[carrier_code].scc;
          if (this.all_ams[carrier_code].xray) this.ams_arr.xray = this.all_ams[carrier_code].xray;
          if (this.all_ams[carrier_code].misc) this.ams_arr.misc = this.all_ams[carrier_code].misc;
          if (this.all_ams[carrier_code].ctg) this.ams_arr.ctg = this.all_ams[carrier_code].ctg;
          if (this.all_ams[carrier_code].awb_fee) this.ams_arr.awb_fee = this.all_ams[carrier_code].awb_fee;
          if (this.all_ams[carrier_code].fe) this.ams_arr.fe = this.all_ams[carrier_code].fe;
          if (this.all_ams[carrier_code].mawb) this.ams_arr.mawb = this.all_ams[carrier_code].mawb;
          if (this.all_ams[carrier_code].hawb) this.ams_arr.hawb = this.all_ams[carrier_code].hawb;
          if (this.all_ams[carrier_code].dg_fee) this.ams_arr.dg_fee = this.all_ams[carrier_code].dg_fee;
        }
      }

      //for notice
      this.user_notice = '';
      if (this.all_user_notice[carrier_code]) this.user_notice = this.all_user_notice[carrier_code].user_notice_1;
    },
    getLocation: function getLocation() {
      var _this5 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/get-location").then(function (_ref5) {
        var data = _ref5.data;
        _this5.location = data;
      });
    },
    getCurrencyRate: function getCurrencyRate() {
      var _this6 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/get-currency-rate").then(function (_ref6) {
        var data = _ref6.data;
        _this6.currency_rate = data;
      });
    },
    extraComission: function extraComission() {
      for (var i = 0; i < this.rate_data.length; i++) {
        var obj_key = Object.keys(this.rate_data[i].my_rate_2)[0];
        if (parseInt(this.extra_comission) > 0) {
          if (this.profit_type == "total") {
            var add_profit = parseFloat(this.extra_comission) / parseFloat(this.search_form.quantity);
            this.rate_data[i].my_rate_2[obj_key] = parseFloat(this.rate_data[i].my_rate[obj_key]) + parseFloat(add_profit);
          } else if (this.profit_type == "per_kg") {
            this.rate_data[i].my_rate_2[obj_key] = parseFloat(this.rate_data[i].my_rate[obj_key]) + parseFloat(this.extra_comission);
          }
          this.rate_data[i].my_rate_2[obj_key] = this.rate_data[i].my_rate_2[obj_key].toFixed(2);
        }
      }
    },
    extraComission2: function extraComission2() {
      // console.log(event.key);
      // event.key==0 || event.key==1 || event.key==2 || event.key==3 || event.key==4 || event.key==4 || event.key==6 || event.key==7 || event.key==8 || event.key==9 || event.key=="Backspace"
      if (true) {
        for (var i = 0; i < this.rate_data.length; i++) {
          var obj_key = Object.keys(this.rate_data[i].my_rate_2)[0];
          if (parseInt(this.last_extra_comission) > 0) {
            if (this.profit_type == "total") {
              var add_profit_1 = parseInt(this.last_extra_comission) / parseInt(this.search_form.quantity);
              this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) - parseInt(add_profit_1);
            } else if (this.profit_type == "per_kg") {
              this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) - parseInt(this.last_extra_comission);
            }
          }
          if (parseInt(this.extra_comission) > 0) {
            if (this.profit_type == "total") {
              var add_profit = parseInt(this.extra_comission) / parseInt(this.search_form.quantity);
              this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) + parseInt(add_profit);
            } else if (this.profit_type == "per_kg") {
              this.rate_data[i].my_rate_2[obj_key] = parseInt(this.rate_data[i].my_rate_2[obj_key]) + parseInt(this.extra_comission);
            }
          }
        }
      }
    },
    check_rate_type: function check_rate_type() {
      if (this.search_form.selected_quantity == 'all') this.is_all_rate = true;else this.is_all_rate = false;
    },
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  mounted: function mounted() {
    this.getLocation();
    this.get_notice();
    this.getCurrencyRate();
    if (this.user_source) {
      this.search_form.from = this.user_source;
      this.get_asm(this.user_source);
      // this.searchQuery_from = this.current_user.origin_airport_code;
    }

    // window.addEventListener('click', this.closeDropdown_from); 
    window.addEventListener('click', this.closeDropdown_to);
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_3__.mapGetters)({
    current_user: "currentUser",
    user_source: "userSource"
  })), {}, {
    // filteredLocations_from() {
    //     if (!this.searchQuery_from) {
    //         return this.location;
    //     }
    //     const query = this.searchQuery_from.toLowerCase();
    //     return this.location.filter(item => {
    //         return (item.destination.toLowerCase().includes(query) || item.iata_code.toLowerCase().includes(query));
    //     });
    // },
    filteredLocations_to: function filteredLocations_to() {
      if (!this.searchQuery_to) {
        return this.location;
      }
      var query = this.searchQuery_to.toLowerCase();
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(query);
      });
    }
  }),
  watch: {
    extra_comission: function extra_comission(newValue, oldValue) {
      this.last_extra_comission = oldValue;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("nav", {
    staticClass: "sidebar-container"
  }, [_c("div", {
    staticClass: "sidebar d-none d-md-block"
  }, [_c("ul", {
    staticClass: "sidebar__list"
  }, [_c("router-link", {
    attrs: {
      to: "/focus-air",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref) {
        var navigate = _ref.navigate;
        return [_c("li", {
          staticClass: "sidebar__item",
          "class": {
            "sidebar__item--active": _vm.isActive(["/focus-air", "/house-way-bill", "/consolidation", "/edit-airway-bill", "/edit-houseway-bill"])
          },
          attrs: {
            role: "link",
            title: "Focus Air"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "sidebar__icon-wrap"
        }, [_c("img", {
          attrs: {
            src: _vm.isActive(["/focus-air", "/house-way-bill", "/consolidation", "/edit-airway-bill", "/edit-houseway-bill"]) ? "/media/custome/side-menu/3-active.png" : "/media/custome/side-menu/3.png",
            alt: "Air Freight"
          }
        })])])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/message-log",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref2) {
        var navigate = _ref2.navigate;
        return [_c("li", {
          staticClass: "sidebar__item",
          "class": {
            "sidebar__item--active": _vm.isActive("/message-log")
          },
          attrs: {
            role: "link",
            title: "Message Log"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "sidebar__icon-wrap"
        }, [_c("img", {
          attrs: {
            src: _vm.isActive("/message-log") ? "/media/custome/side-menu/4-active.png" : "/media/custome/side-menu/4.png",
            alt: "Message Log"
          }
        })])])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/rate",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref3) {
        var navigate = _ref3.navigate;
        return [_c("li", {
          staticClass: "sidebar__item",
          "class": {
            "sidebar__item--active": _vm.isActive("/rate")
          },
          attrs: {
            role: "link",
            title: "Rate"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "sidebar__icon-wrap"
        }, [_c("img", {
          attrs: {
            src: _vm.isActive("/rate") ? "/media/custome/side-menu/5-active.png" : "/media/custome/side-menu/5.png",
            alt: "Rate"
          }
        })])])];
      }
    }])
  }), _vm._v(" "), _vm._m(0)], 1)]), _vm._v(" "), _c("div", {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.closeMobileMenu,
      expression: "closeMobileMenu"
    }],
    staticClass: "sidebar-mobile d-md-none"
  }, [_c("div", {
    staticClass: "mobile-nav-trigger",
    on: {
      click: _vm.toggleMobileMenu
    }
  }, [_c("img", {
    staticClass: "mobile-active-icon",
    attrs: {
      src: _vm.activeItem.icon
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "mobile-active-label"
  }, [_vm._v(_vm._s(_vm.activeItem.label))]), _vm._v(" "), _c("b-icon", {
    staticClass: "ml-auto",
    attrs: {
      icon: _vm.isMobileMenuOpen ? "chevron-up" : "chevron-down"
    }
  })], 1), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade-slide"
    }
  }, [_vm.isMobileMenuOpen ? _c("div", {
    staticClass: "mobile-nav-options"
  }, _vm._l(_vm.menuItems, function (item) {
    return _c("div", {
      key: item.label,
      staticClass: "mobile-opt",
      "class": {
        active: _vm.isActive(item.activePaths)
      },
      on: {
        click: function click($event) {
          return _vm.navigateMobile(item.path);
        }
      }
    }, [_c("img", {
      staticClass: "opt-icon",
      attrs: {
        src: _vm.isActive(item.activePaths) ? item.activeIcon : item.icon
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "opt-label"
    }, [_vm._v(_vm._s(item.label))])]);
  }), 0) : _vm._e()])], 1)]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("li", {
    staticClass: "sidebar__branding"
  }, [_c("span", {
    staticClass: "sidebar__branding-text"
  }, [_vm._v("FOCUS AIR")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=template&id=511055dc":
/*!*************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=template&id=511055dc ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "main-container",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "d-flex"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
    staticStyle: {
      "background-color": "#fff",
      "box-shadow": "3px 3px 10px #d0d0d0",
      "z-index": "1",
      "border-radius": "30px"
    }
  }, [_c("b-container", {
    attrs: {
      fluid: ""
    }
  }, [_c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "text-center my-8 my-md-16"
  }, [_c("img", {
    staticClass: "img-fluid",
    attrs: {
      src: "/media/custome/FocusAkash.png",
      alt: "aakash logo",
      width: "350",
      height: "50"
    }
  })])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12",
      sm: "6",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-4"
  }, [_c("label", {
    attrs: {
      "for": "dist_form"
    }
  }, [_vm._v("Origin")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search_form.from,
      expression: "search_form.from"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Search source",
      readonly: ""
    },
    domProps: {
      value: _vm.search_form.from
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.search_form, "from", $event.target.value);
      }
    }
  })])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12",
      sm: "6",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-4"
  }, [_c("label", {
    attrs: {
      "for": "dist_form"
    }
  }, [_vm._v("Destination")]), _vm._v(" "), _c("div", {
    ref: "dropdownContainer_to",
    staticClass: "custom-dropdown",
    on: {
      click: _vm.toggleDropdown_to
    }
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.searchQuery_to,
      expression: "searchQuery_to"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Search destination",
      id: "from_id",
      autocomplete: "off"
    },
    domProps: {
      value: _vm.searchQuery_to
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.searchQuery_to = $event.target.value;
      }
    }
  }), _vm._v(" "), _vm.isDropdownOpen_to ? _c("div", {
    staticClass: "dropdown-options"
  }, _vm._l(_vm.filteredLocations_to, function (item, index) {
    return _c("div", {
      key: index,
      staticClass: "option",
      on: {
        click: function click($event) {
          return _vm.selectOption_to(item);
        }
      }
    }, [_vm._v(_vm._s(item.iata_code) + " (" + _vm._s(item.destination) + ")")]);
  }), 0) : _vm._e()])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12",
      sm: "6",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-4"
  }, [_c("label", {
    attrs: {
      "for": "dist_form"
    }
  }, [_vm._v("Weight in Kgs")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search_form.quantity,
      expression: "search_form.quantity"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      placeholder: "Enter quantity",
      readonly: _vm.search_form.selected_quantity != "custom"
    },
    domProps: {
      value: _vm.search_form.quantity
    },
    on: {
      keyup: function keyup($event) {
        return _vm.isNumber();
      },
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.search_form, "quantity", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "err_cls",
    attrs: {
      id: "quantity_msg"
    }
  })])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12",
      sm: "6",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-4"
  }, [_c("label", {
    attrs: {
      "for": "dist_form"
    }
  }, [_vm._v("Slab")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search_form.selected_quantity,
      expression: "search_form.selected_quantity"
    }],
    staticClass: "form-control",
    attrs: {
      name: "",
      id: "selected_quantity_1"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.$set(_vm.search_form, "selected_quantity", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);
      }, function ($event) {
        return _vm.check_rate_type();
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "custom"
    }
  }, [_vm._v("Custom")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "Minimum"
    }
  }, [_vm._v("Minimum")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "Normal"
    }
  }, [_vm._v("Normal")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "all"
    }
  }, [_vm._v("All Rate")])])])])], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "my-8 text-center d-flex justify-contents-start rate-btn-container"
  }, [_c("button", {
    staticClass: "btn rate-btn",
    attrs: {
      id: "rate_id"
    },
    on: {
      click: function click($event) {
        return _vm.get_rate();
      }
    }
  }, [_vm._v("Rates")])])])], 1), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [!_vm.is_all_rate ? _c("div", {
    staticClass: "my-10 d-flex justify-content-start align-items-center all-in-section"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.is_allin_check,
      expression: "is_allin_check"
    }],
    staticClass: "mr-4",
    staticStyle: {
      width: "20px"
    },
    attrs: {
      type: "checkbox",
      size: "sm"
    },
    domProps: {
      checked: Array.isArray(_vm.is_allin_check) ? _vm._i(_vm.is_allin_check, null) > -1 : _vm.is_allin_check
    },
    on: {
      change: function change($event) {
        var $$a = _vm.is_allin_check,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.is_allin_check = $$a.concat([$$v]));
          } else {
            $$i > -1 && (_vm.is_allin_check = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.is_allin_check = $$c;
        }
      }
    }
  }), _c("label", {
    staticClass: "mb-0 mr-4"
  }, [_vm._v("Overseas/ALLIN")])]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.allin_amount,
      expression: "allin_amount"
    }],
    staticClass: "mx-4 all-in-amount",
    staticStyle: {
      width: "140px"
    },
    attrs: {
      type: "number",
      readonly: !_vm.is_allin_check
    },
    domProps: {
      value: _vm.allin_amount
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.allin_amount = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selected_currency,
      expression: "selected_currency"
    }],
    staticClass: "mx-4 all-in-currency",
    staticStyle: {
      height: "38px"
    },
    attrs: {
      name: "profit_type",
      id: "profit_type"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.selected_currency = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, function ($event) {
        return _vm.get_allin_amount();
      }]
    }
  }, _vm._l(_vm.currency_rate, function (item, index) {
    return _c("option", {
      key: index,
      domProps: {
        value: item.currency
      }
    }, [_vm._v(_vm._s(item.currency) + " ("), _c("span", [_vm._v(_vm._s(item.rate))]), _vm._v(")")]);
  }), 0)]) : _vm._e()]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12",
      md: "8"
    }
  }, [_c("div", {
    staticClass: "rate-area p-10"
  }, [_c("div", {
    staticClass: "sticky-div px-6 py-2"
  }, [_c("div", {
    staticStyle: {
      "justify-content": "space-between",
      display: "flex",
      "white-space": "nowrap"
    }
  }, [_c("div", {
    staticClass: "d-flex"
  }, [!_vm.is_all_rate ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.extra_comission,
      expression: "extra_comission"
    }],
    staticStyle: {
      width: "40%"
    },
    attrs: {
      type: "number",
      placeholder: "Enter profit in INR"
    },
    domProps: {
      value: _vm.extra_comission
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.extra_comission = $event.target.value;
      }
    }
  }) : _vm._e(), _vm._v(" "), !_vm.is_all_rate ? _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.profit_type,
      expression: "profit_type"
    }],
    staticClass: "mx-3",
    attrs: {
      name: "profit_type",
      id: "profit_type"
    },
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.profit_type = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, function ($event) {
        _vm.extra_comission = 0;
        _vm.last_extra_comission = 0;
        _vm.final_extra_comission = 0;
        _vm.get_rate();
      }]
    }
  }, [_c("option", {
    attrs: {
      value: "total"
    }
  }, [_vm._v("Total")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "per_kg"
    }
  }, [_vm._v("Per kg")])]) : _vm._e(), _vm._v(" "), !_vm.is_all_rate ? _c("span", {
    staticClass: "custom-btn",
    staticStyle: {
      background: "#355594",
      padding: "5px 5px"
    },
    on: {
      click: function click($event) {
        return _vm.extraComission();
      }
    }
  }, [_vm._v("Add profit")]) : _vm._e()]), _vm._v(" "), !_vm.is_all_rate ? _c("span", {
    staticClass: "export-btn custom-btn",
    on: {
      click: function click($event) {
        return _vm.copyToClipboard();
      }
    }
  }, [_vm._v("Export")]) : _vm._e()]), _vm._v(" "), _vm.is_all_rate ? _c("vue-excel-xlsx", {
    attrs: {
      data: _vm.items,
      columns: _vm.fields,
      "file-name": "rate",
      "file-type": "xlsx",
      "sheet-name": "rate"
    }
  }, [_c("span", {
    staticClass: "font-weight-bold text-dark",
    staticStyle: {
      padding: "5px"
    }
  }, [_vm._v("Export Rate")])]) : _vm._e()], 1), _vm._v(" "), _vm.is_all_rate ? _c("b-table", {
    staticStyle: {
      "white-space": "nowrap"
    },
    attrs: {
      bordered: true,
      responsive: "",
      items: _vm.items,
      fields: _vm.fields,
      "primary-key": "id",
      filter: _vm.filter,
      "current-page": _vm.currentPage,
      "per-page": _vm.perPage
    },
    on: {
      filtered: _vm.onFiltered
    }
  }) : _c("table", {
    staticClass: "table mt-2"
  }, [_c("thead", [_c("tr", {
    staticStyle: {
      "white-space": "nowrap"
    }
  }, [_c("th", [_vm._v("#")]), _vm._v(" "), _c("th", [_vm._v("Airline")]), _vm._v(" "), _c("th", [_vm._v("Product Type")]), _vm._v(" "), _c("th", [_vm._v("Slab")]), _vm._v(" "), _c("th", [_vm._v("Price")]), _vm._v(" "), _c("th", [_vm._v("Added Profit")]), _vm._v(" "), _c("th", [_vm._v("Offline/Online")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.rate_data, function (rate, index) {
    return rate.my_rate[Object.keys(rate.my_rate)[0]] ? _c("tr", {
      key: index,
      "class": {
        "selected-row": _vm.selectedRows.includes(index)
      }
    }, [_c("td", [_c("input", {
      attrs: {
        type: "checkbox",
        id: "selected_" + index
      },
      on: {
        change: function change($event) {
          return _vm.selcted_column(index, rate.carrier_code);
        }
      }
    })]), _vm._v(" "), _c("td", [_vm._v(" " + _vm._s(rate.carrier_code + "(" + rate.carrier_prefix + ")"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(rate.product_name))]), _vm._v(" "), _c("td", [_vm._v("\n                                                    " + _vm._s(Object.keys(rate.my_rate)[0]) + "\n                                                ")]), _vm._v(" "), _c("td", [_vm._v("\n                                                    " + _vm._s(rate.my_rate[Object.keys(rate.my_rate)[0]]) + "\n                                                ")]), _vm._v(" "), _c("td", {
      style: {
        color: _vm.selectedRows.includes(index) ? "black" : "#ee5253",
        fontWeight: _vm.selectedRows.includes(index) ? "700" : "normal"
      }
    }, [_vm._v("\n                                                    " + _vm._s(rate.my_rate_2[Object.keys(rate.my_rate_2)[0]]) + "\n                                                ")]), _vm._v(" "), _c("td", [_vm._v(_vm._s(rate.online_offline))])]) : _vm._e();
  }), _vm._v(" "), _vm.is_rate_available ? _c("tr", {
    staticStyle: {
      "text-align": "center"
    }
  }, [_c("td", {
    attrs: {
      colspan: "6"
    }
  }, [_vm._v("No data available")])]) : _vm._e()], 2)])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "my-10",
    attrs: {
      cols: "12",
      md: "4"
    }
  }, [_c("div", {
    staticClass: "rate-area p-8"
  }, [_c("div", [_c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("FSC :")]), _vm._v(" " + _vm._s(_vm.ams_arr.fsc))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("SCC :")]), _vm._v(" " + _vm._s(_vm.ams_arr.scc))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("XRAY :")]), _vm._v(" " + _vm._s(_vm.ams_arr.xray))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("MISC :")]), _vm._v(" " + _vm._s(_vm.ams_arr.misc))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("CTG :")]), _vm._v(" " + _vm._s(_vm.ams_arr.ctg))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("AWB FEE :")]), _vm._v(" " + _vm._s(_vm.ams_arr.awb_fee))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("FE :")]), _vm._v(" " + _vm._s(_vm.ams_arr.fe))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("MAWB :")]), _vm._v(" " + _vm._s(_vm.ams_arr.mawb))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("HAWB :")]), _vm._v(" " + _vm._s(_vm.ams_arr.hawb))]), _vm._v(" "), _c("span", {
    staticClass: "d-flex"
  }, [_c("span", {
    staticClass: "d-block",
    staticStyle: {
      width: "80px",
      "font-weight": "700"
    }
  }, [_vm._v("DG FEE :")]), _vm._v(" " + _vm._s(_vm.ams_arr.dg_fee))])]), _vm._v(" "), _c("hr"), _vm._v(" "), _vm.user_notice ? _c("div", [_c("h3", {
    staticClass: "mr-3 text-center",
    staticStyle: {
      color: "#cf5244ff"
    }
  }, [_vm._v("Notification")]), _vm._v(" "), _c("h5", {
    domProps: {
      innerHTML: _vm._s(_vm.user_notice)
    }
  })]) : _vm._e()])]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "login-modal",
      "hide-footer": true
    },
    model: {
      value: _vm.report_popup,
      callback: function callback($$v) {
        _vm.report_popup = $$v;
      },
      expression: "report_popup"
    }
  }, [_c("div", {
    staticClass: "w-100"
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": "report_title"
    }
  }, [_vm._v("Report title")]), _vm._v(" "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.report_arr.title,
      expression: "report_arr.title"
    }],
    staticClass: "form-control",
    attrs: {
      type: "text",
      id: "report_title"
    },
    domProps: {
      value: _vm.report_arr.title
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.report_arr, "title", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "form-group"
  }, [_c("label", {
    attrs: {
      "for": "report_description"
    }
  }, [_vm._v("Report description")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.report_arr.description,
      expression: "report_arr.description"
    }],
    staticClass: "form-control",
    attrs: {
      name: "report_description",
      id: "report_description",
      cols: "30",
      rows: "3"
    },
    domProps: {
      value: _vm.report_arr.description
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.report_arr, "description", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "text-center"
  }, [_c("button", {
    staticClass: "btn font-weight-bolder py-3 btn1",
    on: {
      click: function click($event) {
        return _vm.submit_report();
      }
    }
  }, [_vm._v("Submit")])])])])], 1)], 1)], 1)], 1)], 1)], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n/* ── Container ─────────────────────────────────────────── */\n.sidebar[data-v-eeb70fb0] {\n    width: 5%;\n    min-width: 80px;\n    height: 80vh;\n    margin-right: 30px;\n    flex-shrink: 0;\n    position: sticky;\n    top: 0;\n    z-index: 100;\n}\n.sidebar__list[data-v-eeb70fb0] {\n    list-style: none;\n    margin: 0;\n    padding: 20px 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(255, 255, 255, 0.7);\n    backdrop-filter: blur(16px) brightness(1.05);\n    -webkit-backdrop-filter: blur(16px) brightness(1.05);\n    border: 1px solid rgba(255, 255, 255, 0.8);\n    border-radius: 32px;\n    box-shadow: 0 8px 32px rgba(53, 85, 148, 0.08);\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    gap: 16px;\n    overflow: hidden;\n    box-sizing: border-box;\n}\n.sidebar__item[data-v-eeb70fb0] {\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding: 4px 0;\n    cursor: pointer;\n}\n.sidebar__icon-wrap[data-v-eeb70fb0] {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    transition: transform 0.2s ease;\n}\n.sidebar__icon-wrap img[data-v-eeb70fb0] {\n    width: 32px;\n    height: 32px;\n    display: block;\n    -o-object-fit: contain;\n       object-fit: contain;\n}\n.sidebar__branding[data-v-eeb70fb0] {\n    margin-top: auto;\n    display: flex;\n    justify-content: center;\n    padding: 24px 0 20px;\n}\n.sidebar__branding-text[data-v-eeb70fb0] {\n    writing-mode: vertical-rl;\n    transform: rotate(180deg);\n    font-family: 'Inter', sans-serif;\n    font-weight: 900;\n    letter-spacing: -0.02em;\n    font-size: 18px;\n    color: #355594;\n    white-space: nowrap;\n    opacity: 0.9;\n}\n\n/* ── Mobile Dropdown Styles ───────────────────────────── */\n.sidebar-mobile[data-v-eeb70fb0] {\n    width: 100%;\n    margin-bottom: 20px;\n    position: relative;\n    z-index: 1001;\n}\n.mobile-nav-trigger[data-v-eeb70fb0] {\n    display: flex;\n    align-items: center;\n    background: rgba(255, 255, 255, 0.85);\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(53, 85, 148, 0.2);\n    border-radius: 20px;\n    height: 60px;\n    padding: 0 20px;\n    cursor: pointer;\n    box-shadow: 0 8px 32px rgba(53, 85, 148, 0.1);\n}\n.mobile-active-icon[data-v-eeb70fb0] {\n    width: 28px;\n    height: 28px;\n    margin-right: 12px;\n}\n.mobile-active-label[data-v-eeb70fb0] {\n    color: #355594;\n    font-weight: 700;\n    font-size: 16px;\n    margin-right: 20px;\n}\n.mobile-nav-options[data-v-eeb70fb0] {\n    position: absolute;\n    top: calc(100% + 12px);\n    left: 0;\n    right: 0;\n    background: rgba(255, 255, 255, 0.95);\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(255, 255, 255, 0.8);\n    border-radius: 24px;\n    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);\n    overflow: hidden;\n    padding: 10px;\n}\n.mobile-opt[data-v-eeb70fb0] {\n    display: flex;\n    align-items: center;\n    padding: 14px 16px;\n    border-radius: 16px;\n    transition: all 0.2s ease;\n    cursor: pointer;\n    margin-bottom: 4px;\n}\n.mobile-opt[data-v-eeb70fb0]:last-child {\n    margin-bottom: 0;\n}\n.opt-icon[data-v-eeb70fb0] {\n    width: 24px;\n    height: 24px;\n    margin-right: 14px;\n}\n.opt-label[data-v-eeb70fb0] {\n    color: #475569;\n    font-weight: 600;\n    font-size: 15px;\n}\n.mobile-opt[data-v-eeb70fb0]:hover {\n    background: rgba(53, 85, 148, 0.05);\n}\n.mobile-opt.active[data-v-eeb70fb0] {\n    background: rgba(53, 85, 148, 0.1);\n}\n.mobile-opt.active .opt-label[data-v-eeb70fb0] {\n    color: #355594;\n}\n\n/* Transitions */\n.fade-slide-enter-active[data-v-eeb70fb0], .fade-slide-leave-active[data-v-eeb70fb0] {\n    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.fade-slide-enter[data-v-eeb70fb0], .fade-slide-leave-to[data-v-eeb70fb0] {\n    opacity: 0;\n    transform: translateY(-15px);\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-container {\n    position: relative;\n}\nlabel {\n    font-size: 16px;\n    line-height: 22px;\n    font-weight: 600;\n}\ninput {\n    height: 38px !important;\n}\n.rate-btn {\n    background: transparent;\n    color: #355594;\n    font-size: 16px;\n    font-weight: 600;\n    width: 15%;\n    border: 1px solid #355594;\n    border-radius: 30px;\n}\n.rate-btn:hover {\n    color: #355594 !important;\n}\n.btn1 {\n    background: #c0392b;\n    color: white;\n    font-size: 16px;\n    font-weight: 600;\n}\n.btn1:hover {\n    color: white;\n}\n.rate-area {\n    height: 360px;\n    overflow-y: auto;\n    background: white;\n    border-radius: 10px;\n    box-shadow: 4px 0px 15px 5px rgba(0, 0, 0, 0.1);\n}\n.custom-btn {\n    cursor: pointer;\n    color: white;\n    border-radius: 5px;\n    background: #355594;\n    padding: 5px 15px;\n    margin: 0;\n    font-size: 14px;\n    line-height: 20px;\n    align-items: center;\n    display: flex;\n}\n.err_cls {\n    color: #c0392b;\n}\n.custom-dropdown {\n    position: relative;\n    display: inline-block;\n    width: 100%;\n}\n.form-control {\n    width: 100%;\n}\n.dropdown-options {\n    position: absolute;\n    top: 100%;\n    left: 0;\n    width: 100%;\n    background-color: #fff;\n    border: 1px solid #ccc;\n    border-radius: 7px;\n    max-height: 200px; /* Adjust as needed */\n    overflow-y: auto;\n    z-index: 1;\n}\n.option {\n    padding: 5px 10px;\n    cursor: pointer;\n    border: none !important;\n}\n.option:hover {\n    background-color: #f0f0f0;\n}\n.selected-row {\n    background-color: #ffcccc;\n    font-weight: 600;\n}\n.sticky-div {\n    position: sticky;\n    top: 1px;\n    background-color: #f7f7f7;\n    border-radius: 5px;\n}\n@media (max-width: 480px)  {\n.all-in-section {\n        display: block !important;\n}\n.all-in-amount {\n        margin-left: 0px !important;\n}\n}\n@media (max-width: 576px)  {\nlabel {\n        font-size: 12px !important;\n        line-height: 18px !important;\n}\n.rate-btn {\n        width: 100%;\n}\n}\n@media (max-width: 768px)  {\nlabel {\n        font-size: 14px !important;\n        line-height: 20px !important;\n}\n.rate-btn-container {\n        justify-content: center !important;\n}\n.rate-btn {\n        width: 50%;\n}\n.sticky-div{\n        width: 150%;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.menu-text{\n    font-size: 14px !important;\n}\n#whatsapp-float {\n    position: fixed;\n    bottom: 20px;\n    right: 20px;\n    z-index: 1000; /* Ensure it's above other content */\n}\n#whatsapp-float img {\n    width: 60px; /* Adjust size as needed */\n    height: auto; /* Maintain aspect ratio */\n    border-radius: 50%; /* Circular shape */\n    transition: transform 0.2s; /* Smooth animation */\n}\n#whatsapp-float img:hover {\n    transform: scale(1.1); /* Scale up on hover */\n}\ninput[readonly] {\n    background: lightgrey;\n    border: 1px solid;\n}\noption span {\n    color: green !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_0_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Rate.vue?vue&type=style&index=0&id=511055dc&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_0_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_0_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_1_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Rate.vue?vue&type=style&index=1&id=511055dc&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_1_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_1_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue":
/*!**************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true */ "./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true");
/* harmony import */ var _SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SideBar.vue?vue&type=script&lang=js */ "./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js");
/* harmony import */ var _SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css */ "./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "eeb70fb0",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layout/SideBar.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/Rate.vue":
/*!**********************************************!*\
  !*** ./resources/js/src/view/pages/Rate.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Rate_vue_vue_type_template_id_511055dc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Rate.vue?vue&type=template&id=511055dc */ "./resources/js/src/view/pages/Rate.vue?vue&type=template&id=511055dc");
/* harmony import */ var _Rate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Rate.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Rate.vue?vue&type=script&lang=js");
/* harmony import */ var _Rate_vue_vue_type_style_index_0_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Rate.vue?vue&type=style&index=0&id=511055dc&lang=css */ "./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css");
/* harmony import */ var _Rate_vue_vue_type_style_index_1_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Rate.vue?vue&type=style&index=1&id=511055dc&lang=css */ "./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _Rate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Rate_vue_vue_type_template_id_511055dc__WEBPACK_IMPORTED_MODULE_0__.render,
  _Rate_vue_vue_type_template_id_511055dc__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/Rate.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/Rate.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/Rate.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Rate.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_eeb70fb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=template&id=eeb70fb0&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/Rate.vue?vue&type=template&id=511055dc":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/Rate.vue?vue&type=template&id=511055dc ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_template_id_511055dc__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_template_id_511055dc__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_template_id_511055dc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Rate.vue?vue&type=template&id=511055dc */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=template&id=511055dc");


/***/ }),

/***/ "./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_eeb70fb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/SideBar.vue?vue&type=style&index=0&id=eeb70fb0&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_0_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Rate.vue?vue&type=style&index=0&id=511055dc&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=0&id=511055dc&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Rate_vue_vue_type_style_index_1_id_511055dc_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Rate.vue?vue&type=style&index=1&id=511055dc&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Rate.vue?vue&type=style&index=1&id=511055dc&lang=css");


/***/ })

}]);