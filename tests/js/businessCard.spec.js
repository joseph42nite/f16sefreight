/**
 * Frontend audit §7: the two business cards were 1,608 of 1,634 lines the same. They are one component now, and
 * each page only says who the person is. These check that each card still says what it said before.
 */
import { mount } from "@vue/test-utils";
import JosephCard from "@/view/pages/public/JosephCard.vue";
import DeepanjanCard from "@/view/pages/public/DeepanjanCard.vue";
import { cardMeta, whatsappUrl, vcard, vcardFileName } from "@/core/services/businessCard";
import * as download from "@/core/services/download";

const joseph = JosephCard.data().person;
const deepanjan = DeepanjanCard.data().person;

afterEach(() => jest.restoreAllMocks());

describe("what a card says about its person", () => {
  it("builds the WhatsApp link the old cards carried", () => {
    expect(whatsappUrl(joseph)).toBe("https://wa.me/917011363516?text=Hi%20Joseph%2C%20I%20accessed%20your%20digital%20card%20and%20would%20like%20to%20connect.");
    expect(whatsappUrl(deepanjan)).toBe("https://wa.me/917278178402?text=Hi%20Deepanjan%2C%20I%20accessed%20your%20digital%20card%20and%20would%20like%20to%20connect.");
  });

  it("writes the same contact file", () => {
    expect(vcard(deepanjan, new Date("2026-11-18T09:30:15.123Z")).split("\r\n")).toEqual([
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Deepanjan COO F16s;;;;",
      "FN:Deepanjan COO F16s",
      "ORG:F16s E-Freight Solutions",
      "TITLE:COO & Founder",
      "TEL;TYPE=CELL,VOICE:+917278178402",
      "EMAIL;TYPE=PREF,INTERNET:d.sarkar@f16sefreight.com",
      "URL:https://f16sefreight.com",
      "URL;type=LinkedIn:https://www.linkedin.com/in/deepanjan-sarkar-b5a28b290/",
      "X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/deepanjan-sarkar-b5a28b290/",
      "NOTE:Saved from F16s Digital Business Card.",
      "REV:20261118T093015Z",
      "END:VCARD",
    ]);
    expect(vcardFileName(joseph)).toBe("Joseph_CEO_F16s.vcf");
    expect(vcardFileName(deepanjan)).toBe("Deepanjan_COO_F16s.vcf");
  });

  it("keeps the page's title and description", () => {
    const meta = cardMeta(joseph);

    expect(meta.title).toBe("Joseph | CEO & Founder - F16s E-Freight Solutions");
    expect(meta.meta.find((t) => t.name === "description").content).toBe(
      "Digital business card for Joseph, CEO & Founder of F16s E-Freight Solutions. Connect via WhatsApp, phone, email or LinkedIn instantly."
    );
    expect(meta.meta.find((t) => t.property === "og:description").content).toBe("Digital business card for Joseph. Click to save contact details instantly.");
  });
});

describe.each([
  ["Joseph", JosephCard, { name: "Joseph George", role: "CEO & Founder", initial: "J", username: "@joseph_ceo", phone: "7011363516", path: "/joseph-ceo-938204719284", linkedin: "joseph-george" }],
  ["Deepanjan", DeepanjanCard, { name: "Deepanjan Sarkar", role: "COO & Founder", initial: "D", username: "@deepanjan_coo", phone: "7278178402", path: "/deepanjan-coo-839204817294", linkedin: "deepanjan-sarkar" }],
])("%s's card", (first, page, expected) => {
  const card = () => mount(page, { stubs: { transition: false } });

  it("shows the person", () => {
    const wrapper = card();

    expect(wrapper.find(".editorial-name").text()).toBe(expected.name);
    expect(wrapper.find(".editorial-role").text()).toBe(expected.role);
    expect(wrapper.find(".strip-initials").text()).toBe(expected.initial);
    expect(wrapper.find(".strip-username").text()).toBe(expected.username);
    expect(wrapper.find(".strip-subtitle").text()).toBe(expected.role + " | F16s E-Freight");
    expect(wrapper.find(".editorial-quote").text()).toMatch(/^".+"$/);
  });

  it("links to the person's phone, WhatsApp and LinkedIn", () => {
    const links = card().findAll("a").wrappers.map((a) => a.attributes("href"));

    expect(links).toContain("tel:" + expected.phone);
    expect(links.some((href) => href.startsWith("https://wa.me/91" + expected.phone + "?text=Hi%20" + first))).toBe(true);
    expect(links.some((href) => href.includes("linkedin.com/in/" + expected.linkedin))).toBe(true);
  });

  it("shares its own address", () => {
    expect(card().findComponent({ name: "BusinessCard" }).vm.shareUrl).toBe(window.location.origin + expected.path);
  });

  it("saves the person's contact file", () => {
    const save = jest.spyOn(download, "saveFile").mockImplementation(() => {});

    card().findComponent({ name: "BusinessCard" }).vm.downloadVcf();

    expect(save).toHaveBeenCalledTimes(1);
    const [text, name, type] = save.mock.calls[0];
    expect(text).toContain("TEL;TYPE=CELL,VOICE:+91" + expected.phone);
    expect(name).toBe(vcardFileName(page.data().person));
    expect(type).toBe("text/vcard;charset=utf-8;");
  });
});
