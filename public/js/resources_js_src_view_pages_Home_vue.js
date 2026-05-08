"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_Home_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _blogData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blogData */ "./resources/js/src/view/blogData.js");

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
  components: {},
  data: function data() {
    return {
      animatedStats: {
        awbs: 0,
        airlines: 0,
        speed: 0
      },
      statsData: {
        awbs: {
          label: "AWBs Processed",
          target: 100000,
          suffix: "",
          icon: "file-earmark-check",
          description: "Our robust EDI engine has successfully processed over 1,00,000 Air Waybills, providing unmatched reliability for freight forwarders globally."
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
      },
      hasAnimatedStats: {
        awbs: false,
        airlines: false,
        speed: false
      },
      currentHeroIndex: 0,
      heroInterval: null,
      heroServices: [{
        title: 'FOCUS AIR',
        image: '/media/custome/banner-plane.png',
        extraStyle: {}
      }, {
        title: 'FOCUS SEA',
        image: '/media/custome/banner-ship.png',
        extraStyle: {}
      }, {
        title: 'FOCUS ROAD',
        image: '/media/custome/banner-truck.png',
        extraStyle: {
          marginTop: '40px'
        }
      }],
      affiliateImages: ["/media/custome/affiliation-tags/air-france.png", "/media/custome/affiliation-tags/emirates.png", "/media/custome/affiliation-tags/lufthansa.png", "/media/custome/affiliation-tags/qatar.png", "/media/custome/affiliation-tags/turkish-airlines.png"],
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
      }],
      featuredPost: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs[0],
      newsItems: _blogData__WEBPACK_IMPORTED_MODULE_0__.blogs.slice(1, 5),
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
    },
    formatStat: function formatStat(value, key) {
      if (key === 'awbs') {
        // Format to 1,00,000 (Indian format as requested)
        return value.toLocaleString('en-IN');
      }
      return value.toLocaleString();
    },
    animateStat: function animateStat(key) {
      var _this = this;
      var target = this.statsData[key].target;
      var duration = 2000;
      var stepTime = 20;
      var steps = duration / stepTime;
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
      }, stepTime);
    },
    isElementInViewport: function isElementInViewport(element) {
      if (!element) return false;
      var rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    },
    checkVisibility: function checkVisibility() {
      var _this2 = this;
      Object.keys(this.statsData).forEach(function (key) {
        var refName = "statRef-".concat(key);
        var element = _this2.$refs[refName] ? _this2.$refs[refName][0] : null;
        if (element && !_this2.hasAnimatedStats[key] && _this2.isElementInViewport(element)) {
          _this2.animateStat(key);
          _this2.hasAnimatedStats[key] = true;
        }
      });
      var allDone = Object.values(this.hasAnimatedStats).every(function (v) {
        return v;
      });
      if (!allDone) {
        this.animationFrameId = requestAnimationFrame(this.checkVisibility);
      }
    }
  },
  mounted: function mounted() {
    var _this3 = this;
    this.animationFrameId = requestAnimationFrame(this.checkVisibility);
    this.heroInterval = setInterval(function () {
      _this3.currentHeroIndex = (_this3.currentHeroIndex + 1) % _this3.heroServices.length;
    }, 4000);

    // Multiply the 5 logos to create a continuous dense ticker of 150 items
    var baseLogos = this.affiliateImages;
    var expandedLogos = [];
    for (var i = 0; i < 30; i++) {
      expandedLogos = expandedLogos.concat(baseLogos);
    }
    this.affiliateImages = expandedLogos;
  },
  beforeDestroy: function beforeDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=template&id=1ae9e65b&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=template&id=1ae9e65b&scoped=true ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "content-container"
  }, [_c("section", {
    staticClass: "hero-section",
    attrs: {
      "aria-labelledby": "hero-heading"
    }
  }, [_c("transition", {
    attrs: {
      name: "hero-fade"
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
      name: "hero-fade"
    }
  }, [_c("img", {
    key: _vm.heroServices[_vm.currentHeroIndex].image,
    "class": ["hero-plane", {
      "is-tilted-plane": _vm.heroServices[_vm.currentHeroIndex].title === "FOCUS AIR"
    }],
    style: _vm.heroServices[_vm.currentHeroIndex].extraStyle,
    attrs: {
      src: _vm.heroServices[_vm.currentHeroIndex].image,
      alt: "Digital freight logistics solutions"
    }
  })])], 1), _vm._v(" "), _c("div", {
    staticClass: "hero-content"
  }, [_c("div", {
    staticClass: "hero-text-block"
  }, [_c("h1", {
    staticClass: "hero-title",
    attrs: {
      id: "hero-heading"
    }
  }, [_vm._v("Smart e-Freight Solutions for Freight Forwarders")]), _vm._v(" "), _c("p", {
    staticClass: "hero-subtitle"
  }, [_vm._v("\n                      Eliminate manual entry frustrations. Process "), _c("strong", [_vm._v("MAWB and HAWB in under 3 seconds")]), _vm._v(", seamlessly connect with "), _c("strong", [_vm._v("150+ airlines globally")]), _vm._v(", and join the network trusted for over "), _c("strong", [_vm._v("1,00,000+ AWBs")]), _vm._v(".\n                  ")]), _vm._v(" "), _c("b-button", {
    staticClass: "hero-btn",
    attrs: {
      to: "/about-us",
      "aria-label": "Explore our logistics solutions"
    }
  }, [_c("span", [_vm._v("Explore Now")]), _vm._v(" "), _c("b-icon", {
    staticClass: "btn-icon ms-2",
    attrs: {
      icon: "arrow-right",
      "aria-hidden": "true"
    }
  })], 1)], 1)])], 1), _vm._v(" "), _c("section", {
    staticClass: "aff-section",
    attrs: {
      "aria-label": "Our Airline Partners"
    }
  }, [_c("div", {
    staticClass: "aff-label"
  }, [_c("span", {
    staticClass: "aff-eyebrow"
  }, [_vm._v("Partners")]), _vm._v(" "), _c("h2", {
    staticClass: "aff-heading"
  }, [_vm._v("Global Airline Affiliations")])]), _vm._v(" "), _c("div", {
    staticClass: "aff-divider"
  }), _vm._v(" "), _c("div", {
    staticClass: "aff-track-wrap"
  }, [_c("div", {
    staticClass: "scroller-track"
  }, _vm._l(_vm.affiliateImages, function (img, idx) {
    return _c("div", {
      key: idx,
      staticClass: "aff-logo-wrap"
    }, [_c("img", {
      staticClass: "affiliate-logo",
      attrs: {
        src: img,
        alt: "Partner airline logo ".concat(idx + 1)
      }
    })]);
  }), 0)])]), _vm._v(" "), _c("section", {
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
  })], 2)], 1), _vm._v(" "), _c("section", {
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
      fn: function fn(_ref2) {
        var navigate = _ref2.navigate;
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
        }, [_c("img", {
          attrs: {
            src: "/media/custome/about/boat.png",
            alt: "Focus Sea - Digital Ocean Freight Management"
          }
        })]), _vm._v(" "), _c("div", {
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
      fn: function fn(_ref3) {
        var navigate = _ref3.navigate;
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
        }, [_c("img", {
          attrs: {
            src: "/media/custome/about/plane.png",
            alt: "Focus Air - Automated Air Freight Solutions"
          }
        })]), _vm._v(" "), _c("div", {
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
        }, [_c("span", [_vm._v("Explore More")]), _vm._v(" "), _c("b-icon", {
          staticClass: "btn-icon",
          attrs: {
            icon: "arrow-right",
            "aria-hidden": "true"
          }
        })], 1)], 1)])];
      }
    }])
  }), _vm._v(" "), _c("router-link", {
    attrs: {
      to: "/product-description",
      custom: ""
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(_ref4) {
        var navigate = _ref4.navigate;
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
        }, [_c("img", {
          attrs: {
            src: "/media/custome/about/truck.png",
            alt: "Focus Road - Road Transportation Management"
          }
        })]), _vm._v(" "), _c("div", {
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
  })], 1)])], 1)], 1), _vm._v(" "), _c("section", {
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
    }, [_vm._v("\n                                  " + _vm._s(_vm.formatStat(_vm.animatedStats[key], key)) + _vm._s(stat.suffix) + "\n                              ")]), _vm._v(" "), _c("h3", {
      staticClass: "stat-minimal-label"
    }, [_vm._v(_vm._s(stat.label))]), _vm._v(" "), _c("p", {
      staticClass: "stat-minimal-desc"
    }, [_vm._v(_vm._s(stat.description))])])]);
  }), 0)])], 1)], 1), _vm._v(" "), _c("section", {
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
  }), 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-md-none text-center mt-4"
  }, [_c("b-link", {
    staticClass: "view-all-btn",
    attrs: {
      href: "#",
      "aria-label": "View all logistics news articles"
    }
  }, [_vm._v("View All News")])], 1)], 1), _vm._v(" "), _c("section", {
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
  }, [_vm._v("Get in Touch")])], 1)])])], 1)], 1)])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.main-wrapper[data-v-1ae9e65b] {\n    font-family: 'Inter', sans-serif;\n    position: relative;\n    overflow-x: hidden;\n}\n\n/* Decorative background elements */\n.decorative-ellipses .ellipse[data-v-1ae9e65b] {\n    position: absolute;\n    border-radius: 50%;\n    filter: blur(80px);\n    z-index: 0;\n    opacity: 0.5;\n}\n.ellipse-tl[data-v-1ae9e65b] { width: 400px; height: 400px; background: #D0E6F8; top: -100px; left: -100px;\n}\n.ellipse-tr[data-v-1ae9e65b] { width: 300px; height: 300px; background: #E6F0FF; top: 20%; right: -50px;\n}\n.ellipse-br[data-v-1ae9e65b] { width: 500px; height: 500px; background: #F0F7FF; bottom: 10%; left: 20%;\n}\n.content-container[data-v-1ae9e65b] {\n    position: relative;\n    z-index: 10;\n    padding-top: 0;\n}\n\n/* Typography */\n.section-title[data-v-1ae9e65b] {\n    font-size: 2.5rem;\n    font-weight: 700;\n    color: #355594;\n    letter-spacing: -0.5px;\n}\n.section-subtitle[data-v-1ae9e65b] {\n    font-size: 1.25rem;\n    color: #5A6B8A;\n    font-weight: 400;\n}\n.hero-section[data-v-1ae9e65b] {\n    position: relative;\n    width: 100%;\n    min-height: 92vh;\n    display: flex;\n    flex-direction: column;\n    justify-content: flex-start;\n    padding-top: 2rem;\n    background: transparent;\n}\n\n/* Title — pinned near the top */\n.hero-bg-text[data-v-1ae9e65b] {\n    position: absolute;\n    top: 16%;\n    left: 5%;\n    font-size: clamp(6rem, 16vw, 14rem);\n    font-weight: 900;\n    color: white;\n    opacity: 0.95;\n    letter-spacing: -0.03em;\n    z-index: 1;\n    white-space: nowrap;\n    pointer-events: none;\n    line-height: 1;\n    text-shadow: 0 8px 32px rgba(53, 85, 148, 0.15);\n}\n\n/* Plane — large, anchored bottom-right, overlapping the title */\n.hero-plane[data-v-1ae9e65b] {\n    position: absolute;\n    right: -2%;\n    top: 18%;\n    width: 64%;\n    max-width: 780px;\n    z-index: 2;\n    filter: drop-shadow(0 40px 80px rgba(53, 85, 148, 0.18));\n    pointer-events: none;\n}\n.hero-plane.is-tilted-plane[data-v-1ae9e65b] {\n    transform: rotate(-5deg);\n}\n.hero-fade-enter-active[data-v-1ae9e65b], .hero-fade-leave-active[data-v-1ae9e65b] {\n    transition: opacity 1s ease-in-out;\n}\n.hero-fade-enter[data-v-1ae9e65b], .hero-fade-leave-to[data-v-1ae9e65b] {\n    opacity: 0 !important;\n}\n\n/* Content — sits in normal flow, below the title area */\n.hero-content[data-v-1ae9e65b] {\n    position: absolute;\n    top: 58%;\n    left: 6.5%;\n    transform: translateY(-50%);\n    z-index: 3;\n    padding: 0;\n}\n.hero-text-block[data-v-1ae9e65b] {\n    max-width: 460px;\n}\n.hero-title[data-v-1ae9e65b] {\n    font-size: 2.8rem;\n    font-weight: 800;\n    color: #355594;\n    margin-bottom: 1rem;\n    line-height: 1.1;\n    letter-spacing: -1px;\n}\n.hero-subtitle[data-v-1ae9e65b] {\n    font-size: 1.05rem;\n    line-height: 1.8;\n    color: #4A5E80;\n    margin-bottom: 2rem;\n}\n.hero-subtitle strong[data-v-1ae9e65b] {\n    color: #355594;\n    font-weight: 600;\n}\n.hero-btn[data-v-1ae9e65b] {\n    background: #355594;\n    border: none;\n    border-radius: 999px;\n    padding: 10px 10px 10px 22px;\n    display: inline-flex;\n    align-items: center;\n    transition: all 0.3s ease;\n}\n.hero-btn[data-v-1ae9e65b]:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 10px 30px rgba(53, 85, 148, 0.25);\n}\n.is-dark .hero-btn[data-v-1ae9e65b] {\n    background: white;\n}\n.is-dark .hero-btn[data-v-1ae9e65b]:hover {\n    background: #f8faff;\n    box-shadow: 0 10px 20px rgba(0,0,0,0.1);\n}\n.hero-btn span[data-v-1ae9e65b] {\n    color: white;\n    font-weight: 500;\n    margin-right: 14px;\n}\n.is-dark .hero-btn span[data-v-1ae9e65b] {\n    color: #1e3a6e;\n}\n.hero-btn .btn-icon[data-v-1ae9e65b] {\n    background: white;\n    color: #355594;\n    border-radius: 50%;\n    width: 32px;\n    height: 32px;\n    padding: 8px;\n}\n.is-dark .hero-btn .btn-icon[data-v-1ae9e65b] {\n    background: #1e3a6e;\n    color: white;\n}\n\n\n\n\n\n/* Affiliations Section */\n.aff-section[data-v-1ae9e65b] {\n  display: flex;\n  align-items: center;\n  gap: 2rem;\n  padding: 1.25rem 1.5rem;\n  background: #fff;\n  border: 1px solid rgba(0,0,0,0.08);\n  border-radius: 12px;\n  overflow: hidden;\n  margin-bottom: 1.5rem;\n  position: relative;\n  z-index: 10;\n  margin-top: 0;\n  top: -8.5rem;\n  width: 90%;\n  max-width: 1100px;\n  left: 5%;\n}\n.aff-eyebrow[data-v-1ae9e65b] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  color: #9ca3af;\n  display: block;\n}\n.aff-heading[data-v-1ae9e65b] {\n  font-size: 15px;\n  font-weight: 600;\n  color: #355594;\n  display: block;\n}\n.aff-divider[data-v-1ae9e65b] {\n  width: 1px;\n  height: 40px;\n  background: rgba(0,0,0,0.08);\n  flex-shrink: 0;\n}\n.aff-track-wrap[data-v-1ae9e65b] {\n  flex: 1;\n  overflow: hidden;\n  position: relative;\n  min-width: 0;\n}\n.aff-track-wrap[data-v-1ae9e65b]::before,\n.aff-track-wrap[data-v-1ae9e65b]::after {\n  content: '';\n  position: absolute;\n  top: 0; bottom: 0;\n  width: 48px;\n  z-index: 2;\n  pointer-events: none;\n}\n.aff-track-wrap[data-v-1ae9e65b]::before { left: 0; background: linear-gradient(to right, #fff, transparent);\n}\n.aff-track-wrap[data-v-1ae9e65b]::after  { right: 0; background: linear-gradient(to left,  #fff, transparent);\n}\n.scroller-track[data-v-1ae9e65b] {\n  display: flex;\n  align-items: center;\n  gap: 2.5rem;\n  animation: scroll-1ae9e65b 120s linear infinite;\n  width: -moz-max-content;\n  width: max-content;\n}\n.scroller-track[data-v-1ae9e65b]:hover { animation-play-state: paused;\n}\n.aff-logo-wrap[data-v-1ae9e65b] {\n  padding: 6px 10px;\n  border-radius: 6px;\n  transition: background 0.2s ease;\n}\n.aff-logo-wrap[data-v-1ae9e65b]:hover { background: #f3f4f6;\n}\n.affiliate-logo[data-v-1ae9e65b] {\n  height: 32px;\n  -o-object-fit: contain;\n     object-fit: contain;\n  filter: grayscale(100%) opacity(0.45);\n  transition: filter 0.3s ease, transform 0.3s ease;\n}\n.affiliate-logo[data-v-1ae9e65b]:hover {\n  filter: grayscale(0%) opacity(1);\n  transform: scale(1.08);\n}\n@keyframes scroll-1ae9e65b {\n0%   { transform: translateX(0);\n}\n100% { transform: translateX(-50%);\n}\n}\n\n/* Features Section */\n.features-container[data-v-1ae9e65b] {\n    position: relative;\n    padding: 4rem 0;\n}\n.features-bg-glow[data-v-1ae9e65b] {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: 80%;\n    height: 80%;\n    background: radial-gradient(circle, rgba(208, 230, 248, 0.4) 0%, transparent 70%);\n    z-index: -1;\n    filter: blur(60px);\n}\n.section-eyebrow[data-v-1ae9e65b] {\n    text-transform: uppercase;\n    letter-spacing: 2px;\n    font-size: 0.85rem;\n    font-weight: 700;\n    color: #355594;\n    opacity: 0.6;\n    margin-bottom: 1rem;\n    display: block;\n}\n.feature-card-wrapper[data-v-1ae9e65b] {\n    position: relative;\n    height: 100%;\n    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);\n}\n.feature-card-glow[data-v-1ae9e65b] {\n    position: absolute;\n    inset: -2px;\n    background: linear-gradient(135deg, #355594, #ABC0FF);\n    border-radius: 24px;\n    opacity: 0;\n    filter: blur(15px);\n    transition: opacity 0.4s ease;\n    z-index: 0;\n}\n.feature-card[data-v-1ae9e65b] {\n    position: relative;\n    z-index: 1;\n    border: 1px solid rgba(255, 255, 255, 0.4);\n    border-radius: 32px;\n    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);\n    -webkit-backdrop-filter: blur(20px);\n            backdrop-filter: blur(20px);\n    padding: 2.5rem;\n    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);\n    display: flex;\n    flex-direction: column;\n    box-shadow: \n        0 4px 6px -1px rgba(0, 0, 0, 0.05),\n        0 2px 4px -1px rgba(0, 0, 0, 0.03),\n        inset 0 0 0 1px rgba(255, 255, 255, 0.5);\n}\n.feature-card[data-v-1ae9e65b] .card-body {\n    padding: 0;\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n}\n.feature-icon-container[data-v-1ae9e65b] {\n    position: relative;\n    width: 120px;\n    height: 120px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-bottom: 2.5rem;\n}\n.icon-circle[data-v-1ae9e65b] {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    background: #F0F7FF;\n    border-radius: 32px;\n    transform: rotate(45deg);\n    transition: all 0.4s ease;\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.05);\n}\n.feature-icon[data-v-1ae9e65b] {\n    position: relative;\n    z-index: 2;\n    max-width: 64px;\n    max-height: 64px;\n    transition: all 0.5s ease;\n}\n.feature-title[data-v-1ae9e65b] {\n    color: #1e3a6e;\n    font-weight: 800;\n    font-size: 1.4rem;\n    margin-bottom: 1.25rem;\n    letter-spacing: -0.5px;\n}\n.feature-desc[data-v-1ae9e65b] {\n    color: #5A6B8A;\n    font-size: 1rem;\n    line-height: 1.7;\n    margin-bottom: 2rem;\n    opacity: 0.9;\n}\n.feature-link[data-v-1ae9e65b] {\n    display: inline-flex;\n    align-items: center;\n    color: #355594;\n    font-weight: 700;\n    font-size: 0.95rem;\n    transition: all 0.3s ease;\n    cursor: pointer;\n    margin-top: auto;\n}\n.feature-link span[data-v-1ae9e65b] {\n    border-bottom: 2px solid transparent;\n    transition: all 0.3s ease;\n}\n\n/* Hover States - Simplified */\n.feature-card-wrapper[data-v-1ae9e65b]:hover {\n    transform: translateY(-8px);\n}\n.feature-card-wrapper:hover .feature-card-glow[data-v-1ae9e65b] {\n    opacity: 0.3;\n}\n.feature-card-wrapper:hover .feature-card[data-v-1ae9e65b] {\n    background: white;\n    border-color: #355594;\n    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.1);\n}\n.feature-card-wrapper:hover .icon-circle[data-v-1ae9e65b] {\n    background: #355594;\n    transform: rotate(45deg) scale(1.05); /* Keep diamond shape */\n}\n.feature-card-wrapper:hover .feature-icon[data-v-1ae9e65b] {\n    filter: brightness(0) invert(1);\n    transform: scale(1.1);\n}\n.feature-card-wrapper:hover .feature-link[data-v-1ae9e65b] {\n    color: #1e3a6e;\n}\n.feature-card-wrapper:hover .feature-link .b-icon[data-v-1ae9e65b] {\n    transform: translateX(5px);\n}\n\n/* Specialized Services - Product Card Layout */\n.services-modern-grid[data-v-1ae9e65b] {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 32px;\n}\n.service-product-card[data-v-1ae9e65b] {\n    background: #fbfbfd;\n    border-radius: 28px;\n    padding: 3rem 2rem;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    text-align: center;\n    position: relative;\n    transition: all 0.4s ease;\n    border: 1px solid transparent;\n}\n.service-product-card[data-v-1ae9e65b]:hover {\n    background: #1e3a6e;\n    border-color: #1e3a6e;\n    transform: translateY(-5px);\n    box-shadow: 0 40px 80px rgba(30, 58, 110, 0.3);\n}\n.service-product-card:hover .service-product-title[data-v-1ae9e65b] {\n    color: white;\n}\n.service-product-card:hover .service-product-desc[data-v-1ae9e65b] {\n    color: rgba(255, 255, 255, 0.85);\n}\n.service-product-card:hover .hero-btn[data-v-1ae9e65b],\n.service-product-card:hover .service-product-btn[data-v-1ae9e65b] {\n    background: white;\n    color: #1e3a6e;\n    border-color: white;\n}\n.service-product-card:hover .hero-btn span[data-v-1ae9e65b],\n.service-product-card:hover .service-product-btn span[data-v-1ae9e65b] {\n    color: #1e3a6e;\n}\n.service-product-card:hover .hero-btn .btn-icon[data-v-1ae9e65b] {\n    background: #1e3a6e;\n    color: white;\n}\n.service-product-badge[data-v-1ae9e65b] {\n    position: absolute;\n    top: 24px;\n    right: 24px;\n    font-size: 0.7rem;\n    font-weight: 800;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n    color: #5A6B8A;\n    background: #F0F4F8;\n    padding: 4px 12px;\n    border-radius: 8px;\n}\n.service-product-image[data-v-1ae9e65b] {\n    height: 200px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin-bottom: 2.5rem;\n}\n.service-product-image img[data-v-1ae9e65b] {\n    max-height: 100%;\n    max-width: 100%;\n    -o-object-fit: contain;\n       object-fit: contain;\n    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.05));\n    transition: transform 0.4s ease;\n}\n.service-product-card:hover .service-product-image img[data-v-1ae9e65b] {\n    transform: scale(1.05);\n}\n.service-product-title[data-v-1ae9e65b] {\n    color: #1e3a6e;\n    font-weight: 800;\n    font-size: 1.5rem;\n    margin-bottom: 1rem;\n    letter-spacing: -0.5px;\n}\n.service-product-desc[data-v-1ae9e65b] {\n    color: #5A6B8A;\n    font-size: 0.95rem;\n    line-height: 1.6;\n    margin-bottom: 2.5rem;\n    max-width: 280px;\n}\n.service-product-btn[data-v-1ae9e65b] {\n    border-radius: 999px;\n    padding: 12px 28px;\n    font-weight: 700;\n    font-size: 0.9rem;\n    transition: all 0.3s ease;\n    border: none;\n    background: #E5E7EB;\n    color: #6B7280;\n}\n.service-product-btn.active[data-v-1ae9e65b] {\n    background: #355594;\n    color: white;\n}\n.service-product-btn.active[data-v-1ae9e65b]:hover {\n    background: #1e3a6e;\n    transform: scale(1.05);\n}\n@media (max-width: 991px) {\n.services-modern-grid[data-v-1ae9e65b] {\n        grid-template-columns: 1fr;\n}\n.service-product-card[data-v-1ae9e65b] {\n        padding: 4rem 2rem;\n}\n}\n\n/* Stats Section - Minimalist */\n.stats-container[data-v-1ae9e65b] {\n    padding: 4rem 0;\n}\n.stats-intro[data-v-1ae9e65b] {\n    padding-right: 2rem;\n}\n.stats-decoration-line[data-v-1ae9e65b] {\n    width: 60px;\n    height: 4px;\n    background: #355594;\n    border-radius: 2px;\n}\n.stats-minimal-grid[data-v-1ae9e65b] {\n    display: grid;\n    grid-template-columns: 1fr;\n    gap: 3rem;\n}\n.stat-minimal-item[data-v-1ae9e65b] {\n    display: flex;\n    align-items: flex-start;\n    gap: 2rem;\n    padding: 2rem;\n    margin: 0 -2rem;\n    border-radius: 24px;\n    border-bottom: 1px solid rgba(53, 85, 148, 0.1);\n    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);\n}\n.stat-minimal-item[data-v-1ae9e65b]:last-child {\n    border-bottom: none;\n}\n.stat-minimal-item[data-v-1ae9e65b]:hover {\n    background: #355594;\n    transform: translateX(20px);\n    box-shadow: 0 20px 40px rgba(53, 85, 148, 0.15);\n}\n.stat-minimal-icon[data-v-1ae9e65b] {\n    font-size: 2.2rem;\n    color: #355594;\n    padding-top: 0.5rem;\n    transition: all 0.4s ease;\n}\n.stat-minimal-item:hover .stat-minimal-icon[data-v-1ae9e65b] {\n    transform: scale(1.1);\n    color: white;\n}\n.stat-minimal-number[data-v-1ae9e65b] {\n    font-size: 3.5rem;\n    font-weight: 900;\n    color: #1e3a6e;\n    line-height: 1;\n    margin-bottom: 0.5rem;\n    letter-spacing: -2px;\n    transition: all 0.4s ease;\n}\n.stat-minimal-item:hover .stat-minimal-number[data-v-1ae9e65b] {\n    color: white;\n}\n.stat-minimal-label[data-v-1ae9e65b] {\n    font-size: 1.1rem;\n    font-weight: 800;\n    color: #355594;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n    margin-bottom: 0.75rem;\n    transition: all 0.4s ease;\n}\n.stat-minimal-item:hover .stat-minimal-label[data-v-1ae9e65b] {\n    color: rgba(255, 255, 255, 0.9);\n}\n.stat-minimal-desc[data-v-1ae9e65b] {\n    color: #5A6B8A;\n    font-size: 1rem;\n    line-height: 1.6;\n    margin: 0;\n    max-width: 500px;\n    transition: all 0.4s ease;\n}\n.stat-minimal-item:hover .stat-minimal-desc[data-v-1ae9e65b] {\n    color: rgba(255, 255, 255, 0.8);\n}\n@media (min-width: 992px) {\n.stats-minimal-grid[data-v-1ae9e65b] {\n        grid-template-columns: 1fr;\n}\n}\n\n/* News Section */\n.news-section-container[data-v-1ae9e65b] {\n    padding: 2rem 0;\n}\n.view-all-btn[data-v-1ae9e65b] {\n    display: inline-flex;\n    align-items: center;\n    background: #F0F7FF;\n    color: #355594;\n    padding: 12px 24px;\n    border-radius: 999px;\n    font-weight: 700;\n    text-decoration: none;\n    transition: all 0.3s ease;\n    border: 1px solid #E6F0FF;\n}\n.view-all-btn[data-v-1ae9e65b]:hover {\n    background: #355594;\n    color: white;\n    text-decoration: none;\n    transform: translateY(-2px);\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.1);\n}\n.news-card[data-v-1ae9e65b] {\n    background: white;\n    border-radius: 24px;\n    overflow: hidden;\n    height: 100%;\n    transition: all 0.4s ease;\n    border: 1px solid rgba(230, 240, 255, 0.6);\n    display: flex;\n    flex-direction: column;\n}\n.news-card[data-v-1ae9e65b]:hover {\n    transform: translateY(-8px);\n    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05);\n    border-color: #355594;\n}\n.news-image-wrap[data-v-1ae9e65b] {\n    position: relative;\n    height: 320px;\n    overflow: hidden;\n}\n.news-image-wrap.small[data-v-1ae9e65b] {\n    height: 180px;\n}\n.news-img[data-v-1ae9e65b] {\n    width: 100%;\n    height: 100%;\n    -o-object-fit: cover;\n       object-fit: cover;\n    transition: transform 0.6s ease;\n}\n.news-card:hover .news-img[data-v-1ae9e65b] {\n    transform: scale(1.1);\n}\n.news-category[data-v-1ae9e65b] {\n    position: absolute;\n    top: 20px;\n    left: 20px;\n    background: rgba(53, 85, 148, 0.9);\n    color: white;\n    padding: 6px 14px;\n    border-radius: 8px;\n    font-size: 0.75rem;\n    font-weight: 700;\n    -webkit-backdrop-filter: blur(4px);\n            backdrop-filter: blur(4px);\n}\n.news-body[data-v-1ae9e65b] {\n    padding: 2rem;\n    flex-grow: 1;\n    display: flex;\n    flex-direction: column;\n}\n.news-card.small .news-body[data-v-1ae9e65b] {\n    padding: 1.5rem;\n}\n.news-meta[data-v-1ae9e65b] {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    margin-bottom: 1rem;\n    font-size: 0.85rem;\n    color: #9CA3AF;\n    font-weight: 600;\n}\n.meta-dot[data-v-1ae9e65b] {\n    width: 4px;\n    height: 4px;\n    background: #D1D5DB;\n    border-radius: 50%;\n}\n.news-title[data-v-1ae9e65b] {\n    font-size: 1.6rem;\n    font-weight: 800;\n    color: #1e3a6e;\n    line-height: 1.3;\n    margin-bottom: 1rem;\n    letter-spacing: -0.5px;\n}\n.news-title-small[data-v-1ae9e65b] {\n    font-size: 1.1rem;\n    font-weight: 700;\n    color: #1e3a6e;\n    line-height: 1.4;\n    margin-bottom: 1rem;\n}\n.news-excerpt[data-v-1ae9e65b] {\n    color: #5A6B8A;\n    font-size: 1rem;\n    line-height: 1.6;\n    margin-bottom: 2rem;\n}\n.news-read-more[data-v-1ae9e65b] {\n    display: inline-flex;\n    align-items: center;\n    color: #355594;\n    font-weight: 800;\n    text-decoration: none;\n    margin-top: auto;\n}\n.news-read-more .b-icon[data-v-1ae9e65b] {\n    font-size: 1.4rem;\n}\n.news-link-simple[data-v-1ae9e65b] {\n    color: #355594;\n    font-weight: 700;\n    font-size: 0.9rem;\n    text-decoration: underline;\n    text-underline-offset: 4px;\n    margin-top: auto;\n}\n.news-link-simple[data-v-1ae9e65b]:hover {\n    color: #1e3a6e;\n}\n\n/* FAQ Section - Modern Redesign */\n.faq-section-container[data-v-1ae9e65b] {\n    padding: 2rem 0;\n}\n.faq-accordion-list[data-v-1ae9e65b] {\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n}\n.faq-item[data-v-1ae9e65b] {\n    background: white;\n    border: 1px solid #E6F0FF;\n    border-radius: 20px;\n    overflow: hidden;\n    transition: all 0.3s ease;\n}\n.faq-item[data-v-1ae9e65b]:hover {\n    border-color: #ABC0FF;\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.03);\n}\n.faq-item.is-open[data-v-1ae9e65b] {\n    border-color: #355594;\n    box-shadow: 0 15px 30px rgba(53, 85, 148, 0.08);\n}\n.faq-header[data-v-1ae9e65b] {\n    padding: 1.75rem 2rem;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    cursor: pointer;\n}\n.faq-question[data-v-1ae9e65b] {\n    font-size: 1.2rem;\n    font-weight: 700;\n    color: #1e3a6e;\n    margin: 0;\n    padding-right: 2rem;\n}\n.faq-toggle-icon[data-v-1ae9e65b] {\n    position: relative;\n    width: 24px;\n    height: 24px;\n    flex-shrink: 0;\n}\n.icon-line[data-v-1ae9e65b] {\n    position: absolute;\n    background: #355594;\n    transition: all 0.3s ease;\n}\n.icon-line.horizontal[data-v-1ae9e65b] {\n    width: 100%;\n    height: 2px;\n    top: 50%;\n    left: 0;\n    transform: translateY(-50%);\n}\n.icon-line.vertical[data-v-1ae9e65b] {\n    width: 2px;\n    height: 100%;\n    top: 0;\n    left: 50%;\n    transform: translateX(-50%);\n}\n.icon-line.vertical.is-hidden[data-v-1ae9e65b] {\n    transform: translateX(-50%) rotate(90deg);\n    opacity: 0;\n}\n.faq-body[data-v-1ae9e65b] {\n    padding: 0 2rem 2rem;\n}\n.faq-body p[data-v-1ae9e65b] {\n    color: #5A6B8A;\n    font-size: 1.05rem;\n    line-height: 1.7;\n    margin: 0;\n}\n.faq-footer-card[data-v-1ae9e65b] {\n    background: #F8FBFF;\n    border: 1px solid #E6F0FF;\n    padding: 3rem;\n    border-radius: 32px;\n}\n.faq-footer-card h4[data-v-1ae9e65b] {\n    font-weight: 800;\n    color: #1e3a6e;\n}\n.faq-footer-card p[data-v-1ae9e65b] {\n    color: #5A6B8A;\n    font-size: 1.1rem;\n}\n.faq-contact-btn[data-v-1ae9e65b] {\n    background: #355594;\n    color: white;\n    border: none;\n    border-radius: 999px;\n    padding: 14px 32px;\n    font-weight: 700;\n    transition: all 0.3s ease;\n}\n.faq-contact-btn[data-v-1ae9e65b]:hover {\n    background: #1e3a6e;\n    transform: translateY(-2px);\n    box-shadow: 0 10px 20px rgba(53, 85, 148, 0.2);\n}\n\n/* Responsive Overrides */\n@media (max-width: 1199px) {\n.hero-title[data-v-1ae9e65b] { font-size: 3.5rem;\n}\n.stat-minimal-number[data-v-1ae9e65b] { font-size: 3rem;\n}\n}\n@media (max-width: 991px) {\n.hero-section[data-v-1ae9e65b] { \n        display: flex; \n        flex-direction: column; \n        padding-top: 4rem;\n        min-height: auto;\n        position: relative;\n}\n.hero-bg-text[data-v-1ae9e65b] { \n        position: absolute;\n        top: 2rem;\n        left: 50%;\n        transform: translateX(-50%);\n        font-size: clamp(4rem, 18vw, 8rem); \n        color: #ffffff;\n        opacity: 0.9;\n        z-index: 1;\n        text-align: center;\n        width: 100%;\n        letter-spacing: -2px;\n        line-height: 1;\n        white-space: nowrap;\n        pointer-events: none;\n        text-shadow: 0 10px 40px rgba(53, 85, 148, 0.15);\n}\n.hero-plane-wrapper[data-v-1ae9e65b] {\n        order: 1;\n        position: relative;\n        width: 100%;\n        height: 320px;\n        margin: 0 auto 2rem;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        z-index: 2;\n}\n.hero-plane[data-v-1ae9e65b] { \n        position: relative;\n        top: 0;\n        left: auto;\n        transform: none;\n        width: 85%; \n        max-width: 600px; \n        margin: 0; \n        display: block; \n        opacity: 1;\n        filter: drop-shadow(0 20px 40px rgba(53, 85, 148, 0.15));\n}\n.hero-plane.is-tilted-plane[data-v-1ae9e65b] {\n        transform: none;\n}\n.hero-content[data-v-1ae9e65b] { \n        order: 2;\n        position: relative;\n        top: auto;\n        left: auto;\n        transform: none;\n        text-align: center; \n        padding: 0 2rem 4rem;\n        width: 100%;\n        z-index: 3;\n        margin-top: -2rem;\n}\n.aff-section[data-v-1ae9e65b] { \n        margin-top: 2rem !important; \n        top: 0 !important; \n        left: 5% !important;\n        position: relative !important;\n        margin-bottom: 4rem !important;\n        flex-direction: column;\n        text-align: center;\n        padding: 1.5rem !important;\n        gap: 1.5rem !important;\n}\n.aff-label[data-v-1ae9e65b] {\n        text-align: center;\n}\n.aff-divider[data-v-1ae9e65b] {\n        display: none;\n}\n.scroller-track[data-v-1ae9e65b] {\n        animation: scroll-1ae9e65b 40s linear infinite !important;\n}\n.hero-text-block[data-v-1ae9e65b] { width: 100%; max-width: 800px; margin: 0 auto;\n}\n.hero-title[data-v-1ae9e65b] { \n        font-size: clamp(2.2rem, 6vw, 3.2rem); \n        margin-bottom: 1.5rem; \n        opacity: 1 !important; \n        max-width: 700px;\n        margin-left: auto;\n        margin-right: auto;\n}\n.hero-subtitle[data-v-1ae9e65b] { \n        font-size: 1.15rem; \n        max-width: 650px; \n        margin: 0 auto 2.5rem; \n        opacity: 1 !important;\n}\n.cta-group[data-v-1ae9e65b] { justify-content: center;\n}\n.services-modern-grid[data-v-1ae9e65b] { grid-template-columns: 1fr; gap: 2rem;\n}\n.service-product-card[data-v-1ae9e65b] { padding: 3rem 2rem;\n}\n.stats-intro[data-v-1ae9e65b] { text-align: center; padding-right: 0; margin-bottom: 4rem; display: flex; flex-direction: column; align-items: center;\n}\n.stat-minimal-item[data-v-1ae9e65b] { gap: 1.5rem; padding: 1.5rem; margin: 0;\n}\n.stat-minimal-number[data-v-1ae9e65b] { font-size: 2.8rem;\n}\n.news-title[data-v-1ae9e65b] { font-size: 1.4rem;\n}\n.news-image-wrap[data-v-1ae9e65b] { height: 240px;\n}\n}\n@media (max-width: 767px) {\n.hero-section[data-v-1ae9e65b] { padding-top: 3rem;\n}\n.hero-bg-text[data-v-1ae9e65b] { font-size: clamp(2.5rem, 15vw, 4rem); top: 1.5rem;\n}\n.hero-plane-wrapper[data-v-1ae9e65b] { height: 180px; margin-bottom: 1rem;\n}\n.hero-plane[data-v-1ae9e65b] { width: 95%;\n}\n.hero-title[data-v-1ae9e65b] { font-size: 1.8rem; margin-bottom: 1rem;\n}\n.hero-subtitle[data-v-1ae9e65b] { font-size: 1rem; margin-bottom: 2rem;\n}\n.section-title[data-v-1ae9e65b] { font-size: 1.8rem;\n}\n.section-subtitle[data-v-1ae9e65b] { font-size: 1rem;\n}\n.feature-card[data-v-1ae9e65b] { padding: 2rem 1.5rem;\n}\n.feature-icon-container[data-v-1ae9e65b] { width: 80px; height: 80px;\n}\n.feature-icon[data-v-1ae9e65b] { max-width: 40px;\n}\n.stat-minimal-item[data-v-1ae9e65b] { flex-direction: column; align-items: center; text-align: center; gap: 1rem;\n}\n.stat-minimal-icon[data-v-1ae9e65b] { padding-top: 0;\n}\n.stat-minimal-number[data-v-1ae9e65b] { font-size: 2.5rem; letter-spacing: -1px;\n}\n.stat-minimal-item[data-v-1ae9e65b]:hover { transform: translateY(-5px);\n}\n.news-card.featured .news-image-wrap[data-v-1ae9e65b] { height: 200px;\n}\n.news-body[data-v-1ae9e65b] { padding: 1.5rem;\n}\n.faq-question[data-v-1ae9e65b] { font-size: 1rem; padding-right: 1rem;\n}\n.faq-header[data-v-1ae9e65b] { padding: 1.25rem 1.5rem;\n}\n.faq-footer-card[data-v-1ae9e65b] { padding: 2rem 1.5rem;\n}\n.mb-25[data-v-1ae9e65b] { margin-bottom: 4rem !important;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_1ae9e65b_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_1ae9e65b_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_1ae9e65b_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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

/***/ "./resources/js/src/view/pages/Home.vue":
/*!**********************************************!*\
  !*** ./resources/js/src/view/pages/Home.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Home_vue_vue_type_template_id_1ae9e65b_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Home.vue?vue&type=template&id=1ae9e65b&scoped=true */ "./resources/js/src/view/pages/Home.vue?vue&type=template&id=1ae9e65b&scoped=true");
/* harmony import */ var _Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Home.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/Home.vue?vue&type=script&lang=js");
/* harmony import */ var _Home_vue_vue_type_style_index_0_id_1ae9e65b_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css */ "./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Home_vue_vue_type_template_id_1ae9e65b_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Home_vue_vue_type_template_id_1ae9e65b_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1ae9e65b",
  null
  
)

/* hot reload */
if (false) // removed by dead control flow
{ var api; }
component.options.__file = "resources/js/src/view/pages/Home.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/Home.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/Home.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_style_index_0_id_1ae9e65b_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=style&index=0&id=1ae9e65b&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/Home.vue?vue&type=template&id=1ae9e65b&scoped=true":
/*!****************************************************************************************!*\
  !*** ./resources/js/src/view/pages/Home.vue?vue&type=template&id=1ae9e65b&scoped=true ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_1ae9e65b_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_1ae9e65b_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_1ae9e65b_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Home.vue?vue&type=template&id=1ae9e65b&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/Home.vue?vue&type=template&id=1ae9e65b&scoped=true");


/***/ })

}]);