"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_ContactUs_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/store/auth.module */ "./resources/js/src/core/services/store/auth.module.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Header",
  data: function data() {
    return {
      show_login_modal: false,
      otp_verification_modal: false,
      user_form: {
        email: "",
        password: "",
        otp: ''
      },
      showPass: true,
      avatarLogoSrc: "/media/custome/user-avatar.png"
    };
  },
  methods: {
    hasActiveChildren: function hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    },
    firstPopUp: function firstPopUp(show_form) {
      this.show_login_modal = true;
    },
    login: function login() {
      var email = $('#login_email').val();
      var password = $('#login_password').val();
      this.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__.LOGIN, {
        email: email,
        password: password
      });
      // this.show_login_modal = false;
      // this.otp_verification_modal = true;
    },
    logout: function logout() {
      this.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__.LOGOUT).then(function () {
        return window.location.href = '/';
      });
    }
  },
  computed: _objectSpread(_objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapState)({
    errors: function errors(state) {
      return state.auth.errors;
    }
  })), (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(["isAuthenticated", "currentUser"])), {}, {
    logoSrc: function logoSrc() {
      var routeLogo = this.$route.meta.logo;

      // Set the logo based on the meta value
      if (routeLogo === 'blue') {
        return "/media/custome/blue-logo.svg";
      } else if (routeLogo === 'white') {
        return "/media/custome/white-logo.png";
      } else {
        // Default logo (if needed)
        return "/media/custome/white-logo.png";
      }
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layout_Header_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layout/Header.vue */ "./resources/js/src/view/layout/Header.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");


// import PageLoader from '../components/PageLoader.vue';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      productTypeOptions: [{
        value: 'Focus Air',
        text: 'Focus Air'
      }, {
        value: 'Focus Sea',
        text: 'Focus Sea'
      }, {
        value: 'Focus Road',
        text: 'Focus Road'
      }],
      selectedProductTypeOptions: [],
      selectedQueryTypeOptions: []
    };
  },
  components: {
    Header: _view_layout_Header_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
    // PageLoader
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "wrap"
  }, [_c("b-navbar", {
    attrs: {
      toggleable: "md"
    }
  }, [_c("div", {
    staticClass: "container-fluid"
  }, [_c("div", {
    staticClass: "navbar-header-logo"
  }, [_c("b-navbar-brand", {
    attrs: {
      href: "/"
    }
  }, [_c("img", {
    attrs: {
      src: _vm.logoSrc,
      alt: "f16s logo",
      id: "main-logo"
    }
  })])], 1), _vm._v(" "), _vm.isAuthenticated ? _c("b-navbar-nav", {
    staticClass: "d-flex flex-row align-items-center content-gap d-md-none ml-auto"
  }, [_c("b-nav-item", {
    staticClass: "nav-link-custom text-uppercase",
    staticStyle: {
      "font-size": "18px"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.currentUser.origin_airport_code) + "\n        ")]), _vm._v(" "), _c("b-nav-item-dropdown", {
    scopedSlots: _vm._u([{
      key: "button-content",
      fn: function fn() {
        return [_c("span", [_c("img", {
          attrs: {
            src: _vm.avatarLogoSrc,
            alt: "avatar logo",
            id: "avatar-logo"
          }
        })])];
      },
      proxy: true
    }], null, false, 250030669)
  }, [_vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.logout();
      }
    }
  }, [_c("span", {
    staticStyle: {
      "font-size": "12px"
    }
  }, [_vm._v("Sign out")])])], 1)], 1) : _vm._e(), _vm._v(" "), _c("b-navbar-toggle", {
    attrs: {
      target: "nav-collapse"
    }
  }), _vm._v(" "), _c("b-collapse", {
    attrs: {
      id: "nav-collapse",
      "is-nav": ""
    }
  }, [_c("div", {
    staticClass: "nav-header-menu"
  }, [_c("b-navbar-nav", {
    staticClass: "ml-auto nav-menu text-center"
  }, [_c("b-nav-item", {
    staticClass: "nav-link-custom text-white",
    attrs: {
      to: "/about-us"
    }
  }, [_vm._v("About Us")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom text-white",
    attrs: {
      to: "/user-guid"
    }
  }, [_vm._v("Services")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom text-white",
    attrs: {
      to: "/faq"
    }
  }, [_vm._v("FAQs")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom text-white",
    attrs: {
      to: "/tutorial"
    }
  }, [_vm._v("Solutions")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom text-white",
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Contact Us")]), _vm._v(" "), _c("div", {
    staticClass: "head-btn d-md-none"
  }, [!_vm.isAuthenticated ? _c("b-nav-item", {
    staticClass: "nav-link-custom d-md-none"
  }, [_c("button", {
    staticClass: "sign-in-btn",
    on: {
      click: function click($event) {
        return _vm.firstPopUp("login_signin");
      }
    }
  }, [_vm._v("Sign in")])]) : _vm._e(), _vm._v(" "), !_vm.isAuthenticated ? _c("b-nav-item", {
    staticClass: "nav-link-custom d-md-none"
  }, [_c("button", {
    staticClass: "whats-new-btn"
  }, [_vm._v("What's Free?")])]) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _vm.isAuthenticated ? _c("div", {
    staticClass: "nav-header-right"
  }, [_c("b-navbar-nav", {
    staticClass: "ml-auto align-items-center content-gap d-none d-md-flex"
  }, [_c("b-nav-item", {
    staticClass: "nav-link-custom text-uppercase",
    staticStyle: {
      "font-size": "18px"
    }
  }, [_vm._v("\n              " + _vm._s(_vm.currentUser.origin_airport_code) + "\n            ")]), _vm._v(" "), _c("b-nav-item-dropdown", {
    scopedSlots: _vm._u([{
      key: "button-content",
      fn: function fn() {
        return [_c("span", [_c("img", {
          attrs: {
            src: _vm.avatarLogoSrc,
            alt: "avatar logo",
            id: "avatar-logo"
          }
        })])];
      },
      proxy: true
    }], null, false, 250030669)
  }, [_vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.logout();
      }
    }
  }, [_c("span", {
    staticStyle: {
      "font-size": "12px"
    }
  }, [_vm._v("Sign out")])])], 1)], 1)], 1) : _c("div", {
    staticClass: "nav-header-right"
  }, [_c("b-navbar-nav", {
    staticClass: "ml-auto align-items-center content-gap d-none d-md-flex"
  }, [_c("b-nav-item", {
    staticClass: "nav-link-custom"
  }, [_c("button", {
    staticClass: "sign-in-btn",
    on: {
      click: function click($event) {
        return _vm.firstPopUp("login_signin");
      }
    }
  }, [_vm._v("Sign in")])]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom"
  }, [_c("button", {
    staticClass: "whats-new-btn"
  }, [_vm._v("What's Free?")])])], 1)], 1)]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "login-modal",
      "hide-header": true,
      "hide-footer": true
    },
    model: {
      value: _vm.show_login_modal,
      callback: function callback($$v) {
        _vm.show_login_modal = $$v;
      },
      expression: "show_login_modal"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column-fluid flex-center"
  }, [_c("div", {
    staticClass: "login-form login-signin w-100"
  }, [_c("form", {
    staticClass: "form",
    attrs: {
      novalidate: "novalidate",
      id: "kt_login_signin_form"
    },
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.login();
      }
    }
  }, [_c("div", {
    staticClass: "pb-5 pt-lg-0 pt-5 text-center"
  }, [_c("h1", {
    staticClass: "title-text my-6 my-md-12"
  }, [_vm._v("Sign In to F16s")])]), _vm._v(" "), _vm.errors == "Unauthorized" ? _c("div", {
    staticClass: "p-3 text-center"
  }, [_c("span", {
    staticClass: "text-danger h6"
  }, [_vm._v("Invalid email or password")])]) : _vm.errors == "Blocked" ? _c("div", {
    staticClass: "p-3 text-center"
  }, [_c("span", {
    staticClass: "text-danger h6"
  }, [_vm._v("Your account is blocked. Contact admin")])]) : _vm.errors == "Daily_Limit" ? _c("div", {
    staticClass: "p-3 text-center"
  }, [_c("span", {
    staticClass: "text-danger h6"
  }, [_vm._v("Your daily login limit is exceeded. Login again tomorrow")])]) : _vm.errors == "Expired" ? _c("div", {
    staticClass: "p-3 text-center"
  }, [_c("span", {
    staticClass: "text-danger h6"
  }, [_vm._v("Your plan is expired. Please renew the plan")])]) : _vm._e(), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end custom-label",
          staticStyle: {
            width: "60px"
          }
        }, [_c("span", [_vm._v("User ID:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-form-input", {
    ref: "email",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "login_email",
      type: "text",
      name: "email",
      placeholder: "Enter Email ID"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end custom-label",
          staticStyle: {
            width: "60px"
          }
        }, [_c("span", [_vm._v("Password:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "form-group d-flex align-items-center mb-0"
  }, [_c("b-form-input", {
    ref: "password",
    staticClass: "form-control form-control-solid h-auto py-4 px-2 login_password",
    attrs: {
      id: "login_password",
      type: _vm.showPass ? "password" : "text",
      name: "password",
      autocomplete: "off",
      placeholder: "Enter Password"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "show_pass",
    on: {
      click: function click($event) {
        _vm.showPass = !_vm.showPass;
      }
    }
  }, [_vm.showPass ? _c("span", [_vm._v("Show")]) : _c("span", [_vm._v("Hide")])])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center"
  }, [_c("b-button", {
    staticClass: "my-2 my-md-6 sign-in-btn",
    staticStyle: {
      "border-radius": "30px",
      border: "1px solid #355594",
      padding: "6px 30px",
      color: "#355594",
      background: "transparent !important"
    },
    attrs: {
      type: "submit"
    }
  }, [_vm._v("Sign in")])], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center mb-4 mb-md-8 mt-3 mt-md-6"
  }, [_c("p", {
    staticClass: "bottom-text"
  }, [_vm._v("Can’t recall your User ID or Password?"), _c("br"), _vm._v(" "), _c("span", {
    staticClass: "contact-support"
  }, [_c("a", {
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      href: "#"
    }
  }, [_vm._v("Contact Support")])])])])], 1)])])]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "login-modal",
      "hide-header": true,
      "hide-footer": true
    },
    model: {
      value: _vm.otp_verification_modal,
      callback: function callback($$v) {
        _vm.otp_verification_modal = $$v;
      },
      expression: "otp_verification_modal"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column-fluid flex-center"
  }, [_c("div", {
    staticClass: "login-form login-signin w-100"
  }, [_c("form", {
    staticClass: "form",
    attrs: {
      novalidate: "novalidate",
      id: "kt_login_signin_form"
    },
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.login();
      }
    }
  }, [_c("div", {
    staticClass: "text-center my-6 my-md-12"
  }, [_c("h1", {
    staticClass: "title-text"
  }, [_vm._v("One Time Password")]), _vm._v(" "), _c("p", {}, [_vm._v("You will receive a verification code on your email at l******@f16s.in")])]), _vm._v(" "), _vm.errors == "Unauthorized" ? _c("div", {
    staticClass: "p-3 text-center"
  }, [_c("span", {
    staticClass: "text-danger h6"
  }, [_vm._v("Invalid email or password")])]) : _vm._e(), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "input-horizontal"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end custom-label",
          staticStyle: {
            width: "60px"
          }
        }, [_c("span", [_vm._v("OTP:")]), _vm._v(" "), _c("span", {
          staticStyle: {
            color: "red"
          }
        }, [_vm._v("*")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-form-input", {
    ref: "otp",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "otp",
      type: "text",
      name: "otp",
      placeholder: "E.g: 801801"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center"
  }, [_c("button", {
    staticClass: "my-2 my-md-6 btn-color",
    attrs: {
      type: "submit"
    }
  }, [_vm._v("Sign In")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center my-3 my-md-6"
  }, [_c("p", {
    staticClass: "bottom-text"
  }, [_vm._v("Problem receiving OTP? \n                  "), _c("span", {
    staticClass: "contact-support"
  }, [_c("a", {
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      href: "#"
    }
  }, [_vm._v("Resend Email")])])])])], 1)])])])], 1)])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=template&id=2b655292&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=template&id=2b655292&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-container", {
    staticClass: "main-container",
    attrs: {
      fluid: ""
    }
  }, [_c("Header"), _vm._v(" "), _c("b-container", [_c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    staticClass: "my-md-20 my-sm-12",
    staticStyle: {
      position: "relative"
    },
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "10"
    }
  }, [_c("div", {
    staticClass: "ellipse-1"
  }, [_c("img", {
    staticClass: "circle-image-1",
    attrs: {
      src: "/media/custome/circle/ellipse-1.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "ellipse-2"
  }, [_c("img", {
    staticClass: "circle-image-2",
    attrs: {
      src: "/media/custome/circle/ellipse-2.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "ellipse-3"
  }, [_c("img", {
    staticClass: "circle-image-3",
    attrs: {
      src: "/media/custome/circle/ellipse-3.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "my-md-12 my-sm-8"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Contact Us")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mt-6 mt-md-8",
    attrs: {
      cols: "10",
      sm: "8",
      md: "8",
      lg: "8",
      xl: "8",
      xxl: "8"
    }
  }, [_c("p", {
    staticClass: "section-text"
  }, [_vm._v("We’re always here to assist you. Select the appropriate option below and let us help you with your inquiry.")])])], 1)], 1)]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "10"
    }
  }, [_c("div", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.show-query-modal",
      modifiers: {
        "show-query-modal": true
      }
    }],
    staticClass: "query-section my-8 my-sm-12 my-md-15"
  }, [_c("h2", [_vm._v("Have a Dispute or Query? We’re Here to Help!")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12",
      sm: "10",
      md: "10",
      lg: "10",
      xl: "10",
      xxl: "10"
    }
  }, [_c("p", [_vm._v("If you’re facing any issues or have a query regarding our services, we’re committed to resolving them quickly. When logged in, your details will be pre-filled, and a Ticket Number will be generated for tracking your request.")])])], 1)], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "show-query-modal",
      "hide-footer": true
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column-fluid flex-center"
  }, [_c("div", {
    staticClass: "w-100"
  }, [_c("div", {
    staticClass: "pb-15 pt-0 text-center"
  }, [_c("h2", [_vm._v("Fill in your Query Details")])]), _vm._v(" "), _c("form", {
    staticClass: "form"
  }, [_c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "query-name"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Name:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "queryName",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "query-name",
      type: "text",
      name: "queryName",
      placeholder: "Enter your name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "query-emailId"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Email ID:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "queryEmailId",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "query-emailId",
      type: "email",
      name: "queryEmailId",
      placeholder: "Enter your Email ID"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "query-companyName"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Company Name:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "queryCompanyName",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "query-companyName",
      type: "text",
      name: "queryCompanyName",
      placeholder: "Enter your Company Name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "query-userId"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("User ID:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "queryUserId",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "query-userId",
      type: "text",
      name: "queryUserId",
      placeholder: "Enter your User ID"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "query-ticketNumber"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Ticket Number:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "queryTicketNumber",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "query-ticketNumber",
      type: "text",
      name: "queryTicketNumber",
      placeholder: "Enter your Ticket Number"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "query-queryDescription"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Query Description:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-textarea", {
    ref: "queryQueryDescription",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "query-queryDescription",
      type: "text",
      name: "queryQueryDescription",
      placeholder: "Type your queries here"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center"
  }, [_c("p", {
    staticClass: "text-center py-2",
    staticStyle: {
      width: "60%"
    }
  }, [_vm._v("Once submitted, you’ll receive a confirmation email with your "), _c("b", [_vm._v("Ticket Number")]), _vm._v(" to track your case.")])])], 1), _vm._v(" "), _c("b-col", {
    staticClass: "my-5",
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-row justify-content-center"
  }, [_c("b-button", {
    staticClass: "submit-btn"
  }, [_vm._v("Submit")])], 1)])], 1)])])], 1), _vm._v(" "), _c("b-col", {
    staticClass: "quote-col",
    attrs: {
      cols: "10"
    }
  }, [_c("div", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.show-quote-modal",
      modifiers: {
        "show-quote-modal": true
      }
    }],
    staticClass: "quote-section my-8 my-sm-12 my-md-15"
  }, [_c("h2", [_vm._v("Get a Customized Quote Based on Your Needs")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12",
      sm: "10",
      md: "10",
      lg: "10",
      xl: "10",
      xxl: "10"
    }
  }, [_c("p", [_vm._v("Looking for the best pricing option for your business? Fill in the details below, and we’ll provide a quote tailored to your needs.")])])], 1)], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "show-quote-modal",
      "hide-footer": true,
      "ok-only": ""
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column-fluid flex-center"
  }, [_c("div", {
    staticClass: "w-100"
  }, [_c("div", {
    staticClass: "pb-15 pt-0 text-center"
  }, [_c("h2", [_vm._v("Fill in your Query Details")])]), _vm._v(" "), _c("form", {
    staticClass: "form",
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.handleSubmit.apply(null, arguments);
      }
    }
  }, [_c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "quote-quoteName"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Name:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "quoteName",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "quote-quoteName",
      type: "text",
      name: "quoteName",
      placeholder: "Enter your name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "quote-companyEmailId"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Company Email ID:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "quoteCompanyEmailId",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "quote-companyEmailId",
      type: "email",
      name: "quoteCompanyEmailId",
      placeholder: "Enter your Email ID"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "quote-phoneNumber"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Phone Number:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "quotePhoneNumber",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "quote-phoneNumber",
      type: "text",
      name: "quotePhoneNumber",
      placeholder: "Enter your Phone Number"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "quote-designation"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Designation:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "quoteDesignation",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "quote-designation",
      type: "text",
      name: "quoteDesignation",
      placeholder: "Enter your Designation"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-checkbox",
      "label-cols-md": "auto",
      "label-for": "quote-productOption"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Product Chosen:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control-sm",
    model: {
      value: _vm.selectedProductTypeOptions,
      callback: function callback($$v) {
        _vm.selectedProductTypeOptions = $$v;
      },
      expression: "selectedProductTypeOptions"
    }
  }, _vm._l(_vm.productTypeOptions, function (productTypeOption, index) {
    return _c("option", {
      key: index,
      attrs: {
        size: "sm",
        id: "checkbox-" + index
      },
      domProps: {
        value: productTypeOption.value
      }
    }, [_vm._v("\n                                                            " + _vm._s(productTypeOption.text) + "\n                                                        ")]);
  }), 0)], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "quote-empNumber"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Number of Employees:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "quoteEmpNumber",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "quote-empNumber",
      type: "text",
      name: "quoteEmpNumber",
      placeholder: "Enter Number of Employees"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "quote-companyName"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "135px"
          }
        }, [_c("span", [_vm._v("Company Name:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "quoteCompanyName",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "quote-companyName",
      type: "text",
      name: "quoteCompanyName",
      placeholder: "Enter your Company Name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center"
  }, [_c("p", {
    staticClass: "text-center py-2",
    staticStyle: {
      width: "60%"
    }
  }, [_vm._v("Submit your details, and we’ll get back to you with a quote.")])])], 1), _vm._v(" "), _c("b-col", {
    staticClass: "my-5",
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-row justify-content-center"
  }, [_c("b-button", {
    staticClass: "submit-btn",
    attrs: {
      type: "submit"
    }
  }, [_vm._v("Submit")])], 1)])], 1)])])], 1), _vm._v(" "), _c("b-col", {
    staticClass: "feedback-col",
    attrs: {
      cols: "10"
    }
  }, [_c("div", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.show-feedback-modal",
      modifiers: {
        "show-feedback-modal": true
      }
    }],
    staticClass: "feedback-section my-8 my-sm-12 my-md-15"
  }, [_c("h2", [_vm._v("Feedback or Job Opportunities? Let’s Connect!")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12",
      sm: "10",
      md: "10",
      lg: "10",
      xl: "10",
      xxl: "10"
    }
  }, [_c("p", [_vm._v("Share your feedback with us or let us know if you’re interested in joining our team. We appreciate your input!")])])], 1)], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "show-feedback-modal",
      "hide-footer": true
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column-fluid flex-center"
  }, [_c("div", {
    staticClass: "w-100"
  }, [_c("div", {
    staticClass: "pb-15 pt-0 text-center"
  }, [_c("h2", [_vm._v("Fill in your Query Details")])]), _vm._v(" "), _c("form", {
    staticClass: "form"
  }, [_c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "feedback-name"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Name:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "feedbackName",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "feedback-name",
      type: "text",
      name: "feedbackName",
      placeholder: "Enter your name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "feedback-emailId"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Email ID:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "feedbackEmailId",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "feedback-emailId",
      type: "email",
      name: "feedbackEmailId",
      placeholder: "Enter your Email ID"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "feedback-companyName"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Company Name:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-input", {
    ref: "feedbackCompanyName",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "feedback-companyName",
      type: "text",
      name: "feedbackCompanyName",
      placeholder: "Enter your Company Name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "feedback-productOption"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Query Type:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-select", {
    staticClass: "form-control-sm",
    model: {
      value: _vm.selectedQueryTypeOptions,
      callback: function callback($$v) {
        _vm.selectedQueryTypeOptions = $$v;
      },
      expression: "selectedQueryTypeOptions"
    }
  }, [_c("option", {
    attrs: {
      value: "Feedback"
    }
  }, [_vm._v("Feedback")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "Job enquiry"
    }
  }, [_vm._v("Job enquiry")])])], 1)], 1)], 1), _vm._v(" "), _c("b-form-group", {
    staticClass: "align-items-center",
    attrs: {
      id: "fieldset-horizontal",
      "label-cols-md": "auto",
      "label-for": "feedback-queryDescription"
    },
    scopedSlots: _vm._u([{
      key: "label",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center label-label",
          staticStyle: {
            width: "110px"
          }
        }, [_c("span", [_vm._v("Query Description:")])])];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("b-form-textarea", {
    ref: "feedbackQueryDescription",
    staticClass: "form-control form-control-solid h-auto py-4 px-2",
    attrs: {
      id: "feedback-queryDescription",
      type: "text",
      name: "feedbackQueryDescription",
      placeholder: "Type your queries here"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-center"
  }, [_c("p", {
    staticClass: "text-center py-2",
    staticStyle: {
      width: "60%"
    }
  }, [_vm._v("Once submitted, you’ll receive a confirmation email with your "), _c("b", [_vm._v("Ticket Number")]), _vm._v(" to track your case.")])])], 1), _vm._v(" "), _c("b-col", {
    staticClass: "my-5",
    attrs: {
      cols: "12",
      xs: "12",
      sm: "12",
      md: "12",
      lg: "12",
      xl: "12",
      xxl: "12"
    }
  }, [_c("div", {
    staticClass: "d-flex flex-row justify-content-center"
  }, [_c("b-button", {
    staticClass: "submit-btn"
  }, [_vm._v("Submit")])], 1)])], 1)])])], 1)], 1)], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\nhtml[data-v-5ab8085e], body *[data-v-5ab8085e] {\r\n  font-family: 'Roboto', sans-serif !important;\n}\n.navbar-header-logo[data-v-5ab8085e] {\r\n  width: 10%;\n}\n.nav-header-menu[data-v-5ab8085e] {\r\n  width: 70%;justify-content: flex-end;display: flex;margin-right:6%;\n}\n.nav-header-right[data-v-5ab8085e] {\r\n  width: 30%;justify-content: flex-end;display: flex;\n}\n.navbar[data-v-5ab8085e] {\r\n  height: auto;\r\n  padding: 54px 0px !important;\n}\n.nav-menu[data-v-5ab8085e] {\r\n  padding: 12px 41px 12px 41px;\r\n  gap: 50px;\r\n  border-radius: 39px;\r\n  background: linear-gradient(360deg, rgba(148, 153, 178, 0.07) 0%, rgba(34, 50, 138, 0.07) 100%);\r\n  -webkit-backdrop-filter: blur(90px);\r\n          backdrop-filter: blur(90px);\n}\n.nav-link[data-v-5ab8085e] {\r\n  padding: 0px !important;\r\n  color: #355594 !important;\n}\n.content-gap[data-v-5ab8085e] {\r\n  gap:18px;\n}\n.nav-link-custom[data-v-5ab8085e]:hover {\r\n  color: red !important;\n}\n.nav-link-custom[data-v-5ab8085e]{\r\n  font-size: 14px;\r\n  line-height: 30px;\r\n  font-weight: 400;\n}\na.menu-link[data-v-5ab8085e]{\r\ntext-decoration: none !important;\r\ncolor: black;\n}\n.menu-text[data-v-5ab8085e]{\r\ncolor: White;\n}\n#main-logo[data-v-5ab8085e]{\r\n  width: 100%;\n}\n#avatar-logo[data-v-5ab8085e]{\r\n  width: 35px;\r\n  height: auto;\n}\n.show_pass[data-v-5ab8085e] {\r\n  position: absolute;\r\n  left: 87%;\n}\n.sign-in-btn[data-v-5ab8085e] {\r\n  font-size: 14px;\r\n  line-height: 24px;\r\n  border: 1px solid #355594;\r\n  border-radius: 30px;\r\n  padding: 12px 30px;\r\n  background: transparent !important;\r\n  color: #355594;\n}\n.sign-in-btn[data-v-5ab8085e]:hover {\r\n  /* color:#fff !important; */\r\n  /* background-color: #355594; */\r\n  /* background:#355594 !important; */\n}\n.whats-new-btn[data-v-5ab8085e] {\r\n  font-size: 14px;\r\n  line-height: 20px;\r\n  color:#fff;\r\n  border: 1px solid #355594;\r\n  background:#355594;\r\n  border-radius: 30px;\r\n  padding: 14px 16px;\n}\n.whats-new-btn[data-v-5ab8085e]:hover {\r\n  color:#355594 !important;\r\n  background-color: #35559400;\r\n  background:#35559400;\n}\n.form-control[data-v-5ab8085e] {\r\n  background-color: #f3f6f900 !important;\n}\n.btn-color[data-v-5ab8085e] {\r\n    background: #0000;\r\n    font-size: 14px;\r\n    font-weight: 400;\r\n    line-height: 25px;\r\n    text-align: center;\r\n    color: #A6A6A6;\r\n    border: 1px solid #A6A6A6;\r\n    -webkit-backdrop-filter: blur(90px);\r\n            backdrop-filter: blur(90px);\r\n    border-radius: 30px;\r\n    padding: 10px 40px;\n}\n.bottom-text[data-v-5ab8085e] {\r\n  color: #4C4C4C;\r\n  font-size: 12px;\r\n  font-weight: 400;\r\n  line-height: 15px;\r\n  text-align: center;\n}\n.contact-support[data-v-5ab8085e] {\r\n  color: #355594;\r\n  font-size: 12px;\r\n  font-weight: 500;\r\n  line-height: 15px;\r\n  text-align: center;\r\n  text-decoration-line: underline;\r\n  cursor: pointer;\n}\r\n/* Login Model box css */\n.title-text[data-v-5ab8085e] {\r\n  font-size: 24px;\r\n  font-weight: 500;\r\n  line-height: 22px;\r\n  text-align: center;\r\n  color:#355594;\n}\n.form-control[data-v-5ab8085e], .form-control-solid[data-v-5ab8085e] {\r\n    background: transparent !important;\r\n    border: 1px solid #A6A6A6 !important;\n}\n.form-control-solid[data-v-5ab8085e]:active {\r\n    background-color: #f3f6f9 !important;\n}\n@media (max-width: 1199px) {\n.nav-header-menu[data-v-5ab8085e] {\r\n    margin-right:0%;\n}\n}\n@media (max-width: 992px) {\n.navbar-header-logo[data-v-5ab8085e] {\r\n    width: 12%;\n}\n.navbar-collapse[data-v-5ab8085e], .collapse[data-v-5ab8085e] {\r\n    width:88%;\n}\n.nav-header-menu[data-v-5ab8085e] {\r\n    margin-right:0%;\n}\n.nav-menu[data-v-5ab8085e] {\r\n    gap: 40px;\n}\n.sign-in-btn[data-v-5ab8085e] {\r\n    padding: 8px 28px;\n}\n.whats-new-btn[data-v-5ab8085e] {\r\n    padding: 10px 12px;\n}\n.show_pass[data-v-5ab8085e] {\r\n    left: 88%;\n}\n}\n@media (max-width: 920px) {\n.nav-header-menu[data-v-5ab8085e] {\r\n    width:63%;\n}\n.nav-header-right[data-v-5ab8085e] {\r\n    width:37%;\n}\n.nav-menu[data-v-5ab8085e] {\r\n    gap: 15px;\n}\n.nav-link-custom[data-v-5ab8085e] {\r\n    font-size: 13px;\r\n    line-height: 25px;\n}\n}\n@media (max-width: 768px) {\n.navbar-header-logo[data-v-5ab8085e] {\r\n    width: 18%;\n}\n.nav-header-menu[data-v-5ab8085e] {\r\n    margin-right:0%;\r\n    width: 100%;\n}\n#main-logo[data-v-5ab8085e]{\r\n    width: 100%;\r\n    padding-left: 15px;\n}\n.nav-menu[data-v-5ab8085e] {\r\n    gap: 25px;\r\n    width: 100%;\n}\n.head-btn[data-v-5ab8085e] {\r\n    display: flex;\r\n    justify-content: center;\r\n    flex-direction: row;\r\n    -moz-column-gap: 20px;\r\n         column-gap: 20px;\n}\n.content-gap[data-v-5ab8085e] {\r\n    gap:20px;\n}\n.nav-link-custom[data-v-5ab8085e] {\r\n    font-size: 22px !important;\r\n    line-height: 28px !important;\n}\n.navbar-collapse[data-v-5ab8085e] {\r\n    padding: 0px 15px;\r\n    z-index: 999;\r\n    max-width: 100%;\r\n    width: 100%;\r\n    position: absolute;\r\n    left: 0%;\r\n    right: 0%;\r\n    top: 54%;\r\n    transition: opacity -20s ease,  0.5s ease-in-out;\n}\n.navbar[data-v-5ab8085e] {\r\n    padding: 20px 0px 50px !important;\n}\n.custom-label[data-v-5ab8085e] {\r\n    justify-content: start !important;\r\n    width: auto !important;\n}\n}\n@media (max-width: 576px) {\n.navbar-header-logo[data-v-5ab8085e] {\r\n    width: 24%;\n}\n.nav-header-menu[data-v-5ab8085e] {\r\n    margin-right:0%;\n}\n}\n@media (max-width: 480px) {\n.navbar-header-logo[data-v-5ab8085e] {\r\n    width: 28%;\n}\n.nav-header-menu[data-v-5ab8085e] {\r\n    margin-right:0%;\n}\n.sign-in-btn[data-v-5ab8085e][data-v-5ab8085e] {\r\n    padding: 8px 22px;\n}\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.navbar-collapse, .collapse {\r\n  width:90%;\n}\n.nav-link:after {\r\n  content: none !important;\n}\n.dropdown-menu {\r\n  position: absolute !important;\r\n    left: -85px !important;\r\n    border-radius: 15px !important;\n}\n.navbar-light .navbar-toggler {\r\n    color: #355594;\r\n    border-color: #0000;\n}\n.modal-content {\r\n    background-color: #F3F6F9 !important;\r\n    -webkit-backdrop-filter: blur(130px) !important;\r\n            backdrop-filter: blur(130px) !important;\r\n    box-shadow: 5px 4px 25px 0px #0000001F !important;\r\n    border-radius: 40px !important;\r\n    padding: 2.5rem;\n}\n.modal-body {\r\n    padding: 0px !important;\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\nhtml[data-v-2b655292], body[data-v-2b655292], html *[data-v-2b655292] {\r\n  font-family: 'Roboto', sans-serif !important;\n}\n.main-container[data-v-2b655292] {\r\n    background: linear-gradient(180deg, #EDF7FF 10%, #FFFFFF 38%);\n}\n.section-title[data-v-2b655292] {\r\n    font-size: 48px !important;\r\n    font-weight: 500;\r\n    line-height: 54px !important;\r\n    text-align: center;\r\n    color: #355594;\n}\n.section-text[data-v-2b655292] {\r\n    font-size: 14px;\r\n    font-weight: 400;\r\n    line-height: 20px;\r\n    text-align: center;\r\n    color:#4C4C4C;\n}\n.ellipse-1[data-v-2b655292] {\r\n    position: absolute;\r\n    left: 93%;\r\n    top: -20%;\n}\n.circle-image-1[data-v-2b655292] {\r\n    width: 60px;\r\n    height: auto;\n}\n.ellipse-2[data-v-2b655292] {\r\n    position: absolute;\r\n    left: 5%;\r\n    top: 57%;\n}\n.circle-image-2[data-v-2b655292] {\r\n    width: 10px;\r\n    height: auto;\n}\n.ellipse-3[data-v-2b655292] {\r\n    position: absolute;\r\n    left: -3%;\r\n    top: 100%;\n}\n.circle-image-3[data-v-2b655292] {\r\n    width: 25px;\r\n    height: auto;\n}\n.query-section[data-v-2b655292],\r\n.quote-section[data-v-2b655292],\r\n.feedback-section[data-v-2b655292] {\r\n    padding: 78px 186px;\r\n    border-radius: 30px;\r\n    background: #FFFFFF;\r\n    box-shadow: 4px 4px 80px 5px #0000001A;\n}\n.query-section h2[data-v-2b655292],\r\n.quote-section h2[data-v-2b655292],\r\n.feedback-section h2[data-v-2b655292] {\r\n    font-size: 40px;\r\n    font-weight: 500;\r\n    line-height: 45px;\r\n    text-align: center;\r\n    color: #355594;\r\n    margin: 0;\r\n    padding-bottom: 30px;\n}\n.query-section p[data-v-2b655292],\r\n.quote-section p[data-v-2b655292],\r\n.feedback-section p[data-v-2b655292] {\r\n    font-size: 13px;\r\n    font-weight: 400;\r\n    line-height: 20px;\r\n    text-align: center;\r\n    color: #4C4C4C;\r\n    margin: 0;\r\n    padding-top: 30px;\n}\n.query-section[data-v-2b655292]:hover,\r\n.quote-section[data-v-2b655292]:hover,\r\n.feedback-section[data-v-2b655292]:hover {\r\n    background: linear-gradient(180deg, #E8F6FF 0%, #FFFFFF 100%);\r\n    box-shadow: 4px 4px 80px 5px #0000001A;\r\n    transition: all 0.3s ease;\r\n    cursor: pointer;\n}\n#show-query-modal h2[data-v-2b655292],\r\n#show-quote-modal h2[data-v-2b655292],\r\n#show-feedback-modal h2[data-v-2b655292] {\r\n    font-size: 24px;\r\n    font-weight: 500;\r\n    line-height: 30px;\r\n    text-align: center;\r\n    color: #355594;\r\n    margin: 0;\n}\n.submit-btn[data-v-2b655292] {\r\n    background: transparent !important;\r\n    border: 1px solid #A6A6A6;\r\n    color: #A6A6A6;\r\n    border-radius: 30px;\r\n    padding: 8px 20px;\n}\n.submit-btn[data-v-2b655292]:hover {\r\n    background: transparent !important;\r\n    border: 1px solid #A6A6A6 !important;\r\n    color: #A6A6A6 !important;\r\n    box-shadow: 1px 0px 4px 0px #00000040;\n}\r\n/* For Extra Small Screens (xs - <576px) */\n@media (max-width: 575px) {\n.section-title[data-v-2b655292] {\r\n        font-size: 36px !important;\r\n        line-height: 40px !important;\n}\n.query-section[data-v-2b655292],\r\n    .quote-section[data-v-2b655292],\r\n    .feedback-section[data-v-2b655292] {\r\n        padding: 20px;\n}\n.query-section h2[data-v-2b655292],\r\n    .quote-section h2[data-v-2b655292],\r\n    .feedback-section h2[data-v-2b655292] {\r\n        font-size: 22px;\r\n        line-height: 28px;\r\n        padding-bottom: 10px;\n}\n.query-section p[data-v-2b655292],\r\n    .quote-section p[data-v-2b655292],\r\n    .feedback-section p[data-v-2b655292] {\r\n        font-size: 13px;\r\n        line-height: 20px;\r\n        padding-top: 10px;\n}\n.label-label[data-v-2b655292] {\r\n        width: auto !important;\r\n        justify-content: start !important;\n}\n}\n@media (max-width: 575px) {\n.section-title[data-v-2b655292] {\r\n        font-size: 40px !important;\r\n        line-height: 46px !important;\n}\n.section-text[data-v-2b655292] {\r\n        font-size: 12px;\r\n        line-height: 18px;\n}\n.circle-image-1[data-v-2b655292] {\r\n        width: 30px;\r\n        height: auto;\n}\n.ellipse-2[data-v-2b655292] {\r\n        top: 56%;\r\n        left: 4%;\n}\n.ellipse-3[data-v-2b655292] {\r\n        top: 95%;\r\n        left: -5%;\n}\n}\r\n/* For Small Screens (sm - ≥576px) */\n@media (min-width: 576px) and (max-width: 767px) {\n.section-title[data-v-2b655292] {\r\n        font-size: 44px !important;\r\n        line-height: 50px !important;\n}\n.section-text[data-v-2b655292] {\r\n        font-size: 12px;\r\n        line-height: 18px;\n}\n.circle-image-1[data-v-2b655292] {\r\n        width: 45px;\r\n        height: auto;\n}\n.query-section[data-v-2b655292],\r\n    .quote-section[data-v-2b655292],\r\n    .feedback-section[data-v-2b655292] {\r\n        padding: 30px;\n}\n.query-section h2[data-v-2b655292],\r\n    .quote-section h2[data-v-2b655292],\r\n    .feedback-section h2[data-v-2b655292] {\r\n        font-size: 28px;\r\n        line-height: 34px;\r\n        padding-bottom: 10px;\n}\n.query-section p[data-v-2b655292],\r\n    .quote-section p[data-v-2b655292],\r\n    .feedback-section p[data-v-2b655292] {\r\n        font-size: 13px;\r\n        line-height: 20px;\r\n        padding-top: 10px;\n}\n.label-label[data-v-2b655292] {\r\n        width: auto !important;\r\n        justify-content: start !important;\n}\n}\r\n\r\n/* For Medium Screens (md - ≥768px) */\n@media (min-width: 768px) and (max-width: 991px) {\n.query-section[data-v-2b655292],\r\n    .quote-section[data-v-2b655292],\r\n    .feedback-section[data-v-2b655292] {\r\n        padding: 50px;\n}\n.query-section h2[data-v-2b655292],\r\n    .quote-section h2[data-v-2b655292],\r\n    .feedback-section h2[data-v-2b655292] {\r\n        font-size: 34px;\r\n        line-height: 40px;\r\n        padding-bottom: 12px;\n}\n.query-section p[data-v-2b655292],\r\n    .quote-section p[data-v-2b655292],\r\n    .feedback-section p[data-v-2b655292] {\r\n        font-size: 13px;\r\n        line-height: 20px;\r\n        padding-top: 12px;\n}\n}\r\n\r\n/* For Large Screens (lg - ≥992px) */\n@media (min-width: 992px) and (max-width: 1199px) {\n.query-section[data-v-2b655292],\r\n    .quote-section[data-v-2b655292],\r\n    .feedback-section[data-v-2b655292] {\r\n        padding: 60px 80px;\n}\n}\r\n\r\n/* For Extra Large Screens (xl - ≥1200px) */\r\n/* @media (min-width: 1200px) {\r\n    \r\n} */\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\r\n/* Model box css */\n.modal-content {\r\n    background-color: #F3F6F9 !important;\r\n    -webkit-backdrop-filter: blur(130px) !important;\r\n            backdrop-filter: blur(130px) !important;\r\n    box-shadow: 5px 4px 25px 0px #0000001F !important;\r\n    border-radius: 40px !important;\r\n    padding: 2.5rem;\n}\n.modal-body {\r\n    padding: 0px !important;\n}\n.modal .modal-header {\r\n    border: 0px !important;\n}\n.close {\r\n    font-size: 3rem !important;\r\n    font-weight: 300 !important;\n}\n.modal .modal-header .close:hover {\r\n    color: #355594 !important;\n}\n.form-control, .form-control-solid {\r\n    background: transparent !important;\r\n    border: 1px solid #A6A6A6 !important;\n}\n.form-control-solid:active {\r\n    background-color: #f3f6f9 !important;\n}\n#quote-productOptions .btn {\r\n    background: transparent !important;\r\n    border: 1px solid #A6A6A6 !important;\r\n    text-align: left !important;\n}\n.custom-select {\r\n    background-color: transparent !important;\r\n    border-color: #a6a6a6 !important;\n}\n@media (min-width: 576px) {\n.modal-dialog {\r\n        max-width: 600px !important;\n}\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_2b655292_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_2b655292_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_2b655292_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_1_id_2b655292_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_1_id_2b655292_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_1_id_2b655292_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue":
/*!*************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Header.vue?vue&type=template&id=5ab8085e&scoped=true */ "./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true");
/* harmony import */ var _Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Header.vue?vue&type=script&lang=js */ "./resources/js/src/view/layout/Header.vue?vue&type=script&lang=js");
/* harmony import */ var _Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css */ "./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css");
/* harmony import */ var _Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css */ "./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "5ab8085e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layout/Header.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/ContactUs.vue":
/*!***************************************************!*\
  !*** ./resources/js/src/view/pages/ContactUs.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ContactUs_vue_vue_type_template_id_2b655292_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=template&id=2b655292&scoped=true */ "./resources/js/src/view/pages/ContactUs.vue?vue&type=template&id=2b655292&scoped=true");
/* harmony import */ var _ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/ContactUs.vue?vue&type=script&lang=js");
/* harmony import */ var _ContactUs_vue_vue_type_style_index_0_id_2b655292_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css */ "./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css");
/* harmony import */ var _ContactUs_vue_vue_type_style_index_1_id_2b655292_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css */ "./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ContactUs_vue_vue_type_template_id_2b655292_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ContactUs_vue_vue_type_template_id_2b655292_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "2b655292",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/ContactUs.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/ContactUs.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/ContactUs.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=template&id=5ab8085e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/ContactUs.vue?vue&type=template&id=2b655292&scoped=true":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/ContactUs.vue?vue&type=template&id=2b655292&scoped=true ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_template_id_2b655292_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_template_id_2b655292_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_template_id_2b655292_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=template&id=2b655292&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=template&id=2b655292&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_2b655292_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=0&id=2b655292&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_1_id_2b655292_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ContactUs.vue?vue&type=style&index=1&id=2b655292&lang=css");


/***/ })

}]);