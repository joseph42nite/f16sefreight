"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_layouts_freight_AppShell_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_config_navigation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config/navigation */ "./resources/js/src/core/config/navigation.js");
/* harmony import */ var _core_services_store_context_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/store/context.module */ "./resources/js/src/core/services/store/context.module.js");
/* harmony import */ var _view_pages_freight_components_BellPanel_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/BellPanel.vue */ "./resources/js/src/view/pages/freight/components/BellPanel.vue");
/* harmony import */ var _view_pages_freight_components_VisualReporter_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/freight/components/VisualReporter.vue */ "./resources/js/src/view/pages/freight/components/VisualReporter.vue");
/* harmony import */ var _view_pages_freight_components_HelpAssistant_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/view/pages/freight/components/HelpAssistant.vue */ "./resources/js/src/view/pages/freight/components/HelpAssistant.vue");
/* harmony import */ var _view_layouts_freight_ProfileMenu_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/layouts/freight/ProfileMenu.vue */ "./resources/js/src/view/layouts/freight/ProfileMenu.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "AppShell",
  components: {
    BellPanel: _view_pages_freight_components_BellPanel_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    HelpAssistant: _view_pages_freight_components_HelpAssistant_vue__WEBPACK_IMPORTED_MODULE_4__["default"],
    VisualReporter: _view_pages_freight_components_VisualReporter_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    ProfileMenu: _view_layouts_freight_ProfileMenu_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
  },
  data: () => ({
    collapsed: false
  }),
  /* The shell is the first thing that needs to know who is looking at it, so a session
     that arrived without a stored context recovers here rather than drawing a rail with
     the role items missing. Does nothing on the normal path. */
  created() {
    this.$store.dispatch(_core_services_store_context_module__WEBPACK_IMPORTED_MODULE_1__.LOAD_CONTEXT);
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_6__.mapGetters)(["designation", "tier", "portal", "tierAtLeast"])), {}, {
    nav() {
      return (0,_core_config_navigation__WEBPACK_IMPORTED_MODULE_0__.visibleNavFor)({
        designation: this.designation,
        tier: this.tier,
        portalKey: this.portal ? this.portal.key : null,
        tierAtLeast: this.tierAtLeast
      });
    },
    portalGlyph() {
      return {
        air: "✈",
        sea: "⚓",
        road: "🚚"
      }[this.portal && this.portal.scope] || "●";
    }
  })
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/store/auth.module */ "./resources/js/src/core/services/store/auth.module.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



const PLANS = {
  core: "Core",
  tactical: "Tactical",
  command: "Command"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "ProfileMenu",
  data: () => ({
    open: false,
    profile: null,
    signingOut: false,
    name: null
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["designation", "tier", "currentUser"])), {}, {
    /** Their name, from the session or from /me on the first load. Never blank: the greeting reads as a greeting. */
    myName() {
      return this.name || this.currentUser && this.currentUser.name || this.designation || "there";
    },
    initials() {
      const name = this.myName || "?";
      return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
    },
    planLabel() {
      const tier = this.profile && this.profile.tier || this.tier;
      return PLANS[tier] || "—";
    }
  }),
  mounted() {
    document.addEventListener("click", this.closeOutside);
    // Settings says so when a person writes their own name in, so the greeting changes without a reload.
    window.addEventListener("f16s:profile-updated", this.fetchProfile);
    if (!(this.currentUser && this.currentUser.name)) this.fetchProfile();
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeOutside);
    window.removeEventListener("f16s:profile-updated", this.fetchProfile);
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open && !this.profile) this.fetchProfile();
    },
    fetchProfile() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/me").then(({
        data
      }) => {
        this.profile = data.profile;
        this.name = data.profile && data.profile.name || null;
      }).catch(() => {});
    },
    closeOutside(e) {
      if (this.open && !this.$el.contains(e.target)) this.open = false;
    },
    /** End the token on the server, forget it here, and go back to this portal's sign-in page. */
    signOut() {
      this.signingOut = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/user/logout", {}).catch(() => {}).then(() => this.$store.dispatch(_core_services_store_auth_module__WEBPACK_IMPORTED_MODULE_1__.LOGOUT)).then(() => this.$router.push("/sign-in").catch(() => {})).finally(() => {
        this.signingOut = false;
        this.open = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "BellPanel",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: () => ({
    rows: [],
    unread: 0,
    open: false,
    loading: false,
    busy: false
  }),
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_2__.mapGetters)(["designation"])), {}, {
    /* Only the owner grants a handover — operations may ask. The buttons are HIDDEN
       for anyone else (§8.1 role forbids -> hide), not disabled. */
    canDecide() {
      return this.designation === "pricing" || this.designation === "boss";
    },
    pinned() {
      return this.rows.filter(n => n.pinned);
    },
    /* Today / Yesterday / Earlier — §5.6. Grouping by day is what makes "is this new?"
       answerable at a glance without reading every timestamp. */
    chronological() {
      const rest = this.rows.filter(n => !n.pinned);
      const day = d => new Date(d).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      return [{
        label: "Today",
        rows: rest.filter(n => day(n.created_at) === today)
      }, {
        label: "Yesterday",
        rows: rest.filter(n => day(n.created_at) === yesterday)
      }, {
        label: "Earlier",
        rows: rest.filter(n => day(n.created_at) !== today && day(n.created_at) !== yesterday)
      }];
    }
  }),
  created() {
    this.load();
  },
  methods: {
    isClientUpdate(n) {
      return n.type === "ClientUpdateReady";
    },
    toggle() {
      this.open = !this.open;
      if (this.open) this.load();
    },
    load() {
      this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/notifications").then(({
        data
      }) => {
        this.rows = data.notifications || [];
        this.unread = data.unread || 0;
      })
      /* A bell that errors must not take the header down with it. */.catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    describe(n) {
      if (n.type.indexOf("Reassignment") !== -1) {
        return "Handover requested on " + (n.data.job_no || "a job");
      }
      if (n.type === "ThreadAssigned") {
        return (n.data.by || "A colleague") + " assigned you a conversation: " + (n.data.subject || "(no subject)");
      }
      return n.type.split("\\").pop().replace(/([a-z])([A-Z])/g, "$1 $2");
    },
    /** A notice about a conversation opens it. */
    goTo(n) {
      if ((n.type === "ThreadAssigned" || n.type === "ClientUpdateReady") && n.data.thread_id) {
        this.open = false;
        this.$router.push({
          path: "/inbox",
          query: {
            thread: n.data.thread_id
          }
        }).catch(() => {});
      }
    },
    markRead(n) {
      if (n.read_at) return;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/notifications/${n.id}/read`, {}).then(({
        data
      }) => {
        n.read_at = new Date().toISOString();
        this.unread = data.unread;
      }).catch(() => {});
    },
    decide(n, decision) {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post(`/jobs/${n.data.job_id}/reassign/resolve`, {
        decision
      })
      /* Reload rather than splice: the server decides what survives, and the row
         dissolving is the visible confirmation that it did. */.then(() => this.load()).catch(() => this.load()).finally(() => {
        this.busy = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_config_helpTargets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/config/helpTargets */ "./resources/js/src/core/config/helpTargets.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/**
 * The help copilot (PRD §5.10, user decisions 2026-09-14).
 *
 * 🔴 Answers come only from the help documents F16s uploads; when they do not cover the question it
 * says so and offers a ticket. "Show me" highlights the controls a document names as `[[name]]`
 * (see core/config/helpTargets.js) — the server has already dropped any name the documents do not use.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HelpAssistant",
  data: () => ({
    open: false,
    question: "",
    busy: false,
    turns: [],
    now: Date.now(),
    /** "help" answers from the documents; "chat" is the conversation with an F16s agent. */
    mode: "help",
    chat: null,
    chatDraft: "",
    chatBusy: false,
    chatError: null,
    chatTimer: null,
    badgeTimer: null
  }),
  computed: {
    unread() {
      return this.chat && !(this.open && this.mode === "chat") ? this.chat.unread || 0 : 0;
    }
  },
  created() {
    this.loadCurrentChat();
    // A reply can arrive while Help is closed: check now and then, for the badge.
    this.badgeTimer = setInterval(() => {
      if (!this.open) this.loadCurrentChat();
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.badgeTimer);
    clearInterval(this.chatTimer);
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open && this.chat && this.chat.unread) this.openChat();
    },
    loadCurrentChat() {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/support/chats/current").then(({
        data
      }) => {
        if (!data.chat) return;
        const known = this.chat && this.chat.id === data.chat.id ? this.chat.messages : [];
        this.chat = _objectSpread(_objectSpread({}, data.chat), {}, {
          messages: known
        });
      }).catch(() => {});
    },
    /** Connect to Support Agent: raises (or reopens) the chat ticket, with the help conversation so far. */
    connect() {
      this.chatBusy = true;
      this.chatError = null;
      const transcript = this.turns.filter(t => !t.pending).map(t => ({
        question: t.question,
        answer: t.answer || ""
      }));
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/support/chats", {
        route: this.$route ? this.$route.path : null,
        help_transcript: transcript.length ? transcript : undefined
      }).then(({
        data
      }) => {
        this.chat = data;
        this.openChat();
      }).catch(e => {
        this.chatError = this.errorText(e, "Could not reach the support team. Raise a ticket instead.");
      }).finally(() => {
        this.chatBusy = false;
      });
    },
    openChat() {
      this.mode = "chat";
      this.open = true;
      this.pollChat();
      clearInterval(this.chatTimer);
      // 🔴 Every 3 s while the chat is on screen (user's choice — no WebSockets yet).
      this.chatTimer = setInterval(() => {
        if (this.open && this.mode === "chat") this.pollChat();else clearInterval(this.chatTimer);
      }, 3000);
    },
    pollChat() {
      if (!this.chat) return;
      const last = this.chat.messages.length ? this.chat.messages[this.chat.messages.length - 1].id : 0;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/support/chats/" + this.chat.id + "/messages?after_id=" + last).then(({
        data
      }) => {
        if (data.messages.length) {
          this.chat.messages.push(...data.messages.filter(m => !this.chat.messages.some(k => k.id === m.id)));
          this.scrollChat();
        }
        this.chat.status = data.status;
        this.chat.unread = 0;
      }).catch(() => {});
    },
    sendChat() {
      const body = this.chatDraft.trim();
      if (!body || this.chatBusy || !this.chat) return;
      this.chatBusy = true;
      this.chatError = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/support/chats/" + this.chat.id + "/messages", {
        body
      }).then(({
        data
      }) => {
        this.chat.messages.push(data);
        this.chatDraft = "";
        this.scrollChat();
      }).catch(e => {
        this.chatError = this.errorText(e, "Not sent. Try again.");
      }).finally(() => {
        this.chatBusy = false;
      });
    },
    scrollChat() {
      this.$nextTick(() => {
        if (this.$refs.chatLog) this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight;
      });
    },
    errorText(e, fallback) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || fallback;
    },
    ask() {
      const question = this.question.trim();
      if (!question || this.busy) return;

      // The last three answered turns, so "and where is that?" is understood.
      const history = this.turns.filter(t => !t.pending && t.answered).slice(-3).map(t => ({
        question: t.question,
        answer: t.answer
      }));
      const turn = {
        question,
        pending: true,
        found: false,
        answer: "",
        steps: [],
        page: null,
        note: null,
        answered: false,
        startedAt: Date.now()
      };
      // A live count while it looks (economy first, fast fallback when slow).
      const ticker = setInterval(() => {
        this.now = Date.now();
        if (!turn.pending) clearInterval(ticker);
      }, 1000);
      this.turns.push(turn);
      this.question = "";
      this.busy = true;
      this.scrollDown();
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/help/ask", {
        question,
        route: this.$route ? this.$route.path : null,
        history
      }).then(({
        data
      }) => Object.assign(turn, {
        found: data.found,
        answer: data.answer,
        steps: data.steps || [],
        page: data.page,
        answered: true
      })).catch(e => {
        const d = e.response && e.response.data || {};
        Object.assign(turn, {
          found: false,
          answer: d.error || "Help could not answer just now. Try again, or raise a ticket."
        });
      }).finally(() => {
        turn.pending = false;
        this.busy = false;
        this.scrollDown();
      });
    },
    onPage(page) {
      return !!this.$route && this.$route.path.startsWith(page);
    },
    goTo(page) {
      this.$router.push(page).catch(() => {});
    },
    /**
     * The guided steps, on the page they belong to.
     *
     * ⚠️ A control can be on the page but not open yet — the Extraction panel lives in the workspace
     * drawer — so steps whose control is not on screen are skipped, and the note says so.
     */
    async showMe(turn) {
      if (turn.page && !this.onPage(turn.page)) {
        await this.$router.push(turn.page).catch(() => {});
      }
      const selector = s => '[data-help="' + s.target + '"]';
      const visible = await this.waitFor(turn.steps.map(selector));
      const steps = turn.steps.filter(s => visible.includes(selector(s)));
      turn.note = steps.length < turn.steps.length ? steps.length ? "Some steps are on a part of the page that is not open yet." : "Those controls are not on screen yet — open the part of the page the answer describes, then press Show me again." : null;
      if (!steps.length) return;
      const [{
        driver
      }] = await Promise.all([Promise.all(/*! import() | driver */[__webpack_require__.e("css/app"), __webpack_require__.e("driver")]).then(__webpack_require__.bind(__webpack_require__, /*! driver.js */ "./node_modules/driver.js/dist/driver.js.mjs")), Promise.all(/*! import() | driver */[__webpack_require__.e("css/app"), __webpack_require__.e("driver")]).then(__webpack_require__.bind(__webpack_require__, /*! driver.js/dist/driver.css */ "./node_modules/driver.js/dist/driver.css"))]);
      this.open = false;
      driver({
        showProgress: steps.length > 1,
        steps: steps.map((s, i) => ({
          element: selector(s),
          popover: {
            title: "Step " + (i + 1),
            description: this.readable(s.instruction)
          }
        }))
      }).drive();
    },
    /** Selectors that are on screen, waiting up to ~3 s for a page that is still rendering. */
    async waitFor(selectors) {
      for (let i = 0; i < 15; i += 1) {
        const found = selectors.filter(sel => document.querySelector(sel));
        if (found.length === selectors.length || i === 14) return found;
        await new Promise(r => setTimeout(r, 200));
      }
      return [];
    },
    /** `[[analyze-pdf]]` → "Analyze PDF button": the control's label from the list writers use. */
    readable(text) {
      return String(text || "").replace(/\[\[([a-z0-9-]+)\]\]/gi, (m, name) => {
        const target = _core_config_helpTargets__WEBPACK_IMPORTED_MODULE_1__.HELP_TARGETS.find(t => t.name === name.toLowerCase());
        return target ? "“" + target.label + "”" : name;
      });
    },
    raiseTicket() {
      const transcript = this.turns.filter(t => !t.pending).map(t => ({
        question: t.question,
        answer: t.answer || ""
      }));
      this.open = false;
      this.$emit("raise-ticket", transcript);
    },
    scrollDown() {
      this.$nextTick(() => {
        if (this.$refs.log) this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _core_services_console_recorder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/console.recorder */ "./resources/js/src/core/services/console.recorder.js");



/**
 * A CSS selector path for one element.
 *
 * ⚠️ Built by walking up from the clicked node, preferring an `id` and stopping the
 * moment the path is unique. A full body-to-leaf path is brittle — it breaks on the
 * next layout change and points a developer at nothing.
 */
function selectorFor(el) {
  if (!el || el === document.body) return "body";
  const parts = [];
  let node = el;
  while (node && node.nodeType === 1 && node !== document.body && parts.length < 6) {
    if (node.id) {
      parts.unshift("#" + node.id);
      break; // an id is unique; stop climbing
    }
    let part = node.tagName.toLowerCase();
    const cls = node.className && typeof node.className === "string" ? node.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : [];
    if (cls.length) part += "." + cls.join(".");
    const parent = node.parentElement;
    if (parent) {
      const sameTag = Array.prototype.filter.call(parent.children, c => c.tagName === node.tagName);
      if (sameTag.length > 1) part += ":nth-child(" + (Array.prototype.indexOf.call(parent.children, node) + 1) + ")";
    }
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "VisualReporter",
  data: () => ({
    picking: false,
    form: false,
    busy: false,
    sent: false,
    capturing: false,
    description: "",
    error: null,
    shot: null,
    shotError: null,
    captured: {
      route: "",
      element_selector: "",
      console_logs: []
    },
    /** The help assistant's conversation, when the ticket was raised from it (PRD §5.10). */
    transcript: [],
    highlighted: null
  }),
  beforeDestroy() {
    this.teardown();
  },
  methods: {
    /**
     * Raised from the help assistant: the same report, with the conversation attached.
     *
     * ⚠️ The page, element and logs are still captured by the browser, never written by the model.
     */
    reportWithConversation(transcript) {
      this.transcript = (transcript || []).slice(-20);
      this.startPicking();
    },
    startPicking() {
      this.picking = true;
      document.body.classList.add("fx-picking");
      document.addEventListener("mouseover", this.onHover, true);
      document.addEventListener("click", this.onPick, true);
    },
    teardown() {
      document.body.classList.remove("fx-picking");
      document.removeEventListener("mouseover", this.onHover, true);
      document.removeEventListener("click", this.onPick, true);
      if (this.highlighted) {
        this.highlighted.classList.remove("fx-picked");
        this.highlighted = null;
      }
    },
    /** The picking bar itself (its Cancel button) is not part of the page being reported. */
    onBanner(e) {
      return !!this.$refs.banner && this.$refs.banner.contains(e.target);
    },
    onHover(e) {
      if (this.onBanner(e)) return;
      if (this.highlighted) this.highlighted.classList.remove("fx-picked");
      this.highlighted = e.target;
      if (this.highlighted && this.highlighted.classList) this.highlighted.classList.add("fx-picked");
    },
    onPick(e) {
      // 🔴 The listener runs before any button, so without this Cancel was "picked" and took the screenshot.
      if (this.onBanner(e)) return;

      /* Stop the click reaching the app: the operator is pointing at a control, not
         pressing it, and firing it would change the very state being reported. */
      e.preventDefault();
      e.stopPropagation();
      const target = e.target;
      this.teardown();
      this.picking = false;
      this.captured = {
        route: this.$route ? this.$route.fullPath : window.location.pathname,
        element_selector: selectorFor(target),
        console_logs: _core_services_console_recorder__WEBPACK_IMPORTED_MODULE_1__["default"].entries()
      };

      // The page is captured BEFORE the form opens, or the screenshot shows the form over it.
      this.capturing = true;
      this.capture().finally(() => {
        if (this.capturing) this.form = true;
        this.capturing = false;
      });
    },
    /**
     * html2canvas, loaded ON DEMAND.
     *
     * ⚠️ It is a heavy dependency and almost nobody files a bug, so importing it at
     * boot would cost every session for the benefit of a few. A failed capture is
     * REPORTED and the ticket still sends — a screenshot is evidence, not a
     * precondition.
     */
    capture() {
      return __webpack_require__.e(/*! import() | html2canvas */ "html2canvas").then(__webpack_require__.t.bind(__webpack_require__, /*! html2canvas */ "./node_modules/html2canvas/dist/html2canvas.js", 23)).then(mod => (mod.default || mod)(document.body, {
        logging: false,
        scale: 0.5,
        // half scale: legible, and a fraction of the bytes
        useCORS: true
      })).then(canvas => {
        if (this.capturing) this.shot = canvas.toDataURL("image/jpeg", 0.7);
      }).catch(e => {
        this.shotError = "could not capture (" + (e.message || "unknown") + ")";
      });
    },
    send() {
      this.busy = true;
      this.error = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/tickets", {
        route: this.captured.route,
        description: this.description,
        element_selector: this.captured.element_selector,
        console_logs: this.captured.console_logs,
        help_transcript: this.transcript.length ? this.transcript : undefined
        /* The image is NOT posted: `support_tickets.screenshot_path` expects a path to
           object storage, and a multi-megabyte data URI in a VARCHAR(500) would be
           truncated into garbage. Upload lands with the storage decision — GAPS #35. */
      }).then(() => {
        this.sent = true;
        /* Cleared so the next report does not inherit this one's logs. */
        _core_services_console_recorder__WEBPACK_IMPORTED_MODULE_1__["default"].clear();
      }).catch(e => {
        const d = e.response && e.response.data || {};
        this.error = d.error || d.message || "Could not send the report.";
      }).finally(() => {
        this.busy = false;
      });
    },
    cancel() {
      this.teardown();
      this.picking = false;
      this.capturing = false;
      this.form = false;
      this.sent = false;
      this.description = "";
      this.shot = null;
      this.shotError = null;
      this.error = null;
      this.transcript = [];
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772 ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-shell",
    attrs: {
      "data-portal": _vm.portal && _vm.portal.key
    }
  }, [_c("a", {
    staticClass: "skip-to-content",
    attrs: {
      href: "#fx-main"
    }
  }, [_vm._v("Skip to content")]), _vm._v(" "), _c("aside", {
    staticClass: "fx-rail",
    class: {
      "is-collapsed": _vm.collapsed
    }
  }, [_c("div", {
    staticClass: "fx-rail__brand"
  }, [_c("span", {
    staticClass: "fx-rail__mark"
  }, [_vm._v("F16s")]), _vm._v(" "), _c("button", {
    staticClass: "fx-rail__toggle",
    attrs: {
      "aria-expanded": String(!_vm.collapsed),
      "aria-label": "Toggle navigation"
    },
    on: {
      click: function ($event) {
        _vm.collapsed = !_vm.collapsed;
      }
    }
  }, [_vm._v("‹")])]), _vm._v(" "), _c("nav", {
    staticClass: "fx-rail__nav",
    attrs: {
      "aria-label": "Main"
    }
  }, _vm._l(_vm.nav, function (item) {
    return _c("router-link", {
      key: item.path,
      staticClass: "fx-rail__item",
      class: {
        "is-locked": item.locked
      },
      attrs: {
        to: item.locked ? "/upgrade?from=" + encodeURIComponent(item.path) : item.path
      }
    }, [_c("span", {
      staticClass: "fx-rail__label"
    }, [_vm._v(_vm._s(item.label))]), _vm._v(" "), item.locked ? _c("span", {
      staticClass: "fx-rail__lock",
      attrs: {
        "aria-label": "Requires an upgrade"
      }
    }, [_vm._v("🔒")]) : _vm._e()]);
  }), 1), _vm._v(" "), _c("div", {
    staticClass: "fx-rail__foot"
  }, [_c("HelpAssistant", {
    on: {
      "raise-ticket": function ($event) {
        return _vm.$refs.reporter.reportWithConversation($event);
      }
    }
  }), _vm._v(" "), _c("VisualReporter", {
    ref: "reporter"
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "fx-body"
  }, [_c("header", {
    staticClass: "fx-header"
  }, [_vm.portal ? _c("span", {
    staticClass: "fx-portal-chip"
  }, [_vm._v("\n        " + _vm._s(_vm.portalGlyph) + " " + _vm._s(_vm.portal.label) + "\n      ")]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "fx-header__spacer"
  }), _vm._v(" "), _c("BellPanel"), _vm._v(" "), _c("ProfileMenu")], 1), _vm._v(" "), _c("main", {
    staticClass: "fx-main",
    attrs: {
      id: "fx-main"
    }
  }, [_c("router-view")], 1)])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=template&id=7008e995":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=template&id=7008e995 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "fx-profile"
  }, [_c("button", {
    staticClass: "fx-profile__trigger",
    attrs: {
      "aria-expanded": String(_vm.open),
      "aria-haspopup": "true"
    },
    on: {
      click: _vm.toggle
    }
  }, [_c("span", {
    staticClass: "fx-profile__avatar",
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v(_vm._s(_vm.initials))]), _vm._v(" "), _c("span", {
    staticClass: "fx-profile__role"
  }, [_vm._v("Hi, " + _vm._s(_vm.myName))]), _vm._v(" "), _c("span", {
    attrs: {
      "aria-hidden": "true"
    }
  }, [_vm._v("▾")])]), _vm._v(" "), _vm.open ? _c("div", {
    staticClass: "fx-profile__panel",
    attrs: {
      role: "menu"
    }
  }, [!_vm.profile ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : [_c("p", {
    staticClass: "fx-profile__name"
  }, [_vm._v(_vm._s(_vm.profile.name))]), _vm._v(" "), _c("p", {
    staticClass: "fx-muted fx-profile__email"
  }, [_vm._v(_vm._s(_vm.profile.email))]), _vm._v(" "), _c("dl", {
    staticClass: "fx-profile__facts"
  }, [_c("dt", [_vm._v("Role")]), _c("dd", [_vm._v(_vm._s(_vm.profile.designation || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Company")]), _c("dd", [_vm._v(_vm._s(_vm.profile.company || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Branch")]), _c("dd", [_vm._v(_vm._s(_vm.profile.branch || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Plan")]), _c("dd", [_c("span", {
    staticClass: "fx-profile__plan"
  }, [_vm._v(_vm._s(_vm.planLabel))])])])], _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-profile__signout",
    attrs: {
      role: "menuitem",
      disabled: _vm.signingOut
    },
    on: {
      click: _vm.signOut
    }
  }, [_vm._v("\n      " + _vm._s(_vm.signingOut ? "Signing out…" : "Sign out") + "\n    ")])], 2) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0 ***!
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
  return _c("div", {
    staticClass: "fx-bell"
  }, [_c("button", {
    staticClass: "fx-bell__trigger",
    attrs: {
      "aria-expanded": String(_vm.open),
      "aria-label": _vm.unread ? _vm.unread + " unread notifications" : "Notifications"
    },
    on: {
      click: _vm.toggle
    }
  }, [_vm._v("\n    🔔\n    "), _vm._v(" "), _vm.unread ? _c("span", {
    staticClass: "fx-bell__dot"
  }, [_vm._v(_vm._s(_vm.unread > 9 ? "9+" : _vm.unread))]) : _vm._e()]), _vm._v(" "), _vm.open ? _c("div", {
    staticClass: "fx-bell__panel",
    attrs: {
      role: "dialog",
      "aria-label": "Notifications"
    }
  }, [_c("header", {
    staticClass: "fx-bell__head"
  }, [_c("span", [_vm._v("Notifications")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      "aria-label": "Close"
    },
    on: {
      click: function ($event) {
        _vm.open = false;
      }
    }
  }, [_vm._v("✕")])]), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted fx-bell__pad"
  }, [_vm._v("Loading…")]) : !_vm.rows.length ? _c("p", {
    staticClass: "fx-muted fx-bell__pad"
  }, [_vm._v("Nothing waiting.")]) : _c("div", {
    staticClass: "fx-bell__list"
  }, [_vm.pinned.length ? [_c("p", {
    staticClass: "fx-bell__label"
  }, [_vm._v("Pinned")]), _vm._v(" "), _c("transition-group", {
    attrs: {
      name: "fx-bell-row",
      tag: "div"
    }
  }, _vm._l(_vm.pinned, function (n) {
    return _c("article", {
      key: n.id,
      staticClass: "fx-bell__row fx-bell__row--pinned",
      class: {
        "is-unread": !n.read_at
      }
    }, [_vm.isClientUpdate(n) ? [_c("p", {
      staticClass: "fx-bell__text"
    }, [_vm._v("Client update ready — " + _vm._s(n.data.title) + ": " + _vm._s(n.data.subject || "(no subject)"))]), _vm._v(" "), _c("p", {
      staticClass: "fx-bell__when"
    }, [_c("Figure", {
      attrs: {
        value: n.created_at,
        kind: "dateTime"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "fx-bell__actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      on: {
        click: function ($event) {
          return _vm.goTo(n);
        }
      }
    }, [_vm._v("Open conversation")])])] : [_c("p", {
      staticClass: "fx-bell__text"
    }, [_vm._v("\n                Handover requested on\n                "), _c("span", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(n.data.job_no || "a job"))])]), _vm._v(" "), _c("p", {
      staticClass: "fx-bell__when"
    }, [_c("Figure", {
      attrs: {
        value: n.created_at,
        kind: "dateTime"
      }
    })], 1)], _vm._v(" "), !_vm.isClientUpdate(n) && _vm.canDecide ? _c("div", {
      staticClass: "fx-bell__actions"
    }, [_c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.decide(n, "accept");
        }
      }
    }, [_vm._v("Accept")]), _vm._v(" "), _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.decide(n, "reject");
        }
      }
    }, [_vm._v("Reject")])]) : _vm._e()], 2);
  }), 0)] : _vm._e(), _vm._v(" "), _vm._l(_vm.chronological, function (group) {
    return [group.rows.length ? _c("p", {
      key: group.label,
      staticClass: "fx-bell__label"
    }, [_vm._v(_vm._s(group.label))]) : _vm._e(), _vm._v(" "), _vm._l(group.rows, function (n) {
      return _c("article", {
        key: n.id,
        staticClass: "fx-bell__row",
        class: {
          "is-unread": !n.read_at
        },
        on: {
          click: function ($event) {
            _vm.markRead(n);
            _vm.goTo(n);
          }
        }
      }, [_c("p", {
        staticClass: "fx-bell__text"
      }, [_vm._v(_vm._s(_vm.describe(n)))]), _vm._v(" "), _c("p", {
        staticClass: "fx-bell__when"
      }, [_c("Figure", {
        attrs: {
          value: n.created_at,
          kind: "dateTime"
        }
      })], 1)]);
    })];
  })], 2)]) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=template&id=ec86d528":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=template&id=ec86d528 ***!
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
  return _c("div", {
    staticClass: "fx-help"
  }, [_c("button", {
    staticClass: "fx-rail__item fx-help__launch",
    attrs: {
      "aria-label": "Help assistant",
      "data-help": "help-assistant",
      "aria-expanded": String(_vm.open)
    },
    on: {
      click: _vm.toggle
    }
  }, [_vm._m(0), _vm.unread ? _c("span", {
    staticClass: "fx-help__badge",
    attrs: {
      "aria-label": _vm.unread + " new support messages"
    }
  }, [_vm._v(_vm._s(_vm.unread))]) : _vm._e()]), _vm._v(" "), _vm.open ? _c("section", {
    staticClass: "fx-help__panel",
    attrs: {
      role: "dialog",
      "aria-label": "Help assistant"
    }
  }, [_c("header", {
    staticClass: "fx-help__head"
  }, [_c("strong", [_vm._v(_vm._s(_vm.mode === "chat" ? "Support chat" : "Help"))]), _vm._v(" "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v(_vm._s(_vm.mode === "chat" ? "" : "Ask how to do something in the portal"))]), _vm._v(" "), _vm.mode === "chat" ? _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: function ($event) {
        _vm.mode = "help";
      }
    }
  }, [_vm._v("Back to help")]) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      "aria-label": "Close help"
    },
    on: {
      click: function ($event) {
        _vm.open = false;
      }
    }
  }, [_vm._v("✕")])]), _vm._v(" "), _vm.mode === "chat" && _vm.chat ? [_c("ol", {
    ref: "chatLog",
    staticClass: "fx-help__log"
  }, _vm._l(_vm.chat.messages, function (m) {
    return _c("li", {
      key: m.id,
      staticClass: "fx-help__msg",
      class: "fx-help__msg--" + m.sender
    }, [_vm._v(_vm._s(m.body))]);
  }), 0), _vm._v(" "), _vm.chat.status !== "resolved" ? _c("form", {
    staticClass: "fx-help__ask",
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.sendChat.apply(null, arguments);
      }
    }
  }, [_c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.chatDraft,
      expression: "chatDraft"
    }],
    staticClass: "fx-input fx-help__input",
    attrs: {
      rows: "2",
      maxlength: "4000",
      placeholder: "Write to the support team",
      disabled: _vm.chatBusy
    },
    domProps: {
      value: _vm.chatDraft
    },
    on: {
      keydown: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        if ($event.ctrlKey || $event.shiftKey || $event.altKey || $event.metaKey) return null;
        $event.preventDefault();
        return _vm.sendChat.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.chatDraft = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.chatBusy || !_vm.chatDraft.trim()
    }
  }, [_vm._v("Send")])]) : _c("p", {
    staticClass: "fx-muted fx-help__closed"
  }, [_vm._v("This chat is closed. "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: _vm.connect
    }
  }, [_vm._v("Start a new chat")])]), _vm._v(" "), _vm.chatError ? _c("p", {
    staticClass: "fx-error fx-help__closed"
  }, [_vm._v(_vm._s(_vm.chatError))]) : _vm._e()] : [_c("ol", {
    ref: "log",
    staticClass: "fx-help__log"
  }, [!_vm.turns.length ? _c("li", {
    staticClass: "fx-muted fx-help__hint"
  }, [_vm._v("\n        For example: “An arrival notice came in — where do I enter it?”\n      ")]) : _vm._e(), _vm._v(" "), _vm._l(_vm.turns, function (t, i) {
    return _c("li", {
      key: i,
      staticClass: "fx-help__turn"
    }, [_c("p", {
      staticClass: "fx-help__question"
    }, [_vm._v(_vm._s(t.question))]), _vm._v(" "), t.pending ? _c("p", {
      staticClass: "fx-muted",
      attrs: {
        role: "status"
      }
    }, [_vm._v("Looking in the help documents… " + _vm._s(Math.max(0, Math.round((_vm.now - t.startedAt) / 1000))) + " s")]) : [_c("p", {
      staticClass: "fx-help__answer",
      class: {
        "fx-help__answer--unsure": !t.found
      }
    }, [_vm._v(_vm._s(_vm.readable(t.answer)))]), _vm._v(" "), _c("div", {
      staticClass: "fx-help__actions"
    }, [t.page && !_vm.onPage(t.page) ? _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: function ($event) {
          return _vm.goTo(t.page);
        }
      }
    }, [_vm._v("Go to page")]) : _vm._e(), _vm._v(" "), t.steps && t.steps.length ? _c("button", {
      staticClass: "fx-btn",
      on: {
        click: function ($event) {
          return _vm.showMe(t);
        }
      }
    }, [_vm._v("Show me")]) : _vm._e(), _vm._v(" "), !t.found ? _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: _vm.connect
      }
    }, [_vm._v("Talk to a support agent")]) : _vm._e(), _vm._v(" "), !t.found ? _c("button", {
      staticClass: "fx-btn fx-btn--ghost",
      on: {
        click: _vm.raiseTicket
      }
    }, [_vm._v("Raise a ticket")]) : _vm._e()]), _vm._v(" "), t.note ? _c("p", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(t.note))]) : _vm._e()]], 2);
  })], 2), _vm._v(" "), _c("form", {
    staticClass: "fx-help__ask",
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.ask.apply(null, arguments);
      }
    }
  }, [_c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.question,
      expression: "question"
    }],
    staticClass: "fx-input fx-help__input",
    attrs: {
      rows: "2",
      maxlength: "1000",
      placeholder: "Type your question",
      disabled: _vm.busy
    },
    domProps: {
      value: _vm.question
    },
    on: {
      keydown: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        if ($event.ctrlKey || $event.shiftKey || $event.altKey || $event.metaKey) return null;
        $event.preventDefault();
        return _vm.ask.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.question = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.question.trim()
    }
  }, [_vm._v("Ask")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-help__escalate"
  }, [_c("button", {
    staticClass: "fx-btn fx-btn--ghost fx-help__ticket",
    attrs: {
      disabled: _vm.chatBusy
    },
    on: {
      click: _vm.connect
    }
  }, [_vm._v("\n        " + _vm._s(_vm.chat && _vm.chat.status !== "resolved" ? "Open your support chat" : "Talk to a support agent") + "\n      ")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost fx-help__ticket",
    attrs: {
      "data-help": "report-problem"
    },
    on: {
      click: _vm.raiseTicket
    }
  }, [_vm._v("⚑ Raise a ticket · point at what's wrong")])]), _vm._v(" "), _vm.chatError ? _c("p", {
    staticClass: "fx-error fx-help__closed"
  }, [_vm._v(_vm._s(_vm.chatError))]) : _vm._e()]], 2) : _vm._e()]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("span", [_vm._v("💬 "), _c("span", {
    staticClass: "fx-rail__label"
  }, [_vm._v("Help")])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482 ***!
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
  return _c("div", [_vm.picking ? _c("div", {
    ref: "banner",
    staticClass: "fx-reporter__banner",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n    Click the thing that is wrong.\n    "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("Cancel")])]) : _vm._e(), _vm._v(" "), _vm.form ? _c("div", {
    staticClass: "fx-modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Report a problem"
    }
  }, [_c("div", {
    staticClass: "fx-modal__panel"
  }, [_c("header", {
    staticClass: "fx-modal__head"
  }, [_c("h2", {
    staticClass: "fx-modal__title"
  }, [_vm._v("Report a problem")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    attrs: {
      "aria-label": "Close"
    },
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("✕")])]), _vm._v(" "), _c("div", {
    staticClass: "fx-modal__body"
  }, [_c("dl", {
    staticClass: "fx-defs"
  }, [_c("dt", [_vm._v("Route")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.captured.route))]), _vm._v(" "), _c("dt", [_vm._v("Element")]), _vm._v(" "), _c("dd", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.captured.element_selector || "—"))]), _vm._v(" "), _c("dt", [_vm._v("Console")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.captured.console_logs.length) + " recent entries")]), _vm._v(" "), _c("dt", [_vm._v("Screenshot")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.shot ? "attached" : _vm.shotError || "not captured"))]), _vm._v(" "), _vm.transcript.length ? [_c("dt", [_vm._v("Help conversation")]), _vm._v(" "), _c("dd", [_vm._v(_vm._s(_vm.transcript.length) + " question(s) attached")])] : _vm._e()], 2), _vm._v(" "), _vm.shot ? _c("img", {
    staticClass: "fx-reporter__shot",
    attrs: {
      src: _vm.shot,
      alt: "Captured screenshot"
    }
  }) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "fx-field",
    staticStyle: {
      "margin-top": "var(--space-3)"
    }
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("What went wrong?")]), _vm._v(" "), _c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.description,
      expression: "description"
    }],
    staticClass: "fx-input fx-reporter__text",
    attrs: {
      rows: "4",
      placeholder: "What did you expect, and what happened instead?"
    },
    domProps: {
      value: _vm.description
    },
    on: {
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.description = $event.target.value;
      }
    }
  })]), _vm._v(" "), _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : _vm._e(), _vm._v(" "), _vm.sent ? _c("p", {
    staticClass: "fx-warn",
    attrs: {
      role: "status"
    }
  }, [_vm._v("\n          Reported. The support desk sees this with the route, the element and the logs.\n        ")]) : _vm._e()]), _vm._v(" "), _c("footer", {
    staticClass: "fx-modal__foot"
  }, [_c("button", {
    staticClass: "fx-btn",
    on: {
      click: _vm.cancel
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || _vm.sent || !_vm.description.trim()
    },
    on: {
      click: _vm.send
    }
  }, [_vm._v(_vm._s(_vm.busy ? "Sending…" : "Send report"))])])])]) : _vm._e()]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AppShell.vue?vue&type=template&id=4754a772 */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772");
/* harmony import */ var _AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AppShell.vue?vue&type=script&lang=js */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js");
/* harmony import */ var _AppShell_vue_vue_type_style_index_0_id_4754a772_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css */ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.render,
  _AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layouts/freight/AppShell.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/ProfileMenu.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/ProfileMenu.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProfileMenu_vue_vue_type_template_id_7008e995__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProfileMenu.vue?vue&type=template&id=7008e995 */ "./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=template&id=7008e995");
/* harmony import */ var _ProfileMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProfileMenu.vue?vue&type=script&lang=js */ "./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=script&lang=js");
/* harmony import */ var _ProfileMenu_vue_vue_type_style_index_0_id_7008e995_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css */ "./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ProfileMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProfileMenu_vue_vue_type_template_id_7008e995__WEBPACK_IMPORTED_MODULE_0__.render,
  _ProfileMenu_vue_vue_type_template_id_7008e995__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layouts/freight/ProfileMenu.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/BellPanel.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/BellPanel.vue ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BellPanel.vue?vue&type=template&id=039dade0 */ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0");
/* harmony import */ var _BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BellPanel.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.render,
  _BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/BellPanel.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/HelpAssistant.vue":
/*!**************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/HelpAssistant.vue ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _HelpAssistant_vue_vue_type_template_id_ec86d528__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HelpAssistant.vue?vue&type=template&id=ec86d528 */ "./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=template&id=ec86d528");
/* harmony import */ var _HelpAssistant_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HelpAssistant.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HelpAssistant_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _HelpAssistant_vue_vue_type_template_id_ec86d528__WEBPACK_IMPORTED_MODULE_0__.render,
  _HelpAssistant_vue_vue_type_template_id_ec86d528__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/HelpAssistant.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/VisualReporter.vue":
/*!***************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/VisualReporter.vue ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VisualReporter.vue?vue&type=template&id=4c94b482 */ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482");
/* harmony import */ var _VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VisualReporter.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.render,
  _VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/freight/components/VisualReporter.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProfileMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProfileMenu.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProfileMenu_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js":
/*!**********************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BellPanel.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=script&lang=js":
/*!**************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpAssistant_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HelpAssistant.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpAssistant_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js":
/*!***************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VisualReporter.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772 ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_template_id_4754a772__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=template&id=4754a772 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=template&id=4754a772");


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=template&id=7008e995":
/*!*********************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=template&id=7008e995 ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProfileMenu_vue_vue_type_template_id_7008e995__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProfileMenu_vue_vue_type_template_id_7008e995__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProfileMenu_vue_vue_type_template_id_7008e995__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProfileMenu.vue?vue&type=template&id=7008e995 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=template&id=7008e995");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0 ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_BellPanel_vue_vue_type_template_id_039dade0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BellPanel.vue?vue&type=template&id=039dade0 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/BellPanel.vue?vue&type=template&id=039dade0");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=template&id=ec86d528":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=template&id=ec86d528 ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpAssistant_vue_vue_type_template_id_ec86d528__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpAssistant_vue_vue_type_template_id_ec86d528__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HelpAssistant_vue_vue_type_template_id_ec86d528__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HelpAssistant.vue?vue&type=template&id=ec86d528 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/HelpAssistant.vue?vue&type=template&id=ec86d528");


/***/ }),

/***/ "./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482 ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VisualReporter_vue_vue_type_template_id_4c94b482__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VisualReporter.vue?vue&type=template&id=4c94b482 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/freight/components/VisualReporter.vue?vue&type=template&id=4c94b482");


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AppShell_vue_vue_type_style_index_0_id_4754a772_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/AppShell.vue?vue&type=style&index=0&id=4754a772&lang=css");


/***/ }),

/***/ "./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ProfileMenu_vue_vue_type_style_index_0_id_7008e995_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/freight/ProfileMenu.vue?vue&type=style&index=0&id=7008e995&lang=css");


/***/ })

}]);