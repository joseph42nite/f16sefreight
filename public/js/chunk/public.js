"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["public"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/DecorativeEllipses.vue */ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue");
/* harmony import */ var _components_SectionHeader_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/SectionHeader.vue */ "./resources/js/src/view/pages/public/components/SectionHeader.vue");
/* harmony import */ var _components_HeroButton_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/HeroButton.vue */ "./resources/js/src/view/pages/public/components/HeroButton.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AboutUs",
  metaInfo: {
    title: "About F16s | Our Vision for Digital Freight Forwarding",
    meta: [{
      name: 'description',
      content: 'Learn about F16s E-Freight Solutions, dedicated to transforming logistics management for small and medium-sized businesses with innovative, affordable digital tools.'
    }, {
      property: 'og:title',
      content: 'About F16s | Our Vision for Digital Freight Forwarding'
    }, {
      property: 'og:description',
      content: 'Learn about F16s E-Freight Solutions, dedicated to transforming logistics management for small and medium-sized businesses with innovative, affordable digital tools.'
    }]
  },
  components: {
    DecorativeEllipses: _components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    SectionHeader: _components_SectionHeader_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    HeroButton: _components_HeroButton_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      we_offer_section_cards: [{
        titleImgSrc: "/media/custome/about/focus-air.svg",
        imgSrc: "/media/custome/about/plane.png",
        imgAlt: "FOCUS AIR",
        text: "Streamline your air freight data with seamless airline connectivity and real-time insights."
      }, {
        titleImgSrc: "/media/custome/about/focus-sea.svg",
        imgSrc: "/media/custome/about/boat.png",
        imgAlt: "FOCUS SEA",
        text: "Simplify sea freight management with efficient stock control and sales analysis."
      }, {
        titleImgSrc: "/media/custome/about/focus-road.svg",
        imgSrc: "/media/custome/about/truck.png",
        imgAlt: "FOCUS ROAD",
        text: "Manage road freight documentation and bookings with ease, complete with secure data transfers."
      }],
      chooseUsItems: [{
        icon: "/media/custome/about/choose-us-1.svg",
        title: "Innovative Technology for Small Businesses",
        desc: "Our technology solutions are built with the needs of small enterprises in mind. From database solutions to a basic ERP system, F16s equips you with the tools to track your growth month on month, helping you identify areas for improvement and operational enhancements."
      }, {
        icon: "/media/custome/about/choose-us-2.svg",
        title: "Affordable and Scalable",
        desc: "We understand the unique challenges small businesses face in logistics. Our pricing options are crafted to be budget-friendly, providing essential tools in our Basic plan like database management and printable documentation, while our Pro plan connects businesses to multiple AWBs and adds advanced features to support growing needs."
      }, {
        icon: "/media/custome/about/choose-us-3.svg",
        title: "Commitment to Customer Support",
        desc: "Our team is committed to helping you succeed. We offer dedicated support and resources for all our clients, ensuring that each business can leverage our platform to the fullest. We’re here to provide guidance, answer questions, and assist in adapting our solutions to meet your specific needs."
      }]
    };
  }
});

/***/ }),

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
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/DecorativeEllipses.vue */ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue");
/* harmony import */ var _components_HomeHero_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/HomeHero.vue */ "./resources/js/src/view/pages/public/components/HomeHero.vue");
/* harmony import */ var _components_HomePartnersTicker_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/HomePartnersTicker.vue */ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue");
/* harmony import */ var _components_HomeFeatureGrid_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/HomeFeatureGrid.vue */ "./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue");
/* harmony import */ var _components_HomeServicesGrid_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/HomeServicesGrid.vue */ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue");
/* harmony import */ var _components_HomeStatsSection_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/HomeStatsSection.vue */ "./resources/js/src/view/pages/public/components/HomeStatsSection.vue");
/* harmony import */ var _components_HomeNewsSection_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/HomeNewsSection.vue */ "./resources/js/src/view/pages/public/components/HomeNewsSection.vue");
/* harmony import */ var _components_HomeFaqSection_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/HomeFaqSection.vue */ "./resources/js/src/view/pages/public/components/HomeFaqSection.vue");








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Home",
  metaInfo: {
    title: "F16s E-Freight Solutions | Smart Logistics & AWB Automation",
    meta: [{
      name: 'description',
      content: 'Streamline your freight forwarding with F16s E-Freight Solutions. Process MAWB and HAWB in under 3 seconds, connect with 150+ airlines globally, and automate your digital logistics workflow.'
    }, {
      property: 'og:title',
      content: 'F16s E-Freight Solutions | Smart Logistics & AWB Automation'
    }, {
      property: 'og:description',
      content: 'Streamline your freight forwarding with F16s E-Freight Solutions. Process MAWB and HAWB in under 3 seconds, connect with 150+ airlines globally, and automate your digital logistics workflow.'
    }],
    script: [{
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "F16s E-Freight Platform",
        "operatingSystem": "Web-based",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Smart e-Freight Solutions for Freight Forwarders. Process MAWB and HAWB in seconds with 150+ airline connections."
      }),
      type: 'application/ld+json'
    }],
    __dangerouslyDisableSanitizers: ['script']
  },
  components: {
    DecorativeEllipses: _components_DecorativeEllipses_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    HomeHero: _components_HomeHero_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    HomePartnersTicker: _components_HomePartnersTicker_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    HomeFeatureGrid: _components_HomeFeatureGrid_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    HomeServicesGrid: _components_HomeServicesGrid_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    HomeStatsSection: _components_HomeStatsSection_vue__WEBPACK_IMPORTED_MODULE_5__["default"],
    HomeNewsSection: _components_HomeNewsSection_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    HomeFaqSection: _components_HomeFaqSection_vue__WEBPACK_IMPORTED_MODULE_7__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      forget_password: {
        email: '',
        userType: '',
        password: '',
        password_confirmation: ''
      },
      token: '',
      has_error: true,
      password_changed: false
    };
  },
  methods: {
    ResetPassword: function ResetPassword() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post("/ForgotpasswordActual", this.forget_password).then(function (res) {
        _this.password_changed = true;
      })["catch"](function (err) {
        // console.log(err);
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;
    this.token = this.$route.params.token;
    this.forget_password.email = this.$route.params.email;
    this.forget_password.userType = this.$route.params.userType;
    var credintial = {
      "token": this.token,
      "email": this.forget_password.email
    };
    axios__WEBPACK_IMPORTED_MODULE_0___default().post('/check-forgot-token', credintial).then(function (res) {
      if (!res.data.status) {
        _this2.has_error = false;
      }
    })["catch"](function (err) {
      _this2.has_error = false;
    });
  }
});

/***/ }),

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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Solutions.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Solutions.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Solutions",
  components: {},
  data: function data() {
    return {};
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js ***!
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js ***!
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeFaqSection",
  data: function data() {
    return {
      accordions: [{
        title: "Does F16s support multiple AWB connections?",
        content: "Yes, our Pro plan allows users to connect multiple AWBs for seamless data transfer across airlines and logistics partners.",
        isOpen: false
      }, {
        title: "Can I print my freight documents from F16s?",
        content: "Yes, our platform includes a document printing option for MAWB, HAWB and consolidation.",
        isOpen: false
      }, {
        title: "Can I search for past AWBs?",
        content: "Yes, you can view the last 10, 20, 50, or 100 executed AWBs, check their history, and access shipment tracking, HAWB details, and message logs.",
        isOpen: false
      }, {
        title: "What are the pricing options for F16s?",
        content: "We offer a Basic plan for database management and printable documentation, while the Pro plan includes multiple AWB connections and additional feature.",
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeFeatureGrid",
  data: function data() {
    return {
      features: [{
        title: "Small Business",
        description: "Tailored logistics solutions designed to help growing businesses scale efficiently.",
        icon: "/media/custome/small-business.png",
        link: "/small-business"
      }, {
        title: "Cloud Storage",
        description: "Secure, high-speed access to all your freight documents and history, anywhere, anytime.",
        icon: "/media/custome/cloud-storage.png",
        link: "/cloud-storage"
      }, {
        title: "Privacy",
        description: "Enterprise-grade encryption ensuring your sensitive data and trade secrets remain confidential.",
        icon: "/media/custome/privacy.png",
        link: "/privacy"
      }, {
        title: "End to End Service",
        description: "Comprehensive freight management from initial booking to final delivery, fully automated.",
        icon: "/media/custome/end-to-end-service.png",
        link: "/end-to-end"
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeHero",
  data: function data() {
    return {
      currentHeroIndex: 0,
      heroInterval: null,
      imagesReady: [false, false, false],
      heroServices: [{
        title: 'FOCUS AIR',
        image: '/media/custome/banner-plane.webp',
        fallbackImage: '/media/custome/banner-plane.jpg',
        extraStyle: {}
      }, {
        title: 'FOCUS SEA',
        image: '/media/custome/banner-ship.webp',
        fallbackImage: '/media/custome/banner-ship.jpg',
        extraStyle: {}
      }, {
        title: 'FOCUS ROAD',
        image: '/media/custome/banner-truck.webp',
        fallbackImage: '/media/custome/banner-truck.jpg',
        extraStyle: {
          marginTop: '40px'
        }
      }]
    };
  },
  mounted: function mounted() {
    var _this = this;
    // First image: inject a real <link rel="preload"> in the <head> for fastest possible load
    var preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = this.heroServices[0].image;
    preloadLink.type = 'image/webp';
    document.head.appendChild(preloadLink);

    // Mark first image ready immediately — don't block on onload
    this.$set(this.imagesReady, 0, true);

    // Preload remaining slides in background
    this.heroServices.slice(1).forEach(function (service, i) {
      var img = new Image();
      img.onload = function () {
        _this.$set(_this.imagesReady, i + 1, true);
      };
      img.src = service.image;
    });

    // Hero slideshow interval
    this.heroInterval = setInterval(function () {
      var nextIndex = (_this.currentHeroIndex + 1) % _this.heroServices.length;
      if (_this.imagesReady[nextIndex]) {
        _this.currentHeroIndex = nextIndex;
      }
    }, 4000);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _blogData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blogData */ "./resources/js/src/view/pages/public/blogData.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeNewsSection",
  data: function data() {
    return {
      featuredPost: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs[0],
      newsItems: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.slice(1, 5)
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomePartnersTicker",
  data: function data() {
    return {
      affiliateImages: ["/media/custome/affiliation-tags/air-france.png", "/media/custome/affiliation-tags/emirates.png", "/media/custome/affiliation-tags/lufthansa.png", "/media/custome/affiliation-tags/qatar.png", "/media/custome/affiliation-tags/turkish-airlines.png", "/media/custome/affiliation-tags/Etihad-airways-logo.png", "/media/custome/affiliation-tags/air-india.jpg", "/media/custome/affiliation-tags/klm.png"]
    };
  },
  computed: {
    expandedLogos: function expandedLogos() {
      var logos = [];
      for (var i = 0; i < 30; i++) {
        logos = logos.concat(this.affiliateImages);
      }
      return logos;
    }
  },
  methods: {
    getLogoClass: function getLogoClass(img) {
      var lowerImg = img.toLowerCase();
      return {
        'is-long-logo': lowerImg.includes('air-france') || lowerImg.includes('etihad'),
        'is-large-logo': lowerImg.includes('lufthansa') || lowerImg.includes('qatar'),
        'is-extra-large-logo': lowerImg.includes('air-india')
      };
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeServicesGrid"
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeStatsSection",
  data: function data() {
    return {
      animatedStats: {
        awbs: 0,
        airlines: 0,
        speed: 0
      },
      hasAnimatedStats: {
        awbs: false,
        airlines: false,
        speed: false
      },
      statsData: {
        awbs: {
          label: "AWBs Processed",
          target: 100000,
          suffix: "",
          icon: "file-earmark-check",
          description: "Our robust EDI engine has successfully processed over 1,0,000 Air Waybills, providing unmatched reliability for freight forwarders globally."
        },
        airlines: {
          label: "Airlines",
          target: 150,
          suffix: "+",
          icon: "cursor",
          description: "Seamlessly connect with 150+ airlines via our direct EDI integrations. No more manual entry—just instant, accurate data transmission to any carrier."
        },
        speed: {
          label: "Processing Speed",
          target: 3,
          suffix: " sec",
          icon: "lightning-charge",
          description: "Experience lightning-fast operations. Our platform automates complex documentation, reducing manual entry time from minutes to just 3 seconds per AWB."
        }
      }
    };
  },
  methods: {
    formatStat: function formatStat(value, key) {
      if (key === 'awbs') {
        return value.toLocaleString('en-IN');
      }
      return value.toLocaleString();
    },
    animateStat: function animateStat(key) {
      var _this = this;
      var target = this.statsData[key].target;
      var duration = 2000;
      var steps = duration / 20;
      var increment = target / steps;
      var current = 0;
      var timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          _this.animatedStats[key] = target;
          clearInterval(timer);
        } else {
          _this.animatedStats[key] = Math.floor(current);
        }
      }, 20);
    },
    isElementInViewport: function isElementInViewport(element) {
      if (!element) return false;
      var rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    },
    checkVisibility: function checkVisibility() {
      var _this2 = this;
      Object.keys(this.statsData).forEach(function (key) {
        var element = _this2.$refs["statRef-".concat(key)] ? _this2.$refs["statRef-".concat(key)][0] : null;
        if (element && !_this2.hasAnimatedStats[key] && _this2.isElementInViewport(element)) {
          _this2.animateStat(key);
          _this2.hasAnimatedStats[key] = true;
        }
      });
      if (!Object.values(this.hasAnimatedStats).every(function (v) {
        return v;
      })) {
        this.animationFrameId = requestAnimationFrame(function () {
          return _this2.checkVisibility();
        });
      }
    }
  },
  mounted: function mounted() {
    var _this3 = this;
    this.animationFrameId = requestAnimationFrame(function () {
      return _this3.checkVisibility();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js ***!
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Privacy",
  metaInfo: {
    title: "Privacy & Data Security | F16s E-Freight Solutions",
    meta: [{
      name: 'description',
      content: 'F16s prioritizes your privacy with strict access controls, global data compliance (GDPR), and enterprise-grade encryption for all your freight documentation.'
    }, {
      property: 'og:title',
      content: 'Privacy & Data Security | F16s E-Freight Solutions'
    }, {
      property: 'og:description',
      content: 'F16s prioritizes your privacy with strict access controls, global data compliance (GDPR), and enterprise-grade encryption for all your freight documentation.'
    }]
  },
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "PrivacyPolicy"
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "Terms-Condition"
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "CloudStorage",
  metaInfo: {
    title: "Secure Cloud Storage for Logistics | F16s E-Freight",
    meta: [{
      name: 'description',
      content: 'Reliable, scalable cloud infrastructure for modern logistics. Secure your freight data with auto-backups, enterprise encryption, and 99.9% uptime.'
    }, {
      property: 'og:title',
      content: 'Secure Cloud Storage for Logistics | F16s E-Freight'
    }, {
      property: 'og:description',
      content: 'Reliable, scalable cloud infrastructure for modern logistics. Secure your freight data with auto-backups, enterprise encryption, and 99.9% uptime.'
    }]
  },
  components: {},
  data: function data() {
    return {
      accordions: [{
        title: "Is my data encrypted in the cloud?",
        content: "Yes, all data stored in the F16s cloud is protected with enterprise-grade end-to-end encryption, ensuring that only authorized users can access your sensitive information.",
        isOpen: false
      }, {
        title: "How often are backups performed?",
        content: "We perform automated daily backups of all your documents and data, ensuring that your records are always recoverable in case of any system issues.",
        isOpen: false
      }, {
        title: "What happens if I exceed my storage limit?",
        content: "Our cloud infrastructure is designed to be scalable. If your business grows beyond your current plan's capacity, we offer flexible upgrade options to accommodate your expanding data needs.",
        isOpen: false
      }, {
        title: "How reliable is the F16s cloud infrastructure?",
        content: "We maintain a 99.9% uptime guarantee, using fully redundant systems to ensure that your freight operations are never disrupted by technical downtime.",
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "EndToEnd",
  metaInfo: {
    title: "End-to-End Freight Services | F16s E-Freight Solutions",
    meta: [{
      name: 'description',
      content: 'Comprehensive end-to-end logistics automation. From AWB generation and airline connectivity to real-time tracking and final delivery.'
    }, {
      property: 'og:title',
      content: 'End-to-End Freight Services | F16s E-Freight Solutions'
    }, {
      property: 'og:description',
      content: 'Comprehensive end-to-end logistics automation. From AWB generation and airline connectivity to real-time tracking and final delivery.'
    }]
  },
  components: {},
  data: function data() {
    return {
      accordions: [{
        title: "What exactly does 'end-to-end' cover in your platform?",
        content: "Our end-to-end service covers the entire digital lifecycle of a shipment—from initial AWB generation and airline connectivity to real-time tracking and final status updates.",
        isOpen: false
      }, {
        title: "Can I integrate F16s with my existing internal ERP?",
        content: "Yes, our platform is built for connectivity. We offer flexible EDI and API options to ensure that your data flows seamlessly between F16s and your existing business management tools.",
        isOpen: false
      }, {
        title: "Is real-time tracking available for all air freight shipments?",
        content: "Yes, through our direct integrations with 150+ airlines, we provide real-time status updates and visibility for all Air Waybills processed through our system.",
        isOpen: false
      }, {
        title: "Does the service help with customs documentation?",
        content: "Our platform automates the generation of MAWB, HAWB, and consolidation manifests, ensuring all required documentation is accurate and ready for customs processing.",
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ProductDescription",
  components: {},
  data: function data() {
    return {
      products: [{
        title: "AWB Execution Tracker",
        description: "Maintain stock for all airlines with original history including last 100 awb clearly visible for complete operational transparency.",
        icon: "/media/custome/affordable-awb.webp"
      }, {
        title: "Stock/AWB Management System",
        description: "Manage your waybill stock with office back history and keep real-time check on availability and usage patterns.",
        icon: "/media/custome/database-management.webp"
      }, {
        title: "EDI Transfer to Airlines",
        description: "Stable system providing data connectivity with 150+ airlines globally for worldwide fast and accurate data transfer.",
        icon: "/media/custome/automated-workflow.webp"
      }, {
        title: "Shipment Status Search Engine",
        description: "Easy and custom search with last search status option, checking history logs, and instant search by AWB number.",
        icon: "/media/custome/real-time.webp"
      }, {
        title: "Tariff Rates & Features System",
        description: "Accurate and reliable tariff rates along with powerful features and tools to make informed decisions for every shipment.",
        icon: "/media/custome/scalable-performance.webp"
      }],
      isReady: false
    };
  },
  mounted: function mounted() {
    var _this = this;
    // Artificial delay to ensure assets are ready and show smooth skeleton
    setTimeout(function () {
      _this.isReady = true;
    }, 600);
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SmallBusiness",
  metaInfo: {
    title: "Logistics Solutions for Small Business | F16s E-Freight",
    meta: [{
      name: 'description',
      content: 'Elevate your small freight forwarding business with F16s. Affordable AWB transfer, secure database management, and EDI tracking tools designed for independent forwarders.'
    }, {
      property: 'og:title',
      content: 'Logistics Solutions for Small Business | F16s E-Freight'
    }, {
      property: 'og:description',
      content: 'Elevate your small freight forwarding business with F16s. Affordable AWB transfer, secure database management, and EDI tracking tools designed for independent forwarders.'
    }]
  },
  components: {},
  data: function data() {
    return {
      accordions: [{
        title: "What features are included in the basic plan?",
        content: "The basic plan includes our full documentation suite, multi-user access for different stations, secure document storage, and printing capabilities for MAWB and HAWB.",
        isOpen: false
      }, {
        title: "How many users can I add on the pro plan?",
        content: "The pro plan offers unlimited user accounts with role-based access control.",
        isOpen: false
      }, {
        title: "Is there a setup fee for F16s?",
        content: "No, we do not charge any hidden setup fees. You only pay the subscription fee for your selected plan.",
        isOpen: false
      }, {
        title: "Can I upgrade from Basic to Pro later?",
        content: "Yes, you can seamlessly upgrade your plan at any time through your account settings.",
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=template&id=373472a1&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=template&id=373472a1&scoped=true ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("decorative-ellipses"), _vm._v(" "), _c("b-container", {
    staticClass: "content-container pb-25"
  }, [_c("section", {
    staticClass: "about-hero-section mt-12 mt-lg-20 mb-20"
  }, [_c("b-row", {
    attrs: {
      "align-v": "stretch"
    }
  }, [_c("b-col", {
    staticClass: "mb-12 mb-lg-0 d-flex flex-column justify-content-center",
    attrs: {
      lg: "6"
    }
  }, [_c("section-header", {
    attrs: {
      align: "left",
      eyebrow: "About Us",
      title: "Transforming Logistics Management",
      tag: "h1",
      marginBottom: "0"
    },
    scopedSlots: _vm._u([{
      key: "subtitle",
      fn: function fn() {
        return [_vm._v("\n                  At F16s E-Freight Solutions, we are dedicated to transforming logistics management by offering seamless, cost-effective digital solutions tailored to meet the needs of small to medium-sized businesses in the logistics and freight forwarding sectors. \n                  "), _c("br"), _c("br"), _vm._v("\n                  With a core focus on accessibility and user-friendliness, we empower businesses by streamlining data transfer, documentation, and tracking processes across air, sea, and road freight modes.\n              ")];
      },
      proxy: true
    }])
  })], 1), _vm._v(" "), _c("b-col", {
    staticClass: "d-flex flex-column justify-content-center",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "vision-card"
  }, [_c("div", {
    staticClass: "vision-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "vision-content"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Our Vision")]), _vm._v(" "), _c("h2", {
    staticClass: "vision-title mb-4"
  }, [_vm._v("Empowering Global Trade")]), _vm._v(" "), _c("p", {
    staticClass: "vision-text"
  }, [_vm._v("\n                  Our vision is to become the go-to digital partner for logistics businesses worldwide. We aim to empower small and growing companies to achieve greater efficiency and cost savings, enabling them to scale seamlessly. By providing reliable, intuitive tools and affordable service options, we’re making it easier for businesses of all sizes to thrive in today’s competitive landscape.\n                ")])])])])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "services-carousel-section mb-25"
  }, [_c("section-header", {
    attrs: {
      eyebrow: "Expertise",
      title: "Our Specialized Products",
      subtitle: "High-performance solutions for every freight challenge."
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "services-modern-grid"
  }, _vm._l(_vm.we_offer_section_cards, function (offer, index) {
    return _c("article", {
      key: index,
      staticClass: "service-product-card"
    }, [_c("div", {
      staticClass: "service-product-image"
    }, [_c("picture", [_c("source", {
      attrs: {
        srcset: offer.imgSrc.replace(".png", ".webp"),
        type: "image/webp"
      }
    }), _vm._v(" "), _c("img", {
      attrs: {
        src: offer.imgSrc,
        alt: offer.imgAlt,
        loading: "lazy"
      }
    })])]), _vm._v(" "), _c("div", {
      staticClass: "service-product-info"
    }, [_c("h3", {
      staticClass: "service-product-title"
    }, [_vm._v(_vm._s(offer.imgAlt))]), _vm._v(" "), _c("p", {
      staticClass: "service-product-desc"
    }, [_vm._v(_vm._s(offer.text))]), _vm._v(" "), _c("hero-button", {
      attrs: {
        to: "/product-description"
      }
    }, [_vm._v("Explore More")])], 1)]);
  }), 0)], 1), _vm._v(" "), _c("section", {
    staticClass: "mb-25"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("section-header", {
    attrs: {
      eyebrow: "Advantages",
      title: "Why Choose Us?"
    }
  })], 1), _vm._v(" "), _vm._l(_vm.chooseUsItems, function (item, idx) {
    return _c("b-col", {
      key: idx,
      staticClass: "mb-8",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "choose-us-item text-center"
    }, [_c("div", {
      staticClass: "choose-us-icon-wrapper mx-auto mb-6"
    }, [_c("img", {
      staticClass: "img-fluid",
      attrs: {
        src: item.icon,
        alt: item.title
      }
    })]), _vm._v(" "), _c("h3", {
      staticClass: "choose-us-title mb-4"
    }, [_vm._v(_vm._s(item.title))]), _vm._v(" "), _c("p", {
      staticClass: "choose-us-desc"
    }, [_vm._v(_vm._s(item.desc))])])]);
  })], 2)], 1), _vm._v(" "), _c("section", {
    staticClass: "story-section mb-20"
  }, [_c("div", {
    staticClass: "story-card"
  }, [_c("picture", [_c("source", {
    attrs: {
      srcset: "/media/custome/about/bottom-img.webp",
      type: "image/webp"
    }
  }), _vm._v(" "), _c("img", {
    staticClass: "story-bg-img",
    attrs: {
      src: "/media/custome/about/bottom-img.png",
      alt: "Our Story Background",
      loading: "lazy"
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "story-overlay"
  }, [_c("span", {
    staticClass: "section-eyebrow text-white opacity-75"
  }, [_vm._v("Origins")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title text-white mb-6"
  }, [_vm._v("Our Story")]), _vm._v(" "), _c("p", {
    staticClass: "story-text"
  }, [_vm._v("\n                  Founded in Bangalore, F16s E-Freight Solutions emerged from the combined knowledge and expertise of a freight-forwarding genius and a seasoned expert in the airline industry. Together, they envisioned a digital platform that would address the unique challenges faced by small and mid-sized logistics companies, who often lack access to the advanced tools available to larger players.\n              ")]), _vm._v(" "), _c("p", {
    staticClass: "story-text mt-4"
  }, [_vm._v("\n                  Recognizing the high cost and complexity of existing logistics solutions, they set out to create an affordable, easy-to-use platform tailored to empower businesses of all sizes. Their shared vision was to streamline logistics processes, enhance efficiency, and make sophisticated freight management accessible to everyone.\n              ")])])])])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


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
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "feature-icon-svg",
    attrs: {
      icon: "chat-square-dots",
      "font-scale": "2",
      "aria-hidden": "true"
    }
  })], 1), _vm._v(" "), _c("h3", {
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
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "feature-icon-svg",
    attrs: {
      icon: "calculator",
      "font-scale": "2",
      "aria-hidden": "true"
    }
  })], 1), _vm._v(" "), _c("h3", {
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
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "feature-icon-svg",
    attrs: {
      icon: "briefcase",
      "font-scale": "2",
      "aria-hidden": "true"
    }
  })], 1), _vm._v(" "), _c("h3", {
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=template&id=d8e9bb8e&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=template&id=d8e9bb8e&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
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
  }, [_c("decorative-ellipses"), _vm._v(" "), _c("b-container", {
    staticClass: "content-container"
  }, [_c("home-hero"), _vm._v(" "), _c("home-partners-ticker"), _vm._v(" "), _c("home-feature-grid"), _vm._v(" "), _c("home-services-grid"), _vm._v(" "), _c("home-stats-section"), _vm._v(" "), _c("home-news-section"), _vm._v(" "), _c("home-faq-section")], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "container"
  }, [_c("div", {
    staticClass: "row justify-content-center"
  }, [_c("div", {
    staticClass: "col-lg-6 col-sm-12 card-box"
  }, [_c("div", {
    staticClass: "card card-default"
  }, [_c("div", {
    staticClass: "card-header h2"
  }, [_vm._v("Reset Password")]), _vm._v(" "), _c("div", {
    staticClass: "card-body"
  }, [_vm.password_changed ? _c("div", {
    staticClass: "text-success h4"
  }, [_vm._v("Password reset successful  "), _c("router-link", {
    attrs: {
      to: "/"
    }
  }, [_vm._v("Login")])], 1) : _vm._e(), _vm._v(" "), _vm.has_error ? _c("form", {
    attrs: {
      autocomplete: "off"
    },
    on: {
      submit: function submit($event) {
        $event.preventDefault();
        return _vm.ResetPassword.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "form-group"
  }, [_c("span", {
    attrs: {
      "for": "email"
    }
  }, [_vm._v("E-mail")]), _vm._v("   \n                "), _c("input", {
    staticClass: "form-control",
    attrs: {
      type: "email",
      id: "email",
      required: "",
      readonly: ""
    },
    domProps: {
      value: _vm.forget_password.email
    }
  }), _vm._v(" "), _c("span", {
    attrs: {
      "for": "password"
    }
  }, [_vm._v("Password")]), _vm._v("   \n                "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.forget_password.password,
      expression: "forget_password.password"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      id: "password",
      required: ""
    },
    domProps: {
      value: _vm.forget_password.password
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.forget_password, "password", $event.target.value);
      }
    }
  }), _vm._v(" "), _c("span", {
    attrs: {
      "for": "conform_password"
    }
  }, [_vm._v("Confirm Password")]), _vm._v("   \n                "), _c("input", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.forget_password.password_confirmation,
      expression: "forget_password.password_confirmation"
    }],
    staticClass: "form-control",
    attrs: {
      type: "password",
      id: "password_confirmation",
      required: ""
    },
    domProps: {
      value: _vm.forget_password.password_confirmation
    },
    on: {
      input: function input($event) {
        if ($event.target.composing) return;
        _vm.$set(_vm.forget_password, "password_confirmation", $event.target.value);
      }
    }
  })]), _vm._v(" "), _c("button", {
    staticClass: "btn btn-primary",
    attrs: {
      type: "submit"
    }
  }, [_vm._v("Reset Password")])]) : _c("div", {
    staticClass: "text-danger"
  }, [_vm._v("Forgot password token is invalid")])])])])])]);
};
var staticRenderFns = [];
render._withStripped = true;


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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Solutions.vue?vue&type=template&id=5d5a8eb0":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Solutions.vue?vue&type=template&id=5d5a8eb0 ***!
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
    staticClass: "content-container pt-12 pb-24"
  }, [_c("section", {
    staticClass: "solutions-hero text-center mb-20 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Innovation")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("Our Solutions")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n        At F16s E-Freight Solutions, we are more than just a logistics technology provider—we are forward thinkers who understand the evolving landscape of global trade. We’re equipping businesses with the tools they need to thrive in a digital world.\n      ")]), _vm._v(" "), _c("div", {
    staticClass: "hero-decoration-wrapper mt-12"
  }, [_c("div", {
    staticClass: "hero-glass-bar"
  }, [_c("div", {
    staticClass: "bar-item"
  }, [_c("b-icon", {
    staticClass: "me-2",
    attrs: {
      icon: "cpu"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Digital Literacy")])], 1), _vm._v(" "), _c("div", {
    staticClass: "bar-divider"
  }), _vm._v(" "), _c("div", {
    staticClass: "bar-item"
  }, [_c("b-icon", {
    staticClass: "me-2",
    attrs: {
      icon: "diagram-3"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Adaptable Tools")])], 1), _vm._v(" "), _c("div", {
    staticClass: "bar-divider"
  }), _vm._v(" "), _c("div", {
    staticClass: "bar-item"
  }, [_c("b-icon", {
    staticClass: "me-2",
    attrs: {
      icon: "shield-check"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Future-Ready")])], 1)])])]), _vm._v(" "), _c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    staticClass: "mb-16",
    attrs: {
      lg: "10"
    }
  }, [_c("div", {
    staticClass: "pillar-card-wrapper"
  }, [_c("div", {
    staticClass: "pillar-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "pillar-card glass-card"
  }, [_c("b-row", {
    attrs: {
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mb-8 mb-md-0",
    attrs: {
      md: "5"
    }
  }, [_c("div", {
    staticClass: "pillar-image-container"
  }, [_c("div", {
    staticClass: "pillar-icon-ring"
  }, [_c("img", {
    staticClass: "pillar-icon-svg",
    attrs: {
      src: "/media/custome/real-time.svg",
      alt: "Digital Literacy Icon"
    }
  })])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "7"
    }
  }, [_c("h2", {
    staticClass: "pillar-title"
  }, [_vm._v("Why Digital Literacy Matters")]), _vm._v(" "), _c("p", {
    staticClass: "pillar-text"
  }, [_vm._v("\n                  The logistics industry is transforming rapidly. Digital literacy is essential for maintaining efficiency and competitiveness in global commerce. Our solutions are designed to bridge the knowledge gap, making it easy for businesses of all sizes to adopt digital practices without overwhelming complexity.\n                ")]), _vm._v(" "), _c("p", {
    staticClass: "pillar-text"
  }, [_vm._v("\n                  We believe every business should leverage digital tools to simplify processes, make better decisions, and achieve operational excellence.\n                ")])])], 1)], 1)])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-16",
    attrs: {
      lg: "10"
    }
  }, [_c("div", {
    staticClass: "pillar-card-wrapper"
  }, [_c("div", {
    staticClass: "pillar-card-glow alt-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "pillar-card glass-card reversed"
  }, [_c("b-row", {
    attrs: {
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "order-2 order-md-1",
    attrs: {
      md: "7"
    }
  }, [_c("h2", {
    staticClass: "pillar-title"
  }, [_vm._v("Future-Ready Solutions")]), _vm._v(" "), _c("p", {
    staticClass: "pillar-text"
  }, [_vm._v("\n                  Our commitment goes beyond current needs—we design solutions that anticipate the future. We know that the logistics industry must evolve alongside technological advances, and we are constantly innovating to create systems that grow with our clients.\n                ")]), _vm._v(" "), _c("p", {
    staticClass: "pillar-text"
  }, [_vm._v("\n                  From scalable architectures to adaptive digital tools, our offerings are crafted to be as dynamic as the global freight industry itself.\n                ")])]), _vm._v(" "), _c("b-col", {
    staticClass: "order-1 order-md-2 mb-8 mb-md-0",
    attrs: {
      md: "5"
    }
  }, [_c("div", {
    staticClass: "pillar-image-container"
  }, [_c("div", {
    staticClass: "pillar-icon-ring alt-ring"
  }, [_c("img", {
    staticClass: "pillar-icon-svg alt-svg",
    attrs: {
      src: "/media/custome/automated-workflow.svg",
      alt: "Future-Ready Icon"
    }
  })])])])], 1)], 1)])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-16",
    attrs: {
      lg: "10"
    }
  }, [_c("div", {
    staticClass: "pillar-card-wrapper"
  }, [_c("div", {
    staticClass: "pillar-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "pillar-card glass-card"
  }, [_c("b-row", {
    attrs: {
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mb-8 mb-md-0",
    attrs: {
      md: "5"
    }
  }, [_c("div", {
    staticClass: "pillar-image-container"
  }, [_c("div", {
    staticClass: "pillar-icon-ring"
  }, [_c("img", {
    staticClass: "pillar-icon-svg",
    attrs: {
      src: "/media/custome/customer-support.svg",
      alt: "Digital Confidence Icon"
    }
  })])])]), _vm._v(" "), _c("b-col", {
    attrs: {
      md: "7"
    }
  }, [_c("h2", {
    staticClass: "pillar-title"
  }, [_vm._v("Building Digital Confidence")]), _vm._v(" "), _c("p", {
    staticClass: "pillar-text"
  }, [_vm._v("\n                  Digital literacy requires support and a genuine understanding of specific needs. Our team works closely with each business to guide them through digital adoption, training them in our systems and empowering them to make technology-driven decisions.\n                ")]), _vm._v(" "), _c("p", {
    staticClass: "pillar-text"
  }, [_vm._v("\n                  At F16s E-Freight Solutions, we are committed to guiding the logistics industry towards a smarter, digitally enabled future where businesses can thrive with confidence.\n                ")])])], 1)], 1)])])], 1), _vm._v(" "), _c("section", {
    staticClass: "solutions-cta mt-8 text-center"
  }, [_c("div", {
    staticClass: "cta-glass-card"
  }, [_c("h2", {
    staticClass: "cta-title"
  }, [_vm._v("Ready to modernize your logistics?")]), _vm._v(" "), _c("p", {
    staticClass: "cta-subtitle mb-8"
  }, [_vm._v("Join the network trusted for over 1,00,000+ AWBs globally.")]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn is-white",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Get Started Now")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64 ***!
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a ***!
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=template&id=3920c8c6":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=template&id=3920c8c6 ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "faq-section-container mb-25",
    attrs: {
      id: "faq-section",
      "aria-labelledby": "faq-heading"
    }
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, [_c("b-col", {
    attrs: {
      lg: "9"
    }
  }, [_c("div", {
    staticClass: "text-center mb-16"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Support")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title",
    attrs: {
      id: "faq-heading"
    }
  }, [_vm._v("Freight Automation FAQs")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4"
  }, [_vm._v("Everything you need to know about the F16s freight management platform.")])]), _vm._v(" "), _c("div", {
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
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "faq-footer mt-16 text-center"
  }, [_c("div", {
    staticClass: "faq-footer-card"
  }, [_c("h4", {
    staticClass: "mb-2"
  }, [_vm._v("Still have questions about our logistics tools?")]), _vm._v(" "), _c("p", {
    staticClass: "mb-6"
  }, [_vm._v("Can't find the answer you're looking for? Please contact our expert logistics team.")]), _vm._v(" "), _c("b-button", {
    staticClass: "faq-contact-btn",
    attrs: {
      to: "/contact-us",
      "aria-label": "Contact our support team"
    }
  }, [_vm._v("Get in Touch")])], 1)])])], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=template&id=393c15c4":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=template&id=393c15c4 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "features-container mb-25",
    attrs: {
      "aria-labelledby": "features-heading"
    }
  }, [_c("div", {
    staticClass: "features-bg-glow"
  }), _vm._v(" "), _c("b-row", {
    staticClass: "features-section"
  }, [_c("b-col", {
    staticClass: "text-center mb-16",
    attrs: {
      cols: "12"
    }
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Capabilities")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title",
    attrs: {
      id: "features-heading"
    }
  }, [_vm._v("Logistics Automation Features")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4"
  }, [_vm._v("Discover the powerful features that streamline your global freight operations.")])]), _vm._v(" "), _vm._l(_vm.features, function (feature, idx) {
    return _c("b-col", {
      key: idx,
      staticClass: "mb-8",
      attrs: {
        lg: "3",
        md: "6",
        sm: "12"
      }
    }, [_c("router-link", {
      attrs: {
        to: feature.link && feature.link !== "#" ? feature.link : "",
        custom: ""
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(_ref) {
          var navigate = _ref.navigate;
          return [_c("div", {
            staticClass: "feature-card-wrapper",
            style: feature.link && feature.link !== "#" ? "cursor: pointer;" : "",
            on: {
              click: function click($event) {
                feature.link && feature.link !== "#" ? navigate($event) : null;
              }
            }
          }, [_c("div", {
            staticClass: "feature-card-glow"
          }), _vm._v(" "), _c("b-card", {
            staticClass: "feature-card h-100"
          }, [_c("div", {
            staticClass: "feature-icon-container mb-8"
          }, [_c("div", {
            staticClass: "icon-circle"
          }), _vm._v(" "), _c("img", {
            staticClass: "feature-icon",
            attrs: {
              src: feature.icon,
              alt: "Icon representing ".concat(feature.title)
            }
          })]), _vm._v(" "), _c("h3", {
            staticClass: "feature-title"
          }, [_vm._v(_vm._s(feature.title))]), _vm._v(" "), _c("p", {
            staticClass: "feature-desc"
          }, [_vm._v(_vm._s(feature.description))]), _vm._v(" "), _c("div", {
            staticClass: "feature-footer mt-auto pt-6"
          }, [_c("div", {
            staticClass: "feature-link"
          }, [_c("span", [_vm._v("Explore Feature")]), _vm._v(" "), _c("b-icon", {
            staticClass: "ms-2",
            attrs: {
              icon: "arrow-right",
              "aria-hidden": "true"
            }
          })], 1)])])], 1)];
        }
      }], null, true)
    })], 1);
  })], 2)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=template&id=225960b0":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=template&id=225960b0 ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "hero-section",
    attrs: {
      "aria-labelledby": "hero-heading"
    }
  }, [!_vm.imagesReady[0] ? _c("div", {
    staticClass: "hero-skeleton-wrapper",
    attrs: {
      "aria-hidden": "true"
    }
  }, [_c("div", {
    staticClass: "hero-skeleton-text"
  }), _vm._v(" "), _c("div", {
    staticClass: "hero-skeleton-image"
  })]) : [_c("transition", {
    attrs: {
      name: "hero-slide"
    }
  }, [_c("div", {
    key: _vm.heroServices[_vm.currentHeroIndex].title,
    staticClass: "hero-bg-text",
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v(_vm._s(_vm.heroServices[_vm.currentHeroIndex].title))])]), _vm._v(" "), _c("div", {
    staticClass: "hero-plane-wrapper"
  }, [_c("transition", {
    attrs: {
      name: "hero-slide"
    }
  }, [_c("picture", {
    key: _vm.heroServices[_vm.currentHeroIndex].image
  }, [_c("source", {
    attrs: {
      srcset: _vm.heroServices[_vm.currentHeroIndex].image,
      type: "image/webp"
    }
  }), _vm._v(" "), _c("img", {
    "class": ["hero-plane", {
      "is-tilted-plane": _vm.heroServices[_vm.currentHeroIndex].title === "FOCUS AIR"
    }],
    style: _vm.heroServices[_vm.currentHeroIndex].extraStyle,
    attrs: {
      src: _vm.heroServices[_vm.currentHeroIndex].fallbackImage,
      alt: "Digital freight logistics solutions",
      fetchpriority: _vm.currentHeroIndex === 0 ? "high" : "low"
    }
  })])])], 1)], _vm._v(" "), _c("div", {
    staticClass: "hero-content"
  }, [_c("div", {
    staticClass: "hero-text-block"
  }, [_c("h1", {
    staticClass: "hero-title",
    attrs: {
      id: "hero-heading"
    }
  }, [_vm._v("Smart e-Freight Solutions for Freight Forwarders")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/about-us",
      "aria-label": "Explore our logistics solutions"
    }
  }, [_c("span", [_vm._v("Explore Now")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right",
      "aria-hidden": "true"
    }
  })], 1)])], 1)])], 2);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("p", {
    staticClass: "hero-subtitle"
  }, [_vm._v("\n                Eliminate manual entry frustrations. Process "), _c("strong", [_vm._v("MAWB and HAWB in under 3 seconds")]), _vm._v(", seamlessly connect with "), _c("strong", [_vm._v("150+ airlines globally")]), _vm._v(", and join the network trusted for over "), _c("strong", [_vm._v("1,0,000+ AWBs")]), _vm._v(".\n            ")]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=template&id=4471a354":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=template&id=4471a354 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "news-section-container mb-25",
    attrs: {
      "aria-labelledby": "news-heading"
    }
  }, [_c("b-row", {
    staticClass: "mb-16 align-items-end"
  }, [_c("b-col", {
    attrs: {
      md: "8"
    }
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Insights")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title",
    attrs: {
      id: "news-heading"
    }
  }, [_vm._v("Latest Logistics News & Insights")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4"
  }, [_vm._v("Stay updated with the evolving landscape of global trade and freight technology.")])]), _vm._v(" "), _c("b-col", {
    staticClass: "text-md-end d-none d-md-block",
    attrs: {
      md: "4"
    }
  }, [_c("b-link", {
    staticClass: "view-all-btn",
    attrs: {
      to: "/blogs-and-news",
      "aria-label": "View all logistics news articles"
    }
  }, [_c("span", [_vm._v("View All News")]), _vm._v(" "), _c("b-icon", {
    staticClass: "ms-2",
    attrs: {
      icon: "arrow-right",
      "aria-hidden": "true"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "6"
    }
  }, [_c("article", {
    staticClass: "news-card featured",
    staticStyle: {
      cursor: "pointer"
    },
    on: {
      click: function click($event) {
        return _vm.$router.push("/blog/" + _vm.featuredPost.slug);
      }
    }
  }, [_c("div", {
    staticClass: "news-image-wrap"
  }, [_c("img", {
    staticClass: "news-img",
    attrs: {
      src: _vm.featuredPost.image,
      alt: _vm.featuredPost.title
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "news-category"
  }, [_vm._v(_vm._s(_vm.featuredPost.category))])]), _vm._v(" "), _c("div", {
    staticClass: "news-body"
  }, [_c("div", {
    staticClass: "news-meta"
  }, [_c("time", {
    staticClass: "news-date",
    attrs: {
      datetime: _vm.featuredPost.date
    }
  }, [_vm._v(_vm._s(_vm.featuredPost.date))]), _vm._v(" "), _c("span", {
    staticClass: "meta-dot"
  }), _vm._v(" "), _c("span", {
    staticClass: "news-author"
  }, [_vm._v("F16s Editorial")])]), _vm._v(" "), _c("h3", {
    staticClass: "news-title"
  }, [_vm._v(_vm._s(_vm.featuredPost.title))]), _vm._v(" "), _c("p", {
    staticClass: "news-excerpt"
  }, [_vm._v(_vm._s(_vm.featuredPost.excerpt))]), _vm._v(" "), _c("b-link", {
    staticClass: "news-read-more",
    attrs: {
      to: "/blog/" + _vm.featuredPost.slug,
      "aria-label": "Read full article"
    }
  }, [_c("span", [_vm._v("Read Full Article")]), _vm._v(" "), _c("b-icon", {
    staticClass: "ms-1",
    attrs: {
      icon: "plus",
      "aria-hidden": "true"
    }
  })], 1)], 1)])]), _vm._v(" "), _c("b-col", {
    attrs: {
      lg: "6"
    }
  }, [_c("b-row", _vm._l(_vm.newsItems, function (news, idx) {
    return _c("b-col", {
      key: idx,
      staticClass: "mb-8",
      attrs: {
        md: "6"
      }
    }, [_c("article", {
      staticClass: "news-card small",
      staticStyle: {
        cursor: "pointer"
      },
      on: {
        click: function click($event) {
          return _vm.$router.push("/blog/" + news.slug);
        }
      }
    }, [_c("div", {
      staticClass: "news-image-wrap small"
    }, [_c("img", {
      staticClass: "news-img",
      attrs: {
        src: news.image,
        alt: news.title
      }
    }), _vm._v(" "), _c("div", {
      staticClass: "news-category"
    }, [_vm._v(_vm._s(news.category))])]), _vm._v(" "), _c("div", {
      staticClass: "news-body"
    }, [_c("div", {
      staticClass: "news-meta"
    }, [_c("span", {
      staticClass: "news-date"
    }, [_vm._v(_vm._s(news.date))])]), _vm._v(" "), _c("h4", {
      staticClass: "news-title-small"
    }, [_vm._v(_vm._s(news.title))]), _vm._v(" "), _c("b-link", {
      staticClass: "news-link-simple",
      attrs: {
        to: "/blog/" + news.slug,
        "aria-label": "Read more about ".concat(news.title)
      }
    }, [_vm._v("Read More")])], 1)])]);
  }), 1)], 1)], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "aff-section",
    attrs: {
      "aria-label": "Our Airline Partners"
    }
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "aff-divider"
  }), _vm._v(" "), _c("div", {
    staticClass: "aff-track-wrap"
  }, [_c("div", {
    staticClass: "scroller-track"
  }, _vm._l(_vm.expandedLogos, function (img, idx) {
    return _c("div", {
      key: idx,
      staticClass: "aff-logo-wrap"
    }, [_c("img", {
      staticClass: "affiliate-logo",
      "class": _vm.getLogoClass(img),
      attrs: {
        src: img,
        alt: "Partner airline logo ".concat(idx + 1)
      }
    })]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "aff-label"
  }, [_c("span", {
    staticClass: "aff-eyebrow"
  }, [_vm._v("Partners")]), _vm._v(" "), _c("h2", {
    staticClass: "aff-heading"
  }, [_vm._v("Global Airline Affiliations")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "services-carousel-section mb-25",
    attrs: {
      "aria-labelledby": "services-heading"
    }
  }, [_c("b-row", [_c("b-col", {
    attrs: {
      cols: "12"
    }
  }, [_c("div", {
    staticClass: "section-header text-center mb-16"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Expertise")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title",
    attrs: {
      id: "services-heading"
    }
  }, [_vm._v("Specialized Logistics Services")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4"
  }, [_vm._v("High-performance solutions for every freight challenge.")])]), _vm._v(" "), _c("div", {
    staticClass: "services-modern-grid"
  }, [_c("router-link", {
    attrs: {
      to: "/product-description",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref) {
        var navigate = _ref.navigate;
        return [_c("article", {
          staticClass: "service-product-card is-coming-soon order-lg-1 order-2",
          staticStyle: {
            cursor: "pointer"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "service-product-badge"
        }, [_vm._v("Upcoming")]), _vm._v(" "), _c("div", {
          staticClass: "service-product-image"
        }, [_c("picture", [_c("source", {
          attrs: {
            srcset: "/media/custome/about/boat.webp",
            type: "image/webp"
          }
        }), _vm._v(" "), _c("img", {
          attrs: {
            src: "/media/custome/about/boat.jpg",
            alt: "Focus Sea - Digital Ocean Freight Management"
          }
        })])]), _vm._v(" "), _c("div", {
          staticClass: "service-product-info"
        }, [_c("h3", {
          staticClass: "service-product-title"
        }, [_vm._v("FOCUS SEA")]), _vm._v(" "), _c("p", {
          staticClass: "service-product-desc"
        }, [_vm._v("Streamlined ocean freight documentation and container tracking. Manage every wave of your sea logistics with one-click efficiency.")]), _vm._v(" "), _c("b-button", {
          staticClass: "service-product-btn",
          attrs: {
            disabled: ""
          }
        }, [_c("span", [_vm._v("Coming Soon")])])], 1)])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/product-description",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref2) {
        var navigate = _ref2.navigate;
        return [_c("article", {
          staticClass: "service-product-card order-lg-2 order-1",
          staticStyle: {
            cursor: "pointer"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "service-product-image"
        }, [_c("picture", [_c("source", {
          attrs: {
            srcset: "/media/custome/about/plane.webp",
            type: "image/webp"
          }
        }), _vm._v(" "), _c("img", {
          attrs: {
            src: "/media/custome/about/plane.jpg",
            alt: "Focus Air - Automated Air Freight Solutions"
          }
        })])]), _vm._v(" "), _c("div", {
          staticClass: "service-product-info"
        }, [_c("h3", {
          staticClass: "service-product-title"
        }, [_vm._v("FOCUS AIR")]), _vm._v(" "), _c("p", {
          staticClass: "service-product-desc"
        }, [_vm._v("The gold standard in air freight automation. Instant AWB generation, real-time EDI connectivity, and automated status updates.")]), _vm._v(" "), _c("b-button", {
          staticClass: "hero-btn",
          attrs: {
            to: "/product-description",
            "aria-label": "Start using Focus Air services"
          }
        }, [_c("span", [_vm._v("Explore More")]), _vm._v(" "), _c("div", {
          staticClass: "btn-icon"
        }, [_c("b-icon", {
          attrs: {
            icon: "arrow-right",
            "aria-hidden": "true"
          }
        })], 1)])], 1)])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/product-description",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref3) {
        var navigate = _ref3.navigate;
        return [_c("article", {
          staticClass: "service-product-card is-coming-soon order-lg-3 order-3",
          staticStyle: {
            cursor: "pointer"
          },
          on: {
            click: navigate
          }
        }, [_c("div", {
          staticClass: "service-product-badge"
        }, [_vm._v("Upcoming")]), _vm._v(" "), _c("div", {
          staticClass: "service-product-image"
        }, [_c("picture", [_c("source", {
          attrs: {
            srcset: "/media/custome/about/truck.webp",
            type: "image/webp"
          }
        }), _vm._v(" "), _c("img", {
          attrs: {
            src: "/media/custome/about/truck.jpg",
            alt: "Focus Road - Road Transportation Management"
          }
        })])]), _vm._v(" "), _c("div", {
          staticClass: "service-product-info"
        }, [_c("h3", {
          staticClass: "service-product-title"
        }, [_vm._v("FOCUS ROAD")]), _vm._v(" "), _c("p", {
          staticClass: "service-product-desc"
        }, [_vm._v("Simplified road transportation management. Handle local trucking and cross-border freight with powerful dispatching tools.")]), _vm._v(" "), _c("b-button", {
          staticClass: "service-product-btn",
          attrs: {
            disabled: ""
          }
        }, [_c("span", [_vm._v("Coming Soon")])])], 1)])];
      }
    }])
  })], 1)])], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=template&id=477434f4":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=template&id=477434f4 ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("section", {
    staticClass: "stats-container mb-25",
    attrs: {
      "aria-labelledby": "stats-heading"
    }
  }, [_c("b-row", {
    attrs: {
      "align-v": "center"
    }
  }, [_c("b-col", {
    staticClass: "mb-12 mb-lg-0",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "stats-intro"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Our Impact")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title",
    attrs: {
      id: "stats-heading"
    }
  }, [_vm._v("Redefining Logistics Standards")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4"
  }, [_vm._v("We are driving the future of logistics through advanced automation and global EDI connectivity.")]), _vm._v(" "), _c("div", {
    staticClass: "stats-decoration-line mt-8"
  })])]), _vm._v(" "), _c("b-col", {
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "stats-minimal-grid"
  }, _vm._l(_vm.statsData, function (stat, key) {
    return _c("div", {
      key: key,
      ref: "statRef-".concat(key),
      refInFor: true,
      staticClass: "stat-minimal-item"
    }, [_c("div", {
      staticClass: "stat-minimal-icon"
    }, [_c("b-icon", {
      attrs: {
        icon: stat.icon,
        "aria-hidden": "true"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "stat-minimal-info"
    }, [_c("div", {
      staticClass: "stat-minimal-number"
    }, [_vm._v("\n                            " + _vm._s(_vm.formatStat(_vm.animatedStats[key], key)) + _vm._s(stat.suffix) + "\n                        ")]), _vm._v(" "), _c("h3", {
      staticClass: "stat-minimal-label"
    }, [_vm._v(_vm._s(stat.label))]), _vm._v(" "), _c("p", {
      staticClass: "stat-minimal-desc"
    }, [_vm._v(_vm._s(stat.description))])])]);
  }), 0)])], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3 ***!
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=template&id=34b613c8":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=template&id=34b613c8 ***!
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
    staticClass: "feature-icon-container mb-8 mx-auto"
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
    staticClass: "feature-icon-container mb-8 mx-auto"
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
    staticClass: "feature-icon-container mb-8 mx-auto"
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
    staticClass: "feature-icon-container mb-8 mx-auto"
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
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])]), _vm._v(" "), _c("section", {
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=template&id=028befcc":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=template&id=028befcc ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "privacy-hero text-center mb-16 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Data Governance")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("Privacy Policy")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n        F16s E-Freight Solutions is committed to the highest standards of data protection. This policy outlines how we handle, process, and safeguard your operational intelligence.\n      ")])]), _vm._v(" "), _c("div", {
    staticClass: "unified-terms-wrapper"
  }, [_c("div", {
    staticClass: "terms-glass-card"
  }, [_c("div", {
    staticClass: "terms-inner-content"
  }, [_c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("1. F16s as a Data Processor")]), _vm._v(" "), _c("p", [_vm._v("The Client acknowledges that F16s operates primarily as a "), _c("strong", [_vm._v("Data Processor")]), _vm._v(" under relevant data protection laws (including GDPR where applicable). The Client remains the "), _c("strong", [_vm._v("Data Controller")]), _vm._v(" of all freight-related information uploaded to the portal, including shipper and consignee details.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section highlight-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("2. Information Collection & Operational Scope")]), _vm._v(" "), _c("p", [_vm._v("We collect and process data strictly necessary for the fulfillment of freight documentation and transmission services. This includes:")]), _vm._v(" "), _c("ul", {
    staticClass: "bullet-list"
  }, [_c("li", [_c("strong", [_vm._v("User Account Data:")]), _vm._v(" Names, corporate email addresses, and authentication credentials.")]), _vm._v(" "), _c("li", [_c("strong", [_vm._v("Logistics Data:")]), _vm._v(" Air Waybill (AWB) details, manifest information, flight numbers, and cargo descriptions.")]), _vm._v(" "), _c("li", [_c("strong", [_vm._v("Technical Logs:")]), _vm._v(" IP addresses and access timestamps for security auditing and fraud prevention.")])]), _vm._v(" "), _c("p", [_c("strong", [_vm._v("Note:")]), _vm._v(" F16s does not sell or lease Client data to any third-party marketing entities under any circumstances.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("3. Data Security & Encryption")]), _vm._v(" "), _c("p", [_vm._v("We implement industry-standard technical and organizational measures to protect Client data. All data transmissions between the Client and the F16s portal are secured via "), _c("strong", [_vm._v("TLS/SSL encryption")]), _vm._v(". Data at rest is stored in secure, redundant cloud environments with restricted physical and digital access.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("4. Disclosure to Third Parties")]), _vm._v(" "), _c("p", [_vm._v("F16s discloses Client data only to the following entities, and solely for operational purposes:")]), _vm._v(" "), _c("ul", {
    staticClass: "bullet-list"
  }, [_c("li", [_c("strong", [_vm._v("Carriers & Airlines:")]), _vm._v(" To facilitate the transmission of e-AWB and manifest data.")]), _vm._v(" "), _c("li", [_c("strong", [_vm._v("Customs Authorities:")]), _vm._v(" When required by international law or specific route regulations.")]), _vm._v(" "), _c("li", [_c("strong", [_vm._v("Legal Requirements:")]), _vm._v(" When compelled by a court order or authorized governmental inquiry.")])])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("5. Data Retention & Deletion")]), _vm._v(" "), _c("p", [_vm._v("Client data is retained for the duration of the service agreement and for a period thereafter as required by international freight regulations and tax laws. Upon termination of service and fulfillment of legal retention obligations, F16s will securely purge or anonymize Client data upon written request.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section highlight-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("6. Client Compliance Warranty")]), _vm._v(" "), _c("p", [_vm._v("By using the platform, the Client warrants that they have obtained all necessary consents from third parties (including shippers, consignees, and employees) whose personal or corporate data is uploaded to F16s. The Client agrees to indemnify F16s against any claims arising from the Client's failure to secure such consents.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("7. Policy Updates")]), _vm._v(" "), _c("p", [_vm._v("F16s reserves the right to modify this Privacy Policy to reflect changes in legal requirements or platform functionality. Continued use of the portal after such changes constitutes acceptance of the revised policy.")])])])])]), _vm._v(" "), _c("div", {
    staticClass: "text-center mt-12"
  }, [_c("p", {
    staticClass: "footer-note"
  }, [_vm._v("\n        Effective Date: May 3, 2026 • "), _c("router-link", {
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Data Protection Inquiry")])], 1)])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=template&id=55198998":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=template&id=55198998 ***!
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
    staticClass: "terms-hero text-center mb-16 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Legal Framework")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("Terms of Service")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n        Please read these terms carefully. By accessing or using the F16s portal, you agree to be bound by these legally binding terms and conditions.\n      ")])]), _vm._v(" "), _c("div", {
    staticClass: "unified-terms-wrapper"
  }, [_c("div", {
    staticClass: "terms-glass-card"
  }, [_c("div", {
    staticClass: "terms-inner-content"
  }, [_c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("1. Scope of Service")]), _vm._v(" "), _c("p", [_vm._v('F16s E-Freight Solutions ("F16s") provides a technical infrastructure and software platform designed to facilitate freight documentation and data transmission. F16s acts solely as a technology provider and does not operate as a carrier, freight forwarder, or logistics agent.')])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section highlight-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("2. Absolute Client Responsibility & Data Integrity")]), _vm._v(" "), _c("p", [_c("strong", [_vm._v("The Client assumes full and exclusive responsibility")]), _vm._v(" for all data, information, and documentation uploaded to or transmitted through the F16s portal. This includes, but is not limited to, the accuracy, completeness, and legality of Air Waybills (AWB), House Waybills (HAWB), and manifest data.")]), _vm._v(" "), _c("ul", {
    staticClass: "bullet-list"
  }, [_c("li", [_c("strong", [_vm._v("No Manual Verification:")]), _vm._v(" F16s does not perform manual checks, audits, or validation of user-submitted data. Any automated validation provided is for convenience only and does not relieve the Client of their duty to ensure data accuracy.")]), _vm._v(" "), _c("li", [_c("strong", [_vm._v("Liability Waiver:")]), _vm._v(" F16s shall not be liable for any errors, omissions, or misstatements in data transmitted to airlines, customs authorities, or third-party logistics providers.")]), _vm._v(" "), _c("li", [_c("strong", [_vm._v("Transmission Risks:")]), _vm._v(" The Client acknowledges that data transmission is subject to external network conditions; F16s is responsible only for providing the technical interface and addressing internal software concerns.")])])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("3. Limitation of Liability")]), _vm._v(" "), _c("p", [_vm._v("To the maximum extent permitted by law, F16s, its directors, and employees shall not be liable for any direct, indirect, incidental, special, or consequential damages, including but not limited to loss of profits, cargo delays, customs fines, or business interruptions arising out of the use or inability to use the portal.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("4. Indemnification")]), _vm._v(" "), _c("p", [_vm._v("The Client agrees to indemnify, defend, and hold harmless F16s from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney's fees) arising from the Client's violation of these terms or any third-party claims related to data transmitted by the Client.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("5. Intellectual Property")]), _vm._v(" "), _c("p", [_vm._v('All platform software, proprietary algorithms, user interface designs, and the "F16s" brand are the exclusive property of F16s E-Freight Solutions. No license is granted to reverse engineer, replicate, or redistribute the platform\'s logic or assets.')])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("6. Technical Support & Uptime")]), _vm._v(" "), _c("p", [_vm._v("F16s commits to maintaining the technical integrity of the portal and addressing software-related malfunctions. However, F16s does not guarantee uninterrupted access and is not liable for downtime caused by maintenance, ISP failures, or force majeure events.")])]), _vm._v(" "), _c("div", {
    staticClass: "terms-section"
  }, [_c("h3", {
    staticClass: "terms-h3"
  }, [_vm._v("7. Governing Law")]), _vm._v(" "), _c("p", [_vm._v("These terms shall be governed and construed in accordance with the laws of the jurisdiction in which F16s E-Freight Solutions is registered, without regard to its conflict of law provisions.")])])])])]), _vm._v(" "), _c("div", {
    staticClass: "text-center mt-12"
  }, [_c("p", {
    staticClass: "footer-note"
  }, [_vm._v("\n        Last Updated: May 3, 2026 • "), _c("router-link", {
    attrs: {
      to: "/contact-us"
    }
  }, [_vm._v("Request Legal Clarification")])], 1)])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=template&id=0934aded":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=template&id=0934aded ***!
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
    staticClass: "cs-hero text-center mb-16 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Data Infrastructure")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("Cloud Storage")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "700px"
    }
  }, [_vm._v("\n        Secure, scalable, and reliable cloud solutions designed for the modern logistics landscape. Keep your critical data safe and accessible everywhere.\n      ")]), _vm._v(" "), _c("div", {
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
    staticClass: "cs-features mb-25 mt-16"
  }, [_c("b-row", {
    staticClass: "justify-content-center text-center"
  }, [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/top-tier-security.svg",
      alt: "Top-Tier Security"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Top-Tier Security")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("We use state-of-the-art encryption and security protocols to safeguard your data from unauthorized access. Whether it’s sensitive shipment information or customer records, you can trust that your data is secure at every step.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/reliable-uptime.svg",
      alt: "Reliable Uptime"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Reliable Uptime")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Our cloud infrastructure is built for maximum stability, ensuring your operations are never disrupted by downtime. With F16s, your data is stored in a secure, fully redundant system that guarantees continuous access.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/autobackups.svg",
      alt: "Auto - Backups"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Auto - Backups")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("We provide regular automated backups, so you’ll never have to worry about losing important data. Even in the unlikely event of a system issue, your information is protected and recoverable.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/dataprivacy.svg",
      alt: "Data Privacy"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Data Privacy")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Our cloud services adhere to international data privacy standards, ensuring your operations stay compliant with regulations, while giving you peace of mind that your clients' data is handled responsibly.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/scalable-performance.svg",
      alt: "Scalable Performance"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Scalable Performance")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Whether you're a small business just getting started or a rapidly growing operation, our cloud service scales with your needs. As your business expands, F16s ensures your data systems grow seamlessly without compromising performance.")])])], 1)])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "cs-growth-section mb-25 text-center"
  }, [_c("h2", {
    staticClass: "section-title mb-6"
  }, [_vm._v("Stay Focused on Growth, Leave Data Security to Us")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mx-auto",
    staticStyle: {
      "max-width": "900px"
    }
  }, [_vm._v("\n            With F16s’ advanced cloud service, you can rest assured that your data is always secure, accessible, and ready to support your business. No matter how large or complex your operations become, our robust cloud solutions will keep you moving forward without disruption.\n        ")])]), _vm._v(" "), _c("section", {
    staticClass: "cs-cta-section mb-25 text-center"
  }, [_c("div", {
    staticClass: "feature-card-wrapper cta-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "feature-card cta-card align-items-center"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Consultation")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Have questions about data security? Talk to an Expert")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mb-10",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n              At F16s, we’re committed to helping you understand how our cloud solutions can protect and strengthen your business. Our experts provide personalized guidance on "), _c("strong", [_vm._v("security measures")]), _vm._v(", "), _c("strong", [_vm._v("encryption & backups")]), _vm._v(", and "), _c("strong", [_vm._v("international data compliance")]), _vm._v(".\n            ")]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact Us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "cs-faq-section mb-16"
  }, [_c("div", {
    staticClass: "text-center mb-12"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("FAQ")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Common Questions")])]), _vm._v(" "), _c("b-row", {
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=template&id=36f473ac":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=template&id=36f473ac ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "ete-hero text-center mb-16 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("End-to-End Freight Solutions, We've Got You Covered")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("End to End Service")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n        At F16s, we offer comprehensive end-to-end solutions for all your freight forwarding needs. From documentation to tracking and final delivery, our integrated services streamline your operations and help you manage every stage of the logistics process.\n      ")]), _vm._v(" "), _c("div", {
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
    staticClass: "ete-features mb-25 mt-16"
  }, [_c("b-row", {
    staticClass: "justify-content-center text-center"
  }, [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/affordable-awb.svg",
      alt: "AWB Transfer and Documentation"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("AWB Transfer and Documentation")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Seamlessly manage your Air Waybills and other shipping documents, reducing manual work and ensuring compliance with industry standards.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/database-management.svg",
      alt: "Data Management and ERP Solutions"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Data Management and ERP Solutions")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Our cloud-based systems allow you to securely store, manage, and access all your freight data. With real-time insights, you can track performance, identify areas for improvement, and scale as your business grows.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/automated-workflow.svg",
      alt: "Automated Workflow"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Automated Workflow")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Automate your freight processes with advanced tools that handle everything from documentation to customer communication, saving time and reducing errors.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/real-time.svg",
      alt: "Real-Time Tracking and Visibility"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Real-Time Tracking and Visibility")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Keep track of shipments from departure to arrival with live tracking features that offer full transparency and control over your freight movement.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/customer-support.svg",
      alt: "Customer Support at Every Step"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Customer Support at Every Step")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Our expert team is here to assist you in every stage of the process. Whether you need help with setup, troubleshooting, or optimizing your operations, we're ready to provide the support you need.")])])], 1)])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "ete-cta-section mb-25 text-center"
  }, [_c("div", {
    staticClass: "feature-card-wrapper cta-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "feature-card cta-card align-items-center"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Talk to an expert")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mb-8",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("\n              With F16s, you can focus on growing your business while we handle the logistics. Contact us today to find out how our end-to-end service can simplify your operations.\n            ")]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "ete-faq-section mb-16"
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834 ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "service-main-card mb-16"
  }, [_c("div", {
    staticClass: "card-glass-body"
  }, [_c("div", {
    staticClass: "card-content text-center"
  }, [_c("h1", {
    staticClass: "card-main-title"
  }, [_vm._v("FOCUS AIR")]), _vm._v(" "), _c("p", {
    staticClass: "card-intro mb-16 mx-auto"
  }, [_vm._v("\n                  Focus Air is an expert air-freight management tool that brings advanced system operations for the global logistics and logistics providers. Our goals of air way.\n              ")]), _vm._v(" "), _vm.isReady ? _c("b-row", {
    staticClass: "product-grid justify-content-center"
  }, _vm._l(_vm.products, function (product, idx) {
    return _c("b-col", {
      key: idx,
      staticClass: "mb-12",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "inner-product-item"
    }, [_c("div", {
      staticClass: "icon-wrapper mb-4"
    }, [_c("img", {
      staticClass: "product-svg",
      attrs: {
        src: product.icon,
        alt: product.title
      }
    })]), _vm._v(" "), _c("h3", {
      staticClass: "inner-title"
    }, [_vm._v(_vm._s(product.title))]), _vm._v(" "), _c("p", {
      staticClass: "inner-desc"
    }, [_vm._v(_vm._s(product.description))])])]);
  }), 1) : _vm._e(), _vm._v(" "), !_vm.isReady ? _c("div", {
    staticClass: "skeleton-grid-container mt-16"
  }, [_c("b-row", {
    staticClass: "justify-content-center"
  }, _vm._l(3, function (n) {
    return _c("b-col", {
      key: n,
      staticClass: "mb-12",
      attrs: {
        lg: "4",
        md: "6"
      }
    }, [_c("div", {
      staticClass: "skeleton-product-item"
    }, [_c("div", {
      staticClass: "skeleton-icon mb-4"
    }), _vm._v(" "), _c("div", {
      staticClass: "skeleton-line title mb-3"
    }), _vm._v(" "), _c("div", {
      staticClass: "skeleton-line text"
    }), _vm._v(" "), _c("div", {
      staticClass: "skeleton-line text short"
    })])]);
  }), 1)], 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "mt-12"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "service-main-card mb-16"
  }, [_c("div", {
    staticClass: "card-glass-body"
  }, [_c("div", {
    staticClass: "card-content text-center py-10"
  }, [_c("h1", {
    staticClass: "card-main-title"
  }, [_vm._v("FOCUS ROAD")]), _vm._v(" "), _c("div", {
    staticClass: "status-info"
  }, [_c("p", {
    staticClass: "status-label mb-2"
  }, [_vm._v("Under development")]), _vm._v(" "), _c("p", {
    staticClass: "status-sub"
  }, [_vm._v("For more details")])]), _vm._v(" "), _c("div", {
    staticClass: "mt-12"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])])]), _vm._v(" "), _c("section", {
    staticClass: "service-main-card mb-16"
  }, [_c("div", {
    staticClass: "card-glass-body"
  }, [_c("div", {
    staticClass: "card-content text-center py-10"
  }, [_c("h1", {
    staticClass: "card-main-title"
  }, [_vm._v("FOCUS SEA")]), _vm._v(" "), _c("div", {
    staticClass: "status-info"
  }, [_c("p", {
    staticClass: "status-label mb-2"
  }, [_vm._v("Under development")]), _vm._v(" "), _c("p", {
    staticClass: "status-sub"
  }, [_vm._v("For more details")])]), _vm._v(" "), _c("div", {
    staticClass: "mt-12"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])])])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=template&id=47e5fb10":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=template&id=47e5fb10 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "sb-hero text-center mb-16 mt-8"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("For Forwarders")]), _vm._v(" "), _c("h1", {
    staticClass: "section-title"
  }, [_vm._v("Small Business")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mx-auto",
    staticStyle: {
      "max-width": "700px"
    }
  }, [_vm._v("\n        Streamlined Logistics Solutions For Small Freight Forwarders."), _c("br"), _vm._v("\n        We help small and independent freight forwarders elevate their operational efficiency with powerful, affordable automation tools.\n      ")]), _vm._v(" "), _c("div", {
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
    staticClass: "sb-features mb-25 mt-16"
  }, [_c("b-row", {
    staticClass: "justify-content-center text-center"
  }, [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/affordable-awb.svg",
      alt: "Affordable AWB Transfer"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Affordable AWB Transfer")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Process your waybills seamlessly and cost-effectively. Our platform provides smart tools designed specifically for the budgets of independent forwarders.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/database-management.svg",
      alt: "Database Management"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("Database Management")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Keep all your critical freight data in one secure, accessible place. Easily search, retrieve, and manage your past AWBs without any hassle.")])])], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "4",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("b-card", {
    staticClass: "feature-card h-100 align-items-center"
  }, [_c("div", {
    staticClass: "feature-icon-container mb-8 mx-auto"
  }, [_c("div", {
    staticClass: "icon-circle"
  }), _vm._v(" "), _c("img", {
    staticClass: "img-fluid feature-icon",
    attrs: {
      src: "/media/custome/edi-smart-tracking.svg",
      alt: "EDI for Smart Tracking"
    }
  })]), _vm._v(" "), _c("h3", {
    staticClass: "feature-title mt-4"
  }, [_vm._v("EDI for Smart Tracking")]), _vm._v(" "), _c("p", {
    staticClass: "feature-desc mt-3"
  }, [_vm._v("Connect directly with airlines using standard EDI messaging. Enjoy real-time tracking and automated status updates for all your shipments.")])])], 1)])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "sb-plans-section mb-25"
  }, [_c("div", {
    staticClass: "text-center mb-12"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Pricing")]), _vm._v(" "), _c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Plans")])]), _vm._v(" "), _c("b-row", {
    staticClass: "justify-content-center g-4"
  }, [_c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "5",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper plan-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "feature-card plan-card"
  }, [_c("div", {
    staticClass: "plan-header"
  }, [_c("h3", {
    staticClass: "feature-title mb-0"
  }, [_vm._v("Basic plan")]), _vm._v(" "), _c("div", {
    staticClass: "plan-icon-ring"
  })]), _vm._v(" "), _c("div", {
    staticClass: "plan-body"
  }, [_c("p", {
    staticClass: "feature-desc plan-desc"
  }, [_vm._v("Affordable starting point for manual users and independent forwarders.")]), _vm._v(" "), _c("ul", {
    staticClass: "plan-features"
  }, [_c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Full Documentation Suite")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Multi-user access for different stations")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Secure Document Storage")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Printing for MAWB & HAWB")], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "plan-footer text-center"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us?modal=quote"
    }
  }, [_c("span", [_vm._v("Book Now")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-8",
    attrs: {
      lg: "5",
      md: "6"
    }
  }, [_c("div", {
    staticClass: "feature-card-wrapper plan-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow pro-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "feature-card plan-card pro-card"
  }, [_c("div", {
    staticClass: "plan-header"
  }, [_c("h3", {
    staticClass: "feature-title mb-0"
  }, [_vm._v("Pro plan")]), _vm._v(" "), _c("div", {
    staticClass: "plan-icon-ring pro-ring"
  })]), _vm._v(" "), _c("div", {
    staticClass: "plan-body"
  }, [_c("p", {
    staticClass: "feature-desc plan-desc"
  }, [_vm._v("Advanced features for fast growing businesses and high volume forwarders.")]), _vm._v(" "), _c("ul", {
    staticClass: "plan-features"
  }, [_c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" "), _c("strong", [_vm._v("All Basic features included")])], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" 150+ Airline Direct Connectivity")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Real-time Shipment Tracking")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Dedicated Customer Support")], 1), _vm._v(" "), _c("li", [_c("b-icon", {
    staticClass: "me-2 check-icon",
    attrs: {
      icon: "check2"
    }
  }), _vm._v(" Unlimited User Accounts")], 1)])]), _vm._v(" "), _c("div", {
    staticClass: "plan-footer text-center"
  }, [_c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us?modal=quote"
    }
  }, [_c("span", [_vm._v("Book Now")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])])])], 1)], 1), _vm._v(" "), _c("section", {
    staticClass: "sb-cta-section mb-25 text-center"
  }, [_c("div", {
    staticClass: "feature-card-wrapper cta-wrapper"
  }, [_c("div", {
    staticClass: "feature-card-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "feature-card cta-card align-items-center"
  }, [_c("h2", {
    staticClass: "section-title"
  }, [_vm._v("Not sure which plan suits your business?")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle mt-4 mb-8",
    staticStyle: {
      "max-width": "800px"
    }
  }, [_vm._v("Contact us for a tailored demo. We'll help you explore our features and choose the best plan to optimize your workflow and grow your business with confidence.")]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/contact-us"
    }
  }, [_c("span", [_vm._v("Contact Us")]), _vm._v(" "), _c("div", {
    staticClass: "btn-icon"
  }, [_c("b-icon", {
    attrs: {
      icon: "arrow-right"
    }
  })], 1)])], 1)])]), _vm._v(" "), _c("section", {
    staticClass: "sb-faq-section mb-16"
  }, [_c("div", {
    staticClass: "text-center mb-12"
  }, [_c("span", {
    staticClass: "section-eyebrow"
  }, [_vm._v("Support")]), _vm._v(" "), _c("h2", {
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

/***/ "./resources/js/src/view/pages/public/blogData.js":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/public/blogData.js ***!
  \********************************************************/
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

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.content-container[data-v-373472a1] {\n    position: relative;\n    z-index: 10;\n    padding-top: 0;\n}\n\n/* Vision Card */\n.vision-card[data-v-373472a1] {\n    position: relative;\n    height: 100%;\n}\n.vision-glow[data-v-373472a1] {\n    position: absolute;\n    inset: -2px;\n    background: linear-gradient(135deg, #355594, #ABC0FF);\n    border-radius: 32px;\n    opacity: 0.4;\n    filter: blur(15px);\n    z-index: 0;\n}\n.vision-content[data-v-373472a1] {\n    position: relative;\n    z-index: 1;\n    background: rgba(255, 255, 255, 0.85);\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(255, 255, 255, 0.5);\n    border-radius: 32px;\n    padding: 3rem;\n    height: 100%;\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.05);\n}\n.vision-title[data-v-373472a1] {\n    font-size: 2rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n}\n.vision-text[data-v-373472a1] {\n    font-size: 1.1rem;\n    color: #4A5E80;\n    line-height: 1.8;\n}\n\n/* Specialized Services - Product Card Layout */\n.services-modern-grid[data-v-373472a1] {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 32px;\n}\n\n/* Choose Us Grid */\n.choose-us-item[data-v-373472a1] {\n    padding: 2rem 1.5rem;\n    background: transparent;\n    transition: all 0.3s ease;\n    border-radius: 24px;\n    height: 100%;\n}\n.choose-us-item[data-v-373472a1]:hover {\n    background: rgba(255,255,255,0.6);\n    box-shadow: 0 10px 30px rgba(53,85,148,0.03);\n}\n.choose-us-icon-wrapper[data-v-373472a1] {\n    width: 80px;\n    height: 80px;\n    background: white;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.08);\n    transition: transform 0.3s ease;\n}\n.choose-us-item:hover .choose-us-icon-wrapper[data-v-373472a1] {\n    transform: translateY(-5px);\n}\n.choose-us-icon-wrapper img[data-v-373472a1] {\n    width: 40px;\n    height: 40px;\n}\n.choose-us-title[data-v-373472a1] {\n    font-size: 1.35rem;\n    font-weight: 700;\n    color: #1e3a6e;\n    line-height: 1.4;\n}\n.choose-us-desc[data-v-373472a1] {\n    font-size: 1rem;\n    color: #5A6B8A;\n    line-height: 1.7;\n}\n\n/* Our Story */\n.story-card[data-v-373472a1] {\n    position: relative;\n    border-radius: 32px;\n    overflow: hidden;\n    min-height: 400px;\n    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.15);\n}\n.story-bg-img[data-v-373472a1] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    -o-object-fit: cover;\n       object-fit: cover;\n    z-index: 1;\n}\n.story-overlay[data-v-373472a1] {\n    position: relative;\n    z-index: 2;\n    background: linear-gradient(90deg, rgba(30, 58, 110, 0.95) 0%, rgba(30, 58, 110, 0.7) 100%);\n    padding: 4rem 3rem;\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n}\n.story-text[data-v-373472a1] {\n    color: rgba(255, 255, 255, 0.9);\n    font-size: 1.15rem;\n    line-height: 1.8;\n    max-width: 800px;\n}\n@media (max-width: 991px) {\n.vision-content[data-v-373472a1] {\n        padding: 2rem;\n        margin-top: 2rem;\n}\n.story-overlay[data-v-373472a1] {\n        padding: 3rem 2rem;\n}\n}\n@media (max-width: 767px) {\n.services-modern-grid[data-v-373472a1] {\n        display: flex;\n        overflow-x: auto;\n        scroll-snap-type: x mandatory;\n        gap: 24px;\n        padding: 20px 20px 40px 20px;\n        margin-left: -20px;\n        margin-right: -20px;\n        scroll-behavior: smooth;\n        -webkit-overflow-scrolling: touch;\n}\n.services-modern-grid[data-v-373472a1]::-webkit-scrollbar { display: none;\n}\n.service-product-card[data-v-373472a1] {\n        flex: 0 0 85%;\n        scroll-snap-align: center;\n        padding: 4rem 2.5rem;\n        background: white;\n        box-shadow: 0 15px 35px rgba(53, 85, 148, 0.1);\n}\n.story-overlay[data-v-373472a1] { padding: 2rem 1.5rem;\n}\n.story-text[data-v-373472a1] { font-size: 1rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


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
___CSS_LOADER_EXPORT___.push([module.id, "\n/* ULTRA PREMIUM MODAL REDESIGN */\n.ultra-premium-modal .modal-dialog {\n    max-width: 1100px !important;\n    margin: 1.75rem auto;\n}\n.ultra-premium-modal .modal-content {\n    background: transparent !important;\n    border: none !important;\n    border-radius: 32px !important;\n    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.25) !important;\n    font-family: 'Inter', sans-serif !important;\n    overflow: hidden;\n}\n.ultra-premium-modal .modal-body {\n    padding: 0 !important;\n    background: rgba(255, 255, 255, 0.95);\n    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);\n}\n\n/* Split Layout */\n.modal-split-layout {\n    display: flex;\n    flex-direction: row;\n    min-height: 700px;\n    position: relative;\n}\n.ultra-close-btn {\n    position: absolute;\n    top: 25px;\n    right: 25px;\n    width: 44px;\n    height: 44px;\n    border-radius: 50%;\n    background: rgba(0,0,0,0.05);\n    border: none;\n    color: #5A6B8A;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 1.5rem;\n    cursor: pointer;\n    z-index: 50;\n    transition: all 0.3s ease;\n}\n.ultra-close-btn:hover {\n    background: #ef4444;\n    color: white;\n    transform: rotate(90deg);\n}\n\n/* Left Pane Styles */\n.modal-left-pane {\n    flex: 0 0 40%;\n    padding: 4rem 3.5rem;\n    position: relative;\n    overflow: hidden;\n    color: white;\n    display: flex;\n    flex-direction: column;\n}\n\n/* Different gradients for different modals */\n.query-pane {\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n}\n.quote-pane {\n    background: linear-gradient(135deg, #2a4476 0%, #4a72c9 100%);\n}\n.feedback-pane {\n    background: linear-gradient(135deg, #1c3361 0%, #3a5c9f 100%);\n}\n.pane-content {\n    position: relative;\n    z-index: 2;\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n}\n.pane-icon-wrapper {\n    width: 80px;\n    height: 80px;\n    background: rgba(255,255,255,0.1);\n    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);\n    border-radius: 24px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n    border: 1px solid rgba(255,255,255,0.2);\n}\n.pane-title {\n    font-size: 2.25rem;\n    font-weight: 800;\n    margin-bottom: 1rem;\n    letter-spacing: -0.5px;\n    line-height: 1.1;\n}\n.pane-subtitle {\n    font-size: 1.1rem;\n    line-height: 1.7;\n    opacity: 0.85;\n}\n.pane-feature {\n    display: flex;\n    align-items: center;\n    margin-bottom: 1rem;\n    font-size: 1rem;\n    font-weight: 500;\n}\n.pane-feature:last-child {\n    margin-bottom: 0;\n}\n.pane-decoration {\n    position: absolute;\n    bottom: -150px;\n    left: -150px;\n    width: 500px;\n    height: 500px;\n    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);\n    border-radius: 50%;\n    z-index: 1;\n}\n\n/* Right Pane Styles */\n.modal-right-pane {\n    flex: 0 0 60%;\n    background: white;\n    position: relative;\n}\n.form-scroll-container {\n    height: 100%;\n    overflow-y: auto;\n    padding: 4.5rem 4rem;\n}\n\n/* Custom Scrollbar for form */\n.form-scroll-container::-webkit-scrollbar {\n    width: 6px;\n}\n.form-scroll-container::-webkit-scrollbar-track {\n    background: rgba(0,0,0,0.02);\n}\n.form-scroll-container::-webkit-scrollbar-thumb {\n    background: rgba(53, 85, 148, 0.2);\n    border-radius: 10px;\n}\n.form-section-title {\n    font-size: 1.5rem;\n    font-weight: 700;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n}\n\n/* Floating Input Group */\n.floating-input-group {\n    position: relative;\n    width: 100%;\n}\n.floating-input {\n    width: 100%;\n    background: #f8fafc;\n    border: 1px solid transparent;\n    border-bottom: 2px solid #e2e8f0;\n    border-radius: 12px 12px 0 0;\n    padding: 24px 16px 8px 16px;\n    font-size: 1rem;\n    color: #1e3a6e;\n    font-weight: 500;\n    transition: all 0.3s ease;\n    font-family: 'Inter', sans-serif;\n}\n.floating-input:focus {\n    background: #f0f7ff;\n    border-bottom-color: #355594;\n    outline: none;\n}\ntextarea.floating-input {\n    min-height: 120px;\n    resize: vertical;\n}\n.floating-label {\n    position: absolute;\n    left: 16px;\n    top: 16px;\n    font-size: 1rem;\n    color: #64748b;\n    pointer-events: none;\n    transition: all 0.2s ease;\n    font-weight: 500;\n}\n\n/* Floating label active state */\n.floating-input:not(:-moz-placeholder) ~ .floating-label {\n    top: 6px;\n    font-size: 0.75rem;\n    color: #355594;\n    font-weight: 600;\n}\n.floating-input:focus ~ .floating-label,\n.floating-input:not(:placeholder-shown) ~ .floating-label,\n.floating-select:valid ~ .floating-label {\n    top: 6px;\n    font-size: 0.75rem;\n    color: #355594;\n    font-weight: 600;\n}\n\n/* Custom Select tweaks */\n.floating-select {\n    -webkit-appearance: none;\n       -moz-appearance: none;\n            appearance: none;\n    cursor: pointer;\n}\n.select-icon {\n    position: absolute;\n    right: 16px;\n    top: 50%;\n    transform: translateY(-50%);\n    color: #64748b;\n    pointer-events: none;\n}\n\n/* Submit Action Area */\n.form-actions {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n}\n.ultra-submit-btn { background: #355594; border: none; border-radius: 999px; padding: 10px 10px 10px 22px; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; transition: all 0.3s ease; box-shadow: 0 10px 25px rgba(53, 85, 148, 0.25); cursor: pointer; width: auto; max-width: none;\n}\n.ultra-submit-btn:hover { background: #28447a; transform: translateY(-2px); box-shadow: 0 15px 35px rgba(53, 85, 148, 0.35);\n}\n.ultra-submit-btn span { color: white; font-weight: 500; margin-right: 14px;\n}\n.ultra-submit-btn .btn-icon { background: white; color: #355594; border-radius: 50%; width: 32px !important; height: 32px !important; padding: 6px; margin-left: 0 !important;\n}\n.form-note {\n    font-size: 0.85rem;\n    color: #94a3b8;\n    font-weight: 500;\n}\n\n/* Responsive adjustments */\n@media (max-width: 991px) {\n.modal-split-layout {\n        flex-direction: column;\n        min-height: auto;\n}\n.modal-left-pane {\n        flex: 0 0 auto;\n        padding: 3rem 2rem;\n}\n.pane-title {\n        font-size: 1.8rem;\n}\n.pane-icon-wrapper {\n        width: 60px;\n        height: 60px;\n        margin-bottom: 1.5rem !important;\n}\n.modal-right-pane {\n        flex: 0 0 auto;\n}\n.form-scroll-container {\n        padding: 3rem 2rem;\n        height: auto;\n        max-height: 60vh;\n}\n.ultra-close-btn {\n        top: 15px;\n        right: 15px;\n        background: rgba(255,255,255,0.2);\n        color: white;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.content-container[data-v-d8e9bb8e] {\n    position: relative;\n    z-index: 10;\n    padding-top: 0;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n@media only screen and (max-width: 600px){\n.card-box[data-v-19f31848]{\n  margin-top: 25%;\n}\n}\n.card-box[data-v-19f31848]{\n  margin-top: 10%;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


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
___CSS_LOADER_EXPORT___.push([module.id, "\n.content-container[data-v-794f1590] {\n    position: relative;\n    z-index: 10;\n    padding-top: 0;\n}\n\n/* Typography Enhancements */\n.section-title[data-v-794f1590] {\n    font-size: 3.5rem;\n    font-weight: 800;\n}\n.section-heading[data-v-794f1590] {\n    font-size: 2.5rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    letter-spacing: -0.5px;\n    line-height: 1.2;\n}\n.text-gradient[data-v-794f1590] {\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n    display: inline;\n    padding-right: 0.1em;\n}\n\n/* Feature Deep Dive Images */\n.feature-image-wrapper[data-v-794f1590] {\n    position: relative;\n    border-radius: 32px;\n    padding: 2rem;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.feature-glow[data-v-794f1590] {\n    position: absolute;\n    inset: 0;\n    background: radial-gradient(circle at center, rgba(171, 192, 255, 0.5) 0%, transparent 70%);\n}\n.feature-glow.alt-glow[data-v-794f1590] {\n    background: radial-gradient(circle at center, rgba(187, 226, 255, 0.5) 0%, transparent 70%);\n}\n.feature-img[data-v-794f1590] {\n    position: relative;\n    z-index: 1;\n    filter: drop-shadow(0 30px 60px rgba(53, 85, 148, 0.15));\n    transition: transform 0.5s ease;\n    max-height: 400px;\n}\n.feature-image-wrapper:hover .feature-img[data-v-794f1590] {\n    transform: translateY(-10px);\n}\n\n/* Stat Boxes & Lists */\n.stat-box[data-v-794f1590] {\n    background: white;\n    border-radius: 20px;\n    padding: 1.5rem 2rem;\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.08);\n    border: 1px solid rgba(230, 240, 255, 1);\n}\n.stat-number[data-v-794f1590] {\n    font-size: 2.5rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    margin-bottom: 0.25rem;\n}\n.stat-label[data-v-794f1590] {\n    font-size: 0.9rem;\n    font-weight: 600;\n    color: #5A6B8A;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n.feature-bullet-list li[data-v-794f1590] {\n    font-size: 1.15rem;\n    color: #4A5E80;\n    font-weight: 500;\n    display: flex;\n    align-items: center;\n}\n\n/* Commitment Card */\n.commitment-card[data-v-794f1590] { position: relative;\n}\n.commitment-glow[data-v-794f1590] {\n    position: absolute;\n    inset: -2px;\n    background: linear-gradient(135deg, #355594, #ABC0FF);\n    border-radius: 40px;\n    opacity: 0.3;\n    filter: blur(25px);\n    z-index: 0;\n}\n.glass-card[data-v-794f1590] {\n    background: rgba(255, 255, 255, 0.85);\n    backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);\n    border: 1px solid rgba(255, 255, 255, 0.7);\n    border-radius: 40px;\n    box-shadow: 0 20px 50px rgba(53, 85, 148, 0.05);\n}\n.commitment-icon-wrapper[data-v-794f1590] {\n    position: relative;\n    width: 250px;\n    height: 250px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n.icon-ring[data-v-794f1590] {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: #f0f7ff;\n    border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n    animation: morph-794f1590 8s ease-in-out infinite;\n}\n.commitment-icon[data-v-794f1590] { position: relative; z-index: 1; color: #355594;\n}\n@keyframes morph-794f1590 {\n0% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n}\n50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;\n}\n100% { border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;\n}\n}\n\n/* Final CTA Card */\n.final-cta-card[data-v-794f1590] {\n    position: relative;\n    background: linear-gradient(135deg, #1e3a6e 0%, #355594 100%);\n    border-radius: 40px;\n    overflow: hidden;\n    box-shadow: 0 30px 60px rgba(30, 58, 110, 0.25);\n}\n.cta-overlay-glow[data-v-794f1590] {\n    position: absolute;\n    top: -50%;\n    right: -20%;\n    width: 80%;\n    height: 150%;\n    background: radial-gradient(circle, rgba(171, 192, 255, 0.15) 0%, transparent 70%);\n    transform: rotate(-15deg);\n}\n@media (max-width: 991px) {\n.section-title[data-v-794f1590] { font-size: 2.5rem;\n}\n.commitment-content[data-v-794f1590], .cta-inner-content[data-v-794f1590] { padding: 3rem 2rem;\n}\n}\n@media (max-width: 767px) {\n.section-title[data-v-794f1590] { font-size: 2.1rem;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js */ "./node_modules/laravel-mix/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_laravel_mix_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.aff-section[data-v-50debe43] {\n    display: flex; align-items: center; gap: 2rem; padding: 1.25rem 1.5rem; background: #fff;\n    border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden;\n    position: relative; z-index: 10; top: -8.5rem; width: 90%; max-width: 1100px; left: 5%;\n}\n.aff-eyebrow[data-v-50debe43] { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; display: block;\n}\n.aff-heading[data-v-50debe43] { font-size: 15px; font-weight: 600; color: #355594; display: block;\n}\n.aff-divider[data-v-50debe43] { width: 1px; height: 40px; background: rgba(0,0,0,0.08); flex-shrink: 0;\n}\n.aff-track-wrap[data-v-50debe43] { flex: 1; overflow: hidden; position: relative; min-width: 0;\n}\n.aff-track-wrap[data-v-50debe43]::before, .aff-track-wrap[data-v-50debe43]::after {\n    content: ''; position: absolute; top: 0; bottom: 0; width: 48px; z-index: 2; pointer-events: none;\n}\n.aff-track-wrap[data-v-50debe43]::before { left: 0; background: linear-gradient(to right, #fff, transparent);\n}\n.aff-track-wrap[data-v-50debe43]::after  { right: 0; background: linear-gradient(to left,  #fff, transparent);\n}\n.scroller-track[data-v-50debe43] { display: flex; align-items: center; gap: 2.5rem; animation: scroll-50debe43 120s linear infinite; width: -moz-max-content; width: max-content;\n}\n.scroller-track[data-v-50debe43]:hover { animation-play-state: paused;\n}\n.aff-logo-wrap[data-v-50debe43] {\n    padding: 6px 10px;\n    border-radius: 6px;\n    transition: background 0.2s ease;\n}\n.aff-logo-wrap[data-v-50debe43]:hover { background: #f3f4f6;\n}\n.affiliate-logo[data-v-50debe43] { height: 32px; -o-object-fit: contain; object-fit: contain; filter: grayscale(100%) opacity(0.45); transition: all 0.3s ease;\n}\n.affiliate-logo.is-long-logo[data-v-50debe43] { height: 18px;\n}\n.affiliate-logo.is-large-logo[data-v-50debe43] { height: 42px;\n}\n.affiliate-logo.is-extra-large-logo[data-v-50debe43] { height: 52px;\n}\n.affiliate-logo[data-v-50debe43]:hover { filter: grayscale(0%) opacity(1); transform: scale(1.08);\n}\n@keyframes scroll-50debe43 {\n0% { transform: translateX(0);\n}\n100% { transform: translateX(-50%);\n}\n}\n@media (max-width: 991px) {\n.aff-section[data-v-50debe43] { top: 0; left: 0; width: 100%; margin-bottom: 3rem;\n}\n.aff-label[data-v-50debe43] { display: none;\n}\n.aff-divider[data-v-50debe43] { display: none;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_style_index_0_id_373472a1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_style_index_0_id_373472a1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_style_index_0_id_373472a1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_d8e9bb8e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_d8e9bb8e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_d8e9bb8e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_style_index_0_id_19f31848_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_style_index_0_id_19f31848_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_style_index_0_id_19f31848_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_style_index_0_id_50debe43_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css */ "./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_style_index_0_id_50debe43_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_style_index_0_id_50debe43_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/src/view/pages/public/AboutUs.vue":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/public/AboutUs.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AboutUs_vue_vue_type_template_id_373472a1_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AboutUs.vue?vue&type=template&id=373472a1&scoped=true */ "./resources/js/src/view/pages/public/AboutUs.vue?vue&type=template&id=373472a1&scoped=true");
/* harmony import */ var _AboutUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AboutUs.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/AboutUs.vue?vue&type=script&lang=js");
/* harmony import */ var _AboutUs_vue_vue_type_style_index_0_id_373472a1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css */ "./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AboutUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AboutUs_vue_vue_type_template_id_373472a1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _AboutUs_vue_vue_type_template_id_373472a1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "373472a1",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/AboutUs.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

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

/***/ "./resources/js/src/view/pages/public/Home.vue":
/*!*****************************************************!*\
  !*** ./resources/js/src/view/pages/public/Home.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Home_vue_vue_type_template_id_d8e9bb8e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Home.vue?vue&type=template&id=d8e9bb8e&scoped=true */ "./resources/js/src/view/pages/public/Home.vue?vue&type=template&id=d8e9bb8e&scoped=true");
/* harmony import */ var _Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Home.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/Home.vue?vue&type=script&lang=js");
/* harmony import */ var _Home_vue_vue_type_style_index_0_id_d8e9bb8e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css */ "./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Home_vue_vue_type_template_id_d8e9bb8e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Home_vue_vue_type_template_id_d8e9bb8e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "d8e9bb8e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/Home.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/PasswordForgotForm.vue":
/*!*******************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PasswordForgotForm.vue ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PasswordForgotForm_vue_vue_type_template_id_19f31848_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true */ "./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true");
/* harmony import */ var _PasswordForgotForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PasswordForgotForm.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=script&lang=js");
/* harmony import */ var _PasswordForgotForm_vue_vue_type_style_index_0_id_19f31848_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css */ "./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _PasswordForgotForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _PasswordForgotForm_vue_vue_type_template_id_19f31848_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _PasswordForgotForm_vue_vue_type_template_id_19f31848_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "19f31848",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/PasswordForgotForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

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

/***/ "./resources/js/src/view/pages/public/Solutions.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/pages/public/Solutions.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Solutions_vue_vue_type_template_id_5d5a8eb0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Solutions.vue?vue&type=template&id=5d5a8eb0 */ "./resources/js/src/view/pages/public/Solutions.vue?vue&type=template&id=5d5a8eb0");
/* harmony import */ var _Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Solutions.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/Solutions.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Solutions_vue_vue_type_template_id_5d5a8eb0__WEBPACK_IMPORTED_MODULE_0__.render,
  _Solutions_vue_vue_type_template_id_5d5a8eb0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/Solutions.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue":
/*!******************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/DecorativeEllipses.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DecorativeEllipses_vue_vue_type_template_id_2e3f0d64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DecorativeEllipses.vue?vue&type=template&id=2e3f0d64 */ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64");
/* harmony import */ var _DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DecorativeEllipses.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DecorativeEllipses_vue_vue_type_template_id_2e3f0d64__WEBPACK_IMPORTED_MODULE_0__.render,
  _DecorativeEllipses_vue_vue_type_template_id_2e3f0d64__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/DecorativeEllipses.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HeroButton.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HeroButton.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HeroButton.vue?vue&type=template&id=029dda8a */ "./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a");
/* harmony import */ var _HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HeroButton.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__.render,
  _HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HeroButton.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeFaqSection.vue":
/*!**************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeFaqSection.vue ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomeFaqSection_vue_vue_type_template_id_3920c8c6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomeFaqSection.vue?vue&type=template&id=3920c8c6 */ "./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=template&id=3920c8c6");
/* harmony import */ var _HomeFaqSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomeFaqSection.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HomeFaqSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomeFaqSection_vue_vue_type_template_id_3920c8c6__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomeFaqSection_vue_vue_type_template_id_3920c8c6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomeFaqSection.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomeFeatureGrid_vue_vue_type_template_id_393c15c4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomeFeatureGrid.vue?vue&type=template&id=393c15c4 */ "./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=template&id=393c15c4");
/* harmony import */ var _HomeFeatureGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomeFeatureGrid.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HomeFeatureGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomeFeatureGrid_vue_vue_type_template_id_393c15c4__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomeFeatureGrid_vue_vue_type_template_id_393c15c4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomeFeatureGrid.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeHero.vue":
/*!********************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeHero.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomeHero_vue_vue_type_template_id_225960b0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomeHero.vue?vue&type=template&id=225960b0 */ "./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=template&id=225960b0");
/* harmony import */ var _HomeHero_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomeHero.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HomeHero_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomeHero_vue_vue_type_template_id_225960b0__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomeHero_vue_vue_type_template_id_225960b0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomeHero.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeNewsSection.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeNewsSection.vue ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomeNewsSection_vue_vue_type_template_id_4471a354__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomeNewsSection.vue?vue&type=template&id=4471a354 */ "./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=template&id=4471a354");
/* harmony import */ var _HomeNewsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomeNewsSection.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HomeNewsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomeNewsSection_vue_vue_type_template_id_4471a354__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomeNewsSection_vue_vue_type_template_id_4471a354__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomeNewsSection.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue":
/*!******************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomePartnersTicker.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomePartnersTicker_vue_vue_type_template_id_50debe43_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true */ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true");
/* harmony import */ var _HomePartnersTicker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomePartnersTicker.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=script&lang=js");
/* harmony import */ var _HomePartnersTicker_vue_vue_type_style_index_0_id_50debe43_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css */ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _HomePartnersTicker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomePartnersTicker_vue_vue_type_template_id_50debe43_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomePartnersTicker_vue_vue_type_template_id_50debe43_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "50debe43",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomePartnersTicker.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeServicesGrid.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomeServicesGrid.vue?vue&type=template&id=9697751c */ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c");
/* harmony import */ var _HomeServicesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomeServicesGrid.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HomeServicesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomeServicesGrid.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeStatsSection.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeStatsSection.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HomeStatsSection_vue_vue_type_template_id_477434f4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HomeStatsSection.vue?vue&type=template&id=477434f4 */ "./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=template&id=477434f4");
/* harmony import */ var _HomeStatsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HomeStatsSection.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HomeStatsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HomeStatsSection_vue_vue_type_template_id_477434f4__WEBPACK_IMPORTED_MODULE_0__.render,
  _HomeStatsSection_vue_vue_type_template_id_477434f4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/HomeStatsSection.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/SectionHeader.vue":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/SectionHeader.vue ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SectionHeader.vue?vue&type=template&id=04fa6db3 */ "./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3");
/* harmony import */ var _SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SectionHeader.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__.render,
  _SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/components/SectionHeader.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/Privacy.vue":
/*!**************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/Privacy.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Privacy_vue_vue_type_template_id_34b613c8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Privacy.vue?vue&type=template&id=34b613c8 */ "./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=template&id=34b613c8");
/* harmony import */ var _Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Privacy.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Privacy_vue_vue_type_template_id_34b613c8__WEBPACK_IMPORTED_MODULE_0__.render,
  _Privacy_vue_vue_type_template_id_34b613c8__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/legal/Privacy.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue":
/*!********************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PrivacyPolicy_vue_vue_type_template_id_028befcc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrivacyPolicy.vue?vue&type=template&id=028befcc */ "./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=template&id=028befcc");
/* harmony import */ var _PrivacyPolicy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PrivacyPolicy.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PrivacyPolicy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _PrivacyPolicy_vue_vue_type_template_id_028befcc__WEBPACK_IMPORTED_MODULE_0__.render,
  _PrivacyPolicy_vue_vue_type_template_id_028befcc__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/legal/PrivacyPolicy.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/TermsAndConditions.vue":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/TermsAndConditions.vue ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TermsAndConditions_vue_vue_type_template_id_55198998__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TermsAndConditions.vue?vue&type=template&id=55198998 */ "./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=template&id=55198998");
/* harmony import */ var _TermsAndConditions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TermsAndConditions.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TermsAndConditions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TermsAndConditions_vue_vue_type_template_id_55198998__WEBPACK_IMPORTED_MODULE_0__.render,
  _TermsAndConditions_vue_vue_type_template_id_55198998__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/legal/TermsAndConditions.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/CloudStorage.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/CloudStorage.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CloudStorage_vue_vue_type_template_id_0934aded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CloudStorage.vue?vue&type=template&id=0934aded */ "./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=template&id=0934aded");
/* harmony import */ var _CloudStorage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CloudStorage.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _CloudStorage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CloudStorage_vue_vue_type_template_id_0934aded__WEBPACK_IMPORTED_MODULE_0__.render,
  _CloudStorage_vue_vue_type_template_id_0934aded__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/services/CloudStorage.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/EndToEnd.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/EndToEnd.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EndToEnd_vue_vue_type_template_id_36f473ac__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EndToEnd.vue?vue&type=template&id=36f473ac */ "./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=template&id=36f473ac");
/* harmony import */ var _EndToEnd_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EndToEnd.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _EndToEnd_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _EndToEnd_vue_vue_type_template_id_36f473ac__WEBPACK_IMPORTED_MODULE_0__.render,
  _EndToEnd_vue_vue_type_template_id_36f473ac__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/services/EndToEnd.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/ProductDescription.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/ProductDescription.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=template&id=1a493834 */ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834");
/* harmony import */ var _ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProductDescription.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.render,
  _ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/services/ProductDescription.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/SmallBusiness.vue":
/*!***********************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/SmallBusiness.vue ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SmallBusiness_vue_vue_type_template_id_47e5fb10__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SmallBusiness.vue?vue&type=template&id=47e5fb10 */ "./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=template&id=47e5fb10");
/* harmony import */ var _SmallBusiness_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SmallBusiness.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SmallBusiness_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SmallBusiness_vue_vue_type_template_id_47e5fb10__WEBPACK_IMPORTED_MODULE_0__.render,
  _SmallBusiness_vue_vue_type_template_id_47e5fb10__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/services/SmallBusiness.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/AboutUs.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/AboutUs.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AboutUs.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

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

/***/ "./resources/js/src/view/pages/public/Home.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Home.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=script&lang=js":
/*!*******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PasswordForgotForm.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

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

/***/ "./resources/js/src/view/pages/public/Solutions.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Solutions.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Solutions.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Solutions.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DecorativeEllipses.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HeroButton.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=script&lang=js":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFaqSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeFaqSection.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFaqSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=script&lang=js":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFeatureGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeFeatureGrid.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFeatureGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=script&lang=js":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=script&lang=js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeHero_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeHero.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeHero_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=script&lang=js":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeNewsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeNewsSection.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeNewsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=script&lang=js":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomePartnersTicker.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeServicesGrid.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeStatsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeStatsSection.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeStatsSection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js":
/*!*************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SectionHeader.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Privacy.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=script&lang=js":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=script&lang=js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PrivacyPolicy.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicy_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=script&lang=js":
/*!*************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TermsAndConditions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TermsAndConditions.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TermsAndConditions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloudStorage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CloudStorage.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CloudStorage_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EndToEnd_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EndToEnd.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EndToEnd_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=script&lang=js":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SmallBusiness_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SmallBusiness.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SmallBusiness_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/AboutUs.vue?vue&type=template&id=373472a1&scoped=true":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/AboutUs.vue?vue&type=template&id=373472a1&scoped=true ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_template_id_373472a1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_template_id_373472a1_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_template_id_373472a1_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AboutUs.vue?vue&type=template&id=373472a1&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=template&id=373472a1&scoped=true");


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

/***/ "./resources/js/src/view/pages/public/Home.vue?vue&type=template&id=d8e9bb8e&scoped=true":
/*!***********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Home.vue?vue&type=template&id=d8e9bb8e&scoped=true ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_d8e9bb8e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_d8e9bb8e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_d8e9bb8e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=template&id=d8e9bb8e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=template&id=d8e9bb8e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_template_id_19f31848_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_template_id_19f31848_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_template_id_19f31848_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=template&id=19f31848&scoped=true");


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

/***/ "./resources/js/src/view/pages/public/Solutions.vue?vue&type=template&id=5d5a8eb0":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Solutions.vue?vue&type=template&id=5d5a8eb0 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_template_id_5d5a8eb0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_template_id_5d5a8eb0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Solutions_vue_vue_type_template_id_5d5a8eb0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Solutions.vue?vue&type=template&id=5d5a8eb0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Solutions.vue?vue&type=template&id=5d5a8eb0");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64 ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_template_id_2e3f0d64__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_template_id_2e3f0d64__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DecorativeEllipses_vue_vue_type_template_id_2e3f0d64__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DecorativeEllipses.vue?vue&type=template&id=2e3f0d64 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HeroButton.vue?vue&type=template&id=029dda8a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=template&id=3920c8c6":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=template&id=3920c8c6 ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFaqSection_vue_vue_type_template_id_3920c8c6__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFaqSection_vue_vue_type_template_id_3920c8c6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFaqSection_vue_vue_type_template_id_3920c8c6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeFaqSection.vue?vue&type=template&id=3920c8c6 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFaqSection.vue?vue&type=template&id=3920c8c6");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=template&id=393c15c4":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=template&id=393c15c4 ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFeatureGrid_vue_vue_type_template_id_393c15c4__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFeatureGrid_vue_vue_type_template_id_393c15c4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeFeatureGrid_vue_vue_type_template_id_393c15c4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeFeatureGrid.vue?vue&type=template&id=393c15c4 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeFeatureGrid.vue?vue&type=template&id=393c15c4");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=template&id=225960b0":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=template&id=225960b0 ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeHero_vue_vue_type_template_id_225960b0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeHero_vue_vue_type_template_id_225960b0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeHero_vue_vue_type_template_id_225960b0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeHero.vue?vue&type=template&id=225960b0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeHero.vue?vue&type=template&id=225960b0");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=template&id=4471a354":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=template&id=4471a354 ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeNewsSection_vue_vue_type_template_id_4471a354__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeNewsSection_vue_vue_type_template_id_4471a354__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeNewsSection_vue_vue_type_template_id_4471a354__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeNewsSection.vue?vue&type=template&id=4471a354 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeNewsSection.vue?vue&type=template&id=4471a354");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true":
/*!************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_template_id_50debe43_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_template_id_50debe43_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_template_id_50debe43_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=template&id=50debe43&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeServicesGrid.vue?vue&type=template&id=9697751c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=template&id=477434f4":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=template&id=477434f4 ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeStatsSection_vue_vue_type_template_id_477434f4__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeStatsSection_vue_vue_type_template_id_477434f4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeStatsSection_vue_vue_type_template_id_477434f4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeStatsSection.vue?vue&type=template&id=477434f4 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeStatsSection.vue?vue&type=template&id=477434f4");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3 ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SectionHeader.vue?vue&type=template&id=04fa6db3 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3");


/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=template&id=34b613c8":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=template&id=34b613c8 ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_template_id_34b613c8__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_template_id_34b613c8__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Privacy_vue_vue_type_template_id_34b613c8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Privacy.vue?vue&type=template&id=34b613c8 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/Privacy.vue?vue&type=template&id=34b613c8");


/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=template&id=028befcc":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=template&id=028befcc ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicy_vue_vue_type_template_id_028befcc__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicy_vue_vue_type_template_id_028befcc__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicy_vue_vue_type_template_id_028befcc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PrivacyPolicy.vue?vue&type=template&id=028befcc */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/PrivacyPolicy.vue?vue&type=template&id=028befcc");


/***/ }),

/***/ "./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=template&id=55198998":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=template&id=55198998 ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TermsAndConditions_vue_vue_type_template_id_55198998__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TermsAndConditions_vue_vue_type_template_id_55198998__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TermsAndConditions_vue_vue_type_template_id_55198998__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TermsAndConditions.vue?vue&type=template&id=55198998 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/legal/TermsAndConditions.vue?vue&type=template&id=55198998");


/***/ }),

/***/ "./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=template&id=0934aded":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=template&id=0934aded ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CloudStorage_vue_vue_type_template_id_0934aded__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CloudStorage_vue_vue_type_template_id_0934aded__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CloudStorage_vue_vue_type_template_id_0934aded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CloudStorage.vue?vue&type=template&id=0934aded */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/CloudStorage.vue?vue&type=template&id=0934aded");


/***/ }),

/***/ "./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=template&id=36f473ac":
/*!************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=template&id=36f473ac ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EndToEnd_vue_vue_type_template_id_36f473ac__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EndToEnd_vue_vue_type_template_id_36f473ac__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EndToEnd_vue_vue_type_template_id_36f473ac__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EndToEnd.vue?vue&type=template&id=36f473ac */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/EndToEnd.vue?vue&type=template&id=36f473ac");


/***/ }),

/***/ "./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834 ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductDescription_vue_vue_type_template_id_1a493834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductDescription.vue?vue&type=template&id=1a493834 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/ProductDescription.vue?vue&type=template&id=1a493834");


/***/ }),

/***/ "./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=template&id=47e5fb10":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=template&id=47e5fb10 ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SmallBusiness_vue_vue_type_template_id_47e5fb10__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SmallBusiness_vue_vue_type_template_id_47e5fb10__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SmallBusiness_vue_vue_type_template_id_47e5fb10__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SmallBusiness.vue?vue&type=template&id=47e5fb10 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/services/SmallBusiness.vue?vue&type=template&id=47e5fb10");


/***/ }),

/***/ "./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css":
/*!****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AboutUs_vue_vue_type_style_index_0_id_373472a1_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/AboutUs.vue?vue&type=style&index=0&id=373472a1&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogPost_vue_vue_type_style_index_0_id_33adde3c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/BlogPost.vue?vue&type=style&index=0&id=33adde3c&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ContactUs_vue_vue_type_style_index_0_id_1824d174_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/ContactUs.vue?vue&type=style&index=0&id=1824d174&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_d8e9bb8e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Home.vue?vue&type=style&index=0&id=d8e9bb8e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css":
/*!***************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css ***!
  \***************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_PasswordForgotForm_vue_vue_type_style_index_0_id_19f31848_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/PasswordForgotForm.vue?vue&type=style&index=0&id=19f31848&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Services_vue_vue_type_style_index_0_id_794f1590_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/Services.vue?vue&type=style&index=0&id=794f1590&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css":
/*!**************************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomePartnersTicker_vue_vue_type_style_index_0_id_50debe43_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/style-loader/dist/cjs.js!../../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomePartnersTicker.vue?vue&type=style&index=0&id=50debe43&scoped=true&lang=css");


/***/ })

}]);