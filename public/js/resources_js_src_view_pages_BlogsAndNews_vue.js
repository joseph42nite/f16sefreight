"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_BlogsAndNews_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _blogData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blogData */ "./resources/js/src/view/blogData.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BlogsAndNews",
  components: {},
  data: function data() {
    return {
      selectedCategory: 'All',
      categories: ['All', 'Air Freight', 'Technology', 'Sea Freight', 'Industry News', 'ERP Solutions'],
      featuredPost: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs[0],
      posts: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs
    };
  },
  computed: {
    filteredPosts: function filteredPosts() {
      var _this = this;
      if (this.selectedCategory === 'All') return this.posts;
      return this.posts.filter(function (post) {
        return post.category === _this.selectedCategory;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("span", [_vm._v("Read Full Article")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("section", {
    staticClass: "filter-bar mb-12"
  }, [_c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-4"
  }, _vm._l(_vm.categories, function (cat) {
    return _c("button", {
      key: cat,
      "class": ["filter-pill", {
        active: _vm.selectedCategory === cat
      }],
      on: {
        click: function click($event) {
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
      staticClass: "read-more-link p-0",
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-202ad916] {\n    font-family: 'Inter', sans-serif;\n    position: relative;\n    overflow-x: hidden;\n}\n\n/* Decorative background elements */\n.decorative-ellipses .ellipse[data-v-202ad916] {\n    position: absolute;\n    border-radius: 50%;\n    filter: blur(60px);\n    z-index: 0;\n    opacity: 0.4;\n}\n.ellipse-tl[data-v-202ad916] { width: 300px; height: 300px; background: #D0E6F8; top: -50px; left: -50px;\n}\n.ellipse-tr[data-v-202ad916] { width: 200px; height: 200px; background: #E6F0FF; top: 15%; right: 5%;\n}\n.content-container[data-v-202ad916] {\n    position: relative;\n    z-index: 10;\n}\n\n/* Typography */\n.section-title[data-v-202ad916] { font-size: 3.5rem; font-weight: 900; color: #1e3a6e; letter-spacing: -1.5px;\n}\n.section-subtitle[data-v-202ad916] { font-size: 1.25rem; color: #5A6B8A; line-height: 1.6;\n}\n.section-eyebrow[data-v-202ad916] { text-transform: uppercase; letter-spacing: 3px; font-size: 0.9rem; font-weight: 800; color: #355594; margin-bottom: 1rem; display: block;\n}\n\n/* Featured Card */\n.featured-card[data-v-202ad916] {\n    border-radius: 40px;\n    overflow: hidden;\n    background: rgba(255, 255, 255, 0.6);\n    -webkit-backdrop-filter: blur(25px);\n            backdrop-filter: blur(25px);\n    border: 1px solid rgba(255, 255, 255, 0.8);\n    box-shadow: 0 30px 60px rgba(53, 85, 148, 0.08);\n}\n.featured-image-wrap[data-v-202ad916] { height: 100%; overflow: hidden;\n}\n.featured-img[data-v-202ad916] { width: 100%; height: 100%; -o-object-fit: cover; object-fit: cover; transition: transform 0.8s ease;\n}\n.featured-card:hover .featured-img[data-v-202ad916] { transform: scale(1.05);\n}\n.featured-title[data-v-202ad916] { font-size: 2.25rem; font-weight: 800; color: #1e3a6e; line-height: 1.2;\n}\n.featured-excerpt[data-v-202ad916] { font-size: 1.1rem; color: #5A6B8A; line-height: 1.7;\n}\n\n/* Post Meta */\n.post-category[data-v-202ad916] { color: #355594; font-weight: 700; font-size: 0.9rem; text-transform: uppercase;\n}\n.meta-dot[data-v-202ad916] { width: 5px; height: 5px; background: #cbd5e1; border-radius: 50%; display: inline-block; margin: 0 10px; vertical-align: middle;\n}\n.post-date[data-v-202ad916] { color: #64748b; font-size: 0.9rem; font-weight: 500;\n}\n\n/* Filter Bar */\n.filter-pill[data-v-202ad916] {\n    padding: 8px 24px;\n    border-radius: 999px;\n    border: 1px solid rgba(53, 85, 148, 0.2);\n    background: rgba(255, 255, 255, 0.5);\n    color: #355594;\n    font-weight: 600;\n    transition: all 0.3s ease;\n    cursor: pointer;\n}\n.filter-pill[data-v-202ad916]:hover, .filter-pill.active[data-v-202ad916] {\n    background: #355594;\n    color: white;\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.15);\n}\n\n/* Blog Cards */\n.blog-card[data-v-202ad916] {\n    border-radius: 32px;\n    overflow: hidden;\n    background: rgba(255, 255, 255, 0.6);\n    -webkit-backdrop-filter: blur(25px);\n            backdrop-filter: blur(25px);\n    border: 1px solid rgba(255, 255, 255, 0.8);\n    transition: all 0.4s ease;\n    display: flex;\n    flex-direction: column;\n}\n.blog-card[data-v-202ad916]:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(53, 85, 148, 0.1);\n}\n.blog-image-wrap[data-v-202ad916] { height: 240px; position: relative; overflow: hidden;\n}\n.blog-card-img[data-v-202ad916] { width: 100%; height: 100%; -o-object-fit: cover; object-fit: cover; transition: transform 0.6s ease;\n}\n.blog-card:hover .blog-card-img[data-v-202ad916] { transform: scale(1.1);\n}\n.card-category-badge[data-v-202ad916] { position: absolute; top: 20px; left: 20px; background: rgba(255, 255, 255, 0.9); color: #1e3a6e; padding: 6px 16px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;\n}\n.blog-card-title[data-v-202ad916] { font-size: 1.35rem; font-weight: 800; color: #1e3a6e; line-height: 1.3;\n}\n.blog-card-excerpt[data-v-202ad916] { font-size: 0.95rem; color: #64748b; line-height: 1.6;\n}\n.read-more-link[data-v-202ad916] { background: none; border: none; color: #355594; font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; transition: all 0.3s ease;\n}\n.read-more-link[data-v-202ad916]:hover { color: #1e3a6e; letter-spacing: 0.5px;\n}\n\n/* Newsletter */\n.newsletter-card[data-v-202ad916] { position: relative; border-radius: 40px; overflow: hidden;\n}\n.newsletter-glow[data-v-202ad916] { position: absolute; inset: 0; background: linear-gradient(135deg, #d0e6f8 0%, #ffffff 100%); opacity: 0.5; filter: blur(30px);\n}\n.newsletter-content[data-v-202ad916] { position: relative; z-index: 1;\n}\n.glass-input-group[data-v-202ad916] { display: flex; background: rgba(255, 255, 255, 0.7); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 999px; padding: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);\n}\n.glass-input[data-v-202ad916] { flex: 1; background: none; border: none; padding: 12px 24px; font-family: 'Inter', sans-serif; color: #1e3a6e; font-weight: 500;\n}\n.glass-input[data-v-202ad916]:focus { outline: none;\n}\n.subscribe-btn[data-v-202ad916] { background: #355594; color: white; border: none; padding: 12px 32px; border-radius: 999px; font-weight: 700; transition: all 0.3s ease;\n}\n.subscribe-btn[data-v-202ad916]:hover { background: #1e3a6e; transform: scale(1.02);\n}\n\n/* Hero Button Style */\n.hero-btn[data-v-202ad916] { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; display: inline-flex; align-items: center; transition: all 0.3s ease;\n}\n.hero-btn[data-v-202ad916]:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25);\n}\n.hero-btn span[data-v-202ad916] { color: white; font-weight: 500; margin-right: 14px;\n}\n.hero-btn .btn-icon[data-v-202ad916] { background: white; color: #355594; border-radius: 50%; width: 32px; height: 32px; padding: 8px;\n}\n\n/* Responsive */\n@media (max-width: 991px) {\n.section-title[data-v-202ad916] { font-size: 2.5rem;\n}\n.featured-title[data-v-202ad916] { font-size: 1.75rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_style_index_0_id_202ad916_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_style_index_0_id_202ad916_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_style_index_0_id_202ad916_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/blogData.js":
/*!*******************************************!*\
  !*** ./resources/js/src/view/blogData.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   blogs: () => (/* binding */ blogs)
/* harmony export */ });
var blogs = [{
  title: "The Ultimate Guide to Air Freight Consolidation and MAWB Management",
  slug: "air-freight-consolidation-mawb",
  category: "Air Freight",
  date: "May 04, 2026",
  readTime: "8 min",
  image: "/media/custome/blog_consolidation/futuristic-hud-overlays.png",
  excerpt: "Learn how to streamline your air cargo operations by mastering Master Air Waybills and the strategic benefits of freight consolidation.",
  metaTitle: "Air Freight Consolidation & MAWB Management Guide | F16s",
  metaDescription: "Master air cargo consolidation and MAWB workflows. Learn how F16s automates Master Air Waybill management for efficient freight forwarding.",
  content: "\n        <p>The air freight industry is built on efficiency. For freight forwarders, the ability to consolidate multiple shipments into a single <strong>Master Air Waybill (MAWB)</strong> is not just a logistical necessity\u2014it's a significant competitive advantage.</p>\n        \n        <h3>What is a MAWB?</h3>\n        <p>A Master Air Waybill (MAWB) is the contract of carriage between the shipper (the freight forwarder) and the carrier (the airline). It covers the entire consolidated shipment, which may consist of several individual <strong>House Air Waybills (HAWB)</strong>.</p>\n        \n        <h3>The Power of Consolidation</h3>\n        <p>Consolidation allows forwarders to secure better rates from airlines by committing to larger volumes. It also simplifies the documentation process, as the airline only needs to process one MAWB for a bulk shipment of multiple packages destined for the same location. Our <a href=\"/services\">air freight services</a> are designed to help you manage these consolidations with maximum profitability.</p>\n        \n        <p>With F16s, our <a href=\"/solutions\">automated consolidation module</a> allows you to link multiple HAWBs to a single MAWB with a single click, ensuring that weights, volumes, and descriptions are perfectly synchronized across your entire supply chain. Discover more in our <a href=\"/product-description\">product features</a> section.</p>\n    ",
  takeaways: ["MAWB acts as the primary contract between forwarder and airline.", "Consolidation maximizes profit margins and operational efficiency.", "F16s automates the linkage between House and Master Waybills.", "Unified data entry prevents synchronization errors in bulk shipments."]
}, {
  title: "Understanding e-Freight Standards: FWB, FHL, and FZB Explained",
  slug: "iata-efreight-standards",
  category: "Technology",
  date: "May 03, 2026",
  readTime: "10 min",
  image: "/media/custome/blog_consolidation/fwb-fhl.png",
  excerpt: "A technical breakdown of essential IATA messaging standards and how they facilitate seamless electronic data interchange in global logistics.",
  metaTitle: "FWB, FHL, FZB & e-Freight: IATA Cargo Standards | F16s",
  metaDescription: "Master IATA e-Freight standards. Learn how FWB, FHL, and FZB messaging automates electronic data interchange (EDI) for modern freight forwarding.",
  content: "\n        <p>In the digital age of logistics, paper is the enemy of speed. IATA's <strong>e-Freight</strong> initiative aims to eliminate paper documents from the air cargo supply chain, replacing them with standardized electronic messages. For forwarders, understanding <strong>FWB</strong>, <strong>FHL</strong>, and <strong>FZB</strong> is essential for staying competitive.</p>\n        \n        <h3>FWB (Freight Waybill)</h3>\n        <p>The FWB message is the electronic version of the Air Waybill. It contains all the critical data about the shipment, including the shipper, consignee, cargo details, and routing information. By using our <a href=\"/solutions\">automated AWB solutions</a>, you can transmit FWBs directly to airlines in seconds.</p>\n        \n        <h3>FHL (Freight House List)</h3>\n        <p>For consolidated shipments, the FHL message provides the details of each individual House Air Waybill (HAWB) contained within a Master Air Waybill (MAWB). This is crucial for customs clearance and security filing. Managing <a href=\"/services\">air freight consolidation</a> effectively requires precise FHL manifesting.</p>\n        \n        <h3>FZB: The New Standard for Booking</h3>\n        <p>FZB messaging is increasingly used for automated booking confirmations and status updates, closing the loop between the agent and the airline's reservation system. This level of <a href=\"/product-description\">EDI connectivity</a> ensures that your bookings are confirmed instantly without manual intervention.</p>\n        \n        <p>F16s supports all these protocols out of the box, ensuring your business is always e-AWB compliant and ready for the future of global trade.</p>\n    ",
  takeaways: ["FWB is the digital backbone of the electronic Air Waybill.", "FHL is essential for detailed manifesting of consolidated cargo.", "FZB streamlines the booking process with real-time confirmations.", "e-Freight compliance reduces operational costs and documentation errors."]
}, {
  title: "Global Airline Connectivity: Bridging the Gap with F16s",
  slug: "global-airline-connectivity",
  category: "Industry News",
  date: "May 02, 2026",
  readTime: "9 min",
  image: "/media/custome/blog_consolidation/global-airline-network.png",
  excerpt: "F16s provides direct EDI connectivity to major carriers like Emirates, Qatar Airways, and Lufthansa, ensuring real-time booking and tracking for freight forwarders.",
  metaTitle: "Global Airline Connectivity: Emirates, Qatar, Lufthansa EDI | F16s",
  metaDescription: "Connect directly to 100+ global airlines. F16s offers direct EDI integration with Emirates SkyCargo, Qatar Airways, Lufthansa and more for instant booking.",
  content: "\n        <p>Speed is the primary reason businesses choose air freight. However, manual booking processes and phone calls can negate that speed. F16s solves this by providing direct <strong>Electronic Data Interchange (EDI)</strong> connectivity to the world's leading airlines.</p>\n        \n        <h3>Direct Integration with Top Carriers</h3>\n        <p>Our platform is connected to over 100+ airlines, allowing you to bypass third-party portals and manage your entire <a href=\"/services\">air freight operation</a> from one place. We support direct links with industry giants such as:</p>\n        <ul>\n            <li><strong>Emirates SkyCargo</strong></li>\n            <li><strong>Qatar Airways Cargo</strong></li>\n            <li><strong>Lufthansa Cargo</strong></li>\n            <li><strong>Cathay Pacific Cargo</strong></li>\n            <li><strong>Singapore Airlines Cargo</strong></li>\n            <li><strong>Air France-KLM Cargo</strong></li>\n        </ul>\n        \n        <h3>The Benefits of Direct EDI Connectivity</h3>\n        <p>By integrating directly with carrier systems, forwarders using F16s can check capacity, book space, and receive instant FWB/FHL confirmations. This direct link ensures that your data is 100% accurate and your shipments move faster through the warehouse. Explore our <a href=\"/solutions\">logistics solutions</a> to see how we automate these workflows.</p>\n        \n        <p>Having these tools allows even small and medium-sized forwarders to offer the same level of visibility and speed as global logistics giants. Check out our <a href=\"/product-description\">detailed product features</a> for more information on our airline network.</p>\n    ",
  takeaways: ["Direct EDI links reduce booking time from hours to seconds.", "F16s connects to all major global carriers including Emirates and Qatar.", "Real-time tracking is enabled through direct airline status updates.", "Direct connectivity eliminates the need for manual portal entry."]
}, {
  title: "HAWB vs. MAWB: Navigating House and Master Air Waybills",
  slug: "hawb-vs-mawb-guide",
  category: "Air Freight",
  date: "May 01, 2026",
  readTime: "8 min",
  image: "/media/custome/blog_consolidation/futuristic-awb-dashboard.png",
  excerpt: "Understanding the critical differences between House and Master Waybills and how to automate their generation for error-free air cargo shipping.",
  metaTitle: "HAWB vs. MAWB: Guide to Air Waybill Documentation | F16s",
  metaDescription: "Learn the key differences between House Air Waybill (HAWB) and Master Air Waybill (MAWB). Discover how F16s automates manifest generation for air freight forwarders.",
  content: "\n        <p>Confusing the <strong>MAWB</strong> and <strong>HAWB</strong> is one of the most common mistakes for new freight forwarding staff. Understanding the hierarchy of these documents is key to successful manifesting and customs compliance.</p>\n        \n        <h3>What is a Master Air Waybill (MAWB)?</h3>\n        <p>A Master Air Waybill is issued by the airline (the carrier) to the freight forwarder (the agent). It represents the total consolidated shipment on a specific flight from one airport to another. It is the primary contract of carriage between the forwarder and the airline.</p>\n        \n        <h3>What is a House Air Waybill (HAWB)?</h3>\n        <p>A House Air Waybill is issued by the freight forwarder to the actual shipper (the customer). It details the specific contents of one customer's part of the consolidation. One MAWB can contain dozens of HAWBs.</p>\n        \n        <h3>Automating the Manifesting Process</h3>\n        <p>F16s simplifies this hierarchy by automatically generating HAWBs from your shipment data and aggregating them into a single MAWB. This ensures that the total weight and piece count always match perfectly, preventing costly discrepancies at the airport warehouse. Our <a href=\"/solutions\">AWB automation solutions</a> are designed to keep your documentation error-free.</p>\n        \n        <p>By streamlining this process, forwarders can focus on growth rather than paperwork. For more information on how our system handles complex shipments, check out our <a href=\"/services\">air freight services</a> or explore our <a href=\"/product-description\">advanced product features</a>.</p>\n    ",
  takeaways: ["MAWB is the carrier-to-agent contract; HAWB is the agent-to-shipper contract.", "Accurate cross-referencing between House and Master manifests is vital.", "Automation prevents 'fat-finger' errors in cargo weight and piece counts.", "F16s ensures 100% synchronization between your HAWBs and MAWBs."]
}, {
  title: "The Power of FHL: Managing House Manifests with Precision",
  slug: "mastering-fhl-manifests",
  category: "ERP Solutions",
  date: "April 28, 2026",
  readTime: "9 min",
  image: "/media/custome/blog_consolidation/futuristic-cargo-logistics.png",
  excerpt: "Discover how efficient Freight House List (FHL) management can accelerate your customs clearance and warehouse operations.",
  metaTitle: "Mastering FHL Manifests for Faster Customs Clearance | F16s",
  metaDescription: "Optimize your Freight House List (FHL) management. Accurate FHL messaging accelerates customs clearance and warehouse cargo handling.",
  content: "\n        <p>The <strong>Freight House List (FHL)</strong> message is often overlooked, but it is the secret to smooth customs clearance. Without a valid FHL, airlines cannot process consolidated cargo, leading to significant delays and storage fees.</p>\n        \n        <h3>Why FHL Matters for Global Trade</h3>\n        <p>Customs authorities in many countries require house-level data before the plane even lands. The FHL message carries this data electronically, allowing for pre-clearance and faster cargo release. Proper <a href=\"/services\">air freight management</a> depends on the accuracy of these manifests.</p>\n        \n        <h3>Precision in Data Validation</h3>\n        <p>F16s includes a built-in validation engine that checks your FHL data against IATA standards. If a zip code is missing or a description is too vague, our <a href=\"/solutions\">logistics ERP</a> flags it before you hit send, saving you from fines and operational delays. Learn more about our <a href=\"/product-description\">advanced manifesting features</a> here.</p>\n    ",
  takeaways: ["FHL is the electronic manifest required for house-level cargo data.", "Missing FHL messages are a leading cause of international cargo delays.", "F16s validates FHL messages to ensure 100% compliance with IATA.", "Accurate FHL data speeds up the customs pre-clearance process."]
}, {
  title: "Why Direct Airline Integration is a Game Changer for Forwarders",
  slug: "direct-airline-integration",
  category: "Technology",
  date: "April 25, 2026",
  readTime: "8 min",
  image: "/media/custome/blog_consolidation/night-airport-apron.png",
  excerpt: "With direct EDI connections to over 100+ airlines, F16s offers unparalleled reach and real-time visibility for your global shipments.",
  metaTitle: "Direct Airline Integration: Cathay Pacific, KLM, Air France | F16s",
  metaDescription: "Why direct airline integration is essential for modern forwarders. Connect to Cathay Pacific, KLM, and more with F16s automated EDI platform.",
  content: "\n        <p>In a world of instant gratification, shippers expect real-time answers. If you still have to call an airline or check multiple portals for a status update, you're already behind the competition.</p>\n        \n        <h3>Seamless Connectivity to Global Carriers</h3>\n        <p>F16s bridges the gap between your local operations and global carriers like <strong>Cathay Pacific</strong>, <strong>KLM</strong>, <strong>British Airways</strong>, and <strong>Turkish Cargo</strong>. Our <a href=\"/solutions\">EDI connectivity</a> allows for:</p>\n        <ul>\n            <li>Instant dynamic pricing updates</li>\n            <li>Automated e-booking confirmations</li>\n            <li>Real-time status notifications (FSA/FSU messages)</li>\n        </ul>\n        \n        <p>Having these tools allows even small forwarders to offer the same level of visibility as global logistics giants. Check out our <a href=\"/services\">full range of services</a> or see our <a href=\"/product-description\">connectivity roadmap</a> for more details.</p>\n    ",
  takeaways: ["Direct airline integration levels the playing field for all forwarders.", "Real-time links to KLM and Cathay Pacific provide superior visibility.", "Automated FSA/FSU updates keep your customers informed 24/7.", "Direct EDI eliminates manual data entry in carrier portals."]
}, {
  title: "Digital Transformation: Transitioning to Full e-AWB Compliance",
  slug: "e-awb-compliance-digital-transformation",
  category: "Industry News",
  date: "April 20, 2026",
  readTime: "11 min",
  image: "/media/custome/blog_consolidation/hightech-control-room.png",
  excerpt: "Explore the roadmap for transitioning from paper-based MAWBs to full IATA e-AWB compliance and how F16s simplifies the journey.",
  metaTitle: "e-AWB Compliance & Digital Transformation Roadmap | F16s",
  metaDescription: "Transition from paper MAWBs to full IATA e-AWB compliance. Your guide to digital transformation in the air freight industry with F16s.",
  content: "\n        <p>The 'e' in e-AWB stands for Electronic, but for modern forwarders, it also stands for 'Efficiency'. While the transition from paper-based pouches may seem daunting, the benefits of e-AWB compliance are undeniable for long-term growth.</p>\n        \n        <h3>The Roadmap to Full Digital Compliance</h3>\n        <p>Transitioning involves moving from physical document handling to secure digital transmissions. This requires a robust <a href=\"/solutions\">logistics ERP system</a> that can communicate using IATA standards (Cargo-XML or Cargo-IMP). Our <a href=\"/services\">digital services</a> are built to facilitate this shift seamlessly.</p>\n        \n        <h3>How F16s Facilitates the Shift</h3>\n        <p>F16s acts as your digital translation layer. You enter data into our user-friendly interface, and we handle the complex FWB and FHL message formatting required by airlines. We manage the digital signatures and security protocols, making compliance as simple as clicking a button. Discover more in our <a href=\"/product-description\">product description</a>.</p>\n    ",
  takeaways: ["e-AWB adoption reduces document loss and data entry errors.", "Digital compliance is now a standard requirement for major global airlines.", "F16s removes the technical hurdles of IATA messaging compliance.", "Transitioning to e-AWB is a critical step in logistics digital transformation."]
}, {
  title: "F16s Editorial: The Future of Digital Freight Forwarding",
  slug: "f16s-editorial",
  category: "Industry News",
  date: "May 04, 2026",
  readTime: "12 min",
  image: "/media/custome/f16s-logo.svg",
  excerpt: "Discover the vision behind F16s, our roadmap for global logistics automation, and how we're bridging the gap between freight agents and airlines.",
  metaTitle: "F16s Editorial: Digital Transformation in Freight Forwarding",
  metaDescription: "Explore the F16s vision for a connected, paperless, and automated air freight industry. Learn about our EDI integrations and e-AWB compliance solutions.",
  content: "\n        <p>In an era where speed and transparency are no longer luxuries but necessities, the logistics industry is undergoing a massive shift. At <strong>F16s</strong>, we aren't just building software; we are architecting the future of how goods move across the globe.</p>\n        \n        <h3>The Vision: A Truly Connected Supply Chain</h3>\n        <p>For too long, the freight forwarding industry has been hampered by manual data entry, fragmented communication, and outdated legacy systems. Our mission is to eliminate these bottlenecks by providing a unified digital ecosystem. Whether you are managing <a href=\"/services\">air freight</a>, sea cargo, or road logistics, F16s provides the real-time visibility needed to succeed.</p>\n        \n        <h3>Bridging the Gap with Direct Airline Connectivity</h3>\n        <p>One of the core pillars of our platform is direct EDI integration. We connect forwarders directly to over 100+ major airlines, including Emirates, Qatar Airways, and Lufthansa. This allows for instant booking, automated FWB/FHL transmissions, and real-time status updates\u2014all from a single dashboard. You can learn more about our technical <a href=\"/solutions\">logistics solutions</a> here.</p>\n        \n        <h3>Why Digital Transformation Matters Now</h3>\n        <p>The transition to full e-AWB compliance is not just about saving paper; it's about data integrity. By automating the generation of Master Air Waybills (MAWB) and House Air Waybills (HAWB), we reduce 'fat-finger' errors that lead to costly delays at customs and airport warehouses. Our <a href=\"/product-description\">product features</a> are designed to handle these complexities with ease.</p>\n        \n        <h3>Looking Ahead</h3>\n        <p>As we continue to expand our network and refine our AI-driven extraction tools, F16s remains committed to being the backbone of your digital operations. We invite you to <a href=\"/about-us\">learn more about our team</a> or <a href=\"/contact-us\">get in touch</a> to see how we can transform your business today.</p>\n    ",
  takeaways: ["F16s is dedicated to bridging the digital gap in global logistics.", "Direct airline EDI connectivity is a cornerstone of our automation strategy.", "Internal automation reduces errors in MAWB/HAWB documentation.", "Our roadmap focuses on full paperless e-AWB compliance."]
}];

/***/ }),

/***/ "./resources/js/src/view/pages/BlogsAndNews.vue":
/*!******************************************************!*\
  !*** ./resources/js/src/view/pages/BlogsAndNews.vue ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BlogsAndNews_vue_vue_type_template_id_202ad916_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true */ "./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true");
/* harmony import */ var _BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlogsAndNews.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=script&lang=js");
/* harmony import */ var _BlogsAndNews_vue_vue_type_style_index_0_id_202ad916_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css */ "./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BlogsAndNews_vue_vue_type_template_id_202ad916_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _BlogsAndNews_vue_vue_type_template_id_202ad916_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "202ad916",
  null
  
)

/* hot reload */
if (false) // removed by dead control flow
{ var api; }
component.options.__file = "resources/js/src/view/pages/BlogsAndNews.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=script&lang=js":
/*!******************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=script&lang=js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogsAndNews.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_style_index_0_id_202ad916_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=style&index=0&id=202ad916&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true":
/*!************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_template_id_202ad916_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_template_id_202ad916_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogsAndNews_vue_vue_type_template_id_202ad916_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogsAndNews.vue?vue&type=template&id=202ad916&scoped=true");


/***/ })

}]);