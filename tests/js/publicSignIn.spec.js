/**
 * A portal's own sign-in page and the public header, mounted (2026-11-15 frontend audit: FA2's "Forgot password?"
 * on the portal page, FK5's stored token in the header, and the OTP box nothing opened).
 */
import fs from "fs";
import path from "path";
import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import BootstrapVue from "bootstrap-vue";
import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import PortalSignIn from "@/view/pages/public/PortalSignIn.vue";
import Header from "@/view/layouts/public/Header.vue";

// The auth store brings the router and the whole store with it; the pages only need the names of the actions.
jest.mock("@/core/services/store/auth.module", () => ({ LOGIN: "login", LOGOUT: "logOut", SET_ERROR: "setError" }));
jest.mock("@/core/config/portalHosts", () => ({
  portalFromHost: jest.fn(() => "focusair"),
  mainSiteUrl: (location, to) => "https://main.test" + to,
  portalSignInUrl: (key) => `https://${key}.main.test/`,
  SIGN_IN_PORTALS: [{ key: "focusair", label: "Operations", note: "Air and sea" }, { key: "accounts", label: "Accounts", note: "Billing" }],
}));

const { portalFromHost } = require("@/core/config/portalHosts");

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

afterEach(() => { jest.restoreAllMocks(); portalFromHost.mockReturnValue("focusair"); window.localStorage.clear(); });

describe("a portal's sign-in page", () => {
  const open = ({ errors = {}, login = jest.fn(() => Promise.resolve()) } = {}) => {
    const store = new Vuex.Store({ state: { auth: { errors } }, actions: { login: (context, credentials) => login(credentials) } });
    const wrapper = mount(PortalSignIn, { localVue, store });

    return { wrapper, login, store };
  };
  const forgot = (wrapper) => wrapper.find(".fx-signin__forgot");

  it("is named after its portal, and offers the others", async () => {
    const { wrapper } = open();

    expect(wrapper.find("h1").text()).toBe("Operations");
    expect(document.title).toBe("Operations · Sign in");

    await wrapper.find(".fx-signin__switch button").trigger("click");

    expect(wrapper.findAll(".fx-signin__portals a").wrappers.map((a) => a.attributes("href"))).toEqual(["https://accounts.main.test/"]);
  });

  it("signs in with what was typed", async () => {
    const { wrapper, login } = open();

    await wrapper.find("input[type=email]").setValue(" asha@example.test ");
    await wrapper.find("input[type=password]").setValue("secret-word");
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(login).toHaveBeenCalledWith({ email: "asha@example.test", password: "secret-word" });
    expect(wrapper.find("[role=alert]").exists()).toBe(false);
  });

  it("says in words why a sign-in was refused", async () => {
    const { wrapper, store } = open({ login: jest.fn(() => Promise.reject(new Error("no"))) });

    store.state.auth.errors = "Blocked";
    await wrapper.find("form").trigger("submit");
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("Account blocked. Contact your admin.");
    expect(wrapper.find(".fx-signin__submit").attributes("disabled")).toBeUndefined();
  });

  it("says so when a newer sign-in ended the session", () => {
    const { wrapper } = open({ errors: "Signed_In_Elsewhere" });

    expect(wrapper.find("[role=alert]").text()).toContain("signed in somewhere else");
  });

  it("asks for the address before asking for a reset", async () => {
    const { wrapper } = open();
    const post = jest.spyOn(ApiService, "post");

    await forgot(wrapper).trigger("click");

    expect(post).not.toHaveBeenCalled();
    expect(wrapper.find("[role=status]").text()).toContain("Type your email address above first");
  });

  it("asks the server for the reset mail, and shows its answer", async () => {
    const { wrapper } = open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: { data: "If that address has an account, a reset link is on its way." } });

    await wrapper.find("input[type=email]").setValue("asha@example.test");
    await forgot(wrapper).trigger("click");
    await flush();

    expect(post).toHaveBeenCalledWith("/Forgotpassword", { email: "asha@example.test" });
    expect(wrapper.find("[role=status]").text()).toBe("If that address has an account, a reset link is on its way.");
    expect(forgot(wrapper).attributes("disabled")).toBeUndefined();
  });

  it.each([
    [429, "Too many tries just now. Please wait a minute and try again."],
    [500, "The reset link could not be sent. Please try again."],
  ])("says so when the reset is refused with %i", async (status, words) => {
    const { wrapper } = open();
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(status, {}));

    await wrapper.find("input[type=email]").setValue("asha@example.test");
    await forgot(wrapper).trigger("click");
    await flush();

    expect(wrapper.find("[role=status]").text()).toBe(words);
  });

  it("sends platform staff to the contact page instead: their accounts are not reset by mail", () => {
    portalFromHost.mockReturnValue("superadmin");
    const { wrapper } = open();

    expect(forgot(wrapper).exists()).toBe(false);
    expect(wrapper.find(".fx-signin__foot a").attributes("href")).toBe("https://main.test/contact-us");
    expect(wrapper.find(".fx-signin__switch").exists()).toBe(false);
  });
});

describe("the public header", () => {
  const open = async ({ signedIn = true, role = "user", token = "stored-token", verify = Promise.resolve({ data: {} }) } = {}) => {
    if (token) JwtService.saveToken(token);
    if (role) JwtService.saveRole(role);

    const logOut = jest.fn();
    const store = new Vuex.Store({ getters: { isAuthenticated: () => signedIn, currentUser: () => ({ name: "Asha" }) }, actions: { logOut } });
    const post = jest.spyOn(ApiService, "post").mockReturnValue(verify);
    jest.spyOn(ApiService, "setHeader").mockImplementation(() => {});
    const wrapper = mount(Header, { localVue, store, stubs: { RouterLink: true, AuthModals: true, BIcon: true }, mocks: { $route: { path: "/blog", query: {} } } });
    await flush();

    return { wrapper, post, logOut };
  };

  it("asks about a stored session once, and keeps the menu when it is good", async () => {
    const { post, logOut } = await open();

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/user/verify", { token: "stored-token" });
    expect(logOut).not.toHaveBeenCalled();
  });

  it("asks as platform staff for a staff session", async () => {
    const { post } = await open({ role: "superAdmin" });

    expect(post).toHaveBeenCalledWith("/superadmin/verify", { token: "stored-token" });
  });

  it("signs out, staying on the page, when the session has ended", async () => {
    const { logOut } = await open({ verify: Promise.reject(refused(401, { error: "Unauthorized" })) });

    expect(logOut).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["there is no answer", new Error("Network Error")],
    ["the server fails", refused(500, {})],
  ])("stays signed in when %s", async (_, error) => {
    const { logOut } = await open({ verify: Promise.reject(error) });

    expect(logOut).not.toHaveBeenCalled();
  });

  it("asks nothing when nobody is signed in", async () => {
    const { post } = await open({ signedIn: false, token: null, role: null });

    expect(post).not.toHaveBeenCalled();
  });
});

describe("the one-time code box nothing opened", () => {
  it("is gone from the sign-in box and the header", () => {
    expect(read("view/layouts/public/AuthModals.vue")).not.toMatch(/\botp|[-_]otp|Otp|OTP/);
    expect(read("view/layouts/public/Header.vue")).not.toMatch(/\botp|[-_]otp|Otp|OTP/);
  });
});
