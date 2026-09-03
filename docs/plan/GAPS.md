# 🕳️ Open Gaps

**Purpose:** every unresolved question, deferred obligation and known defect in one place, so none of them is rediscovered late or shipped by accident.
**Last updated:** 2026-08-30

> **How to read this.** Each gap says what is wrong, **what breaks if it is not fixed**, and **the latest point it can safely be fixed**. Nothing here is blocking Batch 1a. Several become blocking later, and the "Due by" column is the honest deadline, not a preference.
>
> Gaps are resolved by **deciding**, not by discovering. Most of these are decisions nobody has made yet — the code cannot make them, and guessing produces a coherent-looking answer that is wrong (see `CONTEXT.md` §6, the `is_active` mailbox case).

---

## 🔴 Blocking — must be resolved before the named step

| # | Gap | What breaks | Due by |
|---|---|---|---|
| 29 | 🟢 **RESOLVED 2026-09-01 — the versions exist now and the service runs.** All four pins (`pdfplumber==0.11.9`, `fastapi==0.136.1`, `uvicorn==0.46.0`, `python-multipart==0.0.28`) were verified against PyPI, installed into a clean venv, and `ocr_server:app` was started and answered `/health` with `{"status":"ok"}` and a malformed `/extract` with a clean `422`. They had simply not been published yet when this gap was measured; nothing needed changing. **This unblocks the structured/coordinate path end-to-end** — but see #38, which is the half that is still missing. |
| 36 | 🔴 **OUR OWN GSTIN HAS NO COLUMN, so the GST split cannot be determined.** `gst_no` exists on `customers` and `partners` — the COUNTERPARTIES — and nowhere on `agents_info` or `companies`. `PRD.md` §1550's rule is *"if the first two digits of the counterparty GSTIN match **our branch state code**, apply CGST + SGST, otherwise IGST"*, and our own state code is not stored anywhere | ⚠️ **The invoice TOTAL is unaffected** — 18% is 18% either way — which is exactly why this is easy to miss: the client is billed correctly and nothing looks broken. What breaks is **GSTR-1 and the customer's input credit**, because they claim against the heads we filed. `GstSplitService` therefore returns `determinable: false` and writes NO `gst_ledger_entries` row rather than defaulting to IGST, which would be silently wrong for every domestic intrastate shipment. A missing register row is visible and fixable before filing; a wrong one is invisible until the customer complains. **Needs `gst_no` on `agents_info`** (GSTIN is per registered place of business, so branch rather than company — but `gst_ledger_entries.company_id` implies company, which is the second half of the decision) | **Before the first GST return is filed** |
| 1 | **`users.origin_port_id` has no join path to backfill from — unless the directory load supplies one.** Guide §Batch 1a·7 says fill it from `users.origin_airport_code`, but `ports` has only `locode` and **no IATA column**, so `'BOM'` has nothing to match `'INBOM'`. ⚠️ **Loading `ports` with LOCODEs alone does NOT close this gap.** *(Confirmed with the owner 2026-08-27: `locations` and `ports` are deliberately separate tables — see the Resolved list — and the port data is being fed later.)* | Every user's origin port stays NULL after the directory loads. Registration can never require an origin port, which `PRD.md` §2.2 says it eventually must | **Port directory load** (guide §9) |
| 1a | **Mitigation, so #1 is not a hard block.** UN/LOCODE is `{2-char country}{3-char location}`, and for airports the 3-char part is *usually* the IATA code — `INBOM`→`BOM`, `INMAA`→`MAA`, `DEHAM`→`HAM`. So `SUBSTRING(locode,3,3)` backfills the large majority automatically | ⚠️ **A heuristic, not an authority.** UN/LOCODE and IATA are maintained by different bodies and do diverge, and a 3-char LOCODE segment can collide with an unrelated city's IATA code. Run it as a **proposal with a review pass**, never a blind `UPDATE` — a wrong origin port silently mis-routes a user's default lane | Same |
| 2 | 🟡 **PARTIALLY ADDRESSED 2026-08-28** — `EnquirySequenceService` now **refuses to mint a number** when either code is missing, naming the branch and the missing column, so `ENQA--26-0001` can no longer reach a client or customs. The columns are still nullable and empty: **backfill and tighten to `NOT NULL` before go-live.** ~~**`companies.code` and `agents_info.branch_code` are nullable and empty.**~~ Added 2026-08-27 (`2026_08_27_010300`); no existing row has a value and none could be invented | Every document number formats as `ENQA--26-0001`. Worse, if two branches are ever given the same pair, they emit **byte-identical invoice numbers onto customs paperwork** — counters are scoped per `agent_id`, so nothing downstream catches it | **Step 4.4** (`EnquirySequenceService`) |
| ~~3~~ | ✅ **CLOSED 2026-08-27** — the `encrypted` casts are on `Customer`, `Partner` (bank columns) and `MailboxConnection` (`access_token`, `refresh_token`, `sync_cursor`), all with `$hidden` so they never appear in a serialized model. Verified: the column holds 256 chars of ciphertext, the model reads the plaintext back, and `toArray()` omits both. ~~**The `encrypted` cast does not exist yet.**~~ `customers.bank_account_no` / `.bank_ifsc_code` are `TEXT` and ready, but **the column type encrypts nothing** — the Eloquent cast does, and that is Step 2 | Any write before the cast lands stores customer **bank details in plaintext**, and existing plaintext rows will not decrypt afterwards | **Step 2**, same commit as the model |
| ~~4~~ | ✅ **DONE 2026-08-28 — see `ui_ux_guide.md` §0a.** The pass found the expected scale of unbuilt work (10 of 13 routes, 10 of 13 components, 6 libraries) plus **four direct conflicts with live code**, of which one is a genuine trap: 🔴 **`resources/sass/` is not in the webpack build at all** — `webpack.mix.js` compiles `resources/css/app.css`, which is empty — so `_variables.scss` is a decoy that would silently swallow any token work done in it. Also: the guide's whole CSS-custom-property token system does not exist (zero tokens ship, no dark mode); the guide mandates a system font stack while `_variables.scss` names Nunito, which is never actually fetched; and `--bp-lg` means 1200px to the guide but 992px to Bootstrap 4 — same names, different values. |
| ~~23~~ | ✅ **DECIDED AND IMPLEMENTED 2026-08-28 — `ui_ux_guide.md` §0b.** `bootstrap-vue` stays (1,419 usages across 41 files; replacing it is a rewrite, not a styling choice) and the tokens theme it. Only the components §5 is specific about and bootstrap-vue lacks are hand-built: ghost buttons, status chips, drawer, split-pane toggle. The pipeline is `resources/css/app.css` — the only file mix compiles — and **60 CSS custom properties now ship**, verified in the built bundle. Dark mode is structured (`:root[data-theme="dark"]`) but not enabled. `resources/sass/` is marked at the top of the file as not compiled, so the §0a U3 trap cannot catch anyone again. |
| 5 | **MySQL trigger forms had never been executed.** 🟡 **PARTIALLY CLOSED 2026-08-27** — the `audit_logs` append-only pair now runs on MySQL 8.0.46 and is verified refusing UPDATE, single-row DELETE and blanket DELETE (`2026_08_27_021000`). **Still unrun:** the `jobs` designation guards and the `accounts_*.created_by` guards, which land with their tables | Running them immediately exposed gap #20 below, which would have blocked every trigger in the schema | Remaining triggers: with their tables |
| 20 | 🔴 **Triggers cannot be created at all unless `log_bin_trust_function_creators = 1`.** Binary logging is on by default in MySQL 8, and with this flag at `0` the application user needs `SUPER` to `CREATE TRIGGER` — so every trigger fails with **`ERROR 1419 You do not have the SUPER privilege`**, even though the user holds `ALL PRIVILEGES` on the schema. Found 2026-08-27 the first time a MySQL trigger was actually run. **Fixed locally** by adding `--log-bin-trust-function-creators=1` to the `db` service in `docker-compose.yml` | This blocks **every trigger in the product**, not just `audit_logs` — the append-only audit guard and the `jobs`/`accounts` designation guards that segregation-of-duties depends on. Safe to enable here because every trigger only `SIGNAL`s an error and writes nothing, so there is no binlog-determinism risk of the kind the flag guards against. ⚠️ **Production must have the same setting, or the DBA must grant `SUPER`/`SET_USER_ID` to whoever applies the schema.** This interacts with gap #10 — if production schema is applied as hand-run SQL by a privileged DBA, it may never surface there and will surface on any automated deploy | **Before first production deploy** |
| ~~17~~ | ✅ **CLOSED 2026-08-27** — `2026_08_27_020200_add_deferred_job_foreign_keys` adds both FKs (plus the cyclic `enquiries.reinitiated_from_job_id`) immediately after `jobs` is created, exactly as this gap required. `ON DELETE SET NULL`, not RESTRICT: a waybill is a real document that was really issued and must survive its job record being removed. Verified — `job_id = 999999` is now rejected, and a waybill attached to a deleted job keeps its row with `job_id` nulled. ~~**`air_way_bills.job_id` and `house_way_bills.job_id` have no foreign key.**~~ Added unconstrained on 2026-08-27 because `jobs` does not exist until Batch 1b — verified accepting `999999` today | Waybills can point at jobs that never existed. The window is intentional and short, but **if it is not closed the moment `jobs` is created, it never closes** — nothing later in the plan revisits these columns | **Batch 1b**, immediately after `jobs` |
| 18 | **`air_way_bills.agent_id` / `house_way_bills.agent_id` are signed `INT` with no FK**, while `agents_info.id` is `BIGINT UNSIGNED`. Neither waybill table carries **any** foreign key today | The same shape of defect as `users.branch_name` before it was converted (`CONTEXT.md` §6): an unconstrained, type-mismatched tenancy column on which MySQL will silently coerce. These are the tables the whole legacy product writes to | Not scheduled — **out of Batch 1a scope** (guide §8 says add only `uuid` and `job_id`). Worth its own migration |

---

## 🔬 Found by testing, fixed — patterns to repeat

| Gap | Finding |
|---|---|
| **`LoginController::login_superadmin()` is dead code.** No route registers it, and nothing in the frontend calls it. Found 2026-08-31 while trying to sign in to the `superadmin.` portal | Harmless but misleading: it looks like the superadmin entry point and is not. The real mechanism is the SHARED `/api/login`, which builds the guard name as `roles.role . '-api'` — so a `roles` row of `superAdmin` resolves to the `superAdmin-api` guard. **A `super_admins` row with no matching `roles` row cannot sign in**, and the response is a bare 401 with correct credentials. The seeder now creates both. Worth deleting the orphan method so nobody wires it later and ends up with two auth paths |
| 🔴 **`inputLimit` in the live air forms destroyed data silently, twice over.** It stripped every character outside `/[a-zA-Z0-9 ,\-_]/` from the STORED value — so "Müller & Co." became "Mller Co" — and ran `substring(0, maxLength)` on it on every keydown, cutting a 60-character name pasted or OCR-populated down to 35 the moment the field was next touched. Both against `implementation_guide.md` §4.1.2's explicit rule. **The identical function existed TWICE, under two names** — `inputLimit` in `FocusAir.vue` and `limitInput` in `HouseWayBill.vue` — so fixing one file was not enough. Both fixed 2026-08-31: the keystroke refusal survives (the operator SEES typing stop), the value rewriting is gone, and violations surface before submission | **A mangled consignee reads perfectly well.** That is what makes this class of bug survive a proofread and fail at customs instead. Verified in the browser: a 61-character name with `ü`, `&` and `.` now survives a keystroke intact. **Pattern: a validator that edits its input is not a validator.** |
| 🔴 **GST was booked as revenue, and the ledger balanced perfectly while doing it.** `InvoiceController::post` credited the invoice GRAND TOTAL to `4000-Freight-Revenue`, so tax collected for the government was recorded as our own income — overstating revenue by the tax and leaving the GST liability at zero, with the P&L, balance sheet and GST register all disagreeing with the invoice they came from. Fixed 2026-08-30 per `PRD.md` §12; `LedgerPostingService` now owns both sides so buy and sell cannot drift | **The existing test asserted only that debits equalled credits — and the wrong journal balanced.** A wrong-ACCOUNT posting balances exactly as well as a right one, so a balance assertion can never catch this class of defect. **Pattern: assert a ledger by its ACCOUNTS, never only by its totals.** |
| 🔴 **The tenant isolation scope was checking the WRONG GUARD and would have been inert in production.** `TenantScope` first used `auth()->hasUser()`, which resolves the **default** guard — `web`, session-based, and always empty under stateless JWT. Every live controller resolves via `auth()->guard('user-api')`. The scope therefore never matched, so **every query would have returned every tenant's rows, with nothing raised**. Fixed 2026-08-28 to resolve the JWT guard explicitly (catching `JWTException`, which tymon throws rather than returning null when no token is present) | Exactly the silent-no-op class the guide flags for session-backed portal scoping (§3.3) — reproduced in the tenant scope instead. Caught only because `CrossTenantIsolationTest` asserted a *count*, not merely that the scope existed |
| ⚠️ **`withHeader('Host', …)` does not reach `$request->getHost()` in Laravel's test client**, and neither does `withServerVariables(['HTTP_HOST' => …])`. Only a **full URL** (`postJson('http://focusair.f16sefreight.com/api/...')`) does. Verified 2026-08-28 | A portal test written the obvious way exercises **nothing** and passes for the wrong reason — the request resolves to the null portal, which is the permissive path |
| **CHECK constraints were case-INSENSITIVE.** `chk_enq_status` existed, reported present in `information_schema`, and **silently accepted `'Lost'`** — because the columns collate `utf8mb4_unicode_ci`. Fixed 2026-08-27 by forcing `COLLATE utf8mb4_bin` inside the constraint expression (this does **not** change the column's collation, so indexes and queries are unaffected). ⚠️ **Apply the same to every remaining status/enum CHECK** — `chk_jobs_status`, `chk_jobs_mode_prefix`, `chk_saq_audience`, `chk_saq_internal_no_draft`, `chk_share_approval`. **Why it matters:** MySQL's own reads stay case-insensitive so the backend never notices, but the value is serialised to JSON and Vue's `status === 'lost'` is case-sensitive — a `'Lost'` row passes every database check and then fails silently in every frontend guard | `PRD.md`'s first load-bearing rule says the Lost/Cancelled split is *"enforced by DB CHECK, not convention"*. The split itself held (`'Cancelled'` was correctly rejected); the **vocabulary** was only enforced up to casing |
| **A failing migration leaves a partial, unrecorded schema.** The first `enquiries` run created the table, then a bug in its own verification helper threw — so the migration was not recorded and the retry died on `1050 Table already exists`. Fixed with a `Schema::hasTable` guard + idempotent constraint adds | Exactly the failure `CONTEXT.md` §6 describes for `2026_05_16_060000`. **Every migration that runs more than one DDL statement needs this guard** — MySQL has no transactional DDL |
| **`email_messages.idempotency_key` was not actually UNIQUE.** The column table marks it `UK` and calls it the ** DOUBLE-SEND GUARD ** — *"a retried request collides on this UNIQUE key... sending a client the same message twice is unrecoverable"* — but the runnable DDL block declares only `idempotency_key CHAR(36) NULL` with the word UNIQUE in a **comment**. Declared properly in `2026_08_27_020500`; verified rejecting a duplicate while still allowing many NULLs for inbound | Without the index the guard did not exist and a double-click sent the client two emails |
| **The guide ordered `email_messages` BEFORE `email_threads`** (§Batch 1b steps 3 and 4), but `email_messages.thread_key` has an inline FK to `email_threads.thread_key` — messages cannot be created first. No cycle exists, so threads simply build first. Corrected in the guide | The guide's own stated job is *"order and dependency"*, which makes this the one kind of error it should not contain |
| 🔴 **`tenant_policies` as specified could not be created on MySQL at all.** The DDL pairs `policy_scope_gate ... STORED` with `FOREIGN KEY (agent_id) ... ON DELETE CASCADE`, but MySQL 8 refuses `ON DELETE CASCADE` on a column a **stored** generated column depends on — and `agent_id` is both. Fails with `ERROR 1215 Cannot add foreign key constraint`. Measured 2026-08-27: `STORED+CASCADE` fails, `VIRTUAL+CASCADE` works, `STORED+RESTRICT` works. **Fixed by making the gate `VIRTUAL`**, which keeps the cascade (an override belonging to a deleted branch is meaningless) and still indexes. Schema doc corrected | This is the second table in the schema to use the generated-column trick, and the interaction between it and the FK was never exercised. `job_entities.unique_role_gate` stays `STORED` and is fine — its base columns (`role`, `deleted_at`) carry no FK |
| **`DB::table('information_schema.table_constraints')` does not work** — the query builder quotes the whole string as one identifier | Use `DB::select()` with raw SQL for any `information_schema` read |

---

## 🔴 Blocking — found 2026-09-01

| # | Gap | Detail | Due |
|---|---|---|---|
| 38 | 🔴 **`/extract-unstructured` DOES NOT EXIST in the FastAPI service, so no AI path can run.** `python/ocr_server.py` is 93 lines exposing exactly two routes — `/health` and `/extract` (coordinate extraction via `extract_awb_new.py`). There is no `/extract-unstructured`, no `allow_vision` parameter, no `extraction_path` in any response, and **no reference to Gemma or Gemini anywhere in `python/`**. Verified by grep and by starting the service | Everything Laravel-side is built and tested against this contract: `OcrRoutingService` routes unstructured documents to `/extract-unstructured`, `ProcessPdfOcrJob` sends `allow_vision` and reads `extraction_path` back, and the whole consent flow parks on `extraction_path = 'none'` — **which nothing can currently return.** So a Tactical or Command tenant uploading an invoice today calls an endpoint that 404s, and the job fails rather than parking for consent. ⚠️ Resolving #29 did NOT resolve this: the service installs and the coordinate path works, but the AI half of the parser was never written. What is needed: the text-layer attempt (PyMuPDF/pdfplumber) returning `extraction_path: 'text'` with a Gemma-mapped payload, `extraction_path: 'none'` when there is no text layer and `allow_vision` was false, and the Gemini vision run when it is true | Before any unstructured document is uploaded; blocks §8.2 pytest |

---

## 🔴 FocusAir — found 2026-09-01 by putting demo data in

The air document layer had **zero rows** in `air_way_bills` and `house_way_bills`. Three
MAWBs were created through the real endpoint (`POST /api/user/create-focusair`) to see what
connects to what. It mostly does not.

| # | Finding | Detail |
|---|---|---|
| 39 | 🟢 **RESOLVED 2026-09-01.** **The AWB document was NEVER linked to its job.** `air_way_bills.job_id` is not written by any code path — `AirwayBillController` never sets it, and no other code does either. Meanwhile `JobController::cancel` *clears* it (`job_id → NULL`), so the detach releases a link nothing ever established | The operational half (enquiry → job → cost sheet → invoice → analytics) hangs off `jobs.id`. The document half (MAWB, HAWB, consolidation, PDF, XML, addresses) hangs off `air_way_bills.id`. **They are joined by nothing.** A job "has" an AWB only as loose text in `jobs.awb_number` |
| 40 | 🟢 **RESOLVED 2026-09-01.** **The two halves did not agree on the number's FORMAT.** `jobs.awb_number` is `176-10000008` — `IcegateValidator` enforces `/^\d{3}-\d{8}$/`, hyphen required. `air_way_bills.id` is the code and number concatenated with **no** separator: `17610000008`. Joining them requires `REPLACE(awb_number,'-','')`, and nothing in the codebase does | So even the string link is not usable as-is. Whichever direction this is fixed, one side changes |
| 41 | 🟢 **FIXED 2026-09-01.** **`create-focusair` wrote everything, then 500'd, if `status` was omitted.** `$status = $request->status` is NULL, `null != 'generate_pdf'` is true, so it updates `status => null` against a NOT NULL column — **after** every section has already been saved | The caller gets a 500 and cannot tell that the AWB was in fact created and populated. Measured: three AWBs exist, fully populated, from three requests that all returned 500 |
| 42 | 🔴 **`AirwayBillController::store()` is not transactional at all** (zero `DB::transaction` in the file). Each section — first box, shipper, consignee, routing, consignment, charges, payment, totals — saves independently | Any failure part-way leaves a **half-written airway bill** plus an error response. For a document that goes to an airline and to customs, "saved up to routing, then failed" is a worse state than "not saved" |
| 43 | 🟢 **FIXED 2026-09-01.** **A direct flight 500'd through the API.** `routingInformation()` reads `to_2`, `by_2`, `flight_2`, `date_2`, `to_3`, `by_3`, `flight_3`, `date_3` unconditionally, though the validator declares all eight `nullable`. Hidden in production only because the Vue form always sends them as empty strings | Any API client, integration or OCR-driven create with a single-leg routing crashes. The validator's contract and the code disagree |
| 44 | 🟢 **FIXED 2026-09-01.** **The address regex rejected ordinary real addresses.** `ship_address` is validated `/^[a-zA-Z0-9\s.,-]+$/` — no `/`, no `&`, no parentheses, no accents. Measured, all rejected: `Plot 42/A, MIDC Andheri East` · `Müller & Co., Hafenstrasse 12` · `Unit 5 (Rear), Dock Road` | Indian industrial addresses routinely carry `/`; European party names carry `&` and umlauts. This is the same instinct as the silent-truncation defect already fixed in both air forms — an allow-list built from what someone imagined an address looks like |

### How #39 and #40 were resolved (owner's decision, 2026-09-01)

**#39 — link the AWB to the job when connected.** `App\Services\AwbJobLinker` writes
`air_way_bills.job_id`, in BOTH directions, because either half can come first: a document
raised before conversion, or a job numbered before its paperwork exists. The document side
is called from `AirwayBillController::store()`; the job side is hooked on `JobObserver`
rather than on a controller, so every writer of `awb_number` is covered — imports and
console commands included. `backfill()` reconciles rows created while nothing wrote the
column; it linked all three existing AWBs on first run.

🔴 **The match is scoped by `agent_id`, and that is load-bearing.** An airline prefix plus
serial is unique per AIRLINE, not per forwarder, so nothing stops two branches recording the
same number — an unscoped match would attach one tenant's document to another tenant's job.
⚠️ An unmatched waybill is normal and stays NULL: documents are routinely raised before the
job exists, or for shipments that never become one.

**#40 — the hyphen after the first three digits.** `App\Support\AwbNumber` is now the one
place that knows the format. Canonical is **`176-10000008`**, matching what IATA prints, what
customs expects, and what `jobs.awb_number` already held.

⚠️ **The primary key stays numeric, and that is a constraint rather than a preference.**
`air_way_bills.id` is `BIGINT UNSIGNED AUTO_INCREMENT` and is the foreign-key target of
`way_bill_addresses`, `consignment_data` and `other_custom_information`, all keyed on
`awb_id`. A hyphen cannot go into it without migrating every one of those tables. So the KEY
is the eleven digits and the NUMBER is canonical; `AwbNumber::key()` and `::canonical()`
convert between them and nothing derives either by hand.

⚠️ **A wrong-length number is refused, never reshaped.** A truncated OCR read must not be
silently padded into something that looks like a valid AWB.

⚠️ **`air_way_bills.shipper_id` / `consignee_id` are dead columns.** Addresses actually live
in `way_bill_addresses`, keyed by `awb_id`; both id columns stayed NULL through a successful
save. Not to be confused for the real link.

---

## 🔴 FocusAir — found 2026-09-01 by saving a draft through the real endpoint

| # | Finding | Detail |
|---|---|---|
| 45 | 🟢 **RESOLVED 2026-09-01 — the column now exists.** `ConsignmentData` had always written `agent_id`, and `way_bill_consignment_data` never had it: no migration created it, so every save carrying `entries` died with *"Unknown column 'agent_id' in 'field list'"*, taking pieces, gross weight, goods description and every dimension line. The live form sends `entries` on the ordinary path, so this was not an edge case. Added as **BIGINT UNSIGNED NULL with a real foreign key** — deliberately NOT copying `air_way_bills.agent_id` / `house_way_bills.agent_id`, which are signed `INT` with none (#18); matching that mistake for consistency would double it. Nullable because the branch comes from the acting user and an import has none — NULL means *not attributed*, where a default of branch 1 would silently file another branch's cargo. ✅ Verified end to end: a draft POST now returns **200** with `agent_id` set from the logged-in user, cargo stored, and dimensions as `[{"pcs":"14","length":120,"width":80,"height":90,"unit":"CMT"}]` |
| 46 | ⚠️ **A party is dropped SILENTLY when incomplete, or rejects the whole request.** `store()` saves a shipper only when name **and** city **and** country are present — otherwise it skips it without a word. A consignee with only a name reaches its validator, which requires address, city, state, post code and country, and **422s the entire request** — after the waybill shell has been written (GAPS #42) | This is what extraction actually produces: a scan or a pasted line usually yields a NAME. So the honest shape is to report what will not be stored *before* saving, and to send only the parties that are complete. `ExtractionPanel` now does both |

⚠️ **Consequence for the extraction → draft flow:** a draft assembled from a document can
save its waybill and its parties, but **not its cargo**, until #45 is resolved. That is the
single blocker on "extract, save as draft, open the form".

---

## 🔵 Asked for, not yet buildable

| # | Item | Why it waits |
|---|---|---|
| 47 | **"Start a new mail" for a second AWB on the same conversation, keeping the same people in CC.** The owner's shape: one conversation is one shipment is one waybill, so needing a different AWB means starting a new thread — pre-addressed to the same participants, so the enquiry, job and waybill of the NEW shipment are connected from the first message | Composes and SENDS outbound mail, which needs two things that do not exist yet: **a connected mailbox** (Graph is built but no real mailbox is connected, so there is nothing to send through) and **the consent gate** — nothing leaves to a client without explicit operator consent, and `ClientNotificationService` already exists for exactly that. ⚠️ The half that IS buildable now is the state change underneath: an action that mints a fresh enquiry carrying the same participants, so the new thread is correctly attributed before mail can be sent. The compose-and-send step slots on top once a mailbox is live |

---

## 🔴 Email classification — found 2026-09-03

| # | Finding | Detail |
|---|---|---|
| 48 | 🔴 **`email_classification_rules` is EMPTY — zero rows.** `RegexClassificationService` is built and correct (domain_blocklist → sender_pattern → subject_keyword → body_keyword, priority ascending within each), but it has nothing to match against, so every inbound message falls through to the default `customer_enquiry` | ⚠️ **The seeded inbox hides this**: `FreightDemoSeeder` writes `classification` onto each thread directly, so the folders look populated and correct while the classifier has never run. Real rules are a CONTENT decision needing domain knowledge — which airline, CHA and trucker domains this client actually deals with — so they are the owner's to supply, not mine to invent |
| 49 | 🟢 **RESOLVED 2026-09-03 — the learning loop was never wired.** `RegexClassificationService::recordOverride()` existed, wrote the override row and incremented `override_count`, and **nothing called it** — while `AdminHealthController` already READ the table. The reporting end was reporting on data nothing wrote, so rule accuracy could never be measured, only guessed at | `EmailInboxController::classify()` now records every correction: original and corrected classification, who corrected it, the subject they saw, and the **sender domain** — which is what a future `domain_blocklist` rule gets written against, precomputed so "which domains do we keep getting wrong?" is a query rather than a script. ⚠️ `matched_rule_id` stays NULL: nothing records which rule fired on a thread, so an override is attributable to the CHANGE but not yet to the RULE that caused it. Closing that needs the classifier to stamp its matched rule at ingestion |

---

## 🔵 Open on the classification loop

| # | Item | Detail |
|---|---|---|
| 50 | 🟢 **RESOLVED 2026-09-03 — `shipping_line` added to the vocabulary.** It is now `customer_enquiry | airline | shipping_line | clearance | trucking_road`. Until then the list was air-shaped and `GlobalDomainDirectory` refused to learn a sea carrier at all rather than file Maersk under `airline`, which would have put sea carriers in the air folder and hidden it. The mapping is a real one now instead of a convenient lie |
| 51 | **`matched_rule_id` is still NULL on every override.** Nothing stamps which rule fired on a thread, so a correction is attributable to the CHANGE but not to the RULE that caused it. `recordOverride()` increments `override_count` only when a rule id is supplied, so rule-level accuracy — "200 hits, 180 overrides, this rule is harmful" — is still unmeasurable | Needs the classifier to record its matched rule on the thread at ingestion. Only matters once #48 (no rules exist) is resolved |
| 52 | 🟢 **RESOLVED 2026-09-03.** `EnquiryController::index` now returns `client_label` and `client_domain`. **Command** carries `customer_id` so the row reaches invoicing, credit and the client group; **Tactical** gets the name only and the id is REMOVED, not merely unused — a tier that cannot open a customer record has no business holding a key to one. Where no customer was onboarded, both tiers show the sending DOMAIN rather than a blank. `?client=` searches customer name, email domain and the address the conversation arrived from, so an operator need not know whether a client was ever onboarded to find them. ⚠️ The domain is DERIVED from the thread's first inbound message, never copied onto `enquiries` — a copy would be a second place for the same fact to drift, and a hand-created enquiry correctly has none |

---

## 🔐 The domain directory is review-gated

**Decided by the owner, 2026-09-03: nothing the platform learns may classify anybody's mail
until F16s has looked at it.** The directory is platform-wide, so one wrong entry misfiles
mail for every tenant at once — and the tenant it hurts cannot see why, because the rule is
not theirs. A bad per-tenant rule is one company's problem; a bad global one is everybody's.

  observed → **proposed** → reviewed → **approved** → classifying

`classify()` returns approved rows only, and `status` defaults to `proposed`, so any future
learning path is inert by default rather than live by accident. Review lives at
`/api/superadmin/domain-directory` (list · approve · reject · run the promotion sweep).

⚠️ A reviewer may **correct the classification while approving**. A proposal is a guess from
a partner row or a pile of corrections; the reviewer is the first person who actually knows,
and forcing reject-and-retype would mean the right answer never gets recorded.

⚠️ **Rejections are kept, never deleted.** Otherwise the next partner added for that domain
re-proposes it and the reviewer answers the same question forever with no record of having
answered it.

---

## 🟠 Design decisions with no owner yet

| # | Gap | Why it matters | Due by |
|---|---|---|---|
| 24 | 🔴 **`bank_transactions` cannot support the matching engine PRD.md §6.4 specifies.** The table (schema doc #35) has seven columns: `id`, `agent_id`, the two match FKs, `plaid_transaction_id`, `amount`, `reconciliation_status`. There is **no memo, no counterparty, no value date and no currency.** §6.4 requires *"Level 1 — direct: regex for job number or AWB **in the wire memo**"*, *"Level 2 — fuzzy/amount: exact payment amount combined with **client name or code**"*, and realized FX *"between `document_date` and **settlement date**"* | **Level 1 is unimplementable, not merely unimplemented**, and so is realized FX. Amount is the only signal that survives, so two invoices of the same value cannot be separated — `BankReconciliationService` returns both at `medium` rather than promoting a guess. Deliberately **not** worked around by inventing columns: the schema doc is the authority, and a local `memo` would fork our schema from the one production is built from. Plaid returns all four fields (`name`, `merchant_name`, `date`, `iso_currency_code`); a four-column migration unblocks the rest of the file | **Decision needed** — before reconciliation is used on real money |
| 26 | 🔴 **The ICEGATE wire format is not specified anywhere, and `manifest_filings` is five columns.** Guide §5.4 says *"generates flat-file CGM/SCMTR/IGM manifests for ICEGATE"*, but no layout — field order, delimiters, record types, header/trailer — appears in the PRD, the guide or the schema doc. Separately, the table (schema doc #39) carries only `id`, `agent_id`, `job_id`, `icegate_id`, timestamps, while `PRD.md` §5.8 describes a screen needing filing type (`CGM`/`SCMTR`/`IGM`), transaction status, custom-house code, submission date/time, amendment number, sending method (`Auto File`/`Manual`/`Email`) and a status log | **A flat file invented here would look correct, pass our own tests, and be rejected at the gateway** — the worst of the three outcomes, because a rejection is not a retry: it is an amendment with its own number and paper trail. So compilation is deliberately NOT built. What IS built is the part that is fully specified — `IcegateValidator` enforces every character limit, the ISO 6346 check digit, and both cross-row rules (houses must total the master; IMDG class requires a UN number), and `POST /jobs/{job}/manifest-filings` refuses to record a filing while any violation stands. **Needed: the ICEGATE flat-file spec (or a sample accepted file), and six columns on `manifest_filings`** | **Before any real transmission** |
| 27 | **`accounts_invoices.invoice_no` is `NOT NULL`, so a DRAFT must already carry a number.** That contradicts `InvoiceController::finalize`, whose docblock says the number is minted at finalization *"so a rejected invoice cannot burn one permanently and leave a hole in the sequence a GST auditor will ask about"*. Both cannot be true: either drafts are numbered at creation (and abandoned drafts burn numbers), or the column is nullable (and the schema doc is wrong) | Seeded to the SCHEMA, which is the authority for columns — every demo invoice including drafts carries a number, and `finalize()` keeps an existing one rather than minting a second. 🔴 **UPDATE 2026-09-01 — that exact failure had already shipped.** This entry warned against a `DRAFT-…` placeholder because `finalize()`'s `?:` would silently treat it as a real number. `JobCostSheetController::invoiceFor()` was creating drafts as `DRAFT-{job}-{timestamp}` anyway — the placeholder is truthy, so `?:` kept it and **every finalized invoice went to the client and into GSTR-1 numbered `DRAFT-…`**. `EnquirySequenceService` was never called for `INV` at all. Caught by `InvoiceFinalizeTest`. The convention is now EXPLICIT rather than accidental — `AccountsInvoice::DRAFT_NUMBER_PREFIX`, `placeholderNumber()` and `needsNumber()`, so one place defines what a placeholder is and finalization can recognise one. A placeholder is also what the UNIQUE key `uq_invoice_agent_no` forces: two unnumbered drafts on one branch would collide on the empty string. If burning numbers on abandoned drafts is unacceptable — and for GST paperwork it usually is — the column needs to be nullable and the schema doc updated | Before invoices are raised on real work |
| 28 | **`customer_performance_snapshots` carries `agent_id NOT NULL` and indexes it, but its UNIQUE key excludes it.** `uk_cps_customer_mode_date` is `(customer_id, transport_mode, snapshot_date)`, so exactly ONE row can exist per client per mode per day across the whole tenant — while `idx_cps_scope (agent_id, transport_mode, snapshot_date)` reads as though rows are per branch. Both are straight from the schema doc | **Found by running the rollup**: computing per branch made the second branch silently OVERWRITE the first, and every revenue figure came back `0.00` because the branch holding the invoices was rolled first and then clobbered by one holding none. The unique key is what the database actually enforces, so `sales:compute-snapshots` now rolls per COMPANY and writes `agent_id` as the client's managing branch (`customers.branch_id`) — which is also the correct business reading, since `customers` is tenant-wide and a shipping rhythm is a property of the client, not of whichever branch handled one shipment. ⚠️ **Consequence to confirm:** `/sales` filters the book by `agent_id`, so a client appears in exactly one branch's book. If two branches genuinely both serve one client and both expect it in their numbers, the UNIQUE key needs `agent_id` added | Before multi-branch clients are onboarded |
| 30 | **OLI weights by "distinct L×W×H cargo dimension lines" (α = 0.2 each), but no table stores them.** `PRD.md` §5.5 makes dimension lines a term in the one OLI formula; the schema has only aggregate `volume_cbm` and `piece_count` on `air_/sea_shipment_details`, and no `cargo_dimensions` table appears anywhere in `database_relations_tree.md` | `OperatorLoadService::dimensionLines()` contributes **0** and says so. That under-weights complex multi-dimension cargo — but it under-weights every operator equally, so the RANKING, which is what load balancing actually consumes, stays correct. Inventing a count from `piece_count` would be worse: pieces and distinct dimension lines are different facts, and ten identical cartons are one line, not ten. Needs either the table or a decision to drop α from the formula | Before `/settings/workload` exposes α |
| 31 | **The Kanban's four Process columns have no stated mapping to the nine job statuses.** `PRD.md` §5.5 says *"Process View (4 columns, exactly)"* — `Processing` → `Awaiting Customer` → `In Transit` → `Completed` — and separately defines nine `jobs.status` values, but never maps one set onto the other | Implemented as an INFERRED grouping, marked as such in `JobBoard.vue`: Processing = Intake/AI Extraction/Verification/Generation · Awaiting Customer = PDF Generated · In Transit = Sent to Airline/Airline Confirmed · Completed = Completed/Cancelled. **The genuinely ambiguous member is `PDF Generated`** — a generated draft is what a customer approves, so it sits in Awaiting Customer, but it could equally be the tail of Processing. A related consequence: because a column is a GROUP, a drop must pick one status, and it sets the column's FIRST stage ("has reached this phase", not "has finished it"). Confirm both readings | Before operations uses the board on live work |
| 32 | **The container stuffing matrix cannot record weight or volume.** `PRD.md` §5.8 describes it as allocating *"pieces/weight/volume per HBL-container pair"*, but `sea_container_items` (schema doc #20) carries `piece_count` and nothing else | Built pieces-only, and the screen says so. Pieces are the figure ICEGATE reconciles (houses must total the master exactly), so the filing path is complete — but **container weight limits cannot be checked**, and an over-weight container is refused at the terminal gate, not at filing. Two `DECIMAL` columns would close it | Before container weight limits are enforced |
| 33 | **The Boss has a "target assigner (revenue or tonnage)" and there is no targets table.** `PRD.md` §2.3 lists it among the Boss's core abilities and §7.4 shows targets on the executive dashboard, but no `sales_targets` / `branch_targets` table appears anywhere in `database_relations_tree.md`, and nothing in the PRD says what a target is scoped BY — branch, rep, mode, customer, or some combination | `/api/sales/branches` reports `targets: {available: false, reason: 'no_targets_table'}` and the screen says so in words. **Deliberately not faked with a hard-coded goal**: a dashboard showing progress against an invented target is worse than one that admits it has none, because the first gets acted on. Needs a table AND a decision on its grain — a target per (branch, mode, month) is a different product from one per rep | Before the Boss dashboard is used to manage anyone |
| 34 | 🎨 **DESIGN CALL TAKEN AUTONOMOUSLY — success states are toned NEUTRAL, not green.** The owner delegated styling decisions, so this was decided rather than asked; it is recorded here because it is a product judgement, not a colour preference, and it is easy to reverse if you disagree. **A screen whose normal state is a wall of green trains the eye to stop reading it** — and the one card that goes red then has to compete with four greens for attention rather than standing alone in it. So colour is spent only where something needs doing | Applied consistently: `up` on the platform monitor · `high` extraction confidence · `posted` and `paid` are the exceptions and DO stay green, because on a financial register "this money is booked" is a state an accountant actively looks for rather than a default. `void` is neutral, not critical — voiding is a routine correction and colouring it as an alarm makes a normal credit note look like a failure. **If you want conventional green-for-good, it is one line per state in `StatusChip.vue`'s TONE map** | Reversible any time |
| 35 | **A bug report's screenshot has nowhere to go.** `VisualReporter.vue` captures an `html2canvas` image and shows it to the reporter, but does not upload it: `support_tickets.screenshot_path` is `VARCHAR(500)` and expects a PATH to object storage (§5.10 says "S3 or local"), while the capture is a multi-megabyte data URI. Storing one would truncate it into garbage | The ticket sends WITHOUT the image, and the desk shows route, element selector and console logs — which is most of the evidence. The screenshot needs an upload endpoint and a storage decision (bucket, retention, and whether a screenshot of a client's data may leave the tenant's region at all — a DPDP question, not just a plumbing one) | Before the reporter is offered to clients |
| 25 | **PRD.md names only some chart-of-accounts codes.** `1200-AR`, `2100-AP`, `4000-Freight-Revenue`, `2200-GST-Output`, `4900-Sales-Adjustments` and `5500-Forex-Gain-Loss` are given explicitly (§12, §6.4). Cash, bank charges, direct costs and input GST are not | `1100-Bank`, `5100-Bank-Charges`, `5000-Direct-Costs` and `1300-GST-Input` are **our defaults**, chosen to sit in the same numbering bands, and named as such in `LedgerPostingService`. The chart is user-editable in `/settings/finance`, so this is low-risk — but they are defaults, not doc-derived, and an accountant importing an existing chart will want them mapped | Before `/settings/finance` |
| 21 | **`chart_of_accounts` has no `parent_account_id`.** `implementation_guide.md` §Batch 1c·1 calls it "self-referencing `parent_account_id`", but that column appears in **exactly that one line** of the whole planning set — absent from both the column table and the DDL in `database_relations_tree.md`, and no PRD behaviour needs it (the roll-ups the PRD describes are shipment and customer roll-ups, not account-tree ones). Built per the schema doc, without it | A real chart of accounts is usually hierarchical — parent accounts roll up in the trial balance and P&L. If the accountant expects `5000-Expenses` to total its children, that needs the column plus recursive aggregation. Adding it later is a cheap nullable self-FK; discovering the need during a period close is not | Before the finance screens (Step 5) |
| 19 | 🔴 **A user who reconnects after a tier downgrade silently never syncs.** Found by running the scenario, 2026-08-27. Sequence: the user removes their own mailbox (`disconnected_at` set) → superadmin downgrades the tier (`is_active = 0` on every row) → tenant is upgraded again, and the restore correctly **skips** that row because `disconnected_at IS NOT NULL` → the user later reconnects via fresh OAuth, which clears `disconnected_at`, sets `auth_state = 'connected'` and stores new tokens. **`is_active` is still `0`, stale from the old downgrade** — and sync requires all three | The user completes a full OAuth consent flow, the UI shows the mailbox connected, and **no mail ever arrives**, with no error anywhere. The two-axis design is right; what is missing is that the reconnect flow never re-evaluates the platform axis. Fix is in the reconnect handler — set `is_active` from the tenant's CURRENT tier rather than leaving whatever the last downgrade wrote. PRD.md §2.3.7/§3.3 specify each axis separately and never describe them interacting | **Step 5** (mailbox reconnect endpoint) |
| 6 | **`customers.default_port_id` / `.branch_id` / `.sales_id` are `RESTRICT`.** 🔎 **New evidence 2026-08-27:** `enquiries.sales_id` **is** specified `ON DELETE SET NULL` in the same DDL — strong support for making `customers.sales_id` match. The DDL carries no `ON DELETE` clause so MySQL defaults to it — but `CONTEXT.md` §8's audited inventory counts exactly **3** RESTRICT FKs and names all three, none of them these. That implies `SET NULL` was intended, at least for `sales_id` | A departing sales rep cannot be deleted while they own any client. Arguably correct — but `PRD.md` §2.3.3 has an explicit *Unattributed* bucket for `sales_id IS NULL`, which is evidence SET NULL was the intent. Implemented as RESTRICT because a blocked delete is **loud and reversible** while a silent unassignment is neither | Segment C |
| 7 | **Nothing enforces one `is_primary` per customer** in `customer_contacts`. Two rows can both claim to be the default `To:` recipient | The outreach draft addresses **whichever row the optimiser returns first** — a client-facing email to the wrong person, with nothing raised. The schema already has the tool (`job_entities.unique_role_gate` is a generated column doing exactly this), but adding it makes an 8th CHECK / 30th UNIQUE and breaks the audited inventory | Segment C outreach |
| ~~8~~ | ✅ **CLOSED 2026-08-28** — `EnquirySequenceService::increment()` does `insertOrIgnore` **before** `lockForUpdate()`, so the row always exists and the lock is a plain row lock rather than a gap lock. Racing inserts collide on `uq_counter_agent_prefix_fy` and are ignored. ~~**`sequence_counters` first-number-of-year deadlock.**~~ `SELECT … FOR UPDATE` on a row that does not exist yet takes a **gap lock**, not a row lock. Two branches minting their first number of a fiscal year concurrently can deadlock | Only on April 1st and only under concurrency — which is exactly when nobody is watching. Fix is an upsert-then-lock, not a schema change; the UNIQUE key already makes it *safe*, just not deadlock-free | **Step 4.4** |
| 9 | **`stale_enquiry_days = 7` is invented.** `PRD.md` §5.4 says only "the tenant's configured stale window" and never states a value; `config/f16s.php` carries 7 as a placeholder, flagged in both places | An enquiry is nagged about, or isn't, on a number nobody chose | Before launch — **confirm with the business** |
| 10 | **How schema reaches production is undecided.** `it_devops_checklist.md` says production migrations are applied as **manual SQL**, not Artisan. Local dev uses Artisan (approved) | Everything built here is a Laravel migration. If production is hand-applied SQL, the two drift and the `migrations` table stops describing reality — which is how `2026_05_16_060000` hid a broken ordering for two months (`CONTEXT.md` §6) | Before first production deploy |
| 11 | **System-transactional email sender undecided.** Needed for ticket mail and arrival notices, which cannot go through a rep's personal mailbox (`PRD.md` §5.2.1) | Segment C has no way to send system mail | **Before Segment C** |
| ~~22~~ | ✅ **CLOSED 2026-08-28 — owner chose the seeded system actor over a nullable column.** Each tenant gets one reserved `users` row (`designation = 'system'`, `is_active = 0`, unusable password) that automated actions attribute to, so `audit_logs.user_id` keeps its foreign key and every entry stays attributable to a real row. `App\Services\AuditLogger` is now the single write path and **always** writes — falling back to the system actor rather than skipping. One actor per TENANT, not per branch; `audit_logs.agent_id` still records the real branch. It passes no role gate (`'system'` is outside the real set, so every check fails closed with no special-casing) and `User::realPeople()` excludes it from every operator picker. 10 assertions. |

---


---

## 🟡 Known defects in live code (non-blocking)

| # | Gap | Notes |
|---|---|---|
| 12 | **`config/auth.php` registers an `admin-api` guard pointing at `App\Admin::class`, which does not exist** and has no table | Any login with `roles.role = 'admin'` **500s**. Removing the guard also needs the `'admin'` branch dropped from `PasswordResetRequestController.php:29` |
| 13 | **`App\User::GetAssosName()` references a non-existent `App\Association`** | Dead method; fatal if ever called |
| 14 | **`locations` table is empty** and populated only by an Excel import | Ties into gap #1 — it is the only IATA mapping in the codebase |

---

## 🔵 External / calendar items

| # | Gap | Notes |
|---|---|---|
| 15 | **Google restricted-scope CASA assessment** (`gmail.readonly`) | 🟢 **NO LONGER BLOCKING, 2026-09-01 — mail ships on Microsoft Graph first.** Google is deferred and Gmail becomes a second provider behind the same interface. Microsoft has no CASA equivalent: publisher verification is optional identity verification affecting the consent prompt, not a security audit, and M365 Certification applies to marketplace listings rather than an app a customer's own admin installs — for a single-tenant Entra app the client's Global Administrator simply consents. 🔴 **Before go-live, scope the app-only permission**: `Mail.ReadWrite` application permission reads EVERY mailbox in the tenant, so constrain it with an Exchange Application Access Policy or RBAC for Applications, and remove any unscoped Entra grant — a permission held both unscoped and resource-scoped effectively has no scoping. This unblocks §4.2, `MailboxSettings.vue` (Step 6 item 12) and Step 7 item 6. Original note: deferred by the owner. **Weeks-to-months lead time** — a calendar item, not a code item. Caps Gmail onboarding at 100 users until cleared. Decide *internal Workspace app vs public listing* before onboarding is built |
| 16 | **DNS CNAMEs for all six subdomains** → the ALB | Owner's to add. Nginx already answers all six names; **nothing local needs them** |

---

## ✅ Resolved (kept so they are not reopened)

| Gap | Resolution |
|---|---|
| `{agent_code}` had no source column | **2026-08-27** — `companies.code` + `agents_info.branch_code`, concatenated, no inner separator. `PRD.md` §6.3 corrected |
| `PRD.md` §5.2.7 vs §6.3 disagreed on number format | **2026-08-27** — §5.2.7's four-part form wins; §6.3 rewritten |
| `admin.` conflated the platform operator with the tenant's Boss | **2026-08-27** — operator moved to `superadmin.`; `admin.` is the client's Boss, fully tenant-bound. See `CONTEXT.md` §6b |
| Accounts had no home for cross-mode ledger work | **2026-08-27** — own host `accounts.`, tenant-bound, no portal scope |
| Road mode deferred, but Batch 1b CHECKs were about to lock it out | **2026-08-27** — mode ships now (`transport_mode`, `ENQR-`/`JOBR-`, both CHECKs); UI stays deferred |
| `bank_account_no` width: `VARCHAR(50)` vs `VARCHAR(255)` | **2026-08-27** — **both wrong**, measured. 10-char a/c → 200 chars; 34-char IBAN → **256**, one over `VARCHAR(255)`. Now `TEXT`, verified by round-trip |
| `ports` vs the legacy `locations` table | **2026-08-27, confirmed with the owner** — not duplicates, both kept. `locations` is IATA-keyed, air-only, carries tariff `zone`/`region`, read by `rates` and AWB routing display. `ports` is LOCODE-keyed, covers sea and land, and is the FK target for `users`/`customers`/`rate_cards`. Port data is fed later; see gap #1 for what that load must include |

---

## 🔴 Doc vs code — needs your call

| # | Disagreement | Detail |
|---|---|---|
| 37 | **Posting to a closed accounting period: `403` or `422`?** | `implementation_guide.md` §8.1 and `PRD.md` §2391 both say **403**. `InvoiceController::post()` returns **422** with `reason: no_open_period`, and `CreditGateTest` already asserts 422. Not picked silently. Either reading is defensible — 403 says *you may not*, 422 says *this document cannot be posted as it stands* — and the rest of the controller's refusals (`already_posted`, `not_draft`, `credit_limit_exceeded`) are all 422, which is the argument for leaving it. Meanwhile `InvoiceFinalizeTest` asserts only what both agree on: it is **refused**, the reason is `no_open_period`, and **no ledger row is written**. Say which, and it becomes one assertion |

⚠️ Note the guide's wording is *"posting to a **closed** period"*, and the existing coverage was for a period that does not exist **at all**. Those are different code paths: an implementation checking `whereNotNull` instead of `status = 'open'` passes the old test and still posts into a filed month. Both are now covered.

---

## 🟢 Built 2026-09-01 — the vision-consent path

The consent path existed on paper and in two services, but **nothing wired it to a human**.
`OcrRoutingService` and `OcrCreditService` were built and unit-tested; the live flow
(`OcrController::extract` → `ProcessPdfOcrJob`) called `/extract` with coordinates every
time and never consulted either. There was no accept/decline endpoint, no route, and no UI.
A scanned PDF parked at `awaiting_vision_consent` and was cancelled 24h later by the
sweeper — **vision OCR could never run**, and `OcrCreditService::reserve()` had no caller a
user could reach. Nothing errored; the operator saw a job that quietly never finished.

Now built:

| Piece | Note |
|---|---|
| `VisionConsentService` | The ONLY place a parked extraction leaves `awaiting_vision_consent`. `accept()` reserves then releases; `decline()` cancels with **no `failure_code`** — booking a decline as a failure puts cautious operators in an error dashboard and teaches them not to decline |
| `POST /api/user/ocr-consent/{jobId}` | The single point at which a credit is ever spent. Ownership enforced as `status()` does it — answering someone else's prompt spends someone else's credits |
| Routing wired into `ProcessPdfOcrJob` | Tier gate now runs for real: Core + unstructured fails with `upgrade_required` **before** any call. The worker parks on `extraction_path = 'none'` and refunds a failed paid run |
| Consent phase in `OcrUploadModal.vue` | The prompt states its price before the buttons. Without this branch the modal sat on *"Reading the document…"* forever |

🔴 **`isStructured()` had to change, or wiring the router in would have broken the live AWB
upload.** It matched a hardcoded list of three document CLASSES (`MAWB`, `HAWB`, `AWB`), but
the running product uploads a `system_templates` KEY — `ksr` — which `ProcessPdfOcrJob` has
always resolved to coordinates. Judged by the list alone every existing upload becomes
"unstructured": Core tenants would start getting `upgrade_required` for documents that used
to extract free. A document is now structured when a coordinate template **exists** for it,
which is the rule the code already relied on.

⚠️ **No schema change was needed and none was made.** There is no
`credit_transaction_id` on `pdf_processing_jobs`: `ocr_credit_transactions.pdf_processing_job_id`
already records which extraction burned a credit, so the reservation is findable from the
extraction, and a mirror column would be a second place for the same fact to be wrong.
Consent attribution (who said yes, when) goes to `audit_logs`.

⚠️ **A zero balance is NOT exhausted.** The tier floor is negative on purpose (tactical
−20, command −50) so a busy month finishes its shipments rather than failing mid-document.
Read quickly this looks like a gate that does not work; `VisionConsentTest` asserts the
overdraft explicitly so nobody "fixes" it.

🔵 **Gemma and Gemini are deliberately absent from all of this.** `VisionConsentService`
decides whether money may be spent and hands off; which engine runs and how its output is
shaped belongs to `ProcessPdfOcrJob` and the FastAPI service, and arrives with **gap #29**.
Until then an accepted prompt reserves a credit, calls an unreachable service, refunds, and
lands on `ai_unavailable` — which is the designed behaviour for an unavailable model, not a
placeholder.

---

## 🟢 Built 2026-09-01 — Microsoft Graph mailbox ingestion

Mail ingestion did not exist in any form: only `MailboxConnection` (the model), no poll
command, no OAuth, no provider SDK, nothing scheduled. Every `email_threads` row came from
the seeder. The downstream half — `RegexClassificationService`, `EmailInboxController`,
`JobInbox.vue` — was built and had nothing feeding it.

| Piece | Note |
|---|---|
| `MailProviderContract` + `NormalisedMessage` | The interface exists from the first line, **before** there are two providers. Everything hard about ingestion is provider-agnostic; only the delta cursor and the wire shape are not, so Gmail lands as a second implementation rather than a rewrite |
| `GraphMailProvider` | `/me/messages/delta`, **never** `/mailFolders/inbox/...` — a reply typed in Outlook lands in Sent Items only, and an inbox-scoped sync loses half of every conversation *and* every measurement of response latency |
| `ThreadMatcher` | The three tiers, in strict order, tier 3 never overriding 1–2 |
| `MessageIngestor` | Echo suppression via the UNIQUE `message_id`; each message in its OWN transaction so a page of 50 failing on the 49th does not roll back 48 and make the run unable to progress |
| `MailboxSyncService` | Token refresh with skew; cursor persisted after **every** page |
| `PollMailboxes` | 15 minutes, not 1 — push is primary. Four skip conditions, every run |
| `MailboxController` | OAuth connect/callback/disconnect/sync-now |
| `MailboxSettings.vue` | Step 6 item 12 |

🔴 **DELEGATED permissions, not application permissions.** App-only `Mail.ReadWrite` reads
EVERY mailbox in the tenant — HR and finance included — and would need an Exchange
Application Access Policy plus removal of any unscoped Entra grant (a permission held both
unscoped and resource-scoped ends up with no scoping at all). Delegated access is bounded by
the user who consented, which is the boundary the product already wants.

🔴 **The OAuth callback cannot be authenticated.** Microsoft redirects a browser with no
`Authorization` header, so the acting user rides in `state` — a random key into a 10-minute
cache entry, consumed on use. Anything guessable there would let someone attach a mailbox
they control to another tenant.

🐞 **Found by its own test: the participant check was trivially satisfied.** Tier 3 compares
participant sets, but the connected mailbox is on EVERY message — so the intersection was
never empty and tier 3 degraded to subject-only matching. Two different clients' "Quote
request" threads merged into one, which is a confidentiality failure, not a tidiness one.
Fixed by comparing counterparties with our own address removed.

## 🧪 Defects found by testing, fixed (kept so the reasoning is not lost)

| Found | Defect | Resolution |
|---|---|---|
| **2026-08-31**, Step 8.1 `EnquirySequenceConcurrencyTest` | **`EnquirySequenceService::increment()` deadlocked under concurrency** — six of eight parallel minters died with `SQLSTATE 40001`. The shape was insertOrIgnore → `lockForUpdate` → update. On an EXISTING row `insertOrIgnore` takes a **shared** lock to check the duplicate key, and `FOR UPDATE` must then upgrade S→X; every concurrent minter held S and waited for X. Not occasional — **reliable** whenever two people create a document at the same moment. Integrity was never at risk (no duplicate number was ever issued); **availability** was: the second user simply got a 500 | Replaced with a single atomic `UPDATE … SET current_value = LAST_INSERT_ID(current_value + 1)`, which takes X directly and has no upgrade to deadlock on, plus an insert-then-retry path for the first number of a fiscal year. `useReadPdo: false` on the read-back is **required**, not stylistic — `LAST_INSERT_ID()` is per-connection state and a replica would return another connection's value |

| **2026-08-31**, Step 8.1 `InvoiceFinalizeTest` | **Finalized invoices kept their draft placeholder as their permanent number.** A draft is created as `DRAFT-{job}-{timestamp}` because `invoice_no` is NOT NULL and UNIQUE per branch (#27). `finalize()` then minted with `$invoice->invoice_no ?: $sequences->next(...)` — and the placeholder is **truthy**, so the real number was never minted. `EnquirySequenceService` was never called for `INV` at all, contradicting §8.1's *"all generation routes through EnquirySequenceService"*. The number reaching the client and GSTR-1 was `DRAFT-280-20260831204454` | `AccountsInvoice::needsNumber()` + `DRAFT_NUMBER_PREFIX` — one place defines what a placeholder is, and `placeholderNumber()` is what creates one. Tests must assert the number **starts `INV-`**, not merely that it is non-empty or stable: the previous test asserted stability and passed against the placeholder |
| **2026-08-31**, same file | **A second, different deadlock on the INSERT path** — the first number of a `(branch, prefix, fiscal year)`. Concurrent `INSERT IGNORE` of a row that does not exist contends on the gap's insert-intention lock. Reachable on **April 1st and the first document of every new branch**. It passed in isolation and failed only in the full suite, because an earlier run had left the counter row behind | Retry — but **at the transaction boundary, not inside it.** A deadlock aborts the entire transaction, so retrying inside a caller's transaction fails as *"There is no active transaction"* and buries the real cause. `increment()` now rethrows when `DB::transactionLevel() > 0`, and all five minting call sites pass `EnquirySequenceService::DEADLOCK_ATTEMPTS` to `DB::transaction()`. `finalize()` also `refresh()`es inside the closure — a replay would otherwise keep a number whose reservation was rolled back with the attempt |

| **2026-09-01**, Step 8.1 `ReassignmentFlowTest` | **Four ways a handover could be left stranded.** (a) A direct reassignment by pricing cleared `pending_ops_id` but never dissolved the bell card — the owner was still offered [Accept]/[Reject] for a request that no longer existed, and answering returned `422 nothing_pending`, which reads as the product being broken. (b) It cleared two of the three staging columns, leaving `pending_ops_requested_at` set for a request that was gone, so every *how long has this been waiting* query counted it forever. (c) A request on a job with no `pricing_id` raised **no notification at all** — staged, `202` returned, waiting for a decision nobody would ever be asked to make. (d) A second request stacked a **second** pinned card, so the owner answered a request that was no longer current | `reassign()` now clears all three staging columns and calls `dissolveReassignment()`. `requestReassignment()` refuses an unowned job with `422 no_owner` rather than accepting something undeliverable, and dissolves any existing card before raising the new one so a superseding request replaces rather than stacks |

⚠️ **Why no test caught this earlier:** every prior test minted numbers *sequentially*. A sequential loop passes against an implementation with no locking whatsoever, so the entire suite was blind to the one property the lock exists to provide. The guide's word for §8.1 is *"parallel"*, and it has to be taken literally — the test now spawns real OS processes.

⚠️ **`artisan tinker --execute` is unusable as a subprocess** — PsySH opens TTY mode and aborts with *"TTY mode requires /dev/tty to be read/writable"* when stdout is a pipe. Children failed silently and the assertion passed vacuously on the few that survived. Concurrency children now run `tests/Support/mint_sequence.php`, which boots the framework and nothing else, and they must be handed the **test** database explicitly (`artisan` reads `.env`, which is the development database).

---

## Operational notes (not gaps, but they bite)

- **New models need `composer dump-autoload`** before tinker's bare-name aliasing finds them. `Port::count()` fails with *Class "Port" not found* until then — recurs at every model checkpoint.
- **Start the database first:** `docker compose up -d db`. A stopped container looks like a config problem, not a stopped container.
- **`export PATH="/usr/local/opt/php@8.2/bin:$PATH"`** on every PHP command — system PHP is 8.5 and this project cannot run on it.
