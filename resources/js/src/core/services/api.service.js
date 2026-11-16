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
/**
 * Whether a refused call means "your session is over" (frontend audit, FK2).
 *
 * A 401 while a token is held, on anything but the sign-in calls themselves — and not on a platform route asked by a
 * tenant, which is refused for the wrong kind of account, not for an ended session.
 */
export function sessionEnded(error, token, role) {
  const response = error && error.response;
  const url = String((error && error.config && error.config.url) || "");

  if (!response || response.status !== 401 || !token || token === "undefined") return false;
  // Signing in, checking the session, signing out and the password reset answer 401 for their own reasons.
  if (/\/(login|verify|logout|check-forgot-token|Forgotpassword\w*)(\?|$)/i.test(url)) return false;
  if (role === "user" && /(^|\/)(superadmin|admin)\//.test(url)) return false;

  return true;
}

const ApiService = {
  /** Set by main.js: what to do when the session turns out to be over. Given the server's reason, if it sent one. */
  onUnauthorized: null,

  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = "/api";
    this.setHeader();

    // 🔴 The only interceptor (FK2). Without it an expired token showed a per-page error on every call until the next
    // navigation happened to check it. The failure is still passed on, so each screen's own handling runs as before.
    Vue.axios.interceptors.response.use((response) => response, (error) => {
      if (this.onUnauthorized && sessionEnded(error, JwtService.getToken(), JwtService.getRole())) {
        const data = error.response.data;

        this.onUnauthorized(data && typeof data.error === "string" ? data.error : null);
      }

      return Promise.reject(error);
    });
  },

  /**
   * Set the default HTTP request headers. With no token there is no header (FK3): after a sign-out the old token
   * stayed on axios, and with none stored it sent "Bearer null".
   */
  setHeader() {
    const token = JwtService.getToken();

    if (token && token !== "undefined") Vue.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete Vue.axios.defaults.headers.common["Authorization"];
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
