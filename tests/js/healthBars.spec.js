import { mount } from "@vue/test-utils";
import HealthBars from "@/view/pages/freight/components/HealthBars.vue";

/** PRD §7.3.4 H: the component bars, never the bare number; a part with no data reads "—", not an empty bar. */
describe("HealthBars", () => {
  const wrapper = mount(HealthBars, { propsData: {
    score: 35.56,
    parts: { momentum: 0, churn: 0, win_rate: 1, payment: 0.8, ops: null },
  } });
  const rows = () => wrapper.findAll(".fx-health__row").wrappers.map((r) => r.text().replace(/\s+/g, " ").trim());

  it("shows the score with every part beside it", () => {
    expect(wrapper.find(".fx-health__score").text()).toBe("36");
    expect(rows()).toEqual(["Trend 0", "Rhythm 0", "Win rate 100", "Pays 80", "Our ops —"]);
  });

  it("draws each bar to its part, and none for a part with no data", () => {
    const widths = wrapper.findAll(".fx-health__fill").wrappers.map((f) => f.element.style.width);
    expect(widths).toEqual(["0%", "0%", "100%", "80%"]);
  });

  it("says so when there is no score", () => {
    const empty = mount(HealthBars, { propsData: { score: null, parts: { momentum: null, churn: null, win_rate: null, payment: 0.8, ops: null } } });
    expect(empty.find(".fx-health__score").text()).toBe("—");
  });
});
