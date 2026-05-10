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
/* harmony import */ var _blogData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blogData */ "./resources/js/src/view/blogData.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BlogPost",
  metaInfo: function metaInfo() {
    var siteOrigin = window.location.origin;
    var absoluteImageUrl = siteOrigin + this.post.image;
    var pageUrl = window.location.href;
    var schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": this.post.title,
      "image": [absoluteImageUrl],
      "datePublished": this.post.date,
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
      title: this.post.metaTitle || this.post.title,
      meta: [{
        name: 'description',
        content: this.post.metaDescription || this.post.excerpt
      },
      // Open Graph / Facebook
      {
        property: 'og:type',
        content: 'article'
      }, {
        property: 'og:url',
        content: pageUrl
      }, {
        property: 'og:title',
        content: this.post.metaTitle || this.post.title
      }, {
        property: 'og:description',
        content: this.post.metaDescription || this.post.excerpt
      }, {
        property: 'og:image',
        content: absoluteImageUrl
      }, {
        property: 'og:image:alt',
        content: this.post.title
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      }, {
        name: 'twitter:url',
        content: pageUrl
      }, {
        name: 'twitter:title',
        content: this.post.metaTitle || this.post.title
      }, {
        name: 'twitter:description',
        content: this.post.metaDescription || this.post.excerpt
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
    var _this = this;
    return {
      readingProgress: 0,
      showShareModal: false,
      currentUrl: window.location.href,
      copyStatus: 'Copy Link',
      copyMessageStatus: 'Copy Message for Sharing',
      post: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.find(function (b) {
        return b.slug === _this.$route.params.slug;
      }) || _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs[0],
      relatedPosts: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.filter(function (b) {
        return b.slug !== _this.$route.params.slug;
      }).slice(0, 2)
    };
  },
  watch: {
    '$route.params.slug': {
      handler: function handler(newSlug) {
        this.post = _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.find(function (b) {
          return b.slug === newSlug;
        }) || _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs[0];
        this.relatedPosts = _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.filter(function (b) {
          return b.slug !== newSlug;
        }).slice(0, 2);
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
    updateProgress: function updateProgress() {
      var scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var scrolled = window.scrollY;
      this.readingProgress = scrolled / scrollH * 100;
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true ***!
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

/***/ "./resources/js/src/view/blogData.js":
/*!*******************************************!*\
  !*** ./resources/js/src/view/blogData.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "blogs": () => (/* binding */ blogs)
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

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-b02c7d44] {\n    font-family: 'Inter', sans-serif;\n}\n.content-container[data-v-b02c7d44] {\n    position: relative;\n    z-index: 10;\n}\n\n/* Reading Progress Bar */\n.reading-progress-container[data-v-b02c7d44] {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 4px;\n    z-index: 1000;\n}\n.reading-progress-bar[data-v-b02c7d44] {\n    height: 100%;\n    background: linear-gradient(to right, #355594, #4a72c9);\n    transition: width 0.1s ease;\n}\n\n/* Breadcrumb */\n.blog-breadcrumb[data-v-b02c7d44] { font-size: 0.9rem; color: #64748b; font-weight: 500;\n}\n.blog-breadcrumb a[data-v-b02c7d44] { color: #355594; text-decoration: none;\n}\n.blog-breadcrumb a[data-v-b02c7d44]:hover { text-decoration: underline;\n}\n.current-crumb[data-v-b02c7d44] { font-weight: 700; color: #1e3a6e;\n}\n\n/* Header */\n.post-category-pill[data-v-b02c7d44] { background: #f0f7ff; color: #355594; padding: 6px 16px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;\n}\n.post-read-time[data-v-b02c7d44] { font-size: 0.9rem; color: #64748b; font-weight: 500;\n}\n.post-title[data-v-b02c7d44] { font-size: 3rem; font-weight: 900; color: #1e3a6e; line-height: 1.1; letter-spacing: -1.5px;\n}\n.author-name[data-v-b02c7d44] { font-weight: 700; color: #1e3a6e; font-size: 1rem; line-height: 1;\n}\n.post-date[data-v-b02c7d44] { color: #64748b; font-size: 0.85rem; margin-top: 2px;\n}\n\n/* Content Styling */\n.featured-image-container[data-v-b02c7d44] { border-radius: 32px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1);\n}\n.post-featured-img[data-v-b02c7d44] { width: 100%; border-radius: 32px;\n}\n.lead-text[data-v-b02c7d44] { font-size: 1.5rem; color: #334155; line-height: 1.5; font-weight: 500;\n}\n.article-body[data-v-b02c7d44] { font-size: 1.2rem; color: #334155; line-height: 1.8;\n}\n.article-body h3[data-v-b02c7d44] { font-size: 1.8rem; font-weight: 800; color: #1e3a6e; margin-top: 2.5rem; margin-bottom: 1.25rem;\n}\n.article-body p[data-v-b02c7d44] { margin-bottom: 1.5rem;\n}\n\n/* Takeaways Box */\n.takeaways-box[data-v-b02c7d44] { background: #f8fbff !important; border: 1px solid #e0f0ff !important;\n}\n.takeaways-box h3[data-v-b02c7d44] { font-weight: 800; color: #1e3a6e; font-size: 1.4rem;\n}\n.takeaway-icon-spacing[data-v-b02c7d44] { margin-right: 24px !important;\n}\n\n/* Share & Related */\n.share-btn[data-v-b02c7d44] { width: 40px; height: 40px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 1.1rem; transition: all 0.3s ease; text-decoration: none;\n}\n.share-btn[data-v-b02c7d44]:hover { background: #355594; color: white; transform: translateY(-3px);\n}\n.related-card[data-v-b02c7d44] { cursor: pointer; transition: transform 0.3s ease;\n}\n.related-card[data-v-b02c7d44]:hover { transform: translateY(-5px);\n}\n.related-img-wrap[data-v-b02c7d44] { border-radius: 20px; overflow: hidden; height: 180px;\n}\n.related-img-wrap img[data-v-b02c7d44] { width: 100%; height: 100%; -o-object-fit: cover; object-fit: cover;\n}\n.related-title[data-v-b02c7d44] { font-size: 1.1rem; font-weight: 700; color: #1e3a6e; line-height: 1.4;\n}\n\n\n\n/* PREMIUM SHARE MODAL STYLING */\n[data-v-b02c7d44] .premium-share-modal {\n    background: rgba(255, 255, 255, 0.8) !important;\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px) !important;\n    border: 1px solid rgba(255, 255, 255, 0.6) !important;\n    border-radius: 32px !important;\n    box-shadow: 0 40px 100px rgba(53, 85, 148, 0.15) !important;\n    overflow: hidden;\n}\n[data-v-b02c7d44] .premium-share-modal .modal-header {\n    border-bottom: 1px solid rgba(53, 85, 148, 0.08);\n    padding: 1.5rem 2rem;\n}\n[data-v-b02c7d44] .premium-share-modal .modal-title {\n    font-weight: 800;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n}\n.social-preview-card[data-v-b02c7d44] {\n    border-radius: 24px;\n    overflow: hidden;\n    background: white;\n    border: 1px solid rgba(53, 85, 148, 0.1);\n    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.06);\n    transition: transform 0.3s ease;\n}\n.social-preview-card[data-v-b02c7d44]:hover {\n    transform: scale(1.02);\n}\n.social-card-image[data-v-b02c7d44] {\n    width: 100%;\n    aspect-ratio: 1.91 / 1;\n    overflow: hidden;\n}\n.social-card-image img[data-v-b02c7d44] {\n    width: 100%;\n    height: 100%;\n    -o-object-fit: cover;\n       object-fit: cover;\n}\n.social-card-content[data-v-b02c7d44] {\n    padding: 20px;\n}\n.social-card-domain[data-v-b02c7d44] {\n    font-size: 0.85rem;\n    color: #355594;\n    letter-spacing: -0.2px;\n    font-weight: 700;\n    margin-bottom: 8px;\n    opacity: 0.8;\n}\n.social-card-title[data-v-b02c7d44] {\n    font-size: 1.15rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    margin-bottom: 10px;\n    line-height: 1.3;\n}\n.social-card-excerpt[data-v-b02c7d44] {\n    font-size: 0.9rem;\n    color: #5A6B8A;\n    line-height: 1.6;\n    margin-bottom: 0;\n}\n.social-icon-btn[data-v-b02c7d44] {\n    width: 54px;\n    height: 54px;\n    border-radius: 18px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 1.4rem;\n    color: white;\n    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n    text-decoration: none;\n}\n.social-icon-btn.linkedin[data-v-b02c7d44] { background: #0077b5; box-shadow: 0 8px 20px rgba(0, 119, 181, 0.25);\n}\n.social-icon-btn.twitter[data-v-b02c7d44] { background: #1da1f2; box-shadow: 0 8px 20px rgba(29, 161, 242, 0.25);\n}\n.social-icon-btn.facebook[data-v-b02c7d44] { background: #1877f2; box-shadow: 0 8px 20px rgba(24, 119, 242, 0.25);\n}\n.social-icon-btn.whatsapp[data-v-b02c7d44] { background: #25d366; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.25);\n}\n.social-icon-btn[data-v-b02c7d44]:hover { transform: translateY(-6px) rotate(8deg); color: white; filter: brightness(1.1);\n}\n.copy-btn[data-v-b02c7d44] {\n    border: none;\n    border-radius: 16px;\n    font-weight: 800;\n    font-size: 0.95rem;\n    transition: all 0.3s ease;\n    letter-spacing: -0.2px;\n}\n.copy-btn.link-btn[data-v-b02c7d44] { \n    background: #f0f7ff; \n    color: #355594; \n    border: 1px solid rgba(53, 85, 148, 0.1);\n}\n.copy-btn.message-btn[data-v-b02c7d44] { \n    background: #355594; \n    color: white;\n}\n.copy-btn[data-v-b02c7d44]:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(53, 85, 148, 0.1);\n}\n.copy-btn.message-btn[data-v-b02c7d44]:hover { box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25);\n}\n@media (max-width: 991px) {\n.post-title[data-v-b02c7d44] { font-size: 2.25rem;\n}\n.lead-text[data-v-b02c7d44] { font-size: 1.25rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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
if (false) { var api; }
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

/***/ "./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_template_id_b02c7d44_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=template&id=b02c7d44&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_b02c7d44_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/BlogPost.vue?vue&type=style&index=0&id=b02c7d44&scoped=true&lang=css");


/***/ })

}]);