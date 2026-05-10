"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_layout_MainLayout_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Footer"
});

/***/ }),

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
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Header",
  data: function data() {
    return {
      show_login_modal: false,
      otp_verification_modal: false,
      user_form: {
        email: "",
        password: "",
        otp: ""
      },
      showPass: true,
      loading: false,
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
      var _this = this;
      this.loading = true;
      var _this$user_form = this.user_form,
        email = _this$user_form.email,
        password = _this$user_form.password;
      this.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__.LOGIN, {
        email: email,
        password: password
      }).then(function () {
        _this.show_login_modal = false;
        // Success logic if needed
      })["catch"](function () {
        // Error is handled via mapState errors
      })["finally"](function () {
        _this.loading = false;
      });
    },
    logout: function logout() {
      this.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_0__.LOGOUT).then(function () {
        return window.location.href = "/";
      });
    }
  },
  computed: _objectSpread(_objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapState)({
    errors: function errors(state) {
      return state.auth.errors;
    }
  })), (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(["isAuthenticated", "currentUser"])), {}, {
    logoSrc: function logoSrc() {
      // Use f16s-logo.svg as requested
      return "/media/custome/f16s-logo.svg";
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _view_layout_Header_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layout/Header.vue */ "./resources/js/src/view/layout/Header.vue");
/* harmony import */ var _view_layout_Footer_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/layout/Footer.vue */ "./resources/js/src/view/layout/Footer.vue");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MainLayout",
  components: {
    Header: _view_layout_Header_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    Footer: _view_layout_Footer_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  methods: {
    scrollToTop: function scrollToTop() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["isAuthenticated", "currentUser"]))
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("footer", {
    staticClass: "footer-wrapper pt-15 pb-10"
  }, [_c("b-container", [_c("b-row", {
    staticClass: "mb-10"
  }, [_c("b-col", {
    staticClass: "mb-12 mb-lg-0 text-center text-lg-left",
    attrs: {
      lg: "4",
      md: "12"
    }
  }, [_c("router-link", {
    attrs: {
      to: "/"
    }
  }, [_c("img", {
    staticClass: "footer-logo mb-6",
    attrs: {
      src: "/media/custome/blue-logo.svg",
      alt: "f16s logo"
    }
  })]), _vm._v(" "), _c("p", {
    staticClass: "footer-desc mx-auto mx-lg-0"
  }, [_vm._v("\n                    Providing smart data solutions and seamless freight documentation for the global logistics industry.\n                ")])], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      lg: "8",
      md: "12"
    }
  }, [_c("b-row", {
    staticClass: "text-center text-md-left"
  }, [_c("b-col", {
    staticClass: "mb-10 mb-md-0",
    attrs: {
      md: "4",
      cols: "6"
    }
  }, [_c("h5", {
    staticClass: "footer-heading"
  }, [_vm._v("Company")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled footer-links"
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/about-us"
    }
  }, [_vm._v("About Us")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/#faq-section"
    }
  }, [_vm._v("FAQs")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/blogs-and-news"
    }
  }, [_vm._v("News & Insights")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Contact")])], 1)])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8 mb-md-0",
    attrs: {
      md: "4",
      cols: "6"
    }
  }, [_c("h5", {
    staticClass: "footer-heading"
  }, [_vm._v("Services")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled footer-links"
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/product-description"
    }
  }, [_vm._v("Focus Air")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/product-description"
    }
  }, [_vm._v("Focus Sea")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/product-description"
    }
  }, [_vm._v("Focus Road")])], 1)])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-0",
    attrs: {
      md: "4",
      cols: "12"
    }
  }, [_c("h5", {
    staticClass: "footer-heading"
  }, [_vm._v("Support")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled footer-links"
  }, [_c("li", [_c("router-link", {
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Help Center")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/terms-conditions"
    }
  }, [_vm._v("Terms of Service")])], 1), _vm._v(" "), _c("li", [_c("router-link", {
    attrs: {
      to: "/privacy-policy"
    }
  }, [_vm._v("Privacy Policy")])], 1)])])], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "footer-bottom pt-10 d-flex flex-column flex-md-row justify-content-between align-items-center"
  }, [_c("div", {
    staticClass: "copyright mb-4 mb-md-0"
  }, [_vm._v("\n                © 2026 F16s E-Freight Solutions. All rights reserved.\n            ")]), _vm._v(" "), _c("div", {
    staticClass: "social-links d-flex gap-4"
  }, [_c("a", {
    attrs: {
      href: "#"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "youtube",
      "font-scale": "1.5"
    }
  })], 1), _vm._v(" "), _c("a", {
    attrs: {
      href: "#"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "linkedin",
      "font-scale": "1.5"
    }
  })], 1), _vm._v(" "), _c("a", {
    attrs: {
      href: "#"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "facebook",
      "font-scale": "1.5"
    }
  })], 1)])])], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "wrap"
  }, [_c("b-navbar", {
    attrs: {
      toggleable: "lg"
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
    staticClass: "d-flex flex-row align-items-center content-gap d-lg-none ml-auto"
  }, [_c("b-nav-item-dropdown", {
    attrs: {
      right: "",
      "no-caret": ""
    },
    scopedSlots: _vm._u([{
      key: "button-content",
      fn: function fn() {
        return [_c("div", {
          staticClass: "avatar-wrapper"
        }, [_c("img", {
          attrs: {
            src: _vm.avatarLogoSrc,
            alt: "User profile",
            id: "avatar-logo"
          }
        })])];
      },
      proxy: true
    }], null, false, 267970355)
  }, [_vm._v(" "), _c("b-dropdown-item", {
    attrs: {
      disabled: ""
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "geo-alt",
      variant: "primary"
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px",
      color: "#355594"
    }
  }, [_vm._v("Origin: "), _c("strong", [_vm._v(_vm._s(_vm.currentUser.origin_airport_code))])])], 1)]), _vm._v(" "), _c("b-dropdown-divider"), _vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.logout();
      }
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "box-arrow-right",
      variant: "danger"
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px"
    }
  }, [_vm._v("Sign out")])], 1)])], 1)], 1) : _vm._e(), _vm._v(" "), _c("b-navbar-toggle", {
    attrs: {
      target: "nav-collapse",
      "aria-label": "Toggle navigation menu"
    }
  }), _vm._v(" "), _c("b-collapse", {
    attrs: {
      id: "nav-collapse",
      "is-nav": ""
    }
  }, [_c("div", {
    staticClass: "nav-header-menu"
  }, [_c("b-navbar-nav", {
    staticClass: "nav-menu text-center"
  }, [_c("b-nav-item", {
    staticClass: "nav-link-custom",
    attrs: {
      to: "/about-us"
    }
  }, [_vm._v("About Us")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom",
    attrs: {
      to: "/services"
    }
  }, [_vm._v("Services")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom",
    attrs: {
      to: "/solutions"
    }
  }, [_vm._v("Solutions")]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom",
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Contact Us")]), _vm._v(" "), _c("div", {
    staticClass: "head-btn d-lg-none"
  }, [!_vm.isAuthenticated ? _c("b-nav-item", {
    staticClass: "nav-link-custom d-lg-none"
  }, [_c("button", {
    staticClass: "sign-in-btn",
    attrs: {
      "aria-label": "Sign in to your account"
    },
    on: {
      click: function click($event) {
        return _vm.firstPopUp("login_signin");
      }
    }
  }, [_vm._v("\n                                    Sign in\n                                ")])]) : _vm._e(), _vm._v(" "), !_vm.isAuthenticated ? _c("b-nav-item", {
    staticClass: "nav-link-custom d-lg-none",
    attrs: {
      to: "/product-description"
    }
  }, [_c("button", {
    staticClass: "whats-new-btn"
  }, [_vm._v("\n                                    Learn more\n                                ")])]) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _vm.isAuthenticated ? _c("div", {
    staticClass: "nav-header-right"
  }, [_c("b-navbar-nav", {
    staticClass: "align-items-center content-gap d-none d-lg-flex"
  }, [_c("b-nav-item-dropdown", {
    attrs: {
      right: "",
      "no-caret": ""
    },
    scopedSlots: _vm._u([{
      key: "button-content",
      fn: function fn() {
        return [_c("div", {
          staticClass: "avatar-wrapper"
        }, [_c("img", {
          attrs: {
            src: _vm.avatarLogoSrc,
            alt: "User profile",
            id: "avatar-logo"
          }
        })])];
      },
      proxy: true
    }], null, false, 267970355)
  }, [_vm._v(" "), _c("b-dropdown-item", {
    attrs: {
      disabled: ""
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "geo-alt",
      variant: "primary"
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px",
      color: "#355594"
    }
  }, [_vm._v("Origin: "), _c("strong", [_vm._v(_vm._s(_vm.currentUser.origin_airport_code))])])], 1)]), _vm._v(" "), _c("b-dropdown-divider"), _vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.logout();
      }
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "box-arrow-right",
      variant: "danger"
    }
  }), _vm._v(" "), _c("span", {
    staticStyle: {
      "font-size": "12px"
    }
  }, [_vm._v("Sign out")])], 1)])], 1)], 1)], 1) : _c("div", {
    staticClass: "nav-header-right"
  }, [_c("b-navbar-nav", {
    staticClass: "align-items-center content-gap d-none d-lg-flex"
  }, [_c("b-nav-item", {
    staticClass: "nav-link-custom"
  }, [_c("button", {
    staticClass: "sign-in-btn",
    attrs: {
      "aria-label": "Sign in to your account"
    },
    on: {
      click: function click($event) {
        return _vm.firstPopUp("login_signin");
      }
    }
  }, [_vm._v("\n                                Sign In\n                            ")])]), _vm._v(" "), _c("b-nav-item", {
    staticClass: "nav-link-custom",
    attrs: {
      to: "/product-description"
    }
  }, [_c("button", {
    staticClass: "whats-new-btn"
  }, [_vm._v("\n                                Learn More\n                            ")])])], 1)], 1)]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "login-modal",
      "hide-header": true,
      "hide-footer": true,
      centered: "",
      size: "xl",
      "modal-class": "ultra-premium-modal"
    },
    model: {
      value: _vm.show_login_modal,
      callback: function callback($$v) {
        _vm.show_login_modal = $$v;
      },
      expression: "show_login_modal"
    }
  }, [_c("div", {
    staticClass: "modal-split-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: function click($event) {
        _vm.show_login_modal = false;
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-left-pane login-pane"
  }, [_c("div", {
    staticClass: "pane-content"
  }, [_c("div", {
    staticClass: "pane-icon-wrapper mb-8"
  }, [_c("b-icon", {
    attrs: {
      icon: "shield-lock",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h2", {
    staticClass: "pane-title"
  }, [_vm._v("Welcome Back")]), _vm._v(" "), _c("p", {
    staticClass: "pane-subtitle"
  }, [_vm._v("Securely access your F16s dashboard to manage your freight operations, AWBs, and EDI connectivity.")]), _vm._v(" "), _c("div", {
    staticClass: "pane-footer mt-auto"
  }, [_c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "lightning"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Lightning Fast Processing")])], 1), _vm._v(" "), _c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "globe2"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Global Airline Network")])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "pane-decoration"
  })]), _vm._v(" "), _c("div", {
    staticClass: "modal-right-pane"
  }, [_c("div", {
    staticClass: "form-scroll-container"
  }, [_c("form", {
    staticClass: "ultra-form",
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.login.apply(null, arguments);
      }
    }
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v("Sign In")]), _vm._v(" "), _vm.errors && typeof _vm.errors === "string" ? _c("div", {
    staticClass: "error-alert mb-5"
  }, [_vm.errors === "Unauthorized" ? _c("span", [_vm._v("Invalid email or password")]) : _vm.errors === "Blocked" ? _c("span", [_vm._v("Account blocked. Contact admin.")]) : _vm.errors === "Daily_Limit" ? _c("span", [_vm._v("Daily login limit exceeded.")]) : _vm.errors === "Expired" ? _c("span", [_vm._v("Plan expired. Please renew.")]) : _c("span", [_vm._v(_vm._s(_vm.errors))])]) : _vm._e(), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.user_form.email,
      expression: "user_form.email"
    }],
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    },
    domProps: {
      value: _vm.user_form.email
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.user_form, "email", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("User ID / Email")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [(_vm.showPass ? "password" : "text") === "checkbox" ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.user_form.password,
      expression: "user_form.password"
    }],
    staticClass: "floating-input pr-5",
    attrs: {
      autocomplete: "off",
      placeholder: " ",
      required: "",
      type: "checkbox"
    },
    domProps: {
      checked: Array.isArray(_vm.user_form.password) ? _vm._i(_vm.user_form.password, null) > -1 : _vm.user_form.password
    },
    on: {
      change: function change($event) {
        var $$a = _vm.user_form.password,
          $$el = $event.target,
          $$c = $$el.checked ? true : false;
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && _vm.$set(_vm.user_form, "password", $$a.concat([$$v]));
          } else {
            $$i > -1 && _vm.$set(_vm.user_form, "password", $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
          }
        } else {
          _vm.$set(_vm.user_form, "password", $$c);
        }
      }
    }
  }) : (_vm.showPass ? "password" : "text") === "radio" ? _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.user_form.password,
      expression: "user_form.password"
    }],
    staticClass: "floating-input pr-5",
    attrs: {
      autocomplete: "off",
      placeholder: " ",
      required: "",
      type: "radio"
    },
    domProps: {
      checked: _vm._q(_vm.user_form.password, null)
    },
    on: {
      change: function change($event) {
        return _vm.$set(_vm.user_form, "password", null);
      }
    }
  }) : _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.user_form.password,
      expression: "user_form.password"
    }],
    staticClass: "floating-input pr-5",
    attrs: {
      autocomplete: "off",
      placeholder: " ",
      required: "",
      type: _vm.showPass ? "password" : "text"
    },
    domProps: {
      value: _vm.user_form.password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.user_form, "password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Password")]), _vm._v(" "), _c("button", {
    staticClass: "pass-toggle",
    attrs: {
      type: "button"
    },
    on: {
      click: function click($event) {
        _vm.showPass = !_vm.showPass;
      }
    }
  }, [_vm._v("\n                                                " + _vm._s(_vm.showPass ? "Show" : "Hide") + "\n                                            ")])]), _vm._v(" "), _c("div", {
    staticClass: "text-right mt-2",
    staticStyle: {
      "text-align": "right",
      width: "100%"
    }
  }, [_c("a", {
    staticClass: "forgot-pwd",
    attrs: {
      href: "#"
    }
  }, [_vm._v("Forgot Password?")])])])], 1), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-6 d-flex flex-column align-items-center w-100"
  }, [_c("button", {
    staticClass: "ultra-submit-btn",
    attrs: {
      type: "submit",
      disabled: _vm.loading
    }
  }, [!_vm.loading ? _c("span", [_vm._v("Sign In")]) : _c("b-spinner", {
    attrs: {
      small: "",
      label: "Loading..."
    }
  }), _vm._v(" "), !_vm.loading ? _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  }) : _vm._e()], 1), _vm._v(" "), _c("p", {
    staticClass: "form-note mt-4"
  }, [_vm._v("\n                                        Need help? "), _c("a", {
    staticClass: "text-primary font-weight-bold",
    attrs: {
      href: "#"
    }
  }, [_vm._v("Contact Support")])])])], 1)])])])]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "otp-modal",
      "hide-header": true,
      "hide-footer": true,
      centered: "",
      size: "xl",
      "modal-class": "ultra-premium-modal"
    },
    model: {
      value: _vm.otp_verification_modal,
      callback: function callback($$v) {
        _vm.otp_verification_modal = $$v;
      },
      expression: "otp_verification_modal"
    }
  }, [_c("div", {
    staticClass: "modal-split-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: function click($event) {
        _vm.otp_verification_modal = false;
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-left-pane otp-pane"
  }, [_c("div", {
    staticClass: "pane-content"
  }, [_c("div", {
    staticClass: "pane-icon-wrapper mb-8"
  }, [_c("b-icon", {
    attrs: {
      icon: "shield-check",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h2", {
    staticClass: "pane-title"
  }, [_vm._v("Verify Identity")]), _vm._v(" "), _c("p", {
    staticClass: "pane-subtitle"
  }, [_vm._v("For your security, we've sent a one-time verification code to your registered email address.")]), _vm._v(" "), _c("div", {
    staticClass: "pane-footer mt-auto"
  }, [_c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "lock"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Bank-grade Security")])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "pane-decoration"
  })]), _vm._v(" "), _c("div", {
    staticClass: "modal-right-pane"
  }, [_c("div", {
    staticClass: "form-scroll-container"
  }, [_c("form", {
    staticClass: "ultra-form",
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.login.apply(null, arguments);
      }
    }
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v("Enter OTP")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.user_form.otp,
      expression: "user_form.otp"
    }],
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    },
    domProps: {
      value: _vm.user_form.otp
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.user_form, "otp", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Verification Code (E.g: 801801)")])])])], 1), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-6 d-flex flex-column align-items-center w-100"
  }, [_c("button", {
    staticClass: "ultra-submit-btn",
    attrs: {
      type: "submit",
      disabled: _vm.loading
    }
  }, [!_vm.loading ? _c("span", [_vm._v("Verify & Proceed")]) : _c("b-spinner", {
    attrs: {
      small: "",
      label: "Verifying..."
    }
  }), _vm._v(" "), !_vm.loading ? _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  }) : _vm._e()], 1), _vm._v(" "), _c("p", {
    staticClass: "form-note mt-4"
  }, [_vm._v("\n                                        Problem receiving OTP? "), _c("a", {
    staticClass: "text-primary font-weight-bold",
    attrs: {
      href: "#"
    }
  }, [_vm._v("Resend Email")])])])], 1)])])])])], 1)])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "layout-wrapper"
  }, [_vm.isAuthenticated ? _c("div", [_c("Header"), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade-in-up",
      mode: "out-in"
    },
    on: {
      "after-enter": _vm.scrollToTop
    }
  }, [_c("router-view")], 1), _vm._v(" "), _c("Footer")], 1) : _c("div", [_c("Header"), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade-in-up",
      mode: "out-in"
    },
    on: {
      "after-enter": _vm.scrollToTop
    }
  }, [_c("router-view")], 1), _vm._v(" "), _c("Footer")], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.footer-wrapper[data-v-9d1cd042] {\n    background: linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%);\n    border-top: 1px solid #E6F0FF;\n    font-family: 'Inter', sans-serif;\n}\n.footer-logo[data-v-9d1cd042] {\n    height: 60px;\n}\n.footer-desc[data-v-9d1cd042] {\n    color: #5A6B8A;\n    font-size: 15px;\n    line-height: 1.6;\n    max-width: 300px;\n}\n.footer-heading[data-v-9d1cd042] {\n    font-size: 16px;\n    font-weight: 700;\n    color: #355594;\n    margin-bottom: 25px;\n}\n.footer-links li[data-v-9d1cd042] {\n    margin-bottom: 12px;\n}\n.footer-links a[data-v-9d1cd042] {\n    color: #5A6B8A;\n    text-decoration: none;\n    font-size: 15px;\n    transition: color 0.3s ease;\n}\n.footer-links a[data-v-9d1cd042]:hover {\n    color: #355594;\n}\n.footer-bottom[data-v-9d1cd042] {\n    border-top: 1px solid #E6F0FF;\n    color: #818498;\n    font-size: 14px;\n    padding-top: 1.5rem;\n}\n@media (max-width: 991px) {\n.footer-wrapper[data-v-9d1cd042] {\n        padding-top: 4rem;\n        padding-bottom: 3rem;\n}\n.footer-logo[data-v-9d1cd042] {\n        height: 50px;\n}\n.footer-heading[data-v-9d1cd042] {\n        margin-bottom: 15px;\n}\n}\n@media (max-width: 767px) {\n.footer-links li[data-v-9d1cd042] {\n        margin-bottom: 8px;\n}\n}\n.social-links a[data-v-9d1cd042] {\n    color: #355594;\n    transition: transform 0.3s ease;\n}\n.social-links a[data-v-9d1cd042]:hover {\n    transform: translateY(-3px);\n    color: #2a4476;\n}\n.gap-4[data-v-9d1cd042] {\n    gap: 1.5rem;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\nhtml[data-v-5ab8085e],\nbody *[data-v-5ab8085e] {\n    font-family: \"Roboto\", sans-serif !important;\n}\n.navbar-header-logo[data-v-5ab8085e] {\n    flex: 0 0 auto;\n    max-width: 250px;\n}\n.nav-header-menu[data-v-5ab8085e] {\n    flex: 1;\n    display: flex;\n    justify-content: center;\n}\n@media (min-width: 992px) {\n.navbar .container[data-v-5ab8085e] {\n        position: relative;\n}\n.nav-header-menu[data-v-5ab8085e] {\n        position: absolute;\n        left: 50%;\n        top: 50%;\n        transform: translate(-50%, -50%);\n        margin: 0 !important;\n        z-index: 5;\n}\n}\n.nav-header-right[data-v-5ab8085e] {\n    flex: 0 0 auto;\n    display: flex;\n    justify-content: flex-end;\n    margin-left: auto;\n}\n.navbar[data-v-5ab8085e] {\n  height: auto;\n  padding: 30px 40px 40px 40px !important;\n  margin-bottom: 20px;\n}\n.nav-menu[data-v-5ab8085e] {\n    padding: 8px 30px;\n    gap: 30px;\n    border-radius: 50px;\n    background: rgba(255, 255, 255, 0.4);\n    backdrop-filter: blur(20px);\n    border: 1px solid rgba(255, 255, 255, 0.5);\n    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);\n}\n.nav-link[data-v-5ab8085e] {\n    padding: 0px !important;\n    color: #355594 !important;\n}\n.content-gap[data-v-5ab8085e] {\n    gap: 18px;\n}\n.nav-link-custom[data-v-5ab8085e]:hover {\n    color: #2a4476 !important;\n}\n.nav-link-custom[data-v-5ab8085e] {\n    font-size: 15px;\n    line-height: 30px;\n    font-weight: 500;\n    font-family: \"Inter\", sans-serif !important;\n}\na.menu-link[data-v-5ab8085e] {\n    text-decoration: none !important;\n    color: black;\n}\n.menu-text[data-v-5ab8085e] {\n    color: White;\n}\n#main-logo[data-v-5ab8085e] {\n    height: 60px;\n    width: auto;\n    transition: transform 0.3s ease;\n}\n#main-logo[data-v-5ab8085e]:hover {\n    transform: scale(1.05);\n}\n#avatar-logo[data-v-5ab8085e] {\n    width: 35px;\n    height: auto;\n    border-radius: 50%;\n    border: 2px solid rgba(53, 85, 148, 0.1);\n}\n.nav-actions[data-v-5ab8085e] {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n}\n.action-btn[data-v-5ab8085e] {\n    background: rgba(53, 85, 148, 0.05);\n    border: none;\n    width: 38px;\n    height: 38px;\n    border-radius: 12px;\n    color: #355594;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    position: relative;\n    transition: all 0.2s ease;\n}\n.action-btn[data-v-5ab8085e]:hover {\n    background: rgba(53, 85, 148, 0.1);\n    color: #1e3a6e;\n    transform: translateY(-1px);\n}\n.pulse-indicator[data-v-5ab8085e] {\n    position: absolute;\n    top: 10px;\n    right: 10px;\n    width: 8px;\n    height: 8px;\n    background: #ef4444;\n    border-radius: 50%;\n    border: 2px solid white;\n}\n.airport-badge[data-v-5ab8085e] {\n    background: rgba(53, 85, 148, 0.08);\n    color: #355594;\n    padding: 6px 14px;\n    border-radius: 999px;\n    font-weight: 700;\n    font-size: 13px;\n    letter-spacing: 0.05em;\n    border: 1px solid rgba(53, 85, 148, 0.1);\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n}\n.show_pass[data-v-5ab8085e] {\n    position: absolute;\n    left: 87%;\n}\n.sign-in-btn[data-v-5ab8085e] {\n    background: transparent !important;\n    border: 1px solid #355594;\n    color: #355594 !important;\n    border-radius: 50px;\n    padding: 10px 25px;\n    font-family: \"Inter\", sans-serif;\n    font-weight: 500;\n    font-size: 14px;\n    line-height: 20px;\n}\n.sign-in-btn[data-v-5ab8085e]:hover {\n    background: rgba(53, 85, 148, 0.05) !important;\n}\n.whats-new-btn[data-v-5ab8085e] {\n  background: #355594 !important;\n  border: none;\n  color: white !important;\n  border-radius: 50px;\n  padding: 10px 25px;\n  font-family: 'Inter', sans-serif;\n  font-weight: 500;\n  font-size: 14px;\n  line-height: 20px;\n  transition: all 0.3s ease;\n}\n.whats-new-btn[data-v-5ab8085e]:hover {\n  background: #2a4476 !important;\n  transform: translateY(-2px);\n  box-shadow: 0 5px 15px rgba(53, 85, 148, 0.3);\n}\n.navbar[data-v-5ab8085e], .wrap[data-v-5ab8085e] {\n    background: transparent !important;\n}\n.form-control[data-v-5ab8085e] {\n    background-color: #f3f6f900 !important;\n}\n.btn-color[data-v-5ab8085e] {\n    background: #0000;\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 25px;\n    text-align: center;\n    color: #a6a6a6;\n    border: 1px solid #a6a6a6;\n    backdrop-filter: blur(90px);\n    border-radius: 30px;\n    padding: 10px 40px;\n}\n.bottom-text[data-v-5ab8085e] {\n    color: #4c4c4c;\n    font-size: 12px;\n    font-weight: 400;\n    line-height: 15px;\n    text-align: center;\n}\n.contact-support[data-v-5ab8085e] {\n    color: #355594;\n    font-size: 12px;\n    font-weight: 500;\n    line-height: 15px;\n    text-align: center;\n    text-decoration-line: underline;\n    cursor: pointer;\n}\n/* Split Layout */\n.modal-split-layout[data-v-5ab8085e] { display: flex; flex-direction: row; min-height: 500px; position: relative;\n}\n.ultra-close-btn[data-v-5ab8085e] { position: absolute; top: 25px; right: 25px; width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.05); border: none; color: #5A6B8A; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer; z-index: 50; transition: all 0.3s ease;\n}\n.ultra-close-btn[data-v-5ab8085e]:hover { background: #ef4444; color: white; transform: rotate(90deg);\n}\n.modal-left-pane[data-v-5ab8085e] { flex: 0 0 40%; padding: 4rem 3.5rem; position: relative; overflow: hidden; color: white; display: flex; flex-direction: column;\n}\n.login-pane[data-v-5ab8085e] { background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n}\n.otp-pane[data-v-5ab8085e] { background: linear-gradient(135deg, #10b981 0%, #059669 100%);\n}\n.pane-content[data-v-5ab8085e] { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column;\n}\n.pane-icon-wrapper[data-v-5ab8085e] { width: 80px; height: 80px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 1px solid rgba(255,255,255,0.2);\n}\n.pane-title[data-v-5ab8085e] { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.5px; line-height: 1.1;\n}\n.pane-subtitle[data-v-5ab8085e] { font-size: 1.1rem; line-height: 1.7; opacity: 0.85;\n}\n.pane-feature[data-v-5ab8085e] { display: flex; align-items: center; margin-bottom: 1rem; font-size: 1rem; font-weight: 500;\n}\n.pane-decoration[data-v-5ab8085e] { position: absolute; bottom: -150px; left: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; z-index: 1;\n}\n.modal-right-pane[data-v-5ab8085e] { flex: 0 0 60%; background: white; position: relative;\n}\n.form-scroll-container[data-v-5ab8085e] { height: 100%; overflow-y: auto; padding: 4rem;\n}\n.form-section-title[data-v-5ab8085e] { font-size: 1.8rem; font-weight: 700; color: #1e3a6e; letter-spacing: -0.5px; text-align: center;\n}\n.floating-input-group[data-v-5ab8085e] { position: relative; width: 100%;\n}\n.floating-input[data-v-5ab8085e] { width: 100%; background: #f8fafc; border: 1px solid transparent; border-bottom: 2px solid #e2e8f0; border-radius: 12px 12px 0 0; padding: 24px 16px 8px 16px; font-size: 1rem; color: #1e3a6e; font-weight: 500; transition: all 0.3s ease; font-family: 'Inter', sans-serif;\n}\n.floating-input[data-v-5ab8085e]:focus { background: #f0f7ff; border-bottom-color: #355594; outline: none;\n}\n.floating-label[data-v-5ab8085e] { position: absolute; left: 16px; top: 16px; font-size: 1rem; color: #64748b; pointer-events: none; transition: all 0.2s ease; font-weight: 500;\n}\n.floating-input:not(:-moz-placeholder) ~ .floating-label[data-v-5ab8085e] { top: 6px; font-size: 0.75rem; color: #355594; font-weight: 600;\n}\n.floating-input:focus ~ .floating-label[data-v-5ab8085e], .floating-input:not(:placeholder-shown) ~ .floating-label[data-v-5ab8085e] { top: 6px; font-size: 0.75rem; color: #355594; font-weight: 600;\n}\n.pass-toggle[data-v-5ab8085e] { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #355594; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; cursor: pointer;\n}\n.forgot-pwd[data-v-5ab8085e] { font-size: 0.85rem; color: #355594; font-weight: 600; text-decoration: none;\n}\n.ultra-submit-btn[data-v-5ab8085e] { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none;\n}\n.ultra-submit-btn[data-v-5ab8085e]:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35);\n}\n.ultra-submit-btn span[data-v-5ab8085e] { color: white; font-weight: 500; margin-right: 14px;\n}\n.ultra-submit-btn .btn-icon[data-v-5ab8085e] { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important;\n}\n.form-note[data-v-5ab8085e] { font-size: 0.9rem; color: #64748b;\n}\n.error-alert[data-v-5ab8085e] { background: rgba(239, 68, 68, 0.08); color: #dc2626; padding: 12px; border-radius: 8px; font-size: 0.9rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.15); font-weight: 500;\n}\n@media (max-width: 991px) {\n.modal-split-layout[data-v-5ab8085e] { flex-direction: column; min-height: auto;\n}\n.modal-left-pane[data-v-5ab8085e] { flex: 0 0 auto; padding: 3rem 2rem;\n}\n.pane-title[data-v-5ab8085e] { font-size: 1.8rem;\n}\n.pane-icon-wrapper[data-v-5ab8085e] { width: 60px; height: 60px; margin-bottom: 1.5rem !important;\n}\n.modal-right-pane[data-v-5ab8085e] { flex: 0 0 auto;\n}\n.form-scroll-container[data-v-5ab8085e] { padding: 3rem 2rem; height: auto; max-height: 60vh;\n}\n.ultra-close-btn[data-v-5ab8085e] { top: 15px; right: 15px; background: rgba(255,255,255,0.2); color: white;\n}\n}\n@media (max-width: 1250px) {\n.nav-menu[data-v-5ab8085e] {\n        gap: 20px;\n        padding: 8px 25px;\n}\n}\n@media (max-width: 1199px) {\n.navbar[data-v-5ab8085e] {\n        padding: 20px 30px !important;\n}\n#main-logo[data-v-5ab8085e] {\n        height: 52px;\n}\n.nav-menu[data-v-5ab8085e] {\n        gap: 12px;\n        padding: 6px 20px;\n}\n.nav-link-custom[data-v-5ab8085e] {\n        font-size: 14px;\n}\n.sign-in-btn[data-v-5ab8085e], .whats-new-btn[data-v-5ab8085e] {\n        padding: 8px 20px;\n        font-size: 13px;\n}\n}\n@media (max-width: 1080px) {\n.navbar[data-v-5ab8085e] {\n        padding: 15px 20px !important;\n}\n#main-logo[data-v-5ab8085e] {\n        height: 48px;\n}\n.nav-menu[data-v-5ab8085e] {\n        gap: 8px;\n        padding: 6px 15px;\n}\n.content-gap[data-v-5ab8085e] {\n        gap: 12px;\n}\n}\n@media (max-width: 991px) {\n.navbar[data-v-5ab8085e] {\n        padding: 20px 20px !important;\n}\n.nav-header-menu[data-v-5ab8085e] {\n        width: 100%;\n        margin-top: 20px;\n        position: relative !important;\n        left: 0 !important;\n        top: 0 !important;\n        transform: none !important;\n}\n.head-btn[data-v-5ab8085e] {\n        display: flex;\n        flex-direction: column;\n        gap: 12px;\n        width: 100%;\n        margin-top: 10px;\n}\n.nav-menu[data-v-5ab8085e] {\n        flex-direction: column;\n        border-radius: 20px;\n        padding: 20px;\n        background: #ffffff;\n        backdrop-filter: none;\n        width: 100%;\n        gap: 15px;\n        box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n}\n.nav-header-right[data-v-5ab8085e] {\n        width: 100%;\n        display: flex;\n        justify-content: center;\n        margin-top: 20px;\n        align-items: center;\n}\n.nav-link-custom[data-v-5ab8085e] {\n        font-size: 16px !important;\n        text-align: center;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n}\n.dropdown-menu[data-v-5ab8085e] {\n        position: static !important;\n        float: none;\n        text-align: center;\n        border: none;\n        box-shadow: none;\n        background: transparent;\n        margin-top: 10px;\n}\n}\n@media (max-width: 767px) {\n.navbar-header-logo[data-v-5ab8085e] {\n        max-width: 180px;\n}\n#main-logo[data-v-5ab8085e] {\n        height: 45px;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.navbar-collapse,\n.collapse {\n    width: 90%;\n}\n.nav-link:after {\n    content: none !important;\n}\n.dropdown-menu {\n    position: absolute !important;\n    left: -85px !important;\n    border-radius: 15px !important;\n}\n.navbar-light .navbar-toggler {\n    color: #355594;\n    border-color: #0000;\n}\n.ultra-premium-modal .modal-dialog {\n    max-width: 1000px !important;\n    margin: 1.75rem auto;\n}\n.ultra-premium-modal .modal-content {\n    background: transparent !important;\n    border: none !important;\n    border-radius: 32px !important;\n    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;\n    font-family: 'Inter', sans-serif !important;\n    overflow: hidden;\n    animation: fadeInUp 0.4s ease;\n}\n.ultra-premium-modal .modal-body {\n    padding: 0 !important;\n    background: rgba(255, 255, 255, 0.95);\n    backdrop-filter: blur(25px);\n}\n@keyframes fadeInUp {\nfrom { opacity: 0; transform: translateY(20px) scale(0.98);\n}\nto { opacity: 1; transform: translateY(0) scale(1);\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.layout-wrapper[data-v-a55852f2] {\n  background: linear-gradient(180deg, #d0e6f8 0%, #ffffff 100%);\n  min-height: 100vh;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_style_index_0_id_a55852f2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_style_index_0_id_a55852f2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_style_index_0_id_a55852f2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/layout/Footer.vue":
/*!*************************************************!*\
  !*** ./resources/js/src/view/layout/Footer.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Footer.vue?vue&type=template&id=9d1cd042&scoped=true */ "./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true");
/* harmony import */ var _Footer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Footer.vue?vue&type=script&lang=js */ "./resources/js/src/view/layout/Footer.vue?vue&type=script&lang=js");
/* harmony import */ var _Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css */ "./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Footer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "9d1cd042",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layout/Footer.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

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

/***/ "./resources/js/src/view/layout/MainLayout.vue":
/*!*****************************************************!*\
  !*** ./resources/js/src/view/layout/MainLayout.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MainLayout_vue_vue_type_template_id_a55852f2_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainLayout.vue?vue&type=template&id=a55852f2&scoped=true */ "./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2&scoped=true");
/* harmony import */ var _MainLayout_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MainLayout.vue?vue&type=script&lang=js */ "./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js");
/* harmony import */ var _MainLayout_vue_vue_type_style_index_0_id_a55852f2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css */ "./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _MainLayout_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MainLayout_vue_vue_type_template_id_a55852f2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _MainLayout_vue_vue_type_template_id_a55852f2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "a55852f2",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layout/MainLayout.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layout/Footer.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/layout/Footer.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

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

/***/ "./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MainLayout.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=template&id=9d1cd042&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_template_id_5ab8085e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=template&id=5ab8085e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=template&id=5ab8085e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2&scoped=true":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2&scoped=true ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_template_id_a55852f2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_template_id_a55852f2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_template_id_a55852f2_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MainLayout.vue?vue&type=template&id=a55852f2&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_0_id_5ab8085e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=0&id=5ab8085e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Header_vue_vue_type_style_index_1_id_5ab8085e_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Header.vue?vue&type=style&index=1&id=5ab8085e&lang=css");


/***/ }),

/***/ "./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_style_index_0_id_a55852f2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=style&index=0&id=a55852f2&scoped=true&lang=css");


/***/ })

}]);