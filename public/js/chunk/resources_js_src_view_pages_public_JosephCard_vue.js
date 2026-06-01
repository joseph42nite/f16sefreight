"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_public_JosephCard_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "JosephCard",
  metaInfo: function metaInfo() {
    return {
      title: "Joseph | CEO & Founder - F16s E-Freight Solutions",
      meta: [{
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      }, {
        name: "description",
        content: "Digital business card for Joseph, CEO & Founder of F16s E-Freight Solutions. Connect via WhatsApp, phone, email or LinkedIn instantly."
      }, {
        property: "og:title",
        content: "Joseph | CEO & Founder - F16s E-Freight Solutions"
      }, {
        property: "og:description",
        content: "Digital business card for Joseph. Click to save contact details instantly."
      }, {
        property: "og:type",
        content: "profile"
      }]
    };
  },
  data: function data() {
    return {
      phoneNumber: "7011363516",
      emailId: "joseph@f16sefreight.com",
      whatsappUrl: "https://wa.me/917011363516?text=Hi%20Joseph%2C%20I%20accessed%20your%20digital%20card%20and%20would%20like%20to%20connect.",
      shareModalOpen: false,
      emailModalOpen: false,
      copySuccess: false,
      emailCopySuccess: false,
      shareUrl: "",
      videoModalOpen: false,
      activeVideoTitle: "",
      activeVideoDesc: "",
      activeYoutubeEmbedUrl: ""
    };
  },
  computed: {
    qrImageUrl: function qrImageUrl() {
      var encodedUrl = encodeURIComponent(this.shareUrl);
      return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=".concat(encodedUrl, "&color=355594&bgcolor=ffffff&qzone=2");
    }
  },
  mounted: function mounted() {
    this.shareUrl = window.location.origin + "/joseph-ceo-938204719284";
    document.body.classList.add("digital-card-active");
  },
  destroyed: function destroyed() {
    document.body.classList.remove("digital-card-active");
  },
  methods: {
    handleLogoError: function handleLogoError(e) {
      e.target.src = "/media/assets/logos/blue-logo.png";
    },
    downloadVcf: function downloadVcf() {
      var vcard = ["BEGIN:VCARD", "VERSION:3.0", "N:Joseph CEO F16s;;;;", "FN:Joseph CEO F16s", "ORG:F16s E-Freight Solutions", "TITLE:CEO & Founder", "TEL;TYPE=CELL,VOICE;VALUE=uri:tel:+917011363516", "EMAIL;TYPE=PREF,INTERNET:joseph@f16sefreight.com", "URL:https://f16sefreight.com", "URL;type=LinkedIn:https://www.linkedin.com/in/joseph-george-b99616147/", "X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/joseph-george-b99616147/", "NOTE:Saved from F16s Digital Business Card.", "REV:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z", "END:VCARD"].join("\r\n");
      var blob = new Blob([vcard], {
        type: "text/vcard;charset=utf-8;"
      });
      var link = document.createElement("a");
      var url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "Joseph_CEO_F16s.vcf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    openShareModal: function openShareModal() {
      this.shareModalOpen = true;
      this.copySuccess = false;
    },
    closeShareModal: function closeShareModal() {
      this.shareModalOpen = false;
    },
    playVideo: function playVideo(type) {
      if (type === "walkthrough") {
        this.activeVideoTitle = "F16s Platform Walkthrough";
        this.activeVideoDesc = "Discover how F16s E-Freight Solutions provides direct airline integrations, automated manifest validations, and streamlined digital AWB management.";
        this.activeYoutubeEmbedUrl = "https://www.youtube.com/embed/6jisKtE_xww?autoplay=1&rel=0";
      } else {
        this.activeVideoTitle = "Focus Air Module Overview";
        this.activeVideoDesc = "Watch F16s Focus Air flagship module in action. See how forwarders book capacity and confirm EDI details in seconds.";
        this.activeYoutubeEmbedUrl = "https://www.youtube.com/embed/6jisKtE_xww?autoplay=1&rel=0&start=30";
      }
      this.videoModalOpen = true;
    },
    closeVideoModal: function closeVideoModal() {
      this.videoModalOpen = false;
      this.activeYoutubeEmbedUrl = ""; // Instantly silences audio and stops play
    },
    selectAllText: function selectAllText(event) {
      event.target.select();
    },
    copyLinkToClipboard: function copyLinkToClipboard() {
      var _this = this;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.shareUrl).then(function () {
          _this.showCopyFeedback();
        })["catch"](function () {
          _this.fallbackCopy();
        });
      } else {
        this.fallbackCopy();
      }
    },
    fallbackCopy: function fallbackCopy() {
      try {
        var input = this.$refs.shareUrlInput;
        input.select();
        document.execCommand("copy");
        this.showCopyFeedback();
      } catch (err) {
        console.error("Failed to copy link", err);
      }
    },
    showCopyFeedback: function showCopyFeedback() {
      var _this2 = this;
      this.copySuccess = true;
      setTimeout(function () {
        _this2.copySuccess = false;
      }, 2500);
    },
    openEmailModal: function openEmailModal() {
      this.emailModalOpen = true;
      this.emailCopySuccess = false;
    },
    closeEmailModal: function closeEmailModal() {
      this.emailModalOpen = false;
    },
    copyEmailToClipboard: function copyEmailToClipboard() {
      var _this3 = this;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.emailId).then(function () {
          _this3.showEmailCopyFeedback();
        })["catch"](function () {
          _this3.fallbackEmailCopy();
        });
      } else {
        this.fallbackEmailCopy();
      }
    },
    fallbackEmailCopy: function fallbackEmailCopy() {
      try {
        var input = this.$refs.emailIdInput;
        input.select();
        document.execCommand("copy");
        this.showEmailCopyFeedback();
      } catch (err) {
        console.error("Failed to copy email", err);
      }
    },
    showEmailCopyFeedback: function showEmailCopyFeedback() {
      var _this4 = this;
      this.emailCopySuccess = true;
      setTimeout(function () {
        _this4.emailCopySuccess = false;
      }, 2500);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=template&id=56100619&scoped=true":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=template&id=56100619&scoped=true ***!
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
  return _c("div", {
    staticClass: "card-page-wrapper"
  }, [_vm._m(0), _vm._v(" "), _vm._m(1), _vm._v(" "), _c("div", {
    staticClass: "digital-card-container"
  }, [_c("div", {
    staticClass: "card-cover-block"
  }, [_c("div", {
    staticClass: "flight-paths"
  }, [_c("svg", {
    staticClass: "flight-svg",
    attrs: {
      viewBox: "0 0 100 100",
      preserveAspectRatio: "none"
    }
  }, [_c("path", {
    attrs: {
      d: "M-10,80 Q50,-10 110,80",
      stroke: "rgba(255, 255, 255, 0.12)",
      "stroke-width": "0.5",
      fill: "none"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      d: "M-10,65 Q30,15 110,65",
      stroke: "rgba(255, 255, 255, 0.08)",
      "stroke-width": "0.3",
      fill: "none"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      d: "M-10,50 Q70,25 110,50",
      stroke: "rgba(255, 255, 255, 0.06)",
      "stroke-width": "0.2",
      fill: "none"
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "cover-plane-silhouette"
  }, [_c("svg", {
    staticClass: "plane-svg",
    attrs: {
      viewBox: "0 0 24 24"
    }
  }, [_c("path", {
    attrs: {
      fill: "rgba(255, 255, 255, 0.06)",
      d: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l7 2.5z"
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "profile-strip-header"
  }, [_vm._m(2), _vm._v(" "), _c("div", {
    staticClass: "strip-info"
  }, [_c("div", {
    staticClass: "strip-name-row"
  }, [_c("span", {
    staticClass: "strip-username"
  }, [_vm._v("@joseph_ceo")]), _vm._v(" "), _c("svg", {
    staticClass: "verified-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    }
  })])]), _vm._v(" "), _c("span", {
    staticClass: "strip-subtitle"
  }, [_vm._v("CEO & Founder | F16s E-Freight")])])]), _vm._v(" "), _c("div", {
    staticClass: "floating-brand-logo"
  }, [_c("router-link", {
    attrs: {
      to: "/"
    }
  }, [_c("img", {
    staticClass: "cover-brand-logo",
    attrs: {
      src: "/media/assets/logos/white-logo.png",
      alt: "F16s"
    },
    on: {
      error: _vm.handleLogoError
    }
  })])], 1)]), _vm._v(" "), _c("div", {
    staticClass: "lower-glass-panel"
  }, [_c("div", {
    staticClass: "floating-quotes-badge"
  }, [_c("svg", {
    staticClass: "badge-icon-svg",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("path", {
    attrs: {
      d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    }
  })])]), _vm._v(" "), _vm._m(3), _vm._v(" "), _c("div", {
    staticClass: "circle-actions-row"
  }, [_c("a", {
    staticClass: "circle-action-item whatsapp-accent",
    attrs: {
      href: _vm.whatsappUrl,
      target: "_blank",
      title: "Chat on WhatsApp"
    }
  }, [_c("svg", {
    staticClass: "circle-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M12.012 2C6.48 2 2 6.48 2 12.012c0 2.112.66 4.104 1.896 5.796L2.504 22l4.356-1.392c1.62.996 3.516 1.524 5.472 1.524 5.532 0 10.008-4.476 10.008-10.012C22.34 6.476 17.544 2 12.012 2zm6.276 14.196c-.288.792-1.428 1.452-1.956 1.5-1.476.132-3.264-.396-5.832-2.964-2.58-2.568-3.12-4.344-3.012-5.82.048-.528.696-1.68 1.5-1.944.252-.084.516-.132.78-.132.204 0 .42.012.6.12.18.108.348.372.48.648.336.708.828 1.956.888 2.088.072.132.096.3.012.48-.084.18-.18.3-.3.42-.12.132-.252.228-.36.36-.12.12-.252.252-.108.492.3.492.792 1.008 1.344 1.488.72.636 1.332.996 1.836 1.2.288.12.456.048.588-.084.168-.18.72-.84.912-1.128.216-.3.432-.24.72-.132.288.108 1.824.864 2.136 1.02.312.156.516.24.6.384.084.144.084.816-.204 1.608z"
    }
  })])]), _vm._v(" "), _c("a", {
    staticClass: "circle-action-item default-accent",
    attrs: {
      href: "tel:" + _vm.phoneNumber,
      title: "Call CEO"
    }
  }, [_c("svg", {
    staticClass: "circle-icon-stroke",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("path", {
    attrs: {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
    }
  })])]), _vm._v(" "), _c("button", {
    staticClass: "circle-action-item default-accent",
    attrs: {
      title: "Send Email"
    },
    on: {
      click: _vm.openEmailModal
    }
  }, [_c("svg", {
    staticClass: "circle-icon-stroke",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("path", {
    attrs: {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }
  }), _vm._v(" "), _c("polyline", {
    attrs: {
      points: "22,6 12,13 2,6"
    }
  })])]), _vm._v(" "), _c("a", {
    staticClass: "circle-action-item linkedin-accent",
    attrs: {
      href: "https://www.linkedin.com/in/joseph-george-b99616147/",
      target: "_blank",
      title: "LinkedIn Profile"
    }
  }, [_c("svg", {
    staticClass: "circle-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
    }
  })])]), _vm._v(" "), _c("button", {
    staticClass: "circle-action-item share-accent",
    attrs: {
      title: "Share Card"
    },
    on: {
      click: _vm.openShareModal
    }
  }, [_c("svg", {
    staticClass: "circle-icon-stroke",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("circle", {
    attrs: {
      cx: "18",
      cy: "5",
      r: "3"
    }
  }), _vm._v(" "), _c("circle", {
    attrs: {
      cx: "6",
      cy: "12",
      r: "3"
    }
  }), _vm._v(" "), _c("circle", {
    attrs: {
      cx: "18",
      cy: "19",
      r: "3"
    }
  }), _vm._v(" "), _c("line", {
    attrs: {
      x1: "8.59",
      y1: "13.51",
      x2: "15.42",
      y2: "17.49"
    }
  }), _vm._v(" "), _c("line", {
    attrs: {
      x1: "15.41",
      y1: "6.51",
      x2: "8.59",
      y2: "10.49"
    }
  })])])]), _vm._v(" "), _c("div", {
    staticClass: "ultimate-cta-container"
  }, [_c("button", {
    staticClass: "btn-save-premium",
    on: {
      click: _vm.downloadVcf
    }
  }, [_c("svg", {
    staticClass: "btn-save-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("path", {
    attrs: {
      d: "M19 13V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V13"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      d: "M7 10L12 15L17 10"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      d: "M12 15V3"
    }
  })]), _vm._v("\n          Save Contact Card\n        ")])]), _vm._v(" "), _c("div", {
    staticClass: "video-insights-section"
  }, [_vm._m(4), _vm._v(" "), _c("div", {
    staticClass: "video-playlist"
  }, [_c("div", {
    staticClass: "video-card-item",
    on: {
      click: function click($event) {
        return _vm.playVideo("walkthrough");
      }
    }
  }, [_c("div", {
    staticClass: "video-thumbnail-wrapper"
  }, [_c("img", {
    staticClass: "video-thumbnail-img",
    attrs: {
      src: "https://img.youtube.com/vi/6jisKtE_xww/hqdefault.jpg",
      alt: "F16s Platform Overview"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "video-play-overlay"
  }, [_c("div", {
    staticClass: "play-btn-circle"
  }, [_c("svg", {
    staticClass: "play-arrow-svg",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M8 5v14l11-7z"
    }
  })])])]), _vm._v(" "), _c("span", {
    staticClass: "video-duration-badge"
  }, [_vm._v("YouTube")])]), _vm._v(" "), _vm._m(5)]), _vm._v(" "), _c("div", {
    staticClass: "video-card-item",
    on: {
      click: function click($event) {
        return _vm.playVideo("air");
      }
    }
  }, [_c("div", {
    staticClass: "video-thumbnail-wrapper"
  }, [_c("img", {
    staticClass: "video-thumbnail-img",
    attrs: {
      src: "https://img.youtube.com/vi/6jisKtE_xww/hqdefault.jpg",
      alt: "Focus Air in Action"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "video-play-overlay"
  }, [_c("div", {
    staticClass: "play-btn-circle"
  }, [_c("svg", {
    staticClass: "play-arrow-svg",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M8 5v14l11-7z"
    }
  })])])]), _vm._v(" "), _c("span", {
    staticClass: "video-duration-badge"
  }, [_vm._v("YouTube")])]), _vm._v(" "), _vm._m(6)])])]), _vm._v(" "), _c("div", {
    staticClass: "services-modern-section-mobile"
  }, [_vm._m(7), _vm._v(" "), _c("div", {
    staticClass: "services-modern-grid-mobile"
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
          staticClass: "service-product-card-premium",
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
            src: "/media/assets/banners/banner-plane.webp",
            alt: "FOCUS AIR",
            loading: "lazy"
          }
        })]), _vm._v(" "), _c("div", {
          staticClass: "service-product-info"
        }, [_c("h3", {
          staticClass: "service-product-title"
        }, [_vm._v("FOCUS AIR")]), _vm._v(" "), _c("p", {
          staticClass: "service-product-desc"
        }, [_vm._v("The gold standard in air freight automation. Instant AWB generation, real-time EDI connectivity, and automated status updates.")]), _vm._v(" "), _c("button", {
          staticClass: "hero-btn-premium"
        }, [_c("span", [_vm._v("Explore More")]), _vm._v(" "), _c("div", {
          staticClass: "btn-icon-premium"
        }, [_c("svg", {
          staticClass: "arrow-svg",
          attrs: {
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "3"
          }
        }, [_c("line", {
          attrs: {
            x1: "5",
            y1: "12",
            x2: "19",
            y2: "12"
          }
        }), _vm._v(" "), _c("polyline", {
          attrs: {
            points: "12 5 19 12 12 19"
          }
        })])])])])])];
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
          staticClass: "service-product-card-premium is-coming-soon",
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
            src: "/media/assets/banners/banner-ship.webp",
            alt: "FOCUS SEA",
            loading: "lazy"
          }
        })]), _vm._v(" "), _c("div", {
          staticClass: "service-product-info"
        }, [_c("h3", {
          staticClass: "service-product-title"
        }, [_vm._v("FOCUS SEA")]), _vm._v(" "), _c("p", {
          staticClass: "service-product-desc"
        }, [_vm._v("Streamlined ocean freight documentation and container tracking. Manage every wave of your sea logistics with one-click efficiency.")]), _vm._v(" "), _c("button", {
          staticClass: "service-product-btn-premium",
          attrs: {
            disabled: ""
          }
        }, [_c("span", [_vm._v("Coming Soon")])])])])];
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
          staticClass: "service-product-card-premium is-coming-soon",
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
            src: "/media/assets/banners/banner-truck.webp",
            alt: "FOCUS ROAD",
            loading: "lazy"
          }
        })]), _vm._v(" "), _c("div", {
          staticClass: "service-product-info"
        }, [_c("h3", {
          staticClass: "service-product-title"
        }, [_vm._v("FOCUS ROAD")]), _vm._v(" "), _c("p", {
          staticClass: "service-product-desc"
        }, [_vm._v("Simplified road transportation management. Handle local trucking and cross-border freight with powerful dispatching tools.")]), _vm._v(" "), _c("button", {
          staticClass: "service-product-btn-premium",
          attrs: {
            disabled: ""
          }
        }, [_c("span", [_vm._v("Coming Soon")])])])])];
      }
    }])
  })], 1)]), _vm._v(" "), _vm._m(8)])]), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.shareModalOpen ? _c("div", {
    staticClass: "modal-overlay",
    on: {
      click: function click($event) {
        if ($event.target !== $event.currentTarget) return null;
        return _vm.closeShareModal.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "modal-body-glass"
  }, [_c("button", {
    staticClass: "modal-close-btn",
    on: {
      click: _vm.closeShareModal
    }
  }, [_vm._v("×")]), _vm._v(" "), _c("h3", {
    staticClass: "modal-title"
  }, [_vm._v("Share Card")]), _vm._v(" "), _c("p", {
    staticClass: "modal-subtitle"
  }, [_vm._v("Scan to instantly open on another phone")]), _vm._v(" "), _c("div", {
    staticClass: "qr-container-box"
  }, [_c("img", {
    staticClass: "qr-code-img",
    attrs: {
      src: _vm.qrImageUrl,
      alt: "QR Code"
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "copy-action-box"
  }, [_c("input", {
    ref: "shareUrlInput",
    staticClass: "copy-input",
    attrs: {
      type: "text",
      readonly: ""
    },
    domProps: {
      value: _vm.shareUrl
    },
    on: {
      click: _vm.selectAllText
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "copy-btn",
    "class": {
      "copied-success": _vm.copySuccess
    },
    on: {
      click: _vm.copyLinkToClipboard
    }
  }, [!_vm.copySuccess ? _c("span", [_vm._v("Copy Link")]) : _c("span", {
    staticClass: "copied-indicator"
  }, [_c("svg", {
    staticClass: "check-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "3"
    }
  }, [_c("polyline", {
    attrs: {
      points: "20 6 9 17 4 12"
    }
  })]), _vm._v("\n              Copied!\n            ")])])])])]) : _vm._e()]), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.videoModalOpen ? _c("div", {
    staticClass: "modal-overlay",
    on: {
      click: function click($event) {
        if ($event.target !== $event.currentTarget) return null;
        return _vm.closeVideoModal.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "video-modal-body"
  }, [_c("button", {
    staticClass: "modal-close-btn",
    on: {
      click: _vm.closeVideoModal
    }
  }, [_vm._v("×")]), _vm._v(" "), _c("h3", {
    staticClass: "video-modal-title"
  }, [_vm._v(_vm._s(_vm.activeVideoTitle))]), _vm._v(" "), _c("div", {
    staticClass: "video-player-container"
  }, [_vm.activeYoutubeEmbedUrl ? _c("iframe", {
    staticClass: "youtube-iframe-player",
    attrs: {
      src: _vm.activeYoutubeEmbedUrl,
      title: "F16s Corporate Video",
      frameborder: "0",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowfullscreen: ""
    }
  }) : _c("div", {
    staticClass: "premium-player-mock"
  }, [_c("div", {
    staticClass: "player-glow"
  }), _vm._v(" "), _c("div", {
    staticClass: "player-visual-content"
  }, [_c("svg", {
    staticClass: "player-loader-icon animate-spin",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor"
    }
  }, [_c("circle", {
    attrs: {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-dasharray": "30 10"
    }
  })]), _vm._v(" "), _c("span", {
    staticClass: "player-loading-text"
  }, [_vm._v("Loading YouTube Stream...")])])])]), _vm._v(" "), _c("p", {
    staticClass: "video-modal-desc"
  }, [_vm._v(_vm._s(_vm.activeVideoDesc))])])]) : _vm._e()]), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade"
    }
  }, [_vm.emailModalOpen ? _c("div", {
    staticClass: "modal-overlay",
    on: {
      click: function click($event) {
        if ($event.target !== $event.currentTarget) return null;
        return _vm.closeEmailModal.apply(null, arguments);
      }
    }
  }, [_c("div", {
    staticClass: "modal-body-glass email-modal-card"
  }, [_c("button", {
    staticClass: "modal-close-btn",
    on: {
      click: _vm.closeEmailModal
    }
  }, [_vm._v("×")]), _vm._v(" "), _c("h3", {
    staticClass: "modal-title"
  }, [_vm._v("Send Email")]), _vm._v(" "), _c("p", {
    staticClass: "modal-subtitle"
  }, [_vm._v("Connect with Joseph George")]), _vm._v(" "), _c("div", {
    staticClass: "email-display-container"
  }, [_c("span", {
    staticClass: "email-icon-badge"
  }, [_c("svg", {
    staticClass: "badge-svg",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("path", {
    attrs: {
      d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
    }
  }), _vm._v(" "), _c("polyline", {
    attrs: {
      points: "22,6 12,13 2,6"
    }
  })])]), _vm._v(" "), _c("input", {
    ref: "emailIdInput",
    staticClass: "email-address-text",
    attrs: {
      type: "text",
      readonly: ""
    },
    domProps: {
      value: _vm.emailId
    },
    on: {
      click: _vm.selectAllText
    }
  })]), _vm._v(" "), _c("div", {
    staticClass: "email-actions-grid"
  }, [_c("button", {
    staticClass: "email-action-option copy-option",
    "class": {
      "copied-success": _vm.emailCopySuccess
    },
    on: {
      click: _vm.copyEmailToClipboard
    }
  }, [_c("span", {
    staticClass: "option-icon"
  }, [!_vm.emailCopySuccess ? _c("svg", {
    staticClass: "action-icon-svg",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("rect", {
    attrs: {
      x: "9",
      y: "9",
      width: "13",
      height: "13",
      rx: "2",
      ry: "2"
    }
  }), _vm._v(" "), _c("path", {
    attrs: {
      d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
    }
  })]) : _c("svg", {
    staticClass: "action-icon-svg success-color",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "3"
    }
  }, [_c("polyline", {
    attrs: {
      points: "20 6 9 17 4 12"
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "option-text-group"
  }, [!_vm.emailCopySuccess ? _c("span", {
    staticClass: "option-label"
  }, [_vm._v("Copy Email Address")]) : _c("span", {
    staticClass: "option-label success-color"
  }, [_vm._v("Email Address Copied!")]), _vm._v(" "), _c("span", {
    staticClass: "option-desc"
  }, [_vm._v("Copy to your clipboard")])])]), _vm._v(" "), _c("a", {
    staticClass: "email-action-option gmail-option",
    attrs: {
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=" + _vm.emailId,
      target: "_blank"
    },
    on: {
      click: _vm.closeEmailModal
    }
  }, [_c("span", {
    staticClass: "option-icon"
  }, [_c("svg", {
    staticClass: "action-icon-svg gmail-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "option-text-group"
  }, [_c("span", {
    staticClass: "option-label"
  }, [_vm._v("Compose in Gmail")]), _vm._v(" "), _c("span", {
    staticClass: "option-desc"
  }, [_vm._v("Launch Gmail in browser/app")])])]), _vm._v(" "), _c("a", {
    staticClass: "email-action-option outlook-option",
    attrs: {
      href: "https://outlook.live.com/default.aspx?rru=compose&to=" + _vm.emailId,
      target: "_blank"
    },
    on: {
      click: _vm.closeEmailModal
    }
  }, [_c("span", {
    staticClass: "option-icon"
  }, [_c("svg", {
    staticClass: "action-icon-svg outlook-icon",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }
  }, [_c("path", {
    attrs: {
      d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 0 1-.2-.25V6.8l7.25 4.53a1 1 0 0 0 1.1 0L19.8 6.8v1.2c-.1.1-.2.15-.4.25z"
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "option-text-group"
  }, [_c("span", {
    staticClass: "option-label"
  }, [_vm._v("Compose in Outlook")]), _vm._v(" "), _c("span", {
    staticClass: "option-desc"
  }, [_vm._v("Launch Outlook Web composer")])])]), _vm._v(" "), _c("a", {
    staticClass: "email-action-option default-option",
    attrs: {
      href: "mailto:" + _vm.emailId
    },
    on: {
      click: _vm.closeEmailModal
    }
  }, [_c("span", {
    staticClass: "option-icon"
  }, [_c("svg", {
    staticClass: "action-icon-stroke",
    attrs: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2.5"
    }
  }, [_c("line", {
    attrs: {
      x1: "22",
      y1: "2",
      x2: "11",
      y2: "13"
    }
  }), _vm._v(" "), _c("polygon", {
    attrs: {
      points: "22 2 15 22 11 13 2 9 22 2"
    }
  })])]), _vm._v(" "), _c("div", {
    staticClass: "option-text-group"
  }, [_c("span", {
    staticClass: "option-label"
  }, [_vm._v("Default Mail Client")]), _vm._v(" "), _c("span", {
    staticClass: "option-desc"
  }, [_vm._v("Open native mail application")])])])])])]) : _vm._e()])], 1);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "watermark-bg"
  }, [_c("div", {
    staticClass: "watermark-row row-1"
  }, [_vm._v("E-Freight")]), _vm._v(" "), _c("div", {
    staticClass: "watermark-row row-2"
  }, [_vm._v("Logistics")]), _vm._v(" "), _c("div", {
    staticClass: "watermark-row row-3"
  }, [_vm._v("F16s")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "decorative-ellipses"
  }, [_c("div", {
    staticClass: "ellipse ellipse-tl"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-tr"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-br"
  }), _vm._v(" "), _c("div", {
    staticClass: "ellipse ellipse-mid"
  })]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "strip-avatar"
  }, [_c("span", {
    staticClass: "strip-initials"
  }, [_vm._v("J")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "editorial-text-block"
  }, [_c("h2", {
    staticClass: "editorial-name"
  }, [_vm._v("Joseph George")]), _vm._v(" "), _c("p", {
    staticClass: "editorial-role"
  }, [_vm._v("CEO & Founder")]), _vm._v(" "), _c("div", {
    staticClass: "horizontal-divider"
  }), _vm._v(" "), _c("p", {
    staticClass: "editorial-quote"
  }, [_vm._v('\n          "Delivering synchronized, future-ready logistics documentation and seamless airline connectivity globally."\n        ')])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "widget-header"
  }, [_c("span", {
    staticClass: "widget-eyebrow"
  }, [_vm._v("Video Insights")]), _vm._v(" "), _c("h4", {
    staticClass: "widget-title"
  }, [_vm._v("Learn more about F16s")]), _vm._v(" "), _c("p", {
    staticClass: "section-subtitle-mini"
  }, [_vm._v("Watch quick walk-throughs on YouTube.")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "video-card-info"
  }, [_c("h5", {
    staticClass: "video-card-title"
  }, [_vm._v("F16s Platform Walkthrough")]), _vm._v(" "), _c("p", {
    staticClass: "video-card-desc"
  }, [_vm._v("Watch how our automated E-Freight systems manage airway bills, link HAWB to MAWB, and streamline logistics.")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "video-card-info"
  }, [_c("h5", {
    staticClass: "video-card-title"
  }, [_vm._v("Focus Air Module Overview")]), _vm._v(" "), _c("p", {
    staticClass: "video-card-desc"
  }, [_vm._v("See the real-time EDI airline connectivity, automated confirmations, and validation features in action.")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "widget-header"
  }, [_c("span", {
    staticClass: "widget-eyebrow"
  }, [_vm._v("Expertise")]), _vm._v(" "), _c("h4", {
    staticClass: "widget-title"
  }, [_vm._v("Specialized Logistics Services")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "minimal-footer text-center"
  }, [_c("span", {
    staticClass: "footer-tagline"
  }, [_vm._v("Empowering Global Trade Digitally")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/public/JosephCard.vue":
/*!***********************************************************!*\
  !*** ./resources/js/src/view/pages/public/JosephCard.vue ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _JosephCard_vue_vue_type_template_id_56100619_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JosephCard.vue?vue&type=template&id=56100619&scoped=true */ "./resources/js/src/view/pages/public/JosephCard.vue?vue&type=template&id=56100619&scoped=true");
/* harmony import */ var _JosephCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JosephCard.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/public/JosephCard.vue?vue&type=script&lang=js");
/* harmony import */ var _JosephCard_vue_vue_type_style_index_0_id_56100619_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css */ "./resources/js/src/view/pages/public/JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _JosephCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _JosephCard_vue_vue_type_template_id_56100619_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _JosephCard_vue_vue_type_template_id_56100619_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "56100619",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/public/JosephCard.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/JosephCard.vue?vue&type=script&lang=js":
/*!***********************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/JosephCard.vue?vue&type=script&lang=js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JosephCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JosephCard.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JosephCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/JosephCard.vue?vue&type=template&id=56100619&scoped=true":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/JosephCard.vue?vue&type=template&id=56100619&scoped=true ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JosephCard_vue_vue_type_template_id_56100619_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JosephCard_vue_vue_type_template_id_56100619_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JosephCard_vue_vue_type_template_id_56100619_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JosephCard.vue?vue&type=template&id=56100619&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=template&id=56100619&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JosephCard_vue_vue_type_style_index_0_id_56100619_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/JosephCard.vue?vue&type=style&index=0&id=56100619&scoped=true&lang=css");


/***/ })

}]);