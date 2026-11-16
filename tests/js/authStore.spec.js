/**
 * The sign-in store, run against a pretend server (2026-11-15 frontend audit, tests section: "no test for the auth
 * store"). FK1 to FK4 were checked by reading the file; here the actions are dispatched.
 */
import Vue from "vue";
import Vuex from "vuex";

jest.mock("@/router", () => ({ __esModule: true, default: { push: jest.fn(() => Promise.resolve()), replace: jest.fn() } }));
jest.mock("@/core/services/me", () => ({ __esModule: true, getMe: jest.fn(), forgetMe: jest.fn() }));

import router from "@/router";
import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import { forgetMe } from "@/core/services/me";
import auth, { VERIFY_AUTH, LOGIN, LOGOUT } from "@/core/services/store/auth.module";
import context from "@/core/services/store/context.module";

Vue.use(Vuex);

const refused = (status, data = {}) => Object.assign(new Error("refused"), { response: { status, data } });
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
let store;
let post;

beforeEach(() => {
  localStorage.clear();
  Vue.axios = { defaults: { headers: { common: {} } } };
  store = new Vuex.Store({ modules: { auth, context } });
  // The module remembers the last check that passed; signing out forgets it.
  store.dispatch(LOGOUT);
  jest.clearAllMocks();
  post = jest.spyOn(ApiService, "post");
});

afterEach(() => jest.restoreAllMocks());

describe("checking a session", () => {
  it("with no token signs out and sends the visitor to sign in", async () => {
    await expect(store.dispatch(VERIFY_AUTH, { userType: "user" })).resolves.toBe(false);

    expect(post).not.toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith({ name: "userlogin" });
  });

  it("asks the server, keeps the user, and resolves true (FK1)", async () => {
    JwtService.saveToken("tok-1");
    post.mockResolvedValue({ data: { id: 7, name: "Asha" } });

    await expect(store.dispatch(VERIFY_AUTH, { userType: "user" })).resolves.toBe(true);

    expect(post).toHaveBeenCalledWith("/user/verify", { token: "tok-1" });
    expect(store.getters.currentUser).toEqual({ id: 7, name: "Asha" });
    expect(Vue.axios.defaults.headers.common.Authorization).toBe("Bearer tok-1");
  });

  it("does not ask again on the next navigation (FK1)", async () => {
    JwtService.saveToken("tok-1");
    post.mockResolvedValue({ data: {} });

    await store.dispatch(VERIFY_AUTH, { userType: "user" });
    await store.dispatch(VERIFY_AUTH, { userType: "user" });

    expect(post).toHaveBeenCalledTimes(1);
  });

  it("asks once when one page load checks several times at once (FK1)", async () => {
    JwtService.saveToken("tok-1");
    post.mockResolvedValue({ data: {} });

    const answers = await Promise.all([1, 2, 3].map(() => store.dispatch(VERIFY_AUTH, { userType: "user" })));

    expect(answers).toEqual([true, true, true]);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("asks again for a different token or kind of account", async () => {
    JwtService.saveToken("tok-1");
    post.mockResolvedValue({ data: {} });
    await store.dispatch(VERIFY_AUTH, { userType: "user" });

    JwtService.saveToken("tok-2");
    await store.dispatch(VERIFY_AUTH, { userType: "user" });
    await store.dispatch(VERIFY_AUTH, { userType: "superadmin" });

    expect(post.mock.calls.map((call) => call[0])).toEqual(["/user/verify", "/user/verify", "/superadmin/verify"]);
  });

  it("a 401 signs out, keeps the server's reason and opens sign-in", async () => {
    JwtService.saveToken("tok-1");
    post.mockRejectedValue(refused(401, { error: "Signed_In_Elsewhere" }));

    await expect(store.dispatch(VERIFY_AUTH, { userType: "user" })).resolves.toBe(false);

    expect(JwtService.getToken()).toBeNull();
    expect(store.getters.isAuthenticated).toBe(false);
    expect(store.state.auth.errors).toBe("Signed_In_Elsewhere");
    expect(router.push).toHaveBeenCalledWith({ name: "userlogin" });
  });

  it("no answer at all leaves the person signed in (FK3)", async () => {
    JwtService.saveToken("tok-1");
    post.mockRejectedValue(new Error("Network Error"));

    await expect(store.dispatch(VERIFY_AUTH, { userType: "user" })).resolves.toBe(true);

    expect(JwtService.getToken()).toBe("tok-1");
    expect(router.push).not.toHaveBeenCalled();
  });

  it("a failed check is not remembered as passed", async () => {
    JwtService.saveToken("tok-1");
    post.mockRejectedValueOnce(new Error("Network Error")).mockResolvedValue({ data: {} });

    await store.dispatch(VERIFY_AUTH, { userType: "user" });
    await store.dispatch(VERIFY_AUTH, { userType: "user" });

    expect(post).toHaveBeenCalledTimes(2);
  });
});

describe("signing in and out", () => {
  const answer = { token: "tok-9", role: "user", user: { id: 3, origin_airport_code: "BOM" },
    context: { designation: "operations", tier: "command" }, portal: { key: "focusair", label: "FocusAir", scope: "air" } };

  it("keeps the token, puts it on every call, and lands where the day starts", async () => {
    post.mockResolvedValue({ data: answer });

    await store.dispatch(LOGIN, { email: "a@b.test", password: "x" });

    expect(JwtService.getToken()).toBe("tok-9");
    expect(Vue.axios.defaults.headers.common.Authorization).toBe("Bearer tok-9");
    expect(store.getters.designation).toBe("operations");
    expect(router.replace).toHaveBeenCalledWith("/kanban");
    expect(forgetMe).toHaveBeenCalled();
  });

  it("a refusal is kept for the form to show, and nothing is stored", async () => {
    post.mockRejectedValue(refused(401, { error: "Unauthorized" }));

    await expect(store.dispatch(LOGIN, { email: "a@b.test", password: "x" })).rejects.toBeDefined();

    expect(store.state.auth.errors).toBe("Unauthorized");
    expect(JwtService.getToken()).toBeNull();
  });

  it("signing out leaves nothing of the session behind (FK3, FK4)", async () => {
    post.mockResolvedValue({ data: answer });
    await store.dispatch(LOGIN, { email: "a@b.test", password: "x" });
    forgetMe.mockClear();

    await store.dispatch(LOGOUT);
    await flush();

    expect(JwtService.getToken()).toBeNull();
    expect(JwtService.getRole()).toBeNull();
    expect("Authorization" in Vue.axios.defaults.headers.common).toBe(false);
    expect(store.getters.isAuthenticated).toBe(false);
    expect(store.getters.designation).toBeNull();
    expect(forgetMe).toHaveBeenCalled();
  });
});
