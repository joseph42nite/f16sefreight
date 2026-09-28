"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_BlogsAndNews_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _blogData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./blogData */ "./resources/js/src/view/pages/public/blogData.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BlogsAndNews",
  data() {
    return {
      selectedCategory: 'All',
      categories: ['All', 'Air Freight', 'Technology', 'Sea Freight', 'Industry News', 'ERP Solutions'],
      posts: [],
      featuredPost: {}
    };
  },
  created() {
    this.loadBlogs();
  },
  methods: {
    loadBlogs() {
      // Load fallback initially for zero-content flash
      this.updatePosts(_blogData__WEBPACK_IMPORTED_MODULE_0__.blogs);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get('/get-public-blogs').then(({
        data
      }) => {
        if (data.success && data.data && data.data.length > 0) {
          // Map dynamic DB entries to frontend key structure
          const dynamicPosts = data.data.map(item => _objectSpread(_objectSpread({}, item), {}, {
            image: item.image_path,
            // Format backend timestamp to consistent UI display format
            date: new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
          }));

          // Use dynamic data as the source of truth
          this.updatePosts(dynamicPosts);
        }
      }).catch(() => {
        console.log("Running in offline/fallback mode for blogs.");
      });
    },
    updatePosts(postArray) {
      this.posts = postArray;
      this.featuredPost = postArray[0] || {};
    }
  },
  computed: {
    filteredPosts() {
      if (this.selectedCategory === 'All') return this.posts;
      return this.posts.filter(post => post.category === this.selectedCategory);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=template&id=df0ddd5a":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=template&id=df0ddd5a ***!
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
    staticClass: "blogs-hero text-center mb-20"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Industry Insights")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title mb-6"
  }, [_vm._v("Blogs & News")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mx-auto",
    staticStyle: {
      "max-width": "700px"
    }
  }, [_vm._v("\n        Stay updated with the latest trends in global logistics, e-freight automation, and industry breakthroughs.\n      ")])]), _vm._v(" "), _c("section", {
    staticClass: "featured-post-section mb-20"
  }, [_c("div", {
    staticClass: "featured-card glass-card"
  }, [_c("b-row", {
    attrs: {
      "align-v": "center"
    }
  }, [_c("b-col", {
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "featured-image-wrap"
  }, [_c("img", {
    staticClass: "featured-img",
    attrs: {
      src: _vm.featuredPost.image,
      alt: _vm.featuredPost.title
    }
  })])]), _vm._v(" "), _c("b-col", {
    staticClass: "p-8 p-md-12",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "post-meta mb-4"
  }, [_c("span", {
    staticClass: "post-category"
  }, [_vm._v(_vm._s(_vm.featuredPost.category))]), _vm._v(" "), _c("span", {
    staticClass: "meta-dot"
  }), _vm._v(" "), _c("span", {
    staticClass: "post-date"
  }, [_vm._v(_vm._s(_vm.featuredPost.date))])]), _vm._v(" "), _c("h2", {
    staticClass: "featured-title mb-6"
  }, [_vm._v(_vm._s(_vm.featuredPost.title))]), _vm._v(" "), _c("p", {
    staticClass: "featured-excerpt mb-8"
  }, [_vm._v(_vm._s(_vm.featuredPost.excerpt))]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/blog/" + _vm.featuredPost.slug
    }
  }, [_c("span", [_vm._v("Read Full Article")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)], 1)], 1)]), _vm._v(" "), _c("section", {
    staticClass: "filter-bar mb-12"
  }, [_c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-4"
  }, _vm._l(_vm.categories, function (cat) {
    return _c("button", {
      key: cat,
      class: ["filter-pill", {
        active: _vm.selectedCategory === cat
      }],
      on: {
        click: function ($event) {
          _vm.selectedCategory = cat;
        }
      }
    }, [_vm._v("\n              " + _vm._s(cat) + "\n          ")]);
  }), 0)]), _vm._v(" "), _c("section", {
    staticClass: "blog-grid-section"
  }, [_c("b-row", _vm._l(_vm.filteredPosts, function (post, idx) {
    return _c("b-col", {
      key: idx,
      staticClass: "mb-12",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "blog-card glass-card h-100"
    }, [_c("div", {
      staticClass: "blog-image-wrap"
    }, [_c("img", {
      staticClass: "blog-card-img",
      attrs: {
        src: post.image,
        alt: post.title
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "card-category-badge"
    }, [_vm._v(_vm._s(post.category))])]), _vm._v(" "), _c("div", {
      staticClass: "blog-content p-6"
    }, [_c("span", {
      staticClass: "post-date-small mb-3 d-block"
    }, [_vm._v(_vm._s(post.date))]), _vm._v(" "), _c("h3", {
      staticClass: "blog-card-title mb-4"
    }, [_vm._v(_vm._s(post.title))]), _vm._v(" "), _c("p", {
      staticClass: "blog-card-excerpt mb-6"
    }, [_vm._v(_vm._s(post.excerpt))]), _vm._v(" "), _c("b-button", {
      staticClass: "read-more-link",
      attrs: {
        to: "/blog/" + post.slug
      }
    }, [_c("span", [_vm._v("Read More")]), _vm._v(" "), _c("b-icon", {
      staticClass: "ms-1",
      attrs: {
        icon: "arrow-right-short"
      }
    })], 1)], 1)])]);
  }), 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "newsletter-section mt-20"
  }, [_c("div", {
    staticClass: "newsletter-card text-center py-16 px-6"
  }, [_c("div", {
    staticClass: "newsletter-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "newsletter-content"
  }, [_c("h2", {
    staticClass: "section-title mb-4"
  }, [_vm._v("Subscribe to our newsletter")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mb-10 text-muted"
  }, [_vm._v("Get the latest logistics news delivered straight to your inbox.")]), _vm._v(" "), _c("div", {
    staticClass: "newsletter-form mx-auto",
    staticStyle: {
      "max-width": "500px"
    }
  }, [_c("div", {
    staticClass: "glass-input-group"
  }, [_c("input", {
    staticClass: "glass-input",
    attrs: {
      type: "email",
      placeholder: "Enter your email address"
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "subscribe-btn"
  }, [_vm._v("Subscribe")])])])])])])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogsAndNews.vue":
/*!*************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogsAndNews.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BlogsAndNews_vue_vue_type_template_id_df0ddd5a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlogsAndNews.vue?vue&type=template&id=df0ddd5a */ "./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=template&id=df0ddd5a");
/* harmony import */ var _BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlogsAndNews.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BlogsAndNews_vue_vue_type_template_id_df0ddd5a__WEBPACK_IMPORTED_MODULE_0__.render,
  _BlogsAndNews_vue_vue_type_template_id_df0ddd5a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/BlogsAndNews.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogsAndNews.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=template&id=df0ddd5a":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=template&id=df0ddd5a ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_template_id_df0ddd5a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_template_id_df0ddd5a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_template_id_df0ddd5a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogsAndNews.vue?vue&type=template&id=df0ddd5a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogsAndNews.vue?vue&type=template&id=df0ddd5a");


/***/ })

}]);