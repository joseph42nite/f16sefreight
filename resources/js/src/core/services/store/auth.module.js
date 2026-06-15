import router from "@/router";
import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";

// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";
export const UPDATE_Source ="updateSource";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setUser";
export const SET_PASSWORD = "setPassword";
export const SET_Source = "setSource";
export const SET_ERROR = "setError";
export const SAVE_FORM_DATA ="saveFormData";

const state = {
  errors: null,
  user: {},
  user_source:JwtService.getSource(),
  formData: {},
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  getFormData(state) {
    return state.formData;
  },
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
        if (data.role == "user") {
          JwtService.saveSource(data.user.origin_airport_code);
          context.commit(SET_Source, data.user.origin_airport_code);
          const portalScope = sessionStorage.getItem('active_portal_scope') || 'air';
          if (portalScope === 'sea') {
            router.push(`/focus-sea-master`);
          } else {
            router.push(`/focus-air`);
          }
        } else if (data.role == "superAdmin")
          router.push(`/superadmin/all-users`);
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
  [VERIFY_AUTH](context,userType) {
    let token=JwtService.getToken();
    if (token && token!='undefined') {
      ApiService.setHeader();
      let token_data={};
      token_data.token=token;
      ApiService.post(`/${userType.userType}/verify`,token_data)
        .then(({ data }) => {
          context.commit(SET_AUTH, data);
        })
        .catch(({ response }) => {
          if (response.status == 401) {
              context.dispatch(LOGOUT)
                  .then(() => router.push({ name: `userlogin` }));
          } else {
              context.commit(SET_ERROR, response.data.errors);
          }
      });
    } 
    else {
      context.commit(PURGE_AUTH);
      router.push({ name: `userlogin` });
    }
  },
  [UPDATE_PASSWORD](context, payload) {
    const password = payload;

    return ApiService.put("password", password).then(({ data }) => {
      context.commit(SET_PASSWORD, data);
      return data;
    });
  },
  [UPDATE_Source](context, source) {
      JwtService.saveSource(source);
      context.commit(SET_Source, source);
  }
};

const mutations = {
  [SAVE_FORM_DATA](state, formData) {
    state.formData = formData;
  },
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
  [SET_PASSWORD](state, password) {
    state.user.password = password;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    state.user_source ="";
    JwtService.destroyToken();
    JwtService.destroySource();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
