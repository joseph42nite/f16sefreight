# Handoff — start a new session from here

Paste this into the new session:

> Continue F16s Freight OS (Laravel 9, Vue 2) on branch `feat/freight-os-schema-ldt65g`. Read `docs/plan/HANDOFF.md`,
> then the newest rows of `docs/plan/GAPS.md` (#436 onward), then `docs/plan/implementation_guide.md` Steps 11–12.
> Follow the standing rules in HANDOFF.md. Ask me before starting anything not listed under "Next".

## Standing rules (from the owner)
- Record every finding as a numbered row in `docs/plan/GAPS.md`. Read the root docs and `docs/plan/*` before each piece of work; if a doc disagrees with the code, say so.
- Laravel migrations only, run on BOTH databases: `php artisan migrate --force` and `DB_DATABASE=f16s_test php artisan migrate --force`; check down/up.
- Commit by explicit path, never `git add -A` (another session may work in this repo). Push when tests pass. End commit messages with the Co-Authored-By / Claude-Session lines.
- Never run two `php artisan test` at once; run test files one at a time. Every new test must be shown to fail on the old code.
- Secrets: the owner adds API keys to `.env`; only check whether a key is set, never print it.
- Never send real email (skip Send on client updates, Boss mails, "Ask the client").
- Don't make the code complicated. If unsure what a function should do, ask. Never invent spec content.
- Money: revenue/profit net of tax; a credit note subtracts, a debit note adds; drafts/voids never count; INR at each document's own rate; a NULL credit limit never blocks, 0.00 blocks; a figure nobody measures is NULL, never 0; check `$fillable`.
- Jev: only chooses among options PHP built; a person confirms every suggestion; asked once; rubric in `config/mail_intent.php` / `config/accounts_decisions.php` — bump the version on any wording change.

## Where we are (GAPS #436–#447, all pushed)
- **Import (#434, #436, #437):** sea + air import pages, houses made inside the consol, arrival notice staged for approval, mail triage reads import/export (lane first, Jev's `direction` otherwise).
- **Jev prompt compacted (#438):** ~830 (air) / ~910 (sea) tokens; direction not asked when the lane answers. ❓ Owner to run `php artisan mail:rubric-check` and `--mode=sea` on the Mac.
- **Tiers (#439):** Core = FocusAir/FocusSea documents, consol, search (every Core user writes); Tactical = inbox, Kanban, import, manifest filing; Command = accounts + cost sheet.
- **Draft protocol (#440):** one draft per conversation, a new one lands on top, the bell follows it; sea client mails (draft BL, booked with shipping line, delivered); air Booked attaches HAWBs.
- **Step 12.4 (#441):** read a BL/booking PDF into the sea bill (`python/bill.py`, `SeaBillReading`, `BlReader.vue`). ❓ Not measured on a real BL (no API key in the container).
- **Setu bank feed (#442):** read-only, per bank account, ready for keys (`SETU_AA_*`, `php artisan setu:status --ping`). ⚠️ Request shapes written from memory — confirm against Setu's sandbox (all in `app/Services/Bank/SetuAccountAggregator.php`).
- **Client payment report card (#443):** monthly grade A–D from due dates and receipts (`clients:payment-report`, `config/client_grades.php`); Jev reads a slipping client's mail; Clients & Partners → Pays / Payments.
- **Airline commission & discounts (#444):** statement lines keep freight / due carrier / commission / discount; a payment takes commission + discount off the transfer like TDS (4810 / 4820).
- **Bank upload file + guide (#445):** Money out → Bank file (CSV) and "How to pay this run from your bank"; `docs/help/paying-suppliers-from-your-bank.md`, loaded by `php artisan help:load-bundled`.
- **Accountant questions (#446):** GST on commission/incentives; incentive as income vs cost reduction; late rebates tied to statements.
- **End-to-end check (#447):** everything green except two tests needing the gitignored `config/common-data.php`.

## Waiting on the owner
- BL / house / arrival notice / DO print layouts (#433, #434); import party mapping (#434a).
- ICEGATE developer-portal details (guide §12.3).
- CASS: a client's CASSLink billing files + the CASS agent output specification, and their iiNET SFTP/APIsec setup (to build the CASS importer on the supplier-statement check).
- Bank templates (HDFC, ICICI, Axis…) for bank-specific upload files.
- Answers to #446; root-doc conflicts (#421, #435); FocusSea statuses (#425b).

## Next (when the owner says go)
1. "Connect your bank" onboarding step + alerts (bill due tomorrow unpaid, money arrived short, client slipped a grade).
2. CASS importer once sample files arrive.
3. Fill PRD §7.3.4 H composite health score using the payment card; DSO from receipt dates.

## On the Mac after pulling
```
php artisan migrate --force && DB_DATABASE=f16s_test php artisan migrate --force
php artisan db:seed --class='\FreightDemoSeeder' --force
php artisan db:seed --class='\BillingDemoSeeder' --force
php artisan help:load-bundled
npm run prod
```
Restart the Python OCR service (new `python/bill.py`). Demo logins: `demo-*@demo.test`, `tact-*@demo.test`, `core@demo.test` — password `demo1234`.
