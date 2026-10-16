import { shallowMount } from "@vue/test-utils";
import MailboxWelcome from "@/view/pages/freight/components/MailboxWelcome.vue";
import ApiService from "@/core/services/api.service";
import { getMe } from "@/core/services/me";

jest.mock("@/core/services/api.service", () => ({ post: jest.fn() }));
jest.mock("@/core/services/me", () => ({ getMe: jest.fn() }));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Walk 3 #27: the Connect button read "Opening Microsoft…" on Admin → Financials although nobody clicked Connect —
 * only "Later" had been asked. Both buttons shared one `busy` flag, so waiting on Later relabelled Connect.
 */
describe("MailboxWelcome", () => {
  beforeEach(() => {
    getMe.mockReset().mockResolvedValue({ data: { mailbox: { ask: true, connected: false } } });
    ApiService.post.mockReset().mockReturnValue(new Promise(() => {})); // still waiting
  });

  const mounted = async () => {
    const wrapper = shallowMount(MailboxWelcome, { mocks: { $route: { path: "/" } } });
    await flush();
    return wrapper;
  };

  it("does not say it is opening Microsoft while Later is being saved", async () => {
    const wrapper = await mounted();
    const [later, connect] = wrapper.findAll(".fx-modal__foot button").wrappers;

    await later.trigger("click");

    expect(ApiService.post).toHaveBeenCalledWith("/user/mailbox-prompt/later");
    expect(connect.text()).toBe("Connect Outlook");
    expect(later.attributes("disabled")).toBe("disabled");
  });

  it("says so when Connect is the one clicked", async () => {
    const wrapper = await mounted();
    const connect = wrapper.findAll(".fx-modal__foot button").at(1);

    await connect.trigger("click");

    expect(connect.text()).toBe("Opening Microsoft…");
  });
});
