"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_ProductDescription_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ProductDescription",
  components: {},
  data: function data() {
    return {
      products: [{
        title: "AWB Execution Tracker",
        description: "Maintain stock for all airlines with original history including last 100 awb clearly visible for complete operational transparency.",
        icon: "/media/custome/affordable-awb.webp"
      }, {
        title: "Stock/AWB Management System",
        description: "Manage your waybill stock with office back history and keep real-time check on availability and usage patterns.",
        icon: "/media/custome/database-management.webp"
      }, {
        title: "EDI Transfer to Airlines",
        description: "Stable system providing data connectivity with 150+ airlines globally for worldwide fast and accurate data transfer.",
        icon: "/media/custome/automated-workflow.webp"
      }, {
        title: "Shipment Status Search Engine",
        description: "Easy and custom search with last search status option, checking history logs, and instant search by AWB number.",
        icon: "/media/custome/real-time.webp"
      }, {
        title: "Tariff Rates & Features System",
        description: "Accurate and reliable tariff rates along with powerful features and tools to make informed decisions for every shipment.",
        icon: "/media/custome/scalable-performance.webp"
      }],
      isReady: false
    };
  },
  mounted: function mounted() {
    var _this = this;
    // Artificial delay to ensure assets are ready and show smooth skeleton
    setTimeout(function () {
      _this.isReady = true;
    }, 600);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "main-wrapper p-0",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "decorative-ellipses d-none d-lg-block"
  }, [_c("div", {
    staticClass: "ellipse ellipse-tl"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-tr"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-br"
  })]), _vm._v(" "), _c("b-container", {
    staticClass: "content-container pt-12 pb-24"
  }, [_c("section", {
    staticClass: "service-main-card mb-16"
  }, [_c("div", {
    staticClass: "card-glass-body"
  }, [_c("div", {
    staticClass: "card-content text-center"
  }, [_c("h1", {
    staticClass: "card-main-title"
  }, [_vm._v("FOCUS AIR")]), _vm._v(" "), _c("p", {
    staticClass: "card-intro mb-16 mx-auto"
  }, [_vm._v("\n                  Focus Air is an expert air-freight management tool that brings advanced system operations for the global logistics and logistics providers. Our goals of air way.\n              ")]), _vm._v(" "), _vm.isReady ? _c("b-row", {
    staticClass: "product-grid justify-content-center"
  }, _vm._l(_vm.products, function (product, idx) {
    return _c("b-col", {
      key: idx,
      staticClass: "mb-12",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "inner-product-item"
    }, [_c("div", {
      staticClass: "icon-wrapper mb-4"
    }, [_c("img", {
      staticClass: "product-svg",
      attrs: {
        src: product.icon,
        alt: product.title
      }
    })]), _vm._v(" "), _c("h3", {
      staticClass: "inner-title"
    }, [_vm._v(_vm._s(product.title))]), _vm._v(" "), _c("p", {
      staticClass: "inner-desc"
    }, [_vm._v(_vm._s(product.description))])])]);
  }), 1) : _vm._e(), _vm._v(" "), !_vm.isReady ? _c("div", {
    staticClass: "skeleton-grid-container mt-16"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, _vm._l(3, function (n) {
    return _c("b-col", {
      key: n,
      staticClass: "mb-12",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "skeleton-product-item"
    }, [_c("div", {
      staticClass: "skeleton-icon mb-4"
    }), _vm._v(" "), _c("div", {
      staticClass: "skeleton-line title mb-3"
    }), _vm._v(" "), _c("div", {
      staticClass: "skeleton-line text"
    }), _vm._v(" "), _c("div", {
      staticClass: "skeleton-line text short"
    })])]);
  }), 1)], 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "mt-12"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "service-main-card mb-16"
  }, [_c("div", {
    staticClass: "card-glass-body"
  }, [_c("div", {
    staticClass: "card-content text-center py-10"
  }, [_c("h1", {
    staticClass: "card-main-title"
  }, [_vm._v("FOCUS ROAD")]), _vm._v(" "), _c("div", {
    staticClass: "status-info"
  }, [_c("p", {
    staticClass: "status-label mb-2"
  }, [_vm._v("Under development")]), _vm._v(" "), _c("p", {
    staticClass: "status-sub"
  }, [_vm._v("For more details")])]), _vm._v(" "), _c("div", {
    staticClass: "mt-12"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])])]), _vm._v(" "), _c("section", {
    staticClass: "service-main-card mb-16"
  }, [_c("div", {
    staticClass: "card-glass-body"
  }, [_c("div", {
    staticClass: "card-content text-center py-10"
  }, [_c("h1", {
    staticClass: "card-main-title"
  }, [_vm._v("FOCUS SEA")]), _vm._v(" "), _c("div", {
    staticClass: "status-info"
  }, [_c("p", {
    staticClass: "status-label mb-2"
  }, [_vm._v("Under development")]), _vm._v(" "), _c("p", {
    staticClass: "status-sub"
  }, [_vm._v("For more details")])]), _vm._v(" "), _c("div", {
    staticClass: "mt-12"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])])])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-21a7a1ee] {\n    font-family: 'Inter', sans-serif;\n    position: relative;\n    overflow-x: hidden;\n}\n\n/* Decorative background elements */\n.decorative-ellipses .ellipse[data-v-21a7a1ee] {\n    position: absolute;\n    border-radius: 50%;\n    filter: blur(60px);\n    z-index: 0;\n    opacity: 0.4;\n}\n.ellipse-tl[data-v-21a7a1ee] { width: 300px; height: 300px; background: #D0E6F8; top: -50px; left: -50px;\n}\n.ellipse-tr[data-v-21a7a1ee] { width: 200px; height: 200px; background: #E6F0FF; top: 15%; right: 5%;\n}\n.content-container[data-v-21a7a1ee] {\n    position: relative;\n    z-index: 10;\n}\n\n/* Main Service Card */\n.service-main-card[data-v-21a7a1ee] {\n    position: relative;\n    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);\n}\n.service-main-card[data-v-21a7a1ee]:hover {\n    transform: translateY(-10px) scale(1.01);\n}\n.card-glass-body[data-v-21a7a1ee] {\n    background: rgba(255, 255, 255, 0.75);\n    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n    border: 1px solid rgba(255, 255, 255, 0.9);\n    border-radius: 60px;\n    padding: 6rem 4rem;\n    position: relative;\n    transition: all 0.5s ease;\n    box-shadow: 0 20px 50px rgba(53, 85, 148, 0.05);\n    will-change: transform, opacity;\n}\n.service-main-card:hover .card-glass-body[data-v-21a7a1ee] {\n    box-shadow: 0 40px 100px rgba(53, 85, 148, 0.12);\n    background: rgba(255, 255, 255, 0.85);\n}\n.card-content[data-v-21a7a1ee] {\n    position: relative;\n    z-index: 1;\n}\n\n/* Large Header Title at Top */\n.card-main-title[data-v-21a7a1ee] {\n    font-size: 8rem;\n    font-weight: 900;\n    color: #1e3a6e;\n    opacity: 0.1;\n    letter-spacing: -3px;\n    margin-bottom: 2.5rem;\n    line-height: 1;\n    transition: all 0.5s ease;\n}\n.service-main-card:hover .card-main-title[data-v-21a7a1ee] {\n    opacity: 1;\n    color: #1e3a6e;\n    transform: scale(1.02);\n}\n.card-intro[data-v-21a7a1ee] {\n    font-size: 1.15rem;\n    color: #5A6B8A;\n    line-height: 1.8;\n    max-width: 750px;\n    position: relative;\n    z-index: 2;\n}\n\n/* Product Grid */\n.product-grid[data-v-21a7a1ee] {\n    margin-top: 4rem;\n}\n.inner-product-item[data-v-21a7a1ee] {\n    padding: 1rem;\n}\n.icon-wrapper[data-v-21a7a1ee] {\n    height: 100px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.product-svg[data-v-21a7a1ee] {\n    width: 140px;\n    height: 140px;\n    -o-object-fit: contain;\n       object-fit: contain;\n}\n.inner-title[data-v-21a7a1ee] {\n    font-size: 1.25rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    margin-bottom: 0.75rem;\n}\n.inner-desc[data-v-21a7a1ee] {\n    font-size: 1rem;\n    color: #7A8BA8;\n    line-height: 1.6;\n    max-width: 280px;\n    margin: 0 auto;\n}\n\n/* Status Info (Road/Sea) */\n.status-sub[data-v-21a7a1ee] {\n    font-size: 1.1rem;\n    color: #5A6B8A;\n}\n\n/* Skeleton Loader */\n.skeleton-grid-container[data-v-21a7a1ee] {\n    padding: 2rem 0;\n}\n.skeleton-product-item[data-v-21a7a1ee] {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    padding: 1rem;\n}\n.skeleton-icon[data-v-21a7a1ee] {\n    width: 80px;\n    height: 80px;\n    background: #f0f4f8;\n    border-radius: 20px;\n    animation: shimmer-21a7a1ee 1.5s infinite linear;\n    background: linear-gradient(90deg, #f0f4f8 0%, #e1e8f0 50%, #f0f4f8 100%);\n    background-size: 200% 100%;\n}\n.skeleton-line[data-v-21a7a1ee] {\n    background: linear-gradient(90deg, #f0f4f8 0%, #e1e8f0 50%, #f0f4f8 100%);\n    background-size: 200% 100%;\n    animation: shimmer-21a7a1ee 1.5s infinite linear;\n    border-radius: 4px;\n}\n.skeleton-line.title[data-v-21a7a1ee] {\n    width: 140px;\n    height: 20px;\n}\n.skeleton-line.text[data-v-21a7a1ee] {\n    width: 180px;\n    height: 12px;\n    margin-bottom: 8px;\n}\n.skeleton-line.text.short[data-v-21a7a1ee] {\n    width: 120px;\n}\n@keyframes shimmer-21a7a1ee {\n0% { background-position: 200% 0;\n}\n100% { background-position: -200% 0;\n}\n}\n\n\n\n/* Responsive */\n@media (max-width: 1199px) {\n.card-main-title[data-v-21a7a1ee] { font-size: 5rem;\n}\n}\n@media (max-width: 991px) {\n.card-main-title[data-v-21a7a1ee] { font-size: 4rem; margin-bottom: 1rem;\n}\n.card-glass-body[data-v-21a7a1ee] { padding: 4rem 2rem;\n}\n}\n@media (max-width: 767px) {\n.card-main-title[data-v-21a7a1ee] { font-size: 3rem;\n}\n.product-svg[data-v-21a7a1ee] { width: 100px; height: 100px;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_style_index_0_id_21a7a1ee_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_style_index_0_id_21a7a1ee_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_style_index_0_id_21a7a1ee_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/ProductDescription.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/ProductDescription.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProductDescription_vue_vue_type_template_id_21a7a1ee_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true */ "./resources/js/src/view/pages/ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true");
/* harmony import */ var _ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/ProductDescription.vue?vue&type=script&lang=js");
/* harmony import */ var _ProductDescription_vue_vue_type_style_index_0_id_21a7a1ee_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css */ "./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProductDescription_vue_vue_type_template_id_21a7a1ee_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ProductDescription_vue_vue_type_template_id_21a7a1ee_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "21a7a1ee",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/ProductDescription.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/ProductDescription.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/ProductDescription.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_21a7a1ee_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_21a7a1ee_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_21a7a1ee_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=template&id=21a7a1ee&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_style_index_0_id_21a7a1ee_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/ProductDescription.vue?vue&type=style&index=0&id=21a7a1ee&scoped=true&lang=css");


/***/ })

}]);