"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Privacy_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Privacy",
  components: {},
  data: function data() {
    return {
      accordions: [{
        title: "Who has access to my company's sensitive data?",
        content: "At F16s, we implement strict role-based access controls. Only explicitly authorized personnel within your organization and our essential security team can access specific data points.",
        isOpen: false
      }, {
        title: "Is my data shared with third parties or airlines?",
        content: "Your data is used exclusively for processing your requested freight operations. We never sell, share, or expose your business intelligence to third parties without your direct operational intent.",
        isOpen: false
      }, {
        title: "How does F16s comply with global privacy regulations?",
        content: "We adhere to international data protection standards, including GDPR. Our systems are designed with privacy-by-design principles to ensure compliance across different global regions.",
        isOpen: false
      }, {
        title: "Can I request permanent deletion of my data?",
        content: "Yes, upon account closure or specific request, we provide permanent data deletion services in accordance with our data retention policies and legal requirements.",
        isOpen: false
      }]
    };
  },
  methods: {
    toggleAccordion: function toggleAccordion(index) {
      this.accordions[index].isOpen = !this.accordions[index].isOpen;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true ***!
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
    staticClass: "privacy-hero text-center mb-16 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Your Privacy, Our Priority")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("Privacy")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n        At F16s, we take your privacy seriously. We ensure that your sensitive business information is handled with the highest level of confidentiality and care. Our privacy practices include:\n      ")]), _vm._v(" "), _c("div", {
    staticClass: "video-placeholder-wrap mt-10"
  }, [_c("div", {
    staticClass: "video-placeholder"
  }, [_c("div", {
    staticClass: "video-placeholder-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "play-btn"
  }, [_c("b-icon", {
    staticClass: "play-icon",
    attrs: {
      icon: "play-fill"
    }
  })], 1)])])]), _vm._v(" "), _c("section", {
    staticClass: "privacy-features mb-25 mt-16"
  }, [_c("b-row", {
    staticClass: "justify-content-center text-center"
  }, [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "3",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/strict-access.svg",
      alt: "Strict Access Controls"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Strict Access Controls")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("We implement stringent access controls, ensuring only authorized personnel can view or manage your data. This ensures that your business information stays private and protected.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "3",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/privacy-regu.svg",
      alt: "Privacy Regulations"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Privacy Regulations")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("F16s adheres to global data privacy standards, such as GDPR and other local regulations, guaranteeing that your business stays compliant with the laws in your region.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "3",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/data-encription.svg",
      alt: "Data Encryption"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Data Encryption")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("All data transmitted through our systems is encrypted, ensuring that it remains secure from unauthorized access at all times.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "3",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/trasparent-data.svg",
      alt: "Transparent Data Handling"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Transparent Data Handling")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("We are transparent about how we collect, use, and store your information. You can trust that your data is used solely for operational purposes, with no unnecessary exposure.")])])], 1)])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "privacy-cta-section mb-25 text-center"
  }, [_c("div", {
    staticClass: "feature-card-wrapper cta-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "feature-card cta-card align-items-center"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Concerned about Privacy?")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mb-8",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n              Contact us to learn more about how F16s protects your business data and maintains your privacy.\n            ")]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon ms-2",
    attrs: {
      icon: "arrow-right"
    }
  })], 1)], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "privacy-faq-section mb-16"
  }, [_c("div", {
    staticClass: "text-center mb-12"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("FAQs")])]), _vm._v(" "), _c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "faq-accordion-list"
  }, _vm._l(_vm.accordions, function (faq, idx) {
    return _c("article", {
      key: idx,
      staticClass: "faq-item",
      "class": {
        "is-open": faq.isOpen
      }
    }, [_c("div", {
      staticClass: "faq-header",
      attrs: {
        role: "button",
        "aria-expanded": faq.isOpen.toString(),
        "aria-controls": "faq-content-".concat(idx)
      },
      on: {
        click: function click($event) {
          return _vm.toggleAccordion(idx);
        }
      }
    }, [_c("h3", {
      staticClass: "faq-question"
    }, [_vm._v(_vm._s(faq.title))]), _vm._v(" "), _c("div", {
      staticClass: "faq-toggle-icon"
    }, [_c("div", {
      staticClass: "icon-line horizontal"
    }), _vm._v(" "), _c("div", {
      staticClass: "icon-line vertical",
      "class": {
        "is-hidden": faq.isOpen
      }
    })])]), _vm._v(" "), _c("b-collapse", {
      attrs: {
        id: "faq-content-".concat(idx)
      },
      model: {
        value: faq.isOpen,
        callback: function callback($$v) {
          _vm.$set(faq, "isOpen", $$v);
        },
        expression: "faq.isOpen"
      }
    }, [_c("div", {
      staticClass: "faq-body"
    }, [_c("p", [_vm._v(_vm._s(faq.content))])])])], 1);
  }), 0)])], 1)], 1)])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-7ba4c13c] {\n    font-family: 'Inter', sans-serif;\n    position: relative;\n    overflow-x: hidden;\n}\n\n/* Decorative background elements */\n.decorative-ellipses .ellipse[data-v-7ba4c13c] {\n    position: absolute;\n    border-radius: 50%;\n    filter: blur(80px);\n    z-index: 0;\n    opacity: 0.5;\n}\n.ellipse-tl[data-v-7ba4c13c] { width: 400px; height: 400px; background: #D0E6F8; top: -100px; left: -100px;\n}\n.ellipse-tr[data-v-7ba4c13c] { width: 300px; height: 300px; background: #E6F0FF; top: 20%; right: -50px;\n}\n.ellipse-br[data-v-7ba4c13c] { width: 500px; height: 500px; background: #F0F7FF; bottom: 10%; left: 20%;\n}\n.content-container[data-v-7ba4c13c] {\n    position: relative;\n    z-index: 10;\n}\n\n/* Typography Standardized */\n.section-title[data-v-7ba4c13c] {\n    font-size: 3rem;\n    font-weight: 800;\n    color: #1e3a8a;\n    letter-spacing: -1px;\n    margin-bottom: 0.5rem;\n}\n.section-subtitle[data-v-7ba4c13c] {\n    font-size: 1.15rem;\n    color: #4A5E80;\n    line-height: 1.6;\n}\n.section-eyebrow[data-v-7ba4c13c] {\n    text-transform: uppercase;\n    letter-spacing: 2px;\n    font-size: 0.85rem;\n    font-weight: 700;\n    color: #355594;\n    opacity: 0.6;\n    margin-bottom: 1rem;\n    display: block;\n}\n\n/* Hero Button */\n.hero-btn[data-v-7ba4c13c] {\n    background: #355594;\n    border: none;\n    border-radius: 999px;\n    padding: 10px 10px 10px 22px;\n    display: inline-flex;\n    align-items: center;\n    transition: all 0.3s ease;\n    text-decoration: none;\n}\n.hero-btn[data-v-7ba4c13c]:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25);\n    color: white;\n}\n.hero-btn span[data-v-7ba4c13c] {\n    color: white;\n    font-weight: 500;\n    margin-right: 14px;\n}\n.hero-btn .btn-icon[data-v-7ba4c13c] {\n    background: white;\n    color: #355594;\n    border-radius: 50%;\n    width: 32px;\n    height: 32px;\n    padding: 8px;\n}\n\n/* Video Placeholder (Standardized) */\n.video-placeholder-wrap[data-v-7ba4c13c] {\n    position: relative;\n    width: 100%;\n    max-width: 900px;\n    margin: 0 auto;\n}\n.video-placeholder[data-v-7ba4c13c] {\n    position: relative;\n    width: 100%;\n    aspect-ratio: 16 / 9;\n    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);\n    -webkit-backdrop-filter: blur(10px);\n            backdrop-filter: blur(10px);\n    border-radius: 32px;\n    border: 1px solid rgba(255, 255, 255, 0.5);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);\n}\n.video-placeholder-glow[data-v-7ba4c13c] {\n    position: absolute;\n    width: 60%;\n    height: 60%;\n    background: radial-gradient(circle, rgba(53, 85, 148, 0.2) 0%, transparent 70%);\n    filter: blur(40px);\n}\n.play-btn[data-v-7ba4c13c] {\n    width: 80px;\n    height: 80px;\n    background: white;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n    box-shadow: 0 10px 20px rgba(0,0,0,0.1);\n    z-index: 2;\n}\n.play-btn[data-v-7ba4c13c]:hover {\n    transform: scale(1.15);\n    box-shadow: 0 15px 30px rgba(53, 85, 148, 0.2);\n}\n.play-icon[data-v-7ba4c13c] {\n    color: #355594;\n    font-size: 2rem;\n    margin-left: 5px;\n}\n\n/* Feature Cards (Glassmorphism) */\n.feature-card-wrapper[data-v-7ba4c13c] {\n    position: relative;\n    height: 100%;\n    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);\n}\n.feature-card-glow[data-v-7ba4c13c] {\n    position: absolute;\n    inset: -2px;\n    background: linear-gradient(135deg, #355594, #ABC0FF);\n    border-radius: 34px;\n    opacity: 0;\n    filter: blur(15px);\n    transition: opacity 0.4s ease;\n    z-index: 0;\n}\n.feature-card[data-v-7ba4c13c] {\n    position: relative;\n    z-index: 1;\n    border: 1px solid rgba(255, 255, 255, 0.5);\n    border-radius: 32px;\n    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);\n    -webkit-backdrop-filter: blur(20px);\n            backdrop-filter: blur(20px);\n    padding: 2.5rem;\n    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);\n    display: flex;\n    flex-direction: column;\n    box-shadow: \n        0 4px 10px rgba(0, 0, 0, 0.02),\n        inset 0 0 0 1px rgba(255, 255, 255, 0.6);\n}\n.feature-card[data-v-7ba4c13c] .card-body {\n    padding: 0;\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n}\n.feature-icon-container[data-v-7ba4c13c] {\n    position: relative;\n    width: 120px;\n    height: 120px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin: 0 auto 2.5rem auto;\n}\n.icon-circle[data-v-7ba4c13c] {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: #F0F7FF;\n    border-radius: 32px;\n    transform: rotate(45deg);\n    transition: all 0.4s ease;\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.05);\n}\n.feature-icon-svg[data-v-7ba4c13c] {\n    position: relative;\n    z-index: 2;\n    color: #355594;\n    transition: all 0.5s ease;\n}\n.feature-icon[data-v-7ba4c13c] {\n    width: 64px;\n    height: 64px;\n    -o-object-fit: contain;\n       object-fit: contain;\n    position: relative;\n    z-index: 2;\n}\n.feature-title[data-v-7ba4c13c] {\n    color: #1e3a6e;\n    font-weight: 800;\n    font-size: 1.4rem;\n    margin-bottom: 1.25rem;\n    letter-spacing: -0.5px;\n}\n.feature-desc[data-v-7ba4c13c] {\n    color: #5A6B8A;\n    font-size: 1rem;\n    line-height: 1.7;\n    margin-bottom: 2rem;\n    opacity: 0.9;\n}\n\n/* Hover States */\n.feature-card-wrapper[data-v-7ba4c13c]:hover {\n    transform: translateY(-8px);\n}\n.feature-card-wrapper:hover .feature-card-glow[data-v-7ba4c13c] {\n    opacity: 0.25;\n}\n.feature-card-wrapper:hover .feature-card[data-v-7ba4c13c] {\n    background: rgba(255, 255, 255, 0.95);\n    border-color: #ABC0FF;\n    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.1);\n}\n.feature-card-wrapper:hover .icon-circle[data-v-7ba4c13c] {\n    background: #355594;\n    transform: rotate(45deg) scale(1.05);\n}\n.feature-card-wrapper:hover .feature-icon-svg[data-v-7ba4c13c] {\n    color: white;\n}\n.feature-card-wrapper:hover .feature-icon[data-v-7ba4c13c] {\n    filter: brightness(0) invert(1);\n}\n\n/* CTA Specific (Copied from SB) */\n.cta-wrapper[data-v-7ba4c13c] {\n    max-width: 900px;\n    margin: 0 auto;\n}\n.cta-card[data-v-7ba4c13c] {\n    padding: 4rem 2rem;\n    text-align: center;\n}\n\n/* FAQs Specific */\n.faq-accordion-list[data-v-7ba4c13c] {\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n}\n.faq-item[data-v-7ba4c13c] {\n    background: rgba(255, 255, 255, 0.7);\n    -webkit-backdrop-filter: blur(10px);\n            backdrop-filter: blur(10px);\n    border: 1px solid rgba(255, 255, 255, 0.5);\n    border-radius: 20px;\n    overflow: hidden;\n    transition: all 0.3s ease;\n    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);\n}\n.faq-item[data-v-7ba4c13c]:hover {\n    background: rgba(255, 255, 255, 0.9);\n    border-color: #ABC0FF;\n}\n.faq-item.is-open[data-v-7ba4c13c] {\n    border-color: #355594;\n    background: #ffffff;\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);\n}\n.faq-header[data-v-7ba4c13c] {\n    padding: 1.5rem;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n}\n.faq-question[data-v-7ba4c13c] {\n    font-size: 1.1rem;\n    font-weight: 700;\n    color: #1e3a6e;\n    margin: 0;\n    padding-right: 2rem;\n}\n.faq-toggle-icon[data-v-7ba4c13c] {\n    position: relative;\n    width: 20px;\n    height: 20px;\n    flex-shrink: 0;\n}\n.icon-line[data-v-7ba4c13c] {\n    position: absolute;\n    background-color: #355594;\n    transition: transform 0.3s ease, opacity 0.3s ease;\n    border-radius: 2px;\n}\n.icon-line.horizontal[data-v-7ba4c13c] {\n    width: 20px;\n    height: 2px;\n    top: 9px;\n    left: 0;\n}\n.icon-line.vertical[data-v-7ba4c13c] {\n    width: 2px;\n    height: 20px;\n    top: 0;\n    left: 9px;\n}\n.icon-line.vertical.is-hidden[data-v-7ba4c13c] {\n    transform: scaleY(0);\n    opacity: 0;\n}\n.faq-body[data-v-7ba4c13c] {\n    padding: 0 1.5rem 1.5rem;\n    color: #4A5E80;\n    line-height: 1.7;\n}\n.faq-body p[data-v-7ba4c13c] {\n    margin: 0;\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n.section-title[data-v-7ba4c13c] {\n        font-size: 2.25rem;\n}\n.feature-card[data-v-7ba4c13c] {\n        padding: 1.5rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_style_index_0_id_7ba4c13c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_style_index_0_id_7ba4c13c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_style_index_0_id_7ba4c13c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/Privacy.vue":
/*!*************************************************!*\
  !*** ./resources/js/src/view/pages/Privacy.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Privacy_vue_vue_type_template_id_7ba4c13c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true */ "./resources/js/src/view/pages/Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true");
/* harmony import */ var _Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Privacy.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Privacy.vue?vue&type=script&lang=js");
/* harmony import */ var _Privacy_vue_vue_type_style_index_0_id_7ba4c13c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css */ "./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Privacy_vue_vue_type_template_id_7ba4c13c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Privacy_vue_vue_type_template_id_7ba4c13c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "7ba4c13c",
  null
  
)

/* hot reload */
if (false) // removed by dead control flow
{ var api; }
component.options.__file = "resources/js/src/view/pages/Privacy.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/Privacy.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/pages/Privacy.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Privacy.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_style_index_0_id_7ba4c13c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=style&index=0&id=7ba4c13c&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_template_id_7ba4c13c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_template_id_7ba4c13c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_template_id_7ba4c13c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Privacy.vue?vue&type=template&id=7ba4c13c&scoped=true");


/***/ })

}]);