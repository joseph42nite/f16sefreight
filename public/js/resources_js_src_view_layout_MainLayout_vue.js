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
  name: "Footer",
  data: function data() {
    return {
      FooterLogoSrc: "/media/custome/blue-logo.png",
      YouTubeLogoSrc: "/media/custome/social-icon/youtube.svg",
      LinkedInLogoSrc: "/media/custome/social-icon/linkedIn.svg",
      FaceBookLogoSrc: "/media/custome/social-icon/facebook.svg"
    };
  }
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
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _view_layout_Footer_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layout/Footer.vue */ "./resources/js/src/view/layout/Footer.vue");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

// import Header from "@/view/layout/Header.vue";

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "MainLayout",
  components: {
    // Header,
    Footer: _view_layout_Footer_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    // check if current user is authenticated
    console.log(this.currentUser);
    if (!this.isAuthenticated) {
      this.$router.push({
        name: "userlogin"
      });
    }
  },
  computed: _objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_1__.mapGetters)(["isAuthenticated", "currentUser"]))
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true ***!
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
  return _c("b-container", {
    staticClass: "footer py-14",
    attrs: {
      fluid: ""
    }
  }, [_c("b-container", [_c("b-row", [_c("b-col", {
    staticClass: "p-0 mb-6",
    attrs: {
      md: "12"
    }
  }, [_c("router-link", {
    attrs: {
      to: "/"
    }
  }, [_c("img", {
    staticClass: "img-fluid",
    attrs: {
      src: _vm.FooterLogoSrc,
      alt: "f16s Footer Logo",
      id: "main-footer-logo"
    }
  })])], 1)], 1), _vm._v(" "), _c("b-row", {
    staticClass: "border-top-bottom",
    attrs: {
      "align-h": "center",
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      cols: "11",
      md: "10"
    }
  }, [_c("b-row", [_c("b-col", {
    attrs: {
      cols: "6",
      sm: "3",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-sm-14 mt-7 list-group"
  }, [_c("h5", {
    staticClass: "mb-sm-8 mb-5"
  }, [_vm._v("Company")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled"
  }, [_c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      to: "/about-us"
    }
  }, [_vm._v("About")])], 1), _vm._v(" "), _c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      href: "#faq-section"
    }
  }, [_vm._v("FAQ")])], 1)])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "6",
      sm: "3",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-sm-14 mt-7 list-group"
  }, [_c("h5", {
    staticClass: "mb-sm-8 mb-5"
  }, [_vm._v("Resources")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled"
  }, [_c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Contact Us")])], 1)])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "6",
      sm: "3",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-sm-14 mt-7 list-group"
  }, [_c("h5", {
    staticClass: "mb-sm-8 mb-5"
  }, [_vm._v("Services")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled"
  }, [_c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      href: "#"
    }
  }, [_vm._v("Focus Air")])], 1), _vm._v(" "), _c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      href: "#"
    }
  }, [_vm._v("Focus Sea")])], 1), _vm._v(" "), _c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      href: "#"
    }
  }, [_vm._v("Focus Road")])], 1)])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      cols: "6",
      sm: "3",
      md: "3"
    }
  }, [_c("div", {
    staticClass: "my-sm-14 mt-7 list-group"
  }, [_c("h5", {
    staticClass: "mb-sm-8 mb-5"
  }, [_vm._v("Contact Info")]), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled"
  }, [_c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      href: "tel:+918660320019"
    }
  }, [_vm._v("Call")])], 1), _vm._v(" "), _c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", {
    attrs: {
      href: "mailto:joseph@f16sefreight.com"
    }
  }, [_vm._v("Email")])], 1), _vm._v(" "), _c("li", {
    staticClass: "mb-sm-6 mb-3"
  }, [_c("b-link", [_vm._v("Address")])], 1)])])])], 1)], 1)], 1), _vm._v(" "), _c("b-row", {
    staticClass: "pt-6"
  }, [_c("b-col", {
    attrs: {
      xs: "6"
    }
  }, [_c("div", [_vm._v("© 2024, F16s All Rights Reserved.")])]), _vm._v(" "), _c("b-col", {
    staticClass: "d-flex justify-content-end",
    attrs: {
      xs: "6"
    }
  }, [_c("router-link", {
    staticClass: "mx-2",
    attrs: {
      to: "#"
    }
  }, [_c("img", {
    staticStyle: {
      "margin-top": "18%"
    },
    attrs: {
      src: _vm.YouTubeLogoSrc,
      alt: "YouTube Logo",
      id: "social-icon"
    }
  })]), _vm._v(" "), _c("router-link", {
    staticClass: "mx-2",
    attrs: {
      to: "#"
    }
  }, [_c("img", {
    attrs: {
      src: _vm.LinkedInLogoSrc,
      alt: "LinkedIn Logo",
      id: "social-icon"
    }
  })]), _vm._v(" "), _c("router-link", {
    staticClass: "mx-2",
    attrs: {
      to: "#"
    }
  }, [_c("img", {
    attrs: {
      src: _vm.FaceBookLogoSrc,
      alt: "Facebook Logo",
      id: "social-icon"
    }
  })])], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2":
/*!********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2 ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _vm.isAuthenticated ? _c("div", [_c("transition", {
    attrs: {
      name: "fade-in-up"
    }
  }, [_c("router-view")], 1), _vm._v(" "), _c("Footer")], 1) : _c("div", [_c("transition", {
    attrs: {
      name: "fade-in-up"
    }
  }, [_c("router-view")], 1), _vm._v(" "), _c("Footer")], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "@import url(http://fonts.googleapis.com/css?family=Inter:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n/* /////////////////////////////////////////////////////////////////////////////////////////////////////// */\nhtml[data-v-9d1cd042], body[data-v-9d1cd042], html *[data-v-9d1cd042] {\n    font-family: 'Inter', sans-serif !important;\n}\n#main-footer-logo[data-v-9d1cd042] {\n    width: 80px;\n}\n.border-top-bottom[data-v-9d1cd042] {\n    border-top: 1px solid #BABDCE !important;\n    border-bottom: 1px solid #BABDCE !important;\n}\n.footer[data-v-9d1cd042] {\n    height: auto;\n    background-color: #DAEFFF; /* For browsers that do not support gradients */\n    background-image: linear-gradient(#FFFFFF, #DAEFFF);\n}\n.footer h5[data-v-9d1cd042] {\n    font-size: 14px;\n    line-height: 24px;\n    color: #818498;\n    font-weight: 400;\n}\n.footer p[data-v-9d1cd042],\n.footer ul[data-v-9d1cd042] {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px;\n    color: #36364A;\n}\n.footer a[data-v-9d1cd042] {\n    color: #36364A;\n    text-decoration: none;\n}\n.footer a[data-v-9d1cd042]:hover {\n    text-decoration: underline !important;\n}\n#social-icon[data-v-9d1cd042] {\n    width: 80%;\n    margin: auto;\n    display: flex;\n}\n.linkedin-icon[data-v-9d1cd042] {\n    margin: 0px 25px;\n}\n.contactInfo-phone[data-v-9d1cd042],\n.contactInfo-email[data-v-9d1cd042],\n.contactInfo-address[data-v-9d1cd042] {\n    font-size: 12px;\n}\n@media (max-width: 576px) {\n.list-group[data-v-9d1cd042] {\n        text-align: center;\n}\n}\n@media (max-width: 767px) {\n.contactInfo-phone[data-v-9d1cd042],\n    .contactInfo-email[data-v-9d1cd042],\n    .contactInfo-address[data-v-9d1cd042] {\n        font-size: 12px;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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

/***/ "./resources/js/src/view/layout/MainLayout.vue":
/*!*****************************************************!*\
  !*** ./resources/js/src/view/layout/MainLayout.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MainLayout_vue_vue_type_template_id_a55852f2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MainLayout.vue?vue&type=template&id=a55852f2 */ "./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2");
/* harmony import */ var _MainLayout_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MainLayout.vue?vue&type=script&lang=js */ "./resources/js/src/view/layout/MainLayout.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MainLayout_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MainLayout_vue_vue_type_template_id_a55852f2__WEBPACK_IMPORTED_MODULE_0__.render,
  _MainLayout_vue_vue_type_template_id_a55852f2__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
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
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_template_id_9d1cd042_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=template&id=9d1cd042&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=template&id=9d1cd042&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2":
/*!***********************************************************************************!*\
  !*** ./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2 ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_template_id_a55852f2__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_template_id_a55852f2__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_MainLayout_vue_vue_type_template_id_a55852f2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MainLayout.vue?vue&type=template&id=a55852f2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/MainLayout.vue?vue&type=template&id=a55852f2");


/***/ }),

/***/ "./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Footer_vue_vue_type_style_index_0_id_9d1cd042_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layout/Footer.vue?vue&type=style&index=0&id=9d1cd042&scoped=true&lang=css");


/***/ })

}]);