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
| Local DB | **MySQL 8.0.46** via `docker compose up -d db`, host port **3307** *(switched from SQLite 2026-08-26 — see §6)*. Tests use `f16s_test` on the same server |
| Production DB | **MySQL** — local now matches it deliberately |
| Migrations | **`php artisan migrate`** is approved for local dev |

### ⚠️ PHP version — this will bite you

The system PHP is **8.5**, which this project **cannot use**: `lcobucci/clock 2.3.0` requires `~8.1 || ~8.2`, and three other packages cap below 8.5. **PHP 8.2 is installed via brew.** Every `php` / `composer` / `artisan` command needs:

```bash
export PATH="/usr/local/opt/php@8.2/bin:$PATH"
```

Without it, `composer install` fails on platform requirements.

### Running it — two ways, both valid

**Host workflow (default, what the committed `.env` is set up for):**

```bash
export PATH="/usr/local/opt/php@8.2/bin:$PATH"
php artisan serve          # http://127.0.0.1:8000
npm run watch              # webpack, rebuilds on save
```

Both verified working. Webpack compiles clean in ~49 s (SCSS deprecation warnings from Bootstrap are noise, not errors).

**Container stack (added 2026-08-26, purely additive — the above still works):**

```bash
docker compose up -d                  # web, queue, db (MySQL 8), redis, soketi
docker compose --profile ai up -d     # + ai-server, needs ./python
```

Use it when you need what `artisan serve` cannot give you: **MySQL 8** — so the 7 CHECK constraints, the generated column and the triggers run exactly as production will — plus Redis, real queues and WebSockets. Host ports are deliberately offset (`db` 3307, `redis` 6380) so a local MySQL or Redis install is not disturbed. Copy `.env.docker.example` over `.env` **only** while using the stack; the committed `.env` stays pointed at SQLite.

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
| **`GAPS.md`** | **Every open gap, deferred obligation and known defect — with what breaks and when it is due.** Read it before starting any step |
| `PRD.md` | Product — 6 logins, 3 tiers, workflows, formulas, NFRs |
| `database_relations_tree.md` | **Schema — all 59 tables**, columns, FKs, indexes, runnable DDL |
| `implementation_guide.md` | Build order — 8 checkpointed steps |
| `ui_ux_guide.md` | Interface — tokens, components, states, accessibility, per-login screens |

Naming collision warning: the repo root already has its **own** `implementation.md` and `guide.md`. Different documents, unrelated to ours.

### Verified invariants (audited, all passing)

- Relational tree ↔ DDL: **59 tables, 0 mismatches** *(58 originally; `tenant_policies` added 2026-08-26)*
- Every FK / CHECK / index references a column that exists **in its own table**
- All cross-document `§` references resolve

### How we work — the loop for every step

**`implementation_guide.md` drives; the other three are consulted.** Each owns exactly one thing (`PRD.md` §0), so every question has one authority:

| Question | Authority |
|---|---|
| What do I build next, in what order? | `implementation_guide.md` |
| What columns, types, keys, indexes? | `database_relations_tree.md` |
| How must it behave, and why? | `PRD.md` |
| What does it look like, what states? | `ui_ux_guide.md` |

For each step: the **guide** names it → the **schema doc** gives the exact DDL (the guide deliberately carries no column definitions) → the **PRD** gives the behaviour and the reasoning, so an edge case can be judged a bug or intended → the guide's **checkpoint** proves it worked → **tests** before the segment closes.

> **Run the checkpoint before starting the next step.** This is the rule that matters most, and it is why `sequence_counters` is verified before `ports` begins. A half-applied migration batch is the failure mode the guide opens by warning about.

**Two caveats, both learned the hard way in the 2026-08-26/27 pass:**

1. **These docs describe the target state, not what exists.** Roughly fifteen places disagreed with the code — `pima_address` already present, `branch_name` semantics, triggers that existed in prose only, a settings screen with no table, `npm run test:unit` with no runner. They are reconciled now, but keep the habit that found them: **when a doc and the code disagree, the code is authoritative on *what exists* and the doc on *what it should be*** — flag the conflict, never resolve it silently.
2. **`ui_ux_guide.md` has NOT had the reconciliation pass.** The other three were checked against the codebase; that one has only had its headings read. Give it the same treatment before Step 6 or expect the same class of surprise.

> **What the loop cannot do.** It caught none of the design gaps found this week — a grant command nobody wrote, two columns meaning one thing, a tier upgrade silently reconnecting a mailbox its owner had removed. Following the order keeps the build sound; it does not replace asking *"does this actually make sense"* at each step.

---

## 5. How the plan maps onto this codebase

| | Count | Meaning |
|---|---|---|
| **Already exist AND in the plan** | **6** | `agents_info`, `air_way_bills`, `companies`, `house_way_bills`, `pdf_processing_jobs`, `users` — these need **ALTER**, not CREATE |
| **In the plan, not yet built** | **53** | The actual work |
| **Exist but absent from the plan** | **22** | `airlines`, `ams`, `blogs`, `contacts`, `currency_rates`, `locations`, `openclaw_*`, `other_charges_code`, `payment_info`, `rates`, `roles`, `saved_addresses`, `settings`, `status_response`, `super_admins`, `system_templates`, `way_bill_*` — **live features, keep them** |

40 migrations are already applied locally.

### ✅ Duplication check — resolved 2026-08-26, no duplicates

| Planned table | Existing table | Verdict |
|---|---|---|
| `customer_contacts` | `contacts`, `saved_addresses` | **Create fresh.** `contacts` is a website contact-form/lead table (`first_name, last_name, email, phone, message`). `saved_addresses` is a per-waybill address store keyed by `awb_id` — closest to `job_entities`, not a customer address book |
| `rate_cards` | `rates` | **Create fresh.** `rates` is an airline tariff lookup (dest airport, zone, carrier prefix, rate range); `rate_cards` is a per-party charge tariff — different grain |
| `partners` | `airlines` | **Create fresh; keep both.** Already settled in `PRD.md` §10 — `airlines` is retained for the carrier-domain exclusion list, while accounting/operational carrier records live in `partners` |

No parallel structures. Batch 1a is clear to proceed on this front.

---

## 6. Corrections to earlier assumptions

- **`houseway_bills` vs `house_way_bills` was a false alarm.** The table is `house_way_bills` everywhere. Only the migration *filename* and the model *class name* omit the underscore; the model declares `protected $table = 'house_way_bills'`. **No conflict, nothing to fix.**
- **SQLite is more capable than assumed.** 3.53.4 **enforces CHECK constraints and supports generated columns**, so the schema's 7 CHECKs are genuinely exercised locally. Remaining divergence from MySQL is loose typing on `DECIMAL`/`VARCHAR`, which matters for the ledger but not for early batches.
  ✅ **Fixed 2026-08-26.** `job_entities.unique_role_gate` previously used `IF(role != 'notify_party', role, NULL)`; `IF()` is MySQL-only and SQLite cannot parse it. Now `CASE WHEN role <> 'notify_party' THEN role END` — ANSI, works on MySQL 8, SQLite 3.31+ and Postgres. Two rules recorded in the DDL alongside it: declare it in the **CREATE**, never a later ALTER (SQLite cannot `ADD COLUMN` a STORED generated column), and **never** swap it for a partial index — SQLite and Postgres support those, MySQL does not, which is the whole reason the generated column exists.

- **🔐 Auth model resolved (2026-08-26): stateless JWT, context per request.** The planning set was written assuming Laravel sessions; this codebase uses `tymon/jwt-auth` with guards selected by the legacy `roles` table. A session-backed `scopeForActivePortal()` would have returned **unfiltered** rows rather than erroring. Resolved as:
  1. **Portal scope from the request `Host`**, bound per request by `BindPortalScope` middleware on the `api` group — absent in queue/CLI contexts, so daemons pass through unfiltered exactly as intended.
  2. **Only identity in the JWT.** `designation` and `tier` are re-read per request (Redis-memoized, busted on save), so a demotion or tier downgrade applies immediately instead of at token expiry.
  3. **Pre-login company selection is UX, not a security binding.** `company_id` derives from `user → branch → company`.
  Written up in `implementation_guide.md` §3.0/§3.3/§3.6 and `PRD.md` §2.1. The `roles` table (guard selector) and `users.designation` (in-tenant role) are different axes and both survive.

- **Live `users` columns that affect Batch 1a.** `pima_address` **already exists** — the guide's ALTER list has been corrected to drop it.
  ✅ **`origin_airport_code` vs `origin_port_id` — decided 2026-08-26: keep both.** They are not duplicates. `origin_airport_code` is a bare IATA string on `users` with no FK; `origin_port_id` is a **foreign key into the new `ports` table** (the UN/LOCODE master, which also covers seaports). Add `origin_port_id` **nullable** and leave it empty for now — the port directory is being loaded later, then backfilled from the IATA codes. Registration cannot require it until that data exists.

- **🔎 `users.branch_name` holds an ID, not a name — verified in code, question closed.** The name invites the assumption that it stores a station code like `BLR` or `MAA`. **It does not.** The admin form's "Branch Location" field is a dropdown whose options are built at `resources/js/src/view/pages/admin/NewUsers.vue:241` as `{value: data[i].id, text: data[i].agent_city}` — fed by `BranchController@getCompanyBranch`, which selects only `id` and `agent_city`. **The city is what's displayed; the numeric `agents_info.id` is what's stored.** Every reader confirms it: ~40 call sites do `Agent::where('id', $user->branch_name)` (e.g. `app/Http/Traits/WaybillTrait.php:17`). If the column held `'BLR'` the entire waybill flow would already be broken.
  It is `VARCHAR` only because the column type was never tightened — validation is `nullable|max:50`, which never required a number.
  **Real airport codes live elsewhere:** `users.origin_airport_code` (the actual IATA code), `agents_info.office_airport`, `agents_info.agent_city`. If branches should ever be labelled `BLR`/`MAA` in the UI, that is a display concern for those columns — `branch_name` never needs to carry it.

- **✅ Decision: convert `users.branch_name` to `BIGINT UNSIGNED` + FK → `agents_info.id`; keep the column name.** Because the stored values are already IDs, this changes **no data** — it tightens the type to match reality and lets the database enforce that the branch exists. Keeping the name means **zero code churn** across those ~40 call sites; renaming to `agent_id` is an optional later tidy-up, not this migration.
  **Why it matters:** with a `VARCHAR` column and no FK, MySQL silently coerces text in numeric comparisons — `'3abc'` becomes `3`. A corrupted value would quietly resolve to a *real, different* branch and leak another tenant's data, with nothing raised.
  **Prerequisite:** `composer require doctrine/dbal`. Laravel 9's `->change()` needs it and it is **not installed** (Laravel 10 dropped the requirement; we are on 9.52).
  **`NOT NULL`, per the project rule set 2026-08-26: every user has a branch, and therefore a company and a tier.** That is what makes tier resolution total in `ProcessPdfOcrJob` — there is no branchless-user case to design around. Registration now enforces it too: `UserController` validated `branch_name` as `nullable|max:50` (which is how branchless users were created) and is now `required|integer|exists:agents_info,id`.
  ⚠️ **Backfill before constraining.** Check 3 below counts users with a NULL/empty `branch_name`; assign each a branch first or the migration aborts.
  **Confirm against production first** — the local DB is empty, so none of this is verified there.

  ```sql
  -- 1. Any non-numeric branch_name? (must be empty before converting)
  SELECT id, email, branch_name FROM users
  WHERE branch_name IS NOT NULL AND branch_name <> ''
    AND branch_name NOT REGEXP '^[0-9]+$';

  -- 2. Any branch_name pointing at a branch that doesn't exist?
  SELECT u.id, u.email, u.branch_name FROM users u
  LEFT JOIN agents_info a ON a.id = CAST(u.branch_name AS UNSIGNED)
  WHERE u.branch_name IS NOT NULL AND u.branch_name <> '' AND a.id IS NULL;

  -- 3. How many users have no branch at all? (these have no tenant)
  SELECT COUNT(*) AS no_branch FROM users
  WHERE branch_name IS NULL OR branch_name = '';

  -- 4. ⚠️ THE DANGEROUS ONE — does company_name disagree with the branch's company?
  --    The plan switches company resolution from the company_name string to branch->company_id.
  --    Any row returned here is a user who SILENTLY MOVES TENANT when we flip the switch.
  SELECT u.id, u.email, u.company_name, a.company_id, c.name AS branch_company
  FROM users u
  JOIN agents_info a ON a.id = CAST(u.branch_name AS UNSIGNED)
  JOIN companies c ON c.id = a.company_id
  WHERE u.company_name <> CAST(a.company_id AS CHAR)
    AND u.company_name <> c.name;
  ```

- **🐞 `users.company_name` has the same shape — and a live bug.** That dropdown also stores the **company ID** (`NewUsers.vue:230`), not the name. But `app/Http/Controllers/Auth/LoginController.php:45` looks it up by name: `Company::where('name', $companyName)`. If the column holds `"3"`, that finds nothing and `templates_config` resolves to **null on every login** — plausibly unnoticed if the config is rarely used. Unverified locally (empty DB); confirm with `SELECT id, email, company_name FROM users LIMIT 20` against production. **The plan already fixes this** by deriving company through `user → branch → company` rather than by string. Keep `company_name` for now (the login cache key uses it), but stop writing new logic against it.

- **🐍 The Python parsing service is in-repo at `python/`** — it was never missing. `ocr_server.py` exposes `GET /health` and `POST /extract`, calling `extract_all_boxes()` from `extract_awb_new.py` with coordinates supplied either by `system_templates` (passed through by `ProcessPdfOcrJob`) or by `boxes_config.json`. `requirements.txt` pins only `pdfplumber`, `fastapi`, `uvicorn`, `python-multipart`. **It is the structured-document path PRD §5.1 says to keep** — the AI paths are additive work, not a replacement. Gap analysis against guide §4.1 is recorded there.

- **⚙️ OCR tier branching & the credit gate — specified 2026-08-26** (`implementation_guide.md` §4.1.1). `PRD.md` §3.3 previously said only "branches on tier"; the mechanism did not exist. Four decisions:
  1. **Tier resolves `users.branch_name → agents_info.company_id → companies.tier`** — total, because every user has a branch. In a queue worker this must go through `withoutTenantScope()`, and eager-load `User::with('branch.company')` — it runs on every upload.
  2. **The route is tier × document class, not tier alone.** Core + a structured AWB still uses coordinate extraction free of charge; Core + an *invoice* fails with `failure_code = 'upgrade_required'` and shows the upgrade CTA, because `pdfplumber` has no template for it and would otherwise return a blank form that looks broken.
  3. **🔒 Vision OCR is OPT-IN — the system never spends a credit on its own** *(owner's decision, and it also dissolved the sequencing problem)*. Invoices and packing lists arrive as scans and photos too, so "no text layer" is common, not exceptional. The first call always runs `allow_vision = false`: if PyMuPDF finds text, Gemma parses it free with no prompt; if not, FastAPI returns `extraction_path = 'none'`, **nothing is reserved and no Gemini call is made**, and the job parks at `status = 'awaiting_vision_consent'` showing page count and cost. Accepting hits `POST /api/pdf-jobs/{id}/authorize-vision`, which reserves under `SELECT … FOR UPDATE` and re-calls with `allow_vision = true`. Declining cancels, having spent nothing.
     This is the same principle `PRD.md` §5.7 applies to client email — *a moment of reversibility in front of an irreversible act* — and it neatly removes the ordering problem an earlier draft solved with speculative reserve-then-refund: there is now a **human decision** between the two calls, so the round trip does real work. **Refund survives only for the narrow failure case** (Gemini times out after reserving), guarded by `UNIQUE (reverses_transaction_id)` so a retry cannot credit twice.
  4. **New columns:** `ocr_credit_transactions.pdf_processing_job_id` (which extraction spent the credit — previously unanswerable) and `.reverses_transaction_id`; `pdf_processing_jobs.extraction_path` (`coordinates|text|vision|none`), `.page_count` (vision cost scales with pages, so the prompt can say *"3 pages, 1 credit"*) and `.failure_code` (a code, not a sentence, so tests and UI branch deterministically).
  5. **🐞 Found while sizing allowances: nothing granted the monthly credits.** `companies.ocr_credits_monthly_allowance` and the `monthly_grant` transaction type both existed, but no command ever applied them — balances only ever decreased, so every tenant would eventually hard-stop and never recover. Added `credits:grant-monthly` (monthly, 1st) to guide §4.7: **resets** to the allowance rather than adding to it, and must be idempotent or a re-run doubles every balance.
  6. **Tier defaults live in `config/f16s.php` (created 2026-08-26); superadmin can override per tenant.** `core` 0 / `tactical` 500 / `command` 2,000 monthly, with overdraft floors `0` / `−20` / `−50`. Sized from `shipments × client docs × share scanned` (~150/month for a mid-size branch) with ~3× headroom — **the ceiling catches abuse and the tail, it does not meter ordinary use.** `companies.ocr_credits_monthly_allowance` and `.ocr_credits_limit` are now **NULL by default, meaning "follow the tier"**; a non-NULL value is a pinned superadmin override. That distinction is deliberate: an ordinary tenant is lifted automatically on upgrade, while a negotiated allowance is never silently overwritten by a tier change. Recalibrate from `ocr_credit_transactions` after one month of real burn — median × 2–3.
  7. **⚠️ Prompt-caching claims corrected 2026-08-26.** Three problems in the original text. (a) `PRD.md` §7.3.6 said "cache the system prompt and schema via Ollama `num_ctx`" — **`num_ctx` sets the context-window size and caches nothing**; prefix reuse comes from the Modelfile plus Ollama's KV cache, with `num_ctx` only a prerequisite. (b) `OLLAMA_KEEP_ALIVE=-1` keeps model **weights** resident — that is cold-start load time, **not** prompt caching; the two were conflated. (c) The "up to 80% token cost" claim is **inverted relative to where money is spent**: the text path runs on local Gemma and is free (caching buys latency only), while the vision path's cost is dominated by the **page image**, not the prompt — so caching saves little exactly where the bill is. Gemini context caching also needs two checks against current Google docs before building: a **minimum cacheable size** the schema block may fall under, and the fact that the specified **300 s TTL** is billed by duration, so at realistic density the cache expires between requests — full creation cost, no reuse. **Real vision-cost levers, in order:** the opt-in consent gate, fewer pages, image downscaling.
  8. **📐 Caching ≠ schema conformance — clarified 2026-08-26.** Prompt caching makes a schema cheaper and faster to **send**; it has no bearing on whether the model **obeys** it. Getting form-ready JSON is three separate mechanisms: **constrain** (Gemini `response_schema`, Ollama `format: <json-schema>`), **validate** (Pydantic — the last line of defence, not the mechanism; it detects a bad payload, it does not prevent one), and **map** (one shared key vocabulary → the Vue forms). The plan previously specified only Pydantic validation, so the constraint step was missing entirely.
     **The key vocabulary already exists in code:** `extract_all_boxes()` returns `result[box_name]` keyed by the regions in `python/boxes_config.json` — `shipper`, `consignee`, `departure`, `destination`, `transit`, `cargo`, `weight_charge`, `piece_weight` — and `FocusAir.vue` consumes those names. **`/extract-unstructured` must return the same keys**, or `OcrUploadModal.vue` needs two mappers that drift. One shape difference to reconcile: `/extract` returns bare values while the new path returns `{value, confidence}` — unify upward by having `/extract` wrap and stamp `confidence: "high"`, since a coordinate hit is exactly that per `PRD.md` §5.1.
  9. **🔒 Use schema-constrained decoding, and make every value nullable.** Three levels of "return JSON": a prompt instruction (guarantees nothing), JSON mode (valid syntax, any shape), and **schema-constrained decoding** — Gemini `response_schema`, Ollama `format: <json-schema>` — where the decoder is grammar-constrained so a non-conforming token cannot be sampled. **Use the third on both models.** Caveat: Gemini accepts a stricter OpenAPI-flavoured subset than Ollama, historically awkward with `$ref`/`$defs`, so author one flat schema satisfying the stricter of the two.
     ⚠️ **The trap:** constrained decoding guarantees shape, not truth. A *required* `gross_weight` forces the model to invent a number when the page does not contain one — converting a visible failure into a silent one on a document that becomes a customs declaration. **So: every value nullable, `confidence` required on every field, enums wherever the value set is closed (`weight_unit`, currency, package type), schema kept flat and one per document type** — Gemma 4 E4B is ~4B params and degrades under a deep grammar. Pydantic still validates afterwards for semantic nonsense (dates in 2085, negative weights); on failure retry **once** with the error, then `extraction_failed` — never loop, since each vision retry is another paid call.
  10. **📏 Field constraints: enforce FORMAT in the schema, validate LENGTH afterwards.** Consolidated table in guide §4.1.2, sourced from `PRD.md` §5.9 (Cargo-XML) and §5.8 (ICEGATE). **`pattern`/`enum` go in the extraction schema** (MAWB `^\d{3}-\d{8}$`, HAWB alphanumeric ≤20, IMO `^[0-9]{7}$`, HS `^\d{6,10}$`, container 11-char ISO 6346, weight unit `KGS|LBS`, container and cargo type enums) — free accuracy, the model cannot emit an invalid value. **`maxLength` must NOT** — a 35-char cap on a shipper name makes the model silently truncate a 60-char legal name at parse time. Extract full fidelity, validate after, flag orange, let a human abbreviate. Two rules are cross-row rather than per-field: house piece counts must sum to the master exactly, and an IMDG class requires a UN number.

  11. **🔤 Party matching reuses the EXISTING Levenshtein matcher — do not write a new one.** `resources/js/src/core/mixins/airWayBillMixin.js` already has `normalizeText`, `calculateSimilarity` (Levenshtein ratio, short-circuits to 0.95 on containment when `min/max ≥ 0.65`) and `findMatchingAddress` (name **≥0.90** AND address **≥0.85**), already wired into `FocusAir.vue` and `HouseWayBill.vue`. Extracted shipper/consignee are matched against `saved_addresses` (agent-scoped, `AddressBookController`, curated from settings); a match **replaces** the OCR text with the curated record, which is already within every character limit and — the part that matters — **identical on every shipment for that partner**, since free-typed party names are what cause the master/house mismatches customs rejects. Unmatched parties keep OCR text and offer `[Save to address book]`, so the book grows without anyone doing data entry as a chore. ⚠️ **Propose, never silently substitute** — swapping a consignee for a merely similar one ships cargo to the wrong company.
  12. **`awaiting_vision_consent` needs its own expiry.** The 30-minute stale sweep must **exclude** it — an operator may answer an hour later — but the temp PDF waits on disk, so `pdf:expire-vision-consent` cancels and cleans up at 24 h.

- **⚙️ `tenant_policies` added 2026-08-26 — the 59th table.** Four things `PRD.md` promised were "admin-configurable" or "adjustable per branch" had **no storage anywhere in the schema**: the OLI coefficients (§5.5), the undo-send window (§5.2.4), the stale-enquiry window (§5.4) and the CASS tolerances (§6.5). `/settings/workload` was a screen with nothing behind it, so those numbers would have been hardcoded. The legacy `settings` table is unrelated (two columns: `carrier_code`, `user_notice_1`).
  **Typed columns, not generic key/value** — a key/value bag would fight a schema that validates everything at the database, and these values have real constraints.
  **Scope:** `agent_id NULL` = company-wide, `agent_id` set = branch override. Only CASS is genuinely branch-level, which is why the column exists at all. `UNIQUE (company_id, policy_scope_gate)` where the gate is `GENERATED … COALESCE(agent_id, 0)` — the same trick as `job_entities.unique_role_gate`, and for the same reason: a plain `UNIQUE(company_id, agent_id)` permits **many** company-wide rows, since both engines allow repeated NULLs in a unique index. Tested, 6 assertions.
  **No `deleted_at`** — §9.3 names six soft-deleting tables and this is not one. Removing an override means NULLing the column so it falls through to the default, never deleting the row.
  **Not merged with `sla_policies`**, which is keyed `(company_id, tier)` — a different grain. `max_reply_time_minutes` stays there and must never be duplicated here.

- **📌 One source of truth for every default: `config/f16s.php`.** Every `tenant_policies` column is NULLable with **no SQL default**, so a value exists in exactly one place; putting defaults in both the config and the DDL would give two that drift. Resolution is always **branch → company → config**, the same pattern `companies.ocr_credits_monthly_allowance` already uses. The PRD sections that quote these numbers (§3.4 credits, §5.2.4 undo, §5.4 stale, §5.5 OLI, §6.5 CASS) now each point at the config as the authority, so prose and code cannot silently disagree.
  ⚠️ **`stale_enquiry_days` is the one invented number** — `PRD.md` §5.4 says only "the tenant's configured stale window" and never states a value. Config carries `7` as a starting point, flagged in both places; confirm with the business before launch.

- **🧪 What the per-segment testing rule does and does not protect.** Recorded because it is easy to read "full test pass per segment" as "we cannot get this wrong". **Most defects found in the 2026-08-26 pass would not have been caught by any suite** — they were specification gaps, not behavioural regressions: a command that was never written (`credits:grant-monthly`), a screen with no storage (`/settings/workload`), two columns meaning one thing (`status` vs `auth_state`), and a coherent-but-wrong design (one `is_active` for both a tier downgrade and a user's own mailbox removal, so an upgrade silently reconnects it). **Tests keep decisions decided; they do not make the decisions.** Reviewing spec against code is a separate activity.
  🔴 **Two ways the suite can be green while production is broken**, both now in guide Step 8:
  1. **Never authenticate tests with `actingAs()`.** It bypasses both JWT and the `Host`-derived portal scope, so `TierModeGatingTest` would pass while air users see sea data live — the precise failure it exists to catch. Send a real token and a real `Host` header through the real middleware.
  2. **Green on SQLite ≠ green on MySQL.** They differ on loose `DECIMAL`/`VARCHAR` typing (matters for the ledger), `TRUNCATE` bypassing DELETE triggers, and FK cascades not firing triggers at all. Run the suite against MySQL 8 via `docker compose` before signing off each segment.

- **🐬 Local switched from SQLite to MySQL 8 on 2026-08-26, and it paid for itself immediately.** `.env` now points at the container (`127.0.0.1:3307`, db `f16s`, user `f16s`); `phpunit.xml` pins `f16s_test` on the same server plus a `JWT_SECRET`. Old `.env` saved as `.env.backup-presql`; `database/database.sqlite` left on disk untouched. **Suite went 18 passed / 6 failed → 26 passed / 0 failed.** Three real defects surfaced in the first hour:
  1. **`php artisan migrate` had never worked on a fresh database.** `2026_05_16_060000` indexes `air_way_bills.status`, but that column is not added until `2026_07_15_010000` — two months later in the ordering. Hidden because production applies schema as manual SQL and local dev ran against an existing SQLite file that already had the column. **Compounded by MySQL having no transactional DDL**: the partial failure was not rolled back, the migration was not recorded, and re-running failed with `1061 Duplicate key name`. Indexes are now guarded on both column-exists and index-exists, so the migration is re-runnable against a half-applied schema.
  2. **Guarding alone was half a fix** — the two status indexes were then *silently skipped* on a fresh DB, leaving full table scans on the branch-and-status queries. `2026_07_28_000000` recreates them where the column exists. A silently missing index is a subtler bug than a loud one.
  3. **`saved_addresses.fax`/`.telex` were `INTEGER`** but hold alphanumeric values, contradicting both `phone` (varchar) on the same table and `way_bill_addresses.*_telex` (varchar). SQLite stored `'TLX123'` in an INTEGER column without complaint; MySQL rejects it. Fixed by `2026_07_28_000100` — and `->change()` is exactly why `doctrine/dbal` was needed.
  ⚠️ **Start the database before running anything:** `docker compose up -d db`. Docker Desktop is installed but does not auto-start. Brew also has **MariaDB** — do not use it; it is a third dialect and would reintroduce the drift this switch removed.

- **🧪 Frontend test runner added 2026-08-26 — it did not exist.** Guide §8.3 and PRD §9.7 both referenced `npm run test:unit`, but there was no runner, no config and no script: the same "documented thing with nothing behind it" class as `/settings/workload`. Now Jest 27 + `@vue/vue2-jest` + `@vue/test-utils@1` (the maintained Vue 2 pairing — **not** Jest 29), `jest.config.js`, `babel.config.js`, specs in `tests/js/**/*.spec.js`, scripts `test:unit` and `test:unit:watch`. Jest transforms independently of laravel-mix, so the two need not agree on tooling.
  First spec is `tests/js/addressMatching.spec.js` — 9 assertions over the `airWayBillMixin` Levenshtein matcher, chosen because it is pure logic needing no component mount **and** load-bearing: it asserts both that OCR noise still matches and that a genuinely different company does **not**, since a false party match silently ships cargo to the wrong consignee.
  **Two independent suites:** `php artisan test` needs `docker compose up -d db`; `npm run test:unit` needs nothing. Run the JS one on every save during Step 6, both before closing a segment.

- **Dead references found in the live code** (none blocking): `config/auth.php` registers an `admin-api` guard pointing at `App\Admin::class`, which does not exist and has no table — a `roles.role = 'admin'` login 500s. `App\User::GetAssosName()` references a non-existent `App\Association`.

---

## 6a. 🚀 Start here — getting from clone to green

```bash
export PATH="/usr/local/opt/php@8.2/bin:$PATH"   # system PHP is 8.5; this project cannot use it
open -a Docker                                    # Docker Desktop does not auto-start
docker compose up -d db                           # MySQL 8.0 on host port 3307

php artisan migrate                               # 42 migrations, clean on a fresh DB
php artisan test                                  # 26 passed
npm run test:unit                                 # 9 passed

php artisan serve                                 # http://127.0.0.1:8000
npm run watch                                     # webpack, rebuilds on save
```

**If `php artisan test` cannot connect, the database container is not running.** That is the only common failure, and it looks like a config problem rather than a stopped container.

Then read `implementation_guide.md` §Batch 1a. Two things to settle first, both listed in §7: run the four production checks in §6 before converting `branch_name`, and confirm `stale_enquiry_days` with the business.

---

## 6a2. 🐬 MySQL is the only supported engine — owner's decision, 2026-08-27

**The live server is MySQL. SQLite portability is no longer a design constraint.** Local dev, `phpunit.xml` and production all run MySQL 8, so there is one dialect to reason about.

**Nothing built before this date needs reworking** — the portable choices already made (`CASE WHEN` over `IF()`, the generated-column gates) are correct on MySQL anyway. What changes is forward-looking: MySQL-only features may be used freely, and the SQLite caveats scattered through `database_relations_tree.md` are historical notes rather than live requirements.

**Two caveats that still matter, and are MySQL's own, not SQLite's:**
- **No transactional DDL.** A migration running several DDL statements can still half-apply and not be recorded. Every such migration needs a `Schema::hasTable` guard and idempotent constraint adds.
- **`log_bin_trust_function_creators = 1`** is required or no trigger can be created (`GAPS.md` #20).

---

## 6b. 🌐 Portal topology — six hosts, settled 2026-08-27

The planning set had **three** subdomains, conflated the tenant Boss with the platform Superadmin, and put Accounts inside the operational portals. All three were wrong. Owner's decision, now reflected in `PRD.md` §1.3/§2.1, `implementation_guide.md` §0.2/§3.3 and `docker/nginx/default.conf`:

| Host | Tenant bound? | `active_portal_scope` | Who |
|---|---|---|---|
| `focusair.` | ✅ | `'air'` | Pricing, Operations, Sales |
| `focussea.` | ✅ | `'sea'` | Pricing, Operations, Sales |
| `focusroad.` | ✅ | `'road'` | Pricing, Operations, Sales — **mode live, UI deferred** |
| `accounts.` | ✅ | none — cross-mode | Accounts (Command only) |
| `admin.` | ✅ | none — cross-mode | **The onboarded client's Boss / Director** |
| `superadmin.` | ❌ **none** | none | **F16s's own staff** — platform operator |

🔒 **The rename that matters: `admin.` was the platform operator and is now the tenant's Boss; the operator moved to `superadmin.`** They are different people with opposite trust levels — the operator works across every tenant, the Boss inside exactly one. Leaving the Boss on a host the middleware reads as *"no tenant binding"* would return unfiltered cross-tenant rows, and it would look correct in every single-tenant test.

⚠️ **"No portal scope" ≠ "no tenant scope".** `accounts.` and `admin.` bind no portal yet are fully tenant-bound. `BindPortalScope` only ever decides the *mode*; tenant binding always comes from `user → branch → company`, never from the host. Do not let the two collapse into one check.

**Accounts got its own host because there is one ledger, not one per mode** — invoices, GST register, bank reconciliation and CASS all span modes, so a bank transaction settling an air and a sea invoice has no home in a mode-scoped portal. The separate origin also gives browser-enforced isolation (cookies, storage, CSP are per-origin) around the product's sharpest control: pricing edits the cost sheet, **only accounts posts it**.

**Road: the MODE ships now, the UI does not.** `transport_mode = 'road'`, prefixes `ENQR-`/`JOBR-`, and both Batch 1b CHECK constraints admit road from the start. Reason for deciding it now rather than later: `chk_enq_mode_prefix`, `chk_jobs_mode_prefix` and three analytics UNIQUE keys are authored in **Batch 1b — the next batch** — and widening a live CHECK afterwards is an ALTER under load. `FocusRoadWaybill.vue` / `TruckManifest.vue` stay deferred (`PRD.md` §11).

**Still to build** (none of it blocked, all correctly sequenced *after* Batch 1b, which creates the `transport_mode` column it filters on): `BindPortalScope` middleware, `scopeForActivePortal()`, the `FocusSea*.vue` screens. Nginx already answers all six names; **DNS CNAMEs are the owner's to add** and are not needed for local work.

---

## 7. Where we stopped

✅ **BATCH 1a COMPLETE — 2026-08-27.** All 8 steps built, checkpointed and regression-tested. **Checkpoint 1a passes:** every batch-1a migration shows `Ran`, and `Port::count()` returns `0` without exception.

| # | Step | Migration |
|---|---|---|
| 1 | `sequence_counters` | `2026_08_27_010000` |
| 2 | `ports` + `App\Port` | `2026_08_27_010100` |
| 3 | `companies` ALTER | `2026_08_27_010200` |
| 3a | `{agent_code}` pair — `companies.code` + `agents_info.branch_code` | `2026_08_27_010300` |
| 4 | `customers` | `2026_08_27_010400` |
| 5 | `customer_contacts` | `2026_08_27_010500` |
| 6 | `partners` | `2026_08_27_010600` |
| 7 | `users` ALTER — `origin_port_id`, `designation`, `signature_text` | `2026_08_27_010700` |
| 8 | `uuid` + `job_id` on both waybill tables | `2026_08_27_010800` |

**Verified beyond the checkpoint:** every migration rolls back and re-applies cleanly; the full set applies to a **fresh database** in order (34 tables, no partial failures); constraints were tested behaviourally rather than only inspected — the CC gate honours the DPDP opt-out override, the client-group roll-up derives from `(company_id, email_domain)`, both `customers` hot-path indexes are confirmed in use by `EXPLAIN`, and the full `user → branch → company → tier` chain resolves and yields `agent_code`. `php artisan test` **26 passed** and `npm run test:unit` **9 passed** throughout.

**Next: Batch 1b** — `enquiries` must precede `jobs` (`jobs.enquiry_id` is NOT NULL). Read `implementation_guide.md` §"Batch 1b".

🕳️ **Open gaps now live in `GAPS.md`** — 18 items with what breaks and when each is due. **Four come due in Batch 1b or Step 2:** the `encrypted` cast on the bank columns (#3, Step 2 — plaintext until then), the MySQL trigger forms that have never been executed (#5, Batch 1b), the waybill `job_id` FK that must be added the moment `jobs` exists (#17, Batch 1b), and `ui_ux_guide.md`'s missing reconciliation pass (#4, before Step 6).

**Also noted:** new models need `composer dump-autoload` before tinker's bare-name aliasing finds them (`Port::count()` fails with *Class "Port" not found* until then). Bites at every model checkpoint.

### Readiness review — 2026-08-26

A full pass over the planning set against the live codebase. **The plan itself is not the blocker:** the DDL carries 59 tables, every one appears in the Step-1 build order (zero orphans), all seven CHECK constraints are real, and every column the PRD calls un-retrofittable (`quoted_amount`, `origin_code`/`dest_code`, `first_response_at`, `pdf_processing_jobs.enquiry_id`, `cargo_data_source`) genuinely exists. What blocked Batch 1a were reconciliation gaps with this codebase.

| # | Gap | Status |
|---|---|---|
| 1 | Plan assumed **session auth**; codebase is stateless JWT | ✅ **Resolved** — §6, guide §3.0/§3.3/§3.6, PRD §2.1 |
| 2 | `users.branch_name` is `VARCHAR`, DDL says `BIGINT` FK | ✅ **Decided** — §6. Values are already IDs; convert + FK, keep the name. Gated on the 4 production checks |
| 3 | Batch 1a tried to add `pima_address`, which already exists | ✅ **Removed** from guide §Batch 1a·7 |
| 4 | `unique_role_gate` used MySQL-only `IF()` | ✅ **Fixed** — now `CASE WHEN`, portable |
| 5 | 3 triggers + 3 views specified in prose, **never authored** | ✅ **Authored + tested** 2026-08-26 — schema doc §Triggers & Views |
| 6 | 6 DDL blocks are greenfield for tables that already exist | ✅ **Annotated** `⚠️ EXISTS — ALTER only` in the DDL |
| 7 | Step 0 unbuilt: no docker-compose, no Horizon, no Redis/Soketi wiring | ✅ **Stack written 2026-08-26** — `docker-compose.yml`, `Dockerfile.laravel`, `Dockerfile.fastapi`, `docker/nginx/default.conf`, `.env.docker.example`. `docker compose config` validates. Horizon still not a dependency (a `queue:work` worker stands in) |
| 8 | ~~No `python/` directory~~ | ✅ **False alarm — corrected 2026-08-26.** `python/` **is** in the repo and always was; an earlier check used a shell glob with no match, which aborted the command before `ls` ran, and the empty output was misread as "missing". Contents: `ocr_server.py`, `extract_awb_new.py` (~9.1k lines), `geo_constants.py`, `boxes_config.json`, `requirements.txt` |

**Frontend stock-take:** Vue 2.7.16 ✅, ApexCharts ✅, Vuex/Router ✅. Still needed later — `vuedraggable`, `driver.js`, `html2canvas`, TipTap v1, `laravel-echo`, `pusher-js`.

### Open items

1. ~~**§5 duplication check**~~ — **closed 2026-08-26. No duplicates; create all four planned tables fresh.** `contacts` is a website contact-form/lead table (`first_name, last_name, email, phone, message`) — unrelated to a client address book. `saved_addresses` is a per-waybill address store keyed by `awb_id`, closest to `job_entities`, not `customer_contacts`. `rates` is an airline tariff lookup (dest airport, zone, carrier prefix, rate range); `rate_cards` is a per-party charge tariff — different grain. `airlines` was already resolved in `PRD.md` §10: retained for the carrier-domain exclusion list, while accounting/operational carrier records live in `partners`.
2. **`it_devops_checklist.md` says production migrations are applied as manual SQL, not via Artisan.** Local dev uses Artisan (approved). How schema reaches production is still undecided.
3. **Google restricted-scope CASA assessment** — deferred by the user to a later stage. Blocks Gmail onboarding at scale (100-user cap until cleared), not local work.
4. **System-transactional email sender** — undecided; needed before Segment C.
5. ~~1 commit unpushed~~ — the planning set is pushed. Working tree also carries **pre-existing** modifications to `public/*` (webpack build output) and a `package-lock.json` name change, neither authored by this work; they are deliberately left uncommitted.
6. ~~**Author the 3 triggers and 3 views**~~ — ✅ **done 2026-08-26**, both dialects, SQLite forms tested. Two decisions were deliberately left open inside them: see items 12 and 13.
7. ~~`origin_airport_code` vs `origin_port_id`~~ — ✅ **closed: keep both.** Different things; `origin_port_id` is an FK into the new `ports` master. Added nullable, backfilled once the port directory is loaded.
8. ~~`composer require doctrine/dbal`~~ — ✅ **installed 2026-08-26 at `^3.1.4` (resolved 3.10.6).** ⚠️ **Do not let this drift to 4.x.** A bare `composer require doctrine/dbal` pulls 4.4, which Laravel 9 does not support (`^2.13.3|^3.1.4`), and `carbonphp/carbon-doctrine-types` had to be pinned to `^2.0` alongside it — 3.x conflicts with every dbal 3 release. Verified working: `->change()` converted a `varchar` column holding `'3'` to `BIGINT UNSIGNED` holding `3`, which is precisely the `branch_name` migration.
9. ~~Run the four production checks before converting `branch_name`~~ — ✅ **closed 2026-08-27: the checks are now inside the migration.** `2026_08_27_000000_convert_users_branch_name_to_agent_fk` refuses to run and names the offending rows if any `branch_name` is non-numeric, points at a missing branch, or is empty — aborting *before* it alters anything, since MySQL cannot roll back a partial DDL. Verified on MySQL 8 across all four paths. **It changes no data**: the values were already `agents_info.id`. Nothing to remember, nothing to run by hand — the deploy either succeeds or tells you exactly which users to fix.
10. **Two dead references in live code** (non-blocking): `config/auth.php`'s `admin-api` guard → non-existent `App\Admin`; `App\User::GetAssosName()` → non-existent `App\Association`.
11. ~~Suspected live bug: `users.company_name` lookup~~ — ✅ **fixed 2026-08-26.** `LoginController` looked the company up by *name* while the column stores the company **ID**, so `templates_config` came back null on every login. Now resolves by id with a name fallback for any older row. Lint-clean; still worth confirming the effect against production, since the local DB is empty.
12. ~~Should the designation trigger cover `jobs.pending_ops_id`?~~ — ✅ **Yes, added 2026-08-26 and tested.** It is promoted straight into `ops_id` on approval, so it carries the same rule; guarding it makes a bad choice fail for the operator who made it rather than for the pricing owner at the accept step.
13. ~~Does `ysr_funnel_view` mean the calendar year or the fiscal year?~~ — ✅ **Neither is hard-coded: the reader chooses.** The view emits **both**, tagged by a `period_basis` column (`'fiscal'` | `'calendar'`), so a UI toggle is a `WHERE` clause instead of a schema change. The fiscal basis returns the April 1st opening the fiscal year, matching `EnquirySequenceService::fiscalYear()` exactly, so a yearly report and a document number always agree.
    ⚠️ **`period_basis` must always be in the `WHERE` clause.** Query the view without it and every row comes back twice under two year labels, silently doubling every count. Make it a required repository parameter, not an optional filter.
14. ~~`deleted_at` does not exist anywhere in the schema~~ — ✅ **Added 2026-08-26** to all seven tables `PRD.md` §9.3 names, and to **no** financial table. All three funnel views now filter `WHERE e.deleted_at IS NULL`. Note `companies` is one of the six live tables, so its `deleted_at` is an **ALTER** in Batch 1a, not a create.
    **Soft deletes collide with UNIQUE constraints — three cases got three different answers** (full table in the schema doc):
    - `jobs`/`enquiries` number uniques: ✅ **left alone** — a tombstone holding the number is the product rule ("never recycled"), not a bug.
    - `job_entities (job_id, unique_role_gate)`: ✅ **fixed** — `deleted_at IS NULL` folded into the generated gate, so a deleted row leaves the index and a replacement shipper can be assigned. Tested.
    - `mailbox_connections.email_address` (globally unique): ✅ **avoided — this table does not soft-delete.** Removed from `PRD.md` §9.3's list; **do not re-add it, and do not put the trait on that model.** Six tables soft-delete, not seven.

- **🔀 `mailbox_connections` has TWO deactivation axes — corrected 2026-08-26 after a user catch.** A first pass put both a tier downgrade and a user removing their own mailbox on `is_active`. **They are different actors and must not share a column:** a tier downgrade is a **platform superadmin** action on `companies.tier`; removing a mailbox is an **individual user** action in `/settings/mailboxes` (`PRD.md` §2.3.7 assigns them to different owners).
  | | Tier downgrade | User removal |
  |---|---|---|
  | Actor | Superadmin, whole tenant | The mailbox owner, one mailbox |
  | Column | `is_active = false` | `disconnected_at` / `disconnected_by` + `auth_state='not_connected'` |
  | Tokens | **Kept** (§3.3: upgrade restores without re-auth) | **Cleared** — consent was withdrawn |
  | Undo | Automatic on upgrade | Only the user, via fresh OAuth |

  **The bug this prevents:** §3.3 has an upgrade reactivate downgraded mailboxes. Sharing the column means a later upgrade **silently reconnects a mailbox its owner deliberately removed and resumes syncing their mail** — triggered by a billing change, performed by nobody. Restore must read `WHERE is_active = 0 AND disconnected_at IS NULL`, and sync requires **all three** of `is_active = 1`, `disconnected_at IS NULL`, `auth_state = 'connected'`.

- **✅ `mailbox_connections.status` dropped 2026-08-26.** It duplicated `auth_state` (same three values), and two columns describing one fact eventually disagree. `auth_state` survives as the sole connection-state column — it is the one `PRD.md` §5.2.1's four UI states are written against. Also corrected while there: the relational tree said repeated backfill failure sets `auth_state = failed`, which is not one of its values; §5.2.3 specifies `reauth_required`.

---

## 8. Constraint inventory (what the schema enforces)

| Type | Count |
|---|---|
| CHECK | 7 — `chk_enq_status`, `chk_jobs_status`, `chk_enq_mode_prefix`, `chk_jobs_mode_prefix`, `chk_saq_audience`, `chk_saq_internal_no_draft`, `chk_share_approval` |
| **ON DELETE RESTRICT** | **3** — `jobs.enquiry_id`, `accounts_invoices.job_id`, `accounts_purchase_vouchers.job_id`. **These block deletes and will surprise you in tests** |
| ON DELETE CASCADE | 26 |
| ON DELETE SET NULL | 25 |
| UNIQUE | 29 |
| Generated column | 1 — `job_entities.unique_role_gate` (`CASE WHEN`, portable as of 2026-08-26) |
| Triggers | **3 rules → 8 MySQL objects / 10 SQLite.** ✅ Authored 2026-08-26 |
| Views | **3** — `dsr` / `msr` / `ysr` funnel. ✅ Authored 2026-08-26 |

> ✅ **Authored and tested 2026-08-26** — see `database_relations_tree.md` §*Triggers & Views*. An earlier version of this table listed "Triggers | 3" as though the schema already carried them; it did not — `grep -i trigger` returned nothing. Both dialects are now written, and the **SQLite forms were executed against a scratch database with 12 passing behavioural assertions.** The MySQL forms are translations of the same logic and still need a run against MySQL 8.
>
> "3 triggers" was always a count of *rules*, not statements — each rule needs a trigger per operation per table, and SQLite needs one per column because it has no procedural `IF`:
>
> | Rule | Required by | MySQL | SQLite |
> |---|---|:---:|:---:|
> | `audit_logs` append-only | guide §1b·7, Step 8.4 | 2 | 2 |
> | `jobs.ops_id` / `jobs.pricing_id` designation | guide §3.4 | 2 | 4 |
> | `accounts_*.created_by` = accounts user | guide §3.4 | 4 | 4 |
>
> **Two things the triggers deliberately do not do**, both flagged in the schema doc rather than decided: `jobs.pending_ops_id` is **not** guarded (§3.4 names only `ops_id`/`pricing_id`), and `ysr_funnel_view` uses the **calendar** year while document numbering uses the **fiscal** year.
>
> ⚠️ **They will break naive test factories.** Any factory attaching a random user to `ops_id` now fails at the database — mint users with explicit designations. This joins the three `ON DELETE RESTRICT` FKs as the second thing that will surprise you in tests.

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
