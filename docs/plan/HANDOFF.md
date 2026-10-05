# Handoff — start a new session from here

Paste this into the new session:

> Continue F16s Freight OS (Laravel 9, Vue 2) on branch `feat/freight-os-schema-ldt65g`. Read `docs/plan/HANDOFF.md`,
> then the newest rows of `docs/plan/GAPS.md` (#443 onward), then `docs/plan/implementation_guide.md` Steps 11–12.
> Follow the standing rules in HANDOFF.md. Ask me before starting anything not listed under "Next".

## Standing rules (from the owner)
- Record every finding as a numbered row in `docs/plan/GAPS.md`. Read the root docs and `docs/plan/*` before each piece of work; if a doc disagrees with the code, say so.
- Laravel migrations only, run on BOTH databases: `php artisan migrate --force` and `DB_DATABASE=f16s_test php artisan migrate --force`; check down/up.
- Commit by explicit path, never `git add -A` (another session may work in this repo). Push when tests pass. End commit messages with the Co-Authored-By / Claude-Session lines (leave out Claude-Session when the session's link is not known).
- Never run two `php artisan test` at once; run test files one at a time. Every new test must be shown to fail on the old code.
- Secrets: the owner adds API keys to `.env`; only check whether a key is set, never print it.
- Never send real email (skip Send on client updates, Boss mails, "Ask the client").
- Don't make the code complicated. If unsure what a function should do, ask. Never invent spec content — a HANDOFF "Next" line is a heading, not a spec: ask what it means before building it (#448 had four open questions).
- Money: revenue/profit net of tax; a credit note subtracts, a debit note adds; drafts/voids never count; INR at each document's own rate; a NULL credit limit never blocks, 0.00 blocks; a figure nobody measures is NULL, never 0; check `$fillable`.
- "When was a bill paid" has ONE answer: `ClientPaymentGrader::settledOn` — the settling receipt's date, else the matched bank line's VALUE date, else not measured. Never a bank line's import date or a bill's `updated_at`.
- Jev: only chooses among options PHP built; a person confirms every suggestion; asked once; rubric in `config/mail_intent.php` / `config/accounts_decisions.php` — bump the version on any wording change.
- Built assets (`public/js`, `public/css`) are NOT committed on this branch since `c4a634fc`; run `npm run prod` locally and leave `public/` out of commits.

## Where we are (GAPS #436–#457, all pushed)

### This session (2026-10-03/04)
- **Connect your bank + alerts (#448):** no onboarding wizard exists, so (owner's answers) the bank step is a line on **Today** — *No bank account is set up* / *X is not connected* — and the next action on **Money in ④**; it clears once a feed is active or a statement is uploaded, and never rings the bell. Three alerts on **Today while true** and on the **bell once per event** (accounts + Boss; a client's money also to that client's salesperson): a **supplier** voucher due tomorrow (recorded due date only), a client's bank payment **matched short and left owed**, a client whose **grade letter** got worse. One service, `App\Services\Accounts\AccountsAlerts`; `accounts:alerts` hourly.
- **Health score + DSO (#450):** PRD §7.3.4 H filled by `sales:compute-snapshots` via `App\Services\Sales\ClientHealth`, weights in `config/client_health.php`. **Payment part = the client's report card** (owner's call — the one deliberate air/sea blend, PRD updated). Ops health (G) is computed by nothing, so it is always the dropped part. DSO now counts to the settling receipt's date, in rupees, bills only. Sales → Accounts shows *Days to pay* and the score with its bars (`HealthBars.vue`).
- **`accounts:verify` TDS check (#449):** each direction read in its own deduction's quarter; 176/176 on any date (a test pins 2 July).
- **Mode label (#451):** the Boss's unscoped client book shows `✈ Air` / `⚓ Sea` per row.
- **Docker OCR (#452, the owner's own fixes):** the queue worker now listens to `pdf_processing` (where every OCR job goes — before, PDFs uploaded in Docker were never read); `web`/`queue` reach db/redis/ai-server by service name; an OCR job with no temp file fails cleanly.

### Before (one line each — the GAPS rows have the detail)
- **Import (#434, #436, #437)** sea + air import pages, houses inside the consol, arrival notice staged; triage reads import/export.
- **Jev prompt compacted (#438)** ~830 / ~910 tokens. **Tiers (#439)** Core / Tactical / Command on FocusSea as on FocusAir.
- **Draft protocol (#440)** one draft per conversation, the bell follows it. **BL reading (#441)** `python/bill.py` → `SeaBillReading` → `BlReader.vue`.
- **Setu feed (#442)** read-only, ready for keys. **Payment report card (#443)** monthly A–D. **Airline commission/discounts (#444)**. **Bank upload file + guide (#445)**.
- **Accountant questions (#446)**. **End-to-end check (#447)**.

## Not measured yet — run on the Mac
- ~~Rubric check~~ measured 2026-10-04 (#453): sea 26/26; air 39–40/40 — with every #438 cut restored (`2026-10-04b`) *Pre-alert SIN-BOM* passes 2/5 (direction 0.55–0.70 vs 0.60). ❓ Owner: further wording would be new, not a restore.
- A real bill of lading through the BL reader (#441) — the AI server is now running; send back any field it misreads.
- Setu's request shapes against their sandbox (`app/Services/Bank/SetuAccountAggregator.php`, #442).

## Waiting on the owner
- BL / house / arrival notice / DO print layouts (#433, #434); import party mapping (#434a).
- ICEGATE developer-portal details (guide §12.3).
- CASS: a client's CASSLink billing files + the CASS agent output specification, and their iiNET SFTP/APIsec setup.
- Bank templates (HDFC, ICICI, Axis…) for bank-specific upload files.
- Answers to #446 (GST on commission/incentives; incentive as income or cost; late rebates); root-doc conflicts (#421, #435); FocusSea statuses (#425b).
- **Ops health weights** (`w[s]`, `w_cancel`, `w_corr`, `w_cass`, `w_decl`, `penalty_scale`) — the owner picks them after 2–3 months of real quarters in `customer_ops_quarters` (#456). ("Days slower" compares with the other clients only — owner, #457.)
- Production `.env`: `PORTAL_DOMAIN` / `PORTAL_SCHEME`, so the staff reviews' "See the details" links point at the live portals (#457).
- A provider that can also PAY (RazorpayX, Cashfree Payouts, a bank's corporate API) — Setu only reads (#442).
- Whether to bring back the *AI Extraction* and *Re-initiation* client mails (#440).

## Open — noticed, not asked for (offer, don't start)
- FocusSea's Sales → Accounts table clips its Health figures at an 800 px window; FocusAir's fits (#451).

## Next (when the owner says go)
1. CASS importer — once the sample files above arrive.

*(Done this session: connect your bank + alerts #448, health score + DSO #450, TDS check #449, mode label #451.)*
*(Then, 2026-10-04: rubric measured live #453; "Pre-alert SIN-BOM" lane misread fixed #454; test DB cleared of a hand-run fixture, tests made tolerant #455; OCR empty-path test #452; Mode column's hidden case walked on both portals #451. 2026-10-05: ops scorecard measured per quarter, not scored #456; quarterly staff reviews Boss → sales → ops/pricing, Command only #457.)*

## On the Mac after pulling
```
php artisan migrate --force && DB_DATABASE=f16s_test php artisan migrate --force
php artisan db:seed --class='\FreightDemoSeeder' --force
php artisan db:seed --class='\BillingDemoSeeder' --force
php artisan help:load-bundled
npm run prod
```
- **Docker stops when the Mac sleeps** — and can come back wedged: `docker info` says *"Docker Desktop is unable to start … backend time … context deadline exceeded"* and `compose up` fails on whichever image it reads first (*"unexpected end of JSON input"*). Quit Docker Desktop fully (`osascript -e 'quit app "Docker"'`) and reopen it; then restart the preview too, its workers stay stuck on the hung requests.
- **Docker (as before):** Start Docker Desktop, then `docker compose up -d` (web, queue, db, redis, soketi, ai-server, clamav). The ai-server mounts `./python`, so it runs the current code without a rebuild — it only has to be running. `curl` is not in the queue container; test reach with `php -r 'echo file_get_contents("http://ai-server:8000/health");'`.
- **The preview** (`.claude/launch.json` → `f16s`) serves on `:8099` with `php artisan serve`; the first requests after a start are slow (~20 s), so wait before signing in.
- **Portals:** accounts sign in at `accounts.localhost:8099`, the Boss at `admin.localhost:8099` (FocusAir refuses the Boss), operations/pricing/sales at `focusair.` / `focussea.`. Demo logins: `demo-*@demo.test`, `tact-*@demo.test`, `core@demo.test` — password `demo1234`.
- Locally, `.env` needs `PORTAL_DOMAIN=localhost:8099` and `PORTAL_SCHEME=http` for the staff reviews' links (#457).
- After seeding, `php artisan accounts:alerts` and `php artisan sales:compute-snapshots` fill the bell and the Sales page (the demo Boss sees *Northwind Traders slipped from A to C*, scores on Sales → Accounts).
- Run `AccountsRegressionSeeder` + `accounts:verify` against the dev DB, never `DB_DATABASE=f16s_test` by hand — `AccountsRegressionTest` runs it there inside a transaction; by hand it commits and breaks other tests (#455).
- Two tests fail only because `config/common-data.php` is gitignored and absent (CargoStatusCodeTest, JobBoardLinksTest).
