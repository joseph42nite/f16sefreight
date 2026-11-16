/**
 * Sign-in, session and error handling (2026-11-15 frontend audit, FK1–FK7). `sessionEnded`, the header and the shared
 * `/me` are run here; the guard and the store are run in authGuard.spec.js and authStore.spec.js.
 */
import Vue from "vue";
import ApiService, { sessionEnded } from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
import { getMe, forgetMe } from "@/core/services/me";

const fs = require("fs");
const path = require("path");
const read = (file) => fs.readFileSync(path.join(__dirname, "../..", file), "utf8");
const refused = (status, url) => ({ response: { status, data: {} }, config: { url } });

describe("sessionEnded (FK2)", () => {
  it("is a 401 on an ordinary call while a token is held", () => {
    expect(sessionEnded(refused(401, "/jobs"), "tok", "user")).toBe(true);
    expect(sessionEnded(refused(401, "/superadmin/airlines"), "tok", "superAdmin")).toBe(true);
  });

  it("is not any other refusal, or one with nobody signed in", () => {
    expect(sessionEnded(refused(403, "/jobs"), "tok", "user")).toBe(false);
    expect(sessionEnded(refused(422, "/jobs"), "tok", "user")).toBe(false);
    expect(sessionEnded(refused(401, "/jobs"), null, null)).toBe(false);
    expect(sessionEnded(refused(401, "/jobs"), "undefined", "user")).toBe(false);
    expect(sessionEnded(new Error("Network Error"), "tok", "user")).toBe(false);
  });

  it.each(["/login", "/user/verify", "/user/logout", "/superadmin/logout", "/check-forgot-token", "/ForgotpasswordActual"])(
    "is not %s, which answers 401 for its own reasons", (url) => {
      expect(sessionEnded(refused(401, url), "tok", "user")).toBe(false);
    });

  it("is not a platform route asked by a tenant", () => {
    expect(sessionEnded(refused(401, "/superadmin/all-user/0"), "tok", "user")).toBe(false);
  });
});

describe("the Authorization header (FK3)", () => {
  afterEach(() => jest.restoreAllMocks());

  it("is the token, and is taken off when there is none", () => {
    Vue.axios = { defaults: { headers: { common: {} } } };

    jest.spyOn(JwtService, "getToken").mockReturnValue("abc");
    ApiService.setHeader();
    expect(Vue.axios.defaults.headers.common.Authorization).toBe("Bearer abc");

    JwtService.getToken.mockReturnValue(null);
    ApiService.setHeader();
    expect("Authorization" in Vue.axios.defaults.headers.common).toBe(false);
  });
});

describe("the shared /me (FK4)", () => {
  it("is asked again after a sign-out", () => {
    const get = jest.spyOn(ApiService, "get").mockImplementation(() => Promise.resolve({ data: {} }));

    getMe({ fresh: true });
    getMe();
    expect(get).toHaveBeenCalledTimes(1);

    forgetMe();
    getMe();
    expect(get).toHaveBeenCalledTimes(2);
    get.mockRestore();
  });
});

describe("a call that says the session is over (FK2)", () => {
  // The guard and the store are run in authGuard.spec.js and authStore.spec.js; this wiring lives in main.js, which
  // starts the whole app when loaded, so it is read.
  it("signs the person out", () => {
    expect(read("resources/js/src/main.js")).toMatch(/ApiService\.onUnauthorized = \(reason\) => \{\s+store\.dispatch\(LOGOUT\)/);
  });
});

describe("smaller ones", () => {
  it("the document reader stops asking and says why (FK6)", () => {
    const modal = read("resources/js/src/view/components/OcrUploadModal.vue");

    expect(modal).toMatch(/if \(asked > 375\)/);
    expect(modal).toMatch(/giveUp\('The reading could not be checked'/);
  });

  it("the page shell versions every stylesheet and advertises no search page (FK7)", () => {
    const shell = read("resources/views/welcome.blade.php");

    expect(shell).not.toMatch(/href="\/(vendor|common)\.css"/);
    expect(shell).toMatch(/mix\('\/vendor\.css'\)/);
    expect(shell).not.toMatch(/SearchAction/);
  });
});
