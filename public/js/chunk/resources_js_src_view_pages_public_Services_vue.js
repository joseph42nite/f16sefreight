"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_Services_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/DecorativeEllipses.vue */ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue");
/* harmony import */ var _components_SectionHeader_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/SectionHeader.vue */ "./resources/js/src/view/pages/public/components/SectionHeader.vue");
/* harmony import */ var _components_HeroButton_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/HeroButton.vue */ "./resources/js/src/view/pages/public/components/HeroButton.vue");



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
    DecorativeEllipses: _components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    SectionHeader: _components_SectionHeader_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    HeroButton: _components_HeroButton_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      services: [{
        imgSrc: "/media/assets/illustrations/amico.png",
        title: "Advanced EDI Gateway",
        desc: "High-speed data transfer for FWB, FHL, and FZB messaging, ensuring seamless connectivity between forwarders and 150+ airlines.",
        features: ["e-AWB IATA Compliance", "Real-time Manifest Transfer", "Automated Error Validation"]
      }, {
        imgSrc: "/media/assets/illustrations/cuate.png",
        title: "MAWB & HAWB Logic",
        desc: "Enterprise-grade tools for managing Master and House Air Waybills with full version history and secure document archiving.",
        features: ["Consolidation Tools", "Automated Documentation", "Digital History Logs"]
      }, {
        imgSrc: "/media/assets/illustrations/pana.png",
        title: "Logistics Intelligence ERP",
        desc: "A comprehensive ERP system designed specifically for the freight industry to monitor operational performance and financial growth.",
        features: ["Shipment Lifecycle Tracking", "Vendor Performance KPIs", "Revenue Analytics"]
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=template&id=794f1590&scoped=true":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=template&id=794f1590&scoped=true ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      src: "/media/assets/illustrations/amico.png",
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
      src: "/media/assets/illustrations/pana.png",
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

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.content-container[data-v-794f1590] {\r\n    position: relative;\r\n    z-index: 10;\r\n    padding-top: 0;\n}\r\n\r\n/* Typography Enhancements */\n.section-title[data-v-794f1590] {\r\n    font-size: 3.5rem;\r\n    font-weight: 800;\n}\n.section-heading[data-v-794f1590] {\r\n    font-size: 2.5rem;\r\n    font-weight: 800;\r\n    color: #1e3a6e;\r\n    letter-spacing: -0.5px;\r\n    line-height: 1.2;\n}\n.text-gradient[data-v-794f1590] {\r\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\r\n    -webkit-background-clip: text;\r\n    -webkit-text-fill-color: transparent;\r\n    display: inline;\r\n    padding-right: 0.1em;\n}\r\n\r\n/* Feature Deep Dive Images */\n.feature-image-wrapper[data-v-794f1590] {\r\n    position: relative;\r\n    border-radius: 32px;\r\n    padding: 2rem;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\n}\n.feature-glow[data-v-794f1590] {\r\n    position: absolute;\r\n    inset: 0;\r\n    background: radial-gradient(circle at center, rgba(171, 192, 255, 0.5) 0%, transparent 70%);\n}\n.feature-glow.alt-glow[data-v-794f1590] {\r\n    background: radial-gradient(circle at center, rgba(187, 226, 255, 0.5) 0%, transparent 70%);\n}\n.feature-img[data-v-794f1590] {\r\n    position: relative;\r\n    z-index: 1;\r\n    filter: drop-shadow(0 30px 60px rgba(53, 85, 148, 0.15));\r\n    transition: transform 0.5s ease;\r\n    max-height: 400px;\n}\n.feature-image-wrapper:hover .feature-img[data-v-794f1590] {\r\n    transform: translateY(-10px);\n}\r\n\r\n/* Stat Boxes & Lists */\n.stat-box[data-v-794f1590] {\r\n    background: white;\r\n    border-radius: 20px;\r\n    padding: 1.5rem 2rem;\r\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);\r\n    border: 1px solid rgba(230, 240, 255, 1);\n}\n.stat-number[data-v-794f1590] {\r\n    font-size: 2.5rem;\r\n    font-weight: 800;\r\n    color: #1e3a6e;\r\n    margin-bottom: 0.25rem;\n}\n.stat-label[data-v-794f1590] {\r\n    font-size: 0.9rem;\r\n    font-weight: 600;\r\n    color: #5A6B8A;\r\n    text-transform: uppercase;\r\n    letter-spacing: 1px;\n}\n.feature-bullet-list li[data-v-794f1590] {\r\n    font-size: 1.15rem;\r\n    color: #4A5E80;\r\n    font-weight: 500;\r\n    display: flex;\r\n    align-items: center;\n}\r\n\r\n/* Commitment Card */\n.commitment-card[data-v-794f1590] { position: relative;\n}\n.commitment-glow[data-v-794f1590] {\r\n    position: absolute;\r\n    inset: -2px;\r\n    background: linear-gradient(135deg, #355594, #ABC0FF);\r\n    border-radius: 40px;\r\n    opacity: 0.3;\r\n    filter: blur(25px);\r\n    z-index: 0;\n}\n.glass-card[data-v-794f1590] {\r\n    background: rgba(255, 255, 255, 0.85);\r\n    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);\r\n    border: 1px solid rgba(255, 255, 255, 0.7);\r\n    border-radius: 40px;\r\n    box-shadow: 0 20px 50px rgba(53, 85, 148, 0.05);\n}\n.commitment-icon-wrapper[data-v-794f1590] {\r\n    position: relative;\r\n    width: 250px;\r\n    height: 250px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\n}\n.icon-ring[data-v-794f1590] {\r\n    position: absolute;\r\n    width: 100%;\r\n    height: 100%;\r\n    background: #f0f7ff;\r\n    border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\r\n    animation: morph-794f1590 8s ease-in-out infinite;\n}\n.commitment-icon[data-v-794f1590] { position: relative; z-index: 1; color: #355594;\n}\n@keyframes morph-794f1590 {\n0% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n}\n50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;\n}\n100% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n}\n}\r\n\r\n/* Final CTA Card */\n.final-cta-card[data-v-794f1590] {\r\n    position: relative;\r\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\r\n    border-radius: 40px;\r\n    overflow: hidden;\r\n    box-shadow: 0 30px 60px rgba(30, 58, 110, 0.25);\n}\n.cta-overlay-glow[data-v-794f1590] {\r\n    position: absolute;\r\n    top: -50%;\r\n    right: -20%;\r\n    width: 80%;\r\n    height: 150%;\r\n    background: radial-gradient(circle, rgba(171, 192, 255, 0.15) 0%, transparent 70%);\r\n    transform: rotate(-15deg);\n}\n@media (max-width: 991px) {\n.section-title[data-v-794f1590] { font-size: 2.5rem;\n}\n.commitment-content[data-v-794f1590], .cta-inner-content[data-v-794f1590] { padding: 3rem 2rem;\n}\n}\n@media (max-width: 767px) {\n.section-title[data-v-794f1590] { font-size: 2.1rem;\n}\n}\r\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_794f1590_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_794f1590_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_794f1590_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/public/Services.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/public/Services.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Services_vue_vue_type_template_id_794f1590_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Services.vue?vue&type=template&id=794f1590&scoped=true */ "./resources/js/src/view/pages/public/Services.vue?vue&type=template&id=794f1590&scoped=true");
/* harmony import */ var _Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Services.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/Services.vue?vue&type=script&lang=js");
/* harmony import */ var _Services_vue_vue_type_style_index_0_id_794f1590_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css */ "./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Services_vue_vue_type_template_id_794f1590_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Services_vue_vue_type_template_id_794f1590_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "794f1590",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/Services.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/Services.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Services.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/Services.vue?vue&type=template&id=794f1590&scoped=true":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Services.vue?vue&type=template&id=794f1590&scoped=true ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_template_id_794f1590_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_template_id_794f1590_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_template_id_794f1590_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=template&id=794f1590&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=template&id=794f1590&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_794f1590_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css");


/***/ })

}]);