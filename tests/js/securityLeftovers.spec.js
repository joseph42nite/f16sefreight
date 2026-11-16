/**
 * The smaller security findings of the 2026-11-15 frontend audit (FS6, FS10–FS13). The mail frame is mounted; the
 * rest is read from the source (the guard and the sign-in modal pull in the whole router and store).
 */
import { shallowMount } from "@vue/test-utils";
import MailBodyFrame from "@/view/pages/freight/components/MailBodyFrame.vue";
import ApiService from "@/core/services/api.service";

const fs = require("fs");
const path = require("path");
const read = (file) => fs.readFileSync(path.join(__dirname, "../..", file), "utf8");
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("pictures in a mail (FS10)", () => {
  const mountWith = async (html) => {
    jest.spyOn(ApiService, "get").mockResolvedValue({ data: { html } });
    const wrapper = shallowMount(MailBodyFrame, { propsData: { messageId: 1 } });
    await flush();

    return wrapper;
  };

  afterEach(() => jest.restoreAllMocks());

  it("are not fetched from the internet until asked for", async () => {
    const wrapper = await mountWith('<p>Hello</p><img src="https://track.example/p.gif?id=7">');

    expect(wrapper.vm.hasRemoteImages).toBe(true);
    expect(wrapper.vm.document).toContain("Content-Security-Policy");
    expect(wrapper.text()).toContain("Pictures from the internet are hidden.");

    await wrapper.find("button").trigger("click");

    expect(wrapper.vm.document).not.toContain("Content-Security-Policy");
    expect(wrapper.text()).not.toContain("Pictures from the internet are hidden.");
  });

  it("carried inside the mail raise no question", async () => {
    const wrapper = await mountWith('<p>Logo</p><img src="data:image/png;base64,AAAA"><img src="/api/inbox/attachments/3">');

    expect(wrapper.vm.hasRemoteImages).toBe(false);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("are hidden again for the next mail", async () => {
    const wrapper = await mountWith('<img src="//cdn.example/a.png">');

    await wrapper.find("button").trigger("click");
    await wrapper.setProps({ messageId: 2 });

    expect(wrapper.vm.showImages).toBe(false);
  });
});

describe("the blog page (FS6)", () => {
  it("cannot be broken out of through the title", () => {
    expect(read("resources/js/src/view/pages/public/BlogPost.vue"))
      .toMatch(/JSON\.stringify\(schema\)\.replace\(\/<\/g, '\\\\u003c'\)/);
  });
});

describe("the reset link and analytics (FS11)", () => {
  it("reports the reset page without its token or email", () => {
    const shell = read("resources/views/welcome.blade.php");

    expect(shell).toMatch(/page_location: window\.location\.origin \+ '\/PasswordForgotForm'/);
    expect(shell).not.toMatch(/gtag\('config', 'G-JCFDX15593'\);/);
  });
});

describe("signing in (FS12, FS13)", () => {
  it("sends no password from the bare main domain", () => {
    const modal = read("resources/js/src/view/layouts/public/AuthModals.vue");
    const login = modal.slice(modal.indexOf("\n        login() {"));

    expect(login.indexOf("if (!this.currentPortal)")).toBeGreaterThan(-1);
    expect(login.indexOf("if (!this.currentPortal)")).toBeLessThan(login.indexOf(".dispatch(LOGIN"));
  });

  it("does not check a tenant as platform staff, which signed them out", () => {
    const main = read("resources/js/src/main.js");

    expect(main).toMatch(/role === 'user' && userType === 'superadmin'/);
    expect(main.indexOf("if (wrongKind)")).toBeLessThan(main.indexOf("store.dispatch(VERIFY_AUTH"));
  });
});
