"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_BlogPost_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _blogData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blogData */ "./resources/js/src/view/pages/public/blogData.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BlogPost",
  metaInfo: function metaInfo() {
    var siteOrigin = window.location.origin;
    var imagePath = this.post.image || this.post.image_path || '/media/assets/blog/futuristic-hud-overlays.webp';
    var absoluteImageUrl = siteOrigin + imagePath;
    var pageUrl = window.location.href;
    var schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": this.post.title,
      "image": [absoluteImageUrl],
      "datePublished": this.post.created_at || this.post.date,
      "author": [{
        "@type": "Organization",
        "name": "F16s Editorial Team",
        "url": siteOrigin
      }],
      "description": this.post.excerpt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl
      }
    };
    return {
      title: this.post.meta_title || this.post.metaTitle || this.post.title,
      meta: [{
        name: 'description',
        content: this.post.meta_description || this.post.metaDescription || this.post.excerpt
      }, {
        property: 'og:type',
        content: 'article'
      }, {
        property: 'og:url',
        content: pageUrl
      }, {
        property: 'og:title',
        content: this.post.meta_title || this.post.metaTitle || this.post.title
      }, {
        property: 'og:description',
        content: this.post.meta_description || this.post.metaDescription || this.post.excerpt
      }, {
        property: 'og:image',
        content: absoluteImageUrl
      }, {
        property: 'og:image:alt',
        content: this.post.title
      }, {
        name: 'twitter:card',
        content: 'summary_large_image'
      }, {
        name: 'twitter:url',
        content: pageUrl
      }, {
        name: 'twitter:title',
        content: this.post.meta_title || this.post.metaTitle || this.post.title
      }, {
        name: 'twitter:description',
        content: this.post.meta_description || this.post.metaDescription || this.post.excerpt
      }, {
        name: 'twitter:image',
        content: absoluteImageUrl
      }],
      script: [{
        innerHTML: JSON.stringify(schema),
        type: 'application/ld+json'
      }],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  data: function data() {
    return {
      readingProgress: 0,
      showShareModal: false,
      currentUrl: window.location.href,
      copyStatus: 'Copy Link',
      copyMessageStatus: 'Copy Message for Sharing',
      post: {},
      relatedPosts: []
    };
  },
  watch: {
    '$route.params.slug': {
      handler: function handler(newSlug) {
        this.fetchPost(newSlug);
        window.scrollTo(0, 0);
      },
      immediate: true
    }
  },
  mounted: function mounted() {
    window.addEventListener('scroll', this.updateProgress);
  },
  destroyed: function destroyed() {
    window.removeEventListener('scroll', this.updateProgress);
  },
  methods: {
    fetchPost: function fetchPost(slug) {
      var _this = this;
      // 1. Immediate fallback lookup
      var offlinePost = _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.find(function (b) {
        return b.slug === slug;
      });
      if (offlinePost) {
        this.setPost(offlinePost);
      }

      // 2. Dynamic DB Lookup with override
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/get-public-blog/".concat(slug)).then(function (_ref) {
        var data = _ref.data;
        if (data.success && data.data) {
          var item = data.data;
          // Ensure proper casting of relational arrays
          var parsedTakeaways = item.takeaways;
          if (typeof parsedTakeaways === 'string') {
            parsedTakeaways = JSON.parse(parsedTakeaways);
          }
          var formattedPost = _objectSpread(_objectSpread({}, item), {}, {
            image: item.image_path,
            readTime: item.read_time,
            takeaways: parsedTakeaways || [],
            date: new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
          });
          _this.setPost(formattedPost);
        }
      })["catch"](function () {
        console.log("Static fallback content maintained.");
      });

      // Fetch related fallback logic, or grab other public ones
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get('/get-public-blogs').then(function (_ref2) {
        var data = _ref2.data;
        if (data.success && data.data) {
          var rel = data.data.filter(function (d) {
            return d.slug !== slug;
          }).slice(0, 2).map(function (i) {
            return _objectSpread(_objectSpread({}, i), {}, {
              image: i.image_path
            });
          });
          if (rel.length > 0) _this.relatedPosts = rel;
        }
      })["catch"](function () {
        // final fallback
        _this.relatedPosts = _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.filter(function (b) {
          return b.slug !== slug;
        }).slice(0, 2);
      });
    },
    setPost: function setPost(p) {
      this.post = p;
    },
    updateProgress: function updateProgress() {
      var scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = window.scrollY;
      this.readingProgress = scrollH > 0 ? scrolled / scrollH * 100 : 0;
    },
    copyToClipboard: function copyToClipboard() {
      var _this2 = this;
      navigator.clipboard.writeText(this.currentUrl).then(function () {
        _this2.copyStatus = 'Copied!';
        setTimeout(function () {
          _this2.copyStatus = 'Copy Link';
        }, 2000);
      });
    },
    copyFullMessage: function copyFullMessage() {
      var _this3 = this;
      var message = "".concat(this.post.title, "\n\n").concat(this.post.excerpt, "\n\nRead more at: ").concat(this.currentUrl);
      navigator.clipboard.writeText(message).then(function () {
        _this3.copyMessageStatus = 'Message Copied!';
        setTimeout(function () {
          _this3.copyMessageStatus = 'Copy Message for Sharing';
        }, 2000);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=template&id=33adde3c&scoped=true":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=template&id=33adde3c&scoped=true ***!
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
    staticClass: "author-details"
  }, [_c("span", {
    staticClass: "author-name"
  }, [_vm._v("F16s Editorial Team")]), _vm._v(" "), _c("span", {
    staticClass: "post-date d-block"
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
  }, [_c("div", {
    staticClass: "share-info"
  }, [_c("span", {
    staticClass: "fw-bold text-dark d-block mb-1"
  }, [_vm._v("Enjoyed this article?")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Share it with your logistics network.")])]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn share-trigger-btn",
    on: {
      click: function click($event) {
        _vm.showShareModal = true;
      }
    }
  }, [_c("span", [_vm._v("Share Post")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "share-fill"
    }
  })], 1)])], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      "hide-footer": "",
      centered: "",
      title: "Share this Insight",
      "content-class": "premium-share-modal",
      size: "md"
    },
    model: {
      value: _vm.showShareModal,
      callback: function callback($$v) {
        _vm.showShareModal = $$v;
      },
      expression: "showShareModal"
    }
  }, [_c("div", {
    staticClass: "share-preview-wrapper p-4"
  }, [_c("p", {
    staticClass: "preview-label mb-4 text-muted small text-uppercase fw-bold"
  }, [_vm._v("Social Preview")]), _vm._v(" "), _c("div", {
    staticClass: "social-preview-card mb-8"
  }, [_c("div", {
    staticClass: "social-card-image"
  }, [_c("img", {
    attrs: {
      src: _vm.post.image,
      alt: _vm.post.title
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "social-card-content"
  }, [_c("p", {
    staticClass: "social-card-domain"
  }, [_vm._v("f16sefreight.com")]), _vm._v(" "), _c("h4", {
    staticClass: "social-card-title"
  }, [_vm._v(_vm._s(_vm.post.title))]), _vm._v(" "), _c("p", {
    staticClass: "social-card-excerpt"
  }, [_vm._v(_vm._s(_vm.post.excerpt))])])]), _vm._v(" "), _c("div", {
    staticClass: "share-actions-grid"
  }, [_c("div", {
    staticClass: "social-links-row mb-6 d-flex justify-content-center gap-4"
  }, [_c("a", {
    staticClass: "social-icon-btn linkedin",
    attrs: {
      href: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(_vm.currentUrl),
      target: "_blank"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "linkedin"
    }
  })], 1), _vm._v(" "), _c("a", {
    staticClass: "social-icon-btn twitter",
    attrs: {
      href: "https://twitter.com/intent/tweet?url=" + encodeURIComponent(_vm.currentUrl) + "&text=" + encodeURIComponent(_vm.post.title),
      target: "_blank"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "twitter"
    }
  })], 1), _vm._v(" "), _c("a", {
    staticClass: "social-icon-btn facebook",
    attrs: {
      href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(_vm.currentUrl),
      target: "_blank"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "facebook"
    }
  })], 1), _vm._v(" "), _c("a", {
    staticClass: "social-icon-btn whatsapp",
    attrs: {
      href: "https://api.whatsapp.com/send?text=" + encodeURIComponent(_vm.post.title + " " + _vm.currentUrl),
      target: "_blank"
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "whatsapp"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "copy-actions-row d-flex flex-column gap-3"
  }, [_c("b-button", {
    staticClass: "copy-btn link-btn w-100 py-3",
    on: {
      click: _vm.copyToClipboard
    }
  }, [_c("b-icon", {
    staticClass: "me-2",
    attrs: {
      icon: _vm.copyStatus === "Copied!" ? "check-lg" : "link-45deg"
    }
  }), _vm._v("\n                            " + _vm._s(_vm.copyStatus) + "\n                        ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "copy-btn message-btn w-100 py-3",
    on: {
      click: _vm.copyFullMessage
    }
  }, [_c("b-icon", {
    staticClass: "me-2",
    attrs: {
      icon: _vm.copyMessageStatus === "Message Copied!" ? "check-lg" : "file-earmark-text"
    }
  }), _vm._v("\n                            " + _vm._s(_vm.copyMessageStatus) + "\n                        ")], 1)], 1)])])]), _vm._v(" "), _c("section", {
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
  }), 1)], 1)], 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-33adde3c] {\n    font-family: 'Inter', sans-serif;\n}\n.content-container[data-v-33adde3c] {\n    position: relative;\n    z-index: 10;\n}\n\n/* Reading Progress Bar */\n.reading-progress-container[data-v-33adde3c] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 4px;\n    z-index: 1000;\n}\n.reading-progress-bar[data-v-33adde3c] {\n    height: 100%;\n    background: linear-gradient(to right, #355594, #4a72c9);\n    transition: width 0.1s ease;\n}\n\n/* Breadcrumb */\n.blog-breadcrumb[data-v-33adde3c] { font-size: 0.9rem; color: #64748b; font-weight: 500;\n}\n.blog-breadcrumb a[data-v-33adde3c] { color: #355594; text-decoration: none;\n}\n.blog-breadcrumb a[data-v-33adde3c]:hover { text-decoration: underline;\n}\n.current-crumb[data-v-33adde3c] { font-weight: 700; color: #1e3a6e;\n}\n\n/* Header */\n.post-category-pill[data-v-33adde3c] { background: #f0f7ff; color: #355594; padding: 6px 16px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;\n}\n.post-read-time[data-v-33adde3c] { font-size: 0.9rem; color: #64748b; font-weight: 500;\n}\n.post-title[data-v-33adde3c] { font-size: 3rem; font-weight: 900; color: #1e3a6e; line-height: 1.1; letter-spacing: -1.5px;\n}\n.author-name[data-v-33adde3c] { font-weight: 700; color: #1e3a6e; font-size: 1rem; line-height: 1;\n}\n.post-date[data-v-33adde3c] { color: #64748b; font-size: 0.85rem; margin-top: 2px;\n}\n\n/* Content Styling */\n.featured-image-container[data-v-33adde3c] { border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1);\n}\n.post-featured-img[data-v-33adde3c] { width: 100%; border-radius: 32px;\n}\n.lead-text[data-v-33adde3c] { font-size: 1.5rem; color: #334155; line-height: 1.5; font-weight: 500;\n}\n.article-body[data-v-33adde3c] { font-size: 1.2rem; color: #334155; line-height: 1.8;\n}\n.article-body h3[data-v-33adde3c] { font-size: 1.8rem; font-weight: 800; color: #1e3a6e; margin-top: 2.5rem; margin-bottom: 1.25rem;\n}\n.article-body p[data-v-33adde3c] { margin-bottom: 1.5rem;\n}\n\n/* Takeaways Box */\n.takeaways-box[data-v-33adde3c] { background: #f8fbff !important; border: 1px solid #e0f0ff !important;\n}\n.takeaways-box h3[data-v-33adde3c] { font-weight: 800; color: #1e3a6e; font-size: 1.4rem;\n}\n.takeaway-icon-spacing[data-v-33adde3c] { margin-right: 24px !important;\n}\n\n/* Share & Related */\n.share-btn[data-v-33adde3c] { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 1.1rem; transition: all 0.3s ease; text-decoration: none;\n}\n.share-btn[data-v-33adde3c]:hover { background: #355594; color: white; transform: translateY(-3px);\n}\n.related-card[data-v-33adde3c] { cursor: pointer; transition: transform 0.3s ease;\n}\n.related-card[data-v-33adde3c]:hover { transform: translateY(-5px);\n}\n.related-img-wrap[data-v-33adde3c] { border-radius: 20px; overflow: hidden; height: 180px;\n}\n.related-img-wrap img[data-v-33adde3c] { width: 100%; height: 100%; -o-object-fit: cover; object-fit: cover;\n}\n.related-title[data-v-33adde3c] { font-size: 1.1rem; font-weight: 700; color: #1e3a6e; line-height: 1.4;\n}\n\n\n\n/* PREMIUM SHARE MODAL STYLING */\n[data-v-33adde3c] .premium-share-modal {\n    background: rgba(255, 255, 255, 0.8) !important;\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px) !important;\n    border: 1px solid rgba(255, 255, 255, 0.6) !important;\n    border-radius: 32px !important;\n    box-shadow: 0 40px 100px rgba(53, 85, 148, 0.15) !important;\n    overflow: hidden;\n}\n[data-v-33adde3c] .premium-share-modal .modal-header {\n    border-bottom: 1px solid rgba(53, 85, 148, 0.08);\n    padding: 1.5rem 2rem;\n}\n[data-v-33adde3c] .premium-share-modal .modal-title {\n    font-weight: 800;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n}\n.social-preview-card[data-v-33adde3c] {\n    border-radius: 24px;\n    overflow: hidden;\n    background: white;\n    border: 1px solid rgba(53, 85, 148, 0.1);\n    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.06);\n    transition: transform 0.3s ease;\n}\n.social-preview-card[data-v-33adde3c]:hover {\n    transform: scale(1.02);\n}\n.social-card-image[data-v-33adde3c] {\n    width: 100%;\n    aspect-ratio: 1.91 / 1;\n    overflow: hidden;\n}\n.social-card-image img[data-v-33adde3c] {\n    width: 100%;\n    height: 100%;\n    -o-object-fit: cover;\n       object-fit: cover;\n}\n.social-card-content[data-v-33adde3c] {\n    padding: 20px;\n}\n.social-card-domain[data-v-33adde3c] {\n    font-size: 0.85rem;\n    color: #355594;\n    letter-spacing: -0.2px;\n    font-weight: 700;\n    margin-bottom: 8px;\n    opacity: 0.8;\n}\n.social-card-title[data-v-33adde3c] {\n    font-size: 1.15rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    margin-bottom: 10px;\n    line-height: 1.3;\n}\n.social-card-excerpt[data-v-33adde3c] {\n    font-size: 0.9rem;\n    color: #5A6B8A;\n    line-height: 1.6;\n    margin-bottom: 0;\n}\n.social-icon-btn[data-v-33adde3c] {\n    width: 54px;\n    height: 54px;\n    border-radius: 18px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 1.4rem;\n    color: white;\n    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n    text-decoration: none;\n}\n.social-icon-btn.linkedin[data-v-33adde3c] { background: #0077b5; box-shadow: 0 8px 20px rgba(0, 119, 181, 0.25);\n}\n.social-icon-btn.twitter[data-v-33adde3c] { background: #1da1f2; box-shadow: 0 8px 20px rgba(29, 161, 242, 0.25);\n}\n.social-icon-btn.facebook[data-v-33adde3c] { background: #1877f2; box-shadow: 0 8px 20px rgba(24, 119, 242, 0.25);\n}\n.social-icon-btn.whatsapp[data-v-33adde3c] { background: #25d366; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.25);\n}\n.social-icon-btn[data-v-33adde3c]:hover { transform: translateY(-6px) rotate(8deg); color: white; filter: brightness(1.1);\n}\n.copy-btn[data-v-33adde3c] {\n    border: none;\n    border-radius: 16px;\n    font-weight: 800;\n    font-size: 0.95rem;\n    transition: all 0.3s ease;\n    letter-spacing: -0.2px;\n}\n.copy-btn.link-btn[data-v-33adde3c] { \n    background: #f0f7ff; \n    color: #355594; \n    border: 1px solid rgba(53, 85, 148, 0.1);\n}\n.copy-btn.message-btn[data-v-33adde3c] { \n    background: #355594; \n    color: white;\n}\n.copy-btn[data-v-33adde3c]:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(53, 85, 148, 0.1);\n}\n.copy-btn.message-btn[data-v-33adde3c]:hover { box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25);\n}\n@media (max-width: 991px) {\n.post-title[data-v-33adde3c] { font-size: 2.25rem;\n}\n.lead-text[data-v-33adde3c] { font-size: 1.25rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_33adde3c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_33adde3c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_33adde3c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogPost.vue":
/*!*********************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogPost.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BlogPost_vue_vue_type_template_id_33adde3c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlogPost.vue?vue&type=template&id=33adde3c&scoped=true */ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=template&id=33adde3c&scoped=true");
/* harmony import */ var _BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlogPost.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=script&lang=js");
/* harmony import */ var _BlogPost_vue_vue_type_style_index_0_id_33adde3c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css */ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BlogPost_vue_vue_type_template_id_33adde3c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _BlogPost_vue_vue_type_template_id_33adde3c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "33adde3c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/BlogPost.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogPost.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=template&id=33adde3c&scoped=true":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogPost.vue?vue&type=template&id=33adde3c&scoped=true ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_33adde3c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_33adde3c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_33adde3c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=template&id=33adde3c&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=template&id=33adde3c&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_33adde3c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css");


/***/ })

}]);