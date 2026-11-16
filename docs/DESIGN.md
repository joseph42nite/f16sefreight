# F16s landing page — design style

- **What this is:** the visual language of the public landing page (`resources/js/src/view/pages/public/Home.vue` and its `components/Home*.vue`). Use it for any new section, and for the About, Services and Product pages when they are brought in line.
- **What it is not:** this file is not the source for claims; that is `docs/LANDING_PAGE.md`.
- **Last updated:** 2026-11-13

## 1. The idea in one line

**Sky and paper.**
- A soft blue sky, with clouds, holds the hero and one band in the middle of the page.
- Warm off-white sheets of paper slide over it, with big rounded corners.
- On the paper sit friendly pastel cards that show the product working.

It should feel calm, light and clear: never dark, never busy, never "enterprise grey".

## 2. Page structure: sheets over sky

| Layer | What it is | Where |
|---|---|---|
| **Sky (hero)** | Inset blue card, 36px radius, sticky; it scales back and dims as the sheet rises over it | `HomeHero.vue` `.lh` |
| **Sheet 1** | Off-white `#F8F6F1`, radius 56px, a soft blue shadow on its top edge (`0 -20px 50px rgba(40,90,170,.14)`), pulled up 56px over the sky | `Home.vue` `.lp-sheet` |
| **Blue band** | The hero's blue gradient again, with two cloud images (`mix-blend-mode: screen`), pulled up under sheet 1's curved bottom | `.lp-blue` |
| **Sheet 2** | Off-white again, top corners only, curving up over the band | `.lp-sheet--next` |

**Rules:**
- **Alternate the layers.** Paper, then sky, then paper. Never put two blue bands back to back.
- **Use a band for a story, not for features.** A blue band holds one big idea told as a picture: today that is "How it connects".
- **Phones:** radii drop to 32px.

## 3. Colour

**Blues (sky):**
- Top `#6FA9F2`
- Middle `#9CC6F7`
- Low `#CFE4FC`

The gradient runs top to bottom. The sky is light: if it starts to look navy, it is wrong.

**Ink:**
- Titles `#1E3A6E` (section titles); `#102552` for card titles.
- Body text `#2C3A57` to `#4B5B78`.
- Muted text `#6B7A93`; small labels `#9AA8C0`.
- Action blue `#2F6FCF` (links, check marks) and `#3E8BEA` (accents).

**Paper:**
- `#F8F6F1` is the sheet.
- `#fff` is the cards that sit on it.

**Pastel tones.** Every card family picks from these six. Each tone is a two-stop gradient from `--c1` at the top to `--c2` lower down, plus a soft background with a dark ink for icons and tags.

| Tone | Gradient `--c1 → --c2` | Use |
|---|---|---|
| sky | `#AFD4F7 → #E2EFFC` | air, documents, the default |
| mint | `#B9E8CB → #E6F7EC` | road (green verge), live, money in |
| violet | `#CDBFF8 → #EEE9FD` | AI, sales |
| peach | `#FBCDB3 → #FDEDE3` | source papers, warnings that aren't errors |
| butter | `#F6DF96 → #FCF4DA` | sea (a sunny sky over blue water), coming soon |
| rose | `#F5BCD3 → #FCE9F1` | a sixth when a row needs it |

**Status colours:**
- Live: green dot `#16A34A` with a 3px halo.
- Coming soon: amber dot `#D69E2E`.
- Both sit inside a white pill at 75% opacity.

## 4. Type

- **Font:** Inter throughout (400–700, loaded in `App.vue`).
- **Section heading:** the shared classes `.lp-head`, `.lp-eyebrow`, `.lp-title`, `.lp-sub`.
  - **Eyebrow:** 12px, uppercase, 0.14em tracking, muted. One or two words ("How it connects").
  - **Title:** `clamp(2rem, 4vw, 3rem)`, weight **500** (not bold), −0.03em tracking.
    - Two short lines, broken by hand with `<br />`.
    - The second line turns the first ("One platform. / Every way cargo moves.").
  - **Sub:** 16px, max 520px wide, one or two sentences.
- **Card titles:** 15–24px, weight 700, tight tracking.
- **Card body:** 13–15px, line-height 1.5.
- **On the blue:** headings turn white with a soft blue text-shadow, so they read on the sky.

## 5. Shapes and depth

- **Radii are generous and nested.**
  - Sheet: 56px.
  - Hero: 36px.
  - AI tiles: 34px.
  - Product cards: 28px.
  - Info cards: 24px.
  - Small step cards: 20px.
  - Icon squares: 10–13px.
  - Pills: 999px.
- **Shadows are soft, blue-tinted and low-contrast,** for example `0 10px 30px rgba(38,68,127,.06)`.
  - On hover they grow (`0 22px 44px …/.14`), and the card lifts 4px.
  - Never use black shadows.
- **No borders on cards.** Separation comes from paper against white plus a shadow. Borders appear only on glass pills over the blue.
- **Icons:** bootstrap-vue `b-icon`, sitting in a rounded square of the card's soft tone. One icon per card.

## 6. Pictures: real objects, placed in their world

- Use photographic cut-outs (plane, ship, truck, laptop), not flat illustrations. Give them a drop shadow tinted blue (`drop-shadow(0 18px 24px rgba(38,68,127,.18))`).
- **Every object sits in its own world, drawn in CSS or SVG behind it and in front of it:**
  - **Plane:** in the clouds (`cloud.png`, screen blend).
  - **Ship:** in a natural sea, built in layers:
    - A hazy horizon that fades into the sky rather than stopping at a hard line.
    - Water that deepens from pale `#CFE9F3` at the horizon to `#2F78AE` at the front.
    - A slow shimmer of fine ripple lines.
    - The ship's own reflection, flipped, blurred and fading downwards.
    - Two see-through swells in front of the hull moving at different speeds and in opposite directions.
    - A soft line of foam at the waterline.
    - Keep the front water translucent: a solid band reads as a stripe, not as sea.
  - **Truck:** on a slate road with a green verge and white edges. A dashed yellow centre line moves, so it drives.
- **Contrast between world and card:** set the card's tone against its world. The sea card is butter, so the blue water reads as sea under a sunny sky. The road card is mint, so the grey road runs through green. The air card is sky blue with clouds.
  - **Laptop:** shows the real product board.
- The world runs to the card's edges, by bleeding past the padding.
- Clouds belong to the sky and the air card only. Don't scatter them on sea or road.

## 7. Showing the product

- Show, don't list. Feature and AI cards carry **small working pieces of the UI**: a waybill form filling in, a mail list typing out subjects, a number counting up, a board with jobs. They are miniatures, not screenshots.
- **Widget-board layout** (the AI section): white tiles of mixed sizes in three columns. Each tile makes one point, with one picture and very few words.
- Use real numbers only where `docs/LANDING_PAGE.md` backs them.

## 8. Motion

- **Purposeful and gentle.** Something moves so the reader understands it: the wave swells, the road's centre line runs, the dots travel the "How it connects" line, the mails type.
- **Worlds are alive.** The scenery behind an object always moves a little:
  - **Sea:**
    - The two swells roll sideways in opposite directions (8s and 4.5s) and rise and fall 2px as they go.
    - Ripple lines roll towards the viewer while a glint slides across.
    - The reflection wavers.
    - The foam breathes.
  - **Clouds:**
    - The Air card's cloud drifts under the plane (14s).
    - The blue band's two clouds drift in opposite directions (40s and 52s).
    - The hero's clouds drift too.
  - **Road:** the centre line runs.
- **Entrances:** tiles spring in once, when they reach 85% of the viewport.
  - They start at opacity 0, 26px down, scale .94.
  - They stagger.
  - The trigger is a scroll listener, not IntersectionObserver, so it still fires after a fast jump.
- **Loops are slow:** 7–16s for ambient motion, 1–1.5s for a dash flow.
- **Never animate text people are reading,** and never flash.
- **`prefers-reduced-motion: reduce`** turns off every loop and entrance; content shows in its final state.

## 9. Lines that lead the eye

When a section is a sequence, join the cards with a line the reader can follow.
- **The line:** dotted white, 3px, with a wide soft glow beneath it.
  - It is drawn from the cards' measured positions, so it fits any layout.
  - Desktop: rows that snake, with a hairpin turn at the end of a row.
  - Phones: one column zigzagging left and right, with the line looping out from each card's side.
- **Number the cards** "01", "02" … so the order is clear even without the line.
- **Under the line on the blue band,** the three takeaways ("Every desk sees the same job", "Air and sea on one board", "Money and documents agree") are not cards. They are three centred columns split by thin rules: a white icon circle, a navy title and one line.
  - Navy reads better than white on the pale foot of the band.
  - On phones they stack, split by horizontal rules.

## 10. Words on the page

- **Short, plain and concrete.** Name the real thing ("MAWB and HAWB", "Descartes", "every 2 minutes").
- **Two-line titles** with a turn.
- **No claim without a source** in `docs/LANDING_PAGE.md`. Say "Coming soon" honestly.
- **Never mention Jev.**

## 11. Checklist for a new section

1. Paper or sky? Follow the alternation in §2.
2. Heading with `.lp-head`: eyebrow, two-line title, short sub.
3. Cards in one pastel family, white or tone gradient, with the radius from §5.
4. A picture of the product or the object in its world, rather than a bullet list.
5. One gentle motion with a reduced-motion fallback.
6. Check widths of 375, 768 and 1366 for no sideways scroll.
7. Record it in `docs/LANDING_PAGE.md`.

## 12. Plans: same cards as Products, one picture per plan

- **Cards:** Plans use the Products card (`.lm-card` from `HomeModes.vue`).
  - Same gradient, radius, badge, check list and white pill link, so the two sections read as one family.
  - Tones: Core sky, Tactical violet, Command peach.
  - The badge carries the tier line ("Documents", "Everything in Core, plus" …).
  - The link is "Ask about <plan>" to `/contact-us`.
- **One picture per plan, all built on the F16s jet** (`#lpl-jet` in `HomePlans.vue`, a top-view fighter silhouette). Each picture is a different shape, so the plans tell apart at a glance:
  - **Core: the waybill.** A white AWB with a blue header, lines and a barcode. A navy "approved" stamp carries the jet, and a jet flies past on a dashed trail. *Documents.*
  - **Tactical: the radar.** A navy radar scope with a turning sweep, jobs as glowing blips and the jet as a contact, with two job cards floating beside it. *Operations on one board.*
  - **Command: command wings.** Gold pilot's wings around a navy badge with the jet, under three stars, with a shine passing over it. *The whole company.*
- **Use this jet** wherever the brand needs a mark: it says "F16s" and reads as software, not as an airline. Don't use a generic plane icon.
- The gallery wall with the desk and chair was tried on 2026-11-13 and dropped (owner).

## 13. Safe and in control: a shield with its safeguards wired to it

- **Centrepiece:** a shield in the brand blues with a white rim and the F16s jet, and a padlock at its foot.
  - A soft scan line passes down it (the virus scan).
  - Two rings pulse around it.
  - Two small badges float beside it: a key and a tick.
- **Around it:** the six safeguards sit three a side as plain text, not cards: a pastel icon square in its own tone, a bold title and one line.
  - On the left the text is right-aligned with the icon on the inside, so both sides read towards the shield.
  - Each one is joined to the shield by a short dashed line ending in a blue dot.
- **No panel:** the section sits straight on the paper, with only a soft blue glow behind the shield. The owner asked for fewer cards (2026-11-16): not every section needs a box.
- **Tablet and phone:** the shield goes on top and the safeguards sit below in two columns (tablet) or one (phone), with no lines.
- **Source:** `HomeTrust.vue`. `HomeInfoSection.vue` is no longer used on the landing page.

## 14. Blog: a picture wall

- **Blogs only.** News is left out and will get its own section later (owner, 2026-11-16).
- **Heading:** centred: eyebrow "Blog", the title "From the F16s desk.", and the "All articles" pill centred under the wall.
- **The wall:** picture-led, like magazine covers, with no white boxes.
  - One tall lead story on the left (radius 30px) and four smaller ones in a 2 × 2 beside it (radius 26px).
  - Every tile is a photo with a navy fade from the foot. The category is a white pill on top; date, read time and title are white on the photo.
  - The lead story also shows two lines of excerpt and a "Read" pill. On the small tiles, "Read" slides up on hover, and the photo zooms gently.
- **Tablet:** the lead goes full width on top, with the four in a 2 × 2 below.
- **Phone:** the five become a row of tall cards you swipe.

## 15. Headings are centred, everywhere

- Every section heading uses `.lp-head` centred: eyebrow, two-line title, sub.
- The old left-aligned variant (`.lp-head--left`) is no longer used on the landing page. Blog and FAQ were moved to centred on 2026-11-16 (owner).
- Buttons that belong to a section ("All articles", "Still have a question?") sit centred under its content, not beside the heading.
- **FAQ:** see §17.

## 16. Talk to us: the form

- **Placement:** the sky card, like the hero and the "Stop guessing" banner: the hero's blue gradient, drifting clouds, radius 36px.
  - The heading ("Talk to us" / "See F16s on your own shipments.") is white.
  - The form sits on the card in one near-white glass panel, max 820px wide, radius 30px, with a deep soft shadow.
- **Fields:** two columns on desktop, one on phones.
  - Required: full name, work email, company, designation.
  - Optional: phone, and "What would you like to see?".
- **One white box per field** (radius 18px, min height 64px, 1.5px border `#E2E8F2`). The whole box is the click target.
  - Inside: an icon in a soft square on the left, a small grey label, and the input under it with no border of its own.
  - The icon turns blue once the field is focused or filled.
  - Focus shows a blue border and a 4px soft ring.
  - Errors turn the box, its icon and a short line under it red.
- **Designation is a real dropdown.** It is a native `<select>`, so it works with the keyboard and with phone pickers, dressed to match, with a chevron that turns on focus.
  - Roles: Owner / Director, General Manager, Operations, Pricing, Sales, Accounts and IT Manager, and Other.
  - "Other" opens a box under it to type the title, and moves the cursor there.
  - The old type-ahead list (`<datalist>`) was dropped because it never opened as a list (owner, 2026-11-16).
- **Work emails only.** The hint under the email field says so before anyone types.
  - Gmail, Outlook, Yahoo and other free mailboxes are refused as soon as the field loses focus.
  - The server refuses them again, and also refuses domains that can't receive mail.
- **Button and done state:** one blue gradient pill, "Request a walkthrough". After sending, the panel turns into a green tick with "Thanks, <first name>."

## 17. FAQ: a classic list

- **Not a chat.** The chat layout was dropped (owner, 2026-11-16) because it suggested an AI answering; this is a plain FAQ.
- **Heading:** centred: eyebrow "FAQ", "Frequently asked / questions.".
- **The list:** one column, max 860px wide, with numbered questions ("01" …) split by thin rules and no boxes.
  - A round + on the right turns into × (rotating, filled blue) when the question is open, and the answer opens underneath, lined up with the text.
  - One question is open at a time.
- **Under the list:** "Still have a question? Talk to us ↓", which scrolls to the form.

## 18. Closing call to action: take-off

- **The card:** the hero's sky card again, radius 36px.
  - Centred copy: "Ready when you are" pill, "Stop guessing. / Start running every shipment.", one sub-line.
  - Two buttons: **Get started**, solid white, which scrolls to the Talk to us form; and **See how it works**, glass.
- **The story behind the words:**
  - A runway in perspective at the foot of the card, with a rolling dashed centre line and blinking amber edge lights.
  - The F16s jet takes off from it and climbs to the top right on a 7s loop. A white contrail draws in behind it, then fades.
  - The route stays inside the card, so the jet is always in view on desktop.
  - The clouds drift.
- **What happens next:** three glass step pills joined by dashed lines: "Tell us about your team", "We set it up with you", "Your first shipment on F16s". On phones they stack.
- **Reduced motion:** no jet, no loops. The contrail is shown drawn.

## 19. Hero

- **Copy:** "Freight forwarding, made clear" pill, then "Every shipment, / on one clear board.", then one sub-line of shipped facts: mail read every 2 minutes, AI-drafted waybills, e-AWBs sent straight to the airlines, air and sea.
- **Buttons:** **Get started**, which scrolls to the Talk to us form, and **See how it works**.
- **Works with:** a quiet line of small white items under the buttons: Air, Sea, Outlook & Microsoft 365.
- **Jet:** the F16s jet crosses the sky above the title on a faint contrail (14s loop). It stays clear of the words, and the page closes with the same jet.
- **The laptop:** shows the real board, with nothing floating around it.
  - The story chips (New mail, AWB drafted, e-AWB sent, Departed) were tried and removed on 2026-11-16 (owner).
  - Descartes is not named in the hero (owner); it is named further down the page.
- **Kept as before:** the sticky sky card, the white sheet sliding over it and the parallax.
- The "Stop guessing" banner (§18) now sits between Products and Plans, not at the foot of the page. The page ends with the Talk to us form.

## 20. Buttons: one component, the hero's style

- **Every button on the public site is `LpButton.vue`.** Don't style a new button by hand.
- **Look:** a pill 50px high, padding 0 28px, Inter 600 at 15px, and an optional icon on the right that nudges on hover.
  - **solid:** white, sky-blue text `#3E8BEA`, soft blue shadow. The default, on any background.
  - **ghost:** frosted glass with white text and a white hairline. Only on blue.
  - **size="sm":** 44px, for buttons inside cards (Products, Plans).
- **Usage:** `to` renders a router link, `href` a plain link (use it for in-page jumps with a click handler that calls `preventDefault()`), and neither renders a `<button>` (`type="submit"`).
- **Where it's used:** hero, Products, the "Stop guessing" banner, Plans, Blog, the Talk to us form and the footer.
- **The form's button** sits on the blue under the white panel, not inside it, so it is the same white button as the hero's.

## 21. Footer

- **Shared by every public page** (`layouts/public/Footer.vue`).
- **Background:** paper `#F8F6F1` fading into the hero's pale sky.
  - It sits above the page sheet (z-index 6), so the sheet's shadow doesn't show as a seam.
- **Left:** the logo, one line ("Freight forwarding software for air and sea. Every shipment on one clear board.") and a **Talk to us** button, which goes to the form on the home page.
- **Right:** three columns with small uppercase heads.
  - Product: Focus Air, Focus Sea, Focus Road with a "Soon" tag, Plans.
  - Company: About us, Blog, FAQs, Contact.
  - Legal: Terms of service, Privacy policy.
- **Bottom row:** © line, plus LinkedIn, Instagram and YouTube as round white buttons. Facebook was removed because it pointed nowhere.
- **Foot:** a giant pale "F16s." wordmark, written in full like the logo with its dot, every letter visible (24vw, max 360px). The jet slowly crosses it (22s; parked with reduced motion).
- **Phones:** one column for the brand, link columns two across, socials above the © line.

