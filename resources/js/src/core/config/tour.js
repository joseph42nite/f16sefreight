/**
 * The tour of the portal a person gets on their first sign-in (owner, 2026-11-21): a box beside each important
 * part of the screen saying what it is for, with Next and Back. Help can show it again.
 *
 * 🔴 Every word here is this app's own. The library that draws the boxes writes the text into the page as HTML,
 * which is why the AI help was not allowed to hand it a model's words (frontend audit 2026-11-15, FS5). Nothing
 * typed by a person, read from the server or taken from the page goes into a box: only these strings.
 *
 * A menu entry is described only when it is on this person's menu: the tour is made from what is on screen, so
 * nobody is told about a page their role does not have.
 */
export const TOUR_WELCOME = {
  title: "Welcome to F16s",
  text: "A quick look at where things are. It takes about a minute. Press Next to go on, or close this box to skip it. You can see it again any time from Help.",
};

/** What each page in the side menu is for, by its address. */
export const TOUR_PAGES = {
  "/inbox": ["Inbox", "Your mail, filed by shipment. Open a conversation to reply, read its documents and turn an enquiry into a shipment."],
  "/kanban": ["Board", "Every shipment as a card, in the column for the stage it is at. Drag a card to move it on."],
  "/enquiries": ["Enquiries", "Every enquiry the branch has received and where it stands. Click a row to open its mail."],
  "/master-airway-bill": ["Documents", "Make a master or house air waybill, save it as a draft, print it or send it to the airline."],
  "/message-log": ["Message log", "What was sent to the airline for each waybill, and what the airline answered."],
  "/focus-sea": ["Bills of lading", "Every sea shipment: the house and master bills, their containers and documents."],
  "/focus-sea/consol": ["Consolidation", "Put house bills under a master and plan what goes in each container."],
  "/import": ["Import", "Cargo arriving: the arrival notice to the consignee and the delivery order."],
  "/manifest-filing": ["Manifest filing", "Check a shipment against the customs rules and record its filing."],
  "/clients-partners": ["Clients and partners", "Who you bill and who you pay: their details, contacts and terms."],
  "/sales": ["Sales", "Your enquiries, what to follow up today, and mails ready for you to send."],
  "/boss": ["Overview", "The whole company at a glance: shipments, money and who is waiting on what."],
  "/financials": ["Financials", "Invoices, supplier bills, the bank and the reports made from them."],
  "/today": ["Today", "What accounts need to work through today, and what needs a decision."],
  "/money-in": ["Money in", "Raise invoices, record receipts and see who owes what."],
  "/money-out": ["Money out", "Supplier bills, what is due, and the payment runs."],
  "/close-month": ["Close the month", "The checks to go through before a month is closed, and the closing itself."],
  "/how-were-doing": ["How we're doing", "Profit by shipment, client and month."],
  "/settings": ["Settings", "Your name, your mailbox and signature, and your company's own settings."],
};

/** The parts of the screen that are there on every page, after the menu. */
export const TOUR_FIXED = [
  { selector: ".fx-header__toggle", title: "Hide the menu", text: "Folds the side menu away when you want more room for the page, and brings it back." },
  { selector: ".fx-portal-chip", title: "Which portal you are in", text: "Air and sea work are kept apart. This always shows which one you are looking at." },
  { selector: ".fx-bell__trigger", title: "Notifications", text: "Things waiting for you: a shipment handed to you, a request to answer, a reply that came in." },
  { selector: ".fx-profile__trigger", title: "Your account", text: "Your name and role. Open it to reach your settings or to sign out." },
  { selector: ".fx-help__launch", title: "Help", text: "Stuck, or something looks wrong? Start here to reach a person at F16s, or to flag the part of the screen that is wrong. This tour is here too." },
];

const pathOf = (link) => {
  try {
    return new URL(link.getAttribute("href"), window.location.origin).pathname.replace(/\/+$/, "") || "/";
  } catch (e) {
    return "";
  }
};

const onScreen = (element) => !!element && element.getClientRects().length > 0;

/**
 * The steps for the screen as it is now, in the order the eye meets them: the welcome, the menu from the top, then
 * the header and Help. Shaped for driver.js.
 */
export function tourSteps(root = document) {
  const steps = [{ popover: { title: TOUR_WELCOME.title, description: TOUR_WELCOME.text } }];

  root.querySelectorAll(".fx-rail__nav a.fx-rail__item").forEach((link) => {
    const page = TOUR_PAGES[pathOf(link)];
    if (page && onScreen(link)) steps.push({ element: link, popover: { title: page[0], description: page[1], side: "right", align: "center" } });
  });

  TOUR_FIXED.forEach((part) => {
    const element = root.querySelector(part.selector);
    if (onScreen(element)) steps.push({ element, popover: { title: part.title, description: part.text } });
  });

  return steps;
}

export default tourSteps;
