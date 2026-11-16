/**
 * The password reset page, mounted (2026-11-15 frontend audit, tests section: "no test for password reset").
 * It is the page the link in the reset mail opens.
 */
import { mount } from "@vue/test-utils";
import axios from "axios";
import PasswordForgotForm from "@/view/pages/public/PasswordForgotForm.vue";

jest.mock("axios");

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const open = async () => {
  const wrapper = mount(PasswordForgotForm, {
    mocks: { $route: { params: { token: "one-time-token", email: "asha@client.test", userType: "user" } } },
    stubs: { "router-link": true },
  });
  await flush();

  return wrapper;
};

afterEach(() => jest.resetAllMocks());

it("checks the link first and shows the form for a good one", async () => {
  axios.post.mockResolvedValue({ data: { status: true } });
  const wrapper = await open();

  expect(axios.post).toHaveBeenCalledWith("/check-forgot-token", { token: "one-time-token", email: "asha@client.test" });
  expect(wrapper.find("form").exists()).toBe(true);
  expect(wrapper.find("#email").element.value).toBe("asha@client.test");
});

it.each([
  ["the server says the link is not good", () => Promise.resolve({ data: { status: false } })],
  ["the check fails", () => Promise.reject(new Error("Network Error"))],
])("shows no form when %s", async (name, answer) => {
  axios.post.mockImplementation(answer);
  const wrapper = await open();

  expect(wrapper.find("form").exists()).toBe(false);
  expect(wrapper.text()).toContain("Forgot password token is invalid");
});

it("sends the new password with the token and says it worked", async () => {
  axios.post.mockResolvedValue({ data: { status: true } });
  const wrapper = await open();

  await wrapper.find("#password").setValue("new-pass-1");
  await wrapper.find("#password_confirmation").setValue("new-pass-1");
  await wrapper.find("form").trigger("submit");
  await flush();

  expect(axios.post).toHaveBeenLastCalledWith("/ForgotpasswordActual", {
    email: "asha@client.test", userType: "user", password: "new-pass-1", password_confirmation: "new-pass-1", token: "one-time-token",
  });
  expect(wrapper.text()).toContain("Password reset successful");
});

it("says why a reset was refused (FA8)", async () => {
  axios.post.mockResolvedValueOnce({ data: { status: true } });
  const wrapper = await open();
  axios.post.mockRejectedValueOnce({ response: { status: 422, data: { errors: { password: ["The password must be at least 6 characters."] } } } });

  await wrapper.find("#password").setValue("four");
  await wrapper.find("#password_confirmation").setValue("four");
  await wrapper.find("form").trigger("submit");
  await flush();

  expect(wrapper.find("[role=alert]").text()).toBe("The password must be at least 6 characters.");
  expect(wrapper.text()).not.toContain("Password reset successful");
});
