import { shallowMount } from "@vue/test-utils";
import PortalSignIn from "@/view/pages/public/PortalSignIn.vue";

jest.mock("@/core/services/store/auth.module", () => ({ LOGIN: "login" }));

/**
 * Walk 4 #38: one session per person, and a newer sign-in ended the older one silently — the next page load dropped
 * to the sign-in form with no word about why. The check now answers `Signed_In_Elsewhere`, kept for this page.
 */
describe("PortalSignIn", () => {
  const signIn = (errors) => shallowMount(PortalSignIn, { mocks: { $store: { state: { auth: { errors } }, dispatch: jest.fn() } } });

  it("says why when a newer sign-in ended this session", () => {
    expect(signIn("Signed_In_Elsewhere").find("[role=alert]").text()).toMatch(/signed in somewhere else/);
  });

  it("opens clean otherwise", () => {
    expect(signIn({}).find("[role=alert]").exists()).toBe(false);
  });
});
