import { mount } from "@vue/test-utils";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";

/*
 * Escape closes a drawer even when focus has fallen to <body> — which is where a
 * button that disables itself while it works (the Boss's Redraft and Send) leaves it.
 */
const escape = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

describe("FxDrawer — Escape", () => {
  let wrapper;
  afterEach(() => wrapper && wrapper.destroy());

  it("closes when focus is on nothing", async () => {
    wrapper = mount(FxDrawer, { propsData: { open: false, title: "Draft" }, attachTo: document.body });
    await wrapper.setProps({ open: true });
    document.activeElement.blur();

    escape();

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("leaves a control on the page behind its own Escape", async () => {
    const behind = document.createElement("input");
    document.body.appendChild(behind);
    wrapper = mount(FxDrawer, { propsData: { open: false, title: "Draft" }, attachTo: document.body });
    await wrapper.setProps({ open: true });
    behind.focus();

    escape();

    expect(wrapper.emitted("close")).toBeFalsy();
    behind.remove();
  });

  it("stops listening once closed", async () => {
    wrapper = mount(FxDrawer, { propsData: { open: false, title: "Draft" }, attachTo: document.body });
    await wrapper.setProps({ open: true });
    await wrapper.setProps({ open: false });
    document.activeElement.blur();

    escape();

    expect(wrapper.emitted("close")).toBeFalsy();
  });
});
