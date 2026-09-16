import { mount } from "@vue/test-utils";
import StaffPicker from "@/view/pages/freight/components/StaffPicker.vue";

/** Assign to…: type a name, the matches narrow, pick one (user, 2026-09-16). */
describe("StaffPicker", () => {
  const options = [
    { id: 1, name: "Priya Nair", email: "priya@demo.test" },
    { id: 2, name: "Arjun Mehta", email: "arjun@demo.test" },
    { id: 3, name: "Karthik Raman", email: "karthik@demo.test" },
  ];
  const shown = (wrapper) => wrapper.findAll(".fx-picker__option").wrappers.map((o) => o.text().split(" · ")[0]);

  it("lists everyone on focus and narrows as a name is typed", async () => {
    const wrapper = mount(StaffPicker, { propsData: { options }, attachTo: document.body });
    const input = wrapper.find("input");

    await input.trigger("focus");
    expect(shown(wrapper)).toEqual(["Priya Nair", "Arjun Mehta", "Karthik Raman"]);

    await input.setValue("ar");
    expect(shown(wrapper)).toEqual(["Arjun Mehta", "Karthik Raman"]);

    // Every word must match, in any order, in the name or the email.
    await input.setValue("raman kar");
    expect(shown(wrapper)).toEqual(["Karthik Raman"]);

    await input.setValue("zed");
    expect(wrapper.find(".fx-picker__empty").exists()).toBe(true);
  });

  it("picks with the keyboard or the mouse", async () => {
    const wrapper = mount(StaffPicker, { propsData: { options }, attachTo: document.body });
    const input = wrapper.find("input");

    await input.setValue("a");
    await wrapper.trigger("keydown.down");
    await wrapper.trigger("keydown.enter");
    expect(wrapper.emitted("select")[0][0].id).toBe(2);

    await input.setValue("priya");
    await wrapper.find(".fx-picker__option").trigger("mousedown");
    expect(wrapper.emitted("select")[1][0].id).toBe(1);
  });
});
