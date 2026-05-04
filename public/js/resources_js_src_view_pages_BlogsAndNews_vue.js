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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BlogsAndNews",
  components: {},
  data: function data() {
    return {
      selectedCategory: 'All',
      categories: ['All', 'Air Freight', 'Technology', 'Sea Freight', 'Industry News', 'ERP Solutions'],
      featuredPost: {
        title: "The Future of E-Freight: How AI is Transforming Air Waybill Management",
        excerpt: "Discover how artificial intelligence and machine learning are automating complex documentation processes, reducing errors by 99% and accelerating global trade.",
        category: "Technology",
        date: "May 02, 2026",
        slug: "future-of-e-freight",
        image: "/media/custome/gallary/img-2.png"
      },
      posts: [{
        title: "Standardizing EDI Connectivity for Small Forwarders",
        excerpt: "How small businesses can leverage enterprise-grade EDI tools to compete with global logistics giants.",
        category: "ERP Solutions",
        date: "April 28, 2026",
        slug: "standardizing-edi",
        image: "/media/custome/gallary/img-3.png"
      }, {
        title: "Global Supply Chain Trends to Watch in 2026",
        excerpt: "From sustainability to digital twins, explore the top 5 trends shaping the future of global logistics.",
        category: "Industry News",
        date: "April 25, 2026",
        slug: "trends-2026",
        image: "/media/custome/gallary/img-4.png"
      }, {
        title: "Optimizing Sea Freight with Real-time Tracking",
        excerpt: "Learn how real-time visibility into ocean shipments is reducing demurrage and detention costs.",
        category: "Sea Freight",
        date: "April 20, 2026",
        slug: "sea-freight-tracking",
        image: "/media/custome/gallary/img-2.png"
      }, {
        title: "The Role of FWB and FHL in IATA e-AWB Compliance",
        excerpt: "A deep dive into the technical standards of air freight messaging and why they matter for your business.",
        category: "Air Freight",
        date: "April 15, 2026",
        slug: "iata-compliance",
        image: "/media/custome/gallary/img-3.png"
      }, {
        title: "Cybersecurity in Logistics: Protecting Sensitive Trade Data",
        excerpt: "Best practices for securing your freight forwarding data in an increasingly digital world.",
        category: "Technology",
        date: "April 10, 2026",
        slug: "cybersecurity-logistics",
        image: "/media/custome/gallary/img-4.png"
      }, {
        title: "Bridging the Gap: Road Freight Automation in South Asia",
        excerpt: "Exploring the unique challenges and digital solutions for road transportation across regional borders.",
        category: "Industry News",
        date: "April 05, 2026",
        slug: "road-freight-automation",
        image: "/media/custome/gallary/img-2.png"
      }]
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