# Landing page — marketing facts and copy

The source of truth for what the public landing page (`/`, `resources/js/src/view/pages/public/Home.vue`) may say about
F16s. Every claim here is backed by the code or the plan docs; the reference is beside it. Keep this file updated
whenever the landing page or the product changes (owner, 2026-11-12).

- **Rule:** if it is not in "Shipped" below, it does not go on the page as if it works today.
- **Last updated:** 2026-11-13

---

## 1. The one-line story

Client email → enquiry → shipment → documents → invoice → ledger, in one system. (`docs/plan/PRD.md:47`)

Hero today: **"Smart e-Freight for Freight Forwarders"** — "Every enquiry, AWB and airline on one clear board."

## 1a. ⭐ The owner's priorities — lead with these (owner, 2026-11-12)

Tagline: **"No more guessing."** Don't name the AI assistant (no "Jev") on the page.

| # | Message | What backs it |
|---|---|---|
| 1 | **Packing list + invoice → final AWB draft in seconds, with AI** | `python/model_extract.py` reads the commercial invoice and packing list (3 pages) into waybill fields; measured 10–18 s an invoice, about ₹0.03 each; doc types in `JobDocumentController.php:27` |
| 2 | **Track your shipment** | `JobController::tracking`; airline status in 7 milestones — cargo accepted, manifested, departed, arrived, customs cleared, out for delivery, delivered (`core/config/cargoMilestones.js`) |
| 3 | **Assign jobs** | `POST /jobs/{job}/reassign`, `/reassign/request`, `/resolve`, `/withdraw` (`routes/api.php:356-367`); who has room from the workload score |
| 4 | **See which clients left, and why** | Every lost enquiry has a reason: rates high, slow reply, client cancelled, no capacity, other (`EnquiryController.php:288`); lanes lost on price (`Services/Sales/ClientFindings.php:57-64`) |
| 5 | **Keep track of your staff** | Quarterly reviews (`Services/Sales/StaffReviews.php`, `StaffReviewController`); staff-load view on the board |
| 6 | **Internal numbers on how ops and staff work** | Workload score (Operator Load Index = Σ (complexity + dimension lines + houses) × urgency, `Services/OperatorLoadService.php`); ops scorecard — days slower per step, cancellation rate, airline rejection (FNA) rate, weight gap (`Services/Sales/OpsScorecard.php`) |
| 7 | **Stop retyping AWB details: AI extraction of documents** (owner: "it's AI extraction of documents", not the address book) | AI reads scanned AWB copies, BLs and delivery orders into the job (doc types `JobDocumentController.php:27`; vision model for scans, `SYSTEM_MAP.md:311-322`; sea BL read into the form, `SYSTEM_MAP.md:114`). Supporting: saved shippers/consignees (`AddressBookController.php`) |

## 2. Shipped — safe to headline

### Inbox that sorts itself
- Outlook mailboxes are read every **2 minutes** through Microsoft Graph. (`docs/SYSTEM_MAP.md:182-187`)
- The AI assistant **Jev** files each thread and reads the lane, the cargo and import or export.
- One click turns a mail into an enquiry (ENQA-…); confirming the shipment makes a job.
- Two-way mail: composer, signatures and an outbox. (`PRD.md:734-916`)

### One board for every shipment
- Kanban: Processing → Awaiting Customer → In-Transit → Completed, with unassigned mail on top. (`SYSTEM_MAP.md:110`)
- A tracking drawer with the airline's status messages, a staff-load view, and handovers that go through approval.
  (`PRD.md:1127-1250`)
- Stale enquiries get a reminder every hour; enquiries can be marked lost and reopened. (`PRD.md:1025-1116`)

### Air documents, done properly
- MAWB and HAWB forms, consolidation and PDFs.
- e-AWB as Cargo-XML (FWB, FHL, house manifest), sent through **Descartes**.
  (`app/Http/Controllers/Logistics/ConversionController.php`)
- Airline replies (accepted, FNA) come back on a webhook and land on the right waybill in the Message Log.
  (`SYSTEM_MAP.md:112-113`)
- Cargo-IMP line limits are checked before a message is built. (`IcegateValidator.php:144`)

### Sea
- House and master bills of lading, 12 steps each; AI reads a carrier's BL into the form.
- Consolidation: houses to a master, containers stuffed. (`SYSTEM_MAP.md:114-115`)

### Import desk
- Consol → houses → arrival notice → delivery order.
- **The DO is released only when the bill is paid or the client is within credit.** (`SYSTEM_MAP.md:116, 212`)

### Accounts, built for India
- "Today" screen; money in (5 stages); money out (vouchers, payment runs, bank upload file).
- Close-the-month checklist; GSTR-1 and TDS; profit by client and lane; P&L. (`SYSTEM_MAP.md:122-131`)
- Cost sheet → invoice and vouchers → double-entry posting with the GST split; bank reconciliation.
  (`SYSTEM_MAP.md:196-209`)
- One ledger across air and sea.

### Sales and the boss
- Funnel, client book, outreach drafts, targets, quarterly staff reviews.
- Boss overview: revenue, cash, money owed, alerts. (`SYSTEM_MAP.md:119, 137`)
- Client health score and a monthly payment report card per client.

### Clients
- A review link the client opens without signing in, to view and respond. (`routes/api.php:294-295`)

### Humans stay in charge
- **No client mail goes out unless a person sends it** — updates are prepared as drafts. (`SYSTEM_MAP.md:189`)
- AI on a scanned document asks before spending a credit. (`PRD.md:423`)

### Trust and security
- Audit log that cannot be changed: the database refuses edits and deletes. (`app/Services/AuditLogger.php:8-17`)
- Every upload is virus-scanned; if the scanner is down, the file is refused. (`app/Services/VirusScanner.php`)
- Mailbox tokens and bank details are encrypted at rest. (`app/MailboxConnection.php:22`, `app/BankAccount.php:31`)
- Each company's and branch's data is kept apart. (`PRD.md:344-354`)
- Plan and role are checked on every request; one session per person; file types checked by content.
- **Separation of duties:** only accounts posts to the ledger and closes a month (not even the boss); sales never sees
  margin. (`PRD.md:238, 255-256, 342`)

### Who it is for
- Five desks: **pricing, operations, sales, accounts, boss** — company → branches → users. (`PRD.md:49-61, 167-285`)
- Clients with several branches, each with its own GSTIN and credit limit. (`PRD.md:141-160`)
- Separate portals: FocusAir, FocusSea, Accounts, Admin, Superadmin. (`config/f16s.php:190`)

### Plans (no public prices yet)
| Plan | What it adds |
|---|---|
| **Core** | Documents: MAWB/HAWB and PDFs, sea BLs, consolidation, search; one login type, so everyone works the bills; no AI scans |
| **Tactical** | + roles (pricing, operations, sales, boss), Outlook inbox, enquiries, the board and assigning, manifests and the import desk, sales and client insights, AI scans 500 a month |
| **Command** | + accounts desk, cost sheets, invoices and vouchers, ledger, bank reconciliation, month close, margins and financial reports, credit holds, AI scans 2,000 a month |

Source: the tier on each permission in `app/Providers/AuthServiceProvider.php`; scan credits in `config/f16s.php` (2026-11-13).

Locked features stay visible behind a "Request Upgrade" overlay. (`PRD.md:366-402`)

## 3. Numbers we can stand behind
| Number | Meaning | Source |
|---|---|---|
| 2 min | how often the inbox is read | `SYSTEM_MAP.md:182` |
| 5 | desks in one system | `PRD.md:167-285` |
| 12 | steps to a bill of lading | `SYSTEM_MAP.md:114` |
| 0 | client mails sent without a person | `SYSTEM_MAP.md:189` |
| 25 MB | attachment limit | `HANDOFF.md:34` |

## 4. ⚠️ Claims on the site today that nothing backs up — replace or prove
| Claim | Where | Status |
|---|---|---|
| "MAWB and HAWB in under 3 seconds" / "3 sec" | Home hero and stats, `HomeStatsSection.vue` | No timing anywhere |
| "150+ airlines" | Hero, `Services.vue`, `EndToEnd.vue`, `ProductDescription.vue`, `ScalableArchitecture.vue` | Airlines are reached through one network (Descartes); no airline list exists |
| "1,00,000+ AWBs processed" | Hero, `Solutions.vue` | No source |
| 99.9% uptime, auto-backups, end-to-end encryption | `services/CloudStorage.vue` | No backup or uptime work; only some fields are encrypted |
| "24/7 support", "100% accuracy" | `ContactUs.vue`, `Services.vue` | No source |
| "Real-time tracking for all air freight" | `EndToEnd.vue` | Airline status messages only |
| **FOCUS ROAD** | `HomeServicesGrid.vue` | Not built (no Road portal) — mark "coming soon" or remove |

**Owner to supply if true:** real AWB count, the number of airlines reached through Descartes, any uptime figure.

## 5. Not built yet — keep off the page (or label "coming soon")
- Focus Road
- Gmail (blocked until Google's CASA review; Outlook only today)
- Live ICEGATE customs filing (manual or by email until the keys are set)
- CASS import, payouts / payments, direct airline booking
- Help copilot document search

## 6. Differentiators worth a headline
Lead with the owner's seven (§1a). Supporting points, for lower sections:
1. One board for every shipment, from first mail to delivery.
2. Airline accept / reject replies tracked back to the waybill.
3. Delivery orders released only when the client has paid or is within credit.
4. One ledger for air and sea, with GST and TDS.
5. Built-in separation of duties between pricing, accounts and the boss.
6. No client mail goes out without a person sending it.

---

## 7. Page status
| Section | State | Notes |
|---|---|---|
| Hero | Redesigned 2026-11-12 | Blue card, white copy, hands holding a laptop with the board on screen; sticky with a curved white sheet scrolling over it (parallax) |
| Hero stat cards | **Removed 2026-11-12** (owner) | "3 sec", "150+", "1,00,000+", "1" — nothing backed three of them. The hero subtitle's "under 3 seconds" and "150+ airlines" went with the 2026-11-16 redesign, from the page meta and structured data too (§4) |
| Laptop screen | HTML board for now | **SaaS video from the owner, to come** |
| Features ("Run every shipment. No more guessing.") | Done 2026-11-12 (third pass) | Owner's "Structure that adapts" reference: eyebrow "Why F16s", cards in violet / sky / mint gradients, title on top, the screen rising from the bottom edge, a real cloud in each card and two behind the section; the sheet is warm off-white #F8F6F1. One wide AI card (invoice + packing list → AWB), then tracking, assigning, AI reads documents, why clients leave, staff, team numbers (`HomeFeatures.vue`). Cloud: Unsplash A9_IsUtjHm4, sky keyed out (`public/media/assets/banners/cloud.png`) |
| Statement ("this clear") | Removed 2026-11-12 | Replaced by the features section |
| Old "Logistics Automation Features" grid | Removed from the page 2026-11-12 | Generic (cloud storage, privacy…); `HomeFeatureGrid.vue` is now unused |
| How it works | **Removed 2026-11-13** (owner) | The airline section took its place; `HomeHowItWorks.vue` deleted |
| AI ("AI does the reading. Your team makes the calls.") | Added 2026-11-13; redesigned the same day after the owner's Pinterest reference (widget board) | Four cards: invoice + packing list → AWB draft (10–18 s), reads scanned AWBs/BLs/DOs, sorts the inbox, drafts client updates; laid out as white widget tiles in three columns: invoice → AWB pair with a looped arrow, a blue "10–18 seconds" tile, a scan line over a page, the inbox under a green arc, a dark "Client update drafted · You send" pill over grey "Ready to send.", a gold coin for "asks before it spends", and an "Emails drafted for you" card cycling a shipment's mails (quote → booked → departed → arrived → delivered). Animated like the reference: tiles spring in on scroll, the number counts to 18, the arrow draws, the coin flips, the mails type in turn. The three rule pills were removed (owner, 2026-11-13) (`HomeAi.vue`) |
| How it connects ("One record, from the first mail to the last rupee.") | Added 2026-11-13; on a blue band since the same day; steps put on a winding line the same day (owner) | Eight small numbered cards on a dotted white line that winds through them, with two dots travelling along it: on desktop two rows of four, row two running back right to left with a hairpin bend; on phones one column zigzagging left and right. Steps: mail → enquiry → job → documents → airline (Descartes) → tracking (7 milestones) → invoice → books; then every desk on one record, air and sea on one board, DO released on payment (`HomeConnected.vue`) |
| Plans / Safe and in control (Desks removed 2026-11-13) | Added 2026-11-13, content first; the Accounts section ("From cost sheet to closed month") removed the same day (owner) | Card sections from `INFO_SECTIONS` in `Home.vue`, drawn by `HomeInfoSection.vue`: Plans now sit straight after Air / Sea / Road, then the six trust points; Core / Tactical / Command with "prices on request" |
| Products: Air / Sea / Road | Done 2026-11-12 | Replaces "Specialized Logistics Services". Air **Live**, Sea **Live** (the old page wrongly said Sea was coming soon), Road **Coming soon** (`HomeModes.vue`); since 2026-11-13 the ship sits in water (a moving wave line over the hull) and the truck on a road (moving centre line), and the cloud is only behind the plane (owner) |
| Airlines | Done 2026-11-12; moved up and out of its card, 18 logos, 2026-11-13 | Replaces the "Global Airline Affiliations" ticker: "Your AWBs reach the airlines you already fly with" — two rows of logo tiles drifting opposite ways, and names Descartes. No "affiliations", no airline count (`HomeAirlines.vue`) |
| News | Restyled 2026-11-12 | "From the F16s desk." Featured card + three beside it, pastel category pills (`HomeNewsSection.vue`) |
| FAQ | Rewritten 2026-11-12 | Six questions with answers matching the product (email, AI waybills, airlines, team and clients, plans, data safety); the old answers named a "Pro plan" (`HomeFaqSection.vue`) |
| Closing call to action | Added 2026-11-12 | The hero's blue card: "Stop guessing. Start running every shipment." (`HomeCta.vue`) |
| Fonts | — | Inter throughout (400–700 loaded in `App.vue`); section headings share `.lp-head/.lp-eyebrow/.lp-title/.lp-sub` in `Home.vue` |

Laptop photo: "Hands hold up an open laptop with a blank screen", Lorin Both on Unsplash (free, Unsplash License),
background removed and tinted navy.

## Changelog
- **2026-11-16** — How it connects: the three cards under the line (every desk / air and sea / money and documents) are now plain columns split by thin rules, no boxes (owner).
- **2026-11-16** — Footer: Instagram added (https://www.instagram.com/f16s_efreight/) next to LinkedIn and YouTube (owner).
- **2026-11-16** — Footer wordmark now reads "F16s." in full with its dot, no longer cut off at the bottom (owner).
- **2026-11-16** — One button for the whole public site, `LpButton.vue`, in the hero's style (solid white / glass ghost, 50px pill; 44px in cards); used in hero, Products, the banner, Plans, Blog, the form (its button now sits on the blue under the white panel) and the footer. Footer redesigned (owner): paper fading to sky, logo + line + Talk to us, Product / Company / Legal columns, round LinkedIn and YouTube buttons, giant pale F16s wordmark with the jet crossing it; the dead Facebook link removed.
- **2026-11-16** — Talk to us form: Designation is now a real dropdown (seven roles + Other, which opens a box to type it); the fields were redesigned as white boxes with an icon, a small label and the input inside (owner).
- **2026-11-16** — Blog redesigned as a picture wall (one tall lead story, four beside it, titles on the photos; a swipe row on phones). The FAQ is a classic FAQ again (owner: the chat looked like AI answering): "Frequently asked questions.", numbered questions with a +/× toggle, thin rules, no boxes. Talk to us now sits on the blue cloud card like the hero, with the form in a white glass panel.
- **2026-11-16** — Hero: the four story chips around the laptop removed, and Descartes no longer named in the hero (owner). The "Stop guessing. Start running every shipment." banner moved up to sit between Products and Plans; the page now ends with the Talk to us form.
- **2026-11-16** — Hero redesigned, "the board comes alive" (owner): new title "Every shipment, on one clear board." and a sub-line of shipped facts only, so the unbacked "under 3 seconds" and "150+ airlines" are gone from the hero and from the page's meta description; Get started scrolls to the form; a works-with line (Air, Sea, Outlook & Microsoft 365, Descartes Cargo-XML); the F16s jet crosses the sky; four story chips around the laptop step through one shipment (mail → AI draft → e-AWB via Descartes → departed).
- **2026-11-16** — Closing call to action redesigned (owner): a runway at the foot of the sky card, the F16s jet taking off on a contrail, drifting clouds, and three next steps (tell us about your team → we set it up with you → your first shipment). "Get started" now scrolls to the Talk to us form instead of opening /contact-us.
- **2026-11-16** — FAQ redesigned as a conversation (owner): questions listed on the left, the chosen one shown as your message, a typing beat, then the answer as F16s's reply; the chat's message bar leads to the Talk to us form. The "What plans are there?" answer now matches the Plans section (Core documents / Tactical team / Command accounts, prices on request) instead of the old "one login, four roles, Kanban" wording.
- **2026-11-16** — "Talk to us" form added after the FAQ (owner): name, work email, company, designation (required); phone and a note (optional). Work emails only: free mailboxes (Gmail, Outlook incl. outlook.in, Yahoo, iCloud, Proton, Zoho, Rediff…) and domains with no mail server are refused, in the browser (`workEmail.js`) and on the server (`App\Support\WorkEmail`, `POST /api/talk-to-us`, 5 a minute). Entries go to Superadmin → Contacts with new Company and Designation columns (migration `2026_11_16_000000`, also adds `source` = "landing"). Blog and FAQ headings are now centred like the rest; the FAQ's "Still have a question?" scrolls to the form.
- **2026-11-16** — Blog section shows blogs only (owner): news removed along with the All / News / Blogs tabs; eyebrow "Blog", button "All articles". News will get its own section later.
- **2026-11-16** — News redesigned as "News and blogs" (owner): All / News / Blogs tabs, a large featured post and a slim list split by thin rules, no card boxes. A post counts as news when its category says news ("Industry News").
- **2026-11-16** — Safe and in control: out of its panel, and the six safeguards are plain text with icons instead of cards (owner: too many cards).
- **2026-11-16** — "Safe and in control" redesigned (owner): a shield with the F16s jet in the middle, the six safeguards three a side, each wired to it; scan line, pulsing rings. New sub-line: "Six safeguards built into F16s, so nobody has to remember to switch them on." `HomeTrust.vue`; `INFO_SECTIONS` removed from `Home.vue`.
- **2026-11-13** — Plans redone again (owner didn't like the wall): the cards now match the Products cards, each with its own jet-based picture: Core a waybill with a jet stamp, Tactical a radar, Command gold command wings under three stars. The wall, desk and chair are gone.
- **2026-11-13** — Plans redesigned after the owner's reference: Core / Tactical / Command hang as posters on a near-white dotted wall, with a desk, shell chair, laptop, mug and plant beside them; each plan's mark is an F16s jet formation (one, a pair, three). `HomePlans.vue`; the plans entry left `INFO_SECTIONS`.
- **2026-11-13** — "Built for your whole team / Five desks. One system." section removed; Plans ("Start small. Add desks as you grow.") moved up into its place, before "Safe and in control" (owner).
- **2026-11-13** — The sea in Focus Sea moves more (rolling swells that rise and fall, ripples, a wavering reflection); the Air card's cloud and the blue band's clouds now drift (owner).
- **2026-11-13** — Focus Sea: a more natural sea (hazy horizon, deeper water, shimmer, the ship's reflection, two swells, foam); the card is now yellow (butter). Focus Road is now green (mint) with a green verge. `docs/DESIGN.md` updated (owner).
- **2026-11-13** — Focus Sea card: ship put in water, cloud removed. Focus Road card: truck put on a road, cloud removed. Design style written up in `docs/DESIGN.md` (owner).
- **2026-11-13** — How it connects: the eight steps are now smaller numbered cards joined by a winding dotted line the reader can follow, in place of the grid with arrows (owner).
- **2026-11-13** — Accounts section ("From cost sheet to closed month, without the spreadsheets.") removed from the page (owner).
- **2026-11-13** — Like the hero: the white sheet now ends after the AI section with a curved bottom edge; "How it connects" sits on a blue band in the hero's colours with clouds; a second white sheet curves up over it for the rest of the page (owner).
- **2026-11-13** — More information on the page, design to follow (owner): sections on how we use AI, how everything connects, the five desks, accounts, safety and plans. "How it works" removed; the airline section takes its place, no longer in a card, with 10 more logos from Wikimedia Commons (Singapore, Cathay, BA, Saudia, Ethiopian, Korean Air Cargo, Thai, Gulf Air, IndiGo, Kuwait).
- **2026-11-12** — Whole page redesigned in the hero's look: how it works (replaces stats), products with true Air/Sea/Road status, airlines through Descartes (replaces "affiliations"), news, FAQ rewritten, closing call to action. Old section components kept: About Us and Services still use some of them.
- **2026-11-12** — Hero stat cards removed. Feature cards each get their own hue (sky, violet, mint, peach, butter, rose); the wide card's cloud cut to a light haze.
- **2026-11-12** — Feature cards restyled after the owner's reference (pastel gradients, real cloud); card 7 is now
  "AI reads your documents" (owner: the no-retyping point is AI extraction, not the address book).
- **2026-11-12** — Owner's priorities added (§1a). Features section rewritten around them; inbox, airline replies,
  DO release, GST accounts and "drafts you send" cards dropped from it; no mention of Jev.
- **2026-11-12** — Features section added as the first section on the sheet (six shipped features from §2/§6);
  the statement and the old features grid removed.
- **2026-11-12** — File created from a survey of the codebase. Hero redesigned; unbacked claims listed.
