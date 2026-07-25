import ApiService from "@/core/services/api.service";

/**
 * Shared state + helpers for the superadmin listing pages
 * (AllUsers / AllCompany / AllBranch / AllContacts / AllBlogs).
 *
 * Provides the b-table pagination/filter plumbing that every list screen
 * repeated verbatim. Components still declare their own `fields` and any
 * page-specific state; `pageOptions` can be overridden in the component's
 * own data() when a different set is needed.
 */
export default {
  data() {
    return {
      items: [],
      isLoading: false,
      filter: null,
      totalRows: 0,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 15, 20, { value: 100, text: "Show a lot" }],
    };
  },
  methods: {
    /** Keep the pagination total in sync with client-side filtering. */
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    /**
     * Load a simple endpoint that returns a flat array of rows.
     * @param {string} url
     * @param {function(any):any[]} [transform] optional response mapper
     * @returns {Promise}
     */
    loadItems(url, transform = null) {
      this.items = [];
      this.isLoading = true;
      return ApiService.get(url)
        .then(({ data }) => {
          this.items = transform ? transform(data) : data;
          this.totalRows = this.items.length;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    /**
     * Confirm, then DELETE. Resolves to true when the row was deleted so the
     * caller can reload, false when the user cancelled.
     * @returns {Promise<boolean>}
     */
    confirmRemove(url, message = "Are you sure you want to proceed?") {
      if (!confirm(message)) return Promise.resolve(false);
      return ApiService.delete(url).then(() => true);
    },
  },
};
