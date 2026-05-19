"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_ContactUs_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ContactUs",
  metaInfo: {
    title: "Contact F16s | Support, Quotes & Partnerships",
    meta: [{
      name: 'description',
      content: 'Get in touch with the F16s expert team for technical support, customized pricing quotes, or partnership opportunities. We are here to help your logistics business grow.'
    }, {
      property: 'og:title',
      content: 'Contact F16s | Support, Quotes & Partnerships'
    }, {
      property: 'og:description',
      content: 'Get in touch with the F16s expert team for technical support, customized pricing quotes, or partnership opportunities. We are here to help your logistics business grow.'
    }]
  },
  components: {},
  data: function data() {
    return {
      productTypeOptions: [{
        value: 'Focus Air - Basic Plan',
        text: 'Focus Air - Basic Plan'
      }, {
        value: 'Focus Air - Pro Plan',
        text: 'Focus Air - Pro Plan'
      }],
      selectedProductTypeOptions: "",
      selectedQueryTypeOptions: ""
    };
  },
  methods: {
    handleSubmit: function handleSubmit() {
      // Handle quote submission logic
      console.log("Form submitted");
    }
  },
  mounted: function mounted() {
    if (this.$route.query.modal === 'quote') {
      this.$bvModal.show('show-quote-modal');
    } else if (this.$route.query.modal === 'query') {
      this.$bvModal.show('show-query-modal');
    }
  },
  watch: {
    '$route.query.modal': function $routeQueryModal(newVal) {
      if (newVal === 'quote') {
        this.$bvModal.show('show-quote-modal');
      } else if (newVal === 'query') {
        this.$bvModal.show('show-query-modal');
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=template&id=1824d174":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=template&id=1824d174 ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "content-container pb-30"
  }, [_c("section", {
    staticClass: "contact-hero-section mt-12 mt-lg-20 mb-20 text-center"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Get in Touch")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title mb-6"
  }, [_vm._v("How can we help you today?")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mb-10 mx-auto",
    staticStyle: {
      "max-width": "700px"
    }
  }, [_vm._v("\n          Whether you need technical support, a customized pricing quote, or just want to share feedback, our team is standing by to assist you. Select an option below to get started.\n      ")])]), _vm._v(" "), _c("section", {
    staticClass: "contact-options-section mb-30"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.show-query-modal",
      modifiers: {
        "show-query-modal": true
      }
    }],
    staticClass: "feature-card-wrapper",
    attrs: {
      role: "button",
      tabindex: "0"
    }
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 border-0"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "feature-icon-vector",
    attrs: {
      src: "/media/assets/vectors/customer-support.svg",
      alt: "Support Icon",
      "aria-hidden": "true"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title"
  }, [_vm._v("Have a Dispute or Query?")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc"
  }, [_vm._v("Facing any issues or have a query regarding our services? We’re committed to resolving them quickly. A Ticket Number will be generated for tracking.")]), _vm._v(" "), _c("div", {
    staticClass: "feature-footer mt-auto pt-6"
  }, [_c("div", {
    staticClass: "feature-link"
  }, [_c("span", [_vm._v("Submit Query")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right",
      "aria-hidden": "true"
    }
  })], 1)])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.show-quote-modal",
      modifiers: {
        "show-quote-modal": true
      }
    }],
    staticClass: "feature-card-wrapper",
    attrs: {
      role: "button",
      tabindex: "0"
    }
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 border-0"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "feature-icon-vector",
    attrs: {
      src: "/media/assets/vectors/affordable-awb.svg",
      alt: "Quote Icon",
      "aria-hidden": "true"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title"
  }, [_vm._v("Get a Customized Quote")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc"
  }, [_vm._v("Looking for the best pricing option for your business? Fill in the details, and we’ll provide a personalized quote tailored exactly to your operational needs.")]), _vm._v(" "), _c("div", {
    staticClass: "feature-footer mt-auto pt-6"
  }, [_c("div", {
    staticClass: "feature-link"
  }, [_c("span", [_vm._v("Request Quote")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right",
      "aria-hidden": "true"
    }
  })], 1)])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.show-feedback-modal",
      modifiers: {
        "show-feedback-modal": true
      }
    }],
    staticClass: "feature-card-wrapper",
    attrs: {
      role: "button",
      tabindex: "0"
    }
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 border-0"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "feature-icon-vector",
    attrs: {
      src: "/media/assets/vectors/scalable-performance.svg",
      alt: "Growth Icon",
      "aria-hidden": "true"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title"
  }, [_vm._v("Feedback & Opportunities")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc"
  }, [_vm._v("Share your feedback with us or let us know if you’re interested in joining our growing team. We highly appreciate your input and talent!")]), _vm._v(" "), _c("div", {
    staticClass: "feature-footer mt-auto pt-6"
  }, [_c("div", {
    staticClass: "feature-link"
  }, [_c("span", [_vm._v("Send Feedback")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right",
      "aria-hidden": "true"
    }
  })], 1)])])], 1)])], 1)], 1)]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "show-query-modal",
      "hide-header": "",
      "hide-footer": "",
      centered: "",
      size: "xl",
      "modal-class": "ultra-premium-modal"
    }
  }, [_c("div", {
    staticClass: "modal-split-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: function click($event) {
        return _vm.$bvModal.hide("show-query-modal");
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-left-pane query-pane"
  }, [_c("div", {
    staticClass: "pane-content"
  }, [_c("div", {
    staticClass: "pane-icon-wrapper mb-8"
  }, [_c("b-icon", {
    attrs: {
      icon: "chat-left-dots",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h2", {
    staticClass: "pane-title"
  }, [_vm._v("Submit a Query")]), _vm._v(" "), _c("p", {
    staticClass: "pane-subtitle"
  }, [_vm._v("We’re here to help. Fill out the details and our support team will resolve your issue quickly.")]), _vm._v(" "), _c("div", {
    staticClass: "pane-footer mt-auto"
  }, [_c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "clock-history"
    }
  }), _vm._v(" "), _c("span", [_vm._v("24/7 Dedicated Support")])], 1), _vm._v(" "), _c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "shield-check"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Priority Resolution")])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "pane-decoration"
  })]), _vm._v(" "), _c("div", {
    staticClass: "modal-right-pane"
  }, [_c("div", {
    staticClass: "form-scroll-container"
  }, [_c("form", {
    staticClass: "ultra-form"
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v("Query Details")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Full Name")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "email",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Email Address")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Company Name")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " "
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("User ID (Optional)")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " "
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Ticket Number (if existing)")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("textarea", {
    staticClass: "floating-input",
    attrs: {
      rows: "4",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Detailed Description")])])])], 1), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-4"
  }, [_c("button", {
    staticClass: "ultra-submit-btn",
    attrs: {
      type: "button"
    }
  }, [_c("span", [_vm._v("Submit Request")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "form-note mt-4"
  }, [_vm._v("You'll receive a confirmation email with your Ticket Number.")])])], 1)])])])]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "show-quote-modal",
      "hide-header": "",
      "hide-footer": "",
      centered: "",
      size: "xl",
      "modal-class": "ultra-premium-modal"
    }
  }, [_c("div", {
    staticClass: "modal-split-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: function click($event) {
        return _vm.$bvModal.hide("show-quote-modal");
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-left-pane quote-pane"
  }, [_c("div", {
    staticClass: "pane-content"
  }, [_c("div", {
    staticClass: "pane-icon-wrapper mb-8"
  }, [_c("b-icon", {
    attrs: {
      icon: "calculator",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h2", {
    staticClass: "pane-title"
  }, [_vm._v("Request a Custom Quote")]), _vm._v(" "), _c("p", {
    staticClass: "pane-subtitle"
  }, [_vm._v("Looking for the perfect pricing plan? Tell us about your operations and we'll tailor a quote specifically for your business.")]), _vm._v(" "), _c("div", {
    staticClass: "pane-footer mt-auto"
  }, [_c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "graph-up-arrow"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Scalable Solutions")])], 1), _vm._v(" "), _c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "tags"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Competitive Pricing")])], 1)])]), _vm._v(" "), _c("div", {
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
        return _vm.handleSubmit.apply(null, arguments);
      }
    }
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v("Business Profile")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Full Name")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "email",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Work Email")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Phone Number")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Designation")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Company Name")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "number",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Number of Employees")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selectedProductTypeOptions,
      expression: "selectedProductTypeOptions"
    }],
    staticClass: "floating-input floating-select",
    attrs: {
      required: ""
    },
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.selectedProductTypeOptions = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, [_c("option", {
    attrs: {
      value: "",
      disabled: "",
      selected: ""
    }
  }), _vm._v(" "), _vm._l(_vm.productTypeOptions, function (opt, idx) {
    return _c("option", {
      key: idx,
      domProps: {
        value: opt.value
      }
    }, [_vm._v(_vm._s(opt.text))]);
  })], 2), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Product of Interest")]), _vm._v(" "), _c("b-icon", {
    staticClass: "select-icon",
    attrs: {
      icon: "chevron-down"
    }
  })], 1)])], 1), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-4"
  }, [_c("button", {
    staticClass: "ultra-submit-btn",
    attrs: {
      type: "submit"
    }
  }, [_c("span", [_vm._v("Get Your Quote")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "form-note mt-4"
  }, [_vm._v("An expert will contact you within 1 business day.")])])], 1)])])])]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "show-feedback-modal",
      "hide-header": "",
      "hide-footer": "",
      centered: "",
      size: "xl",
      "modal-class": "ultra-premium-modal"
    }
  }, [_c("div", {
    staticClass: "modal-split-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: function click($event) {
        return _vm.$bvModal.hide("show-feedback-modal");
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-left-pane feedback-pane"
  }, [_c("div", {
    staticClass: "pane-content"
  }, [_c("div", {
    staticClass: "pane-icon-wrapper mb-8"
  }, [_c("b-icon", {
    attrs: {
      icon: "star",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h2", {
    staticClass: "pane-title"
  }, [_vm._v("We Value Your Input")]), _vm._v(" "), _c("p", {
    staticClass: "pane-subtitle"
  }, [_vm._v("Whether you're sharing feedback to help us improve or looking for exciting job opportunities, we want to hear from you.")]), _vm._v(" "), _c("div", {
    staticClass: "pane-footer mt-auto"
  }, [_c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "heart"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Community Driven")])], 1), _vm._v(" "), _c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "me-3",
    attrs: {
      icon: "briefcase"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Growing Fast")])], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "pane-decoration"
  })]), _vm._v(" "), _c("div", {
    staticClass: "modal-right-pane"
  }, [_c("div", {
    staticClass: "form-scroll-container"
  }, [_c("form", {
    staticClass: "ultra-form"
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v("Drop us a line")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Full Name")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "email",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Email Address")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("input", {
    staticClass: "floating-input",
    attrs: {
      type: "text",
      placeholder: " "
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Company (Optional)")])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-5",
    attrs: {
      md: "6"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.selectedQueryTypeOptions,
      expression: "selectedQueryTypeOptions"
    }],
    staticClass: "floating-input floating-select",
    attrs: {
      required: ""
    },
    on: {
      change: function change($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.selectedQueryTypeOptions = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }
    }
  }, [_c("option", {
    attrs: {
      value: "",
      disabled: "",
      selected: ""
    }
  }), _vm._v(" "), _c("option", {
    attrs: {
      value: "Feedback"
    }
  }, [_vm._v("Platform Feedback")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "Job enquiry"
    }
  }, [_vm._v("Job Enquiry")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "Partnership"
    }
  }, [_vm._v("Partnership")])]), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Topic")]), _vm._v(" "), _c("b-icon", {
    staticClass: "select-icon",
    attrs: {
      icon: "chevron-down"
    }
  })], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      md: "12"
    }
  }, [_c("div", {
    staticClass: "floating-input-group"
  }, [_c("textarea", {
    staticClass: "floating-input",
    attrs: {
      rows: "4",
      placeholder: " ",
      required: ""
    }
  }), _vm._v(" "), _c("label", {
    staticClass: "floating-label"
  }, [_vm._v("Your Message")])])])], 1), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-4"
  }, [_c("button", {
    staticClass: "ultra-submit-btn",
    attrs: {
      type: "button"
    }
  }, [_c("span", [_vm._v("Send Message")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "form-note mt-4"
  }, [_vm._v("Thanks for taking the time to connect with us.")])])], 1)])])])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n/* ULTRA PREMIUM MODAL REDESIGN */\n.ultra-premium-modal .modal-dialog {\n    max-width: 1100px !important;\n    margin: 1.75rem auto;\n}\n.ultra-premium-modal .modal-content {\n    background: transparent !important;\n    border: none !important;\n    border-radius: 32px !important;\n    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;\n    font-family: 'Inter', sans-serif !important;\n    overflow: hidden;\n}\n.ultra-premium-modal .modal-body {\n    padding: 0 !important;\n    background: #ffffff;\n}\n\n/* Split Layout */\n.modal-split-layout {\n    display: flex;\n    flex-direction: row;\n    min-height: 700px;\n    position: relative;\n}\n.ultra-close-btn {\n    position: absolute;\n    top: 25px;\n    right: 25px;\n    width: 44px;\n    height: 44px;\n    border-radius: 50%;\n    background: rgba(0,0,0,0.05);\n    border: none;\n    color: #5A6B8A;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 1.5rem;\n    cursor: pointer;\n    z-index: 50;\n    transition: all 0.3s ease;\n}\n.ultra-close-btn:hover {\n    background: #ef4444;\n    color: white;\n    transform: rotate(90deg);\n}\n\n/* Left Pane Styles */\n.modal-left-pane {\n    flex: 0 0 40%;\n    padding: 4rem 3.5rem;\n    position: relative;\n    overflow: hidden;\n    color: white;\n    display: flex;\n    flex-direction: column;\n}\n\n/* Different gradients for different modals */\n.query-pane {\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n}\n.quote-pane {\n    background: linear-gradient(135deg, #2a4476 0%, #4a72c9 100%);\n}\n.feedback-pane {\n    background: linear-gradient(135deg, #1c3361 0%, #3a5c9f 100%);\n}\n.pane-content {\n    position: relative;\n    z-index: 2;\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n}\n.pane-icon-wrapper {\n    width: 80px;\n    height: 80px;\n    background: rgba(255,255,255,0.25);\n    border-radius: 24px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n    border: 1px solid rgba(255,255,255,0.2);\n}\n.pane-title {\n    font-size: 2.25rem;\n    font-weight: 800;\n    margin-bottom: 1rem;\n    letter-spacing: -0.5px;\n    line-height: 1.1;\n}\n.pane-subtitle {\n    font-size: 1.1rem;\n    line-height: 1.7;\n    opacity: 0.85;\n}\n.pane-feature {\n    display: flex;\n    align-items: center;\n    margin-bottom: 1rem;\n    font-size: 1rem;\n    font-weight: 500;\n}\n.pane-feature:last-child {\n    margin-bottom: 0;\n}\n.pane-decoration {\n    position: absolute;\n    bottom: -150px;\n    left: -150px;\n    width: 500px;\n    height: 500px;\n    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);\n    border-radius: 50%;\n    z-index: 1;\n}\n\n/* Right Pane Styles */\n.modal-right-pane {\n    flex: 0 0 60%;\n    background: white;\n    position: relative;\n}\n.form-scroll-container {\n    height: 100%;\n    overflow-y: auto;\n    padding: 4.5rem 4rem;\n}\n\n/* Custom Scrollbar for form */\n.form-scroll-container::-webkit-scrollbar {\n    width: 6px;\n}\n.form-scroll-container::-webkit-scrollbar-track {\n    background: rgba(0,0,0,0.02);\n}\n.form-scroll-container::-webkit-scrollbar-thumb {\n    background: rgba(53, 85, 148, 0.2);\n    border-radius: 10px;\n}\n.form-section-title {\n    font-size: 1.5rem;\n    font-weight: 700;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n}\n\n/* Floating Input Group */\n.floating-input-group {\n    position: relative;\n    width: 100%;\n}\n.floating-input {\n    width: 100%;\n    background: #f8fafc;\n    border: 1px solid transparent;\n    border-bottom: 2px solid #e2e8f0;\n    border-radius: 12px 12px 0 0;\n    padding: 24px 16px 8px 16px;\n    font-size: 1rem;\n    color: #1e3a6e;\n    font-weight: 500;\n    transition: all 0.3s ease;\n    font-family: 'Inter', sans-serif;\n}\n.floating-input:focus {\n    background: #f0f7ff;\n    border-bottom-color: #355594;\n    outline: none;\n}\ntextarea.floating-input {\n    min-height: 120px;\n    resize: vertical;\n}\n.floating-label {\n    position: absolute;\n    left: 16px;\n    top: 16px;\n    font-size: 1rem;\n    color: #64748b;\n    pointer-events: none;\n    transition: all 0.2s ease;\n    font-weight: 500;\n}\n\n/* Floating label active state */\n.floating-input:not(:-moz-placeholder) ~ .floating-label {\n    top: 6px;\n    font-size: 0.75rem;\n    color: #355594;\n    font-weight: 600;\n}\n.floating-input:focus ~ .floating-label,\n.floating-input:not(:placeholder-shown) ~ .floating-label,\n.floating-select:valid ~ .floating-label {\n    top: 6px;\n    font-size: 0.75rem;\n    color: #355594;\n    font-weight: 600;\n}\n\n/* Custom Select tweaks */\n.floating-select {\n    -webkit-appearance: none;\n       -moz-appearance: none;\n            appearance: none;\n    cursor: pointer;\n}\n.select-icon {\n    position: absolute;\n    right: 16px;\n    top: 50%;\n    transform: translateY(-50%);\n    color: #64748b;\n    pointer-events: none;\n}\n\n/* Submit Action Area */\n.form-actions {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n}\n.ultra-submit-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none;\n}\n.ultra-submit-btn:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35);\n}\n.ultra-submit-btn span { color: white; font-weight: 500; margin-right: 14px;\n}\n.ultra-submit-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important;\n}\n.form-note {\n    font-size: 0.85rem;\n    color: #94a3b8;\n    font-weight: 500;\n}\n\n/* Responsive adjustments */\n@media (max-width: 991px) {\n.modal-split-layout {\n        flex-direction: column;\n        min-height: auto;\n}\n.modal-left-pane {\n        flex: 0 0 auto;\n        padding: 3rem 2rem;\n}\n.pane-title {\n        font-size: 1.8rem;\n}\n.pane-icon-wrapper {\n        width: 60px;\n        height: 60px;\n        margin-bottom: 1.5rem !important;\n}\n.modal-right-pane {\n        flex: 0 0 auto;\n}\n.form-scroll-container {\n        padding: 3rem 2rem;\n        height: auto;\n        max-height: 60vh;\n}\n.ultra-close-btn {\n        top: 15px;\n        right: 15px;\n        background: rgba(255,255,255,0.2);\n        color: white;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_1824d174_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_1824d174_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_1824d174_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/public/ContactUs.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/public/ContactUs.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ContactUs_vue_vue_type_template_id_1824d174__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=template&id=1824d174 */ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=template&id=1824d174");
/* harmony import */ var _ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=script&lang=js");
/* harmony import */ var _ContactUs_vue_vue_type_style_index_0_id_1824d174_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css */ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ContactUs_vue_vue_type_template_id_1824d174__WEBPACK_IMPORTED_MODULE_0__.render,
  _ContactUs_vue_vue_type_template_id_1824d174__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/ContactUs.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/ContactUs.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=template&id=1824d174":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/ContactUs.vue?vue&type=template&id=1824d174 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_template_id_1824d174__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_template_id_1824d174__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_template_id_1824d174__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=template&id=1824d174 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=template&id=1824d174");


/***/ }),

/***/ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_1824d174_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css");


/***/ })

}]);