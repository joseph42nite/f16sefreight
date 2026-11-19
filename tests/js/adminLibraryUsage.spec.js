/**
 * Help documents, mail filing and AI usage, mounted (2026-11-15 frontend audit, tests: "the other admin pages are
 * untested").
 */
import { mount } from "@vue/test-utils";
import ApiService from "@/core/services/api.service";
import HelpDocuments from "@/view/pages/admin/HelpDocuments.vue";
import MailFiling from "@/view/pages/admin/MailFiling.vue";
import AiUsage from "@/view/pages/admin/AiUsage.vue";
import { saveFile } from "@/core/services/download";

jest.mock("@/core/services/download", () => ({ saveFile: jest.fn() }));

const flush = async () => { for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0)); };
const refused = (status, data) => Object.assign(new Error("refused"), { response: { status, data } });
const button = (wrapper, text) => wrapper.findAll("button").wrappers.find((b) => b.text() === text);

afterEach(() => jest.restoreAllMocks());

describe("help documents", () => {
  const library = {
    documents: [
      { id: 1, title: "Inbox", route: "/inbox", filename: "inbox.md", chunk_count: 12, status: "indexed", error: null },
      { id: 2, title: "Billing", route: null, filename: "billing.docx", chunk_count: 0, status: "failed", error: "no headings" },
    ],
    unanswered: [{ id: 5, route: "/kanban", question: "How do I archive a job?", best_score: 0.314 }, { id: 6, route: null, question: "Hi", best_score: null }],
  };
  const open = async () => {
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: library });
    const wrapper = mount(HelpDocuments, { stubs: { StatusChip: true } });
    await flush();

    return { wrapper, get };
  };
  const file = new File(["# Inbox"], "inbox.md");

  it("lists the library and the questions it could not answer", async () => {
    const { wrapper, get } = await open();
    const tables = wrapper.findAll("table");

    expect(get).toHaveBeenCalledWith("/superadmin/help-documents");
    expect(tables.at(0).findAll("tbody tr")).toHaveLength(2);
    expect(tables.at(0).text()).toContain("no headings");
    expect(tables.at(1).text()).toContain("0.31");
    expect(tables.at(1).findAll("tbody tr").at(1).text()).toContain("—");
  });

  it("will not upload without a title and a file", async () => {
    const { wrapper } = await open();

    expect(button(wrapper, "Upload").attributes("disabled")).toBe("disabled");

    await wrapper.setData({ form: { title: "  ", route: "", file } });
    expect(button(wrapper, "Upload").attributes("disabled")).toBe("disabled");
  });

  it("uploads a new document, leaving out an empty page, and reloads", async () => {
    const { wrapper, get } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    await wrapper.setData({ form: { title: " Kanban ", route: " ", file } });
    await button(wrapper, "Upload").trigger("click");
    await flush();

    const [url, body] = post.mock.calls[0];
    expect(url).toBe("/superadmin/help-documents");
    expect(body.get("title")).toBe("Kanban");
    expect(body.has("route")).toBe(false);
    expect(body.get("file").name).toBe("inbox.md");
    expect(get).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.form).toEqual({ title: "", route: "", file: null });
  });

  it("replaces a document at that document's address", async () => {
    const { wrapper } = await open();
    const post = jest.spyOn(ApiService, "post").mockResolvedValue({ data: {} });

    await wrapper.findAll("tbody tr").at(0).findAll("button").at(0).trigger("click");
    expect(wrapper.text()).toContain("Replace “Inbox”");
    expect(wrapper.vm.form.route).toBe("/inbox");

    await wrapper.setData({ form: { ...wrapper.vm.form, file } });
    await button(wrapper, "Replace").trigger("click");
    await flush();

    expect(post.mock.calls[0][0]).toBe("/superadmin/help-documents/1");
    expect(wrapper.vm.replacing).toBeNull();
  });

  it("keeps what was typed when an upload is refused", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "post").mockRejectedValue(refused(422, { errors: { file: ["The file has no headings."] } }));

    await wrapper.setData({ form: { title: "Kanban", route: "/kanban", file } });
    await button(wrapper, "Upload").trigger("click");
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("The file has no headings.");
    expect(wrapper.vm.form.title).toBe("Kanban");
    expect(wrapper.vm.busy).toBe(false);
  });

  it("asks before deleting", async () => {
    const { wrapper } = await open();
    const remove = jest.spyOn(ApiService, "delete").mockResolvedValue({ data: {} });
    const confirm = jest.spyOn(window, "confirm").mockReturnValue(false);
    const bin = wrapper.findAll("tbody tr").at(1).findAll("button").at(1);

    await bin.trigger("click");
    expect(confirm).toHaveBeenCalledWith("Delete “Billing”? The assistant stops answering from it.");
    expect(remove).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await bin.trigger("click");
    expect(remove).toHaveBeenCalledWith("/superadmin/help-documents/2");
  });

  it("stops replacing a document once that document is deleted", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "delete").mockResolvedValue({ data: {} });
    jest.spyOn(window, "confirm").mockReturnValue(true);
    const row = wrapper.findAll("tbody tr").at(0);

    await row.findAll("button").at(0).trigger("click");
    await row.findAll("button").at(1).trigger("click");
    await flush();

    expect(wrapper.vm.replacing).toBeNull();
    expect(wrapper.text()).toContain("Upload a document");
  });

  it("goes on replacing one document when another is deleted", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "delete").mockResolvedValue({ data: {} });
    jest.spyOn(window, "confirm").mockReturnValue(true);

    await wrapper.findAll("tbody tr").at(0).findAll("button").at(0).trigger("click");
    await wrapper.findAll("tbody tr").at(1).findAll("button").at(1).trigger("click");
    await flush();

    expect(wrapper.vm.replacing.id).toBe(1);
  });
});

describe("mail filing", () => {
  const figures = (missed = 4) => ({
    companies: [{ id: 1, name: "Kerala Lines" }, { id: 2, name: "Malabar Cargo" }],
    periods: [7, 30, 90],
    by_type: [
      { filed_as: "customer_enquiry", filed: 50, changed: 12, changed_percent: 24, changed_to: { airline: 10, other: 2 } },
      { filed_as: "airline", filed: 30, changed: 0, changed_percent: 0, changed_to: {} },
    ],
    missed_enquiries: missed,
    domains: [{ sender_domain: "emirates.test", was: "other", now: "airline", n: 6, example: "Booking confirmation" }],
    recent: [{ id: 9, created_at: "2026-11-17T09:31:22Z", company: "Kerala Lines", was: "other", now: "customer_enquiry", sender_email: "a@b.test", subject: "Rate please", snippet: "Need a rate", by: "Anu" }],
  });
  const open = async () => {
    const query = jest.spyOn(ApiService, "query").mockResolvedValue({ data: figures() });
    const wrapper = mount(MailFiling);
    await flush();

    return { wrapper, query };
  };

  it("shows what was filed, marking a kind changed one time in five or more", async () => {
    const { wrapper, query } = await open();
    const rows = wrapper.findAll("table").at(0).findAll("tbody tr");

    expect(query).toHaveBeenCalledWith("/admin/mail-filing", { params: { days: 30 } });
    expect(rows.at(0).text()).toContain("Customer enquiry");
    expect(rows.at(0).text()).toContain("Airline: 10");
    expect(rows.at(0).find(".fx-filing__high").exists()).toBe(true);
    expect(rows.at(1).find(".fx-filing__high").exists()).toBe(false);
    expect(wrapper.text()).toContain("Missed enquiries: 4");
    expect(wrapper.text()).toContain("Other → Airline");
    expect(wrapper.text()).toContain("2026-11-17T09:31");
  });

  it("asks again for one company and another period", async () => {
    const { wrapper, query } = await open();

    await wrapper.find("#filing-company").setValue(2);
    await wrapper.find("#filing-days").setValue(90);

    expect(query).toHaveBeenLastCalledWith("/admin/mail-filing", { params: { days: 90, company_id: 2 } });
  });

  it("shows only the answer to the latest question when two land out of order", async () => {
    const { wrapper, query } = await open();
    const answers = [];
    query.mockImplementation(() => new Promise((resolve) => answers.push(resolve)));

    await wrapper.find("#filing-company").setValue(1);
    await wrapper.find("#filing-company").setValue(2);
    answers[1]({ data: figures(22) });
    await flush();
    answers[0]({ data: figures(11) });
    await flush();

    expect(wrapper.text()).toContain("Missed enquiries: 22");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("says when the figures could not be loaded", async () => {
    jest.spyOn(ApiService, "query").mockRejectedValue(refused(500, null));
    const wrapper = mount(MailFiling);
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("Could not load the mail filing figures.");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("exports the changes for the same company and period, through the signed-in request", async () => {
    const { wrapper, query } = await open();
    const blob = new Blob(["a,b"]);
    query.mockResolvedValue({ data: blob });

    await wrapper.setData({ companyId: 2, days: 7 });
    await button(wrapper, "Export changes (CSV)").trigger("click");
    await flush();

    expect(query).toHaveBeenLastCalledWith("/admin/classification-overrides/export", { params: { days: 7, company_id: 2 }, responseType: "blob" });
    expect(saveFile).toHaveBeenCalledWith(blob, "mail-filing-changes.csv");
    expect(wrapper.vm.exporting).toBe(false);
  });
});

describe("AI usage", () => {
  const usage = (more = {}) => ({
    month: { over_budget: false, spend_inr: 1234.5, budget_inr: 5000, spend_usd: 14.7, calls: 320, used_percent: 25 },
    tiers: { free: { share_percent: 10, calls: 32, avg_seconds: 4 }, economy: { share_percent: 80, calls: 256, avg_seconds: 3, cost_inr: 900 }, fast: { share_percent: 10, calls: 32, avg_seconds: 1, cost_inr: 334.5 } },
    settings: { monthly_budget_inr: 5000, per_user_daily_limit: 40, per_user_daily_questions: 20, usd_to_inr: 84, night_free_help_drafts: true, night_free_extraction: false },
    by_company: [
      { id: 1, company: "Kerala Lines", tier: "tactical", documents: 90, help: 12, drafts: 5, budget: { ai_users: 2, per_user: 150, plan_minimum: 500, plan_limit: 500, limit: 500, overridden: false, spent_month: 120, used_month_percent: 24, spent_today: 10, today_budget: 30 } },
      { id: 2, company: "Malabar Cargo", tier: "command", documents: 400, help: 60, drafts: 30, budget: { ai_users: 20, per_user: 150, plan_minimum: 2000, plan_limit: 3000, limit: 2500, overridden: true, spent_month: 2600, used_month_percent: 104, spent_today: 90, today_budget: 0 } },
    ],
    by_user: [{ name: "Anu", email: "anu@krl.test", calls_today: 3, calls: 60, cost_inr: 80 }],
    by_provider: [{ provider: "novita", tier: "economy", purpose: "extraction", calls: 200, avg_ms: 3240, retried: 4 }],
    ...more,
  });
  const open = async (answer = usage()) => {
    const get = jest.spyOn(ApiService, "get").mockResolvedValue({ data: answer });
    const wrapper = mount(AiUsage);
    await flush();

    return { wrapper, get };
  };

  it("shows the month, each customer and each provider", async () => {
    const { wrapper } = await open();

    expect(wrapper.text()).toContain("₹1,234.5");
    expect(wrapper.text()).toContain("2 AI users × ₹150 = ₹300");
    expect(wrapper.text()).toContain("plan minimum ₹500");
    expect(wrapper.text()).toContain("3.2 s");
    expect(wrapper.text()).toContain("3 / 40");
    expect(wrapper.find(".fx-warn").exists()).toBe(false);
  });

  it("says so when the month's budget is reached, and that extraction still runs", async () => {
    const answer = usage();
    answer.month.over_budget = true;
    const { wrapper } = await open(answer);

    expect(wrapper.find(".fx-warn").text().replace(/\s+/g, " ")).toContain("Extraction is still running");
  });

  it("puts only an overridden limit in a customer's box; an empty one follows the plan", async () => {
    const { wrapper } = await open();
    const boxes = wrapper.findAll("input.fx-ai-limit");

    expect(boxes.at(0).element.value).toBe("");
    expect(boxes.at(0).attributes("placeholder")).toBe("Plan: 500");
    expect(boxes.at(1).element.value).toBe("2500");
    expect(wrapper.findAll("tbody tr").at(1).find("td.fx-error").exists()).toBe(true);
  });

  it("saves the limits and says saved", async () => {
    const { wrapper } = await open();
    const put = jest.spyOn(ApiService, "put").mockResolvedValue({ data: usage() });

    await wrapper.findAll(".fx-ai-settings input").at(0).setValue("8000");
    await button(wrapper, "Save limits").trigger("click");
    await flush();

    expect(put).toHaveBeenCalledWith("/superadmin/ai-usage/settings", expect.objectContaining({ monthly_budget_inr: 8000, per_user_daily_limit: 40 }));
    expect(wrapper.text()).toContain("Saved.");
  });

  it("saves a customer's limit as a number, and an emptied box as following the plan", async () => {
    const { wrapper } = await open();
    const put = jest.spyOn(ApiService, "put").mockResolvedValue({ data: usage() });
    const boxes = wrapper.findAll("input.fx-ai-limit");

    await boxes.at(0).setValue("900");
    await boxes.at(0).trigger("change");
    expect(put).toHaveBeenLastCalledWith("/superadmin/ai-usage/companies/1/limit", { ai_monthly_limit_inr: 900 });

    await boxes.at(1).setValue("");
    await boxes.at(1).trigger("change");
    expect(put).toHaveBeenLastCalledWith("/superadmin/ai-usage/companies/2/limit", { ai_monthly_limit_inr: null });
  });

  it("leaves a half-typed budget alone when a customer's limit is saved", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "put").mockResolvedValue({ data: usage() });

    await wrapper.findAll(".fx-ai-settings input").at(0).setValue("8000");
    await wrapper.findAll("input.fx-ai-limit").at(0).setValue("900");
    await wrapper.findAll("input.fx-ai-limit").at(0).trigger("change");
    await flush();

    expect(wrapper.vm.form.monthly_budget_inr).toBe(8000);
  });

  it("says why a save was refused", async () => {
    const { wrapper } = await open();
    jest.spyOn(ApiService, "put").mockRejectedValue(refused(422, { errors: { usd_to_inr: ["The rate must be at least 1."] } }));

    await button(wrapper, "Save limits").trigger("click");
    await flush();

    expect(wrapper.find("[role=alert]").text()).toBe("The rate must be at least 1.");
    expect(wrapper.vm.saving).toBe(false);
    expect(wrapper.text()).not.toContain("Saved.");
  });
});
