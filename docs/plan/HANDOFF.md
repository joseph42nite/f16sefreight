# Handoff — start a new session from here

Paste this into the new session:

> Continue F16s Freight OS (Laravel 9, Vue 2) on branch `feat/freight-os-schema-ldt65g`. Run `git pull` first. Read
> `docs/plan/HANDOFF.md`, then the newest rows of `docs/plan/GAPS.md` (#451 onward), then
> `docs/plan/implementation_guide.md` Steps 11–12. Follow the standing rules in HANDOFF.md. Ask me before starting
> anything not listed under "Next".
>
> Other sessions may be working in this repo at the same time: before any `php artisan test`, check none is running
> (`ps aux | grep "artisan test"`); just before adding a GAPS row or editing HANDOFF.md, `git pull` and take the next
> free number; commit by explicit path only.

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

## Where we are (GAPS #436–#466)

### 2026-10-06
- **Owner's answers (#459):** no *AI Extraction* / *Re-initiation* client mails (PRD + guide no longer claim one);
  *Pre-alert SIN-BOM* stays at 2/5 — prompts stay short, the lane (branch's country, PHP) decides it.
- **Root docs (#460):** README, `guide.md`, `implementation.md`, `it_devops_checklist.md` checked against the code —
  wrong lines omitted, restructured, nothing added; `guide.md`'s style rules are the public website's only.
- **Owner's answers (#461):** import parties by the assigned pricing/ops person; ops health weights after one quarter;
  airlines never pay the forwarder (a discount on the bill only); #425 (a) settled by #439, (c) as designed.
- **Imports assigned like exports (#462):** the maker in their own role's column; pricing takes an unowned import
  from *Masters to take* on the Enquiries board (houses come with it); the assigned pricing person may name its parties.
- **Inbox → FocusSea link fixed (#462):** the thread's job always came back with no mode, so sea jobs were offered AWB
  drafting; walked as demo-operations — the link opens the House Bill of Lading.
- **Export masters the same way (#463):** the maker in their own role; a house inside a master takes the master's owners.
- **Masters to take (#464):** the Enquiries board lists every master with no pricing owner — import or export —
  and pricing takes it with its houses (`/masters/to-take`, `/masters/{job}/take`).
- **Airline deductions are a lower cost (#465):** commission and discount off the CASS bill post to
  `5010-Airline-Discounts` under Direct Costs, not income; no GST on them. #446 closed.

### 2026-10-07
- **A real case clicked through as joseph@ (#466):** 15 findings in the Claude Docs doc *F16s demo walk — findings
  from clicking*; all fixed but #12 (test data). Cost-sheet margin before tax; 300 requests/min and one `/me` per load;
  only operations runs a job; old dashboard pages inside the app; the mail's cargo into the waybill; a confirmed
  mail's new client takes its branch and asks for onboarding.

### 2026-10-04/05
- **Ops scorecard, measured not scored (#456):** PRD §7.3.4 G as facts per client, mode and **financial-year quarter**
  in `customer_ops_quarters` (`App\Services\Sales\OpsScorecard`, written nightly by `sales:compute-snapshots`,
  **Command only**): days slower than the **other clients** on our own steps (Intake … PDF Generated, each equal; the
  airline's wait is not ours), cancellation rate, **FNA rate** (rejections only), declared-vs-actual weight gap — NULL
  below the PRD minimums. `ops_health` stays NULL, so H still drops it, until the owner picks weights. Sales → Accounts
  shows the last closed quarter and this one "so far" under the health bars. OCR corrections and CASS are not recorded.
- **Quarterly staff reviews (#457):** when a quarter closes, per client and mode, prepared once (`StaffReviews`, on the
  Boss-mail pipeline, `boss_mail_suggestions.owner_user_id`): the **Boss's** draft to the client's salesperson only;
  the **salesperson's** (Command, Sales page, own portal's mode) to the ops and pricing staff who worked it. Plain
  template: clean subject, the chain, losses with reason and pricing person, cancellations and FNAs with job/AWB/ops,
  rates against last quarter, every job, **See the details** → `/review/:id` (the chain only). 🔒 Every Boss/sales
  team mail now goes **only to the company's own active staff**. `TeamMails.vue` shared by Boss and Sales views.
- **Demo walks its jobs (#457):** `FreightDemoSeeder` writes each job's stage log at historical times and the airline's
  answer per AWB. Q2 FY 2026-27: Contoso 2.5 d slower than the others + 8.33% cancelled; Northwind FNA 11.11%, weight
  gap 8%. Run `sales:compute-snapshots` after seeding to prepare the Q2 reviews.
- **Rubric measured live (#453):** sea 26/26; air 39–40/40 — every #438 cut restored (`2026-10-04b`).
- **Lane misread (#454):** "Pre-alert SIN-BOM" read as SIN → BOM, not PRE → YLT (every lane pair tried; pre/alert are
  stopwords). "BLR JFK" (no separator) is still not a lane, by design.
- **Test DB (#455):** a hand-run `AccountsRegressionSeeder` had left rows in `f16s_test`; cleared, and the tests now
  upsert their ports and use their own rival codes.
- **OCR empty path (#452)** pinned by a test; **Mode column (#451)** walked hidden on both portals; **Accounts table
  (#458)** scrolls inside its column instead of being cut off at a narrow window (`.fx-table-wrap` is now shared).

### Before (one line each — the GAPS rows have the detail)
- **Bank + alerts (#448)** Today line, three alerts, `accounts:alerts` hourly. **Health score + DSO (#450)** H via
  `ClientHealth`, payment part = the report card. **TDS check (#449)**. **Mode label (#451)** on the Boss's book.
  **Docker OCR (#452)** the queue reads `pdf_processing`.
- **Import (#434, #436, #437)** sea + air import pages, houses inside the consol, arrival notice staged; triage reads import/export.
- **Jev prompt compacted (#438)**. **Tiers (#439)**. **Draft protocol (#440)**. **BL reading (#441)** `python/bill.py` → `BlReader.vue`.
- **Setu feed (#442)** read-only, ready for keys. **Payment report card (#443)**. **Airline commission/discounts (#444)**.
  **Bank upload file + guide (#445)**. **Accountant questions (#446)**. **End-to-end check (#447)**.

## Not measured yet — run on the Mac
- A real bill of lading through the BL reader (#441) — the AI server is now running; send back any field it misreads.
- Setu's request shapes against their sandbox (`app/Services/Bank/SetuAccountAggregator.php`, #442).

## Waiting on the owner
- BL / house / arrival notice / DO print layouts (#433, #434).
- ICEGATE developer-portal details (guide §12.3).
- CASS: a client's CASSLink billing files + the CASS agent output specification, and their iiNET SFTP/APIsec setup.
- Bank templates (HDFC, ICICI, Axis…) for bank-specific upload files.
- **FocusSea statuses (#425b)** — the owner will work on them with us.
- **Live database, before its first `php artisan migrate`:** record in `migrations` what live already has, read from the live schema (#460); and #421 (4)'s hand-run check of users whose company disagrees with their branch's.
- **Ops health weights** (`w[s]`, `w_cancel`, `w_corr`, `w_cass`, `w_decl`, `penalty_scale`) — the owner picks them after one quarter of real data in `customer_ops_quarters` (#456). ("Days slower" compares with the other clients only — owner, #457.)
- Production `.env`: `PORTAL_DOMAIN` / `PORTAL_SCHEME` only if the live site is not `https://…f16sefreight.com` (the default) — they make the staff reviews' "See the details" links (#457).
- A provider that can also PAY (RazorpayX, Cashfree Payouts, a bank's corporate API) — Setu only reads (#442).

## Open — noticed, not asked for (offer, don't start)
- JOBA-BASEBAS-26-0001/-0003 (joseph@'s test jobs from an internal sender): no client, and Joseph (pricing) as operator — reassign or cancel (#466).
- Not walked yet: the operator's AWB steps, accounts, FocusSea, the Boss and Sales views as real users (#466).

## Next (when the owner says go)
1. CASS importer — once the sample files above arrive.

Nothing else is ready to build: every other item waits on the owner above.

## On the Mac after pulling
```
php artisan migrate --force && DB_DATABASE=f16s_test php artisan migrate --force
php artisan db:seed --class='\FreightDemoSeeder' --force
php artisan db:seed --class='\BillingDemoSeeder' --force
php artisan help:load-bundled
npm run prod
```
- **Docker stops when the Mac sleeps** (it happened three times on 2026-10-04/05; a hung sign-in is the sign) — and can come back wedged: `docker info` says *"Docker Desktop is unable to start … backend time … context deadline exceeded"* and `compose up` fails on whichever image it reads first (*"unexpected end of JSON input"*). Quit Docker Desktop fully (`osascript -e 'quit app "Docker"'`; if `com.docker.backend` keeps the same PID, kill it — `com.docker.vmnetd` is root's and stays) and reopen it (`open -a Docker`); wait for `docker info` to show a server version, then `docker compose up -d`. The preview's workers may stay stuck on requests from before: sign in again, or restart the preview.
- **Docker (as before):** Start Docker Desktop, then `docker compose up -d` (web, queue, db, redis, soketi, ai-server, clamav). The ai-server mounts `./python`, so it runs the current code without a rebuild — it only has to be running. `curl` is not in the queue container; test reach with `php -r 'echo file_get_contents("http://ai-server:8000/health");'`.
- **The preview** (`.claude/launch.json` → `f16s`) serves on `:8099` with `php artisan serve`; the first requests after a start are slow (~20 s), so wait before signing in.
- **Portals:** accounts sign in at `accounts.localhost:8099`, the Boss at `admin.localhost:8099` (FocusAir refuses the Boss), operations/pricing/sales at `focusair.` / `focussea.`. Demo logins: `demo-*@demo.test`, `tact-*@demo.test`, `core@demo.test` — password `demo1234`.
- Locally, `.env` needs `PORTAL_DOMAIN=localhost:8099` and `PORTAL_SCHEME=http` for the staff reviews' links (#457).
- After seeding, `php artisan accounts:alerts` and `php artisan sales:compute-snapshots` fill the bell and the Sales page (the demo Boss sees *Northwind Traders slipped from A to C*, scores on Sales → Accounts, and the Q2 quarterly reviews; demo-sales sees theirs on Sales in FocusAir/FocusSea).
- `git pull` / `git push` can stall on SSH for minutes; run them with a time limit and check `git status -sb` after.
- Run `AccountsRegressionSeeder` + `accounts:verify` against the dev DB, never `DB_DATABASE=f16s_test` by hand — `AccountsRegressionTest` runs it there inside a transaction; by hand it commits and breaks other tests (#455).
- Two tests fail only because `config/common-data.php` is gitignored and absent (CargoStatusCodeTest, JobBoardLinksTest).
