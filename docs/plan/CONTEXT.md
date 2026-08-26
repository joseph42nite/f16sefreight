# 🧭 Session Context — Read This First

**Purpose:** hand-off note so a new session can pick up without re-deriving anything.
**Last updated:** 2026-08-26

---

## 1. The one thing to understand

> ### We are building **on top of the existing F16s codebase**, not from scratch.
>
> This repo is a **working Laravel 9 application** with a live production deployment: AWB/HAWB PDF generation, a blog, OpenClaw webhook integration, agents, companies, users. **None of it is throwaway.**
>
> The planning set in `docs/plan/` describes a much larger **Freight Operations OS** to be built *around* that existing code. It is a target state, not a description of what is here today.

**Do not** treat the implementation guide as a greenfield script. It was written before the codebase was known, so its Step 1 assumes empty tables. Reconciliation notes are in §5.

---

## 2. Repo & environment

| | |
|---|---|
| Path | `/Users/jomygeorge/Desktop/f16sefreight` |
| Remote | `git@github.com:joseph42nite/f16sefreight.git` (**only** — not `dkdharmatmaa/f16s_main`) |
| Branch | `main` |
| Framework | **Laravel 9.52.21** *(the PRD says "Laravel 7+" — that is stale, ignore it)* |
| Local DB | **SQLite** — `database/database.sqlite` |
| Production DB | **MySQL** (user's decision; local/prod differ deliberately) |
| Migrations | **`php artisan migrate`** is approved for local dev |

### ⚠️ PHP version — this will bite you

The system PHP is **8.5**, which this project **cannot use**: `lcobucci/clock 2.3.0` requires `~8.1 || ~8.2`, and three other packages cap below 8.5. **PHP 8.2 is installed via brew.** Every `php` / `composer` / `artisan` command needs:

```bash
export PATH="/usr/local/opt/php@8.2/bin:$PATH"
```

Without it, `composer install` fails on platform requirements.

### Running it

```bash
export PATH="/usr/local/opt/php@8.2/bin:$PATH"
php artisan serve          # http://127.0.0.1:8000
npm run watch              # webpack, rebuilds on save
```

Both verified working. Webpack compiles clean in ~49 s (SCSS deprecation warnings from Bootstrap are noise, not errors).

---

## 3. History of this working directory

1. Originally held a **different** repo (also called f16sefreight) where the four planning docs were written.
2. On the user's instruction that directory was **wiped** — including its git history and two SQLite databases — and `dkdharmatmaa/f16s_main` was cloned in its place.
3. The remote was then repointed to `joseph42nite/f16sefreight` and `main` was **force-pushed**, replacing the old history.
4. The old planning docs still exist on branch `docs/client-groups-ai-outreach-document-links` of that same remote, and are now also copied into `docs/plan/`.

**Nothing was ever pushed to `dkdharmatmaa/f16s_main`.**

---

## 4. The planning set — `docs/plan/`

| File | Owns |
|---|---|
| `PRD.md` | Product — 6 logins, 3 tiers, workflows, formulas, NFRs |
| `database_relations_tree.md` | **Schema — all 58 tables**, columns, FKs, indexes, runnable DDL |
| `implementation_guide.md` | Build order — 8 checkpointed steps |
| `ui_ux_guide.md` | Interface — tokens, components, states, accessibility, per-login screens |

Naming collision warning: the repo root already has its **own** `implementation.md` and `guide.md`. Different documents, unrelated to ours.

### Verified invariants (audited, all passing)

- Relational tree ↔ DDL: **58 tables, 0 mismatches**
- Every FK / CHECK / index references a column that exists **in its own table**
- All cross-document `§` references resolve

---

## 5. How the plan maps onto this codebase

| | Count | Meaning |
|---|---|---|
| **Already exist AND in the plan** | **6** | `agents_info`, `air_way_bills`, `companies`, `house_way_bills`, `pdf_processing_jobs`, `users` — these need **ALTER**, not CREATE |
| **In the plan, not yet built** | **53** | The actual work |
| **Exist but absent from the plan** | **22** | `airlines`, `ams`, `blogs`, `contacts`, `currency_rates`, `locations`, `openclaw_*`, `other_charges_code`, `payment_info`, `rates`, `roles`, `saved_addresses`, `settings`, `status_response`, `super_admins`, `system_templates`, `way_bill_*` — **live features, keep them** |

40 migrations are already applied locally.

### 🔎 Possible duplication — check before building

| Planned table | Existing table | Question |
|---|---|---|
| `customer_contacts` | `contacts`, `saved_addresses` | Extend the existing ones instead? |
| `rate_cards` | `rates` | Same |
| `partners` | `airlines` | `airlines` is already the carrier list |

Resolve these **before** Batch 1a creates parallel structures.

---

## 6. Corrections to earlier assumptions

- **`houseway_bills` vs `house_way_bills` was a false alarm.** The table is `house_way_bills` everywhere. Only the migration *filename* and the model *class name* omit the underscore; the model declares `protected $table = 'house_way_bills'`. **No conflict, nothing to fix.**
- **SQLite is more capable than assumed.** 3.53.4 **enforces CHECK constraints and supports generated columns**, so the schema's 7 CHECKs and `job_entities.unique_role_gate` are genuinely exercised locally. Remaining divergence from MySQL is loose typing on `DECIMAL`/`VARCHAR`, which matters for the ledger but not for early batches.

---

## 7. Where we stopped

**Nothing from the plan has been built yet.** Environment is up, docs are in the repo, schema is audited.

**Next step: Batch 1a** — `sequence_counters` → `ports` → `customers` → `customer_contacts` → `partners`, plus ALTERs to `companies` and `users`. Read `implementation_guide.md` §"Batch 1a" for exact ordering and index requirements.

### Open items

1. **§5 duplication check** — `contacts`/`saved_addresses`/`rates`/`airlines` overlap with planned tables. Decide extend-vs-create first.
2. **`it_devops_checklist.md` says production migrations are applied as manual SQL, not via Artisan.** Local dev uses Artisan (approved). How schema reaches production is still undecided.
3. **Google restricted-scope CASA assessment** — deferred by the user to a later stage. Blocks Gmail onboarding at scale (100-user cap until cleared), not local work.
4. **System-transactional email sender** — undecided; needed before Segment C.
5. `docs/plan/CONTEXT.md` (this file) and the planning set are committed locally but **1 commit is unpushed**.

---

## 8. Constraint inventory (what the schema enforces)

| Type | Count |
|---|---|
| CHECK | 7 — `chk_enq_status`, `chk_jobs_status`, `chk_enq_mode_prefix`, `chk_jobs_mode_prefix`, `chk_saq_audience`, `chk_saq_internal_no_draft`, `chk_share_approval` |
| **ON DELETE RESTRICT** | **3** — `jobs.enquiry_id`, `accounts_invoices.job_id`, `accounts_purchase_vouchers.job_id`. **These block deletes and will surprise you in tests** |
| ON DELETE CASCADE | 26 |
| ON DELETE SET NULL | 25 |
| UNIQUE | 29 |
| Generated column | 1 — `job_entities.unique_role_gate` |
| Triggers | 3 — `audit_logs` append-only; `ops_id`/`pricing_id` designation checks |

---

## 9. Load-bearing design rules

Break these and the product misreports itself:

- **`Lost` lives only on `enquiries`; `Cancelled` only on `jobs`** — enforced by DB CHECK, not convention.
- **`[Confirm Shipment]` is the only action that creates a `jobs` row.**
- **Regex classification runs on inbound mail only.** Outbound is stored and stamps `first_response_at`, but is never classified — classifying it mints a second enquiry and inflates the conversion denominator.
- **Profit margin never reaches a sales-facing API response**, at any tier — stripped server-side, not hidden in the UI.
- **Nothing is emailed to a client without explicit operator approval.**
- **`audience = 'internal'` can never carry a client draft** — DB CHECK, not prompt instruction.
- **NULL ≠ 0 in analytics.** NULL means "insufficient evidence" and renders as `—`.
