# 🎨 F16s Freight OS — UI/UX Guide

How the product **looks and behaves**. Screens, states, tokens, accessibility, and interaction rules.

---

## 0. Document Map

| Document | Owns | This file defers to it for |
|---|---|---|
| [`database_relations_tree.md`](file:///Users/jomygeorge/Desktop/f16sefreight/database_relations_tree.md) | Schema — 58 tables, columns, FKs, DDL | Any column name or type |
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
9. [Experience by Login](#9-experience-by-login)
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

**Attachment chips have three fetch states** (`email_attachments.fetch_state`), because we cache mailbox files rather than archive them (`PRD.md` §9.3):

| State | Chip | On click |
|---|---|---|
| `cached` | Normal | Opens instantly from our storage |
| `evicted` | Normal — **visually identical** | Brief inline spinner while we re-fetch from the mailbox, then opens **in the portal**. Never a redirect out to Gmail/Outlook |
| `unavailable` | `--status-neutral`, 60% opacity, `▲` | Tooltip: *"Original no longer available in the connected mailbox"* |

> **`evicted` must look exactly like `cached`.** The eviction window is our cost optimisation, not the user's concern — showing it as a distinct state makes a perfectly normal file look broken. The only visible difference is a sub-second spinner.
>
> **`unavailable` still shows filename, size, sender and date.** The row is never deleted, so the metadata survives as evidence the document existed. A bare 404 destroys that record.

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

## 9. Experience by Login

**One heading per login. Everything that login gets, and how it changes by tier.**

> **How to read this section.** Each login below is self-contained — landing route, navigation, every screen, tier differences, and what is deliberately absent. Shared mechanics live elsewhere and are referenced, never repeated: **component behaviour** in §5, **loading/empty/error states** in §6, **hide vs lock vs disable** in §8.
>
> `PRD.md` §2.3 is the authority on *permissions*. This section is the authority on *what the person actually sees*.

### 9.0 Login availability at a glance

| Login | `core` | `tactical` | `command` | Section |
|---|:---:|:---:|:---:|---|
| Core user | ✅ **only login** | — | — | §9.2 |
| 🎯 Pricing | — | ✅ | ✅ | §9.3 |
| 🛠️ Operations | — | ✅ | ✅ | §9.4 |
| 📈 Sales | — | ✅ limited | ✅ full | §9.5 |
| 💰 Accounts | — | — | ✅ | §9.6 |
| 🏛️ Boss | — | ✅ limited | ✅ full | §9.7 |
| 🔧 Superadmin | ✅ | ✅ | ✅ | §9.8 |

---

### 9.1 Shared foundation — every login gets these

#### App shell

```
┌──────┬───────────────────────────────────────────────────────┐
│ NAV  │ HEADER  ✈ FOCUS AIR   [ global search ]    🔔³  ◍ RK  │
│ 200  ├───────────────────────────────────────────────────────┤
│ px   │                                                       │
│      │                     CONTENT REGION                    │
│      │                                                       │
└──────┴───────────────────────────────────────────────────────┘
```

- **Portal chip** (`✈ FOCUS AIR` / `⚓ FOCUS SEA`) is persistent and accented on the sidebar top border. Air and sea figures must never be confusable (§8.4). Boss is the only login that also gets an `Air | Sea | Both` toggle inside its charts.
- **Global search** — `Cmd/Ctrl + K`. Scoped to what the login may see. Matches enquiry no, job no, AWB/MBL, container, customer name and email domain. Results grouped by type, identifiers in `--font-mono`.
- **Bell** — §5.6. Same component for every login; contents differ by role.
- **Avatar menu** — profile, email signature, `/settings/mailboxes`, sign out.

#### Authentication & onboarding

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

- Company selection precedes credentials and binds `company_id`.
- **The portal is shown before sign-in**, derived from the subdomain, so nobody authenticates into the wrong mode.
- Auth errors are generic — *"Email or password is incorrect"* — never revealing which was wrong or whether an account exists.
- **Registration** requires an origin port via LOCODE search-select (`INMAA — Chennai (sea)`); free text is rejected. PIMA address is assigned by the Boss, not self-serve.
- **First run** — a new tenant meets an empty inbox, board and directory simultaneously. Each empty state carries its own next action: *"Connect a mailbox to start receiving enquiries"* → `/settings/mailboxes`.

#### Help copilot

Right panel, 380 px. Two **static** quick actions above the input: `[Connect to Support Agent]` · `[Raise a Ticket]`.

- `[Raise a Ticket]` **bypasses the LLM entirely** — crosshair cursor, hovered elements outline in `--status-info`, click captures selector + route + console logs + `html2canvas` screenshot → description form → submit.
- Answers carry `[Take Tour]` when the retrieved chunk has step metadata; the tour dims the page and highlights each target in sequence.
- AI output is visually distinct — `--status-info` left border + "AI" label — so it is never mistaken for authoritative system state.

#### Shared layout skeletons

Three layouts recur across logins. Each login section below states *what it puts in them*.

```
A · THREE-COLUMN INBOX          B · DRAWER SPLIT (≥1200px)
┌──┬─────┬──────┬───────────┐   ┌──┬──────────────┬──────────────┐
│  │Fold-│Thread│Conversa-  │   │▤ │ Conversation │ Drawer   50% │
│  │ers  │list  │tion       │   │60│         50%  │ [tabs]       │
└──┴─────┴──────┴───────────┘   └──┴──────────────┴──────────────┘

C · KANBAN
┌─ Unassigned Pool  [+]/[−] ──────────────────────────────┐
├─ Processing ─┬─ Awaiting Cust ─┬─ In Transit ─┬─ Done ──┤
```

---

### 9.2 🧾 Core User — *the only login on `core`*

**Available:** `core` only. On upgrade to Tactical this login is replaced by the four role logins.

**Lands on** `/focus-air` or `/focus-sea` (whichever the subdomain resolves).

**Navigation** — deliberately minimal. **No role navigation is rendered at all**: there is no inbox, no board, no locked sections implying hidden roles. Role separation is not a feature Core lacks; it is a concept that does not apply.

| Nav item | Route |
|---|---|
| Focus Air | `/focus-air` |
| House Waybill | `/house-waybill` |
| Focus Sea *(sea portal)* | `/focus-sea` |
| Settings | `/settings/mailboxes` only |

**Screens**

| Screen | What the Core user gets |
|---|---|
| **Document forms** | Full-viewport (no drawer — there is no email thread to split against). Tab architecture per §9.9. Upload → `pdfplumber` coordinate extraction → verify → `[Generate PDF]` |
| **Upload** | Dropzone accepts PDF/image. **No AI parsing** — a scanned document that needs vision OCR fails with *"Scanned documents need the Tactical plan"* + `UpgradeTeaser` |
| **Settings** | Mailbox section only, and it is **tier-locked** — shown to advertise the upgrade |

**Absent for this login:** inbox, enquiries, jobs, Kanban, assignment, analytics, financials, bell notifications (nothing generates them).

**Upgrade surface** — because Core is thin by design, the two locked touchpoints (AI parsing, mailbox sync) are the entire upsell. Both use `UpgradeTeaser.vue` (§5.9) and name the plan that unlocks them.

---

### 9.3 🎯 Pricing — *the commercial owner*

**Available:** `tactical`, `command`. **Lands on** `/inbox`.

**Navigation:** Inbox · Kanban · Focus Air / Sea · House Waybill · Customers · Partners · Settings *(read)*

#### Screens

**① Inbox** — layout **A**, the primary workspace.

```
┌────┬───────────┬────────────────┬──────────────────────────────┐
│NAV │ FOLDERS   │ THREADS        │ CONVERSATION            [⿴] │
│    │ Inbox  12 │ ● Globex Corp  │ Globex Corp  ⏱ 08:12 to SLA │
│    │ Assigned  │   Rate BOM-FRA │ [Classify As… ▾]             │
│    │ Unassign 4│   ⏱ 12m  📎2   │ [Confirm Shipment][Mark Lost]│
│    │ Processing│ ───────────────│  ▸ collapsed history (3)     │
│    │ Awaiting  │   Emirates     │  ● latest message            │
│    │ Completed │   AIRLINE      │ ┌──────────────────────────┐ │
│    │           │   ⏱ —          │ │ ✉ Automated greeting     │ │
│    │           │                │ │ [Accept & Send] [Reject] │ │
│    │           │                │ └──────────────────────────┘ │
└────┴───────────┴────────────────┴──────────────────────────────┘
```

- **Thread row** — unread dot · customer · subject (1 line) · **live SLA countdown** · attachment count · classification chip when not `customer_enquiry`.
- **SLA countdown** from `sla_policies`: `--text-secondary` → `--status-warning` under 25 % → `--status-critical` + `●` when breached. Non-enquiry threads show `—`.
- **`[Classify As…]`** — the control that mints `enquiry_no`. Demoting a converted enquiry returns `422` with a link to cancel the job instead.
- **Branch picker (multi-branch clients)** — when the sender's domain matches **several** branches of one client group, the system does **not** guess. The triage panel shows a required selector listing only that group's branches, each with its sales rep:

  ```
  ⚠ @globex.com matches 3 branches — select one
    ○ Globex Chennai   R. Kumar
    ○ Globex Mumbai    P. Sharma
    ○ Globex Delhi     R. Kumar
  ```

  Until chosen, `customer_id` and `sales_id` stay NULL and the enquiry sits in the **Unattributed** bucket. Guessing would assign the enquiry's revenue, tonnage and commission to the wrong rep.
- **Lifecycle-gated header** — one-way, permanent:

  | Lifecycle | Header |
  |---|---|
  | Enquiry, unconverted | `[Confirm Shipment]` · `[Mark as Lost]` |
  | Job exists | `[Cancel Shipment]` — `[Mark as Lost]` is **removed, not disabled** |

- **`[Confirm Shipment]`** opens a 3-field popover (AWB/MBL · operator — **with live OLI beside each name** · clearance date).
- **Consent banner** renders the full drafted body inline (§11.2).
- **Keyboard:** `j`/`k` · `Enter` open · `c` classify · `r` reply · `e` archive · `Cmd+\` split · `Esc` close.

##### Composer

```
┌─ Reply ──────────────────────────────────────────────┐
│ To  [anita@globex.com ×]              Cc  Bcc        │
│ ──────────────────────────────────────────────────── │
│  B  I  U  │ • ≡ │ 🔗 │ ❝ │ ⌫fmt        📎 Attach     │
│ ──────────────────────────────────────────────────── │
│ Hi Anita,                                            │
│ ▸ On 12 Jun, Anita wrote: … (collapsed quote)        │
│ ──────────────────────────────────────────────────── │
│ — Sanjay Nair · F16s Freight  (signature preview)    │
│ Draft saved 3s ago            [Discard]  [Send ▾]    │
└──────────────────────────────────────────────────────┘
```

- **Eight controls only** — bold, italic, underline, bulleted list, numbered list, link, blockquote, clear formatting. No fonts, colours, sizes, tables or inline images: every extra control is another way to emit markup that breaks in a client we cannot test.
- **Quoted original is a collapsed `<blockquote>`**, expandable, never silently removed — the thread is a commercial record.
- **Signature renders live** below the body, greyed and not editable inline. Editing happens in settings so it cannot be mangled per-message.
- **`[Send ▾]`** — the caret offers *Send now*, skipping the undo window for users who find the hold irritating.
- **Autosave indicator** — *"Draft saved 3s ago"* in `--text-secondary`. Silent autosave leaves people unsure whether it is safe to close the tab.

##### Undo-send toast

Replaces the composer immediately after `[Send]`:

```
┌──────────────────────────────────────────────┐
│ ✓ Sending to anita@globex.com …    [Undo]  ✕ │
└──────────────────────────────────────────────┘
```

Persists for the full 15-second window with a subtle countdown ring. `[Undo]` sets `send_state = 'cancelled'`, **nothing ever leaves**, and the composer reopens with content intact.

> **This is the one exception to the 4-second auto-dismiss rule (§11.1).** A toast that expires before the undo window makes the affordance decorative.

##### Outbox states

A send in flight occupies its own row on the thread, so failure is never silent:

| `send_state` | Renders |
|---|---|
| `queued` | `--status-info` · *"Sending in 12s"* · `[Undo]` |
| `sending` | Inline spinner · *"Sending…"* |
| `sent` | Normal message, `--status-success` check on hover |
| `failed` | `--status-critical` · **`send_error` verbatim** · `[Retry]` `[Discard]` |
| `cancelled` | Not rendered — it never existed |

> **Show the provider's error text, not a paraphrase.** *"Recipient address rejected: mailbox full"* tells the user what to do. *"Failed to send"* does not.

**② Kanban** — layout **C**, *both* views.

*Process View* — four columns, live counts, `vuedraggable`. WIP is **not** limited; freight volume is externally driven and a cap would hide work rather than prevent it.

*Staff View* — the cross-staff clearance matrix pricing uses to balance load:

```
              R. Kumar        P. Sharma       A. Nair
              (OLI 8.7 ✓)     (OLI 18.5 ●)    (OLI 4.2 ✓)
─────────────────────────────────────────────────────────
Mon 12 Jun    [JOBA-0001 ●]   [JOBA-0007 ▲]   —
Tue 13 Jun    [JOBA-0004 ✓]   [JOBA-0009 ✓]   [JOBS-0002 ✓]
```

- **Magnetic drag-and-drop** — across a column reassigns `ops_id`, across a row sets `planned_clearance_date`, both in one call. Optimistic with rollback + toast on failure. **Keyboard alternative required** (§12).
- **OLI badge** — `≥ cap` renders `--status-critical` + `●` + `OVERLOADED`; the assign overlay **warns but never blocks** (a manager may have context the index lacks).
- **Unassigned Pool** scroller with `[+]`/`[−]`, persisted per user.
- **Filters** — staff · progress · date range with `[Today]`; active filters render as removable chips, persisted per user.
- **Filtered staff banner** — active count, pending count, **idle-duration list** (`JOBA-26-0004 · pending 2h 15m`) sorted longest-first.

**③ Drawer** — layout **B**. Tabs: Upload · Focus Air / Sea · House Waybill · **Job Cost Sheet** · E-Docket · Search. `[View Source Email]` always present in the toolbar.

**④ Document forms** — §9.9. **⑤ Directories** — §9.10.

**⑥ Bell** — reassignment approvals **pinned at top** with inline `[Accept]` / `[Reject]`; withdrawn requests fade out over 200 ms and the list reflows, leaving no tombstone.

#### Tier differences

| | `tactical` | `command` |
|---|---|---|
| All of the above | ✅ | ✅ |
| Job Cost Sheet | Operational estimate | Feeds **real** invoices/vouchers |
| `[Finalize]` on the cost sheet | ❌ | ❌ — **accounts only**, at every tier |

#### Absent for this login

Analytics dashboards (nav hidden; direct URL redirects to `/inbox`) · `/financials` · `/boss` · ledger posting · other branches.

---

### 9.4 🛠️ Operations — *the executor*

**Available:** `tactical`, `command`. **Lands on** `/kanban`, **filtered to their own queue**.

**Navigation:** Kanban · Inbox · Focus Air / Sea · House Waybill · Manifest Filing · Cover Letters · Message Log

#### Screens

**① Kanban (own queue)** — layout **C**. Same Process View as pricing, but:

- Defaults to `ops_id = me`; **the cross-staff Staff View is absent**, not disabled
- Cards show **both** the ops and pricing names so collaborators share context
- Cards carry `✉` mail (all four columns) → `/inbox`, and `⌸` message log (**`In Transit` only**) → `/message-log`. 32 px hit targets, propagation stopped so they never trigger the card's own click
- Clicking an `In Transit` card opens the drawer **directly on Routing & Voyage/Flight Details**; any other card opens the drawer on the tab matching the current stage

**② Inbox** — layout **A**, but the header carries **no lifecycle controls**: no `[Confirm Shipment]`, no `[Assign Task]`, no `[Mark as Lost]`. Hidden entirely (§8.1 — role forbids ⇒ hide). Their primary tool here is the `[Analyze PDF]` dropzone.

**③ Drawer** — verification is the core loop:

- Low-confidence fields flagged per §3.3, with a persistent count chip `▲ 3 fields need review` and `Alt+↓` to jump between them
- `[Confirm & Approve]` stays disabled until every flagged field is **visited** — visited ≠ changed; confirming a correct extraction is a valid outcome and is what trains `pdf_extraction_corrections`
- `[Save Draft]` · `[Generate PDF]`

**④ Claim flow** — claiming from the Unassigned Pool is atomic; losing the race shows a toast *"Already claimed by R. Kumar"* and the card refreshes to its new owner.

**⑤ Handover request** — `[Request handover]` in the drawer stages `pending_ops_id` **without** changing the live assignment; the card shows a `HANDOVER PENDING` chip. `[Withdraw]` reverts it and auto-dissolves the pricing owner's bell notification.

**⑥ Manifest filing & cover letters** — §9.11. **⑦ Message log** — §9.12. **⑧ Document forms** — §9.9.

#### Tier differences

**None.** Operations is identical on Tactical and Command — the upgrade is commercial, not operational. This is worth stating on the upgrade comparison screen so ops staff are not promised a change they will not see.

#### Absent for this login

`[Confirm Shipment]` / `[Assign Task]` · `[Mark as Lost]` · direct reassignment · cross-staff matrix · analytics · financials.

---

### 9.5 📈 Sales — *the account manager*

**Available:** `tactical` (limited), `command` (full). **Lands on** `/sales`.

**Navigation:** Sales · Customers · Partners *(read)*

#### Screen — sales dashboard

**Chart-first.** The order is load-bearing: the ranked worklist sits above the charts, because the dashboard's job is to answer *"what needs me?"* before *"what exists?"*

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
┌─ My Accounts (drill-down)              🔒 Command ───┐
┌─ Outstanding & Credit                  🔒 Command ───┐
```

- **Period selector** day / month / year. **No Air/Sea toggle** — the portal fixes the mode; the header chip is the only mode indicator.
- **Action cards** state fact → stake → one primary verb. `narrated_text` renders below the numbers in `--text-secondary`; when NULL the card still renders with numbers only — **no error, no placeholder** (§6).

##### Card audience — internal vs client

Two visually distinct card types, because confusing them is the one unrecoverable mistake on this screen:

```
┌─ ⚑ INTERNAL · not client-visible ────────────────────┐
│ Enquiries on Globex lose 3× more on delay_in_response│
│ Median first reply 4h 12m vs branch 1h 05m           │
│                              [View detail]           │   ← no ✉ icon, ever
└──────────────────────────────────────────────────────┘

┌─ ● CLIENT OUTREACH ──────────────────────────────────┐
│ Globex — air conversion 31% (was 62%), 3 cancelled   │
│ ₹4.2L/yr at stake                                    │
│ Draft ready · To: anita@globex.com  Cc: 2            │
│                              [View detail]   [✉]     │   ← ✉ opens the editor
└──────────────────────────────────────────────────────┘
```

- **Internal cards carry a `⚑ INTERNAL · not client-visible` chip** in `--status-neutral` and **have no mail icon at all** — the affordance is absent, not disabled, because a disabled ✉ still implies "this could be sent."
- **Client cards** show the resolved recipient count up front, so the rep knows the blast radius before opening anything.

##### Outreach editor (✉ popup)

Modal, 720 px. Opens with the draft fully populated and **entirely editable**.

```
┌─ Draft message — review before sending ──────────────┐
│ From  sanjay@f16sfreight.com          (your mailbox) │
│ To    [anita@globex.com ×]                           │
│ Cc    [ops@globex.com ×] [ravi@globex.com ×]  [+ Add]│
│       ⓘ 4 more contacts not CC'd — manage list       │
│ Subj  [Quick check-in on your Q2 air volumes       ] │
│ ─────────────────────────────────────────────────────│
│ Hi Anita,                                            │
│ I noticed a few of your recent bookings didn't…      │
│ (fully editable rich text)                           │
│ ─────────────────────────────────────────────────────│
│ ⓘ Sends from your mailbox. Replies arrive in your    │
│   inbox as a normal thread.                          │
│                        [Discard]  [Send message]     │
└──────────────────────────────────────────────────────┘
```

- **Cc chips are removable** and show the snapshot taken at generation. A hint states how many known contacts were **not** included, linking to the contact list — visible without being pushy.
- **`[Send message]` is the only send path.** No "send all", no bulk action across cards. One client, one deliberate send.
- On send: dispatches through the rep's own connected mailbox, creates a real `email_threads` row, and the card moves to `acted` with a link to the thread.
- **AI-drafted content is not visually marked in the editor** — this is the rep's message, sent in their name, and they have read and approved it. The `⚑ AI` treatment (§9.1) applies to *system* output the user is reading, not to a draft they are authoring.
- **Client Health** always renders as a **labelled component bar**, never a bare number or traffic light (§4.2).
- **Unattributed bucket** — a visible tab for `sales_id IS NULL`, labelled *"Unattributed — awaiting customer registration"*, so unassigned enquiries are never silently invisible.

#### Tier differences — the sharpest boundary in the product

| | `tactical` | `command` |
|---|---|---|
| Scope | Branch aggregate (`agent_id`) | **`sales_id = me`** |
| Charts | Same components, branch-wide | Same components, re-scoped to own book |
| Client names | ❌ | ✅ |
| Per-client revenue & tonnage | ❌ | ✅ |
| My Accounts grid | 🔒 locked | ✅ |
| Outstanding & Credit (aged 0–30/31–60/60+) | 🔒 locked | ✅ |
| Today's Actions | Branch-level variant | Per-client, ranked |
| AI account summaries | ❌ | ✅ |

Locked panels use `UpgradeTeaser.vue` over a **blurred skeleton, never real data** — blurred pixels are recoverable, and a Tactical tenant must not receive Command figures in the payload at all.

#### Absent for this login — at *every* tier

**Buy-side cost and profit margin.** Stripped **server-side in the API Resource**, not hidden with CSS (§4.3). Also absent: creating/converting/cancelling anything, assigning operators, another rep's clients, the cost sheet, `/financials`.

---

### 9.6 💰 Accounts — *the bookkeeper*

**Available:** `command` **only**. **Lands on** `/financials`.

**Navigation:** Financials *(8 sub-sections)* · Settings → Finance

#### Screens

| Route | Contents |
|---|---|
| `/financials` | Invoice & voucher registers · `[Finalize]` / `[Post Ledger]` |
| `/financials/unposted` | Queue with **blocking errors inline** as `--status-critical` chips (`Period closed`, `Exchange rate missing`) — the reason is on the row, never behind a click |
| `/financials/reconciliation` | Two-pane: bank transactions │ confidence-ranked candidate matches |
| `/financials/cass` | Statement upload · variance flags vs estimated vouchers |
| `/financials/unbilled` | Revenue-leakage queue sorted by `delay_days`, `> 7` flagged. Double-click opens the cost sheet drawer |
| `/financials/periods` | Open / close / reopen with the audit log alongside |
| `/financials/reports` | P&L · Balance Sheet · Trial Balance · GST register |
| `/settings/finance` | Chart of accounts tree · rate cards · bank-to-branch mapping |

**Posting confirmation** shows the resulting journal lines *before* commit:

```
Post INV-26-0001 to the ledger?
  Dr  1200-AR                 ₹1,18,000.00
  Cr  4000-Freight-Revenue    ₹1,00,000.00
  Cr  2200-GST-Output           ₹18,000.00
  ── balanced ✓
This cannot be undone. Corrections require a credit note.
                          [Cancel]  [Post to Ledger]
```

- **Reconciliation discrepancies** open a popover — `Write-off to Bank Charges` · `Keep as Short-Paid` · `Mark as Discount` — each showing its ledger effect before commit.
- **Reopening a closed period** requires typing the period name to confirm.
- **Drawer** — the only login with `[Finalize]` on the Job Cost Sheet.

#### Tier differences

None to show — the login does not exist below Command. On Tactical, `/financials` is a **tier-locked nav item** for the Boss, not a broken Accounts login.

#### Absent for this login

Triage · quoting · conversion · assignment · cancellation · manifests and waybills · the sales client book · tenant user administration.

---

### 9.7 🏛️ Boss / Director

**Available:** `tactical` (operational), `command` (adds financial read). **Lands on** `/boss`.

**Navigation:** Boss · Financials *(read-only, Command)* · Settings · Inbox & Kanban *(oversight)*

#### Screen — Boss dashboard

**The only cross-mode view.** Every chart carries an explicit `Air | Sea | Both` toggle, defaulting to **Both** — this login is not portal-scoped.

| Panel | Notes |
|---|---|
| Branch comparison matrix | Jobs raised / replied / pending / converted, by branch and by staff |
| Target assigner | Progress rings, revenue or tonnage, per branch or per person |
| Milestone latency heatmap | **Sequential** `--status-success` → `--status-critical` ramp — never a red-green diverging scale (§12) |
| Staff workload grid | OLI per operator |
| Revenue-leakage queue | 🔒 Command · sorted by `delay_days`, `> 7` flagged |
| Carrier dispute panel | 🔒 Command · CASS + bank mismatches |
| Weekly Executive Brief | 🔒 Command |

**Staleness banner** above the fold when `financial_snapshots.last_computed_at > 1h` (§3.4).

#### Tier differences

| | `tactical` | `command` |
|---|---|---|
| Audit matrix, OLI grid, latency heatmap, targets | ✅ | ✅ |
| P&L · Balance Sheet · Trial Balance · GST | ❌ locked | ✅ **read-only** |
| Leakage queue, dispute panel, exec brief | ❌ locked | ✅ |
| Profit margin on a job | ❌ | ✅ |

#### Absent for this login — deliberately

**`[Post to Ledger]` and period open/close are not rendered at all**, at any tier. The role that sets targets must not book the revenue those targets are measured in. Financial screens are read-only for the Boss: same tables, no commit actions.

---

### 9.8 🔧 Superadmin — the F16s owner

**Available:** every tier — this login administers tiers rather than being subject to one. **Portal:** `admin.f16sefreight.com`.

**Distinct chrome** — darker header and a `PLATFORM` chip, so tenant and platform contexts are never confused.

| Panel | Contents |
|---|---|
| Health tiles | AI server (`platform:status:ai_server`) · Horizon · queue depth · CPU/RAM |
| Log tail | Last 100 lines, monospace, wrapped, searchable |
| Failed jobs | Stack trace + `[Retry]` |
| Tenants | Table with tier editor · corporate domain registration |
| OCR credits | Allowance, overdraft ceiling, one-off top-ups — **mandatory reason field**, written to `ocr_credit_transactions` as `custom_override` |
| Support desk | `support_tickets` with screenshot viewer, console logs, selector path; `investigating` / `resolved` + developer notes emailed to the reporter |
| Classification analytics | Rule accuracy, confusion matrix, `[Trigger Pattern Optimization Hook]` |
| AWB tracking | Cross-tenant, date-filtered, CSV export |

#### Absent for this login — deliberately

**No operational or financial actions on any tenant.** No triage, quoting, conversion, assignment, invoicing, posting or period control. Superadmin sees *that* a tenant's AI server is failing; it does not run their shipments or touch their books.

---

### 9.9 Document forms *(reference — used by Core, Pricing, Operations)*

Standalone route and drawer tab render the **same component**; standalone gets the full viewport.

```
┌─ Header ─────────────────────────────────────────────────────┐
│ Shipment No JOBS-26-0001 │ Date │ Consol Type │ Cargo Type   │
│ Job Owner │ Quotation │ ☐ Sub Shipment │         ⏱ 38 min   │
├──────────────────────────────────────────────────────────────┤
│ Entity │ Shipping │ Routing │ Goods │ Item │ BL │ Container  │
│ Pick Up │ Charges │ Financials │ Customs │ E-Docket          │
├──────────────────────────────────────────────────────────────┤
│                    (active tab body)                         │
├──────────────────────────────────────────────────────────────┤
│  [Save] [Save & Close] [Save & New] [Generate PDF]           │
│  [🔗 Generate Link]                              [Close]     │
└──────────────────────────────────────────────────────────────┘
```

- **`[🔗 Generate Link]`** sits immediately right of `[Generate PDF]` in **Focus Air, House Waybill and Focus Sea alike**. Disabled until a PDF exists, with the tooltip *"Generate the PDF first."*
- **Tab state** — validation errors show `●` in `--status-critical`; **disabled** tabs (§10.5) grey out with a tooltip giving the reason, and stay visible so the form's full shape stays legible.
- **Entity tab** — address textarea is read-only until an entity is selected from the lookup above it.
- **Item tab** — CBM and chargeable weight compute live, render in `--text-secondary` with a `calculated` chip, never directly editable.
- **Container tab** — ISO 6346 check digit validates on blur.
- **Charges tab** — buy-rate columns are **absent from the DOM for sales**.
- Session timer and row lock per §10.6.

#### `[🔗 Generate Link]` — share instead of re-attaching

Opens a small popover, not a modal — this is a routine action, not a decision:

```
┌─ Share this document ────────────────────────┐
│ ⦿ View only                                  │
│ ○ Ask the client to approve                  │
│ Expires  [ 14 days ▾ ]   (max 90)            │
│                    [Cancel]  [Create link]   │
└──────────────────────────────────────────────┘
```

On create, the popover becomes the copy state:

```
┌─ Link ready ─────────────────────────────────┐
│ https://…/d/9f3c… ·  Expires 18-Jun-2026     │
│ [📋 Copy]  [✉ Send to client]  [Revoke]      │
└──────────────────────────────────────────────┘
```

- **`[✉ Send to client]`** hands the link to the consent engine — it stages the message and the operator approves it in the conversation feed exactly like any other client email (§11.2). **Nothing is sent from this popover directly.**
- **Existing links are listed under the button**, each showing status, expiry, view count and a `[Revoke]`:

  | Link | Status | Views | |
  |---|---|---|---|
  | `…9f3c` *(approval)* | ✓ **Approved** by A. Menon · 12-Jun | 3 | |
  | `…4b71` *(view)* | ⏱ Expires in 6 days | 0 — **not yet opened** | `[Revoke]` |

- **`0 views` is called out**, not left as a bare zero — "the client has not opened it" is the single most useful fact when chasing an approval, and §4.1 forbids a silent zero standing in for a meaningful state.
- **Approval outcome renders inline on the form header** so an operator opening the document sees `✓ Client approved · 12-Jun-2026` or `▲ Changes requested` with the client's comment expandable — without going to the inbox.

#### Client-facing document page

The only unauthenticated screen in the product. Deliberately minimal — it must not look like a login-walled app the client is locked out of.

```
┌──────────────────────────────────────────────────────┐
│  [tenant logo]        Draft Master Air Waybill       │
│                       JOBA-26-0001 · Globex Corp     │
│  ┌────────────────────────────────────────────────┐  │
│  │              PDF preview (embedded)            │  │
│  └────────────────────────────────────────────────┘  │
│  [⤓ Download]                                        │
│  ─── approval mode only ───────────────────────────  │
│  Your name  [                              ]         │
│  [ Request changes ]        [ Approve document ]     │
└──────────────────────────────────────────────────────┘
```

- **`[Request changes]`** expands a comment box; the comment is required before submit.
- After responding, the page shows a confirmation and stays viewable — the client can return to the same URL and see what they approved.
- **Expired or revoked** shows a plain, non-alarming message with the forwarder's contact: *"This link has expired. Please contact your F16s representative for an updated copy."* No error styling, no branding of failure — an expired link is normal housekeeping, not the client's mistake.
- Mobile-first: this is the **one** screen a client is likely to open on a phone (§7.1's read-only rule does not apply — approving is a single tap).

### 9.10 Customer & partner directories *(Pricing, Sales, Accounts, Boss)*

Searchable tables; search matches **name or email domain suffix** (`globex.com` finds *Globex Corp*), with the matched domain highlighted in the row.

#### Client groups — branches roll up under one domain

Rows sharing `(company_id, email_domain)` are **one client company with several branches** (`PRD.md` §2.2). The directory groups them visually — there is no separate group entity to navigate to.

```
▼ @globex.com — Globex Corp                    3 branches
     ₹12.4L outstanding · 148 t YTD · exposure 71%     ← roll-up, display only
  ├ Globex Chennai   R. Kumar   GSTIN 33AAA…  ₹4.1L  62% ✓
  ├ Globex Mumbai    P. Sharma  GSTIN 27AAA…  ₹6.2L  88% ▲
  └ Globex Delhi     R. Kumar   GSTIN 07AAA…  ₹2.1L  40% ✓
```

- **Group header** is a collapsible summary row: branch count, combined outstanding, combined tonnage, combined exposure. It is **not selectable as a billing party** — invoices are always raised against a branch.
- **Credit signals sit on the branch row.** Each branch is gated on its own exposure (§3.4); the group figure is informational. A group at 71 % with one branch at 88 % must show the branch warning — surfacing only the group average would hide the branch that is actually about to be blocked.
- **Single-branch clients render flat**, with no group header, so the common case gains no extra chrome.
- Sorting and filtering operate on **branches**; the group header re-summarises whatever is visible.

#### Onboarding — group detection

When a new customer is created and its domain or PAN matches existing rows, an inline notice appears **before save**:

```
┌─ ℹ Existing client detected ─────────────────────────┐
│ 2 branches already onboarded under @globex.com       │
│   Globex Chennai · Globex Mumbai                     │
│ This will be added as a third branch of the group.   │
│ Credit limit and payment terms stay per branch.      │
└──────────────────────────────────────────────────────┘
```

PAN matching is a **hint, not a rule** — all branches of one Indian entity share a PAN, but international clients may have none. The operator can always proceed regardless.

| Column | Visibility |
|---|---|
| Name · Email domain · Default port · Branch | All |
| Sales rep | **Command**; `—` when `sales_id IS NULL` |
| Credit limit · Payment terms · Outstanding | **Command**, right-aligned, exposure chip ≥ 80 % |

**Contacts tab** in the customer detail drawer lists `customer_contacts` — email, name, designation, last seen, message count, source. Two controls per row:

| Control | Effect |
|---|---|
| **CC toggle** | Sets `include_in_cc`. **Off by default**, with a header note: *"Only ticked contacts are CC'd on outreach."* |
| **Opt out** | Sets `opted_out_at`. Row greys out permanently; the CC toggle becomes unavailable, not merely off — DPDP erasure is not a preference |

Harvested contacts arrive `unverified` with a `--status-warning` `▲ unverified` chip until someone confirms them, so an auto-collected address is never mistaken for a curated one.

Detail drawer also holds tax and banking fields. **Bank account and IFSC render masked** (`••••4821`) with an audit-logged reveal — they are encrypted at rest and must not be casually readable on screen.

### 9.11 Manifest filing & cover letters *(Operations)*

**`/manifest-filing`** — filter bar (filing type, consol job no, transaction status, custom house, date range, ICEGATE ID) over a results grid. `[Submit CGM Data]` opens a modal whose status box is a read-only monospace log streaming validation output; `[Send for Signature]` shows DSC token state. Character limits are hard-enforced (§10.3) and name the ICEGATE rule.

**`/cover-letters`** — two-pane: letter metadata │ **checklist of enclosed documents** from `job_documents`. Checked items assemble the merged packet; the preview shows page count before send. `[Generate & Send]` is confirmed and names the recipient.

### 9.12 Message log *(Operations)*

Chronological SITA/IATA Type B audit for one job. Monospace, wrapped; each entry shows direction (`▲ sent` / `▼ received`), message type (`FWB`, `FHL`, `FSU/ARR`), timestamp, and raw payload in a collapsible block. Read-only, filterable by type, copy-raw per entry.

### 9.13 Settings *(section visibility follows ownership)*

Left sub-nav within `/settings`. A section a login does not own is **absent, not disabled** (`PRD.md` §2.3.7).

| Section | Owner | UI notes |
|---|---|---|
| Users & designations | Boss | Role picker; PIMA field; designation change warns about access impact |
| Email triage rules | Boss | Priority-ordered, drag to reorder. Each row shows **hit count, override count, accuracy %** (`1 − overrides/hits`); under 70 % flags `--status-warning`. `[+ Add Rule]` opens a modal with a **live regex tester** |
| SLA policies | Boss | Minutes per tier |
| Workload / OLI | Boss | Complexity coefficients, α, β, urgency multipliers, cap — with a **live worked example** recomputing as values change |
| Finance | Accounts | Chart of accounts tree · rate cards · bank-to-branch mapping |
| Mailboxes | Every user | Connected accounts, provider buttons, health — five states below |
| Signature | Every user | **Per mailbox**, not per user. Same eight-control editor as the composer. `[Import from Gmail]` where available; **`[Paste from your mail client]` is the primary path** because Outlook exposes no signature API. A `signature_source` badge (`imported` / `pasted` / `manual`) warns when it may drift from their mail client |

#### Mailbox connection states (`/settings/mailboxes`)

`mailbox_connections.auth_state` drives this directly. Each state is a **first-class UI state, never an error toast** — a user who hits an undiagnosed dead end on their first onboarding screen raises a ticket instead of self-serving.

| State | Renders |
|---|---|
| `not_connected` | `[Connect Outlook]` / `[Connect Gmail]` |
| `awaiting_admin_consent` | `--status-warning` · plain-language explanation · the generated admin-consent URL with `[Copy]` · **`[Email this to your IT admin]`**. This is the *expected* first outcome for most Microsoft 365 tenants, not a failure |
| **backfilling** | `--status-info` progress bar: **"Importing history — 1,240 of ~3,500"** from `backfill_processed` / `backfill_estimate`. **The mailbox is usable meanwhile** — messages appear as pages commit, so the screen is never empty |
| `connected` | `--status-success` · address · last-synced timestamp · `[Disconnect]` |
| `reauth_required` | `--status-critical` · **"Reconnect required — sync is paused"** · `[Reconnect]`. Never let a broken connection look like "no new mail" |

**Interrupted import recovers silently.** If the client's connection drops mid-backfill the bar simply stops advancing and resumes on the next run from `backfill_page_cursor` — no error, no user action, no restart from zero. If it fails repeatedly, `backfill_attempts` escalates the state to `reauth_required` rather than looping invisibly.

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