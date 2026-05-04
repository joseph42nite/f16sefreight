"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_BlogPost_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BlogPost",
  data: function data() {
    return {
      readingProgress: 0,
      currentUrl: window.location.href,
      copyStatus: 'Copy Link',
      post: {
        title: "The Future of E-Freight: How AI is Transforming Air Waybill Management",
        category: "Technology",
        date: "May 02, 2026",
        readTime: "6 min",
        image: "/media/custome/gallary/img-2.png",
        excerpt: "As the logistics industry shifts towards complete digitalization, Artificial Intelligence is moving from a buzzword to a critical operational tool.",
        content: "\n            <p>The global air cargo industry is undergoing a seismic shift. For decades, the Master Air Waybill (MAWB) and House Air Waybill (HAWB) were paper-heavy, manual processes prone to human error and delays. Today, the rise of e-freight standards and the integration of AI are changing the game.</p>\n            \n            <h3>The Transition to Paperless Cargo</h3>\n            <p>IATA's e-AWB initiative has been the cornerstone of this transformation. By digitizing the core contract of carriage, forwarders are seeing significantly reduced processing times. But the real breakthrough isn't just digitalization\u2014it's <strong>automation</strong>.</p>\n            \n            <p>With F16s, the data from your ERP doesn't just sit in a database; it flows seamlessly through EDI gateways directly to airlines. This eliminates the \"double entry\" problem that has plagued the industry for years.</p>\n            \n            <h3>How AI Fits In</h3>\n            <p>Modern AI algorithms can now perform \"Logic Validations\" on AWB data before it even hits the airline system. It can detect weight discrepancies, incorrect airport codes, and missing manifest data in milliseconds.</p>\n            \n            <p>Future iterations will see AI predicting potential custom delays based on historical data patterns, allowing forwarders to proactively reroute or adjust documentation before a shipment is even loaded.</p>\n        ",
        takeaways: ["Digitalization is no longer optional; it is a prerequisite for global competition.", "AI-driven validation reduces documentation errors by up to 99%.", "EDI connectivity (FWB, FHL) is the backbone of the modern e-freight ecosystem."]
      },
      relatedPosts: [{
        title: "Standardizing EDI Connectivity for Small Forwarders",
        slug: "standardizing-edi",
        image: "/media/custome/gallary/img-3.png"
      }, {
        title: "Global Supply Chain Trends to Watch in 2026",
        slug: "trends-2026",
        image: "/media/custome/gallary/img-4.png"
      }]
    };
  },
  mounted: function mounted() {
    window.addEventListener('scroll', this.updateProgress);
  },
  destroyed: function destroyed() {
    window.removeEventListener('scroll', this.updateProgress);
  },
  methods: {
    updateProgress: function updateProgress() {
      var scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = window.scrollY;
      this.readingProgress = scrolled / scrollH * 100;
    },
    copyToClipboard: function copyToClipboard() {
      var _this = this;
      navigator.clipboard.writeText(this.currentUrl).then(function () {
        _this.copyStatus = 'Copied!';
        setTimeout(function () {
          _this.copyStatus = 'Copy Link';
        }, 2000);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("b-container", {
    staticClass: "content-container py-12"
  }, [_c("div", {
    staticClass: "reading-progress-container"
  }, [_c("div", {
    staticClass: "reading-progress-bar",
    style: {
      width: _vm.readingProgress + "%"
    }
  })]), _vm._v(" "), _c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      lg: "8",
      xl: "7"
    }
  }, [_c("nav", {
    staticClass: "blog-breadcrumb mb-8"
  }, [_c("router-link", {
    attrs: {
      to: "/blogs-and-news"
    }
  }, [_vm._v("Blogs & News")]), _vm._v(" "), _c("span", {
    staticClass: "mx-2"
  }, [_vm._v("/")]), _vm._v(" "), _c("span", {
    staticClass: "current-crumb"
  }, [_vm._v(_vm._s(_vm.post.category))])], 1), _vm._v(" "), _c("header", {
    staticClass: "post-header mb-12"
  }, [_c("div", {
    staticClass: "post-meta mb-4"
  }, [_c("span", {
    staticClass: "post-category-pill"
  }, [_vm._v(_vm._s(_vm.post.category))]), _vm._v(" "), _c("span", {
    staticClass: "post-read-time ms-4"
  }, [_c("b-icon", {
    staticClass: "me-1",
    attrs: {
      icon: "clock"
    }
  }), _vm._v(" " + _vm._s(_vm.post.readTime) + " read")], 1)]), _vm._v(" "), _c("h1", {
    staticClass: "post-title mb-6"
  }, [_vm._v(_vm._s(_vm.post.title))]), _vm._v(" "), _c("div", {
    staticClass: "author-info d-flex align-items-center"
  }, [_c("div", {
    staticClass: "author-avatar me-4"
  }, [_c("img", {
    staticClass: "img-fluid rounded-circle",
    attrs: {
      src: "/media/custome/avatar-placeholder.png",
      alt: "Author"
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "author-details"
  }, [_c("span", {
    staticClass: "author-name d-block"
  }, [_vm._v("F16s Editorial Team")]), _vm._v(" "), _c("span", {
    staticClass: "post-date"
  }, [_vm._v(_vm._s(_vm.post.date))])])])]), _vm._v(" "), _c("div", {
    staticClass: "featured-image-container mb-12"
  }, [_c("img", {
    staticClass: "img-fluid post-featured-img",
    attrs: {
      src: _vm.post.image,
      alt: _vm.post.title
    }
  })]), _vm._v(" "), _c("article", {
    staticClass: "post-content mb-20"
  }, [_c("p", {
    staticClass: "lead-text mb-8"
  }, [_vm._v(_vm._s(_vm.post.excerpt))]), _vm._v(" "), _c("div", {
    staticClass: "article-body",
    domProps: {
      innerHTML: _vm._s(_vm.post.content)
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "takeaways-box glass-card p-8 mt-12 mb-12"
  }, [_c("h3", {
    staticClass: "mb-6"
  }, [_c("b-icon", {
    staticClass: "me-2 text-warning",
    attrs: {
      icon: "lightbulb"
    }
  }), _vm._v(" Key Takeaways")], 1), _vm._v(" "), _c("ul", {
    staticClass: "list-unstyled"
  }, _vm._l(_vm.post.takeaways, function (item, i) {
    return _c("li", {
      key: i,
      staticClass: "mb-4 d-flex"
    }, [_c("b-icon", {
      staticClass: "takeaway-icon-spacing text-primary mt-1",
      attrs: {
        icon: "check2-circle"
      }
    }), _vm._v(" "), _c("span", [_vm._v(_vm._s(item))])], 1);
  }), 0)])]), _vm._v(" "), _c("div", {
    staticClass: "share-section py-8 border-top border-bottom mb-20 d-flex align-items-center justify-content-between"
  }, [_c("span", {
    staticClass: "fw-bold text-dark"
  }, [_vm._v("Share this article:")]), _vm._v(" "), _c("div", {
    staticClass: "share-icons d-flex gap-4"
  }, [_c("a", {
    staticClass: "share-btn",
    attrs: {
      href: "https://www.linkedin.com/sharing/share-offsite/?url=" + _vm.currentUrl,
      target: "_blank",
      title: "Share on LinkedIn"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "linkedin"
    }
  })], 1), _vm._v(" "), _c("a", {
    staticClass: "share-btn",
    attrs: {
      href: "https://twitter.com/intent/tweet?url=" + _vm.currentUrl + "&text=" + _vm.post.title,
      target: "_blank",
      title: "Share on Twitter"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "twitter"
    }
  })], 1), _vm._v(" "), _c("a", {
    staticClass: "share-btn",
    attrs: {
      href: "https://www.facebook.com/sharer/sharer.php?u=" + _vm.currentUrl,
      target: "_blank",
      title: "Share on Facebook"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "facebook"
    }
  })], 1), _vm._v(" "), _c("button", {
    staticClass: "share-btn border-0",
    attrs: {
      title: _vm.copyStatus
    },
    on: {
      click: _vm.copyToClipboard
    }
  }, [_c("b-icon", {
    attrs: {
      icon: _vm.copyStatus === "Copied!" ? "check-lg" : "link-45deg"
    }
  })], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "related-posts mb-20"
  }, [_c("h3", {
    staticClass: "section-heading mb-8"
  }, [_vm._v("Related Articles")]), _vm._v(" "), _c("b-row", _vm._l(_vm.relatedPosts, function (related, rIdx) {
    return _c("b-col", {
      key: rIdx,
      staticClass: "mb-8",
      attrs: {
        md: "6"
      }
    }, [_c("div", {
      staticClass: "related-card",
      on: {
        click: function click($event) {
          return _vm.$router.push("/blog/" + related.slug);
        }
      }
    }, [_c("div", {
      staticClass: "related-img-wrap mb-4"
    }, [_c("img", {
      staticClass: "img-fluid",
      attrs: {
        src: related.image,
        alt: related.title
      }
    })]), _vm._v(" "), _c("h4", {
      staticClass: "related-title"
    }, [_vm._v(_vm._s(related.title))])])]);
  }), 1)], 1)])], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-b02c7d44] {\n    font-family: 'Inter', sans-serif;\n}\n.content-container[data-v-b02c7d44] {\n    position: relative;\n    z-index: 10;\n}\n\n/* Reading Progress Bar */\n.reading-progress-container[data-v-b02c7d44] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 4px;\n    z-index: 1000;\n}\n.reading-progress-bar[data-v-b02c7d44] {\n    height: 100%;\n    background: linear-gradient(to right, #355594, #4a72c9);\n    transition: width 0.1s ease;\n}\n\n/* Breadcrumb */\n.blog-breadcrumb[data-v-b02c7d44] { font-size: 0.9rem; color: #64748b; font-weight: 500;\n}\n.blog-breadcrumb a[data-v-b02c7d44] { color: #355594; text-decoration: none;\n}\n.blog-breadcrumb a[data-v-b02c7d44]:hover { text-decoration: underline;\n}\n.current-crumb[data-v-b02c7d44] { font-weight: 700; color: #1e3a6e;\n}\n\n/* Header */\n.post-category-pill[data-v-b02c7d44] { background: #f0f7ff; color: #355594; padding: 6px 16px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;\n}\n.post-read-time[data-v-b02c7d44] { font-size: 0.9rem; color: #64748b; font-weight: 500;\n}\n.post-title[data-v-b02c7d44] { font-size: 3rem; font-weight: 900; color: #1e3a6e; line-height: 1.1; letter-spacing: -1.5px;\n}\n.author-name[data-v-b02c7d44] { font-weight: 700; color: #1e3a6e; font-size: 1rem;\n}\n.post-date[data-v-b02c7d44] { color: #64748b; font-size: 0.85rem;\n}\n.author-avatar[data-v-b02c7d44] { width: 48px; height: 48px;\n}\n\n/* Content Styling */\n.featured-image-container[data-v-b02c7d44] { border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1);\n}\n.post-featured-img[data-v-b02c7d44] { width: 100%; border-radius: 32px;\n}\n.lead-text[data-v-b02c7d44] { font-size: 1.5rem; color: #334155; line-height: 1.5; font-weight: 500;\n}\n.article-body[data-v-b02c7d44] { font-size: 1.2rem; color: #334155; line-height: 1.8;\n}\n.article-body h3[data-v-b02c7d44] { font-size: 1.8rem; font-weight: 800; color: #1e3a6e; margin-top: 2.5rem; margin-bottom: 1.25rem;\n}\n.article-body p[data-v-b02c7d44] { margin-bottom: 1.5rem;\n}\n\n/* Takeaways Box */\n.takeaways-box[data-v-b02c7d44] { background: #f8fbff !important; border: 1px solid #e0f0ff !important;\n}\n.takeaways-box h3[data-v-b02c7d44] { font-weight: 800; color: #1e3a6e; font-size: 1.4rem;\n}\n.takeaway-icon-spacing[data-v-b02c7d44] { margin-right: 24px !important;\n}\n\n/* Share & Related */\n.share-btn[data-v-b02c7d44] { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 1.1rem; transition: all 0.3s ease; text-decoration: none;\n}\n.share-btn[data-v-b02c7d44]:hover { background: #355594; color: white; transform: translateY(-3px);\n}\n.related-card[data-v-b02c7d44] { cursor: pointer; transition: transform 0.3s ease;\n}\n.related-card[data-v-b02c7d44]:hover { transform: translateY(-5px);\n}\n.related-img-wrap[data-v-b02c7d44] { border-radius: 20px; overflow: hidden; height: 180px;\n}\n.related-img-wrap img[data-v-b02c7d44] { width: 100%; height: 100%; -o-object-fit: cover; object-fit: cover;\n}\n.related-title[data-v-b02c7d44] { font-size: 1.1rem; font-weight: 700; color: #1e3a6e; line-height: 1.4;\n}\n@media (max-width: 991px) {\n.post-title[data-v-b02c7d44] { font-size: 2.25rem;\n}\n.lead-text[data-v-b02c7d44] { font-size: 1.25rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/BlogPost.vue":
/*!**************************************************!*\
  !*** ./resources/js/src/view/pages/BlogPost.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true */ "./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true");
/* harmony import */ var _BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlogPost.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/BlogPost.vue?vue&type=script&lang=js");
/* harmony import */ var _BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css */ "./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "b02c7d44",
  null
  
)

/* hot reload */
if (false) // removed by dead control flow
{ var api; }
component.options.__file = "resources/js/src/view/pages/BlogPost.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/BlogPost.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogPost.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true");


/***/ })

}]);