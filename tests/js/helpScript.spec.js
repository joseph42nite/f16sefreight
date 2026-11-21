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

const read = (file) => fs.readFileSync(path.join(__dirname, "../../resources/js/src", file), "utf8");
const flush = async () => { for (let i = 0; i < 6; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };

afterEach(() => jest.restoreAllMocks());

describe("the written help messages", () => {
  it("every button leads to another message, the support chat or the flag", () => {
    Object.entries(HELP_SCRIPT).forEach(([name, step]) => {
      expect(step.says.length).toBeGreaterThan(10);
      expect(step.options.length).toBeGreaterThan(0);
      step.options.forEach((option) => {
        if (option.action) expect(["connect", "flag"]).toContain(option.action);
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
    jest.spyOn(ApiService, "get").mockImplementation(() => Promise.resolve({ data: { chat: null, messages: [], status: "open" } }));
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

    expect(source).not.toMatch(/help\/ask|driver\.js|v-html|innerHTML/);
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
