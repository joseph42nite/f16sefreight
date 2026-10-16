import { shallowMount } from "@vue/test-utils";
import CloseMonth from "@/view/pages/freight/CloseMonth.vue";

jest.mock("@/core/services/api.service", () => ({
  get: jest.fn(() => new Promise(() => {})), query: jest.fn(() => new Promise(() => {})), post: jest.fn(),
}));

/** Walk 7: the headline read "Clear Everything posted? before FY26 can close." — the step's title dropped mid-sentence. */
describe("CloseMonth headline", () => {
  it("names the blocking step as a step", async () => {
    const wrapper = shallowMount(CloseMonth, { mocks: { $route: { query: {} }, $router: { replace: jest.fn() } } });
    wrapper.setData({ period: { period_name: "FY26", status: "open" }, canClose: false, blockedBy: "Everything posted?" });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.subtitle).toBe("Clear “Everything posted?” before FY26 can close.");
  });
});
