/**
 * What a digital business card says about its person (frontend audit §7: `JosephCard.vue` and `DeepanjanCard.vue`
 * were 1,608 of 1,634 lines the same). The card itself is `public/components/BusinessCard.vue`; each person's page
 * only says who they are:
 *
 *   { first, name, role, initial, username, quote, phone, email, linkedin, path }
 *
 * `role` is the short one ("CEO"); `phone` is the ten digits without the country code; `path` is the card's address.
 */
const COMPANY = "F16s E-Freight Solutions";

/** "CEO & Founder" */
export function cardTitle(person) {
  return person.role + " & Founder";
}

/** The page's title and tags. Search engines are asked to skip a card and keep no copy (owner, 2026-11-16; FS14). */
export function cardMeta(person) {
  const heading = `${person.first} | ${cardTitle(person)} - ${COMPANY}`;

  return {
    title: heading,
    meta: [
      // The server says the same in a header (routes/web.php), for crawlers that run no script.
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" },
      { name: "description", content: `Digital business card for ${person.first}, ${cardTitle(person)} of ${COMPANY}. Connect via WhatsApp, phone, email or LinkedIn instantly.` },
      { property: "og:title", content: heading },
      { property: "og:description", content: `Digital business card for ${person.first}. Click to save contact details instantly.` },
      { property: "og:type", content: "profile" },
    ],
  };
}

export function whatsappUrl(person) {
  const hello = `Hi ${person.first}, I accessed your digital card and would like to connect.`;

  return `https://wa.me/91${person.phone}?text=${encodeURIComponent(hello)}`;
}

/** The contact as a phone's address book reads it. */
export function vcard(person, now = new Date()) {
  const label = `${person.first} ${person.role} F16s`;

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${label};;;;`,
    `FN:${label}`,
    "ORG:" + COMPANY,
    "TITLE:" + cardTitle(person),
    "TEL;TYPE=CELL,VOICE:+91" + person.phone,
    "EMAIL;TYPE=PREF,INTERNET:" + person.email,
    "URL:https://f16sefreight.com",
    "URL;type=LinkedIn:" + person.linkedin,
    "X-SOCIALPROFILE;type=linkedin:" + person.linkedin,
    "NOTE:Saved from F16s Digital Business Card.",
    "REV:" + now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
    "END:VCARD",
  ].join("\r\n");
}

export function vcardFileName(person) {
  return `${person.first}_${person.role}_F16s.vcf`;
}
