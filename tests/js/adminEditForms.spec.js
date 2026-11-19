/**
 * The four admin edit forms (company, branch, user, blog post), mounted (2026-11-15 frontend audit, tests: "the
 * other admin pages are untested").
 */
import { mount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import { Form } from "vform";
import Swal from "sweetalert2";
import ApiService from "@/core/services/api.service";
import NewCompany from "@/view/pages/admin/NewCompany.vue";
import NewBranch from "@/view/pages/admin/NewBranch.vue";
import NewUsers from "@/view/pages/admin/NewUsers.vue";
import NewBlog from "@/view/pages/admin/NewBlog.vue";

jest.mock("sweetalert2", () => ({ fire: jest.fn() }));
jest.mock("vue-quill-editor", () => ({ quillEditor: { props: ["value"], render(h) { return h("div", { class: "quill" }); } } }));

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const link = { props: ["to"], template: '<a :data-to="to"><slot /></a>' };
const submit = { preventDefault() {} };

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.component("has-error", { render: (h) => h("i") });

/** Answers by address: the longest matching piece of the address wins; a function is called, an Error is thrown. */
const answering = (answers) => jest.spyOn(ApiService, "get").mockImplementation((url) => {
  const key = Object.keys(answers).filter((k) => url.includes(k)).sort((a, b) => b.length - a.length)[0];
  const answer = typeof answers[key] === "function" ? answers[key](url) : answers[key];

  if (answer instanceof Error) return Promise.reject(answer);
  if (answer && typeof answer.then === "function") return answer;

  return Promise.resolve({ data: answer === undefined ? [] : answer });
});

const open = async (page, { id, answers = {} } = {}) => {
  const get = answering(answers);
  const push = jest.fn();
  const wrapper = mount(page, { localVue, attachTo: document.body, stubs: { RouterLink: link }, mocks: { $route: { params: { id } }, $router: { push } } });
  await flush();

  return { wrapper, get, push };
};

beforeAll(() => { window.Form = Form; });
afterEach(() => { jest.restoreAllMocks(); Swal.fire.mockReset(); document.body.innerHTML = ""; });

describe("the company form", () => {
  const company = (more = {}) => ({ id: 5, name: "Focus Air", code: "FOC", tier: "tactical", templates_config: { allowed_templates: ["ksr", { key: "house", label: "House" }], default_focus_air: "ksr", default_house_air: "house" }, ...more });
  const answers = (row) => ({ "available-templates": ["ksr", "house", "air_main"], "all-company/5": row === undefined ? [company()] : row });

  it("opens empty for a new company, with the keys that can be picked", async () => {
    const { wrapper, get } = await open(NewCompany, { answers: answers() });

    expect(wrapper.find("h3").text()).toBe("Add company");
    expect(get).toHaveBeenCalledTimes(1);
    expect(wrapper.findAll(".badge-pill")).toHaveLength(3);
    expect(wrapper.text()).toContain("ENQA-CODE-26-0001");
  });

  it("opens a company to edit, an old list of plain keys turned into rows", async () => {
    const { wrapper } = await open(NewCompany, { id: 5, answers: answers() });

    expect(wrapper.find("h3").text()).toBe("Edit company");
    expect(wrapper.vm.company_form.name).toBe("Focus Air");
    expect(wrapper.vm.company_form.templates_config.allowed_templates).toEqual([{ key: "ksr", label: "ksr" }, { key: "house", label: "House" }]);
    expect(wrapper.text()).toContain("ENQA-FOC-26-0001");
  });

  it("opens a company that has no template settings yet", async () => {
    const { wrapper } = await open(NewCompany, { id: 5, answers: answers([company({ templates_config: null })]) });

    expect(wrapper.vm.company_form.templates_config).toEqual({ allowed_templates: [], default_focus_air: "", default_house_air: "" });
  });

  it.each([
    ["is not there", [], "This company could not be found. It may have been deleted."],
    ["could not be loaded", refused(500, { message: "Server Error" }), "Server Error"],
  ])("says so and holds saving back when the company %s", async (_, row, words) => {
    const { wrapper } = await open(NewCompany, { id: 5, answers: answers(row) });

    expect(wrapper.find(".alert-danger").text()).toBe(words);
    expect(wrapper.find(".create_btn").attributes("disabled")).toBe("disabled");
  });

  it("still opens when the suggested keys do not arrive", async () => {
    const { wrapper } = await open(NewCompany, { answers: { "available-templates": refused(500, {}) } });

    expect(wrapper.vm.availableTemplates).toEqual([]);
    expect(wrapper.find(".badge-pill").exists()).toBe(false);
  });

  it("adds a key from the suggestions once", async () => {
    const { wrapper } = await open(NewCompany, { answers: answers() });
    const said = jest.spyOn(window, "alert").mockImplementation(() => {});

    await wrapper.findAll(".badge-pill").at(2).trigger("click");
    await wrapper.findAll(".badge-pill").at(2).trigger("click");

    expect(wrapper.vm.company_form.templates_config.allowed_templates).toEqual([{ key: "air_main", label: "AIR MAIN" }]);
    expect(said).toHaveBeenCalledWith("'air_main' is already assigned.");
  });

  it("clears a default when its template is removed", async () => {
    const { wrapper } = await open(NewCompany, { id: 5, answers: answers() });

    wrapper.vm.removeTemplateRow(0);

    expect(wrapper.vm.company_form.templates_config.default_focus_air).toBe("");
    expect(wrapper.vm.company_form.templates_config.default_house_air).toBe("house");
  });

  it("does not save two rows with the same key", async () => {
    const { wrapper } = await open(NewCompany, { answers: answers() });
    const post = jest.spyOn(Form.prototype, "post");
    const said = jest.spyOn(window, "alert").mockImplementation(() => {});

    wrapper.vm.company_form.templates_config.allowed_templates = [{ key: "ksr", label: "A" }, { key: " KSR ", label: "B" }];
    wrapper.vm.onSubmit(submit);

    expect(said).toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });

  it("creates the company, then opens it on the companies page", async () => {
    const { wrapper, push } = await open(NewCompany, { answers: answers() });
    const post = jest.spyOn(Form.prototype, "post").mockResolvedValue({ data: { company: { id: 12 } } });

    wrapper.vm.onSubmit(submit);
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/create-company");
    expect(push).toHaveBeenCalledWith({ path: "/superadmin/tenants", query: { company: "12" } });
  });

  it("saves an edit in place, and says why when it is refused", async () => {
    const { wrapper, push } = await open(NewCompany, { id: 5, answers: answers() });
    const put = jest.spyOn(Form.prototype, "put").mockResolvedValueOnce({ data: {} });

    wrapper.vm.onSubmit(submit);
    await flush();

    expect(put).toHaveBeenCalledWith("/superadmin/edit-company/5");
    expect(document.getElementById("fade").style.display).toBe("block");
    expect(push).not.toHaveBeenCalled();

    put.mockRejectedValueOnce(refused(422, { errors: { code: ["The code has already been taken."] } }));
    wrapper.vm.onSubmit(submit);
    await flush();

    expect(wrapper.find(".alert-danger").text()).toBe("The code has already been taken.");
  });
});

describe("the branch form", () => {
  const branch = { id: 9, agent_name: "Focus Air Kochi", agent_city: "Kochi", company_id: 5, branch_code: "COK", agent_issue_loc_code: "COK, Kochi (COK)" };
  const answers = (more = {}) => ({
    "all-company": [{ id: 5, name: "Focus Air" }, { id: 6, name: "Kerala Lines" }],
    "get-location": [{ iata_code: "COK", destination: "Kochi" }, { iata_code: "DXB", destination: "Dubai" }, { iata_code: null, destination: "Nowhere" }],
    "all-branch/9": [branch],
    ...more,
  });

  it("opens empty with the companies to choose from", async () => {
    const { wrapper } = await open(NewBranch, { answers: answers() });

    expect(wrapper.find("h3").text()).toBe("Add Branch");
    expect(wrapper.vm.all_company.map((c) => c.text)).toEqual(["Select Company", "Focus Air", "Kerala Lines"]);
    expect(wrapper.find(".alert-warning").exists()).toBe(false);
  });

  it("opens a branch to edit with its place of issue", async () => {
    const { wrapper } = await open(NewBranch, { id: 9, answers: answers() });

    expect(wrapper.find("h3").text()).toBe("Edit Branch");
    expect(wrapper.vm.branch_form.agent_name).toBe("Focus Air Kochi");
    expect(wrapper.vm.searchQuery).toBe("COK, Kochi (COK)");
  });

  it.each([
    ["is not there", [], "This branch could not be found. It may have been deleted."],
    ["could not be loaded", refused(403, { message: "Staff only." }), "Staff only."],
  ])("says so and holds saving back when the branch %s", async (_, row, words) => {
    const { wrapper } = await open(NewBranch, { id: 9, answers: answers({ "all-branch/9": row }) });

    expect(wrapper.find(".alert-danger").text()).toBe(words);
    expect(wrapper.find(".create_btn").attributes("disabled")).toBe("disabled");
  });

  it("says when the companies did not arrive", async () => {
    const { wrapper } = await open(NewBranch, { answers: answers({ "all-company": refused(500, { message: "Server Error" }) }) });

    expect(wrapper.find(".alert-warning").text()).toBe("The companies could not be loaded: Server Error");
  });

  it("finds an airport by code or by city, one without a code not stopping the search", async () => {
    const { wrapper } = await open(NewBranch, { answers: answers() });

    await wrapper.setData({ searchQuery: "dub" });
    expect(wrapper.vm.filteredLocations.map((l) => l.iata_code)).toEqual(["DXB"]);

    await wrapper.setData({ searchQuery: "cok" });
    expect(wrapper.vm.filteredLocations.map((l) => l.iata_code)).toEqual(["COK"]);

    wrapper.vm.selectOption({ iata_code: "DXB", destination: "Dubai" });
    await flush();

    expect(wrapper.vm.branch_form.agent_issue_loc_code).toBe("DXB, Dubai (DXB)");
  });

  it("closes the airport list on a click elsewhere, and stops listening once the form is closed", async () => {
    const { wrapper } = await open(NewBranch, { answers: answers() });

    await wrapper.find(".custom-dropdown").trigger("click");
    expect(wrapper.find(".dropdown-options").exists()).toBe(true);

    document.body.click();
    await flush();
    expect(wrapper.find(".dropdown-options").exists()).toBe(false);

    const close = jest.spyOn(wrapper.vm, "isDropdownOpen", "set").mockImplementation(() => {});
    wrapper.destroy();
    expect(() => document.body.click()).not.toThrow();
    expect(close).not.toHaveBeenCalled();
  });

  it("creates the branch, then opens its company", async () => {
    const { wrapper, push } = await open(NewBranch, { answers: answers() });
    const post = jest.spyOn(Form.prototype, "post").mockResolvedValue({ data: {} });

    wrapper.vm.branch_form.company_id = 6;
    wrapper.vm.onSubmit(submit);
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/create-branch");
    expect(push).toHaveBeenCalledWith({ path: "/superadmin/tenants", query: { company: "6" } });
  });

  it("saves an edit in place, and says why when it is refused", async () => {
    const { wrapper } = await open(NewBranch, { id: 9, answers: answers() });
    const put = jest.spyOn(Form.prototype, "put").mockRejectedValue(refused(422, { errors: { branch_code: ["The branch code has already been taken."] } }));

    wrapper.vm.onSubmit(submit);
    await flush();

    expect(put).toHaveBeenCalledWith("/superadmin/edit-branch/9");
    expect(wrapper.find(".alert-danger").text()).toBe("The branch code has already been taken.");
  });
});

describe("the user form", () => {
  const user = { id: 3, name: "Asha Nair", email: "asha@example.test", designation: "sales", company_name: 5, branch_name: 9, origin_airport_code: "COK", is_active: 1, can_send: 1 };
  const answers = (more = {}) => ({
    "all-company": [{ id: 5, name: "Focus Air" }, { id: 6, name: "Kerala Lines" }],
    "get-location": [{ iata_code: "COK", destination: "Kochi" }, { iata_code: "DXB", destination: "Dubai" }, { iata_code: "DEL", destination: "Delhi (cok road)" }, { iata_code: null, destination: "Nowhere" }],
    "get-company-branch/5": [{ id: 9, agent_city: "Kochi" }],
    "get-company-branch/6": [{ id: 11, agent_city: "Kozhikode" }],
    "all-user/3": [user],
    ...more,
  });

  it("opens empty, and asks for no branches until a company is chosen", async () => {
    const { wrapper, get } = await open(NewUsers, { answers: answers() });

    expect(wrapper.find("h2").text()).toBe("Add User Account");
    expect(get.mock.calls.map((c) => c[0]).some((url) => url.includes("get-company-branch"))).toBe(false);

    wrapper.vm.getBranch("add");
    await flush();

    expect(get.mock.calls.map((c) => c[0]).some((url) => url.includes("get-company-branch"))).toBe(false);
    expect(wrapper.vm.all_branch).toHaveLength(1);
  });

  it("opens a user to edit, with the branches of their company", async () => {
    const { wrapper } = await open(NewUsers, { id: 3, answers: answers() });

    expect(wrapper.find("h2").text()).toBe("Edit User Account");
    expect(wrapper.vm.user_form.name).toBe("Asha Nair");
    expect(wrapper.vm.user_form.branch_name).toBe(9);
    expect(wrapper.vm.all_branch.map((b) => b.text)).toEqual(["Select Branch", "Kochi"]);
    expect(wrapper.find("input[type=email]").attributes("readonly")).toBe("readonly");
    expect(wrapper.text()).toContain("ACTIVE");
  });

  it.each([
    ["is not there", [], "This user could not be found. They may have been deleted."],
    ["could not be loaded", refused(403, { message: "Staff only." }), "Staff only."],
  ])("says so and holds saving back when the user %s", async (_, row, words) => {
    const { wrapper } = await open(NewUsers, { id: 3, answers: answers({ "all-user/3": row }) });

    expect(wrapper.find(".alert-danger").text()).toBe(words);
    expect(wrapper.find("button[type=submit]").attributes("disabled")).toBe("disabled");
  });

  it("shows only the branches of the company picked last", async () => {
    let first;
    const slow = new Promise((resolve) => { first = resolve; });
    const { wrapper } = await open(NewUsers, { answers: answers({ "get-company-branch/5": () => slow }) });

    wrapper.vm.user_form.company_name = 5;
    wrapper.vm.getBranch("add");
    wrapper.vm.user_form.company_name = 6;
    wrapper.vm.getBranch("add");
    await flush();
    first({ data: [{ id: 9, agent_city: "Kochi" }] });
    await flush();

    expect(wrapper.vm.all_branch.map((b) => b.text)).toEqual(["Select Branch", "Kozhikode"]);
    expect(wrapper.vm.user_form.branch_name).toBe(null);
  });

  it("says when the branches did not arrive", async () => {
    const { wrapper } = await open(NewUsers, { answers: answers({ "get-company-branch/5": refused(500, { message: "Server Error" }) }) });

    wrapper.vm.user_form.company_name = 5;
    wrapper.vm.getBranch("add");
    await flush();

    expect(wrapper.find(".alert-warning").text()).toBe("The branches could not be loaded: Server Error");
  });

  it("puts an exact airport code first", async () => {
    const { wrapper } = await open(NewUsers, { answers: answers() });

    await wrapper.setData({ searchQuery: "cok" });

    expect(wrapper.vm.filteredLocations.map((l) => l.iata_code)).toEqual(["COK", "DEL"]);
  });

  it("saves the airport that is in the box, typed or picked", async () => {
    const { wrapper } = await open(NewUsers, { id: 3, answers: answers() });
    const put = jest.spyOn(Form.prototype, "put").mockResolvedValue({ data: {} });

    // Typed over the earlier code, without picking from the list.
    await wrapper.setData({ searchQuery: "dxb" });
    wrapper.vm.onSubmit(submit);
    await flush();

    expect(put).toHaveBeenCalledWith("/superadmin/edit-user/3");
    expect(wrapper.vm.user_form.origin_airport_code).toBe("DXB");
    expect(wrapper.text()).toContain("Saved Successfully");
    expect(wrapper.vm.isSubmitting).toBe(false);

    wrapper.vm.selectOption({ iata_code: "COK", destination: "Kochi" });
    wrapper.vm.onSubmit(submit);
    await flush();

    expect(wrapper.vm.user_form.origin_airport_code).toBe("COK");

    await wrapper.setData({ searchQuery: "" });
    wrapper.vm.onSubmit(submit);
    await flush();

    expect(wrapper.vm.user_form.origin_airport_code).toBe(null);
  });

  it("creates the user, then goes to the list", async () => {
    const { wrapper, push } = await open(NewUsers, { answers: answers() });
    const post = jest.spyOn(Form.prototype, "post").mockResolvedValue({ data: {} });

    wrapper.vm.onSubmit(submit);
    await flush();

    expect(post).toHaveBeenCalledWith("/superadmin/create-user");
    expect(push).toHaveBeenCalledWith("/superadmin/all-users");
  });

  it("stays on the form with the reason when a save is refused", async () => {
    const { wrapper, push } = await open(NewUsers, { answers: answers() });
    jest.spyOn(Form.prototype, "post").mockRejectedValue(refused(422, { errors: { email: ["The email has already been taken."] } }));

    wrapper.vm.onSubmit(submit);
    await flush();

    expect(wrapper.find(".alert-danger").text()).toBe("The email has already been taken.");
    expect(push).not.toHaveBeenCalled();
    expect(wrapper.vm.isSubmitting).toBe(false);
  });
});

describe("the blog post form", () => {
  const post = (more = {}) => ({ id: 2, title: "Air freight basics", slug: "air-freight-basics", category: "Air Freight", read_time: "6 min", excerpt: "A short guide.", content: "<p>Body</p>", takeaways: '["One","Two"]', image_path: "/storage/blogs/a.webp", published_at: "2026-10-01T00:00:00Z", meta_title: null, meta_description: null, ...more });
  const answers = (rows = [post()]) => ({ "all-blogs-internal": rows instanceof Error ? rows : { success: true, data: rows } });
  const sent = (call) => Object.fromEntries([...call[1].entries()]);
  const buttons = (wrapper) => wrapper.findAll(".d-flex > button.btn").wrappers.filter((b) => /Blog|Draft|draft/.test(b.text()));

  it("opens empty for a new post, both buttons saying what they do", async () => {
    const { wrapper, get } = await open(NewBlog, { answers: answers() });

    expect(get).not.toHaveBeenCalled();
    expect(wrapper.find("h2").text()).toBe("Publish Editorial Post");
    expect(buttons(wrapper).map((b) => b.text())).toEqual(["Save as Draft", "Publish Blog"]);
  });

  it("opens a published post, its takeaways read from text", async () => {
    const { wrapper } = await open(NewBlog, { id: 2, answers: answers() });

    expect(wrapper.vm.blogData.takeaways).toEqual(["One", "Two"]);
    expect(wrapper.vm.previewImage).toBe("/storage/blogs/a.webp");
    expect(buttons(wrapper).map((b) => b.text())).toEqual(["Unpublish (save as draft)", "Update Blog"]);
    expect(wrapper.find("a[target=_blank]").attributes("href")).toBe("/blog/air-freight-basics");
  });

  it("calls the button Publish on a draft, and survives takeaways that cannot be read", async () => {
    const { wrapper } = await open(NewBlog, { id: 2, answers: answers([post({ published_at: null, takeaways: "{not json" })]) });

    expect(wrapper.vm.blogData.takeaways).toEqual([""]);
    expect(wrapper.vm.blogData.title).toBe("Air freight basics");
    expect(buttons(wrapper).map((b) => b.text())).toEqual(["Save as Draft", "Publish Blog"]);
  });

  it.each([
    ["is not there", [], "This post could not be found. It may have been deleted."],
    ["could not be loaded", refused(500, { message: "Server Error" }), "Server Error"],
  ])("says so and holds saving back when the post %s", async (_, rows, words) => {
    const { wrapper } = await open(NewBlog, { id: 2, answers: answers(rows) });

    expect(wrapper.find(".alert-danger").text()).toBe(words);
    buttons(wrapper).forEach((b) => expect(b.attributes("disabled")).toBe("disabled"));
  });

  it("asks for a title and content before saving", async () => {
    const { wrapper } = await open(NewBlog, { answers: answers() });
    const save = jest.spyOn(ApiService, "post");

    wrapper.vm.submitPost(false);

    expect(save).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith("Hold up", expect.any(String), "warning");
  });

  it("publishes a new post with its filled takeaways only", async () => {
    const { wrapper, push } = await open(NewBlog, { answers: answers() });
    const save = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    await wrapper.setData({ blogData: { ...wrapper.vm.blogData, title: "New", content: "<p>x</p>", excerpt: "Short", takeaways: ["One", "  ", "Three"] } });
    wrapper.vm.submitPost(false);
    await flush();

    expect(save.mock.calls[0][0]).toBe("/superadmin/create-blog");
    expect(sent(save.mock.calls[0])).toMatchObject({ title: "New", is_draft: "0", "takeaways[0]": "One", "takeaways[1]": "Three" });
    expect(sent(save.mock.calls[0])._method).toBeUndefined();
    expect(push).toHaveBeenCalledWith("/superadmin/all-blogs");
    expect(wrapper.vm.submitting).toBe(false);
  });

  it("saves an edit as a draft, empty boxes sent empty and not as the word null", async () => {
    const { wrapper } = await open(NewBlog, { id: 2, answers: answers([post({ excerpt: null, read_time: null, takeaways: [] })]) });
    const save = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    wrapper.vm.submitPost(true);
    await flush();

    expect(save.mock.calls[0][0]).toBe("/superadmin/edit-blog/2");
    expect(sent(save.mock.calls[0])).toMatchObject({ _method: "PUT", is_draft: "1", excerpt: "", read_time: "", takeaways: "", meta_title: "" });
  });

  it("stays on the form with the server's reason when a save is refused", async () => {
    const { wrapper, push } = await open(NewBlog, { id: 2, answers: answers() });
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(422, { message: "The given data was invalid.", errors: { excerpt: ["The excerpt field is required."] } }));

    wrapper.vm.submitPost(false);
    await flush();

    expect(Swal.fire).toHaveBeenLastCalledWith("Not saved", "The excerpt field is required.", "error");
    expect(push).not.toHaveBeenCalled();
    expect(wrapper.vm.submitting).toBe(false);
  });

  it("says a path was copied only when it was", async () => {
    const { wrapper } = await open(NewBlog, { answers: answers() });
    const toast = jest.spyOn(wrapper.vm.$bvToast, "toast").mockImplementation(() => {});
    Object.defineProperty(navigator, "clipboard", { value: { writeText: jest.fn(() => Promise.resolve()) }, configurable: true });

    wrapper.vm.copyLink("/services");
    await flush();

    expect(toast).toHaveBeenLastCalledWith('Copied "/services" to clipboard!', expect.objectContaining({ title: "Copied" }));

    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    wrapper.vm.copyLink("/services");
    await flush();

    expect(toast).toHaveBeenLastCalledWith(expect.stringContaining("/services"), expect.objectContaining({ title: "Not copied" }));
  });
});
