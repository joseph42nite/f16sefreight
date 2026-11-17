/**
 * Paging for a register the server sends 50 rows at a time (frontend audit, FM7). Three registers read page one
 * and had no way to reach the next, so row 51 could not be seen at all.
 *
 * The page keeps its own `load()`: it adds `pageParam()` to its query and hands the answer to `readPaging()`.
 * A filter calls `search()`, so a new search starts again from the first page.
 */
export function pagingOf(data, rowCount = 0) {
  const body = data || {};
  const lastPage = Math.max(1, Number(body.last_page) || 1);

  return {
    page: Math.max(1, Number(body.current_page) || 1),
    lastPage,
    total: Number.isFinite(Number(body.total)) && body.last_page !== undefined ? Number(body.total) : rowCount,
  };
}

export const pagingMixin = {
  data: () => ({ page: 1, lastPage: 1, total: 0 }),
  methods: {
    pageParam() {
      return "page=" + this.page;
    },
    search() {
      this.page = 1;
      this.load();
    },
    goTo(page) {
      this.page = page;
      this.load();
      if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
    },
    /**
     * Keeps what the server said about the pages. Returns true when the page asked for is past the end (the last
     * row of the last page was just removed): the last page is asked for instead and the caller should stop.
     */
    readPaging(data, rowCount = 0) {
      const paging = pagingOf(data, rowCount);

      if (this.page > paging.lastPage) {
        this.lastPage = paging.lastPage;
        this.goTo(paging.lastPage);
        return true;
      }

      this.page = paging.page;
      this.lastPage = paging.lastPage;
      this.total = paging.total;
      return false;
    },
  },
};
