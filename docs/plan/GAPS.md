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
| 38 | 🟢 **RESOLVED 2026-09-10.** ~~**`/extract-unstructured` DOES NOT EXIST in the FastAPI service, so no AI path can run.** `python/ocr_server.py` is 93 lines exposing exactly two routes — `/health` and `/extract` (coordinate extraction via `extract_awb_new.py`). There is no `/extract-unstructured`, no `allow_vision` parameter, no `extraction_path` in any response, and **no reference to Gemma or Gemini anywhere in `python/`**. Verified by grep and by starting the service~~ | Everything Laravel-side is built and tested against this contract: `OcrRoutingService` routes unstructured documents to `/extract-unstructured`, `ProcessPdfOcrJob` sends `allow_vision` and reads `extraction_path` back, and the whole consent flow parks on `extraction_path = 'none'` — **which nothing can currently return.** So a Tactical or Command tenant uploading an invoice today calls an endpoint that 404s, and the job fails rather than parking for consent. ⚠️ Resolving #29 did NOT resolve this: the service installs and the coordinate path works, but the AI half of the parser was never written. What is needed: the text-layer attempt (PyMuPDF/pdfplumber) returning `extraction_path: 'text'` with a Gemma-mapped payload, `extraction_path: 'none'` when there is no text layer and `allow_vision` was false, and the Gemini vision run when it is true 🟢 **What closed it (2026-09-10):** `python/unstructured.py` reads the text layer (PyMuPDF, with pdfplumber as the fallback) and returns `extraction_path: 'text'` with the same key vocabulary `/extract` uses; `extraction_path: 'none'` when there is no text layer and `allow_vision` was false, so the consent flow now has something real to park on; `python/model_extract.py` calls Gemma over Ollama to fill only the regions label anchoring could not. Verified end-to-end through the container on 2026-09-10: a one-page invoice returned `extraction_path: 'text'`, `read_by: 'labels'`, 480.5 kg / 12 pieces. ⚠️ The vision half is NOT closed — `google-generativeai` is still absent and a scan answers **501**, which is now GAPS #38a. | Before any unstructured document is uploaded; blocks §8.2 pytest |

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
| 42 | 🟢 **FIXED 2026-09-10 — `store()` and `update()` are now transactional.** Was: not transactional at all** (zero `DB::transaction` in the file). Each section — first box, shipper, consignee, routing, consignment, charges, payment, totals — saves independently | Any failure part-way leaves a **half-written airway bill** plus an error response. For a document that goes to an airline and to customs, "saved up to routing, then failed" is a worse state than "not saved" |
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
| 50 | 🟢 **RESOLVED 2026-09-03 — the vocabulary is per MODE.** `classificationsForMode()` gives air `airline`, sea `shipping_line`, and a cross-mode portal the union (it reads sea threads, it does not file them). `classify()` validates against THE PORTAL's set, not the union — otherwise an air operator could file a thread as `shipping_line` and it would vanish from every folder they have. The inbox rail now comes from the server rather than a hardcoded air list, which was the actual bug. ⚠️ Two wrong turns on the way, both corrected by the owner: first adding `shipping_line` to the air list, then removing it from the DIRECTORY as well. **The platform learns sea carriers; only the air inbox declines to offer them** — learning globally and showing per mode are separate questions |
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

## 🔴 Found 2026-09-03 — the address book was not scoped

| # | Finding | Detail |
|---|---|---|
| 53 | 🟢 **RESOLVED — `SavedAddress` had NO tenant scope at all.** The model carried no `BelongsToTenant`, and `WaybillTrait::getAddressByType()` fetched by **raw id with no filter** — so any authenticated user could read any branch's, and any TENANT's, saved shipper or consignee by guessing a number. Both AWB forms call that endpoint | The table happened to be EMPTY, so nothing leaked — but the endpoint is live and would have leaked the first party anybody saved. Now branch-scoped (`agent_id`), with `SavedAddressScopeTest` asserting a foreign tenant, a sibling branch, and an unattributed row are all refused. ⚠️ **Production may hold rows with NULL `agent_id`**, which are now readable by nobody. That is the correct answer for an unattributed address, but if such rows exist they need a backfill like `partners` got — check before deploying |
| 54 | ⚠️ **The address book silently forgot notify parties.** `AddressBookController::index` hardcoded `whereIn('address_type', ['shipper_address', 'consignee_address'])`, so an `also_notify_address` could be SAVED and never offered back. Fixed, and the endpoint now takes an `address_type` filter for the extraction panel's pickers | Found while wiring the saved-address dropdown — the third type simply had no way home |

---

## 🔴 Found 2026-09-03 — the document layer

| # | Finding | Detail |
|---|---|---|
| 55 | 🟢 **FIXED 2026-09-10.** Was: **The AWB PDF template crashes on a waybill with no address row.** `documents/generate-awb-pdf` reads `$airWayBill->wayBillAddress->ship_phone` unguarded, so a waybill whose `way_bill_addresses` row does not exist throws *"Attempt to read property on null"* — a 500 rather than a partly-blank document | **Reachable in production:** `firstBox()` creates the waybill BEFORE any address is saved, so any draft printed before its parties are entered hits this. Found because a test fixture created a waybill without one. Not fixed — guarding a 200-line legacy template is its own pass, and half-guarding it would produce a document that prints blank where it should refuse |

---

## 🔴 Found 2026-09-03 — the identifier chain was built but never shown

| # | Finding | Detail |
|---|---|---|
| 56 | ⚠️ **The inbox showed the enquiry number for the life of the thread, including long after it had converted into a job.** Every link of the chain already existed — `EnquiryController@convert` is the only path that writes a `jobs` row and mints `execution_job_no`, `jobs.awb_number` is what `AwbJobLinker` matches on, and `Enquiry::jobs()` connects them — but `EmailInboxController::shape()` only ever loaded `enquiry:id,enquiry_no,status`. So the API never told the UI a job existed, and both the list and the conversation header kept quoting a number that had stopped being the live handle | Fixed. `shape()` now eager-loads `enquiry.jobs` and returns `job` (id, `execution_job_no`, `awb_number`, status) plus `job_count`; the UI shows the **job** number once one exists and falls back to the enquiry number before that. ⚠️ **The drawer was fetching this separately** — a second `GET /jobs?enquiry_id=` fired after the thread loaded, which is why the *list* could never show a job number at all and the drawer showed one a beat late. That round trip is gone. Newest job wins out of a consol split, matching `JobController@index`'s `latest()`, and `job_count` says how many others there are rather than silently picking one |

⚠️ **The enquiry number is not deleted, it is demoted** — it stays in the API response, on
the drawer identifier's `title`, and on the Enquiries board. A number already quoted to a
client stays recoverable; it just stops competing for the eye once a job exists.

---

## 🔴 Found 2026-09-03 — the outcome gate, and a dead branch behind it

| # | Finding | Detail |
|---|---|---|
| 57 | ⚠️ **The workspace let an operator draft a waybill against an enquiry nobody had confirmed.** Extraction opened the moment a thread was classified, so paperwork could be raised for a shipment that might never fly — and the enquiry stayed in the funnel as neither won nor lost while the operator moved on | Fixed. The extraction tab now asks **"Did this shipment confirm?"** first. *Shipment confirmed* posts `/enquiries/{id}/convert` — confirmed **is** converted, since a job row is the definition, not a status flag — and only then does `ExtractionPanel` render. *Shipment lost* is a two-step, because `lost_reason` is required by the API and is the entire point of recording a loss. A lost enquiry offers **reopen**, which keeps the original number |
| 58 | 🔴 **`EnquiryObserver`'s reopen branch had never executed — not once, for any enquiry.** It compared `getOriginal('status')` against `EnquiryStatus::Lost->value`, but **`getOriginal()` applies casts**: it returns an `EnquiryStatus` enum, and `enum === 'lost'` is always false. `getRawOriginal()` is the uncast accessor | Consequence, which is worse than the bug: `reopened_at` was **never stamped for any enquiry in the system** (`SELECT COUNT(*) WHERE reopened_at IS NOT NULL` → 0), and a revived enquiry **kept its `lost_at` and `lost_reason`** — so it sat in the open funnel and counted as a loss simultaneously. Fixed by using `getRawOriginal()`; the regression test asserts the loss is *unwound*, not merely overwritten. ⚠️ **Worth grepping for elsewhere** — `getOriginal()` on any cast column has this shape |

### How loss is tracked (the owner asked, 2026-09-03)

Loss is a **deliberate declaration**, never inferred:

- `status = 'lost'` (DB CHECK, case-sensitive, `COLLATE utf8mb4_bin`)
- `lost_reason` — **required**, one of `rates_high`, `delay_in_response`, `client_cancelled`, `capacity_issue`, `other`
- `lost_reason_custom` — free text, for `other`
- `lost_at` — stamped by `EnquiryObserver`, not the controller
- an `enquiry.lost` audit row
- 🔴 **refused outright if a job exists** — a confirmed shipment that later stops is a CANCELLED JOB, not a lost enquiry. Allowing both would count one request as a win and a loss at the same time and corrupt conversion rate and loss analysis together

⚠️ **RESOLVED 2026-09-04 — see #59 below.** The hole described here is now closed: the
sweep escalates and then closes. The paragraph is kept because it states the problem the
escalation exists to solve.

⚠️ **The hole is silence, not the schema.** `enquiries:nudge-stale` reminds the operator that a
client has gone quiet; **nothing ever marks an enquiry lost automatically**, and that is
deliberate — a system-invented loss reason is worse than no loss reason. But it means the
funnel is only as honest as operator discipline. In the demo data **40 enquiries have sat in
`new`/`quoted`/`awaiting_client` for over 14 days**, counted as neither won nor lost. Whether
those should auto-expire to `lost` with reason `delay_in_response` after the tenant's window,
or simply be surfaced as an *"awaiting your decision"* queue, is **the owner's call** — see
the design-decisions table.

---

## 🔴 Found 2026-09-04 — the nudge sweep, and two more branches that never ran

| # | Finding | Detail |
|---|---|---|
| 59 | 🟢 **Nudging now escalates to a decision (owner's call, 2026-09-04).** `stale_nudged_at` could only express *"nudged, once"* — the scope filtered `whereNull`, so a permanently silent client was reminded about exactly one time and the enquiry then sat in the funnel forever as neither won nor lost | `stale_nudge_count` counts attempts and `stale_nudge_attempts` (default **2**) bounds them. Every step needs the window to elapse **again**, so at the default 7-day window: **day 7** nudge 1, **day 14** nudge 2, **day 21** closed automatically with `delay_in_response`. The client gets the full window to answer the *last* reminder. `stale_nudge_attempts = 0` disables auto-closing and keeps nudging forever. Both resolve **branch → company → config** like every other policy |
| 60 | 🔴 **`lost_automatically` exists so a machine's guess never passes as a human's diagnosis.** "We replied too slowly" is a commercial finding; "nobody ever came back" is an administrative one. A loss-reason report that cannot separate them tells the business to fix the wrong thing | The drawer words an auto-close as a **claim, not a verdict** — *"Closed automatically — the client never answered our reminders. If that is wrong, reopen it."* Reopening clears the flag, the reason, the timestamp **and the nudge count**, so a revived enquiry gets the whole sequence over rather than being closed again after one more reminder |
| 61 | 🔴 **`EnquiryObserver::saving()` had never executed either.** It cleared the nudge debounce when `isDirty('updated_at') && isDirty('status')` — but Laravel stamps timestamps in `performUpdate()`, **after** the `saving` event fires, so `updated_at` is never dirty at that point. The documented behaviour *"cleared on any new client reply"* was false for every enquiry that ever existed | Moved into `updating()` and keyed on the status alone, excluding terminal statuses so closing an enquiry does not erase the record of how many reminders it took. **This is the second dead branch in the same 40-line observer** (#58 was the first) — both were dead for the same category of reason: a condition that was never true, in a class with no tests |
| 62 | 🔴 **A client REPLY did not reset the stale clock — and could not.** `MessageIngestor` only ever wrote to `email_threads`; an enquiry's own row never moved when the client wrote back. Harmless while the sweep merely nudged. **Catastrophic the moment it started closing enquiries** — the clock ran against conversations that were actively being answered, so the auto-close would have declared a live client dead | `touchThread()` now restarts the clock on the enquiry for **inbound** messages only, and only while the enquiry is still open (a reply on a converted enquiry is ordinary shipment traffic; one on a lost enquiry is the desk's call to reopen). Written raw rather than through the model so no observer reads an inbound mail as a lifecycle event |

⚠️ **`enquiries:nudge-stale` had NO tests at all**, which is exactly why #61 survived in it.
A scheduler's failure mode is silence: nothing ever reported that a branch was dead.
`StaleEnquiryNudgeTest` now walks the ladder **day by day** (6, 7, 8, 14, 20, 21) rather
than asserting one end state — the day-8 assertion is what proves attempts are a window
apart rather than consecutive runs.

⚠️ **Existing stale enquiries are not closed on deploy day.** Every current row has
`stale_nudge_count = 0`, so the 40 long-silent enquiries in the data start at nudge 1 and
reach auto-close three windows later. That is deliberate: a migration that mass-closed real
enquiries would be indistinguishable from data loss to the desk that owns them.

---

## 🔴 Found 2026-09-04 — the Kanban's owner filter, and what "arrived" would mean

| # | Finding | Detail |
|---|---|---|
| 66 | 🟢 **The board is now owner-scoped (owner's decision, 2026-09-04).** Each person sees only the shipments they own — `pricing_id` for pricing, `ops_id` for operations — with the **unassigned pool shared**, since unclaimed work belongs to whoever takes it | Enforced **server-side** in `JobController::index()`, not in the board's filter: `?ops_id=` used to be honoured and handed any authenticated user a colleague's entire book. The operator selector was **removed**, not hidden — a picker whose options all return the same rows is worse than none. ⚠️ Applies to the whole `/api/jobs` endpoint, so the inbox drawer's cost sheet follows the same rule: a colleague's converted enquiry now reads as unconverted to anyone who does not own it |
| 67 | 🔴 **The first version of that scope failed CLOSED and silently blinded `accounts`.** `accounts` invoices every shipment and is never assigned one, so "jobs they own" is always zero rows — five portal-scoping tests caught it | Only roles that **appear in an ownership column** are scoped (`pricing`, `operations`); everything else is unscoped, still inside its own branch and mode via `BindPortalScope`. The choice is between two bad defaults, and an invisible empty page is far harder to diagnose than a visible extra row. 🔴 **A new role that owns jobs must be added to `OWNERSHIP_COLUMN` — nothing else will catch it** |
| 68 | ⚠️ **The Staff matrix now mixes two scopes, deliberately.** The OLI badges come from `/jobs/staff-load` and remain the operator's **true branch-wide load**; the cells below are the caller's **own** jobs | So the columns will not sum to the badges. That asymmetry is the useful one for balancing — *"how loaded is this person really, and how much of that is mine"* — but it is not self-evident from the screen, and is worth a label if pricing find it confusing |
| 63 | 🔴 **"Mine" returned an EMPTY BOARD for pricing staff.** A job carries two owners — `pricing_id` quoted it, `ops_id` is executing it — and `mine=1` filtered both roles on `ops_id`. Pricing owns every job on the board as `pricing_id` and typically **none** as `ops_id` | Measured on the demo branch before the fix: `GET /api/jobs?mine=1` as `demo-pricing` returned **0 of 35**. An empty board reads as *"you have no work"*, which for the person who priced all of it is the opposite of true. Now keyed on the caller's own designation. ⚠️ **Superseded by #66** — the board is now per-staff by default and the toggle is gone |
| 64 | ⚠️ **The Completed column grows without bound.** Every shipment a branch ever runs ends in it — 31 of 35 on the demo branch already | Capped at **12 visible**, newest first, with the true total still in the header and a *"N older completed — show all"* disclosure. 🔴 **A display cap, never a delete**: a completed job is the record of a shipment that happened. The cap is applied to the array `draggable` binds, not just the one rendered, or a drop would land at the wrong index once anything was hidden |
| 65 | 🔴 **There is no "arrived" in the system.** `JobStatus` ends at `Completed`; there is no arrival status, no arrival timestamp, and no flight-tracking integration. `planned_clearance_date` is customs planning, not arrival | So *"notify when the shipment has arrived"* cannot be built as asked without first deciding **where the arrival fact comes from**: (a) an operator marking it, (b) treating the `Completed` transition as arrival, or (c) an airline/flight status feed, which is an integration nobody has scoped. **Owner's decision — see the design table.** The mail half is additionally blocked on the same connected-mailbox + consent path as #47 |

⚠️ **Automated client mail must stay human-confirmed.** Whatever supplies the arrival
signal, the notification should offer a *prefilled draft the operator sends*, not an
autonomous send. An arrival signal that is wrong — a mis-set status, a bad feed — becomes
a wrong message to the customer, and that is not a mistake the desk can take back.

---

## 🔴 Found 2026-09-04 — the claim was dropped at confirmation

| # | Finding | Detail |
|---|---|---|
| 69 | 🔴 **Confirming a shipment discarded the person who claimed it.** Work is claimed on the THREAD in the inbox (`email_threads.assigned_ops_id`, atomic, 409 on the loser), but `EnquiryController::convert()` set only `pricing_id` — never `ops_id`. So the operator who claimed the conversation and then confirmed the shipment was dropped from **their own job**, which landed in the unassigned pool for anyone to re-take | Proven in live data before the fix: thread claimed by user 53, resulting job `ops_id = NULL`. **This is why job numbers appear in the unassigned pool** — every confirmed shipment went there. PRD §1039 says *"the system assigns the first staff member who replies to the thread"* and nothing says that expires at conversion. Fixed; an explicit `ops_id` in the request still wins over the inherited claim |

### 🟢 The identifier ladder (owner's description, 2026-09-04)

    claimed in the inbox        →  ENQA-…   enquiry_no
    confirmed in the workspace  →  JOBA-…   execution_job_no
    waybill raised              →  176-…    awb_number, and air_way_bills.job_id back

Each rung had its own test; nothing asserted they were ONE chain, which is the property
an operator actually relies on and the one that breaks silently because every individual
step still passes. `InboxTriageTest::test_the_identifiers_form_one_chain_from_enquiry_to_waybill`
now walks all four links, ending on the document half pointing back at the operational half.

The Kanban card shows all three rungs it has earned. ⚠️ The enquiry number matters on the
card specifically because it is the one an operator can quote to a client who has never
been told a job number.

### 🔴 #70 — the seeder was reproducing the bug #69 had just fixed

Asked why the pool still showed job numbers, the demo data gave three different answers:

| Job | Thread | Claimed in inbox | Job owner | Verdict |
|---|---|---|---|---|
| `…-0544` | 587 | — | — | ✅ reachable: confirmed from a thread nobody claimed |
| `…-0010` | none | — | — | ✅ fine: a job with no conversation behind it |
| `…-0009` | 555 | **user 53** | **NULL** | 🔴 **impossible after #69** |

The third is the state `EnquiryController::convert()` can no longer produce, sitting in the
demo data as though it were normal. Cause: threads are seeded **after** jobs and pick their
enquiry independently, so an `$assigned` flag written up in the fixture table could land a
CLAIMED thread on an UNASSIGNED job. The two were never correlated.

⚠️ **Seed data that contradicts the code teaches the wrong thing about the product and
hides the fix** — this is why the owner could still see job numbers in the pool after #69
was fixed and pushed. The thread's claim is now read back off the job, so the two halves
cannot disagree. Verified: **0 contradictions** across the whole database, and the two
remaining pool cards are both legitimately unclaimed.

### 🟢 DECIDED 2026-09-04 — the pool holds ENQUIRIES (reading 1)

The owner's model, which §943 already described:

    new mail → regex classifies → customer enquiry, unclaimed  ← THE POOL
    claim in the inbox      = PRICING has taken the enquiry over. Still enquiry phase.
    confirm in the workspace = job number, and the moment an operator + clearance
                               date are chosen from a dropdown showing each
                               operator's OLI and their load on that date
    AWB entered in workspace = the third rung

Built: `/api/enquiries?unclaimed=1` (open, no job, thread unclaimed) feeds the board's
pool, which now shows `enquiry_no` and a **Take this enquiry** button. 🔴 That button posts
to the **inbox's own** `/inbox/threads/{id}/claim` — one claim, one column, written from
two screens, rather than a second mechanism to keep in step. `enquiries.ops_id` stays
unused; the thread is the single home for "who has this".

🔴 **This corrected #69, which I had got backwards.** That fix routed the inbox claim into
`jobs.ops_id`. The claimer is PRICING, so it belongs in `pricing_id` — `ops_id` is a
separate decision taken at confirmation, and NULL is a real answer there.

### ⚠️ superseded — the PRD contradiction that led to the above

Two statements, three paragraphs apart, in the **State 1 (pre-conversion)** section:

- **§943 / §1033** — promotion to `customer_enquiry` *"mints the mode-scoped `enquiry_no` … and **drops a card into the unassigned pool**"*. At that moment **no job exists**, so the pool card can only be an **enquiry**.
- **§1041** — *"Atomic claim: `UPDATE **jobs** SET ops_id = ? WHERE id = ? AND ops_id IS NULL`"*. A `jobs` row does not exist until State 2.

Both cannot be true. The schema supports either: **`enquiries.ops_id` EXISTS, is indexed, is fillable, and has an `opsUser()` relation — and nothing in the codebase ever writes it.** An unused indexed column is usually a design that was specified and then half-built.

Three readings, and this decides what a pool card shows:

1. **Pool = unclaimed enquiries** (matches §943, and the owner's stated model: *claim → open workspace → confirm*). Cards show `enquiry_no`. Makes `enquiries.ops_id` live, and makes the Kanban pool a **duplicate of the inbox's own unassigned filter**, which already claims threads atomically.
2. **Pool = confirmed shipments nobody owns** (matches §1041, and the code today). Cards show `execution_job_no`. With #69 fixed this is now a rare state — a confirmation made from a thread nobody had claimed — rather than every shipment.
3. **Both, as two tabs.** Honest to the workflow, most work.

⚠️ Reading 1 makes `email_threads.assigned_ops_id` and `enquiries.ops_id` **two names for one fact**, which will drift unless one is derived from the other.

---

## 🔴 Found 2026-09-04 — the rail showed the wrong portal's pages and hid the right ones

Reported as *"I'm seeing Master Bill of Lading in FocusAir, and the enquiries, inbox and
clients pages have been removed."* **Nothing had been removed** — `NAV_ITEMS` still lists
all three. Two separate faults combined to produce that exact screen.

| # | Finding | Detail |
|---|---|---|
| 71 | 🔴 **The portal filter failed OPEN.** `if (item.portals && portalKey && …)` — when `portalKey` was falsy the check was **skipped entirely**, so every portal's items rendered at once and FocusSea's *Master Bill of Lading* and *Consolidation* appeared on FocusAir | Now `if (item.portals && item.portals.indexOf(portalKey) === -1)`. An item that names the portals it belongs to must never appear on a portal we cannot identify. One removed condition; the same fail-closed rule `Portal::isTenantBound()` already applies server-side |
| 72 | 🔴 **`designation`, `tier` and `portal` reached the browser ONLY on the login response.** Lose the `f16s_context` localStorage entry — cleared storage, a different browser, a token restored without it — and `designation` is null, so **every role-scoped item is filtered out**: Inbox, Kanban, Enquiries, Clients & Partners all vanish | And nothing tells the user, because from the server's side nothing is wrong: the token is valid and every endpoint still enforces its own gates. `context.module.js` had promised *"before /me returns"* since it was written; **`/me` had never been built.** Now it is, and `AppShell` dispatches `LOAD_CONTEXT` on create — only when the context is missing, so the normal path is untouched |

⚠️ **The two faults together are why the report looked like deleted pages.** #72 emptied
the rail of everything role-scoped; #71 filled the gap with another portal's forms. Either
alone would have been easier to recognise.

⚠️ **This class of bug is invisible to the backend.** The tests for it are therefore in
`tests/js/navigationRail.spec.js` — including one that asserts the *collapsed* rail a
context-less session produces, so the failure mode itself stays described.

---

## 🔴 Found 2026-09-04 — a clearance date arriving a day early

| # | Finding | Detail |
|---|---|---|
| 73 | 🔴 **`planned_clearance_date` was cast `'date'`, which serialises in UTC.** The cast builds a Carbon at midnight in the APP timezone (Asia/Kolkata), so a clearance date of **5 Sep left the API as `2026-09-04T18:30:00Z`** | Any reader west of IST renders that as **the 4th**, and the board's own `slice(0, 10)` bucketed it under the wrong day in the staff matrix. **A clearance date silently a day early is a missed flight.** Now `'date:Y-m-d'` — a calendar date has no time and no timezone, and is transmitted as one. Caught by a test asserting the value the API returns rather than the value the database holds |
| 74 | 🟢 **Confirmation now assigns the operator.** `/jobs/staff-load?date=` adds `on_date` per operator | ⚠️ **OLI alone could not answer the question being asked.** It is a whole-book number weighting every open job by complexity and urgency — an operator can sit well under their cap while already having four shipments clearing on the exact day you are adding a fifth to. `on_date` is that second question asked plainly, and the dropdown shows both |

---

## 🔴 Found 2026-09-04 — a tab that only ever refused, and CC being captured nowhere

| # | Finding | Detail |
|---|---|---|
| 75 | 🔴 **Operations was shown a Cost sheet tab that always answered 403.** `viewCostSheet` is `['pricing','accounts','boss']` — *"operations never touches money"* (PRD §2.3.4) — but `workspaceTabs` gated only on classification | Contradicted this codebase's own doctrine, stated at the top of `navigation.js`: *"role forbids → HIDDEN. A disabled control just invites 'why can't I?' tickets."* Now mirrors the server list, written as an **allowlist** so an unknown designation loses the tab rather than gaining it. Extraction stays — working the waybill is why operations can open the workspace at all |
| 76 | 🟢 **Shared inbox CONFIRMED by the owner (2026-09-04).** `viewInbox` is `['pricing','operations']` and the thread list is deliberately **not** owner-scoped, unlike the Kanban | So a colleague's thread stays reachable for cover. ⚠️ Note the asymmetry this creates: operations can *read* any thread but the Kanban shows them only their own jobs. That is intentional, not a bug |
| 77 | 🔴 **CC is captured NOWHERE — three layers deep.** `GraphMailProvider`'s `$select` asks for `toRecipients` and **not `ccRecipients`**; `NormalisedMessage` has no `cc` field; `email_messages` has no `cc` column | ⚠️ **The owner's stated rule — "anyone in CC should see the mail" — is already satisfied**, because a shared branch inbox shows everyone every thread. Nothing needs building for it *today*. But CC is a hard prerequisite for **#47** (*"start a new mail with the same people in CC"*), which cannot be built until all three layers carry it |
| 78 | ⚠️ **`email_messages.to` is `varchar(255)` holding a comma-joined list.** A freight thread routinely carries the client, two of their staff, the airline and two internal addresses | Six addresses at ~30 characters each is already at the limit, and the column silently truncates or errors depending on the connection's strict mode. Whoever adds `cc` should move both to `text` (or a JSON column) in the same migration rather than repeat the constraint |

---

## 🔴 Found 2026-09-04 — mail retention is specified, scaffolded, and not implemented

The owner asked whether mail is kept for **one year**, and whether clients wanting older
mail are **sent to Outlook**. PRD §9.3 says neither, and the code does neither yet.

🟢 **90 days CONFIRMED by the owner, 2026-09-04** — the PRD's figure stands; it was the
"one year" assumption that was wrong, not the policy. Still unimplemented; the table below
is the gap between the settled policy and the code.

| | PRD §9.3 says | Code does today |
|---|---|---|
| Message **snippets** | inline **forever** | kept (nothing deletes them) |
| Message **bodies** | cached **90 days**, then re-fetched on demand | 🔴 kept forever — nothing evicts |
| **Attachments** | cached **90 days from last access** | 🔴 kept forever — nothing evicts |
| `job_documents` | 12 months hot → Glacier, **5 years** (customs statute) | 🔴 no lifecycle at all |
| Old mail | 🔴 **"Re-fetch, don't redirect"** | no re-fetch path exists |

| # | Finding | Detail |
|---|---|---|
| 79 | 🔴 **The retention schema exists and nothing drives it.** `email_attachments` carries `cache_expires_at`, `provider_attachment_id` and `fetch_state` — the exact columns the policy needs — but **nothing in `app/` ever writes `cache_expires_at`**, no eviction command exists (the scheduler runs four commands, none of them this), and nothing reads `fetch_state` to re-fetch | So storage grows without bound. PRD's own costing puts the difference at a **steady ~220 GB versus ~900 GB/year and climbing** |
| 80 | 🔴 **The PRD argues explicitly AGAINST redirecting to Outlook**, which is worth surfacing because it is the natural assumption | Its three reasons: a deep link only works if that person is signed into that mailbox in that browser — *"a consignee, broker or colleague never is"*; it sends the user out of the portal, contradicting why the mail workspace exists; and re-fetch is one API call, ~5 quota units, under a second. ⚠️ **Core-tier tenants have no mailbox connection at all**, so for them there is no Outlook to redirect to |
| 81 | ⚠️ **Generated documents must never be evicted on the same schedule.** An AWB, HBL, Delivery Order or customs manifest **was never in anyone's mailbox** — we produced it | Mailbox-origin files are a cache in front of a durable store we do not own; generated documents are the **only** copy of a record Indian customs statute requires for five years. Any eviction job must split on provenance, or it destroys legal records |

⚠️ **Graceful degradation is mandatory when this is built.** Re-fetch fails when the mailbox
is disconnected, the staff member has left, or the client deleted the message. The row is
never deleted, so filename, size, sender and date stay visible with *"Original no longer
available in the connected mailbox"* — the metadata is evidence the document existed even
when the bytes are gone. A 404 is not acceptable.

---

## 🟢 Built 2026-09-04 — the inbox reads and sends like a mail client

Owner: *"capture and behave"*. Both halves.

| # | Finding | Detail |
|---|---|---|
| 82 | 🔴 **`provider_message_id` was captured and thrown away.** `GraphMailProvider` has always read `$raw['id']` into `NormalisedMessage::providerId`; the ingestor dropped it because no column existed | `message_id` (RFC 5322) *identifies* a message but is not *addressable* — Graph cannot be asked to reply to it. Without the provider's own id every reply had to be a NEW message, which lands in the client's Outlook as a separate conversation and reads to them as though we lost the thread. Column added, value persisted, and `/me/messages/{id}/reply` now threads properly (Graph sets `In-Reply-To` and `References` itself, so we never hand-build them) |
| 83 | 🔴 **Sending writes NO local `email_messages` row**, and that is deliberate | The sent mail returns on the next delta as an echo and upserts on its unique `message_id`. A row written at send time becomes a duplicate the moment that echo lands — and worse, shows the operator a message that may never have left. Pinned by a test that counts rows before and after |
| 84 | 🔴 **Reply-all must strip TWO of our addresses, not one.** The shared mailbox is on every message by definition, and the signed-in person may be on it too | Leaving either in copies the desk on its own reply, on every thread, forever. `mailbox_address` is now returned on the thread for exactly this. ⚠️ **Forward deliberately starts with EMPTY recipients** — it goes to someone not yet on the conversation, and pre-filling it with the current list is how a confidential rate reaches the wrong party |
| 85 | 🔴 **The demo seeder addressed inbound mail to a USER, not to the mailbox** — and so hid #84 completely | Reply-all looked correct while silently copying `demo-pricing@demo.test`, because the strip had nothing to match. A branch desk works a **shared inbox**; that is the address a client writes to. Fixed, and the seeder now puts a broker in CC so Reply All is meaningfully different from Reply on the demo data. **Second time this session that seed data contradicting reality hid a real defect** (see #70) |
| 86 | ⚠️ **The seeder's mailbox provider was `gmail`, which `MailProviderRegistry` refuses outright** (GAPS #15, deferred behind Google CASA) | Harmless while nothing called the provider; an instant failure the moment replying did. Both the seeder and `InboxTriageTest` now use `outlook`. A fixture on an unbuilt provider is a test that passes for the wrong reason |

⚠️ **Reply / Reply all / Forward are ONE endpoint.** They differ only in the recipient list
the caller sends, and that list is the operator's decision — validated server-side, never
recomputed from a "mode" flag. In every real mail client those buttons are an editable
starting point, not a command: an operator routinely drops the airline from a commercial
reply, and a server that recomputed the list would silently put them back.

⚠️ **Still not built:** attachments in the composer, drafts, read/unread as a user action,
and BCC in the UI (the column exists and is populated only on outbound).

---

## 🔴 Found 2026-09-05 — the seeder had AWBs on exactly the wrong shipments

| # | Finding | Detail |
|---|---|---|
| 87 | 🔴 **Every Completed job had NO `awb_number`, and the only three that did were at Intake.** Precisely backwards | The funnel block that seeds historical shipments never set one. A completed air shipment without a waybill is not a state that can exist — **the waybill is what flew** — and the board therefore made the AWB look like an early-stage field. Fixed; all 31 completed shipments now carry one, in a separate number band from the operational jobs. **Third time this session that seed data contradicting reality hid something** (see #70, #85) |
| 88 | 🟢 **The AWB now leads on every board card.** All four columns hold `jobs`, which exist only after confirmation, so every card there is one converted shipment — the AWB is the number the operator quotes to the airline, the client and the manifest | The enquiry number stays as a quieter second line: it is what a client who has never been told a job number still recognises. ⚠️ A confirmed shipment whose waybill is not yet raised says **"AWB not raised"** rather than showing a gap, which would read as a rendering fault. The pool is untouched — those are enquiries, pre-conversion |
| 89 | 🟢 **Completion raises a NOTIFICATION, never a mail.** Pinned at approval priority, carrying the AWB, the thread and the client address | 🔴 *"Completed"* is a status a person set. A status set by mistake would otherwise become a wrong message to a customer, and that is not something the desk can take back — so the bell card shows the **drafted text**, editable, and the button approves that specific message rather than an action in the abstract. It sends on the conversation the shipment came from, so the client's reply lands on the same thread. ⚠️ Suppressed entirely for a completed air job with **no AWB**: that is a data problem, and announcing it would turn a data problem into a conversation with a client |
| 90 | ⚠️ **The bell's pinned section assumed every pinned row was a handover request.** Anything at `PRIORITY_APPROVAL` rendered as *"Handover requested on …"* with Accept/Reject | So a completed shipment announced itself as somebody else's reassignment. Now branched on type. A shared priority is not a shared meaning |

---

## 🔴 2026-09-07 — the classification learning loop, measured and clearable

Owner's framing: *"see how many times our regex failed based on how many times the client
saw the first mail and determined it is actually something else and selects from the
dropdown … then we improve our regex and delete this history."*

| # | Finding | Detail |
|---|---|---|
| 91 | 🔴 **An override recorded that the regex was wrong, but not what it was wrong ABOUT.** `email_classification_overrides` stored the subject, the domain and both classifications — no body text | *"Airline mail, corrected to customer enquiry, subject 'Re: booking'"* cannot be turned into a pattern: the words that should have matched are in the body. `email_snippet` added. ⚠️ **Snippet only, never the full body** — the same ~500 characters the classifier itself reads, so the corpus contains nothing the matcher did not already see and does not become a second copy of client correspondence outside the 90-day body policy (owner's choice) |
| 92 | 🔴 **The only reporting was a 5,000-row CSV export**, which answers *"what was this one correction"* and cannot be read as an answer to *"is the regex getting better"* | `GET /api/admin/classification-failures` groups by the correction made, lists **domains corrected twice or more** (a repeat domain is a `sender_domain_match` rule waiting to be written — the cheapest and most reliable rule type), and returns worked examples with their snippets. ⚠️ Grouped by correction, **not by rule**: `matched_rule_id` is NULL on nearly every row (#51), so grouping by rule would report everything as unattributed |
| 93 | 🟢 **`DELETE /api/admin/classification-overrides` clears the LEARNING RECORD only** | No mail, thread or enquiry is touched — asserted in the test by counting `email_messages` and `email_threads` either side. Corrections are a working set: once the rules change they measure a classifier that no longer exists, and keeping them makes the next review report failures already fixed. `REVIEW_THRESHOLD = 150` — a starting point inside the owner's "100–200", surfaced as `ready` so nobody has to decide what "enough" means each time |
| 94 | 🔴 **Re-classification was pricing's alone; it is now pricing, operations and sales.** The people who READ the mail are the ones who can see the classifier got it wrong | ⚠️ Granted through a **new `classifyThread` ability, NOT by widening `triage`** — `triage` also gates customer onboarding and partner creation, and letting three more roles create customer records as a side effect of fixing a dropdown is a permission leak nobody notices until it matters. A test asserts operations still gets **403** on `POST /customers` |

⚠️ **Sales cannot use this yet.** `classifyThread` includes sales, but `viewInbox` is
`['pricing','operations']`, so sales gets **403 on the thread list** and never reaches a
dropdown to correct. The grant is inert until sales is added to the inbox — which is a
product decision (sales seeing all client mail), not an oversight to patch.

---

## 🔴 2026-09-07 — the classifier had never once run

| # | Finding | Detail |
|---|---|---|
| 95 | 🔴 **`RegexClassificationService::classify()` was called by NOTHING.** The service was injected into `EmailInboxController`, which used only `recordOverride()`. The fallback chain, the rule matching and the cargo patterns all existed and none of it ever executed — **every thread arrived `unclassified` and stayed that way** until a human picked from the dropdown | A classifier nobody invokes is a constant wearing the shape of a decision. Now run at ingestion. ⚠️ An existing test **asserted** `unclassified` after sync and so locked the absence in: it read *"does not mint"* as *"does not classify"*. **PRD §528 is literally `Inbound mail → Classify & stage`**, and §5.2.5 says the parser *"pre-selects that classification"* while *"no enquiry_no is consumed … until an operator confirms"*. Minting is what would corrupt the conversion denominator; staging a suggestion costs nothing |
| 96 | 🔴 **The chain had no fallback that works without configuration.** `email_classification_rules` is **empty on every tenant** (#48) and stays empty until somebody writes rules, so `firstMatchingRule` matched nothing and everything fell to the default | Added, in order of specificity: tenant rules → **a domain already onboarded as a customer** → the platform directory → `customer_enquiry`. The owner's point: a domain we already invoice writing back is, on the balance of evidence, an enquiry. ⚠️ `globalClassificationFor()` was ALSO dead — written, documented, never called — so the platform half of the chain was missing too |
| 97 | ⚠️ **Free mail is excluded from the known-client rule**, and the guard is only observable against a domain the directory already classifies | Where the directory says nothing the chain ends at `customer_enquiry` anyway, so a test on a bare gmail address would pass whether the guard existed or not. The test uses a curated airline domain, where the two paths disagree — otherwise it would prove nothing |
| 98 | 🟢 **`$transportMode` was a dead parameter** on `firstMatchingRule` — passed, never read | Classification does not depend on the mode; only the sea-only CBM pattern does. It is now nullable, because at ingestion the mode is genuinely unknown: a branch runs air and sea from one mailbox and neither `mailbox_connections` nor `agents_info` carries a mode. Passing a guessed `'air'` would be inventing a fact to satisfy a signature |

⚠️ **Still not staged: the cargo variables.** PRD §5.2.5 also says the parser *"parks the
extracted cargo variables on the `email_threads` row"*. `extractCargo` runs and its result
is discarded, because the mode it needs for CBM is unknown at ingestion and `email_threads`
has no columns to park it in. Origin/destination are not extracted at all — see below.

---

## 🟢 2026-09-07 — lanes, read from the mail without an API call

| # | Finding | Detail |
|---|---|---|
| 99 | 🟢 **Origin and destination are now extracted from mail text**, resolved to IATA through `locations` | The 8,383-entry `AIRPORT_IATA_MAP` lives in `python/extract_awb_new.py`. `python/export_locations.py` emits it as JSON (parsed with `ast`, **never imported** — importing pulls the whole OCR dependency tree in to read one dict) and `LocationSeeder` loads it. 🔴 **PHP then resolves with SQL and never calls the Python service.** An HTTP round trip per inbound mail would be slow and would put the OCR server in the mail pipeline's critical path — the owner's point, and the right one |
| 100 | 🔴 **A three-letter token is only a code if `locations` agrees.** A bare `\b[A-Z]{3}\b` matcher reads "TO", "AND" and "THE" as airports and invents routes out of ordinary prose | The stopword list is taken from the extractor's own `LABEL_WORDS`, where each entry was added because it actually misfired. ⚠️ Deliberately **not** extended with every English three-letter word: BAY, RED, ONE and SUN are all real airports, so guessing would cost more than it saved. A separator is required too — two unrelated codes in a sentence are not a lane |
| 101 | 🔴 **Both ends resolve or neither is staged.** A half-lane on a card looks like a whole one — the operator sees an origin, assumes the destination was simply not given, and never checks | The rest of the extraction still stands; only the lane is withheld |
| 102 | 🟢 **`email_threads.staged_cargo`** — PRD §5.2.5 says the parser *"parks the extracted cargo variables on the `email_threads` row"*, and there was nowhere to park them: `extractCargo()` ran and its result was discarded on every message | ⚠️ **One JSON column, not five typed ones.** This is a suggestion carrying a confidence per field, written by a regex, read once when the operator opens the thread and superseded when they confirm. Typed columns would invite reports against numbers nobody has checked; the confirmed values already live on `enquiries`. NULL where nothing was found — `{}` would claim we looked and found none, a different statement from having nothing to say |

⚠️ **Confidence is `low` on every extracted lane.** It is one line of prose read by a regex,
not a field off a document, and the workspace must ask before it is trusted.

---

## 🔴 2026-09-07 — staged cargo on screen, and a lane that cannot be written

| # | Finding | Detail |
|---|---|---|
| 103 | 🟢 **The workspace shows what the parser read** — "What the mail said", one row per field, `check` beside anything low-confidence (§1.3: the word carries it, never colour alone) | Without it the classifier's work was done and discarded, and the operator retyped figures the system already had |
| 104 | 🔴 **Inserting that section between a `v-if` and its `v-else-if` silently rebound the chain.** `<section v-else-if="tab === 'cost'">` attached to the NEW condition, so **Extraction and Cost only rendered when staged cargo was absent** | `vue-template-compiler` reported `tpl: ok` and emitted no tip — the template is valid, it just means something else. Caught only by opening the drawer and finding the tabs gone. ⚠️ Anything inserted into a Vue conditional chain has to go **before or after the whole chain**, never between two of its members |
| 105 | 🔴 **The extracted lane CANNOT be written to the enquiry.** `extractLane` yields 3-letter IATA (`BOM`); `enquiries.origin_code` is `char(5)` validated `size:5`, and every existing air enquiry holds **UN/LOCODE** (`INBOM`, `DEHAM`) | So the panel is **read-only**, deliberately. Two things are missing before an operator can commit it: (a) there is **no enquiry-update endpoint** at all — only index, store, lost, reopen, convert; (b) the code standard has to be decided. `ports` (LOCODE) exists and is **empty**, and the Python map is IATA-only, so there is no LOCODE source in the project. **Owner's call — see below** |

### 🟢 DECIDED 2026-09-08 — IATA everywhere, demo data included

Option 1 taken: `origin_code`/`dest_code` accept **3–5 characters** and the demo data now
carries IATA (`BOM`, `FRA`) instead of LOCODE (`INBOM`, `DEFRA`). The parsed lane is
therefore writable to an enquiry — `size:5` had rejected every IATA code, which is what an
air waybill carries and what the extractor's map resolves to.

🔴 **CORRECTED 2026-09-08 — each mode keeps its own standard: air is IATA, sea is LOCODE.**
My first pass put IATA on sea lanes too, reasoning that one standard beats two. That was
wrong: **a port has no IATA code.** Nhava Sheva and Jebel Ali are not airports, and forcing
them into a 3-letter airport code invents an identifier that does not exist. `origin_code`
accepting 3–5 characters is what lets both standards share the column.

Verified after reseeding: **air 219 rows all 3-character, sea 45 rows all 5-character**, no
mixing in either direction.

⚠️ Four rows on branch 32 (`ENQA-UIXBOM-*`, created 2026-08-28) held LOCODE and **no seeder
produces them** — leftovers from an early UI session. Converted by hand; a reseed will not
restore them, and nothing else references them.

### ⚠️ superseded — the original IATA-or-LOCODE question

- **Air waybills** use IATA 3 (`departure_airport = 'BOM'`), which is what the AWB needs.
- **Enquiries** use LOCODE 5 (`origin_code = 'INBOM'`) for air *and* sea in all existing data.

Three ways out: relax `origin_code` to 3–5 characters and store IATA for air; source LOCODE
reference data and resolve to that; or keep the staged lane display-only and let the
operator pick from a list. 🔴 **Showing a value the operator cannot commit is honest;
adding a button that silently truncates `INBOM` to fit would not be.**

---

## 🟢 2026-09-08 — the staged cargo can be committed

| # | Finding | Detail |
|---|---|---|
| 106 | 🟢 **`PATCH /enquiries/{id}/cargo`** — the only write path for the figures the mail parser staged. Before it, `staged_cargo` was a suggestion nobody could accept: the classifier read the mail, the workspace showed what it found, and the operator retyped it anyway | Accepts 3–5 character codes, because **air is IATA and sea is LOCODE** — `BOM` and `INNSA` are both correct, for different modes, in one column. Refused once a job exists: the cargo then belongs to the waybill, and rewriting the enquiry behind it leaves the two disagreeing about one shipment with nothing to say which is right |
| 107 | ⚠️ **Only fields actually sent are written.** A key the extraction did not produce is not a value of NULL — it is a figure nobody has an opinion on | Asserted by a test that patches pieces alone and checks a previously-set weight survives |
| 108 | 🔴 **A confirmed figure has NO distinct provenance, and a later OCR promotion will overwrite it.** `cargo_data_source` stays `regex` after an operator confirms, because the PRD's ladder puts tier 3 (operator-verified) in `air_/sea_shipment_details` and treats the enquiry's copy as indicative | So nothing distinguishes *"regex guessed and nobody looked"* from *"regex guessed and a human agreed"*, and `CargoDataPromotionService` promotes over both since `ocr` outranks `regex`. Following the ladder rather than inventing a fourth value — but **the cost is real** and belongs to whoever owns the ladder |
| 109 | ⚠️ **The confirm button is hidden for operations**, mirroring the cost-sheet fix (#75). `updateCargo` is gated on `triage`, which is pricing's | An operations user reading the same mail sees what the parser found and no button, rather than one that answers 403. If cargo confirmation should be theirs too, it wants the `classifyThread` treatment — a separate ability, not a widened `triage` |
| 110 | 🟢 **The Kanban's date filter is gone** (owner's call), with its `Today` shortcut, its two chips and the `from`/`to` query parameters | The server still accepts `from`/`to` on `/api/jobs`; nothing sends them now |

---

## 🔴 2026-09-08 — the Message Log's status codes had no meanings, and no code either

| # | Finding | Detail |
|---|---|---|
| 111 | 🔴 **`config/common-data.php` did not exist**, and `GLNResponseController::store()` has always read it on every Cargo Status message: `config('common-data.cargo_status_description')` returned **NULL**, `?? ''` swallowed it, and every FSU status was stored with `reason = ''` | Nothing failed, nothing logged, no test noticed — for as long as the controller has existed. Created from the carrier's own specification, supplied by the owner: **25 codes**, wording verbatim |
| 112 | 🔴 **The blank reason hid the STATUS CODE as well, not just its description.** `MessageLog.vue` renders the code inside `v-if="status.reason"` — so with an empty reason the whole line was suppressed | A Cargo Status row therefore showed only the literal words *"Cargo Status"* and a timestamp. **RCS, DEP and ARR were never visible anywhere in the product.** The owner asking "what are the stages in the message log" could not have found out by looking |
| 113 | ⚠️ **The key is cut out of the message id, not read from a field.** `substr($business_id, -3)` takes the last three characters of `BusinessHeaderDocument/ram:ID`; the remainder is the AWB | So a map entry whose key is not exactly three upper-case characters can never match and is dead the moment it is typed. `CargoStatusCodeTest` asserts the shape of every key rather than spot-checking one lookup, because a missing file and a wrongly-keyed file fail identically — silently, as an empty description |

**The spine:** `FOH → RCS → PRE → MAN → DEP → ARR → RCF → NFD → AWD → CCD → DLV`, with `DIS`
interrupting at any point.

| # | Open | Detail |
|---|---|---|
| 114 | ⚠️ **Nothing has exercised this end to end.** `status_response` holds **zero rows** — no Cargo Status message has ever been ingested in this environment | So the map is proven by unit test and by replaying the controller's `substr`, not by a real message from the provider. The first live FSU will be the actual proof. ⚠️ Until then, a mismatch between the provider's id format and `substr($business_id, -3)` would still surface as a blank line, exactly as before |
| 115 | ⚠️ **`DDL` and `DPU` are door-to-door events, not airport-to-airport ones** — "Delivered to consignee's door" and "Picked up from shipper's door" | They are in the owner's supplied list so they are in the config, but they sit outside the `FOH → … → DLV` spine. Worth confirming the provider actually emits them: an unused entry costs nothing, but a wrongly-worded one that *does* fire is read by an operator as fact |

---

## 🔴 2026-09-09 — Gemma readiness, measured

Asked whether the quantized Gemma run can be tested now. **No — five things are missing,
all of them Python-side.** Laravel is finished and tested against a contract nothing
implements.

| Piece | State |
|---|---|
| `/extract-unstructured` endpoint | 🔴 **absent** — `python/ocr_server.py` is 93 lines exposing `/health` and `/extract` only |
| **PyMuPDF** (`fitz`) for the text layer | 🔴 **not installed** — `requirements.txt` has pdfplumber, fastapi, uvicorn, python-multipart, nothing else |
| `python/schemas.py` (Pydantic validation) | 🔴 **does not exist** |
| Ollama client + the Gemma model | 🔴 **not in the image.** `Dockerfile.fastapi` says so in its own header: *"Ollama and ChromaDB are NOT in this image"* |
| `google-generativeai` (Gemini vision fallback) | 🔴 **not installed** |

🔴 **The consequence today:** a Tactical or Command tenant uploading an unstructured
document calls an endpoint that **404s**, so `ProcessPdfOcrJob` throws and the job fails
instead of parking for consent. The consent flow cannot be exercised at all, because it
parks on `extraction_path = 'none'` and **nothing can return that value**.

### ⚠️ The first step does not need Gemma

`/extract-unstructured` returning `extraction_path: 'text' | 'none'` is buildable with
**pdfplumber, which is already installed**. That alone:

- stops the 404 and lets `ProcessPdfOcrJob` complete its real path
- makes `awaiting_vision_consent` reachable, so the whole consent + credit flow can finally
  be tested end to end
- leaves Gemma as a swap-in for one job: *text → structured JSON*

🔑 **The endpoint must return the SAME key vocabulary as `/extract`** (guide §4.1) —
`shipper`, `consignee`, `departure`, `destination`, `transit`, `cargo`, `weight_charge`,
`piece_weight`. A second endpoint emitting different keys means `OcrUploadModal.vue` needs
two mappers, and they drift the first time either side changes.

⚠️ **The machine is a real constraint, not a detail.** PRD §9.6 says not to run Gemma on a
laptop — it needs ~6 GB resident, and in production Ollama cohosts with FastAPI on a
dedicated t4g.large over loopback (§9.5). This Mac has been wedging Docker repeatedly on
free disk alone.

---

## 🟢 2026-09-09 — /extract-unstructured, the text path

| # | Finding | Detail |
|---|---|---|
| 117 | 🟢 **`/extract-unstructured` exists.** `python/unstructured.py` reads the page's text layer with **pdfplumber, already installed** — no PyMuPDF, no model, no new dependency | 🔴 The response's real job is `extraction_path`. Nothing in the system could return **`'none'`** before, so `awaiting_vision_consent` was unreachable and the whole consent + credit flow could not be exercised. It can now |
| 118 | 🔴 **`transform_piece_weight()` is POSITIONAL and must not be reused on prose.** It splits the AWB's piece/weight box on whitespace and assigns numbers by their order in a fixed layout | Handed labelled invoice text it read *"480.5 kg / 12 cartons"* as **chargeable weight 480.5, rate 12** — numbers individually plausible and entirely wrong, with nothing about the card looking broken. `_read_piece_weight()` reads by meaning instead and emits the identical keys. ⚠️ `rate_class` is left **blank rather than guessed**: an invoice carries no IATA rate class, and a default would put a value in a legal field nobody wrote |
| 119 | ⚠️ **A scan is not an empty page.** Scanners leave stray characters — a page number, a header stamp — so "any text at all" would classify most scans as text documents and skip the vision path the operator is paying for | `MIN_TEXT_CHARS = 120`, a floor real prose clears and a scan does not. Pinned by a test asserting a bare `"3"` is not a text layer |
| 120 | 🟢 **Fixed — the panel now asks what the file IS.** A per-document **Kind** column: *Airway bill* sends `ksr` (coordinates), *Other document* sends `unstructured` (text layer). Default is **Other**, because that is what the panel is for — its own copy says *"an invoice for the parties, a packing list for the cargo"* | ⚠️ Not the same control as **"Extract into"** above it. That one says where the answer GOES (master or house waybill); this says how the file has to be READ. They were easy to confuse and are now separately labelled |
| 121 | 🔴 **`system_templates` WAS EMPTY, which made the coordinate path unreachable through the router.** `OcrRoutingService::isStructured()` asks `SystemTemplate::where('key', …)`; with no rows the answer was always *no*, so **even an airway bill was routed to the unstructured reader** | The two halves also disagreed on vocabulary: `STRUCTURED_TYPES` accepts `MAWB`/`HAWB`/`AWB`, but `/extract` needs a template NAME from `boxes_config.json` (`ksr`, `ksr_house1`, …). So the only values that reached the coordinate endpoint were the only ones it could not use — `MAWB` routed there and then failed inside FastAPI with "template not found". `SystemTemplateSeeder` registers the six real names |
| 122 | 🔴 **`php artisan db:seed` has been failing on its FIRST line.** `SuperSeeder` is the one seeder declaring `namespace Database\Seeders`; `DatabaseSeeder` is global, so `SuperSeeder::class` resolved to `\SuperSeeder`, which does not exist — **every seeder after it was unreachable** | Fixed by fully qualifying that one reference |
| 123 | 🟢 **All three base seeders are now idempotent** (owner's call). `php artisan db:seed` completes, and running it three times leaves 1 super admin, 1 user, 2 roles, 4 currencies — no duplicates | 🔴 **`updateOrInsert()` was the wrong tool and deliberately not used.** It rewrites the row it finds, so a re-seed would reset a changed admin password back to `123456` and a live currency rate back to NULL. Create-if-absent is the only safe rule: a seeder that can hand an account to a known default is worse than one that errors. Verified by changing the admin password, re-seeding, and confirming it survived |
| 124 | 🔴 **`roles` and `currency_rates` have NO unique key**, so their plain inserts never failed — they **duplicated silently**. `super_admins` and `users` at least errored | Nothing would have noticed a fourth INR row until a quotation converted against whichever one the query happened to pick. No duplicates had accumulated yet, because the loud failure upstream stopped the run before reaching them |
| 125 | 🔴 **`UserSeeder` has been unable to run since tenancy was added**, quite apart from idempotence. It never set `branch_name`, which is NOT NULL with no default | Fixed |
| 126 | 🔴 **The base account was landing inside somebody else's tenant.** Attaching to "whatever branch is first by id" put `user@gmail.com` in **Curl Co** as an operations user, with access to that tenant's shipments | It now gets its own company — **F16s Base / `BASE`** — created on first run and reused thereafter. ⚠️ A shared login sitting inside a demo tenant is fine right up until that demo tenant is a real one |
| 127 | ⚠️ **`users.designation` DEFAULTS TO `operations`**, so a user seeded without one is not role-less — it silently becomes an operations user | The seeder now sets it explicitly. A designation decides which portals open and which controls appear; leaning on a schema default for that means the answer changes if the default ever does, silently and everywhere |

⚠️ **Vision is refused, not faked.** `allow_vision=true` with no text layer returns **501**,
because `google-generativeai` is not installed. Silently returning the empty text result
would spend the operator's credit and hand back nothing on a run they authorised.

---

## 🟢 2026-09-10 — #42 and #55 closed

| # | Finding | Detail |
|---|---|---|
| 42 | 🟢 **`store()` and `update()` wrapped in one transaction each** | They write across **eleven tables in sequence** and had **zero** `DB::transaction`. A section failing validation returned 422 and left every section before it **already saved** — a first box with a shipper and no consignee. 🔴 Worse on retry: the AWB number is the primary key, so the second attempt hit a row that already existed, telling the operator the waybill exists while showing an error saying it was never created |
| 128 | 🔴 **A 422 had to become a THROW, not a return.** Returning out of a closure COMMITS it; only an exception unwinds a transaction | `App\Exceptions\ValidationFailed` carries the section's **original** response rather than rebuilding one — the section already produced the exact payload the client expects, field errors and all. ⚠️ `update()` had the identical defect and was found while fixing `store()`; both are wrapped |
| 129 | ⚠️ **`WayBillConversion` stays OUTSIDE the transaction** | It calls the airline's gateway. Holding row locks across a network round trip is how one slow carrier blocks every other waybill in the branch |
| 55 | 🟢 **Six bare `@if` conditions guarded** | The blade used `optional()` almost everywhere but left `@if ($airWayBill->wayBillAddress->ship_phone)` and five siblings bare — a property read on NULL, fatal in Blade. ⚠️ **The document that died is the one the CLIENT receives**, and raising a waybill before filling the parties is an ordinary order of work. Proven by creating exactly that waybill and rendering through the controller's own loader: **271,811 bytes, no crash** |

⚠️ **A reported "248 failed" was an artifact of running two suites against one database at
once** — the same mistake that produced 183/259/220 earlier. One clean run: **584 passed**.
Anything reporting mass failures in seconds is contention or a dead database, not code.

---

## 🔴 2026-09-10 — Gemma actually ran, and four things only a real model could show

Ollama 0.33.3 built from source (~2h on this CPU), `gemma3:1b` pulled (815 MB), run against
the real pipeline. **Every one of these was invisible to a stub.**

| # | Finding | Detail |
|---|---|---|
| 130 | 🔴 **`keep_alive` as the string `"-1"` fails EVERY call.** Ollama parses it as a duration: `400 time: missing unit in duration "-1"` | The model sat loaded and idle while every request was rejected. It takes a NUMBER of seconds or a unit-bearing string (`"10m"`), never a numeric string. Coerced in `_keep_alive()`. **A stub accepts whatever it is handed — this class of bug cannot be found without a real server** |
| 131 | 🔴 **A `$ref` schema returns a valid, conformant, COMPLETELY EMPTY document.** Pydantic emits `$defs`/`$ref` for nested sub-models, which is the natural Python shape | Same model, same document, same prompt, fields flattened: **every field filled correctly**. A small model can follow a shape it can see and not one it has to dereference. `ExtractedDocument` is flat, and a test asserts `$defs` never returns |
| 132 | 🔴 **"Never invent a value" made it invent MORE.** With that clause: `awb_number: "Not specified"`, `origin: "India"`, `destination: "Germany"` — none in the document. Without it: `destination: "12 cartons / 480.5 kg"`, the cargo line in the wrong field | ⚠️ **The instruction is not the safeguard.** `_grounded()` drops any string not actually present in the source, which catches the invention. It does NOT catch misplacement — "12 cartons" really is on the page — which is why the caller consumes only the fields the model is reliable on, and why everything reaches the operator marked for checking |
| 133 | ⚠️ **The grounding check first rejected every correct address.** A PDF gives an address on three lines; the model returns it on one, joined with a comma the document does not contain | Comparing on whitespace alone fired the safeguard on exactly the values it was meant to protect. Now compared on letters and digits only — still catches an invented company, which shares no run of characters with the page |

### Measured, on this machine

    labelled invoice     2s   read_by=labels          model never called
    unlabelled invoice  17s   read_by=labels+model    shipper, consignee, cargo all correct
    cold load           16s   warm ~7-19s per document

⚠️ **A 1B model is not good enough for production and was never meant to be.** It reads the
parties and the description reliably and then fills the remaining fields with noise —
that is what `_grounded()` and the narrow consumption list are for. It proves the wiring.
E4B on the t4g.large (PRD §9.5) is where quality gets judged.

---

## 🟢 2026-09-10 — PyMuPDF on the text path, measured before switching

| # | Finding | Detail |
|---|---|---|
| 134 | 🟢 **PyMuPDF replaces pdfplumber for the TEXT LAYER only** — the last item on guide §4.1's "genuinely missing" list. Measured on this machine, median of five, identical text every time | `invoice 27.2ms → 2.6ms (10.3x)` · `unlabelled 18.8ms → 2.6ms (7.3x)` · `scan 3.5ms → 1.8ms`. End to end, a labelled invoice went **2.0s → 0.9s**. ⚠️ **pdfplumber stays** — `extract_awb_new.py` uses it to CROP coordinate boxes, a different job it does well |
| 135 | 🔴 **The import is SOFT, and that is not caution for its own sake.** The Docker image carries no PyMuPDF until it is rebuilt, and a hard import would take the whole OCR service down on deploy — **including `/extract`, which does not use this module at all** | A missing dependency would have become an outage of an endpoint it has nothing to do with. Falling back keeps a slower service running. A test asserts the fast path IS active here, so the fallback cannot go unnoticed |
| 136 | ⚠️ **The two readers must return the SAME TEXT, and that is tested** | An image mid-rollout runs the slow path while its neighbours run the fast one. A fallback that extracted different text would make one document parse differently depending on which container answered — the worst kind of intermittent |

⚠️ **The ai-server image needs rebuilding** to pick up `pymupdf` and `pydantic`. Until then
that container runs the pdfplumber fallback and has no model step at all — everything
verified here was run on the host.

---

## 🔴 2026-09-10 — "Choose files" silently ate valid PDFs

| # | Finding | Detail |
|---|---|---|
| 137 | 🔴 **`add()` filtered on `f.type === "application/pdf"` alone, and the browser does not always set it.** A PDF picked from certain locations, or dragged out of certain applications, arrives with `type: ""` | It was dropped with **no row, no error and no explanation** — which is exactly what "the choose file button is not working" looked like from the outside. The extension is now the fallback; a file that declares `application/pdf` is still taken at its word. ⚠️ The click chain was fine all along — verified reaching the input with `defaultPrevented: false` — so the obvious suspect was innocent |
| 138 | 🔴 **The input was never reset, so the same file could be chosen ONCE.** `change` fires on a change of value; re-picking the identical path leaves the value untouched and no event fires | An operator who removed a document and picked it again got silence, and reasonably concluded the button was broken. `e.target.value = ""` after each pick |
| 139 | ⚠️ **A rejected file is now NAMED.** "2 files ignored" leaves the operator checking which two | The names say immediately whether it mattered |
| 140 | 🔴 **A stale warning was telling operators not to bother.** The panel said *"the unstructured parser is not deployed yet — those rows will read as failed"*, which was true when written and stopped being true when `/extract-unstructured` shipped | **A stale warning is worse than none**: an operator who reads "this will fail" does not try. Rewritten to what is still true — a **scan** cannot be read, because vision is not built and the endpoint answers 501 |

---

## 🔴 2026-09-10 — the file picker: a small target and a double dialog

⚠️ **The reported symptom was "no dialog opens at all, on Chrome."** Instrumented in the
browser: a trusted click on the button reached the input with `defaultPrevented: false` and
fired a **`cancel`** event — which Chrome emits only when a dialog **has opened and been
dismissed**. So the mechanism was sound and the button was not the fault.

| # | Finding | Detail |
|---|---|---|
| 141 | 🔴 **The target was 83×32px inside a zone 30× that size.** A click landing beside it did **nothing at all** — no dialog, no message, nothing to distinguish "you missed" from "this is broken" | The whole zone now opens the picker: **2,656px² → 78,858px²**. Keyboard too (`Enter`/`Space`, `role="button"`, `tabindex="0"`), which the label pattern gave for free and a bare div would have lost |
| 142 | 🔴 **Making the zone clickable opened the dialog TWICE.** The input lives inside the zone, so `input.click()` bubbles back to the zone's own handler and calls it again — measured: one click produced two | The second dialog appears the instant the first is dismissed, which reads as the picker being broken in a new way. Guarded by ignoring the event when it originated from the input itself |
| 143 | ⚠️ **A `<label>` wrapping the input could not stay.** It activates the input natively AND the click bubbles to the zone — two paths, two dialogs | Replaced with a `<button type="button" @click.stop>`. One path in, one dialog |

⚠️ **This may still not be the owner's cause.** The mechanism demonstrably works in this
browser; what changed is that the target is now hard to miss and every route through it
fires exactly once. If a click squarely on **Choose files** still opens nothing in their
Chrome, the next suspects are an extension or a profile setting, not this code.

---

## 🔴 2026-09-10 — a warning that fired when it was not true

| # | Finding | Detail |
|---|---|---|
| 144 | 🔴 **The scan warning fired on STAGING, for every document that was not an airway bill** — before anything had been read, when nobody knew whether it was a scan | So a text PDF, the common case and the one that works, was greeted with a notice saying it might not. ⚠️ **A warning that fires when it is not true teaches operators to ignore it for the times it is.** Removed |
| 145 | 🔴 **`awaiting_vision_consent` was not handled in the panel's poll at all.** The loop looked only for `completed`, `failed` and `cancelled` | A scan therefore **polled forever** — the one document the warning was about was also the one the UI could not finish. That state is now handled, and it is the moment a scan is *known* to be a scan: the parser found no text layer and said so |
| 146 | ⚠️ **The message is now per-document and specific** — *"no selectable text — this is a scan, and vision extraction is not deployed yet"* — attached to the file it is true of | It reaches the operator as the outcome of reading that file, not as a caveat about all files. When vision ships this becomes a consent prompt rather than a failure, and nothing else in the panel changes |

⚠️ **This is the third stale-or-premature warning in this panel.** First it said the
unstructured parser was undeployed (true, then not). Then it warned about scans on every
document. The pattern to avoid: a notice written from what the *code* cannot do yet, shown
before the *document* has been looked at.

---

## 🟢 2026-09-10 — a scan is named before extraction, in the browser

Owner asked whether a text layer can be detected **before processing**. It can, and for
free: `pdfjs-dist` was already in `package.json`.

| # | Finding | Detail |
|---|---|---|
| 147 | 🟢 **The text layer is probed at STAGING, in the browser** — no upload, no job record, no credit | The operator used to press Extract, wait for the queue, and learn only then that the document was a scan. Now the row says **"looks scanned"** the moment it is added, and the warning names the files it applies to |
| 148 | 🔴 **`GlobalWorkerOptions.workerSrc = ""` DOES NOT disable the worker in pdfjs 2.x.** The library still fetched one, from a path webpack never emitted — and **Laravel answered that request with the SPA's own index.html** | The browser reported `SyntaxError: Unexpected token '<'`: a JavaScript error whose real cause is a missing file being served as a web page. ⚠️ **A 200 OK from an SPA catch-all is indistinguishable from a real asset until something tries to parse it.** Fixed by importing `pdf.worker.entry`, so webpack emits the worker and hands back whatever URL the build actually produced |
| 149 | ⚠️ **The probe is an ADVANCE WARNING, never the decision.** It reads the first three pages; the server reads all of them with PyMuPDF and its answer is the one that counts | A 200-page file must not freeze the panel to answer a question the server will answer properly anyway, and on disagreement the upload proceeds — a probe that blocked on its own opinion would turn a cheap hint into a new way to lose a good document |
| 150 | 🔴 **Both ends share one threshold** — `TEXT_LAYER_MIN_CHARS = 120` in the panel, `MIN_TEXT_CHARS = 120` in `unstructured.py` | If they disagreed on where the line sits, the panel would tell the operator one thing and the parser would then do another, on the same file |

---

## 🔴 2026-09-10 — "Could not connect to server": three things, not one

Reported as `cURL error 7: Failed to connect to 127.0.0.1:8001 … /extract-unstructured`.

| # | Finding | Detail |
|---|---|---|
| 151 | 🔴 **The configured port did not match the deployment.** `config/services.php` defaulted to **8001**; `docker-compose.yml` publishes **8000**, and its healthcheck probes 8000. Nothing set `OCR_SERVICE_URL` in `.env` | So extraction failed with "Could not connect" **even with the container running correctly**. ⚠️ **A default that disagrees with the only place the service is defined is worse than no default** — it fails at the point of use, far from the mismatch, and looks like a network problem. Default corrected and `OCR_SERVICE_URL` added to `.env` and `.env.example` |
| 152 | 🔴 **Nothing was listening at all.** Only `f16s-db` was up; the `ai-server` container has never been started in this environment | Started on the **host** rather than in the container, deliberately: Ollama runs on the host, and PRD §9.5 cohosts the two over loopback. A containerised FastAPI would need `host.docker.internal` to reach the model and gains nothing locally |
| 153 | 🔴 **No queue worker was running**, so even with the service reachable the job would sit `pending` forever | `ProcessPdfOcrJob` dispatches to `pdf_processing`, which nothing was consuming. Three separate breaks between the button and a result, each of which alone produces "nothing happens" |

**Verified end to end** — upload → queue → FastAPI → stored:

    status          completed
    document_type   unstructured
    extraction_path text
    shipper         Northwind Exports Pvt Ltd 41 Marine Drive, Unit 7 Mumbai 400020, India
    destination     FRA
    pieces          12
    gross weight    480.5

⚠️ **The service and worker are foreground processes started by hand.** They do not survive
a reboot. 🟢 The image half of this is now closed — see the rebuild section below.

---

## 🔴 2026-09-10 — the rebuild that rebuilt nothing

`docker compose build ai-server` returned **exit 0** and `docker compose up -d` reported
**`Up (healthy)`** — and the container still could not `import fitz`.

| # | Finding | Detail |
|---|---|---|
| 154 | 🔴 **A green build and a healthy container proved nothing.** `docker images` showed the ai-server image as **"9 days ago"**: every layer was cache-satisfied, so `RUN pip install -r requirements.txt` never re-ran and the image predated `pymupdf` being added to `python/requirements.txt` | ⚠️ **Docker invalidates that layer on the checksum of the COPYed `requirements.txt`, and the file had been edited — so this should have busted.** Whatever the cause, the lesson is the check, not the theory: **a build's exit code says the build ran, not that it installed anything.** `--no-cache` produced the real install (`pymupdf-1.26.5`, `pydantic-2.13.5`) and the image went 739MB → **803MB**. Verify a rebuild by importing the new dependency, never by exit code |
| 155 | 🔴 **The soft import hid it perfectly.** `unstructured.py` guards PyMuPDF behind `_HAS_MUPDF` and falls back to pdfplumber, which is correct — a missing fast reader must not take `/extract` down with it | 🔴 But it means **a missing dependency has no symptom**: the endpoint answers 200, the output is identical, and only the speed differs. That is why the stale image survived a healthy container and a passing smoke test. The container now reports `_HAS_MUPDF = True` explicitly, which is the thing worth asserting |
| 156 | 🔴 **`127.0.0.1` inside a container is the container.** `model_extract.py` defaults to loopback, so containerised the model call resolved to nothing — and an unreachable model is treated as *"no model"*, falling back to label anchoring | 🔴 So the failure mode was **quietly worse extraction, not an error**. `docker-compose.yml` now sets `OLLAMA_URL: http://host.docker.internal:11434` with `extra_hosts: host.docker.internal:host-gateway` (Docker Desktop supplies the name; Linux hosts do not) and `OLLAMA_KEEP_ALIVE: "-1"` to stop paying the 10-60s cold load per request. Verified from inside the container: `OK models: ['gemma3:1b']` |
| 157 | 🔴 **Two labels on one line ran together.** `_blocks_after` terminated a field at a blank line or at a label **starting the next line** — a line-anchored rule. A compact invoice writes `Origin: BLR    Destination: FRA` on one line | 🔴 `departure` came back as **`"BLR DESTINATION: FRA"`**, which is then what the IATA resolver is handed. Found by the first real end-to-end run through the container, not by any test. A third alternative now also stops at a second label on the same line; pinned by two tests — one for the compact lane, one asserting a wrapped multi-line address is still read whole, because that is what the new terminator could plausibly break |

**Verified end to end through the container**, `POST /extract-unstructured`:

    extraction_path  text
    read_by          labels
    shipper          ABC Logistics Pvt Ltd, Bengaluru, India
    departure        BLR          (was "BLR DESTINATION: FRA")
    destination      FRA
    pieces           12
    gross weight     480.5

🟢 `read_by: "labels"` is the **designed** result here, not a model failure: label anchoring
filled every region, so `gaps` was empty and `_apply_model` returned without calling Gemma.
The model is a gap-filler, not a first pass.

| # | Gap | Detail |
|---|---|---|
| 38a | 🔴 **The vision path is still not built.** `google-generativeai` is not in `python/requirements.txt` and `/extract-unstructured` answers **501** for a document with no text layer | So a **scanned** document cannot be read at all. The consent flow, the credit accounting and the `awaiting_vision_consent` UI are all reachable now — they simply lead to a 501. This is the remaining half of #38 |

---

## 🔴 2026-09-11 — a real invoice, and what it proves about label anchoring

First live document: a 2-page commercial invoice (TRAILSPEC GEARS → SILVER MOON, Nhava
Sheva → Umm Qasr). PyMuPDF read it correctly — `extraction_path: text`, 3,005 chars. Every
field after that was wrong.

| # | Finding | Detail |
|---|---|---|
| 158 | 🔴 **A value can appear BEFORE its own label, and another field's value after it.** In the real text the exporter's name is on line 106 and the word `Exporter` on line 114 — eight lines *below* its own value — while line 115, immediately after the label, holds the value belonging to `Invoice No.& Date` on line 101 | 🔴 So anchoring returned the **invoice number as the shipper**: `shipper.full_details = "TSGEXP/001 & 25-08-2026"`. ⚠️ **No anchoring rule survives this** — not after-the-label, not before-the-label, not same-line. The order is not wrong, it is *absent*: PyMuPDF returns the PDF's internal draw order, and a grid-layout invoice interleaves cells from unrelated boxes. Coordinates would fix this one file and break on the next, which is why they were **rejected by the user** as a direction |
| 159 | 🔴 **Garbage counts as "filled", so the repair never runs.** `_apply_model` only consults the model for regions `_is_blank()` calls empty, and `"TSGEXP/001 & 25-08-2026"` is not empty | 🔴 `read_by: labels`, `model_filled: null` — the one component that could have read the page correctly was never asked. The trigger must be **implausible**, not merely blank: an invoice number in a company field is a worse outcome than a blank one, because nothing about it looks broken |
| 160 | 🔴 **The prompt's ordinal rule is positional reasoning in disguise.** It said *"the FIRST company is the SHIPPER, the SECOND is the CONSIGNEE"* | In this document the second company is **AXIS BANK LIMITED**, from the bank-details block. The same class of assumption that broke anchoring, moved into the prompt |
| 161 | 🔴 **A free-form list field is a loop trap for a small model.** `unreadable: List[str]` in the schema | gemma3:1b spent **242 seconds** filling it with hundreds of price-table numbers and repeated SKU codes, then ran out of generation budget mid-string and failed validation — returning `null`. Removing the list and capping `num_predict` took the same document to **41.7s** and valid JSON. ⚠️ Form was fixed; correctness was not |

### 🔴 gemma3:1b cannot do this task — three prompts, three failure modes

| Prompt | Time | shipper_name | origin | destination |
|---|---|---|---|---|
| original (with `unreadable`) | 242.2s | — | — | — (invalid JSON, `null`) |
| bounded schema | 41.7s | `"Exporter"` — the label | `"HUNTER-GREEN"` — a colour | `"India"` |
| + worked example | 40.3s | `SILVER MOON…` — the consignee | `"INDIA"` | `"INDIA"` |

Correct answers: shipper **TRAILSPEC GEARS PRIVATE LIMITED**, origin **NHAVA SHEVA**,
destination **Umm Qasr**. The only field it got right in any run was `gross_weight: 364.09`
— which the existing regex already gets without a model.

🔴 **This is a capacity limit, not a prompting one.** The schema fix and the worked example
each changed the failure and neither reduced it: a 1B model does not have the reasoning to
bind values to labels when reading order carries no information. 🟢 Decision (user,
2026-09-11): **pull gemma3:4b and measure it on this same invoice.**

### 🔴 gemma3:4b could not be measured on this host — it never produced a token

| Stage | Result |
|---|---|
| Load | **153 s**: `llama-server started in 153.45 seconds` |
| Prompt read | ~1,870 tokens (context checkpoints logged at 850 and 1,870) |
| Generation | **Did not finish in 30 minutes.** The client timed out at 1,800 s and Ollama logged the dropped request as `500 \| 30m2s` |
| Runner afterwards | Reported "loaded" at 3.04 GB, but **0.00 GB resident, 0% CPU**: the weights were in swap |

🔴 **So the accuracy question is still open. 4b was never tested; only its fit on this
machine was.** "9 GB RAM, so a 3.3 GB model fits" was arithmetic on the nameplate. What was
actually free:

- **Swap 6.5 of 7 GB in use, 0.02 GB free RAM, 2.6 GB compressed**, before 4b loaded.
- **Docker Desktop's VM reserves 4.1 GB** of the 9 GB, while `f16s-ai` + `f16s-db` use
  about **0.9 GB** of it. Roughly 3 GB is reserved and idle.
- **`keep_alive: -1` pinned the previous model.** gemma3:1b sat resident until it was
  unloaded by hand, and 4b would have stayed pinned in swap the same way. I set that
  value, in docker-compose and on the host `ollama serve`. With more than one model on a
  small host, "never unload" holds whichever model ran last and starves the next one.
- **gemma3:4b loads its vision tower as well** (`image_size 896`, `patch_size 14` in the
  load log). That memory buys nothing for a text-only extraction.

⚠️ PRD §9.6 already said Gemma should not run on a laptop, and this is that warning
measured. Production cohosts Ollama on a dedicated t4g.large (PRD §9.5). **This laptop
cannot answer whether 4b is accurate enough**; that needs freed RAM, or the production host.

### 🟢 gemma3:4b measured with Docker stopped: shipper and consignee are right

Docker Desktop quit to release its VM (user's call, 2026-09-11). Load then took **63 s**
instead of 153. Same invoice, run from the host:

| Field | Returned | Verdict |
|---|---|---|
| shipper_name | TRAILSPEC GEARS PRIVATE LIMITED | ✅ |
| shipper_address | 22/702/01 - CEE PEE BUILDING, MASJID ROAD, HMT P.O, KALAMASEERY, ERNAKULAM - 683503 | ✅ |
| consignee_name | SILVER MOON COMMERCIAL BROKERAG CO | ✅ |
| consignee_address | the correct Amman address, **plus** the Delivery address/Buyer block and `64 X 32 X 64 CM` | ⚠️ over-captured |
| transport_mode | SEA | ✅ |
| description | PU coated polyester travel backpack | ✅ |
| pieces | 500 (the total, not a row) | ✅ |
| gross_weight / net_weight | 364.09 / 318.33 | ✅ |
| origin | `Umm Qasr` | ❌ the discharge port |
| destination | `India` | ❌ the origin country |
| invoice_number | `BANK DETAILS` | ❌ a label |

**8 correct, 1 partial, 3 wrong** (gemma3:1b: 1 of 6). **378 s** end to end.

🔴 The three misses are the adjacency trap again: `Port of Discharge` is directly
followed by `Umm Qasr`, and `Invoice No.& Date` by `BANK DETAILS`. ⚠️ **Grounding cannot
catch them.** Every wrong value is a verbatim substring of the document, and
`_grounded()` only drops strings that are absent from it. The lane could be checked
structurally: `India` is a country, not a port, and a SEA lane must resolve to a UN/LOCODE.

🔴 **On this laptop the pipeline cannot use 4b as deployed.** The successful run needed
Docker **stopped**, but the real path needs Docker **running**: MySQL, the queue and the
ai-server are all in it. With Docker up, the same request produced no token in 30 minutes.
Making both fit means shrinking Docker's VM (it reserves 4.1 GB and uses ~0.9 GB), or
running Ollama on the production host (PRD §9.5).

🔴 **Three stacked timeouts sit below what 4b needs, on any hardware.** On the upload path:
`model_extract.TIMEOUT_SECONDS` = **60 s** (ai-server → Ollama),
`ProcessPdfOcrJob.php:105` `Http::timeout(80)` = **80 s** (Laravel → ai-server), and the
queue worker's `--timeout=120` = **120 s** (the whole job). 4b needed **378 s**. So even on a
machine with room for the model, the real path would time out at 60 s and **fall back to
labels silently**, because a timed-out model is treated as "no model" (the same
quietly-worse-extraction pattern as #156). Job 4 finished in 9 s only because the model
was never called. ⚠️ Raising them is a product decision, not just a config value: on this
hardware it means an operator waits about six minutes per document.

⚠️ **This invoice is SEA** (Nhava Sheva → Umm Qasr, "BY SEA"), while `departure`/
`destination` run through an **IATA** resolver. Nhava Sheva is `INNSA` and Umm Qasr `IQUQR`
as UN/LOCODEs, and neither has an IATA code. A commercial invoice can be either mode, so
the extractor cannot assume air — see the air/sea code rule. Not yet fixed.

---

## 🟢 2026-09-11 — the model reads the document; labels are only the fallback

User's direction: no coordinate mapping (layouts keep changing); **read the PDF, then
extract**. Built on the gemma3:4b measurement above.

| # | Change | Detail |
|---|---|---|
| 162 | 🟢 **The model's reading replaces the label reading.** For shipper, consignee, cargo, pieces and gross weight (the Extraction panel's groups; see #170) the model's answer wins. A field the model leaves out comes back **blank**, not as the label guess | 🔴 The label guess for the shipper on the real invoice was the invoice number. A wrong value on the card looks like a right one; a blank gets noticed. Labels are still read first, but only as the fallback when the model cannot answer. On the real 4b answer: shipper `TRAILSPEC GEARS PRIVATE LIMITED`, city `KALAMASEERY`, pin `683503`; consignee `SILVER MOON COMMERCIAL BROKERAG CO` whole (the label path had split `BROKERAG CO` off as the city); pieces **500** (the regex had 50, a single table row); gross **364.09** |
| 163 | 🟢 **A fallback is never silent.** `model_extract.extract()` returns `(fields, None)` or `(None, reason)`: *the model is not reachable*, *the model timed out after Ns*, *the model failed (HTTP n)*, *the model returned something unreadable*. It lands in the result as `model_error`, the status endpoint returns it, and the panel shows **"read by labels only: <reason>"** on that document's row | 🔴 Before this, a timed-out model and a model that read badly looked identical. Both reasons are tested against the **real** client, not a stub: a closed port, and a socket that accepts and never answers. ⚠️ `socket.timeout` only became an alias of `TimeoutError` in Python 3.10 and the host test runner is 3.9, so both are caught |
| 164 | 🟢 **Timeouts nest.** Model 60 → **600 s**; Laravel → parser 80 → **660 s** for unstructured documents only (an AWB keeps **80 s**); job 90 → **720 s**; `retry_after` on `database` and `redis` → **780 s** | `tests/Unit/OcrJobTimeoutTest.php` pins the nesting: each limit outlasts the one inside it, and `retry_after` outlasts the job, or a second worker picks up a document the first is still reading. ⚠️ `retry_after` is per connection, so a crashed job on those connections now waits 13 minutes before a retry instead of 90 s |
| 165 | 🔴 **`/extract-unstructured` ran the extraction on the event loop.** An `async` endpoint calling a blocking function | Harmless for a 9 ms label read; with a model reading for minutes it would block **every other request, `/health` included**, and the container healthcheck would mark the ai-server unhealthy mid-extraction. Now `run_in_threadpool` |
| 166 | ⚪ **Superseded 2026-09-11 by #170: the model no longer reads the route, so this branch was removed.** ~~A SEA lane was given airport codes.~~ The IATA lookup matches city names: `Chennai → MAA`, `Mumbai → BOM`, both airports | When the model reports the mode as SEA, the port is kept as written, upper-cased. ⚠️ It should become a UN/LOCODE, but **the `ports` table exists with a `locode` column and 0 rows**, so there is nothing to resolve against. Filling it is a data decision, not invented here — **open, yours** |
| 167 | 🟢 **Tests no longer reach a real model.** The label tests used to call whatever Ollama was running, so the suite took over two minutes and its result depended on the loaded model | Every test now starts with no model and opts in with a stub. **28 tests in 24 s** |
| 168 | ⚠️ **The document is capped at 6,000 characters** so the prompt, the text and a 512-token answer fit `num_ctx` 4,096 | Table text ran about 2.4 characters per token. A prompt that overflows the context gets cut, and what gets cut can be the instructions. The cut is logged. **Open limit:** the tail of a longer document is not read by the model |
| 169 | ⚠️ **`keep_alive` defaults to `10m`, not `-1`**; docker-compose names `gemma3:4b` explicitly | On the 9 GB laptop `-1` pinned whichever model ran last. A dedicated Ollama host (PRD §9.5) should set `OLLAMA_KEEP_ALIVE=-1` |

🔴 **Doc vs code — `QUEUE_CONNECTION=sync` locally.** The upload dispatches `ProcessPdfOcrJob`
with no connection, so it runs **inside the upload request**. The queue worker started by
hand listens on `sync`, which never holds a job, so it has never processed one (its log is
empty). **GAPS #153 says uploads "sit pending forever" without a worker; under this config
that is not true.** Flagged, not changed. The panel copes either way: no browser-side
timeout, and each document polls on its own, so a long read shows "reading" on that row only.

Still wrong after this, and the operator's review is what catches it:
- 4b's **lane** on the real invoice: `Umm Qasr` as origin, `India` as destination (correct:
  Nhava Sheva → Umm Qasr). Every value is really in the document, so grounding cannot catch it.
- The model copied the label `Address :` into the consignee address.
- The `address` field stops at **30 characters**. That is the shared `transform_address_box`,
  the same as `/extract` does to an AWB box.

🟢 **Verified through the real upload path, with the model unreachable.** Ollama was stopped
for the check: upload → sync job → ai-server (`available()` false) → `model_error` → status
endpoint → the panel's row read **"Ready ⚠️ read by labels only: the model is not
reachable"**. Tests: Python 28/28 (24 s), PHP `OcrJobTimeoutTest` 4/4, jest 35/35, webpack
compiled. `OcrStatusModelErrorTest` pins the status endpoint carrying `model_error`.

🟡 **Verified 2026-09-11: a real upload read by gemma3:4b**, with Docker's VM at 2 GB. Job
#8, `Commercial Invoice.pdf`: `read_by: model`, no `model_error`, **7 min 7 s** end to end.
Ollama: the prompt took 288 s for 1,877 tokens (6.5 tokens/s), the answer 131 s for 180
tokens (1.4 tokens/s).

| Field | Result | Verdict |
|---|---|---|
| shipper | TRAILSPEC GEARS PRIVATE LIMITED, the full Kalamassery address, pin 683503 | ✅ |
| consignee | SILVER MOON COMMERCIAL BROKERAG CO, Gardens Wasfi Al Tal St., P.O Box 9192 Amman 11191 Jordan | ✅ no over-capture this time; the `Address :` label is still copied in |
| origin | NHAVA SHEVA | ✅ |
| destination | INDIA | ❌ correct: Umm Qasr |
| description, pieces, gross weight | blank | ❌ the model left them out; the ai-server logged no grounding drops |
| awb_number | AXISINBB081 | 🔴 the bank's **SWIFT code**, in a field that goes onto a waybill. A sea shipment has no AWB |

🔴 **Small prompt changes move 4b's answer around.** The host test used a slightly different
prompt and field order: it got the description, pieces and both weights, and missed the
origin. This run, with the production prompt, got the origin and lost those three. Same
model, same document, temperature 0. One invoice is not enough to tune against, and the
operator's review still catches the rest.

🔴 **A wrong AWB number is the worst of these.** It passes grounding, because the SWIFT code
really is in the document. An AWB number has a fixed shape (a 3-digit airline prefix and an
8-digit serial), so a format check would blank it. Proposed, not built.

⚠️ **Found while checking, filed as a separate task:** the panel's "What will be used" table
prints each party as a raw JSON dump of `{value, confidence}` pairs, most of them
`"value": null`. That is very likely what read as "all values are null" on the first
extraction. Not part of this change.

---

## 🟢 2026-09-11 — only what the panel takes, and parties a draft can use

| # | Change | Detail |
|---|---|---|
| 170 | 🔴 **The model is asked only for what the Extraction panel takes from a document**: the parties, the cargo and the weights. Route, AWB number and transport mode removed from the schema, the prompt and the mapping | User: *"you are only supposed to extract what I mentioned to extract."* The panel's groups are shipper & consignee; pieces, dimensions, description; gross, volumetric, chargeable; notify party. Asking for the route and AWB was scope nobody set, and it did harm: on the real invoice the model returned the bank's **SWIFT code as the AWB number**. `test_the_model_is_asked_only_for_what_the_panel_takes` pins the field list |
| 171 | 🔴 **A document's shipper and consignee never reached a draft.** A document delivers each party NESTED (`shipper: {name, address, city, pin, …}`), while the panel's paste, address book, Fit, incomplete-party check and `buildPayload` all read FLAT keys (`shipper`, `shipper_address`, `shipper_city`…) | So Save as draft, which removes parties it thinks are incomplete, removed every party read from a document. `flattenParties()` in `awbMapping.js` now flattens them when extraction finishes. ⚠️ The address comes from `full_details`, not `address`: the parser cuts `address` at 30 characters (`…CEE PEE BUILDING MAS`). ⚠️ Missing parts are **left out**, not set to null, so the incomplete check still sees them. jest spec on **job #8's real fields**, 7/7 |
| 172 | 🟢 **"What will be used" shows each party as clean lines**: name, address, then city / state / post code / country | It printed the nested object as JSON, mostly `"value": null`. That was what read as *"all values are null"* on the first extraction |
| 173 | 🟢 **"Take from it" has an "All" option**: one document supplies every group, taking each from whichever document had it | Asked for by the user |

🟢 **Verified in the browser on job #8's real result.** The panel polled the real status
endpoint; only the upload was skipped, and that path was verified earlier. "Take from it" set
to **All** gave that document every group. Shipper read *TRAILSPEC GEARS PRIVATE LIMITED /
22/702/01 - CEE PEE BUILDING MASJID ROAD, HMT P.O, KALAMASEERY , ERNAKULAM - 683503 / City:
KALAMASEERY · Post code: 683503*. Consignee read *SILVER MOON COMMERCIAL BROKERAG CO / GARDENS
WASFI AL TAL ST. P.O Box 9192 Amman 11191 JORDAN / Post code: 11191*. No JSON anywhere on the
page. Tests: jest 42/42 (7 new, on job #8's fields), Python 27/27, webpack compiled.

⚠️ **Both parties are still held back from the draft**, correctly, and the panel now says so:
*"shipper will not be saved — no state, country"* and *"consignee will not be saved — no
city, state, country"*. The invoice does not give the shipper's state or country, and the
parser did not split Amman / Jordan out of the consignee's address. The operator fills them
(paste `Shipper state: …`, the address book, or the form). That is the create endpoint's own
rule (GAPS #42). **Open, the user's:** should a draft accept an incomplete party instead?

⚠️ **Open question for the user:** the panel's groups also include dimensions, chargeable
weight and the notify party, which the model does not read yet. Not added without asking.

---

## 🟢 2026-09-12 — Save as draft keeps what was collected; paste takes a whole party

User: *"when i clicked on save as draft it didnt save the shipper consignee details, only saved
the awb number"* · *"if no state or country is mentioned, still put it and save as draft. It's a
draft so the user can make the changes in the draft."*

| # | Change | Detail |
|---|---|---|
| 174 | 🔴 **Save as draft saved only the AWB number.** Both create endpoints required every party part (name, address, city, state, post code, and a 2-letter country), so the panel removed any party missing one. The master waybill also skipped, **in silence**, any shipper without a country and city | `DraftPartyRules`: with `status = draft` only the party's **name** is required; a part that IS given must still be valid (lengths, 2-letter country). Every other status (`send`, `generate_pdf`) keeps every rule. ⚠️ The AWB form's own draft button also sends `draft`, so it gets the same rule. The panel now sends `status: draft` and keeps partial parties. 43 party assignments that read a missing key (19 AWB, 24 HAWB) now take `?? null` instead of crashing. **Verified in the browser:** test AWB **176-99990001** stored with status `draft`, the full shipper from a paste, and the consignee without a state |
| 175 | 🟢 **The model also reads dimensions, chargeable weight and the notify party.** User: *"yes I want the other things also. only when i have extracted it or pasted it."* Each is set only when the model found it | 🔴 **And a document's cargo had never reached the panel at all.** A document gives `piece_weight.no_of_pieces` and `cargo.description`; the panel reads `pieces` and `goods`. `flattenCargo()` bridges them, treating a zero as "not found", since the parser writes 0 for a missing figure. It applies to AWB extraction too |
| 176 | 🟢 **Paste takes a whole party**: `Shipper:` (or just `Shipper`), then the address below it as it sits on the invoice. `parsePartyBlock()` splits it into name, address, city, state, post code and country; a country name becomes the form's 2-letter code from `config('country')`. A `Shipper city: …` line still overrides | ⚠️ **A rule, not a reader.** Name first; country last; the part that begins or ends with a 4-10 digit number holds the post code, with the city beside it; state between them. It skips a `P.O Box` number. It does **not** recognise alphanumeric post codes (UK `SW1A 1AA`), and a single line after the name stays address. Every part shows in "What will be used" before it is saved |
| 177 | 🟢 **Low-confidence fallback** (user's request): where the Python parser found nothing for a party's city, state, post code or country, the same splitter fills it from that party's address, marked **medium** so it lands on the review list | On job #8 it filled the consignee's **city Amman** and **country JO**, both of which the parser missed. Parts the parser did find are kept |
| 178 | 🔴 **Every house waybill Save as draft crashed with a 500**, before any party was looked at. `store()` called `totalAmountValume($id, $request->totals)` even when no totals were sent, and the panel sends none unless it has both volume and amount | Guarded the way the master waybill already is. 🔴 **Then it crashed a second time:** it read `$request->agent_head_office['ho_*']` (6 fields, in both `store()` and `update()`) with no fallback, and the panel sends no agent head office; all 12 reads now take `?? null`. ⚠️ **Open:** when the panel does send totals for a house waybill it sends `total_volume` / `total_amount`, but that endpoint requires `master_pcs` / `master_weight`, so such a draft would still be refused. Not fixed |
| 179 | 🟢 **The chargeable weight is a SUGGESTION, not a fact.** User: *"calculate the chargeable weight from the dimension and pieces. and put it as a suggestion."* It is worked out as before — volumetric is `L×W×H×pcs ÷ 6000`, chargeable is the greater of that and gross — but it now shows as **suggested** and reaches the draft only once the operator types it into the box beside it | The panel used to write the calculated figure into the draft itself, so a draft carried a number nobody had read or entered. ⚠️ The suggestion only became possible for an EXTRACTED document with #175: dimensions and pieces from a document never reached the panel before that |
| 180 | 🔴 **A chargeable weight had never reached a draft at all.** `buildPayload` read it into `chargeable` and then sent the field hardcoded empty (`chargable_weight: ""`, the endpoint's own spelling) | So the figure was dropped whether it was extracted, pasted, or typed by the operator — and "save the suggestion once accepted" could not have worked. Pinned by a jest test on the built payload |

🟢 **Answered (2026-09-12):** the calculated chargeable weight stays out of the draft and is
shown as a suggestion instead — see #179.

🟢 **Tests.** Full PHP suite: 595 passed, 1 skipped, 1 failed. The failure was the house
waybill draft test, which ran before the `agent_head_office` fix; after the fix,
`HouseWaybillDraftTest` passes 2/2 and `AirwayBillDraftTest` 9/9. jest 57/57, Python 29/29.
🟢 **Re-run on the finished code (2026-09-12): 596 passed, 1 skipped, 0 failed** — the whole
suite green with the draft rules, the house waybill totals guard and the `agent_head_office`
fallback all in place.

ℹ️ **Test data left in the dev database:** AWB **176-99990001** (status `draft`), created by the
browser check of Save as draft.

---

## 🟢 2026-09-12 — the model splits every party, and may work out a state and a country

User: *"i want the gemma model to pull out all the necessary information such as pin code
state and everything from the invoice. if it state or country hasnt been give or extracted,
ask gemma to produce it or if the confidence on the country is low then just ignore it and
still let it be saved as draft."*

| # | Change | Detail |
|---|---|---|
| 181 | 🟢 **Every party in six parts** — name, street, city, state, post code, country — for shipper, consignee and notify. The schema went from 11 fields to 23 | The split used to be left to `transform_address_box`, a positional rule that read **KERALA as the shipper's city** and found no state or country at all. Where the model gives a part it wins; the parser's value stands where the model gave none; the paste rule (#177) fills only what neither produced. ⚠️ **Measured on the real invoice: 347.8 s**, against 534 s for the old 11-field answer — a longer answer but a faster one, so the 600 s model limit and the timeouts above it are unchanged |
| 182 | 🟢 **A state and a country may be WORKED OUT**, as asked: if the document prints neither, the model gives the ones the city and post code belong to. They arrive marked **low**: shown on the review list and **left out of the saved draft**, which is the user's own rule — *"if the confidence on the country is low then just ignore it and still let it be saved as draft"*. The rule-derived fallback (#177), which reads a party's OWN address, stays **medium** and is saved | 🔴 This required the grounding check (which drops any text absent from the document) to stop applying to those two fields. The exemption is **exactly two fields wide**, pinned by a test asserting an invented company and an invented city are still dropped while a worked-out `Kerala` survives |
| 183 | 🔴 **Two defects in the first 23-field answer, both fixed.** `consignee_state: "NONE"` — a word standing for absence, in a field that now skips grounding, so nothing else would have stopped it reaching a waybill; the same failure as `awb_number: "Not specified"` from the 1B model. And `consignee_post_code: "P.O Box 9192"` — a box number, while the real post code **11191** sat on the same line | Absence words (`NONE`, `N/A`, `NIL`, `not specified`…) and box numbers are dropped, and the prompt says so too. Both pinned by tests. ⚠️ The paste rule already guarded against the P.O Box case; the model had no such guard |

| 184 | 🔴 **A second measured run produced two more wrong values, both fixed.** `shipper_country: "Iraq"` — the shipment's DESTINATION, printed elsewhere on the page, offered as an Indian shipper's country. And `consignee_post_code: "9192"` — the digits of the P.O Box, after the first guard dropped the string `"P.O Box 9192"` | The prompt now says a country must be the party's **own**, never the shipment's destination or another party's. The post-code guard asks the DOCUMENT as well: a number printed right after "Box" is a box number, whatever shape it arrives in. And a worked-out state or country is marked **low** and kept out of the draft by `withoutWorkedOutParts()`. ⚠️ Same model, same text, temperature 0 — the two runs differed because the **prompt** changed between them, so every prompt edit needs its own measurement |

| 185 | 🔴 **The consignee's address was filed under a notify party that the invoice does not name.** Fourth measured run: `notify_address: "GARDENS WASFI"`, `notify_city: "AL TAL ST."` (a street), `notify_country: "JORDAN"` — the consignee's own block — while the consignee came back as a **name and nothing else** | A notify block is now kept only when the model also returns a `notify_name`: an address with no company is not a party. ⚠️ The six notify fields earn their place on a document that names one; on a document that does not, they are somewhere wrong for the consignee's address to go. **Open, the user's:** drop the notify party from the model's schema and fill it from the paste box or the address book instead? |

🟡 **Four measured runs, four different mistakes** — `NONE`; `P.O Box 9192`; `Iraq` and a bare
`9192`; then the consignee's address under a notify party. Each was guarded after it appeared,
and the guards held in the run after: the fourth answered `shipper_country: "INDIA"`, with no
absence word and no box number. But the same document keeps producing a new kind of error, so
the split is not something to trust unreviewed — which is what the review list and the
low-confidence rule are for.

⚠️ **Not a code fix, and worth knowing:** the same run answered `shipper_state: "ERNAKULAM"`
— the district, not the state (Kerala). It IS on the page, so grounding accepts it, and
asking the model to work the state out did not produce Kerala here. It reaches the operator
marked for review, which is what that marking is for. It recurred in the second run, and
under the rule above it no longer reaches a draft on its own.

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
- 🔴 **NEVER run two PHP suites at once.** `phpunit.xml` hardcodes one MySQL database, `DB_DATABASE=f16s_test`, so a second run migrates and truncates the tables the first one is mid-way through using. The result is a **large, plausible, entirely fake failure count** — 183, 259, 220, 248 and 245 on five separate occasions, every one of them this and nothing else. ⚠️ The trap is that the failures look like real regressions and invite a hunt. Before believing any failure count, check `pgrep -f "phpunit --configuration"` returns exactly one process, and confirm no earlier background run is still writing its log. 🟢 A per-process database name would remove the footgun permanently; not done, because it changes how everyone runs the suite.
- ⚠️ **`pgrep -f` matches the shell that is running the `pgrep`.** A monitor that greps for its own target counts itself, so "2 processes" can mean one. Compare start times before concluding two runs overlap.
