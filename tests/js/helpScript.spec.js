/**
 * Help without AI (owner, 2026-11-21): written messages and buttons that end at a person, in the support chat or
 * through the flag. Also closes FS5 of the 2026-11-15 frontend audit: nothing a model wrote is put into the page.
 */
import fs from "fs";
import path from "path";
import { mount } from "@vue/test-utils";
import ApiService from "@/core/services/api.service";
import { HELP_SCRIPT } from "@/core/config/helpScript";
import HelpAssistant from "@/view/pages/freight/components/HelpAssistant.vue";
import HomeNewsSection from "@/view/pages/public/components/HomeNewsSection.vue";
import { tourSteps, TOUR_PAGES, TOUR_FIXED, TOUR_WELCOME } from "@/core/config/tour";
import { NAV_ITEMS } from "@/core/config/navigation";

const mockDrive = jest.fn();
const mockDriver = jest.fn(() => ({ drive: mockDrive }));
jest.mock("driver.js", () => ({ driver: (...args) => mockDriver(...args) }));

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");
const flush = async () => { for (let i = 0; i < 6; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };

afterEach(() => jest.restoreAllMocks());

describe("the written help messages", () => {
  it("every button leads to another message, the support chat or the flag", () => {
    Object.entries(HELP_SCRIPT).forEach(([name, step]) => {
      expect(step.says.length).toBeGreaterThan(10);
      expect(step.options.length).toBeGreaterThan(0);
      step.options.forEach((option) => {
        if (option.action) expect(["connect", "flag", "tour"]).toContain(option.action);
        else expect(Object.keys(HELP_SCRIPT)).toContain(option.next);
        expect(name + option.label).toBeTruthy();
      });
    });
  });

  it("every message is at most two buttons from a person", () => {
    const reaches = (name, depth) => HELP_SCRIPT[name].options.some((o) => o.action || (depth > 1 && o.next !== "start" && reaches(o.next, depth - 1)));

    Object.keys(HELP_SCRIPT).forEach((name) => expect(reaches(name, 2)).toBe(true));
  });

  it("says at the start that it is not a person", () => {
    expect(HELP_SCRIPT.start.says).toContain("automated helper, not a person");
  });
});

describe("the Help panel", () => {
  const open = async ({ post = jest.fn(() => Promise.resolve({ data: { id: 9, status: "open", unread: 0, messages: [] } })) } = {}) => {
    jest.spyOn(ApiService, "get").mockImplementation((url) => Promise.resolve({ data: url === "/tour" ? { seen: true } : { chat: null, messages: [], status: "open" } }));
    jest.spyOn(ApiService, "post").mockImplementation(post);
    const wrapper = mount(HelpAssistant, { mocks: { $route: { path: "/kanban" } } });
    await wrapper.find(".fx-help__launch").trigger("click");

    return { wrapper, post };
  };
  const press = async (wrapper, label) => {
    await wrapper.findAll(".fx-help__log .fx-help__actions button").wrappers.find((b) => b.text() === label).trigger("click");
    await flush();
  };
  const said = (wrapper) => wrapper.findAll(".fx-help__msg").wrappers.map((m) => m.text());

  afterEach(() => jest.clearAllTimers());

  it("opens on the first message and its buttons, with no box to type a question", async () => {
    const { wrapper } = await open();

    expect(said(wrapper)).toEqual([HELP_SCRIPT.start.says]);
    expect(wrapper.findAll(".fx-help__log .fx-help__actions button").wrappers.map((b) => b.text())).toEqual(HELP_SCRIPT.start.options.map((o) => o.label));
    expect(wrapper.find("textarea").exists()).toBe(false);
    wrapper.destroy();
  });

  it("says the choice back, then the next message", async () => {
    const { wrapper } = await open();

    await press(wrapper, "I have a question");

    expect(said(wrapper)).toEqual([HELP_SCRIPT.start.says, "I have a question", "What is it about?"]);
    expect(wrapper.findAll(".fx-help__msg--user").length).toBe(1);
    wrapper.destroy();
  });

  it("connects to a person with what it is about, so nothing is explained twice", async () => {
    const { wrapper, post } = await open();

    await press(wrapper, "I have a question");
    await press(wrapper, "Billing and accounts");
    await press(wrapper, "Connect me");

    const [url, body] = post.mock.calls[0];
    expect(url).toBe("/support/chats");
    expect(body.route).toBe("/kanban");
    expect(body.help_transcript[0]).toEqual({ question: "What is it about?", answer: "Billing and accounts" });
    expect(body.help_transcript.map((t) => t.question)).toEqual(["What is it about?", "I have a question", "Billing and accounts", "Connect me"]);
    body.help_transcript.forEach((t) => { expect(t.question).toBeTruthy(); expect(t.answer).toBeTruthy(); });
    expect(wrapper.vm.mode).toBe("chat");
    wrapper.destroy();
  });

  it("hands the flag what was chosen, and closes", async () => {
    const { wrapper, post } = await open();

    await press(wrapper, "Something on screen looks wrong");
    await press(wrapper, "⚑ Flag what is wrong");

    expect(wrapper.emitted("raise-ticket")[0][0].map((t) => t.question)).toEqual(["Something on screen looks wrong", "⚑ Flag what is wrong"]);
    expect(wrapper.vm.open).toBe(false);
    expect(post).not.toHaveBeenCalled();
    wrapper.destroy();
  });

  it("starts again with the topic forgotten", async () => {
    const { wrapper } = await open();

    await press(wrapper, "I have a question");
    await press(wrapper, "Mail and the inbox");
    await press(wrapper, "Start again");

    expect(wrapper.vm.topic).toBeNull();
    expect(wrapper.vm.stepName).toBe("start");
    wrapper.destroy();
  });

  it("says so when the support team cannot be reached", async () => {
    const { wrapper } = await open({ post: jest.fn(() => Promise.reject(Object.assign(new Error("no"), { response: { status: 500, data: {} } }))) });

    await press(wrapper, "Talk to a person");
    await press(wrapper, "Connect me");

    expect(wrapper.find(".fx-error").text()).toBe("Could not reach the support team. Raise a ticket instead.");
    expect(wrapper.vm.mode).toBe("help");
    wrapper.destroy();
  });

  it("asks no model and writes no outside text into the page (FS5)", () => {
    const source = read("view/pages/freight/components/HelpAssistant.vue");

    expect(source).not.toMatch(/help\/ask|v-html|innerHTML/);
    // The boxes of the tour are drawn by a library that writes its text as HTML: only the app's own words go in.
    expect(source).toContain("const steps = tourSteps();");
    expect(read("core/config/tour.js")).not.toMatch(/innerText|textContent|ApiService|\$store/);
  });
});

describe("the home page's blog tiles", () => {
  const live = { success: true, data: [{ slug: "live-one", title: "Live", category: "Air", image_path: "/a.jpg", read_time: "4 min", published_at: "2026-11-01T00:00:00Z" }] };
  const open = async (answer) => {
    jest.spyOn(ApiService, "get").mockImplementation(answer);
    const wrapper = mount(HomeNewsSection, { stubs: { RouterLink: true, LpButton: true, BIcon: true } });
    const bundled = jest.spyOn(wrapper.vm, "loadBundled");
    await flush();

    return { wrapper, bundled };
  };

  it("show the live posts without fetching the bundled articles", async () => {
    const { wrapper } = await open(() => Promise.resolve({ data: live }));

    expect(wrapper.vm.posts.map((p) => p.slug)).toEqual(["live-one"]);
    expect(wrapper.vm.posts[0]).toMatchObject({ image: "/a.jpg", readTime: "4 min" });
    expect(wrapper.vm.loaded).toBe(true);
  });

  it.each([
    ["the server has none", () => Promise.resolve({ data: { success: true, data: [] } })],
    ["the server does not answer", () => Promise.reject(new Error("Network Error"))],
  ])("fall back to the bundled articles when %s", async (_, answer) => {
    const { wrapper } = await open(answer);

    expect(wrapper.vm.posts.length).toBeGreaterThan(0);
    expect(wrapper.vm.loaded).toBe(true);
  });

  it("keep the articles out of the home page's own script", () => {
    const source = read("view/pages/public/components/HomeNewsSection.vue");

    expect(source).not.toMatch(/^import .*blogData/m);
    expect(source).toContain('import(/* webpackChunkName: "blog-data" */ "../blogData")');
  });
});

describe("the tour of the portal", () => {
  const shell = (paths) => {
    document.body.innerHTML = `
      <aside class="fx-rail"><nav class="fx-rail__nav">${paths.map((p) => `<a class="fx-rail__item" href="${p}">x</a>`).join("")}</nav>
        <button class="fx-help__launch">Help</button></aside>
      <header><button class="fx-header__toggle"></button><span class="fx-portal-chip"></span>
        <button class="fx-bell__trigger"></button><button class="fx-profile__trigger"></button></header>`;
    // jsdom lays nothing out: an element counts as on screen unless it is marked hidden here.
    document.querySelectorAll("*").forEach((el) => { el.getClientRects = () => (el.hasAttribute("data-hidden") ? [] : [{}]); });
  };

  beforeEach(() => { mockDriver.mockClear(); mockDrive.mockClear(); });
  afterEach(() => { document.body.innerHTML = ""; });

  it("has words for every page a menu can show", () => {
    NAV_ITEMS.forEach((item) => expect(Object.keys(TOUR_PAGES)).toContain(item.path));
    expect(TOUR_PAGES["/settings"]).toBeTruthy();
  });

  it("starts with a welcome, then the menu from the top, then the header and Help", () => {
    shell(["/inbox", "/kanban", "/settings"]);

    const steps = tourSteps();

    expect(steps.map((s) => s.popover.title)).toEqual([TOUR_WELCOME.title, "Inbox", "Board", "Settings", ...TOUR_FIXED.map((p) => p.title)]);
    expect(steps[0].element).toBeUndefined();
    expect(steps[1].element.getAttribute("href")).toBe("/inbox");
  });

  it("describes only what is on this person's menu and on screen", () => {
    shell(["/today", "/not-a-page"]);
    document.querySelector(".fx-portal-chip").setAttribute("data-hidden", "");

    const titles = tourSteps().map((s) => s.popover.title);

    expect(titles).toContain("Today");
    expect(titles).not.toContain("Inbox");
    expect(titles).not.toContain("Which portal you are in");
    expect(titles.length).toBe(1 + 1 + TOUR_FIXED.length - 1);
  });

  const helper = async (seen) => {
    const get = jest.spyOn(ApiService, "get").mockImplementation((url) => Promise.resolve({ data: url === "/tour" ? { seen } : { chat: null } }));
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: { seen: true } });
    jest.useFakeTimers();
    const wrapper = mount(HelpAssistant, { mocks: { $route: { path: "/kanban" } } });
    const settle = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
    await settle();

    return { wrapper, get, post, settle };
  };

  afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

  it("is shown on its own to someone who has not seen it, and the account is told when it ends", async () => {
    shell(["/inbox"]);
    const { wrapper, get, post, settle } = await helper(false);

    expect(get).toHaveBeenCalledWith("/tour");
    expect(mockDriver).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    await settle();

    expect(mockDriver).toHaveBeenCalledTimes(1);
    expect(mockDrive).toHaveBeenCalledTimes(1);
    const options = mockDriver.mock.calls[0][0];
    expect(options).toMatchObject({ showProgress: true, nextBtnText: "Next", prevBtnText: "Back", doneBtnText: "Done" });
    expect(options.steps.length).toBe(2 + TOUR_FIXED.length);

    expect(post).not.toHaveBeenCalled();
    options.onDestroyed();
    expect(post).toHaveBeenCalledWith("/tour/seen", {});
    wrapper.destroy();
  });

  it("waits while something else is asked of them, such as connecting Outlook", async () => {
    shell(["/inbox"]);
    const question = document.createElement("div");
    question.setAttribute("aria-modal", "true");
    document.body.appendChild(question);
    const { wrapper, settle } = await helper(false);

    jest.advanceTimersByTime(5000);
    await settle();
    expect(mockDriver).not.toHaveBeenCalled();

    question.remove();
    jest.advanceTimersByTime(1000);
    await settle();
    expect(mockDriver).toHaveBeenCalledTimes(1);
    wrapper.destroy();
  });

  it("is not shown again to someone who has seen it", async () => {
    shell(["/inbox"]);
    const { wrapper, settle } = await helper(true);

    jest.advanceTimersByTime(10000);
    await settle();

    expect(mockDriver).not.toHaveBeenCalled();
    wrapper.destroy();
  });

  it("can be asked for again from Help", async () => {
    shell(["/inbox"]);
    const { wrapper, settle } = await helper(true);

    await wrapper.find(".fx-help__launch").trigger("click");
    await wrapper.findAll(".fx-help__log .fx-help__actions button").wrappers.find((b) => b.text() === "Show me around").trigger("click");
    await settle();

    expect(mockDriver).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.open).toBe(false);
    wrapper.destroy();
  });
});
