"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Services_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _public_components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./public-components/DecorativeEllipses.vue */ "./resources/js/src/view/pages/public-components/DecorativeEllipses.vue");
/* harmony import */ var _public_components_SectionHeader_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./public-components/SectionHeader.vue */ "./resources/js/src/view/pages/public-components/SectionHeader.vue");
/* harmony import */ var _public_components_HeroButton_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./public-components/HeroButton.vue */ "./resources/js/src/view/pages/public-components/HeroButton.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Services",
  metaInfo: {
    title: "Advanced E-Freight & ERP Solutions | F16s Services",
    meta: [{
      name: 'description',
      content: 'Explore F16s\' suite of advanced logistics tools: EDI data transfer (FWB, FHL, FZB), MAWB & HAWB management, and unified logistics ERP.'
    }, {
      property: 'og:title',
      content: 'Advanced E-Freight & ERP Solutions | F16s Services'
    }, {
      property: 'og:description',
      content: 'Explore F16s\' suite of advanced logistics tools: EDI data transfer (FWB, FHL, FZB), MAWB & HAWB management, and unified logistics ERP.'
    }]
  },
  components: {
    DecorativeEllipses: _public_components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    SectionHeader: _public_components_SectionHeader_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    HeroButton: _public_components_HeroButton_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      services: [{
        imgSrc: "/media/custome/solution/amico.png",
        title: "Advanced EDI Gateway",
        desc: "High-speed data transfer for FWB, FHL, and FZB messaging, ensuring seamless connectivity between forwarders and 150+ airlines.",
        features: ["e-AWB IATA Compliance", "Real-time Manifest Transfer", "Automated Error Validation"]
      }, {
        imgSrc: "/media/custome/solution/cuate.png",
        title: "MAWB & HAWB Logic",
        desc: "Enterprise-grade tools for managing Master and House Air Waybills with full version history and secure document archiving.",
        features: ["Consolidation Tools", "Automated Documentation", "Digital History Logs"]
      }, {
        imgSrc: "/media/custome/solution/pana.png",
        title: "Logistics Intelligence ERP",
        desc: "A comprehensive ERP system designed specifically for the freight industry to monitor operational performance and financial growth.",
        features: ["Shipment Lifecycle Tracking", "Vendor Performance KPIs", "Revenue Analytics"]
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "DecorativeEllipses",
  props: {
    showMid: {
      type: Boolean,
      "default": false
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HeroButton",
  props: {
    to: {
      type: String,
      "default": null
    },
    href: {
      type: String,
      "default": null
    },
    icon: {
      type: String,
      "default": "arrow-right"
    },
    ariaLabel: {
      type: String,
      "default": "Action button"
    },
    variant: {
      type: String,
      "default": "blue"
    },
    // blue, white
    disabled: {
      type: Boolean,
      "default": false
    }
  },
  computed: {
    variantClass: function variantClass() {
      return {
        'is-white': this.variant === 'white',
        'hero-btn-large-white': this.variant === 'large-white'
      };
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SectionHeader",
  props: {
    eyebrow: {
      type: String,
      "default": ""
    },
    title: {
      type: String,
      "default": ""
    },
    subtitle: {
      type: String,
      "default": ""
    },
    tag: {
      type: String,
      "default": "h2"
    },
    id: {
      type: String,
      "default": null
    },
    align: {
      type: String,
      "default": "center"
    },
    // left, center, right
    marginBottom: {
      type: String,
      "default": "16"
    }
  },
  computed: {
    textAlignClass: function textAlignClass() {
      return "text-".concat(this.align);
    },
    marginClass: function marginClass() {
      return "mb-".concat(this.marginBottom);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=template&id=3794585a&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=template&id=3794585a&scoped=true ***!
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
  return _c("b-container", {
    staticClass: "main-wrapper p-0",
    attrs: {
      fluid: ""
    }
  }, [_c("decorative-ellipses", {
    attrs: {
      showMid: true
    }
  }), _vm._v(" "), _c("b-container", {
    staticClass: "content-container pb-30"
  }, [_c("section", {
    staticClass: "services-hero-section mt-20 mt-lg-25 mb-30"
  }, [_c("b-row", {
    staticClass: "justify-content-center text-center"
  }, [_c("b-col", {
    attrs: {
      lg: "10",
      xl: "9"
    }
  }, [_c("section-header", {
    attrs: {
      eyebrow: "GLOBAL LOGISTICS INFRASTRUCTURE",
      tag: "h1",
      marginBottom: "0"
    },
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_vm._v("\n                  Advanced "), _c("span", {
          staticClass: "text-gradient"
        }, [_vm._v("E-Freight & ERP")]), _vm._v(" Solutions for Global Forwarding\n              ")];
      },
      proxy: true
    }, {
      key: "subtitle",
      fn: function fn() {
        return [_vm._v("\n                  F16s provides the digital backbone for the modern freight industry. From high-speed "), _c("strong", [_vm._v("EDI data transfer")]), _vm._v(" (FWB, FHL, FZB) to comprehensive "), _c("strong", [_vm._v("MAWB & HAWB management")]), _vm._v(", our platform empowers freight forwarders, consolidators, and logistics providers with enterprise-grade automation.\n              ")];
      },
      proxy: true
    }])
  })], 1)], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "services-grid-section mb-30"
  }, [_c("section-header", {
    attrs: {
      eyebrow: "Industry Segments",
      title: "Comprehensive Freight Automation",
      subtitle: "Digitizing every touchpoint of the global supply chain with specialized tools for air, sea, and road documentation."
    }
  }), _vm._v(" "), _c("b-row", {
    staticClass: "justify-content-center"
  }, _vm._l(_vm.services, function (service, index) {
    return _c("b-col", {
      key: index,
      staticClass: "mb-12",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "service-product-card h-100"
    }, [_c("div", {
      staticClass: "service-product-image mb-8"
    }, [_c("img", {
      attrs: {
        src: service.imgSrc,
        alt: service.title
      }
    })]), _vm._v(" "), _c("div", {
      staticClass: "service-product-info"
    }, [_c("h3", {
      staticClass: "service-product-title"
    }, [_vm._v(_vm._s(service.title))]), _vm._v(" "), _c("p", {
      staticClass: "service-product-desc"
    }, [_vm._v(_vm._s(service.desc))]), _vm._v(" "), _c("ul", {
      staticClass: "service-feature-list text-start mt-6 list-unstyled"
    }, _vm._l(service.features, function (feat, fIdx) {
      return _c("li", {
        key: fIdx,
        staticClass: "mb-2 d-flex align-items-center text-muted"
      }, [_c("b-icon", {
        staticClass: "me-5 text-primary icon-spacing",
        attrs: {
          icon: "check-circle-fill",
          "font-scale": "1.2"
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "feature-text"
      }, [_vm._v(_vm._s(feat))])], 1);
    }), 0)])])]);
  }), 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "deep-dive-section mb-30"
  }, [_c("b-row", {
    staticClass: "align-items-center mb-25 flex-column-reverse flex-lg-row"
  }, [_c("b-col", {
    staticClass: "mt-10 mt-lg-0 pe-lg-12",
    attrs: {
      lg: "6"
    }
  }, [_c("section-header", {
    attrs: {
      align: "left",
      eyebrow: "EDI CONNECTIVITY",
      title: "Global EDI Data Transfer (FWB, FHL, FZB)",
      marginBottom: "0"
    },
    scopedSlots: _vm._u([{
      key: "subtitle",
      fn: function fn() {
        return [_vm._v("\n                      Our stable "), _c("strong", [_vm._v("EDI gateway")]), _vm._v(" connects you directly to over 150+ airlines and global customs hubs. Ensure 100% data accuracy for "), _c("strong", [_vm._v("FWB (Master AWB)")]), _vm._v(", "), _c("strong", [_vm._v("FHL (House Manifest)")]), _vm._v(", and "), _c("strong", [_vm._v("FZB (Flight Manifest)")]), _vm._v(" transmissions.\n                      "), _c("br"), _c("br"), _vm._v("\n                      F16s adheres to IATA e-AWB standards, eliminating manual documentation bottlenecks and ensuring seamless "), _c("strong", [_vm._v("MAWB & HAWB")]), _vm._v(" synchronization across your network.\n                  ")];
      },
      proxy: true
    }])
  }), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-column flex-sm-row align-items-sm-center mt-8"
  }, [_c("div", {
    staticClass: "stat-box me-sm-8 mb-6 mb-sm-0"
  }, [_c("h4", {
    staticClass: "stat-number"
  }, [_vm._v("150+")]), _vm._v(" "), _c("span", {
    staticClass: "stat-label"
  }, [_vm._v("Airlines Connected")])]), _vm._v(" "), _c("div", {
    staticClass: "stat-box"
  }, [_c("h4", {
    staticClass: "stat-number"
  }, [_vm._v("e-AWB")]), _vm._v(" "), _c("span", {
    staticClass: "stat-label"
  }, [_vm._v("IATA Compliant")])])])], 1), _vm._v(" "), _c("b-col", {
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "feature-image-wrapper"
  }, [_c("div", {
    staticClass: "feature-glow"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-img",
    attrs: {
      src: "/media/custome/solution/amico.png",
      alt: "EDI Data Transfer"
    }
  })])])], 1), _vm._v(" "), _c("b-row", {
    staticClass: "align-items-center flex-column flex-lg-row"
  }, [_c("b-col", {
    staticClass: "mb-10 mb-lg-0",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "feature-image-wrapper"
  }, [_c("div", {
    staticClass: "feature-glow alt-glow"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-img",
    attrs: {
      src: "/media/custome/solution/pana.png",
      alt: "Logistics ERP"
    }
  })])]), _vm._v(" "), _c("b-col", {
    staticClass: "ps-lg-12",
    attrs: {
      lg: "6"
    }
  }, [_c("section-header", {
    attrs: {
      align: "left",
      eyebrow: "ENTERPRISE ERP",
      title: "Unified Logistics ERP & Analytics",
      marginBottom: "0"
    },
    scopedSlots: _vm._u([{
      key: "subtitle",
      fn: function fn() {
        return [_vm._v("\n                      Manage your entire freight operation within a single "), _c("strong", [_vm._v("Logistics ERP")]), _vm._v(" framework. From shipment lifecycle management to financial accounting, F16s provides the tools to track every metric.\n                      "), _c("br"), _c("br"), _vm._v("\n                      Gain real-time visibility into your "), _c("strong", [_vm._v("shipment status")]), _vm._v(", vendor performance, and customer profitability with our advanced analytics dashboard.\n                  ")];
      },
      proxy: true
    }])
  }), _vm._v(" "), _c("ul", {
    staticClass: "feature-bullet-list list-unstyled mt-8"
  }, [_c("li", {
    staticClass: "mb-4"
  }, [_c("b-icon", {
    staticClass: "me-3 text-primary",
    attrs: {
      icon: "layout-text-window"
    }
  }), _vm._v(" Multi-modal MAWB & HAWB Management")], 1), _vm._v(" "), _c("li", {
    staticClass: "mb-4"
  }, [_c("b-icon", {
    staticClass: "me-3 text-primary",
    attrs: {
      icon: "shield-lock"
    }
  }), _vm._v(" Secure EDI & API Data Exchange")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-3 text-primary",
    attrs: {
      icon: "bar-chart-line"
    }
  }), _vm._v(" Comprehensive Operational Reporting")], 1)])], 1)], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "vision-section mb-30"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      lg: "11"
    }
  }, [_c("div", {
    staticClass: "commitment-card"
  }, [_c("div", {
    staticClass: "commitment-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "commitment-content glass-card p-8 p-md-16"
  }, [_c("b-row", {
    attrs: {
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      lg: "7"
    }
  }, [_c("section-header", {
    attrs: {
      align: "left",
      eyebrow: "Our Commitment",
      title: "Standardizing Global Logistics",
      marginBottom: "0"
    },
    scopedSlots: _vm._u([{
      key: "subtitle",
      fn: function fn() {
        return [_vm._v("\n                          We are committed to providing the most reliable and affordable "), _c("strong", [_vm._v("e-freight infrastructure")]), _vm._v(" for the global logistics community. Our mission is to standardize "), _c("strong", [_vm._v("EDI connectivity")]), _vm._v(" and "), _c("strong", [_vm._v("ERP accessibility")]), _vm._v(" for every freight forwarder.\n                          "), _c("br"), _c("br"), _vm._v("\n                          By integrating complex systems into a user-friendly platform, we enable our partners to focus on what matters most: delivering excellence at every step of the supply chain.\n                      ")];
      },
      proxy: true
    }])
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "d-none d-lg-flex justify-content-center",
    attrs: {
      lg: "5"
    }
  }, [_c("div", {
    staticClass: "commitment-icon-wrapper"
  }, [_c("div", {
    staticClass: "icon-ring"
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "commitment-icon",
    attrs: {
      icon: "cpu",
      "font-scale": "5"
    }
  })], 1)])], 1)], 1)])])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "cta-section mb-20"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      lg: "10"
    }
  }, [_c("div", {
    staticClass: "final-cta-card"
  }, [_c("div", {
    staticClass: "cta-overlay-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "cta-inner-content py-20 px-8 text-center text-white"
  }, [_c("h2", {
    staticClass: "section-heading mb-6 text-white"
  }, [_vm._v("Upgrade Your Freight Infrastructure Today")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mb-10 text-white opacity-90 mx-auto",
    staticStyle: {
      "max-width": "650px"
    }
  }, [_vm._v("\n                          Join the global network of forwarders using F16s to power their "), _c("strong", [_vm._v("EDI transmissions")]), _vm._v(" and "), _c("strong", [_vm._v("ERP operations")]), _vm._v(". Connect with our experts for a personalized demonstration.\n                      ")]), _vm._v(" "), _c("hero-button", {
    attrs: {
      to: "/contact-us",
      variant: "large-white"
    }
  }, [_vm._v("Get Started Now")])], 1)])])], 1)], 1)])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=template&id=9800f5b4":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=template&id=9800f5b4 ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "decorative-ellipses d-none d-lg-block"
  }, [_c("div", {
    staticClass: "ellipse ellipse-tl"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-tr"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-br"
  }), _vm._v(" "), _vm.showMid ? _c("div", {
    staticClass: "ellipse ellipse-mid"
  }) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=template&id=0a032706":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=template&id=0a032706 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-button", {
    staticClass: "hero-btn",
    "class": _vm.variantClass,
    attrs: {
      to: _vm.to,
      href: _vm.href,
      "aria-label": _vm.ariaLabel,
      disabled: _vm.disabled
    },
    on: {
      click: function click($event) {
        return _vm.$emit("click", $event);
      }
    }
  }, [_c("span", [_vm._t("default")], 2), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: _vm.icon,
      "aria-hidden": "true"
    }
  })], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=template&id=9b4ab69e":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=template&id=9b4ab69e ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    "class": ["section-header", _vm.textAlignClass, _vm.marginClass]
  }, [_vm.eyebrow ? _c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v(_vm._s(_vm.eyebrow))]) : _vm._e(), _vm._v(" "), _c(_vm.tag, {
    tag: "component",
    staticClass: "section-title",
    attrs: {
      id: _vm.id
    }
  }, [_vm._t("title", function () {
    return [_vm._v(_vm._s(_vm.title))];
  })], 2), _vm._v(" "), _vm.subtitle || _vm.$slots.subtitle ? _c("p", {
    staticClass: "section-subtitle mt-4"
  }, [_vm._t("subtitle", function () {
    return [_vm._v(_vm._s(_vm.subtitle))];
  })], 2) : _vm._e()], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.content-container[data-v-3794585a] {\n    position: relative;\n    z-index: 10;\n    padding-top: 0;\n}\n\n/* Typography Enhancements */\n.section-title[data-v-3794585a] {\n    font-size: 3.5rem;\n    font-weight: 800;\n}\n.section-heading[data-v-3794585a] {\n    font-size: 2.5rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n    line-height: 1.2;\n}\n.text-gradient[data-v-3794585a] {\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    display: inline;\n    padding-right: 0.1em;\n}\n\n/* Feature Deep Dive Images */\n.feature-image-wrapper[data-v-3794585a] {\n    position: relative;\n    border-radius: 32px;\n    padding: 2rem;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.feature-glow[data-v-3794585a] {\n    position: absolute;\n    inset: 0;\n    background: radial-gradient(circle at center, rgba(171, 192, 255, 0.5) 0%, transparent 70%);\n}\n.feature-glow.alt-glow[data-v-3794585a] {\n    background: radial-gradient(circle at center, rgba(187, 226, 255, 0.5) 0%, transparent 70%);\n}\n.feature-img[data-v-3794585a] {\n    position: relative;\n    z-index: 1;\n    filter: drop-shadow(0 30px 60px rgba(53, 85, 148, 0.15));\n    transition: transform 0.5s ease;\n    max-height: 400px;\n}\n.feature-image-wrapper:hover .feature-img[data-v-3794585a] {\n    transform: translateY(-10px);\n}\n\n/* Stat Boxes & Lists */\n.stat-box[data-v-3794585a] {\n    background: white;\n    border-radius: 20px;\n    padding: 1.5rem 2rem;\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);\n    border: 1px solid rgba(230, 240, 255, 1);\n}\n.stat-number[data-v-3794585a] {\n    font-size: 2.5rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    margin-bottom: 0.25rem;\n}\n.stat-label[data-v-3794585a] {\n    font-size: 0.9rem;\n    font-weight: 600;\n    color: #5A6B8A;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n.feature-bullet-list li[data-v-3794585a] {\n    font-size: 1.15rem;\n    color: #4A5E80;\n    font-weight: 500;\n    display: flex;\n    align-items: center;\n}\n\n/* Commitment Card */\n.commitment-card[data-v-3794585a] { position: relative;\n}\n.commitment-glow[data-v-3794585a] {\n    position: absolute;\n    inset: -2px;\n    background: linear-gradient(135deg, #355594, #ABC0FF);\n    border-radius: 40px;\n    opacity: 0.3;\n    filter: blur(25px);\n    z-index: 0;\n}\n.glass-card[data-v-3794585a] {\n    background: rgba(255, 255, 255, 0.85);\n    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);\n    border: 1px solid rgba(255, 255, 255, 0.7);\n    border-radius: 40px;\n    box-shadow: 0 20px 50px rgba(53, 85, 148, 0.05);\n}\n.commitment-icon-wrapper[data-v-3794585a] {\n    position: relative;\n    width: 250px;\n    height: 250px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.icon-ring[data-v-3794585a] {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: #f0f7ff;\n    border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n    animation: morph-3794585a 8s ease-in-out infinite;\n}\n.commitment-icon[data-v-3794585a] { position: relative; z-index: 1; color: #355594;\n}\n@keyframes morph-3794585a {\n0% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n}\n50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;\n}\n100% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n}\n}\n\n/* Final CTA Card */\n.final-cta-card[data-v-3794585a] {\n    position: relative;\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n    border-radius: 40px;\n    overflow: hidden;\n    box-shadow: 0 30px 60px rgba(30, 58, 110, 0.25);\n}\n.cta-overlay-glow[data-v-3794585a] {\n    position: absolute;\n    top: -50%;\n    right: -20%;\n    width: 80%;\n    height: 150%;\n    background: radial-gradient(circle, rgba(171, 192, 255, 0.15) 0%, transparent 70%);\n    transform: rotate(-15deg);\n}\n@media (max-width: 991px) {\n.section-title[data-v-3794585a] { font-size: 2.5rem;\n}\n.commitment-content[data-v-3794585a], .cta-inner-content[data-v-3794585a] { padding: 3rem 2rem;\n}\n}\n@media (max-width: 767px) {\n.section-title[data-v-3794585a] { font-size: 2.1rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_3794585a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_3794585a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_3794585a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/Services.vue":
/*!**************************************************!*\
  !*** ./resources/js/src/view/pages/Services.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Services_vue_vue_type_template_id_3794585a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Services.vue?vue&type=template&id=3794585a&scoped=true */ "./resources/js/src/view/pages/Services.vue?vue&type=template&id=3794585a&scoped=true");
/* harmony import */ var _Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Services.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Services.vue?vue&type=script&lang=js");
/* harmony import */ var _Services_vue_vue_type_style_index_0_id_3794585a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css */ "./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Services_vue_vue_type_template_id_3794585a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Services_vue_vue_type_template_id_3794585a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3794585a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/Services.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public-components/DecorativeEllipses.vue":
/*!******************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/DecorativeEllipses.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DecorativeEllipses_vue_vue_type_template_id_9800f5b4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DecorativeEllipses.vue?vue&type=template&id=9800f5b4 */ "./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=template&id=9800f5b4");
/* harmony import */ var _DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DecorativeEllipses.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DecorativeEllipses_vue_vue_type_template_id_9800f5b4__WEBPACK_IMPORTED_MODULE_0__.render,
  _DecorativeEllipses_vue_vue_type_template_id_9800f5b4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public-components/DecorativeEllipses.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public-components/HeroButton.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/HeroButton.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HeroButton_vue_vue_type_template_id_0a032706__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HeroButton.vue?vue&type=template&id=0a032706 */ "./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=template&id=0a032706");
/* harmony import */ var _HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HeroButton.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HeroButton_vue_vue_type_template_id_0a032706__WEBPACK_IMPORTED_MODULE_0__.render,
  _HeroButton_vue_vue_type_template_id_0a032706__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public-components/HeroButton.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public-components/SectionHeader.vue":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/SectionHeader.vue ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SectionHeader_vue_vue_type_template_id_9b4ab69e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SectionHeader.vue?vue&type=template&id=9b4ab69e */ "./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=template&id=9b4ab69e");
/* harmony import */ var _SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SectionHeader.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SectionHeader_vue_vue_type_template_id_9b4ab69e__WEBPACK_IMPORTED_MODULE_0__.render,
  _SectionHeader_vue_vue_type_template_id_9b4ab69e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public-components/SectionHeader.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/Services.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/src/view/pages/Services.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=script&lang=js":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DecorativeEllipses.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HeroButton.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=script&lang=js":
/*!*************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SectionHeader.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/Services.vue?vue&type=template&id=3794585a&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Services.vue?vue&type=template&id=3794585a&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_template_id_3794585a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_template_id_3794585a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_template_id_3794585a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=template&id=3794585a&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=template&id=3794585a&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=template&id=9800f5b4":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=template&id=9800f5b4 ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_template_id_9800f5b4__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_template_id_9800f5b4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_template_id_9800f5b4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DecorativeEllipses.vue?vue&type=template&id=9800f5b4 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/DecorativeEllipses.vue?vue&type=template&id=9800f5b4");


/***/ }),

/***/ "./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=template&id=0a032706":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=template&id=0a032706 ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_0a032706__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_0a032706__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_0a032706__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HeroButton.vue?vue&type=template&id=0a032706 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/HeroButton.vue?vue&type=template&id=0a032706");


/***/ }),

/***/ "./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=template&id=9b4ab69e":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=template&id=9b4ab69e ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_9b4ab69e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_9b4ab69e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_9b4ab69e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SectionHeader.vue?vue&type=template&id=9b4ab69e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public-components/SectionHeader.vue?vue&type=template&id=9b4ab69e");


/***/ }),

/***/ "./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_3794585a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Services.vue?vue&type=style&index=0&id=3794585a&scoped=true&lang=css");


/***/ })

}]);