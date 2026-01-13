"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Solutions_vue"],{

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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layout_Header_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layout/Header.vue */ "./resources/js/src/view/layout/Header.vue");

// import PageLoader from '../components/PageLoader.vue';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {};
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
      to: "/services"
    }
  }, [_vm._v("Services")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom text-white",
    attrs: {
      to: "/solutions"
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=template&id=709b0fce&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=template&id=709b0fce&scoped=true ***!
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
    staticClass: "mt-md-30 mt-sm-25 mt-20",
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    staticStyle: {
      position: "relative"
    },
    attrs: {
      "align-h": "center",
      "align-v": "center"
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
  })]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "mb-md-30 mb-sm-20 mb-10"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Our Solutions")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mt-12",
    attrs: {
      cols: "10",
      sm: "8",
      md: "8",
      lg: "8",
      xl: "8",
      xxl: "8"
    }
  }, [_c("p", {
    staticClass: "aboutUs-section-text"
  }, [_vm._v("At F16s E-Freight Solutions, we are more than just a logistics technology provider—we are forward thinkers who understand the evolving landscape of global trade. Logistics, a traditionally manual industry, is now rapidly transforming, and we’re at the forefront of this shift. By focusing on digital literacy and adaptable solutions, we’re equipping businesses with the knowledge and tools they need to keep up with an increasingly digital world.")])])], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticStyle: {
      position: "relative"
    },
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "ellipse-4"
  }, [_c("img", {
    staticClass: "circle-image-4",
    attrs: {
      src: "/media/custome/circle/ellipse-4.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "ellipse-5"
  }, [_c("img", {
    staticClass: "circle-image-5",
    attrs: {
      src: "/media/custome/circle/ellipse-5.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "ellipse-6"
  }, [_c("img", {
    staticClass: "circle-image-6",
    attrs: {
      src: "/media/custome/circle/ellipse-6.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "mb-md-30 mb-sm-20 mb-10"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Why Digital Literacy Matters in Logistics")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mt-12",
    attrs: {
      cols: "10",
      sm: "8",
      md: "8",
      lg: "8",
      xl: "8",
      xxl: "8"
    }
  }, [_c("p", {
    staticClass: "vision-section-text"
  }, [_vm._v("The logistics industry has been slower than others to adopt digital practices, but as global commerce becomes increasingly complex, digital literacy is essential for maintaining efficiency and competitiveness. Our solutions are designed to bridge the knowledge gap, making it easy for businesses of all sizes to adopt digital practices without overwhelming them with complexity. We believe that every business, regardless of its size, should understand and leverage digital tools to simplify processes, make better decisions, and achieve operational excellence.")])])], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    staticStyle: {
      position: "relative"
    },
    attrs: {
      "align-h": "center",
      "align-v": "center"
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
  })]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "mb-md-30 mb-sm-20 mb-10"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Future-Ready Solutions for Modern Challenges")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mt-12",
    attrs: {
      cols: "10",
      sm: "8",
      md: "8",
      lg: "8",
      xl: "8",
      xxl: "8"
    }
  }, [_c("p", {
    staticClass: "aboutUs-section-text"
  }, [_vm._v("Our commitment to forward-thinking goes beyond current needs—we design solutions that anticipate the future. We know that the logistics industry must evolve alongside technological advances, and we are constantly innovating to create systems that grow with our clients. From scalable solutions to adaptive digital tools, our offerings are crafted to be as dynamic as the industry itself.")])])], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticStyle: {
      position: "relative"
    },
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "ellipse-4"
  }, [_c("img", {
    staticClass: "circle-image-4",
    attrs: {
      src: "/media/custome/circle/ellipse-4.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "ellipse-5"
  }, [_c("img", {
    staticClass: "circle-image-5",
    attrs: {
      src: "/media/custome/circle/ellipse-5.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "ellipse-6"
  }, [_c("img", {
    staticClass: "circle-image-6",
    attrs: {
      src: "/media/custome/circle/ellipse-6.png",
      alt: "circle-image",
      id: ""
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "mb-md-30 mb-sm-20 mb-10"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Building Digital Confidence")]), _vm._v(" "), _c("b-row", {
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mt-12",
    attrs: {
      cols: "10",
      sm: "8",
      md: "8",
      lg: "8",
      xl: "8",
      xxl: "8"
    }
  }, [_c("p", {
    staticClass: "vision-section-text"
  }, [_vm._v("We recognize that digital literacy requires support and a genuine understanding of clients’ specific needs. Our team is dedicated to working closely with each business to guide them through digital adoption, training them in our systems and empowering them to make technology-driven decisions. This approach fosters confidence in the digital tools they use, allowing businesses to make the most of our solutions and position themselves for future growth.\n                                        "), _c("br"), _c("br"), _vm._v("\n                                        At F16s E-Freight Solutions, we are committed to guiding the logistics industry towards a smarter, digitally enabled future, where businesses can thrive and grow with confidence in an increasingly digital landscape.")])])], 1)], 1)])], 1)], 1)], 1)], 1)], 1);
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "\nhtml[data-v-709b0fce], body[data-v-709b0fce], html *[data-v-709b0fce] {\r\n  font-family: 'Roboto', sans-serif !important;\n}\n.main-container[data-v-709b0fce] {\r\n    background: linear-gradient(180deg, #EDF7FF 10%, #FFFFFF 38%);\n}\n.section-title[data-v-709b0fce] {\r\n    font-size: 48px !important;\r\n    font-weight: 500;\r\n    line-height: 54px !important;\r\n    text-align: center;\r\n    color: #355594;\n}\n.vision-section-text[data-v-709b0fce], .aboutUs-section-text[data-v-709b0fce] {\r\n    font-size: 16px;\r\n    font-weight: 400;\r\n    line-height: 30px;\r\n    text-align: center;\r\n    color:#4C4C4C;\n}\n.offer-section-text[data-v-709b0fce] {\r\n    font-size: 13px;\r\n    font-weight: 400;\r\n    line-height: 20px;\r\n    color: #4C4C4C;\r\n    margin: 0;\n}\n.offer-section-btn[data-v-709b0fce] {\r\n    background: linear-gradient(360deg, rgba(119, 128, 177, 0.21) 0%, rgba(34, 50, 138, 0.21) 53.5%);\r\n    border-radius: 30px;\r\n    border: 0px;\r\n    gap: 4px;\r\n    font-size: 16px;\r\n    font-weight: 400;\r\n    padding: 6px;\n}\n.offer-section-btn[data-v-709b0fce]:hover {\r\n    background: #fff !important;\n}\n.offer-section-btn span[data-v-709b0fce] {\r\n    color: #3A3B7B;\r\n    padding: 0px 10px;\r\n    font-weight: 400;\n}\n.btn-icon[data-v-709b0fce] {\r\n    background: #fff;\r\n    border-radius: 30px;\r\n    font-size: 36px !important;\r\n    font-weight: 600;\r\n    padding: 4px;\r\n    color: #355594;\n}\n.choose-us-item[data-v-709b0fce] {\r\n    vertical-align: top;\n}\n.choose-us-item h5[data-v-709b0fce] {\r\n    font-size: 20px;\r\n    font-weight: 700;\r\n    line-height: 25px;\r\n    text-align: center;\r\n    color: #4C4C4C;\r\n    vertical-align: top;\n}\n.choose-us-item p[data-v-709b0fce] {\r\n    font-size: 13px;\r\n    font-weight: 400;\r\n    line-height: 20px;\r\n    text-align: center;\r\n    color: #4C4C4C;\r\n    vertical-align: top;\n}\n.choose-us-item img[data-v-709b0fce] {\r\n    vertical-align: top;\n}\n.custom-card[data-v-709b0fce] {\r\n    border-radius: 50px;\n}\n.custom-card img[data-v-709b0fce] {\r\n    border-radius: 50px;\n}\n.custom-card .card-title[data-v-709b0fce] {\r\n    font-size: 48px;\r\n    font-weight: 500;\r\n    line-height: 35px;\r\n    text-align: center;\r\n    color: #fff;\r\n    margin: 8% 0%;\n}\n.custom-card-text[data-v-709b0fce] {\r\n    margin: 0% 27%;\r\n    font-size: 16px;\r\n    font-weight: 400;\r\n    line-height: 30px;\r\n    text-align: center;\r\n    color: #4C4C4C;\r\n    background: radial-gradient(50% 50% at 50% 50%, #FFFFFF 50%, rgba(255, 255, 255, 0) 100%);\n}\n.choose-us-item[data-v-709b0fce] {\r\n    padding: 1rem;\n}\n.choose-us-item h5[data-v-709b0fce] {\r\n    padding: 1rem 2rem;\n}\n.choose-us-item p[data-v-709b0fce] {\r\n    padding: 1rem 2rem;\n}\n.ellipse-1[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 95%;\r\n    top: -22%;\n}\n.circle-image-1[data-v-709b0fce] {\r\n    width: 60px;\r\n    height: auto;\n}\n.ellipse-2[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 10%;\r\n    top: 35%;\n}\n.circle-image-2[data-v-709b0fce] {\r\n    width: 10px;\r\n    height: auto;\n}\n.ellipse-3[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 5%;\r\n    top: 54%;\n}\n.circle-image-3[data-v-709b0fce] {\r\n    width: 25px;\r\n    height: auto;\n}\n.ellipse-4[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 90%;\r\n    top: 48%;\n}\n.circle-image-4[data-v-709b0fce] {\r\n    width: 27px;\r\n    height: auto;\n}\n.ellipse-5[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 12%;\r\n    top: 42%;\n}\n.circle-image-5[data-v-709b0fce] {\r\n    width: 45px;\r\n    height: auto;\n}\n.ellipse-6[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 7%;\r\n    top: 60%;\n}\n.circle-image-6[data-v-709b0fce] {\r\n    width: 10px;\r\n    height: auto;\n}\n.ellipse-7[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 5%;\r\n    top: 12%;\n}\n.circle-image-7[data-v-709b0fce] {\r\n    width: 60px;\r\n    height: auto;\n}\n.ellipse-8[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 16%;\r\n    top: 17%;\n}\n.circle-image-8[data-v-709b0fce] {\r\n    width: 10px;\r\n    height: auto;\n}\n.ellipse-9[data-v-709b0fce] {\r\n    position: absolute;\r\n    left: 93%;\r\n    top: 19%;\n}\n.circle-image-9[data-v-709b0fce] {\r\n    width: 18px;\r\n    height: auto;\n}\r\n/*  Custom css  */\n@media (max-width: 480px) {\n.card-body[data-v-709b0fce] {\r\n        padding: 1rem !important;\n}\n.custom-card .card-title[data-v-709b0fce] {\r\n        margin: 2% 0% !important;\r\n        font-size: 24px !important;\n}\n.custom-card-text[data-v-709b0fce] {\r\n        margin: 0% 1% !important;\r\n        font-size: 10px !important;\r\n        line-height: 14px !important;\n}\n.card-img-overlay[data-v-709b0fce] {\r\n        padding: 0.7rem !important;\n}\n}\r\n/* For Extra Small Screens (xs - <576px) */\n@media (max-width: 575px) {\n.card-body[data-v-709b0fce] {\r\n        padding: 1rem !important;\n}\n.section-title[data-v-709b0fce] {\r\n        font-size: 32px !important;\r\n        font-weight: 500;\r\n        line-height: 36px !important;\r\n        text-align: center;\r\n        color: #355594;\n}\n.choose-us-item[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item h5[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item p[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.custom-card .card-title[data-v-709b0fce] {\r\n        margin: 4% 0%;\r\n        font-size: 36px;\n}\n.custom-card-text[data-v-709b0fce] {\r\n        margin: 0% 2%;\r\n        font-size: 12px;\r\n        line-height: 18px;\n}\n.ellipse-1[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 86%;\r\n        top: -8%;\n}\n.circle-image-1[data-v-709b0fce] {\r\n        width: 35px;\r\n        height: auto;\n}\n.ellipse-2[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 10%;\r\n        top: 10%;\n}\n.circle-image-2[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-3[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 5%;\r\n        top: 26%;\n}\n.circle-image-3[data-v-709b0fce] {\r\n        width: 20px;\r\n        height: auto;\n}\n.ellipse-4[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 93%;\r\n        top: 27%;\n}\n.circle-image-4[data-v-709b0fce] {\r\n        width: 20px;\r\n        height: auto;\n}\n.ellipse-5[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 4%;\r\n        top: 25%;\n}\n.circle-image-5[data-v-709b0fce] {\r\n        width: 25px;\r\n        height: auto;\n}\n.ellipse-6[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 4%;\r\n        top: 37%;\n}\n.circle-image-6[data-v-709b0fce] {\r\n        width: 8px;\r\n        height: auto;\n}\n.ellipse-7[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 3%;\r\n        top: 2%;\n}\n.circle-image-7[data-v-709b0fce] {\r\n        width: 32px;\r\n        height: auto;\n}\n.ellipse-8[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 17%;\r\n        top: 5%;\n}\n.circle-image-8[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-9[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 93%;\r\n        top: 3%;\n}\n.circle-image-9[data-v-709b0fce] {\r\n        width: 18px;\r\n        height: auto;\n}\n}\r\n\r\n/* For Small Screens (sm - ≥576px) */\n@media (min-width: 576px) and (max-width: 767px) {\n.card-body[data-v-709b0fce] {\r\n        padding: 2rem !important;\n}\n.section-title[data-v-709b0fce] {\r\n        font-size: 36px !important;\r\n        font-weight: 500;\r\n        line-height: 40px !important;\r\n        text-align: center;\r\n        color: #355594;\n}\n.choose-us-item[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item h5[data-v-709b0fce] {\r\n        padding: 1rem 0;\n}\n.choose-us-item p[data-v-709b0fce] {\r\n        padding: 1rem 0;\n}\n.custom-card .card-title[data-v-709b0fce] {\r\n        margin: 5% 0%;\r\n        font-size: 40px;\n}\n.custom-card-text[data-v-709b0fce] {\r\n        margin: 0% 6%;\r\n        font-size: 14px;\r\n        line-height: 22px;\n}\n.ellipse-1[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 78%;\r\n        top: -13%;\n}\n.circle-image-1[data-v-709b0fce] {\r\n        width: 35px;\r\n        height: auto;\n}\n.ellipse-2[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 10%;\r\n        top: 10%;\n}\n.circle-image-2[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-3[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 5%;\r\n        top: 25%;\n}\n.circle-image-3[data-v-709b0fce] {\r\n        width: 20px;\r\n        height: auto;\n}\n.ellipse-4[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 90%;\r\n        top: 36%;\n}\n.circle-image-4[data-v-709b0fce] {\r\n        width: 20px;\r\n        height: auto;\n}\n.ellipse-5[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 11%;\r\n        top: 33%;\n}\n.circle-image-5[data-v-709b0fce] {\r\n        width: 25px;\r\n        height: auto;\n}\n.ellipse-6[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 8%;\r\n        top: 45%;\n}\n.circle-image-6[data-v-709b0fce] {\r\n        width: 8px;\r\n        height: auto;\n}\n.ellipse-7[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 7%;\r\n        top: 4%;\n}\n.circle-image-7[data-v-709b0fce] {\r\n        width: 40px;\r\n        height: auto;\n}\n.ellipse-8[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 22%;\r\n        top: 6%;\n}\n.circle-image-8[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-9[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 93%;\r\n        top:7%;\n}\n.circle-image-9[data-v-709b0fce] {\r\n        width: 18px;\r\n        height: auto;\n}\n}\r\n\r\n/* For Medium Screens (md - ≥768px) */\n@media (min-width: 768px) and (max-width: 991px) {\n.card-body[data-v-709b0fce] {\r\n        padding: 1rem !important;\n}\n.section-title[data-v-709b0fce] {\r\n        font-size: 40px !important;\r\n        font-weight: 500;\r\n        line-height: 44px !important;\r\n        text-align: center;\r\n        color: #355594;\n}\n.choose-us-item[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item h5[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item p[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.custom-card .card-title[data-v-709b0fce] {\r\n        margin: 5% 0%;\r\n        font-size: 44px;\n}\n.custom-card-text[data-v-709b0fce] {\r\n        margin: 0% 15%;\n}\n.ellipse-1[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 88%;\r\n        top: -19%;\n}\n.circle-image-1[data-v-709b0fce] {\r\n        width: 48px;\r\n        height: auto;\n}\n.ellipse-2[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 10%;\r\n        top: 12%;\n}\n.circle-image-2[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-3[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 5%;\r\n        top: 31%;\n}\n.circle-image-3[data-v-709b0fce] {\r\n        width: 25px;\r\n        height: auto;\n}\n.ellipse-4[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 92%;\r\n        top: 43%;\n}\n.circle-image-4[data-v-709b0fce] {\r\n        width: 27px;\r\n        height: auto;\n}\n.ellipse-5[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 10%;\r\n        top: 42%;\n}\n.circle-image-5[data-v-709b0fce] {\r\n        width: 40px;\r\n        height: auto;\n}\n.ellipse-6[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 7%;\r\n        top: 58%;\n}\n.circle-image-6[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-7[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 5%;\r\n        top: 10%;\n}\n.circle-image-7[data-v-709b0fce] {\r\n        width: 45px;\r\n        height: auto;\n}\n.ellipse-8[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 18%;\r\n        top: 14%;\n}\n.circle-image-8[data-v-709b0fce] {\r\n        width: 10px;\r\n        height: auto;\n}\n.ellipse-9[data-v-709b0fce] {\r\n        position: absolute;\r\n        left: 93%;\r\n        top: 15%;\n}\n.circle-image-9[data-v-709b0fce] {\r\n        width: 18px;\r\n        height: auto;\n}\n}\r\n\r\n/* For Large Screens (lg - ≥992px) */\n@media (min-width: 992px) and (max-width: 1199px) {\n.section-title[data-v-709b0fce] {\r\n        font-size: 44px !important;\r\n        font-weight: 500;\r\n        line-height: 48px !important;\r\n        text-align: center;\r\n        color: #355594;\n}\n.choose-us-item[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item h5[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.choose-us-item p[data-v-709b0fce] {\r\n        padding: 1rem;\n}\n.custom-card .card-title[data-v-709b0fce] {\r\n        margin: 10% 0%;\n}\n.custom-card-text[data-v-709b0fce] {\r\n        margin: 0% 12%;\n}\n}\r\n\r\n/* For Extra Large Screens (xl - ≥1200px) */\n@media (min-width: 1200px) {\n}\r\n", ""]);
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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_style_index_0_id_709b0fce_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_style_index_0_id_709b0fce_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_style_index_0_id_709b0fce_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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

/***/ "./resources/js/src/view/pages/Solutions.vue":
/*!***************************************************!*\
  !*** ./resources/js/src/view/pages/Solutions.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Solutions_vue_vue_type_template_id_709b0fce_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Solutions.vue?vue&type=template&id=709b0fce&scoped=true */ "./resources/js/src/view/pages/Solutions.vue?vue&type=template&id=709b0fce&scoped=true");
/* harmony import */ var _Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Solutions.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Solutions.vue?vue&type=script&lang=js");
/* harmony import */ var _Solutions_vue_vue_type_style_index_0_id_709b0fce_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css */ "./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Solutions_vue_vue_type_template_id_709b0fce_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Solutions_vue_vue_type_template_id_709b0fce_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "709b0fce",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/Solutions.vue"
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

/***/ "./resources/js/src/view/pages/Solutions.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/Solutions.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Solutions.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

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

/***/ "./resources/js/src/view/pages/Solutions.vue?vue&type=template&id=709b0fce&scoped=true":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Solutions.vue?vue&type=template&id=709b0fce&scoped=true ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_template_id_709b0fce_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_template_id_709b0fce_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_template_id_709b0fce_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Solutions.vue?vue&type=template&id=709b0fce&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=template&id=709b0fce&scoped=true");


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

/***/ "./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_style_index_0_id_709b0fce_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Solutions.vue?vue&type=style&index=0&id=709b0fce&scoped=true&lang=css");


/***/ })

}]);