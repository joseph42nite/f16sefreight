/**
 * The overview, the monitor, suggestion feedback, the blog list and the staff account page, mounted (2026-11-15
 * frontend audit, tests: "the other admin pages are untested").
 */
import { mount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import { Form } from "vform";
import Swal from "sweetalert2";
import ApiService from "@/core/services/api.service";
import PlatformOverview from "@/view/pages/admin/PlatformOverview.vue";
import SuperadminMonitor from "@/view/pages/admin/SuperadminMonitor.vue";
import SuggestionFeedback from "@/view/pages/admin/SuggestionFeedback.vue";
import AllBlogs from "@/view/pages/admin/AllBlogs.vue";
import Account from "@/view/pages/admin/Account.vue";

jest.mock("sweetalert2", () => ({ fire: jest.fn() }));
// The auth store brings the router and the whole store with it; the page only needs the name of the action.
jest.mock("@/core/services/store/auth.module", () => ({ LOGOUT: "logOut" }));

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const button = (wrapper, text) => wrapper.findAll("button").wrappers.find((b) => b.text() === text);
const link = { props: ["to"], template: '<a :data-to="to"><slot /></a>' };
const chip = { props: ["value"], template: "<i>{{ value }}</i>" };

beforeAll(() => { window.Form = Form; });
afterEach(() => { jest.restoreAllMocks(); Swal.fire.mockReset(); });

describe("the platform overview", () => {
  const overview = (more = {}) => ({
    as_of: "2026-11-19T00:14:00Z",
    needs_you: [{ key: "tickets", count: 3, label: "open tickets", to: "/superadmin/support-desk" }],
    shipments: { total: 12, series: [{ name: "Kerala Lines", data: [] }] },
    mail: { series: [] },
    ai: { month_inr: 1250, budget_inr: 5000, days: [] },
    tickets: { weeks: [{ x: 1, opened: 0, resolved: 0 }] },
    signins: { total: 0, series: [{ name: "x", data: [] }] },
    errors: { total: 0, series: [] },
    ...more,
  });
  const open = async (answer = Promise.resolve({ data: overview() })) => {
    jest.spyOn(ApiService, "get").mockReturnValue(answer);
    const wrapper = mount(PlatformOverview, { stubs: { RouterLink: link, Figure: true, FxChart: { props: ["series", "title"], template: '<div class="chart" :data-series="JSON.stringify(series)">{{ title }}</div>' } } });
    await flush();

    return wrapper;
  };

  it("lists what is waiting, each a link to the page that clears it", async () => {
    const wrapper = await open();
    const item = wrapper.find(".fx-needs a");

    expect(item.text()).toBe("3 open tickets →");
    expect(item.attributes("data-to")).toBe("/superadmin/support-desk");
    expect(wrapper.text().replace(/\s+/g, " ")).toContain("₹1,250 of a ₹5,000 budget (25%)");
  });

  it("says nothing is waiting, and draws an empty chart where every figure is nought", async () => {
    const wrapper = await open(Promise.resolve({ data: overview({ needs_you: [], shipments: { total: 0, series: [{ name: "x", data: [] }] } }) }));
    const charts = wrapper.findAll(".chart").wrappers.map((c) => c.attributes("data-series"));

    expect(wrapper.text()).toContain("Nothing is waiting.");
    expect(charts[0]).toBe("[]");   // shipments
    expect(charts[3]).toBe("[]");   // tickets: all weeks nought
    expect(charts[4]).toBe("[]");   // sign-ins
  });

  it("does not divide by a budget of nought", async () => {
    const wrapper = await open(Promise.resolve({ data: overview({ ai: { month_inr: 80, budget_inr: 0, days: [] } }) }));

    expect(wrapper.text()).toContain("(0%)");
  });

  it("says why it could not be loaded, and draws nothing", async () => {
    const wrapper = await open(Promise.reject(refused(403, { message: "Staff only." })));

    expect(wrapper.find("[role=alert]").text()).toBe("Staff only.");
    expect(wrapper.find(".chart").exists()).toBe(false);
  });
});

describe("the platform monitor", () => {
  const health = {
    checked_at: "2026-11-19T00:14:00Z",
    database: { status: "up", latency_ms: 3 },
    redis: { status: "down", error: "connection refused" },
    queues: { status: "up", depths: { default: 2, ocr: 140 }, failed: 1 },
    ai_server: { status: "up", note: "gemma" },
    host: { status: "up", load_1m: 0.42 },
  };
  const open = async ({ month = { over_budget: false }, healthAnswer = Promise.resolve({ data: health }) } = {}) => {
    const get = jest.spyOn(ApiService, "get").mockImplementation((url) => {
      if (url === "/admin/health") return healthAnswer;
      if (url === "/admin/logs") return Promise.resolve({ data: { lines: ["one", "two"], path: "/var/log/laravel.log", size_mb: 12 } });

      return Promise.resolve({ data: { month } });
    });
    const wrapper = mount(SuperadminMonitor, { stubs: { RouterLink: link, Figure: true, StatusChip: chip } });
    await flush();

    return { wrapper, get };
  };

  it("shows each subsystem's own state, a dead one beside a live one", async () => {
    const { wrapper } = await open();
    const tiles = wrapper.findAll(".fx-tile").wrappers.map((t) => t.text().replace(/\s+/g, " "));

    expect(tiles).toEqual(["Database up 3 ms", "Redis down connection refused", "Queues up", "AI server up gemma", "Host up load 0.42"]);
  });

  it("gives each queue's depth, marks a deep one, and the failed jobs", async () => {
    const { wrapper } = await open();
    const rows = wrapper.findAll("tbody tr");

    expect(rows).toHaveLength(3);
    expect(rows.at(1).classes()).toContain("is-review");
    expect(rows.at(2).find(".fx-over").text()).toBe("1");
  });

  it("leaves the queue table out when the queues cannot be read", async () => {
    const { wrapper } = await open({ healthAnswer: Promise.resolve({ data: { ...health, queues: { status: "down", error: "no redis" } } }) });

    expect(wrapper.find("table").exists()).toBe(false);
    expect(wrapper.text()).toContain("no redis");
  });

  it("says when the AI budget is reached", async () => {
    const { wrapper } = await open({ month: { over_budget: true, spend_inr: 5200, budget_inr: 5000 } });

    expect(wrapper.find(".fx-warn").text()).toContain("Extraction is still running");
  });

  it("reads the log tail only when asked", async () => {
    const { wrapper, get } = await open();
    expect(get).not.toHaveBeenCalledWith("/admin/logs");

    await button(wrapper, "Read last 100 lines").trigger("click");
    await flush();

    expect(wrapper.find("pre").text()).toBe("one\ntwo");
    expect(wrapper.text()).toContain("/var/log/laravel.log · 12 MB");
  });

  it("says why the health check failed and lets it be tried again", async () => {
    const { wrapper, get } = await open({ healthAnswer: Promise.reject(refused(500, null)) });

    expect(wrapper.find("[role=alert]").text()).toBe("Something went wrong.");
    expect(button(wrapper, "Refresh").attributes("disabled")).toBeUndefined();

    await button(wrapper, "Refresh").trigger("click");
    expect(get.mock.calls.filter((c) => c[0] === "/admin/health")).toHaveLength(2);
  });
});

describe("suggestion feedback", () => {
  const feedback = {
    days: 90,
    reasons: { not_relevant: "Not relevant", already_done: "Already done" },
    by_type: [
      { type: "client_reactivation", sent: 8, dismissed: 2, dismissed_percent: 20 },
      { type: "something_new", sent: 0, dismissed: 0, dismissed_percent: null },
    ],
    reasons_by_type: { client_reactivation: { not_relevant: 1, other_reason: 1 } },
    recent: [{ id: 1, dismissed_at: "2026-11-17T09:31:22Z", company: "Kerala Lines", tier: "command", mode: "air", type: "client_rate_review", facts: { lost_quotes: 3, lanes: ["COK-DXB", "COK-LHR"] }, reason: "already_done", note: "called them" }],
  };

  it("shows each suggestion with why it was dismissed, in the Sales page's words", async () => {
    jest.spyOn(ApiService, "get").mockResolvedValue({ data: feedback });
    const wrapper = mount(SuggestionFeedback);
    await flush();
    const rows = wrapper.findAll("table").at(0).findAll("tbody tr");

    expect(rows.at(0).text().replace(/\s+/g, " ")).toContain("Stopped shipping 8 2 20% Not relevant: 1 other_reason: 1");
    expect(rows.at(1).text().replace(/\s+/g, " ")).toContain("something_new 0 0 —");
    expect(wrapper.findAll("table").at(1).text().replace(/\s+/g, " ")).toContain("2026-11-17 Kerala Lines · command · air Lost on price lost quotes: 3lanes: COK-DXB, COK-LHR Already done — called them");
  });

  it("says why it could not be loaded", async () => {
    jest.spyOn(ApiService, "get").mockRejectedValue(refused(500, null));
    const wrapper = mount(SuggestionFeedback);
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("Could not load the feedback.");
    expect(wrapper.text()).not.toContain("Loading…");
  });
});

describe("the blog list", () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  const blogs = [
    { id: 1, title: "Air freight basics", slug: "air-freight-basics", category: "Air", read_time: "4 min", views_count: 12, published_at: "2026-10-01T00:00:00Z", image_path: "/img/a.jpg" },
    { id: 2, title: "A draft", slug: "a-draft", category: "Sea", read_time: "2 min", views_count: null, published_at: null, image_path: null },
  ];
  const open = async (answer = { success: true, data: blogs }) => {
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: answer });
    const wrapper = mount(AllBlogs, { localVue, stubs: { RouterLink: link, SkeletonTable: true } });
    await flush();

    return { wrapper, get };
  };

  it("lists the blogs, a draft marked as one", async () => {
    const { wrapper, get } = await open();
    const rows = wrapper.findAll("tbody tr");

    expect(get).toHaveBeenCalledWith("/superadmin/all-blogs-internal");
    expect(rows).toHaveLength(2);
    expect(rows.at(0).text()).toContain("Published");
    expect(rows.at(0).text()).toContain("Oct 1, 2026");
    expect(rows.at(1).text()).toContain("Draft");
    expect(rows.at(1).text()).toContain("No Image");
  });

  it("shows an empty list when the server says it did not succeed", async () => {
    const { wrapper } = await open({ success: false });

    expect(wrapper.text()).toContain("No blogs found in the database yet.");
  });

  it("copies the public address of a post", async () => {
    const { wrapper } = await open();
    const writeText = jest.fn(() => Promise.resolve());
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    jest.spyOn(wrapper.vm.$bvToast, "toast").mockImplementation(() => {});

    wrapper.vm.copyShareableLink(blogs[0]);
    await flush();

    expect(writeText).toHaveBeenCalledWith(window.location.origin + "/blog/air-freight-basics");
    expect(wrapper.vm.$bvToast.toast).toHaveBeenCalled();
  });

  it("deletes only after a yes, then reloads", async () => {
    const { wrapper, get } = await open();
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({ data: {} });

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    wrapper.vm.confirmDelete(blogs[0]);
    await flush();
    expect(remove).not.toHaveBeenCalled();

    Swal.fire.mockResolvedValue({ isConfirmed: true });
    wrapper.vm.confirmDelete(blogs[0]);
    await flush();
    expect(remove).toHaveBeenCalledWith("/superadmin/delete-blog/1");
    expect(get).toHaveBeenCalledTimes(2);
  });

  it("gives the server's reason when a delete is refused", async () => {
    const { wrapper, get } = await open();
    jest.spyOn(ApiService, "delete").mockRejectedValue(refused(409, { error: "This post is linked from the home page." }));
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    wrapper.vm.confirmDelete(blogs[0]);
    await flush();

    expect(Swal.fire).toHaveBeenLastCalledWith("Not deleted", "This post is linked from the home page.", "error");
    expect(get).toHaveBeenCalledTimes(1);
  });
});

describe("the staff account page", () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  const open = () => {
    const dispatch = jest.fn(() => Promise.resolve());
    const push = jest.fn(() => Promise.resolve());
    const wrapper = mount(Account, { localVue, mocks: { $store: { getters: { currentUser: { name: "F16s Staff", email: "staff@f16s.test" } }, dispatch }, $router: { push } } });

    return { wrapper, dispatch, push };
  };
  const forms = (wrapper) => wrapper.findAll("form");

  it("opens with the signed-in person's name, and an email that cannot be typed over", async () => {
    const { wrapper } = open();
    await wrapper.vm.$nextTick();
    const boxes = forms(wrapper).at(0).findAll("input");

    expect(boxes.at(0).element.value).toBe("F16s Staff");
    expect(boxes.at(1).element.value).toBe("staff@f16s.test");
    expect(boxes.at(1).attributes("readonly")).toBeDefined();
  });

  it("saves the name and says so", async () => {
    const { wrapper } = open();
    const put = jest.spyOn(ApiService, "put").mockResolvedValue({ data: {} });

    await forms(wrapper).at(0).findAll("input").at(0).setValue("New Name");
    await forms(wrapper).at(0).trigger("submit");
    await flush();

    expect(put.mock.calls[0][0]).toBe("/superadmin/upadte-detail");
    expect(put.mock.calls[0][1].name).toBe("New Name");
    expect(wrapper.text()).toContain("Saved Successfully");
    expect(wrapper.vm.isSavingProfile).toBe(false);
  });

  it("says why the name was not saved (FA8)", async () => {
    const { wrapper } = open();
    jest.spyOn(ApiService, "put").mockRejectedValue(refused(422, { errors: { name: ["The name is too long."] } }));

    await forms(wrapper).at(0).trigger("submit");
    await flush();

    expect(forms(wrapper).at(0).find("[role=alert]").text()).toBe("The name is too long.");
    expect(wrapper.text()).not.toContain("Saved Successfully");
    expect(wrapper.vm.isSavingProfile).toBe(false);
  });

  it("signs out after a password change and goes to the sign-in page (FA9)", async () => {
    const { wrapper, dispatch, push } = open();
    const put = jest.spyOn(ApiService, "put").mockResolvedValue({ data: {} });

    await forms(wrapper).at(1).trigger("submit");
    await flush();

    expect(put.mock.calls[0][0]).toBe("/superadmin/update-password");
    expect(dispatch).toHaveBeenCalledWith("logOut");
    expect(push).toHaveBeenCalledWith("/sign-in");
  });

  it("stays signed in and says why when the password is refused", async () => {
    const { wrapper, dispatch } = open();
    jest.spyOn(ApiService, "put").mockRejectedValue(refused(422, { errors: { current_password: ["That is not your current password."] } }));

    await forms(wrapper).at(1).trigger("submit");
    await flush();

    expect(forms(wrapper).at(1).find("[role=alert]").text()).toBe("That is not your current password.");
    expect(dispatch).not.toHaveBeenCalled();
    expect(wrapper.vm.isUpdatingPass).toBe(false);
  });
});
