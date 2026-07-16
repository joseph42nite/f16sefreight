"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_JobInbox_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _view_pages_dashboard_FocusAir_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/view/pages/dashboard/FocusAir.vue */ "./resources/js/src/view/pages/dashboard/FocusAir.vue");
/* harmony import */ var _view_pages_dashboard_FocusAirImport_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/view/pages/dashboard/FocusAirImport.vue */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "JobInbox",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    FocusAir: _view_pages_dashboard_FocusAir_vue__WEBPACK_IMPORTED_MODULE_2__["default"],
    FocusAirImport: _view_pages_dashboard_FocusAirImport_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      activeFolder: "inbox",
      activeThreadKey: null,
      searchQuery: "",
      replyText: "",
      foldersList: {
        inbox: {
          label: "Inbox",
          icon: "mailbox"
        },
        assigned: {
          label: "Assigned",
          icon: "person-check-fill"
        },
        unassigned: {
          label: "Unassigned",
          icon: "person-x-fill"
        },
        processing: {
          label: "Processing",
          icon: "play-fill"
        },
        awaiting_client: {
          label: "Awaiting Client",
          icon: "reply-fill"
        },
        completed: {
          label: "Completed",
          icon: "check-circle-fill"
        }
      },
      folderCounts: {},
      threads: [],
      activeThread: {},
      emails: [],
      operators: [],
      expandedMessageIndex: 0,
      loadingThreads: false,
      loadingDetails: false,
      assigningOperator: false,
      sendingReply: false,
      refreshInterval: null,
      // Phase 2.6 — Drawer
      drawerOpen: false,
      drawerTab: 'focusair',
      // OCR state
      ocrFile: null,
      ocrDragOver: false,
      ocrProcessing: false,
      ocrResult: null,
      // Phase 3 operational properties
      selectedExistingJobId: null,
      activeJobs: [],
      confirmAwb: "",
      confirmOperatorId: null,
      confirmClearanceDate: "",
      lostReason: "rates_high",
      lostReasonCustom: "",
      confirmingShipment: false,
      savingLoss: false,
      triagingThread: false,
      // Job Cost Sheet properties
      loadingCostSheet: false,
      savingCostSheet: false,
      costSheetInvoiceItems: [],
      costSheetPurchaseItems: []
    };
  },
  filters: {
    snippetText: function snippetText(val) {
      if (!val) return "";
      var plain = val.replace(/<[^>]*>/g, "");
      return plain.length > 80 ? plain.substring(0, 80) + "..." : plain;
    }
  },
  computed: {
    currentUser: function currentUser() {
      return this.$store.getters.currentUser;
    },
    isViperCore: function isViperCore() {
      var tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
      return !tier || tier === 'viper_core';
    },
    filteredDrawerTabs: function filteredDrawerTabs() {
      var portalScope = sessionStorage.getItem('active_portal_scope') || 'air';
      if (portalScope === 'sea') {
        return [{
          key: 'sea_master',
          label: 'Sea Export',
          icon: 'file-earmark-text'
        }, {
          key: 'cost',
          label: 'Job Cost',
          icon: 'cash-stack'
        }];
      } else {
        return [{
          key: 'focusair',
          label: 'Air Export',
          icon: 'airplane'
        }, {
          key: 'focusair_import',
          label: 'Air Import',
          icon: 'airplane-engines'
        }, {
          key: 'cost',
          label: 'Job Cost',
          icon: 'cash-stack'
        }];
      }
    },
    filteredThreads: function filteredThreads() {
      var _this = this;
      var list = this.threads;
      if (this.currentUser && this.currentUser.designation === 'operations') {
        list = list.filter(function (t) {
          return t.assigned_operator_id === _this.currentUser.id || t.assigned_operator && t.assigned_operator.id === _this.currentUser.id;
        });
      }
      if (!this.searchQuery) return list;
      var query = this.searchQuery.toLowerCase();
      return list.filter(function (t) {
        return t.subject && t.subject.toLowerCase().includes(query) || t.sender && t.sender.toLowerCase().includes(query);
      });
    },
    operatorOptions: function operatorOptions() {
      return this.operators.map(function (op) {
        var count = op.active_jobs !== undefined ? " (".concat(op.active_jobs, " Jobs)") : '';
        var overload = op.active_jobs >= 15 ? ' 🔴 OVERLOADED' : '';
        return {
          value: op.id,
          text: "".concat(op.name).concat(count).concat(overload)
        };
      });
    },
    activeJobsOptions: function activeJobsOptions() {
      return this.activeJobs.filter(function (j) {
        return j.status !== 'Completed';
      }).map(function (job) {
        var jobNo = job.execution_job_no ? "".concat(job.execution_job_no, " (Enq: ").concat(job.enquiry_no, ")") : job.enquiry_no;
        return {
          value: job.id,
          text: "".concat(jobNo, " - ").concat(job.status)
        };
      });
    },
    costSheetInvoiceTotal: function costSheetInvoiceTotal() {
      return this.costSheetInvoiceItems.reduce(function (acc, item) {
        return acc + (item.total_amount || 0);
      }, 0);
    },
    costSheetPurchaseTotal: function costSheetPurchaseTotal() {
      return this.costSheetPurchaseItems.reduce(function (acc, item) {
        return acc + (item.total_amount || 0);
      }, 0);
    },
    profitMargin: function profitMargin() {
      return this.costSheetInvoiceTotal - this.costSheetPurchaseTotal;
    },
    profitMarginPercent: function profitMarginPercent() {
      if (this.costSheetInvoiceTotal === 0) return 0;
      return this.profitMargin / this.costSheetInvoiceTotal * 100;
    }
  },
  watch: {
    drawerTab: function drawerTab(newVal) {
      if (newVal === 'cost' && this.activeThread && this.activeThread.job) {
        this.fetchJobCostSheet();
      }
    },
    activeThreadKey: function activeThreadKey() {
      if (this.drawerTab === 'cost' && this.activeThread && this.activeThread.job) {
        this.fetchJobCostSheet();
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;
    if (!this.isViperCore) {
      this.loadWorkspaceData();

      // Check for thread_key query param to auto-select and open drawer
      var threadKey = this.$route.query.thread_key;
      if (threadKey) {
        this.selectThreadAndOpenDrawer(threadKey);
      }

      // Poll for fresh folder counts and threads every 30 seconds
      this.refreshInterval = setInterval(function () {
        _this2.fetchFolderCounts();
        _this2.fetchThreads(false);
      }, 30000);
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    onAttachmentDragStart: function onAttachmentDragStart(event, att) {
      event.dataTransfer.setData('application/json', JSON.stringify(att));
      event.dataTransfer.effectAllowed = 'copy';
    },
    openAttachment: function openAttachment(att) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/attachments/".concat(att.id, "/download"), {
        responseType: 'blob'
      }).then(function (response) {
        var file = new Blob([response.data], {
          type: att.mime_type || 'application/pdf'
        });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      })["catch"](function (err) {
        console.error("Failed to download attachment:", err);
        alert("Encountered failure downloading attachment.");
      });
    },
    loadWorkspaceData: function loadWorkspaceData() {
      this.fetchFolderCounts();
      this.fetchThreads(true);
      this.fetchOperators();
    },
    fetchFolderCounts: function fetchFolderCounts() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/folders").then(function (response) {
        _this3.folderCounts = response.data;
      })["catch"](function (error) {
        return console.error("Failed to load folder counts:", error);
      });
    },
    fetchThreads: function fetchThreads() {
      var _this4 = this;
      var showLoader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (showLoader) this.loadingThreads = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].query("/user/inbox/threads", {
        params: {
          folder: this.activeFolder
        }
      }).then(function (response) {
        _this4.threads = response.data;
      })["catch"](function (error) {
        return console.error("Failed to load threads:", error);
      })["finally"](function () {
        if (showLoader) _this4.loadingThreads = false;
      });
    },
    fetchOperators: function fetchOperators() {
      var _this5 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/staff-workloads").then(function (response) {
        _this5.operators = response.data;
      })["catch"](function (error) {
        return console.error("Failed to load operators/workloads:", error);
      });
    },
    selectFolder: function selectFolder(key) {
      this.activeFolder = key;
      this.activeThreadKey = null;
      this.emails = [];
      this.activeThread = {};
      this.fetchThreads(true);
    },
    selectThread: function selectThread(threadKey) {
      var _this6 = this;
      this.activeThreadKey = threadKey;
      this.loadingDetails = true;
      this.expandedMessageIndex = 0; // default expand latest

      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/threads/".concat(threadKey)).then(function (response) {
        _this6.activeThread = response.data.thread;
        _this6.emails = response.data.emails;
        // Auto-expand last email (index of last element)
        _this6.expandedMessageIndex = _this6.emails.length - 1;

        // Update thread status locally to 'read' if it was 'unread'
        var idx = _this6.threads.findIndex(function (t) {
          return t.thread_key === threadKey;
        });
        if (idx !== -1 && _this6.threads[idx].status === 'unread') {
          _this6.threads[idx].status = 'read';
          _this6.fetchFolderCounts();
        }
      })["catch"](function (error) {
        return console.error("Failed to load thread details:", error);
      })["finally"](function () {
        _this6.loadingDetails = false;
      });
    },
    selectThreadAndOpenDrawer: function selectThreadAndOpenDrawer(threadKey) {
      var _this7 = this;
      this.activeThreadKey = threadKey;
      this.loadingDetails = true;
      this.expandedMessageIndex = 0;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/threads/".concat(threadKey)).then(function (response) {
        _this7.activeThread = response.data.thread;
        _this7.emails = response.data.emails;
        _this7.expandedMessageIndex = _this7.emails.length - 1;

        // Automatically slide open the split drawer
        _this7.drawerOpen = true;
        // Pre-load correct tab based on job status
        if (_this7.activeThread.job) {
          var status = _this7.activeThread.job.status;
          if (status === 'Verification' || status === 'Generation' || status === 'PDF Generated') {
            _this7.drawerTab = 'focusair';
          } else if (status === 'AI Extraction') {
            _this7.drawerTab = 'upload';
          }
        }
        var idx = _this7.threads.findIndex(function (t) {
          return t.thread_key === threadKey;
        });
        if (idx !== -1 && _this7.threads[idx].status === 'unread') {
          _this7.threads[idx].status = 'read';
          _this7.fetchFolderCounts();
        }
      })["catch"](function (error) {
        return console.error("Failed to auto-load thread details:", error);
      })["finally"](function () {
        _this7.loadingDetails = false;
      });
    },
    toggleMessageExpand: function toggleMessageExpand(index) {
      this.expandedMessageIndex = this.expandedMessageIndex === index ? -1 : index;
    },
    assignOperator: function assignOperator(operatorId) {
      var _this8 = this;
      this.assigningOperator = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/threads/".concat(this.activeThreadKey, "/assign"), {
        assigned_operator_id: operatorId
      }).then(function (response) {
        _this8.$bvToast.toast("Operator successfully assigned.", {
          title: "Success",
          variant: "success",
          solid: true
        });

        // Update operator local display
        var op = _this8.operators.find(function (o) {
          return o.id === operatorId;
        });
        _this8.activeThread.assigned_operator = op ? {
          id: op.id,
          name: op.name
        } : null;

        // Reload active feeds
        _this8.fetchFolderCounts();
        _this8.fetchThreads(false);
      })["catch"](function (error) {
        _this8.$bvToast.toast("Failed to assign operator.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this8.assigningOperator = false;
      });
    },
    sendQuickReply: function sendQuickReply() {
      var _this9 = this;
      if (!this.replyText.trim() || this.sendingReply) return;
      var body = this.replyText.trim();
      this.sendingReply = true;
      this.$http.post("/api/user/inbox/threads/".concat(this.activeThreadKey, "/reply"), {
        body: body
      }).then(function (response) {
        var outbound = response.data.email;

        // Append the real outbound email to the conversation timeline
        _this9.emails.push(outbound);
        _this9.expandedMessageIndex = _this9.emails.length - 1;
        _this9.replyText = "";

        // Update thread status locally to 'replied'
        var idx = _this9.threads.findIndex(function (t) {
          return t.thread_key === _this9.activeThreadKey;
        });
        if (idx !== -1) {
          _this9.threads[idx].status = 'replied';
        }
        if (_this9.activeThread) {
          _this9.activeThread.status = 'replied';
        }
        _this9.$bvToast.toast("Reply sent successfully via your connected mailbox.", {
          title: "Reply Sent",
          variant: "success",
          solid: true,
          autoHideDelay: 4000
        });
      })["catch"](function (err) {
        var _err$response;
        var msg = ((_err$response = err.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.error) || "Failed to send reply. Please try again.";
        _this9.$bvToast.toast(msg, {
          title: "Send Failed",
          variant: "danger",
          solid: true,
          autoHideDelay: 6000
        });
      })["finally"](function () {
        _this9.sendingReply = false;
      });
    },
    // ----- Phase 2.6 — Drawer methods -----
    toggleDrawer: function toggleDrawer() {
      if (!this.activeThreadKey) {
        this.$bvToast.toast('Select a thread first to open the workspace.', {
          title: 'No Thread Selected',
          variant: 'warning',
          solid: true,
          autoHideDelay: 3000
        });
        return;
      }
      this.drawerOpen = !this.drawerOpen;
    },
    navigateTo: function navigateTo(path) {
      this.$router.push(path);
    },
    handleOcrDrop: function handleOcrDrop(e) {
      this.ocrDragOver = false;
      var file = e.dataTransfer.files[0];
      if (file) this.ocrFile = file;
    },
    handleOcrFileSelect: function handleOcrFileSelect(e) {
      var file = e.target.files[0];
      if (file) this.ocrFile = file;
    },
    clearOcr: function clearOcr() {
      this.ocrFile = null;
      this.ocrResult = null;
      this.ocrProcessing = false;
      if (this.$refs.ocrFileInput) this.$refs.ocrFileInput.value = '';
    },
    runOcrExtract: function runOcrExtract() {
      var _this0 = this;
      if (!this.ocrFile) return;
      this.ocrProcessing = true;
      this.ocrResult = null;
      var formData = new FormData();
      formData.append('file', this.ocrFile);
      this.$http.post('/api/user/ocr/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (res) {
        _this0.ocrResult = res.data.extracted || res.data;
      })["catch"](function () {
        _this0.$bvToast.toast('OCR extraction failed. Please try again.', {
          title: 'OCR Error',
          variant: 'danger',
          solid: true
        });
      })["finally"](function () {
        _this0.ocrProcessing = false;
      });
    },
    formatOcrKey: function formatOcrKey(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
    },
    // ----- End Phase 2.6 -----
    formatTime: function formatTime(isoString) {
      if (!isoString) return "";
      var date = new Date(isoString);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    },
    getSlaBadgeClass: function getSlaBadgeClass(slaStatus) {
      switch (slaStatus) {
        case "normal":
          return "badge-success";
        case "warning":
          return "badge-warning";
        case "breached":
          return "badge-danger";
        default:
          return "badge-light";
      }
    },
    getSlaText: function getSlaText(thread) {
      if (thread.sla_remaining_seconds === null) return "Inactive";
      var totalSecs = thread.sla_remaining_seconds;
      if (totalSecs <= 0) {
        var elapsedMins = Math.floor(Math.abs(totalSecs) / 60);
        return "Breached (".concat(elapsedMins, "m)");
      } else {
        var remainingMins = Math.ceil(totalSecs / 60);
        return "".concat(remainingMins, "m left");
      }
    },
    triageThread: function triageThread(classification) {
      var _this1 = this;
      this.triagingThread = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/threads/".concat(this.activeThreadKey, "/triage"), {
        classification: classification
      }).then(function (response) {
        _this1.$bvToast.toast("Thread successfully triaged.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this1.activeThread = response.data.thread;
        _this1.fetchFolderCounts();
        _this1.fetchThreads(false);
      })["catch"](function (error) {
        console.error("Failed to triage thread:", error);
        _this1.$bvToast.toast("Failed to triage thread.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this1.triagingThread = false;
      });
    },
    openLinkJobModal: function openLinkJobModal() {
      var _this10 = this;
      this.selectedExistingJobId = null;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/active-jobs").then(function (response) {
        _this10.activeJobs = response.data;
        _this10.$bvModal.show("link-job-modal");
      })["catch"](function (error) {
        console.error("Failed to load active jobs:", error);
        _this10.$bvToast.toast("Failed to load active jobs.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      });
    },
    handleLinkJob: function handleLinkJob(evt) {
      var _this11 = this;
      evt.preventDefault();
      if (!this.selectedExistingJobId) {
        this.$bvToast.toast("Please select an active job to link.", {
          title: "Required Field",
          variant: "warning",
          solid: true
        });
        return;
      }
      this.triagingThread = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/threads/".concat(this.activeThreadKey, "/triage"), {
        classification: 'job',
        existing_job_id: this.selectedExistingJobId
      }).then(function (response) {
        _this11.$bvToast.toast("Thread successfully linked to job.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this11.activeThread = response.data.thread;
        _this11.fetchFolderCounts();
        _this11.fetchThreads(false);
        _this11.$nextTick(function () {
          _this11.$bvModal.hide("link-job-modal");
        });
      })["catch"](function (error) {
        console.error("Failed to link thread to job:", error);
        _this11.$bvToast.toast("Failed to link thread to job.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this11.triagingThread = false;
      });
    },
    closeConfirmPopover: function closeConfirmPopover() {
      if (this.$refs.confirmPopover) {
        this.$refs.confirmPopover.$emit('close');
      }
    },
    closeLostPopover: function closeLostPopover() {
      if (this.$refs.lostPopover) {
        this.$refs.lostPopover.$emit('close');
      }
    },
    submitConfirmShipment: function submitConfirmShipment() {
      var _this12 = this;
      if (!this.confirmAwb || !this.confirmOperatorId || !this.confirmClearanceDate) {
        this.$bvToast.toast("Please fill in all confirmation fields.", {
          title: "Validation Error",
          variant: "warning",
          solid: true
        });
        return;
      }
      this.confirmingShipment = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/threads/".concat(this.activeThreadKey, "/confirm"), {
        awb_number: this.confirmAwb,
        operator_id: this.confirmOperatorId,
        planned_clearance_date: this.confirmClearanceDate
      }).then(function (response) {
        _this12.$bvToast.toast("Shipment confirmed and operator assigned.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this12.closeConfirmPopover();
        _this12.confirmAwb = "";
        _this12.confirmOperatorId = null;
        _this12.confirmClearanceDate = "";
        _this12.selectThread(_this12.activeThreadKey);
      })["catch"](function (error) {
        var _error$response;
        console.error("Failed to confirm shipment:", error);
        var msg = ((_error$response = error.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.error) || "Failed to confirm shipment.";
        _this12.$bvToast.toast(msg, {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this12.confirmingShipment = false;
      });
    },
    submitMarkLost: function submitMarkLost() {
      var _this13 = this;
      if (!this.lostReason) {
        this.$bvToast.toast("Please select a reason.", {
          title: "Validation Error",
          variant: "warning",
          solid: true
        });
        return;
      }
      this.savingLoss = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/threads/".concat(this.activeThreadKey, "/lost"), {
        lost_reason: this.lostReason,
        lost_reason_custom: this.lostReason === 'other' ? this.lostReasonCustom : null
      }).then(function (response) {
        _this13.$bvToast.toast("Job marked as lost and thread archived.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this13.closeLostPopover();
        _this13.lostReason = "rates_high";
        _this13.lostReasonCustom = "";
        _this13.activeThreadKey = null;
        _this13.activeThread = {};
        _this13.emails = [];
        _this13.fetchFolderCounts();
        _this13.fetchThreads(true);
      })["catch"](function (error) {
        console.error("Failed to mark lost:", error);
        _this13.$bvToast.toast("Failed to mark lost.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this13.savingLoss = false;
      });
    },
    fetchJobCostSheet: function fetchJobCostSheet() {
      var _this14 = this;
      if (!this.activeThread || !this.activeThread.job) return;
      this.loadingCostSheet = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/jobs/".concat(this.activeThread.job.id, "/cost-sheet")).then(function (response) {
        _this14.costSheetInvoiceItems = response.data.invoice.items;
        _this14.costSheetPurchaseItems = response.data.purchase_voucher.items;

        // Run calculation to populate total amounts
        _this14.costSheetInvoiceItems.forEach(_this14.calculateItemTotal);
        _this14.costSheetPurchaseItems.forEach(_this14.calculateItemTotal);
      })["catch"](function (error) {
        console.error("Failed to load job cost sheet:", error);
        _this14.$bvToast.toast("Failed to load cost sheet ledger.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this14.loadingCostSheet = false;
      });
    },
    calculateItemTotal: function calculateItemTotal(item) {
      var qty = parseFloat(item.qty) || 0;
      var rate = parseFloat(item.unit_rate) || 0;
      var taxRate = parseFloat(item.tax_rate) || 0;
      item.subtotal = qty * rate;
      item.tax_amount = item.subtotal * (taxRate / 100);
      item.total_amount = item.subtotal + item.tax_amount;
    },
    addInvoiceItem: function addInvoiceItem() {
      var defaultQty = 1.00;
      var newItem = {
        charge_type: "Local Delivery",
        description: "Cartage or local delivery fees",
        qty: defaultQty,
        unit_rate: 150.00,
        tax_rate: 18.00,
        subtotal: 150.00,
        tax_amount: 27.00,
        total_amount: 177.00
      };
      this.costSheetInvoiceItems.push(newItem);
    },
    removeInvoiceItem: function removeInvoiceItem(index) {
      this.costSheetInvoiceItems.splice(index, 1);
    },
    addPurchaseItem: function addPurchaseItem() {
      var defaultQty = 1.00;
      var newItem = {
        charge_type: "Local Handler Fee",
        description: "Terminal or local handling cost",
        qty: defaultQty,
        unit_rate: 100.00,
        tax_rate: 18.00,
        subtotal: 100.00,
        tax_amount: 18.00,
        total_amount: 118.00
      };
      this.costSheetPurchaseItems.push(newItem);
    },
    removePurchaseItem: function removePurchaseItem(index) {
      this.costSheetPurchaseItems.splice(index, 1);
    },
    saveJobCostSheet: function saveJobCostSheet() {
      var _this15 = this;
      this.savingCostSheet = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/jobs/".concat(this.activeThread.job.id, "/cost-sheet"), {
        invoice_items: this.costSheetInvoiceItems,
        purchase_items: this.costSheetPurchaseItems
      }).then(function (response) {
        _this15.$bvToast.toast("Job Cost Ledger draft saved successfully.", {
          title: "Success",
          variant: "success",
          solid: true
        });
        _this15.fetchJobCostSheet();
      })["catch"](function (error) {
        console.error("Failed to save job cost sheet:", error);
        _this15.$bvToast.toast("Failed to save Job Cost Ledger draft.", {
          title: "Error",
          variant: "danger",
          solid: true
        });
      })["finally"](function () {
        _this15.savingCostSheet = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=template&id=283c11e0&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=template&id=283c11e0&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "body-color",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-lg-row h-100"
  }, [_c("SideBar", {
    attrs: {
      collapsed: _vm.drawerOpen
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "ml-lg-4 mt-4 mt-lg-0",
    staticStyle: {
      background: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      "box-shadow": "0 10px 30px rgba(53, 85, 148, 0.1)",
      "z-index": "1",
      "border-radius": "32px",
      flex: "1",
      "min-width": "0",
      overflow: "hidden",
      display: "flex",
      "flex-direction": "column",
      height: "82vh"
    }
  }, [_vm.isViperCore ? _c("div", {
    staticClass: "teaser-container mx-auto my-auto py-10 px-8 text-center rounded-lg shadow-lg"
  }, [_c("div", {
    staticClass: "icon-circle mb-6 mx-auto"
  }, [_c("b-icon", {
    staticClass: "lock-icon",
    attrs: {
      icon: "envelope-open-fill",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("h3", {
    staticClass: "teaser-title mb-4"
  }, [_vm._v("Upgrade to Unlock Inbox")]), _vm._v(" "), _c("p", {
    staticClass: "teaser-description mb-6 mx-auto"
  }, [_vm._v("\n                    Connect your company mailboxes to sync operational emails directly. Triage inquiries, auto-create Job cards, track response SLAs, and reply to customers in a single unified view.\n                ")]), _vm._v(" "), _c("b-button", {
    staticClass: "upgrade-btn px-8 py-3",
    attrs: {
      variant: "primary"
    }
  }, [_vm._v("\n                    Upgrade to Viper Tactical / Command\n                ")])], 1) : _c("div", {
    staticClass: "workspace-layout d-flex flex-row h-100 w-100 position-relative"
  }, [_c("div", {
    staticClass: "column-folders p-4 d-flex flex-column border-right",
    "class": {
      "cols-hidden": _vm.drawerOpen
    }
  }, [_c("div", {
    staticClass: "folders-header mb-4 px-2"
  }, [_c("h5", {
    staticClass: "mb-0 font-weight-bold",
    staticStyle: {
      color: "#355594",
      "font-family": "'Inter', sans-serif"
    }
  }, [_vm._v("Inbox Folders")])]), _vm._v(" "), _c("ul", {
    staticClass: "nav flex-column folders-nav"
  }, _vm._l(_vm.foldersList, function (folder, key) {
    return _c("li", {
      key: key,
      staticClass: "nav-item mb-1"
    }, [_c("a", {
      staticClass: "nav-link d-flex align-items-center justify-content-between py-2 px-3 rounded-lg",
      "class": {
        active: _vm.activeFolder === key
      },
      attrs: {
        href: "#"
      },
      on: {
        click: function click($event) {
          $event.preventDefault();
          return _vm.selectFolder(key);
        }
      }
    }, [_c("div", {
      staticClass: "d-flex align-items-center"
    }, [_c("b-icon", {
      staticClass: "mr-3 text-muted icon-size",
      "class": {
        "text-primary": _vm.activeFolder === key
      },
      attrs: {
        icon: folder.icon
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "folder-label"
    }, [_vm._v(_vm._s(folder.label))])], 1), _vm._v(" "), _vm.folderCounts[key] !== undefined && _vm.folderCounts[key] > 0 ? _c("b-badge", {
      staticClass: "folder-badge",
      attrs: {
        pill: "",
        variant: _vm.activeFolder === key ? "primary" : "light"
      }
    }, [_vm._v("\n                                    " + _vm._s(_vm.folderCounts[key]) + "\n                                ")]) : _vm._e()], 1)]);
  }), 0)]), _vm._v(" "), _c("div", {
    staticClass: "column-threads d-flex flex-column border-right",
    "class": {
      "cols-hidden": _vm.drawerOpen
    }
  }, [_c("div", {
    staticClass: "p-3 border-bottom search-wrapper"
  }, [_c("b-input-group", {
    attrs: {
      size: "sm"
    }
  }, [_c("b-input-group-prepend", {
    attrs: {
      "is-text": ""
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "search"
    }
  })], 1), _vm._v(" "), _c("b-form-input", {
    staticClass: "search-input",
    attrs: {
      placeholder: "Search subject or sender..."
    },
    model: {
      value: _vm.searchQuery,
      callback: function callback($$v) {
        _vm.searchQuery = $$v;
      },
      expression: "searchQuery"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "threads-list-scroll flex-grow-1 overflow-auto"
  }, [_vm.loadingThreads ? _c("b-spinner", {
    staticClass: "d-block mx-auto my-6 text-primary"
  }) : _vm.filteredThreads.length === 0 ? _c("div", {
    staticClass: "text-center py-12 text-muted"
  }, [_c("b-icon", {
    staticClass: "mb-3",
    attrs: {
      icon: "inbox",
      "font-scale": "2.5"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "mb-0"
  }, [_vm._v("No conversations in this folder.")])], 1) : _c("div", _vm._l(_vm.filteredThreads, function (thread) {
    return _c("div", {
      key: thread.id,
      staticClass: "thread-card p-3 border-bottom position-relative",
      "class": {
        active: _vm.activeThreadKey === thread.thread_key,
        unread: thread.status === "unread"
      },
      on: {
        click: function click($event) {
          return _vm.selectThread(thread.thread_key);
        }
      }
    }, [thread.status === "unread" ? _c("div", {
      staticClass: "unread-dot"
    }) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "d-flex justify-content-between align-items-start mb-1"
    }, [_c("h6", {
      staticClass: "thread-sender text-truncate mb-0 font-weight-bold pr-2"
    }, [_vm._v("\n                                        " + _vm._s(thread.sender || "Unknown Sender") + "\n                                    ")]), _vm._v(" "), _c("span", {
      staticClass: "thread-time text-muted small whitespace-nowrap ml-2"
    }, [_vm._v("\n                                        " + _vm._s(_vm.formatTime(thread.latest_message_received_at)) + "\n                                    ")])]), _vm._v(" "), _c("div", {
      staticClass: "thread-subject text-truncate mb-1 font-weight-bold"
    }, [_vm._v("\n                                    " + _vm._s(thread.subject || "(No Subject)") + "\n                                ")]), _vm._v(" "), _c("p", {
      staticClass: "thread-snippet text-muted small mb-2 text-truncate-2"
    }, [_vm._v("\n                                    " + _vm._s(thread.snippet) + "\n                                ")]), _vm._v(" "), _c("div", {
      staticClass: "d-flex align-items-center justify-content-between mt-2 flex-wrap",
      staticStyle: {
        gap: "6px"
      }
    }, [thread.job ? _c("b-badge", {
      staticClass: "job-badge px-2 py-1",
      attrs: {
        variant: "primary"
      }
    }, [_vm._v("\n                                        Job: " + _vm._s(thread.job.enquiry_no) + "\n                                    ")]) : _c("b-badge", {
      staticClass: "job-badge-unassigned px-2 py-1",
      attrs: {
        variant: "light"
      }
    }, [_vm._v("\n                                        Unassigned Inquiry\n                                    ")]), _vm._v(" "), thread.sla_status && thread.sla_status !== "inactive" ? _c("span", {
      staticClass: "sla-timer badge",
      "class": _vm.getSlaBadgeClass(thread.sla_status)
    }, [_c("b-icon", {
      staticClass: "mr-1",
      attrs: {
        icon: "clock-fill"
      }
    }), _vm._v("\n                                        " + _vm._s(_vm.getSlaText(thread)) + "\n                                    ")], 1) : _vm._e()], 1)]);
  }), 0)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "column-conversation d-flex flex-column",
    "class": _vm.drawerOpen ? "col-conv-narrow" : "flex-grow-1"
  }, [_vm.loadingDetails ? _c("div", {
    staticClass: "d-flex flex-column align-items-center justify-content-center h-100 text-muted"
  }, [_c("b-spinner", {
    staticClass: "mb-3 text-primary"
  }), _vm._v(" "), _c("p", [_vm._v("Loading conversation details...")])], 1) : !_vm.activeThreadKey ? _c("div", {
    staticClass: "d-flex flex-column align-items-center justify-content-center h-100 text-muted p-6 text-center"
  }, [_c("div", {
    staticClass: "conversation-placeholder-icon mb-4"
  }, [_c("b-icon", {
    staticClass: "text-primary opacity-3",
    attrs: {
      icon: "envelope-fill",
      "font-scale": "3.5"
    }
  })], 1), _vm._v(" "), _c("h4", {
    staticClass: "font-weight-bold text-dark mb-2"
  }, [_vm._v("No Thread Selected")]), _vm._v(" "), _c("p", {
    staticStyle: {
      "max-width": "350px"
    }
  }, [_vm._v("Select a thread from the feed on the left to read messages, manage operator assignments, and triage inquiries.")])]) : _c("div", {
    staticClass: "d-flex flex-column h-100 overflow-hidden"
  }, [_c("div", {
    staticClass: "conversation-header p-4 border-bottom d-flex align-items-center justify-content-between bg-light"
  }, [_c("div", [_c("h5", {
    staticClass: "mb-1 font-weight-bold text-dark"
  }, [_vm._v(_vm._s(_vm.activeThread.subject || "(No Subject)"))]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center text-muted small flex-wrap",
    staticStyle: {
      gap: "8px"
    }
  }, [_vm.activeThread.job ? _c("b-badge", {
    staticClass: "px-2 py-1",
    attrs: {
      variant: "primary"
    }
  }, [_vm._v("\n                                        Job ID: " + _vm._s(_vm.activeThread.job.enquiry_no) + " (" + _vm._s(_vm.activeThread.job.status) + ")\n                                    ")]) : _c("b-badge", {
    staticClass: "px-2 py-1",
    attrs: {
      variant: "warning"
    }
  }, [_vm._v("\n                                        Unassigned Inquiry\n                                    ")]), _vm._v(" "), _vm.activeThread.job && (_vm.activeThread.job.status === "PDF Generated" || _vm.activeThread.job.status === "Generation") ? _c("b-badge", {
    staticClass: "px-2 py-1",
    attrs: {
      variant: "info"
    }
  }, [_vm._v("\n                                        PDF Generation\n                                    ")]) : _vm._e()], 1)]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      gap: "8px"
    }
  }, [!_vm.activeThread.job ? _c("b-dropdown", {
    staticClass: "triage-dropdown mr-2",
    attrs: {
      size: "sm",
      variant: "outline-primary",
      "no-caret": ""
    },
    scopedSlots: _vm._u([{
      key: "button-content",
      fn: function fn() {
        return [_c("b-icon", {
          staticClass: "mr-1",
          attrs: {
            icon: "tags-fill"
          }
        }), _vm._v(" Triage\n                                    ")];
      },
      proxy: true
    }], null, false, 824989283)
  }, [_vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.triageThread("job");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-primary",
    attrs: {
      icon: "file-earmark-plus"
    }
  }), _vm._v(" Job / Enquiry\n                                    ")], 1), _vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: _vm.openLinkJobModal
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-success",
    attrs: {
      icon: "link-45deg"
    }
  }), _vm._v(" Link to Existing Job\n                                    ")], 1), _vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.triageThread("airline");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-warning",
    attrs: {
      icon: "mailbox"
    }
  }), _vm._v(" Airline Mail\n                                    ")], 1), _vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.triageThread("escalation");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-danger",
    attrs: {
      icon: "exclamation-octagon"
    }
  }), _vm._v(" Escalation Mail\n                                    ")], 1), _vm._v(" "), _c("b-dropdown-item", {
    on: {
      click: function click($event) {
        return _vm.triageThread("clearance");
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-info",
    attrs: {
      icon: "check2-square"
    }
  }), _vm._v(" Clearance Mail\n                                    ")], 1)], 1) : _vm._e(), _vm._v(" "), _vm.activeThread.job && _vm.activeThread.job.status !== "Completed" && _vm.activeThread.job.status !== "Lost" && _vm.currentUser && _vm.currentUser.designation === "pricing" ? _c("div", {
    staticClass: "d-flex mr-2",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-button", {
    attrs: {
      id: "btn-confirm-shipment",
      variant: "success",
      size: "sm"
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "check-circle"
    }
  }), _vm._v(" Confirm Shipment\n                                    ")], 1), _vm._v(" "), _c("b-button", {
    attrs: {
      id: "btn-mark-lost",
      variant: "danger",
      size: "sm"
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "x-circle"
    }
  }), _vm._v(" Mark as Lost\n                                    ")], 1)], 1) : _vm._e(), _vm._v(" "), _c("label", {
    staticClass: "mb-0 text-muted small font-weight-bold text-uppercase d-none d-sm-block"
  }, [_vm._v("Owner:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "assignee-select",
    attrs: {
      options: _vm.operatorOptions,
      disabled: _vm.assigningOperator
    },
    on: {
      change: _vm.assignOperator
    },
    scopedSlots: _vm._u([{
      key: "first",
      fn: function fn() {
        return [_c("option", {
          domProps: {
            value: null
          }
        }, [_vm._v("Unassigned")])];
      },
      proxy: true
    }]),
    model: {
      value: _vm.activeThread.assigned_operator_id,
      callback: function callback($$v) {
        _vm.$set(_vm.activeThread, "assigned_operator_id", $$v);
      },
      expression: "activeThread.assigned_operator_id"
    }
  }), _vm._v(" "), _vm.assigningOperator ? _c("b-spinner", {
    staticClass: "text-primary",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v(" "), _c("b-button", {
    directives: [{
      name: "b-tooltip",
      rawName: "v-b-tooltip.hover",
      modifiers: {
        hover: true
      }
    }],
    staticClass: "split-pane-btn ml-1",
    attrs: {
      id: "drawer-toggle-btn",
      variant: _vm.drawerOpen ? "primary" : "outline-secondary",
      size: "sm",
      title: _vm.drawerOpen ? "Close Workspace" : "Open Split Workspace"
    },
    on: {
      click: _vm.toggleDrawer
    }
  }, [_c("b-icon", {
    attrs: {
      icon: _vm.drawerOpen ? "layout-split" : "layout-split",
      "font-scale": "1"
    }
  })], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "messages-scroll flex-grow-1 p-4 overflow-auto bg-timeline"
  }, _vm._l(_vm.emails, function (email, index) {
    return _c("div", {
      key: email.id,
      staticClass: "message-card mb-4 rounded-lg shadow-sm border overflow-hidden",
      "class": {
        expanded: _vm.expandedMessageIndex === index
      }
    }, [_c("div", {
      staticClass: "message-header p-3 d-flex align-items-center justify-content-between bg-white cursor-pointer",
      on: {
        click: function click($event) {
          return _vm.toggleMessageExpand(index);
        }
      }
    }, [_c("div", {
      staticClass: "d-flex align-items-center text-truncate pr-2"
    }, [_c("div", {
      staticClass: "sender-avatar mr-3"
    }, [_vm._v("\n                                            " + _vm._s(email.from.charAt(0).toUpperCase()) + "\n                                        ")]), _vm._v(" "), _c("div", {
      staticClass: "text-truncate"
    }, [_c("div", {
      staticClass: "d-flex align-items-center flex-wrap",
      staticStyle: {
        gap: "4px"
      }
    }, [_c("span", {
      staticClass: "font-weight-bold text-dark text-truncate"
    }, [_vm._v(_vm._s(email.from))]), _vm._v(" "), _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v("to " + _vm._s(email.to))])]), _vm._v(" "), _vm.expandedMessageIndex !== index ? _c("span", {
      staticClass: "text-muted text-truncate d-block small"
    }, [_vm._v("\n                                                " + _vm._s(_vm._f("snippetText")(email.body_text || email.body_html)) + "\n                                            ")]) : _vm._e()])]), _vm._v(" "), _c("div", {
      staticClass: "d-flex align-items-center ml-2 flex-shrink-0",
      staticStyle: {
        gap: "8px"
      }
    }, [_c("span", {
      staticClass: "text-muted small"
    }, [_vm._v(_vm._s(_vm.formatTime(email.received_at)))]), _vm._v(" "), _c("b-icon", {
      staticClass: "text-muted",
      attrs: {
        icon: _vm.expandedMessageIndex === index ? "chevron-up" : "chevron-down"
      }
    })], 1)]), _vm._v(" "), _c("transition", {
      attrs: {
        name: "expand"
      }
    }, [_c("div", {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: _vm.expandedMessageIndex === index,
        expression: "expandedMessageIndex === index"
      }],
      staticClass: "message-body p-4 bg-white border-top"
    }, [email.body_html ? _c("div", {
      staticClass: "email-body-content",
      domProps: {
        innerHTML: _vm._s(email.body_html)
      }
    }) : _c("div", {
      staticClass: "email-body-content whitespace-pre-line"
    }, [_vm._v(_vm._s(email.body_text))]), _vm._v(" "), email.attachments && email.attachments.length > 0 ? _c("div", {
      staticClass: "attachments-section mt-4 pt-3 border-top"
    }, [_c("h6", {
      staticClass: "font-weight-bold text-muted small mb-2"
    }, [_vm._v("Attachments (" + _vm._s(email.attachments.length) + ")")]), _vm._v(" "), _c("div", {
      staticClass: "d-flex flex-wrap",
      staticStyle: {
        gap: "10px"
      }
    }, _vm._l(email.attachments, function (att) {
      return _c("div", {
        key: att.id,
        staticClass: "attachment-chip d-flex align-items-center p-2 rounded-lg border bg-light",
        staticStyle: {
          cursor: "grab"
        },
        attrs: {
          draggable: "true"
        },
        on: {
          dragstart: function dragstart($event) {
            return _vm.onAttachmentDragStart($event, att);
          }
        }
      }, [_c("b-icon", {
        staticClass: "mr-2 text-danger font-scale-1.2",
        attrs: {
          icon: "file-earmark-pdf-fill"
        }
      }), _vm._v(" "), _c("span", {
        staticClass: "attachment-name text-truncate mr-2",
        staticStyle: {
          "max-width": "150px"
        }
      }, [_vm._v(_vm._s(att.filename))]), _vm._v(" "), _c("b-button", {
        directives: [{
          name: "b-tooltip",
          rawName: "v-b-tooltip.hover",
          modifiers: {
            hover: true
          }
        }],
        staticClass: "p-1 line-height-0 rounded",
        attrs: {
          size: "sm",
          variant: "light",
          title: "Open File"
        },
        on: {
          click: function click($event) {
            return _vm.openAttachment(att);
          }
        }
      }, [_c("b-icon", {
        attrs: {
          icon: "eye",
          "font-scale": "0.9"
        }
      })], 1)], 1);
    }), 0)]) : _vm._e()])])], 1);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "conversation-reply-box p-3 border-top bg-light"
  }, [_c("b-form-textarea", {
    staticClass: "reply-textarea mb-2",
    attrs: {
      placeholder: "Write a response to the customer...",
      rows: "3",
      "max-rows": "6"
    },
    model: {
      value: _vm.replyText,
      callback: function callback($$v) {
        _vm.replyText = $$v;
      },
      expression: "replyText"
    }
  }), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-between align-items-center"
  }, [_vm.activeThread && _vm.activeThread.mailboxConnection ? _c("small", {
    staticClass: "text-muted"
  }, [_c("b-icon", {
    staticClass: "mr-1 text-success",
    attrs: {
      icon: "envelope-check-fill"
    }
  }), _vm._v("\n                                    Sending from "), _c("strong", [_vm._v(_vm._s(_vm.activeThread.mailbox_email || "connected mailbox"))])], 1) : _c("small", {
    staticClass: "text-muted"
  }), _vm._v(" "), _c("b-button", {
    staticClass: "send-reply-btn px-5",
    attrs: {
      variant: "primary",
      disabled: !_vm.replyText.trim() || _vm.sendingReply
    },
    on: {
      click: _vm.sendQuickReply
    }
  }, [_vm.sendingReply ? _c("b-spinner", {
    staticClass: "mr-1",
    attrs: {
      small: ""
    }
  }) : _c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "reply-fill"
    }
  }), _vm._v("\n                                    " + _vm._s(_vm.sendingReply ? "Sending…" : "Send Reply") + "\n                                ")], 1)], 1)], 1)])]), _vm._v(" "), _c("transition", {
    attrs: {
      name: "drawer-slide"
    }
  }, [_vm.drawerOpen ? _c("div", {
    staticClass: "drawer-panel d-flex flex-column"
  }, [_c("div", {
    staticClass: "drawer-header d-flex align-items-center justify-content-between px-4 py-3"
  }, [_c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      gap: "12px"
    }
  }, [_c("b-icon", {
    staticClass: "text-primary",
    attrs: {
      icon: "grid-1x2-fill",
      "font-scale": "1.1"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "font-weight-bold",
    staticStyle: {
      color: "#1e293b",
      "font-size": "0.95rem",
      "font-family": "'Inter', sans-serif"
    }
  }, [_vm._v("Workspace")])], 1), _vm._v(" "), _c("div", {
    staticClass: "drawer-tabs d-flex",
    staticStyle: {
      gap: "4px"
    }
  }, _vm._l(_vm.filteredDrawerTabs, function (tab) {
    return _c("b-button", {
      key: tab.key,
      staticClass: "drawer-tab-btn",
      "class": {
        active: _vm.drawerTab === tab.key
      },
      on: {
        click: function click($event) {
          _vm.drawerTab = tab.key;
        }
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: tab.icon
      }
    }), _vm._v("\n                                    " + _vm._s(tab.label) + "\n                                ")], 1);
  }), 1), _vm._v(" "), _c("b-button", {
    staticClass: "drawer-close-btn",
    attrs: {
      variant: "light",
      size: "sm"
    },
    on: {
      click: function click($event) {
        _vm.drawerOpen = false;
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x",
      "font-scale": "1.2"
    }
  })], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "drawer-body flex-grow-1 overflow-hidden"
  }, [_vm.drawerTab === "focusair" ? _c("div", {
    staticClass: "drawer-tab-content drawer-tab-embed"
  }, [_c("FocusAir", {
    staticClass: "drawer-embedded-page",
    attrs: {
      "is-drawer": true
    }
  })], 1) : _vm._e(), _vm._v(" "), _vm.drawerTab === "focusair_import" ? _c("div", {
    staticClass: "drawer-tab-content drawer-tab-embed"
  }, [_c("FocusAirImport", {
    staticClass: "drawer-embedded-page",
    attrs: {
      "is-drawer": true
    }
  })], 1) : _vm._e(), _vm._v(" "), _vm.drawerTab === "sea_master" ? _c("div", {
    staticClass: "drawer-tab-content drawer-tab-embed"
  }, [_c("div", {
    staticClass: "workspace-link-card",
    on: {
      click: function click($event) {
        return _vm.navigateTo("/focus-sea-master");
      }
    }
  }, [_c("div", {
    staticClass: "workspace-link-icon",
    staticStyle: {
      background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)"
    }
  }, [_c("b-icon", {
    staticClass: "text-white",
    attrs: {
      icon: "file-earmark-text",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "flex-grow-1"
  }, [_c("h6", {
    staticClass: "font-weight-bold mb-1",
    staticStyle: {
      color: "#1e293b"
    }
  }, [_vm._v("Focus Sea Master")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0"
  }, [_vm._v("Create or edit Master Ocean Bills of Lading. Pre-linked to the active thread.")])]), _vm._v(" "), _c("b-icon", {
    staticClass: "text-info",
    attrs: {
      icon: "arrow-right-circle-fill",
      "font-scale": "1.3"
    }
  })], 1), _vm._v(" "), _vm.activeThread && _vm.activeThread.job ? _c("div", {
    staticClass: "mt-4 p-3 rounded-lg",
    staticStyle: {
      background: "#f0f9ff",
      border: "1px solid #bae6fd"
    }
  }, [_c("p", {
    staticClass: "small font-weight-bold mb-1",
    staticStyle: {
      color: "#0369a1"
    }
  }, [_vm._v("Linked Job")]), _vm._v(" "), _c("p", {
    staticClass: "mb-0 font-weight-bold",
    staticStyle: {
      color: "#1e293b"
    }
  }, [_vm._v(_vm._s(_vm.activeThread.job.enquiry_no) + " — " + _vm._s(_vm.activeThread.job.status))])]) : _c("div", {
    staticClass: "mt-4 p-3 rounded-lg",
    staticStyle: {
      background: "#fffbeb",
      border: "1px solid #fde68a"
    }
  }, [_c("p", {
    staticClass: "small mb-0",
    staticStyle: {
      color: "#92400e"
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-triangle-fill"
    }
  }), _vm._v("No job linked to this thread yet. Classify the email first to auto-create a job card.")], 1)])]) : _vm._e(), _vm._v(" "), _vm.drawerTab === "sea_house" ? _c("div", {
    staticClass: "drawer-tab-content"
  }, [_c("div", {
    staticClass: "workspace-link-card",
    on: {
      click: function click($event) {
        return _vm.navigateTo("/focus-sea-house");
      }
    }
  }, [_c("div", {
    staticClass: "workspace-link-icon",
    staticStyle: {
      background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)"
    }
  }, [_c("b-icon", {
    staticClass: "text-white",
    attrs: {
      icon: "file-earmark",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "flex-grow-1"
  }, [_c("h6", {
    staticClass: "font-weight-bold mb-1",
    staticStyle: {
      color: "#1e293b"
    }
  }, [_vm._v("Focus Sea House")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0"
  }, [_vm._v("Generate House Bills of Lading for ocean consolidation shipments.")])]), _vm._v(" "), _c("b-icon", {
    staticClass: "text-teal",
    attrs: {
      icon: "arrow-right-circle-fill",
      "font-scale": "1.3"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.drawerTab === "sea_consol" ? _c("div", {
    staticClass: "drawer-tab-content"
  }, [_c("div", {
    staticClass: "workspace-link-card",
    on: {
      click: function click($event) {
        return _vm.navigateTo("/focus-sea-consol");
      }
    }
  }, [_c("div", {
    staticClass: "workspace-link-icon",
    staticStyle: {
      background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
    }
  }, [_c("b-icon", {
    staticClass: "text-white",
    attrs: {
      icon: "folder2-open",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "flex-grow-1"
  }, [_c("h6", {
    staticClass: "font-weight-bold mb-1",
    staticStyle: {
      color: "#1e293b"
    }
  }, [_vm._v("Sea Consolidation")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0"
  }, [_vm._v("Group multiple ocean HBLs under a parent MBL container.")])]), _vm._v(" "), _c("b-icon", {
    staticClass: "text-warning",
    attrs: {
      icon: "arrow-right-circle-fill",
      "font-scale": "1.3"
    }
  })], 1)]) : _vm._e(), _vm._v(" "), _vm.drawerTab === "cost" ? _c("div", {
    staticClass: "drawer-tab-content"
  }, [!_vm.activeThread || !_vm.activeThread.job ? _c("div", {
    staticClass: "text-center py-5"
  }, [_c("b-icon", {
    staticClass: "text-warning mb-3",
    attrs: {
      icon: "exclamation-circle-fill",
      "font-scale": "3"
    }
  }), _vm._v(" "), _c("h5", [_vm._v("No operational job linked to this thread.")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small"
  }, [_vm._v("Triage the thread as a job first to manage ledger accounts.")])], 1) : _vm.loadingCostSheet ? _c("div", {
    staticClass: "text-center py-5"
  }, [_c("b-spinner", {
    staticClass: "text-primary mb-3"
  }), _vm._v(" "), _c("p", [_vm._v("Loading Job Cost Ledger...")])], 1) : _c("div", [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom"
  }, [_c("div", [_c("h6", {
    staticClass: "font-weight-bold mb-1 text-dark"
  }, [_vm._v("Job Cost Ledger")]), _vm._v(" "), _c("span", {
    staticClass: "badge badge-light-primary text-uppercase font-weight-bold",
    staticStyle: {
      "font-size": "0.8rem"
    }
  }, [_vm._v("\n                                                " + _vm._s(_vm.activeThread.job.enquiry_no) + "\n                                            ")])]), _vm._v(" "), _c("div", {
    staticClass: "text-right"
  }, [_c("span", {
    staticClass: "text-muted small d-block"
  }, [_vm._v("Est. Profit Margin:")]), _vm._v(" "), _c("span", {
    staticClass: "font-weight-bold",
    "class": _vm.profitMargin >= 0 ? "text-success" : "text-danger",
    staticStyle: {
      "font-size": "1.1rem"
    }
  }, [_vm._v("\n                                                $" + _vm._s(_vm.profitMargin.toFixed(2)) + " (" + _vm._s(_vm.profitMarginPercent.toFixed(1)) + "%)\n                                            ")])])]), _vm._v(" "), _c("div", {
    staticClass: "card mb-4 border shadow-sm"
  }, [_c("div", {
    staticClass: "card-header bg-light d-flex justify-content-between align-items-center py-2 px-3"
  }, [_c("strong", {
    staticClass: "text-primary small text-uppercase"
  }, [_vm._v("Revenue / Sell Charges")]), _vm._v(" "), _c("b-button", {
    staticClass: "py-0 px-2",
    staticStyle: {
      "font-size": "0.75rem"
    },
    attrs: {
      size: "sm",
      variant: "outline-primary"
    },
    on: {
      click: _vm.addInvoiceItem
    }
  }, [_vm._v("\n                                                + Add Charge\n                                            ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "card-body p-2"
  }, [_vm._l(_vm.costSheetInvoiceItems, function (item, idx) {
    return _c("div", {
      key: "inv-" + idx,
      staticClass: "mb-3 p-2 bg-light rounded position-relative"
    }, [_c("b-button", {
      staticClass: "text-danger position-absolute p-0",
      staticStyle: {
        right: "8px",
        top: "4px"
      },
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeInvoiceItem(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash-fill",
        "font-scale": "0.85"
      }
    })], 1), _vm._v(" "), _c("b-form-row", [_c("b-col", {
      staticClass: "pr-1",
      attrs: {
        cols: "6"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Charge Type")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        size: "sm",
        required: ""
      },
      model: {
        value: item.charge_type,
        callback: function callback($$v) {
          _vm.$set(item, "charge_type", $$v);
        },
        expression: "item.charge_type"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "pl-1",
      attrs: {
        cols: "6"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Description")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        size: "sm"
      },
      model: {
        value: item.description,
        callback: function callback($$v) {
          _vm.$set(item, "description", $$v);
        },
        expression: "item.description"
      }
    })], 1)], 1), _vm._v(" "), _c("b-form-row", {
      staticClass: "mt-2"
    }, [_c("b-col", {
      staticClass: "pr-1",
      attrs: {
        cols: "4"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Qty")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        size: "sm",
        step: "0.01"
      },
      on: {
        input: function input($event) {
          return _vm.calculateItemTotal(item);
        }
      },
      model: {
        value: item.qty,
        callback: function callback($$v) {
          _vm.$set(item, "qty", _vm._n($$v));
        },
        expression: "item.qty"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        cols: "4"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Sell Rate ($)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        size: "sm",
        step: "0.01"
      },
      on: {
        input: function input($event) {
          return _vm.calculateItemTotal(item);
        }
      },
      model: {
        value: item.unit_rate,
        callback: function callback($$v) {
          _vm.$set(item, "unit_rate", _vm._n($$v));
        },
        expression: "item.unit_rate"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "pl-1",
      attrs: {
        cols: "4"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Tax (%)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        size: "sm",
        step: "0.5"
      },
      on: {
        input: function input($event) {
          return _vm.calculateItemTotal(item);
        }
      },
      model: {
        value: item.tax_rate,
        callback: function callback($$v) {
          _vm.$set(item, "tax_rate", _vm._n($$v));
        },
        expression: "item.tax_rate"
      }
    })], 1)], 1), _vm._v(" "), _c("div", {
      staticClass: "text-right mt-2 text-dark font-weight-bold small"
    }, [_vm._v("\n                                                    Total: $" + _vm._s((item.total_amount || 0).toFixed(2)) + "\n                                                ")])], 1);
  }), _vm._v(" "), _c("div", {
    staticClass: "text-right pr-2 pt-2 border-top small font-weight-bold"
  }, [_vm._v("\n                                                Revenue Total: $" + _vm._s(_vm.costSheetInvoiceTotal.toFixed(2)) + "\n                                            ")])], 2)]), _vm._v(" "), _c("div", {
    staticClass: "card mb-4 border shadow-sm"
  }, [_c("div", {
    staticClass: "card-header bg-light d-flex justify-content-between align-items-center py-2 px-3"
  }, [_c("strong", {
    staticClass: "text-warning-dark small text-uppercase"
  }, [_vm._v("Expenses / Buy Vouchers")]), _vm._v(" "), _c("b-button", {
    staticClass: "py-0 px-2",
    staticStyle: {
      "font-size": "0.75rem"
    },
    attrs: {
      size: "sm",
      variant: "outline-warning"
    },
    on: {
      click: _vm.addPurchaseItem
    }
  }, [_vm._v("\n                                                + Add Cost\n                                            ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "card-body p-2"
  }, [_vm._l(_vm.costSheetPurchaseItems, function (item, idx) {
    return _c("div", {
      key: "pv-" + idx,
      staticClass: "mb-3 p-2 bg-light rounded position-relative"
    }, [_c("b-button", {
      staticClass: "text-danger position-absolute p-0",
      staticStyle: {
        right: "8px",
        top: "4px"
      },
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removePurchaseItem(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash-fill",
        "font-scale": "0.85"
      }
    })], 1), _vm._v(" "), _c("b-form-row", [_c("b-col", {
      staticClass: "pr-1",
      attrs: {
        cols: "6"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Cost Type")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        size: "sm",
        required: ""
      },
      model: {
        value: item.charge_type,
        callback: function callback($$v) {
          _vm.$set(item, "charge_type", $$v);
        },
        expression: "item.charge_type"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "pl-1",
      attrs: {
        cols: "6"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Description")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        size: "sm"
      },
      model: {
        value: item.description,
        callback: function callback($$v) {
          _vm.$set(item, "description", $$v);
        },
        expression: "item.description"
      }
    })], 1)], 1), _vm._v(" "), _c("b-form-row", {
      staticClass: "mt-2"
    }, [_c("b-col", {
      staticClass: "pr-1",
      attrs: {
        cols: "4"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Qty")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        size: "sm",
        step: "0.01"
      },
      on: {
        input: function input($event) {
          return _vm.calculateItemTotal(item);
        }
      },
      model: {
        value: item.qty,
        callback: function callback($$v) {
          _vm.$set(item, "qty", _vm._n($$v));
        },
        expression: "item.qty"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "px-1",
      attrs: {
        cols: "4"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Buy Rate ($)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        size: "sm",
        step: "0.01"
      },
      on: {
        input: function input($event) {
          return _vm.calculateItemTotal(item);
        }
      },
      model: {
        value: item.unit_rate,
        callback: function callback($$v) {
          _vm.$set(item, "unit_rate", _vm._n($$v));
        },
        expression: "item.unit_rate"
      }
    })], 1), _vm._v(" "), _c("b-col", {
      staticClass: "pl-1",
      attrs: {
        cols: "4"
      }
    }, [_c("label", {
      staticClass: "small text-muted mb-1"
    }, [_vm._v("Tax (%)")]), _vm._v(" "), _c("b-form-input", {
      attrs: {
        type: "number",
        size: "sm",
        step: "0.5"
      },
      on: {
        input: function input($event) {
          return _vm.calculateItemTotal(item);
        }
      },
      model: {
        value: item.tax_rate,
        callback: function callback($$v) {
          _vm.$set(item, "tax_rate", _vm._n($$v));
        },
        expression: "item.tax_rate"
      }
    })], 1)], 1), _vm._v(" "), _c("div", {
      staticClass: "text-right mt-2 text-dark font-weight-bold small"
    }, [_vm._v("\n                                                    Total: $" + _vm._s((item.total_amount || 0).toFixed(2)) + "\n                                                ")])], 1);
  }), _vm._v(" "), _c("div", {
    staticClass: "text-right pr-2 pt-2 border-top small font-weight-bold"
  }, [_vm._v("\n                                                Expense Total: $" + _vm._s(_vm.costSheetPurchaseTotal.toFixed(2)) + "\n                                            ")])], 2)]), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-button", {
    attrs: {
      size: "sm",
      variant: "light"
    },
    on: {
      click: _vm.fetchJobCostSheet
    }
  }, [_vm._v("Reset")]), _vm._v(" "), _c("b-button", {
    attrs: {
      size: "sm",
      variant: "primary",
      disabled: _vm.savingCostSheet
    },
    on: {
      click: _vm.saveJobCostSheet
    }
  }, [_vm.savingCostSheet ? _c("b-spinner", {
    staticClass: "mr-1",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v("\n                                            Save Ledger Draft\n                                        ")], 1)], 1)])]) : _vm._e()])]) : _vm._e()]), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "link-job-modal",
      title: "Link to Existing Job",
      "ok-title": "Link Job",
      "ok-variant": "primary",
      "cancel-variant": "light"
    },
    on: {
      ok: _vm.handleLinkJob
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Select Active Job",
      "label-for": "existing-job-select"
    }
  }, [_c("b-form-select", {
    attrs: {
      id: "existing-job-select",
      options: _vm.activeJobsOptions,
      required: ""
    },
    scopedSlots: _vm._u([{
      key: "first",
      fn: function fn() {
        return [_c("option", {
          attrs: {
            disabled: ""
          },
          domProps: {
            value: null
          }
        }, [_vm._v("-- Select an Active Job --")])];
      },
      proxy: true
    }]),
    model: {
      value: _vm.selectedExistingJobId,
      callback: function callback($$v) {
        _vm.selectedExistingJobId = $$v;
      },
      expression: "selectedExistingJobId"
    }
  })], 1)], 1), _vm._v(" "), _c("b-popover", {
    ref: "confirmPopover",
    attrs: {
      target: "btn-confirm-shipment",
      triggers: "click",
      placement: "bottomleft"
    },
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_vm._v("Confirm Shipment")];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "p-2",
    staticStyle: {
      width: "280px"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "AWB / MBL Number",
      "label-size": "sm"
    }
  }, [_c("b-form-input", {
    attrs: {
      size: "sm",
      placeholder: "e.g. 020-12345678",
      required: ""
    },
    model: {
      value: _vm.confirmAwb,
      callback: function callback($$v) {
        _vm.confirmAwb = $$v;
      },
      expression: "confirmAwb"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Assign Operator",
      "label-size": "sm"
    }
  }, [_c("b-form-select", {
    attrs: {
      options: _vm.operatorOptions,
      size: "sm",
      required: ""
    },
    scopedSlots: _vm._u([{
      key: "first",
      fn: function fn() {
        return [_c("option", {
          attrs: {
            disabled: ""
          },
          domProps: {
            value: null
          }
        }, [_vm._v("-- Select Operator --")])];
      },
      proxy: true
    }]),
    model: {
      value: _vm.confirmOperatorId,
      callback: function callback($$v) {
        _vm.confirmOperatorId = $$v;
      },
      expression: "confirmOperatorId"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Planned Clearance Date",
      "label-size": "sm"
    }
  }, [_c("b-form-input", {
    attrs: {
      type: "date",
      size: "sm",
      required: ""
    },
    model: {
      value: _vm.confirmClearanceDate,
      callback: function callback($$v) {
        _vm.confirmClearanceDate = $$v;
      },
      expression: "confirmClearanceDate"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end mt-2",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-button", {
    attrs: {
      size: "sm",
      variant: "light"
    },
    on: {
      click: _vm.closeConfirmPopover
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("b-button", {
    attrs: {
      size: "sm",
      variant: "success",
      disabled: _vm.confirmingShipment || !_vm.confirmAwb || !_vm.confirmOperatorId || !_vm.confirmClearanceDate
    },
    on: {
      click: _vm.submitConfirmShipment
    }
  }, [_vm.confirmingShipment ? _c("b-spinner", {
    staticClass: "mr-1",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v("\n                                Confirm\n                            ")], 1)], 1)], 1)]), _vm._v(" "), _c("b-popover", {
    ref: "lostPopover",
    attrs: {
      target: "btn-mark-lost",
      triggers: "click",
      placement: "bottomleft"
    },
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_vm._v("Mark as Lost")];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "p-2",
    staticStyle: {
      width: "280px"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Lost Reason",
      "label-size": "sm"
    }
  }, [_c("b-form-select", {
    attrs: {
      size: "sm",
      required: ""
    },
    model: {
      value: _vm.lostReason,
      callback: function callback($$v) {
        _vm.lostReason = $$v;
      },
      expression: "lostReason"
    }
  }, [_c("option", {
    attrs: {
      value: "rates_high"
    }
  }, [_vm._v("Rates High")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "delay_in_response"
    }
  }, [_vm._v("Delay in Response")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "client_cancelled"
    }
  }, [_vm._v("Client Cancelled")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "capacity_issue"
    }
  }, [_vm._v("Capacity Issue")]), _vm._v(" "), _c("option", {
    attrs: {
      value: "other"
    }
  }, [_vm._v("Other")])])], 1), _vm._v(" "), _vm.lostReason === "other" ? _c("b-form-group", {
    attrs: {
      label: "Custom Reason",
      "label-size": "sm"
    }
  }, [_c("b-form-textarea", {
    attrs: {
      size: "sm",
      rows: "2",
      placeholder: "Details..."
    },
    model: {
      value: _vm.lostReasonCustom,
      callback: function callback($$v) {
        _vm.lostReasonCustom = $$v;
      },
      expression: "lostReasonCustom"
    }
  })], 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end mt-2",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-button", {
    attrs: {
      size: "sm",
      variant: "light"
    },
    on: {
      click: _vm.closeLostPopover
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c("b-button", {
    attrs: {
      size: "sm",
      variant: "danger",
      disabled: _vm.savingLoss
    },
    on: {
      click: _vm.submitMarkLost
    }
  }, [_vm.savingLoss ? _c("b-spinner", {
    staticClass: "mr-1",
    attrs: {
      small: ""
    }
  }) : _vm._e(), _vm._v("\n                                Save Loss\n                            ")], 1)], 1)], 1)])], 1)])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/JobInbox.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/JobInbox.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _JobInbox_vue_vue_type_template_id_283c11e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JobInbox.vue?vue&type=template&id=283c11e0&scoped=true */ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=template&id=283c11e0&scoped=true");
/* harmony import */ var _JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JobInbox.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=script&lang=js");
/* harmony import */ var _JobInbox_vue_vue_type_style_index_0_id_283c11e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css");
/* harmony import */ var _JobInbox_vue_vue_type_style_index_1_id_283c11e0_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css */ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _JobInbox_vue_vue_type_template_id_283c11e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _JobInbox_vue_vue_type_template_id_283c11e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "283c11e0",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/JobInbox.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobInbox.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=template&id=283c11e0&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=template&id=283c11e0&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_template_id_283c11e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_template_id_283c11e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_template_id_283c11e0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobInbox.vue?vue&type=template&id=283c11e0&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=template&id=283c11e0&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_style_index_0_id_283c11e0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=0&id=283c11e0&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JobInbox_vue_vue_type_style_index_1_id_283c11e0_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/JobInbox.vue?vue&type=style&index=1&id=283c11e0&lang=css");


/***/ })

}]);