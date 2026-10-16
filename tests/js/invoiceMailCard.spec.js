import { mount } from "@vue/test-utils";
import InvoiceMailCard from "@/view/pages/freight/components/InvoiceMailCard.vue";

/** The invoice mail (owner, 2026-10-10): accounts read and change the draft, then send it or skip it. */
const WAITING = {
  state: "waiting", to: ["finance@globex.test"], cc: [],
  subject: "Invoice INV-DEMOBOM-26-0121 · AWB 176-60604111", body: "Hello,\n\nPlease find attached…",
};

describe("InvoiceMailCard", () => {
  it("sends what the person left in the boxes", async () => {
    const wrapper = mount(InvoiceMailCard, { propsData: { mail: WAITING } });
    await wrapper.findAll("input").at(1).setValue("shipping@globex.test; ap@globex.test");
    await wrapper.find(".fx-btn--primary").trigger("click");

    expect(wrapper.emitted("decide")[0][0]).toEqual({
      decision: "send", to: ["finance@globex.test"], cc: ["shipping@globex.test", "ap@globex.test"],
      subject: WAITING.subject, body: WAITING.body,
    });
  });

  it("will not send to nobody", async () => {
    const wrapper = mount(InvoiceMailCard, { propsData: { mail: { ...WAITING, to: [] } } });
    expect(wrapper.find(".fx-btn--primary").attributes("disabled")).toBe("disabled");
  });

  it("says what became of it once decided", () => {
    const wrapper = mount(InvoiceMailCard, { propsData: { mail: { ...WAITING, state: "sent", by_name: "Asha" } } });
    expect(wrapper.text()).toContain("Sent by Asha");
    expect(wrapper.find("button").exists()).toBe(false);
  });
});
