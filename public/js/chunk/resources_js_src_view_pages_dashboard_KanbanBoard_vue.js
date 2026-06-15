"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_dashboard_KanbanBoard_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "KanbanBoard",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      isDragging: false,
      jobs: [],
      operators: [],
      loadingJobs: false,
      currentView: "process",
      // "process" or "schedule"
      selectedOperatorId: null,
      startDateFilter: "",
      endDateFilter: "",
      milestoneDrawerOpen: false,
      selectedMilestoneJob: null,
      selectedMilestoneAwb: "",
      milestones: [{
        label: "Cargo Accepted",
        desc: "Shipment intake initialized and registered in system"
      }, {
        label: "Manifested",
        desc: "Cargo manifests compiled and cargo flight detail set"
      }, {
        label: "Departed",
        desc: "Aircraft/Vessel departed from origin station"
      }, {
        label: "Arrived",
        desc: "Cargo arrived at destination station port"
      }, {
        label: "Customs Cleared",
        desc: "Cargo cleared through local customs authorities"
      }, {
        label: "Delivered",
        desc: "Cargo delivered to consignee warehouse"
      }]
    };
  },
  computed: {
    currentUser: function currentUser() {
      return this.$store.getters.currentUser;
    },
    isViperCore: function isViperCore() {
      var tier = this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
      return !tier || tier === 'viper_core';
    },
    isPricing: function isPricing() {
      return this.currentUser && this.currentUser.designation === 'pricing';
    },
    isOps: function isOps() {
      return this.currentUser && this.currentUser.designation === 'operations';
    },
    filteredJobs: function filteredJobs() {
      var _this = this;
      var list = this.jobs;
      if (this.isOps) {
        list = list.filter(function (j) {
          return j.operator_id === _this.currentUser.id;
        });
      }

      // Filter by selected operator
      if (this.selectedOperatorId) {
        list = list.filter(function (j) {
          return j.operator_id === _this.selectedOperatorId;
        });
      }

      // Filter by planned clearance date range
      if (this.startDateFilter) {
        list = list.filter(function (j) {
          var dateStr = _this.getClearanceDate(j);
          if (!dateStr) return false;
          return dateStr >= _this.startDateFilter;
        });
      }
      if (this.endDateFilter) {
        list = list.filter(function (j) {
          var dateStr = _this.getClearanceDate(j);
          if (!dateStr) return false;
          return dateStr <= _this.endDateFilter;
        });
      }
      return list;
    },
    processColumns: function processColumns() {
      var cols = {
        "new": {
          title: "New",
          jobs: [],
          badgeClass: "secondary"
        },
        assigned: {
          title: "Assigned",
          jobs: [],
          badgeClass: "primary"
        },
        processing: {
          title: "Processing",
          jobs: [],
          badgeClass: "info"
        },
        awaiting_customer: {
          title: "Awaiting Customer",
          jobs: [],
          badgeClass: "warning"
        },
        completed: {
          title: "Completed",
          jobs: [],
          badgeClass: "success"
        }
      };
      this.filteredJobs.forEach(function (job) {
        var status = _typeof(job.status) === "object" && job.status !== null ? job.status.value || job.status.name : job.status;
        if (status === "Intake") {
          if (!job.operator_id) {
            cols["new"].jobs.push(job);
          } else {
            cols.assigned.jobs.push(job);
          }
        } else if (status === "AI Extraction" || status === "Verification") {
          cols.processing.jobs.push(job);
        } else if (status === "Generation" || status === "PDF Generated" || status === "Sent to Airline" || status === "Airline Confirmed") {
          cols.awaiting_customer.jobs.push(job);
        } else if (status === "Completed") {
          cols.completed.jobs.push(job);
        }
      });
      return cols;
    },
    scheduleColumns: function scheduleColumns() {
      var _this2 = this;
      var cols = {
        overdue: {
          title: "Overdue / Previous",
          jobs: [],
          badgeClass: "danger"
        },
        today: {
          title: "Today",
          jobs: [],
          badgeClass: "success"
        },
        tomorrow: {
          title: "Tomorrow",
          jobs: [],
          badgeClass: "info"
        },
        upcoming: {
          title: "Upcoming / Future",
          jobs: [],
          badgeClass: "secondary"
        }
      };
      var todayStr = new Date().toISOString().split("T")[0];
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split("T")[0];
      this.filteredJobs.forEach(function (job) {
        var dateStr = _this2.getClearanceDate(job);
        if (!dateStr) {
          // Show in upcoming/future if clearance date is unset so it is not lost
          cols.upcoming.jobs.push(job);
          return;
        }
        var jobDateStr = dateStr.split("T")[0];
        if (jobDateStr < todayStr) {
          if (job.status !== "Completed") {
            cols.overdue.jobs.push(job);
          } else {
            cols.upcoming.jobs.push(job);
          }
        } else if (jobDateStr === todayStr) {
          cols.today.jobs.push(job);
        } else if (jobDateStr === tomorrowStr) {
          cols.tomorrow.jobs.push(job);
        } else {
          cols.upcoming.jobs.push(job);
        }
      });
      return cols;
    },
    staffColumns: function staffColumns() {
      var _this3 = this;
      var cols = {};
      var opsStaff = this.operators.filter(function (op) {
        return op.designation === 'operations';
      });
      opsStaff.forEach(function (op) {
        cols[op.id] = {
          title: op.name,
          badgeClass: "primary",
          jobs: [],
          groups: {
            overdue: [],
            today: [],
            tomorrow: [],
            upcoming: []
          }
        };
      });
      // Add Unassigned column
      cols['unassigned'] = {
        title: "Unassigned",
        badgeClass: "secondary",
        jobs: [],
        groups: {
          overdue: [],
          today: [],
          tomorrow: [],
          upcoming: []
        }
      };
      var todayStr = new Date().toISOString().split("T")[0];
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split("T")[0];
      this.filteredJobs.forEach(function (job) {
        var opId = job.operator_id;
        var targetCol = opId && cols[opId] ? cols[opId] : cols['unassigned'];
        targetCol.jobs.push(job);

        // Group by clearance date
        var dateStr = _this3.getClearanceDate(job);
        if (!dateStr) {
          targetCol.groups.upcoming.push(job);
          return;
        }
        var jobDateStr = dateStr.split("T")[0];
        if (jobDateStr < todayStr) {
          if (job.status !== "Completed") {
            targetCol.groups.overdue.push(job);
          } else {
            targetCol.groups.upcoming.push(job);
          }
        } else if (jobDateStr === todayStr) {
          targetCol.groups.today.push(job);
        } else if (jobDateStr === tomorrowStr) {
          targetCol.groups.tomorrow.push(job);
        } else {
          targetCol.groups.upcoming.push(job);
        }
      });
      return cols;
    },
    stuckJobs: function stuckJobs() {
      return this.jobs.filter(function (job) {
        var status = _typeof(job.status) === "object" && job.status !== null ? job.status.value || job.status.name : job.status;
        if (status === "Completed" || status === "Lost") return false;
        var updated = new Date(job.updated_at);
        var diffMs = new Date() - updated;
        // Stuck if pending in current state for more than 30 minutes
        return diffMs > 30 * 60 * 1000;
      });
    },
    activeMilestoneIndex: function activeMilestoneIndex() {
      if (!this.selectedMilestoneJob) return -1;
      var status = _typeof(this.selectedMilestoneJob.status) === "object" && this.selectedMilestoneJob.status !== null ? this.selectedMilestoneJob.status.value || this.selectedMilestoneJob.status.name : this.selectedMilestoneJob.status;
      switch (status) {
        case "Intake":
        case "AI Extraction":
          return 0;
        // Cargo Accepted
        case "Verification":
        case "Generation":
          return 1;
        // Manifested
        case "PDF Generated":
          return 2;
        // Departed
        case "Sent to Airline":
          return 3;
        // Arrived
        case "Airline Confirmed":
          return 4;
        // Customs Cleared
        case "Completed":
          return 5;
        // Delivered
        default:
          return -1;
      }
    }
  },
  mounted: function mounted() {
    if (!this.isViperCore) {
      this.loadKanbanData();
    }
  },
  methods: {
    loadKanbanData: function loadKanbanData() {
      var _this4 = this;
      this.loadingJobs = true;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].get("/user/inbox/staff-workloads").then(function (res) {
        _this4.operators = res.data;
      })["catch"](function (err) {
        return console.error("Failed to load staff workloads:", err);
      });
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].query("/user/inbox/active-jobs", {
        params: {
          include_completed: 1
        }
      }).then(function (res) {
        _this4.jobs = res.data;
      })["catch"](function (err) {
        return console.error("Failed to load active jobs for Kanban:", err);
      })["finally"](function () {
        _this4.loadingJobs = false;
      });
    },
    getClearanceDate: function getClearanceDate(job) {
      if (job.transport_mode === "air" && job.air_shipment_detail) {
        return job.air_shipment_detail.flight_date;
      } else if (job.transport_mode === "sea" && job.sea_shipment_detail) {
        return job.sea_shipment_detail.vessel_etd;
      }
      return null;
    },
    formatClearanceDate: function formatClearanceDate(job) {
      var dateStr = this.getClearanceDate(job);
      if (!dateStr) return "Clearance date unset";
      var date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    },
    getAwbNumber: function getAwbNumber(job) {
      if (job.transport_mode === "air" && job.airway_bills && job.airway_bills.length > 0) {
        var wb = job.airway_bills[0];
        return wb.awb_code ? "".concat(wb.awb_code, "-").concat(wb.awb_no) : wb.awb_no;
      } else if (job.transport_mode === "sea" && job.houseway_bills && job.houseway_bills.length > 0) {
        var _wb = job.houseway_bills[0];
        return _wb.reference_id || _wb.awb_no;
      }
      return "";
    },
    getStatusBadgeVariant: function getStatusBadgeVariant(statusObj) {
      var status = _typeof(statusObj) === "object" && statusObj !== null ? statusObj.value || statusObj.name : statusObj;
      switch (status) {
        case "Intake":
          return "secondary";
        case "AI Extraction":
        case "Verification":
          return "info";
        case "Generation":
        case "PDF Generated":
        case "Sent to Airline":
        case "Airline Confirmed":
          return "warning";
        case "Completed":
          return "success";
        case "Lost":
          return "danger";
        default:
          return "light";
      }
    },
    getStuckDurationText: function getStuckDurationText(job) {
      var updated = new Date(job.updated_at);
      var diffMs = new Date() - updated;
      var diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) {
        return "".concat(diffMins, "m");
      }
      var diffHours = Math.floor(diffMins / 60);
      var remainMins = diffMins % 60;
      return "".concat(diffHours, "h ").concat(remainMins, "m");
    },
    setTodayFilter: function setTodayFilter() {
      var todayStr = new Date().toISOString().split("T")[0];
      this.startDateFilter = todayStr;
      this.endDateFilter = todayStr;
    },
    clearDateFilter: function clearDateFilter() {
      this.startDateFilter = "";
      this.endDateFilter = "";
    },
    openMilestoneDrawer: function openMilestoneDrawer(job) {
      this.selectedMilestoneJob = job;
      this.selectedMilestoneAwb = this.getAwbNumber(job) || "No waybill number allocated";
      this.milestoneDrawerOpen = true;
    },
    openJobInbox: function openJobInbox(job) {
      if (this.isDragging) return;
      if (job.email_threads && job.email_threads.length > 0) {
        var threadKey = job.email_threads[0].thread_key;
        this.$router.push({
          path: "/inbox",
          query: {
            thread_key: threadKey
          }
        });
      } else {
        this.$bvToast.toast("No linked email thread found for this operational job.", {
          title: "No Thread",
          variant: "info",
          solid: true
        });
      }
    },
    dragStart: function dragStart(e, job) {
      this.isDragging = true;
      e.dataTransfer.setData("text/plain", job.id.toString());
      e.dataTransfer.effectAllowed = "move";
    },
    dragEnd: function dragEnd() {
      var _this5 = this;
      setTimeout(function () {
        _this5.isDragging = false;
      }, 100);
    },
    dropCard: function dropCard(e, targetColKey) {
      var _this6 = this;
      var jobIdStr = e.dataTransfer.getData("text/plain");
      var jobId = parseInt(jobIdStr);
      if (!jobId) return;
      var job = this.jobs.find(function (j) {
        return j.id === jobId;
      });
      if (!job) return;
      if (this.currentView === "process") {
        var newStatus = job.status;
        var newOperatorId = job.operator_id;
        if (targetColKey === "new") {
          newStatus = "Intake";
          newOperatorId = null;
        } else if (targetColKey === "assigned") {
          newStatus = "Intake";
          newOperatorId = job.operator_id || (this.currentUser ? this.currentUser.id : null);
        } else if (targetColKey === "processing") {
          newStatus = "AI Extraction";
        } else if (targetColKey === "awaiting_customer") {
          newStatus = "Generation";
        } else if (targetColKey === "completed") {
          newStatus = "Completed";
        }
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/jobs/".concat(jobId, "/update-status"), {
          status: newStatus,
          operator_id: newOperatorId
        }).then(function () {
          _this6.$bvToast.toast("Job status updated to ".concat(newStatus), {
            title: "Success",
            variant: "success",
            solid: true
          });
          _this6.loadKanbanData();
        })["catch"](function (err) {
          console.error("Failed to update status on drop:", err);
          _this6.$bvToast.toast("Failed to update status.", {
            title: "Error",
            variant: "danger",
            solid: true
          });
        });
      } else if (this.currentView === "schedule") {
        if (this.isPricing) {
          var _newOperatorId = targetColKey === 'unassigned' ? null : parseInt(targetColKey);
          _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/jobs/".concat(jobId, "/update-status"), {
            operator_id: _newOperatorId
          }).then(function () {
            _this6.$bvToast.toast("Job assignment updated successfully.", {
              title: "Success",
              variant: "success",
              solid: true
            });
            _this6.loadKanbanData();
          })["catch"](function (err) {
            console.error("Failed to update job assignment on drop:", err);
            _this6.$bvToast.toast("Failed to update assignment.", {
              title: "Error",
              variant: "danger",
              solid: true
            });
          });
        } else {
          var newDate = "";
          var today = new Date();
          if (targetColKey === "overdue") {
            var yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            newDate = yesterday.toISOString().split("T")[0];
          } else if (targetColKey === "today") {
            newDate = today.toISOString().split("T")[0];
          } else if (targetColKey === "tomorrow") {
            var tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            newDate = tomorrow.toISOString().split("T")[0];
          } else if (targetColKey === "upcoming") {
            var future = new Date(today);
            future.setDate(future.getDate() + 3);
            newDate = future.toISOString().split("T")[0];
          }
          _core_services_api_service__WEBPACK_IMPORTED_MODULE_1__["default"].post("/user/inbox/jobs/".concat(jobId, "/update-status"), {
            planned_clearance_date: newDate
          }).then(function () {
            _this6.$bvToast.toast("Planned clearance date updated to ".concat(newDate), {
              title: "Success",
              variant: "success",
              solid: true
            });
            _this6.loadKanbanData();
          })["catch"](function (err) {
            console.error("Failed to update date on drop:", err);
            _this6.$bvToast.toast("Failed to update clearance date.", {
              title: "Error",
              variant: "danger",
              solid: true
            });
          });
        }
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true ***!
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
  return _c("b-container", {
    staticClass: "body-color",
    attrs: {
      fluid: ""
    }
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-lg-row"
  }, [_c("SideBar"), _vm._v(" "), _c("div", {
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
      "min-height": "82vh"
    }
  }, [_vm.isViperCore ? _c("div", {
    staticClass: "teaser-container mx-auto my-auto py-12 px-8 text-center rounded-lg shadow-lg"
  }, [_c("div", {
    staticClass: "icon-circle mb-6 mx-auto"
  }, [_c("b-icon", {
    staticClass: "lock-icon",
    attrs: {
      icon: "lock-fill",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("h3", {
    staticClass: "teaser-title mb-4"
  }, [_vm._v("Upgrade to Unlock Kanban Board")]), _vm._v(" "), _c("p", {
    staticClass: "teaser-description mb-6 mx-auto"
  }, [_vm._v("\n                    Transform your logistics operations with a dynamic Kanban workflow. Track jobs from initial email enquiry to final airline confirmation in real-time.\n                ")]), _vm._v(" "), _c("b-button", {
    staticClass: "upgrade-btn px-8 py-3",
    attrs: {
      variant: "primary"
    }
  }, [_vm._v("\n                    Upgrade to Viper Tactical / Command\n                ")])], 1) : _c("div", {
    staticClass: "kanban-workspace p-4 d-flex flex-column h-100"
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom",
    staticStyle: {
      gap: "16px"
    }
  }, [_c("div", [_c("span", {
    staticClass: "text-uppercase tracking-wider text-primary font-weight-bold small mb-1 d-block",
    staticStyle: {
      "letter-spacing": "1.5px",
      opacity: "0.7"
    }
  }, [_vm._v("\n                            Workflow Operations\n                        ")]), _vm._v(" "), _c("h4", {
    staticClass: "font-weight-extrabold text-dark mb-0 font-family-inter",
    staticStyle: {
      "letter-spacing": "-0.5px",
      "font-weight": "800"
    }
  }, [_vm._v("\n                            Operational Board\n                        ")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-button-group", {
    attrs: {
      size: "sm"
    }
  }, [_c("b-button", {
    staticClass: "px-3",
    attrs: {
      variant: _vm.currentView === "process" ? "primary" : "outline-primary"
    },
    on: {
      click: function click($event) {
        _vm.currentView = "process";
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "layout-three-columns"
    }
  }), _vm._v(" Process View\n                            ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "px-3",
    attrs: {
      variant: _vm.currentView === "schedule" ? "primary" : "outline-primary"
    },
    on: {
      click: function click($event) {
        _vm.currentView = "schedule";
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: _vm.isPricing ? "people-fill" : "calendar3"
    }
  }), _vm._v(" " + _vm._s(_vm.isPricing ? "Staff View" : "Schedule View") + "\n                            ")], 1)], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "filter-panel p-3 mb-4 rounded-lg bg-light border d-flex flex-wrap align-items-center justify-content-between",
    staticStyle: {
      gap: "16px"
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center flex-wrap",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("span", {
    staticClass: "small font-weight-bold text-muted text-uppercase"
  }, [_vm._v("Operator:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "filter-select",
    staticStyle: {
      width: "240px",
      "border-radius": "8px"
    },
    attrs: {
      size: "sm"
    },
    model: {
      value: _vm.selectedOperatorId,
      callback: function callback($$v) {
        _vm.selectedOperatorId = $$v;
      },
      expression: "selectedOperatorId"
    }
  }, [_c("option", {
    domProps: {
      value: null
    }
  }, [_vm._v("All Operators")]), _vm._v(" "), _vm._l(_vm.operators, function (op) {
    return _c("option", {
      key: op.id,
      domProps: {
        value: op.id
      }
    }, [_vm._v("\n                                " + _vm._s(op.name) + " (" + _vm._s(op.active_jobs) + " jobs) " + _vm._s(op.active_jobs >= 15 ? "🔴 OVERLOAD" : "🟢 OK") + "\n                            ")]);
  })], 2)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center flex-wrap",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("span", {
    staticClass: "small font-weight-bold text-muted text-uppercase"
  }, [_vm._v("Clearance:")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "filter-date-input",
    staticStyle: {
      width: "140px",
      "border-radius": "8px"
    },
    attrs: {
      type: "date",
      size: "sm"
    },
    model: {
      value: _vm.startDateFilter,
      callback: function callback($$v) {
        _vm.startDateFilter = $$v;
      },
      expression: "startDateFilter"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("to")]), _vm._v(" "), _c("b-form-input", {
    staticClass: "filter-date-input",
    staticStyle: {
      width: "140px",
      "border-radius": "8px"
    },
    attrs: {
      type: "date",
      size: "sm"
    },
    model: {
      value: _vm.endDateFilter,
      callback: function callback($$v) {
        _vm.endDateFilter = $$v;
      },
      expression: "endDateFilter"
    }
  }), _vm._v(" "), _c("b-button", {
    staticStyle: {
      "border-radius": "8px"
    },
    attrs: {
      size: "sm",
      variant: "outline-primary"
    },
    on: {
      click: _vm.setTodayFilter
    }
  }, [_vm._v("\n                            Today\n                        ")]), _vm._v(" "), _c("b-button", {
    staticClass: "text-muted p-0 ml-1",
    attrs: {
      size: "sm",
      variant: "link"
    },
    on: {
      click: _vm.clearDateFilter
    }
  }, [_vm._v("\n                            Clear\n                        ")])], 1)]), _vm._v(" "), _vm.stuckJobs.length > 0 ? _c("div", {
    staticClass: "stuck-banner p-3 mb-4 rounded-lg bg-light-warning border border-warning"
  }, [_c("div", {
    staticClass: "d-flex align-items-center mb-2"
  }, [_c("b-icon", {
    staticClass: "text-warning mr-2",
    attrs: {
      icon: "exclamation-triangle-fill",
      "font-scale": "1.2"
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "font-weight-bold text-warning-dark small text-uppercase"
  }, [_vm._v("\n                            Attention Required: Stuck Jobs (>30m Inactive)\n                        ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-wrap",
    staticStyle: {
      gap: "8px"
    }
  }, _vm._l(_vm.stuckJobs, function (job) {
    return _c("div", {
      key: job.id,
      staticClass: "stuck-chip p-2 rounded d-flex align-items-center cursor-pointer",
      on: {
        click: function click($event) {
          return _vm.openJobInbox(job);
        }
      }
    }, [_c("b-icon", {
      staticClass: "mr-1 text-warning",
      attrs: {
        icon: "clock-fill"
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "font-weight-bold mr-1"
    }, [_vm._v(_vm._s(job.execution_job_no || job.enquiry_no) + ":")]), _vm._v(" "), _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v(_vm._s(job.status) + " for " + _vm._s(_vm.getStuckDurationText(job)))])], 1);
  }), 0)]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "kanban-grid flex-grow-1 overflow-auto"
  }, [_vm.loadingJobs ? _c("b-spinner", {
    staticClass: "d-block mx-auto my-12 text-primary"
  }) : _c("div", {
    staticClass: "d-flex w-100",
    staticStyle: {
      gap: "16px",
      "min-height": "500px"
    }
  }, _vm._l(_vm.currentView === "process" ? _vm.processColumns : _vm.isPricing ? _vm.staffColumns : _vm.scheduleColumns, function (col, colKey) {
    return _c("div", {
      key: colKey,
      staticClass: "kanban-column d-flex flex-column rounded-xl p-3"
    }, [_c("div", {
      staticClass: "d-flex justify-content-between align-items-center mb-3"
    }, [_c("h6", {
      staticClass: "font-weight-bold mb-0 text-slate"
    }, [_vm._v(_vm._s(col.title))]), _vm._v(" "), _c("b-badge", {
      staticClass: "column-count-badge",
      attrs: {
        pill: "",
        variant: col.badgeClass
      }
    }, [_vm._v("\n                                    " + _vm._s(col.jobs.length) + "\n                                ")])], 1), _vm._v(" "), _c("div", {
      staticClass: "cards-container flex-grow-1 overflow-y-auto",
      staticStyle: {
        "max-height": "60vh"
      },
      on: {
        dragover: function dragover($event) {
          $event.preventDefault();
        },
        drop: function drop($event) {
          return _vm.dropCard($event, colKey);
        }
      }
    }, [col.jobs.length === 0 ? _c("div", {
      staticClass: "empty-column-placeholder text-center text-muted py-8 rounded"
    }, [_c("b-icon", {
      staticClass: "mb-2 opacity-5",
      attrs: {
        icon: "inbox",
        "font-scale": "1.5"
      }
    }), _vm._v(" "), _c("p", {
      staticClass: "small mb-0"
    }, [_vm._v("No jobs in this stage")])], 1) : _vm._e(), _vm._v(" "), _vm.currentView === "schedule" && _vm.isPricing ? [col.groups.overdue.length > 0 ? _c("div", {
      staticClass: "mb-3"
    }, [_c("div", {
      staticClass: "small font-weight-bold text-danger mb-2 px-1 text-uppercase tracking-wider"
    }, [_vm._v("\n                                            🔴 Overdue / Previous (" + _vm._s(col.groups.overdue.length) + ")\n                                        ")]), _vm._v(" "), _vm._l(col.groups.overdue, function (job) {
      return _c("div", {
        key: job.id,
        staticClass: "kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border border-danger-light position-relative",
        attrs: {
          draggable: "true"
        },
        on: {
          dragstart: function dragstart($event) {
            return _vm.dragStart($event, job);
          },
          dragend: _vm.dragEnd,
          click: function click($event) {
            return _vm.openJobInbox(job);
          }
        }
      }, [_c("div", {
        staticClass: "d-flex justify-content-between align-items-start mb-2"
      }, [_c("span", {
        staticClass: "job-card-id font-weight-bold text-primary"
      }, [_vm._v("\n                                                    " + _vm._s(job.execution_job_no || job.enquiry_no) + "\n                                                ")]), _vm._v(" "), _c("b-badge", {
        staticClass: "job-status-badge text-capitalize",
        attrs: {
          variant: _vm.getStatusBadgeVariant(job.status)
        }
      }, [_vm._v("\n                                                    " + _vm._s(job.status) + "\n                                                ")])], 1), _vm._v(" "), _c("div", {
        staticClass: "job-customer mb-2 text-truncate font-weight-bold small text-slate-dark"
      }, [_c("b-icon", {
        staticClass: "mr-1 text-muted",
        attrs: {
          icon: "person"
        }
      }), _vm._v("\n                                                " + _vm._s(job.client ? job.client.name : "Direct Consignment / Walk-in") + "\n                                            ")], 1), _vm._v(" "), _c("div", {
        staticClass: "job-awb-row mb-2 d-flex align-items-center justify-content-between small"
      }, [_c("span", {
        staticClass: "text-muted"
      }, [_vm._v("AWB/MBL:")]), _vm._v(" "), _vm.getAwbNumber(job) ? _c("a", {
        staticClass: "awb-link font-weight-extrabold text-success",
        attrs: {
          href: "#"
        },
        on: {
          click: function click($event) {
            $event.stopPropagation();
            $event.preventDefault();
            return _vm.openMilestoneDrawer(job);
          }
        }
      }, [_vm._v("\n                                                    " + _vm._s(_vm.getAwbNumber(job)) + "\n                                                ")]) : _c("span", {
        staticClass: "text-muted font-italic"
      }, [_vm._v("Unassigned")])]), _vm._v(" "), _c("div", {
        staticClass: "d-flex justify-content-between align-items-center mt-3 pt-2 border-top small",
        staticStyle: {
          gap: "4px"
        }
      }, [_c("div", {
        staticClass: "clearance-date-badge text-danger font-weight-bold"
      }, [_c("b-icon", {
        staticClass: "mr-1",
        attrs: {
          icon: "calendar-event"
        }
      }), _vm._v("\n                                                    " + _vm._s(_vm.formatClearanceDate(job)) + "\n                                                ")], 1)])]);
    })], 2) : _vm._e(), _vm._v(" "), col.groups.today.length > 0 ? _c("div", {
      staticClass: "mb-3"
    }, [_c("div", {
      staticClass: "small font-weight-bold text-success mb-2 px-1 text-uppercase tracking-wider"
    }, [_vm._v("\n                                            🟡 Today (" + _vm._s(col.groups.today.length) + ")\n                                        ")]), _vm._v(" "), _vm._l(col.groups.today, function (job) {
      return _c("div", {
        key: job.id,
        staticClass: "kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border border-success-light position-relative",
        attrs: {
          draggable: "true"
        },
        on: {
          dragstart: function dragstart($event) {
            return _vm.dragStart($event, job);
          },
          dragend: _vm.dragEnd,
          click: function click($event) {
            return _vm.openJobInbox(job);
          }
        }
      }, [_c("div", {
        staticClass: "d-flex justify-content-between align-items-start mb-2"
      }, [_c("span", {
        staticClass: "job-card-id font-weight-bold text-primary"
      }, [_vm._v("\n                                                    " + _vm._s(job.execution_job_no || job.enquiry_no) + "\n                                                ")]), _vm._v(" "), _c("b-badge", {
        staticClass: "job-status-badge text-capitalize",
        attrs: {
          variant: _vm.getStatusBadgeVariant(job.status)
        }
      }, [_vm._v("\n                                                    " + _vm._s(job.status) + "\n                                                ")])], 1), _vm._v(" "), _c("div", {
        staticClass: "job-customer mb-2 text-truncate font-weight-bold small text-slate-dark"
      }, [_c("b-icon", {
        staticClass: "mr-1 text-muted",
        attrs: {
          icon: "person"
        }
      }), _vm._v("\n                                                " + _vm._s(job.client ? job.client.name : "Direct Consignment / Walk-in") + "\n                                            ")], 1), _vm._v(" "), _c("div", {
        staticClass: "job-awb-row mb-2 d-flex align-items-center justify-content-between small"
      }, [_c("span", {
        staticClass: "text-muted"
      }, [_vm._v("AWB/MBL:")]), _vm._v(" "), _vm.getAwbNumber(job) ? _c("a", {
        staticClass: "awb-link font-weight-extrabold text-success",
        attrs: {
          href: "#"
        },
        on: {
          click: function click($event) {
            $event.stopPropagation();
            $event.preventDefault();
            return _vm.openMilestoneDrawer(job);
          }
        }
      }, [_vm._v("\n                                                    " + _vm._s(_vm.getAwbNumber(job)) + "\n                                                ")]) : _c("span", {
        staticClass: "text-muted font-italic"
      }, [_vm._v("Unassigned")])]), _vm._v(" "), _c("div", {
        staticClass: "d-flex justify-content-between align-items-center mt-3 pt-2 border-top small",
        staticStyle: {
          gap: "4px"
        }
      }, [_c("div", {
        staticClass: "clearance-date-badge text-success font-weight-bold"
      }, [_c("b-icon", {
        staticClass: "mr-1",
        attrs: {
          icon: "calendar-event"
        }
      }), _vm._v("\n                                                    " + _vm._s(_vm.formatClearanceDate(job)) + "\n                                                ")], 1)])]);
    })], 2) : _vm._e(), _vm._v(" "), col.groups.tomorrow.length > 0 ? _c("div", {
      staticClass: "mb-3"
    }, [_c("div", {
      staticClass: "small font-weight-bold text-info mb-2 px-1 text-uppercase tracking-wider"
    }, [_vm._v("\n                                            🔵 Tomorrow (" + _vm._s(col.groups.tomorrow.length) + ")\n                                        ")]), _vm._v(" "), _vm._l(col.groups.tomorrow, function (job) {
      return _c("div", {
        key: job.id,
        staticClass: "kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border position-relative",
        attrs: {
          draggable: "true"
        },
        on: {
          dragstart: function dragstart($event) {
            return _vm.dragStart($event, job);
          },
          dragend: _vm.dragEnd,
          click: function click($event) {
            return _vm.openJobInbox(job);
          }
        }
      }, [_c("div", {
        staticClass: "d-flex justify-content-between align-items-start mb-2"
      }, [_c("span", {
        staticClass: "job-card-id font-weight-bold text-primary"
      }, [_vm._v("\n                                                    " + _vm._s(job.execution_job_no || job.enquiry_no) + "\n                                                ")]), _vm._v(" "), _c("b-badge", {
        staticClass: "job-status-badge text-capitalize",
        attrs: {
          variant: _vm.getStatusBadgeVariant(job.status)
        }
      }, [_vm._v("\n                                                    " + _vm._s(job.status) + "\n                                                ")])], 1), _vm._v(" "), _c("div", {
        staticClass: "job-customer mb-2 text-truncate font-weight-bold small text-slate-dark"
      }, [_c("b-icon", {
        staticClass: "mr-1 text-muted",
        attrs: {
          icon: "person"
        }
      }), _vm._v("\n                                                " + _vm._s(job.client ? job.client.name : "Direct Consignment / Walk-in") + "\n                                            ")], 1), _vm._v(" "), _c("div", {
        staticClass: "job-awb-row mb-2 d-flex align-items-center justify-content-between small"
      }, [_c("span", {
        staticClass: "text-muted"
      }, [_vm._v("AWB/MBL:")]), _vm._v(" "), _vm.getAwbNumber(job) ? _c("a", {
        staticClass: "awb-link font-weight-extrabold text-success",
        attrs: {
          href: "#"
        },
        on: {
          click: function click($event) {
            $event.stopPropagation();
            $event.preventDefault();
            return _vm.openMilestoneDrawer(job);
          }
        }
      }, [_vm._v("\n                                                    " + _vm._s(_vm.getAwbNumber(job)) + "\n                                                ")]) : _c("span", {
        staticClass: "text-muted font-italic"
      }, [_vm._v("Unassigned")])]), _vm._v(" "), _c("div", {
        staticClass: "d-flex justify-content-between align-items-center mt-3 pt-2 border-top small",
        staticStyle: {
          gap: "4px"
        }
      }, [_c("div", {
        staticClass: "clearance-date-badge text-info font-weight-bold"
      }, [_c("b-icon", {
        staticClass: "mr-1",
        attrs: {
          icon: "calendar-event"
        }
      }), _vm._v("\n                                                    " + _vm._s(_vm.formatClearanceDate(job)) + "\n                                                ")], 1)])]);
    })], 2) : _vm._e(), _vm._v(" "), col.groups.upcoming.length > 0 ? _c("div", {
      staticClass: "mb-3"
    }, [_c("div", {
      staticClass: "small font-weight-bold text-secondary mb-2 px-1 text-uppercase tracking-wider"
    }, [_vm._v("\n                                            🟢 Upcoming / Future (" + _vm._s(col.groups.upcoming.length) + ")\n                                        ")]), _vm._v(" "), _vm._l(col.groups.upcoming, function (job) {
      return _c("div", {
        key: job.id,
        staticClass: "kanban-card p-3 mb-2 bg-white rounded-lg shadow-sm border position-relative",
        attrs: {
          draggable: "true"
        },
        on: {
          dragstart: function dragstart($event) {
            return _vm.dragStart($event, job);
          },
          dragend: _vm.dragEnd,
          click: function click($event) {
            return _vm.openJobInbox(job);
          }
        }
      }, [_c("div", {
        staticClass: "d-flex justify-content-between align-items-start mb-2"
      }, [_c("span", {
        staticClass: "job-card-id font-weight-bold text-primary"
      }, [_vm._v("\n                                                    " + _vm._s(job.execution_job_no || job.enquiry_no) + "\n                                                ")]), _vm._v(" "), _c("b-badge", {
        staticClass: "job-status-badge text-capitalize",
        attrs: {
          variant: _vm.getStatusBadgeVariant(job.status)
        }
      }, [_vm._v("\n                                                    " + _vm._s(job.status) + "\n                                                ")])], 1), _vm._v(" "), _c("div", {
        staticClass: "job-customer mb-2 text-truncate font-weight-bold small text-slate-dark"
      }, [_c("b-icon", {
        staticClass: "mr-1 text-muted",
        attrs: {
          icon: "person"
        }
      }), _vm._v("\n                                                " + _vm._s(job.client ? job.client.name : "Direct Consignment / Walk-in") + "\n                                            ")], 1), _vm._v(" "), _c("div", {
        staticClass: "job-awb-row mb-2 d-flex align-items-center justify-content-between small"
      }, [_c("span", {
        staticClass: "text-muted"
      }, [_vm._v("AWB/MBL:")]), _vm._v(" "), _vm.getAwbNumber(job) ? _c("a", {
        staticClass: "awb-link font-weight-extrabold text-success",
        attrs: {
          href: "#"
        },
        on: {
          click: function click($event) {
            $event.stopPropagation();
            $event.preventDefault();
            return _vm.openMilestoneDrawer(job);
          }
        }
      }, [_vm._v("\n                                                    " + _vm._s(_vm.getAwbNumber(job)) + "\n                                                ")]) : _c("span", {
        staticClass: "text-muted font-italic"
      }, [_vm._v("Unassigned")])]), _vm._v(" "), _c("div", {
        staticClass: "d-flex justify-content-between align-items-center mt-3 pt-2 border-top small",
        staticStyle: {
          gap: "4px"
        }
      }, [_c("div", {
        staticClass: "clearance-date-badge text-muted"
      }, [_c("b-icon", {
        staticClass: "mr-1",
        attrs: {
          icon: "calendar-event"
        }
      }), _vm._v("\n                                                    " + _vm._s(_vm.formatClearanceDate(job)) + "\n                                                ")], 1)])]);
    })], 2) : _vm._e()] : _vm._l(col.jobs, function (job) {
      return _c("div", {
        key: job.id,
        staticClass: "kanban-card p-3 mb-3 bg-white rounded-lg shadow-sm border position-relative",
        attrs: {
          draggable: "true"
        },
        on: {
          dragstart: function dragstart($event) {
            return _vm.dragStart($event, job);
          },
          dragend: _vm.dragEnd,
          click: function click($event) {
            return _vm.openJobInbox(job);
          }
        }
      }, [_c("div", {
        staticClass: "d-flex justify-content-between align-items-start mb-2"
      }, [_c("span", {
        staticClass: "job-card-id font-weight-bold text-primary"
      }, [_vm._v("\n                                                " + _vm._s(job.execution_job_no || job.enquiry_no) + "\n                                            ")]), _vm._v(" "), _c("b-badge", {
        staticClass: "job-status-badge text-capitalize",
        attrs: {
          variant: _vm.getStatusBadgeVariant(job.status)
        }
      }, [_vm._v("\n                                                " + _vm._s(job.status) + "\n                                            ")])], 1), _vm._v(" "), _c("div", {
        staticClass: "job-customer mb-2 text-truncate font-weight-bold small text-slate-dark"
      }, [_c("b-icon", {
        staticClass: "mr-1 text-muted",
        attrs: {
          icon: "person"
        }
      }), _vm._v("\n                                            " + _vm._s(job.client ? job.client.name : "Direct Consignment / Walk-in") + "\n                                        ")], 1), _vm._v(" "), _c("div", {
        staticClass: "job-awb-row mb-2 d-flex align-items-center justify-content-between small"
      }, [_c("span", {
        staticClass: "text-muted"
      }, [_vm._v("AWB/MBL:")]), _vm._v(" "), _vm.getAwbNumber(job) ? _c("a", {
        staticClass: "awb-link font-weight-extrabold text-success",
        attrs: {
          href: "#"
        },
        on: {
          click: function click($event) {
            $event.stopPropagation();
            $event.preventDefault();
            return _vm.openMilestoneDrawer(job);
          }
        }
      }, [_vm._v("\n                                                " + _vm._s(_vm.getAwbNumber(job)) + "\n                                            ")]) : _c("span", {
        staticClass: "text-muted font-italic"
      }, [_vm._v("Unassigned")])]), _vm._v(" "), _c("div", {
        staticClass: "d-flex justify-content-between align-items-center mt-3 pt-2 border-top small",
        staticStyle: {
          gap: "4px"
        }
      }, [_c("div", {
        staticClass: "clearance-date-badge text-muted"
      }, [_c("b-icon", {
        staticClass: "mr-1",
        attrs: {
          icon: "calendar-event"
        }
      }), _vm._v("\n                                                " + _vm._s(_vm.formatClearanceDate(job)) + "\n                                            ")], 1), _vm._v(" "), _c("div", {
        staticClass: "operator-profile text-muted text-truncate",
        staticStyle: {
          "max-width": "100px"
        }
      }, [_c("b-icon", {
        staticClass: "mr-1",
        "class": job.operator ? "text-primary" : "text-muted",
        attrs: {
          icon: "person-circle"
        }
      }), _vm._v("\n                                                " + _vm._s(job.operator ? job.operator.name : "Unassigned") + "\n                                            ")], 1)])]);
    })], 2)]);
  }), 0)], 1)])])], 1), _vm._v(" "), _c("b-sidebar", {
    attrs: {
      id: "milestone-drawer",
      title: "Milestone Tracking Drawer",
      right: "",
      shadow: "",
      "no-header-close": "",
      width: "320px"
    },
    model: {
      value: _vm.milestoneDrawerOpen,
      callback: function callback($$v) {
        _vm.milestoneDrawerOpen = $$v;
      },
      expression: "milestoneDrawerOpen"
    }
  }, [_c("div", {
    staticClass: "px-4 py-3 h-100 d-flex flex-column font-family-inter"
  }, [_vm.selectedMilestoneJob ? _c("div", {
    staticClass: "mb-4"
  }, [_c("h5", {
    staticClass: "font-weight-extrabold text-primary mb-1"
  }, [_vm._v("\n                    " + _vm._s(_vm.selectedMilestoneJob.execution_job_no || _vm.selectedMilestoneJob.enquiry_no) + "\n                ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-2"
  }, [_vm._v("\n                    Client: "), _c("strong", [_vm._v(_vm._s(_vm.selectedMilestoneJob.client ? _vm.selectedMilestoneJob.client.name : "Direct Consignment"))])]), _vm._v(" "), _c("div", {
    staticClass: "p-2 bg-light rounded-lg border text-center"
  }, [_c("span", {
    staticClass: "text-muted small d-block"
  }, [_vm._v("Waybill Document Number:")]), _vm._v(" "), _c("strong", {
    staticClass: "text-success font-weight-black",
    staticStyle: {
      "font-size": "1rem"
    }
  }, [_vm._v("\n                        " + _vm._s(_vm.selectedMilestoneAwb) + "\n                    ")])])]) : _vm._e(), _vm._v(" "), _c("hr", {
    staticClass: "my-2"
  }), _vm._v(" "), _c("div", {
    staticClass: "milestone-timeline flex-grow-1 py-3"
  }, _vm._l(_vm.milestones, function (m, idx) {
    return _c("div", {
      key: idx,
      staticClass: "milestone-item position-relative d-flex mb-4",
      "class": {
        completed: idx <= _vm.activeMilestoneIndex
      }
    }, [idx < _vm.milestones.length - 1 ? _c("div", {
      staticClass: "timeline-line"
    }) : _vm._e(), _vm._v(" "), _c("div", {
      staticClass: "milestone-marker d-flex align-items-center justify-content-center z-index-1"
    }, [_c("b-icon", {
      attrs: {
        icon: idx <= _vm.activeMilestoneIndex ? "check-circle-fill" : "circle",
        variant: idx <= _vm.activeMilestoneIndex ? "success" : "secondary",
        "font-scale": "1.2"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "milestone-content pl-3 flex-grow-1"
    }, [_c("h6", {
      staticClass: "mb-1 font-weight-bold",
      "class": idx <= _vm.activeMilestoneIndex ? "text-success" : "text-slate-muted"
    }, [_vm._v("\n                            " + _vm._s(m.label) + "\n                        ")]), _vm._v(" "), _c("p", {
      staticClass: "text-muted small mb-0"
    }, [_vm._v(_vm._s(m.desc))])])]);
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "mt-auto pt-3 border-top"
  }, [_vm.selectedMilestoneJob ? _c("b-button", {
    attrs: {
      variant: "primary",
      block: "",
      size: "sm"
    },
    on: {
      click: function click($event) {
        return _vm.openJobInbox(_vm.selectedMilestoneJob);
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "envelope-fill"
    }
  }), _vm._v(" Open Inbox Workflow\n                ")], 1) : _vm._e()], 1)])])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue":
/*!***************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/KanbanBoard.vue ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _KanbanBoard_vue_vue_type_template_id_78fc7cb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true */ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true");
/* harmony import */ var _KanbanBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./KanbanBoard.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=script&lang=js");
/* harmony import */ var _KanbanBoard_vue_vue_type_style_index_0_id_78fc7cb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _KanbanBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _KanbanBoard_vue_vue_type_template_id_78fc7cb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _KanbanBoard_vue_vue_type_template_id_78fc7cb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "78fc7cb0",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/KanbanBoard.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=script&lang=js":
/*!***************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=script&lang=js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_KanbanBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./KanbanBoard.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_KanbanBoard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_KanbanBoard_vue_vue_type_template_id_78fc7cb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_KanbanBoard_vue_vue_type_template_id_78fc7cb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_KanbanBoard_vue_vue_type_template_id_78fc7cb0_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=template&id=78fc7cb0&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css":
/*!***********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_KanbanBoard_vue_vue_type_style_index_0_id_78fc7cb0_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/KanbanBoard.vue?vue&type=style&index=0&id=78fc7cb0&scoped=true&lang=css");


/***/ })

}]);