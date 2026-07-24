"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_src_view_pages_admin_AllBlogs_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/services/api.service */ "./resources/js/src/core/services/api.service.js");
/* harmony import */ var _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/SkeletonTable.vue */ "./resources/js/src/view/components/SkeletonTable.vue");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sweetalert2 */ "./node_modules/sweetalert2/dist/sweetalert2.all.js");
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_mixins_adminList_mixin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/core/mixins/adminList.mixin */ "./resources/js/src/core/mixins/adminList.mixin.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: "superadminallblogs",
  mixins: [_core_mixins_adminList_mixin__WEBPACK_IMPORTED_MODULE_3__["default"]],
  data: function data() {
    return {
      fields: [{
        label: "Cover",
        key: "image",
        thClass: "pl-4",
        tdClass: "pl-4"
      }, {
        label: "Content / Title",
        key: "title"
      }, {
        label: "Views",
        key: "views_count"
      }, {
        label: "Status",
        key: "status"
      }, {
        label: "Published Date",
        key: "date"
      }, {
        label: "Actions",
        key: "action",
        tdClass: "text-right",
        thClass: "text-right pr-4"
      }],
      // Blogs list omits the "Show a lot" option (heavier rows w/ images)
      pageOptions: [10, 15, 20]
    };
  },
  components: {
    SkeletonTable: _components_SkeletonTable_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  methods: {
    fetchBlogs: function fetchBlogs() {
      return this.loadItems("/superadmin/all-blogs-internal", function (data) {
        return data.success ? data.data : [];
      });
    },
    formatDate: function formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    confirmDelete: function confirmDelete(blog) {
      var _this = this;
      sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire({
        title: 'Delete this Blog?',
        text: "You are about to permanently delete \"".concat(blog.title, "\". This action cannot be undone."),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#355594',
        confirmButtonText: 'Yes, delete it!'
      }).then(function (result) {
        if (result.isConfirmed) {
          _core_services_api_service__WEBPACK_IMPORTED_MODULE_0__["default"]["delete"]("/superadmin/delete-blog/".concat(blog.id)).then(function (response) {
            sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire('Deleted!', 'Successfully removed blog.', 'success');
            _this.fetchBlogs();
          })["catch"](function (err) {
            sweetalert2__WEBPACK_IMPORTED_MODULE_2___default().fire('Error', 'Failed to delete record.', 'error');
          });
        }
      });
    }
  },
  mounted: function mounted() {
    this.fetchBlogs();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=template&id=68d66aac":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=template&id=68d66aac ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************/
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
    staticClass: "py-5"
  }, [_c("div", {
    staticClass: "admin-page-header"
  }, [_c("h2", [_vm._v("Editorial & Blogs Registry")]), _vm._v(" "), _c("router-link", {
    staticClass: "admin-pill-btn text-white",
    attrs: {
      to: "/superadmin/new-blog"
    }
  }, [_c("i", {
    staticClass: "fas fa-plus-circle mr-2"
  }), _vm._v("\n            Create New Blog\n        ")])], 1), _vm._v(" "), _c("div", {
    staticClass: "admin-glass-card"
  }, [_c("div", {
    staticClass: "admin-filter-row"
  }, [_c("div", {
    staticClass: "d-flex align-items-center"
  }, [_c("span", {
    staticClass: "mr-3 font-weight-bold text-muted"
  }, [_vm._v("Show:")]), _vm._v(" "), _c("b-form-select", {
    staticClass: "form-control-sm",
    staticStyle: {
      "max-width": "120px"
    },
    attrs: {
      id: "per-page-select",
      options: _vm.pageOptions
    },
    model: {
      value: _vm.perPage,
      callback: function callback($$v) {
        _vm.perPage = $$v;
      },
      expression: "perPage"
    }
  })], 1), _vm._v(" "), _c("div", {
    staticClass: "w-md-25"
  }, [_c("b-form-input", {
    staticClass: "py-4",
    attrs: {
      id: "filter-input",
      type: "search",
      placeholder: "Search blogs..."
    },
    model: {
      value: _vm.filter,
      callback: function callback($$v) {
        _vm.filter = $$v;
      },
      expression: "filter"
    }
  })], 1)]), _vm._v(" "), _c("div", {
    staticClass: "admin-table-wrapper"
  }, [_vm.isLoading ? _c("SkeletonTable", {
    attrs: {
      rows: 8,
      columns: 4
    }
  }) : _c("b-table", {
    attrs: {
      responsive: "",
      stacked: "md",
      hover: "",
      items: _vm.items,
      fields: _vm.fields,
      "primary-key": "id",
      filter: _vm.filter,
      "current-page": _vm.currentPage,
      "per-page": _vm.perPage,
      "thead-class": "text-uppercase font-size-xs text-muted",
      "empty-text": "No blogs found in the database yet.",
      "show-empty": ""
    },
    on: {
      filtered: _vm.onFiltered
    },
    scopedSlots: _vm._u([{
      key: "cell(image)",
      fn: function fn(data) {
        return [_c("div", {
          staticClass: "symbol symbol-70 symbol-2by3 shadow-sm overflow-hidden",
          staticStyle: {
            "border-radius": "8px",
            background: "#eee"
          }
        }, [data.item.image_path ? _c("img", {
          staticClass: "object-fit-cover h-100 w-100",
          attrs: {
            src: data.item.image_path,
            alt: "Blog Thumbnail"
          }
        }) : _c("div", {
          staticClass: "d-flex align-items-center justify-content-center h-100 font-size-xs text-muted"
        }, [_vm._v("No Image")])])];
      }
    }, {
      key: "cell(title)",
      fn: function fn(data) {
        return [_c("div", [_c("div", {
          staticClass: "font-weight-bolder text-dark font-size-lg mb-1"
        }, [_vm._v(_vm._s(data.item.title))]), _vm._v(" "), _c("div", {
          staticClass: "text-muted font-size-sm"
        }, [_c("b-badge", {
          staticClass: "mr-2",
          attrs: {
            variant: "light-primary"
          }
        }, [_vm._v(_vm._s(data.item.category))]), _vm._v(" "), _c("span", [_vm._v(_vm._s(data.item.read_time) + " read")])], 1)])];
      }
    }, {
      key: "cell(views_count)",
      fn: function fn(data) {
        return [_c("b-badge", {
          staticClass: "font-weight-bold py-2 px-3",
          attrs: {
            variant: "light-info"
          }
        }, [_c("i", {
          staticClass: "fas fa-eye mr-1 text-info"
        }), _vm._v(" " + _vm._s(data.item.views_count || 0) + "\n                    ")])];
      }
    }, {
      key: "cell(status)",
      fn: function fn(data) {
        return [_c("b-badge", {
          attrs: {
            variant: data.item.published_at ? "light-success" : "light-warning"
          }
        }, [_vm._v("\n                        " + _vm._s(data.item.published_at ? "Published" : "Draft") + "\n                    ")])];
      }
    }, {
      key: "cell(date)",
      fn: function fn(data) {
        return [data.item.published_at ? _c("span", {
          staticClass: "text-muted"
        }, [_vm._v(_vm._s(_vm.formatDate(data.item.published_at)))]) : _c("span", {
          staticClass: "text-muted italic"
        }, [_vm._v("—")])];
      }
    }, {
      key: "cell(action)",
      fn: function fn(data) {
        return [_c("div", {
          staticClass: "d-flex justify-content-end align-items-center"
        }, [_c("router-link", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "btn btn-icon btn-light-primary btn-sm mr-2",
          attrs: {
            to: "/superadmin/new-blog/" + data.item.id,
            title: "Edit Blog"
          }
        }, [_c("i", {
          staticClass: "fas fa-pen font-size-sm"
        })]), _vm._v(" "), _c("b-button", {
          directives: [{
            name: "b-tooltip",
            rawName: "v-b-tooltip.hover",
            modifiers: {
              hover: true
            }
          }],
          staticClass: "btn-icon",
          attrs: {
            variant: "light-danger",
            size: "sm",
            title: "Delete"
          },
          on: {
            click: function click($event) {
              return _vm.confirmDelete(data.item);
            }
          }
        }, [_c("i", {
          staticClass: "fas fa-trash font-size-sm"
        })])], 1)];
      }
    }])
  })], 1), _vm._v(" "), _vm.totalRows > 0 ? _c("div", {
    staticClass: "admin-pagination-wrap"
  }, [_c("div", {
    staticClass: "text-muted font-weight-bold font-size-sm"
  }, [_vm._v("\n                Showing " + _vm._s(_vm.items.length ? (_vm.currentPage - 1) * _vm.perPage + 1 : 0) + " to " + _vm._s(Math.min(_vm.currentPage * _vm.perPage, _vm.totalRows)) + " of " + _vm._s(_vm.totalRows) + "\n            ")]), _vm._v(" "), _c("b-pagination", {
    staticClass: "my-0",
    attrs: {
      "total-rows": _vm.totalRows,
      "per-page": _vm.perPage,
      size: "sm"
    },
    model: {
      value: _vm.currentPage,
      callback: function callback($$v) {
        _vm.currentPage = $$v;
      },
      expression: "currentPage"
    }
  })], 1) : _vm._e()])]);
};
var staticRenderFns = [];
render._withStripped = true;


/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllBlogs.vue":
/*!********************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllBlogs.vue ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AllBlogs_vue_vue_type_template_id_68d66aac__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AllBlogs.vue?vue&type=template&id=68d66aac */ "./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=template&id=68d66aac");
/* harmony import */ var _AllBlogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AllBlogs.vue?vue&type=script&lang=js */ "./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AllBlogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AllBlogs_vue_vue_type_template_id_68d66aac__WEBPACK_IMPORTED_MODULE_0__.render,
  _AllBlogs_vue_vue_type_template_id_68d66aac__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/src/view/pages/admin/AllBlogs.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=script&lang=js":
/*!********************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=script&lang=js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBlogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllBlogs.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBlogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=template&id=68d66aac":
/*!**************************************************************************************!*\
  !*** ./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=template&id=68d66aac ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBlogs_vue_vue_type_template_id_68d66aac__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBlogs_vue_vue_type_template_id_68d66aac__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_loaders_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AllBlogs_vue_vue_type_template_id_68d66aac__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!../../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AllBlogs.vue?vue&type=template&id=68d66aac */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/loaders/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/src/view/pages/admin/AllBlogs.vue?vue&type=template&id=68d66aac");


/***/ })

}]);