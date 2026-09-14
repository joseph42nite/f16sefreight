"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_SupportDeskTickets_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/pages/freight/components/Figure.vue */ "./resources/js/src/view/pages/freight/components/Figure.vue");
/* harmony import */ var _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/freight/components/StatusChip.vue */ "./resources/js/src/view/pages/freight/components/StatusChip.vue");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SupportDeskTickets",
  components: {
    Figure: _view_pages_freight_components_Figure_vue__WEBPACK_IMPORTED_MODULE_1__["default"],
    StatusChip: _view_pages_freight_components_StatusChip_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: () => ({
    tickets: [],
    status: "",
    loading: true,
    busy: false,
    error: null,
    /** The chat open beside the queue: { ticket, status, messages }. */
    chat: null,
    draft: "",
    chatTimer: null,
    queueTimer: null
  }),
  created() {
    this.load();
    // New chats and new client messages show up without a manual refresh.
    this.queueTimer = setInterval(() => {
      if (!this.busy) this.load(true);
    }, 15000);
  },
  beforeDestroy() {
    clearInterval(this.queueTimer);
    clearInterval(this.chatTimer);
  },
  methods: {
    openChat(ticket) {
      this.chat = {
        ticket,
        status: ticket.status,
        messages: []
      };
      this.pollChat();
      clearInterval(this.chatTimer);
      // 🔴 Every 3 s while the chat is open (user's choice — no WebSockets yet).
      this.chatTimer = setInterval(() => this.pollChat(), 3000);
    },
    closeChat() {
      clearInterval(this.chatTimer);
      this.chat = null;
      this.load();
    },
    pollChat() {
      if (!this.chat) return;
      const chat = this.chat;
      const last = chat.messages.length ? chat.messages[chat.messages.length - 1].id : 0;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/admin/tickets/" + chat.ticket.id + "/messages?after_id=" + last).then(({
        data
      }) => {
        if (data.messages.length) {
          chat.messages.push(...data.messages.filter(m => !chat.messages.some(k => k.id === m.id)));
          this.$nextTick(() => {
            if (this.$refs.chatLog) this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight;
          });
        }
        chat.status = data.status;
      }).catch(e => {
        this.error = this.readable(e);
      });
    },
    reply() {
      const body = this.draft.trim();
      if (!body || this.busy || !this.chat) return;
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post("/admin/tickets/" + this.chat.ticket.id + "/messages", {
        body
      }).then(({
        data
      }) => {
        this.chat.messages.push(data);
        if (this.chat.status === "open") this.chat.status = "investigating";
        this.draft = "";
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    resolveChat() {
      const ticket = this.chat.ticket;
      const steps = this.chat.status === "open" ? ["investigating", "resolved"] : ["resolved"];
      this.busy = true;
      steps.reduce((p, status) => p.then(() => _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].patch("/admin/tickets", ticket.id, {
        status
      })), Promise.resolve()).then(() => this.pollChat()).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    load(quiet = false) {
      if (!quiet) this.loading = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/admin/tickets" + (this.status ? "?status=" + this.status : "")).then(({
        data
      }) => {
        this.tickets = data.data || [];
        this.error = null;
      }).catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.loading = false;
      });
    },
    advance(ticket, status) {
      this.busy = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].patch("/admin/tickets", ticket.id, {
        status
      }).then(() => this.load())
      /* §11.3 the server's reason verbatim — a backwards transition explains itself. */.catch(e => {
        this.error = this.readable(e);
      }).finally(() => {
        this.busy = false;
      });
    },
    readable(e) {
      const d = e.response && e.response.data || {};
      return d.error || d.message || "Something went wrong.";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=template&id=69a578fb":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=template&id=69a578fb ***!
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
  return _c("div", {
    staticClass: "fx-admin"
  }, [_vm._m(0), _vm._v(" "), _c("div", {
    staticClass: "fx-toolbar"
  }, [_c("label", {
    staticClass: "fx-field"
  }, [_c("span", {
    staticClass: "fx-field__label"
  }, [_vm._v("Status")]), _vm._v(" "), _c("select", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.status,
      expression: "status"
    }],
    staticClass: "fx-input",
    on: {
      change: [function ($event) {
        var $$selectedVal = Array.prototype.filter.call($event.target.options, function (o) {
          return o.selected;
        }).map(function (o) {
          var val = "_value" in o ? o._value : o.value;
          return val;
        });
        _vm.status = $event.target.multiple ? $$selectedVal : $$selectedVal[0];
      }, _vm.load]
    }
  }, [_c("option", {
    attrs: {
      value: ""
    }
  }, [_vm._v("All")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "open"
    }
  }, [_vm._v("Open")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "investigating"
    }
  }, [_vm._v("Investigating")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "resolved"
    }
  }, [_vm._v("Resolved")])])])]), _vm._v(" "), _vm.chat ? _c("section", {
    staticClass: "fx-section fx-desk-chat",
    attrs: {
      "aria-label": "Support chat"
    }
  }, [_c("div", {
    staticClass: "fx-toolbar"
  }, [_c("strong", [_vm._v("Chat #" + _vm._s(_vm.chat.ticket.id))]), _vm._v(" "), _c("span", {
    staticClass: "fx-muted"
  }, [_vm._v("\n        " + _vm._s(_vm.chat.ticket.reporter ? _vm.chat.ticket.reporter.name : "—") + " ·\n        " + _vm._s(_vm.chat.ticket.branch ? _vm.chat.ticket.branch.agent_name : "—") + " ·\n        started on "), _c("span", {
    staticClass: "identifier"
  }, [_vm._v(_vm._s(_vm.chat.ticket.route))])]), _vm._v(" "), _c("StatusChip", {
    attrs: {
      value: _vm.chat.status
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--ghost",
    on: {
      click: _vm.closeChat
    }
  }, [_vm._v("Back to the queue")])], 1), _vm._v(" "), _vm.chat.ticket.help_transcript && _vm.chat.ticket.help_transcript.length ? _c("details", {
    staticClass: "fx-muted"
  }, [_c("summary", [_vm._v("What they asked Help first (" + _vm._s(_vm.chat.ticket.help_transcript.length) + ")")]), _vm._v(" "), _vm._l(_vm.chat.ticket.help_transcript, function (t, i) {
    return _c("p", {
      key: i
    }, [_c("strong", [_vm._v(_vm._s(t.question))]), _c("br"), _vm._v(_vm._s(t.answer))]);
  })], 2) : _vm._e(), _vm._v(" "), _c("ol", {
    ref: "chatLog",
    staticClass: "fx-help__log"
  }, _vm._l(_vm.chat.messages, function (m) {
    return _c("li", {
      key: m.id,
      staticClass: "fx-help__msg",
      class: "fx-help__msg--" + (m.sender === "agent" ? "user" : m.sender === "user" ? "agent" : "system")
    }, [_vm._v("\n        " + _vm._s(m.body) + "\n      ")]);
  }), 0), _vm._v(" "), _vm.chat.status !== "resolved" ? _c("form", {
    staticClass: "fx-desk-chat__reply",
    on: {
      submit: function ($event) {
        $event.preventDefault();
        return _vm.reply.apply(null, arguments);
      }
    }
  }, [_c("textarea", {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.draft,
      expression: "draft"
    }],
    staticClass: "fx-input",
    attrs: {
      rows: "2",
      maxlength: "4000",
      placeholder: "Reply to the client"
    },
    domProps: {
      value: _vm.draft
    },
    on: {
      keydown: function ($event) {
        if (!$event.type.indexOf("key") && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) return null;
        if ($event.ctrlKey || $event.shiftKey || $event.altKey || $event.metaKey) return null;
        $event.preventDefault();
        return _vm.reply.apply(null, arguments);
      },
      input: function ($event) {
        if ($event.target.composing) return;
        _vm.draft = $event.target.value;
      }
    }
  }), _vm._v(" "), _c("button", {
    staticClass: "fx-btn fx-btn--primary",
    attrs: {
      disabled: _vm.busy || !_vm.draft.trim()
    }
  }, [_vm._v("Send")]), _vm._v(" "), _c("button", {
    staticClass: "fx-btn",
    attrs: {
      disabled: _vm.busy
    },
    on: {
      click: function ($event) {
        $event.preventDefault();
        return _vm.resolveChat.apply(null, arguments);
      }
    }
  }, [_vm._v("Close chat")])]) : _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("This chat is closed.")])]) : _vm._e(), _vm._v(" "), _vm.loading ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Loading…")]) : _vm.error ? _c("p", {
    staticClass: "fx-error",
    attrs: {
      role: "alert"
    }
  }, [_vm._v(_vm._s(_vm.error))]) : !_vm.tickets.length ? _c("p", {
    staticClass: "fx-muted"
  }, [_vm._v("Nothing in the queue.")]) : _c("table", {
    staticClass: "fx-table"
  }, [_vm._m(1), _vm._v(" "), _c("tbody", _vm._l(_vm.tickets, function (t) {
    return _c("tr", {
      key: t.id
    }, [_c("td", [_c("Figure", {
      attrs: {
        value: t.created_at,
        kind: "dateTime"
      }
    })], 1), _vm._v(" "), _c("td", [_vm._v(_vm._s(t.branch ? t.branch.agent_name : "—"))]), _vm._v(" "), _c("td", [_vm._v(_vm._s(t.reporter ? t.reporter.name : "—")), _c("br"), _vm._v(" "), _c("span", {
      staticClass: "fx-muted"
    }, [_vm._v(_vm._s(t.reporter ? t.reporter.designation : ""))])]), _vm._v(" "), _c("td", {
      staticClass: "identifier"
    }, [_vm._v(_vm._s(t.route))]), _vm._v(" "), _c("td", [t.channel === "chat" ? _c("span", [_vm._v("💬 ")]) : _vm._e(), _vm._v(_vm._s(t.description) + "\n          "), t.waiting_messages ? _c("strong", {
      staticClass: "fx-error"
    }, [_vm._v(" · " + _vm._s(t.waiting_messages) + " waiting")]) : _vm._e(), _vm._v(" "), t.element_selector ? _c("div", {
      staticClass: "fx-muted identifier fx-ticket__selector"
    }, [_vm._v("\n            " + _vm._s(t.element_selector) + "\n          ")]) : _vm._e()]), _vm._v(" "), _c("td", [_c("StatusChip", {
      attrs: {
        value: t.status
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "fx-row-actions"
    }, [t.channel === "chat" ? _c("button", {
      staticClass: "fx-btn fx-btn--primary",
      on: {
        click: function ($event) {
          return _vm.openChat(t);
        }
      }
    }, [_vm._v("Open chat")]) : _vm._e(), _vm._v(" "), t.status === "open" ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.advance(t, "investigating");
        }
      }
    }, [_vm._v("Investigating")]) : _vm._e(), _vm._v(" "), t.status === "investigating" ? _c("button", {
      staticClass: "fx-btn",
      attrs: {
        disabled: _vm.busy
      },
      on: {
        click: function ($event) {
          return _vm.advance(t, "resolved");
        }
      }
    }, [_vm._v("Resolve")]) : _vm._e()])]);
  }), 0)])]);
};
var staticRenderFns = [function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("header", {
    staticClass: "fx-page-head"
  }, [_c("h1", {
    staticClass: "fx-page-title"
  }, [_vm._v("Support desk")]), _vm._v(" "), _c("p", {
    staticClass: "fx-page-sub"
  }, [_vm._v("\n      Bug reports and live chats from every tenant. Reports are captured by the in-app\n      reporter — no model in the path, because a hallucinated selector sends a developer\n      to the wrong screen with confident-looking evidence. A chat is a client who pressed\n      “Talk to a support agent” in Help.\n    ")])]);
}, function () {
  var _vm = this,
    _c = _vm._self._c;
  return _c("thead", [_c("tr", [_c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Reported")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Branch")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Reporter")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Route")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Description")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  }, [_vm._v("Status")]), _vm._v(" "), _c("th", {
    attrs: {
      scope: "col"
    }
  })])]);
}];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/SupportDeskTickets.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SupportDeskTickets.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SupportDeskTickets_vue_vue_type_template_id_69a578fb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SupportDeskTickets.vue?vue&type=template&id=69a578fb */ "./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=template&id=69a578fb");
/* harmony import */ var _SupportDeskTickets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SupportDeskTickets.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SupportDeskTickets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SupportDeskTickets_vue_vue_type_template_id_69a578fb__WEBPACK_IMPORTED_MODULE_0__.render,
  _SupportDeskTickets_vue_vue_type_template_id_69a578fb__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/SupportDeskTickets.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SupportDeskTickets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SupportDeskTickets.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SupportDeskTickets_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=template&id=69a578fb":
/*!************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=template&id=69a578fb ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SupportDeskTickets_vue_vue_type_template_id_69a578fb__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SupportDeskTickets_vue_vue_type_template_id_69a578fb__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SupportDeskTickets_vue_vue_type_template_id_69a578fb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SupportDeskTickets.vue?vue&type=template&id=69a578fb */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/SupportDeskTickets.vue?vue&type=template&id=69a578fb");


/***/ })

}]);