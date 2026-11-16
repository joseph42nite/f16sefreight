import router from "@/router";
import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import { SET_CONTEXT, PURGE_CONTEXT } from "./context.module";
import { LANDING_ROUTE } from "@/core/config/navigation";
import { forgetMe } from "@/core/services/me";

/**
 * To the sign-in page. A guard REDIRECTS this to the portal's own sign-in, which is intended — but vue-router rejects
 * a redirected push, and unhandled it logged "Uncaught (in promise) Redirected when going from / to /" on every visit
 * before signing in (GAPS #420).
 */
const toSignIn = () => router.push({ name: "userlogin" }).catch(() => {});

/**
 * The last check that passed (FK1). A check is asked again after this long, on a different token, or for a different
 * kind of account — not on every navigation, which sent a `POST /verify` per click. A session ended in between is
 * caught by the 401 on the page's own calls (`ApiService.onUnauthorized`).
 */
const VERIFY_EVERY_MS = 30000;
let verified = { token: null, userType: null, at: 0 };
/** The check on its way, shared: one page load runs the guard several times before the first answer is back. */
let checking = { key: null, promise: null };

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_Source = "setSource";
export const SET_ERROR = "setError";

const state = {
  errors: null,
  user: {},
  user_source:JwtService.getSource(),
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  userSource(state) {
    return state.user_source;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

const actions = {
  [LOGIN](context, credentials) {
    return ApiService.post("/login", credentials)
      .then(({ data }) => {
        context.commit(SET_AUTH, data.user);
        JwtService.saveToken(data.token);
        JwtService.saveRole(data.role);
        // The new person's token on every call from here, and nobody else's profile (FK3, FK4).
        ApiService.setHeader();
        forgetMe();

        // The login response carries `context` (designation, tier) and `portal`
        // (key, label, scope) — see LoginController. Route guards and the nav rail
        // read from these. CONVENIENCE ONLY: the server re-checks every request.
        context.commit(SET_CONTEXT, { context: data.context, portal: data.portal });

        if (data.role == "user") {
          JwtService.saveSource(data.user.origin_airport_code);
          context.commit(SET_Source, data.user.origin_airport_code);

          // §8.2 — land on the route this login actually works from. Pricing starts
          // in the mail, operations in their queue, accounts in the registers.
          // Falls back to /focus-air, which is the whole product on the core tier.
          const designation = (data.context && data.context.designation) || null;
          router.replace(LANDING_ROUTE[designation] || "/focus-air");
        } else if (data.role == "superAdmin")
          router.replace(`/superadmin/overview`);
        return data;
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || error.message || "Login failed";
        context.commit(SET_ERROR, errorMessage);
        throw error;
      });
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  /**
   * Is this session good for this kind of account? Resolves `true` to go on, `false` when the person was signed out
   * and sent to sign in.
   *
   * 🔴 It RETURNS its promise (FK1). It did not, so the route guard never waited: a protected page mounted and called
   * the API before the token had been checked.
   */
  [VERIFY_AUTH](context,userType) {
    let token=JwtService.getToken();
    if (token && token!='undefined') {
      ApiService.setHeader();

      const kind = userType.userType;
      if (verified.token === token && verified.userType === kind && Date.now() - verified.at < VERIFY_EVERY_MS) {
        return Promise.resolve(true);
      }

      const key = kind + "|" + token;
      if (checking.promise && checking.key === key) return checking.promise;

      let token_data={};
      token_data.token=token;
      const done = () => { if (checking.key === key) checking = { key: null, promise: null }; };
      checking = { key, promise: null };
      checking.promise = ApiService.post(`/${kind}/verify`,token_data)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
          verified = { token, userType: kind, at: Date.now() };
          return true;
        })
        .catch((error) => {
          // No answer at all (offline, a timeout) is not a refusal (frontend audit, FK3): reading `.status` of nothing
          // threw here. The person stays signed in and the next check decides.
          const response = error && error.response;
          if (!response) return true;

          if (response.status == 401) {
              // Kept past the purge, so the sign-in page can say why (Walk 4 #38: "you signed in somewhere else").
              const reason = response.data && response.data.error;
              return context.dispatch(LOGOUT)
                  .then(() => { if (reason) context.commit(SET_ERROR, reason); })
                  .then(() => toSignIn())
                  .then(() => false);
          }

          context.commit(SET_ERROR, response.data && response.data.errors);
          return true;
      })
      .then((ok) => { done(); return ok; });

      return checking.promise;
    }

    context.commit(PURGE_AUTH);
    toSignIn();
    return Promise.resolve(false);
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_Source](state, source) {
    state.user_source = source;
  },
  [SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
  },
  [PURGE_AUTH](state) {
    // Clear the cached shell shape too, or the next user briefly sees the previous
    // one's navigation before /me returns.
    this.commit(PURGE_CONTEXT);
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    state.user_source ="";
    JwtService.destroyToken();
    JwtService.destroyRole();
    JwtService.destroySource();
    // Nothing of the session left on axios or in the shared `/me` (FK3, FK4).
    ApiService.setHeader();
    forgetMe();
    verified = { token: null, userType: null, at: 0 };
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
