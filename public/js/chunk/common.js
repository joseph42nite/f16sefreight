(self["webpackChunk"] = self["webpackChunk"] || []).push([["common"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "DashboardHistoryModal",
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      "default": 'send'
    },
    // 'draft' or 'send'
    docType: {
      type: String,
      required: true
    },
    // 'master', 'house', 'consolidation'
    items: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    isFetching: {
      type: Boolean,
      "default": false
    }
  },
  methods: {
    getAirport: function getAirport(val) {
      if (!val) return "-";
      return val.split(',')[0].trim();
    },
    handleMainClick: function handleMainClick(item) {
      if (this.docType === 'consolidation') {
        this.$emit('action', item);
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "OcrUploadModal",
  props: {
    initialType: {
      type: String,
      "default": 'ksr'
    },
    category: {
      type: String,
      "default": '',
      validator: function validator(v) {
        return v === '' || ['focus_air', 'house_air', 'focus_air_import'].includes(v);
      }
    },
    isDrawer: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      selectedUploadType: this.initialType,
      // Single-file mode (Viper Core)
      selectedFile: null,
      // Multi-file mode (Tactical/Command)
      selectedFiles: [],
      // Array of { file: File, role: String }
      dragActive: false,
      // Shared state
      isUploading: false,
      ocrPollInterval: null,
      ocrJobId: null,
      ocrStatusMessage: '',
      fetchedConfig: null,
      showInline: false
    };
  },
  computed: {
    currentUser: function currentUser() {
      return this.$store.getters.currentUser;
    },
    companyTier: function companyTier() {
      return this.currentUser && this.currentUser.company ? this.currentUser.company.tier : null;
    },
    isMultiMode: function isMultiMode() {
      // Tactical and Command tiers get multi-PDF mode
      return this.companyTier === 'viper_tactical' || this.companyTier === 'viper_command';
    },
    templatesConfig: function templatesConfig() {
      return this.fetchedConfig || (this.currentUser ? this.currentUser.templates_config : null);
    },
    allowedTemplates: function allowedTemplates() {
      var list = [];
      if (this.templatesConfig && this.templatesConfig.allowed_templates && this.templatesConfig.allowed_templates.length > 0) {
        list = _toConsumableArray(this.templatesConfig.allowed_templates);
      } else {
        list = [{
          key: 'ksr',
          label: 'Standard (ksr)'
        }, {
          key: 'ksr_house1',
          label: 'House 1'
        }, {
          key: 'ksr_house2',
          label: 'House 2'
        }, {
          key: 'ksr_apex_house',
          label: 'Apex House'
        }];
      }
      if (this.isMultiMode) {
        if (!list.some(function (tpl) {
          return tpl.key === 'commercial_invoice';
        })) {
          list.push({
            key: 'commercial_invoice',
            label: 'Commercial Invoice'
          });
        }
        if (!list.some(function (tpl) {
          return tpl.key === 'packing_list';
        })) {
          list.push({
            key: 'packing_list',
            label: 'Packing List'
          });
        }
      }
      return list;
    }
  },
  mounted: function mounted() {
    this.loadActiveConfiguration();
  },
  watch: {
    templatesConfig: {
      handler: function handler(val) {
        if (val) this.applyDefaults();
      },
      immediate: true
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.stopOcrPolling();
  },
  methods: {
    loadActiveConfiguration: function loadActiveConfiguration() {
      var _this = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get('/user/company-templates').then(function (_ref) {
        var data = _ref.data;
        _this.fetchedConfig = data;
        _this.applyDefaults();
      })["catch"](function (err) {
        console.warn('[OCR] Direct fallback active: using ambient memory payload.', err);
        _this.applyDefaults();
      });
    },
    applyDefaults: function applyDefaults() {
      var config = this.templatesConfig;
      if (!config) return;
      if (this.category === 'focus_air' && config.default_focus_air) {
        this.selectedUploadType = config.default_focus_air;
      } else if (this.category === 'house_air' && config.default_house_air) {
        this.selectedUploadType = config.default_house_air;
      }
    },
    getActiveFileInput: function getActiveFileInput() {
      return this.isDrawer ? this.$refs.fileInputInline : this.$refs.fileInput;
    },
    triggerFileInput: function triggerFileInput() {
      var input = this.getActiveFileInput();
      if (input) input.click();
    },
    openInline: function openInline() {
      this.showInline = true;
      this.resetModal();
    },
    closeInline: function closeInline() {
      this.showInline = false;
      this.resetModal();
    },
    // --- Single File Mode Handlers (Viper Core) ---
    handleFileSelect: function handleFileSelect(event) {
      var file = event.target.files[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          alert('Please select a PDF file only');
          var input = this.getActiveFileInput();
          if (input) input.value = '';
          return;
        }
        this.selectedFile = file;
      }
    },
    // --- Multi File Mode Handlers (Tactical/Command) ---
    handleMultiFileSelect: function handleMultiFileSelect(event) {
      var files = Array.from(event.target.files);
      this.addFiles(files);
      var input = this.getActiveFileInput();
      if (input) input.value = '';
    },
    handleDrop: function handleDrop(event) {
      var _this2 = this;
      this.dragActive = false;

      // Check if there is attachment data in the drag event
      var attData = event.dataTransfer.getData('application/json');
      if (attData) {
        try {
          var att = JSON.parse(attData);
          if (att && att.id && att.filename) {
            this.isUploading = true;
            this.ocrStatusMessage = "Downloading \"".concat(att.filename, "\"...");
            _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/inbox/attachments/".concat(att.id, "/download"), {
              responseType: 'blob'
            }).then(function (response) {
              var blob = response.data;
              var file = new File([blob], att.filename, {
                type: att.mime_type || 'application/pdf'
              });
              if (_this2.isMultiMode) {
                _this2.addFiles([file]);
              } else {
                if (file.type !== 'application/pdf') {
                  alert('Please select a PDF file only');
                  return;
                }
                _this2.selectedFile = file;
              }
            })["catch"](function (err) {
              console.error('Failed to retrieve attachment file:', err);
              alert("Failed to download attachment \"".concat(att.filename, "\"."));
            })["finally"](function () {
              _this2.isUploading = false;
              _this2.ocrStatusMessage = '';
            });
            return; // Drag handled
          }
        } catch (e) {
          console.error('Error parsing drag drop data:', e);
        }
      }

      // Fallback to standard files from OS drag-and-drop
      var files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        if (this.isMultiMode) {
          this.addFiles(files);
        } else {
          var file = files[0];
          if (file.type !== 'application/pdf') {
            alert('Please select a PDF file only');
            return;
          }
          this.selectedFile = file;
        }
      }
    },
    addFiles: function addFiles(files) {
      var _this3 = this;
      var _iterator = _createForOfIteratorHelper(files),
        _step;
      try {
        var _loop = function _loop() {
            var file = _step.value;
            if (file.type !== 'application/pdf') {
              alert("\"".concat(file.name, "\" is not a PDF and was skipped."));
              return 0; // continue
            }
            if (_this3.selectedFiles.length >= 5) {
              alert('Maximum 5 files allowed. Extra files were not added.');
              return 1; // break
            }
            // Check for duplicate filenames
            if (_this3.selectedFiles.some(function (f) {
              return f.file.name === file.name && f.file.size === file.size;
            })) {
              return 0; // continue
              // Skip duplicate
            }
            _this3.selectedFiles.push({
              file: file,
              role: 'full' // Default role
            });
          },
          _ret;
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _ret = _loop();
          if (_ret === 0) continue;
          if (_ret === 1) break;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    },
    removeFile: function removeFile(idx) {
      this.selectedFiles.splice(idx, 1);
    },
    // --- Upload Submission ---
    submitUpload: function submitUpload() {
      if (this.isUploading) return;
      if (this.isMultiMode) {
        this.submitMultiUpload();
      } else {
        this.submitSingleUpload();
      }
    },
    submitSingleUpload: function submitSingleUpload() {
      var _this4 = this;
      if (!this.selectedFile) {
        this.triggerFileInput();
        return;
      }
      this.isUploading = true;
      this.ocrStatusMessage = 'Uploading file...';
      var formData = new FormData();
      formData.append('upload_file', this.selectedFile);
      formData.append('type', this.selectedUploadType);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post('/user/upload-awb-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        if (response.data && response.data.job_id) {
          _this4.ocrJobId = response.data.job_id;
          _this4.ocrStatusMessage = 'File loaded. Analyzing...';
          _this4.startOcrPolling(response.data.job_id);
        } else {
          throw new Error('Failed to generate job reference ID.');
        }
      })["catch"](function (error) {
        _this4.isUploading = false;
        _this4.ocrStatusMessage = '';
        var input = _this4.getActiveFileInput();
        if (input) input.value = '';
        if (error.response && error.response.status === 429) {
          alert('Speed limit reached! Please wait a minute before your next upload to protect server capacity.');
        } else {
          alert('Encountered failure preparing document for analysis.');
        }
      });
    },
    submitMultiUpload: function submitMultiUpload() {
      var _this5 = this;
      if (this.selectedFiles.length === 0) {
        this.triggerFileInput();
        return;
      }
      this.isUploading = true;
      this.ocrStatusMessage = "Uploading ".concat(this.selectedFiles.length, " document(s)...");
      var formData = new FormData();
      var roles = [];
      this.selectedFiles.forEach(function (entry, idx) {
        formData.append('upload_files[]', entry.file);
        roles.push({
          index: idx,
          role: entry.role
        });
      });
      formData.append('roles', JSON.stringify(roles));
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].post('/user/upload-awb-files-multi', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        if (response.data && response.data.job_id) {
          _this5.ocrJobId = response.data.job_id;
          _this5.ocrStatusMessage = "".concat(_this5.selectedFiles.length, " files loaded. AI extraction in progress...");
          _this5.startOcrPolling(response.data.job_id);
        } else {
          throw new Error('Failed to generate job reference ID.');
        }
      })["catch"](function (error) {
        _this5.isUploading = false;
        _this5.ocrStatusMessage = '';
        if (error.response && error.response.status === 429) {
          alert('Speed limit reached! Please wait before your next upload.');
        } else if (error.response && error.response.status === 403) {
          alert('Multi-document upload requires Viper Tactical or Command subscription.');
        } else {
          alert('Encountered failure preparing documents for analysis.');
        }
      });
    },
    startOcrPolling: function startOcrPolling(jobId) {
      var _this6 = this;
      this.stopOcrPolling();
      this.ocrPollInterval = setInterval(function () {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"].get("/user/ocr-status/".concat(jobId)).then(function (res) {
          var data = res.data;
          if (data.job_status === 'processing') {
            _this6.ocrStatusMessage = _this6.isMultiMode ? 'Merging extracted data from all documents...' : 'Extracting IATA fields...';
          }
          if (data.job_status === 'completed') {
            _this6.stopOcrPolling();
            _this6.ocrStatusMessage = '';
            _this6.isUploading = false;
            if (!_this6.isDrawer) {
              _this6.$bvModal.hide('upload-file-modal');
            } else {
              _this6.showInline = false;
            }
            _this6.$emit('extracted', data.data);
            _this6.resetModal();
          } else if (data.job_status === 'failed') {
            _this6.stopOcrPolling();
            _this6.isUploading = false;
            _this6.ocrStatusMessage = '';
            alert('Parsing failure: ' + (data.error || 'Unknown engine error'));
          }
        })["catch"](function (err) {
          _this6.stopOcrPolling();
          _this6.isUploading = false;
          _this6.ocrStatusMessage = '';
        });
      }, 800);
    },
    stopOcrPolling: function stopOcrPolling() {
      if (this.ocrPollInterval) {
        clearInterval(this.ocrPollInterval);
        this.ocrPollInterval = null;
      }
    },
    resetModal: function resetModal() {
      this.selectedFile = null;
      this.selectedFiles = [];
      this.isUploading = false;
      this.ocrStatusMessage = '';
      this.ocrJobId = null;
      this.dragActive = false;
      var input = this.getActiveFileInput();
      if (input) {
        input.value = '';
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SkeletonTable",
  props: {
    rows: {
      type: Number,
      "default": 5
    },
    columns: {
      type: Number,
      "default": 4
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "SideBar",
  props: {
    collapsed: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      primaryText: "/media/assets/ui/side-menu/H1-primary-text.svg",
      isMobileMenuOpen: false
    };
  },
  computed: {
    currentUser: function currentUser() {
      return this.$store.getters.currentUser;
    },
    companyTier: function companyTier() {
      return this.currentUser && this.currentUser.company ? this.currentUser.company.tier : 'viper_core';
    },
    menuItems: function menuItems() {
      var isSales = this.currentUser && this.currentUser.designation === 'sales';
      var isBoss = this.currentUser && this.currentUser.designation === 'boss';

      // Sales role sees a stripped-down sidebar: Analytics, Mailbox, Kanban only
      if (isSales) {
        return [{
          label: "Analytics",
          path: "/analytics",
          icon: "bar-chart",
          activePaths: ['/analytics']
        }, {
          label: "Mail/Inbox",
          path: "/inbox",
          icon: "mailbox",
          activePaths: ['/inbox']
        }, {
          label: "Kanban Board",
          path: "/kanban",
          icon: "grid-3x3-gap",
          activePaths: ['/kanban']
        }];
      }

      // Boss sees Analytics, Inbox, Kanban — and Financials if Command tier
      if (isBoss) {
        var bossList = [{
          label: "Analytics",
          path: "/analytics",
          icon: "bar-chart",
          activePaths: ['/analytics']
        }, {
          label: "Mail/Inbox",
          path: "/inbox",
          icon: "mailbox",
          activePaths: ['/inbox']
        }, {
          label: "Kanban Board",
          path: "/kanban",
          icon: "grid-3x3-gap",
          activePaths: ['/kanban']
        }];
        if (this.companyTier === 'viper_command') {
          bossList.push({
            label: "Financials",
            path: "/financials",
            icon: "cash",
            activePaths: ['/financials']
          });
        }
        return bossList;
      }
      var list = [{
        label: "Mail/Inbox",
        path: "/inbox",
        icon: "mailbox",
        activePaths: ['/inbox']
      }, {
        label: "Kanban Board",
        path: "/kanban",
        icon: "grid-3x3-gap",
        activePaths: ['/kanban']
      }, {
        label: "Focus Air Export",
        path: "/focus-air",
        icon: "file-earmark-text",
        activePaths: ['/focus-air', '/consolidation', '/edit-airway-bill']
      }, {
        label: "Focus Air Import",
        path: "/focus-air-import",
        icon: "file-earmark-arrow-down",
        activePaths: ['/focus-air-import']
      }];

      // Hide Financials for viper_core and viper_tactical (only show for viper_command)
      if (this.companyTier === 'viper_command') {
        list.push({
          label: "Financials",
          path: "/financials",
          icon: "cash",
          activePaths: ['/financials']
        });
      }

      // Hide Analytics for operations & pricing designations
      var isExcludedRole = this.currentUser && (this.currentUser.designation === 'operations' || this.currentUser.designation === 'pricing');
      if (!isExcludedRole) {
        list.push({
          label: "Analytics",
          path: "/analytics",
          icon: "bar-chart",
          activePaths: ['/analytics']
        });
      }
      return list;
    },
    activeItem: function activeItem() {
      var _this = this;
      return this.menuItems.find(function (item) {
        return _this.isActive(item.activePaths);
      }) || this.menuItems[0];
    }
  },
  methods: {
    isActive: function isActive(paths) {
      var _this2 = this;
      if (typeof paths === "string") paths = [paths];
      return paths.some(function (path) {
        var regex = new RegExp("^".concat(path.replace(/:[^\s/]+/g, "[^/]+"), "(?:/|$)"));
        return regex.test(_this2.$route.path);
      });
    },
    toggleMobileMenu: function toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu: function closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    navigateMobile: function navigateMobile(path) {
      this.$router.push(path);
      this.isMobileMenuOpen = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datepicker */ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js");
/* harmony import */ var vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-datepicker */ "./node_modules/vue2-datepicker/index.esm.js");
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var vue2_datepicker_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue2-datepicker/index.css */ "./node_modules/vue2-datepicker/index.css");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/view/components/OcrUploadModal.vue */ "./resources/js/src/view/components/OcrUploadModal.vue");
/* harmony import */ var _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/view/components/DashboardHistoryModal.vue */ "./resources/js/src/view/components/DashboardHistoryModal.vue");
/* harmony import */ var _core_mixins_airWayBillMixin__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/core/mixins/airWayBillMixin */ "./resources/js/src/core/mixins/airWayBillMixin.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }









// import PageLoader from "../../components/PageLoader.vue";

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusAir",
  mixins: [_core_mixins_airWayBillMixin__WEBPACK_IMPORTED_MODULE_8__["default"]],
  props: {
    isDrawer: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      form: new Form({
        awb_email: '',
        first_box: {
          awb_code: '',
          awb_no: '',
          consolidated_mawb: false,
          awb: true
        },
        shipper_address: {
          ship_name: '',
          ship_name_2: '',
          ship_account: '',
          ship_address: '',
          ship_address_line_2: '',
          ship_city: '',
          ship_post_code: '',
          ship_state: '',
          ship_country: '',
          ship_phone: '',
          ship_fax: '',
          ship_telex: '',
          ship_new_address: '',
          ship_airport_code: null
        },
        consignee_address: {
          cons_name: '',
          cons_name_2: '',
          cons_account: '',
          cons_address: '',
          cons_address_line_2: '',
          cons_city: '',
          cons_airport_code: null,
          cons_post_code: '',
          cons_state: '',
          cons_country: '',
          cons_phone: '',
          cons_fax: '',
          cons_telex: '',
          cons_new_address: ''
        },
        also_notify_address: {
          also_name: '',
          also_name_2: '',
          also_address: '',
          also_address_line_2: '',
          also_city: '',
          also_airport_code: null,
          also_post_code: '',
          also_state: '',
          also_country: '',
          also_phone: '',
          also_fax: '',
          also_telex: '',
          also_new_address: ''
        },
        routing_information: {
          departure_airport: '',
          destination_airport: '',
          from: '',
          to: '',
          to_2: '',
          to_3: '',
          by: '',
          by_2: '',
          by_3: '',
          flight: '',
          flight_2: '',
          flight_3: '',
          date: this.getCurrentDate(),
          date_2: this.getCurrentDate(),
          date_3: this.getCurrentDate()
        },
        entries: [],
        oci_entries: [],
        tableCodes: [],
        charges: [],
        shipper_name: '',
        totals: {
          total_volume: null,
          total_amount: 0,
          dimention_unit: "MTQ"
        },
        custom_origin: {
          customs_origin_code: null,
          other_service_information: '',
          special_service_request: '',
          accounting_information: '',
          letter_credit: '',
          shipment_ref_no: null,
          supplementary_shipment_info: '',
          supplementary_shipment_info_line_2: '',
          extra_print: null
        },
        carr_namr: '',
        carr_prefix: '',
        carr_address: '',
        carr_city: '',
        carr_post_code: '',
        carr_state: '',
        carr_country: '',
        payment_info: {
          type_of_payment: '',
          currency: 'INR',
          // declear_value_carriage: '',
          // declear_value_customs: '',
          // declear_value_insurance: '',
          declear_value_carriage: 'NVD',
          declear_value_insurance: 'XXX',
          declear_value_customs: 'NCV',
          // other_charges_due_carrier: '',
          // other_charges_due_agent: '',
          taxes: null,
          weight_charge: null,
          total_charges_prepaid: null,
          total_charges_collect: null,
          total_charges: null,
          other_charges_due_agent_prepaid: null,
          other_charges_due_agent_collect: null,
          other_charges_due_carrier_prepaid: null,
          other_charges_due_carrier_collect: null
        },
        is_consignee_address_save: false,
        is_shipper_address_save: false,
        is_also_notify_address_save: false,
        is_iata_login_later: false,
        status: ''
      }),
      consignmentUrl: '/user/get-consignment-error',
      iata_cass: {
        iata_agent_code: null,
        iata_agent_cass: null
      },
      agent_information: {
        agent_name: '',
        agent_address: '',
        agent_city: '',
        agent_pincode: '',
        agent_issue_sign: '',
        agent_issue_loc_code: '',
        agent_issue_date: '',
        agent_account: null,
        //Participate Sender Reference
        participate: '0',
        participate_airport: '',
        prticipant_identifer: '',
        participant_code: null,
        office_file_reference: '',
        //Office Sender Reference
        office_airport: null,
        office_function_designator: null,
        office_company_designator: null
      },
      defaultPaymentInfo: {
        declear_value_carriage: 'NVD',
        declear_value_customs: 'NCV',
        declear_value_insurance: 'XXX',
        currency: 'INR'
      },
      selectedViewPageOption: '/focus-air',
      selectedShipper: null,
      selectedConsignee: null,
      selectAlsoNotify: null,
      shippers: [],
      consignees: [],
      alsoNotify: [],
      searchQuery_to: '',
      selectedCode: '',
      custom_special_handling_code: '',
      manualCode: '',
      location: [],
      newHsCode: '',
      isOpen: false,
      showShipper: false,
      showConsignee: false,
      showCalculationTable: false,
      generatePDFAfterSave: '',
      countries: [],
      oci_data: {},
      ///get-oci-data
      oci_identifiers: {},
      other_charges_code: [],
      existingData: {},
      data_items: [],
      isFetching: false,
      mode: 'add',
      awbDetails: false,
      awbError: null,
      awbId: null,
      filteredShippers: [],
      filteredConsignees: [],
      filteredAlsoNotify: [],
      awb_prefix_message: '',
      showAWBSection: false,
      codes: [{
        value: 'ACT',
        text: 'ACT - Active Temperature Controlled System'
      }, {
        value: 'AOG',
        text: 'AOG - Aircraft on ground'
      }, {
        value: 'ATT',
        text: 'ATT - Cargo attached to AWB'
      }, {
        value: 'AVI',
        text: 'AVI - Live animals'
      }, {
        value: 'BIG',
        text: 'BIG - Outsized'
      }, {
        value: 'BUP',
        text: 'BUP - Built up pallet'
      }, {
        value: 'CAO',
        text: 'CAO - Cargo Aircraft Only'
      }, {
        value: 'CAT',
        text: 'CAT - Cargo Attendant Accompanying Shipment'
      }, {
        value: 'COL',
        text: 'COL – Cool Goods/Refrigerated Goods'
      }, {
        value: 'COM',
        text: 'COM - Company mail'
      }, {
        value: 'CRT',
        text: 'CRT - Control Room Temperature '
      }, {
        value: 'DGD',
        text: 'DGD - Dangerous Goods as per attached DGD or DGD-CAO'
      }, {
        value: 'DIP',
        text: 'DIP - Diplomatic mail'
      }, {
        value: 'EAP',
        text: 'EAP - e-freight Consignment with Accompanying Documents'
      }, {
        value: 'EAW',
        text: 'EAW - e-freight Consignment with No Accompanying Documents'
      }, {
        value: 'EAT',
        text: 'EAT - Foodstuffs'
      }, {
        value: 'ECC',
        text: 'ECC - Electronically Concluded Cargo Contract'
      }, {
        value: 'ELI',
        text: 'ELI - Lithium Ion batteries excepted class 9'
      }, {
        value: 'ELM',
        text: 'ELM - Lithium Metal batteries excepted class 9'
      }, {
        value: 'EMD',
        text: 'EMD - Electronic Monitoring Devices on/in Cargo/Container'
      }, {
        value: 'ERT',
        text: 'ERT - Extended Room Temperature +2°C to +25°C'
      }, {
        value: 'FIL',
        text: 'FIL - Undeveloped/unexposed film'
      }, {
        value: 'FRI',
        text: 'FRI - Frozen Goods Subject to Veterinary/Phytosanitary Inspections'
      }, {
        value: 'FRO',
        text: 'FRO - Frozen Goods (not for dry ice but -20 C products)'
      }, {
        value: 'GCO',
        text: 'GCO - General Cargo'
      }, {
        value: 'GOG',
        text: 'GOG - Hanging Garments'
      }, {
        value: 'HEA',
        text: 'HEA - Heavy Cargo, over 150kg pc'
      }, {
        value: 'HEG',
        text: 'HEG - Hatching Eggs'
      }, {
        value: 'HUM',
        text: 'HUM - Human remains'
      }, {
        value: 'ICE',
        text: 'ICE - Dry ice'
      }, {
        value: 'LHO',
        text: 'LHO - Living Human Organs/Blood'
      }, {
        value: 'LIC',
        text: 'LIC - License Required'
      }, {
        value: 'MAG',
        text: 'MAG - Magnetised Material'
      }, {
        value: 'MAL',
        text: 'MAL - Mail '
      }, {
        value: 'MUW',
        text: 'MUW - Munitions / Guns'
      }, {
        value: 'NDA',
        text: 'NDA - No dims Available'
      }, {
        value: 'NWP',
        text: 'NWP - Newspapers / Magazines'
      }, {
        value: 'OBX',
        text: 'OBX - Obnoxious Cargo'
      }, {
        value: 'OCI',
        text: 'OCI - Other Customs, Security and Regulatory Control Information'
      }, {
        value: 'OHG',
        text: 'OHG - Overhang Items '
      }, {
        value: 'OSI',
        text: 'OSI - Other Service Information'
      }, {
        value: 'PAC',
        text: 'PAC - Passenger and Cargo'
      }, {
        value: 'PEA',
        text: 'PEA - Hunting trophies'
      }, {
        value: 'PEF',
        text: 'PEF - Flowers'
      }, {
        value: 'PEM',
        text: 'PEM - Meat'
      }, {
        value: 'PEP',
        text: 'PEP - Fruits and Vegetables'
      }, {
        value: 'PER',
        text: 'PER - Perishable cargo'
      }, {
        value: 'PES',
        text: 'PES - Fish / Seafood'
      }, {
        value: 'PIL',
        text: 'PIL - Pharmaceuticals'
      }, {
        value: 'QRT',
        text: 'QRT - Quick Ramp Transfer '
      }, {
        value: 'RAC',
        text: 'RAC - Reserverd Air Cargo'
      }, {
        value: 'RBI',
        text: 'RBI - Fully regulated lithium ion batteries (Class 9, UN 3480) as per Section IA and IB of PI 965'
      }, {
        value: 'RBM',
        text: 'RBM - Cargo-XML Manual and ToolkitFully regulated lithium metal batteries (Class 9, UN 3090) as per Section IA and IB of PI 968'
      }, {
        value: 'RCL',
        text: 'RCL - Cryogenic Liquid'
      }, {
        value: 'RCM',
        text: 'RCM - Corrosive'
      }, {
        value: 'RCX',
        text: 'RCX - Explosives 1.3C'
      }, {
        value: 'RDS',
        text: 'RDS - Biological Substance'
      }, {
        value: 'REQ',
        text: 'REQ - Dangerous Goods in Excepted Quantities'
      }, {
        value: 'REX',
        text: 'REX - To be reserved for normally forbidden Explosives, Divisions 1.1, 1.2, 1.3, 1.4F, 1.5 and 1.6'
      }, {
        value: 'RFG',
        text: 'RFG - Flammable Gas'
      }, {
        value: 'RFL',
        text: 'RFL - Flammable Liquid'
      }, {
        value: 'RFS',
        text: 'RFS - Flammable Solid'
      }, {
        value: 'RFW',
        text: 'RFW - Dangerous When Wet'
      }, {
        value: 'RGX',
        text: 'RGX - Explosives 1.3G'
      }, {
        value: 'RIS',
        text: 'RIS - Infectious Substance'
      }, {
        value: 'RLI',
        text: 'RLI - Litium Ion batteries'
      }, {
        value: 'RLM',
        text: 'RLM - Litium Metal batteries'
      }, {
        value: 'RMD',
        text: 'RMD - Miscellaneous Dangerous Goods'
      }, {
        value: 'RNG',
        text: 'RNG - Non-Flammable Gas'
      }, {
        value: 'ROP',
        text: 'ROP - Organic Peroxide'
      }, {
        value: 'ROX',
        text: 'ROX - Oxidiser'
      }, {
        value: 'RPB',
        text: 'RPB - Poison'
      }, {
        value: 'RPG',
        text: 'RPG - Toxic (Poison) Gas'
      }, {
        value: 'RRE',
        text: 'RRE - Excepted Quantities of Radioactive Material'
      }, {
        value: 'RRW',
        text: 'RRW - Radioactive - White'
      }, {
        value: 'RRY',
        text: 'RRY - Radioactive - Yellow'
      }, {
        value: 'RSB',
        text: 'RSB - Polystyrene Beads'
      }, {
        value: 'RSC',
        text: 'RSC - Spontaneously Combustible'
      }, {
        value: 'RXB',
        text: 'RXB - Explosives 1.4B'
      }, {
        value: 'RXC',
        text: 'RXC - Explosives 1.4C'
      }, {
        value: 'RXD',
        text: 'RXD - Explosives 1.4D'
      }, {
        value: 'RXE',
        text: 'RXE - Explosives 1.4E'
      }, {
        value: 'RXG',
        text: 'RXG - Explosives 1.4G'
      }, {
        value: 'RXS',
        text: 'RXS - Explosives'
      }, {
        value: 'SAL',
        text: 'SAL - Surface Mail '
      }, {
        value: 'SCO',
        text: 'SCO - Cargo Secure for All-Cargo Aircraft Only '
      }, {
        value: 'SFX',
        text: 'SFX - Expedair Service '
      }, {
        value: 'SHL',
        text: 'SHL - Save Human Life '
      }, {
        value: 'SHR',
        text: 'SHR - Secure for Passenger, All-Cargo and All-Mail Aircraft in Accordance with High Risk Requirements '
      }, {
        value: 'SPF',
        text: 'SPF - Laboratory Animals'
      }, {
        value: 'SPX',
        text: 'SPX - Cargo Secure for Passenger and All-Cargo Aircraft '
      }, {
        value: 'SUR',
        text: 'SUR - Surface Transportation'
      }, {
        value: 'SWP',
        text: 'SWP - Sporting weapons'
      }, {
        value: 'VAL',
        text: 'VAL - Valuable cargo'
      }, {
        value: 'VOL',
        text: 'VOL - Volume'
      }, {
        value: 'VUN',
        text: 'VUN - Vulnerable Cargo'
      }, {
        value: 'WET',
        text: 'WET - Shipments of Wet Material not Packed in Watertight Containers'
      }, {
        value: 'XPH',
        text: 'XPH - Equation Heavy for KLM'
      }, {
        value: 'XPS',
        text: 'XPS - 236 XPS'
      }],
      options: [{
        text: "Me",
        value: "1"
      }, {
        text: "Participant Group",
        value: "1"
      }],
      logoSrc: "/media/assets/logos/logo-1.png",
      main_error_msg: "",
      pdf_error_msg: '',
      is_generate_pdf: 0,
      showSpinner: false,
      selectedCompanyForUpload: null,
      confidenceScores: {}
    };
  },
  methods: {
    getConfidenceClass: function getConfidenceClass(fieldKey) {
      var conf = this.confidenceScores[fieldKey];
      if (conf === 'low' || conf === 'medium') {
        return 'orange-highlight-border';
      }
      return '';
    },
    processExtractedData: function processExtractedData(response) {
      var _this = this,
        _response$transit;
      // Reset the form and UI states to clear any previously populated data
      this.form.reset();
      this.showShipper = false;
      this.showConsignee = false;
      this.isConsignmentAdded = false;
      this.confidenceScores = {};
      console.log('Processing received payload:', response);
      var isUnstructured = response.shipper_name && _typeof(response.shipper_name) === 'object' || response.consignee_name && _typeof(response.consignee_name) === 'object' || response.invoice_no || response.packing_list_no;
      if (isUnstructured) {
        var mapField = function mapField(fieldKey, targetObj, targetKey) {
          var field = response[fieldKey];
          if (field && _typeof(field) === 'object') {
            targetObj[targetKey] = field.value !== null && field.value !== undefined ? String(field.value) : '';
            _this.$set(_this.confidenceScores, fieldKey, field.confidence || 'low');
          }
        };
        this.showShipper = true;
        mapField('shipper_name', this.form.shipper_address, 'ship_name');
        mapField('shipper_address', this.form.shipper_address, 'ship_address');
        mapField('shipper_city', this.form.shipper_address, 'ship_city');
        mapField('shipper_post_code', this.form.shipper_address, 'ship_post_code');
        mapField('shipper_state', this.form.shipper_address, 'ship_state');
        mapField('shipper_phone', this.form.shipper_address, 'ship_phone');
        if (response.shipper_country && _typeof(response.shipper_country) === 'object') {
          var countryVal = response.shipper_country.value;
          this.$set(this.confidenceScores, 'shipper_country', response.shipper_country.confidence || 'low');
          if (countryVal) {
            var shipper_country_code = '';
            for (var c = 0; c < 252; c++) {
              if (this.countries[c] && this.countries[c].text.toLowerCase() === String(countryVal).toLowerCase()) {
                shipper_country_code = this.countries[c].value;
                break;
              }
            }
            this.form.shipper_address.ship_country = shipper_country_code;
          }
        }
        this.showConsignee = true;
        mapField('consignee_name', this.form.consignee_address, 'cons_name');
        mapField('consignee_address', this.form.consignee_address, 'cons_address');
        mapField('consignee_city', this.form.consignee_address, 'cons_city');
        mapField('consignee_post_code', this.form.consignee_address, 'cons_post_code');
        mapField('consignee_state', this.form.consignee_address, 'cons_state');
        mapField('consignee_phone', this.form.consignee_address, 'cons_phone');
        if (response.consignee_country && _typeof(response.consignee_country) === 'object') {
          var _countryVal = response.consignee_country.value;
          this.$set(this.confidenceScores, 'consignee_country', response.consignee_country.confidence || 'low');
          if (_countryVal) {
            var consignee_country_code = '';
            for (var _c = 0; _c < 252; _c++) {
              if (this.countries[_c] && this.countries[_c].text.toLowerCase() === String(_countryVal).toLowerCase()) {
                consignee_country_code = this.countries[_c].value;
                break;
              }
            }
            this.form.consignee_address.cons_country = consignee_country_code;
          }
        }
        var desc = '';
        if (response.items && Array.isArray(response.items)) {
          desc = response.items.map(function (item) {
            if (item.description && _typeof(item.description) === 'object') {
              return item.description.value;
            }
            return '';
          }).filter(Boolean).join(', ');
        }
        this.consignment_list.description = desc;
        if (response.grand_total && _typeof(response.grand_total) === 'object') {
          this.consignment_list.rate = response.grand_total.value;
          this.$set(this.confidenceScores, 'grand_total', response.grand_total.confidence || 'low');
        }
        if (response.total_packages && _typeof(response.total_packages) === 'object') {
          this.consignment_list.pieces = response.total_packages.value;
          this.$set(this.confidenceScores, 'total_packages', response.total_packages.confidence || 'low');
        }
        if (response.total_gross_weight && _typeof(response.total_gross_weight) === 'object') {
          this.consignment_list.gross_weight = response.total_gross_weight.value;
          this.consignment_list.chargable_weight = response.total_gross_weight.value;
          this.$set(this.confidenceScores, 'total_gross_weight', response.total_gross_weight.confidence || 'low');
        }
        if (response.total_volume && _typeof(response.total_volume) === 'object') {
          this.form.totals.total_volume = response.total_volume.value;
          this.$set(this.confidenceScores, 'total_volume', response.total_volume.confidence || 'low');
        }
        this.$refs.modalConsignment.show();
        return;
      }
      var awb_number = response.awb_number ? response.awb_number.split("-") : ['', ''];
      this.form.first_box.awb_code = awb_number[0] || '';
      this.form.first_box.awb_no = awb_number[1] || '';

      // Routing
      var departure = response.departure;
      var destination = response.destination;
      var transit = (_response$transit = response.transit) === null || _response$transit === void 0 ? void 0 : _response$transit[0];

      // Departure + destination are populated independently of transit
      if (departure && destination) {
        var _transit$transit_airp, _transit$transit_airp2, _transit$transit_airp3;
        var all_airport_short_code = [departure, destination, transit === null || transit === void 0 || (_transit$transit_airp = transit.transit_airports) === null || _transit$transit_airp === void 0 ? void 0 : _transit$transit_airp[0], transit === null || transit === void 0 || (_transit$transit_airp2 = transit.transit_airports) === null || _transit$transit_airp2 === void 0 ? void 0 : _transit$transit_airp2[1], transit === null || transit === void 0 || (_transit$transit_airp3 = transit.transit_airports) === null || _transit$transit_airp3 === void 0 ? void 0 : _transit$transit_airp3[2]];
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].post("/user/get-airport-by-airport-code", {
          "airport_code": all_airport_short_code
        }).then(function (response2) {
          var _response2$data;
          response2 = (_response2$data = response2.data) === null || _response2$data === void 0 ? void 0 : _response2$data.data;
          _this.form.routing_information.departure_airport = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          _this.form.routing_information.destination_airport = "".concat(response2[1]['iata_code'], ", ").concat(response2[1]['destination']);
          _this.form.routing_information.from = "".concat(response2[0]['iata_code'], ", ").concat(response2[0]['destination']);
          // Transit hops only filled when transit data is present
          if (transit) {
            _this.form.routing_information.to = "".concat(response2[2] ? response2[2]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[2] ? response2[2]['destination'] : response2[1]['destination']);
            if (transit.transit_airports[1]) {
              _this.form.routing_information.to_2 = "".concat(response2[3] ? response2[3]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[3] ? response2[3]['destination'] : response2[1]['destination']);
            }
            if (transit.transit_airports[2]) {
              _this.form.routing_information.to_3 = "".concat(response2[4] ? response2[4]['iata_code'] : response2[1]['iata_code'], ", ").concat(response2[4] ? response2[4]['destination'] : response2[1]['destination']);
            }
          }
        });
        // Flight numbers and dates only when transit is available
        if (transit) {
          if (transit.flights[0]) {
            var _transit$flights$, _transit$flights$2;
            this.form.routing_information.by = (_transit$flights$ = transit.flights[0]) === null || _transit$flights$ === void 0 || (_transit$flights$ = _transit$flights$.flight_number) === null || _transit$flights$ === void 0 ? void 0 : _transit$flights$.slice(0, 2);
            this.form.routing_information.flight = (_transit$flights$2 = transit.flights[0]) === null || _transit$flights$2 === void 0 || (_transit$flights$2 = _transit$flights$2.flight_number) === null || _transit$flights$2 === void 0 ? void 0 : _transit$flights$2.slice(2);
            this.form.routing_information.date = this.formatDate(transit.flights[0].date);
          }
          if (transit.flights[1]) {
            var _transit$flights$3, _transit$flights$4;
            this.form.routing_information.by_2 = (_transit$flights$3 = transit.flights[1]) === null || _transit$flights$3 === void 0 || (_transit$flights$3 = _transit$flights$3.flight_number) === null || _transit$flights$3 === void 0 ? void 0 : _transit$flights$3.slice(0, 2);
            this.form.routing_information.flight_2 = (_transit$flights$4 = transit.flights[1]) === null || _transit$flights$4 === void 0 || (_transit$flights$4 = _transit$flights$4.flight_number) === null || _transit$flights$4 === void 0 ? void 0 : _transit$flights$4.slice(2);
            this.form.routing_information.date_2 = this.formatDate(transit.flights[1].date);
          }
          if (transit.flights[2]) {
            var _transit$flights$5, _transit$flights$6;
            this.form.routing_information.by_3 = (_transit$flights$5 = transit.flights[2]) === null || _transit$flights$5 === void 0 || (_transit$flights$5 = _transit$flights$5.flight_number) === null || _transit$flights$5 === void 0 ? void 0 : _transit$flights$5.slice(0, 2);
            this.form.routing_information.flight_3 = (_transit$flights$6 = transit.flights[2]) === null || _transit$flights$6 === void 0 || (_transit$flights$6 = _transit$flights$6.flight_number) === null || _transit$flights$6 === void 0 ? void 0 : _transit$flights$6.slice(2);
            this.form.routing_information.date_3 = this.formatDate(transit.flights[2].date);
          }
        }
      }

      // Shipper details
      this.showShipper = true;
      var shipper = response.shipper;
      if (shipper) {
        this.form.shipper_address.ship_name = shipper.name;
        this.form.shipper_address.ship_address = shipper.address;
        this.form.shipper_address.ship_city = shipper.city;
        this.form.shipper_address.ship_post_code = shipper.pin;
        this.form.shipper_address.ship_state = shipper.state;
        if (shipper.country) {
          var _shipper_country_code = '';
          for (var _c2 = 0; _c2 < 252; _c2++) {
            if (this.countries[_c2] && this.countries[_c2].text.toLowerCase() == shipper.country.toLowerCase()) {
              _shipper_country_code = this.countries[_c2].value;
              break;
            }
          }
          this.form.shipper_address.ship_country = _shipper_country_code;
        }
        this.form.shipper_address.ship_phone = shipper.phone;
        this.form.shipper_address.ship_fax = shipper.email;
      }

      // Consignee details
      this.showConsignee = true;
      var consignee = response.consignee;
      if (consignee) {
        this.form.consignee_address.cons_name = consignee.name;
        this.form.consignee_address.cons_name_2 = consignee.eori;
        this.form.consignee_address.cons_address = consignee.address;
        this.form.consignee_address.cons_city = consignee.city;
        this.form.consignee_address.cons_post_code = consignee.pin;
        this.form.consignee_address.cons_state = consignee.state;
        if (consignee.country) {
          var _consignee_country_code = '';
          for (var _c3 = 0; _c3 < 252; _c3++) {
            if (this.countries[_c3] && this.countries[_c3].text.toLowerCase() == consignee.country.toLowerCase()) {
              _consignee_country_code = this.countries[_c3].value;
              break;
            }
          }
          this.form.consignee_address.cons_country = _consignee_country_code;
        }
        this.form.consignee_address.cons_phone = consignee.phone;
        this.form.consignee_address.cons_fax = consignee.email;
        if (consignee.eori) {
          this.oci_info.supplementary_info = consignee.eori;
          this.oci_info.custom_info_identifier = "CNE";
        }
      }

      // Consignment Info
      var cargo_data = response.cargo;
      var piece_weight = response.piece_weight;
      var weight_charge = response.weight_charge;
      if (piece_weight) {
        // Safely slice the rate class — fall back to '' so the select shows "Select a Rate Class"
        var rate_class = piece_weight.rate_class ? piece_weight.rate_class.length > 2 ? piece_weight.rate_class.slice(2) : piece_weight.rate_class : '';
        this.consignment_list.rate_class = rate_class;
        this.consignment_list.pieces = piece_weight.no_of_pieces;
        this.consignment_list.rate = piece_weight.rate;
        this.consignment_list.gross_weight = piece_weight.gross_weight;
        this.consignment_list.chargable_weight = piece_weight.chargeable_weight;
      }
      if (cargo_data) {
        this.consignment_list.hsCodes = cargo_data.hs_codes;
        this.consignment_list.description = cargo_data.description;
        if (cargo_data.dimensions) {
          for (var i = 0; i < cargo_data.dimensions.length; i++) {
            var _dimensions_data$, _dimensions_data$2, _dimensions_data$3;
            var dimensions_data = cargo_data.dimensions[i].dimension.split('X');
            this.consignment_list.itemss.push({
              pcs: cargo_data.dimensions[i].count,
              wgt: '',
              length: (_dimensions_data$ = dimensions_data[0]) !== null && _dimensions_data$ !== void 0 ? _dimensions_data$ : '',
              width: (_dimensions_data$2 = dimensions_data[1]) !== null && _dimensions_data$2 !== void 0 ? _dimensions_data$2 : '',
              height: (_dimensions_data$3 = dimensions_data[2]) !== null && _dimensions_data$3 !== void 0 ? _dimensions_data$3 : '',
              unit: 'CMT'
            });
          }
        }
      }
      this.$refs.modalConsignment.show();

      // Payment Remaining
      if (response.chrg_code) {
        this.form.payment_info.type_of_payment = response.chrg_code;
      }
    },
    inputLimit: function inputLimit(event, fieldPath, maxLength) {
      var allowedChars = /^[a-zA-Z0-9 ,\-_]+$/;
      var allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
      if (allowedKeys.includes(event.key)) {
        return;
      }
      var fields = fieldPath.split(".");
      var input = this.form;
      for (var i = 0; i < fields.length; i++) {
        if (input[fields[i]] === undefined) {
          return; // Stop if any level is undefined
        }
        if (i === fields.length - 1) {
          input = input[fields[i]];
        } else {
          input = input[fields[i]];
        }
      }
      if (typeof input !== "string") return;
      input = input.split('').filter(function (_char) {
        return allowedChars.test(_char);
      }).join('');

      // Prevent typing beyond maxLength
      if (input.length >= maxLength) {
        event.preventDefault();
      }
      var obj = this.form;
      for (var _i = 0; _i < fields.length - 1; _i++) {
        obj = obj[fields[_i]];
      }
      obj[fields[fields.length - 1]] = input.substring(0, maxLength);
    },
    isGeneratePdf: function isGeneratePdf(generateButton) {
      var _this2 = this;
      // alert("generateButton " + generateButton + "isGeneratePdf "+ this.is_generate_pdf);
      var errors = [];

      // Check first box
      if (!this.form.first_box.awb_code) errors.push('AWB Code');
      if (!this.form.first_box.awb_no) errors.push('AWB Number');

      // Check routing information
      if (!this.form.routing_information.departure_airport) errors.push('Departure Airport');
      if (!this.form.routing_information.destination_airport) errors.push('Destination Airport');
      if (!this.form.routing_information.from) errors.push('From Airport');

      // Check shipper details
      if (!this.form.shipper_address.ship_name) errors.push('Shipper Name');
      if (!this.form.shipper_address.ship_address) errors.push('Shipper Address');
      if (!this.form.shipper_address.ship_city) errors.push('Shipper City');

      // Check consignee details
      if (!this.form.consignee_address.cons_name) errors.push('Consignee Name');
      if (!this.form.consignee_address.cons_address) errors.push('Consignee Address');
      if (!this.form.consignee_address.cons_city) errors.push('Consignee City');

      // Check if there are any entries in the consignment
      if (this.form.entries.length === 0) {}
      if (errors.length > 0) {
        this.pdf_error_msg = "<br>- ".concat(errors.join('<br>- '));
        return;
      }

      // Clear error message if validation passes
      this.pdf_error_msg = '';
      this.is_generate_pdf = generateButton === 1;
      // Start the progress bar animation
      if (generateButton == 0 && this.is_generate_pdf == 1) {
        this.is_generate_pdf = 0;
      }
      if (generateButton == 1 && this.is_generate_pdf == 1) {
        this.showSpinner = true;
        this.is_generate_pdf = 0;
      }
      if (generateButton == 1 && this.is_generate_pdf == 0) {
        this.showSpinner = true;
      }
      setTimeout(function () {
        if (generateButton == 1 && _this2.is_generate_pdf == 1) {
          _this2.showSpinner = false;
          _this2.is_generate_pdf = 1;
        }
        if (generateButton == 1 && _this2.is_generate_pdf == 0) {
          _this2.showSpinner = false;
          _this2.is_generate_pdf = 1;
        }
      }, 2000);
    },
    // generateAwbPDF() {
    //     // const itemId = this.$route.params.id;
    //     const itemId =  this.existingData.id
    //     console.log("sdfnjbf",itemId);
    //     const pdfUrl = `/download-awb-pdf/${itemId}`; // Construct the URL for the PDF
    //     window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
    // },
    // generateAwbPDF() {
    //     if (!this.validateFormFields()) {
    //         return;
    //     }
    //     const itemId = this.$route.params.id;
    //     console.log("dknfehjf", itemId);
    //     const pdfUrl = `/download-awb-pdf/${itemId}`;
    //     console.log("skfnjfer",pdfUrl);
    //     window.open(pdfUrl, '_blank');
    // },
    generateAwbPDF: function generateAwbPDF(pdf_generate_type) {
      this.generatePDFAfterSave = '';
      if (!this.existingData || !this.existingData.id) {
        // console.error('Existing data ID is missing. Cannot generate PDF.');
        return;
      }
      var pdfUrl = "/".concat(pdf_generate_type, "/").concat(this.existingData.id);
      window.open(pdfUrl, '_blank');
    },
    handleSaveAndGeneratePDF: function handleSaveAndGeneratePDF(pdf_generate_type) {
      this.generatePDFAfterSave = pdf_generate_type;
      var result = this.onSubmit() || Promise.resolve({});
      result.then(function (response) {
        if (response.data && response.data.data && response.data.data.id) {
          // this.generateAwbPDF(pdf_generate_type);
        } else {
          console.error('ID is missing in the response data');
        }
      })["catch"](function (error) {
        console.error('Error while saving data:', error);
      });
      // try {
      //     this.showSpinner = true;
      //     this.pdf_error_msg = ''; // Clear previous errors
      //     const result = this.onSubmit() || Promise.resolve({});
      //     result.then(response => {
      //     if (response.data.error) {
      //         this.pdf_error_msg = response.data.error;
      //         this.is_generate_pdf = false;
      //         console.log("hello");
      //     } else {
      //         // Handle successful PDF generation
      //         window.open(response.data.url, '_blank');
      //     }
      // });
      // } catch (error) {
      //     this.pdf_error_msg = error.response?.data?.message || 'Failed to generate PDF';
      //     this.is_generate_pdf = false;
      // } finally {
      //     this.showSpinner = false;
      // }
    },
    formatBackendError: function formatBackendError(msg) {
      if (!msg) return "";
      var cleanMsg = msg.toLowerCase();

      // Map technical field names to clean names
      var mapping = {
        'awb no': 'AWB Number',
        'awb code': 'AWB Prefix',
        'cons name': 'Consignee Name',
        'cons address': 'Consignee Address',
        'cons city': 'Consignee City',
        'cons country': 'Consignee Country',
        'ship name': 'Shipper Name',
        'ship address': 'Shipper Address',
        'ship city': 'Shipper City',
        'ship country': 'Shipper Country',
        'by': 'Carrier Code',
        'dept airport': 'Departure Airport',
        'flight': 'Flight Number',
        'date': 'Flight Date'
      };

      // Apply technical name replacements
      Object.keys(mapping).forEach(function (key) {
        if (cleanMsg.includes(key)) {
          cleanMsg = cleanMsg.replace(key, mapping[key]);
        }
      });

      // Improve grammar and language
      cleanMsg = cleanMsg.replace(/^the /i, '').replace(/ field is required/i, ' is missing or empty').replace(/ field /i, ' ').trim();

      // Capitalize first letter
      return cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
    },
    validateFormFields: function validateFormFields() {
      var requiredFields = {
        "AWB prefix": this.form.first_box.awb_code,
        // AWB prefix
        "AWB number": this.form.first_box.awb_no,
        // AWB number
        "Shipper address": this.form.shipper_address.ship_address,
        // Shipper address
        "Shipper city": this.form.shipper_address.ship_address,
        // Shipper city
        "Consignee address": this.form.consignee_address.cons_address,
        // Consignee address
        "Consignee city": this.form.consignee_address.cons_city,
        // Consignee city
        "Routing by (carrier code) on row 1 is mandatory": this.form.routing_information.by // Routing by carrier code
      };
      var missingFields = Object.entries(requiredFields).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          field = _ref2[0],
          value = _ref2[1];
        return !value || typeof value === 'string' && value.trim() === '';
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
          field = _ref4[0];
        return field;
      });
      if (missingFields.length > 0) {
        alert("The following fields are mandatory:\n- ".concat(missingFields.join("\n- ")));
        return false;
      }
      return true;
    },
    mouseover: function mouseover() {
      this.isOpen = true;
    },
    mouseleave: function mouseleave() {
      this.isOpen = false;
    },
    converXml: function converXml(awb_no) {
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/waybill/".concat(awb_no)).then(function (_ref5) {
        var data = _ref5.data;
      } // console.log(data);
      );
    },
    // showModal() {
    //     this.$refs["my-modal"].show();
    // },
    // hideModal() {
    //     this.$refs["my-modal"].hide();
    // },
    toggleModal: function toggleModal() {
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    handleOk: function handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
    },
    handleDateChange: function handleDateChange(date, field) {
      var keys = field.split('.');
      var target = this;
      for (var i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = date;
    },
    // for remove
    prepareFormDataForSubmission: function prepareFormDataForSubmission() {
      var formData = _objectSpread({}, this.form);

      // Convert display dates back to proper format for backend
      if (formData.routing_information) {
        if (formData.routing_information.date) {
          if (typeof formData.routing_information.date === 'string' && formData.routing_information.date.length <= 10) {
            // If it's a formatted string like "02Sept", convert it back to proper date
            var date = new Date(formData.routing_information.date);
            if (!isNaN(date.getTime())) {
              formData.routing_information.date = date.toISOString().slice(0, 19).replace('T', ' ');
            }
          } else if (formData.routing_information.date instanceof Date) {
            // If it's already a Date object, format it
            formData.routing_information.date = formData.routing_information.date.toISOString().slice(0, 19).replace('T', ' ');
          }
        }
        if (formData.routing_information.date_2) {
          if (typeof formData.routing_information.date_2 === 'string' && formData.routing_information.date_2.length <= 10) {
            var _date = new Date(formData.routing_information.date_2);
            if (!isNaN(_date.getTime())) {
              formData.routing_information.date_2 = _date.toISOString().slice(0, 19).replace('T', ' ');
            }
          } else if (formData.routing_information.date_2 instanceof Date) {
            formData.routing_information.date_2 = formData.routing_information.date_2.toISOString().slice(0, 19).replace('T', ' ');
          }
        }
        if (formData.routing_information.date_3) {
          if (typeof formData.routing_information.date_3 === 'string' && formData.routing_information.date_3.length <= 10) {
            var _date2 = new Date(formData.routing_information.date_3);
            if (!isNaN(_date2.getTime())) {
              formData.routing_information.date_3 = _date2.toISOString().slice(0, 19).replace('T', ' ');
            }
          } else if (formData.routing_information.date_3 instanceof Date) {
            formData.routing_information.date_3 = formData.routing_information.date_3.toISOString().slice(0, 19).replace('T', ' ');
          }
        }
      }
      return formData;
    },
    // location
    getLocation: function getLocation() {
      var _this3 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-location").then(function (_ref6) {
        var data = _ref6.data;
        _this3.location = data;
      });
    },
    fetchAllAddressBook: function fetchAllAddressBook() {
      var _this4 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-shippers').then(function (response) {
        var all = response.data;
        _this4.shippers = all.filter(function (s) {
          return s.address_type === 'shipper_address';
        });
        _this4.consignees = all.filter(function (s) {
          return s.address_type === 'consignee_address';
        });
        _this4.alsoNotify = all.filter(function (s) {
          return s.address_type === 'also_notify_address';
        });
        _this4.filteredShippers = _this4.shippers;
        _this4.filteredConsignees = _this4.consignees;
        _this4.filteredAlsoNotify = _this4.alsoNotify;
      });
    },
    fillShipperDetails: function fillShipperDetails() {
      var _this5 = this;
      if (this.selectedShipper) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-shipper-address?id=".concat(this.selectedShipper)).then(function (response) {
          _this5.form.shipper_address = response.data;
          // console.log('Shipper', response.data);
        })["catch"](function (error) {
          // console.error('Error fetching shipper address:', error);
        });
      } else {
        this.form.shipper_address = {
          ship_name: '',
          ship_name_2: '',
          ship_account: '',
          ship_address: '',
          ship_city: ''
        };
      }
    },
    fillConsigneeDetails: function fillConsigneeDetails() {
      var _this6 = this;
      if (this.selectedConsignee) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-consignee-address?id=".concat(this.selectedConsignee)).then(function (response) {
          _this6.form.consignee_address = response.data;
          // console.log('Consignee', response.data);
        })["catch"](function (error) {
          // console.error('Error fetching shipper address:', error);
        });
      } else {
        this.form.consignee_address = {
          cons_name: '',
          cons_name_2: '',
          cons_account: '',
          cons_address: '',
          cons_city: ''
        };
      }
    },
    fillAlsoNotifyDetails: function fillAlsoNotifyDetails() {
      var _this7 = this;
      if (this.selectAlsoNotify) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-alsonotify-address?id=".concat(this.selectAlsoNotify)).then(function (response) {
          _this7.form.also_notify_address = response.data;
          // console.log('Also Notify address', response.data);
        })["catch"](function (error) {
          // console.error('Error fetching Also notify address address:', error);
        });
      } else {
        this.form.also_notify_address = {
          also_name: '',
          also_name_2: '',
          also_account: '',
          also_address: '',
          also_city: ''
        };
      }
    },
    onSubmit: function onSubmit() {
      var _this8 = this;
      this.main_error_msg = '';
      $('.submit-button').css({
        'pointer-events': 'none',
        'opacity': '0.5'
      });
      // Prepare form data for submission - convert display dates to proper format
      // const preparedFormData = this.prepareFormDataForSubmission();

      if (this.mode === 'add') {
        // Update the existing form with prepared data
        // Object.assign(this.form, preparedFormData);
        this.from = _objectSpread({}, this.form);
        this.form.post("/user/create-focusair").then(function (response) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
            _this8.existingData = response.data.data.first_box.original.data;
            if (_this8.generatePDFAfterSave && _this8.existingData && _this8.existingData.id) {
              _this8.generateAwbPDF(_this8.generatePDFAfterSave);
            }
            _this8.successMessage = '-e-AWB Saved in database -Pass';
          } else {}
        })["catch"](function (error) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          var main_error_msg = '';
          if (error.response) {
            if (error.response.status === 422) {
              var errors = error.response.data.errors;
              for (var field in errors) {
                main_error_msg += "".concat(_this8.formatBackendError(errors[field][0]), "<br>");
              }
            }
          }
          _this8.main_error_msg = main_error_msg;
        });
      } else if (this.mode === 'update') {
        if (!this.existingData || !this.existingData.id) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          return;
        }
        // Update the existing form with prepared data
        // Object.assign(this.form, preparedFormData);
        this.from = _objectSpread({}, this.form);
        this.form.put("/user/update-airway-bill/".concat(this.existingData.id)).then(function (response) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          if (response.data && response.data.data.first_box && response.data.data.first_box.original && response.data.data.first_box.original.data && response.data.data.first_box.original.data.id) {
            _this8.existingData = response.data.data.first_box.original.data;
            if (_this8.generatePDFAfterSave && _this8.existingData && _this8.existingData.id) {
              _this8.generateAwbPDF(_this8.generatePDFAfterSave);
            }
            _this8.successMessage = '-e-AWB Saved in database -Pass';
          } else {}
        })["catch"](function (error) {
          $('.submit-button').css({
            'pointer-events': 'auto',
            'opacity': '1'
          });
          var main_error_msg = '';
          if (error.response) {
            if (error.response.status === 422) {
              var errors = error.response.data.errors;
              for (var field in errors) {
                main_error_msg += "".concat(_this8.formatBackendError(errors[field][0]), "<br>");
              }
            }
          }
          _this8.main_error_msg = main_error_msg;
        });
      }
    },
    getAirwayBills: function getAirwayBills(status) {
      var _this9 = this;
      this.isFetching = true;
      this.data_items = []; // Clear stale data before fetch
      // Open the correct modal immediately — spinner shows while loading
      var modalId = status === 'draft' ? 'modal-draft' : 'modal-s';
      this.$bvModal.show(modalId);
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-airway-bills/".concat(status)).then(function (response) {
        _this9.data_items = response.data;
      })["catch"](function (error) {
        // console.error("Failed to fetch items:", error);
      })["finally"](function () {
        _this9.isFetching = false;
      });
    },
    getAirWayBill: function getAirWayBill(id) {
      var _this0 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        if (response.data && response.data.id == id) {
          _this0.existingData = response.data;
          _this0.existingData.payment_info = _objectSpread(_objectSpread({}, _this0.defaultPaymentInfo), _this0.existingData.payment_info || {});
          // this.setDefaultValues();
          _this0.showAWBSection = true;
          _this0.awbError = null;
          _this0.openForm('update', _this0.existingData.id);
          if (_this0.existingData && _this0.existingData.consignment_data) {
            _this0.isConsignmentAdded = true;
          }
        } else {
          _this0.showAWBSection = false; // Hide if no data exists
          _this0.awbError = "No data found for this AWB ID.";
        }
      })["catch"](function (error) {
        _this0.existingData = null;
        _this0.showAWBSection = false;
        _this0.awbError = "No data found for this AWB ID.";
        _this0.awbDetails = false;
      });
    },
    getAirWayBillForRealod: function getAirWayBillForRealod(id) {
      var _this1 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(id)).then(function (response) {
        var _response$data;
        var fetchedId = (_response$data = response.data) === null || _response$data === void 0 || (_response$data = _response$data.id) === null || _response$data === void 0 ? void 0 : _response$data.toString();
        var inputId = id.toString();
        if (fetchedId === inputId) {
          _this1.existingData = response.data;
          _this1.showAWBSection = true;
          _this1.awbError = null;
          // this.openForm('update', this.existingData.id);
        } else {
          _this1.existingData = null;
          _this1.showAWBSection = false;
          _this1.awbError = "No data found for this AWB ID.";
        }
      })["catch"](function (error) {
        var _error$response;
        // console.error("Error fetching AWB:", error.response || error);
        _this1.showAWBSection = false;
        _this1.awbError = ((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 404 ? "Air Waybill not found." : "";
      });
    },
    openForm: function openForm(mode) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.mode = mode;
      this.showAWBSection = false;
      if (mode === 'update' && id) {
        this.form.first_box = this.existingData;
        this.form.first_box.hawb_no = this.existingData.id;
        // Format dates for display when editing
        var routingInfo = _objectSpread({}, this.existingData);
        if (routingInfo.date) {
          routingInfo.date = this.formatDate(routingInfo.date);
        }
        if (routingInfo.date_2) {
          routingInfo.date_2 = this.formatDate(routingInfo.date_2);
        }
        if (routingInfo.date_3) {
          routingInfo.date_3 = this.formatDate(routingInfo.date_3);
        }
        this.form.routing_information = routingInfo;
        this.form.totals = this.existingData;
        this.form.custom_origin = this.existingData;
        this.form.tableCodes = JSON.parse(this.existingData.special_handling_info);

        // const specialHandlingCodes = this.form.tableCodes;
        var specialHandlingCodes = Array.isArray(this.form.tableCodes) ? this.form.tableCodes : [];
        if (specialHandlingCodes.includes("EAW")) {
          this.selectedCode = "EAW";
          this.form.first_box.awb = false;
        } else if (specialHandlingCodes.includes("EAP")) {
          this.selectedCode = "EAP";
          this.form.first_box.awb = false;
        } else if (this.form.first_box.awb === true) {
          this.selectedCode = "";
        }
        this.form.oci_entries = Array.isArray(this.existingData.other_custom_information) ? this.existingData.other_custom_information : [];

        // this.form.payment_info = this.existingData.payment_info || {};
        this.form.payment_info = _objectSpread(_objectSpread({}, this.defaultPaymentInfo), this.existingData.payment_info || {});
        this.form.charges = Array.isArray(this.existingData.other_charge) ? this.existingData.other_charge : [];
        // this.form.entries = Array.isArray(this.existingData.consignment_data)
        //     ? this.existingData.consignment_data
        //     : [this.existingData.consignment_data];
        var entry = this.existingData.consignment_data;
        // const parsedEntry = {
        //     ...entry,
        //     hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
        //     itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
        //     uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : [],
        //     // hsCodes: entry.hs_code && entry.hs_code !== '' ? JSON.parse(entry.hs_code) : [],
        //     // itemss: entry.pieces_info && entry.pieces_info !== '' ? JSON.parse(entry.pieces_info) : [],
        //     // uld_infos: entry.uld_info && entry.uld_info !== '' ? JSON.parse(entry.uld_info) : []

        // };
        // this.form.entries = [parsedEntry]; 
        if (entry) {
          var parsedEntry = _objectSpread(_objectSpread({}, entry), {}, {
            hsCodes: entry.hs_code ? JSON.parse(entry.hs_code) : [],
            itemss: entry.pieces_info ? JSON.parse(entry.pieces_info) : [],
            uld_infos: entry.uld_info ? JSON.parse(entry.uld_info) : []
          });
          this.form.entries = [parsedEntry];
          // console.log("Parsed entry:", parsedEntry);
        } else {
          // console.warn("No consignment data available. Entry is null or undefined.");
          this.form.entries = []; // Default to an empty array if no data exists
        }
        if (!this.form.entries) {
          this.isConsignmentAdded = true;
        }
        // this.form.entries = JSON.parse(this.existingData.consignment_data.pieces_info);
        // this.consignment_list = this.existingData.consignment_data;
        this.form.consignee_address = this.existingData.way_bill_address;
        this.form.shipper_address = this.existingData.way_bill_address;
        this.form.also_notify_address = this.existingData.way_bill_address;
        this.form.awb_email = this.existingData.awb_email;
      } else {
        // console.error('existingData is not an array:', this.existingData);
        // console.log("Add mode activated");
      }
    },
    handleEditNavigation: function handleEditNavigation(id) {
      this.$bvModal.hide('modal-s');
      var targetPath = "/edit-airway-bill/".concat(String(id));
      if (this.$route.path !== targetPath) {
        this.$router.push(targetPath).then(function () {
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    },
    getAgent: function getAgent(company_id, branch_id) {
      var _this10 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/agent-info").then(function (_ref7) {
        var data = _ref7.data;
        if (Array.isArray(data) && data.length > 0) {
          _this10.agent_information = data[0];
          _this10.iata_cass = {
            iata_agent_code: _this10.agent_information.iata_agent_code || null,
            iata_agent_cass: _this10.agent_information.iata_agent_cass || null
          };
        } else {
          _this10.agent_information = data;
        }
      })["catch"](function (error) {
        // console.error("Error fetching agent information:", error);
      });
    },
    getCountry: function getCountry() {
      var _this11 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-country').then(function (_ref8) {
        var data = _ref8.data;
        _this11.countries = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {
        // console.error("Error fetching countries:", error);
      });
    },
    getOtherChargesCode: function getOtherChargesCode() {
      var _this12 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/other-charges').then(function (_ref9) {
        var data = _ref9.data;
        _this12.other_charges_code = Object.keys(data).map(function (key) {
          return {
            value: key,
            text: data[key]
          };
        });
      })["catch"](function (error) {
        // console.error("Error fetching countries:", error);
      });
    },
    getOCIData: function getOCIData() {
      var _this13 = this;
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get('/user/get-oci-data').then(function (_ref0) {
        var data = _ref0.data;
        if (data && data.oci_custom_info_identifier) {
          _this13.oci_data.oci_custom_info_identifier = Object.entries(data.oci_custom_info_identifier).map(function (_ref1) {
            var _ref10 = _slicedToArray(_ref1, 2),
              key = _ref10[0],
              value = _ref10[1];
            return {
              value: key,
              text: value
            };
          });
        } else {
          _this13.oci_data.oci_custom_info_identifier = [];
        }
        if (data && data.identifiers) {
          _this13.oci_identifiers.identifiers = Object.entries(data.identifiers).map(function (_ref11) {
            var _ref12 = _slicedToArray(_ref11, 2),
              key = _ref12[0],
              value = _ref12[1];
            return {
              value: key,
              text: value
            };
          });
        }
      })["catch"](function (error) {
        // console.error("Error fetching countries:", error);
        _this13.oci_data.oci_custom_info_identifier = [];
      });
    },
    handleRadioChange: function handleRadioChange(value) {
      // const selectedCode = this.selectedCode;
      // this.form.tableCodes = [];
      // this.form.tableCodes.push(selectedCode);

      // this.form.first_box.awb = false;

      if (!Array.isArray(this.form.tableCodes)) {
        this.form.tableCodes = [];
      }
      if (value === true) {
        this.selectedCode = "";
        this.form.tableCodes = this.form.tableCodes.filter(function (code) {
          return code !== "EAW" && code !== "EAP";
        });
        this.form.first_box.awb = true;
      } else {
        this.form.tableCodes = this.form.tableCodes.filter(function (code) {
          return code !== "EAW" && code !== "EAP";
        });
        if (value) {
          this.form.tableCodes.push(value);
        }
        this.form.first_box.awb = false;
      }
      // console.log("Updated Table Codes:", this.form.tableCodes);
    },
    addManualCode: function addManualCode() {
      if (!Array.isArray(this.form.tableCodes)) {
        this.form.tableCodes = [];
      }
      var code = this.selectedCode || this.custom_special_handling_code.trim();
      if (code) {
        if (!this.form.tableCodes.includes(code)) {
          this.form.tableCodes.push(code);
          // console.log("Table codes:", this.form.tableCodes);
        } else {
          alert('This code is already added.');
        }
      } else {
        alert('Please select or enter a code.');
      }
      this.selectedCode = '';
      this.custom_special_handling_code = '';
    },
    deleteSplCode: function deleteSplCode(index) {
      this.form.tableCodes.splice(index, 1);
    },
    validateNumericInput: function validateNumericInput(evt, field, maxLength) {
      evt = evt || window.event;
      var charCode = evt.which || evt.keyCode;
      if (charCode < 48 || charCode > 57) {
        evt.preventDefault();
      }
      if (this.form.first_box[field].length >= maxLength) {
        evt.preventDefault();
      }
    },
    onAWBInput: lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default()(function () {
      var _this14 = this;
      var _this$form$first_box = this.form.first_box,
        awb_code = _this$form$first_box.awb_code,
        awb_no = _this$form$first_box.awb_no;
      if (awb_code && awb_code.length === 3) {
        _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/get-awbcode-prefix/".concat(awb_code)).then(function (response) {
          if (response.data) {
            var _response$data2 = response.data,
              name = _response$data2.name,
              code = _response$data2.code;
            _this14.awb_prefix_message = "Message will be sent to ".concat(name, " (").concat(code, ")");
          } else {
            _this14.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
          }
        })["catch"](function (error) {
          console.error("Error fetching AWB details:", error);
          _this14.awb_prefix_message = "No agreement found for: ".concat(awb_code, " You will not be able to send the message to this carrier - only generate a PDF.");
        });
      } else {
        this.awb_prefix_message = "";
      }
      if (awb_code && awb_no) {
        // this.awbError = null;
        // this.awb_prefix_message = "";
        this.awbId = "".concat(String(awb_code)).concat(String(awb_no));
        this.getAirWayBillForRealod(this.awbId);
        this.$router.push({
          query: {
            awb_code: String(awb_code),
            awb_no: String(awb_no)
          }
        });
      } else {
        this.awbId = null;
        return;
      }
    }, 500),
    confirmReload: function confirmReload() {
      var confirmed = window.confirm("Are you sure you want to reload the content for AWB: ".concat(this.awbId, "?"));
      if (confirmed) {
        this.awbDetails = false;
        this.showAWBSection = false;
        // openForm('update', this.existingData.id)
        this.$router.go(0);
        this.getAirWayBill(this.awbId);
      }
    },
    reloadPageWithContent: function reloadPageWithContent() {
      var _this15 = this;
      var awbId = this.awbId;
      if (!awbId) {
        // console.error('AWB ID is missing');
        return;
      }
      _core_services_api_service__WEBPACK_IMPORTED_MODULE_2__["default"].get("/user/airway-bill/".concat(awbId)).then(function (response) {
        _this15.existingData = response.data;
        if (_this15.existingData) {
          _this15.awbDetails = false;
          _this15.openForm('update', _this15.existingData.id);
          // this.$router.push({ path: `/edit-airway-bill/${awbId}`});
          _this15.location.reload();
          // this.$router.push({ path: `/edit-airway-bill/${awbId}` });
        } else {
          _this15.awbDetails = false;
        }
      })["catch"](function (error) {
        _this15.existingData = null;
        // this.awbError = "No data found for this AWB ID.";
        _this15.awbDetails = false;
        // console.error("Failed to fetch data for updating:", error);
      });
    }
  },
  mounted: function mounted() {
    // this.setDefaultValues();
    this.calculateTotalVolume();
    this.getLocation();
    this.fetchAllAddressBook();
    this.fillShipperDetails();
    this.fillConsigneeDetails();
    this.fillAlsoNotifyDetails();
    this.getCountry();
    this.getOtherChargesCode();
    this.getOCIData();
    this.location = [];
    var _this$$route$query = this.$route.query,
      awbId = _this$$route$query.awbId,
      awbError = _this$$route$query.awbError,
      existingData = _this$$route$query.existingData;
    if (awbId) {
      this.awbId = awbId;
    }
    if (awbError) {
      this.awbError = awbError;
    }
    if (existingData) {
      this.existingData = JSON.parse(existingData);
    }
    if (!this.awbId) {
      var _this$$route$query2 = this.$route.query,
        awb_code = _this$$route$query2.awb_code,
        awb_no = _this$$route$query2.awb_no;
      if (awb_code && awb_no) {
        this.awbId = "".concat(String(awb_code)).concat(String(awb_no));
        this.getAirWayBill(this.awbId);
        this.showAWBSection = false;
      }
    }
    // console.log("Current User:", this.current_user);
    if (this.current_user) this.getAgent(this.current_user.company_name, this.current_user.branch_name);
  },
  watch: {
    // 'consignment_list': function () {
    //     this.form.totals.total_amount = this.calculateTotalAmount();
    // },
    // 'form.entries.dimention_unit': function() {
    //     this.calculateTotalVolume();
    // },
    'agent_information.participate': function agent_informationParticipate(newValue) {
      // console.log('Participate value changed to:', newValue);
    },
    '$route.params.id': function $routeParamsId(newId) {
      if (newId) {
        this.getAirWayBill(newId);
      }
    },
    existingData: function existingData(newData) {
      // console.log("New data:", newData);
      if (newData && newData.id) {
        // this.generateAwbPDF();
      } else {
        // console.error('ID is missing in new data, cannot generate PDF.');
      }
    }
  },
  created: function created() {
    var id = this.$route.params.id;
    if (id) {
      this.isEdit = true;
      this.getAirWayBill(id);
    }
    this.getOCIData();
    this.onSubmit = this.onSubmit.bind(this);
  },
  computed: _objectSpread(_objectSpread({}, (0,vuex__WEBPACK_IMPORTED_MODULE_9__.mapGetters)({
    current_user: "currentUser"
  })), {}, {
    submitButtonText: function submitButtonText() {
      return this.mode === 'add' ? 'Add Draft' : 'Update Draft';
    },
    formattedAWBId: function formattedAWBId() {
      if (this.awbId && this.awbId.length > 3) {
        return "".concat(this.awbId.slice(0, 3), "-").concat(this.awbId.slice(3));
      }
      return this.awbId;
    }
  }),
  components: {
    DashboardHistoryModal: _view_components_DashboardHistoryModal_vue__WEBPACK_IMPORTED_MODULE_7__["default"],
    OcrUploadModal: _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_6__["default"],
    Datepicker: vuejs_datepicker__WEBPACK_IMPORTED_MODULE_0__["default"],
    DatePicker: vue2_datepicker__WEBPACK_IMPORTED_MODULE_1__["default"],
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
    // PageLoader
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/view/layouts/public/SideBar.vue */ "./resources/js/src/view/layouts/public/SideBar.vue");
/* harmony import */ var _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/view/components/OcrUploadModal.vue */ "./resources/js/src/view/components/OcrUploadModal.vue");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "FocusAirImport",
  components: {
    SideBar: _view_layouts_public_SideBar_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    OcrUploadModal: _view_components_OcrUploadModal_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: {
    isDrawer: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      successMsg: null,
      validationWarning: null,
      formLoading: false,
      selectedOriginAgent: null,
      selectedDestAgent: null,
      selectedSellingAgent: null,
      selectedConsignee: null,
      selectedTransporter: null,
      selectedCustomBroker: null,
      selectedUnassociatedHawb: null,
      copyConsigneeAddrCheckbox: false,
      uploadProgress: 0,
      customsFilterStatus: "Both",
      customsFilterGate: "",
      filingProcessing: false,
      isCgmValid: false,
      dscLogs: [],
      // Consol main parameters
      form: {
        execution_job_no: "",
        planned_clearance_date: "",
        cargo_type: "Loose",
        job_owner_id: 1,
        consol_type: "Agent Consolidation",
        entities: {
          origin_agent: {
            id: null,
            address: ""
          },
          dest_agent: {
            id: null,
            address: ""
          },
          selling_agent: {
            id: null,
            address: ""
          }
        },
        shipping_details: {
          flight_number: "",
          mawb_number: "",
          carrier_name: "",
          eta_datetime: "",
          etd_datetime: ""
        },
        routing: {
          departure_airport: "",
          destination_airport: "",
          legs: [{
            airport: "",
            carrier: "",
            flight_no: "",
            date: ""
          }]
        },
        attached_house: [],
        packing: {
          piece_count: 0,
          gross_weight: 0.0,
          chargeable_weight: 0.0,
          volume_cbm: 0.0
        },
        delivery_order: {
          delivery_order_no: "",
          delivery_order_date: "",
          status: "hold",
          do_release_fee: 1500.0,
          warehouse_fee: 2500.0,
          consignee_id: null,
          consignee_address: "",
          transporter_id: null,
          customs_broker_id: null,
          high_sea_buyer: "",
          pickup_address: "ACC Chennai Cargo Warehouse Terminal B Gate 12",
          delivery_address: ""
        },
        charges: [{
          code: "AF",
          description: "Air Freight Charges",
          prepaid: 45000.0,
          collect: 0.0
        }, {
          code: "MY",
          description: "Fuel Surcharge",
          prepaid: 8500.0,
          collect: 0.0
        }, {
          code: "SC",
          description: "Security Surcharge",
          prepaid: 1200.0,
          collect: 0.0
        }, {
          code: "DO",
          description: "Delivery Order Release Charges",
          prepaid: 0.0,
          collect: 1500.0
        }],
        financials: {
          payment_status: "Pending",
          invoice_no: "INV-26-8920",
          invoice_amount: 56200.0,
          receipt_no: ""
        },
        customs_filings: [{
          id: 301,
          filing_type: "CGM",
          transaction_status: "accepted",
          customs_house_code: "INMAA4",
          flat_file_path: "s3://f16s-manifests/flat_cgm_301.txt",
          submitted_by: "Jomy George",
          submitted_at: "2026-06-15 10:30 AM"
        }, {
          id: 302,
          filing_type: "SCMTR",
          transaction_status: "rejected",
          customs_house_code: "INMAA4",
          flat_file_path: "s3://f16s-manifests/flat_scm_302.txt",
          submitted_by: "Jomy George",
          submitted_at: "2026-06-15 11:15 AM"
        }],
        e_docket: [{
          file_name: "Commercial_Invoice_Apex.pdf",
          file_size: 245000,
          document_type: "commercial_invoice",
          mime_type: "application/pdf"
        }, {
          file_name: "Packing_List_Apex.pdf",
          file_size: 184000,
          document_type: "packing_list",
          mime_type: "application/pdf"
        }]
      },
      // Dropdown Options Setup
      cargoTypeOptions: [{
        value: "Loose",
        text: "Loose"
      }, {
        value: "ULD",
        text: "ULD"
      }, {
        value: "",
        text: "(Blank)"
      }],
      consolTypeOptions: [{
        value: "Agent Consolidation",
        text: "Agent Consolidation"
      }, {
        value: "Buyer's Consolidation",
        text: "Buyer's Consolidation"
      }, {
        value: "",
        text: "(Blank)"
      }],
      ownerOptions: [{
        value: 1,
        text: "Jomy George"
      }, {
        value: 2,
        text: "KSR Operator"
      }, {
        value: 3,
        text: "Admin"
      }],
      originAgentOptions: [{
        value: null,
        text: "-- Select Origin Agent --"
      }, {
        value: 10,
        text: "Apex Air Logistics (DXB)"
      }, {
        value: 11,
        text: "Gulf Cargo Agency (DOH)"
      }, {
        value: 12,
        text: "Zenith Forwarding (LHR)"
      }],
      destAgentOptions: [{
        value: null,
        text: "-- Select Destination Agent --"
      }, {
        value: 20,
        text: "KSR Freight Forwarders (Chennai)"
      }, {
        value: 21,
        text: "F16s Logistics Pvt Ltd (Mumbai)"
      }],
      sellingAgentOptions: [{
        value: null,
        text: "-- Select Selling Agent --"
      }, {
        value: 30,
        text: "Apex Global Exporters (Dubai)"
      }, {
        value: 31,
        text: "India Cargo Commission Co"
      }],
      consigneeListOptions: [{
        value: null,
        text: "-- Select Consignee --"
      }, {
        value: 50,
        text: "Logistics Gulf Trading Ltd"
      }, {
        value: 51,
        text: "Zenith Textiles India Pvt Ltd"
      }, {
        value: 52,
        text: "Dubai Garment Importers"
      }],
      transporterOptions: [{
        value: null,
        text: "-- Select Transporter --"
      }, {
        value: 60,
        text: "Standard Trucking Chennai Co."
      }, {
        value: 61,
        text: "FastExpress Seafreight Haulers"
      }],
      customBrokerOptions: [{
        value: null,
        text: "-- Select Customs Broker --"
      }, {
        value: 70,
        text: "KSR Clearing House Agent Ltd"
      }, {
        value: 71,
        text: "Direct Self Clearance"
      }],
      doStatusOptions: [{
        value: "hold",
        text: "Hold"
      }, {
        value: "released",
        text: "Released"
      }, {
        value: "cargo_collected",
        text: "Cargo Collected"
      }],
      paymentStatusOptions: [{
        value: "Pending",
        text: "Pending"
      }, {
        value: "Cash",
        text: "Cash"
      }, {
        value: "Cheque",
        text: "Cheque"
      }, {
        value: "Bank Transfer/NEFT",
        text: "Bank Transfer/NEFT"
      }, {
        value: "Credit Account",
        text: "Credit Account"
      }],
      customsFilterOptions: [{
        value: "Both",
        text: "Filter: All Statuses"
      }, {
        value: "accepted",
        text: "Accepted Only"
      }, {
        value: "submitted",
        text: "Submitted Only"
      }, {
        value: "rejected",
        text: "Rejected Only"
      }],
      sendingMethods: [{
        text: "Auto File (ICEGATE Portal)",
        value: "auto"
      }, {
        text: "Manual Upload",
        value: "manual"
      }, {
        text: "Direct Email Gateway",
        value: "email"
      }],
      documentTypeOptions: [{
        value: "commercial_invoice",
        text: "Commercial Invoice"
      }, {
        value: "packing_list",
        text: "Packing List"
      }, {
        value: "certificate_of_origin",
        text: "Certificate of Origin"
      }, {
        value: "awb_copy",
        text: "AWB Copy"
      }, {
        value: "hawb_copy",
        text: "HAWB Copy"
      }, {
        value: "delivery_order",
        text: "Delivery Order"
      }, {
        value: "arrival_notice",
        text: "Arrival Notice"
      }, {
        value: "other",
        text: "Other"
      }],
      // HAWB Table configuration
      hawbTableFields: [{
        key: "hawb_number",
        label: "HAWB Number",
        sortable: true
      }, {
        key: "shipper",
        label: "Shipper"
      }, {
        key: "consignee",
        label: "Consignee"
      }, {
        key: "piece_count",
        label: "Pieces"
      }, {
        key: "gross_weight",
        label: "Gross Wt"
      }, {
        key: "volume_cbm",
        label: "Vol CBM"
      }, {
        key: "actions",
        label: "Action"
      }],
      customsTableFields: [{
        key: "filing_type",
        label: "Filing Type"
      }, {
        key: "transaction_status",
        label: "Transaction Status"
      }, {
        key: "customs_house_code",
        label: "Custom House"
      }, {
        key: "flat_file_path",
        label: "Transmitted File"
      }, {
        key: "submitted_by",
        label: "Filer"
      }, {
        key: "submitted_at",
        label: "Submission Date"
      }, {
        key: "actions",
        label: "Action"
      }],
      // Dimensions Calculator state
      calculatorRows: [{
        pieces: 10,
        length: 120,
        width: 80,
        height: 100,
        volume_cbm: 0.96,
        vol_weight: 160.0
      }, {
        pieces: 5,
        length: 100,
        width: 100,
        height: 120,
        volume_cbm: 0.6,
        vol_weight: 100.0
      }],
      // Master lookup databases
      agentsDatabase: {
        10: {
          name: "Apex Air Logistics (DXB)",
          address: "Suite 405, Air Cargo Terminal\nDubai Int Airport, DXB\nUnited Arab Emirates"
        },
        11: {
          name: "Gulf Cargo Agency (DOH)",
          address: "Gate 15, Warehouse complex\nHamad International Airport\nDoha, Qatar"
        },
        12: {
          name: "Zenith Forwarding (LHR)",
          address: "Aviation House, Terminal 4\nHeathrow Int Airport\nLondon, United Kingdom"
        },
        20: {
          name: "KSR Freight Forwarders (Chennai)",
          address: "No. 42 General Muthaiah St\nACC Terminal Chennai\nChennai, TN 600001, India"
        },
        21: {
          name: "F16s Logistics Pvt Ltd (Mumbai)",
          address: "A-Wing 305, Freight Complex\nSahar Cargo Gate 3, ACC\nMumbai, MH 400099, India"
        },
        30: {
          name: "Apex Global Exporters (Dubai)",
          address: "Jebel Ali Industrial Area 2\nPlot 9048, Warehouses\nDubai, UAE"
        },
        31: {
          name: "India Cargo Commission Co",
          address: "Customs Agent Enclave\nACC Gate 4 Road\nChennai, TN, India"
        }
      },
      consigneeDatabase: {
        50: {
          name: "Logistics Gulf Trading Ltd",
          address: "No. 5 Cargo Ring Road, Jebel Ali Free Zone, Dubai, UAE",
          credit_limit: 500000.00,
          outstanding_balance: 345000.00,
          credit_status: "active",
          default_payment_terms: "Net 30"
        },
        51: {
          name: "Zenith Textiles India Pvt Ltd",
          address: "B-24 Industrial Development Area, Guindy, Chennai, India",
          credit_limit: 800000.00,
          outstanding_balance: 895000.00,
          credit_status: "hold",
          default_payment_terms: "COD Only"
        },
        52: {
          name: "Dubai Garment Importers",
          address: "Al Maktoum St, Deira Trade Center Suite 12, Dubai, UAE",
          credit_limit: 300000.00,
          outstanding_balance: 300000.00,
          credit_status: "suspended",
          default_payment_terms: "Prepaid Required"
        }
      },
      transporterDatabase: {
        60: {
          name: "Standard Trucking Chennai Co.",
          address: "National Highway Bypass 4, Poonamallee, Chennai, India"
        },
        61: {
          name: "FastExpress Seafreight Haulers",
          address: "GNT Road Madhavaram, Container Yard 5, Chennai, India"
        }
      },
      customBrokerDatabase: {
        70: {
          name: "KSR Clearing House Agent Ltd",
          address: "No. 8 Custom Broker Enclave, Air Cargo Gate, Chennai, India"
        },
        71: {
          name: "Direct Self Clearance",
          address: "Inhouse Customs Dept, F16s Operations, India"
        }
      },
      // Unassociated HAWB pool (dynamic linkages)
      unassociatedPool: [{
        id: 901,
        hawb_number: "HAWB-DEL-9482",
        shipper: "Saffron Exotics Ltd",
        consignee: "Logistics Gulf Trading Ltd",
        piece_count: 15,
        gross_weight: 450.0,
        volume_cbm: 1.2
      }, {
        id: 902,
        hawb_number: "HAWB-DXB-3829",
        shipper: "Jebel Ali Polymers",
        consignee: "Zenith Textiles India Pvt Ltd",
        piece_count: 8,
        gross_weight: 1200.0,
        volume_cbm: 3.4
      }, {
        id: 903,
        hawb_number: "HAWB-LHR-8290",
        shipper: "Oxford Instruments",
        consignee: "India Tech Systems Ltd",
        piece_count: 2,
        gross_weight: 85.0,
        volume_cbm: 0.45
      }],
      // CGM Modal Filing variables
      cgmFilingForm: {
        datetime: "",
        consol_no: "",
        customs_house: "INMAA4",
        sending_method: "auto"
      }
    };
  },
  computed: {
    // Unassociated HAWB select choices
    unassociatedHawbOptions: function unassociatedHawbOptions() {
      var opts = [{
        value: null,
        text: "-- Choose House AWB to Link --",
        disabled: true
      }];
      this.unassociatedPool.forEach(function (item) {
        opts.push({
          value: item.id,
          text: "".concat(item.hawb_number, " (").concat(item.shipper, " \u2794 ").concat(item.consignee, ") - ").concat(item.piece_count, " Pcs / ").concat(item.gross_weight, " KGS")
        });
      });
      return opts;
    },
    // Charges summations
    totalChargesPrepaid: function totalChargesPrepaid() {
      return this.form.charges.reduce(function (sum, item) {
        return sum + (Number(item.prepaid) || 0);
      }, 0);
    },
    totalChargesCollect: function totalChargesCollect() {
      return this.form.charges.reduce(function (sum, item) {
        return sum + (Number(item.collect) || 0);
      }, 0);
    },
    // Selected Consignee Object
    selectedConsigneeObj: function selectedConsigneeObj() {
      if (!this.selectedConsignee) return null;
      return this.consigneeDatabase[this.selectedConsignee] || null;
    },
    // Credit gate checks
    isCreditLimitExceeded: function isCreditLimitExceeded() {
      if (!this.selectedConsigneeObj) return false;
      var outstanding = this.selectedConsigneeObj.outstanding_balance || 0;
      var limit = this.selectedConsigneeObj.credit_limit || 0;
      return outstanding > limit || this.selectedConsigneeObj.credit_status === "suspended";
    },
    isDOBlocked: function isDOBlocked() {
      return this.form.financials.payment_status === "Pending" || this.isCreditLimitExceeded || this.form.delivery_order.status === "hold";
    },
    // Dimensions calculator totals
    calcTotalPieces: function calcTotalPieces() {
      return this.calculatorRows.reduce(function (sum, r) {
        return sum + (Number(r.pieces) || 0);
      }, 0);
    },
    calcTotalCbm: function calcTotalCbm() {
      return this.calculatorRows.reduce(function (sum, r) {
        return sum + (Number(r.volume_cbm) || 0);
      }, 0);
    },
    calcTotalVolWeight: function calcTotalVolWeight() {
      return this.calculatorRows.reduce(function (sum, r) {
        return sum + (Number(r.vol_weight) || 0);
      }, 0);
    },
    // Customs listings filtered
    filteredCustomsFilings: function filteredCustomsFilings() {
      var _this = this;
      return this.form.customs_filings.filter(function (f) {
        var matchStatus = _this.customsFilterStatus === "Both" || f.transaction_status === _this.customsFilterStatus;
        var matchGate = !_this.customsFilterGate || f.customs_house_code.toUpperCase().includes(_this.customsFilterGate.toUpperCase());
        return matchStatus && matchGate;
      });
    }
  },
  methods: {
    // Date/Time UI formatter
    formatDateTime: function formatDateTime(dtStr) {
      if (!dtStr) return "TBD";
      return dtStr.replace("T", " ");
    },
    formatWeight: function formatWeight(wtVal) {
      if (wtVal === undefined || wtVal === null) return "0.000";
      return Number(wtVal).toFixed(3);
    },
    formatVol: function formatVol(volVal) {
      if (volVal === undefined || volVal === null) return "0.000";
      return Number(volVal).toFixed(3);
    },
    formatCurrency: function formatCurrency(val) {
      if (val === undefined || val === null) return "₹ 0.00";
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(val);
    },
    getOwnerName: function getOwnerName(ownerId) {
      var matched = this.ownerOptions.find(function (o) {
        return o.value === ownerId;
      });
      return matched ? matched.text : "Jomy George";
    },
    // Demo Data Seeding
    loadDemoConsol: function loadDemoConsol() {
      this.successMsg = "Demo consolidation payload loaded successfully.";
      this.validationWarning = null;
      this.form.execution_job_no = "JOBA-26-9028";
      this.form.planned_clearance_date = "2026-06-20";
      this.form.cargo_type = "Loose";
      this.form.job_owner_id = 1;
      this.form.consol_type = "Agent Consolidation";

      // Fill Entities
      this.selectedOriginAgent = 10;
      this.form.entities.origin_agent = {
        id: 10,
        address: this.agentsDatabase[10].address
      };
      this.selectedDestAgent = 20;
      this.form.entities.dest_agent = {
        id: 20,
        address: this.agentsDatabase[20].address
      };
      this.selectedSellingAgent = 30;
      this.form.entities.selling_agent = {
        id: 30,
        address: this.agentsDatabase[30].address
      };

      // Shipping Details
      this.form.shipping_details = {
        flight_number: "EK502",
        mawb_number: "020-98304921",
        carrier_name: "Emirates Cargo",
        eta_datetime: "2026-06-19T14:30",
        etd_datetime: "2026-06-19T04:15"
      };

      // Routing
      this.form.routing = {
        departure_airport: "DXB",
        destination_airport: "MAA",
        legs: [{
          airport: "DXB",
          carrier: "Emirates",
          flight_no: "EK502",
          date: "2026-06-19"
        }]
      };

      // Bundle items
      this.form.attached_house = [{
        id: 101,
        hawb_number: "HAWB-MAA-2948A",
        shipper: "Zenith Textiles Ltd",
        consignee: "Logistics Gulf Trading Ltd",
        piece_count: 15,
        gross_weight: 1560.0,
        volume_cbm: 4.8
      }, {
        id: 102,
        hawb_number: "HAWB-MAA-2948B",
        shipper: "Apex Leather Exports",
        consignee: "Logistics Gulf Trading Ltd",
        piece_count: 10,
        gross_weight: 850.0,
        volume_cbm: 2.5
      }];

      // Reset Dimensions Calculator to synchronize with mock
      this.calculatorRows = [{
        pieces: 15,
        length: 120,
        width: 80,
        height: 100,
        volume_cbm: 1.44,
        vol_weight: 240.0
      }, {
        pieces: 10,
        length: 100,
        width: 100,
        height: 120,
        volume_cbm: 1.2,
        vol_weight: 200.0
      }];

      // Packing Details aggregates
      this.form.packing = {
        piece_count: 25,
        gross_weight: 2410.0,
        volume_cbm: 7.3,
        chargeable_weight: 2410.0
      };

      // Delivery Order
      this.selectedConsignee = 50;
      this.form.delivery_order.consignee_id = 50;
      this.form.delivery_order.consignee_address = this.consigneeDatabase[50].address;
      this.selectedTransporter = 60;
      this.form.delivery_order.transporter_id = 60;
      this.selectedCustomBroker = 70;
      this.form.delivery_order.customs_broker_id = 70;
      this.form.delivery_order.delivery_address = this.consigneeDatabase[50].address;
      this.copyConsigneeAddrCheckbox = true;
      this.form.delivery_order.delivery_order_no = "DO-AIMP-90280";
      this.form.delivery_order.delivery_order_date = "2026-06-16";
      this.form.delivery_order.status = "released";

      // Financials
      this.form.financials.payment_status = "Credit Account";
      this.form.financials.invoice_no = "INV-26-9028";
      this.form.financials.invoice_amount = 54700.0;
      this.form.financials.receipt_no = "REC-26-4820";
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    resetForm: function resetForm() {
      this.successMsg = null;
      this.validationWarning = null;
      this.selectedOriginAgent = null;
      this.selectedDestAgent = null;
      this.selectedSellingAgent = null;
      this.selectedConsignee = null;
      this.selectedTransporter = null;
      this.selectedCustomBroker = null;
      this.selectedUnassociatedHawb = null;
      this.copyConsigneeAddrCheckbox = false;
      this.form = {
        execution_job_no: "",
        planned_clearance_date: "",
        cargo_type: "Loose",
        job_owner_id: 1,
        consol_type: "Agent Consolidation",
        entities: {
          origin_agent: {
            id: null,
            address: ""
          },
          dest_agent: {
            id: null,
            address: ""
          },
          selling_agent: {
            id: null,
            address: ""
          }
        },
        shipping_details: {
          flight_number: "",
          mawb_number: "",
          carrier_name: "",
          eta_datetime: "",
          etd_datetime: ""
        },
        routing: {
          departure_airport: "",
          destination_airport: "",
          legs: [{
            airport: "",
            carrier: "",
            flight_no: "",
            date: ""
          }]
        },
        attached_house: [],
        packing: {
          piece_count: 0,
          gross_weight: 0.0,
          chargeable_weight: 0.0,
          volume_cbm: 0.0
        },
        delivery_order: {
          delivery_order_no: "",
          delivery_order_date: "",
          status: "hold",
          do_release_fee: 1500.0,
          warehouse_fee: 2500.0,
          consignee_id: null,
          consignee_address: "",
          transporter_id: null,
          customs_broker_id: null,
          high_sea_buyer: "",
          pickup_address: "ACC Chennai Cargo Warehouse Terminal B Gate 12",
          delivery_address: ""
        },
        charges: [{
          code: "AF",
          description: "Air Freight Charges",
          prepaid: 0.0,
          collect: 0.0
        }],
        financials: {
          payment_status: "Pending",
          invoice_no: "",
          invoice_amount: 0.0,
          receipt_no: ""
        },
        customs_filings: [],
        e_docket: []
      };
      this.calculatorRows = [];
    },
    // Agent lookup selection updates
    onOriginAgentSelect: function onOriginAgentSelect() {
      if (this.selectedOriginAgent) {
        this.form.entities.origin_agent = {
          id: this.selectedOriginAgent,
          address: this.agentsDatabase[this.selectedOriginAgent].address
        };
      }
    },
    onDestAgentSelect: function onDestAgentSelect() {
      if (this.selectedDestAgent) {
        this.form.entities.dest_agent = {
          id: this.selectedDestAgent,
          address: this.agentsDatabase[this.selectedDestAgent].address
        };
      }
    },
    onSellingAgentSelect: function onSellingAgentSelect() {
      if (this.selectedSellingAgent) {
        this.form.entities.selling_agent = {
          id: this.selectedSellingAgent,
          address: this.agentsDatabase[this.selectedSellingAgent].address
        };
      }
    },
    // Validation tools
    hasAddressLineOverrun: function hasAddressLineOverrun(addressText) {
      if (!addressText) return false;
      var lines = addressText.split("\n");
      return lines.some(function (line) {
        return line.length > 35;
      });
    },
    validateIataCode: function validateIataCode(airportCode) {
      if (!airportCode) return true;
      return /^[A-Z]{3}$/.test(airportCode);
    },
    validateMawbFormat: function validateMawbFormat(mawbNo) {
      if (!mawbNo) return true;
      return /^\d{3}-\d{8}$/.test(mawbNo);
    },
    // Routing Leg list management
    addRoutingLeg: function addRoutingLeg() {
      this.form.routing.legs.push({
        airport: "",
        carrier: "",
        flight_no: "",
        date: ""
      });
    },
    removeRoutingLeg: function removeRoutingLeg(idx) {
      this.form.routing.legs.splice(idx, 1);
    },
    // HAWB linking methods
    linkHawb: function linkHawb() {
      var _this2 = this;
      if (!this.selectedUnassociatedHawb) return;
      var matchedIdx = this.unassociatedPool.findIndex(function (item) {
        return item.id === _this2.selectedUnassociatedHawb;
      });
      if (matchedIdx !== -1) {
        var item = this.unassociatedPool[matchedIdx];
        this.form.attached_house.push({
          id: item.id,
          hawb_number: item.hawb_number,
          shipper: item.shipper,
          consignee: item.consignee,
          piece_count: item.piece_count,
          gross_weight: item.gross_weight,
          volume_cbm: item.volume_cbm
        });

        // Sum aggregates
        this.form.packing.piece_count += item.piece_count;
        this.form.packing.gross_weight += item.gross_weight;
        this.form.packing.volume_cbm += item.volume_cbm;

        // Dynamic Chargeable Weight calc
        var volWt = item.volume_cbm * 1000000 / 6000;
        this.form.packing.chargeable_weight += Math.max(item.gross_weight, volWt);

        // Remove from pending lookup pool
        this.unassociatedPool.splice(matchedIdx, 1);
        this.selectedUnassociatedHawb = null;
        this.linkHawbSuccess = true;
        setTimeout(function () {
          _this2.linkHawbSuccess = false;
        }, 3000);
      }
    },
    unlinkHawb: function unlinkHawb(itemId) {
      var matchedIdx = this.form.attached_house.findIndex(function (h) {
        return h.id === itemId;
      });
      if (matchedIdx !== -1) {
        var item = this.form.attached_house[matchedIdx];

        // Deduct aggregates
        this.form.packing.piece_count -= item.piece_count;
        this.form.packing.gross_weight -= item.gross_weight;
        this.form.packing.volume_cbm -= item.volume_cbm;
        var volWt = item.volume_cbm * 1000000 / 6000;
        this.form.packing.chargeable_weight -= Math.max(item.gross_weight, volWt);
        if (this.form.packing.chargeable_weight < 0) this.form.packing.chargeable_weight = 0;

        // Push back to unassociated pool
        this.unassociatedPool.push({
          id: item.id,
          hawb_number: item.hawb_number,
          shipper: item.shipper,
          consignee: item.consignee,
          piece_count: item.piece_count,
          gross_weight: item.gross_weight,
          volume_cbm: item.volume_cbm
        });
        this.form.attached_house.splice(matchedIdx, 1);
      }
    },
    // Packing Dimensions calculator calculations
    addDimensionRow: function addDimensionRow() {
      this.calculatorRows.push({
        pieces: 1,
        length: 50,
        width: 50,
        height: 50,
        volume_cbm: 0.125,
        vol_weight: 20.83
      });
    },
    removeDimensionRow: function removeDimensionRow(idx) {
      this.calculatorRows.splice(idx, 1);
    },
    recalcVolumeRow: function recalcVolumeRow(idx) {
      var row = this.calculatorRows[idx];
      var pcs = Number(row.pieces) || 0;
      var l = Number(row.length) || 0;
      var w = Number(row.width) || 0;
      var h = Number(row.height) || 0;

      // Vol in CBM = L * W * H * Pcs / 1,000,000
      row.volume_cbm = pcs * l * w * h / 1000000;
      // Vol Weight = CBM * 166.67 (which is Vol / 6000 inside cubic centimeters)
      row.vol_weight = row.volume_cbm * 166.67;
    },
    applyCalculatorToPacking: function applyCalculatorToPacking() {
      var _this3 = this;
      this.form.packing.piece_count = this.calcTotalPieces;
      this.form.packing.volume_cbm = this.calcTotalCbm;
      // Recalc Chargeable Weight
      this.form.packing.chargeable_weight = Math.max(this.form.packing.gross_weight, this.calcTotalVolWeight);
      this.successMsg = "Calculated volumetric packing dimensions applied to Consol totals.";
      setTimeout(function () {
        _this3.successMsg = null;
      }, 3000);
    },
    // DO Release party lookup selection handlers
    onConsigneeSelect: function onConsigneeSelect() {
      if (this.selectedConsignee) {
        var c = this.consigneeDatabase[this.selectedConsignee];
        this.form.delivery_order.consignee_id = this.selectedConsignee;
        this.form.delivery_order.consignee_address = c.address;
        if (this.copyConsigneeAddrCheckbox) {
          this.form.delivery_order.delivery_address = c.address;
        }
      }
    },
    onTransporterSelect: function onTransporterSelect() {
      if (this.selectedTransporter) {
        this.form.delivery_order.transporter_id = this.selectedTransporter;
      }
    },
    onCustomBrokerSelect: function onCustomBrokerSelect() {
      if (this.selectedCustomBroker) {
        this.form.delivery_order.customs_broker_id = this.selectedCustomBroker;
      }
    },
    toggleAddressCopy: function toggleAddressCopy() {
      if (this.copyConsigneeAddrCheckbox && this.selectedConsignee) {
        this.form.delivery_order.delivery_address = this.consigneeDatabase[this.selectedConsignee].address;
      }
    },
    // DO Printing triggers (Gatekeeped)
    printDO: function printDO() {
      if (this.isDOBlocked) return;
      alert("Printing Delivery Order PDF. Reference: ".concat(this.form.delivery_order.delivery_order_no || 'Pending'));
    },
    printReceipt: function printReceipt() {
      if (this.isDOBlocked) return;
      alert("Printing Payment Receipt PDF. Reference: ".concat(this.form.financials.receipt_no || 'Pending'));
    },
    // Charges handlers
    addChargeItem: function addChargeItem() {
      this.form.charges.push({
        code: "",
        description: "",
        prepaid: 0.0,
        collect: 0.0
      });
    },
    removeChargeItem: function removeChargeItem(idx) {
      this.form.charges.splice(idx, 1);
    },
    // Customs CGM filing modal actions
    openCgmModal: function openCgmModal() {
      this.cgmFilingForm.consol_no = this.form.execution_job_no || "JOBA-26-DRAFT";
      this.cgmFilingForm.datetime = new Date().toISOString().substring(0, 16);
      this.dscLogs = [];
      this.isCgmValid = false;
      this.$bvModal.show("cgm-filing-modal");
    },
    closeCgmModal: function closeCgmModal() {
      this.$bvModal.hide("cgm-filing-modal");
    },
    openSignatureUtility: function openSignatureUtility() {
      alert("Initializing Logi-Sys background digital signature setup (DSC driver download package).");
    },
    submitCgmData: function submitCgmData() {
      var _this4 = this;
      this.filingProcessing = true;
      this.dscLogs = [];

      // Validation
      var errorLines = [];
      if (!this.form.execution_job_no) {
        errorLines.push("[VALIDATION ERROR] Missing Consol job execution number.");
      }
      if (!this.form.shipping_details.mawb_number) {
        errorLines.push("[VALIDATION ERROR] Master Air Waybill (MAWB) number is required.");
      } else if (!this.validateMawbFormat(this.form.shipping_details.mawb_number)) {
        errorLines.push("[VALIDATION ERROR] MAWB number is invalid.");
      }
      if (this.form.attached_house.length === 0) {
        errorLines.push("[VALIDATION ERROR] Consolidation must contain at least one linked HAWB.");
      }
      setTimeout(function () {
        _this4.filingProcessing = false;
        if (errorLines.length > 0) {
          _this4.dscLogs.push({
            type: "error",
            text: "Manifest validation checks failed:"
          });
          errorLines.forEach(function (err) {
            _this4.dscLogs.push({
              type: "error",
              text: "  ".concat(err)
            });
          });
          _this4.isCgmValid = false;
        } else {
          _this4.dscLogs.push({
            type: "info",
            text: "[VALIDATION OK] Validating manifest records for Consol: ".concat(_this4.cgmFilingForm.consol_no)
          });
          _this4.dscLogs.push({
            type: "info",
            text: "[SYSTEM] Package pieces matching confirmed: ".concat(_this4.form.packing.piece_count, " PCS")
          });
          _this4.dscLogs.push({
            type: "info",
            text: "[SYSTEM] Manifest XML formatted. Target port: ".concat(_this4.cgmFilingForm.customs_house.toUpperCase())
          });
          _this4.dscLogs.push({
            type: "success",
            text: "[SUCCESS] XML manifest structure built. Ready for Digital Signature Token encryption."
          });
          _this4.isCgmValid = true;
        }
      }, 1000);
    },
    sendForSignature: function sendForSignature() {
      var _this5 = this;
      if (!this.isCgmValid) return;
      this.filingProcessing = true;

      // Queue logs with delays
      var steps = [{
        text: "[DSC] Connecting USB Digital Signature Certificate (DSC)...",
        type: "info",
        delay: 800
      }, {
        text: "[DSC] Found Active Profile: 'JOMY GEORGE (e-Mudhra Class 3 Signer)'",
        type: "info",
        delay: 1500
      }, {
        text: "[DSC] Running PIN authorization challenge... Accepted.",
        type: "success",
        delay: 2200
      }, {
        text: "[DSC] Encrypting cargo manifest flat-file structure...",
        type: "info",
        delay: 3000
      }, {
        text: "[ICEGATE] Signed file successfully transmitted via HTTPS gateway.",
        type: "success",
        delay: 4000
      }, {
        text: "[ICEGATE] Response code: 200. IGM Reference Received: SCMTR-AIMP-9028",
        type: "success",
        delay: 4800
      }];
      steps.forEach(function (step) {
        setTimeout(function () {
          _this5.dscLogs.push({
            type: step.type,
            text: step.text
          });

          // Final step updates list
          if (step.text.includes("IGM Reference")) {
            _this5.filingProcessing = false;

            // Add filing to list
            var newFiling = {
              id: 300 + Math.floor(Math.random() * 900),
              filing_type: "CGM",
              transaction_status: "accepted",
              customs_house_code: _this5.cgmFilingForm.customs_house.toUpperCase(),
              flat_file_path: "s3://f16s-manifests/flat_cgm_signed_".concat(Math.floor(100 + Math.random() * 900), ".txt"),
              submitted_by: "Jomy George",
              submitted_at: new Date().toISOString().replace("T", " ").substring(0, 16)
            };
            _this5.form.customs_filings.push(newFiling);
            _this5.successMsg = "IGM/CGM customs filing accepted by ICEGATE for Consol: ".concat(_this5.cgmFilingForm.consol_no, ". Reference recorded.");
            setTimeout(function () {
              _this5.successMsg = null;
            }, 5000);
          }
        }, step.delay);
      });
    },
    getBadgeClassForCustoms: function getBadgeClassForCustoms(status) {
      if (status === "accepted") return "badge-light-success";
      if (status === "submitted") return "badge-light-warning";
      if (status === "rejected") return "badge-light-danger";
      return "badge-light-secondary";
    },
    getDscLogClass: function getDscLogClass(type) {
      if (type === "error") return "text-danger";
      if (type === "success") return "text-success";
      return "text-info";
    },
    getBadgeClassForCredit: function getBadgeClassForCredit(status) {
      if (status === "active") return "badge-light-success";
      if (status === "hold") return "badge-light-warning";
      if (status === "suspended") return "badge-light-danger";
      return "badge-light-secondary";
    },
    viewFilingLog: function viewFilingLog(filing) {
      alert("ICEGATE Log Output (ID ".concat(filing.id, "):\nFiling Status: ").concat(filing.transaction_status.toUpperCase(), "\nCustoms Port: ").concat(filing.customs_house_code, "\nFile: ").concat(filing.flat_file_path, "\nSubmitted: ").concat(filing.submitted_at));
    },
    // E-Docket dropzone select methods
    triggerFileInput: function triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect: function handleFileSelect(e) {
      var files = Array.from(e.target.files);
      this.uploadFiles(files);
    },
    handleFileDrop: function handleFileDrop(e) {
      var files = Array.from(e.dataTransfer.files);
      this.uploadFiles(files);
    },
    uploadFiles: function uploadFiles(files) {
      var _this6 = this;
      if (files.length === 0) return;
      this.uploadProgress = 10;
      var interval = setInterval(function () {
        _this6.uploadProgress += 15;
        if (_this6.uploadProgress >= 100) {
          clearInterval(interval);
          _this6.uploadProgress = 0;

          // Push uploaded
          files.forEach(function (f) {
            _this6.form.e_docket.push({
              file_name: f.name,
              file_size: f.size,
              document_type: "other",
              mime_type: f.type || "application/pdf"
            });
          });
          _this6.successMsg = "".concat(files.length, " document(s) uploaded to Consol E-Docket archive.");
          setTimeout(function () {
            _this6.successMsg = null;
          }, 3000);
        }
      }, 200);
    },
    deleteDocketFile: function deleteDocketFile(idx) {
      this.form.e_docket.splice(idx, 1);
    },
    formatBytes: function formatBytes(bytes) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      if (bytes === 0) return "0 Bytes";
      var k = 1024;
      var dm = decimals < 0 ? 0 : decimals;
      var sizes = ["Bytes", "KB", "MB", "GB"];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    // Global save handler
    saveConsol: function saveConsol() {
      var _this7 = this;
      this.formLoading = true;
      this.validationWarning = null;
      this.successMsg = null;

      // Validation
      var isValid = true;
      var warnMsg = [];
      if (!this.form.execution_job_no) {
        isValid = false;
        warnMsg.push("Consol execution job number is required.");
      }
      if (this.hasAddressLineOverrun(this.form.entities.origin_agent.address) || this.hasAddressLineOverrun(this.form.entities.dest_agent.address) || this.hasAddressLineOverrun(this.form.entities.selling_agent.address)) {
        warnMsg.push("One or more address fields exceed Cargo-XML line limits (35 characters).");
      }
      if (!this.validateMawbFormat(this.form.shipping_details.mawb_number)) {
        warnMsg.push("MAWB Number does not match standard IATA format.");
      }
      if (!this.validateIataCode(this.form.routing.departure_airport) || !this.validateIataCode(this.form.routing.destination_airport)) {
        warnMsg.push("Departure and Destination airport codes must be exactly 3 uppercase letters.");
      }
      setTimeout(function () {
        _this7.formLoading = false;
        if (!isValid || warnMsg.length > 0) {
          _this7.validationWarning = "Validation warnings detected: " + warnMsg.join(" ");
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          _this7.successMsg = "Consol job folder ".concat(_this7.form.execution_job_no, " saved successfully in local cache.");
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          setTimeout(function () {
            _this7.successMsg = null;
          }, 5000);
        }
      }, 1000);
    },
    // OCR Extraction: Map AI-extracted fields into the import form
    processImportExtractedData: function processImportExtractedData(response) {
      var _this8 = this;
      console.log('Import form: Processing extracted data payload:', response);

      // Helper for unstructured fields with {value, confidence} shape
      var getVal = function getVal(fieldKey) {
        var field = response[fieldKey];
        if (field && _typeof(field) === 'object' && field.value !== null && field.value !== undefined) {
          return String(field.value);
        }
        if (typeof field === 'string') return field;
        return '';
      };

      // Map shipper/consignee into entity address blocks
      var shipperParts = [getVal('shipper_name'), getVal('shipper_address'), getVal('shipper_city'), getVal('shipper_state'), getVal('shipper_post_code'), getVal('shipper_country')].filter(Boolean);
      if (shipperParts.length > 0) {
        this.form.entities.origin_agent.address = shipperParts.join('\n');
      }
      var consigneeParts = [getVal('consignee_name'), getVal('consignee_address'), getVal('consignee_city'), getVal('consignee_state'), getVal('consignee_post_code'), getVal('consignee_country')].filter(Boolean);
      if (consigneeParts.length > 0) {
        this.form.entities.dest_agent.address = consigneeParts.join('\n');
      }

      // Map packing / cargo details
      var totalPackages = getVal('total_packages');
      if (totalPackages) {
        this.form.packing.piece_count = parseInt(totalPackages) || this.form.packing.piece_count;
      }
      var grossWeight = getVal('total_gross_weight');
      if (grossWeight) {
        this.form.packing.gross_weight = parseFloat(grossWeight) || this.form.packing.gross_weight;
      }
      var totalVolume = getVal('total_volume');
      if (totalVolume) {
        this.form.packing.volume_cbm = parseFloat(totalVolume) || this.form.packing.volume_cbm;
      }
      var chargeableWeight = getVal('chargeable_weight');
      if (chargeableWeight) {
        this.form.packing.chargeable_weight = parseFloat(chargeableWeight) || this.form.packing.chargeable_weight;
      }

      // Map dimensions if available
      var dimensions = getVal('dimensions');
      if (dimensions && this.calculatorRows) {
        // Try to parse dimension string like "120x80x100 cm"
        var dimMatch = dimensions.match(/(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)/);
        if (dimMatch) {
          this.calculatorRows.push({
            pieces: parseInt(totalPackages) || 1,
            length: parseFloat(dimMatch[1]),
            width: parseFloat(dimMatch[2]),
            height: parseFloat(dimMatch[3]),
            volume_cbm: 0,
            vol_weight: 0
          });
          this.recalcVolumeRow(this.calculatorRows.length - 1);
        }
      }

      // Map financial info if available
      var invoiceNo = getVal('invoice_no');
      if (invoiceNo) {
        this.form.financials.invoice_no = invoiceNo;
      }
      var grandTotal = getVal('grand_total');
      if (grandTotal) {
        this.form.financials.invoice_amount = parseFloat(grandTotal) || this.form.financials.invoice_amount;
      }
      this.successMsg = 'Document data extracted successfully. Please verify all fields.';
      setTimeout(function () {
        _this8.successMsg = null;
      }, 5000);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "HomeServicesGrid"
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("b-modal", {
    attrs: {
      id: _vm.id,
      title: _vm.title,
      "hide-footer": true,
      centered: "",
      size: "lg",
      "modal-class": "premium-modal",
      "title-class": "font-weight-bolder text-dark",
      "header-class": "border-bottom-0 pb-0 px-5 pt-5"
    }
  }, [_c("div", {
    staticClass: "history-list p-3 p-sm-5"
  }, [_vm.isFetching ? _c("div", {
    staticClass: "text-center py-20 d-flex flex-column align-items-center"
  }, [_c("b-spinner", {
    staticStyle: {
      width: "3rem",
      height: "3rem",
      color: "#355594"
    },
    attrs: {
      label: "Loading..."
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "mt-4 font-weight-bold",
    staticStyle: {
      color: "#355594",
      "font-size": "1.1rem"
    }
  }, [_vm._v("Loading your data...")])], 1) : [!_vm.items || _vm.items.length === 0 ? _c("div", {
    staticClass: "text-center py-12"
  }, [_c("div", {
    staticClass: "empty-icon-wrap mb-4 mx-auto"
  }, [_c("b-icon", {
    attrs: {
      icon: _vm.mode === "draft" ? "inbox" : "chat-dots",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h5", {
    staticClass: "font-weight-bold text-dark mb-2"
  }, [_vm._v("No records found")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted"
  }, [_vm._v("You don't have any " + _vm._s(_vm.mode === "draft" ? "drafts" : "messages") + " right now.")])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.items, function (item) {
    return _c("div", {
      key: item.id,
      staticClass: "history-card mb-4",
      "class": _vm.mode === "draft" ? "draft-card" : "send-card"
    }, [_c("div", {
      staticClass: "d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between"
    }, [_c("div", {
      staticClass: "d-flex align-items-center",
      style: _vm.docType === "consolidation" ? "cursor: pointer;" : "",
      on: {
        click: function click($event) {
          return _vm.handleMainClick(item);
        }
      }
    }, [_c("div", {
      staticClass: "icon-wrapper mr-4 shadow-sm"
    }, [_c("b-icon", {
      attrs: {
        icon: _vm.mode === "draft" ? "file-earmark-text" : "clock-history",
        "font-scale": "1.3"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticClass: "info-content"
    }, [_c("h6", {
      staticClass: "mb-1 font-weight-bold awb-title"
    }, [_vm.docType === "house" ? [_vm._v(_vm._s(item.id))] : [_vm._v(_vm._s(item.awb_code) + "-" + _vm._s(item.awb_no))]], 2), _vm._v(" "), _c("div", {
      staticClass: "route-badge mt-2 d-inline-flex align-items-center px-3 py-1 rounded-pill shadow-sm"
    }, [_c("b-icon", {
      staticClass: "mr-2 route-icon",
      attrs: {
        icon: "geo-alt-fill"
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.getAirport(item.departure_airport)))]), _vm._v(" "), _c("b-icon", {
      staticClass: "mx-1",
      attrs: {
        icon: "arrow-right-short"
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "font-weight-bold"
    }, [_vm._v(_vm._s(_vm.getAirport(item.destination_airport)))])], 1)])]), _vm._v(" "), _vm._t("actions", function () {
      return [_c("div", {
        staticClass: "d-flex mt-3 mt-sm-0 justify-content-end action-container"
      }, [_c("button", {
        staticClass: "premium-btn px-4 py-2 shadow-sm",
        on: {
          click: function click($event) {
            return _vm.$emit("action", item);
          }
        }
      }, [_vm._v("\n                                " + _vm._s(_vm.mode === "draft" ? "Edit Draft" : "View Details") + "\n                                "), _c("b-icon", {
        staticClass: "ml-2 icon-hover-slide",
        attrs: {
          icon: "arrow-right"
        }
      })], 1)])];
    }, {
      item: item
    })], 2), _vm._v(" "), _vm.mode !== "draft" ? _c("div", {
      staticClass: "download-strip mt-4 pt-3 d-flex flex-wrap align-items-center border-top-light"
    }, [_c("span", {
      staticClass: "text-muted small font-weight-bold mr-3 text-uppercase tracking-wide"
    }, [_vm._v("Generate:")]), _vm._v(" "), _vm.docType === "consolidation" ? [_c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-consolidation-pdf/".concat(String(item.awb_code), "/").concat(String(item.awb_no)),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "file-earmark-pdf"
      }
    }), _vm._v(" Consolidation PDF\n                        ")], 1), _vm._v(" "), _c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-multiple-consolidation-pdf/".concat(String(item.awb_code), "/").concat(String(item.awb_no)),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "files"
      }
    }), _vm._v(" Multipage PDF\n                        ")], 1)] : _vm.docType === "house" ? [_c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-hawb-pdf/".concat(item.id),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "file-earmark-pdf"
      }
    }), _vm._v(" PDF\n                        ")], 1), _vm._v(" "), _c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-multiple-hawb-pdf/".concat(item.id),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "files"
      }
    }), _vm._v(" Multi-PDF\n                        ")], 1), _vm._v(" "), _c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-multiple-both-page-hawb-pdf/".concat(item.id),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "book"
      }
    }), _vm._v(" Multi-PDF (Back)\n                        ")], 1)] : [_c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-awb-pdf/".concat(item.id),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "file-earmark-pdf"
      }
    }), _vm._v(" PDF\n                        ")], 1), _vm._v(" "), _c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-multiple-awb-pdf/".concat(item.id),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "files"
      }
    }), _vm._v(" Multi-PDF\n                        ")], 1), _vm._v(" "), _c("a", {
      staticClass: "download-link",
      attrs: {
        href: "/download-multiple-both-page-awb-pdf/".concat(item.id),
        target: "_blank"
      }
    }, [_c("b-icon", {
      staticClass: "mr-2",
      attrs: {
        icon: "book"
      }
    }), _vm._v(" Multi-PDF (Back)\n                        ")], 1)]], 2) : _vm._e()]);
  })]], 2)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", [!_vm.isDrawer ? _c("b-button", {
    directives: [{
      name: "b-modal",
      rawName: "v-b-modal.upload-file-modal",
      modifiers: {
        "upload-file-modal": true
      }
    }],
    staticClass: "show-btn ultra-trigger-btn"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "cloud-arrow-up"
    }
  }), _vm._v(" Upload\n    ")], 1) : _c("b-button", {
    staticClass: "show-btn ultra-trigger-btn",
    on: {
      click: _vm.openInline
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "cloud-arrow-up"
    }
  }), _vm._v(" Upload\n    ")], 1), _vm._v(" "), !_vm.isDrawer ? _c("b-modal", {
    attrs: {
      id: "upload-file-modal",
      "hide-footer": "",
      "hide-header": "",
      centered: "",
      size: "xl",
      "modal-class": "ultra-premium-modal"
    },
    on: {
      hidden: _vm.resetModal
    }
  }, [_c("div", {
    staticClass: "modal-split-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: function click($event) {
        return _vm.$bvModal.hide("upload-file-modal");
      }
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-left-pane login-pane"
  }, [_c("div", {
    staticClass: "pane-content"
  }, [_c("div", {
    staticClass: "pane-icon-wrapper mb-8"
  }, [_c("b-icon", {
    attrs: {
      icon: "cloud-upload",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("h2", {
    staticClass: "pane-title"
  }, [_vm._v("Upload Document" + _vm._s(_vm.isMultiMode ? "s" : ""))]), _vm._v(" "), _c("p", {
    staticClass: "pane-subtitle"
  }, [_vm._v("Please manually verify each input field extracted by the upload feature. F16s E-freight Solutions is not legally liable for incorrect data sent to the airline. The automated extraction process may contain errors.")]), _vm._v(" "), _c("div", {
    staticClass: "pane-footer mt-auto"
  }, [_c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "mr-3",
    attrs: {
      icon: "check-circle"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Automated Extraction")])], 1), _vm._v(" "), _c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "mr-3",
    attrs: {
      icon: "shield-check"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Secure Processing")])], 1), _vm._v(" "), _vm.isMultiMode ? _c("div", {
    staticClass: "pane-feature"
  }, [_c("b-icon", {
    staticClass: "mr-3",
    attrs: {
      icon: "files"
    }
  }), _vm._v(" "), _c("span", [_vm._v("Multi-Document Merge")])], 1) : _vm._e()])]), _vm._v(" "), _c("div", {
    staticClass: "pane-decoration"
  }), _vm._v(" "), _c("div", {
    staticClass: "pane-decoration-2"
  })]), _vm._v(" "), _c("div", {
    staticClass: "modal-right-pane"
  }, [_c("div", {
    staticClass: "form-scroll-container"
  }, [_c("div", {
    staticClass: "ultra-form"
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v(_vm._s(_vm.isMultiMode ? "Upload & Assign Documents" : "Select File"))]), _vm._v(" "), !_vm.isMultiMode ? _c("div", {
    staticClass: "mb-8 text-left"
  }, [_c("label", {
    staticClass: "font-weight-bold mb-3",
    staticStyle: {
      color: "#5A6B8A"
    }
  }, [_vm._v("Document Type")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control form-control-solid h-auto py-4 px-6 rounded-xl font-size-h6 border-1",
    staticStyle: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0"
    },
    model: {
      value: _vm.selectedUploadType,
      callback: function callback($$v) {
        _vm.selectedUploadType = $$v;
      },
      expression: "selectedUploadType"
    }
  }, _vm._l(_vm.allowedTemplates, function (tpl) {
    return _c("option", {
      key: tpl.key,
      domProps: {
        value: tpl.key
      }
    }, [_vm._v(_vm._s(tpl.label || tpl.key))]);
  }), 0)], 1) : _vm._e(), _vm._v(" "), _vm.isMultiMode ? _c("div", {
    staticClass: "mb-6"
  }, [_c("div", {
    staticClass: "upload-dropzone-multi mb-4",
    "class": {
      "drag-active": _vm.dragActive
    },
    style: {
      cursor: _vm.isUploading ? "default" : "pointer"
    },
    on: {
      click: function click($event) {
        !_vm.isUploading && _vm.triggerFileInput();
      },
      dragover: function dragover($event) {
        $event.preventDefault();
        _vm.dragActive = true;
      },
      dragleave: function dragleave($event) {
        $event.preventDefault();
        _vm.dragActive = false;
      },
      drop: function drop($event) {
        $event.preventDefault();
        return _vm.handleDrop.apply(null, arguments);
      }
    }
  }, [!_vm.isUploading ? _c("div", {
    staticClass: "text-center"
  }, [_c("div", {
    staticClass: "mb-3"
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594",
      opacity: "0.6"
    },
    attrs: {
      icon: "file-earmark-plus",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "mb-1 font-weight-bolder font-size-h6",
    staticStyle: {
      color: "#1e3a6e"
    }
  }, [_vm._v("\n                                        " + _vm._s(_vm.selectedFiles.length === 0 ? "Click or drag PDFs here" : "Add more PDFs") + "\n                                    ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted font-size-sm mb-0"
  }, [_vm._v("Up to 5 files • Max 10MB each")])]) : _c("div", {
    staticClass: "text-center d-flex flex-column align-items-center justify-content-center py-4"
  }, [_c("div", {
    staticClass: "clean-loader-wrapper mb-4"
  }, [_c("div", {
    staticClass: "dual-ring-spinner"
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "loader-center-icon",
    attrs: {
      icon: "file-earmark-arrow-up",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("h5", {
    staticClass: "text-primary font-weight-bolder mb-2",
    staticStyle: {
      "letter-spacing": "-0.5px"
    }
  }, [_vm._v("\n                                        " + _vm._s(_vm.ocrStatusMessage || "Processing...") + "\n                                    ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0"
  }, [_vm._v("AI-powered multi-document extraction. Please wait.")])])]), _vm._v(" "), _c("input", {
    ref: "fileInput",
    staticStyle: {
      display: "none"
    },
    attrs: {
      type: "file",
      accept: ".pdf",
      multiple: ""
    },
    on: {
      change: _vm.handleMultiFileSelect
    }
  }), _vm._v(" "), _vm.selectedFiles.length > 0 && !_vm.isUploading ? _c("div", {
    staticClass: "file-list-container"
  }, _vm._l(_vm.selectedFiles, function (fileEntry, idx) {
    return _c("div", {
      key: idx,
      staticClass: "file-chip d-flex align-items-center justify-content-between mb-3 p-3 rounded-lg"
    }, [_c("div", {
      staticClass: "d-flex align-items-center flex-grow-1 mr-3",
      staticStyle: {
        "min-width": "0"
      }
    }, [_c("div", {
      staticClass: "file-chip-icon mr-3"
    }, [_c("b-icon", {
      staticClass: "text-danger",
      attrs: {
        icon: "file-earmark-pdf-fill",
        "font-scale": "1.3"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticStyle: {
        "min-width": "0",
        flex: "1"
      }
    }, [_c("p", {
      staticClass: "file-chip-name mb-1 text-truncate font-weight-bold",
      staticStyle: {
        color: "#1e293b",
        "font-size": "0.9rem"
      }
    }, [_vm._v("\n                                                " + _vm._s(fileEntry.file.name) + "\n                                            ")]), _vm._v(" "), _c("span", {
      staticClass: "text-muted",
      staticStyle: {
        "font-size": "0.75rem"
      }
    }, [_vm._v("\n                                                " + _vm._s((fileEntry.file.size / 1024).toFixed(0)) + " KB\n                                            ")])])]), _vm._v(" "), _c("div", {
      staticClass: "d-flex align-items-center",
      staticStyle: {
        gap: "8px"
      }
    }, [_c("b-form-select", {
      staticClass: "role-select",
      staticStyle: {
        width: "180px"
      },
      attrs: {
        size: "sm"
      },
      model: {
        value: fileEntry.role,
        callback: function callback($$v) {
          _vm.$set(fileEntry, "role", $$v);
        },
        expression: "fileEntry.role"
      }
    }, [_c("option", {
      attrs: {
        value: "full"
      }
    }, [_vm._v("Full Document")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "shipper_consignee"
      }
    }, [_vm._v("Shipper & Consignee")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "pieces_dimensions"
      }
    }, [_vm._v("Pieces & Dimensions")])]), _vm._v(" "), _c("b-button", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "remove-file-btn p-1",
      attrs: {
        variant: "light",
        size: "sm",
        title: "Remove"
      },
      on: {
        click: function click($event) {
          return _vm.removeFile(idx);
        }
      }
    }, [_c("b-icon", {
      staticClass: "text-danger",
      attrs: {
        icon: "x",
        "font-scale": "1.1"
      }
    })], 1)], 1)]);
  }), 0) : _vm._e()]) : _vm._e(), _vm._v(" "), !_vm.isMultiMode ? _c("div", {
    staticClass: "upload-dropzone mb-10",
    style: {
      border: _vm.isUploading ? "2px solid #355594" : "2px dashed #355594",
      borderRadius: "20px",
      padding: "60px 20px",
      cursor: _vm.isUploading ? "default" : "pointer",
      background: _vm.isUploading ? "rgba(53, 85, 148, 0.05)" : "rgba(53, 85, 148, 0.02)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease"
    },
    on: {
      click: function click($event) {
        !_vm.isUploading && _vm.triggerFileInput();
      }
    }
  }, [!_vm.isUploading ? _c("div", {
    staticClass: "text-center"
  }, [_c("div", {
    staticClass: "mb-4"
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594",
      opacity: "0.6"
    },
    attrs: {
      icon: "file-earmark-pdf",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "mb-0 font-weight-bolder font-size-h5",
    staticStyle: {
      color: "#1e3a6e"
    }
  }, [_vm._v("Click to select PDF")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted font-size-sm mt-2"
  }, [_vm._v("Maximum file size: 10MB")])]) : _c("div", {
    staticClass: "text-center d-flex flex-column align-items-center justify-content-center py-4"
  }, [_c("div", {
    staticClass: "clean-loader-wrapper mb-6"
  }, [_c("div", {
    staticClass: "dual-ring-spinner"
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "loader-center-icon",
    attrs: {
      icon: "file-earmark-arrow-up",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "status-info-text"
  }, [_c("h4", {
    staticClass: "text-primary font-weight-bolder mb-2",
    staticStyle: {
      "letter-spacing": "-0.5px",
      "text-shadow": "none"
    }
  }, [_vm._v("\n                                        " + _vm._s(_vm.ocrStatusMessage || "Processing...") + "\n                                    ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0",
    staticStyle: {
      "text-shadow": "none"
    }
  }, [_vm._v("AI-powered data extraction active. Please wait.")])])]), _vm._v(" "), _c("input", {
    ref: "fileInput",
    staticStyle: {
      display: "none"
    },
    attrs: {
      type: "file",
      accept: ".pdf"
    },
    on: {
      change: _vm.handleFileSelect
    }
  })]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-6 d-flex flex-column align-items-center w-100"
  }, [!_vm.isMultiMode && _vm.selectedFile && !_vm.isUploading ? _c("div", {
    staticClass: "mb-4 text-primary font-weight-bold"
  }, [_vm._v("\n                                Selected: " + _vm._s(_vm.selectedFile.name) + "\n                            ")]) : _vm._e(), _vm._v(" "), _vm.isMultiMode && _vm.selectedFiles.length > 0 && !_vm.isUploading ? _c("div", {
    staticClass: "mb-4 d-flex align-items-center",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-badge", {
    staticClass: "px-3 py-2",
    staticStyle: {
      "font-size": "0.85rem"
    },
    attrs: {
      variant: "primary",
      pill: ""
    }
  }, [_vm._v("\n                                    " + _vm._s(_vm.selectedFiles.length) + " document" + _vm._s(_vm.selectedFiles.length > 1 ? "s" : "") + " ready\n                                ")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("\n                                    Roles assigned — click Extract to process\n                                ")])], 1) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "ultra-submit-btn",
    on: {
      click: _vm.submitUpload
    }
  }, [!_vm.isUploading ? _c("span", [_vm._v(_vm._s(_vm.isMultiMode && _vm.selectedFiles.length > 1 ? "Extract All" : "Extract"))]) : _c("span", [_vm._v("Processing...")]), _vm._v(" "), !_vm.isUploading ? _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  }) : _c("b-spinner", {
    staticClass: "ml-2",
    attrs: {
      small: "",
      variant: "light"
    }
  })], 1)])])])])])]) : _c("transition", {
    attrs: {
      name: "slide-in-right"
    }
  }, [_vm.showInline ? _c("div", {
    staticClass: "inline-upload-panel"
  }, [_c("div", {
    staticClass: "modal-split-layout inline-layout"
  }, [_c("button", {
    staticClass: "ultra-close-btn",
    on: {
      click: _vm.closeInline
    }
  }, [_c("b-icon", {
    attrs: {
      icon: "x"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "modal-right-pane inline-right-pane"
  }, [_c("div", {
    staticClass: "form-scroll-container"
  }, [_c("div", {
    staticClass: "ultra-form"
  }, [_c("h3", {
    staticClass: "form-section-title mb-6"
  }, [_vm._v(_vm._s(_vm.isMultiMode ? "Upload & Assign Documents" : "Select File"))]), _vm._v(" "), !_vm.isMultiMode ? _c("div", {
    staticClass: "mb-8 text-left"
  }, [_c("label", {
    staticClass: "font-weight-bold mb-3",
    staticStyle: {
      color: "#5A6B8A"
    }
  }, [_vm._v("Document Type")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control form-control-solid h-auto py-4 px-6 rounded-xl font-size-h6 border-1",
    staticStyle: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0"
    },
    model: {
      value: _vm.selectedUploadType,
      callback: function callback($$v) {
        _vm.selectedUploadType = $$v;
      },
      expression: "selectedUploadType"
    }
  }, _vm._l(_vm.allowedTemplates, function (tpl) {
    return _c("option", {
      key: tpl.key,
      domProps: {
        value: tpl.key
      }
    }, [_vm._v(_vm._s(tpl.label || tpl.key))]);
  }), 0)], 1) : _vm._e(), _vm._v(" "), _vm.isMultiMode ? _c("div", {
    staticClass: "mb-6"
  }, [_c("div", {
    staticClass: "upload-dropzone-multi mb-4",
    "class": {
      "drag-active": _vm.dragActive
    },
    style: {
      cursor: _vm.isUploading ? "default" : "pointer"
    },
    on: {
      click: function click($event) {
        !_vm.isUploading && _vm.triggerFileInput();
      },
      dragover: function dragover($event) {
        $event.preventDefault();
        _vm.dragActive = true;
      },
      dragleave: function dragleave($event) {
        $event.preventDefault();
        _vm.dragActive = false;
      },
      drop: function drop($event) {
        $event.preventDefault();
        return _vm.handleDrop.apply(null, arguments);
      }
    }
  }, [!_vm.isUploading ? _c("div", {
    staticClass: "text-center"
  }, [_c("div", {
    staticClass: "mb-3"
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594",
      opacity: "0.6"
    },
    attrs: {
      icon: "file-earmark-plus",
      "font-scale": "2.5"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "mb-1 font-weight-bolder font-size-h6",
    staticStyle: {
      color: "#1e3a6e"
    }
  }, [_vm._v("\n                                            " + _vm._s(_vm.selectedFiles.length === 0 ? "Click or drag PDFs here" : "Add more PDFs") + "\n                                        ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted font-size-sm mb-0"
  }, [_vm._v("Up to 5 files • Max 10MB each")])]) : _c("div", {
    staticClass: "text-center d-flex flex-column align-items-center justify-content-center py-4"
  }, [_c("div", {
    staticClass: "clean-loader-wrapper mb-4"
  }, [_c("div", {
    staticClass: "dual-ring-spinner"
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "loader-center-icon",
    attrs: {
      icon: "file-earmark-arrow-up",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("h5", {
    staticClass: "text-primary font-weight-bolder mb-2",
    staticStyle: {
      "letter-spacing": "-0.5px"
    }
  }, [_vm._v("\n                                            " + _vm._s(_vm.ocrStatusMessage || "Processing...") + "\n                                        ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0"
  }, [_vm._v("AI-powered multi-document extraction. Please wait.")])])]), _vm._v(" "), _c("input", {
    ref: "fileInputInline",
    staticStyle: {
      display: "none"
    },
    attrs: {
      type: "file",
      accept: ".pdf",
      multiple: ""
    },
    on: {
      change: _vm.handleMultiFileSelect
    }
  }), _vm._v(" "), _vm.selectedFiles.length > 0 && !_vm.isUploading ? _c("div", {
    staticClass: "file-list-container"
  }, _vm._l(_vm.selectedFiles, function (fileEntry, idx) {
    return _c("div", {
      key: idx,
      staticClass: "file-chip d-flex align-items-center justify-content-between mb-3 p-3 rounded-lg"
    }, [_c("div", {
      staticClass: "d-flex align-items-center flex-grow-1 mr-3",
      staticStyle: {
        "min-width": "0"
      }
    }, [_c("div", {
      staticClass: "file-chip-icon mr-3"
    }, [_c("b-icon", {
      staticClass: "text-danger",
      attrs: {
        icon: "file-earmark-pdf-fill",
        "font-scale": "1.3"
      }
    })], 1), _vm._v(" "), _c("div", {
      staticStyle: {
        "min-width": "0",
        flex: "1"
      }
    }, [_c("p", {
      staticClass: "file-chip-name mb-1 text-truncate font-weight-bold",
      staticStyle: {
        color: "#1e293b",
        "font-size": "0.9rem"
      }
    }, [_vm._v("\n                                                    " + _vm._s(fileEntry.file.name) + "\n                                                ")]), _vm._v(" "), _c("span", {
      staticClass: "text-muted",
      staticStyle: {
        "font-size": "0.75rem"
      }
    }, [_vm._v("\n                                                    " + _vm._s((fileEntry.file.size / 1024).toFixed(0)) + " KB\n                                                ")])])]), _vm._v(" "), _c("div", {
      staticClass: "d-flex align-items-center",
      staticStyle: {
        gap: "8px"
      }
    }, [_c("b-form-select", {
      staticClass: "role-select",
      staticStyle: {
        width: "180px"
      },
      attrs: {
        size: "sm"
      },
      model: {
        value: fileEntry.role,
        callback: function callback($$v) {
          _vm.$set(fileEntry, "role", $$v);
        },
        expression: "fileEntry.role"
      }
    }, [_c("option", {
      attrs: {
        value: "full"
      }
    }, [_vm._v("Full Document")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "shipper_consignee"
      }
    }, [_vm._v("Shipper & Consignee")]), _vm._v(" "), _c("option", {
      attrs: {
        value: "pieces_dimensions"
      }
    }, [_vm._v("Pieces & Dimensions")])]), _vm._v(" "), _c("b-button", {
      directives: [{
        name: "b-tooltip",
        rawName: "v-b-tooltip.hover",
        modifiers: {
          hover: true
        }
      }],
      staticClass: "remove-file-btn p-1",
      attrs: {
        variant: "light",
        size: "sm",
        title: "Remove"
      },
      on: {
        click: function click($event) {
          return _vm.removeFile(idx);
        }
      }
    }, [_c("b-icon", {
      staticClass: "text-danger",
      attrs: {
        icon: "x",
        "font-scale": "1.1"
      }
    })], 1)], 1)]);
  }), 0) : _vm._e()]) : _vm._e(), _vm._v(" "), !_vm.isMultiMode ? _c("div", {
    staticClass: "upload-dropzone mb-10",
    style: {
      border: _vm.isUploading ? "2px solid #355594" : "2px dashed #355594",
      borderRadius: "20px",
      padding: "60px 20px",
      cursor: _vm.isUploading ? "default" : "pointer",
      background: _vm.isUploading ? "rgba(53, 85, 148, 0.05)" : "rgba(53, 85, 148, 0.02)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease"
    },
    on: {
      click: function click($event) {
        !_vm.isUploading && _vm.triggerFileInput();
      }
    }
  }, [!_vm.isUploading ? _c("div", {
    staticClass: "text-center"
  }, [_c("div", {
    staticClass: "mb-4"
  }, [_c("b-icon", {
    staticStyle: {
      color: "#355594",
      opacity: "0.6"
    },
    attrs: {
      icon: "file-earmark-pdf",
      "font-scale": "3"
    }
  })], 1), _vm._v(" "), _c("p", {
    staticClass: "mb-0 font-weight-bolder font-size-h5",
    staticStyle: {
      color: "#1e3a6e"
    }
  }, [_vm._v("Click to select PDF")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted font-size-sm mt-2"
  }, [_vm._v("Maximum file size: 10MB")])]) : _c("div", {
    staticClass: "text-center d-flex flex-column align-items-center justify-content-center py-4"
  }, [_c("div", {
    staticClass: "clean-loader-wrapper mb-6"
  }, [_c("div", {
    staticClass: "dual-ring-spinner"
  }), _vm._v(" "), _c("b-icon", {
    staticClass: "loader-center-icon",
    attrs: {
      icon: "file-earmark-arrow-up",
      "font-scale": "2"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "status-info-text"
  }, [_c("h4", {
    staticClass: "text-primary font-weight-bolder mb-2",
    staticStyle: {
      "letter-spacing": "-0.5px",
      "text-shadow": "none"
    }
  }, [_vm._v("\n                                            " + _vm._s(_vm.ocrStatusMessage || "Processing...") + "\n                                        ")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0",
    staticStyle: {
      "text-shadow": "none"
    }
  }, [_vm._v("AI-powered data extraction active. Please wait.")])])]), _vm._v(" "), _c("input", {
    ref: "fileInputInline",
    staticStyle: {
      display: "none"
    },
    attrs: {
      type: "file",
      accept: ".pdf"
    },
    on: {
      change: _vm.handleFileSelect
    }
  })]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "form-actions mt-6 d-flex flex-column align-items-center w-100"
  }, [!_vm.isMultiMode && _vm.selectedFile && !_vm.isUploading ? _c("div", {
    staticClass: "mb-4 text-primary font-weight-bold"
  }, [_vm._v("\n                                    Selected: " + _vm._s(_vm.selectedFile.name) + "\n                                ")]) : _vm._e(), _vm._v(" "), _vm.isMultiMode && _vm.selectedFiles.length > 0 && !_vm.isUploading ? _c("div", {
    staticClass: "mb-4 d-flex align-items-center",
    staticStyle: {
      gap: "8px"
    }
  }, [_c("b-badge", {
    staticClass: "px-3 py-2",
    staticStyle: {
      "font-size": "0.85rem"
    },
    attrs: {
      variant: "primary",
      pill: ""
    }
  }, [_vm._v("\n                                        " + _vm._s(_vm.selectedFiles.length) + " document" + _vm._s(_vm.selectedFiles.length > 1 ? "s" : "") + " ready\n                                    ")]), _vm._v(" "), _c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("\n                                        Roles assigned — click Extract to process\n                                    ")])], 1) : _vm._e(), _vm._v(" "), _c("button", {
    staticClass: "ultra-submit-btn",
    on: {
      click: _vm.submitUpload
    }
  }, [!_vm.isUploading ? _c("span", [_vm._v(_vm._s(_vm.isMultiMode && _vm.selectedFiles.length > 1 ? "Extract All" : "Extract"))]) : _c("span", [_vm._v("Processing...")]), _vm._v(" "), !_vm.isUploading ? _c("b-icon", {
    staticClass: "btn-icon",
    attrs: {
      icon: "arrow-right"
    }
  }) : _c("b-spinner", {
    staticClass: "ml-2",
    attrs: {
      small: "",
      variant: "light"
    }
  })], 1)])])])])])]) : _vm._e()])], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("div", {
    staticClass: "skeleton-table"
  }, [_c("div", {
    staticClass: "skeleton-header"
  }, _vm._l(_vm.columns, function (n) {
    return _c("div", {
      key: "h" + n,
      staticClass: "skeleton-bar header-bar"
    });
  }), 0), _vm._v(" "), _c("div", {
    staticClass: "skeleton-body"
  }, _vm._l(_vm.rows, function (row) {
    return _c("div", {
      key: "r" + row,
      staticClass: "skeleton-row"
    }, _vm._l(_vm.columns, function (col) {
      return _c("div", {
        key: "c" + col,
        staticClass: "skeleton-bar body-bar"
      });
    }), 0);
  }), 0)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=template&id=5801612d&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=template&id=5801612d&scoped=true ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c("nav", {
    staticClass: "sidebar-container"
  }, [_c("div", {
    staticClass: "sidebar d-none d-lg-block",
    "class": {
      "sidebar-mini": _vm.collapsed
    }
  }, [_c("ul", {
    staticClass: "sidebar__list"
  }, [_vm._l(_vm.menuItems, function (item) {
    return _c("router-link", {
      key: item.label,
      attrs: {
        to: item.path,
        custom: ""
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(_ref) {
          var navigate = _ref.navigate;
          return [_c("li", {
            staticClass: "sidebar__item",
            "class": {
              "sidebar__item--active": _vm.isActive(item.activePaths)
            },
            attrs: {
              role: "link",
              title: item.label
            },
            on: {
              click: navigate
            }
          }, [_c("div", {
            staticClass: "sidebar__icon-wrap"
          }, [_c("b-icon", {
            staticClass: "nav-icon",
            style: {
              color: _vm.isActive(item.activePaths) ? "#355594" : "#64748B"
            },
            attrs: {
              icon: item.icon,
              "font-scale": "1.8"
            }
          })], 1)])];
        }
      }], null, true)
    });
  }), _vm._v(" "), !_vm.collapsed ? _c("li", {
    staticClass: "sidebar__branding"
  }, [_c("span", {
    staticClass: "sidebar__branding-text"
  }, [_vm._v("FOCUS AIR")])]) : _vm._e()], 2)]), _vm._v(" "), _c("div", {
    directives: [{
      name: "click-outside",
      rawName: "v-click-outside",
      value: _vm.closeMobileMenu,
      expression: "closeMobileMenu"
    }],
    staticClass: "sidebar-mobile d-lg-none"
  }, [_c("div", {
    staticClass: "mobile-nav-trigger",
    on: {
      click: _vm.toggleMobileMenu
    }
  }, [_c("b-icon", {
    staticClass: "mobile-active-icon text-primary font-scale-1.3",
    attrs: {
      icon: _vm.activeItem.icon
    }
  }), _vm._v(" "), _c("span", {
    staticClass: "mobile-active-label"
  }, [_vm._v(_vm._s(_vm.activeItem.label))]), _vm._v(" "), _c("b-icon", {
    staticClass: "ml-auto chevron-icon",
    "class": {
      rotated: _vm.isMobileMenuOpen
    },
    attrs: {
      icon: "chevron-down"
    }
  })], 1), _vm._v(" "), _c("transition", {
    attrs: {
      name: "fade-slide"
    }
  }, [_vm.isMobileMenuOpen ? _c("div", {
    staticClass: "mobile-nav-options"
  }, _vm._l(_vm.menuItems, function (item) {
    return _c("div", {
      key: item.label,
      staticClass: "mobile-opt",
      "class": {
        active: _vm.isActive(item.activePaths)
      },
      on: {
        click: function click($event) {
          return _vm.navigateMobile(item.path);
        }
      }
    }, [_c("b-icon", {
      staticClass: "opt-icon mr-3",
      style: {
        color: _vm.isActive(item.activePaths) ? "#355594" : "#64748B"
      },
      attrs: {
        icon: item.icon
      }
    }), _vm._v(" "), _c("span", {
      staticClass: "opt-label"
    }, [_vm._v(_vm._s(item.label))])], 1);
  }), 0) : _vm._e()])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render=function render(){var _vm=this,_c=_vm._self._c;return _c("b-container",{staticClass:"body-color",attrs:{fluid:""}},[_c("div",{staticClass:"d-flex flex-column flex-lg-row"},[_c("SideBar"),_vm._v(" "),_c("div",{staticStyle:{background:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.4)","box-shadow":"0 10px 30px rgba(53, 85, 148, 0.1)","z-index":"1","border-radius":"32px",flex:"1","min-width":"0"}},[_c("div",{staticClass:"container py-8 px-6 px-sm-8 px-md-10"},[[_c("b-row",{staticClass:"align-items-center mb-8"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex flex-column"},[_c("span",{staticStyle:{"text-transform":"uppercase","letter-spacing":"2px","font-size":"0.85rem","font-weight":"700",color:"#355594",opacity:"0.6","margin-bottom":"0.5rem",display:"block"}},[_vm._v("Air Export")]),_vm._v(" "),_c("h6",{staticStyle:{color:"#355594","font-size":"26px !important","line-height":"34px !important","font-weight":"800 !important","letter-spacing":"-0.5px !important","margin-bottom":"1rem","font-family":"'Inter', sans-serif !important"}},[_vm._v("Documentation")]),_vm._v(" "),_c("b-form-group",{staticClass:"mb-0 nav-dropdown-group",attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{background:"#F0F7FF","border-radius":"12px",padding:"6px 16px",width:"fit-content",border:"1px solid #E6F0FF"}},[_c("b-icon",{staticStyle:{color:"#355594","font-size":"1.2rem","margin-right":"12px"},attrs:{icon:"folder2-open"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"180px",border:"0px !important",color:"#355594","font-weight":"600",background:"transparent",cursor:"pointer",outline:"none","box-shadow":"none","padding-left":"0"},on:{change:_vm.onSelect},model:{value:_vm.selectedViewPageOption,callback:function callback($$v){_vm.selectedViewPageOption=$$v;},expression:"selectedViewPageOption"}},[_c("option",{attrs:{value:"/focus-air"}},[_vm._v("Master Airway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/house-way-bill"}},[_vm._v("Houseway Bill")]),_vm._v(" "),_c("option",{attrs:{value:"/consolidation"}},[_vm._v("Consolidation")])])],1)])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-md-end flex-wrap",staticStyle:{gap:"12px","align-items":"center"}},[_c("b-button",{staticClass:"show-btn",on:{click:function click($event){return _vm.getAirwayBills("draft");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"file-earmark-text"}}),_c("b",{staticClass:"font-weight-bolder",staticStyle:{"font-size":"1.05rem"}},[_vm._v("Drafts")])],1),_vm._v(" "),_c("b-button",{staticClass:"show-btn",on:{click:function click($event){return _vm.getAirwayBills("send");}}},[_c("b-icon",{staticClass:"mr-2",attrs:{icon:"clock-history"}}),_c("b",{staticClass:"font-weight-bolder",staticStyle:{"font-size":"1.05rem"}},[_vm._v("10 Latest")])],1),_vm._v(" "),_c("OcrUploadModal",{attrs:{"is-drawer":_vm.isDrawer,category:"focus_air"},on:{extracted:_vm.processExtractedData}})],1)]),_vm._v(" "),_c("DashboardHistoryModal",{attrs:{id:"modal-draft",title:"My Drafts",mode:"draft",docType:"master",items:_vm.data_items,isFetching:_vm.isFetching},on:{action:function action(item){return _vm.handleEditNavigation(item.id);}}}),_vm._v(" "),_c("DashboardHistoryModal",{attrs:{id:"modal-s",title:"Latest Messages",mode:"send",docType:"master",items:_vm.data_items,isFetching:_vm.isFetching},on:{action:function action(item){return _vm.handleEditNavigation(item.id);}}})],1)]],2),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),[_c("b-form",{on:{submit:function submit($event){$event.preventDefault();return _vm.onSubmit.apply(null,arguments);}}},[_c("div",{staticClass:"container py-8 px-6 px-sm-8 px-md-10"},[_c("div",{staticClass:"mx-2 mx-sm-8"},[_c("b-row",{staticClass:"mt-0 mb-4 mt-md-0 mb-md-10"},[_c("b-col",{attrs:{cols:"12",md:"6",lg:"5"}},[_c("div",[_c("div",{staticClass:"d-flex flex-wrap align-items-center"},[_c("b-form-group",{staticClass:"align-items-center mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("span",[_vm._v("AWB No:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"awb-flex-row"},[_c("b-form-input",{staticClass:"awb-code-input","class":{"is-invalid":_vm.form.errors.has("awb_code")},staticStyle:{width:"62px"},attrs:{id:"input-horizontal",required:""},on:{input:_vm.onAWBInput,keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_code",3);}},model:{value:_vm.form.first_box.awb_code,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_code",$$v);},expression:"form.first_box.awb_code"}}),_vm._v(" "),_c("span",{staticStyle:{color:"#355594","font-weight":"bold"}},[_vm._v("-")]),_vm._v(" "),_c("b-form-input",{staticClass:"awb-no-input","class":{"is-invalid":_vm.form.errors.has("awb_no")},staticStyle:{width:"100px"},attrs:{id:"input-horizontal",required:""},on:{input:_vm.onAWBInput,keypress:function keypress($event){return _vm.validateNumericInput($event,"awb_no",8);}},model:{value:_vm.form.first_box.awb_no,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb_no",$$v);},expression:"form.first_box.awb_no"}}),_vm._v(" "),_c("b-form-checkbox",{staticClass:"ml-3 mb-0",attrs:{size:"sm"},model:{value:_vm.form.first_box.consolidated_mawb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"consolidated_mawb",$$v);},expression:"form.first_box.consolidated_mawb"}},[_vm._v("Consolidate MAWB")])],1)])],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_code")},attrs:{form:_vm.form,field:"awb_code"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("awb_no")},attrs:{form:_vm.form,field:"awb_no"}}),_vm._v(" "),_vm.awb_prefix_message?_c("p",{staticClass:"mt-2",staticStyle:{"font-weight":"400","font-size":"12px","line-height":"18px"}},[_vm._v(_vm._s(_vm.awb_prefix_message))]):_vm._e(),_vm._v(" "),_vm.awbId&&_vm.showAWBSection?_c("div",[_c("p",[_vm._v("The Air Waybill number has been used (printed at:)")]),_vm._v(" "),_c("p",[_vm._v("\n                                                        Load content:\n                                                        "),_c("span",{staticStyle:{cursor:"pointer",color:"blue"}},[_c("router-link",{attrs:{to:"/edit-airway-bill/"+_vm.awbId,custom:""},scopedSlots:_vm._u([{key:"default",fn:function fn(_ref){var navigate=_ref.navigate,href=_ref.href;return[_c("p",{on:{click:_vm.confirmReload}},[_vm._v(_vm._s(_vm.formattedAWBId))])];}}],null,false,1732065003)})],1)])]):_vm._e()],1)])]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"4",lg:"5"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:true},on:{change:function change($event){return _vm.handleRadioChange(true);}},model:{value:_vm.form.first_box.awb,callback:function callback($$v){_vm.$set(_vm.form.first_box,"awb",$$v);},expression:"form.first_box.awb"}},[_vm._v("AWB")])],1),_vm._v(" "),_c("b-form-group",{attrs:{"label-for":""}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAW"},on:{change:function change($event){return _vm.handleRadioChange("EAW");}},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With No Accompanying Paper\n                                                Documents")])],1),_vm._v(" "),_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm",value:"EAP"},on:{change:function change($event){return _vm.handleRadioChange("EAP");}},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_vm._v("e-AWB With Accompanying Paper\n                                                Documents")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"2",lg:"2"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-radio",{attrs:{name:"radio-size",size:"sm"}},[_vm._v("e-CSD AWB")])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",{staticClass:"my-4 my-md-10"},[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                            Shipper\n                                        ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_shipper",staticClass:"custom-dropdown align-items-center",on:{click:function click($event){return _vm.toggleDropdown("shipper");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.shipper_address.ship_name,expression:"form.shipper_address.ship_name"}],staticClass:"form-control shipper-form-control","class":[{"is-invalid":_vm.form.errors.has("ship_name")},_vm.getConfidenceClass("shipper_name")],attrs:{type:"text",placeholder:"Search shipper",id:"shipper",autocomplete:"off"},domProps:{value:_vm.form.shipper_address.ship_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.shipper_address,"ship_name",$event.target.value);},_vm.filterShippers],focus:function focus($event){return _vm.toggleDropdown("shipper",true);}}}),_vm._v(" "),_vm.activeDropdown==="shipper"&&_vm.filteredShippers.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredShippers,function(shipper,index){return _c("div",{key:shipper.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectShipper(shipper);}}},[_vm._v("\n                                                        "+_vm._s(shipper.name)+"\n                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",staticStyle:{color:"#355594",stroke:"#355594"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showShipper=!_vm.showShipper;}}})],1),_vm._v(" "),_vm.showShipper?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control ship_name_2","class":{"is-invalid":_vm.form.errors.has("ship_name_2")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_name_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_name_2",$$v);},expression:"form.shipper_address.ship_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_account,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_account",$$v);},expression:"form.shipper_address.ship_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,1954229067)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":[{"is-invalid":_vm.form.errors.has("ship_address")},_vm.getConfidenceClass("shipper_address")],attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"shipper_address.ship_address",40);}},model:{value:_vm.form.shipper_address.ship_address,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address",$$v);},expression:"form.shipper_address.ship_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_address_line_2")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"shipper_address.ship_address_line_2",35);}},model:{value:_vm.form.shipper_address.ship_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_address_line_2",$$v);},expression:"form.shipper_address.ship_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,3712382874)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-input",{staticClass:"form-control","class":[{"is-invalid":_vm.form.errors.has("ship_city")},_vm.getConfidenceClass("shipper_city")],staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_city,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_city",$$v);},expression:"form.shipper_address.ship_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_airport_code",$$v);},expression:"form.shipper_address.ship_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_city")},attrs:{form:_vm.form,field:"ship_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("ship_airport_code")},attrs:{form:_vm.form,field:"ship_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}],null,false,759624955)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":[{"is-invalid":_vm.form.errors.has("ship_post_code")},_vm.getConfidenceClass("shipper_post_code")],staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_post_code,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_post_code",$$v);},expression:"form.shipper_address.ship_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")])])];},proxy:true}],null,false,2699717750)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":[{"is-invalid":_vm.form.errors.has("ship_state")},_vm.getConfidenceClass("shipper_state")],staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_state,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_state",$$v);},expression:"form.shipper_address.ship_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,2615762453)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control shipper-form-control","class":[{"is-invalid":_vm.form.errors.has("ship_country")},_vm.getConfidenceClass("shipper_country")],model:{value:_vm.form.shipper_address.ship_country,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_country",$$v);},expression:"form.shipper_address.ship_country"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                        "+_vm._s(country.text)+"\n                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":[{"is-invalid":_vm.form.errors.has("ship_phone")},_vm.getConfidenceClass("shipper_phone")],staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_phone,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_phone",$$v);},expression:"form.shipper_address.ship_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control","class":{"is-invalid":_vm.form.errors.has("ship_fax")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_fax,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_fax",$$v);},expression:"form.shipper_address.ship_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"ship_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control shipper-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.shipper_address.ship_telex,callback:function callback($$v){_vm.$set(_vm.form.shipper_address,"ship_telex",$$v);},expression:"form.shipper_address.ship_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"70px"},attrs:{size:"sm"},model:{value:_vm.form.is_shipper_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_shipper_address_save",$$v);},expression:"form.is_shipper_address_save"}},[_vm._v(" Save new address to address\n                                                book")])],1):_vm._e()]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2 d-none d-md-block",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for\n                                            later logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("b-col",{attrs:{cols:"auto"}},[_c("h4",{staticClass:"h-color ml-2"},[_vm._v("\n                                            Consignee\n                                        ")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-shipper"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Name:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_consignee",staticClass:"custom-dropdown align-items-center",on:{click:function click($event){return _vm.toggleDropdown("consignee");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.consignee_address.cons_name,expression:"form.consignee_address.cons_name"}],staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_name")},_vm.getConfidenceClass("consignee_name")],attrs:{type:"text",placeholder:"Search consignee",id:"consignee",autocomplete:"off"},domProps:{value:_vm.form.consignee_address.cons_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.consignee_address,"cons_name",$event.target.value);},_vm.filterConsignee],focus:function focus($event){return _vm.toggleDropdown("consignee",true);}}}),_vm._v(" "),_vm.activeDropdown==="consignee"&&_vm.filteredConsignees.length?_c("div",{staticClass:"dropdown-options align-items-center"},_vm._l(_vm.filteredConsignees,function(consignee,index){return _c("div",{key:consignee.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectConsignee(consignee);}}},[_vm._v("\n                                                        "+_vm._s(consignee.name)+"\n                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name"}})],1),_vm._v(" "),_c("b-icon",{staticClass:"ml-2",staticStyle:{color:"#355594",stroke:"#355594"},attrs:{icon:"box-arrow-up-right","aria-hidden":"true"},on:{click:function click($event){_vm.showConsignee=!_vm.showConsignee;}}})],1),_vm._v(" "),_vm.showConsignee?_c("div",[_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_name_2")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_name_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_name_2",$$v);},expression:"form.consignee_address.cons_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Account:")])])];},proxy:true}],null,false,2670409376)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_account")},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_account,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_account",$$v);},expression:"form.consignee_address.cons_account"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_account"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Address:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,1954229067)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_address")},_vm.getConfidenceClass("consignee_address")],attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"consignee_address.cons_address",40);}},model:{value:_vm.form.consignee_address.cons_address,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address",$$v);},expression:"form.consignee_address.cons_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v(" ")])])];},proxy:true}],null,false,3600929531)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_address_line_2")},attrs:{id:"input-horizontal"},on:{keydown:function keydown($event){return _vm.inputLimit($event,"consignee_address.cons_address_line_2",35);}},model:{value:_vm.form.consignee_address.cons_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_address_line_2",$$v);},expression:"form.consignee_address.cons_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_address_line_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,3712382874)},[_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center pb-2"},[_c("b-form-input",{staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_city")},_vm.getConfidenceClass("consignee_city")],staticStyle:{width:"240px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_city,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_city",$$v);},expression:"form.consignee_address.cons_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"ml-3 form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("ship_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.ship_airport_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"ship_airport_code",$$v);},expression:"form.consignee_address.ship_airport_code"}})],1),_vm._v(" "),_c("div",[_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_city")},attrs:{form:_vm.form,field:"cons_city"}}),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("cons_airport_code")},attrs:{form:_vm.form,field:"cons_airport_code"}})],1)]),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}],null,false,759624955)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_post_code")},_vm.getConfidenceClass("consignee_post_code")],staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_post_code,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_post_code",$$v);},expression:"form.consignee_address.cons_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("State:")])])];},proxy:true}],null,false,2699717750)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_state")},_vm.getConfidenceClass("consignee_state")],staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_state,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_state",$$v);},expression:"form.consignee_address.cons_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}],null,false,2615762453)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_country")},_vm.getConfidenceClass("consignee_country")],model:{value:_vm.form.consignee_address.cons_country,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_country",$$v);},expression:"form.consignee_address.cons_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                        "+_vm._s(country.text)+"\n                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Phone:")])])];},proxy:true}],null,false,1623304669)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":[{"is-invalid":_vm.form.errors.has("cons_phone")},_vm.getConfidenceClass("consignee_phone")],staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_phone,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_phone",$$v);},expression:"form.consignee_address.cons_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Fax:")])])];},proxy:true}],null,false,4176059614)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control","class":{"is-invalid":_vm.form.errors.has("cons_fax")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_fax,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_fax",$$v);},expression:"form.consignee_address.cons_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"cons_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"pb-2 align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"shipper-toggle-label"},[_c("span",[_vm._v("Telex:")])])];},proxy:true}],null,false,1971532161)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control consignee-form-control",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.consignee_address.cons_telex,callback:function callback($$v){_vm.$set(_vm.form.consignee_address,"cons_telex",$$v);},expression:"form.consignee_address.cons_telex"}})],1),_vm._v(" "),_c("b-form-checkbox",{staticStyle:{"margin-left":"70px"},attrs:{size:"sm"},model:{value:_vm.form.is_consignee_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_consignee_address_save",$$v);},expression:"form.is_consignee_address_save"}},[_vm._v(" Save new address to address book")])],1):_vm._e()]),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mt-2 d-md-none",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"","label-for":"input-horizontal"}},[_c("b-form-checkbox",{staticClass:"mt-2 text-bold",attrs:{size:"sm"}},[_vm._v("Set as default e-AWB shipper for\n                                            later logins")])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-tabs",{staticClass:"custom-nav-title mt-6",attrs:{"content-class":"mt-7"}},[_c("b-tab",{staticStyle:{"border-bottom":"0px !important"},attrs:{title:"Routing Information"}},[_c("b-row",{staticClass:"mt-8 mb-6"},[_c("b-col",{attrs:{cols:"12",lg:"4"}},[_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-departure-airport"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Departure Airport:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_departure",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"220px !important"},on:{click:function click($event){return _vm.toggleDropdown("departure");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.departure_airport,expression:"form.routing_information.departure_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("departure_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search departure",id:"departure",autocomplete:"off"},domProps:{value:_vm.form.routing_information.departure_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"departure_airport",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="departure"&&_vm.getFilteredLocations(_vm.form.routing_information.departure_airport).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.departure_airport),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("departure_airport",item);}}},[_vm._v(_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("departure_airport")},attrs:{form:_vm.form,field:"departure_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center my-4",staticStyle:{width:"100%"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-destination-airport"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"routing-info-label"},[_c("span",[_vm._v("Destination Airport:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_destination",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"220px !important"},on:{click:function click($event){return _vm.toggleDropdown("destination");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.destination_airport,expression:"form.routing_information.destination_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("destination_airport")},staticStyle:{width:"100%"},attrs:{type:"text",placeholder:"Search destination",id:"destination",autocomplete:"off"},domProps:{value:_vm.form.routing_information.destination_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"destination_airport",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="destination"&&_vm.getFilteredLocations(_vm.form.routing_information.destination_airport).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.destination_airport),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("destination_airport",item);}}},[_vm._v("\n                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{"class":{"d-block":_vm.form.errors.has("destination_airport")},attrs:{form:_vm.form,field:"destination_airport"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-lg-0",attrs:{cols:"12",lg:"8"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table",staticStyle:{"max-width":"100%",width:"100%","min-width":"650px !important"}},[_c("thead",[_c("tr",{},[_c("th",{staticStyle:{color:"#355594",width:"8%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"21%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("From")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"21%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("To")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"11%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("By")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"14%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("Flight")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"20%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}},[_vm._v("Date")]),_vm._v(" "),_c("th",{staticStyle:{color:"#355594",width:"5%",padding:"12px 6px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.08) !important"}})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important","font-weight":"500",color:"#475569"}},[_vm._v("Routing:"),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_from",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("from");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.from,expression:"form.routing_information.from"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("from")},attrs:{type:"text",placeholder:"Search destination",id:"from_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.from},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"from",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="from"&&_vm.getFilteredLocations(_vm.form.routing_information.from).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.from),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("from",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to",staticClass:"custom-dropdown align-items-center",staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("to");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to,expression:"form.routing_information.to"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to")},attrs:{type:"text",placeholder:"Search destination",id:"to_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="to"&&_vm.getFilteredLocations(_vm.form.routing_information.to).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.to),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("to",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()])]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by,expression:"form.routing_information.by"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight,expression:"form.routing_information.flight"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date,expression:"form.routing_information.date"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date");}}})],1)]),_vm._v(" "),_vm.form.errors.has("from")||_vm.form.errors.has("to")||_vm.form.errors.has("by")||_vm.form.errors.has("flight")||_vm.form.errors.has("date")?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("from")},attrs:{form:_vm.form,field:"from"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("to")},attrs:{form:_vm.form,field:"to"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("by")},attrs:{form:_vm.form,field:"by"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("flight")},attrs:{form:_vm.form,field:"flight"}})],1),_vm._v(" "),_c("td",{staticClass:"text-danger",attrs:{valign:"top"}},[_c("has-error",{"class":{"d-block":_vm.form.errors.has("date")},attrs:{form:_vm.form,field:"date"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important"}},[_vm._v(" ")])]):_vm._e(),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to2",staticClass:"custom-dropdown",staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("to2");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_2,expression:"form.routing_information.to_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_2")},attrs:{type:"text",placeholder:"Search destination",id:"to2_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_2",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="to2"&&_vm.getFilteredLocations(_vm.form.routing_information.to_2).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.to_2),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("to_2",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_2"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_2,expression:"form.routing_information.by_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_2")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_2,expression:"form.routing_information.flight_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_2")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_2,expression:"form.routing_information.date_2"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_2")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_2},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_2",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell w-10",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_2");}}})],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{width:"8%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_vm._v(" ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"21%",padding:"8px 6px !important"}},[_c("div",{ref:"dropdownContainer_to3",staticClass:"custom-dropdown",staticStyle:{width:"100%"},on:{click:function click($event){return _vm.toggleDropdown("to3");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.to_3,expression:"form.routing_information.to_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("to_3")},attrs:{type:"text",placeholder:"Search destination",id:"to3_id",autocomplete:"off"},domProps:{value:_vm.form.routing_information.to_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"to_3",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="to3"&&_vm.getFilteredLocations(_vm.form.routing_information.to_3).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.form.routing_information.to_3),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("to_3",item);}}},[_vm._v("\n                                                                                "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"to_3"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"11%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.by_3,expression:"form.routing_information.by_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("by_3")},staticStyle:{padding:"0.375rem 0.25rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.by_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"by_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"14%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.flight_3,expression:"form.routing_information.flight_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("flight_3")},staticStyle:{padding:"0.375rem 0.5rem","text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.flight_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"flight_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"20%",padding:"8px 6px !important"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.routing_information.date_3,expression:"form.routing_information.date_3"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("date_3")},staticStyle:{"text-align":"center"},attrs:{type:"text"},domProps:{value:_vm.form.routing_information.date_3},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.form.routing_information,"date_3",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{width:"5%",padding:"8px 6px !important","padding-left":"10px !important"}},[_c("date-picker",{staticStyle:{width:"100%","max-width":"30px"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"form.routing_information.date_3");}}})],1)])])])])])],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("b-row",[_c("b-col",{attrs:{cols:"12",sm:"6"}},[_c("div",{staticClass:"align-items-center"},[_c("h6",{staticClass:"h-color mb-0"},[_vm._v("Consignment Rate Description")])])]),_vm._v(" "),_c("b-col",{staticClass:"mt-2 mt-sm-0 text-left text-sm-right",attrs:{cols:"12",sm:"6"}},[_c("div",{staticClass:"d-flex justify-content-start justify-content-sm-end align-items-center mr-0 mr-sm-16"},[_c("p",{staticClass:"mb-0 ml-0 ml-sm-4 mr-4",staticStyle:{"border-bottom":"1px solid #355594",color:"#355594","font-size":"13px","font-weight":"600",cursor:"pointer"}},[_vm._v("Collect house waybill sum's")])])])],1),_vm._v(" "),_c("b-button",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-consignment",modifiers:{"modal-consignment":true}}],staticClass:"mt-5 mb-5 show-btn",attrs:{disabled:_vm.isConsignmentAdded},on:{click:_vm.handleAddConsignment}},[_vm._v("Add Consignment Information")]),_vm._v(" "),_c("b-modal",{ref:"modalConsignment",attrs:{id:"modal-consignment",title:"Consignment Information",size:"xl","ok-only":"","hide-footer":"",centered:"","modal-class":"premium-modal","title-class":"font-weight-bolder text-dark","header-class":"border-bottom-0 pb-0 px-5 pt-5"},on:{hide:_vm.handleModalClose}},[_c("b-row",[_c("b-col",{attrs:{cols:"12",md:"6"}},[_c("h6",{staticStyle:{color:"#0f2247","font-weight":"700","margin-bottom":"15px",background:"#e1e8f5",padding:"10px 14px","border-left":"4px solid #2c4d8c","border-radius":"4px","font-size":"14px","letter-spacing":"0.3px"}},[_vm._v("Pieces and Nature and Quantity of Goods")]),_vm._v(" "),_c("div",{},[_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Pieces"}},[_vm._v("Pieces")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.consignment_list.errors.has("pieces")},staticStyle:{width:"100% !important","margin-bottom":"10px"},attrs:{id:"input-departure-airport"},model:{value:_vm.consignment_list.pieces,callback:function callback($$v){_vm.$set(_vm.consignment_list,"pieces",$$v);},expression:"consignment_list.pieces"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"pieces"}}),_vm._v(" "),_c("label",{staticStyle:{"margin-bottom":"0px"},attrs:{"for":"Description7"}},[_vm._v("Description")]),_vm._v(" "),_c("b-form-textarea",{"class":{"is-invalid":_vm.consignment_list.errors.has("description")},staticStyle:{height:"70px",width:"100%","margin-bottom":"10px"},attrs:{id:"textarea"},model:{value:_vm.consignment_list.description,callback:function callback($$v){_vm.$set(_vm.consignment_list,"description",$$v);},expression:"consignment_list.description"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"description"}}),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Rate Class:")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Rate class:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("rate_class")},staticStyle:{"margin-bottom":"10px"},on:{change:_vm.calculateTotalAmount},model:{value:_vm.consignment_list.rate_class,callback:function callback($$v){_vm.$set(_vm.consignment_list,"rate_class",$$v);},expression:"consignment_list.rate_class"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Rate Class")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("CB - Basic rate")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("CC - Specific commodity rate")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("CE - Unit load device additional rate")]),_vm._v(" "),_c("option",{attrs:{value:"K"}},[_vm._v("CK - Rate per kilogram")]),_vm._v(" "),_c("option",{attrs:{value:"M"}},[_vm._v("CM - Minimum charge")]),_vm._v(" "),_c("option",{attrs:{value:"N"}},[_vm._v("CN - Normal rate")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("CP - International priority service rate")]),_vm._v(" "),_c("option",{attrs:{value:"Q"}},[_vm._v("CQ - Quantity rate")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("CR - Class rate reduction")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("CS - Class rate surcharge")]),_vm._v(" "),_c("option",{attrs:{value:"U"}},[_vm._v("CU - Unit load device basic charge or rate")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("CX - Unit load device additional info")]),_vm._v(" "),_c("option",{attrs:{value:"Y"}},[_vm._v("CY - Unit load device discount")]),_vm._v(" "),_c("option",{attrs:{value:"Z"}},[_vm._v("CZ - Mutually Defined")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate_class"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_rate_class,expression:"consignment_list.uld_rate_class"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("uld_rate_class")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_rate_class},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_rate_class",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"uld_rate_class"}})],1)]),_vm._v(" "),_vm.consignment_list.rate_class?_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"},attrs:{colspan:"4"}},[_c("div",{staticClass:"d-flex justify-content-end align-items-center"},[_c("span",{staticClass:"mr-2"},[_vm._v("Charge:")]),_vm._v(" "),_c("input",{staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.calculatedCharge}})])])]):_vm._e(),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Service code")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Commodity Item")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("service_code")},staticStyle:{"margin-bottom":"10px"},model:{value:_vm.consignment_list.service_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"service_code",$$v);},expression:"consignment_list.service_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a Service Code")]),_vm._v(" "),_c("option",{attrs:{value:"A"}},[_vm._v("A - Airport to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"B"}},[_vm._v("B - Service Cargo")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Company Material")]),_vm._v(" "),_c("option",{attrs:{value:"D"}},[_vm._v("D - Door to Door")]),_vm._v(" "),_c("option",{attrs:{value:"E"}},[_vm._v("E - Airport to Door")]),_vm._v(" "),_c("option",{attrs:{value:"F"}},[_vm._v("F - Flight Specific")]),_vm._v(" "),_c("option",{attrs:{value:"G"}},[_vm._v("G - Door to Airport")]),_vm._v(" "),_c("option",{attrs:{value:"H"}},[_vm._v("H - Company Mail")]),_vm._v(" "),_c("option",{attrs:{value:"I"}},[_vm._v("I - Diplomatic Mail")]),_vm._v(" "),_c("option",{attrs:{value:"J"}},[_vm._v("J - Priority Service")]),_vm._v(" "),_c("option",{attrs:{value:"P"}},[_vm._v("P - Small Package Service")]),_vm._v(" "),_c("option",{attrs:{value:"R"}},[_vm._v("R - Restricted")]),_vm._v(" "),_c("option",{attrs:{value:"S"}},[_vm._v("S - Substitue Truck")]),_vm._v(" "),_c("option",{attrs:{value:"T"}},[_vm._v("T - Charter")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Express Service")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"service_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.commodity_item,expression:"consignment_list.commodity_item"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("commodity_item")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.commodity_item},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"commodity_item",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("\n                                                                Country Of Origin of Goods\n                                                            ")]),_vm._v(" "),_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Slac:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("country_origin_goods")},staticStyle:{"margin-bottom":"10px"},model:{value:_vm.consignment_list.country_origin_goods,callback:function callback($$v){_vm.$set(_vm.consignment_list,"country_origin_goods",$$v);},expression:"consignment_list.country_origin_goods"}},[_c("option",{attrs:{value:""}},[_vm._v(" Select a Country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                        "+_vm._s(country.text)+"\n                                                                    ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"country_origin_goods"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.slac,expression:"consignment_list.slac"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("slac")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.slac},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"slac",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"commodity_item"}})],1)]),_vm._v(" "),_c("tr",[_c("th",{staticStyle:{"font-family":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Hs Codes:")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center"}},[_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.hs_code_error.length>0},staticStyle:{width:"100%","margin-right":"10px","margin-bottom":"10px"},attrs:{type:"text"},model:{value:_vm.consignment_list.hs_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"hs_code",$$v);},expression:"consignment_list.hs_code"}}),_vm._v(" "),_c("button",{staticClass:"show-btn",staticStyle:{"margin-bottom":"10px"},on:{click:_vm.addHsCode}},[_vm._v("Add")])],1),_vm._v(" "),_vm.hs_code_error.length?_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.hs_code_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)]):_vm._e()]),_vm._v(" "),_c("tr",{staticStyle:{"background-color":"#F8FAFC"}},[_c("th",{staticStyle:{color:"#8A99AD !important","font-weight":"500 !important","font-size":"11px !important","text-transform":"uppercase !important","letter-spacing":"0.5px !important",padding:"6px 2px !important","border-bottom":"1px solid rgba(53, 85, 148, 0.05) !important"}},[_vm._v("HS Codes")])]),_vm._v(" "),_vm._l(_vm.consignment_list.hsCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",[_vm._v(" "+_vm._s(code)+" ")]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.removeHsCode(index);}}})],1)]);})],2)])])],1)]),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("h6",{staticStyle:{color:"#0f2247","font-weight":"700","margin-bottom":"25px",background:"#e1e8f5",padding:"10px 14px","border-left":"4px solid #2c4d8c","border-radius":"4px","font-size":"14px","letter-spacing":"0.3px"}},[_vm._v("Weight and Dimensions")]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Gross Weight")]),_vm._v(" "),_c("th"),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Rate")])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.gross_weight,expression:"consignment_list.gross_weight"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("gross_weight")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.gross_weight},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"gross_weight",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"gross_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("b-form-select",{staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("weight_code")},model:{value:_vm.consignment_list.weight_code,callback:function callback($$v){_vm.$set(_vm.consignment_list,"weight_code",$$v);},expression:"consignment_list.weight_code"}},[_c("option",{attrs:{value:"KGM"}},[_vm._v("Kgs")]),_vm._v(" "),_c("option",{attrs:{value:"LBR"}},[_vm._v("Lbs")])]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"weight_code"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.chargable_weight,expression:"consignment_list.chargable_weight"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("chargable_weight")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.chargable_weight},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"chargable_weight",$event.target.value);},_vm.calculateTotalAmount]}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"chargable_weight"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"margin-bottom":"10px"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.rate,expression:"consignment_list.rate"}],staticClass:"form-control w-100","class":{"is-invalid":_vm.consignment_list.errors.has("rate")},attrs:{type:"text"},domProps:{value:_vm.consignment_list.rate},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"rate",$event.target.value);},_vm.calculateTotalAmount]}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.consignment_list,field:"rate"}})],1)])])]),_vm._v(" "),_c("table",{staticClass:"table table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Pcs")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Wgt")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Length")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Width")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Height")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Unit")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.pcs,expression:"consignment_list.pcs"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.pcs},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"pcs",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.wgt,expression:"consignment_list.wgt"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.wgt},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"wgt",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.length,expression:"consignment_list.length"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.length},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"length",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.width,expression:"consignment_list.width"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.width},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"width",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.height,expression:"consignment_list.height"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.height},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"height",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100",model:{value:_vm.consignment_list.unit,callback:function callback($$v){_vm.$set(_vm.consignment_list,"unit",$$v);},expression:"consignment_list.unit"}},[_c("option",{attrs:{value:"CMT"}},[_vm._v("CMT")]),_vm._v(" "),_c("option",{attrs:{value:"INH"}},[_vm._v("INH")]),_vm._v(" "),_c("option",{attrs:{value:"FOT"}},[_vm._v("FOT")])])],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addPcsInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.validationErrors.length>0?_c("tr",[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"7"}},[_c("div",{staticClass:"text-danger"},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.validationErrors,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])])]):_vm._e()])]),_vm._v(" "),_c("table",{staticClass:"table-lightweight"},[_c("thead",[_c("tr",[_c("th",[_vm._v("Pcs")]),_vm._v(" "),_c("th",[_vm._v("Wgt")]),_vm._v(" "),_c("th",[_vm._v("Length")]),_vm._v(" "),_c("th",[_vm._v("Width")]),_vm._v(" "),_c("th",[_vm._v("Height")]),_vm._v(" "),_c("th",[_vm._v("Unit")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.itemss,function(row,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(row.pcs))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.wgt)+" "+_vm._s(_vm.consignment_list.weight_code))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.length))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.width))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.height))]),_vm._v(" "),_c("td",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span",{staticClass:"mr-3"},[_vm._v(_vm._s(row.unit))]),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deletePcs(index);}}})],1)]);}),0)]),_vm._v(" "),_c("table",{staticClass:"table-sm"},[_c("tr",[_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}},[_vm._v("Volume")]),_vm._v(" "),_c("th",{staticStyle:{"padding-bottom":"0px","font-size":"13px !important","font-weight":"500"}})]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_c("b-form-input",{staticClass:"form-control w-100",attrs:{id:"input-horizontal"},model:{value:_vm.consignment_list.volume,callback:function callback($$v){_vm.$set(_vm.consignment_list,"volume",$$v);},expression:"consignment_list.volume"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-select",{staticClass:"form-control w-100",model:{value:this.form.entries.dimention_unit,callback:function callback($$v){_vm.$set(this.form.entries,"dimention_unit",$$v);},expression:"this.form.entries.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1)])])])]),_vm._v(" "),_c("h5",{staticClass:"mt-10 mb-2",staticStyle:{"font-size":"13px","font-weight":"500"}},[_vm._v("ULD Information")]),_vm._v(" "),_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"13px","font-weight":"500","padding-bottom":"0px"}},[_vm._v("Owner:")]),_vm._v(" "),_c("th")]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_type,expression:"consignment_list.uld_type"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_type},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_type",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-15"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.uld_serial,expression:"consignment_list.uld_serial"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.uld_serial},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"uld_serial",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell pr-2"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.consignment_list.owner,expression:"consignment_list.owner"}],staticClass:"form-control w-100",attrs:{type:"text"},domProps:{value:_vm.consignment_list.owner},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.consignment_list,"owner",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addUldInfo}},[_vm._v("Add")])])]),_vm._v(" "),_vm.uld_error.length?_c("tr",{staticStyle:{color:"red"}},[_c("td",{staticStyle:{border:"0px"},attrs:{colspan:"4"}},[_c("ul",{staticStyle:{"list-style-type":"none","padding-left":"0","font-size":"10px"}},[_c("li",[_vm._v("Warning:")]),_vm._v(" "),_vm._l(_vm.uld_error,function(error,index){return _c("li",{key:index},[_vm._v(_vm._s(error))]);})],2)])]):_vm._e()])]),_vm._v(" "),_c("table",{staticClass:"table-lightweight"},[_c("thead",[_c("tr",[_c("th",[_vm._v("ULD Type:")]),_vm._v(" "),_c("th",[_vm._v("ULD Serial:")]),_vm._v(" "),_c("th",[_vm._v("Owner:")]),_vm._v(" "),_c("th")])]),_vm._v(" "),_c("tbody",_vm._l(_vm.consignment_list.uld_infos,function(row,index){return _c("tr",{key:index},[_c("td",[_vm._v(_vm._s(row.uld_type))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.uld_serial))]),_vm._v(" "),_c("td",[_vm._v(_vm._s(row.owner))]),_vm._v(" "),_c("td",{staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("span"),_vm._v(" "),_c("b-icon",{staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteUldInfo(index);}}})],1)]);}),0)])])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end"},[_c("button",{staticClass:"show-btn",on:{click:_vm.addOrUpdateEntry}},[_vm._v("\n                                            "+_vm._s(_vm.edit_entry_index!==null?"Update":"Add")+"\n                                        ")])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-hover table-sm align-middle",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticClass:"text-nowrap",staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"60px",padding:"10px 8px"}},[_vm._v("Pcs.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"250px",padding:"10px 8px"}},[_vm._v("Description")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"90px",padding:"10px 8px"}},[_vm._v("Srv. Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"95px",padding:"10px 8px"}},[_vm._v("Com. Itm.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"110px",padding:"10px 8px"}},[_vm._v("Gross Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"110px",padding:"10px 8px"}},[_vm._v("Chrg. Wgt.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}},[_vm._v("Rate")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"260px",padding:"10px 8px"}},[_vm._v("Detailed Pcs. Info")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}},[_vm._v("Vol.")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"100px",padding:"10px 8px"}},[_vm._v("Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"120px",padding:"10px 8px"}},[_vm._v("UID Rate Class")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"90px",padding:"10px 8px"}},[_vm._v("Charge")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"115px",padding:"10px 8px"}},[_vm._v("HS Code")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"120px",padding:"10px 8px"}},[_vm._v("Origin Country")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"160px",padding:"10px 8px"}},[_vm._v("UID information")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}},[_vm._v("Slac")]),_vm._v(" "),_c("th",{staticStyle:{"font-size":"12px","font-weight":"600 !important","min-width":"80px",padding:"10px 8px"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.entries,function(entry,index){return _c("tr",{key:index},[_c("td",{staticClass:"align-middle"},[_c("strong",[_vm._v(_vm._s(entry.pieces))])]),_vm._v(" "),_c("td",{staticClass:"align-middle text-wrap",staticStyle:{"max-width":"300px","line-height":"1.4"}},[entry.description?_c("div",_vm._l(entry.description.split("\n"),function(line,lineIdx){return _c("div",{key:lineIdx,"class":lineIdx===0?"font-weight-bold text-dark":"text-muted small mt-1"},[_vm._v("\n                                                                "+_vm._s(line)+"\n                                                            ")]);}),0):_vm._e()]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.service_code))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.commodity_item))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("div",{staticClass:"text-nowrap"},[_c("strong",[_vm._v(_vm._s(entry.gross_weight))]),_vm._v(" "),_c("span",{staticClass:"text-muted small"},[_vm._v(_vm._s(entry.weight_code))])])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("div",{staticClass:"text-nowrap"},[_c("strong",[_vm._v(_vm._s(entry.chargable_weight))]),_vm._v(" "),_c("span",{staticClass:"text-muted small"},[_vm._v(_vm._s(entry.weight_code||"KGM"))])])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("strong",[_vm._v(_vm._s(entry.rate))])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},_vm._l(entry.itemss,function(pcs,pcsIndex){return _c("div",{key:pcsIndex,staticClass:"mb-1"},[_c("span",{staticClass:"badge badge-light border text-dark px-2 py-1 d-inline-block",staticStyle:{"font-size":"11px","white-space":"nowrap"}},[_c("strong",[_vm._v(_vm._s(pcs.pcs))]),_vm._v(" pcs\n                                                                "),pcs.wgt?_c("span",{staticClass:"text-muted"},[_vm._v(" ("+_vm._s(pcs.wgt)+" "+_vm._s(pcs.weight_code)+")")]):_vm._e(),_vm._v(" "),pcs.length||pcs.width||pcs.height?_c("span",{staticClass:"text-muted font-weight-normal ml-1"},[_vm._v("\n                                                                    • "+_vm._s(pcs.length)+"×"+_vm._s(pcs.width)+"×"+_vm._s(pcs.height)+" "+_vm._s(pcs.unit)+"\n                                                                ")]):_vm._e()])]);}),0),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.volume))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[entry.rate_class?_c("span",{staticClass:"badge badge-secondary"},[_vm._v(_vm._s(entry.rate_class))]):_vm._e()]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.uld_rate_class))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("strong",[_vm._v(_vm._s(_vm.form.totals.total_amount))])]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_c("div",{staticClass:"d-flex flex-wrap"},_vm._l(entry.hsCodes,function(hs,hsIndex){return _c("span",{key:hsIndex,staticClass:"badge mr-1 mb-1 px-2 py-1",staticStyle:{"font-size":"11px","background-color":"#e1e8f5",color:"#2c4d8c",border:"1px solid #c9d6ec","font-weight":"600"}},[_vm._v("\n                                                                "+_vm._s(hs)+"\n                                                            ")]);}),0)]),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.country_origin_goods))]),_vm._v(" "),_c("td",{staticClass:"align-middle"},_vm._l(entry.uld_infos,function(uld,uldIndex){return _c("div",{key:uldIndex,staticClass:"mb-1"},[_c("span",{staticClass:"badge badge-light border text-dark px-2 py-1 d-inline-block",staticStyle:{"font-size":"11px","white-space":"nowrap"}},[_c("strong",[_vm._v(_vm._s(uld.uld_type))]),_vm._v(" "),_c("span",{staticClass:"text-muted"},[_vm._v("#"+_vm._s(uld.uld_serial)+" ("+_vm._s(uld.owner)+")")])])]);}),0),_vm._v(" "),_c("td",{staticClass:"align-middle"},[_vm._v(_vm._s(entry.slac))]),_vm._v(" "),_c("td",{staticClass:"align-middle text-nowrap"},[_c("b-icon",{staticClass:"mr-2 text-primary",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editEntry(index);}}}),_vm._v(" "),_c("b-icon",{staticClass:"text-danger",staticStyle:{cursor:"pointer"},attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteEntry(index);}}})],1)]);}),0)])])])],1),_vm._v(" "),_c("b-row",[_c("b-col",{staticStyle:{"justify-items":"flex-end"},attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-center mr-32 mt-4"},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("div",{staticClass:"mr-2"},[_vm._v("Total Volume:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control mr-2",staticStyle:{width:"140px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.totals.total_volume,callback:function callback($$v){_vm.$set(_vm.form.totals,"total_volume",$$v);},expression:"form.totals.total_volume"}}),_vm._v(" "),_c("b-form-select",{staticClass:"form-control",staticStyle:{width:"60px","background-position-x":"right"},model:{value:_vm.form.totals.dimention_unit,callback:function callback($$v){_vm.$set(_vm.form.totals,"dimention_unit",$$v);},expression:"form.totals.dimention_unit"}},[_c("option",{attrs:{value:"CMQ"}},[_vm._v("cm³")]),_vm._v(" "),_c("option",{attrs:{value:"MTQ"}},[_vm._v("m³")]),_vm._v(" "),_c("option",{attrs:{value:"FTQ"}},[_vm._v("ft³")]),_vm._v(" "),_c("option",{attrs:{value:"INQ"}},[_vm._v("in³")])])],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("div",{staticClass:"mr-2 mb-0"},[_vm._v("Total Amount:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control mr-2",staticStyle:{width:"140px"},attrs:{id:"input-horizontal",value:_vm.calculatedCharge}})],1)])],1)])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"mt-6 mb-15 ml-4 mr-4"},[_c("h6",{staticClass:"h-color mb-6"},[_vm._v("Customs Origin Code:")]),_vm._v(" "),_c("b-form-group",{staticStyle:{"max-width":"450px",width:"100%"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control",model:{value:_vm.form.custom_origin.customs_origin_code,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"customs_origin_code",$$v);},expression:"form.custom_origin.customs_origin_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select another charge code")]),_vm._v(" "),_c("option",{attrs:{value:"T1"}},[_vm._v("T1 - Goods from outside the EC under Customs Control")]),_vm._v(" "),_c("option",{attrs:{value:"T2"}},[_vm._v("T2 - EC Goods not in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"TE"}},[_vm._v("TE - Goods in trade with Spain subject to duties")]),_vm._v(" "),_c("option",{attrs:{value:"TP"}},[_vm._v("TP - Goods in trade with Portugal subject to special duties")]),_vm._v(" "),_c("option",{attrs:{value:"TD"}},[_vm._v("TD - Goods already under formal transit procedure")]),_vm._v(" "),_c("option",{attrs:{value:"TF"}},[_vm._v("TF - Goods in trade between EC and Canary Islands")]),_vm._v(" "),_c("option",{attrs:{value:"C"}},[_vm._v("C - Goods in free circulation")]),_vm._v(" "),_c("option",{attrs:{value:"X"}},[_vm._v("X - Goods in free circulation with destination outside the EC")])])],1)],1)])],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"pt-4 pb-9"},[_c("b-tabs",{staticClass:"custom-nav",attrs:{"content-class":"mt-3"}},[_c("b-tab",{attrs:{title:"OSI",active:""}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Service Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("other_service_information")},staticStyle:{height:"80px",width:"60%"},attrs:{id:"textarea"},on:{input:_vm.validateTextarea},model:{value:_vm.form.custom_origin.other_service_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"other_service_information",$$v);},expression:"form.custom_origin.other_service_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"other_service_information"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"SSR"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Special Service Request:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("special_service_request")},staticStyle:{height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.special_service_request,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"special_service_request",$$v);},expression:"form.custom_origin.special_service_request"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_service_request"}})],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Accounting Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Accounting Information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-form-textarea",{staticClass:"responsive-textarea","class":{"is-invalid":_vm.form.errors.has("accounting_information")},staticStyle:{height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.accounting_information,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"accounting_information",$$v);},expression:"form.custom_origin.accounting_information"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"accounting_information"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mt-2 flex-wrap tab-input-group"},[_c("label",{staticClass:"mb-0 mr-2",staticStyle:{width:"90px"},attrs:{"for":"input-horizontal"}},[_vm._v("Letter Of Credit")]),_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"200px"},model:{value:_vm.form.custom_origin.letter_credit,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"letter_credit",$$v);},expression:"form.custom_origin.letter_credit"}},[_c("option",{attrs:{value:"CRN"}},[_vm._v("Credit Card Number")]),_vm._v(" "),_c("option",{attrs:{value:"CRD"}},[_vm._v("Credit Card Expiry Date")]),_vm._v(" "),_c("option",{attrs:{value:"CRI"}},[_vm._v("Credit Card Issuance Name")]),_vm._v(" "),_c("option",{attrs:{value:"GEN"}},[_vm._v("General Information")]),_vm._v(" "),_c("option",{attrs:{value:"GBL"}},[_vm._v("Government Bill of Lading")]),_vm._v(" "),_c("option",{attrs:{value:"STL"}},[_vm._v("Mode of Settlement")]),_vm._v(" "),_c("option",{attrs:{value:"RET"}},[_vm._v("Return to Origin")]),_vm._v(" "),_c("option",{attrs:{value:"SRN"}},[_vm._v("Shipper's Reference Number")])])],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Shipment Reference Infomation"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Shipment Reference Information")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Shipment Reference Number:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("shipment_ref_no")},staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.shipment_ref_no,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"shipment_ref_no",$$v);},expression:"form.custom_origin.shipment_ref_no"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"shipment_ref_no"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center mb-2"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v("Supplementary Shipment Information:")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info",$$v);},expression:"form.custom_origin.supplementary_shipment_info"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center"},[_c("label",{staticStyle:{width:"230px","justify-content":"end",display:"flex","padding-right":"2px"}},[_vm._v(" ")]),_vm._v(" "),_c("b-form-input",{staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_shipment_info_line_2")},staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.custom_origin.supplementary_shipment_info_line_2,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"supplementary_shipment_info_line_2",$$v);},expression:"form.custom_origin.supplementary_shipment_info_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_shipment_info_line_2"}})],1)])])]),_vm._v(" "),_c("b-tab",{attrs:{title:"IATA and Cass"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Override IATA And Cass:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","abel-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"IATA:"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_code,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_code",$$v);},expression:"iata_cass.iata_agent_code"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto",label:"Cass:","label-for":"input-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",attrs:{id:"input-horizontal"},model:{value:_vm.iata_cass.iata_agent_cass,callback:function callback($$v){_vm.$set(_vm.iata_cass,"iata_agent_cass",$$v);},expression:"iata_cass.iata_agent_cass"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"d-flex align-items-center",attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{"label-for":"name-input"}},[_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_iata_login_later,callback:function callback($$v){_vm.$set(_vm.form,"is_iata_login_later",$$v);},expression:"form.is_iata_login_later"}},[_vm._v("Save information for later logins")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Agent Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Agent information:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{staticClass:"align-items-center mb-6 mb-md-0 mb-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Override Issuing Agent:")])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_name,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_name",$$v);},expression:"agent_information.agent_name"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-lg",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_address,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_address",$$v);},expression:"agent_information.agent_address"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"150px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_city,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_city",$$v);},expression:"agent_information.agent_city"}}),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"150px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_pincode,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_pincode",$$v);},expression:"agent_information.agent_pincode"}})],1)]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Signature:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.agent_issue_sign,callback:function callback($$v){_vm.$set(_vm.agent_information,"agent_issue_sign",$$v);},expression:"agent_information.agent_issue_sign"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Location Code:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_issue",staticClass:"custom-dropdown",on:{click:function click($event){return _vm.toggleDropdown("issue");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_loc_code,expression:"agent_information.agent_issue_loc_code"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("agent_issue_loc_code")},staticStyle:{width:"170px"},attrs:{type:"text",placeholder:"Search location",id:"agent_issue_loc_code",autocomplete:"off"},domProps:{value:_vm.agent_information.agent_issue_loc_code},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_loc_code",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="issue"&&_vm.getFilteredLocations(_vm.agent_information.agent_issue_loc_code).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.agent_information.agent_issue_loc_code),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("agent_issue_loc_code",item,"agent_information");}}},[_vm._v("\n                                                                                    "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                                ")]);}),0):_vm._e()])]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Issuing Date:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("div",{staticClass:"d-flex"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_issue_date,expression:"agent_information.agent_issue_date"}],staticClass:"form-control-sm form-control mr-2",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-horizontal"},domProps:{value:_vm.agent_information.agent_issue_date},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_issue_date",$event.target.value);}}}),_vm._v(" "),_c("date-picker",{staticStyle:{width:"30px !important"},attrs:{valueType:"format"},on:{change:function change($event){return _vm.handleDateChange($event,"agent_information.agent_issue_date");}}})],1)]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Agent Account:")])])];},proxy:true}])},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.agent_account,expression:"agent_information.agent_account"}],staticClass:"form-control-sm form-control",staticStyle:{width:"150px"},attrs:{type:"text",id:"input-horizontal"},domProps:{value:_vm.agent_information.agent_account},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"agent_account",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Save information for later logins")])],1)],1),_vm._v(" "),_c("b-col",{staticClass:"align-items-center mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"mb-4",staticStyle:{"background-color":"#F2F9FF"}},[_c("h6",{staticClass:"h-color",staticStyle:{padding:"5px 20px","font-size":"15px","font-weight":"500"}},[_vm._v("Senders Reference:")])]),_vm._v(" "),_c("div",{staticClass:"d-flex mb-6"},[_c("div",{staticStyle:{padding:"0px 20px"}},[_c("b-form-radio",{staticStyle:{"font-size":"14px"},attrs:{name:"participate",size:"sm",value:"0"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Participant")])],1),_vm._v(" "),_c("div",{staticStyle:{padding:"0px 20px"}},[_c("b-form-radio",{staticStyle:{"font-size":"14px"},attrs:{name:"participate",size:"sm",value:"1"},model:{value:_vm.agent_information.participate,callback:function callback($$v){_vm.$set(_vm.agent_information,"participate",$$v);},expression:"agent_information.participate"}},[_vm._v("Office")])],1)]),_vm._v(" "),_vm.agent_information.participate==="0"?_c("div",[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Airport:")])])];},proxy:true}],null,false,1576548421)},[_vm._v(" "),_c("div",{ref:"dropdownContainer_participant",staticClass:"custom-dropdown dropdown-container",on:{click:function click($event){return _vm.toggleDropdown("participant");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.participate_airport,expression:"agent_information.participate_airport"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("participate_airport")},attrs:{type:"text",placeholder:"Search location",id:"participant",autocomplete:"off"},domProps:{value:_vm.agent_information.participate_airport},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"participate_airport",$event.target.value);}}}),_vm._v(" "),_vm.activeDropdown==="participant"&&_vm.getFilteredLocations(_vm.agent_information.participate_airport).length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.getFilteredLocations(_vm.agent_information.participate_airport),function(item,index){return _c("div",{key:index,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectLocation("participate_airport",item,"agent_information");}}},[_vm._v("\n                                                                                        "+_vm._s(item.iata_code)+" ("+_vm._s(item.destination)+")\n                                                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"participate_airport"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Identifer:")])])];},proxy:true}],null,false,3583013676)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.agent_information.prticipant_identifer,callback:function callback($$v){_vm.$set(_vm.agent_information,"prticipant_identifer",$$v);},expression:"agent_information.prticipant_identifer"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"AIR"}},[_vm._v("Airline AIR")]),_vm._v(" "),_c("option",{attrs:{value:"APT"}},[_vm._v("Airport Authority APT")]),_vm._v(" "),_c("option",{attrs:{value:"AGT"}},[_vm._v("Agent AGT")]),_vm._v(" "),_c("option",{attrs:{value:"BRK"}},[_vm._v("Broker BRK")]),_vm._v(" "),_c("option",{attrs:{value:"CAG"}},[_vm._v("Commissionable Agent CAG")]),_vm._v(" "),_c("option",{attrs:{value:"CNE"}},[_vm._v("Consignee CNE")]),_vm._v(" "),_c("option",{attrs:{value:"CTM"}},[_vm._v("Customs CTM")]),_vm._v(" "),_c("option",{attrs:{value:"DCL"}},[_vm._v("Declarant DCL")]),_vm._v(" "),_c("option",{attrs:{value:"DEC"}},[_vm._v("Deconsolidator DEC")]),_vm._v(" "),_c("option",{attrs:{value:"FFW"}},[_vm._v("Freight Forwarder FFW")]),_vm._v(" "),_c("option",{attrs:{value:"GHA"}},[_vm._v("Ground Handling Agent GHA")]),_vm._v(" "),_c("option",{attrs:{value:"PTT"}},[_vm._v("Post Office PTT")]),_vm._v(" "),_c("option",{attrs:{value:"SHP"}},[_vm._v("Shipper SHP")]),_vm._v(" "),_c("option",{attrs:{value:"TRK"}},[_vm._v("Trucker TRK")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Participant Code:")])])];},proxy:true}],null,false,1003838827)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.participant_code,callback:function callback($$v){_vm.$set(_vm.agent_information,"participant_code",$$v);},expression:"agent_information.participant_code"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"150px"}},[_c("span",[_vm._v("Office File Reference:")])])];},proxy:true}],null,false,3658579412)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.office_file_reference,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_file_reference",$$v);},expression:"agent_information.office_file_reference"}})],1)],1):_vm._e(),_vm._v(" "),_vm.agent_information.participate==="1"?_c("div",[_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Airport:")])])];},proxy:true}],null,false,991607196)},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"250px"},model:{value:_vm.agent_information.office_airport,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_airport",$$v);},expression:"agent_information.office_airport"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"BLR"}},[_vm._v("BLR, Bangalore (BLR), India")]),_vm._v(" "),_c("option",{attrs:{value:"AAE"}},[_vm._v("AAE, Annaba (AAE), Algeria")]),_vm._v(" "),_c("option",{attrs:{value:"AAH"}},[_vm._v("AAH, Aachen (AAH), Germany")])])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Function Designator:")])])];},proxy:true}],null,false,3374126151)},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_function_designator,expression:"agent_information.office_function_designator"}],staticClass:"form-control",staticStyle:{width:"250px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_function_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_function_designator",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office Company Designator:")])])];},proxy:true}],null,false,4157542050)},[_vm._v(" "),_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.agent_information.office_company_designator,expression:"agent_information.office_company_designator"}],staticClass:"form-control",staticStyle:{width:"250px"},attrs:{type:"text"},domProps:{value:_vm.agent_information.office_company_designator},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.agent_information,"office_company_designator",$event.target.value);}}})]),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"165px"}},[_c("span",[_vm._v("Office File Reference:")])])];},proxy:true}],null,false,1672574578)},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.agent_information.office_file_reference,callback:function callback($$v){_vm.$set(_vm.agent_information,"office_file_reference",$$v);},expression:"agent_information.office_file_reference"}})],1)],1):_vm._e()])],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Also Notify"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Also Notify")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"d-flex align-items-center"},[_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-notify"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Name:")])])];},proxy:true}])},[_vm._v(" "),_c("div",{ref:"dropdownContainer_alsoNotify",staticClass:"align-items-center custom-dropdown mr-4",on:{click:function click($event){return _vm.toggleDropdown("alsoNotify");}}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.form.also_notify_address.also_name,expression:"form.also_notify_address.also_name"}],staticClass:"form-control-sm form-control","class":{"is-invalid":_vm.form.errors.has("also_name")},staticStyle:{width:"315px"},attrs:{type:"text",placeholder:"Search name",id:"also_notify",autocomplete:"off"},domProps:{value:_vm.form.also_notify_address.also_name},on:{input:[function($event){if($event.target.composing)return;_vm.$set(_vm.form.also_notify_address,"also_name",$event.target.value);},_vm.filteralsoNotify],focus:function focus($event){return _vm.toggleDropdown("alsoNotify",true);}}}),_vm._v(" "),_vm.activeDropdown==="alsoNotify"&&_vm.filteredAlsoNotify.length?_c("div",{staticClass:"dropdown-options"},_vm._l(_vm.filteredAlsoNotify,function(also_notify,index){return _c("div",{key:also_notify.id,staticClass:"option",on:{click:function click($event){$event.stopPropagation();return _vm.selectAlsoNotifyA(also_notify);}}},[_vm._v("\n                                                                                        "+_vm._s(also_notify.name)+"\n                                                                                    ")]);}),0):_vm._e()]),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Letter Of Credit")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_name_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_name_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_name_2",$$v);},expression:"form.also_notify_address.also_name_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_name_2"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address",$$v);},expression:"form.also_notify_address.also_address"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_address_line_2")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_address_line_2,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_address_line_2",$$v);},expression:"form.also_notify_address.also_address_line_2"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_address_line_2"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("City:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-5","class":{"is-invalid":_vm.form.errors.has("also_city")},staticStyle:{width:"250px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_city,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_city",$$v);},expression:"form.also_notify_address.also_city"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_city"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_airport_code")},staticStyle:{width:"50px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_airport_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_airport_code",$$v);},expression:"form.also_notify_address.also_airport_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_airport_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Post Code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_post_code")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_post_code,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_post_code",$$v);},expression:"form.also_notify_address.also_post_code"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_post_code"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_state")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_state,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_state",$$v);},expression:"form.also_notify_address.also_state"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_state"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Country:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_country")},staticStyle:{width:"315px"},model:{value:_vm.form.also_notify_address.also_country,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_country",$$v);},expression:"form.also_notify_address.also_country"}},[_c("option",{attrs:{value:""}},[_vm._v("Please select one")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                                "+_vm._s(country.text)+"\n                                                                            ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_country"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Phone:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_phone")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_phone,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_phone",$$v);},expression:"form.also_notify_address.also_phone"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_phone"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Fax:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("also_fax")},staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_fax,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_fax",$$v);},expression:"form.also_notify_address.also_fax"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"also_fax"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v("Telex:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.also_notify_address.also_telex,callback:function callback($$v){_vm.$set(_vm.form.also_notify_address,"also_telex",$$v);},expression:"form.also_notify_address.also_telex"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex justify-content-end align-items-center",staticStyle:{width:"80px"}},[_c("span",[_vm._v(" ")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"},model:{value:_vm.form.is_also_notify_address_save,callback:function callback($$v){_vm.$set(_vm.form,"is_also_notify_address_save",$$v);},expression:"form.is_also_notify_address_save"}},[_vm._v(" Save new address to address book")])],1)],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Exta Print Information"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Extra information printed of Air Way Bill (Only printed - not saved or sent\n                                                            to Airlines):")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-textarea",{staticStyle:{width:"500px",height:"80px"},attrs:{id:"textarea"},model:{value:_vm.form.custom_origin.extra_print,callback:function callback($$v){_vm.$set(_vm.form.custom_origin,"extra_print",$$v);},expression:"form.custom_origin.extra_print"}})],1)],1)],1)])]),_vm._v(" "),_c("b-tab",{attrs:{title:"Carrier Address"}},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Override the Carrier Address on the PDF Document")]),_vm._v(" "),_c("h6",{staticStyle:{"font-size":"12px","font-weight":"500"}},[_vm._v("(This can be used for non-IATA carriers)")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"auto"}},[_c("div",{staticClass:"align-items-center mt-5"},[_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{staticClass:"mr-4",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Carrier Name:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-checkbox",{attrs:{size:"sm"}},[_vm._v("Public Address")])],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Carrier Prefix:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Address:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"315px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-center",staticStyle:{"margin-bottom":"4px !important"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("City:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm mr-4",staticStyle:{width:"230px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"60px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Pin code:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("State:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"}})],1),_vm._v(" "),_c("b-form-group",{staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center justify-content-end",staticStyle:{width:"100px"}},[_c("span",[_vm._v("Country:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal"}})],1)],1)])],1)],1)])])],1)],1)])],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-5"},[_c("div",{staticClass:"ml-3 mt-8"},[_c("h6",{staticClass:"h-color"},[_vm._v("Other Charges:")]),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm other-charges-entry-table",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Code")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v("Amount In INR")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")]),_vm._v(" "),_c("th",{},[_vm._v(" ")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-5 editable-cell align-items-center",staticStyle:{width:"300px","vertical-align":"middle"}},[_c("b-form-group",{staticClass:"d-flex align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm",model:{value:_vm.other_charges.other_charge_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_charge_code",$$v);},expression:"other_charges.other_charge_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select an Other Charge Code")]),_vm._v(" "),_vm._l(_vm.other_charges_code,function(charge){return _c("option",{key:charge.value,domProps:{value:charge.value}},[_vm._v("\n                                                                         "+_vm._s(charge.text)+"\n                                                                     ")]);})],2)],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"d-flex align-items-center"},[_c("span",[_vm._v("Or:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"40px"},attrs:{id:"input-horizontal",placeholder:"Or code"},model:{value:_vm.other_charges.other_code,callback:function callback($$v){_vm.$set(_vm.other_charges,"other_code",$$v);},expression:"other_charges.other_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"80px"},attrs:{placeholder:"Amount"},model:{value:_vm.other_charges.amount,callback:function callback($$v){_vm.$set(_vm.other_charges,"amount",$$v);},expression:"other_charges.amount"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"A"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Agent")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"due",size:"sm",value:"C"},model:{value:_vm.other_charges.due,callback:function callback($$v){_vm.$set(_vm.other_charges,"due",$$v);},expression:"other_charges.due"}},[_vm._v("Due Carrier")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"P"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Prepaid")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell charge-radio-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-form-radio",{attrs:{name:"payment_type",size:"sm",value:"C"},model:{value:_vm.other_charges.payment_type,callback:function callback($$v){_vm.$set(_vm.other_charges,"payment_type",$$v);},expression:"other_charges.payment_type"}},[_vm._v("Collect")])],1)],1),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell align-items-center charge-btn-cell",staticStyle:{"vertical-align":"middle"}},[_c("b-form-group",{staticClass:"align-items-center",attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.addCharge}},[_vm._v("\n                                                                         "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                     ")])],1)],1)])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Calculated Charges")]),_vm._v(" "),_c("th",{}),_vm._v(" "),_c("th",{})])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"pt-5 editable-cell",staticStyle:{"vertical-align":"middle"}},[_vm._v("Chargeable Weight")]),_vm._v(" "),_c("td",{staticClass:"pt-5 editable-cell"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.chargable_weight1,expression:"other_charges.chargable_weight1"}],staticClass:"form-control",staticStyle:{width:"100px","vertical-align":"middle"},attrs:{type:"text"},domProps:{value:_vm.other_charges.chargable_weight1},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"chargable_weight1",$event.target.value);}}})])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell",staticStyle:{"vertical-align":"middle"}},[_vm._v("Charge")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{"vertical-align":"middle"}},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.other_charges.charge,expression:"other_charges.charge"}],staticClass:"form-control",staticStyle:{width:"100px","vertical-align":"middle"},attrs:{type:"text"},domProps:{value:_vm.other_charges.charge},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.other_charges,"charge",$event.target.value);}}})]),_vm._v(" "),_c("td",{staticClass:"editable-cell mb-2",staticStyle:{"vertical-align":"middle"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.calculateCharge}},[_vm._v("Calculate")])],1)])])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-8"},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{"background-color":"#F2F9FF"}},[_c("th",{},[_vm._v("Code")]),_vm._v(" "),_c("th",{},[_vm._v("Due")]),_vm._v(" "),_c("th",{},[_vm._v("Amount")]),_vm._v(" "),_c("th",{},[_vm._v("Type Of Payment")]),_vm._v(" "),_c("th",{},[_vm._v("Actions")])])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.charges,function(charge,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.other_charge_code||charge.other_code)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.due)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.amount)+".00\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("\n                                                                    "+_vm._s(charge.payment_type)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.editCharge(index);}}},[_c("b-icon",{attrs:{icon:"pencil","font-scale":"1"}})],1),_vm._v(" "),_c("b-button",{staticStyle:{background:"none !important",border:"0px !important","border-radius":"0px !important",padding:"0px !important"},attrs:{size:"sm"},on:{click:function click($event){return _vm.removeCharge(index);}}},[_c("b-icon",{attrs:{icon:"trash"}})],1)],1)]);}),0)])])])])],1)],1)])]),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7"},[_c("b-tabs",{staticClass:"custom-nav"},[_c("b-tab",{attrs:{title:"Payment Information"}},[_c("b-row",[_c("b-col",{staticClass:"mb-6 mb-md-0 mb-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex align-items-center ml-3 mt-6",staticStyle:{"justify-content":"space-between","margin-bottom":"4px !important"}},[_c("div",{staticStyle:{"float":"left"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal",label:"Type Of Payment:"}},[_c("b-form-select",{staticClass:"form-control-sm",staticStyle:{width:"205px"},model:{value:_vm.form.payment_info.type_of_payment,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"type_of_payment",$$v);},expression:"form.payment_info.type_of_payment"}},[_c("option",{attrs:{value:""}},[_vm._v(" Please select one")]),_vm._v(" "),_c("option",{attrs:{value:"CA"}},[_vm._v("CA - Partial collect credit - partial prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"CB"}},[_vm._v("CB - Partial collect credit - partial prepaid credit")]),_vm._v(" "),_c("option",{attrs:{value:"CC"}},[_vm._v("CC - All charges collect")]),_vm._v(" "),_c("option",{attrs:{value:"CG"}},[_vm._v("CG - All Charges collect by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"CP"}},[_vm._v("CP - Destination collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"CX"}},[_vm._v("CX - Destination collect credit")]),_vm._v(" "),_c("option",{attrs:{value:"NC"}},[_vm._v("NC - Service rate. No charge")]),_vm._v(" "),_c("option",{attrs:{value:"PC"}},[_vm._v("PC - Partial prepaid cash - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PD"}},[_vm._v("PD - Partial prepaid credit - partial collect cash")]),_vm._v(" "),_c("option",{attrs:{value:"PG"}},[_vm._v("PG - All charges prepaid by GBL")]),_vm._v(" "),_c("option",{attrs:{value:"PP"}},[_vm._v("PP - All charges prepaid cash")]),_vm._v(" "),_c("option",{attrs:{value:"PX"}},[_vm._v("PX - All charges prepaid credit")])])],1)],1),_vm._v(" "),_c("div",{staticStyle:{"float":"right"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex"},[_c("span",[_vm._v("Currency:")]),_vm._v(" "),_c("span",{staticStyle:{color:"red"}},[_vm._v("*")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("currency")},staticStyle:{width:"60px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.currency,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"currency",$$v);},expression:"form.payment_info.currency"}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"currency"}})],1)],1)]),_vm._v(" "),_c("div",{staticClass:"ml-3 mt-4 mb-4"},[_c("h6",{staticStyle:{"font-size":"13px","font-weight":"400"}},[_vm._v("Declared Values For:")])]),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Carriage:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_carriage,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_carriage",$$v);},expression:"form.payment_info.declear_value_carriage"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Customs:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_customs,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_customs",$$v);},expression:"form.payment_info.declear_value_customs"}})],1),_vm._v(" "),_c("b-form-group",{staticClass:"ml-3",staticStyle:{"margin-bottom":"4px !important"},attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex",staticStyle:{width:"60px"}},[_c("span",[_vm._v("Insurance:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"200px"},attrs:{id:"input-horizontal"},model:{value:_vm.form.payment_info.declear_value_insurance,callback:function callback($$v){_vm.$set(_vm.form.payment_info,"declear_value_insurance",$$v);},expression:"form.payment_info.declear_value_insurance"}})],1)],1),_vm._v(" "),_c("b-col",{staticClass:"mt-6 mt-md-0 mt-lg-0",attrs:{cols:"12",md:"6"}},[_c("div",{staticClass:"d-flex justify-content-end"},[_c("div",{staticClass:"table-responsive"},[_c("table",{staticClass:"table table-sm"},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Code")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px"}},[_vm._v("Prepaid")]),_vm._v(" "),_c("th",{staticStyle:{color:"#4C4C4C","font-weight":"400","font-size":"12px",padding:"5px",width:"100px"}},[_vm._v("Collect")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Weight Charge (WT)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.prepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalCharges.collect)+" INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Taxes (TX)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.taxes.toFixed(2))+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v("0.00 INR")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Agent (OA)")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentPrepaid)+" INR\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueAgentCollect)+" INR\n                                                                ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Other Charges Due Carrier (OC)\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierPrepaid)+" INR\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalDueCarrierCollect)+" INR\n                                                                ")])]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell"},[_vm._v("Total Charges")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChargesPrepaid)+" INR")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(_vm.totalChrage)+" INR")])])])])])])])],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Special Handling Codes"}},[_c("b-row",[_c("div",{staticClass:"d-flex mt-6 ml-3"},[_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("special_handling_code")},staticStyle:{width:"430px"},model:{value:_vm.selectedCode,callback:function callback($$v){_vm.selectedCode=$$v;},expression:"selectedCode"}},[_c("option",{attrs:{disabled:"",value:""}},[_vm._v("Select Special Handling Codes")]),_vm._v(" "),_vm._l(_vm.codes,function(code){return _c("option",{key:code.value,domProps:{value:code.value}},[_vm._v(_vm._s(code.text))]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"special_handling_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","content-cols-sm":"","content-cols-lg":"auto","label-for":"input-horizontal"},scopedSlots:_vm._u([{key:"label",fn:function fn(){return[_c("div",{staticClass:"align-items-center d-flex"},[_c("span",[_vm._v("Or:")])])];},proxy:true}])},[_vm._v(" "),_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"60px"},attrs:{id:"input-horizontal"},model:{value:_vm.custom_special_handling_code,callback:function callback($$v){_vm.custom_special_handling_code=$$v;},expression:"custom_special_handling_code"}})],1)],1),_vm._v(" "),_c("b-col",{attrs:{cols:"auto"}},[_c("b-form-group",{attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",attrs:{id:"input-horizontal",type:"button"},on:{click:_vm.addManualCode}},[_vm._v("Add")])],1)],1)],1)]),_vm._v(" "),_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"d-flex align-items-start py-7"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("td",{staticClass:"editable-cell",staticStyle:{padding:"5px","font-size":"12px","font-weight":"400"}},[_vm._v("Code")]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{padding:"5px","font-size":"12px","font-weight":"400"}})])]),_vm._v(" "),_c("tbody",_vm._l(_vm.form.tableCodes,function(code,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(code))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteSplCode(index);}}})],1)]);}),0)])])])],1)],1),_vm._v(" "),_c("b-tab",{attrs:{title:"Other Customs Information"}},[_c("b-row",[_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-6"},[_c("h6",{staticClass:"h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Other Customs Information:")]),_vm._v(" "),_c("div",{staticClass:"d-flex align-items-start py-5"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"100%"}},[_c("thead",[_c("tr",{staticStyle:{background:"#F2F9FF"}},[_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Country Code:")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Information Identifier:")]),_vm._v(" "),_c("th",{staticClass:"form-control1",staticStyle:{padding:"4px 12px","font-size":"12px","font-weight":"400"}},[_vm._v("Customs Information Identifier")])])]),_vm._v(" "),_c("tbody",[_c("tr",[_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("country_code")},model:{value:_vm.oci_info.country_code,callback:function callback($$v){_vm.$set(_vm.oci_info,"country_code",$$v);},expression:"oci_info.country_code"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a country")]),_vm._v(" "),_vm._l(_vm.countries,function(country){return _c("option",{key:country.value,domProps:{value:country.value}},[_vm._v("\n                                                                                    "+_vm._s(country.text)+"\n                                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"country_code"}})],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("info_identifier")},model:{value:_vm.oci_info.info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"info_identifier",$$v);},expression:"oci_info.info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_identifiers.identifiers,function(oci_option){return _c("option",{key:oci_option.value,domProps:{value:oci_option.value}},[_vm._v("\n                                                                                    "+_vm._s(oci_option.text)+"\n                                                                                ")]);}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"info_identifier"}})],2)],1)],1),_vm._v(" "),_c("td",{staticClass:"editable-cell py-4"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label",staticStyle:{width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-form-select",{staticClass:"form-control-sm","class":{"is-invalid":_vm.form.errors.has("custom_info_identifier")},model:{value:_vm.oci_info.custom_info_identifier,callback:function callback($$v){_vm.$set(_vm.oci_info,"custom_info_identifier",$$v);},expression:"oci_info.custom_info_identifier"}},[_c("option",{attrs:{value:""}},[_vm._v("Select a code")]),_vm._v(" "),_vm._l(_vm.oci_data.oci_custom_info_identifier,function(oci_options){return _c("option",{key:oci_options.value,domProps:{value:oci_options.value}},[_vm._v("\n                                                                                    "+_vm._s(oci_options.text)+"\n                                                                                ")]);})],2),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"custom_info_identifier"}})],1)],1)]),_vm._v(" "),_c("tr",[_c("td",{staticClass:"editable-cell px-5"},[_vm._v("Supplementary Information:")]),_vm._v(" "),_c("td",{staticClass:"editable-cell px-4"},[_c("input",{directives:[{name:"model",rawName:"v-model",value:_vm.oci_info.supplementary_info,expression:"oci_info.supplementary_info"}],staticClass:"form-control","class":{"is-invalid":_vm.form.errors.has("supplementary_info")},staticStyle:{width:"300px"},attrs:{type:"text"},domProps:{value:_vm.oci_info.supplementary_info},on:{input:function input($event){if($event.target.composing)return;_vm.$set(_vm.oci_info,"supplementary_info",$event.target.value);}}}),_vm._v(" "),_c("has-error",{attrs:{form:_vm.form,field:"supplementary_info"}})],1),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_c("b-form-group",{staticClass:"form-control-sm col-form-label align-items-end justify-content-end",staticStyle:{display:"flex",width:"240px"},attrs:{id:"fieldset-horizontal"}},[_c("b-button",{staticClass:"show-btn px-5",on:{click:_vm.addOtherCustomInfo}},[_vm._v("\n                                                                                "+_vm._s(_vm.editIndex!==null?"Update":"Add")+"\n                                                                            ")])],1)],1)])])])])])]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-4"},[_c("h6",{staticClass:"mb-4 h-color",staticStyle:{"font-size":"15px","font-weight":"500"}},[_vm._v("Upload Other Customs Information:")]),_vm._v(" "),_c("b-form-textarea",{staticStyle:{width:"1000px !important",height:"80px"},attrs:{id:"textarea"}})],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-3 d-flex justify-content-end",staticStyle:{"max-width":"1000px"}},[_c("b-button",{staticClass:"show-btn px-5"},[_vm._v("Upload")])],1)]),_vm._v(" "),_c("b-col",{attrs:{cols:"12"}},[_c("div",{staticClass:"ml-3 mt-6"},[_c("table",{staticClass:"table table-sm",staticStyle:{"max-width":"40%"}},[_c("tbody",[_c("tr",[_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v("Other Customs\n                                                                    Information")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")]),_vm._v(" "),_c("th",{staticStyle:{background:"#F2F9FF","font-size":"13px","font-weight":"400"}},[_vm._v(" ")])]),_vm._v(" "),_vm._l(_vm.form.oci_entries,function(row,index){return _c("tr",{key:index},[_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.country_code)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.info_identifier)+"\n                                                                ")]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.custom_info_identifier))]),_vm._v(" "),_c("td",{staticClass:"editable-cell"},[_vm._v(_vm._s(row.supplementary_info))]),_vm._v(" "),_c("td",{staticClass:"editable-cell",staticStyle:{display:"flex","align-items":"center","justify-content":"space-between",width:"100%"}},[_c("b-icon",{staticClass:"mr-2",staticStyle:{cursor:"pointer"},attrs:{icon:"pencil","font-scale":"1"},on:{click:function click($event){return _vm.editOciInfo(index);}}}),_vm._v(" "),_c("b-icon",{attrs:{icon:"trash","font-scale":"1"},on:{click:function click($event){return _vm.deleteOciInfo(index);}}})],1)]);})],2)])])])],1)],1)],1)],1),_vm._v(" "),_c("hr",{staticClass:"hr"}),_vm._v(" "),_c("div",{staticClass:"py-7 bottom-email-section"},[_c("b-row",{staticClass:"justify-content-end"},[_c("b-col",{staticClass:"text-right mobile-text-left",attrs:{cols:"12",md:"auto"}},[_c("div",{staticClass:"d-flex justify-content-end mobile-justify-start mb-2"},[_c("b-form-checkbox",{staticClass:"premium-checkbox",attrs:{size:"sm"}},[_vm._v("Including Cargo Label")])],1),_vm._v(" "),_c("b-form-group",{staticClass:"form-control-sm col-form-label mb-0",attrs:{id:"fieldset-horizontal","label-cols-lg":"auto","label-for":"input-horizontal",label:"Email FNA:"}},[_c("b-form-input",{staticClass:"form-control-sm",staticStyle:{width:"300px"},attrs:{id:"input-horizontal",placeholder:"Separate addresses with a semicolon ';'"},model:{value:_vm.form.awb_email,callback:function callback($$v){_vm.$set(_vm.form,"awb_email",$$v);},expression:"form.awb_email"}})],1)],1)],1)],1),_vm._v(" "),_c("div",{staticClass:"py-10"},[_vm.pdf_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.pdf_error_msg)}})]):_vm._e(),_vm._v(" "),_vm.showSpinner?_c("div",{staticClass:"spin",staticStyle:{"margin-top":"20px"}}):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-between"},[_vm.is_generate_pdf?_c("div",{staticClass:"mb-24",staticStyle:{"box-shadow":"0px 3px 15px 0px #0013","border-radius":"12px",width:"100%"}},[_c("div",{staticStyle:{display:"flex",width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{display:"flex","justify-content":"start",color:"#355594","font-size":"15px","line-height":"71px","font-weight":"500",width:"100%"}},[_vm._v("Cargo document created")]),_vm._v(" "),_c("div",{staticStyle:{display:"flex","justify-content":"end","line-height":"71px","align-self":"center",width:"100%"},on:{click:function click($event){return _vm.isGeneratePdf(_vm.generateButton=0);}}},[_c("img",{staticStyle:{width:"24px",height:"24px",cursor:"pointer"},attrs:{src:"/media/assets/ui/cross.png",alt:"cross button"}})])]),_vm._v(" "),_c("div",{staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("div",{staticStyle:{width:"100%"}},[_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"13px","font-weight":"400",margin:"0"}},[_vm._v("Airway bill message saved in database")]),_vm._v(" "),_c("p",{staticStyle:{color:"#4C4C4C","font-size":"13px","line-height":"18px","font-weight":"400","border-bottom":"1px solid #CDCDCD","padding-bottom":"15px"}},[_vm._v("PDF documents prepared")])])]),_vm._v(" "),_c("div",{staticClass:"mb-16",staticStyle:{width:"96%","margin-left":"2%","margin-right":"2%"}},[_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("e-AWB Pdf file")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-multiple-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage e-AWB Pdf")])]),_vm._v(" "),_c("a",{staticClass:"custom-link mb-0",staticStyle:{width:"fit-content"},attrs:{href:"#"},on:{click:function click(){return _vm.handleSaveAndGeneratePDF("download-multiple-both-page-awb-pdf");}}},[_c("p",{staticClass:"mb-0 ml-2"},[_vm._v("Multipage e-AWB Pdf with back pages")])])])]):_vm._e()]),_vm._v(" "),_vm.main_error_msg?_c("div",{staticClass:"text-danger text-right mb-3"},[_c("div",{domProps:{innerHTML:_vm._s(_vm.main_error_msg)}})]):_vm._e(),_vm._v(" "),_vm.successMessage?_c("div",{staticStyle:{"font-weight":"bold",display:"flex","justify-content":"flex-end","text-align":"right"}},[_c("span",[_vm._v("\n                                        "+_vm._s(_vm.successMessage.split("-Pass")[0])+"\n                                        "),_c("span",{staticStyle:{color:"green"}},[_vm._v("-Pass")])])]):_vm._e(),_vm._v(" "),_c("div",{staticClass:"d-flex justify-content-end submit-button"},[_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"button"},on:{click:function click($event){_vm.isGeneratePdf(_vm.generateButton=1);_vm.form.status="generate_pdf";}}},[_vm._v("Generate PDF")]),_vm._v(" "),_vm.current_user.can_send?_c("div",[_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send")]),_vm._v(" "),_c("b-button",{staticClass:"show-btn mr-2",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="send";}}},[_vm._v("Send & Clear")])],1):_vm._e(),_vm._v(" "),_vm.form.first_box.status!="send"?_c("div",[_c("b-button",{staticClass:"show-btn",attrs:{type:"submit"},on:{click:function click($event){_vm.form.status="draft";}}},[_vm._v(_vm._s(_vm.submitButtonText))])],1):_vm._e()],1)])],1)])]],2)],1)]);};var staticRenderFns=[];render._withStripped=true;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
      "min-width": "0"
    }
  }, [_c("div", {
    staticClass: "container py-8 px-6 px-sm-8 px-md-10 font-outfit"
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-8"
  }, [_c("div", {
    staticClass: "d-flex flex-column"
  }, [_c("span", {
    staticStyle: {
      "text-transform": "uppercase",
      "letter-spacing": "2px",
      "font-size": "0.85rem",
      "font-weight": "700",
      color: "#355594",
      opacity: "0.6",
      "margin-bottom": "0.5rem",
      display: "block"
    }
  }, [_vm._v("Air Import")]), _vm._v(" "), _c("h6", {
    staticClass: "d-flex align-items-center",
    staticStyle: {
      color: "#355594",
      "font-size": "26px !important",
      "line-height": "34px !important",
      "font-weight": "800 !important",
      "letter-spacing": "-0.5px !important",
      "margin-bottom": "0.5rem",
      "font-family": "'Inter', sans-serif !important"
    }
  }, [_c("b-icon", {
    staticClass: "mr-3",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "airplane-engines"
    }
  }), _vm._v("\n        Import Consol Manager\n      ")], 1), _vm._v(" "), _c("span", {
    staticStyle: {
      color: "#5A6B8A",
      "font-size": "0.9rem"
    }
  }, [_vm._v("Manage inbound flights, consolidate HAWBs, coordinate customs filings, and issue delivery orders")])]), _vm._v(" "), _c("div", {
    staticClass: "d-flex align-items-center gap-2"
  }, [_c("OcrUploadModal", {
    attrs: {
      "is-drawer": _vm.isDrawer,
      category: "focus_air_import"
    },
    on: {
      extracted: _vm.processImportExtractedData
    }
  }), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    on: {
      click: _vm.loadDemoConsol
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-warning",
    attrs: {
      icon: "lightning-fill"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Load Demo")])], 1), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    on: {
      click: _vm.resetForm
    }
  }, [_c("b-icon", {
    staticClass: "mr-2 text-danger",
    attrs: {
      icon: "arrow-counterclockwise"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Reset")])], 1), _vm._v(" "), _c("router-link", {
    staticClass: "show-btn text-decoration-none",
    attrs: {
      to: "/inbox"
    }
  }, [_c("b-icon", {
    staticClass: "mr-2",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "arrow-left"
    }
  }), _c("b", {
    staticClass: "font-weight-bolder",
    staticStyle: {
      "font-size": "1.05rem"
    }
  }, [_vm._v("Back to Inbox")])], 1)], 1)]), _vm._v(" "), _vm.form.execution_job_no || _vm.form.shipping_details.flight_number ? _c("div", {
    staticClass: "mbl-summary-banner p-5 mb-6 rounded-lg animate-fade-in d-flex flex-column flex-md-row justify-content-between align-items-md-center"
  }, [_c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-4"
  }, [_c("div", {
    staticClass: "px-4 py-2 border-right-premium mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Consol Job / Enquiry No")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value text-indigo font-weight-bold mb-0",
    staticStyle: {
      color: "#355594 !important"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.form.execution_job_no || "DRAFT") + "\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v(_vm._s(_vm.form.consol_type))])]), _vm._v(" "), _c("div", {
    staticClass: "px-4 py-2 border-right-premium mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Flight Details")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value mb-0 font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.form.shipping_details.flight_number || "TBD") + "\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("Carrier: " + _vm._s(_vm.form.shipping_details.carrier_name || "TBD"))])]), _vm._v(" "), _c("div", {
    staticClass: "px-4 py-2 border-right-premium mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Route")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value mb-0 font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.form.routing.departure_airport || "TBD") + " ➔ " + _vm._s(_vm.form.routing.destination_airport || "TBD") + "\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("ETA: " + _vm._s(_vm.formatDateTime(_vm.form.shipping_details.eta_datetime)))])]), _vm._v(" "), _c("div", {
    staticClass: "px-4 py-2 mb-2 mb-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Payload Totals")]), _vm._v(" "), _c("h5", {
    staticClass: "banner-value mb-0 font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v("\n          " + _vm._s(_vm.formatWeight(_vm.form.packing.gross_weight)) + " KGS / " + _vm._s(_vm.form.packing.piece_count) + " PCS\n        ")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("Vol: " + _vm._s(_vm.formatVol(_vm.form.packing.volume_cbm)) + " CBM / Chg Wt: " + _vm._s(_vm.formatWeight(_vm.form.packing.chargeable_weight)) + " KGS")])])]), _vm._v(" "), _c("div", {
    staticClass: "text-right d-flex flex-column align-items-end mt-3 mt-md-0"
  }, [_c("span", {
    staticClass: "banner-label"
  }, [_vm._v("Consol Owner")]), _vm._v(" "), _c("span", {
    staticClass: "badge badge-light-primary px-3 py-2 mt-1"
  }, [_vm._v(_vm._s(_vm.getOwnerName(_vm.form.job_owner_id)))])])]) : _vm._e(), _vm._v(" "), _vm.successMsg ? _c("div", {
    staticClass: "alert alert-custom alert-light-success mb-6 shadow-sm animate-fade-in"
  }, [_c("div", {
    staticClass: "alert-icon"
  }, [_c("i", {
    staticClass: "fas fa-check-circle text-success"
  })]), _vm._v(" "), _c("div", {
    staticClass: "alert-text font-weight-bold"
  }, [_vm._v(_vm._s(_vm.successMsg))])]) : _vm._e(), _vm._v(" "), _vm.validationWarning ? _c("div", {
    staticClass: "alert alert-custom alert-light-warning mb-6 shadow-sm animate-fade-in"
  }, [_c("div", {
    staticClass: "alert-icon"
  }, [_c("b-icon", {
    staticClass: "text-warning",
    attrs: {
      icon: "exclamation-triangle-fill"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "alert-text font-weight-bold"
  }, [_vm._v(_vm._s(_vm.validationWarning))])]) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6 mb-6"
  }, [_c("h4", {
    staticClass: "h-color mb-5 d-flex align-items-center"
  }, [_c("b-icon", {
    staticClass: "mr-3",
    staticStyle: {
      color: "#355594"
    },
    attrs: {
      icon: "info-circle"
    }
  }), _vm._v(" Consolidation Core Parameters\n    ")], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol No *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    "class": {
      "border-warning-premium": _vm.form.execution_job_no && _vm.form.execution_job_no.length > 30
    },
    attrs: {
      required: "",
      placeholder: "e.g. JOBA-26-9028"
    },
    model: {
      value: _vm.form.execution_job_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "execution_job_no", $$v);
      },
      expression: "form.execution_job_no"
    }
  }), _vm._v(" "), _vm.form.execution_job_no && _vm.form.execution_job_no.length > 30 ? _c("span", {
    staticClass: "text-warning small"
  }, [_vm._v("Max 30 characters limit.")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "3"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Planned Clearance Date *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "date",
      required: ""
    },
    model: {
      value: _vm.form.planned_clearance_date,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "planned_clearance_date", $$v);
      },
      expression: "form.planned_clearance_date"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "2"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Cargo Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.cargoTypeOptions
    },
    model: {
      value: _vm.form.cargo_type,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "cargo_type", $$v);
      },
      expression: "form.cargo_type"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "2"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Owner *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.ownerOptions,
      required: ""
    },
    model: {
      value: _vm.form.job_owner_id,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "job_owner_id", $$v);
      },
      expression: "form.job_owner_id"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "2"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Type",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.consolTypeOptions
    },
    model: {
      value: _vm.form.consol_type,
      callback: function callback($$v) {
        _vm.$set(_vm.form, "consol_type", $$v);
      },
      expression: "form.consol_type"
    }
  })], 1)], 1)], 1)], 1), _vm._v(" "), _c("b-card", {
    staticClass: "bg-transparent border-0",
    attrs: {
      "no-body": ""
    }
  }, [_c("b-tabs", {
    staticClass: "custom-nav-tabs",
    attrs: {
      "content-class": "mt-6"
    }
  }, [_c("b-tab", {
    attrs: {
      active: ""
    },
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "people"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Entity Details")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "entity-card p-5 rounded-lg h-100"
  }, [_c("h6", {
    staticClass: "h-color mb-4 d-flex align-items-center"
  }, [_c("span", {
    staticClass: "badge badge-light-indigo mr-2"
  }, [_vm._v("1")]), _vm._v(" Origin Agent\n              ")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Search Origin Agent",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.originAgentOptions
    },
    on: {
      change: _vm.onOriginAgentSelect
    },
    model: {
      value: _vm.selectedOriginAgent,
      callback: function callback($$v) {
        _vm.selectedOriginAgent = $$v;
      },
      expression: "selectedOriginAgent"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Agent Address Blocks (Cargo-XML 35 Chars/Line)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    "class": {
      "border-warning-premium": _vm.hasAddressLineOverrun(_vm.form.entities.origin_agent.address)
    },
    attrs: {
      rows: "5",
      placeholder: "Enter full address details..."
    },
    model: {
      value: _vm.form.entities.origin_agent.address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.entities.origin_agent, "address", $$v);
      },
      expression: "form.entities.origin_agent.address"
    }
  }), _vm._v(" "), _vm.hasAddressLineOverrun(_vm.form.entities.origin_agent.address) ? _c("div", {
    staticClass: "text-warning-premium small mt-1"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n                  Line exceeds 35 character limits! (Cargo-XML transmission standard)\n                ")], 1) : _vm._e()], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "entity-card p-5 rounded-lg h-100"
  }, [_c("h6", {
    staticClass: "h-color mb-4 d-flex align-items-center"
  }, [_c("span", {
    staticClass: "badge badge-light-indigo mr-2"
  }, [_vm._v("2")]), _vm._v(" Destination Agent\n              ")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Search Destination Agent",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.destAgentOptions
    },
    on: {
      change: _vm.onDestAgentSelect
    },
    model: {
      value: _vm.selectedDestAgent,
      callback: function callback($$v) {
        _vm.selectedDestAgent = $$v;
      },
      expression: "selectedDestAgent"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Agent Address Blocks (Cargo-XML 35 Chars/Line)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    "class": {
      "border-warning-premium": _vm.hasAddressLineOverrun(_vm.form.entities.dest_agent.address)
    },
    attrs: {
      rows: "5",
      placeholder: "Enter full address details..."
    },
    model: {
      value: _vm.form.entities.dest_agent.address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.entities.dest_agent, "address", $$v);
      },
      expression: "form.entities.dest_agent.address"
    }
  }), _vm._v(" "), _vm.hasAddressLineOverrun(_vm.form.entities.dest_agent.address) ? _c("div", {
    staticClass: "text-warning-premium small mt-1"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n                  Line exceeds 35 character limits! (Cargo-XML transmission standard)\n                ")], 1) : _vm._e()], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "entity-card p-5 rounded-lg h-100"
  }, [_c("h6", {
    staticClass: "h-color mb-4 d-flex align-items-center"
  }, [_c("span", {
    staticClass: "badge badge-light-indigo mr-2"
  }, [_vm._v("3")]), _vm._v(" Selling Agent\n              ")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Search Selling Agent",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.sellingAgentOptions
    },
    on: {
      change: _vm.onSellingAgentSelect
    },
    model: {
      value: _vm.selectedSellingAgent,
      callback: function callback($$v) {
        _vm.selectedSellingAgent = $$v;
      },
      expression: "selectedSellingAgent"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Agent Address Blocks (Cargo-XML 35 Chars/Line)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-textarea", {
    staticClass: "premium-textarea",
    "class": {
      "border-warning-premium": _vm.hasAddressLineOverrun(_vm.form.entities.selling_agent.address)
    },
    attrs: {
      rows: "5",
      placeholder: "Enter full address details..."
    },
    model: {
      value: _vm.form.entities.selling_agent.address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.entities.selling_agent, "address", $$v);
      },
      expression: "form.entities.selling_agent.address"
    }
  }), _vm._v(" "), _vm.hasAddressLineOverrun(_vm.form.entities.selling_agent.address) ? _c("div", {
    staticClass: "text-warning-premium small mt-1"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v("\n                  Line exceeds 35 character limits! (Cargo-XML transmission standard)\n                ")], 1) : _vm._e()], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "airplane"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Shipping Details")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Vessel/Flight Particulars")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Flight Number *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. EK502",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.flight_number,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "flight_number", $$v);
      },
      expression: "form.shipping_details.flight_number"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "MAWB Number *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    "class": {
      "border-warning-premium": !_vm.validateMawbFormat(_vm.form.shipping_details.mawb_number) && _vm.form.shipping_details.mawb_number !== ""
    },
    attrs: {
      placeholder: "e.g. 020-98304921",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.mawb_number,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "mawb_number", $$v);
      },
      expression: "form.shipping_details.mawb_number"
    }
  }), _vm._v(" "), !_vm.validateMawbFormat(_vm.form.shipping_details.mawb_number) && _vm.form.shipping_details.mawb_number !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n                  Format must be NNN-NNNNNNNN (IATA prefix + serial).\n                ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Carrier Name *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. Emirates Cargo",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.carrier_name,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "carrier_name", $$v);
      },
      expression: "form.shipping_details.carrier_name"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "ETA Date/Time (Arrival) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "datetime-local",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.eta_datetime,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "eta_datetime", $$v);
      },
      expression: "form.shipping_details.eta_datetime"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "ETD Date/Time (Departure) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "datetime-local",
      required: ""
    },
    model: {
      value: _vm.form.shipping_details.etd_datetime,
      callback: function callback($$v) {
        _vm.$set(_vm.form.shipping_details, "etd_datetime", $$v);
      },
      expression: "form.shipping_details.etd_datetime"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "signpost-split"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Routing")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Journey Routing Legs")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Departure Port / Airport (Origin) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input text-uppercase",
    "class": {
      "border-warning-premium": !_vm.validateIataCode(_vm.form.routing.departure_airport) && _vm.form.routing.departure_airport !== ""
    },
    attrs: {
      placeholder: "e.g. DXB",
      required: ""
    },
    model: {
      value: _vm.form.routing.departure_airport,
      callback: function callback($$v) {
        _vm.$set(_vm.form.routing, "departure_airport", $$v);
      },
      expression: "form.routing.departure_airport"
    }
  }), _vm._v(" "), !_vm.validateIataCode(_vm.form.routing.departure_airport) && _vm.form.routing.departure_airport !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n                  Must be exactly 3 uppercase letters (IATA Code).\n                ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Destination Port / Airport (Destination) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input text-uppercase",
    "class": {
      "border-warning-premium": !_vm.validateIataCode(_vm.form.routing.destination_airport) && _vm.form.routing.destination_airport !== ""
    },
    attrs: {
      placeholder: "e.g. MAA",
      required: ""
    },
    model: {
      value: _vm.form.routing.destination_airport,
      callback: function callback($$v) {
        _vm.$set(_vm.form.routing, "destination_airport", $$v);
      },
      expression: "form.routing.destination_airport"
    }
  }), _vm._v(" "), !_vm.validateIataCode(_vm.form.routing.destination_airport) && _vm.form.routing.destination_airport !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n                  Must be exactly 3 uppercase letters (IATA Code).\n                ")]) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _c("hr", {
    staticClass: "border-secondary opacity-15 my-6"
  }), _vm._v(" "), _c("h6", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Multi-Leg Journey Details")]), _vm._v(" "), _vm._l(_vm.form.routing.legs, function (leg, index) {
    return _c("div", {
      key: index,
      staticClass: "routing-leg-row p-4 mb-3 rounded-lg border border-secondary border-opacity-10"
    }, [_c("div", {
      staticClass: "d-flex align-items-center justify-content-between mb-3"
    }, [_c("span", {
      staticClass: "text-indigo font-weight-bold small"
    }, [_vm._v("Leg " + _vm._s(index + 1))]), _vm._v(" "), index > 0 ? _c("b-button", {
      staticClass: "text-danger p-0 small",
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeRoutingLeg(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    }), _vm._v(" Remove\n              ")], 1) : _vm._e()], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
      staticClass: "mb-2 mb-md-0",
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Transit Airport",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input text-uppercase",
      attrs: {
        placeholder: "e.g. DOH"
      },
      model: {
        value: leg.airport,
        callback: function callback($$v) {
          _vm.$set(leg, "airport", $$v);
        },
        expression: "leg.airport"
      }
    })], 1)], 1), _vm._v(" "), _c("b-col", {
      staticClass: "mb-2 mb-md-0",
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Carrier",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input",
      attrs: {
        placeholder: "e.g. Qatar Airways"
      },
      model: {
        value: leg.carrier,
        callback: function callback($$v) {
          _vm.$set(leg, "carrier", $$v);
        },
        expression: "leg.carrier"
      }
    })], 1)], 1), _vm._v(" "), _c("b-col", {
      staticClass: "mb-2 mb-md-0",
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Flight No",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input",
      attrs: {
        placeholder: "e.g. QR528"
      },
      model: {
        value: leg.flight_no,
        callback: function callback($$v) {
          _vm.$set(leg, "flight_no", $$v);
        },
        expression: "leg.flight_no"
      }
    })], 1)], 1), _vm._v(" "), _c("b-col", {
      attrs: {
        md: "3"
      }
    }, [_c("b-form-group", {
      attrs: {
        label: "Date",
        "label-class": "text-muted small font-weight-bold mb-1"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input",
      attrs: {
        type: "date"
      },
      model: {
        value: leg.date,
        callback: function callback($$v) {
          _vm.$set(leg, "date", $$v);
        },
        expression: "leg.date"
      }
    })], 1)], 1)], 1)], 1);
  }), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill mt-3",
    attrs: {
      variant: "outline-indigo"
    },
    on: {
      click: _vm.addRoutingLeg
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus"
    }
  }), _vm._v(" Add Routing Leg\n          ")], 1)], 2)]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "files"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Attached House")]), _vm._v(" "), _c("span", {
          staticClass: "badge badge-indigo ml-2 small",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_vm._v(_vm._s(_vm.form.attached_house.length))])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-0"
  }, [_vm._v("House Air Waybills (HAWBs) Mapped")]), _vm._v(" "), _c("span", {
    staticClass: "badge badge-light-indigo font-weight-bold py-2 px-3"
  }, [_vm._v(_vm._s(_vm.form.attached_house.length) + " HAWBs Bundle")])]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("b-table", {
    staticClass: "premium-table mb-0",
    attrs: {
      hover: "",
      items: _vm.form.attached_house,
      fields: _vm.hawbTableFields,
      "show-empty": "",
      "empty-text": "No House AWBs mapped under this Consolidation folder."
    },
    scopedSlots: _vm._u([{
      key: "cell(gross_weight)",
      fn: function fn(data) {
        return [_vm._v("\n                    " + _vm._s(_vm.formatWeight(data.item.gross_weight)) + " KGS\n                  ")];
      }
    }, {
      key: "cell(volume_cbm)",
      fn: function fn(data) {
        return [_vm._v("\n                    " + _vm._s(_vm.formatVol(data.item.volume_cbm)) + " CBM\n                  ")];
      }
    }, {
      key: "cell(actions)",
      fn: function fn(data) {
        return [_c("b-button", {
          staticClass: "btn-icon",
          attrs: {
            variant: "outline-danger",
            size: "sm"
          },
          on: {
            click: function click($event) {
              return _vm.unlinkHawb(data.item.id);
            }
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "trash"
          }
        })], 1)];
      }
    }])
  })], 1)])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Link Pending House Job")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small"
  }, [_vm._v("Select from unlinked import house jobs to bundle costs and group the manifest cargo.")]), _vm._v(" "), _vm.linkHawbSuccess ? _c("div", {
    staticClass: "alert alert-success py-2 px-3 small mb-4 font-weight-bold animate-fade-in"
  }, [_vm._v("\n                House Job linked to Consol folder!\n              ")]) : _vm._e(), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Select Unassociated HAWB Job",
      "label-class": "text-muted small font-weight-bold text-left"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.unassociatedHawbOptions
    },
    model: {
      value: _vm.selectedUnassociatedHawb,
      callback: function callback($$v) {
        _vm.selectedUnassociatedHawb = $$v;
      },
      expression: "selectedUnassociatedHawb"
    }
  })], 1), _vm._v(" "), _c("b-button", {
    staticClass: "w-100 btn-pill mt-4",
    staticStyle: {
      height: "46px"
    },
    attrs: {
      variant: "indigo",
      disabled: !_vm.selectedUnassociatedHawb
    },
    on: {
      click: _vm.linkHawb
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus"
    }
  }), _vm._v(" Bundle HAWB Job\n              ")], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "box"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Packing Details")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Cargo Aggregates")]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Total Piece Count")]), _vm._v(" "), _c("h3", {
    staticClass: "text-dark font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.form.packing.piece_count) + " PCS")])]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Total Gross Weight")]), _vm._v(" "), _c("h3", {
    staticClass: "text-dark font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.formatWeight(_vm.form.packing.gross_weight)) + " KGS")])]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Calculated Volume")]), _vm._v(" "), _c("h3", {
    staticClass: "text-indigo font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.formatVol(_vm.form.packing.volume_cbm)) + " CBM")])]), _vm._v(" "), _c("div", {
    staticClass: "agg-row mb-4"
  }, [_c("span", {
    staticClass: "agg-label text-muted small uppercase"
  }, [_vm._v("Total Chargeable Weight")]), _vm._v(" "), _c("h3", {
    staticClass: "text-success font-weight-bold mb-0 mt-1"
  }, [_vm._v(_vm._s(_vm.formatWeight(_vm.form.packing.chargeable_weight)) + " KGS")]), _vm._v(" "), _c("span", {
    staticClass: "small text-muted"
  }, [_vm._v("Formula: Max(Gross, Volumetric Weight @ 1:6000)")])])])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-0"
  }, [_vm._v("Interactive Volumetric Calculator")]), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    attrs: {
      size: "sm"
    },
    on: {
      click: _vm.addDimensionRow
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle"
    }
  }), _vm._v(" Add Box Group\n                ")], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "table-responsive mb-4"
  }, [_c("table", {
    staticClass: "table table-sm border border-secondary border-opacity-10"
  }, [_c("thead", [_c("tr", {
    staticClass: "dim-header"
  }, [_c("th", [_vm._v("Pieces")]), _vm._v(" "), _c("th", [_vm._v("L (cm)")]), _vm._v(" "), _c("th", [_vm._v("W (cm)")]), _vm._v(" "), _c("th", [_vm._v("H (cm)")]), _vm._v(" "), _c("th", [_vm._v("Vol (CBM)")]), _vm._v(" "), _c("th", [_vm._v("Vol Wt (KGS)")]), _vm._v(" "), _c("th", [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.calculatorRows, function (row, idx) {
    return _c("tr", {
      key: idx,
      staticClass: "dim-row align-middle"
    }, [_c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.pieces,
        callback: function callback($$v) {
          _vm.$set(row, "pieces", _vm._n($$v));
        },
        expression: "row.pieces"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.length,
        callback: function callback($$v) {
          _vm.$set(row, "length", _vm._n($$v));
        },
        expression: "row.length"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.width,
        callback: function callback($$v) {
          _vm.$set(row, "width", _vm._n($$v));
        },
        expression: "row.width"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "100px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-center",
      attrs: {
        type: "number"
      },
      on: {
        input: function input($event) {
          return _vm.recalcVolumeRow(idx);
        }
      },
      model: {
        value: row.height,
        callback: function callback($$v) {
          _vm.$set(row, "height", _vm._n($$v));
        },
        expression: "row.height"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "text-center font-weight-bold text-info",
      staticStyle: {
        "line-height": "34px"
      }
    }, [_vm._v("\n                        " + _vm._s(_vm.formatVol(row.volume_cbm)) + "\n                      ")]), _vm._v(" "), _c("td", {
      staticClass: "text-center font-weight-bold text-success",
      staticStyle: {
        "line-height": "34px"
      }
    }, [_vm._v("\n                        " + _vm._s(_vm.formatWeight(row.vol_weight)) + "\n                      ")]), _vm._v(" "), _c("td", {
      staticClass: "text-center",
      staticStyle: {
        width: "80px",
        "line-height": "34px"
      }
    }, [_c("b-button", {
      staticClass: "text-danger p-0",
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeDimensionRow(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    })], 1)], 1)]);
  }), _vm._v(" "), _vm.calculatorRows.length === 0 ? _c("tr", [_c("td", {
    staticClass: "text-center text-muted py-5",
    attrs: {
      colspan: "7"
    }
  }, [_vm._v('\n                        Click "Add Box Group" to compute volumes and weights for loose cargo packs.\n                      ')])]) : _vm._e()], 2)])]), _vm._v(" "), _vm.calculatorRows.length > 0 ? _c("div", {
    staticClass: "d-flex justify-content-between align-items-center p-4 rounded-lg",
    staticStyle: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0"
    }
  }, [_c("div", {
    staticClass: "small text-muted"
  }, [_vm._v("\n                  Total Calculator Run: "), _c("span", {
    staticClass: "font-weight-bold",
    staticStyle: {
      color: "#475569"
    }
  }, [_vm._v(_vm._s(_vm.calcTotalPieces) + " Pcs")]), _vm._v(" / \n                  "), _c("span", {
    staticClass: "text-info font-weight-bold"
  }, [_vm._v(_vm._s(_vm.formatVol(_vm.calcTotalCbm)) + " CBM")]), _vm._v(" / \n                  "), _c("span", {
    staticClass: "text-success font-weight-bold"
  }, [_vm._v(_vm._s(_vm.formatWeight(_vm.calcTotalVolWeight)) + " KGS Vol Wt")])]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill px-4",
    attrs: {
      variant: "success"
    },
    on: {
      click: _vm.applyCalculatorToPacking
    }
  }, [_vm._v("\n                  Apply to Packing Details\n                ")])], 1) : _vm._e()])])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "file-earmark-check"
          }
        }), _vm._v(" "), _c("span", [_vm._v("DI (Delivery Order)")]), _vm._v(" "), _vm.isDOBlocked ? _c("span", {
          staticClass: "badge badge-danger ml-2",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "lock-fill"
          }
        })], 1) : _vm._e()], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Delivery Routing Parties")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consignee (Client Profile) *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.consigneeListOptions
    },
    on: {
      change: _vm.onConsigneeSelect
    },
    model: {
      value: _vm.selectedConsignee,
      callback: function callback($$v) {
        _vm.selectedConsignee = $$v;
      },
      expression: "selectedConsignee"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Transporter / Trucking Co",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.transporterOptions
    },
    on: {
      change: _vm.onTransporterSelect
    },
    model: {
      value: _vm.selectedTransporter,
      callback: function callback($$v) {
        _vm.selectedTransporter = $$v;
      },
      expression: "selectedTransporter"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Custom Broker (CHA)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.customBrokerOptions
    },
    on: {
      change: _vm.onCustomBrokerSelect
    },
    model: {
      value: _vm.selectedCustomBroker,
      callback: function callback($$v) {
        _vm.selectedCustomBroker = $$v;
      },
      expression: "selectedCustomBroker"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "High Sea Buyer (Optional)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "Enter High Sea Buyer..."
    },
    model: {
      value: _vm.form.delivery_order.high_sea_buyer,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "high_sea_buyer", $$v);
      },
      expression: "form.delivery_order.high_sea_buyer"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Collection / Pickup Port Gate",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "e.g. ACC Chennai Warehouse Section B"
    },
    model: {
      value: _vm.form.delivery_order.pickup_address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "pickup_address", $$v);
      },
      expression: "form.delivery_order.pickup_address"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Delivery Destination Address",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("div", {
    staticClass: "d-flex align-items-center justify-content-between mb-1"
  }, [_c("span"), _vm._v(" "), _c("b-form-checkbox", {
    staticClass: "premium-checkbox text-muted small",
    attrs: {
      size: "sm"
    },
    on: {
      change: _vm.toggleAddressCopy
    },
    model: {
      value: _vm.copyConsigneeAddrCheckbox,
      callback: function callback($$v) {
        _vm.copyConsigneeAddrCheckbox = $$v;
      },
      expression: "copyConsigneeAddrCheckbox"
    }
  }, [_vm._v("\n                        Copy Consignee Address\n                      ")])], 1), _vm._v(" "), _c("b-form-textarea", {
    staticClass: "premium-textarea",
    attrs: {
      rows: "3",
      placeholder: "Street destination address details..."
    },
    model: {
      value: _vm.form.delivery_order.delivery_address,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "delivery_address", $$v);
      },
      expression: "form.delivery_order.delivery_address"
    }
  })], 1)], 1)], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_vm.isDOBlocked ? _c("div", {
    staticClass: "alert alert-danger mb-4 p-4 rounded-lg animate-fade-in border border-danger border-opacity-30"
  }, [_c("h6", {
    staticClass: "font-weight-bold d-flex align-items-center mb-2"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "shield-lock-fill"
    }
  }), _vm._v("\n                DO Release Locked\n              ")], 1), _vm._v(" "), _c("p", {
    staticClass: "small mb-0"
  }, [_vm._v("\n                Physical release is programmatically locked:\n                "), _vm.form.financials.payment_status === "Pending" ? _c("span", {
    staticClass: "d-block mt-1 font-weight-bold"
  }, [_vm._v("• Payment status is PENDING")]) : _vm._e(), _vm._v(" "), _vm.isCreditLimitExceeded ? _c("span", {
    staticClass: "d-block mt-1 font-weight-bold"
  }, [_vm._v("• Consignee's CREDIT LIMIT EXCEEDED")]) : _vm._e(), _vm._v(" "), _vm.form.delivery_order.status === "hold" ? _c("span", {
    staticClass: "d-block mt-1 font-weight-bold"
  }, [_vm._v("• Manual DO status is HOLD")]) : _vm._e()])]) : _c("div", {
    staticClass: "alert alert-success mb-4 p-4 rounded-lg animate-fade-in border border-success border-opacity-30"
  }, [_c("h6", {
    staticClass: "font-weight-bold d-flex align-items-center mb-1"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "shield-fill-check"
    }
  }), _vm._v("\n                Credit Approval Cleared\n              ")], 1), _vm._v(" "), _c("p", {
    staticClass: "small mb-0"
  }, [_vm._v("Delivery Order released is authorized for cargo pick-up.")])]), _vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-5"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("DO Parameters")]), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "DO Status",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.doStatusOptions
    },
    model: {
      value: _vm.form.delivery_order.status,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "status", $$v);
      },
      expression: "form.delivery_order.status"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Delivery Order No",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "Auto-generated upon save"
    },
    model: {
      value: _vm.form.delivery_order.delivery_order_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "delivery_order_no", $$v);
      },
      expression: "form.delivery_order.delivery_order_no"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "DO Release Date",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "date"
    },
    model: {
      value: _vm.form.delivery_order.delivery_order_date,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "delivery_order_date", $$v);
      },
      expression: "form.delivery_order.delivery_order_date"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Release Fee (INR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.form.delivery_order.do_release_fee,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "do_release_fee", _vm._n($$v));
      },
      expression: "form.delivery_order.do_release_fee"
    }
  })], 1), _vm._v(" "), _c("b-form-group", {
    attrs: {
      label: "Warehouse Charges (INR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.form.delivery_order.warehouse_fee,
      callback: function callback($$v) {
        _vm.$set(_vm.form.delivery_order, "warehouse_fee", _vm._n($$v));
      },
      expression: "form.delivery_order.warehouse_fee"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "mt-5 pt-3 border-top border-secondary border-opacity-10"
  }, [_c("b-button", {
    staticClass: "btn btn-indigo w-100 btn-pill mb-2 py-3 font-weight-bold",
    attrs: {
      disabled: _vm.isDOBlocked
    },
    on: {
      click: _vm.printDO
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "printer-fill"
    }
  }), _vm._v(" Print Delivery Order\n                ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn w-100 btn-pill py-3 font-weight-bold",
    attrs: {
      disabled: _vm.isDOBlocked
    },
    on: {
      click: _vm.printReceipt
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "receipt"
    }
  }), _vm._v(" Print Receipt\n                ")], 1)], 1)], 1)])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "wallet2"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Charges")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between align-items-center mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-0"
  }, [_vm._v("Consol Billing Splits")]), _vm._v(" "), _c("b-button", {
    staticClass: "show-btn",
    attrs: {
      size: "sm"
    },
    on: {
      click: _vm.addChargeItem
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "plus-circle"
    }
  }), _vm._v(" Add Charge Item\n            ")], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "table-responsive mb-4"
  }, [_c("table", {
    staticClass: "table table-sm border border-secondary border-opacity-10"
  }, [_c("thead", [_c("tr", {
    staticClass: "dim-header"
  }, [_c("th", [_vm._v("Charge Code")]), _vm._v(" "), _c("th", [_vm._v("Description")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Prepaid (INR)")]), _vm._v(" "), _c("th", {
    staticClass: "text-right"
  }, [_vm._v("Collect (INR)")]), _vm._v(" "), _c("th", {
    staticClass: "text-center"
  }, [_vm._v("Action")])])]), _vm._v(" "), _c("tbody", [_vm._l(_vm.form.charges, function (charge, index) {
    return _c("tr", {
      key: index,
      staticClass: "align-middle"
    }, [_c("td", {
      staticStyle: {
        width: "150px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-uppercase",
      attrs: {
        placeholder: "e.g. FR"
      },
      model: {
        value: charge.code,
        callback: function callback($$v) {
          _vm.$set(charge, "code", $$v);
        },
        expression: "charge.code"
      }
    })], 1), _vm._v(" "), _c("td", [_c("b-form-input", {
      staticClass: "premium-input-sm",
      attrs: {
        placeholder: "e.g. Air Freight Charge"
      },
      model: {
        value: charge.description,
        callback: function callback($$v) {
          _vm.$set(charge, "description", $$v);
        },
        expression: "charge.description"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "180px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-right",
      attrs: {
        type: "number",
        placeholder: "0.00"
      },
      model: {
        value: charge.prepaid,
        callback: function callback($$v) {
          _vm.$set(charge, "prepaid", _vm._n($$v));
        },
        expression: "charge.prepaid"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticStyle: {
        width: "180px"
      }
    }, [_c("b-form-input", {
      staticClass: "premium-input-sm text-right",
      attrs: {
        type: "number",
        placeholder: "0.00"
      },
      model: {
        value: charge.collect,
        callback: function callback($$v) {
          _vm.$set(charge, "collect", _vm._n($$v));
        },
        expression: "charge.collect"
      }
    })], 1), _vm._v(" "), _c("td", {
      staticClass: "text-center",
      staticStyle: {
        width: "80px"
      }
    }, [_c("b-button", {
      staticClass: "text-danger p-0",
      attrs: {
        variant: "link"
      },
      on: {
        click: function click($event) {
          return _vm.removeChargeItem(index);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "trash"
      }
    })], 1)], 1)]);
  }), _vm._v(" "), _c("tr", {
    staticClass: "dim-row font-weight-bold border-top",
    staticStyle: {
      background: "#F8FAFC"
    }
  }, [_c("td", {
    staticClass: "text-dark"
  }, [_vm._v("TOTALS")]), _vm._v(" "), _c("td"), _vm._v(" "), _c("td", {
    staticClass: "text-right text-info font-weight-bolder pr-4",
    staticStyle: {
      "line-height": "34px"
    }
  }, [_vm._v("\n                    ₹ " + _vm._s(_vm.totalChargesPrepaid.toFixed(2)) + "\n                  ")]), _vm._v(" "), _c("td", {
    staticClass: "text-right text-success font-weight-bolder pr-4",
    staticStyle: {
      "line-height": "34px"
    }
  }, [_vm._v("\n                    ₹ " + _vm._s(_vm.totalChargesCollect.toFixed(2)) + "\n                  ")]), _vm._v(" "), _c("td")])], 2)])])])]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "cash-coin"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Financials")]), _vm._v(" "), _vm.isCreditLimitExceeded ? _c("span", {
          staticClass: "badge badge-danger ml-2",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_c("b-icon", {
          attrs: {
            icon: "shield-slash-fill"
          }
        }), _vm._v(" EXCEEDED\n            ")], 1) : _vm._e()], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "8"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6"
  }, [_c("h5", {
    staticClass: "h-color mb-5"
  }, [_vm._v("Billing & Accounts Receivable Status")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Payment Status / Mode *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-select", {
    staticClass: "premium-select",
    attrs: {
      options: _vm.paymentStatusOptions
    },
    model: {
      value: _vm.form.financials.payment_status,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "payment_status", $$v);
      },
      expression: "form.financials.payment_status"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Invoice Number",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "INV-26-XXXX"
    },
    model: {
      value: _vm.form.financials.invoice_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "invoice_no", $$v);
      },
      expression: "form.financials.invoice_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "4"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Invoice Amount (INR)",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "number"
    },
    model: {
      value: _vm.form.financials.invoice_amount,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "invoice_amount", _vm._n($$v));
      },
      expression: "form.financials.invoice_amount"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Receipt Reference Number",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      placeholder: "REC-26-XXXX"
    },
    model: {
      value: _vm.form.financials.receipt_no,
      callback: function callback($$v) {
        _vm.$set(_vm.form.financials, "receipt_no", $$v);
      },
      expression: "form.financials.receipt_no"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Prepaid/Collect Split Details",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("div", {
    staticClass: "p-3 rounded-lg small",
    staticStyle: {
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      color: "#475569"
    }
  }, [_vm._v("\n                      Freight Collect splits are automatically aggregated. Billing entities are matched to the Consignee debtor.\n                    ")])])], 1)], 1)], 1)]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-6",
    attrs: {
      lg: "4"
    }
  }, [_c("div", {
    staticClass: "credit-card p-5 rounded-lg border border-opacity-10 h-100",
    "class": _vm.isCreditLimitExceeded ? "credit-card-alert" : "credit-card-ok"
  }, [_c("h5", {
    staticClass: "font-weight-bold mb-4 d-flex align-items-center h-color"
  }, [_c("b-icon", {
    staticClass: "mr-2",
    "class": _vm.isCreditLimitExceeded ? "text-danger" : "text-success",
    attrs: {
      icon: "credit-card-2-front-fill"
    }
  }), _vm._v("\n                Consignee Credit Master\n              ")], 1), _vm._v(" "), _vm.isCreditLimitExceeded ? _c("div", {
    staticClass: "alert alert-danger py-2 px-3 small mb-4 font-weight-bold border border-danger border-opacity-20 animate-fade-in"
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "exclamation-circle-fill"
    }
  }), _vm._v(" CREDIT LIMIT EXCEEDED\n              ")], 1) : _vm._e(), _vm._v(" "), _c("div", {
    staticClass: "credit-detail mb-3"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Debtor Status")]), _vm._v(" "), _c("div", {
    staticClass: "font-weight-bold mt-1"
  }, [_vm.selectedConsigneeObj ? _c("span", {
    staticClass: "badge",
    "class": _vm.getBadgeClassForCredit(_vm.selectedConsigneeObj.credit_status)
  }, [_vm._v("\n                    " + _vm._s(_vm.selectedConsigneeObj.credit_status.toUpperCase()) + "\n                  ")]) : _c("span", {
    staticClass: "text-muted"
  }, [_vm._v("—")])])]), _vm._v(" "), _c("div", {
    staticClass: "credit-detail mb-3"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Assigned Credit Limit")]), _vm._v(" "), _c("h5", {
    staticClass: "font-weight-bold mt-1 text-dark"
  }, [_vm._v("\n                  " + _vm._s(_vm.selectedConsigneeObj ? _vm.formatCurrency(_vm.selectedConsigneeObj.credit_limit) : "₹ 0.00") + "\n                ")])]), _vm._v(" "), _c("div", {
    staticClass: "credit-detail mb-3"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Current Outstanding Balance")]), _vm._v(" "), _c("h5", {
    staticClass: "font-weight-bold mt-1",
    "class": _vm.isCreditLimitExceeded ? "text-danger" : "text-success"
  }, [_vm._v("\n                  " + _vm._s(_vm.selectedConsigneeObj ? _vm.formatCurrency(_vm.selectedConsigneeObj.outstanding_balance) : "₹ 0.00") + "\n                ")])]), _vm._v(" "), _c("div", {
    staticClass: "credit-detail"
  }, [_c("span", {
    staticClass: "text-muted small"
  }, [_vm._v("Payment Terms")]), _vm._v(" "), _c("p", {
    staticClass: "font-weight-bold mb-0 mt-1 text-dark"
  }, [_vm._v("\n                  " + _vm._s(_vm.selectedConsigneeObj ? _vm.selectedConsigneeObj.default_payment_terms : "—") + "\n                ")])])])])], 1)], 1), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "shield-check"
          }
        }), _vm._v(" "), _c("span", [_vm._v("Customs / CGM")])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("div", {
    staticClass: "premium-glass-card p-6 mb-6"
  }, [_c("div", {
    staticClass: "d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5"
  }, [_c("h5", {
    staticClass: "h-color mb-3 mb-md-0"
  }, [_vm._v("Customs IGM / CGM Manifest Filings")]), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-wrap align-items-center gap-2"
  }, [_c("b-form-select", {
    staticClass: "premium-select-sm mr-2",
    staticStyle: {
      width: "160px"
    },
    attrs: {
      options: _vm.customsFilterOptions
    },
    model: {
      value: _vm.customsFilterStatus,
      callback: function callback($$v) {
        _vm.customsFilterStatus = $$v;
      },
      expression: "customsFilterStatus"
    }
  }), _vm._v(" "), _c("b-form-input", {
    staticClass: "premium-input-sm mr-2 text-uppercase",
    staticStyle: {
      width: "200px"
    },
    attrs: {
      placeholder: "Custom House (e.g. INMAA4)"
    },
    model: {
      value: _vm.customsFilterGate,
      callback: function callback($$v) {
        _vm.customsFilterGate = $$v;
      },
      expression: "customsFilterGate"
    }
  }), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill",
    attrs: {
      variant: "warning"
    },
    on: {
      click: _vm.openCgmModal
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "box-arrow-up"
    }
  }), _vm._v(" Submit CGM Data\n              ")], 1)], 1)]), _vm._v(" "), _c("div", {
    staticClass: "table-responsive"
  }, [_c("b-table", {
    staticClass: "premium-table mb-0",
    attrs: {
      hover: "",
      items: _vm.filteredCustomsFilings,
      fields: _vm.customsTableFields,
      "show-empty": "",
      "empty-text": "No digital customs filing submissions found matching search criteria."
    },
    scopedSlots: _vm._u([{
      key: "cell(filing_type)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "badge badge-light-indigo font-weight-bold"
        }, [_vm._v(_vm._s(data.value))])];
      }
    }, {
      key: "cell(transaction_status)",
      fn: function fn(data) {
        return [_c("span", {
          staticClass: "badge",
          "class": _vm.getBadgeClassForCustoms(data.value)
        }, [_vm._v("\n                  " + _vm._s(data.value.toUpperCase()) + "\n                ")])];
      }
    }, {
      key: "cell(flat_file_path)",
      fn: function fn(data) {
        return [data.value ? _c("span", {
          staticClass: "small text-muted font-family-monospace"
        }, [_vm._v("\n                  " + _vm._s(data.value.substring(data.value.lastIndexOf("/") + 1)) + "\n                ")]) : _c("span", {
          staticClass: "text-muted"
        }, [_vm._v("—")])];
      }
    }, {
      key: "cell(submitted_at)",
      fn: function fn(data) {
        return [_vm._v("\n                " + _vm._s(_vm.formatDateTime(data.value)) + "\n              ")];
      }
    }, {
      key: "cell(actions)",
      fn: function fn(data) {
        return [_c("b-button", {
          staticClass: "btn-pill px-3",
          attrs: {
            variant: "outline-info",
            size: "sm"
          },
          on: {
            click: function click($event) {
              return _vm.viewFilingLog(data.item);
            }
          }
        }, [_vm._v("\n                  View Log\n                ")])];
      }
    }])
  })], 1)])]), _vm._v(" "), _c("b-tab", {
    scopedSlots: _vm._u([{
      key: "title",
      fn: function fn() {
        return [_c("div", {
          staticClass: "d-flex align-items-center"
        }, [_c("b-icon", {
          staticClass: "mr-2",
          attrs: {
            icon: "folder2-open"
          }
        }), _vm._v(" "), _c("span", [_vm._v("E-Docket")]), _vm._v(" "), _c("span", {
          staticClass: "badge badge-success ml-2 small",
          staticStyle: {
            "font-size": "0.65rem"
          }
        }, [_vm._v(_vm._s(_vm.form.e_docket.length))])], 1)];
      },
      proxy: true
    }])
  }, [_vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Upload physical shipping documents")]), _vm._v(" "), _c("div", {
    staticClass: "dropzone-box d-flex flex-column align-items-center justify-content-center py-10 px-5 text-center cursor-pointer rounded-lg border-dashed border-2 border-secondary",
    on: {
      click: _vm.triggerFileInput,
      dragover: function dragover($event) {
        $event.preventDefault();
      },
      drop: function drop($event) {
        $event.preventDefault();
        return _vm.handleFileDrop.apply(null, arguments);
      }
    }
  }, [_c("b-icon", {
    staticClass: "text-indigo mb-3 animate-pulse",
    attrs: {
      icon: "cloud-upload",
      "font-scale": "3"
    }
  }), _vm._v(" "), _c("h6", {
    staticStyle: {
      color: "#1E293B",
      "font-weight": "700"
    }
  }, [_vm._v("Drag and drop files here to upload")]), _vm._v(" "), _c("p", {
    staticClass: "text-muted small mb-0 mt-1"
  }, [_vm._v("Supports PDF, PNG, JPG files. Max 10MB.")]), _vm._v(" "), _c("input", {
    ref: "fileInput",
    staticClass: "d-none",
    attrs: {
      type: "file",
      multiple: ""
    },
    on: {
      change: _vm.handleFileSelect
    }
  })], 1), _vm._v(" "), _vm.uploadProgress > 0 ? _c("div", {
    staticClass: "mt-4 animate-fade-in"
  }, [_c("div", {
    staticClass: "d-flex justify-content-between mb-1 small text-muted"
  }, [_c("span", [_vm._v("Uploading...")]), _vm._v(" "), _c("span", [_vm._v(_vm._s(_vm.uploadProgress) + "%")])]), _vm._v(" "), _c("b-progress", {
    staticStyle: {
      height: "6px"
    },
    attrs: {
      value: _vm.uploadProgress,
      max: "100",
      variant: "indigo"
    }
  })], 1) : _vm._e()])]), _vm._v(" "), _c("b-col", {
    staticClass: "mb-4",
    attrs: {
      lg: "6"
    }
  }, [_c("div", {
    staticClass: "premium-glass-card p-6 h-100"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Attached Documents Docket")]), _vm._v(" "), _vm._l(_vm.form.e_docket, function (doc, idx) {
    return _c("div", {
      key: idx,
      staticClass: "docket-file-row p-3 mb-3 rounded-lg d-flex align-items-center justify-content-between border border-secondary border-opacity-10 animate-fade-in"
    }, [_c("div", {
      staticClass: "d-flex align-items-center"
    }, [doc.mime_type.includes("pdf") ? _c("b-icon", {
      staticClass: "text-danger mr-3",
      attrs: {
        icon: "file-earmark-pdf",
        "font-scale": "1.5"
      }
    }) : _c("b-icon", {
      staticClass: "text-info mr-3",
      attrs: {
        icon: "file-earmark-image",
        "font-scale": "1.5"
      }
    }), _vm._v(" "), _c("div", [_c("div", {
      staticClass: "font-weight-bold small text-truncate text-dark",
      staticStyle: {
        "max-width": "200px"
      }
    }, [_vm._v(_vm._s(doc.file_name))]), _vm._v(" "), _c("span", {
      staticClass: "text-muted small"
    }, [_vm._v(_vm._s(_vm.formatBytes(doc.file_size)))])])], 1), _vm._v(" "), _c("div", {
      staticClass: "d-flex align-items-center gap-3"
    }, [_c("b-form-select", {
      staticClass: "premium-select-sm mr-2",
      staticStyle: {
        width: "160px"
      },
      attrs: {
        options: _vm.documentTypeOptions
      },
      model: {
        value: doc.document_type,
        callback: function callback($$v) {
          _vm.$set(doc, "document_type", $$v);
        },
        expression: "doc.document_type"
      }
    }), _vm._v(" "), _c("b-button", {
      staticClass: "btn-icon",
      attrs: {
        variant: "outline-light",
        size: "sm"
      },
      on: {
        click: function click($event) {
          return _vm.deleteDocketFile(idx);
        }
      }
    }, [_c("b-icon", {
      attrs: {
        icon: "x"
      }
    })], 1)], 1)]);
  }), _vm._v(" "), _vm.form.e_docket.length === 0 ? _c("div", {
    staticClass: "text-center py-10 text-muted"
  }, [_c("b-icon", {
    staticClass: "mb-3",
    attrs: {
      icon: "folder",
      "font-scale": "2"
    }
  }), _vm._v(" "), _c("p", {
    staticClass: "small mb-0"
  }, [_vm._v("E-Docket folder is currently empty. Upload cargo files or drafts.")])], 1) : _vm._e()], 2)])], 1)], 1)], 1)], 1), _vm._v(" "), _c("div", {
    staticClass: "d-flex justify-content-end align-items-center mt-8 pt-5 border-top border-secondary border-opacity-10"
  }, [_c("b-button", {
    staticClass: "btn btn-indigo btn-pill btn-lg px-8 py-3",
    attrs: {
      disabled: _vm.formLoading
    },
    on: {
      click: _vm.saveConsol
    }
  }, [_vm.formLoading ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Saving Consol...")], 1) : _c("span", [_c("b-icon", {
    staticClass: "mr-2",
    attrs: {
      icon: "check-circle"
    }
  }), _vm._v(" Save Consol Folder")], 1)])], 1), _vm._v(" "), _c("b-modal", {
    attrs: {
      id: "cgm-filing-modal",
      title: "Submit CGM / ICEGATE manifest Data",
      size: "lg",
      centered: "",
      "hide-footer": ""
    }
  }, [_c("div", {
    staticClass: "cgm-modal-body p-4 font-outfit text-dark rounded-lg"
  }, [_c("h5", {
    staticClass: "h-color mb-4"
  }, [_vm._v("Filing Details - Custom Gate Chennai")]), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Date & Time of Filing",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      type: "datetime-local"
    },
    model: {
      value: _vm.cgmFilingForm.datetime,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "datetime", $$v);
      },
      expression: "cgmFilingForm.datetime"
    }
  })], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Consol Job No. *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input",
    attrs: {
      required: "",
      disabled: ""
    },
    model: {
      value: _vm.cgmFilingForm.consol_no,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "consol_no", $$v);
      },
      expression: "cgmFilingForm.consol_no"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("b-row", [_c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Custom House Code *",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-input", {
    staticClass: "premium-input text-uppercase",
    "class": {
      "border-warning-premium": _vm.cgmFilingForm.customs_house.length !== 6 && _vm.cgmFilingForm.customs_house !== ""
    },
    attrs: {
      placeholder: "e.g. INMAA4",
      required: ""
    },
    model: {
      value: _vm.cgmFilingForm.customs_house,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "customs_house", $$v);
      },
      expression: "cgmFilingForm.customs_house"
    }
  }), _vm._v(" "), _vm.cgmFilingForm.customs_house.length !== 6 && _vm.cgmFilingForm.customs_house !== "" ? _c("div", {
    staticClass: "text-warning small mt-1"
  }, [_vm._v("\n              Must be exactly 6 characters (e.g. INMAA4).\n            ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c("b-col", {
    staticClass: "mb-3",
    attrs: {
      md: "6"
    }
  }, [_c("b-form-group", {
    attrs: {
      label: "Sending Method",
      "label-class": "text-muted small font-weight-bold"
    }
  }, [_c("b-form-radio-group", {
    staticClass: "premium-radio-group text-dark pt-2",
    attrs: {
      options: _vm.sendingMethods
    },
    model: {
      value: _vm.cgmFilingForm.sending_method,
      callback: function callback($$v) {
        _vm.$set(_vm.cgmFilingForm, "sending_method", $$v);
      },
      expression: "cgmFilingForm.sending_method"
    }
  })], 1)], 1)], 1), _vm._v(" "), _c("h6", {
    staticClass: "h-color mt-4 mb-2"
  }, [_vm._v("Manifest Submission Console & DSC Status")]), _vm._v(" "), _c("div", {
    staticClass: "dsc-terminal p-4 rounded-lg border border-info border-opacity-30 mb-5 font-family-monospace"
  }, [_vm._l(_vm.dscLogs, function (log, idx) {
    return _c("div", {
      key: idx,
      staticClass: "dsc-log-line",
      "class": _vm.getDscLogClass(log.type)
    }, [_vm._v("\n          " + _vm._s(log.text) + "\n        ")]);
  }), _vm._v(" "), _vm.dscLogs.length === 0 ? _c("div", {
    staticClass: "text-muted text-center py-4"
  }, [_vm._v('\n          Terminal Idle. Trigger "Submit" or "Send for Signature" to execute filings.\n        ')]) : _vm._e()], 2), _vm._v(" "), _c("div", {
    staticClass: "d-flex flex-wrap justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-10"
  }, [_c("b-button", {
    staticClass: "show-btn mr-2 px-4",
    on: {
      click: _vm.closeCgmModal
    }
  }, [_vm._v("Close")]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill mr-2 px-4",
    attrs: {
      variant: "outline-info",
      href: "#"
    },
    on: {
      click: function click($event) {
        $event.preventDefault();
        return _vm.openSignatureUtility.apply(null, arguments);
      }
    }
  }, [_c("b-icon", {
    staticClass: "mr-1",
    attrs: {
      icon: "download"
    }
  }), _vm._v(" Get Signature Tool\n        ")], 1), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill mr-2 px-4",
    attrs: {
      variant: "warning",
      disabled: _vm.filingProcessing
    },
    on: {
      click: _vm.submitCgmData
    }
  }, [_vm.filingProcessing ? _c("span", [_c("b-spinner", {
    staticClass: "mr-2",
    attrs: {
      small: ""
    }
  }), _vm._v("Processing...")], 1) : _c("span", [_vm._v("Submit Manifest")])]), _vm._v(" "), _c("b-button", {
    staticClass: "btn-pill px-4",
    attrs: {
      variant: "success",
      disabled: !_vm.isCgmValid || _vm.filingProcessing
    },
    on: {
      click: _vm.sendForSignature
    }
  }, [_vm._v("\n          Sign & Transmit (DSC)\n        ")])], 1)], 1)])], 1)])], 1)]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64 ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
        }, [_c("img", {
          attrs: {
            src: "/media/assets/banners/banner-ship.webp",
            alt: "Focus Sea - Digital Ocean Freight Management",
            loading: "lazy"
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
        }, [_c("img", {
          attrs: {
            src: "/media/assets/banners/banner-plane.webp",
            alt: "Focus Air - Automated Air Freight Solutions",
            loading: "lazy"
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
        }, [_c("img", {
          attrs: {
            src: "/media/assets/banners/banner-truck.webp",
            alt: "Focus Road - Road Transportation Management",
            loading: "lazy"
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
  })], 1)])], 1)], 1);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3 ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./resources/js/src/core/mixins/airWayBillMixin.js":
/*!*********************************************************!*\
  !*** ./resources/js/src/core/mixins/airWayBillMixin.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      validationErrors: [],
      hs_code_error: [],
      uld_error: [],
      oci_info: {
        country_code: '',
        info_identifier: '',
        custom_info_identifier: '',
        supplementary_info: ''
      },
      editIndex: null,
      isConsignmentAdded: false,
      showSpinner: false,
      successMessage: '',
      charCount: 0,
      lineCount: 0,
      edit_entry_index: null,
      other_charges: {
        other_charge_code: '',
        other_code: '',
        amount: '',
        due: "C",
        payment_type: "P",
        charge: '',
        chargable_weight1: ''
      },
      consignment_list: new Form({
        pieces: '',
        description: '',
        rate_class: '',
        uld_rate_class: '',
        service_code: '',
        commodity_item: '',
        country_origin_goods: '',
        slac: '',
        hs_code: '',
        gross_weight: '',
        weight_code: 'KGM',
        //kgs/lbs
        chargable_weight: '',
        other_charge: '',
        rate: '',
        pcs: '',
        wgt: '',
        length: '',
        width: '',
        height: '',
        unit: 'CMT',
        volume: '',
        uld_type: '',
        uld_serial: '',
        owner: '',
        itemss: [],
        hsCodes: [],
        uld_infos: []
      }),
      activeDropdown: null
    };
  },
  computed: {
    isPrepaid: function isPrepaid() {
      var prepaidTypes = ['PP'];
      return prepaidTypes.includes(this.form.payment_info.type_of_payment);
    },
    weightCharge: function weightCharge() {
      return parseFloat(this.form.totals.total_amount || 0);
    },
    taxes: function taxes() {
      return 0.00;
    },
    totalDueAgentPrepaid: function totalDueAgentPrepaid() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'A' && charge.payment_type === 'P';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueAgentCollect: function totalDueAgentCollect() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'A' && charge.payment_type === 'C';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueCarrierPrepaid: function totalDueCarrierPrepaid() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'C' && charge.payment_type === 'P';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalDueCarrierCollect: function totalDueCarrierCollect() {
      return this.form.charges.filter(function (charge) {
        return charge.due === 'C' && charge.payment_type === 'C';
      }).reduce(function (sum, charge) {
        return sum + parseFloat(charge.amount);
      }, 0).toFixed(2);
    },
    totalChargesPrepaid: function totalChargesPrepaid() {
      return ((this.isPrepaid ? this.weightCharge : 0) + parseFloat(this.totalDueAgentPrepaid) + parseFloat(this.totalDueCarrierPrepaid)).toFixed(2);
    },
    totalChargesCollect: function totalChargesCollect() {
      return ((this.isPrepaid ? 0 : this.weightCharge) + parseFloat(this.totalDueAgentCollect) + parseFloat(this.totalDueCarrierCollect)).toFixed(2);
    },
    totalChrage: function totalChrage() {
      return (this.weightCharge + parseFloat(this.totalDueAgentCollect) + parseFloat(this.totalDueCarrierCollect)).toFixed(2);
    },
    totalCharges: function totalCharges() {
      return {
        prepaid: this.isPrepaid ? this.weightCharge.toFixed(2) : '0.00',
        collect: this.isPrepaid ? '0.00' : this.weightCharge.toFixed(2)
      };
    },
    calculatedCharge: function calculatedCharge() {
      return this.form.totals.total_amount;
    },
    remainingPieces: function remainingPieces() {
      var totalAddedPieces = this.consignment_list.itemss.reduce(function (sum, item) {
        return sum + parseInt(item.pcs || 0);
      }, 0);
      return this.consignment_list.pieces - totalAddedPieces;
    }
  },
  watch: {
    'form.totals.dimention_unit': function formTotalsDimention_unit() {
      this.calculateTotalVolume();
    },
    'form.charges': {
      handler: function handler(newVal) {
        this.totalChargesPrepaid;
        this.totalChargesCollect;
        this.weightCharge;
        this.taxes;
        this.totalCharges;
        this.totalDueAgentPrepaid;
        this.totalDueAgentCollect;
        this.totalDueCarrierPrepaid;
        this.totalDueCarrierCollect;
      },
      deep: true
    },
    totalChargesPrepaid: function totalChargesPrepaid(newVal) {
      this.form.payment_info.total_charges_prepaid = newVal;
    },
    totalChargesCollect: function totalChargesCollect(newVal) {
      this.form.payment_info.total_charges_collect = newVal;
    },
    weightCharge: function weightCharge(newVal) {
      this.form.payment_info.weight_charge = newVal;
    },
    taxes: function taxes(newVal) {
      this.form.payment_info.taxes = newVal;
    },
    totalCharges: function totalCharges(newVal) {
      this.form.payment_info.total_charges = newVal;
    },
    totalDueAgentPrepaid: function totalDueAgentPrepaid(newVal) {
      this.form.payment_info.other_charges_due_agent_prepaid = newVal;
    },
    totalDueAgentCollect: function totalDueAgentCollect(newVal) {
      this.form.payment_info.other_charges_due_agent_collect = newVal;
    },
    totalDueCarrierPrepaid: function totalDueCarrierPrepaid(newVal) {
      this.form.payment_info.other_charges_due_carrier_prepaid = newVal;
    },
    totalDueCarrierCollect: function totalDueCarrierCollect(newVal) {
      this.form.payment_info.other_charges_due_carrier_collect = newVal;
    },
    "form.shipper_address.ship_name": function formShipper_addressShip_name(newVal) {
      if (!newVal) {
        this.selectedShipper = null;
        this.form.shipper_address = {
          ship_name: ""
        };
        this.filteredShippers = this.shippers;
      }
    },
    "form.consignee_address.cons_name": function formConsignee_addressCons_name(newVal) {
      if (!newVal) {
        this.selectedConsignee = null;
        this.form.consignee_address = {
          cons_name: ""
        };
        this.filteredConsignees = this.consignees;
      }
    },
    "form.also_notify_address.also_name": function formAlso_notify_addressAlso_name(newVal) {
      if (!newVal) {
        this.selectAlsoNotify = null;
        this.form.also_notify_address = {
          also_name: ""
        };
        this.filteredAlsoNotify = this.alsoNotify;
      }
    }
  },
  mounted: function mounted() {
    window.addEventListener('click', this.closeAllDropdowns);
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('click', this.closeAllDropdowns);
  },
  methods: {
    getCurrentDate: function getCurrentDate() {
      return new Date().toLocaleDateString("en-CA");
    },
    formatDate: function formatDate(date) {
      if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date.trim())) {
        var _date$trim$split = date.trim().split("/"),
          _date$trim$split2 = _slicedToArray(_date$trim$split, 3),
          day = _date$trim$split2[0],
          month = _date$trim$split2[1],
          year = _date$trim$split2[2];
        return "".concat(year, "-").concat(month, "-").concat(day);
      }
      return new Date(date).toLocaleDateString("en-CA");
    },
    addHsCode: function addHsCode() {
      this.hs_code_error = [];
      var hsCodeRegex = /^[a-zA-Z0-9]+$/;
      if (!this.consignment_list.hs_code) {
        this.hs_code_error.push("This field is empty.");
      } else if (!hsCodeRegex.test(this.consignment_list.hs_code)) {
        this.hs_code_error.push("HS Code can only contain letters,numbers");
      } else if (this.consignment_list.hs_code.length < 6 || this.consignment_list.hs_code.length > 18) {
        this.hs_code_error.push("HS Code must be between 6 to 18 characters/digits.");
      } else {
        this.consignment_list.hsCodes.push(this.consignment_list.hs_code);
        this.consignment_list.hs_code = "";
      }
    },
    removeHsCode: function removeHsCode(index) {
      this.consignment_list.hs_code = '';
      if (confirm('Are you sure you want to delete this HS Code?')) {
        this.consignment_list.hsCodes.splice(index, 1);
      }
    },
    displayModal: function displayModal() {
      this.$refs.modalConsignment.show();
    },
    closeModal: function closeModal() {
      this.$refs.modalConsignment.hide();
    },
    handleModalClose: function handleModalClose() {
      this.isConsignmentAdded = this.form.entries.length > 0;
    },
    addUldInfo: function addUldInfo() {
      this.uld_error = [];
      var _this$consignment_lis = this.consignment_list,
        uld_type = _this$consignment_lis.uld_type,
        uld_serial = _this$consignment_lis.uld_serial,
        owner = _this$consignment_lis.owner;
      var regex = {
        uldType: /^[a-zA-Z][A-Za-z0-9]{2}$/,
        uldSerial: /^[A-Za-z0-9]\d{3,4}$/,
        owner: /^[a-zA-Z0-9]{2}$/
      };
      if (!uld_type) this.uld_error.push("ULD Type is required.");else if (!regex.uldType.test(uld_type)) this.uld_error.push("ULD Type must be 3 characters: 1 alphabetic and 2 alphanumeric.");
      if (!uld_serial) this.uld_error.push("ULD Serial is required.");else if (!regex.uldSerial.test(uld_serial)) this.uld_error.push("ULD Serial must be in the format 'mnnn(n)' where 'm' is an alpha character and 'n' is a digit.");
      if (!owner) this.uld_error.push("Owner is required.");else if (!regex.owner.test(owner)) this.uld_error.push("Owner must be exactly 2 characters long and can only contain letters and digits.");
      if (this.uld_error.length > 0) {
        return;
      }
      this.consignment_list.uld_infos.push({
        uld_type: uld_type,
        uld_serial: uld_serial,
        owner: owner
      });
      this.consignment_list.uld_type = this.consignment_list.uld_serial = this.consignment_list.owner = "";
    },
    deleteUldInfo: function deleteUldInfo(index) {
      if (this.consignment_list.uld_infos && this.consignment_list.uld_infos.length > index) {
        this.consignment_list.uld_infos.splice(index, 1);
      }
    },
    editOciInfo: function editOciInfo(index) {
      this.editIndex = index;
      this.oci_info = _objectSpread({}, this.form.oci_entries[index]);
    },
    addOtherCustomInfo: function addOtherCustomInfo() {
      if (!this.oci_info.info_identifier || !this.oci_info.supplementary_info) {
        alert('Please fill in all fields');
        return;
      }
      if (this.editIndex !== null) {
        this.form.oci_entries[this.editIndex] = _objectSpread({}, this.oci_info);
        this.editIndex = null;
      } else {
        this.form.oci_entries.push(_objectSpread({}, this.oci_info));
      }
      for (var key in this.oci_info) {
        if (this.oci_info.hasOwnProperty(key)) {
          this.oci_info[key] = '';
        }
      }
    },
    deleteOciInfo: function deleteOciInfo(index) {
      if (this.form.oci_entries.length > index) {
        this.form.oci_entries.splice(index, 1);
      }
    },
    addPcsInfo: function addPcsInfo() {
      var _this = this;
      this.validationErrors = [];
      var rules = {
        pcs: {
          type: 'numeric',
          message: "PCS must be a valid number."
        },
        wgt: {
          type: 'numeric',
          min: 0.1,
          max: 9999999,
          message: "Weight must be between 0.1 and 9999999."
        },
        length: {
          type: 'regex',
          regex: /^[0-9]+$/,
          maxLength: 5,
          message: "Length must be a numeric value with a maximum of 5 digits."
        },
        width: {
          type: 'regex',
          regex: /^[0-9]+$/,
          maxLength: 5,
          message: "Width must be a numeric value with a maximum of 5 digits."
        },
        height: {
          type: 'regex',
          regex: /^[0-9]+$/,
          maxLength: 5,
          message: "Height must be a numeric value with a maximum of 5 digits."
        }
      };
      var _this$consignment_lis2 = this.consignment_list,
        pcs = _this$consignment_lis2.pcs,
        wgt = _this$consignment_lis2.wgt,
        length = _this$consignment_lis2.length,
        width = _this$consignment_lis2.width,
        height = _this$consignment_lis2.height,
        unit = _this$consignment_lis2.unit;
      if (this.remainingPieces <= 0) {
        this.validationErrors.push('All pieces are already added.');
        return;
      }
      if (pcs > this.remainingPieces) {
        this.validationErrors.push("You only need ".concat(this.remainingPieces, " more pieces to complete the total."));
        return;
      }
      if (!pcs) {
        this.validationErrors.push("When using dimensions or weight - pieces cannot be empty.");
      }
      if (length || width || height) {
        if (!length) {
          this.validationErrors.push("Please add length to the dimension");
        }
        if (!width) {
          this.validationErrors.push("Please add width to the dimension");
        }
        if (!height) {
          this.validationErrors.push("Please add height to the dimension");
        }
      }
      if (!length && !width && !height && !wgt) {
        this.validationErrors.push("Only pieces filled in, please add also weight (WGT) and/or dimensions.");
      }
      Object.keys(rules).forEach(function (field) {
        var rule = rules[field];
        var value = _this.consignment_list[field];
        if (value) {
          if (rule.type === 'numeric' && (isNaN(value) || value < rule.min || value > rule.max)) {
            _this.validationErrors.push(rule.message);
          } else if (rule.type === 'regex' && (!rule.regex.test(value) || value.length > rule.maxLength)) {
            _this.validationErrors.push(rule.message);
          }
        }
      });
      if (this.validationErrors.length > 0) {
        return;
      }
      this.consignment_list.itemss.push({
        pcs: pcs,
        wgt: wgt,
        length: length,
        width: width,
        height: height,
        unit: unit
      });
      this.consignment_list.pcs = '';
      this.consignment_list.wgt = '';
      this.consignment_list.length = '';
      this.consignment_list.width = '';
      this.consignment_list.height = '';
      this.consignment_list.unit = 'CMT';
    },
    deletePcs: function deletePcs(index) {
      if (this.consignment_list.itemss.length > index) {
        this.consignment_list.itemss.splice(index, 1);
      }
    },
    calculateTotalCharges: function calculateTotalCharges() {
      this.form.totals.total_amount = this.calculateTotalAmount();
    },
    getOriginCode: function getOriginCode(airportString) {
      if (airportString) {
        return airportString.split(',')[0];
      }
      return '';
    },
    getDestinationCode: function getDestinationCode(airportString) {
      if (airportString) {
        return airportString.split(',')[0];
      }
      return '';
    },
    calculateCharge: function calculateCharge() {
      var chargeRate = parseFloat(this.other_charges.charge);
      var weight = parseFloat(this.other_charges.chargable_weight1);
      if (!isNaN(weight) && this.other_charges.charge > 0 && !isNaN(chargeRate) && chargeRate > 0) {
        var calculatedAmount = weight * chargeRate;
        this.other_charges.amount = calculatedAmount.toFixed(2);
      } else {
        alert('Please enter valid numeric values for chargeable weight and charge rate.');
      }
    },
    addCharge: function addCharge() {
      var _this$other_charges = this.other_charges,
        other_charge_code = _this$other_charges.other_charge_code,
        other_code = _this$other_charges.other_code,
        amount = _this$other_charges.amount,
        due = _this$other_charges.due,
        payment_type = _this$other_charges.payment_type;
      var finalOtherChargeCode = other_code || other_charge_code;
      if (!finalOtherChargeCode) {
        alert("Other charge code is mandatory.");
        return;
      }
      var parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Amount is mandatory and must be a valid number greater than 0.");
        return;
      }
      var chargeData = {
        other_charge_code: finalOtherChargeCode,
        amount: parsedAmount,
        due: this.other_charges.due,
        payment_type: this.other_charges.payment_type
      };
      if (this.editIndex !== null) {
        this.$set(this.form.charges, this.editIndex, chargeData);
        this.editIndex = null;
      } else {
        this.form.charges.push(chargeData);
      }
      for (var key in this.other_charges) {
        if (this.other_charges.hasOwnProperty(key) && key !== 'due' && key !== 'payment_type') {
          this.other_charges[key] = '';
        }
      }
    },
    editCharge: function editCharge(index) {
      this.editIndex = index;
      this.other_charges = _objectSpread({}, this.form.charges[index]);
    },
    removeCharge: function removeCharge(index) {
      this.form.charges.splice(index, 1);
    },
    editEntry: function editEntry(index) {
      this.edit_entry_index = index;
      var consignment_data = this.form.entries[index];
      this.consignment_list.pieces = consignment_data.pieces;
      this.consignment_list.description = consignment_data.description;
      this.consignment_list.rate_class = consignment_data.rate_class;
      this.consignment_list.uld_rate_class = consignment_data.uld_rate_class;
      this.consignment_list.service_code = consignment_data.service_code;
      this.consignment_list.commodity_item = consignment_data.commodity_item;
      this.consignment_list.country_origin_goods = consignment_data.country_origin_goods;
      this.consignment_list.slac = consignment_data.slac;
      this.consignment_list.gross_weight = consignment_data.gross_weight;
      this.consignment_list.weight_code = consignment_data.weight_code;
      this.consignment_list.chargable_weight = consignment_data.chargable_weight;
      this.consignment_list.rate = consignment_data.rate;
      this.consignment_list.itemss = consignment_data.pieces_info ? JSON.parse(consignment_data.pieces_info) : [];
      this.consignment_list.hsCodes = consignment_data.hs_code ? JSON.parse(consignment_data.hs_code) : [];
      this.consignment_list.uld_infos = consignment_data.uld_info ? JSON.parse(consignment_data.uld_info) : [];
      this.$refs.modalConsignment.show();
      this.isConsignmentAdded = true;
      this.calculateTotalAmount();
    },
    deleteEntry: function deleteEntry(index) {
      this.form.entries.splice(index, 1);
      this.calculateTotalVolume();
      this.calculateTotalAmount();
      if (this.form.entries.length === 0) {
        this.isConsignmentAdded = false;
      }
    },
    addOrUpdateEntry: function addOrUpdateEntry(evt) {
      var _this2 = this;
      evt.preventDefault();
      if (!(this.consignment_list instanceof Form)) {
        this.consignment_list = new Form(this.consignment_list);
      }
      var url = this.consignmentUrl || '/user/get-consignment-error';
      this.consignment_list.post(url).then(function (response) {
        var updatedEntry = _objectSpread(_objectSpread({}, _this2.consignment_list), {}, {
          uld_info: JSON.stringify(_this2.consignment_list.uld_infos),
          pieces_info: JSON.stringify(_this2.consignment_list.itemss),
          hs_code: JSON.stringify(_this2.consignment_list.hsCodes)
        });
        if (_this2.edit_entry_index !== null) {
          _this2.form.entries[_this2.edit_entry_index] = updatedEntry;
          _this2.edit_entry_index = null;
        } else {
          _this2.form.entries.push(updatedEntry);
        }
        _this2.calculateTotalVolume();
        _this2.calculateTotalAmount();
        _this2.isConsignmentAdded = _this2.form.entries.length > 0;
        _this2.closeModal();
        for (var key in _this2.consignment_list) {
          if (key !== 'busy' && key !== 'successful' && key !== 'errors' && key !== 'originalData') {
            if (_typeof(_this2.consignment_list[key]) === 'object') {
              _this2.consignment_list[key] = [];
            } else {
              _this2.consignment_list[key] = '';
            }
          }
        }
        _this2.isConsignmentAdded = _this2.form.entries.length > 0;
      })["catch"](function (error) {
        // handle error
      });
    },
    calculateTotalVolume: function calculateTotalVolume() {
      var _this3 = this;
      var totalVolume = this.form.entries.reduce(function (total, entry) {
        return total + entry.itemss.reduce(function (entryTotal, item) {
          var length = parseFloat(item.length) || 0;
          var width = parseFloat(item.width) || 0;
          var height = parseFloat(item.height) || 0;
          var pcs = parseFloat(item.pcs) || 0;
          var dimensionUnit = item.unit;
          var volumeInCMT = length * width * height * pcs / 1000000;
          var volumeInCM3, volumeInFt3, volumeInIn3, volumeInM3;
          if (dimensionUnit === 'CMT') {
            volumeInCM3 = volumeInCMT * 1000000;
            volumeInFt3 = volumeInCMT * 35.3147;
            volumeInIn3 = volumeInCMT * 61023.7441;
          } else if (dimensionUnit === 'INH') {
            var volumeInInch = length * width * height * pcs;
            volumeInIn3 = volumeInInch;
            volumeInCM3 = volumeInInch * 16.387;
            volumeInFt3 = volumeInInch * 0.0005787037;
            volumeInM3 = volumeInInch * 0.000016387064;
          } else if (dimensionUnit === 'FOT') {
            var volumeInFoot = length * width * height * pcs;
            volumeInFt3 = volumeInFoot;
            volumeInCM3 = volumeInFoot * 28316.8466;
            volumeInM3 = volumeInFoot * 0.0283168466;
            volumeInIn3 = volumeInFoot * 1728;
          }
          var selectedUnit = _this3.form.totals.dimention_unit;
          var finalVolume = 0;
          switch (selectedUnit) {
            case 'CMQ':
              finalVolume = volumeInCM3;
              break;
            case 'MTQ':
              finalVolume = volumeInM3 || volumeInCMT;
              break;
            case 'FTQ':
              finalVolume = volumeInFt3;
              break;
            case 'INQ':
              finalVolume = volumeInIn3;
              break;
            default:
              finalVolume = volumeInCM3;
          }
          return entryTotal + finalVolume;
        }, 0);
      }, 0);
      this.form.totals.total_volume = totalVolume.toFixed(2);
    },
    calculateTotalAmount: function calculateTotalAmount() {
      var chargeableWeight = this.consignment_list.chargable_weight;
      var rate_class = this.consignment_list.rate_class;
      this.form.totals.total_amount = 0;
      if (rate_class === "B" || rate_class === "M") {
        this.form.totals.total_amount = parseFloat(this.consignment_list.rate) || 0;
      } else if (rate_class === "P" || rate_class === "X") {
        this.form.totals.total_amount = 0;
      } else {
        this.form.totals.total_amount = chargeableWeight * this.consignment_list.rate;
      }
    },
    handleAddConsignment: function handleAddConsignment() {
      if (this.isConsignmentAdded) {
        this.$bvToast.toast('Consignment Information is already added.', {
          title: 'Information',
          variant: 'warning',
          solid: true
        });
      } else {
        this.$refs.modalConsignment.show();
        this.isConsignmentAdded = true;
      }
    },
    onSelect: function onSelect(value) {
      if (value) {
        window.location.href = value;
      }
    },
    validateTextarea: function validateTextarea() {
      var text = this.form.custom_origin.other_service_information || '';
      var lines = text.split(/\r?\n/);
      if (text.length > 195) this.form.custom_origin.other_service_information = text.slice(0, 195);
      if (lines.length > 3) {
        alert("You can add a maximum of three lines.");
        this.form.custom_origin.other_service_information = lines.slice(0, 3).join("\n");
      }
      this.charCount = this.form.custom_origin.other_service_information.length;
      this.lineCount = this.form.custom_origin.other_service_information.split(/\r?\n/).length;
    },
    toggleDropdown: function toggleDropdown(name, event) {
      if (typeof event === 'boolean') {
        if (event) {
          this.activeDropdown = name;
        } else if (this.activeDropdown === name) {
          this.activeDropdown = null;
        }
      } else {
        this.activeDropdown = this.activeDropdown === name ? null : name;
      }
    },
    selectLocation: function selectLocation(name, item, parentPath) {
      var formattedVal = "".concat(item.iata_code, ", ").concat(item.destination);
      if (parentPath === 'agent_information') {
        this.agent_information[name] = formattedVal;
      } else {
        this.form.routing_information[name] = formattedVal;
      }
      this.activeDropdown = null;
    },
    getFilteredLocations: function getFilteredLocations(query) {
      var q = (query || '').toLowerCase().trim();
      if (!q) return this.location;
      return this.location.filter(function (item) {
        return item.iata_code.toLowerCase().includes(q);
      });
    },
    filterShippers: function filterShippers() {
      var query = (this.form.shipper_address.ship_name || '').toLowerCase();
      if (!query) {
        this.filteredShippers = this.shippers;
        return this.shippers;
      }
      return this.filteredShippers = this.shippers.filter(function (shipper) {
        return shipper.name.toLowerCase().includes(query);
      });
    },
    filterConsignee: function filterConsignee() {
      var query = (this.form.consignee_address.cons_name || '').toLowerCase();
      if (!query) {
        this.filteredConsignees = this.consignees;
        return this.consignees;
      }
      return this.filteredConsignees = this.consignees.filter(function (consignee) {
        return consignee.name.toLowerCase().includes(query);
      });
    },
    filteralsoNotify: function filteralsoNotify() {
      var query = (this.form.also_notify_address.also_name || '').toLowerCase();
      if (!query) {
        this.filteredAlsoNotify = this.alsoNotify;
        return this.alsoNotify;
      }
      return this.filteredAlsoNotify = this.alsoNotify.filter(function (notify) {
        return notify.name.toLowerCase().includes(query);
      });
    },
    closeAllDropdowns: function closeAllDropdowns(event) {
      if (!this.activeDropdown) return;
      var refName = 'dropdownContainer_' + this.activeDropdown;
      if (this.activeDropdown === 'issuing_loc' || this.activeDropdown === 'issue') {
        refName = 'dropdownContainer_issue';
      }
      var container = this.$refs[refName];
      if (container && typeof container.contains === 'function') {
        if (!container.contains(event.target)) {
          this.activeDropdown = null;
        }
      } else {
        this.activeDropdown = null;
      }
    },
    selectShipper: function selectShipper(shipper) {
      this.selectedShipper = shipper.id;
      this.form.shipper_address = shipper.name;
      this.fillShipperDetails(shipper.id);
      this.activeDropdown = null;
    },
    selectConsignee: function selectConsignee(consignee) {
      this.selectedConsignee = consignee.id;
      this.form.consignee_address = consignee.name;
      this.fillConsigneeDetails(consignee.id);
      this.activeDropdown = null;
    },
    selectAlsoNotifyA: function selectAlsoNotifyA(also_notify) {
      this.selectAlsoNotify = also_notify.id;
      this.form.also_notify_address = also_notify.name;
      this.fillAlsoNotifyDetails(also_notify.id);
      this.activeDropdown = null;
    }
  }
});

/***/ }),

/***/ "./resources/js/src/view/pages/public/blogData.js":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/public/blogData.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
  image: "/media/assets/blog/futuristic-hud-overlays.webp",
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
  image: "/media/assets/blog/fwb-fhl.webp",
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
  image: "/media/assets/blog/global-airline-network.webp",
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
  image: "/media/assets/blog/futuristic-awb-dashboard.webp",
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
  image: "/media/assets/blog/futuristic-cargo-logistics.webp",
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
  image: "/media/assets/blog/night-airport-apron.webp",
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
  image: "/media/assets/blog/hightech-control-room.webp",
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
  image: "/media/assets/logos/white-logo.png",
  excerpt: "Discover the vision behind F16s, our roadmap for global logistics automation, and how we're bridging the gap between freight agents and airlines.",
  metaTitle: "F16s Editorial: Digital Transformation in Freight Forwarding",
  metaDescription: "Explore the F16s vision for a connected, paperless, and automated air freight industry. Learn about our EDI integrations and e-AWB compliance solutions.",
  content: "\n        <p>In an era where speed and transparency are no longer luxuries but necessities, the logistics industry is undergoing a massive shift. At <strong>F16s</strong>, we aren't just building software; we are architecting the future of how goods move across the globe.</p>\n        \n        <h3>The Vision: A Truly Connected Supply Chain</h3>\n        <p>For too long, the freight forwarding industry has been hampered by manual data entry, fragmented communication, and outdated legacy systems. Our mission is to eliminate these bottlenecks by providing a unified digital ecosystem. Whether you are managing <a href=\"/services\">air freight</a>, sea cargo, or road logistics, F16s provides the real-time visibility needed to succeed.</p>\n        \n        <h3>Bridging the Gap with Direct Airline Connectivity</h3>\n        <p>One of the core pillars of our platform is direct EDI integration. We connect forwarders directly to over 100+ major airlines, including Emirates, Qatar Airways, and Lufthansa. This allows for instant booking, automated FWB/FHL transmissions, and real-time status updates\u2014all from a single dashboard. You can learn more about our technical <a href=\"/solutions\">logistics solutions</a> here.</p>\n        \n        <h3>Why Digital Transformation Matters Now</h3>\n        <p>The transition to full e-AWB compliance is not just about saving paper; it's about data integrity. By automating the generation of Master Air Waybills (MAWB) and House Air Waybills (HAWB), we reduce 'fat-finger' errors that lead to costly delays at customs and airport warehouses. Our <a href=\"/product-description\">product features</a> are designed to handle these complexities with ease.</p>\n        \n        <h3>Looking Ahead</h3>\n        <p>As we continue to expand our network and refine our AI-driven extraction tools, F16s remains committed to being the backbone of your digital operations. We invite you to <a href=\"/about-us\">learn more about our team</a> or <a href=\"/contact-us\">get in touch</a> to see how we can transform your business today.</p>\n    ",
  takeaways: ["F16s is dedicated to bridging the digital gap in global logistics.", "Direct airline EDI connectivity is a cornerstone of our automation strategy.", "Internal automation reduces errors in MAWB/HAWB documentation.", "Our roadmap focuses on full paperless e-AWB compliance."]
}];

/***/ }),

/***/ "./node_modules/date-format-parse/es/format.js":
/*!*****************************************************!*\
  !*** ./node_modules/date-format-parse/es/format.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "format": () => (/* binding */ format)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./node_modules/date-format-parse/es/util.js");
/* harmony import */ var _locale_en__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locale/en */ "./node_modules/date-format-parse/es/locale/en.js");


var REGEX_FORMAT = /\[([^\]]+)]|YYYY|YY?|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|Z{1,2}|S{1,3}|w{1,2}|x|X|a|A/g;

function pad(val) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var output = "".concat(Math.abs(val));
  var sign = val < 0 ? '-' : '';

  while (output.length < len) {
    output = "0".concat(output);
  }

  return sign + output;
}

function getOffset(date) {
  return Math.round(date.getTimezoneOffset() / 15) * 15;
}

function formatTimezone(offset) {
  var delimeter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + pad(hours, 2) + delimeter + pad(minutes, 2);
}

var meridiem = function meridiem(h, _, isLowercase) {
  var word = h < 12 ? 'AM' : 'PM';
  return isLowercase ? word.toLocaleLowerCase() : word;
};

var formatFlags = {
  Y: function Y(date) {
    var y = date.getFullYear();
    return y <= 9999 ? "".concat(y) : "+".concat(y);
  },
  // Year: 00, 01, ..., 99
  YY: function YY(date) {
    return pad(date.getFullYear(), 4).substr(2);
  },
  // Year: 1900, 1901, ..., 2099
  YYYY: function YYYY(date) {
    return pad(date.getFullYear(), 4);
  },
  // Month: 1, 2, ..., 12
  M: function M(date) {
    return date.getMonth() + 1;
  },
  // Month: 01, 02, ..., 12
  MM: function MM(date) {
    return pad(date.getMonth() + 1, 2);
  },
  MMM: function MMM(date, locale) {
    return locale.monthsShort[date.getMonth()];
  },
  MMMM: function MMMM(date, locale) {
    return locale.months[date.getMonth()];
  },
  // Day of month: 1, 2, ..., 31
  D: function D(date) {
    return date.getDate();
  },
  // Day of month: 01, 02, ..., 31
  DD: function DD(date) {
    return pad(date.getDate(), 2);
  },
  // Hour: 0, 1, ... 23
  H: function H(date) {
    return date.getHours();
  },
  // Hour: 00, 01, ..., 23
  HH: function HH(date) {
    return pad(date.getHours(), 2);
  },
  // Hour: 1, 2, ..., 12
  h: function h(date) {
    var hours = date.getHours();

    if (hours === 0) {
      return 12;
    }

    if (hours > 12) {
      return hours % 12;
    }

    return hours;
  },
  // Hour: 01, 02, ..., 12
  hh: function hh() {
    var hours = formatFlags.h.apply(formatFlags, arguments);
    return pad(hours, 2);
  },
  // Minute: 0, 1, ..., 59
  m: function m(date) {
    return date.getMinutes();
  },
  // Minute: 00, 01, ..., 59
  mm: function mm(date) {
    return pad(date.getMinutes(), 2);
  },
  // Second: 0, 1, ..., 59
  s: function s(date) {
    return date.getSeconds();
  },
  // Second: 00, 01, ..., 59
  ss: function ss(date) {
    return pad(date.getSeconds(), 2);
  },
  // 1/10 of second: 0, 1, ..., 9
  S: function S(date) {
    return Math.floor(date.getMilliseconds() / 100);
  },
  // 1/100 of second: 00, 01, ..., 99
  SS: function SS(date) {
    return pad(Math.floor(date.getMilliseconds() / 10), 2);
  },
  // Millisecond: 000, 001, ..., 999
  SSS: function SSS(date) {
    return pad(date.getMilliseconds(), 3);
  },
  // Day of week: 0, 1, ..., 6
  d: function d(date) {
    return date.getDay();
  },
  // Day of week: 'Su', 'Mo', ..., 'Sa'
  dd: function dd(date, locale) {
    return locale.weekdaysMin[date.getDay()];
  },
  // Day of week: 'Sun', 'Mon',..., 'Sat'
  ddd: function ddd(date, locale) {
    return locale.weekdaysShort[date.getDay()];
  },
  // Day of week: 'Sunday', 'Monday', ...,'Saturday'
  dddd: function dddd(date, locale) {
    return locale.weekdays[date.getDay()];
  },
  // AM, PM
  A: function A(date, locale) {
    var meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), false);
  },
  // am, pm
  a: function a(date, locale) {
    var meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), true);
  },
  // Timezone: -01:00, +00:00, ... +12:00
  Z: function Z(date) {
    return formatTimezone(getOffset(date), ':');
  },
  // Timezone: -0100, +0000, ... +1200
  ZZ: function ZZ(date) {
    return formatTimezone(getOffset(date));
  },
  // Seconds timestamp: 512969520
  X: function X(date) {
    return Math.floor(date.getTime() / 1000);
  },
  // Milliseconds timestamp: 512969520900
  x: function x(date) {
    return date.getTime();
  },
  w: function w(date, locale) {
    return (0,_util__WEBPACK_IMPORTED_MODULE_0__.getWeek)(date, {
      firstDayOfWeek: locale.firstDayOfWeek,
      firstWeekContainsDate: locale.firstWeekContainsDate
    });
  },
  ww: function ww(date, locale) {
    return pad(formatFlags.w(date, locale), 2);
  }
};
function format(val, str) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var formatStr = str ? String(str) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  var date = (0,_util__WEBPACK_IMPORTED_MODULE_0__.toDate)(val);

  if (!(0,_util__WEBPACK_IMPORTED_MODULE_0__.isValidDate)(date)) {
    return 'Invalid Date';
  }

  var locale = options.locale || _locale_en__WEBPACK_IMPORTED_MODULE_1__["default"];
  return formatStr.replace(REGEX_FORMAT, function (match, p1) {
    if (p1) {
      return p1;
    }

    if (typeof formatFlags[match] === 'function') {
      return "".concat(formatFlags[match](date, locale));
    }

    return match;
  });
}

/***/ }),

/***/ "./node_modules/date-format-parse/es/index.js":
/*!****************************************************!*\
  !*** ./node_modules/date-format-parse/es/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "format": () => (/* reexport safe */ _format__WEBPACK_IMPORTED_MODULE_0__.format),
/* harmony export */   "getWeek": () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.getWeek),
/* harmony export */   "isDate": () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.isDate),
/* harmony export */   "isValidDate": () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.isValidDate),
/* harmony export */   "parse": () => (/* reexport safe */ _parse__WEBPACK_IMPORTED_MODULE_1__.parse),
/* harmony export */   "toDate": () => (/* reexport safe */ _util__WEBPACK_IMPORTED_MODULE_2__.toDate)
/* harmony export */ });
/* harmony import */ var _format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./format */ "./node_modules/date-format-parse/es/format.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parse */ "./node_modules/date-format-parse/es/parse.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./node_modules/date-format-parse/es/util.js");




/***/ }),

/***/ "./node_modules/date-format-parse/es/locale/en.js":
/*!********************************************************!*\
  !*** ./node_modules/date-format-parse/es/locale/en.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var locale = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  firstDayOfWeek: 0,
  firstWeekContainsDate: 1
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (locale);

/***/ }),

/***/ "./node_modules/date-format-parse/es/parse.js":
/*!****************************************************!*\
  !*** ./node_modules/date-format-parse/es/parse.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _locale_en__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./locale/en */ "./node_modules/date-format-parse/es/locale/en.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./node_modules/date-format-parse/es/util.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var formattingTokens = /(\[[^\[]*\])|(MM?M?M?|Do|DD?|ddd?d?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|S{1,3}|x|X|ZZ?|.)/g;
var match1 = /\d/; // 0 - 9

var match2 = /\d\d/; // 00 - 99

var match3 = /\d{3}/; // 000 - 999

var match4 = /\d{4}/; // 0000 - 9999

var match1to2 = /\d\d?/; // 0 - 99

var matchShortOffset = /[+-]\d\d:?\d\d/; // +00:00 -00:00 +0000 or -0000

var matchSigned = /[+-]?\d+/; // -inf - inf

var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123
// const matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i; // Word

var YEAR = 'year';
var MONTH = 'month';
var DAY = 'day';
var HOUR = 'hour';
var MINUTE = 'minute';
var SECOND = 'second';
var MILLISECOND = 'millisecond';
var parseFlags = {};

var addParseFlag = function addParseFlag(token, regex, callback) {
  var tokens = Array.isArray(token) ? token : [token];
  var func;

  if (typeof callback === 'string') {
    func = function func(input) {
      var value = parseInt(input, 10);
      return _defineProperty({}, callback, value);
    };
  } else {
    func = callback;
  }

  tokens.forEach(function (key) {
    parseFlags[key] = [regex, func];
  });
};

var escapeStringRegExp = function escapeStringRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
};

var matchWordRegExp = function matchWordRegExp(localeKey) {
  return function (locale) {
    var array = locale[localeKey];

    if (!Array.isArray(array)) {
      throw new Error("Locale[".concat(localeKey, "] need an array"));
    }

    return new RegExp(array.map(escapeStringRegExp).join('|'));
  };
};

var matchWordCallback = function matchWordCallback(localeKey, key) {
  return function (input, locale) {
    var array = locale[localeKey];

    if (!Array.isArray(array)) {
      throw new Error("Locale[".concat(localeKey, "] need an array"));
    }

    var index = array.indexOf(input);

    if (index < 0) {
      throw new Error('Invalid Word');
    }

    return _defineProperty({}, key, index);
  };
};

addParseFlag('Y', matchSigned, YEAR);
addParseFlag('YY', match2, function (input) {
  var year = new Date().getFullYear();
  var cent = Math.floor(year / 100);
  var value = parseInt(input, 10);
  value = (value > 68 ? cent - 1 : cent) * 100 + value;
  return _defineProperty({}, YEAR, value);
});
addParseFlag('YYYY', match4, YEAR);
addParseFlag('M', match1to2, function (input) {
  return _defineProperty({}, MONTH, parseInt(input, 10) - 1);
});
addParseFlag('MM', match2, function (input) {
  return _defineProperty({}, MONTH, parseInt(input, 10) - 1);
});
addParseFlag('MMM', matchWordRegExp('monthsShort'), matchWordCallback('monthsShort', MONTH));
addParseFlag('MMMM', matchWordRegExp('months'), matchWordCallback('months', MONTH));
addParseFlag('D', match1to2, DAY);
addParseFlag('DD', match2, DAY);
addParseFlag(['H', 'h'], match1to2, HOUR);
addParseFlag(['HH', 'hh'], match2, HOUR);
addParseFlag('m', match1to2, MINUTE);
addParseFlag('mm', match2, MINUTE);
addParseFlag('s', match1to2, SECOND);
addParseFlag('ss', match2, SECOND);
addParseFlag('S', match1, function (input) {
  return _defineProperty({}, MILLISECOND, parseInt(input, 10) * 100);
});
addParseFlag('SS', match2, function (input) {
  return _defineProperty({}, MILLISECOND, parseInt(input, 10) * 10);
});
addParseFlag('SSS', match3, MILLISECOND);

function matchMeridiem(locale) {
  return locale.meridiemParse || /[ap]\.?m?\.?/i;
}

function defaultIsPM(input) {
  return "".concat(input).toLowerCase().charAt(0) === 'p';
}

addParseFlag(['A', 'a'], matchMeridiem, function (input, locale) {
  var isPM = typeof locale.isPM === 'function' ? locale.isPM(input) : defaultIsPM(input);
  return {
    isPM: isPM
  };
});

function offsetFromString(str) {
  var _ref8 = str.match(/([+-]|\d\d)/g) || ['-', '0', '0'],
      _ref9 = _slicedToArray(_ref8, 3),
      symbol = _ref9[0],
      hour = _ref9[1],
      minute = _ref9[2];

  var minutes = parseInt(hour, 10) * 60 + parseInt(minute, 10);

  if (minutes === 0) {
    return 0;
  }

  return symbol === '+' ? -minutes : +minutes;
}

addParseFlag(['Z', 'ZZ'], matchShortOffset, function (input) {
  return {
    offset: offsetFromString(input)
  };
});
addParseFlag('x', matchSigned, function (input) {
  return {
    date: new Date(parseInt(input, 10))
  };
});
addParseFlag('X', matchTimestamp, function (input) {
  return {
    date: new Date(parseFloat(input) * 1000)
  };
});
addParseFlag('d', match1, 'weekday');
addParseFlag('dd', matchWordRegExp('weekdaysMin'), matchWordCallback('weekdaysMin', 'weekday'));
addParseFlag('ddd', matchWordRegExp('weekdaysShort'), matchWordCallback('weekdaysShort', 'weekday'));
addParseFlag('dddd', matchWordRegExp('weekdays'), matchWordCallback('weekdays', 'weekday'));
addParseFlag('w', match1to2, 'week');
addParseFlag('ww', match2, 'week');

function to24hour(hour, isPM) {
  if (hour !== undefined && isPM !== undefined) {
    if (isPM) {
      if (hour < 12) {
        return hour + 12;
      }
    } else if (hour === 12) {
      return 0;
    }
  }

  return hour;
}

function getFullInputArray(input) {
  var backupDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var result = [0, 0, 1, 0, 0, 0, 0];
  var backupArr = [backupDate.getFullYear(), backupDate.getMonth(), backupDate.getDate(), backupDate.getHours(), backupDate.getMinutes(), backupDate.getSeconds(), backupDate.getMilliseconds()];
  var useBackup = true;

  for (var i = 0; i < 7; i++) {
    if (input[i] === undefined) {
      result[i] = useBackup ? backupArr[i] : result[i];
    } else {
      result[i] = input[i];
      useBackup = false;
    }
  }

  return result;
}

function createDate(y, m, d, h, M, s, ms) {
  var date;

  if (y < 100 && y >= 0) {
    date = new Date(y + 400, m, d, h, M, s, ms);

    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m, d, h, M, s, ms);
  }

  return date;
}

function createUTCDate() {
  var date;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var y = args[0];

  if (y < 100 && y >= 0) {
    args[0] += 400;
    date = new Date(Date.UTC.apply(Date, args)); // eslint-disable-next-line no-restricted-globals

    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(Date, args));
  }

  return date;
}

function makeParser(dateString, format, locale) {
  var tokens = format.match(formattingTokens);

  if (!tokens) {
    throw new Error();
  }

  var length = tokens.length;
  var mark = {};

  for (var i = 0; i < length; i += 1) {
    var token = tokens[i];
    var parseTo = parseFlags[token];

    if (!parseTo) {
      var word = token.replace(/^\[|\]$/g, '');

      if (dateString.indexOf(word) === 0) {
        dateString = dateString.substr(word.length);
      } else {
        throw new Error('not match');
      }
    } else {
      var regex = typeof parseTo[0] === 'function' ? parseTo[0](locale) : parseTo[0];
      var parser = parseTo[1];
      var value = (regex.exec(dateString) || [])[0];
      var obj = parser(value, locale);
      mark = _objectSpread({}, mark, {}, obj);
      dateString = dateString.replace(value, '');
    }
  }

  return mark;
}

function parse(str, format) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  try {
    var _options$locale = options.locale,
        _locale = _options$locale === void 0 ? _locale_en__WEBPACK_IMPORTED_MODULE_0__["default"] : _options$locale,
        _options$backupDate = options.backupDate,
        backupDate = _options$backupDate === void 0 ? new Date() : _options$backupDate;

    var parseResult = makeParser(str, format, _locale);
    var year = parseResult.year,
        month = parseResult.month,
        day = parseResult.day,
        hour = parseResult.hour,
        minute = parseResult.minute,
        second = parseResult.second,
        millisecond = parseResult.millisecond,
        isPM = parseResult.isPM,
        date = parseResult.date,
        offset = parseResult.offset,
        weekday = parseResult.weekday,
        week = parseResult.week;

    if (date) {
      return date;
    }

    var inputArray = [year, month, day, hour, minute, second, millisecond];
    inputArray[3] = to24hour(inputArray[3], isPM); // check week

    if (week !== undefined && month === undefined && day === undefined) {
      // new Date(year, 3) make sure in current year
      var firstDate = (0,_util__WEBPACK_IMPORTED_MODULE_1__.startOfWeekYear)(year === undefined ? backupDate : new Date(year, 3), {
        firstDayOfWeek: _locale.firstDayOfWeek,
        firstWeekContainsDate: _locale.firstWeekContainsDate
      });
      return new Date(firstDate.getTime() + (week - 1) * 7 * 24 * 3600 * 1000);
    }

    var parsedDate;
    var result = getFullInputArray(inputArray, backupDate);

    if (offset !== undefined) {
      result[6] += offset * 60 * 1000;
      parsedDate = createUTCDate.apply(void 0, _toConsumableArray(result));
    } else {
      parsedDate = createDate.apply(void 0, _toConsumableArray(result));
    } // check weekday


    if (weekday !== undefined && parsedDate.getDay() !== weekday) {
      return new Date(NaN);
    }

    return parsedDate;
  } catch (e) {
    return new Date(NaN);
  }
}

/***/ }),

/***/ "./node_modules/date-format-parse/es/util.js":
/*!***************************************************!*\
  !*** ./node_modules/date-format-parse/es/util.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getWeek": () => (/* binding */ getWeek),
/* harmony export */   "isDate": () => (/* binding */ isDate),
/* harmony export */   "isValidDate": () => (/* binding */ isValidDate),
/* harmony export */   "startOfWeek": () => (/* binding */ startOfWeek),
/* harmony export */   "startOfWeekYear": () => (/* binding */ startOfWeekYear),
/* harmony export */   "toDate": () => (/* binding */ toDate)
/* harmony export */ });
function isDate(value) {
  return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
}
function toDate(value) {
  if (isDate(value)) {
    return new Date(value.getTime());
  }

  if (value == null) {
    return new Date(NaN);
  }

  return new Date(value);
}
function isValidDate(value) {
  return isDate(value) && !isNaN(value.getTime());
}
function startOfWeek(value) {
  var firstDayOfWeek = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!(firstDayOfWeek >= 0 && firstDayOfWeek <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6');
  }

  var date = toDate(value);
  var day = date.getDay();
  var diff = (day + 7 - firstDayOfWeek) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfWeekYear(value) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$firstDayOfWeek = _ref.firstDayOfWeek,
      firstDayOfWeek = _ref$firstDayOfWeek === void 0 ? 0 : _ref$firstDayOfWeek,
      _ref$firstWeekContain = _ref.firstWeekContainsDate,
      firstWeekContainsDate = _ref$firstWeekContain === void 0 ? 1 : _ref$firstWeekContain;

  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7');
  }

  var date = toDate(value);
  var year = date.getFullYear();
  var firstDateOfFirstWeek = new Date(0);

  for (var i = year + 1; i >= year - 1; i--) {
    firstDateOfFirstWeek.setFullYear(i, 0, firstWeekContainsDate);
    firstDateOfFirstWeek.setHours(0, 0, 0, 0);
    firstDateOfFirstWeek = startOfWeek(firstDateOfFirstWeek, firstDayOfWeek);

    if (date.getTime() >= firstDateOfFirstWeek.getTime()) {
      break;
    }
  }

  return firstDateOfFirstWeek;
}
function getWeek(value) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$firstDayOfWeek = _ref2.firstDayOfWeek,
      firstDayOfWeek = _ref2$firstDayOfWeek === void 0 ? 0 : _ref2$firstDayOfWeek,
      _ref2$firstWeekContai = _ref2.firstWeekContainsDate,
      firstWeekContainsDate = _ref2$firstWeekContai === void 0 ? 1 : _ref2$firstWeekContai;

  var date = toDate(value);
  var firstDateOfThisWeek = startOfWeek(date, firstDayOfWeek);
  var firstDateOfFirstWeek = startOfWeekYear(date, {
    firstDayOfWeek: firstDayOfWeek,
    firstWeekContainsDate: firstWeekContainsDate
  });
  var diff = firstDateOfThisWeek.getTime() - firstDateOfFirstWeek.getTime();
  return Math.round(diff / (7 * 24 * 3600 * 1000)) + 1;
}

/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css":
/*!**********************************************************************!*\
  !*** ./node_modules/@riophae/vue-treeselect/dist/vue-treeselect.css ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/vue2-datepicker/index.css":
/*!************************************************!*\
  !*** ./node_modules/vue2-datepicker/index.css ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/sweetalert2/dist/sweetalert2.all.js":
/*!**********************************************************!*\
  !*** ./node_modules/sweetalert2/dist/sweetalert2.all.js ***!
  \**********************************************************/
/***/ (function(module) {

/*!
* sweetalert2 v9.17.4
* Released under the MIT License.
*/
(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var consolePrefix = 'SweetAlert2:';
  /**
   * Filter the unique values into a new array
   * @param arr
   */

  var uniqueArray = function uniqueArray(arr) {
    var result = [];

    for (var i = 0; i < arr.length; i++) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }

    return result;
  };
  /**
   * Capitalize the first letter of a string
   * @param str
   */

  var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  /**
   * Returns the array of object values (Object.values isn't supported in IE11)
   * @param obj
   */

  var objectValues = function objectValues(obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  };
  /**
   * Convert NodeList to Array
   * @param nodeList
   */

  var toArray = function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };
  /**
   * Standardise console warnings
   * @param message
   */

  var warn = function warn(message) {
    console.warn("".concat(consolePrefix, " ").concat(message));
  };
  /**
   * Standardise console errors
   * @param message
   */

  var error = function error(message) {
    console.error("".concat(consolePrefix, " ").concat(message));
  };
  /**
   * Private global state for `warnOnce`
   * @type {Array}
   * @private
   */

  var previousWarnOnceMessages = [];
  /**
   * Show a console warning, but only if it hasn't already been shown
   * @param message
   */

  var warnOnce = function warnOnce(message) {
    if (!(previousWarnOnceMessages.indexOf(message) !== -1)) {
      previousWarnOnceMessages.push(message);
      warn(message);
    }
  };
  /**
   * Show a one-time console warning about deprecated params/methods
   */

  var warnAboutDepreation = function warnAboutDepreation(deprecatedParam, useInstead) {
    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
  };
  /**
   * If `arg` is a function, call it (with no arguments or context) and return the result.
   * Otherwise, just pass the value through
   * @param arg
   */

  var callIfFunction = function callIfFunction(arg) {
    return typeof arg === 'function' ? arg() : arg;
  };
  var hasToPromiseFn = function hasToPromiseFn(arg) {
    return arg && typeof arg.toPromise === 'function';
  };
  var asPromise = function asPromise(arg) {
    return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
  };
  var isPromise = function isPromise(arg) {
    return arg && Promise.resolve(arg) === arg;
  };

  var DismissReason = Object.freeze({
    cancel: 'cancel',
    backdrop: 'backdrop',
    close: 'close',
    esc: 'esc',
    timer: 'timer'
  });

  var isJqueryElement = function isJqueryElement(elem) {
    return _typeof(elem) === 'object' && elem.jquery;
  };

  var isElement = function isElement(elem) {
    return elem instanceof Element || isJqueryElement(elem);
  };

  var argsToParams = function argsToParams(args) {
    var params = {};

    if (_typeof(args[0]) === 'object' && !isElement(args[0])) {
      _extends(params, args[0]);
    } else {
      ['title', 'html', 'icon'].forEach(function (name, index) {
        var arg = args[index];

        if (typeof arg === 'string' || isElement(arg)) {
          params[name] = arg;
        } else if (arg !== undefined) {
          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(_typeof(arg)));
        }
      });
    }

    return params;
  };

  var swalPrefix = 'swal2-';
  var prefix = function prefix(items) {
    var result = {};

    for (var i in items) {
      result[items[i]] = swalPrefix + items[i];
    }

    return result;
  };
  var swalClasses = prefix(['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'toast-column', 'show', 'hide', 'close', 'title', 'header', 'content', 'html-container', 'actions', 'confirm', 'cancel', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error']);
  var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

  var getContainer = function getContainer() {
    return document.body.querySelector(".".concat(swalClasses.container));
  };
  var elementBySelector = function elementBySelector(selectorString) {
    var container = getContainer();
    return container ? container.querySelector(selectorString) : null;
  };

  var elementByClass = function elementByClass(className) {
    return elementBySelector(".".concat(className));
  };

  var getPopup = function getPopup() {
    return elementByClass(swalClasses.popup);
  };
  var getIcons = function getIcons() {
    var popup = getPopup();
    return toArray(popup.querySelectorAll(".".concat(swalClasses.icon)));
  };
  var getIcon = function getIcon() {
    var visibleIcon = getIcons().filter(function (icon) {
      return isVisible(icon);
    });
    return visibleIcon.length ? visibleIcon[0] : null;
  };
  var getTitle = function getTitle() {
    return elementByClass(swalClasses.title);
  };
  var getContent = function getContent() {
    return elementByClass(swalClasses.content);
  };
  var getHtmlContainer = function getHtmlContainer() {
    return elementByClass(swalClasses['html-container']);
  };
  var getImage = function getImage() {
    return elementByClass(swalClasses.image);
  };
  var getProgressSteps = function getProgressSteps() {
    return elementByClass(swalClasses['progress-steps']);
  };
  var getValidationMessage = function getValidationMessage() {
    return elementByClass(swalClasses['validation-message']);
  };
  var getConfirmButton = function getConfirmButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
  };
  var getCancelButton = function getCancelButton() {
    return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
  };
  var getActions = function getActions() {
    return elementByClass(swalClasses.actions);
  };
  var getHeader = function getHeader() {
    return elementByClass(swalClasses.header);
  };
  var getFooter = function getFooter() {
    return elementByClass(swalClasses.footer);
  };
  var getTimerProgressBar = function getTimerProgressBar() {
    return elementByClass(swalClasses['timer-progress-bar']);
  };
  var getCloseButton = function getCloseButton() {
    return elementByClass(swalClasses.close);
  }; // https://github.com/jkup/focusable/blob/master/index.js

  var focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
  var getFocusableElements = function getFocusableElements() {
    var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) // sort according to tabindex
    .sort(function (a, b) {
      a = parseInt(a.getAttribute('tabindex'));
      b = parseInt(b.getAttribute('tabindex'));

      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }

      return 0;
    });
    var otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter(function (el) {
      return el.getAttribute('tabindex') !== '-1';
    });
    return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter(function (el) {
      return isVisible(el);
    });
  };
  var isModal = function isModal() {
    return !isToast() && !document.body.classList.contains(swalClasses['no-backdrop']);
  };
  var isToast = function isToast() {
    return document.body.classList.contains(swalClasses['toast-shown']);
  };
  var isLoading = function isLoading() {
    return getPopup().hasAttribute('data-loading');
  };

  var states = {
    previousBodyPadding: null
  };
  var setInnerHtml = function setInnerHtml(elem, html) {
    // #1926
    elem.textContent = '';

    if (html) {
      var parser = new DOMParser();
      var parsed = parser.parseFromString(html, "text/html");
      toArray(parsed.querySelector('head').childNodes).forEach(function (child) {
        elem.appendChild(child);
      });
      toArray(parsed.querySelector('body').childNodes).forEach(function (child) {
        elem.appendChild(child);
      });
    }
  };
  var hasClass = function hasClass(elem, className) {
    if (!className) {
      return false;
    }

    var classList = className.split(/\s+/);

    for (var i = 0; i < classList.length; i++) {
      if (!elem.classList.contains(classList[i])) {
        return false;
      }
    }

    return true;
  };

  var removeCustomClasses = function removeCustomClasses(elem, params) {
    toArray(elem.classList).forEach(function (className) {
      if (!(objectValues(swalClasses).indexOf(className) !== -1) && !(objectValues(iconTypes).indexOf(className) !== -1) && !(objectValues(params.showClass).indexOf(className) !== -1)) {
        elem.classList.remove(className);
      }
    });
  };

  var applyCustomClass = function applyCustomClass(elem, params, className) {
    removeCustomClasses(elem, params);

    if (params.customClass && params.customClass[className]) {
      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
        return warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(_typeof(params.customClass[className]), "\""));
      }

      addClass(elem, params.customClass[className]);
    }
  };
  function getInput(content, inputType) {
    if (!inputType) {
      return null;
    }

    switch (inputType) {
      case 'select':
      case 'textarea':
      case 'file':
        return getChildByClass(content, swalClasses[inputType]);

      case 'checkbox':
        return content.querySelector(".".concat(swalClasses.checkbox, " input"));

      case 'radio':
        return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

      case 'range':
        return content.querySelector(".".concat(swalClasses.range, " input"));

      default:
        return getChildByClass(content, swalClasses.input);
    }
  }
  var focusInput = function focusInput(input) {
    input.focus(); // place cursor at end of text in text input

    if (input.type !== 'file') {
      // http://stackoverflow.com/a/2345915
      var val = input.value;
      input.value = '';
      input.value = val;
    }
  };
  var toggleClass = function toggleClass(target, classList, condition) {
    if (!target || !classList) {
      return;
    }

    if (typeof classList === 'string') {
      classList = classList.split(/\s+/).filter(Boolean);
    }

    classList.forEach(function (className) {
      if (target.forEach) {
        target.forEach(function (elem) {
          condition ? elem.classList.add(className) : elem.classList.remove(className);
        });
      } else {
        condition ? target.classList.add(className) : target.classList.remove(className);
      }
    });
  };
  var addClass = function addClass(target, classList) {
    toggleClass(target, classList, true);
  };
  var removeClass = function removeClass(target, classList) {
    toggleClass(target, classList, false);
  };
  var getChildByClass = function getChildByClass(elem, className) {
    for (var i = 0; i < elem.childNodes.length; i++) {
      if (hasClass(elem.childNodes[i], className)) {
        return elem.childNodes[i];
      }
    }
  };
  var applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
    if (value || parseInt(value) === 0) {
      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
    } else {
      elem.style.removeProperty(property);
    }
  };
  var show = function show(elem) {
    var display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    elem.style.opacity = '';
    elem.style.display = display;
  };
  var hide = function hide(elem) {
    elem.style.opacity = '';
    elem.style.display = 'none';
  };
  var toggle = function toggle(elem, condition, display) {
    condition ? show(elem, display) : hide(elem);
  }; // borrowed from jquery $(elem).is(':visible') implementation

  var isVisible = function isVisible(elem) {
    return !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
  };
  /* istanbul ignore next */

  var isScrollable = function isScrollable(elem) {
    return !!(elem.scrollHeight > elem.clientHeight);
  }; // borrowed from https://stackoverflow.com/a/46352119

  var hasCssAnimation = function hasCssAnimation(elem) {
    var style = window.getComputedStyle(elem);
    var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    return animDuration > 0 || transDuration > 0;
  };
  var contains = function contains(haystack, needle) {
    if (typeof haystack.contains === 'function') {
      return haystack.contains(needle);
    }
  };
  var animateTimerProgressBar = function animateTimerProgressBar(timer) {
    var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var timerProgressBar = getTimerProgressBar();

    if (isVisible(timerProgressBar)) {
      if (reset) {
        timerProgressBar.style.transition = 'none';
        timerProgressBar.style.width = '100%';
      }

      setTimeout(function () {
        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
        timerProgressBar.style.width = '0%';
      }, 10);
    }
  };
  var stopTimerProgressBar = function stopTimerProgressBar() {
    var timerProgressBar = getTimerProgressBar();
    var timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = '100%';
    var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    var timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
    timerProgressBar.style.removeProperty('transition');
    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
  };

  // Detect Node env
  var isNodeEnv = function isNodeEnv() {
    return typeof window === 'undefined' || typeof document === 'undefined';
  };

  var sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <div class=\"").concat(swalClasses.header, "\">\n     <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.error, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.question, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.warning, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.info, "\"></div>\n     <div class=\"").concat(swalClasses.icon, " ").concat(iconTypes.success, "\"></div>\n     <img class=\"").concat(swalClasses.image, "\" />\n     <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n     <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.content, "\">\n     <div id=\"").concat(swalClasses.content, "\" class=\"").concat(swalClasses['html-container'], "\"></div>\n     <input class=\"").concat(swalClasses.input, "\" />\n     <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n     <div class=\"").concat(swalClasses.range, "\">\n       <input type=\"range\" />\n       <output></output>\n     </div>\n     <select class=\"").concat(swalClasses.select, "\"></select>\n     <div class=\"").concat(swalClasses.radio, "\"></div>\n     <label for=\"").concat(swalClasses.checkbox, "\" class=\"").concat(swalClasses.checkbox, "\">\n       <input type=\"checkbox\" />\n       <span class=\"").concat(swalClasses.label, "\"></span>\n     </label>\n     <textarea class=\"").concat(swalClasses.textarea, "\"></textarea>\n     <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   </div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\">OK</button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\">Cancel</button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

  var resetOldContainer = function resetOldContainer() {
    var oldContainer = getContainer();

    if (!oldContainer) {
      return false;
    }

    oldContainer.parentNode.removeChild(oldContainer);
    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    return true;
  };

  var oldInputVal; // IE11 workaround, see #1109 for details

  var resetValidationMessage = function resetValidationMessage(e) {
    if (Swal.isVisible() && oldInputVal !== e.target.value) {
      Swal.resetValidationMessage();
    }

    oldInputVal = e.target.value;
  };

  var addInputChangeListeners = function addInputChangeListeners() {
    var content = getContent();
    var input = getChildByClass(content, swalClasses.input);
    var file = getChildByClass(content, swalClasses.file);
    var range = content.querySelector(".".concat(swalClasses.range, " input"));
    var rangeOutput = content.querySelector(".".concat(swalClasses.range, " output"));
    var select = getChildByClass(content, swalClasses.select);
    var checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input"));
    var textarea = getChildByClass(content, swalClasses.textarea);
    input.oninput = resetValidationMessage;
    file.onchange = resetValidationMessage;
    select.onchange = resetValidationMessage;
    checkbox.onchange = resetValidationMessage;
    textarea.oninput = resetValidationMessage;

    range.oninput = function (e) {
      resetValidationMessage(e);
      rangeOutput.value = range.value;
    };

    range.onchange = function (e) {
      resetValidationMessage(e);
      range.nextSibling.value = range.value;
    };
  };

  var getTarget = function getTarget(target) {
    return typeof target === 'string' ? document.querySelector(target) : target;
  };

  var setupAccessibility = function setupAccessibility(params) {
    var popup = getPopup();
    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');

    if (!params.toast) {
      popup.setAttribute('aria-modal', 'true');
    }
  };

  var setupRTL = function setupRTL(targetElement) {
    if (window.getComputedStyle(targetElement).direction === 'rtl') {
      addClass(getContainer(), swalClasses.rtl);
    }
  };
  /*
   * Add modal + backdrop to DOM
   */


  var init = function init(params) {
    // Clean up the old popup container if it exists
    var oldContainerExisted = resetOldContainer();
    /* istanbul ignore if */

    if (isNodeEnv()) {
      error('SweetAlert2 requires document to initialize');
      return;
    }

    var container = document.createElement('div');
    container.className = swalClasses.container;

    if (oldContainerExisted) {
      addClass(container, swalClasses['no-transition']);
    }

    setInnerHtml(container, sweetHTML);
    var targetElement = getTarget(params.target);
    targetElement.appendChild(container);
    setupAccessibility(params);
    setupRTL(targetElement);
    addInputChangeListeners();
  };

  var parseHtmlToContainer = function parseHtmlToContainer(param, target) {
    // DOM element
    if (param instanceof HTMLElement) {
      target.appendChild(param); // Object
    } else if (_typeof(param) === 'object') {
      handleObject(param, target); // Plain string
    } else if (param) {
      setInnerHtml(target, param);
    }
  };

  var handleObject = function handleObject(param, target) {
    // JQuery element(s)
    if (param.jquery) {
      handleJqueryElem(target, param); // For other objects use their string representation
    } else {
      setInnerHtml(target, param.toString());
    }
  };

  var handleJqueryElem = function handleJqueryElem(target, elem) {
    target.textContent = '';

    if (0 in elem) {
      for (var i = 0; (i in elem); i++) {
        target.appendChild(elem[i].cloneNode(true));
      }
    } else {
      target.appendChild(elem.cloneNode(true));
    }
  };

  var animationEndEvent = function () {
    // Prevent run in Node env

    /* istanbul ignore if */
    if (isNodeEnv()) {
      return false;
    }

    var testEl = document.createElement('div');
    var transEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };

    for (var i in transEndEventNames) {
      if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== 'undefined') {
        return transEndEventNames[i];
      }
    }

    return false;
  }();

  // https://github.com/twbs/bootstrap/blob/master/js/src/modal.js

  var measureScrollbar = function measureScrollbar() {
    var scrollDiv = document.createElement('div');
    scrollDiv.className = swalClasses['scrollbar-measure'];
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  var renderActions = function renderActions(instance, params) {
    var actions = getActions();
    var confirmButton = getConfirmButton();
    var cancelButton = getCancelButton(); // Actions (buttons) wrapper

    if (!params.showConfirmButton && !params.showCancelButton) {
      hide(actions);
    } // Custom class


    applyCustomClass(actions, params, 'actions'); // Render confirm button

    renderButton(confirmButton, 'confirm', params); // render Cancel Button

    renderButton(cancelButton, 'cancel', params);

    if (params.buttonsStyling) {
      handleButtonsStyling(confirmButton, cancelButton, params);
    } else {
      removeClass([confirmButton, cancelButton], swalClasses.styled);
      confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
      cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
    }

    if (params.reverseButtons) {
      confirmButton.parentNode.insertBefore(cancelButton, confirmButton);
    }
  };

  function handleButtonsStyling(confirmButton, cancelButton, params) {
    addClass([confirmButton, cancelButton], swalClasses.styled); // Buttons background colors

    if (params.confirmButtonColor) {
      confirmButton.style.backgroundColor = params.confirmButtonColor;
    }

    if (params.cancelButtonColor) {
      cancelButton.style.backgroundColor = params.cancelButtonColor;
    } // Loading state


    if (!isLoading()) {
      var confirmButtonBackgroundColor = window.getComputedStyle(confirmButton).getPropertyValue('background-color');
      confirmButton.style.borderLeftColor = confirmButtonBackgroundColor;
      confirmButton.style.borderRightColor = confirmButtonBackgroundColor;
    }
  }

  function renderButton(button, buttonType, params) {
    toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], 'inline-block');
    setInnerHtml(button, params["".concat(buttonType, "ButtonText")]); // Set caption text

    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")]); // ARIA label
    // Add buttons custom classes

    button.className = swalClasses[buttonType];
    applyCustomClass(button, params, "".concat(buttonType, "Button"));
    addClass(button, params["".concat(buttonType, "ButtonClass")]);
  }

  function handleBackdropParam(container, backdrop) {
    if (typeof backdrop === 'string') {
      container.style.background = backdrop;
    } else if (!backdrop) {
      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    }
  }

  function handlePositionParam(container, position) {
    if (position in swalClasses) {
      addClass(container, swalClasses[position]);
    } else {
      warn('The "position" parameter is not valid, defaulting to "center"');
      addClass(container, swalClasses.center);
    }
  }

  function handleGrowParam(container, grow) {
    if (grow && typeof grow === 'string') {
      var growClass = "grow-".concat(grow);

      if (growClass in swalClasses) {
        addClass(container, swalClasses[growClass]);
      }
    }
  }

  var renderContainer = function renderContainer(instance, params) {
    var container = getContainer();

    if (!container) {
      return;
    }

    handleBackdropParam(container, params.backdrop);

    if (!params.backdrop && params.allowOutsideClick) {
      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    }

    handlePositionParam(container, params.position);
    handleGrowParam(container, params.grow); // Custom class

    applyCustomClass(container, params, 'container'); // Set queue step attribute for getQueueStep() method

    var queueStep = document.body.getAttribute('data-swal2-queue-step');

    if (queueStep) {
      container.setAttribute('data-queue-step', queueStep);
      document.body.removeAttribute('data-swal2-queue-step');
    }
  };

  /**
   * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */
  var privateProps = {
    promise: new WeakMap(),
    innerParams: new WeakMap(),
    domCache: new WeakMap()
  };

  var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
  var renderInput = function renderInput(instance, params) {
    var content = getContent();
    var innerParams = privateProps.innerParams.get(instance);
    var rerender = !innerParams || params.input !== innerParams.input;
    inputTypes.forEach(function (inputType) {
      var inputClass = swalClasses[inputType];
      var inputContainer = getChildByClass(content, inputClass); // set attributes

      setAttributes(inputType, params.inputAttributes); // set class

      inputContainer.className = inputClass;

      if (rerender) {
        hide(inputContainer);
      }
    });

    if (params.input) {
      if (rerender) {
        showInput(params);
      } // set custom class


      setCustomClass(params);
    }
  };

  var showInput = function showInput(params) {
    if (!renderInputType[params.input]) {
      return error("Unexpected type of input! Expected \"text\", \"email\", \"password\", \"number\", \"tel\", \"select\", \"radio\", \"checkbox\", \"textarea\", \"file\" or \"url\", got \"".concat(params.input, "\""));
    }

    var inputContainer = getInputContainer(params.input);
    var input = renderInputType[params.input](inputContainer, params);
    show(input); // input autofocus

    setTimeout(function () {
      focusInput(input);
    });
  };

  var removeAttributes = function removeAttributes(input) {
    for (var i = 0; i < input.attributes.length; i++) {
      var attrName = input.attributes[i].name;

      if (!(['type', 'value', 'style'].indexOf(attrName) !== -1)) {
        input.removeAttribute(attrName);
      }
    }
  };

  var setAttributes = function setAttributes(inputType, inputAttributes) {
    var input = getInput(getContent(), inputType);

    if (!input) {
      return;
    }

    removeAttributes(input);

    for (var attr in inputAttributes) {
      // Do not set a placeholder for <input type="range">
      // it'll crash Edge, #1298
      if (inputType === 'range' && attr === 'placeholder') {
        continue;
      }

      input.setAttribute(attr, inputAttributes[attr]);
    }
  };

  var setCustomClass = function setCustomClass(params) {
    var inputContainer = getInputContainer(params.input);

    if (params.customClass) {
      addClass(inputContainer, params.customClass.input);
    }
  };

  var setInputPlaceholder = function setInputPlaceholder(input, params) {
    if (!input.placeholder || params.inputPlaceholder) {
      input.placeholder = params.inputPlaceholder;
    }
  };

  var getInputContainer = function getInputContainer(inputType) {
    var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
    return getChildByClass(getContent(), inputClass);
  };

  var renderInputType = {};

  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function (input, params) {
    if (typeof params.inputValue === 'string' || typeof params.inputValue === 'number') {
      input.value = params.inputValue;
    } else if (!isPromise(params.inputValue)) {
      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(_typeof(params.inputValue), "\""));
    }

    setInputPlaceholder(input, params);
    input.type = params.input;
    return input;
  };

  renderInputType.file = function (input, params) {
    setInputPlaceholder(input, params);
    return input;
  };

  renderInputType.range = function (range, params) {
    var rangeInput = range.querySelector('input');
    var rangeOutput = range.querySelector('output');
    rangeInput.value = params.inputValue;
    rangeInput.type = params.input;
    rangeOutput.value = params.inputValue;
    return range;
  };

  renderInputType.select = function (select, params) {
    select.textContent = '';

    if (params.inputPlaceholder) {
      var placeholder = document.createElement('option');
      setInnerHtml(placeholder, params.inputPlaceholder);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
    }

    return select;
  };

  renderInputType.radio = function (radio) {
    radio.textContent = '';
    return radio;
  };

  renderInputType.checkbox = function (checkboxContainer, params) {
    var checkbox = getInput(getContent(), 'checkbox');
    checkbox.value = 1;
    checkbox.id = swalClasses.checkbox;
    checkbox.checked = Boolean(params.inputValue);
    var label = checkboxContainer.querySelector('span');
    setInnerHtml(label, params.inputPlaceholder);
    return checkboxContainer;
  };

  renderInputType.textarea = function (textarea, params) {
    textarea.value = params.inputValue;
    setInputPlaceholder(textarea, params);

    if ('MutationObserver' in window) {
      // #1699
      var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
      var popupPadding = parseInt(window.getComputedStyle(getPopup()).paddingLeft) + parseInt(window.getComputedStyle(getPopup()).paddingRight);

      var outputsize = function outputsize() {
        var contentWidth = textarea.offsetWidth + popupPadding;

        if (contentWidth > initialPopupWidth) {
          getPopup().style.width = "".concat(contentWidth, "px");
        } else {
          getPopup().style.width = null;
        }
      };

      new MutationObserver(outputsize).observe(textarea, {
        attributes: true,
        attributeFilter: ['style']
      });
    }

    return textarea;
  };

  var renderContent = function renderContent(instance, params) {
    var content = getContent().querySelector("#".concat(swalClasses.content)); // Content as HTML

    if (params.html) {
      parseHtmlToContainer(params.html, content);
      show(content, 'block'); // Content as plain text
    } else if (params.text) {
      content.textContent = params.text;
      show(content, 'block'); // No content
    } else {
      hide(content);
    }

    renderInput(instance, params); // Custom class

    applyCustomClass(getContent(), params, 'content');
  };

  var renderFooter = function renderFooter(instance, params) {
    var footer = getFooter();
    toggle(footer, params.footer);

    if (params.footer) {
      parseHtmlToContainer(params.footer, footer);
    } // Custom class


    applyCustomClass(footer, params, 'footer');
  };

  var renderCloseButton = function renderCloseButton(instance, params) {
    var closeButton = getCloseButton();
    setInnerHtml(closeButton, params.closeButtonHtml); // Custom class

    applyCustomClass(closeButton, params, 'closeButton');
    toggle(closeButton, params.showCloseButton);
    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel);
  };

  var renderIcon = function renderIcon(instance, params) {
    var innerParams = privateProps.innerParams.get(instance); // if the give icon already rendered, apply the custom class without re-rendering the icon

    if (innerParams && params.icon === innerParams.icon && getIcon()) {
      applyCustomClass(getIcon(), params, 'icon');
      return;
    }

    hideAllIcons();

    if (!params.icon) {
      return;
    }

    if (Object.keys(iconTypes).indexOf(params.icon) !== -1) {
      var icon = elementBySelector(".".concat(swalClasses.icon, ".").concat(iconTypes[params.icon]));
      show(icon); // Custom or default content

      setContent(icon, params);
      adjustSuccessIconBackgoundColor(); // Custom class

      applyCustomClass(icon, params, 'icon'); // Animate icon

      addClass(icon, params.showClass.icon);
    } else {
      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
    }
  };

  var hideAllIcons = function hideAllIcons() {
    var icons = getIcons();

    for (var i = 0; i < icons.length; i++) {
      hide(icons[i]);
    }
  }; // Adjust success icon background color to match the popup background color


  var adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
    var popup = getPopup();
    var popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    var successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');

    for (var i = 0; i < successIconParts.length; i++) {
      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    }
  };

  var setContent = function setContent(icon, params) {
    icon.textContent = '';

    if (params.iconHtml) {
      setInnerHtml(icon, iconContent(params.iconHtml));
    } else if (params.icon === 'success') {
      setInnerHtml(icon, "\n      <div class=\"swal2-success-circular-line-left\"></div>\n      <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n      <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n      <div class=\"swal2-success-circular-line-right\"></div>\n    ");
    } else if (params.icon === 'error') {
      setInnerHtml(icon, "\n      <span class=\"swal2-x-mark\">\n        <span class=\"swal2-x-mark-line-left\"></span>\n        <span class=\"swal2-x-mark-line-right\"></span>\n      </span>\n    ");
    } else {
      var defaultIconHtml = {
        question: '?',
        warning: '!',
        info: 'i'
      };
      setInnerHtml(icon, iconContent(defaultIconHtml[params.icon]));
    }
  };

  var iconContent = function iconContent(content) {
    return "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");
  };

  var renderImage = function renderImage(instance, params) {
    var image = getImage();

    if (!params.imageUrl) {
      return hide(image);
    }

    show(image, ''); // Src, alt

    image.setAttribute('src', params.imageUrl);
    image.setAttribute('alt', params.imageAlt); // Width, height

    applyNumericalStyle(image, 'width', params.imageWidth);
    applyNumericalStyle(image, 'height', params.imageHeight); // Class

    image.className = swalClasses.image;
    applyCustomClass(image, params, 'image');
  };

  var currentSteps = [];
  /*
   * Global function for chaining sweetAlert popups
   */

  var queue = function queue(steps) {
    var Swal = this;
    currentSteps = steps;

    var resetAndResolve = function resetAndResolve(resolve, value) {
      currentSteps = [];
      resolve(value);
    };

    var queueResult = [];
    return new Promise(function (resolve) {
      (function step(i, callback) {
        if (i < currentSteps.length) {
          document.body.setAttribute('data-swal2-queue-step', i);
          Swal.fire(currentSteps[i]).then(function (result) {
            if (typeof result.value !== 'undefined') {
              queueResult.push(result.value);
              step(i + 1, callback);
            } else {
              resetAndResolve(resolve, {
                dismiss: result.dismiss
              });
            }
          });
        } else {
          resetAndResolve(resolve, {
            value: queueResult
          });
        }
      })(0);
    });
  };
  /*
   * Global function for getting the index of current popup in queue
   */

  var getQueueStep = function getQueueStep() {
    return getContainer() && getContainer().getAttribute('data-queue-step');
  };
  /*
   * Global function for inserting a popup to the queue
   */

  var insertQueueStep = function insertQueueStep(step, index) {
    if (index && index < currentSteps.length) {
      return currentSteps.splice(index, 0, step);
    }

    return currentSteps.push(step);
  };
  /*
   * Global function for deleting a popup from the queue
   */

  var deleteQueueStep = function deleteQueueStep(index) {
    if (typeof currentSteps[index] !== 'undefined') {
      currentSteps.splice(index, 1);
    }
  };

  var createStepElement = function createStepElement(step) {
    var stepEl = document.createElement('li');
    addClass(stepEl, swalClasses['progress-step']);
    setInnerHtml(stepEl, step);
    return stepEl;
  };

  var createLineElement = function createLineElement(params) {
    var lineEl = document.createElement('li');
    addClass(lineEl, swalClasses['progress-step-line']);

    if (params.progressStepsDistance) {
      lineEl.style.width = params.progressStepsDistance;
    }

    return lineEl;
  };

  var renderProgressSteps = function renderProgressSteps(instance, params) {
    var progressStepsContainer = getProgressSteps();

    if (!params.progressSteps || params.progressSteps.length === 0) {
      return hide(progressStepsContainer);
    }

    show(progressStepsContainer);
    progressStepsContainer.textContent = '';
    var currentProgressStep = parseInt(params.currentProgressStep === undefined ? getQueueStep() : params.currentProgressStep);

    if (currentProgressStep >= params.progressSteps.length) {
      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }

    params.progressSteps.forEach(function (step, index) {
      var stepEl = createStepElement(step);
      progressStepsContainer.appendChild(stepEl);

      if (index === currentProgressStep) {
        addClass(stepEl, swalClasses['active-progress-step']);
      }

      if (index !== params.progressSteps.length - 1) {
        var lineEl = createLineElement(params);
        progressStepsContainer.appendChild(lineEl);
      }
    });
  };

  var renderTitle = function renderTitle(instance, params) {
    var title = getTitle();
    toggle(title, params.title || params.titleText);

    if (params.title) {
      parseHtmlToContainer(params.title, title);
    }

    if (params.titleText) {
      title.innerText = params.titleText;
    } // Custom class


    applyCustomClass(title, params, 'title');
  };

  var renderHeader = function renderHeader(instance, params) {
    var header = getHeader(); // Custom class

    applyCustomClass(header, params, 'header'); // Progress steps

    renderProgressSteps(instance, params); // Icon

    renderIcon(instance, params); // Image

    renderImage(instance, params); // Title

    renderTitle(instance, params); // Close button

    renderCloseButton(instance, params);
  };

  var renderPopup = function renderPopup(instance, params) {
    var popup = getPopup(); // Width

    applyNumericalStyle(popup, 'width', params.width); // Padding

    applyNumericalStyle(popup, 'padding', params.padding); // Background

    if (params.background) {
      popup.style.background = params.background;
    } // Classes


    addClasses(popup, params);
  };

  var addClasses = function addClasses(popup, params) {
    // Default Class + showClass when updating Swal.update({})
    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : '');

    if (params.toast) {
      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
      addClass(popup, swalClasses.toast);
    } else {
      addClass(popup, swalClasses.modal);
    } // Custom class


    applyCustomClass(popup, params, 'popup');

    if (typeof params.customClass === 'string') {
      addClass(popup, params.customClass);
    } // Icon class (#1842)


    if (params.icon) {
      addClass(popup, swalClasses["icon-".concat(params.icon)]);
    }
  };

  var render = function render(instance, params) {
    renderPopup(instance, params);
    renderContainer(instance, params);
    renderHeader(instance, params);
    renderContent(instance, params);
    renderActions(instance, params);
    renderFooter(instance, params);

    if (typeof params.onRender === 'function') {
      params.onRender(getPopup());
    }
  };

  /*
   * Global function to determine if SweetAlert2 popup is shown
   */

  var isVisible$1 = function isVisible$$1() {
    return isVisible(getPopup());
  };
  /*
   * Global function to click 'Confirm' button
   */

  var clickConfirm = function clickConfirm() {
    return getConfirmButton() && getConfirmButton().click();
  };
  /*
   * Global function to click 'Cancel' button
   */

  var clickCancel = function clickCancel() {
    return getCancelButton() && getCancelButton().click();
  };

  function fire() {
    var Swal = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _construct(Swal, args);
  }

  /**
   * Returns an extended version of `Swal` containing `params` as defaults.
   * Useful for reusing Swal configuration.
   *
   * For example:
   *
   * Before:
   * const textPromptOptions = { input: 'text', showCancelButton: true }
   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
   *
   * After:
   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
   * const {value: firstName} = await TextPrompt('What is your first name?')
   * const {value: lastName} = await TextPrompt('What is your last name?')
   *
   * @param mixinParams
   */
  function mixin(mixinParams) {
    var MixinSwal = /*#__PURE__*/function (_this) {
      _inherits(MixinSwal, _this);

      var _super = _createSuper(MixinSwal);

      function MixinSwal() {
        _classCallCheck(this, MixinSwal);

        return _super.apply(this, arguments);
      }

      _createClass(MixinSwal, [{
        key: "_main",
        value: function _main(params) {
          return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, _extends({}, mixinParams, params));
        }
      }]);

      return MixinSwal;
    }(this);

    return MixinSwal;
  }

  /**
   * Show spinner instead of Confirm button
   */

  var showLoading = function showLoading() {
    var popup = getPopup();

    if (!popup) {
      Swal.fire();
    }

    popup = getPopup();
    var actions = getActions();
    var confirmButton = getConfirmButton();
    show(actions);
    show(confirmButton, 'inline-block');
    addClass([popup, actions], swalClasses.loading);
    confirmButton.disabled = true;
    popup.setAttribute('data-loading', true);
    popup.setAttribute('aria-busy', true);
    popup.focus();
  };

  var RESTORE_FOCUS_TIMEOUT = 100;

  var globalState = {};

  var focusPreviousActiveElement = function focusPreviousActiveElement() {
    if (globalState.previousActiveElement && globalState.previousActiveElement.focus) {
      globalState.previousActiveElement.focus();
      globalState.previousActiveElement = null;
    } else if (document.body) {
      document.body.focus();
    }
  }; // Restore previous active (focused) element


  var restoreActiveElement = function restoreActiveElement() {
    return new Promise(function (resolve) {
      var x = window.scrollX;
      var y = window.scrollY;
      globalState.restoreFocusTimeout = setTimeout(function () {
        focusPreviousActiveElement();
        resolve();
      }, RESTORE_FOCUS_TIMEOUT); // issues/900

      /* istanbul ignore if */

      if (typeof x !== 'undefined' && typeof y !== 'undefined') {
        // IE doesn't have scrollX/scrollY support
        window.scrollTo(x, y);
      }
    });
  };

  /**
   * If `timer` parameter is set, returns number of milliseconds of timer remained.
   * Otherwise, returns undefined.
   */

  var getTimerLeft = function getTimerLeft() {
    return globalState.timeout && globalState.timeout.getTimerLeft();
  };
  /**
   * Stop timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var stopTimer = function stopTimer() {
    if (globalState.timeout) {
      stopTimerProgressBar();
      return globalState.timeout.stop();
    }
  };
  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var resumeTimer = function resumeTimer() {
    if (globalState.timeout) {
      var remaining = globalState.timeout.start();
      animateTimerProgressBar(remaining);
      return remaining;
    }
  };
  /**
   * Resume timer. Returns number of milliseconds of timer remained.
   * If `timer` parameter isn't set, returns undefined.
   */

  var toggleTimer = function toggleTimer() {
    var timer = globalState.timeout;
    return timer && (timer.running ? stopTimer() : resumeTimer());
  };
  /**
   * Increase timer. Returns number of milliseconds of an updated timer.
   * If `timer` parameter isn't set, returns undefined.
   */

  var increaseTimer = function increaseTimer(n) {
    if (globalState.timeout) {
      var remaining = globalState.timeout.increase(n);
      animateTimerProgressBar(remaining, true);
      return remaining;
    }
  };
  /**
   * Check if timer is running. Returns true if timer is running
   * or false if timer is paused or stopped.
   * If `timer` parameter isn't set, returns undefined
   */

  var isTimerRunning = function isTimerRunning() {
    return globalState.timeout && globalState.timeout.isRunning();
  };

  var defaultParams = {
    title: '',
    titleText: '',
    text: '',
    html: '',
    footer: '',
    icon: undefined,
    iconHtml: undefined,
    toast: false,
    animation: true,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'swal2-backdrop-show',
      icon: 'swal2-icon-show'
    },
    hideClass: {
      popup: 'swal2-hide',
      backdrop: 'swal2-backdrop-hide',
      icon: 'swal2-icon-hide'
    },
    customClass: undefined,
    target: 'body',
    backdrop: true,
    heightAuto: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    stopKeydownPropagation: true,
    keydownListenerCapture: false,
    showConfirmButton: true,
    showCancelButton: false,
    preConfirm: undefined,
    confirmButtonText: 'OK',
    confirmButtonAriaLabel: '',
    confirmButtonColor: undefined,
    cancelButtonText: 'Cancel',
    cancelButtonAriaLabel: '',
    cancelButtonColor: undefined,
    buttonsStyling: true,
    reverseButtons: false,
    focusConfirm: true,
    focusCancel: false,
    showCloseButton: false,
    closeButtonHtml: '&times;',
    closeButtonAriaLabel: 'Close this dialog',
    showLoaderOnConfirm: false,
    imageUrl: undefined,
    imageWidth: undefined,
    imageHeight: undefined,
    imageAlt: '',
    timer: undefined,
    timerProgressBar: false,
    width: undefined,
    padding: undefined,
    background: undefined,
    input: undefined,
    inputPlaceholder: '',
    inputValue: '',
    inputOptions: {},
    inputAutoTrim: true,
    inputAttributes: {},
    inputValidator: undefined,
    validationMessage: undefined,
    grow: false,
    position: 'center',
    progressSteps: [],
    currentProgressStep: undefined,
    progressStepsDistance: undefined,
    onBeforeOpen: undefined,
    onOpen: undefined,
    onRender: undefined,
    onClose: undefined,
    onAfterClose: undefined,
    onDestroy: undefined,
    scrollbarPadding: true
  };
  var updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'footer', 'hideClass', 'html', 'icon', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'onAfterClose', 'onClose', 'onDestroy', 'progressSteps', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'text', 'title', 'titleText'];
  var deprecatedParams = {
    animation: 'showClass" and "hideClass'
  };
  var toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusCancel', 'heightAuto', 'keydownListenerCapture'];
  /**
   * Is valid parameter
   * @param {String} paramName
   */

  var isValidParameter = function isValidParameter(paramName) {
    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
  };
  /**
   * Is valid parameter for Swal.update() method
   * @param {String} paramName
   */

  var isUpdatableParameter = function isUpdatableParameter(paramName) {
    return updatableParams.indexOf(paramName) !== -1;
  };
  /**
   * Is deprecated parameter
   * @param {String} paramName
   */

  var isDeprecatedParameter = function isDeprecatedParameter(paramName) {
    return deprecatedParams[paramName];
  };

  var checkIfParamIsValid = function checkIfParamIsValid(param) {
    if (!isValidParameter(param)) {
      warn("Unknown parameter \"".concat(param, "\""));
    }
  };

  var checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
    if (toastIncompatibleParams.indexOf(param) !== -1) {
      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    }
  };

  var checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
    if (isDeprecatedParameter(param)) {
      warnAboutDepreation(param, isDeprecatedParameter(param));
    }
  };
  /**
   * Show relevant warnings for given params
   *
   * @param params
   */


  var showWarningsForParams = function showWarningsForParams(params) {
    for (var param in params) {
      checkIfParamIsValid(param);

      if (params.toast) {
        checkIfToastParamIsValid(param);
      }

      checkIfParamIsDeprecated(param);
    }
  };



  var staticMethods = /*#__PURE__*/Object.freeze({
    isValidParameter: isValidParameter,
    isUpdatableParameter: isUpdatableParameter,
    isDeprecatedParameter: isDeprecatedParameter,
    argsToParams: argsToParams,
    isVisible: isVisible$1,
    clickConfirm: clickConfirm,
    clickCancel: clickCancel,
    getContainer: getContainer,
    getPopup: getPopup,
    getTitle: getTitle,
    getContent: getContent,
    getHtmlContainer: getHtmlContainer,
    getImage: getImage,
    getIcon: getIcon,
    getIcons: getIcons,
    getCloseButton: getCloseButton,
    getActions: getActions,
    getConfirmButton: getConfirmButton,
    getCancelButton: getCancelButton,
    getHeader: getHeader,
    getFooter: getFooter,
    getTimerProgressBar: getTimerProgressBar,
    getFocusableElements: getFocusableElements,
    getValidationMessage: getValidationMessage,
    isLoading: isLoading,
    fire: fire,
    mixin: mixin,
    queue: queue,
    getQueueStep: getQueueStep,
    insertQueueStep: insertQueueStep,
    deleteQueueStep: deleteQueueStep,
    showLoading: showLoading,
    enableLoading: showLoading,
    getTimerLeft: getTimerLeft,
    stopTimer: stopTimer,
    resumeTimer: resumeTimer,
    toggleTimer: toggleTimer,
    increaseTimer: increaseTimer,
    isTimerRunning: isTimerRunning
  });

  /**
   * Enables buttons and hide loader.
   */

  function hideLoading() {
    // do nothing if popup is closed
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams) {
      return;
    }

    var domCache = privateProps.domCache.get(this);

    if (!innerParams.showConfirmButton) {
      hide(domCache.confirmButton);

      if (!innerParams.showCancelButton) {
        hide(domCache.actions);
      }
    }

    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    domCache.popup.removeAttribute('aria-busy');
    domCache.popup.removeAttribute('data-loading');
    domCache.confirmButton.disabled = false;
    domCache.cancelButton.disabled = false;
  }

  function getInput$1(instance) {
    var innerParams = privateProps.innerParams.get(instance || this);
    var domCache = privateProps.domCache.get(instance || this);

    if (!domCache) {
      return null;
    }

    return getInput(domCache.content, innerParams.input);
  }

  var fixScrollbar = function fixScrollbar() {
    // for queues, do not do this more than once
    if (states.previousBodyPadding !== null) {
      return;
    } // if the body has overflow


    if (document.body.scrollHeight > window.innerHeight) {
      // add padding so the content doesn't shift after removal of scrollbar
      states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
      document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px");
    }
  };
  var undoScrollbar = function undoScrollbar() {
    if (states.previousBodyPadding !== null) {
      document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px");
      states.previousBodyPadding = null;
    }
  };

  /* istanbul ignore file */

  var iOSfix = function iOSfix() {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
      var offset = document.body.scrollTop;
      document.body.style.top = "".concat(offset * -1, "px");
      addClass(document.body, swalClasses.iosfix);
      lockBodyScroll();
      addBottomPaddingForTallPopups(); // #1948
    }
  };

  var addBottomPaddingForTallPopups = function addBottomPaddingForTallPopups() {
    var safari = !navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i);

    if (safari) {
      var bottomPanelHeight = 44;

      if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
        getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px");
      }
    }
  };

  var lockBodyScroll = function lockBodyScroll() {
    // #1246
    var container = getContainer();
    var preventTouchMove;

    container.ontouchstart = function (e) {
      preventTouchMove = shouldPreventTouchMove(e.target);
    };

    container.ontouchmove = function (e) {
      if (preventTouchMove) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  };

  var shouldPreventTouchMove = function shouldPreventTouchMove(target) {
    var container = getContainer();

    if (target === container) {
      return true;
    }

    if (!isScrollable(container) && target.tagName !== 'INPUT' && // #1603
    !(isScrollable(getContent()) && // #1944
    getContent().contains(target))) {
      return true;
    }

    return false;
  };

  var undoIOSfix = function undoIOSfix() {
    if (hasClass(document.body, swalClasses.iosfix)) {
      var offset = parseInt(document.body.style.top, 10);
      removeClass(document.body, swalClasses.iosfix);
      document.body.style.top = '';
      document.body.scrollTop = offset * -1;
    }
  };

  /* istanbul ignore file */

  var isIE11 = function isIE11() {
    return !!window.MSInputMethodContext && !!document.documentMode;
  }; // Fix IE11 centering sweetalert2/issues/933


  var fixVerticalPositionIE = function fixVerticalPositionIE() {
    var container = getContainer();
    var popup = getPopup();
    container.style.removeProperty('align-items');

    if (popup.offsetTop < 0) {
      container.style.alignItems = 'flex-start';
    }
  };

  var IEfix = function IEfix() {
    if (typeof window !== 'undefined' && isIE11()) {
      fixVerticalPositionIE();
      window.addEventListener('resize', fixVerticalPositionIE);
    }
  };
  var undoIEfix = function undoIEfix() {
    if (typeof window !== 'undefined' && isIE11()) {
      window.removeEventListener('resize', fixVerticalPositionIE);
    }
  };

  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
  // elements not within the active modal dialog will not be surfaced if a user opens a screen
  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

  var setAriaHidden = function setAriaHidden() {
    var bodyChildren = toArray(document.body.children);
    bodyChildren.forEach(function (el) {
      if (el === getContainer() || contains(el, getContainer())) {
        return;
      }

      if (el.hasAttribute('aria-hidden')) {
        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden'));
      }

      el.setAttribute('aria-hidden', 'true');
    });
  };
  var unsetAriaHidden = function unsetAriaHidden() {
    var bodyChildren = toArray(document.body.children);
    bodyChildren.forEach(function (el) {
      if (el.hasAttribute('data-previous-aria-hidden')) {
        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden'));
        el.removeAttribute('data-previous-aria-hidden');
      } else {
        el.removeAttribute('aria-hidden');
      }
    });
  };

  /**
   * This module containts `WeakMap`s for each effectively-"private  property" that a `Swal` has.
   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
   * This is the approach that Babel will probably take to implement private methods/fields
   *   https://github.com/tc39/proposal-private-methods
   *   https://github.com/babel/babel/pull/7555
   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
   *   then we can use that language feature.
   */
  var privateMethods = {
    swalPromiseResolve: new WeakMap()
  };

  /*
   * Instance method to close sweetAlert
   */

  function removePopupAndResetState(instance, container, isToast$$1, onAfterClose) {
    if (isToast$$1) {
      triggerOnAfterCloseAndDispose(instance, onAfterClose);
    } else {
      restoreActiveElement().then(function () {
        return triggerOnAfterCloseAndDispose(instance, onAfterClose);
      });
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (container.parentNode && !document.body.getAttribute('data-swal2-queue-step')) {
      container.parentNode.removeChild(container);
    }

    if (isModal()) {
      undoScrollbar();
      undoIOSfix();
      undoIEfix();
      unsetAriaHidden();
    }

    removeBodyClasses();
  }

  function removeBodyClasses() {
    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['toast-column']]);
  }

  function close(resolveValue) {
    var popup = getPopup();

    if (!popup) {
      return;
    }

    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
      return;
    }

    var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    removeClass(popup, innerParams.showClass.popup);
    addClass(popup, innerParams.hideClass.popup);
    var backdrop = getContainer();
    removeClass(backdrop, innerParams.showClass.backdrop);
    addClass(backdrop, innerParams.hideClass.backdrop);
    handlePopupAnimation(this, popup, innerParams);

    if (typeof resolveValue !== 'undefined') {
      resolveValue.isDismissed = typeof resolveValue.dismiss !== 'undefined';
      resolveValue.isConfirmed = typeof resolveValue.dismiss === 'undefined';
    } else {
      resolveValue = {
        isDismissed: true,
        isConfirmed: false
      };
    } // Resolve Swal promise


    swalPromiseResolve(resolveValue || {});
  }

  var handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
    var container = getContainer(); // If animation is supported, animate

    var animationIsSupported = animationEndEvent && hasCssAnimation(popup);
    var onClose = innerParams.onClose,
        onAfterClose = innerParams.onAfterClose;

    if (onClose !== null && typeof onClose === 'function') {
      onClose(popup);
    }

    if (animationIsSupported) {
      animatePopup(instance, popup, container, onAfterClose);
    } else {
      // Otherwise, remove immediately
      removePopupAndResetState(instance, container, isToast(), onAfterClose);
    }
  };

  var animatePopup = function animatePopup(instance, popup, container, onAfterClose) {
    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, isToast(), onAfterClose);
    popup.addEventListener(animationEndEvent, function (e) {
      if (e.target === popup) {
        globalState.swalCloseEventFinishedCallback();
        delete globalState.swalCloseEventFinishedCallback;
      }
    });
  };

  var triggerOnAfterCloseAndDispose = function triggerOnAfterCloseAndDispose(instance, onAfterClose) {
    setTimeout(function () {
      if (typeof onAfterClose === 'function') {
        onAfterClose();
      }

      instance._destroy();
    });
  };

  function setButtonsDisabled(instance, buttons, disabled) {
    var domCache = privateProps.domCache.get(instance);
    buttons.forEach(function (button) {
      domCache[button].disabled = disabled;
    });
  }

  function setInputDisabled(input, disabled) {
    if (!input) {
      return false;
    }

    if (input.type === 'radio') {
      var radiosContainer = input.parentNode.parentNode;
      var radios = radiosContainer.querySelectorAll('input');

      for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = disabled;
      }
    } else {
      input.disabled = disabled;
    }
  }

  function enableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'cancelButton'], false);
  }
  function disableButtons() {
    setButtonsDisabled(this, ['confirmButton', 'cancelButton'], true);
  }
  function enableInput() {
    return setInputDisabled(this.getInput(), false);
  }
  function disableInput() {
    return setInputDisabled(this.getInput(), true);
  }

  function showValidationMessage(error) {
    var domCache = privateProps.domCache.get(this);
    setInnerHtml(domCache.validationMessage, error);
    var popupComputedStyle = window.getComputedStyle(domCache.popup);
    domCache.validationMessage.style.marginLeft = "-".concat(popupComputedStyle.getPropertyValue('padding-left'));
    domCache.validationMessage.style.marginRight = "-".concat(popupComputedStyle.getPropertyValue('padding-right'));
    show(domCache.validationMessage);
    var input = this.getInput();

    if (input) {
      input.setAttribute('aria-invalid', true);
      input.setAttribute('aria-describedBy', swalClasses['validation-message']);
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    }
  } // Hide block with validation message

  function resetValidationMessage$1() {
    var domCache = privateProps.domCache.get(this);

    if (domCache.validationMessage) {
      hide(domCache.validationMessage);
    }

    var input = this.getInput();

    if (input) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedBy');
      removeClass(input, swalClasses.inputerror);
    }
  }

  function getProgressSteps$1() {
    var domCache = privateProps.domCache.get(this);
    return domCache.progressSteps;
  }

  var Timer = /*#__PURE__*/function () {
    function Timer(callback, delay) {
      _classCallCheck(this, Timer);

      this.callback = callback;
      this.remaining = delay;
      this.running = false;
      this.start();
    }

    _createClass(Timer, [{
      key: "start",
      value: function start() {
        if (!this.running) {
          this.running = true;
          this.started = new Date();
          this.id = setTimeout(this.callback, this.remaining);
        }

        return this.remaining;
      }
    }, {
      key: "stop",
      value: function stop() {
        if (this.running) {
          this.running = false;
          clearTimeout(this.id);
          this.remaining -= new Date() - this.started;
        }

        return this.remaining;
      }
    }, {
      key: "increase",
      value: function increase(n) {
        var running = this.running;

        if (running) {
          this.stop();
        }

        this.remaining += n;

        if (running) {
          this.start();
        }

        return this.remaining;
      }
    }, {
      key: "getTimerLeft",
      value: function getTimerLeft() {
        if (this.running) {
          this.stop();
          this.start();
        }

        return this.remaining;
      }
    }, {
      key: "isRunning",
      value: function isRunning() {
        return this.running;
      }
    }]);

    return Timer;
  }();

  var defaultInputValidators = {
    email: function email(string, validationMessage) {
      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    },
    url: function url(string, validationMessage) {
      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    }
  };

  function setDefaultInputValidators(params) {
    // Use default `inputValidator` for supported input types if not provided
    if (!params.inputValidator) {
      Object.keys(defaultInputValidators).forEach(function (key) {
        if (params.input === key) {
          params.inputValidator = defaultInputValidators[key];
        }
      });
    }
  }

  function validateCustomTargetElement(params) {
    // Determine if the custom target element is valid
    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
      warn('Target parameter is not valid, defaulting to "body"');
      params.target = 'body';
    }
  }
  /**
   * Set type, text and actions on popup
   *
   * @param params
   * @returns {boolean}
   */


  function setParameters(params) {
    setDefaultInputValidators(params); // showLoaderOnConfirm && preConfirm

    if (params.showLoaderOnConfirm && !params.preConfirm) {
      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    } // params.animation will be actually used in renderPopup.js
    // but in case when params.animation is a function, we need to call that function
    // before popup (re)initialization, so it'll be possible to check Swal.isVisible()
    // inside the params.animation function


    params.animation = callIfFunction(params.animation);
    validateCustomTargetElement(params); // Replace newlines with <br> in title

    if (typeof params.title === 'string') {
      params.title = params.title.split('\n').join('<br />');
    }

    init(params);
  }

  /**
   * Open popup, add necessary classes and styles, fix scrollbar
   *
   * @param {Array} params
   */

  var openPopup = function openPopup(params) {
    var container = getContainer();
    var popup = getPopup();

    if (typeof params.onBeforeOpen === 'function') {
      params.onBeforeOpen(popup);
    }

    var bodyStyles = window.getComputedStyle(document.body);
    var initialBodyOverflow = bodyStyles.overflowY;
    addClasses$1(container, popup, params); // scrolling is 'hidden' until animation is done, after that 'auto'

    setScrollingVisibility(container, popup);

    if (isModal()) {
      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
      setAriaHidden();
    }

    if (!isToast() && !globalState.previousActiveElement) {
      globalState.previousActiveElement = document.activeElement;
    }

    if (typeof params.onOpen === 'function') {
      setTimeout(function () {
        return params.onOpen(popup);
      });
    }

    removeClass(container, swalClasses['no-transition']);
  };

  function swalOpenAnimationFinished(event) {
    var popup = getPopup();

    if (event.target !== popup) {
      return;
    }

    var container = getContainer();
    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
    container.style.overflowY = 'auto';
  }

  var setScrollingVisibility = function setScrollingVisibility(container, popup) {
    if (animationEndEvent && hasCssAnimation(popup)) {
      container.style.overflowY = 'hidden';
      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
    } else {
      container.style.overflowY = 'auto';
    }
  };

  var fixScrollContainer = function fixScrollContainer(container, scrollbarPadding, initialBodyOverflow) {
    iOSfix();
    IEfix();

    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
      fixScrollbar();
    } // sweetalert2/issues/1247


    setTimeout(function () {
      container.scrollTop = 0;
    });
  };

  var addClasses$1 = function addClasses(container, popup, params) {
    addClass(container, params.showClass.backdrop);
    show(popup); // Animate popup right after showing it

    addClass(popup, params.showClass.popup);
    addClass([document.documentElement, document.body], swalClasses.shown);

    if (params.heightAuto && params.backdrop && !params.toast) {
      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    }
  };

  var handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
    if (params.input === 'select' || params.input === 'radio') {
      handleInputOptions(instance, params);
    } else if (['text', 'email', 'number', 'tel', 'textarea'].indexOf(params.input) !== -1 && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
      handleInputValue(instance, params);
    }
  };
  var getInputValue = function getInputValue(instance, innerParams) {
    var input = instance.getInput();

    if (!input) {
      return null;
    }

    switch (innerParams.input) {
      case 'checkbox':
        return getCheckboxValue(input);

      case 'radio':
        return getRadioValue(input);

      case 'file':
        return getFileValue(input);

      default:
        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    }
  };

  var getCheckboxValue = function getCheckboxValue(input) {
    return input.checked ? 1 : 0;
  };

  var getRadioValue = function getRadioValue(input) {
    return input.checked ? input.value : null;
  };

  var getFileValue = function getFileValue(input) {
    return input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;
  };

  var handleInputOptions = function handleInputOptions(instance, params) {
    var content = getContent();

    var processInputOptions = function processInputOptions(inputOptions) {
      return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
    };

    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
      showLoading();
      asPromise(params.inputOptions).then(function (inputOptions) {
        instance.hideLoading();
        processInputOptions(inputOptions);
      });
    } else if (_typeof(params.inputOptions) === 'object') {
      processInputOptions(params.inputOptions);
    } else {
      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
    }
  };

  var handleInputValue = function handleInputValue(instance, params) {
    var input = instance.getInput();
    hide(input);
    asPromise(params.inputValue).then(function (inputValue) {
      input.value = params.input === 'number' ? parseFloat(inputValue) || 0 : "".concat(inputValue);
      show(input);
      input.focus();
      instance.hideLoading();
    })["catch"](function (err) {
      error("Error in inputValue promise: ".concat(err));
      input.value = '';
      show(input);
      input.focus();
      instance.hideLoading();
    });
  };

  var populateInputOptions = {
    select: function select(content, inputOptions, params) {
      var select = getChildByClass(content, swalClasses.select);

      var renderOption = function renderOption(parent, optionLabel, optionValue) {
        var option = document.createElement('option');
        option.value = optionValue;
        setInnerHtml(option, optionLabel);

        if (params.inputValue.toString() === optionValue.toString()) {
          option.selected = true;
        }

        parent.appendChild(option);
      };

      inputOptions.forEach(function (inputOption) {
        var optionValue = inputOption[0];
        var optionLabel = inputOption[1]; // <optgroup> spec:
        // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
        // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
        // check whether this is a <optgroup>

        if (Array.isArray(optionLabel)) {
          // if it is an array, then it is an <optgroup>
          var optgroup = document.createElement('optgroup');
          optgroup.label = optionValue;
          optgroup.disabled = false; // not configurable for now

          select.appendChild(optgroup);
          optionLabel.forEach(function (o) {
            return renderOption(optgroup, o[1], o[0]);
          });
        } else {
          // case of <option>
          renderOption(select, optionLabel, optionValue);
        }
      });
      select.focus();
    },
    radio: function radio(content, inputOptions, params) {
      var radio = getChildByClass(content, swalClasses.radio);
      inputOptions.forEach(function (inputOption) {
        var radioValue = inputOption[0];
        var radioLabel = inputOption[1];
        var radioInput = document.createElement('input');
        var radioLabelElement = document.createElement('label');
        radioInput.type = 'radio';
        radioInput.name = swalClasses.radio;
        radioInput.value = radioValue;

        if (params.inputValue.toString() === radioValue.toString()) {
          radioInput.checked = true;
        }

        var label = document.createElement('span');
        setInnerHtml(label, radioLabel);
        label.className = swalClasses.label;
        radioLabelElement.appendChild(radioInput);
        radioLabelElement.appendChild(label);
        radio.appendChild(radioLabelElement);
      });
      var radios = radio.querySelectorAll('input');

      if (radios.length) {
        radios[0].focus();
      }
    }
  };
  /**
   * Converts `inputOptions` into an array of `[value, label]`s
   * @param inputOptions
   */

  var formatInputOptions = function formatInputOptions(inputOptions) {
    var result = [];

    if (typeof Map !== 'undefined' && inputOptions instanceof Map) {
      inputOptions.forEach(function (value, key) {
        var valueFormatted = value;

        if (_typeof(valueFormatted) === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }

        result.push([key, valueFormatted]);
      });
    } else {
      Object.keys(inputOptions).forEach(function (key) {
        var valueFormatted = inputOptions[key];

        if (_typeof(valueFormatted) === 'object') {
          // case of <optgroup>
          valueFormatted = formatInputOptions(valueFormatted);
        }

        result.push([key, valueFormatted]);
      });
    }

    return result;
  };

  var handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
    instance.disableButtons();

    if (innerParams.input) {
      handleConfirmWithInput(instance, innerParams);
    } else {
      confirm(instance, innerParams, true);
    }
  };
  var handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
    instance.disableButtons();
    dismissWith(DismissReason.cancel);
  };

  var handleConfirmWithInput = function handleConfirmWithInput(instance, innerParams) {
    var inputValue = getInputValue(instance, innerParams);

    if (innerParams.inputValidator) {
      instance.disableInput();
      var validationPromise = Promise.resolve().then(function () {
        return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
      });
      validationPromise.then(function (validationMessage) {
        instance.enableButtons();
        instance.enableInput();

        if (validationMessage) {
          instance.showValidationMessage(validationMessage);
        } else {
          confirm(instance, innerParams, inputValue);
        }
      });
    } else if (!instance.getInput().checkValidity()) {
      instance.enableButtons();
      instance.showValidationMessage(innerParams.validationMessage);
    } else {
      confirm(instance, innerParams, inputValue);
    }
  };

  var succeedWith = function succeedWith(instance, value) {
    instance.closePopup({
      value: value
    });
  };

  var confirm = function confirm(instance, innerParams, value) {
    if (innerParams.showLoaderOnConfirm) {
      showLoading(); // TODO: make showLoading an *instance* method
    }

    if (innerParams.preConfirm) {
      instance.resetValidationMessage();
      var preConfirmPromise = Promise.resolve().then(function () {
        return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
      });
      preConfirmPromise.then(function (preConfirmValue) {
        if (isVisible(getValidationMessage()) || preConfirmValue === false) {
          instance.hideLoading();
        } else {
          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
        }
      });
    } else {
      succeedWith(instance, value);
    }
  };

  var addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = false;
    }

    if (!innerParams.toast) {
      globalState.keydownHandler = function (e) {
        return keydownHandler(instance, e, dismissWith);
      };

      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
        capture: globalState.keydownListenerCapture
      });
      globalState.keydownHandlerAdded = true;
    }
  }; // Focus handling

  var setFocus = function setFocus(innerParams, index, increment) {
    var focusableElements = getFocusableElements(); // search for visible elements and select the next possible match

    for (var i = 0; i < focusableElements.length; i++) {
      index = index + increment; // rollover to first item

      if (index === focusableElements.length) {
        index = 0; // go to last item
      } else if (index === -1) {
        index = focusableElements.length - 1;
      }

      return focusableElements[index].focus();
    } // no visible focusable elements, focus the popup


    getPopup().focus();
  };
  var arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Left', 'Right', 'Up', 'Down' // IE11
  ];
  var escKeys = ['Escape', 'Esc' // IE11
  ];

  var keydownHandler = function keydownHandler(instance, e, dismissWith) {
    var innerParams = privateProps.innerParams.get(instance);

    if (innerParams.stopKeydownPropagation) {
      e.stopPropagation();
    } // ENTER


    if (e.key === 'Enter') {
      handleEnter(instance, e, innerParams); // TAB
    } else if (e.key === 'Tab') {
      handleTab(e, innerParams); // ARROWS - switch focus between buttons
    } else if (arrowKeys.indexOf(e.key) !== -1) {
      handleArrows(); // ESC
    } else if (escKeys.indexOf(e.key) !== -1) {
      handleEsc(e, innerParams, dismissWith);
    }
  };

  var handleEnter = function handleEnter(instance, e, innerParams) {
    // #720 #721
    if (e.isComposing) {
      return;
    }

    if (e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
      if (['textarea', 'file'].indexOf(innerParams.input) !== -1) {
        return; // do not submit
      }

      clickConfirm();
      e.preventDefault();
    }
  };

  var handleTab = function handleTab(e, innerParams) {
    var targetElement = e.target;
    var focusableElements = getFocusableElements();
    var btnIndex = -1;

    for (var i = 0; i < focusableElements.length; i++) {
      if (targetElement === focusableElements[i]) {
        btnIndex = i;
        break;
      }
    }

    if (!e.shiftKey) {
      // Cycle to the next button
      setFocus(innerParams, btnIndex, 1);
    } else {
      // Cycle to the prev button
      setFocus(innerParams, btnIndex, -1);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  var handleArrows = function handleArrows() {
    var confirmButton = getConfirmButton();
    var cancelButton = getCancelButton(); // focus Cancel button if Confirm button is currently focused

    if (document.activeElement === confirmButton && isVisible(cancelButton)) {
      cancelButton.focus(); // and vice versa
    } else if (document.activeElement === cancelButton && isVisible(confirmButton)) {
      confirmButton.focus();
    }
  };

  var handleEsc = function handleEsc(e, innerParams, dismissWith) {
    if (callIfFunction(innerParams.allowEscapeKey)) {
      e.preventDefault();
      dismissWith(DismissReason.esc);
    }
  };

  var handlePopupClick = function handlePopupClick(instance, domCache, dismissWith) {
    var innerParams = privateProps.innerParams.get(instance);

    if (innerParams.toast) {
      handleToastClick(instance, domCache, dismissWith);
    } else {
      // Ignore click events that had mousedown on the popup but mouseup on the container
      // This can happen when the user drags a slider
      handleModalMousedown(domCache); // Ignore click events that had mousedown on the container but mouseup on the popup

      handleContainerMousedown(domCache);
      handleModalClick(instance, domCache, dismissWith);
    }
  };

  var handleToastClick = function handleToastClick(instance, domCache, dismissWith) {
    // Closing toast by internal click
    domCache.popup.onclick = function () {
      var innerParams = privateProps.innerParams.get(instance);

      if (innerParams.showConfirmButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.input) {
        return;
      }

      dismissWith(DismissReason.close);
    };
  };

  var ignoreOutsideClick = false;

  var handleModalMousedown = function handleModalMousedown(domCache) {
    domCache.popup.onmousedown = function () {
      domCache.container.onmouseup = function (e) {
        domCache.container.onmouseup = undefined; // We only check if the mouseup target is the container because usually it doesn't
        // have any other direct children aside of the popup

        if (e.target === domCache.container) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  var handleContainerMousedown = function handleContainerMousedown(domCache) {
    domCache.container.onmousedown = function () {
      domCache.popup.onmouseup = function (e) {
        domCache.popup.onmouseup = undefined; // We also need to check if the mouseup target is a child of the popup

        if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
          ignoreOutsideClick = true;
        }
      };
    };
  };

  var handleModalClick = function handleModalClick(instance, domCache, dismissWith) {
    domCache.container.onclick = function (e) {
      var innerParams = privateProps.innerParams.get(instance);

      if (ignoreOutsideClick) {
        ignoreOutsideClick = false;
        return;
      }

      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
        dismissWith(DismissReason.backdrop);
      }
    };
  };

  function _main(userParams) {
    showWarningsForParams(userParams);

    if (globalState.currentInstance) {
      globalState.currentInstance._destroy();
    }

    globalState.currentInstance = this;
    var innerParams = prepareParams(userParams);
    setParameters(innerParams);
    Object.freeze(innerParams); // clear the previous timer

    if (globalState.timeout) {
      globalState.timeout.stop();
      delete globalState.timeout;
    } // clear the restore focus timeout


    clearTimeout(globalState.restoreFocusTimeout);
    var domCache = populateDomCache(this);
    render(this, innerParams);
    privateProps.innerParams.set(this, innerParams);
    return swalPromise(this, domCache, innerParams);
  }

  var prepareParams = function prepareParams(userParams) {
    var showClass = _extends({}, defaultParams.showClass, userParams.showClass);

    var hideClass = _extends({}, defaultParams.hideClass, userParams.hideClass);

    var params = _extends({}, defaultParams, userParams);

    params.showClass = showClass;
    params.hideClass = hideClass; // @deprecated

    if (userParams.animation === false) {
      params.showClass = {
        popup: 'swal2-noanimation',
        backdrop: 'swal2-noanimation'
      };
      params.hideClass = {};
    }

    return params;
  };

  var swalPromise = function swalPromise(instance, domCache, innerParams) {
    return new Promise(function (resolve) {
      // functions to handle all closings/dismissals
      var dismissWith = function dismissWith(dismiss) {
        instance.closePopup({
          dismiss: dismiss
        });
      };

      privateMethods.swalPromiseResolve.set(instance, resolve);

      domCache.confirmButton.onclick = function () {
        return handleConfirmButtonClick(instance, innerParams);
      };

      domCache.cancelButton.onclick = function () {
        return handleCancelButtonClick(instance, dismissWith);
      };

      domCache.closeButton.onclick = function () {
        return dismissWith(DismissReason.close);
      };

      handlePopupClick(instance, domCache, dismissWith);
      addKeydownHandler(instance, globalState, innerParams, dismissWith);

      if (innerParams.toast && (innerParams.input || innerParams.footer || innerParams.showCloseButton)) {
        addClass(document.body, swalClasses['toast-column']);
      } else {
        removeClass(document.body, swalClasses['toast-column']);
      }

      handleInputOptionsAndValue(instance, innerParams);
      openPopup(innerParams);
      setupTimer(globalState, innerParams, dismissWith);
      initFocus(domCache, innerParams); // Scroll container to top on open (#1247, #1946)

      setTimeout(function () {
        domCache.container.scrollTop = 0;
      });
    });
  };

  var populateDomCache = function populateDomCache(instance) {
    var domCache = {
      popup: getPopup(),
      container: getContainer(),
      content: getContent(),
      actions: getActions(),
      confirmButton: getConfirmButton(),
      cancelButton: getCancelButton(),
      closeButton: getCloseButton(),
      validationMessage: getValidationMessage(),
      progressSteps: getProgressSteps()
    };
    privateProps.domCache.set(instance, domCache);
    return domCache;
  };

  var setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
    var timerProgressBar = getTimerProgressBar();
    hide(timerProgressBar);

    if (innerParams.timer) {
      globalState$$1.timeout = new Timer(function () {
        dismissWith('timer');
        delete globalState$$1.timeout;
      }, innerParams.timer);

      if (innerParams.timerProgressBar) {
        show(timerProgressBar);
        setTimeout(function () {
          if (globalState$$1.timeout.running) {
            // timer can be already stopped at this point
            animateTimerProgressBar(innerParams.timer);
          }
        });
      }
    }
  };

  var initFocus = function initFocus(domCache, innerParams) {
    if (innerParams.toast) {
      return;
    }

    if (!callIfFunction(innerParams.allowEnterKey)) {
      return blurActiveElement();
    }

    if (innerParams.focusCancel && isVisible(domCache.cancelButton)) {
      return domCache.cancelButton.focus();
    }

    if (innerParams.focusConfirm && isVisible(domCache.confirmButton)) {
      return domCache.confirmButton.focus();
    }

    setFocus(innerParams, -1, 1);
  };

  var blurActiveElement = function blurActiveElement() {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  };

  /**
   * Updates popup parameters.
   */

  function update(params) {
    var popup = getPopup();
    var innerParams = privateProps.innerParams.get(this);

    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
      return warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
    }

    var validUpdatableParams = {}; // assign valid params from `params` to `defaults`

    Object.keys(params).forEach(function (param) {
      if (Swal.isUpdatableParameter(param)) {
        validUpdatableParams[param] = params[param];
      } else {
        warn("Invalid parameter to update: \"".concat(param, "\". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js"));
      }
    });

    var updatedParams = _extends({}, innerParams, validUpdatableParams);

    render(this, updatedParams);
    privateProps.innerParams.set(this, updatedParams);
    Object.defineProperties(this, {
      params: {
        value: _extends({}, this.params, params),
        writable: false,
        enumerable: true
      }
    });
  }

  function _destroy() {
    var domCache = privateProps.domCache.get(this);
    var innerParams = privateProps.innerParams.get(this);

    if (!innerParams) {
      return; // This instance has already been destroyed
    } // Check if there is another Swal closing


    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
      globalState.swalCloseEventFinishedCallback();
      delete globalState.swalCloseEventFinishedCallback;
    } // Check if there is a swal disposal defer timer


    if (globalState.deferDisposalTimer) {
      clearTimeout(globalState.deferDisposalTimer);
      delete globalState.deferDisposalTimer;
    }

    if (typeof innerParams.onDestroy === 'function') {
      innerParams.onDestroy();
    }

    disposeSwal(this);
  }

  var disposeSwal = function disposeSwal(instance) {
    // Unset this.params so GC will dispose it (#1569)
    delete instance.params; // Unset globalState props so GC will dispose globalState (#1569)

    delete globalState.keydownHandler;
    delete globalState.keydownTarget; // Unset WeakMaps so GC will be able to dispose them (#1569)

    unsetWeakMaps(privateProps);
    unsetWeakMaps(privateMethods);
  };

  var unsetWeakMaps = function unsetWeakMaps(obj) {
    for (var i in obj) {
      obj[i] = new WeakMap();
    }
  };



  var instanceMethods = /*#__PURE__*/Object.freeze({
    hideLoading: hideLoading,
    disableLoading: hideLoading,
    getInput: getInput$1,
    close: close,
    closePopup: close,
    closeModal: close,
    closeToast: close,
    enableButtons: enableButtons,
    disableButtons: disableButtons,
    enableInput: enableInput,
    disableInput: disableInput,
    showValidationMessage: showValidationMessage,
    resetValidationMessage: resetValidationMessage$1,
    getProgressSteps: getProgressSteps$1,
    _main: _main,
    update: update,
    _destroy: _destroy
  });

  var currentInstance;

  var SweetAlert = /*#__PURE__*/function () {
    function SweetAlert() {
      _classCallCheck(this, SweetAlert);

      // Prevent run in Node env
      if (typeof window === 'undefined') {
        return;
      } // Check for the existence of Promise


      if (typeof Promise === 'undefined') {
        error('This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)');
      }

      currentInstance = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var outerParams = Object.freeze(this.constructor.argsToParams(args));
      Object.defineProperties(this, {
        params: {
          value: outerParams,
          writable: false,
          enumerable: true,
          configurable: true
        }
      });

      var promise = this._main(this.params);

      privateProps.promise.set(this, promise);
    } // `catch` cannot be the name of a module export, so we define our thenable methods here instead


    _createClass(SweetAlert, [{
      key: "then",
      value: function then(onFulfilled) {
        var promise = privateProps.promise.get(this);
        return promise.then(onFulfilled);
      }
    }, {
      key: "finally",
      value: function _finally(onFinally) {
        var promise = privateProps.promise.get(this);
        return promise["finally"](onFinally);
      }
    }]);

    return SweetAlert;
  }(); // Dear russian users visiting russian sites. Let's have fun.


  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
    var now = new Date();
    var initiationDate = localStorage.getItem('swal-initiation');

    if (!initiationDate) {
      localStorage.setItem('swal-initiation', "".concat(now));
    } else if ((now.getTime() - Date.parse(initiationDate)) / (1000 * 60 * 60 * 24) > 3) {
      setTimeout(function () {
        document.body.style.pointerEvents = 'none';
        var ukrainianAnthem = document.createElement('audio');
        ukrainianAnthem.src = 'https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3';
        ukrainianAnthem.loop = true;
        document.body.appendChild(ukrainianAnthem);
        setTimeout(function () {
          ukrainianAnthem.play()["catch"](function () {// ignore
          });
        }, 2500);
      }, 500);
    }
  } // Assign instance methods from src/instanceMethods/*.js to prototype


  _extends(SweetAlert.prototype, instanceMethods); // Assign static methods from src/staticMethods/*.js to constructor


  _extends(SweetAlert, staticMethods); // Proxy to instance methods to constructor, for now, for backwards compatibility


  Object.keys(instanceMethods).forEach(function (key) {
    SweetAlert[key] = function () {
      if (currentInstance) {
        var _currentInstance;

        return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
      }
    };
  });
  SweetAlert.DismissReason = DismissReason;
  SweetAlert.version = '9.17.2';

  var Swal = SweetAlert;
  Swal["default"] = Swal;

  return Swal;

}));
if (typeof this !== 'undefined' && this.Sweetalert2){  this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2}

"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,".swal2-popup.swal2-toast{flex-direction:row;align-items:center;width:auto;padding:.625em;overflow-y:hidden;background:#fff;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row;padding:0}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;padding:0;font-size:1em}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex-basis:auto!important;width:auto;height:auto;margin:0 .3125em}.swal2-popup.swal2-toast .swal2-styled{margin:0 .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(50,100,150,.4)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-no-transition{transition:none!important}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:.3125em;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center;padding:0 1.8em}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-actions.swal2-loading .swal2-styled.swal2-confirm{box-sizing:border-box;width:2.5em;height:2.5em;margin:.46875em;padding:0;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:.25em solid transparent;border-radius:100%;border-color:transparent;background-color:transparent!important;color:transparent!important;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-actions.swal2-loading .swal2-styled.swal2-cancel{margin-right:30px;margin-left:30px}.swal2-actions.swal2-loading :not(.swal2-styled).swal2-confirm::after{content:\"\";display:inline-block;width:15px;height:15px;margin-left:5px;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border:3px solid #999;border-radius:50%;border-right-color:transparent;box-shadow:1px 1px 1px #fff}.swal2-styled{margin:.3125em;padding:.625em 2em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#3085d6;color:#fff;font-size:1.0625em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#aaa;color:#fff;font-size:1.0625em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(50,100,150,.4)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;height:.25em;overflow:hidden;border-bottom-right-radius:.3125em;border-bottom-left-radius:.3125em}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;align-items:center;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:0;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close::-moz-focus-inner{border:0}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0 1.6em;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 3px #c4e6f5}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::-ms-input-placeholder,.swal2-input::-ms-input-placeholder,.swal2-textarea::-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{margin:0 .4em}.swal2-validation-message{display:none;align-items:center;justify-content:center;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{align-items:center;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;width:2em;height:2em;border-radius:2em;background:#3085d6;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#3085d6}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;width:2.5em;height:.4em;margin:0 -1px;background:#3085d6}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-moz-document url-prefix(){.swal2-close:focus{outline:2px solid rgba(50,100,150,.4)}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent!important}body.swal2-no-backdrop .swal2-container>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-container.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-top-left,body.swal2-no-backdrop .swal2-container.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-top-end,body.swal2-no-backdrop .swal2-container.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-container.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-left,body.swal2-no-backdrop .swal2-container.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-end,body.swal2-no-backdrop .swal2-container.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom-left,body.swal2-no-backdrop .swal2-container.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-bottom-end,body.swal2-no-backdrop .swal2-container.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}body.swal2-toast-column .swal2-toast{flex-direction:column;align-items:stretch}body.swal2-toast-column .swal2-toast .swal2-actions{flex:1;align-self:stretch;height:2.2em;margin-top:.3125em}body.swal2-toast-column .swal2-toast .swal2-loading{justify-content:center}body.swal2-toast-column .swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}body.swal2-toast-column .swal2-toast .swal2-validation-message{font-size:1em}");

/***/ }),

/***/ "./resources/js/src/view/components/DashboardHistoryModal.vue":
/*!********************************************************************!*\
  !*** ./resources/js/src/view/components/DashboardHistoryModal.vue ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DashboardHistoryModal_vue_vue_type_template_id_d55e6df6_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true */ "./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true");
/* harmony import */ var _DashboardHistoryModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DashboardHistoryModal.vue?vue&type=script&lang=js */ "./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=script&lang=js");
/* harmony import */ var _DashboardHistoryModal_vue_vue_type_style_index_0_id_d55e6df6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css */ "./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DashboardHistoryModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DashboardHistoryModal_vue_vue_type_template_id_d55e6df6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _DashboardHistoryModal_vue_vue_type_template_id_d55e6df6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "d55e6df6",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/components/DashboardHistoryModal.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/components/OcrUploadModal.vue":
/*!*************************************************************!*\
  !*** ./resources/js/src/view/components/OcrUploadModal.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _OcrUploadModal_vue_vue_type_template_id_38ab2306_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true */ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true");
/* harmony import */ var _OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OcrUploadModal.vue?vue&type=script&lang=js */ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=script&lang=js");
/* harmony import */ var _OcrUploadModal_vue_vue_type_style_index_0_id_38ab2306_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css */ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css");
/* harmony import */ var _OcrUploadModal_vue_vue_type_style_index_1_id_38ab2306_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css */ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _OcrUploadModal_vue_vue_type_template_id_38ab2306_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _OcrUploadModal_vue_vue_type_template_id_38ab2306_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "38ab2306",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/components/OcrUploadModal.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/components/SkeletonTable.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/components/SkeletonTable.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SkeletonTable_vue_vue_type_template_id_6f0ed759_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true */ "./resources/js/src/view/components/SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true");
/* harmony import */ var _SkeletonTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SkeletonTable.vue?vue&type=script&lang=js */ "./resources/js/src/view/components/SkeletonTable.vue?vue&type=script&lang=js");
/* harmony import */ var _SkeletonTable_vue_vue_type_style_index_0_id_6f0ed759_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css */ "./resources/js/src/view/components/SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SkeletonTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SkeletonTable_vue_vue_type_template_id_6f0ed759_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _SkeletonTable_vue_vue_type_template_id_6f0ed759_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6f0ed759",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/components/SkeletonTable.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/layouts/public/SideBar.vue":
/*!**********************************************************!*\
  !*** ./resources/js/src/view/layouts/public/SideBar.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SideBar_vue_vue_type_template_id_5801612d_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SideBar.vue?vue&type=template&id=5801612d&scoped=true */ "./resources/js/src/view/layouts/public/SideBar.vue?vue&type=template&id=5801612d&scoped=true");
/* harmony import */ var _SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SideBar.vue?vue&type=script&lang=js */ "./resources/js/src/view/layouts/public/SideBar.vue?vue&type=script&lang=js");
/* harmony import */ var _SideBar_vue_vue_type_style_index_0_id_5801612d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css */ "./resources/js/src/view/layouts/public/SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SideBar_vue_vue_type_template_id_5801612d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _SideBar_vue_vue_type_template_id_5801612d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "5801612d",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/layouts/public/SideBar.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue":
/*!************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true");
/* harmony import */ var _FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");
/* harmony import */ var _FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "b6aec42e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/FocusAir.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue":
/*!******************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true");
/* harmony import */ var _FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocusAirImport.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js");
/* harmony import */ var _FocusAirImport_vue_vue_type_style_index_0_id_3e7c126e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css */ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3e7c126e",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/dashboard/FocusAirImport.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue":
/*!******************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/DecorativeEllipses.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
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

/***/ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue":
/*!****************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeServicesGrid.vue ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./resources/js/src/view/pages/public/components/SectionHeader.vue":
/*!*************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/SectionHeader.vue ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=script&lang=js":
/*!********************************************************************************************!*\
  !*** ./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=script&lang=js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DashboardHistoryModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DashboardHistoryModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DashboardHistoryModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/src/view/components/OcrUploadModal.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./OcrUploadModal.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/components/SkeletonTable.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/components/SkeletonTable.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SkeletonTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SkeletonTable.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SkeletonTable_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/layouts/public/SideBar.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/src/view/layouts/public/SideBar.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js":
/*!******************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAirImport.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HeroButton.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeServicesGrid.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js":
/*!*************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SectionHeader.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DashboardHistoryModal_vue_vue_type_template_id_d55e6df6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DashboardHistoryModal_vue_vue_type_template_id_d55e6df6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DashboardHistoryModal_vue_vue_type_template_id_d55e6df6_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=template&id=d55e6df6&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/components/OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_template_id_38ab2306_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_template_id_38ab2306_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_template_id_38ab2306_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=template&id=38ab2306&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/components/SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/components/SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SkeletonTable_vue_vue_type_template_id_6f0ed759_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SkeletonTable_vue_vue_type_template_id_6f0ed759_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SkeletonTable_vue_vue_type_template_id_6f0ed759_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=template&id=6f0ed759&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/layouts/public/SideBar.vue?vue&type=template&id=5801612d&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/public/SideBar.vue?vue&type=template&id=5801612d&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_5801612d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_5801612d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_template_id_5801612d_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=template&id=5801612d&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=template&id=5801612d&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_template_id_b6aec42e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=template&id=b6aec42e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_template_id_3e7c126e_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=template&id=3e7c126e&scoped=true");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64":
/*!************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/DecorativeEllipses.vue?vue&type=template&id=2e3f0d64 ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HeroButton_vue_vue_type_template_id_029dda8a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HeroButton.vue?vue&type=template&id=029dda8a */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HeroButton.vue?vue&type=template&id=029dda8a");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_HomeServicesGrid_vue_vue_type_template_id_9697751c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./HomeServicesGrid.vue?vue&type=template&id=9697751c */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/HomeServicesGrid.vue?vue&type=template&id=9697751c");


/***/ }),

/***/ "./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3 ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SectionHeader_vue_vue_type_template_id_04fa6db3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SectionHeader.vue?vue&type=template&id=04fa6db3 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/public/components/SectionHeader.vue?vue&type=template&id=04fa6db3");


/***/ }),

/***/ "./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css":
/*!****************************************************************************************************************************!*\
  !*** ./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DashboardHistoryModal_vue_vue_type_style_index_0_id_d55e6df6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/DashboardHistoryModal.vue?vue&type=style&index=0&id=d55e6df6&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_style_index_0_id_38ab2306_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=0&id=38ab2306&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_OcrUploadModal_vue_vue_type_style_index_1_id_38ab2306_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/OcrUploadModal.vue?vue&type=style&index=1&id=38ab2306&lang=css");


/***/ }),

/***/ "./resources/js/src/view/components/SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/components/SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SkeletonTable_vue_vue_type_style_index_0_id_6f0ed759_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/components/SkeletonTable.vue?vue&type=style&index=0&id=6f0ed759&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/layouts/public/SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/src/view/layouts/public/SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_SideBar_vue_vue_type_style_index_0_id_5801612d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/layouts/public/SideBar.vue?vue&type=style&index=0&id=5801612d&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_0_id_b6aec42e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=0&id=b6aec42e&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAir_vue_vue_type_style_index_1_id_b6aec42e_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAir.vue?vue&type=style&index=1&id=b6aec42e&lang=css");


/***/ }),

/***/ "./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css":
/*!**************************************************************************************************************************!*\
  !*** ./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css ***!
  \**************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_clonedRuleSet_9_use_0_node_modules_laravel_mix_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocusAirImport_vue_vue_type_style_index_0_id_3e7c126e_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!../../../../../../node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css */ "./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-9.use[0]!./node_modules/laravel-mix/node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/dashboard/FocusAirImport.vue?vue&type=style&index=0&id=3e7c126e&scoped=true&lang=css");


/***/ }),

/***/ "./node_modules/vue2-datepicker/index.esm.js":
/*!***************************************************!*\
  !*** ./node_modules/vue2-datepicker/index.esm.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var date_format_parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-format-parse */ "./node_modules/date-format-parse/es/index.js");


function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _extends$1() {
  return _extends$1 = Object.assign || function (a) {
    for (var b, c = 1; c < arguments.length; c++) {
      for (var d in b = arguments[c], b) {
        Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
      }
    }

    return a;
  }, _extends$1.apply(this, arguments);
}

var normalMerge = ["attrs", "props", "domProps"],
    toArrayMerge = ["class", "style", "directives"],
    functionalMerge = ["on", "nativeOn"],
    mergeJsxProps = function mergeJsxProps(a) {
  return a.reduce(function (c, a) {
    for (var b in a) {
      if (!c[b]) c[b] = a[b];else if (-1 !== normalMerge.indexOf(b)) c[b] = _extends$1({}, c[b], a[b]);else if (-1 !== toArrayMerge.indexOf(b)) {
        var d = c[b] instanceof Array ? c[b] : [c[b]],
            e = a[b] instanceof Array ? a[b] : [a[b]];
        c[b] = d.concat(e);
      } else if (-1 !== functionalMerge.indexOf(b)) {
        for (var f in a[b]) {
          if (c[b][f]) {
            var g = c[b][f] instanceof Array ? c[b][f] : [c[b][f]],
                h = a[b][f] instanceof Array ? a[b][f] : [a[b][f]];
            c[b][f] = g.concat(h);
          } else c[b][f] = a[b][f];
        }
      } else if ("hook" == b) for (var i in a[b]) {
        c[b][i] = c[b][i] ? mergeFn(c[b][i], a[b][i]) : a[b][i];
      } else c[b] = a[b];
    }

    return c;
  }, {});
},
    mergeFn = function mergeFn(a, b) {
  return function () {
    a && a.apply(this, arguments), b && b.apply(this, arguments);
  };
};

var helper = mergeJsxProps;

// new Date(10, 0, 1) The year from 0 to 99 will be incremented by 1900 automatically.
function createDate(y) {
  var M = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var ms = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var date = new Date(y, M, d, h, m, s, ms);

  if (y < 100 && y >= 0) {
    date.setFullYear(y);
  }

  return date;
}
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}
function isValidRangeDate(date) {
  return Array.isArray(date) && date.length === 2 && date.every(isValidDate) && date[0] <= date[1];
}
function isValidDates(dates) {
  return Array.isArray(dates) && dates.every(isValidDate);
}
function getValidDate(value) {
  var date = new Date(value);

  if (isValidDate(date)) {
    return date;
  }

  for (var _len = arguments.length, backup = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    backup[_key - 1] = arguments[_key];
  }

  if (backup.length) {
    return getValidDate.apply(void 0, backup);
  }

  return new Date();
}
function startOfYear(value) {
  var date = new Date(value);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfMonth(value) {
  var date = new Date(value);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}
function startOfDay(value) {
  var date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getCalendar(_ref) {
  var firstDayOfWeek = _ref.firstDayOfWeek,
      year = _ref.year,
      month = _ref.month;
  var arr = []; // change to the last day of the last month

  var calendar = createDate(year, month, 0);
  var lastDayInLastMonth = calendar.getDate(); // getDay() 0 is Sunday, 1 is Monday

  var firstDayInLastMonth = lastDayInLastMonth - (calendar.getDay() + 7 - firstDayOfWeek) % 7;

  for (var i = firstDayInLastMonth; i <= lastDayInLastMonth; i++) {
    arr.push(createDate(year, month, i - lastDayInLastMonth));
  } // change to the last day of the current month


  calendar.setMonth(month + 1, 0);
  var lastDayInCurrentMonth = calendar.getDate();

  for (var _i = 1; _i <= lastDayInCurrentMonth; _i++) {
    arr.push(createDate(year, month, _i));
  }

  var lastMonthLength = lastDayInLastMonth - firstDayInLastMonth + 1;
  var nextMonthLength = 6 * 7 - lastMonthLength - lastDayInCurrentMonth;

  for (var _i2 = 1; _i2 <= nextMonthLength; _i2++) {
    arr.push(createDate(year, month, lastDayInCurrentMonth + _i2));
  }

  return arr;
}
function setMonth(dirtyDate, dirtyMonth) {
  var date = new Date(dirtyDate);
  var month = typeof dirtyMonth === 'function' ? dirtyMonth(date.getMonth()) : Number(dirtyMonth);
  var year = date.getFullYear();
  var daysInMonth = createDate(year, month + 1, 0).getDate();
  var day = date.getDate();
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}
function setYear(dirtyDate, dirtyYear) {
  var date = new Date(dirtyDate);
  var year = typeof dirtyYear === 'function' ? dirtyYear(date.getFullYear()) : dirtyYear;
  date.setFullYear(year);
  return date;
}
function assignTime(target, source) {
  var date = new Date(target);
  var time = new Date(source);
  date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
  return date;
}

/**
 * chunk the array
 * @param {Array} arr
 * @param {Number} size
 */
function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    return [];
  }

  var result = [];
  var len = arr.length;
  var i = 0;
  size = size || len;

  while (i < len) {
    result.push(arr.slice(i, i += size));
  }

  return result;
}
/**
 * isObject
 * @param {*} obj
 * @returns {Boolean}
 */

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * pick object
 * @param {Object} obj
 * @param {Array|String} props
 */

function pick(obj, props) {
  if (!isObject(obj)) return {};

  if (!Array.isArray(props)) {
    props = [props];
  }

  var res = {};
  props.forEach(function (prop) {
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  });
  return res;
}
/**
 * deep merge two object without merging array
 * @param {object} target
 * @param {object} source
 */

function mergeDeep(target, source) {
  if (!isObject(target)) {
    return {};
  }

  var result = target;

  if (isObject(source)) {
    Object.keys(source).forEach(function (key) {
      var value = source[key];

      if (isObject(value) && isObject(target[key])) {
        value = mergeDeep(target[key], value);
      }

      result = _objectSpread2({}, result, _defineProperty({}, key, value));
    });
  }

  return result;
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var en = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var locale = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  firstDayOfWeek: 0,
  firstWeekContainsDate: 1
};
var _default = locale;
exports["default"] = _default;
module.exports = exports.default;
});

var en$1 = unwrapExports(en);

var lang = {
  formatLocale: en$1,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true
};

var defaultLocale = 'en';
var locales = {};
locales[defaultLocale] = lang;
function locale(name, object, isLocal) {
  if (typeof name !== 'string') return locales[defaultLocale];
  var l = defaultLocale;

  if (locales[name]) {
    l = name;
  }

  if (object) {
    locales[name] = object;
    l = name;
  }

  if (!isLocal) {
    defaultLocale = l;
  }

  return locales[name] || locales[defaultLocale];
}
/**
 * get locale object
 * @param {string} name lang
 */

function getLocale(name) {
  return locale(name, null, true);
}

/* istanbul ignore file */
function rafThrottle(fn) {
  var isRunning = false;
  return function fnBinfRaf() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(function () {
      isRunning = false;
      fn.apply(_this, args);
    });
  };
}

/**
 * get the hidden element width, height
 * @param {HTMLElement} element dom
 */
function getPopupElementSize(element) {
  var originalDisplay = element.style.display;
  var originalVisibility = element.style.visibility;
  element.style.display = 'block';
  element.style.visibility = 'hidden';
  var styles = window.getComputedStyle(element);
  var width = element.offsetWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
  var height = element.offsetHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
  element.style.display = originalDisplay;
  element.style.visibility = originalVisibility;
  return {
    width: width,
    height: height
  };
}
/**
 * get the popup position
 * @param {HTMLElement} el relative element
 * @param {Number} targetWidth target element's width
 * @param {Number} targetHeight target element's height
 * @param {Boolean} fixed
 */

function getRelativePosition(el, targetWidth, targetHeight, fixed) {
  var left = 0;
  var top = 0;
  var offsetX = 0;
  var offsetY = 0;
  var relativeRect = el.getBoundingClientRect();
  var dw = document.documentElement.clientWidth;
  var dh = document.documentElement.clientHeight;

  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left;
    offsetY = window.pageYOffset + relativeRect.top;
  }

  if (dw - relativeRect.left < targetWidth && relativeRect.right < targetWidth) {
    left = offsetX - relativeRect.left + 1;
  } else if (relativeRect.left + relativeRect.width / 2 <= dw / 2) {
    left = offsetX;
  } else {
    left = offsetX + relativeRect.width - targetWidth;
  }

  if (relativeRect.top <= targetHeight && dh - relativeRect.bottom <= targetHeight) {
    top = offsetY + dh - relativeRect.top - targetHeight;
  } else if (relativeRect.top + relativeRect.height / 2 <= dh / 2) {
    top = offsetY + relativeRect.height;
  } else {
    top = offsetY - targetHeight;
  }

  return {
    left: "".concat(left, "px"),
    top: "".concat(top, "px")
  };
}
function getScrollParent(node) {
  var until = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;

  if (!node || node === until) {
    return null;
  }

  var style = function style(value, prop) {
    return getComputedStyle(value, null).getPropertyValue(prop);
  };

  var regex = /(auto|scroll)/;
  var scroll = regex.test(style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x'));
  return scroll ? node : getScrollParent(node.parentNode, until);
}

//
var script = {
  name: 'Popup',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      top: '',
      left: ''
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler: function handler(val) {
        var _this = this;

        this.$nextTick(function () {
          if (val) {
            _this.displayPopup();
          }
        });
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }

    this._clickoutEvent = 'ontouchend' in document ? 'touchstart' : 'mousedown';
    document.addEventListener(this._clickoutEvent, this.handleClickOutside); // change the popup position when resize or scroll

    var relativeElement = this.$parent.$el;
    this._displayPopup = rafThrottle(function () {
      return _this2.displayPopup();
    });
    this._scrollParent = getScrollParent(relativeElement) || window;

    this._scrollParent.addEventListener('scroll', this._displayPopup);

    window.addEventListener('resize', this._displayPopup);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.appendToBody && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }

    document.removeEventListener(this._clickoutEvent, this.handleClickOutside);

    this._scrollParent.removeEventListener('scroll', this._displayPopup);

    window.removeEventListener('resize', this._displayPopup);
  },
  methods: {
    handleClickOutside: function handleClickOutside(evt) {
      if (!this.visible) return;
      var target = evt.target;
      var el = this.$el;

      if (el && !el.contains(target)) {
        this.$emit('clickoutside', evt);
      }
    },
    displayPopup: function displayPopup() {
      if (!this.visible) return;
      var popup = this.$el;
      var relativeElement = this.$parent.$el;
      var appendToBody = this.appendToBody;

      if (!this._popupRect) {
        this._popupRect = getPopupElementSize(popup);
      }

      var _this$_popupRect = this._popupRect,
          width = _this$_popupRect.width,
          height = _this$_popupRect.height;

      var _getRelativePosition = getRelativePosition(relativeElement, width, height, appendToBody),
          left = _getRelativePosition.left,
          top = _getRelativePosition.top;

      this.left = left;
      this.top = top;
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function (context) {
      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('transition', {
    attrs: {
      "name": _vm.prefixClass + "-zoom-in-down"
    }
  }, [_vm.visible ? _c('div', {
    class: _vm.prefixClass + "-datepicker-main " + _vm.prefixClass + "-datepicker-popup",
    style: {
      top: _vm.top,
      left: _vm.left,
      position: 'absolute'
    }
  }, [_vm._t("default")], 2) : _vm._e()]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

/* script */

/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 1024 1024",
      "width": "1em",
      "height": "1em"
    }
  }, [_c('path', {
    attrs: {
      "d": "M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0 32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z"
    }
  })]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, {}, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

/* script */

/* template */
var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 24 24",
      "width": "1em",
      "height": "1em"
    }
  }, [_c('path', {
    attrs: {
      "d": "M0 0h24v24H0z",
      "fill": "none"
    }
  }), _vm._v(" "), _c('path', {
    attrs: {
      "d": "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
    }
  }), _vm._v(" "), _c('path', {
    attrs: {
      "d": "M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"
    }
  })]);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = normalizeComponent({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, {}, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

/* script */

/* template */
var __vue_render__$3 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 1024 1024",
      "width": "1em",
      "height": "1em"
    }
  }, [_c('path', {
    attrs: {
      "d": "M810.005333 274.005333l-237.994667 237.994667 237.994667 237.994667-60.010667 60.010667-237.994667-237.994667-237.994667 237.994667-60.010667-60.010667 237.994667-237.994667-237.994667-237.994667 60.010667-60.010667 237.994667 237.994667 237.994667-237.994667z"
    }
  })]);
};

var __vue_staticRenderFns__$3 = [];
/* style */

var __vue_inject_styles__$3 = undefined;
/* scoped */

var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = undefined;
/* functional template */

var __vue_is_functional_template__$3 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$3 = normalizeComponent({
  render: __vue_render__$3,
  staticRenderFns: __vue_staticRenderFns__$3
}, __vue_inject_styles__$3, {}, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$1 = {
  props: {
    type: String,
    disabled: Boolean
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$4 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('button', _vm._g({
    class: [_vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-btn-icon-" + _vm.type, {
      disabled: _vm.disabled
    }],
    attrs: {
      "type": "button",
      "disabled": _vm.disabled
    }
  }, _vm.$listeners), [_c('i', {
    class: _vm.prefixClass + "-icon-" + _vm.type
  })]);
};

var __vue_staticRenderFns__$4 = [];
/* style */

var __vue_inject_styles__$4 = undefined;
/* scoped */

var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = undefined;
/* functional template */

var __vue_is_functional_template__$4 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$4 = normalizeComponent({
  render: __vue_render__$4,
  staticRenderFns: __vue_staticRenderFns__$4
}, __vue_inject_styles__$4, __vue_script__$1, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, undefined, undefined);

var script$2 = {
  name: 'TableDate',
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    getWeek: {
      default: function _default() {
        return date_format_parse__WEBPACK_IMPORTED_MODULE_0__.getWeek;
      }
    },
    prefixClass: {
      default: 'mx'
    },
    onDateMouseEnter: {
      default: undefined
    },
    onDateMouseLeave: {
      default: undefined
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    },
    showWeekNumber: {
      type: Boolean,
      default: false
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    getRowClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    firstDayOfWeek: function firstDayOfWeek() {
      return this.getLocale().formatLocale.firstDayOfWeek || 0;
    },
    yearMonth: function yearMonth() {
      var _this$getLocale = this.getLocale(),
          yearFormat = _this$getLocale.yearFormat,
          monthBeforeYear = _this$getLocale.monthBeforeYear,
          _this$getLocale$month = _this$getLocale.monthFormat,
          monthFormat = _this$getLocale$month === void 0 ? 'MMM' : _this$getLocale$month;

      var yearLabel = {
        panel: 'year',
        label: this.formatDate(this.calendar, yearFormat)
      };
      var monthLabel = {
        panel: 'month',
        label: this.formatDate(this.calendar, monthFormat)
      };
      return monthBeforeYear ? [monthLabel, yearLabel] : [yearLabel, monthLabel];
    },
    days: function days() {
      var locale = this.getLocale();
      var days = locale.days || locale.formatLocale.weekdaysMin;
      return days.concat(days).slice(this.firstDayOfWeek, this.firstDayOfWeek + 7);
    },
    dates: function dates() {
      var year = this.calendar.getFullYear();
      var month = this.calendar.getMonth();
      var arr = getCalendar({
        firstDayOfWeek: this.firstDayOfWeek,
        year: year,
        month: month
      });
      return chunk(arr, 7);
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);

      switch (type) {
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, date.getMonth() + 1, 0);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-year':
          date.setFullYear(date.getFullYear() + 1);
          break;

        case 'last-month':
          date.setMonth(date.getMonth(), 0);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-month':
          date.setMonth(date.getMonth() + 1);
          break;
      }

      return this.disabledCalendarChanger(date, type);
    },
    handleIconLeftClick: function handleIconLeftClick() {
      this.$emit('changecalendar', setMonth(this.calendar, function (v) {
        return v - 1;
      }), 'last-month');
    },
    handleIconRightClick: function handleIconRightClick() {
      this.$emit('changecalendar', setMonth(this.calendar, function (v) {
        return v + 1;
      }), 'next-month');
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v - 1;
      }), 'last-year');
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v + 1;
      }), 'next-year');
    },
    handlePanelChange: function handlePanelChange(panel) {
      this.$emit('changepanel', panel);
    },
    handleMouseEnter: function handleMouseEnter(cell) {
      if (typeof this.onDateMouseEnter === 'function') {
        this.onDateMouseEnter(cell);
      }
    },
    handleMouseLeave: function handleMouseLeave(cell) {
      if (typeof this.onDateMouseLeave === 'function') {
        this.onDateMouseLeave(cell);
      }
    },
    handleCellClick: function handleCellClick(evt) {
      var target = evt.target;

      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }

      var index = target.getAttribute('data-row-col');

      if (index) {
        var _index$split$map = index.split(',').map(function (v) {
          return parseInt(v, 10);
        }),
            _index$split$map2 = _slicedToArray(_index$split$map, 2),
            row = _index$split$map2[0],
            col = _index$split$map2[1];

        var date = this.dates[row][col];
        this.$emit('select', new Date(date));
      }
    },
    formatDate: function formatDate(date, fmt) {
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    getCellTitle: function getCellTitle(date) {
      var fmt = this.titleFormat;
      return this.formatDate(date, fmt);
    },
    getWeekNumber: function getWeekNumber(date) {
      return this.getWeek(date, this.getLocale().formatLocale);
    }
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$5 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-date"
  }, [_c('div', {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c('icon-button', {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows('last-year')
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "left",
      "disabled": _vm.isDisabledArrows('last-month')
    },
    on: {
      "click": _vm.handleIconLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows('next-year')
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "right",
      "disabled": _vm.isDisabledArrows('next-month')
    },
    on: {
      "click": _vm.handleIconRightClick
    }
  }), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-header-label"
  }, _vm._l(_vm.yearMonth, function (item) {
    return _c('button', {
      key: item.panel,
      class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-btn-current-" + item.panel,
      attrs: {
        "type": "button"
      },
      on: {
        "click": function click($event) {
          return _vm.handlePanelChange(item.panel);
        }
      }
    }, [_vm._v("\n        " + _vm._s(item.label) + "\n      ")]);
  }), 0)], 1), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c('table', {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-date"
  }, [_c('thead', [_c('tr', [_vm.showWeekNumber ? _c('th', {
    class: _vm.prefixClass + "-week-number-header"
  }) : _vm._e(), _vm._v(" "), _vm._l(_vm.days, function (day) {
    return _c('th', {
      key: day
    }, [_vm._v(_vm._s(day))]);
  })], 2)]), _vm._v(" "), _c('tbody', {
    on: {
      "click": _vm.handleCellClick
    }
  }, _vm._l(_vm.dates, function (row, i) {
    return _c('tr', {
      key: i,
      class: [_vm.prefixClass + "-date-row", _vm.getRowClasses(row)]
    }, [_vm.showWeekNumber ? _c('td', {
      class: _vm.prefixClass + "-week-number",
      attrs: {
        "data-row-col": i + ",0"
      }
    }, [_vm._v("\n            " + _vm._s(_vm.getWeekNumber(row[0])) + "\n          ")]) : _vm._e(), _vm._v(" "), _vm._l(row, function (cell, j) {
      return _c('td', {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell),
        attrs: {
          "data-row-col": i + "," + j,
          "title": _vm.getCellTitle(cell)
        },
        on: {
          "mouseenter": function mouseenter($event) {
            return _vm.handleMouseEnter(cell);
          },
          "mouseleave": function mouseleave($event) {
            return _vm.handleMouseLeave(cell);
          }
        }
      }, [_c('div', [_vm._v(_vm._s(cell.getDate()))])]);
    })], 2);
  }), 0)])])]);
};

var __vue_staticRenderFns__$5 = [];
/* style */

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = undefined;
/* functional template */

var __vue_is_functional_template__$5 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = normalizeComponent({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$2, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

//
var script$3 = {
  name: 'TableMonth',
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    calendarYear: function calendarYear() {
      return this.calendar.getFullYear();
    },
    months: function months() {
      var locale = this.getLocale();
      var monthsLocale = locale.months || locale.formatLocale.monthsShort;
      var months = monthsLocale.map(function (text, month) {
        return {
          text: text,
          month: month
        };
      });
      return chunk(months, 3);
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);

      switch (type) {
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-year':
          date.setFullYear(date.getFullYear() + 1, 0, 1);
          break;
      }

      return this.disabledCalendarChanger(date, type);
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v - 1;
      }), 'last-year');
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v + 1;
      }), 'next-year');
    },
    handlePanelChange: function handlePanelChange() {
      this.$emit('changepanel', 'year');
    },
    handleClick: function handleClick(evt) {
      var target = evt.target;

      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }

      var month = target.getAttribute('data-month');

      if (month && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(month, 10));
      }
    }
  }
};

/* script */
var __vue_script__$3 = script$3;
/* template */

var __vue_render__$6 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-month"
  }, [_c('div', {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c('icon-button', {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows('last-year')
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows('next-year')
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-header-label"
  }, [_c('button', {
    class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text",
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.handlePanelChange
    }
  }, [_vm._v("\n        " + _vm._s(_vm.calendarYear) + "\n      ")])])], 1), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c('table', {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-month",
    on: {
      "click": _vm.handleClick
    }
  }, _vm._l(_vm.months, function (row, i) {
    return _c('tr', {
      key: i
    }, _vm._l(row, function (cell, j) {
      return _c('td', {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell.month),
        attrs: {
          "data-month": cell.month
        }
      }, [_c('div', [_vm._v(_vm._s(cell.text))])]);
    }), 0);
  }), 0)])]);
};

var __vue_staticRenderFns__$6 = [];
/* style */

var __vue_inject_styles__$6 = undefined;
/* scoped */

var __vue_scope_id__$6 = undefined;
/* module identifier */

var __vue_module_identifier__$6 = undefined;
/* functional template */

var __vue_is_functional_template__$6 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$6 = normalizeComponent({
  render: __vue_render__$6,
  staticRenderFns: __vue_staticRenderFns__$6
}, __vue_inject_styles__$6, __vue_script__$3, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);

//
var script$4 = {
  name: 'TableYear',
  components: {
    IconButton: __vue_component__$4
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    calendar: {
      type: Date,
      default: function _default() {
        return new Date();
      }
    },
    getCellClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    getYearPanel: {
      type: Function
    }
  },
  computed: {
    years: function years() {
      var calendar = new Date(this.calendar);

      if (typeof this.getYearPanel === 'function') {
        return this.getYearPanel(calendar);
      }

      return this.getYears(calendar);
    },
    firstYear: function firstYear() {
      return this.years[0][0];
    },
    lastYear: function lastYear() {
      var last = function last(arr) {
        return arr[arr.length - 1];
      };

      return last(last(this.years));
    }
  },
  methods: {
    isDisabledArrows: function isDisabledArrows(type) {
      var date = new Date(this.calendar);

      switch (type) {
        case 'last-decade':
          date.setFullYear(this.firstYear - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;

        case 'next-decade':
          date.setFullYear(this.lastYear + 1, 0, 1);
          break;
      }

      return this.disabledCalendarChanger(date, type);
    },
    getYears: function getYears(calendar) {
      var firstYear = Math.floor(calendar.getFullYear() / 10) * 10;
      var years = [];

      for (var i = 0; i < 10; i++) {
        years.push(firstYear + i);
      }

      return chunk(years, 2);
    },
    handleIconDoubleLeftClick: function handleIconDoubleLeftClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v - 10;
      }), 'last-decade');
    },
    handleIconDoubleRightClick: function handleIconDoubleRightClick() {
      this.$emit('changecalendar', setYear(this.calendar, function (v) {
        return v + 10;
      }), 'next-decade');
    },
    handleClick: function handleClick(evt) {
      var target = evt.target;

      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }

      var year = target.getAttribute('data-year');

      if (year && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(year, 10));
      }
    }
  }
};

/* script */
var __vue_script__$4 = script$4;
/* template */

var __vue_render__$7 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-calendar " + _vm.prefixClass + "-calendar-panel-year"
  }, [_c('div', {
    class: _vm.prefixClass + "-calendar-header"
  }, [_c('icon-button', {
    attrs: {
      "type": "double-left",
      "disabled": _vm.isDisabledArrows('last-decade')
    },
    on: {
      "click": _vm.handleIconDoubleLeftClick
    }
  }), _vm._v(" "), _c('icon-button', {
    attrs: {
      "type": "double-right",
      "disabled": _vm.isDisabledArrows('next-decade')
    },
    on: {
      "click": _vm.handleIconDoubleRightClick
    }
  }), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-header-label"
  }, [_c('span', [_vm._v(_vm._s(_vm.firstYear))]), _vm._v(" "), _c('span', {
    class: _vm.prefixClass + "-calendar-decade-separator"
  }), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.lastYear))])])], 1), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-calendar-content"
  }, [_c('table', {
    class: _vm.prefixClass + "-table " + _vm.prefixClass + "-table-year",
    on: {
      "click": _vm.handleClick
    }
  }, _vm._l(_vm.years, function (row, i) {
    return _c('tr', {
      key: i
    }, _vm._l(row, function (cell, j) {
      return _c('td', {
        key: j,
        staticClass: "cell",
        class: _vm.getCellClasses(cell),
        attrs: {
          "data-year": cell
        }
      }, [_c('div', [_vm._v(_vm._s(cell))])]);
    }), 0);
  }), 0)])]);
};

var __vue_staticRenderFns__$7 = [];
/* style */

var __vue_inject_styles__$7 = undefined;
/* scoped */

var __vue_scope_id__$7 = undefined;
/* module identifier */

var __vue_module_identifier__$7 = undefined;
/* functional template */

var __vue_is_functional_template__$7 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$7 = normalizeComponent({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$7, __vue_script__$4, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, undefined, undefined);

var CalendarPanel = {
  name: 'CalendarPanel',
  inject: {
    prefixClass: {
      default: 'mx'
    },
    dispatchDatePicker: {
      default: function _default() {
        return function () {};
      }
    }
  },
  props: {
    value: {},
    defaultValue: {
      default: function _default() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    defaultPanel: {
      type: String
    },
    disabledCalendarChanger: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    disabledDate: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    type: {
      type: String,
      default: 'date'
    },
    getClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    showWeekNumber: {
      type: Boolean,
      default: undefined
    },
    getYearPanel: {
      type: Function
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    calendar: Date,
    // update date when select year or month
    partialUpdate: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    var panels = ['date', 'month', 'year'];
    var index = Math.max(panels.indexOf(this.type), panels.indexOf(this.defaultPanel));
    var panel = index !== -1 ? panels[index] : 'date';
    return {
      panel: panel,
      innerCalendar: new Date()
    };
  },
  computed: {
    innerValue: function innerValue() {
      var value = Array.isArray(this.value) ? this.value : [this.value];
      var map = {
        year: startOfYear,
        month: startOfMonth,
        date: startOfDay
      };
      var start = map[this.type] || map.date;
      return value.filter(isValidDate).map(function (v) {
        return start(v);
      });
    },
    calendarYear: function calendarYear() {
      return this.innerCalendar.getFullYear();
    },
    calendarMonth: function calendarMonth() {
      return this.innerCalendar.getMonth();
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: 'initCalendar'
    },
    calendar: {
      handler: 'initCalendar'
    },
    defaultValue: {
      handler: 'initCalendar'
    }
  },
  methods: {
    initCalendar: function initCalendar() {
      var calendarDate = this.calendar;

      if (!isValidDate(calendarDate)) {
        var length = this.innerValue.length;
        calendarDate = getValidDate(length > 0 ? this.innerValue[length - 1] : this.defaultValue);
      }

      this.innerCalendar = startOfMonth(calendarDate);
    },
    isDisabled: function isDisabled(date) {
      return this.disabledDate(new Date(date), this.innerValue);
    },
    emitDate: function emitDate(date, type) {
      if (!this.isDisabled(date)) {
        this.$emit('select', date, type, this.innerValue); // someone need get the first selected date to set range value. (#429)

        this.dispatchDatePicker('pick', date, type);
      }
    },
    handleCalendarChange: function handleCalendarChange(calendar, type) {
      var oldCalendar = new Date(this.innerCalendar);
      this.innerCalendar = calendar;
      this.$emit('update:calendar', calendar);
      this.dispatchDatePicker('calendar-change', calendar, oldCalendar, type);
    },
    handelPanelChange: function handelPanelChange(panel) {
      var oldPanel = this.panel;
      this.panel = panel;
      this.dispatchDatePicker('panel-change', panel, oldPanel);
    },
    handleSelectYear: function handleSelectYear(year) {
      if (this.type === 'year') {
        var date = this.getYearCellDate(year);
        this.emitDate(date, 'year');
      } else {
        this.handleCalendarChange(createDate(year, this.calendarMonth), 'year');
        this.handelPanelChange('month');

        if (this.partialUpdate && this.innerValue.length === 1) {
          var _date = new Date(this.innerValue[0]);

          _date.setFullYear(year);

          this.emitDate(_date, 'year');
        }
      }
    },
    handleSelectMonth: function handleSelectMonth(month) {
      if (this.type === 'month') {
        var date = this.getMonthCellDate(month);
        this.emitDate(date, 'month');
      } else {
        this.handleCalendarChange(createDate(this.calendarYear, month), 'month');
        this.handelPanelChange('date');

        if (this.partialUpdate && this.innerValue.length === 1) {
          var _date2 = new Date(this.innerValue[0]);

          _date2.setFullYear(this.calendarYear);

          this.emitDate(setMonth(_date2, month), 'month');
        }
      }
    },
    handleSelectDate: function handleSelectDate(date) {
      this.emitDate(date, this.type === 'week' ? 'week' : 'date');
    },
    getMonthCellDate: function getMonthCellDate(month) {
      return createDate(this.calendarYear, month);
    },
    getYearCellDate: function getYearCellDate(year) {
      return createDate(year, 0);
    },
    getDateClasses: function getDateClasses(cellDate) {
      var notCurrentMonth = cellDate.getMonth() !== this.calendarMonth;
      var classes = [];

      if (cellDate.getTime() === new Date().setHours(0, 0, 0, 0)) {
        classes.push('today');
      }

      if (notCurrentMonth) {
        classes.push('not-current-month');
      }

      var state = this.getStateClass(cellDate);

      if (!(state === 'active' && notCurrentMonth)) {
        classes.push(state);
      }

      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getMonthClasses: function getMonthClasses(month) {
      var classes = [];

      if (this.type !== 'month') {
        if (this.calendarMonth === month) {
          classes.push('active');
        }

        var _cellDate = this.getMonthCellDate(month);

        if (this.disabledCalendarChanger(_cellDate, 'month')) {
          classes.push('disabled');
        }

        return classes;
      }

      var cellDate = this.getMonthCellDate(month);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getYearClasses: function getYearClasses(year) {
      var classes = [];

      if (this.type !== 'year') {
        if (this.calendarYear === year) {
          classes.push('active');
        }

        var _cellDate2 = this.getYearCellDate(year);

        if (this.disabledCalendarChanger(_cellDate2, 'year')) {
          classes.push('disabled');
        }

        return classes;
      }

      var cellDate = this.getYearCellDate(year);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getStateClass: function getStateClass(cellDate) {
      if (this.isDisabled(cellDate)) {
        return 'disabled';
      }

      if (this.innerValue.some(function (v) {
        return v.getTime() === cellDate.getTime();
      })) {
        return 'active';
      }

      return '';
    },
    getWeekState: function getWeekState(row) {
      if (this.type !== 'week') return '';
      var start = row[0].getTime();
      var end = row[6].getTime();
      var active = this.innerValue.some(function (v) {
        var time = v.getTime();
        return time >= start && time <= end;
      });
      return active ? "".concat(this.prefixClass, "-active-week") : '';
    }
  },
  render: function render() {
    var h = arguments[0];
    var panel = this.panel,
        innerCalendar = this.innerCalendar;

    if (panel === 'year') {
      return h(__vue_component__$7, {
        "attrs": {
          "disabledCalendarChanger": this.disabledCalendarChanger,
          "calendar": innerCalendar,
          "getCellClasses": this.getYearClasses,
          "getYearPanel": this.getYearPanel
        },
        "on": {
          "select": this.handleSelectYear,
          "changecalendar": this.handleCalendarChange
        }
      });
    }

    if (panel === 'month') {
      return h(__vue_component__$6, {
        "attrs": {
          "disabledCalendarChanger": this.disabledCalendarChanger,
          "calendar": innerCalendar,
          "getCellClasses": this.getMonthClasses
        },
        "on": {
          "select": this.handleSelectMonth,
          "changepanel": this.handelPanelChange,
          "changecalendar": this.handleCalendarChange
        }
      });
    }

    return h(__vue_component__$5, {
      "attrs": {
        "disabledCalendarChanger": this.disabledCalendarChanger,
        "calendar": innerCalendar,
        "getCellClasses": this.getDateClasses,
        "getRowClasses": this.getWeekState,
        "titleFormat": this.titleFormat,
        "showWeekNumber": typeof this.showWeekNumber === 'boolean' ? this.showWeekNumber : this.type === 'week'
      },
      "class": _defineProperty({}, "".concat(this.prefixClass, "-calendar-week-mode"), this.type === 'week'),
      "on": {
        "select": this.handleSelectDate,
        "changepanel": this.handelPanelChange,
        "changecalendar": this.handleCalendarChange
      }
    });
  }
};

var CalendarRange = {
  name: 'CalendarRange',
  components: {
    CalendarPanel: CalendarPanel
  },
  provide: function provide() {
    return {
      onDateMouseEnter: this.onDateMouseEnter,
      onDateMouseLeave: this.onDateMouseLeave
    };
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: _objectSpread2({}, CalendarPanel.props),
  data: function data() {
    return {
      innerValue: [],
      calendars: [],
      hoveredValue: null
    };
  },
  computed: {
    // Minimum difference between start and end calendars
    calendarMinDiff: function calendarMinDiff() {
      var map = {
        date: 1,
        // type:date  min 1 month
        month: 1 * 12,
        // type:month min 1 year
        year: 10 * 12 // type:year  min 10 year

      };
      return map[this.type] || map.date;
    },
    calendarMaxDiff: function calendarMaxDiff() {
      return Infinity;
    },
    defaultValues: function defaultValues() {
      return Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        var _this = this;

        this.innerValue = isValidRangeDate(this.value) ? this.value : [new Date(NaN), new Date(NaN)];
        var calendars = this.innerValue.map(function (v, i) {
          return startOfMonth(getValidDate(v, _this.defaultValues[i]));
        });
        this.updateCalendars(calendars);
      }
    }
  },
  methods: {
    handleSelect: function handleSelect(date, type) {
      var _this$innerValue = _slicedToArray(this.innerValue, 2),
          startValue = _this$innerValue[0],
          endValue = _this$innerValue[1];

      if (isValidDate(startValue) && !isValidDate(endValue)) {
        if (startValue.getTime() > date.getTime()) {
          this.innerValue = [date, startValue];
        } else {
          this.innerValue = [startValue, date];
        }

        this.emitDate(this.innerValue, type);
      } else {
        this.innerValue = [date, new Date(NaN)];
      }
    },
    onDateMouseEnter: function onDateMouseEnter(cell) {
      this.hoveredValue = cell;
    },
    onDateMouseLeave: function onDateMouseLeave() {
      this.hoveredValue = null;
    },
    emitDate: function emitDate(dates, type) {
      this.$emit('select', dates, type);
    },
    updateStartCalendar: function updateStartCalendar(value) {
      this.updateCalendars([value, this.calendars[1]], 1);
    },
    updateEndCalendar: function updateEndCalendar(value) {
      this.updateCalendars([this.calendars[0], value], 0);
    },
    updateCalendars: function updateCalendars(calendars) {
      var adjustIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var gap = this.getCalendarGap(calendars);

      if (gap) {
        var calendar = new Date(calendars[adjustIndex]);
        calendar.setMonth(calendar.getMonth() + (adjustIndex === 0 ? -gap : gap));
        calendars[adjustIndex] = calendar;
      }

      this.calendars = calendars;
    },
    getCalendarGap: function getCalendarGap(calendars) {
      var _calendars = _slicedToArray(calendars, 2),
          calendarLeft = _calendars[0],
          calendarRight = _calendars[1];

      var yearDiff = calendarRight.getFullYear() - calendarLeft.getFullYear();
      var monthDiff = calendarRight.getMonth() - calendarLeft.getMonth();
      var diff = yearDiff * 12 + monthDiff;
      var min = this.calendarMinDiff;
      var max = this.calendarMaxDiff;

      if (diff < min) {
        return min - diff;
      }

      if (diff > max) {
        return max - diff;
      }

      return 0;
    },
    getRangeClasses: function getRangeClasses(cellDate, currentDates, classnames) {
      var classes = [].concat(this.getClasses(cellDate, currentDates, classnames));
      if (/disabled|active/.test(classnames)) return classes;

      var inRange = function inRange(data, range) {
        var fn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
          return v.getTime();
        };
        var value = fn(data);

        var _range$map = range.map(fn),
            _range$map2 = _slicedToArray(_range$map, 2),
            min = _range$map2[0],
            max = _range$map2[1];

        if (min > max) {
          var _ref = [max, min];
          min = _ref[0];
          max = _ref[1];
        }

        return value > min && value < max;
      };

      if (currentDates.length === 2 && inRange(cellDate, currentDates)) {
        return classes.concat('in-range');
      }

      if (currentDates.length === 1 && this.hoveredValue && inRange(cellDate, [currentDates[0], this.hoveredValue])) {
        return classes.concat('hover-in-range');
      }

      return classes;
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];
    var calendarRange = this.calendars.map(function (calendar, index) {
      var props = _objectSpread2({}, _this2.$props, {
        calendar: calendar,
        value: _this2.innerValue,
        defaultValue: _this2.defaultValues[index],
        getClasses: _this2.getRangeClasses,
        // don't update when range is true
        partialUpdate: false
      });

      var on = {
        select: _this2.handleSelect,
        'update:calendar': index === 0 ? _this2.updateStartCalendar : _this2.updateEndCalendar
      };
      return h("calendar-panel", {
        "props": _objectSpread2({}, props),
        "on": _objectSpread2({}, on)
      });
    });
    var prefixClass = this.prefixClass;
    return h("div", {
      "class": "".concat(prefixClass, "-range-wrapper")
    }, [calendarRange]);
  }
};

var scrollBarWidth;
function getScrollbarWidth () {
  if (typeof window === 'undefined') return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;
  var outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);
  var inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);
  scrollBarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  return scrollBarWidth;
}

//
var script$5 = {
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  data: function data() {
    return {
      scrollbarWidth: 0,
      thumbTop: '',
      thumbHeight: ''
    };
  },
  created: function created() {
    this.scrollbarWidth = getScrollbarWidth();
    document.addEventListener('mouseup', this.handleDragend);
  },
  beforeDestroy: function beforeDestroy() {
    document.addEventListener('mouseup', this.handleDragend);
  },
  mounted: function mounted() {
    this.$nextTick(this.getThumbSize);
  },
  methods: {
    getThumbSize: function getThumbSize() {
      var wrap = this.$refs.wrap;
      if (!wrap) return;
      var heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
      this.thumbHeight = heightPercentage < 100 ? "".concat(heightPercentage, "%") : '';
    },
    handleScroll: function handleScroll(evt) {
      var el = evt.currentTarget;
      var scrollHeight = el.scrollHeight,
          scrollTop = el.scrollTop;
      this.thumbTop = "".concat(scrollTop * 100 / scrollHeight, "%");
    },
    handleDragstart: function handleDragstart(evt) {
      evt.stopImmediatePropagation();
      this._draggable = true;
      var offsetTop = this.$refs.thumb.offsetTop;
      this._prevY = evt.clientY - offsetTop;
      document.addEventListener('mousemove', this.handleDraging);
    },
    handleDraging: function handleDraging(evt) {
      if (!this._draggable) return;
      var clientY = evt.clientY;
      var wrap = this.$refs.wrap;
      var scrollHeight = wrap.scrollHeight,
          clientHeight = wrap.clientHeight;
      var offsetY = clientY - this._prevY;
      var top = offsetY * scrollHeight / clientHeight;
      wrap.scrollTop = top;
    },
    handleDragend: function handleDragend() {
      if (this._draggable) {
        this._draggable = false;
        document.removeEventListener('mousemove', this.handleDraging);
      }
    }
  }
};

/* script */
var __vue_script__$5 = script$5;
/* template */

var __vue_render__$8 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-scrollbar",
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, [_c('div', {
    ref: "wrap",
    class: _vm.prefixClass + "-scrollbar-wrap",
    style: {
      marginRight: "-" + _vm.scrollbarWidth + "px"
    },
    on: {
      "scroll": _vm.handleScroll
    }
  }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-scrollbar-track"
  }, [_c('div', {
    ref: "thumb",
    class: _vm.prefixClass + "-scrollbar-thumb",
    style: {
      height: _vm.thumbHeight,
      top: _vm.thumbTop
    },
    on: {
      "mousedown": _vm.handleDragstart
    }
  })])]);
};

var __vue_staticRenderFns__$8 = [];
/* style */

var __vue_inject_styles__$8 = undefined;
/* scoped */

var __vue_scope_id__$8 = undefined;
/* module identifier */

var __vue_module_identifier__$8 = undefined;
/* functional template */

var __vue_is_functional_template__$8 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$8 = normalizeComponent({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$8, __vue_script__$5, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$8, false, undefined, undefined, undefined);

//

var padNumber = function padNumber(value) {
  value = parseInt(value, 10);
  return value < 10 ? "0".concat(value) : "".concat(value);
};

var generateOptions = function generateOptions(length, step, options) {
  if (Array.isArray(options)) {
    return options.filter(function (v) {
      return v >= 0 && v < length;
    });
  }

  if (step <= 0) {
    step = 1;
  }

  var arr = [];

  for (var i = 0; i < length; i += step) {
    arr.push(i);
  }

  return arr;
};

var scrollTo = function scrollTo(element, to) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  // jump to target if duration zero
  if (duration <= 0) {
    requestAnimationFrame(function () {
      element.scrollTop = to;
    });
    return;
  }

  var difference = to - element.scrollTop;
  var tick = difference / duration * 10;
  requestAnimationFrame(function () {
    var scrollTop = element.scrollTop + tick;

    if (scrollTop >= to) {
      element.scrollTop = to;
      return;
    }

    element.scrollTop = scrollTop;
    scrollTo(element, to, duration - 10);
  });
};

var script$6 = {
  name: 'ListColumns',
  components: {
    ScrollbarVertical: __vue_component__$8
  },
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    date: Date,
    scrollDuration: {
      type: Number,
      default: 100
    },
    getClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    showHour: {
      type: Boolean,
      default: true
    },
    showMinute: {
      type: Boolean,
      default: true
    },
    showSecond: {
      type: Boolean,
      default: true
    },
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    secondStep: {
      type: Number,
      default: 1
    },
    use12h: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    columns: function columns() {
      var cols = [];
      if (this.showHour) cols.push({
        type: 'hour',
        list: this.getHoursList()
      });
      if (this.showMinute) cols.push({
        type: 'minute',
        list: this.getMinutesList()
      });
      if (this.showSecond) cols.push({
        type: 'second',
        list: this.getSecondsList()
      });
      if (this.use12h) cols.push({
        type: 'ampm',
        list: this.getAMPMList()
      });
      return cols.filter(function (v) {
        return v.list.length > 0;
      });
    }
  },
  watch: {
    date: {
      handler: function handler() {
        var _this = this;

        this.$nextTick(function () {
          _this.scrollToSelected(_this.scrollDuration);
        });
      }
    }
  },
  mounted: function mounted() {
    this.scrollToSelected(0);
  },
  methods: {
    getHoursList: function getHoursList() {
      var _this2 = this;

      return generateOptions(this.use12h ? 12 : 24, this.hourStep, this.hourOptions).map(function (num) {
        var date = new Date(_this2.date);
        var text = padNumber(num);

        if (_this2.use12h) {
          if (num === 0) {
            text = '12';
          }

          if (date.getHours() >= 12) {
            num += 12;
          }
        }

        var value = date.setHours(num);
        return {
          value: value,
          text: text
        };
      });
    },
    getMinutesList: function getMinutesList() {
      var _this3 = this;

      return generateOptions(60, this.minuteStep, this.minuteOptions).map(function (num) {
        var value = new Date(_this3.date).setMinutes(num);
        return {
          value: value,
          text: padNumber(num)
        };
      });
    },
    getSecondsList: function getSecondsList() {
      var _this4 = this;

      return generateOptions(60, this.secondStep, this.secondOptions).map(function (num) {
        var value = new Date(_this4.date).setSeconds(num);
        return {
          value: value,
          text: padNumber(num)
        };
      });
    },
    getAMPMList: function getAMPMList() {
      var _this5 = this;

      return ['AM', 'PM'].map(function (text, i) {
        var date = new Date(_this5.date);
        var value = date.setHours(date.getHours() % 12 + i * 12);
        return {
          text: text,
          value: value
        };
      });
    },
    scrollToSelected: function scrollToSelected(duration) {
      var elements = this.$el.querySelectorAll('.active');

      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var scrollElement = getScrollParent(element, this.$el);

        if (scrollElement) {
          var to = element.offsetTop;
          scrollTo(scrollElement, to, duration);
        }
      }
    },
    handleSelect: function handleSelect(evt) {
      var target = evt.target,
          currentTarget = evt.currentTarget;
      if (target.tagName.toUpperCase() !== 'LI') return;
      var type = currentTarget.getAttribute('data-type');
      var colIndex = parseInt(currentTarget.getAttribute('data-index'), 10);
      var cellIndex = parseInt(target.getAttribute('data-index'), 10);
      var value = this.columns[colIndex].list[cellIndex].value;
      this.$emit('select', value, type);
    }
  }
};

/* script */
var __vue_script__$6 = script$6;
/* template */

var __vue_render__$9 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-time-columns"
  }, _vm._l(_vm.columns, function (col, i) {
    return _c('scrollbar-vertical', {
      key: i,
      class: _vm.prefixClass + "-time-column"
    }, [_c('ul', {
      class: _vm.prefixClass + "-time-list",
      attrs: {
        "data-type": col.type,
        "data-index": i
      },
      on: {
        "click": _vm.handleSelect
      }
    }, _vm._l(col.list, function (item, j) {
      return _c('li', {
        key: item.value,
        class: [_vm.prefixClass + "-time-item", _vm.getClasses(item.value, col.type)],
        attrs: {
          "data-index": j
        }
      }, [_vm._v("\n        " + _vm._s(item.text) + "\n      ")]);
    }), 0)]);
  }), 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

var __vue_inject_styles__$9 = undefined;
/* scoped */

var __vue_scope_id__$9 = undefined;
/* module identifier */

var __vue_module_identifier__$9 = undefined;
/* functional template */

var __vue_is_functional_template__$9 = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$9 = normalizeComponent({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$9, __vue_script__$6, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$9, false, undefined, undefined, undefined);

//

function parseOption() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var values = time.split(':');

  if (values.length >= 2) {
    var hours = parseInt(values[0], 10);
    var minutes = parseInt(values[1], 10);
    return {
      hours: hours,
      minutes: minutes
    };
  }

  return null;
}

var scrollTo$1 = function scrollTo(element, to) {
  if (element) {
    element.scrollTop = to;
  }
};

var script$7 = {
  name: 'ListOptions',
  components: {
    ScrollbarVertical: __vue_component__$8
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    date: Date,
    options: {
      type: [Object, Function],
      default: function _default() {
        return [];
      }
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    getClasses: {
      type: Function,
      default: function _default() {
        return [];
      }
    }
  },
  computed: {
    list: function list() {
      var result = [];
      var options = this.options;

      if (typeof options === 'function') {
        return options() || [];
      }

      var start = parseOption(options.start);
      var end = parseOption(options.end);
      var step = parseOption(options.step);
      var fmt = options.format || this.format;

      if (start && end && step) {
        var startMinutes = start.minutes + start.hours * 60;
        var endMinutes = end.minutes + end.hours * 60;
        var stepMinutes = step.minutes + step.hours * 60;
        var len = Math.floor((endMinutes - startMinutes) / stepMinutes);

        for (var i = 0; i <= len; i++) {
          var timeMinutes = startMinutes + i * stepMinutes;
          var hours = Math.floor(timeMinutes / 60);
          var minutes = timeMinutes % 60;
          var value = new Date(this.date).setHours(hours, minutes, 0);
          result.push({
            value: value,
            text: this.formatDate(value, fmt)
          });
        }
      }

      return result;
    }
  },
  mounted: function mounted() {
    this.scrollToSelected();
  },
  methods: {
    formatDate: function formatDate(date, fmt) {
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    scrollToSelected: function scrollToSelected() {
      var element = this.$el.querySelector('.active');
      if (!element) return;
      var scrollElement = getScrollParent(element, this.$el);
      if (!scrollElement) return;
      var to = element.offsetTop;
      scrollTo$1(scrollElement, to);
    },
    handleSelect: function handleSelect(value) {
      this.$emit('select', value, 'time');
    }
  }
};

/* script */
var __vue_script__$7 = script$7;
/* template */

var __vue_render__$a = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('scrollbar-vertical', _vm._l(_vm.list, function (item) {
    return _c('div', {
      key: item.value,
      class: [_vm.prefixClass + "-time-option", _vm.getClasses(item.value)],
      on: {
        "click": function click($event) {
          return _vm.handleSelect(item.value);
        }
      }
    }, [_vm._v("\n    " + _vm._s(item.text) + "\n  ")]);
  }), 0);
};

var __vue_staticRenderFns__$a = [];
/* style */

var __vue_inject_styles__$a = undefined;
/* scoped */

var __vue_scope_id__$a = undefined;
/* module identifier */

var __vue_module_identifier__$a = undefined;
/* functional template */

var __vue_is_functional_template__$a = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$a = normalizeComponent({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$a, __vue_script__$7, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$a, false, undefined, undefined, undefined);

//
var script$8 = {
  name: 'TimePanel',
  components: {
    ListColumns: __vue_component__$9,
    ListOptions: __vue_component__$a
  },
  inject: {
    getLocale: {
      default: function _default() {
        return getLocale;
      }
    },
    prefixClass: {
      default: 'mx'
    }
  },
  props: {
    value: {},
    defaultValue: {
      default: function _default() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      }
    },
    format: {
      default: 'HH:mm:ss'
    },
    timeTitleFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    showTimeHeader: {
      type: Boolean,
      default: false
    },
    disabledTime: {
      type: Function,
      default: function _default() {
        return false;
      }
    },
    timePickerOptions: {
      type: [Object, Function],
      default: function _default() {
        return null;
      }
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    hourStep: {
      type: Number,
      default: 1
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    secondStep: {
      type: Number,
      default: 1
    },
    showHour: {
      type: Boolean,
      default: undefined
    },
    showMinute: {
      type: Boolean,
      default: undefined
    },
    showSecond: {
      type: Boolean,
      default: undefined
    },
    use12h: {
      type: Boolean,
      default: undefined
    },
    scrollDuration: {
      type: Number,
      default: 100
    }
  },
  data: function data() {
    return {
      innerValue: getValidDate(this.value, this.defaultValue)
    };
  },
  computed: {
    title: function title() {
      var titleFormat = this.timeTitleFormat;
      var date = new Date(this.innerValue);
      return this.formatDate(date, titleFormat);
    },
    innerForamt: function innerForamt() {
      return typeof this.format === 'string' ? this.format : 'HH:mm:ss';
    },
    ShowHourMinuteSecondAMPM: function ShowHourMinuteSecondAMPM() {
      var _this = this;

      var fmt = this.innerForamt;
      var defaultProps = {
        showHour: /[HhKk]/.test(fmt),
        showMinute: /m/.test(fmt),
        showSecond: /s/.test(fmt),
        use12h: /a/i.test(fmt)
      };
      var obj = {};
      Object.keys(defaultProps).forEach(function (key) {
        obj[key] = typeof _this[key] === 'boolean' ? _this[key] : defaultProps[key];
      });
      return obj;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        this.innerValue = getValidDate(this.value, this.defaultValue);
      }
    }
  },
  methods: {
    formatDate: function formatDate(date, fmt) {
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.getLocale().formatLocale
      });
    },
    isDisabledTime: function isDisabledTime(value) {
      return this.disabledTime(new Date(value));
    },
    isDisabledHour: function isDisabledHour(date) {
      var value = new Date(date);
      return this.isDisabledTime(value) && this.isDisabledTime(value.setMinutes(0, 0, 0)) && this.isDisabledTime(value.setMinutes(59, 59, 999));
    },
    isDisabledMinute: function isDisabledMinute(date) {
      var value = new Date(date);
      return this.isDisabledTime(value) && this.isDisabledTime(value.setSeconds(0, 0)) && this.isDisabledTime(value.setSeconds(59, 999));
    },
    isDisabledAMPM: function isDisabledAMPM(date) {
      var value = new Date(date);
      var minHour = value.getHours() < 12 ? 0 : 12;
      var maxHour = minHour + 11;
      return this.isDisabledTime(value) && this.isDisabledTime(value.setHours(minHour, 0, 0, 0)) && this.isDisabledTime(value.setHours(maxHour, 59, 59, 999));
    },
    isDisabled: function isDisabled(date, type) {
      if (type === 'hour') {
        return this.isDisabledHour(date);
      }

      if (type === 'minute') {
        return this.isDisabledMinute(date);
      }

      if (type === 'ampm') {
        return this.isDisabledAMPM(date);
      }

      return this.isDisabledTime(date);
    },
    handleSelect: function handleSelect(value, type) {
      var date = new Date(value);

      if (!this.isDisabled(value, type)) {
        this.innerValue = date;

        if (!this.isDisabledTime(date)) {
          this.$emit('select', date, type);
        }
      }
    },
    handleClickTitle: function handleClickTitle() {
      this.$emit('clicktitle');
    },
    getClasses: function getClasses(value, type) {
      var cellDate = new Date(value);

      if (this.isDisabled(value, type)) {
        return 'disabled';
      }

      if (cellDate.getTime() === this.innerValue.getTime()) {
        return 'active';
      }

      return '';
    }
  }
};

/* script */
var __vue_script__$8 = script$8;
/* template */

var __vue_render__$b = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: _vm.prefixClass + "-time"
  }, [_vm.showTimeHeader ? _c('div', {
    class: _vm.prefixClass + "-time-header"
  }, [_c('button', {
    class: _vm.prefixClass + "-btn " + _vm.prefixClass + "-btn-text " + _vm.prefixClass + "-time-header-title",
    attrs: {
      "type": "button"
    },
    on: {
      "click": _vm.handleClickTitle
    }
  }, [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")])]) : _vm._e(), _vm._v(" "), _c('div', {
    class: _vm.prefixClass + "-time-content"
  }, [_vm.timePickerOptions ? _c('list-options', {
    attrs: {
      "date": _vm.innerValue,
      "get-classes": _vm.getClasses,
      "options": _vm.timePickerOptions,
      "format": _vm.innerForamt
    },
    on: {
      "select": _vm.handleSelect
    }
  }) : _c('list-columns', _vm._b({
    attrs: {
      "date": _vm.innerValue,
      "get-classes": _vm.getClasses,
      "hour-options": _vm.hourOptions,
      "minute-options": _vm.minuteOptions,
      "second-options": _vm.secondOptions,
      "hour-step": _vm.hourStep,
      "minute-step": _vm.minuteStep,
      "second-step": _vm.secondStep,
      "scroll-duration": _vm.scrollDuration
    },
    on: {
      "select": _vm.handleSelect
    }
  }, 'list-columns', _vm.ShowHourMinuteSecondAMPM, false))], 1)]);
};

var __vue_staticRenderFns__$b = [];
/* style */

var __vue_inject_styles__$b = undefined;
/* scoped */

var __vue_scope_id__$b = undefined;
/* module identifier */

var __vue_module_identifier__$b = undefined;
/* functional template */

var __vue_is_functional_template__$b = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$b = normalizeComponent({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$b, __vue_script__$8, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$b, false, undefined, undefined, undefined);

var TimeRange = {
  name: 'TimeRange',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  props: _objectSpread2({}, __vue_component__$b.props),
  data: function data() {
    return {
      startValue: new Date(NaN),
      endValue: new Date(NaN)
    };
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler() {
        if (isValidRangeDate(this.value)) {
          var _this$value = _slicedToArray(this.value, 2),
              startValue = _this$value[0],
              endValue = _this$value[1];

          this.startValue = startValue;
          this.endValue = endValue;
        } else {
          this.startValue = new Date(NaN);
          this.endValue = new Date(NaN);
        }
      }
    }
  },
  methods: {
    emitChange: function emitChange(type, index) {
      var date = [this.startValue, this.endValue];
      this.$emit('select', date, type === 'time' ? 'time-range' : type, index);
    },
    handleSelectStart: function handleSelectStart(date, type) {
      this.startValue = date; // check the NaN

      if (!(this.endValue.getTime() >= date.getTime())) {
        this.endValue = date;
      }

      this.emitChange(type, 0);
    },
    handleSelectEnd: function handleSelectEnd(date, type) {
      // check the NaN
      this.endValue = date;

      if (!(this.startValue.getTime() <= date.getTime())) {
        this.startValue = date;
      }

      this.emitChange(type, 1);
    },
    disabledStartTime: function disabledStartTime(date) {
      return this.disabledTime(date, 0);
    },
    disabledEndTime: function disabledEndTime(date) {
      return date.getTime() < this.startValue.getTime() || this.disabledTime(date, 1);
    }
  },
  render: function render() {
    var h = arguments[0];
    var defaultValues = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
    var prefixClass = this.prefixClass;
    return h("div", {
      "class": "".concat(prefixClass, "-range-wrapper")
    }, [h(__vue_component__$b, {
      "props": _objectSpread2({}, _objectSpread2({}, this.$props, {
        value: this.startValue,
        defaultValue: defaultValues[0],
        disabledTime: this.disabledStartTime
      })),
      "on": _objectSpread2({}, _objectSpread2({}, this.$listeners, {
        select: this.handleSelectStart
      }))
    }), h(__vue_component__$b, {
      "props": _objectSpread2({}, _objectSpread2({}, this.$props, {
        value: this.endValue,
        defaultValue: defaultValues[1],
        disabledTime: this.disabledEndTime
      })),
      "on": _objectSpread2({}, _objectSpread2({}, this.$listeners, {
        select: this.handleSelectEnd
      }))
    })]);
  }
};

var DatetimePanel = {
  name: 'DatetimePanel',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  emits: ['select', 'update:show-time-panel'],
  props: _objectSpread2({}, CalendarPanel.props, {}, __vue_component__$b.props, {
    showTimePanel: {
      type: Boolean,
      default: undefined
    }
  }),
  data: function data() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value
    };
  },
  computed: {
    timeVisible: function timeVisible() {
      return typeof this.showTimePanel === 'boolean' ? this.showTimePanel : this.defaultTimeVisible;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    closeTimePanel: function closeTimePanel() {
      this.defaultTimeVisible = false;
      this.$emit('update:show-time-panel', false);
    },
    openTimePanel: function openTimePanel() {
      this.defaultTimeVisible = true;
      this.$emit('update:show-time-panel', true);
    },
    emitDate: function emitDate(date, type) {
      this.$emit('select', date, type);
    },
    handleSelect: function handleSelect(date, type) {
      if (type === 'date') {
        this.openTimePanel();
      }

      var datetime = assignTime(date, getValidDate(this.value, this.defaultValue));

      if (this.disabledTime(new Date(datetime))) {
        // set the time of defalutValue;
        datetime = assignTime(date, this.defaultValue);

        if (this.disabledTime(new Date(datetime))) {
          // if disabled don't emit date
          this.currentValue = datetime;
          return;
        }
      }

      this.emitDate(datetime, type);
    }
  },
  render: function render() {
    var h = arguments[0];
    var calendarProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(CalendarPanel.props)), {
        type: 'date',
        value: this.currentValue
      }),
      on: {
        select: this.handleSelect
      }
    };
    var timeProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(__vue_component__$b.props)), {
        showTimeHeader: true,
        value: this.currentValue
      }),
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel
      }
    };
    var prefixClass = this.prefixClass;
    return h("div", [h(CalendarPanel, helper([{}, calendarProps])), this.timeVisible && h(__vue_component__$b, helper([{
      "class": "".concat(prefixClass, "-calendar-time")
    }, timeProps]))]);
  }
};

var DatetimeRange = {
  name: 'DatetimeRange',
  inject: {
    prefixClass: {
      default: 'mx'
    }
  },
  emits: ['select', 'update:show-time-panel'],
  props: _objectSpread2({}, CalendarRange.props, {}, TimeRange.props, {
    showTimePanel: {
      type: Boolean,
      default: undefined
    }
  }),
  data: function data() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value
    };
  },
  computed: {
    timeVisible: function timeVisible() {
      return typeof this.showTimePanel === 'boolean' ? this.showTimePanel : this.defaultTimeVisible;
    }
  },
  watch: {
    value: function value(val) {
      this.currentValue = val;
    }
  },
  methods: {
    closeTimePanel: function closeTimePanel() {
      this.defaultTimeVisible = false;
      this.$emit('update:show-time-panel', false);
    },
    openTimePanel: function openTimePanel() {
      this.defaultTimeVisible = true;
      this.$emit('update:show-time-panel', true);
    },
    emitDate: function emitDate(dates, type) {
      this.$emit('select', dates, type);
    },
    handleSelect: function handleSelect(dates, type) {
      var _this = this;

      if (type === 'date') {
        this.openTimePanel();
      }

      var defaultValues = Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue, this.defaultValue];
      var datetimes = dates.map(function (date, i) {
        var time = isValidRangeDate(_this.value) ? _this.value[i] : defaultValues[i];
        return assignTime(date, time);
      });

      if (datetimes[1].getTime() < datetimes[0].getTime()) {
        datetimes = [datetimes[0], datetimes[0]];
      }

      if (datetimes.some(this.disabledTime)) {
        datetimes = dates.map(function (date, i) {
          return assignTime(date, defaultValues[i]);
        });

        if (datetimes.some(this.disabledTime)) {
          this.currentValue = datetimes;
          return;
        }
      }

      this.emitDate(datetimes, type);
    }
  },
  render: function render() {
    var h = arguments[0];
    var calendarProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(CalendarRange.props)), {
        type: 'date',
        value: this.currentValue
      }),
      on: {
        select: this.handleSelect
      }
    };
    var timeProps = {
      props: _objectSpread2({}, pick(this.$props, Object.keys(TimeRange.props)), {
        value: this.currentValue,
        showTimeHeader: true
      }),
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel
      }
    };
    var prefixClass = this.prefixClass;
    return h("div", [h(CalendarRange, helper([{}, calendarProps])), this.timeVisible && h(TimeRange, helper([{
      "class": "".concat(prefixClass, "-calendar-time")
    }, timeProps]))]);
  }
};

var componentMap = {
  default: CalendarPanel,
  time: __vue_component__$b,
  datetime: DatetimePanel
};
var componentRangeMap = {
  default: CalendarRange,
  time: TimeRange,
  datetime: DatetimeRange
};
var DatePicker = {
  name: 'DatePicker',
  provide: function provide() {
    var _this = this;

    return {
      // make locale reactive
      getLocale: function getLocale() {
        return _this.locale;
      },
      getWeek: this.getWeek,
      prefixClass: this.prefixClass,
      dispatchDatePicker: this.$emit.bind(this)
    };
  },
  props: _objectSpread2({}, DatetimePanel.props, {
    value: {},
    valueType: {
      type: String,
      default: 'date' // date, format, timestamp, or token like 'YYYY-MM-DD'

    },
    type: {
      type: String,
      // ['date', 'datetime', 'time', 'year', 'month', 'week']
      default: 'date'
    },
    format: {
      type: String
    },
    formatter: {
      type: Object
    },
    range: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      type: String
    },
    lang: {
      type: [String, Object]
    },
    placeholder: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    prefixClass: {
      type: String,
      default: 'mx'
    },
    inputClass: {},
    inputAttr: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean,
      default: undefined
    },
    popupClass: {},
    popupStyle: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: 'OK'
    },
    renderInputText: {
      type: Function
    },
    shortcuts: {
      type: Array,
      validator: function validator(value) {
        return Array.isArray(value) && value.every(function (v) {
          return isObject(v) && typeof v.text === 'string' && typeof v.onClick === 'function';
        });
      },
      default: function _default() {
        return [];
      }
    }
  }),
  data: function data() {
    return {
      // cache the innervalue, wait to confirm
      currentValue: null,
      userInput: null,
      defaultOpen: false,
      mouseInInput: false
    };
  },
  computed: {
    popupVisible: function popupVisible() {
      return !this.disabled && (typeof this.open === 'boolean' ? this.open : this.defaultOpen);
    },
    innerRangeSeparator: function innerRangeSeparator() {
      return this.rangeSeparator || (this.multiple ? ',' : ' ~ ');
    },
    innerFormat: function innerFormat() {
      var map = {
        date: 'YYYY-MM-DD',
        datetime: 'YYYY-MM-DD HH:mm:ss',
        year: 'YYYY',
        month: 'YYYY-MM',
        time: 'HH:mm:ss',
        week: 'w'
      };
      return this.format || map[this.type] || map.date;
    },
    innerValue: function innerValue() {
      var value = this.value;

      if (this.validMultipleType) {
        value = Array.isArray(value) ? value : [];
        return value.map(this.value2date);
      }

      if (this.range) {
        value = Array.isArray(value) ? value.slice(0, 2) : [null, null];
        return value.map(this.value2date);
      }

      return this.value2date(value);
    },
    text: function text() {
      var _this2 = this;

      if (this.userInput !== null) {
        return this.userInput;
      }

      if (typeof this.renderInputText === 'function') {
        return this.renderInputText(this.innerValue);
      }

      if (!this.isValidValue(this.innerValue)) {
        return '';
      }

      if (Array.isArray(this.innerValue)) {
        return this.innerValue.map(function (v) {
          return _this2.formatDate(v);
        }).join(this.innerRangeSeparator);
      }

      return this.formatDate(this.innerValue);
    },
    showClearIcon: function showClearIcon() {
      return !this.disabled && this.clearable && this.text && this.mouseInInput;
    },
    locale: function locale() {
      if (isObject(this.lang)) {
        return mergeDeep(getLocale(), this.lang);
      }

      return getLocale(this.lang);
    },
    validMultipleType: function validMultipleType() {
      var types = ['date', 'month', 'year'];
      return this.multiple && !this.range && types.indexOf(this.type) !== -1;
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler: function handler(val) {
        this.currentValue = val;
      }
    },
    popupVisible: {
      handler: function handler(val) {
        if (val) {
          this.currentValue = this.innerValue;
        }
      }
    }
  },
  created: function created() {
    if (_typeof(this.format) === 'object') {
      console.warn("[vue2-datepicker]: The prop `format` don't support Object any more. You can use the new prop `formatter` to replace it");
    }
  },
  methods: {
    handleMouseEnter: function handleMouseEnter() {
      this.mouseInInput = true;
    },
    handleMouseLeave: function handleMouseLeave() {
      this.mouseInInput = false;
    },
    handleClickOutSide: function handleClickOutSide(evt) {
      var target = evt.target;

      if (!this.$el.contains(target)) {
        this.closePopup();
      }
    },
    getFormatter: function getFormatter(key) {
      return isObject(this.formatter) && this.formatter[key] || isObject(this.format) && this.format[key];
    },
    getWeek: function getWeek$1(date, options) {
      if (typeof this.getFormatter('getWeek') === 'function') {
        return this.getFormatter('getWeek')(date, options);
      }

      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.getWeek)(date, options);
    },
    parseDate: function parseDate(value, fmt) {
      fmt = fmt || this.innerFormat;

      if (typeof this.getFormatter('parse') === 'function') {
        return this.getFormatter('parse')(value, fmt);
      }

      var backupDate = new Date();
      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.parse)(value, fmt, {
        locale: this.locale.formatLocale,
        backupDate: backupDate
      });
    },
    formatDate: function formatDate(date, fmt) {
      fmt = fmt || this.innerFormat;

      if (typeof this.getFormatter('stringify') === 'function') {
        return this.getFormatter('stringify')(date, fmt);
      }

      return (0,date_format_parse__WEBPACK_IMPORTED_MODULE_0__.format)(date, fmt, {
        locale: this.locale.formatLocale
      });
    },
    // transform the outer value to inner date
    value2date: function value2date(value) {
      switch (this.valueType) {
        case 'date':
          return value instanceof Date ? new Date(value.getTime()) : new Date(NaN);

        case 'timestamp':
          return typeof value === 'number' ? new Date(value) : new Date(NaN);

        case 'format':
          return typeof value === 'string' ? this.parseDate(value) : new Date(NaN);

        default:
          return typeof value === 'string' ? this.parseDate(value, this.valueType) : new Date(NaN);
      }
    },
    // transform the inner date to outer value
    date2value: function date2value(date) {
      if (!isValidDate(date)) return null;

      switch (this.valueType) {
        case 'date':
          return date;

        case 'timestamp':
          return date.getTime();

        case 'format':
          return this.formatDate(date);

        default:
          return this.formatDate(date, this.valueType);
      }
    },
    emitValue: function emitValue(date, type) {
      var close = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      // fix IE11/10 trigger input event when input is focused. (placeholder !== '')
      this.userInput = null;
      var value = Array.isArray(date) ? date.map(this.date2value) : this.date2value(date);
      this.$emit('input', value);
      this.$emit('change', value, type);

      if (close) {
        this.closePopup();
      }

      return value;
    },
    isValidValue: function isValidValue(value) {
      if (this.validMultipleType) {
        return isValidDates(value);
      }

      if (this.range) {
        return isValidRangeDate(value);
      }

      return isValidDate(value);
    },
    isValidValueAndNotDisabled: function isValidValueAndNotDisabled(value) {
      if (!this.isValidValue(value)) {
        return false;
      }

      var disabledDate = typeof this.disabledDate === 'function' ? this.disabledDate : function () {
        return false;
      };
      var disabledTime = typeof this.disabledTime === 'function' ? this.disabledTime : function () {
        return false;
      };

      if (!Array.isArray(value)) {
        value = [value];
      }

      return value.every(function (v) {
        return !disabledDate(v) && !disabledTime(v);
      });
    },
    handleMultipleDates: function handleMultipleDates(date, dates) {
      if (this.validMultipleType && dates) {
        var nextDates = dates.filter(function (v) {
          return v.getTime() !== date.getTime();
        });

        if (nextDates.length === dates.length) {
          nextDates.push(date);
        }

        return nextDates;
      }

      return date;
    },
    handleSelectDate: function handleSelectDate(val, type, dates) {
      val = this.handleMultipleDates(val, dates);

      if (this.confirm) {
        this.currentValue = val;
      } else {
        this.emitValue(val, type, // this.type === 'datetime', click the time should close popup
        !this.validMultipleType && (type === this.type || type === 'time'));
      }
    },
    clear: function clear() {
      this.emitValue(this.range ? [null, null] : null);
      this.$emit('clear');
    },
    handleClear: function handleClear(evt) {
      evt.stopPropagation();
      this.clear();
    },
    handleConfirmDate: function handleConfirmDate() {
      var value = this.emitValue(this.currentValue);
      this.$emit('confirm', value);
    },
    handleSelectShortcut: function handleSelectShortcut(evt) {
      var index = evt.currentTarget.getAttribute('data-index');
      var item = this.shortcuts[parseInt(index, 10)];

      if (isObject(item) && typeof item.onClick === 'function') {
        var date = item.onClick(this);

        if (date) {
          this.emitValue(date);
        }
      }
    },
    openPopup: function openPopup(evt) {
      if (this.popupVisible || this.disabled) return;
      this.defaultOpen = true;
      this.$emit('open', evt);
      this.$emit('update:open', true);
    },
    closePopup: function closePopup() {
      if (!this.popupVisible) return;
      this.defaultOpen = false;
      this.$emit('close');
      this.$emit('update:open', false);
    },
    blur: function blur() {
      // when use slot input
      if (this.$refs.input) {
        this.$refs.input.blur();
      }
    },
    focus: function focus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
    handleInputChange: function handleInputChange() {
      var _this3 = this;

      if (!this.editable || this.userInput === null) return;
      var text = this.userInput.trim();
      this.userInput = null;

      if (text === '') {
        this.clear();
        return;
      }

      var date;

      if (this.validMultipleType) {
        date = text.split(this.innerRangeSeparator).map(function (v) {
          return _this3.parseDate(v.trim());
        });
      } else if (this.range) {
        var arr = text.split(this.innerRangeSeparator);

        if (arr.length !== 2) {
          // Maybe the separator during the day is the same as the separator for the date
          // eg: 2019-10-09-2020-01-02
          arr = text.split(this.innerRangeSeparator.trim());
        }

        date = arr.map(function (v) {
          return _this3.parseDate(v.trim());
        });
      } else {
        date = this.parseDate(text);
      }

      if (this.isValidValueAndNotDisabled(date)) {
        this.emitValue(date);
        this.blur();
      } else {
        this.$emit('input-error', text);
      }
    },
    handleInputInput: function handleInputInput(evt) {
      // slot input v-model
      this.userInput = typeof evt === 'string' ? evt : evt.target.value;
    },
    handleInputKeydown: function handleInputKeydown(evt) {
      var keyCode = evt.keyCode; // Tab 9 or Enter 13

      if (keyCode === 9) {
        this.closePopup();
      } else if (keyCode === 13) {
        this.handleInputChange();
      }
    },
    handleInputBlur: function handleInputBlur(evt) {
      // tab close
      this.$emit('blur', evt);
    },
    handleInputFocus: function handleInputFocus(evt) {
      this.openPopup(evt);
      this.$emit('focus', evt);
    },
    hasSlot: function hasSlot(name) {
      return !!(this.$slots[name] || this.$scopedSlots[name]);
    },
    renderSlot: function renderSlot(name, fallback, props) {
      var slotFn = this.$scopedSlots[name];

      if (slotFn) {
        return slotFn(props) || fallback;
      }

      return this.$slots[name] || fallback;
    },
    renderInput: function renderInput() {
      var h = this.$createElement;
      var prefixClass = this.prefixClass;

      var props = _objectSpread2({
        name: 'date',
        type: 'text',
        autocomplete: 'off',
        value: this.text,
        class: this.inputClass || "".concat(this.prefixClass, "-input"),
        readonly: !this.editable,
        disabled: this.disabled,
        placeholder: this.placeholder
      }, this.inputAttr);

      var value = props.value,
          className = props.class,
          attrs = _objectWithoutProperties(props, ["value", "class"]);

      var events = {
        keydown: this.handleInputKeydown,
        focus: this.handleInputFocus,
        blur: this.handleInputBlur,
        input: this.handleInputInput,
        change: this.handleInputChange
      };
      var input = this.renderSlot('input', h("input", {
        "domProps": {
          "value": value
        },
        "class": className,
        "attrs": _objectSpread2({}, attrs),
        "on": _objectSpread2({}, events),
        "ref": "input"
      }), {
        props: props,
        events: events
      });
      var calendarIcon = this.type === 'time' ? h(__vue_component__$2) : h(__vue_component__$1); // remove touchstart event to avoid opens the popup while scrolling in mobile #469

      return h("div", {
        "class": "".concat(prefixClass, "-input-wrapper"),
        "on": {
          "mouseenter": this.handleMouseEnter,
          "mouseleave": this.handleMouseLeave,
          "click": this.openPopup
        },
        "ref": "inputWrapper"
      }, [input, this.showClearIcon ? h("i", {
        "class": "".concat(prefixClass, "-icon-clear"),
        "on": {
          "click": this.handleClear
        }
      }, [this.renderSlot('icon-clear', h(__vue_component__$3))]) : h("i", {
        "class": "".concat(prefixClass, "-icon-calendar")
      }, [this.renderSlot('icon-calendar', calendarIcon)])]);
    },
    renderContent: function renderContent() {
      var h = this.$createElement;
      var map = this.range ? componentRangeMap : componentMap;
      var Component = map[this.type] || map.default;

      var props = _objectSpread2({}, pick(this.$props, Object.keys(Component.props)), {
        value: this.currentValue
      });

      var on = _objectSpread2({}, pick(this.$listeners, Component.emits || []), {
        select: this.handleSelectDate
      });

      var content = h(Component, helper([{}, {
        props: props,
        on: on,
        ref: 'picker'
      }]));
      return h("div", {
        "class": "".concat(this.prefixClass, "-datepicker-body")
      }, [this.renderSlot('content', content, {
        value: this.currentValue,
        emit: this.handleSelectDate
      })]);
    },
    renderSidebar: function renderSidebar() {
      var _this4 = this;

      var h = this.$createElement;
      var prefixClass = this.prefixClass;
      return h("div", {
        "class": "".concat(prefixClass, "-datepicker-sidebar")
      }, [this.renderSlot('sidebar', null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      }), this.shortcuts.map(function (v, i) {
        return h("button", {
          "key": i,
          "attrs": {
            "data-index": i,
            "type": "button"
          },
          "class": "".concat(prefixClass, "-btn ").concat(prefixClass, "-btn-text ").concat(prefixClass, "-btn-shortcut"),
          "on": {
            "click": _this4.handleSelectShortcut
          }
        }, [v.text]);
      })]);
    },
    renderHeader: function renderHeader() {
      var h = this.$createElement;
      return h("div", {
        "class": "".concat(this.prefixClass, "-datepicker-header")
      }, [this.renderSlot('header', null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      })]);
    },
    renderFooter: function renderFooter() {
      var h = this.$createElement;
      var prefixClass = this.prefixClass;
      return h("div", {
        "class": "".concat(prefixClass, "-datepicker-footer")
      }, [this.renderSlot('footer', null, {
        value: this.currentValue,
        emit: this.handleSelectDate
      }), this.confirm ? h("button", {
        "attrs": {
          "type": "button"
        },
        "class": "".concat(prefixClass, "-btn ").concat(prefixClass, "-datepicker-btn-confirm"),
        "on": {
          "click": this.handleConfirmDate
        }
      }, [this.confirmText]) : null]);
    }
  },
  render: function render() {
    var _class;

    var h = arguments[0];
    var prefixClass = this.prefixClass,
        inline = this.inline,
        disabled = this.disabled;
    var sidedar = this.hasSlot('sidebar') || this.shortcuts.length ? this.renderSidebar() : null;
    var content = h("div", {
      "class": "".concat(prefixClass, "-datepicker-content")
    }, [this.hasSlot('header') ? this.renderHeader() : null, this.renderContent(), this.hasSlot('footer') || this.confirm ? this.renderFooter() : null]);
    return h("div", {
      "class": (_class = {}, _defineProperty(_class, "".concat(prefixClass, "-datepicker"), true), _defineProperty(_class, "".concat(prefixClass, "-datepicker-range"), this.range), _defineProperty(_class, "".concat(prefixClass, "-datepicker-inline"), inline), _defineProperty(_class, "disabled", disabled), _class)
    }, [!inline ? this.renderInput() : null, !inline ? h(__vue_component__, {
      "ref": "popup",
      "class": this.popupClass,
      "style": this.popupStyle,
      "attrs": {
        "visible": this.popupVisible,
        "appendToBody": this.appendToBody
      },
      "on": {
        "clickoutside": this.handleClickOutSide
      }
    }, [sidedar, content]) : h("div", {
      "class": "".concat(prefixClass, "-datepicker-main")
    }, [sidedar, content])]);
  }
};

DatePicker.locale = locale;

DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  DatePicker.install(window.Vue);
}

_extends(DatePicker, {
  CalendarPanel: CalendarPanel,
  CalendarRange: CalendarRange,
  TimePanel: __vue_component__$b,
  TimeRange: TimeRange,
  DatetimePanel: DatetimePanel,
  DatetimeRange: DatetimeRange
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DatePicker);


/***/ }),

/***/ "./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js":
/*!********************************************************************!*\
  !*** ./node_modules/vuejs-datepicker/dist/vuejs-datepicker.esm.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var Language =
/*#__PURE__*/
function () {
  function Language(language, months, monthsAbbr, days) {
    _classCallCheck(this, Language);

    this.language = language;
    this.months = months;
    this.monthsAbbr = monthsAbbr;
    this.days = days;
    this.rtl = false;
    this.ymd = false;
    this.yearSuffix = '';
  }

  _createClass(Language, [{
    key: "language",
    get: function get() {
      return this._language;
    },
    set: function set(language) {
      if (typeof language !== 'string') {
        throw new TypeError('Language must be a string');
      }

      this._language = language;
    }
  }, {
    key: "months",
    get: function get() {
      return this._months;
    },
    set: function set(months) {
      if (months.length !== 12) {
        throw new RangeError("There must be 12 months for ".concat(this.language, " language"));
      }

      this._months = months;
    }
  }, {
    key: "monthsAbbr",
    get: function get() {
      return this._monthsAbbr;
    },
    set: function set(monthsAbbr) {
      if (monthsAbbr.length !== 12) {
        throw new RangeError("There must be 12 abbreviated months for ".concat(this.language, " language"));
      }

      this._monthsAbbr = monthsAbbr;
    }
  }, {
    key: "days",
    get: function get() {
      return this._days;
    },
    set: function set(days) {
      if (days.length !== 7) {
        throw new RangeError("There must be 7 days for ".concat(this.language, " language"));
      }

      this._days = days;
    }
  }]);

  return Language;
}(); // eslint-disable-next-line

var en = new Language('English', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) // eslint-disable-next-line
;

var utils = {
  /**
   * @type {Boolean}
   */
  useUtc: false,

  /**
   * Returns the full year, using UTC or not
   * @param {Date} date
   */
  getFullYear: function getFullYear(date) {
    return this.useUtc ? date.getUTCFullYear() : date.getFullYear();
  },

  /**
   * Returns the month, using UTC or not
   * @param {Date} date
   */
  getMonth: function getMonth(date) {
    return this.useUtc ? date.getUTCMonth() : date.getMonth();
  },

  /**
   * Returns the date, using UTC or not
   * @param {Date} date
   */
  getDate: function getDate(date) {
    return this.useUtc ? date.getUTCDate() : date.getDate();
  },

  /**
   * Returns the day, using UTC or not
   * @param {Date} date
   */
  getDay: function getDay(date) {
    return this.useUtc ? date.getUTCDay() : date.getDay();
  },

  /**
   * Returns the hours, using UTC or not
   * @param {Date} date
   */
  getHours: function getHours(date) {
    return this.useUtc ? date.getUTCHours() : date.getHours();
  },

  /**
   * Returns the minutes, using UTC or not
   * @param {Date} date
   */
  getMinutes: function getMinutes(date) {
    return this.useUtc ? date.getUTCMinutes() : date.getMinutes();
  },

  /**
   * Sets the full year, using UTC or not
   * @param {Date} date
   */
  setFullYear: function setFullYear(date, value, useUtc) {
    return this.useUtc ? date.setUTCFullYear(value) : date.setFullYear(value);
  },

  /**
   * Sets the month, using UTC or not
   * @param {Date} date
   */
  setMonth: function setMonth(date, value, useUtc) {
    return this.useUtc ? date.setUTCMonth(value) : date.setMonth(value);
  },

  /**
   * Sets the date, using UTC or not
   * @param {Date} date
   * @param {Number} value
   */
  setDate: function setDate(date, value, useUtc) {
    return this.useUtc ? date.setUTCDate(value) : date.setDate(value);
  },

  /**
   * Check if date1 is equivalent to date2, without comparing the time
   * @see https://stackoverflow.com/a/6202196/4455925
   * @param {Date} date1
   * @param {Date} date2
   */
  compareDates: function compareDates(date1, date2) {
    var d1 = new Date(date1.getTime());
    var d2 = new Date(date2.getTime());

    if (this.useUtc) {
      d1.setUTCHours(0, 0, 0, 0);
      d2.setUTCHours(0, 0, 0, 0);
    } else {
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
    }

    return d1.getTime() === d2.getTime();
  },

  /**
   * Validates a date object
   * @param {Date} date - an object instantiated with the new Date constructor
   * @return {Boolean}
   */
  isValidDate: function isValidDate(date) {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      return false;
    }

    return !isNaN(date.getTime());
  },

  /**
   * Return abbreviated week day name
   * @param {Date}
   * @param {Array}
   * @return {String}
   */
  getDayNameAbbr: function getDayNameAbbr(date, days) {
    if (_typeof(date) !== 'object') {
      throw TypeError('Invalid Type');
    }

    return days[this.getDay(date)];
  },

  /**
   * Return name of the month
   * @param {Number|Date}
   * @param {Array}
   * @return {String}
   */
  getMonthName: function getMonthName(month, months) {
    if (!months) {
      throw Error('missing 2nd parameter Months array');
    }

    if (_typeof(month) === 'object') {
      return months[this.getMonth(month)];
    }

    if (typeof month === 'number') {
      return months[month];
    }

    throw TypeError('Invalid type');
  },

  /**
   * Return an abbreviated version of the month
   * @param {Number|Date}
   * @return {String}
   */
  getMonthNameAbbr: function getMonthNameAbbr(month, monthsAbbr) {
    if (!monthsAbbr) {
      throw Error('missing 2nd paramter Months array');
    }

    if (_typeof(month) === 'object') {
      return monthsAbbr[this.getMonth(month)];
    }

    if (typeof month === 'number') {
      return monthsAbbr[month];
    }

    throw TypeError('Invalid type');
  },

  /**
   * Alternative get total number of days in month
   * @param {Number} year
   * @param {Number} m
   * @return {Number}
   */
  daysInMonth: function daysInMonth(year, month) {
    return /8|3|5|10/.test(month) ? 30 : month === 1 ? !(year % 4) && year % 100 || !(year % 400) ? 29 : 28 : 31;
  },

  /**
   * Get nth suffix for date
   * @param {Number} day
   * @return {String}
   */
  getNthSuffix: function getNthSuffix(day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st';

      case 2:
      case 22:
        return 'nd';

      case 3:
      case 23:
        return 'rd';

      default:
        return 'th';
    }
  },

  /**
   * Formats date object
   * @param {Date}
   * @param {String}
   * @param {Object}
   * @return {String}
   */
  formatDate: function formatDate(date, format, translation) {
    translation = !translation ? en : translation;
    var year = this.getFullYear(date);
    var month = this.getMonth(date) + 1;
    var day = this.getDate(date);
    var str = format.replace(/dd/, ('0' + day).slice(-2)).replace(/d/, day).replace(/yyyy/, year).replace(/yy/, String(year).slice(2)).replace(/MMMM/, this.getMonthName(this.getMonth(date), translation.months)).replace(/MMM/, this.getMonthNameAbbr(this.getMonth(date), translation.monthsAbbr)).replace(/MM/, ('0' + month).slice(-2)).replace(/M(?!a|ä|e)/, month).replace(/su/, this.getNthSuffix(this.getDate(date))).replace(/D(?!e|é|i)/, this.getDayNameAbbr(date, translation.days));
    return str;
  },

  /**
   * Creates an array of dates for each day in between two dates.
   * @param {Date} start
   * @param {Date} end
   * @return {Array}
   */
  createDateArray: function createDateArray(start, end) {
    var dates = [];

    while (start <= end) {
      dates.push(new Date(start));
      start = this.setDate(new Date(start), this.getDate(new Date(start)) + 1);
    }

    return dates;
  },

  /**
   * method used as a prop validator for input values
   * @param {*} val
   * @return {Boolean}
   */
  validateDateInput: function validateDateInput(val) {
    return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number';
  }
};
var makeDateUtils = function makeDateUtils(useUtc) {
  return _objectSpread({}, utils, {
    useUtc: useUtc
  });
};
var utils$1 = _objectSpread({}, utils) // eslint-disable-next-line
;

var script = {
  props: {
    selectedDate: Date,
    resetTypedDate: [Date],
    format: [String, Function],
    translation: Object,
    inline: Boolean,
    id: String,
    name: String,
    refName: String,
    openDate: Date,
    placeholder: String,
    inputClass: [String, Object, Array],
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    disabled: Boolean,
    required: Boolean,
    typeable: Boolean,
    bootstrapStyling: Boolean,
    useUtc: Boolean
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      input: null,
      typedDate: false,
      utils: constructedDateUtils
    };
  },
  computed: {
    formattedValue: function formattedValue() {
      if (!this.selectedDate) {
        return null;
      }

      if (this.typedDate) {
        return this.typedDate;
      }

      return typeof this.format === 'function' ? this.format(this.selectedDate) : this.utils.formatDate(new Date(this.selectedDate), this.format, this.translation);
    },
    computedInputClass: function computedInputClass() {
      if (this.bootstrapStyling) {
        if (typeof this.inputClass === 'string') {
          return [this.inputClass, 'form-control'].join(' ');
        }

        return _objectSpread({
          'form-control': true
        }, this.inputClass);
      }

      return this.inputClass;
    }
  },
  watch: {
    resetTypedDate: function resetTypedDate() {
      this.typedDate = false;
    }
  },
  methods: {
    showCalendar: function showCalendar() {
      this.$emit('showCalendar');
    },

    /**
     * Attempt to parse a typed date
     * @param {Event} event
     */
    parseTypedDate: function parseTypedDate(event) {
      // close calendar if escape or enter are pressed
      if ([27, // escape
      13 // enter
      ].includes(event.keyCode)) {
        this.input.blur();
      }

      if (this.typeable) {
        var typedDate = Date.parse(this.input.value);

        if (!isNaN(typedDate)) {
          this.typedDate = this.input.value;
          this.$emit('typedDate', new Date(this.typedDate));
        }
      }
    },

    /**
     * nullify the typed date to defer to regular formatting
     * called once the input is blurred
     */
    inputBlurred: function inputBlurred() {
      if (this.typeable && isNaN(Date.parse(this.input.value))) {
        this.clearDate();
        this.input.value = null;
        this.typedDate = null;
      }

      this.$emit('closeCalendar');
    },

    /**
     * emit a clearDate event
     */
    clearDate: function clearDate() {
      this.$emit('clearDate');
    }
  },
  mounted: function mounted() {
    this.input = this.$el.querySelector('input');
  }
} // eslint-disable-next-line
;

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { class: { "input-group": _vm.bootstrapStyling } },
    [
      _vm.calendarButton
        ? _c(
            "span",
            {
              staticClass: "vdp-datepicker__calendar-button",
              class: { "input-group-prepend": _vm.bootstrapStyling },
              style: { "cursor:not-allowed;": _vm.disabled },
              on: { click: _vm.showCalendar }
            },
            [
              _c(
                "span",
                { class: { "input-group-text": _vm.bootstrapStyling } },
                [
                  _c("i", { class: _vm.calendarButtonIcon }, [
                    _vm._v(
                      "\n        " +
                        _vm._s(_vm.calendarButtonIconContent) +
                        "\n        "
                    ),
                    !_vm.calendarButtonIcon
                      ? _c("span", [_vm._v("…")])
                      : _vm._e()
                  ])
                ]
              )
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _c("input", {
        ref: _vm.refName,
        class: _vm.computedInputClass,
        attrs: {
          type: _vm.inline ? "hidden" : "text",
          name: _vm.name,
          id: _vm.id,
          "open-date": _vm.openDate,
          placeholder: _vm.placeholder,
          "clear-button": _vm.clearButton,
          disabled: _vm.disabled,
          required: _vm.required,
          readonly: !_vm.typeable,
          autocomplete: "off"
        },
        domProps: { value: _vm.formattedValue },
        on: {
          click: _vm.showCalendar,
          keyup: _vm.parseTypedDate,
          blur: _vm.inputBlurred
        }
      }),
      _vm._v(" "),
      _vm.clearButton && _vm.selectedDate
        ? _c(
            "span",
            {
              staticClass: "vdp-datepicker__clear-button",
              class: { "input-group-append": _vm.bootstrapStyling },
              on: {
                click: function($event) {
                  return _vm.clearDate()
                }
              }
            },
            [
              _c(
                "span",
                { class: { "input-group-text": _vm.bootstrapStyling } },
                [
                  _c("i", { class: _vm.clearButtonIcon }, [
                    !_vm.clearButtonIcon ? _c("span", [_vm._v("×")]) : _vm._e()
                  ])
                ]
              )
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm._t("afterDateInput")
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var DateInput = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//
var script$1 = {
  props: {
    showDayView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    fullMonthName: Boolean,
    allowedToShowView: Function,
    dayCellContent: {
      type: Function,
      "default": function _default(day) {
        return day.date;
      }
    },
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    mondayFirst: Boolean,
    useUtc: Boolean
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils
    };
  },
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek: function daysOfWeek() {
      if (this.mondayFirst) {
        var tempDays = this.translation.days.slice();
        tempDays.push(tempDays.shift());
        return tempDays;
      }

      return this.translation.days;
    },

    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */
    blankDays: function blankDays() {
      var d = this.pageDate;
      var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());

      if (this.mondayFirst) {
        return this.utils.getDay(dObj) > 0 ? this.utils.getDay(dObj) - 1 : 6;
      }

      return this.utils.getDay(dObj);
    },

    /**
     * @return {Object[]}
     */
    days: function days() {
      var d = this.pageDate;
      var days = []; // set up a new date object to the beginning of the current 'page'

      var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      var daysInMonth = this.utils.daysInMonth(this.utils.getFullYear(dObj), this.utils.getMonth(dObj));

      for (var i = 0; i < daysInMonth; i++) {
        days.push({
          date: this.utils.getDate(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: this.utils.compareDates(dObj, new Date()),
          isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
          isSaturday: this.utils.getDay(dObj) === 6,
          isSunday: this.utils.getDay(dObj) === 0
        });
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
      }

      return days;
    },

    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName: function currMonthName() {
      var monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
      return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName);
    },

    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName: function currYearName() {
      var yearSuffix = this.translation.yearSuffix;
      return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
    },

    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd: function isYmd() {
      return this.translation.ymd && this.translation.ymd === true;
    },

    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled: function isLeftNavDisabled() {
      return this.isRtl ? this.isNextMonthDisabled(this.pageTimestamp) : this.isPreviousMonthDisabled(this.pageTimestamp);
    },

    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled: function isRightNavDisabled() {
      return this.isRtl ? this.isPreviousMonthDisabled(this.pageTimestamp) : this.isNextMonthDisabled(this.pageTimestamp);
    }
  },
  methods: {
    selectDate: function selectDate(date) {
      if (date.isDisabled) {
        this.$emit('selectedDisabled', date);
        return false;
      }

      this.$emit('selectDate', date);
    },

    /**
     * @return {Number}
     */
    getPageMonth: function getPageMonth() {
      return this.utils.getMonth(this.pageDate);
    },

    /**
     * Emit an event to show the month picker
     */
    showMonthCalendar: function showMonthCalendar() {
      this.$emit('showMonthCalendar');
    },

    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    changeMonth: function changeMonth(incrementBy) {
      var date = this.pageDate;
      this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy);
      this.$emit('changedMonth', date);
    },

    /**
     * Decrement the page month
     */
    previousMonth: function previousMonth() {
      if (!this.isPreviousMonthDisabled()) {
        this.changeMonth(-1);
      }
    },

    /**
     * Is the previous month disabled?
     * @return {Boolean}
     */
    isPreviousMonthDisabled: function isPreviousMonthDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }

      var d = this.pageDate;
      return this.utils.getMonth(this.disabledDates.to) >= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(d);
    },

    /**
     * Increment the current page month
     */
    nextMonth: function nextMonth() {
      if (!this.isNextMonthDisabled()) {
        this.changeMonth(+1);
      }
    },

    /**
     * Is the next month disabled?
     * @return {Boolean}
     */
    isNextMonthDisabled: function isNextMonthDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }

      var d = this.pageDate;
      return this.utils.getMonth(this.disabledDates.from) <= this.utils.getMonth(d) && this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(d);
    },

    /**
     * Whether a day is selected
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedDate: function isSelectedDate(dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj);
    },

    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate: function isDisabledDate(date) {
      var _this = this;

      var disabledDates = false;

      if (typeof this.disabledDates === 'undefined') {
        return false;
      }

      if (typeof this.disabledDates.dates !== 'undefined') {
        this.disabledDates.dates.forEach(function (d) {
          if (_this.utils.compareDates(date, d)) {
            disabledDates = true;
            return true;
          }
        });
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to && date < this.disabledDates.to) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from && date > this.disabledDates.from) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.ranges !== 'undefined') {
        this.disabledDates.ranges.forEach(function (range) {
          if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
            if (date < range.to && date > range.from) {
              disabledDates = true;
              return true;
            }
          }
        });
      }

      if (typeof this.disabledDates.days !== 'undefined' && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.daysOfMonth !== 'undefined' && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        disabledDates = true;
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }

      return disabledDates;
    },

    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate: function isHighlightedDate(date) {
      var _this2 = this;

      if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
        return false;
      }

      var highlighted = false;

      if (typeof this.highlighted === 'undefined') {
        return false;
      }

      if (typeof this.highlighted.dates !== 'undefined') {
        this.highlighted.dates.forEach(function (d) {
          if (_this2.utils.compareDates(date, d)) {
            highlighted = true;
            return true;
          }
        });
      }

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        highlighted = date >= this.highlighted.from && date <= this.highlighted.to;
      }

      if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.daysOfMonth !== 'undefined' && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.customPredictor === 'function' && this.highlighted.customPredictor(date)) {
        highlighted = true;
      }

      return highlighted;
    },
    dayClasses: function dayClasses(day) {
      return {
        'selected': day.isSelected,
        'disabled': day.isDisabled,
        'highlighted': day.isHighlighted,
        'today': day.isToday,
        'weekend': day.isWeekend,
        'sat': day.isSaturday,
        'sun': day.isSunday,
        'highlight-start': day.isHighlightStart,
        'highlight-end': day.isHighlightEnd
      };
    },

    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart: function isHighlightStart(date) {
      return this.isHighlightedDate(date) && this.highlighted.from instanceof Date && this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.from) === this.utils.getDate(date);
    },

    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd: function isHighlightEnd(date) {
      return this.isHighlightedDate(date) && this.highlighted.to instanceof Date && this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date) && this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date) && this.utils.getDate(this.highlighted.to) === this.utils.getDate(date);
    },

    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined: function isDefined(prop) {
      return typeof prop !== 'undefined' && prop;
    }
  } // eslint-disable-next-line

};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showDayView,
          expression: "showDayView"
        }
      ],
      class: [_vm.calendarClass, "vdp-datepicker__calendar"],
      style: _vm.calendarStyle,
      on: {
        mousedown: function($event) {
          $event.preventDefault();
        }
      }
    },
    [
      _vm._t("beforeCalendarHeader"),
      _vm._v(" "),
      _c("header", [
        _c(
          "span",
          {
            staticClass: "prev",
            class: { disabled: _vm.isLeftNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.nextMonth() : _vm.previousMonth();
              }
            }
          },
          [_vm._v("<")]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "day__month_btn",
            class: _vm.allowedToShowView("month") ? "up" : "",
            on: { click: _vm.showMonthCalendar }
          },
          [
            _vm._v(
              _vm._s(_vm.isYmd ? _vm.currYearName : _vm.currMonthName) +
                " " +
                _vm._s(_vm.isYmd ? _vm.currMonthName : _vm.currYearName)
            )
          ]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "next",
            class: { disabled: _vm.isRightNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.previousMonth() : _vm.nextMonth();
              }
            }
          },
          [_vm._v(">")]
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { class: _vm.isRtl ? "flex-rtl" : "" },
        [
          _vm._l(_vm.daysOfWeek, function(d) {
            return _c(
              "span",
              { key: d.timestamp, staticClass: "cell day-header" },
              [_vm._v(_vm._s(d))]
            )
          }),
          _vm._v(" "),
          _vm.blankDays > 0
            ? _vm._l(_vm.blankDays, function(d) {
                return _c("span", {
                  key: d.timestamp,
                  staticClass: "cell day blank"
                })
              })
            : _vm._e(),
          _vm._l(_vm.days, function(day) {
            return _c("span", {
              key: day.timestamp,
              staticClass: "cell day",
              class: _vm.dayClasses(day),
              domProps: { innerHTML: _vm._s(_vm.dayCellContent(day)) },
              on: {
                click: function($event) {
                  return _vm.selectDate(day)
                }
              }
            })
          })
        ],
        2
      )
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PickerDay = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

//
var script$2 = {
  props: {
    showMonthView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils
    };
  },
  computed: {
    months: function months() {
      var d = this.pageDate;
      var months = []; // set up a new date object to the beginning of the current 'page'

      var dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), 0, d.getUTCDate())) : new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes());

      for (var i = 0; i < 12; i++) {
        months.push({
          month: this.utils.getMonthName(i, this.translation.months),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedMonth(dObj),
          isDisabled: this.isDisabledMonth(dObj)
        });
        this.utils.setMonth(dObj, this.utils.getMonth(dObj) + 1);
      }

      return months;
    },

    /**
     * Get year name on current page.
     * @return {String}
     */
    pageYearName: function pageYearName() {
      var yearSuffix = this.translation.yearSuffix;
      return "".concat(this.utils.getFullYear(this.pageDate)).concat(yearSuffix);
    },

    /**
     * Is the left hand navigation disabled
     * @return {Boolean}
     */
    isLeftNavDisabled: function isLeftNavDisabled() {
      return this.isRtl ? this.isNextYearDisabled(this.pageTimestamp) : this.isPreviousYearDisabled(this.pageTimestamp);
    },

    /**
     * Is the right hand navigation disabled
     * @return {Boolean}
     */
    isRightNavDisabled: function isRightNavDisabled() {
      return this.isRtl ? this.isPreviousYearDisabled(this.pageTimestamp) : this.isNextYearDisabled(this.pageTimestamp);
    }
  },
  methods: {
    /**
     * Emits a selectMonth event
     * @param {Object} month
     */
    selectMonth: function selectMonth(month) {
      if (month.isDisabled) {
        return false;
      }

      this.$emit('selectMonth', month);
    },

    /**
     * Changes the year up or down
     * @param {Number} incrementBy
     */
    changeYear: function changeYear(incrementBy) {
      var date = this.pageDate;
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
      this.$emit('changedYear', date);
    },

    /**
     * Decrements the year
     */
    previousYear: function previousYear() {
      if (!this.isPreviousYearDisabled()) {
        this.changeYear(-1);
      }
    },

    /**
     * Checks if the previous year is disabled or not
     * @return {Boolean}
     */
    isPreviousYearDisabled: function isPreviousYearDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }

      return this.utils.getFullYear(this.disabledDates.to) >= this.utils.getFullYear(this.pageDate);
    },

    /**
     * Increments the year
     */
    nextYear: function nextYear() {
      if (!this.isNextYearDisabled()) {
        this.changeYear(1);
      }
    },

    /**
     * Checks if the next year is disabled or not
     * @return {Boolean}
     */
    isNextYearDisabled: function isNextYearDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }

      return this.utils.getFullYear(this.disabledDates.from) <= this.utils.getFullYear(this.pageDate);
    },

    /**
     * Emits an event that shows the year calendar
     */
    showYearCalendar: function showYearCalendar() {
      this.$emit('showYearCalendar');
    },

    /**
     * Whether the selected date is in this month
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedMonth: function isSelectedMonth(date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date) && this.utils.getMonth(this.selectedDate) === this.utils.getMonth(date);
    },

    /**
     * Whether a month is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledMonth: function isDisabledMonth(date) {
      var disabledDates = false;

      if (typeof this.disabledDates === 'undefined') {
        return false;
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (this.utils.getMonth(date) < this.utils.getMonth(this.disabledDates.to) && this.utils.getFullYear(date) <= this.utils.getFullYear(this.disabledDates.to) || this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (this.utils.getMonth(date) > this.utils.getMonth(this.disabledDates.from) && this.utils.getFullYear(date) >= this.utils.getFullYear(this.disabledDates.from) || this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }

      return disabledDates;
    }
  } // eslint-disable-next-line

};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showMonthView,
          expression: "showMonthView"
        }
      ],
      class: [_vm.calendarClass, "vdp-datepicker__calendar"],
      style: _vm.calendarStyle,
      on: {
        mousedown: function($event) {
          $event.preventDefault();
        }
      }
    },
    [
      _vm._t("beforeCalendarHeader"),
      _vm._v(" "),
      _c("header", [
        _c(
          "span",
          {
            staticClass: "prev",
            class: { disabled: _vm.isLeftNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.nextYear() : _vm.previousYear();
              }
            }
          },
          [_vm._v("<")]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "month__year_btn",
            class: _vm.allowedToShowView("year") ? "up" : "",
            on: { click: _vm.showYearCalendar }
          },
          [_vm._v(_vm._s(_vm.pageYearName))]
        ),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "next",
            class: { disabled: _vm.isRightNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.previousYear() : _vm.nextYear();
              }
            }
          },
          [_vm._v(">")]
        )
      ]),
      _vm._v(" "),
      _vm._l(_vm.months, function(month) {
        return _c(
          "span",
          {
            key: month.timestamp,
            staticClass: "cell month",
            class: { selected: month.isSelected, disabled: month.isDisabled },
            on: {
              click: function($event) {
                $event.stopPropagation();
                return _vm.selectMonth(month)
              }
            }
          },
          [_vm._v(_vm._s(month.month))]
        )
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PickerMonth = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//
var script$3 = {
  props: {
    showYearView: Boolean,
    selectedDate: Date,
    pageDate: Date,
    pageTimestamp: Number,
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    allowedToShowView: Function,
    useUtc: Boolean
  },
  computed: {
    years: function years() {
      var d = this.pageDate;
      var years = []; // set up a new date object to the beginning of the current 'page'7

      var dObj = this.useUtc ? new Date(Date.UTC(Math.floor(d.getUTCFullYear() / 10) * 10, d.getUTCMonth(), d.getUTCDate())) : new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());

      for (var i = 0; i < 10; i++) {
        years.push({
          year: this.utils.getFullYear(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedYear(dObj),
          isDisabled: this.isDisabledYear(dObj)
        });
        this.utils.setFullYear(dObj, this.utils.getFullYear(dObj) + 1);
      }

      return years;
    },

    /**
     * @return {String}
     */
    getPageDecade: function getPageDecade() {
      var decadeStart = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10;
      var decadeEnd = decadeStart + 9;
      var yearSuffix = this.translation.yearSuffix;
      return "".concat(decadeStart, " - ").concat(decadeEnd).concat(yearSuffix);
    },

    /**
     * Is the left hand navigation button disabled?
     * @return {Boolean}
     */
    isLeftNavDisabled: function isLeftNavDisabled() {
      return this.isRtl ? this.isNextDecadeDisabled(this.pageTimestamp) : this.isPreviousDecadeDisabled(this.pageTimestamp);
    },

    /**
     * Is the right hand navigation button disabled?
     * @return {Boolean}
     */
    isRightNavDisabled: function isRightNavDisabled() {
      return this.isRtl ? this.isPreviousDecadeDisabled(this.pageTimestamp) : this.isNextDecadeDisabled(this.pageTimestamp);
    }
  },
  data: function data() {
    var constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils
    };
  },
  methods: {
    selectYear: function selectYear(year) {
      if (year.isDisabled) {
        return false;
      }

      this.$emit('selectYear', year);
    },
    changeYear: function changeYear(incrementBy) {
      var date = this.pageDate;
      this.utils.setFullYear(date, this.utils.getFullYear(date) + incrementBy);
      this.$emit('changedDecade', date);
    },
    previousDecade: function previousDecade() {
      if (this.isPreviousDecadeDisabled()) {
        return false;
      }

      this.changeYear(-10);
    },
    isPreviousDecadeDisabled: function isPreviousDecadeDisabled() {
      if (!this.disabledDates || !this.disabledDates.to) {
        return false;
      }

      var disabledYear = this.utils.getFullYear(this.disabledDates.to);
      var lastYearInPreviousPage = Math.floor(this.utils.getFullYear(this.pageDate) / 10) * 10 - 1;
      return disabledYear > lastYearInPreviousPage;
    },
    nextDecade: function nextDecade() {
      if (this.isNextDecadeDisabled()) {
        return false;
      }

      this.changeYear(10);
    },
    isNextDecadeDisabled: function isNextDecadeDisabled() {
      if (!this.disabledDates || !this.disabledDates.from) {
        return false;
      }

      var disabledYear = this.utils.getFullYear(this.disabledDates.from);
      var firstYearInNextPage = Math.ceil(this.utils.getFullYear(this.pageDate) / 10) * 10;
      return disabledYear < firstYearInNextPage;
    },

    /**
     * Whether the selected date is in this year
     * @param {Date}
     * @return {Boolean}
     */
    isSelectedYear: function isSelectedYear(date) {
      return this.selectedDate && this.utils.getFullYear(this.selectedDate) === this.utils.getFullYear(date);
    },

    /**
     * Whether a year is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledYear: function isDisabledYear(date) {
      var disabledDates = false;

      if (typeof this.disabledDates === 'undefined' || !this.disabledDates) {
        return false;
      }

      if (typeof this.disabledDates.to !== 'undefined' && this.disabledDates.to) {
        if (this.utils.getFullYear(date) < this.utils.getFullYear(this.disabledDates.to)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.from !== 'undefined' && this.disabledDates.from) {
        if (this.utils.getFullYear(date) > this.utils.getFullYear(this.disabledDates.from)) {
          disabledDates = true;
        }
      }

      if (typeof this.disabledDates.customPredictor === 'function' && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }

      return disabledDates;
    }
  } // eslint-disable-next-line

};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.showYearView,
          expression: "showYearView"
        }
      ],
      class: [_vm.calendarClass, "vdp-datepicker__calendar"],
      style: _vm.calendarStyle,
      on: {
        mousedown: function($event) {
          $event.preventDefault();
        }
      }
    },
    [
      _vm._t("beforeCalendarHeader"),
      _vm._v(" "),
      _c("header", [
        _c(
          "span",
          {
            staticClass: "prev",
            class: { disabled: _vm.isLeftNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.nextDecade() : _vm.previousDecade();
              }
            }
          },
          [_vm._v("<")]
        ),
        _vm._v(" "),
        _c("span", [_vm._v(_vm._s(_vm.getPageDecade))]),
        _vm._v(" "),
        _c(
          "span",
          {
            staticClass: "next",
            class: { disabled: _vm.isRightNavDisabled },
            on: {
              click: function($event) {
                _vm.isRtl ? _vm.previousDecade() : _vm.nextDecade();
              }
            }
          },
          [_vm._v(">")]
        )
      ]),
      _vm._v(" "),
      _vm._l(_vm.years, function(year) {
        return _c(
          "span",
          {
            key: year.timestamp,
            staticClass: "cell year",
            class: { selected: year.isSelected, disabled: year.isDisabled },
            on: {
              click: function($event) {
                $event.stopPropagation();
                return _vm.selectYear(year)
              }
            }
          },
          [_vm._v(_vm._s(year.year))]
        )
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PickerYear = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

//
var script$4 = {
  components: {
    DateInput: DateInput,
    PickerDay: PickerDay,
    PickerMonth: PickerMonth,
    PickerYear: PickerYear
  },
  props: {
    value: {
      validator: function validator(val) {
        return utils$1.validateDateInput(val);
      }
    },
    name: String,
    refName: String,
    id: String,
    format: {
      type: [String, Function],
      "default": 'dd MMM yyyy'
    },
    language: {
      type: Object,
      "default": function _default() {
        return en;
      }
    },
    openDate: {
      validator: function validator(val) {
        return utils$1.validateDateInput(val);
      }
    },
    dayCellContent: Function,
    fullMonthName: Boolean,
    disabledDates: Object,
    highlighted: Object,
    placeholder: String,
    inline: Boolean,
    calendarClass: [String, Object, Array],
    inputClass: [String, Object, Array],
    wrapperClass: [String, Object, Array],
    mondayFirst: Boolean,
    clearButton: Boolean,
    clearButtonIcon: String,
    calendarButton: Boolean,
    calendarButtonIcon: String,
    calendarButtonIconContent: String,
    bootstrapStyling: Boolean,
    initialView: String,
    disabled: Boolean,
    required: Boolean,
    typeable: Boolean,
    useUtc: Boolean,
    minimumView: {
      type: String,
      "default": 'day'
    },
    maximumView: {
      type: String,
      "default": 'year'
    }
  },
  data: function data() {
    var startDate = this.openDate ? new Date(this.openDate) : new Date();
    var constructedDateUtils = makeDateUtils(this.useUtc);
    var pageTimestamp = constructedDateUtils.setDate(startDate, 1);
    return {
      /*
       * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
       * This represents the first day of the current viewing month
       * {Number}
       */
      pageTimestamp: pageTimestamp,

      /*
       * Selected Date
       * {Date}
       */
      selectedDate: null,

      /*
       * Flags to show calendar views
       * {Boolean}
       */
      showDayView: false,
      showMonthView: false,
      showYearView: false,

      /*
       * Positioning
       */
      calendarHeight: 0,
      resetTypedDate: new Date(),
      utils: constructedDateUtils
    };
  },
  watch: {
    value: function value(_value) {
      this.setValue(_value);
    },
    openDate: function openDate() {
      this.setPageDate();
    },
    initialView: function initialView() {
      this.setInitialView();
    }
  },
  computed: {
    computedInitialView: function computedInitialView() {
      if (!this.initialView) {
        return this.minimumView;
      }

      return this.initialView;
    },
    pageDate: function pageDate() {
      return new Date(this.pageTimestamp);
    },
    translation: function translation() {
      return this.language;
    },
    calendarStyle: function calendarStyle() {
      return {
        position: this.isInline ? 'static' : undefined
      };
    },
    isOpen: function isOpen() {
      return this.showDayView || this.showMonthView || this.showYearView;
    },
    isInline: function isInline() {
      return !!this.inline;
    },
    isRtl: function isRtl() {
      return this.translation.rtl === true;
    }
  },
  methods: {
    /**
     * Called in the event that the user navigates to date pages and
     * closes the picker without selecting a date.
     */
    resetDefaultPageDate: function resetDefaultPageDate() {
      if (this.selectedDate === null) {
        this.setPageDate();
        return;
      }

      this.setPageDate(this.selectedDate);
    },

    /**
     * Effectively a toggle to show/hide the calendar
     * @return {mixed}
     */
    showCalendar: function showCalendar() {
      if (this.disabled || this.isInline) {
        return false;
      }

      if (this.isOpen) {
        return this.close(true);
      }

      this.setInitialView();
    },

    /**
     * Sets the initial picker page view: day, month or year
     */
    setInitialView: function setInitialView() {
      var initialView = this.computedInitialView;

      if (!this.allowedToShowView(initialView)) {
        throw new Error("initialView '".concat(this.initialView, "' cannot be rendered based on minimum '").concat(this.minimumView, "' and maximum '").concat(this.maximumView, "'"));
      }

      switch (initialView) {
        case 'year':
          this.showYearCalendar();
          break;

        case 'month':
          this.showMonthCalendar();
          break;

        default:
          this.showDayCalendar();
          break;
      }
    },

    /**
     * Are we allowed to show a specific picker view?
     * @param {String} view
     * @return {Boolean}
     */
    allowedToShowView: function allowedToShowView(view) {
      var views = ['day', 'month', 'year'];
      var minimumViewIndex = views.indexOf(this.minimumView);
      var maximumViewIndex = views.indexOf(this.maximumView);
      var viewIndex = views.indexOf(view);
      return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex;
    },

    /**
     * Show the day picker
     * @return {Boolean}
     */
    showDayCalendar: function showDayCalendar() {
      if (!this.allowedToShowView('day')) {
        return false;
      }

      this.close();
      this.showDayView = true;
      return true;
    },

    /**
     * Show the month picker
     * @return {Boolean}
     */
    showMonthCalendar: function showMonthCalendar() {
      if (!this.allowedToShowView('month')) {
        return false;
      }

      this.close();
      this.showMonthView = true;
      return true;
    },

    /**
     * Show the year picker
     * @return {Boolean}
     */
    showYearCalendar: function showYearCalendar() {
      if (!this.allowedToShowView('year')) {
        return false;
      }

      this.close();
      this.showYearView = true;
      return true;
    },

    /**
     * Set the selected date
     * @param {Number} timestamp
     */
    setDate: function setDate(timestamp) {
      var date = new Date(timestamp);
      this.selectedDate = date;
      this.setPageDate(date);
      this.$emit('selected', date);
      this.$emit('input', date);
    },

    /**
     * Clear the selected date
     */
    clearDate: function clearDate() {
      this.selectedDate = null;
      this.setPageDate();
      this.$emit('selected', null);
      this.$emit('input', null);
      this.$emit('cleared');
    },

    /**
     * @param {Object} date
     */
    selectDate: function selectDate(date) {
      this.setDate(date.timestamp);

      if (!this.isInline) {
        this.close(true);
      }

      this.resetTypedDate = new Date();
    },

    /**
     * @param {Object} date
     */
    selectDisabledDate: function selectDisabledDate(date) {
      this.$emit('selectedDisabled', date);
    },

    /**
     * @param {Object} month
     */
    selectMonth: function selectMonth(month) {
      var date = new Date(month.timestamp);

      if (this.allowedToShowView('day')) {
        this.setPageDate(date);
        this.$emit('changedMonth', month);
        this.showDayCalendar();
      } else {
        this.selectDate(month);
      }
    },

    /**
     * @param {Object} year
     */
    selectYear: function selectYear(year) {
      var date = new Date(year.timestamp);

      if (this.allowedToShowView('month')) {
        this.setPageDate(date);
        this.$emit('changedYear', year);
        this.showMonthCalendar();
      } else {
        this.selectDate(year);
      }
    },

    /**
     * Set the datepicker value
     * @param {Date|String|Number|null} date
     */
    setValue: function setValue(date) {
      if (typeof date === 'string' || typeof date === 'number') {
        var parsed = new Date(date);
        date = isNaN(parsed.valueOf()) ? null : parsed;
      }

      if (!date) {
        this.setPageDate();
        this.selectedDate = null;
        return;
      }

      this.selectedDate = date;
      this.setPageDate(date);
    },

    /**
     * Sets the date that the calendar should open on
     */
    setPageDate: function setPageDate(date) {
      if (!date) {
        if (this.openDate) {
          date = new Date(this.openDate);
        } else {
          date = new Date();
        }
      }

      this.pageTimestamp = this.utils.setDate(new Date(date), 1);
    },

    /**
     * Handles a month change from the day picker
     */
    handleChangedMonthFromDayPicker: function handleChangedMonthFromDayPicker(date) {
      this.setPageDate(date);
      this.$emit('changedMonth', date);
    },

    /**
     * Set the date from a typedDate event
     */
    setTypedDate: function setTypedDate(date) {
      this.setDate(date.getTime());
    },

    /**
     * Close all calendar layers
     * @param {Boolean} emitEvent - emit close event
     */
    close: function close(emitEvent) {
      this.showDayView = this.showMonthView = this.showYearView = false;

      if (!this.isInline) {
        if (emitEvent) {
          this.$emit('closed');
        }

        document.removeEventListener('click', this.clickOutside, false);
      }
    },

    /**
     * Initiate the component
     */
    init: function init() {
      if (this.value) {
        this.setValue(this.value);
      }

      if (this.isInline) {
        this.setInitialView();
      }
    }
  },
  mounted: function mounted() {
    this.init();
  }
} // eslint-disable-next-line
;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "vdp-datepicker",
      class: [_vm.wrapperClass, _vm.isRtl ? "rtl" : ""]
    },
    [
      _c(
        "date-input",
        {
          attrs: {
            selectedDate: _vm.selectedDate,
            resetTypedDate: _vm.resetTypedDate,
            format: _vm.format,
            translation: _vm.translation,
            inline: _vm.inline,
            id: _vm.id,
            name: _vm.name,
            refName: _vm.refName,
            openDate: _vm.openDate,
            placeholder: _vm.placeholder,
            inputClass: _vm.inputClass,
            typeable: _vm.typeable,
            clearButton: _vm.clearButton,
            clearButtonIcon: _vm.clearButtonIcon,
            calendarButton: _vm.calendarButton,
            calendarButtonIcon: _vm.calendarButtonIcon,
            calendarButtonIconContent: _vm.calendarButtonIconContent,
            disabled: _vm.disabled,
            required: _vm.required,
            bootstrapStyling: _vm.bootstrapStyling,
            "use-utc": _vm.useUtc
          },
          on: {
            showCalendar: _vm.showCalendar,
            closeCalendar: _vm.close,
            typedDate: _vm.setTypedDate,
            clearDate: _vm.clearDate
          }
        },
        [_vm._t("afterDateInput", null, { slot: "afterDateInput" })],
        2
      ),
      _vm._v(" "),
      _vm.allowedToShowView("day")
        ? _c(
            "picker-day",
            {
              attrs: {
                pageDate: _vm.pageDate,
                selectedDate: _vm.selectedDate,
                showDayView: _vm.showDayView,
                fullMonthName: _vm.fullMonthName,
                allowedToShowView: _vm.allowedToShowView,
                disabledDates: _vm.disabledDates,
                highlighted: _vm.highlighted,
                calendarClass: _vm.calendarClass,
                calendarStyle: _vm.calendarStyle,
                translation: _vm.translation,
                pageTimestamp: _vm.pageTimestamp,
                isRtl: _vm.isRtl,
                mondayFirst: _vm.mondayFirst,
                dayCellContent: _vm.dayCellContent,
                "use-utc": _vm.useUtc
              },
              on: {
                changedMonth: _vm.handleChangedMonthFromDayPicker,
                selectDate: _vm.selectDate,
                showMonthCalendar: _vm.showMonthCalendar,
                selectedDisabled: _vm.selectDisabledDate
              }
            },
            [
              _vm._t("beforeCalendarHeader", null, {
                slot: "beforeCalendarHeader"
              })
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.allowedToShowView("month")
        ? _c(
            "picker-month",
            {
              attrs: {
                pageDate: _vm.pageDate,
                selectedDate: _vm.selectedDate,
                showMonthView: _vm.showMonthView,
                allowedToShowView: _vm.allowedToShowView,
                disabledDates: _vm.disabledDates,
                calendarClass: _vm.calendarClass,
                calendarStyle: _vm.calendarStyle,
                translation: _vm.translation,
                isRtl: _vm.isRtl,
                "use-utc": _vm.useUtc
              },
              on: {
                selectMonth: _vm.selectMonth,
                showYearCalendar: _vm.showYearCalendar,
                changedYear: _vm.setPageDate
              }
            },
            [
              _vm._t("beforeCalendarHeader", null, {
                slot: "beforeCalendarHeader"
              })
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.allowedToShowView("year")
        ? _c(
            "picker-year",
            {
              attrs: {
                pageDate: _vm.pageDate,
                selectedDate: _vm.selectedDate,
                showYearView: _vm.showYearView,
                allowedToShowView: _vm.allowedToShowView,
                disabledDates: _vm.disabledDates,
                calendarClass: _vm.calendarClass,
                calendarStyle: _vm.calendarStyle,
                translation: _vm.translation,
                isRtl: _vm.isRtl,
                "use-utc": _vm.useUtc
              },
              on: { selectYear: _vm.selectYear, changedDecade: _vm.setPageDate }
            },
            [
              _vm._t("beforeCalendarHeader", null, {
                slot: "beforeCalendarHeader"
              })
            ],
            2
          )
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-64ca2bb5_0", { source: ".rtl {\n  direction: rtl;\n}\n.vdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.vdp-datepicker * {\n  box-sizing: border-box;\n}\n.vdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  width: 300px;\n  border: 1px solid #ccc;\n}\n.vdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n}\n.vdp-datepicker__calendar header span {\n  display: inline-block;\n  text-align: center;\n  width: 71.42857142857143%;\n  float: left;\n}\n.vdp-datepicker__calendar header .prev,\n.vdp-datepicker__calendar header .next {\n  width: 14.285714285714286%;\n  float: left;\n  text-indent: -10000px;\n  position: relative;\n}\n.vdp-datepicker__calendar header .prev:after,\n.vdp-datepicker__calendar header .next:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  border: 6px solid transparent;\n}\n.vdp-datepicker__calendar header .prev:after {\n  border-right: 10px solid #000;\n  margin-left: -5px;\n}\n.vdp-datepicker__calendar header .prev.disabled:after {\n  border-right: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .next:after {\n  border-left: 10px solid #000;\n  margin-left: 5px;\n}\n.vdp-datepicker__calendar header .next.disabled:after {\n  border-left: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled),\n.vdp-datepicker__calendar header .next:not(.disabled),\n.vdp-datepicker__calendar header .up:not(.disabled) {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled):hover,\n.vdp-datepicker__calendar header .next:not(.disabled):hover,\n.vdp-datepicker__calendar header .up:not(.disabled):hover {\n  background: #eee;\n}\n.vdp-datepicker__calendar .disabled {\n  color: #ddd;\n  cursor: default;\n}\n.vdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.vdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.vdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.vdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.vdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.vdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .month,\n.vdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.vdp-datepicker__clear-button,\n.vdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.vdp-datepicker__clear-button.disabled,\n.vdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n", map: {"version":3,"sources":["Datepicker.vue"],"names":[],"mappings":"AAAA;EACE,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,kBAAkB;EAClB,YAAY;EACZ,gBAAgB;EAChB,YAAY;EACZ,sBAAsB;AACxB;AACA;EACE,cAAc;EACd,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,kBAAkB;EAClB,yBAAyB;EACzB,WAAW;AACb;AACA;;EAEE,0BAA0B;EAC1B,WAAW;EACX,qBAAqB;EACrB,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,4CAA4C;EAC5C,6BAA6B;AAC/B;AACA;EACE,6BAA6B;EAC7B,iBAAiB;AACnB;AACA;EACE,6BAA6B;AAC/B;AACA;EACE,4BAA4B;EAC5B,gBAAgB;AAClB;AACA;EACE,4BAA4B;AAC9B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,gBAAgB;AAClB;AACA;EACE,WAAW;EACX,eAAe;AACjB;AACA;EACE,aAAa;EACb,cAAc;EACd,eAAe;AACjB;AACA;EACE,qBAAqB;EACrB,cAAc;EACd,0BAA0B;EAC1B,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,sBAAsB;EACtB,6BAA6B;AAC/B;AACA;;;EAGE,eAAe;AACjB;AACA;;;EAGE,sBAAsB;AACxB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;AAChB;AACA;EACE,WAAW;AACb;AACA;EACE,mBAAmB;AACrB;AACA;EACE,cAAc;EACd,mBAAmB;EACnB,eAAe;AACjB;AACA;EACE,mBAAmB;AACrB;AACA;;EAEE,cAAc;AAChB;AACA;;EAEE,eAAe;EACf,kBAAkB;AACpB;AACA;;EAEE,WAAW;EACX,eAAe;AACjB","file":"Datepicker.vue","sourcesContent":[".rtl {\n  direction: rtl;\n}\n.vdp-datepicker {\n  position: relative;\n  text-align: left;\n}\n.vdp-datepicker * {\n  box-sizing: border-box;\n}\n.vdp-datepicker__calendar {\n  position: absolute;\n  z-index: 100;\n  background: #fff;\n  width: 300px;\n  border: 1px solid #ccc;\n}\n.vdp-datepicker__calendar header {\n  display: block;\n  line-height: 40px;\n}\n.vdp-datepicker__calendar header span {\n  display: inline-block;\n  text-align: center;\n  width: 71.42857142857143%;\n  float: left;\n}\n.vdp-datepicker__calendar header .prev,\n.vdp-datepicker__calendar header .next {\n  width: 14.285714285714286%;\n  float: left;\n  text-indent: -10000px;\n  position: relative;\n}\n.vdp-datepicker__calendar header .prev:after,\n.vdp-datepicker__calendar header .next:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  border: 6px solid transparent;\n}\n.vdp-datepicker__calendar header .prev:after {\n  border-right: 10px solid #000;\n  margin-left: -5px;\n}\n.vdp-datepicker__calendar header .prev.disabled:after {\n  border-right: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .next:after {\n  border-left: 10px solid #000;\n  margin-left: 5px;\n}\n.vdp-datepicker__calendar header .next.disabled:after {\n  border-left: 10px solid #ddd;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled),\n.vdp-datepicker__calendar header .next:not(.disabled),\n.vdp-datepicker__calendar header .up:not(.disabled) {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar header .prev:not(.disabled):hover,\n.vdp-datepicker__calendar header .next:not(.disabled):hover,\n.vdp-datepicker__calendar header .up:not(.disabled):hover {\n  background: #eee;\n}\n.vdp-datepicker__calendar .disabled {\n  color: #ddd;\n  cursor: default;\n}\n.vdp-datepicker__calendar .flex-rtl {\n  display: flex;\n  width: inherit;\n  flex-wrap: wrap;\n}\n.vdp-datepicker__calendar .cell {\n  display: inline-block;\n  padding: 0 5px;\n  width: 14.285714285714286%;\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid transparent;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year {\n  cursor: pointer;\n}\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,\n.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {\n  border: 1px solid #4bd;\n}\n.vdp-datepicker__calendar .cell.selected {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected:hover {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.selected.highlighted {\n  background: #4bd;\n}\n.vdp-datepicker__calendar .cell.highlighted {\n  background: #cae5ed;\n}\n.vdp-datepicker__calendar .cell.highlighted.disabled {\n  color: #a3a3a3;\n}\n.vdp-datepicker__calendar .cell.grey {\n  color: #888;\n}\n.vdp-datepicker__calendar .cell.grey:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header {\n  font-size: 75%;\n  white-space: nowrap;\n  cursor: inherit;\n}\n.vdp-datepicker__calendar .cell.day-header:hover {\n  background: inherit;\n}\n.vdp-datepicker__calendar .month,\n.vdp-datepicker__calendar .year {\n  width: 33.333%;\n}\n.vdp-datepicker__clear-button,\n.vdp-datepicker__calendar-button {\n  cursor: pointer;\n  font-style: normal;\n}\n.vdp-datepicker__clear-button.disabled,\n.vdp-datepicker__calendar-button.disabled {\n  color: #999;\n  cursor: default;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Datepicker = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Datepicker);


/***/ })

}]);