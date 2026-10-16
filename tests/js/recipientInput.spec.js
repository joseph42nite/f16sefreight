import { mount } from "@vue/test-utils";
import RecipientInput from "@/view/pages/freight/components/RecipientInput.vue";
import ApiService from "@/core/services/api.service";

jest.mock("@/core/services/api.service", () => ({ query: jest.fn() }));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * To / CC suggestions (owner, 2026-10-10): typing a name — "@raj" or just "raj" — shows a small list of colleagues and
 * people we have mailed; picking one writes the address. The ones this person picks most come first next time.
 */
describe("RecipientInput", () => {
  const SUGGESTIONS = [
    { name: "Raj Contoso", email: "raj@contoso.test", kind: "mailed" },
    { name: "Rajesh Kumar", email: "rajesh@globex.test", kind: "mailed" },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
    ApiService.query.mockReset().mockResolvedValue({ data: { suggestions: SUGGESTIONS } });
  });
  afterEach(() => jest.useRealTimers());

  const typed = async (text, value = "") => {
    const wrapper = mount(RecipientInput, { propsData: { value } });
    await wrapper.find("input").setValue(text);
    jest.advanceTimersByTime(250);
    jest.useRealTimers();
    await flush();
    await wrapper.vm.$nextTick();
    return wrapper;
  };

  it("looks up the name being typed after the last comma, with or without @", async () => {
    const wrapper = await typed("ops@northwind.test, @raj");

    expect(ApiService.query).toHaveBeenCalledWith("/inbox/address-book", { params: { q: "raj" } });
    expect(wrapper.findAll("[role=option]").length).toBe(2);
  });

  it("writes the picked address in place of what was typed", async () => {
    const wrapper = await typed("ops@northwind.test, @raj");
    await wrapper.findAll("[role=option]").at(1).trigger("mousedown");

    expect(wrapper.emitted("input").pop()[0]).toBe("ops@northwind.test, rajesh@globex.test, ");
  });

  it("puts what this person picks most first", async () => {
    window.localStorage.setItem("fx.recipientPicks", JSON.stringify({ "rajesh@globex.test": 3 }));
    const wrapper = await typed("raj");

    expect(wrapper.findAll("[role=option]").at(0).text()).toContain("rajesh@globex.test");
  });

  it("asks nothing for a full address or an empty box", async () => {
    await typed("someone@client.test");
    await typed("ops@northwind.test, ");
    expect(ApiService.query).not.toHaveBeenCalled();
  });
});
