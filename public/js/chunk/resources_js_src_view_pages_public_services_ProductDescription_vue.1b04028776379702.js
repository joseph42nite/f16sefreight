"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_services_ProductDescription_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ProductDescription",
  components: {},
  data() {
    return {
      products: [{
        title: "AWB Execution Tracker",
        description: "Maintain stock for all airlines with original history including last 100 awb clearly visible for complete operational transparency.",
        icon: "/media/assets/vectors/affordable-awb.webp"
      }, {
        title: "Stock/AWB Management System",
        description: "Manage your waybill stock with office back history and keep real-time check on availability and usage patterns.",
        icon: "/media/assets/vectors/database-management.webp"
      }, {
        title: "EDI Transfer to Airlines",
        description: "Stable system providing data connectivity with 150+ airlines globally for worldwide fast and accurate data transfer.",
        icon: "/media/assets/vectors/automated-workflow.webp"
      }, {
        title: "Shipment Status Search Engine",
        description: "Easy and custom search with last search status option, checking history logs, and instant search by AWB number.",
        icon: "/media/assets/vectors/real-time.webp"
      }, {
        title: "Tariff Rates & Features System",
        description: "Accurate and reliable tariff rates along with powerful features and tools to make informed decisions for every shipment.",
        icon: "/media/assets/vectors/scalable-performance.webp"
      }],
      isReady: false
    };
  },
  mounted() {
    // Artificial delay to ensure assets are ready and show smooth skeleton
    setTimeout(() => {
      this.isReady = true;
    }, 600);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834 ***!
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

/***/ "./resources/js/src/view/pages/public/services/ProductDescription.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/ProductDescription.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=template&id=1a493834 */ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834");
/* harmony import */ var _ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.render,
  _ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/services/ProductDescription.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834 ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=template&id=1a493834 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834");


/***/ })

}]);