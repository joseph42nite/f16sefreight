import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/jwt.service";

/**
 * Rethrow a failed request as a new Error, but KEEP what the server said (Walk 4 #42).
 *
 * get/query/delete threw a bare `new Error(...)`, which dropped `error.response`. Every screen reads the server's
 * reason from `e.response.data`, so a refused or failed GET always fell through to "Something went wrong." with no
 * status and no message — the same text for "you may not" and "the server broke". post/put/patch never did this.
 */
function rethrow(prefix, error) {
  const wrapped = new Error(`${prefix} ApiService ${error}`);
  wrapped.response = error && error.response;
  wrapped.status = error && error.response ? error.response.status : undefined;

  return wrapped;
}

/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = "/api";
    this.setHeader();
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch(error => {
      throw rethrow("[KT]", error);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    const url = slug ? `${resource}/${slug}` : resource;
    return Vue.axios.get(url).catch(error => {
      throw rethrow("[KT]", error);
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * A POST whose answer is a FILE rather than JSON — a printed bill, a generated document.
   *
   * ⚠️ Separate from post() because axios needs `responseType: "blob"` set BEFORE the response arrives; a PDF
   * fetched without it comes back as a mangled string and cannot be opened.
   */
  postForFile(resource, params) {
    return Vue.axios.post(`${resource}`, params, { responseType: "blob" });
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * PATCH — a PARTIAL update.
   *
   * `update()` sends PUT, which means "replace the resource with this". A status
   * transition sends one field and means "change this one thing", and the Freight OS
   * endpoints validate accordingly: a PUT carrying only `status` would read as a
   * request to blank every other column.
   */
  patch(resource, slug, params) {
    return Vue.axios.patch(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return Vue.axios.delete(resource).catch(error => {
      throw rethrow("[RWV]", error);
    });
  }
};

export default ApiService;
