# 🎨 F16s Freight OS — UI/UX Guide

How the product **looks and behaves**. Screens, states, tokens, accessibility, and interaction rules.

---

## 0. Document Map

| Document | Owns | This file defers to it for |
|---|---|---|
| [`database_relations_tree.md`](file:///Users/jomygeorge/Desktop/f16sefreight/database_relations_tree.md) | Schema — 56 tables, columns, FKs, DDL | Any column name or type |
| [`PRD.md`](file:///Users/jomygeorge/Desktop/f16sefreight/PRD.md) | Product — **which** screens exist, who sees them, what they do | Roles, tiers, permissions, workflows, formulas |
| [`implementation_guide.md`](file:///Users/jomygeorge/Desktop/f16sefreight/implementation_guide.md) | Build order — 8 checkpointed steps | Sequencing |
| **`ui_ux_guide.md`** *(this file)* | **How** it looks and behaves — tokens, states, layout, accessibility, micro-copy | — |

> [!IMPORTANT]
> **The boundary.** `PRD.md` says *"pricing sees the cross-staff matrix; operations does not."* This file says *what that matrix looks like, how it behaves at 900 px, what it shows while loading, and what an operations user sees instead.* Never restate a permission rule here — link to §2.4 of the PRD. Never define a screen's purpose here — that is product.

---

## 📖 Contents

1. [Design Principles](#1-design-principles)
2. [Design Tokens](#2-design-tokens)
3. [Status & Signal System](#3-status--signal-system)
4. [Data Display Rules](#4-data-display-rules)
5. [Component Library](#5-component-library)
6. [State Catalogue](#6-state-catalogue)
7. [Layout & Responsive](#7-layout--responsive)
8. [Navigation, Role & Tier Gating](#8-navigation-role--tier-gating)
9. [Screen Specifications](#9-screen-specifications)
10. [Forms & Validation](#10-forms--validation)
11. [Notifications & Feedback](#11-notifications--feedback)
12. [Accessibility](#12-accessibility)
13. [Micro-copy & Tone](#13-micro-copy--tone)
14. [Open Items](#14-open-items)

---

## 1. Design Principles

Five rules. When they conflict, the earlier one wins.

### 1.1 Density first — this is a tool, not a website

An operator lives in this screen for eight hours. Whitespace that looks generous in a screenshot becomes scrolling that costs them minutes per shipment. Target **information density comparable to a spreadsheet**, not a marketing page.

- Default row height **32 px**, compact mode **28 px**
- Base font **13 px**, never below 12 px for data
- A Kanban card shows job no, AWB, stage badge, cargo tags and customer in **≤ 96 px** of height

### 1.2 The screen tells you what to do next

Every view answers *"what needs me?"* before *"what exists?"*. Ranked worklists outrank charts; charts outrank tables; tables are drill-down. This is why the sales dashboard renders **Today's Actions above the charts**, and why the Kanban surfaces the Unassigned Pool at the top.

### 1.3 Never signal with colour alone

~8 % of men have a red-green colour vision deficiency, and freight operations skews heavily male. Since colour carries the *load-bearing* signal in this product — an overdue clearance, a low-confidence extraction, a credit hold — **every colour is paired with an icon and a text label**. See §3.

### 1.4 Destructive and outbound actions are always confirmed

Cancelling a shipment, sending a client email, posting to the ledger, closing a period. Each takes an explicit second action with the consequence stated in the confirmation. The system **never** sends a client email without operator consent (`PRD.md` §5.7) — the UI must make that impossible, not merely unlikely.

### 1.5 Keyboard-first

Triage, claim, classify and navigate without touching the mouse. Operators process hundreds of threads a day; a mouse round-trip per action is the difference between the tool being fast and being tolerated.

---

## 2. Design Tokens

> **No brand palette is established.** These are neutral, contrast-checked defaults. Swap the hex values for brand colours when they exist — the *token names and their semantic roles must not change*, because components reference roles, not hexes.

### 2.1 Colour — neutrals

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg-canvas` | `#F7F8FA` | `#0E1116` | App background |
| `--bg-surface` | `#FFFFFF` | `#161B22` | Cards, panels, drawer |
| `--bg-raised` | `#FFFFFF` | `#1C2129` | Modals, popovers |
| `--bg-sunken` | `#EEF0F4` | `#0A0D11` | Table headers, wells |
| `--border` | `#D8DCE3` | `#2A313C` | Default border |
| `--border-strong` | `#B4BAC5` | `#3A4351` | Focused / active |
| `--text-primary` | `#12161C` | `#E6EAF0` | Body |
| `--text-secondary` | `#5A6472` | `#9AA5B4` | Labels, meta |
| `--text-disabled` | `#9AA2AE` | `#5A6472` | Disabled |

### 2.2 Colour — semantic status

Each has a **base** (icon/text/border) and a **subtle** (fill). Base tokens meet **≥ 4.5:1** on `--bg-surface`.

| Token | Base | Subtle | Meaning |
|---|---|---|---|
| `--status-critical` | `#C4342B` | `#FCEBEA` | Overdue, blocked, failed, credit hold |
| `--status-warning` | `#9A6400` | `#FDF3E2` | Due tomorrow, low confidence, stale data |
| `--status-success` | `#1F7A48` | `#E9F6EE` | On track, posted, reconciled, sent |
| `--status-info` | `#1F5FA8` | `#E8F1FB` | Neutral notice, in progress |
| `--status-neutral` | `#5A6472` | `#EEF0F4` | Inactive, cancelled, archived, unknown |

> **`--status-warning` is deliberately dark amber (`#9A6400`), not yellow.** Pure yellow cannot reach 4.5:1 on white at any usable size. Yellow appears only as a **fill** (`--subtle`), never as text or an icon.

### 2.3 Typography

System stack — no webfont download on a tool people open all day:

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
```

| Token | Size / line | Weight | Use |
|---|---|---|---|
| `--type-display` | 24 / 32 | 600 | Page title |
| `--type-h1` | 18 / 26 | 600 | Section |
| `--type-h2` | 15 / 22 | 600 | Card / panel title |
| `--type-body` | 13 / 20 | 400 | Default |
| `--type-body-strong` | 13 / 20 | 600 | Emphasis in data |
| `--type-label` | 12 / 16 | 500 | Field labels, meta |
| `--type-micro` | 11 / 14 | 500 | Badges, timestamps |
| `--type-mono` | 13 / 20 | 400 | **All identifiers** |

> **Every identifier renders in `--font-mono`**: `ENQA-26-0001`, `JOBS-26-0001`, AWB `176-12345678`, container `MSKU1234567`, LOCODEs, GSTIN, HS codes. Proportional fonts make `0`/`O` and `1`/`l` ambiguous — in a customs manifest that is a rejected filing.

### 2.4 Spacing, radius, elevation, motion

4 px base scale: `--space-1: 4px` · `2: 8px` · `3: 12px` · `4: 16px` · `5: 24px` · `6: 32px` · `7: 48px`

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4 px | Inputs, badges |
| `--radius-md` | 6 px | Cards, buttons |
| `--radius-lg` | 10 px | Modals, drawer |
| `--elev-1` | `0 1px 2px rgb(0 0 0 / .06)` | Cards |
| `--elev-2` | `0 4px 12px rgb(0 0 0 / .10)` | Popovers, dropdowns |
| `--elev-3` | `0 12px 32px rgb(0 0 0 / .16)` | Modals, drawer |
| `--motion-fast` | 120 ms `ease-out` | Hover, focus |
| `--motion-panel` | 200 ms `cubic-bezier(.2,0,0,1)` | Drawer, split-pane |

**Motion is functional only** — it shows where a panel came from. No decorative animation, no entrance effects on data. All transitions respect `prefers-reduced-motion: reduce` and collapse to instant.

---

## 3. Status & Signal System

**The rule from §1.3, made concrete: colour + icon + text. Always all three.**

### 3.1 SLA / clearance status (Kanban cards, staff grid)

| State | Icon | Label | Colour | Condition |
|---|:---:|---|---|---|
| Overdue | `●` filled circle | `OVERDUE` | `--status-critical` | Clearance **today or past** and not sent to airline |
| Due soon | `▲` triangle | `DUE TOMORROW` | `--status-warning` | Clearance **tomorrow**, not sent a day before |
| On track | `✓` check | `ON TRACK` | `--status-success` | On schedule, or already sent |

> [!WARNING]
> **This replaces the 🔴/🟡/🟢 emoji shorthand used in `PRD.md` §5.6.** That table is correct about the *conditions*; it describes the signal as colour-only. Implementing it that way makes an overdue shipment invisible to a red-green colour-blind operator — and on this board, the colour *is* the entire alert. The shape and the word are not decoration; they are the accessible signal.

### 3.2 Job stage badge

Neutral chip, `--type-micro`, uppercase, `--font-mono`. Only three stages carry colour:

| Stage | Treatment |
|---|---|
| `INTAKE` `AI EXTRACTION` `VERIFICATION` `GENERATION` `PDF GENERATED` `SENT TO AIRLINE` `AIRLINE CONFIRMED` | `--status-neutral` |
| `COMPLETED` | `--status-success` + `✓` |
| `CANCELLED` | `--status-neutral`, **strikethrough**, 60 % opacity |
| *(enquiry)* `LOST` | `--status-neutral`, strikethrough — **only ever on an enquiry card, never a job** |

### 3.3 Extraction confidence

| Confidence | Treatment |
|---|---|
| High | Normal field, no decoration |
| Medium / Low | `--status-warning` 2 px left border + `--status-warning-subtle` fill + `▲` in the label + tooltip *"Low confidence — please verify"* |

Applies to every OCR-populated field (`PRD.md` §5.1). The operator must be able to **tab between only the flagged fields** — `Alt+↓` jumps to the next low-confidence field.

### 3.4 Other signals

| Signal | Treatment |
|---|---|
| Credit hold / limit breach | `--status-critical` banner + `●` + `CREDIT HOLD` — blocks `[Print DO]` and `[Finalize]` |
| Credit exposure ≥ 80 % | `--status-warning` inline chip on the client row |
| Tier-locked feature | Blurred content + centred lock card (§5.9) |
| Stale snapshot (> 1 h) | `--status-warning` banner above the dashboard with `last_computed_at` |
| Unread notification | `--status-critical` dot on the bell + count |
| Hazmat / IMDG | `--status-critical` `⬢` chip `HAZMAT — UN####` on the shipment header |

---

## 4. Data Display Rules

These are UI consequences of decisions already made in the PRD. Getting them wrong silently misrepresents the data.

### 4.1 NULL is not zero — render `—`

The analytics guard rails (`PRD.md` §7.3.4) return **NULL** wherever there is insufficient evidence: a client with no credit limit on file, no losses yet, no 365-day baseline, fewer than 5 shipments.

| Value | Renders as | Never as |
|---|---|---|
| `NULL` | `—` in `--text-disabled`, tooltip explaining why | `0`, `0%`, `N/A`, blank |
| `0` (a real measured zero) | `0` in `--text-primary` | `—` |

> **Why this matters.** `credit_util = NULL` means *"no credit limit on file."* `credit_util = 0` means *"they owe us nothing."* Rendering both as `0%` tells a rep an unlimited account is fully in credit. Every NULL must be visually distinct from a measured zero and must explain itself on hover.

### 4.2 Composite scores always show their components

`CHS` (Client Health Score) is **never** rendered as a bare number or a single traffic-light. It renders as a **stacked component bar** — momentum, churn, win rate, payment, ops health — each segment labelled and individually hoverable.

```
Client Health  72
 ██████░░  momentum   .81
 ███████░  churn      .67   ← weakest component
 ████████  win rate   .90
 █████░░░  payment    .55
 ██████░░  ops health .74
```

A rep cannot act on "amber". They can act on *"payment is the weak component."* If fewer than 3 components are non-NULL, render the whole score as `—`.

### 4.3 Margin is stripped, not hidden

Sales must **never** receive buy-side cost or margin (`PRD.md` §2.3.3) — at any tier.

> The fields are removed **server-side in the API Resource**, not hidden with CSS or a `v-if`. A hidden field is still in the payload, still in devtools, still in the browser cache. For a figure this commercially sensitive, absence from the response is the only real control.

### 4.4 Numbers, dates, identifiers

| Type | Format |
|---|---|
| Currency | Symbol + thousands separators + 2 dp, **right-aligned**, `--font-mono` |
| Weight | 3 dp + explicit unit (`450.000 kg`) — never a bare number |
| Volume | 3 dp + `CBM` / `CFT` |
| Percentage | 1 dp + `%`; `—` when NULL |
| Date | `DD-MMM-YYYY` (`12-Jun-2026`) — unambiguous across locales, matches the customs forms |
| Date + time | `DD-MMM-YYYY HH:mm` in **branch local time**, with the zone in the tooltip |
| Relative time | Under 24 h only (`2h 15m ago`), then absolute |
| Identifiers | `--font-mono`, never truncated without a copy affordance |

**All numeric table columns are right-aligned.** Text left. Never centre a number — it destroys column scanning.

---

## 5. Component Library

### 5.1 Buttons

| Variant | Use | Rule |
|---|---|---|
| **Primary** | The one forward action | **Max one per view region** |
| **Secondary** | Alternative actions | Outlined |
| **Ghost** | Tertiary, toolbar | No border until hover |
| **Danger** | Cancel Shipment, Void, Delete | `--status-critical`, always confirmed |

Heights: `sm 28px` · `md 32px` · `lg 40px`. Loading state shows an inline spinner and **keeps the label** — a button that becomes a bare spinner loses its meaning.

### 5.2 Cards

**Kanban job card** — `--bg-surface`, `--radius-md`, `--elev-1`, 8 px padding, ≤ 96 px tall:

```
┌────────────────────────────────────────┐
│ JOBA-26-0001          ● OVERDUE        │  ← mono id + SLA signal
│ 176-12345678                           │  ← AWB, mono
│ [VERIFICATION]  📦 25 pcs · ⚖ 450 kg   │  ← stage badge + cargo tags
│ Globex Corp                            │  ← customer
│ Ops: R. Kumar · Pricing: S. Nair   ✉ ⌸ │  ← both names + icon actions
└────────────────────────────────────────┘
```

Icon actions: `✉` mail (all columns) → `/inbox`; `⌸` message log (**`In Transit` only**) → `/message-log`. Both have 32 px hit targets and stop propagation so they never trigger the card's own click.

### 5.3 Tables

Sticky header, zebra off by default (borders instead), 32 px rows, sortable headers with an explicit arrow, resizable columns persisted per user. Row hover raises `--bg-sunken`. Selected row: 2 px `--status-info` left border.

**Pagination over infinite scroll** on every operational list — operators refer to "the job on page 2" and need a stable position to return to.

### 5.4 Drawer

Right-side, `--elev-3`, `--motion-panel`. Widths: **50 % split** (default, ≥ 1200 px) · **full-screen** (< 1200 px) · **pop-out** (container grid / charges ledger maximised). Header: title + tab bar + `[View Source Email]` + close. Footer is **sticky** and holds the commit actions (§10.4).

### 5.5 Modal vs popover vs drawer

| Use | When |
|---|---|
| **Popover** | ≤ 3 inputs, anchored to the trigger — `[Confirm Shipment]`, `[Mark as Lost]`, `[Cancel Shipment]` |
| **Modal** | Blocking decision or > 3 inputs — Submit CGM Data, discrepancy resolution |
| **Drawer** | Sustained parallel work against a record — document verification, cost sheet |

### 5.6 Bell / notification centre

Header icon, `--status-critical` dot with count. Panel: 420 px, max 480 px tall, ordered **`priority DESC, created_at DESC`**.

- **Pinned section** at the top for reassignment approvals — `--status-info` left border, `PINNED` micro-label, inline `[Accept]` / `[Reject]`
- **Chronological** below, grouped `Today` / `Yesterday` / `Earlier`
- Unread: `--bg-sunken` fill + left dot. Read: flat.
- **Auto-dissolve** — when a handover is withdrawn the row is hard-deleted; it **fades out over 200 ms and the list reflows**. It never leaves a "cancelled" tombstone.

### 5.7 Chips & tags

Cargo (`📦 25 pcs`, `⚖ 450 kg`, `▭ 2.5 CBM`), classification (`AIRLINE`, `CLEARANCE`, `TRUCKING`), attachments (filename + type icon + size), lanes (`INBOM → DEHAM`, mono).

### 5.8 The split-pane toggle

Top-right header icon. Active state is visibly pressed. `Ctrl/Cmd + \` toggles.

### 5.9 Tier lock (`UpgradeTeaser.vue`)

Real content rendered blurred (8 px) at 40 % opacity behind a centred card:

```
        🔒  Command feature
   Per-client revenue, tonnage and
   receivables need the Command plan.
        [ Request Upgrade ]
```

`[Request Upgrade]` raises a request to the tenant Boss — it never opens a payment flow. **Blur a representative skeleton, never real data**: blurred pixels are recoverable, and a Tactical tenant must not receive Command figures in the payload at all (same rule as §4.3).

---

## 6. State Catalogue

Every data view implements all seven. The two most often skipped — empty and no-permission — are the two users hit first.

| State | Treatment | Copy pattern |
|---|---|---|
| **Loading** | Skeleton rows matching final layout. Never a centred spinner on a full page — it destroys layout stability | — |
| **Empty (no data yet)** | Icon + one-line explanation + primary action | *"No enquiries yet. They appear here once mail is triaged."* |
| **Empty (filtered)** | Distinct from above — offer to clear filters | *"No jobs match these filters."* `[Clear filters]` |
| **Error (recoverable)** | Inline `--status-critical` panel, retry preserved | *"Couldn't load the board. [Retry]"* |
| **Error (fatal)** | Full-region message + support link + correlation id | *"Something went wrong. Reference `err_8f2a`."* |
| **No permission** | Explain **why**, never a blank screen | *"Only pricing staff can convert an enquiry."* |
| **Offline / degraded** | Persistent banner; keep numbers, hide AI prose | *"AI server unavailable — insights show numbers only."* |

> **The AI-degraded state is a product requirement, not a nicety.** `PRD.md` §7.3.6: if narration fails the dashboard renders every number and merely loses the prose. The UI must degrade visibly and without error styling — nothing is broken.

---

## 7. Layout & Responsive

### 7.1 Breakpoints

| Token | Range | Behaviour |
|---|---|---|
| `--bp-sm` | < 768 px | Read-only. Kanban → single column list. **Document forms are not supported** |
| `--bp-md` | 768–1199 px | Sidebar auto-collapses to the rail. Drawer opens **full-screen**, not split |
| `--bp-lg` | 1200–1599 px | Full 3-column inbox. Split-pane enabled |
| `--bp-xl` | ≥ 1600 px | Wider drawer permitted; tables show optional columns |

> **Below 768 px the product is read-only by design.** A 12-tab customs form with 35-character IATA limits cannot be completed accurately on a phone, and a mis-keyed manifest is a rejected filing. Mobile is for *checking* status, not *doing* work.

### 7.2 The split-pane cascade

```
DEFAULT (≥1200px)
┌────┬──────────┬──────────┬───────────────────────────┐
│ NAV│ Folders  │ Threads  │ Conversation              │
│200 │  220     │   320    │ fluid                     │
└────┴──────────┴──────────┴───────────────────────────┘

DRAWER OPEN (≥1200px)
┌──┬─────────────────────────┬──────────────────────────┐
│▤ │ Conversation      50%   │ Drawer workspace   50%   │
│60│                         │ [Upload|Focus Air|Cost]  │
└──┴─────────────────────────┴──────────────────────────┘
   ↑ rail          ↑ Folders + Threads slide off-screen left

DRAWER OPEN (<1200px)
┌──┬────────────────────────────────────────────────────┐
│▤ │ Drawer full-width    [← Back to timeline]          │
└──┴────────────────────────────────────────────────────┘
```

Transitions use `--motion-panel`. **Scroll position in the conversation is preserved** across the transition — losing the reader's place in a long thread is the fastest way to make the feature feel broken.

### 7.3 Grid & regions

12-column fluid, 16 px gutters, page max-width **1920 px** (dashboards; operational boards go full-bleed). Regions: sidebar → header (56 px, sticky, page title + global search + bell + avatar) → content → drawer.

---

## 8. Navigation, Role & Tier Gating

Permissions live in `PRD.md` §2.3–2.4. This section is only **how gating appears**.

### 8.1 The three gating treatments

| Situation | Treatment | Why |
|---|---|---|
| **Role forbids it** | Nav item **hidden**; direct URL → redirect to the role's home with a toast | An operations user has no path to `[Confirm Shipment]`. Showing a disabled control invites "why can't I?" tickets |
| **Tier forbids it** | Nav item **visible but locked** (🔒); click → `UpgradeTeaser.vue` | This is the upsell. Hiding it hides the reason to upgrade |
| **State forbids it** | Control **disabled** with a tooltip giving the reason | *"Cancel is blocked — this job has posted invoices."* The user can fix a state; they cannot fix their role |

> **The distinction is deliberate.** Role = hide. Tier = lock and advertise. State = disable and explain.

### 8.2 Landing route by login

| Login | Lands on | Because |
|---|---|---|
| Core (single user) | `/focus-air` or `/focus-sea` | Document generation is the entire product at this tier |
| Pricing | `/inbox` | The day starts in the mail |
| Operations | `/kanban` (own queue) | The day starts with assigned work |
| Sales | `/sales` | Today's Actions is the worklist |
| Accounts | `/financials` | The registers |
| Boss | `/boss` | Oversight |
| Superadmin | `admin.` monitor | Platform health |

### 8.3 Sidebar by tier

Core renders **no role navigation at all** — a single-user tool shows Focus Air / House Waybill / Settings and nothing else. There is no collapsed "locked" section implying hidden roles, because role separation is not a feature Core is missing; it is a concept that does not apply.

Tactical and Command render the full rail with tier locks on Command-only items (`/financials`, `/boss`, sales client-book widgets).

### 8.4 Portal identity

The active portal (`focusair.` / `focussea.`) is shown as a **persistent chip in the header** — `✈ FOCUS AIR` or `⚓ FOCUS SEA` — with a distinct accent on the sidebar top border. Air and sea data must never be mistaken for one another, and a user who forgets which portal they are in will misread every figure on screen.

---

## 9. Screen Specifications

### 9.0 Index by login — *start here*

A designer working a single persona should be able to enumerate every screen that login ever sees, at every tier, without reading the rest of this document. `—` = the login does not exist at that tier.

| Login | `core` | `tactical` | `command` |
|---|---|---|---|
| **Core user** | §9.9 Focus Air / House Waybill · §9.13 Settings *(mailbox only)* | — *(becomes the 4 roles)* | — |
| **🎯 Pricing** | — | §9.1 Inbox · §9.2 Kanban *(both views + OLI)* · §9.3 Drawer · §9.9 Documents · §9.11 Directories · §5.6 Bell | + Job Cost Sheet feeds real invoices |
| **🛠️ Operations** | — | §9.2 Kanban *(own queue)* · §9.1 Inbox · §9.3 Drawer · §9.9 Documents · §9.10 Manifest & cover letters · §9.12 Message log | *unchanged* |
| **📈 Sales** | — | §9.4 Sales *(branch aggregates, client panels locked)* · §9.11 Directories *(read)* | §9.4 full client book + Outstanding & Credit |
| **💰 Accounts** | — | — | §9.5 Financials *(7 sub-screens)* · §9.3 Drawer *(cost sheet + `[Finalize]`)* · §9.13 Settings *(finance)* |
| **🏛️ Boss** | — | §9.6 Boss *(operational panels)* · §9.13 Settings *(tenant)* · read access to §9.1/§9.2 | + financial panels **read-only** |
| **🔧 Superadmin** | §9.8 Platform portal — identical at every tier | | |

**Every login also gets:** §9.14 Auth & onboarding · §9.7 Help copilot · §5.6 Bell · global header + search.

> **Reading order for a designer.** Take one row. Open each referenced section. §8 tells you what is hidden, locked or disabled for that login; §6 tells you what every one of those screens does while loading, empty, or forbidden.


### 9.1 Inbox (`JobInbox.vue`)

```
┌────┬───────────┬────────────────┬──────────────────────────────┐
│NAV │ FOLDERS   │ THREADS        │ CONVERSATION            [⿴] │
│    │           │                │ ──────────────────────────── │
│    │ Inbox  12 │ ● Globex Corp  │ Globex Corp  ⏱ 08:12 to SLA │
│    │ Assigned  │   Rate BOM-FRA │ [Classify As… ▾]             │
│    │ Unassign 4│   ⏱ 12m  📎2   │ [Confirm Shipment][Mark Lost]│
│    │ Processing│ ───────────────│ ──────────────────────────── │
│    │ Awaiting  │   Emirates     │  ▸ collapsed history (3)     │
│    │ Completed │   AIRLINE      │  ● latest message            │
│    │           │   ⏱ —          │  📎 invoice.pdf  packing.pdf │
│    │           │                │ ┌──────────────────────────┐ │
│    │           │                │ │ ✉ Automated greeting     │ │
│    │           │                │ │ [Accept & Send] [Reject] │ │
│    │           │                │ └──────────────────────────┘ │
│    │           │                │ [Reply] [Reply All]          │
└────┴───────────┴────────────────┴──────────────────────────────┘
```

**Column 2 — thread row:** unread dot · customer · subject (1 line, ellipsis) · **SLA countdown** · attachment count · classification chip when not `customer_enquiry`. Sorted by `latest_message_received_at`.

**SLA countdown** is live, computed from `sla_policies.max_reply_time_minutes`: `--text-secondary` → `--status-warning` under 25 % remaining → `--status-critical` with `●` when breached. Non-enquiry threads show `—` (no SLA applies).

**Header controls are lifecycle-gated** (`PRD.md` §5.4):

| Lifecycle | Header shows |
|---|---|
| Enquiry, unconverted | `[Confirm Shipment]` · `[Mark as Lost]` |
| Job exists | `[Cancel Shipment]` — **`[Mark as Lost]` is removed, not disabled** |

The swap is one-way and permanent. A removed control cannot be misread as "temporarily unavailable."

**Consent banner** (§11.2) renders inline in the timeline where the message would appear — showing the actual drafted body, not a summary. The operator approves *what will be sent*, not a description of it.

**Keyboard:** `j`/`k` thread down/up · `Enter` open · `c` classify · `r` reply · `e` archive · `Cmd+\` split-pane · `Esc` close drawer.

### 9.2 Kanban (`OpsDashboard.vue`)

**Unassigned Pool scroller** — horizontal, top, `[+]`/`[−]` toggle persisted per user. Collapsed shows a count chip only. Clicking a card opens the assign overlay: `[Assign to Myself]` + staff search **with live OLI beside each name**.

**Process View** — exactly four columns, `vuedraggable`:

```
┌─ Processing 8 ─┬─ Awaiting Customer 3 ─┬─ In Transit 5 ─┬─ Completed 12 ─┐
│ [card]         │ [card]                │ [card] ⌸       │ [card]         │
```

Column headers carry live counts. **WIP is not limited** — freight volume is externally driven and a cap would hide work rather than prevent it.

**Staff View** — clearance-date matrix, vertically paginated:

```
              R. Kumar        P. Sharma       A. Nair
              (OLI 8.7 🟢)    (OLI 18.5 ●)    (OLI 4.2 🟢)
─────────────────────────────────────────────────────────
Mon 12 Jun    [JOBA-0001 ●]   [JOBA-0007 ▲]   —
Tue 13 Jun    [JOBA-0004 ✓]   [JOBA-0009 ✓]   [JOBS-0002 ✓]
```

**Magnetic drag-and-drop** — dragging across a column reassigns `ops_id`; across a row sets `planned_clearance_date`; both in one call. The target cell highlights on hover and the card snaps on drop. **Optimistic** with rollback + toast on failure.

**OLI badge** — `< cap` `--status-success`; `≥ cap` `--status-critical` + `●` + `OVERLOADED`, and the assign overlay warns before allowing a further assignment (warns, never blocks — a manager may have context the index does not).

**Filters** — staff · progress/processed · date range with a `[Today]` shortcut. Active filters render as removable chips; the set persists per user across sessions.

**Filtered staff banner** — active count, pending count, and an **idle-duration list** (`JOBA-26-0004 · pending 2h 15m`) sorted longest-first.

### 9.3 Drawer workspace

Tab bar: `Upload` (default) · `Focus Air` · `House Waybill` · `Focus Sea` · `Air Import` · `Job Cost Sheet` · `E-Docket` · `Search`. Tabs render per portal and direction (`PRD.md` §4.4); irrelevant tabs are **absent**, not disabled.

**Upload dropzone** — dashed border, drag-active state, accepts drag from the email thread *and* the OS. On drop: per-file progress → parse status → auto-switch to the populated form. Rejected MIME types fail immediately with the reason.

**Verification form** — extracted values pre-filled, low-confidence fields flagged (§3.3), a persistent count chip `▲ 3 fields need review`, and `Alt+↓` to jump between them. `[Confirm & Approve]` is disabled until every flagged field is visited (visited ≠ changed — confirming a correct extraction is a valid outcome and is what trains `pdf_extraction_corrections`).

**`[View Source Email]`** sits in the drawer toolbar at all times.

### 9.4 Sales dashboard (`SalesDashboard.vue`)

**Chart-first.** Order is fixed and load-bearing:

```
┌─ TODAY'S ACTIONS ──────────────────────────────── 5 ─┐
│ ● Globex — 26d since last air shipment (usual 9d)    │
│   Churn risk AT_RISK · ₹4.2L/yr at stake  [Call]     │
│ ▲ Initech — DSO 47d vs 30d terms, credit 83% [Chase] │
└──────────────────────────────────────────────────────┘
┌─ Tonnage trend ────────┐ ┌─ Win / loss ──────────────┐
│ (stacked bar, period)  │ │ (donut + loss reasons)    │
└────────────────────────┘ └───────────────────────────┘
┌─ Lane / country movement ────────────────────────────┐
┌─ My Accounts (drill-down table)  🔒 Command ─────────┐
```

- **Period selector** day / month / year. **No Air/Sea toggle** — the portal fixes the mode (`PRD.md` §2.3.3). The portal chip in the header is the only mode indicator.
- **Tactical** renders the same chart components over branch aggregates; the My Accounts and Outstanding panels are tier-locked (§5.9).
- **Unattributed bucket** — a visible row/tab for `sales_id IS NULL`, labelled *"Unattributed — awaiting customer registration"*, so unassigned enquiries are never silently invisible.
- **Action cards** state the fact, the stake, and one primary verb. Narration (`narrated_text`) renders below the numbers in `--text-secondary`; when NULL the card still renders with numbers only, no error, no placeholder.

### 9.5 Financials (accounts)

Register table → detail drawer. `[Finalize]` and `[Post Ledger]` are **primary + confirmed**, showing the resulting journal lines *before* commit:

```
Post INV-26-0001 to the ledger?
  Dr  1200-AR                 ₹1,18,000.00
  Cr  4000-Freight-Revenue    ₹1,00,000.00
  Cr  2200-GST-Output           ₹18,000.00
  ── balanced ✓
This cannot be undone. Corrections require a credit note.
                          [Cancel]  [Post to Ledger]
```

**Unposted queue** rows show blocking validation errors inline as `--status-critical` chips (`Period closed`, `Exchange rate missing`) — the reason is on the row, never behind a click.

**Reconciliation** — two-pane: bank transactions | candidate matches, confidence-ranked. Discrepancies open a popover: `Write-off to Bank Charges` · `Keep as Short-Paid` · `Mark as Discount`, each showing its ledger effect.

**Period control** — open/close/reopen with an audit log beside it. Reopening a closed period requires typing the period name to confirm.

### 9.6 Boss dashboard (`BossDashboard.vue`)

The only **cross-mode** view: every chart carries an explicit `Air | Sea | Both` toggle, defaulting to **Both**. Branch comparison matrix, staff audit, target assigner (progress rings), milestone latency heatmap (`--status-success` → `--status-critical` sequential ramp, **never** red-green diverging), revenue-leakage queue sorted by `delay_days` with `> 7` flagged.

**Staleness banner** above the fold when `financial_snapshots.last_computed_at > 1h`.

Financial panels are **read-only** — no `[Post]`, no `[Finalize]`, no period control (`PRD.md` §2.3.5).

### 9.7 Help copilot & visual reporter

Right-side panel, 380 px, over content. Two **static** quick actions above the input: `[Connect to Support Agent]` · `[Raise a Ticket]`.

- **`[Raise a Ticket]` bypasses the LLM entirely.** Cursor becomes a crosshair, hovered elements outline in `--status-info`, click captures selector + route + console logs + `html2canvas` screenshot → description form → submit. No conversational parsing anywhere in this path.
- **Answers** render with a `[Take Tour]` button when the retrieved chunk carries step metadata; the tour dims the page and highlights each target in sequence.
- AI answers are visually distinct from system content — `--status-info` left border and an "AI" label — so model output is never mistaken for authoritative system state.

### 9.8 Superadmin (`admin.f16sefreight.com`)

Visually distinct chrome (darker header, `PLATFORM` chip) so tenant and platform contexts are never confused. Health tiles (AI server / Horizon / queue depth / CPU-RAM) → log tail (monospace, wrapped, search) → failed-job inspector (stack trace + `[Retry]`) → tenant table (tier editor, OCR credit adjuster **with mandatory reason field**) → support desk.

### 9.9 Document forms — Focus Air, House Waybill, Focus Sea

The standalone route (`/focus-air`, `/focus-sea`) and the drawer tab render the **same component**. Standalone gets the full viewport; in the drawer it is the 50 % pane.

**Tab architecture** (Focus Sea, 12 tabs — Focus Air mirrors it with flight fields):

```
┌─ Header ─────────────────────────────────────────────────────┐
│ Shipment No JOBS-26-0001 │ Date │ Consol Type │ Cargo Type   │
│ Job Owner │ Doc User │ Quotation │ ☐ Sub Shipment │ ⏱ 38 min │
├──────────────────────────────────────────────────────────────┤
│ Entity │ Shipping │ Routing │ Goods │ Item │ BL │ Container  │
│ Pick Up │ Charges │ Financials │ Customs │ E-Docket         │
├──────────────────────────────────────────────────────────────┤
│                    (active tab body)                         │
├──────────────────────────────────────────────────────────────┤
│              [Save] [Save & Close] [Save & New] [Close]      │
└──────────────────────────────────────────────────────────────┘
```

- **Tab state** — a tab with validation errors shows `●` in `--status-critical`; a **disabled** tab (§10.5) is greyed with a tooltip giving the reason. Disabled tabs stay visible so the form's full shape is legible.
- **Entity tab** — paired search + address block. The textarea is read-only until an entity is picked (§10.5).
- **Item tab** — CBM and chargeable weight compute live and render in `--text-secondary` with a `calculated` chip; they are never directly editable.
- **Container tab** — ISO 6346 check digit validates on blur; failure shows the expected format inline.
- **Charges tab** — the buy/sell grid. **Buy-rate columns are absent from the DOM for sales** (§4.3).
- Session timer and row lock per §10.6.

### 9.10 Manifest filing & cover letters *(operations)*

**`/manifest-filing`** — filter bar (filing type, consol job no, transaction status, custom house, date range, ICEGATE ID) over a results grid; `[Submit CGM Data]` opens a **modal**. The modal's status box is a read-only monospace log that streams validation output; `[Send for Signature]` shows DSC token state. Character limits are hard-enforced per §10.3 — an over-length field blocks submit and names the ICEGATE rule.

**`/cover-letters`** — two-pane: letter metadata (recipient, contact, subject, body) | a **checklist of enclosed documents** pulled from `job_documents`. Checked items assemble the merged packet; the preview pane shows page count before send. `[Generate & Send]` is confirmed and states the recipient.

### 9.11 Customer & partner directories

**`/customers`**, **`/partners`** — searchable tables. Search matches **name or email domain suffix** (`globex.com` finds *Globex Corp*), with the matched domain highlighted in the result row.

| Column | Notes |
|---|---|
| Name · Email domain · Default port · Branch | Always |
| Sales rep | **Command only**; `—` when `sales_id IS NULL` |
| Credit limit · Payment terms · Outstanding | **Command only**, right-aligned; exposure chip ≥ 80 % |

Detail drawer holds tax/banking fields. **Bank account and IFSC render masked** (`••••4821`) with a reveal action that is audit-logged — they are encrypted at rest and must not be casually visible on screen.

### 9.12 Message log (`/message-log`)

Chronological SITA/IATA Type B transmission audit for one job. Monospace, wrapped, each entry showing direction (`▲ sent` / `▼ received`), message type (`FWB`, `FHL`, `FSU/ARR`), timestamp and raw payload in a collapsible block. Read-only. Filter by type; copy-raw affordance per entry.

### 9.13 Settings

Left sub-nav within `/settings`. **Sections render only for logins that own them** (`PRD.md` §2.3.7) — a section a login cannot own is absent, not disabled.

| Section | Owner | UI notes |
|---|---|---|
| Users & designations | Boss | Table + role picker; PIMA address field; designation change warns about access impact |
| Email triage rules | Boss | Rule list ordered by priority, drag to reorder. Each row shows **hit count, override count and accuracy %** (`1 − overrides/hits`); accuracy < 70 % flags `--status-warning`. `[+ Add Rule]` opens a modal with a **live regex tester** against sample subjects |
| SLA policies | Boss | Minutes per tier |
| Workload / OLI | Boss | Complexity coefficients, α, β, urgency multipliers, capacity cap — with a **live worked example** recomputing as values change |
| Finance | Accounts | Chart of accounts tree, rate cards, bank-to-branch mapping |
| Mailboxes | Each user | Connected accounts, provider buttons, connection health. On domain rejection show the tenant's allowed suffixes explicitly |

### 9.14 Authentication & onboarding

**Pre-login company selection** — before credentials. Searchable list of registered tenants; the choice binds `company_id`.

```
┌──────────────────────────────────────┐
│            F16s Freight OS           │
│         ✈ FOCUS AIR  (from host)     │
│  ┌────────────────────────────────┐  │
│  │ Select your company        ▾   │  │
│  └────────────────────────────────┘  │
│  Email     [                     ]   │
│  Password  [                     ]   │
│            [ Sign in ]               │
└──────────────────────────────────────┘
```

- **The portal is shown before sign-in**, derived from the subdomain, so a user never authenticates into the wrong mode by accident.
- Auth errors are **generic** — *"Email or password is incorrect"* — never revealing which was wrong, and never whether an account exists.

**User registration** — under an existing company. **Origin port is required** and uses a LOCODE search-select showing `INMAA — Chennai (sea)`; free text is not accepted. PIMA address is **not** self-serve (Boss assigns it).

**First-run empty states** matter disproportionately here: a brand-new tenant sees an empty inbox, empty board and empty directories at once. Each carries its own next action — *"Connect a mailbox to start receiving enquiries"* → `/settings/mailboxes`.

---

## 10. Forms & Validation

### 10.1 Layout

Single column within a tab; two columns only for genuinely paired fields (weight/unit, date/time). Labels **above** inputs. Required marked on the label, not by colour alone. Help text below the label; errors replace help text.

### 10.2 Validation timing

| When | What |
|---|---|
| **On blur** | Format — IMO `^[0-9]{7}$`, HS `^\d{6,10}$`, LOCODE `^[A-Z]{5}$`, container ISO 6346 check digit |
| **On change** | Only for computed fields (CBM from dimensions, chargeable weight, transit days) |
| **On submit** | Cross-field and server rules |
| **Never on focus** | Never show an error on a field the user has not yet completed |

Errors: `--status-critical` border + `●` + message below. First invalid field receives focus and scrolls into view. **A failed submit must never clear entered data.**

### 10.3 Character limits are hard constraints, not hints

IATA Cargo-XML enforces **35 characters per line** for names and addresses; ICEGATE enforces MBL/HBL 20, container 11, seal 15, package code 3. Exceeding them means a **rejected customs filing**, so:

- Live counter appears at 80 % of the limit
- `--status-warning` at 90 %, `--status-critical` at 100 %
- **Hard `maxlength`** — the field does not accept the 36th character
- Tooltip names the constraint: *"IATA Cargo-XML limit — 35 characters per line"*

### 10.4 Footer actions

Sticky: `[Save]` · `[Save & Close]` · `[Save & New]` · `[Close]`.

| Action | Behaviour |
|---|---|
| Save | Commits, stays, toast, New → Edit mode |
| Save & Close | Commits, returns to the list |
| Save & New | Commits, clears, **keeps branch/date/user defaults**, new number |
| Close | Releases the row lock; if dirty, confirms discard |

### 10.5 Conditional locking

Driven by `jobs.cargo_type` (`PRD.md` §5.8). A disabled tab shows a tooltip stating **why** — *"Containers do not apply to LCL — cargo is consolidated at master level."* Locking without a reason reads as a bug.

Address textareas are **read-only until an entity is selected** from the lookup above them; the placeholder says *"Select a company to populate the address."*

### 10.6 Row lock & session timer

Opening a record for edit takes a 45-minute Redis lock. The header shows a countdown, `--status-warning` under 5 minutes with an `[Extend]` button. On expiry: save-or-discard prompt, then redirect. If another user holds the lock, the record opens **read-only** naming the holder.

---

## 11. Notifications & Feedback

### 11.1 Routing rule — which channel carries what

*(Resolves the eight overlapping alert surfaces identified during review.)*

| Channel | Carries | Rule |
|---|---|---|
| **Bell** | Everything **system-initiated, actionable and addressed to a person** — reassignment approvals, assignment changes, SLA breaches, stale-enquiry nudges, OCR quota exhaustion, hazmat compliance alerts | **The single queue.** Persists until actioned. New alert types default here |
| **Contextual (inline)** | Signals attached to the object on screen — consent banners, SLA card colouring, low-confidence fields, staleness banners, validation errors | Stays with its object. Never duplicated into the bell |
| **Toast** | Transient confirmation of *the user's own* action — "Saved", "Assigned to R. Kumar" | Auto-dismiss 4 s. **Never** for anything needing action or a record |
| **Modal** | Blocking, irreversible confirmations only | Never for information |

> **Assignment pushes and hazmat alerts do not get bespoke pop-ups.** They were separately specified as WebSocket pop-ups; both are system-initiated and actionable, so both route to the bell with elevated `priority`. Three visually different alerts for three equally urgent things is how users learn to ignore all of them.

**Live delivery** rides `private-branch.{agent_id}` via Soketi. A newly arrived bell item animates in over 120 ms; the badge count increments with no sound and no browser notification unless the user opts in.

### 11.2 Consent banners (client email gate)

Renders inline in the conversation feed with the **full drafted body and attachment list**:

```
┌─ ✉ Automated message — awaiting your approval ──────┐
│ To: ops@globex.com                                  │
│ Subject: Re: Rate request BOM → FRA                 │
│ ─────────────────────────────────────────────────── │
│ Hi Anita,                                           │
│ I am Sanjay, I will be servicing you today…         │
│ 📎 MAWB-176-12345678.pdf   📎 HAWB-0012.pdf         │
│                        [Reject]  [Accept & Send]    │
└─────────────────────────────────────────────────────┘
```

`[Accept & Send]` is primary; `[Reject]` is secondary and requires no reason. **There is no "always send" preference** — every message is approved individually (`PRD.md` §5.7).

### 11.3 Error feedback by status code

| Code | Situation | UI |
|---|---|---|
| `409` | Claim lost — someone else took the job | Toast *"Already claimed by R. Kumar"* + card refreshes to its new owner |
| `422` credit | Limit breached | `--status-critical` banner on the Payment tab; `[Print DO]` / `[Finalize]` disabled with the reason |
| `422` cancel | Job has posted invoices | Popover blocks with *"Void or credit-note the posted invoice first"* + link |
| `422` demote | Enquiry already converted | *"This enquiry has a confirmed shipment — cancel the job instead"* + link |
| `403` tier | Below required tier | `UpgradeTeaser.vue` |
| `403` role | Wrong designation | Redirect to role home + toast |

Every one names **what to do next**, not merely what failed.

### 11.4 The chatbot is not a notification channel

The help copilot **explains and guides**; the bell **carries state and action**. A notification may hand off to the copilot (`[Why is this?]` → RAG answer, `[Take Tour]` → guided walkthrough), but operational alerts are never delivered as chat messages.

> Chat is chronological and ephemeral — a reassignment approval that must pin to the top until actioned, and vanish silently when withdrawn, cannot behave correctly in a transcript. Mixing authoritative alerts with AI-generated prose also destroys the distinction between system state and model output that the deterministic ticket path was designed to protect.

### 11.5 Two different things called "credit"

*(Naming collision found during review — they share a word and nothing else.)*

| | **OCR quota exhausted** | **Customer credit exposure** |
|---|---|---|
| Means | Tenant's vision-OCR credits are spent; the parse **failed** | A *client* is near their `credit_limit` |
| Audience | The uploader | Sales (Command) + accounts |
| Urgency | **Now** — work is blocked | Days of warning |
| Channel | Bell + inline failure on the upload | Dashboard chip + client row |
| Label | **"OCR quota exhausted"** | **"Credit exposure 83 %"** |

Never use the bare word "credit" in UI copy for either.

---

## 12. Accessibility

**Target: WCAG 2.1 AA.**

| Requirement | Rule |
|---|---|
| Contrast | 4.5:1 body, 3:1 large text and UI boundaries. All §2.2 base tokens comply |
| **Colour independence** | **Every status = colour + icon + text** (§3). Verify by rendering the Kanban in greyscale — every signal must survive |
| Keyboard | Every action reachable. Logical tab order. Visible 2 px `--status-info` focus ring, never `outline: none` |
| Focus management | Modal/drawer traps focus and restores it to the trigger on close |
| Screen readers | Semantic landmarks; icon-only buttons carry `aria-label`; live regions announce toasts and bell arrivals |
| Forms | Every input has a `<label>`; errors linked via `aria-describedby`; `aria-invalid` on failure |
| Tables | `<th scope>`, `aria-sort` on sortable headers |
| Drag-and-drop | **Keyboard alternative required** — the Kanban card menu offers `Assign to…` and `Set clearance date…`. Drag alone is not an accessible affordance |
| Motion | Honour `prefers-reduced-motion` |
| Zoom | Usable to 200 % without horizontal scroll |
| Timing | The 45-minute row lock is extendable before expiry (§10.6) |

**Greyscale test is mandatory before any board or dashboard ships.** It is the fastest way to catch a colour-only signal.

---

## 13. Micro-copy & Tone

**Plain, specific, industry-literate.** Users are freight professionals — say *AWB*, *HBL*, *chargeable weight*. Never over-explain the domain; always explain the *system*.

| Do | Don't |
|---|---|
| "Cancel is blocked — this job has posted invoices." | "Action not permitted." |
| "No enquiries yet. They appear here once mail is triaged." | "No data." |
| "Only pricing staff can convert an enquiry." | "Access denied." |
| "OCR quota exhausted — parsing paused." | "Credit error." |

**Buttons are verbs describing the outcome** — `[Confirm Shipment]`, `[Post to Ledger]`, `[Accept & Send]`. Never `[OK]`, `[Submit]`, `[Yes]`.

**Confirmations state the consequence and its reversibility:**

> "Cancel `JOBA-26-0001`? The shipment stops and AWB `176-12345678` returns to stock. The job stays visible for reporting. **This cannot be undone** — restarting requires a new enquiry."

**Never blame the user** ("you entered an invalid value" → "IMO number must be 7 digits"). **Never apologise for the system twice.** **Never use "simply" or "just".**

---

## 14. Open Items

| Item | Needs |
|---|---|
| **Brand palette** | §2 uses neutral, contrast-checked defaults. Swap the hex values when brand colours exist — **keep the token names**, components reference roles not hexes |
| **Logo & favicon** | Not specified |
| **Dark mode** | Tokens defined; per-component audit not done. Ship light first |
| **Icon set** | Recommend a single open family (Bootstrap Icons / Lucide). Mixing sets is the most visible inconsistency in a tool this dense |
| **Charting** | ApexCharts confirmed; needs a token-mapped theme + a **colour-blind-safe categorical series palette** |
| **Localisation** | English only. Dates already use the unambiguous `DD-MMM-YYYY` form |
| **Print styles** | AWB/HBL/DO/manifest PDFs are server-generated. Screen print styles undefined |
| **Component prototypes** | This is a written spec. No Figma or Storybook exists yet |