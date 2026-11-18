/**
 * Every row of a paged list, for a pick-list (frontend audit, FM7).
 *
 * The pick-lists of clients and partners asked for one page of 500, the server's ceiling for a page: client
 * number 501 could not be chosen anywhere. This asks for the first page and, when the server says there are
 * more, for the rest of them, and answers with one list.
 *
 *   wholeList("/customers").then((rows) => { this.clients = rows; })
 *   wholeList("/partners", { type: "airline" })
 */
import ApiService from "@/core/services/api.service";

/** The server's own ceiling for a page. */
export const PAGE_SIZE = 500;
/** 20,000 rows: past that a pick-list is the wrong tool, and a runaway `last_page` must not loop. */
export const MOST_PAGES = 40;

function query(params, page) {
  const parts = ["per_page=" + PAGE_SIZE];

  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== "") parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  });
  if (page > 1) parts.push("page=" + page);

  return "?" + parts.join("&");
}

const rowsOf = (data) => (data && Array.isArray(data.data) ? data.data : []);

export function wholeList(path, params = {}) {
  return ApiService.get(path + query(params, 1)).then(({ data }) => {
    const first = rowsOf(data);
    const pages = Math.min(Number(data && data.last_page) || 1, MOST_PAGES);
    if (pages <= 1) return first;

    const rest = [];
    for (let page = 2; page <= pages; page++) rest.push(ApiService.get(path + query(params, page)));

    return Promise.all(rest).then((answers) => {
      // A row added while the pages were being read can turn up on two of them: each id once.
      const seen = new Set();

      return first.concat(...answers.map(({ data: more }) => rowsOf(more))).filter((row) => {
        if (!row || row.id === undefined || row.id === null) return true;
        if (seen.has(row.id)) return false;
        seen.add(row.id);
        return true;
      });
    });
  });
}

export default wholeList;
